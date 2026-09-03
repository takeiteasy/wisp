{
    var _ns_ = {
        id: 'wisp.runtime',
        doc: 'Core primitives required for runtime'
    };
}
var _wispTypes = Object.freeze({
    'list': 'wisp.list',
    'lazy-seq': 'wisp.lazy.seq',
    'set': 'wisp.identity-set'
});
var isLazySeq = exports.isLazySeq = function isLazySeq(value) {
    return value && (_wispTypes || 0)['lazy-seq'] === value.type;
};
var isIdentitySet = exports.isIdentitySet = function isIdentitySet(value) {
    return value && (_wispTypes || 0)['set'] === value.type;
};
var isList = exports.isList = function isList(value) {
    return value && (_wispTypes || 0)['list'] === value.type;
};
var identity = exports.identity = function identity(x) {
    return x;
};
var complement = exports.complement = function complement(f) {
    return function () {
        var args = Array.prototype.slice.call(arguments, 0);
        return !f.apply(null, args);
    };
};
var isOdd = exports.isOdd = function isOdd(n) {
    return n % 2 === 1;
};
var isEven = exports.isEven = function isEven(n) {
    return n % 2 === 0;
};
var get = exports.get = function get(target, key, default_) {
    return isSet(target) ? (function () {
        return target.has(key) ? key : default_;
    })() : (function () {
        return target && target.hasOwnProperty(key) ? target[key] : default_;
    })();
};
var isDictionary = exports.isDictionary = function isDictionary(form) {
    return isObject(form) && isObject(Object.getPrototypeOf(form)) && isNil(Object.getPrototypeOf(Object.getPrototypeOf(form)));
};
var dictionary = exports.dictionary = function dictionary() {
    var pairs = Array.prototype.slice.call(arguments, 0);
    return function loop() {
        var recur = loop;
        var keyValuesø1 = pairs;
        var resultø1 = {};
        do {
            recur = keyValuesø1.length ? (function () {
                resultø1[keyValuesø1[0]] = keyValuesø1[1];
                return loop[0] = keyValuesø1.slice(2), loop[1] = resultø1, loop;
            })() : resultø1;
        } while (keyValuesø1 = loop[0], resultø1 = loop[1], recur === loop);
        return recur;
    }.call(this);
};
var keys = exports.keys = function keys(dictionary) {
    return Object.keys(dictionary);
};
var vals = exports.vals = function vals(dictionary) {
    return keys(dictionary).map(function (key) {
        return (dictionary || 0)[key];
    });
};
var keyValues = exports.keyValues = function keyValues(dictionary) {
    return keys(dictionary).map(function (key) {
        return [
            key,
            (dictionary || 0)[key]
        ];
    });
};
var merge = exports.merge = function merge() {
    return Object.create(Object.prototype, Array.prototype.slice.call(arguments).reduce(function (descriptor, dictionary) {
        isObject(dictionary) ? Object.keys(dictionary).forEach(function (key) {
            return (descriptor || 0)[key] = Object.getOwnPropertyDescriptor(dictionary, key);
        }) : null;
        return descriptor;
    }, Object.create(Object.prototype)));
};
var isSatisfies = exports.isSatisfies = function isSatisfies(protocol, x) {
    return protocol.wisp_core$IProtocol$_ || (isNil(x) ? (function () {
        return protocol.wisp_core$IProtocol$nil || false;
    })() : (function () {
        return x[protocol.wisp_core$IProtocol$id] || protocol['' + 'wisp_core$IProtocol$' + Object.prototype.toString.call(x).replace('[object ', '').replace(/\]$/, '')] || false;
    })());
};
var isContainsVector = exports.isContainsVector = function isContainsVector(vector, element) {
    return vector.indexOf(element) >= 0;
};
var mapDictionary = exports.mapDictionary = function mapDictionary(source, f) {
    return Object.keys(source).reduce(function (target, key) {
        (target || 0)[key] = f((source || 0)[key]);
        return target;
    }, {});
};
var toString = exports.toString = Object.prototype.toString;
var isFn = exports.isFn = typeof(/./) === 'function' ? function (x) {
    return toString.call(x) === '[object Function]';
} : function (x) {
    return typeof(x) === 'function';
};
var isError = exports.isError = function isError(x) {
    return x instanceof Error || toString.call(x) === '[object Error]';
};
var isString = exports.isString = function isString(x) {
    return typeof(x) === 'string' || toString.call(x) === '[object String]';
};
var isNumber = exports.isNumber = function isNumber(x) {
    return typeof(x) === 'number' || toString.call(x) === '[object Number]';
};
var isVector = exports.isVector = isFn(Array.isArray) ? Array.isArray : function (x) {
    return toString.call(x) === '[object Array]';
};
var isIterable = exports.isIterable = function isIterable(x) {
    return isFn((x || 0)[Symbol.iterator]);
};
var isDate = exports.isDate = function isDate(x) {
    return toString.call(x) === '[object Date]';
};
var isBoolean = exports.isBoolean = function isBoolean(x) {
    return x === true || x === false || toString.call(x) === '[object Boolean]';
};
var isRePattern = exports.isRePattern = function isRePattern(x) {
    return toString.call(x) === '[object RegExp]';
};
var isSet = exports.isSet = function isSet(x) {
    return x instanceof Set;
};
var isObject = exports.isObject = function isObject(x) {
    return x && typeof(x) === 'object';
};
var isNil = exports.isNil = function isNil(x) {
    return x === null || x === undefined;
};
var isTrue = exports.isTrue = function isTrue(x) {
    return x === true;
};
var isFalse = exports.isFalse = function isFalse(x) {
    return x === false;
};
var reFind = exports.reFind = function reFind(re, s) {
    return function () {
        var matchesø1 = re.exec(s);
        return !isNil(matchesø1) ? matchesø1.length === 1 ? (matchesø1 || 0)[0] : matchesø1 : null;
    }.call(this);
};
var reMatches = exports.reMatches = function reMatches(pattern, source) {
    return function () {
        var matchesø1 = pattern.exec(source);
        return !isNil(matchesø1) && (matchesø1 || 0)[0] === source ? matchesø1.length === 1 ? (matchesø1 || 0)[0] : matchesø1 : null;
    }.call(this);
};
var rePattern = exports.rePattern = function rePattern(s) {
    return function () {
        var matchø1 = reFind(/^(?:\(\?([idmsux]*)\))?(.*)/, s);
        return new RegExp((matchø1 || 0)[2], (matchø1 || 0)[1]);
    }.call(this);
};
var inc = exports.inc = function inc(x) {
    return x + 1;
};
var dec = exports.dec = function dec(x) {
    return x - 1;
};
var str = exports.str = function str() {
    return String.prototype.concat.apply('', arguments);
};
var char = exports.char = function char(code) {
    return String.fromCharCode(code);
};
var int = exports.int = function int(x) {
    return isNumber(x) ? (function () {
        return Math.floor(x);
    })() : isString(x) ? (function () {
        return x.charCodeAt(0);
    })() : (function () {
        return 0;
    })();
};
var subs = exports.subs = function subs(string, start, end) {
    return string.substring(start, end);
};
var isPatternEqual = function isPatternEqual(x, y) {
    return isRePattern(x) && isRePattern(y) && x.source === y.source && x.global === y.global && x.multiline === y.multiline && x.ignoreCase === y.ignoreCase;
};
var isDateEqual = function isDateEqual(x, y) {
    return isDate(x) && isDate(y) && Number(x) === Number(y);
};
var isSetEqual = function isSetEqual(x, y) {
    return isSet(x) && isSet(y) && x.size === y.size && Array.from(x).every(function ($) {
        return y.has($);
    });
};
var isDictionaryEqual = function isDictionaryEqual(x, y) {
    return isObject(x) && isObject(y) && function () {
        var xKeysø1 = keys(x);
        var yKeysø1 = keys(y);
        var xCountø1 = xKeysø1.length;
        var yCountø1 = yKeysø1.length;
        return xCountø1 === yCountø1 && function loop() {
            var recur = loop;
            var indexø1 = 0;
            var countø1 = xCountø1;
            var keysø1 = xKeysø1;
            do {
                recur = indexø1 < countø1 ? isEquivalent((x || 0)[(keysø1 || 0)[indexø1]], (y || 0)[(keysø1 || 0)[indexø1]]) ? (loop[0] = inc(indexø1), loop[1] = countø1, loop[2] = keysø1, loop) : false : true;
            } while (indexø1 = loop[0], countø1 = loop[1], keysø1 = loop[2], recur === loop);
            return recur;
        }.call(this);
    }.call(this);
};
var isEquivalent = function isEquivalent(x) {
    var args = Array.prototype.slice.call(arguments, 1);
    return function () {
        var nø1 = args.length;
        return nø1 === 0 ? (function () {
            return true;
        })() : nø1 === 1 ? (function () {
            return function () {
                var yø1 = (args || 0)[0];
                return x === yø1 || (isNil(x) ? (function () {
                    return isNil(yø1);
                })() : isNil(yø1) ? (function () {
                    return isNil(x);
                })() : isString(x) ? (function () {
                    return isString(yø1) && x.toString() === yø1.toString();
                })() : isNumber(x) ? (function () {
                    return isNumber(yø1) && x.valueOf() === yø1.valueOf();
                })() : isSet(x) ? (function () {
                    return isSetEqual(x, yø1);
                })() : isVector(x) || isList(x) || isLazySeq(x) ? (function () {
                    return (isVector(yø1) || isList(yø1) || isLazySeq(yø1)) && isEqual._seqEqual(x, yø1);
                })() : isFn(x) ? (function () {
                    return false;
                })() : isBoolean(x) ? (function () {
                    return false;
                })() : isDate(x) ? (function () {
                    return isDateEqual(x, yø1);
                })() : isRePattern(x) ? (function () {
                    return isPatternEqual(x, yø1);
                })() : (function () {
                    return isDictionaryEqual(x, yø1);
                })());
            }.call(this);
        })() : (function () {
            return function loop() {
                var recur = loop;
                var previousø1 = x;
                var currentø1 = (args || 0)[0];
                var indexø1 = 1;
                do {
                    recur = isEquivalent(previousø1, currentø1) && (indexø1 < nø1 ? (loop[0] = currentø1, loop[1] = (args || 0)[indexø1], loop[2] = inc(indexø1), loop) : true);
                } while (previousø1 = loop[0], currentø1 = loop[1], indexø1 = loop[2], recur === loop);
                return recur;
            }.call(this);
        })();
    }.call(this);
};
var isEqual = exports.isEqual = isEquivalent;
isEqual._wispTypes = _wispTypes;
var notEqual = exports.notEqual = function notEqual(x) {
    var args = Array.prototype.slice.call(arguments, 1);
    return args.length === 0 ? false : !isEqual.apply(null, [x].concat(args));
};
var isStrictEqual = exports.isStrictEqual = function isStrictEqual(x) {
    var args = Array.prototype.slice.call(arguments, 1);
    return function () {
        var nø1 = args.length;
        return nø1 === 0 ? true : function loop() {
            var recur = loop;
            var previousø1 = x;
            var currentø1 = (args || 0)[0];
            var indexø1 = 1;
            do {
                recur = previousø1 === currentø1 && (indexø1 < nø1 ? (loop[0] = currentø1, loop[1] = (args || 0)[indexø1], loop[2] = inc(indexø1), loop) : true);
            } while (previousø1 = loop[0], currentø1 = loop[1], indexø1 = loop[2], recur === loop);
            return recur;
        }.call(this);
    }.call(this);
};
var greaterThan = exports.greaterThan = function greaterThan(x) {
    var args = Array.prototype.slice.call(arguments, 1);
    return function () {
        var nø1 = args.length;
        return nø1 === 0 ? true : function loop() {
            var recur = loop;
            var previousø1 = x;
            var currentø1 = (args || 0)[0];
            var indexø1 = 1;
            do {
                recur = previousø1 > currentø1 && (indexø1 < nø1 ? (loop[0] = currentø1, loop[1] = (args || 0)[indexø1], loop[2] = inc(indexø1), loop) : true);
            } while (previousø1 = loop[0], currentø1 = loop[1], indexø1 = loop[2], recur === loop);
            return recur;
        }.call(this);
    }.call(this);
};
var notLessThan = exports.notLessThan = function notLessThan(x) {
    var args = Array.prototype.slice.call(arguments, 1);
    return function () {
        var nø1 = args.length;
        return nø1 === 0 ? true : function loop() {
            var recur = loop;
            var previousø1 = x;
            var currentø1 = (args || 0)[0];
            var indexø1 = 1;
            do {
                recur = previousø1 >= currentø1 && (indexø1 < nø1 ? (loop[0] = currentø1, loop[1] = (args || 0)[indexø1], loop[2] = inc(indexø1), loop) : true);
            } while (previousø1 = loop[0], currentø1 = loop[1], indexø1 = loop[2], recur === loop);
            return recur;
        }.call(this);
    }.call(this);
};
var lessThan = exports.lessThan = function lessThan(x) {
    var args = Array.prototype.slice.call(arguments, 1);
    return function () {
        var nø1 = args.length;
        return nø1 === 0 ? true : function loop() {
            var recur = loop;
            var previousø1 = x;
            var currentø1 = (args || 0)[0];
            var indexø1 = 1;
            do {
                recur = previousø1 < currentø1 && (indexø1 < nø1 ? (loop[0] = currentø1, loop[1] = (args || 0)[indexø1], loop[2] = inc(indexø1), loop) : true);
            } while (previousø1 = loop[0], currentø1 = loop[1], indexø1 = loop[2], recur === loop);
            return recur;
        }.call(this);
    }.call(this);
};
var notGreaterThan = exports.notGreaterThan = function notGreaterThan(x) {
    var args = Array.prototype.slice.call(arguments, 1);
    return function () {
        var nø1 = args.length;
        return nø1 === 0 ? true : function loop() {
            var recur = loop;
            var previousø1 = x;
            var currentø1 = (args || 0)[0];
            var indexø1 = 1;
            do {
                recur = previousø1 <= currentø1 && (indexø1 < nø1 ? (loop[0] = currentø1, loop[1] = (args || 0)[indexø1], loop[2] = inc(indexø1), loop) : true);
            } while (previousø1 = loop[0], currentø1 = loop[1], indexø1 = loop[2], recur === loop);
            return recur;
        }.call(this);
    }.call(this);
};
var sum = exports.sum = function sum() {
    var args = Array.prototype.slice.call(arguments, 0);
    return function () {
        var nø1 = args.length;
        return nø1 === 0 ? (function () {
            return 0;
        })() : nø1 === 1 ? (function () {
            return (args || 0)[0];
        })() : (function () {
            return function loop() {
                var recur = loop;
                var valueø1 = (args || 0)[0] + (args || 0)[1];
                var indexø1 = 2;
                do {
                    recur = indexø1 < nø1 ? (loop[0] = valueø1 + (args || 0)[indexø1], loop[1] = inc(indexø1), loop) : valueø1;
                } while (valueø1 = loop[0], indexø1 = loop[1], recur === loop);
                return recur;
            }.call(this);
        })();
    }.call(this);
};
var subtract = exports.subtract = function subtract() {
    var args = Array.prototype.slice.call(arguments, 0);
    return function () {
        var nø1 = args.length;
        return nø1 === 0 ? (function () {
            return (function () {
                throw TypeError('Wrong number of args passed to: -');
            })();
        })() : nø1 === 1 ? (function () {
            return 0 - (args || 0)[0];
        })() : (function () {
            return function loop() {
                var recur = loop;
                var valueø1 = (args || 0)[0] - (args || 0)[1];
                var indexø1 = 2;
                do {
                    recur = indexø1 < nø1 ? (loop[0] = valueø1 - (args || 0)[indexø1], loop[1] = inc(indexø1), loop) : valueø1;
                } while (valueø1 = loop[0], indexø1 = loop[1], recur === loop);
                return recur;
            }.call(this);
        })();
    }.call(this);
};
var divide = exports.divide = function divide() {
    var args = Array.prototype.slice.call(arguments, 0);
    return function () {
        var nø1 = args.length;
        return nø1 === 0 ? (function () {
            return (function () {
                throw TypeError('Wrong number of args passed to: /');
            })();
        })() : nø1 === 1 ? (function () {
            return 1 / (args || 0)[0];
        })() : (function () {
            return function loop() {
                var recur = loop;
                var valueø1 = (args || 0)[0] / (args || 0)[1];
                var indexø1 = 2;
                do {
                    recur = indexø1 < nø1 ? (loop[0] = valueø1 / (args || 0)[indexø1], loop[1] = inc(indexø1), loop) : valueø1;
                } while (valueø1 = loop[0], indexø1 = loop[1], recur === loop);
                return recur;
            }.call(this);
        })();
    }.call(this);
};
var multiply = exports.multiply = function multiply() {
    var args = Array.prototype.slice.call(arguments, 0);
    return function () {
        var nø1 = args.length;
        return nø1 === 0 ? (function () {
            return 1;
        })() : nø1 === 1 ? (function () {
            return (args || 0)[0];
        })() : (function () {
            return function loop() {
                var recur = loop;
                var valueø1 = (args || 0)[0] * (args || 0)[1];
                var indexø1 = 2;
                do {
                    recur = indexø1 < nø1 ? (loop[0] = valueø1 * (args || 0)[indexø1], loop[1] = inc(indexø1), loop) : valueø1;
                } while (valueø1 = loop[0], indexø1 = loop[1], recur === loop);
                return recur;
            }.call(this);
        })();
    }.call(this);
};
var quot = exports.quot = function quot(num, div) {
    return int(num / div);
};
var mod = exports.mod = function mod(num, div) {
    return num - div * quot(num, div);
};
var rem_ = exports.rem_ = function rem_(num, div) {
    return function () {
        var mø1 = mod.apply(null, [
            num,
            div
        ]);
        return num >= 0 === div >= 0 ? mø1 : mø1 - div;
    }.call(this);
};
var rem = exports.rem = function () {
    var remø1 = function () {
        return identity(null);
    };
    return isNil(1 % 1);
}.call(this) ? rem_ : function (num, div) {
    return num % div;
};
var and = exports.and = function and() {
    var args = Array.prototype.slice.call(arguments, 0);
    return function () {
        var nø1 = args.length;
        return nø1 === 0 ? (function () {
            return true;
        })() : nø1 === 1 ? (function () {
            return (args || 0)[0];
        })() : (function () {
            return function loop() {
                var recur = loop;
                var valueø1 = (args || 0)[0] && (args || 0)[1];
                var indexø1 = 2;
                do {
                    recur = indexø1 < nø1 ? (loop[0] = valueø1 && (args || 0)[indexø1], loop[1] = inc(indexø1), loop) : valueø1;
                } while (valueø1 = loop[0], indexø1 = loop[1], recur === loop);
                return recur;
            }.call(this);
        })();
    }.call(this);
};
var or = exports.or = function or() {
    var args = Array.prototype.slice.call(arguments, 0);
    return function () {
        var nø1 = args.length;
        return nø1 === 0 ? (function () {
            return null;
        })() : nø1 === 1 ? (function () {
            return (args || 0)[0];
        })() : (function () {
            return function loop() {
                var recur = loop;
                var valueø1 = (args || 0)[0] || (args || 0)[1];
                var indexø1 = 2;
                do {
                    recur = indexø1 < nø1 ? (loop[0] = valueø1 || (args || 0)[indexø1], loop[1] = inc(indexø1), loop) : valueø1;
                } while (valueø1 = loop[0], indexø1 = loop[1], recur === loop);
                return recur;
            }.call(this);
        })();
    }.call(this);
};
var print = exports.print = function print() {
    var more = Array.prototype.slice.call(arguments, 0);
    return console.log.apply(null, more);
};
var max = exports.max = Math.max;
var min = exports.min = Math.min;
var isNan = exports.isNan = isNaN;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndpc3AvcnVudGltZS53aXNwIl0sIm5hbWVzIjpbIl9uc18iLCJpZCIsImRvYyIsIl93aXNwVHlwZXMiLCJPYmplY3QiLCJmcmVlemUiLCJpc0xhenlTZXEiLCJleHBvcnRzIiwidmFsdWUiLCJ0eXBlIiwiaXNJZGVudGl0eVNldCIsImlzTGlzdCIsImlkZW50aXR5IiwieCIsImNvbXBsZW1lbnQiLCJmIiwiYXJncyIsImlzT2RkIiwibiIsImlzRXZlbiIsImdldCIsInRhcmdldCIsImtleSIsImRlZmF1bHRfIiwiaXNTZXQiLCJoYXMiLCJoYXNPd25Qcm9wZXJ0eSIsImlzRGljdGlvbmFyeSIsImZvcm0iLCJpc09iamVjdCIsImdldFByb3RvdHlwZU9mIiwiaXNOaWwiLCJkaWN0aW9uYXJ5IiwicGFpcnMiLCJrZXlWYWx1ZXPDuDEiLCJyZXN1bHTDuDEiLCJsZW5ndGgiLCJzbGljZSIsImtleXMiLCJ2YWxzIiwibWFwIiwia2V5VmFsdWVzIiwibWVyZ2UiLCJjcmVhdGUiLCJwcm90b3R5cGUiLCJBcnJheSIsInByb3RvdHlwZS5zbGljZSIsImNhbGwiLCJhcmd1bWVudHMiLCJyZWR1Y2UiLCJkZXNjcmlwdG9yIiwiZm9yRWFjaCIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsImlzU2F0aXNmaWVzIiwicHJvdG9jb2wiLCJ3aXNwX2NvcmUkSVByb3RvY29sJF8iLCJ3aXNwX2NvcmUkSVByb3RvY29sJG5pbCIsIndpc3BfY29yZSRJUHJvdG9jb2wkaWQiLCJwcm90b3R5cGUudG9TdHJpbmciLCJyZXBsYWNlIiwiaXNDb250YWluc1ZlY3RvciIsInZlY3RvciIsImVsZW1lbnQiLCJpbmRleE9mIiwibWFwRGljdGlvbmFyeSIsInNvdXJjZSIsInRvU3RyaW5nIiwiaXNGbiIsInR5cGVvZiIsImlzRXJyb3IiLCJFcnJvciIsImlzU3RyaW5nIiwiaXNOdW1iZXIiLCJpc1ZlY3RvciIsImlzQXJyYXkiLCJpc0l0ZXJhYmxlIiwiU3ltYm9sIiwiaXRlcmF0b3IiLCJpc0RhdGUiLCJpc0Jvb2xlYW4iLCJpc1JlUGF0dGVybiIsIlNldCIsInVuZGVmaW5lZCIsImlzVHJ1ZSIsImlzRmFsc2UiLCJyZUZpbmQiLCJyZSIsInMiLCJtYXRjaGVzw7gxIiwiZXhlYyIsInJlTWF0Y2hlcyIsInBhdHRlcm4iLCJyZVBhdHRlcm4iLCJtYXRjaMO4MSIsIlJlZ0V4cCIsImluYyIsImRlYyIsInN0ciIsIlN0cmluZyIsInByb3RvdHlwZS5jb25jYXQiLCJhcHBseSIsImNoYXIiLCJjb2RlIiwiZnJvbUNoYXJDb2RlIiwiaW50IiwiTWF0aCIsImZsb29yIiwiY2hhckNvZGVBdCIsInN1YnMiLCJzdHJpbmciLCJzdGFydCIsImVuZCIsInN1YnN0cmluZyIsImlzUGF0dGVybkVxdWFsIiwieSIsImdsb2JhbCIsIm11bHRpbGluZSIsImlnbm9yZUNhc2UiLCJpc0RhdGVFcXVhbCIsIk51bWJlciIsImlzU2V0RXF1YWwiLCJzaXplIiwiZnJvbSIsImV2ZXJ5IiwiJCIsImlzRGljdGlvbmFyeUVxdWFsIiwieEtleXPDuDEiLCJ5S2V5c8O4MSIsInhDb3VudMO4MSIsInlDb3VudMO4MSIsImluZGV4w7gxIiwiY291bnTDuDEiLCJrZXlzw7gxIiwiaXNFcXVpdmFsZW50IiwibsO4MSIsInnDuDEiLCJ2YWx1ZU9mIiwiaXNFcXVhbCIsIl9zZXFFcXVhbCIsInByZXZpb3Vzw7gxIiwiY3VycmVudMO4MSIsIm5vdEVxdWFsIiwiaXNTdHJpY3RFcXVhbCIsImdyZWF0ZXJUaGFuIiwibm90TGVzc1RoYW4iLCJsZXNzVGhhbiIsIm5vdEdyZWF0ZXJUaGFuIiwic3VtIiwidmFsdWXDuDEiLCJzdWJ0cmFjdCIsIlR5cGVFcnJvciIsImRpdmlkZSIsIm11bHRpcGx5IiwicXVvdCIsIm51bSIsImRpdiIsIm1vZCIsInJlbV8iLCJtw7gxIiwicmVtIiwicmVtw7gxIiwiYW5kIiwib3IiLCJwcmludCIsIm1vcmUiLCJjb25zb2xlIiwibG9nIiwibWF4IiwibWluIiwiaXNOYW4iLCJpc05hTiJdLCJtYXBw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QUFBLFlBQUFzSCxHLEdBQVl0SCxJQUFWLENBQUdvQixNQUFMO0FBQUEsUUFDTixPQUFtQmtHLEdBQVosS0FBYyxDQUFyQixHOztZQUFBLEdBQ21CQSxHQUFaLEtBQWMsQyxnQkFBRztBQUFBLG1CLENBQUt0SCxJLE1BQUwsQ0FBVSxDQUFWO0FBQUEsUyxDQUFBLEUsZ0JBQ1o7QUFBQSxtQjs7Z0JBQVEsSUFBQW9JLE8sSUFBZXBJLEksTUFBTCxDQUFVLENBQVYsQ0FBSixJLENBQXNCQSxJLE1BQUwsQ0FBVSxDQUFWLENBQXZCLEM7Z0JBQ0EsSUFBQWtILE8sR0FBTSxDQUFOLEM7OzRCQUNDQSxPQUFILEdBQVNJLEdBQWIsR0FDRSxDLFVBQVdjLE9BQUosSSxDQUFlcEksSSxNQUFMLENBQVVrSCxPQUFWLENBQWpCLEUsVUFBb0NuQyxHQUFELENBQUttQyxPQUFMLENBQW5DLEUsSUFBQSxDQURGLEdBRUVrQixPO3lCQUpJQSxPLFlBQ0FsQixPOztrQkFEUixDLElBQUE7QUFBQSxTLENBQUEsRUFGWixDQURNO0FBQUEsSyxLQUFSLEMsSUFBQSxFO0NBRkYsQ0F4aEJBO0FBbWlCQSxJQUFPaUMsS0FBQSxHQUFBNUosT0FBQSxDQUFBNEosS0FBQSxHQUFQLFNBQU9BLEtBQVAsRztRQUNTQyxJQUFBLEc7SUFDUCxPQUFPQyxPQUFBLENBQVFDLEcsTUFBZixDLElBQUEsRUFBbUJGLElBQW5CLEU7Q0FGRixDQW5pQkE7QUF1aUJBLElBQVFHLEdBQUEsR0FBQWhLLE9BQUEsQ0FBQWdLLEdBQUEsR0FBSTlELElBQUEsQ0FBSzhELEdBQWpCLENBdmlCQTtBQXdpQkEsSUFBUUMsR0FBQSxHQUFBakssT0FBQSxDQUFBaUssR0FBQSxHQUFJL0QsSUFBQSxDQUFLK0QsR0FBakIsQ0F4aUJBO0FBeWlCQSxJQUFRQyxLQUFBLEdBQUFsSyxPQUFBLENBQUFrSyxLQUFBLEdBQUtDLEtBQWIiLCJzb3VyY2VzQ29udGVudCI6WyIobnMgd2lzcC5ydW50aW1lXG4gIFwiQ29yZSBwcmltaXRpdmVzIHJlcXVpcmVkIGZvciBydW50aW1lXCIpXG5cblxuKGRlZnZhci0gLXdpc3AtdHlwZXNcbiAgKE9iamVjdC5mcmVlemVcbiAgICB7Omxpc3QgICAgIFwid2lzcC5saXN0XCJcbiAgICAgOmxhenktc2VxIFwid2lzcC5sYXp5LnNlcVwiXG4gICAgIDpzZXQgICAgICBcIndpc3AuaWRlbnRpdHktc2V0XCJ9KSlcblxuKGRlZnVuIGxhenktc2VxP1xuICAodmFsdWUpXG4gIChhbmQgdmFsdWUgKGlkZW50aWNhbD8gKDpsYXp5LXNlcSAtd2lzcC10eXBlcykgdmFsdWUudHlwZSkpKVxuXG4oZGVmdW4gaWRlbnRpdHktc2V0P1xuICAodmFsdWUpXG4gIChhbmQgdmFsdWUgKGlkZW50aWNhbD8gKDpzZXQgLXdpc3AtdHlwZXMpIHZhbHVlLnR5cGUpKSlcblxuKGRlZnVuIGxpc3Q/XG4gICh2YWx1ZSlcbiAgXCJSZXR1cm5zIHRydWUgaWYgbGlzdFwiXG4gIChhbmQgdmFsdWUgKGlkZW50aWNhbD8gKDpsaXN0IC13aXNwLXR5cGVzKSB2YWx1ZS50eXBlKSkpXG5cblxuKGRlZnVuIGlkZW50aXR5XG4gICh4KVxuICBcIlJldHVybnMgaXRzIGFyZ3VtZW50LlwiXG4gIHgpXG5cbihkZWZ1biBjb21wbGVtZW50XG4gIChmKVxuICBcIlRha2VzIGEgZm4gZiBhbmQgcmV0dXJucyBhIGZuIHRoYXQgdGFrZXMgdGhlIHNhbWUgYXJndW1lbnRzIGFzIGYsXG4gIGhhcyB0aGUgc2FtZSBlZmZlY3RzLCBpZiBhbnksIGFuZCByZXR1cm5zIHRoZSBvcHBvc2l0ZSB0cnV0aCB2YWx1ZS5cIlxuICAobGFtYmRhICgmcmVzdCBhcmdzKSAobm90IChhcHBseSBmIGFyZ3MpKSkpXG5cbihkZWZ1biBvZGQ/IChuKVxuICAoaWRlbnRpY2FsPyAocmVtIG4gMikgMSkpXG5cbihkZWZ1biBldmVuPyAobilcbiAgKGlkZW50aWNhbD8gKHJlbSBuIDIpIDApKVxuXG4oZGVmdW4gZ2V0ICh0YXJnZXQga2V5IGRlZmF1bHQqKVxuICAoY29uZCAoKHNldD8gdGFyZ2V0KSAoaWYgKC5oYXMgdGFyZ2V0IGtleSkga2V5IGRlZmF1bHQqKSlcbiAgICAgICAgKGVsc2UgICAgICAgICAoaWYgKGFuZCB0YXJnZXQgKC5oYXMtb3duLXByb3BlcnR5IHRhcmdldCBrZXkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgKGFnZXQgdGFyZ2V0IGtleSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQqKSkpKVxuXG4oZGVmdW4gZGljdGlvbmFyeT9cbiAgKGZvcm0pXG4gIFwiUmV0dXJucyB0cnVlIGlmIGRpY3Rpb25hcnlcIlxuICAoYW5kIChvYmplY3Q/IGZvcm0pXG4gICAgICAgOzsgSW5oZXJpdHMgcmlnaHQgZm9ybSBPYmplY3QucHJvdG90eXBlXG4gICAgICAgKG9iamVjdD8gKC5nZXQtcHJvdG90eXBlLW9mIE9iamVjdCBmb3JtKSlcbiAgICAgICAobmlsPyAoLmdldC1wcm90b3R5cGUtb2YgT2JqZWN0ICguZ2V0LXByb3RvdHlwZS1vZiBPYmplY3QgZm9ybSkpKSkpXG5cbihkZWZ1biBkaWN0aW9uYXJ5XG4gICgmcmVzdCBwYWlycylcbiAgXCJDcmVhdGVzIGRpY3Rpb25hcnkgb2YgZ2l2ZW4gYXJndW1lbnRzLiBPZGQgaW5kZXhlZCBhcmd1bWVudHNcbiAgYXJlIHVzZWQgZm9yIGtleXMgYW5kIGV2ZW5zIGZvciB2YWx1ZXNcIlxuICA7IFRPRE86IFdlIHNob3VsZCBjb252ZXJ0IGtleXdvcmRzIHRvIG5hbWVzIHRvIG1ha2Ugc3VyZSB0aGF0IGtleXMgYXJlIG5vdFxuICA7IHVzZWQgaW4gdGhlaXIga2V5d29yZCBmb3JtLlxuICAobG9vcCAoKGtleS12YWx1ZXMgcGFpcnMpXG4gICAgICAgICAocmVzdWx0IHt9KSlcbiAgICAoaWYgKC4tbGVuZ3RoIGtleS12YWx1ZXMpXG4gICAgICAocHJvZ25cbiAgICAgICAgKHNldGYgKGFnZXQgcmVzdWx0IChhZ2V0IGtleS12YWx1ZXMgMCkpXG4gICAgICAgICAgICAgIChhZ2V0IGtleS12YWx1ZXMgMSkpXG4gICAgICAgIChyZWN1ciAoLnNsaWNlIGtleS12YWx1ZXMgMikgcmVzdWx0KSlcbiAgICAgIHJlc3VsdCkpKVxuXG4oZGVmdW4ga2V5c1xuICAoZGljdGlvbmFyeSlcbiAgXCJSZXR1cm5zIGEgc2VxdWVuY2Ugb2YgdGhlIG1hcCdzIGtleXNcIlxuICAoLmtleXMgT2JqZWN0IGRpY3Rpb25hcnkpKVxuXG4oZGVmdW4gdmFsc1xuICAoZGljdGlvbmFyeSlcbiAgXCJSZXR1cm5zIGEgc2VxdWVuY2Ugb2YgdGhlIG1hcCdzIHZhbHVlcy5cIlxuICAoLm1hcCAoa2V5cyBkaWN0aW9uYXJ5KVxuICAgICAgICAobGFtYmRhIChrZXkpIChnZXQgZGljdGlvbmFyeSBrZXkpKSkpXG5cbihkZWZ1biBrZXktdmFsdWVzXG4gIChkaWN0aW9uYXJ5KVxuICAoLm1hcCAoa2V5cyBkaWN0aW9uYXJ5KVxuICAgICAgICAobGFtYmRhIChrZXkpIFtrZXkgKGdldCBkaWN0aW9uYXJ5IGtleSldKSkpXG5cbihkZWZ1biBtZXJnZVxuICAoKVxuICBcIlJldHVybnMgYSBkaWN0aW9uYXJ5IHRoYXQgY29uc2lzdHMgb2YgdGhlIHJlc3Qgb2YgdGhlIG1hcHMgY29uai1lZCBvbnRvXG4gIHRoZSBmaXJzdC4gSWYgYSBrZXkgb2NjdXJzIGluIG1vcmUgdGhhbiBvbmUgbWFwLCB0aGUgbWFwcGluZyBmcm9tXG4gIHRoZSBsYXR0ZXIgKGxlZnQtdG8tcmlnaHQpIHdpbGwgYmUgdGhlIG1hcHBpbmcgaW4gdGhlIHJlc3VsdC5cIlxuICAoT2JqZWN0LmNyZWF0ZVxuICAgT2JqZWN0LnByb3RvdHlwZVxuICAgKC5yZWR1Y2VcbiAgICAoLmNhbGwgQXJyYXkucHJvdG90eXBlLnNsaWNlIGFyZ3VtZW50cylcbiAgICAobGFtYmRhIChkZXNjcmlwdG9yIGRpY3Rpb25hcnkpXG4gICAgICAoaWYgKG9iamVjdD8gZGljdGlvbmFyeSlcbiAgICAgICAgKC5mb3ItZWFjaFxuICAgICAgICAgKE9iamVjdC5rZXlzIGRpY3Rpb25hcnkpXG4gICAgICAgICAobGFtYmRhIChrZXkpXG4gICAgICAgICAgIChzZXRmXG4gICAgICAgICAgICAoZ2V0IGRlc2NyaXB0b3Iga2V5KVxuICAgICAgICAgICAgKE9iamVjdC5nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3IgZGljdGlvbmFyeSBrZXkpKSkpKVxuICAgICAgZGVzY3JpcHRvcilcbiAgICAoT2JqZWN0LmNyZWF0ZSBPYmplY3QucHJvdG90eXBlKSkpKVxuXG5cbihkZWZ1biBzYXRpc2ZpZXM/XG4gIChwcm90b2NvbCB4KVxuICBcIlJldHVybnMgdHJ1ZSBpZiB4IHNhdGlzZmllcyB0aGUgcHJvdG9jb2xcIlxuICAob3IgKC4td2lzcF9jb3JlJElQcm90b2NvbCRfIHByb3RvY29sKVxuICAgICAgKGNvbmQgKChuaWw/IHgpXG4gICAgICAgICAgICAob3IgKC4td2lzcF9jb3JlJElQcm90b2NvbCRuaWwgcHJvdG9jb2wpIGZhbHNlKSlcblxuICAgICAgICAgICAgKGVsc2UgKG9yIChhZ2V0IHggKGFnZXQgcHJvdG9jb2wgJ3dpc3BfY29yZSRJUHJvdG9jb2wkaWQpKVxuICAgICAgICAgICAgICAgICAgICAgIChhZ2V0IHByb3RvY29sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKHN0ciBcIndpc3BfY29yZSRJUHJvdG9jb2wkXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgucmVwbGFjZSAoLnJlcGxhY2UgKC5jYWxsIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcgeClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJbb2JqZWN0IFwiIFwiXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgI1wiXFxdJFwiIFwiXCIpKSlcbiAgICAgICAgICAgICAgICAgICAgICBmYWxzZSkpKSkpXG5cbihkZWZ1biBjb250YWlucy12ZWN0b3I/XG4gICh2ZWN0b3IgZWxlbWVudClcbiAgXCJSZXR1cm5zIHRydWUgaWYgdmVjdG9yIGNvbnRhaW5zIGdpdmVuIGVsZW1lbnRcIlxuICAoPj0gKC5pbmRleC1vZiB2ZWN0b3IgZWxlbWVudCkgMCkpXG5cblxuKGRlZnVuIG1hcC1kaWN0aW9uYXJ5XG4gIChzb3VyY2UgZilcbiAgXCJNYXBzIGRpY3Rpb25hcnkgdmFsdWVzIGJ5IGFwcGx5aW5nIGBmYCB0byBlYWNoIG9uZVwiXG4gICgucmVkdWNlICgua2V5cyBPYmplY3Qgc291cmNlKVxuICAgICAgICAgICAobGFtYmRhICh0YXJnZXQga2V5KVxuICAgICAgICAgICAgICAoc2V0ZiAoZ2V0IHRhcmdldCBrZXkpIChmIChnZXQgc291cmNlIGtleSkpKVxuICAgICAgICAgICAgICB0YXJnZXQpIHt9KSlcblxuKGRlZnZhciB0by1zdHJpbmcgT2JqZWN0LnByb3RvdHlwZS50by1zdHJpbmcpXG5cbjs7IFJldHVybnMgdHJ1ZSBpZiB4IGlzIGEgZnVuY3Rpb25cbihkZWZ2YXJcbiAgZm4/XG4gIChpZiAoaWRlbnRpY2FsPyAodHlwZW9mICNcIi5cIikgXCJmdW5jdGlvblwiKVxuICAgIChsYW1iZGFcbiAgICAgICh4KVxuICAgICAgKGlkZW50aWNhbD8gKC5jYWxsIHRvLXN0cmluZyB4KSBcIltvYmplY3QgRnVuY3Rpb25dXCIpKVxuICAgIChsYW1iZGFcbiAgICAgICh4KVxuICAgICAgKGlkZW50aWNhbD8gKHR5cGVvZiB4KSBcImZ1bmN0aW9uXCIpKSkpXG5cbihkZWZ1biBlcnJvcj9cbiAgKHgpXG4gIFwiUmV0dXJucyB0cnVlIGlmIHggaXMgb2YgZXJyb3IgdHlwZVwiXG4gIChvciAoaW5zdGFuY2U/IEVycm9yIHgpXG4gICAgICAoaWRlbnRpY2FsPyAoLmNhbGwgdG8tc3RyaW5nIHgpIFwiW29iamVjdCBFcnJvcl1cIikpKVxuXG4oZGVmdW4gc3RyaW5nP1xuICAoeClcbiAgXCJSZXR1cm4gdHJ1ZSBpZiB4IGlzIGEgc3RyaW5nXCJcbiAgKG9yIChpZGVudGljYWw/ICh0eXBlb2YgeCkgXCJzdHJpbmdcIilcbiAgICAgIChpZGVudGljYWw/ICguY2FsbCB0by1zdHJpbmcgeCkgXCJbb2JqZWN0IFN0cmluZ11cIikpKVxuXG4oZGVmdW4gbnVtYmVyP1xuICAoeClcbiAgXCJSZXR1cm4gdHJ1ZSBpZiB4IGlzIGEgbnVtYmVyXCJcbiAgKG9yIChpZGVudGljYWw/ICh0eXBlb2YgeCkgXCJudW1iZXJcIilcbiAgICAgIChpZGVudGljYWw/ICguY2FsbCB0by1zdHJpbmcgeCkgXCJbb2JqZWN0IE51bWJlcl1cIikpKVxuXG47OyBSZXR1cm5zIHRydWUgaWYgeCBpcyBhIHZlY3RvclxuKGRlZnZhclxuICB2ZWN0b3I/XG4gIChpZiAoZm4/IEFycmF5LmlzQXJyYXkpXG4gICAgQXJyYXkuaXNBcnJheVxuICAgIChsYW1iZGEgKHgpIChpZGVudGljYWw/ICguY2FsbCB0by1zdHJpbmcgeCkgXCJbb2JqZWN0IEFycmF5XVwiKSkpKVxuXG4oZGVmdW4gaXRlcmFibGU/XG4gICh4KVxuICBcIlJldHVybnMgdHJ1ZSBpZiB4IGlzIG9yIGNhbiBwcm9kdWNlIGEgSlMgaXRlcmF0b3JcIlxuICAoZm4/IChnZXQgeCBTeW1ib2wuaXRlcmF0b3IpKSlcblxuKGRlZnVuIGRhdGU/XG4gICh4KVxuICBcIlJldHVybnMgdHJ1ZSBpZiB4IGlzIGEgZGF0ZVwiXG4gIChpZGVudGljYWw/ICguY2FsbCB0by1zdHJpbmcgeCkgXCJbb2JqZWN0IERhdGVdXCIpKVxuXG4oZGVmdW4gYm9vbGVhbj9cbiAgKHgpXG4gIFwiUmV0dXJucyB0cnVlIGlmIHggaXMgYSBib29sZWFuXCJcbiAgKG9yIChpZGVudGljYWw/IHggdHJ1ZSlcbiAgICAgIChpZGVudGljYWw/IHggZmFsc2UpXG4gICAgICAoaWRlbnRpY2FsPyAoLmNhbGwgdG8tc3RyaW5nIHgpIFwiW29iamVjdCBCb29sZWFuXVwiKSkpXG5cbihkZWZ1biByZS1wYXR0ZXJuP1xuICAoeClcbiAgXCJSZXR1cm5zIHRydWUgaWYgeCBpcyBhIHJlZ3VsYXIgZXhwcmVzc2lvblwiXG4gIChpZGVudGljYWw/ICguY2FsbCB0by1zdHJpbmcgeCkgXCJbb2JqZWN0IFJlZ0V4cF1cIikpXG5cbihkZWZ1biBzZXQ/XG4gICh4KVxuICBcIlJldHVybnMgdHJ1ZSBpZiB4IGlzIGEgSlMgU2V0IGluc3RhbmNlXCJcbiAgKGluc3RhbmNlPyBTZXQgeCkpXG5cblxuKGRlZnVuIG9iamVjdD9cbiAgKHgpXG4gIFwiUmV0dXJucyB0cnVlIGlmIHggaXMgYW4gb2JqZWN0XCJcbiAgKGFuZCB4IChpZGVudGljYWw/ICh0eXBlb2YgeCkgXCJvYmplY3RcIikpKVxuXG4oZGVmdW4gbmlsP1xuICAoeClcbiAgXCJSZXR1cm5zIHRydWUgaWYgeCBpcyB1bmRlZmluZWQgb3IgbnVsbFwiXG4gIDs7IGBuaWxgIGNvbXBpbGVzIHRvIHRoZSByZWFsIEpTIGBudWxsYCBsaXRlcmFsIChQaGFzZSAyJ3MgbmlsXG4gIDs7IHNpbmdsZXRvbiksIHNvIGEgYmFyZSBgKGlkZW50aWNhbD8geCBuaWwpYCBubyBsb25nZXIgZGlzdGluZ3Vpc2hlc1xuICA7OyBpdCBmcm9tIGAoaWRlbnRpY2FsPyB4IG51bGwpYCAtLSBib3RoIGNvbXBpbGUgdG8gYHggPT09IG51bGxgLlxuICA7OyBKUydzIG93biBgdW5kZWZpbmVkYCAoZS5nLiBhIG1pc3NpbmcgcmVnZXggY2FwdHVyZSBncm91cCwgYW5cbiAgOzsgYWJzZW50IG9iamVjdCBwcm9wZXJ0eSkgc3RpbGwgbmVlZHMgdG8gY291bnQgYXMgbmlsLWxpa2UgYXQgdGhlXG4gIDs7IGludGVyb3AgYm91bmRhcnksIHNvIGl0J3MgY2hlY2tlZCBleHBsaWNpdGx5IGhlcmUuXG4gIChvciAoaWRlbnRpY2FsPyB4IG5pbClcbiAgICAgIChpZGVudGljYWw/IHggdW5kZWZpbmVkKSkpXG5cbihkZWZ1biB0cnVlP1xuICAoeClcbiAgXCJSZXR1cm5zIHRydWUgaWYgeCBpcyB0cnVlXCJcbiAgKGlkZW50aWNhbD8geCB0cnVlKSlcblxuKGRlZnVuIGZhbHNlP1xuICAoeClcbiAgXCJSZXR1cm5zIHRydWUgaWYgeCBpcyBmYWxzZVwiXG4gIChpZGVudGljYWw/IHggZmFsc2UpKVxuXG4oZGVmdW4gcmUtZmluZFxuICAocmUgcylcbiAgXCJSZXR1cm5zIHRoZSBmaXJzdCByZWdleCBtYXRjaCwgaWYgYW55LCBvZiBzIHRvIHJlLCB1c2luZ1xuICByZS5leGVjKHMpLiBSZXR1cm5zIGEgdmVjdG9yLCBjb250YWluaW5nIGZpcnN0IHRoZSBtYXRjaGluZ1xuICBzdWJzdHJpbmcsIHRoZW4gYW55IGNhcHR1cmluZyBncm91cHMgaWYgdGhlIHJlZ3VsYXIgZXhwcmVzc2lvbiBjb250YWluc1xuICBjYXB0dXJpbmcgZ3JvdXBzLlwiXG4gIChsZXQqICgobWF0Y2hlcyAoLmV4ZWMgcmUgcykpKVxuICAgIChpZiAobm90IChuaWw/IG1hdGNoZXMpKVxuICAgICAgKGlmIChpZGVudGljYWw/ICguLWxlbmd0aCBtYXRjaGVzKSAxKVxuICAgICAgICAoZ2V0IG1hdGNoZXMgMClcbiAgICAgICAgbWF0Y2hlcykpKSlcblxuKGRlZnVuIHJlLW1hdGNoZXNcbiAgKHBhdHRlcm4gc291cmNlKVxuICAobGV0KiAoKG1hdGNoZXMgKC5leGVjIHBhdHRlcm4gc291cmNlKSkpXG4gICAgKGlmIChhbmQgKG5vdCAobmlsPyBtYXRjaGVzKSlcbiAgICAgICAgICAgICAoaWRlbnRpY2FsPyAoZ2V0IG1hdGNoZXMgMCkgc291cmNlKSlcbiAgICAgIChpZiAoaWRlbnRpY2FsPyAoLi1sZW5ndGggbWF0Y2hlcykgMSlcbiAgICAgICAgKGdldCBtYXRjaGVzIDApXG4gICAgICAgIG1hdGNoZXMpKSkpXG5cbihkZWZ1biByZS1wYXR0ZXJuXG4gIChzKVxuICBcIlJldHVybnMgYW4gaW5zdGFuY2Ugb2YgUmVnRXhwIHdoaWNoIGhhcyBjb21waWxlZCB0aGUgcHJvdmlkZWQgc3RyaW5nLlwiXG4gIChsZXQqICgobWF0Y2ggKHJlLWZpbmQgI1wiXig/OlxcKFxcPyhbaWRtc3V4XSopXFwpKT8oLiopXCIgcykpKVxuICAgIChuZXcgUmVnRXhwIChnZXQgbWF0Y2ggMikgKGdldCBtYXRjaCAxKSkpKVxuXG4oZGVmdW4gaW5jXG4gICh4KVxuICAoKyB4IDEpKVxuXG4oZGVmdW4gZGVjXG4gICh4KVxuICAoLSB4IDEpKVxuXG4oZGVmdW4gc3RyXG4gICgpXG4gIFwiV2l0aCBubyBhcmdzLCByZXR1cm5zIHRoZSBlbXB0eSBzdHJpbmcuIFdpdGggb25lIGFyZyB4LCByZXR1cm5zIHgudG9TdHJpbmcoKS5cbiAgV2l0aCBtb3JlIHRoYW4gb25lIGFyZywgcmV0dXJucyB0aGUgY29uY2F0ZW5hdGlvbiBvZiB0aGUgc3RyIHZhbHVlcyBvZiB0aGUgYXJncy5cIlxuICAoLmFwcGx5IFN0cmluZy5wcm90b3R5cGUuY29uY2F0IFwiXCIgYXJndW1lbnRzKSlcblxuKGRlZnVuIGNoYXJcbiAgKGNvZGUpXG4gIFwiQ29lcmNlIHRvIGNoYXJcIlxuICAoLmZyb21DaGFyQ29kZSBTdHJpbmcgY29kZSkpXG5cblxuKGRlZnVuIGludFxuICAoeClcbiAgXCJDb2VyY2UgdG8gaW50IGJ5IHN0cmlwcGluZyBkZWNpbWFsIHBsYWNlcy5cIlxuICAoY29uZCAoKG51bWJlcj8geCkgKC5mbG9vciBNYXRoIHgpKVxuICAgICAgICAoKHN0cmluZz8geCkgKC5jaGFyQ29kZUF0IHggMCkpICAgOyBub3QgbGlrZSBpbiBDbG9qdXJlXG4gICAgICAgIChlbHNlICAgICAgIDApKSkgICAgICAgICAgICAgICAgIDsgbGlrZSBpbiBDbG9qdXJlXG5cbihkZWZ1biBzdWJzXG4gIChzdHJpbmcgc3RhcnQgZW5kKVxuICBcIlJldHVybnMgdGhlIHN1YnN0cmluZyBvZiBzIGJlZ2lubmluZyBhdCBzdGFydCBpbmNsdXNpdmUsIGFuZCBlbmRpbmdcbiAgYXQgZW5kIChkZWZhdWx0cyB0byBsZW5ndGggb2Ygc3RyaW5nKSwgZXhjbHVzaXZlLlwiXG4gICAoLnN1YnN0cmluZyBzdHJpbmcgc3RhcnQgZW5kKSlcblxuKGRlZnVuLSBwYXR0ZXJuLWVxdWFsP1xuICAoeCB5KVxuICAoYW5kIChyZS1wYXR0ZXJuPyB4KVxuICAgICAgIChyZS1wYXR0ZXJuPyB5KVxuICAgICAgIChpZGVudGljYWw/ICguLXNvdXJjZSB4KSAoLi1zb3VyY2UgeSkpXG4gICAgICAgKGlkZW50aWNhbD8gKC4tZ2xvYmFsIHgpICguLWdsb2JhbCB5KSlcbiAgICAgICAoaWRlbnRpY2FsPyAoLi1tdWx0aWxpbmUgeCkgKC4tbXVsdGlsaW5lIHkpKVxuICAgICAgIChpZGVudGljYWw/ICguLWlnbm9yZUNhc2UgeCkgKC4taWdub3JlQ2FzZSB5KSkpKVxuXG4oZGVmdW4tIGRhdGUtZXF1YWw/XG4gICh4IHkpXG4gIChhbmQgKGRhdGU/IHgpXG4gICAgICAgKGRhdGU/IHkpXG4gICAgICAgKGlkZW50aWNhbD8gKE51bWJlciB4KSAoTnVtYmVyIHkpKSkpXG5cblxuKGRlZnVuLSBzZXQtZXF1YWw/XG4gICh4IHkpXG4gIChhbmQgKHNldD8geClcbiAgICAgICAoc2V0PyB5KVxuICAgICAgIChpZGVudGljYWw/IHguc2l6ZSB5LnNpemUpXG4gICAgICAgKC5ldmVyeSAoQXJyYXkuZnJvbSB4KSAobGFtYmRhICglKSAoeS5oYXMgJSkpKSkpXG5cbihkZWZ1bi0gZGljdGlvbmFyeS1lcXVhbD9cbiAgKHggeSlcbiAgKGFuZCAob2JqZWN0PyB4KVxuICAgICAgIChvYmplY3Q/IHkpXG4gICAgICAgKGxldCogKCh4LWtleXMgKGtleXMgeCkpXG4gICAgICAgICAgICAgKHkta2V5cyAoa2V5cyB5KSlcbiAgICAgICAgICAgICAoeC1jb3VudCAoLi1sZW5ndGggeC1rZXlzKSlcbiAgICAgICAgICAgICAoeS1jb3VudCAoLi1sZW5ndGggeS1rZXlzKSkpXG4gICAgICAgICAoYW5kIChpZGVudGljYWw/IHgtY291bnQgeS1jb3VudClcbiAgICAgICAgICAgICAgKGxvb3AgKChpbmRleCAwKVxuICAgICAgICAgICAgICAgICAgICAgKGNvdW50IHgtY291bnQpXG4gICAgICAgICAgICAgICAgICAgICAoa2V5cyB4LWtleXMpKVxuICAgICAgICAgICAgICAgIChpZiAoPCBpbmRleCBjb3VudClcbiAgICAgICAgICAgICAgICAgIChpZiAoZXF1aXZhbGVudD8gKGdldCB4IChnZXQga2V5cyBpbmRleCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChnZXQgeSAoZ2V0IGtleXMgaW5kZXgpKSlcbiAgICAgICAgICAgICAgICAgICAgKHJlY3VyIChpbmMgaW5kZXgpIGNvdW50IGtleXMpXG4gICAgICAgICAgICAgICAgICAgIGZhbHNlKVxuICAgICAgICAgICAgICAgICAgdHJ1ZSkpKSkpKVxuXG4oZGVmdW4tIGVxdWl2YWxlbnQ/XG4gICh4ICZyZXN0IGFyZ3MpXG4gIFwiRXF1YWxpdHkuIFJldHVybnMgdHJ1ZSBpZiB4IGVxdWFscyB5LCBmYWxzZSBpZiBub3QuIENvbXBhcmVzXG4gIG51bWJlcnMgYW5kIGNvbGxlY3Rpb25zIGluIGEgdHlwZS1pbmRlcGVuZGVudCBtYW5uZXIuIENsb2p1cmUnc1xuICBpbW11dGFibGUgZGF0YSBzdHJ1Y3R1cmVzIGRlZmluZSAtZXF1aXYgKGFuZCB0aHVzID0pIGFzIGEgdmFsdWUsXG4gIG5vdCBhbiBpZGVudGl0eSwgY29tcGFyaXNvbi5cIlxuICAobGV0KiAoKG4gKC4tbGVuZ3RoIGFyZ3MpKSlcbiAgICAoY29uZCAoKGlkZW50aWNhbD8gbiAwKSB0cnVlKVxuICAgICAgICAgICgoaWRlbnRpY2FsPyBuIDEpXG4gICAgICAgICAgKGxldCogKCh5IChnZXQgYXJncyAwKSkpXG4gICAgICAgICAgICAob3IgKGlkZW50aWNhbD8geCB5KVxuICAgICAgICAgICAgICAgIChjb25kICgobmlsPyB4KSAobmlsPyB5KSlcbiAgICAgICAgICAgICAgICAgICAgICAoKG5pbD8geSkgKG5pbD8geCkpXG4gICAgICAgICAgICAgICAgICAgICAgKChzdHJpbmc/IHgpIChhbmQgKHN0cmluZz8geSkgKGlkZW50aWNhbD8gKC50b1N0cmluZyB4KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKC50b1N0cmluZyB5KSkpKVxuICAgICAgICAgICAgICAgICAgICAgICgobnVtYmVyPyB4KSAoYW5kIChudW1iZXI/IHkpIChpZGVudGljYWw/ICgudmFsdWVPZiB4KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKC52YWx1ZU9mIHkpKSkpXG4gICAgICAgICAgICAgICAgICAgICAgKChzZXQ/IHgpIChzZXQtZXF1YWw/IHggeSkpXG4gICAgICAgICAgICAgICAgICAgICAgKChvciAodmVjdG9yPyB4KSAobGlzdD8geCkgKGxhenktc2VxPyB4KSkgKGFuZCAob3IgKHZlY3Rvcj8geSkgKGxpc3Q/IHkpIChsYXp5LXNlcT8geSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICg9LipzZXE9IHggeSkpKVxuICAgICAgICAgICAgICAgICAgICAgICgoZm4/IHgpIGZhbHNlKVxuICAgICAgICAgICAgICAgICAgICAgICgoYm9vbGVhbj8geCkgZmFsc2UpXG4gICAgICAgICAgICAgICAgICAgICAgKChkYXRlPyB4KSAoZGF0ZS1lcXVhbD8geCB5KSlcbiAgICAgICAgICAgICAgICAgICAgICAoKHJlLXBhdHRlcm4/IHgpIChwYXR0ZXJuLWVxdWFsPyB4IHkpKVxuICAgICAgICAgICAgICAgICAgICAgIChlbHNlIChkaWN0aW9uYXJ5LWVxdWFsPyB4IHkpKSkpKSlcbiAgICAgICAgICAoZWxzZVxuICAgICAgICAgIChsb29wICgocHJldmlvdXMgeClcbiAgICAgICAgICAgICAgICAgKGN1cnJlbnQgKGdldCBhcmdzIDApKVxuICAgICAgICAgICAgICAgICAoaW5kZXggMSkpXG4gICAgICAgICAgICAoYW5kIChlcXVpdmFsZW50PyBwcmV2aW91cyBjdXJyZW50KVxuICAgICAgICAgICAgICAgICAoaWYgKDwgaW5kZXggbilcbiAgICAgICAgICAgICAgICAgIChyZWN1ciBjdXJyZW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgKGdldCBhcmdzIGluZGV4KVxuICAgICAgICAgICAgICAgICAgICAgICAgIChpbmMgaW5kZXgpKVxuICAgICAgICAgICAgICAgICAgdHJ1ZSkpKSkpKSlcblxuKGRlZnZhciA9IGVxdWl2YWxlbnQ/KVxuKHNldGYgKGFnZXQgPSAnLXdpc3AtdHlwZXMpIC13aXNwLXR5cGVzKVxuXG4oZGVmdW4gbm90PVxuICAoeCAmcmVzdCBhcmdzKVxuICBcIlNhbWUgYXMgKG5vdCAoPSBvYmoxIG9iajIpKVwiXG4gIChpZiAoaWRlbnRpY2FsPyAoLi1sZW5ndGggYXJncykgMClcbiAgICBmYWxzZVxuICAgIChub3QgKGFwcGx5ID0geCBhcmdzKSkpKVxuXG4oZGVmdW4gPT1cbiAgKHggJnJlc3QgYXJncylcbiAgXCJFcXVhbGl0eS4gUmV0dXJucyB0cnVlIGlmIHggZXF1YWxzIHksIGZhbHNlIGlmIG5vdC4gQ29tcGFyZXNcbiAgbnVtYmVycyBhbmQgY29sbGVjdGlvbnMgaW4gYSB0eXBlLWluZGVwZW5kZW50IG1hbm5lci4gQ2xvanVyZSdzXG4gIGltbXV0YWJsZSBkYXRhIHN0cnVjdHVyZXMgZGVmaW5lIC1lcXVpdiAoYW5kIHRodXMgPSkgYXMgYSB2YWx1ZSxcbiAgbm90IGFuIGlkZW50aXR5LCBjb21wYXJpc29uLlwiXG4gIChsZXQqICgobiAoLi1sZW5ndGggYXJncykpKVxuICAgIChpZiAoaWRlbnRpY2FsPyBuIDApXG4gICAgICB0cnVlXG4gICAgICAobG9vcCAoKHByZXZpb3VzIHgpXG4gICAgICAgICAgICAgKGN1cnJlbnQgKGdldCBhcmdzIDApKVxuICAgICAgICAgICAgIChpbmRleCAxKSlcbiAgICAgICAgKGFuZCAoaWRlbnRpY2FsPyBwcmV2aW91cyBjdXJyZW50KVxuICAgICAgICAgICAgIChpZiAoPCBpbmRleCBuKVxuICAgICAgICAgICAgICAocmVjdXIgY3VycmVudFxuICAgICAgICAgICAgICAgICAgICAgKGdldCBhcmdzIGluZGV4KVxuICAgICAgICAgICAgICAgICAgICAgKGluYyBpbmRleCkpXG4gICAgICAgICAgICAgIHRydWUpKSkpKSlcblxuXG4oZGVmdW4gPlxuICAoeCAmcmVzdCBhcmdzKVxuICBcIlJldHVybnMgbm9uLW5pbCBpZiBudW1zIGFyZSBpbiBtb25vdG9uaWNhbGx5IGRlY3JlYXNpbmcgb3JkZXIsXG4gIG90aGVyd2lzZSBmYWxzZS5cIlxuICAobGV0KiAoKG4gKC4tbGVuZ3RoIGFyZ3MpKSlcbiAgICAoaWYgKGlkZW50aWNhbD8gbiAwKVxuICAgICAgdHJ1ZVxuICAgICAgKGxvb3AgKChwcmV2aW91cyB4KVxuICAgICAgICAgICAgIChjdXJyZW50IChnZXQgYXJncyAwKSlcbiAgICAgICAgICAgICAoaW5kZXggMSkpXG4gICAgICAgIChhbmQgKD4gcHJldmlvdXMgY3VycmVudClcbiAgICAgICAgICAgICAoaWYgKDwgaW5kZXggbilcbiAgICAgICAgICAgICAgKHJlY3VyIGN1cnJlbnRcbiAgICAgICAgICAgICAgICAgICAgIChnZXQgYXJncyBpbmRleClcbiAgICAgICAgICAgICAgICAgICAgIChpbmMgaW5kZXgpKVxuICAgICAgICAgICAgICB0cnVlKSkpKSkpXG5cbihkZWZ1biA+PVxuICAoeCAmcmVzdCBhcmdzKVxuICBcIlJldHVybnMgbm9uLW5pbCBpZiBudW1zIGFyZSBpbiBtb25vdG9uaWNhbGx5IG5vbi1pbmNyZWFzaW5nIG9yZGVyLFxuICBvdGhlcndpc2UgZmFsc2UuXCJcbiAgKGxldCogKChuICguLWxlbmd0aCBhcmdzKSkpXG4gICAgKGlmIChpZGVudGljYWw/IG4gMClcbiAgICAgIHRydWVcbiAgICAgIChsb29wICgocHJldmlvdXMgeClcbiAgICAgICAgICAgICAoY3VycmVudCAoZ2V0IGFyZ3MgMCkpXG4gICAgICAgICAgICAgKGluZGV4IDEpKVxuICAgICAgICAoYW5kICg+PSBwcmV2aW91cyBjdXJyZW50KVxuICAgICAgICAgICAgIChpZiAoPCBpbmRleCBuKVxuICAgICAgICAgICAgICAocmVjdXIgY3VycmVudFxuICAgICAgICAgICAgICAgICAgICAgKGdldCBhcmdzIGluZGV4KVxuICAgICAgICAgICAgICAgICAgICAgKGluYyBpbmRleCkpXG4gICAgICAgICAgICAgIHRydWUpKSkpKSlcblxuXG4oZGVmdW4gPFxuICAoeCAmcmVzdCBhcmdzKVxuICBcIlJldHVybnMgbm9uLW5pbCBpZiBudW1zIGFyZSBpbiBtb25vdG9uaWNhbGx5IGluY3JlYXNpbmcgb3JkZXIsXG4gIG90aGVyd2lzZSBmYWxzZS5cIlxuICAobGV0KiAoKG4gKC4tbGVuZ3RoIGFyZ3MpKSlcbiAgICAoaWYgKGlkZW50aWNhbD8gbiAwKVxuICAgICAgdHJ1ZVxuICAgICAgKGxvb3AgKChwcmV2aW91cyB4KVxuICAgICAgICAgICAgIChjdXJyZW50IChnZXQgYXJncyAwKSlcbiAgICAgICAgICAgICAoaW5kZXggMSkpXG4gICAgICAgIChhbmQgKDwgcHJldmlvdXMgY3VycmVudClcbiAgICAgICAgICAgICAoaWYgKDwgaW5kZXggbilcbiAgICAgICAgICAgICAgKHJlY3VyIGN1cnJlbnRcbiAgICAgICAgICAgICAgICAgICAgIChnZXQgYXJncyBpbmRleClcbiAgICAgICAgICAgICAgICAgICAgIChpbmMgaW5kZXgpKVxuICAgICAgICAgICAgICB0cnVlKSkpKSkpXG5cblxuKGRlZnVuIDw9XG4gICh4ICZyZXN0IGFyZ3MpXG4gIFwiUmV0dXJucyBub24tbmlsIGlmIG51bXMgYXJlIGluIG1vbm90b25pY2FsbHkgbm9uLWRlY3JlYXNpbmcgb3JkZXIsXG4gIG90aGVyd2lzZSBmYWxzZS5cIlxuICAobGV0KiAoKG4gKC4tbGVuZ3RoIGFyZ3MpKSlcbiAgICAoaWYgKGlkZW50aWNhbD8gbiAwKVxuICAgICAgdHJ1ZVxuICAgICAgKGxvb3AgKChwcmV2aW91cyB4KVxuICAgICAgICAgICAgIChjdXJyZW50IChnZXQgYXJncyAwKSlcbiAgICAgICAgICAgICAoaW5kZXggMSkpXG4gICAgICAgIChhbmQgKDw9IHByZXZpb3VzIGN1cnJlbnQpXG4gICAgICAgICAgICAgKGlmICg8IGluZGV4IG4pXG4gICAgICAgICAgICAgIChyZWN1ciBjdXJyZW50XG4gICAgICAgICAgICAgICAgICAgICAoZ2V0IGFyZ3MgaW5kZXgpXG4gICAgICAgICAgICAgICAgICAgICAoaW5jIGluZGV4KSlcbiAgICAgICAgICAgICAgdHJ1ZSkpKSkpKVxuXG4oZGVmdW4gK1xuICAoJnJlc3QgYXJncylcbiAgKGxldCogKChuICguLWxlbmd0aCBhcmdzKSkpXG4gICAgKGNvbmQgKChpZGVudGljYWw/IG4gMCkgMClcbiAgICAgICAgICAoKGlkZW50aWNhbD8gbiAxKSAoZ2V0IGFyZ3MgMCkpXG4gICAgICAgICAgKGVsc2UgKGxvb3AgKCh2YWx1ZSAoKyAoZ2V0IGFyZ3MgMCkgKGdldCBhcmdzIDEpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgKGluZGV4IDIpKVxuICAgICAgICAgICAgICAgICAgKGlmICg8IGluZGV4IG4pXG4gICAgICAgICAgICAgICAgICAgIChyZWN1ciAoKyB2YWx1ZSAoZ2V0IGFyZ3MgaW5kZXgpKSAoaW5jIGluZGV4KSlcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUpKSkpKSlcblxuKGRlZnVuIC1cbiAgKCZyZXN0IGFyZ3MpXG4gIChsZXQqICgobiAoLi1sZW5ndGggYXJncykpKVxuICAgIChjb25kICgoaWRlbnRpY2FsPyBuIDApICh0aHJvdyAoVHlwZUVycm9yIFwiV3JvbmcgbnVtYmVyIG9mIGFyZ3MgcGFzc2VkIHRvOiAtXCIpKSlcbiAgICAgICAgICAoKGlkZW50aWNhbD8gbiAxKSAoLSAwIChnZXQgYXJncyAwKSkpXG4gICAgICAgICAgKGVsc2UgKGxvb3AgKCh2YWx1ZSAoLSAoZ2V0IGFyZ3MgMCkgKGdldCBhcmdzIDEpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgKGluZGV4IDIpKVxuICAgICAgICAgICAgICAgICAgKGlmICg8IGluZGV4IG4pXG4gICAgICAgICAgICAgICAgICAgIChyZWN1ciAoLSB2YWx1ZSAoZ2V0IGFyZ3MgaW5kZXgpKSAoaW5jIGluZGV4KSlcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUpKSkpKSlcblxuKGRlZnVuIC9cbiAgKCZyZXN0IGFyZ3MpXG4gIChsZXQqICgobiAoLi1sZW5ndGggYXJncykpKVxuICAgIChjb25kICgoaWRlbnRpY2FsPyBuIDApICh0aHJvdyAoVHlwZUVycm9yIFwiV3JvbmcgbnVtYmVyIG9mIGFyZ3MgcGFzc2VkIHRvOiAvXCIpKSlcbiAgICAgICAgICAoKGlkZW50aWNhbD8gbiAxKSAoLyAxIChnZXQgYXJncyAwKSkpXG4gICAgICAgICAgKGVsc2UgKGxvb3AgKCh2YWx1ZSAoLyAoZ2V0IGFyZ3MgMCkgKGdldCBhcmdzIDEpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgKGluZGV4IDIpKVxuICAgICAgICAgICAgICAgICAgKGlmICg8IGluZGV4IG4pXG4gICAgICAgICAgICAgICAgICAgIChyZWN1ciAoLyB2YWx1ZSAoZ2V0IGFyZ3MgaW5kZXgpKSAoaW5jIGluZGV4KSlcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUpKSkpKSlcblxuKGRlZnVuICpcbiAgKCZyZXN0IGFyZ3MpXG4gIChsZXQqICgobiAoLi1sZW5ndGggYXJncykpKVxuICAgIChjb25kICgoaWRlbnRpY2FsPyBuIDApIDEpXG4gICAgICAgICAgKChpZGVudGljYWw/IG4gMSkgKGdldCBhcmdzIDApKVxuICAgICAgICAgIChlbHNlIChsb29wICgodmFsdWUgKCogKGdldCBhcmdzIDApIChnZXQgYXJncyAxKSkpXG4gICAgICAgICAgICAgICAgICAgICAgIChpbmRleCAyKSlcbiAgICAgICAgICAgICAgICAgIChpZiAoPCBpbmRleCBuKVxuICAgICAgICAgICAgICAgICAgICAocmVjdXIgKCogdmFsdWUgKGdldCBhcmdzIGluZGV4KSkgKGluYyBpbmRleCkpXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlKSkpKSkpXG5cbihkZWZ1biBxdW90IChudW0gZGl2KSAoaW50ICgvIG51bSBkaXYpKSlcbihkZWZ1biBtb2QgKG51bSBkaXYpICgtIG51bSAoKiBkaXYgKHF1b3QgbnVtIGRpdikpKSlcbihkZWZ1biByZW0qIChudW0gZGl2KVxuICAobGV0KiAoKG0gKGFwcGx5IG1vZCBbbnVtIGRpdl0pKSlcbiAgICAoaWYgKGlkZW50aWNhbD8gKD49IG51bSAwKSAoPj0gZGl2IDApKVxuICAgICAgbVxuICAgICAgKC0gbSBkaXYpKSkpXG47OyBjaGVja2luZyBpZiByZW0gaXMgbWFjcm8tc2hhZG93ZWRcbihkZWZ2YXIgcmVtXG4gIChpZiAobGV0KiAoKHJlbSAobGFtYmRhICgpIChpZGVudGl0eSBuaWwpKSkpXG4gICAgICAgIChuaWw/IChyZW0gMSAxKSkpXG4gICAgcmVtKlxuICAgIChsYW1iZGEgKG51bSBkaXYpIChyZW0gbnVtIGRpdikpKSlcblxuKGRlZnVuIGFuZFxuICAoJnJlc3QgYXJncylcbiAgKGxldCogKChuICguLWxlbmd0aCBhcmdzKSkpXG4gICAgKGNvbmQgKChpZGVudGljYWw/IG4gMCkgdHJ1ZSlcbiAgICAgICAgICAoKGlkZW50aWNhbD8gbiAxKSAoZ2V0IGFyZ3MgMCkpXG4gICAgICAgICAgKGVsc2UgKGxvb3AgKCh2YWx1ZSAoYW5kIChnZXQgYXJncyAwKSAoZ2V0IGFyZ3MgMSkpKVxuICAgICAgICAgICAgICAgICAgICAgICAoaW5kZXggMikpXG4gICAgICAgICAgICAgICAgICAoaWYgKDwgaW5kZXggbilcbiAgICAgICAgICAgICAgICAgICAgKHJlY3VyIChhbmQgdmFsdWUgKGdldCBhcmdzIGluZGV4KSkgKGluYyBpbmRleCkpXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlKSkpKSkpXG5cbihkZWZ1biBvclxuICAoJnJlc3QgYXJncylcbiAgKGxldCogKChuICguLWxlbmd0aCBhcmdzKSkpXG4gICAgKGNvbmQgKChpZGVudGljYWw/IG4gMCkgbmlsKVxuICAgICAgICAgICgoaWRlbnRpY2FsPyBuIDEpIChnZXQgYXJncyAwKSlcbiAgICAgICAgICAoZWxzZSAobG9vcCAoKHZhbHVlIChvciAoZ2V0IGFyZ3MgMCkgKGdldCBhcmdzIDEpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgKGluZGV4IDIpKVxuICAgICAgICAgICAgICAgICAgKGlmICg8IGluZGV4IG4pXG4gICAgICAgICAgICAgICAgICAgIChyZWN1ciAob3IgdmFsdWUgKGdldCBhcmdzIGluZGV4KSkgKGluYyBpbmRleCkpXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlKSkpKSkpXG5cbihkZWZ1biBwcmludFxuICAoJnJlc3QgbW9yZSlcbiAgKGFwcGx5IGNvbnNvbGUubG9nIG1vcmUpKVxuXG4oZGVmdmFyIG1heCBNYXRoLm1heClcbihkZWZ2YXIgbWluIE1hdGgubWluKVxuKGRlZnZhciBuYW4/IGlzTmFOKVxuIl19
