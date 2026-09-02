{
    var _ns_ = {
            id: 'wisp.expander',
            doc: 'wisp syntax and macro expander module'
        };
    var wisp_ast = require('./ast');
    var meta = wisp_ast.meta;
    var withMeta = wisp_ast.withMeta;
    var isSymbol = wisp_ast.isSymbol;
    var isKeyword = wisp_ast.isKeyword;
    var keyword = wisp_ast.keyword;
    var isQuote = wisp_ast.isQuote;
    var symbol = wisp_ast.symbol;
    var namespace = wisp_ast.namespace;
    var name = wisp_ast.name;
    var gensym = wisp_ast.gensym;
    var isUnquote = wisp_ast.isUnquote;
    var isUnquoteSplicing = wisp_ast.isUnquoteSplicing;
    var wisp_sequence = require('./sequence');
    var isList = wisp_sequence.isList;
    var list = wisp_sequence.list;
    var conj = wisp_sequence.conj;
    var partition = wisp_sequence.partition;
    var seq = wisp_sequence.seq;
    var repeatedly = wisp_sequence.repeatedly;
    var isEmpty = wisp_sequence.isEmpty;
    var map = wisp_sequence.map;
    var mapv = wisp_sequence.mapv;
    var vec = wisp_sequence.vec;
    var set = wisp_sequence.set;
    var isEvery = wisp_sequence.isEvery;
    var concat = wisp_sequence.concat;
    var first = wisp_sequence.first;
    var second = wisp_sequence.second;
    var third = wisp_sequence.third;
    var rest = wisp_sequence.rest;
    var last = wisp_sequence.last;
    var mapcat = wisp_sequence.mapcat;
    var nth = wisp_sequence.nth;
    var butlast = wisp_sequence.butlast;
    var interleave = wisp_sequence.interleave;
    var cons = wisp_sequence.cons;
    var count = wisp_sequence.count;
    var take = wisp_sequence.take;
    var dissoc = wisp_sequence.dissoc;
    var some = wisp_sequence.some;
    var assoc = wisp_sequence.assoc;
    var reduce = wisp_sequence.reduce;
    var filter = wisp_sequence.filter;
    var isSeq = wisp_sequence.isSeq;
    var zipmap = wisp_sequence.zipmap;
    var drop = wisp_sequence.drop;
    var lazySeq = wisp_sequence.lazySeq;
    var range = wisp_sequence.range;
    var reverse = wisp_sequence.reverse;
    var dorun = wisp_sequence.dorun;
    var mapIndexed = wisp_sequence.mapIndexed;
    var wisp_runtime = require('./runtime');
    var isNil = wisp_runtime.isNil;
    var isDictionary = wisp_runtime.isDictionary;
    var isVector = wisp_runtime.isVector;
    var keys = wisp_runtime.keys;
    var get = wisp_runtime.get;
    var vals = wisp_runtime.vals;
    var isString = wisp_runtime.isString;
    var isNumber = wisp_runtime.isNumber;
    var isBoolean = wisp_runtime.isBoolean;
    var isDate = wisp_runtime.isDate;
    var isRePattern = wisp_runtime.isRePattern;
    var isEven = wisp_runtime.isEven;
    var isOdd = wisp_runtime.isOdd;
    var isEqual = wisp_runtime.isEqual;
    var max = wisp_runtime.max;
    var inc = wisp_runtime.inc;
    var dec = wisp_runtime.dec;
    var dictionary = wisp_runtime.dictionary;
    var merge = wisp_runtime.merge;
    var subs = wisp_runtime.subs;
    var wisp_string = require('./string');
    var split = wisp_string.split;
    var join = wisp_string.join;
    var capitalize = wisp_string.capitalize;
}
var __macros__ = exports.__macros__ = {};
var expand = function expand(expander, form, env) {
    return function () {
        var metadataø1 = meta(form) || {};
        var parmasø1 = rest(form);
        var implicitø1 = map(function ($1) {
                return isEqual('&form', $1) ? form : isEqual('&env', $1) ? env : 'else' ? $1 : void 0;
            }, (meta(expander) || 0)['implicit'] || []);
        var paramsø1 = vec(concat(implicitø1, vec(rest(form))));
        var expansionø1 = expander.apply(void 0, paramsø1);
        return expansionø1 ? withMeta(expansionø1, conj(metadataø1, meta(expansionø1))) : expansionø1;
    }.call(this);
};
var installMacro = exports.installMacro = function installMacro(op, expander) {
        return (__macros__ || 0)[name(op)] = expander;
    };
var macro = function macro(op) {
    return isSymbol(op) && (__macros__ || 0)[name(op)];
};
var isDotSyntax = exports.isDotSyntax = function isDotSyntax(op) {
        return isSymbol(op) && '.' === name(op);
    };
var isMethodSyntax = exports.isMethodSyntax = function isMethodSyntax(op) {
        return function () {
            var idø1 = isSymbol(op) && name(op);
            return idø1 && '.' === first(idø1) && !('-' === second(idø1)) && !('.' === idø1);
        }.call(this);
    };
var isFieldSyntax = exports.isFieldSyntax = function isFieldSyntax(op) {
        return function () {
            var idø1 = isSymbol(op) && name(op);
            return idø1 && '.' === first(idø1) && '-' === second(idø1);
        }.call(this);
    };
var isNewSyntax = exports.isNewSyntax = function isNewSyntax(op) {
        return function () {
            var idø1 = isSymbol(op) && name(op);
            return idø1 && '.' === last(idø1) && !('.' === idø1);
        }.call(this);
    };
var methodSyntax = exports.methodSyntax = function methodSyntax(op, target) {
        var params = Array.prototype.slice.call(arguments, 2);
        return function () {
            var opMetaø1 = meta(op);
            var formStartø1 = (opMetaø1 || 0)['start'];
            var targetMetaø1 = meta(target);
            var memberø1 = withMeta(symbol(subs(name(op), 1)), conj(opMetaø1, {
                    'start': {
                        'line': (formStartø1 || 0)['line'],
                        'column': inc((formStartø1 || 0)['column'])
                    }
                }));
            var agetø1 = withMeta(symbol(void 0, 'aget'), conj(opMetaø1, {
                    'end': {
                        'line': (formStartø1 || 0)['line'],
                        'column': inc((formStartø1 || 0)['column'])
                    }
                }));
            var methodø1 = withMeta(list.apply(void 0, [agetø1].concat([target], [list.apply(void 0, [symbol(void 0, 'quote')].concat([memberø1]))])), conj(opMetaø1, { 'end': (meta(target) || 0)['end'] }));
            return isNil(target) ? (function () {
                throw Error('Malformed method expression, expecting (.method object ...)');
            })() : list.apply(void 0, [methodø1].concat(vec(params)));
        }.call(this);
    };
var fieldSyntax = exports.fieldSyntax = function fieldSyntax(field, target) {
        var more = Array.prototype.slice.call(arguments, 2);
        return function () {
            var metadataø1 = meta(field);
            var startø1 = (metadataø1 || 0)['start'];
            var endø1 = (metadataø1 || 0)['end'];
            var memberø1 = withMeta(symbol(subs(name(field), 2)), conj(metadataø1, {
                    'start': {
                        'line': (startø1 || 0)['line'],
                        'column': (startø1 || 0)['column'] + 2
                    }
                }));
            return isNil(target) || count(more) ? (function () {
                throw Error('Malformed member expression, expecting (.-member target)');
            })() : list.apply(void 0, [symbol(void 0, 'aget')].concat([target], [list.apply(void 0, [symbol(void 0, 'quote')].concat([memberø1]))]));
        }.call(this);
    };
var dotSyntax = exports.dotSyntax = function dotSyntax(op, target, field) {
        var params = Array.prototype.slice.call(arguments, 3);
        !isSymbol(field) ? (function () {
            throw Error('Malformed . form');
        })() : void 0;
        return function () {
            var _fieldø1 = name(field);
            return ('-' === first(_fieldø1) ? fieldSyntax : methodSyntax).apply(void 0, [
                symbol('' + '.' + _fieldø1),
                target
            ].concat(params));
        }.call(this);
    };
var newSyntax = exports.newSyntax = function newSyntax(op) {
        var params = Array.prototype.slice.call(arguments, 1);
        return function () {
            var idø1 = name(op);
            var idMetaø1 = (idø1 || 0)['meta'];
            var renameø1 = subs(idø1, 0, dec(count(idø1)));
            var constructorø1 = withMeta(symbol(renameø1), conj(idMetaø1, {
                    'end': {
                        'line': ((idMetaø1 || 0)['end'] || 0)['line'],
                        'column': dec(((idMetaø1 || 0)['end'] || 0)['column'])
                    }
                }));
            var operatorø1 = withMeta(symbol(void 0, 'new'), conj(idMetaø1, {
                    'start': {
                        'line': ((idMetaø1 || 0)['end'] || 0)['line'],
                        'column': dec(((idMetaø1 || 0)['end'] || 0)['column'])
                    }
                }));
            return list.apply(void 0, [symbol(void 0, 'new')].concat([constructorø1], vec(params)));
        }.call(this);
    };
var keywordInvoke = exports.keywordInvoke = function keywordInvoke() {
        switch (arguments.length) {
        case 2:
            var keyword = arguments[0];
            var target = arguments[1];
            return list.apply(void 0, [symbol(void 0, 'get')].concat([target], [keyword]));
        case 3:
            var keyword = arguments[0];
            var target = arguments[1];
            var default_ = arguments[2];
            return list.apply(void 0, [symbol(void 0, 'get')].concat([target], [keyword], [default_]));
        default:
            throw RangeError('Wrong number of arguments passed');
        }
    };
var desugar = function desugar(expander, form) {
    return function () {
        var desugaredø1 = expander.apply(void 0, vec(form));
        var metadataø1 = conj({}, meta(form), meta(desugaredø1));
        return withMeta(desugaredø1, metadataø1);
    }.call(this);
};
var macroexpand1 = exports.macroexpand1 = function macroexpand1(form, env) {
        return function () {
            var opø1 = isList(form) && first(form);
            var expanderø1 = macro(opø1);
            return expanderø1 ? expand(expanderø1, form, env) : isKeyword(opø1) ? desugar(keywordInvoke, form) : isDotSyntax(opø1) ? desugar(dotSyntax, form) : isFieldSyntax(opø1) ? desugar(fieldSyntax, form) : isMethodSyntax(opø1) ? desugar(methodSyntax, form) : isNewSyntax(opø1) ? desugar(newSyntax, form) : 'else' ? form : void 0;
        }.call(this);
    };
var macroexpand = exports.macroexpand = function macroexpand(form, env) {
        return function loop() {
            var recur = loop;
            var originalø1 = form;
            var expandedø1 = macroexpand1(form, env);
            do {
                recur = originalø1 === expandedø1 ? originalø1 : (loop[0] = expandedø1, loop[1] = macroexpand1(expandedø1, env), loop);
            } while (originalø1 = loop[0], expandedø1 = loop[1], recur === loop);
            return recur;
        }.call(this);
    };
var syntaxQuote = exports.syntaxQuote = function syntaxQuote(form) {
        return isSymbol(form) ? list(symbol(void 0, 'quote'), form) : isKeyword(form) ? list(symbol(void 0, 'quote'), form) : isNumber(form) || isString(form) || isBoolean(form) || isNil(form) || isRePattern(form) ? form : isUnquote(form) ? second(form) : isUnquoteSplicing(form) ? readerError('Illegal use of `~@` expression, can only be present in a list') : isEmpty(form) ? form : isDictionary(form) ? list(symbol(void 0, 'apply'), symbol(void 0, 'dictionary'), cons(symbol(void 0, '.concat'), sequenceExpand(concat.apply(void 0, seq(form))))) : isVector(form) ? cons(symbol(void 0, '.concat'), sequenceExpand(form)) : isList(form) ? isEmpty(form) ? cons(symbol(void 0, 'list'), void 0) : list(symbol(void 0, 'apply'), symbol(void 0, 'list'), cons(symbol(void 0, '.concat'), sequenceExpand(form))) : 'else' ? readerError('Unknown Collection type') : void 0;
    };
var syntaxQuoteExpand = exports.syntaxQuoteExpand = syntaxQuote;
var unquoteSplicingExpand = exports.unquoteSplicingExpand = function unquoteSplicingExpand(form) {
        return isVector(form) ? form : list(symbol(void 0, 'vec'), form);
    };
var sequenceExpand = exports.sequenceExpand = function sequenceExpand(forms) {
        return map(function (form) {
            return isUnquote(form) ? [second(form)] : isUnquoteSplicing(form) ? unquoteSplicingExpand(second(form)) : 'else' ? [syntaxQuoteExpand(form)] : void 0;
        }, forms);
    };
installMacro('syntax-quote', syntaxQuoteExpand);
var expandNotEqual = exports.expandNotEqual = function expandNotEqual() {
        var body = Array.prototype.slice.call(arguments, 0);
        return list.apply(void 0, [symbol(void 0, 'not')].concat([list.apply(void 0, [symbol(void 0, '=')].concat(vec(body)))]));
    };
installMacro('not=', expandNotEqual);
var expandIfNot = exports.expandIfNot = function expandIfNot(condition, truthy, alternative) {
        return list.apply(void 0, [symbol(void 0, 'if')].concat([list.apply(void 0, [symbol(void 0, 'not')].concat([condition]))], [truthy], [alternative]));
    };
installMacro('if-not', expandIfNot);
var expandComment = exports.expandComment = function expandComment() {
        var body = Array.prototype.slice.call(arguments, 0);
        return void 0;
    };
installMacro('comment', expandComment);
var expandThreadFirst = exports.expandThreadFirst = function expandThreadFirst() {
        var operations = Array.prototype.slice.call(arguments, 0);
        return reduce(function (form, operation) {
            return cons(first(operation), cons(form, rest(operation)));
        }, first(operations), map(function ($1) {
            return isList($1) ? $1 : list.apply(void 0, [$1].concat());
        }, rest(operations)));
    };
installMacro('->', expandThreadFirst);
var expandThreadLast = exports.expandThreadLast = function expandThreadLast() {
        var operations = Array.prototype.slice.call(arguments, 0);
        return reduce(function (form, operation) {
            return concat(operation, [form]);
        }, first(operations), map(function ($1) {
            return isList($1) ? $1 : list.apply(void 0, [$1].concat());
        }, rest(operations)));
    };
installMacro('->>', expandThreadLast);
var expandDots = exports.expandDots = function expandDots(x) {
        var forms = Array.prototype.slice.call(arguments, 1);
        return list.apply(void 0, [symbol(void 0, '->')].concat([x], vec(map(function ($1) {
            return isList($1) ? cons(symbol(void 0, '.'), $1) : list(symbol(void 0, '.'), $1);
        }, forms))));
    };
installMacro('..', expandDots);
var expandThreadAs = exports.expandThreadAs = function expandThreadAs(expr, name) {
        var forms = Array.prototype.slice.call(arguments, 2);
        return list.apply(void 0, [symbol(void 0, 'let')].concat([[name].concat([expr], vec(mapcat(function (form) {
                return [
                    name,
                    form
                ];
            }, forms)))], [name]));
    };
installMacro('as->', expandThreadAs);
var expandCond = exports.expandCond = function expandCond() {
        var clauses = Array.prototype.slice.call(arguments, 0);
        return !isEmpty(clauses) ? list(symbol(void 0, 'if'), first(clauses), isEmpty(rest(clauses)) ? (function () {
            throw Error('cond requires an even number of forms');
        })() : second(clauses), cons(symbol(void 0, 'cond'), rest(rest(clauses)))) : void 0;
    };
installMacro('cond', expandCond);
var expandCase = exports.expandCase = function expandCase(e) {
        var clauses = Array.prototype.slice.call(arguments, 1);
        return function () {
            var symø1 = isSymbol(e) ? e : gensym('case-binding');
            var pairsø1 = partition(2, clauses);
            var eq_ø1 = function (c) {
                return list.apply(void 0, [symbol(void 0, '=')].concat([symø1], [list.apply(void 0, [symbol(void 0, 'quote')].concat([c]))]));
            };
            var tailø1 = isOdd(count(clauses)) ? last(clauses) : list.apply(void 0, [symbol(void 0, 'throw')].concat([list.apply(void 0, [symbol(void 0, 'Error')].concat([list.apply(void 0, [symbol(void 0, 'str')].concat(['No matching clause: '], [symø1]))]))]));
            return function loop() {
                var recur = loop;
                var pairsø2 = pairsø1;
                var condsø1 = [];
                do {
                    recur = isEmpty(pairsø2) ? function () {
                        var resultø1 = list.apply(void 0, [symbol(void 0, 'cond')].concat(vec(condsø1), ['\uA789else'], [tailø1]));
                        return isEqual(e, symø1) ? resultø1 : list.apply(void 0, [symbol(void 0, 'let')].concat([[symø1].concat([e])], [resultø1]));
                    }.call(this) : function () {
                        var xø1 = first(pairsø2);
                        var xsø1 = rest(pairsø2);
                        var constsø1 = first(xø1);
                        var resø1 = second(xø1);
                        return loop[0] = xsø1, loop[1] = conj(condsø1, !isList(constsø1) ? eq_ø1(constsø1) : list.apply(void 0, [symbol(void 0, 'or')].concat(vec(map(eq_ø1, constsø1)))), resø1), loop;
                    }.call(this);
                } while (pairsø2 = loop[0], condsø1 = loop[1], recur === loop);
                return recur;
            }.call(this);
        }.call(this);
    };
installMacro('case', expandCase);
var expandCondp = exports.expandCondp = function expandCondp(pred, expr) {
        var clauses = Array.prototype.slice.call(arguments, 2);
        return function () {
            var sym_ø1 = gensym('condp-binding');
            var symø1 = isSymbol(expr) ? expr : sym_ø1;
            var compareø1 = function (x) {
                return list.apply(void 0, [pred].concat([x], [symø1]));
            };
            var splitsø1 = function splits(xs) {
                return isEmpty(xs) ? list.apply(void 0, [symbol(void 0, 'throw')].concat([list.apply(void 0, [symbol(void 0, 'Error')].concat([list.apply(void 0, [symbol(void 0, 'str')].concat(['No matching clause: '], [symø1]))]))])) : isEqual(1, count(xs)) ? first(xs) : isEqual('\uA789>>', second(xs)) ? list.apply(void 0, [symbol(void 0, 'if-let')].concat([[sym_ø1].concat([compareø1(first(xs))])], [list.apply(void 0, [third(xs)].concat([sym_ø1]))], [splits(drop(3, xs))])) : 'else' ? list.apply(void 0, [symbol(void 0, 'if')].concat([compareø1(first(xs))], [second(xs)], [splits(drop(2, xs))])) : void 0;
            };
            return isEqual(symø1, expr) ? splitsø1(clauses) : list.apply(void 0, [symbol(void 0, 'let')].concat([[symø1].concat([expr])], [splitsø1(clauses)]));
        }.call(this);
    };
installMacro('condp', expandCondp);
var _thread = function _thread(insert, sym, test, form) {
    return function () {
        var formø2 = isList(form) ? form : list(form);
        return list.apply(void 0, [symbol(void 0, 'if')].concat([test], [sym], [insert(sym, formø2)]));
    }.call(this);
};
var _condThread = function _condThread(expr, clauses, insert) {
    return function () {
        var symø1 = gensym('cond-thread-binding');
        return list.apply(void 0, [symbol(void 0, 'as->')].concat([expr], [symø1], vec(map(function ($1) {
            return _thread(insert, symø1, list.apply(void 0, [symbol(void 0, 'not')].concat([first($1)])), second($1));
        }, partition(2, clauses)))));
    }.call(this);
};
var expandCondThreadFirst = exports.expandCondThreadFirst = function expandCondThreadFirst(expr) {
        var clauses = Array.prototype.slice.call(arguments, 1);
        return _condThread(expr, clauses, function (sym, form) {
            return list.apply(void 0, [
                first(form),
                sym
            ].concat(vec(rest(form))));
        });
    };
installMacro('cond->', expandCondThreadFirst);
var expandCondThreadLast = exports.expandCondThreadLast = function expandCondThreadLast(expr) {
        var clauses = Array.prototype.slice.call(arguments, 1);
        return _condThread(expr, clauses, function (sym, form) {
            return list.apply(void 0, vec(concat(form, [sym])));
        });
    };
installMacro('cond->>', expandCondThreadLast);
var _someThread = function _someThread(expr, forms, insert) {
    return function () {
        var symø1 = gensym('some-thread-binding');
        return list.apply(void 0, [symbol(void 0, 'as->')].concat([expr], [symø1], vec(map(function ($1) {
            return _thread(insert, symø1, list.apply(void 0, [symbol(void 0, 'nil?')].concat([symø1])), $1);
        }, forms))));
    }.call(this);
};
var expandSomeThreadFirst = exports.expandSomeThreadFirst = function expandSomeThreadFirst(expr) {
        var forms = Array.prototype.slice.call(arguments, 1);
        return _someThread(expr, forms, function (sym, form) {
            return list.apply(void 0, [
                first(form),
                sym
            ].concat(vec(rest(form))));
        });
    };
installMacro('some->', expandSomeThreadFirst);
var expandSomeThreadLast = exports.expandSomeThreadLast = function expandSomeThreadLast(expr) {
        var forms = Array.prototype.slice.call(arguments, 1);
        return _someThread(expr, forms, function (sym, form) {
            return list.apply(void 0, vec(concat(form, [sym])));
        });
    };
installMacro('some->>', expandSomeThreadLast);
var expandDefn = exports.expandDefn = function expandDefn(_andForm, name) {
        var docPlusMetaPlusBody = Array.prototype.slice.call(arguments, 2);
        return function () {
            var docø1 = isString(first(docPlusMetaPlusBody)) ? first(docPlusMetaPlusBody) : void 0;
            var metaPlusBodyø1 = docø1 ? rest(docPlusMetaPlusBody) : docPlusMetaPlusBody;
            var metadataø1 = isDictionary(first(metaPlusBodyø1)) ? conj({ 'doc': docø1 }, first(metaPlusBodyø1)) : void 0;
            var bodyø1 = metadataø1 ? rest(metaPlusBodyø1) : metaPlusBodyø1;
            var idø1 = withMeta(name, conj(meta(name) || {}, metadataø1));
            var fnø1 = withMeta(list.apply(void 0, [symbol(void 0, 'fn')].concat([idø1], vec(bodyø1))), meta(_andForm));
            return list.apply(void 0, [symbol(void 0, 'def')].concat([idø1], [fnø1]));
        }.call(this);
    };
installMacro('defn', withMeta(expandDefn, { 'implicit': ['&form'] }));
var expandPrivateDefn = exports.expandPrivateDefn = function expandPrivateDefn(name) {
        var body = Array.prototype.slice.call(arguments, 1);
        return function () {
            var metadataø1 = conj(meta(name) || {}, { 'private': true });
            var idø1 = withMeta(name, metadataø1);
            return list.apply(void 0, [symbol(void 0, 'defn')].concat([idø1], vec(body)));
        }.call(this);
    };
installMacro('defn-', expandPrivateDefn);
var expandLazySeq = exports.expandLazySeq = function expandLazySeq() {
        var body = Array.prototype.slice.call(arguments, 0);
        return list.apply(void 0, [symbol(void 0, '.call')].concat([symbol(void 0, 'lazy-seq')], [void 0], [false], [list.apply(void 0, [symbol(void 0, 'fn')].concat([[]], vec(body)))]));
    };
installMacro('lazy-seq', expandLazySeq);
var expandWhen = exports.expandWhen = function expandWhen(test) {
        var body = Array.prototype.slice.call(arguments, 1);
        return list.apply(void 0, [symbol(void 0, 'if')].concat([test], [list.apply(void 0, [symbol(void 0, 'do')].concat(vec(body)))]));
    };
installMacro('when', expandWhen);
var expandWhenNot = exports.expandWhenNot = function expandWhenNot(test) {
        var body = Array.prototype.slice.call(arguments, 1);
        return list.apply(void 0, [symbol(void 0, 'when')].concat([list.apply(void 0, [symbol(void 0, 'not')].concat([test]))], vec(body)));
    };
installMacro('when-not', expandWhenNot);
var expandIfLet = exports.expandIfLet = function expandIfLet(bindings, then, else_) {
        return function () {
            var nameø1 = first(bindings);
            var testø1 = second(bindings);
            var symø1 = gensym('if-let-binding');
            return list.apply(void 0, [symbol(void 0, 'let')].concat([[symø1].concat([testø1])], [list.apply(void 0, [symbol(void 0, 'if')].concat([symø1], [list.apply(void 0, [symbol(void 0, 'let')].concat([[nameø1].concat([symø1])], [then]))], [else_]))]));
        }.call(this);
    };
installMacro('if-let', expandIfLet);
var expandWhenLet = exports.expandWhenLet = function expandWhenLet(bindings) {
        var body = Array.prototype.slice.call(arguments, 1);
        return list.apply(void 0, [symbol(void 0, 'if-let')].concat([bindings], [list.apply(void 0, [symbol(void 0, 'do')].concat(vec(body)))]));
    };
installMacro('when-let', expandWhenLet);
var expandIfSome = exports.expandIfSome = function expandIfSome(bindings, then, else_) {
        return function () {
            var nameø1 = first(bindings);
            var testø1 = second(bindings);
            var symø1 = isSymbol(nameø1) ? nameø1 : gensym('if-some-binding');
            return list.apply(void 0, [symbol(void 0, 'let')].concat([[symø1].concat([testø1])], [list.apply(void 0, [symbol(void 0, 'if-not')].concat([list.apply(void 0, [symbol(void 0, 'nil?')].concat([symø1]))], [list.apply(void 0, [symbol(void 0, 'let')].concat([[nameø1].concat([symø1])], [then]))], [else_]))]));
        }.call(this);
    };
installMacro('if-some', expandIfSome);
var expandWhenSome = exports.expandWhenSome = function expandWhenSome(bindings) {
        var body = Array.prototype.slice.call(arguments, 1);
        return list.apply(void 0, [symbol(void 0, 'if-some')].concat([bindings], [list.apply(void 0, [symbol(void 0, 'do')].concat(vec(body)))]));
    };
installMacro('when-some', expandWhenSome);
var expandWhenFirst = exports.expandWhenFirst = function expandWhenFirst(bindings) {
        var body = Array.prototype.slice.call(arguments, 1);
        return function () {
            var nameø1 = first(bindings);
            var testø1 = second(bindings);
            return list.apply(void 0, [symbol(void 0, 'when-let')].concat([[[nameø1].concat()].concat([list.apply(void 0, [symbol(void 0, 'seq*')].concat([testø1]))])], vec(body)));
        }.call(this);
    };
installMacro('when-first', expandWhenFirst);
var expandWhile = exports.expandWhile = function expandWhile(test) {
        var body = Array.prototype.slice.call(arguments, 1);
        return list.apply(void 0, [symbol(void 0, 'loop')].concat([[]], [list.apply(void 0, [symbol(void 0, 'when')].concat([test], vec(body), [list.apply(void 0, [symbol(void 0, 'recur')].concat())]))]));
    };
installMacro('while', expandWhile);
var expandDoto = exports.expandDoto = function expandDoto(x) {
        var forms = Array.prototype.slice.call(arguments, 1);
        return function () {
            var symø1 = gensym('doto-binding');
            return list.apply(void 0, [symbol(void 0, 'let')].concat([[symø1].concat([x])], vec(map(function ($1) {
                return concat([
                    first($1),
                    symø1
                ], rest($1));
            }, forms)), [symø1]));
        }.call(this);
    };
installMacro('doto', expandDoto);
var expandDotimes = exports.expandDotimes = function expandDotimes(bindings) {
        var body = Array.prototype.slice.call(arguments, 1);
        return function () {
            var nameø1 = first(bindings);
            var nø1 = second(bindings);
            var symø1 = gensym('dotimes-binding');
            return list.apply(void 0, [symbol(void 0, 'let')].concat([[symø1].concat([nø1])], [list.apply(void 0, [symbol(void 0, 'loop')].concat([[nameø1].concat([0])], [list.apply(void 0, [symbol(void 0, 'when')].concat([list.apply(void 0, [symbol(void 0, '<')].concat([nameø1], [symø1]))], vec(body), [list.apply(void 0, [symbol(void 0, 'recur')].concat([list.apply(void 0, [symbol(void 0, 'inc')].concat([nameø1]))]))]))]))]));
        }.call(this);
    };
installMacro('dotimes', expandDotimes);
var forStep = function forStep(context, loop) {
    var modifiers = Array.prototype.slice.call(arguments, 2);
    return function () {
        var iterø1 = (context || 0)['iter'];
        var collø1 = (context || 0)['coll'];
        var bodyø1 = (context || 0)['body'];
        var subseqø1 = (context || 0)['subseq'];
        var body_ø1 = !subseqø1 ? bodyø1 : list.apply(void 0, [symbol(void 0, 'let')].concat([[subseqø1].concat([bodyø1])], [list.apply(void 0, [symbol(void 0, 'if')].concat([list.apply(void 0, [symbol(void 0, 'empty?')].concat([subseqø1]))], [list.apply(void 0, [symbol(void 0, 'recur')].concat([list.apply(void 0, [symbol(void 0, 'rest')].concat([collø1]))]))], [list.apply(void 0, [symbol(void 0, 'lazy-concat')].concat([subseqø1], [list.apply(void 0, [iterø1].concat([list.apply(void 0, [symbol(void 0, 'rest')].concat([collø1]))]))]))]))]));
        var nextø1 = function loop() {
                var recur = loop;
                var modsø1 = reverse(modifiers);
                var bodyø2 = body_ø1;
                do {
                    recur = isEmpty(modsø1) ? bodyø2 : function () {
                        var mø1 = first(modsø1);
                        var itemø1 = first(mø1);
                        var argø1 = second(mø1);
                        return loop[0] = rest(modsø1), loop[1] = isEqual(itemø1, '\uA789let') ? list.apply(void 0, [symbol(void 0, 'let')].concat([argø1], [bodyø2])) : isEqual(itemø1, '\uA789while') ? list.apply(void 0, [symbol(void 0, 'if')].concat([argø1], [bodyø2])) : isEqual(itemø1, '\uA789when') ? list.apply(void 0, [symbol(void 0, 'if')].concat([argø1], [bodyø2], [list.apply(void 0, [symbol(void 0, 'recur')].concat([list.apply(void 0, [symbol(void 0, 'rest')].concat([collø1]))]))])) : void 0, loop;
                    }.call(this);
                } while (modsø1 = loop[0], bodyø2 = loop[1], recur === loop);
                return recur;
            }.call(this);
        return merge(context, {
            'subseq': gensym('for-subseq'),
            'body': list.apply(void 0, [list.apply(void 0, [symbol(void 0, 'fn')].concat([iterø1], [[collø1].concat()], [list.apply(void 0, [symbol(void 0, 'lazy-seq')].concat([list.apply(void 0, [symbol(void 0, 'loop')].concat([[collø1].concat([collø1])], [list.apply(void 0, [symbol(void 0, 'if-not')].concat([list.apply(void 0, [symbol(void 0, 'empty?')].concat([collø1]))], [list.apply(void 0, [symbol(void 0, 'let')].concat([[first(loop)].concat([list.apply(void 0, [symbol(void 0, 'first')].concat([collø1]))])], [nextø1]))]))]))]))]))].concat([second(loop)]))
        });
    }.call(this);
};
var forModifiers = set('\uA789let', '\uA789while', '\uA789when');
var forParts = function forParts(seqExprPairs) {
    return function () {
        var nø1 = count(seqExprPairs);
        var indicesø1 = filter(function ($1) {
                return !forModifiers(first(seqExprPairs[$1]));
            }, range(nø1));
        var segmentsø1 = partition(2, 1, conj(indicesø1, nø1));
        return map(function ($1) {
            return seqExprPairs.slice(first($1), second($1));
        }, segmentsø1);
    }.call(this);
};
var expandFor = exports.expandFor = function expandFor(seqExprs, bodyExpr) {
        return function () {
            var iterø1 = gensym('for-iter');
            var collø1 = gensym('for-coll');
            var partsø1 = forParts(partition(2, seqExprs));
            return (reduce(function ($1, $2) {
                return forStep.apply(void 0, [$1].concat($2));
            }, {
                'iter': iterø1,
                'coll': collø1,
                'body': list.apply(void 0, [symbol(void 0, 'cons')].concat([bodyExpr], [list.apply(void 0, [iterø1].concat([list.apply(void 0, [symbol(void 0, 'rest')].concat([collø1]))]))]))
            }, reverse(partsø1)) || 0)['body'];
        }.call(this);
    };
installMacro('for', expandFor);
var expandDoseq = exports.expandDoseq = function expandDoseq(seqExprs) {
        var body = Array.prototype.slice.call(arguments, 1);
        return list.apply(void 0, [symbol(void 0, 'dorun')].concat([list.apply(void 0, [symbol(void 0, 'for')].concat([seqExprs], [list.apply(void 0, [symbol(void 0, 'do')].concat(vec(body), [void 0]))]))]));
    };
installMacro('doseq', expandDoseq);
var sym_ = function sym_(string) {
    return function () {
        var wordsø1 = split(name(string), /-/);
        return join(cons(first(wordsø1), map(capitalize, rest(wordsø1))));
    }.call(this);
};
var bindSym_ = function bindSym_(s, b) {
    !isSymbol(s) ? (function () {
        throw Error('' + 'Assert failed: ' + 'Expected a symbol here!' + '(symbol? s)');
    })() : void 0;
    return [
        s,
        b
    ];
};
var conjSyms_ = function conjSyms_(get_, result, k, v, f, quote) {
    return function () {
        var kNsø1 = namespace(k);
        var gø1 = function ($1) {
            return f(kNsø1, name($1));
        };
        return vec(concat(result, mapcat(function ($1) {
            return bindSym_($1, get_($1, gø1($1), quote));
        }, v)));
    }.call(this);
};
var dictGet_ = function dictGet_(dictName, defaults) {
    return function (binding, key, quote) {
        return function () {
            var sø1 = name(key);
            var kø1 = keyword(namespace(key), isSymbol(key) ? sym_(sø1) : sø1);
            return list.apply(void 0, [symbol(void 0, 'get')].concat([dictName], [!quote ? kø1 : list.apply(void 0, [symbol(void 0, 'quote')].concat([kø1]))], [binding && defaults[binding]]));
        }.call(this);
    };
};
var destructureDict = exports.destructureDict = function destructureDict(binding, from) {
        return function () {
            var dictNameø1 = binding['\uA789as'] || gensym('destructure-bind');
            var dictBindø1 = list.apply(void 0, [symbol(void 0, 'if')].concat([list.apply(void 0, [symbol(void 0, 'dictionary?')].concat([dictNameø1]))], [dictNameø1], [list.apply(void 0, [symbol(void 0, 'apply')].concat([symbol(void 0, 'dictionary')], [list.apply(void 0, [symbol(void 0, 'vec')].concat([dictNameø1]))]))]));
            var get_ø1 = dictGet_(dictNameø1, get.apply(void 0, [
                    binding,
                    '\uA789or',
                    {}
                ]));
            return function loop() {
                var recur = loop;
                var ksø1 = keys(dissoc(binding, '\uA789as', '\uA789or'));
                var resultø1 = [
                        dictNameø1,
                        from,
                        dictNameø1,
                        dictBindø1
                    ];
                do {
                    recur = isEmpty(ksø1) ? resultø1 : function () {
                        var kø1 = first(ksø1);
                        var vø1 = (binding || 0)[kø1];
                        var k_ø1 = isKeyword(kø1) && name(kø1);
                        !(isSymbol(kø1) || k_ø1 && set('keys', 'strs', 'syms')(k_ø1)) ? (function () {
                            throw Error('' + 'Assert failed: ' + ('' + 'Invalid destructure key ' + kø1) + '(or (symbol? k) (and k* ((set :keys :strs :syms) k*)))');
                        })() : void 0;
                        return loop[0] = rest(ksø1), loop[1] = isEqual(k_ø1, 'strs') ? conjSyms_(get_ø1, resultø1, kø1, vø1, keyword) : isEqual(k_ø1, 'syms') ? conjSyms_(get_ø1, resultø1, kø1, vø1, function ($1, $2) {
                            return symbol($1, sym_($2));
                        }) : isEqual(k_ø1, 'keys') ? conjSyms_(get_ø1, resultø1, kø1, vø1, keyword, 'quote') : isNumber(vø1) ? conj(resultø1, kø1, get_ø1(kø1, symbol('' + vø1))) : 'else' ? conj(resultø1, kø1, get_ø1(kø1, vø1)) : void 0, loop;
                    }.call(this);
                } while (ksø1 = loop[0], resultø1 = loop[1], recur === loop);
                return recur;
            }.call(this);
        }.call(this);
    };
var destructureSeq = exports.destructureSeq = function destructureSeq(binding, from) {
        return function () {
            var asø1 = binding.findIndex(function ($1) {
                    return isEqual($1, '\uA789as');
                });
            var seqNameø1 = asø1 < 0 ? gensym('destructure-bind') : nth(binding, inc(asø1));
            var binding1ø1 = asø1 < 0 ? binding : take(asø1, binding);
            var moreø1 = binding1ø1.findIndex(function ($1) {
                    return isEqual($1, symbol(void 0, '&'));
                });
            var tailø1 = moreø1 >= 0 ? nth(binding1ø1, inc(moreø1)) : void 0;
            var binding2ø1 = moreø1 < 0 ? binding1ø1 : take(moreø1, binding);
            !(asø1 < 0 || isEqual(asø1, count(binding) - 2)) ? (function () {
                throw Error('' + 'Assert failed: ' + 'invalid :as in seq-destructuring' + '(or (< as 0) (= as (- (count binding) 2)))');
            })() : void 0;
            !(moreø1 < 0 || isEqual(moreø1, count(binding1ø1) - 2)) ? (function () {
                throw Error('' + 'Assert failed: ' + 'invalid & in seq-destructuring' + '(or (< more 0) (= more (- (count binding1) 2)))');
            })() : void 0;
            return function loop() {
                var recur = loop;
                var xsø1 = binding2ø1;
                var iø1 = 0;
                var resultø1 = [
                        seqNameø1,
                        from
                    ];
                do {
                    recur = function () {
                        var xø1 = first(xsø1);
                        return isEmpty(xsø1) ? !tailø1 ? resultø1 : conj(resultø1, tailø1, list.apply(void 0, [symbol(void 0, 'drop')].concat([moreø1], [seqNameø1]))) : isEqual(xø1, symbol(void 0, '_')) ? (loop[0] = rest(xsø1), loop[1] = inc(iø1), loop[2] = resultø1, loop) : 'else' ? (loop[0] = rest(xsø1), loop[1] = inc(iø1), loop[2] = conj(resultø1, xø1, list.apply(void 0, [symbol(void 0, 'nth')].concat([seqNameø1], [iø1]))), loop) : void 0;
                    }.call(this);
                } while (xsø1 = loop[0], iø1 = loop[1], resultø1 = loop[2], recur === loop);
                return recur;
            }.call(this);
        }.call(this);
    };
var destructure = exports.destructure = function destructure(bindings) {
        return function () {
            var pairsø1 = partition(2, bindings);
            return isEvery(function ($1) {
                return isSymbol(first($1));
            }, pairsø1) ? bindings : destructure(vec(mapcat(function ($1) {
                return isVector(first($1)) ? destructureSeq.apply(void 0, $1) : isDictionary(first($1)) ? destructureDict.apply(void 0, $1) : isSymbol(first($1)) ? $1 : 'else' ? (function () {
                    throw 'Invalid binding';
                })() : void 0;
            }, pairsø1)));
        }.call(this);
    };
var bindNames_ = function bindNames_(keys) {
    return zipmap(keys, repeatedly(count(keys), function () {
        return gensym('destructure-bind');
    }));
};
var bindIndices_ = function bindIndices_(names) {
    return filter(function ($1) {
        return !isSymbol(nth(names, $1));
    }, range(count(names)));
};
var expandLet = exports.expandLet = function expandLet(bindings) {
        var body = Array.prototype.slice.call(arguments, 1);
        return list.apply(void 0, [symbol(void 0, 'let*')].concat([destructure(bindings)], vec(body)));
    };
installMacro('let', expandLet);
var expandFn = exports.expandFn = function expandFn() {
        var args = Array.prototype.slice.call(arguments, 0);
        return function () {
            var nameø1 = isSymbol(first(args)) ? first(args) : void 0;
            var defsø1 = nameø1 ? rest(args) : args;
            var mkfnø1 = function ($1) {
                return nameø1 ? list.apply(void 0, [symbol(void 0, 'fn*')].concat([nameø1], vec($1))) : list.apply(void 0, [symbol(void 0, 'fn*')].concat(vec($1)));
            };
            var def_ø1 = function (args) {
                var body = Array.prototype.slice.call(arguments, 1);
                return function () {
                    var indicesø1 = bindIndices_(args);
                    var namesø1 = bindNames_(indicesø1);
                    return isEmpty(namesø1) ? cons(args, body) : list.apply(void 0, [vec(mapIndexed(function ($1, $2) {
                            return get.apply(void 0, [
                                namesø1,
                                $1,
                                $2
                            ]);
                        }, args))].concat([list.apply(void 0, [symbol(void 0, 'let')].concat([vec(mapcat(function (i) {
                                return [
                                    args[i],
                                    namesø1[i]
                                ];
                            }, indicesø1))], vec(body)))]));
                }.call(this);
            };
            return isVector(first(defsø1)) ? mkfnø1(def_ø1.apply(void 0, defsø1)) : mkfnø1(map(function ($1) {
                return def_ø1.apply(void 0, vec($1));
            }, defsø1));
        }.call(this);
    };
installMacro('fn', expandFn);
var expandLoop = exports.expandLoop = function expandLoop(bindings) {
        var body = Array.prototype.slice.call(arguments, 1);
        return function () {
            var pairsø1 = partition(2, bindings);
            var indicesø1 = bindIndices_(mapv(first, pairsø1));
            var namesø1 = bindNames_(indicesø1);
            var get_ø1 = function ($1, $2) {
                return function () {
                    var ifLetBinding1ø1 = namesø1[$1];
                    return ifLetBinding1ø1 ? function () {
                        var xø1 = ifLetBinding1ø1;
                        return [
                            xø1,
                            second($2),
                            first($2),
                            xø1
                        ];
                    }.call(this) : $2;
                }.call(this);
            };
            return isEmpty(namesø1) ? list.apply(void 0, [symbol(void 0, 'loop*')].concat([bindings], vec(body))) : list.apply(void 0, [symbol(void 0, 'let')].concat([vec(concat.apply(void 0, mapIndexed(get_ø1, pairsø1)))], [list.apply(void 0, [symbol(void 0, 'loop*')].concat([vec(concat.apply(void 0, mapIndexed(function ($1, $2) {
                        return function () {
                            var xø1 = get.apply(void 0, [
                                    namesø1,
                                    $1,
                                    first($2)
                                ]);
                            return [
                                xø1,
                                xø1
                            ];
                        }.call(this);
                    }, pairsø1)))], [list.apply(void 0, [symbol(void 0, 'let')].concat([vec(mapcat(function (i) {
                            return [
                                first(pairsø1[i]),
                                namesø1[i]
                            ];
                        }, indicesø1))], vec(body)))]))]));
        }.call(this);
    };
installMacro('loop', expandLoop);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndpc3AvZXhwYW5kZXIud2lzcCJdLCJuYW1lcyI6WyJfbnNfIiwiaWQiLCJkb2MiLCJtZXRhIiwid2l0aE1ldGEiLCJpc1N5bWJvbCIsImlzS2V5d29yZCIsImtleXdvcmQiLCJpc1F1b3RlIiwic3ltYm9sIiwibmFtZXNwYWNlIiwibmFtZSIsImdlbnN5bSIsImlzVW5xdW90ZSIsImlzVW5xdW90ZVNwbGljaW5nIiwiaXNMaXN0IiwibGlzdCIsImNvbmoiLCJwYXJ0aXRpb24iLCJzZXEiLCJyZXBlYXRlZGx5IiwiaXNFbXB0eSIsIm1hcCIsIm1hcHYiLCJ2ZWMiLCJzZXQiLCJpc0V2ZXJ5IiwiY29uY2F0IiwiZmlyc3QiLCJzZWNvbmQiLCJ0aGlyZCIsInJlc3QiLCJsYXN0IiwibWFwY2F0IiwibnRoIiwiYnV0bGFzdCIsImludGVybGVhdmUiLCJjb25zIiwiY291bnQiLCJ0YWtlIiwiZGlzc29jIiwic29tZSIsImFzc29jIiwicmVkdWNlIiwiZmlsdGVyIiwiaXNTZXEiLCJ6aXBtYXAiLCJkcm9wIiwibGF6eVNlcSIsInJhbmdlIiwicmV2ZXJzZSIsImRvcnVuIiwibWFwSW5kZXhlZCIsImlzTmlsIiwiaXNEaWN0aW9uYXJ5IiwiaXNWZWN0b3IiLCJrZXlzIiwiZ2V0IiwidmFscyIsImlzU3RyaW5nIiwiaXNOdW1iZXIiLCJpc0Jvb2xlYW4iLCJpc0RhdGUiLCJpc1JlUGF0dGVybiIsImlzRXZlbiIsImlzT2RkIiwiaXNFcXVhbCIsIm1heCIsImluYyIsImRlYyIsImRpY3Rpb25hcnkiLCJtZXJnZSIsInN1YnMiLCJzcGxpdCIsImpvaW4iLCJjYXBpdGFsaXplIiwiX19tYWNyb3NfXyIsImV4cG9ydHMiLCJleHBhbmQiLCJleHBhbmRlciIsImZvcm0iLCJlbnYiLCJtZXRhZGF0YcO4MSIsInBhcm1hc8O4MSIsImltcGxpY2l0w7gxIiwiJDEiLCJwYXJhbXPDuDEiLCJleHBhbnNpb27DuDEiLCJpbnN0YWxsTWFjcm8iLCJvcCIsIm1hY3JvIiwiaXNEb3RTeW50YXgiLCJpc01ldGhvZFN5bnRheCIsImlkw7gxIiwiaXNGaWVsZFN5bnRheCIsImlzTmV3U3ludGF4IiwibWV0aG9kU3ludGF4IiwidGFyZ2V0IiwicGFyYW1zIiwib3BNZXRhw7gxIiwiZm9ybVN0YXJ0w7gxIiwidGFyZ2V0TWV0YcO4MSIsIm1lbWJlcsO4MSIsImFnZXTDuDEiLCJtZXRob2TDuDEiLCJFcnJvciIsImZpZWxkU3ludGF4IiwiZmllbGQiLCJtb3JlIiwic3RhcnTDuDEiLCJlbmTDuDEiLCJkb3RTeW50YXgiLCJfZmllbGTDuDEiLCJuZXdTeW50YXgiLCJpZE1ldGHDuDEiLCJyZW5hbWXDuDEiLCJjb25zdHJ1Y3RvcsO4MSIsIm9wZXJhdG9yw7gxIiwia2V5d29yZEludm9rZSIsImRlZmF1bHRfIiwiZGVzdWdhciIsImRlc3VnYXJlZMO4MSIsIm1hY3JvZXhwYW5kMSIsIm9ww7gxIiwiZXhwYW5kZXLDuDEiLCJtYWNyb2V4cGFuZCIsIm9yaWdpbmFsw7gxIiwiZXhwYW5kZWTDuDEiLCJzeW50YXhRdW90ZSIsInJlYWRlckVycm9yIiwic2VxdWVuY2VFeHBhbmQiLCJzeW50YXhRdW90ZUV4cGFuZCIsInVucXVvdGVTcGxpY2luZ0V4cGFuZCIsImZvcm1zIiwiZXhwYW5kTm90RXF1YWwiLCJib2R5IiwiZXhwYW5kSWZOb3QiLCJjb25kaXRpb24iLCJ0cnV0aHkiLCJhbHRlcm5hdGl2ZSIsImV4cGFuZENvbW1lbnQiLCJleHBhbmRUaHJlYWRGaXJzdCIsIm9wZXJhdGlvbnMiLCJvcGVyYXRpb24iLCJleHBhbmRUaHJlYWRMYXN0IiwiZXhwYW5kRG90cyIsIngiLCJleHBhbmRUaHJlYWRBcyIsImV4cHIiLCJleHBhbmRDb25kIiwiY2xhdXNlcyIsImV4cGFuZENhc2UiLCJlIiwic3ltw7gxIiwicGFpcnPDuDEiLCJlcV/DuDEiLCJjIiwidGFpbMO4MSIsInBhaXJzw7gyIiwiY29uZHPDuDEiLCJyZXN1bHTDuDEiLCJ4w7gxIiwieHPDuDEiLCJjb25zdHPDuDEiLCJyZXPDuDEiLCJleHBhbmRDb25kcCIsInByZWQiLCJzeW1fw7gxIiwiY29tcGFyZcO4MSIsInNwbGl0c8O4MSIsInNwbGl0cyIsInhzIiwiX3RocmVhZCIsImluc2VydCIsInN5bSIsInRlc3QiLCJmb3Jtw7gyIiwiX2NvbmRUaHJlYWQiLCJleHBhbmRDb25kVGhyZWFkRmlyc3QiLCJleHBhbmRDb25kVGhyZWFkTGFzdCIsIl9zb21lVGhyZWFkIiwiZXhwYW5kU29tZVRocmVhZEZpcnN0IiwiZXhwYW5kU29tZVRocmVhZExhc3QiLCJleHBhbmREZWZuIiwiX2FuZEZvcm0iLCJkb2NQbHVzTWV0YVBsdXNCb2R5IiwiZG9jw7gxIiwibWV0YVBsdXNCb2R5w7gxIiwiYm9kecO4MSIsImZuw7gxIiwiZXhwYW5kUHJpdmF0ZURlZm4iLCJleHBhbmRMYXp5U2VxIiwiZXhwYW5kV2hlbiIsImV4cGFuZFdoZW5Ob3QiLCJleHBhbmRJZkxldCIsImJpbmRpbmdzIiwidGhlbiIsImVsc2VfIiwibmFtZcO4MSIsInRlc3TDuDEiLCJleHBhbmRXaGVuTGV0IiwiZXhwYW5kSWZTb21lIiwiZXhwYW5kV2hlblNvbWUiLCJleHBhbmRXaGVuRmlyc3QiLCJleHBhbmRXaGlsZSIsImV4cGFuZERvdG8iLCJleHBhbmREb3RpbWVzIiwibsO4MSIsImZvclN0ZXAiLCJjb250ZXh0IiwibG9vcCIsIm1vZGlmaWVycyIsIml0ZXLDuDEiLCJjb2xsw7gxIiwic3Vic2Vxw7gxIiwiYm9keV/DuDEiLCJuZXh0w7gxIiwibW9kc8O4MSIsImJvZHnDuDIiLCJtw7gxIiwiaXRlbcO4MSIsImFyZ8O4MSIsImZvck1vZGlmaWVycyIsImZvclBhcnRzIiwic2VxRXhwclBhaXJzIiwiaW5kaWNlc8O4MSIsInNlZ21lbnRzw7gxIiwic2xpY2UiLCJleHBhbmRGb3IiLCJzZXFFeHBycyIsImJvZHlFeHByIiwicGFydHPDuDEiLCIkMiIsImV4cGFuZERvc2VxIiwic3ltXyIsInN0cmluZyIsIndvcmRzw7gxIiwiYmluZFN5bV8iLCJzIiwiYiIsImNvbmpTeW1zXyIsImdldF8iLCJyZXN1bHQiLCJrIiwidiIsImYiLCJxdW90ZSIsImtOc8O4MSIsImfDuDEiLCJkaWN0R2V0XyIsImRpY3ROYW1lIiwiZGVmYXVsdHMiLCJiaW5kaW5nIiwia2V5Iiwic8O4MSIsImvDuDEiLCJkZXN0cnVjdHVyZURpY3QiLCJmcm9tIiwiZGljdE5hbWXDuDEiLCJkaWN0QmluZMO4MSIsImdldF/DuDEiLCJrc8O4MSIsInbDuDEiLCJrX8O4MSIsImRlc3RydWN0dXJlU2VxIiwiYXPDuDEiLCJmaW5kSW5kZXgiLCJzZXFOYW1lw7gxIiwiYmluZGluZzHDuDEiLCJtb3Jlw7gxIiwiYmluZGluZzLDuDEiLCJpw7gxIiwiZGVzdHJ1Y3R1cmUiLCJiaW5kTmFtZXNfIiwiYmluZEluZGljZXNfIiwibmFtZXMiLCJleHBhbmRMZXQiLCJleHBhbmRGbiIsImFyZ3MiLCJkZWZzw7gxIiwibWtmbsO4MSIsImRlZl/DuDEiLCJuYW1lc8O4MSIsImkiLCJleHBhbmRMb29wIl0sIm1hcHBpbmdzIjoiO0lBQUEsSUFBQ0EsSSxHQUFEO0FBQUEsWUFBQUMsRSxFQUFJLGVBQUo7QUFBQSxZQUFBQyxHLEVBQ0UsdUNBREY7QUFBQSxVOztRQUU4QkMsSUFBQSxHLFNBQUFBLEk7UUFBS0MsUUFBQSxHLFNBQUFBLFE7UUFBVUMsUUFBQSxHLFNBQUFBLFE7UUFBUUMsU0FBQSxHLFNBQUFBLFM7UUFBU0MsT0FBQSxHLFNBQUFBLE87UUFDaENDLE9BQUEsRyxTQUFBQSxPO1FBQU9DLE1BQUEsRyxTQUFBQSxNO1FBQU9DLFNBQUEsRyxTQUFBQSxTO1FBQVVDLElBQUEsRyxTQUFBQSxJO1FBQUtDLE1BQUEsRyxTQUFBQSxNO1FBQzdCQyxTQUFBLEcsU0FBQUEsUztRQUFTQyxpQkFBQSxHLFNBQUFBLGlCOztRQUNKQyxNQUFBLEcsY0FBQUEsTTtRQUFNQyxJQUFBLEcsY0FBQUEsSTtRQUFLQyxJQUFBLEcsY0FBQUEsSTtRQUFLQyxTQUFBLEcsY0FBQUEsUztRQUFVQyxHQUFBLEcsY0FBQUEsRztRQUFJQyxVQUFBLEcsY0FBQUEs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T3ZGLFEsT0FBVzVELEksRUFBcEIsQ0FERixHLFVBRUUsQyxNQUFBLEUsT0FBRSxDLE1BQUEsRSxLQUFBLEMsVUFBTS9HLEdBQUQsQ0FBWUcsTSxNQUFQLEMsTUFBQSxFQUFleUIsVUFBRCxDQUFhZ04sTUFBYixFQUFrQjFHLE9BQWxCLENBQWQsQ0FBTCxDLDhCQUNILEMsTUFBQSxFLE9BQUEsQyxVQUFRbEksR0FBRCxDQUFZRyxNLE1BQVAsQyxNQUFBLEVBQWV5QixVQUFELENBQWEsVUFBb0JpQyxFQUFwQixFQUE4Qm1KLEVBQTlCLEU7MkNBQU87QUFBQSxnQ0FBQXZFLEcsWUFBRSxDLE1BQUEsRTtvQ0FBS3lILE87b0NBQU1yTSxFO29DQUFJekQsS0FBRCxDQUFPNE0sRUFBUCxDO2lDQUFkLENBQUY7QUFBQSw0QkFBNkI7QUFBQSxnQ0FBQ3ZFLEdBQUQ7QUFBQSxnQ0FBR0EsR0FBSDtBQUFBLDhCQUE3QjtBQUFBLHlCO3FCQUFwQixFQUNhUCxPQURiLENBQWQsQ0FBTCxDLDhCQUVMLEMsTUFBQSxFLEtBQUEsQyxVQUFNbEksR0FBRCxDQUFNUyxNQUFELENBQVEsVUFBSzBQLENBQUwsRUFBUTtBQUFBO0FBQUEsZ0NBQUUvUCxLQUFELENBQWE4SCxPQUFOLENBQVlpSSxDQUFaLENBQVAsQ0FBRDtBQUFBLGdDQUE4QkQsT0FBTixDQUFZQyxDQUFaLENBQXhCO0FBQUE7QUFBQSx5QkFBaEIsRUFDUTFELFNBRFIsQ0FBTCxDLE9BRUYxRixJLFFBTFQsQ0FGRixDQU5JO0FBQUEsUyxLQUFOLEMsSUFBQSxFO0tBUEYsQztBQXFCQy9DLFlBQUQsQyxNQUFBLEVBQXFCb00sVUFBckIiLCJzb3VyY2VzQ29udGVudCI6WyIobnMgd2lzcC5leHBhbmRlclxuICBcIndpc3Agc3ludGF4IGFuZCBtYWNybyBleHBhbmRlciBtb2R1bGVcIlxuICAoOnJlcXVpcmUgW3dpc3AuYXN0IDpyZWZlciBbbWV0YSB3aXRoLW1ldGEgc3ltYm9sPyBrZXl3b3JkPyBrZXl3b3JkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBxdW90ZT8gc3ltYm9sIG5hbWVzcGFjZSBuYW1lIGdlbnN5bVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5xdW90ZT8gdW5xdW90ZS1zcGxpY2luZz9dXVxuICAgICAgICAgICAgW3dpc3Auc2VxdWVuY2UgOnJlZmVyIFtsaXN0PyBsaXN0IGNvbmogcGFydGl0aW9uIHNlcSByZXBlYXRlZGx5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVtcHR5PyBtYXAgbWFwdiB2ZWMgc2V0IGV2ZXJ5PyBjb25jYXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3Qgc2Vjb25kIHRoaXJkIHJlc3QgbGFzdCBtYXBjYXQgbnRoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1dGxhc3QgaW50ZXJsZWF2ZSBjb25zIGNvdW50IHRha2UgZGlzc29jXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvbWUgYXNzb2MgcmVkdWNlIGZpbHRlciBzZXE/IHppcG1hcCBkcm9wXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhenktc2VxIHJhbmdlIHJldmVyc2UgZG9ydW4gbWFwLWluZGV4ZWRdXVxuICAgICAgICAgICAgW3dpc3AucnVudGltZSA6cmVmZXIgW25pbD8gZGljdGlvbmFyeT8gdmVjdG9yPyBrZXlzIGdldFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHMgc3RyaW5nPyBudW1iZXI/IGJvb2xlYW4/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZT8gcmUtcGF0dGVybj8gZXZlbj8gb2RkPyA9IG1heFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluYyBkZWMgZGljdGlvbmFyeSBtZXJnZSBzdWJzXV1cbiAgICAgICAgICAgIFt3aXNwLnN0cmluZyA6cmVmZXIgW3NwbGl0IGpvaW4gY2FwaXRhbGl6ZV1dKSlcblxuXG4oZGVmICoqbWFjcm9zKioge30pXG5cbihkZWZuLSBleHBhbmRcbiAgXCJBcHBsaWVzIG1hY3JvIHJlZ2lzdGVyZWQgd2l0aCBnaXZlbiBgbmFtZWAgdG8gYSBnaXZlbiBgZm9ybWBcIlxuICBbZXhwYW5kZXIgZm9ybSBlbnZdXG4gIChsZXQgW21ldGFkYXRhIChvciAobWV0YSBmb3JtKSB7fSlcbiAgICAgICAgcGFybWFzIChyZXN0IGZvcm0pXG4gICAgICAgIGltcGxpY2l0IChtYXAgIyhjb25kICg9IDomZm9ybSAlKSBmb3JtXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICg9IDomZW52ICUpIGVudlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ZWxzZSAlKVxuICAgICAgICAgICAgICAgICAgICAgIChvciAoOmltcGxpY2l0IChtZXRhIGV4cGFuZGVyKSkgW10pKVxuICAgICAgICBwYXJhbXMgKHZlYyAoY29uY2F0IGltcGxpY2l0ICh2ZWMgKHJlc3QgZm9ybSkpKSlcblxuICAgICAgICBleHBhbnNpb24gKGFwcGx5IGV4cGFuZGVyIHBhcmFtcyldXG4gICAgKGlmIGV4cGFuc2lvblxuICAgICAgKHdpdGgtbWV0YSBleHBhbnNpb24gKGNvbmogbWV0YWRhdGEgKG1ldGEgZXhwYW5zaW9uKSkpXG4gICAgICBleHBhbnNpb24pKSlcblxuKGRlZm4gaW5zdGFsbC1tYWNybyFcbiAgXCJSZWdpc3RlcnMgZ2l2ZW4gYG1hY3JvYCB3aXRoIGEgZ2l2ZW4gYG5hbWVgXCJcbiAgW29wIGV4cGFuZGVyXVxuICAoc2V0ISAoZ2V0ICoqbWFjcm9zKiogKG5hbWUgb3ApKSBleHBhbmRlcikpXG5cbihkZWZuLSBtYWNyb1xuICBcIlJldHVybnMgdHJ1ZSBpZiBtYWNybyB3aXRoIGEgZ2l2ZW4gbmFtZSBpcyByZWdpc3RlcmVkXCJcbiAgW29wXVxuICAoYW5kIChzeW1ib2w/IG9wKVxuICAgICAgIChnZXQgKiptYWNyb3MqKiAobmFtZSBvcCkpKSlcblxuXG4oZGVmbiBkb3Qtc3ludGF4P1xuICBbb3BdXG4gIChhbmQgKHN5bWJvbD8gb3ApIChpZGVudGljYWw/IFxcLiAobmFtZSBvcCkpKSlcblxuKGRlZm4gbWV0aG9kLXN5bnRheD9cbiAgW29wXVxuICAobGV0IFtpZCAoYW5kIChzeW1ib2w/IG9wKSAobmFtZSBvcCkpXVxuICAgIChhbmQgaWRcbiAgICAgICAgIChpZGVudGljYWw/IFxcLiAoZmlyc3QgaWQpKVxuICAgICAgICAgKG5vdCAoaWRlbnRpY2FsPyBcXC0gKHNlY29uZCBpZCkpKVxuICAgICAgICAgKG5vdCAoaWRlbnRpY2FsPyBcXC4gaWQpKSkpKVxuXG4oZGVmbiBmaWVsZC1zeW50YXg/XG4gIFtvcF1cbiAgKGxldCBbaWQgKGFuZCAoc3ltYm9sPyBvcCkgKG5hbWUgb3ApKV1cbiAgICAoYW5kIGlkXG4gICAgICAgICAoaWRlbnRpY2FsPyBcXC4gKGZpcnN0IGlkKSlcbiAgICAgICAgIChpZGVudGljYWw/IFxcLSAoc2Vjb25kIGlkKSkpKSlcblxuKGRlZm4gbmV3LXN5bnRheD9cbiAgW29wXVxuICAobGV0IFtpZCAoYW5kIChzeW1ib2w/IG9wKSAobmFtZSBvcCkpXVxuICAgIChhbmQgaWRcbiAgICAgICAgIChpZGVudGljYWw/IFxcLiAobGFzdCBpZCkpXG4gICAgICAgICAobm90IChpZGVudGljYWw/IFxcLiBpZCkpKSkpXG5cbihkZWZuIG1ldGhvZC1zeW50YXhcbiAgXCJFeGFtcGxlOlxuICAnKC5zdWJzdHJpbmcgc3RyaW5nIDIgNSkgPT4gJygoYWdldCBzdHJpbmcgJ3N1YnN0cmluZykgMiA1KVwiXG4gIFtvcCB0YXJnZXQgJiBwYXJhbXNdXG4gIChsZXQgW29wLW1ldGEgKG1ldGEgb3ApXG4gICAgICAgIGZvcm0tc3RhcnQgKDpzdGFydCBvcC1tZXRhKVxuICAgICAgICB0YXJnZXQtbWV0YSAobWV0YSB0YXJnZXQpXG4gICAgICAgIG1lbWJlciAod2l0aC1tZXRhIChzeW1ib2wgKHN1YnMgKG5hbWUgb3ApIDEpKVxuICAgICAgICAgICAgICAgICA7OyBJbmNsdWRlIG1ldGFkYXQgZnJvbSB0aGUgb3JpZ2luYWwgc3ltYm9sIGp1c3RcbiAgICAgICAgICAgICAgICAgKGNvbmogb3AtbWV0YVxuICAgICAgICAgICAgICAgICAgICAgICB7OnN0YXJ0IHs6bGluZSAoOmxpbmUgZm9ybS1zdGFydClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmNvbHVtbiAoaW5jICg6Y29sdW1uIGZvcm0tc3RhcnQpKX19KSlcbiAgICAgICAgOzsgQWRkIG1ldGFkYXRhIHRvIGFnZXQgc3ltYm9sIHRoYXQgd2lsbCBtYXAgdG8gdGhlIGZpcnN0IGAuYFxuICAgICAgICA7OyBjaGFyYWN0ZXIgb2YgdGhlIG1ldGhvZCBuYW1lLlxuICAgICAgICBhZ2V0ICh3aXRoLW1ldGEgJ2FnZXRcbiAgICAgICAgICAgICAgIChjb25qIG9wLW1ldGFcbiAgICAgICAgICAgICAgICAgICAgIHs6ZW5kIHs6bGluZSAoOmxpbmUgZm9ybS1zdGFydClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Y29sdW1uIChpbmMgKDpjb2x1bW4gZm9ybS1zdGFydCkpfX0pKVxuXG4gICAgICAgIDs7IEZpcnN0IHR3byBmb3JtcyAoLnN1YnN0cmluZyBzdHJpbmcgLi4uKSBleHBhbmQgdG9cbiAgICAgICAgOzsgKChhZ2V0IHN0cmluZyAnc3Vic3RyaW5nKSAuLi4pIHRoZXJlIGZvciBleHBhbnNpb24gZ2V0c1xuICAgICAgICA7OyBwb3NpdGlvbiBtZXRhZGF0YSBmcm9tIHN0YXJ0IG9mIHRoZSBmaXJzdCBgLnN1YnN0cmluZ2AgZm9ybVxuICAgICAgICA7OyB0byB0aGUgZW5kIG9mIHRoZSBgc3RyaW5nYCBmb3JtLlxuICAgICAgICBtZXRob2QgKHdpdGgtbWV0YSBgKH5hZ2V0IH50YXJnZXQgKHF1b3RlIH5tZW1iZXIpKVxuICAgICAgICAgICAgICAgICAoY29uaiBvcC1tZXRhXG4gICAgICAgICAgICAgICAgICAgICAgIHs6ZW5kICg6ZW5kIChtZXRhIHRhcmdldCkpfSkpXVxuICAgIChpZiAobmlsPyB0YXJnZXQpXG4gICAgICAodGhyb3cgKEVycm9yIFwiTWFsZm9ybWVkIG1ldGhvZCBleHByZXNzaW9uLCBleHBlY3RpbmcgKC5tZXRob2Qgb2JqZWN0IC4uLilcIikpXG4gICAgICBgKH5tZXRob2QgfkBwYXJhbXMpKSkpXG5cbihkZWZuIGZpZWxkLXN5bnRheFxuICBcIkV4YW1wbGU6XG4gICcoLi1maWVsZCBvYmplY3QpID0+ICcoYWdldCBvYmplY3QgJ2ZpZWxkKVwiXG4gIFtmaWVsZCB0YXJnZXQgJiBtb3JlXVxuICAobGV0IFttZXRhZGF0YSAobWV0YSBmaWVsZClcbiAgICAgICAgc3RhcnQgKDpzdGFydCBtZXRhZGF0YSlcbiAgICAgICAgZW5kICg6ZW5kIG1ldGFkYXRhKVxuICAgICAgICBtZW1iZXIgKHdpdGgtbWV0YSAoc3ltYm9sIChzdWJzIChuYW1lIGZpZWxkKSAyKSlcbiAgICAgICAgICAgICAgICAgKGNvbmogbWV0YWRhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgezpzdGFydCB7OmxpbmUgKDpsaW5lIHN0YXJ0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Y29sdW1uICgrICg6Y29sdW1uIHN0YXJ0KSAyKX19KSldXG4gICAgKGlmIChvciAobmlsPyB0YXJnZXQpXG4gICAgICAgICAgICAoY291bnQgbW9yZSkpXG4gICAgICAodGhyb3cgKEVycm9yIFwiTWFsZm9ybWVkIG1lbWJlciBleHByZXNzaW9uLCBleHBlY3RpbmcgKC4tbWVtYmVyIHRhcmdldClcIikpXG4gICAgICBgKGFnZXQgfnRhcmdldCAocXVvdGUgfm1lbWJlcikpKSkpXG5cbihkZWZuIGRvdC1zeW50YXhcbiAgXCJFeGFtcGxlOlxuICAnKC4gb2JqZWN0IC1maWVsZCkgPT4gJyhhZ2V0IG9iamVjdCAnZmllbGQpXG4gICcoLiBzdHJpbmcgc3Vic3RyaW5nIDIgNSkgPT4gJygoYWdldCBzdHJpbmcgJ3N1YnN0cmluZykgMiA1KVwiXG4gIFtvcCB0YXJnZXQgZmllbGQgJiBwYXJhbXNdXG4gIChpZi1ub3QgKHN5bWJvbD8gZmllbGQpXG4gICAgKHRocm93IChFcnJvciBcIk1hbGZvcm1lZCAuIGZvcm1cIikpKVxuICAobGV0IFsqZmllbGQgKG5hbWUgZmllbGQpXVxuICAgIChhcHBseSAoaWYgKGlkZW50aWNhbD8gXFwtIChmaXJzdCAqZmllbGQpKSBmaWVsZC1zeW50YXggbWV0aG9kLXN5bnRheClcbiAgICAgICAgICAgKHN5bWJvbCAoc3RyIFxcLiAqZmllbGQpKSB0YXJnZXQgcGFyYW1zKSkpXG5cbihkZWZuIG5ldy1zeW50YXhcbiAgXCJFeGFtcGxlOlxuICAnKFBvaW50LiB4IHkpID0+ICcobmV3IFBvaW50IHggeSlcIlxuICBbb3AgJiBwYXJhbXNdXG4gIChsZXQgW2lkIChuYW1lIG9wKVxuICAgICAgICBpZC1tZXRhICg6bWV0YSBpZClcbiAgICAgICAgcmVuYW1lIChzdWJzIGlkIDAgKGRlYyAoY291bnQgaWQpKSlcbiAgICAgICAgOzsgY29uc3RydWN0dXIgc3ltYm9sIGluaGVyaXRzIG1ldGFkYSBmcm9tIHRoZSBmaXJzdCBgb3BgIGZvcm1cbiAgICAgICAgOzsgaXQncyBqdXN0IGl0J3MgZW5kIGNvbHVtbiBpbmZvIGlzIHVwZGF0ZWQgdG8gcmVmbGVjdCBzdWJ0cmFjdGlvblxuICAgICAgICA7OyBvZiBgLmAgY2hhcmFjdGVyLlxuICAgICAgICBjb25zdHJ1Y3RvciAod2l0aC1tZXRhIChzeW1ib2wgcmVuYW1lKVxuICAgICAgICAgICAgICAgICAgICAgIChjb25qIGlkLW1ldGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7OmVuZCB7OmxpbmUgKDpsaW5lICg6ZW5kIGlkLW1ldGEpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Y29sdW1uIChkZWMgKDpjb2x1bW4gKDplbmQgaWQtbWV0YSkpKX19KSlcbiAgICAgICAgb3BlcmF0b3IgKHdpdGgtbWV0YSAnbmV3XG4gICAgICAgICAgICAgICAgICAgKGNvbmogaWQtbWV0YVxuICAgICAgICAgICAgICAgICAgICAgICAgIHs6c3RhcnQgezpsaW5lICg6bGluZSAoOmVuZCBpZC1tZXRhKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Y29sdW1uIChkZWMgKDpjb2x1bW4gKDplbmQgaWQtbWV0YSkpKX19KSldXG4gICAgYChuZXcgfmNvbnN0cnVjdG9yIH5AcGFyYW1zKSkpXG5cbihkZWZuIGtleXdvcmQtaW52b2tlXG4gIFwiQ2FsbGluZyBhIGtleXdvcmQgZGVzdWdhcnMgdG8gcHJvcGVydHkgYWNjZXNzIHdpdGggdGhhdFxuICBrZXl3b3JkIG5hbWUgb24gdGhlIGdpdmVuIGFyZ3VtZW50OlxuICAnKDpmb28gYmFyKSA9PiAnKGdldCBiYXIgOmZvbylcIlxuICAoW2tleXdvcmQgdGFyZ2V0XVxuICAgIGAoZ2V0IH50YXJnZXQgfmtleXdvcmQpKVxuICAoW2tleXdvcmQgdGFyZ2V0IGRlZmF1bHQqXVxuICAgIGAoZ2V0IH50YXJnZXQgfmtleXdvcmQgfmRlZmF1bHQqKSkpXG5cbihkZWZuLSBkZXN1Z2FyXG4gIFtleHBhbmRlciBmb3JtXVxuICAobGV0IFtkZXN1Z2FyZWQgKGFwcGx5IGV4cGFuZGVyICh2ZWMgZm9ybSkpXG4gICAgICAgIG1ldGFkYXRhIChjb25qIHt9IChtZXRhIGZvcm0pIChtZXRhIGRlc3VnYXJlZCkpXVxuICAgICh3aXRoLW1ldGEgZGVzdWdhcmVkIG1ldGFkYXRhKSkpXG5cbihkZWZuIG1hY3JvZXhwYW5kLTFcbiAgXCJJZiBmb3JtIHJlcHJlc2VudHMgYSBtYWNybyBmb3JtLCByZXR1cm5zIGl0cyBleHBhbnNpb24sXG4gIGVsc2UgcmV0dXJucyBmb3JtLlwiXG4gIFtmb3JtIGVudl1cbiAgKGxldCBbb3AgKGFuZCAobGlzdD8gZm9ybSlcbiAgICAgICAgICAgICAgICAoZmlyc3QgZm9ybSkpXG4gICAgICAgIGV4cGFuZGVyIChtYWNybyBvcCldXG4gICAgKGNvbmQgZXhwYW5kZXIgKGV4cGFuZCBleHBhbmRlciBmb3JtIGVudilcbiAgICAgICAgICA7OyBDYWxsaW5nIGEga2V5d29yZCBjb21waWxlcyB0byBnZXR0aW5nIHZhbHVlIGZyb20gZ2l2ZW5cbiAgICAgICAgICA7OyBvYmplY3QgYXNzb2NpYXRlZCB3aXRoIHRoYXQga2V5OlxuICAgICAgICAgIDs7ICcoOmZvbyBiYXIpID0+ICcoZ2V0IGJhciA6Zm9vKVxuICAgICAgICAgIChrZXl3b3JkPyBvcCkgKGRlc3VnYXIga2V5d29yZC1pbnZva2UgZm9ybSlcbiAgICAgICAgICA7OyAnKC4gb2JqZWN0IG1ldGhvZCBmb28gYmFyKSA9PiAnKChhZ2V0IG9iamVjdCBtZXRob2QpIGZvbyBiYXIpXG4gICAgICAgICAgKGRvdC1zeW50YXg/IG9wKSAoZGVzdWdhciBkb3Qtc3ludGF4IGZvcm0pXG4gICAgICAgICAgOzsgJyguLWZpZWxkIG9iamVjdCkgPT4gJyhhZ2V0IG9iamVjdCAnZmllbGQpXG4gICAgICAgICAgKGZpZWxkLXN5bnRheD8gb3ApIChkZXN1Z2FyIGZpZWxkLXN5bnRheCBmb3JtKVxuICAgICAgICAgIDs7ICcoLnN1YnN0cmluZyBzdHJpbmcgMiA1KSA9PiAnKChhZ2V0IHN0cmluZyAnc3Vic3RyaW5nKSAyIDUpXG4gICAgICAgICAgKG1ldGhvZC1zeW50YXg/IG9wKSAoZGVzdWdhciBtZXRob2Qtc3ludGF4IGZvcm0pXG4gICAgICAgICAgOzsgJyhQb2ludC4geCB5KSA9PiAnKG5ldyBQb2ludCB4IHkpXG4gICAgICAgICAgKG5ldy1zeW50YXg/IG9wKSAoZGVzdWdhciBuZXctc3ludGF4IGZvcm0pXG4gICAgICAgICAgOmVsc2UgZm9ybSkpKVxuXG4oZGVmbiBtYWNyb2V4cGFuZFxuICBcIlJlcGVhdGVkbHkgY2FsbHMgbWFjcm9leHBhbmQtMSBvbiBmb3JtIHVudGlsIGl0IG5vIGxvbmdlclxuICByZXByZXNlbnRzIGEgbWFjcm8gZm9ybSwgdGhlbiByZXR1cm5zIGl0LlwiXG4gIFtmb3JtIGVudl1cbiAgKGxvb3AgW29yaWdpbmFsIGZvcm1cbiAgICAgICAgIGV4cGFuZGVkIChtYWNyb2V4cGFuZC0xIGZvcm0gZW52KV1cbiAgICAoaWYgKGlkZW50aWNhbD8gb3JpZ2luYWwgZXhwYW5kZWQpXG4gICAgICBvcmlnaW5hbFxuICAgICAgKHJlY3VyIGV4cGFuZGVkIChtYWNyb2V4cGFuZC0xIGV4cGFuZGVkIGVudikpKSkpXG5cblxuOzsgRGVmaW5lIGNvcmUgbWFjcm9zXG5cblxuOzsgVE9ETyBtYWtlIHRoaXMgbGFuZ3VhZ2UgaW5kZXBlbmRlbnRcblxuKGRlZm4gc3ludGF4LXF1b3RlIFtmb3JtXVxuICAoY29uZCAoc3ltYm9sPyBmb3JtKSAobGlzdCAncXVvdGUgZm9ybSlcbiAgICAgICAgKGtleXdvcmQ/IGZvcm0pIChsaXN0ICdxdW90ZSBmb3JtKVxuICAgICAgICAob3IgKG51bWJlcj8gZm9ybSlcbiAgICAgICAgICAgIChzdHJpbmc/IGZvcm0pXG4gICAgICAgICAgICAoYm9vbGVhbj8gZm9ybSlcbiAgICAgICAgICAgIChuaWw/IGZvcm0pXG4gICAgICAgICAgICAocmUtcGF0dGVybj8gZm9ybSkpIGZvcm1cblxuICAgICAgICAodW5xdW90ZT8gZm9ybSkgKHNlY29uZCBmb3JtKVxuICAgICAgICAodW5xdW90ZS1zcGxpY2luZz8gZm9ybSkgKHJlYWRlci1lcnJvciBcIklsbGVnYWwgdXNlIG9mIGB+QGAgZXhwcmVzc2lvbiwgY2FuIG9ubHkgYmUgcHJlc2VudCBpbiBhIGxpc3RcIilcblxuICAgICAgICAoZW1wdHk/IGZvcm0pIGZvcm1cblxuICAgICAgICA7O1xuICAgICAgICAoZGljdGlvbmFyeT8gZm9ybSkgKGxpc3QgJ2FwcGx5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGljdGlvbmFyeVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGNvbnMgJy5jb25jYXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChzZXF1ZW5jZS1leHBhbmQgKGFwcGx5IGNvbmNhdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHNlcSBmb3JtKSkpKSlcbiAgICAgICAgOzsgSWYgYSB2ZWN0b3IgZm9ybSBleHBhbmQgYWxsIHN1Yi1mb3JtcyBhbmQgY29uY2F0ZW5hdGVcbiAgICAgICAgOzsgdGhlbSB0b2dldGhlcjpcbiAgICAgICAgOztcbiAgICAgICAgOzsgW35hIGIgfkBjXSAtPiAoLmNvbmNhdCBbYV0gWyhxdW90ZSBiKV0gYylcbiAgICAgICAgKHZlY3Rvcj8gZm9ybSkgKGNvbnMgJy5jb25jYXQgKHNlcXVlbmNlLWV4cGFuZCBmb3JtKSlcblxuICAgICAgICA7OyBJZiBhIGxpc3QgZm9ybSBleHBhbmQgYWxsIHRoZSBzdWItZm9ybXMgYW5kIGFwcGx5XG4gICAgICAgIDs7IGNvbmNhdGVuYXRpb24gdG8gYSBsaXN0IGNvbnN0cnVjdG9yOlxuICAgICAgICA7O1xuICAgICAgICA7OyAofmEgYiB+QGMpIC0+IChhcHBseSBsaXN0ICguY29uY2F0IFthXSBbKHF1b3RlIGIpXSBjKSlcbiAgICAgICAgKGxpc3Q/IGZvcm0pIChpZiAoZW1wdHk/IGZvcm0pXG4gICAgICAgICAgICAgICAgICAgICAgIChjb25zICdsaXN0IG5pbClcbiAgICAgICAgICAgICAgICAgICAgICAgKGxpc3QgJ2FwcGx5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICdsaXN0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIChjb25zICcuY29uY2F0IChzZXF1ZW5jZS1leHBhbmQgZm9ybSkpKSlcblxuICAgICAgICA6ZWxzZSAocmVhZGVyLWVycm9yIFwiVW5rbm93biBDb2xsZWN0aW9uIHR5cGVcIikpKVxuKGRlZiBzeW50YXgtcXVvdGUtZXhwYW5kIHN5bnRheC1xdW90ZSlcblxuKGRlZm4gdW5xdW90ZS1zcGxpY2luZy1leHBhbmRcbiAgW2Zvcm1dXG4gIChpZiAodmVjdG9yPyBmb3JtKVxuICAgIGZvcm1cbiAgICAobGlzdCAndmVjIGZvcm0pKSlcblxuKGRlZm4gc2VxdWVuY2UtZXhwYW5kXG4gIFwiVGFrZXMgc2VxdWVuY2Ugb2YgZm9ybXMgYW5kIGV4cGFuZHMgdGhlbTpcblxuICAoKHVucXVvdGUgYSkpIC0+IChbYV0pXG4gICgodW5xdW90ZS1zcGxpY2luZyBhKSkgLT4gKGEpXG4gIChhKSAtPiAoWyhxdW90ZSBiKV0pXG4gICgodW5xdW90ZSBhKSBiICh1bnF1b3RlLXNwbGljaW5nIGEpKSAtPiAoW2FdIFsocXVvdGUgYildIGMpXCJcbiAgW2Zvcm1zXVxuICAobWFwIChmbiBbZm9ybV1cbiAgICAgICAgIChjb25kICh1bnF1b3RlPyBmb3JtKSBbKHNlY29uZCBmb3JtKV1cbiAgICAgICAgICAgICAgICh1bnF1b3RlLXNwbGljaW5nPyBmb3JtKSAodW5xdW90ZS1zcGxpY2luZy1leHBhbmQgKHNlY29uZCBmb3JtKSlcbiAgICAgICAgICAgICAgIDplbHNlIFsoc3ludGF4LXF1b3RlLWV4cGFuZCBmb3JtKV0pKVxuICAgICAgIGZvcm1zKSlcbihpbnN0YWxsLW1hY3JvISA6c3ludGF4LXF1b3RlIHN5bnRheC1xdW90ZS1leHBhbmQpXG5cbjs7IFRPRE86IE5ldyByZWFkZXIgdHJhbnNsYXRlcyBub3Q9IGNvcnJlY3RseVxuOzsgYnV0IGZvciB0aGUgdGltZSBiZWluZyB1c2Ugbm90LWVxdWFsIG5hbWVcbihkZWZuIGV4cGFuZC1ub3QtZXF1YWxcbiAgWyYgYm9keV1cbiAgYChub3QgKD0gfkBib2R5KSkpXG4oaW5zdGFsbC1tYWNybyEgOm5vdD0gZXhwYW5kLW5vdC1lcXVhbClcblxuKGRlZm4gZXhwYW5kLWlmLW5vdFxuICBcIkNvbXBsZW1lbnRzIHRoZSBgaWZgIGV4Y2x1c2l2ZSBjb25kaXRpb25hbCBicmFuY2guXCJcbiAgW2NvbmRpdGlvbiB0cnV0aHkgYWx0ZXJuYXRpdmVdXG4gIGAoaWYgKG5vdCB+Y29uZGl0aW9uKSB+dHJ1dGh5IH5hbHRlcm5hdGl2ZSkpXG4oaW5zdGFsbC1tYWNybyEgOmlmLW5vdCBleHBhbmQtaWYtbm90KVxuXG4oZGVmbiBleHBhbmQtY29tbWVudFxuICBcIklnbm9yZXMgYm9keSwgeWllbGRzIG5pbFwiXG4gIFsmIGJvZHldKVxuKGluc3RhbGwtbWFjcm8hIDpjb21tZW50IGV4cGFuZC1jb21tZW50KVxuXG4oZGVmbiBleHBhbmQtdGhyZWFkLWZpcnN0XG4gIFwiVGhyZWFkIGZpcnN0IG1hY3JvXCJcbiAgWyYgb3BlcmF0aW9uc11cbiAgKHJlZHVjZVxuICAgIChmbiBbZm9ybSBvcGVyYXRpb25dXG4gICAgICAoY29ucyAoZmlyc3Qgb3BlcmF0aW9uKVxuICAgICAgICAgICAgKGNvbnMgZm9ybSAocmVzdCBvcGVyYXRpb24pKSkpXG4gICAgKGZpcnN0IG9wZXJhdGlvbnMpXG4gICAgKG1hcCAjKGlmIChsaXN0PyAlKSAlIGAofiUpKVxuICAgICAgICAgKHJlc3Qgb3BlcmF0aW9ucykpKSlcbihpbnN0YWxsLW1hY3JvISA6LT4gZXhwYW5kLXRocmVhZC1maXJzdClcblxuKGRlZm4gZXhwYW5kLXRocmVhZC1sYXN0XG4gIFwiVGhyZWFkIGxhc3QgbWFjcm9cIlxuICBbJiBvcGVyYXRpb25zXVxuICAocmVkdWNlXG4gICAgKGZuIFtmb3JtIG9wZXJhdGlvbl0gKGNvbmNhdCBvcGVyYXRpb24gW2Zvcm1dKSlcbiAgICAoZmlyc3Qgb3BlcmF0aW9ucylcbiAgICAobWFwICMoaWYgKGxpc3Q/ICUpICUgYCh+JSkpXG4gICAgICAgICAocmVzdCBvcGVyYXRpb25zKSkpKVxuKGluc3RhbGwtbWFjcm8hIDotPj4gZXhwYW5kLXRocmVhZC1sYXN0KVxuXG4oZGVmbiBleHBhbmQtZG90c1xuICBcImZvcm0gPT4gZmllbGROYW1lLXN5bWJvbCBvciAoaW5zdGFuY2VNZXRob2ROYW1lLXN5bWJvbCBhcmdzKilcbiAgRXhwYW5kcyBpbnRvIGEgbWVtYmVyIGFjY2VzcyAoLikgb2YgdGhlIGZpcnN0IG1lbWJlciBvbiB0aGUgZmlyc3RcbiAgYXJndW1lbnQsIGZvbGxvd2VkIGJ5IHRoZSBuZXh0IG1lbWJlciBvbiB0aGUgcmVzdWx0LCBldGMuIEZvclxuICBpbnN0YW5jZTpcbiAgKC4uIGRvY3VtZW50IC1ib2R5IChnZXQtYXR0cmlidXRlIDpjbGFzcykpXG4gIGV4cGFuZHMgdG86XG4gICguICguIGRvY3VtZW50IC1ib2R5KSBnZXQtYXR0cmlidXRlIDpjbGFzcylcbiAgYnV0IGlzIGVhc2llciB0byB3cml0ZSwgcmVhZCwgYW5kIHVuZGVyc3RhbmQuXCJcbiAgW3ggJiBmb3Jtc11cbiAgYCgtPiB+eCB+QChtYXAgIyhpZiAobGlzdD8gJSkgKGNvbnMgJy4gJSkgKGxpc3QgJy4gJSkpXG4gICAgICAgICAgICAgICAgIGZvcm1zKSkpXG4oaW5zdGFsbC1tYWNybyEgOi4uIGV4cGFuZC1kb3RzKVxuXG4oZGVmbiBleHBhbmQtdGhyZWFkLWFzXG4gIFwiQmluZHMgbmFtZSB0byBleHByLCBldmFsdWF0ZXMgdGhlIGZpcnN0IGZvcm0gaW4gdGhlIGxleGljYWwgY29udGV4dFxuICBvZiB0aGF0IGJpbmRpbmcsIHRoZW4gYmluZHMgbmFtZSB0byB0aGF0IHJlc3VsdCwgcmVwZWF0aW5nIGZvciBlYWNoXG4gIHN1Y2Nlc3NpdmUgZm9ybSwgcmV0dXJuaW5nIHRoZSByZXN1bHQgb2YgdGhlIGxhc3QgZm9ybS5cIlxuICBbZXhwciBuYW1lICYgZm9ybXNdXG4gIGAobGV0IFt+bmFtZSB+ZXhwclxuICAgICAgICAgfkAobWFwY2F0IChmbiBbZm9ybV0gW25hbWUgZm9ybV0pXG4gICAgICAgICAgICAgICAgICAgZm9ybXMpXVxuICAgICB+bmFtZSkpXG4oaW5zdGFsbC1tYWNybyEgOmFzLT4gZXhwYW5kLXRocmVhZC1hcylcblxuXG4oZGVmbiBleHBhbmQtY29uZFxuICBcIlRha2VzIGEgc2V0IG9mIHRlc3QvZXhwciBwYWlycy4gSXQgZXZhbHVhdGVzIGVhY2ggdGVzdCBvbmUgYXQgYVxuICB0aW1lLiAgSWYgYSB0ZXN0IHJldHVybnMgbG9naWNhbCB0cnVlLCBjb25kIGV2YWx1YXRlcyBhbmQgcmV0dXJuc1xuICB0aGUgdmFsdWUgb2YgdGhlIGNvcnJlc3BvbmRpbmcgZXhwciBhbmQgZG9lc24ndCBldmFsdWF0ZSBhbnkgb2YgdGhlXG4gIG90aGVyIHRlc3RzIG9yIGV4cHJzLiAoY29uZCkgcmV0dXJucyBuaWwuXCJcbiAgWyYgY2xhdXNlc11cbiAgKGlmIChub3QgKGVtcHR5PyBjbGF1c2VzKSlcbiAgICAobGlzdCAnaWYgKGZpcnN0IGNsYXVzZXMpXG4gICAgICAgICAgKGlmIChlbXB0eT8gKHJlc3QgY2xhdXNlcykpXG4gICAgICAgICAgICAodGhyb3cgKEVycm9yIFwiY29uZCByZXF1aXJlcyBhbiBldmVuIG51bWJlciBvZiBmb3Jtc1wiKSlcbiAgICAgICAgICAgIChzZWNvbmQgY2xhdXNlcykpXG4gICAgICAgICAgKGNvbnMgJ2NvbmQgKHJlc3QgKHJlc3QgY2xhdXNlcykpKSkpKVxuKGluc3RhbGwtbWFjcm8hIDpjb25kIGV4cGFuZC1jb25kKVxuXG4oZGVmbiBleHBhbmQtY2FzZVxuICBcIlRha2VzIGFuIGV4cHJlc3Npb24sIGFuZCBhIHNldCBvZiBjbGF1c2VzLlxuICBFYWNoIGNsYXVzZSBjYW4gdGFrZSB0aGUgZm9ybSBvZiBlaXRoZXI6XG5cbiAgdGVzdC1jb25zdGFudCByZXN1bHQtZXhwclxuICAodGVzdC1jb25zdGFudDEgLi4uIHRlc3QtY29uc3RhbnROKSAgcmVzdWx0LWV4cHJcblxuICBUaGUgdGVzdC1jb25zdGFudHMgYXJlIG5vdCBldmFsdWF0ZWQuIFRoZXkgbXVzdCBiZSBjb21waWxlLXRpbWVcbiAgbGl0ZXJhbHMsIGFuZCBuZWVkIG5vdCBiZSBxdW90ZWQuICBJZiB0aGUgZXhwcmVzc2lvbiBpcyBlcXVhbCB0byBhXG4gIHRlc3QtY29uc3RhbnQsIHRoZSBjb3JyZXNwb25kaW5nIHJlc3VsdC1leHByIGlzIHJldHVybmVkLiBBIHNpbmdsZVxuICBkZWZhdWx0IGV4cHJlc3Npb24gY2FuIGZvbGxvdyB0aGUgY2xhdXNlcywgYW5kIGl0cyB2YWx1ZSB3aWxsIGJlXG4gIHJldHVybmVkIGlmIG5vIGNsYXVzZSBtYXRjaGVzLiBJZiBubyBkZWZhdWx0IGV4cHJlc3Npb24gaXMgcHJvdmlkZWRcbiAgYW5kIG5vIGNsYXVzZSBtYXRjaGVzLCBhbiBFcnJvciBpcyB0aHJvd24uXG5cbiAgVW5saWtlIGNvbmQgYW5kIGNvbmRwLCBjYXNlIGRvZXMgYSBjb25zdGFudC10aW1lIGRpc3BhdGNoLCB0aGVcbiAgY2xhdXNlcyBhcmUgbm90IGNvbnNpZGVyZWQgc2VxdWVudGlhbGx5LiAgQWxsIG1hbm5lciBvZiBjb25zdGFudFxuICBleHByZXNzaW9ucyBhcmUgYWNjZXB0YWJsZSBpbiBjYXNlLCBpbmNsdWRpbmcgbnVtYmVycywgc3RyaW5ncyxcbiAgc3ltYm9scywga2V5d29yZHMsIGFuZCBjb21wb3NpdGVzIHRoZXJlb2YuIE5vdGUgdGhhdCBzaW5jZVxuICBsaXN0cyBhcmUgdXNlZCB0byBncm91cCBtdWx0aXBsZSBjb25zdGFudHMgdGhhdCBtYXAgdG8gdGhlIHNhbWVcbiAgZXhwcmVzc2lvbiwgYSB2ZWN0b3IgY2FuIGJlIHVzZWQgdG8gbWF0Y2ggYSBsaXN0IGlmIG5lZWRlZC4gVGhlXG4gIHRlc3QtY29uc3RhbnRzIG5lZWQgbm90IGJlIGFsbCBvZiB0aGUgc2FtZSB0eXBlLlxuXG4gIERlcGVuZHMgb24gPVwiXG4gIFtlICYgY2xhdXNlc11cbiAgKGxldCBbc3ltICAgICAgKGlmIChzeW1ib2w/IGUpIGUgKGdlbnN5bSA6Y2FzZS1iaW5kaW5nKSlcbiAgICAgICAgcGFpcnMgICAgKHBhcnRpdGlvbiAyIGNsYXVzZXMpXG4gICAgICAgIGVxKiAgICAgIChmbiBbY10gYCg9IH5zeW0gJ35jKSlcbiAgICAgICAgdGFpbCAgICAgKGlmIChvZGQ/IChjb3VudCBjbGF1c2VzKSlcbiAgICAgICAgICAgICAgICAgICAobGFzdCBjbGF1c2VzKVxuICAgICAgICAgICAgICAgICAgIGAodGhyb3cgKEVycm9yIChzdHIgXCJObyBtYXRjaGluZyBjbGF1c2U6IFwiIH5zeW0pKSkpXVxuICAgIChsb29wIFtwYWlycyBwYWlycywgY29uZHMgW11dXG4gICAgICAoaWYgKGVtcHR5PyBwYWlycylcbiAgICAgICAgKGxldCBbcmVzdWx0IGAoY29uZCB+QGNvbmRzIDplbHNlIH50YWlsKV1cbiAgICAgICAgICAoaWYgKD0gZSBzeW0pIHJlc3VsdCBgKGxldCBbfnN5bSB+ZV0gfnJlc3VsdCkpKVxuICAgICAgICAobGV0IFt4IChmaXJzdCBwYWlycyksIHhzIChyZXN0IHBhaXJzKSwgY29uc3RzIChmaXJzdCB4KSwgcmVzIChzZWNvbmQgeCldXG4gICAgICAgICAgKHJlY3VyIHhzIChjb25qIGNvbmRzIChpZi1ub3QgKGxpc3Q/IGNvbnN0cylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZXEqIGNvbnN0cylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgKG9yIH5AKG1hcCBlcSogY29uc3RzKSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcykpKSkpKSlcbihpbnN0YWxsLW1hY3JvISA6Y2FzZSBleHBhbmQtY2FzZSlcblxuKGRlZm4gZXhwYW5kLWNvbmRwXG4gIFwiVGFrZXMgYSBiaW5hcnkgcHJlZGljYXRlLCBhbiBleHByZXNzaW9uLCBhbmQgYSBzZXQgb2YgY2xhdXNlcy5cbiAgRWFjaCBjbGF1c2UgY2FuIHRha2UgdGhlIGZvcm0gb2YgZWl0aGVyOlxuXG4gIHRlc3QtZXhwciByZXN1bHQtZXhwclxuICB0ZXN0LWV4cHIgOj4+IHJlc3VsdC1mblxuXG4gIE5vdGUgOj4+IGlzIGFuIG9yZGluYXJ5IGtleXdvcmQuXG5cbiAgRm9yIGVhY2ggY2xhdXNlLCAocHJlZCB0ZXN0LWV4cHIgZXhwcikgaXMgZXZhbHVhdGVkLiBJZiBpdCByZXR1cm5zXG4gIGxvZ2ljYWwgdHJ1ZSwgdGhlIGNsYXVzZSBpcyBhIG1hdGNoLiBJZiBhIGJpbmFyeSBjbGF1c2UgbWF0Y2hlcywgdGhlXG4gIHJlc3VsdC1leHByIGlzIHJldHVybmVkLCBpZiBhIHRlcm5hcnkgY2xhdXNlIG1hdGNoZXMsIGl0cyByZXN1bHQtZm4sXG4gIHdoaWNoIG11c3QgYmUgYSB1bmFyeSBmdW5jdGlvbiwgaXMgY2FsbGVkIHdpdGggdGhlIHJlc3VsdCBvZiB0aGVcbiAgcHJlZGljYXRlIGFzIGl0cyBhcmd1bWVudCwgdGhlIHJlc3VsdCBvZiB0aGF0IGNhbGwgYmVpbmcgdGhlIHJldHVyblxuICB2YWx1ZSBvZiBjb25kcC4gQSBzaW5nbGUgZGVmYXVsdCBleHByZXNzaW9uIGNhbiBmb2xsb3cgdGhlIGNsYXVzZXMsXG4gIGFuZCBpdHMgdmFsdWUgd2lsbCBiZSByZXR1cm5lZCBpZiBubyBjbGF1c2UgbWF0Y2hlcy4gSWYgbm8gZGVmYXVsdFxuICBleHByZXNzaW9uIGlzIHByb3ZpZGVkIGFuZCBubyBjbGF1c2UgbWF0Y2hlcywgYW4gRXJyb3IgaXMgdGhyb3duLlwiXG4gIFtwcmVkIGV4cHIgJiBjbGF1c2VzXVxuICAobGV0IFtzeW0qICAgIChnZW5zeW0gOmNvbmRwLWJpbmRpbmcpXG4gICAgICAgIHN5bSAgICAgKGlmIChzeW1ib2w/IGV4cHIpIGV4cHIgc3ltKilcbiAgICAgICAgY29tcGFyZSAoZm4gW3hdIGAofnByZWQgfnggfnN5bSkpXG4gICAgICAgIHNwbGl0cyAgKGZuIHNwbGl0cyBbeHNdXG4gICAgICAgICAgICAgICAgICAoY29uZCAoZW1wdHk/IHhzKSAgICAgICAgICBgKHRocm93IChFcnJvciAoc3RyIFwiTm8gbWF0Y2hpbmcgY2xhdXNlOiBcIiB+c3ltKSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAoPSAxIChjb3VudCB4cykpICAgICAoZmlyc3QgeHMpXG4gICAgICAgICAgICAgICAgICAgICAgICAoPSAnOj4+IChzZWNvbmQgeHMpKSBgKGlmLWxldCBbfnN5bSogfihjb21wYXJlIChmaXJzdCB4cykpXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKH4odGhpcmQgeHMpIH5zeW0qKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfihzcGxpdHMgKGRyb3AgMyB4cykpKVxuICAgICAgICAgICAgICAgICAgICAgICAgOmVsc2UgICAgICAgICAgICAgICAgYChpZiB+KGNvbXBhcmUgKGZpcnN0IHhzKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH4oc2Vjb25kIHhzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfihzcGxpdHMgKGRyb3AgMiB4cykpKSkpXVxuICAgIChpZiAoPSBzeW0gZXhwcilcbiAgICAgIChzcGxpdHMgY2xhdXNlcylcbiAgICAgIGAobGV0IFt+c3ltIH5leHByXSB+KHNwbGl0cyBjbGF1c2VzKSkpKSlcbihpbnN0YWxsLW1hY3JvISA6Y29uZHAgZXhwYW5kLWNvbmRwKVxuXG5cbihkZWZuLSAqdGhyZWFkIFtpbnNlcnQgc3ltIHRlc3QgZm9ybV1cbiAgKGxldCBbZm9ybSAoaWYgKGxpc3Q/IGZvcm0pIGZvcm0gKGxpc3QgZm9ybSkpXVxuICAgIGAoaWYgfnRlc3RcbiAgICAgICB+c3ltXG4gICAgICAgfihpbnNlcnQgc3ltIGZvcm0pKSkpXG5cbihkZWZuLSAqY29uZC10aHJlYWQgW2V4cHIgY2xhdXNlcyBpbnNlcnRdXG4gIChsZXQgW3N5bSAoZ2Vuc3ltIDpjb25kLXRocmVhZC1iaW5kaW5nKV1cbiAgICBgKGFzLT4gfmV4cHIgfnN5bVxuICAgICAgICAgICB+QChtYXAgIygqdGhyZWFkIGluc2VydCBzeW0gYChub3QgfihmaXJzdCAlKSkgKHNlY29uZCAlKSlcbiAgICAgICAgICAgICAgICAgIChwYXJ0aXRpb24gMiBjbGF1c2VzKSkpKSlcblxuKGRlZm4gZXhwYW5kLWNvbmQtdGhyZWFkLWZpcnN0XG4gIFwiVGFrZXMgYW4gZXhwcmVzc2lvbiBhbmQgYSBzZXQgb2YgdGVzdC9mb3JtIHBhaXJzLiBUaHJlYWRzIGV4cHIgKHZpYSAtPilcbiAgdGhyb3VnaCBlYWNoIGZvcm0gZm9yIHdoaWNoIHRoZSBjb3JyZXNwb25kaW5nIHRlc3RcbiAgZXhwcmVzc2lvbiBpcyB0cnVlLiBOb3RlIHRoYXQsIHVubGlrZSBjb25kIGJyYW5jaGluZywgY29uZC0+IHRocmVhZGluZyBkb2VzXG4gIG5vdCBzaG9ydCBjaXJjdWl0IGFmdGVyIHRoZSBmaXJzdCB0cnVlIHRlc3QgZXhwcmVzc2lvbi5cIlxuICBbZXhwciAmIGNsYXVzZXNdXG4gICgqY29uZC10aHJlYWQgZXhwciBjbGF1c2VzIChmbiBbc3ltIGZvcm1dIChhcHBseSBsaXN0IChmaXJzdCBmb3JtKSBzeW0gKHZlYyAocmVzdCBmb3JtKSkpKSkpXG4oaW5zdGFsbC1tYWNybyEgOmNvbmQtPiBleHBhbmQtY29uZC10aHJlYWQtZmlyc3QpXG5cbihkZWZuIGV4cGFuZC1jb25kLXRocmVhZC1sYXN0XG4gIFwiVGFrZXMgYW4gZXhwcmVzc2lvbiBhbmQgYSBzZXQgb2YgdGVzdC9mb3JtIHBhaXJzLiBUaHJlYWRzIGV4cHIgKHZpYSAtPj4pXG4gIHRocm91Z2ggZWFjaCBmb3JtIGZvciB3aGljaCB0aGUgY29ycmVzcG9uZGluZyB0ZXN0IGV4cHJlc3Npb25cbiAgaXMgdHJ1ZS4gIE5vdGUgdGhhdCwgdW5saWtlIGNvbmQgYnJhbmNoaW5nLCBjb25kLT4+IHRocmVhZGluZyBkb2VzIG5vdCBzaG9ydCBjaXJjdWl0XG4gIGFmdGVyIHRoZSBmaXJzdCB0cnVlIHRlc3QgZXhwcmVzc2lvbi5cIlxuICBbZXhwciAmIGNsYXVzZXNdXG4gICgqY29uZC10aHJlYWQgZXhwciBjbGF1c2VzIChmbiBbc3ltIGZvcm1dIChhcHBseSBsaXN0ICh2ZWMgKGNvbmNhdCBmb3JtIFtzeW1dKSkpKSkpXG4oaW5zdGFsbC1tYWNybyEgOmNvbmQtPj4gZXhwYW5kLWNvbmQtdGhyZWFkLWxhc3QpXG5cblxuKGRlZm4tICpzb21lLXRocmVhZCBbZXhwciBmb3JtcyBpbnNlcnRdXG4gIChsZXQgW3N5bSAoZ2Vuc3ltIDpzb21lLXRocmVhZC1iaW5kaW5nKV1cbiAgICBgKGFzLT4gfmV4cHIgfnN5bVxuICAgICAgICAgICB+QChtYXAgIygqdGhyZWFkIGluc2VydCBzeW0gYChuaWw/IH5zeW0pICUpXG4gICAgICAgICAgICAgICAgICBmb3JtcykpKSlcblxuKGRlZm4gZXhwYW5kLXNvbWUtdGhyZWFkLWZpcnN0XG4gIFwiV2hlbiBleHByIGlzIG5vdCBuaWwsIHRocmVhZHMgaXQgaW50byB0aGUgZmlyc3QgZm9ybSAodmlhIC0+KSxcbiAgYW5kIHdoZW4gdGhhdCByZXN1bHQgaXMgbm90IG5pbCwgdGhyb3VnaCB0aGUgbmV4dCBldGNcblxuICBEZXBlbmRzIG9uIG5pbD9cIlxuICBbZXhwciAmIGZvcm1zXVxuICAoKnNvbWUtdGhyZWFkIGV4cHIgZm9ybXMgKGZuIFtzeW0gZm9ybV0gKGFwcGx5IGxpc3QgKGZpcnN0IGZvcm0pIHN5bSAodmVjIChyZXN0IGZvcm0pKSkpKSlcbihpbnN0YWxsLW1hY3JvISA6c29tZS0+IGV4cGFuZC1zb21lLXRocmVhZC1maXJzdClcblxuKGRlZm4gZXhwYW5kLXNvbWUtdGhyZWFkLWxhc3RcbiAgXCJXaGVuIGV4cHIgaXMgbm90IG5pbCwgdGhyZWFkcyBpdCBpbnRvIHRoZSBmaXJzdCBmb3JtICh2aWEgLT4+KSxcbiAgYW5kIHdoZW4gdGhhdCByZXN1bHQgaXMgbm90IG5pbCwgdGhyb3VnaCB0aGUgbmV4dCBldGNcblxuICBEZXBlbmRzIG9uIG5pbD9cIlxuICBbZXhwciAmIGZvcm1zXVxuICAoKnNvbWUtdGhyZWFkIGV4cHIgZm9ybXMgKGZuIFtzeW0gZm9ybV0gKGFwcGx5IGxpc3QgKHZlYyAoY29uY2F0IGZvcm0gW3N5bV0pKSkpKSlcbihpbnN0YWxsLW1hY3JvISA6c29tZS0+PiBleHBhbmQtc29tZS10aHJlYWQtbGFzdClcblxuXG4oZGVmbiBleHBhbmQtZGVmblxuICBcIlNhbWUgYXMgKGRlZiBuYW1lIChmbiBbcGFyYW1zKiBdIGV4cHJzKikpIG9yXG4gIChkZWYgbmFtZSAoZm4gKFtwYXJhbXMqIF0gZXhwcnMqKSspKSB3aXRoIGFueSBkb2Mtc3RyaW5nIG9yIGF0dHJzIGFkZGVkXG4gIHRvIHRoZSB2YXIgbWV0YWRhdGFcIlxuICBbJmZvcm0gbmFtZSAmIGRvYyttZXRhK2JvZHldXG4gIChsZXQgW2RvYyAoaWYgKHN0cmluZz8gKGZpcnN0IGRvYyttZXRhK2JvZHkpKVxuICAgICAgICAgICAgICAoZmlyc3QgZG9jK21ldGErYm9keSkpXG5cbiAgICAgICAgOzsgSWYgZG9jc3RyaW5nIGlzIGZvdW5kIGl0J3Mgbm90IHBhcnQgb2YgYm9keS5cbiAgICAgICAgbWV0YStib2R5IChpZiBkb2MgKHJlc3QgZG9jK21ldGErYm9keSkgZG9jK21ldGErYm9keSlcblxuICAgICAgICA7OyBkZWZuIG1heSBjb250YWluIGF0dHJpYnV0ZSBsaXN0IGFmdGVyXG4gICAgICAgIDs7IGRvY3N0cmluZyBvciBhIG5hbWUsIGluIHdoaWNoIGNhc2UgaXQnc1xuICAgICAgICA7OyBtZXJnZWQgaW50byBuYW1lIG1ldGFkYXRhLlxuICAgICAgICBtZXRhZGF0YSAoaWYgKGRpY3Rpb25hcnk/IChmaXJzdCBtZXRhK2JvZHkpKVxuICAgICAgICAgICAgICAgICAgIChjb25qIHs6ZG9jIGRvY30gKGZpcnN0IG1ldGErYm9keSkpKVxuXG4gICAgICAgIDs7IElmIG1ldGFkYXRhIG1hcCBpcyBmb3VuZCBpdCdzIG5vdCBwYXJ0IG9mIGJvZHkuXG4gICAgICAgIGJvZHkgKGlmIG1ldGFkYXRhIChyZXN0IG1ldGErYm9keSkgbWV0YStib2R5KVxuXG4gICAgICAgIDs7IENvbWJpbmUgYWxsIHRoZSBtZXRhZGF0YSBhbmQgYWRkIHRvIGEgbmFtZS5cbiAgICAgICAgaWQgKHdpdGgtbWV0YSBuYW1lIChjb25qIChvciAobWV0YSBuYW1lKSB7fSkgbWV0YWRhdGEpKVxuXG4gICAgICAgIGZuICh3aXRoLW1ldGEgYChmbiB+aWQgfkBib2R5KSAobWV0YSAmZm9ybSkpXVxuICAgIGAoZGVmIH5pZCB+Zm4pKSlcbihpbnN0YWxsLW1hY3JvISA6ZGVmbiAod2l0aC1tZXRhIGV4cGFuZC1kZWZuIHs6aW1wbGljaXQgWzomZm9ybV19KSlcblxuXG4oZGVmbiBleHBhbmQtcHJpdmF0ZS1kZWZuXG4gIFwiU2FtZSBhcyAoZGVmIG5hbWUgKGZuIFtwYXJhbXMqIF0gZXhwcnMqKSkgb3JcbiAgKGRlZiBuYW1lIChmbiAoW3BhcmFtcyogXSBleHBycyopKykpIHdpdGggYW55IGRvYy1zdHJpbmcgb3IgYXR0cnMgYWRkZWRcbiAgdG8gdGhlIHZhciBtZXRhZGF0YVwiXG4gIFtuYW1lICYgYm9keV1cbiAgKGxldCBbbWV0YWRhdGEgKGNvbmogKG9yIChtZXRhIG5hbWUpIHt9KVxuICAgICAgICAgICAgICAgICAgICAgICB7OnByaXZhdGUgdHJ1ZX0pXG4gICAgICAgIGlkICh3aXRoLW1ldGEgbmFtZSBtZXRhZGF0YSldXG4gICAgYChkZWZuIH5pZCB+QGJvZHkpKSlcbihpbnN0YWxsLW1hY3JvIDpkZWZuLSBleHBhbmQtcHJpdmF0ZS1kZWZuKVxuXG5cbihkZWZuIGV4cGFuZC1sYXp5LXNlcVxuICBcIlRha2VzIGEgYm9keSBvZiBleHByZXNzaW9ucyB0aGF0IHJldHVybnMgYW4gSVNlcSBvciBuaWwsIGFuZCB5aWVsZHNcbiAgYSBTZXFhYmxlIG9iamVjdCB0aGF0IHdpbGwgaW52b2tlIHRoZSBib2R5IG9ubHkgdGhlIGZpcnN0IHRpbWUgc2VxXG4gIGlzIGNhbGxlZCwgYW5kIHdpbGwgY2FjaGUgdGhlIHJlc3VsdCBhbmQgcmV0dXJuIGl0IG9uIGFsbCBzdWJzZXF1ZW50XG4gIHNlcSBjYWxscy4gU2VlIGFsc28gLSByZWFsaXplZD9cblxuICBEZXBlbmRzIG9uIGxhenktc2VxXCJcbiAgezphZGRlZCBcIjEuMFwifVxuICBbJiBib2R5XVxuICBgKC5jYWxsIGxhenktc2VxIG5pbCBmYWxzZSAoZm4gW10gfkBib2R5KSkpXG4oaW5zdGFsbC1tYWNybyA6bGF6eS1zZXEgZXhwYW5kLWxhenktc2VxKVxuXG5cbihkZWZuIGV4cGFuZC13aGVuXG4gIFwiRXZhbHVhdGVzIHRlc3QuIElmIGxvZ2ljYWwgdHJ1ZSwgZXZhbHVhdGVzIGJvZHkgaW4gYW4gaW1wbGljaXQgZG8uXCJcbiAgW3Rlc3QgJiBib2R5XVxuICBgKGlmIH50ZXN0IChkbyB+QGJvZHkpKSlcbihpbnN0YWxsLW1hY3JvIDp3aGVuIGV4cGFuZC13aGVuKVxuXG4oZGVmbiBleHBhbmQtd2hlbi1ub3RcbiAgXCJFdmFsdWF0ZXMgdGVzdC4gSWYgbG9naWNhbCBmYWxzZSwgZXZhbHVhdGVzIGJvZHkgaW4gYW4gaW1wbGljaXQgZG8uXCJcbiAgW3Rlc3QgJiBib2R5XVxuICBgKHdoZW4gKG5vdCB+dGVzdCkgfkBib2R5KSlcbihpbnN0YWxsLW1hY3JvIDp3aGVuLW5vdCBleHBhbmQtd2hlbi1ub3QpXG5cblxuKGRlZm4gZXhwYW5kLWlmLWxldFxuICBcImJpbmRpbmdzID0+IGJpbmRpbmctZm9ybSB0ZXN0XG4gIGJvZHkgPT4gW3RoZW4gZWxzZV1cbiAgSWYgdGVzdCBpcyB0cnVlLCBldmFsdWF0ZXMgdGhlbiB3aXRoIGJpbmRpbmctZm9ybSBib3VuZCB0byB0aGUgdmFsdWUgb2ZcbiAgdGVzdCwgaWYgbm90LCB5aWVsZHMgZWxzZSouXCJcbiAgW2JpbmRpbmdzIHRoZW4gZWxzZSpdXG4gIChsZXQgW25hbWUgKGZpcnN0IGJpbmRpbmdzKSwgdGVzdCAoc2Vjb25kIGJpbmRpbmdzKSwgc3ltIChnZW5zeW0gOmlmLWxldC1iaW5kaW5nKV1cbiAgICBgKGxldCBbfnN5bSB+dGVzdF1cbiAgICAgICAoaWYgfnN5bSAobGV0IFt+bmFtZSB+c3ltXSB+dGhlbikgfmVsc2UqKSkpKVxuKGluc3RhbGwtbWFjcm8gOmlmLWxldCBleHBhbmQtaWYtbGV0KVxuXG4oZGVmbiBleHBhbmQtd2hlbi1sZXRcbiAgXCJiaW5kaW5ncyA9PiBiaW5kaW5nLWZvcm0gdGVzdFxuICBXaGVuIHRlc3QgaXMgdHJ1ZSwgZXZhbHVhdGVzIGJvZHkgd2l0aCBiaW5kaW5nLWZvcm0gYm91bmQgdG8gdGhlIHZhbHVlIG9mIHRlc3QuXCJcbiAgW2JpbmRpbmdzICYgYm9keV1cbiAgYChpZi1sZXQgfmJpbmRpbmdzIChkbyB+QGJvZHkpKSlcbihpbnN0YWxsLW1hY3JvIDp3aGVuLWxldCBleHBhbmQtd2hlbi1sZXQpXG5cblxuKGRlZm4gZXhwYW5kLWlmLXNvbWVcbiAgXCJiaW5kaW5ncyA9PiBiaW5kaW5nLWZvcm0gdGVzdFxuICBJZiB0ZXN0IGlzIG5vdCBuaWwsIGV2YWx1YXRlcyB0aGVuIHdpdGggYmluZGluZy1mb3JtIGJvdW5kIHRvIHRoZVxuICB2YWx1ZSBvZiB0ZXN0LCBpZiBub3QsIHlpZWxkcyBlbHNlKi5cblxuICBEZXBlbmRzIG9uIG5pbD9cIlxuICBbYmluZGluZ3MgdGhlbiBlbHNlKl1cbiAgKGxldCBbbmFtZSAoZmlyc3QgYmluZGluZ3MpLCB0ZXN0IChzZWNvbmQgYmluZGluZ3MpLCBzeW0gKGlmIChzeW1ib2w/IG5hbWUpIG5hbWUgKGdlbnN5bSA6aWYtc29tZS1iaW5kaW5nKSldXG4gICAgYChsZXQgW35zeW0gfnRlc3RdXG4gICAgICAgKGlmLW5vdCAobmlsPyB+c3ltKVxuICAgICAgICAgKGxldCBbfm5hbWUgfnN5bV0gfnRoZW4pXG4gICAgICAgICB+ZWxzZSopKSkpXG4oaW5zdGFsbC1tYWNybyA6aWYtc29tZSBleHBhbmQtaWYtc29tZSlcblxuKGRlZm4gZXhwYW5kLXdoZW4tc29tZVxuICBcImJpbmRpbmdzID0+IGJpbmRpbmctZm9ybSB0ZXN0XG4gIFdoZW4gdGVzdCBpcyBub3QgbmlsLCBldmFsdWF0ZXMgYm9keSB3aXRoIGJpbmRpbmctZm9ybSBib3VuZCB0byB0aGVcbiAgdmFsdWUgb2YgdGVzdC5cIlxuICBbYmluZGluZ3MgJiBib2R5XVxuICBgKGlmLXNvbWUgfmJpbmRpbmdzIChkbyB+QGJvZHkpKSlcbihpbnN0YWxsLW1hY3JvIDp3aGVuLXNvbWUgZXhwYW5kLXdoZW4tc29tZSlcblxuXG4oZGVmbiBleHBhbmQtd2hlbi1maXJzdFxuICBcImJpbmRpbmdzID0+IHggeHNcbiAgUm91Z2hseSB0aGUgc2FtZSBhcyAod2hlbiAoc2VxIHhzKSAobGV0IFt4IChmaXJzdCB4cyldIGJvZHkpKSBidXQgeHMgaXMgZXZhbHVhdGVkIG9ubHkgb25jZVxuXG4gIERlcGVuZHMgb24gc2VxKlwiXG4gIFtiaW5kaW5ncyAmIGJvZHldXG4gIChsZXQgW25hbWUgKGZpcnN0IGJpbmRpbmdzKSwgdGVzdCAoc2Vjb25kIGJpbmRpbmdzKV1cbiAgICBgKHdoZW4tbGV0IFtbfm5hbWVdIChzZXEqIH50ZXN0KV0gfkBib2R5KSkpXG4oaW5zdGFsbC1tYWNybyA6d2hlbi1maXJzdCBleHBhbmQtd2hlbi1maXJzdClcblxuXG4oZGVmbiBleHBhbmQtd2hpbGVcbiAgXCJSZXBlYXRlZGx5IGV4ZWN1dGVzIGJvZHkgd2hpbGUgdGVzdCBleHByZXNzaW9uIGlzIHRydWUuIFByZXN1bWVzXG4gIHNvbWUgc2lkZS1lZmZlY3Qgd2lsbCBjYXVzZSB0ZXN0IHRvIGJlY29tZSBmYWxzZS9uaWwuIFJldHVybnMgbmlsXCJcbiAgW3Rlc3QgJiBib2R5XVxuICBgKGxvb3AgW11cbiAgICAgKHdoZW4gfnRlc3QgfkBib2R5IChyZWN1cikpKSlcbihpbnN0YWxsLW1hY3JvIDp3aGlsZSBleHBhbmQtd2hpbGUpXG5cblxuKGRlZm4gZXhwYW5kLWRvdG9cbiAgXCJFdmFsdWF0ZXMgeCB0aGVuIGNhbGxzIGFsbCBvZiB0aGUgbWV0aG9kcyBhbmQgZnVuY3Rpb25zIHdpdGggdGhlXG4gIHZhbHVlIG9mIHggc3VwcGxpZWQgYXQgdGhlIGZyb250IG9mIHRoZSBnaXZlbiBhcmd1bWVudHMuICBUaGUgZm9ybXNcbiAgYXJlIGV2YWx1YXRlZCBpbiBvcmRlci4gIFJldHVybnMgeC5cbiAgKGRvdG8gKE1hcC4pICguc2V0IDphIDEpICguc2V0IDpiIDIpKVwiXG4gIFt4ICYgZm9ybXNdXG4gIChsZXQgW3N5bSAoZ2Vuc3ltIDpkb3RvLWJpbmRpbmcpXVxuICAgIGAobGV0IFt+c3ltIH54XVxuICAgICAgIH5AKG1hcCAjKGNvbmNhdCBbKGZpcnN0ICUpIHN5bV0gKHJlc3QgJSkpIGZvcm1zKVxuICAgICAgIH5zeW0pKSlcbihpbnN0YWxsLW1hY3JvIDpkb3RvIGV4cGFuZC1kb3RvKVxuXG4oZGVmbiBleHBhbmQtZG90aW1lc1xuICBcImJpbmRpbmdzID0+IG5hbWUgblxuICBSZXBlYXRlZGx5IGV4ZWN1dGVzIGJvZHkgKHByZXN1bWFibHkgZm9yIHNpZGUtZWZmZWN0cykgd2l0aCBuYW1lXG4gIGJvdW5kIHRvIGludGVnZXJzIGZyb20gMCB0aHJvdWdoIG4tMS5cIlxuICBbYmluZGluZ3MgJiBib2R5XVxuICAobGV0IFtuYW1lIChmaXJzdCBiaW5kaW5ncyksICBuIChzZWNvbmQgYmluZGluZ3MpLCAgc3ltIChnZW5zeW0gOmRvdGltZXMtYmluZGluZyldXG4gICAgYChsZXQgW35zeW0gfm5dXG4gICAgICAgKGxvb3AgW35uYW1lIDBdXG4gICAgICAgICAod2hlbiAoPCB+bmFtZSB+c3ltKVxuICAgICAgICAgICB+QGJvZHlcbiAgICAgICAgICAgKHJlY3VyIChpbmMgfm5hbWUpKSkpKSkpXG4oaW5zdGFsbC1tYWNybyA6ZG90aW1lcyBleHBhbmQtZG90aW1lcylcblxuXG4oZGVmbi0gZm9yLXN0ZXAgW2NvbnRleHQgbG9vcCAmIG1vZGlmaWVyc11cbiAgKGxldCBbaXRlciAgKDppdGVyIGNvbnRleHQpLCAgY29sbCAoOmNvbGwgY29udGV4dCksICBib2R5ICg6Ym9keSBjb250ZXh0KSwgIHN1YnNlcSAoOnN1YnNlcSBjb250ZXh0KVxuICAgICAgICBib2R5KiAoaWYtbm90IHN1YnNlcSBib2R5IGAobGV0IFt+c3Vic2VxIH5ib2R5XVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChpZiAoZW1wdHk/IH5zdWJzZXEpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAocmVjdXIgKHJlc3QgfmNvbGwpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGxhenktY29uY2F0IH5zdWJzZXEgKH5pdGVyIChyZXN0IH5jb2xsKSkpKSkpXG4gICAgICAgIG5leHQgIChsb29wIFttb2RzIChyZXZlcnNlIG1vZGlmaWVycyksIGJvZHkgYm9keSpdXG4gICAgICAgICAgICAgICAgKGlmIChlbXB0eT8gbW9kcylcbiAgICAgICAgICAgICAgICAgIGJvZHlcbiAgICAgICAgICAgICAgICAgIChsZXQgW20gKGZpcnN0IG1vZHMpLCAgaXRlbSAoZmlyc3QgbSksICBhcmcgKHNlY29uZCBtKV1cbiAgICAgICAgICAgICAgICAgICAgKHJlY3VyIChyZXN0IG1vZHMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAoY29uZCAoPSBpdGVtICc6bGV0KSAgIGAobGV0IH5hcmcgfmJvZHkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoPSBpdGVtICc6d2hpbGUpIGAoaWYgfmFyZyB+Ym9keSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICg9IGl0ZW0gJzp3aGVuKSAgYChpZiB+YXJnIH5ib2R5IChyZWN1ciAocmVzdCB+Y29sbCkpKSkpKSkpXVxuICAgIChtZXJnZSBjb250ZXh0XG4gICAgICAgICAgIHs6c3Vic2VxIChnZW5zeW0gOmZvci1zdWJzZXEpXG4gICAgICAgICAgICA6Ym9keSAgIGAoKGZuIH5pdGVyIFt+Y29sbF1cbiAgICAgICAgICAgICAgICAgICAgICAgIChsYXp5LXNlcSAobG9vcCBbfmNvbGwgfmNvbGxdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoaWYtbm90IChlbXB0eT8gfmNvbGwpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChsZXQgW34oZmlyc3QgbG9vcCkgKGZpcnN0IH5jb2xsKV0gfm5leHQpKSkpKVxuICAgICAgICAgICAgICAgICAgICAgIH4oc2Vjb25kIGxvb3ApKX0pKSlcblxuKGRlZiBeOnByaXZhdGUgZm9yLW1vZGlmaWVycyAjeyc6bGV0ICc6d2hpbGUgJzp3aGVufSlcblxuKGRlZm4tIGZvci1wYXJ0cyBbc2VxLWV4cHItcGFpcnNdXG4gIChsZXQgW24gICAgICAgIChjb3VudCBzZXEtZXhwci1wYWlycylcbiAgICAgICAgaW5kaWNlcyAgKGZpbHRlciAjKC0+IChhZ2V0IHNlcS1leHByLXBhaXJzICUpIGZpcnN0IGZvci1tb2RpZmllcnMgbm90KVxuICAgICAgICAgICAgICAgICAgICAgICAgIChyYW5nZSBuKSlcbiAgICAgICAgc2VnbWVudHMgKHBhcnRpdGlvbiAyIDEgKGNvbmogaW5kaWNlcyBuKSldXG4gICAgKG1hcCAjKC5zbGljZSBzZXEtZXhwci1wYWlycyAoZmlyc3QgJSkgKHNlY29uZCAlKSlcbiAgICAgICAgIHNlZ21lbnRzKSkpXG5cbihkZWZuIGV4cGFuZC1mb3JcbiAgXCJMaXN0IGNvbXByZWhlbnNpb24uIFRha2VzIGEgdmVjdG9yIG9mIG9uZSBvciBtb3JlXG4gICBiaW5kaW5nLWZvcm0vY29sbGVjdGlvbi1leHByIHBhaXJzLCBlYWNoIGZvbGxvd2VkIGJ5IHplcm8gb3IgbW9yZVxuICAgbW9kaWZpZXJzLCBhbmQgeWllbGRzIGEgbGF6eSBzZXF1ZW5jZSBvZiBldmFsdWF0aW9ucyBvZiBleHByLlxuICAgQ29sbGVjdGlvbnMgYXJlIGl0ZXJhdGVkIGluIGEgbmVzdGVkIGZhc2hpb24sIHJpZ2h0bW9zdCBmYXN0ZXN0LFxuICAgYW5kIG5lc3RlZCBjb2xsLWV4cHJzIGNhbiByZWZlciB0byBiaW5kaW5ncyBjcmVhdGVkIGluIHByaW9yXG4gICBiaW5kaW5nLWZvcm1zLiAgU3VwcG9ydGVkIG1vZGlmaWVycyBhcmU6IDpsZXQgW2JpbmRpbmctZm9ybSBleHByIC4uLl0sXG4gICA6d2hpbGUgdGVzdCwgOndoZW4gdGVzdC5cbiAgKHRha2UgMTAwIChmb3IgW3ggKGluZmluaXRlLXJhbmdlKSwgeSAoaW5maW5pdGUtcmFuZ2UpLCA6d2hpbGUgKDwgeSB4KV0gIFt4IHldKSlcblxuICBEZXBlbmRzIG9uIGxhenktc2VxLCBsYXp5LWNvbmNhdCwgZW1wdHk/LCBmaXJzdCwgcmVzdCwgY29uc1wiXG4gIFtzZXEtZXhwcnMgYm9keS1leHByXVxuICAobGV0IFtpdGVyIChnZW5zeW0gOmZvci1pdGVyKSwgY29sbCAoZ2Vuc3ltIDpmb3ItY29sbCksIHBhcnRzIChmb3ItcGFydHMgKHBhcnRpdGlvbiAyIHNlcS1leHBycykpXVxuICAgICg6Ym9keSAocmVkdWNlICMoYXBwbHkgZm9yLXN0ZXAgJTEgJTIpXG4gICAgICAgICAgICAgICAgICAgezppdGVyIGl0ZXIsIDpjb2xsIGNvbGwsIDpib2R5IGAoY29ucyB+Ym9keS1leHByICh+aXRlciAocmVzdCB+Y29sbCkpKX1cbiAgICAgICAgICAgICAgICAgICAocmV2ZXJzZSBwYXJ0cykpKSkpXG4oaW5zdGFsbC1tYWNybyA6Zm9yIGV4cGFuZC1mb3IpXG5cbihkZWZuIGV4cGFuZC1kb3NlcVxuICBcIlJlcGVhdGVkbHkgZXhlY3V0ZXMgYm9keSAocHJlc3VtYWJseSBmb3Igc2lkZS1lZmZlY3RzKSB3aXRoXG4gIGJpbmRpbmdzIGFuZCBmaWx0ZXJpbmcgYXMgcHJvdmlkZWQgYnkgJ2ZvcicuIERvZXMgbm90IHJldGFpblxuICB0aGUgaGVhZCBvZiB0aGUgc2VxdWVuY2UuIFJldHVybnMgbmlsLlxuXG4gIERlcGVuZHMgb24gbGF6eS1zZXEsIGxhenktY29uY2F0LCBlbXB0eT8sIGZpcnN0LCByZXN0LCBjb25zLCBkb3J1blwiXG4gIFtzZXEtZXhwcnMgJiBib2R5XVxuICBgKGRvcnVuIChmb3IgfnNlcS1leHBycyAoZG8gfkBib2R5IG5pbCkpKSlcbihpbnN0YWxsLW1hY3JvIDpkb3NlcSBleHBhbmQtZG9zZXEpXG5cblxuKGRlZm4tIHN5bSogW3N0cmluZ11cbiAgKGxldCBbd29yZHMgKHNwbGl0IChuYW1lIHN0cmluZykgI1wiLVwiKV1cbiAgICAoam9pbiAoY29ucyAoZmlyc3Qgd29yZHMpIChtYXAgY2FwaXRhbGl6ZSAocmVzdCB3b3JkcykpKSkpKVxuKGRlZm4tIGJpbmQtc3ltKiBbcyBiXVxuICAoYXNzZXJ0IChzeW1ib2w/IHMpIFwiRXhwZWN0ZWQgYSBzeW1ib2wgaGVyZSFcIilcbiAgW3MgYl0pXG4oZGVmbi0gY29uai1zeW1zKiBbZ2V0KiByZXN1bHQgayB2IGYgcXVvdGVdXG4gIChsZXQgW2stbnMgKG5hbWVzcGFjZSBrKSwgZyAjKGYgay1ucyAobmFtZSAlKSldXG4gICAgKHZlYyAoY29uY2F0IHJlc3VsdCAobWFwY2F0ICMoYmluZC1zeW0qICUgKGdldCogJSAoZyAlKSBxdW90ZSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHYpKSkpKVxuKGRlZm4tIGRpY3QtZ2V0KiBbZGljdC1uYW1lIGRlZmF1bHRzXVxuICAoZm4gW2JpbmRpbmcga2V5IHF1b3RlXVxuICAgIChsZXQgW3MgKG5hbWUga2V5KVxuICAgICAgICAgIGsgKGtleXdvcmQgKG5hbWVzcGFjZSBrZXkpIChpZiAoc3ltYm9sPyBrZXkpIChzeW0qIHMpIHMpKV1cbiAgICAgIGAoZ2V0IH5kaWN0LW5hbWUgfihpZi1ub3QgcXVvdGUgayBgJ35rKSB+KGFuZCBiaW5kaW5nIChhZ2V0IGRlZmF1bHRzIGJpbmRpbmcpKSkpKSlcblxuKGRlZm4gZGVzdHJ1Y3R1cmUtZGljdCBbYmluZGluZyBmcm9tXVxuICAobGV0IFtkaWN0LW5hbWUgIChvciAoYWdldCBiaW5kaW5nICc6YXMpIChnZW5zeW0gOmRlc3RydWN0dXJlLWJpbmQpKVxuICAgICAgICBkaWN0LWJpbmQgIGAoaWYgKGRpY3Rpb25hcnk/IH5kaWN0LW5hbWUpIH5kaWN0LW5hbWUgKGFwcGx5IGRpY3Rpb25hcnkgKHZlYyB+ZGljdC1uYW1lKSkpXG4gICAgICAgIGdldCogICAgICAgKGRpY3QtZ2V0KiBkaWN0LW5hbWUgKGdldCBiaW5kaW5nICc6b3Ige30pKV1cbiAgICAobG9vcCBba3MgKGtleXMgKGRpc3NvYyBiaW5kaW5nICc6YXMgJzpvcikpLCByZXN1bHQgW2RpY3QtbmFtZSBmcm9tLCBkaWN0LW5hbWUgZGljdC1iaW5kXV1cbiAgICAgIChpZiAoZW1wdHk/IGtzKVxuICAgICAgICByZXN1bHRcbiAgICAgICAgKGxldCBbayAoZmlyc3Qga3MpLCB2IChnZXQgYmluZGluZyBrKSwgayogKGFuZCAoa2V5d29yZD8gaykgKG5hbWUgaykpXVxuICAgICAgICAgIChhc3NlcnQgKG9yIChzeW1ib2w/IGspIChhbmQgayogKCN7OmtleXMgOnN0cnMgOnN5bXN9IGsqKSkpXG4gICAgICAgICAgICAgICAgICAoc3RyIFwiSW52YWxpZCBkZXN0cnVjdHVyZSBrZXkgXCIgaykpXG4gICAgICAgICAgKHJlY3VyIChyZXN0IGtzKSAoY29uZCAoPSBrKiA6c3RycykgKGNvbmotc3ltcyogZ2V0KiByZXN1bHQgayB2IGtleXdvcmQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoPSBrKiA6c3ltcykgKGNvbmotc3ltcyogZ2V0KiByZXN1bHQgayB2ICMoc3ltYm9sICUxIChzeW0qICUyKSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoPSBrKiA6a2V5cykgKGNvbmotc3ltcyogZ2V0KiByZXN1bHQgayB2IGtleXdvcmQgOnF1b3RlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG51bWJlcj8gdikgIChjb25qIHJlc3VsdCBrIChnZXQqIGsgKHN5bWJvbCAoc3RyIHYpKSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ZWxzZSAgICAgICAgKGNvbmogcmVzdWx0IGsgKGdldCogayB2KSkpKSkpKSkpXG5cbihkZWZuIGRlc3RydWN0dXJlLXNlcSBbYmluZGluZyBmcm9tXVxuICAobGV0IFthcyAgICAgICAoLmZpbmQtaW5kZXggYmluZGluZyAjKD0gJSAnOmFzKSlcbiAgICAgICAgc2VxLW5hbWUgKGlmICg8IGFzIDApIChnZW5zeW0gOmRlc3RydWN0dXJlLWJpbmQpIChudGggYmluZGluZyAoaW5jIGFzKSkpXG4gICAgICAgIGJpbmRpbmcxIChpZiAoPCBhcyAwKSBiaW5kaW5nICh0YWtlIGFzIGJpbmRpbmcpKVxuICAgICAgICBtb3JlICAgICAoLmZpbmQtaW5kZXggYmluZGluZzEgIyg9ICUgJyYpKVxuICAgICAgICB0YWlsICAgICAoaWYgKD49IG1vcmUgMCkgKG50aCBiaW5kaW5nMSAoaW5jIG1vcmUpKSlcbiAgICAgICAgYmluZGluZzIgKGlmICg8IG1vcmUgMCkgYmluZGluZzEgKHRha2UgbW9yZSBiaW5kaW5nKSldXG4gICAgKGFzc2VydCAob3IgKDwgYXMgMCkgKD0gYXMgKC0gKGNvdW50IGJpbmRpbmcpIDIpKSlcbiAgICAgICAgICAgIFwiaW52YWxpZCA6YXMgaW4gc2VxLWRlc3RydWN0dXJpbmdcIilcbiAgICAoYXNzZXJ0IChvciAoPCBtb3JlIDApICg9IG1vcmUgKC0gKGNvdW50IGJpbmRpbmcxKSAyKSkpXG4gICAgICAgICAgICBcImludmFsaWQgJiBpbiBzZXEtZGVzdHJ1Y3R1cmluZ1wiKVxuICAgIChsb29wIFt4cyBiaW5kaW5nMiwgaSAwLCByZXN1bHQgW3NlcS1uYW1lIGZyb21dXVxuICAgICAgKGxldCBbeCAoZmlyc3QgeHMpXVxuICAgICAgICAoY29uZCAoZW1wdHk/IHhzKSAoaWYtbm90IHRhaWwgcmVzdWx0IChjb25qIHJlc3VsdCB0YWlsIGAoZHJvcCB+bW9yZSB+c2VxLW5hbWUpKSlcbiAgICAgICAgICAgICAgKD0geCAnXykgICAgKHJlY3VyIChyZXN0IHhzKSAoaW5jIGkpIHJlc3VsdClcbiAgICAgICAgICAgICAgOmVsc2UgICAgICAgKHJlY3VyIChyZXN0IHhzKSAoaW5jIGkpIChjb25qIHJlc3VsdCB4IGAobnRoIH5zZXEtbmFtZSB+aSkpKSkpKSkpXG5cbihkZWZuIGRlc3RydWN0dXJlIFtiaW5kaW5nc11cbiAgKGxldCBbcGFpcnMgKHBhcnRpdGlvbiAyIGJpbmRpbmdzKV1cbiAgICAoaWYgKGV2ZXJ5PyAjKHN5bWJvbD8gKGZpcnN0ICUpKSBwYWlycylcbiAgICAgIGJpbmRpbmdzXG4gICAgICAoZGVzdHJ1Y3R1cmUgKHZlYyAobWFwY2F0ICMoY29uZCAodmVjdG9yPyAgICAgKGZpcnN0ICUpKSAoYXBwbHkgZGVzdHJ1Y3R1cmUtc2VxICUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZGljdGlvbmFyeT8gKGZpcnN0ICUpKSAoYXBwbHkgZGVzdHJ1Y3R1cmUtZGljdCAlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHN5bWJvbD8gICAgIChmaXJzdCAlKSkgJVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmVsc2UgICAgICAgICAgICAgICAgICAgKHRocm93IFwiSW52YWxpZCBiaW5kaW5nXCIpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWlycykpKSkpKVxuXG4oZGVmbi0gYmluZC1uYW1lcyogW2tleXNdXG4gICh6aXBtYXAga2V5cyAocmVwZWF0ZWRseSAoY291bnQga2V5cykgIyhnZW5zeW0gOmRlc3RydWN0dXJlLWJpbmQpKSkpXG4oZGVmbi0gYmluZC1pbmRpY2VzKiBbbmFtZXNdXG4gIChmaWx0ZXIgIyhub3QgKHN5bWJvbD8gKG50aCBuYW1lcyAlKSkpIChyYW5nZSAoY291bnQgbmFtZXMpKSkpXG5cbihkZWZuIGV4cGFuZC1sZXRcbiAgXCJiaW5kaW5nID0+IGJpbmRpbmctZm9ybSBpbml0LWV4cHJcblxuICBFdmFsdWF0ZXMgdGhlIGV4cHJzIGluIGEgbGV4aWNhbCBjb250ZXh0IGluIHdoaWNoIHRoZSBzeW1ib2xzIGluXG4gIHRoZSBiaW5kaW5nLWZvcm1zIGFyZSBib3VuZCB0byB0aGVpciByZXNwZWN0aXZlIGluaXQtZXhwcnMgb3IgcGFydHNcbiAgdGhlcmVpbi5cblxuICBEZXBlbmRzIG9uIGRpY3Rpb25hcnk/LCBkaWN0aW9uYXJ5LCB2ZWMsIGdldFwiXG4gIFtiaW5kaW5ncyAmIGJvZHldXG4gIGAobGV0KiB+KGRlc3RydWN0dXJlIGJpbmRpbmdzKSB+QGJvZHkpKVxuKGluc3RhbGwtbWFjcm8gOmxldCBleHBhbmQtbGV0KVxuXG4oZGVmbiBleHBhbmQtZm5cbiAgXCIoZm4gbmFtZT8gW3BhcmFtcypdIGV4cHJzKilcbiAgIChmbiBuYW1lPyAoW3BhcmFtcypdIGV4cHJzKikgKylcblxuICBwYXJhbXMgPT4gcG9zaXRpb25hbC1wYXJhbXMqICwgb3IgcG9zaXRpb25hbC1wYXJhbXMqICYgbmV4dC1wYXJhbVxuICBwb3NpdGlvbmFsLXBhcmFtID0+IGJpbmRpbmctZm9ybVxuICBuZXh0LXBhcmFtID0+IGJpbmRpbmctZm9ybVxuICBuYW1lID0+IHN5bWJvbFxuXG4gIERlZmluZXMgYSBmdW5jdGlvblxuXG4gIERlcGVuZHMgb24gZGljdGlvbmFyeT8sIGRpY3Rpb25hcnksIHZlYywgZ2V0XCJcbiAgWyYgYXJnc11cbiAgKGxldCBbbmFtZSAoaWYgKHN5bWJvbD8gKGZpcnN0IGFyZ3MpKSAoZmlyc3QgYXJncykpXG4gICAgICAgIGRlZnMgKGlmIG5hbWUgKHJlc3QgYXJncykgYXJncylcbiAgICAgICAgbWtmbiAjKGlmIG5hbWUgYChmbiogfm5hbWUgfkAlKSBgKGZuKiB+QCUpKVxuICAgICAgICBkZWYqIChmbiBbYXJncyAmIGJvZHldXG4gICAgICAgICAgICAgICAobGV0IFtpbmRpY2VzIChiaW5kLWluZGljZXMqIGFyZ3MpLCBuYW1lcyAoYmluZC1uYW1lcyogaW5kaWNlcyldXG4gICAgICAgICAgICAgICAgIChpZiAoZW1wdHk/IG5hbWVzKVxuICAgICAgICAgICAgICAgICAgIChjb25zIGFyZ3MgYm9keSlcbiAgICAgICAgICAgICAgICAgICBgKH4odmVjIChtYXAtaW5kZXhlZCAjKGdldCBuYW1lcyAlMSAlMikgYXJncykpXG4gICAgICAgICAgICAgICAgICAgICAgKGxldCB+KHZlYyAobWFwY2F0IChmbiBbaV0gWyhhZ2V0IGFyZ3MgaSkgKGFnZXQgbmFtZXMgaSldKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRpY2VzKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH5AYm9keSkpKSkpXVxuICAgIChpZiAodmVjdG9yPyAoZmlyc3QgZGVmcykpXG4gICAgICAobWtmbiAoYXBwbHkgZGVmKiBkZWZzKSlcbiAgICAgIChta2ZuIChtYXAgIyhhcHBseSBkZWYqICh2ZWMgJSkpIGRlZnMpKSkpKVxuKGluc3RhbGwtbWFjcm8gOmZuIGV4cGFuZC1mbilcblxuKGRlZm4gZXhwYW5kLWxvb3BcbiAgXCJFdmFsdWF0ZXMgdGhlIGV4cHJzIGluIGEgbGV4aWNhbCBjb250ZXh0IGluIHdoaWNoIHRoZSBzeW1ib2xzIGluXG4gIHRoZSBiaW5kaW5nLWZvcm1zIGFyZSBib3VuZCB0byB0aGVpciByZXNwZWN0aXZlIGluaXQtZXhwcnMgb3IgcGFydHNcbiAgdGhlcmVpbi4gQWN0cyBhcyBhIHJlY3VyIHRhcmdldC5cblxuICBEZXBlbmRzIG9uIGRpY3Rpb25hcnk/LCBkaWN0aW9uYXJ5LCB2ZWMsIGdldFwiXG4gIFtiaW5kaW5ncyAmIGJvZHldXG4gIChsZXQgW3BhaXJzICAgKHBhcnRpdGlvbiAyIGJpbmRpbmdzKVxuICAgICAgICBpbmRpY2VzIChiaW5kLWluZGljZXMqIChtYXB2IGZpcnN0IHBhaXJzKSlcbiAgICAgICAgbmFtZXMgICAoYmluZC1uYW1lcyogaW5kaWNlcylcbiAgICAgICAgZ2V0KiAgICAjKGlmLWxldCBbeCAoYWdldCBuYW1lcyAlMSldXG4gICAgICAgICAgICAgICAgICAgW3ggKHNlY29uZCAlMikgKGZpcnN0ICUyKSB4XVxuICAgICAgICAgICAgICAgICAgICUyKV1cbiAgICAoaWYgKGVtcHR5PyBuYW1lcylcbiAgICAgIGAobG9vcCogfmJpbmRpbmdzIH5AYm9keSlcbiAgICAgIGAobGV0IH4odmVjIChhcHBseSBjb25jYXQgKG1hcC1pbmRleGVkIGdldCogcGFpcnMpKSlcbiAgICAgICAgIChsb29wKiB+KHZlYyAoYXBwbHkgY29uY2F0IChtYXAtaW5kZXhlZCAjKGxldCBbeCAoZ2V0IG5hbWVzICUxIChmaXJzdCAlMikpXSBbeCB4XSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWlycykpKVxuICAgICAgICAgICAobGV0IH4odmVjIChtYXBjYXQgKGZuIFtpXSBbKGZpcnN0IChhZ2V0IHBhaXJzIGkpKSAoYWdldCBuYW1lcyBpKV0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRpY2VzKSlcbiAgICAgICAgICAgICB+QGJvZHkpKSkpKSlcbihpbnN0YWxsLW1hY3JvIDpsb29wIGV4cGFuZC1sb29wKVxuIl19
