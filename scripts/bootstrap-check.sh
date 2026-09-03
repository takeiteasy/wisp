#!/bin/sh
# Self-hosting fixpoint gate.
#
#   stage-0 compiler  compiles src/*.wisp -> A
#   A                 compiles src/*.wisp -> B
#   B                 compiles src/*.wisp -> C
#   assert B == C, byte-for-byte
#
# A != B is expected and fine (the checked-in stage-0 lags src/ until the next
# `make bootstrap-refresh`). B == C is the property that proves src/*.wisp is a
# stable fixpoint under its own compiler.
#
# SEED_ENTRY overrides the stage-A compiler. Until stage-0 is re-seeded with
# the new-syntax compiler, src/*.wisp can only be compiled by the transitional
# hybrid (scripts/build-transitional.sh BASELINE_ONLY=1), so the branch runs:
#
#   SEED_ENTRY=transitional/wisp-bootstrap.js ./scripts/bootstrap-check.sh
#
# The seed entry must sit next to the compiled modules it drives (it does
# `require('./compiler')`); build-transitional.sh drops a copy into
# transitional/ for exactly this use. One fresh `node` process per file on
# purpose: the wisp compiler's gensym counter is process-global and is not
# reset between compile() calls, so compiling several modules in one process
# would drift.
set -eu

REPO=$(cd "$(dirname "$0")/.." && pwd)
cd "$REPO"

BOOTSTRAP_DIR=${BOOTSTRAP_DIR:-bootstrap}
ENTRY=${SEED_ENTRY:-$BOOTSTRAP_DIR/wisp-bootstrap.js}
WORK=build/bootstrap-check

# Full set that the stage-0 branch ships (core + backends + engines + cli + repl).
MODULES="runtime sequence string ast reader expander analyzer compiler repl wisp
engine/node engine/browser
backend/escodegen/generator backend/escodegen/writer backend/javascript/writer"

[ -f "$ENTRY" ] || { echo "missing seed entry $ENTRY (default: make bootstrap/wisp-bootstrap.js, or set SEED_ENTRY)" >&2; exit 1; }

compile_all() {
  # $1 = entry script to run, $2 = output dir
  _entry=$1; _out=$2
  for m in $MODULES; do
    mkdir -p "$_out/$(dirname "$m")"
    node "$_entry" --source-uri "wisp/$m.wisp" < "src/$m.wisp" > "$_out/$m.js"
  done
  cp "$ENTRY" "$_out/wisp-bootstrap.js"
}

rm -rf "$WORK"
mkdir -p "$WORK"

echo "  stage A: stage-0 -> A"
compile_all "$ENTRY" "$WORK/A"

echo "  stage B: A -> B"
compile_all "$WORK/A/wisp-bootstrap.js" "$WORK/B"

echo "  stage C: B -> C"
compile_all "$WORK/B/wisp-bootstrap.js" "$WORK/C"

echo "  comparing B == C"
if diff -r "$WORK/B" "$WORK/C" >/dev/null; then
  echo "bootstrap-check OK (self-hosting fixpoint reached)"
  rm -rf "$WORK"
else
  echo "bootstrap-check FAILED: stage B and stage C differ" >&2
  diff -r "$WORK/B" "$WORK/C" >&2 || true
  exit 1
fi
