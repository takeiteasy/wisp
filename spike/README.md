# spike: cordis on quickjs-ng + wisp interop

Throwaway spike (branch `spike/cordis-quickjs`) answering two of the "ifs" for a
modular text editor built on `@deepseek-ai/cordis`, targeting quickjs/wasm, with
Clay for UI:

1. **Can cordis core run on quickjs-ng?** — the same quickjs-ng this repo already
   links for `wisc`.
2. **Can a wisp-compiled module act as a cordis plugin?**

Run `./build.sh` from this directory. Requires `build/wisc` and
`vendor/quickjs-ng/build/libqjs.a` already built in the repo.

## Result: YES to both, with one interop gotcha

### 1. cordis core is pure ESM ECMAScript and runs unmodified

- `@deepseek-ai/cordis@4.0.2` `lib/index.js` (1828 lines) imports **only**
  `@deepseek-ai/cosmokit` (325 lines, pure ES). No `node:`, `require(`,
  `process`, `worker_threads`, `AsyncLocalStorage`. `@standard-schema/spec` is
  types-only.
- Features used — `Proxy`, `Reflect.*`, `WeakMap`, `WeakRef`, `Symbol.async­Iterator`,
  `async`/`await`, `Promise.allSettled`, class `static {}` blocks, private
  fields — are all supported by quickjs-ng v0.16.2.
- `esbuild --bundle --format=iife --global-name=Cordis --target=es2022` produces a
  ~69 kb bundle that evaluates cleanly under `JS_EVAL_TYPE_GLOBAL`.
- **The host must pump the job queue.** `src/main.c` (`wisc`) never calls
  `JS_ExecutePendingJob`; cordis's lifecycle is `await`-based and silently
  no-ops without a drain loop. `driver.c` here shows the ~10-line fix.

Verified live: `new Context()`, `ctx.plugin(Service)`, service DI via `inject`,
`ctx.effect()`, and `fiber.dispose()` teardown all work.

### 2. wisp modules work as cordis plugins — mind `isConstructor`

Verified end to end from wisp:

- **consume** a service — `(.hello (.-greeter ctx) ...)` with `plugin.inject = ['greeter']`
- **provide** a service — `(.provide ctx "counter" {:next (fn [] ...)})`, no
  `class extends Service` needed; unregistered automatically on fiber unload
  (`plugin-provider.wisp` + `run-provider.js`)
- **clean up** — via `ctx.effect` or a returned disposer (with the caveat below)

**The gotcha.** `wisc -c` compiles a wisp `defn` to a **named `function`
expression**, which has a `.prototype`. cordis's `isConstructor()`
(`return !!func.prototype` modulo generators) therefore classifies **every wisp
plugin as a class** and runs `new plugin(ctx, config)`. The constructor branch
**ignores the return value**, so a wisp plugin that *returns* a disposer loses
its teardown. The body still runs (services are provided, effects registered);
only a returned disposer is dropped — a quiet leak, not a loud error.

`probe-isconstructor.js` demonstrates: arrow plugin → disposer runs; plain
`function` plugin (arrow *or* function disposer) → disposer dropped.

**Preferred fix — use `ctx.effect()` for cleanup.** `effect()` registers its
disposer on the fiber itself, so it survives the `new` path untouched, and the
plugin keeps its real identity (registry keying, `name`, `Config` schema
validation, `provide`/`intercept` metadata all intact). See `plugin-e.wisp` +
`run-effect.js`. Provider plugins get this for free — `ctx.provide()` registers
its own fiber cleanup.

**Escape hatch — arrow-wrap at the boundary**, only for a plugin that must
*return* a disposer: `const w = (ctx, cfg) => wispPlugin(ctx, cfg); w.inject = wispPlugin.inject;`
then `ctx.plugin(w)` (see `run.js`). Costs: the wrapper copies **only** `inject`
— `name`, `Config`, `provide`, `intercept` are silently lost (no schema
validation) — and a fresh arrow per load is a new registry identity, so
`registry.has(wispPlugin)` / `.delete()` miss and repeated loads become separate
runtimes instead of fibers of one.

Not fixes: `{ apply: fn }` object plugins still resolve to the same function and
hit `isConstructor`; `delete fn.prototype` fails silently (`prototype` is
non-configurable on normal functions).

For the real project, a wisp `defplugin` macro that emits an arrow **and**
forwards the full metadata bag would hide this at the source level — or just
standardise on `ctx.effect` for teardown.

## Files

| File | Role |
| --- | --- |
| `driver.c` | bare quickjs-ng host: evals JS files in order, drains the job queue after each |
| `entry.js` | esbuild entrypoint re-exporting `Context`, `Service` |
| `prelude.js` | **spike scaffold, not a design**: a global `module`/`exports` so wisp's CJS codegen has somewhere to write. Works only because the driver evals one wisp module at a time and `run*.js` reads `module.exports` immediately after. Real integration goes through wisc's own require/resolver — do not carry this shim forward. |
| `plugin-a.js` | hand-written JS `greeter` service (class `extends Service`) |
| `plugin-b.wisp` | wisp plugin: injects `greeter`, returns a disposer |
| `plugin-e.wisp` | wisp plugin: cleanup via `ctx.effect` |
| `plugin-provider.wisp` | wisp plugin: *provides* a `counter` service via `ctx.provide` |
| `run.js` | headline test — service DI + wisp plugin + disposer (arrow-wrap) |
| `run-effect.js` | `ctx.effect` teardown through the constructor path |
| `run-provider.js` | wisp-provided service consumed + torn down |
| `probe-isconstructor.js` | isolates the arrow-vs-function plugin behaviour |

## Not covered by this spike

- quickjs-ng under **emscripten/wasm** (this spike is the native `libqjs.a`).
- **Clay** → wasm and linking `clay.h` into the same module.
- Editor primitives (text buffer, cursor, selection, input) — Clay has none.
- cordis loader / HMR / config-file plugins (node-only; not needed for an
  embedded host).
