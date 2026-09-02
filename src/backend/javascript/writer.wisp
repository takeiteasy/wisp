(ns wisp.backend.javascript.writer
  "Compiler backend for for writing JS output"
  (:require [wisp.ast :refer [name namespace symbol symbol? keyword?]]
            [wisp.sequence :refer [list first second third rest list?
                                   vec map count last reduce empty?]]
            [wisp.runtime :refer [true? nil? string? number? vector?
                                  dictionary? boolean? re-pattern?
                                  re-find dec subs =]]
            [wisp.string :refer [replace join split upper-case]]))

;; Actual code

(defun write-reference (form)
  "Translates references from clojure convention to JS:

  **macros**      __macros__
  list->vector    listToVector
  set!            set
  foo_bar         foo_bar
  number?         isNumber
  create-server   createServer"
  (let* ((id (name form)))
    (setq id (cond ((identical? id  "*") "multiply")
                   ((identical? id "/") "divide")
                   ((identical? id "+") "sum")
                   ((identical? id "-") "subtract")
                   ((identical? id "=") "equal?")
                   ((identical? id "==") "strict-equal?")
                   ((identical? id "<=") "not-greater-than")
                   ((identical? id ">=") "not-less-than")
                   ((identical? id ">") "greater-than")
                   ((identical? id "<") "less-than")
                   ((identical? id "->") "thread-first")
                   (else id)))
    ;; **macros** ->  __macros__
    (setq id (join "_" (split id "*")))
    ;; list->vector ->  listToVector
    (setq id (join "-to-" (split id "->")))
    ;; set! ->  set
    (setq id (join (split id "!")))
    (setq id (join "$" (split id "%")))
    ;; foo= -> fooEqual
    ;(setq id (join "-equal-" (split id "=")))
    ;; foo+bar -> fooPlusBar
    (setq id (join "-plus-" (split id "+")))
    (setq id (join "-and-" (split id "&")))
    ;; number? -> isNumber
    (setq id (if (identical? (last id) "?")
               (str "is-" (subs id 0 (dec (count id))))
               id))
    ;; create-server -> createServer
    (setq id (reduce
              (lambda (result key)
                (str result
                     (if (and (not (empty? result))
                              (not (empty? key)))
                       (str (upper-case (get key 0)) (subs key 1))
                       key)))
              ""
              (split id "-")))
    id))

(defun write-keyword-reference (form)
  (str "\"" (name form) "\""))

(defun write-keyword (form) (str "\"" "\uA789" (name form) "\""))

(defun write-symbol (form)
  (write (list 'symbol (namespace form) (name form))))

(defun write-nil (form) "void(0)")

(defun write-number (form) form)

(defun write-boolean (form) (if (true? form) "true" "false"))

(defun write-string (form)
  (setq form (replace form (RegExp "\\\\" "g") "\\\\"))
  (setq form (replace form (RegExp "\n" "g") "\\n"))
  (setq form (replace form (RegExp "\r" "g") "\\r"))
  (setq form (replace form (RegExp "\t" "g") "\\t"))
  (setq form (replace form (RegExp "\"" "g") "\\\""))
  (str "\"" form "\""))

(defun write-template (&rest form)
  "Compiles given template"
  (let* ((indent-pattern #"\n *$")
        (line-break-patter (RegExp "\n" "g"))
        (get-indentation (lambda (code) (or (re-find indent-pattern code) "\n"))))
    (loop ((code "")
           (parts (split (first form) "~{}"))
           (values (rest form)))
      (if (> (count parts) 1)
        (recur
         (str
          code
          (first parts)
          (replace (str "" (first values))
                    line-break-patter
                    (get-indentation (first parts))))
         (rest parts)
         (rest values))
         (str code (first parts))))))


(defun write-group (&rest forms)
  (join ", " forms))

(defun write-invoke (callee &rest params)
  (write-template "~{}(~{})" callee (apply write-group params)))

(defun write-error (message)
  (lambda () (throw (Error message))))

(defvar write-vector (write-error "Vectors are not supported"))
(defvar write-dictionary (write-error "Dictionaries are not supported"))

(defun- escape-pattern (pattern)
  (setq pattern (join "/" (split pattern "\\/")))
  (setq pattern (join "\\/" (split pattern "/")))
  pattern)

(defun write-re-pattern (form)
  (let* ((flags (str (if form.multiline "m" "")
                   (if form.ignoreCase "i" "")
                   (if form.sticky "y" "")))
        (pattern form.source))
    (str \/ (escape-pattern pattern) \/ flags)))


(defun compile-comment (form)
  (compile-template (list "//~{}\n" (first form))))

(defun write-def (form)
  "Creates and interns or locates a global var with the name of symbol
  and a namespace of the value of the current namespace (*ns*). If init
  is supplied, it is evaluated, and the root binding of the var is set
  to the resulting value. If init is not supplied, the root binding of
  the var is unaffected. def always applies to the root binding, even if
  the var is thread-bound at the point where def is called. def yields
  the var itself (not its value)."
  (let* ((id (first form))
        (export? (and (:top (or (meta form) {}))
                     (not (:private (or (meta id) {})))))
        (attribute (symbol (namespace id)
                          (str "-" (name id)))))
    (if export?
      (compile-template (list "var ~{};\n~{}"
                               (compile (cons 'set! form))
                               (compile `(set! (. exports ,attribute) ,id))))
      (compile-template (list "var ~{}"
                              (compile (cons 'set! form)))))))


(defun write-instance? (form)
  "Evaluates x and tests if it is an instance of the class
  c. Returns true or false"
  (write-template "~{} instanceof ~{}"
                  (write (second form))
                  (write (first form))))
(defun write (form)
  "compiles given form"
  (cond
   ((nil? form) (write-nil form))
   ((symbol? form) (write-reference form))
   ((keyword? form) (write-keyword-reference form))
   ((string? form) (write-string form))
   ((number? form) (write-number form))
   ((boolean? form) (write-boolean form))
   ((re-pattern? form) (write-pattern form))
   ((vector? form) (write-vector form))
   ((dictionary? form) (write-dictionary))
   ((list? form) (apply write-invoke (map write (vec form))))
   (else (write-error "Unsupported form"))))
