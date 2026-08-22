(ns build-qjs-bundle (:require [browserify]))

(-> (browserify "./qjs_bundle.js" {:standalone "Wisp"})
    (.bundle)
    (.pipe process.stdout))
