var cu = Object.defineProperty;
var Ii = (e) => {
  throw TypeError(e);
};
var fu = (e, t, n) => t in e ? cu(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var m = (e, t, n) => fu(e, typeof t != "symbol" ? t + "" : t, n), ss = (e, t, n) => t.has(e) || Ii("Cannot " + n);
var c = (e, t, n) => (ss(e, t, "read from private field"), n ? n.call(e) : t.get(e)), q = (e, t, n) => t.has(e) ? Ii("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n), I = (e, t, n, r) => (ss(e, t, "write to private field"), r ? r.call(e, n) : t.set(e, n), n), G = (e, t, n) => (ss(e, t, "access private method"), n);
var li = Array.isArray, du = Array.prototype.indexOf, ya = Array.prototype.includes, Ha = Array.from, Ao = Object.defineProperty, sr = Object.getOwnPropertyDescriptor, hu = Object.getOwnPropertyDescriptors, vu = Object.prototype, mu = Array.prototype, Lo = Object.getPrototypeOf, Pi = Object.isExtensible;
const Xt = () => {
};
function No(e) {
  for (var t = 0; t < e.length; t++)
    e[t]();
}
function Uo() {
  var e, t, n = new Promise((r, a) => {
    e = r, t = a;
  });
  return { promise: n, resolve: e, reject: t };
}
function Oo(e, t) {
  if (Array.isArray(e))
    return e;
  if (!(Symbol.iterator in e))
    return Array.from(e);
  const n = [];
  for (const r of e)
    if (n.push(r), n.length === t) break;
  return n;
}
const Ae = 2, pr = 4, ta = 8, ui = 1 << 24, St = 16, mt = 32, en = 64, xs = 128, ht = 512, je = 1024, De = 2048, Mt = 4096, He = 8192, nt = 16384, kr = 32768, ks = 1 << 25, Ln = 65536, ba = 1 << 17, pu = 1 << 18, Er = 1 << 19, Fo = 1 << 20, Ot = 1 << 25, Nn = 65536, wa = 1 << 21, ir = 1 << 22, cn = 1 << 23, jn = Symbol("$state"), gu = Symbol("legacy props"), _u = Symbol(""), da = Symbol("attributes"), Es = Symbol("class"), yu = Symbol("style"), Nr = Symbol("text"), ha = Symbol("form reset"), na = new class extends Error {
  constructor() {
    super(...arguments);
    m(this, "name", "StaleReactionError");
    m(this, "message", "The reaction that called `getAbortSignal()` was re-run or destroyed");
  }
}();
var Co;
const bu = (
  // We gotta write it like this because after downleveling the pure comment may end up in the wrong location
  !!((Co = globalThis.document) != null && Co.contentType) && /* @__PURE__ */ globalThis.document.contentType.includes("xml")
);
function qo(e) {
  throw new Error("https://svelte.dev/e/lifecycle_outside_component");
}
function wu() {
  throw new Error("https://svelte.dev/e/async_derived_orphan");
}
function xu(e, t, n) {
  throw new Error("https://svelte.dev/e/each_key_duplicate");
}
function ku(e) {
  throw new Error("https://svelte.dev/e/effect_in_teardown");
}
function Eu() {
  throw new Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function Su(e) {
  throw new Error("https://svelte.dev/e/effect_orphan");
}
function Tu() {
  throw new Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function Mu(e) {
  throw new Error("https://svelte.dev/e/props_invalid_value");
}
function Cu() {
  throw new Error("https://svelte.dev/e/state_descriptors_fixed");
}
function ju() {
  throw new Error("https://svelte.dev/e/state_prototype_fixed");
}
function Du() {
  throw new Error("https://svelte.dev/e/state_unsafe_mutation");
}
function Au() {
  throw new Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
const Lu = 1, Nu = 2, Ro = 4, Uu = 8, Ou = 16, Fu = 1, qu = 4, Ru = 8, Iu = 16, Pu = 1, zu = 2, Ce = Symbol("uninitialized"), Vu = "http://www.w3.org/1999/xhtml";
function Yu() {
  console.warn("https://svelte.dev/e/derived_inert");
}
function Hu() {
  console.warn("https://svelte.dev/e/select_multiple_invalid_value");
}
function Wu() {
  console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
function Io(e) {
  return e === this.v;
}
function Po(e, t) {
  return e != e ? t == t : e !== t || e !== null && typeof e == "object" || typeof e == "function";
}
function zo(e) {
  return !Po(e, this.v);
}
let Ue = null;
function gr(e) {
  Ue = e;
}
function Fe(e, t = !1, n) {
  Ue = {
    p: Ue,
    i: !1,
    c: null,
    e: null,
    s: e,
    x: null,
    r: (
      /** @type {Effect} */
      Z
    ),
    l: null
  };
}
function qe(e) {
  var t = (
    /** @type {ComponentContext} */
    Ue
  ), n = t.e;
  if (n !== null) {
    t.e = null;
    for (var r of n)
      fl(r);
  }
  return t.i = !0, Ue = t.p, /** @type {T} */
  {};
}
function Vo() {
  return !0;
}
let mn = [];
function Yo() {
  var e = mn;
  mn = [], No(e);
}
function $t(e) {
  if (mn.length === 0 && !Ir) {
    var t = mn;
    queueMicrotask(() => {
      t === mn && Yo();
    });
  }
  mn.push(e);
}
function Bu() {
  for (; mn.length > 0; )
    Yo();
}
function Ho(e) {
  var t = Z;
  if (t === null)
    return $.f |= cn, e;
  if ((t.f & kr) === 0 && (t.f & pr) === 0)
    throw e;
  un(e, t);
}
function un(e, t) {
  if (!(t !== null && (t.f & nt) !== 0)) {
    for (; t !== null; ) {
      if ((t.f & xs) !== 0) {
        if ((t.f & kr) === 0)
          throw e;
        try {
          t.b.error(e);
          return;
        } catch (n) {
          e = n;
        }
      }
      t = t.parent;
    }
    throw e;
  }
}
const Gu = -7169;
function _e(e, t) {
  e.f = e.f & Gu | t;
}
function ci(e) {
  (e.f & ht) !== 0 || e.deps === null ? _e(e, je) : _e(e, Mt);
}
function Wo(e) {
  if (e !== null)
    for (const t of e)
      (t.f & Ae) === 0 || (t.f & Nn) === 0 || (t.f ^= Nn, Wo(
        /** @type {Derived} */
        t.deps
      ));
}
function Bo(e, t, n) {
  (e.f & De) !== 0 ? t.add(e) : (e.f & Mt) !== 0 && n.add(e), Wo(e.deps), _e(e, je);
}
function fi(e, t, n) {
  if (e == null)
    return t(void 0), n && n(void 0), Xt;
  const r = In(
    () => e.subscribe(
      t,
      // @ts-expect-error
      n
    )
  );
  return r.unsubscribe ? () => r.unsubscribe() : r;
}
const Vn = [];
function Ku(e, t) {
  return {
    subscribe: nn(e, t).subscribe
  };
}
function nn(e, t = Xt) {
  let n = null;
  const r = /* @__PURE__ */ new Set();
  function a(o) {
    if (Po(e, o) && (e = o, n)) {
      const l = !Vn.length;
      for (const u of r)
        u[1](), Vn.push(u, e);
      if (l) {
        for (let u = 0; u < Vn.length; u += 2)
          Vn[u][0](Vn[u + 1]);
        Vn.length = 0;
      }
    }
  }
  function s(o) {
    a(o(
      /** @type {T} */
      e
    ));
  }
  function i(o, l = Xt) {
    const u = [o, l];
    return r.add(u), r.size === 1 && (n = t(a, s) || Xt), o(
      /** @type {T} */
      e
    ), () => {
      r.delete(u), r.size === 0 && n && (n(), n = null);
    };
  }
  return { set: a, update: s, subscribe: i };
}
function Y(e, t, n) {
  const r = !Array.isArray(e), a = r ? [e] : e;
  if (!a.every(Boolean))
    throw new Error("derived() expects stores as input, got a falsy value");
  const s = t.length < 2;
  return Ku(n, (i, o) => {
    let l = !1;
    const u = [];
    let d = 0, v = Xt;
    const f = () => {
      if (d)
        return;
      v();
      const g = t(r ? u[0] : u, i, o);
      s ? i(g) : v = typeof g == "function" ? g : Xt;
    }, p = a.map(
      (g, y) => fi(
        g,
        (_) => {
          u[y] = _, d &= ~(1 << y), l && f();
        },
        () => {
          d |= 1 << y;
        }
      )
    );
    return l = !0, f(), function() {
      No(p), v(), l = !1;
    };
  });
}
function Sr(e) {
  let t;
  return fi(e, (n) => t = n)(), t;
}
let ia = !1, Ss = Symbol("unmounted");
function or(e, t, n) {
  const r = n[t] ?? (n[t] = {
    store: null,
    source: /* @__PURE__ */ al(void 0),
    unsubscribe: Xt
  });
  if (r.store !== e && !(Ss in n))
    if (r.unsubscribe(), r.store = e ?? null, e == null)
      r.source.v = void 0, r.unsubscribe = Xt;
    else {
      var a = !0;
      r.unsubscribe = fi(e, (s) => {
        a ? r.source.v = s : O(r.source, s);
      }), a = !1;
    }
  return e && Ss in n ? Sr(e) : h(r.source);
}
function Wa() {
  const e = {};
  function t() {
    Ba(() => {
      for (var n in e)
        e[n].unsubscribe();
      Ao(e, Ss, {
        enumerable: !1,
        value: !0
      });
    });
  }
  return [e, t];
}
function Zu(e) {
  var t = ia;
  try {
    return ia = !1, [e(), ia];
  } finally {
    ia = t;
  }
}
let zi = !1;
function Ju() {
  zi || (zi = !0, document.addEventListener(
    "reset",
    (e) => {
      Promise.resolve().then(() => {
        var t;
        if (!e.defaultPrevented)
          for (
            const n of
            /**@type {HTMLFormElement} */
            e.target.elements
          )
            (t = n[ha]) == null || t.call(n);
      });
    },
    // In the capture phase to guarantee we get noticed of it (no possibility of stopPropagation)
    { capture: !0 }
  ));
}
function Tr(e) {
  var t = $, n = Z;
  pt(null), Pt(null);
  try {
    return e();
  } finally {
    pt(t), Pt(n);
  }
}
function Go(e, t, n, r = n) {
  e.addEventListener(t, () => Tr(n));
  const a = (
    /** @type {any} */
    e[ha]
  );
  a ? e[ha] = () => {
    a(), r(!0);
  } : e[ha] = () => r(!0), Ju();
}
function $u(e) {
  let t = 0, n = On(0), r;
  return () => {
    mi() && (h(n), Ka(() => (t === 0 && (r = In(() => e(() => Pr(n)))), t += 1, () => {
      $t(() => {
        t -= 1, t === 0 && (r == null || r(), r = void 0, Pr(n));
      });
    })));
  };
}
var Qu = Ln | Er;
function Xu(e, t, n, r) {
  new ec(e, t, n, r);
}
var ot, ii, lt, _n, Ke, ut, Ve, et, Bt, yn, sn, ur, Zr, Jr, Gt, Na, he, tc, nc, Ts, rc, Ms, va, ma, Cs, js;
class ec {
  /**
   * @param {TemplateNode} node
   * @param {BoundaryProps} props
   * @param {((anchor: Node) => void)} children
   * @param {((error: unknown) => unknown) | undefined} [transform_error]
   */
  constructor(t, n, r, a) {
    q(this, he);
    /** @type {Boundary | null} */
    m(this, "parent");
    m(this, "is_pending", !1);
    /**
     * API-level transformError transform function. Transforms errors before they reach the `failed` snippet.
     * Inherited from parent boundary, or defaults to identity.
     * @type {(error: unknown) => unknown}
     */
    m(this, "transform_error");
    /** @type {TemplateNode} */
    q(this, ot);
    /** @type {TemplateNode | null} */
    q(this, ii, null);
    /** @type {BoundaryProps} */
    q(this, lt);
    /** @type {((anchor: Node) => void)} */
    q(this, _n);
    /** @type {Effect} */
    q(this, Ke);
    /** @type {Effect | null} */
    q(this, ut, null);
    /** @type {Effect | null} */
    q(this, Ve, null);
    /** @type {Effect | null} */
    q(this, et, null);
    /** @type {DocumentFragment | null} */
    q(this, Bt, null);
    q(this, yn, 0);
    q(this, sn, 0);
    q(this, ur, !1);
    /** @type {Set<Effect>} */
    q(this, Zr, /* @__PURE__ */ new Set());
    /** @type {Set<Effect>} */
    q(this, Jr, /* @__PURE__ */ new Set());
    /**
     * A source containing the number of pending async deriveds/expressions.
     * Only created if `$effect.pending()` is used inside the boundary,
     * otherwise updating the source results in needless `Batch.ensure()`
     * calls followed by no-op flushes
     * @type {Source<number> | null}
     */
    q(this, Gt, null);
    q(this, Na, $u(() => (I(this, Gt, On(c(this, yn))), () => {
      I(this, Gt, null);
    })));
    var s;
    I(this, ot, t), I(this, lt, n), I(this, _n, (i) => {
      var o = (
        /** @type {Effect} */
        Z
      );
      o.b = this, o.f |= xs, r(i);
    }), this.parent = /** @type {Effect} */
    Z.b, this.transform_error = a ?? ((s = this.parent) == null ? void 0 : s.transform_error) ?? ((i) => i), I(this, Ke, Za(() => {
      G(this, he, Ms).call(this);
    }, Qu));
  }
  /**
   * Defer an effect inside a pending boundary until the boundary resolves
   * @param {Effect} effect
   */
  defer_effect(t) {
    Bo(t, c(this, Zr), c(this, Jr));
  }
  /**
   * Returns `false` if the effect exists inside a boundary whose pending snippet is shown
   * @returns {boolean}
   */
  is_rendered() {
    return !this.is_pending && (!this.parent || this.parent.is_rendered());
  }
  has_pending_snippet() {
    return !!c(this, lt).pending;
  }
  /**
   * Update the source that powers `$effect.pending()` inside this boundary,
   * and controls when the current `pending` snippet (if any) is removed.
   * Do not call from inside the class
   * @param {1 | -1} d
   * @param {Batch} batch
   */
  update_pending_count(t, n) {
    G(this, he, Cs).call(this, t, n), I(this, yn, c(this, yn) + t), !(!c(this, Gt) || c(this, ur)) && (I(this, ur, !0), $t(() => {
      I(this, ur, !1), c(this, Gt) && _r(c(this, Gt), c(this, yn));
    }));
  }
  get_effect_pending() {
    return c(this, Na).call(this), h(
      /** @type {Source<number>} */
      c(this, Gt)
    );
  }
  /** @param {unknown} error */
  error(t) {
    if (!c(this, lt).onerror && !c(this, lt).failed)
      throw t;
    P != null && P.is_fork ? (c(this, ut) && P.skip_effect(c(this, ut)), c(this, Ve) && P.skip_effect(c(this, Ve)), c(this, et) && P.skip_effect(c(this, et)), P.oncommit(() => {
      G(this, he, js).call(this, t);
    })) : G(this, he, js).call(this, t);
  }
}
ot = new WeakMap(), ii = new WeakMap(), lt = new WeakMap(), _n = new WeakMap(), Ke = new WeakMap(), ut = new WeakMap(), Ve = new WeakMap(), et = new WeakMap(), Bt = new WeakMap(), yn = new WeakMap(), sn = new WeakMap(), ur = new WeakMap(), Zr = new WeakMap(), Jr = new WeakMap(), Gt = new WeakMap(), Na = new WeakMap(), he = new WeakSet(), tc = function() {
  try {
    I(this, ut, ct(() => c(this, _n).call(this, c(this, ot))));
  } catch (t) {
    this.error(t);
  }
}, /**
 * @param {unknown} error The deserialized error from the server's hydration comment
 */
nc = function(t) {
  const n = c(this, lt).failed, { reset: r, invoke_onerror: a } = G(this, he, Ts).call(this, t);
  $t(a), n && I(this, et, ct(() => {
    n(
      c(this, ot),
      () => t,
      () => r
    );
  }));
}, /**
 * Creates the `reset` function for a failed boundary, along with a function
 * that invokes `onerror` with it (if provided)
 * @param {unknown} error
 * @returns {{ reset: () => void, invoke_onerror: () => void }}
 */
Ts = function(t) {
  var n = !1, r = !1;
  const a = () => {
    if (n) {
      Wu();
      return;
    }
    n = !0, r && Au(), c(this, et) !== null && Dn(c(this, et), () => {
      I(this, et, null);
    }), G(this, he, ma).call(this, () => {
      G(this, he, Ms).call(this);
    });
  };
  return { reset: a, invoke_onerror: () => {
    var i, o;
    try {
      r = !0, (o = (i = c(this, lt)).onerror) == null || o.call(i, t, a), r = !1;
    } catch (l) {
      un(l, c(this, Ke) && c(this, Ke).parent);
    }
  } };
}, rc = function() {
  const t = c(this, lt).pending;
  t && (this.is_pending = !0, I(this, Ve, ct(() => t(c(this, ot)))), $t(() => {
    var n = I(this, Bt, document.createDocumentFragment()), r = fn();
    n.append(r), I(this, ut, G(this, he, ma).call(this, () => ct(() => c(this, _n).call(this, r)))), c(this, sn) === 0 && (c(this, ot).before(n), I(this, Bt, null), Dn(
      /** @type {Effect} */
      c(this, Ve),
      () => {
        I(this, Ve, null);
      }
    ), G(this, he, va).call(
      this,
      /** @type {Batch} */
      P
    ));
  }));
}, Ms = function() {
  try {
    if (this.is_pending = this.has_pending_snippet(), I(this, sn, 0), I(this, yn, 0), I(this, ut, ct(() => {
      c(this, _n).call(this, c(this, ot));
    })), c(this, sn) > 0) {
      var t = I(this, Bt, document.createDocumentFragment());
      gi(c(this, ut), t);
      const n = (
        /** @type {(anchor: Node) => void} */
        c(this, lt).pending
      );
      I(this, Ve, ct(() => n(c(this, ot))));
    } else
      G(this, he, va).call(
        this,
        /** @type {Batch} */
        P
      );
  } catch (n) {
    this.error(n);
  }
}, /**
 * @param {Batch} batch
 */
va = function(t) {
  this.is_pending = !1, t.transfer_effects(c(this, Zr), c(this, Jr));
}, /**
 * @template T
 * @param {() => T} fn
 */
ma = function(t) {
  var n = Z, r = $, a = Ue;
  Pt(c(this, Ke)), pt(c(this, Ke)), gr(c(this, Ke).ctx);
  try {
    return Un.ensure(), t();
  } catch (s) {
    return Ho(s), null;
  } finally {
    Pt(n), pt(r), gr(a);
  }
}, /**
 * Updates the pending count associated with the currently visible pending snippet,
 * if any, such that we can replace the snippet with content once work is done
 * @param {1 | -1} d
 * @param {Batch} batch
 */
Cs = function(t, n) {
  var r;
  if (!this.has_pending_snippet()) {
    this.parent && G(r = this.parent, he, Cs).call(r, t, n);
    return;
  }
  I(this, sn, c(this, sn) + t), c(this, sn) === 0 && (G(this, he, va).call(this, n), c(this, Ve) && Dn(c(this, Ve), () => {
    I(this, Ve, null);
  }), c(this, Bt) && (c(this, ot).before(c(this, Bt)), I(this, Bt, null)));
}, /**
 * @param {unknown} error
 */
js = function(t) {
  c(this, ut) && (We(c(this, ut)), I(this, ut, null)), c(this, Ve) && (We(c(this, Ve)), I(this, Ve, null)), c(this, et) && (We(c(this, et)), I(this, et, null));
  let n = c(this, lt).failed;
  const r = (a) => {
    const { reset: s, invoke_onerror: i } = G(this, he, Ts).call(this, a);
    i(), n && I(this, et, G(this, he, ma).call(this, () => {
      try {
        return ct(() => {
          var o = (
            /** @type {Effect} */
            Z
          );
          o.b = this, o.f |= xs, n(
            c(this, ot),
            () => a,
            () => s
          );
        });
      } catch (o) {
        return un(
          o,
          /** @type {Effect} */
          c(this, Ke).parent
        ), null;
      }
    }));
  };
  $t(() => {
    var a;
    try {
      a = this.transform_error(t);
    } catch (s) {
      un(s, c(this, Ke) && c(this, Ke).parent);
      return;
    }
    a !== null && typeof a == "object" && typeof /** @type {any} */
    a.then == "function" ? a.then(
      r,
      /** @param {unknown} e */
      (s) => un(s, c(this, Ke) && c(this, Ke).parent)
    ) : r(a);
  });
};
function ac(e, t, n, r) {
  const a = Vr;
  var s = e.filter((p) => !p.settled), i = t.map(a);
  if (n.length === 0 && s.length === 0) {
    r(i);
    return;
  }
  var o = (
    /** @type {Effect} */
    Z
  ), l = sc(), u = s.length === 1 ? s[0].promise : s.length > 1 ? Promise.all(s.map((p) => p.promise)) : null;
  function d(p) {
    if ((o.f & nt) === 0) {
      l();
      try {
        r([...i, ...p]);
      } catch (g) {
        un(g, o);
      }
      xa();
    }
  }
  var v = Ko();
  if (n.length === 0) {
    u.then(() => d([])).finally(v);
    return;
  }
  function f() {
    Promise.all(n.map((p) => /* @__PURE__ */ ic(p))).then(d).catch((p) => un(p, o)).finally(v);
  }
  u ? u.then(() => {
    l(), f(), xa();
  }) : f();
}
function sc() {
  var e = (
    /** @type {Effect} */
    Z
  ), t = $, n = Ue, r = (
    /** @type {Batch} */
    P
  );
  return function(s = !0) {
    Pt(e), pt(t), gr(n), s && (e.f & nt) === 0 && (r == null || r.activate(), r == null || r.apply());
  };
}
function xa(e = !0) {
  Pt(null), pt(null), gr(null), e && (P == null || P.deactivate());
}
function Ko() {
  var e = (
    /** @type {Effect} */
    Z
  ), t = e.b, n = (
    /** @type {Batch} */
    P
  ), r = !!(t != null && t.is_rendered());
  return t == null || t.update_pending_count(1, n), n.increment(r, e), () => {
    t == null || t.update_pending_count(-1, n), n.decrement(r, e);
  };
}
// @__NO_SIDE_EFFECTS__
function Vr(e) {
  var t = Ae | De;
  return Z !== null && (Z.f |= Er), {
    ctx: Ue,
    deps: null,
    effects: null,
    equals: Io,
    f: t,
    fn: e,
    reactions: null,
    rv: 0,
    v: (
      /** @type {V} */
      Ce
    ),
    wv: 0,
    parent: Z,
    ac: null
  };
}
const Ur = Symbol("obsolete");
// @__NO_SIDE_EFFECTS__
function ic(e, t, n) {
  let r = (
    /** @type {Effect | null} */
    Z
  );
  r === null && wu();
  var a = (
    /** @type {Promise<V>} */
    /** @type {unknown} */
    void 0
  ), s = On(
    /** @type {V} */
    Ce
  ), i = !$, o = /* @__PURE__ */ new Set();
  return bc(() => {
    var p, g;
    var l = (
      /** @type {Effect} */
      Z
    ), u = Uo();
    a = u.promise;
    try {
      Promise.resolve(e()).then(u.resolve, (y) => {
        y !== na && u.reject(y);
      }).finally(xa);
    } catch (y) {
      u.reject(y), xa();
    }
    var d = (
      /** @type {Batch} */
      P
    );
    if (i) {
      if ((l.f & kr) !== 0)
        var v = Ko();
      if (
        // boundary can be null if the async derived is inside an $effect.root not connected to the component render tree
        (p = r.b) != null && p.is_rendered()
      )
        (g = d.async_deriveds.get(l)) == null || g.reject(Ur);
      else
        for (const y of o.values())
          y.reject(Ur);
      o.add(u), d.async_deriveds.set(l, u);
    }
    const f = (y, _ = void 0) => {
      v == null || v(), o.delete(u), _ !== Ur && (d.activate(), _ ? (s.f |= cn, _r(s, _)) : ((s.f & cn) !== 0 && (s.f ^= cn), _r(s, y)), d.deactivate());
    };
    u.promise.then(f, (y) => f(null, y || "unknown"));
  }), Ba(() => {
    for (const l of o)
      l.reject(Ur);
  }), new Promise((l) => {
    function u(d) {
      function v() {
        d === a ? l(s) : u(a);
      }
      d.then(v, v);
    }
    u(a);
  });
}
// @__NO_SIDE_EFFECTS__
function ie(e) {
  const t = /* @__PURE__ */ Vr(e);
  return pl(t), t;
}
// @__NO_SIDE_EFFECTS__
function Zo(e) {
  const t = /* @__PURE__ */ Vr(e);
  return t.equals = zo, t;
}
function oc(e) {
  var t = e.effects;
  if (t !== null) {
    e.effects = null;
    for (var n = 0; n < t.length; n += 1)
      We(
        /** @type {Effect} */
        t[n]
      );
  }
}
function di(e) {
  var t, n = Z, r = e.parent;
  if (!tn && r !== null && e.v !== Ce && // if it was never evaluated before, it's guaranteed to fail downstream, so we try to execute instead
  (r.f & (nt | He)) !== 0)
    return Yu(), e.v;
  Pt(r);
  try {
    e.f &= ~Nn, oc(e), t = bl(e);
  } finally {
    Pt(n);
  }
  return t;
}
function Jo(e) {
  var t = di(e);
  if (!e.equals(t) && (e.wv = _l(), (!(P != null && P.is_fork) || e.deps === null) && (P !== null ? (P.capture(e, t, !0), Rr == null || Rr.capture(e, t, !0)) : e.v = t, e.deps === null))) {
    _e(e, je);
    return;
  }
  tn || (Ne !== null ? (mi() || P != null && P.is_fork) && Ne.set(e, t) : ci(e));
}
function lc(e) {
  var t;
  if (e.effects !== null)
    for (const n of e.effects)
      (n.teardown || n.ac) && ((t = n.teardown) == null || t.call(n), n.ac !== null && Tr(() => {
        n.ac.abort(na), n.ac = null;
      }), n.fn !== null && (n.teardown = Xt), Yr(n, 0), pi(n));
}
function $o(e) {
  if (e.effects !== null)
    for (const t of e.effects)
      t.teardown && t.fn !== null && yr(t);
}
let is = null, Yn = null, P = null, Rr = null, Ne = null, Ds = null, Ir = !1, os = !1, Bn = null, pa = null;
var Vi = 0;
let uc = 1;
var cr, on, bn, fr, dr, hr, Kt, vr, Ze, $r, Zt, bt, Lt, mr, wn, oe, As, Or, Ls, Qo, Xo, Wn, cc, Fr;
const Ua = class Ua {
  constructor() {
    q(this, oe);
    m(this, "id", uc++);
    /** True as soon as `#process` was called */
    q(this, cr, !1);
    m(this, "linked", !0);
    /** @type {Batch | null} */
    q(this, on, null);
    /** @type {Batch | null} */
    q(this, bn, null);
    /** @type {Map<Effect, ReturnType<typeof deferred<any>>>} */
    m(this, "async_deriveds", /* @__PURE__ */ new Map());
    /**
     * The current values of any signals that are updated in this batch.
     * Tuple format: [value, is_derived] (note: is_derived is false for deriveds, too, if they were overridden via assignment)
     * They keys of this map are identical to `this.#previous`
     * @type {Map<Value, [any, boolean]>}
     */
    m(this, "current", /* @__PURE__ */ new Map());
    /**
     * The values of any signals (sources and deriveds) that are updated in this batch _before_ those updates took place.
     * They keys of this map are identical to `this.#current`
     * @type {Map<Value, any>}
     */
    m(this, "previous", /* @__PURE__ */ new Map());
    /**
     * When the batch is committed (and the DOM is updated), we need to remove old branches
     * and append new ones by calling the functions added inside (if/each/key/etc) blocks
     * @type {Set<(batch: Batch) => void>}
     */
    q(this, fr, /* @__PURE__ */ new Set());
    /**
     * If a fork is discarded, we need to destroy any effects that are no longer needed
     * @type {Set<(batch: Batch) => void>}
     */
    q(this, dr, /* @__PURE__ */ new Set());
    /**
     * The number of async effects that are currently in flight
     */
    q(this, hr, 0);
    /**
     * Async effects that are currently in flight, _not_ inside a pending boundary
     * @type {Map<Effect, number>}
     */
    q(this, Kt, /* @__PURE__ */ new Map());
    /**
     * A deferred that resolves when the batch is committed, used with `settled()`
     * TODO replace with Promise.withResolvers once supported widely enough
     * @type {{ promise: Promise<void>, resolve: (value?: any) => void, reject: (reason: unknown) => void } | null}
     */
    q(this, vr, null);
    /**
     * The root effects that need to be flushed
     * @type {Effect[]}
     */
    q(this, Ze, []);
    /**
     * Effects created while this batch was active.
     * @type {Effect[]}
     */
    q(this, $r, []);
    /**
     * Deferred effects (which run after async work has completed) that are DIRTY
     * @type {Set<Effect>}
     */
    q(this, Zt, /* @__PURE__ */ new Set());
    /**
     * Deferred effects that are MAYBE_DIRTY
     * @type {Set<Effect>}
     */
    q(this, bt, /* @__PURE__ */ new Set());
    /**
     * A map of branches that still exist, but will be destroyed when this batch
     * is committed — we skip over these during `process`.
     * The value contains child effects that were dirty/maybe_dirty before being reset,
     * so they can be rescheduled if the branch survives.
     * @type {Map<Effect, { d: Effect[], m: Effect[] }>}
     */
    q(this, Lt, /* @__PURE__ */ new Map());
    /**
     * Inverse of #skipped_branches which we need to tell prior batches to unskip them when committing
     * @type {Set<Effect>}
     */
    q(this, mr, /* @__PURE__ */ new Set());
    m(this, "is_fork", !1);
    q(this, wn, !1);
    Yn === null ? is = Yn = this : (I(Yn, bn, this), I(this, on, Yn)), Yn = this;
  }
  /**
   * Add an effect to the #skipped_branches map and reset its children
   * @param {Effect} effect
   */
  skip_effect(t) {
    c(this, Lt).has(t) || c(this, Lt).set(t, { d: [], m: [] }), c(this, mr).delete(t);
  }
  /**
   * Remove an effect from the #skipped_branches map and reschedule
   * any tracked dirty/maybe_dirty child effects
   * @param {Effect} effect
   * @param {(e: Effect) => void} callback
   */
  unskip_effect(t, n = (r) => this.schedule(r)) {
    var r = c(this, Lt).get(t);
    if (r) {
      c(this, Lt).delete(t);
      for (var a of r.d)
        _e(a, De), n(a);
      for (a of r.m)
        _e(a, Mt), n(a);
    }
    c(this, mr).add(t);
  }
  /**
   * Associate a change to a given source with the current
   * batch, noting its previous and current values
   * @param {Value} source
   * @param {any} value
   * @param {boolean} [is_derived]
   */
  capture(t, n, r = !1) {
    t.v !== Ce && !this.previous.has(t) && this.previous.set(t, t.v), (t.f & cn) === 0 && (this.current.set(t, [n, r]), Ne == null || Ne.set(t, n)), this.is_fork || (t.v = n);
  }
  activate() {
    P = this;
  }
  deactivate() {
    P = null, Ne = null;
  }
  flush() {
    try {
      os = !0, P = this, G(this, oe, Or).call(this);
    } finally {
      Vi = 0, Ds = null, Bn = null, pa = null, os = !1, P = null, Ne = null, Rt.clear();
    }
  }
  discard() {
    var t;
    for (const n of c(this, dr)) n(this);
    c(this, dr).clear();
    for (const n of this.async_deriveds.values())
      n.reject(Ur);
    G(this, oe, Fr).call(this), (t = c(this, vr)) == null || t.resolve();
  }
  /**
   * @param {Effect} effect
   */
  register_created_effect(t) {
    c(this, $r).push(t);
  }
  /**
   * @param {boolean} blocking
   * @param {Effect} effect
   */
  increment(t, n) {
    if (I(this, hr, c(this, hr) + 1), t) {
      let r = c(this, Kt).get(n) ?? 0;
      c(this, Kt).set(n, r + 1);
    }
  }
  /**
   * @param {boolean} blocking
   * @param {Effect} effect
   */
  decrement(t, n) {
    if (I(this, hr, c(this, hr) - 1), t) {
      let r = c(this, Kt).get(n) ?? 0;
      r === 1 ? c(this, Kt).delete(n) : c(this, Kt).set(n, r - 1);
    }
    c(this, wn) || (I(this, wn, !0), $t(() => {
      I(this, wn, !1), this.linked && this.flush();
    }));
  }
  /**
   * @param {Set<Effect>} dirty_effects
   * @param {Set<Effect>} maybe_dirty_effects
   */
  transfer_effects(t, n) {
    for (const r of t)
      c(this, Zt).add(r);
    for (const r of n)
      c(this, bt).add(r);
    t.clear(), n.clear();
  }
  /** @param {(batch: Batch) => void} fn */
  oncommit(t) {
    c(this, fr).add(t);
  }
  /** @param {(batch: Batch) => void} fn */
  ondiscard(t) {
    c(this, dr).add(t);
  }
  settled() {
    return (c(this, vr) ?? I(this, vr, Uo())).promise;
  }
  static ensure() {
    if (P === null) {
      const t = P = new Ua();
      !os && !Ir && $t(() => {
        c(t, cr) || t.flush();
      });
    }
    return P;
  }
  apply() {
    {
      Ne = null;
      return;
    }
  }
  /**
   *
   * @param {Effect} effect
   */
  schedule(t) {
    var a;
    if (Ds = t, (a = t.b) != null && a.is_pending && (t.f & (pr | ta | ui)) !== 0 && (t.f & kr) === 0) {
      t.b.defer_effect(t);
      return;
    }
    for (var n = t; n.parent !== null; ) {
      n = n.parent;
      var r = n.f;
      if (Bn !== null && n === Z && ($ === null || ($.f & Ae) === 0))
        return;
      if ((r & (en | mt)) !== 0) {
        if ((r & je) === 0)
          return;
        n.f ^= je;
      }
    }
    c(this, Ze).push(n);
  }
};
cr = new WeakMap(), on = new WeakMap(), bn = new WeakMap(), fr = new WeakMap(), dr = new WeakMap(), hr = new WeakMap(), Kt = new WeakMap(), vr = new WeakMap(), Ze = new WeakMap(), $r = new WeakMap(), Zt = new WeakMap(), bt = new WeakMap(), Lt = new WeakMap(), mr = new WeakMap(), wn = new WeakMap(), oe = new WeakSet(), As = function() {
  if (this.is_fork) return !0;
  for (const r of c(this, Kt).keys()) {
    for (var t = r, n = !1; t.parent !== null; ) {
      if (c(this, Lt).has(t)) {
        n = !0;
        break;
      }
      t = t.parent;
    }
    if (!n)
      return !0;
  }
  return !1;
}, Or = function() {
  var l, u, d, v;
  I(this, cr, !0), Vi++ > 1e3 && (G(this, oe, Fr).call(this), dc());
  for (const f of c(this, Zt))
    c(this, bt).delete(f), _e(f, De), this.schedule(f);
  for (const f of c(this, bt))
    _e(f, Mt), this.schedule(f);
  const t = c(this, Ze);
  I(this, Ze, []), this.apply();
  var n = Bn = [], r = [], a = pa = [];
  for (const f of t)
    try {
      G(this, oe, Ls).call(this, f, n, r);
    } catch (p) {
      throw nl(f), G(this, oe, As).call(this) || this.discard(), p;
    }
  if (P = null, a.length > 0) {
    var s = Ua.ensure();
    for (const f of a)
      s.schedule(f);
  }
  if (Bn = null, pa = null, G(this, oe, As).call(this)) {
    G(this, oe, Wn).call(this, r), G(this, oe, Wn).call(this, n);
    for (const [f, p] of c(this, Lt))
      tl(f, p);
    a.length > 0 && /** @type {unknown} */
    G(l = P, oe, Or).call(l);
    return;
  }
  const i = G(this, oe, Qo).call(this);
  if (i) {
    G(this, oe, Wn).call(this, r), G(this, oe, Wn).call(this, n), G(u = i, oe, Xo).call(u, this);
    return;
  }
  c(this, Zt).clear(), c(this, bt).clear();
  for (const f of c(this, fr)) f(this);
  c(this, fr).clear(), Rr = this, Yi(r), Yi(n), Rr = null, (d = c(this, vr)) == null || d.resolve();
  var o = (
    /** @type {Batch | null} */
    /** @type {unknown} */
    P
  );
  if (c(this, hr) === 0 && (c(this, Ze).length === 0 || o !== null) && G(this, oe, Fr).call(this), c(this, Ze).length > 0)
    if (o !== null) {
      const f = o;
      c(f, Ze).push(...c(this, Ze).filter((p) => !c(f, Ze).includes(p)));
    } else
      o = this;
  o !== null && (Rt.clear(), G(v = o, oe, Or).call(v));
}, /**
 * Traverse the effect tree, executing effects or stashing
 * them for later execution as appropriate
 * @param {Effect} root
 * @param {Effect[]} effects
 * @param {Effect[]} render_effects
 */
Ls = function(t, n, r) {
  t.f ^= je;
  for (var a = t.first; a !== null; ) {
    var s = a.f, i = (s & (mt | en)) !== 0, o = i && (s & je) !== 0, l = o || (s & He) !== 0 || c(this, Lt).has(a);
    if (!l && a.fn !== null) {
      i ? a.f ^= je : (s & pr) !== 0 ? n.push(a) : aa(a) && ((s & St) !== 0 && c(this, bt).add(a), yr(a));
      var u = a.first;
      if (u !== null) {
        a = u;
        continue;
      }
    }
    for (; a !== null; ) {
      var d = a.next;
      if (d !== null) {
        a = d;
        break;
      }
      a = a.parent;
    }
  }
}, Qo = function() {
  for (var t = c(this, on); t !== null; ) {
    if (!t.is_fork) {
      for (const [n, [, r]] of this.current)
        if (t.current.has(n) && !r)
          return t;
    }
    t = c(t, on);
  }
  return null;
}, /**
 * @param {Batch} batch
 */
Xo = function(t) {
  var r;
  for (const [a, s] of t.current)
    !this.previous.has(a) && t.previous.has(a) && this.previous.set(a, t.previous.get(a)), this.current.set(a, s);
  for (const [a, s] of t.async_deriveds) {
    const i = this.async_deriveds.get(a);
    i && s.promise.then(i.resolve).catch(i.reject);
  }
  t.async_deriveds.clear(), this.transfer_effects(c(t, Zt), c(t, bt));
  const n = (a) => {
    var s = a.reactions;
    if (s !== null && !((a.f & Ae) !== 0 && (a.f & (De | Mt)) === 0))
      for (const l of s) {
        var i = l.f;
        if ((i & Ae) !== 0)
          n(
            /** @type {Derived} */
            l
          );
        else {
          var o = (
            /** @type {Effect} */
            l
          );
          i & (ir | St) && !this.async_deriveds.has(o) && (c(this, bt).delete(o), _e(o, De), this.schedule(o));
        }
      }
  };
  for (const a of this.current.keys())
    n(a);
  this.oncommit(() => t.discard()), G(r = t, oe, Fr).call(r), P = this, G(this, oe, Or).call(this);
}, /**
 * @param {Effect[]} effects
 */
Wn = function(t) {
  for (var n = 0; n < t.length; n += 1)
    Bo(t[n], c(this, Zt), c(this, bt));
}, cc = function() {
  var v;
  for (let f = is; f !== null; f = c(f, bn)) {
    var t = f.id < this.id, n = [];
    for (const [p, [g, y]] of this.current) {
      if (f.current.has(p)) {
        var r = (
          /** @type {[any, boolean]} */
          f.current.get(p)[0]
        );
        if (t && g !== r)
          f.current.set(p, [g, y]);
        else
          continue;
      }
      n.push(p);
    }
    if (t)
      for (const [p, g] of this.async_deriveds) {
        const y = f.async_deriveds.get(p);
        y && g.promise.then(y.resolve).catch(y.reject);
      }
    var a = [...f.current.keys()].filter(
      (p) => !/** @type {[any, boolean]} */
      f.current.get(p)[1]
    );
    if (!(!c(f, cr) || a.length === 0)) {
      var s = a.filter((p) => !this.current.has(p));
      if (s.length === 0)
        t && f.discard();
      else if (n.length > 0) {
        if (t)
          for (const p of c(this, mr))
            f.unskip_effect(p, (g) => {
              var y;
              (g.f & (St | ir)) !== 0 ? f.schedule(g) : G(y = f, oe, Wn).call(y, [g]);
            });
        f.activate();
        var i = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Map();
        for (var l of n)
          el(l, s, i, o);
        o = /* @__PURE__ */ new Map();
        var u = [...f.current].filter(([p, g]) => {
          const y = this.current.get(p);
          return y ? y[0] !== g[0] || y[1] !== g[1] : !0;
        }).map(([p]) => p);
        if (u.length > 0)
          for (const p of c(this, $r))
            (p.f & (nt | He | ba)) === 0 && hi(p, u, o) && ((p.f & (ir | St)) !== 0 ? (_e(p, De), f.schedule(p)) : c(f, Zt).add(p));
        if (c(f, Ze).length > 0 && !c(f, wn)) {
          f.apply();
          for (var d of c(f, Ze))
            G(v = f, oe, Ls).call(v, d, [], []);
          I(f, Ze, []);
        }
        f.deactivate();
      }
    }
  }
}, Fr = function() {
  if (this.linked) {
    var t = c(this, on), n = c(this, bn);
    t === null ? is = n : I(t, bn, n), n === null ? Yn = t : I(n, on, t), this.linked = !1;
  }
};
let Un = Ua;
function fc(e) {
  var t = Ir;
  Ir = !0;
  try {
    for (var n; ; ) {
      if (Bu(), P === null)
        return (
          /** @type {T} */
          n
        );
      P.flush();
    }
  } finally {
    Ir = t;
  }
}
function dc() {
  try {
    Tu();
  } catch (e) {
    un(e, Ds);
  }
}
let yt = null;
function Yi(e) {
  var t = e.length;
  if (t !== 0) {
    for (var n = 0; n < t; ) {
      var r = e[n++];
      if ((r.f & (nt | He)) === 0 && aa(r) && (yt = /* @__PURE__ */ new Set(), yr(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && hl(r), (yt == null ? void 0 : yt.size) > 0)) {
        Rt.clear();
        for (const a of yt) {
          if ((a.f & (nt | He)) !== 0) continue;
          const s = [a];
          let i = a.parent;
          for (; i !== null; )
            yt.has(i) && (yt.delete(i), s.push(i)), i = i.parent;
          for (let o = s.length - 1; o >= 0; o--) {
            const l = s[o];
            (l.f & (nt | He)) === 0 && yr(l);
          }
        }
        yt.clear();
      }
    }
    yt = null;
  }
}
function el(e, t, n, r) {
  if (!n.has(e) && (n.add(e), e.reactions !== null))
    for (const a of e.reactions) {
      const s = a.f;
      (s & Ae) !== 0 ? el(
        /** @type {Derived} */
        a,
        t,
        n,
        r
      ) : (s & (ir | St)) !== 0 && (s & De) === 0 && hi(a, t, r) && (_e(a, De), vi(
        /** @type {Effect} */
        a
      ));
    }
}
function hi(e, t, n) {
  const r = n.get(e);
  if (r !== void 0) return r;
  if (e.deps !== null)
    for (const a of e.deps) {
      if (ya.call(t, a))
        return !0;
      if ((a.f & Ae) !== 0 && hi(
        /** @type {Derived} */
        a,
        t,
        n
      ))
        return n.set(
          /** @type {Derived} */
          a,
          !0
        ), !0;
    }
  return n.set(e, !1), !1;
}
function vi(e) {
  P.schedule(e);
}
function tl(e, t) {
  if (!((e.f & mt) !== 0 && (e.f & je) !== 0)) {
    (e.f & De) !== 0 ? t.d.push(e) : (e.f & Mt) !== 0 && t.m.push(e), _e(e, je);
    for (var n = e.first; n !== null; )
      tl(n, t), n = n.next;
  }
}
function nl(e) {
  _e(e, je);
  for (var t = e.first; t !== null; )
    nl(t), t = t.next;
}
let ka = /* @__PURE__ */ new Set();
const Rt = /* @__PURE__ */ new Map();
let rl = !1;
function On(e, t) {
  var n = {
    f: 0,
    // TODO ideally we could skip this altogether, but it causes type errors
    v: e,
    reactions: null,
    equals: Io,
    rv: 0,
    wv: 0
  };
  return n;
}
// @__NO_SIDE_EFFECTS__
function re(e, t) {
  const n = On(e);
  return pl(n), n;
}
// @__NO_SIDE_EFFECTS__
function al(e, t = !1, n = !0) {
  const r = On(e);
  return t || (r.equals = zo), r;
}
function O(e, t, n = !1) {
  $ !== null && // since we are untracking the function inside `$inspect.with` we need to add this check
  // to ensure we error if state is set inside an inspect effect
  (!Tt || ($.f & ba) !== 0) && Vo() && ($.f & (Ae | St | ir | ba)) !== 0 && (It === null || !It.has(e)) && Du();
  let r = n ? Ft(t) : t;
  return _r(e, r, pa);
}
function _r(e, t, n = null) {
  if (!e.equals(t)) {
    tn ? Rt.set(e, t) : Rt.has(e) || Rt.set(e, e.v);
    var r = Un.ensure();
    if (r.capture(e, t), (e.f & Ae) !== 0) {
      const a = (
        /** @type {Derived} */
        e
      );
      (e.f & De) !== 0 && di(a), Ne === null && ci(a);
    }
    e.wv = _l(), sl(e, De, n), Z !== null && (Z.f & je) !== 0 && (Z.f & (mt | en)) === 0 && (it === null ? Ec([e]) : it.push(e)), !r.is_fork && ka.size > 0 && !rl && hc();
  }
  return t;
}
function hc() {
  rl = !1;
  for (const e of ka) {
    (e.f & je) !== 0 && _e(e, Mt);
    let t;
    try {
      t = aa(e);
    } catch {
      t = !0;
    }
    t && yr(e);
  }
  ka.clear();
}
function Pr(e) {
  O(e, e.v + 1);
}
function sl(e, t, n) {
  var r = e.reactions;
  if (r !== null)
    for (var a = r.length, s = 0; s < a; s++) {
      var i = r[s], o = i.f, l = (o & De) === 0;
      if (l && _e(i, t), (o & ba) !== 0)
        ka.add(
          /** @type {Effect} */
          i
        );
      else if ((o & Ae) !== 0) {
        var u = (
          /** @type {Derived} */
          i
        );
        Ne == null || Ne.delete(u), (o & Nn) === 0 && (o & ht && (Z === null || (Z.f & wa) === 0) && (i.f |= Nn), sl(u, Mt, n));
      } else if (l) {
        var d = (
          /** @type {Effect} */
          i
        );
        (o & St) !== 0 && yt !== null && yt.add(d), n !== null ? n.push(d) : vi(d);
      }
    }
}
function Ft(e) {
  if (typeof e != "object" || e === null || jn in e)
    return e;
  const t = Lo(e);
  if (t !== vu && t !== mu)
    return e;
  var n = /* @__PURE__ */ new Map(), r = li(e), a = /* @__PURE__ */ re(0), s = An, i = (o) => {
    if (An === s)
      return o();
    var l = $, u = An;
    pt(null), Gi(s);
    var d = o();
    return pt(l), Gi(u), d;
  };
  return r && n.set("length", /* @__PURE__ */ re(
    /** @type {any[]} */
    e.length
  )), new Proxy(
    /** @type {any} */
    e,
    {
      defineProperty(o, l, u) {
        (!("value" in u) || u.configurable === !1 || u.enumerable === !1 || u.writable === !1) && Cu();
        var d = n.get(l);
        return d === void 0 ? i(() => {
          var v = /* @__PURE__ */ re(u.value);
          return n.set(l, v), v;
        }) : O(d, u.value, !0), !0;
      },
      deleteProperty(o, l) {
        var u = n.get(l);
        if (u === void 0) {
          if (l in o) {
            const d = i(() => /* @__PURE__ */ re(Ce));
            n.set(l, d), Pr(a);
          }
        } else
          O(u, Ce), Pr(a);
        return !0;
      },
      get(o, l, u) {
        var p;
        if (l === jn)
          return e;
        var d = n.get(l), v = l in o;
        if (d === void 0 && (!v || (p = sr(o, l)) != null && p.writable) && (d = i(() => {
          var g = Ft(v ? o[l] : Ce), y = /* @__PURE__ */ re(g);
          return y;
        }), n.set(l, d)), d !== void 0) {
          var f = h(d);
          return f === Ce ? void 0 : f;
        }
        return Reflect.get(o, l, u);
      },
      getOwnPropertyDescriptor(o, l) {
        var u = Reflect.getOwnPropertyDescriptor(o, l);
        if (u && "value" in u) {
          var d = n.get(l);
          d && (u.value = h(d));
        } else if (u === void 0) {
          var v = n.get(l), f = v == null ? void 0 : v.v;
          if (v !== void 0 && f !== Ce)
            return {
              enumerable: !0,
              configurable: !0,
              value: f,
              writable: !0
            };
        }
        return u;
      },
      has(o, l) {
        var f;
        if (l === jn)
          return !0;
        var u = n.get(l), d = u !== void 0 && u.v !== Ce || Reflect.has(o, l);
        if (u !== void 0 || Z !== null && (!d || (f = sr(o, l)) != null && f.writable)) {
          u === void 0 && (u = i(() => {
            var p = d ? Ft(o[l]) : Ce, g = /* @__PURE__ */ re(p);
            return g;
          }), n.set(l, u));
          var v = h(u);
          if (v === Ce)
            return !1;
        }
        return d;
      },
      set(o, l, u, d) {
        var F;
        var v = n.get(l), f = l in o;
        if (r && l === "length")
          for (var p = u; p < /** @type {Source<number>} */
          v.v; p += 1) {
            var g = n.get(p + "");
            g !== void 0 ? O(g, Ce) : p in o && (g = i(() => /* @__PURE__ */ re(Ce)), n.set(p + "", g));
          }
        if (v === void 0)
          (!f || (F = sr(o, l)) != null && F.writable) && (v = i(() => /* @__PURE__ */ re(void 0)), O(v, Ft(u)), n.set(l, v));
        else {
          f = v.v !== Ce;
          var y = i(() => Ft(u));
          O(v, y);
        }
        var _ = Reflect.getOwnPropertyDescriptor(o, l);
        if (_ != null && _.set && _.set.call(d, u), !f) {
          if (r && typeof l == "string") {
            var S = (
              /** @type {Source<number>} */
              n.get("length")
            ), w = Number(l);
            Number.isInteger(w) && w >= S.v && O(S, w + 1);
          }
          Pr(a);
        }
        return !0;
      },
      ownKeys(o) {
        h(a);
        var l = Reflect.ownKeys(o).filter((v) => {
          var f = n.get(v);
          return f === void 0 || f.v !== Ce;
        });
        for (var [u, d] of n)
          d.v !== Ce && !(u in o) && l.push(u);
        return l;
      },
      setPrototypeOf() {
        ju();
      }
    }
  );
}
function Hi(e) {
  try {
    if (e !== null && typeof e == "object" && jn in e)
      return e[jn];
  } catch {
  }
  return e;
}
function vc(e, t) {
  return Object.is(Hi(e), Hi(t));
}
var Wi, il, ol, ll;
function mc() {
  if (Wi === void 0) {
    Wi = window, il = /Firefox/.test(navigator.userAgent);
    var e = Element.prototype, t = Node.prototype, n = Text.prototype;
    ol = sr(t, "firstChild").get, ll = sr(t, "nextSibling").get, Pi(e) && (e[Es] = void 0, e[da] = null, e[yu] = void 0, e.__e = void 0), Pi(n) && (n[Nr] = void 0);
  }
}
function fn(e = "") {
  return document.createTextNode(e);
}
// @__NO_SIDE_EFFECTS__
function Ea(e) {
  return (
    /** @type {TemplateNode | null} */
    ol.call(e)
  );
}
// @__NO_SIDE_EFFECTS__
function ra(e) {
  return (
    /** @type {TemplateNode | null} */
    ll.call(e)
  );
}
function U(e, t) {
  return /* @__PURE__ */ Ea(e);
}
function Re(e, t = !1) {
  {
    var n = /* @__PURE__ */ Ea(e);
    return n instanceof Comment && n.data === "" ? /* @__PURE__ */ ra(n) : n;
  }
}
function j(e, t = 1, n = !1) {
  let r = e;
  for (; t--; )
    r = /** @type {TemplateNode} */
    /* @__PURE__ */ ra(r);
  return r;
}
function pc(e) {
  e.textContent = "";
}
function ul(e, t, n) {
  return (
    /** @type {T extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T] : Element} */
    n ? document.createElement(e, { is: n }) : document.createElement(e)
  );
}
function cl(e) {
  Z === null && ($ === null && Su(), Eu()), tn && ku();
}
function gc(e, t) {
  var n = t.last;
  n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function jt(e, t) {
  var n = Z;
  n !== null && (n.f & He) !== 0 && (e |= He);
  var r = {
    ctx: Ue,
    deps: null,
    nodes: null,
    f: e | De | ht,
    first: null,
    fn: t,
    last: null,
    next: null,
    parent: n,
    b: n && n.b,
    prev: null,
    teardown: null,
    wv: 0,
    ac: null
  };
  P == null || P.register_created_effect(r);
  var a = r;
  if ((e & pr) !== 0)
    Bn !== null ? Bn.push(r) : Un.ensure().schedule(r);
  else if (t !== null) {
    try {
      yr(r);
    } catch (i) {
      throw We(r), i;
    }
    a.deps === null && a.teardown === null && a.nodes === null && a.first === a.last && // either `null`, or a singular child
    (a.f & Er) === 0 && (a = a.first, (e & St) !== 0 && (e & Ln) !== 0 && a !== null && (a.f |= Ln));
  }
  if (a !== null && (a.parent = n, n !== null && gc(a, n), $ !== null && ($.f & Ae) !== 0 && (e & en) === 0)) {
    var s = (
      /** @type {Derived} */
      $
    );
    (s.effects ?? (s.effects = [])).push(a);
  }
  return r;
}
function mi() {
  return $ !== null && !Tt;
}
function Ba(e) {
  const t = jt(ta, null);
  return _e(t, je), t.teardown = e, t;
}
function lr(e) {
  cl();
  var t = (
    /** @type {Effect} */
    Z.f
  ), n = !$ && (t & mt) !== 0 && Ue !== null && !Ue.i;
  if (n) {
    var r = (
      /** @type {ComponentContext} */
      Ue
    );
    (r.e ?? (r.e = [])).push(e);
  } else
    return fl(e);
}
function fl(e) {
  return jt(pr | Fo, e);
}
function _c(e) {
  return cl(), jt(ta | Fo, e);
}
function yc(e) {
  Un.ensure();
  const t = jt(en | Er, e);
  return (n = {}) => new Promise((r) => {
    n.outro ? Dn(t, () => {
      We(t), r(void 0);
    }) : (We(t), r(void 0));
  });
}
function Ga(e) {
  return jt(pr, e);
}
function bc(e) {
  return jt(ir | Er, e);
}
function Ka(e, t = 0) {
  return jt(ta | t, e);
}
function fe(e, t = [], n = [], r = []) {
  ac(r, t, n, (a) => {
    jt(ta, () => {
      e(...a.map(h));
    });
  });
}
function Za(e, t = 0) {
  var n = jt(St | t, e);
  return n;
}
function wc(e, t = 0) {
  var n = jt(ui | t, e);
  return n;
}
function ct(e) {
  return jt(mt | Er, e);
}
function dl(e) {
  var t = e.teardown;
  if (t !== null) {
    const n = tn, r = $;
    Bi(!0), pt(null);
    try {
      t.call(null);
    } finally {
      Bi(n), pt(r);
    }
  }
}
function pi(e, t = !1) {
  var n = e.first;
  for (e.first = e.last = null; n !== null; ) {
    const a = n.ac;
    a !== null && Tr(() => {
      a.abort(na);
    });
    var r = n.next;
    (n.f & en) !== 0 ? n.parent = null : We(n, t), n = r;
  }
}
function xc(e) {
  for (var t = e.first; t !== null; ) {
    var n = t.next;
    (t.f & mt) === 0 && We(t), t = n;
  }
}
function We(e, t = !0) {
  var n = !1;
  (t || (e.f & pu) !== 0) && e.nodes !== null && e.nodes.end !== null && (kc(
    e.nodes.start,
    /** @type {TemplateNode} */
    e.nodes.end
  ), n = !0), e.f |= ks, pi(e, t && !n), Yr(e, 0);
  var r = e.nodes && e.nodes.t;
  if (r !== null)
    for (const s of r)
      s.stop();
  dl(e), e.f ^= ks, e.f |= nt;
  var a = e.parent;
  a !== null && a.first !== null && hl(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function kc(e, t) {
  for (; e !== null; ) {
    var n = e === t ? null : /* @__PURE__ */ ra(e);
    e.remove(), e = n;
  }
}
function hl(e) {
  var t = e.parent, n = e.prev, r = e.next;
  n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function Dn(e, t, n = !0) {
  var r = [];
  vl(e, r, !0);
  var a = () => {
    n && We(e), t && t();
  }, s = r.length;
  if (s > 0) {
    var i = () => --s || a();
    for (var o of r)
      o.out(i);
  } else
    a();
}
function vl(e, t, n) {
  if ((e.f & He) === 0) {
    e.f ^= He;
    var r = e.nodes && e.nodes.t;
    if (r !== null)
      for (const o of r)
        (o.is_global || n) && t.push(o);
    for (var a = e.first; a !== null; ) {
      var s = a.next;
      if ((a.f & en) === 0) {
        var i = (a.f & Ln) !== 0 || // If this is a branch effect without a block effect parent,
        // it means the parent block effect was pruned. In that case,
        // transparency information was transferred to the branch effect.
        (a.f & mt) !== 0 && (e.f & St) !== 0;
        vl(a, t, i ? n : !1);
      }
      a = s;
    }
  }
}
function Sa(e) {
  ml(e, !0);
}
function ml(e, t) {
  if ((e.f & He) !== 0) {
    e.f ^= He, (e.f & je) === 0 && (_e(e, De), Un.ensure().schedule(e));
    for (var n = e.first; n !== null; ) {
      var r = n.next, a = (n.f & Ln) !== 0 || (n.f & mt) !== 0;
      ml(n, a ? t : !1), n = r;
    }
    var s = e.nodes && e.nodes.t;
    if (s !== null)
      for (const i of s)
        (i.is_global || t) && i.in();
  }
}
function gi(e, t) {
  if (e.nodes)
    for (var n = e.nodes.start, r = e.nodes.end; n !== null; ) {
      var a = n === r ? null : /* @__PURE__ */ ra(n);
      t.append(n), n = a;
    }
}
let ga = !1, tn = !1;
function Bi(e) {
  tn = e;
}
let $ = null, Tt = !1;
function pt(e) {
  $ = e;
}
let Z = null;
function Pt(e) {
  Z = e;
}
let It = null;
function pl(e) {
  $ !== null && (It ?? (It = /* @__PURE__ */ new Set())).add(e);
}
let Je = null, Xe = 0, it = null;
function Ec(e) {
  it = e;
}
let gl = 1, pn = 0, An = pn;
function Gi(e) {
  An = e;
}
function _l() {
  return ++gl;
}
function aa(e) {
  var t = e.f;
  if ((t & De) !== 0)
    return !0;
  if (t & Ae && (e.f &= ~Nn), (t & Mt) !== 0) {
    for (var n = (
      /** @type {Value[]} */
      e.deps
    ), r = n.length, a = 0; a < r; a++) {
      var s = n[a];
      if (aa(
        /** @type {Derived} */
        s
      ) && Jo(
        /** @type {Derived} */
        s
      ), s.wv > e.wv)
        return !0;
    }
    (t & ht) !== 0 && // During time traveling we don't want to reset the status so that
    // traversal of the graph in the other batches still happens
    Ne === null && _e(e, je);
  }
  return !1;
}
function yl(e, t, n = !0) {
  var r = e.reactions;
  if (r !== null && !(It !== null && It.has(e)))
    for (var a = 0; a < r.length; a++) {
      var s = r[a];
      (s.f & Ae) !== 0 ? yl(
        /** @type {Derived} */
        s,
        t,
        !1
      ) : t === s && (n ? _e(s, De) : (s.f & je) !== 0 && _e(s, Mt), vi(
        /** @type {Effect} */
        s
      ));
    }
}
function bl(e) {
  var y;
  var t = Je, n = Xe, r = it, a = $, s = It, i = Ue, o = Tt, l = An, u = e.f;
  Je = /** @type {null | Value[]} */
  null, Xe = 0, it = null, $ = (u & (mt | en)) === 0 ? e : null, It = null, gr(e.ctx), Tt = !1, An = ++pn, e.ac !== null && (Tr(() => {
    e.ac.abort(na);
  }), e.ac = null);
  try {
    e.f |= wa;
    var d = (
      /** @type {Function} */
      e.fn
    ), v = d();
    e.f |= kr;
    var f = e.deps, p = P == null ? void 0 : P.is_fork;
    if (Je !== null) {
      var g;
      if (p || Yr(e, Xe), f !== null && Xe > 0)
        for (f.length = Xe + Je.length, g = 0; g < Je.length; g++)
          f[Xe + g] = Je[g];
      else
        e.deps = f = Je;
      if (mi() && (e.f & ht) !== 0)
        for (g = Xe; g < f.length; g++)
          ((y = f[g]).reactions ?? (y.reactions = [])).push(e);
    } else !p && f !== null && Xe < f.length && (Yr(e, Xe), f.length = Xe);
    if (Vo() && it !== null && !Tt && f !== null && (e.f & (Ae | Mt | De)) === 0)
      for (g = 0; g < /** @type {Source[]} */
      it.length; g++)
        yl(
          it[g],
          /** @type {Effect} */
          e
        );
    if (a !== null && a !== e) {
      if (pn++, a.deps !== null)
        for (let _ = 0; _ < n; _ += 1)
          a.deps[_].rv = pn;
      if (t !== null)
        for (const _ of t)
          _.rv = pn;
      it !== null && (r === null ? r = it : r.push(.../** @type {Source[]} */
      it));
    }
    return (e.f & cn) !== 0 && (e.f ^= cn), v;
  } catch (_) {
    return Ho(_);
  } finally {
    e.f ^= wa, Je = t, Xe = n, it = r, $ = a, It = s, gr(i), Tt = o, An = l;
  }
}
function Sc(e, t) {
  let n = t.reactions;
  if (n !== null) {
    var r = du.call(n, e);
    if (r !== -1) {
      var a = n.length - 1;
      a === 0 ? n = t.reactions = null : (n[r] = n[a], n.pop());
    }
  }
  if (n === null && (t.f & Ae) !== 0 && // Destroying a child effect while updating a parent effect can cause a dependency to appear
  // to be unused, when in fact it is used by the currently-updating parent. Checking `new_deps`
  // allows us to skip the expensive work of disconnecting and immediately reconnecting it
  (Je === null || !ya.call(Je, t))) {
    var s = (
      /** @type {Derived} */
      t
    );
    (s.f & ht) !== 0 && (s.f ^= ht, s.f &= ~Nn), s.v !== Ce && ci(s), s.ac !== null && Tr(() => {
      s.ac.abort(na), s.ac = null, _e(s, De);
    }), lc(s), Yr(s, 0);
  }
}
function Yr(e, t) {
  var n = e.deps;
  if (n !== null)
    for (var r = t; r < n.length; r++)
      Sc(e, n[r]);
}
function yr(e) {
  var t = e.f;
  if ((t & nt) === 0) {
    _e(e, je);
    var n = Z, r = ga;
    Z = e, ga = (t & (mt | en)) === 0;
    try {
      (t & (St | ui)) !== 0 ? xc(e) : pi(e), dl(e);
      var a = bl(e);
      e.teardown = typeof a == "function" ? a : null, e.wv = gl;
      var s;
    } finally {
      ga = r, Z = n;
    }
  }
}
async function Tc() {
  await Promise.resolve(), fc();
}
function h(e) {
  var t = e.f, n = (t & Ae) !== 0;
  if ($ !== null && !Tt) {
    var r = Z !== null && (Z.f & nt) !== 0;
    if (!r && (It === null || !It.has(e))) {
      var a = $.deps;
      if (($.f & wa) !== 0)
        e.rv < pn && (e.rv = pn, Je === null && a !== null && a[Xe] === e ? Xe++ : Je === null ? Je = [e] : Je.push(e));
      else {
        $.deps ?? ($.deps = []), ya.call($.deps, e) || $.deps.push(e);
        var s = e.reactions;
        s === null ? e.reactions = [$] : ya.call(s, $) || s.push($);
      }
    }
  }
  if (tn && Rt.has(e))
    return Rt.get(e);
  if (n) {
    var i = (
      /** @type {Derived} */
      e
    );
    if (tn) {
      var o = i.v;
      return ((i.f & je) === 0 && i.reactions !== null || xl(i)) && (o = di(i)), Rt.set(i, o), o;
    }
    var l = (i.f & ht) === 0 && !Tt && $ !== null && (ga || ($.f & ht) !== 0), u = (i.f & kr) === 0;
    aa(i) && (l && (i.f |= ht), Jo(i)), l && !u && ($o(i), wl(i));
  }
  if (Ne != null && Ne.has(e))
    return Ne.get(e);
  if ((e.f & cn) !== 0)
    throw e.v;
  return e.v;
}
function wl(e) {
  if (e.f |= ht, e.deps !== null)
    for (const t of e.deps)
      (t.reactions ?? (t.reactions = [])).push(e), (t.f & Ae) !== 0 && (t.f & ht) === 0 && ($o(
        /** @type {Derived} */
        t
      ), wl(
        /** @type {Derived} */
        t
      ));
}
function xl(e) {
  if (e.v === Ce) return !0;
  if (e.deps === null) return !1;
  for (const t of e.deps)
    if (Rt.has(t) || (t.f & Ae) !== 0 && xl(
      /** @type {Derived} */
      t
    ))
      return !0;
  return !1;
}
function In(e) {
  var t = Tt;
  try {
    return Tt = !0, e();
  } finally {
    Tt = t;
  }
}
const Mc = ["touchstart", "touchmove"];
function Cc(e) {
  return Mc.includes(e);
}
const gn = Symbol("events"), kl = /* @__PURE__ */ new Set(), Ns = /* @__PURE__ */ new Set();
function jc(e, t, n, r = {}) {
  function a(s) {
    if (r.capture || Us.call(t, s), !s.cancelBubble)
      return Tr(() => n == null ? void 0 : n.call(this, s));
  }
  return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? $t(() => {
    t.addEventListener(e, a, r);
  }) : t.addEventListener(e, a, r), a;
}
function an(e, t, n, r, a) {
  var s = { capture: r, passive: a }, i = jc(e, t, n, s);
  (t === document.body || // @ts-ignore
  t === window || // @ts-ignore
  t === document || // Firefox has quirky behavior, it can happen that we still get "canplay" events when the element is already removed
  t instanceof HTMLMediaElement) && Ba(() => {
    t.removeEventListener(e, i, s);
  });
}
function ce(e, t, n) {
  (t[gn] ?? (t[gn] = {}))[e] = n;
}
function zt(e) {
  for (var t = 0; t < e.length; t++)
    kl.add(e[t]);
  for (var n of Ns)
    n(e);
}
let ls = null, us = !1;
function Us(e) {
  var y, _;
  var t = this, n = (
    /** @type {Node} */
    t.ownerDocument
  ), r = e.type, a = ((y = e.composedPath) == null ? void 0 : y.call(e)) || [], s = (
    /** @type {null | Element} */
    a[0] || e.target
  );
  ls = e, us || (us = !0, setTimeout(() => {
    us = !1, ls = null;
  }));
  var i = 0, o = ls === e && e[gn];
  if (o) {
    var l = a.indexOf(o);
    if (l !== -1 && (t === document || t === /** @type {any} */
    window)) {
      e[gn] = t;
      return;
    }
    var u = a.indexOf(t);
    if (u === -1)
      return;
    l <= u && (i = l);
  }
  if (s = /** @type {Element} */
  a[i] || e.target, s !== t) {
    Ao(e, "currentTarget", {
      configurable: !0,
      get() {
        return s || n;
      }
    });
    var d = $, v = Z;
    pt(null), Pt(null);
    try {
      for (var f, p = []; s !== null && s !== t; ) {
        try {
          var g = (_ = s[gn]) == null ? void 0 : _[r];
          g != null && (!/** @type {any} */
          s.disabled || // DOM could've been updated already by the time this is reached, so we check this as well
          // -> the target could not have been disabled because it emits the event in the first place
          e.target === s) && g.call(s, e);
        } catch (S) {
          f ? p.push(S) : f = S;
        }
        if (e.cancelBubble) break;
        i++, s = i < a.length ? (
          /** @type {Element} */
          a[i]
        ) : null;
      }
      if (f) {
        for (let S of p)
          queueMicrotask(() => {
            throw S;
          });
        throw f;
      }
    } finally {
      e[gn] = t, delete e.currentTarget, pt(d), Pt(v);
    }
  }
}
var jo;
const cs = (
  // We gotta write it like this because after downleveling the pure comment may end up in the wrong location
  ((jo = globalThis == null ? void 0 : globalThis.window) == null ? void 0 : jo.trustedTypes) && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", {
    /** @param {string} html */
    createHTML: (e) => e
  })
);
function Dc(e) {
  return (
    /** @type {string} */
    (cs == null ? void 0 : cs.createHTML(e)) ?? e
  );
}
function Ac(e) {
  var t = ul("template");
  return t.innerHTML = Dc(e.replaceAll("<!>", "<!---->")), t.content;
}
function Ta(e, t) {
  var n = (
    /** @type {Effect} */
    Z
  );
  n.nodes === null && (n.nodes = { start: e, end: t, a: null, t: null });
}
// @__NO_SIDE_EFFECTS__
function ee(e, t) {
  var n = (t & Pu) !== 0, r = (t & zu) !== 0, a, s = !e.startsWith("<!>");
  return () => {
    a === void 0 && (a = Ac(s ? e : "<!>" + e), n || (a = /** @type {TemplateNode} */
    /* @__PURE__ */ Ea(a)));
    var i = (
      /** @type {TemplateNode} */
      r || il ? document.importNode(a, !0) : a.cloneNode(!0)
    );
    if (n) {
      var o = (
        /** @type {TemplateNode} */
        /* @__PURE__ */ Ea(i)
      ), l = (
        /** @type {TemplateNode} */
        i.lastChild
      );
      Ta(o, l);
    } else
      Ta(i, i);
    return i;
  };
}
function Ja(e = "") {
  {
    var t = fn(e + "");
    return Ta(t, t), t;
  }
}
function sa() {
  var e = document.createDocumentFragment(), t = document.createComment(""), n = fn();
  return e.append(t, n), Ta(t, n), e;
}
function B(e, t) {
  e !== null && e.before(
    /** @type {Node} */
    t
  );
}
function Lc() {
  var e;
  return (e = window.__svelte ?? (window.__svelte = {})).uid ?? (e.uid = 1), `c${window.__svelte.uid++}`;
}
function ue(e, t) {
  var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
  n !== /** @type {any} */
  (e[Nr] ?? (e[Nr] = e.nodeValue)) && (e[Nr] = n, e.nodeValue = `${n}`);
}
function El(e, t) {
  return Nc(e, t);
}
const oa = /* @__PURE__ */ new Map();
function Nc(e, { target: t, anchor: n, props: r = {}, events: a, context: s, intro: i = !0, transformError: o }) {
  mc();
  var l = void 0, u = yc(() => {
    var d = n ?? t.appendChild(fn());
    Xu(
      /** @type {TemplateNode} */
      d,
      {
        pending: () => {
        }
      },
      (p) => {
        Fe({});
        var g = (
          /** @type {ComponentContext} */
          Ue
        );
        s && (g.c = s), a && (r.$$events = a), l = e(p, r) || {}, qe();
      },
      o
    );
    var v = /* @__PURE__ */ new Set(), f = (p) => {
      for (var g = 0; g < p.length; g++) {
        var y = p[g];
        if (!v.has(y)) {
          v.add(y);
          var _ = Cc(y);
          for (const F of [t, document]) {
            var S = oa.get(F);
            S === void 0 && (S = /* @__PURE__ */ new Map(), oa.set(F, S));
            var w = S.get(y);
            w === void 0 ? (F.addEventListener(y, Us, { passive: _ }), S.set(y, 1)) : S.set(y, w + 1);
          }
        }
      }
    };
    return f(Ha(kl)), Ns.add(f), () => {
      var _;
      for (var p of v)
        for (const S of [t, document]) {
          var g = (
            /** @type {Map<string, number>} */
            oa.get(S)
          ), y = (
            /** @type {number} */
            g.get(p)
          );
          --y == 0 ? (S.removeEventListener(p, Us), g.delete(p), g.size === 0 && oa.delete(S)) : g.set(p, y);
        }
      Ns.delete(f), d !== n && ((_ = d.parentNode) == null || _.removeChild(d));
    };
  });
  return Os.set(l, u), l;
}
let Os = /* @__PURE__ */ new WeakMap();
function Sl(e, t) {
  const n = Os.get(e);
  return n ? (Os.delete(e), n(t)) : Promise.resolve();
}
var wt, Jt, xt, xn, Qr, Oa, oi;
class Tl {
  /**
   * @param {TemplateNode} anchor
   * @param {boolean} transition
   */
  constructor(t, n = !0) {
    /** @type {TemplateNode} */
    m(this, "anchor");
    /** @type {Map<Batch, Key>} */
    q(this, wt, /* @__PURE__ */ new Map());
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
    q(this, Jt, /* @__PURE__ */ new Map());
    /**
     * Similar to #onscreen with respect to the keys, but contains branches that are not yet
     * in the DOM, because their insertion is deferred.
     * @type {Map<Key, Branch>}
     */
    q(this, xt, /* @__PURE__ */ new Map());
    /**
     * Keys of effects that are currently outroing
     * @type {Set<Key>}
     */
    q(this, xn, /* @__PURE__ */ new Set());
    /**
     * Whether to pause (i.e. outro) on change, or destroy immediately.
     * This is necessary for `<svelte:element>`
     */
    q(this, Qr, !0);
    /**
     * @param {Batch} batch
     */
    q(this, Oa, (t) => {
      if (c(this, wt).has(t)) {
        var n = (
          /** @type {Key} */
          c(this, wt).get(t)
        ), r = c(this, Jt).get(n);
        if (r)
          Sa(r), c(this, xn).delete(n);
        else {
          var a = c(this, xt).get(n);
          a && (Sa(a.effect), c(this, Jt).set(n, a.effect), c(this, xt).delete(n), a.fragment.lastChild.remove(), this.anchor.before(a.fragment), r = a.effect);
        }
        for (const [s, i] of c(this, wt)) {
          if (c(this, wt).delete(s), s === t)
            break;
          const o = c(this, xt).get(i);
          o && (We(o.effect), c(this, xt).delete(i));
        }
        for (const [s, i] of c(this, Jt)) {
          if (s === n || c(this, xn).has(s)) continue;
          const o = () => {
            if (Array.from(c(this, wt).values()).includes(s)) {
              var u = document.createDocumentFragment();
              gi(i, u), u.append(fn()), c(this, xt).set(s, { effect: i, fragment: u });
            } else
              We(i);
            c(this, xn).delete(s), c(this, Jt).delete(s);
          };
          c(this, Qr) || !r ? (c(this, xn).add(s), Dn(i, o, !1)) : o();
        }
      }
    });
    /**
     * @param {Batch} batch
     */
    q(this, oi, (t) => {
      c(this, wt).delete(t);
      const n = Array.from(c(this, wt).values());
      for (const [r, a] of c(this, xt))
        n.includes(r) || (We(a.effect), c(this, xt).delete(r));
    });
    this.anchor = t, I(this, Qr, n);
  }
  /**
   *
   * @param {any} key
   * @param {null | ((target: TemplateNode) => void)} fn
   */
  ensure(t, n) {
    var r = (
      /** @type {Batch} */
      P
    );
    n && !c(this, Jt).has(t) && !c(this, xt).has(t) && c(this, Jt).set(
      t,
      ct(() => n(this.anchor))
    ), c(this, wt).set(r, t), c(this, Oa).call(this, r);
  }
}
wt = new WeakMap(), Jt = new WeakMap(), xt = new WeakMap(), xn = new WeakMap(), Qr = new WeakMap(), Oa = new WeakMap(), oi = new WeakMap();
function Ee(e, t, n = !1) {
  var r = new Tl(e), a = n ? Ln : 0;
  function s(i, o) {
    r.ensure(i, o);
  }
  Za(() => {
    var i = !1;
    t((o, l = 0) => {
      i = !0, s(l, o);
    }), i || s(-1, null);
  }, a);
}
function Fn(e, t) {
  Ka(() => {
    var n = t();
    for (var r in n) {
      var a = n[r];
      a == null || a === "" ? e.style.removeProperty(r) : e.style.setProperty(r, a);
    }
  });
}
function _i(e, t) {
  return t;
}
function Uc(e, t, n) {
  for (var r = [], a = t.length, s, i = t.length, o = 0; o < a; o++) {
    let v = t[o];
    Dn(
      v,
      () => {
        if (s) {
          if (s.pending.delete(v), s.done.add(v), s.pending.size === 0) {
            var f = (
              /** @type {Set<EachOutroGroup>} */
              e.outrogroups
            );
            Fs(e, Ha(s.done)), f.delete(s), f.size === 0 && (e.outrogroups = null);
          }
        } else
          i -= 1;
      },
      !1
    );
  }
  if (i === 0) {
    var l = r.length === 0 && n !== null && e.pending.size === 0;
    if (l) {
      var u = (
        /** @type {Element} */
        n
      ), d = (
        /** @type {Element} */
        u.parentNode
      );
      pc(d), d.append(u), e.items.clear();
    }
    Fs(e, t, !l);
  } else
    s = {
      pending: new Set(t),
      done: /* @__PURE__ */ new Set()
    }, (e.outrogroups ?? (e.outrogroups = /* @__PURE__ */ new Set())).add(s);
}
function Fs(e, t, n = !0) {
  var r;
  if (e.pending.size > 0) {
    r = /* @__PURE__ */ new Set();
    for (const i of e.pending.values())
      for (const o of i)
        r.add(
          /** @type {EachItem} */
          e.items.get(o).e
        );
  }
  for (var a = 0; a < t.length; a++) {
    var s = t[a];
    if (r != null && r.has(s)) {
      s.f |= Ot;
      const i = document.createDocumentFragment();
      gi(s, i);
    } else
      We(t[a], n);
  }
}
var Ki;
function br(e, t, n, r, a, s = null) {
  var i = e, o = /* @__PURE__ */ new Map(), l = (t & Ro) !== 0;
  if (l) {
    var u = (
      /** @type {Element} */
      e
    );
    i = u.appendChild(fn());
  }
  var d = null, v = /* @__PURE__ */ Zo(() => {
    var w = n();
    return (
      /** @type {V[]} */
      li(w) ? w : w == null ? [] : Ha(w)
    );
  }), f, p = /* @__PURE__ */ new Map(), g = !0;
  function y(w) {
    (S.effect.f & nt) === 0 && (S.pending.delete(w), S.fallback = d, Oc(S, f, i, t, r), d !== null && (f.length === 0 ? (d.f & Ot) === 0 ? Sa(d) : (d.f ^= Ot, qr(d, null, i)) : Dn(d, () => {
      d = null;
    })));
  }
  var _ = Za(() => {
    f = /** @type {V[]} */
    h(v);
    for (var w = f.length, F = /* @__PURE__ */ new Set(), R = (
      /** @type {Batch} */
      P
    ), V = 0; V < w; V += 1) {
      var N = f[V], T = r(N, V), k = g ? null : o.get(T);
      k ? (k.v && _r(k.v, N), k.i && _r(k.i, V)) : (k = Fc(
        o,
        g ? i : Ki ?? (Ki = fn()),
        N,
        T,
        V,
        a,
        t,
        n
      ), g || (k.e.f |= Ot), o.set(T, k)), F.add(T);
    }
    w === 0 && s && !d && (g ? d = ct(() => s(i)) : (d = ct(() => s(Ki ?? (Ki = fn()))), d.f |= Ot)), w > F.size && xu(), g || (p.set(R, F), y(R)), h(v);
  }), S = { effect: _, items: o, pending: p, outrogroups: null, fallback: d };
  g = !1;
}
function Cr(e) {
  for (; e !== null && (e.f & mt) === 0; )
    e = e.next;
  return e;
}
function Oc(e, t, n, r, a) {
  var le, ve, D, C, M, E, z, J, ge;
  var s = (r & Uu) !== 0, i = t.length, o = e.items, l = Cr(e.effect.first), u, d = null, v, f = [], p = [], g, y, _, S;
  if (s)
    for (S = 0; S < i; S += 1)
      g = t[S], y = a(g, S), _ = /** @type {EachItem} */
      o.get(y).e, (_.f & Ot) === 0 && ((ve = (le = _.nodes) == null ? void 0 : le.a) == null || ve.measure(), (v ?? (v = /* @__PURE__ */ new Set())).add(_));
  for (S = 0; S < i; S += 1) {
    if (g = t[S], y = a(g, S), _ = /** @type {EachItem} */
    o.get(y).e, e.outrogroups !== null)
      for (const me of e.outrogroups)
        me.pending.delete(_), me.done.delete(_);
    if ((_.f & He) !== 0 && (Sa(_), s && ((C = (D = _.nodes) == null ? void 0 : D.a) == null || C.unfix(), (v ?? (v = /* @__PURE__ */ new Set())).delete(_))), (_.f & Ot) !== 0)
      if (_.f ^= Ot, _ === l)
        qr(_, null, n);
      else {
        var w = d ? d.next : l;
        _ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), rn(e, d, _), rn(e, _, w), qr(_, w, n), d = _, f = [], p = [], l = Cr(d.next);
        continue;
      }
    if (_ !== l) {
      if (u !== void 0 && u.has(_)) {
        if (f.length < p.length) {
          var F = p[0], R;
          d = F.prev;
          var V = f[0], N = f[f.length - 1];
          for (R = 0; R < f.length; R += 1)
            qr(f[R], F, n);
          for (R = 0; R < p.length; R += 1)
            u.delete(p[R]);
          rn(e, V.prev, N.next), rn(e, d, V), rn(e, N, F), l = F, d = N, S -= 1, f = [], p = [];
        } else
          u.delete(_), qr(_, l, n), rn(e, _.prev, _.next), rn(e, _, d === null ? e.effect.first : d.next), rn(e, d, _), d = _;
        continue;
      }
      for (f = [], p = []; l !== null && l !== _; )
        (u ?? (u = /* @__PURE__ */ new Set())).add(l), p.push(l), l = Cr(l.next);
      if (l === null)
        continue;
    }
    (_.f & Ot) === 0 && f.push(_), d = _, l = Cr(_.next);
  }
  if (e.outrogroups !== null) {
    for (const me of e.outrogroups)
      me.pending.size === 0 && (Fs(e, Ha(me.done)), (M = e.outrogroups) == null || M.delete(me));
    e.outrogroups.size === 0 && (e.outrogroups = null);
  }
  if (l !== null || u !== void 0) {
    var T = [];
    if (u !== void 0)
      for (_ of u)
        (_.f & He) === 0 && T.push(_);
    for (; l !== null; )
      (l.f & He) === 0 && l !== e.fallback && T.push(l), l = Cr(l.next);
    var k = T.length;
    if (k > 0) {
      var K = (r & Ro) !== 0 && i === 0 ? n : null;
      if (s) {
        for (S = 0; S < k; S += 1)
          (z = (E = T[S].nodes) == null ? void 0 : E.a) == null || z.measure();
        for (S = 0; S < k; S += 1)
          (ge = (J = T[S].nodes) == null ? void 0 : J.a) == null || ge.fix();
      }
      Uc(e, T, K);
    }
  }
  s && $t(() => {
    var me, L;
    if (v !== void 0)
      for (_ of v)
        (L = (me = _.nodes) == null ? void 0 : me.a) == null || L.apply();
  });
}
function Fc(e, t, n, r, a, s, i, o) {
  var l = (i & Lu) !== 0 ? (i & Ou) === 0 ? /* @__PURE__ */ al(n, !1, !1) : On(n) : null, u = (i & Nu) !== 0 ? On(a) : null;
  return {
    v: l,
    i: u,
    e: ct(() => (s(t, l ?? n, u ?? a, o), () => {
      e.delete(r);
    }))
  };
}
function qr(e, t, n) {
  if (e.nodes)
    for (var r = e.nodes.start, a = e.nodes.end, s = t && (t.f & Ot) === 0 ? (
      /** @type {EffectNodes} */
      t.nodes.start
    ) : n; r !== null; ) {
      var i = (
        /** @type {TemplateNode} */
        /* @__PURE__ */ ra(r)
      );
      if (s.before(r), r === a)
        return;
      r = i;
    }
}
function rn(e, t, n) {
  t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
function qc(e, t, ...n) {
  var r = new Tl(e);
  Za(() => {
    const a = t() ?? null;
    r.ensure(a, a && ((s) => a(s, ...n)));
  }, Ln);
}
function rt(e, t) {
  Ga(() => {
    var a, s;
    e = ((s = (a = Z == null ? void 0 : Z.parent) == null ? void 0 : a.nodes) == null ? void 0 : s.start) ?? e;
    var n = e.getRootNode(), r = (
      /** @type {ShadowRoot} */
      n.host ? (
        /** @type {ShadowRoot} */
        n
      ) : (
        /** @type {Document} */
        n.head ?? /** @type {Document} */
        n.ownerDocument.head
      )
    );
    if (!r.querySelector("#" + t.hash)) {
      const i = ul("style");
      i.id = t.hash, i.textContent = t.code, r.appendChild(i);
    }
  });
}
function Ml(e, t) {
  var n = void 0, r;
  wc(() => {
    n !== (n = t()) && (r && (We(r), r = null), n && (r = ct(() => {
      Ga(() => (
        /** @type {(node: Element) => void} */
        n(e)
      ));
    })));
  });
}
const Zi = [...`
\r\f \v\uFEFF`];
function Rc(e, t, n) {
  var r = e == null ? "" : "" + e;
  if (t && (r = r ? r + " " + t : t), n) {
    for (var a of Object.keys(n))
      if (n[a])
        r = r ? r + " " + a : a;
      else if (r.length)
        for (var s = a.length, i = 0; (i = r.indexOf(a, i)) >= 0; ) {
          var o = i + s;
          (i === 0 || Zi.includes(r[i - 1])) && (o === r.length || Zi.includes(r[o])) ? r = (i === 0 ? "" : r.substring(0, i)) + r.substring(o + 1) : i = o;
        }
  }
  return r === "" ? null : r;
}
function $a(e, t, n, r, a, s) {
  var i = (
    /** @type {any} */
    e[Es]
  );
  if (i !== n || i === void 0) {
    var o = Rc(n, r, s);
    o == null ? e.removeAttribute("class") : e.className = o, e[Es] = n;
  } else if (s && a !== s)
    for (var l in s) {
      var u = !!s[l];
      (a == null || u !== !!a[l]) && e.classList.toggle(l, u);
    }
  return s;
}
function Cl(e, t, n = !1) {
  if (e.multiple) {
    if (t == null)
      return;
    if (!li(t))
      return Hu();
    for (var r of e.options)
      r.selected = t.includes(zr(r));
    return;
  }
  for (r of e.options) {
    var a = zr(r);
    if (vc(a, t)) {
      r.selected = !0;
      return;
    }
  }
  (!n || t !== void 0) && (e.selectedIndex = -1);
}
function Ic(e) {
  var t = new MutationObserver(() => {
    "__value" in e && Cl(e, e.__value);
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
  }), Ba(() => {
    t.disconnect();
  });
}
function Pc(e, t, n = t) {
  var r = /* @__PURE__ */ new WeakSet(), a = !0;
  Go(e, "change", (s) => {
    var i = s ? "[selected]" : ":checked", o;
    if (e.multiple)
      o = [].map.call(e.querySelectorAll(i), zr);
    else {
      var l = e.querySelector(i) ?? // will fall back to first non-disabled option if no option is selected
      e.querySelector("option:not([disabled])");
      o = l && zr(l);
    }
    n(o), e.__value = o, P !== null && r.add(P);
  }), Ga(() => {
    var s = t();
    if (e === document.activeElement) {
      var i = (
        /** @type {Batch} */
        P
      );
      if (r.has(i))
        return;
    }
    if (Cl(e, s, a), a && s === void 0) {
      var o = e.querySelector(":checked");
      o !== null && (s = zr(o), n(s));
    }
    e.__value = s, a = !1;
  }), Ic(e);
}
function zr(e) {
  return "__value" in e ? e.__value : e.value;
}
const zc = Symbol("is custom element"), Vc = Symbol("is html"), Yc = bu ? "progress" : "PROGRESS";
function Ji(e, t) {
  var n = yi(e);
  n.value === (n.value = // treat null and undefined the same for the initial value
  t ?? void 0) || // @ts-expect-error
  // `progress` elements always need their value set when it's `0`
  e.value === t && (t !== 0 || e.nodeName !== Yc) || (e.value = t ?? "");
}
function Hc(e, t) {
  var n = yi(e);
  n.checked !== (n.checked = // treat null and undefined the same for the initial value
  t ?? void 0) && (e.checked = t);
}
function ke(e, t, n, r) {
  var a = yi(e);
  a[t] !== (a[t] = n) && (t === "loading" && (e[_u] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && Wc(e).includes(t) ? e[t] = n : e.setAttribute(t, n));
}
function yi(e) {
  return (
    /** @type {Record<string | symbol, unknown>} **/
    /** @type {any} */
    e[da] ?? (e[da] = {
      [zc]: e.nodeName.includes("-"),
      [Vc]: e.namespaceURI === Vu
    })
  );
}
var $i = /* @__PURE__ */ new Map();
function Wc(e) {
  var t = e.getAttribute("is") || e.nodeName, n = $i.get(t);
  if (n) return n;
  $i.set(t, n = []);
  for (var r, a = e, s = Element.prototype; s !== a; ) {
    r = hu(a);
    for (var i in r)
      r[i].set && // better safe than sorry, we don't want spread attributes to mess with HTML content
      i !== "innerHTML" && i !== "textContent" && i !== "innerText" && n.push(i);
    a = Lo(a);
  }
  return n;
}
function hn(e, t, n = t) {
  var r = /* @__PURE__ */ new WeakSet();
  Go(e, "input", async (a) => {
    var s = a ? e.defaultValue : e.value;
    if (s = fs(e) ? ds(s) : s, n(s), P !== null && r.add(P), await Tc(), s !== (s = t())) {
      var i = e.selectionStart, o = e.selectionEnd, l = e.value.length;
      if (e.value = s ?? "", o !== null) {
        var u = e.value.length;
        i === o && o === l && u > l ? (e.selectionStart = u, e.selectionEnd = u) : (e.selectionStart = i, e.selectionEnd = Math.min(o, u));
      }
    }
  }), // If we are hydrating and the value has since changed,
  // then use the updated value from the input instead.
  // If defaultValue is set, then value == defaultValue
  // TODO Svelte 6: remove input.value check and set to empty string?
  In(t) == null && e.value && (n(fs(e) ? ds(e.value) : e.value), P !== null && r.add(P)), Ka(() => {
    var a = t();
    if (e === document.activeElement) {
      var s = (
        /** @type {Batch} */
        P
      );
      if (r.has(s))
        return;
    }
    fs(e) && a === ds(e.value) || e.type === "date" && !a && !e.value || a !== e.value && (e.value = a ?? "");
  });
}
function fs(e) {
  var t = e.type;
  return t === "number" || t === "range";
}
function ds(e) {
  return e === "" ? null : +e;
}
function hs(e, t) {
  return e === t || (e == null ? void 0 : e[jn]) === t;
}
function jl(e = {}, t, n, r) {
  var a = (
    /** @type {ComponentContext} */
    Ue.r
  ), s = (
    /** @type {Effect} */
    Z
  );
  return Ga(() => {
    var i, o;
    return Ka(() => {
      i = o, o = [], In(() => {
        hs(n(...o), e) || (t(e, ...o), i && hs(n(...i), e) && t(null, ...i));
      });
    }), () => {
      let l = s;
      for (; l !== a && l.parent !== null && l.parent.f & ks; )
        l = l.parent;
      const u = () => {
        o && hs(n(...o), e) && t(null, ...o);
      }, d = l.teardown;
      l.teardown = () => {
        u(), d == null || d();
      };
    };
  }), e;
}
function $e(e, t, n, r) {
  var R;
  var a = !0, s = (n & Ru) !== 0, i = (n & Iu) !== 0, o = (
    /** @type {V} */
    r
  ), l = !0, u = (
    /** @type {Derived<V> | undefined} */
    void 0
  ), d = () => i && a ? (u ?? (u = /* @__PURE__ */ Vr(
    /** @type {() => V} */
    r
  )), h(u)) : (l && (l = !1, o = i ? In(
    /** @type {() => V} */
    r
  ) : (
    /** @type {V} */
    r
  )), o);
  let v;
  if (s) {
    var f = jn in e || gu in e;
    v = ((R = sr(e, t)) == null ? void 0 : R.set) ?? (f && t in e ? (V) => e[t] = V : void 0);
  }
  var p, g = !1;
  s ? [p, g] = Zu(() => (
    /** @type {V} */
    e[t]
  )) : p = /** @type {V} */
  e[t], p === void 0 && r !== void 0 && (p = d(), v && (Mu(), v(p)));
  var y;
  if (y = () => {
    var V = (
      /** @type {V} */
      e[t]
    );
    return V === void 0 ? d() : (l = !0, V);
  }, (n & qu) === 0)
    return y;
  if (v) {
    var _ = e.$$legacy;
    return (
      /** @type {() => V} */
      (function(V, N) {
        return arguments.length > 0 ? ((!N || _ || g) && v(N ? y() : V), V) : y();
      })
    );
  }
  var S = !1, w = ((n & Fu) !== 0 ? Vr : Zo)(() => (S = !1, y()));
  s && h(w);
  var F = (
    /** @type {Effect} */
    Z
  );
  return (
    /** @type {() => V} */
    (function(V, N) {
      if (arguments.length > 0) {
        const T = N ? h(w) : s ? Ft(V) : V;
        return O(w, T), S = !0, o !== void 0 && (o = T), V;
      }
      return tn && S || (F.f & nt) !== 0 ? w.v : h(w);
    })
  );
}
function bi(e) {
  Ue === null && qo(), lr(() => {
    const t = In(e);
    if (typeof t == "function") return (
      /** @type {() => void} */
      t
    );
  });
}
function Bc(e) {
  Ue === null && qo(), bi(() => () => In(e));
}
const Gc = "5";
var Do;
typeof window < "u" && ((Do = window.__svelte ?? (window.__svelte = {})).v ?? (Do.v = /* @__PURE__ */ new Set())).add(Gc);
function qt() {
  return (window.location.pathname.split("extension/")[0] || "/") + "extension/BankSync/";
}
var Kc = /* @__PURE__ */ ee('<tr><td colspan="6" class="empty-row svelte-bkmejs">No integrations configured.</td></tr>'), Zc = /* @__PURE__ */ ee('<div class="api-status-ok svelte-bkmejs">OK</div>'), Jc = /* @__PURE__ */ ee('<div class="api-error-msg svelte-bkmejs"> </div>'), $c = /* @__PURE__ */ ee('<div class="api-status-error svelte-bkmejs">Error</div> <!>', 1), Qc = /* @__PURE__ */ ee('<span class="spinner svelte-bkmejs"></span> Syncing...', 1), Xc = /* @__PURE__ */ ee('<tr><td class="svelte-bkmejs"><strong> </strong></td><td class="svelte-bkmejs"> </td><td class="svelte-bkmejs"><div class="api-balances svelte-bkmejs"> </div></td><td class="svelte-bkmejs"> </td><td class="svelte-bkmejs"><!></td><td class="api-actions svelte-bkmejs"><button type="button" class="btn btn-sync svelte-bkmejs"><!></button> <button type="button" class="btn btn-primary btn-import svelte-bkmejs">Import</button> <button type="button" class="btn btn-edit svelte-bkmejs">Edit</button></td></tr>'), ef = /* @__PURE__ */ ee('<table class="api-table svelte-bkmejs"><thead><tr><th class="svelte-bkmejs">Integration</th><th class="svelte-bkmejs">Importer</th><th class="svelte-bkmejs">Balances</th><th class="svelte-bkmejs">Last Sync</th><th class="svelte-bkmejs">Status</th><th class="svelte-bkmejs">Actions</th></tr></thead><tbody><!></tbody></table>');
const tf = {
  hash: "svelte-bkmejs",
  code: `.api-table.svelte-bkmejs {width:100%;border-collapse:collapse;margin-bottom:1rem;}.api-table.svelte-bkmejs th:where(.svelte-bkmejs),
  .api-table.svelte-bkmejs td:where(.svelte-bkmejs) {padding:10px;border-bottom:1px solid var(--border, #eee);text-align:left;}.api-table.svelte-bkmejs th:where(.svelte-bkmejs) {background:var(--color-sidebar-background, #fafafa);color:var(--text-color, inherit);font-weight:bold;}.empty-row.svelte-bkmejs {text-align:center;color:var(--text-color, inherit);opacity:0.6;padding:30px !important;}.api-status-ok.svelte-bkmejs {color:var(--color-background-positive, #2ecc71);font-weight:bold;}.api-status-error.svelte-bkmejs {color:var(--color-background-negative, #e74c3c);font-weight:bold;}.api-error-msg.svelte-bkmejs {color:var(--color-background-negative, #e74c3c);font-size:0.85em;margin-top:4px;}.api-balances.svelte-bkmejs {white-space:pre-wrap;font-family:monospace;font-size:0.9em;}.api-actions.svelte-bkmejs {white-space:nowrap;}.api-actions.svelte-bkmejs button:where(.svelte-bkmejs) {margin-right:5px;}.btn.svelte-bkmejs {padding:5px 10px;border-radius:4px;border:1px solid var(--border, #ccc);background:var(--background, #fff);color:var(--text-color, inherit);cursor:pointer;font-size:0.85em;}.btn.svelte-bkmejs:hover:not(:disabled) {background:var(--color-sidebar-background, #f5f5f5);}.btn-primary.svelte-bkmejs {background:var(--primary, #0066cc);color:#fff;border-color:var(--primary, #0066cc);}.btn-primary.svelte-bkmejs:hover:not(:disabled) {background:#0052a3;}.spinner.svelte-bkmejs {display:inline-block;width:0.85rem;height:0.85rem;border:2px solid rgba(128, 128, 128, 0.3);border-radius:50%;border-top-color:currentColor;
    animation: svelte-bkmejs-spin 1s linear infinite;vertical-align:text-bottom;}

  @keyframes svelte-bkmejs-spin {
    to {
      transform: rotate(360deg);
    }
  }`
};
function nf(e, t) {
  Fe(t, !0), rt(e, tf);
  let n = Ft({});
  async function r(u) {
    n[u.filename] = !0;
    try {
      const d = window.location.origin + qt() + "callback", f = await (await fetch(`${qt()}sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: u.filename, redirect_uri: d })
      })).json();
      f.status === "success" ? (t.onAlert(`Synced ${u.filename} successfully.`, "success"), t.onSyncComplete()) : f.status === "auth_required" ? (window.open(f.auth_url, "_blank"), t.onAlert("Authentication required. A window has opened. Complete the authorization to sync.", "warning")) : t.onAlert(`Sync failed: ${f.message}`, "error");
    } catch (d) {
      t.onAlert(`Sync error: ${d.message}`, "error");
    } finally {
      n[u.filename] = !1, t.onSyncComplete();
    }
  }
  var a = ef(), s = j(U(a)), i = U(s);
  {
    var o = (u) => {
      var d = Kc();
      B(u, d);
    }, l = (u) => {
      var d = sa(), v = Re(d);
      br(v, 17, () => t.items, (f) => f.filename, (f, p) => {
        var g = Xc(), y = U(g), _ = U(y), S = U(_), w = j(y), F = U(w), R = j(w), V = U(R), N = U(V), T = j(R), k = U(T), K = j(T), le = U(K);
        {
          var ve = (L) => {
            var ae = Zc();
            B(L, ae);
          }, D = (L) => {
            var ae = $c(), Pe = j(Re(ae), 2);
            {
              var _t = (st) => {
                var se = Jc(), Te = U(se);
                fe(() => ue(Te, h(p).error_msg)), B(st, se);
              };
              Ee(Pe, (st) => {
                h(p).error_msg && st(_t);
              });
            }
            B(L, ae);
          };
          Ee(le, (L) => {
            h(p).status === "ok" ? L(ve) : L(D, -1);
          });
        }
        var C = j(K), M = U(C), E = U(M);
        {
          var z = (L) => {
            var ae = Qc();
            B(L, ae);
          }, J = (L) => {
            var ae = Ja("Sync");
            B(L, ae);
          };
          Ee(E, (L) => {
            n[h(p).filename] ? L(z) : L(J, -1);
          });
        }
        var ge = j(M, 2), me = j(ge, 2);
        fe(
          (L) => {
            ue(S, h(p).filename), ue(F, h(p).importer_name), ue(N, h(p).balances || "-"), ue(k, L), M.disabled = n[h(p).filename];
          },
          [
            () => h(p).last_sync ? new Date(h(p).last_sync).toLocaleString() : "Never"
          ]
        ), ce("click", M, () => r(h(p))), ce("click", ge, () => t.onOpenImport(h(p))), ce("click", me, () => t.onOpenEdit(h(p))), B(f, g);
      }), B(u, d);
    };
    Ee(i, (u) => {
      t.items.length === 0 ? u(o) : u(l, -1);
    });
  }
  B(e, a), qe();
}
zt(["click"]);
var rf = /* @__PURE__ */ ee('<div class="modal-overlay svelte-1f2mmmk"><div class="modal-card svelte-1f2mmmk"><div class="modal-header svelte-1f2mmmk"><h3 class="svelte-1f2mmmk">Edit Configuration &mdash; <code> </code></h3> <button type="button" class="btn-close svelte-1f2mmmk">&times;</button></div> <div class="modal-body svelte-1f2mmmk"><div class="editor-container svelte-1f2mmmk"></div></div> <div class="modal-footer svelte-1f2mmmk"><button type="button" class="btn btn-delete svelte-1f2mmmk"> </button> <div class="footer-actions svelte-1f2mmmk"><button type="button" class="btn svelte-1f2mmmk">Cancel</button> <button type="button" class="btn btn-primary svelte-1f2mmmk"> </button></div></div></div></div>');
const af = {
  hash: "svelte-1f2mmmk",
  code: ".modal-overlay.svelte-1f2mmmk {position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0, 0, 0, 0.5);z-index:2000;display:flex;align-items:center;justify-content:center;}.modal-card.svelte-1f2mmmk {background:var(--background, #fff);border-radius:8px;box-shadow:0 4px 20px rgba(0, 0, 0, 0.2);width:80vw;height:80vh;display:flex;flex-direction:column;}.modal-header.svelte-1f2mmmk {padding:12px 16px;border-bottom:1px solid var(--border, #ddd);display:flex;justify-content:space-between;align-items:center;}.modal-header.svelte-1f2mmmk h3:where(.svelte-1f2mmmk) {margin:0;font-size:1.1em;}.btn-close.svelte-1f2mmmk {background:transparent;border:none;font-size:1.5em;cursor:pointer;line-height:1;color:var(--text-color, inherit);}.modal-body.svelte-1f2mmmk {flex:1;position:relative;padding:10px;}.editor-container.svelte-1f2mmmk {position:absolute;top:10px;left:10px;right:10px;bottom:10px;border:1px solid var(--border, #ddd);}.modal-footer.svelte-1f2mmmk {padding:12px 16px;border-top:1px solid var(--border, #ddd);display:flex;justify-content:space-between;align-items:center;}.footer-actions.svelte-1f2mmmk {display:flex;gap:8px;}.btn.svelte-1f2mmmk {padding:6px 14px;border-radius:4px;border:1px solid var(--border, #ccc);background:var(--background, #fff);color:var(--text-color, inherit);cursor:pointer;font-size:0.9em;}.btn-primary.svelte-1f2mmmk {background:var(--primary, #0066cc);color:#fff;border-color:var(--primary, #0066cc);}.btn-primary.svelte-1f2mmmk:hover:not(:disabled) {background:#0052a3;}.btn-delete.svelte-1f2mmmk {color:var(--color-background-negative, #e74c3c);border-color:rgba(231, 76, 60, 0.3);}.btn-delete.svelte-1f2mmmk:hover:not(:disabled) {background:rgba(231, 76, 60, 0.1);}"
};
function sf(e, t) {
  Fe(t, !0), rt(e, af);
  let n = /* @__PURE__ */ re(null), r = null, a = /* @__PURE__ */ re(!1), s = /* @__PURE__ */ re(!1), i = /* @__PURE__ */ re(!1);
  function o(D) {
    return new Promise((C, M) => {
      const E = document.createElement("script");
      E.src = D, E.onload = () => C(), E.onerror = (z) => M(z), document.head.appendChild(E);
    });
  }
  async function l() {
    window.jsyaml || await o("https://cdnjs.cloudflare.com/ajax/libs/js-yaml/4.1.0/js-yaml.min.js"), window.ajv7 || await o("https://cdnjs.cloudflare.com/ajax/libs/ajv/8.12.0/ajv7.min.js");
    const D = new window.ajv7({ strict: !1 });
    [
      "date",
      "date-time",
      "uuid",
      "uri",
      "url",
      "email",
      "ipv4",
      "ipv6"
    ].forEach((M) => {
      try {
        D.addFormat(M, !0);
      } catch {
      }
    });
    let C = null;
    try {
      const E = await (await fetch(`${qt()}schema`)).json();
      C = D.compile(E);
    } catch (M) {
      console.warn("Failed to compile schema:", M);
    }
    window.require || await o("https://unpkg.com/monaco-editor@0.44.0/min/vs/loader.js"), window.require.config({
      paths: { vs: "https://unpkg.com/monaco-editor@0.44.0/min/vs" }
    }), window.require(["vs/editor/editor.main"], async (M) => {
      if (h(n)) {
        r = M.editor.create(h(n), {
          value: "Loading...",
          language: "yaml",
          theme: "vs-light",
          automaticLayout: !0,
          minimap: { enabled: !1 },
          scrollBeyondLastLine: !1,
          fontSize: 13,
          fontFamily: "monospace"
        }), r.onDidChangeModelContent(() => {
          O(i, !0), u(M, C);
        });
        try {
          const z = await (await fetch(`${qt()}config?name=${encodeURIComponent(t.item.filename)}`)).json();
          z.status === "success" ? (r.setValue(z.content), O(i, !1)) : r.setValue(`Error: ${z.message}`);
        } catch (E) {
          r.setValue(`Failed to load file: ${E.message}`);
        }
      }
    });
  }
  function u(D, C) {
    if (!r) return;
    const M = r.getValue(), E = [];
    let z = null;
    try {
      z = window.jsyaml.load(M);
    } catch (J) {
      E.push({
        severity: D.MarkerSeverity.Error,
        startLineNumber: J.mark ? J.mark.line + 1 : 1,
        startColumn: J.mark ? J.mark.column + 1 : 1,
        endLineNumber: J.mark ? J.mark.line + 1 : 1,
        endColumn: 100,
        message: J.message
      }), D.editor.setModelMarkers(r.getModel(), "yaml", E);
      return;
    }
    if (z && C)
      try {
        !C(z) && C.errors && C.errors.forEach((ge) => {
          E.push({
            severity: D.MarkerSeverity.Warning,
            startLineNumber: 1,
            startColumn: 1,
            endLineNumber: 1,
            endColumn: 100,
            message: `${ge.instancePath} ${ge.message}`
          });
        });
      } catch {
      }
    D.editor.setModelMarkers(r.getModel(), "yaml", E);
  }
  async function d() {
    if (r) {
      O(a, !0);
      try {
        const D = r.getValue(), M = await (await fetch(`${qt()}config`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: t.item.filename, content: D })
        })).json();
        M.status === "success" ? t.onSave() : t.onError("Save failed: " + M.message);
      } catch (D) {
        t.onError("Save error: " + D.message);
      } finally {
        O(a, !1);
      }
    }
  }
  async function v() {
    if (confirm(`Delete ${t.item.filename}?`)) {
      O(s, !0);
      try {
        const C = await (await fetch(`${qt()}config?name=${encodeURIComponent(t.item.filename)}`, { method: "DELETE" })).json();
        C.status === "success" ? t.onDelete() : t.onError("Delete failed: " + C.message);
      } catch (D) {
        t.onError("Delete error: " + D.message);
      } finally {
        O(s, !1);
      }
    }
  }
  bi(() => {
    l();
  }), Bc(() => {
    r && r.dispose();
  });
  var f = rf(), p = U(f), g = U(p), y = U(g), _ = j(U(y)), S = U(_), w = j(y, 2), F = j(g, 2), R = U(F);
  jl(R, (D) => O(n, D), () => h(n));
  var V = j(F, 2), N = U(V), T = U(N), k = j(N, 2), K = U(k), le = j(K, 2), ve = U(le);
  fe(() => {
    ue(S, t.item.filename), N.disabled = h(s), ue(T, h(s) ? "Deleting..." : "Delete"), le.disabled = h(a) || !h(i), ue(ve, h(a) ? "Saving..." : "Save");
  }), ce("click", w, function(...D) {
    var C;
    (C = t.onClose) == null || C.apply(this, D);
  }), ce("click", N, v), ce("click", K, function(...D) {
    var C;
    (C = t.onClose) == null || C.apply(this, D);
  }), ce("click", le, d), B(e, f), qe();
}
zt(["click"]);
var of = /* @__PURE__ */ ee('<div class="modal-overlay svelte-14vei99"><div class="modal-card svelte-14vei99"><div class="modal-header svelte-14vei99"><h3 class="svelte-14vei99">New Integration</h3> <button type="button" class="btn-close svelte-14vei99">&times;</button></div> <div class="modal-body svelte-14vei99"><div class="form-group svelte-14vei99"><label for="new-int-name" class="svelte-14vei99">File Name</label> <input id="new-int-name" type="text" placeholder="api_mybank.yaml" class="svelte-14vei99"/></div> <div class="form-group svelte-14vei99"><label for="new-int-type" class="svelte-14vei99">Importer Type</label> <select id="new-int-type" class="svelte-14vei99"><option>Monzo</option><option>Starling</option><option>TrueLayer</option></select></div></div> <div class="modal-footer svelte-14vei99"><button type="button" class="btn svelte-14vei99">Cancel</button> <button type="button" class="btn btn-primary svelte-14vei99"> </button></div></div></div>');
const lf = {
  hash: "svelte-14vei99",
  code: `.modal-overlay.svelte-14vei99 {position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0, 0, 0, 0.5);z-index:2000;display:flex;align-items:center;justify-content:center;}.modal-card.svelte-14vei99 {background:var(--background, #fff);border-radius:8px;box-shadow:0 4px 20px rgba(0, 0, 0, 0.2);width:420px;max-width:90vw;display:flex;flex-direction:column;}.modal-header.svelte-14vei99 {padding:12px 16px;border-bottom:1px solid var(--border, #ddd);display:flex;justify-content:space-between;align-items:center;}.modal-header.svelte-14vei99 h3:where(.svelte-14vei99) {margin:0;font-size:1.1em;}.btn-close.svelte-14vei99 {background:transparent;border:none;font-size:1.5em;cursor:pointer;line-height:1;color:var(--text-color, inherit);}.modal-body.svelte-14vei99 {padding:16px;}.form-group.svelte-14vei99 {margin-bottom:14px;}.form-group.svelte-14vei99 label:where(.svelte-14vei99) {display:block;margin-bottom:6px;font-weight:bold;font-size:0.9em;}.form-group.svelte-14vei99 input:where(.svelte-14vei99),
  .form-group.svelte-14vei99 select:where(.svelte-14vei99) {width:100%;padding:8px 10px;border:1px solid var(--border, #ccc);border-radius:4px;background:var(--background, #fff);color:var(--text-color, inherit);box-sizing:border-box;font-size:0.95em;}.modal-footer.svelte-14vei99 {padding:12px 16px;border-top:1px solid var(--border, #ddd);display:flex;justify-content:flex-end;gap:8px;}.btn.svelte-14vei99 {padding:6px 14px;border-radius:4px;border:1px solid var(--border, #ccc);background:var(--background, #fff);color:var(--text-color, inherit);cursor:pointer;font-size:0.9em;}.btn-primary.svelte-14vei99 {background:var(--primary, #0066cc);color:#fff;border-color:var(--primary, #0066cc);}.btn-primary.svelte-14vei99:hover:not(:disabled) {background:#0052a3;}`
};
function uf(e, t) {
  Fe(t, !0), rt(e, lf);
  let n = /* @__PURE__ */ re("api_new.yaml"), r = /* @__PURE__ */ re("monzo"), a = /* @__PURE__ */ re(!1);
  async function s() {
    const N = h(n).trim();
    if (!N.startsWith("api_") || !N.endsWith(".yaml")) {
      t.onError("Name must start with 'api_' and end with '.yaml'");
      return;
    }
    O(a, !0);
    try {
      const k = await (await fetch(`${qt()}create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: N, importer_type: h(r) })
      })).json();
      k.status === "success" ? t.onCreated(N) : t.onError("Create failed: " + k.message);
    } catch (T) {
      t.onError("Create error: " + T.message);
    } finally {
      O(a, !1);
    }
  }
  var i = of(), o = U(i), l = U(o), u = j(U(l), 2), d = j(l, 2), v = U(d), f = j(U(v), 2), p = j(v, 2), g = j(U(p), 2), y = U(g);
  y.value = y.__value = "monzo";
  var _ = j(y);
  _.value = _.__value = "starling";
  var S = j(_);
  S.value = S.__value = "truelayer";
  var w = j(d, 2), F = U(w), R = j(F, 2), V = U(R);
  fe(() => {
    R.disabled = h(a), ue(V, h(a) ? "Creating..." : "Create");
  }), ce("click", u, function(...N) {
    var T;
    (T = t.onClose) == null || T.apply(this, N);
  }), hn(f, () => h(n), (N) => O(n, N)), Pc(g, () => h(r), (N) => O(r, N)), ce("click", F, function(...N) {
    var T;
    (T = t.onClose) == null || T.apply(this, N);
  }), ce("click", R, s), B(e, i), qe();
}
zt(["click"]);
class wi {
  constructor(t) {
    m(this, "is_ok", !0);
    m(this, "is_err", !1);
    m(this, "value");
    this.value = t;
  }
  and_then(t) {
    return t(this.value);
  }
  map(t) {
    return new wi(t(this.value));
  }
  map_err() {
    return this;
  }
  or_else() {
    return this;
  }
  unwrap() {
    return this.value;
  }
  unwrap_err() {
    throw new Error("unwrap_err() called on Ok().");
  }
  unwrap_or() {
    return this.value;
  }
}
class xi {
  constructor(t) {
    m(this, "is_ok", !1);
    m(this, "is_err", !0);
    m(this, "error");
    this.error = t;
  }
  and_then() {
    return this;
  }
  map() {
    return this;
  }
  or_else(t) {
    return t(this.error);
  }
  map_err(t) {
    return new xi(t(this.error));
  }
  unwrap(t) {
    throw t ? new t(this.error) : new Error("unwrap() called on error.");
  }
  unwrap_err() {
    return this.error;
  }
  unwrap_or(t) {
    return t;
  }
}
function be(e) {
  return new wi(e);
}
function ye(e) {
  return new xi(e);
}
function Qi(e) {
  const t = [];
  for (const n of e)
    if (n.is_ok)
      t.push(n.value);
    else
      return n;
  return be(t);
}
class Be extends Error {
}
class ki extends Be {
  constructor(t) {
    super(`Validation of primitive ${t} failed.`);
  }
}
class cf extends Be {
  constructor() {
    super("Validation of date failed: invalid date");
  }
}
class ff extends Be {
  constructor() {
    super("Validation of date failed: invalid type or length");
  }
}
class Dl extends Be {
  constructor() {
    super("Validation of constant failed");
  }
}
class df extends Be {
  constructor() {
    super("Validation of tagged union failed: expected object");
  }
}
class Xi extends Be {
  constructor(t) {
    super(`Validation of tagged union failed: invalid tag ${t}.`);
  }
}
class hf extends Be {
  constructor(t, n) {
    super(`Validation of tagged union failed for tag ${t}.`, { cause: n });
  }
}
class vf extends Be {
  constructor() {
    super("Validation of array failed.");
  }
}
class mf extends Be {
  constructor(t, n) {
    super(`Validation of array failed at key ${t.toString()}.`, { cause: n });
  }
}
class pf extends Be {
  constructor() {
    super("Validation of tuple failed.");
  }
}
class gf extends Be {
  constructor(t, n) {
    super(`Validation of tuple failed at key ${t.toString()}.`, { cause: n });
  }
}
class _f extends Be {
  constructor() {
    super("Validation of object failed.");
  }
}
class yf extends Be {
  constructor(t, n) {
    super(`Validation of object failed at key ${t}.`, { cause: n });
  }
}
class bf extends Be {
  constructor() {
    super("Validation of record failed.");
  }
}
class wf extends Be {
  constructor(t, n) {
    super(`Validation of record failed at key ${t}.`, { cause: n });
  }
}
function Ei(e, t) {
  return (n) => {
    const r = e(n);
    return r.is_ok ? r : be(t());
  };
}
const Al = be, b = (e) => typeof e == "string" ? be(e) : ye(new ki("string")), qs = (e) => be(typeof e == "string" ? e : ""), ft = (e) => typeof e == "boolean" ? be(e) : ye(new ki("boolean")), Se = (e) => typeof e == "number" ? be(e) : ye(new ki("number")), Ct = (e) => {
  if (e instanceof Date)
    return be(e);
  if (typeof e == "string" && e.length === 10) {
    const t = new Date(e);
    return Number.isNaN(+t) ? ye(new cf()) : be(t);
  }
  return ye(new ff());
};
function gt(e) {
  return (t) => t === e ? be(t) : ye(new Dl());
}
function Ll(...e) {
  return (t) => e.includes(t) ? be(t) : ye(new Dl());
}
function Si(e, t) {
  return (n) => {
    if (!Qa(n))
      return ye(new df());
    const r = n[e];
    if (typeof r != "string")
      return ye(new Xi("- not a string"));
    if (!Object.hasOwn(t, r))
      return ye(new Xi(r));
    const a = t[r](n);
    return a.is_ok ? a : ye(new hf(r, a.error));
  };
}
function we(e) {
  return (t) => t == null ? be(null) : e(t);
}
function xf(e) {
  return (t) => e()(t);
}
function Q(e) {
  return (t) => {
    if (Array.isArray(t)) {
      const n = [];
      let r = 0;
      for (const a of t) {
        const s = e(a);
        if (s.is_ok)
          n.push(s.value);
        else
          return ye(new mf(r, s.error));
        r += 1;
      }
      return be(n);
    }
    return ye(new vf());
  };
}
function Rs(...e) {
  return (t) => {
    if (Array.isArray(t) && t.length === e.length) {
      const n = [];
      let r = 0;
      for (const a of e) {
        const s = a(t[r]);
        if (s.is_ok)
          n[r] = s.value;
        else
          return ye(new gf(r, s.error));
        r += 1;
      }
      return be(n);
    }
    return ye(new pf());
  };
}
function Qa(e) {
  return typeof e == "object" && e != null && !Array.isArray(e);
}
function W(e) {
  return (t) => {
    if (Qa(t)) {
      const n = {};
      for (const r in e)
        if (Object.hasOwn(e, r)) {
          const a = e[r](t[r]);
          if (a.is_ok)
            n[r] = a.value;
          else
            return ye(new yf(r, a.error));
        }
      return be(n);
    }
    return ye(new _f());
  };
}
function Ye(e) {
  return (t) => {
    if (Qa(t)) {
      const n = {};
      for (const [r, a] of Object.entries(t)) {
        const s = e(a);
        if (s.is_ok)
          n[r] = s.value;
        else
          return ye(new wf(r, s.error));
      }
      return be(n);
    }
    return ye(new bf());
  };
}
const Gn = class Gn {
  constructor(t, n) {
    m(this, "number");
    m(this, "currency");
    this.number = t, this.currency = n;
  }
  /** Render to a string. */
  str(t) {
    return t.amount(this.number, this.currency);
  }
};
m(Gn, "raw_validator", W({ number: Se, currency: b })), m(Gn, "validator", (t) => Gn.raw_validator(t).map(
  ({ number: n, currency: r }) => new Gn(n, r)
));
let Ma = Gn;
const Wt = class Wt {
  constructor(t, n) {
    m(this, "number");
    m(this, "currency");
    this.number = t, this.currency = n;
  }
  /** Set the currency return an updated copy. */
  set_currency(t) {
    return new Wt(this.number, t);
  }
  /** Set the number and return an updated copy. */
  set_number(t) {
    return new Wt(t, this.currency);
  }
  static empty() {
    return new Wt("", "");
  }
};
m(Wt, "raw_validator", W({ number: b, currency: b })), m(Wt, "validator", (t) => Wt.raw_validator(t).map(
  ({ number: n, currency: r }) => new Wt(n, r)
));
let Hr = Wt;
function kf(e) {
  return Math.abs(e = Math.round(e)) >= 1e21 ? e.toLocaleString("en").replace(/,/g, "") : e.toString(10);
}
function Ca(e, t) {
  if (!isFinite(e) || e === 0) return null;
  var n = (e = t ? e.toExponential(t - 1) : e.toExponential()).indexOf("e"), r = e.slice(0, n);
  return [
    r.length > 1 ? r[0] + r.slice(2) : r,
    +e.slice(n + 1)
  ];
}
function Ef(e) {
  return e = Ca(Math.abs(e)), e ? e[1] : NaN;
}
function Sf(e, t) {
  return function(n, r) {
    for (var a = n.length, s = [], i = 0, o = e[0], l = 0; a > 0 && o > 0 && (l + o + 1 > r && (o = Math.max(1, r - l)), s.push(n.substring(a -= o, a + o)), !((l += o + 1) > r)); )
      o = e[i = (i + 1) % e.length];
    return s.reverse().join(t);
  };
}
function Tf(e) {
  return function(t) {
    return t.replace(/[0-9]/g, function(n) {
      return e[+n];
    });
  };
}
var Mf = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
function Is(e) {
  if (!(t = Mf.exec(e))) throw new Error("invalid format: " + e);
  var t;
  return new Ti({
    fill: t[1],
    align: t[2],
    sign: t[3],
    symbol: t[4],
    zero: t[5],
    width: t[6],
    comma: t[7],
    precision: t[8] && t[8].slice(1),
    trim: t[9],
    type: t[10]
  });
}
Is.prototype = Ti.prototype;
function Ti(e) {
  this.fill = e.fill === void 0 ? " " : e.fill + "", this.align = e.align === void 0 ? ">" : e.align + "", this.sign = e.sign === void 0 ? "-" : e.sign + "", this.symbol = e.symbol === void 0 ? "" : e.symbol + "", this.zero = !!e.zero, this.width = e.width === void 0 ? void 0 : +e.width, this.comma = !!e.comma, this.precision = e.precision === void 0 ? void 0 : +e.precision, this.trim = !!e.trim, this.type = e.type === void 0 ? "" : e.type + "";
}
Ti.prototype.toString = function() {
  return this.fill + this.align + this.sign + this.symbol + (this.zero ? "0" : "") + (this.width === void 0 ? "" : Math.max(1, this.width | 0)) + (this.comma ? "," : "") + (this.precision === void 0 ? "" : "." + Math.max(0, this.precision | 0)) + (this.trim ? "~" : "") + this.type;
};
function Cf(e) {
  e: for (var t = e.length, n = 1, r = -1, a; n < t; ++n)
    switch (e[n]) {
      case ".":
        r = a = n;
        break;
      case "0":
        r === 0 && (r = n), a = n;
        break;
      default:
        if (!+e[n]) break e;
        r > 0 && (r = 0);
        break;
    }
  return r > 0 ? e.slice(0, r) + e.slice(a + 1) : e;
}
var ja;
function jf(e, t) {
  var n = Ca(e, t);
  if (!n) return ja = void 0, e.toPrecision(t);
  var r = n[0], a = n[1], s = a - (ja = Math.max(-8, Math.min(8, Math.floor(a / 3))) * 3) + 1, i = r.length;
  return s === i ? r : s > i ? r + new Array(s - i + 1).join("0") : s > 0 ? r.slice(0, s) + "." + r.slice(s) : "0." + new Array(1 - s).join("0") + Ca(e, Math.max(0, t + s - 1))[0];
}
function eo(e, t) {
  var n = Ca(e, t);
  if (!n) return e + "";
  var r = n[0], a = n[1];
  return a < 0 ? "0." + new Array(-a).join("0") + r : r.length > a + 1 ? r.slice(0, a + 1) + "." + r.slice(a + 1) : r + new Array(a - r.length + 2).join("0");
}
const to = {
  "%": (e, t) => (e * 100).toFixed(t),
  b: (e) => Math.round(e).toString(2),
  c: (e) => e + "",
  d: kf,
  e: (e, t) => e.toExponential(t),
  f: (e, t) => e.toFixed(t),
  g: (e, t) => e.toPrecision(t),
  o: (e) => Math.round(e).toString(8),
  p: (e, t) => eo(e * 100, t),
  r: eo,
  s: jf,
  X: (e) => Math.round(e).toString(16).toUpperCase(),
  x: (e) => Math.round(e).toString(16)
};
function no(e) {
  return e;
}
var ro = Array.prototype.map, ao = ["y", "z", "a", "f", "p", "n", "µ", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"];
function Df(e) {
  var t = e.grouping === void 0 || e.thousands === void 0 ? no : Sf(ro.call(e.grouping, Number), e.thousands + ""), n = e.currency === void 0 ? "" : e.currency[0] + "", r = e.currency === void 0 ? "" : e.currency[1] + "", a = e.decimal === void 0 ? "." : e.decimal + "", s = e.numerals === void 0 ? no : Tf(ro.call(e.numerals, String)), i = e.percent === void 0 ? "%" : e.percent + "", o = e.minus === void 0 ? "−" : e.minus + "", l = e.nan === void 0 ? "NaN" : e.nan + "";
  function u(v, f) {
    v = Is(v);
    var p = v.fill, g = v.align, y = v.sign, _ = v.symbol, S = v.zero, w = v.width, F = v.comma, R = v.precision, V = v.trim, N = v.type;
    N === "n" ? (F = !0, N = "g") : to[N] || (R === void 0 && (R = 12), V = !0, N = "g"), (S || p === "0" && g === "=") && (S = !0, p = "0", g = "=");
    var T = (f && f.prefix !== void 0 ? f.prefix : "") + (_ === "$" ? n : _ === "#" && /[boxX]/.test(N) ? "0" + N.toLowerCase() : ""), k = (_ === "$" ? r : /[%p]/.test(N) ? i : "") + (f && f.suffix !== void 0 ? f.suffix : ""), K = to[N], le = /[defgprs%]/.test(N);
    R = R === void 0 ? 6 : /[gprs]/.test(N) ? Math.max(1, Math.min(21, R)) : Math.max(0, Math.min(20, R));
    function ve(D) {
      var C = T, M = k, E, z, J;
      if (N === "c")
        M = K(D) + M, D = "";
      else {
        D = +D;
        var ge = D < 0 || 1 / D < 0;
        if (D = isNaN(D) ? l : K(Math.abs(D), R), V && (D = Cf(D)), ge && +D == 0 && y !== "+" && (ge = !1), C = (ge ? y === "(" ? y : o : y === "-" || y === "(" ? "" : y) + C, M = (N === "s" && !isNaN(D) && ja !== void 0 ? ao[8 + ja / 3] : "") + M + (ge && y === "(" ? ")" : ""), le) {
          for (E = -1, z = D.length; ++E < z; )
            if (J = D.charCodeAt(E), 48 > J || J > 57) {
              M = (J === 46 ? a + D.slice(E + 1) : D.slice(E)) + M, D = D.slice(0, E);
              break;
            }
        }
      }
      F && !S && (D = t(D, 1 / 0));
      var me = C.length + D.length + M.length, L = me < w ? new Array(w - me + 1).join(p) : "";
      switch (F && S && (D = t(L + D, L.length ? w - M.length : 1 / 0), L = ""), g) {
        case "<":
          D = C + D + M + L;
          break;
        case "=":
          D = C + L + D + M;
          break;
        case "^":
          D = L.slice(0, me = L.length >> 1) + C + D + M + L.slice(me);
          break;
        default:
          D = L + C + D + M;
          break;
      }
      return s(D);
    }
    return ve.toString = function() {
      return v + "";
    }, ve;
  }
  function d(v, f) {
    var p = Math.max(-8, Math.min(8, Math.floor(Ef(f) / 3))) * 3, g = Math.pow(10, -p), y = u((v = Is(v), v.type = "f", v), { suffix: ao[8 + p / 3] });
    return function(_) {
      return y(g * _);
    };
  }
  return {
    format: u,
    formatPrefix: d
  };
}
var la, Nl;
Af({
  thousands: ",",
  grouping: [3],
  currency: ["$", ""]
});
function Af(e) {
  return la = Df(e), Nl = la.format, la.formatPrefix, la;
}
const vs = /* @__PURE__ */ new Date(), ms = /* @__PURE__ */ new Date();
function Vt(e, t, n, r) {
  function a(s) {
    return e(s = arguments.length === 0 ? /* @__PURE__ */ new Date() : /* @__PURE__ */ new Date(+s)), s;
  }
  return a.floor = (s) => (e(s = /* @__PURE__ */ new Date(+s)), s), a.ceil = (s) => (e(s = new Date(s - 1)), t(s, 1), e(s), s), a.round = (s) => {
    const i = a(s), o = a.ceil(s);
    return s - i < o - s ? i : o;
  }, a.offset = (s, i) => (t(s = /* @__PURE__ */ new Date(+s), i == null ? 1 : Math.floor(i)), s), a.range = (s, i, o) => {
    const l = [];
    if (s = a.ceil(s), o = o == null ? 1 : Math.floor(o), !(s < i) || !(o > 0)) return l;
    let u;
    do
      l.push(u = /* @__PURE__ */ new Date(+s)), t(s, o), e(s);
    while (u < s && s < i);
    return l;
  }, a.filter = (s) => Vt((i) => {
    if (i >= i) for (; e(i), !s(i); ) i.setTime(i - 1);
  }, (i, o) => {
    if (i >= i)
      if (o < 0) for (; ++o <= 0; )
        for (; t(i, -1), !s(i); )
          ;
      else for (; --o >= 0; )
        for (; t(i, 1), !s(i); )
          ;
  }), n && (a.count = (s, i) => (vs.setTime(+s), ms.setTime(+i), e(vs), e(ms), Math.floor(n(vs, ms))), a.every = (s) => (s = Math.floor(s), !isFinite(s) || !(s > 0) ? null : s > 1 ? a.filter(r ? (i) => r(i) % s === 0 : (i) => a.count(0, i) % s === 0) : a)), a;
}
const Lf = 1e3, Mi = Lf * 60, Nf = Mi * 60, Wr = Nf * 24, Ul = Wr * 7, Ci = Vt(
  (e) => e.setHours(0, 0, 0, 0),
  (e, t) => e.setDate(e.getDate() + t),
  (e, t) => (t - e - (t.getTimezoneOffset() - e.getTimezoneOffset()) * Mi) / Wr,
  (e) => e.getDate() - 1
);
Ci.range;
const ji = Vt((e) => {
  e.setUTCHours(0, 0, 0, 0);
}, (e, t) => {
  e.setUTCDate(e.getUTCDate() + t);
}, (e, t) => (t - e) / Wr, (e) => e.getUTCDate() - 1);
ji.range;
const Uf = Vt((e) => {
  e.setUTCHours(0, 0, 0, 0);
}, (e, t) => {
  e.setUTCDate(e.getUTCDate() + t);
}, (e, t) => (t - e) / Wr, (e) => Math.floor(e / Wr));
Uf.range;
function Pn(e) {
  return Vt((t) => {
    t.setDate(t.getDate() - (t.getDay() + 7 - e) % 7), t.setHours(0, 0, 0, 0);
  }, (t, n) => {
    t.setDate(t.getDate() + n * 7);
  }, (t, n) => (n - t - (n.getTimezoneOffset() - t.getTimezoneOffset()) * Mi) / Ul);
}
const Ol = Pn(0), Da = Pn(1), Of = Pn(2), Ff = Pn(3), wr = Pn(4), qf = Pn(5), Rf = Pn(6);
Ol.range;
Da.range;
Of.range;
Ff.range;
wr.range;
qf.range;
Rf.range;
function zn(e) {
  return Vt((t) => {
    t.setUTCDate(t.getUTCDate() - (t.getUTCDay() + 7 - e) % 7), t.setUTCHours(0, 0, 0, 0);
  }, (t, n) => {
    t.setUTCDate(t.getUTCDate() + n * 7);
  }, (t, n) => (n - t) / Ul);
}
const Fl = zn(0), Aa = zn(1), If = zn(2), Pf = zn(3), xr = zn(4), zf = zn(5), Vf = zn(6);
Fl.range;
Aa.range;
If.range;
Pf.range;
xr.range;
zf.range;
Vf.range;
const qn = Vt((e) => {
  e.setMonth(0, 1), e.setHours(0, 0, 0, 0);
}, (e, t) => {
  e.setFullYear(e.getFullYear() + t);
}, (e, t) => t.getFullYear() - e.getFullYear(), (e) => e.getFullYear());
qn.every = (e) => !isFinite(e = Math.floor(e)) || !(e > 0) ? null : Vt((t) => {
  t.setFullYear(Math.floor(t.getFullYear() / e) * e), t.setMonth(0, 1), t.setHours(0, 0, 0, 0);
}, (t, n) => {
  t.setFullYear(t.getFullYear() + n * e);
});
qn.range;
const Rn = Vt((e) => {
  e.setUTCMonth(0, 1), e.setUTCHours(0, 0, 0, 0);
}, (e, t) => {
  e.setUTCFullYear(e.getUTCFullYear() + t);
}, (e, t) => t.getUTCFullYear() - e.getUTCFullYear(), (e) => e.getUTCFullYear());
Rn.every = (e) => !isFinite(e = Math.floor(e)) || !(e > 0) ? null : Vt((t) => {
  t.setUTCFullYear(Math.floor(t.getUTCFullYear() / e) * e), t.setUTCMonth(0, 1), t.setUTCHours(0, 0, 0, 0);
}, (t, n) => {
  t.setUTCFullYear(t.getUTCFullYear() + n * e);
});
Rn.range;
function so(e, t) {
  return e == null || t == null ? NaN : e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
class Yf extends Map {
  constructor(t, n = Bf) {
    if (super(), Object.defineProperties(this, { _intern: { value: /* @__PURE__ */ new Map() }, _key: { value: n } }), t != null) for (const [r, a] of t) this.set(r, a);
  }
  get(t) {
    return super.get(io(this, t));
  }
  has(t) {
    return super.has(io(this, t));
  }
  set(t, n) {
    return super.set(Hf(this, t), n);
  }
  delete(t) {
    return super.delete(Wf(this, t));
  }
}
function io({ _intern: e, _key: t }, n) {
  const r = t(n);
  return e.has(r) ? e.get(r) : n;
}
function Hf({ _intern: e, _key: t }, n) {
  const r = t(n);
  return e.has(r) ? e.get(r) : (e.set(r, n), n);
}
function Wf({ _intern: e, _key: t }, n) {
  const r = t(n);
  return e.has(r) && (n = e.get(r), e.delete(r)), n;
}
function Bf(e) {
  return e !== null && typeof e == "object" ? e.valueOf() : e;
}
function Gf(e) {
  return e;
}
function Kf(e, t, ...n) {
  return Zf(e, Gf, t, n);
}
function Zf(e, t, n, r) {
  return (function a(s, i) {
    if (i >= r.length) return n(s);
    const o = new Yf(), l = r[i++];
    let u = -1;
    for (const d of s) {
      const v = l(d, ++u, s), f = o.get(v);
      f ? f.push(d) : o.set(v, [d]);
    }
    for (const [d, v] of o)
      o.set(d, a(v, i));
    return t(o);
  })(e, 0);
}
function ql(e, t) {
  return Array.from(t, (n) => e[n]);
}
function Rl(e, ...t) {
  if (typeof e[Symbol.iterator] != "function") throw new TypeError("values is not iterable");
  e = Array.from(e);
  let [n] = t;
  if (n && n.length !== 2 || t.length > 1) {
    const r = Uint32Array.from(e, (a, s) => s);
    return t.length > 1 ? (t = t.map((a) => e.map(a)), r.sort((a, s) => {
      for (const i of t) {
        const o = Ps(i[a], i[s]);
        if (o) return o;
      }
    })) : (n = e.map(n), r.sort((a, s) => Ps(n[a], n[s]))), ql(e, r);
  }
  return e.sort(Jf(n));
}
function Jf(e = so) {
  if (e === so) return Ps;
  if (typeof e != "function") throw new TypeError("compare is not a function");
  return (t, n) => {
    const r = e(t, n);
    return r || r === 0 ? r : (e(n, n) === 0) - (e(t, t) === 0);
  };
}
function Ps(e, t) {
  return (e == null || !(e >= e)) - (t == null || !(t >= t)) || (e < t ? -1 : e > t ? 1 : 0);
}
function Il(e, t) {
  let n = 0;
  if (t === void 0)
    for (let r of e)
      (r = +r) && (n += r);
  else {
    let r = -1;
    for (let a of e)
      (a = +t(a, ++r, e)) && (n += a);
  }
  return n;
}
function ps(e) {
  if (0 <= e.y && e.y < 100) {
    var t = new Date(-1, e.m, e.d, e.H, e.M, e.S, e.L);
    return t.setFullYear(e.y), t;
  }
  return new Date(e.y, e.m, e.d, e.H, e.M, e.S, e.L);
}
function gs(e) {
  if (0 <= e.y && e.y < 100) {
    var t = new Date(Date.UTC(-1, e.m, e.d, e.H, e.M, e.S, e.L));
    return t.setUTCFullYear(e.y), t;
  }
  return new Date(Date.UTC(e.y, e.m, e.d, e.H, e.M, e.S, e.L));
}
function jr(e, t, n) {
  return { y: e, m: t, d: n, H: 0, M: 0, S: 0, L: 0 };
}
function $f(e) {
  var t = e.dateTime, n = e.date, r = e.time, a = e.periods, s = e.days, i = e.shortDays, o = e.months, l = e.shortMonths, u = Dr(a), d = Ar(a), v = Dr(s), f = Ar(s), p = Dr(i), g = Ar(i), y = Dr(o), _ = Ar(o), S = Dr(l), w = Ar(l), F = {
    a: J,
    A: ge,
    b: me,
    B: L,
    c: null,
    d: ho,
    e: ho,
    f: bd,
    g: Dd,
    G: Ld,
    H: gd,
    I: _d,
    j: yd,
    L: Pl,
    m: wd,
    M: xd,
    p: ae,
    q: Pe,
    Q: po,
    s: go,
    S: kd,
    u: Ed,
    U: Sd,
    V: Td,
    w: Md,
    W: Cd,
    x: null,
    X: null,
    y: jd,
    Y: Ad,
    Z: Nd,
    "%": mo
  }, R = {
    a: _t,
    A: st,
    b: se,
    B: Te,
    c: null,
    d: vo,
    e: vo,
    f: qd,
    g: Gd,
    G: Zd,
    H: Ud,
    I: Od,
    j: Fd,
    L: Vl,
    m: Rd,
    M: Id,
    p: pe,
    q: Me,
    Q: po,
    s: go,
    S: Pd,
    u: zd,
    U: Vd,
    V: Yd,
    w: Hd,
    W: Wd,
    x: null,
    X: null,
    y: Bd,
    Y: Kd,
    Z: Jd,
    "%": mo
  }, V = {
    a: le,
    A: ve,
    b: D,
    B: C,
    c: M,
    d: co,
    e: co,
    f: hd,
    g: uo,
    G: lo,
    H: fo,
    I: fo,
    j: ud,
    L: dd,
    m: ld,
    M: cd,
    p: K,
    q: od,
    Q: md,
    s: pd,
    S: fd,
    u: nd,
    U: rd,
    V: ad,
    w: td,
    W: sd,
    x: E,
    X: z,
    y: uo,
    Y: lo,
    Z: id,
    "%": vd
  };
  F.x = N(n, F), F.X = N(r, F), F.c = N(t, F), R.x = N(n, R), R.X = N(r, R), R.c = N(t, R);
  function N(A, H) {
    return function(X) {
      var x = [], xe = -1, ne = 0, ze = A.length, Qe, vn, Ri;
      for (X instanceof Date || (X = /* @__PURE__ */ new Date(+X)); ++xe < ze; )
        A.charCodeAt(xe) === 37 && (x.push(A.slice(ne, xe)), (vn = oo[Qe = A.charAt(++xe)]) != null ? Qe = A.charAt(++xe) : vn = Qe === "e" ? " " : "0", (Ri = H[Qe]) && (Qe = Ri(X, vn)), x.push(Qe), ne = xe + 1);
      return x.push(A.slice(ne, xe)), x.join("");
    };
  }
  function T(A, H) {
    return function(X) {
      var x = jr(1900, void 0, 1), xe = k(x, A, X += "", 0), ne, ze;
      if (xe != X.length) return null;
      if ("Q" in x) return new Date(x.Q);
      if ("s" in x) return new Date(x.s * 1e3 + ("L" in x ? x.L : 0));
      if (H && !("Z" in x) && (x.Z = 0), "p" in x && (x.H = x.H % 12 + x.p * 12), x.m === void 0 && (x.m = "q" in x ? x.q : 0), "V" in x) {
        if (x.V < 1 || x.V > 53) return null;
        "w" in x || (x.w = 1), "Z" in x ? (ne = gs(jr(x.y, 0, 1)), ze = ne.getUTCDay(), ne = ze > 4 || ze === 0 ? Aa.ceil(ne) : Aa(ne), ne = ji.offset(ne, (x.V - 1) * 7), x.y = ne.getUTCFullYear(), x.m = ne.getUTCMonth(), x.d = ne.getUTCDate() + (x.w + 6) % 7) : (ne = ps(jr(x.y, 0, 1)), ze = ne.getDay(), ne = ze > 4 || ze === 0 ? Da.ceil(ne) : Da(ne), ne = Ci.offset(ne, (x.V - 1) * 7), x.y = ne.getFullYear(), x.m = ne.getMonth(), x.d = ne.getDate() + (x.w + 6) % 7);
      } else ("W" in x || "U" in x) && ("w" in x || (x.w = "u" in x ? x.u % 7 : "W" in x ? 1 : 0), ze = "Z" in x ? gs(jr(x.y, 0, 1)).getUTCDay() : ps(jr(x.y, 0, 1)).getDay(), x.m = 0, x.d = "W" in x ? (x.w + 6) % 7 + x.W * 7 - (ze + 5) % 7 : x.w + x.U * 7 - (ze + 6) % 7);
      return "Z" in x ? (x.H += x.Z / 100 | 0, x.M += x.Z % 100, gs(x)) : ps(x);
    };
  }
  function k(A, H, X, x) {
    for (var xe = 0, ne = H.length, ze = X.length, Qe, vn; xe < ne; ) {
      if (x >= ze) return -1;
      if (Qe = H.charCodeAt(xe++), Qe === 37) {
        if (Qe = H.charAt(xe++), vn = V[Qe in oo ? H.charAt(xe++) : Qe], !vn || (x = vn(A, X, x)) < 0) return -1;
      } else if (Qe != X.charCodeAt(x++))
        return -1;
    }
    return x;
  }
  function K(A, H, X) {
    var x = u.exec(H.slice(X));
    return x ? (A.p = d.get(x[0].toLowerCase()), X + x[0].length) : -1;
  }
  function le(A, H, X) {
    var x = p.exec(H.slice(X));
    return x ? (A.w = g.get(x[0].toLowerCase()), X + x[0].length) : -1;
  }
  function ve(A, H, X) {
    var x = v.exec(H.slice(X));
    return x ? (A.w = f.get(x[0].toLowerCase()), X + x[0].length) : -1;
  }
  function D(A, H, X) {
    var x = S.exec(H.slice(X));
    return x ? (A.m = w.get(x[0].toLowerCase()), X + x[0].length) : -1;
  }
  function C(A, H, X) {
    var x = y.exec(H.slice(X));
    return x ? (A.m = _.get(x[0].toLowerCase()), X + x[0].length) : -1;
  }
  function M(A, H, X) {
    return k(A, t, H, X);
  }
  function E(A, H, X) {
    return k(A, n, H, X);
  }
  function z(A, H, X) {
    return k(A, r, H, X);
  }
  function J(A) {
    return i[A.getDay()];
  }
  function ge(A) {
    return s[A.getDay()];
  }
  function me(A) {
    return l[A.getMonth()];
  }
  function L(A) {
    return o[A.getMonth()];
  }
  function ae(A) {
    return a[+(A.getHours() >= 12)];
  }
  function Pe(A) {
    return 1 + ~~(A.getMonth() / 3);
  }
  function _t(A) {
    return i[A.getUTCDay()];
  }
  function st(A) {
    return s[A.getUTCDay()];
  }
  function se(A) {
    return l[A.getUTCMonth()];
  }
  function Te(A) {
    return o[A.getUTCMonth()];
  }
  function pe(A) {
    return a[+(A.getUTCHours() >= 12)];
  }
  function Me(A) {
    return 1 + ~~(A.getUTCMonth() / 3);
  }
  return {
    format: function(A) {
      var H = N(A += "", F);
      return H.toString = function() {
        return A;
      }, H;
    },
    parse: function(A) {
      var H = T(A += "", !1);
      return H.toString = function() {
        return A;
      }, H;
    },
    utcFormat: function(A) {
      var H = N(A += "", R);
      return H.toString = function() {
        return A;
      }, H;
    },
    utcParse: function(A) {
      var H = T(A += "", !0);
      return H.toString = function() {
        return A;
      }, H;
    }
  };
}
var oo = { "-": "", _: " ", 0: "0" }, Le = /^\s*\d+/, Qf = /^%/, Xf = /[\\^$*+?|[\]().{}]/g;
function te(e, t, n) {
  var r = e < 0 ? "-" : "", a = (r ? -e : e) + "", s = a.length;
  return r + (s < n ? new Array(n - s + 1).join(t) + a : a);
}
function ed(e) {
  return e.replace(Xf, "\\$&");
}
function Dr(e) {
  return new RegExp("^(?:" + e.map(ed).join("|") + ")", "i");
}
function Ar(e) {
  return new Map(e.map((t, n) => [t.toLowerCase(), n]));
}
function td(e, t, n) {
  var r = Le.exec(t.slice(n, n + 1));
  return r ? (e.w = +r[0], n + r[0].length) : -1;
}
function nd(e, t, n) {
  var r = Le.exec(t.slice(n, n + 1));
  return r ? (e.u = +r[0], n + r[0].length) : -1;
}
function rd(e, t, n) {
  var r = Le.exec(t.slice(n, n + 2));
  return r ? (e.U = +r[0], n + r[0].length) : -1;
}
function ad(e, t, n) {
  var r = Le.exec(t.slice(n, n + 2));
  return r ? (e.V = +r[0], n + r[0].length) : -1;
}
function sd(e, t, n) {
  var r = Le.exec(t.slice(n, n + 2));
  return r ? (e.W = +r[0], n + r[0].length) : -1;
}
function lo(e, t, n) {
  var r = Le.exec(t.slice(n, n + 4));
  return r ? (e.y = +r[0], n + r[0].length) : -1;
}
function uo(e, t, n) {
  var r = Le.exec(t.slice(n, n + 2));
  return r ? (e.y = +r[0] + (+r[0] > 68 ? 1900 : 2e3), n + r[0].length) : -1;
}
function id(e, t, n) {
  var r = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(t.slice(n, n + 6));
  return r ? (e.Z = r[1] ? 0 : -(r[2] + (r[3] || "00")), n + r[0].length) : -1;
}
function od(e, t, n) {
  var r = Le.exec(t.slice(n, n + 1));
  return r ? (e.q = r[0] * 3 - 3, n + r[0].length) : -1;
}
function ld(e, t, n) {
  var r = Le.exec(t.slice(n, n + 2));
  return r ? (e.m = r[0] - 1, n + r[0].length) : -1;
}
function co(e, t, n) {
  var r = Le.exec(t.slice(n, n + 2));
  return r ? (e.d = +r[0], n + r[0].length) : -1;
}
function ud(e, t, n) {
  var r = Le.exec(t.slice(n, n + 3));
  return r ? (e.m = 0, e.d = +r[0], n + r[0].length) : -1;
}
function fo(e, t, n) {
  var r = Le.exec(t.slice(n, n + 2));
  return r ? (e.H = +r[0], n + r[0].length) : -1;
}
function cd(e, t, n) {
  var r = Le.exec(t.slice(n, n + 2));
  return r ? (e.M = +r[0], n + r[0].length) : -1;
}
function fd(e, t, n) {
  var r = Le.exec(t.slice(n, n + 2));
  return r ? (e.S = +r[0], n + r[0].length) : -1;
}
function dd(e, t, n) {
  var r = Le.exec(t.slice(n, n + 3));
  return r ? (e.L = +r[0], n + r[0].length) : -1;
}
function hd(e, t, n) {
  var r = Le.exec(t.slice(n, n + 6));
  return r ? (e.L = Math.floor(r[0] / 1e3), n + r[0].length) : -1;
}
function vd(e, t, n) {
  var r = Qf.exec(t.slice(n, n + 1));
  return r ? n + r[0].length : -1;
}
function md(e, t, n) {
  var r = Le.exec(t.slice(n));
  return r ? (e.Q = +r[0], n + r[0].length) : -1;
}
function pd(e, t, n) {
  var r = Le.exec(t.slice(n));
  return r ? (e.s = +r[0], n + r[0].length) : -1;
}
function ho(e, t) {
  return te(e.getDate(), t, 2);
}
function gd(e, t) {
  return te(e.getHours(), t, 2);
}
function _d(e, t) {
  return te(e.getHours() % 12 || 12, t, 2);
}
function yd(e, t) {
  return te(1 + Ci.count(qn(e), e), t, 3);
}
function Pl(e, t) {
  return te(e.getMilliseconds(), t, 3);
}
function bd(e, t) {
  return Pl(e, t) + "000";
}
function wd(e, t) {
  return te(e.getMonth() + 1, t, 2);
}
function xd(e, t) {
  return te(e.getMinutes(), t, 2);
}
function kd(e, t) {
  return te(e.getSeconds(), t, 2);
}
function Ed(e) {
  var t = e.getDay();
  return t === 0 ? 7 : t;
}
function Sd(e, t) {
  return te(Ol.count(qn(e) - 1, e), t, 2);
}
function zl(e) {
  var t = e.getDay();
  return t >= 4 || t === 0 ? wr(e) : wr.ceil(e);
}
function Td(e, t) {
  return e = zl(e), te(wr.count(qn(e), e) + (qn(e).getDay() === 4), t, 2);
}
function Md(e) {
  return e.getDay();
}
function Cd(e, t) {
  return te(Da.count(qn(e) - 1, e), t, 2);
}
function jd(e, t) {
  return te(e.getFullYear() % 100, t, 2);
}
function Dd(e, t) {
  return e = zl(e), te(e.getFullYear() % 100, t, 2);
}
function Ad(e, t) {
  return te(e.getFullYear() % 1e4, t, 4);
}
function Ld(e, t) {
  var n = e.getDay();
  return e = n >= 4 || n === 0 ? wr(e) : wr.ceil(e), te(e.getFullYear() % 1e4, t, 4);
}
function Nd(e) {
  var t = e.getTimezoneOffset();
  return (t > 0 ? "-" : (t *= -1, "+")) + te(t / 60 | 0, "0", 2) + te(t % 60, "0", 2);
}
function vo(e, t) {
  return te(e.getUTCDate(), t, 2);
}
function Ud(e, t) {
  return te(e.getUTCHours(), t, 2);
}
function Od(e, t) {
  return te(e.getUTCHours() % 12 || 12, t, 2);
}
function Fd(e, t) {
  return te(1 + ji.count(Rn(e), e), t, 3);
}
function Vl(e, t) {
  return te(e.getUTCMilliseconds(), t, 3);
}
function qd(e, t) {
  return Vl(e, t) + "000";
}
function Rd(e, t) {
  return te(e.getUTCMonth() + 1, t, 2);
}
function Id(e, t) {
  return te(e.getUTCMinutes(), t, 2);
}
function Pd(e, t) {
  return te(e.getUTCSeconds(), t, 2);
}
function zd(e) {
  var t = e.getUTCDay();
  return t === 0 ? 7 : t;
}
function Vd(e, t) {
  return te(Fl.count(Rn(e) - 1, e), t, 2);
}
function Yl(e) {
  var t = e.getUTCDay();
  return t >= 4 || t === 0 ? xr(e) : xr.ceil(e);
}
function Yd(e, t) {
  return e = Yl(e), te(xr.count(Rn(e), e) + (Rn(e).getUTCDay() === 4), t, 2);
}
function Hd(e) {
  return e.getUTCDay();
}
function Wd(e, t) {
  return te(Aa.count(Rn(e) - 1, e), t, 2);
}
function Bd(e, t) {
  return te(e.getUTCFullYear() % 100, t, 2);
}
function Gd(e, t) {
  return e = Yl(e), te(e.getUTCFullYear() % 100, t, 2);
}
function Kd(e, t) {
  return te(e.getUTCFullYear() % 1e4, t, 4);
}
function Zd(e, t) {
  var n = e.getUTCDay();
  return e = n >= 4 || n === 0 ? xr(e) : xr.ceil(e), te(e.getUTCFullYear() % 1e4, t, 4);
}
function Jd() {
  return "+0000";
}
function mo() {
  return "%";
}
function po(e) {
  return +e;
}
function go(e) {
  return Math.floor(+e / 1e3);
}
var Hn, Hl, dn;
$d({
  dateTime: "%x, %X",
  date: "%-m/%-d/%Y",
  time: "%-I:%M:%S %p",
  periods: ["AM", "PM"],
  days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
});
function $d(e) {
  return Hn = $f(e), Hl = Hn.format, Hn.parse, dn = Hn.utcFormat, Hn.utcParse, Hn;
}
Nl(".2f");
const Wl = dn("%Y-%m-%d");
dn("%Y"), dn("%b %Y"), dn("%GW%V");
dn("%Y"), dn("%Y-%m"), dn("%G-W%V");
Hl("%Y-%m-%d");
const Kn = class Kn {
  constructor(t, n, r, a) {
    m(this, "number");
    m(this, "currency");
    m(this, "date");
    m(this, "label");
    this.number = t, this.currency = n, this.date = r, this.label = a;
  }
  /** Render to a string. */
  str(t) {
    const n = [t.amount(this.number, this.currency)];
    return this.date && n.push(Wl(this.date)), this.label != null && this.label && n.push(`"${this.label}"`), n.join(", ");
  }
};
m(Kn, "raw_validator", W({
  number: Se,
  currency: b,
  date: we(Ct),
  label: qs
})), m(Kn, "validator", (t) => Kn.raw_validator(t).map(
  ({ number: n, currency: r, date: a, label: s }) => new Kn(n, r, a, s)
));
let zs = Kn;
function Qd(e) {
  return Object.keys(e).length === 0;
}
const Xd = (e) => be(typeof e == "boolean" || typeof e == "number" || typeof e == "string" ? e : "Unsupported metadata value");
function eh(e) {
  return typeof e == "boolean" ? e ? "TRUE" : "FALSE" : typeof e == "string" ? e : e.toString();
}
function th(e) {
  return e === "TRUE" ? !0 : e === "FALSE" ? !1 : e;
}
var tt, dt;
let Oe = (dt = class {
  constructor(t) {
    q(this, tt);
    I(this, tt, t ?? {});
  }
  /** Whether the metadata is empty. */
  is_empty() {
    return Qd(c(this, tt));
  }
  /** Get the filename, falling back to an empty string if missing. */
  get filename() {
    var t;
    return ((t = c(this, tt).filename) == null ? void 0 : t.toString()) ?? "";
  }
  /** Get the line number as a string, falling back to an empty string if missing. */
  get lineno() {
    var t;
    return ((t = c(this, tt).lineno) == null ? void 0 : t.toString()) ?? "";
  }
  toJSON() {
    return c(this, tt);
  }
  /** Delete a key from the metadata and return an updated copy. */
  delete(t) {
    const { [t]: n, ...r } = c(this, tt);
    return new dt(r);
  }
  /** All metadata entries (values as strings), filtering out hidden ones. */
  entries() {
    return Object.entries(c(this, tt)).filter(
      ([t]) => !t.startsWith("_") && t !== "filename" && t !== "lineno"
    ).map(([t, n]) => [t, eh(n)]);
  }
  /** Get the value for a key. */
  get(t) {
    return c(this, tt)[t];
  }
  /** Set the value for a key and return an updated copy. */
  set(t, n) {
    return new dt({ ...c(this, tt), [t]: n });
  }
  /** Set the value for a key from a string and return an updated copy. */
  set_string(t, n) {
    return this.set(t, th(n));
  }
  /** Add a new empty key and value and return an updated copy. */
  add() {
    return this.set("", "");
  }
  /** Change a key and a return an updated copy. */
  update_key(t, n) {
    return new dt(
      Object.fromEntries(
        Object.entries(c(this, tt)).map(([r, a]) => [
          r === t ? n : r,
          a
        ])
      )
    );
  }
}, tt = new WeakMap(), m(dt, "raw_validator", Ye(Xd)), m(dt, "validator", (t) => dt.raw_validator(t).map((n) => new dt(n))), dt);
const Zn = class Zn {
  constructor(t, n) {
    m(this, "units");
    m(this, "cost");
    this.units = t, this.cost = n;
  }
};
m(Zn, "raw_validator", W({
  units: Ma.validator,
  cost: we(zs.validator)
})), m(Zn, "validator", (t) => Zn.raw_validator(t).map(
  ({ units: n, cost: r }) => new Zn(n, r)
));
let Vs = Zn;
var kt;
let Bl = (kt = class {
  constructor(t, n, r) {
    m(this, "meta");
    m(this, "account");
    m(this, "amount");
    this.meta = t, this.account = n, this.amount = r;
  }
  /** Create a new empty Posting. */
  static empty() {
    return new kt(new Oe(), "", "");
  }
  is_empty() {
    return !this.account && !this.amount && this.meta.is_empty();
  }
  /** Set a property and return an updated copy. */
  set(t, n) {
    const r = new kt(this.meta, this.account, this.amount);
    return r[t] = n, r;
  }
}, m(kt, "raw_validator", W({
  meta: Ei(Oe.validator, () => new Oe()),
  account: b,
  amount: b
})), m(kt, "validator", (t) => kt.raw_validator(t).map(
  ({ meta: n, account: r, amount: a }) => new kt(n, r, a)
)), kt);
const Ys = Q(b), Br = we(Ys);
class Dt {
  constructor(t, n, r, a) {
    m(this, "t");
    m(this, "meta");
    m(this, "date");
    m(this, "entry_hash");
    this.t = t, this.meta = n, this.date = r, this.entry_hash = a;
  }
  /** Clone. */
  clone() {
    return Object.assign(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      Object.create(Object.getPrototypeOf(this)),
      this
    );
  }
  /** Set a property and return an updated copy. */
  set(t, n) {
    const r = this.clone();
    return r[t] = n, r;
  }
  /** Set the value for a key and return an updated copy. */
  set_meta(t, n) {
    const r = this.clone();
    return r.meta = this.meta.set(t, n), r;
  }
  /** Check whether the given entry is marked as duplicate (used in imports). */
  is_duplicate() {
    const t = this.meta.get("__duplicate__");
    return t != null && t !== !1;
  }
}
var Nt;
let Gl = (Nt = class extends Dt {
  constructor(n, r, a, s, i) {
    super("Balance", n, r, a);
    m(this, "account");
    m(this, "amount");
    this.account = s, this.amount = i;
  }
  /** Create a new empty Balance entry on the date. */
  static empty(n) {
    return new Nt(new Oe(), n, "", "", Hr.empty());
  }
}, m(Nt, "raw_validator", W({
  t: gt("Balance"),
  meta: Oe.validator,
  date: b,
  entry_hash: b,
  account: b,
  amount: Hr.validator
})), m(Nt, "validator", (n) => Nt.raw_validator(n).map(
  ({ date: r, meta: a, account: s, amount: i, entry_hash: o }) => new Nt(a, r, o, s, i)
)), Nt);
const Jn = class Jn extends Dt {
  constructor(n, r, a, s, i, o, l) {
    super("Document", n, r, a);
    m(this, "account");
    m(this, "filename");
    m(this, "tags");
    m(this, "links");
    this.account = s, this.filename = i, this.tags = o, this.links = l;
  }
};
m(Jn, "raw_validator", W({
  t: gt("Document"),
  meta: Oe.validator,
  date: b,
  entry_hash: b,
  account: b,
  filename: b,
  tags: Br,
  links: Br
})), m(Jn, "validator", (n) => Jn.raw_validator(n).map(
  ({ date: r, meta: a, account: s, filename: i, entry_hash: o, tags: l, links: u }) => new Jn(a, r, o, s, i, l, u)
));
let Hs = Jn;
const $n = class $n extends Dt {
  constructor(n, r, a, s, i) {
    super("Event", n, r, a);
    m(this, "type");
    m(this, "description");
    this.type = s, this.description = i;
  }
};
m($n, "raw_validator", W({
  t: gt("Event"),
  meta: Oe.validator,
  date: b,
  entry_hash: b,
  type: b,
  description: b
})), m($n, "validator", (n) => $n.raw_validator(n).map(
  ({ meta: r, date: a, entry_hash: s, type: i, description: o }) => new $n(r, a, s, i, o)
));
let Ws = $n;
var Ut;
let Kl = (Ut = class extends Dt {
  constructor(n, r, a, s, i, o, l) {
    super("Note", n, r, a);
    m(this, "account");
    m(this, "comment");
    m(this, "tags");
    m(this, "links");
    this.account = s, this.comment = i, this.tags = o, this.links = l;
  }
  /** Create a new empty Note entry on the date. */
  static empty(n) {
    return new Ut(new Oe(), n, "", "", "", null, null);
  }
}, m(Ut, "raw_validator", W({
  t: gt("Note"),
  meta: Oe.validator,
  date: b,
  entry_hash: b,
  account: b,
  comment: b,
  tags: Br,
  links: Br
})), m(Ut, "validator", (n) => Ut.raw_validator(n).map(
  ({ meta: r, date: a, entry_hash: s, account: i, comment: o, tags: l, links: u }) => new Ut(r, a, s, i, o, l, u)
)), Ut);
const Qn = class Qn extends Dt {
  constructor(n, r, a, s, i, o) {
    super("Open", n, r, a);
    m(this, "account");
    m(this, "currencies");
    m(this, "booking");
    this.account = s, this.currencies = i, this.booking = o;
  }
};
m(Qn, "raw_validator", W({
  t: gt("Open"),
  meta: Oe.validator,
  date: b,
  entry_hash: b,
  account: b,
  currencies: Br,
  booking: we(b)
})), m(Qn, "validator", (n) => Qn.raw_validator(n).map(
  ({ meta: r, date: a, entry_hash: s, account: i, currencies: o, booking: l }) => new Qn(r, a, s, i, o, l)
));
let Bs = Qn;
const Xn = class Xn extends Dt {
  constructor(n, r, a, s) {
    super("Close", n, r, a);
    m(this, "account");
    this.account = s;
  }
};
m(Xn, "raw_validator", W({
  t: gt("Close"),
  meta: Oe.validator,
  date: b,
  entry_hash: b,
  account: b
})), m(Xn, "validator", (n) => Xn.raw_validator(n).map(
  ({ meta: r, date: a, entry_hash: s, account: i }) => new Xn(r, a, s, i)
));
let Gs = Xn;
const er = class er extends Dt {
  constructor(n, r, a, s, i) {
    super("Price", n, r, a);
    m(this, "currency");
    m(this, "amount");
    this.currency = s, this.amount = i;
  }
};
m(er, "raw_validator", W({
  t: gt("Price"),
  meta: Oe.validator,
  date: b,
  entry_hash: b,
  currency: b,
  amount: Hr.validator
})), m(er, "validator", (n) => er.raw_validator(n).map(
  ({ meta: r, date: a, entry_hash: s, currency: i, amount: o }) => new er(r, a, s, i, o)
));
let Ks = er;
const tr = class tr extends Dt {
  constructor(n, r, a, s, i) {
    super("Pad", n, r, a);
    m(this, "account");
    m(this, "source_account");
    this.account = s, this.source_account = i;
  }
};
m(tr, "raw_validator", W({
  t: gt("Pad"),
  meta: Oe.validator,
  date: b,
  entry_hash: b,
  account: b,
  source_account: b
})), m(tr, "validator", (n) => tr.raw_validator(n).map(
  ({ meta: r, date: a, entry_hash: s, account: i, source_account: o }) => new tr(r, a, s, i, o)
));
let Zs = tr;
const nr = class nr extends Dt {
  constructor(n, r, a, s, i) {
    super("Query", n, r, a);
    m(this, "name");
    m(this, "query_string");
    this.name = s, this.query_string = i;
  }
};
m(nr, "raw_validator", W({
  t: gt("Query"),
  meta: Oe.validator,
  date: b,
  entry_hash: b,
  name: b,
  query_string: b
})), m(nr, "validator", (n) => nr.raw_validator(n).map(
  ({ meta: r, date: a, entry_hash: s, name: i, query_string: o }) => new nr(r, a, s, i, o)
));
let Js = nr;
const rr = class rr extends Dt {
  constructor(n, r, a, s, i) {
    super("Custom", n, r, a);
    m(this, "type");
    // This is the custom directive type string
    m(this, "values");
    this.type = s, this.values = i;
  }
};
m(rr, "raw_validator", W({
  t: gt("Custom"),
  meta: Oe.validator,
  date: b,
  entry_hash: b,
  type: b,
  values: Q(Al)
})), m(rr, "validator", (n) => rr.raw_validator(n).map(
  ({ meta: r, date: a, entry_hash: s, type: i, values: o }) => new rr(r, a, s, i, o)
));
let $s = rr;
const _o = /(?:^|\s)#([A-Za-z0-9\-_/.]+)/g, yo = /(?:^|\s)\^([A-Za-z0-9\-_/.]+)/g;
var Et;
let Xa = (Et = class extends Dt {
  constructor(n, r, a, s, i, o, l, u, d) {
    super("Transaction", n, r, a);
    m(this, "flag");
    m(this, "payee");
    m(this, "narration");
    m(this, "tags");
    m(this, "links");
    m(this, "postings");
    this.flag = s, this.payee = i, this.narration = o, this.tags = l, this.links = u, this.postings = d;
  }
  /** Create a new empty Transaction entry on the date. */
  static empty(n) {
    return new Et(
      new Oe(),
      n,
      "",
      "*",
      "",
      "",
      [],
      [],
      []
    );
  }
  /** Combine narration, tags, and links for a single `<input>`. */
  get_narration_tags_links() {
    let n = this.narration;
    return this.tags.length && (n += ` ${this.tags.map((r) => `#${r}`).join(" ")}`), this.links.length && (n += ` ${this.links.map((r) => `^${r}`).join(" ")}`), n;
  }
  /** Set narration, tags, and links from a single string. */
  set_narration_tags_links(n) {
    const r = [...n.matchAll(_o)].map((i) => i[1] ?? ""), a = [...n.matchAll(yo)].map((i) => i[1] ?? ""), s = n.replaceAll(_o, "").replaceAll(yo, "").trim();
    return new Et(
      this.meta,
      this.date,
      this.entry_hash,
      this.flag,
      this.payee,
      s,
      r,
      a,
      this.postings
    );
  }
  toString() {
    const n = this.postings.map((r) => `  ${r.account}  ${r.amount}`);
    return `${this.date} ${this.flag} "${this.payee}" "${this.narration}"
${n.join(`
`)}`;
  }
  toJSON() {
    return {
      t: this.t,
      meta: this.meta,
      date: this.date,
      entry_hash: this.entry_hash,
      flag: this.flag,
      payee: this.payee,
      narration: this.narration,
      tags: this.tags,
      links: this.links,
      postings: this.postings.filter((n) => !n.is_empty())
    };
  }
}, m(Et, "raw_validator", W({
  t: gt("Transaction"),
  meta: Oe.validator,
  date: b,
  entry_hash: b,
  flag: b,
  payee: qs,
  narration: qs,
  tags: Ys,
  links: Ys,
  postings: Q(Bl.validator)
})), m(Et, "validator", (n) => Et.raw_validator(n).map(
  ({
    meta: r,
    date: a,
    entry_hash: s,
    flag: i,
    payee: o,
    narration: l,
    tags: u,
    links: d,
    postings: v
  }) => new Et(
    r,
    a,
    s,
    i,
    o,
    l,
    u,
    d,
    v
  )
)), Et);
const nh = Si("t", {
  Balance: Gl.validator,
  Close: Gs.validator,
  Custom: $s.validator,
  Document: Hs.validator,
  Event: Ws.validator,
  Note: Kl.validator,
  Open: Bs.validator,
  Pad: Zs.validator,
  Price: Ks.validator,
  Query: Js.validator,
  Transaction: Xa.validator
}), _s = /* @__PURE__ */ new Map(), Zl = (
  // This still seems to be the least bad way to check whether we are running on macOS or iOS
  navigator.platform.startsWith("Mac") || navigator.platform === "iPhone"
);
function rh(e) {
  return typeof e == "string" ? e : Zl ? e.mac ?? e.key : e.key;
}
function ah(e) {
  if (typeof e == "string")
    return e;
  const t = Zl ? e.mac ?? e.key : e.key;
  return e.note != null ? `${t} - ${e.note}` : t;
}
function sh(e, t) {
  const n = rh(e);
  return n.split(" ").length > 2 && console.error("Only key sequences of length <=2 are supported: ", n), _s.has(n) && console.warn("Duplicate keyboard shortcut: ", n, t), _s.set(n, t), () => {
    _s.delete(n);
  };
}
const ih = (e) => e == null ? null : (t) => {
  t.setAttribute("data-key", ah(e));
  const n = sh(e, t);
  return () => {
    n(), t.removeAttribute("data-key");
  };
};
function oh(e, t) {
  if ((e === e.toLowerCase() ? t.toLowerCase().indexOf(e) : t.indexOf(e)) > -1)
    return e.length ** 2;
  let a = 0, s = 0, i = 0;
  for (const o of t) {
    const l = e[i];
    o === l || o.toLowerCase() === l ? (i += 1, s += 1) : s = 0, a += s;
  }
  return i === e.length ? a : 0;
}
function lh(e, t) {
  return e ? t.map((n) => [n, oh(e, n)]).filter(([, n]) => n > 0).sort((n, r) => r[1] - n[1]).map(([n]) => n) : t;
}
function uh(e, t) {
  if (!e)
    return [["text", t]];
  const r = e === e.toLowerCase() ? t.toLowerCase().indexOf(e) : t.indexOf(e);
  if (r > -1) {
    const l = t.slice(0, r), u = t.slice(r, r + e.length), d = t.slice(r + e.length), v = [];
    return l && v.push(["text", l]), v.push(["match", u]), d && v.push(["text", d]), v;
  }
  let a = 0, s = null, i = null;
  const o = [];
  for (const l of t) {
    const u = e[a];
    l === u || l.toLowerCase() === u ? (i = i != null ? i + l : l, s != null && (o.push(["text", s]), s = null), a += 1) : (s = s != null ? s + l : l, i != null && (o.push(["match", i]), i = null));
  }
  return a < e.length ? [["text", t]] : (s != null && o.push(["text", s]), i != null && o.push(["match", i]), o);
}
var ch = /* @__PURE__ */ ee('<button type="button" class="muted round svelte-hwd910">×</button>'), fh = /* @__PURE__ */ ee('<span class="svelte-hwd910"> </span>'), dh = /* @__PURE__ */ ee('<li role="option"></li>'), hh = /* @__PURE__ */ ee('<ul role="listbox" class="svelte-hwd910"></ul>'), vh = /* @__PURE__ */ ee('<span class="svelte-hwd910"><input type="text" autocomplete="off" role="combobox" class="svelte-hwd910"/> <!> <!></span>');
const mh = {
  hash: "svelte-hwd910",
  code: `span.svelte-hwd910 {position:relative;display:inline-block;flex:var(--autocomplete-wrapper-flex, initial);}input.svelte-hwd910 {width:100%;}ul.svelte-hwd910 {position:var(--autocomplete-list-position, absolute);z-index:var(--z-index-autocomplete);overflow:hidden auto;background-color:var(--background);border:1px solid var(--border-darker);box-shadow:var(--box-shadow-dropdown);}li.svelte-hwd910 {min-width:8rem;padding:0 0.5em;white-space:nowrap;cursor:pointer;}li.selected.svelte-hwd910,
  li.svelte-hwd910:hover {color:var(--background);background-color:var(--link-color);}button.svelte-hwd910 {position:absolute;top:8px;right:4px;background:transparent;}li.svelte-hwd910 span:where(.svelte-hwd910) {height:1.2em;padding:0 0.05em;margin:0 -0.05em;background-color:var(--autocomplete-match);border-radius:2px;}

  @media print {button.svelte-hwd910 {display:none;}
  }`
};
function Gr(e, t) {
  const n = Lc();
  Fe(t, !0), rt(e, mh);
  let r = $e(t, "value", 15), a = $e(t, "setSize", 3, !1), s = $e(t, "clearButton", 3, !1);
  const i = `combobox-autocomplete-${n}`;
  let o = /* @__PURE__ */ re(!0), l = /* @__PURE__ */ re(-1), u = /* @__PURE__ */ re(void 0), d = /* @__PURE__ */ ie(() => a() ? Math.max(r().length, t.placeholder.length) + 1 : void 0), v = /* @__PURE__ */ ie(() => h(u) && t.valueExtractor ? t.valueExtractor(r(), h(u)) : r()), f = /* @__PURE__ */ ie(() => {
    var k;
    const T = lh(h(v), t.suggestions).slice(0, 30).map((K) => ({
      suggestion: K,
      fuzzywrapped: uh(h(v), K)
    }));
    return T.length === 1 && ((k = T[0]) == null ? void 0 : k.suggestion) === h(v) ? [] : T;
  });
  lr(() => {
    var k;
    const T = t.checkValidity ? t.checkValidity(r()) : "";
    (k = h(u)) == null || k.setCustomValidity(T);
  }), _c(() => {
    O(l, Math.min(h(l), h(f).length - 1));
  });
  function p(T) {
    var k;
    r(h(u) && t.valueSelector ? t.valueSelector(T, h(u)) : T), h(u) && ((k = t.onSelect) == null || k.call(t, h(u))), O(o, !0);
  }
  function g(T, k) {
    T.button === 0 && p(k);
  }
  let y = /* @__PURE__ */ ie(() => !h(o) && h(f).length > 0);
  function _(T) {
    var k, K;
    if (T.key === "Enter") {
      const le = (k = h(f)[h(l)]) == null ? void 0 : k.suggestion;
      h(l) > -1 && !h(o) && le != null ? (T.preventDefault(), p(le)) : h(u) && ((K = t.onEnter) == null || K.call(t, h(u)));
    } else T.key === " " && T.ctrlKey ? O(o, !1) : T.key === "Escape" ? (T.stopPropagation(), h(y) ? (O(l, -1), O(o, !0)) : r("")) : T.key === "ArrowUp" ? (T.preventDefault(), O(l, h(l) === 0 ? h(f).length - 1 : h(l) - 1)) : T.key === "ArrowDown" && (T.preventDefault(), O(l, h(l) === h(f).length - 1 ? 0 : h(l) + 1));
  }
  var S = vh(), w = U(S);
  jl(w, (T) => O(u, T), () => h(u)), Ml(w, () => ih(t.key));
  var F = j(w, 2);
  {
    var R = (T) => {
      var k = ch();
      ke(k, "tabindex", -1), ce("click", k, () => {
        var K;
        r(""), h(u) && ((K = t.onSelect) == null || K.call(t, h(u)));
      }), B(T, k);
    };
    Ee(F, (T) => {
      s() && r() && T(R);
    });
  }
  var V = j(F, 2);
  {
    var N = (T) => {
      var k = hh();
      br(k, 23, () => h(f), ({ fuzzywrapped: K, suggestion: le }) => le, (K, le, ve) => {
        let D = () => h(le).fuzzywrapped, C = () => h(le).suggestion;
        var M = dh();
        let E;
        br(M, 21, D, _i, (z, J, ge, me) => {
          var L = /* @__PURE__ */ ie(() => Oo(h(J), 2));
          let ae = () => h(L)[0], Pe = () => h(L)[1];
          var _t = sa(), st = Re(_t);
          {
            var se = (pe) => {
              var Me = Ja();
              fe(() => ue(Me, Pe())), B(pe, Me);
            }, Te = (pe) => {
              var Me = fh(), A = U(Me);
              fe(() => ue(A, Pe())), B(pe, Me);
            };
            Ee(st, (pe) => {
              ae() === "text" ? pe(se) : pe(Te, -1);
            });
          }
          B(z, _t);
        }), fe(() => {
          ke(M, "aria-selected", h(ve) === h(l)), E = $a(M, 1, "svelte-hwd910", null, E, { selected: h(ve) === h(l) });
        }), ce("mousedown", M, (z) => {
          g(z, C());
        }), B(K, M);
      }), fe(() => {
        ke(k, "hidden", h(o)), ke(k, "id", i);
      }), B(T, k);
    };
    Ee(V, (T) => {
      h(f).length && T(N);
    });
  }
  fe(() => {
    ke(w, "aria-expanded", h(y)), ke(w, "aria-controls", i), ke(w, "placeholder", t.placeholder), w.required = t.required, ke(w, "size", h(d));
  }), an("blur", w, (T) => {
    var k;
    O(o, !0), (k = t.onBlur) == null || k.call(t, T.currentTarget);
  }), an("focus", w, () => {
    O(o, !1);
  }), ce("input", w, () => {
    O(o, !1);
  }), ce("keydown", w, _), hn(w, r), B(e, S), qe();
}
zt(["input", "keydown", "click", "mousedown"]);
function ph(e) {
  try {
    return be(JSON.parse(e));
  } catch (t) {
    if (t instanceof SyntaxError)
      return ye(t);
    throw t;
  }
}
class gh extends Error {
  constructor(t) {
    super(`<script> tag not found for selector '${t}'`);
  }
}
function _h(e) {
  const t = document.querySelector(e);
  return t ? ph(t.textContent) : ye(new gh(e));
}
function Di(e, t) {
  return _h(e).and_then(t);
}
function yh(e) {
  return e instanceof Node ? e instanceof Element ? e : e.parentElement : null;
}
function Qt(...e) {
  console.error(...e);
}
let ys;
const bh = Ye(b);
function de(e) {
  if (ys === void 0) {
    const t = (
      // The DOM is not available in tests
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      globalThis.document !== void 0 ? Di("#translations", bh) : be({})
    );
    ys = t.unwrap_or({}), t.is_err && Qt("Loading translations failed:", t.error);
  }
  return ys[e] ?? e;
}
function wh(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e) {
    let r = n.indexOf(":");
    for (; r !== -1; )
      t.add(n.slice(0, r)), r = n.indexOf(":", r + 1);
  }
  return Rl(t);
}
function xh(e, t) {
  const n = e.length;
  if (n !== t.length)
    return !1;
  for (let r = 0; r < n; r += 1)
    if (e[r] !== t[r])
      return !1;
  return !0;
}
function at(e, t) {
  let n = [];
  return Y(
    e,
    (r, a) => {
      const s = t(r);
      xh(n, s) || (a(s), n = s);
    },
    n
  );
}
const bo = Intl.Collator(), es = bo.compare.bind(bo);
function kh(e, t) {
  return Ai(e, t, es, 1);
}
function Ai(e, t, n, r) {
  const a = Uint32Array.from(e, (i, o) => o), s = e.map(t);
  return a.sort((i, o) => r * n(s[i], s[o])), ql(e, a);
}
class Eh {
  constructor(t, n) {
    m(this, "compare", (t, n) => t - n);
    m(this, "name");
    m(this, "value");
    this.name = t, this.value = n;
  }
  sort(t, n) {
    return Ai(t, this.value, this.compare, n);
  }
}
class Sh {
  constructor(t, n) {
    m(this, "compare", es);
    m(this, "name");
    m(this, "value");
    this.name = t, this.value = n;
  }
  sort(t, n) {
    return Ai(t, this.value, this.compare, n);
  }
}
const Ie = nn();
Y(Ie, (e) => e.precisions);
Y(Ie, (e) => e.have_excel);
Y(Ie, (e) => e.incognito);
const ts = Y(Ie, (e) => e.base_url), Th = Y(Ie, (e) => e.extensions), Li = at(Ie, (e) => e.accounts), Mh = Y(
  Li,
  (e) => new Set(e)
), Ch = at(Li, wh);
Y(
  Ie,
  ({ currency_names: e }) => (t) => e[t] ?? t
);
const jh = Y(Ie, (e) => e.account_details), Ni = at(Ie, (e) => e.currencies);
at(Ie, (e) => e.links);
const Dh = at(Ie, (e) => e.payees);
at(Ie, (e) => e.tags);
at(Ie, (e) => e.years);
at(
  Ni,
  (e) => e.toSorted(es)
);
const Ge = Y(Ie, (e) => e.fava_options);
at(
  Ge,
  (e) => e.conversion_currencies
);
Y(
  Ge,
  (e) => e.locale
);
const Ah = at(
  Ge,
  (e) => e.collapse_pattern
);
Y(
  Ge,
  (e) => e.import_config
);
const Lh = Y(
  Ge,
  (e) => e.invert_income_liabilities_equity
);
Y(
  Ge,
  (e) => e.show_accounts_with_zero_balance
);
Y(
  Ge,
  (e) => e.show_accounts_with_zero_transactions
);
Y(
  Ge,
  (e) => e.show_closed_accounts
);
Y(
  Ge,
  (e) => e.uptodate_indicator_grey_lookback_days
);
Y(
  Ge,
  (e) => e.currency_column
);
Y(
  Ge,
  (e) => e.indent
);
const Nh = Y(
  Ge,
  (e) => e.use_external_editor
);
Y(
  Ge,
  (e) => e.auto_reload
);
Y(
  Ge,
  (e) => e.invert_gains_losses_colors
);
Y(
  Ge,
  (e) => e.insert_entry
);
const Yt = Y(Ie, (e) => e.options);
Y(Yt, (e) => e.title);
at(
  Yt,
  (e) => e.operating_currency.toSorted(es)
);
const Uh = Y(Yt, (e) => e.filename), Oh = at(Yt, (e) => e.include);
Y(
  [Uh, Oh],
  ([e, t]) => /* @__PURE__ */ new Set([e, ...t])
);
at(
  Yt,
  (e) => e.documents
);
Y(Yt, (e) => e.name_assets);
const Fh = Y(Yt, (e) => e.name_equity);
Y(
  Yt,
  (e) => e.name_expenses
);
const qh = Y(Yt, (e) => e.name_income), Rh = Y(
  Yt,
  (e) => e.name_liabilities
), Ih = Y(
  [Ah, Ch],
  ([e, t]) => {
    const n = e.map((r) => new RegExp(r));
    return t.filter(
      (r) => n.some((a) => a.test(r))
    );
  }
), Ph = nn(/* @__PURE__ */ new Map());
Y(
  [Ih, Ph],
  ([e, t]) => {
    const n = new Set(e);
    for (const [r, a] of t)
      a ? n.add(r) : n.delete(r);
    return n;
  }
);
Y(
  [
    Lh,
    qh,
    Rh,
    Fh
  ],
  ([
    e,
    t,
    n,
    r
  ]) => e ? (a) => a.startsWith(t) || a.startsWith(n) || a.startsWith(r) || a === de("Net Profit") : () => !1
);
const zh = Y(
  [jh],
  ([e]) => (t, n) => {
    var a;
    const r = (a = e[t]) == null ? void 0 : a.close_date;
    return r ? n == null ? !0 : r < n : !1;
  }
);
function Ui(e, t) {
  Fe(t, !0);
  const n = () => or(Mh, "$accounts_set", s), r = () => or(Li, "$accounts", s), a = () => or(zh, "$is_closed_account", s), [s, i] = Wa();
  let o = $e(t, "value", 15), l = /* @__PURE__ */ ie(() => (f) => !n().size || n().has(f) || t.required !== !0 && !f ? "" : de("Should be one of the declared accounts")), u = /* @__PURE__ */ ie(() => Ct(t.date).unwrap_or(null)), d = /* @__PURE__ */ ie(() => t.suggestions ?? r()), v = /* @__PURE__ */ ie(() => h(u) ? h(d).filter((f) => !a()(f, h(u))) : h(d));
  {
    let f = /* @__PURE__ */ ie(() => de("Account"));
    Gr(e, {
      get placeholder() {
        return h(f);
      },
      get checkValidity() {
        return h(l);
      },
      get required() {
        return t.required;
      },
      get suggestions() {
        return h(v);
      },
      get value() {
        return o();
      },
      set value(p) {
        o(p);
      }
    });
  }
  qe(), i();
}
var Vh = /* @__PURE__ */ ee('<button type="button" class="muted round">m</button>');
function ns(e, t) {
  Fe(t, !0);
  let n = $e(t, "meta", 15);
  var r = Vh();
  ke(r, "tabindex", -1), fe((a) => ke(r, "title", a), [() => de("Add metadata")]), ce("click", r, () => {
    n(n().add());
  }), B(e, r), qe();
}
zt(["click"]);
var Yh = /* @__PURE__ */ ee('<button type="button" class="muted round">+</button>'), Hh = /* @__PURE__ */ ee('<div class="flex-row svelte-fgo96w"><button type="button" class="muted round remove-row">×</button> <input type="text" class="key svelte-fgo96w" required=""/> : <input type="text" class="value svelte-fgo96w"/> <!></div>');
const Wh = {
  hash: "svelte-fgo96w",
  code: `div.svelte-fgo96w {padding-left:3rem;}input.key.svelte-fgo96w {width:12rem;}input.value.svelte-fgo96w {flex-grow:1;}

  @media (width <= 767px) {div.svelte-fgo96w {padding-left:0;}
  }`
};
function rs(e, t) {
  Fe(t, !0), rt(e, Wh);
  let n = $e(t, "meta", 15), r = /* @__PURE__ */ ie(() => n().entries());
  var a = sa(), s = Re(a);
  br(s, 17, () => h(r), _i, (i, o, l) => {
    var u = /* @__PURE__ */ ie(() => Oo(h(o), 2));
    let d = () => h(u)[0], v = () => h(u)[1];
    var f = Hh(), p = U(f);
    ke(p, "tabindex", -1);
    var g = j(p, 2), y = j(g, 2), _ = j(y, 2);
    {
      var S = (w) => {
        var F = Yh();
        fe(
          (R, V) => {
            ke(F, "aria-label", R), ke(F, "title", V);
          },
          [() => de("Add metadata"), () => de("Add metadata")]
        ), ce("click", F, () => {
          n(n().add());
        }), B(w, F);
      };
      Ee(_, (w) => {
        l === h(r).length - 1 && d() && w(S);
      });
    }
    fe(
      (w, F) => {
        ke(g, "placeholder", w), Ji(g, d()), ke(y, "placeholder", F), Ji(y, v());
      },
      [() => de("Key"), () => de("Value")]
    ), ce("click", p, () => {
      n(n().delete(d()));
    }), ce("change", g, (w) => {
      n(n().update_key(d(), w.currentTarget.value));
    }), ce("change", y, (w) => {
      n(n().set_string(d(), w.currentTarget.value));
    }), B(i, f);
  }), B(e, a), qe();
}
zt(["click", "change"]);
var Bh = /* @__PURE__ */ ee('<div class="flex-row"><input type="date" required=""/> <h4> </h4> <svelte-css-wrapper style="display: contents"><!></svelte-css-wrapper> <input type="tel" pattern="-?[0-9.,]*" required=""/> <svelte-css-wrapper style="display: contents"><!></svelte-css-wrapper> <!></div> <!>', 1);
function Gh(e, t) {
  Fe(t, !0);
  const n = () => or(Ni, "$currencies", r), [r, a] = Wa();
  let s = $e(t, "entry", 15);
  var i = Bh(), o = Re(i), l = U(o), u = j(l, 2), d = U(u), v = j(u, 2), f = () => s().account, p = (k) => {
    s(s().set("account", k));
  };
  Fn(v, () => ({ "--autocomplete-wrapper-flex": "1" })), Ui(v.lastChild, {
    get value() {
      return f();
    },
    set value(k) {
      p(k);
    },
    get date() {
      return s().date;
    },
    required: !0
  });
  var g = j(v, 2);
  ke(g, "size", 10);
  var y = j(g, 2), _ = () => s().amount.currency, S = (k) => {
    s(s().set("amount", s().amount.set_currency(k)));
  };
  {
    let k = /* @__PURE__ */ ie(() => de("Currency"));
    Fn(y, () => ({ "--autocomplete-wrapper-flex": "0 6em" })), Gr(y.lastChild, {
      get placeholder() {
        return h(k);
      },
      get suggestions() {
        return n();
      },
      get value() {
        return _();
      },
      set value(K) {
        S(K);
      },
      required: !0
    });
  }
  var w = j(y, 2), F = () => s().meta, R = (k) => {
    s(s().set("meta", k));
  };
  ns(w, {
    get meta() {
      return F();
    },
    set meta(k) {
      R(k);
    }
  });
  var V = j(o, 2), N = () => s().meta, T = (k) => {
    s(s().set("meta", k));
  };
  rs(V, {
    get meta() {
      return N();
    },
    set meta(k) {
      T(k);
    }
  }), fe(
    (k, K) => {
      ue(d, k), ke(g, "placeholder", K);
    },
    [() => de("Balance"), () => de("Number")]
  ), hn(l, () => s().date, (k) => {
    s(s().set("date", k));
  }), hn(g, () => s().amount.number, (k) => {
    s(s().set("amount", s().amount.set_number(k)));
  }), B(e, i), qe(), a();
}
var Kh = /* @__PURE__ */ ee('<div class="flex-row"><input type="date" name="date" required=""/> <h4> </h4> <svelte-css-wrapper style="display: contents"><!></svelte-css-wrapper> <!></div> <textarea placeholder="Comment" class="svelte-2oo4ux"></textarea> <!>', 1);
const Zh = {
  hash: "svelte-2oo4ux",
  code: "textarea.svelte-2oo4ux {resize:vertical;}"
};
function Jh(e, t) {
  Fe(t, !0), rt(e, Zh);
  let n = $e(t, "entry", 15);
  var r = Kh(), a = Re(r), s = U(a), i = j(s, 2), o = U(i), l = j(i, 2), u = () => n().account, d = (w) => {
    n(n().set("account", w));
  };
  Fn(l, () => ({ "--autocomplete-wrapper-flex": "1" })), Ui(l.lastChild, {
    get value() {
      return u();
    },
    set value(w) {
      d(w);
    },
    get date() {
      return n().date;
    },
    required: !0
  });
  var v = j(l, 2), f = () => n().meta, p = (w) => {
    n(n().set("meta", w));
  };
  ns(v, {
    get meta() {
      return f();
    },
    set meta(w) {
      p(w);
    }
  });
  var g = j(a, 2);
  ke(g, "rows", 2);
  var y = j(g, 2), _ = () => n().meta, S = (w) => {
    n(n().set("meta", w));
  };
  rs(y, {
    get meta() {
      return _();
    },
    set meta(w) {
      S(w);
    }
  }), fe((w) => ue(o, w), [() => de("Note")]), hn(s, () => n().date, (w) => {
    n(n().set("date", w));
  }), hn(g, () => n().comment, (w) => {
    n(n().set("comment", w));
  }), B(e, r), qe();
}
class Jl extends Error {
}
class $l extends Jl {
  constructor(n, r) {
    super(
      n != null ? `HTTP ${r.toString()} - ${n}` : `HTTP ${r.toString()}`
    );
    m(this, "status");
    this.status = r;
  }
}
class $h extends Jl {
  constructor(t) {
    super(`Invalid response: ${t}`);
  }
}
const Qh = W({ error: b });
async function Xh(e, t) {
  const n = await fetch(e, t), r = await n.json().catch(() => null);
  if (!n.ok)
    throw new $l(
      Qh(r).map((a) => a.error).unwrap_or(null),
      n.status
    );
  if (!Qa(r))
    throw new $h("Not a valid JSON object");
  return r;
}
async function ev(e, t) {
  const n = await fetch(e, t);
  if (!n.ok) {
    const r = await n.text().catch(() => null);
    throw new $l(r, n.status);
  }
  return n.text();
}
function Oi(e) {
  const t = e.message;
  return e.cause instanceof Error ? `${t}
  Caused by: ${Oi(e.cause)}` : e.message;
}
class tv extends Error {
  constructor() {
    super("INTERNAL ERROR: error of invalid type.");
  }
}
function nv(e) {
  if (!(e instanceof Error))
    throw Qt(e), new tv();
}
const rv = /* @__PURE__ */ (() => {
  let e = null;
  return () => {
    var n;
    e == null && (e = document.createElement("div"), e.className = "notifications", e.style.right = "10px", document.body.appendChild(e));
    const t = ((n = document.querySelector("header")) == null ? void 0 : n.getBoundingClientRect().height) ?? 50;
    return e.style.top = `${(t + 10).toString()}px`, e;
  };
})();
function av(e, t = "info", n) {
  const r = document.createElement("li");
  r.classList.add(t), r.appendChild(document.createTextNode(e)), rv().append(r), r.addEventListener("click", () => {
    r.remove();
  }), setTimeout(() => {
    r.remove();
  }, 5e3);
}
function Qs(e, t = Oi) {
  e instanceof Error && av(t(e), "error"), Qt(e);
}
const sv = Ll(
  "bool",
  "date",
  "int",
  "object",
  "set",
  "str",
  "Amount",
  "Decimal",
  "Inventory",
  "Position"
), iv = W({
  dtype: sv,
  name: b
}), ov = W({
  types: Q(iv),
  rows: Q(Q(Al))
}), lv = we(Ye(Se)), Fa = class Fa {
  constructor(t) {
    m(this, "value");
    this.value = t;
  }
};
m(Fa, "validator", (t) => lv(t).map((n) => new Fa(n ?? {})));
let Xs = Fa;
class bs extends Sh {
  constructor(n, r, a, s) {
    super(n.name, (i) => s(i[r]));
    m(this, "dtype");
    m(this, "index");
    m(this, "validator");
    this.index = r, this.validator = a, this.dtype = n.dtype;
  }
}
class Lr extends Eh {
  constructor(n, r, a, s) {
    super(n.name, (i) => s(i[r]));
    m(this, "dtype");
    m(this, "index");
    m(this, "validator");
    this.index = r, this.validator = a, this.dtype = n.dtype;
  }
}
function uv(e, t) {
  switch (e.dtype) {
    case "bool":
      return new bs(
        e,
        t,
        ft,
        (n) => n.toString()
      );
    case "date":
      return new Lr(
        e,
        t,
        we(Ct),
        (n) => n == null ? 0 : +n
      );
    case "int":
    case "Decimal":
      return new Lr(
        e,
        t,
        we(Se),
        (n) => n ?? 0
      );
    case "set":
      return new bs(
        e,
        t,
        Q(b),
        (n) => n.join(",")
      );
    case "object":
    case "str":
      return new bs(
        e,
        t,
        Ei(b, () => ""),
        (n) => n
      );
    case "Amount":
      return new Lr(
        e,
        t,
        Ma.validator,
        (n) => n.number
      );
    case "Inventory":
      return new Lr(
        e,
        t,
        Xs.validator,
        (n) => Il(Object.values(n.value))
      );
    case "Position":
      return new Lr(
        e,
        t,
        Vs.validator,
        (n) => n.units.number
      );
    default:
      return e.dtype;
  }
}
const cv = (e) => ov(e).and_then(({ types: t, rows: n }) => {
  const r = t.map(uv), a = r.map((i) => i.validator);
  return Qi(
    n.map(
      (i) => Qi(a.map((o, l) => o(i[l])))
    )
  ).map((i) => ({ t: "table", columns: r, rows: i }));
}), fv = Si("t", {
  string: W({ t: gt("string"), contents: b }),
  table: cv
}), dv = "month", hv = [
  "year",
  "quarter",
  "month",
  "week",
  "day"
];
function vv(e) {
  return hv.includes(e) ? e : dv;
}
const Kr = nn();
Y(Kr, (e) => e.hash.slice(1));
Y(Kr, (e) => e.pathname);
const mv = Y(Kr, (e) => e.search), as = Y(
  mv,
  (e) => new URLSearchParams(e)
);
Y(
  as,
  (e) => e.get("charts") !== "false"
);
Y(
  as,
  (e) => e.get("conversion") ?? "at_cost"
);
Y(
  as,
  (e) => vv(e.get("interval"))
);
const pv = [
  "account",
  "charts",
  "conversion",
  "filter",
  "interval",
  "time"
], gv = Y(as, (e) => {
  const t = new URLSearchParams();
  for (const n of pv) {
    const r = e.get(n);
    r != null && r && t.set(n, r);
  }
  return t;
});
class _v extends Error {
  constructor(t, n) {
    super(`Path '${t}' not relative to base url '${n}'.`);
  }
}
function Ql(e) {
  const { pathname: t } = e, n = Sr(ts);
  return n && t.startsWith(n) ? be(decodeURI(t.slice(n.length))) : ye(new _v(t, n));
}
function Xl(e, t, n, r) {
  const a = `${e}${n}`, s = t ? new URLSearchParams(t) : new URLSearchParams();
  return r && Object.entries(r).forEach(([o, l]) => {
    l != null && s.set(o, l.toString());
  }), s.toString() ? `${a}?${s.toString()}` : a;
}
const eu = Y(
  [ts, gv],
  ([e, t]) => (n, r) => Xl(e, t, n, r)
), tu = Y(
  [ts],
  ([e]) => (t, n) => Xl(e, null, t, n)
);
Y(
  [eu, Nh],
  ([e, t]) => (n, r) => t ? `beancount://${n}?lineno=${r}` : e("editor/", { file_path: n, line: r })
);
Y(
  eu,
  (e) => (t, n) => e(`account/${t}/`, n)
);
var Xr;
class yv {
  constructor(t) {
    /** The extension name. */
    q(this, Xr);
    I(this, Xr, t);
  }
  async request(t, n, r, a, s = "json") {
    const o = Sr(tu)(`extension/${c(this, Xr)}/${t}`, r);
    let l = {};
    a != null && (l = a instanceof FormData ? { body: a } : {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(a)
    });
    const u = await fetch(o, { method: n, ...l });
    return s === "json" ? u.json() : s === "string" ? u.text() : u;
  }
  async get(t, n) {
    return this.request(t, "GET", n, void 0);
  }
  async put(t, n) {
    return this.request(t, "PUT", void 0, n);
  }
  async post(t, n) {
    return this.request(t, "POST", void 0, n);
  }
  async delete(t) {
    return this.request(t, "DELETE");
  }
}
Xr = new WeakMap();
var kn, En;
class bv {
  constructor(t, n) {
    q(this, kn);
    q(this, En);
    I(this, kn, t), I(this, En, n);
  }
  async init() {
    var t, n;
    await ((n = (t = c(this, kn)).init) == null ? void 0 : n.call(t, c(this, En)));
  }
  onPageLoad() {
    var t, n;
    (n = (t = c(this, kn)).onPageLoad) == null || n.call(t, c(this, En));
  }
  onExtensionPageLoad() {
    var t, n;
    (n = (t = c(this, kn)).onExtensionPageLoad) == null || n.call(t, c(this, En));
  }
}
kn = new WeakMap(), En = new WeakMap();
async function wv(e) {
  const r = await import(Sr(tu)(`extension_js_module/${e}.js`));
  if (typeof r.default == "object")
    return new bv(r.default, { api: new yv(e) });
  throw new Error(
    `Error importing module for extension ${e}: module must export "default" object`
  );
}
const wo = /* @__PURE__ */ new Map();
async function xo(e) {
  const t = wo.get(e);
  if (t)
    return t;
  const n = wv(e);
  return wo.set(e, n), await (await n).init(), n;
}
function ko() {
  const e = Sr(Th).filter((n) => n.has_js_module);
  for (const { name: n } of e)
    xo(n).then((r) => {
      r.onPageLoad();
    }).catch(Qt);
  const t = Ql(window.location).unwrap_or("");
  if (t.startsWith("extension/"))
    for (const { name: n } of e)
      t.startsWith(`extension/${n}`) && xo(n).then((r) => {
        r.onExtensionPageLoad();
      }).catch(Qt);
}
const xv = nn(BigInt("0"));
function nu(e) {
  const t = e.startsWith("X") ? (
    // the timestamp is replaced by a sequence of `X` in incognito mode.
    BigInt(e.replaceAll("X", "1"))
  ) : BigInt(e);
  xv.update((n) => t > n ? t : n);
}
function kv() {
  const e = document.getElementById("ledger-mtime"), t = e == null ? void 0 : e.textContent;
  t != null && (e == null || e.remove(), nu(t));
}
var Ev = /* @__PURE__ */ ee('<h2> </h2> <pre class="svelte-1nxrt1c"> </pre>', 1);
const Sv = {
  hash: "svelte-1nxrt1c",
  code: "pre.svelte-1nxrt1c {color:var(--error);}"
};
function Tv(e, t) {
  Fe(t, !0), rt(e, Sv);
  var n = Ev(), r = Re(n), a = U(r), s = j(r, 2), i = U(s);
  fe(
    (o) => {
      ue(a, `Loading ${t.title ?? ""} failed with error:`), ue(i, o);
    },
    [() => Oi(t.error)]
  ), B(e, n), qe();
}
class ru {
  /**
   * A succesfully rendered report.
   * @param route - The route that is rendered.
   * @param url - The URL that is rendered.
   * @param title - The title for this report.
   */
  constructor(t, n, r, a) {
    m(this, "route");
    m(this, "url");
    m(this, "title");
    m(this, "destroy");
    this.route = t, this.url = n, this.title = r, this.destroy = a;
  }
}
class Eo extends ru {
  constructor(t, n, r) {
    const a = Di("#page-title", b).unwrap_or(
      "ERROR: reading #page-title failed."
    );
    super(t, n, a, () => {
      r.innerHTML = "";
    });
  }
}
class Mv {
  async render(t, n, r, a) {
    if (r == null)
      return new Eo(this, n, t);
    const s = new URL(n);
    s.searchParams.set("partial", "true");
    const i = await ev(s);
    return r.route !== this && r.destroy(), a == null || a(), t.innerHTML = i, kv(), new Eo(this, n, t);
  }
}
class Cv {
  constructor(t) {
    m(this, "error");
    this.error = t;
  }
  render(t, n, r, a) {
    r == null || r.destroy(), a == null || a();
    const s = El(Tv, {
      target: t,
      props: { title: n.pathname, error: this.error }
    });
    return new ru(this, n, de("Error"), () => {
      Sl(s);
    });
  }
}
const jv = new Mv(), au = nn(""), Dv = nn(!1);
Y(
  au,
  (e) => e.startsWith("account:") ? {
    title: e.slice(8),
    type: "account"
  } : { title: e, type: "plain" }
);
const Av = (e) => e.button === 0 && !e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey, Lv = (e) => e.hasAttribute("data-remote") || e instanceof HTMLAnchorElement && (e.host !== window.location.host || !e.protocol.startsWith("http")), At = "navigation" in globalThis ? navigation : null;
function Nv(e, t, n) {
  n ? e.searchParams.set(t, n) : e.searchParams.delete(t);
}
var Sn;
class Uv {
  constructor() {
    m(this, "is_loading");
    q(this, Sn);
    I(this, Sn, nn(/* @__PURE__ */ new Set())), this.is_loading = Y(c(this, Sn), (t) => t.size > 0);
  }
  /**
   * Run the given async function, showing a loading indicator for its duration.
   */
  async run(t) {
    const n = t();
    return this.await(n);
  }
  /**
   * Await the given promise, showing a loading indicator for its duration.
   */
  async await(t) {
    const n = Symbol();
    try {
      return c(this, Sn).update((r) => {
        const a = new Set(r);
        return a.add(n), a;
      }), await t;
    } finally {
      c(this, Sn).update((r) => {
        const a = new Set(r);
        return a.delete(n), a;
      });
    }
  }
}
Sn = new WeakMap();
const su = new Uv();
su.is_loading;
var ln, Tn, ea, Mn, Cn, vt, ei, ti, qa, Ra, Ia, Pa, _a;
class Ov {
  constructor() {
    q(this, vt);
    /** The current URL - internal, should always be accessed by getter/setter. */
    q(this, ln);
    /** The <article> element. */
    q(this, Tn);
    /** The frontend rendered routes. */
    q(this, ea, []);
    /** The currently rendered route. */
    q(this, Mn);
    /**
     * Function to intercept navigation, e.g., when there are unsaved changes.
     *
     * If they return a string, that is displayed to the user in an alert to
     * confirm navigation.
     */
    q(this, Cn, /* @__PURE__ */ new Set());
    q(this, qa, () => (t) => {
      G(this, vt, ei).call(this) != null && t.preventDefault();
    });
    q(this, Ra, () => {
      const t = new URL(window.location.href), { current: n } = this;
      t.pathname !== n.pathname || t.search !== n.search ? G(this, vt, _a).call(this, t).catch(Qt) : this.current = t;
    });
    /*
     * Intercept all clicks on links (<a>) and .navigate() to the link instead.
     *
     * Doesn't intercept if
     *  - a button different from the main button is used,
     *  - a modifier key is pressed,
     *  - the link starts with a hash '#', or
     *  - the link has a `data-remote` attribute.
     */
    q(this, Ia, (t) => {
      var a, s;
      const n = (a = yh(t.target)) == null ? void 0 : a.closest("a");
      if (!(n instanceof HTMLAnchorElement || n instanceof SVGAElement) || !Av(t) || t.defaultPrevented || ((s = n.getAttribute("href")) == null ? void 0 : s.charAt(0)) === "#" || Lv(n))
        return;
      t.preventDefault();
      const r = n instanceof HTMLAnchorElement ? n.href : n.href.baseVal;
      this.navigate(r);
    });
    /**
     * Synchronize the current URL if an external router (e.g. an extension module with its own router) pushes or replaces a history entry.
     * Navigating in the history (going back or forward) is handled by the popstate event.
     *
     * The router must maintain an up-to-date URL, otherwise changing global filters (time, account, filter) would redirect to a stale URL.
     */
    q(this, Pa, (t) => {
      t.destination.sameDocument && (t.navigationType === "push" || t.navigationType === "replace") && (this.current = new URL(t.destination.url));
    });
    /**
     * Close the modal overlay.
     */
    m(this, "close_overlay", () => {
      if (this.current.hash) {
        const t = new URL(this.current);
        if (t.hash = "", (At == null ? void 0 : At.currentEntry) != null && At.canGoBack) {
          const r = At.entries()[At.currentEntry.index - 1];
          if ((r == null ? void 0 : r.url) === t.href) {
            At.back();
            return;
          }
        }
        this.navigate(t, !1);
      }
    });
    /*
     * Reload the page.
     */
    m(this, "reload", () => {
      G(this, vt, _a).call(this, this.current).catch(Qt);
    });
    const t = document.querySelector("article");
    if (!t)
      throw new Error("<article> element is missing from markup");
    I(this, Tn, t), I(this, ln, new URL(window.location.href)), Kr.set(c(this, ln));
  }
  /** The current URL. */
  get current() {
    return c(this, ln);
  }
  /** Set the current URL. */
  set current(t) {
    c(this, ln).href !== t.href && (I(this, ln, t), Kr.set(t));
  }
  /**
   * Whether an interrupt handler is active like on the editor or import report.
   * Avoid auto-reloading in that case.
   */
  get has_interrupt_handler() {
    return c(this, Cn).size > 0;
  }
  /**
   * Add an interrupt handler. Returns a function that removes it.
   * This can be used directly in a Svelte onMount hook.
   */
  add_interrupt_handler(t) {
    return c(this, Cn).add(t), () => {
      c(this, Cn).delete(t);
    };
  }
  /**
   * This should be called once when the page has been loaded. Initializes the
   * router and takes over clicking on links.
   */
  init(t) {
    I(this, ea, t), G(this, vt, ti).call(this, this.current).catch(Qt), window.addEventListener("beforeunload", c(this, qa)), window.addEventListener("popstate", c(this, Ra)), document.addEventListener("click", c(this, Ia)), At == null || At.addEventListener("navigate", c(this, Pa)), ko();
  }
  /**
   * Go to URL.
   *
   * If load is `true`, load the page at URL, otherwise only push
   * a new history item update and update the current url.
   */
  navigate(t, n = !0) {
    const r = t instanceof URL ? t : new URL(t, window.location.href);
    n ? G(this, vt, _a).call(this, r).catch(Qt) : (window.history.pushState(null, "", r), this.current = r);
  }
  set_search_param(t, n) {
    const r = new URL(this.current);
    if (Nv(r, t, n), r.href !== this.current.href) {
      const a = !(t === "charts" || t === "query_string");
      this.navigate(r, a);
    }
  }
}
ln = new WeakMap(), Tn = new WeakMap(), ea = new WeakMap(), Mn = new WeakMap(), Cn = new WeakMap(), vt = new WeakSet(), /**
 * Check whether any of the registered interruptHandlers wants to stop
 * navigation.
 */
ei = function() {
  for (const t of c(this, Cn)) {
    const n = t();
    if (n != null)
      return n;
  }
  return null;
}, ti = async function(t, n) {
  const r = c(this, Mn), a = Ql(t).unwrap(), s = a.slice(0, a.indexOf("/")), i = c(this, ea).find((o) => o.report === s) ?? jv;
  try {
    I(this, Mn, await su.await(
      i.render(c(this, Tn), t, r, n)
    ));
  } catch (o) {
    nv(o);
    const l = new Cv(o);
    I(this, Mn, l.render(
      c(this, Tn),
      t,
      r,
      n
    ));
  }
  au.set(c(this, Mn).title);
}, qa = new WeakMap(), Ra = new WeakMap(), Ia = new WeakMap(), Pa = new WeakMap(), _a = async function(t) {
  var i;
  const n = G(this, vt, ei).call(this);
  if (n != null && !window.confirm(n))
    return;
  const a = t.href === this.current.href ? void 0 : () => {
    c(this, Tn).scroll(0, 0), t.href !== window.location.href && window.history.pushState(null, "", t), this.current = t;
  };
  await G(this, vt, ti).call(this, t, a), Dv.set(!1), ko();
  const s = this.current.hash.slice(1);
  s && ((i = document.getElementById(s)) == null || i.scrollIntoView());
};
const Fv = new Ov();
function qv(e) {
  var t = 0, n = e.children, r = n && n.length;
  if (!r) t = 1;
  else for (; --r >= 0; ) t += n[r].value;
  e.value = t;
}
function Rv() {
  return this.eachAfter(qv);
}
function Iv(e, t) {
  let n = -1;
  for (const r of this)
    e.call(t, r, ++n, this);
  return this;
}
function Pv(e, t) {
  for (var n = this, r = [n], a, s, i = -1; n = r.pop(); )
    if (e.call(t, n, ++i, this), a = n.children)
      for (s = a.length - 1; s >= 0; --s)
        r.push(a[s]);
  return this;
}
function zv(e, t) {
  for (var n = this, r = [n], a = [], s, i, o, l = -1; n = r.pop(); )
    if (a.push(n), s = n.children)
      for (i = 0, o = s.length; i < o; ++i)
        r.push(s[i]);
  for (; n = a.pop(); )
    e.call(t, n, ++l, this);
  return this;
}
function Vv(e, t) {
  let n = -1;
  for (const r of this)
    if (e.call(t, r, ++n, this))
      return r;
}
function Yv(e) {
  return this.eachAfter(function(t) {
    for (var n = +e(t.data) || 0, r = t.children, a = r && r.length; --a >= 0; ) n += r[a].value;
    t.value = n;
  });
}
function Hv(e) {
  return this.eachBefore(function(t) {
    t.children && t.children.sort(e);
  });
}
function Wv(e) {
  for (var t = this, n = Bv(t, e), r = [t]; t !== n; )
    t = t.parent, r.push(t);
  for (var a = r.length; e !== n; )
    r.splice(a, 0, e), e = e.parent;
  return r;
}
function Bv(e, t) {
  if (e === t) return e;
  var n = e.ancestors(), r = t.ancestors(), a = null;
  for (e = n.pop(), t = r.pop(); e === t; )
    a = e, e = n.pop(), t = r.pop();
  return a;
}
function Gv() {
  for (var e = this, t = [e]; e = e.parent; )
    t.push(e);
  return t;
}
function Kv() {
  return Array.from(this);
}
function Zv() {
  var e = [];
  return this.eachBefore(function(t) {
    t.children || e.push(t);
  }), e;
}
function Jv() {
  var e = this, t = [];
  return e.each(function(n) {
    n !== e && t.push({ source: n.parent, target: n });
  }), t;
}
function* $v() {
  var e = this, t, n = [e], r, a, s;
  do
    for (t = n.reverse(), n = []; e = t.pop(); )
      if (yield e, r = e.children)
        for (a = 0, s = r.length; a < s; ++a)
          n.push(r[a]);
  while (n.length);
}
function Fi(e, t) {
  e instanceof Map ? (e = [void 0, e], t === void 0 && (t = em)) : t === void 0 && (t = Xv);
  for (var n = new La(e), r, a = [n], s, i, o, l; r = a.pop(); )
    if ((i = t(r.data)) && (l = (i = Array.from(i)).length))
      for (r.children = i, o = l - 1; o >= 0; --o)
        a.push(s = i[o] = new La(i[o])), s.parent = r, s.depth = r.depth + 1;
  return n.eachBefore(nm);
}
function Qv() {
  return Fi(this).eachBefore(tm);
}
function Xv(e) {
  return e.children;
}
function em(e) {
  return Array.isArray(e) ? e[1] : null;
}
function tm(e) {
  e.data.value !== void 0 && (e.value = e.data.value), e.data = e.data.data;
}
function nm(e) {
  var t = 0;
  do
    e.height = t;
  while ((e = e.parent) && e.height < ++t);
}
function La(e) {
  this.data = e, this.depth = this.height = 0, this.parent = null;
}
La.prototype = Fi.prototype = {
  constructor: La,
  count: Rv,
  each: Iv,
  eachAfter: zv,
  eachBefore: Pv,
  find: Vv,
  sum: Yv,
  sort: Hv,
  path: Wv,
  ancestors: Gv,
  descendants: Kv,
  leaves: Zv,
  links: Jv,
  copy: Qv,
  [Symbol.iterator]: $v
};
const rm = (e) => kh(e, (t) => t.account), ua = Ye(Se), qi = W({
  account: b,
  balance: ua,
  balance_children: ua,
  children: xf(
    () => (e) => Q(qi)(e).map(rm)
  ),
  cost: we(ua),
  cost_children: we(ua),
  has_txns: Ei(ft, () => !1)
});
function iu({
  account: e,
  balance: t,
  children: n
}) {
  if (n.length) {
    const r = n.map(iu);
    return r.push({ account: e, balance: t, children: [], dummy: !0 }), { account: e, balance: {}, children: r, dummy: !1 };
  }
  return { account: e, balance: t, children: [], dummy: !1 };
}
class am {
  constructor(t, n) {
    m(this, "type", "hierarchy");
    /** All currencies for which we have an hierarchy. */
    m(this, "currencies");
    /** The currency to show the treemap of. */
    m(this, "treemap_currency");
    m(this, "label");
    m(this, "data");
    this.label = t, this.data = n, this.currencies = [...this.data.keys()];
    const r = this.currencies[0];
    this.treemap_currency = r != null ? nn(r) : null;
  }
}
const sm = W({
  label: b,
  data: qi
}), ar = class ar {
  constructor(t, n) {
    m(this, "label");
    m(this, "data");
    this.label = t, this.data = n;
  }
  with_context({ currencies: t }) {
    const n = iu(this.data);
    return new am(
      this.label,
      new Map(
        t.map((r) => {
          const a = Fi(n), s = Il(
            a.descendants(),
            (o) => o.data.balance[r] ?? 0
          ), i = s ? Math.sign(s) : 1;
          return a.sum(
            (o) => i * Math.max(i * (o.balance[r] ?? 0), 0)
          ).sort((o, l) => i * ((l.value ?? 0) - (o.value ?? 0))), [r, a];
        }).filter(([, r]) => r.value != null && r.value !== 0)
      )
    );
  }
};
m(ar, "from_node", (t) => new ar(t.account, t)), m(ar, "validator", (t) => sm(t).map(
  ({ label: n, data: r }) => new ar(n, r)
));
let ni = ar;
function ca(e) {
  return function() {
    return e;
  };
}
function im(e) {
  return typeof e == "object" && "length" in e ? e : Array.from(e);
}
function So(e, t) {
  if ((i = e.length) > 1)
    for (var n = 1, r, a, s = e[t[0]], i, o = s.length; n < i; ++n)
      for (a = s, s = e[t[n]], r = 0; r < o; ++r)
        s[r][1] += s[r][0] = isNaN(a[r][1]) ? a[r][0] : a[r][1];
}
function To(e) {
  for (var t = e.length, n = new Array(t); --t >= 0; ) n[t] = t;
  return n;
}
function om(e, t) {
  return e[t];
}
function lm(e) {
  const t = [];
  return t.key = e, t;
}
function um() {
  var e = ca([]), t = To, n = So, r = om;
  function a(s) {
    var i = Array.from(e.apply(this, arguments), lm), o, l = i.length, u = -1, d;
    for (const v of s)
      for (o = 0, ++u; o < l; ++o)
        (i[o][u] = [0, +r(v, i[o].key, u, s)]).data = v;
    for (o = 0, d = im(t(i)); o < l; ++o)
      i[d[o]].index = o;
    return n(i, d), i;
  }
  return a.keys = function(s) {
    return arguments.length ? (e = typeof s == "function" ? s : ca(Array.from(s)), a) : e;
  }, a.value = function(s) {
    return arguments.length ? (r = typeof s == "function" ? s : ca(+s), a) : r;
  }, a.order = function(s) {
    return arguments.length ? (t = s == null ? To : typeof s == "function" ? s : ca(Array.from(s)), a) : t;
  }, a.offset = function(s) {
    return arguments.length ? (n = s ?? So, a) : n;
  }, a;
}
function cm(e, t) {
  if ((l = e.length) > 0)
    for (var n, r = 0, a, s, i, o, l, u = e[t[0]].length; r < u; ++r)
      for (i = o = 0, n = 0; n < l; ++n)
        (s = (a = e[t[n]][r])[1] - a[0]) > 0 ? (a[0] = i, a[1] = i += s) : s < 0 ? (a[1] = o, a[0] = o += s) : (a[0] = 0, a[1] = s);
}
const Ht = {
  /** Create a <br> element. */
  br: () => document.createElement("br"),
  /** Create a <em> element with the given content. */
  em: (e) => {
    const t = document.createElement("em");
    return t.textContent = e, t;
  },
  /** Create a text node for the given text. */
  t: (e) => document.createTextNode(e),
  /** Create a <pre> element with the given content. */
  pre: (e) => {
    const t = document.createElement("pre");
    return t.textContent = e, t;
  }
};
class fm {
  constructor(t, n, r) {
    m(this, "type", "barchart");
    /** The accounts that occur in some bar.  */
    m(this, "accounts");
    /** For each currency, the stacks (one series per account) */
    m(this, "stacks");
    m(this, "label");
    /** The currencies that are shown in this bar chart. */
    m(this, "currencies");
    /** The data for the (single) bars for all the intervals in this chart. */
    m(this, "bar_groups");
    this.label = t, this.currencies = n, this.bar_groups = r, this.accounts = Array.from(
      new Set(r.map((a) => Object.keys(a.account_balances)).flat(2))
    ).sort(), this.stacks = n.map((a) => [
      a,
      um().keys(this.accounts).value((s, i) => {
        var o;
        return ((o = s.account_balances[i]) == null ? void 0 : o[a]) ?? 0;
      }).offset(cm)(r).filter((s) => s[0] !== s[1] && !Number.isNaN(s[1]))
    ]);
  }
  filter(t) {
    const n = new Set(t), r = new Set(
      this.currencies.filter((i) => !n.has(i))
    ), a = this.bar_groups.map((i) => ({
      ...i,
      values: i.values.filter((o) => r.has(o.currency))
    })), s = this.stacks.filter((i) => r.has(i[0]));
    return { currencies: [...r], bar_groups: a, stacks: s };
  }
  /** Whether this chart contains any stacks (or is just a single account). */
  get hasStackedData() {
    return this.accounts.length > 1;
  }
  /** The tooltip for a hovered account in the stacked bar chart. */
  tooltipTextAccount(t, n, r, a) {
    const s = [];
    return s.push(Ht.em(r)), n.values.forEach(({ currency: i }) => {
      var o;
      if (!a.includes(i)) {
        const l = ((o = n.account_balances[r]) == null ? void 0 : o[i]) ?? 0;
        s.push(Ht.t(t.amount(l, i))), s.push(Ht.br());
      }
    }), s.push(Ht.em(n.label)), s;
  }
  /** The tooltip for a hovered bar group in the bar chart. */
  tooltipText(t, n) {
    const r = [];
    return n.values.forEach((a) => {
      r.push(
        Ht.t(
          a.budget ? `${t.amount(a.value, a.currency)} / ${t.amount(
            a.budget,
            a.currency
          )}` : t.amount(a.value, a.currency)
        )
      ), r.push(Ht.br());
    }), r.push(Ht.em(n.label)), r;
  }
}
function dm(e, t) {
  const n = Kf(
    e.flatMap((a) => [
      ...Object.keys(a.budgets),
      ...Object.keys(a.balance)
    ]),
    (a) => a.length,
    (a) => a
  ), r = t.currencies.filter((a) => n.delete(a));
  return r.push(
    ...[...n].sort((a, s) => s[1] - a[1]).map((a) => a[0]).slice(0, Math.max(r.length, 5) - r.length)
  ), r;
}
const hm = Q(
  W({
    date: Ct,
    budgets: Ye(Se),
    balance: Ye(Se),
    account_balances: Ye(Ye(Se))
  })
), vm = W({ label: b, data: hm }), za = class za {
  constructor(t, n) {
    m(this, "label");
    m(this, "data");
    this.label = t, this.data = n;
  }
  with_context(t) {
    const n = dm(this.data, t), r = this.data.map((a) => ({
      values: n.map((s) => ({
        currency: s,
        value: a.balance[s] ?? 0,
        budget: a.budgets[s] ?? 0
      })),
      date: a.date,
      label: t.dateFormat(a.date),
      account_balances: a.account_balances
    }));
    return new fm(this.label, n, r);
  }
};
m(za, "validator", (t) => vm(t).map(
  ({ label: n, data: r }) => new za(n, r)
));
let ri = za;
class mm {
  constructor(t, n, r) {
    m(this, "type", "linechart");
    m(this, "series_names");
    m(this, "label");
    m(this, "data");
    m(this, "tooltipText");
    this.label = t, this.data = Rl(n, (a) => -a.values.length), this.tooltipText = r, this.series_names = this.data.map((a) => a.name);
  }
  /** Filter the data of this chart, excluding some series. */
  filter(t) {
    const n = new Set(t);
    return this.data.filter((r) => !n.has(r.name));
  }
  with_context() {
    return this;
  }
}
const pm = W({
  label: b,
  data: Q(W({ date: Ct, balance: Ye(Se) }))
}), Va = class Va {
  constructor(t, n) {
    m(this, "label");
    m(this, "data");
    this.label = t, this.data = n;
  }
  with_context() {
    const t = /* @__PURE__ */ new Map();
    for (const { date: r, balance: a } of this.data)
      Object.entries(a).forEach(([s, i]) => {
        const o = t.get(s), l = { date: r, value: i, name: s };
        o ? o.push(l) : t.set(s, [l]);
      });
    const n = [...t.entries()].map(([r, a]) => ({
      name: r,
      values: a
    }));
    return new mm(this.label, n, (r, a) => [
      Ht.t(r.amount(a.value, a.name)),
      Ht.em(Wl(a.date))
    ]);
  }
};
m(Va, "validator", (t) => pm(t).map(
  ({ label: n, data: r }) => new Va(n, r)
));
let ai = Va;
const gm = W({
  label: b,
  data: Q(
    W({ type: b, date: Ct, description: b })
  )
}), Ya = class Ya {
  constructor(t, n) {
    m(this, "type", "scatterplot");
    m(this, "label");
    m(this, "data");
    this.label = t, this.data = n;
  }
  with_context() {
    return this;
  }
};
m(Ya, "validator", (t) => gm(t).map(
  ({ label: n, data: r }) => new Ya(n, r)
));
let si = Ya;
const _m = Q(
  Si("type", {
    balances: ai.validator,
    bar: ri.validator,
    hierarchy: ni.validator,
    scatterplot: si.validator
  })
), ym = W({
  type: b,
  message: b,
  source: we(W({ filename: b, lineno: Se }))
}), bm = W({
  balance_string: we(b),
  close_date: we(Ct),
  last_entry: we(W({ date: Ct, entry_hash: b })),
  uptodate_status: we(Ll("green", "yellow", "red"))
}), wm = Ye(bm), xm = W({
  auto_reload: ft,
  currency_column: Se,
  conversion_currencies: Q(b),
  collapse_pattern: Q(b),
  import_config: we(b),
  indent: Se,
  invert_gains_losses_colors: ft,
  invert_income_liabilities_equity: ft,
  show_closed_accounts: ft,
  show_accounts_with_zero_balance: ft,
  show_accounts_with_zero_transactions: ft,
  locale: we(b),
  uptodate_indicator_grey_lookback_days: Se,
  insert_entry: Q(
    W({ date: b, filename: b, lineno: Se, re: b })
  ),
  use_external_editor: ft
}), km = W({
  documents: Q(b),
  filename: b,
  include: Q(b),
  name_assets: b,
  name_equity: b,
  name_expenses: b,
  name_income: b,
  name_liabilities: b,
  operating_currency: Q(b),
  title: b
}), Em = Q(
  W({
    name: b,
    report_title: we(b),
    has_js_module: ft
  })
), Sm = W({
  account_details: wm,
  accounts: Q(b),
  base_url: b,
  currencies: Q(b),
  currency_names: Ye(b),
  errors: Q(ym),
  extensions: Em,
  fava_options: xm,
  have_excel: ft,
  incognito: ft,
  links: Q(b),
  options: km,
  other_ledgers: Q(Rs(b, b)),
  payees: Q(b),
  precisions: Ye(Se),
  sidebar_links: Q(Rs(b, b)),
  tags: Q(b),
  upcoming_events_count: Se,
  user_queries: Q(W({ name: b, query_string: b })),
  years: Q(b)
}), Tm = W({ begin: Ct, end: Ct });
Q(
  W({ base: b, quote: b, prices: Q(Rs(Ct, Se)) })
);
const Mm = W({
  budget: Ye(Se),
  budget_children: Ye(Se)
}), Cm = W({
  charts: _m,
  journal: we(b),
  dates: we(Q(Tm)),
  interval_balances: we(Q(qi)),
  budgets: we(Ye(Q(Mm)))
});
class jm extends Error {
  constructor(t) {
    super("Invalid data returned in API request.", { cause: t }), Qs(this);
  }
}
function ou(e, t, n) {
  const r = Sr(ts), a = new URL(`${r}api/${e}`, window.location.href);
  if (t && n)
    for (const s of t) {
      const i = n[s];
      i != null && i !== "" && a.searchParams.set(s, i.toString());
    }
  return a;
}
async function lu(e, t, n) {
  const r = await Xh(e, t);
  return typeof r.mtime == "string" && nu(r.mtime), n(r.data).unwrap(jm);
}
function Mr(e, t, n, r = "GET") {
  return async (a) => {
    const s = ou(e, n, a);
    return lu(s, { method: r }, t);
  };
}
function Dm(e, t) {
  return async () => {
    const n = ou(e);
    return lu(n, { method: "GET" }, t);
  };
}
const Am = ["account", "filter", "time"], uu = [
  "account",
  "conversion",
  "filter",
  "interval",
  "time"
];
Mr(
  "account_report",
  Cm,
  [...uu, "a", "r"]
);
Mr(
  "journal_page",
  W({ journal: b, total_pages: Se }),
  [...uu, "page", "order"]
);
const Lm = Mr(
  "narration_transaction",
  Xa.validator,
  ["narration"]
), Nm = Dm(
  "narrations",
  Q(b)
), Um = Mr(
  "payee_accounts",
  Q(b),
  ["payee"]
), Om = Mr(
  "payee_transaction",
  Xa.validator,
  ["payee"]
);
Mr("query", fv, [
  ...Am,
  "query_string"
]);
function Fm(e, t, n) {
  const r = e[t];
  if (r != null) {
    const a = e.toSpliced(t, 1);
    return a.splice(n, 0, r), a;
  }
  return e;
}
var qm = /* @__PURE__ */ ee('<div role="group"><button type="button" class="muted round remove-row svelte-1ni4qkj">×</button> <svelte-css-wrapper style="display: contents"><!></svelte-css-wrapper> <svelte-css-wrapper style="display: contents"><!></svelte-css-wrapper> <!></div> <!>', 1);
const Rm = {
  hash: "svelte-1ni4qkj",
  code: `.drag.svelte-1ni4qkj {box-shadow:var(--box-shadow-button);}div.svelte-1ni4qkj {padding-left:3rem;cursor:grab;}div.svelte-1ni4qkj > :where(.svelte-1ni4qkj) {cursor:initial;}div.svelte-1ni4qkj:last-child .remove-row:where(.svelte-1ni4qkj) {visibility:hidden;}

  @media (width <= 767px) {div.svelte-1ni4qkj {padding-left:0;}
  }`
};
function Im(e, t) {
  Fe(t, !0), rt(e, Rm);
  const n = () => or(Ni, "$currencies", r), [r, a] = Wa();
  let s = $e(t, "posting", 15), i = /* @__PURE__ */ ie(() => s().amount.replace(/[^\-?0-9.]/g, "")), o = /* @__PURE__ */ ie(() => n().map((E) => `${h(i)} ${E}`)), l = /* @__PURE__ */ re(!1), u = /* @__PURE__ */ re(!0);
  function d(E) {
    O(u, !(E.target instanceof HTMLInputElement));
  }
  function v(E) {
    var z;
    (z = E.dataTransfer) == null || z.setData("fava/posting", t.index.toString());
  }
  function f(E) {
    var J;
    (((J = E.dataTransfer) == null ? void 0 : J.types) ?? []).includes("fava/posting") && (E.preventDefault(), O(l, !0));
  }
  function p() {
    O(l, !1);
  }
  function g(E) {
    var J;
    E.preventDefault();
    const z = (J = E.dataTransfer) == null ? void 0 : J.getData("fava/posting");
    z != null && (t.move({ from: +z, to: t.index }), O(l, !1));
  }
  var y = qm(), _ = Re(y);
  let S;
  var w = U(_);
  ke(w, "tabindex", -1);
  var F = j(w, 2), R = () => s().account, V = (E) => {
    s(s().set("account", E));
  };
  Fn(F, () => ({ "--autocomplete-wrapper-flex": "2" })), Ui(F.lastChild, {
    get value() {
      return R();
    },
    set value(E) {
      V(E);
    },
    get suggestions() {
      return t.suggestions;
    },
    get date() {
      return t.date;
    }
  });
  var N = j(F, 2), T = () => s().amount, k = (E) => {
    s(s().set("amount", E));
  };
  {
    let E = /* @__PURE__ */ ie(() => de("Amount"));
    Fn(N, () => ({ "--autocomplete-wrapper-flex": "1" })), Gr(N.lastChild, {
      get placeholder() {
        return h(E);
      },
      get suggestions() {
        return h(o);
      },
      get value() {
        return T();
      },
      set value(z) {
        k(z);
      }
    });
  }
  var K = j(N, 2), le = () => s().meta, ve = (E) => {
    s(s().set("meta", E));
  };
  ns(K, {
    get meta() {
      return le();
    },
    set meta(E) {
      ve(E);
    }
  });
  var D = j(_, 2), C = () => s().meta, M = (E) => {
    s(s().set("meta", E));
  };
  rs(D, {
    get meta() {
      return C();
    },
    set meta(E) {
      M(E);
    }
  }), fe(() => {
    S = $a(_, 1, "flex-row svelte-1ni4qkj", null, S, { drag: h(l) }), ke(_, "draggable", h(u));
  }), ce("mousemove", _, d), an("dragstart", _, v), an("dragenter", _, f), an("dragover", _, f), an("dragleave", _, p), an("drop", _, g), ce("click", w, function(...E) {
    var z;
    (z = t.remove) == null || z.apply(this, E);
  }), B(e, y), qe(), a();
}
zt(["mousemove", "click"]);
var Pm = /* @__PURE__ */ ee('<div class="flex-row"><input type="date" required=""/> <input type="text" name="flag" required="" class="svelte-cxkmyl"/> <label><span class="hide-on-desktop svelte-cxkmyl"> </span> <svelte-css-wrapper style="display: contents"><!></svelte-css-wrapper></label> <label class="narration"><span class="hide-on-desktop svelte-cxkmyl"> </span> <svelte-css-wrapper style="display: contents"><!></svelte-css-wrapper> <!></label></div> <!> <div class="flex-row hide-on-desktop svelte-cxkmyl"><span class="label"> </span></div> <!>', 1);
const zm = {
  hash: "svelte-cxkmyl",
  code: `input[name="flag"].svelte-cxkmyl {width:1.5em;padding-right:2px;padding-left:2px;text-align:center;}.hide-on-desktop.svelte-cxkmyl {display:none;}

  @media (width <= 767px) {.hide-on-desktop.svelte-cxkmyl {display:initial;width:100%;}
  }`
};
function Vm(e, t) {
  Fe(t, !0), rt(e, zm);
  const n = () => or(Dh, "$payees", r), [r, a] = Wa();
  let s = $e(t, "entry", 15), i = /* @__PURE__ */ re(void 0), o = /* @__PURE__ */ ie(() => s().payee);
  lr(() => {
    h(o) && (O(i, void 0), n().includes(h(o)) && Um({ payee: h(o) }).then((L) => {
      O(i, L);
    }).catch((L) => {
      Qs(L, (ae) => `Fetching account suggestions for payee ${h(o)} failed: ${ae.message}`);
    }));
  });
  let l = /* @__PURE__ */ ie(() => s().get_narration_tags_links()), u = /* @__PURE__ */ re([]);
  lr(() => {
    Nm().then((L) => {
      O(u, L);
    }).catch((L) => {
      Qs(L, (ae) => `Fetching narration suggestions failed: ${ae.message}`);
    });
  });
  async function d() {
    if (s().narration || s().postings.some((ae) => !ae.is_empty()))
      return;
    const L = await Om({ payee: s().payee });
    s(L.set("date", s().date));
  }
  async function v() {
    if (s().payee || s().postings.some((ae) => !ae.is_empty()))
      return;
    const L = await Lm({ narration: h(l) });
    s(
      L.set("date", s().date)
      // Copy to "entry" and preserve the date set in the dialog
    ), O(l, s().get_narration_tags_links());
  }
  lr(() => {
    s().postings.some((L) => L.is_empty()) || s(s().set("postings", s().postings.concat(Bl.empty())));
  });
  var f = Pm(), p = Re(f), g = U(p), y = j(g, 2), _ = j(y, 2), S = U(_), w = U(S), F = j(S, 2), R = () => s().payee, V = (L) => {
    s(s().set("payee", L));
  };
  {
    let L = /* @__PURE__ */ ie(() => de("Payee"));
    Fn(F, () => ({ "--autocomplete-wrapper-flex": "1" })), Gr(F.lastChild, {
      get placeholder() {
        return h(L);
      },
      get value() {
        return R();
      },
      set value(ae) {
        V(ae);
      },
      get suggestions() {
        return n();
      },
      onSelect: d
    });
  }
  var N = j(_, 2), T = U(N), k = U(T), K = j(T, 2);
  {
    let L = /* @__PURE__ */ ie(() => de("Narration"));
    Fn(K, () => ({ "--autocomplete-wrapper-flex": "2" })), Gr(K.lastChild, {
      get placeholder() {
        return h(L);
      },
      get suggestions() {
        return h(u);
      },
      onSelect: v,
      onEnter: () => {
        s(s().set_narration_tags_links(h(l)));
      },
      onBlur: () => {
        s(s().set_narration_tags_links(h(l)));
      },
      get value() {
        return h(l);
      },
      set value(ae) {
        O(l, ae);
      }
    });
  }
  var le = j(K, 2), ve = () => s().meta, D = (L) => {
    s(s().set("meta", L));
  };
  ns(le, {
    get meta() {
      return ve();
    },
    set meta(L) {
      D(L);
    }
  });
  var C = j(p, 2), M = () => s().meta, E = (L) => {
    s(s().set("meta", L));
  };
  rs(C, {
    get meta() {
      return M();
    },
    set meta(L) {
      E(L);
    }
  });
  var z = j(C, 2), J = U(z), ge = U(J), me = j(z, 2);
  br(me, 17, () => s().postings, _i, (L, ae, Pe) => {
    const _t = /* @__PURE__ */ ie(() => s().postings[Pe]);
    var st = sa(), se = Re(st);
    {
      var Te = (pe) => {
        var Me = () => h(_t), A = (H) => {
          s(s().set("postings", s().postings.with(Pe, H)));
        };
        Im(pe, {
          get posting() {
            return Me();
          },
          set posting(H) {
            A(H);
          },
          index: Pe,
          get suggestions() {
            return h(i);
          },
          get date() {
            return s().date;
          },
          move: ({ from: H, to: X }) => {
            s(s().set("postings", Fm(s().postings, H, X)));
          },
          remove: () => {
            s(s().set("postings", s().postings.toSpliced(Pe, 1)));
          }
        });
      };
      Ee(se, (pe) => {
        h(_t) && pe(Te);
      });
    }
    B(L, st);
  }), fe(
    (L, ae, Pe) => {
      ue(w, `${L ?? ""}:`), ue(k, `${ae ?? ""}:`), ue(ge, `${Pe ?? ""}:`);
    },
    [() => de("Payee"), () => de("Narration"), () => de("Postings")]
  ), hn(g, () => s().date, (L) => {
    s(s().set("date", L));
  }), hn(y, () => s().flag, (L) => {
    s(s().set("flag", L));
  }), B(e, f), qe(), a();
}
var Ym = /* @__PURE__ */ ee("<div><!></div>");
const Hm = {
  hash: "svelte-1p85map",
  code: ".duplicate.svelte-1p85map {opacity:0.5;}"
};
function Wm(e, t) {
  Fe(t, !0), rt(e, Hm);
  let n = $e(t, "entry", 15), r = $e(t, "duplicate", 3, !1);
  var a = Ym();
  let s;
  var i = U(a);
  {
    var o = (v) => {
      Gh(v, {
        get entry() {
          return n();
        },
        set entry(f) {
          n(f);
        }
      });
    }, l = (v) => {
      Jh(v, {
        get entry() {
          return n();
        },
        set entry(f) {
          n(f);
        }
      });
    }, u = (v) => {
      Vm(v, {
        get entry() {
          return n();
        },
        set entry(f) {
          n(f);
        }
      });
    }, d = (v) => {
      var f = Ja("Entry type unsupported for editing.");
      B(v, f);
    };
    Ee(i, (v) => {
      n() instanceof Gl ? v(o) : n() instanceof Kl ? v(l, 1) : n() instanceof Xa ? v(u, 2) : v(d, -1);
    });
  }
  fe(() => s = $a(a, 1, "flex-column svelte-1p85map", null, s, { duplicate: r() })), B(e, a), qe();
}
const Bm = [
  "a[href]",
  'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
  "select:not([disabled]):not([aria-hidden])",
  "textarea:not([disabled]):not([aria-hidden])",
  "button:not([disabled]):not([aria-hidden])",
  "object",
  "[contenteditable]"
].join(", ");
function Mo(e) {
  return [...e.querySelectorAll(Bm)];
}
function ws(e) {
  try {
    e.focus();
  } catch {
  }
  return document.activeElement === e;
}
var Gm = /* @__PURE__ */ ee('<div class="overlay svelte-1r20763"><div class="background svelte-1r20763" aria-hidden="true"></div> <div class="content svelte-1r20763" role="dialog" aria-modal="true"><!> <button type="button" class="muted close svelte-1r20763">x</button></div></div>');
const Km = {
  hash: "svelte-1r20763",
  code: `body:has(.overlay) {overflow:hidden;}.background.svelte-1r20763 {position:fixed;inset:0;width:100%;height:100%;cursor:pointer;background:var(--overlay-wrapper-background);}.overlay.svelte-1r20763 {position:fixed;inset:0;z-index:var(--z-index-overlay);display:flex;align-items:start;justify-content:center;width:100vw;height:100vh;overflow:auto;}.content.svelte-1r20763 {position:relative;display:flex;width:100%;max-width:767px;padding:1em;margin:0.5em;margin-top:10vh;background:var(--background);box-shadow:var(--box-shadow-overlay);}.close.svelte-1r20763 {position:absolute;top:1em;right:1em;width:2em;height:2em;margin:0;line-height:1em;color:var(--text-color-lighter);}.content.svelte-1r20763 form,
  .content.svelte-1r20763 > div {width:100%;}

  @media (width <= 767px) {
    /* Show the modal full-screen on mobile. */.overlay.svelte-1r20763 {height:100%;}.background.svelte-1r20763 {
      /* Ensure that modal overflow gets a white background. */background:var(--background);}.content.svelte-1r20763 {height:100%;margin:0;box-shadow:unset;}
  }`
};
function Zm(e, t) {
  Fe(t, !0), rt(e, Km);
  let n = $e(t, "closeHandler", 19, () => Fv.close_overlay);
  const r = (o) => {
    const l = (v) => {
      if (v.key === "Tab") {
        const f = Mo(o), p = f[0], g = f[f.length - 1];
        v.shiftKey && document.activeElement === p && g ? (v.preventDefault(), ws(g)) : !v.shiftKey && document.activeElement === g && p && (v.preventDefault(), ws(p));
      } else v.key === "Escape" && (v.preventDefault(), n()());
    };
    document.addEventListener("keydown", l);
    const d = (t.focus != null ? o.querySelector(t.focus) : void 0) ?? Mo(o)[0];
    return d && ws(d), () => {
      document.removeEventListener("keydown", l);
    };
  };
  var a = sa(), s = Re(a);
  {
    var i = (o) => {
      var l = Gm(), u = U(l), d = j(u, 2), v = U(d);
      qc(v, () => t.children);
      var f = j(v, 2);
      Ml(d, () => r), ce("click", u, function(...p) {
        var g;
        (g = n()) == null || g.apply(this, p);
      }), ce("click", f, function(...p) {
        var g;
        (g = n()) == null || g.apply(this, p);
      }), B(o, l);
    };
    Ee(s, (o) => {
      t.shown && o(i);
    });
  }
  B(e, a), qe();
}
zt(["click"]);
var Jm = /* @__PURE__ */ ee('<button type="button" class="muted">⏮</button> <button type="button" class="muted"> </button>', 1), $m = /* @__PURE__ */ ee('<button type="submit"> </button> <button type="button" class="muted">⏭</button>', 1), Qm = /* @__PURE__ */ ee('<button type="submit"> </button>'), Xm = /* @__PURE__ */ ee('<hr/> <h3> <!></h3> <pre class="svelte-qupc0x"> </pre>', 1), ep = /* @__PURE__ */ ee('<div class="flex-row"><h3> </h3> <span class="spacer"></span> <label class="button muted"><input type="checkbox"/> </label></div> <!> <div class="flex-row"><!> <span class="spacer"></span> <!></div> <!>', 1), tp = /* @__PURE__ */ ee('<form class="flex-column"><h3> </h3> <!></form>');
const np = {
  hash: "svelte-qupc0x",
  code: "pre.svelte-qupc0x {margin:0;font-size:0.9em;white-space:pre-wrap;}"
};
function rp(e, t) {
  Fe(t, !0), rt(e, np);
  let n = $e(t, "entries", 15), r = /* @__PURE__ */ re(0), a = /* @__PURE__ */ ie(() => n().length), s = /* @__PURE__ */ ie(() => h(a) > 0), i = /* @__PURE__ */ ie(() => n()[h(r)]), o = /* @__PURE__ */ ie(() => {
    var g;
    return ((g = h(i)) == null ? void 0 : g.is_duplicate()) ?? !1;
  }), l = /* @__PURE__ */ ie(() => n().filter((g) => g.is_duplicate()).length);
  lr(() => {
    h(a) > 0 && h(r) >= h(a) && O(r, 0);
  });
  function u(g) {
    g.preventDefault(), h(r) < h(a) - 1 ? O(r, h(r) + 1) : t.save();
  }
  function d() {
    O(r, Math.max(h(r) - 1, 0));
  }
  function v() {
    h(i) && n(n()[h(r)] = h(i).set_meta("__duplicate__", !h(i).is_duplicate()), !0);
  }
  let f = /* @__PURE__ */ ie(() => h(r) + 1), p = /* @__PURE__ */ ie(() => h(a) - h(l));
  Zm(e, {
    get shown() {
      return h(s);
    },
    get closeHandler() {
      return t.close;
    },
    children: (g, y) => {
      var _ = tp(), S = U(_), w = U(S), F = j(S, 2);
      {
        var R = (V) => {
          var N = ep(), T = Re(N), k = U(T), K = U(k), le = j(k, 4), ve = U(le), D = j(ve), C = j(T, 2), M = () => h(i), E = (se) => {
            n(n()[h(r)] = se, !0);
          };
          Wm(C, {
            get entry() {
              return M();
            },
            set entry(se) {
              E(se);
            },
            get duplicate() {
              return h(o);
            }
          });
          var z = j(C, 2), J = U(z);
          {
            var ge = (se) => {
              var Te = Jm(), pe = Re(Te), Me = j(pe, 2), A = U(Me);
              fe((H) => ue(A, H), [() => de("Previous")]), ce("click", pe, () => {
                O(r, 0);
              }), ce("click", Me, d), B(se, Te);
            };
            Ee(J, (se) => {
              h(r) > 0 && se(ge);
            });
          }
          var me = j(J, 4);
          {
            var L = (se) => {
              var Te = $m(), pe = Re(Te), Me = U(pe), A = j(pe, 2);
              fe((H) => ue(Me, H), [() => de("Next")]), ce("click", A, () => {
                O(r, n().length - 1);
              }), B(se, Te);
            }, ae = (se) => {
              var Te = Qm(), pe = U(Te);
              fe((Me) => ue(pe, Me), [() => de("Save")]), B(se, Te);
            };
            Ee(me, (se) => {
              h(r) < n().length - 1 ? se(L) : se(ae, -1);
            });
          }
          var Pe = j(z, 2);
          {
            var _t = (se) => {
              var Te = Xm(), pe = j(Re(Te), 2), Me = U(pe), A = j(Me);
              {
                var H = (xe) => {
                  var ne = Ja();
                  fe((ze) => ue(ne, `(${ze ?? ""}: ${h(i).meta.lineno ?? ""})`), [() => de("Line")]), B(xe, ne);
                };
                Ee(A, (xe) => {
                  h(i).meta.lineno && xe(H);
                });
              }
              var X = j(pe, 2), x = U(X);
              fe(
                (xe, ne) => {
                  ue(Me, `${xe ?? ""} `), ue(x, ne);
                },
                [() => de("Source"), () => h(i).meta.get("__source__")]
              ), B(se, Te);
            }, st = /* @__PURE__ */ ie(() => h(i).meta.get("__source__"));
            Ee(Pe, (se) => {
              h(st) && se(_t);
            });
          }
          fe(
            (se) => {
              ue(K, `Entry
          ${h(f) ?? ""}
          of
          ${h(a) ?? ""}
          (${h(p) ?? ""}
          to import):`), Hc(ve, h(o)), ue(D, ` ${se ?? ""}`);
            },
            [() => de("ignore duplicate")]
          ), ce("click", ve, v), B(V, N);
        };
        Ee(F, (V) => {
          h(i) && V(R);
        });
      }
      fe(
        (V) => {
          _.noValidate = h(o), ue(w, V);
        },
        [() => de("Import")]
      ), an("submit", _, u), B(g, _);
    },
    $$slots: { default: !0 }
  }), qe();
}
zt(["click"]);
var ap = /* @__PURE__ */ ee("<div> </div>"), sp = /* @__PURE__ */ ee('<div class="alert-container svelte-10jq3uj"></div>'), ip = /* @__PURE__ */ ee('<div class="api-dashboard svelte-10jq3uj"><div class="dashboard-header svelte-10jq3uj"><h2 class="svelte-10jq3uj">API Integrations</h2> <button class="btn btn-primary">+ Add API</button></div> <!> <!></div> <!> <!> <!>', 1);
const op = {
  hash: "svelte-10jq3uj",
  code: ".api-dashboard.svelte-10jq3uj {padding:1rem;}.dashboard-header.svelte-10jq3uj {display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;}.dashboard-header.svelte-10jq3uj h2:where(.svelte-10jq3uj) {margin:0;}.alert-container.svelte-10jq3uj {margin-bottom:1rem;}.alert.svelte-10jq3uj {padding:10px 14px;margin-bottom:8px;border-radius:4px;font-size:0.9em;}.alert-success.svelte-10jq3uj {background:var(--color-background-positive, rgba(46, 204, 113, 0.15));color:var(--color-text-positive, #27ae60);border:1px solid var(--color-text-positive, #27ae60);}.alert-error.svelte-10jq3uj {background:var(--color-background-negative, rgba(231, 76, 60, 0.15));color:var(--color-text-negative, #c0392b);border:1px solid var(--color-text-negative, #c0392b);}.alert-warning.svelte-10jq3uj {background:rgba(243, 156, 18, 0.15);color:#d35400;border:1px solid #d35400;}"
};
function lp(e, t) {
  Fe(t, !0), rt(e, op);
  let n = /* @__PURE__ */ re(Ft([])), r = /* @__PURE__ */ re(Ft([])), a = /* @__PURE__ */ re(!1), s = /* @__PURE__ */ re(!1), i = /* @__PURE__ */ re(null), o = /* @__PURE__ */ re(Ft([])), l = /* @__PURE__ */ re(!1);
  bi(() => {
    const C = Di("#ledger-data", Sm);
    C.is_ok && Ie.set(C.value), d();
  });
  function u(C, M = "info") {
    const E = Math.random().toString(36).substring(2, 9);
    O(r, [...h(r), { id: E, type: M, message: C }], !0), setTimeout(
      () => {
        O(r, h(r).filter((z) => z.id !== E), !0);
      },
      6e3
    );
  }
  async function d() {
    try {
      const M = await (await fetch(`${qt()}dashboard`)).json();
      M.status === "success" ? O(n, M.items || M.data || [], !0) : u(M.message || "Failed to load dashboard data", "error");
    } catch (C) {
      u(`Network error: ${C.message}`, "error");
    }
  }
  function v(C) {
    O(i, C, !0), O(a, !0);
  }
  function f() {
    O(s, !0);
  }
  async function p(C) {
    try {
      u(`Extracting transactions for ${C.importer_name}...`, "success");
      const E = await (await fetch(`${qt()}extract?name=${encodeURIComponent(C.filename)}`)).json();
      if (E.status !== "success") {
        u(`Extraction failed: ${E.message}`, "error");
        return;
      }
      const z = Q(nh)(E.entries);
      if (z.is_err) {
        u(`Invalid entry data received: ${z.error.message}`, "error");
        return;
      }
      if (z.value.length === 0) {
        u("No entries found to import.", "warning");
        return;
      }
      O(o, z.value, !0), O(l, !0);
    } catch (M) {
      u(`Failed to extract: ${M.message}`, "error");
    }
  }
  function g() {
    O(l, !1), O(o, [], !0);
  }
  async function y() {
    const C = h(o).filter((M) => !M.is_duplicate());
    if (g(), C.length === 0) {
      u("All extracted entries were marked as duplicates; none committed.", "warning");
      return;
    }
    try {
      const E = await (await fetch(`${qt()}commit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries: C })
      })).json();
      E.status === "success" ? (u(`Successfully imported ${E.count} entries.`, "success"), d()) : u(`Failed to commit entries: ${E.message}`, "error");
    } catch (M) {
      u(`Error saving entries: ${M.message}`, "error");
    }
  }
  var _ = ip(), S = Re(_), w = U(S), F = j(U(w), 2), R = j(w, 2);
  {
    var V = (C) => {
      var M = sp();
      br(M, 21, () => h(r), (E) => E.id, (E, z) => {
        var J = ap(), ge = U(J);
        fe(() => {
          $a(J, 1, `alert alert-${h(z).type ?? ""}`, "svelte-10jq3uj"), ue(ge, h(z).message);
        }), B(E, J);
      }), B(C, M);
    };
    Ee(R, (C) => {
      h(r).length > 0 && C(V);
    });
  }
  var N = j(R, 2);
  nf(N, {
    get items() {
      return h(n);
    },
    onOpenEdit: v,
    onOpenImport: p,
    onSyncComplete: d,
    onAlert: u
  });
  var T = j(S, 2);
  {
    var k = (C) => {
      rp(C, {
        close: g,
        save: y,
        get entries() {
          return h(o);
        },
        set entries(M) {
          O(o, M, !0);
        }
      });
    };
    Ee(T, (C) => {
      h(l) && h(o).length > 0 && C(k);
    });
  }
  var K = j(T, 2);
  {
    var le = (C) => {
      sf(C, {
        get item() {
          return h(i);
        },
        onClose: () => {
          O(a, !1), O(i, null);
        },
        onSave: () => {
          O(a, !1), O(i, null), d();
        },
        onDelete: () => {
          O(a, !1), O(i, null), d();
        },
        onError: (M) => u(M, "error")
      });
    };
    Ee(K, (C) => {
      h(a) && h(i) && C(le);
    });
  }
  var ve = j(K, 2);
  {
    var D = (C) => {
      uf(C, {
        onClose: () => O(s, !1),
        onCreated: (M) => {
          O(s, !1), d();
          const E = {
            filename: M,
            path: M,
            importer_name: M.replace(/^api_/, "").replace(/\.yaml$/, ""),
            status: "ok",
            last_sync: null,
            balances: null
          };
          v(E);
        },
        onError: (M) => u(M, "error")
      });
    };
    Ee(ve, (C) => {
      h(s) && C(D);
    });
  }
  ce("click", F, f), B(e, _), qe();
}
zt(["click"]);
let fa = null;
const fp = {
  init: async function() {
    console.log("BankSync Svelte Module initialized.");
  },
  onExtensionPageLoad: function() {
    const e = document.getElementById("api-config-root");
    e && (fa && (Sl(fa), fa = null), e.innerHTML = "", fa = El(lp, {
      target: e
    }));
  }
};
export {
  fp as default
};
