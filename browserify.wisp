(ns browserify (:require [browserify]))

(-> "engine/browser backend/javascript/writer analyzer ast compiler expander reader runtime sequence string"
    (.split " ")
    (.reduce (lambda (bundler k) (.require bundler (str "./" k) {:expose (str "wisp/" k)}))
             (browserify "./engine/browser.js"))
    (.bundle)
    (.pipe process.stdout))
