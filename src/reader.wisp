(ns wisp.reader
  "Reader module provides functions for reading text input
  as wisp data structures"
  (:require [wisp.sequence :refer [list list? count empty? first second third
                                   rest map vec cons conj rest concat last
                                   butlast sort reduce set]]
            [wisp.runtime :refer [odd? dictionary keys nil? inc dec vector? string?
                                  number? boolean? object? dictionary? re-pattern
                                  re-matches re-find str subs char vals =]]
            [wisp.ast :refer [symbol? symbol keyword? keyword meta with-meta name
                              gensym]]
            [wisp.string :refer [split join]]))

(defun push-back-reader
  (source uri)
  "Creates a StringPushbackReader from a given string"
  {:lines (split source "\n") :buffer ""
   :uri uri
   :column -1 :line 0})

(defun peek-char
  (reader)
  "Returns next char from the Reader without reading it.
  nil if the end of stream has being reached."
  (let* ((line (aget (:lines reader)
                   (:line reader)))
        (column (inc (:column reader))))
    (if (nil? line)
      nil
      (or (aget line column) "\n"))))

(defun read-char
  (reader)
  "Returns the next char from the Reader, nil if the end
  of stream has been reached"
  (let* ((ch (peek-char reader)))
    ;; Update line column depending on what has being read.
    (if (newline? (peek-char reader))
      (progn
        (setf (:line reader) (inc (:line reader)))
        (setf (:column reader) -1))
      (setf (:column reader) (inc (:column reader))))
    ch))

;; Predicates

(defun newline?
  (ch)
  "Checks whether the character is a newline."
  (identical? "\n" ch))

(defun breaking-whitespace?
  (ch)
 "Checks if a string is all breaking whitespace."
 (or (identical? ch " ")
     (identical? ch "\t")
     (identical? ch "\n")
     (identical? ch "\r")))

(defun whitespace?
  (ch)
  "Checks whether a given character is whitespace"
  (breaking-whitespace? ch))

(defun numeric?
  (ch)
 "Checks whether a given character is numeric"
 (or (identical? ch \0)
     (identical? ch \1)
     (identical? ch \2)
     (identical? ch \3)
     (identical? ch \4)
     (identical? ch \5)
     (identical? ch \6)
     (identical? ch \7)
     (identical? ch \8)
     (identical? ch \9)))

(defun comment-prefix?
  (ch)
  "Checks whether the character begins a comment."
  (identical? ";" ch))


(defun number-literal?
  (reader initch)
  "Checks whether the reader is at the start of a number literal"
  (or (numeric? initch)
      (and (or (identical? \+ initch)
               (identical? \- initch))
           (numeric? (peek-char reader)))))



;; read helpers

(defun reader-error
  (reader message)
  (let* ((text (str message
                  "\n" "line:" (:line reader)
                  "\n" "column:" (:column reader)))
        (error (SyntaxError text (:uri reader))))
    (setf error.line (:line reader))
    (setf error.column (:column reader))
    (setf error.uri (:uri reader))
    (throw error)))

(defun macro-terminating? (ch)
  (and (not (identical? ch "#"))
       (not (identical? ch "'"))
       (not (identical? ch ":"))
       (macros ch)))


(defun read-token
  (reader initch)
  "Reads out next token from the reader stream"
  (loop ((buffer initch)
         (ch (peek-char reader)))

    (if (or (nil? ch)
            (whitespace? ch)
            (macro-terminating? ch)) buffer
        (recur (str buffer (read-char reader))
               (peek-char reader)))))

(defun skip-line
  (reader _)
  "Advances the reader to the end of a line. Returns the reader"
  (loop ()
    (let* ((ch (read-char reader)))
      (if (or (identical? ch "\n")
              (identical? ch "\r")
              (nil? ch))
        reader
        (recur)))))


;; Note: Input begin and end matchers are used in a pattern since otherwise
;; anything begininng with `0` will match just `0` cause it's listed first.
(defvar int-pattern (re-pattern "^([-+]?)(?:(0)|([1-9][0-9]*)|0[xX]([0-9A-Fa-f]+)|0([0-7]+)|([1-9][0-9]?)[rR]([0-9A-Za-z]+)|0[0-9]+)(N)?$"))
(defvar ratio-pattern (re-pattern "([-+]?[0-9]+)/([0-9]+)"))
(defvar float-pattern (re-pattern "([-+]?[0-9]+(\\.[0-9]*)?([eE][-+]?[0-9]+)?)(M)?"))

(defun match-int
  (s)
  (let* ((groups (re-find int-pattern s))
        (group3 (aget groups 2)))
    (if (not (or (nil? group3)
                 (< (count group3) 1)))
      0
      (let* ((negate (if (identical? "-" (aget groups 1)) -1 1))
            (a (cond
               ((aget groups 3) [(aget groups 3) 10])
               ((aget groups 4) [(aget groups 4) 16])
               ((aget groups 5) [(aget groups 5) 8])
               ((aget groups 7) [(aget groups 7) (parse-int (aget groups 7))])
               (else [nil nil])))
            (n (aget a 0))
            (radix (aget a 1)))
        (if (nil? n)
          nil
          (* negate (parse-int n radix)))))))

(defun match-ratio
  (s)
  (let* ((groups (re-find ratio-pattern s))
        (numinator (aget groups 1))
        (denominator (aget groups 2)))
    (/ (parse-int numinator) (parse-int denominator))))

(defun match-float
  (s)
  (parse-float s))


(defun match-number
  (s)
  (cond
   ((re-matches int-pattern s) (match-int s))
   ((re-matches ratio-pattern s) (match-ratio s))
   ((re-matches float-pattern s) (match-float s))))

(defun escape-char-map (c)
  (cond
   ((identical? c \t) "\t")
   ((identical? c \r) "\r")
   ((identical? c \n) "\n")
   ((identical? c \\) \\)
   ((identical? c "\"") "\"")
   ((identical? c \b) "\b")
   ((identical? c \f) "\f")
   (else nil)))

;; unicode

(defun read-2-chars (reader)
  (str (read-char reader)
       (read-char reader)))

(defun read-4-chars (reader)
  (str (read-char reader)
       (read-char reader)
       (read-char reader)
       (read-char reader)))

(defvar unicode-2-pattern (re-pattern "[0-9A-Fa-f]{2}"))
(defvar unicode-4-pattern (re-pattern "[0-9A-Fa-f]{4}"))


(defun validate-unicode-escape
  (unicode-pattern reader escape-char unicode-str)
  "Validates unicode escape"
  (if (re-matches unicode-pattern unicode-str)
    unicode-str
    (reader-error
     reader
     (str "Unexpected unicode escape " \\ escape-char unicode-str))))


(defun make-unicode-char
  (code-str base)
  (let* ((base (or base 16))
        (code (parseInt code-str base)))
    (char code)))

(defun escape-char
  (buffer reader)
  "escape char"
  (let* ((ch (read-char reader))
        (mapresult (escape-char-map ch)))
    (if mapresult
      mapresult
      (cond
        ((identical? ch \x) (make-unicode-char
                            (validate-unicode-escape unicode-2-pattern
                                                     reader
                                                     ch
                                                     (read-2-chars reader))))
        ((identical? ch \u) (make-unicode-char
                            (validate-unicode-escape unicode-4-pattern
                                                     reader
                                                     ch
                                                     (read-4-chars reader))))
        ((numeric? ch) (char ch))
        (else (reader-error reader
                            (str "Unexpected unicode escape " \\ ch )))))))

(defun read-past
  (predicate reader)
  "Read until first character that doesn't match pred, returning
  char."
  (loop ((_ nil))
    (if (predicate (peek-char reader))
      (recur (read-char reader))
      (peek-char reader))))


;; TODO: Complete implementation
(defun read-delimited-list
  (delim reader recursive?)
  "Reads out delimited list"
  (loop ((forms []))
    (let* ((_ (read-past whitespace? reader))
          (ch (read-char reader)))
      (if (not ch) (reader-error reader :EOF))
      (if (identical? delim ch)
        forms
        (let* ((form (read-form reader ch)))
          (recur (if (identical? form reader)
                   forms
                   (conj forms form))))))))

;; data structure readers

(defun not-implemented
  (reader ch)
  (reader-error reader (str "Reader for " ch " not implemented yet")))


(defun read-dispatch
  (reader _)
  (let* ((ch (read-char reader))
        (dm (dispatch-macros ch)))
    (if dm
      (dm reader _)
      (let* ((object (maybe-read-tagged-type reader ch)))
        (if object
          object
          (reader-error reader "No dispatch macro for " ch))))))

(defun read-unmatched-delimiter
  (rdr ch)
  (reader-error rdr "Unmatched delimiter " ch))

(defun read-list
  (reader _)
  (let* ((form (read-delimited-list ")" reader true)))
    (with-meta (apply list form) (meta form))))

(defun read-comment
  (reader _)
  (loop ((buffer "")
         (ch (read-char reader)))

    (cond
     ((or (nil? ch)
         (identical? "\n" ch)) (or reader ;; ignore comments for now
                                   (list 'comment buffer)))
     ((or (identical? \\ ch)) (recur (str buffer (escape-char buffer reader))
                                    (read-char reader)))
     (else (recur (str buffer ch) (read-char reader))))))

(defun read-vector
  (reader)
  (read-delimited-list "]" reader true))

(defun read-map
  (reader)
  (let* ((form (read-delimited-list "}" reader true)))
    (if (odd? (count form))
      (reader-error reader "Map literal must contain an even number of forms")
      (with-meta (apply dictionary form) (meta form)))))

(defun read-set
  (reader _)
  (let* ((form (read-delimited-list "}" reader true)))
    (with-meta (concat ['set] form) (meta form))))

(defun read-number
  (reader initch)
  (loop ((buffer initch)
         (ch (peek-char reader)))

    (if (or (nil? ch)
            (whitespace? ch)
            (macros ch))
      (let* ((match (match-number buffer)))
        (if (nil? match)
            (reader-error reader "Invalid number format [" buffer "]")
            (Number. match)))
      (recur (str buffer (read-char reader))
             (peek-char reader)))))

(defun read-string
  (reader)
  (loop ((buffer "")
         (ch (read-char reader)))

    (cond
     ((nil? ch) (reader-error reader "EOF while reading string"))
     ((identical? \\ ch) (recur (str buffer (escape-char buffer reader))
                               (read-char reader)))
     ((identical? "\"" ch) (String. buffer))
     (else (recur (str buffer ch) (read-char reader))))))

(defun read-character
  (reader)
  (String. (read-char reader)))

(defun read-unquote
  (reader)
  "Reads unquote form ,form or ,(foo bar)"
  (let* ((ch (peek-char reader)))
    (if (not ch)
      (reader-error reader "EOF while reading character")
      (if (identical? ch \@)
        (progn (read-char reader)
            (list 'unquote-splicing (read reader true nil true)))
        (list 'unquote (read reader true nil true))))))


(defun special-symbols (text not-found)
  (cond
   ((identical? text "nil") nil)
   ((identical? text "true") true)
   ((identical? text "false") false)
   (else not-found)))


(defun read-symbol
  (reader initch)
  (let* ((token (read-token reader initch))
        (parts (split token "/"))
        (has-ns (and (> (count parts) 1)
                    ;; Make sure it's not just `/`
                    (> (count token) 1)))
        (ns (first parts))
        (name (join "/" (rest parts))))
    (if has-ns
      (symbol ns name)
      (special-symbols token (symbol token)))))

(defun read-keyword
  (reader initch)
  (let* ((token (read-token reader (read-char reader)))
        (parts (split token "/"))
        (name (last parts))
        (ns (if (> (count parts) 1) (join "/" (butlast parts))))
        (issue (cond
               ((identical? (last ns) \:) "namespace can't ends with \":\"")
               ((identical? (last name) \:) "name can't end with \":\"")
               ((identical? (last name) \/) "name can't end with \"/\"")
               ((> (count (split token "::")) 1) "name can't contain \"::\""))))
    (if issue
      (reader-error reader "Invalid token (" issue "): " token)
      (if (and (not ns) (identical? (first name) \:))
        (keyword ;*ns-sym*
          (rest name)) ;; namespaced keyword using default
        (keyword ns name)))))

(defun wrapping-reader
  (prefix)
  (lambda (reader)
    (list prefix (read reader true nil true))))

(defun throwing-reader
  (msg)
  (lambda (reader)
    (reader-error reader msg)))

(defun read-regex
  (reader)
  (loop ((buffer "")
         (ch (read-char reader)))

    (cond
     ((nil? ch) (reader-error reader "EOF while reading string"))
     ((identical? \\ ch) (recur (str buffer ch (read-char reader))
                               (read-char reader)))
     ((identical? "\"" ch) (re-pattern buffer))
     (else (recur (str buffer ch) (read-char reader))))))

(defun read-discard
  (reader _)
  "Discards next form"
  (read reader true nil true)
  reader)

(defun macros (c)
  (cond
   ((identical? c "\"") read-string)
   ((identical? c \\) read-character)
   ((identical? c \:) read-keyword)
   ((identical? c ";") read-comment)
   ((identical? c \') (wrapping-reader 'quote))
   ((identical? c \@) (wrapping-reader 'deref))
   ((identical? c \`) (wrapping-reader 'syntax-quote))
   ((identical? c \,) read-unquote)
   ((identical? c \() read-list)
   ((identical? c \)) read-unmatched-delimiter)
   ((identical? c \[) read-vector)
   ((identical? c \]) read-unmatched-delimiter)
   ((identical? c \{) read-map)
   ((identical? c \}) read-unmatched-delimiter)
   ((identical? c \#) read-dispatch)
   (else nil)))


(defun dispatch-macros (s)
  (cond
   ((identical? s \{) read-set)
   ((identical? s \<) (throwing-reader "Unreadable form"))
   ((identical? s "\"") read-regex)
   ((identical? s \!) read-comment)
   ((identical? s \_) read-discard)
   (else nil)))

(defun read-form
  (reader ch)
  (let* ((start {:line (:line reader)
               :column (:column reader)})
        (read-macro (macros ch))
        (form (cond (read-macro (read-macro reader ch))
                   ((number-literal? reader ch) (read-number reader ch))
                   (else (read-symbol reader ch))))
        (end {:line (:line reader)
             :column (inc (:column reader))})
        (location {:uri (:uri reader)
                  :start start
                  :end end}))
    (cond ((identical? form reader) form)
          ;; TODO consider boxing primitives into associtade
          ;; types to include metadata on those.
          ((not (or (boolean? form)
                   (nil? form)
                   (keyword? form))) (with-meta form
                                       (conj location (meta form))))
          (else form))))

(defun read
  (reader eof-is-error sentinel is-recursive)
  "Reads the first object from a PushbackReader.
  Returns the object read. If EOF, throws if eof-is-error is true.
  Otherwise returns sentinel."
  (loop ()
    (let* ((ch (read-char reader))
          (form (cond
                ((nil? ch) (if eof-is-error (reader-error reader :EOF) sentinel))
                ((whitespace? ch) reader)
                ((comment-prefix? ch) (read (read-comment reader ch)
                                           eof-is-error
                                           sentinel
                                           is-recursive))
                (else (read-form reader ch)))))
      (if (identical? form reader)
        (recur)
        form))))

(defun read*
  (source uri)
  (let* ((reader (push-back-reader source uri))
        (eof (gensym)))
    (loop ((forms [])
           (form (read reader false eof false)))
      (if (identical? form eof)
        forms
        (recur (conj forms form)
               (read reader false eof false))))))



(defun read-from-string
  (source uri)
  "Reads one object from the string s"
  (let* ((reader (push-back-reader source uri)))
    (read reader true nil false)))

(defun- read-uuid
  (uuid)
  (if (string? uuid)
    `(UUID. ,uuid)
    (reader-error
     nil "UUID literal expects a string as its representation.")))

(defun- read-queue
  (items)
  (if (vector? items)
    `(PersistentQueue. ,items)
    (reader-error
     nil "Queue literal expects a vector for its elements.")))

(defun- read-date
  (date)
  (if (string? date)
    `(Date. ,date)
    (reader-error
     nil "Date literal expects a string as its representation.")))


(defvar **tag-table**
  (dictionary :uuid  read-uuid
              :queue read-queue
              :inst  read-date))

(defun maybe-read-tagged-type
  (reader initch)
  (let* ((tag (read-symbol reader initch))
        (pfn (get **tag-table** (name tag))))
    (if pfn
      (pfn (read reader true nil false))
      (reader-error reader
                    (str "Could not find tag parser for "
                         (name tag)
                         " in "
                         (str (keys **tag-table**)))))))
