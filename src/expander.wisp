(ns wisp.expander
  "wisp syntax and macro expander module"
  (:require [wisp.ast :refer [meta with-meta symbol? keyword? keyword
                              quote? symbol namespace name gensym
                              unquote? unquote-splicing?]]
            [wisp.sequence :refer [list? list conj partition seq repeatedly
                                   empty? map mapv vec set every? concat
                                   first second third rest last mapcat nth
                                   butlast interleave cons count take dissoc
                                   some assoc reduce filter seq? zipmap drop
                                   lazy-seq range reverse dorun map-indexed]]
            [wisp.runtime :refer [nil? dictionary? vector? keys get
                                  vals string? number? boolean?
                                  date? re-pattern? even? odd? = max
                                  inc dec dictionary merge subs]]
            [wisp.string :refer [split join capitalize]]))


(defvar **macros** {})

(defun- expand
  (expander form env)
  "Applies macro registered with given `name` to a given `form`"
  (let* ((metadata (or (meta form) {}))
        (parmas (rest form))
        (implicit (map (lambda (%) (cond ((= :&form %) form)
                             ((= :&env %) env)
                             (else %)))
                      (or (:implicit (meta expander)) [])))
        (params (vec (concat implicit (vec (rest form)))))

        (expansion (apply expander params)))
    (if expansion
      (with-meta expansion (conj metadata (meta expansion)))
      expansion)))

(defun install-macro!
  (op expander)
  "Registers given `macro` with a given `name`"
  (setf (get **macros** (name op)) expander))

(defun- macro
  (op)
  "Returns true if macro with a given name is registered"
  (and (symbol? op)
       (get **macros** (name op))))


(defun dot-syntax?
  (op)
  (and (symbol? op) (identical? \. (name op))))

(defun method-syntax?
  (op)
  (let* ((id (and (symbol? op) (name op))))
    (and id
         (identical? \. (first id))
         (not (identical? \- (second id)))
         (not (identical? \. id)))))

(defun field-syntax?
  (op)
  (let* ((id (and (symbol? op) (name op))))
    (and id
         (identical? \. (first id))
         (identical? \- (second id)))))

(defun new-syntax?
  (op)
  (let* ((id (and (symbol? op) (name op))))
    (and id
         (identical? \. (last id))
         (not (identical? \. id)))))

(defun method-syntax
  (op target &rest params)
  "Example:
  '(.substring string 2 5) => '((aget string 'substring) 2 5)"
  (let* ((op-meta (meta op))
        (form-start (:start op-meta))
        (target-meta (meta target))
        (member (with-meta (symbol (subs (name op) 1))
                 ;; Include metadat from the original symbol just
                 (conj op-meta
                       {:start {:line (:line form-start)
                                :column (inc (:column form-start))}})))
        ;; Add metadata to aget symbol that will map to the first `.`
        ;; character of the method name.
        (aget (with-meta 'aget
               (conj op-meta
                     {:end {:line (:line form-start)
                            :column (inc (:column form-start))}})))

        ;; First two forms (.substring string ...) expand to
        ;; ((aget string 'substring) ...) there for expansion gets
        ;; position metadata from start of the first `.substring` form
        ;; to the end of the `string` form.
        (method (with-meta `(,aget ,target (quote ,member))
                 (conj op-meta
                       {:end (:end (meta target))}))))
    (if (nil? target)
      (throw (Error "Malformed method expression, expecting (.method object ...)"))
      `(,method ,@params))))

(defun field-syntax
  (field target &rest more)
  "Example:
  '(.-field object) => '(aget object 'field)"
  (let* ((metadata (meta field))
        (start (:start metadata))
        (end (:end metadata))
        (member (with-meta (symbol (subs (name field) 2))
                 (conj metadata
                       {:start {:line (:line start)
                                :column (+ (:column start) 2)}}))))
    (if (or (nil? target)
            (count more))
      (throw (Error "Malformed member expression, expecting (.-member target)"))
      `(aget ,target (quote ,member)))))

(defun dot-syntax
  (op target field &rest params)
  "Example:
  '(. object -field) => '(aget object 'field)
  '(. string substring 2 5) => '((aget string 'substring) 2 5)"
  (if-not (symbol? field)
    (throw (Error "Malformed . form")))
  (let* ((*field (name field)))
    (apply (if (identical? \- (first *field)) field-syntax method-syntax)
           (symbol (str \. *field)) target params)))

(defun new-syntax
  (op &rest params)
  "Example:
  '(Point. x y) => '(new Point x y)"
  (let* ((id (name op))
        (id-meta (:meta id))
        (rename (subs id 0 (dec (count id))))
        ;; constructur symbol inherits metada from the first `op` form
        ;; it's just it's end column info is updated to reflect subtraction
        ;; of `.` character.
        (constructor (with-meta (symbol rename)
                      (conj id-meta
                            {:end {:line (:line (:end id-meta))
                                   :column (dec (:column (:end id-meta)))}})))
        (operator (with-meta 'new
                   (conj id-meta
                         {:start {:line (:line (:end id-meta))
                                  :column (dec (:column (:end id-meta)))}}))))
    `(new ,constructor ,@params)))

(defun keyword-invoke
  (keyword target &rest args)
  "Calling a keyword desugars to property access with that
  keyword name on the given argument:
  '(:foo bar) => '(get bar :foo)"
  (if (empty? args)
    `(get ,target ,keyword)
    `(get ,target ,keyword ,(first args))))

(defun- desugar
  (expander form)
  (let* ((desugared (apply expander (vec form)))
        (metadata (conj {} (meta form) (meta desugared))))
    (with-meta desugared metadata)))

(defun macroexpand-1
  (form env)
  "If form represents a macro form, returns its expansion,
  else returns form."
  (let* ((op (and (list? form)
                (first form)))
        (expander (macro op)))
    (cond (expander (expand expander form env))
          ;; Calling a keyword compiles to getting value from given
          ;; object associated with that key:
          ;; '(:foo bar) => '(get bar :foo)
          ((keyword? op) (desugar keyword-invoke form))
          ;; '(. object method foo bar) => '((aget object method) foo bar)
          ((dot-syntax? op) (desugar dot-syntax form))
          ;; '(.-field object) => '(aget object 'field)
          ((field-syntax? op) (desugar field-syntax form))
          ;; '(.substring string 2 5) => '((aget string 'substring) 2 5)
          ((method-syntax? op) (desugar method-syntax form))
          ;; '(Point. x y) => '(new Point x y)
          ((new-syntax? op) (desugar new-syntax form))
          (else form))))

(defun macroexpand
  (form env)
  "Repeatedly calls macroexpand-1 on form until it no longer
  represents a macro form, then returns it."
  (loop ((original form)
         (expanded (macroexpand-1 form env)))
    (if (identical? original expanded)
      original
      (recur expanded (macroexpand-1 expanded env)))))


;; Define core macros


;; TODO make this language independent

(defun syntax-quote (form)
  (cond ((symbol? form) (list 'quote form))
        ((keyword? form) (list 'quote form))
        ((or (number? form)
            (string? form)
            (boolean? form)
            (nil? form)
            (re-pattern? form)) form)

        ((unquote? form) (second form))
        ((unquote-splicing? form) (reader-error "Illegal use of `,@` expression, can only be present in a list"))

        ((empty? form) form)

        ;;
        ((dictionary? form) (list 'apply
                                 'dictionary
                                 (cons '.concat
                                       (sequence-expand (apply concat
                                                               (seq form))))))
        ;; If a vector form expand all sub-forms and concatenate
        ;; them together:
        ;;
        ;; [,a b ,@c] -> (.concat [a] [(quote b)] c)
        ((vector? form) (cons '.concat (sequence-expand form)))

        ;; If a list form expand all the sub-forms and apply
        ;; concatenation to a list constructor:
        ;;
        ;; (,a b ,@c) -> (apply list (.concat [a] [(quote b)] c))
        ((list? form) (if (empty? form)
                       (cons 'list nil)
                       (list 'apply
                             'list
                             (cons '.concat (sequence-expand form)))))

        (else (reader-error "Unknown Collection type"))))
(defvar syntax-quote-expand syntax-quote)

(defun unquote-splicing-expand
  (form)
  (if (vector? form)
    form
    (list 'vec form)))

(defun sequence-expand
  (forms)
  "Takes sequence of forms and expands them:

  ((unquote a)) -> ([a])
  ((unquote-splicing a)) -> (a)
  (a) -> ([(quote b)])
  ((unquote a) b (unquote-splicing a)) -> ([a] [(quote b)] c)"
  (map (lambda (form)
         (cond ((unquote? form) [(second form)])
               ((unquote-splicing? form) (unquote-splicing-expand (second form)))
               (else [(syntax-quote-expand form)])))
       forms))
(install-macro! :syntax-quote syntax-quote-expand)

;; TODO: New reader translates not= correctly
;; but for the time being use not-equal name
(defun expand-not-equal
  (&rest body)
  `(not (= ,@body)))
(install-macro! :not= expand-not-equal)

(defun expand-if-not
  (condition truthy alternative)
  "Complements the `if` exclusive conditional branch."
  `(if (not ,condition) ,truthy ,alternative))
(install-macro! :if-not expand-if-not)

(defun expand-comment
  (&rest body)
  "Ignores body, yields nil"
  nil)
(install-macro! :comment expand-comment)

(defun expand-thread-first
  (&rest operations)
  "Thread first macro"
  (reduce
    (lambda (form operation)
      (cons (first operation)
            (cons form (rest operation))))
    (first operations)
    (map (lambda (%) (if (list? %) % `(,%)))
         (rest operations))))
(install-macro! :-> expand-thread-first)

(defun expand-thread-last
  (&rest operations)
  "Thread last macro"
  (reduce
    (lambda (form operation) (concat operation [form]))
    (first operations)
    (map (lambda (%) (if (list? %) % `(,%)))
         (rest operations))))
(install-macro! :->> expand-thread-last)

(defun expand-dots
  (x &rest forms)
  "form => fieldName-symbol or (instanceMethodName-symbol args*)
  Expands into a member access (.) of the first member on the first
  argument, followed by the next member on the result, etc. For
  instance:
  (.. document -body (get-attribute :class))
  expands to:
  (. (. document -body) get-attribute :class)
  but is easier to write, read, and understand."
  `(-> ,x ,@(map (lambda (%) (if (list? %) (cons '. %) (list '. %)))
                 forms)))
(install-macro! :.. expand-dots)

(defun expand-thread-as
  (expr name &rest forms)
  "Binds name to expr, evaluates the first form in the lexical context
  of that binding, then binds name to that result, repeating for each
  successive form, returning the result of the last form."
  `(let** [,name ,expr
           ,@(mapcat (lambda (form) [name form])
                     forms)]
     ,name))
(install-macro! :as-> expand-thread-as)


(defun expand-cond
  (&rest clauses)
  "Takes a set of (test body*) paren clauses. It evaluates each test
  one at a time.  If a test returns logical true, cond evaluates and
  returns the value of the corresponding body (an implicit progn) and
  doesn't evaluate any of the other tests or bodies. The bare symbol
  `else` is the catch-all clause. (cond) returns nil."
  (if (not (empty? clauses))
    (let* ((clause (first clauses)) (test (first clause)) (body (rest clause)))
      (if (= test 'else)
        `(progn ,@body)
        `(if ,test (progn ,@body) (cond ,@(rest clauses)))))))
(install-macro! :cond expand-cond)

(defun expand-case
  (e &rest clauses)
  "Takes an expression, and a set of (test-constant body*) paren
  clauses, or ((test-constant1 ... test-constantN) body*) to group
  several constants under one body. The bare symbol `else` is the
  catch-all clause. Test-constants are not evaluated -- they must be
  compile-time literals and need not be quoted. If no clause matches
  and no `else` clause was given, an Error is thrown.

  Unlike cond/condp, case's dispatch is not evaluated sequentially at
  runtime here (it's still lowered to a `cond` chain for now -- a
  constant-time dispatch is an optimisation, not a semantic
  requirement of the spec).

  Depends on ="
  (let* ((sym (if (symbol? e) e (gensym :case-binding)))
        (eq* (lambda (c) `(= ,sym ',c))))
    (loop ((pairs clauses) (conds []))
      (if (empty? pairs)
        (let* ((conds (if (some (lambda (%) (= (first %) 'else)) conds)
                      conds
                      (conj conds (list 'else `(throw (Error (str "No matching clause: " ,sym)))))))
              (result (cons 'cond conds)))
          (if (= e sym) result `(let* ((,sym ,e)) ,result)))
        (let* ((x (first pairs)) (xs (rest pairs)) (consts (first x)) (body (rest x)))
          (recur xs (conj conds
                          (if (= consts 'else)
                            (cons 'else body)
                            (cons (if-not (list? consts) (eq* consts) `(or ,@(map eq* consts)))
                                  body)))))))))
(install-macro! :case expand-case)

(defun expand-condp
  (pred expr &rest clauses)
  "Takes a binary predicate, an expression, and a set of clauses.
  Each clause can take the form of either:

  test-expr result-expr
  test-expr :>> result-fn

  Note :>> is an ordinary keyword.

  For each clause, (pred test-expr expr) is evaluated. If it returns
  logical true, the clause is a match. If a binary clause matches, the
  result-expr is returned, if a ternary clause matches, its result-fn,
  which must be a unary function, is called with the result of the
  predicate as its argument, the result of that call being the return
  value of condp. A single default expression can follow the clauses,
  and its value will be returned if no clause matches. If no default
  expression is provided and no clause matches, an Error is thrown."
  (let* ((sym*    (gensym :condp-binding))
        (sym     (if (symbol? expr) expr sym*))
        (compare (lambda (x) `(,pred ,x ,sym)))
        (splits  (lambda splits (xs)
                  (cond ((empty? xs)          `(throw (Error (str "No matching clause: " ,sym))))
                        ((= 1 (count xs))     (first xs))
                        ((= ':>> (second xs)) `(if-let [,sym* ,(compare (first xs))]
                                                (,(third xs) ,sym*)
                                                ,(splits (drop 3 xs))))
                        (else                `(if ,(compare (first xs))
                                                ,(second xs)
                                                ,(splits (drop 2 xs))))))))
    (if (= sym expr)
      (splits clauses)
      `(let** [,sym ,expr] ,(splits clauses)))))
(install-macro! :condp expand-condp)


(defun- *thread (insert sym test form)
  (let* ((form (if (list? form) form (list form))))
    `(if ,test
       ,sym
       ,(insert sym form))))

(defun- *cond-thread (expr clauses insert)
  (let* ((sym (gensym :cond-thread-binding)))
    `(as-> ,expr ,sym
           ,@(map (lambda (%) (*thread insert sym `(not ,(first %)) (second %)))
                  (partition 2 clauses)))))

(defun expand-cond-thread-first
  (expr &rest clauses)
  "Takes an expression and a set of test/form pairs. Threads expr (via ->)
  through each form for which the corresponding test
  expression is true. Note that, unlike cond branching, cond-> threading does
  not short circuit after the first true test expression."
  (*cond-thread expr clauses (lambda (sym form) (apply list (first form) sym (vec (rest form))))))
(install-macro! :cond-> expand-cond-thread-first)

(defun expand-cond-thread-last
  (expr &rest clauses)
  "Takes an expression and a set of test/form pairs. Threads expr (via ->>)
  through each form for which the corresponding test expression
  is true.  Note that, unlike cond branching, cond->> threading does not short circuit
  after the first true test expression."
  (*cond-thread expr clauses (lambda (sym form) (apply list (vec (concat form [sym]))))))
(install-macro! :cond->> expand-cond-thread-last)


(defun- *some-thread (expr forms insert)
  (let* ((sym (gensym :some-thread-binding)))
    `(as-> ,expr ,sym
           ,@(map (lambda (%) (*thread insert sym `(nil? ,sym) %))
                  forms))))

(defun expand-some-thread-first
  (expr &rest forms)
  "When expr is not nil, threads it into the first form (via ->),
  and when that result is not nil, through the next etc

  Depends on nil?"
  (*some-thread expr forms (lambda (sym form) (apply list (first form) sym (vec (rest form))))))
(install-macro! :some-> expand-some-thread-first)

(defun expand-some-thread-last
  (expr &rest forms)
  "When expr is not nil, threads it into the first form (via ->>),
  and when that result is not nil, through the next etc

  Depends on nil?"
  (*some-thread expr forms (lambda (sym form) (apply list (vec (concat form [sym]))))))
(install-macro! :some->> expand-some-thread-last)


(defun- build-defun
  (private fn-op &form name params doc+body)
  "Shared implementation of `defun`/`defun-`/`defun-async`/
`defun-async-`: (defvar id (FN-OP id params* body*)), folding an
optional doc-string into the id's metadata so it never reaches the
emitted body as a dead expression statement. `private` picks `defvar`
vs `defvar-` -- new-syntax has no `^:private` reader metadata, so
privacy is now signalled purely by which macro name was used.

Unlike Clojure-wisp's `defn` (name doc? attr-map? [params] body*),
new-syntax puts the param list right after the name (Emacs Lisp
order): (defun name (params*) doc? body*) -- so the docstring, when
present, is the first element of body, not the last element before
it."
  (let* ((doc (if (and (string? (first doc+body)) (not (empty? (rest doc+body))))
              (first doc+body)))

        ;; If docstring is found it's not part of body.
        (body (if doc (rest doc+body) doc+body))

        ;; Combine the doc metadata and add to a name.
        (id (with-meta name (conj (or (meta name) {}) {:doc doc})))

        (fn (with-meta `(,fn-op ,id ,params ,@body) (meta &form)))
        (def-op (if private 'defvar- 'defvar)))
    (list def-op id fn)))

(defun expand-defun
  (&form name params &rest doc+body)
  "(defun name (params*) doc? exprs*) => (defvar name (lambda name params* exprs*))"
  (build-defun false 'lambda &form name params doc+body))
(install-macro! :defun (with-meta expand-defun {:implicit [:&form]}))

(defun expand-defun-
  (&form name params &rest doc+body)
  "Same as `defun` but not exported (see `build-defun`)."
  (build-defun true 'lambda &form name params doc+body))
(install-macro! :defun- (with-meta expand-defun- {:implicit [:&form]}))

(defun expand-defconst
  (name value)
  "(defconst name value) -- may fold into `defvar-`/`defvar` later; for
  now a thin alias with no reassignment-prevention semantics."
  `(defvar ,name ,value))
(install-macro! :defconst expand-defconst)

(defun expand-defconst-
  (name value)
  `(defvar- ,name ,value))
(install-macro! :defconst- expand-defconst-)

(defun expand-setq
  (place value)
  "(setq place value) -- rebind a binding. `set!` already handles both
  symbol and place (list) targets, so `setq`/`setf` are both plain
  aliases for it."
  `(set! ,place ,value))
(install-macro! :setq expand-setq)

(defun expand-setf
  (place value)
  "(setf place value) -- assign a place: (setf (.-x o) 1), (setf (aref a i) v)."
  `(set! ,place ,value))
(install-macro! :setf expand-setf)


(defun expand-lambda-async
  (&rest args)
  "(lambda-async (params*) exprs*)
   (lambda-async name (params*) exprs*)

  Async anonymous function: (async (lambda ...)). The name, when
  given, is only for self-recursion; `await` is valid in the body.
  For an async ARROW, compose the special form directly:
  (async (lambda* (params*) ...))."
  (if (symbol? (first args))
    `(async (lambda ,(first args) ,@(rest args)))
    `(async (lambda ,@args))))
(install-macro! :lambda-async expand-lambda-async)

(defun expand-defun-async
  (&form name params &rest doc+body)
  "(defun-async name (params*) doc? exprs*) -- async `defun`;
  `await` is valid in the body."
  (build-defun false 'lambda-async &form name params doc+body))
(install-macro! :defun-async (with-meta expand-defun-async {:implicit [:&form]}))

(defun expand-defun-async-
  (&form name params &rest doc+body)
  "Same as `defun-async` but not exported (see `build-defun`)."
  (build-defun true 'lambda-async &form name params doc+body))
(install-macro! :defun-async- (with-meta expand-defun-async- {:implicit [:&form]}))


(defun expand-lazy-seq
  (&rest body)
  "Takes a body of expressions that returns an ISeq or nil, and yields
  a Seqable object that will invoke the body only the first time seq
  is called, and will cache the result and return it on all subsequent
  seq calls. See also - realized?

  Depends on lazy-seq"
  `(.call lazy-seq nil false (lambda () ,@body)))
(install-macro :lazy-seq expand-lazy-seq)


(defun expand-when
  (test &rest body)
  "Evaluates test. If logical true, evaluates body in an implicit progn."
  `(if ,test (progn ,@body)))
(install-macro :when expand-when)

(defun expand-unless
  (test &rest body)
  "Evaluates test. If logical false, evaluates body in an implicit progn."
  `(when (not ,test) ,@body))
(install-macro :unless expand-unless)


(defun expand-if-let
  (bindings then else*)
  "bindings => binding-form test
  body => [then else]
  If test is true, evaluates then with binding-form bound to the value of
  test, if not, yields else*."
  (let* ((name (first bindings)) (test (second bindings)) (sym (gensym :if-let-binding)))
    `(let** [,sym ,test]
       (if ,sym (let** ,(destructure [name sym]) ,then) ,else*))))
(install-macro :if-let expand-if-let)

(defun expand-when-let
  (bindings &rest body)
  "bindings => binding-form test
  When test is true, evaluates body with binding-form bound to the value of test."
  `(if-let ,bindings (progn ,@body)))
(install-macro :when-let expand-when-let)


(defun expand-if-some
  (bindings then else*)
  "bindings => binding-form test
  If test is not nil, evaluates then with binding-form bound to the
  value of test, if not, yields else*.

  Depends on nil?"
  (let* ((name (first bindings)) (test (second bindings)) (sym (if (symbol? name) name (gensym :if-some-binding))))
    `(let** [,sym ,test]
       (if-not (nil? ,sym)
         (let** ,(destructure [name sym]) ,then)
         ,else*))))
(install-macro :if-some expand-if-some)

(defun expand-when-some
  (bindings &rest body)
  "bindings => binding-form test
  When test is not nil, evaluates body with binding-form bound to the
  value of test."
  `(if-some ,bindings (progn ,@body)))
(install-macro :when-some expand-when-some)


(defun expand-when-first
  (bindings &rest body)
  "bindings => x xs
  Roughly the same as (when (seq xs) (let [x (first xs)] body)) but xs is evaluated only once

  Depends on seq*"
  (let* ((name (first bindings)) (test (second bindings)))
    `(when-let ([,name] (seq* ,test)) ,@body)))
(install-macro :when-first expand-when-first)


(defun expand-while
  (test &rest body)
  "Repeatedly executes body while test expression is true. Presumes
  some side-effect will cause test to become false/nil. Returns nil"
  `(loop ()
     (when ,test ,@body (recur))))
(install-macro :while expand-while)


(defun expand-doto
  (x &rest forms)
  "Evaluates x then calls all of the methods and functions with the
  value of x supplied at the front of the given arguments.  The forms
  are evaluated in order.  Returns x.
  (doto (Map.) (.set :a 1) (.set :b 2))"
  (let* ((sym (gensym :doto-binding)))
    `(let** [,sym ,x]
       ,@(map (lambda (%) (concat [(first %) sym] (rest %))) forms)
       ,sym)))
(install-macro :doto expand-doto)

(defun expand-dotimes
  (bindings &rest body)
  "bindings => name n
  Repeatedly executes body (presumably for side-effects) with name
  bound to integers from 0 through n-1."
  (let* ((name (first bindings)) (n (second bindings)) (sym (gensym :dotimes-binding)))
    `(let** [,sym ,n]
       (loop ((,name 0))
         (when (< ,name ,sym)
           ,@body
           (recur (inc ,name)))))))
(install-macro :dotimes expand-dotimes)


(defun- for-step (context loop &rest modifiers)
  (let* ((iter  (:iter context)) (coll (:coll context)) (body (:body context)) (subseq (:subseq context))
        (body* (if-not subseq body `(let** [,subseq ,body]
                                     (if (empty? ,subseq)
                                       (recur (rest ,coll))
                                       (lazy-concat ,subseq (,iter (rest ,coll)))))))
        (next  (loop ((mods (reverse modifiers)) (body body*))
                (if (empty? mods)
                  body
                  (let* ((m (first mods)) (item (first m)) (arg (second m)))
                    (recur (rest mods)
                           (cond ((= item ':let)   `(let** ,(paren-bindings->vec arg) ,body))
                                 ((= item ':while) `(if ,arg ,body))
                                 ((= item ':when)  `(if ,arg ,body (recur (rest ,coll)))))))))))
    (merge context
           {:subseq (gensym :for-subseq)
            :body   `((lambda ,iter (,coll)
                        (lazy-seq (loop ((,coll ,coll))
                                    (if-not (empty? ,coll)
                                      (let** [,(first loop) (first ,coll)] ,next)))))
                      ,(second loop))})))

(defvar- for-modifiers #{':let ':while ':when})

(defun- for-parts (seq-expr-pairs)
  (let* ((n        (count seq-expr-pairs))
        (indices  (filter (lambda (%) (-> (aget seq-expr-pairs %) first for-modifiers not))
                         (range n)))
        (segments (partition 2 1 (conj indices n))))
    (map (lambda (%) (.slice seq-expr-pairs (first %) (second %)))
         segments)))

(defun expand-for
  (seq-exprs body-expr)
  "List comprehension. Takes a paren clause list of one or more
   (binding-form collection-expr) pairs, each followed by zero or more
   modifier clauses, and yields a lazy sequence of evaluations of expr.
   Collections are iterated in a nested fashion, rightmost fastest,
   and nested coll-exprs can refer to bindings created in prior
   binding-forms.  Supported modifiers are: (:let ((binding-form expr) ...)),
   (:while test), (:when test).
  (take 100 (for ((x (infinite-range)) (y (infinite-range)) (:while (< y x)))  [x y]))

  Depends on lazy-seq, lazy-concat, empty?, first, rest, cons"
  (let* ((pairs (vec (map vec seq-exprs)))
        (iter (gensym :for-iter)) (coll (gensym :for-coll)) (parts (for-parts pairs)))
    (:body (reduce (lambda (%1 %2) (apply for-step %1 %2))
                   {:iter iter :coll coll :body `(cons ,body-expr (,iter (rest ,coll)))}
                   (reverse parts)))))
(install-macro :for expand-for)

(defun expand-doseq
  (seq-exprs &rest body)
  "Repeatedly executes body (presumably for side-effects) with
  bindings and filtering as provided by 'for'. Does not retain
  the head of the sequence. Returns nil.

  Depends on lazy-seq, lazy-concat, empty?, first, rest, cons, dorun"
  `(dorun (for ,seq-exprs (progn ,@body nil))))
(install-macro :doseq expand-doseq)


(defun- sym* (string)
  (let* ((words (split (name string) #"-")))
    (join (cons (first words) (map capitalize (rest words))))))
(defun- bind-sym* (s b)
  (assert (symbol? s) "Expected a symbol here!")
  [s b])
(defun- conj-syms* (get* result k v f quote)
  (let* ((k-ns (namespace k)) (g (lambda (%) (f k-ns (name %)))))
    (vec (concat result (mapcat (lambda (%) (bind-sym* % (get* % (g %) quote)))
                                v)))))
(defun- dict-get* (dict-name defaults)
  (lambda (binding key quote)
    (let* ((s (name key))
          (k (keyword (namespace key) (if (symbol? key) (sym* s) s))))
      `(get ,dict-name ,(if-not quote k `',k) ,(and binding (aget defaults binding))))))

(defun destructure-dict (binding from)
  (let* ((dict-name  (or (aget binding ':as) (gensym :destructure-bind)))
        (dict-bind  `(if (dictionary? ,dict-name) ,dict-name (apply dictionary (vec ,dict-name))))
        (get*       (dict-get* dict-name (get binding ':or {}))))
    (loop ((ks (keys (dissoc binding ':as ':or))) (result [dict-name from dict-name dict-bind]))
      (if (empty? ks)
        result
        (let* ((k (first ks)) (v (get binding k)) (k* (and (keyword? k) (name k))))
          (assert (or (symbol? k) (and k* (#{:keys :strs :syms} k*)))
                  (str "Invalid destructure key " k))
          (recur (rest ks) (cond ((= k* :strs) (conj-syms* get* result k v keyword))
                                 ((= k* :syms) (conj-syms* get* result k v (lambda (%1 %2) (symbol %1 (sym* %2)))))
                                  ((= k* :keys) (conj-syms* get* result k v keyword))
                                 ((number? v)  (conj result k (get* k (symbol (str v)))))
                                 (else        (conj result k (get* k v))))))))))

(defun destructure-seq (binding from)
  (let* ((as       (.find-index binding (lambda (%) (= % ':as))))
        (seq-name (if (< as 0) (gensym :destructure-bind) (nth binding (inc as))))
        (binding1 (if (< as 0) binding (take as binding)))
        (more     (.find-index binding1 (lambda (%) (or (= % '&) (= % '&rest)))))
        (tail     (if (>= more 0) (nth binding1 (inc more))))
        (binding2 (if (< more 0) binding1 (take more binding))))
    (assert (or (< as 0) (= as (- (count binding) 2)))
            "invalid :as in seq-destructuring")
    (assert (or (< more 0) (= more (- (count binding1) 2)))
            "invalid & in seq-destructuring")
    (loop ((xs binding2) (i 0) (result [seq-name from]))
      (let* ((x (first xs)))
        (cond ((empty? xs) (if-not tail result (conj result tail `(drop ,more ,seq-name))))
              ((= x '_)    (recur (rest xs) (inc i) result))
              (else       (recur (rest xs) (inc i) (conj result x `(nth ,seq-name ,i)))))))))

(defun destructure (bindings)
  (let* ((pairs (partition 2 bindings)))
    (if (every? (lambda (%) (symbol? (first %))) pairs)
      bindings
      (destructure (vec (mapcat (lambda (%) (cond ((vector?     (first %)) (apply destructure-seq %))
                                       ((dictionary? (first %)) (apply destructure-dict %))
                                       ((symbol?     (first %)) %)
                                       (else                   (throw "Invalid binding"))))
                                pairs))))))

(defun- bind-names* (keys)
  (zipmap keys (repeatedly (count keys) (lambda () (gensym :destructure-bind)))))
(defun- bind-indices* (names)
  (filter (lambda (%) (not (symbol? (nth names %)))) (range (count names))))

(defun- paren-bindings->vec
  (bindings)
  "Turns a new-syntax `let`/`let*` paren binding list, e.g.
  ((x 1) (y 2)), into the flat vector [x 1 y 2] the internal `let**`
  form (and `destructure`) expect."
  (vec (mapcat (lambda (pair) [(first pair) (second pair)]) bindings)))

(defun expand-let*
  (bindings &rest body)
  "(let* ((x 1) (y (+ x 1))) body*) -- sequential: each binding sees
  the previous ones."
  `(let** ,(destructure (paren-bindings->vec bindings)) ,@body))
(install-macro! :let* expand-let*)

(defun expand-let
  (bindings &rest body)
  "(let ((x 1) (y 2)) body*) -- bindings evaluated in the OUTER scope
  (parallel): every init-expr sees only what was bound before this
  `let`, never a sibling binding introduced by the same form. All
  init-exprs are evaluated first (bound to gensyms), then the real
  names are bound from those gensyms."
  (let* ((pairs (partition 2 (paren-bindings->vec bindings)))
        (gensyms (map (lambda (_) (gensym :let-binding)) pairs))
        (outer (mapcat (lambda (g pair) [g (second pair)]) gensyms pairs))
        (inner (mapcat (lambda (g pair) [(first pair) g]) gensyms pairs)))
    `(let** ,(vec outer) (let** ,(destructure (vec inner)) ,@body))))
(install-macro! :let expand-let)

(defun- parse-arglist
  (params)
  "Parses a new-syntax parameter list -- (a b &optional (c 10) &rest r)
  -- into {:names [...] :defaults ([name default] ...)}. :names is a
  flat vector using the existing `& rest-name` variadic convention
  fn*/analyze-fn already understands; :defaults are [name default-form]
  pairs to prepend as body statements. Positional destructuring
  (a param position that is itself a vector/dictionary pattern) is
  handled the same way old wisp's `fn` did it -- see `def*` below."
  (loop ((remaining (seq params))
         (mode :required)
         (names [])
         (defaults []))
    (if (empty? remaining)
      {:names names :defaults defaults}
      (let* ((x (first remaining)) (xs (rest remaining)))
        (cond
          ((= x '&optional) (recur xs :optional names defaults))
          ((= x '&rest) (recur xs :rest names defaults))
          ((identical? mode :rest) (recur xs mode (conj names '& x) defaults))
          ((and (identical? mode :optional) (list? x))
          (recur xs mode (conj names (first x))
                 (conj defaults [(first x) (second x)])))
          (else (recur xs mode (conj names x) defaults)))))))

(defun expand-lambda
  (&rest args)
  "(lambda (params*) exprs*)
   (lambda name (params*) exprs*)

  params => positional-params* , or positional-params* &optional
  (opt default?)* &rest next-param

  Compiles to a named `function` expression -- keeps `this`,
  `arguments`, and named self-recursion. Multi-arity clauses
  ((params1*) body1*) ((params2*) body2*) -- Clojure-wisp's arity
  overloading -- are not yet supported for new-syntax: that call is
  deferred to the Phase-3 arity-overloading checkpoint (ticket #5)."
  (let* ((name (if (symbol? (first args)) (first args)))
        (defs (if name (rest args) args)))
    (if (and (list? (first defs))
             (list? (first (first defs))))
      (throw (Error (str "lambda: multi-arity clauses are not supported "
                         "in new-syntax yet -- ticket #5's arity-overloading "
                         "question is still open")))
      (let* ((params (first defs))
            (body (rest defs))
            (parsed (parse-arglist params))
            (indices (bind-indices* (:names parsed)))
            (binds (bind-names* indices))
            (argv (vec (map-indexed (lambda (%1 %2) (get binds %1 %2)) (:names parsed))))
            (destructuring (if (empty? binds)
                            []
                            [`(let** ,(destructure (vec (mapcat (lambda (i) [(nth (:names parsed) i) (get binds i)])
                                                                indices)))
                                ,@body)]))
            (defaulting (map (lambda (d) `(if (nil? ,(first d)) (set! ,(first d) ,(second d))))
                            (:defaults parsed)))
            (body* (if (empty? destructuring)
                    (concat defaulting body)
                    (concat defaulting destructuring))))
        (if name
          `(fn* ,name ,argv ,@body*)
          `(fn* ,argv ,@body*))))))
(install-macro! :lambda expand-lambda)

(defun expand-lambda*
  (&rest args)
  "(lambda* (params*) exprs*)

  The arrow-function form: compiles to an anonymous
  ArrowFunctionExpression, which carries no `.prototype` -- host
  systems that classify any .prototype-bearing function as a class
  (e.g. cordis's isConstructor) stop misreading these as constructors,
  so a returned disposer keeps its teardown.

  Arrows are anonymous: no name, no `this` / `arguments` /
  named self-recursion in the body (the analyzer rejects unresolved
  references). `&optional` defaults are supported (they lower to body
  statements); `&rest` is rejected because the variadic lowering
  slices `arguments`, which arrows do not have. Multi-arity clauses
  are rejected, same as `lambda`."
  (cond ((symbol? (first args))
         (throw (Error "lambda* does not support a name -- arrows are anonymous")))
        ((and (list? (first args))
              (list? (first (first args))))
         (throw (Error (str "lambda*: multi-arity clauses are not supported -- "
                            "use &optional (or lambda) instead"))))
        (else
         (let* ((params (first args))
               (body (rest args))
               (parsed (parse-arglist params))
               (names (:names parsed)))
           (if (some (lambda (%) (= '& %)) names)
             (throw (Error (str "lambda* does not support &rest -- the variadic "
                                "lowering slices `arguments`, which arrows lack")))
             (let* ((indices (bind-indices* names))
                   (binds (bind-names* indices))
                   (argv (vec (map-indexed (lambda (%1 %2) (get binds %1 %2)) names)))
                   (destructuring (if (empty? binds)
                                   []
                                   [`(let** ,(destructure (vec (mapcat (lambda (i) [(nth names i) (get binds i)])
                                                                       indices)))
                                       ,@body)]))
                   (defaulting (map (lambda (d) `(if (nil? ,(first d)) (set! ,(first d) ,(second d))))
                                   (:defaults parsed)))
                   (body* (if (empty? destructuring)
                           (concat defaulting body)
                           (concat defaulting destructuring))))
               ;; The :arrow marker rides the (fn* ...) form's metadata
               ;; into analyze-fn, which threads it onto the AST node
               ;; (and the scope env) for the backend.
               (with-meta `(fn* ,argv ,@body*) {:arrow true})))))))
(install-macro! :lambda* expand-lambda*)

(defun expand-defplugin
  (id &rest more)
  "(defplugin id attrs? (params*) exprs*)

  Defines ID as an arrow-function plugin:
  (defvar id (lambda* (params*) exprs*)) with each pair of the
  optional attrs map forwarded onto the function via
  Object.defineProperty:

  (defplugin handler {:inject [a b]} (ctx config) ...)
  => (defvar handler ((lambda (plugin-gensym)
                        (Object.defineProperty plugin-gensym \"inject\"
                          {:value [a b] :writable true :enumerable true :configurable true})
                        plugin-gensym)
                      (lambda* (ctx config) ...)))

  defineProperty (not plain assignment) is used because the
  function's own `name` (and `length`) properties are non-writable
  and a silent no-op otherwise. The assignments run inside the
  defvar init so the plugin stays a single top-level definition
  (exports semantics identical to `defun`). Any metadata key
  forwards (inject, name, Config, provide, ...). The arrow emit
  carries no .prototype, so plugin hosts cannot misread the plugin
  as a class and drop a returned disposer."
  (let* ((attrs (if (dictionary? (first more)) (first more) {}))
        (defn-forms (if (dictionary? (first more)) (rest more) more))
        (params (first defn-forms))
        (body (rest defn-forms))
        (plugin (gensym "plugin"))
        (forwarding (map (lambda (k)
                           `(.defineProperty js/Object ,plugin ,(name k)
                                             {:value ,(get attrs k)
                                              :writable true
                                              :enumerable true
                                              :configurable true}))
                         (keys attrs))))
    `(defvar ,id ((lambda (,plugin)
                    ,@forwarding
                    ,plugin)
                  (lambda* ,params ,@body)))))
(install-macro! :defplugin expand-defplugin)

(defun expand-loop
  (bindings &rest body)
  "Evaluates the exprs in a lexical context in which the symbols in
  the binding-forms are bound to their respective init-exprs or parts
  therein. Acts as a recur target.

  Depends on dictionary?, dictionary, vec, get"
  (let* ((bindings (paren-bindings->vec bindings))
        (pairs   (partition 2 bindings))
        (indices (bind-indices* (mapv first pairs)))
        (names   (bind-names* indices))
        (get*    (lambda (%1 %2) (if-let [x (aget names %1)]
                   [x (second %2) (first %2) x]
                   %2))))
    (if (empty? names)
      `(loop* ,bindings ,@body)
      `(let** ,(vec (apply concat (map-indexed get* pairs)))
         (loop* ,(vec (apply concat (map-indexed (lambda (%1 %2) (let* ((x (get names %1 (first %2)))) [x x]))
                                                 pairs)))
           (let** ,(vec (mapcat (lambda (i) [(first (aget pairs i)) (aget names i)]) indices))
             ,@body))))))
(install-macro :loop expand-loop)
