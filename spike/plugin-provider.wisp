;; wisp cordis plugin that PROVIDES a service — no `class extends Service`,
;; just ctx.provide with a plain object. Unregistered automatically on unload.
(set! (.-count js/globalThis) 0)
(defn counter-plugin [ctx]
  (.provide ctx "counter"
    {:next (fn [] (set! (.-count js/globalThis) (+ 1 (.-count js/globalThis))))})
  (.log js/console "counter-plugin: provided :counter"))
(set! (.-exports js/module) counter-plugin)
