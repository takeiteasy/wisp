(ns wisp.jsc-bundle)

(def runtime (require "./runtime"))
(def sequence (require "./sequence"))
(def string (require "./string"))
(def compiler (require "./compiler"))

(defn compile-wrapper [source options]
  (compiler.compile source options))

(set! module.exports {
  :runtime runtime
  :sequence sequence
  :string string
  :compile compile-wrapper
})