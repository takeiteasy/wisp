(ns wisp.test.macros
  (:require [wisp.test.util :refer [is thrown?]]
            [wisp.runtime :refer [= dictionary? vector? list? lazy-seq? inc odd? keys re-find get]]
            [wisp.sequence :refer [list vec third count range infinite-range take
                                   lazy-seq empty? first rest cons lazy-concat dorun
                                   nth drop]]
            [wisp.ast :refer [symbol? name namespace]]
            [wisp.expander :refer [dot-syntax? method-syntax? field-syntax? new-syntax?
                                   keyword-invoke macroexpand macroexpand-1]]))

(defun- *expansion-matches (x y)
  (let* ((gensym? (lambda (%) (and (symbol? %) (. (name %) includes \#))))
        (gensyms {}) (inv {}))
    ((lambda *matches (x y)
       (cond ((gensym? y)     (and (symbol? x)
                                  (if-let [z (aget gensyms y)]
                                    (= x z)
                                    (if (aget inv x)
                                      false
                                      (let* ((x* (name x)) (y* (. (name y) replace #"#.*" "")))
                                        (aset gensyms y x)
                                        (aset inv x y)
                                        (and (. x* starts-with y*)
                                             (.. x* (slice (count y*)) (match #"^[0-9]+$"))))))))
             ((symbol? y)     (and (symbol? x) (= (name x) (name y)) (= (namespace x) (namespace y))))
             ((vector? y)     (and (vector? x) (= (count x) (count y)) (.every x (lambda (%1 %2) (*matches %1 (aget y %2))))))
             ((list? y)       (and (list? x) (*matches (vec x) (vec y))))
             ((dictionary? y) (and (dictionary? x) (*matches (.sort (keys x)) (.sort (keys y)))
                                  (.every (keys x) (lambda (%) (*matches (aget x %) (aget y %))))))
             (else           (= x y))))
     x y)))
(defvar *= *expansion-matches)

(defun- *side-effects! (f)
  (let* ((xs []) (side-effect! (lambda (x) (.push! xs x) x)))
    [xs (f side-effect!)]))


(is (dot-syntax? '.)           ". is dot-syntax?")
(is (not (dot-syntax? '.foo))  ".foo is not dot-syntax?")
(is (not (dot-syntax? '.-foo)) ".-foo is not dot-syntax?")
(is (not (dot-syntax? 'foo.))  "foo. is not dot-syntax?")
(is (not (dot-syntax? ':foo))  ":foo is not dot-syntax?")
(is (not (dot-syntax? :foo))   "\"foo\" is not dot-syntax?")

(is (not (method-syntax? '.))     ". is not method-syntax?")
(is (method-syntax? '.foo)        ".foo is method-syntax?")
(is (not (method-syntax? '.-foo)) ".-foo is not method-syntax?")
(is (not (method-syntax? 'foo.))  "foo. is not method-syntax?")
(is (not (method-syntax? ':foo))  ":foo is not method-syntax?")
(is (not (method-syntax? :foo))   "\"foo\" is not method-syntax?")

(is (not (field-syntax? '.))     ". is not field-syntax?")
(is (not (field-syntax? '.foo))  ".foo is not field-syntax?")
(is (field-syntax? '.-foo)       ".-foo is field-syntax?")
(is (not (field-syntax? 'foo.))  "foo. is not field-syntax?")
(is (not (field-syntax? ':foo))  ":foo is not field-syntax?")
(is (not (field-syntax? :foo))   "\"foo\" is not field-syntax?")

(is (not (new-syntax? '.))     ". is not new-syntax?")
(is (not (new-syntax? '.foo))  ".foo is not new-syntax?")
(is (not (new-syntax? '.-foo)) ".-foo is not new-syntax?")
(is (new-syntax? 'foo.)        "foo. is new-syntax?")
(is (not (new-syntax? ':foo))  ":foo is not new-syntax?")
(is (not (new-syntax? :foo))   "\"foo\" is not new-syntax?")


(is (= (macroexpand-1 '(.-foo bar))
       '(aget bar 'foo)))

(is (= (macroexpand-1 '(.foo bar baz x y z))
       '((aget bar 'foo) baz x y z)))

(is (= (macroexpand-1 '(. foo -bar))
       '(aget foo 'bar)))
(is (= (macroexpand-1 '(. foo bar baz x y z))
       '((aget foo 'bar) baz x y z)))

(is (= (macroexpand-1 '(Foo. bar baz))
       '(new Foo bar baz)))

(is (= (macroexpand-1 '(:foo bar))
       '(get bar :foo)))
(is (= (macroexpand-1 '(:foo bar baz))
       '(get bar :foo baz)))

(is (= (macroexpand-1 '(get bar :foo))
       '(aget (or bar 0) :foo)))
(is (= (macroexpand-1 '(get bar :foo baz))
       '(apply get [bar :foo baz])))
(is (= (macroexpand-1 '(get bar :foo nil))
       '(get bar :foo)))
(is (= (macroexpand-1 '(get bar :foo null))
       '(apply get [bar :foo null])))


(is (= (let* ((foo :bar) (baz "abc"))
         `(,foo bar ,@baz ,(+ 1 2) 42))
       '("bar" bar \a \b \c 3 42)))


(is (= (macroexpand-1 '(not= foo bar baz))
       '(not (= foo bar baz))))

(is (= (macroexpand '(comment foo bar baz))
       nil))


(is (= (macroexpand-1 '(-> x (foo) (bar 42) baz))
       '(baz (bar (foo x) 42))))

(is (= (macroexpand-1 '(->> x (foo) (bar 42) baz))
       '(baz (bar 42 (foo x)))))

(is (= (macroexpand-1 '(.. x (foo) (bar 42) -baz))
       '(-> x (. foo) (. bar 42) (. -baz))))
(is (= (macroexpand '(.. x (foo) (bar 42) -baz))
       '(aget (. (. x foo) bar 42) 'baz)))

(is (*= (macroexpand-1 '(as-> owners $ (nth $ 0) (:pets $) (deref $) ($ 1) ($ :type)))
        '(let** [$ owners
                 $ (nth $ 0)
                 $ (:pets $)
                 $ (deref $)
                 $ ($ 1)
                 $ ($ :type)]
           $)))


(is (= (macroexpand-1 '(cond (foo bar) (else baz)))
       '(if foo (progn bar) (cond (else baz)))))
(is (= (macroexpand-1 '(cond (else baz)))
       '(progn baz)))
(is (= (macroexpand-1 '(cond))
       nil))

(is (*= (macroexpand-1 '(case x
                          (1       :foo)
                          ((3 4)   :bar)
                          (((5 6)) :baz)))
        '(cond ((= x '1)               :foo)
               ((or (= x '3) (= x '4)) :bar)
               ((or (= x '(5 6)))      :baz)
               (else                  (throw (Error (str "No matching clause: " x)))))))
(is (*= (macroexpand-1 '(case (foo bar baz)
                          (1       :foo)
                          ((3 4)   :bar)
                          (((5 6)) :baz)))
        '(let* ((case-binding# (foo bar baz)))
           (cond ((= case-binding# '1)          :foo)
                 ((or (= case-binding# '3)
                     (= case-binding# '4))     :bar)
                 ((or (= case-binding# '(5 6))) :baz)
                 (else                         (throw (Error (str "No matching clause: " case-binding#))))))))
(is (= (macroexpand-1 '(case x
                         ([1] :foo)
                         (else (bar 42))))
       '(cond ((= x '[1]) :foo)
              (else      (bar 42)))))


(defun *sq (%) (* % %))

(is (*= (macroexpand-1 '(condp get (foo bar baz)
                          "foo"     :foo
                          {:bar 42} :>> inc
                          #{42}     :>> *sq))
        '(let** [condp-binding# (foo bar baz)]
           (if (get "foo" condp-binding#)
              :foo
              (if-let [condp-binding# (get {:bar 42} condp-binding#)]
                (inc condp-binding#)
                (if-let [condp-binding# (get #{42} condp-binding#)]
                  (*sq condp-binding#)
                  (throw (Error (str "No matching clause: " condp-binding#)))))))))
(is (*= (macroexpand-1 '(condp some xs
                          #{1 2 3} (foo)
                          #{4 5 6} :>> inc
                          (bar)))
        '(if (some #{1 2 3} xs)
           (foo)
           (if-let [condp-binding# (some #{4 5 6} xs)]
             (inc condp-binding#)
             (bar)))))

(is (*= (macroexpand-1 '(cond-> (foo)
                          true    inc
                          false   (- 42)
                          (= 2 2) (/)))
        '(as-> (foo) cond-thread-binding#
               (if (not true)    cond-thread-binding# (inc cond-thread-binding#))
               (if (not false)   cond-thread-binding# (- cond-thread-binding# 42))
               (if (not (= 2 2)) cond-thread-binding# (/ cond-thread-binding#)))))

(is (*= (macroexpand-1 '(cond->> (foo)
                          true    inc
                          false   (- 42)
                          (= 2 2) (/)))
        '(as-> (foo) cond-thread-binding#
               (if (not true)    cond-thread-binding# (inc cond-thread-binding#))
               (if (not false)   cond-thread-binding# (- 42 cond-thread-binding#))
               (if (not (= 2 2)) cond-thread-binding# (/ cond-thread-binding#)))))

(is (*= (macroexpand-1 '(some-> {:a 1} :b (- 2)))
        '(as-> {:a 1} some-thread-binding#
               (if (nil? some-thread-binding#) some-thread-binding# (:b some-thread-binding#))
               (if (nil? some-thread-binding#) some-thread-binding# (- some-thread-binding# 2)))))

(is (*= (macroexpand-1 '(some->> {:a 1} :b (- 2)))
        '(as-> {:a 1} some-thread-binding#
               (if (nil? some-thread-binding#) some-thread-binding# (:b some-thread-binding#))
               (if (nil? some-thread-binding#) some-thread-binding# (- 2 some-thread-binding#)))))


(is (= (macroexpand-1 '(defun foo ()))
       '(defvar foo (lambda foo ()))))
(is (= (macroexpand-1 '(defun foo (bar baz) 1 2 3))
       '(defvar foo (lambda foo (bar baz) 1 2 3))))
(is (= (macroexpand-1 '(defun- foo (bar baz) 1 2 3))
       '(defvar- foo (lambda foo (bar baz) 1 2 3))))
;; Multi-arity clauses are not supported by new-syntax lambda yet
;; (ticket #5's arity-overloading question is still open) -- see
;; expand-lambda in src/expander.wisp.
(is (thrown? (macroexpand-1 '(lambda ((bar) 1) ((& baz) 1 2 3))) #"multi-arity")
    "multi-arity lambda clauses are rejected")


(is (= (macroexpand-1 '(lazy-seq (foo bar baz)))
       '(.call lazy-seq nil false (lambda () (foo bar baz)))))


(is (= (macroexpand-1 '(if-not foo bar))
       '(if (not foo) bar nil)))
(is (= (macroexpand-1 '(if-not foo bar baz))
       '(if (not foo) bar baz)))

(is (= (macroexpand-1 '(when foo
                         bar
                         baz))
       '(if foo
          (progn bar
              baz))))

;; when-not was renamed to unless in new-syntax
(is (= (macroexpand-1 '(unless foo
                         bar
                         baz))
       '(when (not foo)
          bar
          baz)))

(is (*= (macroexpand-1 '(if-let [x (foo)]
                          bar
                          baz))
        '(let** [if-let-binding# (foo)]
           (if if-let-binding#
             (let** [x if-let-binding#] bar)
             baz))))
;; destructuring is resolved eagerly (destructure is a real function
;; call in the macro body, not a quoted template), so the [x & xs]
;; pattern is already expanded into nth/drop calls by the time
;; macroexpand-1 returns.
(is (*= (macroexpand-1 '(if-let [[x & xs] (foo)]
                          bar
                          baz))
        '(let** [if-let-binding# (foo)]
           (if if-let-binding#
             (let** [destructure-bind#
                     if-let-binding#
                     x
                     (nth destructure-bind# 0)
                     xs
                     (drop 1 destructure-bind#)] bar)
             baz))))

(is (= (macroexpand-1 '(when-let [x (foo)]
                         bar
                         baz))
       '(if-let [x (foo)] (progn bar baz))))

(is (*= (macroexpand-1 '(if-some [[x & xs] (foo)]
                          bar
                          baz))
        '(let** [if-some-binding# (foo)]
            (if-not (nil? if-some-binding#)
              (let** [destructure-bind#
                      if-some-binding#
                      x
                      (nth destructure-bind# 0)
                      xs
                      (drop 1 destructure-bind#)] bar)
              baz))))

(is (= (macroexpand-1 '(when-some [x (foo)]
                         bar
                         baz))
       `(if-some [x (foo)] (progn bar baz))))

(is (= (macroexpand-1 '(when-first [x (foo)]
                         bar
                         baz))
       '(when-let ([x] (seq* (foo)))
          bar
          baz)))

(is (= (macroexpand-1 '(while foo
                         bar
                         baz))
       '(loop ()
          (when foo
             bar
             baz
             (recur)))))


(is (*= (macroexpand-1 '(doto (Map.)
                          (.set :a 1)
                          (.set :b 2)))
        '(let** [doto-binding# (Map.)]
           (.set doto-binding# :a 1)
           (.set doto-binding# :b 2)
           doto-binding#)))

(is (*= (macroexpand-1 '(dotimes (i 5)
                          foo
                          bar
                          (baz i)))
        `(let** [dotimes-binding# 5]
           (loop ((i 0))
             (when (< i dotimes-binding#)
               foo
               bar
               (baz i)
               (recur (inc i)))))))


(is (lazy-seq? (for ((x (range 10))) (- x)))
    "for produces a lazy-seq")
(is (= (vec (for ((x (range 10))) (* x x)))
       [0 1 4 9 16 25 36 49 64 81]))
(is (= (vec (for ((x (range 10)) (:let ((y (inc x)))))  (* y y)))
       [1 4 9 16 25 36 49 64 81 100]))
(is (= (vec (for ((x (range 10)) (:when (odd? x))) (* x x)))
       [1 9 25 49 81]))
(is (= (vec (for ((x (infinite-range 0 3)) (:while (< x 11))) (* x x)))
       [0 9 36 81]))
(is (= (vec (for ((x (infinite-range 0 3)) (:while (< x 9)) (y "abc")) (str y x)))
       [:a0 :b0 :c0 :a3 :b3 :c3 :a6 :b6 :c6]))
(is (= (vec (for ((x (range 0 10 3)) (:when (odd? x)) (y "abc")) (str y x)))
       [:a3 :b3 :c3 :a9 :b9 :c9]))
(is (= (vec (for ((x (range 0 10 3)) (y "abc") (:while (odd? x))) (str y x)))
       [:a3 :b3 :c3 :a9 :b9 :c9]))
(is (= (vec (take 20 (for ((x (infinite-range)) (y (infinite-range)) (:while (< y x)))  [x y])))
       [[1 0] [2 0] [2 1] [3 0] [3 1]  [3 2] [4 0] [4 1] [4 2] [4 3]
        [5 0] [5 1] [5 2] [5 3] [5 4]  [6 0] [6 1] [6 2] [6 3] [6 4]]))

(is (= (*side-effects! (lambda (%) (doseq ((x "abc") (y (range 3)) (:when (= (= x :b) (odd? y))))
                          (% (str x y)))))
       [[:a0 :a2 :b1 :c0 :c2] nil]))


;; let (parallel) always double-wraps through a gensym, even for a
;; single binding, so every init-expr only ever sees names bound
;; before this `let`, never a sibling introduced by the same form.
(is (*= (macroexpand-1 '(let ((foo bar)) baz))
        '(let** [let-binding# bar] (let** [foo let-binding#] baz))))
(is (*= (macroexpand-1
          '(let (([x1 _ x3 _ x5 _ [x7a x7b] & {:keys [lest] :as remaining} :as all] (foo stuff))
                 (bar                                                               (lest))
                 ({category :category-name :keys [foo bar baz]
                  :strs [first-name last-name] :syms [sym-name]
                  :person/keys [name age] hobby hobby/hobby-name
                  :or {category "Category not found" foo 42 age 0}}              (bar x1)))
             body))
        '(let** [let-binding#1 (foo stuff)
                let-binding#2 (lest)
                let-binding#3 (bar x1)]
           (let** [all                let-binding#1
                x1                 (nth all 0)
                x3                 (nth all 2)
                x5                 (nth all 4)
                destructure-bind#1 (nth all 6)
                x7a                (nth destructure-bind#1 0)
                x7b                (nth destructure-bind#1 1)
                remaining          (drop 7 all)
                remaining          (if (dictionary? remaining)
                                     remaining
                                     (apply dictionary (vec remaining)))
                 lest               (get remaining :lest nil)
                 bar                let-binding#2
                 destructure-bind#2 let-binding#3
                 destructure-bind#2 (if (dictionary? destructure-bind#2)
                                      destructure-bind#2
                                      (apply dictionary (vec destructure-bind#2)))
                 category           (get destructure-bind#2 :category-name "Category not found")
                 foo                (get destructure-bind#2 :foo 42)
                 bar                (get destructure-bind#2 :bar nil)
                 baz                (get destructure-bind#2 :baz nil)
                 first-name         (get destructure-bind#2 :first-name nil)
                 last-name          (get destructure-bind#2 :last-name nil)
                 sym-name           (get destructure-bind#2 :symName nil)
                 name               (get destructure-bind#2 :person/name nil)
                 age                (get destructure-bind#2 :person/age 0)
                hobby              (get destructure-bind#2 :hobby/hobbyName nil)]
           body))))


(is (= (macroexpand-1 '(lambda (foo bar) baz))
       '(fn* [foo bar] baz)))
(is (= (macroexpand-1 '(lambda name (foo bar) baz))
       '(fn* name [foo bar] baz)))


;; lambda* -- the arrow form (#7): lowers to fn* carrying an :arrow
;; marker in the form's metadata (invisible to `=`), which the analyzer
;; threads onto the AST node and the backend emits as
;; ArrowFunctionExpression. Arrows are anonymous and reject &rest --
;; the variadic lowering slices `arguments`, which arrows lack.
(is (= (macroexpand-1 '(lambda* (foo bar) baz))
       '(fn* [foo bar] baz)))
(is (= (macroexpand-1 '(lambda* (&optional (x 10)) x))
       '(fn* [x] (if (nil? x) (set! x 10)) x))
  "&optional defaults lower to body statements, arrow-compatible")
(is (thrown? (macroexpand-1 '(lambda* name (x) x))
             #"arrows are anonymous"))
(is (thrown? (macroexpand-1 '(lambda* ((a) 1) ((a b) 2)))
             #"multi-arity"))
(is (thrown? (macroexpand-1 '(lambda* (a &rest more) a))
             #"&rest"))


;; defplugin (#7): defvar + lambda*, with the attrs map forwarded onto
;; the function via Object.defineProperty inside the defvar init (a
;; function's own `name`/`length` properties are non-writable, so a
;; plain assignment would silently no-op). One top-level definition --
;; no progn/IIFE scoping surprise.
(is (*= (macroexpand-1 '(defplugin plug {:inject [a]} (ctx config) ctx))
        '(defvar plug ((lambda (plugin#)
                         (.defineProperty js/Object plugin# "inject"
                                          {:value [a]
                                           :writable true
                                           :enumerable true
                                           :configurable true})
                         plugin#)
                       (lambda* (ctx config) ctx)))))
(is (*= (macroexpand-1 '(defplugin plug (ctx config) ctx))
        '(defvar plug ((lambda (plugin#)
                        plugin#)
                      (lambda* (ctx config) ctx))))
  "attrs map is optional; nothing is forwarded without it")


(is (= (macroexpand-1 '(loop ((foo bar)) baz))
       '(loop* [foo bar] baz)))


;; destructuring at runtime -- `let` bindings and parameter lists
(is (= (let (([a b] [1 2])) (+ a b))
       3))
(is (= (let (({:keys [k]} {:k 7})) k)
       7) ":keys looks the key up the same way map literals store it")
(is (= (let (({:strs [s]} {"s" 3})) s)
       3))
(is (= (let (({:keys [k] :or {k 9}} {})) k)
       9) ":or supplies the default")
(is (= (let (([a &rest r] [1 2 3])) r)
       [2 3]) "&rest in a seq pattern")
(is (= ((lambda ([a b]) (+ a b)) [1 2])
       3) "positional destructuring in a param list")
(is (= ((lambda ({:keys [k]}) k) {:k 5})
       5) "associative destructuring in a param list")
(is (= ((lambda (x [a b]) (+ x a b)) 0 [1 2])
       3) "mixed required and destructured params")
