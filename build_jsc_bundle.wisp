(ns build-jsc-bundle (:require [browserify] [fs]))

(def output-path "./Sources/MacLisp/Resources/wisp_jsc.js")

(-> (browserify "./jsc_bundle.js" {:standalone "Wisp"})
    (.bundle)
    (.pipe (fs.createWriteStream output-path)))

(console.log "Building wisp_jsc.js to" output-path)
