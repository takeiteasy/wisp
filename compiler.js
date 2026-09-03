{
    var _ns_ = {
        id: 'wisp.compiler',
        doc: null
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
                recur = isError(formø1) ? (function () {
                    return {
                        'forms': formsø1,
                        'error': formø1
                    };
                })() : formø1 === eofø1 ? (function () {
                    return { 'forms': formsø1 };
                })() : (function () {
                    return loop[0] = conj(formsø1, formø1), loop[1] = readForm(readerø1, eofø1), loop;
                })();
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
            'ns': { 'name': symbol(null, 'user.wisp') }
        };
        do {
            recur = function () {
                var nodeø1 = analyzeForm(envø1, first(formsø2));
                var nsø1 = isEqual((nodeø1 || 0)['op'], 'ns') ? nodeø1 : (envø1 || 0)['ns'];
                return isError(nodeø1) ? (function () {
                    return {
                        'ast': nodesø1,
                        'error': nodeø1
                    };
                })() : count(formsø2) <= 1 ? (function () {
                    return { 'ast': conj(nodesø1, nodeø1) };
                })() : (function () {
                    return loop[0] = conj(nodesø1, nodeø1), loop[1] = rest(formsø2), loop[2] = conj(envø1, { 'ns': nsø1 }), loop;
                })();
            }.call(this);
        } while (nodesø1 = loop[0], formsø2 = loop[1], envø1 = loop[2], recur === loop);
        return recur;
    }.call(this);
};
var compile = exports.compile = function compile(source) {
    var args = Array.prototype.slice.call(arguments, 1);
    return isEmpty(args) ? compile(source, {}) : function () {
        var optionsø1 = first(args);
        var sourceUriø1 = (optionsø1 || 0)['source-uri'] || name('anonymous.wisp');
        var formsø1 = readForms(source, sourceUriø1);
        var astø1 = (formsø1 || 0)['error'] ? formsø1 : analyzeForms((formsø1 || 0)['forms']);
        var outputø1 = (astø1 || 0)['error'] ? astø1 : (function () {
            try {
                return generate.apply(null, vec(cons(conj(optionsø1, {
                    'source': source,
                    'source-uri': sourceUriø1
                }), (astø1 || 0)['ast'])));
            } catch (error) {
                return { 'error': error };
            }
        })();
        var expansionø1 = 'expansion' === (optionsø1 || 0)['print'] ? reduce(function (result, item) {
            return '' + result + prStr(item.form) + '\n';
        }, '', astø1.ast) : null;
        var resultø1 = {
            'source-uri': sourceUriø1,
            'ast': (astø1 || 0)['ast'],
            'forms': (formsø1 || 0)['forms'],
            'expansion': expansionø1
        };
        return conj(optionsø1, outputø1, resultø1);
    }.call(this);
};
var evaluate = exports.evaluate = function evaluate(source) {
    return function () {
        var outputø1 = compile(source);
        return (outputø1 || 0)['error'] ? (function () {
            throw (outputø1 || 0)['error'];
        })() : eval((outputø1 || 0)['code']);
    }.call(this);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndpc3AvY29tcGlsZXIud2lzcCJdLCJuYW1lcyI6WyJfbnNfIiwiaWQiLCJkb2MiLCJhbmFseXplIiwicmVhZF8iLCJyZWFkIiwicHVzaEJhY2tSZWFkZXIiLCJyZXBsYWNlIiwibWFwIiwicmVkdWNlIiwiY29uaiIsImNvbnMiLCJ2ZWMiLCJmaXJzdCIsInJlc3QiLCJpc0VtcHR5IiwiY291bnQiLCJpc0Vycm9yIiwiaXNFcXVhbCIsIm5hbWUiLCJzeW1ib2wiLCJwclN0ciIsImdlbmVyYXRlSnMiLCJnZW5lcmF0ZSIsImV4cG9ydHMiLCJyZWFkRm9ybSIsInJlYWRlciIsImVvZiIsImVycm9yIiwicmVhZEZvcm1zIiwic291cmNlIiwidXJpIiwicmVhZGVyw7gxIiwiZW9mw7gxIiwiZm9ybXPDuDEiLCJmb3Jtw7gxIiwiYW5hbHl6ZUZvcm0iLCJlbnYiLCJmb3JtIiwiYW5hbHl6ZUZvcm1zIiwiZm9ybXMiLCJub2Rlc8O4MSIsImZvcm1zw7gyIiwiZW52w7gxIiwibm9kZcO4MSIsIm5zw7gxIiwiY29tcGlsZSIsImFyZ3MiLCJvcHRpb25zw7gxIiwic291cmNlVXJpw7gxIiwiYXN0w7gxIiwib3V0cHV0w7gxIiwiZXhwYW5zaW9uw7gxIiwicmVzdWx0IiwiaXRlbSIsImFzdCIsInJlc3VsdMO4MSIsImV2YWx1YXRlIiwiZXZhbCJdLCJtYXBwaW5ncyI6IjtJQUFBLElBQUNBLEksR0FBRDtBQUFBLFFBQUFDLEUsRUFBSSxlQUFKO0FBQUEsUUFBQUMsRyxFQUFBO0FBQUEsTTs7UUFDbUNDLE9BQUEsRyxjQUFBQSxPOztRQUNGQyxLQUFBLEcsWUFBQUEsSztRQUFNQyxJQUFBLEcsWUFBQUEsSTtRQUFLQyxjQUFBLEcsWUFBQUEsYzs7UUFDWEMsT0FBQSxHLFlBQUFBLE87O1FBQ0VDLEdBQUEsRyxjQUFBQSxHO1FBQUlDLE1BQUEsRyxjQUFBQSxNO1FBQU9DLElBQUEsRyxjQUFBQSxJO1FBQUtDLElBQUEsRyxjQUFBQSxJO1FBQUtDLEdBQUEsRyxjQUFBQSxH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QixNQUFqQixFQUNFO0FBQUEsVyxZQUFRO0FBQUEsWUFBQXFCLFEsR0FBUUwsT0FBRCxDQUFTaEIsTUFBVCxDQUFQO0FBQUEsUUFDTixPLENBQVlxQixRLE1BQVIsQyxPQUFBLENBQUosRyxhQUNFO0FBQUEsa0IsQ0FBZUEsUSxNQUFSLEMsT0FBQSxDQUFQO0FBQUEsUyxDQUFBLEVBREYsR0FFR08sSUFBRCxDLENBQWFQLFEsTUFBUCxDLE1BQUEsQ0FBTixDQUZGLENBRE07QUFBQSxLLEtBQVIsQyxJQUFBO0FBQUEsQ0FERiIsInNvdXJjZXNDb250ZW50IjpbIihucyB3aXNwLmNvbXBpbGVyXG4gICg6cmVxdWlyZSBbd2lzcC5hbmFseXplciA6cmVmZXIgW2FuYWx5emVdXVxuICAgICAgICAgICAgW3dpc3AucmVhZGVyIDpyZWZlciBbcmVhZCogcmVhZCBwdXNoLWJhY2stcmVhZGVyXV1cbiAgICAgICAgICAgIFt3aXNwLnN0cmluZyA6cmVmZXIgW3JlcGxhY2VdXVxuICAgICAgICAgICAgW3dpc3Auc2VxdWVuY2UgOnJlZmVyIFttYXAgcmVkdWNlIGNvbmogY29ucyB2ZWMgZmlyc3QgcmVzdCBlbXB0eT8gY291bnRdXVxuICAgICAgICAgICAgW3dpc3AucnVudGltZSA6cmVmZXIgW2Vycm9yPyA9XV1cbiAgICAgICAgICAgIFt3aXNwLmFzdCA6cmVmZXIgW25hbWUgc3ltYm9sIHByLXN0cl1dXG5cbiAgICAgICAgICAgIFt3aXNwLmJhY2tlbmQuZXNjb2RlZ2VuLmdlbmVyYXRvciA6cmVmZXIgW2dlbmVyYXRlXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpyZW5hbWUge2dlbmVyYXRlIGdlbmVyYXRlLWpzfV1cbiAgICAgICAgICAgIFtiYXNlNjQtZW5jb2RlIDphcyBidG9hXSkpXG5cbihkZWZ2YXIgZ2VuZXJhdGUgZ2VuZXJhdGUtanMpXG5cbihkZWZ1biByZWFkLWZvcm0gKHJlYWRlciBlb2YpXG4gICh0cnkgKHJlYWQgcmVhZGVyIGZhbHNlIGVvZiBmYWxzZSlcbiAgICAoY2F0Y2ggZXJyb3IgZXJyb3IpKSlcblxuKGRlZnVuIHJlYWQtZm9ybXMgKHNvdXJjZSB1cmkpXG4gIChsZXQqICgocmVhZGVyIChwdXNoLWJhY2stcmVhZGVyIHNvdXJjZSB1cmkpKVxuICAgICAgICAoZW9mIHt9KSlcbiAgICAobG9vcCAoKGZvcm1zIFtdKVxuICAgICAgICAgICAoZm9ybSAocmVhZC1mb3JtIHJlYWRlciBlb2YpKSlcbiAgICAgIChjb25kICgoZXJyb3I/IGZvcm0pIHs6Zm9ybXMgZm9ybXMgOmVycm9yIGZvcm19KVxuICAgICAgICAgICAgKChpZGVudGljYWw/IGZvcm0gZW9mKSB7OmZvcm1zIGZvcm1zfSlcbiAgICAgICAgICAgIChlbHNlIChyZWN1ciAoY29uaiBmb3JtcyBmb3JtKVxuICAgICAgICAgICAgICAgICAgICAgICAgIChyZWFkLWZvcm0gcmVhZGVyIGVvZikpKSkpKSlcblxuKGRlZnVuIGFuYWx5emUtZm9ybSAoZW52IGZvcm0pXG4gICh0cnkgKGFuYWx5emUgZW52IGZvcm0pIChjYXRjaCBlcnJvciBlcnJvcikpKVxuXG4oZGVmdW4gYW5hbHl6ZS1mb3JtcyAoZm9ybXMpXG4gIChsb29wICgobm9kZXMgW10pXG4gICAgICAgICAoZm9ybXMgZm9ybXMpXG4gICAgICAgICAoZW52IHs6bG9jYWxzIHt9XG4gICAgICAgICAgICAgICA6YmluZGluZ3MgW11cbiAgICAgICAgICAgICAgIDp0b3AgdHJ1ZVxuICAgICAgICAgICAgICAgOm5zIHs6bmFtZSAndXNlci53aXNwfX0pKVxuICAgIChsZXQqICgobm9kZSAoYW5hbHl6ZS1mb3JtIGVudiAoZmlyc3QgZm9ybXMpKSlcbiAgICAgICAgICAobnMgKGlmICg9ICg6b3Agbm9kZSkgOm5zKVxuICAgICAgICAgICAgICAgIG5vZGVcbiAgICAgICAgICAgICAgICAoOm5zIGVudikpKSlcbiAgICAgIChjb25kICgoZXJyb3I/IG5vZGUpIHs6YXN0IG5vZGVzIDplcnJvciBub2RlfSlcbiAgICAgICAgICAgICgoPD0gKGNvdW50IGZvcm1zKSAxKSB7OmFzdCAoY29uaiBub2RlcyBub2RlKX0pXG4gICAgICAgICAgICAoZWxzZSAocmVjdXIgKGNvbmogbm9kZXMgbm9kZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAocmVzdCBmb3JtcylcbiAgICAgICAgICAgICAgICAgICAgICAgICAoY29uaiBlbnYgezpucyBuc30pKSkpKSkpXG5cbihkZWZ1biBjb21waWxlIChzb3VyY2UgJnJlc3QgYXJncylcbiAgXCJDb21waWxlciB0YWtlcyB3aXNwIGNvZGUgaW4gZm9ybSBvZiBzdHJpbmcgYW5kIHJldHVybnMgYSBoYXNoXG4gIGNvbnRhaW5pbmcgYDpzb3VyY2VgIHJlcHJlc2VudGluZyBjb21waWxhdGlvbiByZXN1bHQuIElmXG4gIGAoOnNvdXJjZS1tYXAgb3B0aW9ucylgIGlzIGB0cnVlYCB0aGVuIGA6c291cmNlLW1hcGAgb2YgdGhlIHJldHVybmVkXG4gIGhhc2ggd2lsbCBjb250YWluIHNvdXJjZSBtYXAgZm9yIGl0LlxuICA6b3V0cHV0LXVyaVxuICA6c291cmNlLW1hcC11cmlcblxuICBSZXR1cm5zIGhhc2ggd2l0aCBmb2xsb3dpbmcgZmllbGRzOlxuXG4gIDpjb2RlIC0gR2VuZXJhdGVkIGNvZGUuXG5cbiAgOnNvdXJjZS1tYXAgLSBHZW5lcmF0ZWQgc291cmNlIG1hcC4gT25seSBpZiAoOnNvdXJjZS1tYXAgb3B0aW9ucylcbiAgICAgICAgICAgICAgICB3YXMgdHJ1ZS5cblxuICA6b3V0cHV0LXVyaSAtIFJldHVybnMgYmFjayAoOm91dHB1dC11cmkgb3B0aW9ucykgaWYgd2FzIHBhc3NlZCBpbixcbiAgICAgICAgICAgICAgICBvdGhlcndpc2UgY29tcHV0ZXMgb25lIGZyb20gKDpzb3VyY2UtdXJpIG9wdGlvbnMpIGJ5XG4gICAgICAgICAgICAgICAgY2hhbmdpbmcgZmlsZSBleHRlbnNpb24uXG5cbiAgOnNvdXJjZS1tYXAtdXJpIC0gUmV0dXJucyBiYWNrICg6c291cmNlLW1hcC11cmkgb3B0aW9ucykgaWYgd2FzIHBhc3NlZFxuICAgICAgICAgICAgICAgICAgICBpbiwgb3RoZXJ3aXNlIGNvbXB1dGVzIG9uZSBmcm9tICg6c291cmNlLXVyaSBvcHRpb25zKVxuICAgICAgICAgICAgICAgICAgICBieSBhZGRpbmcgYC5tYXBgIGZpbGUgZXh0ZW5zaW9uLlwiXG4gIChpZiAoZW1wdHk/IGFyZ3MpXG4gICAgKGNvbXBpbGUgc291cmNlIHt9KVxuICAgIChsZXQqICgob3B0aW9ucyAoZmlyc3QgYXJncykpXG4gICAgICAgICAgKHNvdXJjZS11cmkgKG9yICg6c291cmNlLXVyaSBvcHRpb25zKSAobmFtZSA6YW5vbnltb3VzLndpc3ApKSkgOzsgSEFDSzogV29ya2Fyb3VuZCBmb3Igc2VnZmF1bHQgIzY2OTFcbiAgICAgICAgICAoZm9ybXMgKHJlYWQtZm9ybXMgc291cmNlIHNvdXJjZS11cmkpKVxuXG4gICAgICAgICAgKGFzdCAoaWYgKDplcnJvciBmb3JtcylcbiAgICAgICAgICAgICAgICAgZm9ybXNcbiAgICAgICAgICAgICAgICAgKGFuYWx5emUtZm9ybXMgKDpmb3JtcyBmb3JtcykpKSlcblxuICAgICAgICAgIChvdXRwdXQgKGlmICg6ZXJyb3IgYXN0KVxuICAgICAgICAgICAgICAgICAgICBhc3RcbiAgICAgICAgICAgICAgICAgICAgKHRyeSAgICAgICAgICAgICAgOzsgVE9ETzogUmVtb3ZlIHRoaXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOzsgT2xkIGNvbXBpbGVyIGhhcyBpbmNvcnJlY3QgYXBwbHkuXG4gICAgICAgICAgICAgICAgICAgICAgKGFwcGx5IGdlbmVyYXRlICh2ZWMgKGNvbnMgKGNvbmogb3B0aW9uc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHs6c291cmNlIHNvdXJjZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6c291cmNlLXVyaSBzb3VyY2UtdXJpfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoOmFzdCBhc3QpKSkpXG4gICAgICAgICAgICAgICAgICAgICAgKGNhdGNoIGVycm9yIHs6ZXJyb3IgZXJyb3J9KSkpKVxuXG4gICAgICAgICAgKGV4cGFuc2lvbiAoaWYgKGlkZW50aWNhbD8gOmV4cGFuc2lvbiAoOnByaW50IG9wdGlvbnMpKVxuICAgICAgICAgICAgICAgICAgICAgICAocmVkdWNlIChsYW1iZGEgKHJlc3VsdCBpdGVtKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHN0ciByZXN1bHQgKHByLXN0ciAoLi1mb3JtIGl0ZW0pKSBcIlxcblwiKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiXCIgKC4tYXN0IGFzdCkpKSlcblxuICAgICAgICAgIChyZXN1bHQgezpzb3VyY2UtdXJpIHNvdXJjZS11cmlcbiAgICAgICAgICAgICAgICAgICA6YXN0ICg6YXN0IGFzdClcbiAgICAgICAgICAgICAgICAgICA6Zm9ybXMgKDpmb3JtcyBmb3JtcylcbiAgICAgICAgICAgICAgICAgICA6ZXhwYW5zaW9uIGV4cGFuc2lvbn0pKVxuICAgICAoY29uaiBvcHRpb25zIG91dHB1dCByZXN1bHQpKSkpXG5cbihkZWZ1biBldmFsdWF0ZSAoc291cmNlKVxuICAobGV0KiAoKG91dHB1dCAoY29tcGlsZSBzb3VyY2UpKSlcbiAgICAoaWYgKDplcnJvciBvdXRwdXQpXG4gICAgICAodGhyb3cgKDplcnJvciBvdXRwdXQpKVxuICAgICAgKGV2YWwgKDpjb2RlIG91dHB1dCkpKSkpXG4iXX0=
