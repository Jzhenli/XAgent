# armv7l 自愈式 wheelhouse 构建方案

> **状态**：提案，暂缓实施（2026-09-24 评审通过设计，待需要时按下文实施清单执行）
> **涉及文件**：`.github/workflows/build-linux.yml`
> **前置背景**：该 workflow 已包含 armv7l glibc 断言（现为 L142-152，扫描 bundle 内全部 `.so` 的 GLIBC 符号 ≤ 2.31），本方案实施后该断言保留，角色变为 wheelhouse 入库质检 + 最终兜底。

## 1. 问题背景

### 1.1 目标环境（不可变更的现实）

- 大量工控板为 **armv7l**，系统 **Ubuntu 20.04（glibc 2.31）**，无法升级
- 因此构建基线与 `manylinux_2_31` 容器（Ubuntu 20.04 基底）**完全重合**，glibc 天花板永久锁死 2.31

### 1.2 为什么 PyPI 没有 armv7l wheel

1. 云厂商无 32-bit ARM 算力（AWS/Azure/GCP ARM 实例全是 aarch64），armv7l 只能 QEMU 模拟编译，维护者缺乏低成本产出途径
2. 新 manylinux 策略基底（AlmaLinux 8/9/10）不支持 armhf → armv7l 的 manylinux 永久封顶 `2_31`
3. 32 位 ARM Python 用户基数小，Rust 系扩展 armv7 target 摩擦大，投入产出比低

### 1.3 piwheels 的坑（现状方案）

当前 workflow 用 `PIP_EXTRA_INDEX_URL=piwheels` 提速 + `PIP_NO_BINARY=cffi` 压制 cffi 预编译 wheel：

- piwheels 构建机随 Raspberry Pi OS 升级（现 = bookworm，glibc 2.36），**基线随时间漂移**
- wheel 标签 `linux_armv7l` **不含任何 glibc 承诺**，pip 无法识别漂移
- 目前靠点名 cffi 防御 + 全量 .so 断言兜底，但防御面依赖"点名"的完整性

**结论：piwheels 不可救药**——它的基线永远会漂离锁死的 2.31，只是时间问题。

## 2. 方案选型

| 方案 | 结论 | 原因 |
|---|---|---|
| 板子换 64 位系统 | ❌ 不可行 | 工控板硬件/系统锁死 |
| 板端 OS 升 bookworm | ❌ 不可行 | 同上 |
| piwheels（现状） | ❌ 长期不靠谱 | 基线漂移 + 标签零契约 |
| actions/cache 隐式缓存 | ❌ 不够 | **7 天不访问自动删除** + 10GB LRU；工控产品发版间隔常超 7 天，每次发版重新冷编译 |
| upload-artifact | ❌ 不够 | 保留期最长 90 天 |
| 自建 armv7 原生 runner | ❌ 不选 | 引入硬件运维，CI 增加不稳定源 |
| **自愈式 wheelhouse → GitHub Release 资产** | ✅ **采用** | Release 资产无保留期；构建自维护，无独立 workflow |

**核心洞察**：依赖树里真正需要预编译的只有 5 个包——`cryptography`（Rust，经 xknx 传入）、`cffi`、`pydantic_core`（Rust）、`psutil`、`pyyaml`（C），其余均为纯 Python。wheelhouse 规模可控（tarball 预计 <30MB），冷编译痛苦集中在两个 Rust 包。

## 3. 设计详解

### 3.1 本质

把"QEMU 里编译出来的 wheel"从一次性副产品升格为**持久资产**：

- **存哪**：GitHub Release（固定 tag `wheelhouse-armv7l`）+ 资产 `wheels.tar.gz`，每次 `--clobber` 覆盖
- **怎么用**：`PIP_FIND_LINKS` 指向解包目录，pip 将其作为本地 wheel 源
- **谁维护**：构建流程自身——每次成功构建把 wheel 回传，无独立维护 workflow

### 3.2 生命周期状态机（四种状态全部自愈）

| 状态 | 发生什么 | 自愈动作 |
|---|---|---|
| **首次**（release 不存在） | 下载失败 → PyPI sdist 全量编译 | 编译产物回传，release 诞生 |
| **热命中**（依赖不变） | pip 对每个包直接用本地 wheel | 回传幂等覆盖，内容不变 |
| **依赖升级** | wheelhouse 缺新版本 → 只编译缺的包 | 新 wheel 回传，追平 pyproject |
| **资产损坏/误删** | tar 解包失败 → 按冷启动处理 | 全量重编后回传 |

### 3.3 数据流

```
构建开始
   │
   ▼
尝试 gh release download wheelhouse-armv7l → 解包到 wheelhouse/
   │有                          │无/损坏
   ▼                            ▼
PIP_FIND_LINKS 引用          冷路径（PyPI sdist）
   │                            │
   ▼                            ▼
容器内预热: pip wheel -r <pyproject 依赖闭包> -w /work/wheelhouse
（缺的编译，有的直接复用；此步后 pyapp 的 pip 安装变为纯解包）
   │
   ▼
pyapp build → 【glibc 断言】→ pyapp compile/package
   │（容器脚本任何失败 → 下方回传被跳过，坏产物不入库）
   ▼
宿主: tar 打包 wheelhouse/ → gh release upload --clobber
   │
   ▼
下一次构建起永久热启动
```

### 3.4 关键设计决策

1. **回灌用 `PIP_FIND_LINKS` 而非 `PIP_NO_INDEX`**
   NO_INDEX 会让 wheelhouse 落后时构建直接失败；FIND_LINKS 保留 PyPI 兜底，自愈路径依赖索引可用。

2. **回传只在 docker run 成功后执行**
   glibc 断言在容器内、回传在宿主侧且位于其后。断言拦截 → 容器非零退出 → 回传步骤跳过 → **坏 wheel 永远进不了 wheelhouse**。断言即入库质检。

3. **依赖闭包从 pyproject 提取（项目无 Python 锁文件）**
   pyproject.toml 依赖为范围声明（`>=`/`==`），无 uv.lock/requirements.lock。用 tomllib 读取 `project.dependencies` 生成临时 requirements。

4. **权限模型**
   workflow 全局保持 `contents: read`，仅 build job 临时提 `contents: write`。本 workflow 仅由 tag push 和 workflow_dispatch 触发（无 PR 触发面），无 fork 注入风险。

5. **aarch64 不参与**
   原生 runner 编译快 + PyPI 有 manylinux_2_28 wheel，无需 wheelhouse。

## 4. 实施清单（对 build-linux.yml 的精确改动）

### 4.1 build job 加权限

```yaml
  build:
    needs: config
    permissions:
      contents: write   # 仅用于回传 wheelhouse release 资产
```

### 4.2 docker run 之前：恢复 wheelhouse（新增 step）

```yaml
      - name: Restore wheelhouse (armv7l)
        if: matrix.arch == 'armv7l'
        env:
          GH_TOKEN: ${{ github.token }}
        run: |
          mkdir -p wheelhouse
          gh release download wheelhouse-armv7l -R "$GITHUB_REPOSITORY" \
            -p 'wheels.tar.gz' -O - 2>/dev/null | tar xz \
            || echo "::warning::no wheelhouse yet, cold build expected"
```

### 4.3 docker run 参数：注入 FIND_LINKS

```bash
          docker run --rm -i \
            ...
            -e PIP_FIND_LINKS=/work/wheelhouse \
            -v "$GITHUB_WORKSPACE":/work -w /work \
```

### 4.4 容器脚本 step 2：删除 piwheels 块

```bash
            # 删除以下整块（PIP_NO_BINARY 的唯一使命是压 piwheels 坏 wheel，无 piwheels 后为死代码）：
            # if [[ "$ARCH" == "armv7l" ]]; then
            #   export PIP_EXTRA_INDEX_URL="https://www.piwheels.org/simple"
            #   export PIP_NO_BINARY=cffi
            # fi
```

### 4.5 容器脚本 step 3 之前：wheelhouse 预热（新增）

```bash
            # 3. armv7l: wheelhouse 预热——缺的包在此编译（QEMU 冷编译集中在这里，一次性）
            if [[ "$ARCH" == "armv7l" ]]; then
              "$PY" - <<'EOF' > /tmp/wheelhouse-reqs.txt
              import tomllib
              with open("pyproject.toml", "rb") as f:
                  deps = tomllib.load(f)["project"]["dependencies"]
              print("\n".join(deps))
              EOF
              "$PY" -m pip wheel -r /tmp/wheelhouse-reqs.txt \
                -w /work/wheelhouse --prefer-binary
              ls /work/wheelhouse | wc -l
            fi
```

注意：step 编号顺延（原 3/4/5/6 → 4/5/6/7）。

### 4.6 docker run 之后：回传固化（新增 step）

```yaml
      - name: Persist wheelhouse (armv7l)
        if: matrix.arch == 'armv7l'
        env:
          GH_TOKEN: ${{ github.token }}
        run: |
          tar czf wheels.tar.gz -C "$GITHUB_WORKSPACE" wheelhouse
          gh release upload wheelhouse-armv7l wheels.tar.gz --clobber -R "$GITHUB_REPOSITORY" \
            || gh release create wheelhouse-armv7l wheels.tar.gz \
                 -R "$GITHUB_REPOSITORY" --title "armv7l wheelhouse" \
                 --notes "Auto-managed. Delete wheels.tar.gz to force cold rebuild."
        # 此 step 排在 Build step 之后：Build 失败（含 glibc 断言拦截）时自动跳过，
        # 保证坏 wheel 不入库——这是 wheelhouse 与断言的正确时序关系，不可调换。
```

### 4.7 glibc 断言（现 L142-152）

**原样保留，不改。**

## 5. 边界与已知取舍

1. **无锁文件的版本漂移**：范围声明可能导致某次构建解析出更新版本 → wheelhouse 未命中 → 增量编译 → 回传追平。自愈循环顺带吸收漂移；完全可复现构建建议将来引入 `uv lock`（独立决策，不阻塞本方案）。
2. **并发覆盖竞态**：跨 ref 并发构建会 `--clobber` 互相覆盖，最后写入者赢，下一轮自愈；workflow 已有按 ref 的 concurrency 取消，风险可忽略。
3. **wheelhouse 投毒（极端场景）**：wheel 全部产自 2.31 工具链，理论不会坏；仅手工误传可能引入坏 wheel。症状：断言反复失败且热启动复现。**应急处置**：删除 release 上的 `wheels.tar.gz` 资产 → 下次构建自动冷重建。
4. **冷编译耗时**：cryptography + pydantic_core 的 Rust 在 QEMU armv7 下预估 30-90 分钟，在 180 分钟 timeout 内，且每个依赖版本只发生一次。若实测逼近超时，可将预热步骤拆为独立可重试 job（预留演进口）。
5. **pyapp 内部 pip 是否吃 FIND_LINKS**：pip 原生读取 `PIP_FIND_LINKS` 环境变量，pyapp shell out 到 pip 会继承；实施时以容器日志确认（预热步骤后 pyapp 阶段不应出现编译输出）。

## 6. 验收计划（实施后执行）

1. **冷启动验证**：手动 `workflow_dispatch` 跑 armv7l → 确认无 release 时走 sdist 编译、构建成功后 `wheelhouse-armv7l` release 诞生、断言日志 `glibc assert passed`
2. **热命中验证**：再次构建 → Restore 步骤解包成功、预热步骤几乎无编译输出、总耗时显著下降
3. **增量验证**：升级某个依赖版本（如 psutil）→ 仅该包重编 → tarball 更新
4. **负路径验证**：临时删除 release 资产 → 自动回退冷路径重建

## 7. 实施后的最终形态对比

| 维度 | piwheels 现状 | wheelhouse 方案 |
|---|---|---|
| glibc 基线 | 第三方构建机，随时间漂移 | 自有工具链，锁死 2.31 |
| 标签契约 | `linux_armv7l` 零承诺 | 编译环境 = 目标环境，结构性保证 |
| 外部依赖 | PyPI + piwheels | 仅 PyPI（sdist 兜底）+ 自己的 Release |
| 热构建速度 | 分钟级（赌基线） | 分钟级（纯解包） |
| 维护成本 | 点名防御 + 断言兜底 | 零维护（自愈） |
