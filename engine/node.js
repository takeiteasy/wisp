{
    var _ns_ = {
        id: 'wisp.engine.node',
        doc: null
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndpc3AvZW5naW5lL25vZGUud2lzcCJdLCJuYW1lcyI6WyJfbnNfIiwiaWQiLCJkb2MiLCJyZWFkRmlsZVN5bmMiLCJjb21waWxlIiwiZ2xvYmFsIiwiX192ZXJib3NlX18iLCJwcm9jZXNzIiwiYXJndiIsImluZGV4T2YiLCJjb21waWxlUGF0aCIsImV4cG9ydHMiLCJwYXRoIiwic291cmNlw7gxIiwib3V0cHV0w7gxIiwicmVxdWlyZSIsImV4dGVuc2lvbnMiLCJzcmMiLCJfY29tcGlsZSJdLCJtYXBwaW5ncyI6IjtJQUFBLElBQUNBLEksR0FBRDtBQUFBLFFBQUFDLEUsRUFBSSxrQkFBSjtBQUFBLFFBQUFDLEcsRUFBQTtBQUFBLE07O1FBQ3dCQyxZQUFBLEcsR0FBQUEsWTs7UUFDV0MsT0FBQSxHLGNBQUFBLE87O0FBRTdCQyxNQUFBLENBQU9DLFdBQWIsR0FBNkIsQ0FBSixJQUFnQkMsT0FBQSxDQUFRQyxJQUFqQixDQUFDQyxPQUFGLEMsV0FBQSxDQUEvQixDO0FBRUEsSUFBT0MsV0FBQSxHQUFBQyxPQUFBLENBQUFELFdBQUEsR0FBUCxTQUFPQSxXQUFQLENBQ0dFLElBREgsRUFFRTtBQUFBLFcsWUFBUTtBQUFBLFlBQUFDLFEsR0FBUVYsWUFBRCxDQUFnQlMsSUFBaEIsRSxNQUFBLENBQVA7QUFBQSxRQUNELElBQUFFLFEsR0FBUVYsT0FBRCxDQUFTUyxRQUFULEVBQWdCLEUsY0FBYUQsSUFBYixFQUFoQixDQUFQLENBREM7QUFBQSxRQUVOLE8sQ0FBWUUsUSxNQUFSLEMsT0FBQSxDQUFKLEcsYUFDRTtBQUFBLGtCLENBQWVBLFEsTUFBUixDLE9BQUEsQ0FBUDtBQUFBLFMsQ0FBQSxFQURGLEcsQ0FFU0EsUSxNQUFQLEMsTUFBQSxDQUZGLENBRk07QUFBQSxLLEtBQVIsQyxJQUFBO0FBQUEsQ0FGRixDO0NBVVdDLE9BQUEsQ0FBUUMsVSxNQUFiLENBQXdCLE9BQXhCLENBQU4sR0FDTSxVQUFTQyxHQUFULEVBQWFMLElBQWIsRUFDRTtBQUFBLFdBQVdLLEdBQVYsQ0FBQ0MsUUFBRixDQUFnQlIsV0FBRCxDQUFjRSxJQUFkLENBQWYsRUFBbUNBLElBQW5DO0FBQUEsQ0FGUiIsInNvdXJjZXNDb250ZW50IjpbIihucyB3aXNwLmVuZ2luZS5ub2RlXG4gICg6cmVxdWlyZSBbZnMgOnJlZmVyIFtyZWFkLWZpbGUtc3luY11dXG4gICAgICAgICAgICBbd2lzcC5jb21waWxlciA6cmVmZXIgW2NvbXBpbGVdXSkpXG5cbihzZXRmIGdsb2JhbC4qKnZlcmJvc2UqKiAoPD0gMCAoLmluZGV4T2YgcHJvY2Vzcy5hcmd2IDotLXZlcmJvc2UpKSlcblxuKGRlZnVuIGNvbXBpbGUtcGF0aFxuICAocGF0aClcbiAgKGxldCogKChzb3VyY2UgKHJlYWQtZmlsZS1zeW5jIHBhdGggOnV0ZjgpKVxuICAgICAgICAob3V0cHV0IChjb21waWxlIHNvdXJjZSB7OnNvdXJjZS11cmkgcGF0aH0pKSlcbiAgICAoaWYgKDplcnJvciBvdXRwdXQpXG4gICAgICAodGhyb3cgKDplcnJvciBvdXRwdXQpKVxuICAgICAgKDpjb2RlIG91dHB1dCkpKSlcblxuOzsgUmVnaXN0ZXIgYC53aXNwYCBmaWxlIGV4dGVuc2lvbiBzbyB0aGF0XG47OyBtb2R1bGVzIGNhbiBiZSBzaW1wbHkgcmVxdWlyZWQuXG4oc2V0ZiAoZ2V0IHJlcXVpcmUuZXh0ZW5zaW9ucyBcIi53aXNwXCIpXG4gICAgICAobGFtYmRhIChzcmMgcGF0aClcbiAgICAgICAgKC5fY29tcGlsZSBzcmMgKGNvbXBpbGUtcGF0aCBwYXRoKSBwYXRoKSkpXG4iXX0=
