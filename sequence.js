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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndpc3Avc2VxdWVuY2Uud2lzcCJdLCJuYW1lcyI6WyJfbnNfIiwiaWQiLCJkb2MiLCJpc05pbCIsImlzVmVjdG9yIiwiaXNGbiIsImlzTnVtYmVyIiwiaXNTdHJpbmciLCJpc0RpY3Rpb25hcnkiLCJpc1NldCIsImtleVZhbHVlcyIsInN0ciIsImludCIsImRlYyIsImluYyIsIm1pbiIsIm1lcmdlIiwiZGljdGlvbmFyeSIsImdldCIsImlzSXRlcmFibGUiLCJpc0VxdWFsIiwiY29tcGxlbWVudCIsImlkZW50aXR5IiwiaXNMaXN0IiwiaXNMYXp5U2VxIiwiaXNJZGVudGl0eVNldCIsIl93aXNwVHlwZXMiLCJsaXN0SXRlcmF0b3IiLCJzZWxmw7gxIiwidGhpcyIsImlzRW1wdHkiLCJ4w7gxIiwiZmlyc3QiLCJyZXN0Iiwic2VxVG9TdHJpbmciLCJscGFyZW4iLCJycGFyZW4iLCJsaXN0w7gxIiwicmVzdWx0w7gxIiwic3Vic3RyIiwiam9pbiIsIkpTT04iLCJzdHJpbmdpZnkiLCJMaXN0IiwiaGVhZCIsInRhaWwiLCJsaXN0IiwibGVuZ3RoIiwiY291bnQiLCJwcm90b3R5cGUubGVuZ3RoIiwidHlwZSIsInByb3RvdHlwZS50eXBlIiwicHJvdG90eXBlLnRhaWwiLCJwcm90b3R5cGUudG9TdHJpbmciLCJwcm90b3R5cGUiLCJTeW1ib2wiLCJpdGVyYXRvciIsImxhenlTZXFWYWx1ZSIsImxhenlTZXEiLCJyZWFsaXplZCIsIngiLCJMYXp5U2VxIiwiZXhwb3J0cyIsImJvZHkiLCJjbG9uZVByb3RvUHJvcHMiLCJmcm9tIiwidG8iLCJPYmplY3QiLCJhc3NpZ24iLCJnZXRPd25Qcm9wZXJ0eU5hbWVzIiwiX19wcm90b19fIiwibWFwIiwiJCIsImJpbmQiLCJpZGVudGl0eVNldCIsIml0ZW1zIiwianNTZXTDuDEiLCJmw7gxIiwiJDEiLCIkMiIsInRvU3RyaW5nIiwiYXBwbHkiLCJGdW5jdGlvbiIsInByb3RvdHlwZS5hcHBseSIsImNhbGwiLCJwcm90b3R5cGUuY2FsbCIsImRlZmluZVByb3BlcnR5Iiwic2l6ZSIsInZhbHVlcyIsInNldCIsIl9zZXFFcXVhbCIsInkiLCJpc1NlcSIsInjDuDIiLCJzZXEiLCJ5w7gyIiwiZXZlcnkiLCJhcmd1bWVudHMiLCJBcnJheSIsInByb3RvdHlwZS5zbGljZSIsInJlZHVjZVJpZ2h0IiwiY29ucyIsImlzU2VxdWVudGlhbCIsImlzTmF0aXZlIiwic2VxdWVuY2UiLCJyZXZlcnNlIiwidmVjIiwiaW50byIsInJhbmdlIiwiYXJncyIsInNlY29uZCIsInN0YXJ0w7gxIiwiZW5kw7gxIiwic3RlcMO4MSIsInRoaXJkIiwiXyIsImkiLCJtYXB2IiwiZiIsInNlcXVlbmNlcyIsInZlY3RvcnPDuDEiLCJuw7gxIiwibWFwSW5kZXhlZCIsInNlcXVlbmNlw7gxIiwiaW5kaWNlc8O4MSIsImZpbHRlciIsImlzRiIsImZpbHRlckxpc3QiLCJpdGVtc8O4MSIsImZpbHRlcnYiLCJyZWR1Y2UiLCJwYXJhbXMiLCJoYXNJbml0aWFsw7gxIiwiaW5pdGlhbMO4MSIsImFjYyIsIml0w7gxIiwic2xpY2UiLCJsYXN0T2ZMaXN0IiwiaXRlbcO4MSIsImxhc3QiLCJidXRsYXN0Iiwic3VicyIsInRha2UiLCJuIiwidGFrZUZyb21WZWN0b3IiLCJ0YWtlRnJvbUxpc3QiLCJ0YWtlV2hpbGUiLCJwcmVkaWNhdGUiLCJoZWFkw7gxIiwidGFpbMO4MSIsImNvbmoiLCJ2ZWN0b3IiLCJ0YWtlbsO4MSIsIm7DuDIiLCJkcm9wRnJvbUxpc3QiLCJsZWZ0w7gxIiwiZHJvcCIsImRyb3BXaGlsZSIsImNvbmpMaXN0IiwicmVzdWx0IiwiaXRlbSIsImVuc3VyZURpY3Rpb25hcnkiLCJjb25jYXQiLCJUeXBlRXJyb3IiLCJkaXNqIiwiY29sbCIsImtzIiwicHJlZGljYXRlw7gxIiwiemlwbWFwIiwia2V5cyIsInZhbHMiLCJhc3NvYyIsInNvdXJjZSIsImRpc3NvYyIsIm1hcGNhdCIsImNvbGxzIiwiZW1wdHkiLCJpdGVyYXRvclRvTHNlcSIsInNlcV8iLCJ1bmZvbGQiLCJuZXh0IiwiZG9uZSIsInZhbHVlIiwieHPDuDEiLCJzb3J0Q29tcGFyYXRvciIsInNvcnQiLCJhIiwiYiIsImhhc0NvbXBhcmF0b3LDuDEiLCJpdGVtc8O4MiIsInJlcGVhdGVkbHkiLCJyZXBlYXQiLCJpc0V2ZXJ5Iiwic29tZSIsInByZWQiLCJwYXJ0aXRpb24iLCJwYWTDuDEiLCJjb2xsw7gxIiwiY2h1bmvDuDEiLCJzaXplw7gxIiwiaW50ZXJsZWF2ZSIsInNlcXVlbmNlc8O4MiIsIm50aCIsImluZGV4Iiwibm90Rm91bmQiLCJzZXF1ZW5jZcO4MiIsImlzQ29udGFpbnMiLCJ2IiwiaGFzIiwiaGFzT3duUHJvcGVydHkiLCJ1bmlvbiIsInNldHMiLCJkaWZmZXJlbmNlIiwiczEiLCJpbnRlcnNlY3Rpb24iLCJzZXRzw7gyIiwiaXNJbkVhY2jDuDEiLCJtaW5TaXplw7gxIiwic21hbGxlc3TDuDEiLCJmaW5kIiwiaXNTdWJzZXQiLCJzZXQxIiwic2V0MiIsImlzU3VwZXJzZXQiLCJuZXh0w7gxIiwiaXRlcmF0ZSIsImN5Y2xlIiwiaW5maW5pdGVSYW5nZSIsImxhenlNYXAiLCJsYXp5RmlsdGVyIiwibGF6eUNvbmNhdCIsIml0ZXIiLCJ4cyIsImxhenlQYXJ0aXRpb24iLCJydW4iLCJwcm9jIiwiZG9ydW4iLCJJbmZpbml0eSIsImRvYWxsIl0sIm1hcHBpbmdzIjoiO0lBQUEsSUFBQ0EsSSxHQUFEO0FBQUEsUUFBQUMsRSxFQUFJLGVBQUo7QUFBQSxRQUFBQyxHLEVBQUE7QUFBQSxNOztRQUNrQ0MsS0FBQSxHLGFBQUFBLEs7UUFBS0MsUUFBQSxHLGFBQUFBLFE7UUFBUUMsSUFBQSxHLGFBQUFBLEk7UUFBSUMsUUFBQSxHLGFBQUFBLFE7UUFBUUMsUUFBQSxHLGFBQUFBLFE7UUFBUUMsWUFBQSxHLGFBQUFBLFk7UUFBWUMsS0FBQSxHLGFBQUFBLEs7UUFDN0NDLFNBQUEsRyxhQUFBQSxTO1FBQVdDLEdBQUEsRyxhQUFBQSxHO1FBQUlDLEdBQUEsRyxhQUFBQSxHO1FBQUlDLEdB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S0FBRCxDQUFPbkgsR0FBUCxFQUFTNEUsTUFBVCxFQUZNO0FBQUEsUUFHTixPQUFBQSxNQUFBLENBSE07QUFBQSxLLEtBQVIsQyxJQUFBLEU7Q0FSRiIsInNvdXJjZXNDb250ZW50IjpbIihucyB3aXNwLnNlcXVlbmNlXG4gICg6cmVxdWlyZSBbd2lzcC5ydW50aW1lIDpyZWZlciBbbmlsPyB2ZWN0b3I/IGZuPyBudW1iZXI/IHN0cmluZz8gZGljdGlvbmFyeT8gc2V0P1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleS12YWx1ZXMgc3RyIGludCBkZWMgaW5jIG1pbiBtZXJnZSBkaWN0aW9uYXJ5IGdldFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZXJhYmxlPyA9IGNvbXBsZW1lbnQgaWRlbnRpdHkgbGlzdD8gbGF6eS1zZXE/IGlkZW50aXR5LXNldD9dXSkpXG5cbihkZWZ2YXItIC13aXNwLXR5cGVzIChhZ2V0ID0gJy13aXNwLXR5cGVzKSlcblxuOzsgSW1wbGVtZW50YXRpb24gb2YgbGlzdFxuXG4oZGVmdW4tIGxpc3QtaXRlcmF0b3IgKClcbiAgKGxldCogKChzZWxmIHRoaXMpKVxuICAgIHs6bmV4dCAobGFtYmRhICgpXG4gICAgICAgICAgICAgKGlmIChlbXB0eT8gc2VsZilcbiAgICAgICAgICAgICAgezpkb25lIHRydWV9XG4gICAgICAgICAgICAgIChsZXQqICgoeCAoZmlyc3Qgc2VsZikpKVxuICAgICAgICAgICAgICAgIChzZXRmIHNlbGYgKHJlc3Qgc2VsZikpXG4gICAgICAgICAgICAgICAgezp2YWx1ZSB4fSkpKX0pKVxuXG4oZGVmdW4tIHNlcS0+c3RyaW5nIChscGFyZW4gcnBhcmVuKVxuICAobGFtYmRhICgpXG4gICAgKGxvb3AgKChsaXN0IHRoaXMpIChyZXN1bHQgXCJcIikpXG4gICAgICAoaWYgKGVtcHR5PyBsaXN0KVxuICAgICAgICAoc3RyIGxwYXJlbiAoLnN1YnN0ciByZXN1bHQgMSkgcnBhcmVuKVxuICAgICAgICAocmVjdXIgKHJlc3QgbGlzdClcbiAgICAgICAgICAgICAgIChzdHIgcmVzdWx0XG4gICAgICAgICAgICAgICAgICAgIFwiIFwiXG4gICAgICAgICAgICAgICAgICAgIChsZXQqICgoeCAoZmlyc3QgbGlzdCkpKVxuICAgICAgICAgICAgICAgICAgICAgIChjb25kICgodmVjdG9yPyB4KSAoc3RyIFwiW1wiICguam9pbiB4IFwiIFwiKSBcIl1cIikpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKChuaWw/ICAgIHgpIFwibmlsXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKChzdHJpbmc/IHgpICguc3RyaW5naWZ5IEpTT04geCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKChudW1iZXI/IHgpICguc3RyaW5naWZ5IEpTT04geCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGVsc2UgICAgICAgeCkpKSkpKSkpKVxuXG4oZGVmdW4tIExpc3RcbiAgKGhlYWQgdGFpbClcbiAgXCJMaXN0IHR5cGVcIlxuICAoc2V0ZiB0aGlzLmhlYWQgaGVhZClcbiAgKHNldGYgdGhpcy50YWlsIChvciB0YWlsIChsaXN0KSkpXG4gIChzZXRmIHRoaXMubGVuZ3RoXG4gICAgKGlmIChvciAobmlsPyB0aGlzLnRhaWwpIChkaWN0aW9uYXJ5PyB0aGlzLnRhaWwpIChudW1iZXI/ICguLWxlbmd0aCB0aGlzLnRhaWwpKSlcbiAgICAgIChpbmMgKGNvdW50IHRoaXMudGFpbCkpKSlcbiAgdGhpcylcblxuKHNldGYgTGlzdC5wcm90b3R5cGUubGVuZ3RoIDApXG4oc2V0ZiBMaXN0LnR5cGUgKDpsaXN0IC13aXNwLXR5cGVzKSlcbihzZXRmIExpc3QucHJvdG90eXBlLnR5cGUgTGlzdC50eXBlKVxuKHNldGYgTGlzdC5wcm90b3R5cGUudGFpbCBuaWwpXG4oc2V0ZiBMaXN0LnByb3RvdHlwZS50by1zdHJpbmcgKHNlcS0+c3RyaW5nIFwiKFwiIFwiKVwiKSlcbihhc2V0IExpc3QucHJvdG90eXBlIFN5bWJvbC5pdGVyYXRvciBsaXN0LWl0ZXJhdG9yKVxuXG4oZGVmdW4tIGxhenktc2VxLXZhbHVlIChsYXp5LXNlcSlcbiAgKGlmICguLXJlYWxpemVkIGxhenktc2VxKVxuICAgICguLXggbGF6eS1zZXEpXG4gICAgKGxldCogKCh4ICgueCBsYXp5LXNlcSkpKVxuICAgICAgKHNldGYgKC4tcmVhbGl6ZWQgbGF6eS1zZXEpIHRydWUpXG4gICAgICAoaWYgKGVtcHR5PyB4KVxuICAgICAgICAoc2V0ZiAoLi1sZW5ndGggbGF6eS1zZXEpIDApKVxuICAgICAgKHNldGYgKC4teCBsYXp5LXNlcSkgeCkpKSlcblxuKGRlZnVuLSBMYXp5U2VxIChyZWFsaXplZCB4KVxuICAoc2V0ZiAoLi1yZWFsaXplZCB0aGlzKSAob3IgcmVhbGl6ZWQgZmFsc2UpKVxuICAoc2V0ZiAoLi14IHRoaXMpIHgpXG4gIHRoaXMpXG4oc2V0ZiBMYXp5U2VxLnR5cGUgKDpsYXp5LXNlcSAtd2lzcC10eXBlcykpXG4oc2V0ZiBMYXp5U2VxLnByb3RvdHlwZS50eXBlIExhenlTZXEudHlwZSlcbihhc2V0IExhenlTZXEucHJvdG90eXBlIFN5bWJvbC5pdGVyYXRvciBsaXN0LWl0ZXJhdG9yKVxuXG4oZGVmdW4gbGF6eS1zZXFcbiAgKHJlYWxpemVkIGJvZHkpXG4gIChMYXp5U2VxLiByZWFsaXplZCBib2R5KSlcblxuKGRlZnVuLSBjbG9uZS1wcm90by1wcm9wcyEgKGZyb20gdG8pXG4gIChhcHBseSBPYmplY3QuYXNzaWduIHRvXG4gICAgICAgICAoLm1hcCAoT2JqZWN0LmdldC1vd24tcHJvcGVydHktbmFtZXMgZnJvbS5fX3Byb3RvX18pXG4gICAgICAgICAgICAgICAobGFtYmRhICglKSAobGV0KiAoKHggKGFnZXQgZnJvbSAlKSkpXG4gICAgICAgICAgICAgICAgICAoZGljdGlvbmFyeSAlIChpZiAoZm4/IHgpICguYmluZCB4IGZyb20pIHgpKSkpKSkpXG5cbihkZWZ1biBpZGVudGl0eS1zZXQgKCZyZXN0IGl0ZW1zKVxuICAobGV0KiAoKGpzLXNldCAoU2V0LiBpdGVtcykpXG4gICAgICAgIChmICAgICAgKGxhbWJkYSAoJTEgJTIpIChnZXQganMtc2V0ICUxICUyKSkpKVxuICAgIChjbG9uZS1wcm90by1wcm9wcyEganMtc2V0IGYpXG4gICAgKHNldGYgZi50by1zdHJpbmcgKHNlcS0+c3RyaW5nIFwiI3tcIiBcIn1cIikpXG4gICAgOzsgUmVhc3NpZ25pbmcgX19wcm90b19fIGJlbG93IHNldmVycyBmJ3MgbGluayB0byBGdW5jdGlvbi5wcm90b3R5cGUsXG4gICAgOzsgc28gY2FsbGVycyB0aGF0IGRvIChmLmFwcGx5IC4uLikvKGYuY2FsbCAuLi4pIChlLmcuIGNvbXBsZW1lbnQsXG4gICAgOzsgYXBwbHkpIHdvdWxkIG90aGVyd2lzZSBmaW5kIG5vIHN1Y2ggbWV0aG9kIC0tIHBpbiB0aGVtIGRvd24gYXNcbiAgICA7OyBvd24gcHJvcGVydGllcyBmaXJzdCBzbyBmIHN0YXlzIHVzYWJsZSBhcyBhIHBsYWluIGZ1bmN0aW9uIHRvby5cbiAgICAoc2V0ZiBmLmFwcGx5IEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseSlcbiAgICAoc2V0ZiBmLmNhbGwgRnVuY3Rpb24ucHJvdG90eXBlLmNhbGwpXG4gICAgKHNldGYgZi5fX3Byb3RvX18ganMtc2V0KVxuICAgIChPYmplY3QuZGVmaW5lLXByb3BlcnR5IGYgOmxlbmd0aCB7OnZhbHVlIGYuc2l6ZX0pXG4gICAgKGFzZXQgZiBTeW1ib2wuaXRlcmF0b3IgZi52YWx1ZXMpXG4gICAgKGFzZXQgZiA6dHlwZSBpZGVudGl0eS1zZXQudHlwZSlcbiAgICBmKSlcbihzZXRmIGlkZW50aXR5LXNldC50eXBlICg6c2V0IC13aXNwLXR5cGVzKSlcbihkZWZ2YXIgc2V0IGlkZW50aXR5LXNldClcblxuKGRlZnZhciBsYXp5LXNlcT8gbGF6eS1zZXE/KVxuKGRlZnZhciBpZGVudGl0eS1zZXQ/IGlkZW50aXR5LXNldD8pXG4oZGVmdmFyIGxpc3Q/IGxpc3Q/KVxuXG4oc2V0ZiA9LipzZXE9XG4gIChsYW1iZGEgKHggeSlcbiAgICAoYW5kIChvciAodmVjdG9yPyB4KSAoc2VxPyB4KSlcbiAgICAgICAgIChvciAodmVjdG9yPyB5KSAoc2VxPyB5KSlcbiAgICAgICAgIChsb29wICgoeCAoc2VxIHgpKSAoeSAoc2VxIHkpKSlcbiAgICAgICAgICAgKGNvbmQgKChhbmQgKHZlY3Rvcj8geCkgKHZlY3Rvcj8geSkpIChhbmQgKD0gKGNvdW50IHgpIChjb3VudCB5KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoLmV2ZXJ5IHggKGxhbWJkYSAoJTEgJTIpICg9ICUxIChhZ2V0IHkgJTIpKSkpKSlcbiAgICAgICAgICAgICAgICAgKChvciAoZW1wdHk/IHgpIChlbXB0eT8geSkpICAgIChhbmQgKGVtcHR5PyB4KSAoZW1wdHk/IHkpKSlcbiAgICAgICAgICAgICAgICAgKChub3Q9IChmaXJzdCB4KSAoZmlyc3QgeSkpICAgIGZhbHNlKVxuICAgICAgICAgICAgICAgICAoZWxzZSAgICAgICAgICAgICAgICAgICAgICAgICAocmVjdXIgKHJlc3QgeCkgKHJlc3QgeSkpKSkpKSkpXG5cbihkZWZ1biBsaXN0XG4gICgpXG4gIFwiQ3JlYXRlcyBsaXN0IG9mIHRoZSBnaXZlbiBpdGVtc1wiXG4gIChpZiAoaWRlbnRpY2FsPyAoLi1sZW5ndGggYXJndW1lbnRzKSAwKVxuICAgIG5pbFxuICAgICgucmVkdWNlLXJpZ2h0ICguY2FsbCBBcnJheS5wcm90b3R5cGUuc2xpY2UgYXJndW1lbnRzKVxuICAgICAgICAgICAgICAgICAgIChsYW1iZGEgKHRhaWwgaGVhZCkgKGNvbnMgaGVhZCB0YWlsKSlcbiAgICAgICAgICAgICAgICAgICAobGlzdCkpKSlcblxuKGRlZnVuIGNvbnNcbiAgKGhlYWQgdGFpbClcbiAgXCJDcmVhdGVzIGxpc3Qgd2l0aCBgaGVhZGAgYXMgZmlyc3QgaXRlbSBhbmQgYHRhaWxgIGFzIHJlc3RcIlxuICAobmV3IExpc3QgaGVhZCB0YWlsKSlcblxuKGRlZnVuIHNlcXVlbnRpYWw/XG4gICh4KVxuICBcIlJldHVybnMgdHJ1ZSBpZiBjb2xsIHNhdGlzZmllcyBJU2VxdWVudGlhbFwiXG4gIChvciAoc2VxPyB4KVxuICAgICAgICAgICh2ZWN0b3I/IHgpXG4gICAgICAgICAgKGRpY3Rpb25hcnk/IHgpXG4gICAgICAgICAgKHNldD8geClcbiAgICAgICAgICAoc3RyaW5nPyB4KSkpXG5cbihkZWZ1bi0gbmF0aXZlPyAoc2VxdWVuY2UpXG4gIChvciAodmVjdG9yPyBzZXF1ZW5jZSkgKHN0cmluZz8gc2VxdWVuY2UpIChkaWN0aW9uYXJ5PyBzZXF1ZW5jZSkpKVxuXG5cbihkZWZ1biByZXZlcnNlXG4gIChzZXF1ZW5jZSlcbiAgXCJSZXZlcnNlIG9yZGVyIG9mIGl0ZW1zIGluIHRoZSBzZXF1ZW5jZVwiXG4gIChpZiAodmVjdG9yPyBzZXF1ZW5jZSlcbiAgICAoLnJldmVyc2UgKHZlYyBzZXF1ZW5jZSkpXG4gICAgKGludG8gbmlsIHNlcXVlbmNlKSkpXG5cbihkZWZ1biByYW5nZVxuICAoJnJlc3QgYXJncylcbiAgXCJSZXR1cm5zIGEgdmVjdG9yIG9mIG51bXMgZnJvbSBzdGFydCAoaW5jbHVzaXZlKSB0byBlbmRcbiAgKGV4Y2x1c2l2ZSksIGJ5IHN0ZXAsIHdoZXJlIHN0YXJ0IGRlZmF1bHRzIHRvIDAgYW5kIHN0ZXAgdG8gMS5cIlxuICAoY29uZCAoKGlkZW50aWNhbD8gKGNvdW50IGFyZ3MpIDEpIChyYW5nZSAwIChmaXJzdCBhcmdzKSAxKSlcbiAgICAgICAgKChpZGVudGljYWw/IChjb3VudCBhcmdzKSAyKSAocmFuZ2UgKGZpcnN0IGFyZ3MpIChzZWNvbmQgYXJncykgMSkpXG4gICAgICAgIChlbHNlXG4gICAgICAgIChsZXQqICgoc3RhcnQgKGZpcnN0IGFyZ3MpKSAoZW5kIChzZWNvbmQgYXJncykpIChzdGVwICh0aGlyZCBhcmdzKSkpXG4gICAgICAgICAgKGlmICg8IHN0ZXAgMClcbiAgICAgICAgICAgICAgICAgICAgICAoLm1hcCAocmFuZ2UgKC0gc3RhcnQpICgtIGVuZCkgKC0gc3RlcCkpIChsYW1iZGEgKCUpICgtICUpKSlcbiAgICAgICAgICAgICAgICAgICAgICAoQXJyYXkuZnJvbSB7Omxlbmd0aCAoLyAoLSAoKyBlbmQgc3RlcCkgc3RhcnQgMSkgc3RlcCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGxhbWJkYSAoXyBpKSAoKyBzdGFydCAoKiBpIHN0ZXApKSkpKSkpKSlcblxuKGRlZnVuIG1hcHZcbiAgKGYgJnJlc3Qgc2VxdWVuY2VzKVxuICBcIlJldHVybnMgYSB2ZWN0b3IgY29uc2lzdGluZyBvZiB0aGUgcmVzdWx0IG9mIGFwcGx5aW5nIGBmYCB0byB0aGVcbiAgZmlyc3QgaXRlbXMsIGZvbGxvd2VkIGJ5IGFwcGx5aW5nIGYgdG8gdGhlIHNlY29uZCBpdGVtcywgdW50aWwgb25lIG9mXG4gIHNlcXVlbmNlcyBpcyBleGhhdXN0ZWQuXCJcbiAgKGxldCogKCh2ZWN0b3JzICgubWFwIHNlcXVlbmNlcyB2ZWMpKSAobiAoYXBwbHkgbWluICgubWFwIHZlY3RvcnMgY291bnQpKSkpXG4gICAgKC5tYXAgKHJhbmdlIG4pIChsYW1iZGEgKGkpIChhcHBseSBmICgubWFwIHZlY3RvcnMgKGxhbWJkYSAoJSkgKGFnZXQgJSBpKSkpKSkpKSlcblxuKGRlZnVuIG1hcFxuICAoZiAmcmVzdCBzZXF1ZW5jZXMpXG4gIFwiUmV0dXJucyBhIHNlcXVlbmNlIGNvbnNpc3Rpbmcgb2YgdGhlIHJlc3VsdCBvZiBhcHBseWluZyBgZmAgdG8gdGhlXG4gIGZpcnN0IGl0ZW1zLCBmb2xsb3dlZCBieSBhcHBseWluZyBmIHRvIHRoZSBzZWNvbmQgaXRlbXMsIHVudGlsIG9uZSBvZlxuICBzZXF1ZW5jZXMgaXMgZXhoYXVzdGVkLlwiXG4gIChsZXQqICgocmVzdWx0IChhcHBseSBtYXB2IGYgc2VxdWVuY2VzKSkpXG4gICAgKGlmIChuYXRpdmU/IChmaXJzdCBzZXF1ZW5jZXMpKSByZXN1bHQgKGFwcGx5IGxpc3QgcmVzdWx0KSkpKVxuXG4oZGVmdW4gbWFwLWluZGV4ZWRcbiAgKGYgJnJlc3Qgc2VxdWVuY2VzKVxuICBcIlJldHVybnMgYSBzZXF1ZW5jZSBjb25zaXN0aW5nIG9mIHRoZSByZXN1bHQgb2YgYXBwbHlpbmcgYGZgIHRvIDAgYW5kXG4gIHRoZSBmaXJzdCBpdGVtcywgZm9sbG93ZWQgYnkgYXBwbHlpbmcgZiB0byAxIGFuZCB0aGUgc2Vjb25kIGl0ZW1zLFxuICB1bnRpbCBvbmUgb2Ygc2VxdWVuY2VzIGlzIGV4aGF1c3RlZC5cIlxuICAobGV0KiAoKHNlcXVlbmNlIChmaXJzdCBzZXF1ZW5jZXMpKSAobiAoY291bnQgc2VxdWVuY2UpKSAoaW5kaWNlcyAocmFuZ2UgbikpKVxuICAgIChhcHBseSBtYXAgZiAoaWYgKG5hdGl2ZT8gc2VxdWVuY2UpIGluZGljZXMgKGFwcGx5IGxpc3QgaW5kaWNlcykpIHNlcXVlbmNlcykpKVxuXG4oZGVmdW4gZmlsdGVyXG4gIChmPyBzZXF1ZW5jZSlcbiAgXCJSZXR1cm5zIGEgc2VxdWVuY2Ugb2YgdGhlIGl0ZW1zIGluIGNvbGwgZm9yIHdoaWNoIChmPyBpdGVtKSByZXR1cm5zIHRydWUuXG4gIGY/IG11c3QgYmUgZnJlZSBvZiBzaWRlLWVmZmVjdHMuXCJcbiAgKGNvbmQgKChuaWw/IHNlcXVlbmNlKSAgICAnKCkpXG4gICAgICAgICgoc2VxPyBzZXF1ZW5jZSkgICAgKGZpbHRlci1saXN0IGY/IHNlcXVlbmNlKSlcbiAgICAgICAgKCh2ZWN0b3I/IHNlcXVlbmNlKSAoLmZpbHRlciBzZXF1ZW5jZSAobGFtYmRhICglKSAoZj8gJSkpKSlcbiAgICAgICAgKGVsc2UgICAgICAgICAgICAgIChmaWx0ZXIgZj8gKHNlcSBzZXF1ZW5jZSkpKSkpXG5cbihkZWZ1bi0gZmlsdGVyLWxpc3RcbiAgKGY/IHNlcXVlbmNlKVxuICBcIkxpa2UgZmlsdGVyIGJ1dCBmb3IgbGlzdHNcIlxuICAobG9vcCAoKHJlc3VsdCAnKCkpXG4gICAgICAgICAoaXRlbXMgc2VxdWVuY2UpKVxuICAgIChpZiAoZW1wdHk/IGl0ZW1zKVxuICAgICAgKHJldmVyc2UgcmVzdWx0KVxuICAgICAgKHJlY3VyIChpZiAoZj8gKGZpcnN0IGl0ZW1zKSlcbiAgICAgICAgICAgICAgIChjb25zIChmaXJzdCBpdGVtcykgcmVzdWx0KVxuICAgICAgICAgICAgICAgcmVzdWx0KVxuICAgICAgICAgICAgIChyZXN0IGl0ZW1zKSkpKSlcblxuKGRlZnVuIGZpbHRlcnYgKGY/IHNlcXVlbmNlKVxuICAodmVjIChmaWx0ZXIgZj8gc2VxdWVuY2UpKSlcblxuKGRlZnVuIHJlZHVjZVxuICAoZiAmcmVzdCBwYXJhbXMpXG4gIChsZXQqICgoaGFzLWluaXRpYWwgKD49IChjb3VudCBwYXJhbXMpIDIpKVxuICAgICAgICAoaW5pdGlhbCAgICAgKGlmIGhhcy1pbml0aWFsIChmaXJzdCBwYXJhbXMpKSlcbiAgICAgICAgKHNlcXVlbmNlICAgIChpZiBoYXMtaW5pdGlhbCAoc2Vjb25kIHBhcmFtcykgKGZpcnN0IHBhcmFtcykpKVxuICAgICAgICAoc3RlcCAgICAgICAgKGxhbWJkYSAoYWNjIHgpIChmIGFjYyB4KSkpKVxuICAgIChpZiBoYXMtaW5pdGlhbFxuICAgICAgKC5yZWR1Y2UgKHZlYyBzZXF1ZW5jZSkgc3RlcCBpbml0aWFsKVxuICAgICAgKC5yZWR1Y2UgKHZlYyBzZXF1ZW5jZSkgc3RlcCkpKSlcblxuKGRlZnVuIGNvdW50XG4gIChzZXF1ZW5jZSlcbiAgXCJSZXR1cm5zIG51bWJlciBvZiBlbGVtZW50cyBpbiBsaXN0XCJcbiAgKGlmIChhbmQgc2VxdWVuY2UgKG51bWJlcj8gKC4tbGVuZ3RoIHNlcXVlbmNlKSkpXG4gICAgKC4tbGVuZ3RoIHNlcXVlbmNlKVxuICAgIChsZXQqICgoaXQgKHNlcSBzZXF1ZW5jZSkpKVxuICAgICAgKGNvbmQgKChuaWw/IGl0KSAgICAgIDApXG4gICAgICAgICAgICAoKGxhenktc2VxPyBpdCkgKGNvdW50ICh2ZWMgaXQpKSlcbiAgICAgICAgICAgIChlbHNlICAgICAgICAgICguLWxlbmd0aCBpdCkpKSkpKVxuXG4oZGVmdW4gZW1wdHk/XG4gIChzZXF1ZW5jZSlcbiAgXCJSZXR1cm5zIHRydWUgaWYgbGlzdCBpcyBlbXB0eVwiXG4gIChsZXQqICgoaXQgKHNlcSBzZXF1ZW5jZSkpKVxuICAgIChpZGVudGljYWw/IDAgKGlmIChsYXp5LXNlcT8gaXQpXG4gICAgICAgICAgICAgICAgICAgIChwcm9nbiAoZmlyc3QgaXQpICAgICAgICAgICAgIDsgZm9yY2luZyBldmFsdWF0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAoLi1sZW5ndGggaXQpKVxuICAgICAgICAgICAgICAgICAgICAoY291bnQgaXQpKSkpKVxuXG4oZGVmdW4gZmlyc3RcbiAgKHNlcXVlbmNlKVxuICBcIlJldHVybiBmaXJzdCBpdGVtIGluIGEgbGlzdFwiXG4gIChjb25kICgobmlsPyBzZXF1ZW5jZSkgbmlsKVxuICAgICAgICAoKGxpc3Q/IHNlcXVlbmNlKSAoLi1oZWFkIHNlcXVlbmNlKSlcbiAgICAgICAgKChvciAodmVjdG9yPyBzZXF1ZW5jZSkgKHN0cmluZz8gc2VxdWVuY2UpKSAoZ2V0IHNlcXVlbmNlIDApKVxuICAgICAgICAoKGxhenktc2VxPyBzZXF1ZW5jZSkgKGZpcnN0IChsYXp5LXNlcS12YWx1ZSBzZXF1ZW5jZSkpKVxuICAgICAgICAoZWxzZSAoZmlyc3QgKHNlcSBzZXF1ZW5jZSkpKSkpXG5cbihkZWZ1biBzZWNvbmRcbiAgKHNlcXVlbmNlKVxuICBcIlJldHVybnMgc2Vjb25kIGl0ZW0gb2YgdGhlIGxpc3RcIlxuICAoY29uZCAoKG5pbD8gc2VxdWVuY2UpIG5pbClcbiAgICAgICAgKChsaXN0PyBzZXF1ZW5jZSkgKGZpcnN0IChyZXN0IHNlcXVlbmNlKSkpXG4gICAgICAgICgob3IgKHZlY3Rvcj8gc2VxdWVuY2UpIChzdHJpbmc/IHNlcXVlbmNlKSkgKGdldCBzZXF1ZW5jZSAxKSlcbiAgICAgICAgKChsYXp5LXNlcT8gc2VxdWVuY2UpIChzZWNvbmQgKGxhenktc2VxLXZhbHVlIHNlcXVlbmNlKSkpXG4gICAgICAgIChlbHNlIChmaXJzdCAocmVzdCAoc2VxIHNlcXVlbmNlKSkpKSkpXG5cbihkZWZ1biB0aGlyZFxuICAoc2VxdWVuY2UpXG4gIFwiUmV0dXJucyB0aGlyZCBpdGVtIG9mIHRoZSBsaXN0XCJcbiAgKGNvbmQgKChuaWw/IHNlcXVlbmNlKSBuaWwpXG4gICAgICAgICgobGlzdD8gc2VxdWVuY2UpIChmaXJzdCAocmVzdCAocmVzdCBzZXF1ZW5jZSkpKSlcbiAgICAgICAgKChvciAodmVjdG9yPyBzZXF1ZW5jZSkgKHN0cmluZz8gc2VxdWVuY2UpKSAoZ2V0IHNlcXVlbmNlIDIpKVxuICAgICAgICAoKGxhenktc2VxPyBzZXF1ZW5jZSkgKHRoaXJkIChsYXp5LXNlcS12YWx1ZSBzZXF1ZW5jZSkpKVxuICAgICAgICAoZWxzZSAoc2Vjb25kIChyZXN0IChzZXEgc2VxdWVuY2UpKSkpKSlcblxuKGRlZnVuIHJlc3RcbiAgKHNlcXVlbmNlKVxuICBcIlJldHVybnMgbGlzdCBvZiBhbGwgaXRlbXMgZXhjZXB0IGZpcnN0IG9uZVwiXG4gIChjb25kICgobmlsPyBzZXF1ZW5jZSkgJygpKVxuICAgICAgICAoKGxpc3Q/IHNlcXVlbmNlKSAoLi10YWlsIHNlcXVlbmNlKSlcbiAgICAgICAgKChvciAodmVjdG9yPyBzZXF1ZW5jZSkgKHN0cmluZz8gc2VxdWVuY2UpKSAoLnNsaWNlIHNlcXVlbmNlIDEpKVxuICAgICAgICAoKGxhenktc2VxPyBzZXF1ZW5jZSkgKHJlc3QgKGxhenktc2VxLXZhbHVlIHNlcXVlbmNlKSkpXG4gICAgICAgIChlbHNlIChyZXN0IChzZXEgc2VxdWVuY2UpKSkpKVxuXG4oZGVmdW4tIGxhc3Qtb2YtbGlzdFxuICAobGlzdClcbiAgKGxvb3AgKChpdGVtIChmaXJzdCBsaXN0KSlcbiAgICAgICAgIChpdGVtcyAocmVzdCBsaXN0KSkpXG4gICAgKGlmIChlbXB0eT8gaXRlbXMpXG4gICAgICBpdGVtXG4gICAgICAocmVjdXIgKGZpcnN0IGl0ZW1zKSAocmVzdCBpdGVtcykpKSkpXG5cbihkZWZ1biBsYXN0XG4gIChzZXF1ZW5jZSlcbiAgXCJSZXR1cm4gdGhlIGxhc3QgaXRlbSBpbiBjb2xsLCBpbiBsaW5lYXIgdGltZVwiXG4gIChjb25kICgob3IgKHZlY3Rvcj8gc2VxdWVuY2UpXG4gICAgICAgICAgICAoc3RyaW5nPyBzZXF1ZW5jZSkpIChnZXQgc2VxdWVuY2UgKGRlYyAoY291bnQgc2VxdWVuY2UpKSkpXG4gICAgICAgICgobGlzdD8gc2VxdWVuY2UpIChsYXN0LW9mLWxpc3Qgc2VxdWVuY2UpKVxuICAgICAgICAoKG5pbD8gc2VxdWVuY2UpIG5pbClcbiAgICAgICAgKChsYXp5LXNlcT8gc2VxdWVuY2UpIChsYXN0IChsYXp5LXNlcS12YWx1ZSBzZXF1ZW5jZSkpKVxuICAgICAgICAoZWxzZSAobGFzdCAoc2VxIHNlcXVlbmNlKSkpKSlcblxuKGRlZnVuIGJ1dGxhc3RcbiAgKHNlcXVlbmNlKVxuICBcIlJldHVybiBhIHNlcSBvZiBhbGwgYnV0IHRoZSBsYXN0IGl0ZW0gaW4gY29sbCwgaW4gbGluZWFyIHRpbWVcIlxuICAobGV0KiAoKGl0ZW1zIChjb25kICgobmlsPyBzZXF1ZW5jZSkgbmlsKVxuICAgICAgICAgICAgICAgICAgICAoKHN0cmluZz8gc2VxdWVuY2UpIChzdWJzIHNlcXVlbmNlIDAgKGRlYyAoY291bnQgc2VxdWVuY2UpKSkpXG4gICAgICAgICAgICAgICAgICAgICgodmVjdG9yPyBzZXF1ZW5jZSkgKC5zbGljZSBzZXF1ZW5jZSAwIChkZWMgKGNvdW50IHNlcXVlbmNlKSkpKVxuICAgICAgICAgICAgICAgICAgICAoKGxpc3Q/IHNlcXVlbmNlKSAoYXBwbHkgbGlzdCAoYnV0bGFzdCAodmVjIHNlcXVlbmNlKSkpKVxuICAgICAgICAgICAgICAgICAgICAoKGxhenktc2VxPyBzZXF1ZW5jZSkgKGJ1dGxhc3QgKGxhenktc2VxLXZhbHVlIHNlcXVlbmNlKSkpXG4gICAgICAgICAgICAgICAgICAgIChlbHNlIChidXRsYXN0IChzZXEgc2VxdWVuY2UpKSkpKSlcbiAgICAoaWYgKGVtcHR5PyBpdGVtcykgbmlsIGl0ZW1zKSkpXG5cbihkZWZ1biB0YWtlXG4gIChuIHNlcXVlbmNlKVxuICBcIlJldHVybnMgYSBzZXF1ZW5jZSBvZiB0aGUgZmlyc3QgYG5gIGl0ZW1zLCBvciBhbGwgaXRlbXMgaWZcbiAgdGhlcmUgYXJlIGZld2VyIHRoYW4gYG5gLlwiXG4gIChjb25kICgobmlsPyBzZXF1ZW5jZSkgJygpKVxuICAgICAgICAoKHZlY3Rvcj8gc2VxdWVuY2UpICh0YWtlLWZyb20tdmVjdG9yIG4gc2VxdWVuY2UpKVxuICAgICAgICAoKGxpc3Q/IHNlcXVlbmNlKSAodGFrZS1mcm9tLWxpc3QgbiBzZXF1ZW5jZSkpXG4gICAgICAgICgobGF6eS1zZXE/IHNlcXVlbmNlKSAoaWYgKD4gbiAwKSAodGFrZSBuIChsYXp5LXNlcS12YWx1ZSBzZXF1ZW5jZSkpKSlcbiAgICAgICAgKGVsc2UgKHRha2UgbiAoc2VxIHNlcXVlbmNlKSkpKSlcblxuKGRlZnVuIHRha2Utd2hpbGVcbiAgKHByZWRpY2F0ZSBzZXF1ZW5jZSlcbiAgKGxvb3AgKChpdGVtcyBzZXF1ZW5jZSkgKHJlc3VsdCBbXSkpXG4gICAgKGxldCogKChoZWFkIChmaXJzdCBpdGVtcykpICh0YWlsIChyZXN0IGl0ZW1zKSkpXG4gICAgICAoaWYgKGFuZCAobm90IChlbXB0eT8gaXRlbXMpKVxuICAgICAgICAgICAgICAgKHByZWRpY2F0ZSBoZWFkKSlcbiAgICAgICAgKHJlY3VyIHRhaWwgKGNvbmogcmVzdWx0IGhlYWQpKVxuICAgICAgICAoaWYgKG5hdGl2ZT8gc2VxdWVuY2UpIHJlc3VsdCAoYXBwbHkgbGlzdCByZXN1bHQpKSkpKSlcblxuXG4oZGVmdW4tIHRha2UtZnJvbS12ZWN0b3JcbiAgKG4gdmVjdG9yKVxuICBcIkxpa2UgdGFrZSBidXQgb3B0aW1pemVkIGZvciB2ZWN0b3JzXCJcbiAgKC5zbGljZSB2ZWN0b3IgMCBuKSlcblxuKGRlZnVuLSB0YWtlLWZyb20tbGlzdFxuICAobiBzZXF1ZW5jZSlcbiAgXCJMaWtlIHRha2UgYnV0IGZvciBsaXN0c1wiXG4gIChsb29wICgodGFrZW4gJygpKVxuICAgICAgICAgKGl0ZW1zIHNlcXVlbmNlKVxuICAgICAgICAgKG4gICAgIChvciAoaW50IG4pIDApKSlcbiAgICAoaWYgKG9yICg8PSBuIDApIChlbXB0eT8gaXRlbXMpKVxuICAgICAgKHJldmVyc2UgdGFrZW4pXG4gICAgICAocmVjdXIgKGNvbnMgKGZpcnN0IGl0ZW1zKSB0YWtlbilcbiAgICAgICAgICAgICAocmVzdCBpdGVtcylcbiAgICAgICAgICAgICAoZGVjIG4pKSkpKVxuXG5cblxuXG4oZGVmdW4tIGRyb3AtZnJvbS1saXN0IChuIHNlcXVlbmNlKVxuICAobG9vcCAoKGxlZnQgbilcbiAgICAgICAgIChpdGVtcyBzZXF1ZW5jZSkpXG4gICAgKGlmIChvciAoPCBsZWZ0IDEpIChlbXB0eT8gaXRlbXMpKVxuICAgICAgaXRlbXNcbiAgICAgIChyZWN1ciAoZGVjIGxlZnQpIChyZXN0IGl0ZW1zKSkpKSlcblxuKGRlZnVuIGRyb3BcbiAgKG4gc2VxdWVuY2UpXG4gIChpZiAoPD0gbiAwKVxuICAgIHNlcXVlbmNlXG4gICAgKGNvbmQgKChzdHJpbmc/IHNlcXVlbmNlKSAoLnN1YnN0ciBzZXF1ZW5jZSBuKSlcbiAgICAgICAgICAoKHZlY3Rvcj8gc2VxdWVuY2UpICguc2xpY2Ugc2VxdWVuY2UgbikpXG4gICAgICAgICAgKChsaXN0PyBzZXF1ZW5jZSkgKGRyb3AtZnJvbS1saXN0IG4gc2VxdWVuY2UpKVxuICAgICAgICAgICgobmlsPyBzZXF1ZW5jZSkgJygpKVxuICAgICAgICAgICgobGF6eS1zZXE/IHNlcXVlbmNlKSAoZHJvcCBuIChsYXp5LXNlcS12YWx1ZSBzZXF1ZW5jZSkpKVxuICAgICAgICAgIChlbHNlIChkcm9wIG4gKHNlcSBzZXF1ZW5jZSkpKSkpKVxuXG4oZGVmdW4gZHJvcC13aGlsZVxuICAocHJlZGljYXRlIHNlcXVlbmNlKVxuICAobG9vcCAoKGl0ZW1zIChzZXEgc2VxdWVuY2UpKSlcbiAgICAoaWYgKG9yIChlbXB0eT8gaXRlbXMpIChub3QgKHByZWRpY2F0ZSAoZmlyc3QgaXRlbXMpKSkpXG4gICAgICBpdGVtc1xuICAgICAgKHJlY3VyIChyZXN0IGl0ZW1zKSkpKSlcblxuXG4oZGVmdW4tIGNvbmotbGlzdFxuICAoc2VxdWVuY2UgaXRlbXMpXG4gIChyZWR1Y2UgKGxhbWJkYSAocmVzdWx0IGl0ZW0pIChjb25zIGl0ZW0gcmVzdWx0KSkgc2VxdWVuY2UgaXRlbXMpKVxuXG4oZGVmdW4tIGVuc3VyZS1kaWN0aW9uYXJ5ICh4KVxuICAoaWYgKHZlY3Rvcj8geClcbiAgICAoZGljdGlvbmFyeSAoZmlyc3QgeCkgKHNlY29uZCB4KSlcbiAgICB4KSlcblxuKGRlZnVuIGNvbmpcbiAgKHNlcXVlbmNlICZyZXN0IGl0ZW1zKVxuICAoY29uZCAoKHZlY3Rvcj8gc2VxdWVuY2UpICguY29uY2F0IHNlcXVlbmNlIGl0ZW1zKSlcbiAgICAgICAgKChzdHJpbmc/IHNlcXVlbmNlKSAoc3RyIHNlcXVlbmNlIChhcHBseSBzdHIgaXRlbXMpKSlcbiAgICAgICAgKChuaWw/IHNlcXVlbmNlKSAoYXBwbHkgbGlzdCAocmV2ZXJzZSBpdGVtcykpKVxuICAgICAgICAoKHNlcT8gc2VxdWVuY2UpIChjb25qLWxpc3Qgc2VxdWVuY2UgaXRlbXMpKVxuICAgICAgICAoKGRpY3Rpb25hcnk/IHNlcXVlbmNlKSAobWVyZ2Ugc2VxdWVuY2UgKGFwcGx5IG1lcmdlIChtYXB2IGVuc3VyZS1kaWN0aW9uYXJ5IGl0ZW1zKSkpKVxuICAgICAgICAoKHNldD8gc2VxdWVuY2UpIChhcHBseSBpZGVudGl0eS1zZXQgKGludG8gKHZlYyBzZXF1ZW5jZSkgaXRlbXMpKSlcbiAgICAgICAgKGVsc2UgKHRocm93IChUeXBlRXJyb3IgKHN0ciBcIlR5cGUgY2FuJ3QgYmUgY29uam9pbmVkIFwiIHNlcXVlbmNlKSkpKSkpXG5cbihkZWZ1biBkaXNqXG4gIChjb2xsICZyZXN0IGtzKVxuICAobGV0KiAoKHByZWRpY2F0ZSAoY29tcGxlbWVudCAoYXBwbHkgaWRlbnRpdHktc2V0IGtzKSkpKVxuICAgIChjb25kICgoZW1wdHk/IGtzKSAgICAgICAgY29sbClcbiAgICAgICAgICAoKHNldD8gY29sbCkgICAgICAgIChhcHBseSBpZGVudGl0eS1zZXQgKGZpbHRlcnYgcHJlZGljYXRlIGNvbGwpKSlcbiAgICAgICAgICAoKGRpY3Rpb25hcnk/IGNvbGwpIChpbnRvIHt9IChmaWx0ZXIgKGxhbWJkYSAoJSkgKHByZWRpY2F0ZSAoZmlyc3QgJSkpKSBjb2xsKSkpXG4gICAgICAgICAgKGVsc2UgICAgICAgICAgICAgICh0aHJvdyAoVHlwZUVycm9yIChzdHIgXCJUeXBlIGNhbid0IGJlIGRpc2pvaW5lZCBcIiBjb2xsKSkpKSkpKVxuXG4oZGVmdW4gaW50b1xuICAodG8gZnJvbSlcbiAgKGFwcGx5IGNvbmogdG8gKHZlYyBmcm9tKSkpXG5cbihkZWZ1biB6aXBtYXAgKGtleXMgdmFscylcbiAgKGludG8ge30gKG1hcCB2ZWN0b3Iga2V5cyB2YWxzKSkpXG5cbihkZWZ1biBhc3NvY1xuICAoc291cmNlICZyZXN0IGtleS12YWx1ZXMpXG4gIDsoYXNzZXJ0IChldmVuPyAoY291bnQga2V5LXZhbHVlcykpIFwiV3JvbmcgbnVtYmVyIG9mIGFyZ3VtZW50c1wiKVxuICA7KGFzc2VydCAoYW5kIChub3QgKHNlcT8gc291cmNlKSlcbiAgOyAgICAgICAgICAgICAobm90ICh2ZWN0b3I/IHNvdXJjZSkpXG4gIDsgICAgICAgICAgICAgKG9iamVjdD8gc291cmNlKSkgXCJDYW4gb25seSBhc3NvYyBvbiBkaWN0aW9uYXJpZXNcIilcbiAgKGNvbmogc291cmNlIChhcHBseSBkaWN0aW9uYXJ5IGtleS12YWx1ZXMpKSlcblxuKGRlZnVuIGRpc3NvY1xuICAoY29sbCAmcmVzdCBrcylcbiAgKGlmIChkaWN0aW9uYXJ5PyBjb2xsKVxuICAgIChhcHBseSBkaXNqIGNvbGwga3MpXG4gICAgKHRocm93IChUeXBlRXJyb3IgKHN0ciBcIkNhbiBvbmx5IGRpc3NvYyBvbiBkaWN0aW9uYXJpZXNcIikpKSkpXG5cbihkZWZ1biBjb25jYXRcbiAgKCZyZXN0IHNlcXVlbmNlcylcbiAgXCJSZXR1cm5zIGxpc3QgcmVwcmVzZW50aW5nIHRoZSBjb25jYXRlbmF0aW9uIG9mIHRoZSBlbGVtZW50cyBpbiB0aGVcbiAgc3VwcGxpZWQgbGlzdHMuXCJcbiAgKHJlZHVjZSAobGFtYmRhICglMSAlMikgKGNvbmotbGlzdCAlMSAocmV2ZXJzZSAlMikpKVxuICAgICAgICAgIChsZXQqICgodGFpbCAobGFzdCBzZXF1ZW5jZXMpKSlcbiAgICAgICAgICAgIChpZiAobGF6eS1zZXE/IHRhaWwpIHRhaWwgKGFwcGx5IGxpc3QgKHZlYyB0YWlsKSkpKVxuICAgICAgICAgIChyZXN0IChyZXZlcnNlIHNlcXVlbmNlcykpKSlcblxuKGRlZnVuIG1hcGNhdCAoZiAmcmVzdCBjb2xscylcbiAgKGFwcGx5IGNvbmNhdCAoYXBwbHkgbWFwdiBmIGNvbGxzKSkpXG5cbihkZWZ1biBlbXB0eVxuICAoc2VxdWVuY2UpXG4gIFwiUHJvZHVjZXMgZW1wdHkgc2VxdWVuY2Ugb2YgdGhlIHNhbWUgdHlwZSBhcyBhcmd1bWVudC5cIlxuICAoY29uZCAoKGxpc3Q/IHNlcXVlbmNlKSAgICAgICAnKCkpXG4gICAgICAgICgodmVjdG9yPyBzZXF1ZW5jZSkgICAgIFtdKVxuICAgICAgICAoKHN0cmluZz8gc2VxdWVuY2UpICAgICBcIlwiKVxuICAgICAgICAoKGRpY3Rpb25hcnk/IHNlcXVlbmNlKSB7fSlcbiAgICAgICAgKChzZXQ/IHNlcXVlbmNlKSAgICAgICAgI3t9KVxuICAgICAgICAoKGxhenktc2VxPyBzZXF1ZW5jZSkgICAobGF6eS1zZXEpKSkpXG5cbihkZWZ1biBzZXEgKHNlcXVlbmNlKVxuICAoY29uZCAoKG5pbD8gc2VxdWVuY2UpIG5pbClcbiAgICAgICAgKChvciAodmVjdG9yPyBzZXF1ZW5jZSkgKHNlcT8gc2VxdWVuY2UpKSBzZXF1ZW5jZSlcbiAgICAgICAgKChzdHJpbmc/IHNlcXVlbmNlKSAoLmNhbGwgQXJyYXkucHJvdG90eXBlLnNsaWNlIHNlcXVlbmNlKSlcbiAgICAgICAgKChkaWN0aW9uYXJ5PyBzZXF1ZW5jZSkgKGtleS12YWx1ZXMgc2VxdWVuY2UpKVxuICAgICAgICAoKGl0ZXJhYmxlPyBzZXF1ZW5jZSkgKGl0ZXJhdG9yLT5sc2VxICgoZ2V0IHNlcXVlbmNlIFN5bWJvbC5pdGVyYXRvcikpKSlcbiAgICAgICAgKGVsc2UgKHRocm93IChUeXBlRXJyb3IgKHN0ciBcIkNhbiBub3Qgc2VxIFwiIHNlcXVlbmNlKSkpKSkpXG5cbihkZWZ1biBzZXEqIChzZXF1ZW5jZSlcbiAgKGxldCogKChpdCAoc2VxIHNlcXVlbmNlKSkpXG4gICAgKGlmIChlbXB0eT8gaXQpIG5pbCBpdCkpKVxuXG4oZGVmdW4gc2VxPyAoc2VxdWVuY2UpXG4gIChvciAobGlzdD8gc2VxdWVuY2UpXG4gICAgICAobGF6eS1zZXE/IHNlcXVlbmNlKSkpXG5cbihkZWZ1bi0gaXRlcmF0b3ItPmxzZXEgKGl0ZXJhdG9yKVxuICAodW5mb2xkIChsYW1iZGEgKCUpIChsZXQqICgoeCAoLm5leHQgJSkpKVxuICAgICAgICAgICAgIChpZiAoLi1kb25lIHgpIG5pbCBbKC4tdmFsdWUgeCkgJV0pKSlcbiAgICAgICAgICBpdGVyYXRvcikpXG5cbihkZWZ1biB2ZWNcbiAgKHNlcXVlbmNlKVxuICBcIkNyZWF0ZXMgYSBuZXcgdmVjdG9yIGNvbnRhaW5pbmcgdGhlIGNvbnRlbnRzIG9mIHNlcXVlbmNlXCJcbiAgKGNvbmQgKChuaWw/IHNlcXVlbmNlKSBbXSlcbiAgICAgICAgKChvciAodmVjdG9yPyBzZXF1ZW5jZSkgKGxpc3Q/IHNlcXVlbmNlKSkgKEFycmF5LmZyb20gc2VxdWVuY2UpKVxuICAgICAgICAoKGxhenktc2VxPyBzZXF1ZW5jZSkgKGxldCogKCh4cyAoQXJyYXkuZnJvbSBzZXF1ZW5jZSkpKSAgICAgICAgICAgIDsgb3B0aW1pemluZyBjb3VudFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChzZXRmICguLWxlbmd0aCBzZXF1ZW5jZSkgKC4tbGVuZ3RoIHhzKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4cykpXG4gICAgICAgIChlbHNlICh2ZWMgKHNlcSBzZXF1ZW5jZSkpKSkpXG5cbihkZWZ1biB2ZWN0b3IgKCZyZXN0IHNlcXVlbmNlKSBzZXF1ZW5jZSlcblxuOzsgcHJpdmF0ZVxuKGRlZnZhci1cbiAgc29ydC1jb21wYXJhdG9yXG4gIChpZiAoPSBbMSAyIDNdICguc29ydCBbMiAxIDNdIChsYW1iZGEgKGEgYikgKGlmICg8IGEgYikgMCAxKSkpKVxuICAgIChsYW1iZGEgKCUpIChsYW1iZGEgKGEgYikgKGlmICglIGIgYSkgIDEgMCkpKSAgICAgICA7IHF1aWNrc29ydCAoQ2hyb21lLCBOb2RlKSwgbWVyZ2Vzb3J0IChGaXJlZm94KVxuICAgIChsYW1iZGEgKCUpIChsYW1iZGEgKGEgYikgKGlmICglIGEgYikgLTEgMCkpKSkpICAgICA7IHRpbXNvcnQgKENocm9tZSA3MCssIE5vZGUgMTErKVxuXG4oZGVmdW4gc29ydFxuICAoZiBpdGVtcylcbiAgXCJSZXR1cm5zIGEgc29ydGVkIHNlcXVlbmNlIG9mIHRoZSBpdGVtcyBpbiBjb2xsLlxuICBJZiBubyBjb21wYXJhdG9yIGlzIHN1cHBsaWVkLCB1c2VzIGNvbXBhcmUuXCJcbiAgKGxldCogKChoYXMtY29tcGFyYXRvciAoZm4/IGYpKVxuICAgICAgICAoaXRlbXMgICAgICAgICAgKGlmIChhbmQgKG5vdCBoYXMtY29tcGFyYXRvcikgKG5pbD8gaXRlbXMpKSBmIGl0ZW1zKSlcbiAgICAgICAgOzsgQXJyYXkucHJvdG90eXBlLnNvcnQgdGhyb3dzIGlmIGhhbmRlZCBhIGNvbXBhcmF0b3IgYXJndW1lbnRcbiAgICAgICAgOzsgdGhhdCBpc24ndCBhIGZ1bmN0aW9uIG9yIChyZWFsIEpTKSB1bmRlZmluZWQgLS0gbmlsIGlzIHJlYWxcbiAgICAgICAgOzsgbnVsbCBub3cgKFBoYXNlIDIpLCBzbyBpdCBjYW4ndCBiZSBwYXNzZWQgdGhyb3VnaCBkaXJlY3RseVxuICAgICAgICA7OyB3aGVuIHRoZXJlJ3Mgbm8gY29tcGFyYXRvci5cbiAgICAgICAgKHJlc3VsdCAgICAgICAgIChpZiBoYXMtY29tcGFyYXRvclxuICAgICAgICAgICAgICAgICAgICAgICAgICAoLnNvcnQgKHZlYyBpdGVtcykgKHNvcnQtY29tcGFyYXRvciBmKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKC5zb3J0ICh2ZWMgaXRlbXMpKSkpKVxuICAgIChjb25kICgobmlsPyBpdGVtcykgICAgJygpKVxuICAgICAgICAgICgodmVjdG9yPyBpdGVtcykgcmVzdWx0KVxuICAgICAgICAgIChlbHNlICAgICAgICAgICAoYXBwbHkgbGlzdCByZXN1bHQpKSkpKVxuXG5cbihkZWZ1biByZXBlYXRlZGx5XG4gIChuIGYpXG4gIFwiVGFrZXMgYSBmdW5jdGlvbiBvZiBubyBhcmdzLCBwcmVzdW1hYmx5IHdpdGggc2lkZSBlZmZlY3RzLCBhbmRcbiAgcmV0dXJucyB2ZWN0b3Igb2YgZ2l2ZW4gYG5gIGxlbmd0aCB3aXRoIGNhbGxzIHRvIGl0XCJcbiAgOzsgd3JhcCBzbyBBcnJheS5mcm9tJ3MgKGl0ZW0sIGluZGV4KSBjYWxsYmFjayBhcmdzIG5ldmVyIHJlYWNoIGZcbiAgKEFycmF5LmZyb20gezpsZW5ndGggbn0gKGxhbWJkYSAoKSAoZikpKSlcblxuKGRlZnVuIHJlcGVhdFxuICAobiB4KVxuICBcIlJldHVybnMgYSB2ZWN0b3Igb2YgZ2l2ZW4gYG5gIGxlbmd0aCB3aXRoIGdpdmVuIGB4YFxuICBpdGVtcy4gTm90IGNvbXBhdGlibGUgd2l0aCBjbG9qdXJlIGFzIGl0J3Mgbm90IGEgbGF6eVxuICBhbmQgb25seSBmaW5pdGUgcmVwZWF0cyBhcmUgc3VwcG9ydGVkXCJcbiAgKHJlcGVhdGVkbHkgbiAobGFtYmRhICgpIHgpKSlcblxuXG4oZGVmdW4gZXZlcnk/XG4gIChwcmVkaWNhdGUgc2VxdWVuY2UpXG4gICguZXZlcnkgKHZlYyBzZXF1ZW5jZSkgKGxhbWJkYSAoJSkgKHByZWRpY2F0ZSAlKSkpKVxuXG4oZGVmdW4gc29tZVxuICAocHJlZCBjb2xsKVxuICBcIlJldHVybnMgdGhlIGZpcnN0IGxvZ2ljYWwgdHJ1ZSB2YWx1ZSBvZiAocHJlZCB4KSBmb3IgYW55IHggaW4gY29sbCxcbiAgZWxzZSBuaWwuICBPbmUgY29tbW9uIGlkaW9tIGlzIHRvIHVzZSBhIHNldCBhcyBwcmVkLCBmb3IgZXhhbXBsZVxuICB0aGlzIHdpbGwgcmV0dXJuIDpmcmVkIGlmIDpmcmVkIGlzIGluIHRoZSBzZXF1ZW5jZSwgb3RoZXJ3aXNlIG5pbDpcbiAgKHNvbWUgI3s6ZnJlZH0gY29sbClcIlxuICAobG9vcCAoKGl0ZW1zIChzZXEgY29sbCkpKVxuICAgIChpZiAoZW1wdHk/IGl0ZW1zKSBuaWxcbiAgICAgIChvciAocHJlZCAoZmlyc3QgaXRlbXMpKSAocmVjdXIgKHJlc3QgaXRlbXMpKSkpKSlcblxuXG4oZGVmdW4gcGFydGl0aW9uXG4gIChuICZyZXN0IGFyZ3MpXG4gIChsZXQqICgoc3RlcCAoaWYgKD49IChjb3VudCBhcmdzKSAyKSAoZmlyc3QgYXJncykgbikpXG4gICAgICAgIChwYWQgIChpZiAoPj0gKGNvdW50IGFyZ3MpIDMpIChzZWNvbmQgYXJncykgW10pKVxuICAgICAgICAoY29sbCAobGFzdCBhcmdzKSkpXG4gICAgKGxvb3AgKChyZXN1bHQgW10pXG4gICAgICAgICAgIChpdGVtcyAoc2VxIGNvbGwpKSlcbiAgICAgIChsZXQqICgoY2h1bmsgKHRha2UgbiBpdGVtcykpXG4gICAgICAgICAgICAoc2l6ZSAoY291bnQgY2h1bmspKSlcbiAgICAgICAgKGNvbmQgKChpZGVudGljYWw/IHNpemUgbikgKHJlY3VyIChjb25qIHJlc3VsdCBjaHVuaylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGRyb3Agc3RlcCBpdGVtcykpKVxuICAgICAgICAgICAgICAoKGlkZW50aWNhbD8gMCBzaXplKSByZXN1bHQpXG4gICAgICAgICAgICAgICgoPiBuICgrIHNpemUgKGNvdW50IHBhZCkpKSByZXN1bHQpXG4gICAgICAgICAgICAgIChlbHNlIChjb25qIHJlc3VsdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAodGFrZSBuICh2ZWMgKGNvbmNhdCBjaHVua1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWQpKSkpKSkpKSkpXG5cbihkZWZ1biBpbnRlcmxlYXZlICgmcmVzdCBzZXF1ZW5jZXMpXG4gIChpZiAoZW1wdHk/IHNlcXVlbmNlcylcbiAgICBbXVxuICAgIChsb29wICgocmVzdWx0IFtdKVxuICAgICAgICAgICAoc2VxdWVuY2VzIHNlcXVlbmNlcykpXG4gICAgICAoaWYgKHNvbWUgZW1wdHk/IHNlcXVlbmNlcylcbiAgICAgICAgKHZlYyByZXN1bHQpXG4gICAgICAgIChyZWN1ciAoY29uY2F0IHJlc3VsdCAobWFwIGZpcnN0IHNlcXVlbmNlcykpXG4gICAgICAgICAgICAgICAobWFwIHJlc3Qgc2VxdWVuY2VzKSkpKSkpXG5cbihkZWZ1biBudGhcbiAgKHNlcXVlbmNlIGluZGV4IG5vdC1mb3VuZClcbiAgXCJSZXR1cm5zIG50aCBpdGVtIG9mIHRoZSBzZXF1ZW5jZVwiXG4gIChsZXQqICgoc2VxdWVuY2UgKHNlcSogc2VxdWVuY2UpKSlcbiAgICAoY29uZCAoKG5pbD8gc2VxdWVuY2UpIG5vdC1mb3VuZClcbiAgICAgICAgICAoKHNlcT8gc2VxdWVuY2UpIChpZi1sZXQgW2l0IChzZXEqIChkcm9wIGluZGV4IHNlcXVlbmNlKSldXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZpcnN0IGl0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vdC1mb3VuZCkpXG4gICAgICAgICAgKChvciAodmVjdG9yPyBzZXF1ZW5jZSlcbiAgICAgICAgICAgICAgKHN0cmluZz8gc2VxdWVuY2UpKSAoaWYgKDwgaW5kZXggKGNvdW50IHNlcXVlbmNlKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChhZ2V0IHNlcXVlbmNlIGluZGV4KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm90LWZvdW5kKSlcbiAgICAgICAgICAoZWxzZSAodGhyb3cgKFR5cGVFcnJvciBcIlVuc3VwcG9ydGVkIHR5cGVcIikpKSkpKVxuXG5cbihkZWZ1biBjb250YWlucz9cbiAgKGNvbGwgdilcbiAgXCJSZXR1cm5zIHRydWUgaWYga2V5IGlzIHByZXNlbnQgaW4gdGhlIGdpdmVuIGNvbGxlY3Rpb24sIG90aGVyd2lzZVxuICByZXR1cm5zIGZhbHNlLiAgTm90ZSB0aGF0IGZvciBudW1lcmljYWxseSBpbmRleGVkIGNvbGxlY3Rpb25zIGxpa2VcbiAgdmVjdG9ycyBhbmQgc3RyaW5ncywgdGhpcyB0ZXN0cyBpZiB0aGUgbnVtZXJpYyBrZXkgaXMgd2l0aGluIHRoZVxuICByYW5nZSBvZiBpbmRleGVzLiAnY29udGFpbnM/JyBvcGVyYXRlcyBjb25zdGFudCBvciBsb2dhcml0aG1pYyB0aW1lO1xuICBpdCB3aWxsIG5vdCBwZXJmb3JtIGEgbGluZWFyIHNlYXJjaCBmb3IgYSB2YWx1ZS4gIFNlZSBhbHNvICdzb21lJy5cIlxuICAoY29uZCAoKHNldD8gY29sbCkgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKC5oYXMgY29sbCB2KSlcbiAgICAgICAgKChvciAoZGljdGlvbmFyeT8gY29sbCkgKHZlY3Rvcj8gY29sbCkgKHN0cmluZz8gY29sbCkpICguaGFzLW93bi1wcm9wZXJ0eSBjb2xsIHYpKVxuICAgICAgICAoZWxzZSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWxzZSkpKVxuXG4oZGVmdW4gdW5pb25cbiAgKCZyZXN0IHNldHMpXG4gIFwiUmV0dXJuIGEgc2V0IHRoYXQgaXMgdGhlIHVuaW9uIG9mIHRoZSBpbnB1dCBzZXRzXCJcbiAgKGludG8gI3t9IChhcHBseSBjb25jYXQgc2V0cykpKVxuXG4oZGVmdW4gZGlmZmVyZW5jZVxuICAoczEgJnJlc3Qgc2V0cylcbiAgXCJSZXR1cm4gYSBzZXQgdGhhdCBpcyB0aGUgZmlyc3Qgc2V0IHdpdGhvdXQgZWxlbWVudHMgb2YgdGhlIHJlbWFpbmluZyBzZXRzXCJcbiAgKGludG8gI3t9IChmaWx0ZXIgKGNvbXBsZW1lbnQgKGFwcGx5IHVuaW9uIHNldHMpKVxuICAgICAgICAgICAgICAgICAgICBzMSkpKVxuXG4oZGVmdW4gaW50ZXJzZWN0aW9uXG4gICgmcmVzdCBzZXRzKVxuICBcIlJldHVybiBhIHNldCB0aGF0IGlzIHRoZSBpbnRlcnNlY3Rpb24gb2YgdGhlIGlucHV0IHNldHNcIlxuICAobGV0KiAoKHNldHMgICAgIChtYXB2IChsYW1iZGEgKCUpIChpbnRvICN7fSAlKSkgc2V0cykpXG4gICAgICAgIChpbi1lYWNoPyAobGFtYmRhICh4KSAoZXZlcnk/IChsYW1iZGEgKCUpICguaGFzICUgeCkpIHNldHMpKSlcbiAgICAgICAgKG1pbi1zaXplIChhcHBseSBtaW4gKG1hcHYgY291bnQgc2V0cykpKVxuICAgICAgICAoc21hbGxlc3QgKC5maW5kIHNldHMgKGxhbWJkYSAoJSkgKD0gbWluLXNpemUgKGNvdW50ICUpKSkpKSlcbiAgICAoaW50byAje30gKGZpbHRlciBpbi1lYWNoPyBzbWFsbGVzdCkpKSlcblxuKGRlZnVuIHN1YnNldD9cbiAgKHNldDEgc2V0MilcbiAgXCJJcyBzZXQxIGEgc3Vic2V0IG9mIHNldDI/XCJcbiAgKGlmIChzZXQ/IHNldDIpXG4gICAgKGV2ZXJ5PyAobGFtYmRhICglKSAoLmhhcyBzZXQyICUpKSBzZXQxKVxuICAgIChzdWJzZXQ/IHNldDEgKGludG8gI3t9IHNldDIpKSkpXG5cbihkZWZ1biBzdXBlcnNldD9cbiAgKHNldDEgc2V0MilcbiAgXCJJcyBzZXQxIGEgc3VwZXJzZXQgb2Ygc2V0Mj9cIlxuICAoc3Vic2V0PyBzZXQyIHNldDEpKVxuXG5cbihkZWZ1biB1bmZvbGRcbiAgKGYgeClcbiAgXCJSZXR1cm5zIGEgbGF6eSBzZXF1ZW5jZTsgKGYgeCkgaXMgZXhwZWN0ZWQgdG8gcmV0dXJuIGVpdGhlciBuaWwgKHNpZ25pZnlpbmcgZW5kIG9mIHNlcXVlbmNlKVxuICBvciBbeSB4MV0gKHdoZXJlIHkgaXMgbmV4dCBzZXF1ZW5jZSBpdGVtLCBhbmQgeDEgaXMgbmV4dCB2YWx1ZSBvZiB4KVwiXG4gIChsYXp5LXNlcSAoaWYtbGV0IFtuZXh0IChmIHgpXVxuICAgICAgICAgICAgICAoY29ucyAoZmlyc3QgbmV4dCkgKHVuZm9sZCBmIChzZWNvbmQgbmV4dCkpKSkpKVxuXG4oZGVmdW4gaXRlcmF0ZVxuICAoZiB4KVxuICBcIlJldHVybnMgYSBsYXp5IHNlcXVlbmNlIG9mIHgsIChmIHgpLCAoZiAoZiB4KSkgZXRjLiBmIG11c3QgYmUgZnJlZSBvZiBzaWRlLWVmZmVjdHNcIlxuICAobGF6eS1zZXEgKGNvbnMgeCAoaXRlcmF0ZSBmIChmIHgpKSkpKVxuXG4oZGVmdW4gY3ljbGVcbiAgKGNvbGwpXG4gIFwiUmV0dXJucyBhIGxhenkgKGluZmluaXRlISkgc2VxdWVuY2Ugb2YgcmVwZXRpdGlvbnMgb2YgdGhlIGl0ZW1zIGluIGNvbGwuXCJcbiAgKGxhenktc2VxIChpZiAoZW1wdHk/IGNvbGwpXG4gICAgICAgICAgICAgIG5pbFxuICAgICAgICAgICAgICAoY29uY2F0IGNvbGwgKGN5Y2xlIGNvbGwpKSkpKVxuXG4oZGVmdW4gaW5maW5pdGUtcmFuZ2VcbiAgKCZyZXN0IGFyZ3MpXG4gIChsZXQqICgobiAoaWYgKGVtcHR5PyBhcmdzKSAwIChmaXJzdCBhcmdzKSkpXG4gICAgICAgIChzdGVwIChzZWNvbmQgYXJncykpKVxuICAgIChpZiAobmlsPyBzdGVwKVxuICAgICAgKGl0ZXJhdGUgaW5jIG4pXG4gICAgICAoaXRlcmF0ZSAobGFtYmRhICglKSAoKyAlIHN0ZXApKSBuKSkpKVxuXG4oZGVmdW4gbGF6eS1tYXAgKGYgJnJlc3Qgc2VxdWVuY2VzKVxuICAodW5mb2xkIChsYW1iZGEgKCUpIChpZiAoc29tZSBlbXB0eT8gJSlcbiAgICAgICAgICAgICBuaWxcbiAgICAgICAgICAgICBbKGFwcGx5IGYgKG1hcHYgZmlyc3QgJSkpIChtYXB2IHJlc3QgJSldKSlcbiAgICAgICAgICBzZXF1ZW5jZXMpKVxuXG4oZGVmdW4gbGF6eS1maWx0ZXIgKGYgc2VxdWVuY2UpXG4gICh1bmZvbGQgKGxhbWJkYSAoJSkgKGxvb3AgKCh4cyAlKSlcbiAgICAgICAgICAgICAoY29uZCAoKGVtcHR5PyB4cykgICAgbmlsKVxuICAgICAgICAgICAgICAgICAgICgoZiAoZmlyc3QgeHMpKSBbKGZpcnN0IHhzKSAocmVzdCB4cyldKVxuICAgICAgICAgICAgICAgICAgIChlbHNlICAgICAgICAgIChyZWN1ciAocmVzdCB4cykpKSkpKVxuICAgICAgICAgIChzZXEgc2VxdWVuY2UpKSlcblxuKGRlZnVuIGxhenktY29uY2F0ICgmcmVzdCBzZXF1ZW5jZXMpXG4gIChpZiAoZW1wdHk/IHNlcXVlbmNlcylcbiAgICBuaWxcbiAgICAoKGxhbWJkYSBpdGVyICh4cylcbiAgICAgICAobGF6eS1zZXEgKGlmIChlbXB0eT8geHMpXG4gICAgICAgICAgICAgICAgICAgKGFwcGx5IGxhenktY29uY2F0IChyZXN0IHNlcXVlbmNlcykpXG4gICAgICAgICAgICAgICAgICAgKGNvbnMgKGZpcnN0IHhzKSAoaXRlciAocmVzdCB4cykpKSkpKVxuICAgICAoc2VxIChmaXJzdCBzZXF1ZW5jZXMpKSkpKVxuXG4oZGVmdW4gbGF6eS1wYXJ0aXRpb25cbiAgKG4gJnJlc3QgYXJncylcbiAgKGxldCogKChzdGVwIChpZiAoPj0gKGNvdW50IGFyZ3MpIDIpIChmaXJzdCBhcmdzKSBuKSlcbiAgICAgICAgKHBhZCAgKGlmICg+PSAoY291bnQgYXJncykgMykgKHNlY29uZCBhcmdzKSBbXSkpXG4gICAgICAgIChjb2xsIChsYXN0IGFyZ3MpKSlcbiAgICAodW5mb2xkIChsYW1iZGEgKCUpIChsZXQqICgoY2h1bmsgKHRha2UgbiAoY29uY2F0ICh0YWtlIG4gJSkgcGFkKSkpKVxuICAgICAgICAgICAgICAgKGlmIChhbmQgKG5vdCAoZW1wdHk/ICUpKSAoaWRlbnRpY2FsPyBuIChjb3VudCBjaHVuaykpKVxuICAgICAgICAgICAgICAgICBbY2h1bmsgKGRyb3Agc3RlcCAlKV0pKSlcbiAgICAgICAgICAgIGNvbGwpKSlcblxuXG4oZGVmdW4gcnVuIVxuICAocHJvYyBjb2xsKVxuICBcIlJ1bnMgdGhlIHN1cHBsaWVkIHByb2NlZHVyZSAodmlhIHJlZHVjZSksIGZvciBwdXJwb3NlcyBvZiBzaWRlXG4gIGVmZmVjdHMsIG9uIHN1Y2Nlc3NpdmUgaXRlbXMgaW4gdGhlIGNvbGxlY3Rpb24uIFJldHVybnMgbmlsXCJcbiAgKHJlZHVjZSAobGFtYmRhIChfIHgpIChwcm9jIHgpIG5pbCkgbmlsIGNvbGwpKVxuXG4oZGVmdW4gZG9ydW5cbiAgKCZyZXN0IGFyZ3MpXG4gIFwiV2hlbiBsYXp5IHNlcXVlbmNlcyBhcmUgcHJvZHVjZWQgdmlhIGZ1bmN0aW9ucyB0aGF0IGhhdmUgc2lkZVxuICBlZmZlY3RzLCBhbnkgZWZmZWN0cyBvdGhlciB0aGFuIHRob3NlIG5lZWRlZCB0byBwcm9kdWNlIHRoZSBmaXJzdFxuICBlbGVtZW50IGluIHRoZSBzZXEgZG8gbm90IG9jY3VyIHVudGlsIHRoZSBzZXEgaXMgY29uc3VtZWQuIGRvcnVuIGNhblxuICBiZSB1c2VkIHRvIGZvcmNlIGFueSBlZmZlY3RzLiBXYWxrcyB0aHJvdWdoIHRoZSBzdWNjZXNzaXZlIG5leHRzIG9mXG4gIHRoZSBzZXEsIGRvZXMgbm90IHJldGFpbiB0aGUgaGVhZCBhbmQgcmV0dXJucyBuaWwuXCJcbiAgKGxldCogKChuIChpZiAoaWRlbnRpY2FsPyAoY291bnQgYXJncykgMSkgSW5maW5pdHkgKGZpcnN0IGFyZ3MpKSlcbiAgICAgICAgKGNvbGwgKGxhc3QgYXJncykpKVxuICAgIChydW4hIGlkZW50aXR5ICh0YWtlIG4gY29sbCkpKSlcblxuKGRlZnVuIGRvYWxsXG4gICgmcmVzdCBhcmdzKVxuICBcIldoZW4gbGF6eSBzZXF1ZW5jZXMgYXJlIHByb2R1Y2VkIHZpYSBmdW5jdGlvbnMgdGhhdCBoYXZlIHNpZGVcbiAgZWZmZWN0cywgYW55IGVmZmVjdHMgb3RoZXIgdGhhbiB0aG9zZSBuZWVkZWQgdG8gcHJvZHVjZSB0aGUgZmlyc3RcbiAgZWxlbWVudCBpbiB0aGUgc2VxIGRvIG5vdCBvY2N1ciB1bnRpbCB0aGUgc2VxIGlzIGNvbnN1bWVkLiBkb3J1biBjYW5cbiAgYmUgdXNlZCB0byBmb3JjZSBhbnkgZWZmZWN0cy4gV2Fsa3MgdGhyb3VnaCB0aGUgc3VjY2Vzc2l2ZSBuZXh0cyBvZlxuICB0aGUgc2VxLCByZXRhaW5zIHRoZSBoZWFkIGFuZCByZXR1cm5zIGl0LCB0aHVzIGNhdXNpbmcgdGhlIGVudGlyZVxuICBzZXEgdG8gcmVzaWRlIGluIG1lbW9yeSBhdCBvbmUgdGltZS5cIlxuICAobGV0KiAoKG4gKGlmIChpZGVudGljYWw/IChjb3VudCBhcmdzKSAxKSBJbmZpbml0eSAoZmlyc3QgYXJncykpKVxuICAgICAgICAoY29sbCAobGFzdCBhcmdzKSkpXG4gICAgKGRvcnVuIG4gY29sbClcbiAgICBjb2xsKSlcbiJdfQ==
