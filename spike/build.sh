#!/bin/sh
# Reproduce the cordis-on-quickjs + wisp-interop spike.
#
#   ./build.sh          build everything and run the spike
#
# Prereqs already present in this repo:
#   - build/wisc            (make wisc)
#   - vendor/quickjs-ng/build/libqjs.a   (cmake target qjs)
#   - node + npx (esbuild fetched on demand)
set -e
here=$(cd "$(dirname "$0")" && pwd)
repo=$(cd "$here/.." && pwd)
cd "$here"

echo "==> install cordis"
npm install --silent

echo "==> bundle cordis -> IIFE global 'Cordis' (esbuild, es2022)"
npx esbuild entry.js --bundle --format=iife --global-name=Cordis \
  --target=es2022 --platform=neutral --outfile=cordis.bundle.js

echo "==> compile wisp plugins -> JS via wisc -c"
"$repo/build/wisc" -c - < plugin-b.wisp > plugin-b.compiled.js
"$repo/build/wisc" -c - < plugin-e.wisp > plugin-e.compiled.js
"$repo/build/wisc" -c - < plugin-provider.wisp > plugin-provider.compiled.js

echo "==> build the bare quickjs driver"
cc -O2 -Wall -std=c11 -I"$repo/vendor/quickjs-ng" \
  driver.c "$repo/vendor/quickjs-ng/build/libqjs.a" -lm -o driver

echo "==> run: service DI + wisp plugin + disposer (arrow-wrap fix)"
./driver cordis.bundle.js prelude.js plugin-a.js plugin-b.compiled.js run.js

echo "==> run: wisp plugin using ctx.effect (no wrap needed)"
./driver cordis.bundle.js prelude.js plugin-e.compiled.js run-effect.js

echo "==> run: wisp plugin PROVIDING a service via ctx.provide"
./driver cordis.bundle.js prelude.js plugin-provider.compiled.js run-provider.js

echo "==> run: isConstructor finding (arrow passes, plain function fails)"
./driver cordis.bundle.js probe-isconstructor.js
