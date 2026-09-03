# Language Essentials

_wisp_ is a homoiconic Lisp that compiles to readable JavaScript and runs
anywhere JavaScript runs — node, the browser, and the `wisc` QuickJS
binary. The surface syntax is a small traditional Lisp: parens over
brackets, `defun` / `lambda` / `progn` / `setq`, `&optional` / `&rest`,
and a `nil`-centric view of lists. The full design spec (reader grammar,
special forms, rationale) lives in [language.md](language.md).

## Data structures

#### nil

`nil` is a runtime **singleton** with list-punning:

- `()` — the empty list — reads as `nil`, as do `(list)` and the tail of a
  one-element list
- `(car nil)` is `nil`, `(cdr nil)` is `nil`
- `nil` is distinct from JavaScript `undefined` and `null` as a value,
  though it coerces to `null` at the JS boundary

```lisp
nil ; => null
```

Only `nil` and `false` are falsy. `0`, `""`, `NaN`, `[]` and `{}` are all
truthy. There is **no `t`** — use `true`.

#### Booleans

`true` / `false` are directly equivalent to plain JavaScript booleans.
`false` is a distinct falsy value, not an alias for `nil`:

```lisp
true ; => true
```

#### Numbers

_wisp_ numbers are directly equivalent to JavaScript numbers:

```lisp
1 ; => 1
```

#### Strings

_wisp_ strings are JavaScript strings:

```lisp
"Hello world"
```
...and can be multi-line:

```lisp
"Hello,
My name is wisp!"
```

#### Characters

Characters are syntactic sugar for single character strings:

```lisp
\a       ; => "a"
\newline ; => "\n"
```

#### Keywords

Keywords are symbolic identifiers that evaluate to themselves:

```lisp
:keyword ; => "keyword"
```

Since JavaScript string constants fulfill the purpose of symbolic
identifiers, keywords compile to equivalent strings. This allows using
keywords in idiomatic fashion for event names and the like:

```lisp
(window.addEventListener :load handler false)
```

Keywords can also be invoked as functions, which is syntax sugar for a
guarded property access:

```lisp
(:bar foo) ; => foo["bar"] when foo is an object
```

Note that keywords in _wisp_ are not real functions, so they can't be
composed or passed to higher order functions.

#### Vectors

_wisp_ vectors are plain JavaScript arrays, but the standard library
functions are non-destructive and pure functional:

```lisp
[1 2 3 4]
```

Unlike Clojure, commas are **not** whitespace — `,x` is the unquote reader
form (see [Macros](#macros)) — so vector elements are simply separated by
spaces.

#### Maps

_wisp_ does not have value-to-value maps; `{}` denotes dictionaries that
map to plain JavaScript objects. Keys cannot consist of arbitrary types:

```lisp
{ "foo" bar :beep-bop "bop" 1 2 }
```

#### Sets

`#{}` denotes a JavaScript `Set`:

```lisp
#{1 2 3}
```

Like keywords, sets can be invoked as functions to test membership:

```lisp
(#{1 2 3} 2) ; => 2 (the member)
(#{1 2 3} 4) ; => nil
```

#### Lists

What would be a LISP without lists? _wisp_ being homoiconic, its code is
made up of lists representing expressions.

As in other LISPs, the first item of an expression is an operator or
function that takes the remainder of the list as arguments, and compiles
accordingly to JavaScript:

```lisp
(foo bar baz) ; => foo(bar, baz);
```

At runtime, lists are built with `list` and `cons` and print with parens:

```lisp
(list 1 2 3) ; => (1 2 3)
(cons 1 nil) ; => (1)
```

The compiled JavaScript is quite unlikely to end up with lists as they
primarily serve their purpose at compile time.

#### Arrays

_wisp_ handles JavaScript indexing in three ways:

1. With `get`, which compiles to guarded access:

```lisp
(get [1 2 3] 1) ; => 2
```

2. With `aget` (or its alias `aref`), which compiles to unguarded access:

```lisp
(aget an-array 2)  ; => anArray[2];
(aref an-array 2)  ; => anArray[2];
```

3. Place assignment with `setf` (see [Assignments](#assignments)):

```lisp
(setf (aref an-array 2) "bar") ; => anArray[2] = "bar";
```

## Conventions

_wisp_ tries very hard to compile to JavaScript that feels hand-crafted
while embracing LISP-style idioms and naming conventions, and translates
them to equivalent JavaScript conventions:

```lisp
dash-delimited ; => dashDelimited
predicate?     ; => isPredicate
**privates**   ; => __privates__
list->vector   ; => listToVector
```

This makes for very natural-looking code, but also allows some things to
be expressed in different ways. For instance, the following invocations
translate to the same thing:

```lisp
(parse-int x)
(parseInt x)

(array? x)
(isArray x)
```

The naming convention for predicates is a `p` / `-p` suffix — `nilp`,
`string-p` — but a trailing `?` still compiles (`nil?` munges to
`isNil`).

## Special forms

There are some special operators in _wisp_ in the sense that they compile
to JavaScript expressions rather than function calls.

Identically-named functions are also available in the standard library to
allow function composition.

#### Arithmetic operations

_wisp_ comes with special forms for common arithmetic:

```lisp
(+ a b)        ; => a + b
(+ a b c)      ; => a + b + c
(- a b)        ; => a - b
(* a b c)      ; => a * b * c
(/ a b)        ; => a / b
(mod a b)      ; => a % b
```

#### Comparison operations

...and special forms for common comparisons:

```lisp
(identical? a b)     ; => a === b
(= a b)              ; structural equality (deep, like Clojure's =)
(= a b c)            ; all equal to each other
(> a b)              ; => a > b
(>= a b)             ; => a >= b
(< a b c)            ; => a < b && b < c
(<= a b c)           ; => a <= b && b <= c
```

Note that `=` is *value* equality — vectors, lists and maps compare
structurally — while `identical?` is reference equality (`===`).

#### Logical and bitwise operations

...and special forms for logical and bitwise operations:

```lisp
(and a b)            ; => a && b
(and a b c)          ; => a && b && c
(or a b)             ; => a || b
(not a)              ; => !a
(and (or a b)
     (and c d))      ; (a || b) && (c && d)
```

```lisp
(bit-and a b)                  ; => a & b
(bit-or a b)                   ; => a | b
(bit-xor a b)                  ; => a ^ b
(bit-shift-left a 2)           ; => a << 2
(bit-shift-right b 3)          ; => b >> 3
(bit-shift-right-zero-fill a 1); => a >>> 1
```

#### Definitions

Variable and function definitions happen through special forms:

```lisp
(defvar a)     ; => var a = null;
(defvar b 2)   ; => var b = 2;
(defconst c 3) ; a constant by convention -- never reassigned
```

Functions are defined with `defun`, taking the parameter list first and an
optional docstring after it:

```lisp
(defun sum
  (x y)
  "Return the sum of x and y"
  (+ x y))
```

Top-level definitions are exported from the module by default. A trailing
dash marks a definition as module-private: `defun-`, `defvar-`,
`defconst-` (see [Exporting Symbols](#exporting-symbols)).

#### Assignments

Bindings can be rebound with `setq`:

```lisp
(setq a 1) ; => a = 1
```

`setf` generalizes assignment to *places* — property access and indexed
elements:

```lisp
(setf (.-foo obj) 1)           ; => obj.foo = 1
(setf (aref an-array 2) "bar") ; => anArray[2] = "bar";
```

Note that in functional programing binding changes are a bad practice
(avoiding these will improve the quality and testability of your code),
but there are always cases where this is required for JavaScript
interoperability.

#### Conditionals

Conditional code branching in _wisp_ is expressed via the `if` special
form.

The first expression following `if` is a condition — if it evaluates to
truthy the result of the `if` form is the second expression, otherwise it
is the *else tail*, which is an implicit `progn`:

```lisp
(if (< number 10)
  "Digit"
  "Number")
```

The else tail is optional, and if missing when the conditional evaluates
to falsy the result is `nil`:

```lisp
(if (monday-p today) "How was your weekend")
```

`when` and `unless` are sugar over `if` for the single-branch case:

```lisp
(when (monday-p today) "How was your weekend")
(unless (monday-p today) "Enjoy your week")
```

The form `cond` takes parenthesized clauses:

```lisp
(cond
  ((monday-p today)  "How was your weekend")
  ((friday-p today)  "Enjoy your weekend")
  ((weekend-p today) "Huzzah weekend")
  (else "Some other day"))
```

Each clause is evaluated in sequence until its test is truthy, and the
value of the clause is the value of its body. If no clause matches, the
form evaluates to `nil`. `else` is the catch-all clause.

#### Combining expressions

In _wisp_ everything is an expression, but sometimes one might want to
combine multiple expressions into one, usually for the purpose of
evaluating expressions that have side-effects. That's where `progn` comes
in:

```lisp
(progn
  (console.log "Computing sum of a & b")
  (+ a b))
```

`progn` can take any number of expressions (including `0`, in which case
it evaluates to `nil`).

#### Bindings

The `let` special form evaluates sub-expressions in a lexical context in
which symbols in its binding list are bound to their respective
expression results. `let` binds *in parallel* — each initializer sees
only the outer scope:

```lisp
(defvar a 10)
(let ((a 1)
      (b a))  ; b is the OUTER a, 10
  b)          ; => 10
```

`let*` binds *sequentially* — each binding sees the previous ones:

```lisp
(let* ((a 1)
       (b (+ a 1)))
  (+ a b))    ; => 3
```

Destructuring is supported in bindings and parameter lists, both
positional `[a b]` and associative `{:keys [k]}`.

#### Functions

_wisp_ functions are plain JavaScript functions:

```lisp
(lambda (x) (+ x 1)) ; => function(x) { return x + 1; }
```

_wisp_ functions can have names, just as in JavaScript:

```lisp
(lambda increment (x) (+ x 1)) ; => function increment(x) { return x + 1; }
```

A named `lambda` can refer to itself by name for recursion, and its body
keeps the surrounding `this` and `arguments`.

Most functions are defined with `defun`, which also accepts a docstring:

```lisp
(defun increment
  (x)
  "Return x plus one"
  (+ x 1))
```

`lambda*` is the arrow-function form — it compiles to a JavaScript arrow
(`x => { … }`) instead of a `function` expression:

```lisp
(lambda* (x) (* x 2)) ; => x => { return x * 2; }
```

Arrows carry no `.prototype`, so hosts that treat any `.prototype`-bearing
function as a class (constructor) cannot misread them. In exchange, an arrow
has no own `this` or `arguments`, cannot be named for self-recursion, and
does not support `&rest` — referencing `this`/`arguments` that do not resolve
to a real binding is a compile error.

`defplugin` defines an arrow plugin whose metadata map is attached to the
function — the shape plugin hosts like cordis expect:

```lisp
(defplugin handler
  {:inject [logger] :name "my-handler"}
  (ctx config)
  (…))
; logger and config arrive via dependency injection; the function carries
; handler.inject = [logger] and handler.name = "my-handler"
```

#### Arguments

An argument that follows `&rest` captures the remaining arguments as a
list:

```lisp
(defun sum
  (x &rest more)
  (reduce + x more))
```

An argument that follows `&optional` is `nil` when not supplied, and may
carry a default form:

```lisp
(defun greet
  (&optional (who "world"))
  (str "hello, " who))
```

Arity overloading (`(lambda ((x) ...) ((x y) ...))`) is not part of the
language — `&optional` and `&rest` cover its uses.

#### Loops and TCO

A classic way to build a loop in LISP is via recursion. _wisp_ provides a
`loop` / `recur` construct that allows for tail call optimization. The
bindings are a parenthesized list of `(name init)` pairs:

```lisp
(loop ((x 10))
  (if (> x 1)
    (progn
      (print x)
      (recur (- x 2)))))
```

`recur` jumps back to the loop head with new bindings; a `loop` with no
bindings is written `(loop () …)`.

The standard library also provides `while`, `dotimes` and lazy `for`
macros on top of `loop` / `recur`.

## Other Special Forms

### Instantiation

In _wisp_ type instantiation has a concise form, by way of suffixing the
function with a period (`.`):

```lisp
(Type. options)
```

However, the more verbose but more JavaScript-like form is also valid:

```lisp
(new Class options)
```

#### Method calls

In _wisp_ method calls are no different from function calls, but
prefixed with a period (`.`):

```lisp
(.log console "hello wisp")
```

...and, of course, the more JavaScript-like forms are supported too:

```lisp
(window.addEventListener "load" handler false)
```

#### Attribute access

In _wisp_, attribute access is also treated like a function call, but
attributes need to be prefixed with `.-`:

```lisp
(.-location window)
```

Compound properties can be accessed via `get` or `aref`:

```lisp
(get templates (.-id element))
```

Assignment to attributes and elements goes through `setf`:

```lisp
(setf (.-location window) "http://example.com")
```

#### Catching Exceptions

In _wisp_ exceptions can be handled via the `try` special form. As with
everything else, the `try` form is also an expression that evaluates to
`nil` if no handling takes place.

```lisp
(try (raise exception))
```

...the `catch` clause can be used to handle exceptions...

```lisp
(try
  (raise exception)
  (catch error (console.log error)))
```

...and the `finally` clause can be used too:

```lisp
(try
  (raise exception)
  (catch error (recover error))
  (finally (console.log "That was a close one!")))
```

#### Throwing Exceptions

The `throw` special form allows throwing exceptions:

```lisp
(defun raise (message) (throw (Error. message)))
```

## Macros

_wisp_ has a powerful programmatic macro system which allows the compiler
to be extended by user code.

Many core constructs of _wisp_ are in fact normal macros, and you are
encouraged to study the source to learn how to build your own.
Nevertheless, the following sections are a quick primer on macros.

#### quote

Before diving into macros too much, we need to learn a few more things.
In LISP any expression can be quoted to prevent it from being evaluated.

As an example, take the symbol `foo` — by default, you will be evaluating
the reference to its corresponding value:

```lisp
foo
```

But if you wish to refer to the literal symbol, this is how you do it:

```lisp
(quote foo)
```

or, as shorthand:

```lisp
'foo
```

Any expression can be quoted to prevent its evaluation (these are not,
however, compiled to JavaScript):

```lisp
'foo
':bar
'(a b)
```

#### An Example Macro

Let's implement `unless` as a function first, to understand the use case
for macros:

```lisp
(defun unless-fn (condition body)
  (if condition nil body))
```

But since function arguments are evaluated before the function itself is
called, the following code will _always_ write a log message:

```lisp
(unless-fn true (console.log "should not print"))
```

Macros solve this problem, because they do not evaluate their arguments
immediately. Instead, you get to choose when (and if!) the arguments to a
macro are evaluated. Macros take items of the expression as arguments and
return a new form that is compiled instead.

```lisp
(defmacro unless
  (condition form)
  (list 'if condition nil form))
```

The body of the `unless` macro executes at macro expansion time,
producing an `if` form for compilation. This way the compiled JavaScript
is a conditional instead of a function call.

```lisp
(unless true (console.log "should not print"))
```

#### syntax-quote

Simple macros like the above could be written via templating and
expressed as syntax-quoted forms.

`syntax-quote` is almost the same as plain `quote`, but it allows sub
expressions to be unquoted so that the form acts as a template.

The symbols inside the form are resolved to help prevent inadvertent
symbol capture, which can be done via `unquote` and `unquote-splicing`
forms:

```lisp
(syntax-quote (foo (unquote bar)))
(syntax-quote (foo (unquote bar) (unquote-splicing bazs)))
```

Note that there is special syntactic sugar for both unquoting operators:

1. Syntax quote: Quote the form, but allow internal unquoting so that
   the form acts as a template. Symbols inside the form are resolved to
   help prevent inadvertent symbol capture.

```lisp
`(foo bar)
```

2. Unquote (`,`): Use inside a syntax-quote to substitute an unquoted
   value.

```lisp
`(foo ,bar)
```

3. Splicing unquote (`,@`): Use inside a syntax-quote to splice an
   unquoted list into a template.

```lisp
`(foo ,bar ,@bazs)
```

For example, a `define-var` macro can be defined with a simple template:

```lisp
(defmacro define-var
  (name &rest body)
  `(defvar ,name ,@body))
```

Now if we use the `define-var` form above, the defined macro will be
expanded at compile time, resulting in different program output:

```lisp
(define-var answer 42)
```

Not all of the macros can be expressed via templating, but all of the
language is available to assemble macro expanded forms.

#### Another Macro Example

As an example, let's define a macro to ease functional chaining, a
technique popular in JavaScript but usually expressed via method
chaining. A typical use of that would be something like:

```javascript
open(target, "keypress").
  filter(isEnterKey).
  map(getInputText).
  reduce(render)
```

Unfortunately, though, it usually requires that all the chained functions
need to be methods of an object, which is very limited and has the
undesirable effect of making third party functions "second class".

But using macros we can achieve similar chaining without such tradeoffs,
and chain _any_ function (this is the `->` threading macro, which ships
with the standard library):

```lisp
(defmacro ->
  (&rest operations)
  (reduce
   (lambda (form operation)
     (cons (first operation)
           (cons form (rest operation))))
   (first operations)
   (rest operations)))

(->
 (open target :keypress)
 (filter enter-key)
 (map get-input-text)
 (reduce render))
```

## Import/Export (Symbols and Modules)

### Exporting Symbols

All the top level definitions in a file are exported by default:

```lisp
(defvar foo bar)
(defun greet (name) (str "hello " name))
```

...but it's possible to define top-level bindings without exporting them
via the trailing-dash defining forms:

```lisp
(defvar- foo bar)
(defun- greet (name) (str "hello " name))
(defconst- default-name "world")
```

### Importing

Module importing is done via an `ns` special form that is manually
named. _wisp_ takes a minimalistic approach and supports only one
essential way of importing modules:

```lisp
(ns interactivate.core.main
  "interactive code editing"
  (:require [interactivate.host :refer [start-host!]]
            [fs]
            [wisp.backend.javascript.writer :as writer]
            [wisp.sequence
             :refer [first rest]
             :rename {first car rest cdr}]))
```

Let's go through the above example to get a complete picture regarding
how modules can be imported:

1. The first parameter `interactivate.core.main` is a name of the
   module / namespace. In this case it represents module
   `./core/main` under the package `interactivate`. While this is
   not enforced in any way the common convention is that these mirror
   the filesystem hierarchy.

2. The second string parameter is just a description of the module
   and is completely optional.

3. The `(:require ...)` form defines dependencies that will be
   imported at runtime, and the example above imports multiple modules:

   1. First it imports the `start-host!` function from the
      `interactivate.host` module. That will be loaded from the
      `../host` location, since module paths are resolved
      relative to a name, but only if they share the same root.
   2. The second form imports `fs` module and makes it available under
      the same name. Note that in this case it could have been
      written without wrapping it in brackets.
   3. The third form imports `wisp.backend.javascript.writer` module
      from `wisp/backend/javascript/writer` and makes it available
      via the name `writer`.
   4. The last and most complex form imports `first` and `rest`
      functions from the `wisp.sequence` module, although it also
      renames them and therefore makes them available under the
      `car` and `cdr` names.

While Clojure has many other kinds of reference forms they are
not recognized by _wisp_ and will therefore be ignored.

### Types and Protocols

Protocols are defined via `defprotocol`:

```lisp
(defprotocol ISeq
  (-first (coll))
  (-rest (coll)))

(defprotocol ICounted
  (count (coll) "constant time count"))
```

Above code will define `ISeq`, `ICounted` protocols (objects representing
those protocols) and `-first`, `-rest`, `count` functions, that dispatch
on the first argument (that must implement the associated protocol).

Existing types / classes (defined either in wisp or JS) can be extended
to implement a specific protocol using `extend-type`:

```lisp
(extend-type Array
  ICounted
  (count (array) (.-length array))
  ISeq
  (-first (array) (aget array 0))
  (-rest (array) (.slice array 1)))
```

Once a type / class implements a protocol, its functions can be used on
the instances of that type / class:

```lisp
(count [])        ;; => 0
(count [1 2])     ;; => 2
(-first [1 2 3])  ;; => 1
(-rest [1 2 3])   ;; => [2 3]
```

A value can be checked against a protocol via `satisfies?`:

```lisp
(satisfies? ICounted [1 2])
(satisfies? ISeq [])
```

New types (that translate to JS classes) can be defined via the
`deftype` form:

```lisp
(deftype List (head tail size)
  ICounted
  (count (_) size)
  ISeq
  (-first (_) head)
  (-rest (_) tail)
  Object
  (toString (self) (str "(" (join " " self) ")")))
```

Note: Protocol functions are defined as methods with unique names
(that include namespace info where the protocol was defined, protocol
name & method name) to avoid name collisions on types / classes
implementing them. This implies that such methods aren't very useful
from the JS side. The special `Object` protocol can be used to define
methods whose names will be kept as-is, which can be used to define an
interface to be used from the JS side (like the `toString` method
above).

Multiple types can be extended to implement a specific protocol using
the `extend-protocol` form. A `default` extension covers all remaining
values:

```lisp
(extend-protocol INope
  number
  (nope? (x) true)

  default
  (nope? (x) false))
```

[homoiconicity]: http://en.wikipedia.org/wiki/Homoiconicity
[s-expressions]: http://en.wikipedia.org/wiki/S-expression
