{
    var _ns_ = {
            id: 'wisp.sequence',
            doc: void 0
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
                    return isVector(xø1) ? '' + '[' + xø1.join(' ') + ']' : isNil(xø1) ? 'nil' : isString(xø1) ? JSON.stringify(xø1) : isNumber(xø1) ? JSON.stringify(xø1) : 'else' ? xø1 : void 0;
                }.call(this), loop);
            } while (listø1 = loop[0], resultø1 = loop[1], recur === loop);
            return recur;
        }.call(this);
    };
};
var List = function List(head, tail) {
    this.head = head;
    this.tail = tail || list();
    this.length = isNil(this.tail) || isDictionary(this.tail) || isNumber(this.tail.length) ? inc(count(this.tail)) : void 0;
    return this;
};
List.prototype.length = 0;
List.type = (_wispTypes || 0)['list'];
List.prototype.type = List.type;
List.prototype.tail = Object.create(List.prototype);
List.prototype.toString = seqToString('(', ')');
List.prototype[Symbol.iterator] = listIterator;
var lazySeqValue = function lazySeqValue(lazySeq) {
    return lazySeq.realized ? lazySeq.x : function () {
        var xø1 = lazySeq.x();
        lazySeq.realized = true;
        isEmpty(xø1) ? lazySeq.length = 0 : void 0;
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
    return Object.assign.apply(void 0, [to].concat(Object.getOwnPropertyNames(from.__proto__).map(function ($1) {
        return function () {
            var xø1 = from[$1];
            return dictionary($1, isFn(xø1) ? xø1.bind(from) : xø1);
        }.call(this);
    })));
};
var identitySet = exports.identitySet = function identitySet() {
        var items = Array.prototype.slice.call(arguments, 0);
        return function () {
            var jsSetø1 = new Set(items);
            var fø1 = function ($1, $2) {
                return get.apply(void 0, [
                    jsSetø1,
                    $1,
                    $2
                ]);
            };
            cloneProtoProps(jsSetø1, fø1);
            fø1.toString = seqToString('#{', '}');
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
            recur = isVector(xø2) && isVector(yø2) ? isEqual(count(xø2), count(yø2)) && xø2.every(function ($1, $2) {
                return isEqual($1, yø2[$2]);
            }) : isEmpty(xø2) || isEmpty(yø2) ? isEmpty(xø2) && isEmpty(yø2) : !isEqual(first(xø2), first(yø2)) ? false : 'else' ? (loop[0] = rest(xø2), loop[1] = rest(yø2), loop) : void 0;
        } while (xø2 = loop[0], yø2 = loop[1], recur === loop);
        return recur;
    }.call(this);
};
var list = exports.list = function list() {
        return arguments.length === 0 ? Object.create(List.prototype) : Array.prototype.slice.call(arguments).reduceRight(function (tail, head) {
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
        return isVector(sequence) ? vec(sequence).reverse() : into(void 0, sequence);
    };
var range = exports.range = function range() {
        switch (arguments.length) {
        case 1:
            var end = arguments[0];
            return range(0, end, 1);
        case 2:
            var start = arguments[0];
            var end = arguments[1];
            return range(start, end, 1);
        case 3:
            var start = arguments[0];
            var end = arguments[1];
            var step = arguments[2];
            return step < 0 ? range(0 - start, 0 - end, 0 - step).map(function ($1) {
                return 0 - $1;
            }) : Array.from({ 'length': (end + step - start - 1) / step }, function (_, i) {
                return start + i * step;
            });
        default:
            throw RangeError('Wrong number of arguments passed');
        }
    };
var mapv = exports.mapv = function mapv(f) {
        var sequences = Array.prototype.slice.call(arguments, 1);
        return function () {
            var vectorsø1 = sequences.map(vec);
            var nø1 = min.apply(void 0, vectorsø1.map(count));
            return range(nø1).map(function (i) {
                return f.apply(void 0, vectorsø1.map(function ($1) {
                    return $1[i];
                }));
            });
        }.call(this);
    };
var map = exports.map = function map(f) {
        var sequences = Array.prototype.slice.call(arguments, 1);
        return function () {
            var resultø1 = mapv.apply(void 0, [f].concat(sequences));
            return isNative(first(sequences)) ? resultø1 : list.apply(void 0, resultø1);
        }.call(this);
    };
var mapIndexed = exports.mapIndexed = function mapIndexed(f) {
        var sequences = Array.prototype.slice.call(arguments, 1);
        return function () {
            var sequenceø1 = first(sequences);
            var nø1 = count(sequenceø1);
            var indicesø1 = range(nø1);
            return map.apply(void 0, [
                f,
                isNative(sequenceø1) ? indicesø1 : list.apply(void 0, indicesø1)
            ].concat(sequences));
        }.call(this);
    };
var filter = exports.filter = function filter(isF, sequence) {
        return isNil(sequence) ? list() : isSeq(sequence) ? filterList(isF, sequence) : isVector(sequence) ? sequence.filter(function ($1) {
            return isF($1);
        }) : 'else' ? filter(isF, seq(sequence)) : void 0;
    };
var filterList = function filterList(isF, sequence) {
    return function loop() {
        var recur = loop;
        var resultø1 = list();
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
            var initialø1 = hasInitialø1 ? first(params) : void 0;
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
            return isNil(itø1) ? 0 : isLazySeq(itø1) ? count(vec(itø1)) : 'else' ? itø1.length : void 0;
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
        return isNil(sequence) ? void 0 : isList(sequence) ? sequence.head : isVector(sequence) || isString(sequence) ? (sequence || 0)[0] : isLazySeq(sequence) ? first(lazySeqValue(sequence)) : 'else' ? first(seq(sequence)) : void 0;
    };
var second = exports.second = function second(sequence) {
        return isNil(sequence) ? void 0 : isList(sequence) ? first(rest(sequence)) : isVector(sequence) || isString(sequence) ? (sequence || 0)[1] : isLazySeq(sequence) ? second(lazySeqValue(sequence)) : 'else' ? first(rest(seq(sequence))) : void 0;
    };
var third = exports.third = function third(sequence) {
        return isNil(sequence) ? void 0 : isList(sequence) ? first(rest(rest(sequence))) : isVector(sequence) || isString(sequence) ? (sequence || 0)[2] : isLazySeq(sequence) ? third(lazySeqValue(sequence)) : 'else' ? second(rest(seq(sequence))) : void 0;
    };
var rest = exports.rest = function rest(sequence) {
        return isNil(sequence) ? list() : isList(sequence) ? sequence.tail : isVector(sequence) || isString(sequence) ? sequence.slice(1) : isLazySeq(sequence) ? rest(lazySeqValue(sequence)) : 'else' ? rest(seq(sequence)) : void 0;
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
        return isVector(sequence) || isString(sequence) ? (sequence || 0)[dec(count(sequence))] : isList(sequence) ? lastOfList(sequence) : isNil(sequence) ? void 0 : isLazySeq(sequence) ? last(lazySeqValue(sequence)) : 'else' ? last(seq(sequence)) : void 0;
    };
var butlast = exports.butlast = function butlast(sequence) {
        return function () {
            var itemsø1 = isNil(sequence) ? void 0 : isString(sequence) ? subs(sequence, 0, dec(count(sequence))) : isVector(sequence) ? sequence.slice(0, dec(count(sequence))) : isList(sequence) ? list.apply(void 0, butlast(vec(sequence))) : isLazySeq(sequence) ? butlast(lazySeqValue(sequence)) : 'else' ? butlast(seq(sequence)) : void 0;
            return isEmpty(itemsø1) ? void 0 : itemsø1;
        }.call(this);
    };
var take = exports.take = function take(n, sequence) {
        return isNil(sequence) ? list() : isVector(sequence) ? takeFromVector(n, sequence) : isList(sequence) ? takeFromList(n, sequence) : isLazySeq(sequence) ? n > 0 ? take(n, lazySeqValue(sequence)) : void 0 : 'else' ? take(n, seq(sequence)) : void 0;
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
                    return !isEmpty(itemsø1) && predicate(headø1) ? (loop[0] = tailø1, loop[1] = conj(resultø1, headø1), loop) : isNative(sequence) ? resultø1 : list.apply(void 0, resultø1);
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
        var takenø1 = list();
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
        return n <= 0 ? sequence : isString(sequence) ? sequence.substr(n) : isVector(sequence) ? sequence.slice(n) : isList(sequence) ? dropFromList(n, sequence) : isNil(sequence) ? list() : isLazySeq(sequence) ? drop(n, lazySeqValue(sequence)) : 'else' ? drop(n, seq(sequence)) : void 0;
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
        return isVector(sequence) ? sequence.concat(items) : isString(sequence) ? '' + sequence + str.apply(void 0, items) : isNil(sequence) ? list.apply(void 0, reverse(items)) : isSeq(sequence) ? conjList(sequence, items) : isDictionary(sequence) ? merge(sequence, merge.apply(void 0, mapv(ensureDictionary, items))) : isSet(sequence) ? identitySet.apply(void 0, into(vec(sequence), items)) : 'else' ? (function () {
            throw TypeError('' + 'Type can\'t be conjoined ' + sequence);
        })() : void 0;
    };
var disj = exports.disj = function disj(coll) {
        var ks = Array.prototype.slice.call(arguments, 1);
        return function () {
            var predicateø1 = complement(identitySet.apply(void 0, ks));
            return isEmpty(ks) ? coll : isSet(coll) ? identitySet.apply(void 0, filterv(predicateø1, coll)) : isDictionary(coll) ? into({}, filter(function ($1) {
                return predicateø1(first($1));
            }, coll)) : 'else' ? (function () {
                throw TypeError('' + 'Type can\'t be disjoined ' + coll);
            })() : void 0;
        }.call(this);
    };
var into = exports.into = function into(to, from) {
        return conj.apply(void 0, [to].concat(vec(from)));
    };
var zipmap = exports.zipmap = function zipmap(keys, vals) {
        return into({}, map(vector, keys, vals));
    };
var assoc = exports.assoc = function assoc(source) {
        var keyValues = Array.prototype.slice.call(arguments, 1);
        return conj(source, dictionary.apply(void 0, keyValues));
    };
var dissoc = exports.dissoc = function dissoc(coll) {
        var ks = Array.prototype.slice.call(arguments, 1);
        return isDictionary(coll) ? disj.apply(void 0, [coll].concat(ks)) : (function () {
            throw TypeError('' + 'Can only dissoc on dictionaries');
        })();
    };
var concat = exports.concat = function concat() {
        var sequences = Array.prototype.slice.call(arguments, 0);
        return reduce(function ($1, $2) {
            return conjList($1, reverse($2));
        }, function () {
            var tailø1 = last(sequences);
            return isLazySeq(tailø1) ? tailø1 : list.apply(void 0, vec(tailø1));
        }.call(this), rest(reverse(sequences)));
    };
var mapcat = exports.mapcat = function mapcat(f) {
        var colls = Array.prototype.slice.call(arguments, 1);
        return concat.apply(void 0, mapv.apply(void 0, [f].concat(colls)));
    };
var empty = exports.empty = function empty(sequence) {
        return isList(sequence) ? list() : isVector(sequence) ? [] : isString(sequence) ? '' : isDictionary(sequence) ? {} : isSet(sequence) ? set() : isLazySeq(sequence) ? lazySeq.call(void 0, false, function () {
            return void 0;
        }) : void 0;
    };
var seq = exports.seq = function seq(sequence) {
        return isNil(sequence) ? void 0 : isVector(sequence) || isSeq(sequence) ? sequence : isString(sequence) ? Array.prototype.slice.call(sequence) : isDictionary(sequence) ? keyValues(sequence) : isIterable(sequence) ? iteratorToLseq((sequence || 0)[Symbol.iterator]()) : 'default' ? (function () {
            throw TypeError('' + 'Can not seq ' + sequence);
        })() : void 0;
    };
var seq_ = exports.seq_ = function seq_(sequence) {
        return function () {
            var itø1 = seq(sequence);
            return isEmpty(itø1) ? void 0 : itø1;
        }.call(this);
    };
var isSeq = exports.isSeq = function isSeq(sequence) {
        return isList(sequence) || isLazySeq(sequence);
    };
var iteratorToLseq = function iteratorToLseq(iterator) {
    return unfold(function ($1) {
        return function () {
            var xø1 = $1.next();
            return xø1.done ? void 0 : [
                xø1.value,
                $1
            ];
        }.call(this);
    }, iterator);
};
var vec = exports.vec = function vec(sequence) {
        return isNil(sequence) ? [] : isVector(sequence) || isList(sequence) ? Array.from(sequence) : isLazySeq(sequence) ? function () {
            var xsø1 = Array.from(sequence);
            sequence.length = xsø1.length;
            return xsø1;
        }.call(this) : 'else' ? vec(seq(sequence)) : void 0;
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
    })) ? function ($1) {
        return function (a, b) {
            return $1(b, a) ? 1 : 0;
        };
    } : function ($1) {
        return function (a, b) {
            return $1(a, b) ? -1 : 0;
        };
    };
var sort = exports.sort = function sort(f, items) {
        return function () {
            var hasComparatorø1 = isFn(f);
            var itemsø2 = !hasComparatorø1 && isNil(items) ? f : items;
            var compareø1 = hasComparatorø1 ? sortComparator(f) : void 0;
            var resultø1 = vec(itemsø2).sort(compareø1);
            return isNil(itemsø2) ? list() : isVector(itemsø2) ? resultø1 : 'else' ? list.apply(void 0, resultø1) : void 0;
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
        return vec(sequence).every(function ($1) {
            return predicate($1);
        });
    };
var some = exports.some = function some(pred, coll) {
        return function loop() {
            var recur = loop;
            var itemsø1 = seq(coll);
            do {
                recur = isEmpty(itemsø1) ? void 0 : pred(first(itemsø1)) || (loop[0] = rest(itemsø1), loop);
            } while (itemsø1 = loop[0], recur === loop);
            return recur;
        }.call(this);
    };
var partition = exports.partition = function partition() {
        switch (arguments.length) {
        case 2:
            var n = arguments[0];
            var coll = arguments[1];
            return partition(n, n, coll);
        case 3:
            var n = arguments[0];
            var step = arguments[1];
            var coll = arguments[2];
            return partition(n, step, [], coll);
        case 4:
            var n = arguments[0];
            var step = arguments[1];
            var pad = arguments[2];
            var coll = arguments[3];
            return function loop() {
                var recur = loop;
                var resultø1 = [];
                var itemsø1 = seq(coll);
                do {
                    recur = function () {
                        var chunkø1 = take(n, itemsø1);
                        var sizeø1 = count(chunkø1);
                        return sizeø1 === n ? (loop[0] = conj(resultø1, chunkø1), loop[1] = drop(step, itemsø1), loop) : 0 === sizeø1 ? resultø1 : n > sizeø1 + count(pad) ? resultø1 : 'else' ? conj(resultø1, take(n, vec(concat(chunkø1, pad)))) : void 0;
                    }.call(this);
                } while (resultø1 = loop[0], itemsø1 = loop[1], recur === loop);
                return recur;
            }.call(this);
        default:
            throw RangeError('Wrong number of arguments passed');
        }
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
            return isNil(sequenceø2) ? notFound : isSeq(sequenceø2) ? function () {
                var ifLetBinding1ø1 = seq_(drop(index, sequenceø2));
                return ifLetBinding1ø1 ? function () {
                    var itø1 = ifLetBinding1ø1;
                    return first(itø1);
                }.call(this) : notFound;
            }.call(this) : isVector(sequenceø2) || isString(sequenceø2) ? index < count(sequenceø2) ? sequenceø2[index] : notFound : 'else' ? (function () {
                throw TypeError('Unsupported type');
            })() : void 0;
        }.call(this);
    };
var isContains = exports.isContains = function isContains(coll, v) {
        return isSet(coll) ? coll.has(v) : isDictionary(coll) || isVector(coll) || isString(coll) ? coll.hasOwnProperty(v) : 'else' ? false : void 0;
    };
var union = exports.union = function union() {
        var sets = Array.prototype.slice.call(arguments, 0);
        return into(set(), concat.apply(void 0, sets));
    };
var difference = exports.difference = function difference(s1) {
        var sets = Array.prototype.slice.call(arguments, 1);
        return into(set(), filter(complement(union.apply(void 0, sets)), s1));
    };
var intersection = exports.intersection = function intersection() {
        var sets = Array.prototype.slice.call(arguments, 0);
        return function () {
            var setsø2 = mapv(function ($1) {
                    return into(set(), $1);
                }, sets);
            var isInEachø1 = function (x) {
                return isEvery(function ($1) {
                    return $1.has(x);
                }, setsø2);
            };
            var minSizeø1 = min.apply(void 0, mapv(count, setsø2));
            var smallestø1 = setsø2.find(function ($1) {
                    return isEqual(minSizeø1, count($1));
                });
            return into(set(), filter(isInEachø1, smallestø1));
        }.call(this);
    };
var isSubset = exports.isSubset = function isSubset(set1, set2) {
        return isSet(set2) ? isEvery(function ($1) {
            return set2.has($1);
        }, set1) : isSubset(set1, into(set(), set2));
    };
var isSuperset = exports.isSuperset = function isSuperset(set1, set2) {
        return isSubset(set2, set1);
    };
var unfold = exports.unfold = function unfold(f, x) {
        return lazySeq.call(void 0, false, function () {
            return function () {
                var ifLetBinding2ø1 = f(x);
                return ifLetBinding2ø1 ? function () {
                    var nextø1 = ifLetBinding2ø1;
                    return cons(first(nextø1), unfold(f, second(nextø1)));
                }.call(this) : void 0;
            }.call(this);
        });
    };
var iterate = exports.iterate = function iterate(f, x) {
        return lazySeq.call(void 0, false, function () {
            return cons(x, iterate(f, f(x)));
        });
    };
var cycle = exports.cycle = function cycle(coll) {
        return lazySeq.call(void 0, false, function () {
            return isEmpty(coll) ? void 0 : concat(coll, cycle(coll));
        });
    };
var infiniteRange = exports.infiniteRange = function infiniteRange() {
        switch (arguments.length) {
        case 0:
            return infiniteRange(0);
        case 1:
            var n = arguments[0];
            return iterate(inc, n);
        case 2:
            var n = arguments[0];
            var step = arguments[1];
            return iterate(function ($1) {
                return $1 + step;
            }, n);
        default:
            throw RangeError('Wrong number of arguments passed');
        }
    };
var lazyMap = exports.lazyMap = function lazyMap(f) {
        var sequences = Array.prototype.slice.call(arguments, 1);
        return unfold(function ($1) {
            return some(isEmpty, $1) ? void 0 : [
                f.apply(void 0, mapv(first, $1)),
                mapv(rest, $1)
            ];
        }, sequences);
    };
var lazyFilter = exports.lazyFilter = function lazyFilter(f, sequence) {
        return unfold(function ($1) {
            return function loop() {
                var recur = loop;
                var xsø1 = $1;
                do {
                    recur = isEmpty(xsø1) ? void 0 : f(first(xsø1)) ? [
                        first(xsø1),
                        rest(xsø1)
                    ] : 'else' ? (loop[0] = rest(xsø1), loop) : void 0;
                } while (xsø1 = loop[0], recur === loop);
                return recur;
            }.call(this);
        }, seq(sequence));
    };
var lazyConcat = exports.lazyConcat = function lazyConcat() {
        var sequences = Array.prototype.slice.call(arguments, 0);
        return isEmpty(sequences) ? void 0 : function iter(xs) {
            return lazySeq.call(void 0, false, function () {
                return isEmpty(xs) ? lazyConcat.apply(void 0, rest(sequences)) : cons(first(xs), iter(rest(xs)));
            });
        }(seq(first(sequences)));
    };
var lazyPartition = exports.lazyPartition = function lazyPartition() {
        switch (arguments.length) {
        case 2:
            var n = arguments[0];
            var coll = arguments[1];
            return lazyPartition(n, n, coll);
        case 3:
            var n = arguments[0];
            var step = arguments[1];
            var coll = arguments[2];
            return lazyPartition(n, step, [], coll);
        case 4:
            var n = arguments[0];
            var step = arguments[1];
            var pad = arguments[2];
            var coll = arguments[3];
            return unfold(function ($1) {
                return function () {
                    var chunkø1 = take(n, concat(take(n, $1), pad));
                    return !isEmpty($1) && n === count(chunkø1) ? [
                        chunkø1,
                        drop(step, $1)
                    ] : void 0;
                }.call(this);
            }, coll);
        default:
            throw RangeError('Wrong number of arguments passed');
        }
    };
var run = exports.run = function run(proc, coll) {
        return reduce(function (_, x) {
            proc(x);
            return void 0;
        }, void 0, coll);
    };
var dorun = exports.dorun = function dorun() {
        switch (arguments.length) {
        case 1:
            var coll = arguments[0];
            return dorun(Infinity, coll);
        case 2:
            var n = arguments[0];
            var coll = arguments[1];
            return run(identity, take(n, coll));
        default:
            throw RangeError('Wrong number of arguments passed');
        }
    };
var doall = exports.doall = function doall() {
        switch (arguments.length) {
        case 1:
            var coll = arguments[0];
            return doall(Infinity, coll);
        case 2:
            var n = arguments[0];
            var coll = arguments[1];
            dorun(n, coll);
            return coll;
        default:
            throw RangeError('Wrong number of arguments passed');
        }
    };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndpc3Avc2VxdWVuY2Uud2lzcCJdLCJuYW1lcyI6WyJfbnNfIiwiaWQiLCJkb2MiLCJpc05pbCIsImlzVmVjdG9yIiwiaXNGbiIsImlzTnVtYmVyIiwiaXNTdHJpbmciLCJpc0RpY3Rpb25hcnkiLCJpc1NldCIsImtleVZhbHVlcyIsInN0ciIsImludCIsImRlYyIsImluYyIsIm1pbiIsIm1lcmdlIiwiZGljdGlvbmFyeSIsImdldCIsImlzSXRlcmFibGUiLCJpc0VxdWFsIiwiY29tcGxlbWVudCIsImlkZW50aXR5IiwiaXNMaXN0IiwiaXNMYXp5U2VxIiwiaXNJZGVudGl0eVNldCIsIl93aXNwVHlwZXMiLCJsaXN0SXRlcmF0b3IiLCJzZWxmw7gxIiwidGhpcyIsImlzRW1wdHkiLCJ4w7gxIiwiZmlyc3QiLCJyZXN0Iiwic2VxVG9TdHJpbmciLCJscGFyZW4iLCJycGFyZW4iLCJsaXN0w7gxIiwicmVzdWx0w7gxIiwic3Vic3RyIiwiam9pbiIsIkpTT04iLCJzdHJpbmdpZnkiLCJMaXN0IiwiaGVhZCIsInRhaWwiLCJsaXN0IiwibGVuZ3RoIiwiY291bnQiLCJwcm90b3R5cGUubGVuZ3RoIiwidHlwZSIsInByb3RvdHlwZS50eXBlIiwicHJvdG90eXBlLnRhaWwiLCJPYmplY3QiLCJjcmVhdGUiLCJwcm90b3R5cGUiLCJwcm90b3R5cGUudG9TdHJpbmciLCJTeW1ib2wiLCJpdGVyYXRvciIsImxhenlTZXFWYWx1ZSIsImxhenlTZXEiLCJyZWFsaXplZCIsIngiLCJMYXp5U2VxIiwiZXhwb3J0cyIsImJvZHkiLCJjbG9uZVByb3RvUHJvcHMiLCJmcm9tIiwidG8iLCJhc3NpZ24iLCJnZXRPd25Qcm9wZXJ0eU5hbWVzIiwiX19wcm90b19fIiwibWFwIiwiJDEiLCJiaW5kIiwiaWRlbnRpdHlTZXQiLCJpdGVtcyIsImpzU2V0w7gxIiwiZsO4MSIsIiQyIiwidG9TdHJpbmciLCJkZWZpbmVQcm9wZXJ0eSIsInNpemUiLCJ2YWx1ZXMiLCJzZXQiLCJfc2VxRXF1YWwiLCJ5IiwiaXNTZXEiLCJ4w7gyIiwic2VxIiwiecO4MiIsImV2ZXJ5IiwiYXJndW1lbnRzIiwiQXJyYXkiLCJwcm90b3R5cGUuc2xpY2UiLCJjYWxsIiwicmVkdWNlUmlnaHQiLCJjb25zIiwiaXNTZXF1ZW50aWFsIiwiaXNOYXRpdmUiLCJzZXF1ZW5jZSIsInJldmVyc2UiLCJ2ZWMiLCJpbnRvIiwicmFuZ2UiLCJlbmQiLCJzdGFydCIsInN0ZXAiLCJfIiwiaSIsIm1hcHYiLCJmIiwic2VxdWVuY2VzIiwidmVjdG9yc8O4MSIsIm7DuDEiLCJtYXBJbmRleGVkIiwic2VxdWVuY2XDuDEiLCJpbmRpY2Vzw7gxIiwiZmlsdGVyIiwiaXNGIiwiZmlsdGVyTGlzdCIsIml0ZW1zw7gxIiwiZmlsdGVydiIsInJlZHVjZSIsInBhcmFtcyIsImhhc0luaXRpYWzDuDEiLCJpbml0aWFsw7gxIiwic2Vjb25kIiwic3RlcMO4MSIsImFjYyIsIml0w7gxIiwidGhpcmQiLCJzbGljZSIsImxhc3RPZkxpc3QiLCJpdGVtw7gxIiwibGFzdCIsImJ1dGxhc3QiLCJzdWJzIiwidGFrZSIsIm4iLCJ0YWtlRnJvbVZlY3RvciIsInRha2VGcm9tTGlzdCIsInRha2VXaGlsZSIsInByZWRpY2F0ZSIsImhlYWTDuDEiLCJ0YWlsw7gxIiwiY29uaiIsInZlY3RvciIsInRha2Vuw7gxIiwibsO4MiIsImRyb3BGcm9tTGlzdCIsImxlZnTDuDEiLCJkcm9wIiwiZHJvcFdoaWxlIiwiY29uakxpc3QiLCJyZXN1bHQiLCJpdGVtIiwiZW5zdXJlRGljdGlvbmFyeSIsImNvbmNhdCIsIlR5cGVFcnJvciIsImRpc2oiLCJjb2xsIiwia3MiLCJwcmVkaWNhdGXDuDEiLCJ6aXBtYXAiLCJrZXlzIiwidmFscyIsImFzc29jIiwic291cmNlIiwiZGlzc29jIiwibWFwY2F0IiwiY29sbHMiLCJlbXB0eSIsIml0ZXJhdG9yVG9Mc2VxIiwic2VxXyIsInVuZm9sZCIsIm5leHQiLCJkb25lIiwidmFsdWUiLCJ4c8O4MSIsInNvcnRDb21wYXJhdG9yIiwic29ydCIsImEiLCJiIiwiaGFzQ29tcGFyYXRvcsO4MSIsIml0ZW1zw7gyIiwiY29tcGFyZcO4MSIsInJlcGVhdGVkbHkiLCJyZXBlYXQiLCJpc0V2ZXJ5Iiwic29tZSIsInByZWQiLCJwYXJ0aXRpb24iLCJwYWQiLCJjaHVua8O4MSIsInNpemXDuDEiLCJpbnRlcmxlYXZlIiwic2VxdWVuY2Vzw7gyIiwibnRoIiwiaW5kZXgiLCJub3RGb3VuZCIsInNlcXVlbmNlw7gyIiwiaXNDb250YWlucyIsInYiLCJoYXMiLCJoYXNPd25Qcm9wZXJ0eSIsInVuaW9uIiwic2V0cyIsImRpZmZlcmVuY2UiLCJzMSIsImludGVyc2VjdGlvbiIsInNldHPDuDIiLCJpc0luRWFjaMO4MSIsIm1pblNpemXDuDEiLCJzbWFsbGVzdMO4MSIsImZpbmQiLCJpc1N1YnNldCIsInNldDEiLCJzZXQyIiwiaXNTdXBlcnNldCIsIm5leHTDuDEiLCJpdGVyYXRlIiwiY3ljbGUiLCJpbmZpbml0ZVJhbmdlIiwibGF6eU1hcCIsImxhenlGaWx0ZXIiLCJsYXp5Q29uY2F0IiwiaXRlciIsInhzIiwibGF6eVBhcnRpdGlvbiIsInJ1biIsInByb2MiLCJkb3J1biIsIkluZmluaXR5IiwiZG9hbGwiXSwibWFwcGluZ3MiOiI7SUFBQSxJQUFDQSxJLEdBQUQ7QUFBQSxZQUFBQyxFLEVBQUksZUFBSjtBQUFBLFlBQUFDLEcsRUFBQSxLLENBQUE7QUFBQSxVOztRQUNrQ0MsS0FBQSxHLGFBQUFBLEs7UUFBS0MsUUFBQSxHLGFBQUFBLFE7UUFBUUMsSUFBQSxHLGFBQUFBLEk7UUFBSUMsUUFBQSxHLGFBQUFBLFE7UUFBUUMsUUFBQSxHLGFBQUFBLFE7UUFBUUMsWUFBQSxHLGFBQUFBLFk7UUFBWUMsS0FBQSxHLGFBQUFBLEs7UUFDN0NDLFNBQUEsRyxhQUFBQSxTO1FBQVdDLEdBQUEsRyxhQUFBQSxHO1FBQUlDLEdBQUEsRyxhQUFBQSxHO1FBQUlDLEdBQUEsRyxhQUFBQSxHO1FBQUlDLEdBQUEsRyxhQUFBQSxHO1FBQUlDLEdBQUEsRyxh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T0FBQ3VFLEtBQUQsQ0FBT0MsUUFBUCxFQUFnQnhFLElBQWhCLEU7O2dCQUNOdEIsQ0FBQSxHO2dCQUFFc0IsSUFBQSxHO1lBQU0sT0FBQ3FFLEdBQUQsQ0FBTWhOLFFBQU4sRUFBZ0JvSCxJQUFELENBQU1DLENBQU4sRUFBUXNCLElBQVIsQ0FBZixFOzs7O0tBUFosQztBQVNBLElBQU15RSxLQUFBLEdBQUExSyxPQUFBLENBQUEwSyxLQUFBLEdBQU4sU0FBTUEsS0FBTixHOzs7Z0JBT0l6RSxJQUFBLEc7WUFBTSxPQUFDeUUsS0FBRCxDQUFPRCxRQUFQLEVBQWdCeEUsSUFBaEIsRTs7Z0JBQ050QixDQUFBLEc7Z0JBQUVzQixJQUFBLEc7WUFBT3VFLEtBQUQsQ0FBTzdGLENBQVAsRUFBU3NCLElBQVQsRTtZQUFlLE9BQUFBLElBQUEsQzs7OztLQVIzQiIsInNvdXJjZXNDb250ZW50IjpbIihucyB3aXNwLnNlcXVlbmNlXG4gICg6cmVxdWlyZSBbd2lzcC5ydW50aW1lIDpyZWZlciBbbmlsPyB2ZWN0b3I/IGZuPyBudW1iZXI/IHN0cmluZz8gZGljdGlvbmFyeT8gc2V0P1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleS12YWx1ZXMgc3RyIGludCBkZWMgaW5jIG1pbiBtZXJnZSBkaWN0aW9uYXJ5IGdldFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZXJhYmxlPyA9IGNvbXBsZW1lbnQgaWRlbnRpdHkgbGlzdD8gbGF6eS1zZXE/IGlkZW50aXR5LXNldD9dXSkpXG5cbihkZWYgXjpwcml2YXRlIC13aXNwLXR5cGVzIChhZ2V0ID0gJy13aXNwLXR5cGVzKSlcblxuOzsgSW1wbGVtZW50YXRpb24gb2YgbGlzdFxuXG4oZGVmbi0gbGlzdC1pdGVyYXRvciBbXVxuICAobGV0IFtzZWxmIHRoaXNdXG4gICAgezpuZXh0ICMoaWYgKGVtcHR5PyBzZWxmKVxuICAgICAgICAgICAgICB7OmRvbmUgdHJ1ZX1cbiAgICAgICAgICAgICAgKGxldCBbeCAoZmlyc3Qgc2VsZildXG4gICAgICAgICAgICAgICAgKHNldCEgc2VsZiAocmVzdCBzZWxmKSlcbiAgICAgICAgICAgICAgICB7OnZhbHVlIHh9KSl9KSlcblxuKGRlZm4tIHNlcS0+c3RyaW5nIFtscGFyZW4gcnBhcmVuXVxuICAoZm4gW11cbiAgICAobG9vcCBbbGlzdCB0aGlzLCByZXN1bHQgXCJcIl1cbiAgICAgIChpZiAoZW1wdHk/IGxpc3QpXG4gICAgICAgIChzdHIgbHBhcmVuICguc3Vic3RyIHJlc3VsdCAxKSBycGFyZW4pXG4gICAgICAgIChyZWN1ciAocmVzdCBsaXN0KVxuICAgICAgICAgICAgICAgKHN0ciByZXN1bHRcbiAgICAgICAgICAgICAgICAgICAgXCIgXCJcbiAgICAgICAgICAgICAgICAgICAgKGxldCBbeCAoZmlyc3QgbGlzdCldXG4gICAgICAgICAgICAgICAgICAgICAgKGNvbmQgKHZlY3Rvcj8geCkgKHN0ciBcIltcIiAoLmpvaW4geCBcIiBcIikgXCJdXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKG5pbD8gICAgeCkgXCJuaWxcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChzdHJpbmc/IHgpICguc3RyaW5naWZ5IEpTT04geClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAobnVtYmVyPyB4KSAoLnN0cmluZ2lmeSBKU09OIHgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOmVsc2UgICAgICAgeCkpKSkpKSkpXG5cbihkZWZuLSBMaXN0XG4gIFwiTGlzdCB0eXBlXCJcbiAgW2hlYWQgdGFpbF1cbiAgKHNldCEgdGhpcy5oZWFkIGhlYWQpXG4gIChzZXQhIHRoaXMudGFpbCAob3IgdGFpbCAobGlzdCkpKVxuICAoc2V0ISB0aGlzLmxlbmd0aFxuICAgIChpZiAob3IgKG5pbD8gdGhpcy50YWlsKSAoZGljdGlvbmFyeT8gdGhpcy50YWlsKSAobnVtYmVyPyAoLi1sZW5ndGggdGhpcy50YWlsKSkpXG4gICAgICAoaW5jIChjb3VudCB0aGlzLnRhaWwpKSkpXG4gIHRoaXMpXG5cbihzZXQhIExpc3QucHJvdG90eXBlLmxlbmd0aCAwKVxuKHNldCEgTGlzdC50eXBlICg6bGlzdCAtd2lzcC10eXBlcykpXG4oc2V0ISBMaXN0LnByb3RvdHlwZS50eXBlIExpc3QudHlwZSlcbihzZXQhIExpc3QucHJvdG90eXBlLnRhaWwgKE9iamVjdC5jcmVhdGUgTGlzdC5wcm90b3R5cGUpKVxuKHNldCEgTGlzdC5wcm90b3R5cGUudG8tc3RyaW5nIChzZXEtPnN0cmluZyBcIihcIiBcIilcIikpXG4oYXNldCBMaXN0LnByb3RvdHlwZSBTeW1ib2wuaXRlcmF0b3IgbGlzdC1pdGVyYXRvcilcblxuKGRlZm4tIGxhenktc2VxLXZhbHVlIFtsYXp5LXNlcV1cbiAgKGlmICguLXJlYWxpemVkIGxhenktc2VxKVxuICAgICguLXggbGF6eS1zZXEpXG4gICAgKGxldCBbeCAoLnggbGF6eS1zZXEpXVxuICAgICAgKHNldCEgKC4tcmVhbGl6ZWQgbGF6eS1zZXEpIHRydWUpXG4gICAgICAoaWYgKGVtcHR5PyB4KVxuICAgICAgICAoc2V0ISAoLi1sZW5ndGggbGF6eS1zZXEpIDApKVxuICAgICAgKHNldCEgKC4teCBsYXp5LXNlcSkgeCkpKSlcblxuKGRlZm4tIExhenlTZXEgW3JlYWxpemVkIHhdXG4gIChzZXQhICguLXJlYWxpemVkIHRoaXMpIChvciByZWFsaXplZCBmYWxzZSkpXG4gIChzZXQhICguLXggdGhpcykgeClcbiAgdGhpcylcbihzZXQhIExhenlTZXEudHlwZSAoOmxhenktc2VxIC13aXNwLXR5cGVzKSlcbihzZXQhIExhenlTZXEucHJvdG90eXBlLnR5cGUgTGF6eVNlcS50eXBlKVxuKGFzZXQgTGF6eVNlcS5wcm90b3R5cGUgU3ltYm9sLml0ZXJhdG9yIGxpc3QtaXRlcmF0b3IpXG5cbihkZWZuIGxhenktc2VxXG4gIFtyZWFsaXplZCBib2R5XVxuICAoTGF6eVNlcS4gcmVhbGl6ZWQgYm9keSkpXG5cbihkZWZuLSBjbG9uZS1wcm90by1wcm9wcyEgW2Zyb20gdG9dXG4gIChhcHBseSBPYmplY3QuYXNzaWduIHRvXG4gICAgICAgICAoLm1hcCAoT2JqZWN0LmdldC1vd24tcHJvcGVydHktbmFtZXMgZnJvbS5fX3Byb3RvX18pXG4gICAgICAgICAgICAgICAjKGxldCBbeCAoYWdldCBmcm9tICUpXVxuICAgICAgICAgICAgICAgICAgKGRpY3Rpb25hcnkgJSAoaWYgKGZuPyB4KSAoLmJpbmQgeCBmcm9tKSB4KSkpKSkpXG5cbihkZWZuIGlkZW50aXR5LXNldCBbJiBpdGVtc11cbiAgKGxldCBbanMtc2V0IChTZXQuIGl0ZW1zKVxuICAgICAgICBmICAgICAgIyhnZXQganMtc2V0ICUxICUyKV1cbiAgICAoY2xvbmUtcHJvdG8tcHJvcHMhIGpzLXNldCBmKVxuICAgIChzZXQhIGYudG8tc3RyaW5nIChzZXEtPnN0cmluZyBcIiN7XCIgXCJ9XCIpKVxuICAgIChzZXQhIGYuX19wcm90b19fIGpzLXNldClcbiAgICAoT2JqZWN0LmRlZmluZS1wcm9wZXJ0eSBmIDpsZW5ndGggezp2YWx1ZSBmLnNpemV9KVxuICAgIChhc2V0IGYgU3ltYm9sLml0ZXJhdG9yIGYudmFsdWVzKVxuICAgIChhc2V0IGYgOnR5cGUgaWRlbnRpdHktc2V0LnR5cGUpXG4gICAgZikpXG4oc2V0ISBpZGVudGl0eS1zZXQudHlwZSAoOnNldCAtd2lzcC10eXBlcykpXG4oZGVmIHNldCBpZGVudGl0eS1zZXQpXG5cbihkZWYgbGF6eS1zZXE/IGxhenktc2VxPylcbihkZWYgaWRlbnRpdHktc2V0PyBpZGVudGl0eS1zZXQ/KVxuKGRlZiBsaXN0PyBsaXN0PylcblxuKHNldCEgPS4qc2VxPVxuICAoZm4gW3ggeV1cbiAgICAoYW5kIChvciAodmVjdG9yPyB4KSAoc2VxPyB4KSlcbiAgICAgICAgIChvciAodmVjdG9yPyB5KSAoc2VxPyB5KSlcbiAgICAgICAgIChsb29wIFt4IChzZXEgeCksIHkgKHNlcSB5KV1cbiAgICAgICAgICAgKGNvbmQgKGFuZCAodmVjdG9yPyB4KSAodmVjdG9yPyB5KSkgKGFuZCAoPSAoY291bnQgeCkgKGNvdW50IHkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICguZXZlcnkgeCAjKD0gJTEgKGFnZXQgeSAlMikpKSlcbiAgICAgICAgICAgICAgICAgKG9yIChlbXB0eT8geCkgKGVtcHR5PyB5KSkgICAgKGFuZCAoZW1wdHk/IHgpIChlbXB0eT8geSkpXG4gICAgICAgICAgICAgICAgIChub3Q9IChmaXJzdCB4KSAoZmlyc3QgeSkpICAgIGZhbHNlXG4gICAgICAgICAgICAgICAgIDplbHNlICAgICAgICAgICAgICAgICAgICAgICAgIChyZWN1ciAocmVzdCB4KSAocmVzdCB5KSkpKSkpKVxuXG4oZGVmbiBsaXN0XG4gIFwiQ3JlYXRlcyBsaXN0IG9mIHRoZSBnaXZlbiBpdGVtc1wiXG4gIFtdXG4gIChpZiAoaWRlbnRpY2FsPyAoLi1sZW5ndGggYXJndW1lbnRzKSAwKVxuICAgIChPYmplY3QuY3JlYXRlIExpc3QucHJvdG90eXBlKVxuICAgICgucmVkdWNlLXJpZ2h0ICguY2FsbCBBcnJheS5wcm90b3R5cGUuc2xpY2UgYXJndW1lbnRzKVxuICAgICAgICAgICAgICAgICAgIChmbiBbdGFpbCBoZWFkXSAoY29ucyBoZWFkIHRhaWwpKVxuICAgICAgICAgICAgICAgICAgIChsaXN0KSkpKVxuXG4oZGVmbiBjb25zXG4gIFwiQ3JlYXRlcyBsaXN0IHdpdGggYGhlYWRgIGFzIGZpcnN0IGl0ZW0gYW5kIGB0YWlsYCBhcyByZXN0XCJcbiAgW2hlYWQgdGFpbF1cbiAgKG5ldyBMaXN0IGhlYWQgdGFpbCkpXG5cbihkZWZuIF5ib29sZWFuIHNlcXVlbnRpYWw/XG4gIFwiUmV0dXJucyB0cnVlIGlmIGNvbGwgc2F0aXNmaWVzIElTZXF1ZW50aWFsXCJcbiAgW3hdIChvciAoc2VxPyB4KVxuICAgICAgICAgICh2ZWN0b3I/IHgpXG4gICAgICAgICAgKGRpY3Rpb25hcnk/IHgpXG4gICAgICAgICAgKHNldD8geClcbiAgICAgICAgICAoc3RyaW5nPyB4KSkpXG5cbihkZWZuLSBeYm9vbGVhbiBuYXRpdmU/IFtzZXF1ZW5jZV1cbiAgKG9yICh2ZWN0b3I/IHNlcXVlbmNlKSAoc3RyaW5nPyBzZXF1ZW5jZSkgKGRpY3Rpb25hcnk/IHNlcXVlbmNlKSkpXG5cblxuKGRlZm4gcmV2ZXJzZVxuICBcIlJldmVyc2Ugb3JkZXIgb2YgaXRlbXMgaW4gdGhlIHNlcXVlbmNlXCJcbiAgW3NlcXVlbmNlXVxuICAoaWYgKHZlY3Rvcj8gc2VxdWVuY2UpXG4gICAgKC5yZXZlcnNlICh2ZWMgc2VxdWVuY2UpKVxuICAgIChpbnRvIG5pbCBzZXF1ZW5jZSkpKVxuXG4oZGVmbiByYW5nZVxuICBcIlJldHVybnMgYSB2ZWN0b3Igb2YgbnVtcyBmcm9tIHN0YXJ0IChpbmNsdXNpdmUpIHRvIGVuZFxuICAoZXhjbHVzaXZlKSwgYnkgc3RlcCwgd2hlcmUgc3RhcnQgZGVmYXVsdHMgdG8gMCBhbmQgc3RlcCB0byAxLlwiXG4gIChbZW5kXSAgICAgICAgICAgIChyYW5nZSAwIGVuZCAxKSlcbiAgKFtzdGFydCBlbmRdICAgICAgKHJhbmdlIHN0YXJ0IGVuZCAxKSlcbiAgKFtzdGFydCBlbmQgc3RlcF0gKGlmICg8IHN0ZXAgMClcbiAgICAgICAgICAgICAgICAgICAgICAoLm1hcCAocmFuZ2UgKC0gc3RhcnQpICgtIGVuZCkgKC0gc3RlcCkpICMoLSAlKSlcbiAgICAgICAgICAgICAgICAgICAgICAoQXJyYXkuZnJvbSB7Omxlbmd0aCAoLyAoLSAoKyBlbmQgc3RlcCkgc3RhcnQgMSkgc3RlcCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZuIFtfIGldICgrIHN0YXJ0ICgqIGkgc3RlcCkpKSkpKSlcblxuKGRlZm4gbWFwdlxuICBcIlJldHVybnMgYSB2ZWN0b3IgY29uc2lzdGluZyBvZiB0aGUgcmVzdWx0IG9mIGFwcGx5aW5nIGBmYCB0byB0aGVcbiAgZmlyc3QgaXRlbXMsIGZvbGxvd2VkIGJ5IGFwcGx5aW5nIGYgdG8gdGhlIHNlY29uZCBpdGVtcywgdW50aWwgb25lIG9mXG4gIHNlcXVlbmNlcyBpcyBleGhhdXN0ZWQuXCJcbiAgW2YgJiBzZXF1ZW5jZXNdXG4gIChsZXQgW3ZlY3RvcnMgKC5tYXAgc2VxdWVuY2VzIHZlYyksICBuIChhcHBseSBtaW4gKC5tYXAgdmVjdG9ycyBjb3VudCkpXVxuICAgICgubWFwIChyYW5nZSBuKSAoZm4gW2ldIChhcHBseSBmICgubWFwIHZlY3RvcnMgIyhhZ2V0ICUgaSkpKSkpKSlcblxuKGRlZm4gbWFwXG4gIFwiUmV0dXJucyBhIHNlcXVlbmNlIGNvbnNpc3Rpbmcgb2YgdGhlIHJlc3VsdCBvZiBhcHBseWluZyBgZmAgdG8gdGhlXG4gIGZpcnN0IGl0ZW1zLCBmb2xsb3dlZCBieSBhcHBseWluZyBmIHRvIHRoZSBzZWNvbmQgaXRlbXMsIHVudGlsIG9uZSBvZlxuICBzZXF1ZW5jZXMgaXMgZXhoYXVzdGVkLlwiXG4gIFtmICYgc2VxdWVuY2VzXVxuICAobGV0IFtyZXN1bHQgKGFwcGx5IG1hcHYgZiBzZXF1ZW5jZXMpXVxuICAgIChpZiAobmF0aXZlPyAoZmlyc3Qgc2VxdWVuY2VzKSkgcmVzdWx0IChhcHBseSBsaXN0IHJlc3VsdCkpKSlcblxuKGRlZm4gbWFwLWluZGV4ZWRcbiAgXCJSZXR1cm5zIGEgc2VxdWVuY2UgY29uc2lzdGluZyBvZiB0aGUgcmVzdWx0IG9mIGFwcGx5aW5nIGBmYCB0byAwIGFuZFxuICB0aGUgZmlyc3QgaXRlbXMsIGZvbGxvd2VkIGJ5IGFwcGx5aW5nIGYgdG8gMSBhbmQgdGhlIHNlY29uZCBpdGVtcyxcbiAgdW50aWwgb25lIG9mIHNlcXVlbmNlcyBpcyBleGhhdXN0ZWQuXCJcbiAgW2YgJiBzZXF1ZW5jZXNdXG4gIChsZXQgW3NlcXVlbmNlIChmaXJzdCBzZXF1ZW5jZXMpLCAgbiAoY291bnQgc2VxdWVuY2UpLCAgaW5kaWNlcyAocmFuZ2UgbildXG4gICAgKGFwcGx5IG1hcCBmIChpZiAobmF0aXZlPyBzZXF1ZW5jZSkgaW5kaWNlcyAoYXBwbHkgbGlzdCBpbmRpY2VzKSkgc2VxdWVuY2VzKSkpXG5cbihkZWZuIGZpbHRlclxuICBcIlJldHVybnMgYSBzZXF1ZW5jZSBvZiB0aGUgaXRlbXMgaW4gY29sbCBmb3Igd2hpY2ggKGY/IGl0ZW0pIHJldHVybnMgdHJ1ZS5cbiAgZj8gbXVzdCBiZSBmcmVlIG9mIHNpZGUtZWZmZWN0cy5cIlxuICBbZj8gc2VxdWVuY2VdXG4gIChjb25kIChuaWw/IHNlcXVlbmNlKSAgICAnKClcbiAgICAgICAgKHNlcT8gc2VxdWVuY2UpICAgIChmaWx0ZXItbGlzdCBmPyBzZXF1ZW5jZSlcbiAgICAgICAgKHZlY3Rvcj8gc2VxdWVuY2UpICguZmlsdGVyIHNlcXVlbmNlICMoZj8gJSkpXG4gICAgICAgIDplbHNlICAgICAgICAgICAgICAoZmlsdGVyIGY/IChzZXEgc2VxdWVuY2UpKSkpXG5cbihkZWZuLSBmaWx0ZXItbGlzdFxuICBcIkxpa2UgZmlsdGVyIGJ1dCBmb3IgbGlzdHNcIlxuICBbZj8gc2VxdWVuY2VdXG4gIChsb29wIFtyZXN1bHQgJygpXG4gICAgICAgICBpdGVtcyBzZXF1ZW5jZV1cbiAgICAoaWYgKGVtcHR5PyBpdGVtcylcbiAgICAgIChyZXZlcnNlIHJlc3VsdClcbiAgICAgIChyZWN1ciAoaWYgKGY/IChmaXJzdCBpdGVtcykpXG4gICAgICAgICAgICAgICAoY29ucyAoZmlyc3QgaXRlbXMpIHJlc3VsdClcbiAgICAgICAgICAgICAgIHJlc3VsdClcbiAgICAgICAgICAgICAocmVzdCBpdGVtcykpKSkpXG5cbihkZWZuIGZpbHRlcnYgW2Y/IHNlcXVlbmNlXVxuICAodmVjIChmaWx0ZXIgZj8gc2VxdWVuY2UpKSlcblxuKGRlZm4gcmVkdWNlXG4gIFtmICYgcGFyYW1zXVxuICAobGV0IFtoYXMtaW5pdGlhbCAoPj0gKGNvdW50IHBhcmFtcykgMilcbiAgICAgICAgaW5pdGlhbCAgICAgKGlmIGhhcy1pbml0aWFsIChmaXJzdCBwYXJhbXMpKVxuICAgICAgICBzZXF1ZW5jZSAgICAoaWYgaGFzLWluaXRpYWwgKHNlY29uZCBwYXJhbXMpIChmaXJzdCBwYXJhbXMpKVxuICAgICAgICBzdGVwICAgICAgICAoZm4gW2FjYyB4XSAoZiBhY2MgeCkpXVxuICAgIChpZiBoYXMtaW5pdGlhbFxuICAgICAgKC5yZWR1Y2UgKHZlYyBzZXF1ZW5jZSkgc3RlcCBpbml0aWFsKVxuICAgICAgKC5yZWR1Y2UgKHZlYyBzZXF1ZW5jZSkgc3RlcCkpKSlcblxuKGRlZm4gY291bnRcbiAgXCJSZXR1cm5zIG51bWJlciBvZiBlbGVtZW50cyBpbiBsaXN0XCJcbiAgW3NlcXVlbmNlXVxuICAoaWYgKGFuZCBzZXF1ZW5jZSAobnVtYmVyPyAoLi1sZW5ndGggc2VxdWVuY2UpKSlcbiAgICAoLi1sZW5ndGggc2VxdWVuY2UpXG4gICAgKGxldCBbaXQgKHNlcSBzZXF1ZW5jZSldXG4gICAgICAoY29uZCAobmlsPyBpdCkgICAgICAwXG4gICAgICAgICAgICAobGF6eS1zZXE/IGl0KSAoY291bnQgKHZlYyBpdCkpXG4gICAgICAgICAgICA6ZWxzZSAgICAgICAgICAoLi1sZW5ndGggaXQpKSkpKVxuXG4oZGVmbiBlbXB0eT9cbiAgXCJSZXR1cm5zIHRydWUgaWYgbGlzdCBpcyBlbXB0eVwiXG4gIFtzZXF1ZW5jZV1cbiAgKGxldCBbaXQgKHNlcSBzZXF1ZW5jZSldXG4gICAgKGlkZW50aWNhbD8gMCAoaWYgKGxhenktc2VxPyBpdClcbiAgICAgICAgICAgICAgICAgICAgKGRvIChmaXJzdCBpdCkgICAgICAgICAgICAgOyBmb3JjaW5nIGV2YWx1YXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICguLWxlbmd0aCBpdCkpXG4gICAgICAgICAgICAgICAgICAgIChjb3VudCBpdCkpKSkpXG5cbihkZWZuIGZpcnN0XG4gIFwiUmV0dXJuIGZpcnN0IGl0ZW0gaW4gYSBsaXN0XCJcbiAgW3NlcXVlbmNlXVxuICAoY29uZCAobmlsPyBzZXF1ZW5jZSkgbmlsXG4gICAgICAgIChsaXN0PyBzZXF1ZW5jZSkgKC4taGVhZCBzZXF1ZW5jZSlcbiAgICAgICAgKG9yICh2ZWN0b3I/IHNlcXVlbmNlKSAoc3RyaW5nPyBzZXF1ZW5jZSkpIChnZXQgc2VxdWVuY2UgMClcbiAgICAgICAgKGxhenktc2VxPyBzZXF1ZW5jZSkgKGZpcnN0IChsYXp5LXNlcS12YWx1ZSBzZXF1ZW5jZSkpXG4gICAgICAgIDplbHNlIChmaXJzdCAoc2VxIHNlcXVlbmNlKSkpKVxuXG4oZGVmbiBzZWNvbmRcbiAgXCJSZXR1cm5zIHNlY29uZCBpdGVtIG9mIHRoZSBsaXN0XCJcbiAgW3NlcXVlbmNlXVxuICAoY29uZCAobmlsPyBzZXF1ZW5jZSkgbmlsXG4gICAgICAgIChsaXN0PyBzZXF1ZW5jZSkgKGZpcnN0IChyZXN0IHNlcXVlbmNlKSlcbiAgICAgICAgKG9yICh2ZWN0b3I/IHNlcXVlbmNlKSAoc3RyaW5nPyBzZXF1ZW5jZSkpIChnZXQgc2VxdWVuY2UgMSlcbiAgICAgICAgKGxhenktc2VxPyBzZXF1ZW5jZSkgKHNlY29uZCAobGF6eS1zZXEtdmFsdWUgc2VxdWVuY2UpKVxuICAgICAgICA6ZWxzZSAoZmlyc3QgKHJlc3QgKHNlcSBzZXF1ZW5jZSkpKSkpXG5cbihkZWZuIHRoaXJkXG4gIFwiUmV0dXJucyB0aGlyZCBpdGVtIG9mIHRoZSBsaXN0XCJcbiAgW3NlcXVlbmNlXVxuICAoY29uZCAobmlsPyBzZXF1ZW5jZSkgbmlsXG4gICAgICAgIChsaXN0PyBzZXF1ZW5jZSkgKGZpcnN0IChyZXN0IChyZXN0IHNlcXVlbmNlKSkpXG4gICAgICAgIChvciAodmVjdG9yPyBzZXF1ZW5jZSkgKHN0cmluZz8gc2VxdWVuY2UpKSAoZ2V0IHNlcXVlbmNlIDIpXG4gICAgICAgIChsYXp5LXNlcT8gc2VxdWVuY2UpICh0aGlyZCAobGF6eS1zZXEtdmFsdWUgc2VxdWVuY2UpKVxuICAgICAgICA6ZWxzZSAoc2Vjb25kIChyZXN0IChzZXEgc2VxdWVuY2UpKSkpKVxuXG4oZGVmbiByZXN0XG4gIFwiUmV0dXJucyBsaXN0IG9mIGFsbCBpdGVtcyBleGNlcHQgZmlyc3Qgb25lXCJcbiAgW3NlcXVlbmNlXVxuICAoY29uZCAobmlsPyBzZXF1ZW5jZSkgJygpXG4gICAgICAgIChsaXN0PyBzZXF1ZW5jZSkgKC4tdGFpbCBzZXF1ZW5jZSlcbiAgICAgICAgKG9yICh2ZWN0b3I/IHNlcXVlbmNlKSAoc3RyaW5nPyBzZXF1ZW5jZSkpICguc2xpY2Ugc2VxdWVuY2UgMSlcbiAgICAgICAgKGxhenktc2VxPyBzZXF1ZW5jZSkgKHJlc3QgKGxhenktc2VxLXZhbHVlIHNlcXVlbmNlKSlcbiAgICAgICAgOmVsc2UgKHJlc3QgKHNlcSBzZXF1ZW5jZSkpKSlcblxuKGRlZm4tIGxhc3Qtb2YtbGlzdFxuICBbbGlzdF1cbiAgKGxvb3AgW2l0ZW0gKGZpcnN0IGxpc3QpXG4gICAgICAgICBpdGVtcyAocmVzdCBsaXN0KV1cbiAgICAoaWYgKGVtcHR5PyBpdGVtcylcbiAgICAgIGl0ZW1cbiAgICAgIChyZWN1ciAoZmlyc3QgaXRlbXMpIChyZXN0IGl0ZW1zKSkpKSlcblxuKGRlZm4gbGFzdFxuICBcIlJldHVybiB0aGUgbGFzdCBpdGVtIGluIGNvbGwsIGluIGxpbmVhciB0aW1lXCJcbiAgW3NlcXVlbmNlXVxuICAoY29uZCAob3IgKHZlY3Rvcj8gc2VxdWVuY2UpXG4gICAgICAgICAgICAoc3RyaW5nPyBzZXF1ZW5jZSkpIChnZXQgc2VxdWVuY2UgKGRlYyAoY291bnQgc2VxdWVuY2UpKSlcbiAgICAgICAgKGxpc3Q/IHNlcXVlbmNlKSAobGFzdC1vZi1saXN0IHNlcXVlbmNlKVxuICAgICAgICAobmlsPyBzZXF1ZW5jZSkgbmlsXG4gICAgICAgIChsYXp5LXNlcT8gc2VxdWVuY2UpIChsYXN0IChsYXp5LXNlcS12YWx1ZSBzZXF1ZW5jZSkpXG4gICAgICAgIDplbHNlIChsYXN0IChzZXEgc2VxdWVuY2UpKSkpXG5cbihkZWZuIGJ1dGxhc3RcbiAgXCJSZXR1cm4gYSBzZXEgb2YgYWxsIGJ1dCB0aGUgbGFzdCBpdGVtIGluIGNvbGwsIGluIGxpbmVhciB0aW1lXCJcbiAgW3NlcXVlbmNlXVxuICAobGV0IFtpdGVtcyAoY29uZCAobmlsPyBzZXF1ZW5jZSkgbmlsXG4gICAgICAgICAgICAgICAgICAgIChzdHJpbmc/IHNlcXVlbmNlKSAoc3VicyBzZXF1ZW5jZSAwIChkZWMgKGNvdW50IHNlcXVlbmNlKSkpXG4gICAgICAgICAgICAgICAgICAgICh2ZWN0b3I/IHNlcXVlbmNlKSAoLnNsaWNlIHNlcXVlbmNlIDAgKGRlYyAoY291bnQgc2VxdWVuY2UpKSlcbiAgICAgICAgICAgICAgICAgICAgKGxpc3Q/IHNlcXVlbmNlKSAoYXBwbHkgbGlzdCAoYnV0bGFzdCAodmVjIHNlcXVlbmNlKSkpXG4gICAgICAgICAgICAgICAgICAgIChsYXp5LXNlcT8gc2VxdWVuY2UpIChidXRsYXN0IChsYXp5LXNlcS12YWx1ZSBzZXF1ZW5jZSkpXG4gICAgICAgICAgICAgICAgICAgIDplbHNlIChidXRsYXN0IChzZXEgc2VxdWVuY2UpKSldXG4gICAgKGlmIChlbXB0eT8gaXRlbXMpIG5pbCBpdGVtcykpKVxuXG4oZGVmbiB0YWtlXG4gIFwiUmV0dXJucyBhIHNlcXVlbmNlIG9mIHRoZSBmaXJzdCBgbmAgaXRlbXMsIG9yIGFsbCBpdGVtcyBpZlxuICB0aGVyZSBhcmUgZmV3ZXIgdGhhbiBgbmAuXCJcbiAgW24gc2VxdWVuY2VdXG4gIChjb25kIChuaWw/IHNlcXVlbmNlKSAnKClcbiAgICAgICAgKHZlY3Rvcj8gc2VxdWVuY2UpICh0YWtlLWZyb20tdmVjdG9yIG4gc2VxdWVuY2UpXG4gICAgICAgIChsaXN0PyBzZXF1ZW5jZSkgKHRha2UtZnJvbS1saXN0IG4gc2VxdWVuY2UpXG4gICAgICAgIChsYXp5LXNlcT8gc2VxdWVuY2UpIChpZiAoPiBuIDApICh0YWtlIG4gKGxhenktc2VxLXZhbHVlIHNlcXVlbmNlKSkpXG4gICAgICAgIDplbHNlICh0YWtlIG4gKHNlcSBzZXF1ZW5jZSkpKSlcblxuKGRlZm4gdGFrZS13aGlsZVxuICBbcHJlZGljYXRlIHNlcXVlbmNlXVxuICAobG9vcCBbaXRlbXMgc2VxdWVuY2UsIHJlc3VsdCBbXV1cbiAgICAobGV0IFtoZWFkIChmaXJzdCBpdGVtcyksIHRhaWwgKHJlc3QgaXRlbXMpXVxuICAgICAgKGlmIChhbmQgKG5vdCAoZW1wdHk/IGl0ZW1zKSlcbiAgICAgICAgICAgICAgIChwcmVkaWNhdGUgaGVhZCkpXG4gICAgICAgIChyZWN1ciB0YWlsIChjb25qIHJlc3VsdCBoZWFkKSlcbiAgICAgICAgKGlmIChuYXRpdmU/IHNlcXVlbmNlKSByZXN1bHQgKGFwcGx5IGxpc3QgcmVzdWx0KSkpKSkpXG5cblxuKGRlZm4tIHRha2UtZnJvbS12ZWN0b3JcbiAgXCJMaWtlIHRha2UgYnV0IG9wdGltaXplZCBmb3IgdmVjdG9yc1wiXG4gIFtuIHZlY3Rvcl1cbiAgKC5zbGljZSB2ZWN0b3IgMCBuKSlcblxuKGRlZm4tIHRha2UtZnJvbS1saXN0XG4gIFwiTGlrZSB0YWtlIGJ1dCBmb3IgbGlzdHNcIlxuICBbbiBzZXF1ZW5jZV1cbiAgKGxvb3AgW3Rha2VuICcoKVxuICAgICAgICAgaXRlbXMgc2VxdWVuY2VcbiAgICAgICAgIG4gICAgIChvciAoaW50IG4pIDApXVxuICAgIChpZiAob3IgKDw9IG4gMCkgKGVtcHR5PyBpdGVtcykpXG4gICAgICAocmV2ZXJzZSB0YWtlbilcbiAgICAgIChyZWN1ciAoY29ucyAoZmlyc3QgaXRlbXMpIHRha2VuKVxuICAgICAgICAgICAgIChyZXN0IGl0ZW1zKVxuICAgICAgICAgICAgIChkZWMgbikpKSkpXG5cblxuXG5cbihkZWZuLSBkcm9wLWZyb20tbGlzdCBbbiBzZXF1ZW5jZV1cbiAgKGxvb3AgW2xlZnQgblxuICAgICAgICAgaXRlbXMgc2VxdWVuY2VdXG4gICAgKGlmIChvciAoPCBsZWZ0IDEpIChlbXB0eT8gaXRlbXMpKVxuICAgICAgaXRlbXNcbiAgICAgIChyZWN1ciAoZGVjIGxlZnQpIChyZXN0IGl0ZW1zKSkpKSlcblxuKGRlZm4gZHJvcFxuICBbbiBzZXF1ZW5jZV1cbiAgKGlmICg8PSBuIDApXG4gICAgc2VxdWVuY2VcbiAgICAoY29uZCAoc3RyaW5nPyBzZXF1ZW5jZSkgKC5zdWJzdHIgc2VxdWVuY2UgbilcbiAgICAgICAgICAodmVjdG9yPyBzZXF1ZW5jZSkgKC5zbGljZSBzZXF1ZW5jZSBuKVxuICAgICAgICAgIChsaXN0PyBzZXF1ZW5jZSkgKGRyb3AtZnJvbS1saXN0IG4gc2VxdWVuY2UpXG4gICAgICAgICAgKG5pbD8gc2VxdWVuY2UpICcoKVxuICAgICAgICAgIChsYXp5LXNlcT8gc2VxdWVuY2UpIChkcm9wIG4gKGxhenktc2VxLXZhbHVlIHNlcXVlbmNlKSlcbiAgICAgICAgICA6ZWxzZSAoZHJvcCBuIChzZXEgc2VxdWVuY2UpKSkpKVxuXG4oZGVmbiBkcm9wLXdoaWxlXG4gIFtwcmVkaWNhdGUgc2VxdWVuY2VdXG4gIChsb29wIFtpdGVtcyAoc2VxIHNlcXVlbmNlKV1cbiAgICAoaWYgKG9yIChlbXB0eT8gaXRlbXMpIChub3QgKHByZWRpY2F0ZSAoZmlyc3QgaXRlbXMpKSkpXG4gICAgICBpdGVtc1xuICAgICAgKHJlY3VyIChyZXN0IGl0ZW1zKSkpKSlcblxuXG4oZGVmbi0gY29uai1saXN0XG4gIFtzZXF1ZW5jZSBpdGVtc11cbiAgKHJlZHVjZSAoZm4gW3Jlc3VsdCBpdGVtXSAoY29ucyBpdGVtIHJlc3VsdCkpIHNlcXVlbmNlIGl0ZW1zKSlcblxuKGRlZm4tIGVuc3VyZS1kaWN0aW9uYXJ5IFt4XVxuICAoaWYgKHZlY3Rvcj8geClcbiAgICAoZGljdGlvbmFyeSAoZmlyc3QgeCkgKHNlY29uZCB4KSlcbiAgICB4KSlcblxuKGRlZm4gY29ualxuICBbc2VxdWVuY2UgJiBpdGVtc11cbiAgKGNvbmQgKHZlY3Rvcj8gc2VxdWVuY2UpICguY29uY2F0IHNlcXVlbmNlIGl0ZW1zKVxuICAgICAgICAoc3RyaW5nPyBzZXF1ZW5jZSkgKHN0ciBzZXF1ZW5jZSAoYXBwbHkgc3RyIGl0ZW1zKSlcbiAgICAgICAgKG5pbD8gc2VxdWVuY2UpIChhcHBseSBsaXN0IChyZXZlcnNlIGl0ZW1zKSlcbiAgICAgICAgKHNlcT8gc2VxdWVuY2UpIChjb25qLWxpc3Qgc2VxdWVuY2UgaXRlbXMpXG4gICAgICAgIChkaWN0aW9uYXJ5PyBzZXF1ZW5jZSkgKG1lcmdlIHNlcXVlbmNlIChhcHBseSBtZXJnZSAobWFwdiBlbnN1cmUtZGljdGlvbmFyeSBpdGVtcykpKVxuICAgICAgICAoc2V0PyBzZXF1ZW5jZSkgKGFwcGx5IGlkZW50aXR5LXNldCAoaW50byAodmVjIHNlcXVlbmNlKSBpdGVtcykpXG4gICAgICAgIDplbHNlICh0aHJvdyAoVHlwZUVycm9yIChzdHIgXCJUeXBlIGNhbid0IGJlIGNvbmpvaW5lZCBcIiBzZXF1ZW5jZSkpKSkpXG5cbihkZWZuIGRpc2pcbiAgW2NvbGwgJiBrc11cbiAgKGxldCBbcHJlZGljYXRlIChjb21wbGVtZW50IChhcHBseSBpZGVudGl0eS1zZXQga3MpKV1cbiAgICAoY29uZCAoZW1wdHk/IGtzKSAgICAgICAgY29sbFxuICAgICAgICAgIChzZXQ/IGNvbGwpICAgICAgICAoYXBwbHkgaWRlbnRpdHktc2V0IChmaWx0ZXJ2IHByZWRpY2F0ZSBjb2xsKSlcbiAgICAgICAgICAoZGljdGlvbmFyeT8gY29sbCkgKGludG8ge30gKGZpbHRlciAjKHByZWRpY2F0ZSAoZmlyc3QgJSkpIGNvbGwpKVxuICAgICAgICAgIDplbHNlICAgICAgICAgICAgICAodGhyb3cgKFR5cGVFcnJvciAoc3RyIFwiVHlwZSBjYW4ndCBiZSBkaXNqb2luZWQgXCIgY29sbCkpKSkpKVxuXG4oZGVmbiBpbnRvXG4gIFt0byBmcm9tXVxuICAoYXBwbHkgY29uaiB0byAodmVjIGZyb20pKSlcblxuKGRlZm4gemlwbWFwIFtrZXlzIHZhbHNdXG4gIChpbnRvIHt9IChtYXAgdmVjdG9yIGtleXMgdmFscykpKVxuXG4oZGVmbiBhc3NvY1xuICBbc291cmNlICYga2V5LXZhbHVlc11cbiAgOyhhc3NlcnQgKGV2ZW4/IChjb3VudCBrZXktdmFsdWVzKSkgXCJXcm9uZyBudW1iZXIgb2YgYXJndW1lbnRzXCIpXG4gIDsoYXNzZXJ0IChhbmQgKG5vdCAoc2VxPyBzb3VyY2UpKVxuICA7ICAgICAgICAgICAgIChub3QgKHZlY3Rvcj8gc291cmNlKSlcbiAgOyAgICAgICAgICAgICAob2JqZWN0PyBzb3VyY2UpKSBcIkNhbiBvbmx5IGFzc29jIG9uIGRpY3Rpb25hcmllc1wiKVxuICAoY29uaiBzb3VyY2UgKGFwcGx5IGRpY3Rpb25hcnkga2V5LXZhbHVlcykpKVxuXG4oZGVmbiBkaXNzb2NcbiAgW2NvbGwgJiBrc11cbiAgKGlmIChkaWN0aW9uYXJ5PyBjb2xsKVxuICAgIChhcHBseSBkaXNqIGNvbGwga3MpXG4gICAgKHRocm93IChUeXBlRXJyb3IgKHN0ciBcIkNhbiBvbmx5IGRpc3NvYyBvbiBkaWN0aW9uYXJpZXNcIikpKSkpXG5cbihkZWZuIGNvbmNhdFxuICBcIlJldHVybnMgbGlzdCByZXByZXNlbnRpbmcgdGhlIGNvbmNhdGVuYXRpb24gb2YgdGhlIGVsZW1lbnRzIGluIHRoZVxuICBzdXBwbGllZCBsaXN0cy5cIlxuICBbJiBzZXF1ZW5jZXNdXG4gIChyZWR1Y2UgIyhjb25qLWxpc3QgJTEgKHJldmVyc2UgJTIpKVxuICAgICAgICAgIChsZXQgW3RhaWwgKGxhc3Qgc2VxdWVuY2VzKV1cbiAgICAgICAgICAgIChpZiAobGF6eS1zZXE/IHRhaWwpIHRhaWwgKGFwcGx5IGxpc3QgKHZlYyB0YWlsKSkpKVxuICAgICAgICAgIChyZXN0IChyZXZlcnNlIHNlcXVlbmNlcykpKSlcblxuKGRlZm4gbWFwY2F0IFtmICYgY29sbHNdXG4gIChhcHBseSBjb25jYXQgKGFwcGx5IG1hcHYgZiBjb2xscykpKVxuXG4oZGVmbiBlbXB0eVxuICBcIlByb2R1Y2VzIGVtcHR5IHNlcXVlbmNlIG9mIHRoZSBzYW1lIHR5cGUgYXMgYXJndW1lbnQuXCJcbiAgW3NlcXVlbmNlXVxuICAoY29uZCAobGlzdD8gc2VxdWVuY2UpICAgICAgICcoKVxuICAgICAgICAodmVjdG9yPyBzZXF1ZW5jZSkgICAgIFtdXG4gICAgICAgIChzdHJpbmc/IHNlcXVlbmNlKSAgICAgXCJcIlxuICAgICAgICAoZGljdGlvbmFyeT8gc2VxdWVuY2UpIHt9XG4gICAgICAgIChzZXQ/IHNlcXVlbmNlKSAgICAgICAgI3t9XG4gICAgICAgIChsYXp5LXNlcT8gc2VxdWVuY2UpICAgKGxhenktc2VxKSkpXG5cbihkZWZuIHNlcSBbc2VxdWVuY2VdXG4gIChjb25kIChuaWw/IHNlcXVlbmNlKSBuaWxcbiAgICAgICAgKG9yICh2ZWN0b3I/IHNlcXVlbmNlKSAoc2VxPyBzZXF1ZW5jZSkpIHNlcXVlbmNlXG4gICAgICAgIChzdHJpbmc/IHNlcXVlbmNlKSAoLmNhbGwgQXJyYXkucHJvdG90eXBlLnNsaWNlIHNlcXVlbmNlKVxuICAgICAgICAoZGljdGlvbmFyeT8gc2VxdWVuY2UpIChrZXktdmFsdWVzIHNlcXVlbmNlKVxuICAgICAgICAoaXRlcmFibGU/IHNlcXVlbmNlKSAoaXRlcmF0b3ItPmxzZXEgKChnZXQgc2VxdWVuY2UgU3ltYm9sLml0ZXJhdG9yKSkpXG4gICAgICAgIDpkZWZhdWx0ICh0aHJvdyAoVHlwZUVycm9yIChzdHIgXCJDYW4gbm90IHNlcSBcIiBzZXF1ZW5jZSkpKSkpXG5cbihkZWZuIHNlcSogW3NlcXVlbmNlXVxuICAobGV0IFtpdCAoc2VxIHNlcXVlbmNlKV1cbiAgICAoaWYgKGVtcHR5PyBpdCkgbmlsIGl0KSkpXG5cbihkZWZuIHNlcT8gW3NlcXVlbmNlXVxuICAob3IgKGxpc3Q/IHNlcXVlbmNlKVxuICAgICAgKGxhenktc2VxPyBzZXF1ZW5jZSkpKVxuXG4oZGVmbi0gaXRlcmF0b3ItPmxzZXEgW2l0ZXJhdG9yXVxuICAodW5mb2xkICMobGV0IFt4ICgubmV4dCAlKV1cbiAgICAgICAgICAgICAoaWYgKC4tZG9uZSB4KSBuaWwgWyguLXZhbHVlIHgpICVdKSlcbiAgICAgICAgICBpdGVyYXRvcikpXG5cbihkZWZuIHZlY1xuICBcIkNyZWF0ZXMgYSBuZXcgdmVjdG9yIGNvbnRhaW5pbmcgdGhlIGNvbnRlbnRzIG9mIHNlcXVlbmNlXCJcbiAgW3NlcXVlbmNlXVxuICAoY29uZCAobmlsPyBzZXF1ZW5jZSkgW11cbiAgICAgICAgKG9yICh2ZWN0b3I/IHNlcXVlbmNlKSAobGlzdD8gc2VxdWVuY2UpKSAoQXJyYXkuZnJvbSBzZXF1ZW5jZSlcbiAgICAgICAgKGxhenktc2VxPyBzZXF1ZW5jZSkgKGxldCBbeHMgKEFycmF5LmZyb20gc2VxdWVuY2UpXSAgICAgICAgICAgIDsgb3B0aW1pemluZyBjb3VudFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChzZXQhICguLWxlbmd0aCBzZXF1ZW5jZSkgKC4tbGVuZ3RoIHhzKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4cylcbiAgICAgICAgOmVsc2UgKHZlYyAoc2VxIHNlcXVlbmNlKSkpKVxuXG4oZGVmbiB2ZWN0b3IgWyYgc2VxdWVuY2VdIHNlcXVlbmNlKVxuXG4oZGVmIF57OnByaXZhdGUgdHJ1ZX1cbiAgc29ydC1jb21wYXJhdG9yXG4gIChpZiAoPSBbMSAyIDNdICguc29ydCBbMiAxIDNdIChmbiBbYSBiXSAoaWYgKDwgYSBiKSAwIDEpKSkpXG4gICAgIyhmbiBbYSBiXSAoaWYgKCUgYiBhKSAgMSAwKSkgICAgICAgOyBxdWlja3NvcnQgKENocm9tZSwgTm9kZSksIG1lcmdlc29ydCAoRmlyZWZveClcbiAgICAjKGZuIFthIGJdIChpZiAoJSBhIGIpIC0xIDApKSkpICAgICA7IHRpbXNvcnQgKENocm9tZSA3MCssIE5vZGUgMTErKVxuXG4oZGVmbiBzb3J0XG4gIFwiUmV0dXJucyBhIHNvcnRlZCBzZXF1ZW5jZSBvZiB0aGUgaXRlbXMgaW4gY29sbC5cbiAgSWYgbm8gY29tcGFyYXRvciBpcyBzdXBwbGllZCwgdXNlcyBjb21wYXJlLlwiXG4gIFtmIGl0ZW1zXVxuICAobGV0IFtoYXMtY29tcGFyYXRvciAoZm4/IGYpXG4gICAgICAgIGl0ZW1zICAgICAgICAgIChpZiAoYW5kIChub3QgaGFzLWNvbXBhcmF0b3IpIChuaWw/IGl0ZW1zKSkgZiBpdGVtcylcbiAgICAgICAgY29tcGFyZSAgICAgICAgKGlmIGhhcy1jb21wYXJhdG9yIChzb3J0LWNvbXBhcmF0b3IgZikpXG4gICAgICAgIHJlc3VsdCAgICAgICAgICguc29ydCAodmVjIGl0ZW1zKSBjb21wYXJlKV1cbiAgICAoY29uZCAobmlsPyBpdGVtcykgICAgJygpXG4gICAgICAgICAgKHZlY3Rvcj8gaXRlbXMpIHJlc3VsdFxuICAgICAgICAgIDplbHNlICAgICAgICAgICAoYXBwbHkgbGlzdCByZXN1bHQpKSkpXG5cblxuKGRlZm4gcmVwZWF0ZWRseVxuICBcIlRha2VzIGEgZnVuY3Rpb24gb2Ygbm8gYXJncywgcHJlc3VtYWJseSB3aXRoIHNpZGUgZWZmZWN0cywgYW5kXG4gIHJldHVybnMgdmVjdG9yIG9mIGdpdmVuIGBuYCBsZW5ndGggd2l0aCBjYWxscyB0byBpdFwiXG4gIFtuIGZdXG4gIDs7IHdyYXAgc28gQXJyYXkuZnJvbSdzIChpdGVtLCBpbmRleCkgY2FsbGJhY2sgYXJncyBuZXZlciByZWFjaCBmXG4gIChBcnJheS5mcm9tIHs6bGVuZ3RoIG59IChmbiBbXSAoZikpKSlcblxuKGRlZm4gcmVwZWF0XG4gIFwiUmV0dXJucyBhIHZlY3RvciBvZiBnaXZlbiBgbmAgbGVuZ3RoIHdpdGggZ2l2ZW4gYHhgXG4gIGl0ZW1zLiBOb3QgY29tcGF0aWJsZSB3aXRoIGNsb2p1cmUgYXMgaXQncyBub3QgYSBsYXp5XG4gIGFuZCBvbmx5IGZpbml0ZSByZXBlYXRzIGFyZSBzdXBwb3J0ZWRcIlxuICBbbiB4XVxuICAocmVwZWF0ZWRseSBuIChmbiBbXSB4KSkpXG5cblxuKGRlZm4gZXZlcnk/XG4gIFtwcmVkaWNhdGUgc2VxdWVuY2VdXG4gICguZXZlcnkgKHZlYyBzZXF1ZW5jZSkgIyhwcmVkaWNhdGUgJSkpKVxuXG4oZGVmbiBzb21lXG4gIFwiUmV0dXJucyB0aGUgZmlyc3QgbG9naWNhbCB0cnVlIHZhbHVlIG9mIChwcmVkIHgpIGZvciBhbnkgeCBpbiBjb2xsLFxuICBlbHNlIG5pbC4gIE9uZSBjb21tb24gaWRpb20gaXMgdG8gdXNlIGEgc2V0IGFzIHByZWQsIGZvciBleGFtcGxlXG4gIHRoaXMgd2lsbCByZXR1cm4gOmZyZWQgaWYgOmZyZWQgaXMgaW4gdGhlIHNlcXVlbmNlLCBvdGhlcndpc2UgbmlsOlxuICAoc29tZSAjezpmcmVkfSBjb2xsKVwiXG4gIFtwcmVkIGNvbGxdXG4gIChsb29wIFtpdGVtcyAoc2VxIGNvbGwpXVxuICAgIChpZiAoZW1wdHk/IGl0ZW1zKSBuaWxcbiAgICAgIChvciAocHJlZCAoZmlyc3QgaXRlbXMpKSAocmVjdXIgKHJlc3QgaXRlbXMpKSkpKSlcblxuXG4oZGVmbiBwYXJ0aXRpb25cbiAgKFtuIGNvbGxdIChwYXJ0aXRpb24gbiBuIGNvbGwpKVxuICAoW24gc3RlcCBjb2xsXSAocGFydGl0aW9uIG4gc3RlcCBbXSBjb2xsKSlcbiAgKFtuIHN0ZXAgcGFkIGNvbGxdXG4gICAobG9vcCBbcmVzdWx0IFtdXG4gICAgICAgICAgaXRlbXMgKHNlcSBjb2xsKV1cbiAgICAgKGxldCBbY2h1bmsgKHRha2UgbiBpdGVtcylcbiAgICAgICAgICAgc2l6ZSAoY291bnQgY2h1bmspXVxuICAgICAgIChjb25kIChpZGVudGljYWw/IHNpemUgbikgKHJlY3VyIChjb25qIHJlc3VsdCBjaHVuaylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZHJvcCBzdGVwIGl0ZW1zKSlcbiAgICAgICAgICAgICAoaWRlbnRpY2FsPyAwIHNpemUpIHJlc3VsdFxuICAgICAgICAgICAgICg+IG4gKCsgc2l6ZSAoY291bnQgcGFkKSkpIHJlc3VsdFxuICAgICAgICAgICAgIDplbHNlIChjb25qIHJlc3VsdFxuICAgICAgICAgICAgICAgICAgICAgICAgICh0YWtlIG4gKHZlYyAoY29uY2F0IGNodW5rXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFkKSkpKSkpKSkpXG5cbihkZWZuIGludGVybGVhdmUgWyYgc2VxdWVuY2VzXVxuICAoaWYgKGVtcHR5PyBzZXF1ZW5jZXMpXG4gICAgW11cbiAgICAobG9vcCBbcmVzdWx0IFtdXG4gICAgICAgICAgIHNlcXVlbmNlcyBzZXF1ZW5jZXNdXG4gICAgICAoaWYgKHNvbWUgZW1wdHk/IHNlcXVlbmNlcylcbiAgICAgICAgKHZlYyByZXN1bHQpXG4gICAgICAgIChyZWN1ciAoY29uY2F0IHJlc3VsdCAobWFwIGZpcnN0IHNlcXVlbmNlcykpXG4gICAgICAgICAgICAgICAobWFwIHJlc3Qgc2VxdWVuY2VzKSkpKSkpXG5cbihkZWZuIG50aFxuICBcIlJldHVybnMgbnRoIGl0ZW0gb2YgdGhlIHNlcXVlbmNlXCJcbiAgW3NlcXVlbmNlIGluZGV4IG5vdC1mb3VuZF1cbiAgKGxldCBbc2VxdWVuY2UgKHNlcSogc2VxdWVuY2UpXVxuICAgIChjb25kIChuaWw/IHNlcXVlbmNlKSBub3QtZm91bmRcbiAgICAgICAgICAoc2VxPyBzZXF1ZW5jZSkgKGlmLWxldCBbaXQgKHNlcSogKGRyb3AgaW5kZXggc2VxdWVuY2UpKV1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZmlyc3QgaXQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbm90LWZvdW5kKVxuICAgICAgICAgIChvciAodmVjdG9yPyBzZXF1ZW5jZSlcbiAgICAgICAgICAgICAgKHN0cmluZz8gc2VxdWVuY2UpKSAoaWYgKDwgaW5kZXggKGNvdW50IHNlcXVlbmNlKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChhZ2V0IHNlcXVlbmNlIGluZGV4KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm90LWZvdW5kKVxuICAgICAgICAgIDplbHNlICh0aHJvdyAoVHlwZUVycm9yIFwiVW5zdXBwb3J0ZWQgdHlwZVwiKSkpKSlcblxuXG4oZGVmbiBjb250YWlucz9cbiAgXCJSZXR1cm5zIHRydWUgaWYga2V5IGlzIHByZXNlbnQgaW4gdGhlIGdpdmVuIGNvbGxlY3Rpb24sIG90aGVyd2lzZVxuICByZXR1cm5zIGZhbHNlLiAgTm90ZSB0aGF0IGZvciBudW1lcmljYWxseSBpbmRleGVkIGNvbGxlY3Rpb25zIGxpa2VcbiAgdmVjdG9ycyBhbmQgc3RyaW5ncywgdGhpcyB0ZXN0cyBpZiB0aGUgbnVtZXJpYyBrZXkgaXMgd2l0aGluIHRoZVxuICByYW5nZSBvZiBpbmRleGVzLiAnY29udGFpbnM/JyBvcGVyYXRlcyBjb25zdGFudCBvciBsb2dhcml0aG1pYyB0aW1lO1xuICBpdCB3aWxsIG5vdCBwZXJmb3JtIGEgbGluZWFyIHNlYXJjaCBmb3IgYSB2YWx1ZS4gIFNlZSBhbHNvICdzb21lJy5cIlxuICBbY29sbCB2XVxuICAoY29uZCAoc2V0PyBjb2xsKSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoLmhhcyBjb2xsIHYpXG4gICAgICAgIChvciAoZGljdGlvbmFyeT8gY29sbCkgKHZlY3Rvcj8gY29sbCkgKHN0cmluZz8gY29sbCkpICguaGFzLW93bi1wcm9wZXJ0eSBjb2xsIHYpXG4gICAgICAgIDplbHNlICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhbHNlKSlcblxuKGRlZm4gdW5pb25cbiAgXCJSZXR1cm4gYSBzZXQgdGhhdCBpcyB0aGUgdW5pb24gb2YgdGhlIGlucHV0IHNldHNcIlxuICBbJiBzZXRzXVxuICAoaW50byAje30gKGFwcGx5IGNvbmNhdCBzZXRzKSkpXG5cbihkZWZuIGRpZmZlcmVuY2VcbiAgXCJSZXR1cm4gYSBzZXQgdGhhdCBpcyB0aGUgZmlyc3Qgc2V0IHdpdGhvdXQgZWxlbWVudHMgb2YgdGhlIHJlbWFpbmluZyBzZXRzXCJcbiAgW3MxICYgc2V0c11cbiAgKGludG8gI3t9IChmaWx0ZXIgKGNvbXBsZW1lbnQgKGFwcGx5IHVuaW9uIHNldHMpKVxuICAgICAgICAgICAgICAgICAgICBzMSkpKVxuXG4oZGVmbiBpbnRlcnNlY3Rpb25cbiAgXCJSZXR1cm4gYSBzZXQgdGhhdCBpcyB0aGUgaW50ZXJzZWN0aW9uIG9mIHRoZSBpbnB1dCBzZXRzXCJcbiAgWyYgc2V0c11cbiAgKGxldCBbc2V0cyAgICAgKG1hcHYgIyhpbnRvICN7fSAlKSBzZXRzKVxuICAgICAgICBpbi1lYWNoPyAoZm4gW3hdIChldmVyeT8gIyguaGFzICUgeCkgc2V0cykpXG4gICAgICAgIG1pbi1zaXplIChhcHBseSBtaW4gKG1hcHYgY291bnQgc2V0cykpXG4gICAgICAgIHNtYWxsZXN0ICguZmluZCBzZXRzICMoPSBtaW4tc2l6ZSAoY291bnQgJSkpKV1cbiAgICAoaW50byAje30gKGZpbHRlciBpbi1lYWNoPyBzbWFsbGVzdCkpKSlcblxuKGRlZm4gc3Vic2V0P1xuICBcIklzIHNldDEgYSBzdWJzZXQgb2Ygc2V0Mj9cIlxuICBbc2V0MSBzZXQyXVxuICAoaWYgKHNldD8gc2V0MilcbiAgICAoZXZlcnk/ICMoLmhhcyBzZXQyICUpIHNldDEpXG4gICAgKHN1YnNldD8gc2V0MSAoaW50byAje30gc2V0MikpKSlcblxuKGRlZm4gc3VwZXJzZXQ/XG4gIFwiSXMgc2V0MSBhIHN1cGVyc2V0IG9mIHNldDI/XCJcbiAgW3NldDEgc2V0Ml1cbiAgKHN1YnNldD8gc2V0MiBzZXQxKSlcblxuXG4oZGVmbiB1bmZvbGRcbiAgXCJSZXR1cm5zIGEgbGF6eSBzZXF1ZW5jZTsgKGYgeCkgaXMgZXhwZWN0ZWQgdG8gcmV0dXJuIGVpdGhlciBuaWwgKHNpZ25pZnlpbmcgZW5kIG9mIHNlcXVlbmNlKVxuICBvciBbeSB4MV0gKHdoZXJlIHkgaXMgbmV4dCBzZXF1ZW5jZSBpdGVtLCBhbmQgeDEgaXMgbmV4dCB2YWx1ZSBvZiB4KVwiXG4gIFtmIHhdXG4gIChsYXp5LXNlcSAoaWYtbGV0IFtuZXh0IChmIHgpXVxuICAgICAgICAgICAgICAoY29ucyAoZmlyc3QgbmV4dCkgKHVuZm9sZCBmIChzZWNvbmQgbmV4dCkpKSkpKVxuXG4oZGVmbiBpdGVyYXRlXG4gIFwiUmV0dXJucyBhIGxhenkgc2VxdWVuY2Ugb2YgeCwgKGYgeCksIChmIChmIHgpKSBldGMuIGYgbXVzdCBiZSBmcmVlIG9mIHNpZGUtZWZmZWN0c1wiXG4gIFtmIHhdXG4gIChsYXp5LXNlcSAoY29ucyB4IChpdGVyYXRlIGYgKGYgeCkpKSkpXG5cbihkZWZuIGN5Y2xlXG4gIFwiUmV0dXJucyBhIGxhenkgKGluZmluaXRlISkgc2VxdWVuY2Ugb2YgcmVwZXRpdGlvbnMgb2YgdGhlIGl0ZW1zIGluIGNvbGwuXCJcbiAgW2NvbGxdXG4gIChsYXp5LXNlcSAoaWYgKGVtcHR5PyBjb2xsKVxuICAgICAgICAgICAgICBuaWxcbiAgICAgICAgICAgICAgKGNvbmNhdCBjb2xsIChjeWNsZSBjb2xsKSkpKSlcblxuKGRlZm4gaW5maW5pdGUtcmFuZ2VcbiAgKFtdIChpbmZpbml0ZS1yYW5nZSAwKSlcbiAgKFtuXSAoaXRlcmF0ZSBpbmMgbikpXG4gIChbbiBzdGVwXSAoaXRlcmF0ZSAjKCsgJSBzdGVwKSBuKSkpXG5cbihkZWZuIGxhenktbWFwIFtmICYgc2VxdWVuY2VzXVxuICAodW5mb2xkICMoaWYgKHNvbWUgZW1wdHk/ICUpXG4gICAgICAgICAgICAgbmlsXG4gICAgICAgICAgICAgWyhhcHBseSBmIChtYXB2IGZpcnN0ICUpKSAobWFwdiByZXN0ICUpXSlcbiAgICAgICAgICBzZXF1ZW5jZXMpKVxuXG4oZGVmbiBsYXp5LWZpbHRlciBbZiBzZXF1ZW5jZV1cbiAgKHVuZm9sZCAjKGxvb3AgW3hzICVdXG4gICAgICAgICAgICAgKGNvbmQgKGVtcHR5PyB4cykgICAgbmlsXG4gICAgICAgICAgICAgICAgICAgKGYgKGZpcnN0IHhzKSkgWyhmaXJzdCB4cykgKHJlc3QgeHMpXVxuICAgICAgICAgICAgICAgICAgIDplbHNlICAgICAgICAgIChyZWN1ciAocmVzdCB4cykpKSlcbiAgICAgICAgICAoc2VxIHNlcXVlbmNlKSkpXG5cbihkZWZuIGxhenktY29uY2F0IFsmIHNlcXVlbmNlc11cbiAgKGlmIChlbXB0eT8gc2VxdWVuY2VzKVxuICAgIG5pbFxuICAgICgoZm4gaXRlciBbeHNdXG4gICAgICAgKGxhenktc2VxIChpZiAoZW1wdHk/IHhzKVxuICAgICAgICAgICAgICAgICAgIChhcHBseSBsYXp5LWNvbmNhdCAocmVzdCBzZXF1ZW5jZXMpKVxuICAgICAgICAgICAgICAgICAgIChjb25zIChmaXJzdCB4cykgKGl0ZXIgKHJlc3QgeHMpKSkpKSlcbiAgICAgKHNlcSAoZmlyc3Qgc2VxdWVuY2VzKSkpKSlcblxuKGRlZm4gbGF6eS1wYXJ0aXRpb25cbiAgKFtuIGNvbGxdIChsYXp5LXBhcnRpdGlvbiBuIG4gY29sbCkpXG4gIChbbiBzdGVwIGNvbGxdIChsYXp5LXBhcnRpdGlvbiBuIHN0ZXAgW10gY29sbCkpXG4gIChbbiBzdGVwIHBhZCBjb2xsXVxuICAgICh1bmZvbGQgIyhsZXQgW2NodW5rICh0YWtlIG4gKGNvbmNhdCAodGFrZSBuICUpIHBhZCkpXVxuICAgICAgICAgICAgICAgKGlmIChhbmQgKG5vdCAoZW1wdHk/ICUpKSAoaWRlbnRpY2FsPyBuIChjb3VudCBjaHVuaykpKVxuICAgICAgICAgICAgICAgICBbY2h1bmsgKGRyb3Agc3RlcCAlKV0pKVxuICAgICAgICAgICAgY29sbCkpKVxuXG5cbihkZWZuIHJ1biFcbiAgXCJSdW5zIHRoZSBzdXBwbGllZCBwcm9jZWR1cmUgKHZpYSByZWR1Y2UpLCBmb3IgcHVycG9zZXMgb2Ygc2lkZVxuICBlZmZlY3RzLCBvbiBzdWNjZXNzaXZlIGl0ZW1zIGluIHRoZSBjb2xsZWN0aW9uLiBSZXR1cm5zIG5pbFwiXG4gIFtwcm9jIGNvbGxdXG4gIChyZWR1Y2UgKGZuIFtfIHhdIChwcm9jIHgpIG5pbCkgbmlsIGNvbGwpKVxuXG4oZGVmbiBkb3J1blxuICBcIldoZW4gbGF6eSBzZXF1ZW5jZXMgYXJlIHByb2R1Y2VkIHZpYSBmdW5jdGlvbnMgdGhhdCBoYXZlIHNpZGVcbiAgZWZmZWN0cywgYW55IGVmZmVjdHMgb3RoZXIgdGhhbiB0aG9zZSBuZWVkZWQgdG8gcHJvZHVjZSB0aGUgZmlyc3RcbiAgZWxlbWVudCBpbiB0aGUgc2VxIGRvIG5vdCBvY2N1ciB1bnRpbCB0aGUgc2VxIGlzIGNvbnN1bWVkLiBkb3J1biBjYW5cbiAgYmUgdXNlZCB0byBmb3JjZSBhbnkgZWZmZWN0cy4gV2Fsa3MgdGhyb3VnaCB0aGUgc3VjY2Vzc2l2ZSBuZXh0cyBvZlxuICB0aGUgc2VxLCBkb2VzIG5vdCByZXRhaW4gdGhlIGhlYWQgYW5kIHJldHVybnMgbmlsLlwiXG4gIChbY29sbF0gKGRvcnVuIEluZmluaXR5IGNvbGwpKVxuICAoW24gY29sbF0gKHJ1biEgaWRlbnRpdHkgKHRha2UgbiBjb2xsKSkpKVxuXG4oZGVmbiBkb2FsbFxuICBcIldoZW4gbGF6eSBzZXF1ZW5jZXMgYXJlIHByb2R1Y2VkIHZpYSBmdW5jdGlvbnMgdGhhdCBoYXZlIHNpZGVcbiAgZWZmZWN0cywgYW55IGVmZmVjdHMgb3RoZXIgdGhhbiB0aG9zZSBuZWVkZWQgdG8gcHJvZHVjZSB0aGUgZmlyc3RcbiAgZWxlbWVudCBpbiB0aGUgc2VxIGRvIG5vdCBvY2N1ciB1bnRpbCB0aGUgc2VxIGlzIGNvbnN1bWVkLiBkb3J1biBjYW5cbiAgYmUgdXNlZCB0byBmb3JjZSBhbnkgZWZmZWN0cy4gV2Fsa3MgdGhyb3VnaCB0aGUgc3VjY2Vzc2l2ZSBuZXh0cyBvZlxuICB0aGUgc2VxLCByZXRhaW5zIHRoZSBoZWFkIGFuZCByZXR1cm5zIGl0LCB0aHVzIGNhdXNpbmcgdGhlIGVudGlyZVxuICBzZXEgdG8gcmVzaWRlIGluIG1lbW9yeSBhdCBvbmUgdGltZS5cIlxuICAoW2NvbGxdIChkb2FsbCBJbmZpbml0eSBjb2xsKSlcbiAgKFtuIGNvbGxdIChkb3J1biBuIGNvbGwpIGNvbGwpKVxuIl19
