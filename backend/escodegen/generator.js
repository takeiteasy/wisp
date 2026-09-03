{
    var _ns_ = {
        id: 'wisp.backend.escodegen.generator',
        doc: null
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
        var astø1 = write_.apply(null, nodes);
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
        var fnø1 = withMeta(list.apply(null, [symbol(null, 'defun')].concat([id], vec(body))), meta(_andForm));
        var formø1 = list.apply(null, [symbol(null, 'progn')].concat([fnø1], [id]));
        var astø1 = analyze(formø1);
        var codeø1 = compile(astø1);
        var macroø1 = eval(codeø1);
        installMacro(id, macroø1);
        return null;
    }.call(this);
};
installMacro(symbol(null, 'defmacro'), withMeta(expandDefmacro, { 'implicit': ['&form'] }));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndpc3AvYmFja2VuZC9lc2NvZGVnZW4vZ2VuZXJhdG9yLndpc3AiXSwibmFtZXMiOlsiX25zXyIsImlkIiwiZG9jIiwicmVhZFN0cmluZyIsInJlYWRGcm9tU3RyaW5nIiwicmVhZF8iLCJtZXRhIiwid2l0aE1ldGEiLCJpc1N5bWJvbCIsInN5bWJvbCIsImlzS2V5d29yZCIsImtleXdvcmQiLCJuYW1lc3BhY2UiLCJpc1VucXVvdGUiLCJpc1VucXVvdGVTcGxpY2luZyIsImlzUXVvdGUiLCJpc1N5bnRheFF1b3RlIiwibmFtZSIsImdlbnN5bSIsInByU3RyIiwiaXNFbXB0eSIsImNvdW50IiwiaXNMaXN0IiwibGlzdCIsImZpcnN0Iiwic2Vjb25kIiwidGhpcmQiLCJyZXN0IiwiY29ucyIsImNvbmoiLCJidXRsYXN0IiwicmV2ZXJzZSIsInJlZHVjZSIsInZlYyIsImxhc3QiLCJtYXAiLCJmaWx0ZXIiLCJ0YWtlIiwiY29uY2F0IiwicGFydGl0aW9uIiwicmVwZWF0IiwiaW50ZXJsZWF2ZSIsImlzT2RkIiwiaXNEaWN0aW9uYXJ5IiwiZGljdGlvbmFyeSIsIm1lcmdlIiwia2V5cyIsInZhbHMiLCJpc0NvbnRhaW5zVmVjdG9yIiwibWFwRGljdGlvbmFyeSIsImlzU3RyaW5nIiwiaXNOdW1iZXIiLCJpc1ZlY3RvciIsImlzQm9vbGVhbiIsInN1YnMiLCJyZUZpbmQiLCJpc1RydWUiLCJpc0ZhbHNlIiwiaXNOaWwiLCJpc1JlUGF0dGVybiIsImluYyIsImRlYyIsInN0ciIsImNoYXIiLCJpbnQiLCJpc0VxdWFsIiwiaXNTdHJpY3RFcXVhbCIsInNwbGl0Iiwiam9pbiIsInVwcGVyQ2FzZSIsInJlcGxhY2UiLCJpbnN0YWxsTWFjcm8iLCJlbXB0eUVudiIsImFuYWx5emUiLCJhbmFseXplXyIsIndyaXRlIiwiY29tcGlsZSIsIndyaXRlXyIsImdlbmVyYXRlXyIsImdlbmVyYXRlIiwicmVhZEZpbGVTeW5jIiwid3JpdGVGaWxlU3luYyIsImJhc2VuYW1lIiwiZGlybmFtZSIsImpvaW5QYXRoIiwiZXhwb3J0cyIsIm9wdGlvbnMiLCJub2RlcyIsImFzdMO4MSIsIm91dHB1dMO4MSIsInNldFNvdXJjZUNvbnRlbnQiLCJidG9hIiwiZXhwYW5kRGVmbWFjcm8iLCJfYW5kRm9ybSIsImJvZHkiLCJmbsO4MSIsImZvcm3DuDEiLCJjb2Rlw7gxIiwibWFjcm/DuDEiLCJldmFsIl0sIm1hcHBpbmdzIjoiO0lBQUEsSUFBQ0EsSSxHQUFEO0FBQUEsUUFBQUMsRSxFQUFJLGtDQUFKO0FBQUEsUUFBQUMsRyxFQUFBO0FBQUEsTTs7UUFFbURDLFVBQUEsRyxZQURsQkMsYztRQUFpQkMsS0FBQSxHLFlBQUFBLEs7O1FBRXBCQyxJQUFBLEcsU0FBQUEsSTtRQUFLQyxRQUFBLEcsU0FBQUEsUTtRQUFVQyxRQUFBLEcsU0FBQUEsUTtRQUFRQyxNQUFBLEcsU0FBQUEsTTtRQUFPQyxTQUFBLEcsU0FBQUEsUztRQUFTQyxPQUFBLEcsU0FBQUEsTztRQUN2Q0MsU0FBQSxHLFNBQUFBLFM7UUFBVUMsU0FBQSxHLFNBQUFBLFM7UUFBU0MsaUJBQUEsRyxTQUFBQSxpQjtRQUFrQkMsT0FBQSxHLFNBQUFBLE87UUFDckNDLGFBQUEsRyxTQUFBQSxhO1FBQWNDLElBQUEsRyxTQUFBQSxJO1FBQUtDLE1BQUEsRyxTQUFBQSxNO1FBQU9DLEtBQUEsRyxTQUFBQSxLOztRQUNyQkMsT0FBQSxHLGNBQUFBLE87UUFBT0MsS0FBQSxHLGNBQUFBLEs7UUFBTUMsTUFBQSxHLGNBQUFBLE07UUFBTUMsSUFBQSxHLGNBQUFBLEk7UUFBS0MsS0FBQSxHLGNBQUFBLEs7UUFBTUMsTUFBQSxHLGNBQUFBLE07UUFBT0MsS0FBQSxHLGNBQUFBLEs7UUFDckNDLElBQUEsRyxjQUFBQSxJO1FBQUtDLElBQUEsRyxjQUFBQSxJO1FBQUtDLElBQUEsRyxjQUFBQSxJO1FBQUtDLE9BQUEsRyxjQUFBQSxPO1FBQVFDLE9BQUEsRyxjQUFBQSxPO1FBQVFDLE1BQUEsRyxjQUFBQSxNO1FBQU9DLEdBQUEsRyxjQUFBQSxH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QUEwQkEsSUFBT0ksY0FBQSxHQUFBUCxPQUFBLENBQUFPLGNBQUEsR0FBUCxTQUFPQSxjQUFQLENBQ0dDLFFBREgsRUFDUzVGLEVBRFQsRTtRQUNrQjZGLElBQUEsRztJQUloQixPO1FBQVEsSUFBQUMsSSxHQUFJeEYsUUFBRCxDLFVBQVcsQyxJQUFBLEUsT0FBRSxDLElBQUEsRSxPQUFBLEMsVUFBT04sRSxPQUFLNkYsSSxFQUFkLENBQVgsRUFBZ0N4RixJQUFELENBQU11RixRQUFOLENBQS9CLENBQUgsQztRQUNELElBQUFHLE0sYUFBSyxDLElBQUEsRSxPQUFFLEMsSUFBQSxFLE9BQUEsQyxVQUFPRCxJLElBQUk5RixFLEVBQWIsQ0FBTCxDO1FBQ0EsSUFBQXVGLEssR0FBS2YsT0FBRCxDQUFTdUIsTUFBVCxDQUFKLEM7UUFDQSxJQUFBQyxNLEdBQU1yQixPQUFELENBQVNZLEtBQVQsQ0FBTCxDO1FBQ0EsSUFBQVUsTyxHQUFPQyxJQUFELENBQU1GLE1BQU4sQ0FBTixDO1FBQ0oxQixZQUFELENBQWdCdEUsRUFBaEIsRUFBbUJpRyxPQUFuQixFOztVQUxGLEMsSUFBQSxFO0NBTEYsQztBQVlDM0IsWUFBRCxDLE1BQWlCLEMsSUFBQSxFLFVBQUEsQ0FBakIsRUFBMkJoRSxRQUFELENBQVdxRixjQUFYLEVBQTJCLEUsWUFBVyxDLE9BQUEsQ0FBWCxFQUEzQixDQUExQiIsInNvdXJjZXNDb250ZW50IjpbIihucyB3aXNwLmJhY2tlbmQuZXNjb2RlZ2VuLmdlbmVyYXRvclxuICAoOnJlcXVpcmUgW3dpc3AucmVhZGVyIDpyZWZlciBbcmVhZC1mcm9tLXN0cmluZyByZWFkKl1cbiAgICAgICAgICAgICAgICAgICAgICAgICA6cmVuYW1lIHtyZWFkLWZyb20tc3RyaW5nIHJlYWQtc3RyaW5nfV1cbiAgICAgICAgICAgIFt3aXNwLmFzdCA6cmVmZXIgW21ldGEgd2l0aC1tZXRhIHN5bWJvbD8gc3ltYm9sIGtleXdvcmQ/IGtleXdvcmRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWVzcGFjZSB1bnF1b3RlPyB1bnF1b3RlLXNwbGljaW5nPyBxdW90ZT9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN5bnRheC1xdW90ZT8gbmFtZSBnZW5zeW0gcHItc3RyXV1cbiAgICAgICAgICAgIFt3aXNwLnNlcXVlbmNlIDpyZWZlciBbZW1wdHk/IGNvdW50IGxpc3Q/IGxpc3QgZmlyc3Qgc2Vjb25kIHRoaXJkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3QgY29ucyBjb25qIGJ1dGxhc3QgcmV2ZXJzZSByZWR1Y2UgdmVjXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3QgbWFwIGZpbHRlciB0YWtlIGNvbmNhdCBwYXJ0aXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVwZWF0IGludGVybGVhdmVdXVxuICAgICAgICAgICAgW3dpc3AucnVudGltZSA6cmVmZXIgW29kZD8gZGljdGlvbmFyeT8gZGljdGlvbmFyeSBtZXJnZSBrZXlzIHZhbHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250YWlucy12ZWN0b3I/IG1hcC1kaWN0aW9uYXJ5IHN0cmluZz9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBudW1iZXI/IHZlY3Rvcj8gYm9vbGVhbj8gc3VicyByZS1maW5kIHRydWU/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFsc2U/IG5pbD8gcmUtcGF0dGVybj8gaW5jIGRlYyBzdHIgY2hhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludCA9ID09XV1cbiAgICAgICAgICAgIFt3aXNwLnN0cmluZyA6cmVmZXIgW3NwbGl0IGpvaW4gdXBwZXItY2FzZSByZXBsYWNlXV1cbiAgICAgICAgICAgIFt3aXNwLmV4cGFuZGVyIDpyZWZlciBbaW5zdGFsbC1tYWNybyFdXVxuICAgICAgICAgICAgW3dpc3AuYW5hbHl6ZXIgOnJlZmVyIFtlbXB0eS1lbnYgYW5hbHl6ZSBhbmFseXplKl1dXG4gICAgICAgICAgICBbd2lzcC5iYWNrZW5kLmVzY29kZWdlbi53cml0ZXIgOnJlZmVyIFt3cml0ZSBjb21waWxlIHdyaXRlKl1dXG5cbiAgICAgICAgICAgIFtlc2NvZGVnZW4gOnJlZmVyIFtnZW5lcmF0ZV0gOnJlbmFtZSB7Z2VuZXJhdGUgZ2VuZXJhdGUqfV1cbiAgICAgICAgICAgIFtiYXNlNjQtZW5jb2RlIDphcyBidG9hXVxuICAgICAgICAgICAgW2ZzIDpyZWZlciBbcmVhZC1maWxlLXN5bmMgd3JpdGUtZmlsZS1zeW5jXV1cbiAgICAgICAgICAgIFtwYXRoIDpyZWZlciBbYmFzZW5hbWUgZGlybmFtZSBqb2luXVxuICAgICAgICAgICAgICAgICAgOnJlbmFtZSB7am9pbiBqb2luLXBhdGh9XSkpXG5cbihkZWZ1biBnZW5lcmF0ZVxuICAob3B0aW9ucyAmcmVzdCBub2RlcylcbiAgKGxldCogKChhc3QgKGFwcGx5IHdyaXRlKiBub2RlcykpXG5cbiAgICAgICAgKG91dHB1dCAoZ2VuZXJhdGUqIGFzdCB7OmZpbGUgKDpvdXRwdXQtdXJpIG9wdGlvbnMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnNvdXJjZUNvbnRlbnQgKDpzb3VyY2Ugb3B0aW9ucylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6c291cmNlTWFwICg6c291cmNlLXVyaSBvcHRpb25zKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpzb3VyY2VNYXBSb290ICg6c291cmNlLXJvb3Qgb3B0aW9ucylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6c291cmNlTWFwV2l0aENvZGUgdHJ1ZX0pKSlcblxuICAgIDs7IFdvcmthcm91bmQgdGhlIGZhY3QgdGhhdCBlc2NvZGVnZW4gZG9lcyBub3QgeWV0IGluY2x1ZGVzIHNvdXJjZVxuICAgICguc2V0U291cmNlQ29udGVudCAoOm1hcCBvdXRwdXQpXG4gICAgICAgICAgICAgICAgICAgICAgICg6c291cmNlLXVyaSBvcHRpb25zKVxuICAgICAgICAgICAgICAgICAgICAgICAoOnNvdXJjZSBvcHRpb25zKSlcblxuICAgIHs6Y29kZSAoaWYgKDpuby1tYXAgb3B0aW9ucylcbiAgICAgICAgICAgICAoOmNvZGUgb3V0cHV0KVxuICAgICAgICAgICAgIChzdHIgKDpjb2RlIG91dHB1dClcbiAgICAgICAgICAgICAgICAgIFwiXFxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9XCJcbiAgICAgICAgICAgICAgICAgIFwiZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIlxuICAgICAgICAgICAgICAgICAgKGJ0b2EgKHN0ciAoOm1hcCBvdXRwdXQpKSlcbiAgICAgICAgICAgICAgICAgIFwiXFxuXCIpKVxuICAgICA6c291cmNlLW1hcCAoOm1hcCBvdXRwdXQpXG4gICAgIDpqcy1hc3QgYXN0fSkpXG5cblxuKGRlZnVuIGV4cGFuZC1kZWZtYWNyb1xuICAoJmZvcm0gaWQgJnJlc3QgYm9keSlcbiAgXCJMaWtlIGRlZnVuLCBidXQgdGhlIHJlc3VsdGluZyBmdW5jdGlvbiBuYW1lIGlzIGRlY2xhcmVkIGFzIGFcbiAgbWFjcm8gYW5kIHdpbGwgYmUgdXNlZCBhcyBhIG1hY3JvIGJ5IHRoZSBjb21waWxlciB3aGVuIGl0IGlzXG4gIGNhbGxlZC5cIlxuICAobGV0KiAoKGZuICh3aXRoLW1ldGEgYChkZWZ1biAsaWQgLEBib2R5KSAobWV0YSAmZm9ybSkpKVxuICAgICAgICAoZm9ybSBgKHByb2duICxmbiAsaWQpKVxuICAgICAgICAoYXN0IChhbmFseXplIGZvcm0pKVxuICAgICAgICAoY29kZSAoY29tcGlsZSBhc3QpKVxuICAgICAgICAobWFjcm8gKGV2YWwgY29kZSkpKVxuICAgIChpbnN0YWxsLW1hY3JvISBpZCBtYWNybylcbiAgICBuaWwpKVxuKGluc3RhbGwtbWFjcm8hICdkZWZtYWNybyAod2l0aC1tZXRhIGV4cGFuZC1kZWZtYWNybyB7OmltcGxpY2l0IFs6JmZvcm1dfSkpXG4iXX0=
