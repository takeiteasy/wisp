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
        var contentø1 = isEqual(channelø1, 'code') ? (function () {
            return (outputø1 || 0)['code'];
        })() : isEqual(channelø1, 'expansion') ? (function () {
            return (outputø1 || 0)['expansion'];
        })() : (function () {
            return JSON.stringify((outputø1 || 0)[channelø1], 2, 2);
        })();
        process.stdout.write(contentø1 || 'nil');
        return (outputø1 || 0)['error'] ? (function () {
            throw outputø1.error;
        })() : null;
    }.call(this);
};
var withStreamContent = exports.withStreamContent = function withStreamContent(input, resume, options) {
    return function () {
        var contentø1 = '';
        input.setEncoding('utf8');
        input.resume();
        input.on('data', function (chunk) {
            return contentø1 = '' + contentø1 + chunk;
        });
        return input.once('end', function () {
            return resume(contentø1, options);
        });
    }.call(this);
};
var run = exports.run = function run(path) {
    return Module._load(resolve(path), null, true);
};
null;
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
        return optionsø1.run ? (function () {
            return run(pathø1);
        })() : optionsø1.compile ? (function () {
            return pathø1 ? compileFile(pathø1, optionsø1) : compileStdin(optionsø1);
        })() : pathø1 ? (function () {
            return (optionsø1 || 0)['print'] ? compileFile(pathø1, optionsø1) : run(pathø1);
        })() : !process.stdin.isTTY ? (function () {
            return compileStdin(optionsø1);
        })() : optionsø1.interactive ? (function () {
            return startRepl();
        })() : (function () {
            return startRepl();
        })();
    }.call(this);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndpc3Avd2lzcC53aXNwIl0sIm5hbWVzIjpbIl9uc18iLCJpZCIsImRvYyIsImNyZWF0ZVJlYWRTdHJlYW0iLCJiYXNlbmFtZSIsImRpcm5hbWUiLCJqb2luIiwicmVzb2x2ZSIsIk1vZHVsZSIsInZlcnNpb24iLCJzcGxpdCIsInVwcGVyQ2FzZSIsInJlcGxhY2UiLCJmaXJzdCIsInNlY29uZCIsImxhc3QiLCJjb3VudCIsInJlZHVjZSIsInJlc3QiLCJjb25qIiwicGFydGl0aW9uIiwiYXNzb2MiLCJkcm9wIiwiaXNFbXB0eSIsInN0YXJ0UmVwbCIsInN0YXJ0Iiwic3RyIiwic3VicyIsImlzRXF1YWwiLCJpc05pbCIsInByU3RyIiwibmFtZSIsImNvbXBpbGUiLCJjb21waWxlU3RkaW4iLCJleHBvcnRzIiwib3B0aW9ucyIsIndpdGhTdHJlYW1Db250ZW50IiwicHJvY2VzcyIsInN0ZGluIiwiY29tcGlsZVN0cmluZyIsImNvbXBpbGVGaWxlIiwicGF0aCIsInNvdXJjZSIsImNoYW5uZWzDuDEiLCJvdXRwdXTDuDEiLCJjb250ZW50w7gxIiwiSlNPTiIsInN0cmluZ2lmeSIsInN0ZG91dCIsIndyaXRlIiwiZXJyb3IiLCJpbnB1dCIsInJlc3VtZSIsInNldEVuY29kaW5nIiwib24iLCJjaHVuayIsIm9uY2UiLCJydW4iLCJfbG9hZCIsIm51bGwiLCJwYXJzZVBhcmFtcyIsInBhcmFtcyIsInByb2dyYW3DuDEiLCJjb21tYW5kZXIiLCJDb21tYW5kIiwiYXJndW1lbnRzIiwidXNhZ2UiLCJvcHRpb24iLCJ4IiwiXyIsInBhcnNlIiwib3B0aW9uc8O4MSIsIm9wdHMiLCJhcmdzIiwibWFpbiIsImFyZ3YiLCJwYXRow7gxIiwic3RkaW4uaXNUVFkiLCJpbnRlcmFjdGl2ZSJdLCJtYXBwaW5ncyI6IjtJQUFBLElBQUNBLEksR0FBRDtBQUFBLFFBQUFDLEUsRUFBSSxXQUFKO0FBQUEsUUFBQUMsRyxFQUNFLGlHQURGO0FBQUEsTTs7UUFHd0JDLGdCQUFBLEcs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QUFZTCxTLE1BQVIsQyxPQUFBLENBQUosR0FDRS9CLFdBQUQsQ0FBY29DLE1BQWQsRUFBbUJMLFNBQW5CLENBREQsR0FFRWQsR0FBRCxDQUFLbUIsTUFBTCxDQUZEO0FBQUEsUyxDQUFBLEUsR0FHTCxDQUFLdkMsT0FBQSxDQUFRd0MsVyxnQkFBYTtBQUFBLG1CQUFDNUMsWUFBRCxDQUFlc0MsU0FBZjtBQUFBLFMsQ0FBQSxFLEdBQzFCQSxTQUFBLENBQVFPLFcsZ0JBQVk7QUFBQSxtQkFBQ3RELFNBQUQ7QUFBQSxTLENBQUEsRSxnQkFDZjtBQUFBLG1CQUFDQSxTQUFEO0FBQUEsUyxDQUFBLEVBVFosQ0FGTTtBQUFBLEssS0FBUixDLElBQUE7QUFBQSxDQURGIiwic291cmNlc0NvbnRlbnQiOlsiKG5zIHdpc3Aud2lzcFxuICBcIldpc3AgcHJvZ3JhbSB0aGF0IHJlYWRzIHdpc3AgY29kZSBmcm9tIHN0ZGluIGFuZCBwcmludHNcbiAgY29tcGlsZWQgamF2YXNjcmlwdCBjb2RlIGludG8gc3Rkb3V0XCJcbiAgKDpyZXF1aXJlIFtmcyA6cmVmZXIgW2NyZWF0ZVJlYWRTdHJlYW1dXVxuICAgICAgICAgICAgW3BhdGggOnJlZmVyIFtiYXNlbmFtZSBkaXJuYW1lIGpvaW4gcmVzb2x2ZV1dXG4gICAgICAgICAgICBbbW9kdWxlIDpyZWZlciBbTW9kdWxlXV1cbiAgICAgICAgICAgIFtjb21tYW5kZXJdXG4gICAgICAgICAgICBbd2lzcC5wYWNrYWdlIDpyZWZlciBbdmVyc2lvbl1dXG5cbiAgICAgICAgICAgIFt3aXNwLnN0cmluZyA6cmVmZXIgW3NwbGl0IGpvaW4gdXBwZXItY2FzZSByZXBsYWNlXV1cbiAgICAgICAgICAgIFt3aXNwLnNlcXVlbmNlIDpyZWZlciBbZmlyc3Qgc2Vjb25kIGxhc3QgY291bnQgcmVkdWNlIHJlc3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uaiBwYXJ0aXRpb24gYXNzb2MgZHJvcCBlbXB0eT9dXVxuXG4gICAgICAgICAgICBbd2lzcC5yZXBsIDpyZWZlciBbc3RhcnRdIDpyZW5hbWUge3N0YXJ0IHN0YXJ0LXJlcGx9XVxuICAgICAgICAgICAgW3dpc3AuZW5naW5lLm5vZGVdXG4gICAgICAgICAgICBbd2lzcC5ydW50aW1lIDpyZWZlciBbc3RyIHN1YnMgPSBuaWw/XV1cbiAgICAgICAgICAgIFt3aXNwLmFzdCA6cmVmZXIgW3ByLXN0ciBuYW1lXV1cbiAgICAgICAgICAgIFt3aXNwLmNvbXBpbGVyIDpyZWZlciBbY29tcGlsZV1dKSlcblxuKGRlZnVuIGNvbXBpbGUtc3RkaW4gKG9wdGlvbnMpXG4gICh3aXRoLXN0cmVhbS1jb250ZW50IHByb2Nlc3Muc3RkaW5cbiAgICAgICAgICAgICAgICAgICAgICAgY29tcGlsZS1zdHJpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgKGNvbmoge30gb3B0aW9ucykpKVxuOzsgKGNvbmogezpzb3VyY2UtdXJpIG9wdGlvbnN9KSBjYXVzZXMgc2VnZmF1bHQgZm9yIHNvbWUgcmVhc29uXG5cbihkZWZ1biBjb21waWxlLWZpbGUgKHBhdGggb3B0aW9ucylcbiAgKHdpdGgtc3RyZWFtLWNvbnRlbnQgKGNyZWF0ZVJlYWRTdHJlYW0gcGF0aClcbiAgICAgICAgICAgICAgICAgICAgICAgY29tcGlsZS1zdHJpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgKGNvbmogezpzb3VyY2UtdXJpIHBhdGh9IG9wdGlvbnMpKSlcblxuKGRlZnVuIGNvbXBpbGUtc3RyaW5nIChzb3VyY2Ugb3B0aW9ucylcbiAgKGxldCogKChjaGFubmVsIChvciAoOnByaW50IG9wdGlvbnMpIDpjb2RlKSlcbiAgICAgICAgKG91dHB1dCAoY29tcGlsZSBzb3VyY2Ugb3B0aW9ucykpXG4gICAgICAgIChjb250ZW50IChjb25kXG4gICAgICAgICAgICAgICAgICAoKD0gY2hhbm5lbCA6Y29kZSkgKDpjb2RlIG91dHB1dCkpXG4gICAgICAgICAgICAgICAgICAoKD0gY2hhbm5lbCA6ZXhwYW5zaW9uKSAoOmV4cGFuc2lvbiBvdXRwdXQpKVxuICAgICAgICAgICAgICAgICAgKGVsc2UgKEpTT04uc3RyaW5naWZ5IChnZXQgb3V0cHV0IGNoYW5uZWwpIDIgMikpKSkpXG4gICAgICAoLndyaXRlIHByb2Nlc3Muc3Rkb3V0IChvciBjb250ZW50IFwibmlsXCIpKVxuICAgIChpZiAoOmVycm9yIG91dHB1dCkgKHRocm93ICguLWVycm9yIG91dHB1dCkpKSkpXG5cbihkZWZ1biB3aXRoLXN0cmVhbS1jb250ZW50IChpbnB1dCByZXN1bWUgb3B0aW9ucylcbiAgKGxldCogKChjb250ZW50IFwiXCIpKVxuICAgICguc2V0RW5jb2RpbmcgaW5wdXQgXCJ1dGY4XCIpXG4gICAgKC5yZXN1bWUgaW5wdXQpXG4gICAgKC5vbiBpbnB1dCBcImRhdGFcIiAobGFtYmRhIChjaHVuaykgKHNldHEgY29udGVudCAoc3RyIGNvbnRlbnQgY2h1bmspKSkpXG4gICAgKC5vbmNlIGlucHV0IFwiZW5kXCIgKGxhbWJkYSAoKSAocmVzdW1lIGNvbnRlbnQgb3B0aW9ucykpKSkpXG5cblxuKGRlZnVuIHJ1biAocGF0aClcbiAgOzsgTG9hZGluZyBtb2R1bGUgYXMgbWFpbiBvbmUsIHNhbWUgd2F5IGFzIG5vZGVqcyBkb2VzIGl0OlxuICA7OyBodHRwczovL2dpdGh1Yi5jb20vam95ZW50L25vZGUvYmxvYi9tYXN0ZXIvbGliL21vZHVsZS5qcyNMNDg5LTQ5M1xuICAoTW9kdWxlLl9sb2FkIChyZXNvbHZlIHBhdGgpIG51bGwgdHJ1ZSkpXG5cbihkZWZtYWNybyAtPiAoJnJlc3Qgb3BlcmF0aW9ucylcbiAgKHJlZHVjZVxuICAgKGxhbWJkYSAoZm9ybSBvcGVyYXRpb24pXG4gICAgIChjb25zIChmaXJzdCBvcGVyYXRpb24pXG4gICAgICAgICAgIChjb25zIGZvcm0gKHJlc3Qgb3BlcmF0aW9uKSkpKVxuICAgKGZpcnN0IG9wZXJhdGlvbnMpXG4gICAocmVzdCBvcGVyYXRpb25zKSkpXG5cbihkZWZ1biBwYXJzZS1wYXJhbXMgKHBhcmFtcylcbiAgKGxldCogKChwcm9ncmFtICgtPiAobmV3IGNvbW1hbmRlci5Db21tYW5kKVxuICAgICAgICAgICAgICAgICAgICAoLnZlcnNpb24gdmVyc2lvbilcbiAgICAgICAgICAgICAgICAgICAgKC5hcmd1bWVudHMgXCJbYXJncy4uLl1cIilcbiAgICAgICAgICAgICAgICAgICAgKC51c2FnZSBcIltvcHRpb25zXSA8ZmlsZSAuLi4+XCIpXG4gICAgICAgICAgICAgICAgICAgICgub3B0aW9uIFwiLXIsIC0tcnVuXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb21waWxlIGFuZCBleGVjdXRlIHRoZSBmaWxlIChzYW1lIGFzIHdpc3AgcGF0aC90by9maWxlLndpc3ApXCIpXG4gICAgICAgICAgICAgICAgICAgICgub3B0aW9uIFwiLWMsIC0tY29tcGlsZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY29tcGlsZSBnaXZlbiBmaWxlIGFuZCBwcmludHMgdG8gc3Rkb3V0XCIpXG4gICAgICAgICAgICAgICAgICAgICgub3B0aW9uIFwiLWksIC0taW50ZXJhY3RpdmVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInJ1biBhbiBpbnRlcmFjdGl2ZSB3aXNwIFJFUEwgKHNhbWUgYXMgd2lzcCB3aXRoIG5vIHBhcmFtcylcIilcbiAgICAgICAgICAgICAgICAgICAgKC5vcHRpb24gXCItLXByaW50IDxmb3JtYXQ+XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ1c2UgY3VzdG9tIHByaW50IG91dHB1dCBgZXhwYW5zaW9uYCxgZm9ybXNgLCBgYXN0YCwgYGpzLWFzdGAgb3IgKGRlZmF1bHQpIGBjb2RlYFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIChsYW1iZGEgKHggXykgKHN0ciB4KSkpXG4gICAgICAgICAgICAgICAgICAgICgub3B0aW9uIFwiLS1uby1tYXBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImRpc2FibGUgc291cmNlIG1hcCBnZW5lcmF0aW9uXCIpXG4gICAgICAgICAgICAgICAgICAgICgub3B0aW9uIFwiLS1zb3VyY2UtdXJpIDx1cmk+XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ1cmkgaW5wdXQgd2lsbCBiZSBhc3NvY2lhdGVkIHdpdGggaW4gc291cmNlIG1hcHNcIilcbiAgICAgICAgICAgICAgICAgICAgKC5vcHRpb24gXCItLW91dHB1dC11cmkgPHVyaT5cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInVyaSBvdXRwdXQgd2lsbCBiZSBhc3NvY2lhdGVkIHdpdGggaW4gc291cmNlIG1hcHNcIilcbiAgICAgICAgICAgICAgICAgICAgKC5wYXJzZSBwYXJhbXMpKSlcbiAgICAgICAgKG9wdGlvbnMgKC5vcHRzIHByb2dyYW0pKSlcbiAgICAoc2V0ZiAoLi1hcmdzIG9wdGlvbnMpICguLWFyZ3MgcHJvZ3JhbSkpXG4gICAgOzsgY29tbWFuZGVyIGNhbWVsLWNhc2VzIGRhc2hlZCBsb25nIG9wdGlvbnMsIHNvIGAtLXNvdXJjZS11cmlgIGxhbmRzIG9uXG4gICAgOzsgYG9wdGlvbnMuc291cmNlVXJpYDsgbWFwIHRoZW0gYmFjayB0byB0aGUgZGFzaGVkIGtleXMgdGhlIGNvbXBpbGVyIHJlYWRzLlxuICAgIChjb25qIHs6bm8tbWFwIChub3QgKDptYXAgb3B0aW9ucykpXG4gICAgICAgICAgIDpzb3VyY2UtdXJpICg6c291cmNlVXJpIG9wdGlvbnMpXG4gICAgICAgICAgIDpvdXRwdXQtdXJpICg6b3V0cHV0VXJpIG9wdGlvbnMpfVxuICAgICAgICAgIG9wdGlvbnMpKSlcblxuKGRlZnVuIG1haW4gKClcbiAgKGxldCogKChvcHRpb25zIChwYXJzZS1wYXJhbXMgcHJvY2Vzcy5hcmd2KSlcbiAgICAgICAgKHBhdGggKGFnZXQgb3B0aW9ucy5hcmdzIDApKSlcbiAgICAoY29uZCAob3B0aW9ucy5ydW4gKHJ1biBwYXRoKSlcbiAgICAgICAgICAob3B0aW9ucy5jb21waWxlIChpZiBwYXRoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGNvbXBpbGUtZmlsZSBwYXRoIG9wdGlvbnMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGNvbXBpbGUtc3RkaW4gb3B0aW9ucykpKVxuICAgICAgICAgIChwYXRoIChpZiAoOnByaW50IG9wdGlvbnMpXG4gICAgICAgICAgICAgICAgIChjb21waWxlLWZpbGUgcGF0aCBvcHRpb25zKVxuICAgICAgICAgICAgICAgICAocnVuIHBhdGgpKSlcbiAgICAgICAgICAoKG5vdCBwcm9jZXNzLnN0ZGluLmlzVFRZKSAoY29tcGlsZS1zdGRpbiBvcHRpb25zKSlcbiAgICAgICAgICAob3B0aW9ucy5pbnRlcmFjdGl2ZSAoc3RhcnQtcmVwbCkpXG4gICAgICAgICAgKGVsc2UgKHN0YXJ0LXJlcGwpKSkpKVxuIl19
