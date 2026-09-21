import { defineComponent as $, computed as V, ref as Q, watch as W, onMounted as Y, openBlock as u, createElementBlock as h, Fragment as N, renderList as B, createElementVNode as r, toDisplayString as v, unref as o, createVNode as f, createCommentVNode as D, createBlock as k } from "vue";
import { t as a, b as y, a as S, c as Z, s as P, d as x, e as ee, f as ne } from "./index-B7D1Ik_h.mjs";
import { XIconCpnt as oe, SelectSingle as L } from "@x-plateform-mono/common";
import { g as ae } from "./http-Dp9t8gnt.mjs";
const te = { class: "point-bindings-render" }, le = { class: "binding-item-header" }, ie = { class: "binding-item-title" }, se = { class: "binding-item-body" }, re = { class: "binding-row" }, ue = { class: "binding-row" }, ce = { class: "binding-label" }, pe = { class: "binding-row" }, de = { class: "binding-label" }, ge = { class: "binding-row" }, fe = { class: "binding-label" }, he = { class: "binding-row" }, ve = { class: "binding-row" }, me = {
  key: 1,
  class: "binding-row"
}, Ce = /* @__PURE__ */ $({
  __name: "PointBindingsRender",
  props: {
    value: {}
  },
  emits: ["change"],
  setup(w, { emit: _ }) {
    const d = w, b = _, g = V(() => d.value ?? []), c = Q([]), C = V(
      () => c.value.map((n) => ({ label: n.name, value: n.asset }))
    ), i = V(() => [
      { label: a("开关"), value: "switch" },
      { label: a("数字输入"), value: "number" }
    ]), p = /* @__PURE__ */ new Map();
    W(c, () => p.clear()), Y(() => {
      R();
    });
    function M() {
      return Date.now().toString(36) + Math.random().toString(36).slice(2);
    }
    let I = null;
    function O() {
      return I || (I = ae().then((n) => n?.devices || []).catch((n) => {
        throw I = null, n;
      })), I;
    }
    async function R() {
      try {
        c.value = await O();
      } catch (n) {
        console.error("loadDevices error:", n);
      }
    }
    function T(n) {
      if (!n) return [];
      const t = p.get(n);
      if (t) return t;
      const e = c.value.find((s) => s.asset === n);
      if (!e) return [];
      const l = (e.points || []).map((s) => ({
        label: s.name,
        value: s.name
      }));
      return p.set(n, l), l;
    }
    function E(n, t) {
      return c.value.find((l) => l.asset === n)?.points?.find((l) => l.name === t);
    }
    function F() {
      return {
        mode: "switch",
        onLabel: a("开启"),
        offLabel: a("关闭")
      };
    }
    function G() {
      return {
        deviceId: "",
        deviceName: "",
        pointId: "",
        pointName: "",
        unit: "",
        description: ""
      };
    }
    function m(n, t) {
      b(
        "change",
        g.value.map((e, l) => l === n ? t(e) : e)
      );
    }
    function q() {
      b("change", [
        ...g.value,
        {
          id: M(),
          displayName: "",
          pointInfo: G(),
          triggerConfig: F()
        }
      ]);
    }
    function z(n) {
      b("change", g.value.filter((t, e) => e !== n));
    }
    function U(n, t) {
      m(n, (e) => ({
        ...e,
        pointInfo: {
          ...e.pointInfo,
          deviceId: t,
          deviceName: c.value.find((l) => l.asset === t)?.name || "",
          // 切换设备后清空已选点位
          pointId: "",
          pointName: "",
          unit: "",
          description: ""
        }
      }));
    }
    function X(n, t) {
      m(n, (e) => {
        const l = E(e.pointInfo.deviceId, t);
        return {
          ...e,
          pointInfo: {
            ...e.pointInfo,
            pointId: t,
            pointName: l?.name || t,
            unit: l?.unit || "",
            description: l?.description || ""
          }
        };
      });
    }
    function j(n, t) {
      m(n, (e) => ({ ...e, displayName: t }));
    }
    function A(n, t) {
      m(n, (e) => ({
        ...e,
        triggerConfig: t === "switch" ? { mode: "switch", onLabel: a("开启"), offLabel: a("关闭") } : { mode: "number", label: a("数值") }
      }));
    }
    function H(n, t) {
      m(
        n,
        (e) => e.triggerConfig?.mode === "switch" ? { ...e, triggerConfig: { ...e.triggerConfig, onLabel: t } } : e
      );
    }
    function J(n, t) {
      m(
        n,
        (e) => e.triggerConfig?.mode === "switch" ? { ...e, triggerConfig: { ...e.triggerConfig, offLabel: t } } : e
      );
    }
    function K(n, t) {
      m(
        n,
        (e) => e.triggerConfig?.mode === "number" ? { ...e, triggerConfig: { ...e.triggerConfig, label: t } } : e
      );
    }
    return (n, t) => (u(), h("div", te, [
      (u(!0), h(N, null, B(g.value, (e, l) => (u(), h("div", {
        key: e.id,
        class: "binding-item"
      }, [
        r("div", le, [
          r("span", ie, v(o(a)("绑定项")) + " " + v(l + 1), 1),
          f(o(oe), {
            name: "delete",
            title: o(a)("删除绑定"),
            size: 18,
            class: "delete-btn",
            onClick: (s) => z(l)
          }, null, 8, ["title", "onClick"])
        ]),
        r("div", se, [
          r("div", re, [
            f(y, {
              label: o(a)("显示名称"),
              value: e.displayName,
              onChangeValue: (s) => j(l, s)
            }, null, 8, ["label", "value", "onChangeValue"])
          ]),
          r("div", ue, [
            r("span", ce, v(o(a)("设备")), 1),
            f(o(L), {
              value: e.pointInfo.deviceId,
              opts: C.value,
              placeholder: o(a)("请选择设备"),
              appendToRoot: !0,
              height: 24,
              onChange: (s) => U(l, s),
              class: "binding-select"
            }, null, 8, ["value", "opts", "placeholder", "onChange"])
          ]),
          r("div", pe, [
            r("span", de, v(o(a)("点位")), 1),
            f(o(L), {
              value: e.pointInfo.pointId,
              opts: T(e.pointInfo.deviceId),
              placeholder: o(a)("请选择点位"),
              appendToRoot: !0,
              height: 24,
              disabled: !e.pointInfo.deviceId,
              onChange: (s) => X(l, s),
              class: "binding-select"
            }, null, 8, ["value", "opts", "placeholder", "disabled", "onChange"])
          ]),
          r("div", ge, [
            r("span", fe, v(o(a)("触发方式")), 1),
            f(o(L), {
              value: e.triggerConfig?.mode || "switch",
              opts: i.value,
              placeholder: o(a)("请选择触发方式"),
              appendToRoot: !0,
              height: 24,
              onChange: (s) => A(l, s),
              class: "binding-select"
            }, null, 8, ["value", "opts", "placeholder", "onChange"])
          ]),
          e.triggerConfig?.mode === "switch" ? (u(), h(N, { key: 0 }, [
            r("div", he, [
              f(y, {
                label: o(a)("开启标签"),
                value: e.triggerConfig?.onLabel || "",
                onChangeValue: (s) => H(l, s)
              }, null, 8, ["label", "value", "onChangeValue"])
            ]),
            r("div", ve, [
              f(y, {
                label: o(a)("关闭标签"),
                value: e.triggerConfig?.offLabel || "",
                onChangeValue: (s) => J(l, s)
              }, null, 8, ["label", "value", "onChangeValue"])
            ])
          ], 64)) : e.triggerConfig?.mode === "number" ? (u(), h("div", me, [
            f(y, {
              label: o(a)("数字标签"),
              value: e.triggerConfig?.label || "",
              onChangeValue: (s) => K(l, s)
            }, null, 8, ["label", "value", "onChangeValue"])
          ])) : D("", !0)
        ])
      ]))), 128)),
      r("div", {
        class: "add-binding-btn",
        onClick: q
      }, [
        r("span", null, "+ " + v(o(a)("添加绑定")), 1)
      ])
    ]));
  }
}), _e = /* @__PURE__ */ S(Ce, [["__scopeId", "data-v-ea8d0cf3"]]), be = { class: "property-group-panel-title" }, ye = { class: "label" }, Ve = {
  key: 1,
  class: "text-property-row"
}, we = {
  key: 0,
  class: "popup-config-bindings-section"
}, Ie = { class: "popup-config-divider" }, Pe = /* @__PURE__ */ $({
  __name: "PropertyGroupPopupConfig",
  props: {
    group: {},
    optionValues: {},
    updateValue: { type: Function }
  },
  setup(w) {
    const _ = w, d = V(() => _.optionValues?.popupConfig || Z()), b = V(() => _.group.items.filter(
      (c) => c.name === "enablePopup" || !!d.value.enablePopup
    ));
    function g(c, C) {
      _.updateValue("popupConfig", {
        ...d.value,
        [c]: C
      });
    }
    return (c, C) => (u(), h("div", null, [
      r("div", be, [
        r("span", ye, v(o(a)(w.group.group)), 1)
      ]),
      (u(!0), h(N, null, B(b.value, (i) => (u(), h("div", {
        key: i.name,
        class: "property-group-single-line"
      }, [
        i.type === o(P).boolean ? (u(), k(x, {
          key: 0,
          label: o(a)(i.label),
          value: d.value[i.name],
          onChangeValue: (p) => g(i.name, p)
        }, null, 8, ["label", "value", "onChangeValue"])) : i.type === o(P).text ? (u(), h("div", Ve, [
          f(y, {
            label: o(a)(i.label),
            value: d.value[i.name],
            onChangeValue: (p) => g(i.name, p)
          }, null, 8, ["label", "value", "onChangeValue"])
        ])) : i.type === o(P).number ? (u(), k(ee, {
          key: 2,
          label: o(a)(i.label),
          value: d.value[i.name],
          opt: i.opt,
          onChangeValue: (p) => g(i.name, p)
        }, null, 8, ["label", "value", "opt", "onChangeValue"])) : i.type === o(P).color ? (u(), k(ne, {
          key: 3,
          label: o(a)(i.label),
          value: d.value[i.name],
          onChangeValue: (p) => g(i.name, p)
        }, null, 8, ["label", "value", "onChangeValue"])) : D("", !0)
      ]))), 128)),
      d.value.enablePopup ? (u(), h("div", we, [
        r("div", Ie, [
          r("span", null, v(o(a)("点位绑定")), 1)
        ]),
        f(_e, {
          value: d.value.popupPointBindings,
          onChange: C[0] || (C[0] = (i) => g("popupPointBindings", i))
        }, null, 8, ["value"])
      ])) : D("", !0)
    ]));
  }
}), $e = /* @__PURE__ */ S(Pe, [["__scopeId", "data-v-2e8c346b"]]);
export {
  $e as default
};
