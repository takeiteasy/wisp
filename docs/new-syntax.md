# new-syntax — the traditional-Lisp dialect (design spec)

> **Status: design only.** Nothing here is implemented. The compiler today
> speaks the Clojure-flavoured syntax documented elsewhere; this file is the
> agreed target for a divergence toward a small Emacs-Lisp-style dialect.
> Tracked in the tracker: the RFC, the spec task, and the two codegen
> follow-ups (arrow form, async/await). When the rewrite lands this file
> becomes `docs/language.md`.

## Why

"Clojure syntax → JavaScript" is already served, more completely, by
ClojureScript. The unoccupied space is a *small traditional Lisp* that
compiles to readable JS and runs anywhere JS runs (node, browser, the `wisc`
quickjs binary): parens over brackets, `defun`/`lambda`/`progn`/`setq`,
`&optional`/`&rest`, `nil`-centric. That is worth maintaining as its own
language rather than as Clojure-minus-features.

## What does not change

Front-of-house only. Untouched:

- the pipeline `reader → expander → analyzer → AST → escodegen backend → JS`
- JS interop: `(.method obj)`, `(.-prop obj)`, `(js/Thing …)`, `js/undefined`,
  `(new Thing …)`, `aget`/`aset`
- `require` / module resolution (node-style: verbatim, `.wisp`, `.js`,
  `/index.wisp`, `/index.js`; cached by resolved path)
- identifier munging where JS interop needs it (see *Identifier munging*)
- `wisc` runtime, bundle pipeline, the `Wisp.init` host contract
- the escodegen 2.x backend
- `[]` `{}` `#{}` reader sugar → JS array / object / `Set`
- `:keyword` literals — self-evaluating, callable on maps
- `#"…"` regex literals, `#uuid` / `#inst` / … tagged literals
- `#_` form-level discard, `;` line comments, `#!` shebang line
- file extension stays `.wisp`

## Semantics

### nil and truth

`nil` is a **runtime singleton** with list-punning:

- `()`, `(list)`, and the tail of a one-element list all read/return that
  singleton
- `(car nil)` → `nil`, `(cdr nil)` → `nil`
- `nil` is distinct from JS `undefined`/`null` as a value, though it coerces
  to `null` at the JS boundary

The **truth table is unchanged** from wisp today — only `nil` and `false` are
falsy; `0`, `""`, `NaN`, `[]`, `{}` are all truthy. There is **no `t`**;
`true` and `false` remain, and `false` stays a distinct falsy value (not an
alias for `nil`). `if` / `when` / `unless` / `and` / `or` / `cond` test
"is it `nil` or `false`", exactly as now.

Rationale: Lisp list ergonomics (`(if (cdr xs) …)`) without Emacs Lisp's
`0`-and-`""`-are-true surprises or a JS-boolean coercion tax at every interop
call.

### scope

Lexical, as today. No dynamic binding. `*earmuffed*` names are a convention
only (they mangle to `__earmuffed__`), not a `defvar`-creates-a-special rule.

## Reader syntax

| char | meaning | change from today |
|---|---|---|
| `( … )` | form / call | — |
| `[ … ]` | vector → JS array | — |
| `{ … }` | map → JS object | — |
| `#{ … }` | set → JS `Set` | — |
| `:name` | keyword | — |
| `"…"` | string | — |
| `\c` `\newline` | character | — |
| `#"…"` | regex | — |
| `'x` | `(quote x)` | — |
| `` `x `` | quasiquote | — |
| `,x` | unquote | **was `~x`** |
| `,@x` | unquote-splicing | **was `~@x`** |
| `@x` | `(deref x)` | — |
| `;` … | line comment | — |
| `#_ x` | discard next form | — |
| `#uuid` … | tagged literals | — |
| `^…` | *(removed)* metadata | **gone** — see *Metadata* |
| `#( … )` `%` `%1` | *(removed)* fn shorthand | **gone** — use `lambda` |

`,` stops being whitespace (it is now unquote); `~`, `%`, `^` become free.

## Special forms and core macros

### defining

```
(defun  name (params…) body…)      ; named function expression
(defun- name (params…) body…)      ; same, not exported
(lambda (params…) body…)           ; anonymous function expression
(lambda name (params…) body…)      ; named, for self-recursion
(lambda* (params…) body…)          ; ARROW function — no .prototype, no this/arguments   [tracked: arrow-form task]
(defplugin name (ctx config) body…); macro → (defvar name (lambda* (ctx config) body…)) + plugin metadata   [tracked: arrow-form task]

(defun-async  name (params…) body…); async function                                       [tracked: async task]
(lambda-async (params…) body…)     ; async anonymous function                             [tracked: async task]
```

- `lambda` compiles to a **named `function` expression** — keeps `this`,
  `arguments`, and named self-recursion.
- `lambda*` compiles to an **`ArrowFunctionExpression`** — has no
  `.prototype`, so cordis's `isConstructor()` stops misfiring on plugins. Its
  body may not use `this` / `arguments` / named self-recursion.
- `lambda*` spelling is not final (`=>` is the alternative under discussion).

### binding and places

```
(defvar   name value)     (defvar-   name value)     ; module var  (exported unless -)
(defconst name value)     (defconst- name value)     ; no reassignment
(setq  place value …)                                ; assign a binding
(setf  place value …)                                ; assign a place: (setf (.-x o) 1) (setf (aref a i) v)
```

`(defconst- …)` may fold into `(defvar- …)` — open.

### sequencing and locals

```
(progn body…)                       ; was (do …)
(let  ((x 1) (y 2)) body…)          ; bindings evaluated in the OUTER scope (parallel)
(let* ((x 1) (y (+ x 1))) body…)    ; each binding sees the previous (sequential)
```

### conditionals

```
(if test then else… )               ; Emacs Lisp shape: the else TAIL is an implicit progn
(when   test body…)                 ; macro → (if test (progn body…))
(unless test body…)                 ; macro → (if test nil (progn body…))
(cond (test body…) …               ; PAREN clauses
      (else body…))                 ; `else` is the catch-all
(case e (val body…) … (else body…))
(and a b …)   (or a b …)   (not x)
```

### quoting, macros, async

```
(quote x)   `x   ,x   ,@x
(defmacro name (params…) body…)
(async expr)                        ; expr as an async IIFE / marks the enclosing fn   [tracked: async task]
(await expr)                        ; only valid lexically inside an async function     [tracked: async task]
```

### kept from wisp-as-is for v1 (revisit after cutover)

- `loop` / `recur` — no TCO on the platform, so kept.
- threading macros `->` `->>` `as->` `some->` — library macros, not specials.
- `defprotocol` / `defrecord` / `deftype` / `extend-type` / `extend-protocol`
  — map cleanly to JS prototypes; a `defstruct` + `defgeneric`/`defmethod`
  redesign is a later task.
- `ns` / `require` / `provide` — kept verbatim; an elisp-style
  `(require 'x)` / `(provide 'x)` rename is deferred.
- positional `[a b]` and associative `{:keys [k]}` destructuring in `let`
  and parameter lists.

## Parameter lists

```
(a b)                       ; required
(a &optional c)             ; c is nil if not supplied
(a &optional (c 10))        ; with a default form
(a &rest more)              ; more is a list of the remaining args
(a &optional b &rest more)
```

`&rest` replaces Clojure's `& more`. `&optional` with default forms replaces
most uses of arity overloading.

**Arity overloading** — `(lambda ((x) …) ((x y) …))` — is a Clojure specific
and is **under review, likely removed**. `&optional`/`&rest` cover the real
uses. The final call waits until the source-tree transform is prototyped and
the number of overloaded sites in `src/*.wisp` is known; if it is retained it
is documented as non-idiomatic.

## JS interop

```
(.method obj arg…)          ; method call
(.-prop obj)                ; property access
(setf (.-prop obj) v)       ; property assignment
(new Date)                  ; construction
(aref obj key)              ; obj[key]   (alias: aget)
(setf (aref obj key) v)     ; obj[key] = v
js/undefined  js/window  (js/Thing …)
```

`.` is JS member access. `/` is a module-qualified reference. Module names
stay dotted (`wisp.backend.escodegen.writer`) for v1; a separators overhaul
is deferred.

### Identifier munging

Unchanged from today (JS interop depends on it):

- dashes → camelCase: `add-event-listener` → `addEventListener`
- trailing `?` → `is` prefix: `nil?` → `isNil`
- `!` dropped: `set!` → `set`
- `*x*` / `**x**` → `_x_` / `__x__`
- `->` → `-to-` → camelCased: `->string` → `toString`
- residual `?` `>` `<` `/` in a name → `_QMARK_` `_GT_` `_LT_` `_SLASH_`

## Metadata

The `^…` reader syntax is **removed**. Its only load-bearing use in the
compiler is `:private` (it gates what is attached to `exports`); that is
replaced by the trailing-dash defining forms (`defun-`, `defvar-`,
`defconst-`). Type hints (`^number`, `^clj`) are advisory-only and are
dropped. Arbitrary `^{…}` metadata and a reader `with-meta` form are dropped;
the `with-meta` / `meta` functions stay for AST work.

## Naming conventions

- predicates end in `p` / `-p`: `stringp`, `list-p`. (`foo?` still compiles —
  the `?` munge is retained — but the idiom is `p`.)
- deep internals: `package--name` double-dash (Emacs Lisp style), in addition
  to `defun-` for "not exported".
- `*earmuffs*` for special/config-ish module vars — convention only.

## Old → new cheat sheet

| Clojure-wisp | new-syntax |
|---|---|
| `(defn f [a b] …)` | `(defun f (a b) …)` |
| `(defn- f [a] …)` | `(defun- f (a) …)` |
| `(fn [a] …)` / `(fn g [a] …)` | `(lambda (a) …)` / `(lambda g (a) …)` |
| `#(+ % 1)` | `(lambda (x) (+ x 1))` |
| `(def x 1)` | `(defvar x 1)` |
| `(def ^:private x 1)` | `(defvar- x 1)` |
| `(set! x 1)` | `(setq x 1)` |
| `(set! (.-p o) 1)` / `(aset o k v)` | `(setf (.-p o) 1)` / `(setf (aref o k) v)` |
| `(do a b)` | `(progn a b)` |
| `(let [x 1 y 2] …)` | `(let ((x 1) (y 2)) …)` |
| `[a b & r]` | `(a b &rest r)` |
| `` `(a ~b ~@c) `` | `` `(a ,b ,@c) `` |
| `(if c a)` / `(if c a b)` | `(if c a)` / `(if c a b)` |
| `(cond p x q y :else z)` | `(cond (p x) (q y) (else z))` |
| `^:async` (planned) | `(defun-async …)` / `(lambda-async …)` |
| `nil?` idiom | `nilp` / `null` |

## Worked example

```lisp
(ns example.greet
  (:require [wisp.string :refer (upper-case)]))

(defconst- default-name "world")

(defun- shout (s)
  (upper-case (str s "!")))

(defun greet (&optional (who default-name))
  "Return a greeting for WHO (defaults to \"world\")."
  (cond ((nilp who)    (shout "hey"))
        ((stringp who)  (shout (str "hello " who)))
        (else           (shout (str "hello " (str who))))))

;; a cordis-style plugin: lambda* so it is not new-ed as a constructor
(defplugin logger (ctx config)
  (let ((level (or (aref config "level") "info")))
    (.on ctx "dispose" (lambda* () (.log js/console "logger: bye")))
    (ctx.provide "log" (lambda* (msg) (.log js/console (str "[" level "] " msg))))))
```

Compiles (shape) to: `example/greet.wisp` → a CommonJS module; `greet` and
`logger` on `exports`, `default-name` and `shout` module-local; `greet`'s
optional param defaulting inline; `lambda*` bodies as `() => …`.

## Open questions

- `lambda*` vs `=>` for the arrow form.
- whether `defconst-` is worth having separately from `defvar-`.
- arity overloading: keep as a non-idiomatic extension, or remove.
- `:export` clause on the module form vs the trailing-dash forms.
- `ns` → `(require 'x)` / `(provide 'x)` rename, and `.`-vs-`/` in module
  names — deferred, but listed so they are not forgotten.
