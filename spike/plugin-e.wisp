;; wisp cordis plugin using ctx.effect for cleanup — survives cordis
;; treating the wisp `defn` function as a constructor (no arrow wrap needed).
(defn plugin-e [ctx]
  (.effect ctx
    (fn []
      (.log js/console "plugin-e: effect body")
      (fn []
        (.log js/console "plugin-e: effect disposer")
        (set! (.-wispEffectDisposed js/globalThis) true)))
    "wisp-effect"))
(set! (.-exports js/module) plugin-e)
