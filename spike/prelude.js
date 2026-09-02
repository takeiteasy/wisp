/* the driver evals plain global scripts; wisp codegen targets CJS, so
 * give it a module/exports to write into. */
globalThis.exports = {};
globalThis.module = { exports: globalThis.exports };
