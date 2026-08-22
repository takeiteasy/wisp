# wisc — wisp on QuickJS

`wisc` is a standalone CLI that embeds the bootstrapped wisp compiler
into [quickjs-ng](https://github.com/quickjs-ng/quickjs). The compiler
is bundled to a single JavaScript file (`dist/wisp_qjs.js`) at build
time and linked into the binary as a byte array, so the executable has
no runtime dependencies beyond libc.

## Building

Requirements: node/npm (one-time bootstrap — wisp is written in wisp),
cmake, a C compiler, and git submodules.

    git submodule update --init   # fetches vendor/quickjs-ng
    npm install                   # installs browserify + bootstrap wisp
    make                          # compiles src/*.wisp with the bootstrap compiler
    make wisc                     # bundle + quickjs + C frontend -> build/wisc

`make wisc-check` runs a small smoke suite against the binary.
`make wisc-clean` removes build artifacts (bundle and objects only).

## Usage

| invocation            | behavior                                    |
|-----------------------|---------------------------------------------|
| `wisc`                | interactive REPL (line editing via libedit) |
| `wisc file.wisp`      | compile and run a program                   |
| `echo '(+ 1 2)' \| wisc -` | evaluate stdin, print results          |
| `wisc -c file.wisp`   | compile to stdout                           |
| `wisc -c - < file`    | compile stdin to stdout                     |
| `wisc -e "(+ 1 2)"`   | evaluate an expression (repeatable)         |
| `wisc -i`             | force the REPL even when stdin is piped     |

Anything after `--` (or after the script path) is exposed to the
program as `wisc.args`.

### REPL

- prompt `user=> `, continuation `... ` when forms are incomplete
  (detected with the wisp reader, so multi-line `(defn ...)` works)
- results are printed with `pr-str`; errors go to stderr with stack
- `*1`, `*2`, `*3` hold recent results
- history is kept in `~/.wisc_history`
- commands: `:help`, `:quit`/`:q`, `:load <file>`

### Host API

Scripts see a global `wisc` object provided by the C frontend:

- `wisc.print` / `wisc.printErr` — write joined args to stdout/stderr
- `wisc.readFile(path)` — file contents as a string, or `null`
- `wisc.args` — array of script arguments
- `wisc.exit(status)` — flush and exit

A `console.log/error/warn/info` shim maps onto the same functions.
The wisp core libraries (`runtime`, `sequence`, `string`) are hoisted
into global scope, so `str`, `map`, `filter` etc. work without imports.

### require

Compiled wisp emits CommonJS-style `require()` calls. `wisc` provides:

- **core libraries**: `[wisp.sequence]`, `[wisp.string]`, `[wisp.runtime]`,
  `[wisp.compiler]`, `[wisp.reader]`, `[wisp.ast]` resolve from a module
  registry seeded at startup
- **local files**: relative requests (`"./foo"` / `"./foo.wisp"`) load
  `.wisp` (compiled on demand) or `.js` files, resolved against the
  requiring file's directory, with `index.wisp`/`index.js` probing;
  modules are cached by resolved path like node

## Architecture

```
src/*.wisp --(bootstrap wisp)--> *.js --(browserify --standalone Wisp)--> dist/wisp_qjs.js
dist/wisp_qjs.js --(xxd -i)--> build/bundle.c
vendor/quickjs-ng --(cmake)--> libqjs.a
src/main.c + bundle.c + libqjs.a --> build/wisc
```

`src/qjs_bundle.wisp` defines the JS side of the host contract
(`Wisp.init/compile/evaluate/load-file/read-status/run-program`);
`src/main.c` implements natives, argument dispatch and the REPL loop.

## Notes & limitations

- Building requires node/npm once because wisp is self-hosted; the
  generated `*.js` artifacts stay uncommitted.
- quickjs-ng's tokenizer reads one byte past the buffer passed to
  `JS_Eval`, so the embedded bundle is always evaluated from a
  NUL-terminated copy (see `load_bundle` in `src/main.c`).
- Defs nested inside `(do ...)` blocks land on `exports` rather than
  the global object (same as the original node REPL).
- `print` is a macro expanding to `console.log`, which maps to the
  host `print`.
