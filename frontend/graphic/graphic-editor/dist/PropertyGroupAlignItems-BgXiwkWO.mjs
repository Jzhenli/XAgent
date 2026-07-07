import { defineComponent as d, computed as m, openBlock as c, createElementBlock as x, createElementVNode as s, toDisplayString as y, unref as t, createVNode as i, withDirectives as g, vShow as u } from "vue";
import { XIconCpnt as l } from "@x-plateform-mono/common";
import { g as r, t as n, p } from "./index-Cc7tq2dP.mjs";
const v = { class: "property-group-panel-title" }, b = { class: "label" }, f = {
  class: "property-group-single-line",
  style: { "justify-content": "start" }
}, $ = /* @__PURE__ */ d({
  __name: "PropertyGroupAlignItems",
  props: {
    group: {},
    optionValues: {},
    updateValue: { type: Function }
  },
  setup(h) {
    const a = m(() => !r.tempGroup || !r.tempGroup.itemList ? !1 : r.tempGroup.itemList.length > 2);
    return (k, e) => (c(), x("div", null, [
      s("div", v, [
        s("span", b, y(t(n)("对齐")), 1)
      ]),
      s("div", f, [
        i(t(l), {
          title: t(n)("左对齐"),
          name: "horiaontalAlignLeft",
          size: 24,
          style: { cursor: "pointer", margin: "0 4px", padding: "2px" },
          class: "btn-ghost",
          onClick: e[0] || (e[0] = (o) => t(p).dispatch("tempGroup.align", "left"))
        }, null, 8, ["title"]),
        i(t(l), {
          title: t(n)("居中对齐"),
          name: "horizontalAlignCenter",
          size: 24,
          style: { cursor: "pointer", margin: "0 4px", padding: "2px" },
          class: "btn-ghost",
          onClick: e[1] || (e[1] = (o) => t(p).dispatch("tempGroup.align", "center"))
        }, null, 8, ["title"]),
        i(t(l), {
          title: t(n)("右对齐"),
          name: "horizontalAlignRight",
          size: 24,
          style: { cursor: "pointer", margin: "0 4px", padding: "2px" },
          class: "btn-ghost",
          onClick: e[2] || (e[2] = (o) => t(p).dispatch("tempGroup.align", "right"))
        }, null, 8, ["title"]),
        e[8] || (e[8] = s("span", { style: { display: "inline-block", width: "40px" } }, null, -1)),
        i(t(l), {
          title: t(n)("垂直顶部对齐"),
          name: "verticalAlignTop",
          size: 24,
          style: { cursor: "pointer", margin: "0 4px", padding: "2px" },
          class: "btn-ghost",
          onClick: e[3] || (e[3] = (o) => t(p).dispatch("tempGroup.align", "top"))
        }, null, 8, ["title"]),
        i(t(l), {
          title: t(n)("垂直居中对齐"),
          name: "verticalAlignMiddle",
          size: 24,
          style: { cursor: "pointer", margin: "0 4px", padding: "2px" },
          class: "btn-ghost",
          onClick: e[4] || (e[4] = (o) => t(p).dispatch("tempGroup.align", "middle"))
        }, null, 8, ["title"]),
        i(t(l), {
          title: t(n)("垂直底部对齐"),
          name: "verticalAlignBottom",
          size: 24,
          style: { cursor: "pointer", margin: "0 4px", padding: "2px" },
          class: "btn-ghost",
          onClick: e[5] || (e[5] = (o) => t(p).dispatch("tempGroup.align", "bottom"))
        }, null, 8, ["title"]),
        e[9] || (e[9] = s("span", { style: { display: "inline-block", width: "40px" } }, null, -1)),
        g(i(t(l), {
          title: t(n)("垂直均分对齐"),
          name: "distributeVertical",
          size: 24,
          style: { cursor: "pointer", margin: "0 4px", padding: "2px" },
          class: "btn-ghost",
          onClick: e[6] || (e[6] = (o) => t(p).dispatch("tempGroup.align", "v-spacebetween"))
        }, null, 8, ["title"]), [
          [u, a.value]
        ]),
        g(i(t(l), {
          title: t(n)("水平均分对齐"),
          name: "distributeHorizontal",
          size: 24,
          style: { cursor: "pointer", margin: "0 4px", padding: "2px" },
          class: "btn-ghost",
          onClick: e[7] || (e[7] = (o) => t(p).dispatch("tempGroup.align", "h-spacebetween"))
        }, null, 8, ["title"]), [
          [u, a.value]
        ])
      ])
    ]));
  }
});
export {
  $ as default
};
