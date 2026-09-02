(ns wisp.sequence
  (:require [wisp.runtime :refer [nil? vector? fn? number? string? dictionary? set?
                                  key-values str int dec inc min merge dictionary get
                                  iterable? = complement identity list? lazy-seq? identity-set?]]))

(defvar- -wisp-types (aget = '-wisp-types))

;; Implementation of list

(defun- list-iterator ()
  (let* ((self this))
    {:next (lambda ()
             (if (empty? self)
              {:done true}
              (let* ((x (first self)))
                (setf self (rest self))
                {:value x})))}))

(defun- seq->string (lparen rparen)
  (lambda ()
    (loop ((list this) (result ""))
      (if (empty? list)
        (str lparen (.substr result 1) rparen)
        (recur (rest list)
               (str result
                    " "
                    (let* ((x (first list)))
                      (cond ((vector? x) (str "[" (.join x " ") "]"))
                            ((nil?    x) "nil")
                            ((string? x) (.stringify JSON x))
                            ((number? x) (.stringify JSON x))
                            (else       x)))))))))

(defun- List
  (head tail)
  "List type"
  (setf this.head head)
  (setf this.tail (or tail (list)))
  (setf this.length
    (if (or (nil? this.tail) (dictionary? this.tail) (number? (.-length this.tail)))
      (inc (count this.tail))))
  this)

(setf List.prototype.length 0)
(setf List.type (:list -wisp-types))
(setf List.prototype.type List.type)
(setf List.prototype.tail nil)
(setf List.prototype.to-string (seq->string "(" ")"))
(aset List.prototype Symbol.iterator list-iterator)

(defun- lazy-seq-value (lazy-seq)
  (if (.-realized lazy-seq)
    (.-x lazy-seq)
    (let* ((x (.x lazy-seq)))
      (setf (.-realized lazy-seq) true)
      (if (empty? x)
        (setf (.-length lazy-seq) 0))
      (setf (.-x lazy-seq) x))))

(defun- LazySeq (realized x)
  (setf (.-realized this) (or realized false))
  (setf (.-x this) x)
  this)
(setf LazySeq.type (:lazy-seq -wisp-types))
(setf LazySeq.prototype.type LazySeq.type)
(aset LazySeq.prototype Symbol.iterator list-iterator)

(defun lazy-seq
  (realized body)
  (LazySeq. realized body))

(defun- clone-proto-props! (from to)
  (apply Object.assign to
         (.map (Object.get-own-property-names from.__proto__)
               (lambda (%) (let* ((x (aget from %)))
                  (dictionary % (if (fn? x) (.bind x from) x)))))))

(defun identity-set (&rest items)
  (let* ((js-set (Set. items))
        (f      (lambda (%1 %2) (get js-set %1 %2))))
    (clone-proto-props! js-set f)
    (setf f.to-string (seq->string "#{" "}"))
    ;; Reassigning __proto__ below severs f's link to Function.prototype,
    ;; so callers that do (f.apply ...)/(f.call ...) (e.g. complement,
    ;; apply) would otherwise find no such method -- pin them down as
    ;; own properties first so f stays usable as a plain function too.
    (setf f.apply Function.prototype.apply)
    (setf f.call Function.prototype.call)
    (setf f.__proto__ js-set)
    (Object.define-property f :length {:value f.size})
    (aset f Symbol.iterator f.values)
    (aset f :type identity-set.type)
    f))
(setf identity-set.type (:set -wisp-types))
(defvar set identity-set)

(defvar lazy-seq? lazy-seq?)
(defvar identity-set? identity-set?)
(defvar list? list?)

(setf =.*seq=
  (lambda (x y)
    (and (or (vector? x) (seq? x))
         (or (vector? y) (seq? y))
         (loop ((x (seq x)) (y (seq y)))
           (cond ((and (vector? x) (vector? y)) (and (= (count x) (count y))
                                                    (.every x (lambda (%1 %2) (= %1 (aget y %2))))))
                 ((or (empty? x) (empty? y))    (and (empty? x) (empty? y)))
                 ((not= (first x) (first y))    false)
                 (else                         (recur (rest x) (rest y))))))))

(defun list
  ()
  "Creates list of the given items"
  (if (identical? (.-length arguments) 0)
    nil
    (.reduce-right (.call Array.prototype.slice arguments)
                   (lambda (tail head) (cons head tail))
                   (list))))

(defun cons
  (head tail)
  "Creates list with `head` as first item and `tail` as rest"
  (new List head tail))

(defun sequential?
  (x)
  "Returns true if coll satisfies ISequential"
  (or (seq? x)
          (vector? x)
          (dictionary? x)
          (set? x)
          (string? x)))

(defun- native? (sequence)
  (or (vector? sequence) (string? sequence) (dictionary? sequence)))


(defun reverse
  (sequence)
  "Reverse order of items in the sequence"
  (if (vector? sequence)
    (.reverse (vec sequence))
    (into nil sequence)))

(defun range
  (&rest args)
  "Returns a vector of nums from start (inclusive) to end
  (exclusive), by step, where start defaults to 0 and step to 1."
  (cond ((identical? (count args) 1) (range 0 (first args) 1))
        ((identical? (count args) 2) (range (first args) (second args) 1))
        (else
        (let* ((start (first args)) (end (second args)) (step (third args)))
          (if (< step 0)
                      (.map (range (- start) (- end) (- step)) (lambda (%) (- %)))
                      (Array.from {:length (/ (- (+ end step) start 1) step)}
                                  (lambda (_ i) (+ start (* i step)))))))))

(defun mapv
  (f &rest sequences)
  "Returns a vector consisting of the result of applying `f` to the
  first items, followed by applying f to the second items, until one of
  sequences is exhausted."
  (let* ((vectors (.map sequences vec)) (n (apply min (.map vectors count))))
    (.map (range n) (lambda (i) (apply f (.map vectors (lambda (%) (aget % i))))))))

(defun map
  (f &rest sequences)
  "Returns a sequence consisting of the result of applying `f` to the
  first items, followed by applying f to the second items, until one of
  sequences is exhausted."
  (let* ((result (apply mapv f sequences)))
    (if (native? (first sequences)) result (apply list result))))

(defun map-indexed
  (f &rest sequences)
  "Returns a sequence consisting of the result of applying `f` to 0 and
  the first items, followed by applying f to 1 and the second items,
  until one of sequences is exhausted."
  (let* ((sequence (first sequences)) (n (count sequence)) (indices (range n)))
    (apply map f (if (native? sequence) indices (apply list indices)) sequences)))

(defun filter
  (f? sequence)
  "Returns a sequence of the items in coll for which (f? item) returns true.
  f? must be free of side-effects."
  (cond ((nil? sequence)    '())
        ((seq? sequence)    (filter-list f? sequence))
        ((vector? sequence) (.filter sequence (lambda (%) (f? %))))
        (else              (filter f? (seq sequence)))))

(defun- filter-list
  (f? sequence)
  "Like filter but for lists"
  (loop ((result '())
         (items sequence))
    (if (empty? items)
      (reverse result)
      (recur (if (f? (first items))
               (cons (first items) result)
               result)
             (rest items)))))

(defun filterv (f? sequence)
  (vec (filter f? sequence)))

(defun reduce
  (f &rest params)
  (let* ((has-initial (>= (count params) 2))
        (initial     (if has-initial (first params)))
        (sequence    (if has-initial (second params) (first params)))
        (step        (lambda (acc x) (f acc x))))
    (if has-initial
      (.reduce (vec sequence) step initial)
      (.reduce (vec sequence) step))))

(defun count
  (sequence)
  "Returns number of elements in list"
  (if (and sequence (number? (.-length sequence)))
    (.-length sequence)
    (let* ((it (seq sequence)))
      (cond ((nil? it)      0)
            ((lazy-seq? it) (count (vec it)))
            (else          (.-length it))))))

(defun empty?
  (sequence)
  "Returns true if list is empty"
  (let* ((it (seq sequence)))
    (identical? 0 (if (lazy-seq? it)
                    (progn (first it)             ; forcing evaluation
                        (.-length it))
                    (count it)))))

(defun first
  (sequence)
  "Return first item in a list"
  (cond ((nil? sequence) nil)
        ((list? sequence) (.-head sequence))
        ((or (vector? sequence) (string? sequence)) (get sequence 0))
        ((lazy-seq? sequence) (first (lazy-seq-value sequence)))
        (else (first (seq sequence)))))

(defun second
  (sequence)
  "Returns second item of the list"
  (cond ((nil? sequence) nil)
        ((list? sequence) (first (rest sequence)))
        ((or (vector? sequence) (string? sequence)) (get sequence 1))
        ((lazy-seq? sequence) (second (lazy-seq-value sequence)))
        (else (first (rest (seq sequence))))))

(defun third
  (sequence)
  "Returns third item of the list"
  (cond ((nil? sequence) nil)
        ((list? sequence) (first (rest (rest sequence))))
        ((or (vector? sequence) (string? sequence)) (get sequence 2))
        ((lazy-seq? sequence) (third (lazy-seq-value sequence)))
        (else (second (rest (seq sequence))))))

(defun rest
  (sequence)
  "Returns list of all items except first one"
  (cond ((nil? sequence) '())
        ((list? sequence) (.-tail sequence))
        ((or (vector? sequence) (string? sequence)) (.slice sequence 1))
        ((lazy-seq? sequence) (rest (lazy-seq-value sequence)))
        (else (rest (seq sequence)))))

(defun- last-of-list
  (list)
  (loop ((item (first list))
         (items (rest list)))
    (if (empty? items)
      item
      (recur (first items) (rest items)))))

(defun last
  (sequence)
  "Return the last item in coll, in linear time"
  (cond ((or (vector? sequence)
            (string? sequence)) (get sequence (dec (count sequence))))
        ((list? sequence) (last-of-list sequence))
        ((nil? sequence) nil)
        ((lazy-seq? sequence) (last (lazy-seq-value sequence)))
        (else (last (seq sequence)))))

(defun butlast
  (sequence)
  "Return a seq of all but the last item in coll, in linear time"
  (let* ((items (cond ((nil? sequence) nil)
                    ((string? sequence) (subs sequence 0 (dec (count sequence))))
                    ((vector? sequence) (.slice sequence 0 (dec (count sequence))))
                    ((list? sequence) (apply list (butlast (vec sequence))))
                    ((lazy-seq? sequence) (butlast (lazy-seq-value sequence)))
                    (else (butlast (seq sequence))))))
    (if (empty? items) nil items)))

(defun take
  (n sequence)
  "Returns a sequence of the first `n` items, or all items if
  there are fewer than `n`."
  (cond ((nil? sequence) '())
        ((vector? sequence) (take-from-vector n sequence))
        ((list? sequence) (take-from-list n sequence))
        ((lazy-seq? sequence) (if (> n 0) (take n (lazy-seq-value sequence))))
        (else (take n (seq sequence)))))

(defun take-while
  (predicate sequence)
  (loop ((items sequence) (result []))
    (let* ((head (first items)) (tail (rest items)))
      (if (and (not (empty? items))
               (predicate head))
        (recur tail (conj result head))
        (if (native? sequence) result (apply list result))))))


(defun- take-from-vector
  (n vector)
  "Like take but optimized for vectors"
  (.slice vector 0 n))

(defun- take-from-list
  (n sequence)
  "Like take but for lists"
  (loop ((taken '())
         (items sequence)
         (n     (or (int n) 0)))
    (if (or (<= n 0) (empty? items))
      (reverse taken)
      (recur (cons (first items) taken)
             (rest items)
             (dec n)))))




(defun- drop-from-list (n sequence)
  (loop ((left n)
         (items sequence))
    (if (or (< left 1) (empty? items))
      items
      (recur (dec left) (rest items)))))

(defun drop
  (n sequence)
  (if (<= n 0)
    sequence
    (cond ((string? sequence) (.substr sequence n))
          ((vector? sequence) (.slice sequence n))
          ((list? sequence) (drop-from-list n sequence))
          ((nil? sequence) '())
          ((lazy-seq? sequence) (drop n (lazy-seq-value sequence)))
          (else (drop n (seq sequence))))))

(defun drop-while
  (predicate sequence)
  (loop ((items (seq sequence)))
    (if (or (empty? items) (not (predicate (first items))))
      items
      (recur (rest items)))))


(defun- conj-list
  (sequence items)
  (reduce (lambda (result item) (cons item result)) sequence items))

(defun- ensure-dictionary (x)
  (if (vector? x)
    (dictionary (first x) (second x))
    x))

(defun conj
  (sequence &rest items)
  (cond ((vector? sequence) (.concat sequence items))
        ((string? sequence) (str sequence (apply str items)))
        ((nil? sequence) (apply list (reverse items)))
        ((seq? sequence) (conj-list sequence items))
        ((dictionary? sequence) (merge sequence (apply merge (mapv ensure-dictionary items))))
        ((set? sequence) (apply identity-set (into (vec sequence) items)))
        (else (throw (TypeError (str "Type can't be conjoined " sequence))))))

(defun disj
  (coll &rest ks)
  (let* ((predicate (complement (apply identity-set ks))))
    (cond ((empty? ks)        coll)
          ((set? coll)        (apply identity-set (filterv predicate coll)))
          ((dictionary? coll) (into {} (filter (lambda (%) (predicate (first %))) coll)))
          (else              (throw (TypeError (str "Type can't be disjoined " coll)))))))

(defun into
  (to from)
  (apply conj to (vec from)))

(defun zipmap (keys vals)
  (into {} (map vector keys vals)))

(defun assoc
  (source &rest key-values)
  ;(assert (even? (count key-values)) "Wrong number of arguments")
  ;(assert (and (not (seq? source))
  ;             (not (vector? source))
  ;             (object? source)) "Can only assoc on dictionaries")
  (conj source (apply dictionary key-values)))

(defun dissoc
  (coll &rest ks)
  (if (dictionary? coll)
    (apply disj coll ks)
    (throw (TypeError (str "Can only dissoc on dictionaries")))))

(defun concat
  (&rest sequences)
  "Returns list representing the concatenation of the elements in the
  supplied lists."
  (reduce (lambda (%1 %2) (conj-list %1 (reverse %2)))
          (let* ((tail (last sequences)))
            (if (lazy-seq? tail) tail (apply list (vec tail))))
          (rest (reverse sequences))))

(defun mapcat (f &rest colls)
  (apply concat (apply mapv f colls)))

(defun empty
  (sequence)
  "Produces empty sequence of the same type as argument."
  (cond ((list? sequence)       '())
        ((vector? sequence)     [])
        ((string? sequence)     "")
        ((dictionary? sequence) {})
        ((set? sequence)        #{})
        ((lazy-seq? sequence)   (lazy-seq))))

(defun seq (sequence)
  (cond ((nil? sequence) nil)
        ((or (vector? sequence) (seq? sequence)) sequence)
        ((string? sequence) (.call Array.prototype.slice sequence))
        ((dictionary? sequence) (key-values sequence))
        ((iterable? sequence) (iterator->lseq ((get sequence Symbol.iterator))))
        (else (throw (TypeError (str "Can not seq " sequence))))))

(defun seq* (sequence)
  (let* ((it (seq sequence)))
    (if (empty? it) nil it)))

(defun seq? (sequence)
  (or (list? sequence)
      (lazy-seq? sequence)))

(defun- iterator->lseq (iterator)
  (unfold (lambda (%) (let* ((x (.next %)))
             (if (.-done x) nil [(.-value x) %])))
          iterator))

(defun vec
  (sequence)
  "Creates a new vector containing the contents of sequence"
  (cond ((nil? sequence) [])
        ((or (vector? sequence) (list? sequence)) (Array.from sequence))
        ((lazy-seq? sequence) (let* ((xs (Array.from sequence)))            ; optimizing count
                               (setf (.-length sequence) (.-length xs))
                               xs))
        (else (vec (seq sequence)))))

(defun vector (&rest sequence) sequence)

;; private
(defvar-
  sort-comparator
  (if (= [1 2 3] (.sort [2 1 3] (lambda (a b) (if (< a b) 0 1))))
    (lambda (%) (lambda (a b) (if (% b a)  1 0)))       ; quicksort (Chrome, Node), mergesort (Firefox)
    (lambda (%) (lambda (a b) (if (% a b) -1 0)))))     ; timsort (Chrome 70+, Node 11+)

(defun sort
  (f items)
  "Returns a sorted sequence of the items in coll.
  If no comparator is supplied, uses compare."
  (let* ((has-comparator (fn? f))
        (items          (if (and (not has-comparator) (nil? items)) f items))
        ;; Array.prototype.sort throws if handed a comparator argument
        ;; that isn't a function or (real JS) undefined -- nil is real
        ;; null now (Phase 2), so it can't be passed through directly
        ;; when there's no comparator.
        (result         (if has-comparator
                          (.sort (vec items) (sort-comparator f))
                          (.sort (vec items)))))
    (cond ((nil? items)    '())
          ((vector? items) result)
          (else           (apply list result)))))


(defun repeatedly
  (n f)
  "Takes a function of no args, presumably with side effects, and
  returns vector of given `n` length with calls to it"
  ;; wrap so Array.from's (item, index) callback args never reach f
  (Array.from {:length n} (lambda () (f))))

(defun repeat
  (n x)
  "Returns a vector of given `n` length with given `x`
  items. Not compatible with clojure as it's not a lazy
  and only finite repeats are supported"
  (repeatedly n (lambda () x)))


(defun every?
  (predicate sequence)
  (.every (vec sequence) (lambda (%) (predicate %))))

(defun some
  (pred coll)
  "Returns the first logical true value of (pred x) for any x in coll,
  else nil.  One common idiom is to use a set as pred, for example
  this will return :fred if :fred is in the sequence, otherwise nil:
  (some #{:fred} coll)"
  (loop ((items (seq coll)))
    (if (empty? items) nil
      (or (pred (first items)) (recur (rest items))))))


(defun partition
  (n &rest args)
  (let* ((step (if (>= (count args) 2) (first args) n))
        (pad  (if (>= (count args) 3) (second args) []))
        (coll (last args)))
    (loop ((result [])
           (items (seq coll)))
      (let* ((chunk (take n items))
            (size (count chunk)))
        (cond ((identical? size n) (recur (conj result chunk)
                                         (drop step items)))
              ((identical? 0 size) result)
              ((> n (+ size (count pad))) result)
              (else (conj result
                          (take n (vec (concat chunk
                                               pad))))))))))

(defun interleave (&rest sequences)
  (if (empty? sequences)
    []
    (loop ((result [])
           (sequences sequences))
      (if (some empty? sequences)
        (vec result)
        (recur (concat result (map first sequences))
               (map rest sequences))))))

(defun nth
  (sequence index not-found)
  "Returns nth item of the sequence"
  (let* ((sequence (seq* sequence)))
    (cond ((nil? sequence) not-found)
          ((seq? sequence) (if-let [it (seq* (drop index sequence))]
                            (first it)
                            not-found))
          ((or (vector? sequence)
              (string? sequence)) (if (< index (count sequence))
                                    (aget sequence index)
                                    not-found))
          (else (throw (TypeError "Unsupported type"))))))


(defun contains?
  (coll v)
  "Returns true if key is present in the given collection, otherwise
  returns false.  Note that for numerically indexed collections like
  vectors and strings, this tests if the numeric key is within the
  range of indexes. 'contains?' operates constant or logarithmic time;
  it will not perform a linear search for a value.  See also 'some'."
  (cond ((set? coll)                                           (.has coll v))
        ((or (dictionary? coll) (vector? coll) (string? coll)) (.has-own-property coll v))
        (else                                                 false)))

(defun union
  (&rest sets)
  "Return a set that is the union of the input sets"
  (into #{} (apply concat sets)))

(defun difference
  (s1 &rest sets)
  "Return a set that is the first set without elements of the remaining sets"
  (into #{} (filter (complement (apply union sets))
                    s1)))

(defun intersection
  (&rest sets)
  "Return a set that is the intersection of the input sets"
  (let* ((sets     (mapv (lambda (%) (into #{} %)) sets))
        (in-each? (lambda (x) (every? (lambda (%) (.has % x)) sets)))
        (min-size (apply min (mapv count sets)))
        (smallest (.find sets (lambda (%) (= min-size (count %))))))
    (into #{} (filter in-each? smallest))))

(defun subset?
  (set1 set2)
  "Is set1 a subset of set2?"
  (if (set? set2)
    (every? (lambda (%) (.has set2 %)) set1)
    (subset? set1 (into #{} set2))))

(defun superset?
  (set1 set2)
  "Is set1 a superset of set2?"
  (subset? set2 set1))


(defun unfold
  (f x)
  "Returns a lazy sequence; (f x) is expected to return either nil (signifying end of sequence)
  or [y x1] (where y is next sequence item, and x1 is next value of x)"
  (lazy-seq (if-let [next (f x)]
              (cons (first next) (unfold f (second next))))))

(defun iterate
  (f x)
  "Returns a lazy sequence of x, (f x), (f (f x)) etc. f must be free of side-effects"
  (lazy-seq (cons x (iterate f (f x)))))

(defun cycle
  (coll)
  "Returns a lazy (infinite!) sequence of repetitions of the items in coll."
  (lazy-seq (if (empty? coll)
              nil
              (concat coll (cycle coll)))))

(defun infinite-range
  (&rest args)
  (let* ((n (if (empty? args) 0 (first args)))
        (step (second args)))
    (if (nil? step)
      (iterate inc n)
      (iterate (lambda (%) (+ % step)) n))))

(defun lazy-map (f &rest sequences)
  (unfold (lambda (%) (if (some empty? %)
             nil
             [(apply f (mapv first %)) (mapv rest %)]))
          sequences))

(defun lazy-filter (f sequence)
  (unfold (lambda (%) (loop ((xs %))
             (cond ((empty? xs)    nil)
                   ((f (first xs)) [(first xs) (rest xs)])
                   (else          (recur (rest xs))))))
          (seq sequence)))

(defun lazy-concat (&rest sequences)
  (if (empty? sequences)
    nil
    ((lambda iter (xs)
       (lazy-seq (if (empty? xs)
                   (apply lazy-concat (rest sequences))
                   (cons (first xs) (iter (rest xs))))))
     (seq (first sequences)))))

(defun lazy-partition
  (n &rest args)
  (let* ((step (if (>= (count args) 2) (first args) n))
        (pad  (if (>= (count args) 3) (second args) []))
        (coll (last args)))
    (unfold (lambda (%) (let* ((chunk (take n (concat (take n %) pad))))
               (if (and (not (empty? %)) (identical? n (count chunk)))
                 [chunk (drop step %)])))
            coll)))


(defun run!
  (proc coll)
  "Runs the supplied procedure (via reduce), for purposes of side
  effects, on successive items in the collection. Returns nil"
  (reduce (lambda (_ x) (proc x) nil) nil coll))

(defun dorun
  (&rest args)
  "When lazy sequences are produced via functions that have side
  effects, any effects other than those needed to produce the first
  element in the seq do not occur until the seq is consumed. dorun can
  be used to force any effects. Walks through the successive nexts of
  the seq, does not retain the head and returns nil."
  (let* ((n (if (identical? (count args) 1) Infinity (first args)))
        (coll (last args)))
    (run! identity (take n coll))))

(defun doall
  (&rest args)
  "When lazy sequences are produced via functions that have side
  effects, any effects other than those needed to produce the first
  element in the seq do not occur until the seq is consumed. dorun can
  be used to force any effects. Walks through the successive nexts of
  the seq, retains the head and returns it, thus causing the entire
  seq to reside in memory at one time."
  (let* ((n (if (identical? (count args) 1) Infinity (first args)))
        (coll (last args)))
    (dorun n coll)
    coll))
