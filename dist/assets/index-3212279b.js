(function () {
  const t = document.createElement("link").relList;
  if (t && t.supports && t.supports("modulepreload")) return;
  for (const i of document.querySelectorAll('link[rel="modulepreload"]')) n(i);
  new MutationObserver((i) => {
    for (const r of i)
      if (r.type === "childList")
        for (const o of r.addedNodes)
          o.tagName === "LINK" && o.rel === "modulepreload" && n(o);
  }).observe(document, { childList: !0, subtree: !0 });
  function s(i) {
    const r = {};
    return (
      i.integrity && (r.integrity = i.integrity),
      i.referrerPolicy && (r.referrerPolicy = i.referrerPolicy),
      i.crossOrigin === "use-credentials"
        ? (r.credentials = "include")
        : i.crossOrigin === "anonymous"
        ? (r.credentials = "omit")
        : (r.credentials = "same-origin"),
      r
    );
  }
  function n(i) {
    if (i.ep) return;
    i.ep = !0;
    const r = s(i);
    fetch(i.href, r);
  }
})();
/**
 * @vue/shared v3.5.17
 * (c) 2018-present Yuxi (Evan) You and Vue contributors
 * @license MIT
 **/ /*! #__NO_SIDE_EFFECTS__ */ function Hn(e) {
  const t = Object.create(null);
  for (const s of e.split(",")) t[s] = 1;
  return (s) => s in t;
}
const Z = {},
  Et = [],
  $e = () => {},
  Bo = () => !1,
  Ds = (e) =>
    e.charCodeAt(0) === 111 &&
    e.charCodeAt(1) === 110 &&
    (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97),
  jn = (e) => e.startsWith("onUpdate:"),
  he = Object.assign,
  qn = (e, t) => {
    const s = e.indexOf(t);
    s > -1 && e.splice(s, 1);
  },
  Ho = Object.prototype.hasOwnProperty,
  W = (e, t) => Ho.call(e, t),
  H = Array.isArray,
  At = (e) => zs(e) === "[object Map]",
  or = (e) => zs(e) === "[object Set]",
  U = (e) => typeof e == "function",
  ae = (e) => typeof e == "string",
  nt = (e) => typeof e == "symbol",
  ie = (e) => e !== null && typeof e == "object",
  ar = (e) => (ie(e) || U(e)) && U(e.then) && U(e.catch),
  lr = Object.prototype.toString,
  zs = (e) => lr.call(e),
  jo = (e) => zs(e).slice(8, -1),
  cr = (e) => zs(e) === "[object Object]",
  Un = (e) =>
    ae(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e,
  Kt = Hn(
    ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
  ),
  Fs = (e) => {
    const t = Object.create(null);
    return (s) => t[s] || (t[s] = e(s));
  },
  qo = /-(\w)/g,
  Ie = Fs((e) => e.replace(qo, (t, s) => (s ? s.toUpperCase() : ""))),
  Uo = /\B([A-Z])/g,
  _t = Fs((e) => e.replace(Uo, "-$1").toLowerCase()),
  Ns = Fs((e) => e.charAt(0).toUpperCase() + e.slice(1)),
  an = Fs((e) => (e ? `on${Ns(e)}` : "")),
  wt = (e, t) => !Object.is(e, t),
  ws = (e, ...t) => {
    for (let s = 0; s < e.length; s++) e[s](...t);
  },
  kn = (e, t, s, n = !1) => {
    Object.defineProperty(e, t, {
      configurable: !0,
      enumerable: !1,
      writable: n,
      value: s,
    });
  },
  xn = (e) => {
    const t = parseFloat(e);
    return isNaN(t) ? e : t;
  };
let wi;
const Bs = () =>
  wi ||
  (wi =
    typeof globalThis < "u"
      ? globalThis
      : typeof self < "u"
      ? self
      : typeof window < "u"
      ? window
      : typeof global < "u"
      ? global
      : {});
function as(e) {
  if (H(e)) {
    const t = {};
    for (let s = 0; s < e.length; s++) {
      const n = e[s],
        i = ae(n) ? Ko(n) : as(n);
      if (i) for (const r in i) t[r] = i[r];
    }
    return t;
  } else if (ae(e) || ie(e)) return e;
}
const Qo = /;(?![^(]*\))/g,
  Vo = /:([^]+)/,
  Wo = /\/\*[^]*?\*\//g;
function Ko(e) {
  const t = {};
  return (
    e
      .replace(Wo, "")
      .split(Qo)
      .forEach((s) => {
        if (s) {
          const n = s.split(Vo);
          n.length > 1 && (t[n[0].trim()] = n[1].trim());
        }
      }),
    t
  );
}
function oe(e) {
  let t = "";
  if (ae(e)) t = e;
  else if (H(e))
    for (let s = 0; s < e.length; s++) {
      const n = oe(e[s]);
      n && (t += n + " ");
    }
  else if (ie(e)) for (const s in e) e[s] && (t += s + " ");
  return t.trim();
}
const Jo =
    "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly",
  Go = Hn(Jo);
function ur(e) {
  return !!e || e === "";
}
const dr = (e) => !!(e && e.__v_isRef === !0),
  z = (e) =>
    ae(e)
      ? e
      : e == null
      ? ""
      : H(e) || (ie(e) && (e.toString === lr || !U(e.toString)))
      ? dr(e)
        ? z(e.value)
        : JSON.stringify(e, hr, 2)
      : String(e),
  hr = (e, t) =>
    dr(t)
      ? hr(e, t.value)
      : At(t)
      ? {
          [`Map(${t.size})`]: [...t.entries()].reduce(
            (s, [n, i], r) => ((s[ln(n, r) + " =>"] = i), s),
            {}
          ),
        }
      : or(t)
      ? { [`Set(${t.size})`]: [...t.values()].map((s) => ln(s)) }
      : nt(t)
      ? ln(t)
      : ie(t) && !H(t) && !cr(t)
      ? String(t)
      : t,
  ln = (e, t = "") => {
    var s;
    return nt(e) ? `Symbol(${(s = e.description) != null ? s : t})` : e;
  };
/**
 * @vue/reactivity v3.5.17
 * (c) 2018-present Yuxi (Evan) You and Vue contributors
 * @license MIT
 **/ let Se;
class Zo {
  constructor(t = !1) {
    (this.detached = t),
      (this._active = !0),
      (this._on = 0),
      (this.effects = []),
      (this.cleanups = []),
      (this._isPaused = !1),
      (this.parent = Se),
      !t && Se && (this.index = (Se.scopes || (Se.scopes = [])).push(this) - 1);
  }
  get active() {
    return this._active;
  }
  pause() {
    if (this._active) {
      this._isPaused = !0;
      let t, s;
      if (this.scopes)
        for (t = 0, s = this.scopes.length; t < s; t++) this.scopes[t].pause();
      for (t = 0, s = this.effects.length; t < s; t++) this.effects[t].pause();
    }
  }
  resume() {
    if (this._active && this._isPaused) {
      this._isPaused = !1;
      let t, s;
      if (this.scopes)
        for (t = 0, s = this.scopes.length; t < s; t++) this.scopes[t].resume();
      for (t = 0, s = this.effects.length; t < s; t++) this.effects[t].resume();
    }
  }
  run(t) {
    if (this._active) {
      const s = Se;
      try {
        return (Se = this), t();
      } finally {
        Se = s;
      }
    }
  }
  on() {
    ++this._on === 1 && ((this.prevScope = Se), (Se = this));
  }
  off() {
    this._on > 0 &&
      --this._on === 0 &&
      ((Se = this.prevScope), (this.prevScope = void 0));
  }
  stop(t) {
    if (this._active) {
      this._active = !1;
      let s, n;
      for (s = 0, n = this.effects.length; s < n; s++) this.effects[s].stop();
      for (this.effects.length = 0, s = 0, n = this.cleanups.length; s < n; s++)
        this.cleanups[s]();
      if (((this.cleanups.length = 0), this.scopes)) {
        for (s = 0, n = this.scopes.length; s < n; s++) this.scopes[s].stop(!0);
        this.scopes.length = 0;
      }
      if (!this.detached && this.parent && !t) {
        const i = this.parent.scopes.pop();
        i &&
          i !== this &&
          ((this.parent.scopes[this.index] = i), (i.index = this.index));
      }
      this.parent = void 0;
    }
  }
}
function Yo() {
  return Se;
}
let ee;
const cn = new WeakSet();
class fr {
  constructor(t) {
    (this.fn = t),
      (this.deps = void 0),
      (this.depsTail = void 0),
      (this.flags = 5),
      (this.next = void 0),
      (this.cleanup = void 0),
      (this.scheduler = void 0),
      Se && Se.active && Se.effects.push(this);
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 &&
      ((this.flags &= -65), cn.has(this) && (cn.delete(this), this.trigger()));
  }
  notify() {
    (this.flags & 2 && !(this.flags & 32)) || this.flags & 8 || pr(this);
  }
  run() {
    if (!(this.flags & 1)) return this.fn();
    (this.flags |= 2), bi(this), mr(this);
    const t = ee,
      s = De;
    (ee = this), (De = !0);
    try {
      return this.fn();
    } finally {
      yr(this), (ee = t), (De = s), (this.flags &= -3);
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let t = this.deps; t; t = t.nextDep) Wn(t);
      (this.deps = this.depsTail = void 0),
        bi(this),
        this.onStop && this.onStop(),
        (this.flags &= -2);
    }
  }
  trigger() {
    this.flags & 64
      ? cn.add(this)
      : this.scheduler
      ? this.scheduler()
      : this.runIfDirty();
  }
  runIfDirty() {
    Sn(this) && this.run();
  }
  get dirty() {
    return Sn(this);
  }
}
let gr = 0,
  Jt,
  Gt;
function pr(e, t = !1) {
  if (((e.flags |= 8), t)) {
    (e.next = Gt), (Gt = e);
    return;
  }
  (e.next = Jt), (Jt = e);
}
function Qn() {
  gr++;
}
function Vn() {
  if (--gr > 0) return;
  if (Gt) {
    let t = Gt;
    for (Gt = void 0; t; ) {
      const s = t.next;
      (t.next = void 0), (t.flags &= -9), (t = s);
    }
  }
  let e;
  for (; Jt; ) {
    let t = Jt;
    for (Jt = void 0; t; ) {
      const s = t.next;
      if (((t.next = void 0), (t.flags &= -9), t.flags & 1))
        try {
          t.trigger();
        } catch (n) {
          e || (e = n);
        }
      t = s;
    }
  }
  if (e) throw e;
}
function mr(e) {
  for (let t = e.deps; t; t = t.nextDep)
    (t.version = -1),
      (t.prevActiveLink = t.dep.activeLink),
      (t.dep.activeLink = t);
}
function yr(e) {
  let t,
    s = e.depsTail,
    n = s;
  for (; n; ) {
    const i = n.prevDep;
    n.version === -1 ? (n === s && (s = i), Wn(n), Xo(n)) : (t = n),
      (n.dep.activeLink = n.prevActiveLink),
      (n.prevActiveLink = void 0),
      (n = i);
  }
  (e.deps = t), (e.depsTail = s);
}
function Sn(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (
      t.dep.version !== t.version ||
      (t.dep.computed && (wr(t.dep.computed) || t.dep.version !== t.version))
    )
      return !0;
  return !!e._dirty;
}
function wr(e) {
  if (
    (e.flags & 4 && !(e.flags & 16)) ||
    ((e.flags &= -17), e.globalVersion === es) ||
    ((e.globalVersion = es),
    !e.isSSR && e.flags & 128 && ((!e.deps && !e._dirty) || !Sn(e)))
  )
    return;
  e.flags |= 2;
  const t = e.dep,
    s = ee,
    n = De;
  (ee = e), (De = !0);
  try {
    mr(e);
    const i = e.fn(e._value);
    (t.version === 0 || wt(i, e._value)) &&
      ((e.flags |= 128), (e._value = i), t.version++);
  } catch (i) {
    throw (t.version++, i);
  } finally {
    (ee = s), (De = n), yr(e), (e.flags &= -3);
  }
}
function Wn(e, t = !1) {
  const { dep: s, prevSub: n, nextSub: i } = e;
  if (
    (n && ((n.nextSub = i), (e.prevSub = void 0)),
    i && ((i.prevSub = n), (e.nextSub = void 0)),
    s.subs === e && ((s.subs = n), !n && s.computed))
  ) {
    s.computed.flags &= -5;
    for (let r = s.computed.deps; r; r = r.nextDep) Wn(r, !0);
  }
  !t && !--s.sc && s.map && s.map.delete(s.key);
}
function Xo(e) {
  const { prevDep: t, nextDep: s } = e;
  t && ((t.nextDep = s), (e.prevDep = void 0)),
    s && ((s.prevDep = t), (e.nextDep = void 0));
}
let De = !0;
const br = [];
function et() {
  br.push(De), (De = !1);
}
function tt() {
  const e = br.pop();
  De = e === void 0 ? !0 : e;
}
function bi(e) {
  const { cleanup: t } = e;
  if (((e.cleanup = void 0), t)) {
    const s = ee;
    ee = void 0;
    try {
      t();
    } finally {
      ee = s;
    }
  }
}
let es = 0;
class ea {
  constructor(t, s) {
    (this.sub = t),
      (this.dep = s),
      (this.version = s.version),
      (this.nextDep =
        this.prevDep =
        this.nextSub =
        this.prevSub =
        this.prevActiveLink =
          void 0);
  }
}
class vr {
  constructor(t) {
    (this.computed = t),
      (this.version = 0),
      (this.activeLink = void 0),
      (this.subs = void 0),
      (this.map = void 0),
      (this.key = void 0),
      (this.sc = 0),
      (this.__v_skip = !0);
  }
  track(t) {
    if (!ee || !De || ee === this.computed) return;
    let s = this.activeLink;
    if (s === void 0 || s.sub !== ee)
      (s = this.activeLink = new ea(ee, this)),
        ee.deps
          ? ((s.prevDep = ee.depsTail),
            (ee.depsTail.nextDep = s),
            (ee.depsTail = s))
          : (ee.deps = ee.depsTail = s),
        Cr(s);
    else if (s.version === -1 && ((s.version = this.version), s.nextDep)) {
      const n = s.nextDep;
      (n.prevDep = s.prevDep),
        s.prevDep && (s.prevDep.nextDep = n),
        (s.prevDep = ee.depsTail),
        (s.nextDep = void 0),
        (ee.depsTail.nextDep = s),
        (ee.depsTail = s),
        ee.deps === s && (ee.deps = n);
    }
    return s;
  }
  trigger(t) {
    this.version++, es++, this.notify(t);
  }
  notify(t) {
    Qn();
    try {
      for (let s = this.subs; s; s = s.prevSub)
        s.sub.notify() && s.sub.dep.notify();
    } finally {
      Vn();
    }
  }
}
function Cr(e) {
  if ((e.dep.sc++, e.sub.flags & 4)) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let n = t.deps; n; n = n.nextDep) Cr(n);
    }
    const s = e.dep.subs;
    s !== e && ((e.prevSub = s), s && (s.nextSub = e)), (e.dep.subs = e);
  }
}
const Tn = new WeakMap(),
  bt = Symbol(""),
  Mn = Symbol(""),
  ts = Symbol("");
function ge(e, t, s) {
  if (De && ee) {
    let n = Tn.get(e);
    n || Tn.set(e, (n = new Map()));
    let i = n.get(s);
    i || (n.set(s, (i = new vr())), (i.map = n), (i.key = s)), i.track();
  }
}
function Ye(e, t, s, n, i, r) {
  const o = Tn.get(e);
  if (!o) {
    es++;
    return;
  }
  const a = (l) => {
    l && l.trigger();
  };
  if ((Qn(), t === "clear")) o.forEach(a);
  else {
    const l = H(e),
      d = l && Un(s);
    if (l && s === "length") {
      const c = Number(n);
      o.forEach((f, w) => {
        (w === "length" || w === ts || (!nt(w) && w >= c)) && a(f);
      });
    } else
      switch (
        ((s !== void 0 || o.has(void 0)) && a(o.get(s)), d && a(o.get(ts)), t)
      ) {
        case "add":
          l ? d && a(o.get("length")) : (a(o.get(bt)), At(e) && a(o.get(Mn)));
          break;
        case "delete":
          l || (a(o.get(bt)), At(e) && a(o.get(Mn)));
          break;
        case "set":
          At(e) && a(o.get(bt));
          break;
      }
  }
  Vn();
}
function xt(e) {
  const t = G(e);
  return t === e ? t : (ge(t, "iterate", ts), ze(e) ? t : t.map(be));
}
function Hs(e) {
  return ge((e = G(e)), "iterate", ts), e;
}
const ta = {
  __proto__: null,
  [Symbol.iterator]() {
    return un(this, Symbol.iterator, be);
  },
  concat(...e) {
    return xt(this).concat(...e.map((t) => (H(t) ? xt(t) : t)));
  },
  entries() {
    return un(this, "entries", (e) => ((e[1] = be(e[1])), e));
  },
  every(e, t) {
    return Je(this, "every", e, t, void 0, arguments);
  },
  filter(e, t) {
    return Je(this, "filter", e, t, (s) => s.map(be), arguments);
  },
  find(e, t) {
    return Je(this, "find", e, t, be, arguments);
  },
  findIndex(e, t) {
    return Je(this, "findIndex", e, t, void 0, arguments);
  },
  findLast(e, t) {
    return Je(this, "findLast", e, t, be, arguments);
  },
  findLastIndex(e, t) {
    return Je(this, "findLastIndex", e, t, void 0, arguments);
  },
  forEach(e, t) {
    return Je(this, "forEach", e, t, void 0, arguments);
  },
  includes(...e) {
    return dn(this, "includes", e);
  },
  indexOf(...e) {
    return dn(this, "indexOf", e);
  },
  join(e) {
    return xt(this).join(e);
  },
  lastIndexOf(...e) {
    return dn(this, "lastIndexOf", e);
  },
  map(e, t) {
    return Je(this, "map", e, t, void 0, arguments);
  },
  pop() {
    return Bt(this, "pop");
  },
  push(...e) {
    return Bt(this, "push", e);
  },
  reduce(e, ...t) {
    return vi(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return vi(this, "reduceRight", e, t);
  },
  shift() {
    return Bt(this, "shift");
  },
  some(e, t) {
    return Je(this, "some", e, t, void 0, arguments);
  },
  splice(...e) {
    return Bt(this, "splice", e);
  },
  toReversed() {
    return xt(this).toReversed();
  },
  toSorted(e) {
    return xt(this).toSorted(e);
  },
  toSpliced(...e) {
    return xt(this).toSpliced(...e);
  },
  unshift(...e) {
    return Bt(this, "unshift", e);
  },
  values() {
    return un(this, "values", be);
  },
};
function un(e, t, s) {
  const n = Hs(e),
    i = n[t]();
  return (
    n !== e &&
      !ze(e) &&
      ((i._next = i.next),
      (i.next = () => {
        const r = i._next();
        return r.value && (r.value = s(r.value)), r;
      })),
    i
  );
}
const sa = Array.prototype;
function Je(e, t, s, n, i, r) {
  const o = Hs(e),
    a = o !== e && !ze(e),
    l = o[t];
  if (l !== sa[t]) {
    const f = l.apply(e, r);
    return a ? be(f) : f;
  }
  let d = s;
  o !== e &&
    (a
      ? (d = function (f, w) {
          return s.call(this, be(f), w, e);
        })
      : s.length > 2 &&
        (d = function (f, w) {
          return s.call(this, f, w, e);
        }));
  const c = l.call(o, d, n);
  return a && i ? i(c) : c;
}
function vi(e, t, s, n) {
  const i = Hs(e);
  let r = s;
  return (
    i !== e &&
      (ze(e)
        ? s.length > 3 &&
          (r = function (o, a, l) {
            return s.call(this, o, a, l, e);
          })
        : (r = function (o, a, l) {
            return s.call(this, o, be(a), l, e);
          })),
    i[t](r, ...n)
  );
}
function dn(e, t, s) {
  const n = G(e);
  ge(n, "iterate", ts);
  const i = n[t](...s);
  return (i === -1 || i === !1) && Zn(s[0])
    ? ((s[0] = G(s[0])), n[t](...s))
    : i;
}
function Bt(e, t, s = []) {
  et(), Qn();
  const n = G(e)[t].apply(e, s);
  return Vn(), tt(), n;
}
const na = Hn("__proto__,__v_isRef,__isVue"),
  _r = new Set(
    Object.getOwnPropertyNames(Symbol)
      .filter((e) => e !== "arguments" && e !== "caller")
      .map((e) => Symbol[e])
      .filter(nt)
  );
function ia(e) {
  nt(e) || (e = String(e));
  const t = G(this);
  return ge(t, "has", e), t.hasOwnProperty(e);
}
class kr {
  constructor(t = !1, s = !1) {
    (this._isReadonly = t), (this._isShallow = s);
  }
  get(t, s, n) {
    if (s === "__v_skip") return t.__v_skip;
    const i = this._isReadonly,
      r = this._isShallow;
    if (s === "__v_isReactive") return !i;
    if (s === "__v_isReadonly") return i;
    if (s === "__v_isShallow") return r;
    if (s === "__v_raw")
      return n === (i ? (r ? ga : Mr) : r ? Tr : Sr).get(t) ||
        Object.getPrototypeOf(t) === Object.getPrototypeOf(n)
        ? t
        : void 0;
    const o = H(t);
    if (!i) {
      let l;
      if (o && (l = ta[s])) return l;
      if (s === "hasOwnProperty") return ia;
    }
    const a = Reflect.get(t, s, _e(t) ? t : n);
    return (nt(s) ? _r.has(s) : na(s)) || (i || ge(t, "get", s), r)
      ? a
      : _e(a)
      ? o && Un(s)
        ? a
        : a.value
      : ie(a)
      ? i
        ? Er(a)
        : Jn(a)
      : a;
  }
}
class xr extends kr {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, s, n, i) {
    let r = t[s];
    if (!this._isShallow) {
      const l = vt(r);
      if (
        (!ze(n) && !vt(n) && ((r = G(r)), (n = G(n))), !H(t) && _e(r) && !_e(n))
      )
        return l ? !1 : ((r.value = n), !0);
    }
    const o = H(t) && Un(s) ? Number(s) < t.length : W(t, s),
      a = Reflect.set(t, s, n, _e(t) ? t : i);
    return (
      t === G(i) && (o ? wt(n, r) && Ye(t, "set", s, n) : Ye(t, "add", s, n)), a
    );
  }
  deleteProperty(t, s) {
    const n = W(t, s);
    t[s];
    const i = Reflect.deleteProperty(t, s);
    return i && n && Ye(t, "delete", s, void 0), i;
  }
  has(t, s) {
    const n = Reflect.has(t, s);
    return (!nt(s) || !_r.has(s)) && ge(t, "has", s), n;
  }
  ownKeys(t) {
    return ge(t, "iterate", H(t) ? "length" : bt), Reflect.ownKeys(t);
  }
}
class ra extends kr {
  constructor(t = !1) {
    super(!0, t);
  }
  set(t, s) {
    return !0;
  }
  deleteProperty(t, s) {
    return !0;
  }
}
const oa = new xr(),
  aa = new ra(),
  la = new xr(!0);
const En = (e) => e,
  ps = (e) => Reflect.getPrototypeOf(e);
function ca(e, t, s) {
  return function (...n) {
    const i = this.__v_raw,
      r = G(i),
      o = At(r),
      a = e === "entries" || (e === Symbol.iterator && o),
      l = e === "keys" && o,
      d = i[e](...n),
      c = s ? En : t ? Ts : be;
    return (
      !t && ge(r, "iterate", l ? Mn : bt),
      {
        next() {
          const { value: f, done: w } = d.next();
          return w
            ? { value: f, done: w }
            : { value: a ? [c(f[0]), c(f[1])] : c(f), done: w };
        },
        [Symbol.iterator]() {
          return this;
        },
      }
    );
  };
}
function ms(e) {
  return function (...t) {
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function ua(e, t) {
  const s = {
    get(i) {
      const r = this.__v_raw,
        o = G(r),
        a = G(i);
      e || (wt(i, a) && ge(o, "get", i), ge(o, "get", a));
      const { has: l } = ps(o),
        d = t ? En : e ? Ts : be;
      if (l.call(o, i)) return d(r.get(i));
      if (l.call(o, a)) return d(r.get(a));
      r !== o && r.get(i);
    },
    get size() {
      const i = this.__v_raw;
      return !e && ge(G(i), "iterate", bt), Reflect.get(i, "size", i);
    },
    has(i) {
      const r = this.__v_raw,
        o = G(r),
        a = G(i);
      return (
        e || (wt(i, a) && ge(o, "has", i), ge(o, "has", a)),
        i === a ? r.has(i) : r.has(i) || r.has(a)
      );
    },
    forEach(i, r) {
      const o = this,
        a = o.__v_raw,
        l = G(a),
        d = t ? En : e ? Ts : be;
      return (
        !e && ge(l, "iterate", bt),
        a.forEach((c, f) => i.call(r, d(c), d(f), o))
      );
    },
  };
  return (
    he(
      s,
      e
        ? {
            add: ms("add"),
            set: ms("set"),
            delete: ms("delete"),
            clear: ms("clear"),
          }
        : {
            add(i) {
              !t && !ze(i) && !vt(i) && (i = G(i));
              const r = G(this);
              return (
                ps(r).has.call(r, i) || (r.add(i), Ye(r, "add", i, i)), this
              );
            },
            set(i, r) {
              !t && !ze(r) && !vt(r) && (r = G(r));
              const o = G(this),
                { has: a, get: l } = ps(o);
              let d = a.call(o, i);
              d || ((i = G(i)), (d = a.call(o, i)));
              const c = l.call(o, i);
              return (
                o.set(i, r),
                d ? wt(r, c) && Ye(o, "set", i, r) : Ye(o, "add", i, r),
                this
              );
            },
            delete(i) {
              const r = G(this),
                { has: o, get: a } = ps(r);
              let l = o.call(r, i);
              l || ((i = G(i)), (l = o.call(r, i))), a && a.call(r, i);
              const d = r.delete(i);
              return l && Ye(r, "delete", i, void 0), d;
            },
            clear() {
              const i = G(this),
                r = i.size !== 0,
                o = i.clear();
              return r && Ye(i, "clear", void 0, void 0), o;
            },
          }
    ),
    ["keys", "values", "entries", Symbol.iterator].forEach((i) => {
      s[i] = ca(i, e, t);
    }),
    s
  );
}
function Kn(e, t) {
  const s = ua(e, t);
  return (n, i, r) =>
    i === "__v_isReactive"
      ? !e
      : i === "__v_isReadonly"
      ? e
      : i === "__v_raw"
      ? n
      : Reflect.get(W(s, i) && i in n ? s : n, i, r);
}
const da = { get: Kn(!1, !1) },
  ha = { get: Kn(!1, !0) },
  fa = { get: Kn(!0, !1) };
const Sr = new WeakMap(),
  Tr = new WeakMap(),
  Mr = new WeakMap(),
  ga = new WeakMap();
function pa(e) {
  switch (e) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function ma(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : pa(jo(e));
}
function Jn(e) {
  return vt(e) ? e : Gn(e, !1, oa, da, Sr);
}
function ya(e) {
  return Gn(e, !1, la, ha, Tr);
}
function Er(e) {
  return Gn(e, !0, aa, fa, Mr);
}
function Gn(e, t, s, n, i) {
  if (!ie(e) || (e.__v_raw && !(t && e.__v_isReactive))) return e;
  const r = ma(e);
  if (r === 0) return e;
  const o = i.get(e);
  if (o) return o;
  const a = new Proxy(e, r === 2 ? n : s);
  return i.set(e, a), a;
}
function Pt(e) {
  return vt(e) ? Pt(e.__v_raw) : !!(e && e.__v_isReactive);
}
function vt(e) {
  return !!(e && e.__v_isReadonly);
}
function ze(e) {
  return !!(e && e.__v_isShallow);
}
function Zn(e) {
  return e ? !!e.__v_raw : !1;
}
function G(e) {
  const t = e && e.__v_raw;
  return t ? G(t) : e;
}
function wa(e) {
  return (
    !W(e, "__v_skip") && Object.isExtensible(e) && kn(e, "__v_skip", !0), e
  );
}
const be = (e) => (ie(e) ? Jn(e) : e),
  Ts = (e) => (ie(e) ? Er(e) : e);
function _e(e) {
  return e ? e.__v_isRef === !0 : !1;
}
function ba(e) {
  return _e(e) ? e.value : e;
}
const va = {
  get: (e, t, s) => (t === "__v_raw" ? e : ba(Reflect.get(e, t, s))),
  set: (e, t, s, n) => {
    const i = e[t];
    return _e(i) && !_e(s) ? ((i.value = s), !0) : Reflect.set(e, t, s, n);
  },
};
function Ar(e) {
  return Pt(e) ? e : new Proxy(e, va);
}
class Ca {
  constructor(t, s, n) {
    (this.fn = t),
      (this.setter = s),
      (this._value = void 0),
      (this.dep = new vr(this)),
      (this.__v_isRef = !0),
      (this.deps = void 0),
      (this.depsTail = void 0),
      (this.flags = 16),
      (this.globalVersion = es - 1),
      (this.next = void 0),
      (this.effect = this),
      (this.__v_isReadonly = !s),
      (this.isSSR = n);
  }
  notify() {
    if (((this.flags |= 16), !(this.flags & 8) && ee !== this))
      return pr(this, !0), !0;
  }
  get value() {
    const t = this.dep.track();
    return wr(this), t && (t.version = this.dep.version), this._value;
  }
  set value(t) {
    this.setter && this.setter(t);
  }
}
function _a(e, t, s = !1) {
  let n, i;
  return U(e) ? (n = e) : ((n = e.get), (i = e.set)), new Ca(n, i, s);
}
const ys = {},
  Ms = new WeakMap();
let mt;
function ka(e, t = !1, s = mt) {
  if (s) {
    let n = Ms.get(s);
    n || Ms.set(s, (n = [])), n.push(e);
  }
}
function xa(e, t, s = Z) {
  const {
      immediate: n,
      deep: i,
      once: r,
      scheduler: o,
      augmentJob: a,
      call: l,
    } = s,
    d = (P) => (i ? P : ze(P) || i === !1 || i === 0 ? Xe(P, 1) : Xe(P));
  let c,
    f,
    w,
    S,
    C = !1,
    _ = !1;
  if (
    (_e(e)
      ? ((f = () => e.value), (C = ze(e)))
      : Pt(e)
      ? ((f = () => d(e)), (C = !0))
      : H(e)
      ? ((_ = !0),
        (C = e.some((P) => Pt(P) || ze(P))),
        (f = () =>
          e.map((P) => {
            if (_e(P)) return P.value;
            if (Pt(P)) return d(P);
            if (U(P)) return l ? l(P, 2) : P();
          })))
      : U(e)
      ? t
        ? (f = l ? () => l(e, 2) : e)
        : (f = () => {
            if (w) {
              et();
              try {
                w();
              } finally {
                tt();
              }
            }
            const P = mt;
            mt = c;
            try {
              return l ? l(e, 3, [S]) : e(S);
            } finally {
              mt = P;
            }
          })
      : (f = $e),
    t && i)
  ) {
    const P = f,
      D = i === !0 ? 1 / 0 : i;
    f = () => Xe(P(), D);
  }
  const y = Yo(),
    O = () => {
      c.stop(), y && y.active && qn(y.effects, c);
    };
  if (r && t) {
    const P = t;
    t = (...D) => {
      P(...D), O();
    };
  }
  let F = _ ? new Array(e.length).fill(ys) : ys;
  const N = (P) => {
    if (!(!(c.flags & 1) || (!c.dirty && !P)))
      if (t) {
        const D = c.run();
        if (i || C || (_ ? D.some((Q, K) => wt(Q, F[K])) : wt(D, F))) {
          w && w();
          const Q = mt;
          mt = c;
          try {
            const K = [D, F === ys ? void 0 : _ && F[0] === ys ? [] : F, S];
            (F = D), l ? l(t, 3, K) : t(...K);
          } finally {
            mt = Q;
          }
        }
      } else c.run();
  };
  return (
    a && a(N),
    (c = new fr(f)),
    (c.scheduler = o ? () => o(N, !1) : N),
    (S = (P) => ka(P, !1, c)),
    (w = c.onStop =
      () => {
        const P = Ms.get(c);
        if (P) {
          if (l) l(P, 4);
          else for (const D of P) D();
          Ms.delete(c);
        }
      }),
    t ? (n ? N(!0) : (F = c.run())) : o ? o(N.bind(null, !0), !0) : c.run(),
    (O.pause = c.pause.bind(c)),
    (O.resume = c.resume.bind(c)),
    (O.stop = O),
    O
  );
}
function Xe(e, t = 1 / 0, s) {
  if (t <= 0 || !ie(e) || e.__v_skip || ((s = s || new Set()), s.has(e)))
    return e;
  if ((s.add(e), t--, _e(e))) Xe(e.value, t, s);
  else if (H(e)) for (let n = 0; n < e.length; n++) Xe(e[n], t, s);
  else if (or(e) || At(e))
    e.forEach((n) => {
      Xe(n, t, s);
    });
  else if (cr(e)) {
    for (const n in e) Xe(e[n], t, s);
    for (const n of Object.getOwnPropertySymbols(e))
      Object.prototype.propertyIsEnumerable.call(e, n) && Xe(e[n], t, s);
  }
  return e;
}
/**
 * @vue/runtime-core v3.5.17
 * (c) 2018-present Yuxi (Evan) You and Vue contributors
 * @license MIT
 **/ function ls(e, t, s, n) {
  try {
    return n ? e(...n) : e();
  } catch (i) {
    js(i, t, s);
  }
}
function Ke(e, t, s, n) {
  if (U(e)) {
    const i = ls(e, t, s, n);
    return (
      i &&
        ar(i) &&
        i.catch((r) => {
          js(r, t, s);
        }),
      i
    );
  }
  if (H(e)) {
    const i = [];
    for (let r = 0; r < e.length; r++) i.push(Ke(e[r], t, s, n));
    return i;
  }
}
function js(e, t, s, n = !0) {
  const i = t ? t.vnode : null,
    { errorHandler: r, throwUnhandledErrorInProduction: o } =
      (t && t.appContext.config) || Z;
  if (t) {
    let a = t.parent;
    const l = t.proxy,
      d = `https://vuejs.org/error-reference/#runtime-${s}`;
    for (; a; ) {
      const c = a.ec;
      if (c) {
        for (let f = 0; f < c.length; f++) if (c[f](e, l, d) === !1) return;
      }
      a = a.parent;
    }
    if (r) {
      et(), ls(r, null, 10, [e, l, d]), tt();
      return;
    }
  }
  Sa(e, s, i, n, o);
}
function Sa(e, t, s, n = !0, i = !1) {
  if (i) throw e;
  console.error(e);
}
const ve = [];
let Qe = -1;
const It = [];
let lt = null,
  St = 0;
const Pr = Promise.resolve();
let Es = null;
function Ta(e) {
  const t = Es || Pr;
  return e ? t.then(this ? e.bind(this) : e) : t;
}
function Ma(e) {
  let t = Qe + 1,
    s = ve.length;
  for (; t < s; ) {
    const n = (t + s) >>> 1,
      i = ve[n],
      r = ss(i);
    r < e || (r === e && i.flags & 2) ? (t = n + 1) : (s = n);
  }
  return t;
}
function Yn(e) {
  if (!(e.flags & 1)) {
    const t = ss(e),
      s = ve[ve.length - 1];
    !s || (!(e.flags & 2) && t >= ss(s)) ? ve.push(e) : ve.splice(Ma(t), 0, e),
      (e.flags |= 1),
      Ir();
  }
}
function Ir() {
  Es || (Es = Pr.then(Or));
}
function Ea(e) {
  H(e)
    ? It.push(...e)
    : lt && e.id === -1
    ? lt.splice(St + 1, 0, e)
    : e.flags & 1 || (It.push(e), (e.flags |= 1)),
    Ir();
}
function Ci(e, t, s = Qe + 1) {
  for (; s < ve.length; s++) {
    const n = ve[s];
    if (n && n.flags & 2) {
      if (e && n.id !== e.uid) continue;
      ve.splice(s, 1),
        s--,
        n.flags & 4 && (n.flags &= -2),
        n(),
        n.flags & 4 || (n.flags &= -2);
    }
  }
}
function Rr(e) {
  if (It.length) {
    const t = [...new Set(It)].sort((s, n) => ss(s) - ss(n));
    if (((It.length = 0), lt)) {
      lt.push(...t);
      return;
    }
    for (lt = t, St = 0; St < lt.length; St++) {
      const s = lt[St];
      s.flags & 4 && (s.flags &= -2), s.flags & 8 || s(), (s.flags &= -2);
    }
    (lt = null), (St = 0);
  }
}
const ss = (e) => (e.id == null ? (e.flags & 2 ? -1 : 1 / 0) : e.id);
function Or(e) {
  const t = $e;
  try {
    for (Qe = 0; Qe < ve.length; Qe++) {
      const s = ve[Qe];
      s &&
        !(s.flags & 8) &&
        (s.flags & 4 && (s.flags &= -2),
        ls(s, s.i, s.i ? 15 : 14),
        s.flags & 4 || (s.flags &= -2));
    }
  } finally {
    for (; Qe < ve.length; Qe++) {
      const s = ve[Qe];
      s && (s.flags &= -2);
    }
    (Qe = -1),
      (ve.length = 0),
      Rr(),
      (Es = null),
      (ve.length || It.length) && Or();
  }
}
let de = null,
  Lr = null;
function As(e) {
  const t = de;
  return (de = e), (Lr = (e && e.type.__scopeId) || null), t;
}
function Mt(e, t = de, s) {
  if (!t || e._n) return e;
  const n = (...i) => {
    n._d && Pi(-1);
    const r = As(t);
    let o;
    try {
      o = e(...i);
    } finally {
      As(r), n._d && Pi(1);
    }
    return o;
  };
  return (n._n = !0), (n._c = !0), (n._d = !0), n;
}
function ut(e, t) {
  if (de === null) return e;
  const s = Vs(de),
    n = e.dirs || (e.dirs = []);
  for (let i = 0; i < t.length; i++) {
    let [r, o, a, l = Z] = t[i];
    r &&
      (U(r) && (r = { mounted: r, updated: r }),
      r.deep && Xe(o),
      n.push({
        dir: r,
        instance: s,
        value: o,
        oldValue: void 0,
        arg: a,
        modifiers: l,
      }));
  }
  return e;
}
function gt(e, t, s, n) {
  const i = e.dirs,
    r = t && t.dirs;
  for (let o = 0; o < i.length; o++) {
    const a = i[o];
    r && (a.oldValue = r[o].value);
    let l = a.dir[n];
    l && (et(), Ke(l, s, 8, [e.el, a, e, t]), tt());
  }
}
const Aa = Symbol("_vte"),
  Pa = (e) => e.__isTeleport;
function Xn(e, t) {
  e.shapeFlag & 6 && e.component
    ? ((e.transition = t), Xn(e.component.subTree, t))
    : e.shapeFlag & 128
    ? ((e.ssContent.transition = t.clone(e.ssContent)),
      (e.ssFallback.transition = t.clone(e.ssFallback)))
    : (e.transition = t);
}
function $r(e) {
  e.ids = [e.ids[0] + e.ids[2]++ + "-", 0, 0];
}
function Zt(e, t, s, n, i = !1) {
  if (H(e)) {
    e.forEach((C, _) => Zt(C, t && (H(t) ? t[_] : t), s, n, i));
    return;
  }
  if (Rt(n) && !i) {
    n.shapeFlag & 512 &&
      n.type.__asyncResolved &&
      n.component.subTree.component &&
      Zt(e, t, s, n.component.subTree);
    return;
  }
  const r = n.shapeFlag & 4 ? Vs(n.component) : n.el,
    o = i ? null : r,
    { i: a, r: l } = e,
    d = t && t.r,
    c = a.refs === Z ? (a.refs = {}) : a.refs,
    f = a.setupState,
    w = G(f),
    S = f === Z ? () => !1 : (C) => W(w, C);
  if (
    (d != null &&
      d !== l &&
      (ae(d)
        ? ((c[d] = null), S(d) && (f[d] = null))
        : _e(d) && (d.value = null)),
    U(l))
  )
    ls(l, a, 12, [o, c]);
  else {
    const C = ae(l),
      _ = _e(l);
    if (C || _) {
      const y = () => {
        if (e.f) {
          const O = C ? (S(l) ? f[l] : c[l]) : l.value;
          i
            ? H(O) && qn(O, r)
            : H(O)
            ? O.includes(r) || O.push(r)
            : C
            ? ((c[l] = [r]), S(l) && (f[l] = c[l]))
            : ((l.value = [r]), e.k && (c[e.k] = l.value));
        } else
          C
            ? ((c[l] = o), S(l) && (f[l] = o))
            : _ && ((l.value = o), e.k && (c[e.k] = o));
      };
      o ? ((y.id = -1), Ae(y, s)) : y();
    }
  }
}
Bs().requestIdleCallback;
Bs().cancelIdleCallback;
const Rt = (e) => !!e.type.__asyncLoader,
  Dr = (e) => e.type.__isKeepAlive;
function Ia(e, t) {
  zr(e, "a", t);
}
function Ra(e, t) {
  zr(e, "da", t);
}
function zr(e, t, s = pe) {
  const n =
    e.__wdc ||
    (e.__wdc = () => {
      let i = s;
      for (; i; ) {
        if (i.isDeactivated) return;
        i = i.parent;
      }
      return e();
    });
  if ((qs(t, n, s), s)) {
    let i = s.parent;
    for (; i && i.parent; )
      Dr(i.parent.vnode) && Oa(n, t, s, i), (i = i.parent);
  }
}
function Oa(e, t, s, n) {
  const i = qs(t, e, n, !0);
  Fr(() => {
    qn(n[t], i);
  }, s);
}
function qs(e, t, s = pe, n = !1) {
  if (s) {
    const i = s[e] || (s[e] = []),
      r =
        t.__weh ||
        (t.__weh = (...o) => {
          et();
          const a = cs(s),
            l = Ke(t, s, e, o);
          return a(), tt(), l;
        });
    return n ? i.unshift(r) : i.push(r), r;
  }
}
const it =
    (e) =>
    (t, s = pe) => {
      (!rs || e === "sp") && qs(e, (...n) => t(...n), s);
    },
  La = it("bm"),
  $a = it("m"),
  Da = it("bu"),
  za = it("u"),
  Fa = it("bum"),
  Fr = it("um"),
  Na = it("sp"),
  Ba = it("rtg"),
  Ha = it("rtc");
function ja(e, t = pe) {
  qs("ec", e, t);
}
const ei = "components";
function ue(e, t) {
  return Br(ei, e, !0, t) || e;
}
const Nr = Symbol.for("v-ndc");
function qa(e) {
  return ae(e) ? Br(ei, e, !1) || e : e || Nr;
}
function Br(e, t, s = !0, n = !1) {
  const i = de || pe;
  if (i) {
    const r = i.type;
    if (e === ei) {
      const a = Il(r, !1);
      if (a && (a === t || a === Ie(t) || a === Ns(Ie(t)))) return r;
    }
    const o = _i(i[e] || r[e], t) || _i(i.appContext[e], t);
    return !o && n ? r : o;
  }
}
function _i(e, t) {
  return e && (e[t] || e[Ie(t)] || e[Ns(Ie(t))]);
}
function ns(e, t, s, n) {
  let i;
  const r = s && s[n],
    o = H(e);
  if (o || ae(e)) {
    const a = o && Pt(e);
    let l = !1,
      d = !1;
    a && ((l = !ze(e)), (d = vt(e)), (e = Hs(e))), (i = new Array(e.length));
    for (let c = 0, f = e.length; c < f; c++)
      i[c] = t(l ? (d ? Ts(be(e[c])) : be(e[c])) : e[c], c, void 0, r && r[c]);
  } else if (typeof e == "number") {
    i = new Array(e);
    for (let a = 0; a < e; a++) i[a] = t(a + 1, a, void 0, r && r[a]);
  } else if (ie(e))
    if (e[Symbol.iterator])
      i = Array.from(e, (a, l) => t(a, l, void 0, r && r[l]));
    else {
      const a = Object.keys(e);
      i = new Array(a.length);
      for (let l = 0, d = a.length; l < d; l++) {
        const c = a[l];
        i[l] = t(e[c], c, l, r && r[l]);
      }
    }
  else i = [];
  return s && (s[n] = i), i;
}
function Ua(e, t, s = {}, n, i) {
  if (de.ce || (de.parent && Rt(de.parent) && de.parent.ce))
    return (
      t !== "default" && (s.name = t),
      I(),
      Ce(le, null, [$("slot", s, n && n())], 64)
    );
  let r = e[t];
  r && r._c && (r._d = !1), I();
  const o = r && Hr(r(s)),
    a = s.key || (o && o.key),
    l = Ce(
      le,
      { key: (a && !nt(a) ? a : `_${t}`) + (!o && n ? "_fb" : "") },
      o || (n ? n() : []),
      o && e._ === 1 ? 64 : -2
    );
  return (
    !i && l.scopeId && (l.slotScopeIds = [l.scopeId + "-s"]),
    r && r._c && (r._d = !0),
    l
  );
}
function Hr(e) {
  return e.some((t) =>
    ii(t) ? !(t.type === st || (t.type === le && !Hr(t.children))) : !0
  )
    ? e
    : null;
}
const An = (e) => (e ? (oo(e) ? Vs(e) : An(e.parent)) : null),
  Yt = he(Object.create(null), {
    $: (e) => e,
    $el: (e) => e.vnode.el,
    $data: (e) => e.data,
    $props: (e) => e.props,
    $attrs: (e) => e.attrs,
    $slots: (e) => e.slots,
    $refs: (e) => e.refs,
    $parent: (e) => An(e.parent),
    $root: (e) => An(e.root),
    $host: (e) => e.ce,
    $emit: (e) => e.emit,
    $options: (e) => ti(e),
    $forceUpdate: (e) =>
      e.f ||
      (e.f = () => {
        Yn(e.update);
      }),
    $nextTick: (e) => e.n || (e.n = Ta.bind(e.proxy)),
    $watch: (e) => hl.bind(e),
  }),
  hn = (e, t) => e !== Z && !e.__isScriptSetup && W(e, t),
  Qa = {
    get({ _: e }, t) {
      if (t === "__v_skip") return !0;
      const {
        ctx: s,
        setupState: n,
        data: i,
        props: r,
        accessCache: o,
        type: a,
        appContext: l,
      } = e;
      let d;
      if (t[0] !== "$") {
        const S = o[t];
        if (S !== void 0)
          switch (S) {
            case 1:
              return n[t];
            case 2:
              return i[t];
            case 4:
              return s[t];
            case 3:
              return r[t];
          }
        else {
          if (hn(n, t)) return (o[t] = 1), n[t];
          if (i !== Z && W(i, t)) return (o[t] = 2), i[t];
          if ((d = e.propsOptions[0]) && W(d, t)) return (o[t] = 3), r[t];
          if (s !== Z && W(s, t)) return (o[t] = 4), s[t];
          Pn && (o[t] = 0);
        }
      }
      const c = Yt[t];
      let f, w;
      if (c) return t === "$attrs" && ge(e.attrs, "get", ""), c(e);
      if ((f = a.__cssModules) && (f = f[t])) return f;
      if (s !== Z && W(s, t)) return (o[t] = 4), s[t];
      if (((w = l.config.globalProperties), W(w, t))) return w[t];
    },
    set({ _: e }, t, s) {
      const { data: n, setupState: i, ctx: r } = e;
      return hn(i, t)
        ? ((i[t] = s), !0)
        : n !== Z && W(n, t)
        ? ((n[t] = s), !0)
        : W(e.props, t) || (t[0] === "$" && t.slice(1) in e)
        ? !1
        : ((r[t] = s), !0);
    },
    has(
      {
        _: {
          data: e,
          setupState: t,
          accessCache: s,
          ctx: n,
          appContext: i,
          propsOptions: r,
        },
      },
      o
    ) {
      let a;
      return (
        !!s[o] ||
        (e !== Z && W(e, o)) ||
        hn(t, o) ||
        ((a = r[0]) && W(a, o)) ||
        W(n, o) ||
        W(Yt, o) ||
        W(i.config.globalProperties, o)
      );
    },
    defineProperty(e, t, s) {
      return (
        s.get != null
          ? (e._.accessCache[t] = 0)
          : W(s, "value") && this.set(e, t, s.value, null),
        Reflect.defineProperty(e, t, s)
      );
    },
  };
function ki(e) {
  return H(e) ? e.reduce((t, s) => ((t[s] = null), t), {}) : e;
}
let Pn = !0;
function Va(e) {
  const t = ti(e),
    s = e.proxy,
    n = e.ctx;
  (Pn = !1), t.beforeCreate && xi(t.beforeCreate, e, "bc");
  const {
    data: i,
    computed: r,
    methods: o,
    watch: a,
    provide: l,
    inject: d,
    created: c,
    beforeMount: f,
    mounted: w,
    beforeUpdate: S,
    updated: C,
    activated: _,
    deactivated: y,
    beforeDestroy: O,
    beforeUnmount: F,
    destroyed: N,
    unmounted: P,
    render: D,
    renderTracked: Q,
    renderTriggered: K,
    errorCaptured: se,
    serverPrefetch: ke,
    expose: Re,
    inheritAttrs: Be,
    components: ds,
    directives: hs,
    filters: sn,
  } = t;
  if ((d && Wa(d, n, null), o))
    for (const ne in o) {
      const Y = o[ne];
      U(Y) && (n[ne] = Y.bind(s));
    }
  if (i) {
    const ne = i.call(s, s);
    ie(ne) && (e.data = Jn(ne));
  }
  if (((Pn = !0), r))
    for (const ne in r) {
      const Y = r[ne],
        ht = U(Y) ? Y.bind(s, s) : U(Y.get) ? Y.get.bind(s, s) : $e,
        fs = !U(Y) && U(Y.set) ? Y.set.bind(s) : $e,
        ft = Ol({ get: ht, set: fs });
      Object.defineProperty(n, ne, {
        enumerable: !0,
        configurable: !0,
        get: () => ft.value,
        set: (He) => (ft.value = He),
      });
    }
  if (a) for (const ne in a) jr(a[ne], n, s, ne);
  if (l) {
    const ne = U(l) ? l.call(s) : l;
    Reflect.ownKeys(ne).forEach((Y) => {
      Xa(Y, ne[Y]);
    });
  }
  c && xi(c, e, "c");
  function ye(ne, Y) {
    H(Y) ? Y.forEach((ht) => ne(ht.bind(s))) : Y && ne(Y.bind(s));
  }
  if (
    (ye(La, f),
    ye($a, w),
    ye(Da, S),
    ye(za, C),
    ye(Ia, _),
    ye(Ra, y),
    ye(ja, se),
    ye(Ha, Q),
    ye(Ba, K),
    ye(Fa, F),
    ye(Fr, P),
    ye(Na, ke),
    H(Re))
  )
    if (Re.length) {
      const ne = e.exposed || (e.exposed = {});
      Re.forEach((Y) => {
        Object.defineProperty(ne, Y, {
          get: () => s[Y],
          set: (ht) => (s[Y] = ht),
        });
      });
    } else e.exposed || (e.exposed = {});
  D && e.render === $e && (e.render = D),
    Be != null && (e.inheritAttrs = Be),
    ds && (e.components = ds),
    hs && (e.directives = hs),
    ke && $r(e);
}
function Wa(e, t, s = $e) {
  H(e) && (e = In(e));
  for (const n in e) {
    const i = e[n];
    let r;
    ie(i)
      ? "default" in i
        ? (r = bs(i.from || n, i.default, !0))
        : (r = bs(i.from || n))
      : (r = bs(i)),
      _e(r)
        ? Object.defineProperty(t, n, {
            enumerable: !0,
            configurable: !0,
            get: () => r.value,
            set: (o) => (r.value = o),
          })
        : (t[n] = r);
  }
}
function xi(e, t, s) {
  Ke(H(e) ? e.map((n) => n.bind(t.proxy)) : e.bind(t.proxy), t, s);
}
function jr(e, t, s, n) {
  let i = n.includes(".") ? to(s, n) : () => s[n];
  if (ae(e)) {
    const r = t[e];
    U(r) && gn(i, r);
  } else if (U(e)) gn(i, e.bind(s));
  else if (ie(e))
    if (H(e)) e.forEach((r) => jr(r, t, s, n));
    else {
      const r = U(e.handler) ? e.handler.bind(s) : t[e.handler];
      U(r) && gn(i, r, e);
    }
}
function ti(e) {
  const t = e.type,
    { mixins: s, extends: n } = t,
    {
      mixins: i,
      optionsCache: r,
      config: { optionMergeStrategies: o },
    } = e.appContext,
    a = r.get(t);
  let l;
  return (
    a
      ? (l = a)
      : !i.length && !s && !n
      ? (l = t)
      : ((l = {}), i.length && i.forEach((d) => Ps(l, d, o, !0)), Ps(l, t, o)),
    ie(t) && r.set(t, l),
    l
  );
}
function Ps(e, t, s, n = !1) {
  const { mixins: i, extends: r } = t;
  r && Ps(e, r, s, !0), i && i.forEach((o) => Ps(e, o, s, !0));
  for (const o in t)
    if (!(n && o === "expose")) {
      const a = Ka[o] || (s && s[o]);
      e[o] = a ? a(e[o], t[o]) : t[o];
    }
  return e;
}
const Ka = {
  data: Si,
  props: Ti,
  emits: Ti,
  methods: Wt,
  computed: Wt,
  beforeCreate: we,
  created: we,
  beforeMount: we,
  mounted: we,
  beforeUpdate: we,
  updated: we,
  beforeDestroy: we,
  beforeUnmount: we,
  destroyed: we,
  unmounted: we,
  activated: we,
  deactivated: we,
  errorCaptured: we,
  serverPrefetch: we,
  components: Wt,
  directives: Wt,
  watch: Ga,
  provide: Si,
  inject: Ja,
};
function Si(e, t) {
  return t
    ? e
      ? function () {
          return he(
            U(e) ? e.call(this, this) : e,
            U(t) ? t.call(this, this) : t
          );
        }
      : t
    : e;
}
function Ja(e, t) {
  return Wt(In(e), In(t));
}
function In(e) {
  if (H(e)) {
    const t = {};
    for (let s = 0; s < e.length; s++) t[e[s]] = e[s];
    return t;
  }
  return e;
}
function we(e, t) {
  return e ? [...new Set([].concat(e, t))] : t;
}
function Wt(e, t) {
  return e ? he(Object.create(null), e, t) : t;
}
function Ti(e, t) {
  return e
    ? H(e) && H(t)
      ? [...new Set([...e, ...t])]
      : he(Object.create(null), ki(e), ki(t ?? {}))
    : t;
}
function Ga(e, t) {
  if (!e) return t;
  if (!t) return e;
  const s = he(Object.create(null), e);
  for (const n in t) s[n] = we(e[n], t[n]);
  return s;
}
function qr() {
  return {
    app: null,
    config: {
      isNativeTag: Bo,
      performance: !1,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {},
    },
    mixins: [],
    components: {},
    directives: {},
    provides: Object.create(null),
    optionsCache: new WeakMap(),
    propsCache: new WeakMap(),
    emitsCache: new WeakMap(),
  };
}
let Za = 0;
function Ya(e, t) {
  return function (n, i = null) {
    U(n) || (n = he({}, n)), i != null && !ie(i) && (i = null);
    const r = qr(),
      o = new WeakSet(),
      a = [];
    let l = !1;
    const d = (r.app = {
      _uid: Za++,
      _component: n,
      _props: i,
      _container: null,
      _context: r,
      _instance: null,
      version: Ll,
      get config() {
        return r.config;
      },
      set config(c) {},
      use(c, ...f) {
        return (
          o.has(c) ||
            (c && U(c.install)
              ? (o.add(c), c.install(d, ...f))
              : U(c) && (o.add(c), c(d, ...f))),
          d
        );
      },
      mixin(c) {
        return r.mixins.includes(c) || r.mixins.push(c), d;
      },
      component(c, f) {
        return f ? ((r.components[c] = f), d) : r.components[c];
      },
      directive(c, f) {
        return f ? ((r.directives[c] = f), d) : r.directives[c];
      },
      mount(c, f, w) {
        if (!l) {
          const S = d._ceVNode || $(n, i);
          return (
            (S.appContext = r),
            w === !0 ? (w = "svg") : w === !1 && (w = void 0),
            f && t ? t(S, c) : e(S, c, w),
            (l = !0),
            (d._container = c),
            (c.__vue_app__ = d),
            Vs(S.component)
          );
        }
      },
      onUnmount(c) {
        a.push(c);
      },
      unmount() {
        l &&
          (Ke(a, d._instance, 16),
          e(null, d._container),
          delete d._container.__vue_app__);
      },
      provide(c, f) {
        return (r.provides[c] = f), d;
      },
      runWithContext(c) {
        const f = Ot;
        Ot = d;
        try {
          return c();
        } finally {
          Ot = f;
        }
      },
    });
    return d;
  };
}
let Ot = null;
function Xa(e, t) {
  if (pe) {
    let s = pe.provides;
    const n = pe.parent && pe.parent.provides;
    n === s && (s = pe.provides = Object.create(n)), (s[e] = t);
  }
}
function bs(e, t, s = !1) {
  const n = pe || de;
  if (n || Ot) {
    let i = Ot
      ? Ot._context.provides
      : n
      ? n.parent == null || n.ce
        ? n.vnode.appContext && n.vnode.appContext.provides
        : n.parent.provides
      : void 0;
    if (i && e in i) return i[e];
    if (arguments.length > 1) return s && U(t) ? t.call(n && n.proxy) : t;
  }
}
const Ur = {},
  Qr = () => Object.create(Ur),
  Vr = (e) => Object.getPrototypeOf(e) === Ur;
function el(e, t, s, n = !1) {
  const i = {},
    r = Qr();
  (e.propsDefaults = Object.create(null)), Wr(e, t, i, r);
  for (const o in e.propsOptions[0]) o in i || (i[o] = void 0);
  s ? (e.props = n ? i : ya(i)) : e.type.props ? (e.props = i) : (e.props = r),
    (e.attrs = r);
}
function tl(e, t, s, n) {
  const {
      props: i,
      attrs: r,
      vnode: { patchFlag: o },
    } = e,
    a = G(i),
    [l] = e.propsOptions;
  let d = !1;
  if ((n || o > 0) && !(o & 16)) {
    if (o & 8) {
      const c = e.vnode.dynamicProps;
      for (let f = 0; f < c.length; f++) {
        let w = c[f];
        if (Us(e.emitsOptions, w)) continue;
        const S = t[w];
        if (l)
          if (W(r, w)) S !== r[w] && ((r[w] = S), (d = !0));
          else {
            const C = Ie(w);
            i[C] = Rn(l, a, C, S, e, !1);
          }
        else S !== r[w] && ((r[w] = S), (d = !0));
      }
    }
  } else {
    Wr(e, t, i, r) && (d = !0);
    let c;
    for (const f in a)
      (!t || (!W(t, f) && ((c = _t(f)) === f || !W(t, c)))) &&
        (l
          ? s &&
            (s[f] !== void 0 || s[c] !== void 0) &&
            (i[f] = Rn(l, a, f, void 0, e, !0))
          : delete i[f]);
    if (r !== a) for (const f in r) (!t || !W(t, f)) && (delete r[f], (d = !0));
  }
  d && Ye(e.attrs, "set", "");
}
function Wr(e, t, s, n) {
  const [i, r] = e.propsOptions;
  let o = !1,
    a;
  if (t)
    for (let l in t) {
      if (Kt(l)) continue;
      const d = t[l];
      let c;
      i && W(i, (c = Ie(l)))
        ? !r || !r.includes(c)
          ? (s[c] = d)
          : ((a || (a = {}))[c] = d)
        : Us(e.emitsOptions, l) ||
          ((!(l in n) || d !== n[l]) && ((n[l] = d), (o = !0)));
    }
  if (r) {
    const l = G(s),
      d = a || Z;
    for (let c = 0; c < r.length; c++) {
      const f = r[c];
      s[f] = Rn(i, l, f, d[f], e, !W(d, f));
    }
  }
  return o;
}
function Rn(e, t, s, n, i, r) {
  const o = e[s];
  if (o != null) {
    const a = W(o, "default");
    if (a && n === void 0) {
      const l = o.default;
      if (o.type !== Function && !o.skipFactory && U(l)) {
        const { propsDefaults: d } = i;
        if (s in d) n = d[s];
        else {
          const c = cs(i);
          (n = d[s] = l.call(null, t)), c();
        }
      } else n = l;
      i.ce && i.ce._setProp(s, n);
    }
    o[0] &&
      (r && !a ? (n = !1) : o[1] && (n === "" || n === _t(s)) && (n = !0));
  }
  return n;
}
const sl = new WeakMap();
function Kr(e, t, s = !1) {
  const n = s ? sl : t.propsCache,
    i = n.get(e);
  if (i) return i;
  const r = e.props,
    o = {},
    a = [];
  let l = !1;
  if (!U(e)) {
    const c = (f) => {
      l = !0;
      const [w, S] = Kr(f, t, !0);
      he(o, w), S && a.push(...S);
    };
    !s && t.mixins.length && t.mixins.forEach(c),
      e.extends && c(e.extends),
      e.mixins && e.mixins.forEach(c);
  }
  if (!r && !l) return ie(e) && n.set(e, Et), Et;
  if (H(r))
    for (let c = 0; c < r.length; c++) {
      const f = Ie(r[c]);
      Mi(f) && (o[f] = Z);
    }
  else if (r)
    for (const c in r) {
      const f = Ie(c);
      if (Mi(f)) {
        const w = r[c],
          S = (o[f] = H(w) || U(w) ? { type: w } : he({}, w)),
          C = S.type;
        let _ = !1,
          y = !0;
        if (H(C))
          for (let O = 0; O < C.length; ++O) {
            const F = C[O],
              N = U(F) && F.name;
            if (N === "Boolean") {
              _ = !0;
              break;
            } else N === "String" && (y = !1);
          }
        else _ = U(C) && C.name === "Boolean";
        (S[0] = _), (S[1] = y), (_ || W(S, "default")) && a.push(f);
      }
    }
  const d = [o, a];
  return ie(e) && n.set(e, d), d;
}
function Mi(e) {
  return e[0] !== "$" && !Kt(e);
}
const si = (e) => e[0] === "_" || e === "$stable",
  ni = (e) => (H(e) ? e.map(We) : [We(e)]),
  nl = (e, t, s) => {
    if (t._n) return t;
    const n = Mt((...i) => ni(t(...i)), s);
    return (n._c = !1), n;
  },
  Jr = (e, t, s) => {
    const n = e._ctx;
    for (const i in e) {
      if (si(i)) continue;
      const r = e[i];
      if (U(r)) t[i] = nl(i, r, n);
      else if (r != null) {
        const o = ni(r);
        t[i] = () => o;
      }
    }
  },
  Gr = (e, t) => {
    const s = ni(t);
    e.slots.default = () => s;
  },
  Zr = (e, t, s) => {
    for (const n in t) (s || !si(n)) && (e[n] = t[n]);
  },
  il = (e, t, s) => {
    const n = (e.slots = Qr());
    if (e.vnode.shapeFlag & 32) {
      const i = t.__;
      i && kn(n, "__", i, !0);
      const r = t._;
      r ? (Zr(n, t, s), s && kn(n, "_", r, !0)) : Jr(t, n);
    } else t && Gr(e, t);
  },
  rl = (e, t, s) => {
    const { vnode: n, slots: i } = e;
    let r = !0,
      o = Z;
    if (n.shapeFlag & 32) {
      const a = t._;
      a
        ? s && a === 1
          ? (r = !1)
          : Zr(i, t, s)
        : ((r = !t.$stable), Jr(t, i)),
        (o = t);
    } else t && (Gr(e, t), (o = { default: 1 }));
    if (r) for (const a in i) !si(a) && o[a] == null && delete i[a];
  },
  Ae = bl;
function ol(e) {
  return al(e);
}
function al(e, t) {
  const s = Bs();
  s.__VUE__ = !0;
  const {
      insert: n,
      remove: i,
      patchProp: r,
      createElement: o,
      createText: a,
      createComment: l,
      setText: d,
      setElementText: c,
      parentNode: f,
      nextSibling: w,
      setScopeId: S = $e,
      insertStaticContent: C,
    } = e,
    _ = (
      u,
      h,
      p,
      k = null,
      b = null,
      v = null,
      E = void 0,
      M = null,
      T = !!h.dynamicChildren
    ) => {
      if (u === h) return;
      u && !Ht(u, h) && ((k = gs(u)), He(u, b, v, !0), (u = null)),
        h.patchFlag === -2 && ((T = !1), (h.dynamicChildren = null));
      const { type: x, ref: L, shapeFlag: A } = h;
      switch (x) {
        case Qs:
          y(u, h, p, k);
          break;
        case st:
          O(u, h, p, k);
          break;
        case mn:
          u == null && F(h, p, k, E);
          break;
        case le:
          ds(u, h, p, k, b, v, E, M, T);
          break;
        default:
          A & 1
            ? D(u, h, p, k, b, v, E, M, T)
            : A & 6
            ? hs(u, h, p, k, b, v, E, M, T)
            : (A & 64 || A & 128) && x.process(u, h, p, k, b, v, E, M, T, kt);
      }
      L != null && b
        ? Zt(L, u && u.ref, v, h || u, !h)
        : L == null && u && u.ref != null && Zt(u.ref, null, v, u, !0);
    },
    y = (u, h, p, k) => {
      if (u == null) n((h.el = a(h.children)), p, k);
      else {
        const b = (h.el = u.el);
        h.children !== u.children && d(b, h.children);
      }
    },
    O = (u, h, p, k) => {
      u == null ? n((h.el = l(h.children || "")), p, k) : (h.el = u.el);
    },
    F = (u, h, p, k) => {
      [u.el, u.anchor] = C(u.children, h, p, k, u.el, u.anchor);
    },
    N = ({ el: u, anchor: h }, p, k) => {
      let b;
      for (; u && u !== h; ) (b = w(u)), n(u, p, k), (u = b);
      n(h, p, k);
    },
    P = ({ el: u, anchor: h }) => {
      let p;
      for (; u && u !== h; ) (p = w(u)), i(u), (u = p);
      i(h);
    },
    D = (u, h, p, k, b, v, E, M, T) => {
      h.type === "svg" ? (E = "svg") : h.type === "math" && (E = "mathml"),
        u == null ? Q(h, p, k, b, v, E, M, T) : ke(u, h, b, v, E, M, T);
    },
    Q = (u, h, p, k, b, v, E, M) => {
      let T, x;
      const { props: L, shapeFlag: A, transition: R, dirs: B } = u;
      if (
        ((T = u.el = o(u.type, v, L && L.is, L)),
        A & 8
          ? c(T, u.children)
          : A & 16 && se(u.children, T, null, k, b, fn(u, v), E, M),
        B && gt(u, null, k, "created"),
        K(T, u, u.scopeId, E, k),
        L)
      ) {
        for (const X in L) X !== "value" && !Kt(X) && r(T, X, null, L[X], v, k);
        "value" in L && r(T, "value", null, L.value, v),
          (x = L.onVnodeBeforeMount) && qe(x, k, u);
      }
      B && gt(u, null, k, "beforeMount");
      const V = ll(b, R);
      V && R.beforeEnter(T),
        n(T, h, p),
        ((x = L && L.onVnodeMounted) || V || B) &&
          Ae(() => {
            x && qe(x, k, u), V && R.enter(T), B && gt(u, null, k, "mounted");
          }, b);
    },
    K = (u, h, p, k, b) => {
      if ((p && S(u, p), k)) for (let v = 0; v < k.length; v++) S(u, k[v]);
      if (b) {
        let v = b.subTree;
        if (
          h === v ||
          (no(v.type) && (v.ssContent === h || v.ssFallback === h))
        ) {
          const E = b.vnode;
          K(u, E, E.scopeId, E.slotScopeIds, b.parent);
        }
      }
    },
    se = (u, h, p, k, b, v, E, M, T = 0) => {
      for (let x = T; x < u.length; x++) {
        const L = (u[x] = M ? ct(u[x]) : We(u[x]));
        _(null, L, h, p, k, b, v, E, M);
      }
    },
    ke = (u, h, p, k, b, v, E) => {
      const M = (h.el = u.el);
      let { patchFlag: T, dynamicChildren: x, dirs: L } = h;
      T |= u.patchFlag & 16;
      const A = u.props || Z,
        R = h.props || Z;
      let B;
      if (
        (p && pt(p, !1),
        (B = R.onVnodeBeforeUpdate) && qe(B, p, h, u),
        L && gt(h, u, p, "beforeUpdate"),
        p && pt(p, !0),
        ((A.innerHTML && R.innerHTML == null) ||
          (A.textContent && R.textContent == null)) &&
          c(M, ""),
        x
          ? Re(u.dynamicChildren, x, M, p, k, fn(h, b), v)
          : E || Y(u, h, M, null, p, k, fn(h, b), v, !1),
        T > 0)
      ) {
        if (T & 16) Be(M, A, R, p, b);
        else if (
          (T & 2 && A.class !== R.class && r(M, "class", null, R.class, b),
          T & 4 && r(M, "style", A.style, R.style, b),
          T & 8)
        ) {
          const V = h.dynamicProps;
          for (let X = 0; X < V.length; X++) {
            const J = V[X],
              xe = A[J],
              fe = R[J];
            (fe !== xe || J === "value") && r(M, J, xe, fe, b, p);
          }
        }
        T & 1 && u.children !== h.children && c(M, h.children);
      } else !E && x == null && Be(M, A, R, p, b);
      ((B = R.onVnodeUpdated) || L) &&
        Ae(() => {
          B && qe(B, p, h, u), L && gt(h, u, p, "updated");
        }, k);
    },
    Re = (u, h, p, k, b, v, E) => {
      for (let M = 0; M < h.length; M++) {
        const T = u[M],
          x = h[M],
          L =
            T.el && (T.type === le || !Ht(T, x) || T.shapeFlag & 198)
              ? f(T.el)
              : p;
        _(T, x, L, null, k, b, v, E, !0);
      }
    },
    Be = (u, h, p, k, b) => {
      if (h !== p) {
        if (h !== Z)
          for (const v in h) !Kt(v) && !(v in p) && r(u, v, h[v], null, b, k);
        for (const v in p) {
          if (Kt(v)) continue;
          const E = p[v],
            M = h[v];
          E !== M && v !== "value" && r(u, v, M, E, b, k);
        }
        "value" in p && r(u, "value", h.value, p.value, b);
      }
    },
    ds = (u, h, p, k, b, v, E, M, T) => {
      const x = (h.el = u ? u.el : a("")),
        L = (h.anchor = u ? u.anchor : a(""));
      let { patchFlag: A, dynamicChildren: R, slotScopeIds: B } = h;
      B && (M = M ? M.concat(B) : B),
        u == null
          ? (n(x, p, k), n(L, p, k), se(h.children || [], p, L, b, v, E, M, T))
          : A > 0 && A & 64 && R && u.dynamicChildren
          ? (Re(u.dynamicChildren, R, p, b, v, E, M),
            (h.key != null || (b && h === b.subTree)) && Yr(u, h, !0))
          : Y(u, h, p, L, b, v, E, M, T);
    },
    hs = (u, h, p, k, b, v, E, M, T) => {
      (h.slotScopeIds = M),
        u == null
          ? h.shapeFlag & 512
            ? b.ctx.activate(h, p, k, E, T)
            : sn(h, p, k, b, v, E, T)
          : fi(u, h, T);
    },
    sn = (u, h, p, k, b, v, E) => {
      const M = (u.component = Tl(u, k, b));
      if ((Dr(u) && (M.ctx.renderer = kt), Ml(M, !1, E), M.asyncDep)) {
        if ((b && b.registerDep(M, ye, E), !u.el)) {
          const T = (M.subTree = $(st));
          O(null, T, h, p);
        }
      } else ye(M, u, h, p, b, v, E);
    },
    fi = (u, h, p) => {
      const k = (h.component = u.component);
      if (yl(u, h, p))
        if (k.asyncDep && !k.asyncResolved) {
          ne(k, h, p);
          return;
        } else (k.next = h), k.update();
      else (h.el = u.el), (k.vnode = h);
    },
    ye = (u, h, p, k, b, v, E) => {
      const M = () => {
        if (u.isMounted) {
          let { next: A, bu: R, u: B, parent: V, vnode: X } = u;
          {
            const Me = Xr(u);
            if (Me) {
              A && ((A.el = X.el), ne(u, A, E)),
                Me.asyncDep.then(() => {
                  u.isUnmounted || M();
                });
              return;
            }
          }
          let J = A,
            xe;
          pt(u, !1),
            A ? ((A.el = X.el), ne(u, A, E)) : (A = X),
            R && ws(R),
            (xe = A.props && A.props.onVnodeBeforeUpdate) && qe(xe, V, A, X),
            pt(u, !0);
          const fe = pn(u),
            Oe = u.subTree;
          (u.subTree = fe),
            _(Oe, fe, f(Oe.el), gs(Oe), u, b, v),
            (A.el = fe.el),
            J === null && wl(u, fe.el),
            B && Ae(B, b),
            (xe = A.props && A.props.onVnodeUpdated) &&
              Ae(() => qe(xe, V, A, X), b);
        } else {
          let A;
          const { el: R, props: B } = h,
            { bm: V, m: X, parent: J, root: xe, type: fe } = u,
            Oe = Rt(h);
          if (
            (pt(u, !1),
            V && ws(V),
            !Oe && (A = B && B.onVnodeBeforeMount) && qe(A, J, h),
            pt(u, !0),
            R && on)
          ) {
            const Me = () => {
              (u.subTree = pn(u)), on(R, u.subTree, u, b, null);
            };
            Oe && fe.__asyncHydrate ? fe.__asyncHydrate(R, u, Me) : Me();
          } else {
            xe.ce &&
              xe.ce._def.shadowRoot !== !1 &&
              xe.ce._injectChildStyle(fe);
            const Me = (u.subTree = pn(u));
            _(null, Me, p, k, u, b, v), (h.el = Me.el);
          }
          if ((X && Ae(X, b), !Oe && (A = B && B.onVnodeMounted))) {
            const Me = h;
            Ae(() => qe(A, J, Me), b);
          }
          (h.shapeFlag & 256 ||
            (J && Rt(J.vnode) && J.vnode.shapeFlag & 256)) &&
            u.a &&
            Ae(u.a, b),
            (u.isMounted = !0),
            (h = p = k = null);
        }
      };
      u.scope.on();
      const T = (u.effect = new fr(M));
      u.scope.off();
      const x = (u.update = T.run.bind(T)),
        L = (u.job = T.runIfDirty.bind(T));
      (L.i = u), (L.id = u.uid), (T.scheduler = () => Yn(L)), pt(u, !0), x();
    },
    ne = (u, h, p) => {
      h.component = u;
      const k = u.vnode.props;
      (u.vnode = h),
        (u.next = null),
        tl(u, h.props, k, p),
        rl(u, h.children, p),
        et(),
        Ci(u),
        tt();
    },
    Y = (u, h, p, k, b, v, E, M, T = !1) => {
      const x = u && u.children,
        L = u ? u.shapeFlag : 0,
        A = h.children,
        { patchFlag: R, shapeFlag: B } = h;
      if (R > 0) {
        if (R & 128) {
          fs(x, A, p, k, b, v, E, M, T);
          return;
        } else if (R & 256) {
          ht(x, A, p, k, b, v, E, M, T);
          return;
        }
      }
      B & 8
        ? (L & 16 && Ft(x, b, v), A !== x && c(p, A))
        : L & 16
        ? B & 16
          ? fs(x, A, p, k, b, v, E, M, T)
          : Ft(x, b, v, !0)
        : (L & 8 && c(p, ""), B & 16 && se(A, p, k, b, v, E, M, T));
    },
    ht = (u, h, p, k, b, v, E, M, T) => {
      (u = u || Et), (h = h || Et);
      const x = u.length,
        L = h.length,
        A = Math.min(x, L);
      let R;
      for (R = 0; R < A; R++) {
        const B = (h[R] = T ? ct(h[R]) : We(h[R]));
        _(u[R], B, p, null, b, v, E, M, T);
      }
      x > L ? Ft(u, b, v, !0, !1, A) : se(h, p, k, b, v, E, M, T, A);
    },
    fs = (u, h, p, k, b, v, E, M, T) => {
      let x = 0;
      const L = h.length;
      let A = u.length - 1,
        R = L - 1;
      for (; x <= A && x <= R; ) {
        const B = u[x],
          V = (h[x] = T ? ct(h[x]) : We(h[x]));
        if (Ht(B, V)) _(B, V, p, null, b, v, E, M, T);
        else break;
        x++;
      }
      for (; x <= A && x <= R; ) {
        const B = u[A],
          V = (h[R] = T ? ct(h[R]) : We(h[R]));
        if (Ht(B, V)) _(B, V, p, null, b, v, E, M, T);
        else break;
        A--, R--;
      }
      if (x > A) {
        if (x <= R) {
          const B = R + 1,
            V = B < L ? h[B].el : k;
          for (; x <= R; )
            _(null, (h[x] = T ? ct(h[x]) : We(h[x])), p, V, b, v, E, M, T), x++;
        }
      } else if (x > R) for (; x <= A; ) He(u[x], b, v, !0), x++;
      else {
        const B = x,
          V = x,
          X = new Map();
        for (x = V; x <= R; x++) {
          const Ee = (h[x] = T ? ct(h[x]) : We(h[x]));
          Ee.key != null && X.set(Ee.key, x);
        }
        let J,
          xe = 0;
        const fe = R - V + 1;
        let Oe = !1,
          Me = 0;
        const Nt = new Array(fe);
        for (x = 0; x < fe; x++) Nt[x] = 0;
        for (x = B; x <= A; x++) {
          const Ee = u[x];
          if (xe >= fe) {
            He(Ee, b, v, !0);
            continue;
          }
          let je;
          if (Ee.key != null) je = X.get(Ee.key);
          else
            for (J = V; J <= R; J++)
              if (Nt[J - V] === 0 && Ht(Ee, h[J])) {
                je = J;
                break;
              }
          je === void 0
            ? He(Ee, b, v, !0)
            : ((Nt[je - V] = x + 1),
              je >= Me ? (Me = je) : (Oe = !0),
              _(Ee, h[je], p, null, b, v, E, M, T),
              xe++);
        }
        const mi = Oe ? cl(Nt) : Et;
        for (J = mi.length - 1, x = fe - 1; x >= 0; x--) {
          const Ee = V + x,
            je = h[Ee],
            yi = Ee + 1 < L ? h[Ee + 1].el : k;
          Nt[x] === 0
            ? _(null, je, p, yi, b, v, E, M, T)
            : Oe && (J < 0 || x !== mi[J] ? ft(je, p, yi, 2) : J--);
        }
      }
    },
    ft = (u, h, p, k, b = null) => {
      const { el: v, type: E, transition: M, children: T, shapeFlag: x } = u;
      if (x & 6) {
        ft(u.component.subTree, h, p, k);
        return;
      }
      if (x & 128) {
        u.suspense.move(h, p, k);
        return;
      }
      if (x & 64) {
        E.move(u, h, p, kt);
        return;
      }
      if (E === le) {
        n(v, h, p);
        for (let A = 0; A < T.length; A++) ft(T[A], h, p, k);
        n(u.anchor, h, p);
        return;
      }
      if (E === mn) {
        N(u, h, p);
        return;
      }
      if (k !== 2 && x & 1 && M)
        if (k === 0) M.beforeEnter(v), n(v, h, p), Ae(() => M.enter(v), b);
        else {
          const { leave: A, delayLeave: R, afterLeave: B } = M,
            V = () => {
              u.ctx.isUnmounted ? i(v) : n(v, h, p);
            },
            X = () => {
              A(v, () => {
                V(), B && B();
              });
            };
          R ? R(v, V, X) : X();
        }
      else n(v, h, p);
    },
    He = (u, h, p, k = !1, b = !1) => {
      const {
        type: v,
        props: E,
        ref: M,
        children: T,
        dynamicChildren: x,
        shapeFlag: L,
        patchFlag: A,
        dirs: R,
        cacheIndex: B,
      } = u;
      if (
        (A === -2 && (b = !1),
        M != null && (et(), Zt(M, null, p, u, !0), tt()),
        B != null && (h.renderCache[B] = void 0),
        L & 256)
      ) {
        h.ctx.deactivate(u);
        return;
      }
      const V = L & 1 && R,
        X = !Rt(u);
      let J;
      if ((X && (J = E && E.onVnodeBeforeUnmount) && qe(J, h, u), L & 6))
        No(u.component, p, k);
      else {
        if (L & 128) {
          u.suspense.unmount(p, k);
          return;
        }
        V && gt(u, null, h, "beforeUnmount"),
          L & 64
            ? u.type.remove(u, h, p, kt, k)
            : x && !x.hasOnce && (v !== le || (A > 0 && A & 64))
            ? Ft(x, h, p, !1, !0)
            : ((v === le && A & 384) || (!b && L & 16)) && Ft(T, h, p),
          k && gi(u);
      }
      ((X && (J = E && E.onVnodeUnmounted)) || V) &&
        Ae(() => {
          J && qe(J, h, u), V && gt(u, null, h, "unmounted");
        }, p);
    },
    gi = (u) => {
      const { type: h, el: p, anchor: k, transition: b } = u;
      if (h === le) {
        Fo(p, k);
        return;
      }
      if (h === mn) {
        P(u);
        return;
      }
      const v = () => {
        i(p), b && !b.persisted && b.afterLeave && b.afterLeave();
      };
      if (u.shapeFlag & 1 && b && !b.persisted) {
        const { leave: E, delayLeave: M } = b,
          T = () => E(p, v);
        M ? M(u.el, v, T) : T();
      } else v();
    },
    Fo = (u, h) => {
      let p;
      for (; u !== h; ) (p = w(u)), i(u), (u = p);
      i(h);
    },
    No = (u, h, p) => {
      const {
        bum: k,
        scope: b,
        job: v,
        subTree: E,
        um: M,
        m: T,
        a: x,
        parent: L,
        slots: { __: A },
      } = u;
      Ei(T),
        Ei(x),
        k && ws(k),
        L &&
          H(A) &&
          A.forEach((R) => {
            L.renderCache[R] = void 0;
          }),
        b.stop(),
        v && ((v.flags |= 8), He(E, u, h, p)),
        M && Ae(M, h),
        Ae(() => {
          u.isUnmounted = !0;
        }, h),
        h &&
          h.pendingBranch &&
          !h.isUnmounted &&
          u.asyncDep &&
          !u.asyncResolved &&
          u.suspenseId === h.pendingId &&
          (h.deps--, h.deps === 0 && h.resolve());
    },
    Ft = (u, h, p, k = !1, b = !1, v = 0) => {
      for (let E = v; E < u.length; E++) He(u[E], h, p, k, b);
    },
    gs = (u) => {
      if (u.shapeFlag & 6) return gs(u.component.subTree);
      if (u.shapeFlag & 128) return u.suspense.next();
      const h = w(u.anchor || u.el),
        p = h && h[Aa];
      return p ? w(p) : h;
    };
  let nn = !1;
  const pi = (u, h, p) => {
      u == null
        ? h._vnode && He(h._vnode, null, null, !0)
        : _(h._vnode || null, u, h, null, null, null, p),
        (h._vnode = u),
        nn || ((nn = !0), Ci(), Rr(), (nn = !1));
    },
    kt = {
      p: _,
      um: He,
      m: ft,
      r: gi,
      mt: sn,
      mc: se,
      pc: Y,
      pbc: Re,
      n: gs,
      o: e,
    };
  let rn, on;
  return (
    t && ([rn, on] = t(kt)), { render: pi, hydrate: rn, createApp: Ya(pi, rn) }
  );
}
function fn({ type: e, props: t }, s) {
  return (s === "svg" && e === "foreignObject") ||
    (s === "mathml" &&
      e === "annotation-xml" &&
      t &&
      t.encoding &&
      t.encoding.includes("html"))
    ? void 0
    : s;
}
function pt({ effect: e, job: t }, s) {
  s ? ((e.flags |= 32), (t.flags |= 4)) : ((e.flags &= -33), (t.flags &= -5));
}
function ll(e, t) {
  return (!e || (e && !e.pendingBranch)) && t && !t.persisted;
}
function Yr(e, t, s = !1) {
  const n = e.children,
    i = t.children;
  if (H(n) && H(i))
    for (let r = 0; r < n.length; r++) {
      const o = n[r];
      let a = i[r];
      a.shapeFlag & 1 &&
        !a.dynamicChildren &&
        ((a.patchFlag <= 0 || a.patchFlag === 32) &&
          ((a = i[r] = ct(i[r])), (a.el = o.el)),
        !s && a.patchFlag !== -2 && Yr(o, a)),
        a.type === Qs && (a.el = o.el),
        a.type === st && !a.el && (a.el = o.el);
    }
}
function cl(e) {
  const t = e.slice(),
    s = [0];
  let n, i, r, o, a;
  const l = e.length;
  for (n = 0; n < l; n++) {
    const d = e[n];
    if (d !== 0) {
      if (((i = s[s.length - 1]), e[i] < d)) {
        (t[n] = i), s.push(n);
        continue;
      }
      for (r = 0, o = s.length - 1; r < o; )
        (a = (r + o) >> 1), e[s[a]] < d ? (r = a + 1) : (o = a);
      d < e[s[r]] && (r > 0 && (t[n] = s[r - 1]), (s[r] = n));
    }
  }
  for (r = s.length, o = s[r - 1]; r-- > 0; ) (s[r] = o), (o = t[o]);
  return s;
}
function Xr(e) {
  const t = e.subTree.component;
  if (t) return t.asyncDep && !t.asyncResolved ? t : Xr(t);
}
function Ei(e) {
  if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
const ul = Symbol.for("v-scx"),
  dl = () => bs(ul);
function gn(e, t, s) {
  return eo(e, t, s);
}
function eo(e, t, s = Z) {
  const { immediate: n, deep: i, flush: r, once: o } = s,
    a = he({}, s),
    l = (t && n) || (!t && r !== "post");
  let d;
  if (rs) {
    if (r === "sync") {
      const S = dl();
      d = S.__watcherHandles || (S.__watcherHandles = []);
    } else if (!l) {
      const S = () => {};
      return (S.stop = $e), (S.resume = $e), (S.pause = $e), S;
    }
  }
  const c = pe;
  a.call = (S, C, _) => Ke(S, c, C, _);
  let f = !1;
  r === "post"
    ? (a.scheduler = (S) => {
        Ae(S, c && c.suspense);
      })
    : r !== "sync" &&
      ((f = !0),
      (a.scheduler = (S, C) => {
        C ? S() : Yn(S);
      })),
    (a.augmentJob = (S) => {
      t && (S.flags |= 4),
        f && ((S.flags |= 2), c && ((S.id = c.uid), (S.i = c)));
    });
  const w = xa(e, t, a);
  return rs && (d ? d.push(w) : l && w()), w;
}
function hl(e, t, s) {
  const n = this.proxy,
    i = ae(e) ? (e.includes(".") ? to(n, e) : () => n[e]) : e.bind(n, n);
  let r;
  U(t) ? (r = t) : ((r = t.handler), (s = t));
  const o = cs(this),
    a = eo(i, r.bind(n), s);
  return o(), a;
}
function to(e, t) {
  const s = t.split(".");
  return () => {
    let n = e;
    for (let i = 0; i < s.length && n; i++) n = n[s[i]];
    return n;
  };
}
const fl = (e, t) =>
  t === "modelValue" || t === "model-value"
    ? e.modelModifiers
    : e[`${t}Modifiers`] || e[`${Ie(t)}Modifiers`] || e[`${_t(t)}Modifiers`];
function gl(e, t, ...s) {
  if (e.isUnmounted) return;
  const n = e.vnode.props || Z;
  let i = s;
  const r = t.startsWith("update:"),
    o = r && fl(n, t.slice(7));
  o &&
    (o.trim && (i = s.map((c) => (ae(c) ? c.trim() : c))),
    o.number && (i = s.map(xn)));
  let a,
    l = n[(a = an(t))] || n[(a = an(Ie(t)))];
  !l && r && (l = n[(a = an(_t(t)))]), l && Ke(l, e, 6, i);
  const d = n[a + "Once"];
  if (d) {
    if (!e.emitted) e.emitted = {};
    else if (e.emitted[a]) return;
    (e.emitted[a] = !0), Ke(d, e, 6, i);
  }
}
function so(e, t, s = !1) {
  const n = t.emitsCache,
    i = n.get(e);
  if (i !== void 0) return i;
  const r = e.emits;
  let o = {},
    a = !1;
  if (!U(e)) {
    const l = (d) => {
      const c = so(d, t, !0);
      c && ((a = !0), he(o, c));
    };
    !s && t.mixins.length && t.mixins.forEach(l),
      e.extends && l(e.extends),
      e.mixins && e.mixins.forEach(l);
  }
  return !r && !a
    ? (ie(e) && n.set(e, null), null)
    : (H(r) ? r.forEach((l) => (o[l] = null)) : he(o, r),
      ie(e) && n.set(e, o),
      o);
}
function Us(e, t) {
  return !e || !Ds(t)
    ? !1
    : ((t = t.slice(2).replace(/Once$/, "")),
      W(e, t[0].toLowerCase() + t.slice(1)) || W(e, _t(t)) || W(e, t));
}
function pn(e) {
  const {
      type: t,
      vnode: s,
      proxy: n,
      withProxy: i,
      propsOptions: [r],
      slots: o,
      attrs: a,
      emit: l,
      render: d,
      renderCache: c,
      props: f,
      data: w,
      setupState: S,
      ctx: C,
      inheritAttrs: _,
    } = e,
    y = As(e);
  let O, F;
  try {
    if (s.shapeFlag & 4) {
      const P = i || n,
        D = P;
      (O = We(d.call(D, P, c, f, S, w, C))), (F = a);
    } else {
      const P = t;
      (O = We(
        P.length > 1 ? P(f, { attrs: a, slots: o, emit: l }) : P(f, null)
      )),
        (F = t.props ? a : pl(a));
    }
  } catch (P) {
    (Xt.length = 0), js(P, e, 1), (O = $(st));
  }
  let N = O;
  if (F && _ !== !1) {
    const P = Object.keys(F),
      { shapeFlag: D } = N;
    P.length &&
      D & 7 &&
      (r && P.some(jn) && (F = ml(F, r)), (N = $t(N, F, !1, !0)));
  }
  return (
    s.dirs &&
      ((N = $t(N, null, !1, !0)),
      (N.dirs = N.dirs ? N.dirs.concat(s.dirs) : s.dirs)),
    s.transition && Xn(N, s.transition),
    (O = N),
    As(y),
    O
  );
}
const pl = (e) => {
    let t;
    for (const s in e)
      (s === "class" || s === "style" || Ds(s)) && ((t || (t = {}))[s] = e[s]);
    return t;
  },
  ml = (e, t) => {
    const s = {};
    for (const n in e) (!jn(n) || !(n.slice(9) in t)) && (s[n] = e[n]);
    return s;
  };
function yl(e, t, s) {
  const { props: n, children: i, component: r } = e,
    { props: o, children: a, patchFlag: l } = t,
    d = r.emitsOptions;
  if (t.dirs || t.transition) return !0;
  if (s && l >= 0) {
    if (l & 1024) return !0;
    if (l & 16) return n ? Ai(n, o, d) : !!o;
    if (l & 8) {
      const c = t.dynamicProps;
      for (let f = 0; f < c.length; f++) {
        const w = c[f];
        if (o[w] !== n[w] && !Us(d, w)) return !0;
      }
    }
  } else
    return (i || a) && (!a || !a.$stable)
      ? !0
      : n === o
      ? !1
      : n
      ? o
        ? Ai(n, o, d)
        : !0
      : !!o;
  return !1;
}
function Ai(e, t, s) {
  const n = Object.keys(t);
  if (n.length !== Object.keys(e).length) return !0;
  for (let i = 0; i < n.length; i++) {
    const r = n[i];
    if (t[r] !== e[r] && !Us(s, r)) return !0;
  }
  return !1;
}
function wl({ vnode: e, parent: t }, s) {
  for (; t; ) {
    const n = t.subTree;
    if ((n.suspense && n.suspense.activeBranch === e && (n.el = e.el), n === e))
      ((e = t.vnode).el = s), (t = t.parent);
    else break;
  }
}
const no = (e) => e.__isSuspense;
function bl(e, t) {
  t && t.pendingBranch
    ? H(e)
      ? t.effects.push(...e)
      : t.effects.push(e)
    : Ea(e);
}
const le = Symbol.for("v-fgt"),
  Qs = Symbol.for("v-txt"),
  st = Symbol.for("v-cmt"),
  mn = Symbol.for("v-stc"),
  Xt = [];
let Pe = null;
function I(e = !1) {
  Xt.push((Pe = e ? null : []));
}
function vl() {
  Xt.pop(), (Pe = Xt[Xt.length - 1] || null);
}
let is = 1;
function Pi(e, t = !1) {
  (is += e), e < 0 && Pe && t && (Pe.hasOnce = !0);
}
function io(e) {
  return (
    (e.dynamicChildren = is > 0 ? Pe || Et : null),
    vl(),
    is > 0 && Pe && Pe.push(e),
    e
  );
}
function j(e, t, s, n, i, r) {
  return io(m(e, t, s, n, i, r, !0));
}
function Ce(e, t, s, n, i) {
  return io($(e, t, s, n, i, !0));
}
function ii(e) {
  return e ? e.__v_isVNode === !0 : !1;
}
function Ht(e, t) {
  return e.type === t.type && e.key === t.key;
}
const ro = ({ key: e }) => e ?? null,
  vs = ({ ref: e, ref_key: t, ref_for: s }) => (
    typeof e == "number" && (e = "" + e),
    e != null
      ? ae(e) || _e(e) || U(e)
        ? { i: de, r: e, k: t, f: !!s }
        : e
      : null
  );
function m(
  e,
  t = null,
  s = null,
  n = 0,
  i = null,
  r = e === le ? 0 : 1,
  o = !1,
  a = !1
) {
  const l = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e,
    props: t,
    key: t && ro(t),
    ref: t && vs(t),
    scopeId: Lr,
    slotScopeIds: null,
    children: s,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetStart: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag: r,
    patchFlag: n,
    dynamicProps: i,
    dynamicChildren: null,
    appContext: null,
    ctx: de,
  };
  return (
    a
      ? (ri(l, s), r & 128 && e.normalize(l))
      : s && (l.shapeFlag |= ae(s) ? 8 : 16),
    is > 0 &&
      !o &&
      Pe &&
      (l.patchFlag > 0 || r & 6) &&
      l.patchFlag !== 32 &&
      Pe.push(l),
    l
  );
}
const $ = Cl;
function Cl(e, t = null, s = null, n = 0, i = null, r = !1) {
  if (((!e || e === Nr) && (e = st), ii(e))) {
    const a = $t(e, t, !0);
    return (
      s && ri(a, s),
      is > 0 &&
        !r &&
        Pe &&
        (a.shapeFlag & 6 ? (Pe[Pe.indexOf(e)] = a) : Pe.push(a)),
      (a.patchFlag = -2),
      a
    );
  }
  if ((Rl(e) && (e = e.__vccOpts), t)) {
    t = _l(t);
    let { class: a, style: l } = t;
    a && !ae(a) && (t.class = oe(a)),
      ie(l) && (Zn(l) && !H(l) && (l = he({}, l)), (t.style = as(l)));
  }
  const o = ae(e) ? 1 : no(e) ? 128 : Pa(e) ? 64 : ie(e) ? 4 : U(e) ? 2 : 0;
  return m(e, t, s, n, i, o, r, !0);
}
function _l(e) {
  return e ? (Zn(e) || Vr(e) ? he({}, e) : e) : null;
}
function $t(e, t, s = !1, n = !1) {
  const { props: i, ref: r, patchFlag: o, children: a, transition: l } = e,
    d = t ? kl(i || {}, t) : i,
    c = {
      __v_isVNode: !0,
      __v_skip: !0,
      type: e.type,
      props: d,
      key: d && ro(d),
      ref:
        t && t.ref
          ? s && r
            ? H(r)
              ? r.concat(vs(t))
              : [r, vs(t)]
            : vs(t)
          : r,
      scopeId: e.scopeId,
      slotScopeIds: e.slotScopeIds,
      children: a,
      target: e.target,
      targetStart: e.targetStart,
      targetAnchor: e.targetAnchor,
      staticCount: e.staticCount,
      shapeFlag: e.shapeFlag,
      patchFlag: t && e.type !== le ? (o === -1 ? 16 : o | 16) : o,
      dynamicProps: e.dynamicProps,
      dynamicChildren: e.dynamicChildren,
      appContext: e.appContext,
      dirs: e.dirs,
      transition: l,
      component: e.component,
      suspense: e.suspense,
      ssContent: e.ssContent && $t(e.ssContent),
      ssFallback: e.ssFallback && $t(e.ssFallback),
      el: e.el,
      anchor: e.anchor,
      ctx: e.ctx,
      ce: e.ce,
    };
  return l && n && Xn(c, l.clone(c)), c;
}
function Ve(e = " ", t = 0) {
  return $(Qs, null, e, t);
}
function te(e = "", t = !1) {
  return t ? (I(), Ce(st, null, e)) : $(st, null, e);
}
function We(e) {
  return e == null || typeof e == "boolean"
    ? $(st)
    : H(e)
    ? $(le, null, e.slice())
    : ii(e)
    ? ct(e)
    : $(Qs, null, String(e));
}
function ct(e) {
  return (e.el === null && e.patchFlag !== -1) || e.memo ? e : $t(e);
}
function ri(e, t) {
  let s = 0;
  const { shapeFlag: n } = e;
  if (t == null) t = null;
  else if (H(t)) s = 16;
  else if (typeof t == "object")
    if (n & 65) {
      const i = t.default;
      i && (i._c && (i._d = !1), ri(e, i()), i._c && (i._d = !0));
      return;
    } else {
      s = 32;
      const i = t._;
      !i && !Vr(t)
        ? (t._ctx = de)
        : i === 3 &&
          de &&
          (de.slots._ === 1 ? (t._ = 1) : ((t._ = 2), (e.patchFlag |= 1024)));
    }
  else
    U(t)
      ? ((t = { default: t, _ctx: de }), (s = 32))
      : ((t = String(t)), n & 64 ? ((s = 16), (t = [Ve(t)])) : (s = 8));
  (e.children = t), (e.shapeFlag |= s);
}
function kl(...e) {
  const t = {};
  for (let s = 0; s < e.length; s++) {
    const n = e[s];
    for (const i in n)
      if (i === "class")
        t.class !== n.class && (t.class = oe([t.class, n.class]));
      else if (i === "style") t.style = as([t.style, n.style]);
      else if (Ds(i)) {
        const r = t[i],
          o = n[i];
        o &&
          r !== o &&
          !(H(r) && r.includes(o)) &&
          (t[i] = r ? [].concat(r, o) : o);
      } else i !== "" && (t[i] = n[i]);
  }
  return t;
}
function qe(e, t, s, n = null) {
  Ke(e, t, 7, [s, n]);
}
const xl = qr();
let Sl = 0;
function Tl(e, t, s) {
  const n = e.type,
    i = (t ? t.appContext : e.appContext) || xl,
    r = {
      uid: Sl++,
      vnode: e,
      type: n,
      parent: t,
      appContext: i,
      root: null,
      next: null,
      subTree: null,
      effect: null,
      update: null,
      job: null,
      scope: new Zo(!0),
      render: null,
      proxy: null,
      exposed: null,
      exposeProxy: null,
      withProxy: null,
      provides: t ? t.provides : Object.create(i.provides),
      ids: t ? t.ids : ["", 0, 0],
      accessCache: null,
      renderCache: [],
      components: null,
      directives: null,
      propsOptions: Kr(n, i),
      emitsOptions: so(n, i),
      emit: null,
      emitted: null,
      propsDefaults: Z,
      inheritAttrs: n.inheritAttrs,
      ctx: Z,
      data: Z,
      props: Z,
      attrs: Z,
      slots: Z,
      refs: Z,
      setupState: Z,
      setupContext: null,
      suspense: s,
      suspenseId: s ? s.pendingId : 0,
      asyncDep: null,
      asyncResolved: !1,
      isMounted: !1,
      isUnmounted: !1,
      isDeactivated: !1,
      bc: null,
      c: null,
      bm: null,
      m: null,
      bu: null,
      u: null,
      um: null,
      bum: null,
      da: null,
      a: null,
      rtg: null,
      rtc: null,
      ec: null,
      sp: null,
    };
  return (
    (r.ctx = { _: r }),
    (r.root = t ? t.root : r),
    (r.emit = gl.bind(null, r)),
    e.ce && e.ce(r),
    r
  );
}
let pe = null,
  Is,
  On;
{
  const e = Bs(),
    t = (s, n) => {
      let i;
      return (
        (i = e[s]) || (i = e[s] = []),
        i.push(n),
        (r) => {
          i.length > 1 ? i.forEach((o) => o(r)) : i[0](r);
        }
      );
    };
  (Is = t("__VUE_INSTANCE_SETTERS__", (s) => (pe = s))),
    (On = t("__VUE_SSR_SETTERS__", (s) => (rs = s)));
}
const cs = (e) => {
    const t = pe;
    return (
      Is(e),
      e.scope.on(),
      () => {
        e.scope.off(), Is(t);
      }
    );
  },
  Ii = () => {
    pe && pe.scope.off(), Is(null);
  };
function oo(e) {
  return e.vnode.shapeFlag & 4;
}
let rs = !1;
function Ml(e, t = !1, s = !1) {
  t && On(t);
  const { props: n, children: i } = e.vnode,
    r = oo(e);
  el(e, n, r, t), il(e, i, s || t);
  const o = r ? El(e, t) : void 0;
  return t && On(!1), o;
}
function El(e, t) {
  const s = e.type;
  (e.accessCache = Object.create(null)), (e.proxy = new Proxy(e.ctx, Qa));
  const { setup: n } = s;
  if (n) {
    et();
    const i = (e.setupContext = n.length > 1 ? Pl(e) : null),
      r = cs(e),
      o = ls(n, e, 0, [e.props, i]),
      a = ar(o);
    if ((tt(), r(), (a || e.sp) && !Rt(e) && $r(e), a)) {
      if ((o.then(Ii, Ii), t))
        return o
          .then((l) => {
            Ri(e, l, t);
          })
          .catch((l) => {
            js(l, e, 0);
          });
      e.asyncDep = o;
    } else Ri(e, o, t);
  } else ao(e, t);
}
function Ri(e, t, s) {
  U(t)
    ? e.type.__ssrInlineRender
      ? (e.ssrRender = t)
      : (e.render = t)
    : ie(t) && (e.setupState = Ar(t)),
    ao(e, s);
}
let Oi;
function ao(e, t, s) {
  const n = e.type;
  if (!e.render) {
    if (!t && Oi && !n.render) {
      const i = n.template || ti(e).template;
      if (i) {
        const { isCustomElement: r, compilerOptions: o } = e.appContext.config,
          { delimiters: a, compilerOptions: l } = n,
          d = he(he({ isCustomElement: r, delimiters: a }, o), l);
        n.render = Oi(i, d);
      }
    }
    e.render = n.render || $e;
  }
  {
    const i = cs(e);
    et();
    try {
      Va(e);
    } finally {
      tt(), i();
    }
  }
}
const Al = {
  get(e, t) {
    return ge(e, "get", ""), e[t];
  },
};
function Pl(e) {
  const t = (s) => {
    e.exposed = s || {};
  };
  return {
    attrs: new Proxy(e.attrs, Al),
    slots: e.slots,
    emit: e.emit,
    expose: t,
  };
}
function Vs(e) {
  return e.exposed
    ? e.exposeProxy ||
        (e.exposeProxy = new Proxy(Ar(wa(e.exposed)), {
          get(t, s) {
            if (s in t) return t[s];
            if (s in Yt) return Yt[s](e);
          },
          has(t, s) {
            return s in t || s in Yt;
          },
        }))
    : e.proxy;
}
function Il(e, t = !0) {
  return U(e) ? e.displayName || e.name : e.name || (t && e.__name);
}
function Rl(e) {
  return U(e) && "__vccOpts" in e;
}
const Ol = (e, t) => _a(e, t, rs),
  Ll = "3.5.17";
/**
 * @vue/runtime-dom v3.5.17
 * (c) 2018-present Yuxi (Evan) You and Vue contributors
 * @license MIT
 **/ let Ln;
const Li = typeof window < "u" && window.trustedTypes;
if (Li)
  try {
    Ln = Li.createPolicy("vue", { createHTML: (e) => e });
  } catch {}
const lo = Ln ? (e) => Ln.createHTML(e) : (e) => e,
  $l = "http://www.w3.org/2000/svg",
  Dl = "http://www.w3.org/1998/Math/MathML",
  Ze = typeof document < "u" ? document : null,
  $i = Ze && Ze.createElement("template"),
  zl = {
    insert: (e, t, s) => {
      t.insertBefore(e, s || null);
    },
    remove: (e) => {
      const t = e.parentNode;
      t && t.removeChild(e);
    },
    createElement: (e, t, s, n) => {
      const i =
        t === "svg"
          ? Ze.createElementNS($l, e)
          : t === "mathml"
          ? Ze.createElementNS(Dl, e)
          : s
          ? Ze.createElement(e, { is: s })
          : Ze.createElement(e);
      return (
        e === "select" &&
          n &&
          n.multiple != null &&
          i.setAttribute("multiple", n.multiple),
        i
      );
    },
    createText: (e) => Ze.createTextNode(e),
    createComment: (e) => Ze.createComment(e),
    setText: (e, t) => {
      e.nodeValue = t;
    },
    setElementText: (e, t) => {
      e.textContent = t;
    },
    parentNode: (e) => e.parentNode,
    nextSibling: (e) => e.nextSibling,
    querySelector: (e) => Ze.querySelector(e),
    setScopeId(e, t) {
      e.setAttribute(t, "");
    },
    insertStaticContent(e, t, s, n, i, r) {
      const o = s ? s.previousSibling : t.lastChild;
      if (i && (i === r || i.nextSibling))
        for (
          ;
          t.insertBefore(i.cloneNode(!0), s),
            !(i === r || !(i = i.nextSibling));

        );
      else {
        $i.innerHTML = lo(
          n === "svg"
            ? `<svg>${e}</svg>`
            : n === "mathml"
            ? `<math>${e}</math>`
            : e
        );
        const a = $i.content;
        if (n === "svg" || n === "mathml") {
          const l = a.firstChild;
          for (; l.firstChild; ) a.appendChild(l.firstChild);
          a.removeChild(l);
        }
        t.insertBefore(a, s);
      }
      return [
        o ? o.nextSibling : t.firstChild,
        s ? s.previousSibling : t.lastChild,
      ];
    },
  },
  Fl = Symbol("_vtc");
function Nl(e, t, s) {
  const n = e[Fl];
  n && (t = (t ? [t, ...n] : [...n]).join(" ")),
    t == null
      ? e.removeAttribute("class")
      : s
      ? e.setAttribute("class", t)
      : (e.className = t);
}
const Rs = Symbol("_vod"),
  co = Symbol("_vsh"),
  Lt = {
    beforeMount(e, { value: t }, { transition: s }) {
      (e[Rs] = e.style.display === "none" ? "" : e.style.display),
        s && t ? s.beforeEnter(e) : jt(e, t);
    },
    mounted(e, { value: t }, { transition: s }) {
      s && t && s.enter(e);
    },
    updated(e, { value: t, oldValue: s }, { transition: n }) {
      !t != !s &&
        (n
          ? t
            ? (n.beforeEnter(e), jt(e, !0), n.enter(e))
            : n.leave(e, () => {
                jt(e, !1);
              })
          : jt(e, t));
    },
    beforeUnmount(e, { value: t }) {
      jt(e, t);
    },
  };
function jt(e, t) {
  (e.style.display = t ? e[Rs] : "none"), (e[co] = !t);
}
const Bl = Symbol(""),
  Hl = /(^|;)\s*display\s*:/;
function jl(e, t, s) {
  const n = e.style,
    i = ae(s);
  let r = !1;
  if (s && !i) {
    if (t)
      if (ae(t))
        for (const o of t.split(";")) {
          const a = o.slice(0, o.indexOf(":")).trim();
          s[a] == null && Cs(n, a, "");
        }
      else for (const o in t) s[o] == null && Cs(n, o, "");
    for (const o in s) o === "display" && (r = !0), Cs(n, o, s[o]);
  } else if (i) {
    if (t !== s) {
      const o = n[Bl];
      o && (s += ";" + o), (n.cssText = s), (r = Hl.test(s));
    }
  } else t && e.removeAttribute("style");
  Rs in e && ((e[Rs] = r ? n.display : ""), e[co] && (n.display = "none"));
}
const Di = /\s*!important$/;
function Cs(e, t, s) {
  if (H(s)) s.forEach((n) => Cs(e, t, n));
  else if ((s == null && (s = ""), t.startsWith("--"))) e.setProperty(t, s);
  else {
    const n = ql(e, t);
    Di.test(s)
      ? e.setProperty(_t(n), s.replace(Di, ""), "important")
      : (e[n] = s);
  }
}
const zi = ["Webkit", "Moz", "ms"],
  yn = {};
function ql(e, t) {
  const s = yn[t];
  if (s) return s;
  let n = Ie(t);
  if (n !== "filter" && n in e) return (yn[t] = n);
  n = Ns(n);
  for (let i = 0; i < zi.length; i++) {
    const r = zi[i] + n;
    if (r in e) return (yn[t] = r);
  }
  return t;
}
const Fi = "http://www.w3.org/1999/xlink";
function Ni(e, t, s, n, i, r = Go(t)) {
  n && t.startsWith("xlink:")
    ? s == null
      ? e.removeAttributeNS(Fi, t.slice(6, t.length))
      : e.setAttributeNS(Fi, t, s)
    : s == null || (r && !ur(s))
    ? e.removeAttribute(t)
    : e.setAttribute(t, r ? "" : nt(s) ? String(s) : s);
}
function Bi(e, t, s, n, i) {
  if (t === "innerHTML" || t === "textContent") {
    s != null && (e[t] = t === "innerHTML" ? lo(s) : s);
    return;
  }
  const r = e.tagName;
  if (t === "value" && r !== "PROGRESS" && !r.includes("-")) {
    const a = r === "OPTION" ? e.getAttribute("value") || "" : e.value,
      l = s == null ? (e.type === "checkbox" ? "on" : "") : String(s);
    (a !== l || !("_value" in e)) && (e.value = l),
      s == null && e.removeAttribute(t),
      (e._value = s);
    return;
  }
  let o = !1;
  if (s === "" || s == null) {
    const a = typeof e[t];
    a === "boolean"
      ? (s = ur(s))
      : s == null && a === "string"
      ? ((s = ""), (o = !0))
      : a === "number" && ((s = 0), (o = !0));
  }
  try {
    e[t] = s;
  } catch {}
  o && e.removeAttribute(i || t);
}
function Tt(e, t, s, n) {
  e.addEventListener(t, s, n);
}
function Ul(e, t, s, n) {
  e.removeEventListener(t, s, n);
}
const Hi = Symbol("_vei");
function Ql(e, t, s, n, i = null) {
  const r = e[Hi] || (e[Hi] = {}),
    o = r[t];
  if (n && o) o.value = n;
  else {
    const [a, l] = Vl(t);
    if (n) {
      const d = (r[t] = Jl(n, i));
      Tt(e, a, d, l);
    } else o && (Ul(e, a, o, l), (r[t] = void 0));
  }
}
const ji = /(?:Once|Passive|Capture)$/;
function Vl(e) {
  let t;
  if (ji.test(e)) {
    t = {};
    let n;
    for (; (n = e.match(ji)); )
      (e = e.slice(0, e.length - n[0].length)), (t[n[0].toLowerCase()] = !0);
  }
  return [e[2] === ":" ? e.slice(3) : _t(e.slice(2)), t];
}
let wn = 0;
const Wl = Promise.resolve(),
  Kl = () => wn || (Wl.then(() => (wn = 0)), (wn = Date.now()));
function Jl(e, t) {
  const s = (n) => {
    if (!n._vts) n._vts = Date.now();
    else if (n._vts <= s.attached) return;
    Ke(Gl(n, s.value), t, 5, [n]);
  };
  return (s.value = e), (s.attached = Kl()), s;
}
function Gl(e, t) {
  if (H(t)) {
    const s = e.stopImmediatePropagation;
    return (
      (e.stopImmediatePropagation = () => {
        s.call(e), (e._stopped = !0);
      }),
      t.map((n) => (i) => !i._stopped && n && n(i))
    );
  } else return t;
}
const qi = (e) =>
    e.charCodeAt(0) === 111 &&
    e.charCodeAt(1) === 110 &&
    e.charCodeAt(2) > 96 &&
    e.charCodeAt(2) < 123,
  Zl = (e, t, s, n, i, r) => {
    const o = i === "svg";
    t === "class"
      ? Nl(e, n, o)
      : t === "style"
      ? jl(e, s, n)
      : Ds(t)
      ? jn(t) || Ql(e, t, s, n, r)
      : (
          t[0] === "."
            ? ((t = t.slice(1)), !0)
            : t[0] === "^"
            ? ((t = t.slice(1)), !1)
            : Yl(e, t, n, o)
        )
      ? (Bi(e, t, n),
        !e.tagName.includes("-") &&
          (t === "value" || t === "checked" || t === "selected") &&
          Ni(e, t, n, o, r, t !== "value"))
      : e._isVueCE && (/[A-Z]/.test(t) || !ae(n))
      ? Bi(e, Ie(t), n, r, t)
      : (t === "true-value"
          ? (e._trueValue = n)
          : t === "false-value" && (e._falseValue = n),
        Ni(e, t, n, o));
  };
function Yl(e, t, s, n) {
  if (n)
    return !!(
      t === "innerHTML" ||
      t === "textContent" ||
      (t in e && qi(t) && U(s))
    );
  if (
    t === "spellcheck" ||
    t === "draggable" ||
    t === "translate" ||
    t === "autocorrect" ||
    t === "form" ||
    (t === "list" && e.tagName === "INPUT") ||
    (t === "type" && e.tagName === "TEXTAREA")
  )
    return !1;
  if (t === "width" || t === "height") {
    const i = e.tagName;
    if (i === "IMG" || i === "VIDEO" || i === "CANVAS" || i === "SOURCE")
      return !1;
  }
  return qi(t) && ae(s) ? !1 : t in e;
}
const Ui = (e) => {
  const t = e.props["onUpdate:modelValue"] || !1;
  return H(t) ? (s) => ws(t, s) : t;
};
function Xl(e) {
  e.target.composing = !0;
}
function Qi(e) {
  const t = e.target;
  t.composing && ((t.composing = !1), t.dispatchEvent(new Event("input")));
}
const bn = Symbol("_assign"),
  uo = {
    created(e, { modifiers: { lazy: t, trim: s, number: n } }, i) {
      e[bn] = Ui(i);
      const r = n || (i.props && i.props.type === "number");
      Tt(e, t ? "change" : "input", (o) => {
        if (o.target.composing) return;
        let a = e.value;
        s && (a = a.trim()), r && (a = xn(a)), e[bn](a);
      }),
        s &&
          Tt(e, "change", () => {
            e.value = e.value.trim();
          }),
        t ||
          (Tt(e, "compositionstart", Xl),
          Tt(e, "compositionend", Qi),
          Tt(e, "change", Qi));
    },
    mounted(e, { value: t }) {
      e.value = t ?? "";
    },
    beforeUpdate(
      e,
      { value: t, oldValue: s, modifiers: { lazy: n, trim: i, number: r } },
      o
    ) {
      if (((e[bn] = Ui(o)), e.composing)) return;
      const a =
          (r || e.type === "number") && !/^0\d/.test(e.value)
            ? xn(e.value)
            : e.value,
        l = t ?? "";
      a !== l &&
        ((document.activeElement === e &&
          e.type !== "range" &&
          ((n && t === s) || (i && e.value.trim() === l))) ||
          (e.value = l));
    },
  },
  ec = he({ patchProp: Zl }, zl);
let Vi;
function tc() {
  return Vi || (Vi = ol(ec));
}
const sc = (...e) => {
  const t = tc().createApp(...e),
    { mount: s } = t;
  return (
    (t.mount = (n) => {
      const i = ic(n);
      if (!i) return;
      const r = t._component;
      !U(r) && !r.render && !r.template && (r.template = i.innerHTML),
        i.nodeType === 1 && (i.textContent = "");
      const o = s(i, !1, nc(i));
      return (
        i instanceof Element &&
          (i.removeAttribute("v-cloak"), i.setAttribute("data-v-app", "")),
        o
      );
    }),
    t
  );
};
function nc(e) {
  if (e instanceof SVGElement) return "svg";
  if (typeof MathMLElement == "function" && e instanceof MathMLElement)
    return "mathml";
}
function ic(e) {
  return ae(e) ? document.querySelector(e) : e;
}
function ho(e, t) {
  return function () {
    return e.apply(t, arguments);
  };
}
const { toString: rc } = Object.prototype,
  { getPrototypeOf: oi } = Object,
  { iterator: Ws, toStringTag: fo } = Symbol,
  Ks = ((e) => (t) => {
    const s = rc.call(t);
    return e[s] || (e[s] = s.slice(8, -1).toLowerCase());
  })(Object.create(null)),
  Ne = (e) => ((e = e.toLowerCase()), (t) => Ks(t) === e),
  Js = (e) => (t) => typeof t === e,
  { isArray: Dt } = Array,
  os = Js("undefined");
function oc(e) {
  return (
    e !== null &&
    !os(e) &&
    e.constructor !== null &&
    !os(e.constructor) &&
    Te(e.constructor.isBuffer) &&
    e.constructor.isBuffer(e)
  );
}
const go = Ne("ArrayBuffer");
function ac(e) {
  let t;
  return (
    typeof ArrayBuffer < "u" && ArrayBuffer.isView
      ? (t = ArrayBuffer.isView(e))
      : (t = e && e.buffer && go(e.buffer)),
    t
  );
}
const lc = Js("string"),
  Te = Js("function"),
  po = Js("number"),
  Gs = (e) => e !== null && typeof e == "object",
  cc = (e) => e === !0 || e === !1,
  _s = (e) => {
    if (Ks(e) !== "object") return !1;
    const t = oi(e);
    return (
      (t === null ||
        t === Object.prototype ||
        Object.getPrototypeOf(t) === null) &&
      !(fo in e) &&
      !(Ws in e)
    );
  },
  uc = Ne("Date"),
  dc = Ne("File"),
  hc = Ne("Blob"),
  fc = Ne("FileList"),
  gc = (e) => Gs(e) && Te(e.pipe),
  pc = (e) => {
    let t;
    return (
      e &&
      ((typeof FormData == "function" && e instanceof FormData) ||
        (Te(e.append) &&
          ((t = Ks(e)) === "formdata" ||
            (t === "object" &&
              Te(e.toString) &&
              e.toString() === "[object FormData]"))))
    );
  },
  mc = Ne("URLSearchParams"),
  [yc, wc, bc, vc] = ["ReadableStream", "Request", "Response", "Headers"].map(
    Ne
  ),
  Cc = (e) =>
    e.trim ? e.trim() : e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
function us(e, t, { allOwnKeys: s = !1 } = {}) {
  if (e === null || typeof e > "u") return;
  let n, i;
  if ((typeof e != "object" && (e = [e]), Dt(e)))
    for (n = 0, i = e.length; n < i; n++) t.call(null, e[n], n, e);
  else {
    const r = s ? Object.getOwnPropertyNames(e) : Object.keys(e),
      o = r.length;
    let a;
    for (n = 0; n < o; n++) (a = r[n]), t.call(null, e[a], a, e);
  }
}
function mo(e, t) {
  t = t.toLowerCase();
  const s = Object.keys(e);
  let n = s.length,
    i;
  for (; n-- > 0; ) if (((i = s[n]), t === i.toLowerCase())) return i;
  return null;
}
const yt = (() =>
    typeof globalThis < "u"
      ? globalThis
      : typeof self < "u"
      ? self
      : typeof window < "u"
      ? window
      : global)(),
  yo = (e) => !os(e) && e !== yt;
function $n() {
  const { caseless: e } = (yo(this) && this) || {},
    t = {},
    s = (n, i) => {
      const r = (e && mo(t, i)) || i;
      _s(t[r]) && _s(n)
        ? (t[r] = $n(t[r], n))
        : _s(n)
        ? (t[r] = $n({}, n))
        : Dt(n)
        ? (t[r] = n.slice())
        : (t[r] = n);
    };
  for (let n = 0, i = arguments.length; n < i; n++)
    arguments[n] && us(arguments[n], s);
  return t;
}
const _c = (e, t, s, { allOwnKeys: n } = {}) => (
    us(
      t,
      (i, r) => {
        s && Te(i) ? (e[r] = ho(i, s)) : (e[r] = i);
      },
      { allOwnKeys: n }
    ),
    e
  ),
  kc = (e) => (e.charCodeAt(0) === 65279 && (e = e.slice(1)), e),
  xc = (e, t, s, n) => {
    (e.prototype = Object.create(t.prototype, n)),
      (e.prototype.constructor = e),
      Object.defineProperty(e, "super", { value: t.prototype }),
      s && Object.assign(e.prototype, s);
  },
  Sc = (e, t, s, n) => {
    let i, r, o;
    const a = {};
    if (((t = t || {}), e == null)) return t;
    do {
      for (i = Object.getOwnPropertyNames(e), r = i.length; r-- > 0; )
        (o = i[r]), (!n || n(o, e, t)) && !a[o] && ((t[o] = e[o]), (a[o] = !0));
      e = s !== !1 && oi(e);
    } while (e && (!s || s(e, t)) && e !== Object.prototype);
    return t;
  },
  Tc = (e, t, s) => {
    (e = String(e)),
      (s === void 0 || s > e.length) && (s = e.length),
      (s -= t.length);
    const n = e.indexOf(t, s);
    return n !== -1 && n === s;
  },
  Mc = (e) => {
    if (!e) return null;
    if (Dt(e)) return e;
    let t = e.length;
    if (!po(t)) return null;
    const s = new Array(t);
    for (; t-- > 0; ) s[t] = e[t];
    return s;
  },
  Ec = (
    (e) => (t) =>
      e && t instanceof e
  )(typeof Uint8Array < "u" && oi(Uint8Array)),
  Ac = (e, t) => {
    const n = (e && e[Ws]).call(e);
    let i;
    for (; (i = n.next()) && !i.done; ) {
      const r = i.value;
      t.call(e, r[0], r[1]);
    }
  },
  Pc = (e, t) => {
    let s;
    const n = [];
    for (; (s = e.exec(t)) !== null; ) n.push(s);
    return n;
  },
  Ic = Ne("HTMLFormElement"),
  Rc = (e) =>
    e.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g, function (s, n, i) {
      return n.toUpperCase() + i;
    }),
  Wi = (
    ({ hasOwnProperty: e }) =>
    (t, s) =>
      e.call(t, s)
  )(Object.prototype),
  Oc = Ne("RegExp"),
  wo = (e, t) => {
    const s = Object.getOwnPropertyDescriptors(e),
      n = {};
    us(s, (i, r) => {
      let o;
      (o = t(i, r, e)) !== !1 && (n[r] = o || i);
    }),
      Object.defineProperties(e, n);
  },
  Lc = (e) => {
    wo(e, (t, s) => {
      if (Te(e) && ["arguments", "caller", "callee"].indexOf(s) !== -1)
        return !1;
      const n = e[s];
      if (Te(n)) {
        if (((t.enumerable = !1), "writable" in t)) {
          t.writable = !1;
          return;
        }
        t.set ||
          (t.set = () => {
            throw Error("Can not rewrite read-only method '" + s + "'");
          });
      }
    });
  },
  $c = (e, t) => {
    const s = {},
      n = (i) => {
        i.forEach((r) => {
          s[r] = !0;
        });
      };
    return Dt(e) ? n(e) : n(String(e).split(t)), s;
  },
  Dc = () => {},
  zc = (e, t) => (e != null && Number.isFinite((e = +e)) ? e : t);
function Fc(e) {
  return !!(e && Te(e.append) && e[fo] === "FormData" && e[Ws]);
}
const Nc = (e) => {
    const t = new Array(10),
      s = (n, i) => {
        if (Gs(n)) {
          if (t.indexOf(n) >= 0) return;
          if (!("toJSON" in n)) {
            t[i] = n;
            const r = Dt(n) ? [] : {};
            return (
              us(n, (o, a) => {
                const l = s(o, i + 1);
                !os(l) && (r[a] = l);
              }),
              (t[i] = void 0),
              r
            );
          }
        }
        return n;
      };
    return s(e, 0);
  },
  Bc = Ne("AsyncFunction"),
  Hc = (e) => e && (Gs(e) || Te(e)) && Te(e.then) && Te(e.catch),
  bo = ((e, t) =>
    e
      ? setImmediate
      : t
      ? ((s, n) => (
          yt.addEventListener(
            "message",
            ({ source: i, data: r }) => {
              i === yt && r === s && n.length && n.shift()();
            },
            !1
          ),
          (i) => {
            n.push(i), yt.postMessage(s, "*");
          }
        ))(`axios@${Math.random()}`, [])
      : (s) => setTimeout(s))(
    typeof setImmediate == "function",
    Te(yt.postMessage)
  ),
  jc =
    typeof queueMicrotask < "u"
      ? queueMicrotask.bind(yt)
      : (typeof process < "u" && process.nextTick) || bo,
  qc = (e) => e != null && Te(e[Ws]),
  g = {
    isArray: Dt,
    isArrayBuffer: go,
    isBuffer: oc,
    isFormData: pc,
    isArrayBufferView: ac,
    isString: lc,
    isNumber: po,
    isBoolean: cc,
    isObject: Gs,
    isPlainObject: _s,
    isReadableStream: yc,
    isRequest: wc,
    isResponse: bc,
    isHeaders: vc,
    isUndefined: os,
    isDate: uc,
    isFile: dc,
    isBlob: hc,
    isRegExp: Oc,
    isFunction: Te,
    isStream: gc,
    isURLSearchParams: mc,
    isTypedArray: Ec,
    isFileList: fc,
    forEach: us,
    merge: $n,
    extend: _c,
    trim: Cc,
    stripBOM: kc,
    inherits: xc,
    toFlatObject: Sc,
    kindOf: Ks,
    kindOfTest: Ne,
    endsWith: Tc,
    toArray: Mc,
    forEachEntry: Ac,
    matchAll: Pc,
    isHTMLForm: Ic,
    hasOwnProperty: Wi,
    hasOwnProp: Wi,
    reduceDescriptors: wo,
    freezeMethods: Lc,
    toObjectSet: $c,
    toCamelCase: Rc,
    noop: Dc,
    toFiniteNumber: zc,
    findKey: mo,
    global: yt,
    isContextDefined: yo,
    isSpecCompliantForm: Fc,
    toJSONObject: Nc,
    isAsyncFn: Bc,
    isThenable: Hc,
    setImmediate: bo,
    asap: jc,
    isIterable: qc,
  };
function q(e, t, s, n, i) {
  Error.call(this),
    Error.captureStackTrace
      ? Error.captureStackTrace(this, this.constructor)
      : (this.stack = new Error().stack),
    (this.message = e),
    (this.name = "AxiosError"),
    t && (this.code = t),
    s && (this.config = s),
    n && (this.request = n),
    i && ((this.response = i), (this.status = i.status ? i.status : null));
}
g.inherits(q, Error, {
  toJSON: function () {
    return {
      message: this.message,
      name: this.name,
      description: this.description,
      number: this.number,
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      config: g.toJSONObject(this.config),
      code: this.code,
      status: this.status,
    };
  },
});
const vo = q.prototype,
  Co = {};
[
  "ERR_BAD_OPTION_VALUE",
  "ERR_BAD_OPTION",
  "ECONNABORTED",
  "ETIMEDOUT",
  "ERR_NETWORK",
  "ERR_FR_TOO_MANY_REDIRECTS",
  "ERR_DEPRECATED",
  "ERR_BAD_RESPONSE",
  "ERR_BAD_REQUEST",
  "ERR_CANCELED",
  "ERR_NOT_SUPPORT",
  "ERR_INVALID_URL",
].forEach((e) => {
  Co[e] = { value: e };
});
Object.defineProperties(q, Co);
Object.defineProperty(vo, "isAxiosError", { value: !0 });
q.from = (e, t, s, n, i, r) => {
  const o = Object.create(vo);
  return (
    g.toFlatObject(
      e,
      o,
      function (l) {
        return l !== Error.prototype;
      },
      (a) => a !== "isAxiosError"
    ),
    q.call(o, e.message, t, s, n, i),
    (o.cause = e),
    (o.name = e.name),
    r && Object.assign(o, r),
    o
  );
};
const Uc = null;
function Dn(e) {
  return g.isPlainObject(e) || g.isArray(e);
}
function _o(e) {
  return g.endsWith(e, "[]") ? e.slice(0, -2) : e;
}
function Ki(e, t, s) {
  return e
    ? e
        .concat(t)
        .map(function (i, r) {
          return (i = _o(i)), !s && r ? "[" + i + "]" : i;
        })
        .join(s ? "." : "")
    : t;
}
function Qc(e) {
  return g.isArray(e) && !e.some(Dn);
}
const Vc = g.toFlatObject(g, {}, null, function (t) {
  return /^is[A-Z]/.test(t);
});
function Zs(e, t, s) {
  if (!g.isObject(e)) throw new TypeError("target must be an object");
  (t = t || new FormData()),
    (s = g.toFlatObject(
      s,
      { metaTokens: !0, dots: !1, indexes: !1 },
      !1,
      function (_, y) {
        return !g.isUndefined(y[_]);
      }
    ));
  const n = s.metaTokens,
    i = s.visitor || c,
    r = s.dots,
    o = s.indexes,
    l = (s.Blob || (typeof Blob < "u" && Blob)) && g.isSpecCompliantForm(t);
  if (!g.isFunction(i)) throw new TypeError("visitor must be a function");
  function d(C) {
    if (C === null) return "";
    if (g.isDate(C)) return C.toISOString();
    if (g.isBoolean(C)) return C.toString();
    if (!l && g.isBlob(C))
      throw new q("Blob is not supported. Use a Buffer instead.");
    return g.isArrayBuffer(C) || g.isTypedArray(C)
      ? l && typeof Blob == "function"
        ? new Blob([C])
        : Buffer.from(C)
      : C;
  }
  function c(C, _, y) {
    let O = C;
    if (C && !y && typeof C == "object") {
      if (g.endsWith(_, "{}"))
        (_ = n ? _ : _.slice(0, -2)), (C = JSON.stringify(C));
      else if (
        (g.isArray(C) && Qc(C)) ||
        ((g.isFileList(C) || g.endsWith(_, "[]")) && (O = g.toArray(C)))
      )
        return (
          (_ = _o(_)),
          O.forEach(function (N, P) {
            !(g.isUndefined(N) || N === null) &&
              t.append(
                o === !0 ? Ki([_], P, r) : o === null ? _ : _ + "[]",
                d(N)
              );
          }),
          !1
        );
    }
    return Dn(C) ? !0 : (t.append(Ki(y, _, r), d(C)), !1);
  }
  const f = [],
    w = Object.assign(Vc, {
      defaultVisitor: c,
      convertValue: d,
      isVisitable: Dn,
    });
  function S(C, _) {
    if (!g.isUndefined(C)) {
      if (f.indexOf(C) !== -1)
        throw Error("Circular reference detected in " + _.join("."));
      f.push(C),
        g.forEach(C, function (O, F) {
          (!(g.isUndefined(O) || O === null) &&
            i.call(t, O, g.isString(F) ? F.trim() : F, _, w)) === !0 &&
            S(O, _ ? _.concat(F) : [F]);
        }),
        f.pop();
    }
  }
  if (!g.isObject(e)) throw new TypeError("data must be an object");
  return S(e), t;
}
function Ji(e) {
  const t = {
    "!": "%21",
    "'": "%27",
    "(": "%28",
    ")": "%29",
    "~": "%7E",
    "%20": "+",
    "%00": "\0",
  };
  return encodeURIComponent(e).replace(/[!'()~]|%20|%00/g, function (n) {
    return t[n];
  });
}
function ai(e, t) {
  (this._pairs = []), e && Zs(e, this, t);
}
const ko = ai.prototype;
ko.append = function (t, s) {
  this._pairs.push([t, s]);
};
ko.toString = function (t) {
  const s = t
    ? function (n) {
        return t.call(this, n, Ji);
      }
    : Ji;
  return this._pairs
    .map(function (i) {
      return s(i[0]) + "=" + s(i[1]);
    }, "")
    .join("&");
};
function Wc(e) {
  return encodeURIComponent(e)
    .replace(/%3A/gi, ":")
    .replace(/%24/g, "$")
    .replace(/%2C/gi, ",")
    .replace(/%20/g, "+")
    .replace(/%5B/gi, "[")
    .replace(/%5D/gi, "]");
}
function xo(e, t, s) {
  if (!t) return e;
  const n = (s && s.encode) || Wc;
  g.isFunction(s) && (s = { serialize: s });
  const i = s && s.serialize;
  let r;
  if (
    (i
      ? (r = i(t, s))
      : (r = g.isURLSearchParams(t) ? t.toString() : new ai(t, s).toString(n)),
    r)
  ) {
    const o = e.indexOf("#");
    o !== -1 && (e = e.slice(0, o)),
      (e += (e.indexOf("?") === -1 ? "?" : "&") + r);
  }
  return e;
}
class Kc {
  constructor() {
    this.handlers = [];
  }
  use(t, s, n) {
    return (
      this.handlers.push({
        fulfilled: t,
        rejected: s,
        synchronous: n ? n.synchronous : !1,
        runWhen: n ? n.runWhen : null,
      }),
      this.handlers.length - 1
    );
  }
  eject(t) {
    this.handlers[t] && (this.handlers[t] = null);
  }
  clear() {
    this.handlers && (this.handlers = []);
  }
  forEach(t) {
    g.forEach(this.handlers, function (n) {
      n !== null && t(n);
    });
  }
}
const Gi = Kc,
  So = {
    silentJSONParsing: !0,
    forcedJSONParsing: !0,
    clarifyTimeoutError: !1,
  },
  Jc = typeof URLSearchParams < "u" ? URLSearchParams : ai,
  Gc = typeof FormData < "u" ? FormData : null,
  Zc = typeof Blob < "u" ? Blob : null,
  Yc = {
    isBrowser: !0,
    classes: { URLSearchParams: Jc, FormData: Gc, Blob: Zc },
    protocols: ["http", "https", "file", "blob", "url", "data"],
  },
  li = typeof window < "u" && typeof document < "u",
  zn = (typeof navigator == "object" && navigator) || void 0,
  Xc =
    li &&
    (!zn || ["ReactNative", "NativeScript", "NS"].indexOf(zn.product) < 0),
  eu = (() =>
    typeof WorkerGlobalScope < "u" &&
    self instanceof WorkerGlobalScope &&
    typeof self.importScripts == "function")(),
  tu = (li && window.location.href) || "http://localhost",
  su = Object.freeze(
    Object.defineProperty(
      {
        __proto__: null,
        hasBrowserEnv: li,
        hasStandardBrowserEnv: Xc,
        hasStandardBrowserWebWorkerEnv: eu,
        navigator: zn,
        origin: tu,
      },
      Symbol.toStringTag,
      { value: "Module" }
    )
  ),
  me = { ...su, ...Yc };
function nu(e, t) {
  return Zs(
    e,
    new me.classes.URLSearchParams(),
    Object.assign(
      {
        visitor: function (s, n, i, r) {
          return me.isNode && g.isBuffer(s)
            ? (this.append(n, s.toString("base64")), !1)
            : r.defaultVisitor.apply(this, arguments);
        },
      },
      t
    )
  );
}
function iu(e) {
  return g
    .matchAll(/\w+|\[(\w*)]/g, e)
    .map((t) => (t[0] === "[]" ? "" : t[1] || t[0]));
}
function ru(e) {
  const t = {},
    s = Object.keys(e);
  let n;
  const i = s.length;
  let r;
  for (n = 0; n < i; n++) (r = s[n]), (t[r] = e[r]);
  return t;
}
function To(e) {
  function t(s, n, i, r) {
    let o = s[r++];
    if (o === "__proto__") return !0;
    const a = Number.isFinite(+o),
      l = r >= s.length;
    return (
      (o = !o && g.isArray(i) ? i.length : o),
      l
        ? (g.hasOwnProp(i, o) ? (i[o] = [i[o], n]) : (i[o] = n), !a)
        : ((!i[o] || !g.isObject(i[o])) && (i[o] = []),
          t(s, n, i[o], r) && g.isArray(i[o]) && (i[o] = ru(i[o])),
          !a)
    );
  }
  if (g.isFormData(e) && g.isFunction(e.entries)) {
    const s = {};
    return (
      g.forEachEntry(e, (n, i) => {
        t(iu(n), i, s, 0);
      }),
      s
    );
  }
  return null;
}
function ou(e, t, s) {
  if (g.isString(e))
    try {
      return (t || JSON.parse)(e), g.trim(e);
    } catch (n) {
      if (n.name !== "SyntaxError") throw n;
    }
  return (s || JSON.stringify)(e);
}
const ci = {
  transitional: So,
  adapter: ["xhr", "http", "fetch"],
  transformRequest: [
    function (t, s) {
      const n = s.getContentType() || "",
        i = n.indexOf("application/json") > -1,
        r = g.isObject(t);
      if ((r && g.isHTMLForm(t) && (t = new FormData(t)), g.isFormData(t)))
        return i ? JSON.stringify(To(t)) : t;
      if (
        g.isArrayBuffer(t) ||
        g.isBuffer(t) ||
        g.isStream(t) ||
        g.isFile(t) ||
        g.isBlob(t) ||
        g.isReadableStream(t)
      )
        return t;
      if (g.isArrayBufferView(t)) return t.buffer;
      if (g.isURLSearchParams(t))
        return (
          s.setContentType(
            "application/x-www-form-urlencoded;charset=utf-8",
            !1
          ),
          t.toString()
        );
      let a;
      if (r) {
        if (n.indexOf("application/x-www-form-urlencoded") > -1)
          return nu(t, this.formSerializer).toString();
        if ((a = g.isFileList(t)) || n.indexOf("multipart/form-data") > -1) {
          const l = this.env && this.env.FormData;
          return Zs(
            a ? { "files[]": t } : t,
            l && new l(),
            this.formSerializer
          );
        }
      }
      return r || i ? (s.setContentType("application/json", !1), ou(t)) : t;
    },
  ],
  transformResponse: [
    function (t) {
      const s = this.transitional || ci.transitional,
        n = s && s.forcedJSONParsing,
        i = this.responseType === "json";
      if (g.isResponse(t) || g.isReadableStream(t)) return t;
      if (t && g.isString(t) && ((n && !this.responseType) || i)) {
        const o = !(s && s.silentJSONParsing) && i;
        try {
          return JSON.parse(t);
        } catch (a) {
          if (o)
            throw a.name === "SyntaxError"
              ? q.from(a, q.ERR_BAD_RESPONSE, this, null, this.response)
              : a;
        }
      }
      return t;
    },
  ],
  timeout: 0,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  maxContentLength: -1,
  maxBodyLength: -1,
  env: { FormData: me.classes.FormData, Blob: me.classes.Blob },
  validateStatus: function (t) {
    return t >= 200 && t < 300;
  },
  headers: {
    common: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": void 0,
    },
  },
};
g.forEach(["delete", "get", "head", "post", "put", "patch"], (e) => {
  ci.headers[e] = {};
});
const ui = ci,
  au = g.toObjectSet([
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
    "user-agent",
  ]),
  lu = (e) => {
    const t = {};
    let s, n, i;
    return (
      e &&
        e
          .split(
            `
`
          )
          .forEach(function (o) {
            (i = o.indexOf(":")),
              (s = o.substring(0, i).trim().toLowerCase()),
              (n = o.substring(i + 1).trim()),
              !(!s || (t[s] && au[s])) &&
                (s === "set-cookie"
                  ? t[s]
                    ? t[s].push(n)
                    : (t[s] = [n])
                  : (t[s] = t[s] ? t[s] + ", " + n : n));
          }),
      t
    );
  },
  Zi = Symbol("internals");
function qt(e) {
  return e && String(e).trim().toLowerCase();
}
function ks(e) {
  return e === !1 || e == null ? e : g.isArray(e) ? e.map(ks) : String(e);
}
function cu(e) {
  const t = Object.create(null),
    s = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let n;
  for (; (n = s.exec(e)); ) t[n[1]] = n[2];
  return t;
}
const uu = (e) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(e.trim());
function vn(e, t, s, n, i) {
  if (g.isFunction(n)) return n.call(this, t, s);
  if ((i && (t = s), !!g.isString(t))) {
    if (g.isString(n)) return t.indexOf(n) !== -1;
    if (g.isRegExp(n)) return n.test(t);
  }
}
function du(e) {
  return e
    .trim()
    .toLowerCase()
    .replace(/([a-z\d])(\w*)/g, (t, s, n) => s.toUpperCase() + n);
}
function hu(e, t) {
  const s = g.toCamelCase(" " + t);
  ["get", "set", "has"].forEach((n) => {
    Object.defineProperty(e, n + s, {
      value: function (i, r, o) {
        return this[n].call(this, t, i, r, o);
      },
      configurable: !0,
    });
  });
}
class Ys {
  constructor(t) {
    t && this.set(t);
  }
  set(t, s, n) {
    const i = this;
    function r(a, l, d) {
      const c = qt(l);
      if (!c) throw new Error("header name must be a non-empty string");
      const f = g.findKey(i, c);
      (!f || i[f] === void 0 || d === !0 || (d === void 0 && i[f] !== !1)) &&
        (i[f || l] = ks(a));
    }
    const o = (a, l) => g.forEach(a, (d, c) => r(d, c, l));
    if (g.isPlainObject(t) || t instanceof this.constructor) o(t, s);
    else if (g.isString(t) && (t = t.trim()) && !uu(t)) o(lu(t), s);
    else if (g.isObject(t) && g.isIterable(t)) {
      let a = {},
        l,
        d;
      for (const c of t) {
        if (!g.isArray(c))
          throw TypeError("Object iterator must return a key-value pair");
        a[(d = c[0])] = (l = a[d])
          ? g.isArray(l)
            ? [...l, c[1]]
            : [l, c[1]]
          : c[1];
      }
      o(a, s);
    } else t != null && r(s, t, n);
    return this;
  }
  get(t, s) {
    if (((t = qt(t)), t)) {
      const n = g.findKey(this, t);
      if (n) {
        const i = this[n];
        if (!s) return i;
        if (s === !0) return cu(i);
        if (g.isFunction(s)) return s.call(this, i, n);
        if (g.isRegExp(s)) return s.exec(i);
        throw new TypeError("parser must be boolean|regexp|function");
      }
    }
  }
  has(t, s) {
    if (((t = qt(t)), t)) {
      const n = g.findKey(this, t);
      return !!(n && this[n] !== void 0 && (!s || vn(this, this[n], n, s)));
    }
    return !1;
  }
  delete(t, s) {
    const n = this;
    let i = !1;
    function r(o) {
      if (((o = qt(o)), o)) {
        const a = g.findKey(n, o);
        a && (!s || vn(n, n[a], a, s)) && (delete n[a], (i = !0));
      }
    }
    return g.isArray(t) ? t.forEach(r) : r(t), i;
  }
  clear(t) {
    const s = Object.keys(this);
    let n = s.length,
      i = !1;
    for (; n--; ) {
      const r = s[n];
      (!t || vn(this, this[r], r, t, !0)) && (delete this[r], (i = !0));
    }
    return i;
  }
  normalize(t) {
    const s = this,
      n = {};
    return (
      g.forEach(this, (i, r) => {
        const o = g.findKey(n, r);
        if (o) {
          (s[o] = ks(i)), delete s[r];
          return;
        }
        const a = t ? du(r) : String(r).trim();
        a !== r && delete s[r], (s[a] = ks(i)), (n[a] = !0);
      }),
      this
    );
  }
  concat(...t) {
    return this.constructor.concat(this, ...t);
  }
  toJSON(t) {
    const s = Object.create(null);
    return (
      g.forEach(this, (n, i) => {
        n != null && n !== !1 && (s[i] = t && g.isArray(n) ? n.join(", ") : n);
      }),
      s
    );
  }
  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }
  toString() {
    return Object.entries(this.toJSON()).map(([t, s]) => t + ": " + s).join(`
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
  static concat(t, ...s) {
    const n = new this(t);
    return s.forEach((i) => n.set(i)), n;
  }
  static accessor(t) {
    const n = (this[Zi] = this[Zi] = { accessors: {} }).accessors,
      i = this.prototype;
    function r(o) {
      const a = qt(o);
      n[a] || (hu(i, o), (n[a] = !0));
    }
    return g.isArray(t) ? t.forEach(r) : r(t), this;
  }
}
Ys.accessor([
  "Content-Type",
  "Content-Length",
  "Accept",
  "Accept-Encoding",
  "User-Agent",
  "Authorization",
]);
g.reduceDescriptors(Ys.prototype, ({ value: e }, t) => {
  let s = t[0].toUpperCase() + t.slice(1);
  return {
    get: () => e,
    set(n) {
      this[s] = n;
    },
  };
});
g.freezeMethods(Ys);
const Fe = Ys;
function Cn(e, t) {
  const s = this || ui,
    n = t || s,
    i = Fe.from(n.headers);
  let r = n.data;
  return (
    g.forEach(e, function (a) {
      r = a.call(s, r, i.normalize(), t ? t.status : void 0);
    }),
    i.normalize(),
    r
  );
}
function Mo(e) {
  return !!(e && e.__CANCEL__);
}
function zt(e, t, s) {
  q.call(this, e ?? "canceled", q.ERR_CANCELED, t, s),
    (this.name = "CanceledError");
}
g.inherits(zt, q, { __CANCEL__: !0 });
function Eo(e, t, s) {
  const n = s.config.validateStatus;
  !s.status || !n || n(s.status)
    ? e(s)
    : t(
        new q(
          "Request failed with status code " + s.status,
          [q.ERR_BAD_REQUEST, q.ERR_BAD_RESPONSE][
            Math.floor(s.status / 100) - 4
          ],
          s.config,
          s.request,
          s
        )
      );
}
function fu(e) {
  const t = /^([-+\w]{1,25})(:?\/\/|:)/.exec(e);
  return (t && t[1]) || "";
}
function gu(e, t) {
  e = e || 10;
  const s = new Array(e),
    n = new Array(e);
  let i = 0,
    r = 0,
    o;
  return (
    (t = t !== void 0 ? t : 1e3),
    function (l) {
      const d = Date.now(),
        c = n[r];
      o || (o = d), (s[i] = l), (n[i] = d);
      let f = r,
        w = 0;
      for (; f !== i; ) (w += s[f++]), (f = f % e);
      if (((i = (i + 1) % e), i === r && (r = (r + 1) % e), d - o < t)) return;
      const S = c && d - c;
      return S ? Math.round((w * 1e3) / S) : void 0;
    }
  );
}
function pu(e, t) {
  let s = 0,
    n = 1e3 / t,
    i,
    r;
  const o = (d, c = Date.now()) => {
    (s = c), (i = null), r && (clearTimeout(r), (r = null)), e.apply(null, d);
  };
  return [
    (...d) => {
      const c = Date.now(),
        f = c - s;
      f >= n
        ? o(d, c)
        : ((i = d),
          r ||
            (r = setTimeout(() => {
              (r = null), o(i);
            }, n - f)));
    },
    () => i && o(i),
  ];
}
const Os = (e, t, s = 3) => {
    let n = 0;
    const i = gu(50, 250);
    return pu((r) => {
      const o = r.loaded,
        a = r.lengthComputable ? r.total : void 0,
        l = o - n,
        d = i(l),
        c = o <= a;
      n = o;
      const f = {
        loaded: o,
        total: a,
        progress: a ? o / a : void 0,
        bytes: l,
        rate: d || void 0,
        estimated: d && a && c ? (a - o) / d : void 0,
        event: r,
        lengthComputable: a != null,
        [t ? "download" : "upload"]: !0,
      };
      e(f);
    }, s);
  },
  Yi = (e, t) => {
    const s = e != null;
    return [(n) => t[0]({ lengthComputable: s, total: e, loaded: n }), t[1]];
  },
  Xi =
    (e) =>
    (...t) =>
      g.asap(() => e(...t)),
  mu = me.hasStandardBrowserEnv
    ? ((e, t) => (s) => (
        (s = new URL(s, me.origin)),
        e.protocol === s.protocol &&
          e.host === s.host &&
          (t || e.port === s.port)
      ))(
        new URL(me.origin),
        me.navigator && /(msie|trident)/i.test(me.navigator.userAgent)
      )
    : () => !0,
  yu = me.hasStandardBrowserEnv
    ? {
        write(e, t, s, n, i, r) {
          const o = [e + "=" + encodeURIComponent(t)];
          g.isNumber(s) && o.push("expires=" + new Date(s).toGMTString()),
            g.isString(n) && o.push("path=" + n),
            g.isString(i) && o.push("domain=" + i),
            r === !0 && o.push("secure"),
            (document.cookie = o.join("; "));
        },
        read(e) {
          const t = document.cookie.match(
            new RegExp("(^|;\\s*)(" + e + ")=([^;]*)")
          );
          return t ? decodeURIComponent(t[3]) : null;
        },
        remove(e) {
          this.write(e, "", Date.now() - 864e5);
        },
      }
    : {
        write() {},
        read() {
          return null;
        },
        remove() {},
      };
function wu(e) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(e);
}
function bu(e, t) {
  return t ? e.replace(/\/?\/$/, "") + "/" + t.replace(/^\/+/, "") : e;
}
function Ao(e, t, s) {
  let n = !wu(t);
  return e && (n || s == !1) ? bu(e, t) : t;
}
const er = (e) => (e instanceof Fe ? { ...e } : e);
function Ct(e, t) {
  t = t || {};
  const s = {};
  function n(d, c, f, w) {
    return g.isPlainObject(d) && g.isPlainObject(c)
      ? g.merge.call({ caseless: w }, d, c)
      : g.isPlainObject(c)
      ? g.merge({}, c)
      : g.isArray(c)
      ? c.slice()
      : c;
  }
  function i(d, c, f, w) {
    if (g.isUndefined(c)) {
      if (!g.isUndefined(d)) return n(void 0, d, f, w);
    } else return n(d, c, f, w);
  }
  function r(d, c) {
    if (!g.isUndefined(c)) return n(void 0, c);
  }
  function o(d, c) {
    if (g.isUndefined(c)) {
      if (!g.isUndefined(d)) return n(void 0, d);
    } else return n(void 0, c);
  }
  function a(d, c, f) {
    if (f in t) return n(d, c);
    if (f in e) return n(void 0, d);
  }
  const l = {
    url: r,
    method: r,
    data: r,
    baseURL: o,
    transformRequest: o,
    transformResponse: o,
    paramsSerializer: o,
    timeout: o,
    timeoutMessage: o,
    withCredentials: o,
    withXSRFToken: o,
    adapter: o,
    responseType: o,
    xsrfCookieName: o,
    xsrfHeaderName: o,
    onUploadProgress: o,
    onDownloadProgress: o,
    decompress: o,
    maxContentLength: o,
    maxBodyLength: o,
    beforeRedirect: o,
    transport: o,
    httpAgent: o,
    httpsAgent: o,
    cancelToken: o,
    socketPath: o,
    responseEncoding: o,
    validateStatus: a,
    headers: (d, c, f) => i(er(d), er(c), f, !0),
  };
  return (
    g.forEach(Object.keys(Object.assign({}, e, t)), function (c) {
      const f = l[c] || i,
        w = f(e[c], t[c], c);
      (g.isUndefined(w) && f !== a) || (s[c] = w);
    }),
    s
  );
}
const Po = (e) => {
    const t = Ct({}, e);
    let {
      data: s,
      withXSRFToken: n,
      xsrfHeaderName: i,
      xsrfCookieName: r,
      headers: o,
      auth: a,
    } = t;
    (t.headers = o = Fe.from(o)),
      (t.url = xo(
        Ao(t.baseURL, t.url, t.allowAbsoluteUrls),
        e.params,
        e.paramsSerializer
      )),
      a &&
        o.set(
          "Authorization",
          "Basic " +
            btoa(
              (a.username || "") +
                ":" +
                (a.password ? unescape(encodeURIComponent(a.password)) : "")
            )
        );
    let l;
    if (g.isFormData(s)) {
      if (me.hasStandardBrowserEnv || me.hasStandardBrowserWebWorkerEnv)
        o.setContentType(void 0);
      else if ((l = o.getContentType()) !== !1) {
        const [d, ...c] = l
          ? l
              .split(";")
              .map((f) => f.trim())
              .filter(Boolean)
          : [];
        o.setContentType([d || "multipart/form-data", ...c].join("; "));
      }
    }
    if (
      me.hasStandardBrowserEnv &&
      (n && g.isFunction(n) && (n = n(t)), n || (n !== !1 && mu(t.url)))
    ) {
      const d = i && r && yu.read(r);
      d && o.set(i, d);
    }
    return t;
  },
  vu = typeof XMLHttpRequest < "u",
  Cu =
    vu &&
    function (e) {
      return new Promise(function (s, n) {
        const i = Po(e);
        let r = i.data;
        const o = Fe.from(i.headers).normalize();
        let { responseType: a, onUploadProgress: l, onDownloadProgress: d } = i,
          c,
          f,
          w,
          S,
          C;
        function _() {
          S && S(),
            C && C(),
            i.cancelToken && i.cancelToken.unsubscribe(c),
            i.signal && i.signal.removeEventListener("abort", c);
        }
        let y = new XMLHttpRequest();
        y.open(i.method.toUpperCase(), i.url, !0), (y.timeout = i.timeout);
        function O() {
          if (!y) return;
          const N = Fe.from(
              "getAllResponseHeaders" in y && y.getAllResponseHeaders()
            ),
            D = {
              data:
                !a || a === "text" || a === "json"
                  ? y.responseText
                  : y.response,
              status: y.status,
              statusText: y.statusText,
              headers: N,
              config: e,
              request: y,
            };
          Eo(
            function (K) {
              s(K), _();
            },
            function (K) {
              n(K), _();
            },
            D
          ),
            (y = null);
        }
        "onloadend" in y
          ? (y.onloadend = O)
          : (y.onreadystatechange = function () {
              !y ||
                y.readyState !== 4 ||
                (y.status === 0 &&
                  !(y.responseURL && y.responseURL.indexOf("file:") === 0)) ||
                setTimeout(O);
            }),
          (y.onabort = function () {
            y &&
              (n(new q("Request aborted", q.ECONNABORTED, e, y)), (y = null));
          }),
          (y.onerror = function () {
            n(new q("Network Error", q.ERR_NETWORK, e, y)), (y = null);
          }),
          (y.ontimeout = function () {
            let P = i.timeout
              ? "timeout of " + i.timeout + "ms exceeded"
              : "timeout exceeded";
            const D = i.transitional || So;
            i.timeoutErrorMessage && (P = i.timeoutErrorMessage),
              n(
                new q(
                  P,
                  D.clarifyTimeoutError ? q.ETIMEDOUT : q.ECONNABORTED,
                  e,
                  y
                )
              ),
              (y = null);
          }),
          r === void 0 && o.setContentType(null),
          "setRequestHeader" in y &&
            g.forEach(o.toJSON(), function (P, D) {
              y.setRequestHeader(D, P);
            }),
          g.isUndefined(i.withCredentials) ||
            (y.withCredentials = !!i.withCredentials),
          a && a !== "json" && (y.responseType = i.responseType),
          d && (([w, C] = Os(d, !0)), y.addEventListener("progress", w)),
          l &&
            y.upload &&
            (([f, S] = Os(l)),
            y.upload.addEventListener("progress", f),
            y.upload.addEventListener("loadend", S)),
          (i.cancelToken || i.signal) &&
            ((c = (N) => {
              y &&
                (n(!N || N.type ? new zt(null, e, y) : N),
                y.abort(),
                (y = null));
            }),
            i.cancelToken && i.cancelToken.subscribe(c),
            i.signal &&
              (i.signal.aborted ? c() : i.signal.addEventListener("abort", c)));
        const F = fu(i.url);
        if (F && me.protocols.indexOf(F) === -1) {
          n(new q("Unsupported protocol " + F + ":", q.ERR_BAD_REQUEST, e));
          return;
        }
        y.send(r || null);
      });
    },
  _u = (e, t) => {
    const { length: s } = (e = e ? e.filter(Boolean) : []);
    if (t || s) {
      let n = new AbortController(),
        i;
      const r = function (d) {
        if (!i) {
          (i = !0), a();
          const c = d instanceof Error ? d : this.reason;
          n.abort(
            c instanceof q ? c : new zt(c instanceof Error ? c.message : c)
          );
        }
      };
      let o =
        t &&
        setTimeout(() => {
          (o = null), r(new q(`timeout ${t} of ms exceeded`, q.ETIMEDOUT));
        }, t);
      const a = () => {
        e &&
          (o && clearTimeout(o),
          (o = null),
          e.forEach((d) => {
            d.unsubscribe
              ? d.unsubscribe(r)
              : d.removeEventListener("abort", r);
          }),
          (e = null));
      };
      e.forEach((d) => d.addEventListener("abort", r));
      const { signal: l } = n;
      return (l.unsubscribe = () => g.asap(a)), l;
    }
  },
  ku = _u,
  xu = function* (e, t) {
    let s = e.byteLength;
    if (!t || s < t) {
      yield e;
      return;
    }
    let n = 0,
      i;
    for (; n < s; ) (i = n + t), yield e.slice(n, i), (n = i);
  },
  Su = async function* (e, t) {
    for await (const s of Tu(e)) yield* xu(s, t);
  },
  Tu = async function* (e) {
    if (e[Symbol.asyncIterator]) {
      yield* e;
      return;
    }
    const t = e.getReader();
    try {
      for (;;) {
        const { done: s, value: n } = await t.read();
        if (s) break;
        yield n;
      }
    } finally {
      await t.cancel();
    }
  },
  tr = (e, t, s, n) => {
    const i = Su(e, t);
    let r = 0,
      o,
      a = (l) => {
        o || ((o = !0), n && n(l));
      };
    return new ReadableStream(
      {
        async pull(l) {
          try {
            const { done: d, value: c } = await i.next();
            if (d) {
              a(), l.close();
              return;
            }
            let f = c.byteLength;
            if (s) {
              let w = (r += f);
              s(w);
            }
            l.enqueue(new Uint8Array(c));
          } catch (d) {
            throw (a(d), d);
          }
        },
        cancel(l) {
          return a(l), i.return();
        },
      },
      { highWaterMark: 2 }
    );
  },
  Xs =
    typeof fetch == "function" &&
    typeof Request == "function" &&
    typeof Response == "function",
  Io = Xs && typeof ReadableStream == "function",
  Mu =
    Xs &&
    (typeof TextEncoder == "function"
      ? (
          (e) => (t) =>
            e.encode(t)
        )(new TextEncoder())
      : async (e) => new Uint8Array(await new Response(e).arrayBuffer())),
  Ro = (e, ...t) => {
    try {
      return !!e(...t);
    } catch {
      return !1;
    }
  },
  Eu =
    Io &&
    Ro(() => {
      let e = !1;
      const t = new Request(me.origin, {
        body: new ReadableStream(),
        method: "POST",
        get duplex() {
          return (e = !0), "half";
        },
      }).headers.has("Content-Type");
      return e && !t;
    }),
  sr = 64 * 1024,
  Fn = Io && Ro(() => g.isReadableStream(new Response("").body)),
  Ls = { stream: Fn && ((e) => e.body) };
Xs &&
  ((e) => {
    ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((t) => {
      !Ls[t] &&
        (Ls[t] = g.isFunction(e[t])
          ? (s) => s[t]()
          : (s, n) => {
              throw new q(
                `Response type '${t}' is not supported`,
                q.ERR_NOT_SUPPORT,
                n
              );
            });
    });
  })(new Response());
const Au = async (e) => {
    if (e == null) return 0;
    if (g.isBlob(e)) return e.size;
    if (g.isSpecCompliantForm(e))
      return (
        await new Request(me.origin, { method: "POST", body: e }).arrayBuffer()
      ).byteLength;
    if (g.isArrayBufferView(e) || g.isArrayBuffer(e)) return e.byteLength;
    if ((g.isURLSearchParams(e) && (e = e + ""), g.isString(e)))
      return (await Mu(e)).byteLength;
  },
  Pu = async (e, t) => {
    const s = g.toFiniteNumber(e.getContentLength());
    return s ?? Au(t);
  },
  Iu =
    Xs &&
    (async (e) => {
      let {
        url: t,
        method: s,
        data: n,
        signal: i,
        cancelToken: r,
        timeout: o,
        onDownloadProgress: a,
        onUploadProgress: l,
        responseType: d,
        headers: c,
        withCredentials: f = "same-origin",
        fetchOptions: w,
      } = Po(e);
      d = d ? (d + "").toLowerCase() : "text";
      let S = ku([i, r && r.toAbortSignal()], o),
        C;
      const _ =
        S &&
        S.unsubscribe &&
        (() => {
          S.unsubscribe();
        });
      let y;
      try {
        if (
          l &&
          Eu &&
          s !== "get" &&
          s !== "head" &&
          (y = await Pu(c, n)) !== 0
        ) {
          let D = new Request(t, { method: "POST", body: n, duplex: "half" }),
            Q;
          if (
            (g.isFormData(n) &&
              (Q = D.headers.get("content-type")) &&
              c.setContentType(Q),
            D.body)
          ) {
            const [K, se] = Yi(y, Os(Xi(l)));
            n = tr(D.body, sr, K, se);
          }
        }
        g.isString(f) || (f = f ? "include" : "omit");
        const O = "credentials" in Request.prototype;
        C = new Request(t, {
          ...w,
          signal: S,
          method: s.toUpperCase(),
          headers: c.normalize().toJSON(),
          body: n,
          duplex: "half",
          credentials: O ? f : void 0,
        });
        let F = await fetch(C, w);
        const N = Fn && (d === "stream" || d === "response");
        if (Fn && (a || (N && _))) {
          const D = {};
          ["status", "statusText", "headers"].forEach((ke) => {
            D[ke] = F[ke];
          });
          const Q = g.toFiniteNumber(F.headers.get("content-length")),
            [K, se] = (a && Yi(Q, Os(Xi(a), !0))) || [];
          F = new Response(
            tr(F.body, sr, K, () => {
              se && se(), _ && _();
            }),
            D
          );
        }
        d = d || "text";
        let P = await Ls[g.findKey(Ls, d) || "text"](F, e);
        return (
          !N && _ && _(),
          await new Promise((D, Q) => {
            Eo(D, Q, {
              data: P,
              headers: Fe.from(F.headers),
              status: F.status,
              statusText: F.statusText,
              config: e,
              request: C,
            });
          })
        );
      } catch (O) {
        throw (
          (_ && _(),
          O && O.name === "TypeError" && /Load failed|fetch/i.test(O.message)
            ? Object.assign(new q("Network Error", q.ERR_NETWORK, e, C), {
                cause: O.cause || O,
              })
            : q.from(O, O && O.code, e, C))
        );
      }
    }),
  Nn = { http: Uc, xhr: Cu, fetch: Iu };
g.forEach(Nn, (e, t) => {
  if (e) {
    try {
      Object.defineProperty(e, "name", { value: t });
    } catch {}
    Object.defineProperty(e, "adapterName", { value: t });
  }
});
const nr = (e) => `- ${e}`,
  Ru = (e) => g.isFunction(e) || e === null || e === !1,
  Oo = {
    getAdapter: (e) => {
      e = g.isArray(e) ? e : [e];
      const { length: t } = e;
      let s, n;
      const i = {};
      for (let r = 0; r < t; r++) {
        s = e[r];
        let o;
        if (
          ((n = s),
          !Ru(s) && ((n = Nn[(o = String(s)).toLowerCase()]), n === void 0))
        )
          throw new q(`Unknown adapter '${o}'`);
        if (n) break;
        i[o || "#" + r] = n;
      }
      if (!n) {
        const r = Object.entries(i).map(
          ([a, l]) =>
            `adapter ${a} ` +
            (l === !1
              ? "is not supported by the environment"
              : "is not available in the build")
        );
        let o = t
          ? r.length > 1
            ? `since :
` +
              r.map(nr).join(`
`)
            : " " + nr(r[0])
          : "as no adapter specified";
        throw new q(
          "There is no suitable adapter to dispatch the request " + o,
          "ERR_NOT_SUPPORT"
        );
      }
      return n;
    },
    adapters: Nn,
  };
function _n(e) {
  if (
    (e.cancelToken && e.cancelToken.throwIfRequested(),
    e.signal && e.signal.aborted)
  )
    throw new zt(null, e);
}
function ir(e) {
  return (
    _n(e),
    (e.headers = Fe.from(e.headers)),
    (e.data = Cn.call(e, e.transformRequest)),
    ["post", "put", "patch"].indexOf(e.method) !== -1 &&
      e.headers.setContentType("application/x-www-form-urlencoded", !1),
    Oo.getAdapter(e.adapter || ui.adapter)(e).then(
      function (n) {
        return (
          _n(e),
          (n.data = Cn.call(e, e.transformResponse, n)),
          (n.headers = Fe.from(n.headers)),
          n
        );
      },
      function (n) {
        return (
          Mo(n) ||
            (_n(e),
            n &&
              n.response &&
              ((n.response.data = Cn.call(e, e.transformResponse, n.response)),
              (n.response.headers = Fe.from(n.response.headers)))),
          Promise.reject(n)
        );
      }
    )
  );
}
const Lo = "1.10.0",
  en = {};
["object", "boolean", "number", "function", "string", "symbol"].forEach(
  (e, t) => {
    en[e] = function (n) {
      return typeof n === e || "a" + (t < 1 ? "n " : " ") + e;
    };
  }
);
const rr = {};
en.transitional = function (t, s, n) {
  function i(r, o) {
    return (
      "[Axios v" +
      Lo +
      "] Transitional option '" +
      r +
      "'" +
      o +
      (n ? ". " + n : "")
    );
  }
  return (r, o, a) => {
    if (t === !1)
      throw new q(
        i(o, " has been removed" + (s ? " in " + s : "")),
        q.ERR_DEPRECATED
      );
    return (
      s &&
        !rr[o] &&
        ((rr[o] = !0),
        console.warn(
          i(
            o,
            " has been deprecated since v" +
              s +
              " and will be removed in the near future"
          )
        )),
      t ? t(r, o, a) : !0
    );
  };
};
en.spelling = function (t) {
  return (s, n) => (console.warn(`${n} is likely a misspelling of ${t}`), !0);
};
function Ou(e, t, s) {
  if (typeof e != "object")
    throw new q("options must be an object", q.ERR_BAD_OPTION_VALUE);
  const n = Object.keys(e);
  let i = n.length;
  for (; i-- > 0; ) {
    const r = n[i],
      o = t[r];
    if (o) {
      const a = e[r],
        l = a === void 0 || o(a, r, e);
      if (l !== !0)
        throw new q("option " + r + " must be " + l, q.ERR_BAD_OPTION_VALUE);
      continue;
    }
    if (s !== !0) throw new q("Unknown option " + r, q.ERR_BAD_OPTION);
  }
}
const xs = { assertOptions: Ou, validators: en },
  Ue = xs.validators;
class $s {
  constructor(t) {
    (this.defaults = t || {}),
      (this.interceptors = { request: new Gi(), response: new Gi() });
  }
  async request(t, s) {
    try {
      return await this._request(t, s);
    } catch (n) {
      if (n instanceof Error) {
        let i = {};
        Error.captureStackTrace
          ? Error.captureStackTrace(i)
          : (i = new Error());
        const r = i.stack ? i.stack.replace(/^.+\n/, "") : "";
        try {
          n.stack
            ? r &&
              !String(n.stack).endsWith(r.replace(/^.+\n.+\n/, "")) &&
              (n.stack +=
                `
` + r)
            : (n.stack = r);
        } catch {}
      }
      throw n;
    }
  }
  _request(t, s) {
    typeof t == "string" ? ((s = s || {}), (s.url = t)) : (s = t || {}),
      (s = Ct(this.defaults, s));
    const { transitional: n, paramsSerializer: i, headers: r } = s;
    n !== void 0 &&
      xs.assertOptions(
        n,
        {
          silentJSONParsing: Ue.transitional(Ue.boolean),
          forcedJSONParsing: Ue.transitional(Ue.boolean),
          clarifyTimeoutError: Ue.transitional(Ue.boolean),
        },
        !1
      ),
      i != null &&
        (g.isFunction(i)
          ? (s.paramsSerializer = { serialize: i })
          : xs.assertOptions(
              i,
              { encode: Ue.function, serialize: Ue.function },
              !0
            )),
      s.allowAbsoluteUrls !== void 0 ||
        (this.defaults.allowAbsoluteUrls !== void 0
          ? (s.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls)
          : (s.allowAbsoluteUrls = !0)),
      xs.assertOptions(
        s,
        {
          baseUrl: Ue.spelling("baseURL"),
          withXsrfToken: Ue.spelling("withXSRFToken"),
        },
        !0
      ),
      (s.method = (s.method || this.defaults.method || "get").toLowerCase());
    let o = r && g.merge(r.common, r[s.method]);
    r &&
      g.forEach(
        ["delete", "get", "head", "post", "put", "patch", "common"],
        (C) => {
          delete r[C];
        }
      ),
      (s.headers = Fe.concat(o, r));
    const a = [];
    let l = !0;
    this.interceptors.request.forEach(function (_) {
      (typeof _.runWhen == "function" && _.runWhen(s) === !1) ||
        ((l = l && _.synchronous), a.unshift(_.fulfilled, _.rejected));
    });
    const d = [];
    this.interceptors.response.forEach(function (_) {
      d.push(_.fulfilled, _.rejected);
    });
    let c,
      f = 0,
      w;
    if (!l) {
      const C = [ir.bind(this), void 0];
      for (
        C.unshift.apply(C, a),
          C.push.apply(C, d),
          w = C.length,
          c = Promise.resolve(s);
        f < w;

      )
        c = c.then(C[f++], C[f++]);
      return c;
    }
    w = a.length;
    let S = s;
    for (f = 0; f < w; ) {
      const C = a[f++],
        _ = a[f++];
      try {
        S = C(S);
      } catch (y) {
        _.call(this, y);
        break;
      }
    }
    try {
      c = ir.call(this, S);
    } catch (C) {
      return Promise.reject(C);
    }
    for (f = 0, w = d.length; f < w; ) c = c.then(d[f++], d[f++]);
    return c;
  }
  getUri(t) {
    t = Ct(this.defaults, t);
    const s = Ao(t.baseURL, t.url, t.allowAbsoluteUrls);
    return xo(s, t.params, t.paramsSerializer);
  }
}
g.forEach(["delete", "get", "head", "options"], function (t) {
  $s.prototype[t] = function (s, n) {
    return this.request(
      Ct(n || {}, { method: t, url: s, data: (n || {}).data })
    );
  };
});
g.forEach(["post", "put", "patch"], function (t) {
  function s(n) {
    return function (r, o, a) {
      return this.request(
        Ct(a || {}, {
          method: t,
          headers: n ? { "Content-Type": "multipart/form-data" } : {},
          url: r,
          data: o,
        })
      );
    };
  }
  ($s.prototype[t] = s()), ($s.prototype[t + "Form"] = s(!0));
});
const Ss = $s;
class di {
  constructor(t) {
    if (typeof t != "function")
      throw new TypeError("executor must be a function.");
    let s;
    this.promise = new Promise(function (r) {
      s = r;
    });
    const n = this;
    this.promise.then((i) => {
      if (!n._listeners) return;
      let r = n._listeners.length;
      for (; r-- > 0; ) n._listeners[r](i);
      n._listeners = null;
    }),
      (this.promise.then = (i) => {
        let r;
        const o = new Promise((a) => {
          n.subscribe(a), (r = a);
        }).then(i);
        return (
          (o.cancel = function () {
            n.unsubscribe(r);
          }),
          o
        );
      }),
      t(function (r, o, a) {
        n.reason || ((n.reason = new zt(r, o, a)), s(n.reason));
      });
  }
  throwIfRequested() {
    if (this.reason) throw this.reason;
  }
  subscribe(t) {
    if (this.reason) {
      t(this.reason);
      return;
    }
    this._listeners ? this._listeners.push(t) : (this._listeners = [t]);
  }
  unsubscribe(t) {
    if (!this._listeners) return;
    const s = this._listeners.indexOf(t);
    s !== -1 && this._listeners.splice(s, 1);
  }
  toAbortSignal() {
    const t = new AbortController(),
      s = (n) => {
        t.abort(n);
      };
    return (
      this.subscribe(s),
      (t.signal.unsubscribe = () => this.unsubscribe(s)),
      t.signal
    );
  }
  static source() {
    let t;
    return {
      token: new di(function (i) {
        t = i;
      }),
      cancel: t,
    };
  }
}
const Lu = di;
function $u(e) {
  return function (s) {
    return e.apply(null, s);
  };
}
function Du(e) {
  return g.isObject(e) && e.isAxiosError === !0;
}
const Bn = {
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
};
Object.entries(Bn).forEach(([e, t]) => {
  Bn[t] = e;
});
const zu = Bn;
function $o(e) {
  const t = new Ss(e),
    s = ho(Ss.prototype.request, t);
  return (
    g.extend(s, Ss.prototype, t, { allOwnKeys: !0 }),
    g.extend(s, t, null, { allOwnKeys: !0 }),
    (s.create = function (i) {
      return $o(Ct(e, i));
    }),
    s
  );
}
const ce = $o(ui);
ce.Axios = Ss;
ce.CanceledError = zt;
ce.CancelToken = Lu;
ce.isCancel = Mo;
ce.VERSION = Lo;
ce.toFormData = Zs;
ce.AxiosError = q;
ce.Cancel = ce.CanceledError;
ce.all = function (t) {
  return Promise.all(t);
};
ce.spread = $u;
ce.isAxiosError = Du;
ce.mergeConfig = Ct;
ce.AxiosHeaders = Fe;
ce.formToJSON = (e) => To(g.isHTMLForm(e) ? new FormData(e) : e);
ce.getAdapter = Oo.getAdapter;
ce.HttpStatusCode = zu;
ce.default = ce;
const Ut = ce,
  Qt = "http://localhost:3004",
  Le = {
    async healthCheck() {
      try {
        const e = await Ut.get(`${Qt}/health`, { timeout: 1e4 });
        return {
          success: e.data.success || !0,
          data: e.data.data || e.data,
          message: e.data.message || "Health check successful",
        };
      } catch (e) {
        return { success: !1, errorMessage: this.getErrorMessage(e), error: e };
      }
    },
    async get(e, t = {}) {
      try {
        const s = await Ut.get(`${Qt}${e}`, {
          headers: { "Content-Type": "application/json", ...t.headers },
          timeout: t.timeout || 15e3,
          ...t,
        });
        return {
          success: s.data.success || !0,
          data: s.data.data || s.data,
          message: s.data.message || "Request successful",
          sessionId: s.data.sessionId,
        };
      } catch (s) {
        return { success: !1, errorMessage: this.getErrorMessage(s), error: s };
      }
    },
    async post(e, t, s = {}) {
      try {
        const n = await Ut.post(`${Qt}${e}`, t, {
          headers: { "Content-Type": "application/json", ...s.headers },
          timeout: s.timeout || 2e4,
          ...s,
        });
        return {
          success: n.data.success || !0,
          data: n.data.data || n.data,
          message: n.data.message || "Request successful",
          sessionId: n.data.sessionId,
        };
      } catch (n) {
        return { success: !1, errorMessage: this.getErrorMessage(n), error: n };
      }
    },
    async put(e, t, s = {}) {
      try {
        const n = await Ut.put(`${Qt}${e}`, t, {
          headers: { "Content-Type": "application/json", ...s.headers },
          timeout: s.timeout || 2e4,
          ...s,
        });
        return {
          success: n.data.success || !0,
          data: n.data.data || n.data,
          message: n.data.message || "Request successful",
          sessionId: n.data.sessionId,
        };
      } catch (n) {
        return { success: !1, errorMessage: this.getErrorMessage(n), error: n };
      }
    },
    async delete(e, t = {}) {
      try {
        const s = await Ut.delete(`${Qt}${e}`, {
          headers: { "Content-Type": "application/json", ...t.headers },
          timeout: t.timeout || 15e3,
          ...t,
        });
        return {
          success: s.data.success || !0,
          data: s.data.data || s.data,
          message: s.data.message || "Request successful",
        };
      } catch (s) {
        return { success: !1, errorMessage: this.getErrorMessage(s), error: s };
      }
    },
    getErrorMessage(e) {
      var t;
      if ((t = e == null ? void 0 : e.response) != null && t.status) {
        const s = e.response.status;
        return (
          {
            400: "BAD_REQUEST",
            401: "UNAUTHORIZED",
            403: "FORBIDDEN",
            404: "NOT_FOUND",
            408: "REQUEST_TIMEOUT",
            429: "RATE_LIMITED",
            500: "INTERNAL_SERVER_ERROR",
            502: "BAD_GATEWAY",
            503: "SERVICE_UNAVAILABLE",
            504: "GATEWAY_TIMEOUT",
          }[s] || `HTTP_${s}`
        );
      }
      return e != null && e.request
        ? e.code || "NETWORK_ERROR"
        : (e == null ? void 0 : e.message) || "UNKNOWN_ERROR";
    },
  },
  Vt = {
    async getPersonas() {
      console.log("🚀 [personaService] getPersonas: Starting API call");
      const e = await Le.get("/personas");
      return (
        console.log("📡 [personaService] getPersonas: API response received:", {
          success: e.success,
          hasData: !!e.data,
          dataType: typeof e.data,
          dataLength: Array.isArray(e.data) ? e.data.length : "not array",
        }),
        e.success
          ? console.log(
              "✅ [personaService] getPersonas: Personas loaded successfully:",
              { count: Array.isArray(e.data) ? e.data.length : 0 }
            )
          : console.error(
              "❌ [personaService] getPersonas: Failed to load personas:",
              { errorMessage: e.errorMessage }
            ),
        e
      );
    },
    async getPersonaByCode(e) {
      return await Le.get(`/personas/${e}`);
    },
    async getSystemPrompt(e) {
      return await Le.get(`/personas/${e}/prompt`);
    },
    async updateSystemPrompt(e, t) {
      return await Le.put(`/personas/${e}/prompt`, { systemPrompt: t });
    },
    getPersonaIcon(e) {
      return this.getRandomPersonaIcon(e);
    },
    getRandomPersonaIcon(e) {
      const t = [
          "robot",
          "brain",
          "cpu",
          "database",
          "shield",
          "terminal",
          "code",
          "compass",
          "briefcase",
          "target",
          "lightbulb",
          "award",
          "gem",
          "rocket",
          "users",
          "user",
          "mail",
          "phone",
          "message-circle",
          "heart",
          "palette",
          "camera",
          "music",
          "book",
          "edit",
          "sparkles",
          "settings",
          "home",
          "star",
          "info",
          "wrench",
          "grid",
        ],
        s = this.hashCode(e || "default"),
        n = Math.abs(s) % t.length;
      return t[n];
    },
    hashCode(e) {
      let t = 0;
      for (let s = 0; s < e.length; s++) {
        const n = e.charCodeAt(s);
        (t = (t << 5) - t + n), (t = t & t);
      }
      return t;
    },
  },
  Ge = {
    async sendMessage(e) {
      var n, i, r, o;
      console.log("🚀 [messageService] sendMessage: Starting API call:", {
        personaCode: e.personaCode,
        userQueryLength: ((n = e.userQuery) == null ? void 0 : n.length) || 0,
        hasSessionId: !!e.sessionId,
        hasQueryHistory: !!(e.queryHistory && e.queryHistory.length > 0),
        queryHistoryCount:
          ((i = e.queryHistory) == null ? void 0 : i.length) || 0,
      });
      const t = {
        personaCode: e.personaCode,
        userQuery: e.userQuery,
        sessionId: e.sessionId,
      };
      e.queryHistory &&
        e.queryHistory.length > 0 &&
        ((t.queryHistory = JSON.stringify(e.queryHistory)),
        console.log(
          "📄 [messageService] sendMessage: Including query history:",
          e.queryHistory.length,
          "items"
        )),
        console.log("📤 [messageService] sendMessage: Request body prepared:", {
          personaCode: t.personaCode,
          userQueryLength: (r = t.userQuery) == null ? void 0 : r.length,
          sessionId: t.sessionId,
          hasQueryHistory: !!t.queryHistory,
        });
      const s = await Le.get("/message-async", { timeout: 6e4 });
      if (
        (console.log("📡 [messageService] sendMessage: Raw API response:", {
          success: s.success,
          hasData: !!s.data,
          hasAiResponse: !!((o = s.data) != null && o.aiResponse),
          hasSessionId: !!s.sessionId,
        }),
        s.success)
      ) {
        const a = s.data || s.data;
        console.log("🤖 [messageService] sendMessage: AI response extracted:", {
          aiResponseType: typeof a,
          aiResponseLength: typeof a == "string" ? a.length : "not string",
        });
        const l = {
          success: !0,
          data: { aiResponse: a, success: s.success },
          sessionId: s.sessionId || e.sessionId,
          message: s.message || "Message sent successfully",
        };
        return (
          console.log(
            "✅ [messageService] sendMessage: Final result prepared:",
            {
              success: l.success,
              hasAiResponse: !!l.data.aiResponse,
              sessionId: l.sessionId,
              message: l.message,
            }
          ),
          l
        );
      } else
        return (
          console.error("❌ [messageService] sendMessage: API call failed:", {
            errorMessage: s.errorMessage,
            personaCode: e.personaCode,
          }),
          s
        );
    },
    async generateQuickQuestions(e) {
      console.log(
        "🚀 [messageService] generateQuickQuestions: Starting API call:",
        {
          personaCode: e.personaCode,
          hasConversationContext: !!e.conversationContext,
          currentLanguage: e.currentLanguage,
        }
      );
      const t = await Le.get("/quick-questions", { timeout: 3e4 });
      if (
        (console.log(
          "📡 [messageService] generateQuickQuestions: Raw API response:",
          { success: t.success, hasData: !!t.data }
        ),
        t.success)
      ) {
        const s = t.data || t.data;
        console.log(
          "❓ [messageService] generateQuickQuestions: Raw questions data:",
          {
            type: typeof s,
            isArray: Array.isArray(s),
            length: typeof s == "string" ? s.length : "not string",
          }
        );
        const n = this.parseQuickQuestions(s);
        return (
          console.log(
            "📄 [messageService] generateQuickQuestions: Parsed questions:",
            { count: n.length, questions: n }
          ),
          {
            success: !0,
            data: { questions: n, success: t.success },
            message: t.message || "Quick questions generated successfully",
          }
        );
      } else
        return (
          console.error(
            "❌ [messageService] generateQuickQuestions: API call failed:",
            { errorMessage: t.errorMessage, personaCode: e.personaCode }
          ),
          t
        );
    },
    parseQuickQuestions(e) {
      if (
        (console.log(
          "🔄 [messageService] parseQuickQuestions: Starting parsing:",
          { hasRawData: !!e, rawDataType: typeof e, isArray: Array.isArray(e) }
        ),
        !e)
      )
        return (
          console.warn(
            "⚠️ [messageService] parseQuickQuestions: No raw data provided"
          ),
          []
        );
      try {
        let t = e;
        if (typeof e == "string") {
          (t = e.trim()),
            console.log(
              "📄 [messageService] parseQuickQuestions: Processing string data:",
              {
                length: t.length,
                hasJsonMatch: /\[\s*"[^"]*"(?:\s*,\s*"[^"]*")*\s*\]/.test(t),
              }
            );
          const s = t.match(/\[\s*"[^"]*"(?:\s*,\s*"[^"]*")*\s*\]/);
          if (s) {
            console.log(
              "🔮 [messageService] parseQuickQuestions: JSON match found:",
              s[0]
            );
            const i = JSON.parse(s[0]),
              r = Array.isArray(i)
                ? i.filter((o) => o && o.trim()).slice(0, 5)
                : [];
            return (
              console.log(
                "✅ [messageService] parseQuickQuestions: JSON parsing successful:",
                r
              ),
              r
            );
          }
          console.log(
            "📄 [messageService] parseQuickQuestions: No JSON match, processing lines"
          );
          const n = t
            .split(/\r?\n/)
            .map((i) => i.trim())
            .filter((i) => i && !i.match(/^[\[\]\r\n\s\-\*]*$/))
            .map((i) =>
              i
                .replace(/^[0-9]+\.?\s*/, "")
                .replace(/^["'\-\*•]\s*|["'\-\*•]\s*$/g, "")
            )
            .filter((i) => i.length > 5)
            .slice(0, 5);
          return (
            console.log(
              "✅ [messageService] parseQuickQuestions: Line processing result:",
              n
            ),
            n
          );
        }
        if (Array.isArray(e)) {
          console.log(
            "📄 [messageService] parseQuickQuestions: Processing array data:",
            { length: e.length, items: e }
          );
          const s = e
            .filter((n) => n && n.trim() && n.trim().length > 5)
            .slice(0, 5);
          return (
            console.log(
              "✅ [messageService] parseQuickQuestions: Array processing result:",
              s
            ),
            s
          );
        }
        if (e && typeof e == "object") {
          console.log(
            "📄 [messageService] parseQuickQuestions: Processing object data:",
            {
              keys: Object.keys(e),
              hasQuestions: !!e.questions,
              hasQueries: !!e.queries,
              hasData: !!e.data,
            }
          );
          const s = e.questions || e.queries || e.data || [],
            n = Array.isArray(s)
              ? s.filter((i) => i && i.trim()).slice(0, 5)
              : [];
          return (
            console.log(
              "✅ [messageService] parseQuickQuestions: Object processing result:",
              n
            ),
            n
          );
        }
        return (
          console.warn(
            "⚠️ [messageService] parseQuickQuestions: Unknown data type, returning empty array"
          ),
          []
        );
      } catch (t) {
        return (
          console.error(
            "❌ [messageService] parseQuickQuestions: 빠른 질문 파싱 실패:",
            { error: t.message, stack: t.stack, rawData: e }
          ),
          []
        );
      }
    },
    async getConversations(e) {
      return await Le.get(`/conversations/${e}`);
    },
    async deleteConversations(e) {
      return await Le.delete(`/conversations/${e}`);
    },
    async sendFeedback(e) {
      return await Le.get("/feedback", { timeout: 2e4 });
    },
    convertConversationsToMessages(e) {
      const t = [];
      return Array.isArray(e)
        ? (e.forEach((s, n) => {
            const i = s.userQuery;
            i &&
              t.push({
                id: `user-${n}-${Date.now()}`,
                type: "user",
                content: i,
                timestamp: new Date(s.createdDate || Date.now()).getTime(),
                isLoading: !1,
              });
            const r = s.aiResponse || s.aiQuery;
            r &&
              t.push({
                id: `ai-${n}-${Date.now()}`,
                type: "ai",
                content: r,
                timestamp: new Date(s.createdDate || Date.now()).getTime() + 1,
                isLoading: !1,
                conversationId: s.conversationId || s.id,
              });
          }),
          t.sort((s, n) => s.timestamp - n.timestamp))
        : t;
    },
    extractAIResponse(e) {
      var t, s;
      return (
        ((t = e.data) == null ? void 0 : t.aiResponse) ||
        ((s = e.data) == null ? void 0 : s.data) ||
        e.data
      );
    },
    extractConversationId(e) {
      var t;
      return (
        ((t = e.data) == null ? void 0 : t.conversationId) ||
        e.sessionId ||
        Date.now()
      );
    },
    extractQuickQuestions(e) {
      var t, s;
      return (
        ((t = e.data) == null ? void 0 : t.questions) ||
        ((s = e.data) == null ? void 0 : s.data) ||
        []
      );
    },
  };
function Fu(e) {
  let t = "";
  const s = e.split(`
`);
  let n = !1,
    i = "",
    r = !1,
    o = [],
    a = !1,
    l = !1,
    d = "",
    c = [];
  for (let _ = 0; _ < s.length; _++) {
    let y = s[_].trim(),
      O = s[_];
    if (y.startsWith("```")) {
      n
        ? ((t += "</pre></div>"), (n = !1), (i = ""))
        : ((i = y.replace("```", "").trim()),
          (t += '<div class="markdown-code-block">'),
          (t += `<div class="code-header"><span class="code-lang">${
            i || "code"
          }</span><button class="copy-code-btn">Copy</button></div>`),
          (t += "<pre>"),
          (n = !0));
      continue;
    }
    if (n) {
      t +=
        Nu(O) +
        `
`;
      continue;
    }
    if (y.startsWith("> [!")) {
      const D = y.match(/^> \[!(\w+)\]/);
      if (D) {
        d = D[1].toLowerCase();
        let Q = "",
          K = "";
        switch (d) {
          case "note":
          case "info":
            (Q = "info"), (K = "ℹ️");
            break;
          case "tip":
          case "success":
            (Q = "success"), (K = "✅");
            break;
          case "warning":
            (Q = "warning"), (K = "⚠️");
            break;
          case "caution":
          case "error":
            (Q = "error"), (K = "❌");
            break;
          default:
            (Q = "info"), (K = "ℹ️");
        }
        t += `<div class="markdown-alert markdown-alert-${Q}">`;
        const se = y.replace(/^> \[!\w+\]\s*/, "").trim();
        (t += `<span class="markdown-alert-icon">${K}</span>`),
          se && (t += `<div>${ot(se)}</div>`),
          (l = !0);
        continue;
      }
    }
    if (l && y.startsWith("> ")) {
      const D = y.replace(/^>\s*/, "").trim();
      t += `<p>${ot(D)}</p>`;
      continue;
    } else l && ((t += "</div>"), (l = !1));
    if (y.startsWith("#")) {
      f();
      const D = y.match(/^#+/)[0].length,
        Q = y.replace(/^#+\s*/, "").trim();
      t += `<h${D} class="markdown-h${D} markdown-heading">${ot(Q)}</h${D}>`;
      continue;
    }
    const F = O.match(/^\s*/)[0].length / 2,
      N = y.match(/^(\s*)[-*+]\s/),
      P = y.match(/^(\s*)\d+\.\s/);
    if (N || P) {
      w(F, N ? "ul" : "ol");
      const D = y.replace(/^(\s*)[-*+]?\s*\d*\.?\s*/, "").trim();
      t += `<li class="markdown-list-item markdown-list-item-level-${F}">${ot(
        D
      )}</li>`;
      continue;
    } else f();
    if (y.startsWith(">") && !l) {
      a || ((t += '<blockquote class="markdown-blockquote">'), (a = !0));
      const D = y.replace(/^>\s*/, "").trim();
      t += `<p>${ot(D)}</p>`;
      continue;
    } else a && ((t += "</blockquote>"), (a = !1));
    if (y.startsWith("|")) {
      r || ((r = !0), (o = [])),
        o.push(y),
        (_ + 1 >= s.length || !s[_ + 1].trim().startsWith("|")) &&
          ((t += C(o)), (r = !1), (o = []));
      continue;
    }
    if (y.match(/^[-*]{3,}$/)) {
      f(), (t += '<hr class="markdown-hr">');
      continue;
    }
    y
      ? (f(), (t += `<p class="markdown-paragraph">${ot(y)}</p>`))
      : (t += "<br>");
  }
  return S(), `<div class="markdown-content">${t}</div>`;
  function f() {
    for (; c.length > 0; ) t += `</${c.pop()}>`;
  }
  function w(_, y) {
    for (; c.length > _; ) t += `</${c.pop()}>`;
    c.length < _
      ? ((t += `<${y} class="markdown-list markdown-list-level-${_}">`),
        c.push(y))
      : c.length === _ &&
        c[c.length - 1] !== y &&
        ((t += `</${c.pop()}>`),
        (t += `<${y} class="markdown-list markdown-list-level-${_}">`),
        c.push(y));
  }
  function S() {
    n && (t += "</pre></div>"),
      l && (t += "</div>"),
      f(),
      a && (t += "</blockquote>"),
      r && ((t += C(o)), (r = !1), (o = []));
  }
  function C(_) {
    if (_.length < 2) return "";
    let y =
      '<div class="markdown-table-container"><table class="markdown-table">';
    const O = _[0],
      F = _[1],
      N = _.slice(2),
      P = O.split("|")
        .map((Q) => Q.trim())
        .slice(1, -1),
      D = F.split("|")
        .map((Q) => Q.trim())
        .slice(1, -1);
    return (
      (y += "<thead><tr>"),
      P.forEach((Q, K) => {
        const se = D[K] || "";
        let ke = "";
        se.startsWith(":") && se.endsWith(":")
          ? (ke = ' style="text-align: center;"')
          : se.endsWith(":")
          ? (ke = ' style="text-align: right;"')
          : (ke = ' style="text-align: left;"'),
          (y += `<th${ke}>${ot(Q)}</th>`);
      }),
      (y += "</tr></thead>"),
      (y += "<tbody>"),
      N.forEach((Q) => {
        const K = Q.split("|")
          .map((se) => se.trim())
          .slice(1, -1);
        (y += "<tr>"),
          K.forEach((se, ke) => {
            const Re = D[ke] || "";
            let Be = "";
            Re.startsWith(":") && Re.endsWith(":")
              ? (Be = ' style="text-align: center;"')
              : Re.endsWith(":")
              ? (Be = ' style="text-align: right;"')
              : (Be = ' style="text-align: left;"'),
              (y += `<td${Be}>${ot(se)}</td>`);
          }),
          (y += "</tr>");
      }),
      (y += "</tbody>"),
      (y += "</table></div>"),
      y
    );
  }
}
function ot(e) {
  function t(s) {
    return (
      (s = s.replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" class="markdown-link">$1</a>'
      )),
      (s = s.replace(
        /\*\*(.*?)\*\*/g,
        (n, i) => `<strong class="markdown-strong">${t(i)}</strong>`
      )),
      (s = s.replace(
        new RegExp("(?<!\\*)\\*([^*]+)\\*(?!\\*)", "g"),
        (n, i) => `<em class="markdown-em">${t(i)}</em>`
      )),
      (s = s.replace(
        /`(.*?)`/g,
        '<code class="markdown-inline-code">$1</code>'
      )),
      s
    );
  }
  return t(e);
}
function Nu(e) {
  return e
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
const at = {
    htmlToMarkdown(e) {
      if (!e || typeof e != "string") return e;
      let t = e;
      return (
        (t = t.replace(
          /<div class="markdown-table-container">(.*?)<\/div>/gs,
          (s, n) => {
            const i = n.match(
              /<table[^>]*class="markdown-table"[^>]*>(.*?)<\/table>/s
            );
            if (!i) return "";
            const r = i[1];
            let o = `
`;
            const a = r.match(/<thead>(.*?)<\/thead>/s);
            if (a) {
              const d = a[1].match(/<th[^>]*>(.*?)<\/th>/gs);
              if (d) {
                const c = d
                  .map((f) =>
                    this.stripHtml(f.replace(/<th[^>]*>|<\/th>/g, "")).trim()
                  )
                  .join(" | ");
                (o += `| ${c} |
`),
                  (o += `| ${d.map(() => "---").join(" | ")} |
`);
              }
            }
            const l = r.match(/<tbody>(.*?)<\/tbody>/s);
            if (l) {
              const d = l[1].match(/<tr[^>]*>(.*?)<\/tr>/gs);
              d &&
                d.forEach((c) => {
                  const f = c.match(/<td[^>]*>(.*?)<\/td>/gs);
                  if (f) {
                    const w = f
                      .map((S) =>
                        this.stripHtml(
                          S.replace(/<td[^>]*>|<\/td>/g, "")
                        ).trim()
                      )
                      .join(" | ");
                    o += `| ${w} |
`;
                  }
                });
            }
            return (
              o +
              `
`
            );
          }
        )),
        (t = t.replace(
          /<h([1-6])[^>]*class="markdown-heading[^"]*"[^>]*>(.*?)<\/h[1-6]>/gs,
          (s, n, i) => {
            const r = this.stripHtml(i).trim();
            return (
              `
` +
              "#".repeat(parseInt(n)) +
              " " +
              r +
              `

`
            );
          }
        )),
        (t = t.replace(
          /<p[^>]*class="markdown-paragraph"[^>]*>(.*?)<\/p>/gs,
          (s, n) =>
            this.stripHtml(n).trim() +
            `

`
        )),
        (t = t.replace(
          /<strong[^>]*class="markdown-strong"[^>]*>(.*?)<\/strong>/gs,
          (s, n) => "**" + this.stripHtml(n).trim() + "**"
        )),
        (t = t.replace(
          /<code[^>]*class="markdown-inline-code"[^>]*>(.*?)<\/code>/gs,
          (s, n) => "`" + this.stripHtml(n).trim() + "`"
        )),
        (t = t.replace(
          /<div[^>]*class="markdown-code-block"[^>]*>(.*?)<\/div>/gs,
          (s, n) => {
            const i = n.match(
                /<div[^>]*class="language-label"[^>]*>(.*?)<\/div>/
              ),
              r = n.match(/<pre><code>(.*?)<\/code><\/pre>/s);
            if (r) {
              const o = i ? this.stripHtml(i[1]).trim() : "",
                a = this.stripHtml(r[1]);
              return (
                "\n```" +
                o +
                `
` +
                a +
                "\n```\n\n"
              );
            }
            return "";
          }
        )),
        (t = t.replace(
          /<ul[^>]*class="markdown-list"[^>]*>(.*?)<\/ul>/gs,
          (s, n) => {
            const i = n.match(
              /<li[^>]*class="markdown-list-item"[^>]*>(.*?)<\/li>/gs
            );
            return i
              ? `
` +
                  i.map(
                    (r) =>
                      "- " +
                      this.stripHtml(r.replace(/<li[^>]*>|<\/li>/g, "")).trim()
                  ).join(`
`) +
                  `

`
              : "";
          }
        )),
        (t = t.replace(
          /<div[^>]*class="markdown-alert[^"]*"[^>]*>(.*?)<\/div>/gs,
          (s, n) =>
            `
> ` +
            this.stripHtml(n)
              .replace(/^[^\w]*/, "")
              .trim() +
            `

`
        )),
        (t = this.stripHtml(t)),
        (t = t
          .replace(
            /\n{3,}/g,
            `

`
          )
          .trim()),
        t
      );
    },
    htmlToPlainText(e) {
      if (!e || typeof e != "string") return e;
      let t = e;
      return (
        (t = t.replace(
          /<div class="markdown-table-container">(.*?)<\/div>/gs,
          (s, n) => {
            const i = n.match(/<table[^>]*>(.*?)<\/table>/s);
            if (!i) return "";
            const r = i[1];
            let o = `
`;
            const a = r.match(/<thead>(.*?)<\/thead>/s);
            if (a) {
              const d = a[1].match(/<th[^>]*>(.*?)<\/th>/gs);
              d &&
                (o +=
                  d
                    .map((c) =>
                      this.stripHtml(c.replace(/<th[^>]*>|<\/th>/g, "")).trim()
                    )
                    .join("	") +
                  `
`);
            }
            const l = r.match(/<tbody>(.*?)<\/tbody>/s);
            if (l) {
              const d = l[1].match(/<tr[^>]*>(.*?)<\/tr>/gs);
              d &&
                d.forEach((c) => {
                  const f = c.match(/<td[^>]*>(.*?)<\/td>/gs);
                  f &&
                    (o +=
                      f
                        .map((w) =>
                          this.stripHtml(
                            w.replace(/<td[^>]*>|<\/td>/g, "")
                          ).trim()
                        )
                        .join("	") +
                      `
`);
                });
            }
            return o;
          }
        )),
        (t = t.replace(
          /<h[1-6][^>]*>(.*?)<\/h[1-6]>/gs,
          (s, n) =>
            `
` +
            this.stripHtml(n).trim() +
            `
`
        )),
        (t = t.replace(
          /<p[^>]*>(.*?)<\/p>/gs,
          (s, n) =>
            this.stripHtml(n).trim() +
            `
`
        )),
        (t = t.replace(
          /<li[^>]*>(.*?)<\/li>/gs,
          (s, n) =>
            "• " +
            this.stripHtml(n).trim() +
            `
`
        )),
        (t = t.replace(
          /<pre><code>(.*?)<\/code><\/pre>/gs,
          (s, n) =>
            `
` +
            this.stripHtml(n) +
            `
`
        )),
        (t = this.stripHtml(t)),
        (t = t
          .replace(
            /\n{3,}/g,
            `

`
          )
          .trim()),
        t
      );
    },
    stripHtml(e) {
      return e ? e.replace(/<[^>]*>/g, "") : "";
    },
    isMarkdown(e) {
      return !e || typeof e != "string" || (e.includes("<") && e.includes(">"))
        ? !1
        : [
            /^#{1,6}\s+.+$/m,
            /^\*\s+.+$/m,
            /^-\s+.+$/m,
            /^\d+\.\s+.+$/m,
            /\*\*.+?\*\*/,
            /\*.+?\*/,
            /`.+?`/,
            /```[\s\S]*?```/,
            /^\>.+$/m,
            /\[.+?\]\(.+?\)/,
            /!\[.*?\]\(.+?\)/,
          ].some((s) => s.test(e));
    },
    markdownToHtml(e) {
      if (!e || typeof e != "string") return e;
      try {
        return Fu(e);
      } catch (t) {
        return console.error("마크다운 변환 실패:", t), e;
      }
    },
    detectContentType(e) {
      return !e || typeof e != "string"
        ? "plain"
        : e.includes("<") && e.includes(">")
        ? "html"
        : this.isMarkdown(e)
        ? "markdown"
        : "plain";
    },
    formatContentForDisplay(e) {
      switch (this.detectContentType(e)) {
        case "markdown":
          return this.markdownToHtml(e);
        case "html":
          return e;
        case "plain":
        default:
          return e;
      }
    },
    getContentForCopy(e) {
      switch (this.detectContentType(e)) {
        case "html":
          return this.htmlToMarkdown(e);
        case "markdown":
          return e;
        case "plain":
        default:
          return e;
      }
    },
  },
  re = {
    async healthCheck() {
      return await Le.healthCheck();
    },
    async getPersonas() {
      return await Vt.getPersonas();
    },
    async getPersonaByCode(e) {
      return await Vt.getPersonaByCode(e);
    },
    async getSystemPrompt(e) {
      return await Vt.getSystemPrompt(e);
    },
    async updateSystemPrompt(e, t) {
      return await Vt.updateSystemPrompt(e, t);
    },
    getPersonaIcon(e) {
      return Vt.getPersonaIcon(e);
    },
    async sendMessage(e) {
      return await Ge.sendMessage(e);
    },
    async generateQuickQuestions(e) {
      return await Ge.generateQuickQuestions(e);
    },
    async getConversations(e) {
      return await Ge.getConversations(e);
    },
    async deleteConversations(e) {
      return await Ge.deleteConversations(e);
    },
    async sendFeedback(e) {
      return await Ge.sendFeedback(e);
    },
    convertConversationsToMessages(e) {
      return Ge.convertConversationsToMessages(e);
    },
    extractAIResponse(e) {
      return Ge.extractAIResponse(e);
    },
    extractConversationId(e) {
      return Ge.extractConversationId(e);
    },
    extractQuickQuestions(e) {
      return Ge.extractQuickQuestions(e);
    },
    htmlToMarkdown(e) {
      return at.htmlToMarkdown(e);
    },
    htmlToPlainText(e) {
      return at.htmlToPlainText(e);
    },
    stripHtml(e) {
      return at.stripHtml(e);
    },
    isMarkdown(e) {
      return at.isMarkdown(e);
    },
    markdownToHtml(e) {
      return at.markdownToHtml(e);
    },
    detectContentType(e) {
      return at.detectContentType(e);
    },
    formatContentForDisplay(e) {
      return at.formatContentForDisplay(e);
    },
    getContentForCopy(e) {
      return at.getContentForCopy(e);
    },
    getErrorMessage(e) {
      return Le.getErrorMessage(e);
    },
  },
  Do = {
    ko: {
      online: "온라인",
      offline: "오프라인",
      openChat: "채팅 창 열기",
      closeChat: "채팅 창 닫기",
      minimize: "최소화",
      maximize: "최대화",
      restore: "복원",
      close: "닫기",
      back: "뒤로",
      cancel: "취소",
      home: "홈",
      goHome: "홈으로 가기",
      aiChatOpsTitle: "AIChatOps",
      welcomeTitle: "안녕하세요. 학습형 챗봇 입니다.",
      welcomeMessage:
        "다양한 서비스를 이용해보세요. 많이 사용하고, 피드백 주실 수록 향상된 결과를 얻을 수 있습니다.",
      personalCategory: "개인 특화",
      personalCategoryDesc: "개인 맞춤형 AI 어시스턴트",
      generalCategory: "일반 문의",
      generalCategoryDesc: "사용자 지원 및 문의 응답",
      operationCategory: "운영/관리",
      operationCategoryDesc: "시스템 운영 및 관리 지원",
      selectPersona: "페르소나를 선택해주세요",
      selectPersonaDesc: "Persona(전문가)를 선택해주세요",
      loadingPersonas: "Persona 목록 불러오는 중...",
      noPersonas: "사용 가능한 Persona가 없습니다",
      noPersonasDesc: "이 카테고리에는 아직 Persona가 없습니다",
      defaultPersonaDesc: "전문적인 도움을 제공합니다",
      loadingHistory: "대화 기록 불러오는 중...",
      change: "변경",
      clearAll: "전체 삭제",
      quickQuestions: "빠른 질문",
      continuousChat: "연속 대화",
      generateQuestions: "질문 생성하기",
      quickQuestionGenerated: "빠른 질문이 생성되었습니다",
      quickQuestionError: "빠른 질문 생성 중 오류가 발생했습니다",
      quickQuestionLoading: "빠른 질문을 생성하고 있습니다...",
      noPersonaSelected: "페르소나를 선택해주세요",
      noPersonaDesc: "홈 화면에서 원하는 페르소나를 선택하여 시작하세요",
      welcomeChat: "{persona} 전문가, AIChatOps입니다!",
      welcomeTip: "빠른 질문을 통해서 다양한 질문을 해보세요",
      inputPlaceholder:
        "질문을 입력하세요... (Enter: 전송, Shift+Enter: 줄바꿈)",
      copySuccess: "클립보드에 복사되었습니다!",
      improvePrompt: "프롬프트 개선",
      justNow: "방금 전",
      minutesAgo: "{minutes}분 전",
      hoursAgo: "{hours}시간 전",
      aiError: "응답 생성 중 오류가 발생했어요.",
      networkError: "일시적인 오류가 발생했어요. 다시 시도해주세요.",
      sendFeedback: "피드백 보내기",
      feedbackTitle: "피드백 보내기",
      feedbackDescription: "서비스 개선을 위해 소중한 의견을 들려주세요.",
      ratingLabel: "서비스 만족도",
      feedbackComment: "피드백 의견",
      commentPlaceholder: `서비스에 대한 의견이나 개선사항을 자유롭게 작성해주세요.

• 좋았던 점이나 아쉬웠던 점
• 개선되었으면 하는 기능
• 추가로 필요한 기능 등`,
      submitFeedback: "피드백 보내기",
      feedbackSuccess: "피드백 전송 완료",
      sendAnother: "다른 피드백 보내기",
      easterEgg: "이스터 에그 ",
      loadingMessages: [
        "Prompting...",
        "Thinking...",
        "Analyzing...",
        "Processing...",
        "Reasoning...",
        "Inferring...",
        "Computing...",
        "Synthesizing...",
        "Evaluating...",
        "Generating...",
        "Contextualizing...",
        "Comprehending...",
        "Deducing...",
        "Interpreting...",
        "Formulating...",
        "Articulating...",
        "Conceptualizing...",
        "Deliberating...",
        "Contemplating...",
        "Calculating...",
        "Determining...",
        "Constructing...",
        "Optimizing...",
        "Refining...",
        "Finalizing...",
        "Concluding...",
        "Completing...",
        "Responding...",
        "Preparing...",
        "Assembling...",
        "Crafting...",
        "Polishing...",
      ],
    },
    en: {
      online: "Online",
      offline: "Offline",
      openChat: "Open Chat",
      closeChat: "Close Chat",
      minimize: "Minimize",
      maximize: "Maximize",
      restore: "Restore",
      close: "Close",
      back: "Back",
      cancel: "Cancel",
      home: "Home",
      goHome: "Go Home",
      aiChatOpsTitle: "AIChatOps",
      welcomeTitle: "Hello. Welcome to Learning AIChatOps.",
      welcomeMessage:
        "Try various services. The more you use and provide feedback, the better results you can get.",
      personalCategory: "Personal",
      personalCategoryDesc: "Personalized AI assistant",
      generalCategory: "General Support",
      generalCategoryDesc: "User support and inquiry response",
      operationCategory: "Operations",
      operationCategoryDesc: "System operation and management support",
      selectPersona: "Please select a persona",
      selectPersonaDesc: "Choose your Persona (Expert)",
      loadingPersonas: "Loading persona list...",
      noPersonas: "No personas available",
      noPersonasDesc: "There are no personas in this category yet",
      defaultPersonaDesc: "Provides professional assistance",
      loadingHistory: "Loading conversation history...",
      change: "Change",
      clearAll: "Clear All",
      quickQuestions: "Quick Questions",
      continuousChat: "Continuous Chat",
      generateQuestions: "Generate Questions",
      quickQuestionGenerated: "Quick questions have been generated",
      quickQuestionError: "An error occurred while generating quick questions",
      quickQuestionLoading: "Generating quick questions...",
      noPersonaSelected: "Please select a persona",
      noPersonaDesc:
        "Choose your desired persona from the home screen to get started",
      welcomeChat: "I am AIChatOps, an expert in {persona}!",
      welcomeTip: "Try various questions through quick questions",
      inputPlaceholder:
        "Enter your question... (Enter: Send, Shift+Enter: New line)",
      copySuccess: "Copied to clipboard!",
      improvePrompt: "Improve Prompt",
      justNow: "Just now",
      minutesAgo: "{minutes} minutes ago",
      hoursAgo: "{hours} hours ago",
      aiError: "An error occurred while generating the response.",
      networkError: "A temporary error occurred. Please try again.",
      sendFeedback: "Send Feedback",
      feedbackTitle: "Send Feedback",
      feedbackDescription:
        "Please share your valuable opinions to help us improve our service.",
      ratingLabel: "Service Satisfaction",
      feedbackComment: "Feedback Comments",
      commentPlaceholder: `Please freely write your opinions or suggestions about the service.

• What you liked or found lacking
• Features you'd like to see improved
• Additional features needed, etc.`,
      submitFeedback: "Send Feedback",
      feedbackSuccess: "Feedback Sent Successfully",
      sendAnother: "Send Another Feedback",
      easterEgg: "Easter Egg ",
      loadingMessages: [
        "Prompting...",
        "Thinking...",
        "Analyzing...",
        "Processing...",
        "Reasoning...",
        "Inferring...",
        "Computing...",
        "Synthesizing...",
        "Evaluating...",
        "Generating...",
        "Contextualizing...",
        "Comprehending...",
        "Deducing...",
        "Interpreting...",
        "Formulating...",
        "Articulating...",
        "Conceptualizing...",
        "Deliberating...",
        "Contemplating...",
        "Calculating...",
        "Determining...",
        "Constructing...",
        "Optimizing...",
        "Refining...",
        "Finalizing...",
        "Concluding...",
        "Completing...",
        "Responding...",
        "Preparing...",
        "Assembling...",
        "Crafting...",
        "Polishing...",
      ],
    },
  };
function hi(e, t, s = {}) {
  var r;
  let i = ((r = Do[e === "kr" ? "ko" : e]) == null ? void 0 : r[t]) || t;
  return (
    s &&
      typeof i == "string" &&
      Object.keys(s).forEach((o) => {
        const a = new RegExp(`{${o}}`, "g");
        i = i.replace(a, s[o]);
      }),
    i
  );
}
function zo(e, t) {
  var n;
  return ((n = Do[e === "kr" ? "ko" : e]) == null ? void 0 : n[t]) || [];
}
const rt = (e, t) => {
    const s = e.__vccOpts || e;
    for (const [n, i] of t) s[n] = i;
    return s;
  },
  Bu = {
    name: "LucideIcon",
    props: {
      name: { type: String, required: !0 },
      fill: { type: String, default: "currentColor" },
      width: { type: [Number, String], default: 24 },
      height: { type: [Number, String], default: 24 },
    },
    data() {
      return {
        svgCache: new Map(),
        safePersonaIcons: [
          "robot",
          "brain",
          "cpu",
          "database",
          "shield",
          "terminal",
          "compass",
          "briefcase",
          "target",
          "lightbulb",
          "award",
          "gem",
          "users",
          "user",
          "settings",
          "home",
          "star",
          "heart",
          "rocket",
          "code",
          "message-circle",
          "check",
          "copy",
          "info",
          "palette",
          "camera",
          "music",
          "book",
          "gamepad-2",
          "wrench",
          "mail",
          "phone",
          "edit",
          "trash",
          "send",
          "layers",
          "refresh-cw",
          "sparkles",
          "zap",
          "check-circle",
          "alert-triangle",
          "wand-sparkles",
          "grid",
          "arrow-up-right",
        ],
      };
    },
    computed: {
      size() {
        return Number(this.width || this.height || 24);
      },
      iconSvg() {
        const e = this.name;
        return this.loadSvgContent(e);
      },
    },
    methods: {
      getPersonaIcon(e = "", t = "") {
        const n = ((e + t).length || 1) % this.safePersonaIcons.length;
        return this.safePersonaIcons[n];
      },
      loadSvgContent(e) {
        if (this.svgCache.has(e))
          return this.processIconSvg(this.svgCache.get(e));
        const t = this.getHardcodedIcon(e);
        return t ? (this.svgCache.set(e, t), t) : this.getFallbackIcon();
      },
      processIconSvg(e) {
        return e
          .replace(/width="[^"]*"/g, `width="${this.size}"`)
          .replace(/height="[^"]*"/g, `height="${this.size}"`)
          .replace(/stroke="[^"]*"/g, `stroke="${this.fill}"`)
          .replace(/fill="currentColor"/g, `fill="${this.fill}"`)
          .replace(/stroke-width="[^"]*"/g, 'stroke-width="2"');
      },
      getHardcodedIcon(e) {
        return {
          x: `<svg xmlns="http://www.w3.org/2000/svg" width="${this.size}" height="${this.size}" viewBox="0 0 24 24" fill="none" stroke="${this.fill}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
          heart: `<svg xmlns="http://www.w3.org/2000/svg" width="${this.size}" height="${this.size}" viewBox="0 0 24 24" fill="none" stroke="${this.fill}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"/></svg>`,
          "message-circle": `<svg xmlns="http://www.w3.org/2000/svg" width="${this.size}" height="${this.size}" viewBox="0 0 24 24" fill="none" stroke="${this.fill}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>`,
          minus: `<svg xmlns="http://www.w3.org/2000/svg" width="${this.size}" height="${this.size}" viewBox="0 0 24 24" fill="none" stroke="${this.fill}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>`,
          "maximize-2": `<svg xmlns="http://www.w3.org/2000/svg" width="${this.size}" height="${this.size}" viewBox="0 0 24 24" fill="none" stroke="${this.fill}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15,3 21,3 21,9"/><polyline points="9,21 3,21 3,15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>`,
          "minimize-2": `<svg xmlns="http://www.w3.org/2000/svg" width="${this.size}" height="${this.size}" viewBox="0 0 24 24" fill="none" stroke="${this.fill}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="4,14 10,14 10,20"/><polyline points="20,10 14,10 14,4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/></svg>`,
          "chevron-right": `<svg xmlns="http://www.w3.org/2000/svg" width="${this.size}" height="${this.size}" viewBox="0 0 24 24" fill="none" stroke="${this.fill}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9,18 15,12 9,6"/></svg>`,
          "arrow-left": `<svg xmlns="http://www.w3.org/2000/svg" width="${this.size}" height="${this.size}" viewBox="0 0 24 24" fill="none" stroke="${this.fill}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12,19 5,12 12,5"/></svg>`,
          user: `<svg xmlns="http://www.w3.org/2000/svg" width="${this.size}" height="${this.size}" viewBox="0 0 24 24" fill="none" stroke="${this.fill}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
          users: `<svg xmlns="http://www.w3.org/2000/svg" width="${this.size}" height="${this.size}" viewBox="0 0 24 24" fill="none" stroke="${this.fill}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
          settings: `<svg xmlns="http://www.w3.org/2000/svg" width="${this.size}" height="${this.size}" viewBox="0 0 24 24" fill="none" stroke="${this.fill}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
          star: `<svg xmlns="http://www.w3.org/2000/svg" width="${this.size}" height="${this.size}" viewBox="0 0 24 24" fill="none" stroke="${this.fill}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>`,
          home: `<svg xmlns="http://www.w3.org/2000/svg" width="${this.size}" height="${this.size}" viewBox="0 0 24 24" fill="none" stroke="${this.fill}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>`,
          briefcase: `<svg xmlns="http://www.w3.org/2000/svg" width="${this.size}" height="${this.size}" viewBox="0 0 24 24" fill="none" stroke="${this.fill}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
          brain: `<svg xmlns="http://www.w3.org/2000/svg" width="${this.size}" height="${this.size}" viewBox="0 0 24 24" fill="none" stroke="${this.fill}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3 4 4 0 0 0-6 6 4 4 0 0 0-1.5 8.2A4 4 0 0 0 2 20c.3 0 .6 0 .9-.1A3 3 0 0 0 6 22h12a3 3 0 0 0 3.1-2.1c.3.1.6.1.9.1a4 4 0 0 0 .5-1.8A4 4 0 0 0 21 11a4 4 0 0 0-6-6 3 3 0 0 0-3-3Z"/></svg>`,
          robot: `<svg xmlns="http://www.w3.org/2000/svg" width="${this.size}" height="${this.size}" viewBox="0 0 24 24" fill="none" stroke="${this.fill}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="8" width="16" height="12" rx="2"/><path d="M12 8V4h-4"/><circle cx="9" cy="13" r="1"/><circle cx="15" cy="13" r="1"/><path d="M2 14h2"/><path d="M20 14h2"/></svg>`,
          rocket: `<svg xmlns="http://www.w3.org/2000/svg" width="${this.size}" height="${this.size}" viewBox="0 0 24 24" fill="none" stroke="${this.fill}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>`,
          cpu: `<svg xmlns="http://www.w3.org/2000/svg" width="${this.size}" height="${this.size}" viewBox="0 0 24 24" fill="none" stroke="${this.fill}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 2v2"/><path d="M15 2v2"/><path d="M9 20v2"/><path d="M15 20v2"/><path d="M2 9h2"/><path d="M2 15h2"/><path d="M20 9h2"/><path d="M20 15h2"/></svg>`,
          database: `<svg xmlns="http://www.w3.org/2000/svg" width="${this.size}" height="${this.size}" viewBox="0 0 24 24" fill="none" stroke="${this.fill}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/></svg>`,
          shield: `<svg xmlns="http://www.w3.org/2000/svg" width="${this.size}" height="${this.size}" viewBox="0 0 24 24" fill="none" stroke="${this.fill}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
          terminal: `<svg xmlns="http://www.w3.org/2000/svg" width="${this.size}" height="${this.size}" viewBox="0 0 24 24" fill="none" stroke="${this.fill}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4,17 10,11 4,5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>`,
          code: `<svg xmlns="http://www.w3.org/2000/svg" width="${this.size}" height="${this.size}" viewBox="0 0 24 24" fill="none" stroke="${this.fill}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16,18 22,12 16,6"/><polyline points="8,6 2,12 8,18"/></svg>`,
          compass: `<svg xmlns="http://www.w3.org/2000/svg" width="${this.size}" height="${this.size}" viewBox="0 0 24 24" fill="none" stroke="${this.fill}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88"/></svg>`,
          target: `<svg xmlns="http://www.w3.org/2000/svg" width="${this.size}" height="${this.size}" viewBox="0 0 24 24" fill="none" stroke="${this.fill}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
          lightbulb: `<svg xmlns="http://www.w3.org/2000/svg" width="${this.size}" height="${this.size}" viewBox="0 0 24 24" fill="none" stroke="${this.fill}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>`,
          award: `<svg xmlns="http://www.w3.org/2000/svg" width="${this.size}" height="${this.size}" viewBox="0 0 24 24" fill="none" stroke="${this.fill}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>`,
          gem: `<svg xmlns="http://www.w3.org/2000/svg" width="${this.size}" height="${this.size}" viewBox="0 0 24 24" fill="none" stroke="${this.fill}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/></svg>`,
          mail: `<svg xmlns="http://www.w3.org/2000/svg" width="${this.size}" height="${this.size}" viewBox="0 0 24 24" fill="none" stroke="${this.fill}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
          phone: `<svg xmlns="http://www.w3.org/2000/svg" width="${this.size}" height="${this.size}" viewBox="0 0 24 24" fill="none" stroke="${this.fill}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
          check: `<svg xmlns="http://www.w3.org/2000/svg" width="${this.size}" height="${this.size}" viewBox="0 0 24 24" fill="none" stroke="${this.fill}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20,6 9,17 4,12"/></svg>`,
          copy: `<svg xmlns="http://www.w3.org/2000/svg" width="${this.size}" height="${this.size}" viewBox="0 0 24 24" fill="none" stroke="${this.fill}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
          trash: `<svg xmlns="http://www.w3.org/2000/svg" width="${this.size}" height="${this.size}" viewBox="0 0 24 24" fill="none" stroke="${this.fill}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3,6 5,6 21,6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
          "send-horizontal": `<svg xmlns="http://www.w3.org/2000/svg" width="${this.size}" height="${this.size}" viewBox="0 0 24 24" fill="none" stroke="${this.fill}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l17-8.5a.5.5 0 0 0 0-.895z"/><path d="M6 12h16"/></svg>`,
          send: `<svg xmlns="http://www.w3.org/2000/svg" width="${this.size}" height="${this.size}" viewBox="0 0 24 24" fill="none" stroke="${this.fill}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22,2 15,22 11,13 2,9"/></svg>`,
          "message-square-plus": `<svg xmlns="http://www.w3.org/2000/svg" width="${this.size}" height="${this.size}" viewBox="0 0 24 24" fill="none" stroke="${this.fill}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M12 7v6"/><path d="M9 10h6"/></svg>`,
          layers: `<svg xmlns="http://www.w3.org/2000/svg" width="${this.size}" height="${this.size}" viewBox="0 0 24 24" fill="none" stroke="${this.fill}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12,2 2,7 12,12 22,7"/><polyline points="2,17 12,22 22,17"/><polyline points="2,12 12,17 22,12"/></svg>`,
          "refresh-cw": `<svg xmlns="http://www.w3.org/2000/svg" width="${this.size}" height="${this.size}" viewBox="0 0 24 24" fill="none" stroke="${this.fill}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23,4 23,10 17,10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>`,
          sparkles: `<svg xmlns="http://www.w3.org/2000/svg" width="${this.size}" height="${this.size}" viewBox="0 0 24 24" fill="none" stroke="${this.fill}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l0 0a2 2 0 0 0-1.437 1.437l0 0a2 2 0 0 0 1.437 1.437l0 0a2 2 0 0 0 1.437-1.437Z"/><path d="M14.5 8.5a2 2 0 0 0-1.437-1.437l0 0A2 2 0 0 0 11.626 8.5l0 0a2 2 0 0 0 1.437 1.437l0 0A2 2 0 0 0 14.5 8.5Z"/><path d="M15.5 4.5a1 1 0 0 0-.7-.7l0 0a1 1 0 0 0-.7.7l0 0a1 1 0 0 0 .7.7l0 0a1 1 0 0 0 .7-.7Z"/><path d="M19.5 8.5a1 1 0 0 0-.7-.7l0 0a1 1 0 0 0-.7.7l0 0a1 1 0 0 0 .7.7l0 0a1 1 0 0 0 .7-.7Z"/></svg>`,
          "wand-sparkles": `<svg xmlns="http://www.w3.org/2000/svg" width="${this.size}" height="${this.size}" viewBox="0 0 24 24" fill="none" stroke="${this.fill}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 4V2l-1 1-1-1v2l1 1 1-1z"/><path d="M22 6V4l-1 1-1-1v2l1 1 1-1z"/><path d="M8.5 8.5 16 16"/><path d="M4 4 2 6l14 14 2-2L4 4z"/><path d="M10.5 2.5 13 5l-2.5 2.5L8 5l2.5-2.5z"/></svg>`,
          zap: `<svg xmlns="http://www.w3.org/2000/svg" width="${this.size}" height="${this.size}" viewBox="0 0 24 24" fill="none" stroke="${this.fill}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/></svg>`,
          info: `<svg xmlns="http://www.w3.org/2000/svg" width="${this.size}" height="${this.size}" viewBox="0 0 24 24" fill="none" stroke="${this.fill}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
          "check-circle": `<svg xmlns="http://www.w3.org/2000/svg" width="${this.size}" height="${this.size}" viewBox="0 0 24 24" fill="none" stroke="${this.fill}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/></svg>`,
          "alert-triangle": `<svg xmlns="http://www.w3.org/2000/svg" width="${this.size}" height="${this.size}" viewBox="0 0 24 24" fill="none" stroke="${this.fill}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
          edit: `<svg xmlns="http://www.w3.org/2000/svg" width="${this.size}" height="${this.size}" viewBox="0 0 24 24" fill="none" stroke="${this.fill}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"/></svg>`,
          palette: `<svg xmlns="http://www.w3.org/2000/svg" width="${this.size}" height="${this.size}" viewBox="0 0 24 24" fill="none" stroke="${this.fill}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>`,
          camera: `<svg xmlns="http://www.w3.org/2000/svg" width="${this.size}" height="${this.size}" viewBox="0 0 24 24" fill="none" stroke="${this.fill}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`,
          music: `<svg xmlns="http://www.w3.org/2000/svg" width="${this.size}" height="${this.size}" viewBox="0 0 24 24" fill="none" stroke="${this.fill}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
          book: `<svg xmlns="http://www.w3.org/2000/svg" width="${this.size}" height="${this.size}" viewBox="0 0 24 24" fill="none" stroke="${this.fill}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
          "gamepad-2": `<svg xmlns="http://www.w3.org/2000/svg" width="${this.size}" height="${this.size}" viewBox="0 0 24 24" fill="none" stroke="${this.fill}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="11" x2="10" y2="11"/><line x1="8" y1="9" x2="8" y2="13"/><line x1="15" y1="12" x2="15.01" y2="12"/><line x1="18" y1="10" x2="18.01" y2="10"/><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"/></svg>`,
          grid: `<svg xmlns="http://www.w3.org/2000/svg" width="${this.size}" height="${this.size}" viewBox="0 0 24 24" fill="none" stroke="${this.fill}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
          wrench: `<svg xmlns="http://www.w3.org/2000/svg" width="${this.size}" height="${this.size}" viewBox="0 0 24 24" fill="none" stroke="${this.fill}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
          "arrow-up-right": `<svg xmlns="http://www.w3.org/2000/svg" width="${this.size}" height="${this.size}" viewBox="0 0 24 24" fill="none" stroke="${this.fill}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7,7 17,7 17,17"/></svg>`,
          "home-heart": `<svg xmlns="http://www.w3.org/2000/svg" width="${this.size}" height="${this.size}" viewBox="0 0 24 24" fill="none" stroke="${this.fill}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M16 13.5c0-1.5-1-2.5-2.5-2.5S11 12 11 13.5c0 1 .5 2 1 2.5l1.5 1.5 1.5-1.5c.5-.5 1-1.5 1-2.5z"/></svg>`,
          "message-square-heart": `<svg xmlns="http://www.w3.org/2000/svg" width="${this.size}" height="${this.size}" viewBox="0 0 24 24" fill="none" stroke="${this.fill}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M14.8 9c-.2-.7-.8-1-1.3-1s-1.1.3-1.3 1c-.2-.7-.8-1-1.3-1s-1.1.3-1.3 1a2 2 0 0 0 1.3 1.8L12 12l1.1-1.2A2 2 0 0 0 14.8 9z"/></svg>`,
        }[e];
      },
      getFallbackIcon() {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="${this.size}" height="${this.size}" viewBox="0 0 24 24" fill="none" stroke="${this.fill}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`;
      },
    },
  },
  Hu = ["innerHTML"];
function ju(e, t, s, n, i, r) {
  return (
    I(),
    j(
      "span",
      {
        class: "lucide-icon",
        style: as({
          width: r.size + "px",
          height: r.size + "px",
          color: s.fill,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        }),
        innerHTML: r.iconSvg,
      },
      null,
      12,
      Hu
    )
  );
}
const dt = rt(Bu, [
  ["render", ju],
  ["__scopeId", "data-v-802a1489"],
]);
const qu = {
    name: "Elements",
    components: { LucideIcon: dt },
    props: {
      componentType: {
        type: String,
        required: !0,
        validator: (e) =>
          ["button", "spinner", "rating", "message"].includes(e),
      },
      variant: { type: String, default: "primary" },
      size: { type: String, default: "md" },
      disabled: { type: Boolean, default: !1 },
      loading: { type: Boolean, default: !1 },
      icon: { type: String, default: null },
      type: { type: String, default: "button" },
      block: { type: Boolean, default: !1 },
      color: { type: String, default: "primary" },
      centered: { type: Boolean, default: !1 },
      loadingText: { type: String, default: "로딩 중입니다..." },
      value: { type: Number, default: 0 },
      maxRating: { type: Number, default: 5 },
      showText: { type: Boolean, default: !1 },
      message: { type: Object, default: () => ({}) },
      messageType: { type: String, default: "user" },
      content: { type: [String, Number], default: "" },
      loadingMessage: { type: String, default: "응답을 생성하고 있습니다" },
      isError: { type: Boolean, default: !1 },
      showCopy: { type: Boolean, default: !0 },
      copyStatus: { type: String, default: null },
      timestamp: { type: [Number, String, Date], default: null },
      currentLanguage: { type: String, default: "ko" },
    },
    data() {
      return {
        hoverRating: 0,
        localCopyStatus: null,
        dotCount: 0,
        dotInterval: null,
        messageInterval: null,
        currentLoadingMessage: "",
        selectedRating: 0,
      };
    },
    computed: {
      buttonClasses() {
        return [
          "btn-system",
          `btn-system--${this.variant}`,
          `btn-system--${this.size}`,
          {
            "btn-system--block": this.block,
            "btn-system--loading": this.loading,
            "btn-system--icon-only": this.icon && !this.$slots.default,
          },
        ];
      },
      spinnerClasses() {
        return [
          "loading-spinner",
          `loading-spinner--${this.size}`,
          `loading-spinner--${this.color}`,
          { "loading-spinner--centered": this.centered },
        ];
      },
      messageClasses() {
        var t, s;
        return [
          "message-bubble",
          `message-bubble--${
            ((t = this.message) == null ? void 0 : t.type) || this.messageType
          }`,
          {
            "message-bubble--loading": this.isCurrentlyLoading,
            "message-bubble--error":
              ((s = this.message) == null ? void 0 : s.isError) || this.isError,
          },
        ];
      },
      iconSize() {
        return { sm: 12, md: 14, lg: 16 }[this.size] || 14;
      },
      starIconSize() {
        return { sm: 16, md: 18, lg: 20 }[this.size] || 18;
      },
      currentRating() {
        return this.hoverRating || this.selectedRating || this.value;
      },
      formattedContent() {
        var s;
        const e =
            ((s = this.message) == null ? void 0 : s.content) ||
            this.content ||
            "",
          t = String(e);
        return re.formatContentForDisplay(t);
      },
      effectiveTimestamp() {
        var e;
        return (
          ((e = this.message) == null ? void 0 : e.timestamp) || this.timestamp
        );
      },
      effectiveMessageType() {
        var e;
        return (
          ((e = this.message) == null ? void 0 : e.type) || this.messageType
        );
      },
      effectiveCopyStatus() {
        return this.localCopyStatus || this.copyStatus;
      },
      dynamicLoadingMessage() {
        const e = ".".repeat(this.dotCount === 0 ? 1 : this.dotCount);
        return (
          (this.currentLoadingMessage || this.getRandomLoadingMessage()) + e
        );
      },
      isCurrentlyLoading() {
        var e;
        return (
          this.loading ||
          ((e = this.message) == null ? void 0 : e.isLoading) ||
          !1
        );
      },
    },
    methods: {
      handleClick(e) {
        !this.disabled && !this.loading && this.$emit("click", e);
      },
      selectRating(e) {
        this.disabled ||
          ((this.selectedRating = e),
          this.$emit("input", e),
          this.$emit("change", e));
      },
      getStarClasses(e) {
        return [
          "star-rating__star",
          "btn-system",
          "btn-system--ghost",
          "btn-system--sm",
          "btn-system--icon-only",
          {
            "star-rating__star--active": e <= this.currentRating,
            "star-rating__star--disabled": this.disabled,
          },
        ];
      },
      getStarFill(e) {
        return e <= this.currentRating ? "#F59E0B" : "none";
      },
      handleCopy() {
        this.localCopyStatus = "copied";
        const e = this.message || {
          content: this.content,
          id: Date.now(),
          type: this.messageType,
        };
        this.$emit("copy-message", e),
          setTimeout(() => {
            this.localCopyStatus = null;
          }, 2e3);
      },
      formatTimestamp(e) {
        if (!e) return "";
        const t = new Date(e),
          n = new Date() - t;
        return n < 6e3
          ? "방금 전"
          : n < 36e5
          ? `${Math.floor(n / 6e4)}분 전`
          : n < 864e5
          ? `${Math.floor(n / 36e5)}시간 전`
          : t.toLocaleDateString("ko-KR", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });
      },
      startDotAnimation() {
        (this.dotCount = 0),
          (this.currentLoadingMessage = this.getRandomLoadingMessage()),
          (this.dotInterval = setInterval(() => {
            this.dotCount = (this.dotCount + 1) % 6;
          }, 300)),
          (this.messageInterval = setInterval(() => {
            this.currentLoadingMessage = this.getRandomLoadingMessage();
          }, 1500));
      },
      stopDotAnimation() {
        this.dotInterval &&
          (clearInterval(this.dotInterval), (this.dotInterval = null)),
          this.messageInterval &&
            (clearInterval(this.messageInterval),
            (this.messageInterval = null));
      },
      getRandomLoadingMessage() {
        const e = zo(this.currentLanguage, "loadingMessages");
        if (e && e.length > 0) {
          const t = Math.floor(Math.random() * e.length);
          return e[t];
        }
        return this.currentLanguage === "ko"
          ? "응답을 생성하고 있습니다"
          : "Generating response";
      },
    },
    watch: {
      isCurrentlyLoading(e) {
        e ? this.startDotAnimation() : this.stopDotAnimation();
      },
      value(e) {
        this.selectedRating = e;
      },
    },
    mounted() {
      this.isCurrentlyLoading && this.startDotAnimation(),
        (this.selectedRating = this.value);
    },
    beforeDestroy() {
      this.stopDotAnimation(), (this.currentLoadingMessage = "");
    },
  },
  Uu = { key: 2, class: "ai-chatops-button__text" },
  Qu = { class: "sr-only" },
  Vu = { key: 2, class: "star-rating" },
  Wu = { class: "star-rating__stars" },
  Ku = ["onClick", "onMouseenter", "onFocus", "disabled"],
  Ju = { key: 0, class: "message-bubble__loading" },
  Gu = { class: "loading-text" },
  Zu = { key: 0, class: "user-message-brand" },
  Yu = { key: 0, class: "message-timestamp" },
  Xu = { class: "user-badge" },
  ed = { key: 1, class: "bot-message-brand" },
  td = { class: "bot-badge" },
  sd = { key: 0, class: "message-timestamp" },
  nd = ["innerHTML"],
  id = { key: 2, class: "message-bubble__actions" };
function rd(e, t, s, n, i, r) {
  const o = ue("Elements", !0),
    a = ue("LucideIcon");
  return (
    I(),
    j("div", null, [
      s.componentType === "button"
        ? (I(),
          Ce(
            qa("button"),
            {
              key: 0,
              class: oe(r.buttonClasses),
              disabled: s.disabled || s.loading,
              type: s.type,
              onClick: r.handleClick,
            },
            {
              default: Mt(() => [
                s.loading
                  ? (I(),
                    Ce(
                      o,
                      {
                        key: 0,
                        "component-type": "spinner",
                        size: s.size,
                        class: "ai-chatops-button__spinner",
                      },
                      null,
                      8,
                      ["size"]
                    ))
                  : te("", !0),
                s.icon && !s.loading
                  ? (I(),
                    Ce(
                      a,
                      {
                        key: 1,
                        name: s.icon,
                        fill: "currentColor",
                        width: r.iconSize,
                        height: r.iconSize,
                        class: "ai-chatops-button__icon",
                      },
                      null,
                      8,
                      ["name", "width", "height"]
                    ))
                  : te("", !0),
                e.$slots.default
                  ? (I(),
                    j("span", Uu, [Ua(e.$slots, "default", {}, void 0, !0)]))
                  : te("", !0),
              ]),
              _: 3,
            },
            8,
            ["class", "disabled", "type", "onClick"]
          ))
        : te("", !0),
      s.componentType === "spinner"
        ? (I(),
          j(
            "div",
            { key: 1, class: oe(r.spinnerClasses), role: "status" },
            [m("span", Qu, z(s.loadingText), 1)],
            2
          ))
        : te("", !0),
      s.componentType === "rating"
        ? (I(),
          j("div", Vu, [
            m("div", Wu, [
              (I(!0),
              j(
                le,
                null,
                ns(
                  s.maxRating,
                  (l) => (
                    I(),
                    j(
                      "button",
                      {
                        key: l,
                        class: oe(r.getStarClasses(l)),
                        onClick: (d) => r.selectRating(l),
                        onMouseenter: (d) => (i.hoverRating = l),
                        onMouseleave:
                          t[0] || (t[0] = (d) => (i.hoverRating = 0)),
                        onFocus: (d) => (i.hoverRating = l),
                        onBlur: t[1] || (t[1] = (d) => (i.hoverRating = 0)),
                        disabled: s.disabled,
                        type: "button",
                      },
                      [
                        $(
                          a,
                          {
                            name: "star",
                            fill: r.getStarFill(l),
                            width: r.starIconSize,
                            height: r.starIconSize,
                          },
                          null,
                          8,
                          ["fill", "width", "height"]
                        ),
                      ],
                      42,
                      Ku
                    )
                  )
                ),
                128
              )),
            ]),
          ]))
        : te("", !0),
      s.componentType === "message"
        ? (I(),
          j(
            "div",
            { key: 3, class: oe(["message", `message--${s.messageType}`]) },
            [
              m(
                "div",
                { class: oe(r.messageClasses) },
                [
                  r.isCurrentlyLoading
                    ? (I(),
                      j("div", Ju, [
                        m("div", Gu, z(r.dynamicLoadingMessage), 1),
                      ]))
                    : (I(),
                      j(
                        le,
                        { key: 1 },
                        [
                          r.effectiveMessageType === "user"
                            ? (I(),
                              j("div", Zu, [
                                s.timestamp
                                  ? (I(),
                                    j(
                                      "div",
                                      Yu,
                                      z(r.formatTimestamp(s.timestamp)),
                                      1
                                    ))
                                  : te("", !0),
                                m("div", Xu, [
                                  $(a, {
                                    name: "user",
                                    fill: "currentColor",
                                    width: 14,
                                    height: 14,
                                  }),
                                  t[3] || (t[3] = m("span", null, "USER", -1)),
                                ]),
                              ]))
                            : te("", !0),
                          r.effectiveMessageType === "ai"
                            ? (I(),
                              j("div", ed, [
                                m("div", td, [
                                  $(a, {
                                    name: "robot",
                                    fill: "currentColor",
                                    width: 14,
                                    height: 14,
                                  }),
                                  t[4] || (t[4] = m("span", null, "Bot", -1)),
                                ]),
                                s.timestamp
                                  ? (I(),
                                    j(
                                      "div",
                                      sd,
                                      z(r.formatTimestamp(s.timestamp)),
                                      1
                                    ))
                                  : te("", !0),
                              ]))
                            : te("", !0),
                          m(
                            "div",
                            {
                              class: "message-bubble__content",
                              innerHTML: r.formattedContent,
                            },
                            null,
                            8,
                            nd
                          ),
                          r.effectiveMessageType === "ai" &&
                          !s.isError &&
                          !r.isCurrentlyLoading
                            ? (I(),
                              j("div", id, [
                                s.showCopy
                                  ? (I(),
                                    j(
                                      "button",
                                      {
                                        key: 0,
                                        class: oe([
                                          "message-action",
                                          "message-action--copy",
                                          "btn-system",
                                          "btn-system--ghost",
                                          "btn-system--sm",
                                          "btn-system--icon-only",
                                          {
                                            "message-action--copied":
                                              r.effectiveCopyStatus ===
                                              "copied",
                                          },
                                        ]),
                                        onClick:
                                          t[2] ||
                                          (t[2] = (...l) =>
                                            r.handleCopy && r.handleCopy(...l)),
                                      },
                                      [
                                        $(
                                          a,
                                          {
                                            name:
                                              r.effectiveCopyStatus === "copied"
                                                ? "check"
                                                : "copy",
                                            fill: "currentColor",
                                            width: 12,
                                            height: 12,
                                          },
                                          null,
                                          8,
                                          ["name"]
                                        ),
                                      ],
                                      2
                                    ))
                                  : te("", !0),
                              ]))
                            : te("", !0),
                        ],
                        64
                      )),
                ],
                2
              ),
            ],
            2
          ))
        : te("", !0),
    ])
  );
}
const tn = rt(qu, [
  ["render", rd],
  ["__scopeId", "data-v-59d2227e"],
]);
const od = {
    name: "ChatTab",
    components: { LucideIcon: dt, Elements: tn },
    props: {
      selectedPersona: { type: Object, default: null },
      isProcessing: { type: Boolean, default: !1 },
      currentLanguage: { type: String, default: "ko" },
      windowSize: {
        type: Object,
        default: () => ({ width: 455, height: 676 }),
      },
      selectedCategory: { type: String, default: null },
    },
    data() {
      return {
        currentMessage: "",
        messages: [],
        loadingHistory: !1,
        loadingMessageId: null,
        showQuickQuestions: !1,
        quickQuestions: [],
        continuousChatEnabled: !0,
        isQuickQuestionsLoading: !1,
        isInitialLoad: !1,
        maxSessionMessages: 30,
        memoryUsage: { used: 0, total: 0 },
        memoryMonitorInterval: null,
        isDevelopment: !0,
        showDevInfo: !1,
        debugMode: !0,
        renderingStates: [],
        lastApiCall: null,
        pendingMessages: [],
        renderingScheduled: !1,
        batchUpdateTimeout: null,
        enhancedInputManager: {
          minHeight: 38,
          maxHeight: 400,
          scrollThreshold: 300,
          currentState: { isExpanded: !1, hasScrolled: !1, lineCount: 1 },
        },
      };
    },
    computed: {
      canSendMessage() {
        return (
          this.currentMessage.length > 0 &&
          !this.isProcessing &&
          this.selectedPersona
        );
      },
      recentConversations() {
        var t, s;
        if (!this.continuousChatEnabled) return [];
        const e = [];
        for (let n = 0; n < this.messages.length - 1; n += 2)
          ((t = this.messages[n]) == null ? void 0 : t.type) === "user" &&
            ((s = this.messages[n + 1]) == null ? void 0 : s.type) === "ai" &&
            e.push({
              question: this.messages[n].content,
              answer: this.messages[n + 1].content,
            });
        return e.slice(-5);
      },
      messagesClasses() {
        return {
          "smooth-scroll":
            !this.loadingHistory &&
            !this.isInitialLoad &&
            !this.renderingScheduled,
          "initial-loading": this.loadingHistory,
        };
      },
      isExpanded() {
        return this.windowSize
          ? this.windowSize.width > 600 || this.windowSize.height > 800
          : !1;
      },
    },
    watch: {
      currentLanguage() {
        this.$nextTick(() => {
          this.trackInputChanges();
        });
      },
      isProcessing(e, t) {
        e || this.stopLoadingMessages(), e && (this.showQuickQuestions = !1);
      },
      selectedPersona: {
        handler(e, t) {
          e ? this.loadPersonaHistory() : (this.messages = []);
        },
        immediate: !0,
      },
    },
    methods: {
      getText: hi,
      getPersonaIconName(e) {
        return e
          ? re.getPersonaIcon(e.personaCode, e.iconPath)
          : "message-square-heart";
      },
      getPersonaWelcomeMessage(e) {
        return !e || !e.welcomeMsg ? null : e.welcomeMsg;
      },
      formatWelcomeMessage(e) {
        return e ? re.formatContentForDisplay(e) : "";
      },
      getPersonaDescription(e) {
        return e
          ? this.currentLanguage === "en" && e.descriptionEn
            ? e.descriptionEn
            : e.description || this.getText("defaultPersonaDesc")
          : "";
      },
      getPersonaDisplayName(e) {
        return (e && (e.title || e.personaName || e.personaCode)) || "";
      },
      generateUniqueId() {
        return typeof crypto < "u" && crypto.randomUUID
          ? crypto.randomUUID()
          : "id-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9);
      },
      getSessionId() {
        return "session-" + Date.now();
      },
      async loadPersonaHistory() {
        var e;
        if ((e = this.selectedPersona) != null && e.personaCode) {
          (this.loadingHistory = !0), (this.isInitialLoad = !0);
          try {
            const t = await re.getConversations(
              this.selectedPersona.personaCode
            );
            if (t.success && t.data && Array.isArray(t.data)) {
              (this.messages = []), (this.pendingMessages = []);
              const s = t.data.map((i) => ({
                  ...i,
                  userQuery: i.userQuery,
                  conversationId: i.conversationId || i.id || Date.now(),
                })),
                n = re.convertConversationsToMessages(s);
              n.length > 0
                ? ((this.messages = n),
                  this.$nextTick(() => {
                    this.setInitialScrollPosition();
                  }))
                : this.checkManualPersonaAutoQuery();
            } else this.checkManualPersonaAutoQuery();
          } catch (t) {
            console.error("❌ [ChatTab] 페르소나 히스토리 로드 실패:", t),
              this.addErrorMessage(
                "히스토리를 불러오는 중 오류가 발생했습니다."
              ),
              this.checkManualPersonaAutoQuery();
          } finally {
            (this.loadingHistory = !1), (this.isInitialLoad = !1);
          }
        }
      },
      measureMemoryUsage() {
        if (performance.memory) {
          const e = performance.memory;
          this.memoryUsage = {
            used: Math.round(e.usedJSHeapSize / 1024 / 1024),
            total: Math.round(e.totalJSHeapSize / 1024 / 1024),
          };
        }
      },
      startMemoryMonitoring() {
        performance.memory &&
          ((this.memoryMonitorInterval = setInterval(() => {
            this.measureMemoryUsage();
          }, 3e4)),
          this.measureMemoryUsage());
      },
      stopMemoryMonitoring() {
        this.memoryMonitorInterval &&
          (clearInterval(this.memoryMonitorInterval),
          (this.memoryMonitorInterval = null));
      },
      adjustTextareaHeight() {
        const e = this.$refs.messageInput;
        if (!e) return;
        const t = this.enhancedInputManager;
        e.style.height = "auto";
        const s = Math.min(Math.max(e.scrollHeight, t.minHeight), t.maxHeight);
        e.style.height = s + "px";
        const n = Math.ceil(s / 24);
        (t.currentState.lineCount = n),
          (t.currentState.isExpanded = s > t.minHeight + 20),
          (t.currentState.hasScrolled = e.scrollHeight > t.maxHeight),
          this.updateInputContainerClasses();
      },
      updateInputContainerClasses() {
        var s;
        const e =
          (s = this.$refs.messageInput) == null
            ? void 0
            : s.closest(".input-container");
        if (!e) return;
        const t = this.enhancedInputManager;
        t.currentState.isExpanded
          ? e.classList.add("enhanced-input--expanded")
          : e.classList.remove("enhanced-input--expanded"),
          t.currentState.hasScrolled
            ? e.classList.add("enhanced-input--scrolling")
            : e.classList.remove("enhanced-input--scrolling");
      },
      applyInputVisualFeedback() {
        var t;
        const e =
          (t = this.$refs.messageInput) == null
            ? void 0
            : t.closest(".input-container");
        e &&
          (e.classList.add("enhanced-input--focused"),
          setTimeout(() => {
            e.classList.remove("enhanced-input--focused");
          }, 150));
      },
      handleKeyDown(e) {
        if (e.key === "Enter") {
          if (e.shiftKey) return;
          e.preventDefault(), this.canSendMessage && this.sendMessage();
          return;
        }
        if (e.ctrlKey && e.key === "Enter") {
          e.preventDefault(), this.canSendMessage && this.sendMessage();
          return;
        }
        e.ctrlKey && e.key;
      },
      handleInput() {
        this.trackInputChanges();
      },
      handleFocus() {
        this.applyInputVisualFeedback();
      },
      trackInputChanges() {
        this.adjustTextareaHeight();
      },
      toggleContinuousChat() {
        this.continuousChatEnabled = !this.continuousChatEnabled;
      },
      async sendMessage() {
        if (!this.canSendMessage || !this.selectedPersona) return;
        const e = this.currentMessage,
          t = re.htmlToPlainText(e),
          s = {
            id: `user-${this.generateUniqueId()}`,
            type: "user",
            content: e,
            timestamp: new Date(),
            isLoading: !1,
          };
        this.addMessageWithLimit(s),
          (this.currentMessage = ""),
          this.$nextTick(() => {
            const i = this.$refs.messageInput;
            i &&
              ((i.style.height = this.enhancedInputManager.minHeight + "px"),
              i.classList.remove("enhanced-input--scrolling"),
              (this.enhancedInputManager.currentState.hasScrolled = !1),
              this.applyInputVisualFeedback());
          }),
          this.startLoadingMessages();
        let n = null;
        this.continuousChatEnabled &&
          this.recentConversations.length > 0 &&
          (n = this.recentConversations.map((i) => ({
            question: re.htmlToPlainText(i.question),
            answer: re.htmlToPlainText(i.answer),
          })));
        try {
          const i = {
            personaCode: this.selectedPersona.personaCode,
            userQuery: t,
            sessionId: this.getSessionId(),
            currentLanguage: this.currentLanguage,
          };
          n && (i.queryHistory = n),
            (this.lastApiCall = {
              timestamp: new Date(),
              data: i,
              status: "sent",
            }),
            this.$emit("message-sent", i);
        } catch (i) {
          console.error("❌ [ChatTab] 메시지 전송 오류:", i),
            (this.lastApiCall = {
              timestamp: new Date(),
              error: i,
              status: "failed",
            }),
            this.addAiResponse({
              success: !1,
              message: "메시지 전송 중 오류가 발생했습니다.",
            });
        }
      },
      sendQuickQuestion(e) {
        (this.currentMessage = e),
          (this.showQuickQuestions = !1),
          (this.quickQuestions = []),
          this.$nextTick(() => {
            this.sendMessage();
          });
      },
      addAiResponse(e) {
        if (this.loadingMessageId) {
          const s = this.messages.findIndex(
            (n) => n.id === this.loadingMessageId
          );
          s !== -1 && this.messages.splice(s, 1),
            (this.loadingMessageId = null);
        }
        this.stopLoadingMessages();
        let t;
        if (e.success) {
          const s = re.extractAIResponse(e);
          t = {
            id: `ai-${this.generateUniqueId()}`,
            type: "ai",
            content: s,
            timestamp: new Date(),
            isLoading: !1,
            conversationId: re.extractConversationId(e),
          };
        } else {
          const s = e.message || e.errorMessage || this.getText("aiError");
          t = {
            id: `error-${this.generateUniqueId()}`,
            type: "ai",
            content: s,
            timestamp: new Date(),
            isError: !0,
            isLoading: !1,
          };
        }
        this.addMessageWithLimit(t),
          this.lastApiCall &&
            ((this.lastApiCall.status = "completed"),
            (this.lastApiCall.response = e));
      },
      addErrorMessage(e) {
        const t = {
          id: `error-${this.generateUniqueId()}`,
          type: "ai",
          content: e,
          timestamp: new Date(),
          isError: !0,
          isLoading: !1,
        };
        this.addMessageWithLimit(t);
      },
      async generateQuickQuestions() {
        if (!(this.isQuickQuestionsLoading || this.isProcessing)) {
          this.isQuickQuestionsLoading = !0;
          try {
            const e = {
                personaCode: this.selectedPersona.personaCode,
                currentLanguage: this.currentLanguage,
              },
              t = await re.generateQuickQuestions(e);
            if (t.success) {
              const s = re.extractQuickQuestions(t);
              this.displayQuickQuestionsResponse(s);
            } else throw new Error(t.message || t.errorMessage);
          } catch (e) {
            console.error("빠른 질문 생성 오류:", e),
              (this.quickQuestions = this.getDefaultQuickQuestions()),
              (this.showQuickQuestions = !0);
          } finally {
            this.isQuickQuestionsLoading = !1;
          }
        }
      },
      getLoadingMessage() {
        const e = zo(this.currentLanguage, "loadingMessages");
        if (e && e.length > 0) {
          const t = Math.floor(Math.random() * e.length);
          return e[t];
        }
        return this.currentLanguage === "ko"
          ? "응답을 생성하고 있습니다..."
          : "Generating response...";
      },
      displayQuickQuestionsResponse(e) {
        try {
          let t = [];
          if (typeof e == "string") {
            const s = e.match(/\[.*\]/);
            s
              ? (t = JSON.parse(s[0]))
              : (t = e
                  .split(
                    `
`
                  )
                  .filter((n) => n.trim())
                  .map((n) => n.replace(/^[-\*\xE2\x80\xA2]\s*/, "").trim())
                  .slice(0, 5));
          } else
            Array.isArray(e)
              ? (t = e.slice(0, 5))
              : e &&
                typeof e == "object" &&
                ((t = e.questions || e.data || []),
                typeof t == "string" && (t = [t]));
          if (((t = t.filter((s) => s && s.trim()).slice(0, 5)), t.length > 0))
            (this.quickQuestions = t), (this.showQuickQuestions = !0);
          else throw new Error("빠른 질문 목록이 비어있습니다.");
        } catch (t) {
          console.error("빠른 질문 답변 처리 오류:", t),
            (this.quickQuestions = this.getDefaultQuickQuestions()),
            (this.showQuickQuestions = !0);
        }
      },
      getDefaultQuickQuestions() {
        return ["당신은 무엇을 잘 합니까?"];
      },
      startLoadingMessages() {
        if (this.loadingMessageId) return;
        const e = {
          id: `loading-${this.generateUniqueId()}`,
          type: "ai",
          content: "",
          timestamp: new Date(),
          isLoading: !0,
        };
        this.addMessageWithLimit(e), (this.loadingMessageId = e.id);
      },
      stopLoadingMessages() {
        this.loadingMessageId = null;
      },
      addMessageWithLimit(e) {
        this.pendingMessages.push(e), this.scheduleBatchUpdate();
      },
      scheduleBatchUpdate() {
        this.renderingScheduled ||
          ((this.renderingScheduled = !0),
          this.$nextTick(() => {
            this.processBatchMessages(), (this.renderingScheduled = !1);
          }));
      },
      processBatchMessages() {
        if (this.pendingMessages.length !== 0) {
          if (
            (this.messages.push(...this.pendingMessages),
            this.messages.length > this.maxSessionMessages)
          ) {
            const e = this.messages.length - this.maxSessionMessages,
              t = Math.ceil(e / 2) * 2;
            this.messages.splice(0, t);
          }
          (this.pendingMessages = []),
            this.$nextTick(() => {
              this.scrollToBottomSmooth();
            });
        }
      },
      scrollToBottomInstantly() {
        this.$nextTick(() => {
          const e = this.$refs.messagesContainer;
          e && e.scrollTo({ top: e.scrollHeight, behavior: "auto" });
        });
      },
      scrollToBottomSmooth() {
        if (this.renderingScheduled) {
          this.$nextTick(() => {
            this.scrollToBottomSmooth();
          });
          return;
        }
        this.$nextTick(() => {
          const e = this.$refs.messagesContainer;
          e && e.scrollTo({ top: e.scrollHeight, behavior: "smooth" });
        });
      },
      setInitialScrollPosition() {
        this.$nextTick(() => {
          const e = this.$refs.messagesContainer;
          e &&
            ((e.style.scrollBehavior = "auto"),
            (e.scrollTop = e.scrollHeight),
            setTimeout(() => {
              e.style.scrollBehavior = "smooth";
            }, 100));
        });
      },
      async handleCopyMessage(e) {
        try {
          const t = re.getContentForCopy(e.content);
          await navigator.clipboard.writeText(t);
        } catch (t) {
          console.error("클립보드 복사 실패:", t);
        }
      },
      handleRegenerateMessage(e) {
        if (e.type === "ai" && this.messages.length >= 2) {
          for (let t = this.messages.length - 1; t >= 0; t--)
            if (this.messages[t].type === "user") {
              (this.currentMessage = this.messages[t].content),
                this.sendMessage();
              break;
            }
        }
      },
      handleFeedbackMessage(e) {
        this.$emit("show-feedback", { messageId: e.id, content: e.content });
      },
      handleClickOutside(e) {
        if (this.showQuickQuestions) {
          const t = this.$refs.quickQuestionsDropdown,
            s = this.$refs.inputArea;
          if (e.target.closest(".quick-questions-generate-btn")) return;
          t &&
            !t.contains(e.target) &&
            s &&
            !s.contains(e.target) &&
            (this.showQuickQuestions = !1);
        }
      },
      clearChatHistory() {
        !this.selectedPersona ||
          !confirm(`${this.selectedPersona.title}의 모든 대화 내역을 삭제하시겠습니까?

삭제된 대화는 복구할 수 없습니다.`) ||
          re
            .deleteConversations(this.selectedPersona.personaCode)
            .then((t) => {
              t.success &&
                (Object.assign(this, {
                  messages: [],
                  currentMessage: "",
                  showQuickQuestions: !1,
                  continuousChatEnabled: !1,
                  pendingMessages: [],
                  renderingScheduled: !1,
                }),
                this.stopLoadingMessages(),
                this.$nextTick(() => {
                  const s = this.$refs.messageInput;
                  s &&
                    ((s.style.height = `${this.enhancedInputManager.minHeight}px`),
                    this.applyInputVisualFeedback());
                }));
            })
            .catch((t) => {
              console.log("Error clearing messages:", t);
            });
      },
      resetToInitialState() {
        this.stopLoadingMessages(),
          this.stopMemoryMonitoring(),
          Object.assign(this, {
            currentMessage: "",
            messages: [],
            loadingHistory: !1,
            loadingMessageId: null,
            showQuickQuestions: !1,
            quickQuestions: [],
            continuousChatEnabled: !0,
            isQuickQuestionsLoading: !1,
            isInitialLoad: !1,
            pendingMessages: [],
            renderingScheduled: !1,
          }),
          (this.enhancedInputManager.currentState = {
            isExpanded: !1,
            hasScrolled: !1,
            lineCount: 1,
          });
      },
      checkManualPersonaAutoQuery() {
        var e;
        ((e = this.selectedPersona) == null ? void 0 : e.personaCode) ===
          "chatbot_manual" &&
          this.messages.length === 0 &&
          this.$nextTick(() => {
            (this.currentMessage = "전체 메뉴얼"), this.sendMessage();
          });
      },
      handleMessageContainerClick(e) {
        const t = e.target.closest(".copy-code-btn");
        if (t) {
          const s = t.closest(".markdown-code-block").querySelector("pre");
          s &&
            navigator.clipboard.writeText(s.innerText).then(() => {
              (t.textContent = "Copied!"),
                t.classList.add("copied"),
                setTimeout(() => {
                  (t.textContent = "Copy"), t.classList.remove("copied");
                }, 2e3);
            });
        }
      },
    },
    mounted() {
      this.$nextTick(() => {
        const e = this.$refs.messageInput;
        e &&
          ((e.style.height = `${this.enhancedInputManager.minHeight}px`),
          this.applyInputVisualFeedback());
        const t = this.$refs.messagesContainer;
        t && t.addEventListener("click", this.handleMessageContainerClick);
      }),
        this.startMemoryMonitoring(),
        document.addEventListener("click", this.handleClickOutside);
    },
    beforeDestroy() {
      const e = this.$refs.messagesContainer;
      e && e.removeEventListener("click", this.handleMessageContainerClick),
        this.stopLoadingMessages(),
        this.stopMemoryMonitoring(),
        this.batchUpdateTimeout &&
          (clearTimeout(this.batchUpdateTimeout),
          (this.batchUpdateTimeout = null)),
        document.removeEventListener("click", this.handleClickOutside),
        Object.assign(this, {
          messages: [],
          currentMessage: "",
          pendingMessages: [],
          renderingScheduled: !1,
          loadingMessageId: null,
          memoryMonitorInterval: null,
        });
    },
  },
  ad = { class: "chat-tab" },
  ld = { key: 0, class: "no-persona-selected" },
  cd = { class: "persona-selection-guide" },
  ud = { class: "guide-icon" },
  dd = { class: "guide-title" },
  hd = { class: "guide-description" },
  fd = { key: 1, class: "chat-interface" },
  gd = { class: "chat-header" },
  pd = { class: "persona-info" },
  md = { class: "dev-info-content" },
  yd = { class: "dev-info-item" },
  wd = { class: "dev-value" },
  bd = { class: "dev-info-item" },
  vd = { class: "dev-value" },
  Cd = { class: "dev-info-item" },
  _d = { class: "dev-info-item" },
  kd = { class: "header-actions" },
  xd = { key: 0, class: "loading-history" },
  Sd = { class: "loading-text" },
  Td = { key: 1, class: "welcome-section" },
  Md = { class: "welcome-content" },
  Ed = { class: "welcome-header" },
  Ad = { class: "welcome-title" },
  Pd = ["innerHTML"],
  Id = { key: 1, class: "welcome-description" },
  Rd = { class: "messages-list" },
  Od = { class: "input-area", ref: "inputArea" },
  Ld = {
    key: 0,
    class: "quick-questions-dropdown",
    ref: "quickQuestionsDropdown",
  },
  $d = { class: "quick-questions-list" },
  Dd = ["onClick"],
  zd = { class: "input-container" },
  Fd = { class: "input-box" },
  Nd = ["placeholder", "disabled"],
  Bd = { class: "input-bottom-row" },
  Hd = { class: "left-actions" },
  jd = ["disabled", "title"],
  qd = { key: 0, class: "loading-spinner" },
  Ud = ["disabled", "title"],
  Qd = ["disabled"];
function Vd(e, t, s, n, i, r) {
  const o = ue("LucideIcon"),
    a = ue("Elements");
  return (
    I(),
    j("div", ad, [
      s.selectedPersona
        ? (I(),
          j("div", fd, [
            m("div", gd, [
              m("div", pd, [
                m(
                  "div",
                  {
                    class: "persona-badge",
                    onMouseenter: t[0] || (t[0] = (l) => (i.showDevInfo = !0)),
                    onMouseleave: t[1] || (t[1] = (l) => (i.showDevInfo = !1)),
                  },
                  [
                    $(
                      o,
                      {
                        name: r.getPersonaIconName(s.selectedPersona),
                        fill: "white",
                        width: 16,
                        height: 16,
                      },
                      null,
                      8,
                      ["name"]
                    ),
                    m(
                      "span",
                      null,
                      z(r.getPersonaDisplayName(s.selectedPersona)),
                      1
                    ),
                  ],
                  32
                ),
                i.showDevInfo
                  ? (I(),
                    j(
                      "div",
                      {
                        key: 0,
                        class: "dev-info-tooltip-avatar",
                        onMouseenter:
                          t[2] || (t[2] = (l) => (i.showDevInfo = !0)),
                        onMouseleave:
                          t[3] || (t[3] = (l) => (i.showDevInfo = !1)),
                      },
                      [
                        t[18] ||
                          (t[18] = m(
                            "div",
                            { class: "dev-info-header" },
                            "🔧 Dev Info",
                            -1
                          )),
                        m("div", md, [
                          m("div", yd, [
                            t[14] ||
                              (t[14] = m(
                                "span",
                                { class: "dev-label" },
                                "Messages:",
                                -1
                              )),
                            m(
                              "span",
                              wd,
                              z(i.messages.length) +
                                "/" +
                                z(i.maxSessionMessages),
                              1
                            ),
                          ]),
                          m("div", bd, [
                            t[15] ||
                              (t[15] = m(
                                "span",
                                { class: "dev-label" },
                                "Memory:",
                                -1
                              )),
                            m(
                              "span",
                              vd,
                              z(i.memoryUsage.used) +
                                "MB/" +
                                z(i.memoryUsage.total) +
                                "MB",
                              1
                            ),
                          ]),
                          m("div", Cd, [
                            t[16] ||
                              (t[16] = m(
                                "span",
                                { class: "dev-label" },
                                "Pending:",
                                -1
                              )),
                            m(
                              "span",
                              {
                                class: oe([
                                  "dev-value",
                                  {
                                    "dev-value--active":
                                      i.pendingMessages.length > 0,
                                  },
                                ]),
                              },
                              z(i.pendingMessages.length),
                              3
                            ),
                          ]),
                          m("div", _d, [
                            t[17] ||
                              (t[17] = m(
                                "span",
                                { class: "dev-label" },
                                "Rendering:",
                                -1
                              )),
                            m(
                              "span",
                              {
                                class: oe([
                                  "dev-value",
                                  { "dev-value--active": i.renderingScheduled },
                                ]),
                              },
                              z(i.renderingScheduled ? "Yes" : "No"),
                              3
                            ),
                          ]),
                        ]),
                      ],
                      32
                    ))
                  : te("", !0),
              ]),
              m("div", kd, [
                m(
                  "button",
                  {
                    onClick: t[4] || (t[4] = (l) => e.$emit("go-persona-list")),
                    class:
                      "btn-system btn-system--ghost btn-system--sm btn-system--icon-only",
                    title: "페르소나 변경",
                  },
                  [$(o, { name: "refresh-cw", width: 14, height: 14 })]
                ),
                m(
                  "button",
                  {
                    onClick: t[5] || (t[5] = (l) => e.$emit("go-home")),
                    class:
                      "btn-system btn-system--ghost btn-system--sm btn-system--icon-only",
                    title: "홈으로",
                  },
                  [$(o, { name: "home", width: 14, height: 14 })]
                ),
                m(
                  "button",
                  {
                    onClick:
                      t[6] ||
                      (t[6] = (...l) =>
                        r.clearChatHistory && r.clearChatHistory(...l)),
                    class:
                      "btn-system btn-system--ghost btn-system--sm btn-system--icon-only",
                    title: "메시지 삭제",
                  },
                  [$(o, { name: "trash", width: 14, height: 14 })]
                ),
              ]),
            ]),
            m(
              "div",
              {
                ref: "messagesContainer",
                class: oe(["messages-container", r.messagesClasses]),
              },
              [
                i.loadingHistory
                  ? (I(),
                    j("div", xd, [
                      $(a, {
                        "component-type": "spinner",
                        size: "sm",
                        color: "accent",
                      }),
                      m("span", Sd, z(r.getText("loadingHistory")), 1),
                    ]))
                  : i.messages.length === 0
                  ? (I(),
                    j("div", Td, [
                      m("div", Md, [
                        m("div", Ed, [
                          m(
                            "h2",
                            Ad,
                            z(
                              s.selectedPersona
                                ? r.getPersonaDisplayName(s.selectedPersona)
                                : ""
                            ),
                            1
                          ),
                        ]),
                        r.getPersonaWelcomeMessage(s.selectedPersona)
                          ? (I(),
                            j(
                              "div",
                              {
                                key: 0,
                                class: "welcome-message",
                                innerHTML: r.formatWelcomeMessage(
                                  r.getPersonaWelcomeMessage(s.selectedPersona)
                                ),
                              },
                              null,
                              8,
                              Pd
                            ))
                          : (I(),
                            j("p", Id, z(r.getText("welcomeTip") || ""), 1)),
                      ]),
                    ]))
                  : te("", !0),
                m("div", Rd, [
                  (I(!0),
                  j(
                    le,
                    null,
                    ns(
                      i.messages,
                      (l) => (
                        I(),
                        Ce(
                          a,
                          {
                            key: l.id,
                            "component-type": "message",
                            message: l,
                            title: "복사",
                            persona: s.selectedPersona,
                            "current-language": s.currentLanguage,
                            timestamp: l.timestamp,
                            onCopyMessage: r.handleCopyMessage,
                            onRegenerateMessage: r.handleRegenerateMessage,
                            onFeedbackMessage: r.handleFeedbackMessage,
                          },
                          null,
                          8,
                          [
                            "message",
                            "persona",
                            "current-language",
                            "timestamp",
                            "onCopyMessage",
                            "onRegenerateMessage",
                            "onFeedbackMessage",
                          ]
                        )
                      )
                    ),
                    128
                  )),
                ]),
              ],
              2
            ),
            m(
              "div",
              Od,
              [
                i.showQuickQuestions && i.quickQuestions.length > 0
                  ? (I(),
                    j(
                      "div",
                      Ld,
                      [
                        m("div", $d, [
                          (I(!0),
                          j(
                            le,
                            null,
                            ns(
                              i.quickQuestions,
                              (l, d) => (
                                I(),
                                j(
                                  "div",
                                  {
                                    key: d,
                                    onClick: (c) => r.sendQuickQuestion(l),
                                    class: "quick-question-item",
                                  },
                                  z(l),
                                  9,
                                  Dd
                                )
                              )
                            ),
                            128
                          )),
                        ]),
                      ],
                      512
                    ))
                  : te("", !0),
                m("div", zd, [
                  m("div", Fd, [
                    ut(
                      m(
                        "textarea",
                        {
                          "onUpdate:modelValue":
                            t[7] || (t[7] = (l) => (i.currentMessage = l)),
                          ref: "messageInput",
                          placeholder: r.getText("inputPlaceholder"),
                          onKeydown:
                            t[8] ||
                            (t[8] = (...l) =>
                              r.handleKeyDown && r.handleKeyDown(...l)),
                          onInput:
                            t[9] ||
                            (t[9] = (...l) =>
                              r.handleInput && r.handleInput(...l)),
                          onFocus:
                            t[10] ||
                            (t[10] = (...l) =>
                              r.handleFocus && r.handleFocus(...l)),
                          disabled: s.isProcessing,
                          class: "message-textarea form-input enhanced-input",
                        },
                        null,
                        40,
                        Nd
                      ),
                      [[uo, i.currentMessage]]
                    ),
                    m("div", Bd, [
                      m("div", Hd, [
                        m(
                          "button",
                          {
                            onClick:
                              t[11] ||
                              (t[11] = (...l) =>
                                r.generateQuickQuestions &&
                                r.generateQuickQuestions(...l)),
                            disabled:
                              s.isProcessing || i.isQuickQuestionsLoading,
                            class:
                              "btn-system btn-system--ghost btn-system--sm quick-questions-generate-btn",
                            title:
                              r.getText("generateQuestions") || "질문 생성하기",
                          },
                          [
                            i.isQuickQuestionsLoading
                              ? (I(), j("div", qd))
                              : (I(),
                                Ce(o, {
                                  key: 1,
                                  name: "lightbulb",
                                  width: 12,
                                  height: 12,
                                })),
                          ],
                          8,
                          jd
                        ),
                        m(
                          "button",
                          {
                            onClick:
                              t[12] ||
                              (t[12] = (...l) =>
                                r.toggleContinuousChat &&
                                r.toggleContinuousChat(...l)),
                            disabled: s.isProcessing,
                            class: oe([
                              "btn-system",
                              "btn-system--sm",
                              "continuous-chat-btn",
                              i.continuousChatEnabled
                                ? "btn-system--success"
                                : "btn-system--ghost",
                            ]),
                            title: i.continuousChatEnabled
                              ? "단일 대화로 전환"
                              : "연속 대화로 전환",
                          },
                          [
                            $(
                              o,
                              {
                                name: i.continuousChatEnabled
                                  ? "layers"
                                  : "message-square",
                                width: 12,
                                height: 12,
                              },
                              null,
                              8,
                              ["name"]
                            ),
                          ],
                          10,
                          Ud
                        ),
                      ]),
                      m(
                        "button",
                        {
                          onClick:
                            t[13] ||
                            (t[13] = (...l) =>
                              r.sendMessage && r.sendMessage(...l)),
                          disabled: !r.canSendMessage,
                          class: oe([
                            "btn-system",
                            "btn-system--send",
                            "btn-system--sm",
                            "btn-system--icon-only",
                            "send-button-enhanced",
                            { loading: s.isProcessing },
                          ]),
                          title: "메시지 전송",
                        },
                        [
                          s.isProcessing
                            ? (I(),
                              Ce(a, {
                                key: 0,
                                "component-type": "spinner",
                                size: "sm",
                                color: "accent",
                              }))
                            : (I(),
                              Ce(o, {
                                key: 1,
                                name: "send-horizontal",
                                fill: "currentColor",
                                width: 14,
                                height: 14,
                              })),
                        ],
                        10,
                        Qd
                      ),
                    ]),
                  ]),
                ]),
              ],
              512
            ),
          ]))
        : (I(),
          j("div", ld, [
            m("div", cd, [
              m("div", ud, [
                $(o, {
                  name: "home-heart",
                  fill: "none",
                  stroke: "currentColor",
                  width: 24,
                  height: 24,
                }),
              ]),
              m("h3", dd, z(r.getText("noPersonaSelected")), 1),
              m("p", hd, z(r.getText("noPersonaDesc")), 1),
            ]),
          ])),
    ])
  );
}
const Wd = rt(od, [
  ["render", Vd],
  ["__scopeId", "data-v-1b8150d1"],
]);
const Kd = {
    name: "FeedbackTab",
    components: { Elements: tn, LucideIcon: dt },
    props: {
      currentLanguage: {
        type: String,
        default: "ko",
        validator: (e) => ["ko", "en"].includes(e),
      },
    },
    data() {
      return {
        selectedRating: 0,
        comment: "",
        isSubmitting: !1,
        resultMessage: "",
        resultType: "",
      };
    },
    computed: {
      isFormValid() {
        return this.comment.trim().length > 0;
      },
    },
    methods: {
      getText(e, t = {}) {
        return hi(this.currentLanguage, e, t);
      },
      updateCharCount() {
        this.clearResult();
      },
      clearResult() {
        this.resultMessage &&
          this.resultType === "error" &&
          ((this.resultMessage = ""), (this.resultType = ""));
      },
      submitFeedback() {
        if (!this.isFormValid || this.isSubmitting) return;
        (this.isSubmitting = !0),
          (this.resultMessage = ""),
          (this.resultType = "");
        const e = {
          rating: this.selectedRating || null,
          comment: this.comment.trim(),
        };
        this.$emit("feedback-sent", e);
      },
      showSuccess(e) {
        (this.isSubmitting = !1),
          (this.resultMessage = e || this.getText("feedbackSuccess")),
          (this.resultType = "success");
      },
      showError(e) {
        (this.isSubmitting = !1),
          (this.resultMessage =
            e || "An error occurred while sending feedback."),
          (this.resultType = "error");
      },
      resetForm() {
        (this.selectedRating = 0),
          (this.comment = ""),
          (this.isSubmitting = !1),
          (this.resultMessage = ""),
          (this.resultType = "");
      },
    },
  },
  Jd = { class: "feedback-tab" },
  Gd = { class: "result-content" },
  Zd = { key: 1, class: "result-actions-separate" },
  Yd = { key: 1, class: "feedback-form" },
  Xd = { class: "form-header" },
  eh = { class: "rating-section" },
  th = { class: "section-label" },
  sh = { class: "comment-section" },
  nh = { class: "section-label", for: "feedback-comment" },
  ih = ["placeholder", "disabled"],
  rh = { class: "char-count" },
  oh = { class: "form-actions" };
function ah(e, t, s, n, i, r) {
  const o = ue("LucideIcon"),
    a = ue("Elements");
  return (
    I(),
    j("div", Jd, [
      i.resultMessage
        ? (I(),
          j(
            "div",
            { key: 0, class: oe(["result", i.resultType]) },
            [
              i.resultType === "success"
                ? (I(),
                  j(
                    le,
                    { key: 0 },
                    [
                      $(o, {
                        name: "check-circle",
                        fill: "var(--success-color)",
                        width: 24,
                        height: 24,
                      }),
                      m("div", Gd, [
                        m("h4", null, z(r.getText("feedbackSuccess")), 1),
                        m("p", null, z(i.resultMessage), 1),
                      ]),
                    ],
                    64
                  ))
                : te("", !0),
              i.resultType === "success"
                ? (I(),
                  j("div", Zd, [
                    $(
                      a,
                      {
                        "component-type": "button",
                        onClick: r.resetForm,
                        variant: "primary",
                        icon: "star",
                      },
                      {
                        default: Mt(() => [Ve(z(r.getText("sendAnother")), 1)]),
                        _: 1,
                      },
                      8,
                      ["onClick"]
                    ),
                    $(
                      a,
                      {
                        "component-type": "button",
                        onClick: t[0] || (t[0] = (l) => e.$emit("go-home")),
                        variant: "accent",
                        icon: "home",
                      },
                      {
                        default: Mt(() => [Ve(z(r.getText("goHome")), 1)]),
                        _: 1,
                      }
                    ),
                  ]))
                : te("", !0),
              i.resultType === "error"
                ? (I(),
                  j(
                    le,
                    { key: 2 },
                    [
                      $(o, {
                        name: "alert-triangle",
                        fill: "var(--error-color)",
                        width: 20,
                        height: 20,
                      }),
                      m("span", null, z(i.resultMessage), 1),
                    ],
                    64
                  ))
                : te("", !0),
            ],
            2
          ))
        : te("", !0),
      !i.resultMessage || i.resultType === "error"
        ? (I(),
          j("div", Yd, [
            m("div", Xd, [
              $(o, {
                name: "heart",
                fill: "var(--color-primary)",
                width: 32,
                height: 32,
              }),
              m("h3", null, z(r.getText("feedbackTitle")), 1),
              m("p", null, z(r.getText("feedbackDescription")), 1),
            ]),
            m("div", eh, [
              m("label", th, [
                $(o, {
                  name: "star",
                  fill: "var(--color-primary)",
                  width: 16,
                  height: 16,
                }),
                Ve(" " + z(r.getText("ratingLabel")), 1),
              ]),
              $(
                a,
                {
                  "component-type": "rating",
                  modelValue: i.selectedRating,
                  "onUpdate:modelValue":
                    t[1] || (t[1] = (l) => (i.selectedRating = l)),
                  disabled: i.isSubmitting,
                  "show-text": !0,
                  size: "md",
                  onChange: r.clearResult,
                },
                null,
                8,
                ["modelValue", "disabled", "onChange"]
              ),
            ]),
            m("div", sh, [
              m("label", nh, [
                $(o, {
                  name: "edit",
                  fill: "var(--color-primary)",
                  width: 16,
                  height: 16,
                }),
                Ve(" " + z(r.getText("feedbackComment")) + " ", 1),
                t[5] || (t[5] = m("span", { class: "required" }, "*", -1)),
              ]),
              ut(
                m(
                  "textarea",
                  {
                    id: "feedback-comment",
                    "onUpdate:modelValue":
                      t[2] || (t[2] = (l) => (i.comment = l)),
                    placeholder: r.getText("commentPlaceholder"),
                    maxlength: "1000",
                    onInput:
                      t[3] ||
                      (t[3] = (...l) =>
                        r.updateCharCount && r.updateCharCount(...l)),
                    class: "comment-textarea form-input form-textarea",
                    disabled: i.isSubmitting,
                    required: "",
                  },
                  null,
                  40,
                  ih
                ),
                [[uo, i.comment]]
              ),
              m("div", rh, z(i.comment.length) + " / 1000 ", 1),
            ]),
            m("div", oh, [
              $(
                a,
                {
                  "component-type": "button",
                  onClick: r.submitFeedback,
                  disabled: !r.isFormValid,
                  loading: i.isSubmitting,
                  variant: "primary",
                  icon: "send",
                  size: "lg",
                  block: "",
                  class: "submit-btn",
                },
                {
                  default: Mt(() => [Ve(z(r.getText("submitFeedback")), 1)]),
                  _: 1,
                },
                8,
                ["onClick", "disabled", "loading"]
              ),
              $(
                a,
                {
                  "component-type": "button",
                  onClick: t[4] || (t[4] = (l) => e.$emit("go-home")),
                  variant: "outline",
                  icon: "home",
                  size: "lg",
                  block: "",
                  class: "home-btn",
                },
                { default: Mt(() => [Ve(z(r.getText("goHome")), 1)]), _: 1 }
              ),
            ]),
          ]))
        : te("", !0),
    ])
  );
}
const lh = rt(Kd, [
  ["render", ah],
  ["__scopeId", "data-v-bade2ee3"],
]);
const ch = {
    name: "WindowManager",
    components: { LucideIcon: dt },
    props: {
      windowState: {
        type: String,
        default: "normal",
        validator: (e) => ["normal", "minimized", "maximized"].includes(e),
      },
    },
    emits: ["minimize", "toggle-maximize", "close"],
  },
  uh = { class: "window-controls" };
function dh(e, t, s, n, i, r) {
  const o = ue("LucideIcon");
  return (
    I(),
    j("div", uh, [
      m(
        "button",
        {
          class: "window-control-btn header-btn",
          onClick: t[0] || (t[0] = (a) => e.$emit("minimize")),
        },
        [$(o, { name: "minus", fill: "currentColor", width: 12, height: 12 })]
      ),
      m(
        "button",
        {
          class: "window-control-btn header-btn",
          onClick: t[1] || (t[1] = (a) => e.$emit("toggle-maximize")),
        },
        [
          $(
            o,
            {
              name: s.windowState === "maximized" ? "minimize-2" : "maximize-2",
              fill: "currentColor",
              width: 12,
              height: 12,
            },
            null,
            8,
            ["name"]
          ),
        ]
      ),
      m(
        "button",
        {
          class: "window-control-btn header-btn",
          onClick: t[2] || (t[2] = (a) => e.$emit("close")),
        },
        [$(o, { name: "x", fill: "currentColor", width: 12, height: 12 })]
      ),
    ])
  );
}
const hh = rt(ch, [
  ["render", dh],
  ["__scopeId", "data-v-2d562681"],
]);
const fh = {
    name: "ThemeManager",
    components: { LucideIcon: dt },
    props: {
      currentTheme: { type: String, default: "theme-ai-chatops" },
      currentLanguage: { type: String, default: "ko" },
      availableThemes: {
        type: Array,
        default: () => [
          { key: "theme-ai-chatops", name: "AI-ChatOps", displayName: "AI" },
          { key: "theme-heritage", name: "Heritage", displayName: "HT" },
          { key: "theme-classic", name: "classic", displayName: "CS" },
          { key: "theme-retro", name: "retro", displayName: "RT" },
        ],
      },
    },
    emits: ["cycle-theme", "toggle-language", "easter-egg"],
    computed: {
      currentThemeName() {
        const e = this.availableThemes.find((t) => t.key === this.currentTheme);
        return e ? e.name : "Default";
      },
      themeDisplayName() {
        const e = this.availableThemes.find((t) => t.key === this.currentTheme);
        return e ? e.displayName : "D";
      },
    },
  },
  gh = { class: "theme-manager" },
  ph = ["title"],
  mh = { class: "theme-indicator" };
function yh(e, t, s, n, i, r) {
  const o = ue("LucideIcon");
  return (
    I(),
    j("div", gh, [
      m(
        "div",
        {
          class: "easter-egg-trigger",
          onClick: t[0] || (t[0] = (a) => e.$emit("easter-egg")),
        },
        [$(o, { name: "sparkles", fill: "currentColor", width: 4, height: 4 })]
      ),
      m(
        "button",
        {
          class: "theme-selector header-btn header-btn--md",
          onClick: t[1] || (t[1] = (a) => e.$emit("cycle-theme")),
          title: r.currentThemeName,
        },
        [m("span", mh, z(r.themeDisplayName), 1)],
        8,
        ph
      ),
      m(
        "button",
        {
          class: "language-btn header-btn header-btn--md",
          onClick: t[2] || (t[2] = (a) => e.$emit("toggle-language")),
        },
        [m("span", null, z(s.currentLanguage === "ko" ? "KO" : "EN"), 1)]
      ),
    ])
  );
}
const wh = rt(fh, [
  ["render", yh],
  ["__scopeId", "data-v-bf999135"],
]);
const bh = {
    name: "CategorySelector",
    components: { LucideIcon: dt },
    props: {
      categories: {
        type: Array,
        default: () => [
          {
            key: "personal",
            icon: "user",
            titleKey: "personalCategory",
            descKey: "personalCategoryDesc",
          },
          {
            key: "general",
            icon: "users",
            titleKey: "generalCategory",
            descKey: "generalCategoryDesc",
          },
          {
            key: "operation",
            icon: "settings",
            titleKey: "operationCategory",
            descKey: "operationCategoryDesc",
          },
        ],
      },
      chatProcessingCount: { type: Number, default: 0 },
      getText: { type: Function, required: !0 },
    },
    emits: ["select-category", "go-feedback"],
    methods: {
      selectCategory(e) {
        this.$emit("select-category", e);
      },
    },
  },
  vh = { class: "category-select" },
  Ch = { class: "welcome-section" },
  _h = { class: "welcome-icon" },
  kh = { class: "welcome-content" },
  xh = { class: "category-container" },
  Sh = { class: "category-grid" },
  Th = ["onClick"],
  Mh = { class: "category-content" },
  Eh = { class: "category-arrow" },
  Ah = { class: "feedback-section" },
  Ph = ["disabled"];
function Ih(e, t, s, n, i, r) {
  const o = ue("LucideIcon");
  return (
    I(),
    j("div", vh, [
      m("div", Ch, [
        m("div", _h, [
          $(o, {
            name: "heart",
            fill: "var(--color-primary)",
            width: 28,
            height: 28,
          }),
        ]),
        m("div", kh, [
          m("h3", null, z(s.getText("welcomeTitle")), 1),
          m("p", null, z(s.getText("welcomeMessage")), 1),
        ]),
      ]),
      m("div", xh, [
        m("div", Sh, [
          (I(!0),
          j(
            le,
            null,
            ns(
              s.categories,
              (a) => (
                I(),
                j(
                  "div",
                  {
                    key: a.key,
                    onClick: (l) => r.selectCategory(a.key),
                    class: oe([
                      "category-card card-system card-system--interactive",
                      { disabled: s.chatProcessingCount > 0 },
                    ]),
                  },
                  [
                    m(
                      "div",
                      {
                        class: oe(["category-icon", `category-icon--${a.key}`]),
                      },
                      [
                        $(
                          o,
                          {
                            name: a.icon,
                            fill: "white",
                            width: 20,
                            height: 20,
                          },
                          null,
                          8,
                          ["name"]
                        ),
                      ],
                      2
                    ),
                    m("div", Mh, [
                      m("h4", null, z(s.getText(a.titleKey)), 1),
                      m("p", null, z(s.getText(a.descKey)), 1),
                    ]),
                    m("div", Eh, [
                      $(o, {
                        name: "chevron-right",
                        fill: "currentColor",
                        width: 14,
                        height: 14,
                      }),
                    ]),
                  ],
                  10,
                  Th
                )
              )
            ),
            128
          )),
        ]),
        m("div", Ah, [
          m(
            "button",
            {
              onClick: t[0] || (t[0] = (a) => e.$emit("go-feedback")),
              disabled: s.chatProcessingCount > 0,
              class:
                "feedback-btn btn-system btn-system--accent btn-system--md",
            },
            [
              $(o, {
                name: "heart",
                fill: "currentColor",
                width: 16,
                height: 16,
              }),
              Ve(" " + z(s.getText("sendFeedback")), 1),
            ],
            8,
            Ph
          ),
        ]),
      ]),
    ])
  );
}
const Rh = rt(bh, [
  ["render", Ih],
  ["__scopeId", "data-v-b16a46cf"],
]);
const Oh = {
    name: "PersonaSelector",
    components: { LucideIcon: dt, Elements: tn },
    props: {
      selectedCategory: { type: String, required: !0 },
      filteredPersonas: { type: Array, default: () => [] },
      loadingPersonas: { type: Boolean, default: !1 },
      personaColors: {
        type: Array,
        default: () => [
          "#8B7FD6",
          "#7FB069",
          "#D4A574",
          "#9B8AA0",
          "#6B9BD2",
          "#C49A9A",
          "#85A392",
          "#D6B85A",
          "#A084C2",
          "#6FAADB",
          "#C5906D",
          "#9A9FD4",
          "#7DC4A8",
          "#E0A458",
          "#B39BC7",
          "#6DB4D6",
          "#D9976B",
          "#8FA8D3",
          "#A8D4A8",
          "#E8B86D",
          "#C2A2D6",
          "#7ACFD6",
          "#D4A285",
          "#98B6E8",
          "#B8D4B8",
          "#F0C570",
          "#D0A8E8",
          "#85D4D4",
          "#E8C085",
          "#A8C0F0",
        ],
      },
      currentLanguage: { type: String, default: "ko" },
      getText: { type: Function, required: !0 },
      getPersonaIconName: { type: Function, required: !0 },
    },
    emits: ["go-back", "select-persona"],
    methods: {
      getCategoryIcon(e) {
        return (
          { operation: "settings", general: "users", personal: "user" }[e] ||
          "grid"
        );
      },
      getCategoryDisplayName(e) {
        const t = {
          personal: "personalCategory",
          general: "generalCategory",
          operation: "operationCategory",
        };
        return this.getText(t[e] || e);
      },
      getPersonaDescription(e) {
        return e
          ? this.currentLanguage === "en" && e.descriptionEn
            ? e.descriptionEn
            : e.description || this.getText("defaultPersonaDesc")
          : "";
      },
      getPersonaColor(e, t = "") {
        const s = t.length || 1,
          n = (e + s) % this.personaColors.length;
        return this.personaColors[n];
      },
      selectPersona(e) {
        this.$emit("select-persona", e);
      },
    },
  },
  Lh = { class: "persona-list-tab" },
  $h = { class: "persona-header" },
  Dh = { class: "header-content" },
  zh = { class: "category-badge" },
  Fh = { class: "persona-content" },
  Nh = { class: "loading-container" },
  Bh = { class: "no-personas" },
  Hh = { class: "persona-grid" },
  jh = ["onClick"],
  qh = { class: "persona-card-content" },
  Uh = { class: "persona-info" },
  Qh = { class: "persona-title" },
  Vh = { class: "persona-description" },
  Wh = { class: "persona-arrow" };
function Kh(e, t, s, n, i, r) {
  const o = ue("LucideIcon"),
    a = ue("Elements");
  return (
    I(),
    j("div", Lh, [
      m("div", $h, [
        m(
          "button",
          {
            onClick: t[0] || (t[0] = (l) => e.$emit("go-back")),
            class: "back-btn btn-system btn-system--ghost btn-system--sm",
          },
          [
            $(o, {
              name: "arrow-left",
              fill: "currentColor",
              width: 14,
              height: 14,
            }),
            Ve(" " + z(s.getText("back")), 1),
          ]
        ),
        m("div", Dh, [
          m("div", zh, [
            $(
              o,
              {
                name: r.getCategoryIcon(s.selectedCategory),
                fill: "white",
                width: 16,
                height: 16,
              },
              null,
              8,
              ["name"]
            ),
            m("span", null, z(r.getCategoryDisplayName(s.selectedCategory)), 1),
          ]),
          m("h3", null, z(s.getText("selectPersonaDesc")), 1),
        ]),
      ]),
      m("div", Fh, [
        ut(
          m(
            "div",
            Nh,
            [
              $(a, { "component-type": "spinner", size: "lg", centered: "" }),
              m("span", null, z(s.getText("loadingPersonas")), 1),
            ],
            512
          ),
          [[Lt, s.loadingPersonas]]
        ),
        ut(
          m(
            "div",
            Bh,
            [
              $(o, {
                name: "info",
                fill: "var(--text-muted)",
                width: 40,
                height: 40,
              }),
              m("h4", null, z(s.getText("noPersonas")), 1),
              m("p", null, z(s.getText("noPersonasDesc")), 1),
              m(
                "button",
                {
                  onClick: t[1] || (t[1] = (l) => e.$emit("go-back")),
                  class: "btn-system btn-system--primary btn-system--md",
                },
                [
                  $(o, {
                    name: "home-heart",
                    fill: "currentColor",
                    width: 16,
                    height: 16,
                  }),
                  Ve(" " + z(s.getText("goHome")), 1),
                ]
              ),
            ],
            512
          ),
          [[Lt, !s.loadingPersonas && s.filteredPersonas.length === 0]]
        ),
        ut(
          m(
            "div",
            Hh,
            [
              (I(!0),
              j(
                le,
                null,
                ns(
                  s.filteredPersonas,
                  (l, d) => (
                    I(),
                    j(
                      "div",
                      {
                        key: l.personaCode,
                        onClick: (c) => r.selectPersona(l),
                        class: oe([
                          "persona-card card-system card-system--interactive",
                          { disabled: s.loadingPersonas },
                        ]),
                        "data-testid": "persona-card",
                      },
                      [
                        m("div", qh, [
                          m(
                            "div",
                            {
                              class: "persona-icon",
                              style: as({
                                backgroundColor: r.getPersonaColor(
                                  d,
                                  r.getPersonaDescription(l)
                                ),
                              }),
                            },
                            [
                              $(
                                o,
                                {
                                  name: s.getPersonaIconName(l),
                                  fill: "white",
                                  width: 20,
                                  height: 20,
                                },
                                null,
                                8,
                                ["name"]
                              ),
                            ],
                            4
                          ),
                          m("div", Uh, [
                            m("h4", Qh, z(l.title || l.personaCode), 1),
                            m("p", Vh, z(r.getPersonaDescription(l)), 1),
                          ]),
                          m("div", Wh, [
                            $(o, {
                              name: "chevron-right",
                              fill: "currentColor",
                              width: 14,
                              height: 14,
                            }),
                          ]),
                        ]),
                      ],
                      10,
                      jh
                    )
                  )
                ),
                128
              )),
            ],
            512
          ),
          [[Lt, !s.loadingPersonas && s.filteredPersonas.length > 0]]
        ),
      ]),
    ])
  );
}
const Jh = rt(Oh, [
  ["render", Kh],
  ["__scopeId", "data-v-cf4cf0c0"],
]);
const Gh = {
    name: "AIChatOpsLayout",
    components: {
      ChatTab: Wd,
      FeedbackTab: lh,
      Elements: tn,
      LucideIcon: dt,
      WindowManager: hh,
      ThemeManager: wh,
      CategorySelector: Rh,
      PersonaSelector: Jh,
    },
    data() {
      return {
        isOpen: !1,
        isInitialized: !1,
        isLoading: !1,
        isInitializing: !1,
        isClosing: !1,
        currentView: "categorySelect",
        selectedCategory: null,
        selectedPersona: null,
        personas: [],
        loadingPersonas: !1,
        isConnected: !0,
        currentLanguage: this.getInitialLanguage(),
        currentTheme: this.getInitialTheme(),
        personaSessionMap: {},
        personaMessageCache: new Map(),
        maxMessagesPerPersona: 30,
        windowState: "normal",
        windowSize: { width: 455, height: 676 },
        chatProcessingCount: 0,
        pendingRequests: new Map(),
        healthCheckInterval: null,
        cacheCleanupInterval: null,
        availableThemes: [
          { key: "theme-ai-chatops", name: "AI-ChatOps", displayName: "AI" },
          { key: "theme-heritage", name: "Heritage", displayName: "HT" },
          { key: "theme-classic", name: "classic", displayName: "CS" },
          { key: "theme-retro", name: "retro", displayName: "RT" },
        ],
        personaColors: [
          "#8B7FD6",
          "#7FB069",
          "#D4A574",
          "#9B8AA0",
          "#6B9BD2",
          "#C49A9A",
          "#85A392",
          "#D6B85A",
          "#A084C2",
          "#6FAADB",
          "#C5906D",
          "#9A9FD4",
          "#7DC4A8",
          "#E0A458",
          "#B39BC7",
          "#6DB4D6",
          "#D9976B",
          "#8FA8D3",
          "#A8D4A8",
          "#E8B86D",
          "#C2A2D6",
          "#7ACFD6",
          "#D4A285",
          "#98B6E8",
          "#B8D4B8",
          "#F0C570",
          "#D0A8E8",
          "#85D4D4",
          "#E8C085",
          "#A8C0F0",
        ],
        categories: [
          {
            key: "personal",
            icon: "user",
            titleKey: "personalCategory",
            descKey: "personalCategoryDesc",
          },
          {
            key: "general",
            icon: "users",
            titleKey: "generalCategory",
            descKey: "generalCategoryDesc",
          },
          {
            key: "operation",
            icon: "settings",
            titleKey: "operationCategory",
            descKey: "operationCategoryDesc",
          },
        ],
      };
    },
    computed: {
      windowClasses() {
        return {
          minimized: this.windowState === "minimized",
          maximized: this.windowState === "maximized",
        };
      },
      filteredPersonas() {
        if (!this.selectedCategory) return [];
        if (!this.personas)
          return (
            console.log(
              "🔍 [AIChatOpsLayout] filteredPersonas: No personas data, returning empty array"
            ),
            []
          );
        if (!Array.isArray(this.personas))
          return (
            console.error(
              "❌ [AIChatOpsLayout] filteredPersonas: personas is not an array:",
              { type: typeof this.personas, value: this.personas }
            ),
            []
          );
        const e = this.personas.filter((t) => {
          if (!t)
            return (
              console.warn(
                "⚠️ [AIChatOpsLayout] filteredPersonas: Found null/undefined persona"
              ),
              !1
            );
          const s = t.category === this.selectedCategory,
            n =
              t.tags &&
              Array.isArray(t.tags) &&
              t.tags.includes(this.selectedCategory);
          return s || n;
        });
        return (
          console.log(
            "🔍 [AIChatOpsLayout] filteredPersonas: Filtering result:",
            {
              selectedCategory: this.selectedCategory,
              totalPersonas: this.personas.length,
              filteredCount: e.length,
              filterCriteria: {
                categoryMatch: this.personas.filter(
                  (t) =>
                    (t == null ? void 0 : t.category) === this.selectedCategory
                ).length,
                tagsMatch: this.personas.filter(
                  (t) =>
                    (t == null ? void 0 : t.tags) &&
                    Array.isArray(t.tags) &&
                    t.tags.includes(this.selectedCategory)
                ).length,
              },
            }
          ),
          e
        );
      },
    },
    methods: {
      getText(e, t = {}) {
        return hi(this.currentLanguage, e, t);
      },
      getInitialLanguage() {
        try {
          return localStorage.getItem("ai-chatops-chat-lang") || "ko";
        } catch {
          return "ko";
        }
      },
      getInitialTheme() {
        try {
          return (
            localStorage.getItem("ai-chatops-chat-theme") || "theme-ai-chatops"
          );
        } catch {
          return "theme-ai-chatops";
        }
      },
      cycleTheme() {
        const t =
            (this.availableThemes.findIndex(
              (n) => n.key === this.currentTheme
            ) +
              1) %
            this.availableThemes.length,
          s = this.availableThemes[t];
        (this.currentTheme = s.key),
          this.applyTheme(s.key),
          this.saveThemePreference(s.key);
      },
      applyTheme(e) {
        console.log("🎨 테마 적용 시작:", e);
        const t = document.body,
          s = this.$refs.chatWindow;
        console.log("📦 chatWindow 참조:", s ? "존재" : "없음"),
          this.availableThemes.forEach((n) => {
            t.classList.remove(n.key), s && s.classList.remove(n.key);
          }),
          t.classList.add(e),
          s &&
            (s.classList.add(e),
            console.log("✅ 테마 클래스 추가됨:", e),
            console.log("📋 현재 chatWindow 클래스:", s.className)),
          console.log("🔄 body 클래스 목록:", t.className);
      },
      getCurrentThemeName() {
        const e = this.availableThemes.find((t) => t.key === this.currentTheme);
        return e ? e.name : "Default";
      },
      getThemeDisplayName() {
        const e = this.availableThemes.find((t) => t.key === this.currentTheme);
        return e ? e.displayName : "D";
      },
      saveThemePreference(e) {
        try {
          localStorage.setItem("ai-chatops-chat-theme", e);
        } catch {
          console.log("Could not save theme preference");
        }
      },
      getCategoryIcon(e) {
        return (
          { operation: "settings", general: "users", personal: "user" }[e] ||
          "grid"
        );
      },
      getCategoryDisplayName(e) {
        const t = {
          personal: "personalCategory",
          general: "generalCategory",
          operation: "operationCategory",
        };
        return this.getText(t[e] || e);
      },
      getPersonaIconName(e) {
        return e ? re.getPersonaIcon(e.personaCode) : "message-square-heart";
      },
      getPersonaDescription(e) {
        return e
          ? this.currentLanguage === "en" && e.descriptionEn
            ? e.descriptionEn
            : e.description || this.getText("defaultPersonaDesc")
          : "";
      },
      getPersonaColor(e, t = "") {
        const s = t.length || 1,
          n = (e + s) % this.personaColors.length;
        return this.personaColors[n];
      },
      async toggleChat() {
        if (this.isOpen) {
          if (this.isClosing) return;
          (this.isClosing = !0),
            (this.isOpen = !1),
            setTimeout(() => {
              (this.isInitialized = !1), (this.isClosing = !1);
            }, 150);
        } else {
          if (this.isInitializing || this.isClosing) return;
          (this.isInitializing = !0),
            Object.assign(this, {
              windowState: "normal",
              currentView: "categorySelect",
              isOpen: !0,
              isInitialized: !0,
            }),
            await this.$nextTick(),
            this.applyTheme(this.currentTheme),
            this.$nextTick(() => {
              Promise.all([
                this.loadPersonas(),
                this.preloadPopularPersonas(),
              ]).catch(console.error);
            }),
            (this.isInitializing = !1);
        }
      },
      closeChat() {
        Object.assign(this, {
          isOpen: !1,
          currentView: "categorySelect",
          selectedCategory: null,
          selectedPersona: null,
          windowState: "normal",
        }),
          this.cancelAllPendingRequests(),
          this.$nextTick(() => {
            this.saveCurrentMessages(),
              this.$refs.chatTab && this.$refs.chatTab.resetToInitialState(),
              setTimeout(() => {
                this.isInitialized = !1;
              }, 150);
          });
      },
      minimizeWindow() {
        this.windowState === "minimized"
          ? (this.windowState = "normal")
          : (this.windowState = "minimized");
      },
      toggleMaximizeWindow() {
        this.windowState === "maximized"
          ? (this.windowState = "normal")
          : (this.windowState = "maximized");
      },
      goToCategorySelect() {
        this.saveCurrentMessages(),
          Object.assign(this, {
            currentView: "categorySelect",
            selectedCategory: null,
            selectedPersona: null,
          }),
          this.$refs.chatTab && this.$refs.chatTab.resetToInitialState();
      },
      goToPersonaList() {
        this.saveCurrentMessages(),
          Object.assign(this, {
            currentView: "personaList",
            selectedPersona: null,
          }),
          this.$refs.chatTab && this.$refs.chatTab.resetToInitialState();
      },
      goToFeedback() {
        this.currentView = "feedback";
      },
      selectCategory(e) {
        console.log("🎯 [AIChatOpsLayout] selectCategory:", {
          category: e,
          totalPersonas: this.personas.length,
          willFilter: !0,
        }),
          Object.assign(this, {
            selectedCategory: e,
            currentView: "personaList",
          }),
          this.$nextTick(() => {
            const t = this.filteredPersonas;
            console.log(
              "🔍 [AIChatOpsLayout] selectCategory: Filtered personas:",
              {
                category: e,
                filteredCount: t.length,
                filteredPersonas: t.map((s) => ({
                  code: s.personaCode,
                  title: s.title,
                  category: s.category,
                  tags: s.tags,
                })),
              }
            ),
              t.length === 0 &&
                console.warn(
                  "⚠️ [AIChatOpsLayout] selectCategory: No personas found for category:",
                  e
                );
          });
      },
      selectPersona(e) {
        this.saveCurrentMessages(),
          Object.assign(this, { selectedPersona: e, currentView: "chat" }),
          this.$nextTick(() => {
            this.$refs.chatTab &&
              (this.loadCachedMessages(e.personaCode) ||
                this.$refs.chatTab.loadPersonaHistory());
          });
      },
      toggleLanguage() {
        this.currentLanguage = this.currentLanguage === "ko" ? "en" : "ko";
        try {
          localStorage.setItem("ai-chatops-chat-lang", this.currentLanguage);
        } catch {
          console.log("Could not save language preference");
        }
      },
      openRandomEasterEgg() {
        const t = `/playground/easter-egg${
          Math.floor(Math.random() * 5) + 1
        }.html`;
        window.open(
          t,
          "_blank",
          "width=800,height=600,scrollbars=yes,resizable=yes"
        );
      },
      saveCurrentMessages() {
        if (
          this.selectedPersona &&
          this.$refs.chatTab &&
          this.$refs.chatTab.messages.length > 0
        ) {
          const t = this.$refs.chatTab.messages.slice(
            -this.maxMessagesPerPersona
          );
          this.personaMessageCache.set(this.selectedPersona.personaCode, t);
        }
      },
      loadCachedMessages(e) {
        const t = this.personaMessageCache.get(e);
        return t && t.length > 0
          ? ((this.$refs.chatTab.messages = [...t]),
            this.$refs.chatTab.scrollToBottomInstantly(),
            !0)
          : !1;
      },
      async preloadPopularPersonas() {
        const e = this.personas.slice(0, 10);
        for (const t of e)
          if (!this.personaMessageCache.has(t.personaCode))
            try {
              const s = await re.getConversations(t.personaCode);
              if (s.success && s.data) {
                const i = re
                  .convertConversationsToMessages(s.data)
                  .slice(-this.maxMessagesPerPersona);
                this.personaMessageCache.set(t.personaCode, i);
              }
            } catch {
              console.log("Error preloading persona:", t.personaCode);
            }
      },
      cleanupCache() {
        this.personaMessageCache.size > 10 &&
          Array.from(this.personaMessageCache.entries())
            .slice(0, this.personaMessageCache.size - 10)
            .forEach(([s]) => {
              this.personaMessageCache.delete(s);
            });
      },
      startCacheCleanup() {
        this.cacheCleanupInterval = setInterval(() => {
          this.cleanupCache();
        }, 3e5);
      },
      stopCacheCleanup() {
        this.cacheCleanupInterval &&
          (clearInterval(this.cacheCleanupInterval),
          (this.cacheCleanupInterval = null));
      },
      loadPersonas() {
        return this.loadingPersonas
          ? (console.log(
              "🔄 [AIChatOpsLayout] loadPersonas: Already loading, skipping"
            ),
            Promise.resolve())
          : (console.log(
              "🚀 [AIChatOpsLayout] loadPersonas: Starting to load personas"
            ),
            (this.loadingPersonas = !0),
            re
              .getPersonas()
              .then((e) => {
                if (
                  (console.log(
                    "📡 [AIChatOpsLayout] loadPersonas: API response received:",
                    {
                      success: e.success,
                      hasData: !!e.data,
                      dataType: typeof e.data,
                      dataLength: Array.isArray(e.data)
                        ? e.data.length
                        : "not array",
                      fullResponse: e,
                    }
                  ),
                  e.success)
                ) {
                  const t = e.data || [];
                  (this.personas = t),
                    console.log(
                      "✅ [AIChatOpsLayout] loadPersonas: Personas loaded successfully:",
                      {
                        count: t.length,
                        personas: t.map((s) => ({
                          code: s.personaCode,
                          title: s.title,
                          category: s.category,
                          tags: s.tags,
                        })),
                      }
                    ),
                    t.length === 0 &&
                      console.warn(
                        "⚠️ [AIChatOpsLayout] loadPersonas: No personas found in response"
                      );
                } else
                  console.error(
                    "❌ [AIChatOpsLayout] loadPersonas: API returned unsuccessful response:",
                    { errorMessage: e.errorMessage, error: e.error }
                  );
              })
              .catch((e) => {
                var t;
                console.error(
                  "❌ [AIChatOpsLayout] loadPersonas: Error loading personas:",
                  {
                    error: e,
                    message: e.message,
                    stack: e.stack,
                    response: (t = e.response) == null ? void 0 : t.data,
                  }
                );
              })
              .finally(() => {
                (this.loadingPersonas = !1),
                  console.log(
                    "🔚 [AIChatOpsLayout] loadPersonas: Loading completed, personas count:",
                    this.personas.length
                  );
              }));
      },
      handleMessageSent(e) {
        const t = `${e.personaCode}-${Date.now()}-${Math.random()}`;
        this.pendingRequests.set(t, {
          personaCode: e.personaCode,
          startTime: Date.now(),
        }),
          this.updateProcessingState(),
          !e.sessionId &&
            this.personaSessionMap[e.personaCode] &&
            (e.sessionId = this.personaSessionMap[e.personaCode]),
          re
            .sendMessage(e)
            .then((s) => {
              s.success
                ? this.handleSuccessResponse(e, s)
                : this.handleErrorResponse(
                    s.errorMessage || this.getText("aiError")
                  );
            })
            .catch((s) => {
              this.handleErrorResponse(this.getText("networkError")),
                (this.isConnected = !1);
            })
            .finally(() => {
              this.pendingRequests.delete(t), this.updateProcessingState();
            });
      },
      handleSuccessResponse(e, t) {
        if (
          (console.log("✅ [AIChatOpsLayout] handleSuccessResponse:", {
            hasSessionId: !!t.sessionId,
            sessionId: t.sessionId,
            personaCode: e.personaCode,
            hasData: !!t.data,
            responseKeys: Object.keys(t),
            hasChatTab: !!this.$refs.chatTab,
          }),
          t.sessionId)
        ) {
          this.personaSessionMap[e.personaCode] = t.sessionId;
          try {
            localStorage.setItem(
              "ai-chatops-chat-sessions",
              JSON.stringify(this.personaSessionMap)
            ),
              console.log(
                "💾 [AIChatOpsLayout] handleSuccessResponse: Session saved for persona:",
                e.personaCode
              );
          } catch (s) {
            console.error(
              "❌ [AIChatOpsLayout] handleSuccessResponse: Could not save session data:",
              s
            );
          }
        }
        this.$refs.chatTab
          ? (this.$refs.chatTab.addAiResponse(t),
            console.log(
              "📤 [AIChatOpsLayout] handleSuccessResponse: Response sent to chatTab"
            ))
          : console.error(
              "❌ [AIChatOpsLayout] handleSuccessResponse: No chatTab ref found"
            ),
          (this.isConnected = !0);
      },
      handleErrorResponse(e) {
        console.error("❌ [AIChatOpsLayout] handleErrorResponse:", {
          errorMessage: e,
          hasChatTab: !!this.$refs.chatTab,
          isConnected: this.isConnected,
        }),
          this.$refs.chatTab
            ? (this.$refs.chatTab.addAiResponse({ success: !1, message: e }),
              console.log(
                "📤 [AIChatOpsLayout] handleErrorResponse: Error sent to chatTab"
              ))
            : console.error(
                "❌ [AIChatOpsLayout] handleErrorResponse: No chatTab ref found, cannot display error"
              );
      },
      updateProcessingState() {
        const e = this.pendingRequests.size,
          t = this.chatProcessingCount;
        (this.chatProcessingCount = e),
          t !== e && this.$emit("processing-state-changed", e > 0);
      },
      handleProcessingStateChanged(e) {},
      cancelAllPendingRequests() {
        this.pendingRequests.clear(),
          this.updateProcessingState(),
          (this.chatProcessingCount = 0);
      },
      handleFeedbackSent(e) {
        re.sendFeedback(e)
          .then((t) => {
            t.success
              ? this.$refs.feedbackTab &&
                this.$refs.feedbackTab.showSuccess(t.message)
              : this.$refs.feedbackTab &&
                this.$refs.feedbackTab.showError(
                  t.errorMessage || "An error occurred while sending feedback."
                );
          })
          .catch((t) => {
            this.$refs.feedbackTab &&
              this.$refs.feedbackTab.showError(
                "An error occurred while sending feedback."
              );
          });
      },
      loadStoredSessions() {
        try {
          const e = localStorage.getItem("ai-chatops-chat-sessions");
          e && (this.personaSessionMap = JSON.parse(e));
        } catch {
          this.personaSessionMap = {};
        }
      },
      startHealthCheck() {
        this.healthCheckInterval = setInterval(() => {
          re.healthCheck()
            .then((e) => {
              this.isConnected = e.success;
            })
            .catch(() => {
              this.isConnected = !1;
            });
        }, 3e4);
      },
      stopHealthCheck() {
        this.healthCheckInterval &&
          (clearInterval(this.healthCheckInterval),
          (this.healthCheckInterval = null));
      },
    },
    mounted() {
      this.loadStoredSessions(),
        this.startHealthCheck(),
        this.startCacheCleanup(),
        this.$nextTick(() => {
          this.applyTheme(this.currentTheme);
        });
    },
    beforeDestroy() {
      this.stopHealthCheck(),
        this.stopCacheCleanup(),
        this.cancelAllPendingRequests(),
        (this.personas = []),
        (this.selectedPersona = null),
        (this.selectedCategory = null),
        this.pendingRequests.clear(),
        this.personaMessageCache.clear(),
        (this.healthCheckInterval = null),
        (this.cacheCleanupInterval = null),
        (this.personaSessionMap = {}),
        this.$refs.chatTab && this.$refs.chatTab.resetToInitialState(),
        this.$refs.feedbackTab && this.$refs.feedbackTab.resetForm();
    },
  },
  Zh = { class: "ai-chatops-chat" },
  Yh = { class: "chat-header" },
  Xh = { class: "bot-info" },
  ef = { class: "avatar" },
  tf = { class: "details" },
  sf = { class: "name" },
  nf = { class: "actions" },
  rf = { class: "content" };
function of(e, t, s, n, i, r) {
  const o = ue("Elements"),
    a = ue("LucideIcon"),
    l = ue("ThemeManager"),
    d = ue("WindowManager"),
    c = ue("CategorySelector"),
    f = ue("PersonaSelector"),
    w = ue("ChatTab"),
    S = ue("FeedbackTab");
  return (
    I(),
    j("div", Zh, [
      m(
        "button",
        {
          class: oe(["ai-chatops-chat-button", { "is-active": i.isOpen }]),
          onClick:
            t[0] || (t[0] = (...C) => r.toggleChat && r.toggleChat(...C)),
        },
        [
          i.isLoading
            ? (I(), Ce(o, { key: 0, "component-type": "spinner", size: "md" }))
            : te("", !0),
          !i.isLoading && i.isOpen
            ? (I(),
              Ce(a, {
                name: "x",
                fill: "currentColor",
                width: 28,
                height: 28,
                key: "close-icon",
              }))
            : te("", !0),
          !i.isLoading && !i.isOpen
            ? (I(),
              Ce(a, {
                name: "robot",
                fill: "currentColor",
                width: 28,
                height: 28,
                key: "chat-icon",
              }))
            : te("", !0),
        ],
        2
      ),
      ut(
        m(
          "div",
          {
            class: oe([
              "ai-chatops-chat-window",
              [r.windowClasses, i.currentTheme],
            ]),
            ref: "chatWindow",
          },
          [
            m("div", Yh, [
              m("div", Xh, [
                m("div", ef, [
                  $(a, { name: "robot", fill: "white", width: 26, height: 26 }),
                ]),
                m("div", tf, [
                  m("span", sf, z(r.getText("aiChatOpsTitle")), 1),
                  m(
                    "div",
                    { class: oe(["status", { offline: !i.isConnected }]) },
                    [
                      t[1] ||
                        (t[1] = m("span", { class: "status-dot" }, null, -1)),
                      m(
                        "span",
                        null,
                        z(
                          i.isConnected
                            ? r.getText("online")
                            : r.getText("offline")
                        ),
                        1
                      ),
                    ],
                    2
                  ),
                ]),
              ]),
              m("div", nf, [
                $(
                  l,
                  {
                    "current-theme": i.currentTheme,
                    "current-language": i.currentLanguage,
                    "available-themes": i.availableThemes,
                    onCycleTheme: r.cycleTheme,
                    onToggleLanguage: r.toggleLanguage,
                    onEasterEgg: r.openRandomEasterEgg,
                  },
                  null,
                  8,
                  [
                    "current-theme",
                    "current-language",
                    "available-themes",
                    "onCycleTheme",
                    "onToggleLanguage",
                    "onEasterEgg",
                  ]
                ),
                $(
                  d,
                  {
                    "window-state": i.windowState,
                    onMinimize: r.minimizeWindow,
                    onToggleMaximize: r.toggleMaximizeWindow,
                    onClose: r.closeChat,
                  },
                  null,
                  8,
                  ["window-state", "onMinimize", "onToggleMaximize", "onClose"]
                ),
              ]),
            ]),
            m("div", rf, [
              ut(
                $(
                  c,
                  {
                    categories: i.categories,
                    "chat-processing-count": i.chatProcessingCount,
                    "get-text": r.getText,
                    onSelectCategory: r.selectCategory,
                    onGoFeedback: r.goToFeedback,
                  },
                  null,
                  8,
                  [
                    "categories",
                    "chat-processing-count",
                    "get-text",
                    "onSelectCategory",
                    "onGoFeedback",
                  ]
                ),
                [[Lt, i.currentView === "categorySelect"]]
              ),
              ut(
                $(
                  f,
                  {
                    "selected-category": i.selectedCategory,
                    "filtered-personas": r.filteredPersonas,
                    "loading-personas": i.loadingPersonas,
                    "persona-colors": i.personaColors,
                    "current-language": i.currentLanguage,
                    "get-text": r.getText,
                    "get-persona-icon-name": r.getPersonaIconName,
                    onGoBack: r.goToCategorySelect,
                    onSelectPersona: r.selectPersona,
                  },
                  null,
                  8,
                  [
                    "selected-category",
                    "filtered-personas",
                    "loading-personas",
                    "persona-colors",
                    "current-language",
                    "get-text",
                    "get-persona-icon-name",
                    "onGoBack",
                    "onSelectPersona",
                  ]
                ),
                [[Lt, i.currentView === "personaList"]]
              ),
              i.currentView === "chat" && i.isInitialized
                ? (I(),
                  Ce(
                    w,
                    {
                      key: 0,
                      ref: "chatTab",
                      "selected-persona": i.selectedPersona,
                      "is-processing": i.chatProcessingCount > 0,
                      "current-language": i.currentLanguage,
                      "window-size": i.windowSize,
                      "selected-category": i.selectedCategory,
                      onMessageSent: r.handleMessageSent,
                      onProcessingStateChanged: r.handleProcessingStateChanged,
                      onGoPersonaList: r.goToPersonaList,
                      onGoHome: r.goToCategorySelect,
                    },
                    null,
                    8,
                    [
                      "selected-persona",
                      "is-processing",
                      "current-language",
                      "window-size",
                      "selected-category",
                      "onMessageSent",
                      "onProcessingStateChanged",
                      "onGoPersonaList",
                      "onGoHome",
                    ]
                  ))
                : te("", !0),
              i.currentView === "feedback" && i.isInitialized
                ? (I(),
                  Ce(
                    S,
                    {
                      key: 1,
                      ref: "feedbackTab",
                      "current-language": i.currentLanguage,
                      onFeedbackSent: r.handleFeedbackSent,
                      onGoHome: r.goToCategorySelect,
                    },
                    null,
                    8,
                    ["current-language", "onFeedbackSent", "onGoHome"]
                  ))
                : te("", !0),
            ]),
          ],
          2
        ),
        [[Lt, i.isOpen && i.isInitialized]]
      ),
    ])
  );
}
const af = rt(Gh, [
  ["render", of],
  ["__scopeId", "data-v-816959f7"],
]);
const lf = sc(af);
lf.mount("#app");
