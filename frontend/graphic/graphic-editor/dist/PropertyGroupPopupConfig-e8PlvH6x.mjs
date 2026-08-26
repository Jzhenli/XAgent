import { defineComponent as M, ref as B, computed as w, watch as S, onMounted as Z, openBlock as r, createElementBlock as f, Fragment as D, renderList as O, createElementVNode as c, toDisplayString as m, unref as o, createVNode as g, createCommentVNode as $, createBlock as L } from "vue";
import { t as a, b as _, a as R, c as x, s as V, d as ee, e as ne, f as oe } from "./index-Bk7a42Iw.mjs";
import { XIconCpnt as ae, SelectSingle as N } from "@x-plateform-mono/common";
import { g as te } from "./http-Dp9t8gnt.mjs";
const le = { class: "point-bindings-render" }, ie = { class: "binding-item-header" }, se = { class: "binding-item-title" }, ue = { class: "binding-item-body" }, ce = { class: "binding-row" }, re = { class: "binding-row" }, pe = { class: "binding-label" }, de = { class: "binding-row" }, ge = { class: "binding-label" }, fe = { class: "binding-row" }, ve = { class: "binding-label" }, he = { class: "binding-row" }, be = { class: "binding-row" }, me = {
  key: 1,
  class: "binding-row"
}, Ce = /* @__PURE__ */ M({
  __name: "PointBindingsRender",
  props: {
    value: {}
  },
  emits: ["change"],
  setup(y, { emit: C }) {
    const d = y, P = C, u = B([]);
    let b = null;
    const p = B([]), t = w(
      () => p.value.map((n) => ({ label: n.name, value: n.asset }))
    ), v = w(() => [
      { label: a("开关"), value: "switch" },
      { label: a("数字输入"), value: "number" }
    ]), k = /* @__PURE__ */ new Map();
    S(p, () => k.clear()), S(
      () => d.value,
      (n) => {
        n !== b && (u.value = n ? [...n] : []);
      },
      { immediate: !0 }
    ), Z(() => {
      F();
    });
    function T() {
      return Date.now().toString(36) + Math.random().toString(36).slice(2);
    }
    let I = null;
    function E() {
      return I || (I = te().then((n) => n?.devices || []).catch((n) => {
        throw I = null, n;
      })), I;
    }
    async function F() {
      try {
        p.value = await E();
      } catch (n) {
        console.error("loadDevices error:", n);
      }
    }
    function G(n) {
      if (!n) return [];
      const l = k.get(n);
      if (l) return l;
      const e = p.value.find((s) => s.asset === n);
      if (!e) return [];
      const i = (e.points || []).map((s) => ({
        label: s.name,
        value: s.name
      }));
      return k.set(n, i), i;
    }
    function q(n, l) {
      return p.value.find((i) => i.asset === n)?.points?.find((i) => i.name === l);
    }
    function z() {
      return {
        mode: "switch",
        onLabel: a("开启"),
        offLabel: a("关闭")
      };
    }
    function U() {
      return {
        deviceId: "",
        deviceName: "",
        pointId: "",
        pointName: "",
        unit: "",
        description: ""
      };
    }
    function X() {
      u.value.push({
        id: T(),
        displayName: "",
        pointInfo: U(),
        triggerConfig: z()
      }), h();
    }
    function j(n) {
      u.value.splice(n, 1), h();
    }
    function A(n, l) {
      const e = u.value[n];
      e.pointInfo.deviceId = l, e.pointInfo.deviceName = p.value.find((i) => i.asset === l)?.name || "", e.pointInfo.pointId = "", e.pointInfo.pointName = "", e.pointInfo.unit = "", e.pointInfo.description = "", h();
    }
    function H(n, l) {
      const e = u.value[n], i = q(e.pointInfo.deviceId, l);
      e.pointInfo.pointId = l, e.pointInfo.pointName = i?.name || l, e.pointInfo.unit = i?.unit || "", e.pointInfo.description = i?.description || "", h();
    }
    function J(n, l) {
      u.value[n].displayName = l, h();
    }
    function K(n, l) {
      const e = u.value[n];
      l === "switch" ? e.triggerConfig = {
        mode: "switch",
        onLabel: a("开启"),
        offLabel: a("关闭")
      } : e.triggerConfig = {
        mode: "number",
        label: a("数值")
      }, h();
    }
    function Q(n, l) {
      const e = u.value[n];
      e.triggerConfig?.mode === "switch" && (e.triggerConfig.onLabel = l, h());
    }
    function W(n, l) {
      const e = u.value[n];
      e.triggerConfig?.mode === "switch" && (e.triggerConfig.offLabel = l, h());
    }
    function Y(n, l) {
      const e = u.value[n];
      e.triggerConfig?.mode === "number" && (e.triggerConfig.label = l, h());
    }
    function h() {
      b = [...u.value], P("change", b);
    }
    return (n, l) => (r(), f("div", le, [
      (r(!0), f(D, null, O(u.value, (e, i) => (r(), f("div", {
        key: e.id,
        class: "binding-item"
      }, [
        c("div", ie, [
          c("span", se, m(o(a)("绑定项")) + " " + m(i + 1), 1),
          g(o(ae), {
            name: "delete",
            title: o(a)("删除绑定"),
            size: 18,
            class: "delete-btn",
            onClick: (s) => j(i)
          }, null, 8, ["title", "onClick"])
        ]),
        c("div", ue, [
          c("div", ce, [
            g(_, {
              label: o(a)("显示名称"),
              value: e.displayName,
              onChangeValue: (s) => J(i, s)
            }, null, 8, ["label", "value", "onChangeValue"])
          ]),
          c("div", re, [
            c("span", pe, m(o(a)("设备")), 1),
            g(o(N), {
              value: e.pointInfo.deviceId,
              opts: t.value,
              placeholder: o(a)("请选择设备"),
              appendToRoot: !0,
              height: 24,
              onChange: (s) => A(i, s),
              class: "binding-select"
            }, null, 8, ["value", "opts", "placeholder", "onChange"])
          ]),
          c("div", de, [
            c("span", ge, m(o(a)("点位")), 1),
            g(o(N), {
              value: e.pointInfo.pointId,
              opts: G(e.pointInfo.deviceId),
              placeholder: o(a)("请选择点位"),
              appendToRoot: !0,
              height: 24,
              disabled: !e.pointInfo.deviceId,
              onChange: (s) => H(i, s),
              class: "binding-select"
            }, null, 8, ["value", "opts", "placeholder", "disabled", "onChange"])
          ]),
          c("div", fe, [
            c("span", ve, m(o(a)("触发方式")), 1),
            g(o(N), {
              value: e.triggerConfig?.mode || "switch",
              opts: v.value,
              placeholder: o(a)("请选择触发方式"),
              appendToRoot: !0,
              height: 24,
              onChange: (s) => K(i, s),
              class: "binding-select"
            }, null, 8, ["value", "opts", "placeholder", "onChange"])
          ]),
          e.triggerConfig?.mode === "switch" ? (r(), f(D, { key: 0 }, [
            c("div", he, [
              g(_, {
                label: o(a)("开启标签"),
                value: e.triggerConfig?.onLabel || "",
                onChangeValue: (s) => Q(i, s)
              }, null, 8, ["label", "value", "onChangeValue"])
            ]),
            c("div", be, [
              g(_, {
                label: o(a)("关闭标签"),
                value: e.triggerConfig?.offLabel || "",
                onChangeValue: (s) => W(i, s)
              }, null, 8, ["label", "value", "onChangeValue"])
            ])
          ], 64)) : e.triggerConfig?.mode === "number" ? (r(), f("div", me, [
            g(_, {
              label: o(a)("数字标签"),
              value: e.triggerConfig?.label || "",
              onChangeValue: (s) => Y(i, s)
            }, null, 8, ["label", "value", "onChangeValue"])
          ])) : $("", !0)
        ])
      ]))), 128)),
      c("div", {
        class: "add-binding-btn",
        onClick: X
      }, [
        c("span", null, "+ " + m(o(a)("添加绑定")), 1)
      ])
    ]));
  }
}), _e = /* @__PURE__ */ R(Ce, [["__scopeId", "data-v-736d5b00"]]), ye = { class: "property-group-panel-title" }, Ie = { class: "label" }, Ve = {
  key: 1,
  class: "text-property-row"
}, we = {
  key: 0,
  class: "popup-config-bindings-section"
}, Pe = { class: "popup-config-divider" }, ke = /* @__PURE__ */ M({
  __name: "PropertyGroupPopupConfig",
  props: {
    group: {},
    optionValues: {},
    updateValue: { type: Function }
  },
  setup(y) {
    const C = y, d = w(() => C.optionValues?.popupConfig || x()), P = w(() => C.group.items.filter(
      (b) => b.name === "enablePopup" || !!d.value.enablePopup
    ));
    function u(b, p) {
      C.updateValue("popupConfig", {
        ...d.value,
        [b]: p
      });
    }
    return (b, p) => (r(), f("div", null, [
      c("div", ye, [
        c("span", Ie, m(o(a)(y.group.group)), 1)
      ]),
      (r(!0), f(D, null, O(P.value, (t) => (r(), f("div", {
        key: t.name,
        class: "property-group-single-line"
      }, [
        t.type === o(V).boolean ? (r(), L(ee, {
          key: 0,
          label: o(a)(t.label),
          value: d.value[t.name],
          onChangeValue: (v) => u(t.name, v)
        }, null, 8, ["label", "value", "onChangeValue"])) : t.type === o(V).text ? (r(), f("div", Ve, [
          g(_, {
            label: o(a)(t.label),
            value: d.value[t.name],
            onChangeValue: (v) => u(t.name, v)
          }, null, 8, ["label", "value", "onChangeValue"])
        ])) : t.type === o(V).number ? (r(), L(ne, {
          key: 2,
          label: o(a)(t.label),
          value: d.value[t.name],
          opt: t.opt,
          onChangeValue: (v) => u(t.name, v)
        }, null, 8, ["label", "value", "opt", "onChangeValue"])) : t.type === o(V).color ? (r(), L(oe, {
          key: 3,
          label: o(a)(t.label),
          value: d.value[t.name],
          onChangeValue: (v) => u(t.name, v)
        }, null, 8, ["label", "value", "onChangeValue"])) : $("", !0)
      ]))), 128)),
      d.value.enablePopup ? (r(), f("div", we, [
        c("div", Pe, [
          c("span", null, m(o(a)("点位绑定")), 1)
        ]),
        g(_e, {
          value: d.value.popupPointBindings,
          onChange: p[0] || (p[0] = (t) => u("popupPointBindings", t))
        }, null, 8, ["value"])
      ])) : $("", !0)
    ]));
  }
}), Be = /* @__PURE__ */ R(ke, [["__scopeId", "data-v-2e8c346b"]]);
export {
  Be as default
};
