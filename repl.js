{
    var _ns_ = {
            id: 'wisp.repl',
            doc: void 0
        };
    var repl = require('repl');
    var repl = repl;
    var vm = require('vm');
    var vm = vm;
    var wisp_runtime = require('./runtime');
    var subs = wisp_runtime.subs;
    var isEqual = wisp_runtime.isEqual;
    var keys = wisp_runtime.keys;
    var wisp_sequence = require('./sequence');
    var count = wisp_sequence.count;
    var list = wisp_sequence.list;
    var conj = wisp_sequence.conj;
    var cons = wisp_sequence.cons;
    var vec = wisp_sequence.vec;
    var last = wisp_sequence.last;
    var wisp_compiler = require('./compiler');
    var compile = wisp_compiler.compile;
    var readForms = wisp_compiler.readForms;
    var analyzeForms = wisp_compiler.analyzeForms;
    var generate = wisp_compiler.generate;
    var wisp_ast = require('./ast');
    var prStr = wisp_ast.prStr;
    var base64Encode = require('base64-encode');
    var btoa = base64Encode;
}
var evaluateCode = exports.evaluateCode = function evaluateCode(source, uri, context) {
        return function () {
            var sourceUriø1 = '' + 'data:application/wisp;charset=utf-8;base64,' + btoa(source);
            var formsø1 = readForms(source, sourceUriø1);
            var nodesø1 = (formsø1 || 0)['forms'] ? analyzeForms((formsø1 || 0)['forms']) : void 0;
            var inputø1 = (nodesø1 || 0)['ast'] ? (function () {
                    try {
                        return generate.apply(void 0, vec(cons({ 'source-uri': sourceUriø1 }, (nodesø1 || 0)['ast'])));
                    } catch (error) {
                        return { 'error': error };
                    }
                })() : void 0;
            var outputø1 = (inputø1 || 0)['code'] ? (function () {
                    try {
                        return { 'value': vm.runInContext((inputø1 || 0)['code'], context, uri) };
                    } catch (error) {
                        return { 'error': error };
                    }
                })() : void 0;
            var resultø1 = conj(formsø1, nodesø1, inputø1, outputø1, { 'error': (outputø1 || 0)['error'] || (inputø1 || 0)['error'] || (nodesø1 || 0)['error'] || (formsø1 || 0)['error'] });
            context._3 = context._2;
            context._2 = context._1;
            return context._1 = resultø1;
        }.call(this);
    };
var evaluate = exports.evaluate = function () {
        var inputø1 = void 0;
        var outputø1 = void 0;
        return function evaluate(code, context, file, callback) {
            return !(inputø1 === code) ? (function () {
                inputø1 = !(last(code) === '\n') ? subs(code, 0, count(code) - 1) : code;
                outputø1 = evaluateCode(inputø1, file, context);
                return callback((outputø1 || 0)['error'], (outputø1 || 0)['value']);
            })() : callback((outputø1 || 0)['error']);
        };
    }.call(this);
var start = exports.start = function start() {
        return function () {
            var sessionø1 = repl.start({
                    'writer': prStr,
                    'prompt': '=> ',
                    'ignoreUndefined': true,
                    'useGlobal': false,
                    'eval': evaluate
                });
            var contextø1 = sessionø1.context;
            [
                'runtime',
                'sequence',
                'string'
            ].map(function (n) {
                return function () {
                    var fø1 = require('' + './src/' + n + '.wisp');
                    return keys(fø1).map(function (k) {
                        return (contextø1 || 0)[k] = (fø1 || 0)[k];
                    });
                }.call(this);
            });
            contextø1.exports = {};
            return sessionø1;
        }.call(this);
    };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndpc3AvcmVwbC53aXNwIl0sIm5hbWVzIjpbIl9uc18iLCJpZCIsImRvYyIsInN1YnMiLCJpc0VxdWFsIiwia2V5cyIsImNvdW50IiwibGlzdCIsImNvbmoiLCJjb25zIiwidmVjIiwibGFzdCIsImNvbXBpbGUiLCJyZWFkRm9ybXMiLCJhbmFseXplRm9ybXMiLCJnZW5lcmF0ZSIsInByU3RyIiwiZXZhbHVhdGVDb2RlIiwiZXhwb3J0cyIsInNvdXJjZSIsInVyaSIsImNvbnRleHQiLCJzb3VyY2VVcmnDuDEiLCJidG9hIiwiZm9ybXPDuDEiLCJub2Rlc8O4MSIsImlucHV0w7gxIiwiZXJyb3IiLCJvdXRwdXTDuDEiLCJ2bSIsInJ1bkluQ29udGV4dCIsInJlc3VsdMO4MSIsIl8zIiwiXzIiLCJfMSIsImV2YWx1YXRlIiwiY29kZSIsImZpbGUiLCJjYWxsYmFjayIsInN0YXJ0Iiwic2Vzc2lvbsO4MSIsInJlcGwiLCJjb250ZXh0w7gxIiwibWFwIiwibiIsImbDuDEiLCJyZXF1aXJlIiwiayJdLCJtYXBwaW5ncyI6IjtJQUFBLElBQUNBLEksR0FBRDtBQUFBLFlBQUFDLEUsRUFBSSxXQUFKO0FBQUEsWUFBQUMsRyxFQUFBLEssQ0FBQTtBQUFBLFU7Ozs7OztRQUdrQ0MsSUFBQSxHLGFBQUFBLEk7UUFBS0MsT0FBQSxHLGFBQUFBLE87UUFBRUMsSUFBQSxHLGFBQUFBLEk7O1FBQ05DLEtBQUEsRyxjQUFBQSxLO1FBQU1DLElBQUEsRyxjQUFBQSxJO1FBQUtDLElBQUEsRyxjQUFBQSxJO1FBQUtDLElBQUEsRyxjQUFBQSxJO1FBQUtDLEdBQUEsRyxjQUFBQSxHO1FBQUlDLElBQUEsRyxjQUFBQSxJOztRQUN6QkMsT0FBQSxHLGNBQUFBLE87UUFBUUMsU0FBQSxHLGNBQUFBLFM7UUFBV0MsWUFBQSxHLGNBQUFBLFk7UUFBY0MsUUFBQSxHLGNBQUFBLFE7O1FBQ3RDQyxLQUFBLEcsU0FBQUEsSzs7OztBQUc5QixJQUFNQyxZQUFBLEdBQUFDLE9BQUEsQ0FBQUQs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QUFBLEdBQUFyQixPQUFBLENBQUFxQixLQUFBLEdBQU4sU0FBTUEsS0FBTixHQUdFO0FBQUEsZSxZQUFNO0FBQUEsZ0JBQUFDLFMsR0FBZ0JDLElBQVAsQ0FBQ0YsS0FBRixDQUNRO0FBQUEsb0IsVUFBU3ZCLEtBQVQ7QUFBQSxvQixVQUNTLEtBRFQ7QUFBQSxvQix1QkFBQTtBQUFBLG9CLGtCQUFBO0FBQUEsb0IsUUFJT21CLFFBSlA7QUFBQSxpQkFEUixDQUFSO0FBQUEsWUFNQSxJQUFBTyxTLEdBQW1CRixTQUFYLENBQUduQixPQUFYLENBTkE7QUFBQSxZQVFFO0FBQUEsZ0JBQUMsU0FBRDtBQUFBLGdCQUFXLFVBQVg7QUFBQSxnQkFBc0IsUUFBdEI7QUFBQSxhQUFMLENBQUNzQixHQUFGLENBQ00sVUFBS0MsQ0FBTCxFQUNFO0FBQUEsdUIsWUFBTTtBQUFBLHdCQUFBQyxHLEdBQUdDLE9BQUQsQyxLQUFjLFEsR0FBU0YsQ0FBZCxHQUFnQixPQUF6QixDQUFGO0FBQUEsb0JBQ0osT0FBT3ZDLElBQUQsQ0FBTXdDLEdBQU4sQ0FBTCxDQUFDRixHQUFGLENBQ00sVUFBS0ksQ0FBTCxFQUFRO0FBQUEsK0IsQ0FBV0wsUyxNQUFMLENBQWFLLENBQWIsQ0FBTixHLENBQTJCRixHLE1BQUwsQ0FBT0UsQ0FBUCxDQUF0QjtBQUFBLHFCQURkLEVBREk7QUFBQSxpQixLQUFOLEMsSUFBQTtBQUFBLGFBRlIsRUFSSTtBQUFBLFlBYUVMLFNBQUEsQ0FBUXhCLE9BQWQsR0FBc0IsRUFBdEIsQ0FiSTtBQUFBLFlBY0osT0FBQXNCLFNBQUEsQ0FkSTtBQUFBLFMsS0FBTixDLElBQUE7QUFBQSxLQUhGIiwic291cmNlc0NvbnRlbnQiOlsiKG5zIHdpc3AucmVwbFxuICAoOnJlcXVpcmUgW3JlcGwgOmFzIHJlcGxdXG4gICAgICAgICAgICBbdm0gOmFzIHZtXVxuICAgICAgICAgICAgW3dpc3AucnVudGltZSA6cmVmZXIgW3N1YnMgPSBrZXlzXV1cbiAgICAgICAgICAgIFt3aXNwLnNlcXVlbmNlIDpyZWZlciBbY291bnQgbGlzdCBjb25qIGNvbnMgdmVjIGxhc3RdXVxuICAgICAgICAgICAgW3dpc3AuY29tcGlsZXIgOnJlZmVyIFtjb21waWxlIHJlYWQtZm9ybXMgYW5hbHl6ZS1mb3JtcyBnZW5lcmF0ZV1dXG4gICAgICAgICAgICBbd2lzcC5hc3QgOnJlZmVyIFtwci1zdHJdXVxuICAgICAgICAgICAgW2Jhc2U2NC1lbmNvZGUgOmFzIGJ0b2FdKSlcblxuKGRlZm4gZXZhbHVhdGUtY29kZVxuICBcIkV2YWx1YXRlcyBzb21lIHRleHQgZnJvbSBSRVBMIGlucHV0LiBJZiBtdWx0aXBsZSBmb3JtcyBhcmVcbiAgcHJlc2VudCwgZXZhbHVhdGVzIGluIHNlcXVlbmNlIHVudGlsIG9uZSB0aHJvd3MgYW4gZXJyb3JcbiAgb3IgdGhlIGxhc3QgZm9ybSBpcyByZWFjaGVkLiBUaGUgcmVzdWx0IGZyb20gdGhlIGxhc3RcbiAgZXZhbHVhdGVkIGZvcm0gaXMgcmV0dXJuZWQuICoxLCAqMiwgKjMsIGFuZCAqZSBhcmUgdXBkYXRlZFxuICBhcHByb3ByaWF0ZWx5LlwiXG4gIFtzb3VyY2UgdXJpIGNvbnRleHRdXG4gIChsZXQgW3NvdXJjZS11cmkgKHN0ciBcImRhdGE6YXBwbGljYXRpb24vd2lzcDtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxcIlxuICAgICAgICAgICAgICAgICAgICAgICAgKGJ0b2Egc291cmNlKSlcbiAgICAgICAgZm9ybXMgKHJlYWQtZm9ybXMgc291cmNlIHNvdXJjZS11cmkpXG4gICAgICAgIG5vZGVzIChpZiAoOmZvcm1zIGZvcm1zKSAoYW5hbHl6ZS1mb3JtcyAoOmZvcm1zIGZvcm1zKSkpXG4gICAgICAgIGlucHV0IChpZiAoOmFzdCBub2RlcylcbiAgICAgICAgICAgICAgICAodHJ5ICAgICAgICAgICAgICA7OyBUT0RPOiBSZW1vdmUgdGhpc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDs7IE9sZCBjb21waWxlciBoYXMgaW5jb3JyZWN0IGFwcGx5LlxuICAgICAgICAgICAgICAgICAgKGFwcGx5IGdlbmVyYXRlICh2ZWMgKGNvbnMgezpzb3VyY2UtdXJpIHNvdXJjZS11cml9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoOmFzdCBub2RlcykpKSlcbiAgICAgICAgICAgICAgICAgIChjYXRjaCBlcnJvciB7OmVycm9yIGVycm9yfSkpKVxuICAgICAgICBvdXRwdXQgKGlmICg6Y29kZSBpbnB1dClcbiAgICAgICAgICAgICAgICAgKHRyeVxuICAgICAgICAgICAgICAgICAgIHs6dmFsdWUgKC5ydW4taW4tY29udGV4dCB2bSAoOmNvZGUgaW5wdXQpIGNvbnRleHQgdXJpKX1cbiAgICAgICAgICAgICAgICAgICAoY2F0Y2ggZXJyb3IgezplcnJvciBlcnJvcn0pKSlcbiAgICAgICAgcmVzdWx0IChjb25qIGZvcm1zIG5vZGVzIGlucHV0IG91dHB1dCB7OmVycm9yIChvciAoOmVycm9yIG91dHB1dClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoOmVycm9yIGlucHV0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICg6ZXJyb3Igbm9kZXMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKDplcnJvciBmb3JtcykpfSldXG4gICAgKHNldCEgY29udGV4dC4qMyBjb250ZXh0LioyKVxuICAgIChzZXQhIGNvbnRleHQuKjIgY29udGV4dC4qMSlcbiAgICAoc2V0ISBjb250ZXh0LioxIHJlc3VsdCkpKVxuXG4oZGVmIGV2YWx1YXRlXG4gIChsZXQgW2lucHV0IG5pbFxuICAgICAgICBvdXRwdXQgbmlsXVxuICAgIChmbiBldmFsdWF0ZSBbY29kZSBjb250ZXh0IGZpbGUgY2FsbGJhY2tdXG4gICAgICAoaWYgKG5vdCAoaWRlbnRpY2FsPyBpbnB1dCBjb2RlKSlcbiAgICAgICAgKGRvXG4gICAgICAgICAgKHNldCEgaW5wdXRcbiAgICAgICAgICAgIChpZiAobm90IChpZGVudGljYWw/IChsYXN0IGNvZGUpIFwiXFxuXCIpKVxuICAgICAgICAgICAgICAoc3VicyBjb2RlIDAgKC0gKGNvdW50IGNvZGUpIDEpKVxuICAgICAgICAgICAgICBjb2RlKSlcbiAgICAgICAgICAoc2V0ISBvdXRwdXQgKGV2YWx1YXRlLWNvZGUgaW5wdXQgZmlsZSBjb250ZXh0KSlcbiAgICAgICAgICAoY2FsbGJhY2sgKDplcnJvciBvdXRwdXQpICg6dmFsdWUgb3V0cHV0KSkpXG4gICAgICAgIChjYWxsYmFjayAoOmVycm9yIG91dHB1dCkpKSkpKVxuXG4oZGVmbiBzdGFydFxuICBcIlN0YXJ0cyByZXBsXCJcbiAgW11cbiAgKGxldCBbc2Vzc2lvbiAoLnN0YXJ0IHJlcGxcbiAgICAgICAgICAgICAgICAgICAgICAgIHs6d3JpdGVyIHByLXN0clxuICAgICAgICAgICAgICAgICAgICAgICAgIDpwcm9tcHQgXCI9PiBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgIDppZ25vcmVVbmRlZmluZWQgdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgIDp1c2VHbG9iYWwgZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICA6ZXZhbCBldmFsdWF0ZX0pXG4gICAgICAgIGNvbnRleHQgKC4tY29udGV4dCBzZXNzaW9uKV1cbiAgICA7IGhvaXN0IHdpc3AgYnVpbHRpbnMgaW50byB0aGUgcmVwbFxuICAgICgubWFwIFtcInJ1bnRpbWVcIiBcInNlcXVlbmNlXCIgXCJzdHJpbmdcIl1cbiAgICAgICAgICAoZm4gW25dXG4gICAgICAgICAgICAobGV0IFtmIChyZXF1aXJlIChzdHIgXCIuL3NyYy9cIiBuIFwiLndpc3BcIikpXVxuICAgICAgICAgICAgICAoLm1hcCAoa2V5cyBmKVxuICAgICAgICAgICAgICAgICAgICAoZm4gW2tdIChzZXQhIChnZXQgY29udGV4dCBrKSAoZ2V0IGYgaykpKSkpKSlcbiAgICAoc2V0ISBjb250ZXh0LmV4cG9ydHMge30pXG4gICAgc2Vzc2lvbikpXG4iXX0=
