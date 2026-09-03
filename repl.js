{
    var _ns_ = {
        id: 'wisp.repl',
        doc: null
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
        var nodesø1 = (formsø1 || 0)['forms'] ? analyzeForms((formsø1 || 0)['forms']) : null;
        var inputø1 = (nodesø1 || 0)['ast'] ? (function () {
            try {
                return generate.apply(null, vec(cons({ 'source-uri': sourceUriø1 }, (nodesø1 || 0)['ast'])));
            } catch (error) {
                return { 'error': error };
            }
        })() : null;
        var outputø1 = (inputø1 || 0)['code'] ? (function () {
            try {
                return { 'value': vm.runInContext((inputø1 || 0)['code'], context, uri) };
            } catch (error) {
                return { 'error': error };
            }
        })() : null;
        var resultø1 = conj(formsø1, nodesø1, inputø1, outputø1, { 'error': (outputø1 || 0)['error'] || (inputø1 || 0)['error'] || (nodesø1 || 0)['error'] || (formsø1 || 0)['error'] });
        context._3 = context._2;
        context._2 = context._1;
        return context._1 = resultø1;
    }.call(this);
};
var evaluate = exports.evaluate = function () {
    var inputø1 = null;
    var outputø1 = null;
    return function (code, context, file, callback) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndpc3AvcmVwbC53aXNwIl0sIm5hbWVzIjpbIl9uc18iLCJpZCIsImRvYyIsInN1YnMiLCJpc0VxdWFsIiwia2V5cyIsImNvdW50IiwibGlzdCIsImNvbmoiLCJjb25zIiwidmVjIiwibGFzdCIsImNvbXBpbGUiLCJyZWFkRm9ybXMiLCJhbmFseXplRm9ybXMiLCJnZW5lcmF0ZSIsInByU3RyIiwiZXZhbHVhdGVDb2RlIiwiZXhwb3J0cyIsInNvdXJjZSIsInVyaSIsImNvbnRleHQiLCJzb3VyY2VVcmnDuDEiLCJidG9hIiwiZm9ybXPDuDEiLCJub2Rlc8O4MSIsImlucHV0w7gxIiwiZXJyb3IiLCJvdXRwdXTDuDEiLCJ2bSIsInJ1bkluQ29udGV4dCIsInJlc3VsdMO4MSIsIl8zIiwiXzIiLCJfMSIsImV2YWx1YXRlIiwiY29kZSIsImZpbGUiLCJjYWxsYmFjayIsInN0YXJ0Iiwic2Vzc2lvbsO4MSIsInJlcGwiLCJjb250ZXh0w7gxIiwibWFwIiwibiIsImbDuDEiLCJyZXF1aXJlIiwiayJdLCJtYXBwaW5ncyI6IjtJQUFBLElBQUNBLEksR0FBRDtBQUFBLFFBQUFDLEUsRUFBSSxXQUFKO0FBQUEsUUFBQUMsRyxFQUFBO0FBQUEsTTs7Ozs7O1FBR2tDQyxJQUFBLEcsYUFBQUEsSTtRQUFLQyxPQUFBLEcsYUFBQUEsTztRQUFFQyxJQUFBLEcsYUFBQUEsSTs7UUFDTkMsS0FBQSxHLGNBQUFBLEs7UUFBTUMsSUFBQSxHLGNBQUFBLEk7UUFBS0MsSUFBQSxHLGNBQUFBLEk7UUFBS0MsSUFBQSxHLGNBQUFBLEk7UUFBS0MsR0FBQSxHLGNBQUFBLEc7UUFBSUMsSUFBQSxHLGNBQUFBLEk7O1FBQ3pCQyxPQUFBLEcsY0FBQUEsTztRQUFRQyxTQUFBLEcsY0FBQUEsUztRQUFXQyxZQUFBLEcsY0FBQUEsWTtRQUFjQyxRQUFBLEcsY0FBQUEsUTs7UUFDdENDLEtBQUEsRyxTQUFBQSxLOzs7O0FBRzlCLElBQU9DLFlBQUEsR0FBQUMsT0FBQSxDQUFBRCxZQUFBLEdB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UCxTQUFPQSxLQUFQLEdBR0U7QUFBQSxXLFlBQVE7QUFBQSxZQUFBQyxTLEdBQWdCQyxJQUFQLENBQUNGLEtBQUYsQ0FDTTtBQUFBLFksVUFBU3ZCLEtBQVQ7QUFBQSxZLFVBQ1MsS0FEVDtBQUFBLFksdUJBQUE7QUFBQSxZLGtCQUFBO0FBQUEsWSxRQUlPbUIsUUFKUDtBQUFBLFNBRE4sQ0FBUjtBQUFBLFFBTUQsSUFBQU8sUyxHQUFtQkYsU0FBWCxDQUFHbkIsT0FBWCxDQU5DO0FBQUEsUUFRQTtBQUFBLFlBQUMsU0FBRDtBQUFBLFlBQVcsVUFBWDtBQUFBLFlBQXNCLFFBQXRCO0FBQUEsU0FBTCxDQUFDc0IsR0FBRixDQUNNLFVBQVNDLENBQVQsRUFDRTtBQUFBLG1CLFlBQVE7QUFBQSxvQkFBQUMsRyxHQUFHQyxPQUFELEMsS0FBYyxRLEdBQVNGLENBQWQsR0FBZ0IsT0FBekIsQ0FBRjtBQUFBLGdCQUNOLE9BQU92QyxJQUFELENBQU13QyxHQUFOLENBQUwsQ0FBQ0YsR0FBRixDQUNNLFVBQVNJLENBQVQsRUFBWTtBQUFBLDJCLENBQVdMLFMsTUFBTCxDQUFhSyxDQUFiLENBQU4sRyxDQUEyQkYsRyxNQUFMLENBQU9FLENBQVAsQ0FBdEI7QUFBQSxpQkFEbEIsRUFETTtBQUFBLGEsS0FBUixDLElBQUE7QUFBQSxTQUZSLEVBUk07QUFBQSxRQWFBTCxTQUFBLENBQVF4QixPQUFkLEdBQXNCLEVBQXRCLENBYk07QUFBQSxRQWNOLE9BQUFzQixTQUFBLENBZE07QUFBQSxLLEtBQVIsQyxJQUFBO0FBQUEsQ0FIRiIsInNvdXJjZXNDb250ZW50IjpbIihucyB3aXNwLnJlcGxcbiAgKDpyZXF1aXJlIFtyZXBsIDphcyByZXBsXVxuICAgICAgICAgICAgW3ZtIDphcyB2bV1cbiAgICAgICAgICAgIFt3aXNwLnJ1bnRpbWUgOnJlZmVyIFtzdWJzID0ga2V5c11dXG4gICAgICAgICAgICBbd2lzcC5zZXF1ZW5jZSA6cmVmZXIgW2NvdW50IGxpc3QgY29uaiBjb25zIHZlYyBsYXN0XV1cbiAgICAgICAgICAgIFt3aXNwLmNvbXBpbGVyIDpyZWZlciBbY29tcGlsZSByZWFkLWZvcm1zIGFuYWx5emUtZm9ybXMgZ2VuZXJhdGVdXVxuICAgICAgICAgICAgW3dpc3AuYXN0IDpyZWZlciBbcHItc3RyXV1cbiAgICAgICAgICAgIFtiYXNlNjQtZW5jb2RlIDphcyBidG9hXSkpXG5cbihkZWZ1biBldmFsdWF0ZS1jb2RlXG4gIChzb3VyY2UgdXJpIGNvbnRleHQpXG4gIFwiRXZhbHVhdGVzIHNvbWUgdGV4dCBmcm9tIFJFUEwgaW5wdXQuIElmIG11bHRpcGxlIGZvcm1zIGFyZVxuICBwcmVzZW50LCBldmFsdWF0ZXMgaW4gc2VxdWVuY2UgdW50aWwgb25lIHRocm93cyBhbiBlcnJvclxuICBvciB0aGUgbGFzdCBmb3JtIGlzIHJlYWNoZWQuIFRoZSByZXN1bHQgZnJvbSB0aGUgbGFzdFxuICBldmFsdWF0ZWQgZm9ybSBpcyByZXR1cm5lZC4gKjEsICoyLCAqMywgYW5kICplIGFyZSB1cGRhdGVkXG4gIGFwcHJvcHJpYXRlbHkuXCJcbiAgKGxldCogKChzb3VyY2UtdXJpIChzdHIgXCJkYXRhOmFwcGxpY2F0aW9uL3dpc3A7Y2hhcnNldD11dGYtODtiYXNlNjQsXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKGJ0b2Egc291cmNlKSkpXG4gICAgICAgIChmb3JtcyAocmVhZC1mb3JtcyBzb3VyY2Ugc291cmNlLXVyaSkpXG4gICAgICAgIChub2RlcyAoaWYgKDpmb3JtcyBmb3JtcykgKGFuYWx5emUtZm9ybXMgKDpmb3JtcyBmb3JtcykpKSlcbiAgICAgICAgKGlucHV0IChpZiAoOmFzdCBub2RlcylcbiAgICAgICAgICAgICAgICAodHJ5ICAgICAgICAgICAgICA7OyBUT0RPOiBSZW1vdmUgdGhpc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDs7IE9sZCBjb21waWxlciBoYXMgaW5jb3JyZWN0IGFwcGx5LlxuICAgICAgICAgICAgICAgICAgKGFwcGx5IGdlbmVyYXRlICh2ZWMgKGNvbnMgezpzb3VyY2UtdXJpIHNvdXJjZS11cml9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoOmFzdCBub2RlcykpKSlcbiAgICAgICAgICAgICAgICAgIChjYXRjaCBlcnJvciB7OmVycm9yIGVycm9yfSkpKSlcbiAgICAgICAgKG91dHB1dCAoaWYgKDpjb2RlIGlucHV0KVxuICAgICAgICAgICAgICAgICAodHJ5XG4gICAgICAgICAgICAgICAgICAgezp2YWx1ZSAoLnJ1bi1pbi1jb250ZXh0IHZtICg6Y29kZSBpbnB1dCkgY29udGV4dCB1cmkpfVxuICAgICAgICAgICAgICAgICAgIChjYXRjaCBlcnJvciB7OmVycm9yIGVycm9yfSkpKSlcbiAgICAgICAgKHJlc3VsdCAoY29uaiBmb3JtcyBub2RlcyBpbnB1dCBvdXRwdXQgezplcnJvciAob3IgKDplcnJvciBvdXRwdXQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKDplcnJvciBpbnB1dClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoOmVycm9yIG5vZGVzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICg6ZXJyb3IgZm9ybXMpKX0pKSlcbiAgICAoc2V0ZiBjb250ZXh0LiozIGNvbnRleHQuKjIpXG4gICAgKHNldGYgY29udGV4dC4qMiBjb250ZXh0LioxKVxuICAgIChzZXRmIGNvbnRleHQuKjEgcmVzdWx0KSkpXG5cbihkZWZ2YXIgZXZhbHVhdGVcbiAgKGxldCogKChpbnB1dCBuaWwpXG4gICAgICAgIChvdXRwdXQgbmlsKSlcbiAgICAobGFtYmRhIChjb2RlIGNvbnRleHQgZmlsZSBjYWxsYmFjaylcbiAgICAgIChpZiAobm90IChpZGVudGljYWw/IGlucHV0IGNvZGUpKVxuICAgICAgICAocHJvZ25cbiAgICAgICAgICAoc2V0cSBpbnB1dFxuICAgICAgICAgICAgKGlmIChub3QgKGlkZW50aWNhbD8gKGxhc3QgY29kZSkgXCJcXG5cIikpXG4gICAgICAgICAgICAgIChzdWJzIGNvZGUgMCAoLSAoY291bnQgY29kZSkgMSkpXG4gICAgICAgICAgICAgIGNvZGUpKVxuICAgICAgICAgIChzZXRxIG91dHB1dCAoZXZhbHVhdGUtY29kZSBpbnB1dCBmaWxlIGNvbnRleHQpKVxuICAgICAgICAgIChjYWxsYmFjayAoOmVycm9yIG91dHB1dCkgKDp2YWx1ZSBvdXRwdXQpKSlcbiAgICAgICAgKGNhbGxiYWNrICg6ZXJyb3Igb3V0cHV0KSkpKSkpXG5cbihkZWZ1biBzdGFydFxuICAoKVxuICBcIlN0YXJ0cyByZXBsXCJcbiAgKGxldCogKChzZXNzaW9uICguc3RhcnQgcmVwbFxuICAgICAgICAgICAgICAgICAgICAgICAgezp3cml0ZXIgcHItc3RyXG4gICAgICAgICAgICAgICAgICAgICAgICAgOnByb21wdCBcIj0+IFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgOmlnbm9yZVVuZGVmaW5lZCB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgOnVzZUdsb2JhbCBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgIDpldmFsIGV2YWx1YXRlfSkpXG4gICAgICAgIChjb250ZXh0ICguLWNvbnRleHQgc2Vzc2lvbikpKVxuICAgIDsgaG9pc3Qgd2lzcCBidWlsdGlucyBpbnRvIHRoZSByZXBsXG4gICAgKC5tYXAgW1wicnVudGltZVwiIFwic2VxdWVuY2VcIiBcInN0cmluZ1wiXVxuICAgICAgICAgIChsYW1iZGEgKG4pXG4gICAgICAgICAgICAobGV0KiAoKGYgKHJlcXVpcmUgKHN0ciBcIi4vc3JjL1wiIG4gXCIud2lzcFwiKSkpKVxuICAgICAgICAgICAgICAoLm1hcCAoa2V5cyBmKVxuICAgICAgICAgICAgICAgICAgICAobGFtYmRhIChrKSAoc2V0ZiAoZ2V0IGNvbnRleHQgaykgKGdldCBmIGspKSkpKSkpXG4gICAgKHNldGYgY29udGV4dC5leHBvcnRzIHt9KVxuICAgIHNlc3Npb24pKVxuIl19
