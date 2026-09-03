#!/usr/bin/env bash
# Rebuilds ./transitional/ from scratch (safe to run after `rm -rf
# transitional/` or a fresh clone -- no dependency on any prior
# transitional/ state).
#
# ./transitional/ is the working compiler used to compile-verify every
# file rewritten so far in the new-syntax Phase 3 mechanical port
# (docs/new-syntax.md). It is gitignored -- this script is what makes it
# reproducible instead of a hand-assembled pile of one-off `node -e`
# copies and `cp`s. Run it after: (a) editing any OLD-syntax file below
# that the transitional compiler itself depends on (e.g. the
# writer.wisp butlast/params fix, or the build-defun docstring fix), or
# (b) finishing a NEW-syntax rewrite of one more file, in which case add
# it to NEW_SYNTAX_FILES (in dependency order, with the git ref of its
# last OLD-syntax revision -- see below) first.
#
# Two kinds of src/*.wisp file feed this build:
#
#   OLD_SYNTAX_FILES -- not yet rewritten to new-syntax. Compiled from
#   the CURRENT src/ tree by stage-0's frozen old reader/expander/
#   analyzer via bootstrap/wisp-bootstrap.js, same as `make node` would.
#   This includes reader/expander/analyzer/runtime themselves (Phase
#   1/2's own source, authored in syntax the current reader still
#   accepts) -- the compiled ARTIFACT is syntax-agnostic at runtime,
#   only the compiling reader cares what syntax the source is in, so
#   this is safe.
#
#   NEW_SYNTAX_FILES -- already rewritten to new-syntax by hand this
#   phase. stage-0's old reader cannot parse these at all (`,` is
#   unquote now, `defun`/`let*`/etc don't exist there), so bootstrapping
#   is two-staged per file:
#     1. its LAST OLD-SYNTAX revision (before the Phase 3 rewrite
#        commit touched it -- the git ref recorded alongside it below)
#        is compiled via stage-0, same as an OLD_SYNTAX_FILE, giving a
#        working baseline.
#     2. that baseline is installed, then used to compile the CURRENT
#        (new-syntax) src/<file>.wisp through the transitional CLI,
#        installing the result before moving to the next file in the
#        list (files later in NEW_SYNTAX_FILES may require earlier
#        ones' new-syntax output).
#   Update the recorded ref only if you need to re-derive a stage-1
#   baseline from a different point -- normally you never touch it once
#   a file has crossed over.
#
# BASELINE_ONLY=1 stops after stage 1b, emitting the strict hybrid compiler
# the Phase 4 fixpoint check seeds from: stage-0's compiled compiler.js /
# writers / engines untouched, with only reader / expander / analyzer /
# runtime swapped for their Phase 1/2 builds (see ticket "new-syntax Phase
# 4"). Without it the script runs stage 2 as well, ending at the fully
# new-syntax-compiled transitional/ used for per-file compile verification
# during Phase 3.
#
# set -e: any compile error aborts the rebuild rather than silently
# leaving a stale or half-updated transitional/ in place.
set -euo pipefail

cd "$(dirname "$0")/.."

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

rm -rf transitional
mkdir -p transitional/backend/escodegen transitional/backend/javascript transitional/engine transitional/bin
cp bin/wisp.js transitional/bin/wisp.js

# The stdin-driven entry shim from the stage-0 payload, dropped at the root of
# transitional/ next to the compiled modules. With it, transitional/ doubles as
# a bootstrap-check seed: node transitional/wisp-bootstrap.js (see
# scripts/bootstrap-check.sh SEED_ENTRY).
git show stage-0:wisp-bootstrap.js > transitional/wisp-bootstrap.js

# path relative to src/, without .wisp extension
OLD_SYNTAX_FILES=(
)

# path:git-ref -- git-ref is the last commit where src/<path>.wisp was
# still old-syntax (i.e. the parent of the commit that rewrote it).
NEW_SYNTAX_FILES=(
  "reader:fde4259"
  "expander:2d8afd9"
  "analyzer:cb41919"
  "sequence:cb41919"
  "runtime:cb41919"
  "string:cb41919"
  "ast:13c6510"
  "compiler:cb41919"
  "wisp:0463019"
  "backend/javascript/writer:c8d86d6"
  "repl:d21a199"
  "engine/node:57c1c59"
  "engine/browser:57c1c59"
  "engine/browserExport:57c1c59"
  "backend/escodegen/writer:8cabb0f"
  "backend/escodegen/generator:7b9d051"
  "qjs_bundle:52b2004"
)

echo "== stage 0: old-syntax files, current src/, via stage-0 =="
for f in "${OLD_SYNTAX_FILES[@]+"${OLD_SYNTAX_FILES[@]}"}"; do
  echo "  $f.wisp"
  mkdir -p "transitional/$(dirname "$f")"
  node bootstrap/wisp-bootstrap.js --source-uri "wisp/$f.wisp" \
    < "src/$f.wisp" > "transitional/$f.js"
done

cp package.json transitional/package.json

echo "== stage 1: new-syntax files' pre-rewrite revisions, via stage-0 (bootstrap baseline) =="
for entry in "${NEW_SYNTAX_FILES[@]}"; do
  f="${entry%%:*}"; ref="${entry##*:}"
  echo "  $f.wisp @ $ref"
  mkdir -p "transitional/$(dirname "$f")"
  git show "$ref:src/$f.wisp" \
    | node bootstrap/wisp-bootstrap.js --source-uri "wisp/$f.wisp" \
    > "transitional/$f.js"
done

echo "== stage 1b: chicken-and-egg patch on the bootstrap baseline =="
# withMeta (wisp.ast) needs a nil guard so reading `()` -- which every
# zero-arg (lambda ()) now parses to per the Phase 2 nil singleton --
# doesn't crash Object.defineProperty. That fix lives in the CURRENT
# (new-syntax) src/ast.wisp, compiled in stage 2 below -- but stage 2
# can't run until something can read new-syntax source through this
# very code path, so the stage-1 baseline needs the same guard patched
# in directly as JS before it can be used as a compiler. Once ast.wisp
# is fully self-hosting under new-syntax (Phase 4), this patch step
# goes away -- the fix will already be in whatever compiled it.
python3 - "transitional/ast.js" <<'PYEOF'
import re, sys
path = sys.argv[1]
with open(path) as f:
    src = f.read()
needle = "function withMeta(value, metadata) {\n"
guard = "    if (value === void 0 || value === null) {\n        return value;\n    }\n"
if guard not in src:
    if needle not in src:
        sys.exit("withMeta signature not found in " + path)
    src = src.replace(needle, needle + guard, 1)
    with open(path, "w") as f:
        f.write(src)
PYEOF

echo "== stage 2: new-syntax files, current src/, via the transitional compiler (dependency order) =="
if [ "${BASELINE_ONLY:-0}" = "1" ]; then
  echo "BASELINE_ONLY=1 -- stopping after stage 1b (strict hybrid seed)."
  echo "transitional/ rebuilt at the stage-1b baseline."
  exit 0
fi
for entry in "${NEW_SYNTAX_FILES[@]}"; do
  f="${entry%%:*}"
  echo "  $f.wisp"
  mkdir -p "$TMP/$(dirname "$f")"
  node transitional/bin/wisp.js -c "src/$f.wisp" --source-uri "wisp/$f.wisp" \
    > "$TMP/$f.js"
  mkdir -p "transitional/$(dirname "$f")"
  cp "$TMP/$f.js" "transitional/$f.js"
done

echo "transitional/ rebuilt clean."
