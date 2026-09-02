(ns wisp.ast
  (:require [wisp.sequence :refer [list? sequential? first second count
                                   identity-set? last map vec repeat]]
            [wisp.string :refer [split join]]
            [wisp.runtime :refer [nil? vector? number? string? boolean?
                                  object? date? re-pattern? dictionary?
                                  str inc subs =]]))

(defun with-meta (value metadata)
  "Returns identical value with given metadata associated to it.
  nil is a singleton and can't carry metadata, so it passes through
  unchanged rather than crashing on Object.defineProperty."
  (if (nil? value)
    value
    (progn
      (.defineProperty Object value "metadata" {:value metadata :configurable true})
      value)))

(defun meta (value)
  "Returns the metadata of the given value or nil if there is no metadata."
  (if (nil? value) nil (.-metadata value)))

(defvar **ns-separator** "\u2044")

(defun- Symbol (namespace name)
  "Type for the symbols"
  (setf (.-namespace this) namespace)
  (setf (.-name this) name)
  this)
(setf Symbol.type "wisp.symbol")
(setf Symbol.prototype.type Symbol.type)
(setf Symbol.prototype.to-string
      (lambda ()
        (let* ((prefix (str "\uFEFF" "'"))
               (ns (namespace this)))
          (if ns
            (str prefix ns "/" (name this))
            (str prefix (name this))))))

(defun symbol (ns id)
  "Returns a Symbol with the given namespace and name."
  (cond
   ((symbol? ns) ns)
   ((keyword? ns) (Symbol. (namespace ns) (name ns)))
   ((nil? id) (Symbol. nil ns))
   (else (Symbol. ns id))))

(defun symbol? (x)
  (or (and (string? x)
           (identical? "\uFEFF" (aget x 0))
           (identical? "'" (aget x 1)))
      (and x
           (identical? Symbol.type x.type))))

(defun keyword? (x)
  (and (string? x)
       (> (count x) 1)
       (identical? (first x) "\uA789")))

(defun keyword (ns id)
  "Returns a Keyword with the given namespace and name. Do not use :
  in the keyword strings, it will be added automatically."
  (cond ((keyword? ns) ns)
        ((symbol? ns) (str "\uA789" (name ns)))
        ((nil? id) (str "\uA789" ns))
        ((nil? ns) (str "\uA789" id))
        (else (str "\uA789" ns **ns-separator** id))))

(defun- keyword-name (value)
  (last (split (subs value 1) **ns-separator**)))

(defun- symbol-name (value)
  (or (.-name value)
      (last (split (subs value 2) **ns-separator**))))

(defun name (value)
  "Returns the name String of a string, symbol or keyword."
  (cond ((symbol? value) (symbol-name value))
        ((keyword? value) (keyword-name value))
        ((string? value) value)
        (else (throw (TypeError. (str "Doesn't support name: " value))))))

(defun- keyword-namespace (x)
  (let* ((parts (split (subs x 1) **ns-separator**)))
    (if (> (count parts) 1) (aget parts 0))))

(defun- symbol-namespace (x)
  (let* ((parts (if (string? x)
                (split (subs x 1) **ns-separator**)
                [(.-namespace x) (.-name x)])))
    (if (> (count parts) 1) (aget parts 0))))

(defun namespace (x)
  "Returns the namespace String of a symbol or keyword, or nil if not present."
  (cond ((symbol? x) (symbol-namespace x))
        ((keyword? x) (keyword-namespace x))
        (else (throw (TypeError. (str "Doesn't supports namespace: " x))))))

(defun gensym (prefix)
  "Returns a new symbol with a unique name. If a prefix string is
  supplied, the name is prefix# where # is some unique number. If
  prefix is not supplied, the prefix is 'G__'."
  (symbol (str (if (nil? prefix) "G__" prefix)
               (setf gensym.base (+ gensym.base 1)))))
(setf gensym.base 0)


(defun unquote? (form)
  "Returns true if it's unquote form: ,foo"
  (and (list? form) (= (first form) 'unquote)))

(defun unquote-splicing? (form)
  "Returns true if it's unquote-splicing form: ,@foo"
  (and (list? form) (= (first form) 'unquote-splicing)))

(defun quote? (form)
  "Returns true if it's quote form: 'foo '(foo)"
  (and (list? form) (= (first form) 'quote)))

(defun syntax-quote? (form)
  "Returns true if it's syntax quote form: `foo `(foo)"
  (and (list? form) (= (first form) 'syntax-quote)))

(defun- normalize (n len)
  (loop ((ns (str n)))
    (if (< (count ns) len)
      (recur (str "0" ns))
      ns)))

(defun quote-string (s)
  (setq s (join "\\\"" (split s "\"")))
  (setq s (join "\\\\" (split s "\\")))
  (setq s (join "\\b" (split s "\b")))
  (setq s (join "\\f" (split s "\f")))
  (setq s (join "\\n" (split s "\n")))
  (setq s (join "\\r" (split s "\r")))
  (setq s (join "\\t" (split s "\t")))
  (str "\"" s "\""))

(defun pr-str (x offset)
  (let* ((offset (or offset 0)))
    (cond ((nil? x) "nil")
          ((keyword? x) (if (namespace x)
                         (str ":" (namespace x) "/" (name x))
                         (str ":" (name x))))
          ((symbol? x) (if (namespace x)
                        (str (namespace x) "/" (name x))
                        (name x)))
          ((string? x) (quote-string x))
          ((date? x) (str "#inst \""
                         (.getUTCFullYear x) "-"
                         (normalize (inc (.getUTCMonth x)) 2) "-"
                         (normalize (.getUTCDate x) 2) "T"
                         (normalize (.getUTCHours x) 2) ":"
                         (normalize (.getUTCMinutes x) 2) ":"
                         (normalize (.getUTCSeconds x) 2) "."
                         (normalize (.getUTCMilliseconds x) 3) "-"
                         "00:00\""))
          ((vector? x) (str "[" (join (str "\n " (join (repeat (inc offset) " ")))
                                     (map (lambda (item) (pr-str item (inc offset)))
                                          (vec x)))
                           "]"))
          ((dictionary? x) (str "{"
                               (join (str "\n" (join (repeat (inc offset) " ")))
                                     (map (lambda (pair)
                                            (let* ((indent (join (repeat offset " ")))
                                                  (key (pr-str (first pair)
                                                              (inc offset)))
                                                  (value (pr-str (second pair)
                                                                (+ 2 offset (count key)))))
                                              (str key " " value)))
                                          x))
                               "}"))
          ((identity-set? x) (str "#{" (join " " (map (lambda (item) (pr-str item (inc offset))) (vec x))) "}"))
          ((sequential? x) (str "(" (join " " (map (lambda (item) (pr-str item (inc offset)))
                                                  (vec x))) ")"))
          ((re-pattern? x) (str "#\"" (join "\\/" (split (.-source x) "/")) "\""))
          (else (str x)))))
