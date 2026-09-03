(ns wisp.backend.escodegen.writer
  (:require [wisp.reader :refer [read-from-string]]
            [wisp.ast :refer [meta with-meta symbol? symbol keyword? keyword
                              namespace unquote? unquote-splicing? quote?
                              syntax-quote? name gensym pr-str]]
            [wisp.sequence :refer [empty? count list? list first second third
                                   rest cons conj butlast reverse reduce vec
                                   last map mapv filter take concat partition
                                   repeat interleave assoc]]
            [wisp.runtime :refer [odd? dictionary? dictionary merge keys vals
                                  contains-vector? map-dictionary string?
                                  number? vector? boolean? subs re-find true?
                                  false? nil? re-pattern? inc dec str char
                                  int = == get]]
            [wisp.string :refer [split join upper-case replace triml]]
            [wisp.expander :refer [install-macro!]]
            [escodegen :refer [generate]]))


;; Define character that is valid JS identifier that will
;; be used in generated symbols to avoid conflicts
;; http://www.fileformat.info/info/unicode/char/f8/index.htm
(defvar **unique-char** "ø")

(defun ->camel-join
  (prefix key)
  "Takes dash delimited name "
  (str prefix
       (if (and (not (empty? prefix))
                (not (empty? key)))
         (str (upper-case (get key 0)) (subs key 1))
         key)))

(defun ->private-prefix
  (id)
  "Translate private identifiers like -foo to a JS equivalent
  forms like _foo"
  (let* ((space-delimited (join " " (split id #"-")))
        (left-trimmed (triml space-delimited))
        (n (- (count id) (count left-trimmed))))
    (if (> n 0)
      (str (join "_" (repeat (inc n) "")) (subs id n))
      id)))


(defun translate-identifier-word
  (form)
  "Translates references from clojure convention to JS:

  **macros**      __macros__
  list->vector    listToVector
  set!            set
  foo_bar         foo_bar
  number?         isNumber
  red=            redEqual
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
    ;; foo.bar -> foo_bar
    (setq id (join "_" (split id ".")))
    ;; list->vector ->  listToVector
    (setq id (if (identical? (subs id 0 2) "->")
               (subs (join "-to-" (split id "->")) 1)
               (join "-to-" (split id "->"))))
    ;; set! ->  set
    (setq id (join (split id "!")))
    (setq id (join "$" (split id "%")))
    (setq id (join "-equal-" (split id "=")))
    ;; foo= -> fooEqual
    ;(setq id (join "-equal-" (split id "=")))
    ;; foo+bar -> fooPlusBar
    (setq id (join "-plus-" (split id "+")))
    (setq id (join "-and-" (split id "&")))
    ;; number? -> isNumber
    (setq id (if (identical? (last id) "?")
               (str "is-" (subs id 0 (dec (count id))))
               id))
    ;; -foo -> _foo
    (setq id (->private-prefix id))
    ;; create-server -> createServer
    (setq id (reduce ->camel-join "" (split id "-")))

    ;; residual sweep: the sugar above only rewrites `?`/`>`/`<`/`/` in specific
    ;; positions (a trailing `?`, or the char standing alone). Anything left over
    ;; -- `x?y`, `?foo`, `a>b` -- is still an invalid JS identifier, so map each
    ;; surviving character to a ClojureScript-style munge fragment.
    (setq id (join "_QMARK_" (split id "?")))
    (setq id (join "_GT_" (split id ">")))
    (setq id (join "_LT_" (split id "<")))
    (setq id (join "_SLASH_" (split id "/")))

    id))

(defun translate-identifier
  (form)
  (let* ((ns (namespace form)))
    (str (if (and ns (not (= ns "js")))
           (str (translate-identifier-word (namespace form)) ".")
           "")
         (join \. (map translate-identifier-word (split (name form) \.))))))

(defun error-arg-count
  (callee n)
  (throw (SyntaxError (str "Wrong number of arguments (" n ") passed to: " callee))))

(defun inherit-location
  (body)
  (let* ((start (:start (:loc (first body))))
        (end (:end (:loc (last body)))))
    (if (not (or (nil? start) (nil? end)))
      {:start start :end end})))


(defun write-location
  (form original)
  (let* ((data (meta form))
        (inherited (meta original))
        (start (or (:start form) (:start data) (:start inherited)))
        (end (or (:end form) (:end data) (:end inherited))))
    (if (not (nil? start))
      {:loc {:start {:line (inc (:line start -1))
                     :column (:column start -1)}
             :end {:line (inc (:line end -1))
                   :column (:column end -1)}}}
      {})))

(defvar **writers** {})
(defun install-writer!
  (op writer)
  (setf (get **writers** op) writer))

(defun write-op
  (op form)
  (let* ((writer (get **writers** op)))
    (assert writer (str "Unsupported operation: " op))
    (conj (write-location (:form form) (:original-form form))
          (writer form))))

(defvar **specials** {})
(defun install-special!
  (op writer)
  (setf (get **specials** (name op)) writer))

(defun write-special
  (writer form)
  (conj (write-location (:form form) (:original-form form))
        (apply writer (:params form))))


(defun write-nil
  (form)
  {:type :Literal
   :value null})
(install-writer! :nil write-nil)

(defun write-literal
  (form)
  {:type :Literal
   :value form})

(defun write-list
  (form)
  {:type :CallExpression
   :callee (write {:op :var
                   :form 'list})
   :arguments (map write (:items form))})
(install-writer! :list write-list)

(defun write-symbol
  (form)
  {:type :CallExpression
   :callee (write {:op :var
                   :form 'symbol})
   :arguments [(write-constant (:namespace form))
               (write-constant (:name form))]})
(install-writer! :symbol write-symbol)

(defun write-constant
  (form)
  (cond ((nil? form) (write-nil form))
        ((keyword? form) (write-literal (if (namespace form)
                                         (str (namespace form) "/" (name form))
                                         (name form))))
        ((number? form) (write-number (.valueOf form)))
        ((string? form) (write-string form))
        (else (write-literal form))))
(install-writer! :constant (lambda (%) (write-constant (:form %))))

(defun write-string
  (form)
  {:type :Literal
   :value (str form)})

(defun write-number
  (form)
  (if (< form 0)
    {:type :UnaryExpression
     :operator :-
     :prefix true
     :argument (write-number (* form -1))}
    (write-literal form)))

(defun write-keyword
  (form)
  {:type :Literal
   :value (:form form)})
(install-writer! :keyword write-keyword)

(defun ->identifier
  (form)
  {:type :Identifier
   :name (translate-identifier form)})

(defun write-binding-var
  (form)
  ;; If identifiers binding shadows other binding rename it according
  ;; to shadowing depth. This allows bindings initializer safely
  ;; access binding before shadowing it.
  (let* ((base-id (:id form))
        (resolved-id (if (:shadow form)
                      (symbol nil
                              (str (translate-identifier base-id)
                                   **unique-char**
                                   (:depth form)))
             base-id)))
    (conj (->identifier resolved-id)
          (write-location base-id))))

(defun write-var
  (node)
  "handler for {:op :var} type forms. Such forms may
  represent references in which case they have :info
  pointing to a declaration :var which way be either
  function parameter (has :param true) or local
  binding declaration (has :binding true) like ones defined
  by let and loop forms in later case form will also have
  :shadow pointing to a declaration node it shadows and
  :depth property with a depth of shadowing, that is used
  to for renaming logic to avoid name collisions in forms
  like let that allow same named bindings."
  (if (= :binding (:type (:binding node)))
    (conj (write-binding-var (:binding node))
          (write-location (:form node)))
    (conj (write-location (:form node))
          (->identifier (:form node)))))
(install-writer! :var write-var)
(install-writer! :param write-var)

(defun write-invoke
  (form)
  {:type :CallExpression
   :callee (write (:callee form))
   :arguments (map write (:params form))})
(install-writer! :invoke write-invoke)

(defun write-vector
  (form)
  {:type :ArrayExpression
   :elements (map write (:items form))})
(install-writer! :vector write-vector)

(defun write-dictionary
  (form)
  (let* ((properties (partition 2 (interleave (:keys form)
                                            (:values form)))))
    {:type :ObjectExpression
     :properties (map (lambda (pair)
                        (let* ((key (first pair))
                              (value (second pair)))
                          {:kind :init
                           :type :Property
                           :key (if (= :symbol (:op key))
                                  (write-constant (str (:form key)))
                                  (write key))
                           :value (write value)}))
                      properties)}))
(install-writer! :dictionary write-dictionary)

(defun write-export
  (form)
  (write {:op :set!
          :target {:op :member-expression
                   :computed false
                   :target {:op :var
                            :form (with-meta 'exports (meta (:form (:id form))))}
                   :property (:id form)
                   :form (:form (:id form))}
          :value (:init form)
          :form (:form (:id form))}))

(defun write-def
  (form)
  (conj {:type :VariableDeclaration
         :kind :var
         :declarations [(conj {:type :VariableDeclarator
                               :id (write (:id form))
                               :init (conj (if (:export form)
                                             (write-export form)
                                             (write (:init form))))}
                              (write-location (:form (:id form))))]}
        (write-location (:form form) (:original-form form))))
(install-writer! :def write-def)

(defun write-binding
  (form)
  (let* ((id (write-binding-var form))
        (init (write (:init form))))
    {:type :VariableDeclaration
     :kind :var
     :loc (inherit-location [id init])
     :declarations [{:type :VariableDeclarator
                     :id id
                     :init init}]}))
(install-writer! :binding write-binding)

(defun write-throw
  (form)
  (->expression (conj {:type :ThrowStatement
                       :argument (write (:throw form))}
                      (write-location (:form form) (:original-form form)))))
(install-writer! :throw write-throw)

(defun write-new
  (form)
  {:type :NewExpression
   :callee (write (:constructor form))
   :arguments (map write (:params form))})
(install-writer! :new write-new)

(defun write-set!
  (form)
  {:type :AssignmentExpression
   :operator :=
   :left (write (:target form))
   :right (write (:value form))})
(install-writer! :set! write-set!)

(defun write-aget
  (form)
  {:type :MemberExpression
   :computed (:computed form)
   :object (write (:target form))
   :property (write (:property form))})
(install-writer! :member-expression write-aget)

;; Map of statement AST node that are generated
;; by a writer. Used to decet weather node is
;; statement or expression.
(defvar **statements** {:EmptyStatement true :BlockStatement true
                     :ExpressionStatement true :IfStatement true
                     :LabeledStatement true :BreakStatement true
                     :ContinueStatement true :SwitchStatement true
                     :ReturnStatement true :ThrowStatement true
                     :TryStatement true :WhileStatement true
                     :DoWhileStatement true :ForStatement true
                     :ForInStatement true :ForOfStatement true
                     :LetStatement true :VariableDeclaration true
                     :FunctionDeclaration true})

(defun write-statement
  (form)
  "Wraps expression that can't be in a block statement
  body into :ExpressionStatement otherwise returns back
  expression."
  (->statement (write form)))

(defun ->statement
  (node)
  (if (get **statements** (:type node))
    node
    {:type :ExpressionStatement
     :expression node
     :loc (:loc node)
     }))

(defun ->return
  (form)
  (conj {:type :ReturnStatement
         :argument (write form)}
        (write-location (:form form) (:original-form form))))

(defun write-body
  (form)
  "Takes form that may contain `:statements` vector
  or `:result` form  and returns vector expression
  nodes that can be used in any block. If `:result`
  is present it will be a last in vector and of a
  `:ReturnStatement` type.
  Examples:


  (write-body {:statements nil
               :result {:op :constant
                        :type :number
                        :form 3}})
  ;; =>
  [{:type :ReturnStatement
    :argument {:type :Literal :value 3}}]

  (write-body {:statements [{:op :set!
                             :target {:op :var :form 'x}
                             :value {:op :var :form 'y}}]
               :result {:op :var :form 'x}})
  ;; =>
  [{:type :ExpressionStatement
    :expression {:type :AssignmentExpression
                 :operator :=
                 :left {:type :Identifier :name :x}
                 :right {:type :Identifier :name :y}}}
   {:type :ReturnStatement
    :argument {:type :Identifier :name :x}}]"
  (let* ((statements (map write-statement
                        (or (:statements form) [])))
        (result (if (:result form)
                 (->return (:result form)))))

    (if result
      (conj statements result)
      statements)))

(defun ->block
  (body)
  (if (vector? body)
    {:type :BlockStatement
     :body body
     :loc (inherit-location body)}
    {:type :BlockStatement
     :body [body]
     :loc (:loc body)}))

(defun ->expression
  (&rest body)
  {:type :CallExpression
   :arguments []
   :loc (inherit-location body)
   :callee (->sequence [{:type :FunctionExpression
                         :id nil
                         :params []
                         :defaults []
                         :expression false
                         :generator false
                         :rest nil
                         :body (->block body)}])})

(defun write-do
  (form)
  (if (:block (meta (first (:form form))))
    (->block (write-body (conj form {:result nil
                                     :statements (conj (:statements form)
                                                       (:result form))})))
    (apply ->expression (write-body form))))
(install-writer! :do write-do)

(defun write-if
  (form)
  {:type :ConditionalExpression
   :test (write (:test form))
   :consequent (write (:consequent form))
   :alternate (write (:alternate form))})
(install-writer! :if write-if)

(defun write-try
  (form)
  (let* ((handler (:handler form))
        (finalizer (:finalizer form)))
    (->expression (conj {:type :TryStatement
                         :guardedHandlers []
                         :block (->block (write-body (:body form)))
                         :handlers (if handler
                                     [{:type :CatchClause
                                       :param (write (:name handler))
                                       :body (->block (write-body handler))}]
                                     [])
                         :finalizer (cond (finalizer (->block (write-body finalizer)))
                                          ((not handler) (->block []))
                                          (else nil))}
                        (write-location (:form form) (:original-form form))))))
(install-writer! :try write-try)

(defun- write-binding-value
  (form)
  (write (:init form)))

(defun- write-binding-param
  (form)
  (write-var {:form (:name form)}))

(defun write-binding
  (form)
  (write {:op :def
          :var form
          :init (:init form)
          :form form}))

(defun write-let
  (form)
  (let* ((body (conj form
                   {:statements (vec (concat
                                      (:bindings form)
                                      (:statements form)))})))
    (->iife (->block (write-body body)))))
(install-writer! :let write-let)

(defun ->rebind
  (form)
  (loop ((result [])
         (bindings (:bindings form)))
    (if (empty? bindings)
      result
      (recur (conj result
                   {:type :AssignmentExpression
                    :operator :=
                    :left (write-binding-var (first bindings))
                    :right {:type :MemberExpression
                            :computed true
                            :object {:type :Identifier
                                     :name :loop}
                            :property {:type :Literal
                                       :value (count result)}}})
             (rest bindings)))))

(defun ->sequence
  (expressions)
  {:type :SequenceExpression
   :expressions expressions})

(defun ->iife
  (body id)
  {:type :CallExpression
   :arguments [{:type :ThisExpression}]
   :callee {:type :MemberExpression
            :computed false
            :object {:type :FunctionExpression
                     :id id
                     :params []
                     :defaults []
                     :expression false
                     :generator false
                     :rest nil
                     :body body}
            :property {:type :Identifier
                       :name :call}}})

(defun ->loop-init
  ()
  {:type :VariableDeclaration
   :kind :var
   :declarations [{:type :VariableDeclarator
                   :id {:type :Identifier
                        :name :recur}
                   :init {:type :Identifier
                          :name :loop}}]})

(defun ->do-while
 (body test)
 {:type :DoWhileStatement
  :body body
  :test test})

(defun ->set!-recur
  (form)
  {:type :AssignmentExpression
   :operator :=
   :left {:type :Identifier :name :recur}
   :right (write form)})

(defun ->loop
  (form)
  (->sequence (conj (->rebind form)
                    {:type :BinaryExpression
                     :operator :===
                     :left {:type :Identifier
                            :name :recur}
                     :right {:type :Identifier
                             :name :loop}})))


(defun write-loop
  (form)
  (let* ((statements (:statements form))
        (result (:result form))
        (bindings (:bindings form))

        (loop-body (conj (map write-statement statements)
                        (->statement (->set!-recur result))))
        (body (concat [(
                       ->loop-init)]
                     (map write bindings)
                     [(->do-while (->block (vec loop-body))
                                  (->loop form))]
                     [{:type :ReturnStatement
                       :argument {:type :Identifier
                                  :name :recur}}])))
    (->iife (->block (vec body)) 'loop)))
(install-writer! :loop write-loop)

(defun ->recur
  (form)
  (loop ((result [])
         (params (:params form)))
    (if (empty? params)
      result
      (recur (conj result
                   {:type :AssignmentExpression
                    :operator :=
                    :right (write (first params))
                    :left {:type :MemberExpression
                           :computed true
                           :object {:type :Identifier
                                    :name :loop}
                           :property {:type :Literal
                                      :value (count result)}}})
             (rest params)))))

(defun write-recur
  (form)
  (->sequence (conj (->recur form)
                    {:type :Identifier
                     :name :loop})))
(install-writer! :recur write-recur)

(defun fallback-overload
  ()
  {:type :SwitchCase
   :test nil
   :consequent [{:type :ThrowStatement
                 :argument {:type :CallExpression
                            :callee {:type :Identifier
                                     :name :RangeError}
                            :arguments [{:type :Literal
                                         :value "Wrong number of arguments passed"}]}}]})

(defun splice-binding
  (form)
  {:op :def
   :id (last (:params form))
   :init {:op :invoke
          :callee {:op :var
                   :form 'Array.prototype.slice.call}
          :params [{:op :var
                    :form 'arguments}
                   {:op :constant
                    :form (:arity form)
                    :type :number}]}})

(defun write-overloading-params
  (params)
  (reduce (lambda (forms param)
            (conj forms {:op :def
                         :id param
                         :init {:op :member-expression
                                :computed true
                                :target {:op :var
                                         :form 'arguments}
                                :property {:op :constant
                                           :type :number
                                           :form (count forms)}}}))
          []
          params))

(defun write-overloading-fn
  (form)
  (let* ((overloads (map write-fn-overload (:methods form))))
    {:params []
     :body (->block {:type :SwitchStatement
                     :discriminant {:type :MemberExpression
                                    :computed false
                                    :object {:type :Identifier
                                             :name :arguments}
                                    :property {:type :Identifier
                                               :name :length}}
                     :cases (if (:variadic form)
                              overloads
                              (conj overloads (fallback-overload)))})}))

(defun write-fn-overload
  (form)
  (let* ((params (:params form))
        (bindings (if (:variadic form)
                   (conj (write-overloading-params (vec (butlast params)))
                         (splice-binding form))
                   (write-overloading-params params)))
        (statements (vec (concat bindings (:statements form)))))
    {:type :SwitchCase
     :test (if (not (:variadic form))
             {:type :Literal
              :value (:arity form)})
     :consequent (write-body (conj form {:statements statements}))}))

(defun write-simple-fn
  (form)
  (let* ((method (first (:methods form)))
        (params (if (:variadic method)
                 (vec (butlast (:params method)))
                 (:params method)))
        (body (if (:variadic method)
               (conj method
                     {:statements (vec (cons (splice-binding method)
                                             (:statements method)))})
               method)))
    {:params (map write-var params)
     :body (->block (write-body body))}))

(defun resolve
  (from to)
  (let* ((requirer (split (name from) \.))
        (requirement (split (name to) \.))
        (relative? (and (not (identical? (name from)
                                        (name to)))
                       (identical? (first requirer)
                                   (first requirement)))))
    (if relative?
      (loop ((from requirer)
             (to requirement))
        (if (identical? (first from)
                        (first to))
          (recur (rest from) (rest to))
          (join \/
                (concat [\.]
                        (repeat (dec (count from)) "..")
                        to))))
      (join \/ requirement))))

(defun id->ns
  (id)
  "Takes namespace identifier symbol and translates to new
  symbol without . special characters
  wisp.core -> wisp*core"
  (symbol nil (join \* (split (name id) \.))))


(defun write-require
  (form requirer)
  (let* ((ns-binding {:op :def
                    :id {:op :var
                         :type :identifier
                         :form (id->ns (:ns form))}
                    :init {:op :invoke
                           :callee {:op :var
                                    :type :identifier
                                    :form 'require}
                           :params [{:op :constant
                                     :form (resolve requirer (:ns form))}]}})
        (ns-alias (if (:alias form)
                   {:op :def
                    :id {:op :var
                         :type :identifier
                         :form (id->ns (:alias form))}
                    :init (:id ns-binding)}))

        (references (reduce (lambda (references form)
                             (conj references
                                   {:op :def
                                    :id {:op :var
                                         :type :identifier
                                         :form (or (:rename form)
                                                   (:name form))}
                                    :init {:op :member-expression
                                           :computed false
                                           :target (:id ns-binding)
                                           :property {:op :var
                                                      :type :identifier
                                                      :form (:name form)}}}))
                           []
                           (:refer form))))
    (vec (cons ns-binding
               (if ns-alias
                 (cons ns-alias references)
                 references)))))

(defun write-ns
  (form)
  (let* ((node (:form form))
        (requirer (:name form))
        (ns-binding {:op :def
                    :original-form node
                    :id {:op :var
                         :type :identifier
                         :original-form (first node)
                         :form '*ns*}
                    :init {:op :dictionary
                           :form node
                           :keys [{:op :var
                                   :type :identifier
                                   :original-form node
                                   :form 'id}
                                  {:op :var
                                   :type :identifier
                                   :original-form node
                                   :form 'doc}]
                           :values [{:op :constant
                                     :type :identifier
                                     :original-form (:name form)
                                     :form (name (:name form))}
                                    {:op :constant
                                     :original-form node
                                     :form (:doc form)}]}})
        (requirements (vec (apply concat (map (lambda (%) (write-require % requirer))
                                             (:require form))))))
    (->block (map write (vec (cons ns-binding requirements))))))
(install-writer! :ns write-ns)

(defun write-fn
  (form)
  (let* ((base (if (> (count (:methods form)) 1)
               (write-overloading-fn form)
               (write-simple-fn form))))
    (conj base
          {:type :FunctionExpression
           :id (if (:id form) (write-var (:id form)))
           :defaults nil
           :rest nil
           :generator false
           :expression false})))
(install-writer! :fn write-fn)

(defun write
  (form)
  (let* ((op (:op form))
        (writer (and (= :invoke (:op form))
                    (= :var (:op (:callee form)))
                    (get **specials** (name (:form (:callee form)))))))
    (if writer
      (write-special writer form)
      (write-op (:op form) form))))

(defun write*
  (&rest forms)
  (let* ((body (map write-statement forms)))
    {:type :Program
     :body body
     :loc (inherit-location body)}))


(defun compile
  (&rest args)
  (if (identical? (count args) 1)
    (compile {} (first args))
    (generate (apply write* (rest args)) (first args))))


(defun get-macro
  (target property &rest args)
  (if (empty? args)
    `(aget (or ,target 0)
           ,property)
    (let* ((default* (first args)))
      (if (identical? default* nil)
        `(get ,target ,property)
        `(apply get ,[target property default*])))))
(install-macro! :get get-macro)

;; Logical operators

(defun install-logical-operator!
  (callee operator fallback)
  (defun write-logical-operator
    (&rest operands)
    (let* ((n (count operands)))
      (cond ((= n 0) (write-constant fallback))
            ((= n 1) (write (first operands)))
            (else (reduce (lambda (left right)
                            {:type :LogicalExpression
                             :operator operator
                             :left left
                             :right (write right)})
                          (write (first operands))
                          (rest operands))))))
  (install-special! callee write-logical-operator))
(install-logical-operator! :or :|| nil)
(install-logical-operator! :and :&& true)

(defun install-unary-operator!
  (callee operator prefix?)
  (defun write-unary-operator
    (&rest params)
    (if (identical? (count params) 1)
      {:type :UnaryExpression
       :operator operator
       :argument (write (first params))
       :prefix prefix?}
      (error-arg-count callee (count params))))
  (install-special! callee write-unary-operator))
(install-unary-operator! :not :!)

;; Bitwise Operators

(install-unary-operator! :bit-not :~)

(defun install-binary-operator!
  (callee operator)
  (defun write-binary-operator
    (&rest params)
    (if (< (count params) 2)
      (error-arg-count callee (count params))
      (reduce (lambda (left right)
                {:type :BinaryExpression
                 :operator operator
                 :left left
                 :right (write right)})
              (write (first params))
              (rest params))))
  (install-special! callee write-binary-operator))
(install-binary-operator! :bit-and :&)
(install-binary-operator! :bit-or :|)
(install-binary-operator! :bit-xor :^)
(install-binary-operator! :bit-shift-left :<<)
(install-binary-operator! :bit-shift-right :>>)
(install-binary-operator! :bit-shift-right-zero-fill :>>>)

;; Arithmetic operators

(defun install-arithmetic-operator!
  (callee operator valid? fallback)

  (defun write-binary-operator
    (left right)
    {:type :BinaryExpression
     :operator (name operator)
     :left left
     :right (write right)})

  (defun write-arithmetic-operator
    (&rest params)
    (let* ((n (count params)))
      (cond ((and valid? (not (valid? n))) (error-arg-count (name callee) n))
            ((== n 0) (write-literal fallback))
            ((== n 1) (reduce write-binary-operator
                             (write-literal fallback)
                             params))
            (else (reduce write-binary-operator
                          (write (first params))
                          (rest params))))))


  (install-special! callee write-arithmetic-operator))

(install-arithmetic-operator! :+ :+ nil 0)
(install-arithmetic-operator! :- :- (lambda (%) (>= % 1)) 0)
(install-arithmetic-operator! :* :* nil 1)
(install-arithmetic-operator! (keyword \/) (keyword \/) (lambda (%) (>= % 1)) 1)
(install-arithmetic-operator! :rem (keyword \%) (lambda (%) (== % 2)) 1)


;; Comparison operators

(defun install-comparison-operator!
  (callee operator fallback)
  "Generates comparison operator writer that given one
  parameter writes `fallback` given two parameters writes
  binary expression and given more parameters writes binary
  expressions joined by logical and."

  ;; TODO #54
  ;; Comparison operators must use temporary variable to store
  ;; expression non literal and non-identifiers.
  (defun write-comparison-operator
    (&rest args)
    (let* ((n (count args)))
      (cond ((identical? n 0) (error-arg-count callee 0))
            ((identical? n 1) (->sequence [(write (first args))
                                          (write-literal fallback)]))
            ((identical? n 2) {:type :BinaryExpression
                              :operator operator
                              :left (write (first args))
                              :right (write (second args))})
            (else (let* ((left (first args))
                        (right (second args))
                        (more (rest (rest args))))
                    (reduce (lambda (left right)
                              {:type :LogicalExpression
                               :operator :&&
                               :left left
                               :right {:type :BinaryExpression
                                       :operator operator
                                       :left (if (= :LogicalExpression (:type left))
                                               (:right (:right left))
                                               (:right left))
                                       :right (write right)}})
                            (write-comparison-operator left right)
                            more))))))

  (install-special! callee write-comparison-operator))

(install-comparison-operator! :== :== true)
(install-comparison-operator! :> :> true)
(install-comparison-operator! :>= :>= true)
(install-comparison-operator! :< :< true)
(install-comparison-operator! :<= :<= true)


(defun write-identical?
  (&rest params)
  ;; TODO: Submit a bug for clojure to allow variadic
  ;; number of params joined by logical and.
  (if (identical? (count params) 2)
    {:type :BinaryExpression
     :operator :===
     :left (write (first params))
     :right (write (second params))}
    (error-arg-count :identical? (count params))))
(install-special! :identical? write-identical?)

(defun write-instance?
  (&rest params)
  ;; TODO: Submit a bug for clojure to make sure that
  ;; instance? either accepts only two args or returns
  ;; true only if all the params are instance of the
  ;; given type.

  (let* ((constructor (first params))
        (instance (second params)))
    (if (< (count params) 1)
      (error-arg-count :instance? (count params))
      {:type :BinaryExpression
       :operator :instanceof
       :left (if instance
               (write instance)
               (write-constant instance))
       :right (write constructor)})))
(install-special! :instance? write-instance?)


(defun expand-apply
  (f &rest params)
  (let* ((prefix (vec (butlast params))))
    (if (empty? prefix)
      `(.apply ,f nil ,@params)
      `(.apply ,f nil (.concat ,prefix ,(last params))))))
(install-macro! :apply expand-apply)


(defun expand-print
  (&form &rest more)
  "Prints the object(s) to the output for human consumption."
  (let* ((op (with-meta 'console.log (meta &form))))
    `(,op ,@more)))
(install-macro! :print (with-meta expand-print {:implicit [:&form]}))

(defun expand-str
  (&rest forms)
  "str inlining and optimization via macros"
  `(+ "" ,@forms))
(install-macro! :str expand-str)

(defun expand-debug
  ()
  'debugger)
(install-macro! :debugger! expand-debug)

(defun expand-assert
  (x &rest args)
  "Evaluates expr and throws an exception if it does not evaluate to
    logical true."
  (let* ((message (if (empty? args) "" (first args)))
        (form (pr-str x)))
    `(if (not ,x)
       (throw (Error (str "Assert failed: "
                          ,message
                          ,form))))))
(install-macro! :assert expand-assert)


(defun expand-typestr (it)
  (let* ((prefix "[object ") (suffix "]"))
    `(-> (.call Object.prototype.to-string ,it)
         (.slice ,(count prefix) ,(- (count suffix))))))

(defun expand-defprotocol
  (&env id &rest forms)
  (let* ((ns (name (:name (:ns &env))))
        (protocol-name (name id))
        (protocol-doc (if (string? (first forms))
                       (first forms)))
        (protocol-methods (if protocol-doc
                           (rest forms)
                           forms))
        (not-supported (lambda (method) `(lambda (%) (throw (str ,(str "No protocol method " protocol-name
                                                       "." method " defined for type ")
                                                 ,(expand-typestr '%) ": " %)))))
        (protocol (mapv (lambda (method)
                         (let* ((method-name (first method))
                               (id (id->ns (str ns "$"
                                               protocol-name "$"
                                               (name method-name)))))
                           {:id method-name
                            :fn `(lambda ,id (self)
                                   (.apply (or (if (or (identical? self null) (identical? self nil))
                                                 (.-nil ,id)
                                                 (or (aget self ',id)
                                                     (aget ,id ,(expand-typestr 'self))
                                                     (.-_ ,id)))
                                               ,(not-supported (name id)))
                                           self arguments))}))
                       protocol-methods))
        (fns (map (lambda (form)
                   `(defvar ,(:id form) (aget ,id ',(:id form))))
                 protocol))
        (satisfy {:wisp_core$IProtocol$id (str ns "/" protocol-name)})
        (body (reduce (lambda (body method)
                       (assoc body (:id method) (:fn method)))
                     satisfy
                     protocol)))
    `(,(with-meta 'progn {:block true})
       (defvar ,id ,body)
       ,@fns
       ,id)))
(install-macro! :defprotocol (with-meta expand-defprotocol {:implicit [:&env]}))

(defun expand-deftype
  (id fields &rest forms)
  (let* ((type-init (map (lambda (field) `(setf (aget this ',field) ,field))
                       fields))
        (constructor (conj type-init 'this))
        (method-init (map (lambda (field) `(defvar ,field (aget this ',field)))
                         fields))
        (make-method (lambda (protocol form)
                      (let* ((method-name (first form))
                            (params (second form))
                            (body (rest (rest form)))
                            (field-name (if (= (name protocol) "Object")
                                         `(quote ,method-name)
                                         `(.-name (aget ,protocol ',method-name)))))

                        `(setf (aget (.-prototype ,id) ,field-name)
                               (lambda ,params ,@method-init ,@body)))))
        (satisfy (lambda (protocol)
                  `(setf (aget (.-prototype ,id)
                               (.-wisp_core$IProtocol$id ,protocol))
                         true)))

        (body (reduce (lambda (type form)
                       (if (list? form)
                         (conj type
                               {:body (conj (:body type)
                                            (make-method (:protocol type)
                                                         form))})
                         (conj type {:protocol form
                                     :body (conj (:body type)
                                                 (satisfy form))})))

                       {:protocol nil
                        :body []}

                       forms))

        (methods (:body body)))
    `(defvar ,id (progn
       (defun- ,id ,fields ,@constructor)
       ,@methods
       ,id))))
(install-macro! :deftype expand-deftype)
(install-macro! :defrecord expand-deftype)

(defun expand-extend-type
  (type &rest forms)
  (let* ((default-type? (= type 'default))
        (nil-type? (nil? type))

        (type-name (cond ((nil? type) (symbol "nil"))
                        ((= type 'default) '_)
                        ((= type 'number) 'Number)
                        ((= type 'string) 'String)
                        ((= type 'boolean) 'Boolean)
                        ((= type 'vector) 'Array)
                        ((= type 'function) 'Function)
                        ((= type 're-pattern) 'RegExp)
                        ((= (namespace type) "js") type)
                        (else nil)))

        (satisfy (lambda (protocol)
                  (if type-name
                    `(setf (aget ,protocol
                                 ',(symbol (str "wisp_core$IProtocol$"
                                                (name type-name))))
                           true)
                    `(setf (aget (.-prototype ,type)
                                 (.-wisp_core$IProtocol$id ,protocol))
                           true))))

        (make-method (lambda (protocol form)
                      (let* ((method-name (first form))
                            (params (second form))
                            (body (rest (rest form)))
                            (target (if type-name
                                     `(aget (aget ,protocol ',method-name) ',type-name)
                                     `(aget (.-prototype ,type)
                                            (.-name (aget ,protocol ',method-name))))))
                        `(setf ,target (lambda ,params ,@body)))))

        (body (reduce (lambda (body form)
                       (if (list? form)
                         (conj body
                               {:methods (conj (:methods body)
                                               (make-method (:protocol body)
                                                            form))})
                         (conj body {:protocol form
                                     :methods (conj (:methods body)
                                                    (satisfy form))})))

                       {:protocol nil
                        :methods []}

                       forms))
        (methods (:methods body)))
    `(progn ,@methods nil)))
(install-macro! :extend-type expand-extend-type)

(defun expand-extend-protocol
  (protocol &rest forms)
  (let* ((specs (reduce (lambda (specs form)
                        (if (list? form)
                          (cons {:type (:type (first specs))
                                 :methods (conj (:methods (first specs))
                                                form)}
                                (rest specs))
                          (cons {:type form
                                 :methods []}
                                specs)))
                      nil
                      forms))
        (body (map (lambda (form)
                    `(extend-type ,(:type form)
                       ,protocol
                       ,@(:methods form)
                       ))
                  specs)))


    `(progn ,@body nil)))
(install-macro! :extend-protocol expand-extend-protocol)

(defun aset-expand
  (target field third &rest rest-args)
  (if (empty? rest-args)
    `(setf (aget ,target ,field) ,third)
    (let* ((sub-fields&value (cons third rest-args))
          (resolved-target (reduce (lambda (form node)
                                    `(aget ,form ,node))
                                  `(aget ,target ,field)
                                  (butlast sub-fields&value)))
          (value (last sub-fields&value)))
      `(setf ,resolved-target ,value))))
(install-macro! :aset aset-expand)

(defun alength-expand
  (array)
  "Returns the length of the array. Works on arrays of all types."
  `(.-length ,array))
(install-macro! :alength alength-expand)
