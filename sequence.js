{
    var _ns_ = {
        id: 'wisp.sequence',
        doc: null
    };
    var wisp_runtime = require('./runtime');
    var isNil = wisp_runtime.isNil;
    var isVector = wisp_runtime.isVector;
    var isFn = wisp_runtime.isFn;
    var isNumber = wisp_runtime.isNumber;
    var isString = wisp_runtime.isString;
    var isDictionary = wisp_runtime.isDictionary;
    var isSet = wisp_runtime.isSet;
    var keyValues = wisp_runtime.keyValues;
    var str = wisp_runtime.str;
    var int = wisp_runtime.int;
    var dec = wisp_runtime.dec;
    var inc = wisp_runtime.inc;
    var min = wisp_runtime.min;
    var merge = wisp_runtime.merge;
    var dictionary = wisp_runtime.dictionary;
    var get = wisp_runtime.get;
    var isIterable = wisp_runtime.isIterable;
    var isEqual = wisp_runtime.isEqual;
    var complement = wisp_runtime.complement;
    var identity = wisp_runtime.identity;
    var isList = wisp_runtime.isList;
    var isLazySeq = wisp_runtime.isLazySeq;
    var isIdentitySet = wisp_runtime.isIdentitySet;
}
var _wispTypes = isEqual._wispTypes;
var listIterator = function listIterator() {
    return function () {
        var selfø1 = this;
        return {
            'next': function () {
                return isEmpty(selfø1) ? { 'done': true } : function () {
                    var xø1 = first(selfø1);
                    selfø1 = rest(selfø1);
                    return { 'value': xø1 };
                }.call(this);
            }
        };
    }.call(this);
};
var seqToString = function seqToString(lparen, rparen) {
    return function () {
        return function loop() {
            var recur = loop;
            var listø1 = this;
            var resultø1 = '';
            do {
                recur = isEmpty(listø1) ? '' + lparen + resultø1.substr(1) + rparen : (loop[0] = rest(listø1), loop[1] = '' + resultø1 + ' ' + function () {
                    var xø1 = first(listø1);
                    return isVector(xø1) ? (function () {
                        return '' + '[' + xø1.join(' ') + ']';
                    })() : isNil(xø1) ? (function () {
                        return 'nil';
                    })() : isString(xø1) ? (function () {
                        return JSON.stringify(xø1);
                    })() : isNumber(xø1) ? (function () {
                        return JSON.stringify(xø1);
                    })() : (function () {
                        return xø1;
                    })();
                }.call(this), loop);
            } while (listø1 = loop[0], resultø1 = loop[1], recur === loop);
            return recur;
        }.call(this);
    };
};
var List = function List(head, tail) {
    this.head = head;
    this.tail = tail || list();
    this.length = isNil(this.tail) || isDictionary(this.tail) || isNumber(this.tail.length) ? inc(count(this.tail)) : null;
    return this;
};
List.prototype.length = 0;
List.type = (_wispTypes || 0)['list'];
List.prototype.type = List.type;
List.prototype.tail = null;
List.prototype.toString = seqToString('(', ')');
List.prototype[Symbol.iterator] = listIterator;
var lazySeqValue = function lazySeqValue(lazySeq) {
    return lazySeq.realized ? lazySeq.x : function () {
        var xø1 = lazySeq.x();
        lazySeq.realized = true;
        isEmpty(xø1) ? lazySeq.length = 0 : null;
        return lazySeq.x = xø1;
    }.call(this);
};
var LazySeq = function LazySeq(realized, x) {
    this.realized = realized || false;
    this.x = x;
    return this;
};
LazySeq.type = (_wispTypes || 0)['lazy-seq'];
LazySeq.prototype.type = LazySeq.type;
LazySeq.prototype[Symbol.iterator] = listIterator;
var lazySeq = exports.lazySeq = function lazySeq(realized, body) {
    return new LazySeq(realized, body);
};
var cloneProtoProps = function cloneProtoProps(from, to) {
    return Object.assign.apply(null, [to].concat(Object.getOwnPropertyNames(from.__proto__).map(function ($) {
        return function () {
            var xø1 = from[$];
            return dictionary($, isFn(xø1) ? xø1.bind(from) : xø1);
        }.call(this);
    })));
};
var identitySet = exports.identitySet = function identitySet() {
    var items = Array.prototype.slice.call(arguments, 0);
    return function () {
        var jsSetø1 = new Set(items);
        var fø1 = function ($1, $2) {
            return get.apply(null, [
                jsSetø1,
                $1,
                $2
            ]);
        };
        cloneProtoProps(jsSetø1, fø1);
        fø1.toString = seqToString('#{', '}');
        fø1.apply = Function.prototype.apply;
        fø1.call = Function.prototype.call;
        fø1.__proto__ = jsSetø1;
        Object.defineProperty(fø1, 'length', { 'value': fø1.size });
        fø1[Symbol.iterator] = fø1.values;
        fø1['type'] = identitySet.type;
        return fø1;
    }.call(this);
};
identitySet.type = (_wispTypes || 0)['set'];
var set = exports.set = identitySet;
var isLazySeq = exports.isLazySeq = isLazySeq;
var isIdentitySet = exports.isIdentitySet = isIdentitySet;
var isList = exports.isList = isList;
isEqual._seqEqual = function (x, y) {
    return (isVector(x) || isSeq(x)) && (isVector(y) || isSeq(y)) && function loop() {
        var recur = loop;
        var xø2 = seq(x);
        var yø2 = seq(y);
        do {
            recur = isVector(xø2) && isVector(yø2) ? (function () {
                return isEqual(count(xø2), count(yø2)) && xø2.every(function ($1, $2) {
                    return isEqual($1, yø2[$2]);
                });
            })() : isEmpty(xø2) || isEmpty(yø2) ? (function () {
                return isEmpty(xø2) && isEmpty(yø2);
            })() : !isEqual(first(xø2), first(yø2)) ? (function () {
                return false;
            })() : (function () {
                return loop[0] = rest(xø2), loop[1] = rest(yø2), loop;
            })();
        } while (xø2 = loop[0], yø2 = loop[1], recur === loop);
        return recur;
    }.call(this);
};
var list = exports.list = function list() {
    return arguments.length === 0 ? null : Array.prototype.slice.call(arguments).reduceRight(function (tail, head) {
        return cons(head, tail);
    }, list());
};
var cons = exports.cons = function cons(head, tail) {
    return new List(head, tail);
};
var isSequential = exports.isSequential = function isSequential(x) {
    return isSeq(x) || isVector(x) || isDictionary(x) || isSet(x) || isString(x);
};
var isNative = function isNative(sequence) {
    return isVector(sequence) || isString(sequence) || isDictionary(sequence);
};
var reverse = exports.reverse = function reverse(sequence) {
    return isVector(sequence) ? vec(sequence).reverse() : into(null, sequence);
};
var range = exports.range = function range() {
    var args = Array.prototype.slice.call(arguments, 0);
    return count(args) === 1 ? (function () {
        return range(0, first(args), 1);
    })() : count(args) === 2 ? (function () {
        return range(first(args), second(args), 1);
    })() : (function () {
        return function () {
            var startø1 = first(args);
            var endø1 = second(args);
            var stepø1 = third(args);
            return stepø1 < 0 ? range(0 - startø1, 0 - endø1, 0 - stepø1).map(function ($) {
                return 0 - $;
            }) : Array.from({ 'length': (endø1 + stepø1 - startø1 - 1) / stepø1 }, function (_, i) {
                return startø1 + i * stepø1;
            });
        }.call(this);
    })();
};
var mapv = exports.mapv = function mapv(f) {
    var sequences = Array.prototype.slice.call(arguments, 1);
    return function () {
        var vectorsø1 = sequences.map(vec);
        var nø1 = min.apply(null, vectorsø1.map(count));
        return range(nø1).map(function (i) {
            return f.apply(null, vectorsø1.map(function ($) {
                return $[i];
            }));
        });
    }.call(this);
};
var map = exports.map = function map(f) {
    var sequences = Array.prototype.slice.call(arguments, 1);
    return function () {
        var resultø1 = mapv.apply(null, [f].concat(sequences));
        return isNative(first(sequences)) ? resultø1 : list.apply(null, resultø1);
    }.call(this);
};
var mapIndexed = exports.mapIndexed = function mapIndexed(f) {
    var sequences = Array.prototype.slice.call(arguments, 1);
    return function () {
        var sequenceø1 = first(sequences);
        var nø1 = count(sequenceø1);
        var indicesø1 = range(nø1);
        return map.apply(null, [
            f,
            isNative(sequenceø1) ? indicesø1 : list.apply(null, indicesø1)
        ].concat(sequences));
    }.call(this);
};
var filter = exports.filter = function filter(isF, sequence) {
    return isNil(sequence) ? (function () {
        return null;
    })() : isSeq(sequence) ? (function () {
        return filterList(isF, sequence);
    })() : isVector(sequence) ? (function () {
        return sequence.filter(function ($) {
            return isF($);
        });
    })() : (function () {
        return filter(isF, seq(sequence));
    })();
};
var filterList = function filterList(isF, sequence) {
    return function loop() {
        var recur = loop;
        var resultø1 = null;
        var itemsø1 = sequence;
        do {
            recur = isEmpty(itemsø1) ? reverse(resultø1) : (loop[0] = isF(first(itemsø1)) ? cons(first(itemsø1), resultø1) : resultø1, loop[1] = rest(itemsø1), loop);
        } while (resultø1 = loop[0], itemsø1 = loop[1], recur === loop);
        return recur;
    }.call(this);
};
var filterv = exports.filterv = function filterv(isF, sequence) {
    return vec(filter(isF, sequence));
};
var reduce = exports.reduce = function reduce(f) {
    var params = Array.prototype.slice.call(arguments, 1);
    return function () {
        var hasInitialø1 = count(params) >= 2;
        var initialø1 = hasInitialø1 ? first(params) : null;
        var sequenceø1 = hasInitialø1 ? second(params) : first(params);
        var stepø1 = function (acc, x) {
            return f(acc, x);
        };
        return hasInitialø1 ? vec(sequenceø1).reduce(stepø1, initialø1) : vec(sequenceø1).reduce(stepø1);
    }.call(this);
};
var count = exports.count = function count(sequence) {
    return sequence && isNumber(sequence.length) ? sequence.length : function () {
        var itø1 = seq(sequence);
        return isNil(itø1) ? (function () {
            return 0;
        })() : isLazySeq(itø1) ? (function () {
            return count(vec(itø1));
        })() : (function () {
            return itø1.length;
        })();
    }.call(this);
};
var isEmpty = exports.isEmpty = function isEmpty(sequence) {
    return function () {
        var itø1 = seq(sequence);
        return 0 === (isLazySeq(itø1) ? (function () {
            first(itø1);
            return itø1.length;
        })() : count(itø1));
    }.call(this);
};
var first = exports.first = function first(sequence) {
    return isNil(sequence) ? (function () {
        return null;
    })() : isList(sequence) ? (function () {
        return sequence.head;
    })() : isVector(sequence) || isString(sequence) ? (function () {
        return (sequence || 0)[0];
    })() : isLazySeq(sequence) ? (function () {
        return first(lazySeqValue(sequence));
    })() : (function () {
        return first(seq(sequence));
    })();
};
var second = exports.second = function second(sequence) {
    return isNil(sequence) ? (function () {
        return null;
    })() : isList(sequence) ? (function () {
        return first(rest(sequence));
    })() : isVector(sequence) || isString(sequence) ? (function () {
        return (sequence || 0)[1];
    })() : isLazySeq(sequence) ? (function () {
        return second(lazySeqValue(sequence));
    })() : (function () {
        return first(rest(seq(sequence)));
    })();
};
var third = exports.third = function third(sequence) {
    return isNil(sequence) ? (function () {
        return null;
    })() : isList(sequence) ? (function () {
        return first(rest(rest(sequence)));
    })() : isVector(sequence) || isString(sequence) ? (function () {
        return (sequence || 0)[2];
    })() : isLazySeq(sequence) ? (function () {
        return third(lazySeqValue(sequence));
    })() : (function () {
        return second(rest(seq(sequence)));
    })();
};
var rest = exports.rest = function rest(sequence) {
    return isNil(sequence) ? (function () {
        return null;
    })() : isList(sequence) ? (function () {
        return sequence.tail;
    })() : isVector(sequence) || isString(sequence) ? (function () {
        return sequence.slice(1);
    })() : isLazySeq(sequence) ? (function () {
        return rest(lazySeqValue(sequence));
    })() : (function () {
        return rest(seq(sequence));
    })();
};
var car = exports.car = function car(sequence) {
    return first(sequence);
};
var cdr = exports.cdr = function cdr(sequence) {
    return rest(sequence);
};
var lastOfList = function lastOfList(list) {
    return function loop() {
        var recur = loop;
        var itemø1 = first(list);
        var itemsø1 = rest(list);
        do {
            recur = isEmpty(itemsø1) ? itemø1 : (loop[0] = first(itemsø1), loop[1] = rest(itemsø1), loop);
        } while (itemø1 = loop[0], itemsø1 = loop[1], recur === loop);
        return recur;
    }.call(this);
};
var last = exports.last = function last(sequence) {
    return isVector(sequence) || isString(sequence) ? (function () {
        return (sequence || 0)[dec(count(sequence))];
    })() : isList(sequence) ? (function () {
        return lastOfList(sequence);
    })() : isNil(sequence) ? (function () {
        return null;
    })() : isLazySeq(sequence) ? (function () {
        return last(lazySeqValue(sequence));
    })() : (function () {
        return last(seq(sequence));
    })();
};
var butlast = exports.butlast = function butlast(sequence) {
    return function () {
        var itemsø1 = isNil(sequence) ? (function () {
            return null;
        })() : isString(sequence) ? (function () {
            return subs(sequence, 0, dec(count(sequence)));
        })() : isVector(sequence) ? (function () {
            return sequence.slice(0, dec(count(sequence)));
        })() : isList(sequence) ? (function () {
            return list.apply(null, butlast(vec(sequence)));
        })() : isLazySeq(sequence) ? (function () {
            return butlast(lazySeqValue(sequence));
        })() : (function () {
            return butlast(seq(sequence));
        })();
        return isEmpty(itemsø1) ? null : itemsø1;
    }.call(this);
};
var take = exports.take = function take(n, sequence) {
    return isNil(sequence) ? (function () {
        return null;
    })() : isVector(sequence) ? (function () {
        return takeFromVector(n, sequence);
    })() : isList(sequence) ? (function () {
        return takeFromList(n, sequence);
    })() : isLazySeq(sequence) ? (function () {
        return n > 0 ? take(n, lazySeqValue(sequence)) : null;
    })() : (function () {
        return take(n, seq(sequence));
    })();
};
var takeWhile = exports.takeWhile = function takeWhile(predicate, sequence) {
    return function loop() {
        var recur = loop;
        var itemsø1 = sequence;
        var resultø1 = [];
        do {
            recur = function () {
                var headø1 = first(itemsø1);
                var tailø1 = rest(itemsø1);
                return !isEmpty(itemsø1) && predicate(headø1) ? (loop[0] = tailø1, loop[1] = conj(resultø1, headø1), loop) : isNative(sequence) ? resultø1 : list.apply(null, resultø1);
            }.call(this);
        } while (itemsø1 = loop[0], resultø1 = loop[1], recur === loop);
        return recur;
    }.call(this);
};
var takeFromVector = function takeFromVector(n, vector) {
    return vector.slice(0, n);
};
var takeFromList = function takeFromList(n, sequence) {
    return function loop() {
        var recur = loop;
        var takenø1 = null;
        var itemsø1 = sequence;
        var nø2 = int(n) || 0;
        do {
            recur = nø2 <= 0 || isEmpty(itemsø1) ? reverse(takenø1) : (loop[0] = cons(first(itemsø1), takenø1), loop[1] = rest(itemsø1), loop[2] = dec(nø2), loop);
        } while (takenø1 = loop[0], itemsø1 = loop[1], nø2 = loop[2], recur === loop);
        return recur;
    }.call(this);
};
var dropFromList = function dropFromList(n, sequence) {
    return function loop() {
        var recur = loop;
        var leftø1 = n;
        var itemsø1 = sequence;
        do {
            recur = leftø1 < 1 || isEmpty(itemsø1) ? itemsø1 : (loop[0] = dec(leftø1), loop[1] = rest(itemsø1), loop);
        } while (leftø1 = loop[0], itemsø1 = loop[1], recur === loop);
        return recur;
    }.call(this);
};
var drop = exports.drop = function drop(n, sequence) {
    return n <= 0 ? sequence : isString(sequence) ? (function () {
        return sequence.substr(n);
    })() : isVector(sequence) ? (function () {
        return sequence.slice(n);
    })() : isList(sequence) ? (function () {
        return dropFromList(n, sequence);
    })() : isNil(sequence) ? (function () {
        return null;
    })() : isLazySeq(sequence) ? (function () {
        return drop(n, lazySeqValue(sequence));
    })() : (function () {
        return drop(n, seq(sequence));
    })();
};
var dropWhile = exports.dropWhile = function dropWhile(predicate, sequence) {
    return function loop() {
        var recur = loop;
        var itemsø1 = seq(sequence);
        do {
            recur = isEmpty(itemsø1) || !predicate(first(itemsø1)) ? itemsø1 : (loop[0] = rest(itemsø1), loop);
        } while (itemsø1 = loop[0], recur === loop);
        return recur;
    }.call(this);
};
var conjList = function conjList(sequence, items) {
    return reduce(function (result, item) {
        return cons(item, result);
    }, sequence, items);
};
var ensureDictionary = function ensureDictionary(x) {
    return isVector(x) ? dictionary(first(x), second(x)) : x;
};
var conj = exports.conj = function conj(sequence) {
    var items = Array.prototype.slice.call(arguments, 1);
    return isVector(sequence) ? (function () {
        return sequence.concat(items);
    })() : isString(sequence) ? (function () {
        return '' + sequence + str.apply(null, items);
    })() : isNil(sequence) ? (function () {
        return list.apply(null, reverse(items));
    })() : isSeq(sequence) ? (function () {
        return conjList(sequence, items);
    })() : isDictionary(sequence) ? (function () {
        return merge(sequence, merge.apply(null, mapv(ensureDictionary, items)));
    })() : isSet(sequence) ? (function () {
        return identitySet.apply(null, into(vec(sequence), items));
    })() : (function () {
        return (function () {
            throw TypeError('' + 'Type can\'t be conjoined ' + sequence);
        })();
    })();
};
var disj = exports.disj = function disj(coll) {
    var ks = Array.prototype.slice.call(arguments, 1);
    return function () {
        var predicateø1 = complement(identitySet.apply(null, ks));
        return isEmpty(ks) ? (function () {
            return coll;
        })() : isSet(coll) ? (function () {
            return identitySet.apply(null, filterv(predicateø1, coll));
        })() : isDictionary(coll) ? (function () {
            return into({}, filter(function ($) {
                return predicateø1(first($));
            }, coll));
        })() : (function () {
            return (function () {
                throw TypeError('' + 'Type can\'t be disjoined ' + coll);
            })();
        })();
    }.call(this);
};
var into = exports.into = function into(to, from) {
    return conj.apply(null, [to].concat(vec(from)));
};
var zipmap = exports.zipmap = function zipmap(keys, vals) {
    return into({}, map(vector, keys, vals));
};
var assoc = exports.assoc = function assoc(source) {
    var keyValues = Array.prototype.slice.call(arguments, 1);
    return conj(source, dictionary.apply(null, keyValues));
};
var dissoc = exports.dissoc = function dissoc(coll) {
    var ks = Array.prototype.slice.call(arguments, 1);
    return isDictionary(coll) ? disj.apply(null, [coll].concat(ks)) : (function () {
        throw TypeError('' + 'Can only dissoc on dictionaries');
    })();
};
var concat = exports.concat = function concat() {
    var sequences = Array.prototype.slice.call(arguments, 0);
    return reduce(function ($1, $2) {
        return conjList($1, reverse($2));
    }, function () {
        var tailø1 = last(sequences);
        return isLazySeq(tailø1) ? tailø1 : list.apply(null, vec(tailø1));
    }.call(this), rest(reverse(sequences)));
};
var mapcat = exports.mapcat = function mapcat(f) {
    var colls = Array.prototype.slice.call(arguments, 1);
    return concat.apply(null, mapv.apply(null, [f].concat(colls)));
};
var empty = exports.empty = function empty(sequence) {
    return isList(sequence) ? (function () {
        return null;
    })() : isVector(sequence) ? (function () {
        return [];
    })() : isString(sequence) ? (function () {
        return '';
    })() : isDictionary(sequence) ? (function () {
        return {};
    })() : isSet(sequence) ? (function () {
        return set();
    })() : isLazySeq(sequence) ? (function () {
        return lazySeq.call(null, false, function () {
            return null;
        });
    })() : null;
};
var seq = exports.seq = function seq(sequence) {
    return isNil(sequence) ? (function () {
        return null;
    })() : isVector(sequence) || isSeq(sequence) ? (function () {
        return sequence;
    })() : isString(sequence) ? (function () {
        return Array.prototype.slice.call(sequence);
    })() : isDictionary(sequence) ? (function () {
        return keyValues(sequence);
    })() : isIterable(sequence) ? (function () {
        return iteratorToLseq((sequence || 0)[Symbol.iterator]());
    })() : (function () {
        return (function () {
            throw TypeError('' + 'Can not seq ' + sequence);
        })();
    })();
};
var seq_ = exports.seq_ = function seq_(sequence) {
    return function () {
        var itø1 = seq(sequence);
        return isEmpty(itø1) ? null : itø1;
    }.call(this);
};
var isSeq = exports.isSeq = function isSeq(sequence) {
    return isList(sequence) || isLazySeq(sequence);
};
var iteratorToLseq = function iteratorToLseq(iterator) {
    return unfold(function ($) {
        return function () {
            var xø1 = $.next();
            return xø1.done ? null : [
                xø1.value,
                $
            ];
        }.call(this);
    }, iterator);
};
var vec = exports.vec = function vec(sequence) {
    return isNil(sequence) ? (function () {
        return [];
    })() : isVector(sequence) || isList(sequence) ? (function () {
        return Array.from(sequence);
    })() : isLazySeq(sequence) ? (function () {
        return function () {
            var xsø1 = Array.from(sequence);
            sequence.length = xsø1.length;
            return xsø1;
        }.call(this);
    })() : (function () {
        return vec(seq(sequence));
    })();
};
var vector = exports.vector = function vector() {
    var sequence = Array.prototype.slice.call(arguments, 0);
    return sequence;
};
var sortComparator = isEqual([
    1,
    2,
    3
], [
    2,
    1,
    3
].sort(function (a, b) {
    return a < b ? 0 : 1;
})) ? function ($) {
    return function (a, b) {
        return $(b, a) ? 1 : 0;
    };
} : function ($) {
    return function (a, b) {
        return $(a, b) ? -1 : 0;
    };
};
var sort = exports.sort = function sort(f, items) {
    return function () {
        var hasComparatorø1 = isFn(f);
        var itemsø2 = !hasComparatorø1 && isNil(items) ? f : items;
        var resultø1 = hasComparatorø1 ? vec(itemsø2).sort(sortComparator(f)) : vec(itemsø2).sort();
        return isNil(itemsø2) ? (function () {
            return null;
        })() : isVector(itemsø2) ? (function () {
            return resultø1;
        })() : (function () {
            return list.apply(null, resultø1);
        })();
    }.call(this);
};
var repeatedly = exports.repeatedly = function repeatedly(n, f) {
    return Array.from({ 'length': n }, function () {
        return f();
    });
};
var repeat = exports.repeat = function repeat(n, x) {
    return repeatedly(n, function () {
        return x;
    });
};
var isEvery = exports.isEvery = function isEvery(predicate, sequence) {
    return vec(sequence).every(function ($) {
        return predicate($);
    });
};
var some = exports.some = function some(pred, coll) {
    return function loop() {
        var recur = loop;
        var itemsø1 = seq(coll);
        do {
            recur = isEmpty(itemsø1) ? null : pred(first(itemsø1)) || (loop[0] = rest(itemsø1), loop);
        } while (itemsø1 = loop[0], recur === loop);
        return recur;
    }.call(this);
};
var partition = exports.partition = function partition(n) {
    var args = Array.prototype.slice.call(arguments, 1);
    return function () {
        var stepø1 = count(args) >= 2 ? first(args) : n;
        var padø1 = count(args) >= 3 ? second(args) : [];
        var collø1 = last(args);
        return function loop() {
            var recur = loop;
            var resultø1 = [];
            var itemsø1 = seq(collø1);
            do {
                recur = function () {
                    var chunkø1 = take(n, itemsø1);
                    var sizeø1 = count(chunkø1);
                    return sizeø1 === n ? (function () {
                        return loop[0] = conj(resultø1, chunkø1), loop[1] = drop(stepø1, itemsø1), loop;
                    })() : 0 === sizeø1 ? (function () {
                        return resultø1;
                    })() : n > sizeø1 + count(padø1) ? (function () {
                        return resultø1;
                    })() : (function () {
                        return conj(resultø1, take(n, vec(concat(chunkø1, padø1))));
                    })();
                }.call(this);
            } while (resultø1 = loop[0], itemsø1 = loop[1], recur === loop);
            return recur;
        }.call(this);
    }.call(this);
};
var interleave = exports.interleave = function interleave() {
    var sequences = Array.prototype.slice.call(arguments, 0);
    return isEmpty(sequences) ? [] : function loop() {
        var recur = loop;
        var resultø1 = [];
        var sequencesø2 = sequences;
        do {
            recur = some(isEmpty, sequencesø2) ? vec(resultø1) : (loop[0] = concat(resultø1, map(first, sequencesø2)), loop[1] = map(rest, sequencesø2), loop);
        } while (resultø1 = loop[0], sequencesø2 = loop[1], recur === loop);
        return recur;
    }.call(this);
};
var nth = exports.nth = function nth(sequence, index, notFound) {
    return function () {
        var sequenceø2 = seq_(sequence);
        return isNil(sequenceø2) ? (function () {
            return notFound;
        })() : isSeq(sequenceø2) ? (function () {
            return function () {
                var ifLetBinding1ø1 = seq_(drop(index, sequenceø2));
                return ifLetBinding1ø1 ? function () {
                    var itø1 = ifLetBinding1ø1;
                    return first(itø1);
                }.call(this) : notFound;
            }.call(this);
        })() : isVector(sequenceø2) || isString(sequenceø2) ? (function () {
            return index < count(sequenceø2) ? sequenceø2[index] : notFound;
        })() : (function () {
            return (function () {
                throw TypeError('Unsupported type');
            })();
        })();
    }.call(this);
};
var isContains = exports.isContains = function isContains(coll, v) {
    return isSet(coll) ? (function () {
        return coll.has(v);
    })() : isDictionary(coll) || isVector(coll) || isString(coll) ? (function () {
        return coll.hasOwnProperty(v);
    })() : (function () {
        return false;
    })();
};
var union = exports.union = function union() {
    var sets = Array.prototype.slice.call(arguments, 0);
    return into(set(), concat.apply(null, sets));
};
var difference = exports.difference = function difference(s1) {
    var sets = Array.prototype.slice.call(arguments, 1);
    return into(set(), filter(complement(union.apply(null, sets)), s1));
};
var intersection = exports.intersection = function intersection() {
    var sets = Array.prototype.slice.call(arguments, 0);
    return function () {
        var setsø2 = mapv(function ($) {
            return into(set(), $);
        }, sets);
        var isInEachø1 = function (x) {
            return isEvery(function ($) {
                return $.has(x);
            }, setsø2);
        };
        var minSizeø1 = min.apply(null, mapv(count, setsø2));
        var smallestø1 = setsø2.find(function ($) {
            return isEqual(minSizeø1, count($));
        });
        return into(set(), filter(isInEachø1, smallestø1));
    }.call(this);
};
var isSubset = exports.isSubset = function isSubset(set1, set2) {
    return isSet(set2) ? isEvery(function ($) {
        return set2.has($);
    }, set1) : isSubset(set1, into(set(), set2));
};
var isSuperset = exports.isSuperset = function isSuperset(set1, set2) {
    return isSubset(set2, set1);
};
var unfold = exports.unfold = function unfold(f, x) {
    return lazySeq.call(null, false, function () {
        return function () {
            var ifLetBinding2ø1 = f(x);
            return ifLetBinding2ø1 ? function () {
                var nextø1 = ifLetBinding2ø1;
                return cons(first(nextø1), unfold(f, second(nextø1)));
            }.call(this) : null;
        }.call(this);
    });
};
var iterate = exports.iterate = function iterate(f, x) {
    return lazySeq.call(null, false, function () {
        return cons(x, iterate(f, f(x)));
    });
};
var cycle = exports.cycle = function cycle(coll) {
    return lazySeq.call(null, false, function () {
        return isEmpty(coll) ? null : concat(coll, cycle(coll));
    });
};
var infiniteRange = exports.infiniteRange = function infiniteRange() {
    var args = Array.prototype.slice.call(arguments, 0);
    return function () {
        var nø1 = isEmpty(args) ? 0 : first(args);
        var stepø1 = second(args);
        return isNil(stepø1) ? iterate(inc, nø1) : iterate(function ($) {
            return $ + stepø1;
        }, nø1);
    }.call(this);
};
var lazyMap = exports.lazyMap = function lazyMap(f) {
    var sequences = Array.prototype.slice.call(arguments, 1);
    return unfold(function ($) {
        return some(isEmpty, $) ? null : [
            f.apply(null, mapv(first, $)),
            mapv(rest, $)
        ];
    }, sequences);
};
var lazyFilter = exports.lazyFilter = function lazyFilter(f, sequence) {
    return unfold(function ($) {
        return function loop() {
            var recur = loop;
            var xsø1 = $;
            do {
                recur = isEmpty(xsø1) ? (function () {
                    return null;
                })() : f(first(xsø1)) ? (function () {
                    return [
                        first(xsø1),
                        rest(xsø1)
                    ];
                })() : (function () {
                    return loop[0] = rest(xsø1), loop;
                })();
            } while (xsø1 = loop[0], recur === loop);
            return recur;
        }.call(this);
    }, seq(sequence));
};
var lazyConcat = exports.lazyConcat = function lazyConcat() {
    var sequences = Array.prototype.slice.call(arguments, 0);
    return isEmpty(sequences) ? null : function iter(xs) {
        return lazySeq.call(null, false, function () {
            return isEmpty(xs) ? lazyConcat.apply(null, rest(sequences)) : cons(first(xs), iter(rest(xs)));
        });
    }(seq(first(sequences)));
};
var lazyPartition = exports.lazyPartition = function lazyPartition(n) {
    var args = Array.prototype.slice.call(arguments, 1);
    return function () {
        var stepø1 = count(args) >= 2 ? first(args) : n;
        var padø1 = count(args) >= 3 ? second(args) : [];
        var collø1 = last(args);
        return unfold(function ($) {
            return function () {
                var chunkø1 = take(n, concat(take(n, $), padø1));
                return !isEmpty($) && n === count(chunkø1) ? [
                    chunkø1,
                    drop(stepø1, $)
                ] : null;
            }.call(this);
        }, collø1);
    }.call(this);
};
var run = exports.run = function run(proc, coll) {
    return reduce(function (_, x) {
        proc(x);
        return null;
    }, null, coll);
};
var dorun = exports.dorun = function dorun() {
    var args = Array.prototype.slice.call(arguments, 0);
    return function () {
        var nø1 = count(args) === 1 ? Infinity : first(args);
        var collø1 = last(args);
        return run(identity, take(nø1, collø1));
    }.call(this);
};
var doall = exports.doall = function doall() {
    var args = Array.prototype.slice.call(arguments, 0);
    return function () {
        var nø1 = count(args) === 1 ? Infinity : first(args);
        var collø1 = last(args);
        dorun(nø1, collø1);
        return collø1;
    }.call(this);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndpc3Avc2VxdWVuY2Uud2lzcCJdLCJuYW1lcyI6WyJfbnNfIiwiaWQiLCJkb2MiLCJpc05pbCIsImlzVmVjdG9yIiwiaXNGbiIsImlzTnVtYmVyIiwiaXNTdHJpbmciLCJpc0RpY3Rpb25hcnkiLCJpc1NldCIsImtleVZhbHVlcyIsInN0ciIsImludCIsImRlYyIsImluYyIsIm1pbiIsIm1lcmdlIiwiZGljdGlvbmFyeSIsImdldCIsImlzSXRlcmFibGUiLCJpc0VxdWFsIiwiY29tcGxlbWVudCIsImlkZW50aXR5IiwiaXNMaXN0IiwiaXNMYXp5U2VxIiwiaXNJZGVudGl0eVNldCIsIl93aXNwVHlwZXMiLCJsaXN0SXRlcmF0b3IiLCJzZWxmw7gxIiwidGhpcyIsImlzRW1wdHkiLCJ4w7gxIiwiZmlyc3QiLCJyZXN0Iiwic2VxVG9TdHJpbmciLCJscGFyZW4iLCJycGFyZW4iLCJsaXN0w7gxIiwicmVzdWx0w7gxIiwic3Vic3RyIiwiam9pbiIsIkpTT04iLCJzdHJpbmdpZnkiLCJMaXN0IiwiaGVhZCIsInRhaWwiLCJsaXN0IiwibGVuZ3RoIiwiY291bnQiLCJwcm90b3R5cGUubGVuZ3RoIiwidHlwZSIsInByb3RvdHlwZS50eXBlIiwicHJvdG90eXBlLnRhaWwiLCJwcm90b3R5cGUudG9TdHJpbmciLCJwcm90b3R5cGUiLCJTeW1ib2wiLCJpdGVyYXRvciIsImxhenlTZXFWYWx1ZSIsImxhenlTZXEiLCJyZWFsaXplZCIsIngiLCJMYXp5U2VxIiwiZXhwb3J0cyIsImJvZHkiLCJjbG9uZVByb3RvUHJvcHMiLCJmcm9tIiwidG8iLCJPYmplY3QiLCJhc3NpZ24iLCJnZXRPd25Qcm9wZXJ0eU5hbWVzIiwiX19wcm90b19fIiwibWFwIiwiJCIsImJpbmQiLCJpZGVudGl0eVNldCIsIml0ZW1zIiwianNTZXTDuDEiLCJmw7gxIiwiJDEiLCIkMiIsInRvU3RyaW5nIiwiYXBwbHkiLCJGdW5jdGlvbiIsInByb3RvdHlwZS5hcHBseSIsImNhbGwiLCJwcm90b3R5cGUuY2FsbCIsImRlZmluZVByb3BlcnR5Iiwic2l6ZSIsInZhbHVlcyIsInNldCIsIl9zZXFFcXVhbCIsInkiLCJpc1NlcSIsInjDuDIiLCJzZXEiLCJ5w7gyIiwiZXZlcnkiLCJhcmd1bWVudHMiLCJBcnJheSIsInByb3RvdHlwZS5zbGljZSIsInJlZHVjZVJpZ2h0IiwiY29ucyIsImlzU2VxdWVudGlhbCIsImlzTmF0aXZlIiwic2VxdWVuY2UiLCJyZXZlcnNlIiwidmVjIiwiaW50byIsInJhbmdlIiwiYXJncyIsInNlY29uZCIsInN0YXJ0w7gxIiwiZW5kw7gxIiwic3RlcMO4MSIsInRoaXJkIiwiXyIsImkiLCJtYXB2IiwiZiIsInNlcXVlbmNlcyIsInZlY3RvcnPDuDEiLCJuw7gxIiwibWFwSW5kZXhlZCIsInNlcXVlbmNlw7gxIiwiaW5kaWNlc8O4MSIsImZpbHRlciIsImlzRiIsImZpbHRlckxpc3QiLCJpdGVtc8O4MSIsImZpbHRlcnYiLCJyZWR1Y2UiLCJwYXJhbXMiLCJoYXNJbml0aWFsw7gxIiwiaW5pdGlhbMO4MSIsImFjYyIsIml0w7gxIiwic2xpY2UiLCJjYXIiLCJjZHIiLCJsYXN0T2ZMaXN0IiwiaXRlbcO4MSIsImxhc3QiLCJidXRsYXN0Iiwic3VicyIsInRha2UiLCJuIiwidGFrZUZyb21WZWN0b3IiLCJ0YWtlRnJvbUxpc3QiLCJ0YWtlV2hpbGUiLCJwcmVkaWNhdGUiLCJoZWFkw7gxIiwidGFpbMO4MSIsImNvbmoiLCJ2ZWN0b3IiLCJ0YWtlbsO4MSIsIm7DuDIiLCJkcm9wRnJvbUxpc3QiLCJsZWZ0w7gxIiwiZHJvcCIsImRyb3BXaGlsZSIsImNvbmpMaXN0IiwicmVzdWx0IiwiaXRlbSIsImVuc3VyZURpY3Rpb25hcnkiLCJjb25jYXQiLCJUeXBlRXJyb3IiLCJkaXNqIiwiY29sbCIsImtzIiwicHJlZGljYXRlw7gxIiwiemlwbWFwIiwia2V5cyIsInZhbHMiLCJhc3NvYyIsInNvdXJjZSIsImRpc3NvYyIsIm1hcGNhdCIsImNvbGxzIiwiZW1wdHkiLCJpdGVyYXRvclRvTHNlcSIsInNlcV8iLCJ1bmZvbGQiLCJuZXh0IiwiZG9uZSIsInZhbHVlIiwieHPDuDEiLCJzb3J0Q29tcGFyYXRvciIsInNvcnQiLCJhIiwiYiIsImhhc0NvbXBhcmF0b3LDuDEiLCJpdGVtc8O4MiIsInJlcGVhdGVkbHkiLCJyZXBlYXQiLCJpc0V2ZXJ5Iiwic29tZSIsInByZWQiLCJwYXJ0aXRpb24iLCJwYWTDuDEiLCJjb2xsw7gxIiwiY2h1bmvDuDEiLCJzaXplw7gxIiwiaW50ZXJsZWF2ZSIsInNlcXVlbmNlc8O4MiIsIm50aCIsImluZGV4Iiwibm90Rm91bmQiLCJzZXF1ZW5jZcO4MiIsImlzQ29udGFpbnMiLCJ2IiwiaGFzIiwiaGFzT3duUHJvcGVydHkiLCJ1bmlvbiIsInNldHMiLCJkaWZmZXJlbmNlIiwiczEiLCJpbnRlcnNlY3Rpb24iLCJzZXRzw7gyIiwiaXNJbkVhY2jDuDEiLCJtaW5TaXplw7gxIiwic21hbGxlc3TDuDEiLCJmaW5kIiwiaXNTdWJzZXQiLCJzZXQxIiwic2V0MiIsImlzU3VwZXJzZXQiLCJuZXh0w7gxIiwiaXRlcmF0ZSIsImN5Y2xlIiwiaW5maW5pdGVSYW5nZSIsImxhenlNYXAiLCJsYXp5RmlsdGVyIiwibGF6eUNvbmNhdCIsIml0ZXIiLCJ4cyIsImxhenlQYXJ0aXRpb24iLCJydW4iLCJwcm9jIiwiZG9ydW4iLCJJbmZpbml0eSIsImRvYWxsIl0sIm1hcHBpbmdzIjoiO0lBQUEsSUFBQ0EsSSxHQUFEO0FBQUEsUUFBQUMsRSxFQUFJLGVBQUo7QUFBQSxRQUFBQyxHLEVBQUE7QUFBQSxNOztRQUNrQ0MsS0FBQSxHLGFBQUFBLEs7UUFBS0MsUUFBQSxHLGFBQUFBLFE7UUFBUUMsSUFBQSxHLGFBQUFBLEk7UUFBSUMsUUFBQSxHLGFBQUFBLFE7UUFBUUMsUUFBQSxHLGFBQUFBLFE7UUFBUUMsWUFBQSxHLGFBQUFBLFk7UUFBWUMsS0FBQSxHLGFBQUFBLEs7UUFDN0NDLFNBQUEsRyxhQUFBQSxTO1FBQVdDLEdBQUEsRyxhQUFBQSxHO1FBQUlDLEdBQUEsRyxhQUFB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LElBQU95QyxLQUFBLEdBQUFsTCxPQUFBLENBQUFrTCxLQUFBLEdBQVAsU0FBT0EsS0FBUCxHO1FBQ1NuSSxJQUFBLEc7SUFPUCxPLFlBQVE7QUFBQSxZQUFBWSxHLEdBQW1CekUsS0FBRCxDQUFPNkQsSUFBUCxDQUFaLEtBQXlCLENBQTdCLEdBQWdDa0ksUUFBaEMsR0FBMEMvTSxLQUFELENBQU82RSxJQUFQLENBQTNDO0FBQUEsUUFDRCxJQUFBMEYsTSxHQUFNMUQsSUFBRCxDQUFNaEMsSUFBTixDQUFMLENBREM7QUFBQSxRQUVMaUksS0FBRCxDQUFPckgsR0FBUCxFQUFTOEUsTUFBVCxFQUZNO0FBQUEsUUFHTixPQUFBQSxNQUFBLENBSE07QUFBQSxLLEtBQVIsQyxJQUFBLEU7Q0FSRiIsInNvdXJjZXNDb250ZW50IjpbIihucyB3aXNwLnNlcXVlbmNlXG4gICg6cmVxdWlyZSBbd2lzcC5ydW50aW1lIDpyZWZlciBbbmlsPyB2ZWN0b3I/IGZuPyBudW1iZXI/IHN0cmluZz8gZGljdGlvbmFyeT8gc2V0P1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleS12YWx1ZXMgc3RyIGludCBkZWMgaW5jIG1pbiBtZXJnZSBkaWN0aW9uYXJ5IGdldFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZXJhYmxlPyA9IGNvbXBsZW1lbnQgaWRlbnRpdHkgbGlzdD8gbGF6eS1zZXE/IGlkZW50aXR5LXNldD9dXSkpXG5cbihkZWZ2YXItIC13aXNwLXR5cGVzIChhZ2V0ID0gJy13aXNwLXR5cGVzKSlcblxuOzsgSW1wbGVtZW50YXRpb24gb2YgbGlzdFxuXG4oZGVmdW4tIGxpc3QtaXRlcmF0b3IgKClcbiAgKGxldCogKChzZWxmIHRoaXMpKVxuICAgIHs6bmV4dCAobGFtYmRhICgpXG4gICAgICAgICAgICAgKGlmIChlbXB0eT8gc2VsZilcbiAgICAgICAgICAgICAgezpkb25lIHRydWV9XG4gICAgICAgICAgICAgIChsZXQqICgoeCAoZmlyc3Qgc2VsZikpKVxuICAgICAgICAgICAgICAgIChzZXRmIHNlbGYgKHJlc3Qgc2VsZikpXG4gICAgICAgICAgICAgICAgezp2YWx1ZSB4fSkpKX0pKVxuXG4oZGVmdW4tIHNlcS0+c3RyaW5nIChscGFyZW4gcnBhcmVuKVxuICAobGFtYmRhICgpXG4gICAgKGxvb3AgKChsaXN0IHRoaXMpIChyZXN1bHQgXCJcIikpXG4gICAgICAoaWYgKGVtcHR5PyBsaXN0KVxuICAgICAgICAoc3RyIGxwYXJlbiAoLnN1YnN0ciByZXN1bHQgMSkgcnBhcmVuKVxuICAgICAgICAocmVjdXIgKHJlc3QgbGlzdClcbiAgICAgICAgICAgICAgIChzdHIgcmVzdWx0XG4gICAgICAgICAgICAgICAgICAgIFwiIFwiXG4gICAgICAgICAgICAgICAgICAgIChsZXQqICgoeCAoZmlyc3QgbGlzdCkpKVxuICAgICAgICAgICAgICAgICAgICAgIChjb25kICgodmVjdG9yPyB4KSAoc3RyIFwiW1wiICguam9pbiB4IFwiIFwiKSBcIl1cIikpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKChuaWw/ICAgIHgpIFwibmlsXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKChzdHJpbmc/IHgpICguc3RyaW5naWZ5IEpTT04geCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKChudW1iZXI/IHgpICguc3RyaW5naWZ5IEpTT04geCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGVsc2UgICAgICAgeCkpKSkpKSkpKVxuXG4oZGVmdW4tIExpc3RcbiAgKGhlYWQgdGFpbClcbiAgXCJMaXN0IHR5cGVcIlxuICAoc2V0ZiB0aGlzLmhlYWQgaGVhZClcbiAgKHNldGYgdGhpcy50YWlsIChvciB0YWlsIChsaXN0KSkpXG4gIChzZXRmIHRoaXMubGVuZ3RoXG4gICAgKGlmIChvciAobmlsPyB0aGlzLnRhaWwpIChkaWN0aW9uYXJ5PyB0aGlzLnRhaWwpIChudW1iZXI/ICguLWxlbmd0aCB0aGlzLnRhaWwpKSlcbiAgICAgIChpbmMgKGNvdW50IHRoaXMudGFpbCkpKSlcbiAgdGhpcylcblxuKHNldGYgTGlzdC5wcm90b3R5cGUubGVuZ3RoIDApXG4oc2V0ZiBMaXN0LnR5cGUgKDpsaXN0IC13aXNwLXR5cGVzKSlcbihzZXRmIExpc3QucHJvdG90eXBlLnR5cGUgTGlzdC50eXBlKVxuKHNldGYgTGlzdC5wcm90b3R5cGUudGFpbCBuaWwpXG4oc2V0ZiBMaXN0LnByb3RvdHlwZS50by1zdHJpbmcgKHNlcS0+c3RyaW5nIFwiKFwiIFwiKVwiKSlcbihhc2V0IExpc3QucHJvdG90eXBlIFN5bWJvbC5pdGVyYXRvciBsaXN0LWl0ZXJhdG9yKVxuXG4oZGVmdW4tIGxhenktc2VxLXZhbHVlIChsYXp5LXNlcSlcbiAgKGlmICguLXJlYWxpemVkIGxhenktc2VxKVxuICAgICguLXggbGF6eS1zZXEpXG4gICAgKGxldCogKCh4ICgueCBsYXp5LXNlcSkpKVxuICAgICAgKHNldGYgKC4tcmVhbGl6ZWQgbGF6eS1zZXEpIHRydWUpXG4gICAgICAoaWYgKGVtcHR5PyB4KVxuICAgICAgICAoc2V0ZiAoLi1sZW5ndGggbGF6eS1zZXEpIDApKVxuICAgICAgKHNldGYgKC4teCBsYXp5LXNlcSkgeCkpKSlcblxuKGRlZnVuLSBMYXp5U2VxIChyZWFsaXplZCB4KVxuICAoc2V0ZiAoLi1yZWFsaXplZCB0aGlzKSAob3IgcmVhbGl6ZWQgZmFsc2UpKVxuICAoc2V0ZiAoLi14IHRoaXMpIHgpXG4gIHRoaXMpXG4oc2V0ZiBMYXp5U2VxLnR5cGUgKDpsYXp5LXNlcSAtd2lzcC10eXBlcykpXG4oc2V0ZiBMYXp5U2VxLnByb3RvdHlwZS50eXBlIExhenlTZXEudHlwZSlcbihhc2V0IExhenlTZXEucHJvdG90eXBlIFN5bWJvbC5pdGVyYXRvciBsaXN0LWl0ZXJhdG9yKVxuXG4oZGVmdW4gbGF6eS1zZXFcbiAgKHJlYWxpemVkIGJvZHkpXG4gIChMYXp5U2VxLiByZWFsaXplZCBib2R5KSlcblxuKGRlZnVuLSBjbG9uZS1wcm90by1wcm9wcyEgKGZyb20gdG8pXG4gIChhcHBseSBPYmplY3QuYXNzaWduIHRvXG4gICAgICAgICAoLm1hcCAoT2JqZWN0LmdldC1vd24tcHJvcGVydHktbmFtZXMgZnJvbS5fX3Byb3RvX18pXG4gICAgICAgICAgICAgICAobGFtYmRhICglKSAobGV0KiAoKHggKGFnZXQgZnJvbSAlKSkpXG4gICAgICAgICAgICAgICAgICAoZGljdGlvbmFyeSAlIChpZiAoZm4/IHgpICguYmluZCB4IGZyb20pIHgpKSkpKSkpXG5cbihkZWZ1biBpZGVudGl0eS1zZXQgKCZyZXN0IGl0ZW1zKVxuICAobGV0KiAoKGpzLXNldCAoU2V0LiBpdGVtcykpXG4gICAgICAgIChmICAgICAgKGxhbWJkYSAoJTEgJTIpIChnZXQganMtc2V0ICUxICUyKSkpKVxuICAgIChjbG9uZS1wcm90by1wcm9wcyEganMtc2V0IGYpXG4gICAgKHNldGYgZi50by1zdHJpbmcgKHNlcS0+c3RyaW5nIFwiI3tcIiBcIn1cIikpXG4gICAgOzsgUmVhc3NpZ25pbmcgX19wcm90b19fIGJlbG93IHNldmVycyBmJ3MgbGluayB0byBGdW5jdGlvbi5wcm90b3R5cGUsXG4gICAgOzsgc28gY2FsbGVycyB0aGF0IGRvIChmLmFwcGx5IC4uLikvKGYuY2FsbCAuLi4pIChlLmcuIGNvbXBsZW1lbnQsXG4gICAgOzsgYXBwbHkpIHdvdWxkIG90aGVyd2lzZSBmaW5kIG5vIHN1Y2ggbWV0aG9kIC0tIHBpbiB0aGVtIGRvd24gYXNcbiAgICA7OyBvd24gcHJvcGVydGllcyBmaXJzdCBzbyBmIHN0YXlzIHVzYWJsZSBhcyBhIHBsYWluIGZ1bmN0aW9uIHRvby5cbiAgICAoc2V0ZiBmLmFwcGx5IEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseSlcbiAgICAoc2V0ZiBmLmNhbGwgRnVuY3Rpb24ucHJvdG90eXBlLmNhbGwpXG4gICAgKHNldGYgZi5fX3Byb3RvX18ganMtc2V0KVxuICAgIChPYmplY3QuZGVmaW5lLXByb3BlcnR5IGYgOmxlbmd0aCB7OnZhbHVlIGYuc2l6ZX0pXG4gICAgKGFzZXQgZiBTeW1ib2wuaXRlcmF0b3IgZi52YWx1ZXMpXG4gICAgKGFzZXQgZiA6dHlwZSBpZGVudGl0eS1zZXQudHlwZSlcbiAgICBmKSlcbihzZXRmIGlkZW50aXR5LXNldC50eXBlICg6c2V0IC13aXNwLXR5cGVzKSlcbihkZWZ2YXIgc2V0IGlkZW50aXR5LXNldClcblxuKGRlZnZhciBsYXp5LXNlcT8gbGF6eS1zZXE/KVxuKGRlZnZhciBpZGVudGl0eS1zZXQ/IGlkZW50aXR5LXNldD8pXG4oZGVmdmFyIGxpc3Q/IGxpc3Q/KVxuXG4oc2V0ZiA9LipzZXE9XG4gIChsYW1iZGEgKHggeSlcbiAgICAoYW5kIChvciAodmVjdG9yPyB4KSAoc2VxPyB4KSlcbiAgICAgICAgIChvciAodmVjdG9yPyB5KSAoc2VxPyB5KSlcbiAgICAgICAgIChsb29wICgoeCAoc2VxIHgpKSAoeSAoc2VxIHkpKSlcbiAgICAgICAgICAgKGNvbmQgKChhbmQgKHZlY3Rvcj8geCkgKHZlY3Rvcj8geSkpIChhbmQgKD0gKGNvdW50IHgpIChjb3VudCB5KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoLmV2ZXJ5IHggKGxhbWJkYSAoJTEgJTIpICg9ICUxIChhZ2V0IHkgJTIpKSkpKSlcbiAgICAgICAgICAgICAgICAgKChvciAoZW1wdHk/IHgpIChlbXB0eT8geSkpICAgIChhbmQgKGVtcHR5PyB4KSAoZW1wdHk/IHkpKSlcbiAgICAgICAgICAgICAgICAgKChub3Q9IChmaXJzdCB4KSAoZmlyc3QgeSkpICAgIGZhbHNlKVxuICAgICAgICAgICAgICAgICAoZWxzZSAgICAgICAgICAgICAgICAgICAgICAgICAocmVjdXIgKHJlc3QgeCkgKHJlc3QgeSkpKSkpKSkpXG5cbihkZWZ1biBsaXN0XG4gICgpXG4gIFwiQ3JlYXRlcyBsaXN0IG9mIHRoZSBnaXZlbiBpdGVtc1wiXG4gIChpZiAoaWRlbnRpY2FsPyAoLi1sZW5ndGggYXJndW1lbnRzKSAwKVxuICAgIG5pbFxuICAgICgucmVkdWNlLXJpZ2h0ICguY2FsbCBBcnJheS5wcm90b3R5cGUuc2xpY2UgYXJndW1lbnRzKVxuICAgICAgICAgICAgICAgICAgIChsYW1iZGEgKHRhaWwgaGVhZCkgKGNvbnMgaGVhZCB0YWlsKSlcbiAgICAgICAgICAgICAgICAgICAobGlzdCkpKSlcblxuKGRlZnVuIGNvbnNcbiAgKGhlYWQgdGFpbClcbiAgXCJDcmVhdGVzIGxpc3Qgd2l0aCBgaGVhZGAgYXMgZmlyc3QgaXRlbSBhbmQgYHRhaWxgIGFzIHJlc3RcIlxuICAobmV3IExpc3QgaGVhZCB0YWlsKSlcblxuKGRlZnVuIHNlcXVlbnRpYWw/XG4gICh4KVxuICBcIlJldHVybnMgdHJ1ZSBpZiBjb2xsIHNhdGlzZmllcyBJU2VxdWVudGlhbFwiXG4gIChvciAoc2VxPyB4KVxuICAgICAgICAgICh2ZWN0b3I/IHgpXG4gICAgICAgICAgKGRpY3Rpb25hcnk/IHgpXG4gICAgICAgICAgKHNldD8geClcbiAgICAgICAgICAoc3RyaW5nPyB4KSkpXG5cbihkZWZ1bi0gbmF0aXZlPyAoc2VxdWVuY2UpXG4gIChvciAodmVjdG9yPyBzZXF1ZW5jZSkgKHN0cmluZz8gc2VxdWVuY2UpIChkaWN0aW9uYXJ5PyBzZXF1ZW5jZSkpKVxuXG5cbihkZWZ1biByZXZlcnNlXG4gIChzZXF1ZW5jZSlcbiAgXCJSZXZlcnNlIG9yZGVyIG9mIGl0ZW1zIGluIHRoZSBzZXF1ZW5jZVwiXG4gIChpZiAodmVjdG9yPyBzZXF1ZW5jZSlcbiAgICAoLnJldmVyc2UgKHZlYyBzZXF1ZW5jZSkpXG4gICAgKGludG8gbmlsIHNlcXVlbmNlKSkpXG5cbihkZWZ1biByYW5nZVxuICAoJnJlc3QgYXJncylcbiAgXCJSZXR1cm5zIGEgdmVjdG9yIG9mIG51bXMgZnJvbSBzdGFydCAoaW5jbHVzaXZlKSB0byBlbmRcbiAgKGV4Y2x1c2l2ZSksIGJ5IHN0ZXAsIHdoZXJlIHN0YXJ0IGRlZmF1bHRzIHRvIDAgYW5kIHN0ZXAgdG8gMS5cIlxuICAoY29uZCAoKGlkZW50aWNhbD8gKGNvdW50IGFyZ3MpIDEpIChyYW5nZSAwIChmaXJzdCBhcmdzKSAxKSlcbiAgICAgICAgKChpZGVudGljYWw/IChjb3VudCBhcmdzKSAyKSAocmFuZ2UgKGZpcnN0IGFyZ3MpIChzZWNvbmQgYXJncykgMSkpXG4gICAgICAgIChlbHNlXG4gICAgICAgIChsZXQqICgoc3RhcnQgKGZpcnN0IGFyZ3MpKSAoZW5kIChzZWNvbmQgYXJncykpIChzdGVwICh0aGlyZCBhcmdzKSkpXG4gICAgICAgICAgKGlmICg8IHN0ZXAgMClcbiAgICAgICAgICAgICAgICAgICAgICAoLm1hcCAocmFuZ2UgKC0gc3RhcnQpICgtIGVuZCkgKC0gc3RlcCkpIChsYW1iZGEgKCUpICgtICUpKSlcbiAgICAgICAgICAgICAgICAgICAgICAoQXJyYXkuZnJvbSB7Omxlbmd0aCAoLyAoLSAoKyBlbmQgc3RlcCkgc3RhcnQgMSkgc3RlcCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGxhbWJkYSAoXyBpKSAoKyBzdGFydCAoKiBpIHN0ZXApKSkpKSkpKSlcblxuKGRlZnVuIG1hcHZcbiAgKGYgJnJlc3Qgc2VxdWVuY2VzKVxuICBcIlJldHVybnMgYSB2ZWN0b3IgY29uc2lzdGluZyBvZiB0aGUgcmVzdWx0IG9mIGFwcGx5aW5nIGBmYCB0byB0aGVcbiAgZmlyc3QgaXRlbXMsIGZvbGxvd2VkIGJ5IGFwcGx5aW5nIGYgdG8gdGhlIHNlY29uZCBpdGVtcywgdW50aWwgb25lIG9mXG4gIHNlcXVlbmNlcyBpcyBleGhhdXN0ZWQuXCJcbiAgKGxldCogKCh2ZWN0b3JzICgubWFwIHNlcXVlbmNlcyB2ZWMpKSAobiAoYXBwbHkgbWluICgubWFwIHZlY3RvcnMgY291bnQpKSkpXG4gICAgKC5tYXAgKHJhbmdlIG4pIChsYW1iZGEgKGkpIChhcHBseSBmICgubWFwIHZlY3RvcnMgKGxhbWJkYSAoJSkgKGFnZXQgJSBpKSkpKSkpKSlcblxuKGRlZnVuIG1hcFxuICAoZiAmcmVzdCBzZXF1ZW5jZXMpXG4gIFwiUmV0dXJucyBhIHNlcXVlbmNlIGNvbnNpc3Rpbmcgb2YgdGhlIHJlc3VsdCBvZiBhcHBseWluZyBgZmAgdG8gdGhlXG4gIGZpcnN0IGl0ZW1zLCBmb2xsb3dlZCBieSBhcHBseWluZyBmIHRvIHRoZSBzZWNvbmQgaXRlbXMsIHVudGlsIG9uZSBvZlxuICBzZXF1ZW5jZXMgaXMgZXhoYXVzdGVkLlwiXG4gIChsZXQqICgocmVzdWx0IChhcHBseSBtYXB2IGYgc2VxdWVuY2VzKSkpXG4gICAgKGlmIChuYXRpdmU/IChmaXJzdCBzZXF1ZW5jZXMpKSByZXN1bHQgKGFwcGx5IGxpc3QgcmVzdWx0KSkpKVxuXG4oZGVmdW4gbWFwLWluZGV4ZWRcbiAgKGYgJnJlc3Qgc2VxdWVuY2VzKVxuICBcIlJldHVybnMgYSBzZXF1ZW5jZSBjb25zaXN0aW5nIG9mIHRoZSByZXN1bHQgb2YgYXBwbHlpbmcgYGZgIHRvIDAgYW5kXG4gIHRoZSBmaXJzdCBpdGVtcywgZm9sbG93ZWQgYnkgYXBwbHlpbmcgZiB0byAxIGFuZCB0aGUgc2Vjb25kIGl0ZW1zLFxuICB1bnRpbCBvbmUgb2Ygc2VxdWVuY2VzIGlzIGV4aGF1c3RlZC5cIlxuICAobGV0KiAoKHNlcXVlbmNlIChmaXJzdCBzZXF1ZW5jZXMpKSAobiAoY291bnQgc2VxdWVuY2UpKSAoaW5kaWNlcyAocmFuZ2UgbikpKVxuICAgIChhcHBseSBtYXAgZiAoaWYgKG5hdGl2ZT8gc2VxdWVuY2UpIGluZGljZXMgKGFwcGx5IGxpc3QgaW5kaWNlcykpIHNlcXVlbmNlcykpKVxuXG4oZGVmdW4gZmlsdGVyXG4gIChmPyBzZXF1ZW5jZSlcbiAgXCJSZXR1cm5zIGEgc2VxdWVuY2Ugb2YgdGhlIGl0ZW1zIGluIGNvbGwgZm9yIHdoaWNoIChmPyBpdGVtKSByZXR1cm5zIHRydWUuXG4gIGY/IG11c3QgYmUgZnJlZSBvZiBzaWRlLWVmZmVjdHMuXCJcbiAgKGNvbmQgKChuaWw/IHNlcXVlbmNlKSAgICAnKCkpXG4gICAgICAgICgoc2VxPyBzZXF1ZW5jZSkgICAgKGZpbHRlci1saXN0IGY/IHNlcXVlbmNlKSlcbiAgICAgICAgKCh2ZWN0b3I/IHNlcXVlbmNlKSAoLmZpbHRlciBzZXF1ZW5jZSAobGFtYmRhICglKSAoZj8gJSkpKSlcbiAgICAgICAgKGVsc2UgICAgICAgICAgICAgIChmaWx0ZXIgZj8gKHNlcSBzZXF1ZW5jZSkpKSkpXG5cbihkZWZ1bi0gZmlsdGVyLWxpc3RcbiAgKGY/IHNlcXVlbmNlKVxuICBcIkxpa2UgZmlsdGVyIGJ1dCBmb3IgbGlzdHNcIlxuICAobG9vcCAoKHJlc3VsdCAnKCkpXG4gICAgICAgICAoaXRlbXMgc2VxdWVuY2UpKVxuICAgIChpZiAoZW1wdHk/IGl0ZW1zKVxuICAgICAgKHJldmVyc2UgcmVzdWx0KVxuICAgICAgKHJlY3VyIChpZiAoZj8gKGZpcnN0IGl0ZW1zKSlcbiAgICAgICAgICAgICAgIChjb25zIChmaXJzdCBpdGVtcykgcmVzdWx0KVxuICAgICAgICAgICAgICAgcmVzdWx0KVxuICAgICAgICAgICAgIChyZXN0IGl0ZW1zKSkpKSlcblxuKGRlZnVuIGZpbHRlcnYgKGY/IHNlcXVlbmNlKVxuICAodmVjIChmaWx0ZXIgZj8gc2VxdWVuY2UpKSlcblxuKGRlZnVuIHJlZHVjZVxuICAoZiAmcmVzdCBwYXJhbXMpXG4gIChsZXQqICgoaGFzLWluaXRpYWwgKD49IChjb3VudCBwYXJhbXMpIDIpKVxuICAgICAgICAoaW5pdGlhbCAgICAgKGlmIGhhcy1pbml0aWFsIChmaXJzdCBwYXJhbXMpKSlcbiAgICAgICAgKHNlcXVlbmNlICAgIChpZiBoYXMtaW5pdGlhbCAoc2Vjb25kIHBhcmFtcykgKGZpcnN0IHBhcmFtcykpKVxuICAgICAgICAoc3RlcCAgICAgICAgKGxhbWJkYSAoYWNjIHgpIChmIGFjYyB4KSkpKVxuICAgIChpZiBoYXMtaW5pdGlhbFxuICAgICAgKC5yZWR1Y2UgKHZlYyBzZXF1ZW5jZSkgc3RlcCBpbml0aWFsKVxuICAgICAgKC5yZWR1Y2UgKHZlYyBzZXF1ZW5jZSkgc3RlcCkpKSlcblxuKGRlZnVuIGNvdW50XG4gIChzZXF1ZW5jZSlcbiAgXCJSZXR1cm5zIG51bWJlciBvZiBlbGVtZW50cyBpbiBsaXN0XCJcbiAgKGlmIChhbmQgc2VxdWVuY2UgKG51bWJlcj8gKC4tbGVuZ3RoIHNlcXVlbmNlKSkpXG4gICAgKC4tbGVuZ3RoIHNlcXVlbmNlKVxuICAgIChsZXQqICgoaXQgKHNlcSBzZXF1ZW5jZSkpKVxuICAgICAgKGNvbmQgKChuaWw/IGl0KSAgICAgIDApXG4gICAgICAgICAgICAoKGxhenktc2VxPyBpdCkgKGNvdW50ICh2ZWMgaXQpKSlcbiAgICAgICAgICAgIChlbHNlICAgICAgICAgICguLWxlbmd0aCBpdCkpKSkpKVxuXG4oZGVmdW4gZW1wdHk/XG4gIChzZXF1ZW5jZSlcbiAgXCJSZXR1cm5zIHRydWUgaWYgbGlzdCBpcyBlbXB0eVwiXG4gIChsZXQqICgoaXQgKHNlcSBzZXF1ZW5jZSkpKVxuICAgIChpZGVudGljYWw/IDAgKGlmIChsYXp5LXNlcT8gaXQpXG4gICAgICAgICAgICAgICAgICAgIChwcm9nbiAoZmlyc3QgaXQpICAgICAgICAgICAgIDsgZm9yY2luZyBldmFsdWF0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAoLi1sZW5ndGggaXQpKVxuICAgICAgICAgICAgICAgICAgICAoY291bnQgaXQpKSkpKVxuXG4oZGVmdW4gZmlyc3RcbiAgKHNlcXVlbmNlKVxuICBcIlJldHVybiBmaXJzdCBpdGVtIGluIGEgbGlzdFwiXG4gIChjb25kICgobmlsPyBzZXF1ZW5jZSkgbmlsKVxuICAgICAgICAoKGxpc3Q/IHNlcXVlbmNlKSAoLi1oZWFkIHNlcXVlbmNlKSlcbiAgICAgICAgKChvciAodmVjdG9yPyBzZXF1ZW5jZSkgKHN0cmluZz8gc2VxdWVuY2UpKSAoZ2V0IHNlcXVlbmNlIDApKVxuICAgICAgICAoKGxhenktc2VxPyBzZXF1ZW5jZSkgKGZpcnN0IChsYXp5LXNlcS12YWx1ZSBzZXF1ZW5jZSkpKVxuICAgICAgICAoZWxzZSAoZmlyc3QgKHNlcSBzZXF1ZW5jZSkpKSkpXG5cbihkZWZ1biBzZWNvbmRcbiAgKHNlcXVlbmNlKVxuICBcIlJldHVybnMgc2Vjb25kIGl0ZW0gb2YgdGhlIGxpc3RcIlxuICAoY29uZCAoKG5pbD8gc2VxdWVuY2UpIG5pbClcbiAgICAgICAgKChsaXN0PyBzZXF1ZW5jZSkgKGZpcnN0IChyZXN0IHNlcXVlbmNlKSkpXG4gICAgICAgICgob3IgKHZlY3Rvcj8gc2VxdWVuY2UpIChzdHJpbmc/IHNlcXVlbmNlKSkgKGdldCBzZXF1ZW5jZSAxKSlcbiAgICAgICAgKChsYXp5LXNlcT8gc2VxdWVuY2UpIChzZWNvbmQgKGxhenktc2VxLXZhbHVlIHNlcXVlbmNlKSkpXG4gICAgICAgIChlbHNlIChmaXJzdCAocmVzdCAoc2VxIHNlcXVlbmNlKSkpKSkpXG5cbihkZWZ1biB0aGlyZFxuICAoc2VxdWVuY2UpXG4gIFwiUmV0dXJucyB0aGlyZCBpdGVtIG9mIHRoZSBsaXN0XCJcbiAgKGNvbmQgKChuaWw/IHNlcXVlbmNlKSBuaWwpXG4gICAgICAgICgobGlzdD8gc2VxdWVuY2UpIChmaXJzdCAocmVzdCAocmVzdCBzZXF1ZW5jZSkpKSlcbiAgICAgICAgKChvciAodmVjdG9yPyBzZXF1ZW5jZSkgKHN0cmluZz8gc2VxdWVuY2UpKSAoZ2V0IHNlcXVlbmNlIDIpKVxuICAgICAgICAoKGxhenktc2VxPyBzZXF1ZW5jZSkgKHRoaXJkIChsYXp5LXNlcS12YWx1ZSBzZXF1ZW5jZSkpKVxuICAgICAgICAoZWxzZSAoc2Vjb25kIChyZXN0IChzZXEgc2VxdWVuY2UpKSkpKSlcblxuKGRlZnVuIHJlc3RcbiAgKHNlcXVlbmNlKVxuICBcIlJldHVybnMgbGlzdCBvZiBhbGwgaXRlbXMgZXhjZXB0IGZpcnN0IG9uZVwiXG4gIChjb25kICgobmlsPyBzZXF1ZW5jZSkgJygpKVxuICAgICAgICAoKGxpc3Q/IHNlcXVlbmNlKSAoLi10YWlsIHNlcXVlbmNlKSlcbiAgICAgICAgKChvciAodmVjdG9yPyBzZXF1ZW5jZSkgKHN0cmluZz8gc2VxdWVuY2UpKSAoLnNsaWNlIHNlcXVlbmNlIDEpKVxuICAgICAgICAoKGxhenktc2VxPyBzZXF1ZW5jZSkgKHJlc3QgKGxhenktc2VxLXZhbHVlIHNlcXVlbmNlKSkpXG4gICAgICAgIChlbHNlIChyZXN0IChzZXEgc2VxdWVuY2UpKSkpKVxuXG4oZGVmdW4gY2FyXG4gIChzZXF1ZW5jZSlcbiAgXCJBbGlhcyBmb3IgYGZpcnN0YCAtLSB0aGUgdHJhZGl0aW9uYWwtTGlzcCBzcGVsbGluZzsgKGNhciBuaWwpIGlzIG5pbFwiXG4gIChmaXJzdCBzZXF1ZW5jZSkpXG5cbihkZWZ1biBjZHJcbiAgKHNlcXVlbmNlKVxuICBcIkFsaWFzIGZvciBgcmVzdGAgLS0gdGhlIHRyYWRpdGlvbmFsLUxpc3Agc3BlbGxpbmc7IChjZHIgbmlsKSBpcyBuaWxcIlxuICAocmVzdCBzZXF1ZW5jZSkpXG5cbihkZWZ1bi0gbGFzdC1vZi1saXN0XG4gIChsaXN0KVxuICAobG9vcCAoKGl0ZW0gKGZpcnN0IGxpc3QpKVxuICAgICAgICAgKGl0ZW1zIChyZXN0IGxpc3QpKSlcbiAgICAoaWYgKGVtcHR5PyBpdGVtcylcbiAgICAgIGl0ZW1cbiAgICAgIChyZWN1ciAoZmlyc3QgaXRlbXMpIChyZXN0IGl0ZW1zKSkpKSlcblxuKGRlZnVuIGxhc3RcbiAgKHNlcXVlbmNlKVxuICBcIlJldHVybiB0aGUgbGFzdCBpdGVtIGluIGNvbGwsIGluIGxpbmVhciB0aW1lXCJcbiAgKGNvbmQgKChvciAodmVjdG9yPyBzZXF1ZW5jZSlcbiAgICAgICAgICAgIChzdHJpbmc/IHNlcXVlbmNlKSkgKGdldCBzZXF1ZW5jZSAoZGVjIChjb3VudCBzZXF1ZW5jZSkpKSlcbiAgICAgICAgKChsaXN0PyBzZXF1ZW5jZSkgKGxhc3Qtb2YtbGlzdCBzZXF1ZW5jZSkpXG4gICAgICAgICgobmlsPyBzZXF1ZW5jZSkgbmlsKVxuICAgICAgICAoKGxhenktc2VxPyBzZXF1ZW5jZSkgKGxhc3QgKGxhenktc2VxLXZhbHVlIHNlcXVlbmNlKSkpXG4gICAgICAgIChlbHNlIChsYXN0IChzZXEgc2VxdWVuY2UpKSkpKVxuXG4oZGVmdW4gYnV0bGFzdFxuICAoc2VxdWVuY2UpXG4gIFwiUmV0dXJuIGEgc2VxIG9mIGFsbCBidXQgdGhlIGxhc3QgaXRlbSBpbiBjb2xsLCBpbiBsaW5lYXIgdGltZVwiXG4gIChsZXQqICgoaXRlbXMgKGNvbmQgKChuaWw/IHNlcXVlbmNlKSBuaWwpXG4gICAgICAgICAgICAgICAgICAgICgoc3RyaW5nPyBzZXF1ZW5jZSkgKHN1YnMgc2VxdWVuY2UgMCAoZGVjIChjb3VudCBzZXF1ZW5jZSkpKSlcbiAgICAgICAgICAgICAgICAgICAgKCh2ZWN0b3I/IHNlcXVlbmNlKSAoLnNsaWNlIHNlcXVlbmNlIDAgKGRlYyAoY291bnQgc2VxdWVuY2UpKSkpXG4gICAgICAgICAgICAgICAgICAgICgobGlzdD8gc2VxdWVuY2UpIChhcHBseSBsaXN0IChidXRsYXN0ICh2ZWMgc2VxdWVuY2UpKSkpXG4gICAgICAgICAgICAgICAgICAgICgobGF6eS1zZXE/IHNlcXVlbmNlKSAoYnV0bGFzdCAobGF6eS1zZXEtdmFsdWUgc2VxdWVuY2UpKSlcbiAgICAgICAgICAgICAgICAgICAgKGVsc2UgKGJ1dGxhc3QgKHNlcSBzZXF1ZW5jZSkpKSkpKVxuICAgIChpZiAoZW1wdHk/IGl0ZW1zKSBuaWwgaXRlbXMpKSlcblxuKGRlZnVuIHRha2VcbiAgKG4gc2VxdWVuY2UpXG4gIFwiUmV0dXJucyBhIHNlcXVlbmNlIG9mIHRoZSBmaXJzdCBgbmAgaXRlbXMsIG9yIGFsbCBpdGVtcyBpZlxuICB0aGVyZSBhcmUgZmV3ZXIgdGhhbiBgbmAuXCJcbiAgKGNvbmQgKChuaWw/IHNlcXVlbmNlKSAnKCkpXG4gICAgICAgICgodmVjdG9yPyBzZXF1ZW5jZSkgKHRha2UtZnJvbS12ZWN0b3IgbiBzZXF1ZW5jZSkpXG4gICAgICAgICgobGlzdD8gc2VxdWVuY2UpICh0YWtlLWZyb20tbGlzdCBuIHNlcXVlbmNlKSlcbiAgICAgICAgKChsYXp5LXNlcT8gc2VxdWVuY2UpIChpZiAoPiBuIDApICh0YWtlIG4gKGxhenktc2VxLXZhbHVlIHNlcXVlbmNlKSkpKVxuICAgICAgICAoZWxzZSAodGFrZSBuIChzZXEgc2VxdWVuY2UpKSkpKVxuXG4oZGVmdW4gdGFrZS13aGlsZVxuICAocHJlZGljYXRlIHNlcXVlbmNlKVxuICAobG9vcCAoKGl0ZW1zIHNlcXVlbmNlKSAocmVzdWx0IFtdKSlcbiAgICAobGV0KiAoKGhlYWQgKGZpcnN0IGl0ZW1zKSkgKHRhaWwgKHJlc3QgaXRlbXMpKSlcbiAgICAgIChpZiAoYW5kIChub3QgKGVtcHR5PyBpdGVtcykpXG4gICAgICAgICAgICAgICAocHJlZGljYXRlIGhlYWQpKVxuICAgICAgICAocmVjdXIgdGFpbCAoY29uaiByZXN1bHQgaGVhZCkpXG4gICAgICAgIChpZiAobmF0aXZlPyBzZXF1ZW5jZSkgcmVzdWx0IChhcHBseSBsaXN0IHJlc3VsdCkpKSkpKVxuXG5cbihkZWZ1bi0gdGFrZS1mcm9tLXZlY3RvclxuICAobiB2ZWN0b3IpXG4gIFwiTGlrZSB0YWtlIGJ1dCBvcHRpbWl6ZWQgZm9yIHZlY3RvcnNcIlxuICAoLnNsaWNlIHZlY3RvciAwIG4pKVxuXG4oZGVmdW4tIHRha2UtZnJvbS1saXN0XG4gIChuIHNlcXVlbmNlKVxuICBcIkxpa2UgdGFrZSBidXQgZm9yIGxpc3RzXCJcbiAgKGxvb3AgKCh0YWtlbiAnKCkpXG4gICAgICAgICAoaXRlbXMgc2VxdWVuY2UpXG4gICAgICAgICAobiAgICAgKG9yIChpbnQgbikgMCkpKVxuICAgIChpZiAob3IgKDw9IG4gMCkgKGVtcHR5PyBpdGVtcykpXG4gICAgICAocmV2ZXJzZSB0YWtlbilcbiAgICAgIChyZWN1ciAoY29ucyAoZmlyc3QgaXRlbXMpIHRha2VuKVxuICAgICAgICAgICAgIChyZXN0IGl0ZW1zKVxuICAgICAgICAgICAgIChkZWMgbikpKSkpXG5cblxuXG5cbihkZWZ1bi0gZHJvcC1mcm9tLWxpc3QgKG4gc2VxdWVuY2UpXG4gIChsb29wICgobGVmdCBuKVxuICAgICAgICAgKGl0ZW1zIHNlcXVlbmNlKSlcbiAgICAoaWYgKG9yICg8IGxlZnQgMSkgKGVtcHR5PyBpdGVtcykpXG4gICAgICBpdGVtc1xuICAgICAgKHJlY3VyIChkZWMgbGVmdCkgKHJlc3QgaXRlbXMpKSkpKVxuXG4oZGVmdW4gZHJvcFxuICAobiBzZXF1ZW5jZSlcbiAgKGlmICg8PSBuIDApXG4gICAgc2VxdWVuY2VcbiAgICAoY29uZCAoKHN0cmluZz8gc2VxdWVuY2UpICguc3Vic3RyIHNlcXVlbmNlIG4pKVxuICAgICAgICAgICgodmVjdG9yPyBzZXF1ZW5jZSkgKC5zbGljZSBzZXF1ZW5jZSBuKSlcbiAgICAgICAgICAoKGxpc3Q/IHNlcXVlbmNlKSAoZHJvcC1mcm9tLWxpc3QgbiBzZXF1ZW5jZSkpXG4gICAgICAgICAgKChuaWw/IHNlcXVlbmNlKSAnKCkpXG4gICAgICAgICAgKChsYXp5LXNlcT8gc2VxdWVuY2UpIChkcm9wIG4gKGxhenktc2VxLXZhbHVlIHNlcXVlbmNlKSkpXG4gICAgICAgICAgKGVsc2UgKGRyb3AgbiAoc2VxIHNlcXVlbmNlKSkpKSkpXG5cbihkZWZ1biBkcm9wLXdoaWxlXG4gIChwcmVkaWNhdGUgc2VxdWVuY2UpXG4gIChsb29wICgoaXRlbXMgKHNlcSBzZXF1ZW5jZSkpKVxuICAgIChpZiAob3IgKGVtcHR5PyBpdGVtcykgKG5vdCAocHJlZGljYXRlIChmaXJzdCBpdGVtcykpKSlcbiAgICAgIGl0ZW1zXG4gICAgICAocmVjdXIgKHJlc3QgaXRlbXMpKSkpKVxuXG5cbihkZWZ1bi0gY29uai1saXN0XG4gIChzZXF1ZW5jZSBpdGVtcylcbiAgKHJlZHVjZSAobGFtYmRhIChyZXN1bHQgaXRlbSkgKGNvbnMgaXRlbSByZXN1bHQpKSBzZXF1ZW5jZSBpdGVtcykpXG5cbihkZWZ1bi0gZW5zdXJlLWRpY3Rpb25hcnkgKHgpXG4gIChpZiAodmVjdG9yPyB4KVxuICAgIChkaWN0aW9uYXJ5IChmaXJzdCB4KSAoc2Vjb25kIHgpKVxuICAgIHgpKVxuXG4oZGVmdW4gY29ualxuICAoc2VxdWVuY2UgJnJlc3QgaXRlbXMpXG4gIChjb25kICgodmVjdG9yPyBzZXF1ZW5jZSkgKC5jb25jYXQgc2VxdWVuY2UgaXRlbXMpKVxuICAgICAgICAoKHN0cmluZz8gc2VxdWVuY2UpIChzdHIgc2VxdWVuY2UgKGFwcGx5IHN0ciBpdGVtcykpKVxuICAgICAgICAoKG5pbD8gc2VxdWVuY2UpIChhcHBseSBsaXN0IChyZXZlcnNlIGl0ZW1zKSkpXG4gICAgICAgICgoc2VxPyBzZXF1ZW5jZSkgKGNvbmotbGlzdCBzZXF1ZW5jZSBpdGVtcykpXG4gICAgICAgICgoZGljdGlvbmFyeT8gc2VxdWVuY2UpIChtZXJnZSBzZXF1ZW5jZSAoYXBwbHkgbWVyZ2UgKG1hcHYgZW5zdXJlLWRpY3Rpb25hcnkgaXRlbXMpKSkpXG4gICAgICAgICgoc2V0PyBzZXF1ZW5jZSkgKGFwcGx5IGlkZW50aXR5LXNldCAoaW50byAodmVjIHNlcXVlbmNlKSBpdGVtcykpKVxuICAgICAgICAoZWxzZSAodGhyb3cgKFR5cGVFcnJvciAoc3RyIFwiVHlwZSBjYW4ndCBiZSBjb25qb2luZWQgXCIgc2VxdWVuY2UpKSkpKSlcblxuKGRlZnVuIGRpc2pcbiAgKGNvbGwgJnJlc3Qga3MpXG4gIChsZXQqICgocHJlZGljYXRlIChjb21wbGVtZW50IChhcHBseSBpZGVudGl0eS1zZXQga3MpKSkpXG4gICAgKGNvbmQgKChlbXB0eT8ga3MpICAgICAgICBjb2xsKVxuICAgICAgICAgICgoc2V0PyBjb2xsKSAgICAgICAgKGFwcGx5IGlkZW50aXR5LXNldCAoZmlsdGVydiBwcmVkaWNhdGUgY29sbCkpKVxuICAgICAgICAgICgoZGljdGlvbmFyeT8gY29sbCkgKGludG8ge30gKGZpbHRlciAobGFtYmRhICglKSAocHJlZGljYXRlIChmaXJzdCAlKSkpIGNvbGwpKSlcbiAgICAgICAgICAoZWxzZSAgICAgICAgICAgICAgKHRocm93IChUeXBlRXJyb3IgKHN0ciBcIlR5cGUgY2FuJ3QgYmUgZGlzam9pbmVkIFwiIGNvbGwpKSkpKSkpXG5cbihkZWZ1biBpbnRvXG4gICh0byBmcm9tKVxuICAoYXBwbHkgY29uaiB0byAodmVjIGZyb20pKSlcblxuKGRlZnVuIHppcG1hcCAoa2V5cyB2YWxzKVxuICAoaW50byB7fSAobWFwIHZlY3RvciBrZXlzIHZhbHMpKSlcblxuKGRlZnVuIGFzc29jXG4gIChzb3VyY2UgJnJlc3Qga2V5LXZhbHVlcylcbiAgOyhhc3NlcnQgKGV2ZW4/IChjb3VudCBrZXktdmFsdWVzKSkgXCJXcm9uZyBudW1iZXIgb2YgYXJndW1lbnRzXCIpXG4gIDsoYXNzZXJ0IChhbmQgKG5vdCAoc2VxPyBzb3VyY2UpKVxuICA7ICAgICAgICAgICAgIChub3QgKHZlY3Rvcj8gc291cmNlKSlcbiAgOyAgICAgICAgICAgICAob2JqZWN0PyBzb3VyY2UpKSBcIkNhbiBvbmx5IGFzc29jIG9uIGRpY3Rpb25hcmllc1wiKVxuICAoY29uaiBzb3VyY2UgKGFwcGx5IGRpY3Rpb25hcnkga2V5LXZhbHVlcykpKVxuXG4oZGVmdW4gZGlzc29jXG4gIChjb2xsICZyZXN0IGtzKVxuICAoaWYgKGRpY3Rpb25hcnk/IGNvbGwpXG4gICAgKGFwcGx5IGRpc2ogY29sbCBrcylcbiAgICAodGhyb3cgKFR5cGVFcnJvciAoc3RyIFwiQ2FuIG9ubHkgZGlzc29jIG9uIGRpY3Rpb25hcmllc1wiKSkpKSlcblxuKGRlZnVuIGNvbmNhdFxuICAoJnJlc3Qgc2VxdWVuY2VzKVxuICBcIlJldHVybnMgbGlzdCByZXByZXNlbnRpbmcgdGhlIGNvbmNhdGVuYXRpb24gb2YgdGhlIGVsZW1lbnRzIGluIHRoZVxuICBzdXBwbGllZCBsaXN0cy5cIlxuICAocmVkdWNlIChsYW1iZGEgKCUxICUyKSAoY29uai1saXN0ICUxIChyZXZlcnNlICUyKSkpXG4gICAgICAgICAgKGxldCogKCh0YWlsIChsYXN0IHNlcXVlbmNlcykpKVxuICAgICAgICAgICAgKGlmIChsYXp5LXNlcT8gdGFpbCkgdGFpbCAoYXBwbHkgbGlzdCAodmVjIHRhaWwpKSkpXG4gICAgICAgICAgKHJlc3QgKHJldmVyc2Ugc2VxdWVuY2VzKSkpKVxuXG4oZGVmdW4gbWFwY2F0IChmICZyZXN0IGNvbGxzKVxuICAoYXBwbHkgY29uY2F0IChhcHBseSBtYXB2IGYgY29sbHMpKSlcblxuKGRlZnVuIGVtcHR5XG4gIChzZXF1ZW5jZSlcbiAgXCJQcm9kdWNlcyBlbXB0eSBzZXF1ZW5jZSBvZiB0aGUgc2FtZSB0eXBlIGFzIGFyZ3VtZW50LlwiXG4gIChjb25kICgobGlzdD8gc2VxdWVuY2UpICAgICAgICcoKSlcbiAgICAgICAgKCh2ZWN0b3I/IHNlcXVlbmNlKSAgICAgW10pXG4gICAgICAgICgoc3RyaW5nPyBzZXF1ZW5jZSkgICAgIFwiXCIpXG4gICAgICAgICgoZGljdGlvbmFyeT8gc2VxdWVuY2UpIHt9KVxuICAgICAgICAoKHNldD8gc2VxdWVuY2UpICAgICAgICAje30pXG4gICAgICAgICgobGF6eS1zZXE/IHNlcXVlbmNlKSAgIChsYXp5LXNlcSkpKSlcblxuKGRlZnVuIHNlcSAoc2VxdWVuY2UpXG4gIChjb25kICgobmlsPyBzZXF1ZW5jZSkgbmlsKVxuICAgICAgICAoKG9yICh2ZWN0b3I/IHNlcXVlbmNlKSAoc2VxPyBzZXF1ZW5jZSkpIHNlcXVlbmNlKVxuICAgICAgICAoKHN0cmluZz8gc2VxdWVuY2UpICguY2FsbCBBcnJheS5wcm90b3R5cGUuc2xpY2Ugc2VxdWVuY2UpKVxuICAgICAgICAoKGRpY3Rpb25hcnk/IHNlcXVlbmNlKSAoa2V5LXZhbHVlcyBzZXF1ZW5jZSkpXG4gICAgICAgICgoaXRlcmFibGU/IHNlcXVlbmNlKSAoaXRlcmF0b3ItPmxzZXEgKChnZXQgc2VxdWVuY2UgU3ltYm9sLml0ZXJhdG9yKSkpKVxuICAgICAgICAoZWxzZSAodGhyb3cgKFR5cGVFcnJvciAoc3RyIFwiQ2FuIG5vdCBzZXEgXCIgc2VxdWVuY2UpKSkpKSlcblxuKGRlZnVuIHNlcSogKHNlcXVlbmNlKVxuICAobGV0KiAoKGl0IChzZXEgc2VxdWVuY2UpKSlcbiAgICAoaWYgKGVtcHR5PyBpdCkgbmlsIGl0KSkpXG5cbihkZWZ1biBzZXE/IChzZXF1ZW5jZSlcbiAgKG9yIChsaXN0PyBzZXF1ZW5jZSlcbiAgICAgIChsYXp5LXNlcT8gc2VxdWVuY2UpKSlcblxuKGRlZnVuLSBpdGVyYXRvci0+bHNlcSAoaXRlcmF0b3IpXG4gICh1bmZvbGQgKGxhbWJkYSAoJSkgKGxldCogKCh4ICgubmV4dCAlKSkpXG4gICAgICAgICAgICAgKGlmICguLWRvbmUgeCkgbmlsIFsoLi12YWx1ZSB4KSAlXSkpKVxuICAgICAgICAgIGl0ZXJhdG9yKSlcblxuKGRlZnVuIHZlY1xuICAoc2VxdWVuY2UpXG4gIFwiQ3JlYXRlcyBhIG5ldyB2ZWN0b3IgY29udGFpbmluZyB0aGUgY29udGVudHMgb2Ygc2VxdWVuY2VcIlxuICAoY29uZCAoKG5pbD8gc2VxdWVuY2UpIFtdKVxuICAgICAgICAoKG9yICh2ZWN0b3I/IHNlcXVlbmNlKSAobGlzdD8gc2VxdWVuY2UpKSAoQXJyYXkuZnJvbSBzZXF1ZW5jZSkpXG4gICAgICAgICgobGF6eS1zZXE/IHNlcXVlbmNlKSAobGV0KiAoKHhzIChBcnJheS5mcm9tIHNlcXVlbmNlKSkpICAgICAgICAgICAgOyBvcHRpbWl6aW5nIGNvdW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHNldGYgKC4tbGVuZ3RoIHNlcXVlbmNlKSAoLi1sZW5ndGggeHMpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHhzKSlcbiAgICAgICAgKGVsc2UgKHZlYyAoc2VxIHNlcXVlbmNlKSkpKSlcblxuKGRlZnVuIHZlY3RvciAoJnJlc3Qgc2VxdWVuY2UpIHNlcXVlbmNlKVxuXG47OyBwcml2YXRlXG4oZGVmdmFyLVxuICBzb3J0LWNvbXBhcmF0b3JcbiAgKGlmICg9IFsxIDIgM10gKC5zb3J0IFsyIDEgM10gKGxhbWJkYSAoYSBiKSAoaWYgKDwgYSBiKSAwIDEpKSkpXG4gICAgKGxhbWJkYSAoJSkgKGxhbWJkYSAoYSBiKSAoaWYgKCUgYiBhKSAgMSAwKSkpICAgICAgIDsgcXVpY2tzb3J0IChDaHJvbWUsIE5vZGUpLCBtZXJnZXNvcnQgKEZpcmVmb3gpXG4gICAgKGxhbWJkYSAoJSkgKGxhbWJkYSAoYSBiKSAoaWYgKCUgYSBiKSAtMSAwKSkpKSkgICAgIDsgdGltc29ydCAoQ2hyb21lIDcwKywgTm9kZSAxMSspXG5cbihkZWZ1biBzb3J0XG4gIChmIGl0ZW1zKVxuICBcIlJldHVybnMgYSBzb3J0ZWQgc2VxdWVuY2Ugb2YgdGhlIGl0ZW1zIGluIGNvbGwuXG4gIElmIG5vIGNvbXBhcmF0b3IgaXMgc3VwcGxpZWQsIHVzZXMgY29tcGFyZS5cIlxuICAobGV0KiAoKGhhcy1jb21wYXJhdG9yIChmbj8gZikpXG4gICAgICAgIChpdGVtcyAgICAgICAgICAoaWYgKGFuZCAobm90IGhhcy1jb21wYXJhdG9yKSAobmlsPyBpdGVtcykpIGYgaXRlbXMpKVxuICAgICAgICA7OyBBcnJheS5wcm90b3R5cGUuc29ydCB0aHJvd3MgaWYgaGFuZGVkIGEgY29tcGFyYXRvciBhcmd1bWVudFxuICAgICAgICA7OyB0aGF0IGlzbid0IGEgZnVuY3Rpb24gb3IgKHJlYWwgSlMpIHVuZGVmaW5lZCAtLSBuaWwgaXMgcmVhbFxuICAgICAgICA7OyBudWxsIG5vdyAoUGhhc2UgMiksIHNvIGl0IGNhbid0IGJlIHBhc3NlZCB0aHJvdWdoIGRpcmVjdGx5XG4gICAgICAgIDs7IHdoZW4gdGhlcmUncyBubyBjb21wYXJhdG9yLlxuICAgICAgICAocmVzdWx0ICAgICAgICAgKGlmIGhhcy1jb21wYXJhdG9yXG4gICAgICAgICAgICAgICAgICAgICAgICAgICguc29ydCAodmVjIGl0ZW1zKSAoc29ydC1jb21wYXJhdG9yIGYpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAoLnNvcnQgKHZlYyBpdGVtcykpKSkpXG4gICAgKGNvbmQgKChuaWw/IGl0ZW1zKSAgICAnKCkpXG4gICAgICAgICAgKCh2ZWN0b3I/IGl0ZW1zKSByZXN1bHQpXG4gICAgICAgICAgKGVsc2UgICAgICAgICAgIChhcHBseSBsaXN0IHJlc3VsdCkpKSkpXG5cblxuKGRlZnVuIHJlcGVhdGVkbHlcbiAgKG4gZilcbiAgXCJUYWtlcyBhIGZ1bmN0aW9uIG9mIG5vIGFyZ3MsIHByZXN1bWFibHkgd2l0aCBzaWRlIGVmZmVjdHMsIGFuZFxuICByZXR1cm5zIHZlY3RvciBvZiBnaXZlbiBgbmAgbGVuZ3RoIHdpdGggY2FsbHMgdG8gaXRcIlxuICA7OyB3cmFwIHNvIEFycmF5LmZyb20ncyAoaXRlbSwgaW5kZXgpIGNhbGxiYWNrIGFyZ3MgbmV2ZXIgcmVhY2ggZlxuICAoQXJyYXkuZnJvbSB7Omxlbmd0aCBufSAobGFtYmRhICgpIChmKSkpKVxuXG4oZGVmdW4gcmVwZWF0XG4gIChuIHgpXG4gIFwiUmV0dXJucyBhIHZlY3RvciBvZiBnaXZlbiBgbmAgbGVuZ3RoIHdpdGggZ2l2ZW4gYHhgXG4gIGl0ZW1zLiBOb3QgY29tcGF0aWJsZSB3aXRoIGNsb2p1cmUgYXMgaXQncyBub3QgYSBsYXp5XG4gIGFuZCBvbmx5IGZpbml0ZSByZXBlYXRzIGFyZSBzdXBwb3J0ZWRcIlxuICAocmVwZWF0ZWRseSBuIChsYW1iZGEgKCkgeCkpKVxuXG5cbihkZWZ1biBldmVyeT9cbiAgKHByZWRpY2F0ZSBzZXF1ZW5jZSlcbiAgKC5ldmVyeSAodmVjIHNlcXVlbmNlKSAobGFtYmRhICglKSAocHJlZGljYXRlICUpKSkpXG5cbihkZWZ1biBzb21lXG4gIChwcmVkIGNvbGwpXG4gIFwiUmV0dXJucyB0aGUgZmlyc3QgbG9naWNhbCB0cnVlIHZhbHVlIG9mIChwcmVkIHgpIGZvciBhbnkgeCBpbiBjb2xsLFxuICBlbHNlIG5pbC4gIE9uZSBjb21tb24gaWRpb20gaXMgdG8gdXNlIGEgc2V0IGFzIHByZWQsIGZvciBleGFtcGxlXG4gIHRoaXMgd2lsbCByZXR1cm4gOmZyZWQgaWYgOmZyZWQgaXMgaW4gdGhlIHNlcXVlbmNlLCBvdGhlcndpc2UgbmlsOlxuICAoc29tZSAjezpmcmVkfSBjb2xsKVwiXG4gIChsb29wICgoaXRlbXMgKHNlcSBjb2xsKSkpXG4gICAgKGlmIChlbXB0eT8gaXRlbXMpIG5pbFxuICAgICAgKG9yIChwcmVkIChmaXJzdCBpdGVtcykpIChyZWN1ciAocmVzdCBpdGVtcykpKSkpKVxuXG5cbihkZWZ1biBwYXJ0aXRpb25cbiAgKG4gJnJlc3QgYXJncylcbiAgKGxldCogKChzdGVwIChpZiAoPj0gKGNvdW50IGFyZ3MpIDIpIChmaXJzdCBhcmdzKSBuKSlcbiAgICAgICAgKHBhZCAgKGlmICg+PSAoY291bnQgYXJncykgMykgKHNlY29uZCBhcmdzKSBbXSkpXG4gICAgICAgIChjb2xsIChsYXN0IGFyZ3MpKSlcbiAgICAobG9vcCAoKHJlc3VsdCBbXSlcbiAgICAgICAgICAgKGl0ZW1zIChzZXEgY29sbCkpKVxuICAgICAgKGxldCogKChjaHVuayAodGFrZSBuIGl0ZW1zKSlcbiAgICAgICAgICAgIChzaXplIChjb3VudCBjaHVuaykpKVxuICAgICAgICAoY29uZCAoKGlkZW50aWNhbD8gc2l6ZSBuKSAocmVjdXIgKGNvbmogcmVzdWx0IGNodW5rKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZHJvcCBzdGVwIGl0ZW1zKSkpXG4gICAgICAgICAgICAgICgoaWRlbnRpY2FsPyAwIHNpemUpIHJlc3VsdClcbiAgICAgICAgICAgICAgKCg+IG4gKCsgc2l6ZSAoY291bnQgcGFkKSkpIHJlc3VsdClcbiAgICAgICAgICAgICAgKGVsc2UgKGNvbmogcmVzdWx0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICh0YWtlIG4gKHZlYyAoY29uY2F0IGNodW5rXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZCkpKSkpKSkpKSlcblxuKGRlZnVuIGludGVybGVhdmUgKCZyZXN0IHNlcXVlbmNlcylcbiAgKGlmIChlbXB0eT8gc2VxdWVuY2VzKVxuICAgIFtdXG4gICAgKGxvb3AgKChyZXN1bHQgW10pXG4gICAgICAgICAgIChzZXF1ZW5jZXMgc2VxdWVuY2VzKSlcbiAgICAgIChpZiAoc29tZSBlbXB0eT8gc2VxdWVuY2VzKVxuICAgICAgICAodmVjIHJlc3VsdClcbiAgICAgICAgKHJlY3VyIChjb25jYXQgcmVzdWx0IChtYXAgZmlyc3Qgc2VxdWVuY2VzKSlcbiAgICAgICAgICAgICAgIChtYXAgcmVzdCBzZXF1ZW5jZXMpKSkpKSlcblxuKGRlZnVuIG50aFxuICAoc2VxdWVuY2UgaW5kZXggbm90LWZvdW5kKVxuICBcIlJldHVybnMgbnRoIGl0ZW0gb2YgdGhlIHNlcXVlbmNlXCJcbiAgKGxldCogKChzZXF1ZW5jZSAoc2VxKiBzZXF1ZW5jZSkpKVxuICAgIChjb25kICgobmlsPyBzZXF1ZW5jZSkgbm90LWZvdW5kKVxuICAgICAgICAgICgoc2VxPyBzZXF1ZW5jZSkgKGlmLWxldCBbaXQgKHNlcSogKGRyb3AgaW5kZXggc2VxdWVuY2UpKV1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZmlyc3QgaXQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbm90LWZvdW5kKSlcbiAgICAgICAgICAoKG9yICh2ZWN0b3I/IHNlcXVlbmNlKVxuICAgICAgICAgICAgICAoc3RyaW5nPyBzZXF1ZW5jZSkpIChpZiAoPCBpbmRleCAoY291bnQgc2VxdWVuY2UpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGFnZXQgc2VxdWVuY2UgaW5kZXgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub3QtZm91bmQpKVxuICAgICAgICAgIChlbHNlICh0aHJvdyAoVHlwZUVycm9yIFwiVW5zdXBwb3J0ZWQgdHlwZVwiKSkpKSkpXG5cblxuKGRlZnVuIGNvbnRhaW5zP1xuICAoY29sbCB2KVxuICBcIlJldHVybnMgdHJ1ZSBpZiBrZXkgaXMgcHJlc2VudCBpbiB0aGUgZ2l2ZW4gY29sbGVjdGlvbiwgb3RoZXJ3aXNlXG4gIHJldHVybnMgZmFsc2UuICBOb3RlIHRoYXQgZm9yIG51bWVyaWNhbGx5IGluZGV4ZWQgY29sbGVjdGlvbnMgbGlrZVxuICB2ZWN0b3JzIGFuZCBzdHJpbmdzLCB0aGlzIHRlc3RzIGlmIHRoZSBudW1lcmljIGtleSBpcyB3aXRoaW4gdGhlXG4gIHJhbmdlIG9mIGluZGV4ZXMuICdjb250YWlucz8nIG9wZXJhdGVzIGNvbnN0YW50IG9yIGxvZ2FyaXRobWljIHRpbWU7XG4gIGl0IHdpbGwgbm90IHBlcmZvcm0gYSBsaW5lYXIgc2VhcmNoIGZvciBhIHZhbHVlLiAgU2VlIGFsc28gJ3NvbWUnLlwiXG4gIChjb25kICgoc2V0PyBjb2xsKSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoLmhhcyBjb2xsIHYpKVxuICAgICAgICAoKG9yIChkaWN0aW9uYXJ5PyBjb2xsKSAodmVjdG9yPyBjb2xsKSAoc3RyaW5nPyBjb2xsKSkgKC5oYXMtb3duLXByb3BlcnR5IGNvbGwgdikpXG4gICAgICAgIChlbHNlICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhbHNlKSkpXG5cbihkZWZ1biB1bmlvblxuICAoJnJlc3Qgc2V0cylcbiAgXCJSZXR1cm4gYSBzZXQgdGhhdCBpcyB0aGUgdW5pb24gb2YgdGhlIGlucHV0IHNldHNcIlxuICAoaW50byAje30gKGFwcGx5IGNvbmNhdCBzZXRzKSkpXG5cbihkZWZ1biBkaWZmZXJlbmNlXG4gIChzMSAmcmVzdCBzZXRzKVxuICBcIlJldHVybiBhIHNldCB0aGF0IGlzIHRoZSBmaXJzdCBzZXQgd2l0aG91dCBlbGVtZW50cyBvZiB0aGUgcmVtYWluaW5nIHNldHNcIlxuICAoaW50byAje30gKGZpbHRlciAoY29tcGxlbWVudCAoYXBwbHkgdW5pb24gc2V0cykpXG4gICAgICAgICAgICAgICAgICAgIHMxKSkpXG5cbihkZWZ1biBpbnRlcnNlY3Rpb25cbiAgKCZyZXN0IHNldHMpXG4gIFwiUmV0dXJuIGEgc2V0IHRoYXQgaXMgdGhlIGludGVyc2VjdGlvbiBvZiB0aGUgaW5wdXQgc2V0c1wiXG4gIChsZXQqICgoc2V0cyAgICAgKG1hcHYgKGxhbWJkYSAoJSkgKGludG8gI3t9ICUpKSBzZXRzKSlcbiAgICAgICAgKGluLWVhY2g/IChsYW1iZGEgKHgpIChldmVyeT8gKGxhbWJkYSAoJSkgKC5oYXMgJSB4KSkgc2V0cykpKVxuICAgICAgICAobWluLXNpemUgKGFwcGx5IG1pbiAobWFwdiBjb3VudCBzZXRzKSkpXG4gICAgICAgIChzbWFsbGVzdCAoLmZpbmQgc2V0cyAobGFtYmRhICglKSAoPSBtaW4tc2l6ZSAoY291bnQgJSkpKSkpKVxuICAgIChpbnRvICN7fSAoZmlsdGVyIGluLWVhY2g/IHNtYWxsZXN0KSkpKVxuXG4oZGVmdW4gc3Vic2V0P1xuICAoc2V0MSBzZXQyKVxuICBcIklzIHNldDEgYSBzdWJzZXQgb2Ygc2V0Mj9cIlxuICAoaWYgKHNldD8gc2V0MilcbiAgICAoZXZlcnk/IChsYW1iZGEgKCUpICguaGFzIHNldDIgJSkpIHNldDEpXG4gICAgKHN1YnNldD8gc2V0MSAoaW50byAje30gc2V0MikpKSlcblxuKGRlZnVuIHN1cGVyc2V0P1xuICAoc2V0MSBzZXQyKVxuICBcIklzIHNldDEgYSBzdXBlcnNldCBvZiBzZXQyP1wiXG4gIChzdWJzZXQ/IHNldDIgc2V0MSkpXG5cblxuKGRlZnVuIHVuZm9sZFxuICAoZiB4KVxuICBcIlJldHVybnMgYSBsYXp5IHNlcXVlbmNlOyAoZiB4KSBpcyBleHBlY3RlZCB0byByZXR1cm4gZWl0aGVyIG5pbCAoc2lnbmlmeWluZyBlbmQgb2Ygc2VxdWVuY2UpXG4gIG9yIFt5IHgxXSAod2hlcmUgeSBpcyBuZXh0IHNlcXVlbmNlIGl0ZW0sIGFuZCB4MSBpcyBuZXh0IHZhbHVlIG9mIHgpXCJcbiAgKGxhenktc2VxIChpZi1sZXQgW25leHQgKGYgeCldXG4gICAgICAgICAgICAgIChjb25zIChmaXJzdCBuZXh0KSAodW5mb2xkIGYgKHNlY29uZCBuZXh0KSkpKSkpXG5cbihkZWZ1biBpdGVyYXRlXG4gIChmIHgpXG4gIFwiUmV0dXJucyBhIGxhenkgc2VxdWVuY2Ugb2YgeCwgKGYgeCksIChmIChmIHgpKSBldGMuIGYgbXVzdCBiZSBmcmVlIG9mIHNpZGUtZWZmZWN0c1wiXG4gIChsYXp5LXNlcSAoY29ucyB4IChpdGVyYXRlIGYgKGYgeCkpKSkpXG5cbihkZWZ1biBjeWNsZVxuICAoY29sbClcbiAgXCJSZXR1cm5zIGEgbGF6eSAoaW5maW5pdGUhKSBzZXF1ZW5jZSBvZiByZXBldGl0aW9ucyBvZiB0aGUgaXRlbXMgaW4gY29sbC5cIlxuICAobGF6eS1zZXEgKGlmIChlbXB0eT8gY29sbClcbiAgICAgICAgICAgICAgbmlsXG4gICAgICAgICAgICAgIChjb25jYXQgY29sbCAoY3ljbGUgY29sbCkpKSkpXG5cbihkZWZ1biBpbmZpbml0ZS1yYW5nZVxuICAoJnJlc3QgYXJncylcbiAgKGxldCogKChuIChpZiAoZW1wdHk/IGFyZ3MpIDAgKGZpcnN0IGFyZ3MpKSlcbiAgICAgICAgKHN0ZXAgKHNlY29uZCBhcmdzKSkpXG4gICAgKGlmIChuaWw/IHN0ZXApXG4gICAgICAoaXRlcmF0ZSBpbmMgbilcbiAgICAgIChpdGVyYXRlIChsYW1iZGEgKCUpICgrICUgc3RlcCkpIG4pKSkpXG5cbihkZWZ1biBsYXp5LW1hcCAoZiAmcmVzdCBzZXF1ZW5jZXMpXG4gICh1bmZvbGQgKGxhbWJkYSAoJSkgKGlmIChzb21lIGVtcHR5PyAlKVxuICAgICAgICAgICAgIG5pbFxuICAgICAgICAgICAgIFsoYXBwbHkgZiAobWFwdiBmaXJzdCAlKSkgKG1hcHYgcmVzdCAlKV0pKVxuICAgICAgICAgIHNlcXVlbmNlcykpXG5cbihkZWZ1biBsYXp5LWZpbHRlciAoZiBzZXF1ZW5jZSlcbiAgKHVuZm9sZCAobGFtYmRhICglKSAobG9vcCAoKHhzICUpKVxuICAgICAgICAgICAgIChjb25kICgoZW1wdHk/IHhzKSAgICBuaWwpXG4gICAgICAgICAgICAgICAgICAgKChmIChmaXJzdCB4cykpIFsoZmlyc3QgeHMpIChyZXN0IHhzKV0pXG4gICAgICAgICAgICAgICAgICAgKGVsc2UgICAgICAgICAgKHJlY3VyIChyZXN0IHhzKSkpKSkpXG4gICAgICAgICAgKHNlcSBzZXF1ZW5jZSkpKVxuXG4oZGVmdW4gbGF6eS1jb25jYXQgKCZyZXN0IHNlcXVlbmNlcylcbiAgKGlmIChlbXB0eT8gc2VxdWVuY2VzKVxuICAgIG5pbFxuICAgICgobGFtYmRhIGl0ZXIgKHhzKVxuICAgICAgIChsYXp5LXNlcSAoaWYgKGVtcHR5PyB4cylcbiAgICAgICAgICAgICAgICAgICAoYXBwbHkgbGF6eS1jb25jYXQgKHJlc3Qgc2VxdWVuY2VzKSlcbiAgICAgICAgICAgICAgICAgICAoY29ucyAoZmlyc3QgeHMpIChpdGVyIChyZXN0IHhzKSkpKSkpXG4gICAgIChzZXEgKGZpcnN0IHNlcXVlbmNlcykpKSkpXG5cbihkZWZ1biBsYXp5LXBhcnRpdGlvblxuICAobiAmcmVzdCBhcmdzKVxuICAobGV0KiAoKHN0ZXAgKGlmICg+PSAoY291bnQgYXJncykgMikgKGZpcnN0IGFyZ3MpIG4pKVxuICAgICAgICAocGFkICAoaWYgKD49IChjb3VudCBhcmdzKSAzKSAoc2Vjb25kIGFyZ3MpIFtdKSlcbiAgICAgICAgKGNvbGwgKGxhc3QgYXJncykpKVxuICAgICh1bmZvbGQgKGxhbWJkYSAoJSkgKGxldCogKChjaHVuayAodGFrZSBuIChjb25jYXQgKHRha2UgbiAlKSBwYWQpKSkpXG4gICAgICAgICAgICAgICAoaWYgKGFuZCAobm90IChlbXB0eT8gJSkpIChpZGVudGljYWw/IG4gKGNvdW50IGNodW5rKSkpXG4gICAgICAgICAgICAgICAgIFtjaHVuayAoZHJvcCBzdGVwICUpXSkpKVxuICAgICAgICAgICAgY29sbCkpKVxuXG5cbihkZWZ1biBydW4hXG4gIChwcm9jIGNvbGwpXG4gIFwiUnVucyB0aGUgc3VwcGxpZWQgcHJvY2VkdXJlICh2aWEgcmVkdWNlKSwgZm9yIHB1cnBvc2VzIG9mIHNpZGVcbiAgZWZmZWN0cywgb24gc3VjY2Vzc2l2ZSBpdGVtcyBpbiB0aGUgY29sbGVjdGlvbi4gUmV0dXJucyBuaWxcIlxuICAocmVkdWNlIChsYW1iZGEgKF8geCkgKHByb2MgeCkgbmlsKSBuaWwgY29sbCkpXG5cbihkZWZ1biBkb3J1blxuICAoJnJlc3QgYXJncylcbiAgXCJXaGVuIGxhenkgc2VxdWVuY2VzIGFyZSBwcm9kdWNlZCB2aWEgZnVuY3Rpb25zIHRoYXQgaGF2ZSBzaWRlXG4gIGVmZmVjdHMsIGFueSBlZmZlY3RzIG90aGVyIHRoYW4gdGhvc2UgbmVlZGVkIHRvIHByb2R1Y2UgdGhlIGZpcnN0XG4gIGVsZW1lbnQgaW4gdGhlIHNlcSBkbyBub3Qgb2NjdXIgdW50aWwgdGhlIHNlcSBpcyBjb25zdW1lZC4gZG9ydW4gY2FuXG4gIGJlIHVzZWQgdG8gZm9yY2UgYW55IGVmZmVjdHMuIFdhbGtzIHRocm91Z2ggdGhlIHN1Y2Nlc3NpdmUgbmV4dHMgb2ZcbiAgdGhlIHNlcSwgZG9lcyBub3QgcmV0YWluIHRoZSBoZWFkIGFuZCByZXR1cm5zIG5pbC5cIlxuICAobGV0KiAoKG4gKGlmIChpZGVudGljYWw/IChjb3VudCBhcmdzKSAxKSBJbmZpbml0eSAoZmlyc3QgYXJncykpKVxuICAgICAgICAoY29sbCAobGFzdCBhcmdzKSkpXG4gICAgKHJ1biEgaWRlbnRpdHkgKHRha2UgbiBjb2xsKSkpKVxuXG4oZGVmdW4gZG9hbGxcbiAgKCZyZXN0IGFyZ3MpXG4gIFwiV2hlbiBsYXp5IHNlcXVlbmNlcyBhcmUgcHJvZHVjZWQgdmlhIGZ1bmN0aW9ucyB0aGF0IGhhdmUgc2lkZVxuICBlZmZlY3RzLCBhbnkgZWZmZWN0cyBvdGhlciB0aGFuIHRob3NlIG5lZWRlZCB0byBwcm9kdWNlIHRoZSBmaXJzdFxuICBlbGVtZW50IGluIHRoZSBzZXEgZG8gbm90IG9jY3VyIHVudGlsIHRoZSBzZXEgaXMgY29uc3VtZWQuIGRvcnVuIGNhblxuICBiZSB1c2VkIHRvIGZvcmNlIGFueSBlZmZlY3RzLiBXYWxrcyB0aHJvdWdoIHRoZSBzdWNjZXNzaXZlIG5leHRzIG9mXG4gIHRoZSBzZXEsIHJldGFpbnMgdGhlIGhlYWQgYW5kIHJldHVybnMgaXQsIHRodXMgY2F1c2luZyB0aGUgZW50aXJlXG4gIHNlcSB0byByZXNpZGUgaW4gbWVtb3J5IGF0IG9uZSB0aW1lLlwiXG4gIChsZXQqICgobiAoaWYgKGlkZW50aWNhbD8gKGNvdW50IGFyZ3MpIDEpIEluZmluaXR5IChmaXJzdCBhcmdzKSkpXG4gICAgICAgIChjb2xsIChsYXN0IGFyZ3MpKSlcbiAgICAoZG9ydW4gbiBjb2xsKVxuICAgIGNvbGwpKVxuIl19
