{
    var _ns_ = {
            id: 'wisp.wisp',
            doc: 'Wisp program that reads wisp code from stdin and prints\n  compiled javascript code into stdout'
        };
    var fs = require('fs');
    var createReadStream = fs.createReadStream;
    var path = require('path');
    var basename = path.basename;
    var dirname = path.dirname;
    var join = path.join;
    var resolve = path.resolve;
    var module = require('module');
    var Module = module.Module;
    var commander = require('commander');
    var wisp_package = require('./package');
    var version = wisp_package.version;
    var wisp_string = require('./string');
    var split = wisp_string.split;
    var join = wisp_string.join;
    var upperCase = wisp_string.upperCase;
    var replace = wisp_string.replace;
    var wisp_sequence = require('./sequence');
    var first = wisp_sequence.first;
    var second = wisp_sequence.second;
    var last = wisp_sequence.last;
    var count = wisp_sequence.count;
    var reduce = wisp_sequence.reduce;
    var rest = wisp_sequence.rest;
    var conj = wisp_sequence.conj;
    var partition = wisp_sequence.partition;
    var assoc = wisp_sequence.assoc;
    var drop = wisp_sequence.drop;
    var isEmpty = wisp_sequence.isEmpty;
    var wisp_repl = require('./repl');
    var startRepl = wisp_repl.start;
    var wisp_engine_node = require('./engine/node');
    var wisp_runtime = require('./runtime');
    var str = wisp_runtime.str;
    var subs = wisp_runtime.subs;
    var isEqual = wisp_runtime.isEqual;
    var isNil = wisp_runtime.isNil;
    var wisp_ast = require('./ast');
    var prStr = wisp_ast.prStr;
    var name = wisp_ast.name;
    var wisp_compiler = require('./compiler');
    var compile = wisp_compiler.compile;
}
var compileStdin = exports.compileStdin = function compileStdin(options) {
        return withStreamContent(process.stdin, compileString, conj({}, options));
    };
var compileFile = exports.compileFile = function compileFile(path, options) {
        return withStreamContent(createReadStream(path), compileString, conj({ 'source-uri': path }, options));
    };
var compileString = exports.compileString = function compileString(source, options) {
        return function () {
            var channelø1 = (options || 0)['print'] || 'code';
            var outputø1 = compile(source, options);
            var contentø1 = isEqual(channelø1, 'code') ? (outputø1 || 0)['code'] : isEqual(channelø1, 'expansion') ? (outputø1 || 0)['expansion'] : 'else' ? JSON.stringify((outputø1 || 0)[channelø1], 2, 2) : void 0;
            process.stdout.write(contentø1 || 'nil');
            return (outputø1 || 0)['error'] ? (function () {
                throw outputø1.error;
            })() : void 0;
        }.call(this);
    };
var withStreamContent = exports.withStreamContent = function withStreamContent(input, resume, options) {
        return function () {
            var contentø1 = '';
            input.setEncoding('utf8');
            input.resume();
            input.on('data', function ($1) {
                return contentø1 = '' + contentø1 + $1;
            });
            return input.once('end', function () {
                return resume(contentø1, options);
            });
        }.call(this);
    };
var run = exports.run = function run(path) {
        return Module._load(resolve(path), null, true);
    };
void 0;
var parseParams = exports.parseParams = function parseParams(params) {
        return function () {
            var programø1 = new commander.Command().version(version).arguments('[args...]').usage('[options] <file ...>').option('-r, --run', 'compile and execute the file (same as wisp path/to/file.wisp)').option('-c, --compile', 'compile given file and prints to stdout').option('-i, --interactive', 'run an interactive wisp REPL (same as wisp with no params)').option('--print <format>', 'use custom print output `expansion`,`forms`, `ast`, `js-ast` or (default) `code`', function (x, _) {
                    return '' + x;
                }).option('--no-map', 'disable source map generation').option('--source-uri <uri>', 'uri input will be associated with in source maps').option('--output-uri <uri>', 'uri output will be associated with in source maps').parse(params);
            var optionsø1 = programø1.opts();
            optionsø1.args = programø1.args;
            return conj({
                'no-map': !(optionsø1 || 0)['map'],
                'source-uri': (optionsø1 || 0)['sourceUri'],
                'output-uri': (optionsø1 || 0)['outputUri']
            }, optionsø1);
        }.call(this);
    };
var main = exports.main = function main() {
        return function () {
            var optionsø1 = parseParams(process.argv);
            var pathø1 = optionsø1.args[0];
            return optionsø1.run ? run(pathø1) : optionsø1.compile ? pathø1 ? compileFile(pathø1, optionsø1) : compileStdin(optionsø1) : pathø1 ? (optionsø1 || 0)['print'] ? compileFile(pathø1, optionsø1) : run(pathø1) : !process.stdin.isTTY ? compileStdin(optionsø1) : optionsø1.interactive ? startRepl() : 'else' ? startRepl() : void 0;
        }.call(this);
    };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndpc3Avd2lzcC53aXNwIl0sIm5hbWVzIjpbIl9uc18iLCJpZCIsImRvYyIsImNyZWF0ZVJlYWRTdHJlYW0iLCJiYXNlbmFtZSIsImRpcm5hbWUiLCJqb2luIiwicmVzb2x2ZSIsIk1vZHVsZSIsInZlcnNpb24iLCJzcGxpdCIsInVwcGVyQ2FzZSIsInJlcGxhY2UiLCJmaXJzdCIsInNlY29uZCIsImxhc3QiLCJjb3VudCIsInJlZHVjZSIsInJlc3QiLCJjb25qIiwicGFydGl0aW9uIiwiYXNzb2MiLCJkcm9wIiwiaXNFbXB0eSIsInN0YXJ0UmVwbCIsInN0YXJ0Iiwic3RyIiwic3VicyIsImlzRXF1YWwiLCJpc05pbCIsInByU3RyIiwibmFtZSIsImNvbXBpbGUiLCJjb21waWxlU3RkaW4iLCJleHBvcnRzIiwib3B0aW9ucyIsIndpdGhTdHJlYW1Db250ZW50IiwicHJvY2VzcyIsInN0ZGluIiwiY29tcGlsZVN0cmluZyIsImNvbXBpbGVGaWxlIiwicGF0aCIsInNvdXJjZSIsImNoYW5uZWzDuDEiLCJvdXRwdXTDuDEiLCJjb250ZW50w7gxIiwiSlNPTiIsInN0cmluZ2lmeSIsInN0ZG91dCIsIndyaXRlIiwiZXJyb3IiLCJpbnB1dCIsInJlc3VtZSIsInNldEVuY29kaW5nIiwib24iLCIkMSIsIm9uY2UiLCJydW4iLCJfbG9hZCIsIm51bGwiLCJwYXJzZVBhcmFtcyIsInBhcmFtcyIsInByb2dyYW3DuDEiLCJjb21tYW5kZXIiLCJDb21tYW5kIiwiYXJndW1lbnRzIiwidXNhZ2UiLCJvcHRpb24iLCJ4IiwiXyIsInBhcnNlIiwib3B0aW9uc8O4MSIsIm9wdHMiLCJhcmdzIiwibWFpbiIsImFyZ3YiLCJwYXRow7gxIiwic3RkaW4uaXNUVFkiLCJpbnRlcmFjdGl2ZSJdLCJtYXBwaW5ncyI6IjtJQUFBLElBQUNBLEksR0FBRDtBQUFBLFlBQUFDLEUsRUFBSSxXQUFKO0FBQUEsWUFBQUMsRyxFQUNFLGlHQURGO0FBQUEsVTs7UUFHd0JDLGdCQUFBLEcsR0FB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QUQsRSxZQUNiQSxTQUFELEUsU0FUWixDQUZJO0FBQUEsUyxLQUFOLEMsSUFBQTtBQUFBLEtBRkYiLCJzb3VyY2VzQ29udGVudCI6WyIobnMgd2lzcC53aXNwXG4gIFwiV2lzcCBwcm9ncmFtIHRoYXQgcmVhZHMgd2lzcCBjb2RlIGZyb20gc3RkaW4gYW5kIHByaW50c1xuICBjb21waWxlZCBqYXZhc2NyaXB0IGNvZGUgaW50byBzdGRvdXRcIlxuICAoOnJlcXVpcmUgW2ZzIDpyZWZlciBbY3JlYXRlUmVhZFN0cmVhbV1dXG4gICAgICAgICAgICBbcGF0aCA6cmVmZXIgW2Jhc2VuYW1lIGRpcm5hbWUgam9pbiByZXNvbHZlXV1cbiAgICAgICAgICAgIFttb2R1bGUgOnJlZmVyIFtNb2R1bGVdXVxuICAgICAgICAgICAgW2NvbW1hbmRlcl1cbiAgICAgICAgICAgIFt3aXNwLnBhY2thZ2UgOnJlZmVyIFt2ZXJzaW9uXV1cblxuICAgICAgICAgICAgW3dpc3Auc3RyaW5nIDpyZWZlciBbc3BsaXQgam9pbiB1cHBlci1jYXNlIHJlcGxhY2VdXVxuICAgICAgICAgICAgW3dpc3Auc2VxdWVuY2UgOnJlZmVyIFtmaXJzdCBzZWNvbmQgbGFzdCBjb3VudCByZWR1Y2UgcmVzdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25qIHBhcnRpdGlvbiBhc3NvYyBkcm9wIGVtcHR5P11dXG5cbiAgICAgICAgICAgIFt3aXNwLnJlcGwgOnJlZmVyIFtzdGFydF0gOnJlbmFtZSB7c3RhcnQgc3RhcnQtcmVwbH1dXG4gICAgICAgICAgICBbd2lzcC5lbmdpbmUubm9kZV1cbiAgICAgICAgICAgIFt3aXNwLnJ1bnRpbWUgOnJlZmVyIFtzdHIgc3VicyA9IG5pbD9dXVxuICAgICAgICAgICAgW3dpc3AuYXN0IDpyZWZlciBbcHItc3RyIG5hbWVdXVxuICAgICAgICAgICAgW3dpc3AuY29tcGlsZXIgOnJlZmVyIFtjb21waWxlXV0pKVxuXG4oZGVmbiBjb21waWxlLXN0ZGluXG4gIFtvcHRpb25zXVxuICAod2l0aC1zdHJlYW0tY29udGVudCBwcm9jZXNzLnN0ZGluXG4gICAgICAgICAgICAgICAgICAgICAgIGNvbXBpbGUtc3RyaW5nXG4gICAgICAgICAgICAgICAgICAgICAgIChjb25qIHt9IG9wdGlvbnMpKSlcbjs7IChjb25qIHs6c291cmNlLXVyaSBvcHRpb25zfSkgY2F1c2VzIHNlZ2ZhdWx0IGZvciBzb21lIHJlYXNvblxuXG4oZGVmbiBjb21waWxlLWZpbGVcbiAgW3BhdGggb3B0aW9uc11cbiAgKHdpdGgtc3RyZWFtLWNvbnRlbnQgKGNyZWF0ZVJlYWRTdHJlYW0gcGF0aClcbiAgICAgICAgICAgICAgICAgICAgICAgY29tcGlsZS1zdHJpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgKGNvbmogezpzb3VyY2UtdXJpIHBhdGh9IG9wdGlvbnMpKSlcblxuKGRlZm4gY29tcGlsZS1zdHJpbmdcbiAgW3NvdXJjZSBvcHRpb25zXVxuICAobGV0IFtjaGFubmVsIChvciAoOnByaW50IG9wdGlvbnMpIDpjb2RlKVxuICAgICAgICBvdXRwdXQgKGNvbXBpbGUgc291cmNlIG9wdGlvbnMpXG4gICAgICAgIGNvbnRlbnQgKGNvbmRcbiAgICAgICAgICAgICAgICAgICg9IGNoYW5uZWwgOmNvZGUpICg6Y29kZSBvdXRwdXQpXG4gICAgICAgICAgICAgICAgICAoPSBjaGFubmVsIDpleHBhbnNpb24pICg6ZXhwYW5zaW9uIG91dHB1dClcbiAgICAgICAgICAgICAgICAgIDplbHNlIChKU09OLnN0cmluZ2lmeSAoZ2V0IG91dHB1dCBjaGFubmVsKSAyIDIpKV1cbiAgICAgICgud3JpdGUgcHJvY2Vzcy5zdGRvdXQgKG9yIGNvbnRlbnQgXCJuaWxcIikpXG4gICAgKGlmICg6ZXJyb3Igb3V0cHV0KSAodGhyb3cgKC4tZXJyb3Igb3V0cHV0KSkpKSlcblxuKGRlZm4gd2l0aC1zdHJlYW0tY29udGVudFxuICBbaW5wdXQgcmVzdW1lIG9wdGlvbnNdXG4gIChsZXQgW2NvbnRlbnQgXCJcIl1cbiAgICAoLnNldEVuY29kaW5nIGlucHV0IFwidXRmOFwiKVxuICAgICgucmVzdW1lIGlucHV0KVxuICAgICgub24gaW5wdXQgXCJkYXRhXCIgIyhzZXQhIGNvbnRlbnQgKHN0ciBjb250ZW50ICUpKSlcbiAgICAoLm9uY2UgaW5wdXQgXCJlbmRcIiAoZm4gW10gKHJlc3VtZSBjb250ZW50IG9wdGlvbnMpKSkpKVxuXG5cbihkZWZuIHJ1blxuICBbcGF0aF1cbiAgOzsgTG9hZGluZyBtb2R1bGUgYXMgbWFpbiBvbmUsIHNhbWUgd2F5IGFzIG5vZGVqcyBkb2VzIGl0OlxuICA7OyBodHRwczovL2dpdGh1Yi5jb20vam95ZW50L25vZGUvYmxvYi9tYXN0ZXIvbGliL21vZHVsZS5qcyNMNDg5LTQ5M1xuICAoTW9kdWxlLl9sb2FkIChyZXNvbHZlIHBhdGgpIG51bGwgdHJ1ZSkpXG5cbihkZWZtYWNybyAtPlxuICBbJiBvcGVyYXRpb25zXVxuICAocmVkdWNlXG4gICAoZm4gW2Zvcm0gb3BlcmF0aW9uXVxuICAgICAoY29ucyAoZmlyc3Qgb3BlcmF0aW9uKVxuICAgICAgICAgICAoY29ucyBmb3JtIChyZXN0IG9wZXJhdGlvbikpKSlcbiAgIChmaXJzdCBvcGVyYXRpb25zKVxuICAgKHJlc3Qgb3BlcmF0aW9ucykpKVxuXG4oZGVmbiBwYXJzZS1wYXJhbXNcbiAgW3BhcmFtc11cbiAgKGxldCBbcHJvZ3JhbSAoLT4gKG5ldyBjb21tYW5kZXIuQ29tbWFuZClcbiAgICAgICAgICAgICAgICAgICAgKC52ZXJzaW9uIHZlcnNpb24pXG4gICAgICAgICAgICAgICAgICAgICguYXJndW1lbnRzIFwiW2FyZ3MuLi5dXCIpXG4gICAgICAgICAgICAgICAgICAgICgudXNhZ2UgXCJbb3B0aW9uc10gPGZpbGUgLi4uPlwiKVxuICAgICAgICAgICAgICAgICAgICAoLm9wdGlvbiBcIi1yLCAtLXJ1blwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY29tcGlsZSBhbmQgZXhlY3V0ZSB0aGUgZmlsZSAoc2FtZSBhcyB3aXNwIHBhdGgvdG8vZmlsZS53aXNwKVwiKVxuICAgICAgICAgICAgICAgICAgICAoLm9wdGlvbiBcIi1jLCAtLWNvbXBpbGVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvbXBpbGUgZ2l2ZW4gZmlsZSBhbmQgcHJpbnRzIHRvIHN0ZG91dFwiKVxuICAgICAgICAgICAgICAgICAgICAoLm9wdGlvbiBcIi1pLCAtLWludGVyYWN0aXZlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJydW4gYW4gaW50ZXJhY3RpdmUgd2lzcCBSRVBMIChzYW1lIGFzIHdpc3Agd2l0aCBubyBwYXJhbXMpXCIpXG4gICAgICAgICAgICAgICAgICAgICgub3B0aW9uIFwiLS1wcmludCA8Zm9ybWF0PlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidXNlIGN1c3RvbSBwcmludCBvdXRwdXQgYGV4cGFuc2lvbmAsYGZvcm1zYCwgYGFzdGAsIGBqcy1hc3RgIG9yIChkZWZhdWx0KSBgY29kZWBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZm4gW3ggX10gKHN0ciB4KSkpXG4gICAgICAgICAgICAgICAgICAgICgub3B0aW9uIFwiLS1uby1tYXBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImRpc2FibGUgc291cmNlIG1hcCBnZW5lcmF0aW9uXCIpXG4gICAgICAgICAgICAgICAgICAgICgub3B0aW9uIFwiLS1zb3VyY2UtdXJpIDx1cmk+XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ1cmkgaW5wdXQgd2lsbCBiZSBhc3NvY2lhdGVkIHdpdGggaW4gc291cmNlIG1hcHNcIilcbiAgICAgICAgICAgICAgICAgICAgKC5vcHRpb24gXCItLW91dHB1dC11cmkgPHVyaT5cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInVyaSBvdXRwdXQgd2lsbCBiZSBhc3NvY2lhdGVkIHdpdGggaW4gc291cmNlIG1hcHNcIilcbiAgICAgICAgICAgICAgICAgICAgKC5wYXJzZSBwYXJhbXMpKVxuICAgICAgICBvcHRpb25zICgub3B0cyBwcm9ncmFtKV1cbiAgICAoc2V0ISAoLi1hcmdzIG9wdGlvbnMpICguLWFyZ3MgcHJvZ3JhbSkpXG4gICAgOzsgY29tbWFuZGVyIGNhbWVsLWNhc2VzIGRhc2hlZCBsb25nIG9wdGlvbnMsIHNvIGAtLXNvdXJjZS11cmlgIGxhbmRzIG9uXG4gICAgOzsgYG9wdGlvbnMuc291cmNlVXJpYDsgbWFwIHRoZW0gYmFjayB0byB0aGUgZGFzaGVkIGtleXMgdGhlIGNvbXBpbGVyIHJlYWRzLlxuICAgIChjb25qIHs6bm8tbWFwIChub3QgKDptYXAgb3B0aW9ucykpXG4gICAgICAgICAgIDpzb3VyY2UtdXJpICg6c291cmNlVXJpIG9wdGlvbnMpXG4gICAgICAgICAgIDpvdXRwdXQtdXJpICg6b3V0cHV0VXJpIG9wdGlvbnMpfVxuICAgICAgICAgIG9wdGlvbnMpKSlcblxuKGRlZm4gbWFpblxuICBbXVxuICAobGV0IFtvcHRpb25zIChwYXJzZS1wYXJhbXMgcHJvY2Vzcy5hcmd2KVxuICAgICAgICBwYXRoIChhZ2V0IG9wdGlvbnMuYXJncyAwKV1cbiAgICAoY29uZCBvcHRpb25zLnJ1biAocnVuIHBhdGgpXG4gICAgICAgICAgb3B0aW9ucy5jb21waWxlIChpZiBwYXRoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGNvbXBpbGUtZmlsZSBwYXRoIG9wdGlvbnMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGNvbXBpbGUtc3RkaW4gb3B0aW9ucykpXG4gICAgICAgICAgcGF0aCAoaWYgKDpwcmludCBvcHRpb25zKVxuICAgICAgICAgICAgICAgICAoY29tcGlsZS1maWxlIHBhdGggb3B0aW9ucylcbiAgICAgICAgICAgICAgICAgKHJ1biBwYXRoKSlcbiAgICAgICAgICAobm90IHByb2Nlc3Muc3RkaW4uaXNUVFkpIChjb21waWxlLXN0ZGluIG9wdGlvbnMpXG4gICAgICAgICAgb3B0aW9ucy5pbnRlcmFjdGl2ZSAoc3RhcnQtcmVwbClcbiAgICAgICAgICA6ZWxzZSAoc3RhcnQtcmVwbCkpKSlcbiJdfQ==
