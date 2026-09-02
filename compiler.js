{
    var _ns_ = {
            id: 'wisp.compiler',
            doc: void 0
        };
    var wisp_analyzer = require('./analyzer');
    var analyze = wisp_analyzer.analyze;
    var wisp_reader = require('./reader');
    var read_ = wisp_reader.read_;
    var read = wisp_reader.read;
    var pushBackReader = wisp_reader.pushBackReader;
    var wisp_string = require('./string');
    var replace = wisp_string.replace;
    var wisp_sequence = require('./sequence');
    var map = wisp_sequence.map;
    var reduce = wisp_sequence.reduce;
    var conj = wisp_sequence.conj;
    var cons = wisp_sequence.cons;
    var vec = wisp_sequence.vec;
    var first = wisp_sequence.first;
    var rest = wisp_sequence.rest;
    var isEmpty = wisp_sequence.isEmpty;
    var count = wisp_sequence.count;
    var wisp_runtime = require('./runtime');
    var isError = wisp_runtime.isError;
    var isEqual = wisp_runtime.isEqual;
    var wisp_ast = require('./ast');
    var name = wisp_ast.name;
    var symbol = wisp_ast.symbol;
    var prStr = wisp_ast.prStr;
    var wisp_backend_escodegen_generator = require('./backend/escodegen/generator');
    var generateJs = wisp_backend_escodegen_generator.generate;
    var base64Encode = require('base64-encode');
    var btoa = base64Encode;
}
var generate = exports.generate = generateJs;
var readForm = exports.readForm = function readForm(reader, eof) {
        return (function () {
            try {
                return read(reader, false, eof, false);
            } catch (error) {
                return error;
            }
        })();
    };
var readForms = exports.readForms = function readForms(source, uri) {
        return function () {
            var readerø1 = pushBackReader(source, uri);
            var eofø1 = {};
            return function loop() {
                var recur = loop;
                var formsø1 = [];
                var formø1 = readForm(readerø1, eofø1);
                do {
                    recur = isError(formø1) ? {
                        'forms': formsø1,
                        'error': formø1
                    } : formø1 === eofø1 ? { 'forms': formsø1 } : 'else' ? (loop[0] = conj(formsø1, formø1), loop[1] = readForm(readerø1, eofø1), loop) : void 0;
                } while (formsø1 = loop[0], formø1 = loop[1], recur === loop);
                return recur;
            }.call(this);
        }.call(this);
    };
var analyzeForm = exports.analyzeForm = function analyzeForm(env, form) {
        return (function () {
            try {
                return analyze(env, form);
            } catch (error) {
                return error;
            }
        })();
    };
var analyzeForms = exports.analyzeForms = function analyzeForms(forms) {
        return function loop() {
            var recur = loop;
            var nodesø1 = [];
            var formsø2 = forms;
            var envø1 = {
                    'locals': {},
                    'bindings': [],
                    'top': true,
                    'ns': { 'name': symbol(void 0, 'user.wisp') }
                };
            do {
                recur = function () {
                    var nodeø1 = analyzeForm(envø1, first(formsø2));
                    var nsø1 = isEqual((nodeø1 || 0)['op'], 'ns') ? nodeø1 : (envø1 || 0)['ns'];
                    return isError(nodeø1) ? {
                        'ast': nodesø1,
                        'error': nodeø1
                    } : count(formsø2) <= 1 ? { 'ast': conj(nodesø1, nodeø1) } : 'else' ? (loop[0] = conj(nodesø1, nodeø1), loop[1] = rest(formsø2), loop[2] = conj(envø1, { 'ns': nsø1 }), loop) : void 0;
                }.call(this);
            } while (nodesø1 = loop[0], formsø2 = loop[1], envø1 = loop[2], recur === loop);
            return recur;
        }.call(this);
    };
var compile = exports.compile = function compile() {
        switch (arguments.length) {
        case 1:
            var source = arguments[0];
            return compile(source, {});
        case 2:
            var source = arguments[0];
            var options = arguments[1];
            return function () {
                var sourceUriø1 = (options || 0)['source-uri'] || name('anonymous.wisp');
                var formsø1 = readForms(source, sourceUriø1);
                var astø1 = (formsø1 || 0)['error'] ? formsø1 : analyzeForms((formsø1 || 0)['forms']);
                var outputø1 = (astø1 || 0)['error'] ? astø1 : (function () {
                        try {
                            return generate.apply(void 0, vec(cons(conj(options, {
                                'source': source,
                                'source-uri': sourceUriø1
                            }), (astø1 || 0)['ast'])));
                        } catch (error) {
                            return { 'error': error };
                        }
                    })();
                var expansionø1 = 'expansion' === (options || 0)['print'] ? reduce(function (result, item) {
                        return '' + result + prStr(item.form) + '\n';
                    }, '', astø1.ast) : void 0;
                var resultø1 = {
                        'source-uri': sourceUriø1,
                        'ast': (astø1 || 0)['ast'],
                        'forms': (formsø1 || 0)['forms'],
                        'expansion': expansionø1
                    };
                return conj(options, outputø1, resultø1);
            }.call(this);
        default:
            throw RangeError('Wrong number of arguments passed');
        }
    };
var evaluate = exports.evaluate = function evaluate(source) {
        return function () {
            var outputø1 = compile(source);
            return (outputø1 || 0)['error'] ? (function () {
                throw (outputø1 || 0)['error'];
            })() : eval((outputø1 || 0)['code']);
        }.call(this);
    };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndpc3AvY29tcGlsZXIud2lzcCJdLCJuYW1lcyI6WyJfbnNfIiwiaWQiLCJkb2MiLCJhbmFseXplIiwicmVhZF8iLCJyZWFkIiwicHVzaEJhY2tSZWFkZXIiLCJyZXBsYWNlIiwibWFwIiwicmVkdWNlIiwiY29uaiIsImNvbnMiLCJ2ZWMiLCJmaXJzdCIsInJlc3QiLCJpc0VtcHR5IiwiY291bnQiLCJpc0Vycm9yIiwiaXNFcXVhbCIsIm5hbWUiLCJzeW1ib2wiLCJwclN0ciIsImdlbmVyYXRlSnMiLCJnZW5lcmF0ZSIsImV4cG9ydHMiLCJyZWFkRm9ybSIsInJlYWRlciIsImVvZiIsImVycm9yIiwicmVhZEZvcm1zIiwic291cmNlIiwidXJpIiwicmVhZGVyw7gxIiwiZW9mw7gxIiwiZm9ybXPDuDEiLCJmb3Jtw7gxIiwiYW5hbHl6ZUZvcm0iLCJlbnYiLCJmb3JtIiwiYW5hbHl6ZUZvcm1zIiwiZm9ybXMiLCJub2Rlc8O4MSIsImZvcm1zw7gyIiwiZW52w7gxIiwibm9kZcO4MSIsIm5zw7gxIiwiY29tcGlsZSIsIm9wdGlvbnMiLCJzb3VyY2VVcmnDuDEiLCJhc3TDuDEiLCJvdXRwdXTDuDEiLCJleHBhbnNpb27DuDEiLCJyZXN1bHQiLCJpdGVtIiwiYXN0IiwicmVzdWx0w7gxIiwiZXZhbHVhdGUiLCJldmFsIl0sIm1hcHBpbmdzIjoiO0lBQUEsSUFBQ0EsSSxHQUFEO0FBQUEsWUFBQUMsRSxFQUFJLGVBQUo7QUFBQSxZQUFBQyxHLEVBQUEsSyxDQUFBO0FBQUEsVTs7UUFDbUNDLE9BQUEsRyxjQUFBQSxPOztRQUNGQyxLQUFBLEcsWUFBQUEsSztRQUFNQyxJQUFBLEcsWUFBQUEsSTtRQUFLQyxjQUFBLEcsWUFBQUEsYzs7UUFDWEMsT0FBQSxHLFlBQUFBLE87O1FBQ0VDLEdBQUEsRyxjQUFBQSxHO1FBQUlDLE1BQUEsRyxjQUFBQSxNO1FBQU9DLElBQUEsRyxjQUFBQSxJO1FBQUtDLElBQUEsRyxjQUFBQSxJO1FBQUtDLEdBQUEsRyxjQUFBQSxHO1FB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QWFQLFEsTUFBUCxDLE1BQUEsQ0FBTixDQUZGLENBREk7QUFBQSxTLEtBQU4sQyxJQUFBO0FBQUEsS0FGRiIsInNvdXJjZXNDb250ZW50IjpbIihucyB3aXNwLmNvbXBpbGVyXG4gICg6cmVxdWlyZSBbd2lzcC5hbmFseXplciA6cmVmZXIgW2FuYWx5emVdXVxuICAgICAgICAgICAgW3dpc3AucmVhZGVyIDpyZWZlciBbcmVhZCogcmVhZCBwdXNoLWJhY2stcmVhZGVyXV1cbiAgICAgICAgICAgIFt3aXNwLnN0cmluZyA6cmVmZXIgW3JlcGxhY2VdXVxuICAgICAgICAgICAgW3dpc3Auc2VxdWVuY2UgOnJlZmVyIFttYXAgcmVkdWNlIGNvbmogY29ucyB2ZWMgZmlyc3QgcmVzdCBlbXB0eT8gY291bnRdXVxuICAgICAgICAgICAgW3dpc3AucnVudGltZSA6cmVmZXIgW2Vycm9yPyA9XV1cbiAgICAgICAgICAgIFt3aXNwLmFzdCA6cmVmZXIgW25hbWUgc3ltYm9sIHByLXN0cl1dXG5cbiAgICAgICAgICAgIFt3aXNwLmJhY2tlbmQuZXNjb2RlZ2VuLmdlbmVyYXRvciA6cmVmZXIgW2dlbmVyYXRlXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpyZW5hbWUge2dlbmVyYXRlIGdlbmVyYXRlLWpzfV1cbiAgICAgICAgICAgIFtiYXNlNjQtZW5jb2RlIDphcyBidG9hXSkpXG5cbihkZWYgZ2VuZXJhdGUgZ2VuZXJhdGUtanMpXG5cbihkZWZuIHJlYWQtZm9ybVxuICBbcmVhZGVyIGVvZl1cbiAgKHRyeSAocmVhZCByZWFkZXIgZmFsc2UgZW9mIGZhbHNlKVxuICAgIChjYXRjaCBlcnJvciBlcnJvcikpKVxuXG4oZGVmbiByZWFkLWZvcm1zXG4gIFtzb3VyY2UgdXJpXVxuICAobGV0IFtyZWFkZXIgKHB1c2gtYmFjay1yZWFkZXIgc291cmNlIHVyaSlcbiAgICAgICAgZW9mIHt9XVxuICAgIChsb29wIFtmb3JtcyBbXVxuICAgICAgICAgICBmb3JtIChyZWFkLWZvcm0gcmVhZGVyIGVvZildXG4gICAgICAoY29uZCAoZXJyb3I/IGZvcm0pIHs6Zm9ybXMgZm9ybXMgOmVycm9yIGZvcm19XG4gICAgICAgICAgICAoaWRlbnRpY2FsPyBmb3JtIGVvZikgezpmb3JtcyBmb3Jtc31cbiAgICAgICAgICAgIDplbHNlIChyZWN1ciAoY29uaiBmb3JtcyBmb3JtKVxuICAgICAgICAgICAgICAgICAgICAgICAgIChyZWFkLWZvcm0gcmVhZGVyIGVvZikpKSkpKVxuXG4oZGVmbiBhbmFseXplLWZvcm1cbiAgW2VudiBmb3JtXVxuICAodHJ5IChhbmFseXplIGVudiBmb3JtKSAoY2F0Y2ggZXJyb3IgZXJyb3IpKSlcblxuKGRlZm4gYW5hbHl6ZS1mb3Jtc1xuICBbZm9ybXNdXG4gIChsb29wIFtub2RlcyBbXVxuICAgICAgICAgZm9ybXMgZm9ybXNcbiAgICAgICAgIGVudiB7OmxvY2FscyB7fVxuICAgICAgICAgICAgICA6YmluZGluZ3MgW11cbiAgICAgICAgICAgICAgOnRvcCB0cnVlXG4gICAgICAgICAgICAgIDpucyB7Om5hbWUgJ3VzZXIud2lzcH19XVxuICAgIChsZXQgW25vZGUgKGFuYWx5emUtZm9ybSBlbnYgKGZpcnN0IGZvcm1zKSlcbiAgICAgICAgICBucyAoaWYgKD0gKDpvcCBub2RlKSA6bnMpXG4gICAgICAgICAgICAgICBub2RlXG4gICAgICAgICAgICAgICAoOm5zIGVudikpXVxuICAgICAgKGNvbmQgKGVycm9yPyBub2RlKSB7OmFzdCBub2RlcyA6ZXJyb3Igbm9kZX1cbiAgICAgICAgICAgICg8PSAoY291bnQgZm9ybXMpIDEpIHs6YXN0IChjb25qIG5vZGVzIG5vZGUpfVxuICAgICAgICAgICAgOmVsc2UgKHJlY3VyIChjb25qIG5vZGVzIG5vZGUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgKHJlc3QgZm9ybXMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgKGNvbmogZW52IHs6bnMgbnN9KSkpKSkpXG5cbihkZWZuIGNvbXBpbGVcbiAgXCJDb21waWxlciB0YWtlcyB3aXNwIGNvZGUgaW4gZm9ybSBvZiBzdHJpbmcgYW5kIHJldHVybnMgYSBoYXNoXG4gIGNvbnRhaW5pbmcgYDpzb3VyY2VgIHJlcHJlc2VudGluZyBjb21waWxhdGlvbiByZXN1bHQuIElmXG4gIGAoOnNvdXJjZS1tYXAgb3B0aW9ucylgIGlzIGB0cnVlYCB0aGVuIGA6c291cmNlLW1hcGAgb2YgdGhlIHJldHVybmVkXG4gIGhhc2ggd2lsbCBjb250YWluIHNvdXJjZSBtYXAgZm9yIGl0LlxuICA6b3V0cHV0LXVyaVxuICA6c291cmNlLW1hcC11cmlcblxuICBSZXR1cm5zIGhhc2ggd2l0aCBmb2xsb3dpbmcgZmllbGRzOlxuXG4gIDpjb2RlIC0gR2VuZXJhdGVkIGNvZGUuXG5cbiAgOnNvdXJjZS1tYXAgLSBHZW5lcmF0ZWQgc291cmNlIG1hcC4gT25seSBpZiAoOnNvdXJjZS1tYXAgb3B0aW9ucylcbiAgICAgICAgICAgICAgICB3YXMgdHJ1ZS5cblxuICA6b3V0cHV0LXVyaSAtIFJldHVybnMgYmFjayAoOm91dHB1dC11cmkgb3B0aW9ucykgaWYgd2FzIHBhc3NlZCBpbixcbiAgICAgICAgICAgICAgICBvdGhlcndpc2UgY29tcHV0ZXMgb25lIGZyb20gKDpzb3VyY2UtdXJpIG9wdGlvbnMpIGJ5XG4gICAgICAgICAgICAgICAgY2hhbmdpbmcgZmlsZSBleHRlbnNpb24uXG5cbiAgOnNvdXJjZS1tYXAtdXJpIC0gUmV0dXJucyBiYWNrICg6c291cmNlLW1hcC11cmkgb3B0aW9ucykgaWYgd2FzIHBhc3NlZFxuICAgICAgICAgICAgICAgICAgICBpbiwgb3RoZXJ3aXNlIGNvbXB1dGVzIG9uZSBmcm9tICg6c291cmNlLXVyaSBvcHRpb25zKVxuICAgICAgICAgICAgICAgICAgICBieSBhZGRpbmcgYC5tYXBgIGZpbGUgZXh0ZW5zaW9uLlwiXG4gIChbc291cmNlXSAoY29tcGlsZSBzb3VyY2Uge30pKVxuICAoW3NvdXJjZSBvcHRpb25zXVxuICAgKGxldCBbc291cmNlLXVyaSAob3IgKDpzb3VyY2UtdXJpIG9wdGlvbnMpIChuYW1lIDphbm9ueW1vdXMud2lzcCkpIDs7IEhBQ0s6IFdvcmthcm91bmQgZm9yIHNlZ2ZhdWx0ICM2NjkxXG4gICAgICAgICBmb3JtcyAocmVhZC1mb3JtcyBzb3VyY2Ugc291cmNlLXVyaSlcblxuICAgICAgICAgYXN0IChpZiAoOmVycm9yIGZvcm1zKVxuICAgICAgICAgICAgICAgZm9ybXNcbiAgICAgICAgICAgICAgIChhbmFseXplLWZvcm1zICg6Zm9ybXMgZm9ybXMpKSlcblxuICAgICAgICAgb3V0cHV0IChpZiAoOmVycm9yIGFzdClcbiAgICAgICAgICAgICAgICAgIGFzdFxuICAgICAgICAgICAgICAgICAgKHRyeSAgICAgICAgICAgICAgOzsgVE9ETzogUmVtb3ZlIHRoaXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDs7IE9sZCBjb21waWxlciBoYXMgaW5jb3JyZWN0IGFwcGx5LlxuICAgICAgICAgICAgICAgICAgICAoYXBwbHkgZ2VuZXJhdGUgKHZlYyAoY29ucyAoY29uaiBvcHRpb25zXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHs6c291cmNlIHNvdXJjZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnNvdXJjZS11cmkgc291cmNlLXVyaX0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICg6YXN0IGFzdCkpKSlcbiAgICAgICAgICAgICAgICAgICAgKGNhdGNoIGVycm9yIHs6ZXJyb3IgZXJyb3J9KSkpXG5cbiAgICAgICAgIGV4cGFuc2lvbiAoaWYgKGlkZW50aWNhbD8gOmV4cGFuc2lvbiAoOnByaW50IG9wdGlvbnMpKVxuICAgICAgICAgICAgICAgICAgICAgKHJlZHVjZSAoZm4gW3Jlc3VsdCBpdGVtXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChzdHIgcmVzdWx0IChwci1zdHIgKC4tZm9ybSBpdGVtKSkgXCJcXG5cIikpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJcIiAoLi1hc3QgYXN0KSkpXG5cbiAgICAgICAgIHJlc3VsdCB7OnNvdXJjZS11cmkgc291cmNlLXVyaVxuICAgICAgICAgICAgICAgICA6YXN0ICg6YXN0IGFzdClcbiAgICAgICAgICAgICAgICAgOmZvcm1zICg6Zm9ybXMgZm9ybXMpXG4gICAgICAgICAgICAgICAgIDpleHBhbnNpb24gZXhwYW5zaW9ufV1cbiAgICAgKGNvbmogb3B0aW9ucyBvdXRwdXQgcmVzdWx0KSkpKVxuXG4oZGVmbiBldmFsdWF0ZVxuICBbc291cmNlXVxuICAobGV0IFtvdXRwdXQgKGNvbXBpbGUgc291cmNlKV1cbiAgICAoaWYgKDplcnJvciBvdXRwdXQpXG4gICAgICAodGhyb3cgKDplcnJvciBvdXRwdXQpKVxuICAgICAgKGV2YWwgKDpjb2RlIG91dHB1dCkpKSkpXG4iXX0=
