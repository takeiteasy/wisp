# Bootstrapping

The wisp compiler is written in wisp (`src/*.wisp`). Building it therefore
needs a wisp compiler already in hand. This fork keeps that seed **in the
repo itself**, on a dedicated branch — there is no `wisp` npm package.

## The `stage-0` branch

`stage-0` is an orphan branch (no shared history with `master`) holding only
the prebuilt, self-hosted JavaScript output of `src/*.wisp`:

```
wisp-bootstrap.js                 entry: reads wisp on stdin, writes JS on stdout
package.json                      name/version stub
bin/wisp.js                       full CLI shim (force-added past the global bin/ ignore)
runtime.js sequence.js string.js ast.js reader.js expander.js analyzer.js compiler.js
repl.js wisp.js
engine/node.js  engine/browser.js
backend/escodegen/{generator,writer}.js
backend/javascript/writer.js
```

Every `.js` there is the output of the repo's own compiler compiling `src/`,
one fresh `node` process per file (the compiler's `gensym` counter is
process-global and is not reset between `compile()` calls, so batching drifts),
with `--source-uri wisp/<path>.wisp` threaded so the inline source maps carry
real names and match `make recompile` byte-for-byte.

## How `master` uses it

`make` runs the `$(BOOTSTRAP_ENTRY)` rule, which does:

```
git archive stage-0 | tar -x -C bootstrap/
```

`bootstrap/` is a build artifact (gitignored). `$(WISP)` is then
`node bootstrap/wisp-bootstrap.js`, used by the `%.js` pattern rule to compile
`src/*.wisp` into the root `.js` files. `make recompile` re-compiles them with
the freshly built compiler (`node bin/wisp.js`).

`escodegen` and `base64-encode` (npm deps) are required by `compiler.js` at
runtime whether it runs from `bootstrap/` or from `master`'s own build; they
resolve from `master`'s `node_modules/`.

A normal `git clone` from sr.ht fetches every branch, so extraction works
offline. For a shallow or single-branch clone:

```
git fetch origin stage-0:stage-0
```

## `make bootstrap-check`

The self-hosting fixpoint gate (part of `make test`):

```
stage-0 compiler  compiles src/*.wisp -> A
A                 compiles src/*.wisp -> B
B                 compiles src/*.wisp -> C
assert B == C     byte-for-byte
```

`A != B` is expected and fine — the checked-in `stage-0` lags `src/` until the
next refresh. `B == C` is the property that proves `src/*.wisp` is a stable
fixpoint under its own compiler. Implemented in `scripts/bootstrap-check.sh`.

`SEED_ENTRY=<path>` overrides the stage-A compiler. The seed entry must sit
next to the compiled modules it drives (it does `require('./compiler')`). The
default is `bootstrap/wisp-bootstrap.js`.

## The transitional compiler (`./transitional/`)

`scripts/build-transitional.sh` builds `./transitional/`
(gitignored, reproducible from scratch): the stage-0 payload with only
`reader` / `expander` / `analyzer` / `runtime` swapped for their Phase 1/2
builds, plus a `withMeta` nil guard patched into the baseline `ast.js`.
It exists to re-derive the bootstrap lineage of the `stage-0` seed from
scratch — see the file header for the two-stage seeding procedure it
reproduces.

- `BASELINE_ONLY=1` stops there, emitting the strict hybrid:
  ```
  BASELINE_ONLY=1 ./scripts/build-transitional.sh
  SEED_ENTRY=transitional/wisp-bootstrap.js ./scripts/bootstrap-check.sh
  ```
- Without it, the script additionally recompiles every module from the current
  `src/` through the transitional compiler itself, ending at a fully
  transitional-compiled compiler.

The build drops a `wisp-bootstrap.js` copy at `transitional/`'s root so the
directory doubles as a `SEED_ENTRY` seed.

## `make bootstrap-refresh`

Rebuilds the `stage-0` payload from the current `src/` and updates the **local**
`stage-0` branch (it does not push). Run it after landing changes to the
compiler or codegen so the checked-in seed tracks `src/` again:

```
make bootstrap-refresh
git push origin stage-0
make bootstrap-clean && make      # re-extract the local working copy
```

Implemented in `scripts/refresh-stage-0.sh`. `SEED_ENTRY=<path>` compiles the
payload from an arbitrary compiler entry instead of the freshly built root
`./compiler.js` — for when the checked-in `stage-0` cannot read the current
`src/` grammar at all and the payload must be compiled through an
intermediate:

```
SEED_ENTRY=transitional/wisp-bootstrap.js ./scripts/refresh-stage-0.sh
```

## Other targets

- `make bootstrap-clean` — remove `bootstrap/`; the next `make` re-extracts it.
- `BOOTSTRAP_REF=<ref> make …` — extract from a ref other than `stage-0`
  (e.g. to test a candidate seed).
