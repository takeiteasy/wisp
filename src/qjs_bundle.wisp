(ns wisp.qjs-bundle
  "Entry point for embedding wisp into QuickJS (the `wisc` CLI).
   Built into dist/wisp_qjs.js as a standalone `Wisp` global and
   driven from src/main.c. Provides compilation, evaluation, input
   completion checks and a CommonJS-style require backed by a module
   registry seeded with the wisp core libraries.")

(defvar runtime (require "./runtime"))
(defvar sequence (require "./sequence"))
(defvar string (require "./string"))
(defvar ast (require "./ast"))
(defvar reader (require "./reader"))
(defvar compiler (require "./compiler"))

(defvar compile* compiler.compile)
(defvar pr-str* ast.pr-str)
(defvar push-back-reader* reader.push-back-reader)
(defvar read* reader.read)
(defvar is-error* runtime.error?)
(defvar is-nil* runtime.nil?)
(defvar keys* runtime.keys)

;; Indirectly referenced so that `eval` runs in global scope,
;; letting REPL definitions persist across evaluations.
(defvar -eval eval)

(defvar host nil)
(defvar modules {})

(defun error->string
  (error)
  (cond ((is-nil* error) "")
        ((not (is-error* error)) (pr-str* error))
        ;; quickjs stack traces do not include the message so build a
        ;; `name: message` header unless the stack already carries one.
        (else (let* ((head (str (or error.name "Error") ": " (or error.message "")))
                    (stack (or error.stack "")))
                (if (> (.indexOf stack head) -1)
                  stack
                  (str head "\n" stack))))))

(defun error->message
  (error)
  (if (is-error* error)
    (or error.message (str error))
    (str error)))

(defvar -eof {})

(defun read-status
  (source)
  "Reads forms from source until EOF. Returns
   {:status \"complete\"} when input forms up to end are well formed,
   {:status \"incomplete\"} when more input is required and
   {:status \"error\" :error message} on syntax errors."
  (try
    (loop ((rdr (push-back-reader* source "<input>")))
      (if (identical? (read* rdr false -eof false) -eof)
        {:status "complete"}
        (recur rdr)))
    (catch e
      (if (> (.indexOf (error->message e) "EOF") -1)
        {:status "incomplete"}
        {:status "error" :error (error->string e)}))))

(defun evaluate
  (source)
  "Compiles and evaluates source in the global scope. Returns
   {:result printed} or {:error message}. Updates *1 *2 *3."
  (let* ((output (compile* source {:source-uri "<input>" :no-map true})))
    (if (:error output)
      {:error (error->string (:error output))}
      (try
        (let* ((value (-eval (:code output))))
          (setf globalThis.*3 globalThis.*2)
          (setf globalThis.*2 globalThis.*1)
          (setf globalThis.*1 value)
          {:result (if (is-nil* value) "nil" (pr-str* value))})
        (catch e {:error (error->string e)})))))

(defun compile-string
  (source uri)
  "Compiles source and returns generated javascript or throws."
  (let* ((output (compile* source {:source-uri uri :no-map true})))
    (if (:error output)
      (throw (:error output))
      (:code output))))

;; --- minimal path utilities ---

(defun path-normalize
  (path)
  (let* ((absolute (= (subs path 0 1) "/"))
        (segments (split path "/")))
    (loop ((todo segments) (out []))
      (if (empty? todo)
        (let* ((tail (if (empty? out) [""] out))
              (joined (join "/" tail)))
          (if absolute (str "/" joined) joined))
        (let* ((segment (first todo)))
          (cond ((= segment ".") (recur (rest todo) out))
                ((= segment "..") (recur (rest todo)
                                        (if (empty? out) [] (vec (butlast out)))))
                ((= segment "") (recur (rest todo) out))
                (else (recur (rest todo) (conj out segment)))))))))

(defun path-dirname
  (path)
  (join "/" (butlast (split path "/"))))

(defun resolve-path
  (request dir)
  (path-normalize
    (if (= (subs request 0 1) "/")
      request
      (str (if (= dir "") "." dir) "/" request))))

(defun is-wisp-path
  (path)
  (> (.indexOf path ".wisp") -1))

;; --- module loading ---

(defun invoke-module
  (code filename)
  (let* ((exports {})
        (module* {:exports exports})
        (dirname (path-dirname filename))
        (require* (make-require dirname))
        ;; Wrapping through indirect eval keeps top-level definitions
        ;; scoped to the module while require/exports stay resolvable.
        (factory (-eval (str "(function (exports, require, module, __filename, __dirname) {\n"
                            code
                            "\n})"))))
    (factory exports require* module* filename dirname)
    (:exports module*)))

(defun load-module
  (path)
  (let* ((cached (get modules path)))
    (if cached
      cached
      (let* ((source (.readFile host path)))
        (if (is-nil* source)
          nil
          (let* ((code (if (is-wisp-path path)
                       (compile-string source path)
                       source)))
            (let* ((exports (invoke-module code path)))
              (setf (aget modules path) exports)
              exports)))))))

(defun make-require
  (dir)
  (lambda require* (request)
    (let* ((registered (get modules request)))
      (if registered
        registered
        (let* ((base (resolve-path request dir)))
          ;; Try the resolved path as-is first so requests carrying an
          ;; explicit extension work, then fall back to probing.
          (or (load-module base)
              (load-module (str base ".wisp"))
              (load-module (str base ".js"))
              (load-module (str base "/index.wisp"))
              (load-module (str base "/index.js"))
              (throw (Error (str "Cannot find module '" request
                                 "' required from '" dir "'")))))))))

(defun run-program
  (path)
  "Loads and executes a .wisp or .js program."
  (let* ((source (.readFile host path)))
    (if (is-nil* source)
      (throw (Error (str "Could not read file: " path)))
      (if (is-wisp-path path)
        (invoke-module (compile-string source path) path)
        (invoke-module source path)))))

(defun load-file
  (path)
  "Evaluates a wisp/js file in the global scope with require bound
   to the file's directory. Returns {:result}/{:error} like evaluate."
  (let* ((source (.readFile host path)))
    (if (is-nil* source)
      {:error (str "Could not read file: " path)}
      (progn
        (setf globalThis.require (make-require (path-dirname path)))
        (let* ((output (compile* source {:source-uri path :no-map true})))
          (if (:error output)
            {:error (error->string (:error output))}
            (try
              (let* ((value (-eval (:code output))))
                (setf globalThis.*3 globalThis.*2)
                (setf globalThis.*2 globalThis.*1)
                (setf globalThis.*1 value)
                {:result (if (is-nil* value) "nil" (pr-str* value))})
              (catch e {:error (error->string e)}))))
        (setf globalThis.require (make-require ""))))))

(defun hoist-builtins
  ()
  "Copies public bindings of core libraries onto the global object
   so they can be referenced without qualification."
  (.forEach [runtime sequence string]
            (lambda (module*)
              (.forEach (keys* module*)
                        (lambda (key)
                          (setf (aget globalThis key) (aget module* key)))))))

(defun init
  (h)
  "Called by the host with {readFile print printErr args exit}.
   Seeds the module registry, sets up global exports/require and
   hoists builtins."
  (setf host h)
  (.forEach [["runtime" runtime]
             ["sequence" sequence]
             ["string" string]
             ["ast" ast]
             ["reader" reader]
             ["compiler" compiler]]
            (lambda (pair)
              (let* ((name* (aget pair 0))
                    (module* (aget pair 1)))
                (setf (aget modules (str "./" name*)) module*)
                (setf (aget modules (str "wisp/" name*)) module*))))
  (setf globalThis.exports {})
  (setf globalThis.require (make-require ""))
  (hoist-builtins))

(setf module.exports {
  :init init
  :compile compile-string
  :evaluate evaluate
  :load-file load-file
  :read-status read-status
  :make-require make-require
  :run-program run-program
  :runtime runtime
  :sequence sequence
  :string string})
