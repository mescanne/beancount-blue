var ms = Object.defineProperty;
var la = (e) => {
  throw TypeError(e);
};
var ws = (e, t, r) => t in e ? ms(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var Je = (e, t, r) => ws(e, typeof t != "symbol" ? t + "" : t, r), jn = (e, t, r) => t.has(e) || la("Cannot " + r);
var f = (e, t, r) => (jn(e, t, "read from private field"), r ? r.call(e) : t.get(e)), I = (e, t, r) => t.has(e) ? la("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), C = (e, t, r, n) => (jn(e, t, "write to private field"), n ? n.call(e, r) : t.set(e, r), r), Y = (e, t, r) => (jn(e, t, "access private method"), r);
var Xn = Array.isArray, bs = Array.prototype.indexOf, dn = Array.prototype.includes, yn = Array.from, xs = Object.defineProperty, Hr = Object.getOwnPropertyDescriptor, ys = Object.getOwnPropertyDescriptors, ks = Object.prototype, zs = Array.prototype, Sa = Object.getPrototypeOf, oa = Object.isExtensible;
const Es = () => {
};
function Ss(e) {
  for (var t = 0; t < e.length; t++)
    e[t]();
}
function ja() {
  var e, t, r = new Promise((n, a) => {
    e = n, t = a;
  });
  return { promise: r, resolve: e, reject: t };
}
function js(e, t) {
  if (Array.isArray(e))
    return e;
  if (!(Symbol.iterator in e))
    return Array.from(e);
  const r = [];
  for (const n of e)
    if (r.push(n), r.length === t) break;
  return r;
}
const Te = 2, Sr = 4, kn = 8, Ta = 1 << 24, wt = 16, ft = 32, Bt = 64, Fn = 128, lt = 512, ke = 1024, ze = 2048, xt = 4096, Be = 8192, ot = 16384, Ar = 32768, fa = 1 << 25, jr = 65536, vn = 1 << 17, Ts = 1 << 18, Cr = 1 << 19, Os = 1 << 20, jt = 1 << 25, fr = 65536, hn = 1 << 21, mr = 1 << 22, Xt = 1 << 23, Vr = Symbol("$state"), Ms = Symbol(""), ln = Symbol("attributes"), In = Symbol("class"), Nn = Symbol("style"), Rr = Symbol("text"), Zr = new class extends Error {
  constructor() {
    super(...arguments);
    Je(this, "name", "StaleReactionError");
    Je(this, "message", "The reaction that called `getAbortSignal()` was re-run or destroyed");
  }
}();
var ka;
const As = (
  // We gotta write it like this because after downleveling the pure comment may end up in the wrong location
  !!((ka = globalThis.document) != null && ka.contentType) && /* @__PURE__ */ globalThis.document.contentType.includes("xml")
);
function Cs(e) {
  throw new Error("https://svelte.dev/e/lifecycle_outside_component");
}
function Fs() {
  throw new Error("https://svelte.dev/e/async_derived_orphan");
}
function Is(e, t, r) {
  throw new Error("https://svelte.dev/e/each_key_duplicate");
}
function Ns(e) {
  throw new Error("https://svelte.dev/e/effect_in_teardown");
}
function Rs() {
  throw new Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function Ps(e) {
  throw new Error("https://svelte.dev/e/effect_orphan");
}
function Ds() {
  throw new Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function Ls() {
  throw new Error("https://svelte.dev/e/state_descriptors_fixed");
}
function Bs() {
  throw new Error("https://svelte.dev/e/state_prototype_fixed");
}
function Hs() {
  throw new Error("https://svelte.dev/e/state_unsafe_mutation");
}
function Vs() {
  throw new Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
const Ys = 1, Ws = 2, Oa = 4, qs = 8, Us = 16, Ma = 1, Gs = 2, ye = Symbol("uninitialized"), Ks = "http://www.w3.org/1999/xhtml";
function Xs() {
  console.warn("https://svelte.dev/e/derived_inert");
}
function Js() {
  console.warn("https://svelte.dev/e/select_multiple_invalid_value");
}
function Zs() {
  console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
function Aa(e) {
  return e === this.v;
}
function Qs(e, t) {
  return e != e ? t == t : e !== t || e !== null && typeof e == "object" || typeof e == "function";
}
function Ca(e) {
  return !Qs(e, this.v);
}
let He = null;
function Tr(e) {
  He = e;
}
function Fr(e, t = !1, r) {
  He = {
    p: He,
    i: !1,
    c: null,
    e: null,
    s: e,
    x: null,
    r: (
      /** @type {Effect} */
      H
    ),
    l: null
  };
}
function Ir(e) {
  var t = (
    /** @type {ComponentContext} */
    He
  ), r = t.e;
  if (r !== null) {
    t.e = null;
    for (var n of r)
      Za(n);
  }
  return t.i = !0, He = t.p, /** @type {T} */
  {};
}
function Fa() {
  return !0;
}
let gr = [];
function $s() {
  var e = gr;
  gr = [], Ss(e);
}
function Lt(e) {
  if (gr.length === 0) {
    var t = gr;
    queueMicrotask(() => {
      t === gr && $s();
    });
  }
  gr.push(e);
}
function Ia(e) {
  var t = H;
  if (t === null)
    return B.f |= Xt, e;
  if ((t.f & Ar) === 0 && (t.f & Sr) === 0)
    throw e;
  Kt(e, t);
}
function Kt(e, t) {
  if (!(t !== null && (t.f & ot) !== 0)) {
    for (; t !== null; ) {
      if ((t.f & Fn) !== 0) {
        if ((t.f & Ar) === 0)
          throw e;
        try {
          t.b.error(e);
          return;
        } catch (r) {
          e = r;
        }
      }
      t = t.parent;
    }
    throw e;
  }
}
const ei = -7169;
function ce(e, t) {
  e.f = e.f & ei | t;
}
function Jn(e) {
  (e.f & lt) !== 0 || e.deps === null ? ce(e, ke) : ce(e, xt);
}
function Na(e) {
  if (e !== null)
    for (const t of e)
      (t.f & Te) === 0 || (t.f & fr) === 0 || (t.f ^= fr, Na(
        /** @type {Derived} */
        t.deps
      ));
}
function Ra(e, t, r) {
  (e.f & ze) !== 0 ? t.add(e) : (e.f & xt) !== 0 && r.add(e), Na(e.deps), ce(e, ke);
}
function Qr(e) {
  var t = B, r = H;
  ut(null), At(null);
  try {
    return e();
  } finally {
    ut(t), At(r);
  }
}
function ti(e) {
  let t = 0, r = cr(0), n;
  return () => {
    ta() && (s(r), Ti(() => (t === 0 && (n = fs(() => e(() => Wr(r)))), t += 1, () => {
      Lt(() => {
        t -= 1, t === 0 && (n == null || n(), n = void 0, Wr(r));
      });
    })));
  };
}
var ri = jr | Cr;
function ni(e, t, r, n) {
  new ai(e, t, r, n);
}
var at, Gn, st, tr, qe, it, Le, Qe, Ft, rr, Ut, wr, Gr, Kr, It, wn, se, si, ii, Rn, li, Pn, on, fn, Dn, Ln;
class ai {
  /**
   * @param {TemplateNode} node
   * @param {BoundaryProps} props
   * @param {((anchor: Node) => void)} children
   * @param {((error: unknown) => unknown) | undefined} [transform_error]
   */
  constructor(t, r, n, a) {
    I(this, se);
    /** @type {Boundary | null} */
    Je(this, "parent");
    Je(this, "is_pending", !1);
    /**
     * API-level transformError transform function. Transforms errors before they reach the `failed` snippet.
     * Inherited from parent boundary, or defaults to identity.
     * @type {(error: unknown) => unknown}
     */
    Je(this, "transform_error");
    /** @type {TemplateNode} */
    I(this, at);
    /** @type {TemplateNode | null} */
    I(this, Gn, null);
    /** @type {BoundaryProps} */
    I(this, st);
    /** @type {((anchor: Node) => void)} */
    I(this, tr);
    /** @type {Effect} */
    I(this, qe);
    /** @type {Effect | null} */
    I(this, it, null);
    /** @type {Effect | null} */
    I(this, Le, null);
    /** @type {Effect | null} */
    I(this, Qe, null);
    /** @type {DocumentFragment | null} */
    I(this, Ft, null);
    I(this, rr, 0);
    I(this, Ut, 0);
    I(this, wr, !1);
    /** @type {Set<Effect>} */
    I(this, Gr, /* @__PURE__ */ new Set());
    /** @type {Set<Effect>} */
    I(this, Kr, /* @__PURE__ */ new Set());
    /**
     * A source containing the number of pending async deriveds/expressions.
     * Only created if `$effect.pending()` is used inside the boundary,
     * otherwise updating the source results in needless `Batch.ensure()`
     * calls followed by no-op flushes
     * @type {Source<number> | null}
     */
    I(this, It, null);
    I(this, wn, ti(() => (C(this, It, cr(f(this, rr))), () => {
      C(this, It, null);
    })));
    var i;
    C(this, at, t), C(this, st, r), C(this, tr, (l) => {
      var o = (
        /** @type {Effect} */
        H
      );
      o.b = this, o.f |= Fn, n(l);
    }), this.parent = /** @type {Effect} */
    H.b, this.transform_error = a ?? ((i = this.parent) == null ? void 0 : i.transform_error) ?? ((l) => l), C(this, qe, na(() => {
      Y(this, se, Pn).call(this);
    }, ri));
  }
  /**
   * Defer an effect inside a pending boundary until the boundary resolves
   * @param {Effect} effect
   */
  defer_effect(t) {
    Ra(t, f(this, Gr), f(this, Kr));
  }
  /**
   * Returns `false` if the effect exists inside a boundary whose pending snippet is shown
   * @returns {boolean}
   */
  is_rendered() {
    return !this.is_pending && (!this.parent || this.parent.is_rendered());
  }
  has_pending_snippet() {
    return !!f(this, st).pending;
  }
  /**
   * Update the source that powers `$effect.pending()` inside this boundary,
   * and controls when the current `pending` snippet (if any) is removed.
   * Do not call from inside the class
   * @param {1 | -1} d
   * @param {Batch} batch
   */
  update_pending_count(t, r) {
    Y(this, se, Dn).call(this, t, r), C(this, rr, f(this, rr) + t), !(!f(this, It) || f(this, wr)) && (C(this, wr, !0), Lt(() => {
      C(this, wr, !1), f(this, It) && Or(f(this, It), f(this, rr));
    }));
  }
  get_effect_pending() {
    return f(this, wn).call(this), s(
      /** @type {Source<number>} */
      f(this, It)
    );
  }
  /** @param {unknown} error */
  error(t) {
    if (!f(this, st).onerror && !f(this, st).failed)
      throw t;
    F != null && F.is_fork ? (f(this, it) && F.skip_effect(f(this, it)), f(this, Le) && F.skip_effect(f(this, Le)), f(this, Qe) && F.skip_effect(f(this, Qe)), F.oncommit(() => {
      Y(this, se, Ln).call(this, t);
    })) : Y(this, se, Ln).call(this, t);
  }
}
at = new WeakMap(), Gn = new WeakMap(), st = new WeakMap(), tr = new WeakMap(), qe = new WeakMap(), it = new WeakMap(), Le = new WeakMap(), Qe = new WeakMap(), Ft = new WeakMap(), rr = new WeakMap(), Ut = new WeakMap(), wr = new WeakMap(), Gr = new WeakMap(), Kr = new WeakMap(), It = new WeakMap(), wn = new WeakMap(), se = new WeakSet(), si = function() {
  try {
    C(this, it, mt(() => f(this, tr).call(this, f(this, at))));
  } catch (t) {
    this.error(t);
  }
}, /**
 * @param {unknown} error The deserialized error from the server's hydration comment
 */
ii = function(t) {
  const r = f(this, st).failed, { reset: n, invoke_onerror: a } = Y(this, se, Rn).call(this, t);
  Lt(a), r && C(this, Qe, mt(() => {
    r(
      f(this, at),
      () => t,
      () => n
    );
  }));
}, /**
 * Creates the `reset` function for a failed boundary, along with a function
 * that invokes `onerror` with it (if provided)
 * @param {unknown} error
 * @returns {{ reset: () => void, invoke_onerror: () => void }}
 */
Rn = function(t) {
  var r = !1, n = !1;
  const a = () => {
    if (r) {
      Zs();
      return;
    }
    r = !0, n && Vs(), f(this, Qe) !== null && lr(f(this, Qe), () => {
      C(this, Qe, null);
    }), Y(this, se, fn).call(this, () => {
      Y(this, se, Pn).call(this);
    });
  };
  return { reset: a, invoke_onerror: () => {
    var l, o;
    try {
      n = !0, (o = (l = f(this, st)).onerror) == null || o.call(l, t, a), n = !1;
    } catch (u) {
      Kt(u, f(this, qe) && f(this, qe).parent);
    }
  } };
}, li = function() {
  const t = f(this, st).pending;
  t && (this.is_pending = !0, C(this, Le, mt(() => t(f(this, at)))), Lt(() => {
    var r = C(this, Ft, document.createDocumentFragment()), n = ir();
    r.append(n), C(this, it, Y(this, se, fn).call(this, () => mt(() => f(this, tr).call(this, n)))), f(this, Ut) === 0 && (f(this, at).before(r), C(this, Ft, null), lr(
      /** @type {Effect} */
      f(this, Le),
      () => {
        C(this, Le, null);
      }
    ), Y(this, se, on).call(
      this,
      /** @type {Batch} */
      F
    ));
  }));
}, Pn = function() {
  try {
    if (this.is_pending = this.has_pending_snippet(), C(this, Ut, 0), C(this, rr, 0), C(this, it, mt(() => {
      f(this, tr).call(this, f(this, at));
    })), f(this, Ut) > 0) {
      var t = C(this, Ft, document.createDocumentFragment());
      sa(f(this, it), t);
      const r = (
        /** @type {(anchor: Node) => void} */
        f(this, st).pending
      );
      C(this, Le, mt(() => r(f(this, at))));
    } else
      Y(this, se, on).call(
        this,
        /** @type {Batch} */
        F
      );
  } catch (r) {
    this.error(r);
  }
}, /**
 * @param {Batch} batch
 */
on = function(t) {
  this.is_pending = !1, t.transfer_effects(f(this, Gr), f(this, Kr));
}, /**
 * @template T
 * @param {() => T} fn
 */
fn = function(t) {
  var r = H, n = B, a = He;
  At(f(this, qe)), ut(f(this, qe)), Tr(f(this, qe).ctx);
  try {
    return ur.ensure(), t();
  } catch (i) {
    return Ia(i), null;
  } finally {
    At(r), ut(n), Tr(a);
  }
}, /**
 * Updates the pending count associated with the currently visible pending snippet,
 * if any, such that we can replace the snippet with content once work is done
 * @param {1 | -1} d
 * @param {Batch} batch
 */
Dn = function(t, r) {
  var n;
  if (!this.has_pending_snippet()) {
    this.parent && Y(n = this.parent, se, Dn).call(n, t, r);
    return;
  }
  C(this, Ut, f(this, Ut) + t), f(this, Ut) === 0 && (Y(this, se, on).call(this, r), f(this, Le) && lr(f(this, Le), () => {
    C(this, Le, null);
  }), f(this, Ft) && (f(this, at).before(f(this, Ft)), C(this, Ft, null)));
}, /**
 * @param {unknown} error
 */
Ln = function(t) {
  f(this, it) && (Ke(f(this, it)), C(this, it, null)), f(this, Le) && (Ke(f(this, Le)), C(this, Le, null)), f(this, Qe) && (Ke(f(this, Qe)), C(this, Qe, null));
  let r = f(this, st).failed;
  const n = (a) => {
    const { reset: i, invoke_onerror: l } = Y(this, se, Rn).call(this, a);
    l(), r && C(this, Qe, Y(this, se, fn).call(this, () => {
      try {
        return mt(() => {
          var o = (
            /** @type {Effect} */
            H
          );
          o.b = this, o.f |= Fn, r(
            f(this, at),
            () => a,
            () => i
          );
        });
      } catch (o) {
        return Kt(
          o,
          /** @type {Effect} */
          f(this, qe).parent
        ), null;
      }
    }));
  };
  Lt(() => {
    var a;
    try {
      a = this.transform_error(t);
    } catch (i) {
      Kt(i, f(this, qe) && f(this, qe).parent);
      return;
    }
    a !== null && typeof a == "object" && typeof /** @type {any} */
    a.then == "function" ? a.then(
      n,
      /** @param {unknown} e */
      (i) => Kt(i, f(this, qe) && f(this, qe).parent)
    ) : n(a);
  });
};
function oi(e, t, r, n) {
  const a = Zn;
  var i = e.filter((h) => !h.settled), l = t.map(a);
  if (r.length === 0 && i.length === 0) {
    n(l);
    return;
  }
  var o = (
    /** @type {Effect} */
    H
  ), u = fi(), c = i.length === 1 ? i[0].promise : i.length > 1 ? Promise.all(i.map((h) => h.promise)) : null;
  function v(h) {
    if ((o.f & ot) === 0) {
      u();
      try {
        n([...l, ...h]);
      } catch (p) {
        Kt(p, o);
      }
      gn();
    }
  }
  var w = Pa();
  if (r.length === 0) {
    c.then(() => v([])).finally(w);
    return;
  }
  function d() {
    Promise.all(r.map((h) => /* @__PURE__ */ ui(h))).then(v).catch((h) => Kt(h, o)).finally(w);
  }
  c ? c.then(() => {
    u(), d(), gn();
  }) : d();
}
function fi() {
  var e = (
    /** @type {Effect} */
    H
  ), t = B, r = He, n = (
    /** @type {Batch} */
    F
  );
  return function(i = !0) {
    At(e), ut(t), Tr(r), i && (e.f & ot) === 0 && (n == null || n.activate(), n == null || n.apply());
  };
}
function gn(e = !0) {
  At(null), ut(null), Tr(null), e && (F == null || F.deactivate());
}
function Pa() {
  var e = (
    /** @type {Effect} */
    H
  ), t = e.b, r = (
    /** @type {Batch} */
    F
  ), n = !!(t != null && t.is_rendered());
  return t == null || t.update_pending_count(1, r), r.increment(n, e), () => {
    t == null || t.update_pending_count(-1, r), r.decrement(n, e);
  };
}
// @__NO_SIDE_EFFECTS__
function Zn(e) {
  var t = Te | ze;
  return H !== null && (H.f |= Cr), {
    ctx: He,
    deps: null,
    effects: null,
    equals: Aa,
    f: t,
    fn: e,
    reactions: null,
    rv: 0,
    v: (
      /** @type {V} */
      ye
    ),
    wv: 0,
    parent: H,
    ac: null
  };
}
const Pr = Symbol("obsolete");
// @__NO_SIDE_EFFECTS__
function ui(e, t, r) {
  let n = (
    /** @type {Effect | null} */
    H
  );
  n === null && Fs();
  var a = (
    /** @type {Promise<V>} */
    /** @type {unknown} */
    void 0
  ), i = cr(
    /** @type {V} */
    ye
  ), l = !B, o = /* @__PURE__ */ new Set();
  return ji(() => {
    var h, p;
    var u = (
      /** @type {Effect} */
      H
    ), c = ja();
    a = c.promise;
    try {
      Promise.resolve(e()).then(c.resolve, (x) => {
        x !== Zr && c.reject(x);
      }).finally(gn);
    } catch (x) {
      c.reject(x), gn();
    }
    var v = (
      /** @type {Batch} */
      F
    );
    if (l) {
      if ((u.f & Ar) !== 0)
        var w = Pa();
      if (
        // boundary can be null if the async derived is inside an $effect.root not connected to the component render tree
        (h = n.b) != null && h.is_rendered()
      )
        (p = v.async_deriveds.get(u)) == null || p.reject(Pr);
      else
        for (const x of o.values())
          x.reject(Pr);
      o.add(c), v.async_deriveds.set(u, c);
    }
    const d = (x, g = void 0) => {
      w == null || w(), o.delete(c), g !== Pr && (v.activate(), g ? (i.f |= Xt, Or(i, g)) : ((i.f & Xt) !== 0 && (i.f ^= Xt), Or(i, x)), v.deactivate());
    };
    c.promise.then(d, (x) => d(null, x || "unknown"));
  }), ra(() => {
    for (const u of o)
      u.reject(Pr);
  }), new Promise((u) => {
    function c(v) {
      function w() {
        v === a ? u(i) : c(a);
      }
      v.then(w, w);
    }
    c(a);
  });
}
// @__NO_SIDE_EFFECTS__
function O(e) {
  const t = /* @__PURE__ */ Zn(e);
  return rs(t), t;
}
// @__NO_SIDE_EFFECTS__
function ci(e) {
  const t = /* @__PURE__ */ Zn(e);
  return t.equals = Ca, t;
}
function di(e) {
  var t = e.effects;
  if (t !== null) {
    e.effects = null;
    for (var r = 0; r < t.length; r += 1)
      Ke(
        /** @type {Effect} */
        t[r]
      );
  }
}
function Qn(e) {
  var t, r = H, n = e.parent;
  if (!Jt && n !== null && e.v !== ye && // if it was never evaluated before, it's guaranteed to fail downstream, so we try to execute instead
  (n.f & (ot | Be)) !== 0)
    return Xs(), e.v;
  At(n);
  try {
    e.f &= ~fr, di(e), t = is(e);
  } finally {
    At(r);
  }
  return t;
}
function Da(e) {
  var t = Qn(e);
  if (!e.equals(t) && (e.wv = as(), (!(F != null && F.is_fork) || e.deps === null) && (F !== null ? (F.capture(e, t, !0), Yr == null || Yr.capture(e, t, !0)) : e.v = t, e.deps === null))) {
    ce(e, ke);
    return;
  }
  Jt || (Ce !== null ? (ta() || F != null && F.is_fork) && Ce.set(e, t) : Jn(e));
}
function vi(e) {
  var t;
  if (e.effects !== null)
    for (const r of e.effects)
      (r.teardown || r.ac) && ((t = r.teardown) == null || t.call(r), r.ac !== null && Qr(() => {
        r.ac.abort(Zr), r.ac = null;
      }), r.fn !== null && (r.teardown = Es), qr(r, 0), aa(r));
}
function La(e) {
  if (e.effects !== null)
    for (const t of e.effects)
      t.teardown && t.fn !== null && Mr(t);
}
let Tn = null, vr = null, F = null, Yr = null, Ce = null, Bn = null, On = !1, pr = null, un = null;
var ua = 0;
let hi = 1;
var br, Gt, nr, xr, yr, kr, Nt, zr, Ue, Xr, Rt, gt, St, Er, ar, J, Hn, Dr, Vn, Ba, Ha, hr, gi, Lr;
const bn = class bn {
  constructor() {
    I(this, J);
    Je(this, "id", hi++);
    /** True as soon as `#process` was called */
    I(this, br, !1);
    Je(this, "linked", !0);
    /** @type {Batch | null} */
    I(this, Gt, null);
    /** @type {Batch | null} */
    I(this, nr, null);
    /** @type {Map<Effect, ReturnType<typeof deferred<any>>>} */
    Je(this, "async_deriveds", /* @__PURE__ */ new Map());
    /**
     * The current values of any signals that are updated in this batch.
     * Tuple format: [value, is_derived] (note: is_derived is false for deriveds, too, if they were overridden via assignment)
     * They keys of this map are identical to `this.#previous`
     * @type {Map<Value, [any, boolean]>}
     */
    Je(this, "current", /* @__PURE__ */ new Map());
    /**
     * The values of any signals (sources and deriveds) that are updated in this batch _before_ those updates took place.
     * They keys of this map are identical to `this.#current`
     * @type {Map<Value, any>}
     */
    Je(this, "previous", /* @__PURE__ */ new Map());
    /**
     * When the batch is committed (and the DOM is updated), we need to remove old branches
     * and append new ones by calling the functions added inside (if/each/key/etc) blocks
     * @type {Set<(batch: Batch) => void>}
     */
    I(this, xr, /* @__PURE__ */ new Set());
    /**
     * If a fork is discarded, we need to destroy any effects that are no longer needed
     * @type {Set<(batch: Batch) => void>}
     */
    I(this, yr, /* @__PURE__ */ new Set());
    /**
     * The number of async effects that are currently in flight
     */
    I(this, kr, 0);
    /**
     * Async effects that are currently in flight, _not_ inside a pending boundary
     * @type {Map<Effect, number>}
     */
    I(this, Nt, /* @__PURE__ */ new Map());
    /**
     * A deferred that resolves when the batch is committed, used with `settled()`
     * TODO replace with Promise.withResolvers once supported widely enough
     * @type {{ promise: Promise<void>, resolve: (value?: any) => void, reject: (reason: unknown) => void } | null}
     */
    I(this, zr, null);
    /**
     * The root effects that need to be flushed
     * @type {Effect[]}
     */
    I(this, Ue, []);
    /**
     * Effects created while this batch was active.
     * @type {Effect[]}
     */
    I(this, Xr, []);
    /**
     * Deferred effects (which run after async work has completed) that are DIRTY
     * @type {Set<Effect>}
     */
    I(this, Rt, /* @__PURE__ */ new Set());
    /**
     * Deferred effects that are MAYBE_DIRTY
     * @type {Set<Effect>}
     */
    I(this, gt, /* @__PURE__ */ new Set());
    /**
     * A map of branches that still exist, but will be destroyed when this batch
     * is committed — we skip over these during `process`.
     * The value contains child effects that were dirty/maybe_dirty before being reset,
     * so they can be rescheduled if the branch survives.
     * @type {Map<Effect, { d: Effect[], m: Effect[] }>}
     */
    I(this, St, /* @__PURE__ */ new Map());
    /**
     * Inverse of #skipped_branches which we need to tell prior batches to unskip them when committing
     * @type {Set<Effect>}
     */
    I(this, Er, /* @__PURE__ */ new Set());
    Je(this, "is_fork", !1);
    I(this, ar, !1);
    vr === null ? Tn = vr = this : (C(vr, nr, this), C(this, Gt, vr)), vr = this;
  }
  /**
   * Add an effect to the #skipped_branches map and reset its children
   * @param {Effect} effect
   */
  skip_effect(t) {
    f(this, St).has(t) || f(this, St).set(t, { d: [], m: [] }), f(this, Er).delete(t);
  }
  /**
   * Remove an effect from the #skipped_branches map and reschedule
   * any tracked dirty/maybe_dirty child effects
   * @param {Effect} effect
   * @param {(e: Effect) => void} callback
   */
  unskip_effect(t, r = (n) => this.schedule(n)) {
    var n = f(this, St).get(t);
    if (n) {
      f(this, St).delete(t);
      for (var a of n.d)
        ce(a, ze), r(a);
      for (a of n.m)
        ce(a, xt), r(a);
    }
    f(this, Er).add(t);
  }
  /**
   * Associate a change to a given source with the current
   * batch, noting its previous and current values
   * @param {Value} source
   * @param {any} value
   * @param {boolean} [is_derived]
   */
  capture(t, r, n = !1) {
    t.v !== ye && !this.previous.has(t) && this.previous.set(t, t.v), (t.f & Xt) === 0 && (this.current.set(t, [r, n]), Ce == null || Ce.set(t, r)), this.is_fork || (t.v = r);
  }
  activate() {
    F = this;
  }
  deactivate() {
    F = null, Ce = null;
  }
  flush() {
    try {
      On = !0, F = this, Y(this, J, Dr).call(this);
    } finally {
      ua = 0, Bn = null, pr = null, un = null, On = !1, F = null, Ce = null, Tt.clear();
    }
  }
  discard() {
    var t;
    for (const r of f(this, yr)) r(this);
    f(this, yr).clear();
    for (const r of this.async_deriveds.values())
      r.reject(Pr);
    Y(this, J, Lr).call(this), (t = f(this, zr)) == null || t.resolve();
  }
  /**
   * @param {Effect} effect
   */
  register_created_effect(t) {
    f(this, Xr).push(t);
  }
  /**
   * @param {boolean} blocking
   * @param {Effect} effect
   */
  increment(t, r) {
    if (C(this, kr, f(this, kr) + 1), t) {
      let n = f(this, Nt).get(r) ?? 0;
      f(this, Nt).set(r, n + 1);
    }
  }
  /**
   * @param {boolean} blocking
   * @param {Effect} effect
   */
  decrement(t, r) {
    if (C(this, kr, f(this, kr) - 1), t) {
      let n = f(this, Nt).get(r) ?? 0;
      n === 1 ? f(this, Nt).delete(r) : f(this, Nt).set(r, n - 1);
    }
    f(this, ar) || (C(this, ar, !0), Lt(() => {
      C(this, ar, !1), this.linked && this.flush();
    }));
  }
  /**
   * @param {Set<Effect>} dirty_effects
   * @param {Set<Effect>} maybe_dirty_effects
   */
  transfer_effects(t, r) {
    for (const n of t)
      f(this, Rt).add(n);
    for (const n of r)
      f(this, gt).add(n);
    t.clear(), r.clear();
  }
  /** @param {(batch: Batch) => void} fn */
  oncommit(t) {
    f(this, xr).add(t);
  }
  /** @param {(batch: Batch) => void} fn */
  ondiscard(t) {
    f(this, yr).add(t);
  }
  settled() {
    return (f(this, zr) ?? C(this, zr, ja())).promise;
  }
  static ensure() {
    if (F === null) {
      const t = F = new bn();
      On || Lt(() => {
        f(t, br) || t.flush();
      });
    }
    return F;
  }
  apply() {
    {
      Ce = null;
      return;
    }
  }
  /**
   *
   * @param {Effect} effect
   */
  schedule(t) {
    var a;
    if (Bn = t, (a = t.b) != null && a.is_pending && (t.f & (Sr | kn | Ta)) !== 0 && (t.f & Ar) === 0) {
      t.b.defer_effect(t);
      return;
    }
    for (var r = t; r.parent !== null; ) {
      r = r.parent;
      var n = r.f;
      if (pr !== null && r === H && (B === null || (B.f & Te) === 0))
        return;
      if ((n & (Bt | ft)) !== 0) {
        if ((n & ke) === 0)
          return;
        r.f ^= ke;
      }
    }
    f(this, Ue).push(r);
  }
};
br = new WeakMap(), Gt = new WeakMap(), nr = new WeakMap(), xr = new WeakMap(), yr = new WeakMap(), kr = new WeakMap(), Nt = new WeakMap(), zr = new WeakMap(), Ue = new WeakMap(), Xr = new WeakMap(), Rt = new WeakMap(), gt = new WeakMap(), St = new WeakMap(), Er = new WeakMap(), ar = new WeakMap(), J = new WeakSet(), Hn = function() {
  if (this.is_fork) return !0;
  for (const n of f(this, Nt).keys()) {
    for (var t = n, r = !1; t.parent !== null; ) {
      if (f(this, St).has(t)) {
        r = !0;
        break;
      }
      t = t.parent;
    }
    if (!r)
      return !0;
  }
  return !1;
}, Dr = function() {
  var u, c, v, w;
  C(this, br, !0), ua++ > 1e3 && (Y(this, J, Lr).call(this), pi());
  for (const d of f(this, Rt))
    f(this, gt).delete(d), ce(d, ze), this.schedule(d);
  for (const d of f(this, gt))
    ce(d, xt), this.schedule(d);
  const t = f(this, Ue);
  C(this, Ue, []), this.apply();
  var r = pr = [], n = [], a = un = [];
  for (const d of t)
    try {
      Y(this, J, Vn).call(this, d, r, n);
    } catch (h) {
      throw Wa(d), Y(this, J, Hn).call(this) || this.discard(), h;
    }
  if (F = null, a.length > 0) {
    var i = bn.ensure();
    for (const d of a)
      i.schedule(d);
  }
  if (pr = null, un = null, Y(this, J, Hn).call(this)) {
    Y(this, J, hr).call(this, n), Y(this, J, hr).call(this, r);
    for (const [d, h] of f(this, St))
      Ya(d, h);
    a.length > 0 && /** @type {unknown} */
    Y(u = F, J, Dr).call(u);
    return;
  }
  const l = Y(this, J, Ba).call(this);
  if (l) {
    Y(this, J, hr).call(this, n), Y(this, J, hr).call(this, r), Y(c = l, J, Ha).call(c, this);
    return;
  }
  f(this, Rt).clear(), f(this, gt).clear();
  for (const d of f(this, xr)) d(this);
  f(this, xr).clear(), Yr = this, ca(n), ca(r), Yr = null, (v = f(this, zr)) == null || v.resolve();
  var o = (
    /** @type {Batch | null} */
    /** @type {unknown} */
    F
  );
  if (f(this, kr) === 0 && (f(this, Ue).length === 0 || o !== null) && Y(this, J, Lr).call(this), f(this, Ue).length > 0)
    if (o !== null) {
      const d = o;
      f(d, Ue).push(...f(this, Ue).filter((h) => !f(d, Ue).includes(h)));
    } else
      o = this;
  o !== null && (Tt.clear(), Y(w = o, J, Dr).call(w));
}, /**
 * Traverse the effect tree, executing effects or stashing
 * them for later execution as appropriate
 * @param {Effect} root
 * @param {Effect[]} effects
 * @param {Effect[]} render_effects
 */
Vn = function(t, r, n) {
  t.f ^= ke;
  for (var a = t.first; a !== null; ) {
    var i = a.f, l = (i & (ft | Bt)) !== 0, o = l && (i & ke) !== 0, u = o || (i & Be) !== 0 || f(this, St).has(a);
    if (!u && a.fn !== null) {
      l ? a.f ^= ke : (i & Sr) !== 0 ? r.push(a) : en(a) && ((i & wt) !== 0 && f(this, gt).add(a), Mr(a));
      var c = a.first;
      if (c !== null) {
        a = c;
        continue;
      }
    }
    for (; a !== null; ) {
      var v = a.next;
      if (v !== null) {
        a = v;
        break;
      }
      a = a.parent;
    }
  }
}, Ba = function() {
  for (var t = f(this, Gt); t !== null; ) {
    if (!t.is_fork) {
      for (const [r, [, n]] of this.current)
        if (t.current.has(r) && !n)
          return t;
    }
    t = f(t, Gt);
  }
  return null;
}, /**
 * @param {Batch} batch
 */
Ha = function(t) {
  var n;
  for (const [a, i] of t.current)
    !this.previous.has(a) && t.previous.has(a) && this.previous.set(a, t.previous.get(a)), this.current.set(a, i);
  for (const [a, i] of t.async_deriveds) {
    const l = this.async_deriveds.get(a);
    l && i.promise.then(l.resolve).catch(l.reject);
  }
  t.async_deriveds.clear(), this.transfer_effects(f(t, Rt), f(t, gt));
  const r = (a) => {
    var i = a.reactions;
    if (i !== null && !((a.f & Te) !== 0 && (a.f & (ze | xt)) === 0))
      for (const u of i) {
        var l = u.f;
        if ((l & Te) !== 0)
          r(
            /** @type {Derived} */
            u
          );
        else {
          var o = (
            /** @type {Effect} */
            u
          );
          l & (mr | wt) && !this.async_deriveds.has(o) && (f(this, gt).delete(o), ce(o, ze), this.schedule(o));
        }
      }
  };
  for (const a of this.current.keys())
    r(a);
  this.oncommit(() => t.discard()), Y(n = t, J, Lr).call(n), F = this, Y(this, J, Dr).call(this);
}, /**
 * @param {Effect[]} effects
 */
hr = function(t) {
  for (var r = 0; r < t.length; r += 1)
    Ra(t[r], f(this, Rt), f(this, gt));
}, gi = function() {
  var w;
  for (let d = Tn; d !== null; d = f(d, nr)) {
    var t = d.id < this.id, r = [];
    for (const [h, [p, x]] of this.current) {
      if (d.current.has(h)) {
        var n = (
          /** @type {[any, boolean]} */
          d.current.get(h)[0]
        );
        if (t && p !== n)
          d.current.set(h, [p, x]);
        else
          continue;
      }
      r.push(h);
    }
    if (t)
      for (const [h, p] of this.async_deriveds) {
        const x = d.async_deriveds.get(h);
        x && p.promise.then(x.resolve).catch(x.reject);
      }
    var a = [...d.current.keys()].filter(
      (h) => !/** @type {[any, boolean]} */
      d.current.get(h)[1]
    );
    if (!(!f(d, br) || a.length === 0)) {
      var i = a.filter((h) => !this.current.has(h));
      if (i.length === 0)
        t && d.discard();
      else if (r.length > 0) {
        if (t)
          for (const h of f(this, Er))
            d.unskip_effect(h, (p) => {
              var x;
              (p.f & (wt | mr)) !== 0 ? d.schedule(p) : Y(x = d, J, hr).call(x, [p]);
            });
        d.activate();
        var l = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Map();
        for (var u of r)
          Va(u, i, l, o);
        o = /* @__PURE__ */ new Map();
        var c = [...d.current].filter(([h, p]) => {
          const x = this.current.get(h);
          return x ? x[0] !== p[0] || x[1] !== p[1] : !0;
        }).map(([h]) => h);
        if (c.length > 0)
          for (const h of f(this, Xr))
            (h.f & (ot | Be | vn)) === 0 && $n(h, c, o) && ((h.f & (mr | wt)) !== 0 ? (ce(h, ze), d.schedule(h)) : f(d, Rt).add(h));
        if (f(d, Ue).length > 0 && !f(d, ar)) {
          d.apply();
          for (var v of f(d, Ue))
            Y(w = d, J, Vn).call(w, v, [], []);
          C(d, Ue, []);
        }
        d.deactivate();
      }
    }
  }
}, Lr = function() {
  if (this.linked) {
    var t = f(this, Gt), r = f(this, nr);
    t === null ? Tn = r : C(t, nr, r), r === null ? vr = t : C(r, Gt, t), this.linked = !1;
  }
};
let ur = bn;
function pi() {
  try {
    Ds();
  } catch (e) {
    Kt(e, Bn);
  }
}
let ht = null;
function ca(e) {
  var t = e.length;
  if (t !== 0) {
    for (var r = 0; r < t; ) {
      var n = e[r++];
      if ((n.f & (ot | Be)) === 0 && en(n) && (ht = /* @__PURE__ */ new Set(), Mr(n), n.deps === null && n.first === null && n.nodes === null && n.teardown === null && n.ac === null && $a(n), (ht == null ? void 0 : ht.size) > 0)) {
        Tt.clear();
        for (const a of ht) {
          if ((a.f & (ot | Be)) !== 0) continue;
          const i = [a];
          let l = a.parent;
          for (; l !== null; )
            ht.has(l) && (ht.delete(l), i.push(l)), l = l.parent;
          for (let o = i.length - 1; o >= 0; o--) {
            const u = i[o];
            (u.f & (ot | Be)) === 0 && Mr(u);
          }
        }
        ht.clear();
      }
    }
    ht = null;
  }
}
function Va(e, t, r, n) {
  if (!r.has(e) && (r.add(e), e.reactions !== null))
    for (const a of e.reactions) {
      const i = a.f;
      (i & Te) !== 0 ? Va(
        /** @type {Derived} */
        a,
        t,
        r,
        n
      ) : (i & (mr | wt)) !== 0 && (i & ze) === 0 && $n(a, t, n) && (ce(a, ze), ea(
        /** @type {Effect} */
        a
      ));
    }
}
function $n(e, t, r) {
  const n = r.get(e);
  if (n !== void 0) return n;
  if (e.deps !== null)
    for (const a of e.deps) {
      if (dn.call(t, a))
        return !0;
      if ((a.f & Te) !== 0 && $n(
        /** @type {Derived} */
        a,
        t,
        r
      ))
        return r.set(
          /** @type {Derived} */
          a,
          !0
        ), !0;
    }
  return r.set(e, !1), !1;
}
function ea(e) {
  F.schedule(e);
}
function Ya(e, t) {
  if (!((e.f & ft) !== 0 && (e.f & ke) !== 0)) {
    (e.f & ze) !== 0 ? t.d.push(e) : (e.f & xt) !== 0 && t.m.push(e), ce(e, ke);
    for (var r = e.first; r !== null; )
      Ya(r, t), r = r.next;
  }
}
function Wa(e) {
  ce(e, ke);
  for (var t = e.first; t !== null; )
    Wa(t), t = t.next;
}
let pn = /* @__PURE__ */ new Set();
const Tt = /* @__PURE__ */ new Map();
let qa = !1;
function cr(e, t) {
  var r = {
    f: 0,
    // TODO ideally we could skip this altogether, but it causes type errors
    v: e,
    reactions: null,
    equals: Aa,
    rv: 0,
    wv: 0
  };
  return r;
}
// @__NO_SIDE_EFFECTS__
function je(e, t) {
  const r = cr(e);
  return rs(r), r;
}
// @__NO_SIDE_EFFECTS__
function _i(e, t = !1, r = !0) {
  const n = cr(e);
  return t || (n.equals = Ca), n;
}
function Z(e, t, r = !1) {
  B !== null && // since we are untracking the function inside `$inspect.with` we need to add this check
  // to ensure we error if state is set inside an inspect effect
  (!bt || (B.f & vn) !== 0) && Fa() && (B.f & (Te | wt | mr | vn)) !== 0 && (Ot === null || !Ot.has(e)) && Hs();
  let n = r ? _r(t) : t;
  return Or(e, n, un);
}
function Or(e, t, r = null) {
  if (!e.equals(t)) {
    Jt ? Tt.set(e, t) : Tt.has(e) || Tt.set(e, e.v);
    var n = ur.ensure();
    if (n.capture(e, t), (e.f & Te) !== 0) {
      const a = (
        /** @type {Derived} */
        e
      );
      (e.f & ze) !== 0 && Qn(a), Ce === null && Jn(a);
    }
    e.wv = as(), Ua(e, ze, r), H !== null && (H.f & ke) !== 0 && (H.f & (ft | Bt)) === 0 && (nt === null ? Ai([e]) : nt.push(e)), !n.is_fork && pn.size > 0 && !qa && mi();
  }
  return t;
}
function mi() {
  qa = !1;
  for (const e of pn) {
    (e.f & ke) !== 0 && ce(e, xt);
    let t;
    try {
      t = en(e);
    } catch {
      t = !0;
    }
    t && Mr(e);
  }
  pn.clear();
}
function Wr(e) {
  Z(e, e.v + 1);
}
function Ua(e, t, r) {
  var n = e.reactions;
  if (n !== null)
    for (var a = n.length, i = 0; i < a; i++) {
      var l = n[i], o = l.f, u = (o & ze) === 0;
      if (u && ce(l, t), (o & vn) !== 0)
        pn.add(
          /** @type {Effect} */
          l
        );
      else if ((o & Te) !== 0) {
        var c = (
          /** @type {Derived} */
          l
        );
        Ce == null || Ce.delete(c), (o & fr) === 0 && (o & lt && (H === null || (H.f & hn) === 0) && (l.f |= fr), Ua(c, xt, r));
      } else if (u) {
        var v = (
          /** @type {Effect} */
          l
        );
        (o & wt) !== 0 && ht !== null && ht.add(v), r !== null ? r.push(v) : ea(v);
      }
    }
}
function _r(e) {
  if (typeof e != "object" || e === null || Vr in e)
    return e;
  const t = Sa(e);
  if (t !== ks && t !== zs)
    return e;
  var r = /* @__PURE__ */ new Map(), n = Xn(e), a = /* @__PURE__ */ je(0), i = or, l = (o) => {
    if (or === i)
      return o();
    var u = B, c = or;
    ut(null), ga(i);
    var v = o();
    return ut(u), ga(c), v;
  };
  return n && r.set("length", /* @__PURE__ */ je(
    /** @type {any[]} */
    e.length
  )), new Proxy(
    /** @type {any} */
    e,
    {
      defineProperty(o, u, c) {
        (!("value" in c) || c.configurable === !1 || c.enumerable === !1 || c.writable === !1) && Ls();
        var v = r.get(u);
        return v === void 0 ? l(() => {
          var w = /* @__PURE__ */ je(c.value);
          return r.set(u, w), w;
        }) : Z(v, c.value, !0), !0;
      },
      deleteProperty(o, u) {
        var c = r.get(u);
        if (c === void 0) {
          if (u in o) {
            const v = l(() => /* @__PURE__ */ je(ye));
            r.set(u, v), Wr(a);
          }
        } else
          Z(c, ye), Wr(a);
        return !0;
      },
      get(o, u, c) {
        var h;
        if (u === Vr)
          return e;
        var v = r.get(u), w = u in o;
        if (v === void 0 && (!w || (h = Hr(o, u)) != null && h.writable) && (v = l(() => {
          var p = _r(w ? o[u] : ye), x = /* @__PURE__ */ je(p);
          return x;
        }), r.set(u, v)), v !== void 0) {
          var d = s(v);
          return d === ye ? void 0 : d;
        }
        return Reflect.get(o, u, c);
      },
      getOwnPropertyDescriptor(o, u) {
        var c = Reflect.getOwnPropertyDescriptor(o, u);
        if (c && "value" in c) {
          var v = r.get(u);
          v && (c.value = s(v));
        } else if (c === void 0) {
          var w = r.get(u), d = w == null ? void 0 : w.v;
          if (w !== void 0 && d !== ye)
            return {
              enumerable: !0,
              configurable: !0,
              value: d,
              writable: !0
            };
        }
        return c;
      },
      has(o, u) {
        var d;
        if (u === Vr)
          return !0;
        var c = r.get(u), v = c !== void 0 && c.v !== ye || Reflect.has(o, u);
        if (c !== void 0 || H !== null && (!v || (d = Hr(o, u)) != null && d.writable)) {
          c === void 0 && (c = l(() => {
            var h = v ? _r(o[u]) : ye, p = /* @__PURE__ */ je(h);
            return p;
          }), r.set(u, c));
          var w = s(c);
          if (w === ye)
            return !1;
        }
        return v;
      },
      set(o, u, c, v) {
        var V;
        var w = r.get(u), d = u in o;
        if (n && u === "length")
          for (var h = c; h < /** @type {Source<number>} */
          w.v; h += 1) {
            var p = r.get(h + "");
            p !== void 0 ? Z(p, ye) : h in o && (p = l(() => /* @__PURE__ */ je(ye)), r.set(h + "", p));
          }
        if (w === void 0)
          (!d || (V = Hr(o, u)) != null && V.writable) && (w = l(() => /* @__PURE__ */ je(void 0)), Z(w, _r(c)), r.set(u, w));
        else {
          d = w.v !== ye;
          var x = l(() => _r(c));
          Z(w, x);
        }
        var g = Reflect.getOwnPropertyDescriptor(o, u);
        if (g != null && g.set && g.set.call(v, c), !d) {
          if (n && typeof u == "string") {
            var _ = (
              /** @type {Source<number>} */
              r.get("length")
            ), W = Number(u);
            Number.isInteger(W) && W >= _.v && Z(_, W + 1);
          }
          Wr(a);
        }
        return !0;
      },
      ownKeys(o) {
        s(a);
        var u = Reflect.ownKeys(o).filter((w) => {
          var d = r.get(w);
          return d === void 0 || d.v !== ye;
        });
        for (var [c, v] of r)
          v.v !== ye && !(c in o) && u.push(c);
        return u;
      },
      setPrototypeOf() {
        Bs();
      }
    }
  );
}
function da(e) {
  try {
    if (e !== null && typeof e == "object" && Vr in e)
      return e[Vr];
  } catch {
  }
  return e;
}
function wi(e, t) {
  return Object.is(da(e), da(t));
}
var va, Ga, Ka, Xa;
function bi() {
  if (va === void 0) {
    va = window, Ga = /Firefox/.test(navigator.userAgent);
    var e = Element.prototype, t = Node.prototype, r = Text.prototype;
    Ka = Hr(t, "firstChild").get, Xa = Hr(t, "nextSibling").get, oa(e) && (e[In] = void 0, e[ln] = null, e[Nn] = void 0, e.__e = void 0), oa(r) && (r[Rr] = void 0);
  }
}
function ir(e = "") {
  return document.createTextNode(e);
}
// @__NO_SIDE_EFFECTS__
function Dt(e) {
  return (
    /** @type {TemplateNode | null} */
    Ka.call(e)
  );
}
// @__NO_SIDE_EFFECTS__
function $r(e) {
  return (
    /** @type {TemplateNode | null} */
    Xa.call(e)
  );
}
function m(e, t) {
  return /* @__PURE__ */ Dt(e);
}
function pe(e, t = !1) {
  {
    var r = /* @__PURE__ */ Dt(e);
    return r instanceof Comment && r.data === "" ? /* @__PURE__ */ $r(r) : r;
  }
}
function y(e, t = 1, r = !1) {
  let n = e;
  for (; t--; )
    n = /** @type {TemplateNode} */
    /* @__PURE__ */ $r(n);
  return n;
}
function xi(e) {
  e.textContent = "";
}
function Ja(e, t, r) {
  return (
    /** @type {T extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T] : Element} */
    r ? document.createElement(e, { is: r }) : document.createElement(e)
  );
}
function yi(e) {
  H === null && (B === null && Ps(), Rs()), Jt && Ns();
}
function ki(e, t) {
  var r = t.last;
  r === null ? t.last = t.first = e : (r.next = e, e.prev = r, t.last = e);
}
function Ht(e, t) {
  var r = H;
  r !== null && (r.f & Be) !== 0 && (e |= Be);
  var n = {
    ctx: He,
    deps: null,
    nodes: null,
    f: e | ze | lt,
    first: null,
    fn: t,
    last: null,
    next: null,
    parent: r,
    b: r && r.b,
    prev: null,
    teardown: null,
    wv: 0,
    ac: null
  };
  F == null || F.register_created_effect(n);
  var a = n;
  if ((e & Sr) !== 0)
    pr !== null ? pr.push(n) : ur.ensure().schedule(n);
  else if (t !== null) {
    try {
      Mr(n);
    } catch (l) {
      throw Ke(n), l;
    }
    a.deps === null && a.teardown === null && a.nodes === null && a.first === a.last && // either `null`, or a singular child
    (a.f & Cr) === 0 && (a = a.first, (e & wt) !== 0 && (e & jr) !== 0 && a !== null && (a.f |= jr));
  }
  if (a !== null && (a.parent = r, r !== null && ki(a, r), B !== null && (B.f & Te) !== 0 && (e & Bt) === 0)) {
    var i = (
      /** @type {Derived} */
      B
    );
    (i.effects ?? (i.effects = [])).push(a);
  }
  return n;
}
function ta() {
  return B !== null && !bt;
}
function ra(e) {
  const t = Ht(kn, null);
  return ce(t, ke), t.teardown = e, t;
}
function zi(e) {
  yi();
  var t = (
    /** @type {Effect} */
    H.f
  ), r = !B && (t & ft) !== 0 && He !== null && !He.i;
  if (r) {
    var n = (
      /** @type {ComponentContext} */
      He
    );
    (n.e ?? (n.e = [])).push(e);
  } else
    return Za(e);
}
function Za(e) {
  return Ht(Sr | Os, e);
}
function Ei(e) {
  ur.ensure();
  const t = Ht(Bt | Cr, e);
  return (r = {}) => new Promise((n) => {
    r.outro ? lr(t, () => {
      Ke(t), n(void 0);
    }) : (Ke(t), n(void 0));
  });
}
function Si(e) {
  return Ht(Sr, e);
}
function ji(e) {
  return Ht(mr | Cr, e);
}
function Ti(e, t = 0) {
  return Ht(kn | t, e);
}
function P(e, t = [], r = [], n = []) {
  oi(n, t, r, (a) => {
    Ht(kn, () => {
      e(...a.map(s));
    });
  });
}
function na(e, t = 0) {
  var r = Ht(wt | t, e);
  return r;
}
function mt(e) {
  return Ht(ft | Cr, e);
}
function Qa(e) {
  var t = e.teardown;
  if (t !== null) {
    const r = Jt, n = B;
    ha(!0), ut(null);
    try {
      t.call(null);
    } finally {
      ha(r), ut(n);
    }
  }
}
function aa(e, t = !1) {
  var r = e.first;
  for (e.first = e.last = null; r !== null; ) {
    const a = r.ac;
    a !== null && Qr(() => {
      a.abort(Zr);
    });
    var n = r.next;
    (r.f & Bt) !== 0 ? r.parent = null : Ke(r, t), r = n;
  }
}
function Oi(e) {
  for (var t = e.first; t !== null; ) {
    var r = t.next;
    (t.f & ft) === 0 && Ke(t), t = r;
  }
}
function Ke(e, t = !0) {
  var r = !1;
  (t || (e.f & Ts) !== 0) && e.nodes !== null && e.nodes.end !== null && (Mi(
    e.nodes.start,
    /** @type {TemplateNode} */
    e.nodes.end
  ), r = !0), e.f |= fa, aa(e, t && !r), qr(e, 0);
  var n = e.nodes && e.nodes.t;
  if (n !== null)
    for (const i of n)
      i.stop();
  Qa(e), e.f ^= fa, e.f |= ot;
  var a = e.parent;
  a !== null && a.first !== null && $a(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function Mi(e, t) {
  for (; e !== null; ) {
    var r = e === t ? null : /* @__PURE__ */ $r(e);
    e.remove(), e = r;
  }
}
function $a(e) {
  var t = e.parent, r = e.prev, n = e.next;
  r !== null && (r.next = n), n !== null && (n.prev = r), t !== null && (t.first === e && (t.first = n), t.last === e && (t.last = r));
}
function lr(e, t, r = !0) {
  var n = [];
  es(e, n, !0);
  var a = () => {
    r && Ke(e), t && t();
  }, i = n.length;
  if (i > 0) {
    var l = () => --i || a();
    for (var o of n)
      o.out(l);
  } else
    a();
}
function es(e, t, r) {
  if ((e.f & Be) === 0) {
    e.f ^= Be;
    var n = e.nodes && e.nodes.t;
    if (n !== null)
      for (const o of n)
        (o.is_global || r) && t.push(o);
    for (var a = e.first; a !== null; ) {
      var i = a.next;
      if ((a.f & Bt) === 0) {
        var l = (a.f & jr) !== 0 || // If this is a branch effect without a block effect parent,
        // it means the parent block effect was pruned. In that case,
        // transparency information was transferred to the branch effect.
        (a.f & ft) !== 0 && (e.f & wt) !== 0;
        es(a, t, l ? r : !1);
      }
      a = i;
    }
  }
}
function _n(e) {
  ts(e, !0);
}
function ts(e, t) {
  if ((e.f & Be) !== 0) {
    e.f ^= Be, (e.f & ke) === 0 && (ce(e, ze), ur.ensure().schedule(e));
    for (var r = e.first; r !== null; ) {
      var n = r.next, a = (r.f & jr) !== 0 || (r.f & ft) !== 0;
      ts(r, a ? t : !1), r = n;
    }
    var i = e.nodes && e.nodes.t;
    if (i !== null)
      for (const l of i)
        (l.is_global || t) && l.in();
  }
}
function sa(e, t) {
  if (e.nodes)
    for (var r = e.nodes.start, n = e.nodes.end; r !== null; ) {
      var a = r === n ? null : /* @__PURE__ */ $r(r);
      t.append(r), r = a;
    }
}
let cn = !1, Jt = !1;
function ha(e) {
  Jt = e;
}
let B = null, bt = !1;
function ut(e) {
  B = e;
}
let H = null;
function At(e) {
  H = e;
}
let Ot = null;
function rs(e) {
  B !== null && (Ot ?? (Ot = /* @__PURE__ */ new Set())).add(e);
}
let Ge = null, Ze = 0, nt = null;
function Ai(e) {
  nt = e;
}
let ns = 1, $t = 0, or = $t;
function ga(e) {
  or = e;
}
function as() {
  return ++ns;
}
function en(e) {
  var t = e.f;
  if ((t & ze) !== 0)
    return !0;
  if (t & Te && (e.f &= ~fr), (t & xt) !== 0) {
    for (var r = (
      /** @type {Value[]} */
      e.deps
    ), n = r.length, a = 0; a < n; a++) {
      var i = r[a];
      if (en(
        /** @type {Derived} */
        i
      ) && Da(
        /** @type {Derived} */
        i
      ), i.wv > e.wv)
        return !0;
    }
    (t & lt) !== 0 && // During time traveling we don't want to reset the status so that
    // traversal of the graph in the other batches still happens
    Ce === null && ce(e, ke);
  }
  return !1;
}
function ss(e, t, r = !0) {
  var n = e.reactions;
  if (n !== null && !(Ot !== null && Ot.has(e)))
    for (var a = 0; a < n.length; a++) {
      var i = n[a];
      (i.f & Te) !== 0 ? ss(
        /** @type {Derived} */
        i,
        t,
        !1
      ) : t === i && (r ? ce(i, ze) : (i.f & ke) !== 0 && ce(i, xt), ea(
        /** @type {Effect} */
        i
      ));
    }
}
function is(e) {
  var x;
  var t = Ge, r = Ze, n = nt, a = B, i = Ot, l = He, o = bt, u = or, c = e.f;
  Ge = /** @type {null | Value[]} */
  null, Ze = 0, nt = null, B = (c & (ft | Bt)) === 0 ? e : null, Ot = null, Tr(e.ctx), bt = !1, or = ++$t, e.ac !== null && (Qr(() => {
    e.ac.abort(Zr);
  }), e.ac = null);
  try {
    e.f |= hn;
    var v = (
      /** @type {Function} */
      e.fn
    ), w = v();
    e.f |= Ar;
    var d = e.deps, h = F == null ? void 0 : F.is_fork;
    if (Ge !== null) {
      var p;
      if (h || qr(e, Ze), d !== null && Ze > 0)
        for (d.length = Ze + Ge.length, p = 0; p < Ge.length; p++)
          d[Ze + p] = Ge[p];
      else
        e.deps = d = Ge;
      if (ta() && (e.f & lt) !== 0)
        for (p = Ze; p < d.length; p++)
          ((x = d[p]).reactions ?? (x.reactions = [])).push(e);
    } else !h && d !== null && Ze < d.length && (qr(e, Ze), d.length = Ze);
    if (Fa() && nt !== null && !bt && d !== null && (e.f & (Te | xt | ze)) === 0)
      for (p = 0; p < /** @type {Source[]} */
      nt.length; p++)
        ss(
          nt[p],
          /** @type {Effect} */
          e
        );
    if (a !== null && a !== e) {
      if ($t++, a.deps !== null)
        for (let g = 0; g < r; g += 1)
          a.deps[g].rv = $t;
      if (t !== null)
        for (const g of t)
          g.rv = $t;
      nt !== null && (n === null ? n = nt : n.push(.../** @type {Source[]} */
      nt));
    }
    return (e.f & Xt) !== 0 && (e.f ^= Xt), w;
  } catch (g) {
    return Ia(g);
  } finally {
    e.f ^= hn, Ge = t, Ze = r, nt = n, B = a, Ot = i, Tr(l), bt = o, or = u;
  }
}
function Ci(e, t) {
  let r = t.reactions;
  if (r !== null) {
    var n = bs.call(r, e);
    if (n !== -1) {
      var a = r.length - 1;
      a === 0 ? r = t.reactions = null : (r[n] = r[a], r.pop());
    }
  }
  if (r === null && (t.f & Te) !== 0 && // Destroying a child effect while updating a parent effect can cause a dependency to appear
  // to be unused, when in fact it is used by the currently-updating parent. Checking `new_deps`
  // allows us to skip the expensive work of disconnecting and immediately reconnecting it
  (Ge === null || !dn.call(Ge, t))) {
    var i = (
      /** @type {Derived} */
      t
    );
    (i.f & lt) !== 0 && (i.f ^= lt, i.f &= ~fr), i.v !== ye && Jn(i), i.ac !== null && Qr(() => {
      i.ac.abort(Zr), i.ac = null, ce(i, ze);
    }), vi(i), qr(i, 0);
  }
}
function qr(e, t) {
  var r = e.deps;
  if (r !== null)
    for (var n = t; n < r.length; n++)
      Ci(e, r[n]);
}
function Mr(e) {
  var t = e.f;
  if ((t & ot) === 0) {
    ce(e, ke);
    var r = H, n = cn;
    H = e, cn = (t & (ft | Bt)) === 0;
    try {
      (t & (wt | Ta)) !== 0 ? Oi(e) : aa(e), Qa(e);
      var a = is(e);
      e.teardown = typeof a == "function" ? a : null, e.wv = ns;
      var i;
    } finally {
      cn = n, H = r;
    }
  }
}
function s(e) {
  var t = e.f, r = (t & Te) !== 0;
  if (B !== null && !bt) {
    var n = H !== null && (H.f & ot) !== 0;
    if (!n && (Ot === null || !Ot.has(e))) {
      var a = B.deps;
      if ((B.f & hn) !== 0)
        e.rv < $t && (e.rv = $t, Ge === null && a !== null && a[Ze] === e ? Ze++ : Ge === null ? Ge = [e] : Ge.push(e));
      else {
        B.deps ?? (B.deps = []), dn.call(B.deps, e) || B.deps.push(e);
        var i = e.reactions;
        i === null ? e.reactions = [B] : dn.call(i, B) || i.push(B);
      }
    }
  }
  if (Jt && Tt.has(e))
    return Tt.get(e);
  if (r) {
    var l = (
      /** @type {Derived} */
      e
    );
    if (Jt) {
      var o = l.v;
      return ((l.f & ke) === 0 && l.reactions !== null || os(l)) && (o = Qn(l)), Tt.set(l, o), o;
    }
    var u = (l.f & lt) === 0 && !bt && B !== null && (cn || (B.f & lt) !== 0), c = (l.f & Ar) === 0;
    en(l) && (u && (l.f |= lt), Da(l)), u && !c && (La(l), ls(l));
  }
  if (Ce != null && Ce.has(e))
    return Ce.get(e);
  if ((e.f & Xt) !== 0)
    throw e.v;
  return e.v;
}
function ls(e) {
  if (e.f |= lt, e.deps !== null)
    for (const t of e.deps)
      (t.reactions ?? (t.reactions = [])).push(e), (t.f & Te) !== 0 && (t.f & lt) === 0 && (La(
        /** @type {Derived} */
        t
      ), ls(
        /** @type {Derived} */
        t
      ));
}
function os(e) {
  if (e.v === ye) return !0;
  if (e.deps === null) return !1;
  for (const t of e.deps)
    if (Tt.has(t) || (t.f & Te) !== 0 && os(
      /** @type {Derived} */
      t
    ))
      return !0;
  return !1;
}
function fs(e) {
  var t = bt;
  try {
    return bt = !0, e();
  } finally {
    bt = t;
  }
}
const Fi = ["touchstart", "touchmove"];
function Ii(e) {
  return Fi.includes(e);
}
const er = Symbol("events"), us = /* @__PURE__ */ new Set(), Yn = /* @__PURE__ */ new Set();
function Ni(e, t, r, n = {}) {
  function a(i) {
    if (n.capture || Wn.call(t, i), !i.cancelBubble)
      return Qr(() => r == null ? void 0 : r.call(this, i));
  }
  return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? Lt(() => {
    t.addEventListener(e, a, n);
  }) : t.addEventListener(e, a, n), a;
}
function mn(e, t, r, n, a) {
  var i = { capture: n, passive: a }, l = Ni(e, t, r, i);
  (t === document.body || // @ts-ignore
  t === window || // @ts-ignore
  t === document || // Firefox has quirky behavior, it can happen that we still get "canplay" events when the element is already removed
  t instanceof HTMLMediaElement) && ra(() => {
    t.removeEventListener(e, l, i);
  });
}
function Mt(e, t, r) {
  (t[er] ?? (t[er] = {}))[e] = r;
}
function zn(e) {
  for (var t = 0; t < e.length; t++)
    us.add(e[t]);
  for (var r of Yn)
    r(e);
}
let Mn = null, An = !1;
function Wn(e) {
  var x, g;
  var t = this, r = (
    /** @type {Node} */
    t.ownerDocument
  ), n = e.type, a = ((x = e.composedPath) == null ? void 0 : x.call(e)) || [], i = (
    /** @type {null | Element} */
    a[0] || e.target
  );
  Mn = e, An || (An = !0, setTimeout(() => {
    An = !1, Mn = null;
  }));
  var l = 0, o = Mn === e && e[er];
  if (o) {
    var u = a.indexOf(o);
    if (u !== -1 && (t === document || t === /** @type {any} */
    window)) {
      e[er] = t;
      return;
    }
    var c = a.indexOf(t);
    if (c === -1)
      return;
    u <= c && (l = u);
  }
  if (i = /** @type {Element} */
  a[l] || e.target, i !== t) {
    xs(e, "currentTarget", {
      configurable: !0,
      get() {
        return i || r;
      }
    });
    var v = B, w = H;
    ut(null), At(null);
    try {
      for (var d, h = []; i !== null && i !== t; ) {
        try {
          var p = (g = i[er]) == null ? void 0 : g[n];
          p != null && (!/** @type {any} */
          i.disabled || // DOM could've been updated already by the time this is reached, so we check this as well
          // -> the target could not have been disabled because it emits the event in the first place
          e.target === i) && p.call(i, e);
        } catch (_) {
          d ? h.push(_) : d = _;
        }
        if (e.cancelBubble) break;
        l++, i = l < a.length ? (
          /** @type {Element} */
          a[l]
        ) : null;
      }
      if (d) {
        for (let _ of h)
          queueMicrotask(() => {
            throw _;
          });
        throw d;
      }
    } finally {
      e[er] = t, delete e.currentTarget, ut(v), At(w);
    }
  }
}
var za;
const Cn = (
  // We gotta write it like this because after downleveling the pure comment may end up in the wrong location
  ((za = globalThis == null ? void 0 : globalThis.window) == null ? void 0 : za.trustedTypes) && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", {
    /** @param {string} html */
    createHTML: (e) => e
  })
);
function Ri(e) {
  return (
    /** @type {string} */
    (Cn == null ? void 0 : Cn.createHTML(e)) ?? e
  );
}
function cs(e) {
  var t = Ja("template");
  return t.innerHTML = Ri(e.replaceAll("<!>", "<!---->")), t.content;
}
function Ur(e, t) {
  var r = (
    /** @type {Effect} */
    H
  );
  r.nodes === null && (r.nodes = { start: e, end: t, a: null, t: null });
}
// @__NO_SIDE_EFFECTS__
function q(e, t) {
  var r = (t & Ma) !== 0, n = (t & Gs) !== 0, a, i = !e.startsWith("<!>");
  return () => {
    a === void 0 && (a = cs(i ? e : "<!>" + e), r || (a = /** @type {TemplateNode} */
    /* @__PURE__ */ Dt(a)));
    var l = (
      /** @type {TemplateNode} */
      n || Ga ? document.importNode(a, !0) : a.cloneNode(!0)
    );
    if (r) {
      var o = (
        /** @type {TemplateNode} */
        /* @__PURE__ */ Dt(l)
      ), u = (
        /** @type {TemplateNode} */
        l.lastChild
      );
      Ur(o, u);
    } else
      Ur(l, l);
    return l;
  };
}
// @__NO_SIDE_EFFECTS__
function Pi(e, t, r = "svg") {
  var n = !e.startsWith("<!>"), a = (t & Ma) !== 0, i = `<${r}>${n ? e : "<!>" + e}</${r}>`, l;
  return () => {
    if (!l) {
      var o = (
        /** @type {DocumentFragment} */
        cs(i)
      ), u = (
        /** @type {Element} */
        /* @__PURE__ */ Dt(o)
      );
      if (a)
        for (l = document.createDocumentFragment(); /* @__PURE__ */ Dt(u); )
          l.appendChild(
            /** @type {TemplateNode} */
            /* @__PURE__ */ Dt(u)
          );
      else
        l = /** @type {Element} */
        /* @__PURE__ */ Dt(u);
    }
    var c = (
      /** @type {TemplateNode} */
      l.cloneNode(!0)
    );
    if (a) {
      var v = (
        /** @type {TemplateNode} */
        /* @__PURE__ */ Dt(c)
      ), w = (
        /** @type {TemplateNode} */
        c.lastChild
      );
      Ur(v, w);
    } else
      Ur(c, c);
    return c;
  };
}
// @__NO_SIDE_EFFECTS__
function Ve(e, t) {
  return /* @__PURE__ */ Pi(e, t, "svg");
}
function Et() {
  var e = document.createDocumentFragment(), t = document.createComment(""), r = ir();
  return e.append(t, r), Ur(t, r), e;
}
function z(e, t) {
  e !== null && e.before(
    /** @type {Node} */
    t
  );
}
function D(e, t) {
  var r = t == null ? "" : typeof t == "object" ? `${t}` : t;
  r !== /** @type {any} */
  (e[Rr] ?? (e[Rr] = e.nodeValue)) && (e[Rr] = r, e.nodeValue = `${r}`);
}
function Di(e, t) {
  return Li(e, t);
}
const an = /* @__PURE__ */ new Map();
function Li(e, { target: t, anchor: r, props: n = {}, events: a, context: i, intro: l = !0, transformError: o }) {
  bi();
  var u = void 0, c = Ei(() => {
    var v = r ?? t.appendChild(ir());
    ni(
      /** @type {TemplateNode} */
      v,
      {
        pending: () => {
        }
      },
      (h) => {
        Fr({});
        var p = (
          /** @type {ComponentContext} */
          He
        );
        i && (p.c = i), a && (n.$$events = a), u = e(h, n) || {}, Ir();
      },
      o
    );
    var w = /* @__PURE__ */ new Set(), d = (h) => {
      for (var p = 0; p < h.length; p++) {
        var x = h[p];
        if (!w.has(x)) {
          w.add(x);
          var g = Ii(x);
          for (const V of [t, document]) {
            var _ = an.get(V);
            _ === void 0 && (_ = /* @__PURE__ */ new Map(), an.set(V, _));
            var W = _.get(x);
            W === void 0 ? (V.addEventListener(x, Wn, { passive: g }), _.set(x, 1)) : _.set(x, W + 1);
          }
        }
      }
    };
    return d(yn(us)), Yn.add(d), () => {
      var g;
      for (var h of w)
        for (const _ of [t, document]) {
          var p = (
            /** @type {Map<string, number>} */
            an.get(_)
          ), x = (
            /** @type {number} */
            p.get(h)
          );
          --x == 0 ? (_.removeEventListener(h, Wn), p.delete(h), p.size === 0 && an.delete(_)) : p.set(h, x);
        }
      Yn.delete(d), v !== r && ((g = v.parentNode) == null || g.removeChild(v));
    };
  });
  return qn.set(u, c), u;
}
let qn = /* @__PURE__ */ new WeakMap();
function Bi(e, t) {
  const r = qn.get(e);
  return r ? (qn.delete(e), r(t)) : Promise.resolve();
}
var pt, Pt, _t, sr, Jr, xn, Kn;
class Hi {
  /**
   * @param {TemplateNode} anchor
   * @param {boolean} transition
   */
  constructor(t, r = !0) {
    /** @type {TemplateNode} */
    Je(this, "anchor");
    /** @type {Map<Batch, Key>} */
    I(this, pt, /* @__PURE__ */ new Map());
    /**
     * Map of keys to effects that are currently rendered in the DOM.
     * These effects are visible and actively part of the document tree.
     * Example:
     * ```
     * {#if condition}
     * 	foo
     * {:else}
     * 	bar
     * {/if}
     * ```
     * Can result in the entries `true->Effect` and `false->Effect`
     * @type {Map<Key, Effect>}
     */
    I(this, Pt, /* @__PURE__ */ new Map());
    /**
     * Similar to #onscreen with respect to the keys, but contains branches that are not yet
     * in the DOM, because their insertion is deferred.
     * @type {Map<Key, Branch>}
     */
    I(this, _t, /* @__PURE__ */ new Map());
    /**
     * Keys of effects that are currently outroing
     * @type {Set<Key>}
     */
    I(this, sr, /* @__PURE__ */ new Set());
    /**
     * Whether to pause (i.e. outro) on change, or destroy immediately.
     * This is necessary for `<svelte:element>`
     */
    I(this, Jr, !0);
    /**
     * @param {Batch} batch
     */
    I(this, xn, (t) => {
      if (f(this, pt).has(t)) {
        var r = (
          /** @type {Key} */
          f(this, pt).get(t)
        ), n = f(this, Pt).get(r);
        if (n)
          _n(n), f(this, sr).delete(r);
        else {
          var a = f(this, _t).get(r);
          a && (_n(a.effect), f(this, Pt).set(r, a.effect), f(this, _t).delete(r), a.fragment.lastChild.remove(), this.anchor.before(a.fragment), n = a.effect);
        }
        for (const [i, l] of f(this, pt)) {
          if (f(this, pt).delete(i), i === t)
            break;
          const o = f(this, _t).get(l);
          o && (Ke(o.effect), f(this, _t).delete(l));
        }
        for (const [i, l] of f(this, Pt)) {
          if (i === r || f(this, sr).has(i)) continue;
          const o = () => {
            if (Array.from(f(this, pt).values()).includes(i)) {
              var c = document.createDocumentFragment();
              sa(l, c), c.append(ir()), f(this, _t).set(i, { effect: l, fragment: c });
            } else
              Ke(l);
            f(this, sr).delete(i), f(this, Pt).delete(i);
          };
          f(this, Jr) || !n ? (f(this, sr).add(i), lr(l, o, !1)) : o();
        }
      }
    });
    /**
     * @param {Batch} batch
     */
    I(this, Kn, (t) => {
      f(this, pt).delete(t);
      const r = Array.from(f(this, pt).values());
      for (const [n, a] of f(this, _t))
        r.includes(n) || (Ke(a.effect), f(this, _t).delete(n));
    });
    this.anchor = t, C(this, Jr, r);
  }
  /**
   *
   * @param {any} key
   * @param {null | ((target: TemplateNode) => void)} fn
   */
  ensure(t, r) {
    var n = (
      /** @type {Batch} */
      F
    );
    r && !f(this, Pt).has(t) && !f(this, _t).has(t) && f(this, Pt).set(
      t,
      mt(() => r(this.anchor))
    ), f(this, pt).set(n, t), f(this, xn).call(this, n);
  }
}
pt = new WeakMap(), Pt = new WeakMap(), _t = new WeakMap(), sr = new WeakMap(), Jr = new WeakMap(), xn = new WeakMap(), Kn = new WeakMap();
function re(e, t, r = !1) {
  var n = new Hi(e), a = r ? jr : 0;
  function i(l, o) {
    n.ensure(l, o);
  }
  na(() => {
    var l = !1;
    t((o, u = 0) => {
      l = !0, i(u, o);
    }), l || i(-1, null);
  }, a);
}
function Ne(e, t) {
  return t;
}
function Vi(e, t, r) {
  for (var n = [], a = t.length, i, l = t.length, o = 0; o < a; o++) {
    let w = t[o];
    lr(
      w,
      () => {
        if (i) {
          if (i.pending.delete(w), i.done.add(w), i.pending.size === 0) {
            var d = (
              /** @type {Set<EachOutroGroup>} */
              e.outrogroups
            );
            Un(e, yn(i.done)), d.delete(i), d.size === 0 && (e.outrogroups = null);
          }
        } else
          l -= 1;
      },
      !1
    );
  }
  if (l === 0) {
    var u = n.length === 0 && r !== null && e.pending.size === 0;
    if (u) {
      var c = (
        /** @type {Element} */
        r
      ), v = (
        /** @type {Element} */
        c.parentNode
      );
      xi(v), v.append(c), e.items.clear();
    }
    Un(e, t, !u);
  } else
    i = {
      pending: new Set(t),
      done: /* @__PURE__ */ new Set()
    }, (e.outrogroups ?? (e.outrogroups = /* @__PURE__ */ new Set())).add(i);
}
function Un(e, t, r = !0) {
  var n;
  if (e.pending.size > 0) {
    n = /* @__PURE__ */ new Set();
    for (const l of e.pending.values())
      for (const o of l)
        n.add(
          /** @type {EachItem} */
          e.items.get(o).e
        );
  }
  for (var a = 0; a < t.length; a++) {
    var i = t[a];
    if (n != null && n.has(i)) {
      i.f |= jt;
      const l = document.createDocumentFragment();
      sa(i, l);
    } else
      Ke(t[a], r);
  }
}
var pa;
function Re(e, t, r, n, a, i = null) {
  var l = e, o = /* @__PURE__ */ new Map(), u = (t & Oa) !== 0;
  if (u) {
    var c = (
      /** @type {Element} */
      e
    );
    l = c.appendChild(ir());
  }
  var v = null, w = /* @__PURE__ */ ci(() => {
    var W = r();
    return (
      /** @type {V[]} */
      Xn(W) ? W : W == null ? [] : yn(W)
    );
  }), d, h = /* @__PURE__ */ new Map(), p = !0;
  function x(W) {
    (_.effect.f & ot) === 0 && (_.pending.delete(W), _.fallback = v, Yi(_, d, l, t, n), v !== null && (d.length === 0 ? (v.f & jt) === 0 ? _n(v) : (v.f ^= jt, Br(v, null, l)) : lr(v, () => {
      v = null;
    })));
  }
  var g = na(() => {
    d = /** @type {V[]} */
    s(w);
    for (var W = d.length, V = /* @__PURE__ */ new Set(), U = (
      /** @type {Batch} */
      F
    ), Q = 0; Q < W; Q += 1) {
      var de = d[Q], X = n(de, Q), N = p ? null : o.get(X);
      N ? (N.v && Or(N.v, de), N.i && Or(N.i, Q)) : (N = Wi(
        o,
        p ? l : pa ?? (pa = ir()),
        de,
        X,
        Q,
        a,
        t,
        r
      ), p || (N.e.f |= jt), o.set(X, N)), V.add(X);
    }
    W === 0 && i && !v && (p ? v = mt(() => i(l)) : (v = mt(() => i(pa ?? (pa = ir()))), v.f |= jt)), W > V.size && Is(), p || (h.set(U, V), x(U)), s(w);
  }), _ = { effect: g, items: o, pending: h, outrogroups: null, fallback: v };
  p = !1;
}
function Nr(e) {
  for (; e !== null && (e.f & ft) === 0; )
    e = e.next;
  return e;
}
function Yi(e, t, r, n, a) {
  var ne, T, R, $, A, K, _e, Ye, ee;
  var i = (n & qs) !== 0, l = t.length, o = e.items, u = Nr(e.effect.first), c, v = null, w, d = [], h = [], p, x, g, _;
  if (i)
    for (_ = 0; _ < l; _ += 1)
      p = t[_], x = a(p, _), g = /** @type {EachItem} */
      o.get(x).e, (g.f & jt) === 0 && ((T = (ne = g.nodes) == null ? void 0 : ne.a) == null || T.measure(), (w ?? (w = /* @__PURE__ */ new Set())).add(g));
  for (_ = 0; _ < l; _ += 1) {
    if (p = t[_], x = a(p, _), g = /** @type {EachItem} */
    o.get(x).e, e.outrogroups !== null)
      for (const ae of e.outrogroups)
        ae.pending.delete(g), ae.done.delete(g);
    if ((g.f & Be) !== 0 && (_n(g), i && (($ = (R = g.nodes) == null ? void 0 : R.a) == null || $.unfix(), (w ?? (w = /* @__PURE__ */ new Set())).delete(g))), (g.f & jt) !== 0)
      if (g.f ^= jt, g === u)
        Br(g, null, r);
      else {
        var W = v ? v.next : u;
        g === e.effect.last && (e.effect.last = g.prev), g.prev && (g.prev.next = g.next), g.next && (g.next.prev = g.prev), qt(e, v, g), qt(e, g, W), Br(g, W, r), v = g, d = [], h = [], u = Nr(v.next);
        continue;
      }
    if (g !== u) {
      if (c !== void 0 && c.has(g)) {
        if (d.length < h.length) {
          var V = h[0], U;
          v = V.prev;
          var Q = d[0], de = d[d.length - 1];
          for (U = 0; U < d.length; U += 1)
            Br(d[U], V, r);
          for (U = 0; U < h.length; U += 1)
            c.delete(h[U]);
          qt(e, Q.prev, de.next), qt(e, v, Q), qt(e, de, V), u = V, v = de, _ -= 1, d = [], h = [];
        } else
          c.delete(g), Br(g, u, r), qt(e, g.prev, g.next), qt(e, g, v === null ? e.effect.first : v.next), qt(e, v, g), v = g;
        continue;
      }
      for (d = [], h = []; u !== null && u !== g; )
        (c ?? (c = /* @__PURE__ */ new Set())).add(u), h.push(u), u = Nr(u.next);
      if (u === null)
        continue;
    }
    (g.f & jt) === 0 && d.push(g), v = g, u = Nr(g.next);
  }
  if (e.outrogroups !== null) {
    for (const ae of e.outrogroups)
      ae.pending.size === 0 && (Un(e, yn(ae.done)), (A = e.outrogroups) == null || A.delete(ae));
    e.outrogroups.size === 0 && (e.outrogroups = null);
  }
  if (u !== null || c !== void 0) {
    var X = [];
    if (c !== void 0)
      for (g of c)
        (g.f & Be) === 0 && X.push(g);
    for (; u !== null; )
      (u.f & Be) === 0 && u !== e.fallback && X.push(u), u = Nr(u.next);
    var N = X.length;
    if (N > 0) {
      var ve = (n & Oa) !== 0 && l === 0 ? r : null;
      if (i) {
        for (_ = 0; _ < N; _ += 1)
          (_e = (K = X[_].nodes) == null ? void 0 : K.a) == null || _e.measure();
        for (_ = 0; _ < N; _ += 1)
          (ee = (Ye = X[_].nodes) == null ? void 0 : Ye.a) == null || ee.fix();
      }
      Vi(e, X, ve);
    }
  }
  i && Lt(() => {
    var ae, E;
    if (w !== void 0)
      for (g of w)
        (E = (ae = g.nodes) == null ? void 0 : ae.a) == null || E.apply();
  });
}
function Wi(e, t, r, n, a, i, l, o) {
  var u = (l & Ys) !== 0 ? (l & Us) === 0 ? /* @__PURE__ */ _i(r, !1, !1) : cr(r) : null, c = (l & Ws) !== 0 ? cr(a) : null;
  return {
    v: u,
    i: c,
    e: mt(() => (i(t, u ?? r, c ?? a, o), () => {
      e.delete(n);
    }))
  };
}
function Br(e, t, r) {
  if (e.nodes)
    for (var n = e.nodes.start, a = e.nodes.end, i = t && (t.f & jt) === 0 ? (
      /** @type {EffectNodes} */
      t.nodes.start
    ) : r; n !== null; ) {
      var l = (
        /** @type {TemplateNode} */
        /* @__PURE__ */ $r(n)
      );
      if (i.before(n), n === a)
        return;
      n = l;
    }
}
function qt(e, t, r) {
  t === null ? e.effect.first = r : t.next = r, r === null ? e.effect.last = t : r.prev = t;
}
function tn(e, t) {
  Si(() => {
    var a, i;
    e = ((i = (a = H == null ? void 0 : H.parent) == null ? void 0 : a.nodes) == null ? void 0 : i.start) ?? e;
    var r = e.getRootNode(), n = (
      /** @type {ShadowRoot} */
      r.host ? (
        /** @type {ShadowRoot} */
        r
      ) : (
        /** @type {Document} */
        r.head ?? /** @type {Document} */
        r.ownerDocument.head
      )
    );
    if (!n.querySelector("#" + t.hash)) {
      const l = Ja("style");
      l.id = t.hash, l.textContent = t.code, n.appendChild(l);
    }
  });
}
const _a = [...`
\r\f \v\uFEFF`];
function qi(e, t, r) {
  var n = e == null ? "" : "" + e;
  if (r) {
    for (var a of Object.keys(r))
      if (r[a])
        n = n ? n + " " + a : a;
      else if (n.length)
        for (var i = a.length, l = 0; (l = n.indexOf(a, l)) >= 0; ) {
          var o = l + i;
          (l === 0 || _a.includes(n[l - 1])) && (o === n.length || _a.includes(n[o])) ? n = (l === 0 ? "" : n.substring(0, l)) + n.substring(o + 1) : l = o;
        }
  }
  return n === "" ? null : n;
}
function Ui(e, t) {
  return e == null ? null : String(e);
}
function $e(e, t, r, n, a, i) {
  var l = (
    /** @type {any} */
    e[In]
  );
  if (l !== r || l === void 0) {
    var o = qi(r, n, i);
    o == null ? e.removeAttribute("class") : e.className = o, e[In] = r;
  } else if (i && a !== i)
    for (var u in i) {
      var c = !!i[u];
      (a == null || c !== !!a[u]) && e.classList.toggle(u, c);
    }
  return i;
}
function ds(e, t, r, n) {
  var a = (
    /** @type {any} */
    e[Nn]
  );
  if (a !== t) {
    var i = Ui(t);
    i == null ? e.removeAttribute("style") : e.style.cssText = i, e[Nn] = t;
  }
  return n;
}
function vs(e, t, r = !1) {
  if (e.multiple) {
    if (t == null)
      return;
    if (!Xn(t))
      return Js();
    for (var n of e.options)
      n.selected = t.includes(ma(n));
    return;
  }
  for (n of e.options) {
    var a = ma(n);
    if (wi(a, t)) {
      n.selected = !0;
      return;
    }
  }
  (!r || t !== void 0) && (e.selectedIndex = -1);
}
function Gi(e) {
  var t = new MutationObserver(() => {
    "__value" in e && vs(e, e.__value);
  });
  t.observe(e, {
    // Listen to option element changes
    childList: !0,
    subtree: !0,
    // because of <optgroup>
    // Listen to option element value attribute changes
    // (doesn't get notified of select value changes,
    // because that property is not reflected as an attribute)
    attributes: !0,
    attributeFilter: ["value"]
  }), ra(() => {
    t.disconnect();
  });
}
function ma(e) {
  return "__value" in e ? e.__value : e.value;
}
const Ki = Symbol("is custom element"), Xi = Symbol("is html"), Ji = As ? "progress" : "PROGRESS";
function wa(e, t) {
  var r = hs(e);
  r.value === (r.value = // treat null and undefined the same for the initial value
  t ?? void 0) || // @ts-expect-error
  // `progress` elements always need their value set when it's `0`
  e.value === t && (t !== 0 || e.nodeName !== Ji) || (e.value = t ?? "");
}
function b(e, t, r, n) {
  var a = hs(e);
  a[t] !== (a[t] = r) && (t === "loading" && (e[Ms] = r), r == null ? e.removeAttribute(t) : typeof r != "string" && Zi(e).includes(t) ? e[t] = r : e.setAttribute(t, r));
}
function hs(e) {
  return (
    /** @type {Record<string | symbol, unknown>} **/
    /** @type {any} */
    e[ln] ?? (e[ln] = {
      [Ki]: e.nodeName.includes("-"),
      [Xi]: e.namespaceURI === Ks
    })
  );
}
var ba = /* @__PURE__ */ new Map();
function Zi(e) {
  var t = e.getAttribute("is") || e.nodeName, r = ba.get(t);
  if (r) return r;
  ba.set(t, r = []);
  for (var n, a = e, i = Element.prototype; i !== a; ) {
    n = ys(a);
    for (var l in n)
      n[l].set && // better safe than sorry, we don't want spread attributes to mess with HTML content
      l !== "innerHTML" && l !== "textContent" && l !== "innerText" && r.push(l);
    a = Sa(a);
  }
  return r;
}
function Qi(e) {
  He === null && Cs(), zi(() => {
    const t = fs(e);
    if (typeof t == "function") return (
      /** @type {() => void} */
      t
    );
  });
}
const $i = "5";
var Ea;
typeof window < "u" && ((Ea = window.__svelte ?? (window.__svelte = {})).v ?? (Ea.v = /* @__PURE__ */ new Set())).add($i);
var el = /* @__PURE__ */ q('<span class="unit-badge svelte-wbgojz"> </span>'), tl = /* @__PURE__ */ q('<div class="slider-row svelte-wbgojz"><span class="bound-label svelte-wbgojz"> </span> <input type="range" class="range-slider svelte-wbgojz"/> <span class="bound-label svelte-wbgojz"> </span></div>'), rl = /* @__PURE__ */ q('<div class="param-desc svelte-wbgojz"> </div>'), nl = /* @__PURE__ */ q('<div class="param-item svelte-wbgojz"><div class="param-header svelte-wbgojz"><label class="param-label svelte-wbgojz"> </label> <div class="param-value-box svelte-wbgojz"><input type="number" class="number-input svelte-wbgojz"/> <!></div></div> <!> <!></div>'), al = /* @__PURE__ */ q('<div class="param-group svelte-wbgojz"><h4 class="group-title svelte-wbgojz"> </h4> <div class="group-items svelte-wbgojz"></div></div>'), sl = /* @__PURE__ */ q('<div class="param-controls svelte-wbgojz"></div>');
const il = {
  hash: "svelte-wbgojz",
  code: ".param-controls.svelte-wbgojz {display:flex;flex-direction:column;gap:1.25rem;}.param-group.svelte-wbgojz {background:var(--background-secondary, #f8f9fa);border:1px solid var(--border-color, #e2e8f0);border-radius:8px;padding:1rem;}.group-title.svelte-wbgojz {margin:0 0 0.85rem 0;font-size:0.875rem;font-weight:600;color:var(--text-muted, #4a5568);text-transform:uppercase;letter-spacing:0.05em;border-bottom:1px solid var(--border-color, #edf2f7);padding-bottom:0.35rem;}.group-items.svelte-wbgojz {display:flex;flex-direction:column;gap:0.85rem;}.param-item.svelte-wbgojz {display:flex;flex-direction:column;gap:0.3rem;}.param-header.svelte-wbgojz {display:flex;justify-content:space-between;align-items:center;}.param-label.svelte-wbgojz {font-size:0.85rem;font-weight:500;color:var(--text-color, #2d3748);}.param-value-box.svelte-wbgojz {display:flex;align-items:center;gap:0.25rem;}.number-input.svelte-wbgojz {width:5.5rem;padding:0.25rem 0.4rem;font-size:0.85rem;font-weight:600;text-align:right;border:1px solid var(--border-color, #cbd5e0);border-radius:4px;background:var(--background, #ffffff);color:var(--text-color, #2d3748);}.unit-badge.svelte-wbgojz {font-size:0.75rem;color:var(--text-muted, #718096);min-width:1rem;}.slider-row.svelte-wbgojz {display:flex;align-items:center;gap:0.5rem;}.range-slider.svelte-wbgojz {flex:1;cursor:pointer;accent-color:#3182ce;}.bound-label.svelte-wbgojz {font-size:0.7rem;color:var(--text-muted, #a0aec0);}.param-desc.svelte-wbgojz {font-size:0.75rem;color:var(--text-muted, #718096);}"
};
function ll(e, t) {
  Fr(t, !0), tn(e, il);
  let r = /* @__PURE__ */ O(() => {
    const i = {};
    for (const [l, o] of Object.entries(t.params)) {
      const u = o.group || "General";
      i[u] || (i[u] = []), i[u].push({ name: l, def: o });
    }
    return i;
  });
  function n(i, l) {
    let u = l.target.value;
    const c = t.params[i];
    c.type === "int" ? u = parseInt(u, 10) : c.type === "float" && (u = parseFloat(u)), t.onchange(i, u);
  }
  var a = sl();
  Re(a, 21, () => Object.entries(s(r)), Ne, (i, l) => {
    var o = /* @__PURE__ */ O(() => js(s(l), 2));
    let u = () => s(o)[0], c = () => s(o)[1];
    var v = al(), w = m(v), d = m(w), h = y(w, 2);
    Re(h, 21, c, Ne, (p, x) => {
      let g = () => s(x).name, _ = () => s(x).def;
      var W = nl(), V = m(W), U = m(V), Q = m(U), de = y(U, 2), X = m(de), N = y(X, 2);
      {
        var ve = (A) => {
          var K = el(), _e = m(K);
          P(() => D(_e, _().unit)), z(A, K);
        };
        re(N, (A) => {
          _().unit && A(ve);
        });
      }
      var ne = y(V, 2);
      {
        var T = (A) => {
          var K = tl(), _e = m(K), Ye = m(_e), ee = y(_e, 2), ae = y(ee, 2), E = m(ae);
          P(() => {
            D(Ye, _().min), b(ee, "min", _().min), b(ee, "max", _().max), b(ee, "step", _().step ?? (_().type === "float" ? "0.005" : "1")), wa(ee, t.values[g()] ?? _().default), D(E, _().max);
          }), Mt("input", ee, (M) => n(g(), M)), z(A, K);
        };
        re(ne, (A) => {
          _().min !== null && _().max !== null && A(T);
        });
      }
      var R = y(ne, 2);
      {
        var $ = (A) => {
          var K = rl(), _e = m(K);
          P(() => D(_e, _().description)), z(A, K);
        };
        re(R, (A) => {
          _().description && A($);
        });
      }
      P(() => {
        b(U, "for", "param-" + g()), b(U, "title", _().description), D(Q, _().label || g()), b(X, "id", "param-" + g()), b(X, "min", _().min ?? void 0), b(X, "max", _().max ?? void 0), b(X, "step", _().step ?? (_().type === "float" ? "0.01" : "1")), wa(X, t.values[g()] ?? _().default);
      }), Mt("input", X, (A) => n(g(), A)), z(p, W);
    }), P(() => D(d, u())), z(i, v);
  }), z(e, a), Ir();
}
zn(["input"]);
var ol = /* @__PURE__ */ q('<div class="summary-cards svelte-jmpktx"><div class="card svelte-jmpktx"><div class="label svelte-jmpktx">Ending Net Worth</div> <div> </div> <div class="subtext svelte-jmpktx"> </div></div> <div class="card svelte-jmpktx"><div class="label svelte-jmpktx">Portfolio Trough</div> <div> </div> <div class="subtext svelte-jmpktx"> </div></div> <div class="card svelte-jmpktx"><div class="label svelte-jmpktx">Peak Portfolio</div> <div class="value highlight svelte-jmpktx"> </div> <div class="subtext svelte-jmpktx"> </div></div></div>');
const fl = {
  hash: "svelte-jmpktx",
  code: ".summary-cards.svelte-jmpktx {display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:1rem;margin-bottom:1.5rem;}.card.svelte-jmpktx {background:var(--background-secondary, #f8f9fa);border:1px solid var(--border-color, #e2e8f0);border-radius:8px;padding:1rem 1.25rem;box-shadow:0 1px 3px rgba(0, 0, 0, 0.05);}.label.svelte-jmpktx {font-size:0.825rem;font-weight:600;color:var(--text-muted, #718096);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.35rem;}.value.svelte-jmpktx {font-size:1.5rem;font-weight:700;color:var(--text-color, #2d3748);}.value.highlight.svelte-jmpktx {color:#2b6cb0;}.value.warning.svelte-jmpktx {color:#dd6b20;}.value.negative.svelte-jmpktx {color:#e53e3e;}.subtext.svelte-jmpktx {font-size:0.8rem;color:var(--text-muted, #a0aec0);margin-top:0.25rem;}"
};
function ul(e, t) {
  Fr(t, !0), tn(e, fl);
  function r(N) {
    return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(N);
  }
  let n = /* @__PURE__ */ O(() => {
    if (!t.trace || t.trace.periods.length === 0) return 0;
    let N = 0;
    for (const ve of Object.keys(t.trace.balances)) {
      const ne = t.trace.balances[ve];
      N += ne[ne.length - 1] || 0;
    }
    return N;
  }), a = /* @__PURE__ */ O(() => {
    if (!t.trace || t.trace.periods.length === 0) return { min: 0, year: 0 };
    let N = 1 / 0, ve = t.trace.periods[0];
    for (let ne = 0; ne < t.trace.periods.length; ne++) {
      let T = 0;
      for (const R of Object.keys(t.trace.balances))
        T += t.trace.balances[R][ne] || 0;
      T < N && (N = T, ve = t.trace.periods[ne]);
    }
    return { min: N === 1 / 0 ? 0 : N, year: ve };
  }), i = /* @__PURE__ */ O(() => {
    if (!t.trace || t.trace.periods.length === 0) return { peak: 0, year: 0 };
    let N = -1 / 0, ve = t.trace.periods[0];
    for (let ne = 0; ne < t.trace.periods.length; ne++) {
      let T = 0;
      for (const R of Object.keys(t.trace.balances))
        T += t.trace.balances[R][ne] || 0;
      T > N && (N = T, ve = t.trace.periods[ne]);
    }
    return { peak: N === -1 / 0 ? 0 : N, year: ve };
  });
  var l = ol(), o = m(l), u = y(m(o), 2);
  let c;
  var v = m(u), w = y(u, 2), d = m(w), h = y(o, 2), p = y(m(h), 2);
  let x;
  var g = m(p), _ = y(p, 2), W = m(_), V = y(h, 2), U = y(m(V), 2), Q = m(U), de = y(U, 2), X = m(de);
  P(
    (N, ve, ne) => {
      var T;
      c = $e(u, 1, "value svelte-jmpktx", null, c, { negative: s(n) < 0 }), D(v, N), D(d, `At year ${(((T = t.trace) == null ? void 0 : T.periods[t.trace.periods.length - 1]) || 0) ?? ""}`), x = $e(p, 1, "value svelte-jmpktx", null, x, { warning: s(a).min < 1e5 }), D(g, ve), D(W, `Lowest balance in ${s(a).year ?? ""}`), D(Q, ne), D(X, `Highest balance in ${s(i).year ?? ""}`);
    },
    [
      () => r(s(n)),
      () => r(s(a).min),
      () => r(s(i).peak)
    ]
  ), z(e, l), Ir();
}
var cl = /* @__PURE__ */ q('<button type="button">Portfolio Funding</button>'), dl = /* @__PURE__ */ q('<div class="legend svelte-13rwf6w"><span class="legend-item svelte-13rwf6w"><span class="legend-swatch svelte-13rwf6w" style="background: #38a169;"></span> Surplus (+)</span> <span class="legend-item svelte-13rwf6w"><span class="legend-swatch svelte-13rwf6w" style="background: #e53e3e;"></span> Deficit (-)</span></div>'), vl = /* @__PURE__ */ q('<span class="legend-item svelte-13rwf6w"><span class="legend-swatch svelte-13rwf6w"></span> </span>'), hl = /* @__PURE__ */ q('<div class="legend svelte-13rwf6w"></div>'), gl = /* @__PURE__ */ Ve('<rect fill="#38a169" rx="1"></rect>'), pl = /* @__PURE__ */ Ve('<rect fill="#e53e3e" rx="1"></rect>'), _l = /* @__PURE__ */ Ve('<line stroke="#718096" stroke-width="1.5"></line>'), xa = /* @__PURE__ */ Ve('<rect rx="1"></rect>'), ml = /* @__PURE__ */ Ve("<!><!>", 1), wl = /* @__PURE__ */ Ve('<text class="axis-label svelte-13rwf6w" text-anchor="middle"> </text>'), bl = /* @__PURE__ */ Ve('<!><!><rect fill="transparent" class="hover-zone svelte-13rwf6w" role="presentation"></rect>', 1), ya = /* @__PURE__ */ q('<div class="tooltip-row svelte-13rwf6w"><span class="cat-name svelte-13rwf6w"> </span> <span> </span></div>'), xl = /* @__PURE__ */ q('<div class="tooltip-list svelte-13rwf6w"></div> <div class="tooltip-divider svelte-13rwf6w"></div> <div class="tooltip-row tooltip-total svelte-13rwf6w"><strong>Net Funding:</strong> <strong> </strong></div>', 1), yl = /* @__PURE__ */ q('<div class="tooltip-row tooltip-subrow svelte-13rwf6w"><span class="cat-name svelte-13rwf6w"> </span> <span> </span></div>'), kl = /* @__PURE__ */ q('<div class="tooltip-divider svelte-13rwf6w"></div> <div class="tooltip-subheading svelte-13rwf6w">Portfolio Funding:</div> <div class="tooltip-list svelte-13rwf6w"></div>', 1), zl = /* @__PURE__ */ q('<div class="tooltip-list svelte-13rwf6w"></div> <div class="tooltip-divider svelte-13rwf6w"></div> <div class="tooltip-row tooltip-total svelte-13rwf6w"><strong>Operating Net:</strong> <strong> </strong></div> <!>', 1), El = /* @__PURE__ */ q('<div class="chart-tooltip svelte-13rwf6w"><div class="tooltip-header svelte-13rwf6w"><strong> </strong> <span> </span></div> <!></div>'), Sl = /* @__PURE__ */ q('<div class="chart-container svelte-13rwf6w"><div class="chart-header svelte-13rwf6w"><div class="title-and-controls svelte-13rwf6w"><h4 class="chart-title svelte-13rwf6w"> </h4> <div class="view-toggles svelte-13rwf6w"><button type="button">Operating Flows</button> <button type="button">Net Change</button> <!></div></div> <!></div> <svg class="chart-svg svelte-13rwf6w"><line stroke="var(--border-color, #cbd5e0)" stroke-width="1.5"></line><text class="axis-label svelte-13rwf6w" text-anchor="end"> </text><text class="axis-label svelte-13rwf6w" text-anchor="end">£0</text><text class="axis-label svelte-13rwf6w" text-anchor="end"> </text><!></svg> <!></div>');
const jl = {
  hash: "svelte-13rwf6w",
  code: ".chart-container.svelte-13rwf6w {position:relative;background:var(--background, #ffffff);border:1px solid var(--border-color, #e2e8f0);border-radius:8px;padding:1rem;box-shadow:0 1px 3px rgba(0, 0, 0, 0.05);}.chart-header.svelte-13rwf6w {display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem;flex-wrap:wrap;gap:0.5rem;}.title-and-controls.svelte-13rwf6w {display:flex;align-items:center;gap:1rem;flex-wrap:wrap;}.chart-title.svelte-13rwf6w {margin:0;font-size:0.95rem;font-weight:600;color:var(--text-color, #2d3748);}.view-toggles.svelte-13rwf6w {display:inline-flex;background:var(--background-muted, #edf2f7);border:1px solid var(--border-color, #e2e8f0);border-radius:6px;padding:2px;}.toggle-btn.svelte-13rwf6w {border:none;background:transparent;padding:3px 8px;font-size:0.75rem;font-weight:500;color:var(--text-muted, #718096);border-radius:4px;cursor:pointer;transition:all 0.15s ease;}.toggle-btn.svelte-13rwf6w:hover {color:var(--text-color, #2d3748);}.toggle-btn.active.svelte-13rwf6w {background:var(--card-bg, #ffffff);color:var(--primary, #2b6cb0);font-weight:600;box-shadow:0 1px 2px rgba(0, 0, 0, 0.08);}.legend.svelte-13rwf6w {display:flex;flex-wrap:wrap;gap:0.75rem;font-size:0.75rem;}.legend-item.svelte-13rwf6w {display:inline-flex;align-items:center;gap:0.35rem;color:var(--text-muted, #718096);text-transform:capitalize;}.legend-swatch.svelte-13rwf6w {width:10px;height:10px;border-radius:2px;}.chart-svg.svelte-13rwf6w {width:100%;height:auto;display:block;}.axis-label.svelte-13rwf6w {font-size:11px;fill:var(--text-muted, #a0aec0);}.hover-zone.svelte-13rwf6w {cursor:pointer;}.hover-zone.svelte-13rwf6w:hover {fill:rgba(66, 153, 225, 0.1);}.chart-tooltip.svelte-13rwf6w {position:absolute;top:1rem;right:1rem;background:rgba(26, 32, 44, 0.95);color:#ffffff;padding:0.5rem 0.75rem;border-radius:6px;font-size:0.8rem;box-shadow:0 4px 6px rgba(0, 0, 0, 0.15);pointer-events:none;z-index:10;min-width:200px;max-height:280px;overflow-y:auto;}.tooltip-header.svelte-13rwf6w {display:flex;justify-content:space-between;align-items:center;gap:0.75rem;margin-bottom:0.35rem;}.net-badge.svelte-13rwf6w {font-size:0.72rem;font-weight:600;padding:1px 6px;border-radius:3px;background:rgba(255, 255, 255, 0.15);}.net-badge.pos.svelte-13rwf6w {color:#68d391;background:rgba(104, 211, 145, 0.2);}.net-badge.neg.svelte-13rwf6w {color:#fc8181;background:rgba(252, 129, 129, 0.2);}.tooltip-list.svelte-13rwf6w {display:flex;flex-direction:column;gap:0.2rem;}.tooltip-row.svelte-13rwf6w {display:flex;justify-content:space-between;gap:1rem;}.tooltip-divider.svelte-13rwf6w {height:1px;background:rgba(255, 255, 255, 0.2);margin:0.35rem 0;}.tooltip-subheading.svelte-13rwf6w {font-size:0.7rem;font-weight:600;color:#a0aec0;margin-top:0.15rem;margin-bottom:0.15rem;text-transform:uppercase;letter-spacing:0.5px;}.tooltip-subrow.svelte-13rwf6w {font-size:0.75rem;opacity:0.9;}.tooltip-total.svelte-13rwf6w {font-weight:600;color:#edf2f7;}.cat-name.svelte-13rwf6w {color:#cbd5e0;text-transform:capitalize;}.cat-val.pos.svelte-13rwf6w {color:#68d391;}.cat-val.neg.svelte-13rwf6w {color:#fc8181;}"
};
function Tl(e, t) {
  Fr(t, !0), tn(e, jl);
  let r = /* @__PURE__ */ je("stacked"), n = /* @__PURE__ */ je(null);
  const a = {
    salary: "#38a169",
    earned_salary: "#38a169",
    state_pension: "#319795",
    investment_growth: "#48bb78",
    pension_drawdown: "#4299e1",
    sipp_drawdown: "#4299e1",
    isa_drawdown: "#63b3ed",
    offset_drawdown: "#4fd1c5",
    gia_drawdown: "#319795",
    living_expenses: "#e53e3e",
    living_costs: "#e53e3e",
    school_fees: "#dd6b20",
    mortgage_payment: "#d69e2e",
    mortgage_principal: "#d69e2e",
    mortgage_interest: "#c53030",
    income_tax: "#9b2c2c",
    cgt_paid: "#742a2a",
    cgt_drawdown: "#742a2a",
    cgt_bed_and_isa: "#742a2a",
    offset_savings: "#319795",
    isa_savings: "#63b3ed"
  }, i = [
    "#3182ce",
    "#38a169",
    "#d69e2e",
    "#e53e3e",
    "#805ad5",
    "#dd6b20",
    "#319795"
  ];
  function l(k, S) {
    var L, ie;
    if ((ie = (L = t.trace) == null ? void 0 : L.colors) != null && ie[k]) return t.trace.colors[k];
    if (a[k]) return a[k];
    const j = k.toLowerCase();
    return j.includes("tax") || j.includes("cgt") ? "#9b2c2c" : j.includes("interest") || j.includes("expense") || j.includes("living") ? "#e53e3e" : j.includes("mortgage") || j.includes("school") || j.includes("overflow") ? "#dd6b20" : j.includes("sipp") || j.includes("pension") ? "#3182ce" : j.includes("isa") ? "#63b3ed" : j.includes("gia") || j.includes("offset") ? "#319795" : j.includes("salary") || j.includes("growth") || j.includes("income") ? "#38a169" : i[S % i.length];
  }
  const o = 800, u = 320, c = { top: 25, right: 20, bottom: 35, left: 65 }, v = o - c.left - c.right, w = u - c.top - c.bottom;
  let d = /* @__PURE__ */ O(() => {
    var k;
    return !!((k = t.trace) != null && k.funding && Object.keys(t.trace.funding).length > 0);
  }), h = /* @__PURE__ */ O(() => t.trace ? s(r) === "funding" && t.trace.funding ? t.trace.funding : t.trace.cashflows || {} : {}), p = /* @__PURE__ */ O(() => Object.keys(s(h)));
  function x(k) {
    if (!t.trace || !t.trace.cashflows) return 0;
    let S = 0;
    for (const [j, L] of Object.entries(t.trace.cashflows))
      S += L[k] || 0;
    return S;
  }
  function g(k) {
    let S = 0;
    for (const j of s(p))
      S += s(h)[j][k] || 0;
    return S;
  }
  let _ = /* @__PURE__ */ O(() => {
    if (!t.trace || t.trace.periods.length === 0) return { maxIn: 1e5, maxOut: 1e5 };
    let k = 0, S = 0;
    for (let j = 0; j < t.trace.periods.length; j++)
      if (s(r) === "net") {
        const L = x(j);
        L > k && (k = L), L < 0 && Math.abs(L) > S && (S = Math.abs(L));
      } else {
        let L = 0, ie = 0;
        for (const [we, ge] of Object.entries(s(h))) {
          const le = ge[j] || 0;
          le > 0 ? L += le : le < 0 && (ie += Math.abs(le));
        }
        L > k && (k = L), ie > S && (S = ie);
      }
    return {
      maxIn: Math.max(k, 1e4),
      maxOut: Math.max(S, 1e4)
    };
  }), W = /* @__PURE__ */ O(() => s(_).maxIn + s(_).maxOut), V = /* @__PURE__ */ O(() => c.top + s(_).maxIn / s(W) * w);
  function U(k) {
    return k / s(W) * w;
  }
  function Q(k) {
    const S = Math.abs(k);
    return S >= 1e6 ? `£${(k / 1e6).toFixed(1)}M` : S >= 1e3 ? `£${(k / 1e3).toFixed(0)}k` : `£${k.toFixed(0)}`;
  }
  var de = Sl(), X = m(de), N = m(X), ve = m(N), ne = m(ve), T = y(ve, 2), R = m(T);
  let $;
  var A = y(R, 2);
  let K;
  var _e = y(A, 2);
  {
    var Ye = (k) => {
      var S = cl();
      let j;
      P(() => j = $e(S, 1, "toggle-btn svelte-13rwf6w", null, j, { active: s(r) === "funding" })), Mt("click", S, () => Z(r, "funding")), z(k, S);
    };
    re(_e, (k) => {
      s(d) && k(Ye);
    });
  }
  var ee = y(N, 2);
  {
    var ae = (k) => {
      var S = dl();
      z(k, S);
    }, E = (k) => {
      var S = hl();
      Re(S, 21, () => s(p), Ne, (j, L, ie) => {
        var we = vl(), ge = m(we), le = y(ge);
        P(
          (Me, Ct) => {
            ds(ge, `background: ${Me ?? ""};`), D(le, ` ${Ct ?? ""}`);
          },
          [
            () => l(s(L), ie),
            () => s(L).replace(/_/g, " ")
          ]
        ), z(j, we);
      }), z(k, S);
    };
    re(ee, (k) => {
      s(r) === "net" ? k(ae) : k(E, -1);
    });
  }
  var M = y(X, 2);
  b(M, "viewBox", "0 0 800 320");
  var G = m(M), fe = y(G), me = m(fe), Fe = y(fe), Oe = y(Fe), ct = m(Oe), Zt = y(Oe);
  {
    var Vt = (k) => {
      const S = /* @__PURE__ */ O(() => v / t.trace.periods.length), j = /* @__PURE__ */ O(() => Math.max(2, s(S) * 0.75));
      var L = Et(), ie = pe(L);
      Re(ie, 17, () => t.trace.periods, Ne, (we, ge, le) => {
        const Me = /* @__PURE__ */ O(() => c.left + le * s(S) + (s(S) - s(j)) / 2);
        var Ct = bl(), dr = pe(Ct);
        {
          var En = (De) => {
            const Ae = /* @__PURE__ */ O(() => x(le));
            var tt = Et(), Yt = pe(tt);
            {
              var kt = (oe) => {
                const te = /* @__PURE__ */ O(() => U(s(Ae)));
                var ue = gl();
                P(
                  (xe) => {
                    b(ue, "x", s(Me)), b(ue, "y", s(V) - s(te)), b(ue, "width", s(j)), b(ue, "height", xe);
                  },
                  [() => Math.max(1, s(te))]
                ), z(oe, ue);
              }, Wt = (oe) => {
                const te = /* @__PURE__ */ O(() => U(Math.abs(s(Ae))));
                var ue = pl();
                P(
                  (xe) => {
                    b(ue, "x", s(Me)), b(ue, "y", s(V)), b(ue, "width", s(j)), b(ue, "height", xe);
                  },
                  [() => Math.max(1, s(te))]
                ), z(oe, ue);
              }, be = (oe) => {
                var te = _l();
                P(() => {
                  b(te, "x1", s(Me)), b(te, "y1", s(V)), b(te, "x2", s(Me) + s(j)), b(te, "y2", s(V));
                }), z(oe, te);
              };
              re(Yt, (oe) => {
                s(Ae) > 0 ? oe(kt) : s(Ae) < 0 ? oe(Wt, 1) : oe(be, -1);
              });
            }
            z(De, tt);
          }, Sn = (De) => {
            const Ae = (be) => {
              const oe = /* @__PURE__ */ O(() => s(p).filter((xe) => (s(h)[xe][le] || 0) > 0));
              var te = Et(), ue = pe(te);
              Re(ue, 17, () => s(oe), Ne, (xe, Se, Ie) => {
                const zt = /* @__PURE__ */ O(() => s(h)[s(Se)][le]), rt = /* @__PURE__ */ O(() => U(s(zt))), dt = /* @__PURE__ */ O(() => s(oe).slice(0, Ie).reduce((We, vt) => We + s(h)[vt][le], 0)), Xe = /* @__PURE__ */ O(() => s(V) - U(s(dt)) - s(rt));
                var he = xa();
                P(
                  (We, vt) => {
                    b(he, "x", s(Me)), b(he, "y", s(Xe)), b(he, "width", s(j)), b(he, "height", We), b(he, "fill", vt);
                  },
                  [
                    () => Math.max(0, s(rt)),
                    () => l(s(Se), s(p).indexOf(s(Se)))
                  ]
                ), z(xe, he);
              }), z(be, te);
            }, tt = (be) => {
              const oe = /* @__PURE__ */ O(() => s(p).filter((xe) => (s(h)[xe][le] || 0) < 0));
              var te = Et(), ue = pe(te);
              Re(ue, 17, () => s(oe), Ne, (xe, Se, Ie) => {
                const zt = /* @__PURE__ */ O(() => Math.abs(s(h)[s(Se)][le])), rt = /* @__PURE__ */ O(() => U(s(zt))), dt = /* @__PURE__ */ O(() => s(oe).slice(0, Ie).reduce((We, vt) => We + Math.abs(s(h)[vt][le]), 0)), Xe = /* @__PURE__ */ O(() => s(V) + U(s(dt)));
                var he = xa();
                P(
                  (We, vt) => {
                    b(he, "x", s(Me)), b(he, "y", s(Xe)), b(he, "width", s(j)), b(he, "height", We), b(he, "fill", vt);
                  },
                  [
                    () => Math.max(0, s(rt)),
                    () => l(s(Se), s(p).indexOf(s(Se)))
                  ]
                ), z(xe, he);
              }), z(be, te);
            };
            var Yt = ml(), kt = pe(Yt);
            Ae(kt);
            var Wt = y(kt);
            tt(Wt), z(De, Yt);
          };
          re(dr, (De) => {
            s(r) === "net" ? De(En) : De(Sn, -1);
          });
        }
        var rn = y(dr);
        {
          var yt = (De) => {
            var Ae = wl(), tt = m(Ae);
            P(() => {
              b(Ae, "x", s(Me) + s(j) / 2), b(Ae, "y", u - c.bottom + 18), D(tt, s(ge));
            }), z(De, Ae);
          }, Qt = /* @__PURE__ */ O(() => le % Math.ceil(t.trace.periods.length / 8) === 0 || le === t.trace.periods.length - 1);
          re(rn, (De) => {
            s(Qt) && De(yt);
          });
        }
        var et = y(rn);
        P(() => {
          b(et, "x", s(Me)), b(et, "y", c.top), b(et, "width", s(j)), b(et, "height", w);
        }), mn("mouseenter", et, () => Z(n, le, !0)), mn("mouseleave", et, () => Z(n, null)), z(we, Ct);
      }), z(k, L);
    };
    re(Zt, (k) => {
      t.trace && t.trace.periods.length > 0 && k(Vt);
    });
  }
  var Ee = y(M, 2);
  {
    var Pe = (k) => {
      const S = /* @__PURE__ */ O(() => s(n)), j = /* @__PURE__ */ O(() => x(s(S))), L = /* @__PURE__ */ O(() => g(s(S)));
      var ie = El(), we = m(ie), ge = m(we), le = m(ge), Me = y(ge, 2);
      let Ct;
      var dr = m(Me), En = y(we, 2);
      {
        var Sn = (yt) => {
          var Qt = xl(), et = pe(Qt);
          Re(et, 21, () => s(p), Ne, (kt, Wt) => {
            const be = /* @__PURE__ */ O(() => s(h)[s(Wt)][s(S)] || 0);
            var oe = Et(), te = pe(oe);
            {
              var ue = (xe) => {
                var Se = ya(), Ie = m(Se), zt = m(Ie), rt = y(Ie, 2);
                let dt;
                var Xe = m(rt);
                P(
                  (he, We) => {
                    D(zt, `${he ?? ""}:`), dt = $e(rt, 1, "cat-val svelte-13rwf6w", null, dt, { pos: s(be) > 0, neg: s(be) < 0 }), D(Xe, `${s(be) > 0 ? "+" : ""}${We ?? ""}`);
                  },
                  [
                    () => s(Wt).replace(/_/g, " "),
                    () => Q(s(be))
                  ]
                ), z(xe, Se);
              };
              re(te, (xe) => {
                s(be) !== 0 && xe(ue);
              });
            }
            z(kt, oe);
          });
          var De = y(et, 4), Ae = y(m(De), 2);
          let tt;
          var Yt = m(Ae);
          P(
            (kt) => {
              tt = $e(Ae, 1, "cat-val svelte-13rwf6w", null, tt, { pos: s(L) >= 0, neg: s(L) < 0 }), D(Yt, `${s(L) >= 0 ? "+" : ""}${kt ?? ""}`);
            },
            [() => Q(s(L))]
          ), z(yt, Qt);
        }, rn = (yt) => {
          var Qt = zl(), et = pe(Qt);
          Re(et, 21, () => Object.keys(t.trace.cashflows), Ne, (be, oe) => {
            const te = /* @__PURE__ */ O(() => t.trace.cashflows[s(oe)][s(S)] || 0);
            var ue = Et(), xe = pe(ue);
            {
              var Se = (Ie) => {
                var zt = ya(), rt = m(zt), dt = m(rt), Xe = y(rt, 2);
                let he;
                var We = m(Xe);
                P(
                  (vt, nn) => {
                    D(dt, `${vt ?? ""}:`), he = $e(Xe, 1, "cat-val svelte-13rwf6w", null, he, { pos: s(te) > 0, neg: s(te) < 0 }), D(We, `${s(te) > 0 ? "+" : ""}${nn ?? ""}`);
                  },
                  [
                    () => s(oe).replace(/_/g, " "),
                    () => Q(s(te))
                  ]
                ), z(Ie, zt);
              };
              re(xe, (Ie) => {
                s(te) !== 0 && Ie(Se);
              });
            }
            z(be, ue);
          });
          var De = y(et, 4), Ae = y(m(De), 2);
          let tt;
          var Yt = m(Ae), kt = y(De, 2);
          {
            var Wt = (be) => {
              const oe = /* @__PURE__ */ O(() => Object.keys(t.trace.funding).filter((Se) => {
                var Ie;
                return (((Ie = t.trace.funding) == null ? void 0 : Ie[Se][s(S)]) || 0) !== 0;
              }));
              var te = Et(), ue = pe(te);
              {
                var xe = (Se) => {
                  var Ie = kl(), zt = y(pe(Ie), 4);
                  Re(zt, 21, () => s(oe), Ne, (rt, dt) => {
                    const Xe = /* @__PURE__ */ O(() => t.trace.funding[s(dt)][s(S)] || 0);
                    var he = yl(), We = m(he), vt = m(We), nn = y(We, 2);
                    let ia;
                    var gs = m(nn);
                    P(
                      (ps, _s) => {
                        D(vt, `${ps ?? ""}:`), ia = $e(nn, 1, "cat-val svelte-13rwf6w", null, ia, { pos: s(Xe) > 0, neg: s(Xe) < 0 }), D(gs, `${s(Xe) > 0 ? "+" : ""}${_s ?? ""}`);
                      },
                      [
                        () => s(dt).replace(/_/g, " "),
                        () => Q(s(Xe))
                      ]
                    ), z(rt, he);
                  }), z(Se, Ie);
                };
                re(ue, (Se) => {
                  s(oe).length > 0 && Se(xe);
                });
              }
              z(be, te);
            };
            re(kt, (be) => {
              s(d) && t.trace.funding && be(Wt);
            });
          }
          P(
            (be) => {
              tt = $e(Ae, 1, "cat-val svelte-13rwf6w", null, tt, { pos: s(j) >= 0, neg: s(j) < 0 }), D(Yt, `${s(j) >= 0 ? "+" : ""}${be ?? ""}`);
            },
            [() => Q(s(j))]
          ), z(yt, Qt);
        };
        re(En, (yt) => {
          s(r) === "funding" ? yt(Sn) : yt(rn, -1);
        });
      }
      P(
        (yt) => {
          D(le, `Year ${t.trace.periods[s(S)] ?? ""}`), Ct = $e(Me, 1, "net-badge svelte-13rwf6w", null, Ct, { pos: s(j) >= 0, neg: s(j) < 0 }), D(dr, `${s(j) >= 0 ? "+" : ""}${yt ?? ""}`);
        },
        [() => Q(s(j))]
      ), z(k, ie);
    };
    re(Ee, (k) => {
      s(n) !== null && t.trace && k(Pe);
    });
  }
  P(
    (k, S) => {
      D(ne, s(r) === "funding" ? "Portfolio Funding & Drawdowns" : "Annual Cashflow Waterfall"), $ = $e(R, 1, "toggle-btn svelte-13rwf6w", null, $, { active: s(r) === "stacked" }), K = $e(A, 1, "toggle-btn svelte-13rwf6w", null, K, { active: s(r) === "net" }), b(G, "x1", c.left), b(G, "y1", s(V)), b(G, "x2", o - c.right), b(G, "y2", s(V)), b(fe, "x", c.left - 8), b(fe, "y", c.top + 10), D(me, `+${k ?? ""}`), b(Fe, "x", c.left - 8), b(Fe, "y", s(V) + 4), b(Oe, "x", c.left - 8), b(Oe, "y", u - c.bottom), D(ct, `-${S ?? ""}`);
    },
    [
      () => Q(s(_).maxIn),
      () => Q(s(_).maxOut)
    ]
  ), Mt("click", R, () => Z(r, "stacked")), Mt("click", A, () => Z(r, "net")), z(e, de), Ir();
}
zn(["click"]);
var Ol = /* @__PURE__ */ q('<span class="legend-item svelte-12xzg4y"><span class="legend-swatch svelte-12xzg4y"></span> </span>'), Ml = /* @__PURE__ */ q('<span class="legend-item svelte-12xzg4y"><span class="legend-swatch svelte-12xzg4y" style="background: #2b6cb0;"></span> Total Net Worth</span>'), Al = /* @__PURE__ */ Ve('<line stroke="var(--border-color, #edf2f7)" stroke-dasharray="3,3"></line><text class="axis-label svelte-12xzg4y" text-anchor="end"> </text>', 1), Cl = /* @__PURE__ */ Ve('<circle r="5" fill="#2b6cb0" stroke="#ffffff" stroke-width="2"></circle>'), Fl = /* @__PURE__ */ Ve('<path fill="none" stroke="#2b6cb0" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path><!>', 1), Il = /* @__PURE__ */ Ve('<path fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path>'), Nl = /* @__PURE__ */ Ve('<text class="axis-label svelte-12xzg4y" text-anchor="middle"> </text>'), Rl = /* @__PURE__ */ Ve('<line stroke="#4a5568" stroke-width="1.5" stroke-dasharray="2,2"></line>'), Pl = /* @__PURE__ */ Ve('<rect fill="transparent" class="hover-zone svelte-12xzg4y" role="presentation"></rect>'), Dl = /* @__PURE__ */ Ve("<!><!><!><!>", 1), Ll = /* @__PURE__ */ q('<div class="tooltip-row svelte-12xzg4y"><span class="cat-name svelte-12xzg4y"> </span> <span class="cat-val svelte-12xzg4y"> </span></div>'), Bl = /* @__PURE__ */ q('<div class="chart-tooltip svelte-12xzg4y"><div class="tooltip-header svelte-12xzg4y"><strong> </strong> <span class="total-badge svelte-12xzg4y"> </span></div> <div class="tooltip-list svelte-12xzg4y"></div> <div class="tooltip-divider svelte-12xzg4y"></div> <div class="tooltip-row tooltip-total svelte-12xzg4y"><strong>Total Net Worth:</strong> <strong> </strong></div></div>'), Hl = /* @__PURE__ */ q('<div class="chart-container svelte-12xzg4y"><div class="chart-header svelte-12xzg4y"><div class="title-and-controls svelte-12xzg4y"><h4 class="chart-title svelte-12xzg4y">Account Balance Trajectories</h4> <div class="view-toggles svelte-12xzg4y"><button type="button">All Accounts</button> <button type="button">Total Only</button></div></div> <div class="legend svelte-12xzg4y"><!></div></div> <svg class="chart-svg svelte-12xzg4y"><!><!></svg> <!></div>');
const Vl = {
  hash: "svelte-12xzg4y",
  code: ".chart-container.svelte-12xzg4y {position:relative;background:var(--background, #ffffff);border:1px solid var(--border-color, #e2e8f0);border-radius:8px;padding:1rem;box-shadow:0 1px 3px rgba(0, 0, 0, 0.05);}.chart-header.svelte-12xzg4y {display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem;flex-wrap:wrap;gap:0.5rem;}.title-and-controls.svelte-12xzg4y {display:flex;align-items:center;gap:1rem;flex-wrap:wrap;}.chart-title.svelte-12xzg4y {margin:0;font-size:0.95rem;font-weight:600;color:var(--text-color, #2d3748);}.view-toggles.svelte-12xzg4y {display:inline-flex;background:var(--background-muted, #edf2f7);border:1px solid var(--border-color, #e2e8f0);border-radius:6px;padding:2px;}.toggle-btn.svelte-12xzg4y {border:none;background:transparent;padding:3px 8px;font-size:0.75rem;font-weight:500;color:var(--text-muted, #718096);border-radius:4px;cursor:pointer;transition:all 0.15s ease;}.toggle-btn.svelte-12xzg4y:hover {color:var(--text-color, #2d3748);}.toggle-btn.active.svelte-12xzg4y {background:var(--card-bg, #ffffff);color:var(--primary, #2b6cb0);font-weight:600;box-shadow:0 1px 2px rgba(0, 0, 0, 0.08);}.legend.svelte-12xzg4y {display:flex;flex-wrap:wrap;gap:0.75rem;font-size:0.75rem;}.legend-item.svelte-12xzg4y {display:inline-flex;align-items:center;gap:0.35rem;color:var(--text-muted, #718096);text-transform:capitalize;}.legend-swatch.svelte-12xzg4y {width:10px;height:10px;border-radius:2px;}.chart-svg.svelte-12xzg4y {width:100%;height:auto;display:block;}.axis-label.svelte-12xzg4y {font-size:11px;fill:var(--text-muted, #a0aec0);}.hover-zone.svelte-12xzg4y {cursor:pointer;}.hover-zone.svelte-12xzg4y:hover {fill:rgba(66, 153, 225, 0.08);}.chart-tooltip.svelte-12xzg4y {position:absolute;top:1rem;right:1rem;background:rgba(26, 32, 44, 0.95);color:#ffffff;padding:0.5rem 0.75rem;border-radius:6px;font-size:0.8rem;box-shadow:0 4px 6px rgba(0, 0, 0, 0.15);pointer-events:none;z-index:10;min-width:180px;}.tooltip-header.svelte-12xzg4y {display:flex;justify-content:space-between;align-items:center;gap:0.75rem;margin-bottom:0.35rem;}.total-badge.svelte-12xzg4y {font-size:0.72rem;font-weight:600;padding:1px 6px;border-radius:3px;color:#63b3ed;background:rgba(99, 179, 237, 0.2);}.tooltip-list.svelte-12xzg4y {display:flex;flex-direction:column;gap:0.2rem;}.tooltip-row.svelte-12xzg4y {display:flex;justify-content:space-between;gap:1rem;}.tooltip-divider.svelte-12xzg4y {height:1px;background:rgba(255, 255, 255, 0.2);margin:0.35rem 0;}.tooltip-total.svelte-12xzg4y {font-weight:600;color:#edf2f7;}.cat-name.svelte-12xzg4y {color:#cbd5e0;text-transform:capitalize;}.cat-val.svelte-12xzg4y {color:#edf2f7;}"
};
function Yl(e, t) {
  Fr(t, !0), tn(e, Vl);
  let r = /* @__PURE__ */ je(null), n = /* @__PURE__ */ je(!1);
  const a = [
    "#3182ce",
    "#38a169",
    "#805ad5",
    "#dd6b20",
    "#319795",
    "#d69e2e",
    "#e53e3e"
  ], i = 800, l = 320, o = { top: 25, right: 20, bottom: 35, left: 65 }, u = i - o.left - o.right, c = l - o.top - o.bottom;
  let v = /* @__PURE__ */ O(() => t.trace ? Object.keys(t.trace.balances) : []);
  function w(E) {
    if (!t.trace) return 0;
    if (t.trace.metrics && t.trace.metrics.net_worth && t.trace.metrics.net_worth[E] !== void 0)
      return t.trace.metrics.net_worth[E];
    let M = 0;
    for (const G of s(v)) {
      const fe = t.trace.balances[G][E] || 0;
      G.toLowerCase().includes("mortgage") || G.toLowerCase().includes("debt") ? M -= fe : M += fe;
    }
    return M;
  }
  let d = /* @__PURE__ */ O(() => !t.trace || t.trace.periods.length === 0 ? [] : t.trace.periods.map((E, M) => w(M))), h = /* @__PURE__ */ O(() => {
    if (!t.trace || t.trace.periods.length === 0) return 5e5;
    let E = 0;
    if (s(n))
      for (const M of s(d))
        M > E && (E = M);
    else
      for (const M of s(v))
        for (const G of t.trace.balances[M])
          G > E && (E = G);
    return Math.max(E * 1.1, 1e5);
  });
  function p(E) {
    const M = Math.abs(E);
    return M >= 1e6 ? `£${(E / 1e6).toFixed(1)}M` : M >= 1e3 ? `£${(E / 1e3).toFixed(0)}k` : `£${E.toFixed(0)}`;
  }
  function x(E, M) {
    return M <= 1 ? o.left : o.left + E / (M - 1) * u;
  }
  function g(E) {
    return o.top + c - Math.max(0, E) / s(h) * c;
  }
  function _(E) {
    return !E || E.length === 0 ? "" : E.map((M, G) => `${G === 0 ? "M" : "L"} ${x(G, E.length).toFixed(1)} ${g(M).toFixed(1)}`).join(" ");
  }
  var W = Hl(), V = m(W), U = m(V), Q = y(m(U), 2), de = m(Q);
  let X;
  var N = y(de, 2);
  let ve;
  var ne = y(U, 2), T = m(ne);
  {
    var R = (E) => {
      var M = Et(), G = pe(M);
      Re(G, 17, () => s(v), Ne, (fe, me, Fe) => {
        var Oe = Ol(), ct = m(Oe), Zt = y(ct);
        P(
          (Vt) => {
            ds(ct, `background: ${a[Fe % a.length] ?? ""};`), D(Zt, ` ${Vt ?? ""}`);
          },
          [() => s(me).replace(/_/g, " ")]
        ), z(fe, Oe);
      }), z(E, M);
    }, $ = (E) => {
      var M = Ml();
      z(E, M);
    };
    re(T, (E) => {
      s(n) ? E($, -1) : E(R);
    });
  }
  var A = y(V, 2);
  b(A, "viewBox", "0 0 800 320");
  var K = m(A);
  Re(K, 16, () => [0, 0.25, 0.5, 0.75, 1], Ne, (E, M) => {
    const G = /* @__PURE__ */ O(() => o.top + c * (1 - M));
    var fe = Al(), me = pe(fe), Fe = y(me), Oe = m(Fe);
    P(
      (ct) => {
        b(me, "x1", o.left), b(me, "y1", s(G)), b(me, "x2", i - o.right), b(me, "y2", s(G)), b(Fe, "x", o.left - 8), b(Fe, "y", s(G) + 4), D(Oe, ct);
      },
      [() => p(s(h) * M)]
    ), z(E, fe);
  });
  var _e = y(K);
  {
    var Ye = (E) => {
      const M = /* @__PURE__ */ O(() => u / t.trace.periods.length);
      var G = Dl(), fe = pe(G);
      {
        var me = (Ee) => {
          var Pe = Fl(), k = pe(Pe), S = y(k);
          {
            var j = (L) => {
              const ie = /* @__PURE__ */ O(() => x(s(r), t.trace.periods.length)), we = /* @__PURE__ */ O(() => g(s(d)[s(r)] || 0));
              var ge = Cl();
              P(() => {
                b(ge, "cx", s(ie)), b(ge, "cy", s(we));
              }), z(L, ge);
            };
            re(S, (L) => {
              s(r) !== null && L(j);
            });
          }
          P((L) => b(k, "d", L), [() => _(s(d))]), z(Ee, Pe);
        }, Fe = (Ee) => {
          var Pe = Et(), k = pe(Pe);
          Re(k, 17, () => s(v), Ne, (S, j, L) => {
            var ie = Il();
            P(
              (we) => {
                b(ie, "d", we), b(ie, "stroke", a[L % a.length]);
              },
              [() => _(t.trace.balances[s(j)])]
            ), z(S, ie);
          }), z(Ee, Pe);
        };
        re(fe, (Ee) => {
          s(n) ? Ee(me) : Ee(Fe, -1);
        });
      }
      var Oe = y(fe);
      Re(Oe, 17, () => t.trace.periods, Ne, (Ee, Pe, k) => {
        var S = Et(), j = pe(S);
        {
          var L = (we) => {
            var ge = Nl(), le = m(ge);
            P(
              (Me) => {
                b(ge, "x", Me), b(ge, "y", l - o.bottom + 18), D(le, s(Pe));
              },
              [() => x(k, t.trace.periods.length)]
            ), z(we, ge);
          }, ie = /* @__PURE__ */ O(() => k % Math.ceil(t.trace.periods.length / 8) === 0 || k === t.trace.periods.length - 1);
          re(j, (we) => {
            s(ie) && we(L);
          });
        }
        z(Ee, S);
      });
      var ct = y(Oe);
      {
        var Zt = (Ee) => {
          const Pe = /* @__PURE__ */ O(() => x(s(r), t.trace.periods.length));
          var k = Rl();
          P(() => {
            b(k, "x1", s(Pe)), b(k, "y1", o.top), b(k, "x2", s(Pe)), b(k, "y2", o.top + c);
          }), z(Ee, k);
        };
        re(ct, (Ee) => {
          s(r) !== null && Ee(Zt);
        });
      }
      var Vt = y(ct);
      Re(Vt, 17, () => t.trace.periods, Ne, (Ee, Pe, k) => {
        var S = Pl();
        P(() => {
          b(S, "x", o.left + k * s(M)), b(S, "y", o.top), b(S, "width", s(M)), b(S, "height", c);
        }), mn("mouseenter", S, () => Z(r, k, !0)), mn("mouseleave", S, () => Z(r, null)), z(Ee, S);
      }), z(E, G);
    };
    re(_e, (E) => {
      t.trace && t.trace.periods.length > 0 && E(Ye);
    });
  }
  var ee = y(A, 2);
  {
    var ae = (E) => {
      const M = /* @__PURE__ */ O(() => s(r)), G = /* @__PURE__ */ O(() => s(d)[s(M)] ?? 0);
      var fe = Bl(), me = m(fe), Fe = m(me), Oe = m(Fe), ct = y(Fe, 2), Zt = m(ct), Vt = y(me, 2);
      Re(Vt, 21, () => s(v), Ne, (S, j) => {
        const L = /* @__PURE__ */ O(() => t.trace.balances[s(j)][s(M)] || 0);
        var ie = Ll(), we = m(ie), ge = m(we), le = y(we, 2), Me = m(le);
        P(
          (Ct, dr) => {
            D(ge, `${Ct ?? ""}:`), D(Me, dr);
          },
          [
            () => s(j).replace(/_/g, " "),
            () => p(s(L))
          ]
        ), z(S, ie);
      });
      var Ee = y(Vt, 4), Pe = y(m(Ee), 2), k = m(Pe);
      P(
        (S, j) => {
          D(Oe, `Year ${t.trace.periods[s(M)] ?? ""}`), D(Zt, `Total: ${S ?? ""}`), D(k, j);
        },
        [
          () => p(s(G)),
          () => p(s(G))
        ]
      ), z(E, fe);
    };
    re(ee, (E) => {
      s(r) !== null && t.trace && E(ae);
    });
  }
  P(() => {
    X = $e(de, 1, "toggle-btn svelte-12xzg4y", null, X, { active: !s(n) }), ve = $e(N, 1, "toggle-btn svelte-12xzg4y", null, ve, { active: s(n) });
  }), Mt("click", de, () => Z(n, !1)), Mt("click", N, () => Z(n, !0)), z(e, W), Ir();
}
zn(["click"]);
var Wl = /* @__PURE__ */ q("<option> </option>"), ql = /* @__PURE__ */ q('<div class="scenario-selector svelte-ul5gk9"><label for="scenario-dropdown" class="scenario-label svelte-ul5gk9">Scenario:</label> <select id="scenario-dropdown" class="scenario-dropdown svelte-ul5gk9"></select></div>'), Ul = /* @__PURE__ */ q('<span class="model-badge svelte-ul5gk9">Model: <strong> </strong></span>'), Gl = /* @__PURE__ */ q('<span class="demo-badge svelte-ul5gk9">Demo Mode (household_model.py not found)</span>'), Kl = /* @__PURE__ */ q("<!> <!>", 1), Xl = /* @__PURE__ */ q('<div class="error-banner svelte-ul5gk9"><strong>Error:</strong> <button class="dismiss-btn svelte-ul5gk9">✕</button></div>'), Jl = /* @__PURE__ */ q('<div class="loading-state svelte-ul5gk9"><div class="spinner svelte-ul5gk9"></div> <p>Initializing simulation engine and loading ledger data...</p></div>'), Zl = /* @__PURE__ */ q('<!> <div class="main-layout svelte-ul5gk9"><aside class="sidebar"><!></aside> <main class="content-charts svelte-ul5gk9"><!> <!></main></div>', 1), Ql = /* @__PURE__ */ q('<div class="cashflow-app svelte-ul5gk9"><header class="app-header svelte-ul5gk9"><div class="header-left svelte-ul5gk9"><h2 class="app-title svelte-ul5gk9">Lifetime Cashflow & Decumulation</h2> <!></div> <div class="header-actions"><button class="reset-button svelte-ul5gk9">Reset Defaults</button></div></header> <!> <!></div>');
const $l = {
  hash: "svelte-ul5gk9",
  code: `.cashflow-app.svelte-ul5gk9 {padding:1.5rem;max-width:1400px;margin:0 auto;font-family:var(--font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif);color:var(--text-color, #2d3748);}.app-header.svelte-ul5gk9 {display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;padding-bottom:1rem;border-bottom:1px solid var(--border-color, #e2e8f0);flex-wrap:wrap;gap:1rem;}.app-title.svelte-ul5gk9 {margin:0;font-size:1.5rem;font-weight:700;}.header-left.svelte-ul5gk9 {display:flex;align-items:baseline;gap:1rem;flex-wrap:wrap;}.model-badge.svelte-ul5gk9 {font-size:0.85rem;color:var(--text-muted, #718096);}.scenario-selector.svelte-ul5gk9 {display:flex;align-items:center;gap:0.5rem;}.scenario-label.svelte-ul5gk9 {font-size:0.85rem;font-weight:600;color:var(--text-muted, #718096);}.scenario-dropdown.svelte-ul5gk9 {background:var(--background, #ffffff);border:1px solid var(--border-color, #cbd5e0);border-radius:6px;padding:0.3rem 0.7rem;font-size:0.85rem;font-weight:600;color:var(--text-color, #2b6cb0);cursor:pointer;outline:none;transition:border-color 0.15s ease, box-shadow 0.15s ease;}.scenario-dropdown.svelte-ul5gk9:focus {border-color:#3182ce;box-shadow:0 0 0 1px #3182ce;}.demo-badge.svelte-ul5gk9 {font-size:0.75rem;font-weight:600;background:#feebc8;color:#c05621;padding:0.2rem 0.5rem;border-radius:4px;}.reset-button.svelte-ul5gk9 {background:var(--background, #ffffff);border:1px solid var(--border-color, #cbd5e0);border-radius:6px;padding:0.4rem 0.85rem;font-size:0.85rem;font-weight:500;color:var(--text-color, #4a5568);cursor:pointer;transition:background 0.15s ease;}.reset-button.svelte-ul5gk9:hover:not(:disabled) {background:var(--background-secondary, #edf2f7);}.reset-button.svelte-ul5gk9:disabled {opacity:0.5;cursor:not-allowed;}.error-banner.svelte-ul5gk9 {display:flex;justify-content:space-between;align-items:center;background:#fff5f5;border:1px solid #feb2b2;color:#c53030;padding:0.75rem 1rem;border-radius:6px;margin-bottom:1.25rem;}.dismiss-btn.svelte-ul5gk9 {background:none;border:none;font-size:1rem;cursor:pointer;color:#c53030;}.loading-state.svelte-ul5gk9 {padding:4rem 1rem;text-align:center;color:var(--text-muted, #718096);}.spinner.svelte-ul5gk9 {width:2rem;height:2rem;border:3px solid #cbd5e0;border-top-color:#3182ce;border-radius:50%;
    animation: svelte-ul5gk9-spin 0.8s linear infinite;margin:0 auto 1rem auto;}

  @keyframes svelte-ul5gk9-spin {
    to {
      transform: rotate(360deg);
    }
  }.main-layout.svelte-ul5gk9 {display:grid;grid-template-columns:340px 1fr;gap:1.5rem;align-items:start;}

  @media (max-width: 960px) {.main-layout.svelte-ul5gk9 {grid-template-columns:1fr;}
  }.content-charts.svelte-ul5gk9 {display:flex;flex-direction:column;gap:1.5rem;}`
};
function eo(e, t) {
  Fr(t, !0), tn(e, $l);
  let r = /* @__PURE__ */ je(null), n = /* @__PURE__ */ je(_r({})), a = /* @__PURE__ */ je(null), i = /* @__PURE__ */ je(!0), l = /* @__PURE__ */ je(!1), o = /* @__PURE__ */ je(null), u = null;
  function c() {
    return (window.location.pathname.split("extension/")[0] || "/") + "extension/Cashflow/";
  }
  async function v(T) {
    Z(i, !0), Z(o, null);
    try {
      const R = c() + "params" + (T ? `?model=${encodeURIComponent(T)}` : ""), $ = await fetch(R);
      if (!$.ok) throw new Error(`HTTP ${$.status}: ${$.statusText}`);
      const A = await $.json();
      if (A.status !== "success") throw new Error(A.message || "Failed to load params");
      Z(r, A, !0);
      const K = {};
      for (const [_e, Ye] of Object.entries(A.params))
        K[_e] = Ye.default;
      Z(n, K, !0), await w(K, A.model_name);
    } catch (R) {
      Z(o, R.message || String(R), !0);
    } finally {
      Z(i, !1);
    }
  }
  async function w(T = s(n), R = (($) => ($ = s(r)) == null ? void 0 : $.model_name)()) {
    if (s(r)) {
      Z(l, !0);
      try {
        const A = await fetch(c() + "simulate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: R,
            overrides: T,
            start_year: s(r).start_year,
            end_year: s(r).end_year
          })
        });
        if (!A.ok) throw new Error(`Simulation failed: HTTP ${A.status}`);
        const K = await A.json();
        if (K.status !== "success") throw new Error(K.message || "Simulation error");
        Z(a, K.trace, !0);
      } catch (A) {
        Z(o, A.message || String(A), !0);
      } finally {
        Z(l, !1);
      }
    }
  }
  function d(T) {
    var R;
    T !== ((R = s(r)) == null ? void 0 : R.model_name) && v(T);
  }
  function h(T, R) {
    s(n)[T] = R, clearTimeout(u), u = setTimeout(
      () => {
        w();
      },
      40
    );
  }
  function p() {
    if (!s(r)) return;
    const T = {};
    for (const [R, $] of Object.entries(s(r).params))
      T[R] = $.default;
    Z(n, T, !0), w(T);
  }
  Qi(() => {
    v();
  });
  var x = Ql(), g = m(x), _ = m(g), W = y(m(_), 2);
  {
    var V = (T) => {
      var R = Kl(), $ = pe(R);
      {
        var A = (ee) => {
          var ae = ql(), E = y(m(ae), 2);
          Re(E, 21, () => s(r).models, Ne, (G, fe) => {
            var me = Wl(), Fe = m(me), Oe = {};
            P(() => {
              D(Fe, s(fe)), Oe !== (Oe = s(fe)) && (me.value = (me.__value = s(fe)) ?? "");
            }), z(G, me);
          });
          var M;
          Gi(E), P(() => {
            E.disabled = s(l), M !== (M = s(r).model_name) && (E.value = (E.__value = s(r).model_name) ?? "", vs(E, s(r).model_name));
          }), Mt("change", E, (G) => d(G.currentTarget.value)), z(ee, ae);
        }, K = (ee) => {
          var ae = Ul(), E = y(m(ae)), M = m(E);
          P(() => D(M, s(r).model_name)), z(ee, ae);
        };
        re($, (ee) => {
          s(r).models && s(r).models.length > 1 ? ee(A) : ee(K, -1);
        });
      }
      var _e = y($, 2);
      {
        var Ye = (ee) => {
          var ae = Gl();
          z(ee, ae);
        };
        re(_e, (ee) => {
          s(r).is_demo && ee(Ye);
        });
      }
      z(T, R);
    };
    re(W, (T) => {
      s(r) && T(V);
    });
  }
  var U = y(_, 2), Q = m(U), de = y(g, 2);
  {
    var X = (T) => {
      var R = Xl(), $ = y(m(R)), A = y($);
      P(() => D($, ` ${s(o) ?? ""} `)), Mt("click", A, () => Z(o, null)), z(T, R);
    };
    re(de, (T) => {
      s(o) && T(X);
    });
  }
  var N = y(de, 2);
  {
    var ve = (T) => {
      var R = Jl();
      z(T, R);
    }, ne = (T) => {
      var R = Zl(), $ = pe(R);
      ul($, {
        get trace() {
          return s(a);
        }
      });
      var A = y($, 2), K = m(A), _e = m(K);
      ll(_e, {
        get params() {
          return s(r).params;
        },
        get values() {
          return s(n);
        },
        onchange: h
      });
      var Ye = y(K, 2), ee = m(Ye);
      Tl(ee, {
        get trace() {
          return s(a);
        }
      });
      var ae = y(ee, 2);
      Yl(ae, {
        get trace() {
          return s(a);
        }
      }), z(T, R);
    };
    re(N, (T) => {
      s(i) ? T(ve) : s(r) && T(ne, 1);
    });
  }
  P(() => Q.disabled = s(l)), Mt("click", Q, p), z(e, x), Ir();
}
zn(["change", "click"]);
let sn = null;
const no = {
  init: async function() {
    console.log("Cashflow Svelte Module initialized.");
  },
  onExtensionPageLoad: function() {
    const e = document.getElementById("cashflow-root");
    e && (sn && (Bi(sn), sn = null), e.innerHTML = "", sn = Di(eo, {
      target: e
    }));
  }
};
export {
  no as default
};
