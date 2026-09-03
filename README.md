# wisp2

_wisp_ is a [homoiconic][homoiconicity] Lisp dialect that compiles to
readable JavaScript — a small traditional Lisp (parens over brackets,
`defun`/`lambda`/`progn`/`setq`, `&optional`/`&rest`, a `nil`-centric
list model) that runs anywhere JavaScript runs: node, the browser, and
the `wisc` QuickJS binary.

The compiler is written in wisp itself and self-hosts: a prebuilt,
self-hosted copy lives on the orphan `stage-0` branch and seeds every
build, after which the fresh compiler recompiles its own source.

Forked from [wisp][upstream] by @gozala (BSD-3-clause); the surface
syntax has since diverged toward a traditional Lisp — see
[docs/language.md](docs/language.md) for the spec. The original wisp
code is archived on the [`wisp1`][wisp1] branch.

[wisp1]: https://github.com/takeiteasy/wisp2/tree/wisp1

## Build

    git submodule update --init   # vendor/quickjs-ng, for wisc
    npm install                   # browserify, escodegen, base64-encode, commander
    make                          # extract stage-0, compile src/*.wisp -> *.js
    make test                     # recompile round-trip + fixpoint gate + suite

A fresh `git clone` carries every branch, so `./bootstrap/` extracts
offline. If the ref is missing (shallow or single-branch clone):

    git fetch origin stage-0:stage-0

See [docs/bootstrapping.md](docs/bootstrapping.md) for the `stage-0`
workflow, `make bootstrap-check` and `make bootstrap-refresh`.

## wisc — native CLI (QuickJS)

`wisc` is a self-contained wisp REPL/runner binary backed by
[quickjs-ng](https://github.com/quickjs-ng/quickjs) — no node required
at runtime:

    make wisc           # bundle + quickjs + C frontend -> build/wisc
    make wisc-check     # smoke suite

    build/wisc examples/hello.wisp
    build/wisc          # REPL

See [docs/wisc.md](docs/wisc.md) for usage, the host API and `require`
support.

## Compiling a file

Once built, the node CLI compiles `.wisp` to JavaScript:

    node bin/wisp.js -c path/to/in.wisp > out.js

## Documentation

- [docs/language.md](docs/language.md) — the language spec: reader
  grammar, special forms, semantics, naming conventions
- [docs/language-essentials.md](docs/language-essentials.md) — a
  tutorial-style tour of the language
- [docs/bootstrapping.md](docs/bootstrapping.md) — how the compiler
  bootstraps itself from the `stage-0` branch
- [docs/wisc.md](docs/wisc.md) — the native CLI

[examples/](examples/) has small runnable programs
(`build/wisc examples/hello.wisp`).

[homoiconicity]: http://en.wikipedia.org/wiki/Homoiconicity
[upstream]: https://github.com/Gozala/wisp

## License

```
wisp2

Copyright (C) 2025 George Watson

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
```
