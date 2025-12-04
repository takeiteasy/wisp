(ns build-jsc-bundle (:require [browserify]))

(-> (browserify "./jsc_bundle.js" {:standalone "Wisp"})
    (.bundle)
    (.pipe process.stdout))
