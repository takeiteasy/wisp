(ns wisp.test.async
  "Behavioral tests for async/await (#8). Assertions run inside .then
  callbacks; node keeps the process alive until the promises settle, and
  the exit hook in wisp.test.util still sees the updated pass/fail counts."
  (:require [wisp.test.util :refer [is]]
            [wisp.runtime :refer [=]]))

;; await unwraps a native promise inside an async defun
(defun-async add-later (x)
  (+ x (await (js/Promise.resolve 100))))

(.then (add-later 1)
       (lambda (v)
         (is (= v 101) "await resolves inside an async defun")))

;; async arrow via the async special form composing with lambda*
(defvar double-later
  (async (lambda* (x)
           (* 2 (await (js/Promise.resolve x))))))

(.then (double-later 21)
       (lambda (v)
         (is (= v 42) "async arrow (async (lambda* ...)) awaits")))

;; lambda-async with a name supports self-recursion
(defun-async countdown (n)
  (if (< n 1)
    :done
    (progn (await (js/Promise.resolve n))
           (countdown (- n 1)))))

(.then (countdown 3)
       (lambda (v)
         (is (= v :done) "named async defun recurses")))

;; an async fn returns a real promise even without awaits
(defun-async plain (x) x)

(.then (plain 5)
       (lambda (v)
         (is (= v 5) "async fn return value resolves")))
