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
            switch (arguments.length) {
            case 0:
                return !f();
            case 1:
                var x = arguments[0];
                return !f(x);
            case 2:
                var x = arguments[0];
                var y = arguments[1];
                return !f(x, y);
            default:
                var x = arguments[0];
                var y = arguments[1];
                var zs = Array.prototype.slice.call(arguments, 2);
                return !f.apply(void 0, [
                    x,
                    y
                ].concat(zs));
            }
        };
    };
var isOdd = exports.isOdd = function isOdd(n) {
        return n % 2 === 1;
    };
var isEven = exports.isEven = function isEven(n) {
        return n % 2 === 0;
    };
var get = exports.get = function get(target, key, default_) {
        return isSet(target) ? target.has(key) ? key : default_ : 'else' ? target && target.hasOwnProperty(key) ? target[key] : default_ : void 0;
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
            }) : void 0;
            return descriptor;
        }, Object.create(Object.prototype)));
    };
var isSatisfies = exports.isSatisfies = function isSatisfies(protocol, x) {
        return protocol.wisp_core$IProtocol$_ || (x === void 0 ? protocol.wisp_core$IProtocol$nil || false : x === null ? protocol.wisp_core$IProtocol$nil || false : 'else' ? x[protocol.wisp_core$IProtocol$id] || protocol['' + 'wisp_core$IProtocol$' + Object.prototype.toString.call(x).replace('[object ', '').replace(/\]$/, '')] || false : void 0);
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
        return x === void 0 || x === null;
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
            return !isNil(matchesø1) ? matchesø1.length === 1 ? (matchesø1 || 0)[0] : matchesø1 : void 0;
        }.call(this);
    };
var reMatches = exports.reMatches = function reMatches(pattern, source) {
        return function () {
            var matchesø1 = pattern.exec(source);
            return !isNil(matchesø1) && (matchesø1 || 0)[0] === source ? matchesø1.length === 1 ? (matchesø1 || 0)[0] : matchesø1 : void 0;
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
        return isNumber(x) ? Math.floor(x) : isString(x) ? x.charCodeAt(0) : 'else' ? 0 : void 0;
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
    return isSet(x) && isSet(y) && x.size === y.size && Array.from(x).every(function ($1) {
        return y.has($1);
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
var isEquivalent = function isEquivalent() {
    switch (arguments.length) {
    case 1:
        var x = arguments[0];
        return true;
    case 2:
        var x = arguments[0];
        var y = arguments[1];
        return x === y || (isNil(x) ? isNil(y) : isNil(y) ? isNil(x) : isString(x) ? isString(y) && x.toString() === y.toString() : isNumber(x) ? isNumber(y) && x.valueOf() === y.valueOf() : isSet(x) ? isSetEqual(x, y) : isVector(x) || isList(x) || isLazySeq(x) ? (isVector(y) || isList(y) || isLazySeq(y)) && isEqual._seqEqual(x, y) : isFn(x) ? false : isBoolean(x) ? false : isDate(x) ? isDateEqual(x, y) : isRePattern(x) ? isPatternEqual(x, y) : 'else' ? isDictionaryEqual(x, y) : void 0);
    default:
        var x = arguments[0];
        var y = arguments[1];
        var more = Array.prototype.slice.call(arguments, 2);
        return function loop() {
            var recur = loop;
            var previousø1 = x;
            var currentø1 = y;
            var indexø1 = 0;
            var countø1 = more.length;
            do {
                recur = isEquivalent(previousø1, currentø1) && (indexø1 < countø1 ? (loop[0] = currentø1, loop[1] = (more || 0)[indexø1], loop[2] = inc(indexø1), loop[3] = countø1, loop) : true);
            } while (previousø1 = loop[0], currentø1 = loop[1], indexø1 = loop[2], countø1 = loop[3], recur === loop);
            return recur;
        }.call(this);
    }
};
var isEqual = exports.isEqual = isEquivalent;
isEqual._wispTypes = _wispTypes;
var notEqual = exports.notEqual = function notEqual() {
        switch (arguments.length) {
        case 1:
            var x = arguments[0];
            return false;
        case 2:
            var x = arguments[0];
            var y = arguments[1];
            return !isEqual(x, y);
        default:
            var x = arguments[0];
            var y = arguments[1];
            var more = Array.prototype.slice.call(arguments, 2);
            return !isEqual.apply(void 0, [
                x,
                y
            ].concat(more));
        }
    };
var isStrictEqual = exports.isStrictEqual = function isStrictEqual() {
        switch (arguments.length) {
        case 1:
            var x = arguments[0];
            return true;
        case 2:
            var x = arguments[0];
            var y = arguments[1];
            return x === y;
        default:
            var x = arguments[0];
            var y = arguments[1];
            var more = Array.prototype.slice.call(arguments, 2);
            return function loop() {
                var recur = loop;
                var previousø1 = x;
                var currentø1 = y;
                var indexø1 = 0;
                var countø1 = more.length;
                do {
                    recur = previousø1 == currentø1 && (indexø1 < countø1 ? (loop[0] = currentø1, loop[1] = (more || 0)[indexø1], loop[2] = inc(indexø1), loop[3] = countø1, loop) : true);
                } while (previousø1 = loop[0], currentø1 = loop[1], indexø1 = loop[2], countø1 = loop[3], recur === loop);
                return recur;
            }.call(this);
        }
    };
var greaterThan = exports.greaterThan = function greaterThan() {
        switch (arguments.length) {
        case 1:
            var x = arguments[0];
            return true;
        case 2:
            var x = arguments[0];
            var y = arguments[1];
            return x > y;
        default:
            var x = arguments[0];
            var y = arguments[1];
            var more = Array.prototype.slice.call(arguments, 2);
            return function loop() {
                var recur = loop;
                var previousø1 = x;
                var currentø1 = y;
                var indexø1 = 0;
                var countø1 = more.length;
                do {
                    recur = previousø1 > currentø1 && (indexø1 < countø1 ? (loop[0] = currentø1, loop[1] = (more || 0)[indexø1], loop[2] = inc(indexø1), loop[3] = countø1, loop) : true);
                } while (previousø1 = loop[0], currentø1 = loop[1], indexø1 = loop[2], countø1 = loop[3], recur === loop);
                return recur;
            }.call(this);
        }
    };
var notLessThan = exports.notLessThan = function notLessThan() {
        switch (arguments.length) {
        case 1:
            var x = arguments[0];
            return true;
        case 2:
            var x = arguments[0];
            var y = arguments[1];
            return x >= y;
        default:
            var x = arguments[0];
            var y = arguments[1];
            var more = Array.prototype.slice.call(arguments, 2);
            return function loop() {
                var recur = loop;
                var previousø1 = x;
                var currentø1 = y;
                var indexø1 = 0;
                var countø1 = more.length;
                do {
                    recur = previousø1 >= currentø1 && (indexø1 < countø1 ? (loop[0] = currentø1, loop[1] = (more || 0)[indexø1], loop[2] = inc(indexø1), loop[3] = countø1, loop) : true);
                } while (previousø1 = loop[0], currentø1 = loop[1], indexø1 = loop[2], countø1 = loop[3], recur === loop);
                return recur;
            }.call(this);
        }
    };
var lessThan = exports.lessThan = function lessThan() {
        switch (arguments.length) {
        case 1:
            var x = arguments[0];
            return true;
        case 2:
            var x = arguments[0];
            var y = arguments[1];
            return x < y;
        default:
            var x = arguments[0];
            var y = arguments[1];
            var more = Array.prototype.slice.call(arguments, 2);
            return function loop() {
                var recur = loop;
                var previousø1 = x;
                var currentø1 = y;
                var indexø1 = 0;
                var countø1 = more.length;
                do {
                    recur = previousø1 < currentø1 && (indexø1 < countø1 ? (loop[0] = currentø1, loop[1] = (more || 0)[indexø1], loop[2] = inc(indexø1), loop[3] = countø1, loop) : true);
                } while (previousø1 = loop[0], currentø1 = loop[1], indexø1 = loop[2], countø1 = loop[3], recur === loop);
                return recur;
            }.call(this);
        }
    };
var notGreaterThan = exports.notGreaterThan = function notGreaterThan() {
        switch (arguments.length) {
        case 1:
            var x = arguments[0];
            return true;
        case 2:
            var x = arguments[0];
            var y = arguments[1];
            return x <= y;
        default:
            var x = arguments[0];
            var y = arguments[1];
            var more = Array.prototype.slice.call(arguments, 2);
            return function loop() {
                var recur = loop;
                var previousø1 = x;
                var currentø1 = y;
                var indexø1 = 0;
                var countø1 = more.length;
                do {
                    recur = previousø1 <= currentø1 && (indexø1 < countø1 ? (loop[0] = currentø1, loop[1] = (more || 0)[indexø1], loop[2] = inc(indexø1), loop[3] = countø1, loop) : true);
                } while (previousø1 = loop[0], currentø1 = loop[1], indexø1 = loop[2], countø1 = loop[3], recur === loop);
                return recur;
            }.call(this);
        }
    };
var sum = exports.sum = function sum() {
        switch (arguments.length) {
        case 0:
            return 0;
        case 1:
            var a = arguments[0];
            return a;
        case 2:
            var a = arguments[0];
            var b = arguments[1];
            return a + b;
        case 3:
            var a = arguments[0];
            var b = arguments[1];
            var c = arguments[2];
            return a + b + c;
        case 4:
            var a = arguments[0];
            var b = arguments[1];
            var c = arguments[2];
            var d = arguments[3];
            return a + b + c + d;
        case 5:
            var a = arguments[0];
            var b = arguments[1];
            var c = arguments[2];
            var d = arguments[3];
            var e = arguments[4];
            return a + b + c + d + e;
        case 6:
            var a = arguments[0];
            var b = arguments[1];
            var c = arguments[2];
            var d = arguments[3];
            var e = arguments[4];
            var f = arguments[5];
            return a + b + c + d + e + f;
        default:
            var a = arguments[0];
            var b = arguments[1];
            var c = arguments[2];
            var d = arguments[3];
            var e = arguments[4];
            var f = arguments[5];
            var more = Array.prototype.slice.call(arguments, 6);
            return function loop() {
                var recur = loop;
                var valueø1 = a + b + c + d + e + f;
                var indexø1 = 0;
                var countø1 = more.length;
                do {
                    recur = indexø1 < countø1 ? (loop[0] = valueø1 + (more || 0)[indexø1], loop[1] = inc(indexø1), loop[2] = countø1, loop) : valueø1;
                } while (valueø1 = loop[0], indexø1 = loop[1], countø1 = loop[2], recur === loop);
                return recur;
            }.call(this);
        }
    };
var subtract = exports.subtract = function subtract() {
        switch (arguments.length) {
        case 0:
            return (function () {
                throw TypeError('Wrong number of args passed to: -');
            })();
        case 1:
            var a = arguments[0];
            return 0 - a;
        case 2:
            var a = arguments[0];
            var b = arguments[1];
            return a - b;
        case 3:
            var a = arguments[0];
            var b = arguments[1];
            var c = arguments[2];
            return a - b - c;
        case 4:
            var a = arguments[0];
            var b = arguments[1];
            var c = arguments[2];
            var d = arguments[3];
            return a - b - c - d;
        case 5:
            var a = arguments[0];
            var b = arguments[1];
            var c = arguments[2];
            var d = arguments[3];
            var e = arguments[4];
            return a - b - c - d - e;
        case 6:
            var a = arguments[0];
            var b = arguments[1];
            var c = arguments[2];
            var d = arguments[3];
            var e = arguments[4];
            var f = arguments[5];
            return a - b - c - d - e - f;
        default:
            var a = arguments[0];
            var b = arguments[1];
            var c = arguments[2];
            var d = arguments[3];
            var e = arguments[4];
            var f = arguments[5];
            var more = Array.prototype.slice.call(arguments, 6);
            return function loop() {
                var recur = loop;
                var valueø1 = a - b - c - d - e - f;
                var indexø1 = 0;
                var countø1 = more.length;
                do {
                    recur = indexø1 < countø1 ? (loop[0] = valueø1 - (more || 0)[indexø1], loop[1] = inc(indexø1), loop[2] = countø1, loop) : valueø1;
                } while (valueø1 = loop[0], indexø1 = loop[1], countø1 = loop[2], recur === loop);
                return recur;
            }.call(this);
        }
    };
var divide = exports.divide = function divide() {
        switch (arguments.length) {
        case 0:
            return (function () {
                throw TypeError('Wrong number of args passed to: /');
            })();
        case 1:
            var a = arguments[0];
            return 1 / a;
        case 2:
            var a = arguments[0];
            var b = arguments[1];
            return a / b;
        case 3:
            var a = arguments[0];
            var b = arguments[1];
            var c = arguments[2];
            return a / b / c;
        case 4:
            var a = arguments[0];
            var b = arguments[1];
            var c = arguments[2];
            var d = arguments[3];
            return a / b / c / d;
        case 5:
            var a = arguments[0];
            var b = arguments[1];
            var c = arguments[2];
            var d = arguments[3];
            var e = arguments[4];
            return a / b / c / d / e;
        case 6:
            var a = arguments[0];
            var b = arguments[1];
            var c = arguments[2];
            var d = arguments[3];
            var e = arguments[4];
            var f = arguments[5];
            return a / b / c / d / e / f;
        default:
            var a = arguments[0];
            var b = arguments[1];
            var c = arguments[2];
            var d = arguments[3];
            var e = arguments[4];
            var f = arguments[5];
            var more = Array.prototype.slice.call(arguments, 6);
            return function loop() {
                var recur = loop;
                var valueø1 = a / b / c / d / e / f;
                var indexø1 = 0;
                var countø1 = more.length;
                do {
                    recur = indexø1 < countø1 ? (loop[0] = valueø1 / (more || 0)[indexø1], loop[1] = inc(indexø1), loop[2] = countø1, loop) : valueø1;
                } while (valueø1 = loop[0], indexø1 = loop[1], countø1 = loop[2], recur === loop);
                return recur;
            }.call(this);
        }
    };
var multiply = exports.multiply = function multiply() {
        switch (arguments.length) {
        case 0:
            return 1;
        case 1:
            var a = arguments[0];
            return a;
        case 2:
            var a = arguments[0];
            var b = arguments[1];
            return a * b;
        case 3:
            var a = arguments[0];
            var b = arguments[1];
            var c = arguments[2];
            return a * b * c;
        case 4:
            var a = arguments[0];
            var b = arguments[1];
            var c = arguments[2];
            var d = arguments[3];
            return a * b * c * d;
        case 5:
            var a = arguments[0];
            var b = arguments[1];
            var c = arguments[2];
            var d = arguments[3];
            var e = arguments[4];
            return a * b * c * d * e;
        case 6:
            var a = arguments[0];
            var b = arguments[1];
            var c = arguments[2];
            var d = arguments[3];
            var e = arguments[4];
            var f = arguments[5];
            return a * b * c * d * e * f;
        default:
            var a = arguments[0];
            var b = arguments[1];
            var c = arguments[2];
            var d = arguments[3];
            var e = arguments[4];
            var f = arguments[5];
            var more = Array.prototype.slice.call(arguments, 6);
            return function loop() {
                var recur = loop;
                var valueø1 = a * b * c * d * e * f;
                var indexø1 = 0;
                var countø1 = more.length;
                do {
                    recur = indexø1 < countø1 ? (loop[0] = valueø1 * (more || 0)[indexø1], loop[1] = inc(indexø1), loop[2] = countø1, loop) : valueø1;
                } while (valueø1 = loop[0], indexø1 = loop[1], countø1 = loop[2], recur === loop);
                return recur;
            }.call(this);
        }
    };
var quot = exports.quot = function quot(num, div) {
        return int(num / div);
    };
var mod = exports.mod = function mod(num, div) {
        return num - div * quot(num, div);
    };
var rem_ = exports.rem_ = function rem_(num, div) {
        return function () {
            var mø1 = mod.apply(void 0, [
                    num,
                    div
                ]);
            return num >= 0 === div >= 0 ? mø1 : mø1 - div;
        }.call(this);
    };
var rem = exports.rem = function () {
        var remø1 = function () {
            return identity(void 0);
        };
        return isNil(1 % 1);
    }.call(this) ? rem_ : function (num, div) {
        return num % div;
    };
var and = exports.and = function and() {
        switch (arguments.length) {
        case 0:
            return true;
        case 1:
            var a = arguments[0];
            return a;
        case 2:
            var a = arguments[0];
            var b = arguments[1];
            return a && b;
        case 3:
            var a = arguments[0];
            var b = arguments[1];
            var c = arguments[2];
            return a && b && c;
        case 4:
            var a = arguments[0];
            var b = arguments[1];
            var c = arguments[2];
            var d = arguments[3];
            return a && b && c && d;
        case 5:
            var a = arguments[0];
            var b = arguments[1];
            var c = arguments[2];
            var d = arguments[3];
            var e = arguments[4];
            return a && b && c && d && e;
        case 6:
            var a = arguments[0];
            var b = arguments[1];
            var c = arguments[2];
            var d = arguments[3];
            var e = arguments[4];
            var f = arguments[5];
            return a && b && c && d && e && f;
        default:
            var a = arguments[0];
            var b = arguments[1];
            var c = arguments[2];
            var d = arguments[3];
            var e = arguments[4];
            var f = arguments[5];
            var more = Array.prototype.slice.call(arguments, 6);
            return function loop() {
                var recur = loop;
                var valueø1 = a && b && c && d && e && f;
                var indexø1 = 0;
                var countø1 = more.length;
                do {
                    recur = indexø1 < countø1 ? (loop[0] = valueø1 && (more || 0)[indexø1], loop[1] = inc(indexø1), loop[2] = countø1, loop) : valueø1;
                } while (valueø1 = loop[0], indexø1 = loop[1], countø1 = loop[2], recur === loop);
                return recur;
            }.call(this);
        }
    };
var or = exports.or = function or() {
        switch (arguments.length) {
        case 0:
            return void 0;
        case 1:
            var a = arguments[0];
            return a;
        case 2:
            var a = arguments[0];
            var b = arguments[1];
            return a || b;
        case 3:
            var a = arguments[0];
            var b = arguments[1];
            var c = arguments[2];
            return a || b || c;
        case 4:
            var a = arguments[0];
            var b = arguments[1];
            var c = arguments[2];
            var d = arguments[3];
            return a || b || c || d;
        case 5:
            var a = arguments[0];
            var b = arguments[1];
            var c = arguments[2];
            var d = arguments[3];
            var e = arguments[4];
            return a || b || c || d || e;
        case 6:
            var a = arguments[0];
            var b = arguments[1];
            var c = arguments[2];
            var d = arguments[3];
            var e = arguments[4];
            var f = arguments[5];
            return a || b || c || d || e || f;
        default:
            var a = arguments[0];
            var b = arguments[1];
            var c = arguments[2];
            var d = arguments[3];
            var e = arguments[4];
            var f = arguments[5];
            var more = Array.prototype.slice.call(arguments, 6);
            return function loop() {
                var recur = loop;
                var valueø1 = a || b || c || d || e || f;
                var indexø1 = 0;
                var countø1 = more.length;
                do {
                    recur = indexø1 < countø1 ? (loop[0] = valueø1 || (more || 0)[indexø1], loop[1] = inc(indexø1), loop[2] = countø1, loop) : valueø1;
                } while (valueø1 = loop[0], indexø1 = loop[1], countø1 = loop[2], recur === loop);
                return recur;
            }.call(this);
        }
    };
var print = exports.print = function print() {
        var more = Array.prototype.slice.call(arguments, 0);
        return console.log.apply(void 0, more);
    };
var max = exports.max = Math.max;
var min = exports.min = Math.min;
var isNan = exports.isNan = isNaN;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndpc3AvcnVudGltZS53aXNwIl0sIm5hbWVzIjpbIl9uc18iLCJpZCIsImRvYyIsIl93aXNwVHlwZXMiLCJPYmplY3QiLCJmcmVlemUiLCJpc0xhenlTZXEiLCJleHBvcnRzIiwidmFsdWUiLCJ0eXBlIiwiaXNJZGVudGl0eVNldCIsImlzTGlzdCIsImlkZW50aXR5IiwieCIsImNvbXBsZW1lbnQiLCJmIiwieSIsInpzIiwiaXNPZGQiLCJuIiwiaXNFdmVuIiwiZ2V0IiwidGFyZ2V0Iiwia2V5IiwiZGVmYXVsdF8iLCJpc1NldCIsImhhcyIsImhhc093blByb3BlcnR5IiwiaXNEaWN0aW9uYXJ5IiwiZm9ybSIsImlzT2JqZWN0IiwiZ2V0UHJvdG90eXBlT2YiLCJpc05pbCIsImRpY3Rpb25hcnkiLCJwYWlycyIsImtleVZhbHVlc8O4MSIsInJlc3VsdMO4MSIsImxlbmd0aCIsInNsaWNlIiwia2V5cyIsInZhbHMiLCJtYXAiLCJrZXlWYWx1ZXMiLCJtZXJnZSIsImNyZWF0ZSIsInByb3RvdHlwZSIsIkFycmF5IiwicHJvdG90eXBlLnNsaWNlIiwiY2FsbCIsImFyZ3VtZW50cyIsInJlZHVjZSIsImRlc2NyaXB0b3IiLCJmb3JFYWNoIiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIiwiaXNTYXRpc2ZpZXMiLCJwcm90b2NvbCIsIndpc3BfY29yZSRJUHJvdG9jb2wkXyIsIndpc3BfY29yZSRJUHJvdG9jb2wkbmlsIiwibnVsbCIsIndpc3BfY29yZSRJUHJvdG9jb2wkaWQiLCJwcm90b3R5cGUudG9TdHJpbmciLCJyZXBsYWNlIiwiaXNDb250YWluc1ZlY3RvciIsInZlY3RvciIsImVsZW1lbnQiLCJpbmRleE9mIiwibWFwRGljdGlvbmFyeSIsInNvdXJjZSIsInRvU3RyaW5nIiwiaXNGbiIsInR5cGVvZiIsImlzRXJyb3IiLCJFcnJvciIsImlzU3RyaW5nIiwiaXNOdW1iZXIiLCJpc1ZlY3RvciIsImlzQXJyYXkiLCJpc0l0ZXJhYmxlIiwiU3ltYm9sIiwiaXRlcmF0b3IiLCJpc0RhdGUiLCJpc0Jvb2xlYW4iLCJpc1JlUGF0dGVybiIsIlNldCIsImlzVHJ1ZSIsImlzRmFsc2UiLCJyZUZpbmQiLCJyZSIsInMiLCJtYXRjaGVzw7gxIiwiZXhlYyIsInJlTWF0Y2hlcyIsInBhdHRlcm4iLCJyZVBhdHRlcm4iLCJtYXRjaMO4MSIsIlJlZ0V4cCIsImluYyIsImRlYyIsInN0ciIsIlN0cmluZyIsInByb3RvdHlwZS5jb25jYXQiLCJhcHBseSIsImNoYXIiLCJjb2RlIiwiZnJvbUNoYXJDb2RlIiwiaW50IiwiTWF0aCIsImZsb29yIiwiY2hhckNvZGVBdCIsInN1YnMiLCJzdHJpbmciLCJzdGFydCIsImVuZCIsInN1YnN0cmluZyIsImlzUGF0dGVybkVxdWFsIiwiZ2xvYmFsIiwibXVsdGlsaW5lIiwiaWdub3JlQ2FzZSIsImlzRGF0ZUVxdWFsIiwiTnVtYmVyIiwiaXNTZXRFcXVhbCIsInNpemUiLCJmcm9tIiwiZXZlcnkiLCIkMSIsImlzRGljdGlvbmFyeUVxdWFsIiwieEtleXPDuDEiLCJ5S2V5c8O4MSIsInhDb3VudMO4MSIsInlDb3VudMO4MSIsImluZGV4w7gxIiwiY291bnTDuDEiLCJrZXlzw7gxIiwiaXNFcXVpdmFsZW50IiwidmFsdWVPZiIsImlzRXF1YWwiLCJfc2VxRXF1YWwiLCJtb3JlIiwicHJldmlvdXPDuDEiLCJjdXJyZW50w7gxIiwibm90RXF1YWwiLCJpc1N0cmljdEVxdWFsIiwiZ3JlYXRlclRoYW4iLCJub3RMZXNzVGhhbiIsImxlc3NUaGFuIiwibm90R3JlYXRlclRoYW4iLCJzdW0iLCJhIiwiYiIsImMiLCJkIiwiZSIsInZhbHVlw7gxIiwic3VidHJhY3QiLCJUeXBlRXJyb3IiLCJkaXZpZGUiLCJtdWx0aXBseSIsInF1b3QiLCJudW0iLCJkaXYiLCJtb2QiLCJyZW1fIiwibcO4MSIsInJlbSIsInJlbcO4MSIsImFuZCIsIm9yIiwicHJpbnQiLCJjb25zb2xlIiwibG9nIiwibWF4IiwibWluIiwiaXNOYW4iLCJpc05hTiJdLCJtYXBw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LElBQWN4SSxDQUFkLEM7O2dCQUNib0ksQ0FBQSxHO2dCQUFFQyxDQUFBLEc7Z0JBQUVDLENBQUEsRztnQkFBRUMsQ0FBQSxHO2dCQUFFQyxDQUFBLEc7Z0JBQUV4SSxDQUFBLEc7Z0JBQUkwSCxJQUFBLEc7WUFDZixPOztnQkFBTyxJQUFBZSxPLEdBQVVMLEMsSUFBRUMsQyxJQUFFQyxDLElBQUVDLEMsSUFBRUMsQ0FBWixJQUFjeEksQ0FBcEIsQztnQkFDQSxJQUFBbUgsTyxHQUFNLENBQU4sQztnQkFDQSxJQUFBQyxPLEdBQWdCTSxJQUFWLENBQUdwRyxNQUFULEM7OzRCQUNFNkYsT0FBSCxHQUFTQyxPQUFiLEdBQ0UsQyxVQUFXcUIsT0FBSixJLENBQWVmLEksTUFBTCxDQUFVUCxPQUFWLENBQWpCLEUsVUFDUWxDLEdBQUQsQ0FBS2tDLE9BQUwsQ0FEUCxFLFVBRU9DLE9BRlAsRSxJQUFBLENBREYsR0FJRXFCLE87eUJBUEdBLE8sWUFDQXRCLE8sWUFDQUMsTzs7a0JBRlAsQyxJQUFBLEU7O0tBVEgsQ0EvakJBO0FBaWxCQSxJQUFNb0MsS0FBQSxHQUFBaEssT0FBQSxDQUFBZ0ssS0FBQSxHQUFOLFNBQU1BLEtBQU4sRztZQUNLOUIsSUFBQSxHO1FBQ0gsT0FBTytCLE9BQUEsQ0FBUUMsRyxNQUFmLEMsTUFBQSxFQUFtQmhDLElBQW5CLEU7S0FGRixDQWpsQkE7QUFxbEJBLElBQUtpQyxHQUFBLEdBQUFuSyxPQUFBLENBQUFtSyxHQUFBLEdBQUloRSxJQUFBLENBQUtnRSxHQUFkLENBcmxCQTtBQXNsQkEsSUFBS0MsR0FBQSxHQUFBcEssT0FBQSxDQUFBb0ssR0FBQSxHQUFJakUsSUFBQSxDQUFLaUUsR0FBZCxDQXRsQkE7QUF1bEJBLElBQUtDLEtBQUEsR0FBQXJLLE9BQUEsQ0FBQXFLLEtBQUEsR0FBS0MsS0FBViIsInNvdXJjZXNDb250ZW50IjpbIihucyB3aXNwLnJ1bnRpbWVcbiAgXCJDb3JlIHByaW1pdGl2ZXMgcmVxdWlyZWQgZm9yIHJ1bnRpbWVcIilcblxuXG4oZGVmIF46cHJpdmF0ZSAtd2lzcC10eXBlc1xuICAoT2JqZWN0LmZyZWV6ZVxuICAgIHs6bGlzdCAgICAgXCJ3aXNwLmxpc3RcIlxuICAgICA6bGF6eS1zZXEgXCJ3aXNwLmxhenkuc2VxXCJcbiAgICAgOnNldCAgICAgIFwid2lzcC5pZGVudGl0eS1zZXRcIn0pKVxuXG4oZGVmbiBsYXp5LXNlcT9cbiAgW3ZhbHVlXVxuICAoYW5kIHZhbHVlIChpZGVudGljYWw/ICg6bGF6eS1zZXEgLXdpc3AtdHlwZXMpIHZhbHVlLnR5cGUpKSlcblxuKGRlZm4gaWRlbnRpdHktc2V0P1xuICBbdmFsdWVdXG4gIChhbmQgdmFsdWUgKGlkZW50aWNhbD8gKDpzZXQgLXdpc3AtdHlwZXMpIHZhbHVlLnR5cGUpKSlcblxuKGRlZm4gbGlzdD9cbiAgXCJSZXR1cm5zIHRydWUgaWYgbGlzdFwiXG4gIFt2YWx1ZV1cbiAgKGFuZCB2YWx1ZSAoaWRlbnRpY2FsPyAoOmxpc3QgLXdpc3AtdHlwZXMpIHZhbHVlLnR5cGUpKSlcblxuXG4oZGVmbiBpZGVudGl0eVxuICBcIlJldHVybnMgaXRzIGFyZ3VtZW50LlwiXG4gIFt4XSB4KVxuXG4oZGVmbiBjb21wbGVtZW50XG4gIFwiVGFrZXMgYSBmbiBmIGFuZCByZXR1cm5zIGEgZm4gdGhhdCB0YWtlcyB0aGUgc2FtZSBhcmd1bWVudHMgYXMgZixcbiAgaGFzIHRoZSBzYW1lIGVmZmVjdHMsIGlmIGFueSwgYW5kIHJldHVybnMgdGhlIG9wcG9zaXRlIHRydXRoIHZhbHVlLlwiXG4gIFtmXSAoZm5cbiAgICAgICAgKFtdIChub3QgKGYpKSlcbiAgICAgICAgKFt4XSAobm90IChmIHgpKSlcbiAgICAgICAgKFt4IHldIChub3QgKGYgeCB5KSkpXG4gICAgICAgIChbeCB5ICYgenNdIChub3QgKGFwcGx5IGYgeCB5IHpzKSkpKSlcblxuKGRlZm4gXmJvb2xlYW4gb2RkPyBbbl1cbiAgKGlkZW50aWNhbD8gKHJlbSBuIDIpIDEpKVxuXG4oZGVmbiBeYm9vbGVhbiBldmVuPyBbbl1cbiAgKGlkZW50aWNhbD8gKHJlbSBuIDIpIDApKVxuXG4oZGVmbiBnZXQgW3RhcmdldCBrZXkgZGVmYXVsdCpdXG4gIChjb25kIChzZXQ/IHRhcmdldCkgKGlmICguaGFzIHRhcmdldCBrZXkpIGtleSBkZWZhdWx0KilcbiAgICAgICAgOmVsc2UgICAgICAgICAoaWYgKGFuZCB0YXJnZXQgKC5oYXMtb3duLXByb3BlcnR5IHRhcmdldCBrZXkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgKGFnZXQgdGFyZ2V0IGtleSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQqKSkpXG5cbihkZWZuIF5ib29sZWFuIGRpY3Rpb25hcnk/XG4gIFwiUmV0dXJucyB0cnVlIGlmIGRpY3Rpb25hcnlcIlxuICBbZm9ybV1cbiAgKGFuZCAob2JqZWN0PyBmb3JtKVxuICAgICAgIDs7IEluaGVyaXRzIHJpZ2h0IGZvcm0gT2JqZWN0LnByb3RvdHlwZVxuICAgICAgIChvYmplY3Q/ICguZ2V0LXByb3RvdHlwZS1vZiBPYmplY3QgZm9ybSkpXG4gICAgICAgKG5pbD8gKC5nZXQtcHJvdG90eXBlLW9mIE9iamVjdCAoLmdldC1wcm90b3R5cGUtb2YgT2JqZWN0IGZvcm0pKSkpKVxuXG4oZGVmbiBkaWN0aW9uYXJ5XG4gIFwiQ3JlYXRlcyBkaWN0aW9uYXJ5IG9mIGdpdmVuIGFyZ3VtZW50cy4gT2RkIGluZGV4ZWQgYXJndW1lbnRzXG4gIGFyZSB1c2VkIGZvciBrZXlzIGFuZCBldmVucyBmb3IgdmFsdWVzXCJcbiAgWyYgcGFpcnNdXG4gIDsgVE9ETzogV2Ugc2hvdWxkIGNvbnZlcnQga2V5d29yZHMgdG8gbmFtZXMgdG8gbWFrZSBzdXJlIHRoYXQga2V5cyBhcmUgbm90XG4gIDsgdXNlZCBpbiB0aGVpciBrZXl3b3JkIGZvcm0uXG4gIChsb29wIFtrZXktdmFsdWVzIHBhaXJzXG4gICAgICAgICByZXN1bHQge31dXG4gICAgKGlmICguLWxlbmd0aCBrZXktdmFsdWVzKVxuICAgICAgKGRvXG4gICAgICAgIChzZXQhIChhZ2V0IHJlc3VsdCAoYWdldCBrZXktdmFsdWVzIDApKVxuICAgICAgICAgICAgICAoYWdldCBrZXktdmFsdWVzIDEpKVxuICAgICAgICAocmVjdXIgKC5zbGljZSBrZXktdmFsdWVzIDIpIHJlc3VsdCkpXG4gICAgICByZXN1bHQpKSlcblxuKGRlZm4ga2V5c1xuICBcIlJldHVybnMgYSBzZXF1ZW5jZSBvZiB0aGUgbWFwJ3Mga2V5c1wiXG4gIFtkaWN0aW9uYXJ5XVxuICAoLmtleXMgT2JqZWN0IGRpY3Rpb25hcnkpKVxuXG4oZGVmbiB2YWxzXG4gIFwiUmV0dXJucyBhIHNlcXVlbmNlIG9mIHRoZSBtYXAncyB2YWx1ZXMuXCJcbiAgW2RpY3Rpb25hcnldXG4gICgubWFwIChrZXlzIGRpY3Rpb25hcnkpXG4gICAgICAgIChmbiBba2V5XSAoZ2V0IGRpY3Rpb25hcnkga2V5KSkpKVxuXG4oZGVmbiBrZXktdmFsdWVzXG4gIFtkaWN0aW9uYXJ5XVxuICAoLm1hcCAoa2V5cyBkaWN0aW9uYXJ5KVxuICAgICAgICAoZm4gW2tleV0gW2tleSAoZ2V0IGRpY3Rpb25hcnkga2V5KV0pKSlcblxuKGRlZm4gbWVyZ2VcbiAgXCJSZXR1cm5zIGEgZGljdGlvbmFyeSB0aGF0IGNvbnNpc3RzIG9mIHRoZSByZXN0IG9mIHRoZSBtYXBzIGNvbmotZWQgb250b1xuICB0aGUgZmlyc3QuIElmIGEga2V5IG9jY3VycyBpbiBtb3JlIHRoYW4gb25lIG1hcCwgdGhlIG1hcHBpbmcgZnJvbVxuICB0aGUgbGF0dGVyIChsZWZ0LXRvLXJpZ2h0KSB3aWxsIGJlIHRoZSBtYXBwaW5nIGluIHRoZSByZXN1bHQuXCJcbiAgW11cbiAgKE9iamVjdC5jcmVhdGVcbiAgIE9iamVjdC5wcm90b3R5cGVcbiAgICgucmVkdWNlXG4gICAgKC5jYWxsIEFycmF5LnByb3RvdHlwZS5zbGljZSBhcmd1bWVudHMpXG4gICAgKGZuIFtkZXNjcmlwdG9yIGRpY3Rpb25hcnldXG4gICAgICAoaWYgKG9iamVjdD8gZGljdGlvbmFyeSlcbiAgICAgICAgKC5mb3ItZWFjaFxuICAgICAgICAgKE9iamVjdC5rZXlzIGRpY3Rpb25hcnkpXG4gICAgICAgICAoZm4gW2tleV1cbiAgICAgICAgICAgKHNldCFcbiAgICAgICAgICAgIChnZXQgZGVzY3JpcHRvciBrZXkpXG4gICAgICAgICAgICAoT2JqZWN0LmdldC1vd24tcHJvcGVydHktZGVzY3JpcHRvciBkaWN0aW9uYXJ5IGtleSkpKSkpXG4gICAgICBkZXNjcmlwdG9yKVxuICAgIChPYmplY3QuY3JlYXRlIE9iamVjdC5wcm90b3R5cGUpKSkpXG5cblxuKGRlZm4gXmJvb2xlYW4gc2F0aXNmaWVzP1xuICBcIlJldHVybnMgdHJ1ZSBpZiB4IHNhdGlzZmllcyB0aGUgcHJvdG9jb2xcIlxuICBbcHJvdG9jb2wgeF1cbiAgKG9yICguLXdpc3BfY29yZSRJUHJvdG9jb2wkXyBwcm90b2NvbClcbiAgICAgIChjb25kIChpZGVudGljYWw/IHggbmlsKVxuICAgICAgICAgICAgKG9yICguLXdpc3BfY29yZSRJUHJvdG9jb2wkbmlsIHByb3RvY29sKSBmYWxzZSlcblxuICAgICAgICAgICAgKGlkZW50aWNhbD8geCBudWxsKVxuICAgICAgICAgICAgKG9yICguLXdpc3BfY29yZSRJUHJvdG9jb2wkbmlsIHByb3RvY29sKSBmYWxzZSlcblxuICAgICAgICAgICAgOmVsc2UgKG9yIChhZ2V0IHggKGFnZXQgcHJvdG9jb2wgJ3dpc3BfY29yZSRJUHJvdG9jb2wkaWQpKVxuICAgICAgICAgICAgICAgICAgICAgIChhZ2V0IHByb3RvY29sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKHN0ciBcIndpc3BfY29yZSRJUHJvdG9jb2wkXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgucmVwbGFjZSAoLnJlcGxhY2UgKC5jYWxsIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcgeClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJbb2JqZWN0IFwiIFwiXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgI1wiXFxdJFwiIFwiXCIpKSlcbiAgICAgICAgICAgICAgICAgICAgICBmYWxzZSkpKSlcblxuKGRlZm4gXmJvb2xlYW4gY29udGFpbnMtdmVjdG9yP1xuICBcIlJldHVybnMgdHJ1ZSBpZiB2ZWN0b3IgY29udGFpbnMgZ2l2ZW4gZWxlbWVudFwiXG4gIFt2ZWN0b3IgZWxlbWVudF1cbiAgKD49ICguaW5kZXgtb2YgdmVjdG9yIGVsZW1lbnQpIDApKVxuXG5cbihkZWZuIG1hcC1kaWN0aW9uYXJ5XG4gIFwiTWFwcyBkaWN0aW9uYXJ5IHZhbHVlcyBieSBhcHBseWluZyBgZmAgdG8gZWFjaCBvbmVcIlxuICBbc291cmNlIGZdXG4gICgucmVkdWNlICgua2V5cyBPYmplY3Qgc291cmNlKVxuICAgICAgICAgICAoZm4gW3RhcmdldCBrZXldXG4gICAgICAgICAgICAgIChzZXQhIChnZXQgdGFyZ2V0IGtleSkgKGYgKGdldCBzb3VyY2Uga2V5KSkpXG4gICAgICAgICAgICAgIHRhcmdldCkge30pKVxuXG4oZGVmIHRvLXN0cmluZyBPYmplY3QucHJvdG90eXBlLnRvLXN0cmluZylcblxuKGRlZlxuICBeezp0YWcgYm9vbGVhblxuICAgIDpkb2MgXCJSZXR1cm5zIHRydWUgaWYgeCBpcyBhIGZ1bmN0aW9uXCJ9XG4gIGZuP1xuICAoaWYgKGlkZW50aWNhbD8gKHR5cGVvZiAjXCIuXCIpIFwiZnVuY3Rpb25cIilcbiAgICAoZm5cbiAgICAgIFt4XVxuICAgICAgKGlkZW50aWNhbD8gKC5jYWxsIHRvLXN0cmluZyB4KSBcIltvYmplY3QgRnVuY3Rpb25dXCIpKVxuICAgIChmblxuICAgICAgW3hdXG4gICAgICAoaWRlbnRpY2FsPyAodHlwZW9mIHgpIFwiZnVuY3Rpb25cIikpKSlcblxuKGRlZm4gXmJvb2xlYW4gZXJyb3I/XG4gIFwiUmV0dXJucyB0cnVlIGlmIHggaXMgb2YgZXJyb3IgdHlwZVwiXG4gIFt4XVxuICAob3IgKGluc3RhbmNlPyBFcnJvciB4KVxuICAgICAgKGlkZW50aWNhbD8gKC5jYWxsIHRvLXN0cmluZyB4KSBcIltvYmplY3QgRXJyb3JdXCIpKSlcblxuKGRlZm4gXmJvb2xlYW4gc3RyaW5nP1xuICBcIlJldHVybiB0cnVlIGlmIHggaXMgYSBzdHJpbmdcIlxuICBbeF1cbiAgKG9yIChpZGVudGljYWw/ICh0eXBlb2YgeCkgXCJzdHJpbmdcIilcbiAgICAgIChpZGVudGljYWw/ICguY2FsbCB0by1zdHJpbmcgeCkgXCJbb2JqZWN0IFN0cmluZ11cIikpKVxuXG4oZGVmbiBeYm9vbGVhbiBudW1iZXI/XG4gIFwiUmV0dXJuIHRydWUgaWYgeCBpcyBhIG51bWJlclwiXG4gIFt4XVxuICAob3IgKGlkZW50aWNhbD8gKHR5cGVvZiB4KSBcIm51bWJlclwiKVxuICAgICAgKGlkZW50aWNhbD8gKC5jYWxsIHRvLXN0cmluZyB4KSBcIltvYmplY3QgTnVtYmVyXVwiKSkpXG5cbihkZWZcbiAgXns6dGFnIGJvb2xlYW5cbiAgICA6ZG9jIFwiUmV0dXJucyB0cnVlIGlmIHggaXMgYSB2ZWN0b3JcIn1cbiAgdmVjdG9yP1xuICAoaWYgKGZuPyBBcnJheS5pc0FycmF5KVxuICAgIEFycmF5LmlzQXJyYXlcbiAgICAoZm4gW3hdIChpZGVudGljYWw/ICguY2FsbCB0by1zdHJpbmcgeCkgXCJbb2JqZWN0IEFycmF5XVwiKSkpKVxuXG4oZGVmbiBeYm9vbGVhbiBpdGVyYWJsZT9cbiAgXCJSZXR1cm5zIHRydWUgaWYgeCBpcyBvciBjYW4gcHJvZHVjZSBhIEpTIGl0ZXJhdG9yXCJcbiAgW3hdXG4gIChmbj8gKGdldCB4IFN5bWJvbC5pdGVyYXRvcikpKVxuXG4oZGVmbiBeYm9vbGVhbiBkYXRlP1xuICBcIlJldHVybnMgdHJ1ZSBpZiB4IGlzIGEgZGF0ZVwiXG4gIFt4XVxuICAoaWRlbnRpY2FsPyAoLmNhbGwgdG8tc3RyaW5nIHgpIFwiW29iamVjdCBEYXRlXVwiKSlcblxuKGRlZm4gXmJvb2xlYW4gYm9vbGVhbj9cbiAgXCJSZXR1cm5zIHRydWUgaWYgeCBpcyBhIGJvb2xlYW5cIlxuICBbeF1cbiAgKG9yIChpZGVudGljYWw/IHggdHJ1ZSlcbiAgICAgIChpZGVudGljYWw/IHggZmFsc2UpXG4gICAgICAoaWRlbnRpY2FsPyAoLmNhbGwgdG8tc3RyaW5nIHgpIFwiW29iamVjdCBCb29sZWFuXVwiKSkpXG5cbihkZWZuIF5ib29sZWFuIHJlLXBhdHRlcm4/XG4gIFwiUmV0dXJucyB0cnVlIGlmIHggaXMgYSByZWd1bGFyIGV4cHJlc3Npb25cIlxuICBbeF1cbiAgKGlkZW50aWNhbD8gKC5jYWxsIHRvLXN0cmluZyB4KSBcIltvYmplY3QgUmVnRXhwXVwiKSlcblxuKGRlZm4gXmJvb2xlYW4gc2V0P1xuICBcIlJldHVybnMgdHJ1ZSBpZiB4IGlzIGEgSlMgU2V0IGluc3RhbmNlXCJcbiAgW3hdXG4gIChpbnN0YW5jZT8gU2V0IHgpKVxuXG5cbihkZWZuIF5ib29sZWFuIG9iamVjdD9cbiAgXCJSZXR1cm5zIHRydWUgaWYgeCBpcyBhbiBvYmplY3RcIlxuICBbeF1cbiAgKGFuZCB4IChpZGVudGljYWw/ICh0eXBlb2YgeCkgXCJvYmplY3RcIikpKVxuXG4oZGVmbiBeYm9vbGVhbiBuaWw/XG4gIFwiUmV0dXJucyB0cnVlIGlmIHggaXMgdW5kZWZpbmVkIG9yIG51bGxcIlxuICBbeF1cbiAgKG9yIChpZGVudGljYWw/IHggbmlsKVxuICAgICAgKGlkZW50aWNhbD8geCBudWxsKSkpXG5cbihkZWZuIF5ib29sZWFuIHRydWU/XG4gIFwiUmV0dXJucyB0cnVlIGlmIHggaXMgdHJ1ZVwiXG4gIFt4XVxuICAoaWRlbnRpY2FsPyB4IHRydWUpKVxuXG4oZGVmbiBeYm9vbGVhbiBmYWxzZT9cbiAgXCJSZXR1cm5zIHRydWUgaWYgeCBpcyBmYWxzZVwiXG4gIFt4XVxuICAoaWRlbnRpY2FsPyB4IGZhbHNlKSlcblxuKGRlZm4gcmUtZmluZFxuICBcIlJldHVybnMgdGhlIGZpcnN0IHJlZ2V4IG1hdGNoLCBpZiBhbnksIG9mIHMgdG8gcmUsIHVzaW5nXG4gIHJlLmV4ZWMocykuIFJldHVybnMgYSB2ZWN0b3IsIGNvbnRhaW5pbmcgZmlyc3QgdGhlIG1hdGNoaW5nXG4gIHN1YnN0cmluZywgdGhlbiBhbnkgY2FwdHVyaW5nIGdyb3VwcyBpZiB0aGUgcmVndWxhciBleHByZXNzaW9uIGNvbnRhaW5zXG4gIGNhcHR1cmluZyBncm91cHMuXCJcbiAgW3JlIHNdXG4gIChsZXQgW21hdGNoZXMgKC5leGVjIHJlIHMpXVxuICAgIChpZiAobm90IChuaWw/IG1hdGNoZXMpKVxuICAgICAgKGlmIChpZGVudGljYWw/ICguLWxlbmd0aCBtYXRjaGVzKSAxKVxuICAgICAgICAoZ2V0IG1hdGNoZXMgMClcbiAgICAgICAgbWF0Y2hlcykpKSlcblxuKGRlZm4gcmUtbWF0Y2hlc1xuICBbcGF0dGVybiBzb3VyY2VdXG4gIChsZXQgW21hdGNoZXMgKC5leGVjIHBhdHRlcm4gc291cmNlKV1cbiAgICAoaWYgKGFuZCAobm90IChuaWw/IG1hdGNoZXMpKVxuICAgICAgICAgICAgIChpZGVudGljYWw/IChnZXQgbWF0Y2hlcyAwKSBzb3VyY2UpKVxuICAgICAgKGlmIChpZGVudGljYWw/ICguLWxlbmd0aCBtYXRjaGVzKSAxKVxuICAgICAgICAoZ2V0IG1hdGNoZXMgMClcbiAgICAgICAgbWF0Y2hlcykpKSlcblxuKGRlZm4gcmUtcGF0dGVyblxuICBcIlJldHVybnMgYW4gaW5zdGFuY2Ugb2YgUmVnRXhwIHdoaWNoIGhhcyBjb21waWxlZCB0aGUgcHJvdmlkZWQgc3RyaW5nLlwiXG4gIFtzXVxuICAobGV0IFttYXRjaCAocmUtZmluZCAjXCJeKD86XFwoXFw/KFtpZG1zdXhdKilcXCkpPyguKilcIiBzKV1cbiAgICAobmV3IFJlZ0V4cCAoZ2V0IG1hdGNoIDIpIChnZXQgbWF0Y2ggMSkpKSlcblxuKGRlZm4gaW5jXG4gIFt4XVxuICAoKyB4IDEpKVxuXG4oZGVmbiBkZWNcbiAgW3hdXG4gICgtIHggMSkpXG5cbihkZWZuIHN0clxuICBcIldpdGggbm8gYXJncywgcmV0dXJucyB0aGUgZW1wdHkgc3RyaW5nLiBXaXRoIG9uZSBhcmcgeCwgcmV0dXJucyB4LnRvU3RyaW5nKCkuXG4gIFdpdGggbW9yZSB0aGFuIG9uZSBhcmcsIHJldHVybnMgdGhlIGNvbmNhdGVuYXRpb24gb2YgdGhlIHN0ciB2YWx1ZXMgb2YgdGhlIGFyZ3MuXCJcbiAgW11cbiAgKC5hcHBseSBTdHJpbmcucHJvdG90eXBlLmNvbmNhdCBcIlwiIGFyZ3VtZW50cykpXG5cbihkZWZuIGNoYXJcbiAgXCJDb2VyY2UgdG8gY2hhclwiXG4gIFtjb2RlXVxuICAoLmZyb21DaGFyQ29kZSBTdHJpbmcgY29kZSkpXG5cblxuKGRlZm4gaW50XG4gIFwiQ29lcmNlIHRvIGludCBieSBzdHJpcHBpbmcgZGVjaW1hbCBwbGFjZXMuXCJcbiAgW3hdXG4gIChjb25kIChudW1iZXI/IHgpICguZmxvb3IgTWF0aCB4KVxuICAgICAgICAoc3RyaW5nPyB4KSAoLmNoYXJDb2RlQXQgeCAwKSAgIDsgbm90IGxpa2UgaW4gQ2xvanVyZVxuICAgICAgICA6ZWxzZSAgICAgICAwKSkgICAgICAgICAgICAgICAgIDsgbGlrZSBpbiBDbG9qdXJlXG5cbihkZWZuIHN1YnNcbiAgXCJSZXR1cm5zIHRoZSBzdWJzdHJpbmcgb2YgcyBiZWdpbm5pbmcgYXQgc3RhcnQgaW5jbHVzaXZlLCBhbmQgZW5kaW5nXG4gIGF0IGVuZCAoZGVmYXVsdHMgdG8gbGVuZ3RoIG9mIHN0cmluZyksIGV4Y2x1c2l2ZS5cIlxuICB7OmFkZGVkIFwiMS4wXCJcbiAgIDpzdGF0aWMgdHJ1ZX1cbiAgIFtzdHJpbmcgc3RhcnQgZW5kXVxuICAgKC5zdWJzdHJpbmcgc3RyaW5nIHN0YXJ0IGVuZCkpXG5cbihkZWZuLSBeYm9vbGVhbiBwYXR0ZXJuLWVxdWFsP1xuICBbeCB5XVxuICAoYW5kIChyZS1wYXR0ZXJuPyB4KVxuICAgICAgIChyZS1wYXR0ZXJuPyB5KVxuICAgICAgIChpZGVudGljYWw/ICguLXNvdXJjZSB4KSAoLi1zb3VyY2UgeSkpXG4gICAgICAgKGlkZW50aWNhbD8gKC4tZ2xvYmFsIHgpICguLWdsb2JhbCB5KSlcbiAgICAgICAoaWRlbnRpY2FsPyAoLi1tdWx0aWxpbmUgeCkgKC4tbXVsdGlsaW5lIHkpKVxuICAgICAgIChpZGVudGljYWw/ICguLWlnbm9yZUNhc2UgeCkgKC4taWdub3JlQ2FzZSB5KSkpKVxuXG4oZGVmbi0gXmJvb2xlYW4gZGF0ZS1lcXVhbD9cbiAgW3ggeV1cbiAgKGFuZCAoZGF0ZT8geClcbiAgICAgICAoZGF0ZT8geSlcbiAgICAgICAoaWRlbnRpY2FsPyAoTnVtYmVyIHgpIChOdW1iZXIgeSkpKSlcblxuXG4oZGVmbi0gXmJvb2xlYW4gc2V0LWVxdWFsP1xuICBbeCB5XVxuICAoYW5kIChzZXQ/IHgpXG4gICAgICAgKHNldD8geSlcbiAgICAgICAoaWRlbnRpY2FsPyB4LnNpemUgeS5zaXplKVxuICAgICAgICguZXZlcnkgKEFycmF5LmZyb20geCkgIyh5LmhhcyAlKSkpKVxuXG4oZGVmbi0gXmJvb2xlYW4gZGljdGlvbmFyeS1lcXVhbD9cbiAgW3ggeV1cbiAgKGFuZCAob2JqZWN0PyB4KVxuICAgICAgIChvYmplY3Q/IHkpXG4gICAgICAgKGxldCBbeC1rZXlzIChrZXlzIHgpXG4gICAgICAgICAgICAgeS1rZXlzIChrZXlzIHkpXG4gICAgICAgICAgICAgeC1jb3VudCAoLi1sZW5ndGggeC1rZXlzKVxuICAgICAgICAgICAgIHktY291bnQgKC4tbGVuZ3RoIHkta2V5cyldXG4gICAgICAgICAoYW5kIChpZGVudGljYWw/IHgtY291bnQgeS1jb3VudClcbiAgICAgICAgICAgICAgKGxvb3AgW2luZGV4IDBcbiAgICAgICAgICAgICAgICAgICAgIGNvdW50IHgtY291bnRcbiAgICAgICAgICAgICAgICAgICAgIGtleXMgeC1rZXlzXVxuICAgICAgICAgICAgICAgIChpZiAoPCBpbmRleCBjb3VudClcbiAgICAgICAgICAgICAgICAgIChpZiAoZXF1aXZhbGVudD8gKGdldCB4IChnZXQga2V5cyBpbmRleCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChnZXQgeSAoZ2V0IGtleXMgaW5kZXgpKSlcbiAgICAgICAgICAgICAgICAgICAgKHJlY3VyIChpbmMgaW5kZXgpIGNvdW50IGtleXMpXG4gICAgICAgICAgICAgICAgICAgIGZhbHNlKVxuICAgICAgICAgICAgICAgICAgdHJ1ZSkpKSkpKVxuXG4oZGVmbi0gXmJvb2xlYW4gZXF1aXZhbGVudD9cbiAgXCJFcXVhbGl0eS4gUmV0dXJucyB0cnVlIGlmIHggZXF1YWxzIHksIGZhbHNlIGlmIG5vdC4gQ29tcGFyZXNcbiAgbnVtYmVycyBhbmQgY29sbGVjdGlvbnMgaW4gYSB0eXBlLWluZGVwZW5kZW50IG1hbm5lci4gQ2xvanVyZSdzXG4gIGltbXV0YWJsZSBkYXRhIHN0cnVjdHVyZXMgZGVmaW5lIC1lcXVpdiAoYW5kIHRodXMgPSkgYXMgYSB2YWx1ZSxcbiAgbm90IGFuIGlkZW50aXR5LCBjb21wYXJpc29uLlwiXG4gIChbeF0gdHJ1ZSlcbiAgKFt4IHldIChvciAoaWRlbnRpY2FsPyB4IHkpXG4gICAgICAgICAgICAgKGNvbmQgKG5pbD8geCkgKG5pbD8geSlcbiAgICAgICAgICAgICAgICAgICAobmlsPyB5KSAobmlsPyB4KVxuICAgICAgICAgICAgICAgICAgIChzdHJpbmc/IHgpIChhbmQgKHN0cmluZz8geSkgKGlkZW50aWNhbD8gKC50b1N0cmluZyB4KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKC50b1N0cmluZyB5KSkpXG4gICAgICAgICAgICAgICAgICAgKG51bWJlcj8geCkgKGFuZCAobnVtYmVyPyB5KSAoaWRlbnRpY2FsPyAoLnZhbHVlT2YgeClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgudmFsdWVPZiB5KSkpXG4gICAgICAgICAgICAgICAgICAgKHNldD8geCkgKHNldC1lcXVhbD8geCB5KVxuICAgICAgICAgICAgICAgICAgIChvciAodmVjdG9yPyB4KSAobGlzdD8geCkgKGxhenktc2VxPyB4KSkgKGFuZCAob3IgKHZlY3Rvcj8geSkgKGxpc3Q/IHkpIChsYXp5LXNlcT8geSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICg9LipzZXE9IHggeSkpXG4gICAgICAgICAgICAgICAgICAgKGZuPyB4KSBmYWxzZVxuICAgICAgICAgICAgICAgICAgIChib29sZWFuPyB4KSBmYWxzZVxuICAgICAgICAgICAgICAgICAgIChkYXRlPyB4KSAoZGF0ZS1lcXVhbD8geCB5KVxuICAgICAgICAgICAgICAgICAgIChyZS1wYXR0ZXJuPyB4KSAocGF0dGVybi1lcXVhbD8geCB5KVxuICAgICAgICAgICAgICAgICAgIDplbHNlIChkaWN0aW9uYXJ5LWVxdWFsPyB4IHkpKSkpXG4gIChbeCB5ICYgbW9yZV1cbiAgIChsb29wIFtwcmV2aW91cyB4XG4gICAgICAgICAgY3VycmVudCB5XG4gICAgICAgICAgaW5kZXggMFxuICAgICAgICAgIGNvdW50ICguLWxlbmd0aCBtb3JlKV1cbiAgICAoYW5kIChlcXVpdmFsZW50PyBwcmV2aW91cyBjdXJyZW50KVxuICAgICAgICAgKGlmICg8IGluZGV4IGNvdW50KVxuICAgICAgICAgIChyZWN1ciBjdXJyZW50XG4gICAgICAgICAgICAgICAgIChnZXQgbW9yZSBpbmRleClcbiAgICAgICAgICAgICAgICAgKGluYyBpbmRleClcbiAgICAgICAgICAgICAgICAgY291bnQpXG4gICAgICAgICAgdHJ1ZSkpKSkpXG5cbihkZWYgPSBlcXVpdmFsZW50PylcbihzZXQhIChhZ2V0ID0gJy13aXNwLXR5cGVzKSAtd2lzcC10eXBlcylcblxuKGRlZm4gXmJvb2xlYW4gbm90PVxuICBcIlNhbWUgYXMgKG5vdCAoPSBvYmoxIG9iajIpKVwiXG4gIChbeF0gZmFsc2UpXG4gIChbeCB5XSAobm90ICg9IHggeSkpKVxuICAoW3ggeSAmIG1vcmVdIChub3QgKGFwcGx5ID0geCB5IG1vcmUpKSkpXG5cbihkZWZuIF5ib29sZWFuID09XG4gIFwiRXF1YWxpdHkuIFJldHVybnMgdHJ1ZSBpZiB4IGVxdWFscyB5LCBmYWxzZSBpZiBub3QuIENvbXBhcmVzXG4gIG51bWJlcnMgYW5kIGNvbGxlY3Rpb25zIGluIGEgdHlwZS1pbmRlcGVuZGVudCBtYW5uZXIuIENsb2p1cmUnc1xuICBpbW11dGFibGUgZGF0YSBzdHJ1Y3R1cmVzIGRlZmluZSAtZXF1aXYgKGFuZCB0aHVzID0pIGFzIGEgdmFsdWUsXG4gIG5vdCBhbiBpZGVudGl0eSwgY29tcGFyaXNvbi5cIlxuICAoW3hdIHRydWUpXG4gIChbeCB5XSAoaWRlbnRpY2FsPyB4IHkpKVxuICAoW3ggeSAmIG1vcmVdXG4gICAobG9vcCBbcHJldmlvdXMgeFxuICAgICAgICAgIGN1cnJlbnQgeVxuICAgICAgICAgIGluZGV4IDBcbiAgICAgICAgICBjb3VudCAoLi1sZW5ndGggbW9yZSldXG4gICAgKGFuZCAoPT0gcHJldmlvdXMgY3VycmVudClcbiAgICAgICAgIChpZiAoPCBpbmRleCBjb3VudClcbiAgICAgICAgICAocmVjdXIgY3VycmVudFxuICAgICAgICAgICAgICAgICAoZ2V0IG1vcmUgaW5kZXgpXG4gICAgICAgICAgICAgICAgIChpbmMgaW5kZXgpXG4gICAgICAgICAgICAgICAgIGNvdW50KVxuICAgICAgICAgIHRydWUpKSkpKVxuXG5cbihkZWZuIF5ib29sZWFuID5cbiAgXCJSZXR1cm5zIG5vbi1uaWwgaWYgbnVtcyBhcmUgaW4gbW9ub3RvbmljYWxseSBkZWNyZWFzaW5nIG9yZGVyLFxuICBvdGhlcndpc2UgZmFsc2UuXCJcbiAgKFt4XSB0cnVlKVxuICAoW3ggeV0gKD4geCB5KSlcbiAgKFt4IHkgJiBtb3JlXVxuICAgKGxvb3AgW3ByZXZpb3VzIHhcbiAgICAgICAgICBjdXJyZW50IHlcbiAgICAgICAgICBpbmRleCAwXG4gICAgICAgICAgY291bnQgKC4tbGVuZ3RoIG1vcmUpXVxuICAgIChhbmQgKD4gcHJldmlvdXMgY3VycmVudClcbiAgICAgICAgIChpZiAoPCBpbmRleCBjb3VudClcbiAgICAgICAgICAocmVjdXIgY3VycmVudFxuICAgICAgICAgICAgICAgICAoZ2V0IG1vcmUgaW5kZXgpXG4gICAgICAgICAgICAgICAgIChpbmMgaW5kZXgpXG4gICAgICAgICAgICAgICAgIGNvdW50KVxuICAgICAgICAgIHRydWUpKSkpKVxuXG4oZGVmbiBeYm9vbGVhbiA+PVxuICBcIlJldHVybnMgbm9uLW5pbCBpZiBudW1zIGFyZSBpbiBtb25vdG9uaWNhbGx5IG5vbi1pbmNyZWFzaW5nIG9yZGVyLFxuICBvdGhlcndpc2UgZmFsc2UuXCJcbiAgKFt4XSB0cnVlKVxuICAoW3ggeV0gKD49IHggeSkpXG4gIChbeCB5ICYgbW9yZV1cbiAgIChsb29wIFtwcmV2aW91cyB4XG4gICAgICAgICAgY3VycmVudCB5XG4gICAgICAgICAgaW5kZXggMFxuICAgICAgICAgIGNvdW50ICguLWxlbmd0aCBtb3JlKV1cbiAgICAoYW5kICg+PSBwcmV2aW91cyBjdXJyZW50KVxuICAgICAgICAgKGlmICg8IGluZGV4IGNvdW50KVxuICAgICAgICAgIChyZWN1ciBjdXJyZW50XG4gICAgICAgICAgICAgICAgIChnZXQgbW9yZSBpbmRleClcbiAgICAgICAgICAgICAgICAgKGluYyBpbmRleClcbiAgICAgICAgICAgICAgICAgY291bnQpXG4gICAgICAgICAgdHJ1ZSkpKSkpXG5cblxuKGRlZm4gXmJvb2xlYW4gPFxuICBcIlJldHVybnMgbm9uLW5pbCBpZiBudW1zIGFyZSBpbiBtb25vdG9uaWNhbGx5IGluY3JlYXNpbmcgb3JkZXIsXG4gIG90aGVyd2lzZSBmYWxzZS5cIlxuICAoW3hdIHRydWUpXG4gIChbeCB5XSAoPCB4IHkpKVxuICAoW3ggeSAmIG1vcmVdXG4gICAobG9vcCBbcHJldmlvdXMgeFxuICAgICAgICAgIGN1cnJlbnQgeVxuICAgICAgICAgIGluZGV4IDBcbiAgICAgICAgICBjb3VudCAoLi1sZW5ndGggbW9yZSldXG4gICAgKGFuZCAoPCBwcmV2aW91cyBjdXJyZW50KVxuICAgICAgICAgKGlmICg8IGluZGV4IGNvdW50KVxuICAgICAgICAgIChyZWN1ciBjdXJyZW50XG4gICAgICAgICAgICAgICAgIChnZXQgbW9yZSBpbmRleClcbiAgICAgICAgICAgICAgICAgKGluYyBpbmRleClcbiAgICAgICAgICAgICAgICAgY291bnQpXG4gICAgICAgICAgdHJ1ZSkpKSkpXG5cblxuKGRlZm4gXmJvb2xlYW4gPD1cbiAgXCJSZXR1cm5zIG5vbi1uaWwgaWYgbnVtcyBhcmUgaW4gbW9ub3RvbmljYWxseSBub24tZGVjcmVhc2luZyBvcmRlcixcbiAgb3RoZXJ3aXNlIGZhbHNlLlwiXG4gIChbeF0gdHJ1ZSlcbiAgKFt4IHldICg8PSB4IHkpKVxuICAoW3ggeSAmIG1vcmVdXG4gICAobG9vcCBbcHJldmlvdXMgeFxuICAgICAgICAgIGN1cnJlbnQgeVxuICAgICAgICAgIGluZGV4IDBcbiAgICAgICAgICBjb3VudCAoLi1sZW5ndGggbW9yZSldXG4gICAgKGFuZCAoPD0gcHJldmlvdXMgY3VycmVudClcbiAgICAgICAgIChpZiAoPCBpbmRleCBjb3VudClcbiAgICAgICAgICAocmVjdXIgY3VycmVudFxuICAgICAgICAgICAgICAgICAoZ2V0IG1vcmUgaW5kZXgpXG4gICAgICAgICAgICAgICAgIChpbmMgaW5kZXgpXG4gICAgICAgICAgICAgICAgIGNvdW50KVxuICAgICAgICAgIHRydWUpKSkpKVxuXG4oZGVmbiBeYm9vbGVhbiArXG4gIChbXSAwKVxuICAoW2FdIGEpXG4gIChbYSBiXSAoKyBhIGIpKVxuICAoW2EgYiBjXSAoKyBhIGIgYykpXG4gIChbYSBiIGMgZF0gKCsgYSBiIGMgZCkpXG4gIChbYSBiIGMgZCBlXSAoKyBhIGIgYyBkIGUpKVxuICAoW2EgYiBjIGQgZSBmXSAoKyBhIGIgYyBkIGUgZikpXG4gIChbYSBiIGMgZCBlIGYgJiBtb3JlXVxuICAgKGxvb3AgW3ZhbHVlICgrIGEgYiBjIGQgZSBmKVxuICAgICAgICAgIGluZGV4IDBcbiAgICAgICAgICBjb3VudCAoLi1sZW5ndGggbW9yZSldXG4gICAgIChpZiAoPCBpbmRleCBjb3VudClcbiAgICAgICAocmVjdXIgKCsgdmFsdWUgKGdldCBtb3JlIGluZGV4KSlcbiAgICAgICAgICAgICAgKGluYyBpbmRleClcbiAgICAgICAgICAgICAgY291bnQpXG4gICAgICAgdmFsdWUpKSkpXG5cbihkZWZuIF5ib29sZWFuIC1cbiAgKFtdICh0aHJvdyAoVHlwZUVycm9yIFwiV3JvbmcgbnVtYmVyIG9mIGFyZ3MgcGFzc2VkIHRvOiAtXCIpKSlcbiAgKFthXSAoLSAwIGEpKVxuICAoW2EgYl0gKC0gYSBiKSlcbiAgKFthIGIgY10gKC0gYSBiIGMpKVxuICAoW2EgYiBjIGRdICgtIGEgYiBjIGQpKVxuICAoW2EgYiBjIGQgZV0gKC0gYSBiIGMgZCBlKSlcbiAgKFthIGIgYyBkIGUgZl0gKC0gYSBiIGMgZCBlIGYpKVxuICAoW2EgYiBjIGQgZSBmICYgbW9yZV1cbiAgIChsb29wIFt2YWx1ZSAoLSBhIGIgYyBkIGUgZilcbiAgICAgICAgICBpbmRleCAwXG4gICAgICAgICAgY291bnQgKC4tbGVuZ3RoIG1vcmUpXVxuICAgICAoaWYgKDwgaW5kZXggY291bnQpXG4gICAgICAgKHJlY3VyICgtIHZhbHVlIChnZXQgbW9yZSBpbmRleCkpXG4gICAgICAgICAgICAgIChpbmMgaW5kZXgpXG4gICAgICAgICAgICAgIGNvdW50KVxuICAgICAgIHZhbHVlKSkpKVxuXG4oZGVmbiBeYm9vbGVhbiAvXG4gIChbXSAodGhyb3cgKFR5cGVFcnJvciBcIldyb25nIG51bWJlciBvZiBhcmdzIHBhc3NlZCB0bzogL1wiKSkpXG4gIChbYV0gKC8gMSBhKSlcbiAgKFthIGJdICgvIGEgYikpXG4gIChbYSBiIGNdICgvIGEgYiBjKSlcbiAgKFthIGIgYyBkXSAoLyBhIGIgYyBkKSlcbiAgKFthIGIgYyBkIGVdICgvIGEgYiBjIGQgZSkpXG4gIChbYSBiIGMgZCBlIGZdICgvIGEgYiBjIGQgZSBmKSlcbiAgKFthIGIgYyBkIGUgZiAmIG1vcmVdXG4gICAobG9vcCBbdmFsdWUgKC8gYSBiIGMgZCBlIGYpXG4gICAgICAgICAgaW5kZXggMFxuICAgICAgICAgIGNvdW50ICguLWxlbmd0aCBtb3JlKV1cbiAgICAgKGlmICg8IGluZGV4IGNvdW50KVxuICAgICAgIChyZWN1ciAoLyB2YWx1ZSAoZ2V0IG1vcmUgaW5kZXgpKVxuICAgICAgICAgICAgICAoaW5jIGluZGV4KVxuICAgICAgICAgICAgICBjb3VudClcbiAgICAgICB2YWx1ZSkpKSlcblxuKGRlZm4gXmJvb2xlYW4gKlxuICAoW10gMSlcbiAgKFthXSBhKVxuICAoW2EgYl0gKCogYSBiKSlcbiAgKFthIGIgY10gKCogYSBiIGMpKVxuICAoW2EgYiBjIGRdICgqIGEgYiBjIGQpKVxuICAoW2EgYiBjIGQgZV0gKCogYSBiIGMgZCBlKSlcbiAgKFthIGIgYyBkIGUgZl0gKCogYSBiIGMgZCBlIGYpKVxuICAoW2EgYiBjIGQgZSBmICYgbW9yZV1cbiAgIChsb29wIFt2YWx1ZSAoKiBhIGIgYyBkIGUgZilcbiAgICAgICAgICBpbmRleCAwXG4gICAgICAgICAgY291bnQgKC4tbGVuZ3RoIG1vcmUpXVxuICAgICAoaWYgKDwgaW5kZXggY291bnQpXG4gICAgICAgKHJlY3VyICgqIHZhbHVlIChnZXQgbW9yZSBpbmRleCkpXG4gICAgICAgICAgICAgIChpbmMgaW5kZXgpXG4gICAgICAgICAgICAgIGNvdW50KVxuICAgICAgIHZhbHVlKSkpKVxuXG4oZGVmbiBeYm9vbGVhbiBxdW90IFtudW0gZGl2XSAoaW50ICgvIG51bSBkaXYpKSlcbihkZWZuIF5ib29sZWFuIG1vZCBbbnVtIGRpdl0gKC0gbnVtICgqIGRpdiAocXVvdCBudW0gZGl2KSkpKVxuKGRlZm4gXmJvb2xlYW4gcmVtKiBbbnVtIGRpdl1cbiAgKGxldCBbbSAoYXBwbHkgbW9kIFtudW0gZGl2XSldXG4gICAgKGlmIChpZGVudGljYWw/ICg+PSBudW0gMCkgKD49IGRpdiAwKSlcbiAgICAgIG1cbiAgICAgICgtIG0gZGl2KSkpKVxuKGRlZiBeYm9vbGVhbiByZW1cbiAgKGlmIChsZXQgW3JlbSAjKGlkZW50aXR5IG5pbCldICAgIDsgY2hlY2tpbmcgaWYgcmVtIGlzIG1hY3JvLXNoYWRvd2VkXG4gICAgICAgIChuaWw/IChyZW0gMSAxKSkpXG4gICAgcmVtKlxuICAgIChmbiBbbnVtIGRpdl0gKHJlbSBudW0gZGl2KSkpKVxuXG4oZGVmbiBeYm9vbGVhbiBhbmRcbiAgKFtdIHRydWUpXG4gIChbYV0gYSlcbiAgKFthIGJdIChhbmQgYSBiKSlcbiAgKFthIGIgY10gKGFuZCBhIGIgYykpXG4gIChbYSBiIGMgZF0gKGFuZCBhIGIgYyBkKSlcbiAgKFthIGIgYyBkIGVdIChhbmQgYSBiIGMgZCBlKSlcbiAgKFthIGIgYyBkIGUgZl0gKGFuZCBhIGIgYyBkIGUgZikpXG4gIChbYSBiIGMgZCBlIGYgJiBtb3JlXVxuICAgKGxvb3AgW3ZhbHVlIChhbmQgYSBiIGMgZCBlIGYpXG4gICAgICAgICAgaW5kZXggMFxuICAgICAgICAgIGNvdW50ICguLWxlbmd0aCBtb3JlKV1cbiAgICAgKGlmICg8IGluZGV4IGNvdW50KVxuICAgICAgIChyZWN1ciAoYW5kIHZhbHVlIChnZXQgbW9yZSBpbmRleCkpXG4gICAgICAgICAgICAgIChpbmMgaW5kZXgpXG4gICAgICAgICAgICAgIGNvdW50KVxuICAgICAgIHZhbHVlKSkpKVxuXG4oZGVmbiBeYm9vbGVhbiBvclxuICAoW10gbmlsKVxuICAoW2FdIGEpXG4gIChbYSBiXSAob3IgYSBiKSlcbiAgKFthIGIgY10gKG9yIGEgYiBjKSlcbiAgKFthIGIgYyBkXSAob3IgYSBiIGMgZCkpXG4gIChbYSBiIGMgZCBlXSAob3IgYSBiIGMgZCBlKSlcbiAgKFthIGIgYyBkIGUgZl0gKG9yIGEgYiBjIGQgZSBmKSlcbiAgKFthIGIgYyBkIGUgZiAmIG1vcmVdXG4gICAobG9vcCBbdmFsdWUgKG9yIGEgYiBjIGQgZSBmKVxuICAgICAgICAgIGluZGV4IDBcbiAgICAgICAgICBjb3VudCAoLi1sZW5ndGggbW9yZSldXG4gICAgIChpZiAoPCBpbmRleCBjb3VudClcbiAgICAgICAocmVjdXIgKG9yIHZhbHVlIChnZXQgbW9yZSBpbmRleCkpXG4gICAgICAgICAgICAgIChpbmMgaW5kZXgpXG4gICAgICAgICAgICAgIGNvdW50KVxuICAgICAgIHZhbHVlKSkpKVxuXG4oZGVmbiBwcmludFxuICBbJiBtb3JlXVxuICAoYXBwbHkgY29uc29sZS5sb2cgbW9yZSkpXG5cbihkZWYgbWF4IE1hdGgubWF4KVxuKGRlZiBtaW4gTWF0aC5taW4pXG4oZGVmIG5hbj8gaXNOYU4pXG4iXX0=
