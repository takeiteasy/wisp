{
    var _ns_ = {
            id: 'wisp.backend.escodegen.generator',
            doc: void 0
        };
    var wisp_reader = require('./../../reader');
    var readString = wisp_reader.readFromString;
    var read_ = wisp_reader.read_;
    var wisp_ast = require('./../../ast');
    var meta = wisp_ast.meta;
    var withMeta = wisp_ast.withMeta;
    var isSymbol = wisp_ast.isSymbol;
    var symbol = wisp_ast.symbol;
    var isKeyword = wisp_ast.isKeyword;
    var keyword = wisp_ast.keyword;
    var namespace = wisp_ast.namespace;
    var isUnquote = wisp_ast.isUnquote;
    var isUnquoteSplicing = wisp_ast.isUnquoteSplicing;
    var isQuote = wisp_ast.isQuote;
    var isSyntaxQuote = wisp_ast.isSyntaxQuote;
    var name = wisp_ast.name;
    var gensym = wisp_ast.gensym;
    var prStr = wisp_ast.prStr;
    var wisp_sequence = require('./../../sequence');
    var isEmpty = wisp_sequence.isEmpty;
    var count = wisp_sequence.count;
    var isList = wisp_sequence.isList;
    var list = wisp_sequence.list;
    var first = wisp_sequence.first;
    var second = wisp_sequence.second;
    var third = wisp_sequence.third;
    var rest = wisp_sequence.rest;
    var cons = wisp_sequence.cons;
    var conj = wisp_sequence.conj;
    var butlast = wisp_sequence.butlast;
    var reverse = wisp_sequence.reverse;
    var reduce = wisp_sequence.reduce;
    var vec = wisp_sequence.vec;
    var last = wisp_sequence.last;
    var map = wisp_sequence.map;
    var filter = wisp_sequence.filter;
    var take = wisp_sequence.take;
    var concat = wisp_sequence.concat;
    var partition = wisp_sequence.partition;
    var repeat = wisp_sequence.repeat;
    var interleave = wisp_sequence.interleave;
    var wisp_runtime = require('./../../runtime');
    var isOdd = wisp_runtime.isOdd;
    var isDictionary = wisp_runtime.isDictionary;
    var dictionary = wisp_runtime.dictionary;
    var merge = wisp_runtime.merge;
    var keys = wisp_runtime.keys;
    var vals = wisp_runtime.vals;
    var isContainsVector = wisp_runtime.isContainsVector;
    var mapDictionary = wisp_runtime.mapDictionary;
    var isString = wisp_runtime.isString;
    var isNumber = wisp_runtime.isNumber;
    var isVector = wisp_runtime.isVector;
    var isBoolean = wisp_runtime.isBoolean;
    var subs = wisp_runtime.subs;
    var reFind = wisp_runtime.reFind;
    var isTrue = wisp_runtime.isTrue;
    var isFalse = wisp_runtime.isFalse;
    var isNil = wisp_runtime.isNil;
    var isRePattern = wisp_runtime.isRePattern;
    var inc = wisp_runtime.inc;
    var dec = wisp_runtime.dec;
    var str = wisp_runtime.str;
    var char = wisp_runtime.char;
    var int = wisp_runtime.int;
    var isEqual = wisp_runtime.isEqual;
    var isStrictEqual = wisp_runtime.isStrictEqual;
    var wisp_string = require('./../../string');
    var split = wisp_string.split;
    var join = wisp_string.join;
    var upperCase = wisp_string.upperCase;
    var replace = wisp_string.replace;
    var wisp_expander = require('./../../expander');
    var installMacro = wisp_expander.installMacro;
    var wisp_analyzer = require('./../../analyzer');
    var emptyEnv = wisp_analyzer.emptyEnv;
    var analyze = wisp_analyzer.analyze;
    var analyze_ = wisp_analyzer.analyze_;
    var wisp_backend_escodegen_writer = require('./writer');
    var write = wisp_backend_escodegen_writer.write;
    var compile = wisp_backend_escodegen_writer.compile;
    var write_ = wisp_backend_escodegen_writer.write_;
    var escodegen = require('escodegen');
    var generate_ = escodegen.generate;
    var base64Encode = require('base64-encode');
    var btoa = base64Encode;
    var fs = require('fs');
    var readFileSync = fs.readFileSync;
    var writeFileSync = fs.writeFileSync;
    var path = require('path');
    var basename = path.basename;
    var dirname = path.dirname;
    var joinPath = path.join;
}
var generate = exports.generate = function generate(options) {
        var nodes = Array.prototype.slice.call(arguments, 1);
        return function () {
            var astø1 = write_.apply(void 0, nodes);
            var outputø1 = generate_(astø1, {
                    'file': (options || 0)['output-uri'],
                    'sourceContent': (options || 0)['source'],
                    'sourceMap': (options || 0)['source-uri'],
                    'sourceMapRoot': (options || 0)['source-root'],
                    'sourceMapWithCode': true
                });
            (outputø1 || 0)['map'].setSourceContent((options || 0)['source-uri'], (options || 0)['source']);
            return {
                'code': (options || 0)['no-map'] ? (outputø1 || 0)['code'] : '' + (outputø1 || 0)['code'] + '\n//# sourceMappingURL=' + 'data:application/json;base64,' + btoa('' + (outputø1 || 0)['map']) + '\n',
                'source-map': (outputø1 || 0)['map'],
                'js-ast': astø1
            };
        }.call(this);
    };
var expandDefmacro = exports.expandDefmacro = function expandDefmacro(_andForm, id) {
        var body = Array.prototype.slice.call(arguments, 2);
        return function () {
            var fnø1 = withMeta(list.apply(void 0, [symbol(void 0, 'defn')].concat([id], vec(body))), meta(_andForm));
            var formø1 = list.apply(void 0, [symbol(void 0, 'do')].concat([fnø1], [id]));
            var astø1 = analyze(formø1);
            var codeø1 = compile(astø1);
            var macroø1 = eval(codeø1);
            installMacro(id, macroø1);
            return void 0;
        }.call(this);
    };
installMacro(symbol(void 0, 'defmacro'), withMeta(expandDefmacro, { 'implicit': ['&form'] }));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndpc3AvYmFja2VuZC9lc2NvZGVnZW4vZ2VuZXJhdG9yLndpc3AiXSwibmFtZXMiOlsiX25zXyIsImlkIiwiZG9jIiwicmVhZFN0cmluZyIsInJlYWRGcm9tU3RyaW5nIiwicmVhZF8iLCJtZXRhIiwid2l0aE1ldGEiLCJpc1N5bWJvbCIsInN5bWJvbCIsImlzS2V5d29yZCIsImtleXdvcmQiLCJuYW1lc3BhY2UiLCJpc1VucXVvdGUiLCJpc1VucXVvdGVTcGxpY2luZyIsImlzUXVvdGUiLCJpc1N5bnRheFF1b3RlIiwibmFtZSIsImdlbnN5bSIsInByU3RyIiwiaXNFbXB0eSIsImNvdW50IiwiaXNMaXN0IiwibGlzdCIsImZpcnN0Iiwic2Vjb25kIiwidGhpcmQiLCJyZXN0IiwiY29ucyIsImNvbmoiLCJidXRsYXN0IiwicmV2ZXJzZSIsInJlZHVjZSIsInZlYyIsImxhc3QiLCJtYXAiLCJmaWx0ZXIiLCJ0YWtlIiwiY29uY2F0IiwicGFydGl0aW9uIiwicmVwZWF0IiwiaW50ZXJsZWF2ZSIsImlzT2RkIiwiaXNEaWN0aW9uYXJ5IiwiZGljdGlvbmFyeSIsIm1lcmdlIiwia2V5cyIsInZhbHMiLCJpc0NvbnRhaW5zVmVjdG9yIiwibWFwRGljdGlvbmFyeSIsImlzU3RyaW5nIiwiaXNOdW1iZXIiLCJpc1ZlY3RvciIsImlzQm9vbGVhbiIsInN1YnMiLCJyZUZpbmQiLCJpc1RydWUiLCJpc0ZhbHNlIiwiaXNOaWwiLCJpc1JlUGF0dGVybiIsImluYyIsImRlYyIsInN0ciIsImNoYXIiLCJpbnQiLCJpc0VxdWFsIiwiaXNTdHJpY3RFcXVhbCIsInNwbGl0Iiwiam9pbiIsInVwcGVyQ2FzZSIsInJlcGxhY2UiLCJpbnN0YWxsTWFjcm8iLCJlbXB0eUVudiIsImFuYWx5emUiLCJhbmFseXplXyIsIndyaXRlIiwiY29tcGlsZSIsIndyaXRlXyIsImdlbmVyYXRlXyIsImdlbmVyYXRlIiwicmVhZEZpbGVTeW5jIiwid3JpdGVGaWxlU3luYyIsImJhc2VuYW1lIiwiZGlybmFtZSIsImpvaW5QYXRoIiwiZXhwb3J0cyIsIm9wdGlvbnMiLCJub2RlcyIsImFzdMO4MSIsIm91dHB1dMO4MSIsInNldFNvdXJjZUNvbnRlbnQiLCJidG9hIiwiZXhwYW5kRGVmbWFjcm8iLCJfYW5kRm9ybSIsImJvZHkiLCJmbsO4MSIsImZvcm3DuDEiLCJjb2Rlw7gxIiwibWFjcm/DuDEiLCJldmFsIl0sIm1hcHBpbmdzIjoiO0lBQUEsSUFBQ0EsSSxHQUFEO0FBQUEsWUFBQUMsRSxFQUFJLGtDQUFKO0FBQUEsWUFBQUMsRyxFQUFBLEssQ0FBQTtBQUFBLFU7O1FBRW1EQyxVQUFBLEcsWUFEbEJDLGM7UUFBaUJDLEtBQUEsRyxZQUFBQSxLOztRQUVwQkMsSUFBQSxHLFNBQUFBLEk7UUFBS0MsUUFBQSxHLFNBQUFBLFE7UUFBVUMsUUFBQSxHLFNBQUFBLFE7UUFBUUMsTUFBQSxHLFNBQUFBLE07UUFBT0MsU0FBQSxHLFNBQUFBLFM7UUFBU0MsT0FBQSxHLFNBQUFBLE87UUFDdkNDLFNBQUEsRyxTQUFBQSxTO1FBQVVDLFNBQUEsRyxTQUFBQSxTO1FBQVNDLGlCQUFBLEcsU0FBQUEsaUI7UUFBa0JDLE9BQUEsRyxTQUFBQSxPO1FBQ3JDQyxhQUFBLEcsU0FBQUEsYTtRQUFjQyxJQUFBLEcsU0FBQUEsSTtRQUFLQyxNQUFBLEcsU0FBQUEsTTtRQUFPQyxLQUFBLEcsU0FBQUEsSzs7UUFDckJDLE9BQUEsRyxjQUFBQSxPO1FBQU9DLEtBQUEsRyxjQUFBQSxLO1FBQU1DLE1BQUEsRyxjQUFBQSxNO1FBQU1DLElBQUEsRyxjQUFBQSxJO1FBQUtDLEtBQUEsRyxjQUFBQSxLO1FBQU1DLE1BQUEsRyxjQUFBQSxNO1FBQU9DLEtBQUEsRyxjQUFBQSxLO1FBQ3JDQyxJQUFBLEcsY0FBQUEsSTtRQUFLQyxJQUFBLEcsY0FBQUEsSTtRQUFLQyxJQUFBLEcsY0FBQUEsSTtRQUFLQyxPQUFBLEcsY0FBQUEsTztRQUFRQyxPQUFBLEcsY0FBQUEsTztRQUFRQyxNQUFBLEcsY0FBQUEsTTtRQUFPQyxHQUFBLEcs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TixDLElBQUEsRTtLQUZGLEM7QUEwQkEsSUFBTUksY0FBQSxHQUFBUCxPQUFBLENBQUFPLGNBQUEsR0FBTixTQUFNQSxjQUFOLENBSUdDLFFBSkgsRUFJUzVGLEVBSlQsRTtZQUljNkYsSUFBQSxHO1FBQ1osTztZQUFNLElBQUFDLEksR0FBSXhGLFFBQUQsQyxVQUFXLEMsTUFBQSxFLE9BQUUsQyxNQUFBLEUsTUFBQSxDLFVBQU1OLEUsT0FBSzZGLEksRUFBYixDQUFYLEVBQStCeEYsSUFBRCxDQUFNdUYsUUFBTixDQUE5QixDQUFILEM7WUFDQSxJQUFBRyxNLGFBQUssQyxNQUFBLEUsT0FBRSxDLE1BQUEsRSxJQUFBLEMsVUFBSUQsSSxJQUFJOUYsRSxFQUFWLENBQUwsQztZQUNBLElBQUF1RixLLEdBQUtmLE9BQUQsQ0FBU3VCLE1BQVQsQ0FBSixDO1lBQ0EsSUFBQUMsTSxHQUFNckIsT0FBRCxDQUFTWSxLQUFULENBQUwsQztZQUNBLElBQUFVLE8sR0FBT0MsSUFBRCxDQUFNRixNQUFOLENBQU4sQztZQUNIMUIsWUFBRCxDQUFnQnRFLEVBQWhCLEVBQW1CaUcsT0FBbkIsRTs7Y0FMRixDLElBQUEsRTtLQUxGLEM7QUFZQzNCLFlBQUQsQyxNQUFpQixDLE1BQUEsRSxVQUFBLENBQWpCLEVBQTJCaEUsUUFBRCxDQUFXcUYsY0FBWCxFQUEyQixFLFlBQVcsQyxPQUFBLENBQVgsRUFBM0IsQ0FBMUIiLCJzb3VyY2VzQ29udGVudCI6WyIobnMgd2lzcC5iYWNrZW5kLmVzY29kZWdlbi5nZW5lcmF0b3JcbiAgKDpyZXF1aXJlIFt3aXNwLnJlYWRlciA6cmVmZXIgW3JlYWQtZnJvbS1zdHJpbmcgcmVhZCpdXG4gICAgICAgICAgICAgICAgICAgICAgICAgOnJlbmFtZSB7cmVhZC1mcm9tLXN0cmluZyByZWFkLXN0cmluZ31dXG4gICAgICAgICAgICBbd2lzcC5hc3QgOnJlZmVyIFttZXRhIHdpdGgtbWV0YSBzeW1ib2w/IHN5bWJvbCBrZXl3b3JkPyBrZXl3b3JkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lc3BhY2UgdW5xdW90ZT8gdW5xdW90ZS1zcGxpY2luZz8gcXVvdGU/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzeW50YXgtcXVvdGU/IG5hbWUgZ2Vuc3ltIHByLXN0cl1dXG4gICAgICAgICAgICBbd2lzcC5zZXF1ZW5jZSA6cmVmZXIgW2VtcHR5PyBjb3VudCBsaXN0PyBsaXN0IGZpcnN0IHNlY29uZCB0aGlyZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN0IGNvbnMgY29uaiBidXRsYXN0IHJldmVyc2UgcmVkdWNlIHZlY1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0IG1hcCBmaWx0ZXIgdGFrZSBjb25jYXQgcGFydGl0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcGVhdCBpbnRlcmxlYXZlXV1cbiAgICAgICAgICAgIFt3aXNwLnJ1bnRpbWUgOnJlZmVyIFtvZGQ/IGRpY3Rpb25hcnk/IGRpY3Rpb25hcnkgbWVyZ2Uga2V5cyB2YWxzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGFpbnMtdmVjdG9yPyBtYXAtZGljdGlvbmFyeSBzdHJpbmc/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVtYmVyPyB2ZWN0b3I/IGJvb2xlYW4/IHN1YnMgcmUtZmluZCB0cnVlP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhbHNlPyBuaWw/IHJlLXBhdHRlcm4/IGluYyBkZWMgc3RyIGNoYXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnQgPSA9PV1dXG4gICAgICAgICAgICBbd2lzcC5zdHJpbmcgOnJlZmVyIFtzcGxpdCBqb2luIHVwcGVyLWNhc2UgcmVwbGFjZV1dXG4gICAgICAgICAgICBbd2lzcC5leHBhbmRlciA6cmVmZXIgW2luc3RhbGwtbWFjcm8hXV1cbiAgICAgICAgICAgIFt3aXNwLmFuYWx5emVyIDpyZWZlciBbZW1wdHktZW52IGFuYWx5emUgYW5hbHl6ZSpdXVxuICAgICAgICAgICAgW3dpc3AuYmFja2VuZC5lc2NvZGVnZW4ud3JpdGVyIDpyZWZlciBbd3JpdGUgY29tcGlsZSB3cml0ZSpdXVxuXG4gICAgICAgICAgICBbZXNjb2RlZ2VuIDpyZWZlciBbZ2VuZXJhdGVdIDpyZW5hbWUge2dlbmVyYXRlIGdlbmVyYXRlKn1dXG4gICAgICAgICAgICBbYmFzZTY0LWVuY29kZSA6YXMgYnRvYV1cbiAgICAgICAgICAgIFtmcyA6cmVmZXIgW3JlYWQtZmlsZS1zeW5jIHdyaXRlLWZpbGUtc3luY11dXG4gICAgICAgICAgICBbcGF0aCA6cmVmZXIgW2Jhc2VuYW1lIGRpcm5hbWUgam9pbl1cbiAgICAgICAgICAgICAgICAgIDpyZW5hbWUge2pvaW4gam9pbi1wYXRofV0pKVxuXG4oZGVmbiBnZW5lcmF0ZVxuICBbb3B0aW9ucyAmIG5vZGVzXVxuICAobGV0IFthc3QgKGFwcGx5IHdyaXRlKiBub2RlcylcblxuICAgICAgICBvdXRwdXQgKGdlbmVyYXRlKiBhc3QgezpmaWxlICg6b3V0cHV0LXVyaSBvcHRpb25zKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpzb3VyY2VDb250ZW50ICg6c291cmNlIG9wdGlvbnMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnNvdXJjZU1hcCAoOnNvdXJjZS11cmkgb3B0aW9ucylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6c291cmNlTWFwUm9vdCAoOnNvdXJjZS1yb290IG9wdGlvbnMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnNvdXJjZU1hcFdpdGhDb2RlIHRydWV9KV1cblxuICAgIDs7IFdvcmthcm91bmQgdGhlIGZhY3QgdGhhdCBlc2NvZGVnZW4gZG9lcyBub3QgeWV0IGluY2x1ZGVzIHNvdXJjZVxuICAgICguc2V0U291cmNlQ29udGVudCAoOm1hcCBvdXRwdXQpXG4gICAgICAgICAgICAgICAgICAgICAgICg6c291cmNlLXVyaSBvcHRpb25zKVxuICAgICAgICAgICAgICAgICAgICAgICAoOnNvdXJjZSBvcHRpb25zKSlcblxuICAgIHs6Y29kZSAoaWYgKDpuby1tYXAgb3B0aW9ucylcbiAgICAgICAgICAgICAoOmNvZGUgb3V0cHV0KVxuICAgICAgICAgICAgIChzdHIgKDpjb2RlIG91dHB1dClcbiAgICAgICAgICAgICAgICAgIFwiXFxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9XCJcbiAgICAgICAgICAgICAgICAgIFwiZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIlxuICAgICAgICAgICAgICAgICAgKGJ0b2EgKHN0ciAoOm1hcCBvdXRwdXQpKSlcbiAgICAgICAgICAgICAgICAgIFwiXFxuXCIpKVxuICAgICA6c291cmNlLW1hcCAoOm1hcCBvdXRwdXQpXG4gICAgIDpqcy1hc3QgYXN0fSkpXG5cblxuKGRlZm4gZXhwYW5kLWRlZm1hY3JvXG4gIFwiTGlrZSBkZWZuLCBidXQgdGhlIHJlc3VsdGluZyBmdW5jdGlvbiBuYW1lIGlzIGRlY2xhcmVkIGFzIGFcbiAgbWFjcm8gYW5kIHdpbGwgYmUgdXNlZCBhcyBhIG1hY3JvIGJ5IHRoZSBjb21waWxlciB3aGVuIGl0IGlzXG4gIGNhbGxlZC5cIlxuICBbJmZvcm0gaWQgJiBib2R5XVxuICAobGV0IFtmbiAod2l0aC1tZXRhIGAoZGVmbiB+aWQgfkBib2R5KSAobWV0YSAmZm9ybSkpXG4gICAgICAgIGZvcm0gYChkbyB+Zm4gfmlkKVxuICAgICAgICBhc3QgKGFuYWx5emUgZm9ybSlcbiAgICAgICAgY29kZSAoY29tcGlsZSBhc3QpXG4gICAgICAgIG1hY3JvIChldmFsIGNvZGUpXVxuICAgIChpbnN0YWxsLW1hY3JvISBpZCBtYWNybylcbiAgICBuaWwpKVxuKGluc3RhbGwtbWFjcm8hICdkZWZtYWNybyAod2l0aC1tZXRhIGV4cGFuZC1kZWZtYWNybyB7OmltcGxpY2l0IFs6JmZvcm1dfSkpXG4iXX0=
