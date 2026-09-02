{
    var _ns_ = {
            id: 'wisp.engine.node',
            doc: void 0
        };
    var fs = require('fs');
    var readFileSync = fs.readFileSync;
    var wisp_compiler = require('./../compiler');
    var compile = wisp_compiler.compile;
}
global.__verbose__ = 0 <= process.argv.indexOf('--verbose');
var compilePath = exports.compilePath = function compilePath(path) {
        return function () {
            var sourceø1 = readFileSync(path, 'utf8');
            var outputø1 = compile(sourceø1, { 'source-uri': path });
            return (outputø1 || 0)['error'] ? (function () {
                throw (outputø1 || 0)['error'];
            })() : (outputø1 || 0)['code'];
        }.call(this);
    };
(require.extensions || 0)['.wisp'] = function (src, path) {
    return src._compile(compilePath(path), path);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndpc3AvZW5naW5lL25vZGUud2lzcCJdLCJuYW1lcyI6WyJfbnNfIiwiaWQiLCJkb2MiLCJyZWFkRmlsZVN5bmMiLCJjb21waWxlIiwiZ2xvYmFsIiwiX192ZXJib3NlX18iLCJwcm9jZXNzIiwiYXJndiIsImluZGV4T2YiLCJjb21waWxlUGF0aCIsImV4cG9ydHMiLCJwYXRoIiwic291cmNlw7gxIiwib3V0cHV0w7gxIiwicmVxdWlyZSIsImV4dGVuc2lvbnMiLCJzcmMiLCJfY29tcGlsZSJdLCJtYXBwaW5ncyI6IjtJQUFBLElBQUNBLEksR0FBRDtBQUFBLFlBQUFDLEUsRUFBSSxrQkFBSjtBQUFBLFlBQUFDLEcsRUFBQSxLLENBQUE7QUFBQSxVOztRQUN3QkMsWUFBQSxHLEdBQUFBLFk7O1FBQ1dDLE9BQUEsRyxjQUFBQSxPOztBQUU3QkMsTUFBQSxDQUFPQyxXQUFiLEdBQTZCLENBQUosSUFBZ0JDLE9BQUEsQ0FBUUMsSUFBakIsQ0FBQ0MsT0FBRixDLFdBQUEsQ0FBL0IsQztBQUVBLElBQU1DLFdBQUEsR0FBQUMsT0FBQSxDQUFBRCxXQUFBLEdBQU4sU0FBTUEsV0FBTixDQUNHRSxJQURILEVBRUU7QUFBQSxlLFlBQU07QUFBQSxnQkFBQUMsUSxHQUFRVixZQUFELENBQWdCUyxJQUFoQixFLE1BQUEsQ0FBUDtBQUFBLFlBQ0EsSUFBQUUsUSxHQUFRVixPQUFELENBQVNTLFFBQVQsRUFBZ0IsRSxjQUFhRCxJQUFiLEVBQWhCLENBQVAsQ0FEQTtBQUFBLFlBRUosTyxDQUFZRSxRLE1BQVIsQyxPQUFBLENBQUosRyxhQUNFO0FBQUEsc0IsQ0FBZUEsUSxNQUFSLEMsT0FBQSxDQUFQO0FBQUEsYSxDQUFBLEVBREYsRyxDQUVTQSxRLE1BQVAsQyxNQUFBLENBRkYsQ0FGSTtBQUFBLFMsS0FBTixDLElBQUE7QUFBQSxLQUZGLEM7Q0FVV0MsT0FBQSxDQUFRQyxVLE1BQWIsQ0FBd0IsT0FBeEIsQ0FBTixHQUNNLFVBQUtDLEdBQUwsRUFBU0wsSUFBVCxFQUNFO0FBQUEsV0FBV0ssR0FBVixDQUFDQyxRQUFGLENBQWdCUixXQUFELENBQWNFLElBQWQsQ0FBZixFQUFtQ0EsSUFBbkM7QUFBQSxDQUZSIiwic291cmNlc0NvbnRlbnQiOlsiKG5zIHdpc3AuZW5naW5lLm5vZGVcbiAgKDpyZXF1aXJlIFtmcyA6cmVmZXIgW3JlYWQtZmlsZS1zeW5jXV1cbiAgICAgICAgICAgIFt3aXNwLmNvbXBpbGVyIDpyZWZlciBbY29tcGlsZV1dKSlcblxuKHNldCEgZ2xvYmFsLioqdmVyYm9zZSoqICg8PSAwICguaW5kZXhPZiBwcm9jZXNzLmFyZ3YgOi0tdmVyYm9zZSkpKVxuXG4oZGVmbiBjb21waWxlLXBhdGhcbiAgW3BhdGhdXG4gIChsZXQgW3NvdXJjZSAocmVhZC1maWxlLXN5bmMgcGF0aCA6dXRmOClcbiAgICAgICAgb3V0cHV0IChjb21waWxlIHNvdXJjZSB7OnNvdXJjZS11cmkgcGF0aH0pXVxuICAgIChpZiAoOmVycm9yIG91dHB1dClcbiAgICAgICh0aHJvdyAoOmVycm9yIG91dHB1dCkpXG4gICAgICAoOmNvZGUgb3V0cHV0KSkpKVxuXG47OyBSZWdpc3RlciBgLndpc3BgIGZpbGUgZXh0ZW5zaW9uIHNvIHRoYXRcbjs7IG1vZHVsZXMgY2FuIGJlIHNpbXBseSByZXF1aXJlZC5cbihzZXQhIChnZXQgcmVxdWlyZS5leHRlbnNpb25zIFwiLndpc3BcIilcbiAgICAgIChmbiBbc3JjIHBhdGhdXG4gICAgICAgICguX2NvbXBpbGUgc3JjIChjb21waWxlLXBhdGggcGF0aCkgcGF0aCkpKVxuIl19
