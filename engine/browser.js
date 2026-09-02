{
    var _ns_ = {
            id: 'runner.main',
            doc: void 0
        };
    var wisp_compiler = require('wisp/compiler');
    var compile = wisp_compiler.compile;
}
var _wisp_runtime = exports._wisp_runtime = require('../runtime.js');
var _wisp_sequence = exports._wisp_sequence = require('../sequence.js');
var _wisp_string = exports._wisp_string = require('../string.js');
var fetchSource = exports.fetchSource = function fetchSource(src, callback) {
        return function () {
            var xhrø1 = new XMLHttpRequest();
            xhrø1.open('GET', src, true);
            xhrø1.addEventListener('load', function (ev) {
                return xhrø1.status >= 200 && xhrø1.status < 300 ? callback(xhrø1.responseText) : console.error(xhrø1.statusText);
            }, false);
            xhrø1.overrideMimeType ? xhrø1.overrideMimeType('text/plain') : void 0;
            xhrø1.setRequestHeader('If-Modified-Since', 'Fri, 01 Jan 1960 00:00:00 GMT');
            return xhrø1.send(null);
        }.call(this);
    };
var runWispCode = exports.runWispCode = function runWispCode(code, url) {
        return function () {
            var resultø1 = compile(code, { 'source-uri': url || 'inline' });
            var errorø1 = (resultø1 || 0)['error'];
            return errorø1 ? console.error(errorø1) : Function(eval((resultø1 || 0)['code']))();
        }.call(this);
    };
var fetchAndRunWispCode = exports.fetchAndRunWispCode = function fetchAndRunWispCode(url) {
        return fetchSource(url, function (code) {
            return runWispCode(code, url);
        });
    };
var __main__ = exports.__main__ = function __main__(ev) {
        [
            _wisp_string,
            _wisp_sequence,
            _wisp_runtime
        ].forEach(function (f) {
            return Object.keys(f).forEach(function ($1) {
                return (window || 0)[$1] = (f || 0)[$1];
            });
        });
        return function () {
            var scriptsø1 = document.getElementsByTagName('script');
            return function loop() {
                var recur = loop;
                var xø1 = 0;
                do {
                    recur = xø1 < scriptsø1.length ? function () {
                        var scriptø1 = (scriptsø1 || 0)[xø1];
                        var sourceø1 = scriptø1.src;
                        var contentø1 = scriptø1.text;
                        var contentTypeø1 = scriptø1.type;
                        contentTypeø1 == 'application/wisp' ? (function () {
                            sourceø1 ? fetchAndRunWispCode(sourceø1) : void 0;
                            return contentø1 ? runWispCode(contentø1, sourceø1) : void 0;
                        })() : void 0;
                        return loop[0] = xø1 + 1, loop;
                    }.call(this) : void 0;
                } while (xø1 = loop[0], recur === loop);
                return recur;
            }.call(this);
        }.call(this);
    };
window.addEventListener('load', __main__, false);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndpc3AvZW5naW5lL2Jyb3dzZXIud2lzcCJdLCJuYW1lcyI6WyJfbnNfIiwiaWQiLCJkb2MiLCJjb21waWxlIiwiX3dpc3BfcnVudGltZSIsImV4cG9ydHMiLCJyZXF1aXJlIiwiX3dpc3Bfc2VxdWVuY2UiLCJfd2lzcF9zdHJpbmciLCJmZXRjaFNvdXJjZSIsInNyYyIsImNhbGxiYWNrIiwieGhyw7gxIiwiWE1MSHR0cFJlcXVlc3QiLCJvcGVuIiwiYWRkRXZlbnRMaXN0ZW5lciIsImV2Iiwic3RhdHVzIiwicmVzcG9uc2VUZXh0IiwiY29uc29sZSIsImVycm9yIiwic3RhdHVzVGV4dCIsIm92ZXJyaWRlTWltZVR5cGUiLCJzZXRSZXF1ZXN0SGVhZGVyIiwic2VuZCIsIm51bGwiLCJydW5XaXNwQ29kZSIsImNvZGUiLCJ1cmwiLCJyZXN1bHTDuDEiLCJlcnJvcsO4MSIsIkZ1bmN0aW9uIiwiZXZhbCIsImZldGNoQW5kUnVuV2lzcENvZGUiLCJfX21haW5fXyIsImZvckVhY2giLCJmIiwiT2JqZWN0Iiwia2V5cyIsIiQxIiwid2luZG93Iiwic2NyaXB0c8O4MSIsImRvY3VtZW50IiwiZ2V0RWxlbWVudHNCeVRhZ05hbWUiLCJ4w7gxIiwibGVuZ3RoIiwic2NyaXB0w7gxIiwic291cmNlw7gxIiwiY29udGVudMO4MSIsInRleHQiLCJjb250ZW50VHlwZcO4MSIsInR5cGUiXSwibWFwcGluZ3MiOiI7SUFBQSxJQUFDQSxJLEdBQUQ7QUFBQSxZQUFBQyxFLEVBQUksYUFBSjtBQUFBLFlBQUFDLEcsRUFBQSxLLENBQUE7QUFBQSxVOztRQUNtQ0MsT0FBQSxHLGNBQUFBLE87O0FBRW5DLElBQUtDLGFBQUEsR0FBQUMsT0FBQSxDQUFBRCxhQUFBLEdBQWVFLE9BQUQsQ0FBUyxlQUFULENBQW5CLEM7QUFDQSxJQUFLQyxjQUFBLEdBQUFGLE9BQUEsQ0FBQUUsY0FBQSxHQUFnQkQsT0FBRCxDQUFTLGdCQUFULENBQXBCLEM7QUFDQSxJQUFLRSxZQUFBLEdBQUFILE9B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QSx3QkFDQSxJQUFBRyxRLEdBQWNELFFBQVAsQ0FBR3BDLEdBQVYsQ0FEQTtBQUFBLHdCQUVBLElBQUFzQyxTLEdBQWdCRixRQUFSLENBQUdHLElBQVgsQ0FGQTtBQUFBLHdCQUdBLElBQUFDLGEsR0FBcUJKLFFBQVIsQ0FBR0ssSUFBaEIsQ0FIQTtBQUFBLHdCQVFJRCxhQUFKLElBQWlCLGtCQUFyQixHLGFBRUk7QUFBQSw0QkFBSUgsUUFBSixHQUNHZCxtQkFBRCxDQUF5QmMsUUFBekIsQ0FERixHLE1BQUE7QUFBQSw0QkFFQSxPQUFJQyxTQUFKLEdBQ0d0QixXQUFELENBQWVzQixTQUFmLEVBQXVCRCxRQUF2QixDQURGLEcsTUFBQSxDQUZBO0FBQUEseUIsQ0FBQSxFQUZKLEcsTUFBQSxDQVJJO0FBQUEsd0JBY0osTyxVQUFVSCxHQUFILEdBQUssQ0FBWixFLElBQUEsQ0FkSTtBQUFBLHFCLEtBQU4sQyxJQUFBLENBREYsRzt5QkFGS0EsRzs7a0JBQVAsQyxJQUFBLEVBREk7QUFBQSxTLEtBQU4sQyxJQUFBLEVBTkE7QUFBQSxLQUZGLEM7QUE0Qm1CSixNQUFsQixDQUFDekIsZ0JBQUYsQ0FBMEIsTUFBMUIsRUFBaUNtQixRQUFqQyxFLEtBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIobnMgcnVubmVyLm1haW5cbiAgKDpyZXF1aXJlIFt3aXNwLmNvbXBpbGVyIDpyZWZlciBbY29tcGlsZV1dKSlcblxuKGRlZiBfd2lzcF9ydW50aW1lIChyZXF1aXJlIFwiLi4vcnVudGltZS5qc1wiKSlcbihkZWYgX3dpc3Bfc2VxdWVuY2UgKHJlcXVpcmUgXCIuLi9zZXF1ZW5jZS5qc1wiKSlcbihkZWYgX3dpc3Bfc3RyaW5nIChyZXF1aXJlIFwiLi4vc3RyaW5nLmpzXCIpKVxuXG4oZGVmbiBmZXRjaC1zb3VyY2UgW3NyYyBjYWxsYmFja11cbiAgKGxldCBbeGhyIChuZXcgWE1MSHR0cFJlcXVlc3QpXVxuICAgIDsoLmFkZEV2ZW50TGlzdGVuZXIgeGhyIFwidGltZW91dFwiIChmbiBbZXZdIChjb25zb2xlLmxvZyBcIlRpbWVvdXQgbG9hZGluZ1wiIHNyYykpIGZhbHNlKVxuICAgICgub3BlbiB4aHIgXCJHRVRcIiBzcmMgdHJ1ZSlcbiAgICAoLmFkZEV2ZW50TGlzdGVuZXIgeGhyIFwibG9hZFwiXG4gICAgICAgICAgICAgICAgICAgICAgIChmbiBbZXZdXG4gICAgICAgICAgICAgICAgICAgICAgICAgKGlmIChhbmQgKD49IHhoci5zdGF0dXMgMjAwKSAoPCB4aHIuc3RhdHVzIDMwMCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAoY2FsbGJhY2sgeGhyLnJlc3BvbnNlVGV4dClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIChjb25zb2xlLmVycm9yIHhoci5zdGF0dXNUZXh0KSkpIGZhbHNlKVxuICAgIDsoc2V0ISAoLi10aW1lb3V0IHhocikgMzApXG4gICAgKGlmIHhoci5vdmVycmlkZU1pbWVUeXBlXG4gICAgICAoeGhyLm92ZXJyaWRlTWltZVR5cGUgXCJ0ZXh0L3BsYWluXCIpKVxuICAgICh4aHIuc2V0UmVxdWVzdEhlYWRlciBcIklmLU1vZGlmaWVkLVNpbmNlXCIgXCJGcmksIDAxIEphbiAxOTYwIDAwOjAwOjAwIEdNVFwiKVxuICAgICguc2VuZCB4aHIgbnVsbCkpKVxuXG4oZGVmbiBydW4td2lzcC1jb2RlIFtjb2RlIHVybF1cbiAgKGxldCBbcmVzdWx0IChjb21waWxlIGNvZGUgezpzb3VyY2UtdXJpIChvciB1cmwgXCJpbmxpbmVcIil9KVxuICAgICAgICBlcnJvciAoOmVycm9yIHJlc3VsdCldXG4gICAgKGlmIGVycm9yXG4gICAgICAoY29uc29sZS5lcnJvciBlcnJvcilcbiAgICAgICgoRnVuY3Rpb24gKGV2YWwgKDpjb2RlIHJlc3VsdCkpKSkpKSlcblxuKGRlZm4gZmV0Y2gtYW5kLXJ1bi13aXNwLWNvZGUgW3VybF1cbiAgKGZldGNoLXNvdXJjZSB1cmxcbiAgICAgICAgICAgICAgICAoZm4gW2NvZGVdXG4gICAgICAgICAgICAgICAgICAocnVuLXdpc3AtY29kZSBjb2RlIHVybCkpKSlcblxuKGRlZm4gX19tYWluX18gW2V2XVxuICA7IGhvaXN0IHdpc3AgYnVpbHRpbnMgaW50byB0aGUgZ2xvYmFsIHdpbmRvdyBjb250ZXh0XG4gICguZm9yRWFjaCBbX3dpc3Bfc3RyaW5nIF93aXNwX3NlcXVlbmNlIF93aXNwX3J1bnRpbWVdXG4gICAgICAgICAgICAoZm4gW2ZdXG4gICAgICAgICAgICAgICguZm9yRWFjaCAoLmtleXMgT2JqZWN0IGYpXG4gICAgICAgICAgICAgICAgICAgICAgICAjKHNldCEgKGdldCB3aW5kb3cgJSkgKGdldCBmICUpKSkpKVxuICA7KGNvbnNvbGUubG9nIFwicnVubmluZyBfX21haW5fX1wiKVxuICA7IGZpbmQgYWxsIHRoZSBzY3JpcHQgdGFncyBvbiB0aGUgcGFnZVxuICAobGV0IFtzY3JpcHRzIChkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSBcInNjcmlwdFwiKV1cbiAgICAobG9vcCBbeCAwXVxuICAgICAgOyBsb29wIHRocm91Z2ggZXZlcnkgc2NyaXB0IHRhZ1xuICAgICAgKGlmICg8IHggc2NyaXB0cy5sZW5ndGgpXG4gICAgICAgIChsZXQgW3NjcmlwdCAoZ2V0IHNjcmlwdHMgeClcbiAgICAgICAgICAgICAgc291cmNlICguLXNyYyBzY3JpcHQpXG4gICAgICAgICAgICAgIGNvbnRlbnQgKC4tdGV4dCBzY3JpcHQpXG4gICAgICAgICAgICAgIGNvbnRlbnQtdHlwZSAoLi10eXBlIHNjcmlwdCldXG4gICAgICAgICAgOyhjb25zb2xlLmxvZyBcInNyYzpcIiAoLi1zcmMgc2NyaXB0KSlcbiAgICAgICAgICA7KGNvbnNvbGUubG9nIFwidHlwZTpcIiAoLi10eXBlIHNjcmlwdCkpXG4gICAgICAgICAgOyhjb25zb2xlLmxvZyBcImNvbnRlbnQ6XCIgKC4tdGV4dCBzY3JpcHQpKVxuICAgICAgICAgIDsgaWYgdGhlIHNjcmlwdCB0YWcgaGFzIGFwcGxpY2F0aW9uL3dpc3AgYXMgdGhlIHR5cGUgdGhlbiBydW4gaXRcbiAgICAgICAgICAoaWYgKD09IGNvbnRlbnQtdHlwZSBcImFwcGxpY2F0aW9uL3dpc3BcIilcbiAgICAgICAgICAgIChkb1xuICAgICAgICAgICAgICAoaWYgc291cmNlXG4gICAgICAgICAgICAgICAgKGZldGNoLWFuZC1ydW4td2lzcC1jb2RlIHNvdXJjZSkpXG4gICAgICAgICAgICAgIChpZiBjb250ZW50XG4gICAgICAgICAgICAgICAgKHJ1bi13aXNwLWNvZGUgY29udGVudCBzb3VyY2UpKSkpXG4gICAgICAgICAgKHJlY3VyICgrIHggMSkpKSkpKSlcblxuKC5hZGRFdmVudExpc3RlbmVyIHdpbmRvdyBcImxvYWRcIiBfX21haW5fXyBmYWxzZSlcbiJdfQ==
