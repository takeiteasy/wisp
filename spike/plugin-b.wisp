;; wisp cordis plugin: injects the `greeter` service, uses it, and
;; returns a disposer so we can prove fiber teardown runs wisp cleanup.
(defn plugin-b [ctx]
  (let [g (.-greeter ctx)
        msg (.hello g "wisp-plugin")]
    (.log js/console (+ "plugin-b: greeter says -> " msg))
    (fn []
      (.log js/console "plugin-b: disposer ran")
      (set! (.-wispDisposed js/globalThis) true))))

(set! (.-inject plugin-b) ["greeter"])
(set! (.-exports js/module) plugin-b)
