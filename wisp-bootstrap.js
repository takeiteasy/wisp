#!/usr/bin/env node
// Stage-0 wisp compiler entry.
//
// This is the checked-in bootstrap compiler for the wisp fork. `master`'s
// Makefile extracts the `stage-0` branch into ./bootstrap/ and runs this
// script as `$(WISP)` to turn src/*.wisp into the root .js files, after
// which the freshly built compiler self-hosts (see `make bootstrap-check`).
//
// Reads wisp source on stdin, writes compiled JavaScript to stdout.
// `--source-uri <uri>` sets the name recorded in the generated source map
// (the Makefile passes `wisp/<path>.wisp`); it matches what the full CLI
// (`src/wisp.wisp`) does, so stage-0 output equals `make recompile` output.
'use strict';

var compiler = require('./compiler');

var argv = process.argv.slice(2);
var options = {};
for (var i = 0; i < argv.length; i++) {
  if (argv[i] === '--source-uri' && i + 1 < argv.length) {
    options['source-uri'] = argv[++i];
  } else if (argv[i] === '--output-uri' && i + 1 < argv.length) {
    options['output-uri'] = argv[++i];
  }
}

var source = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', function (chunk) { source += chunk; });
process.stdin.on('end', function () {
  var output = compiler.compile(source, options);
  process.stdout.write(output && output.code ? output.code : '');
  if (output && output.error) {
    var err = output.error;
    process.stderr.write(String((err && err.stack) || err) + '\n');
    process.exit(1);
  }
});
