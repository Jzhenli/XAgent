import { defineComponent as j, ref as y, watch as A, computed as G, openBlock as w, createElementBlock as N, Fragment as H, createElementVNode as t, createTextVNode as F, toDisplayString as c, createVNode as g, unref as n, withCtx as V, withModifiers as le, withDirectives as ae, vModelText as se, reactive as J, onMounted as Q, createBlock as z, createCommentVNode as E, normalizeStyle as ue, onUnmounted as de, renderList as re } from "vue";
import { t as l, _ as W, a as pe, p as q, s as U, g as P, B as ce } from "./index-BzYccUqU.mjs";
import { XIconCpnt as T, PopupModal as M, HeaderFooterPanel as K, CheckboxCpnt as Y, SelectSingle as X } from "@x-plateform-mono/common";
import { g as ge } from "./http-Dp9t8gnt.mjs";
const fe = { class: "binding-value-property-render-item" }, ve = { class: "animation-setting-section" }, me = { style: { position: "relative", "min-height": "32px", display: "flex", "justify-content": "space-between" } }, he = ["innerHTML"], ye = { style: { width: "600px", height: "600px" } }, be = { class: "default-animation-rule-info" }, Ce = { class: "default-footer-content" }, xe = { style: { width: "560px", height: "480px", position: "relative" } }, we = { style: { position: "absolute", inset: "0 12px" } }, Ve = { style: { width: "640px", height: "704px", position: "relative" } }, ke = /* @__PURE__ */ j({
  __name: "BindingExpressionRender",
  props: {
    label: {},
    value: {}
  },
  emits: ["changeValue"],
  setup(s, { emit: B }) {
    const r = s, C = B, h = y(!1);
    A(() => h.value, (a) => {
      sessionStorage.setItem("graphic-editor-panel-status", `${a}`);
    });
    const x = G(() => "<p>" + (r.value?.expression?.replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll(" ", "&nbsp;").replaceAll(`
`, "</p><p>") || "") + "</p>"), D = [
      { name: "state1", label: l("状态1") },
      { name: "state2", label: l("状态2") },
      { name: "state3", label: l("状态3") },
      { name: "state4", label: l("状态4") },
      { name: "state5", label: l("状态5") }
    ], u = y(!1);
    A(() => u.value, (a) => {
      sessionStorage.setItem("graphic-editor-panel-status", `${a}`);
    });
    const d = y(!1);
    A(() => d.value, (a) => {
      sessionStorage.setItem("graphic-editor-panel-status", `${a}`);
    });
    const b = y(r.value?.expression || "");
    function v() {
      b.value = r.value?.expression || "", d.value = !0;
    }
    function _(a) {
      C("changeValue", {
        expression: r.value?.expression,
        animationConfig: a
      }), u.value = !1;
    }
    function k() {
      C("changeValue", {
        expression: b.value,
        animationConfig: r.value?.animationConfig
      }), d.value = !1;
    }
    return (a, e) => (w(), N(H, null, [
      t("div", fe, [
        t("div", ve, [
          t("span", null, [
            F(c(s.label) + " ", 1),
            g(n(T), {
              name: "unknownCircle",
              title: n(l)("表达式值对应状态设置"),
              size: 20,
              style: { margin: "8px 0", cursor: "pointer" },
              onClick: e[0] || (e[0] = (i) => h.value = !0)
            }, null, 8, ["title"])
          ]),
          g(n(T), {
            title: n(l)("点位值对应状态设置"),
            name: "film",
            size: 24,
            onClick: e[1] || (e[1] = (i) => u.value = !0),
            style: { cursor: "pointer" }
          }, null, 8, ["title"])
        ]),
        t("div", me, [
          t("span", {
            class: "expression-content-section",
            style: { display: "inline-block", width: "85%", "word-break": "break-all" },
            innerHTML: x.value
          }, null, 8, he),
          t("button", {
            onClick: v,
            class: "btn-main",
            style: { position: "absolute", top: "4px", right: "0", height: "24px", "line-height": "24px" }
          }, c(n(l)("编辑")), 1)
        ])
      ]),
      g(n(M), { show: h.value }, {
        default: V(() => [
          t("div", ye, [
            g(n(K), {
              title: n(l)("表达式编辑说明"),
              closeBtn: !0,
              onClose: e[3] || (e[3] = (i) => h.value = !1)
            }, {
              footer: V(() => [
                t("div", Ce, [
                  t("button", {
                    class: "btn-main",
                    onClick: e[2] || (e[2] = (i) => h.value = !1)
                  }, c(n(l)("关闭")), 1)
                ])
              ]),
              default: V(() => [
                t("div", be, [
                  t("p", null, c(n(l)("1. 绑定点位初始值默认为0。")), 1),
                  t("p", null, c(n(l)("2. 表达式计算过程中发生错误时结果设置为-1。")), 1),
                  t("p", null, c(n(l)("3. 使用最后一个表达式作为值。")), 1)
                ])
              ]),
              _: 1
            }, 8, ["title"])
          ])
        ]),
        _: 1
      }, 8, ["show"]),
      g(n(M), { show: d.value }, {
        default: V(() => [
          t("div", xe, [
            g(n(K), {
              onKeydown: e[5] || (e[5] = le(() => {
              }, ["stop"])),
              title: n(l)("表达式 - 计算结果为一个模拟量值"),
              closeBtn: !0,
              onClose: e[6] || (e[6] = (i) => d.value = !1),
              onCancel: e[7] || (e[7] = (i) => d.value = !1),
              onConfirm: k
            }, {
              default: V(() => [
                t("div", we, [
                  ae(t("textarea", {
                    style: { position: "absolute", left: "0", right: "0", top: "0", bottom: "0", border: "0", resize: "none", outline: "none" },
                    "onUpdate:modelValue": e[4] || (e[4] = (i) => b.value = i)
                  }, null, 512), [
                    [se, b.value]
                  ])
                ])
              ]),
              _: 1
            }, 8, ["title"])
          ])
        ]),
        _: 1
      }, 8, ["show"]),
      g(n(M), { show: u.value }, {
        default: V(() => [
          t("div", Ve, [
            g(W, {
              animationStates: D,
              animationConf: s.value?.animationConfig,
              onOnCancel: e[8] || (e[8] = (i) => u.value = !1),
              onOnConfirm: _
            }, null, 8, ["animationConf"])
          ])
        ]),
        _: 1
      }, 8, ["show"])
    ], 64));
  }
}), $e = { style: { display: "flex", "align-items": "center" } }, Be = { style: { width: "50%" } }, Ie = { class: "bind-data" }, _e = { style: { display: "flex", "justify-content": "flex-start", "align-items": "center", "flex-direction": "column" } }, Se = { style: { flex: "1 1 0%", padding: "0 8px", "line-height": "32px" } }, Pe = { style: { display: "flex", "justify-content": "flex-end", "align-items": "flex-start", gap: "20px" } }, Ae = { style: { display: "flex", "align-items": "center", "flex-direction": "column", gap: "8px" } }, De = { style: { width: "640px", height: "704px", position: "relative" } }, Ne = /* @__PURE__ */ j({
  __name: "BindingXplayRender",
  props: {
    label: {},
    value: {},
    id: {},
    checked: { type: Boolean },
    opt: {}
  },
  emits: ["changeValue", "changeCheck"],
  setup(s, { emit: B }) {
    const r = s, C = B, x = J({ ...{ createBindingShape: !0, animationAvail: !1 }, ...r.opt }), D = y([]), u = y([]), d = y(""), b = y(""), v = y(""), _ = y([]), k = G(() => r.value?.bindingList?.[0] || null);
    Q(async () => {
      if (k.value) {
        console.info("currentBinding", k.value);
        const o = k.value.pointRef.split(",");
        d.value = o[0] || "", v.value = o[1] || "", b.value = k.value.pointName;
      }
      await a(), d.value && e(d.value);
    });
    const a = async () => {
      try {
        const o = await ge();
        if (o.count === 0) {
          console.warn("Non-OK response status:", o.status);
          return;
        }
        _.value = o.devices, D.value = o.devices.map((f) => ({
          label: f.name,
          value: f.asset
        }));
      } catch (o) {
        console.log("readDevices", o);
      }
    }, e = async (o) => {
      if (!o) return;
      const f = _.value.find(($) => $.asset === o);
      f && (u.value = f.points.map(($) => ({
        label: $.name,
        value: $.name,
        unit: $.unit,
        description: $.description,
        device_type: f.plugin.name
      })));
    }, i = () => {
      d.value = "", v.value = "", b.value = "", u.value = [], C("changeValue", {
        bindingList: [],
        animationConfig: r.value?.animationConfig
      });
    }, p = (o) => {
      d.value = o, v.value = "", b.value = "", u.value = [];
    }, m = (o) => {
      v.value = o, b.value = o;
      const f = u.value.find(
        (oe) => oe.value === o
      );
      let $ = f?.unit || "", ne = f?.description || "", te = f?.device_type || "", ie = {
        cpntId: O(),
        bindingType: "point",
        pointRef: d.value + "," + o + "," + te + "," + $ + "," + ne,
        pointName: b.value,
        pointType: "Analog",
        valueType: "analog",
        range: {}
      };
      C("changeValue", {
        bindingList: [ie],
        animationConfig: r.value?.animationConfig
      });
    };
    A(
      d,
      (o) => {
        console.log("deviceID changed", o), o && e(o);
      },
      { immediate: !0 }
    ), A(v, (o) => {
      m(o);
    });
    let I = 0, L = 0;
    function O() {
      const o = Date.now();
      o === I ? L++ : (L = 0, I = o);
      const f = Math.floor(Math.random() * 1e3);
      return o * 1e3 + f + L;
    }
    function R() {
      x.createBindingShape && !r.opt?.disabled && C("changeCheck");
    }
    const S = y(!1);
    function Z() {
      r.opt && r.opt.animationAvail && !r.opt.disabled && (S.value = !0);
    }
    function ee(o) {
      console.info("confirmAnimationConfig", o), C("changeValue", {
        bindingList: r.value?.bindingList,
        animationConfig: o
      }), S.value = !1;
    }
    return A(
      () => S.value,
      (o) => {
        sessionStorage.setItem("graphic-editor-panel-status", `${o}`);
      }
    ), (o, f) => (w(), N(H, null, [
      t("div", $e, [
        t("div", Be, [
          x.createBindingShape ? (w(), z(n(Y), {
            key: 0,
            label: n(l)("显示数值标签"),
            checked: s.checked,
            onChange: R,
            disabled: s.opt?.disabled
          }, null, 8, ["label", "checked", "disabled"])) : E("", !0)
        ]),
        g(n(T), {
          name: "film",
          title: n(l)("点位值对应状态设置"),
          disabled: !x.animationAvail || !!s.opt?.disabled,
          size: 24,
          style: ue({
            cursor: !x.animationAvail || s.opt?.disabled ? "default" : "pointer"
          }),
          onClick: Z
        }, null, 8, ["title", "disabled", "style"])
      ]),
      t("div", Ie, [
        t("div", _e, [
          t("span", Se, c(s.label), 1)
        ]),
        t("div", Pe, [
          t("div", Ae, [
            g(n(X), {
              value: d.value,
              opts: D.value,
              appendToRoot: !0,
              placeholder: n(l)("请选择一个设备！"),
              onChange: p,
              class: "bind-data-item"
            }, null, 8, ["value", "opts", "placeholder"]),
            g(n(X), {
              value: v.value,
              opts: u.value,
              appendToRoot: !0,
              placeholder: n(l)("请选择一个点位"),
              onChange: m,
              class: "bind-data-item"
            }, null, 8, ["value", "opts", "placeholder"])
          ]),
          g(n(T), {
            name: "delete",
            title: n(l)("清除绑定内容"),
            size: 24,
            style: { cursor: "pointer", "padding-top": "4px" },
            onClick: i
          }, null, 8, ["title"])
        ])
      ]),
      f[1] || (f[1] = t("div", { class: "bind-data" }, [
        t("span", { style: { flex: "1 1 0%", padding: "0 8px" } })
      ], -1)),
      s.opt?.animationAvail ? (w(), z(n(M), {
        key: 0,
        show: S.value
      }, {
        default: V(() => [
          t("div", De, [
            g(W, {
              animationStates: s.opt.animationStates,
              animationConf: s.value?.animationConfig,
              onOnCancel: f[0] || (f[0] = ($) => S.value = !1),
              onOnConfirm: ee
            }, null, 8, ["animationStates", "animationConf"])
          ])
        ]),
        _: 1
      }, 8, ["show"])) : E("", !0)
    ], 64));
  }
}), Te = /* @__PURE__ */ pe(Ne, [["__scopeId", "data-v-ebba1642"]]), Le = { class: "property-group-panel-title" }, Ee = { class: "label" }, Me = {
  key: 0,
  class: "binding-property-display-all"
}, Oe = { style: { width: "600px", height: "600px" } }, ze = { class: "default-animation-rule-info" }, Re = { style: { "font-weight": "bold" } }, qe = { class: "default-animation-rule-info" }, Ue = { style: { "font-weight": "bold" } }, Fe = { class: "default-footer-content" }, Ge = /* @__PURE__ */ j({
  __name: "PropertyGroupBinding",
  props: {
    group: {},
    optionValues: {},
    updateValue: { type: Function }
  },
  setup(s) {
    const B = s, r = y(!1), C = y(!1), h = J(/* @__PURE__ */ new Map()), x = y(!1);
    A(() => x.value, (a) => {
      sessionStorage.setItem("graphic-editor-panel-status", `${a}`);
    });
    function D() {
      C.value ? v.forEach((a) => d(a)) : v.forEach((a) => {
        const e = a.name;
        h.get(e) || d(a);
      });
    }
    let u = [];
    function d(a) {
      const e = a.name, i = !!h.get(e), p = P.activeItem;
      if (i) {
        const m = u.filter((I) => I.options.propName === e)[0];
        p.off("updateValueBinding." + e), P.removeItem(m);
      } else {
        const m = new ce({
          parentUqId: B.optionValues.uqId,
          propName: e,
          propLabel: a.label
        });
        m.postConstruct(), P.addItem(m);
        const I = m.options.uqId, L = p.addChildrenBinding(I), O = p.getShapeTopLeft(), R = { x: O.x, y: O.y - (L + 1) * 36 };
        m.set("center", R), m.set("bindingValue", p.options[e]), p.on("updateValueBinding." + e, (S) => {
          m.set("bindingValue", S);
        });
      }
      u = k(B.optionValues.uqId), C.value = v.length === u.length, h.set(e, !h.get(e));
    }
    function b(a) {
      const e = a.name, i = !!h.get(e), p = P.activeItem;
      if (i) {
        const m = u.filter((I) => I.options.propName === e)[0];
        p.off("updateValueBinding." + e), P.removeItem(m);
      }
      _();
    }
    let v = [];
    function _() {
      if (v = B.group.items.filter((e) => {
        const i = e.type === U.bindingValue, p = e.opt && e.opt.createBindingShape !== void 0 && !e.opt.createBindingShape, m = e.opt && e.opt.disabled;
        return i && !p && !m;
      }), v.length === 0)
        return;
      r.value = v.length > 1, u = k(B.optionValues.uqId);
      const a = P.activeItem;
      a && (u.forEach((e) => {
        const i = e.options.propName;
        h.set(i, !0), a.off("updateValueBinding." + i), a.on("updateValueBinding." + i, (p) => {
          e.set("bindingValue", p);
        });
      }), C.value = v.length === u.length);
    }
    Q(() => {
      _(), q.on("bindingPropertyToggleDisable", b);
    }), de(() => {
      q.off("bindingPropertyToggleDisable", b);
    });
    function k(a) {
      return P.currLayer.findBindingItems(a);
    }
    return (a, e) => (w(), N("div", null, [
      t("div", Le, [
        t("span", Ee, c(s.group.group), 1),
        g(n(T), {
          name: "unknownCircle",
          size: 24,
          title: n(l)("默认状态匹配规则说明"),
          style: { cursor: "pointer" },
          onClick: e[0] || (e[0] = (i) => x.value = !0)
        }, null, 8, ["title"])
      ]),
      r.value ? (w(), N("div", Me, [
        g(n(Y), {
          label: n(l)("显示所有可用属性"),
          checked: C.value,
          onChange: D
        }, null, 8, ["label", "checked"])
      ])) : E("", !0),
      (w(!0), N(H, null, re(s.group.items, (i) => (w(), N("div", null, [
        i.type === n(U).bindingValue ? (w(), z(Te, {
          key: 0,
          label: i.label,
          value: s.optionValues[i.name],
          id: s.optionValues.id,
          opt: { ...i.opt, lastBindingManager: n(q) },
          onChangeValue: (p) => {
            s.updateValue(i.name, p);
          },
          checked: h.get(i.name),
          onChangeCheck: (p) => d(i)
        }, null, 8, ["label", "value", "id", "opt", "onChangeValue", "checked", "onChangeCheck"])) : E("", !0),
        i.type === n(U).bindingExpression ? (w(), z(ke, {
          key: 1,
          label: i.label,
          value: s.optionValues[i.name],
          onChangeValue: (p) => {
            s.updateValue(i.name, p);
          }
        }, null, 8, ["label", "value", "onChangeValue"])) : E("", !0)
      ]))), 256)),
      g(n(M), { show: x.value }, {
        default: V(() => [
          t("div", Oe, [
            g(n(K), {
              title: n(l)("绑定说明"),
              closeBtn: !0,
              onClose: e[2] || (e[2] = (i) => x.value = !1)
            }, {
              footer: V(() => [
                t("div", Fe, [
                  t("button", {
                    class: "btn-main",
                    onClick: e[1] || (e[1] = (i) => x.value = !1)
                  }, c(n(l)("关闭")), 1)
                ])
              ]),
              default: V(() => [
                t("div", ze, [
                  t("p", Re, c(n(l)("数据绑定优先级")), 1),
                  t("p", null, [
                    F(c(n(l)("导航目标绑定")) + " ", 1),
                    g(n(T), {
                      name: "arrowDown",
                      style: { transform: "rotate(-90deg)", "text-indent": "0" },
                      size: 16
                    }),
                    F(" " + c(n(l)("点位绑定")) + "。 ", 1)
                  ])
                ]),
                t("div", qe, [
                  t("p", Ue, c(n(l)("默认状态匹配规则")), 1),
                  t("p", null, c(n(l)("1. 未配置默认状态时，图形的第一个状态为默认状态。")), 1),
                  t("p", null, c(n(l)("2. 当没有绑定点位或点位没有值时，图形显示默认状态。")), 1),
                  t("p", null, c(n(l)("3. 当绑定点位为开关量时，点位值为0，显示图形的第一个状态；点位值为1，显示图形的第二个状态。")), 1),
                  t("p", null, c(n(l)("4. 当绑定点位为状态量时，点位值为1，显示图形的第一个状态；点位值为2，显示图形的第二个状态，以此类推。")), 1),
                  t("p", null, c(n(l)("5. 当绑定点位为模拟量时，设图形状态总数为N，当点位值为0，显示图形的第一个状态；100除以该图形剩余的状态数，得到N-1个区间；当点位值处于第K个区间时，显示图形的第K+1个状态。")), 1)
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
  Ge as default
};
