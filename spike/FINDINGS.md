# Editor-on-cordis / quickjs-wasm / Clay — feasibility notes

> **Spike outcome (branch `spike/cordis-quickjs`, see `README.md`):** cordis boots
> and runs its full service-DI + effect + dispose lifecycle on the native
> `libqjs.a` quickjs-ng, driven by a ~110-line `driver.c`. wisp-compiled modules
> both **consume** and **provide** cordis services. One interop gotcha found:
> `wisc -c` emits named `function`s whose `.prototype` makes cordis's
> `isConstructor()` run `new plugin()`, dropping *returned* disposers — use
> `ctx.effect()` for teardown (details in `README.md`).
> Still unproven: emscripten/wasm build, Clay.

## The core "if": can cordis run on quickjs?

**Answer: yes (verified).** Evidence from the shipped `@deepseek-ai/cordis@4.0.2` tarball:

- `lib/index.js` is 1828 lines, `"type": "module"`, `"sideEffects": false`.
- Its **only** import is `@deepseek-ai/cosmokit`. No `node:` imports, no `require(`, no
  `process.`, no `AsyncLocalStorage`, no `worker_threads`, no `__dirname`, no dynamic `import()`.
- `@deepseek-ai/cosmokit@1.8.3` is 325 lines of pure ECMAScript. Uses `globalThis`,
  `ArrayBuffer`, `Object`, and a `typeof Buffer !== "undefined"`-guarded base64/hex path
  (not on the cordis core path). No node, no DOM.
- `@standard-schema/spec` is types-only, zero runtime.
- `bin.js` / the loader / include / HMR plugins DO need node — but they are optional
  peer deps, not the core.

### JS features cordis core uses (all supported by quickjs-ng v0.16.2)

`new Proxy`, `Reflect.{get,set,has,apply,construct,ownKeys,getOwnPropertyDescriptor}`,
`WeakMap`, `WeakRef`, `Symbol.{for,iterator,asyncIterator,hasInstance,toPrimitive}`,
`async`/`await`, `Promise.{all,allSettled,resolve}`, class `static {}` init blocks,
private fields/methods.

quickjs-ng supports all of these natively. Optionally down-level `static {}` / private
methods with esbuild `--target=es2022` if any parse issue shows up.

## The other pipeline links (already proven by third parties, not yet by us)

| Link | Status | Notes |
|---|---|---|
| quickjs-ng → wasm | proven elsewhere | quickjs-emscripten etc.; this repo currently builds a **native** `wisc`, not wasm — a new emscripten build path is needed |
| Clay → wasm | proven | ~15kb .wasm, single-header C, zero deps, renderer-agnostic |
| Clay rendering | needs glue | emits `Clay_RenderCommandArray`; you supply a renderer (canvas2d/WebGL from JS, or Clay's HTML renderer) + a text-measure callback |
| Clay editing widgets | **none** | Clay is layout only. No text buffer, cursor, selection, IME, input handling — you build all of it |
| wisp module ↔ cordis plugin | **proven** (this spike) | consume + provide + teardown all work; `isConstructor` gotcha, see `README.md` |
| async job pump | **missing in repo — pre-existing wisc bug** | `src/main.c` never calls `JS_ExecutePendingJob`; any async wisp under `wisc` never settles today. cordis needs the ~10-line drain loop (shown in `driver.c`). Filed on the tracker. |

## Architecture note

cordis = async-lifecycle dependency injection (startup wiring, service graph, teardown).
Clay = synchronous layout pass per frame. Use cordis for boot/wiring/services; keep the
per-frame loop out of cordis's async event dispatch. Don't design toward per-frame `await`.

## Proposed spike (cheapest disproof order)

0. [done] inspect cordis/cosmokit source — pure ESM ✅
1. add `JS_ExecutePendingJob` drain loop to `src/main.c` (or a spike copy)
2. esbuild-bundle cordis `--format=iife --global-name=Cordis --target=es2022`, eval in
   `wisc`, run a 2-plugin toy: plugin A provides a service, plugin B injects it, then
   dispose and assert cleanup fired
3. write one of those two plugins in **wisp** to prove wisp↔cordis interop
4. independently: does quickjs-ng build under emscripten from this repo, and does
   `clay.h` link into the same wasm module

Steps 1–3 run against the existing **native** `wisc` (fast, already built). A green
native result does NOT by itself prove the wasm path — step 4 is separate.
