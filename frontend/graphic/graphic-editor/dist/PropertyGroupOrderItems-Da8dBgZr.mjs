import { defineComponent as l, openBlock as a, createElementBlock as d, createElementVNode as p, toDisplayString as g, unref as t, createVNode as r } from "vue";
import { XIconCpnt as o } from "@x-plateform-mono/common";
import { t as n, p as s } from "./index-Bk7a42Iw.mjs";
const m = { class: "property-group-panel-title" }, c = { class: "label" }, u = {
  class: "property-group-single-line",
  style: { "justify-content": "start" }
}, v = /* @__PURE__ */ l({
  __name: "PropertyGroupOrderItems",
  props: {
    group: {},
    optionValues: {},
    updateValue: { type: Function }
  },
  setup(y) {
    return (f, e) => (a(), d("div", null, [
      p("div", m, [
        p("span", c, g(t(n)("排列")), 1)
      ]),
      p("div", u, [
        r(t(o), {
          name: "bringForward",
          title: t(n)("上移一层"),
          size: 24,
          style: { cursor: "pointer", margin: "0 4px", padding: "2px" },
          class: "btn-ghost",
          onClick: e[0] || (e[0] = (i) => t(s).dispatch("gItem.order", "forward"))
        }, null, 8, ["title"]),
        r(t(o), {
          name: "bringToFront",
          title: t(n)("移至最上层"),
          size: 24,
          style: { cursor: "pointer", margin: "0 4px", padding: "2px" },
          class: "btn-ghost",
          onClick: e[1] || (e[1] = (i) => t(s).dispatch("gItem.order", "front"))
        }, null, 8, ["title"]),
        r(t(o), {
          name: "sendBackward",
          title: t(n)("下移一层"),
          size: 24,
          style: { cursor: "pointer", margin: "0 4px", padding: "2px" },
          class: "btn-ghost",
          onClick: e[2] || (e[2] = (i) => t(s).dispatch("gItem.order", "backward"))
        }, null, 8, ["title"]),
        r(t(o), {
          name: "sendToBack",
          title: t(n)("移至最下层"),
          size: 24,
          style: { cursor: "pointer", margin: "0 4px", padding: "2px" },
          class: "btn-ghost",
          onClick: e[3] || (e[3] = (i) => t(s).dispatch("gItem.order", "back"))
        }, null, 8, ["title"])
      ])
    ]));
  }
});
export {
  v as default
};
