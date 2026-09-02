(ns wisp.test.util
  "Kind of ugly hack for defining *failures* globals"
  (:require [wisp.sequence :refer [count]]
            [wisp.ast :refer [pr-str symbol]]))

(defvar *passed* [])
(defvar *failed* [])
;; Since macros so far don't bind scope we need this hack.
(setf global.*failed* *failed*)
(setf global.*passed* *passed*)
(setf global.symbol symbol)
(setf global.pr-str pr-str)

(.once process :exit (lambda ()
                       (print "\nPassed: " (count *passed*)
                              " Failed: " (count *failed*))
                       (if (> (count *failed*) 0)
                         (.exit process 1))))

(defmacro is
  (form &optional (msg ""))
  "Generic assertion macro. 'form' is any predicate test.
  'msg' is an optional message to attach to the assertion.
  Example: (is (= 4 (+ 2 2)) \"Two plus two should be 4\")

  Special forms:

  (is (thrown? c body)) checks that an instance of c is thrown from
  body, fails if not; then returns the thing thrown.

  (is (thrown-with-msg? c re body)) checks that an instance of c is
  thrown AND that the message on the exception matches (with
  re-find) the regular expression re."
  (let* ((op (first form))
        (actual (second form))
        (expected (third form)))
    `(if ,form
       (progn
         (.push *passed* ,msg)
         true)
       (progn
         (.push *failed* ',form)
         (console.error (str "Fail: " ,msg "\n"
                     "expected: "
                     (pr-str ',form) "\n"
                     "  actual: "
                     (pr-str (try ,actual (catch error (list 'throw (list 'Error (.-message error))))))))
         false))))

(defmacro thrown?
  (expression pattern)
  `(try
     (progn
       ,expression
       false)
    (catch error
      (if (re-find ,pattern (str error))
        true
        false))))
