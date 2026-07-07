import { defineComponent as G, ref as f, watch as T, computed as Z, openBlock as V, createElementBlock as N, Fragment as J, createElementVNode as o, createTextVNode as H, toDisplayString as g, createVNode as v, unref as t, withCtx as B, withModifiers as ie, withDirectives as se, vModelText as ue, reactive as ee, onMounted as ne, createBlock as L, createCommentVNode as D, normalizeStyle as re, onUnmounted as de, renderList as ce } from "vue";
import { t as s, _ as te, a as pe, b as ge, p as K, s as O, c as ve, d as fe, g as _, B as he } from "./index-Cc7tq2dP.mjs";
import { XIconCpnt as E, PopupModal as z, HeaderFooterPanel as X, CheckboxCpnt as oe, SelectSingle as Y } from "@x-plateform-mono/common";
const me = { class: "binding-value-property-render-item" }, be = { class: "animation-setting-section" }, ye = { style: { position: "relative", "min-height": "32px", display: "flex", "justify-content": "space-between" } }, Ce = ["innerHTML"], xe = { style: { width: "600px", height: "600px" } }, we = { class: "default-animation-rule-info" }, Ve = { class: "default-footer-content" }, ke = { style: { width: "560px", height: "480px", position: "relative" } }, $e = { style: { position: "absolute", inset: "0 12px" } }, Be = { style: { width: "640px", height: "704px", position: "relative" } }, Ie = /* @__PURE__ */ G({
  __name: "BindingExpressionRender",
  props: {
    label: {},
    value: {}
  },
  emits: ["changeValue"],
  setup(a, { emit: k }) {
    var r;
    const c = a, y = k, b = f(!1);
    T(() => b.value, (n) => {
      sessionStorage.setItem("graphic-editor-panel-status", `${n}`);
    });
    const C = Z(() => {
      var e, i;
      return "<p>" + (((i = (e = c.value) == null ? void 0 : e.expression) == null ? void 0 : i.replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll(" ", "&nbsp;").replaceAll(`
`, "</p><p>")) || "") + "</p>";
    }), A = [
      { name: "state1", label: s("状态1") },
      { name: "state2", label: s("状态2") },
      { name: "state3", label: s("状态3") },
      { name: "state4", label: s("状态4") },
      { name: "state5", label: s("状态5") }
    ], d = f(!1);
    T(() => d.value, (n) => {
      sessionStorage.setItem("graphic-editor-panel-status", `${n}`);
    });
    const p = f(!1);
    T(() => p.value, (n) => {
      sessionStorage.setItem("graphic-editor-panel-status", `${n}`);
    });
    const x = f(((r = c.value) == null ? void 0 : r.expression) || "");
    function h() {
      var n;
      x.value = ((n = c.value) == null ? void 0 : n.expression) || "", p.value = !0;
    }
    function P(n) {
      var e;
      y("changeValue", {
        expression: (e = c.value) == null ? void 0 : e.expression,
        animationConfig: n
      }), d.value = !1;
    }
    function $() {
      var n;
      y("changeValue", {
        expression: x.value,
        animationConfig: (n = c.value) == null ? void 0 : n.animationConfig
      }), p.value = !1;
    }
    return (n, e) => (V(), N(J, null, [
      o("div", me, [
        o("div", be, [
          o("span", null, [
            H(g(a.label) + " ", 1),
            v(t(E), {
              name: "unknownCircle",
              title: t(s)("表达式值对应状态设置"),
              size: 20,
              style: { margin: "8px 0", cursor: "pointer" },
              onClick: e[0] || (e[0] = (i) => b.value = !0)
            }, null, 8, ["title"])
          ]),
          v(t(E), {
            title: t(s)("点位值对应状态设置"),
            name: "film",
            size: 24,
            onClick: e[1] || (e[1] = (i) => d.value = !0),
            style: { cursor: "pointer" }
          }, null, 8, ["title"])
        ]),
        o("div", ye, [
          o("span", {
            class: "expression-content-section",
            style: { display: "inline-block", width: "85%", "word-break": "break-all" },
            innerHTML: C.value
          }, null, 8, Ce),
          o("button", {
            onClick: h,
            class: "btn-main",
            style: { position: "absolute", top: "4px", right: "0", height: "24px", "line-height": "24px" }
          }, g(t(s)("编辑")), 1)
        ])
      ]),
      v(t(z), { show: b.value }, {
        default: B(() => [
          o("div", xe, [
            v(t(X), {
              title: t(s)("表达式编辑说明"),
              closeBtn: !0,
              onClose: e[3] || (e[3] = (i) => b.value = !1)
            }, {
              footer: B(() => [
                o("div", Ve, [
                  o("button", {
                    class: "btn-main",
                    onClick: e[2] || (e[2] = (i) => b.value = !1)
                  }, g(t(s)("关闭")), 1)
                ])
              ]),
              default: B(() => [
                o("div", we, [
                  o("p", null, g(t(s)("1. 绑定点位初始值默认为0。")), 1),
                  o("p", null, g(t(s)("2. 表达式计算过程中发生错误时结果设置为-1。")), 1),
                  o("p", null, g(t(s)("3. 使用最后一个表达式作为值。")), 1)
                ])
              ]),
              _: 1
            }, 8, ["title"])
          ])
        ]),
        _: 1
      }, 8, ["show"]),
      v(t(z), { show: p.value }, {
        default: B(() => [
          o("div", ke, [
            v(t(X), {
              onKeydown: e[5] || (e[5] = ie(() => {
              }, ["stop"])),
              title: t(s)("表达式 - 计算结果为一个模拟量值"),
              closeBtn: !0,
              onClose: e[6] || (e[6] = (i) => p.value = !1),
              onCancel: e[7] || (e[7] = (i) => p.value = !1),
              onConfirm: $
            }, {
              default: B(() => [
                o("div", $e, [
                  se(o("textarea", {
                    style: { position: "absolute", left: "0", right: "0", top: "0", bottom: "0", border: "0", resize: "none", outline: "none" },
                    "onUpdate:modelValue": e[4] || (e[4] = (i) => x.value = i)
                  }, null, 512), [
                    [ue, x.value]
                  ])
                ])
              ]),
              _: 1
            }, 8, ["title"])
          ])
        ]),
        _: 1
      }, 8, ["show"]),
      v(t(z), { show: d.value }, {
        default: B(() => {
          var i;
          return [
            o("div", Be, [
              v(te, {
                animationStates: A,
                animationConf: (i = a.value) == null ? void 0 : i.animationConfig,
                onOnCancel: e[8] || (e[8] = (m) => d.value = !1),
                onOnConfirm: P
              }, null, 8, ["animationConf"])
            ])
          ];
        }),
        _: 1
      }, 8, ["show"])
    ], 64));
  }
}), Pe = "http://127.0.0.1:8080/api", Se = "http://" + window.location.hostname + ":9090/iot", _e = () => window.location.hostname === "localhost" ? Pe : Se, Q = pe.create({
  baseURL: _e(),
  // 从 .env 文件读取
  timeout: 1e4
});
Q.interceptors.request.use(
  (a) => a,
  (a) => Promise.reject(a)
);
Q.interceptors.response.use(
  (a) => Promise.resolve(a.data),
  (a) => Promise.reject(a)
);
const De = (a, k) => Q({
  url: a,
  method: "get",
  params: k
}), Ae = async () => {
  try {
    return await De("/devices/");
  } catch (a) {
    throw a;
  }
}, Ne = { style: { display: "flex", "align-items": "center" } }, Le = { style: { width: "50%" } }, Te = { class: "bind-data" }, Ee = { style: { display: "flex", "justify-content": "flex-start", "align-items": "center", "flex-direction": "column" } }, Me = { style: { flex: "1 1 0%", padding: "0 8px", "line-height": "32px" } }, Re = { style: { display: "flex", "justify-content": "flex-end", "align-items": "flex-start", gap: "20px" } }, qe = { style: { display: "flex", "align-items": "center", "flex-direction": "column", gap: "8px" } }, Oe = { style: { width: "640px", height: "704px", position: "relative" } }, ze = /* @__PURE__ */ G({
  __name: "BindingXplayRender",
  props: {
    label: {},
    value: {},
    id: {},
    checked: { type: Boolean },
    opt: {}
  },
  emits: ["changeValue", "changeCheck"],
  setup(a, { emit: k }) {
    const c = a, y = k, C = ee({ ...{ createBindingShape: !0, animationAvail: !1 }, ...c.opt }), A = f([]), d = f([]), p = f("");
    f(""), f("");
    const x = f(""), h = f(""), P = f([]), $ = Z(() => {
      var l, u;
      return ((u = (l = c.value) == null ? void 0 : l.bindingList) == null ? void 0 : u[0]) || null;
    });
    ne(() => {
      $.value && (console.info("currentBinding", $.value), p.value = $.value.pointRef.split(",")[0] || "", h.value = $.value.pointRef.split(",")[1] || "", x.value = $.value.pointName), r();
    });
    const r = async () => {
      try {
        const l = await Ae();
        if (l.count === 0) {
          console.warn("Non-OK response status:", l.status);
          return;
        }
        P.value = l.devices, A.value = l.devices.map((u) => ({
          label: u.name,
          value: u.asset
        }));
      } catch (l) {
        console.log("readDevices", l);
      }
    }, n = async (l) => {
      if (l)
        try {
          const u = P.value.find((w) => w.asset === l);
          if (!u) return;
          d.value = u.points.map((w) => ({
            label: w.name,
            value: w.name,
            unit: w.unit,
            description: w.description
          }));
        } catch (u) {
          console.log("readDevices", u);
        }
    }, e = () => {
      var l;
      p.value = "", h.value = "", x.value = "", d.value = [], y("changeValue", {
        bindingList: [],
        animationConfig: (l = c.value) == null ? void 0 : l.animationConfig
      });
    }, i = (l) => {
      p.value = l, h.value = "", x.value = "", d.value = [];
    }, m = (l) => {
      var q;
      h.value = l;
      const u = d.value.find(
        (j) => j.value === l
      );
      let w = (u == null ? void 0 : u.unit) || "", R = (u == null ? void 0 : u.description) || "";
      console.info("handlePointChange", p.value, l, w, R), y("changeValue", {
        bindingList: [
          {
            cpntId: U(),
            bindingType: "point",
            pointRef: p.value + "," + l + "," + R + "," + w,
            pointName: x.value,
            pointType: "Analog",
            valueType: "analog",
            range: {}
          }
        ],
        animationConfig: (q = c.value) == null ? void 0 : q.animationConfig
      });
    };
    T(p, (l) => {
      l && n(l);
    });
    let I = 0, M = 0;
    function U() {
      const l = Date.now();
      l === I ? M++ : (M = 0, I = l);
      const u = Math.floor(Math.random() * 1e3);
      return l * 1e3 + u + M;
    }
    function F() {
      var l;
      C.createBindingShape && !((l = c.opt) != null && l.disabled) && y("changeCheck");
    }
    const S = f(!1);
    function ae() {
      c.opt && c.opt.animationAvail && !c.opt.disabled && (S.value = !0);
    }
    function le(l) {
      var u;
      console.info("confirmAnimationConfig", l), y("changeValue", {
        bindingList: (u = c.value) == null ? void 0 : u.bindingList,
        animationConfig: l
      }), S.value = !1;
    }
    return T(
      () => S.value,
      (l) => {
        sessionStorage.setItem("graphic-editor-panel-status", `${l}`);
      }
    ), (l, u) => {
      var w, R, q, j;
      return V(), N(J, null, [
        o("div", Ne, [
          o("div", Le, [
            C.createBindingShape ? (V(), L(t(oe), {
              key: 0,
              label: t(s)("显示数值标签"),
              checked: a.checked,
              onChange: F,
              disabled: (w = a.opt) == null ? void 0 : w.disabled
            }, null, 8, ["label", "checked", "disabled"])) : D("", !0)
          ]),
          v(t(E), {
            name: "film",
            title: t(s)("点位值对应状态设置"),
            disabled: !C.animationAvail || !!((R = a.opt) != null && R.disabled),
            size: 24,
            style: re({
              cursor: !C.animationAvail || (q = a.opt) != null && q.disabled ? "default" : "pointer"
            }),
            onClick: ae
          }, null, 8, ["title", "disabled", "style"])
        ]),
        o("div", Te, [
          o("div", Ee, [
            o("span", Me, g(a.label), 1)
          ]),
          o("div", Re, [
            o("div", qe, [
              v(t(Y), {
                value: p.value,
                opts: A.value,
                appendToRoot: !0,
                placeholder: t(s)("请选择一个设备！"),
                onChange: i,
                class: "bind-data-item"
              }, null, 8, ["value", "opts", "placeholder"]),
              v(t(Y), {
                value: h.value,
                opts: d.value,
                appendToRoot: !0,
                placeholder: t(s)("请选择一个点位"),
                onChange: m,
                class: "bind-data-item"
              }, null, 8, ["value", "opts", "placeholder"])
            ]),
            v(t(E), {
              name: "delete",
              title: t(s)("清除绑定内容"),
              size: 24,
              style: { cursor: "pointer", "padding-top": "4px" },
              onClick: e
            }, null, 8, ["title"])
          ])
        ]),
        u[1] || (u[1] = o("div", { class: "bind-data" }, [
          o("span", { style: { flex: "1 1 0%", padding: "0 8px" } })
        ], -1)),
        (j = a.opt) != null && j.animationAvail ? (V(), L(t(z), {
          key: 0,
          show: S.value
        }, {
          default: B(() => {
            var W;
            return [
              o("div", Oe, [
                v(te, {
                  animationStates: a.opt.animationStates,
                  animationConf: (W = a.value) == null ? void 0 : W.animationConfig,
                  onOnCancel: u[0] || (u[0] = (Ye) => S.value = !1),
                  onOnConfirm: le
                }, null, 8, ["animationStates", "animationConf"])
              ])
            ];
          }),
          _: 1
        }, 8, ["show"])) : D("", !0)
      ], 64);
    };
  }
}), Ue = /* @__PURE__ */ ge(ze, [["__scopeId", "data-v-a3fe702d"]]), je = { class: "property-group-panel-title" }, Fe = { class: "label" }, Ke = {
  key: 0,
  class: "binding-property-display-all"
}, He = { style: { width: "600px", height: "600px" } }, Xe = { class: "default-animation-rule-info" }, Ge = { style: { "font-weight": "bold" } }, Je = { class: "default-animation-rule-info" }, Qe = { style: { "font-weight": "bold" } }, We = { class: "default-footer-content" }, tn = /* @__PURE__ */ G({
  __name: "PropertyGroupBinding",
  props: {
    group: {},
    optionValues: {},
    updateValue: { type: Function }
  },
  setup(a) {
    const k = a, c = f(!1), y = f(!1), b = ee(/* @__PURE__ */ new Map()), C = f(!1);
    T(() => C.value, (r) => {
      sessionStorage.setItem("graphic-editor-panel-status", `${r}`);
    });
    function A() {
      y.value ? h.forEach((r) => p(r)) : h.forEach((r) => {
        const n = r.name;
        b.get(n) || p(r);
      });
    }
    let d = [];
    function p(r) {
      const n = r.name, e = !!b.get(n), i = _.activeItem;
      if (e) {
        const m = d.filter((I) => I.options.propName === n)[0];
        i.off("updateValueBinding." + n), _.removeItem(m);
      } else {
        const m = new he({
          parentUqId: k.optionValues.uqId,
          propName: n,
          propLabel: r.label
        });
        m.postConstruct(), _.addItem(m);
        const I = m.options.uqId, M = i.addChildrenBinding(I), U = i.getShapeTopLeft(), F = { x: U.x, y: U.y - (M + 1) * 36 };
        m.set("center", F), m.set("bindingValue", i.options[n]), i.on("updateValueBinding." + n, (S) => {
          m.set("bindingValue", S);
        });
      }
      d = $(k.optionValues.uqId), y.value = h.length === d.length, b.set(n, !b.get(n));
    }
    function x(r) {
      const n = r.name, e = !!b.get(n), i = _.activeItem;
      if (e) {
        const m = d.filter((I) => I.options.propName === n)[0];
        i.off("updateValueBinding." + n), _.removeItem(m);
      }
      P();
    }
    let h = [];
    function P() {
      if (h = k.group.items.filter((n) => {
        const e = n.type === O.bindingValue, i = n.opt && n.opt.createBindingShape !== void 0 && !n.opt.createBindingShape, m = n.opt && n.opt.disabled;
        return e && !i && !m;
      }), h.length === 0)
        return;
      c.value = h.length > 1, d = $(k.optionValues.uqId);
      const r = _.activeItem;
      r && (d.forEach((n) => {
        const e = n.options.propName;
        b.set(e, !0), r.off("updateValueBinding." + e), r.on("updateValueBinding." + e, (i) => {
          n.set("bindingValue", i);
        });
      }), y.value = h.length === d.length);
    }
    ne(() => {
      P(), K.on("bindingPropertyToggleDisable", x), console.log(k.group);
    }), de(() => {
      K.off("bindingPropertyToggleDisable", x);
    });
    function $(r) {
      return _.currLayer.findBindingItems(r);
    }
    return (r, n) => (V(), N("div", null, [
      o("div", je, [
        o("span", Fe, g(a.group.group), 1),
        v(t(E), {
          name: "unknownCircle",
          size: 24,
          title: t(s)("默认状态匹配规则说明"),
          style: { cursor: "pointer" },
          onClick: n[0] || (n[0] = (e) => C.value = !0)
        }, null, 8, ["title"])
      ]),
      c.value ? (V(), N("div", Ke, [
        v(t(oe), {
          label: t(s)("显示所有可用属性"),
          checked: y.value,
          onChange: A
        }, null, 8, ["label", "checked"])
      ])) : D("", !0),
      (V(!0), N(J, null, ce(a.group.items, (e) => (V(), N("div", null, [
        e.type === t(O).bindingValue ? (V(), L(Ue, {
          key: 0,
          label: e.label,
          value: a.optionValues[e.name],
          id: a.optionValues.id,
          opt: { ...e.opt, lastBindingManager: t(K) },
          onChangeValue: (i) => {
            a.updateValue(e.name, i);
          },
          checked: b.get(e.name),
          onChangeCheck: (i) => p(e)
        }, null, 8, ["label", "value", "id", "opt", "onChangeValue", "checked", "onChangeCheck"])) : D("", !0),
        e.type === t(O).customBinding ? (V(), L(ve, {
          key: 1,
          label: e.label,
          value: a.optionValues[e.name],
          opt: e.opt,
          onChangeValue: (i) => {
            a.updateValue(e.name, i);
          }
        }, null, 8, ["label", "value", "opt", "onChangeValue"])) : D("", !0),
        e.type === t(O).bindingPopup ? (V(), L(fe, {
          key: 2,
          label: e.label,
          value: a.optionValues[e.name],
          onChangeValue: (i) => {
            a.updateValue(e.name, i);
          }
        }, null, 8, ["label", "value", "onChangeValue"])) : D("", !0),
        e.type === t(O).bindingExpression ? (V(), L(Ie, {
          key: 3,
          label: e.label,
          value: a.optionValues[e.name],
          onChangeValue: (i) => {
            a.updateValue(e.name, i);
          }
        }, null, 8, ["label", "value", "onChangeValue"])) : D("", !0)
      ]))), 256)),
      v(t(z), { show: C.value }, {
        default: B(() => [
          o("div", He, [
            v(t(X), {
              title: t(s)("绑定说明"),
              closeBtn: !0,
              onClose: n[2] || (n[2] = (e) => C.value = !1)
            }, {
              footer: B(() => [
                o("div", We, [
                  o("button", {
                    class: "btn-main",
                    onClick: n[1] || (n[1] = (e) => C.value = !1)
                  }, g(t(s)("关闭")), 1)
                ])
              ]),
              default: B(() => [
                o("div", Xe, [
                  o("p", Ge, g(t(s)("数据绑定优先级")), 1),
                  o("p", null, [
                    H(g(t(s)("导航目标绑定")) + " ", 1),
                    v(t(E), {
                      name: "arrowDown",
                      style: { transform: "rotate(-90deg)", "text-indent": "0" },
                      size: 16
                    }),
                    H(" " + g(t(s)("点位绑定")) + "。 ", 1)
                  ])
                ]),
                o("div", Je, [
                  o("p", Qe, g(t(s)("默认状态匹配规则")), 1),
                  o("p", null, g(t(s)("1. 未配置默认状态时，图形的第一个状态为默认状态。")), 1),
                  o("p", null, g(t(s)("2. 当没有绑定点位或点位没有值时，图形显示默认状态。")), 1),
                  o("p", null, g(t(s)("3. 当绑定点位为开关量时，点位值为0，显示图形的第一个状态；点位值为1，显示图形的第二个状态。")), 1),
                  o("p", null, g(t(s)("4. 当绑定点位为状态量时，点位值为1，显示图形的第一个状态；点位值为2，显示图形的第二个状态，以此类推。")), 1),
                  o("p", null, g(t(s)("5. 当绑定点位为模拟量时，设图形状态总数为N，当点位值为0，显示图形的第一个状态；100除以该图形剩余的状态数，得到N-1个区间；当点位值处于第K个区间时，显示图形的第K+1个状态。")), 1)
                ])
              ]),
              _: 1
            }, 8, ["title"])
          ])
        ]),
        _: 1
      }, 8, ["show"])
    ]));
  }
});
export {
  tn as default
};
