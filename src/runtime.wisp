(ns wisp.runtime
  "Core primitives required for runtime")


(defvar- -wisp-types
  (Object.freeze
    {:list     "wisp.list"
     :lazy-seq "wisp.lazy.seq"
     :set      "wisp.identity-set"}))

(defun lazy-seq?
  (value)
  (and value (identical? (:lazy-seq -wisp-types) value.type)))

(defun identity-set?
  (value)
  (and value (identical? (:set -wisp-types) value.type)))

(defun list?
  (value)
  "Returns true if list"
  (and value (identical? (:list -wisp-types) value.type)))


(defun identity
  (x)
  "Returns its argument."
  x)

(defun complement
  (f)
  "Takes a fn f and returns a fn that takes the same arguments as f,
  has the same effects, if any, and returns the opposite truth value."
  (lambda (&rest args) (not (apply f args))))

(defun odd? (n)
  (identical? (rem n 2) 1))

(defun even? (n)
  (identical? (rem n 2) 0))

(defun get (target key default*)
  (cond ((set? target) (if (.has target key) key default*))
        (else         (if (and target (.has-own-property target key))
                        (aget target key)
                        default*))))

(defun dictionary?
  (form)
  "Returns true if dictionary"
  (and (object? form)
       ;; Inherits right form Object.prototype
       (object? (.get-prototype-of Object form))
       (nil? (.get-prototype-of Object (.get-prototype-of Object form)))))

(defun dictionary
  (&rest pairs)
  "Creates dictionary of given arguments. Odd indexed arguments
  are used for keys and evens for values"
  ; TODO: We should convert keywords to names to make sure that keys are not
  ; used in their keyword form.
  (loop ((key-values pairs)
         (result {}))
    (if (.-length key-values)
      (progn
        (setf (aget result (aget key-values 0))
              (aget key-values 1))
        (recur (.slice key-values 2) result))
      result)))

(defun keys
  (dictionary)
  "Returns a sequence of the map's keys"
  (.keys Object dictionary))

(defun vals
  (dictionary)
  "Returns a sequence of the map's values."
  (.map (keys dictionary)
        (lambda (key) (get dictionary key))))

(defun key-values
  (dictionary)
  (.map (keys dictionary)
        (lambda (key) [key (get dictionary key)])))

(defun merge
  ()
  "Returns a dictionary that consists of the rest of the maps conj-ed onto
  the first. If a key occurs in more than one map, the mapping from
  the latter (left-to-right) will be the mapping in the result."
  (Object.create
   Object.prototype
   (.reduce
    (.call Array.prototype.slice arguments)
    (lambda (descriptor dictionary)
      (if (object? dictionary)
        (.for-each
         (Object.keys dictionary)
         (lambda (key)
           (setf
            (get descriptor key)
            (Object.get-own-property-descriptor dictionary key)))))
      descriptor)
    (Object.create Object.prototype))))


(defun satisfies?
  (protocol x)
  "Returns true if x satisfies the protocol"
  (or (.-wisp_core$IProtocol$_ protocol)
      (cond ((nil? x)
            (or (.-wisp_core$IProtocol$nil protocol) false))

            (else (or (aget x (aget protocol 'wisp_core$IProtocol$id))
                      (aget protocol
                            (str "wisp_core$IProtocol$"
                                 (.replace (.replace (.call Object.prototype.toString x)
                                                     "[object " "")
                                           #"\]$" "")))
                      false)))))

(defun contains-vector?
  (vector element)
  "Returns true if vector contains given element"
  (>= (.index-of vector element) 0))


(defun map-dictionary
  (source f)
  "Maps dictionary values by applying `f` to each one"
  (.reduce (.keys Object source)
           (lambda (target key)
              (setf (get target key) (f (get source key)))
              target) {}))

(defvar to-string Object.prototype.to-string)

;; Returns true if x is a function
(defvar
  fn?
  (if (identical? (typeof #".") "function")
    (lambda
      (x)
      (identical? (.call to-string x) "[object Function]"))
    (lambda
      (x)
      (identical? (typeof x) "function"))))

(defun error?
  (x)
  "Returns true if x is of error type"
  (or (instance? Error x)
      (identical? (.call to-string x) "[object Error]")))

(defun string?
  (x)
  "Return true if x is a string"
  (or (identical? (typeof x) "string")
      (identical? (.call to-string x) "[object String]")))

(defun number?
  (x)
  "Return true if x is a number"
  (or (identical? (typeof x) "number")
      (identical? (.call to-string x) "[object Number]")))

;; Returns true if x is a vector
(defvar
  vector?
  (if (fn? Array.isArray)
    Array.isArray
    (lambda (x) (identical? (.call to-string x) "[object Array]"))))

(defun iterable?
  (x)
  "Returns true if x is or can produce a JS iterator"
  (fn? (get x Symbol.iterator)))

(defun date?
  (x)
  "Returns true if x is a date"
  (identical? (.call to-string x) "[object Date]"))

(defun boolean?
  (x)
  "Returns true if x is a boolean"
  (or (identical? x true)
      (identical? x false)
      (identical? (.call to-string x) "[object Boolean]")))

(defun re-pattern?
  (x)
  "Returns true if x is a regular expression"
  (identical? (.call to-string x) "[object RegExp]"))

(defun set?
  (x)
  "Returns true if x is a JS Set instance"
  (instance? Set x))


(defun object?
  (x)
  "Returns true if x is an object"
  (and x (identical? (typeof x) "object")))

(defun nil?
  (x)
  "Returns true if x is undefined or null"
  ;; `nil` compiles to the real JS `null` literal (Phase 2's nil
  ;; singleton), so a bare `(identical? x nil)` no longer distinguishes
  ;; it from `(identical? x null)` -- both compile to `x === null`.
  ;; JS's own `undefined` (e.g. a missing regex capture group, an
  ;; absent object property) still needs to count as nil-like at the
  ;; interop boundary, so it's checked explicitly here.
  (or (identical? x nil)
      (identical? x undefined)))

(defun true?
  (x)
  "Returns true if x is true"
  (identical? x true))

(defun false?
  (x)
  "Returns true if x is false"
  (identical? x false))

(defun re-find
  (re s)
  "Returns the first regex match, if any, of s to re, using
  re.exec(s). Returns a vector, containing first the matching
  substring, then any capturing groups if the regular expression contains
  capturing groups."
  (let* ((matches (.exec re s)))
    (if (not (nil? matches))
      (if (identical? (.-length matches) 1)
        (get matches 0)
        matches))))

(defun re-matches
  (pattern source)
  (let* ((matches (.exec pattern source)))
    (if (and (not (nil? matches))
             (identical? (get matches 0) source))
      (if (identical? (.-length matches) 1)
        (get matches 0)
        matches))))

(defun re-pattern
  (s)
  "Returns an instance of RegExp which has compiled the provided string."
  (let* ((match (re-find #"^(?:\(\?([idmsux]*)\))?(.*)" s)))
    (new RegExp (get match 2) (get match 1))))

(defun inc
  (x)
  (+ x 1))

(defun dec
  (x)
  (- x 1))

(defun str
  ()
  "With no args, returns the empty string. With one arg x, returns x.toString().
  With more than one arg, returns the concatenation of the str values of the args."
  (.apply String.prototype.concat "" arguments))

(defun char
  (code)
  "Coerce to char"
  (.fromCharCode String code))


(defun int
  (x)
  "Coerce to int by stripping decimal places."
  (cond ((number? x) (.floor Math x))
        ((string? x) (.charCodeAt x 0))   ; not like in Clojure
        (else       0)))                 ; like in Clojure

(defun subs
  (string start end)
  "Returns the substring of s beginning at start inclusive, and ending
  at end (defaults to length of string), exclusive."
   (.substring string start end))

(defun- pattern-equal?
  (x y)
  (and (re-pattern? x)
       (re-pattern? y)
       (identical? (.-source x) (.-source y))
       (identical? (.-global x) (.-global y))
       (identical? (.-multiline x) (.-multiline y))
       (identical? (.-ignoreCase x) (.-ignoreCase y))))

(defun- date-equal?
  (x y)
  (and (date? x)
       (date? y)
       (identical? (Number x) (Number y))))


(defun- set-equal?
  (x y)
  (and (set? x)
       (set? y)
       (identical? x.size y.size)
       (.every (Array.from x) (lambda (%) (y.has %)))))

(defun- dictionary-equal?
  (x y)
  (and (object? x)
       (object? y)
       (let* ((x-keys (keys x))
             (y-keys (keys y))
             (x-count (.-length x-keys))
             (y-count (.-length y-keys)))
         (and (identical? x-count y-count)
              (loop ((index 0)
                     (count x-count)
                     (keys x-keys))
                (if (< index count)
                  (if (equivalent? (get x (get keys index))
                                   (get y (get keys index)))
                    (recur (inc index) count keys)
                    false)
                  true))))))

(defun- equivalent?
  (x &rest args)
  "Equality. Returns true if x equals y, false if not. Compares
  numbers and collections in a type-independent manner. Clojure's
  immutable data structures define -equiv (and thus =) as a value,
  not an identity, comparison."
  (let* ((n (.-length args)))
    (cond ((identical? n 0) true)
          ((identical? n 1)
          (let* ((y (get args 0)))
            (or (identical? x y)
                (cond ((nil? x) (nil? y))
                      ((nil? y) (nil? x))
                      ((string? x) (and (string? y) (identical? (.toString x)
                                                               (.toString y))))
                      ((number? x) (and (number? y) (identical? (.valueOf x)
                                                               (.valueOf y))))
                      ((set? x) (set-equal? x y))
                      ((or (vector? x) (list? x) (lazy-seq? x)) (and (or (vector? y) (list? y) (lazy-seq? y))
                                                                    (=.*seq= x y)))
                      ((fn? x) false)
                      ((boolean? x) false)
                      ((date? x) (date-equal? x y))
                      ((re-pattern? x) (pattern-equal? x y))
                      (else (dictionary-equal? x y))))))
          (else
          (loop ((previous x)
                 (current (get args 0))
                 (index 1))
            (and (equivalent? previous current)
                 (if (< index n)
                  (recur current
                         (get args index)
                         (inc index))
                  true)))))))

(defvar = equivalent?)
(setf (aget = '-wisp-types) -wisp-types)

(defun not=
  (x &rest args)
  "Same as (not (= obj1 obj2))"
  (if (identical? (.-length args) 0)
    false
    (not (apply = x args))))

(defun ==
  (x &rest args)
  "Equality. Returns true if x equals y, false if not. Compares
  numbers and collections in a type-independent manner. Clojure's
  immutable data structures define -equiv (and thus =) as a value,
  not an identity, comparison."
  (let* ((n (.-length args)))
    (if (identical? n 0)
      true
      (loop ((previous x)
             (current (get args 0))
             (index 1))
        (and (identical? previous current)
             (if (< index n)
              (recur current
                     (get args index)
                     (inc index))
              true))))))


(defun >
  (x &rest args)
  "Returns non-nil if nums are in monotonically decreasing order,
  otherwise false."
  (let* ((n (.-length args)))
    (if (identical? n 0)
      true
      (loop ((previous x)
             (current (get args 0))
             (index 1))
        (and (> previous current)
             (if (< index n)
              (recur current
                     (get args index)
                     (inc index))
              true))))))

(defun >=
  (x &rest args)
  "Returns non-nil if nums are in monotonically non-increasing order,
  otherwise false."
  (let* ((n (.-length args)))
    (if (identical? n 0)
      true
      (loop ((previous x)
             (current (get args 0))
             (index 1))
        (and (>= previous current)
             (if (< index n)
              (recur current
                     (get args index)
                     (inc index))
              true))))))


(defun <
  (x &rest args)
  "Returns non-nil if nums are in monotonically increasing order,
  otherwise false."
  (let* ((n (.-length args)))
    (if (identical? n 0)
      true
      (loop ((previous x)
             (current (get args 0))
             (index 1))
        (and (< previous current)
             (if (< index n)
              (recur current
                     (get args index)
                     (inc index))
              true))))))


(defun <=
  (x &rest args)
  "Returns non-nil if nums are in monotonically non-decreasing order,
  otherwise false."
  (let* ((n (.-length args)))
    (if (identical? n 0)
      true
      (loop ((previous x)
             (current (get args 0))
             (index 1))
        (and (<= previous current)
             (if (< index n)
              (recur current
                     (get args index)
                     (inc index))
              true))))))

(defun +
  (&rest args)
  (let* ((n (.-length args)))
    (cond ((identical? n 0) 0)
          ((identical? n 1) (get args 0))
          (else (loop ((value (+ (get args 0) (get args 1)))
                       (index 2))
                  (if (< index n)
                    (recur (+ value (get args index)) (inc index))
                    value))))))

(defun -
  (&rest args)
  (let* ((n (.-length args)))
    (cond ((identical? n 0) (throw (TypeError "Wrong number of args passed to: -")))
          ((identical? n 1) (- 0 (get args 0)))
          (else (loop ((value (- (get args 0) (get args 1)))
                       (index 2))
                  (if (< index n)
                    (recur (- value (get args index)) (inc index))
                    value))))))

(defun /
  (&rest args)
  (let* ((n (.-length args)))
    (cond ((identical? n 0) (throw (TypeError "Wrong number of args passed to: /")))
          ((identical? n 1) (/ 1 (get args 0)))
          (else (loop ((value (/ (get args 0) (get args 1)))
                       (index 2))
                  (if (< index n)
                    (recur (/ value (get args index)) (inc index))
                    value))))))

(defun *
  (&rest args)
  (let* ((n (.-length args)))
    (cond ((identical? n 0) 1)
          ((identical? n 1) (get args 0))
          (else (loop ((value (* (get args 0) (get args 1)))
                       (index 2))
                  (if (< index n)
                    (recur (* value (get args index)) (inc index))
                    value))))))

(defun quot (num div) (int (/ num div)))
(defun mod (num div) (- num (* div (quot num div))))
(defun rem* (num div)
  (let* ((m (apply mod [num div])))
    (if (identical? (>= num 0) (>= div 0))
      m
      (- m div))))
;; checking if rem is macro-shadowed
(defvar rem
  (if (let* ((rem (lambda () (identity nil))))
        (nil? (rem 1 1)))
    rem*
    (lambda (num div) (rem num div))))

(defun and
  (&rest args)
  (let* ((n (.-length args)))
    (cond ((identical? n 0) true)
          ((identical? n 1) (get args 0))
          (else (loop ((value (and (get args 0) (get args 1)))
                       (index 2))
                  (if (< index n)
                    (recur (and value (get args index)) (inc index))
                    value))))))

(defun or
  (&rest args)
  (let* ((n (.-length args)))
    (cond ((identical? n 0) nil)
          ((identical? n 1) (get args 0))
          (else (loop ((value (or (get args 0) (get args 1)))
                       (index 2))
                  (if (< index n)
                    (recur (or value (get args index)) (inc index))
                    value))))))

(defun print
  (&rest more)
  (apply console.log more))

(defvar max Math.max)
(defvar min Math.min)
(defvar nan? isNaN)
