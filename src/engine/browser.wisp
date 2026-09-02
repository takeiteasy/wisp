(ns runner.main
  (:require [wisp.compiler :refer [compile]]))

(defvar _wisp_runtime (require "../runtime.js"))
(defvar _wisp_sequence (require "../sequence.js"))
(defvar _wisp_string (require "../string.js"))

(defun fetch-source (src callback)
  (let* ((xhr (new XMLHttpRequest)))
    ;(.addEventListener xhr "timeout" (lambda (ev) (console.log "Timeout loading" src)) false)
    (.open xhr "GET" src true)
    (.addEventListener xhr "load"
                       (lambda (ev)
                         (if (and (>= xhr.status 200) (< xhr.status 300))
                           (callback xhr.responseText)
                           (console.error xhr.statusText))) false)
    ;(setf (.-timeout xhr) 30)
    (if xhr.overrideMimeType
      (xhr.overrideMimeType "text/plain"))
    (xhr.setRequestHeader "If-Modified-Since" "Fri, 01 Jan 1960 00:00:00 GMT")
    (.send xhr null)))

(defun run-wisp-code (code url)
  (let* ((result (compile code {:source-uri (or url "inline")}))
        (error (:error result)))
    (if error
      (console.error error)
      ((Function (eval (:code result)))))))

(defun fetch-and-run-wisp-code (url)
  (fetch-source url
                (lambda (code)
                  (run-wisp-code code url))))

(defun __main__ (ev)
  ; hoist wisp builtins into the global window context
  (.forEach [_wisp_string _wisp_sequence _wisp_runtime]
            (lambda (f)
              (.forEach (.keys Object f)
                        (lambda (k) (setf (get window k) (get f k))))))
  ;(console.log "running __main__")
  ; find all the script tags on the page
  (let* ((scripts (document.getElementsByTagName "script")))
    (loop ((x 0))
      ; loop through every script tag
      (if (< x scripts.length)
        (let* ((script (get scripts x))
              (source (.-src script))
              (content (.-text script))
              (content-type (.-type script)))
          ;(console.log "src:" (.-src script))
          ;(console.log "type:" (.-type script))
          ;(console.log "content:" (.-text script))
          ; if the script tag has application/wisp as the type then run it
          (if (== content-type "application/wisp")
            (progn
              (if source
                (fetch-and-run-wisp-code source))
              (if content
                (run-wisp-code content source))))
          (recur (+ x 1)))))))

(.addEventListener window "load" __main__ false)
