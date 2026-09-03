(ns demo.hello)

;; A tiny wisp program for trying out the `wisc` runner:
;;
;;   ./build/wisc examples/hello.wisp
;;
;; Requires another local module to show off require support.

(defvar greeter (require "./greeter.wisp"))

(print (.greet greeter "wisp"))
(print (apply + [1 2 3 4 5]))
