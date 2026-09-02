(ns wisp.engine.node
  (:require [fs :refer [read-file-sync]]
            [wisp.compiler :refer [compile]]))

(setf global.**verbose** (<= 0 (.indexOf process.argv :--verbose)))

(defun compile-path
  (path)
  (let* ((source (read-file-sync path :utf8))
        (output (compile source {:source-uri path})))
    (if (:error output)
      (throw (:error output))
      (:code output))))

;; Register `.wisp` file extension so that
;; modules can be simply required.
(setf (get require.extensions ".wisp")
      (lambda (src path)
        (._compile src (compile-path path) path)))
