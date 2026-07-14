import { defineComponent as nt, ref as q, watch as se, computed as Ft, openBlock as W, createElementBlock as de, Fragment as st, createElementVNode as O, createTextVNode as Ge, toDisplayString as B, createVNode as U, unref as S, withCtx as K, withModifiers as yn, withDirectives as gn, vModelText as bn, reactive as kt, onMounted as It, createBlock as Ue, createCommentVNode as Se, normalizeStyle as wn, onUnmounted as En, renderList as Rn } from "vue";
import { t as x, _ as jt, a as Sn, p as Ve, s as ze, g as te, B as On } from "./index-D7YHSx5D.mjs";
import { XIconCpnt as fe, PopupModal as Oe, HeaderFooterPanel as Qe, CheckboxCpnt as qt, SelectSingle as bt } from "@x-plateform-mono/common";
const _n = { class: "binding-value-property-render-item" }, Cn = { class: "animation-setting-section" }, An = { style: { position: "relative", "min-height": "32px", display: "flex", "justify-content": "space-between" } }, xn = ["innerHTML"], Tn = { style: { width: "600px", height: "600px" } }, Pn = { class: "default-animation-rule-info" }, vn = { class: "default-footer-content" }, Nn = { style: { width: "560px", height: "480px", position: "relative" } }, Dn = { style: { position: "absolute", inset: "0 12px" } }, Ln = { style: { width: "640px", height: "704px", position: "relative" } }, Bn = /* @__PURE__ */ nt({
  __name: "BindingExpressionRender",
  props: {
    label: {},
    value: {}
  },
  emits: ["changeValue"],
  setup(e, { emit: t }) {
    const n = e, s = t, r = q(!1);
    se(() => r.value, (m) => {
      sessionStorage.setItem("graphic-editor-panel-status", `${m}`);
    });
    const o = Ft(() => "<p>" + (n.value?.expression?.replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll(" ", "&nbsp;").replaceAll(`
`, "</p><p>") || "") + "</p>"), i = [
      { name: "state1", label: x("状态1") },
      { name: "state2", label: x("状态2") },
      { name: "state3", label: x("状态3") },
      { name: "state4", label: x("状态4") },
      { name: "state5", label: x("状态5") }
    ], l = q(!1);
    se(() => l.value, (m) => {
      sessionStorage.setItem("graphic-editor-panel-status", `${m}`);
    });
    const c = q(!1);
    se(() => c.value, (m) => {
      sessionStorage.setItem("graphic-editor-panel-status", `${m}`);
    });
    const f = q(n.value?.expression || "");
    function u() {
      f.value = n.value?.expression || "", c.value = !0;
    }
    function p(m) {
      s("changeValue", {
        expression: n.value?.expression,
        animationConfig: m
      }), l.value = !1;
    }
    function E() {
      s("changeValue", {
        expression: f.value,
        animationConfig: n.value?.animationConfig
      }), c.value = !1;
    }
    return (m, h) => (W(), de(st, null, [
      O("div", _n, [
        O("div", Cn, [
          O("span", null, [
            Ge(B(e.label) + " ", 1),
            U(S(fe), {
              name: "unknownCircle",
              title: S(x)("表达式值对应状态设置"),
              size: 20,
              style: { margin: "8px 0", cursor: "pointer" },
              onClick: h[0] || (h[0] = (b) => r.value = !0)
            }, null, 8, ["title"])
          ]),
          U(S(fe), {
            title: S(x)("点位值对应状态设置"),
            name: "film",
            size: 24,
            onClick: h[1] || (h[1] = (b) => l.value = !0),
            style: { cursor: "pointer" }
          }, null, 8, ["title"])
        ]),
        O("div", An, [
          O("span", {
            class: "expression-content-section",
            style: { display: "inline-block", width: "85%", "word-break": "break-all" },
            innerHTML: o.value
          }, null, 8, xn),
          O("button", {
            onClick: u,
            class: "btn-main",
            style: { position: "absolute", top: "4px", right: "0", height: "24px", "line-height": "24px" }
          }, B(S(x)("编辑")), 1)
        ])
      ]),
      U(S(Oe), { show: r.value }, {
        default: K(() => [
          O("div", Tn, [
            U(S(Qe), {
              title: S(x)("表达式编辑说明"),
              closeBtn: !0,
              onClose: h[3] || (h[3] = (b) => r.value = !1)
            }, {
              footer: K(() => [
                O("div", vn, [
                  O("button", {
                    class: "btn-main",
                    onClick: h[2] || (h[2] = (b) => r.value = !1)
                  }, B(S(x)("关闭")), 1)
                ])
              ]),
              default: K(() => [
                O("div", Pn, [
                  O("p", null, B(S(x)("1. 绑定点位初始值默认为0。")), 1),
                  O("p", null, B(S(x)("2. 表达式计算过程中发生错误时结果设置为-1。")), 1),
                  O("p", null, B(S(x)("3. 使用最后一个表达式作为值。")), 1)
                ])
              ]),
              _: 1
            }, 8, ["title"])
          ])
        ]),
        _: 1
      }, 8, ["show"]),
      U(S(Oe), { show: c.value }, {
        default: K(() => [
          O("div", Nn, [
            U(S(Qe), {
              onKeydown: h[5] || (h[5] = yn(() => {
              }, ["stop"])),
              title: S(x)("表达式 - 计算结果为一个模拟量值"),
              closeBtn: !0,
              onClose: h[6] || (h[6] = (b) => c.value = !1),
              onCancel: h[7] || (h[7] = (b) => c.value = !1),
              onConfirm: E
            }, {
              default: K(() => [
                O("div", Dn, [
                  gn(O("textarea", {
                    style: { position: "absolute", left: "0", right: "0", top: "0", bottom: "0", border: "0", resize: "none", outline: "none" },
                    "onUpdate:modelValue": h[4] || (h[4] = (b) => f.value = b)
                  }, null, 512), [
                    [bn, f.value]
                  ])
                ])
              ]),
              _: 1
            }, 8, ["title"])
          ])
        ]),
        _: 1
      }, 8, ["show"]),
      U(S(Oe), { show: l.value }, {
        default: K(() => [
          O("div", Ln, [
            U(jt, {
              animationStates: i,
              animationConf: e.value?.animationConfig,
              onOnCancel: h[8] || (h[8] = (b) => l.value = !1),
              onOnConfirm: p
            }, null, 8, ["animationConf"])
          ])
        ]),
        _: 1
      }, 8, ["show"])
    ], 64));
  }
});
function $t(e, t) {
  return function() {
    return e.apply(t, arguments);
  };
}
const { toString: Un } = Object.prototype, { getPrototypeOf: pe } = Object, { iterator: Ce, toStringTag: Mt } = Symbol, Fe = (({ hasOwnProperty: e }) => (t, n) => e.call(t, n))(Object.prototype), _e = (e, t) => {
  let n = e;
  const s = [];
  for (; n != null && n !== Object.prototype; ) {
    if (s.indexOf(n) !== -1)
      return !1;
    if (s.push(n), Fe(n, t))
      return !0;
    n = pe(n);
  }
  return !1;
}, Fn = (e, t) => e != null && _e(e, t) ? e[t] : void 0, rt = /* @__PURE__ */ ((e) => (t) => {
  const n = Un.call(t);
  return e[n] || (e[n] = n.slice(8, -1).toLowerCase());
})(/* @__PURE__ */ Object.create(null)), z = (e) => (e = e.toLowerCase(), (t) => rt(t) === e), je = (e) => (t) => typeof t === e, { isArray: oe } = Array, he = je("undefined");
function me(e) {
  return e !== null && !he(e) && e.constructor !== null && !he(e.constructor) && $(e.constructor.isBuffer) && e.constructor.isBuffer(e);
}
const Ht = z("ArrayBuffer");
function kn(e) {
  let t;
  return typeof ArrayBuffer < "u" && ArrayBuffer.isView ? t = ArrayBuffer.isView(e) : t = e && e.buffer && Ht(e.buffer), t;
}
const In = je("string"), $ = je("function"), Vt = je("number"), ye = (e) => e !== null && typeof e == "object", jn = (e) => e === !0 || e === !1, De = (e) => {
  if (!ye(e))
    return !1;
  const t = pe(e);
  return (t === null || t === Object.prototype || pe(t) === null) && // Treat any genuine (non-Object.prototype-polluted) Symbol.toStringTag or
  // Symbol.iterator as evidence the value is a tagged/iterable type rather
  // than a plain object, while ignoring keys injected onto Object.prototype.
  !_e(e, Mt) && !_e(e, Ce);
}, qn = (e) => {
  if (!ye(e) || me(e))
    return !1;
  try {
    return Object.keys(e).length === 0 && Object.getPrototypeOf(e) === Object.prototype;
  } catch {
    return !1;
  }
}, $n = z("Date"), Mn = z("File"), Hn = (e) => !!(e && typeof e.uri < "u"), Vn = (e) => e && typeof e.getParts < "u", zn = z("Blob"), Jn = z("FileList"), Wn = (e) => ye(e) && $(e.pipe);
function Kn() {
  return typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
}
const wt = Kn(), Et = typeof wt.FormData < "u" ? wt.FormData : void 0, Xn = (e) => {
  if (!e) return !1;
  if (Et && e instanceof Et) return !0;
  const t = pe(e);
  if (!t || t === Object.prototype || !$(e.append)) return !1;
  const n = rt(e);
  return n === "formdata" || // detect form-data instance
  n === "object" && $(e.toString) && e.toString() === "[object FormData]";
}, Gn = z("URLSearchParams"), [Qn, Zn, Yn, es] = [
  "ReadableStream",
  "Request",
  "Response",
  "Headers"
].map(z), ts = (e) => e.trim ? e.trim() : e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
function Ae(e, t, { allOwnKeys: n = !1 } = {}) {
  if (e === null || typeof e > "u")
    return;
  let s, r;
  if (typeof e != "object" && (e = [e]), oe(e))
    for (s = 0, r = e.length; s < r; s++)
      t.call(null, e[s], s, e);
  else {
    if (me(e))
      return;
    const o = n ? Object.getOwnPropertyNames(e) : Object.keys(e), i = o.length;
    let l;
    for (s = 0; s < i; s++)
      l = o[s], t.call(null, e[l], l, e);
  }
}
function zt(e, t) {
  if (me(e))
    return null;
  t = t.toLowerCase();
  const n = Object.keys(e);
  let s = n.length, r;
  for (; s-- > 0; )
    if (r = n[s], t === r.toLowerCase())
      return r;
  return null;
}
const ne = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : global, Jt = (e) => !he(e) && e !== ne;
function Ze(...e) {
  const { caseless: t, skipUndefined: n } = Jt(this) && this || {}, s = {}, r = (o, i) => {
    if (i === "__proto__" || i === "constructor" || i === "prototype")
      return;
    const l = t && typeof i == "string" && zt(s, i) || i, c = Fe(s, l) ? s[l] : void 0;
    De(c) && De(o) ? s[l] = Ze(c, o) : De(o) ? s[l] = Ze({}, o) : oe(o) ? s[l] = o.slice() : (!n || !he(o)) && (s[l] = o);
  };
  for (let o = 0, i = e.length; o < i; o++) {
    const l = e[o];
    if (!l || me(l) || (Ae(l, r), typeof l != "object" || oe(l)))
      continue;
    const c = Object.getOwnPropertySymbols(l);
    for (let f = 0; f < c.length; f++) {
      const u = c[f];
      ps.call(l, u) && r(l[u], u);
    }
  }
  return s;
}
const ns = (e, t, n, { allOwnKeys: s } = {}) => (Ae(
  t,
  (r, o) => {
    n && $(r) ? Object.defineProperty(e, o, {
      // Null-proto descriptor so a polluted Object.prototype.get cannot
      // hijack defineProperty's accessor-vs-data resolution.
      __proto__: null,
      value: $t(r, n),
      writable: !0,
      enumerable: !0,
      configurable: !0
    }) : Object.defineProperty(e, o, {
      __proto__: null,
      value: r,
      writable: !0,
      enumerable: !0,
      configurable: !0
    });
  },
  { allOwnKeys: s }
), e), ss = (e) => (e.charCodeAt(0) === 65279 && (e = e.slice(1)), e), rs = (e, t, n, s) => {
  e.prototype = Object.create(t.prototype, s), Object.defineProperty(e.prototype, "constructor", {
    __proto__: null,
    value: e,
    writable: !0,
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e, "super", {
    __proto__: null,
    value: t.prototype
  }), n && Object.assign(e.prototype, n);
}, os = (e, t, n, s) => {
  let r, o, i;
  const l = {};
  if (t = t || {}, e == null) return t;
  do {
    for (r = Object.getOwnPropertyNames(e), o = r.length; o-- > 0; )
      i = r[o], (!s || s(i, e, t)) && !l[i] && (t[i] = e[i], l[i] = !0);
    e = n !== !1 && pe(e);
  } while (e && (!n || n(e, t)) && e !== Object.prototype);
  return t;
}, is = (e, t, n) => {
  e = String(e), (n === void 0 || n > e.length) && (n = e.length), n -= t.length;
  const s = e.indexOf(t, n);
  return s !== -1 && s === n;
}, as = (e) => {
  if (!e) return null;
  if (oe(e)) return e;
  let t = e.length;
  if (!Vt(t)) return null;
  const n = new Array(t);
  for (; t-- > 0; )
    n[t] = e[t];
  return n;
}, ls = /* @__PURE__ */ ((e) => (t) => e && t instanceof e)(typeof Uint8Array < "u" && pe(Uint8Array)), cs = (e, t) => {
  const s = (e && e[Ce]).call(e);
  let r;
  for (; (r = s.next()) && !r.done; ) {
    const o = r.value;
    t.call(e, o[0], o[1]);
  }
}, us = (e, t) => {
  let n;
  const s = [];
  for (; (n = e.exec(t)) !== null; )
    s.push(n);
  return s;
}, ds = z("HTMLFormElement"), fs = (e) => e.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g, function(n, s, r) {
  return s.toUpperCase() + r;
}), { propertyIsEnumerable: ps } = Object.prototype, hs = z("RegExp"), Wt = (e, t) => {
  const n = Object.getOwnPropertyDescriptors(e), s = {};
  Ae(n, (r, o) => {
    let i;
    (i = t(r, o, e)) !== !1 && (s[o] = i || r);
  }), Object.defineProperties(e, s);
}, ms = (e) => {
  Wt(e, (t, n) => {
    if ($(e) && ["arguments", "caller", "callee"].includes(n))
      return !1;
    const s = e[n];
    if ($(s)) {
      if (t.enumerable = !1, "writable" in t) {
        t.writable = !1;
        return;
      }
      t.set || (t.set = () => {
        throw Error("Can not rewrite read-only method '" + n + "'");
      });
    }
  });
}, ys = (e, t) => {
  const n = {}, s = (r) => {
    r.forEach((o) => {
      n[o] = !0;
    });
  };
  return oe(e) ? s(e) : s(String(e).split(t)), n;
}, gs = () => {
}, bs = (e, t) => e != null && Number.isFinite(e = +e) ? e : t;
function ws(e) {
  return !!(e && $(e.append) && e[Mt] === "FormData" && e[Ce]);
}
const Es = (e) => {
  const t = /* @__PURE__ */ new WeakSet(), n = (s) => {
    if (ye(s)) {
      if (t.has(s))
        return;
      if (me(s))
        return s;
      if (!("toJSON" in s)) {
        t.add(s);
        const r = oe(s) ? [] : {};
        return Ae(s, (o, i) => {
          const l = n(o);
          !he(l) && (r[i] = l);
        }), t.delete(s), r;
      }
    }
    return s;
  };
  return n(e);
}, Rs = z("AsyncFunction"), Ss = (e) => e && (ye(e) || $(e)) && $(e.then) && $(e.catch), Kt = ((e, t) => e ? setImmediate : t ? ((n, s) => (ne.addEventListener(
  "message",
  ({ source: r, data: o }) => {
    r === ne && o === n && s.length && s.shift()();
  },
  !1
), (r) => {
  s.push(r), ne.postMessage(n, "*");
}))(`axios@${Math.random()}`, []) : (n) => setTimeout(n))(typeof setImmediate == "function", $(ne.postMessage)), Os = typeof queueMicrotask < "u" ? queueMicrotask.bind(ne) : typeof process < "u" && process.nextTick || Kt, Xt = (e) => e != null && $(e[Ce]), _s = (e) => e != null && _e(e, Ce) && Xt(e), a = {
  isArray: oe,
  isArrayBuffer: Ht,
  isBuffer: me,
  isFormData: Xn,
  isArrayBufferView: kn,
  isString: In,
  isNumber: Vt,
  isBoolean: jn,
  isObject: ye,
  isPlainObject: De,
  isEmptyObject: qn,
  isReadableStream: Qn,
  isRequest: Zn,
  isResponse: Yn,
  isHeaders: es,
  isUndefined: he,
  isDate: $n,
  isFile: Mn,
  isReactNativeBlob: Hn,
  isReactNative: Vn,
  isBlob: zn,
  isRegExp: hs,
  isFunction: $,
  isStream: Wn,
  isURLSearchParams: Gn,
  isTypedArray: ls,
  isFileList: Jn,
  forEach: Ae,
  merge: Ze,
  extend: ns,
  trim: ts,
  stripBOM: ss,
  inherits: rs,
  toFlatObject: os,
  kindOf: rt,
  kindOfTest: z,
  endsWith: is,
  toArray: as,
  forEachEntry: cs,
  matchAll: us,
  isHTMLForm: ds,
  hasOwnProperty: Fe,
  hasOwnProp: Fe,
  // an alias to avoid ESLint no-prototype-builtins detection
  hasOwnInPrototypeChain: _e,
  getSafeProp: Fn,
  reduceDescriptors: Wt,
  freezeMethods: ms,
  toObjectSet: ys,
  toCamelCase: fs,
  noop: gs,
  toFiniteNumber: bs,
  findKey: zt,
  global: ne,
  isContextDefined: Jt,
  isSpecCompliantForm: ws,
  toJSONObject: Es,
  isAsyncFn: Rs,
  isThenable: Ss,
  setImmediate: Kt,
  asap: Os,
  isIterable: Xt,
  isSafeIterable: _s
}, Cs = a.toObjectSet([
  "age",
  "authorization",
  "content-length",
  "content-type",
  "etag",
  "expires",
  "from",
  "host",
  "if-modified-since",
  "if-unmodified-since",
  "last-modified",
  "location",
  "max-forwards",
  "proxy-authorization",
  "referer",
  "retry-after",
  "user-agent"
]), As = (e) => {
  const t = {};
  let n, s, r;
  return e && e.split(`
`).forEach(function(i) {
    r = i.indexOf(":"), n = i.substring(0, r).trim().toLowerCase(), s = i.substring(r + 1).trim(), !(!n || t[n] && Cs[n]) && (n === "set-cookie" ? t[n] ? t[n].push(s) : t[n] = [s] : t[n] = t[n] ? t[n] + ", " + s : s);
  }), t;
};
function xs(e) {
  let t = 0, n = e.length;
  for (; t < n; ) {
    const s = e.charCodeAt(t);
    if (s !== 9 && s !== 32)
      break;
    t += 1;
  }
  for (; n > t; ) {
    const s = e.charCodeAt(n - 1);
    if (s !== 9 && s !== 32)
      break;
    n -= 1;
  }
  return t === 0 && n === e.length ? e : e.slice(t, n);
}
const Ts = new RegExp("[\\u0000-\\u0008\\u000a-\\u001f\\u007f]+", "g"), Ps = new RegExp("[^\\u0009\\u0020-\\u007e\\u0080-\\u00ff]+", "g");
function ot(e, t) {
  return a.isArray(e) ? e.map((n) => ot(n, t)) : xs(String(e).replace(t, ""));
}
const vs = (e) => ot(e, Ts), Ns = (e) => ot(e, Ps);
function Gt(e) {
  const t = /* @__PURE__ */ Object.create(null);
  return a.forEach(e.toJSON(), (n, s) => {
    t[s] = Ns(n);
  }), t;
}
const Rt = /* @__PURE__ */ Symbol("internals");
function Re(e) {
  return e && String(e).trim().toLowerCase();
}
function Le(e) {
  return e === !1 || e == null ? e : a.isArray(e) ? e.map(Le) : vs(String(e));
}
function Ds(e) {
  const t = /* @__PURE__ */ Object.create(null), n = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let s;
  for (; s = n.exec(e); )
    t[s[1]] = s[2];
  return t;
}
const Ls = (e) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(e.trim());
function Je(e, t, n, s, r) {
  if (a.isFunction(s))
    return s.call(this, t, n);
  if (r && (t = n), !!a.isString(t)) {
    if (a.isString(s))
      return t.indexOf(s) !== -1;
    if (a.isRegExp(s))
      return s.test(t);
  }
}
function Bs(e) {
  return e.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (t, n, s) => n.toUpperCase() + s);
}
function Us(e, t) {
  const n = a.toCamelCase(" " + t);
  ["get", "set", "has"].forEach((s) => {
    Object.defineProperty(e, s + n, {
      // Null-proto descriptor so a polluted Object.prototype.get cannot turn
      // this data descriptor into an accessor descriptor on the way in.
      __proto__: null,
      value: function(r, o, i) {
        return this[s].call(this, t, r, o, i);
      },
      configurable: !0
    });
  });
}
let j = class {
  constructor(t) {
    t && this.set(t);
  }
  set(t, n, s) {
    const r = this;
    function o(l, c, f) {
      const u = Re(c);
      if (!u)
        return;
      const p = a.findKey(r, u);
      (!p || r[p] === void 0 || f === !0 || f === void 0 && r[p] !== !1) && (r[p || c] = Le(l));
    }
    const i = (l, c) => a.forEach(l, (f, u) => o(f, u, c));
    if (a.isPlainObject(t) || t instanceof this.constructor)
      i(t, n);
    else if (a.isString(t) && (t = t.trim()) && !Ls(t))
      i(As(t), n);
    else if (a.isObject(t) && a.isSafeIterable(t)) {
      let l = /* @__PURE__ */ Object.create(null), c, f;
      for (const u of t) {
        if (!a.isArray(u))
          throw new TypeError("Object iterator must return a key-value pair");
        f = u[0], a.hasOwnProp(l, f) ? (c = l[f], l[f] = a.isArray(c) ? [...c, u[1]] : [c, u[1]]) : l[f] = u[1];
      }
      i(l, n);
    } else
      t != null && o(n, t, s);
    return this;
  }
  get(t, n) {
    if (t = Re(t), t) {
      const s = a.findKey(this, t);
      if (s) {
        const r = this[s];
        if (!n)
          return r;
        if (n === !0)
          return Ds(r);
        if (a.isFunction(n))
          return n.call(this, r, s);
        if (a.isRegExp(n))
          return n.exec(r);
        throw new TypeError("parser must be boolean|regexp|function");
      }
    }
  }
  has(t, n) {
    if (t = Re(t), t) {
      const s = a.findKey(this, t);
      return !!(s && this[s] !== void 0 && (!n || Je(this, this[s], s, n)));
    }
    return !1;
  }
  delete(t, n) {
    const s = this;
    let r = !1;
    function o(i) {
      if (i = Re(i), i) {
        const l = a.findKey(s, i);
        l && (!n || Je(s, s[l], l, n)) && (delete s[l], r = !0);
      }
    }
    return a.isArray(t) ? t.forEach(o) : o(t), r;
  }
  clear(t) {
    const n = Object.keys(this);
    let s = n.length, r = !1;
    for (; s--; ) {
      const o = n[s];
      (!t || Je(this, this[o], o, t, !0)) && (delete this[o], r = !0);
    }
    return r;
  }
  normalize(t) {
    const n = this, s = {};
    return a.forEach(this, (r, o) => {
      const i = a.findKey(s, o);
      if (i) {
        n[i] = Le(r), delete n[o];
        return;
      }
      const l = t ? Bs(o) : String(o).trim();
      l !== o && delete n[o], n[l] = Le(r), s[l] = !0;
    }), this;
  }
  concat(...t) {
    return this.constructor.concat(this, ...t);
  }
  toJSON(t) {
    const n = /* @__PURE__ */ Object.create(null);
    return a.forEach(this, (s, r) => {
      s != null && s !== !1 && (n[r] = t && a.isArray(s) ? s.join(", ") : s);
    }), n;
  }
  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }
  toString() {
    return Object.entries(this.toJSON()).map(([t, n]) => t + ": " + n).join(`
`);
  }
  getSetCookie() {
    return this.get("set-cookie") || [];
  }
  get [Symbol.toStringTag]() {
    return "AxiosHeaders";
  }
  static from(t) {
    return t instanceof this ? t : new this(t);
  }
  static concat(t, ...n) {
    const s = new this(t);
    return n.forEach((r) => s.set(r)), s;
  }
  static accessor(t) {
    const s = (this[Rt] = this[Rt] = {
      accessors: {}
    }).accessors, r = this.prototype;
    function o(i) {
      const l = Re(i);
      s[l] || (Us(r, i), s[l] = !0);
    }
    return a.isArray(t) ? t.forEach(o) : o(t), this;
  }
};
j.accessor([
  "Content-Type",
  "Content-Length",
  "Accept",
  "Accept-Encoding",
  "User-Agent",
  "Authorization"
]);
a.reduceDescriptors(j.prototype, ({ value: e }, t) => {
  let n = t[0].toUpperCase() + t.slice(1);
  return {
    get: () => e,
    set(s) {
      this[n] = s;
    }
  };
});
a.freezeMethods(j);
const Fs = "[REDACTED ****]";
function ks(e) {
  if (a.hasOwnProp(e, "toJSON"))
    return !0;
  let t = Object.getPrototypeOf(e);
  for (; t && t !== Object.prototype; ) {
    if (a.hasOwnProp(t, "toJSON"))
      return !0;
    t = Object.getPrototypeOf(t);
  }
  return !1;
}
function Is(e, t) {
  const n = new Set(t.map((o) => String(o).toLowerCase())), s = [], r = (o) => {
    if (o === null || typeof o != "object" || a.isBuffer(o)) return o;
    if (s.indexOf(o) !== -1) return;
    o instanceof j && (o = o.toJSON()), s.push(o);
    let i;
    if (a.isArray(o))
      i = [], o.forEach((l, c) => {
        const f = r(l);
        a.isUndefined(f) || (i[c] = f);
      });
    else {
      if (!a.isPlainObject(o) && ks(o))
        return s.pop(), o;
      i = /* @__PURE__ */ Object.create(null);
      for (const [l, c] of Object.entries(o)) {
        const f = n.has(l.toLowerCase()) ? Fs : r(c);
        a.isUndefined(f) || (i[l] = f);
      }
    }
    return s.pop(), i;
  };
  return r(e);
}
let y = class Qt extends Error {
  static from(t, n, s, r, o, i) {
    const l = new Qt(t.message, n || t.code, s, r, o);
    return Object.defineProperty(l, "cause", {
      __proto__: null,
      value: t,
      writable: !0,
      enumerable: !1,
      configurable: !0
    }), l.name = t.name, t.status != null && l.status == null && (l.status = t.status), i && Object.assign(l, i), l;
  }
  /**
   * Create an Error with the specified message, config, error code, request and response.
   *
   * @param {string} message The error message.
   * @param {string} [code] The error code (for example, 'ECONNABORTED').
   * @param {Object} [config] The config.
   * @param {Object} [request] The request.
   * @param {Object} [response] The response.
   *
   * @returns {Error} The created error.
   */
  constructor(t, n, s, r, o) {
    super(t), Object.defineProperty(this, "message", {
      // Null-proto descriptor so a polluted Object.prototype.get cannot turn
      // this data descriptor into an accessor descriptor on the way in.
      __proto__: null,
      value: t,
      enumerable: !0,
      writable: !0,
      configurable: !0
    }), this.name = "AxiosError", this.isAxiosError = !0, n && (this.code = n), s && (this.config = s), r && (this.request = r), o && (this.response = o, this.status = o.status);
  }
  toJSON() {
    const t = this.config, n = t && a.hasOwnProp(t, "redact") ? t.redact : void 0, s = a.isArray(n) && n.length > 0 ? Is(t, n) : a.toJSONObject(t);
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: s,
      code: this.code,
      status: this.status
    };
  }
};
y.ERR_BAD_OPTION_VALUE = "ERR_BAD_OPTION_VALUE";
y.ERR_BAD_OPTION = "ERR_BAD_OPTION";
y.ECONNABORTED = "ECONNABORTED";
y.ETIMEDOUT = "ETIMEDOUT";
y.ECONNREFUSED = "ECONNREFUSED";
y.ERR_NETWORK = "ERR_NETWORK";
y.ERR_FR_TOO_MANY_REDIRECTS = "ERR_FR_TOO_MANY_REDIRECTS";
y.ERR_DEPRECATED = "ERR_DEPRECATED";
y.ERR_BAD_RESPONSE = "ERR_BAD_RESPONSE";
y.ERR_BAD_REQUEST = "ERR_BAD_REQUEST";
y.ERR_CANCELED = "ERR_CANCELED";
y.ERR_NOT_SUPPORT = "ERR_NOT_SUPPORT";
y.ERR_INVALID_URL = "ERR_INVALID_URL";
y.ERR_FORM_DATA_DEPTH_EXCEEDED = "ERR_FORM_DATA_DEPTH_EXCEEDED";
const js = null, Zt = 100;
function Ye(e) {
  return a.isPlainObject(e) || a.isArray(e);
}
function Yt(e) {
  return a.endsWith(e, "[]") ? e.slice(0, -2) : e;
}
function We(e, t, n) {
  return e ? e.concat(t).map(function(r, o) {
    return r = Yt(r), !n && o ? "[" + r + "]" : r;
  }).join(n ? "." : "") : t;
}
function qs(e) {
  return a.isArray(e) && !e.some(Ye);
}
const $s = a.toFlatObject(a, {}, null, function(t) {
  return /^is[A-Z]/.test(t);
});
function qe(e, t, n) {
  if (!a.isObject(e))
    throw new TypeError("target must be an object");
  t = t || new FormData(), n = a.toFlatObject(
    n,
    {
      metaTokens: !0,
      dots: !1,
      indexes: !1
    },
    !1,
    function(w, R) {
      return !a.isUndefined(R[w]);
    }
  );
  const s = n.metaTokens, r = n.visitor || h, o = n.dots, i = n.indexes, l = n.Blob || typeof Blob < "u" && Blob, c = n.maxDepth === void 0 ? Zt : n.maxDepth, f = l && a.isSpecCompliantForm(t), u = [];
  if (!a.isFunction(r))
    throw new TypeError("visitor must be a function");
  function p(d) {
    if (d === null) return "";
    if (a.isDate(d))
      return d.toISOString();
    if (a.isBoolean(d))
      return d.toString();
    if (!f && a.isBlob(d))
      throw new y("Blob is not supported. Use a Buffer instead.");
    if (a.isArrayBuffer(d) || a.isTypedArray(d)) {
      if (f && typeof l == "function")
        return new l([d]);
      if (typeof Buffer < "u")
        return Buffer.from(d);
      throw new y("Blob is not supported. Use a Buffer instead.", y.ERR_NOT_SUPPORT);
    }
    return d;
  }
  function E(d) {
    if (d > c)
      throw new y(
        "Object is too deeply nested (" + d + " levels). Max depth: " + c,
        y.ERR_FORM_DATA_DEPTH_EXCEEDED
      );
  }
  function m(d, w) {
    if (c === 1 / 0)
      return JSON.stringify(d);
    const R = [];
    return JSON.stringify(d, function(D, T) {
      if (!a.isObject(T))
        return T;
      for (; R.length && R[R.length - 1] !== this; )
        R.pop();
      return R.push(T), E(w + R.length - 1), T;
    });
  }
  function h(d, w, R) {
    let A = d;
    if (a.isReactNative(t) && a.isReactNativeBlob(d))
      return t.append(We(R, w, o), p(d)), !1;
    if (d && !R && typeof d == "object") {
      if (a.endsWith(w, "{}"))
        w = s ? w : w.slice(0, -2), d = m(d, 1);
      else if (a.isArray(d) && qs(d) || (a.isFileList(d) || a.endsWith(w, "[]")) && (A = a.toArray(d)))
        return w = Yt(w), A.forEach(function(T, J) {
          !(a.isUndefined(T) || T === null) && t.append(
            // eslint-disable-next-line no-nested-ternary
            i === !0 ? We([w], J, o) : i === null ? w : w + "[]",
            p(T)
          );
        }), !1;
    }
    return Ye(d) ? !0 : (t.append(We(R, w, o), p(d)), !1);
  }
  const b = Object.assign($s, {
    defaultVisitor: h,
    convertValue: p,
    isVisitable: Ye
  });
  function g(d, w, R = 0) {
    if (!a.isUndefined(d)) {
      if (E(R), u.indexOf(d) !== -1)
        throw new Error("Circular reference detected in " + w.join("."));
      u.push(d), a.forEach(d, function(D, T) {
        (!(a.isUndefined(D) || D === null) && r.call(t, D, a.isString(T) ? T.trim() : T, w, b)) === !0 && g(D, w ? w.concat(T) : [T], R + 1);
      }), u.pop();
    }
  }
  if (!a.isObject(e))
    throw new TypeError("data must be an object");
  return g(e), t;
}
function St(e) {
  const t = {
    "!": "%21",
    "'": "%27",
    "(": "%28",
    ")": "%29",
    "~": "%7E",
    "%20": "+"
  };
  return encodeURIComponent(e).replace(/[!'()~]|%20/g, function(s) {
    return t[s];
  });
}
function it(e, t) {
  this._pairs = [], e && qe(e, this, t);
}
const en = it.prototype;
en.append = function(t, n) {
  this._pairs.push([t, n]);
};
en.toString = function(t) {
  const n = t ? (s) => t.call(this, s, St) : St;
  return this._pairs.map(function(r) {
    return n(r[0]) + "=" + n(r[1]);
  }, "").join("&");
};
function Ms(e) {
  return encodeURIComponent(e).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+");
}
function tn(e, t, n) {
  if (!t)
    return e;
  e = e || "";
  const s = a.isFunction(n) ? {
    serialize: n
  } : n, r = a.getSafeProp(s, "encode") || Ms, o = a.getSafeProp(s, "serialize");
  let i;
  if (o ? i = o(t, s) : i = a.isURLSearchParams(t) ? t.toString() : new it(t, s).toString(r), i) {
    const l = e.indexOf("#");
    l !== -1 && (e = e.slice(0, l)), e += (e.indexOf("?") === -1 ? "?" : "&") + i;
  }
  return e;
}
class Ot {
  constructor() {
    this.handlers = [];
  }
  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   * @param {Object} options The options for the interceptor, synchronous and runWhen
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(t, n, s) {
    return this.handlers.push({
      fulfilled: t,
      rejected: n,
      synchronous: s ? s.synchronous : !1,
      runWhen: s ? s.runWhen : null
    }), this.handlers.length - 1;
  }
  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {void}
   */
  eject(t) {
    this.handlers[t] && (this.handlers[t] = null);
  }
  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    this.handlers && (this.handlers = []);
  }
  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */
  forEach(t) {
    a.forEach(this.handlers, function(s) {
      s !== null && t(s);
    });
  }
}
const at = {
  silentJSONParsing: !0,
  forcedJSONParsing: !0,
  clarifyTimeoutError: !1,
  legacyInterceptorReqResOrdering: !0,
  advertiseZstdAcceptEncoding: !1,
  validateStatusUndefinedResolves: !0
}, Hs = typeof URLSearchParams < "u" ? URLSearchParams : it, Vs = typeof FormData < "u" ? FormData : null, zs = typeof Blob < "u" ? Blob : null, Js = {
  isBrowser: !0,
  classes: {
    URLSearchParams: Hs,
    FormData: Vs,
    Blob: zs
  },
  protocols: ["http", "https", "file", "blob", "url", "data"]
}, lt = typeof window < "u" && typeof document < "u", et = typeof navigator == "object" && navigator || void 0, Ws = lt && (!et || ["ReactNative", "NativeScript", "NS"].indexOf(et.product) < 0), Ks = typeof WorkerGlobalScope < "u" && // eslint-disable-next-line no-undef
self instanceof WorkerGlobalScope && typeof self.importScripts == "function", Xs = lt && window.location.href || "http://localhost", Gs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  hasBrowserEnv: lt,
  hasStandardBrowserEnv: Ws,
  hasStandardBrowserWebWorkerEnv: Ks,
  navigator: et,
  origin: Xs
}, Symbol.toStringTag, { value: "Module" })), k = {
  ...Gs,
  ...Js
};
function Qs(e, t) {
  return qe(e, new k.classes.URLSearchParams(), {
    visitor: function(n, s, r, o) {
      return k.isNode && a.isBuffer(n) ? (this.append(s, n.toString("base64")), !1) : o.defaultVisitor.apply(this, arguments);
    },
    ...t
  });
}
const _t = Zt;
function nn(e) {
  if (e > _t)
    throw new y(
      "FormData field is too deeply nested (" + e + " levels). Max depth: " + _t,
      y.ERR_FORM_DATA_DEPTH_EXCEEDED
    );
}
function Zs(e) {
  const t = [], n = /\w+|\[(\w*)]/g;
  let s;
  for (; (s = n.exec(e)) !== null; )
    nn(t.length), t.push(s[0] === "[]" ? "" : s[1] || s[0]);
  return t;
}
function Ys(e) {
  const t = {}, n = Object.keys(e);
  let s;
  const r = n.length;
  let o;
  for (s = 0; s < r; s++)
    o = n[s], t[o] = e[o];
  return t;
}
function sn(e) {
  function t(n, s, r, o) {
    nn(o);
    let i = n[o++];
    if (i === "__proto__") return !0;
    const l = Number.isFinite(+i), c = o >= n.length;
    return i = !i && a.isArray(r) ? r.length : i, c ? (a.hasOwnProp(r, i) ? r[i] = a.isArray(r[i]) ? r[i].concat(s) : [r[i], s] : r[i] = s, !l) : ((!a.hasOwnProp(r, i) || !a.isObject(r[i])) && (r[i] = []), t(n, s, r[i], o) && a.isArray(r[i]) && (r[i] = Ys(r[i])), !l);
  }
  if (a.isFormData(e) && a.isFunction(e.entries)) {
    const n = {};
    return a.forEachEntry(e, (s, r) => {
      t(Zs(s), r, n, 0);
    }), n;
  }
  return null;
}
const ue = (e, t) => e != null && a.hasOwnProp(e, t) ? e[t] : void 0;
function er(e, t, n) {
  if (a.isString(e))
    try {
      return (t || JSON.parse)(e), a.trim(e);
    } catch (s) {
      if (s.name !== "SyntaxError")
        throw s;
    }
  return (n || JSON.stringify)(e);
}
const xe = {
  transitional: at,
  adapter: ["xhr", "http", "fetch"],
  transformRequest: [
    function(t, n) {
      const s = n.getContentType() || "", r = s.indexOf("application/json") > -1, o = a.isObject(t);
      if (o && a.isHTMLForm(t) && (t = new FormData(t)), a.isFormData(t))
        return r ? JSON.stringify(sn(t)) : t;
      if (a.isArrayBuffer(t) || a.isBuffer(t) || a.isStream(t) || a.isFile(t) || a.isBlob(t) || a.isReadableStream(t))
        return t;
      if (a.isArrayBufferView(t))
        return t.buffer;
      if (a.isURLSearchParams(t))
        return n.setContentType("application/x-www-form-urlencoded;charset=utf-8", !1), t.toString();
      let l;
      if (o) {
        const c = ue(this, "formSerializer");
        if (s.indexOf("application/x-www-form-urlencoded") > -1)
          return Qs(t, c).toString();
        if ((l = a.isFileList(t)) || s.indexOf("multipart/form-data") > -1) {
          const f = ue(this, "env"), u = f && f.FormData;
          return qe(
            l ? { "files[]": t } : t,
            u && new u(),
            c
          );
        }
      }
      return o || r ? (n.setContentType("application/json", !1), er(t)) : t;
    }
  ],
  transformResponse: [
    function(t) {
      const n = ue(this, "transitional") || xe.transitional, s = n && n.forcedJSONParsing, r = ue(this, "responseType"), o = r === "json";
      if (a.isResponse(t) || a.isReadableStream(t))
        return t;
      if (t && a.isString(t) && (s && !r || o)) {
        const l = !(n && n.silentJSONParsing) && o;
        try {
          return JSON.parse(t, ue(this, "parseReviver"));
        } catch (c) {
          if (l)
            throw c.name === "SyntaxError" ? y.from(c, y.ERR_BAD_RESPONSE, this, null, ue(this, "response")) : c;
        }
      }
      return t;
    }
  ],
  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  maxContentLength: -1,
  maxBodyLength: -1,
  env: {
    FormData: k.classes.FormData,
    Blob: k.classes.Blob
  },
  validateStatus: function(t) {
    return t >= 200 && t < 300;
  },
  headers: {
    common: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": void 0
    }
  }
};
a.forEach(["delete", "get", "head", "post", "put", "patch", "query"], (e) => {
  xe.headers[e] = {};
});
function Ke(e, t) {
  const n = this || xe, s = t || n, r = j.from(s.headers);
  let o = s.data;
  return a.forEach(e, function(l) {
    o = l.call(n, o, r.normalize(), t ? t.status : void 0);
  }), r.normalize(), o;
}
function rn(e) {
  return !!(e && e.__CANCEL__);
}
let Te = class extends y {
  /**
   * A `CanceledError` is an object that is thrown when an operation is canceled.
   *
   * @param {string=} message The message.
   * @param {Object=} config The config.
   * @param {Object=} request The request.
   *
   * @returns {CanceledError} The created error.
   */
  constructor(t, n, s) {
    super(t ?? "canceled", y.ERR_CANCELED, n, s), this.name = "CanceledError", this.__CANCEL__ = !0;
  }
};
function on(e, t, n) {
  const s = n.config.validateStatus;
  !n.status || !s || s(n.status) ? e(n) : t(new y(
    "Request failed with status code " + n.status,
    n.status >= 400 && n.status < 500 ? y.ERR_BAD_REQUEST : y.ERR_BAD_RESPONSE,
    n.config,
    n.request,
    n
  ));
}
function tr(e) {
  const t = /^([-+\w]{1,25}):(?:\/\/)?/.exec(e);
  return t && t[1] || "";
}
function nr(e, t) {
  e = e || 10;
  const n = new Array(e), s = new Array(e);
  let r = 0, o = 0, i;
  return t = t !== void 0 ? t : 1e3, function(c) {
    const f = Date.now(), u = s[o];
    i || (i = f), n[r] = c, s[r] = f;
    let p = o, E = 0;
    for (; p !== r; )
      E += n[p++], p = p % e;
    if (r = (r + 1) % e, r === o && (o = (o + 1) % e), f - i < t)
      return;
    const m = u && f - u;
    return m ? Math.round(E * 1e3 / m) : void 0;
  };
}
function sr(e, t) {
  let n = 0, s = 1e3 / t, r, o;
  const i = (f, u = Date.now()) => {
    n = u, r = null, o && (clearTimeout(o), o = null), e(...f);
  };
  return [(...f) => {
    const u = Date.now(), p = u - n;
    p >= s ? i(f, u) : (r = f, o || (o = setTimeout(() => {
      o = null, i(r);
    }, s - p)));
  }, () => r && i(r)];
}
const ke = (e, t, n = 3) => {
  let s = 0;
  const r = nr(50, 250);
  return sr((o) => {
    if (!o || typeof o.loaded != "number")
      return;
    const i = o.loaded, l = o.lengthComputable ? o.total : void 0, c = l != null ? Math.min(i, l) : i, f = Math.max(0, c - s), u = r(f);
    s = Math.max(s, c);
    const p = {
      loaded: c,
      total: l,
      progress: l ? c / l : void 0,
      bytes: f,
      rate: u || void 0,
      estimated: u && l ? (l - c) / u : void 0,
      event: o,
      lengthComputable: l != null,
      [t ? "download" : "upload"]: !0
    };
    e(p);
  }, n);
}, Ct = (e, t) => {
  const n = e != null;
  return [
    (s) => t[0]({
      lengthComputable: n,
      total: e,
      loaded: s
    }),
    t[1]
  ];
}, At = (e) => (...t) => a.asap(() => e(...t)), rr = k.hasStandardBrowserEnv ? /* @__PURE__ */ ((e, t) => (n) => (n = new URL(n, k.origin), e.protocol === n.protocol && e.host === n.host && (t || e.port === n.port)))(
  new URL(k.origin),
  k.navigator && /(msie|trident)/i.test(k.navigator.userAgent)
) : () => !0, or = k.hasStandardBrowserEnv ? (
  // Standard browser envs support document.cookie
  {
    write(e, t, n, s, r, o, i) {
      if (typeof document > "u") return;
      const l = [`${e}=${encodeURIComponent(t)}`];
      a.isNumber(n) && l.push(`expires=${new Date(n).toUTCString()}`), a.isString(s) && l.push(`path=${s}`), a.isString(r) && l.push(`domain=${r}`), o === !0 && l.push("secure"), a.isString(i) && l.push(`SameSite=${i}`), document.cookie = l.join("; ");
    },
    read(e) {
      if (typeof document > "u") return null;
      const t = document.cookie.split(";");
      for (let n = 0; n < t.length; n++) {
        const s = t[n].replace(/^\s+/, ""), r = s.indexOf("=");
        if (r !== -1 && s.slice(0, r) === e)
          try {
            return decodeURIComponent(s.slice(r + 1));
          } catch {
            return s.slice(r + 1);
          }
      }
      return null;
    },
    remove(e) {
      this.write(e, "", Date.now() - 864e5, "/");
    }
  }
) : (
  // Non-standard browser env (web workers, react-native) lack needed support.
  {
    write() {
    },
    read() {
      return null;
    },
    remove() {
    }
  }
);
function ir(e) {
  return typeof e != "string" ? !1 : /^([a-z][a-z\d+\-.]*:)?\/\//i.test(e);
}
function ar(e, t) {
  return t ? e.replace(/\/?\/$/, "") + "/" + t.replace(/^\/+/, "") : e;
}
const lr = /^https?:(?!\/\/)/i, cr = /[\t\n\r]/g;
function ur(e) {
  let t = 0;
  for (; t < e.length && e.charCodeAt(t) <= 32; )
    t++;
  return e.slice(t);
}
function dr(e) {
  return ur(e).replace(cr, "");
}
function xt(e, t) {
  if (typeof e == "string" && lr.test(dr(e)))
    throw new y(
      'Invalid URL: missing "//" after protocol',
      y.ERR_INVALID_URL,
      t
    );
}
function an(e, t, n, s) {
  xt(t, s);
  let r = !ir(t);
  return e && (r || n === !1) ? (xt(e, s), ar(e, t)) : t;
}
const Tt = (e) => e instanceof j ? { ...e } : e;
function ie(e, t) {
  e = e || {}, t = t || {};
  const n = /* @__PURE__ */ Object.create(null);
  Object.defineProperty(n, "hasOwnProperty", {
    // Null-proto descriptor so a polluted Object.prototype.get cannot turn
    // this data descriptor into an accessor descriptor on the way in.
    __proto__: null,
    value: Object.prototype.hasOwnProperty,
    enumerable: !1,
    writable: !0,
    configurable: !0
  });
  function s(u, p, E, m) {
    return a.isPlainObject(u) && a.isPlainObject(p) ? a.merge.call({ caseless: m }, u, p) : a.isPlainObject(p) ? a.merge({}, p) : a.isArray(p) ? p.slice() : p;
  }
  function r(u, p, E, m) {
    if (a.isUndefined(p)) {
      if (!a.isUndefined(u))
        return s(void 0, u, E, m);
    } else return s(u, p, E, m);
  }
  function o(u, p) {
    if (!a.isUndefined(p))
      return s(void 0, p);
  }
  function i(u, p) {
    if (a.isUndefined(p)) {
      if (!a.isUndefined(u))
        return s(void 0, u);
    } else return s(void 0, p);
  }
  function l(u) {
    const p = a.hasOwnProp(t, "transitional") ? t.transitional : void 0;
    if (!a.isUndefined(p))
      if (a.isPlainObject(p)) {
        if (a.hasOwnProp(p, u))
          return p[u];
      } else
        return;
    const E = a.hasOwnProp(e, "transitional") ? e.transitional : void 0;
    if (a.isPlainObject(E) && a.hasOwnProp(E, u))
      return E[u];
  }
  function c(u, p, E) {
    if (a.hasOwnProp(t, E))
      return s(u, p);
    if (a.hasOwnProp(e, E))
      return s(void 0, u);
  }
  const f = {
    url: o,
    method: o,
    data: o,
    baseURL: i,
    transformRequest: i,
    transformResponse: i,
    paramsSerializer: i,
    timeout: i,
    timeoutMessage: i,
    withCredentials: i,
    withXSRFToken: i,
    adapter: i,
    responseType: i,
    xsrfCookieName: i,
    xsrfHeaderName: i,
    onUploadProgress: i,
    onDownloadProgress: i,
    decompress: i,
    maxContentLength: i,
    maxBodyLength: i,
    beforeRedirect: i,
    transport: i,
    httpAgent: i,
    httpsAgent: i,
    cancelToken: i,
    socketPath: i,
    allowedSocketPaths: i,
    responseEncoding: i,
    validateStatus: c,
    headers: (u, p, E) => r(Tt(u), Tt(p), E, !0)
  };
  return a.forEach(Object.keys({ ...e, ...t }), function(p) {
    if (p === "__proto__" || p === "constructor" || p === "prototype") return;
    const E = a.hasOwnProp(f, p) ? f[p] : r, m = a.hasOwnProp(e, p) ? e[p] : void 0, h = a.hasOwnProp(t, p) ? t[p] : void 0, b = E(m, h, p);
    a.isUndefined(b) && E !== c || (n[p] = b);
  }), a.hasOwnProp(t, "validateStatus") && a.isUndefined(t.validateStatus) && l("validateStatusUndefinedResolves") === !1 && (a.hasOwnProp(e, "validateStatus") ? n.validateStatus = s(void 0, e.validateStatus) : delete n.validateStatus), n;
}
const fr = ["content-type", "content-length"];
function pr(e, t, n) {
  if (n !== "content-only") {
    e.set(t);
    return;
  }
  Object.entries(t || {}).forEach(([s, r]) => {
    fr.includes(s.toLowerCase()) && e.set(s, r);
  });
}
const hr = (e) => encodeURIComponent(e).replace(
  /%([0-9A-F]{2})/gi,
  (t, n) => String.fromCharCode(parseInt(n, 16))
);
function ln(e) {
  const t = ie({}, e), n = (E) => a.hasOwnProp(t, E) ? t[E] : void 0, s = n("data");
  let r = n("withXSRFToken");
  const o = n("xsrfHeaderName"), i = n("xsrfCookieName");
  let l = n("headers");
  const c = n("auth"), f = n("baseURL"), u = n("allowAbsoluteUrls"), p = n("url");
  if (t.headers = l = j.from(l), t.url = tn(
    an(f, p, u, t),
    n("params"),
    n("paramsSerializer")
  ), c) {
    const E = a.getSafeProp(c, "username") || "", m = a.getSafeProp(c, "password") || "";
    try {
      l.set(
        "Authorization",
        "Basic " + btoa(E + ":" + (m ? hr(m) : ""))
      );
    } catch (h) {
      throw y.from(h, y.ERR_BAD_OPTION_VALUE, e);
    }
  }
  if (a.isFormData(s) && (k.hasStandardBrowserEnv || k.hasStandardBrowserWebWorkerEnv || a.isReactNative(s) ? l.setContentType(void 0) : a.isFunction(s.getHeaders) && pr(l, s.getHeaders(), n("formDataHeaderPolicy"))), k.hasStandardBrowserEnv && (a.isFunction(r) && (r = r(t)), r === !0 || r == null && rr(t.url))) {
    const m = o && i && or.read(i);
    m && l.set(o, m);
  }
  return t;
}
const mr = typeof XMLHttpRequest < "u", yr = mr && function(e) {
  return new Promise(function(n, s) {
    const r = ln(e);
    let o = r.data;
    const i = j.from(r.headers).normalize();
    let { responseType: l, onUploadProgress: c, onDownloadProgress: f } = r, u, p, E, m, h;
    function b() {
      m && m(), h && h(), r.cancelToken && r.cancelToken.unsubscribe(u), r.signal && r.signal.removeEventListener("abort", u);
    }
    let g = new XMLHttpRequest();
    g.open(r.method.toUpperCase(), r.url, !0), g.timeout = r.timeout;
    function d() {
      if (!g)
        return;
      const R = j.from(
        "getAllResponseHeaders" in g && g.getAllResponseHeaders()
      ), D = {
        data: !l || l === "text" || l === "json" ? g.responseText : g.response,
        status: g.status,
        statusText: g.statusText,
        headers: R,
        config: e,
        request: g
      };
      on(
        function(J) {
          n(J), b();
        },
        function(J) {
          s(J), b();
        },
        D
      ), g = null;
    }
    "onloadend" in g ? g.onloadend = d : g.onreadystatechange = function() {
      !g || g.readyState !== 4 || g.status === 0 && !(g.responseURL && g.responseURL.startsWith("file:")) || setTimeout(d);
    }, g.onabort = function() {
      g && (s(new y("Request aborted", y.ECONNABORTED, e, g)), b(), g = null);
    }, g.onerror = function(A) {
      const D = A && A.message ? A.message : "Network Error", T = new y(D, y.ERR_NETWORK, e, g);
      T.event = A || null, s(T), b(), g = null;
    }, g.ontimeout = function() {
      let A = r.timeout ? "timeout of " + r.timeout + "ms exceeded" : "timeout exceeded";
      const D = r.transitional || at;
      r.timeoutErrorMessage && (A = r.timeoutErrorMessage), s(
        new y(
          A,
          D.clarifyTimeoutError ? y.ETIMEDOUT : y.ECONNABORTED,
          e,
          g
        )
      ), b(), g = null;
    }, o === void 0 && i.setContentType(null), "setRequestHeader" in g && a.forEach(Gt(i), function(A, D) {
      g.setRequestHeader(D, A);
    }), a.isUndefined(r.withCredentials) || (g.withCredentials = !!r.withCredentials), l && l !== "json" && (g.responseType = r.responseType), f && ([E, h] = ke(f, !0), g.addEventListener("progress", E)), c && g.upload && ([p, m] = ke(c), g.upload.addEventListener("progress", p), g.upload.addEventListener("loadend", m)), (r.cancelToken || r.signal) && (u = (R) => {
      g && (s(!R || R.type ? new Te(null, e, g) : R), g.abort(), b(), g = null);
    }, r.cancelToken && r.cancelToken.subscribe(u), r.signal && (r.signal.aborted ? u() : r.signal.addEventListener("abort", u)));
    const w = tr(r.url);
    if (w && !k.protocols.includes(w)) {
      s(
        new y(
          "Unsupported protocol " + w + ":",
          y.ERR_BAD_REQUEST,
          e
        )
      ), b();
      return;
    }
    g.send(o || null);
  });
}, gr = (e, t) => {
  if (e = e ? e.filter(Boolean) : [], !t && !e.length)
    return;
  const n = new AbortController();
  let s = !1;
  const r = function(c) {
    if (!s) {
      s = !0, i();
      const f = c instanceof Error ? c : this.reason;
      n.abort(
        f instanceof y ? f : new Te(f instanceof Error ? f.message : f)
      );
    }
  };
  let o = t && setTimeout(() => {
    o = null, r(new y(`timeout of ${t}ms exceeded`, y.ETIMEDOUT));
  }, t);
  const i = () => {
    e && (o && clearTimeout(o), o = null, e.forEach((c) => {
      c.unsubscribe ? c.unsubscribe(r) : c.removeEventListener("abort", r);
    }), e = null);
  };
  e.forEach((c) => c.addEventListener("abort", r, { once: !0 }));
  const { signal: l } = n;
  return l.unsubscribe = () => a.asap(i), l;
}, br = function* (e, t) {
  let n = e.byteLength;
  if (n < t) {
    yield e;
    return;
  }
  let s = 0, r;
  for (; s < n; )
    r = s + t, yield e.slice(s, r), s = r;
}, wr = async function* (e, t) {
  for await (const n of Er(e))
    yield* br(n, t);
}, Er = async function* (e) {
  if (e[Symbol.asyncIterator]) {
    yield* e;
    return;
  }
  const t = e.getReader();
  try {
    for (; ; ) {
      const { done: n, value: s } = await t.read();
      if (n)
        break;
      yield s;
    }
  } finally {
    await t.cancel();
  }
}, Pt = (e, t, n, s) => {
  const r = wr(e, t);
  let o = 0, i, l = (c) => {
    i || (i = !0, s && s(c));
  };
  return new ReadableStream(
    {
      async pull(c) {
        try {
          const { done: f, value: u } = await r.next();
          if (f) {
            l(), c.close();
            return;
          }
          let p = u.byteLength;
          if (n) {
            let E = o += p;
            n(E);
          }
          c.enqueue(new Uint8Array(u));
        } catch (f) {
          throw l(f), f;
        }
      },
      cancel(c) {
        return l(c), r.return();
      }
    },
    {
      highWaterMark: 2
    }
  );
}, Ie = (e) => e >= 48 && e <= 57 || e >= 65 && e <= 70 || e >= 97 && e <= 102, Rr = (e, t, n) => t + 2 < n && Ie(e.charCodeAt(t + 1)) && Ie(e.charCodeAt(t + 2));
function Sr(e) {
  if (!e || typeof e != "string" || !e.startsWith("data:")) return 0;
  const t = e.indexOf(",");
  if (t < 0) return 0;
  const n = e.slice(5, t), s = e.slice(t + 1);
  if (/;base64/i.test(n)) {
    let i = s.length;
    const l = s.length;
    for (let m = 0; m < l; m++)
      if (s.charCodeAt(m) === 37 && m + 2 < l) {
        const h = s.charCodeAt(m + 1), b = s.charCodeAt(m + 2);
        Ie(h) && Ie(b) && (i -= 2, m += 2);
      }
    let c = 0, f = l - 1;
    const u = (m) => m >= 2 && s.charCodeAt(m - 2) === 37 && // '%'
    s.charCodeAt(m - 1) === 51 && // '3'
    (s.charCodeAt(m) === 68 || s.charCodeAt(m) === 100);
    f >= 0 && (s.charCodeAt(f) === 61 ? (c++, f--) : u(f) && (c++, f -= 3)), c === 1 && f >= 0 && (s.charCodeAt(f) === 61 || u(f)) && c++;
    const E = Math.floor(i / 4) * 3 - (c || 0);
    return E > 0 ? E : 0;
  }
  let o = 0;
  for (let i = 0, l = s.length; i < l; i++) {
    const c = s.charCodeAt(i);
    if (c === 37 && Rr(s, i, l))
      o += 1, i += 2;
    else if (c < 128)
      o += 1;
    else if (c < 2048)
      o += 2;
    else if (c >= 55296 && c <= 56319 && i + 1 < l) {
      const f = s.charCodeAt(i + 1);
      f >= 56320 && f <= 57343 ? (o += 4, i++) : o += 3;
    } else
      o += 3;
  }
  return o;
}
const ct = "1.18.1", vt = 64 * 1024, { isFunction: Ne } = a, Or = (e) => encodeURIComponent(e).replace(
  /%([0-9A-F]{2})/gi,
  (t, n) => String.fromCharCode(parseInt(n, 16))
), Nt = (e) => {
  if (!a.isString(e))
    return e;
  try {
    return decodeURIComponent(e);
  } catch {
    return e;
  }
}, Dt = (e, ...t) => {
  try {
    return !!e(...t);
  } catch {
    return !1;
  }
}, _r = (e) => {
  const t = e.indexOf("://");
  let n = e;
  return t !== -1 && (n = n.slice(t + 3)), n.includes("@") || n.includes(":");
}, Cr = (e) => {
  const t = a.global !== void 0 && a.global !== null ? a.global : globalThis, { ReadableStream: n, TextEncoder: s } = t;
  e = a.merge.call(
    {
      skipUndefined: !0
    },
    {
      Request: t.Request,
      Response: t.Response
    },
    e
  );
  const { fetch: r, Request: o, Response: i } = e, l = r ? Ne(r) : typeof fetch == "function", c = Ne(o), f = Ne(i);
  if (!l)
    return !1;
  const u = l && Ne(n), p = l && (typeof s == "function" ? /* @__PURE__ */ ((d) => (w) => d.encode(w))(new s()) : async (d) => new Uint8Array(await new o(d).arrayBuffer())), E = c && u && Dt(() => {
    let d = !1;
    const w = new o(k.origin, {
      body: new n(),
      method: "POST",
      get duplex() {
        return d = !0, "half";
      }
    }), R = w.headers.has("Content-Type");
    return w.body != null && w.body.cancel(), d && !R;
  }), m = f && u && Dt(() => a.isReadableStream(new i("").body)), h = {
    stream: m && ((d) => d.body)
  };
  l && ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((d) => {
    !h[d] && (h[d] = (w, R) => {
      let A = w && w[d];
      if (A)
        return A.call(w);
      throw new y(
        `Response type '${d}' is not supported`,
        y.ERR_NOT_SUPPORT,
        R
      );
    });
  });
  const b = async (d) => {
    if (d == null)
      return 0;
    if (a.isBlob(d))
      return d.size;
    if (a.isSpecCompliantForm(d))
      return (await new o(k.origin, {
        method: "POST",
        body: d
      }).arrayBuffer()).byteLength;
    if (a.isArrayBufferView(d) || a.isArrayBuffer(d))
      return d.byteLength;
    if (a.isURLSearchParams(d) && (d = d + ""), a.isString(d))
      return (await p(d)).byteLength;
  }, g = async (d, w) => {
    const R = a.toFiniteNumber(d.getContentLength());
    return R ?? b(w);
  };
  return async (d) => {
    let {
      url: w,
      method: R,
      data: A,
      signal: D,
      cancelToken: T,
      timeout: J,
      onDownloadProgress: ge,
      onUploadProgress: C,
      responseType: v,
      headers: L,
      withCredentials: ae = "same-origin",
      fetchOptions: Pe,
      maxContentLength: H,
      maxBodyLength: le
    } = ln(d);
    const be = a.isNumber(H) && H > -1, Me = a.isNumber(le) && le > -1, pn = (P) => a.hasOwnProp(d, P) ? d[P] : void 0;
    let ft = r || fetch;
    v = v ? (v + "").toLowerCase() : "text";
    let Q = gr(
      [D, T && T.toAbortSignal()],
      J
    ), F = null;
    const Y = Q && Q.unsubscribe && (() => {
      Q.unsubscribe();
    });
    let ce, we = null;
    const pt = () => new y(
      "Request body larger than maxBodyLength limit",
      y.ERR_BAD_REQUEST,
      d,
      F
    );
    try {
      let P;
      const V = pn("auth");
      if (V) {
        const _ = a.getSafeProp(V, "username") || "", M = a.getSafeProp(V, "password") || "";
        P = {
          username: _,
          password: M
        };
      }
      if (_r(w)) {
        const _ = new URL(w, k.origin);
        if (!P && (_.username || _.password)) {
          const M = Nt(_.username), Z = Nt(_.password);
          P = {
            username: M,
            password: Z
          };
        }
        (_.username || _.password) && (_.username = "", _.password = "", w = _.href);
      }
      if (P && (L.delete("authorization"), L.set(
        "Authorization",
        "Basic " + btoa(Or((P.username || "") + ":" + (P.password || "")))
      )), be && typeof w == "string" && w.startsWith("data:") && Sr(w) > H)
        throw new y(
          "maxContentLength size of " + H + " exceeded",
          y.ERR_BAD_RESPONSE,
          d,
          F
        );
      if (Me && R !== "get" && R !== "head") {
        const _ = await b(A);
        if (typeof _ == "number" && isFinite(_) && (ce = _, _ > le))
          throw pt();
      }
      const ve = Me && (a.isReadableStream(A) || a.isStream(A)), ht = (_, M, Z) => Pt(
        _,
        vt,
        (ee) => {
          if (Me && ee > le)
            throw we = pt();
          M && M(ee);
        },
        Z
      );
      if (E && R !== "get" && R !== "head" && (C || ve)) {
        if (ce = ce ?? await g(L, A), ce !== 0 || ve) {
          let _ = new o(w, {
            method: "POST",
            body: A,
            duplex: "half"
          }), M;
          if (a.isFormData(A) && (M = _.headers.get("content-type")) && L.setContentType(M), _.body) {
            const [Z, ee] = C && Ct(
              ce,
              ke(At(C))
            ) || [];
            A = ht(_.body, Z, ee);
          }
        }
      } else if (ve && !c && u && R !== "get" && R !== "head")
        A = ht(A);
      else if (ve && c && !E && R !== "get" && R !== "head")
        throw new y(
          "Stream request bodies are not supported by the current fetch implementation",
          y.ERR_NOT_SUPPORT,
          d,
          F
        );
      a.isString(ae) || (ae = ae ? "include" : "omit");
      const hn = c && "credentials" in o.prototype;
      if (a.isFormData(A)) {
        const _ = L.getContentType();
        _ && /^multipart\/form-data/i.test(_) && !/boundary=/i.test(_) && L.delete("content-type");
      }
      L.set("User-Agent", "axios/" + ct, !1);
      const mt = {
        ...Pe,
        signal: Q,
        method: R.toUpperCase(),
        headers: Gt(L.normalize()),
        body: A,
        duplex: "half",
        credentials: hn ? ae : void 0
      };
      F = c && new o(w, mt);
      let X = await (c ? ft(F, Pe) : ft(w, mt));
      const yt = j.from(X.headers);
      if (be) {
        const _ = a.toFiniteNumber(yt.getContentLength());
        if (_ != null && _ > H)
          throw new y(
            "maxContentLength size of " + H + " exceeded",
            y.ERR_BAD_RESPONSE,
            d,
            F
          );
      }
      const He = m && (v === "stream" || v === "response");
      if (m && X.body && (ge || be || He && Y)) {
        const _ = {};
        ["status", "statusText", "headers"].forEach((Ee) => {
          _[Ee] = X[Ee];
        });
        const M = a.toFiniteNumber(yt.getContentLength()), [Z, ee] = ge && Ct(
          M,
          ke(At(ge), !0)
        ) || [];
        let gt = 0;
        const mn = (Ee) => {
          if (be && (gt = Ee, gt > H))
            throw new y(
              "maxContentLength size of " + H + " exceeded",
              y.ERR_BAD_RESPONSE,
              d,
              F
            );
          Z && Z(Ee);
        };
        X = new i(
          Pt(X.body, vt, mn, () => {
            ee && ee(), Y && Y();
          }),
          _
        );
      }
      v = v || "text";
      let G = await h[a.findKey(h, v) || "text"](
        X,
        d
      );
      if (be && !m && !He) {
        let _;
        if (G != null && (typeof G.byteLength == "number" ? _ = G.byteLength : typeof G.size == "number" ? _ = G.size : typeof G == "string" && (_ = typeof s == "function" ? new s().encode(G).byteLength : G.length)), typeof _ == "number" && _ > H)
          throw new y(
            "maxContentLength size of " + H + " exceeded",
            y.ERR_BAD_RESPONSE,
            d,
            F
          );
      }
      return !He && Y && Y(), await new Promise((_, M) => {
        on(_, M, {
          data: G,
          headers: j.from(X.headers),
          status: X.status,
          statusText: X.statusText,
          config: d,
          request: F
        });
      });
    } catch (P) {
      if (Y && Y(), Q && Q.aborted && Q.reason instanceof y) {
        const V = Q.reason;
        throw V.config = d, F && (V.request = F), P !== V && Object.defineProperty(V, "cause", {
          __proto__: null,
          value: P,
          writable: !0,
          enumerable: !1,
          configurable: !0
        }), V;
      }
      if (we)
        throw F && !we.request && (we.request = F), we;
      if (P instanceof y)
        throw F && !P.request && (P.request = F), P;
      if (P && P.name === "TypeError" && /Load failed|fetch/i.test(P.message)) {
        const V = new y(
          "Network Error",
          y.ERR_NETWORK,
          d,
          F,
          P && P.response
        );
        throw Object.defineProperty(V, "cause", {
          __proto__: null,
          value: P.cause || P,
          writable: !0,
          enumerable: !1,
          configurable: !0
        }), V;
      }
      throw y.from(P, P && P.code, d, F, P && P.response);
    }
  };
}, Ar = /* @__PURE__ */ new Map(), cn = (e) => {
  let t = e && e.env || {};
  const { fetch: n, Request: s, Response: r } = t, o = [s, r, n];
  let i = o.length, l = i, c, f, u = Ar;
  for (; l--; )
    c = o[l], f = u.get(c), f === void 0 && u.set(c, f = l ? /* @__PURE__ */ new Map() : Cr(t)), u = f;
  return f;
};
cn();
const ut = {
  http: js,
  xhr: yr,
  fetch: {
    get: cn
  }
};
a.forEach(ut, (e, t) => {
  if (e) {
    try {
      Object.defineProperty(e, "name", { __proto__: null, value: t });
    } catch {
    }
    Object.defineProperty(e, "adapterName", { __proto__: null, value: t });
  }
});
const Lt = (e) => `- ${e}`, xr = (e) => a.isFunction(e) || e === null || e === !1;
function Tr(e, t) {
  e = a.isArray(e) ? e : [e];
  const { length: n } = e;
  let s, r;
  const o = {};
  for (let i = 0; i < n; i++) {
    s = e[i];
    let l;
    if (r = s, !xr(s) && (r = ut[(l = String(s)).toLowerCase()], r === void 0))
      throw new y(`Unknown adapter '${l}'`);
    if (r && (a.isFunction(r) || (r = r.get(t))))
      break;
    o[l || "#" + i] = r;
  }
  if (!r) {
    const i = Object.entries(o).map(
      ([c, f]) => `adapter ${c} ` + (f === !1 ? "is not supported by the environment" : "is not available in the build")
    );
    let l = n ? i.length > 1 ? `since :
` + i.map(Lt).join(`
`) : " " + Lt(i[0]) : "as no adapter specified";
    throw new y(
      "There is no suitable adapter to dispatch the request " + l,
      y.ERR_NOT_SUPPORT
    );
  }
  return r;
}
const un = {
  /**
   * Resolve an adapter from a list of adapter names or functions.
   * @type {Function}
   */
  getAdapter: Tr,
  /**
   * Exposes all known adapters
   * @type {Object<string, Function|Object>}
   */
  adapters: ut
};
function Xe(e) {
  if (e.cancelToken && e.cancelToken.throwIfRequested(), e.signal && e.signal.aborted)
    throw new Te(null, e);
}
function Bt(e) {
  return Xe(e), e.headers = j.from(e.headers), e.data = Ke.call(e, e.transformRequest), ["post", "put", "patch"].indexOf(e.method) !== -1 && e.headers.setContentType("application/x-www-form-urlencoded", !1), un.getAdapter(e.adapter || xe.adapter, e)(e).then(
    function(s) {
      Xe(e), e.response = s;
      try {
        s.data = Ke.call(e, e.transformResponse, s);
      } finally {
        delete e.response;
      }
      return s.headers = j.from(s.headers), s;
    },
    function(s) {
      if (!rn(s) && (Xe(e), s && s.response)) {
        e.response = s.response;
        try {
          s.response.data = Ke.call(
            e,
            e.transformResponse,
            s.response
          );
        } finally {
          delete e.response;
        }
        s.response.headers = j.from(s.response.headers);
      }
      return Promise.reject(s);
    }
  );
}
const $e = {};
["object", "boolean", "number", "function", "string", "symbol"].forEach((e, t) => {
  $e[e] = function(s) {
    return typeof s === e || "a" + (t < 1 ? "n " : " ") + e;
  };
});
const Ut = {};
$e.transitional = function(t, n, s) {
  function r(o, i) {
    return "[Axios v" + ct + "] Transitional option '" + o + "'" + i + (s ? ". " + s : "");
  }
  return (o, i, l) => {
    if (t === !1)
      throw new y(
        r(i, " has been removed" + (n ? " in " + n : "")),
        y.ERR_DEPRECATED
      );
    return n && !Ut[i] && (Ut[i] = !0, console.warn(
      r(
        i,
        " has been deprecated since v" + n + " and will be removed in the near future"
      )
    )), t ? t(o, i, l) : !0;
  };
};
$e.spelling = function(t) {
  return (n, s) => (console.warn(`${s} is likely a misspelling of ${t}`), !0);
};
function Pr(e, t, n) {
  if (typeof e != "object" || e === null)
    throw new y("options must be an object", y.ERR_BAD_OPTION_VALUE);
  const s = Object.keys(e);
  let r = s.length;
  for (; r-- > 0; ) {
    const o = s[r], i = Object.prototype.hasOwnProperty.call(t, o) ? t[o] : void 0;
    if (i) {
      const l = e[o], c = l === void 0 || i(l, o, e);
      if (c !== !0)
        throw new y(
          "option " + o + " must be " + c,
          y.ERR_BAD_OPTION_VALUE
        );
      continue;
    }
    if (n !== !0)
      throw new y("Unknown option " + o, y.ERR_BAD_OPTION);
  }
}
const Be = {
  assertOptions: Pr,
  validators: $e
}, I = Be.validators;
let re = class {
  constructor(t) {
    this.defaults = t || {}, this.interceptors = {
      request: new Ot(),
      response: new Ot()
    };
  }
  /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  async request(t, n) {
    try {
      return await this._request(t, n);
    } catch (s) {
      if (s instanceof Error) {
        let r = {};
        Error.captureStackTrace ? Error.captureStackTrace(r) : r = new Error();
        const o = (() => {
          if (!r.stack)
            return "";
          const i = r.stack.indexOf(`
`);
          return i === -1 ? "" : r.stack.slice(i + 1);
        })();
        try {
          if (!s.stack)
            s.stack = o;
          else if (o) {
            const i = o.indexOf(`
`), l = i === -1 ? -1 : o.indexOf(`
`, i + 1), c = l === -1 ? "" : o.slice(l + 1);
            String(s.stack).endsWith(c) || (s.stack += `
` + o);
          }
        } catch {
        }
      }
      throw s;
    }
  }
  _request(t, n) {
    typeof t == "string" ? (n = n || {}, n.url = t) : n = t || {}, n = ie(this.defaults, n);
    const { transitional: s, paramsSerializer: r, headers: o } = n;
    s !== void 0 && Be.assertOptions(
      s,
      {
        silentJSONParsing: I.transitional(I.boolean),
        forcedJSONParsing: I.transitional(I.boolean),
        clarifyTimeoutError: I.transitional(I.boolean),
        legacyInterceptorReqResOrdering: I.transitional(I.boolean),
        advertiseZstdAcceptEncoding: I.transitional(I.boolean),
        validateStatusUndefinedResolves: I.transitional(I.boolean)
      },
      !1
    ), r != null && (a.isFunction(r) ? n.paramsSerializer = {
      serialize: r
    } : Be.assertOptions(
      r,
      {
        encode: I.function,
        serialize: I.function
      },
      !0
    )), n.allowAbsoluteUrls !== void 0 || (this.defaults.allowAbsoluteUrls !== void 0 ? n.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls : n.allowAbsoluteUrls = !0), Be.assertOptions(
      n,
      {
        baseUrl: I.spelling("baseURL"),
        withXsrfToken: I.spelling("withXSRFToken")
      },
      !0
    ), n.method = (n.method || this.defaults.method || "get").toLowerCase();
    let i = o && a.merge(o.common, o[n.method]);
    o && a.forEach(["delete", "get", "head", "post", "put", "patch", "query", "common"], (h) => {
      delete o[h];
    }), n.headers = j.concat(i, o);
    const l = [];
    let c = !0;
    this.interceptors.request.forEach(function(b) {
      if (typeof b.runWhen == "function" && b.runWhen(n) === !1)
        return;
      c = c && b.synchronous;
      const g = n.transitional || at;
      g && g.legacyInterceptorReqResOrdering ? l.unshift(b.fulfilled, b.rejected) : l.push(b.fulfilled, b.rejected);
    });
    const f = [];
    this.interceptors.response.forEach(function(b) {
      f.push(b.fulfilled, b.rejected);
    });
    let u, p = 0, E;
    if (!c) {
      const h = [Bt.bind(this), void 0];
      for (h.unshift(...l), h.push(...f), E = h.length, u = Promise.resolve(n); p < E; )
        u = u.then(h[p++], h[p++]);
      return u;
    }
    E = l.length;
    let m = n;
    for (; p < E; ) {
      const h = l[p++], b = l[p++];
      try {
        m = h(m);
      } catch (g) {
        b.call(this, g);
        break;
      }
    }
    try {
      u = Bt.call(this, m);
    } catch (h) {
      return Promise.reject(h);
    }
    for (p = 0, E = f.length; p < E; )
      u = u.then(f[p++], f[p++]);
    return u;
  }
  getUri(t) {
    t = ie(this.defaults, t);
    const n = an(t.baseURL, t.url, t.allowAbsoluteUrls, t);
    return tn(n, t.params, t.paramsSerializer);
  }
};
a.forEach(["delete", "get", "head", "options"], function(t) {
  re.prototype[t] = function(n, s) {
    return this.request(
      ie(s || {}, {
        method: t,
        url: n,
        data: s && a.hasOwnProp(s, "data") ? s.data : void 0
      })
    );
  };
});
a.forEach(["post", "put", "patch", "query"], function(t) {
  function n(s) {
    return function(o, i, l) {
      return this.request(
        ie(l || {}, {
          method: t,
          headers: s ? {
            "Content-Type": "multipart/form-data"
          } : {},
          url: o,
          data: i
        })
      );
    };
  }
  re.prototype[t] = n(), t !== "query" && (re.prototype[t + "Form"] = n(!0));
});
let vr = class dn {
  constructor(t) {
    if (typeof t != "function")
      throw new TypeError("executor must be a function.");
    let n;
    this.promise = new Promise(function(o) {
      n = o;
    });
    const s = this;
    this.promise.then((r) => {
      if (!s._listeners) return;
      let o = s._listeners.length;
      for (; o-- > 0; )
        s._listeners[o](r);
      s._listeners = null;
    }), this.promise.then = (r) => {
      let o;
      const i = new Promise((l) => {
        s.subscribe(l), o = l;
      }).then(r);
      return i.cancel = function() {
        s.unsubscribe(o);
      }, i;
    }, t(function(o, i, l) {
      s.reason || (s.reason = new Te(o, i, l), n(s.reason));
    });
  }
  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason)
      throw this.reason;
  }
  /**
   * Subscribe to the cancel signal
   */
  subscribe(t) {
    if (this.reason) {
      t(this.reason);
      return;
    }
    this._listeners ? this._listeners.push(t) : this._listeners = [t];
  }
  /**
   * Unsubscribe from the cancel signal
   */
  unsubscribe(t) {
    if (!this._listeners)
      return;
    const n = this._listeners.indexOf(t);
    n !== -1 && this._listeners.splice(n, 1);
  }
  toAbortSignal() {
    const t = new AbortController(), n = (s) => {
      t.abort(s);
    };
    return this.subscribe(n), t.signal.unsubscribe = () => this.unsubscribe(n), t.signal;
  }
  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let t;
    return {
      token: new dn(function(r) {
        t = r;
      }),
      cancel: t
    };
  }
};
function Nr(e) {
  return function(n) {
    return e.apply(null, n);
  };
}
function Dr(e) {
  return a.isObject(e) && e.isAxiosError === !0;
}
const tt = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511,
  WebServerIsDown: 521,
  ConnectionTimedOut: 522,
  OriginIsUnreachable: 523,
  TimeoutOccurred: 524,
  SslHandshakeFailed: 525,
  InvalidSslCertificate: 526
};
Object.entries(tt).forEach(([e, t]) => {
  tt[t] = e;
});
function fn(e) {
  const t = new re(e), n = $t(re.prototype.request, t);
  return a.extend(n, re.prototype, t, { allOwnKeys: !0 }), a.extend(n, t, null, { allOwnKeys: !0 }), n.create = function(r) {
    return fn(ie(e, r));
  }, n;
}
const N = fn(xe);
N.Axios = re;
N.CanceledError = Te;
N.CancelToken = vr;
N.isCancel = rn;
N.VERSION = ct;
N.toFormData = qe;
N.AxiosError = y;
N.Cancel = N.CanceledError;
N.all = function(t) {
  return Promise.all(t);
};
N.spread = Nr;
N.isAxiosError = Dr;
N.mergeConfig = ie;
N.AxiosHeaders = j;
N.formToJSON = (e) => sn(a.isHTMLForm(e) ? new FormData(e) : e);
N.getAdapter = un.getAdapter;
N.HttpStatusCode = tt;
N.default = N;
const {
  Axios: co,
  AxiosError: uo,
  CanceledError: fo,
  isCancel: po,
  CancelToken: ho,
  VERSION: mo,
  all: yo,
  Cancel: go,
  isAxiosError: bo,
  spread: wo,
  toFormData: Eo,
  AxiosHeaders: Ro,
  HttpStatusCode: So,
  formToJSON: Oo,
  getAdapter: _o,
  mergeConfig: Co,
  create: Ao
} = N, Lr = "http://" + window.location.hostname + ":18080/api", Br = !1, Ur = () => (console.log("getUrl", Br), Lr), dt = N.create({
  baseURL: Ur(),
  // 从 .env 文件读取
  timeout: 1e4
});
dt.interceptors.request.use(
  (e) => e,
  (e) => Promise.reject(e)
);
dt.interceptors.response.use(
  (e) => Promise.resolve(e.data),
  (e) => Promise.reject(e)
);
const Fr = (e, t) => dt({
  url: e,
  method: "get",
  params: t
}), kr = async () => {
  try {
    return await Fr("/devices/");
  } catch (e) {
    throw e;
  }
}, Ir = { style: { display: "flex", "align-items": "center" } }, jr = { style: { width: "50%" } }, qr = { class: "bind-data" }, $r = { style: { display: "flex", "justify-content": "flex-start", "align-items": "center", "flex-direction": "column" } }, Mr = { style: { flex: "1 1 0%", padding: "0 8px", "line-height": "32px" } }, Hr = { style: { display: "flex", "justify-content": "flex-end", "align-items": "flex-start", gap: "20px" } }, Vr = { style: { display: "flex", "align-items": "center", "flex-direction": "column", gap: "8px" } }, zr = { style: { width: "640px", height: "704px", position: "relative" } }, Jr = /* @__PURE__ */ nt({
  __name: "BindingXplayRender",
  props: {
    label: {},
    value: {},
    id: {},
    checked: { type: Boolean },
    opt: {}
  },
  emits: ["changeValue", "changeCheck"],
  setup(e, { emit: t }) {
    const n = e, s = t, o = kt({ ...{ createBindingShape: !0, animationAvail: !1 }, ...n.opt }), i = q([]), l = q([]), c = q(""), f = q(""), u = q(""), p = q([]), E = Ft(() => n.value?.bindingList?.[0] || null);
    It(async () => {
      if (E.value) {
        console.info("currentBinding", E.value);
        const C = E.value.pointRef.split(",");
        c.value = C[0] || "", u.value = C[1] || "", f.value = E.value.pointName;
      }
      await m(), c.value && h(c.value);
    });
    const m = async () => {
      try {
        const C = await kr();
        if (C.count === 0) {
          console.warn("Non-OK response status:", C.status);
          return;
        }
        p.value = C.devices, i.value = C.devices.map((v) => ({
          label: v.name,
          value: v.asset
        }));
      } catch (C) {
        console.log("readDevices", C);
      }
    }, h = async (C) => {
      if (!C) return;
      const v = p.value.find((L) => L.asset === C);
      v && (l.value = v.points.map((L) => ({
        label: L.name,
        value: L.name,
        unit: L.unit,
        description: L.description,
        device_type: v.plugin.name
      })));
    }, b = () => {
      c.value = "", u.value = "", f.value = "", l.value = [], s("changeValue", {
        bindingList: [],
        animationConfig: n.value?.animationConfig
      });
    }, g = (C) => {
      c.value = C, u.value = "", f.value = "", l.value = [];
    }, d = (C) => {
      u.value = C, f.value = C;
      const v = l.value.find(
        (le) => le.value === C
      );
      let L = v?.unit || "", ae = v?.description || "", Pe = v?.device_type || "", H = {
        cpntId: A(),
        bindingType: "point",
        pointRef: c.value + "," + C + "," + Pe + "," + L + "," + ae,
        pointName: f.value,
        pointType: "Analog",
        valueType: "analog",
        range: {}
      };
      s("changeValue", {
        bindingList: [H],
        animationConfig: n.value?.animationConfig
      });
    };
    se(
      c,
      (C) => {
        console.log("deviceID changed", C), C && h(C);
      },
      { immediate: !0 }
    ), se(u, (C) => {
      d(C);
    });
    let w = 0, R = 0;
    function A() {
      const C = Date.now();
      C === w ? R++ : (R = 0, w = C);
      const v = Math.floor(Math.random() * 1e3);
      return C * 1e3 + v + R;
    }
    function D() {
      o.createBindingShape && !n.opt?.disabled && s("changeCheck");
    }
    const T = q(!1);
    function J() {
      n.opt && n.opt.animationAvail && !n.opt.disabled && (T.value = !0);
    }
    function ge(C) {
      console.info("confirmAnimationConfig", C), s("changeValue", {
        bindingList: n.value?.bindingList,
        animationConfig: C
      }), T.value = !1;
    }
    return se(
      () => T.value,
      (C) => {
        sessionStorage.setItem("graphic-editor-panel-status", `${C}`);
      }
    ), (C, v) => (W(), de(st, null, [
      O("div", Ir, [
        O("div", jr, [
          o.createBindingShape ? (W(), Ue(S(qt), {
            key: 0,
            label: S(x)("显示数值标签"),
            checked: e.checked,
            onChange: D,
            disabled: e.opt?.disabled
          }, null, 8, ["label", "checked", "disabled"])) : Se("", !0)
        ]),
        U(S(fe), {
          name: "film",
          title: S(x)("点位值对应状态设置"),
          disabled: !o.animationAvail || !!e.opt?.disabled,
          size: 24,
          style: wn({
            cursor: !o.animationAvail || e.opt?.disabled ? "default" : "pointer"
          }),
          onClick: J
        }, null, 8, ["title", "disabled", "style"])
      ]),
      O("div", qr, [
        O("div", $r, [
          O("span", Mr, B(e.label), 1)
        ]),
        O("div", Hr, [
          O("div", Vr, [
            U(S(bt), {
              value: c.value,
              opts: i.value,
              appendToRoot: !0,
              placeholder: S(x)("请选择一个设备！"),
              onChange: g,
              class: "bind-data-item"
            }, null, 8, ["value", "opts", "placeholder"]),
            U(S(bt), {
              value: u.value,
              opts: l.value,
              appendToRoot: !0,
              placeholder: S(x)("请选择一个点位"),
              onChange: d,
              class: "bind-data-item"
            }, null, 8, ["value", "opts", "placeholder"])
          ]),
          U(S(fe), {
            name: "delete",
            title: S(x)("清除绑定内容"),
            size: 24,
            style: { cursor: "pointer", "padding-top": "4px" },
            onClick: b
          }, null, 8, ["title"])
        ])
      ]),
      v[1] || (v[1] = O("div", { class: "bind-data" }, [
        O("span", { style: { flex: "1 1 0%", padding: "0 8px" } })
      ], -1)),
      e.opt?.animationAvail ? (W(), Ue(S(Oe), {
        key: 0,
        show: T.value
      }, {
        default: K(() => [
          O("div", zr, [
            U(jt, {
              animationStates: e.opt.animationStates,
              animationConf: e.value?.animationConfig,
              onOnCancel: v[0] || (v[0] = (L) => T.value = !1),
              onOnConfirm: ge
            }, null, 8, ["animationStates", "animationConf"])
          ])
        ]),
        _: 1
      }, 8, ["show"])) : Se("", !0)
    ], 64));
  }
}), Wr = /* @__PURE__ */ Sn(Jr, [["__scopeId", "data-v-ebba1642"]]), Kr = { class: "property-group-panel-title" }, Xr = { class: "label" }, Gr = {
  key: 0,
  class: "binding-property-display-all"
}, Qr = { style: { width: "600px", height: "600px" } }, Zr = { class: "default-animation-rule-info" }, Yr = { style: { "font-weight": "bold" } }, eo = { class: "default-animation-rule-info" }, to = { style: { "font-weight": "bold" } }, no = { class: "default-footer-content" }, xo = /* @__PURE__ */ nt({
  __name: "PropertyGroupBinding",
  props: {
    group: {},
    optionValues: {},
    updateValue: { type: Function }
  },
  setup(e) {
    const t = e, n = q(!1), s = q(!1), r = kt(/* @__PURE__ */ new Map()), o = q(!1);
    se(() => o.value, (m) => {
      sessionStorage.setItem("graphic-editor-panel-status", `${m}`);
    });
    function i() {
      s.value ? u.forEach((m) => c(m)) : u.forEach((m) => {
        const h = m.name;
        r.get(h) || c(m);
      });
    }
    let l = [];
    function c(m) {
      const h = m.name, b = !!r.get(h), g = te.activeItem;
      if (b) {
        const d = l.filter((w) => w.options.propName === h)[0];
        g.off("updateValueBinding." + h), te.removeItem(d);
      } else {
        const d = new On({
          parentUqId: t.optionValues.uqId,
          propName: h,
          propLabel: m.label
        });
        d.postConstruct(), te.addItem(d);
        const w = d.options.uqId, R = g.addChildrenBinding(w), A = g.getShapeTopLeft(), D = { x: A.x, y: A.y - (R + 1) * 36 };
        d.set("center", D), d.set("bindingValue", g.options[h]), g.on("updateValueBinding." + h, (T) => {
          d.set("bindingValue", T);
        });
      }
      l = E(t.optionValues.uqId), s.value = u.length === l.length, r.set(h, !r.get(h));
    }
    function f(m) {
      const h = m.name, b = !!r.get(h), g = te.activeItem;
      if (b) {
        const d = l.filter((w) => w.options.propName === h)[0];
        g.off("updateValueBinding." + h), te.removeItem(d);
      }
      p();
    }
    let u = [];
    function p() {
      if (u = t.group.items.filter((h) => {
        const b = h.type === ze.bindingValue, g = h.opt && h.opt.createBindingShape !== void 0 && !h.opt.createBindingShape, d = h.opt && h.opt.disabled;
        return b && !g && !d;
      }), u.length === 0)
        return;
      n.value = u.length > 1, l = E(t.optionValues.uqId);
      const m = te.activeItem;
      m && (l.forEach((h) => {
        const b = h.options.propName;
        r.set(b, !0), m.off("updateValueBinding." + b), m.on("updateValueBinding." + b, (g) => {
          h.set("bindingValue", g);
        });
      }), s.value = u.length === l.length);
    }
    It(() => {
      p(), Ve.on("bindingPropertyToggleDisable", f);
    }), En(() => {
      Ve.off("bindingPropertyToggleDisable", f);
    });
    function E(m) {
      return te.currLayer.findBindingItems(m);
    }
    return (m, h) => (W(), de("div", null, [
      O("div", Kr, [
        O("span", Xr, B(e.group.group), 1),
        U(S(fe), {
          name: "unknownCircle",
          size: 24,
          title: S(x)("默认状态匹配规则说明"),
          style: { cursor: "pointer" },
          onClick: h[0] || (h[0] = (b) => o.value = !0)
        }, null, 8, ["title"])
      ]),
      n.value ? (W(), de("div", Gr, [
        U(S(qt), {
          label: S(x)("显示所有可用属性"),
          checked: s.value,
          onChange: i
        }, null, 8, ["label", "checked"])
      ])) : Se("", !0),
      (W(!0), de(st, null, Rn(e.group.items, (b) => (W(), de("div", null, [
        b.type === S(ze).bindingValue ? (W(), Ue(Wr, {
          key: 0,
          label: b.label,
          value: e.optionValues[b.name],
          id: e.optionValues.id,
          opt: { ...b.opt, lastBindingManager: S(Ve) },
          onChangeValue: (g) => {
            e.updateValue(b.name, g);
          },
          checked: r.get(b.name),
          onChangeCheck: (g) => c(b)
        }, null, 8, ["label", "value", "id", "opt", "onChangeValue", "checked", "onChangeCheck"])) : Se("", !0),
        b.type === S(ze).bindingExpression ? (W(), Ue(Bn, {
          key: 1,
          label: b.label,
          value: e.optionValues[b.name],
          onChangeValue: (g) => {
            e.updateValue(b.name, g);
          }
        }, null, 8, ["label", "value", "onChangeValue"])) : Se("", !0)
      ]))), 256)),
      U(S(Oe), { show: o.value }, {
        default: K(() => [
          O("div", Qr, [
            U(S(Qe), {
              title: S(x)("绑定说明"),
              closeBtn: !0,
              onClose: h[2] || (h[2] = (b) => o.value = !1)
            }, {
              footer: K(() => [
                O("div", no, [
                  O("button", {
                    class: "btn-main",
                    onClick: h[1] || (h[1] = (b) => o.value = !1)
                  }, B(S(x)("关闭")), 1)
                ])
              ]),
              default: K(() => [
                O("div", Zr, [
                  O("p", Yr, B(S(x)("数据绑定优先级")), 1),
                  O("p", null, [
                    Ge(B(S(x)("导航目标绑定")) + " ", 1),
                    U(S(fe), {
                      name: "arrowDown",
                      style: { transform: "rotate(-90deg)", "text-indent": "0" },
                      size: 16
                    }),
                    Ge(" " + B(S(x)("点位绑定")) + "。 ", 1)
                  ])
                ]),
                O("div", eo, [
                  O("p", to, B(S(x)("默认状态匹配规则")), 1),
                  O("p", null, B(S(x)("1. 未配置默认状态时，图形的第一个状态为默认状态。")), 1),
                  O("p", null, B(S(x)("2. 当没有绑定点位或点位没有值时，图形显示默认状态。")), 1),
                  O("p", null, B(S(x)("3. 当绑定点位为开关量时，点位值为0，显示图形的第一个状态；点位值为1，显示图形的第二个状态。")), 1),
                  O("p", null, B(S(x)("4. 当绑定点位为状态量时，点位值为1，显示图形的第一个状态；点位值为2，显示图形的第二个状态，以此类推。")), 1),
                  O("p", null, B(S(x)("5. 当绑定点位为模拟量时，设图形状态总数为N，当点位值为0，显示图形的第一个状态；100除以该图形剩余的状态数，得到N-1个区间；当点位值处于第K个区间时，显示图形的第K+1个状态。")), 1)
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
  xo as default
};
