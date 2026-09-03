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
        var implicitø1 = map(function ($) {
            return isEqual('&form', $) ? (function () {
                return form;
            })() : isEqual('&env', $) ? (function () {
                return env;
            })() : (function () {
                return $;
            })();
        }, (meta(expander) || 0)['implicit'] || []);
        var paramsø1 = vec(concat(implicitø1, vec(rest(form))));
        var expansionø1 = expander.apply(null, paramsø1);
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
        var agetø1 = withMeta(symbol(null, 'aget'), conj(opMetaø1, {
            'end': {
                'line': (formStartø1 || 0)['line'],
                'column': inc((formStartø1 || 0)['column'])
            }
        }));
        var methodø1 = withMeta(list.apply(null, [agetø1].concat([target], [list.apply(null, [symbol(null, 'quote')].concat([memberø1]))])), conj(opMetaø1, { 'end': (meta(target) || 0)['end'] }));
        return isNil(target) ? (function () {
            throw Error('Malformed method expression, expecting (.method object ...)');
        })() : list.apply(null, [methodø1].concat(vec(params)));
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
        })() : list.apply(null, [symbol(null, 'aget')].concat([target], [list.apply(null, [symbol(null, 'quote')].concat([memberø1]))]));
    }.call(this);
};
var dotSyntax = exports.dotSyntax = function dotSyntax(op, target, field) {
    var params = Array.prototype.slice.call(arguments, 3);
    !isSymbol(field) ? (function () {
        throw Error('Malformed . form');
    })() : null;
    return function () {
        var _fieldø1 = name(field);
        return ('-' === first(_fieldø1) ? fieldSyntax : methodSyntax).apply(null, [
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
        var operatorø1 = withMeta(symbol(null, 'new'), conj(idMetaø1, {
            'start': {
                'line': ((idMetaø1 || 0)['end'] || 0)['line'],
                'column': dec(((idMetaø1 || 0)['end'] || 0)['column'])
            }
        }));
        return list.apply(null, [symbol(null, 'new')].concat([constructorø1], vec(params)));
    }.call(this);
};
var keywordInvoke = exports.keywordInvoke = function keywordInvoke(keyword, target) {
    var args = Array.prototype.slice.call(arguments, 2);
    return isEmpty(args) ? list.apply(null, [symbol(null, 'get')].concat([target], [keyword])) : list.apply(null, [symbol(null, 'get')].concat([target], [keyword], [first(args)]));
};
var desugar = function desugar(expander, form) {
    return function () {
        var desugaredø1 = expander.apply(null, vec(form));
        var metadataø1 = conj({}, meta(form), meta(desugaredø1));
        return withMeta(desugaredø1, metadataø1);
    }.call(this);
};
var macroexpand1 = exports.macroexpand1 = function macroexpand1(form, env) {
    return function () {
        var opø1 = isList(form) && first(form);
        var expanderø1 = macro(opø1);
        return expanderø1 ? (function () {
            return expand(expanderø1, form, env);
        })() : isKeyword(opø1) ? (function () {
            return desugar(keywordInvoke, form);
        })() : isDotSyntax(opø1) ? (function () {
            return desugar(dotSyntax, form);
        })() : isFieldSyntax(opø1) ? (function () {
            return desugar(fieldSyntax, form);
        })() : isMethodSyntax(opø1) ? (function () {
            return desugar(methodSyntax, form);
        })() : isNewSyntax(opø1) ? (function () {
            return desugar(newSyntax, form);
        })() : (function () {
            return form;
        })();
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
    return isSymbol(form) ? (function () {
        return list(symbol(null, 'quote'), form);
    })() : isKeyword(form) ? (function () {
        return list(symbol(null, 'quote'), form);
    })() : isNumber(form) || isString(form) || isBoolean(form) || isNil(form) || isRePattern(form) ? (function () {
        return form;
    })() : isUnquote(form) ? (function () {
        return second(form);
    })() : isUnquoteSplicing(form) ? (function () {
        return readerError('Illegal use of `,@` expression, can only be present in a list');
    })() : isEmpty(form) ? (function () {
        return form;
    })() : isDictionary(form) ? (function () {
        return list(symbol(null, 'apply'), symbol(null, 'dictionary'), cons(symbol(null, '.concat'), sequenceExpand(concat.apply(null, seq(form)))));
    })() : isVector(form) ? (function () {
        return cons(symbol(null, '.concat'), sequenceExpand(form));
    })() : isList(form) ? (function () {
        return isEmpty(form) ? cons(symbol(null, 'list'), null) : list(symbol(null, 'apply'), symbol(null, 'list'), cons(symbol(null, '.concat'), sequenceExpand(form)));
    })() : (function () {
        return readerError('Unknown Collection type');
    })();
};
var syntaxQuoteExpand = exports.syntaxQuoteExpand = syntaxQuote;
var unquoteSplicingExpand = exports.unquoteSplicingExpand = function unquoteSplicingExpand(form) {
    return isVector(form) ? form : list(symbol(null, 'vec'), form);
};
var sequenceExpand = exports.sequenceExpand = function sequenceExpand(forms) {
    return map(function (form) {
        return isUnquote(form) ? (function () {
            return [second(form)];
        })() : isUnquoteSplicing(form) ? (function () {
            return unquoteSplicingExpand(second(form));
        })() : (function () {
            return [syntaxQuoteExpand(form)];
        })();
    }, forms);
};
installMacro('syntax-quote', syntaxQuoteExpand);
var expandNotEqual = exports.expandNotEqual = function expandNotEqual() {
    var body = Array.prototype.slice.call(arguments, 0);
    return list.apply(null, [symbol(null, 'not')].concat([list.apply(null, [symbol(null, '=')].concat(vec(body)))]));
};
installMacro('not=', expandNotEqual);
var expandIfNot = exports.expandIfNot = function expandIfNot(condition, truthy, alternative) {
    return list.apply(null, [symbol(null, 'if')].concat([list.apply(null, [symbol(null, 'not')].concat([condition]))], [truthy], [alternative]));
};
installMacro('if-not', expandIfNot);
var expandComment = exports.expandComment = function expandComment() {
    var body = Array.prototype.slice.call(arguments, 0);
    return null;
};
installMacro('comment', expandComment);
var expandThreadFirst = exports.expandThreadFirst = function expandThreadFirst() {
    var operations = Array.prototype.slice.call(arguments, 0);
    return reduce(function (form, operation) {
        return cons(first(operation), cons(form, rest(operation)));
    }, first(operations), map(function ($) {
        return isList($) ? $ : list.apply(null, [$].concat());
    }, rest(operations)));
};
installMacro('->', expandThreadFirst);
var expandThreadLast = exports.expandThreadLast = function expandThreadLast() {
    var operations = Array.prototype.slice.call(arguments, 0);
    return reduce(function (form, operation) {
        return concat(operation, [form]);
    }, first(operations), map(function ($) {
        return isList($) ? $ : list.apply(null, [$].concat());
    }, rest(operations)));
};
installMacro('->>', expandThreadLast);
var expandDots = exports.expandDots = function expandDots(x) {
    var forms = Array.prototype.slice.call(arguments, 1);
    return list.apply(null, [symbol(null, '->')].concat([x], vec(map(function ($) {
        return isList($) ? cons(symbol(null, '.'), $) : list(symbol(null, '.'), $);
    }, forms))));
};
installMacro('..', expandDots);
var expandThreadAs = exports.expandThreadAs = function expandThreadAs(expr, name) {
    var forms = Array.prototype.slice.call(arguments, 2);
    return list.apply(null, [symbol(null, 'let**')].concat([[name].concat([expr], vec(mapcat(function (form) {
            return [
                name,
                form
            ];
        }, forms)))], [name]));
};
installMacro('as->', expandThreadAs);
var expandCond = exports.expandCond = function expandCond() {
    var clauses = Array.prototype.slice.call(arguments, 0);
    return !isEmpty(clauses) ? function () {
        var clauseø1 = first(clauses);
        var testø1 = first(clauseø1);
        var bodyø1 = rest(clauseø1);
        return isEqual(testø1, symbol(null, 'else')) ? list.apply(null, [symbol(null, 'progn')].concat(vec(bodyø1))) : list.apply(null, [symbol(null, 'if')].concat([testø1], [list.apply(null, [symbol(null, 'progn')].concat(vec(bodyø1)))], [list.apply(null, [symbol(null, 'cond')].concat(vec(rest(clauses))))]));
    }.call(this) : null;
};
installMacro('cond', expandCond);
var expandCase = exports.expandCase = function expandCase(e) {
    var clauses = Array.prototype.slice.call(arguments, 1);
    return function () {
        var symø1 = isSymbol(e) ? e : gensym('case-binding');
        var eq_ø1 = function (c) {
            return list.apply(null, [symbol(null, '=')].concat([symø1], [list.apply(null, [symbol(null, 'quote')].concat([c]))]));
        };
        return function loop() {
            var recur = loop;
            var pairsø1 = clauses;
            var condsø1 = [];
            do {
                recur = isEmpty(pairsø1) ? function () {
                    var condsø2 = some(function ($) {
                        return isEqual(first($), symbol(null, 'else'));
                    }, condsø1) ? condsø1 : conj(condsø1, list(symbol(null, 'else'), list.apply(null, [symbol(null, 'throw')].concat([list.apply(null, [symbol(null, 'Error')].concat([list.apply(null, [symbol(null, 'str')].concat(['No matching clause: '], [symø1]))]))]))));
                    var resultø1 = cons(symbol(null, 'cond'), condsø2);
                    return isEqual(e, symø1) ? resultø1 : list.apply(null, [symbol(null, 'let*')].concat([list.apply(null, [list.apply(null, [symø1].concat([e]))].concat())], [resultø1]));
                }.call(this) : function () {
                    var xø1 = first(pairsø1);
                    var xsø1 = rest(pairsø1);
                    var constsø1 = first(xø1);
                    var bodyø1 = rest(xø1);
                    return loop[0] = xsø1, loop[1] = conj(condsø1, isEqual(constsø1, symbol(null, 'else')) ? cons(symbol(null, 'else'), bodyø1) : cons(!isList(constsø1) ? eq_ø1(constsø1) : list.apply(null, [symbol(null, 'or')].concat(vec(map(eq_ø1, constsø1)))), bodyø1)), loop;
                }.call(this);
            } while (pairsø1 = loop[0], condsø1 = loop[1], recur === loop);
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
            return list.apply(null, [pred].concat([x], [symø1]));
        };
        var splitsø1 = function splits(xs) {
            return isEmpty(xs) ? (function () {
                return list.apply(null, [symbol(null, 'throw')].concat([list.apply(null, [symbol(null, 'Error')].concat([list.apply(null, [symbol(null, 'str')].concat(['No matching clause: '], [symø1]))]))]));
            })() : isEqual(1, count(xs)) ? (function () {
                return first(xs);
            })() : isEqual('\uA789>>', second(xs)) ? (function () {
                return list.apply(null, [symbol(null, 'if-let')].concat([[sym_ø1].concat([compareø1(first(xs))])], [list.apply(null, [third(xs)].concat([sym_ø1]))], [splits(drop(3, xs))]));
            })() : (function () {
                return list.apply(null, [symbol(null, 'if')].concat([compareø1(first(xs))], [second(xs)], [splits(drop(2, xs))]));
            })();
        };
        return isEqual(symø1, expr) ? splitsø1(clauses) : list.apply(null, [symbol(null, 'let**')].concat([[symø1].concat([expr])], [splitsø1(clauses)]));
    }.call(this);
};
installMacro('condp', expandCondp);
var _thread = function _thread(insert, sym, test, form) {
    return function () {
        var formø2 = isList(form) ? form : list(form);
        return list.apply(null, [symbol(null, 'if')].concat([test], [sym], [insert(sym, formø2)]));
    }.call(this);
};
var _condThread = function _condThread(expr, clauses, insert) {
    return function () {
        var symø1 = gensym('cond-thread-binding');
        return list.apply(null, [symbol(null, 'as->')].concat([expr], [symø1], vec(map(function ($) {
            return _thread(insert, symø1, list.apply(null, [symbol(null, 'not')].concat([first($)])), second($));
        }, partition(2, clauses)))));
    }.call(this);
};
var expandCondThreadFirst = exports.expandCondThreadFirst = function expandCondThreadFirst(expr) {
    var clauses = Array.prototype.slice.call(arguments, 1);
    return _condThread(expr, clauses, function (sym, form) {
        return list.apply(null, [
            first(form),
            sym
        ].concat(vec(rest(form))));
    });
};
installMacro('cond->', expandCondThreadFirst);
var expandCondThreadLast = exports.expandCondThreadLast = function expandCondThreadLast(expr) {
    var clauses = Array.prototype.slice.call(arguments, 1);
    return _condThread(expr, clauses, function (sym, form) {
        return list.apply(null, vec(concat(form, [sym])));
    });
};
installMacro('cond->>', expandCondThreadLast);
var _someThread = function _someThread(expr, forms, insert) {
    return function () {
        var symø1 = gensym('some-thread-binding');
        return list.apply(null, [symbol(null, 'as->')].concat([expr], [symø1], vec(map(function ($) {
            return _thread(insert, symø1, list.apply(null, [symbol(null, 'nil?')].concat([symø1])), $);
        }, forms))));
    }.call(this);
};
var expandSomeThreadFirst = exports.expandSomeThreadFirst = function expandSomeThreadFirst(expr) {
    var forms = Array.prototype.slice.call(arguments, 1);
    return _someThread(expr, forms, function (sym, form) {
        return list.apply(null, [
            first(form),
            sym
        ].concat(vec(rest(form))));
    });
};
installMacro('some->', expandSomeThreadFirst);
var expandSomeThreadLast = exports.expandSomeThreadLast = function expandSomeThreadLast(expr) {
    var forms = Array.prototype.slice.call(arguments, 1);
    return _someThread(expr, forms, function (sym, form) {
        return list.apply(null, vec(concat(form, [sym])));
    });
};
installMacro('some->>', expandSomeThreadLast);
var buildDefun = function buildDefun(private, _andForm, name, params, docPlusBody) {
    return function () {
        var docø1 = isString(first(docPlusBody)) && !isEmpty(rest(docPlusBody)) ? first(docPlusBody) : null;
        var bodyø1 = docø1 ? rest(docPlusBody) : docPlusBody;
        var idø1 = withMeta(name, conj(meta(name) || {}, { 'doc': docø1 }));
        var fnø1 = withMeta(list.apply(null, [symbol(null, 'lambda')].concat([idø1], [params], vec(bodyø1))), meta(_andForm));
        var defOpø1 = private ? symbol(null, 'defvar-') : symbol(null, 'defvar');
        return list(defOpø1, idø1, fnø1);
    }.call(this);
};
var expandDefun = exports.expandDefun = function expandDefun(_andForm, name, params) {
    var docPlusBody = Array.prototype.slice.call(arguments, 3);
    return buildDefun(false, _andForm, name, params, docPlusBody);
};
installMacro('defun', withMeta(expandDefun, { 'implicit': ['&form'] }));
var expandDefun = exports.expandDefun = function expandDefun(_andForm, name, params) {
    var docPlusBody = Array.prototype.slice.call(arguments, 3);
    return buildDefun(true, _andForm, name, params, docPlusBody);
};
installMacro('defun-', withMeta(expandDefun, { 'implicit': ['&form'] }));
var expandDefconst = exports.expandDefconst = function expandDefconst(name, value) {
    return list.apply(null, [symbol(null, 'defvar')].concat([name], [value]));
};
installMacro('defconst', expandDefconst);
var expandDefconst = exports.expandDefconst = function expandDefconst(name, value) {
    return list.apply(null, [symbol(null, 'defvar-')].concat([name], [value]));
};
installMacro('defconst-', expandDefconst);
var expandSetq = exports.expandSetq = function expandSetq(place, value) {
    return list.apply(null, [symbol(null, 'set!')].concat([place], [value]));
};
installMacro('setq', expandSetq);
var expandSetf = exports.expandSetf = function expandSetf(place, value) {
    return list.apply(null, [symbol(null, 'set!')].concat([place], [value]));
};
installMacro('setf', expandSetf);
var expandLazySeq = exports.expandLazySeq = function expandLazySeq() {
    var body = Array.prototype.slice.call(arguments, 0);
    return list.apply(null, [symbol(null, '.call')].concat([symbol(null, 'lazy-seq')], [null], [false], [list.apply(null, [symbol(null, 'lambda')].concat([null], vec(body)))]));
};
installMacro('lazy-seq', expandLazySeq);
var expandWhen = exports.expandWhen = function expandWhen(test) {
    var body = Array.prototype.slice.call(arguments, 1);
    return list.apply(null, [symbol(null, 'if')].concat([test], [list.apply(null, [symbol(null, 'progn')].concat(vec(body)))]));
};
installMacro('when', expandWhen);
var expandUnless = exports.expandUnless = function expandUnless(test) {
    var body = Array.prototype.slice.call(arguments, 1);
    return list.apply(null, [symbol(null, 'when')].concat([list.apply(null, [symbol(null, 'not')].concat([test]))], vec(body)));
};
installMacro('unless', expandUnless);
var expandIfLet = exports.expandIfLet = function expandIfLet(bindings, then, else_) {
    return function () {
        var nameø1 = first(bindings);
        var testø1 = second(bindings);
        var symø1 = gensym('if-let-binding');
        return list.apply(null, [symbol(null, 'let**')].concat([[symø1].concat([testø1])], [list.apply(null, [symbol(null, 'if')].concat([symø1], [list.apply(null, [symbol(null, 'let**')].concat([destructure([
                        nameø1,
                        symø1
                    ])], [then]))], [else_]))]));
    }.call(this);
};
installMacro('if-let', expandIfLet);
var expandWhenLet = exports.expandWhenLet = function expandWhenLet(bindings) {
    var body = Array.prototype.slice.call(arguments, 1);
    return list.apply(null, [symbol(null, 'if-let')].concat([bindings], [list.apply(null, [symbol(null, 'progn')].concat(vec(body)))]));
};
installMacro('when-let', expandWhenLet);
var expandIfSome = exports.expandIfSome = function expandIfSome(bindings, then, else_) {
    return function () {
        var nameø1 = first(bindings);
        var testø1 = second(bindings);
        var symø1 = isSymbol(nameø1) ? nameø1 : gensym('if-some-binding');
        return list.apply(null, [symbol(null, 'let**')].concat([[symø1].concat([testø1])], [list.apply(null, [symbol(null, 'if-not')].concat([list.apply(null, [symbol(null, 'nil?')].concat([symø1]))], [list.apply(null, [symbol(null, 'let**')].concat([destructure([
                        nameø1,
                        symø1
                    ])], [then]))], [else_]))]));
    }.call(this);
};
installMacro('if-some', expandIfSome);
var expandWhenSome = exports.expandWhenSome = function expandWhenSome(bindings) {
    var body = Array.prototype.slice.call(arguments, 1);
    return list.apply(null, [symbol(null, 'if-some')].concat([bindings], [list.apply(null, [symbol(null, 'progn')].concat(vec(body)))]));
};
installMacro('when-some', expandWhenSome);
var expandWhenFirst = exports.expandWhenFirst = function expandWhenFirst(bindings) {
    var body = Array.prototype.slice.call(arguments, 1);
    return function () {
        var nameø1 = first(bindings);
        var testø1 = second(bindings);
        return list.apply(null, [symbol(null, 'when-let')].concat([list.apply(null, [[nameø1].concat()].concat([list.apply(null, [symbol(null, 'seq*')].concat([testø1]))]))], vec(body)));
    }.call(this);
};
installMacro('when-first', expandWhenFirst);
var expandWhile = exports.expandWhile = function expandWhile(test) {
    var body = Array.prototype.slice.call(arguments, 1);
    return list.apply(null, [symbol(null, 'loop')].concat([null], [list.apply(null, [symbol(null, 'when')].concat([test], vec(body), [list.apply(null, [symbol(null, 'recur')].concat())]))]));
};
installMacro('while', expandWhile);
var expandDoto = exports.expandDoto = function expandDoto(x) {
    var forms = Array.prototype.slice.call(arguments, 1);
    return function () {
        var symø1 = gensym('doto-binding');
        return list.apply(null, [symbol(null, 'let**')].concat([[symø1].concat([x])], vec(map(function ($) {
            return concat([
                first($),
                symø1
            ], rest($));
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
        return list.apply(null, [symbol(null, 'let**')].concat([[symø1].concat([nø1])], [list.apply(null, [symbol(null, 'loop')].concat([list.apply(null, [list.apply(null, [nameø1].concat([0]))].concat())], [list.apply(null, [symbol(null, 'when')].concat([list.apply(null, [symbol(null, '<')].concat([nameø1], [symø1]))], vec(body), [list.apply(null, [symbol(null, 'recur')].concat([list.apply(null, [symbol(null, 'inc')].concat([nameø1]))]))]))]))]));
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
        var body_ø1 = !subseqø1 ? bodyø1 : list.apply(null, [symbol(null, 'let**')].concat([[subseqø1].concat([bodyø1])], [list.apply(null, [symbol(null, 'if')].concat([list.apply(null, [symbol(null, 'empty?')].concat([subseqø1]))], [list.apply(null, [symbol(null, 'recur')].concat([list.apply(null, [symbol(null, 'rest')].concat([collø1]))]))], [list.apply(null, [symbol(null, 'lazy-concat')].concat([subseqø1], [list.apply(null, [iterø1].concat([list.apply(null, [symbol(null, 'rest')].concat([collø1]))]))]))]))]));
        var nextø1 = function loop() {
            var recur = loop;
            var modsø1 = reverse(modifiers);
            var bodyø2 = body_ø1;
            do {
                recur = isEmpty(modsø1) ? bodyø2 : function () {
                    var mø1 = first(modsø1);
                    var itemø1 = first(mø1);
                    var argø1 = second(mø1);
                    return loop[0] = rest(modsø1), loop[1] = isEqual(itemø1, '\uA789let') ? (function () {
                        return list.apply(null, [symbol(null, 'let**')].concat([parenBindingsToVec(argø1)], [bodyø2]));
                    })() : isEqual(itemø1, '\uA789while') ? (function () {
                        return list.apply(null, [symbol(null, 'if')].concat([argø1], [bodyø2]));
                    })() : isEqual(itemø1, '\uA789when') ? (function () {
                        return list.apply(null, [symbol(null, 'if')].concat([argø1], [bodyø2], [list.apply(null, [symbol(null, 'recur')].concat([list.apply(null, [symbol(null, 'rest')].concat([collø1]))]))]));
                    })() : null, loop;
                }.call(this);
            } while (modsø1 = loop[0], bodyø2 = loop[1], recur === loop);
            return recur;
        }.call(this);
        return merge(context, {
            'subseq': gensym('for-subseq'),
            'body': list.apply(null, [list.apply(null, [symbol(null, 'lambda')].concat([iterø1], [list.apply(null, [collø1].concat())], [list.apply(null, [symbol(null, 'lazy-seq')].concat([list.apply(null, [symbol(null, 'loop')].concat([list.apply(null, [list.apply(null, [collø1].concat([collø1]))].concat())], [list.apply(null, [symbol(null, 'if-not')].concat([list.apply(null, [symbol(null, 'empty?')].concat([collø1]))], [list.apply(null, [symbol(null, 'let**')].concat([[first(loop)].concat([list.apply(null, [symbol(null, 'first')].concat([collø1]))])], [nextø1]))]))]))]))]))].concat([second(loop)]))
        });
    }.call(this);
};
var forModifiers = set('\uA789let', '\uA789while', '\uA789when');
var forParts = function forParts(seqExprPairs) {
    return function () {
        var nø1 = count(seqExprPairs);
        var indicesø1 = filter(function ($) {
            return !forModifiers(first(seqExprPairs[$]));
        }, range(nø1));
        var segmentsø1 = partition(2, 1, conj(indicesø1, nø1));
        return map(function ($) {
            return seqExprPairs.slice(first($), second($));
        }, segmentsø1);
    }.call(this);
};
var expandFor = exports.expandFor = function expandFor(seqExprs, bodyExpr) {
    return function () {
        var pairsø1 = vec(map(vec, seqExprs));
        var iterø1 = gensym('for-iter');
        var collø1 = gensym('for-coll');
        var partsø1 = forParts(pairsø1);
        return (reduce(function ($1, $2) {
            return forStep.apply(null, [$1].concat($2));
        }, {
            'iter': iterø1,
            'coll': collø1,
            'body': list.apply(null, [symbol(null, 'cons')].concat([bodyExpr], [list.apply(null, [iterø1].concat([list.apply(null, [symbol(null, 'rest')].concat([collø1]))]))]))
        }, reverse(partsø1)) || 0)['body'];
    }.call(this);
};
installMacro('for', expandFor);
var expandDoseq = exports.expandDoseq = function expandDoseq(seqExprs) {
    var body = Array.prototype.slice.call(arguments, 1);
    return list.apply(null, [symbol(null, 'dorun')].concat([list.apply(null, [symbol(null, 'for')].concat([seqExprs], [list.apply(null, [symbol(null, 'progn')].concat(vec(body), [null]))]))]));
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
    })() : null;
    return [
        s,
        b
    ];
};
var conjSyms_ = function conjSyms_(get_, result, k, v, f, quote) {
    return function () {
        var kNsø1 = namespace(k);
        var gø1 = function ($) {
            return f(kNsø1, name($));
        };
        return vec(concat(result, mapcat(function ($) {
            return bindSym_($, get_($, gø1($), quote));
        }, v)));
    }.call(this);
};
var dictGet_ = function dictGet_(dictName, defaults) {
    return function (binding, key, quote) {
        return function () {
            var sø1 = name(key);
            var kø1 = keyword(namespace(key), isSymbol(key) ? sym_(sø1) : sø1);
            return list.apply(null, [symbol(null, 'get')].concat([dictName], [!quote ? kø1 : list.apply(null, [symbol(null, 'quote')].concat([kø1]))], [binding && defaults[binding]]));
        }.call(this);
    };
};
var destructureDict = exports.destructureDict = function destructureDict(binding, from) {
    return function () {
        var dictNameø1 = binding['\uA789as'] || gensym('destructure-bind');
        var dictBindø1 = list.apply(null, [symbol(null, 'if')].concat([list.apply(null, [symbol(null, 'dictionary?')].concat([dictNameø1]))], [dictNameø1], [list.apply(null, [symbol(null, 'apply')].concat([symbol(null, 'dictionary')], [list.apply(null, [symbol(null, 'vec')].concat([dictNameø1]))]))]));
        var get_ø1 = dictGet_(dictNameø1, get.apply(null, [
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
                    })() : null;
                    return loop[0] = rest(ksø1), loop[1] = isEqual(k_ø1, 'strs') ? (function () {
                        return conjSyms_(get_ø1, resultø1, kø1, vø1, keyword);
                    })() : isEqual(k_ø1, 'syms') ? (function () {
                        return conjSyms_(get_ø1, resultø1, kø1, vø1, function ($1, $2) {
                            return symbol($1, sym_($2));
                        });
                    })() : isEqual(k_ø1, 'keys') ? (function () {
                        return conjSyms_(get_ø1, resultø1, kø1, vø1, keyword);
                    })() : isNumber(vø1) ? (function () {
                        return conj(resultø1, kø1, get_ø1(kø1, symbol('' + vø1)));
                    })() : (function () {
                        return conj(resultø1, kø1, get_ø1(kø1, vø1));
                    })(), loop;
                }.call(this);
            } while (ksø1 = loop[0], resultø1 = loop[1], recur === loop);
            return recur;
        }.call(this);
    }.call(this);
};
var destructureSeq = exports.destructureSeq = function destructureSeq(binding, from) {
    return function () {
        var asø1 = binding.findIndex(function ($) {
            return isEqual($, '\uA789as');
        });
        var seqNameø1 = asø1 < 0 ? gensym('destructure-bind') : nth(binding, inc(asø1));
        var binding1ø1 = asø1 < 0 ? binding : take(asø1, binding);
        var moreø1 = binding1ø1.findIndex(function ($) {
            return isEqual($, symbol(null, '&')) || isEqual($, symbol(null, '&rest'));
        });
        var tailø1 = moreø1 >= 0 ? nth(binding1ø1, inc(moreø1)) : null;
        var binding2ø1 = moreø1 < 0 ? binding1ø1 : take(moreø1, binding);
        !(asø1 < 0 || isEqual(asø1, count(binding) - 2)) ? (function () {
            throw Error('' + 'Assert failed: ' + 'invalid :as in seq-destructuring' + '(or (< as 0) (= as (- (count binding) 2)))');
        })() : null;
        !(moreø1 < 0 || isEqual(moreø1, count(binding1ø1) - 2)) ? (function () {
            throw Error('' + 'Assert failed: ' + 'invalid & in seq-destructuring' + '(or (< more 0) (= more (- (count binding1) 2)))');
        })() : null;
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
                    return isEmpty(xsø1) ? (function () {
                        return !tailø1 ? resultø1 : conj(resultø1, tailø1, list.apply(null, [symbol(null, 'drop')].concat([moreø1], [seqNameø1])));
                    })() : isEqual(xø1, symbol(null, '_')) ? (function () {
                        return loop[0] = rest(xsø1), loop[1] = inc(iø1), loop[2] = resultø1, loop;
                    })() : (function () {
                        return loop[0] = rest(xsø1), loop[1] = inc(iø1), loop[2] = conj(resultø1, xø1, list.apply(null, [symbol(null, 'nth')].concat([seqNameø1], [iø1]))), loop;
                    })();
                }.call(this);
            } while (xsø1 = loop[0], iø1 = loop[1], resultø1 = loop[2], recur === loop);
            return recur;
        }.call(this);
    }.call(this);
};
var destructure = exports.destructure = function destructure(bindings) {
    return function () {
        var pairsø1 = partition(2, bindings);
        return isEvery(function ($) {
            return isSymbol(first($));
        }, pairsø1) ? bindings : destructure(vec(mapcat(function ($) {
            return isVector(first($)) ? (function () {
                return destructureSeq.apply(null, $);
            })() : isDictionary(first($)) ? (function () {
                return destructureDict.apply(null, $);
            })() : isSymbol(first($)) ? (function () {
                return $;
            })() : (function () {
                return (function () {
                    throw 'Invalid binding';
                })();
            })();
        }, pairsø1)));
    }.call(this);
};
var bindNames_ = function bindNames_(keys) {
    return zipmap(keys, repeatedly(count(keys), function () {
        return gensym('destructure-bind');
    }));
};
var bindIndices_ = function bindIndices_(names) {
    return filter(function ($) {
        return !isSymbol(nth(names, $));
    }, range(count(names)));
};
var parenBindingsToVec = function parenBindingsToVec(bindings) {
    return vec(mapcat(function (pair) {
        return [
            first(pair),
            second(pair)
        ];
    }, bindings));
};
var expandLet_ = exports.expandLet_ = function expandLet_(bindings) {
    var body = Array.prototype.slice.call(arguments, 1);
    return list.apply(null, [symbol(null, 'let**')].concat([destructure(parenBindingsToVec(bindings))], vec(body)));
};
installMacro('let*', expandLet_);
var expandLet = exports.expandLet = function expandLet(bindings) {
    var body = Array.prototype.slice.call(arguments, 1);
    return function () {
        var pairsø1 = partition(2, parenBindingsToVec(bindings));
        var gensymsø1 = map(function (_) {
            return gensym('let-binding');
        }, pairsø1);
        var outerø1 = mapcat(function (g, pair) {
            return [
                g,
                second(pair)
            ];
        }, gensymsø1, pairsø1);
        var innerø1 = mapcat(function (g, pair) {
            return [
                first(pair),
                g
            ];
        }, gensymsø1, pairsø1);
        return list.apply(null, [symbol(null, 'let**')].concat([vec(outerø1)], [list.apply(null, [symbol(null, 'let**')].concat([destructure(vec(innerø1))], vec(body)))]));
    }.call(this);
};
installMacro('let', expandLet);
var parseArglist = function parseArglist(params) {
    return function loop() {
        var recur = loop;
        var remainingø1 = seq(params);
        var modeø1 = 'required';
        var namesø1 = [];
        var defaultsø1 = [];
        do {
            recur = isEmpty(remainingø1) ? {
                'names': namesø1,
                'defaults': defaultsø1
            } : function () {
                var xø1 = first(remainingø1);
                var xsø1 = rest(remainingø1);
                return isEqual(xø1, symbol(null, '&optional')) ? (function () {
                    return loop[0] = xsø1, loop[1] = 'optional', loop[2] = namesø1, loop[3] = defaultsø1, loop;
                })() : isEqual(xø1, symbol(null, '&rest')) ? (function () {
                    return loop[0] = xsø1, loop[1] = 'rest', loop[2] = namesø1, loop[3] = defaultsø1, loop;
                })() : modeø1 === 'rest' ? (function () {
                    return loop[0] = xsø1, loop[1] = modeø1, loop[2] = conj(namesø1, symbol(null, '&'), xø1), loop[3] = defaultsø1, loop;
                })() : modeø1 === 'optional' && isList(xø1) ? (function () {
                    return loop[0] = xsø1, loop[1] = modeø1, loop[2] = conj(namesø1, first(xø1)), loop[3] = conj(defaultsø1, [
                        first(xø1),
                        second(xø1)
                    ]), loop;
                })() : (function () {
                    return loop[0] = xsø1, loop[1] = modeø1, loop[2] = conj(namesø1, xø1), loop[3] = defaultsø1, loop;
                })();
            }.call(this);
        } while (remainingø1 = loop[0], modeø1 = loop[1], namesø1 = loop[2], defaultsø1 = loop[3], recur === loop);
        return recur;
    }.call(this);
};
var expandLambda = exports.expandLambda = function expandLambda() {
    var args = Array.prototype.slice.call(arguments, 0);
    return function () {
        var nameø1 = isSymbol(first(args)) ? first(args) : null;
        var defsø1 = nameø1 ? rest(args) : args;
        return isList(first(defsø1)) && isList(first(first(defsø1))) ? (function () {
            throw Error('' + 'lambda: multi-arity clauses are not supported ' + 'in new-syntax yet -- ticket #5\'s arity-overloading ' + 'question is still open');
        })() : function () {
            var paramsø1 = first(defsø1);
            var bodyø1 = rest(defsø1);
            var parsedø1 = parseArglist(paramsø1);
            var indicesø1 = bindIndices_((parsedø1 || 0)['names']);
            var bindsø1 = bindNames_(indicesø1);
            var argvø1 = vec(mapIndexed(function ($1, $2) {
                return get.apply(null, [
                    bindsø1,
                    $1,
                    $2
                ]);
            }, (parsedø1 || 0)['names']));
            var destructuringø1 = isEmpty(bindsø1) ? [] : [list.apply(null, [symbol(null, 'let**')].concat([destructure(vec(mapcat(function (i) {
                        return [
                            nth((parsedø1 || 0)['names'], i),
                            (bindsø1 || 0)[i]
                        ];
                    }, indicesø1)))], vec(bodyø1)))];
            var defaultingø1 = map(function (d) {
                return list.apply(null, [symbol(null, 'if')].concat([list.apply(null, [symbol(null, 'nil?')].concat([first(d)]))], [list.apply(null, [symbol(null, 'set!')].concat([first(d)], [second(d)]))]));
            }, (parsedø1 || 0)['defaults']);
            var body_ø1 = isEmpty(destructuringø1) ? concat(defaultingø1, bodyø1) : concat(defaultingø1, destructuringø1);
            return nameø1 ? list.apply(null, [symbol(null, 'fn*')].concat([nameø1], [argvø1], vec(body_ø1))) : list.apply(null, [symbol(null, 'fn*')].concat([argvø1], vec(body_ø1)));
        }.call(this);
    }.call(this);
};
installMacro('lambda', expandLambda);
var expandLambda_ = exports.expandLambda_ = function expandLambda_() {
    var args = Array.prototype.slice.call(arguments, 0);
    return isSymbol(first(args)) ? (function () {
        return (function () {
            throw Error('lambda* does not support a name -- arrows are anonymous');
        })();
    })() : isList(first(args)) && isList(first(first(args))) ? (function () {
        return (function () {
            throw Error('' + 'lambda*: multi-arity clauses are not supported -- ' + 'use &optional (or lambda) instead');
        })();
    })() : (function () {
        return function () {
            var paramsø1 = first(args);
            var bodyø1 = rest(args);
            var parsedø1 = parseArglist(paramsø1);
            var namesø1 = (parsedø1 || 0)['names'];
            return some(function ($) {
                return isEqual(symbol(null, '&'), $);
            }, namesø1) ? (function () {
                throw Error('' + 'lambda* does not support &rest -- the variadic ' + 'lowering slices `arguments`, which arrows lack');
            })() : function () {
                var indicesø1 = bindIndices_(namesø1);
                var bindsø1 = bindNames_(indicesø1);
                var argvø1 = vec(mapIndexed(function ($1, $2) {
                    return get.apply(null, [
                        bindsø1,
                        $1,
                        $2
                    ]);
                }, namesø1));
                var destructuringø1 = isEmpty(bindsø1) ? [] : [list.apply(null, [symbol(null, 'let**')].concat([destructure(vec(mapcat(function (i) {
                            return [
                                nth(namesø1, i),
                                (bindsø1 || 0)[i]
                            ];
                        }, indicesø1)))], vec(bodyø1)))];
                var defaultingø1 = map(function (d) {
                    return list.apply(null, [symbol(null, 'if')].concat([list.apply(null, [symbol(null, 'nil?')].concat([first(d)]))], [list.apply(null, [symbol(null, 'set!')].concat([first(d)], [second(d)]))]));
                }, (parsedø1 || 0)['defaults']);
                var body_ø1 = isEmpty(destructuringø1) ? concat(defaultingø1, bodyø1) : concat(defaultingø1, destructuringø1);
                return withMeta(list.apply(null, [symbol(null, 'fn*')].concat([argvø1], vec(body_ø1))), { 'arrow': true });
            }.call(this);
        }.call(this);
    })();
};
installMacro('lambda*', expandLambda_);
var expandDefplugin = exports.expandDefplugin = function expandDefplugin(id) {
    var more = Array.prototype.slice.call(arguments, 1);
    return function () {
        var attrsø1 = isDictionary(first(more)) ? first(more) : {};
        var defnFormsø1 = isDictionary(first(more)) ? rest(more) : more;
        var paramsø1 = first(defnFormsø1);
        var bodyø1 = rest(defnFormsø1);
        var pluginø1 = gensym('plugin');
        var forwardingø1 = map(function (k) {
            return list.apply(null, [symbol(null, '.defineProperty')].concat([symbol('js', 'Object')], [pluginø1], [name(k)], [dictionary.apply(null, ['\uA789value'].concat([(attrsø1 || 0)[k]], ['\uA789writable'], [true], ['\uA789enumerable'], [true], ['\uA789configurable'], [true]))]));
        }, keys(attrsø1));
        return list.apply(null, [symbol(null, 'defvar')].concat([id], [list.apply(null, [list.apply(null, [symbol(null, 'lambda')].concat([list.apply(null, [pluginø1].concat())], vec(forwardingø1), [pluginø1]))].concat([list.apply(null, [symbol(null, 'lambda*')].concat([paramsø1], vec(bodyø1)))]))]));
    }.call(this);
};
installMacro('defplugin', expandDefplugin);
var expandLoop = exports.expandLoop = function expandLoop(bindings) {
    var body = Array.prototype.slice.call(arguments, 1);
    return function () {
        var bindingsø2 = parenBindingsToVec(bindings);
        var pairsø1 = partition(2, bindingsø2);
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
        return isEmpty(namesø1) ? list.apply(null, [symbol(null, 'loop*')].concat([bindingsø2], vec(body))) : list.apply(null, [symbol(null, 'let**')].concat([vec(concat.apply(null, mapIndexed(get_ø1, pairsø1)))], [list.apply(null, [symbol(null, 'loop*')].concat([vec(concat.apply(null, mapIndexed(function ($1, $2) {
                    return function () {
                        var xø1 = get.apply(null, [
                            namesø1,
                            $1,
                            first($2)
                        ]);
                        return [
                            xø1,
                            xø1
                        ];
                    }.call(this);
                }, pairsø1)))], [list.apply(null, [symbol(null, 'let**')].concat([vec(mapcat(function (i) {
                        return [
                            first(pairsø1[i]),
                            namesø1[i]
                        ];
                    }, indicesø1))], vec(body)))]))]));
    }.call(this);
};
installMacro('loop', expandLoop);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndpc3AvZXhwYW5kZXIud2lzcCJdLCJuYW1lcyI6WyJfbnNfIiwiaWQiLCJkb2MiLCJtZXRhIiwid2l0aE1ldGEiLCJpc1N5bWJvbCIsImlzS2V5d29yZCIsImtleXdvcmQiLCJpc1F1b3RlIiwic3ltYm9sIiwibmFtZXNwYWNlIiwibmFtZSIsImdlbnN5bSIsImlzVW5xdW90ZSIsImlzVW5xdW90ZVNwbGljaW5nIiwiaXNMaXN0IiwibGlzdCIsImNvbmoiLCJwYXJ0aXRpb24iLCJzZXEiLCJyZXBlYXRlZGx5IiwiaXNFbXB0eSIsIm1hcCIsIm1hcHYiLCJ2ZWMiLCJzZXQiLCJpc0V2ZXJ5IiwiY29uY2F0IiwiZmlyc3QiLCJzZWNvbmQiLCJ0aGlyZCIsInJlc3QiLCJsYXN0IiwibWFwY2F0IiwibnRoIiwiYnV0bGFzdCIsImludGVybGVhdmUiLCJjb25zIiwiY291bnQiLCJ0YWtlIiwiZGlzc29jIiwic29tZSIsImFzc29jIiwicmVkdWNlIiwiZmlsdGVyIiwiaXNTZXEiLCJ6aXBtYXAiLCJkcm9wIiwibGF6eVNlcSIsInJhbmdlIiwicmV2ZXJzZSIsImRvcnVuIiwibWFwSW5kZXhlZCIsImlzTmlsIiwiaXNEaWN0aW9uYXJ5IiwiaXNWZWN0b3IiLCJrZXlzIiwiZ2V0IiwidmFscyIsImlzU3RyaW5nIiwiaXNOdW1iZXIiLCJpc0Jvb2xlYW4iLCJpc0RhdGUiLCJpc1JlUGF0dGVybiIsImlzRXZlbiIsImlzT2RkIiwiaXNFcXVhbCIsIm1heCIsImluYyIsImRlYyIsImRpY3Rpb25hcnkiLCJtZXJnZSIsInN1YnMiLCJzcGxpdCIsImpvaW4iLCJjYXBpdGFsaXplIiwiX19tYWNyb3NfXyIsImV4cG9ydHMiLCJleHBhbmQiLCJleHBhbmRlciIsImZvcm0iLCJlbnYiLCJtZXRhZGF0YcO4MSIsInBhcm1hc8O4MSIsImltcGxpY2l0w7gxIiwiJCIsInBhcmFtc8O4MSIsImV4cGFuc2lvbsO4MSIsImluc3RhbGxNYWNybyIsIm9wIiwibWFjcm8iLCJpc0RvdFN5bnRheCIsImlzTWV0aG9kU3ludGF4IiwiaWTDuDEiLCJpc0ZpZWxkU3ludGF4IiwiaXNOZXdTeW50YXgiLCJtZXRob2RTeW50YXgiLCJ0YXJnZXQiLCJwYXJhbXMiLCJvcE1ldGHDuDEiLCJmb3JtU3RhcnTDuDEiLCJ0YXJnZXRNZXRhw7gxIiwibWVtYmVyw7gxIiwiYWdldMO4MSIsIm1ldGhvZMO4MSIsIkVycm9yIiwiZmllbGRTeW50YXgiLCJmaWVsZCIsIm1vcmUiLCJzdGFydMO4MSIsImVuZMO4MSIsImRvdFN5bnRheCIsIl9maWVsZMO4MSIsIm5ld1N5bnRheCIsImlkTWV0YcO4MSIsInJlbmFtZcO4MSIsImNvbnN0cnVjdG9yw7gxIiwib3BlcmF0b3LDuDEiLCJrZXl3b3JkSW52b2tlIiwiYXJncyIsImRlc3VnYXIiLCJkZXN1Z2FyZWTDuDEiLCJtYWNyb2V4cGFuZDEiLCJvcMO4MSIsImV4cGFuZGVyw7gxIiwibWFjcm9leHBhbmQiLCJvcmlnaW5hbMO4MSIsImV4cGFuZGVkw7gxIiwic3ludGF4UXVvdGUiLCJyZWFkZXJFcnJvciIsInNlcXVlbmNlRXhwYW5kIiwic3ludGF4UXVvdGVFeHBhbmQiLCJ1bnF1b3RlU3BsaWNpbmdFeHBhbmQiLCJmb3JtcyIsImV4cGFuZE5vdEVxdWFsIiwiYm9keSIsImV4cGFuZElmTm90IiwiY29uZGl0aW9uIiwidHJ1dGh5IiwiYWx0ZXJuYXRpdmUiLCJleHBhbmRDb21tZW50IiwiZXhwYW5kVGhyZWFkRmlyc3QiLCJvcGVyYXRpb25zIiwib3BlcmF0aW9uIiwiZXhwYW5kVGhyZWFkTGFzdCIsImV4cGFuZERvdHMiLCJ4IiwiZXhwYW5kVGhyZWFkQXMiLCJleHByIiwiZXhwYW5kQ29uZCIsImNsYXVzZXMiLCJjbGF1c2XDuDEiLCJ0ZXN0w7gxIiwiYm9kecO4MSIsImV4cGFuZENhc2UiLCJlIiwic3ltw7gxIiwiZXFfw7gxIiwiYyIsInBhaXJzw7gxIiwiY29uZHPDuDEiLCJjb25kc8O4MiIsInJlc3VsdMO4MSIsInjDuDEiLCJ4c8O4MSIsImNvbnN0c8O4MSIsImV4cGFuZENvbmRwIiwicHJlZCIsInN5bV/DuDEiLCJjb21wYXJlw7gxIiwic3BsaXRzw7gxIiwic3BsaXRzIiwieHMiLCJfdGhyZWFkIiwiaW5zZXJ0Iiwic3ltIiwidGVzdCIsImZvcm3DuDIiLCJfY29uZFRocmVhZCIsImV4cGFuZENvbmRUaHJlYWRGaXJzdCIsImV4cGFuZENvbmRUaHJlYWRMYXN0IiwiX3NvbWVUaHJlYWQiLCJleHBhbmRTb21lVGhyZWFkRmlyc3QiLCJleHBhbmRTb21lVGhyZWFkTGFzdCIsImJ1aWxkRGVmdW4iLCJwcml2YXRlIiwiX2FuZEZvcm0iLCJkb2NQbHVzQm9keSIsImRvY8O4MSIsImZuw7gxIiwiZGVmT3DDuDEiLCJleHBhbmREZWZ1biIsImV4cGFuZERlZmNvbnN0IiwidmFsdWUiLCJleHBhbmRTZXRxIiwicGxhY2UiLCJleHBhbmRTZXRmIiwiZXhwYW5kTGF6eVNlcSIsImV4cGFuZFdoZW4iLCJleHBhbmRVbmxlc3MiLCJleHBhbmRJZkxldCIsImJpbmRpbmdzIiwidGhlbiIsImVsc2VfIiwibmFtZcO4MSIsImRlc3RydWN0dXJlIiwiZXhwYW5kV2hlbkxldCIsImV4cGFuZElmU29tZSIsImV4cGFuZFdoZW5Tb21lIiwiZXhwYW5kV2hlbkZpcnN0IiwiZXhwYW5kV2hpbGUiLCJleHBhbmREb3RvIiwiZXhwYW5kRG90aW1lcyIsIm7DuDEiLCJmb3JTdGVwIiwiY29udGV4dCIsImxvb3AiLCJtb2RpZmllcnMiLCJpdGVyw7gxIiwiY29sbMO4MSIsInN1YnNlccO4MSIsImJvZHlfw7gxIiwibmV4dMO4MSIsIm1vZHPDuDEiLCJib2R5w7gyIiwibcO4MSIsIml0ZW3DuDEiLCJhcmfDuDEiLCJwYXJlbkJpbmRpbmdzVG9WZWMiLCJmb3JNb2RpZmllcnMiLCJmb3JQYXJ0cyIsInNlcUV4cHJQYWlycyIsImluZGljZXPDuDEiLCJzZWdtZW50c8O4MSIsInNsaWNlIiwiZXhwYW5kRm9yIiwic2VxRXhwcnMiLCJib2R5RXhwciIsInBhcnRzw7gxIiwiJDEiLCIkMiIsImV4cGFuZERvc2VxIiwic3ltXyIsInN0cmluZyIsIndvcmRzw7gxIiwiYmluZFN5bV8iLCJzIiwiYiIsImNvbmpTeW1zXyIsImdldF8iLCJyZXN1bHQiLCJrIiwidiIsImYiLCJxdW90ZSIsImtOc8O4MSIsImfDuDEiLCJkaWN0R2V0XyIsImRpY3ROYW1lIiwiZGVmYXVsdHMiLCJiaW5kaW5nIiwia2V5Iiwic8O4MSIsImvDuDEiLCJkZXN0cnVjdHVyZURpY3QiLCJmcm9tIiwiZGljdE5hbWXDuDEiLCJkaWN0QmluZMO4MSIsImdldF/DuDEiLCJrc8O4MSIsInbDuDEiLCJrX8O4MSIsImRlc3RydWN0dXJlU2VxIiwiYXPDuDEiLCJmaW5kSW5kZXgiLCJzZXFOYW1lw7gxIiwiYmluZGluZzHDuDEiLCJtb3Jlw7gxIiwidGFpbMO4MSIsImJpbmRpbmcyw7gxIiwiacO4MSIsImJpbmROYW1lc18iLCJiaW5kSW5kaWNlc18iLCJuYW1lcyIsInBhaXIiLCJleHBhbmRMZXRfIiwiZXhwYW5kTGV0IiwiZ2Vuc3ltc8O4MSIsIl8iLCJvdXRlcsO4MSIsImciLCJpbm5lcsO4MSIsInBhcnNlQXJnbGlzdCIsInJlbWFpbmluZ8O4MSIsIm1vZGXDuDEiLCJuYW1lc8O4MSIsImRlZmF1bHRzw7gxIiwiZXhwYW5kTGFtYmRhIiwiZGVmc8O4MSIsInBhcnNlZMO4MSIsImJpbmRzw7gxIiwiYXJndsO4MSIsImRlc3RydWN0dXJpbmfDuDEiLCJpIiwiZGVmYXVsdGluZ8O4MSIsImQiLCJleHBhbmRMYW1iZGFfIiwiZXhwYW5kRGVmcGx1Z2luIiwiYXR0cnPDuDEiLCJkZWZuRm9ybXPDuDEiLCJwbHVnaW7DuDEiLCJmb3J3YXJkaW5nw7gxIiwiZXhwYW5kTG9vcCIsImJpbmRpbmdzw7gyIl0sIm1hcHBpbmdzIjoiO0lBQUEsSUFBQ0EsSSxHQUFEO0FBQUEsUUFBQUMsRSxFQUFJLGVBQUo7QUFBQSxRQUFBQyxHLEVBQ0UsdUNBREY7QUFBQSxNOztRQUU4QkMsSUFBQSxHLFNBQUFBLEk7UUFBS0MsUUFBQSxHLFNBQUFBLFE7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SUFBQSxFO0NBUEYsQztBQXFCQy9DLFlBQUQsQyxNQUFBLEVBQXFCZ08sVUFBckIiLCJzb3VyY2VzQ29udGVudCI6WyIobnMgd2lzcC5leHBhbmRlclxuICBcIndpc3Agc3ludGF4IGFuZCBtYWNybyBleHBhbmRlciBtb2R1bGVcIlxuICAoOnJlcXVpcmUgW3dpc3AuYXN0IDpyZWZlciBbbWV0YSB3aXRoLW1ldGEgc3ltYm9sPyBrZXl3b3JkPyBrZXl3b3JkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBxdW90ZT8gc3ltYm9sIG5hbWVzcGFjZSBuYW1lIGdlbnN5bVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5xdW90ZT8gdW5xdW90ZS1zcGxpY2luZz9dXVxuICAgICAgICAgICAgW3dpc3Auc2VxdWVuY2UgOnJlZmVyIFtsaXN0PyBsaXN0IGNvbmogcGFydGl0aW9uIHNlcSByZXBlYXRlZGx5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVtcHR5PyBtYXAgbWFwdiB2ZWMgc2V0IGV2ZXJ5PyBjb25jYXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3Qgc2Vjb25kIHRoaXJkIHJlc3QgbGFzdCBtYXBjYXQgbnRoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1dGxhc3QgaW50ZXJsZWF2ZSBjb25zIGNvdW50IHRha2UgZGlzc29jXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvbWUgYXNzb2MgcmVkdWNlIGZpbHRlciBzZXE/IHppcG1hcCBkcm9wXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhenktc2VxIHJhbmdlIHJldmVyc2UgZG9ydW4gbWFwLWluZGV4ZWRdXVxuICAgICAgICAgICAgW3dpc3AucnVudGltZSA6cmVmZXIgW25pbD8gZGljdGlvbmFyeT8gdmVjdG9yPyBrZXlzIGdldFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHMgc3RyaW5nPyBudW1iZXI/IGJvb2xlYW4/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZT8gcmUtcGF0dGVybj8gZXZlbj8gb2RkPyA9IG1heFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluYyBkZWMgZGljdGlvbmFyeSBtZXJnZSBzdWJzXV1cbiAgICAgICAgICAgIFt3aXNwLnN0cmluZyA6cmVmZXIgW3NwbGl0IGpvaW4gY2FwaXRhbGl6ZV1dKSlcblxuXG4oZGVmdmFyICoqbWFjcm9zKioge30pXG5cbihkZWZ1bi0gZXhwYW5kXG4gIChleHBhbmRlciBmb3JtIGVudilcbiAgXCJBcHBsaWVzIG1hY3JvIHJlZ2lzdGVyZWQgd2l0aCBnaXZlbiBgbmFtZWAgdG8gYSBnaXZlbiBgZm9ybWBcIlxuICAobGV0KiAoKG1ldGFkYXRhIChvciAobWV0YSBmb3JtKSB7fSkpXG4gICAgICAgIChwYXJtYXMgKHJlc3QgZm9ybSkpXG4gICAgICAgIChpbXBsaWNpdCAobWFwIChsYW1iZGEgKCUpIChjb25kICgoPSA6JmZvcm0gJSkgZm9ybSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCg9IDomZW52ICUpIGVudilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGVsc2UgJSkpKVxuICAgICAgICAgICAgICAgICAgICAgIChvciAoOmltcGxpY2l0IChtZXRhIGV4cGFuZGVyKSkgW10pKSlcbiAgICAgICAgKHBhcmFtcyAodmVjIChjb25jYXQgaW1wbGljaXQgKHZlYyAocmVzdCBmb3JtKSkpKSlcblxuICAgICAgICAoZXhwYW5zaW9uIChhcHBseSBleHBhbmRlciBwYXJhbXMpKSlcbiAgICAoaWYgZXhwYW5zaW9uXG4gICAgICAod2l0aC1tZXRhIGV4cGFuc2lvbiAoY29uaiBtZXRhZGF0YSAobWV0YSBleHBhbnNpb24pKSlcbiAgICAgIGV4cGFuc2lvbikpKVxuXG4oZGVmdW4gaW5zdGFsbC1tYWNybyFcbiAgKG9wIGV4cGFuZGVyKVxuICBcIlJlZ2lzdGVycyBnaXZlbiBgbWFjcm9gIHdpdGggYSBnaXZlbiBgbmFtZWBcIlxuICAoc2V0ZiAoZ2V0ICoqbWFjcm9zKiogKG5hbWUgb3ApKSBleHBhbmRlcikpXG5cbihkZWZ1bi0gbWFjcm9cbiAgKG9wKVxuICBcIlJldHVybnMgdHJ1ZSBpZiBtYWNybyB3aXRoIGEgZ2l2ZW4gbmFtZSBpcyByZWdpc3RlcmVkXCJcbiAgKGFuZCAoc3ltYm9sPyBvcClcbiAgICAgICAoZ2V0ICoqbWFjcm9zKiogKG5hbWUgb3ApKSkpXG5cblxuKGRlZnVuIGRvdC1zeW50YXg/XG4gIChvcClcbiAgKGFuZCAoc3ltYm9sPyBvcCkgKGlkZW50aWNhbD8gXFwuIChuYW1lIG9wKSkpKVxuXG4oZGVmdW4gbWV0aG9kLXN5bnRheD9cbiAgKG9wKVxuICAobGV0KiAoKGlkIChhbmQgKHN5bWJvbD8gb3ApIChuYW1lIG9wKSkpKVxuICAgIChhbmQgaWRcbiAgICAgICAgIChpZGVudGljYWw/IFxcLiAoZmlyc3QgaWQpKVxuICAgICAgICAgKG5vdCAoaWRlbnRpY2FsPyBcXC0gKHNlY29uZCBpZCkpKVxuICAgICAgICAgKG5vdCAoaWRlbnRpY2FsPyBcXC4gaWQpKSkpKVxuXG4oZGVmdW4gZmllbGQtc3ludGF4P1xuICAob3ApXG4gIChsZXQqICgoaWQgKGFuZCAoc3ltYm9sPyBvcCkgKG5hbWUgb3ApKSkpXG4gICAgKGFuZCBpZFxuICAgICAgICAgKGlkZW50aWNhbD8gXFwuIChmaXJzdCBpZCkpXG4gICAgICAgICAoaWRlbnRpY2FsPyBcXC0gKHNlY29uZCBpZCkpKSkpXG5cbihkZWZ1biBuZXctc3ludGF4P1xuICAob3ApXG4gIChsZXQqICgoaWQgKGFuZCAoc3ltYm9sPyBvcCkgKG5hbWUgb3ApKSkpXG4gICAgKGFuZCBpZFxuICAgICAgICAgKGlkZW50aWNhbD8gXFwuIChsYXN0IGlkKSlcbiAgICAgICAgIChub3QgKGlkZW50aWNhbD8gXFwuIGlkKSkpKSlcblxuKGRlZnVuIG1ldGhvZC1zeW50YXhcbiAgKG9wIHRhcmdldCAmcmVzdCBwYXJhbXMpXG4gIFwiRXhhbXBsZTpcbiAgJyguc3Vic3RyaW5nIHN0cmluZyAyIDUpID0+ICcoKGFnZXQgc3RyaW5nICdzdWJzdHJpbmcpIDIgNSlcIlxuICAobGV0KiAoKG9wLW1ldGEgKG1ldGEgb3ApKVxuICAgICAgICAoZm9ybS1zdGFydCAoOnN0YXJ0IG9wLW1ldGEpKVxuICAgICAgICAodGFyZ2V0LW1ldGEgKG1ldGEgdGFyZ2V0KSlcbiAgICAgICAgKG1lbWJlciAod2l0aC1tZXRhIChzeW1ib2wgKHN1YnMgKG5hbWUgb3ApIDEpKVxuICAgICAgICAgICAgICAgICA7OyBJbmNsdWRlIG1ldGFkYXQgZnJvbSB0aGUgb3JpZ2luYWwgc3ltYm9sIGp1c3RcbiAgICAgICAgICAgICAgICAgKGNvbmogb3AtbWV0YVxuICAgICAgICAgICAgICAgICAgICAgICB7OnN0YXJ0IHs6bGluZSAoOmxpbmUgZm9ybS1zdGFydClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmNvbHVtbiAoaW5jICg6Y29sdW1uIGZvcm0tc3RhcnQpKX19KSkpXG4gICAgICAgIDs7IEFkZCBtZXRhZGF0YSB0byBhZ2V0IHN5bWJvbCB0aGF0IHdpbGwgbWFwIHRvIHRoZSBmaXJzdCBgLmBcbiAgICAgICAgOzsgY2hhcmFjdGVyIG9mIHRoZSBtZXRob2QgbmFtZS5cbiAgICAgICAgKGFnZXQgKHdpdGgtbWV0YSAnYWdldFxuICAgICAgICAgICAgICAgKGNvbmogb3AtbWV0YVxuICAgICAgICAgICAgICAgICAgICAgezplbmQgezpsaW5lICg6bGluZSBmb3JtLXN0YXJ0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpjb2x1bW4gKGluYyAoOmNvbHVtbiBmb3JtLXN0YXJ0KSl9fSkpKVxuXG4gICAgICAgIDs7IEZpcnN0IHR3byBmb3JtcyAoLnN1YnN0cmluZyBzdHJpbmcgLi4uKSBleHBhbmQgdG9cbiAgICAgICAgOzsgKChhZ2V0IHN0cmluZyAnc3Vic3RyaW5nKSAuLi4pIHRoZXJlIGZvciBleHBhbnNpb24gZ2V0c1xuICAgICAgICA7OyBwb3NpdGlvbiBtZXRhZGF0YSBmcm9tIHN0YXJ0IG9mIHRoZSBmaXJzdCBgLnN1YnN0cmluZ2AgZm9ybVxuICAgICAgICA7OyB0byB0aGUgZW5kIG9mIHRoZSBgc3RyaW5nYCBmb3JtLlxuICAgICAgICAobWV0aG9kICh3aXRoLW1ldGEgYCgsYWdldCAsdGFyZ2V0IChxdW90ZSAsbWVtYmVyKSlcbiAgICAgICAgICAgICAgICAgKGNvbmogb3AtbWV0YVxuICAgICAgICAgICAgICAgICAgICAgICB7OmVuZCAoOmVuZCAobWV0YSB0YXJnZXQpKX0pKSkpXG4gICAgKGlmIChuaWw/IHRhcmdldClcbiAgICAgICh0aHJvdyAoRXJyb3IgXCJNYWxmb3JtZWQgbWV0aG9kIGV4cHJlc3Npb24sIGV4cGVjdGluZyAoLm1ldGhvZCBvYmplY3QgLi4uKVwiKSlcbiAgICAgIGAoLG1ldGhvZCAsQHBhcmFtcykpKSlcblxuKGRlZnVuIGZpZWxkLXN5bnRheFxuICAoZmllbGQgdGFyZ2V0ICZyZXN0IG1vcmUpXG4gIFwiRXhhbXBsZTpcbiAgJyguLWZpZWxkIG9iamVjdCkgPT4gJyhhZ2V0IG9iamVjdCAnZmllbGQpXCJcbiAgKGxldCogKChtZXRhZGF0YSAobWV0YSBmaWVsZCkpXG4gICAgICAgIChzdGFydCAoOnN0YXJ0IG1ldGFkYXRhKSlcbiAgICAgICAgKGVuZCAoOmVuZCBtZXRhZGF0YSkpXG4gICAgICAgIChtZW1iZXIgKHdpdGgtbWV0YSAoc3ltYm9sIChzdWJzIChuYW1lIGZpZWxkKSAyKSlcbiAgICAgICAgICAgICAgICAgKGNvbmogbWV0YWRhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgezpzdGFydCB7OmxpbmUgKDpsaW5lIHN0YXJ0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Y29sdW1uICgrICg6Y29sdW1uIHN0YXJ0KSAyKX19KSkpKVxuICAgIChpZiAob3IgKG5pbD8gdGFyZ2V0KVxuICAgICAgICAgICAgKGNvdW50IG1vcmUpKVxuICAgICAgKHRocm93IChFcnJvciBcIk1hbGZvcm1lZCBtZW1iZXIgZXhwcmVzc2lvbiwgZXhwZWN0aW5nICguLW1lbWJlciB0YXJnZXQpXCIpKVxuICAgICAgYChhZ2V0ICx0YXJnZXQgKHF1b3RlICxtZW1iZXIpKSkpKVxuXG4oZGVmdW4gZG90LXN5bnRheFxuICAob3AgdGFyZ2V0IGZpZWxkICZyZXN0IHBhcmFtcylcbiAgXCJFeGFtcGxlOlxuICAnKC4gb2JqZWN0IC1maWVsZCkgPT4gJyhhZ2V0IG9iamVjdCAnZmllbGQpXG4gICcoLiBzdHJpbmcgc3Vic3RyaW5nIDIgNSkgPT4gJygoYWdldCBzdHJpbmcgJ3N1YnN0cmluZykgMiA1KVwiXG4gIChpZi1ub3QgKHN5bWJvbD8gZmllbGQpXG4gICAgKHRocm93IChFcnJvciBcIk1hbGZvcm1lZCAuIGZvcm1cIikpKVxuICAobGV0KiAoKCpmaWVsZCAobmFtZSBmaWVsZCkpKVxuICAgIChhcHBseSAoaWYgKGlkZW50aWNhbD8gXFwtIChmaXJzdCAqZmllbGQpKSBmaWVsZC1zeW50YXggbWV0aG9kLXN5bnRheClcbiAgICAgICAgICAgKHN5bWJvbCAoc3RyIFxcLiAqZmllbGQpKSB0YXJnZXQgcGFyYW1zKSkpXG5cbihkZWZ1biBuZXctc3ludGF4XG4gIChvcCAmcmVzdCBwYXJhbXMpXG4gIFwiRXhhbXBsZTpcbiAgJyhQb2ludC4geCB5KSA9PiAnKG5ldyBQb2ludCB4IHkpXCJcbiAgKGxldCogKChpZCAobmFtZSBvcCkpXG4gICAgICAgIChpZC1tZXRhICg6bWV0YSBpZCkpXG4gICAgICAgIChyZW5hbWUgKHN1YnMgaWQgMCAoZGVjIChjb3VudCBpZCkpKSlcbiAgICAgICAgOzsgY29uc3RydWN0dXIgc3ltYm9sIGluaGVyaXRzIG1ldGFkYSBmcm9tIHRoZSBmaXJzdCBgb3BgIGZvcm1cbiAgICAgICAgOzsgaXQncyBqdXN0IGl0J3MgZW5kIGNvbHVtbiBpbmZvIGlzIHVwZGF0ZWQgdG8gcmVmbGVjdCBzdWJ0cmFjdGlvblxuICAgICAgICA7OyBvZiBgLmAgY2hhcmFjdGVyLlxuICAgICAgICAoY29uc3RydWN0b3IgKHdpdGgtbWV0YSAoc3ltYm9sIHJlbmFtZSlcbiAgICAgICAgICAgICAgICAgICAgICAoY29uaiBpZC1tZXRhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgezplbmQgezpsaW5lICg6bGluZSAoOmVuZCBpZC1tZXRhKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmNvbHVtbiAoZGVjICg6Y29sdW1uICg6ZW5kIGlkLW1ldGEpKSl9fSkpKVxuICAgICAgICAob3BlcmF0b3IgKHdpdGgtbWV0YSAnbmV3XG4gICAgICAgICAgICAgICAgICAgKGNvbmogaWQtbWV0YVxuICAgICAgICAgICAgICAgICAgICAgICAgIHs6c3RhcnQgezpsaW5lICg6bGluZSAoOmVuZCBpZC1tZXRhKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Y29sdW1uIChkZWMgKDpjb2x1bW4gKDplbmQgaWQtbWV0YSkpKX19KSkpKVxuICAgIGAobmV3ICxjb25zdHJ1Y3RvciAsQHBhcmFtcykpKVxuXG4oZGVmdW4ga2V5d29yZC1pbnZva2VcbiAgKGtleXdvcmQgdGFyZ2V0ICZyZXN0IGFyZ3MpXG4gIFwiQ2FsbGluZyBhIGtleXdvcmQgZGVzdWdhcnMgdG8gcHJvcGVydHkgYWNjZXNzIHdpdGggdGhhdFxuICBrZXl3b3JkIG5hbWUgb24gdGhlIGdpdmVuIGFyZ3VtZW50OlxuICAnKDpmb28gYmFyKSA9PiAnKGdldCBiYXIgOmZvbylcIlxuICAoaWYgKGVtcHR5PyBhcmdzKVxuICAgIGAoZ2V0ICx0YXJnZXQgLGtleXdvcmQpXG4gICAgYChnZXQgLHRhcmdldCAsa2V5d29yZCAsKGZpcnN0IGFyZ3MpKSkpXG5cbihkZWZ1bi0gZGVzdWdhclxuICAoZXhwYW5kZXIgZm9ybSlcbiAgKGxldCogKChkZXN1Z2FyZWQgKGFwcGx5IGV4cGFuZGVyICh2ZWMgZm9ybSkpKVxuICAgICAgICAobWV0YWRhdGEgKGNvbmoge30gKG1ldGEgZm9ybSkgKG1ldGEgZGVzdWdhcmVkKSkpKVxuICAgICh3aXRoLW1ldGEgZGVzdWdhcmVkIG1ldGFkYXRhKSkpXG5cbihkZWZ1biBtYWNyb2V4cGFuZC0xXG4gIChmb3JtIGVudilcbiAgXCJJZiBmb3JtIHJlcHJlc2VudHMgYSBtYWNybyBmb3JtLCByZXR1cm5zIGl0cyBleHBhbnNpb24sXG4gIGVsc2UgcmV0dXJucyBmb3JtLlwiXG4gIChsZXQqICgob3AgKGFuZCAobGlzdD8gZm9ybSlcbiAgICAgICAgICAgICAgICAoZmlyc3QgZm9ybSkpKVxuICAgICAgICAoZXhwYW5kZXIgKG1hY3JvIG9wKSkpXG4gICAgKGNvbmQgKGV4cGFuZGVyIChleHBhbmQgZXhwYW5kZXIgZm9ybSBlbnYpKVxuICAgICAgICAgIDs7IENhbGxpbmcgYSBrZXl3b3JkIGNvbXBpbGVzIHRvIGdldHRpbmcgdmFsdWUgZnJvbSBnaXZlblxuICAgICAgICAgIDs7IG9iamVjdCBhc3NvY2lhdGVkIHdpdGggdGhhdCBrZXk6XG4gICAgICAgICAgOzsgJyg6Zm9vIGJhcikgPT4gJyhnZXQgYmFyIDpmb28pXG4gICAgICAgICAgKChrZXl3b3JkPyBvcCkgKGRlc3VnYXIga2V5d29yZC1pbnZva2UgZm9ybSkpXG4gICAgICAgICAgOzsgJyguIG9iamVjdCBtZXRob2QgZm9vIGJhcikgPT4gJygoYWdldCBvYmplY3QgbWV0aG9kKSBmb28gYmFyKVxuICAgICAgICAgICgoZG90LXN5bnRheD8gb3ApIChkZXN1Z2FyIGRvdC1zeW50YXggZm9ybSkpXG4gICAgICAgICAgOzsgJyguLWZpZWxkIG9iamVjdCkgPT4gJyhhZ2V0IG9iamVjdCAnZmllbGQpXG4gICAgICAgICAgKChmaWVsZC1zeW50YXg/IG9wKSAoZGVzdWdhciBmaWVsZC1zeW50YXggZm9ybSkpXG4gICAgICAgICAgOzsgJyguc3Vic3RyaW5nIHN0cmluZyAyIDUpID0+ICcoKGFnZXQgc3RyaW5nICdzdWJzdHJpbmcpIDIgNSlcbiAgICAgICAgICAoKG1ldGhvZC1zeW50YXg/IG9wKSAoZGVzdWdhciBtZXRob2Qtc3ludGF4IGZvcm0pKVxuICAgICAgICAgIDs7ICcoUG9pbnQuIHggeSkgPT4gJyhuZXcgUG9pbnQgeCB5KVxuICAgICAgICAgICgobmV3LXN5bnRheD8gb3ApIChkZXN1Z2FyIG5ldy1zeW50YXggZm9ybSkpXG4gICAgICAgICAgKGVsc2UgZm9ybSkpKSlcblxuKGRlZnVuIG1hY3JvZXhwYW5kXG4gIChmb3JtIGVudilcbiAgXCJSZXBlYXRlZGx5IGNhbGxzIG1hY3JvZXhwYW5kLTEgb24gZm9ybSB1bnRpbCBpdCBubyBsb25nZXJcbiAgcmVwcmVzZW50cyBhIG1hY3JvIGZvcm0sIHRoZW4gcmV0dXJucyBpdC5cIlxuICAobG9vcCAoKG9yaWdpbmFsIGZvcm0pXG4gICAgICAgICAoZXhwYW5kZWQgKG1hY3JvZXhwYW5kLTEgZm9ybSBlbnYpKSlcbiAgICAoaWYgKGlkZW50aWNhbD8gb3JpZ2luYWwgZXhwYW5kZWQpXG4gICAgICBvcmlnaW5hbFxuICAgICAgKHJlY3VyIGV4cGFuZGVkIChtYWNyb2V4cGFuZC0xIGV4cGFuZGVkIGVudikpKSkpXG5cblxuOzsgRGVmaW5lIGNvcmUgbWFjcm9zXG5cblxuOzsgVE9ETyBtYWtlIHRoaXMgbGFuZ3VhZ2UgaW5kZXBlbmRlbnRcblxuKGRlZnVuIHN5bnRheC1xdW90ZSAoZm9ybSlcbiAgKGNvbmQgKChzeW1ib2w/IGZvcm0pIChsaXN0ICdxdW90ZSBmb3JtKSlcbiAgICAgICAgKChrZXl3b3JkPyBmb3JtKSAobGlzdCAncXVvdGUgZm9ybSkpXG4gICAgICAgICgob3IgKG51bWJlcj8gZm9ybSlcbiAgICAgICAgICAgIChzdHJpbmc/IGZvcm0pXG4gICAgICAgICAgICAoYm9vbGVhbj8gZm9ybSlcbiAgICAgICAgICAgIChuaWw/IGZvcm0pXG4gICAgICAgICAgICAocmUtcGF0dGVybj8gZm9ybSkpIGZvcm0pXG5cbiAgICAgICAgKCh1bnF1b3RlPyBmb3JtKSAoc2Vjb25kIGZvcm0pKVxuICAgICAgICAoKHVucXVvdGUtc3BsaWNpbmc/IGZvcm0pIChyZWFkZXItZXJyb3IgXCJJbGxlZ2FsIHVzZSBvZiBgLEBgIGV4cHJlc3Npb24sIGNhbiBvbmx5IGJlIHByZXNlbnQgaW4gYSBsaXN0XCIpKVxuXG4gICAgICAgICgoZW1wdHk/IGZvcm0pIGZvcm0pXG5cbiAgICAgICAgOztcbiAgICAgICAgKChkaWN0aW9uYXJ5PyBmb3JtKSAobGlzdCAnYXBwbHlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdkaWN0aW9uYXJ5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoY29ucyAnLmNvbmNhdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHNlcXVlbmNlLWV4cGFuZCAoYXBwbHkgY29uY2F0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoc2VxIGZvcm0pKSkpKSlcbiAgICAgICAgOzsgSWYgYSB2ZWN0b3IgZm9ybSBleHBhbmQgYWxsIHN1Yi1mb3JtcyBhbmQgY29uY2F0ZW5hdGVcbiAgICAgICAgOzsgdGhlbSB0b2dldGhlcjpcbiAgICAgICAgOztcbiAgICAgICAgOzsgWyxhIGIgLEBjXSAtPiAoLmNvbmNhdCBbYV0gWyhxdW90ZSBiKV0gYylcbiAgICAgICAgKCh2ZWN0b3I/IGZvcm0pIChjb25zICcuY29uY2F0IChzZXF1ZW5jZS1leHBhbmQgZm9ybSkpKVxuXG4gICAgICAgIDs7IElmIGEgbGlzdCBmb3JtIGV4cGFuZCBhbGwgdGhlIHN1Yi1mb3JtcyBhbmQgYXBwbHlcbiAgICAgICAgOzsgY29uY2F0ZW5hdGlvbiB0byBhIGxpc3QgY29uc3RydWN0b3I6XG4gICAgICAgIDs7XG4gICAgICAgIDs7ICgsYSBiICxAYykgLT4gKGFwcGx5IGxpc3QgKC5jb25jYXQgW2FdIFsocXVvdGUgYildIGMpKVxuICAgICAgICAoKGxpc3Q/IGZvcm0pIChpZiAoZW1wdHk/IGZvcm0pXG4gICAgICAgICAgICAgICAgICAgICAgIChjb25zICdsaXN0IG5pbClcbiAgICAgICAgICAgICAgICAgICAgICAgKGxpc3QgJ2FwcGx5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICdsaXN0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIChjb25zICcuY29uY2F0IChzZXF1ZW5jZS1leHBhbmQgZm9ybSkpKSkpXG5cbiAgICAgICAgKGVsc2UgKHJlYWRlci1lcnJvciBcIlVua25vd24gQ29sbGVjdGlvbiB0eXBlXCIpKSkpXG4oZGVmdmFyIHN5bnRheC1xdW90ZS1leHBhbmQgc3ludGF4LXF1b3RlKVxuXG4oZGVmdW4gdW5xdW90ZS1zcGxpY2luZy1leHBhbmRcbiAgKGZvcm0pXG4gIChpZiAodmVjdG9yPyBmb3JtKVxuICAgIGZvcm1cbiAgICAobGlzdCAndmVjIGZvcm0pKSlcblxuKGRlZnVuIHNlcXVlbmNlLWV4cGFuZFxuICAoZm9ybXMpXG4gIFwiVGFrZXMgc2VxdWVuY2Ugb2YgZm9ybXMgYW5kIGV4cGFuZHMgdGhlbTpcblxuICAoKHVucXVvdGUgYSkpIC0+IChbYV0pXG4gICgodW5xdW90ZS1zcGxpY2luZyBhKSkgLT4gKGEpXG4gIChhKSAtPiAoWyhxdW90ZSBiKV0pXG4gICgodW5xdW90ZSBhKSBiICh1bnF1b3RlLXNwbGljaW5nIGEpKSAtPiAoW2FdIFsocXVvdGUgYildIGMpXCJcbiAgKG1hcCAobGFtYmRhIChmb3JtKVxuICAgICAgICAgKGNvbmQgKCh1bnF1b3RlPyBmb3JtKSBbKHNlY29uZCBmb3JtKV0pXG4gICAgICAgICAgICAgICAoKHVucXVvdGUtc3BsaWNpbmc/IGZvcm0pICh1bnF1b3RlLXNwbGljaW5nLWV4cGFuZCAoc2Vjb25kIGZvcm0pKSlcbiAgICAgICAgICAgICAgIChlbHNlIFsoc3ludGF4LXF1b3RlLWV4cGFuZCBmb3JtKV0pKSlcbiAgICAgICBmb3JtcykpXG4oaW5zdGFsbC1tYWNybyEgOnN5bnRheC1xdW90ZSBzeW50YXgtcXVvdGUtZXhwYW5kKVxuXG47OyBUT0RPOiBOZXcgcmVhZGVyIHRyYW5zbGF0ZXMgbm90PSBjb3JyZWN0bHlcbjs7IGJ1dCBmb3IgdGhlIHRpbWUgYmVpbmcgdXNlIG5vdC1lcXVhbCBuYW1lXG4oZGVmdW4gZXhwYW5kLW5vdC1lcXVhbFxuICAoJnJlc3QgYm9keSlcbiAgYChub3QgKD0gLEBib2R5KSkpXG4oaW5zdGFsbC1tYWNybyEgOm5vdD0gZXhwYW5kLW5vdC1lcXVhbClcblxuKGRlZnVuIGV4cGFuZC1pZi1ub3RcbiAgKGNvbmRpdGlvbiB0cnV0aHkgYWx0ZXJuYXRpdmUpXG4gIFwiQ29tcGxlbWVudHMgdGhlIGBpZmAgZXhjbHVzaXZlIGNvbmRpdGlvbmFsIGJyYW5jaC5cIlxuICBgKGlmIChub3QgLGNvbmRpdGlvbikgLHRydXRoeSAsYWx0ZXJuYXRpdmUpKVxuKGluc3RhbGwtbWFjcm8hIDppZi1ub3QgZXhwYW5kLWlmLW5vdClcblxuKGRlZnVuIGV4cGFuZC1jb21tZW50XG4gICgmcmVzdCBib2R5KVxuICBcIklnbm9yZXMgYm9keSwgeWllbGRzIG5pbFwiXG4gIG5pbClcbihpbnN0YWxsLW1hY3JvISA6Y29tbWVudCBleHBhbmQtY29tbWVudClcblxuKGRlZnVuIGV4cGFuZC10aHJlYWQtZmlyc3RcbiAgKCZyZXN0IG9wZXJhdGlvbnMpXG4gIFwiVGhyZWFkIGZpcnN0IG1hY3JvXCJcbiAgKHJlZHVjZVxuICAgIChsYW1iZGEgKGZvcm0gb3BlcmF0aW9uKVxuICAgICAgKGNvbnMgKGZpcnN0IG9wZXJhdGlvbilcbiAgICAgICAgICAgIChjb25zIGZvcm0gKHJlc3Qgb3BlcmF0aW9uKSkpKVxuICAgIChmaXJzdCBvcGVyYXRpb25zKVxuICAgIChtYXAgKGxhbWJkYSAoJSkgKGlmIChsaXN0PyAlKSAlIGAoLCUpKSlcbiAgICAgICAgIChyZXN0IG9wZXJhdGlvbnMpKSkpXG4oaW5zdGFsbC1tYWNybyEgOi0+IGV4cGFuZC10aHJlYWQtZmlyc3QpXG5cbihkZWZ1biBleHBhbmQtdGhyZWFkLWxhc3RcbiAgKCZyZXN0IG9wZXJhdGlvbnMpXG4gIFwiVGhyZWFkIGxhc3QgbWFjcm9cIlxuICAocmVkdWNlXG4gICAgKGxhbWJkYSAoZm9ybSBvcGVyYXRpb24pIChjb25jYXQgb3BlcmF0aW9uIFtmb3JtXSkpXG4gICAgKGZpcnN0IG9wZXJhdGlvbnMpXG4gICAgKG1hcCAobGFtYmRhICglKSAoaWYgKGxpc3Q/ICUpICUgYCgsJSkpKVxuICAgICAgICAgKHJlc3Qgb3BlcmF0aW9ucykpKSlcbihpbnN0YWxsLW1hY3JvISA6LT4+IGV4cGFuZC10aHJlYWQtbGFzdClcblxuKGRlZnVuIGV4cGFuZC1kb3RzXG4gICh4ICZyZXN0IGZvcm1zKVxuICBcImZvcm0gPT4gZmllbGROYW1lLXN5bWJvbCBvciAoaW5zdGFuY2VNZXRob2ROYW1lLXN5bWJvbCBhcmdzKilcbiAgRXhwYW5kcyBpbnRvIGEgbWVtYmVyIGFjY2VzcyAoLikgb2YgdGhlIGZpcnN0IG1lbWJlciBvbiB0aGUgZmlyc3RcbiAgYXJndW1lbnQsIGZvbGxvd2VkIGJ5IHRoZSBuZXh0IG1lbWJlciBvbiB0aGUgcmVzdWx0LCBldGMuIEZvclxuICBpbnN0YW5jZTpcbiAgKC4uIGRvY3VtZW50IC1ib2R5IChnZXQtYXR0cmlidXRlIDpjbGFzcykpXG4gIGV4cGFuZHMgdG86XG4gICguICguIGRvY3VtZW50IC1ib2R5KSBnZXQtYXR0cmlidXRlIDpjbGFzcylcbiAgYnV0IGlzIGVhc2llciB0byB3cml0ZSwgcmVhZCwgYW5kIHVuZGVyc3RhbmQuXCJcbiAgYCgtPiAseCAsQChtYXAgKGxhbWJkYSAoJSkgKGlmIChsaXN0PyAlKSAoY29ucyAnLiAlKSAobGlzdCAnLiAlKSkpXG4gICAgICAgICAgICAgICAgIGZvcm1zKSkpXG4oaW5zdGFsbC1tYWNybyEgOi4uIGV4cGFuZC1kb3RzKVxuXG4oZGVmdW4gZXhwYW5kLXRocmVhZC1hc1xuICAoZXhwciBuYW1lICZyZXN0IGZvcm1zKVxuICBcIkJpbmRzIG5hbWUgdG8gZXhwciwgZXZhbHVhdGVzIHRoZSBmaXJzdCBmb3JtIGluIHRoZSBsZXhpY2FsIGNvbnRleHRcbiAgb2YgdGhhdCBiaW5kaW5nLCB0aGVuIGJpbmRzIG5hbWUgdG8gdGhhdCByZXN1bHQsIHJlcGVhdGluZyBmb3IgZWFjaFxuICBzdWNjZXNzaXZlIGZvcm0sIHJldHVybmluZyB0aGUgcmVzdWx0IG9mIHRoZSBsYXN0IGZvcm0uXCJcbiAgYChsZXQqKiBbLG5hbWUgLGV4cHJcbiAgICAgICAgICAgLEAobWFwY2F0IChsYW1iZGEgKGZvcm0pIFtuYW1lIGZvcm1dKVxuICAgICAgICAgICAgICAgICAgICAgZm9ybXMpXVxuICAgICAsbmFtZSkpXG4oaW5zdGFsbC1tYWNybyEgOmFzLT4gZXhwYW5kLXRocmVhZC1hcylcblxuXG4oZGVmdW4gZXhwYW5kLWNvbmRcbiAgKCZyZXN0IGNsYXVzZXMpXG4gIFwiVGFrZXMgYSBzZXQgb2YgKHRlc3QgYm9keSopIHBhcmVuIGNsYXVzZXMuIEl0IGV2YWx1YXRlcyBlYWNoIHRlc3RcbiAgb25lIGF0IGEgdGltZS4gIElmIGEgdGVzdCByZXR1cm5zIGxvZ2ljYWwgdHJ1ZSwgY29uZCBldmFsdWF0ZXMgYW5kXG4gIHJldHVybnMgdGhlIHZhbHVlIG9mIHRoZSBjb3JyZXNwb25kaW5nIGJvZHkgKGFuIGltcGxpY2l0IHByb2duKSBhbmRcbiAgZG9lc24ndCBldmFsdWF0ZSBhbnkgb2YgdGhlIG90aGVyIHRlc3RzIG9yIGJvZGllcy4gVGhlIGJhcmUgc3ltYm9sXG4gIGBlbHNlYCBpcyB0aGUgY2F0Y2gtYWxsIGNsYXVzZS4gKGNvbmQpIHJldHVybnMgbmlsLlwiXG4gIChpZiAobm90IChlbXB0eT8gY2xhdXNlcykpXG4gICAgKGxldCogKChjbGF1c2UgKGZpcnN0IGNsYXVzZXMpKSAodGVzdCAoZmlyc3QgY2xhdXNlKSkgKGJvZHkgKHJlc3QgY2xhdXNlKSkpXG4gICAgICAoaWYgKD0gdGVzdCAnZWxzZSlcbiAgICAgICAgYChwcm9nbiAsQGJvZHkpXG4gICAgICAgIGAoaWYgLHRlc3QgKHByb2duICxAYm9keSkgKGNvbmQgLEAocmVzdCBjbGF1c2VzKSkpKSkpKVxuKGluc3RhbGwtbWFjcm8hIDpjb25kIGV4cGFuZC1jb25kKVxuXG4oZGVmdW4gZXhwYW5kLWNhc2VcbiAgKGUgJnJlc3QgY2xhdXNlcylcbiAgXCJUYWtlcyBhbiBleHByZXNzaW9uLCBhbmQgYSBzZXQgb2YgKHRlc3QtY29uc3RhbnQgYm9keSopIHBhcmVuXG4gIGNsYXVzZXMsIG9yICgodGVzdC1jb25zdGFudDEgLi4uIHRlc3QtY29uc3RhbnROKSBib2R5KikgdG8gZ3JvdXBcbiAgc2V2ZXJhbCBjb25zdGFudHMgdW5kZXIgb25lIGJvZHkuIFRoZSBiYXJlIHN5bWJvbCBgZWxzZWAgaXMgdGhlXG4gIGNhdGNoLWFsbCBjbGF1c2UuIFRlc3QtY29uc3RhbnRzIGFyZSBub3QgZXZhbHVhdGVkIC0tIHRoZXkgbXVzdCBiZVxuICBjb21waWxlLXRpbWUgbGl0ZXJhbHMgYW5kIG5lZWQgbm90IGJlIHF1b3RlZC4gSWYgbm8gY2xhdXNlIG1hdGNoZXNcbiAgYW5kIG5vIGBlbHNlYCBjbGF1c2Ugd2FzIGdpdmVuLCBhbiBFcnJvciBpcyB0aHJvd24uXG5cbiAgVW5saWtlIGNvbmQvY29uZHAsIGNhc2UncyBkaXNwYXRjaCBpcyBub3QgZXZhbHVhdGVkIHNlcXVlbnRpYWxseSBhdFxuICBydW50aW1lIGhlcmUgKGl0J3Mgc3RpbGwgbG93ZXJlZCB0byBhIGBjb25kYCBjaGFpbiBmb3Igbm93IC0tIGFcbiAgY29uc3RhbnQtdGltZSBkaXNwYXRjaCBpcyBhbiBvcHRpbWlzYXRpb24sIG5vdCBhIHNlbWFudGljXG4gIHJlcXVpcmVtZW50IG9mIHRoZSBzcGVjKS5cblxuICBEZXBlbmRzIG9uID1cIlxuICAobGV0KiAoKHN5bSAoaWYgKHN5bWJvbD8gZSkgZSAoZ2Vuc3ltIDpjYXNlLWJpbmRpbmcpKSlcbiAgICAgICAgKGVxKiAobGFtYmRhIChjKSBgKD0gLHN5bSAnLGMpKSkpXG4gICAgKGxvb3AgKChwYWlycyBjbGF1c2VzKSAoY29uZHMgW10pKVxuICAgICAgKGlmIChlbXB0eT8gcGFpcnMpXG4gICAgICAgIChsZXQqICgoY29uZHMgKGlmIChzb21lIChsYW1iZGEgKCUpICg9IChmaXJzdCAlKSAnZWxzZSkpIGNvbmRzKVxuICAgICAgICAgICAgICAgICAgICAgIGNvbmRzXG4gICAgICAgICAgICAgICAgICAgICAgKGNvbmogY29uZHMgKGxpc3QgJ2Vsc2UgYCh0aHJvdyAoRXJyb3IgKHN0ciBcIk5vIG1hdGNoaW5nIGNsYXVzZTogXCIgLHN5bSkpKSkpKSlcbiAgICAgICAgICAgICAgKHJlc3VsdCAoY29ucyAnY29uZCBjb25kcykpKVxuICAgICAgICAgIChpZiAoPSBlIHN5bSkgcmVzdWx0IGAobGV0KiAoKCxzeW0gLGUpKSAscmVzdWx0KSkpXG4gICAgICAgIChsZXQqICgoeCAoZmlyc3QgcGFpcnMpKSAoeHMgKHJlc3QgcGFpcnMpKSAoY29uc3RzIChmaXJzdCB4KSkgKGJvZHkgKHJlc3QgeCkpKVxuICAgICAgICAgIChyZWN1ciB4cyAoY29uaiBjb25kc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAoaWYgKD0gY29uc3RzICdlbHNlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChjb25zICdlbHNlIGJvZHkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGNvbnMgKGlmLW5vdCAobGlzdD8gY29uc3RzKSAoZXEqIGNvbnN0cykgYChvciAsQChtYXAgZXEqIGNvbnN0cykpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvZHkpKSkpKSkpKSlcbihpbnN0YWxsLW1hY3JvISA6Y2FzZSBleHBhbmQtY2FzZSlcblxuKGRlZnVuIGV4cGFuZC1jb25kcFxuICAocHJlZCBleHByICZyZXN0IGNsYXVzZXMpXG4gIFwiVGFrZXMgYSBiaW5hcnkgcHJlZGljYXRlLCBhbiBleHByZXNzaW9uLCBhbmQgYSBzZXQgb2YgY2xhdXNlcy5cbiAgRWFjaCBjbGF1c2UgY2FuIHRha2UgdGhlIGZvcm0gb2YgZWl0aGVyOlxuXG4gIHRlc3QtZXhwciByZXN1bHQtZXhwclxuICB0ZXN0LWV4cHIgOj4+IHJlc3VsdC1mblxuXG4gIE5vdGUgOj4+IGlzIGFuIG9yZGluYXJ5IGtleXdvcmQuXG5cbiAgRm9yIGVhY2ggY2xhdXNlLCAocHJlZCB0ZXN0LWV4cHIgZXhwcikgaXMgZXZhbHVhdGVkLiBJZiBpdCByZXR1cm5zXG4gIGxvZ2ljYWwgdHJ1ZSwgdGhlIGNsYXVzZSBpcyBhIG1hdGNoLiBJZiBhIGJpbmFyeSBjbGF1c2UgbWF0Y2hlcywgdGhlXG4gIHJlc3VsdC1leHByIGlzIHJldHVybmVkLCBpZiBhIHRlcm5hcnkgY2xhdXNlIG1hdGNoZXMsIGl0cyByZXN1bHQtZm4sXG4gIHdoaWNoIG11c3QgYmUgYSB1bmFyeSBmdW5jdGlvbiwgaXMgY2FsbGVkIHdpdGggdGhlIHJlc3VsdCBvZiB0aGVcbiAgcHJlZGljYXRlIGFzIGl0cyBhcmd1bWVudCwgdGhlIHJlc3VsdCBvZiB0aGF0IGNhbGwgYmVpbmcgdGhlIHJldHVyblxuICB2YWx1ZSBvZiBjb25kcC4gQSBzaW5nbGUgZGVmYXVsdCBleHByZXNzaW9uIGNhbiBmb2xsb3cgdGhlIGNsYXVzZXMsXG4gIGFuZCBpdHMgdmFsdWUgd2lsbCBiZSByZXR1cm5lZCBpZiBubyBjbGF1c2UgbWF0Y2hlcy4gSWYgbm8gZGVmYXVsdFxuICBleHByZXNzaW9uIGlzIHByb3ZpZGVkIGFuZCBubyBjbGF1c2UgbWF0Y2hlcywgYW4gRXJyb3IgaXMgdGhyb3duLlwiXG4gIChsZXQqICgoc3ltKiAgICAoZ2Vuc3ltIDpjb25kcC1iaW5kaW5nKSlcbiAgICAgICAgKHN5bSAgICAgKGlmIChzeW1ib2w/IGV4cHIpIGV4cHIgc3ltKikpXG4gICAgICAgIChjb21wYXJlIChsYW1iZGEgKHgpIGAoLHByZWQgLHggLHN5bSkpKVxuICAgICAgICAoc3BsaXRzICAobGFtYmRhIHNwbGl0cyAoeHMpXG4gICAgICAgICAgICAgICAgICAoY29uZCAoKGVtcHR5PyB4cykgICAgICAgICAgYCh0aHJvdyAoRXJyb3IgKHN0ciBcIk5vIG1hdGNoaW5nIGNsYXVzZTogXCIgLHN5bSkpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICgoPSAxIChjb3VudCB4cykpICAgICAoZmlyc3QgeHMpKVxuICAgICAgICAgICAgICAgICAgICAgICAgKCg9ICc6Pj4gKHNlY29uZCB4cykpIGAoaWYtbGV0IFssc3ltKiAsKGNvbXBhcmUgKGZpcnN0IHhzKSldXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoLCh0aGlyZCB4cykgLHN5bSopXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAsKHNwbGl0cyAoZHJvcCAzIHhzKSkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgKGVsc2UgICAgICAgICAgICAgICAgYChpZiAsKGNvbXBhcmUgKGZpcnN0IHhzKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICwoc2Vjb25kIHhzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLChzcGxpdHMgKGRyb3AgMiB4cykpKSkpKSkpXG4gICAgKGlmICg9IHN5bSBleHByKVxuICAgICAgKHNwbGl0cyBjbGF1c2VzKVxuICAgICAgYChsZXQqKiBbLHN5bSAsZXhwcl0gLChzcGxpdHMgY2xhdXNlcykpKSkpXG4oaW5zdGFsbC1tYWNybyEgOmNvbmRwIGV4cGFuZC1jb25kcClcblxuXG4oZGVmdW4tICp0aHJlYWQgKGluc2VydCBzeW0gdGVzdCBmb3JtKVxuICAobGV0KiAoKGZvcm0gKGlmIChsaXN0PyBmb3JtKSBmb3JtIChsaXN0IGZvcm0pKSkpXG4gICAgYChpZiAsdGVzdFxuICAgICAgICxzeW1cbiAgICAgICAsKGluc2VydCBzeW0gZm9ybSkpKSlcblxuKGRlZnVuLSAqY29uZC10aHJlYWQgKGV4cHIgY2xhdXNlcyBpbnNlcnQpXG4gIChsZXQqICgoc3ltIChnZW5zeW0gOmNvbmQtdGhyZWFkLWJpbmRpbmcpKSlcbiAgICBgKGFzLT4gLGV4cHIgLHN5bVxuICAgICAgICAgICAsQChtYXAgKGxhbWJkYSAoJSkgKCp0aHJlYWQgaW5zZXJ0IHN5bSBgKG5vdCAsKGZpcnN0ICUpKSAoc2Vjb25kICUpKSlcbiAgICAgICAgICAgICAgICAgIChwYXJ0aXRpb24gMiBjbGF1c2VzKSkpKSlcblxuKGRlZnVuIGV4cGFuZC1jb25kLXRocmVhZC1maXJzdFxuICAoZXhwciAmcmVzdCBjbGF1c2VzKVxuICBcIlRha2VzIGFuIGV4cHJlc3Npb24gYW5kIGEgc2V0IG9mIHRlc3QvZm9ybSBwYWlycy4gVGhyZWFkcyBleHByICh2aWEgLT4pXG4gIHRocm91Z2ggZWFjaCBmb3JtIGZvciB3aGljaCB0aGUgY29ycmVzcG9uZGluZyB0ZXN0XG4gIGV4cHJlc3Npb24gaXMgdHJ1ZS4gTm90ZSB0aGF0LCB1bmxpa2UgY29uZCBicmFuY2hpbmcsIGNvbmQtPiB0aHJlYWRpbmcgZG9lc1xuICBub3Qgc2hvcnQgY2lyY3VpdCBhZnRlciB0aGUgZmlyc3QgdHJ1ZSB0ZXN0IGV4cHJlc3Npb24uXCJcbiAgKCpjb25kLXRocmVhZCBleHByIGNsYXVzZXMgKGxhbWJkYSAoc3ltIGZvcm0pIChhcHBseSBsaXN0IChmaXJzdCBmb3JtKSBzeW0gKHZlYyAocmVzdCBmb3JtKSkpKSkpXG4oaW5zdGFsbC1tYWNybyEgOmNvbmQtPiBleHBhbmQtY29uZC10aHJlYWQtZmlyc3QpXG5cbihkZWZ1biBleHBhbmQtY29uZC10aHJlYWQtbGFzdFxuICAoZXhwciAmcmVzdCBjbGF1c2VzKVxuICBcIlRha2VzIGFuIGV4cHJlc3Npb24gYW5kIGEgc2V0IG9mIHRlc3QvZm9ybSBwYWlycy4gVGhyZWFkcyBleHByICh2aWEgLT4+KVxuICB0aHJvdWdoIGVhY2ggZm9ybSBmb3Igd2hpY2ggdGhlIGNvcnJlc3BvbmRpbmcgdGVzdCBleHByZXNzaW9uXG4gIGlzIHRydWUuICBOb3RlIHRoYXQsIHVubGlrZSBjb25kIGJyYW5jaGluZywgY29uZC0+PiB0aHJlYWRpbmcgZG9lcyBub3Qgc2hvcnQgY2lyY3VpdFxuICBhZnRlciB0aGUgZmlyc3QgdHJ1ZSB0ZXN0IGV4cHJlc3Npb24uXCJcbiAgKCpjb25kLXRocmVhZCBleHByIGNsYXVzZXMgKGxhbWJkYSAoc3ltIGZvcm0pIChhcHBseSBsaXN0ICh2ZWMgKGNvbmNhdCBmb3JtIFtzeW1dKSkpKSkpXG4oaW5zdGFsbC1tYWNybyEgOmNvbmQtPj4gZXhwYW5kLWNvbmQtdGhyZWFkLWxhc3QpXG5cblxuKGRlZnVuLSAqc29tZS10aHJlYWQgKGV4cHIgZm9ybXMgaW5zZXJ0KVxuICAobGV0KiAoKHN5bSAoZ2Vuc3ltIDpzb21lLXRocmVhZC1iaW5kaW5nKSkpXG4gICAgYChhcy0+ICxleHByICxzeW1cbiAgICAgICAgICAgLEAobWFwIChsYW1iZGEgKCUpICgqdGhyZWFkIGluc2VydCBzeW0gYChuaWw/ICxzeW0pICUpKVxuICAgICAgICAgICAgICAgICAgZm9ybXMpKSkpXG5cbihkZWZ1biBleHBhbmQtc29tZS10aHJlYWQtZmlyc3RcbiAgKGV4cHIgJnJlc3QgZm9ybXMpXG4gIFwiV2hlbiBleHByIGlzIG5vdCBuaWwsIHRocmVhZHMgaXQgaW50byB0aGUgZmlyc3QgZm9ybSAodmlhIC0+KSxcbiAgYW5kIHdoZW4gdGhhdCByZXN1bHQgaXMgbm90IG5pbCwgdGhyb3VnaCB0aGUgbmV4dCBldGNcblxuICBEZXBlbmRzIG9uIG5pbD9cIlxuICAoKnNvbWUtdGhyZWFkIGV4cHIgZm9ybXMgKGxhbWJkYSAoc3ltIGZvcm0pIChhcHBseSBsaXN0IChmaXJzdCBmb3JtKSBzeW0gKHZlYyAocmVzdCBmb3JtKSkpKSkpXG4oaW5zdGFsbC1tYWNybyEgOnNvbWUtPiBleHBhbmQtc29tZS10aHJlYWQtZmlyc3QpXG5cbihkZWZ1biBleHBhbmQtc29tZS10aHJlYWQtbGFzdFxuICAoZXhwciAmcmVzdCBmb3JtcylcbiAgXCJXaGVuIGV4cHIgaXMgbm90IG5pbCwgdGhyZWFkcyBpdCBpbnRvIHRoZSBmaXJzdCBmb3JtICh2aWEgLT4+KSxcbiAgYW5kIHdoZW4gdGhhdCByZXN1bHQgaXMgbm90IG5pbCwgdGhyb3VnaCB0aGUgbmV4dCBldGNcblxuICBEZXBlbmRzIG9uIG5pbD9cIlxuICAoKnNvbWUtdGhyZWFkIGV4cHIgZm9ybXMgKGxhbWJkYSAoc3ltIGZvcm0pIChhcHBseSBsaXN0ICh2ZWMgKGNvbmNhdCBmb3JtIFtzeW1dKSkpKSkpXG4oaW5zdGFsbC1tYWNybyEgOnNvbWUtPj4gZXhwYW5kLXNvbWUtdGhyZWFkLWxhc3QpXG5cblxuKGRlZnVuLSBidWlsZC1kZWZ1blxuICAocHJpdmF0ZSAmZm9ybSBuYW1lIHBhcmFtcyBkb2MrYm9keSlcbiAgXCJTaGFyZWQgaW1wbGVtZW50YXRpb24gb2YgYGRlZnVuYC9gZGVmdW4tYDogKGRlZnZhciBpZCAobGFtYmRhIGlkXG4gIHBhcmFtcyogYm9keSopKSwgZm9sZGluZyBhbiBvcHRpb25hbCBkb2Mtc3RyaW5nIGludG8gdGhlIGlkJ3NcbiAgbWV0YWRhdGEgc28gaXQgbmV2ZXIgcmVhY2hlcyB0aGUgZW1pdHRlZCBib2R5IGFzIGEgZGVhZCBleHByZXNzaW9uXG4gIHN0YXRlbWVudC4gYHByaXZhdGVgIHBpY2tzIGBkZWZ2YXJgIHZzIGBkZWZ2YXItYCAtLSBuZXctc3ludGF4IGhhc1xuICBubyBgXjpwcml2YXRlYCByZWFkZXIgbWV0YWRhdGEsIHNvIHByaXZhY3kgaXMgbm93IHNpZ25hbGxlZCBwdXJlbHlcbiAgYnkgd2hpY2ggbWFjcm8gbmFtZSB3YXMgdXNlZC5cblxuICBVbmxpa2UgQ2xvanVyZS13aXNwJ3MgYGRlZm5gIChuYW1lIGRvYz8gYXR0ci1tYXA/IFtwYXJhbXNdIGJvZHkqKSxcbiAgbmV3LXN5bnRheCBwdXRzIHRoZSBwYXJhbSBsaXN0IHJpZ2h0IGFmdGVyIHRoZSBuYW1lIChFbWFjcyBMaXNwXG4gIG9yZGVyKTogKGRlZnVuIG5hbWUgKHBhcmFtcyopIGRvYz8gYm9keSopIC0tIHNvIHRoZSBkb2NzdHJpbmcsIHdoZW5cbiAgcHJlc2VudCwgaXMgdGhlIGZpcnN0IGVsZW1lbnQgb2YgYm9keSwgbm90IHRoZSBsYXN0IGVsZW1lbnQgYmVmb3JlXG4gIGl0LlwiXG4gIChsZXQqICgoZG9jIChpZiAoYW5kIChzdHJpbmc/IChmaXJzdCBkb2MrYm9keSkpIChub3QgKGVtcHR5PyAocmVzdCBkb2MrYm9keSkpKSlcbiAgICAgICAgICAgICAgKGZpcnN0IGRvYytib2R5KSkpXG5cbiAgICAgICAgOzsgSWYgZG9jc3RyaW5nIGlzIGZvdW5kIGl0J3Mgbm90IHBhcnQgb2YgYm9keS5cbiAgICAgICAgKGJvZHkgKGlmIGRvYyAocmVzdCBkb2MrYm9keSkgZG9jK2JvZHkpKVxuXG4gICAgICAgIDs7IENvbWJpbmUgdGhlIGRvYyBtZXRhZGF0YSBhbmQgYWRkIHRvIGEgbmFtZS5cbiAgICAgICAgKGlkICh3aXRoLW1ldGEgbmFtZSAoY29uaiAob3IgKG1ldGEgbmFtZSkge30pIHs6ZG9jIGRvY30pKSlcblxuICAgICAgICAoZm4gKHdpdGgtbWV0YSBgKGxhbWJkYSAsaWQgLHBhcmFtcyAsQGJvZHkpIChtZXRhICZmb3JtKSkpXG4gICAgICAgIChkZWYtb3AgKGlmIHByaXZhdGUgJ2RlZnZhci0gJ2RlZnZhcikpKVxuICAgIChsaXN0IGRlZi1vcCBpZCBmbikpKVxuXG4oZGVmdW4gZXhwYW5kLWRlZnVuXG4gICgmZm9ybSBuYW1lIHBhcmFtcyAmcmVzdCBkb2MrYm9keSlcbiAgXCIoZGVmdW4gbmFtZSAocGFyYW1zKikgZG9jPyBleHBycyopID0+IChkZWZ2YXIgbmFtZSAobGFtYmRhIG5hbWUgcGFyYW1zKiBleHBycyopKVwiXG4gIChidWlsZC1kZWZ1biBmYWxzZSAmZm9ybSBuYW1lIHBhcmFtcyBkb2MrYm9keSkpXG4oaW5zdGFsbC1tYWNybyEgOmRlZnVuICh3aXRoLW1ldGEgZXhwYW5kLWRlZnVuIHs6aW1wbGljaXQgWzomZm9ybV19KSlcblxuKGRlZnVuIGV4cGFuZC1kZWZ1bi1cbiAgKCZmb3JtIG5hbWUgcGFyYW1zICZyZXN0IGRvYytib2R5KVxuICBcIlNhbWUgYXMgYGRlZnVuYCBidXQgbm90IGV4cG9ydGVkIChzZWUgYGJ1aWxkLWRlZnVuYCkuXCJcbiAgKGJ1aWxkLWRlZnVuIHRydWUgJmZvcm0gbmFtZSBwYXJhbXMgZG9jK2JvZHkpKVxuKGluc3RhbGwtbWFjcm8hIDpkZWZ1bi0gKHdpdGgtbWV0YSBleHBhbmQtZGVmdW4tIHs6aW1wbGljaXQgWzomZm9ybV19KSlcblxuKGRlZnVuIGV4cGFuZC1kZWZjb25zdFxuICAobmFtZSB2YWx1ZSlcbiAgXCIoZGVmY29uc3QgbmFtZSB2YWx1ZSkgLS0gbWF5IGZvbGQgaW50byBgZGVmdmFyLWAvYGRlZnZhcmAgbGF0ZXI7IGZvclxuICBub3cgYSB0aGluIGFsaWFzIHdpdGggbm8gcmVhc3NpZ25tZW50LXByZXZlbnRpb24gc2VtYW50aWNzLlwiXG4gIGAoZGVmdmFyICxuYW1lICx2YWx1ZSkpXG4oaW5zdGFsbC1tYWNybyEgOmRlZmNvbnN0IGV4cGFuZC1kZWZjb25zdClcblxuKGRlZnVuIGV4cGFuZC1kZWZjb25zdC1cbiAgKG5hbWUgdmFsdWUpXG4gIGAoZGVmdmFyLSAsbmFtZSAsdmFsdWUpKVxuKGluc3RhbGwtbWFjcm8hIDpkZWZjb25zdC0gZXhwYW5kLWRlZmNvbnN0LSlcblxuKGRlZnVuIGV4cGFuZC1zZXRxXG4gIChwbGFjZSB2YWx1ZSlcbiAgXCIoc2V0cSBwbGFjZSB2YWx1ZSkgLS0gcmViaW5kIGEgYmluZGluZy4gYHNldCFgIGFscmVhZHkgaGFuZGxlcyBib3RoXG4gIHN5bWJvbCBhbmQgcGxhY2UgKGxpc3QpIHRhcmdldHMsIHNvIGBzZXRxYC9gc2V0ZmAgYXJlIGJvdGggcGxhaW5cbiAgYWxpYXNlcyBmb3IgaXQuXCJcbiAgYChzZXQhICxwbGFjZSAsdmFsdWUpKVxuKGluc3RhbGwtbWFjcm8hIDpzZXRxIGV4cGFuZC1zZXRxKVxuXG4oZGVmdW4gZXhwYW5kLXNldGZcbiAgKHBsYWNlIHZhbHVlKVxuICBcIihzZXRmIHBsYWNlIHZhbHVlKSAtLSBhc3NpZ24gYSBwbGFjZTogKHNldGYgKC4teCBvKSAxKSwgKHNldGYgKGFyZWYgYSBpKSB2KS5cIlxuICBgKHNldCEgLHBsYWNlICx2YWx1ZSkpXG4oaW5zdGFsbC1tYWNybyEgOnNldGYgZXhwYW5kLXNldGYpXG5cblxuKGRlZnVuIGV4cGFuZC1sYXp5LXNlcVxuICAoJnJlc3QgYm9keSlcbiAgXCJUYWtlcyBhIGJvZHkgb2YgZXhwcmVzc2lvbnMgdGhhdCByZXR1cm5zIGFuIElTZXEgb3IgbmlsLCBhbmQgeWllbGRzXG4gIGEgU2VxYWJsZSBvYmplY3QgdGhhdCB3aWxsIGludm9rZSB0aGUgYm9keSBvbmx5IHRoZSBmaXJzdCB0aW1lIHNlcVxuICBpcyBjYWxsZWQsIGFuZCB3aWxsIGNhY2hlIHRoZSByZXN1bHQgYW5kIHJldHVybiBpdCBvbiBhbGwgc3Vic2VxdWVudFxuICBzZXEgY2FsbHMuIFNlZSBhbHNvIC0gcmVhbGl6ZWQ/XG5cbiAgRGVwZW5kcyBvbiBsYXp5LXNlcVwiXG4gIGAoLmNhbGwgbGF6eS1zZXEgbmlsIGZhbHNlIChsYW1iZGEgKCkgLEBib2R5KSkpXG4oaW5zdGFsbC1tYWNybyA6bGF6eS1zZXEgZXhwYW5kLWxhenktc2VxKVxuXG5cbihkZWZ1biBleHBhbmQtd2hlblxuICAodGVzdCAmcmVzdCBib2R5KVxuICBcIkV2YWx1YXRlcyB0ZXN0LiBJZiBsb2dpY2FsIHRydWUsIGV2YWx1YXRlcyBib2R5IGluIGFuIGltcGxpY2l0IHByb2duLlwiXG4gIGAoaWYgLHRlc3QgKHByb2duICxAYm9keSkpKVxuKGluc3RhbGwtbWFjcm8gOndoZW4gZXhwYW5kLXdoZW4pXG5cbihkZWZ1biBleHBhbmQtdW5sZXNzXG4gICh0ZXN0ICZyZXN0IGJvZHkpXG4gIFwiRXZhbHVhdGVzIHRlc3QuIElmIGxvZ2ljYWwgZmFsc2UsIGV2YWx1YXRlcyBib2R5IGluIGFuIGltcGxpY2l0IHByb2duLlwiXG4gIGAod2hlbiAobm90ICx0ZXN0KSAsQGJvZHkpKVxuKGluc3RhbGwtbWFjcm8gOnVubGVzcyBleHBhbmQtdW5sZXNzKVxuXG5cbihkZWZ1biBleHBhbmQtaWYtbGV0XG4gIChiaW5kaW5ncyB0aGVuIGVsc2UqKVxuICBcImJpbmRpbmdzID0+IGJpbmRpbmctZm9ybSB0ZXN0XG4gIGJvZHkgPT4gW3RoZW4gZWxzZV1cbiAgSWYgdGVzdCBpcyB0cnVlLCBldmFsdWF0ZXMgdGhlbiB3aXRoIGJpbmRpbmctZm9ybSBib3VuZCB0byB0aGUgdmFsdWUgb2ZcbiAgdGVzdCwgaWYgbm90LCB5aWVsZHMgZWxzZSouXCJcbiAgKGxldCogKChuYW1lIChmaXJzdCBiaW5kaW5ncykpICh0ZXN0IChzZWNvbmQgYmluZGluZ3MpKSAoc3ltIChnZW5zeW0gOmlmLWxldC1iaW5kaW5nKSkpXG4gICAgYChsZXQqKiBbLHN5bSAsdGVzdF1cbiAgICAgICAoaWYgLHN5bSAobGV0KiogLChkZXN0cnVjdHVyZSBbbmFtZSBzeW1dKSAsdGhlbikgLGVsc2UqKSkpKVxuKGluc3RhbGwtbWFjcm8gOmlmLWxldCBleHBhbmQtaWYtbGV0KVxuXG4oZGVmdW4gZXhwYW5kLXdoZW4tbGV0XG4gIChiaW5kaW5ncyAmcmVzdCBib2R5KVxuICBcImJpbmRpbmdzID0+IGJpbmRpbmctZm9ybSB0ZXN0XG4gIFdoZW4gdGVzdCBpcyB0cnVlLCBldmFsdWF0ZXMgYm9keSB3aXRoIGJpbmRpbmctZm9ybSBib3VuZCB0byB0aGUgdmFsdWUgb2YgdGVzdC5cIlxuICBgKGlmLWxldCAsYmluZGluZ3MgKHByb2duICxAYm9keSkpKVxuKGluc3RhbGwtbWFjcm8gOndoZW4tbGV0IGV4cGFuZC13aGVuLWxldClcblxuXG4oZGVmdW4gZXhwYW5kLWlmLXNvbWVcbiAgKGJpbmRpbmdzIHRoZW4gZWxzZSopXG4gIFwiYmluZGluZ3MgPT4gYmluZGluZy1mb3JtIHRlc3RcbiAgSWYgdGVzdCBpcyBub3QgbmlsLCBldmFsdWF0ZXMgdGhlbiB3aXRoIGJpbmRpbmctZm9ybSBib3VuZCB0byB0aGVcbiAgdmFsdWUgb2YgdGVzdCwgaWYgbm90LCB5aWVsZHMgZWxzZSouXG5cbiAgRGVwZW5kcyBvbiBuaWw/XCJcbiAgKGxldCogKChuYW1lIChmaXJzdCBiaW5kaW5ncykpICh0ZXN0IChzZWNvbmQgYmluZGluZ3MpKSAoc3ltIChpZiAoc3ltYm9sPyBuYW1lKSBuYW1lIChnZW5zeW0gOmlmLXNvbWUtYmluZGluZykpKSlcbiAgICBgKGxldCoqIFssc3ltICx0ZXN0XVxuICAgICAgIChpZi1ub3QgKG5pbD8gLHN5bSlcbiAgICAgICAgIChsZXQqKiAsKGRlc3RydWN0dXJlIFtuYW1lIHN5bV0pICx0aGVuKVxuICAgICAgICAgLGVsc2UqKSkpKVxuKGluc3RhbGwtbWFjcm8gOmlmLXNvbWUgZXhwYW5kLWlmLXNvbWUpXG5cbihkZWZ1biBleHBhbmQtd2hlbi1zb21lXG4gIChiaW5kaW5ncyAmcmVzdCBib2R5KVxuICBcImJpbmRpbmdzID0+IGJpbmRpbmctZm9ybSB0ZXN0XG4gIFdoZW4gdGVzdCBpcyBub3QgbmlsLCBldmFsdWF0ZXMgYm9keSB3aXRoIGJpbmRpbmctZm9ybSBib3VuZCB0byB0aGVcbiAgdmFsdWUgb2YgdGVzdC5cIlxuICBgKGlmLXNvbWUgLGJpbmRpbmdzIChwcm9nbiAsQGJvZHkpKSlcbihpbnN0YWxsLW1hY3JvIDp3aGVuLXNvbWUgZXhwYW5kLXdoZW4tc29tZSlcblxuXG4oZGVmdW4gZXhwYW5kLXdoZW4tZmlyc3RcbiAgKGJpbmRpbmdzICZyZXN0IGJvZHkpXG4gIFwiYmluZGluZ3MgPT4geCB4c1xuICBSb3VnaGx5IHRoZSBzYW1lIGFzICh3aGVuIChzZXEgeHMpIChsZXQgW3ggKGZpcnN0IHhzKV0gYm9keSkpIGJ1dCB4cyBpcyBldmFsdWF0ZWQgb25seSBvbmNlXG5cbiAgRGVwZW5kcyBvbiBzZXEqXCJcbiAgKGxldCogKChuYW1lIChmaXJzdCBiaW5kaW5ncykpICh0ZXN0IChzZWNvbmQgYmluZGluZ3MpKSlcbiAgICBgKHdoZW4tbGV0IChbLG5hbWVdIChzZXEqICx0ZXN0KSkgLEBib2R5KSkpXG4oaW5zdGFsbC1tYWNybyA6d2hlbi1maXJzdCBleHBhbmQtd2hlbi1maXJzdClcblxuXG4oZGVmdW4gZXhwYW5kLXdoaWxlXG4gICh0ZXN0ICZyZXN0IGJvZHkpXG4gIFwiUmVwZWF0ZWRseSBleGVjdXRlcyBib2R5IHdoaWxlIHRlc3QgZXhwcmVzc2lvbiBpcyB0cnVlLiBQcmVzdW1lc1xuICBzb21lIHNpZGUtZWZmZWN0IHdpbGwgY2F1c2UgdGVzdCB0byBiZWNvbWUgZmFsc2UvbmlsLiBSZXR1cm5zIG5pbFwiXG4gIGAobG9vcCAoKVxuICAgICAod2hlbiAsdGVzdCAsQGJvZHkgKHJlY3VyKSkpKVxuKGluc3RhbGwtbWFjcm8gOndoaWxlIGV4cGFuZC13aGlsZSlcblxuXG4oZGVmdW4gZXhwYW5kLWRvdG9cbiAgKHggJnJlc3QgZm9ybXMpXG4gIFwiRXZhbHVhdGVzIHggdGhlbiBjYWxscyBhbGwgb2YgdGhlIG1ldGhvZHMgYW5kIGZ1bmN0aW9ucyB3aXRoIHRoZVxuICB2YWx1ZSBvZiB4IHN1cHBsaWVkIGF0IHRoZSBmcm9udCBvZiB0aGUgZ2l2ZW4gYXJndW1lbnRzLiAgVGhlIGZvcm1zXG4gIGFyZSBldmFsdWF0ZWQgaW4gb3JkZXIuICBSZXR1cm5zIHguXG4gIChkb3RvIChNYXAuKSAoLnNldCA6YSAxKSAoLnNldCA6YiAyKSlcIlxuICAobGV0KiAoKHN5bSAoZ2Vuc3ltIDpkb3RvLWJpbmRpbmcpKSlcbiAgICBgKGxldCoqIFssc3ltICx4XVxuICAgICAgICxAKG1hcCAobGFtYmRhICglKSAoY29uY2F0IFsoZmlyc3QgJSkgc3ltXSAocmVzdCAlKSkpIGZvcm1zKVxuICAgICAgICxzeW0pKSlcbihpbnN0YWxsLW1hY3JvIDpkb3RvIGV4cGFuZC1kb3RvKVxuXG4oZGVmdW4gZXhwYW5kLWRvdGltZXNcbiAgKGJpbmRpbmdzICZyZXN0IGJvZHkpXG4gIFwiYmluZGluZ3MgPT4gbmFtZSBuXG4gIFJlcGVhdGVkbHkgZXhlY3V0ZXMgYm9keSAocHJlc3VtYWJseSBmb3Igc2lkZS1lZmZlY3RzKSB3aXRoIG5hbWVcbiAgYm91bmQgdG8gaW50ZWdlcnMgZnJvbSAwIHRocm91Z2ggbi0xLlwiXG4gIChsZXQqICgobmFtZSAoZmlyc3QgYmluZGluZ3MpKSAobiAoc2Vjb25kIGJpbmRpbmdzKSkgKHN5bSAoZ2Vuc3ltIDpkb3RpbWVzLWJpbmRpbmcpKSlcbiAgICBgKGxldCoqIFssc3ltICxuXVxuICAgICAgIChsb29wICgoLG5hbWUgMCkpXG4gICAgICAgICAod2hlbiAoPCAsbmFtZSAsc3ltKVxuICAgICAgICAgICAsQGJvZHlcbiAgICAgICAgICAgKHJlY3VyIChpbmMgLG5hbWUpKSkpKSkpXG4oaW5zdGFsbC1tYWNybyA6ZG90aW1lcyBleHBhbmQtZG90aW1lcylcblxuXG4oZGVmdW4tIGZvci1zdGVwIChjb250ZXh0IGxvb3AgJnJlc3QgbW9kaWZpZXJzKVxuICAobGV0KiAoKGl0ZXIgICg6aXRlciBjb250ZXh0KSkgKGNvbGwgKDpjb2xsIGNvbnRleHQpKSAoYm9keSAoOmJvZHkgY29udGV4dCkpIChzdWJzZXEgKDpzdWJzZXEgY29udGV4dCkpXG4gICAgICAgIChib2R5KiAoaWYtbm90IHN1YnNlcSBib2R5IGAobGV0KiogWyxzdWJzZXEgLGJvZHldXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGlmIChlbXB0eT8gLHN1YnNlcSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChyZWN1ciAocmVzdCAsY29sbCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAobGF6eS1jb25jYXQgLHN1YnNlcSAoLGl0ZXIgKHJlc3QgLGNvbGwpKSkpKSkpXG4gICAgICAgIChuZXh0ICAobG9vcCAoKG1vZHMgKHJldmVyc2UgbW9kaWZpZXJzKSkgKGJvZHkgYm9keSopKVxuICAgICAgICAgICAgICAgIChpZiAoZW1wdHk/IG1vZHMpXG4gICAgICAgICAgICAgICAgICBib2R5XG4gICAgICAgICAgICAgICAgICAobGV0KiAoKG0gKGZpcnN0IG1vZHMpKSAoaXRlbSAoZmlyc3QgbSkpIChhcmcgKHNlY29uZCBtKSkpXG4gICAgICAgICAgICAgICAgICAgIChyZWN1ciAocmVzdCBtb2RzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgKGNvbmQgKCg9IGl0ZW0gJzpsZXQpICAgYChsZXQqKiAsKHBhcmVuLWJpbmRpbmdzLT52ZWMgYXJnKSAsYm9keSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKD0gaXRlbSAnOndoaWxlKSBgKGlmICxhcmcgLGJvZHkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCg9IGl0ZW0gJzp3aGVuKSAgYChpZiAsYXJnICxib2R5IChyZWN1ciAocmVzdCAsY29sbCkpKSkpKSkpKSkpXG4gICAgKG1lcmdlIGNvbnRleHRcbiAgICAgICAgICAgezpzdWJzZXEgKGdlbnN5bSA6Zm9yLXN1YnNlcSlcbiAgICAgICAgICAgIDpib2R5ICAgYCgobGFtYmRhICxpdGVyICgsY29sbClcbiAgICAgICAgICAgICAgICAgICAgICAgIChsYXp5LXNlcSAobG9vcCAoKCxjb2xsICxjb2xsKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChpZi1ub3QgKGVtcHR5PyAsY29sbClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGxldCoqIFssKGZpcnN0IGxvb3ApIChmaXJzdCAsY29sbCldICxuZXh0KSkpKSlcbiAgICAgICAgICAgICAgICAgICAgICAsKHNlY29uZCBsb29wKSl9KSkpXG5cbihkZWZ2YXItIGZvci1tb2RpZmllcnMgI3snOmxldCAnOndoaWxlICc6d2hlbn0pXG5cbihkZWZ1bi0gZm9yLXBhcnRzIChzZXEtZXhwci1wYWlycylcbiAgKGxldCogKChuICAgICAgICAoY291bnQgc2VxLWV4cHItcGFpcnMpKVxuICAgICAgICAoaW5kaWNlcyAgKGZpbHRlciAobGFtYmRhICglKSAoLT4gKGFnZXQgc2VxLWV4cHItcGFpcnMgJSkgZmlyc3QgZm9yLW1vZGlmaWVycyBub3QpKVxuICAgICAgICAgICAgICAgICAgICAgICAgIChyYW5nZSBuKSkpXG4gICAgICAgIChzZWdtZW50cyAocGFydGl0aW9uIDIgMSAoY29uaiBpbmRpY2VzIG4pKSkpXG4gICAgKG1hcCAobGFtYmRhICglKSAoLnNsaWNlIHNlcS1leHByLXBhaXJzIChmaXJzdCAlKSAoc2Vjb25kICUpKSlcbiAgICAgICAgIHNlZ21lbnRzKSkpXG5cbihkZWZ1biBleHBhbmQtZm9yXG4gIChzZXEtZXhwcnMgYm9keS1leHByKVxuICBcIkxpc3QgY29tcHJlaGVuc2lvbi4gVGFrZXMgYSBwYXJlbiBjbGF1c2UgbGlzdCBvZiBvbmUgb3IgbW9yZVxuICAgKGJpbmRpbmctZm9ybSBjb2xsZWN0aW9uLWV4cHIpIHBhaXJzLCBlYWNoIGZvbGxvd2VkIGJ5IHplcm8gb3IgbW9yZVxuICAgbW9kaWZpZXIgY2xhdXNlcywgYW5kIHlpZWxkcyBhIGxhenkgc2VxdWVuY2Ugb2YgZXZhbHVhdGlvbnMgb2YgZXhwci5cbiAgIENvbGxlY3Rpb25zIGFyZSBpdGVyYXRlZCBpbiBhIG5lc3RlZCBmYXNoaW9uLCByaWdodG1vc3QgZmFzdGVzdCxcbiAgIGFuZCBuZXN0ZWQgY29sbC1leHBycyBjYW4gcmVmZXIgdG8gYmluZGluZ3MgY3JlYXRlZCBpbiBwcmlvclxuICAgYmluZGluZy1mb3Jtcy4gIFN1cHBvcnRlZCBtb2RpZmllcnMgYXJlOiAoOmxldCAoKGJpbmRpbmctZm9ybSBleHByKSAuLi4pKSxcbiAgICg6d2hpbGUgdGVzdCksICg6d2hlbiB0ZXN0KS5cbiAgKHRha2UgMTAwIChmb3IgKCh4IChpbmZpbml0ZS1yYW5nZSkpICh5IChpbmZpbml0ZS1yYW5nZSkpICg6d2hpbGUgKDwgeSB4KSkpICBbeCB5XSkpXG5cbiAgRGVwZW5kcyBvbiBsYXp5LXNlcSwgbGF6eS1jb25jYXQsIGVtcHR5PywgZmlyc3QsIHJlc3QsIGNvbnNcIlxuICAobGV0KiAoKHBhaXJzICh2ZWMgKG1hcCB2ZWMgc2VxLWV4cHJzKSkpXG4gICAgICAgIChpdGVyIChnZW5zeW0gOmZvci1pdGVyKSkgKGNvbGwgKGdlbnN5bSA6Zm9yLWNvbGwpKSAocGFydHMgKGZvci1wYXJ0cyBwYWlycykpKVxuICAgICg6Ym9keSAocmVkdWNlIChsYW1iZGEgKCUxICUyKSAoYXBwbHkgZm9yLXN0ZXAgJTEgJTIpKVxuICAgICAgICAgICAgICAgICAgIHs6aXRlciBpdGVyIDpjb2xsIGNvbGwgOmJvZHkgYChjb25zICxib2R5LWV4cHIgKCxpdGVyIChyZXN0ICxjb2xsKSkpfVxuICAgICAgICAgICAgICAgICAgIChyZXZlcnNlIHBhcnRzKSkpKSlcbihpbnN0YWxsLW1hY3JvIDpmb3IgZXhwYW5kLWZvcilcblxuKGRlZnVuIGV4cGFuZC1kb3NlcVxuICAoc2VxLWV4cHJzICZyZXN0IGJvZHkpXG4gIFwiUmVwZWF0ZWRseSBleGVjdXRlcyBib2R5IChwcmVzdW1hYmx5IGZvciBzaWRlLWVmZmVjdHMpIHdpdGhcbiAgYmluZGluZ3MgYW5kIGZpbHRlcmluZyBhcyBwcm92aWRlZCBieSAnZm9yJy4gRG9lcyBub3QgcmV0YWluXG4gIHRoZSBoZWFkIG9mIHRoZSBzZXF1ZW5jZS4gUmV0dXJucyBuaWwuXG5cbiAgRGVwZW5kcyBvbiBsYXp5LXNlcSwgbGF6eS1jb25jYXQsIGVtcHR5PywgZmlyc3QsIHJlc3QsIGNvbnMsIGRvcnVuXCJcbiAgYChkb3J1biAoZm9yICxzZXEtZXhwcnMgKHByb2duICxAYm9keSBuaWwpKSkpXG4oaW5zdGFsbC1tYWNybyA6ZG9zZXEgZXhwYW5kLWRvc2VxKVxuXG5cbihkZWZ1bi0gc3ltKiAoc3RyaW5nKVxuICAobGV0KiAoKHdvcmRzIChzcGxpdCAobmFtZSBzdHJpbmcpICNcIi1cIikpKVxuICAgIChqb2luIChjb25zIChmaXJzdCB3b3JkcykgKG1hcCBjYXBpdGFsaXplIChyZXN0IHdvcmRzKSkpKSkpXG4oZGVmdW4tIGJpbmQtc3ltKiAocyBiKVxuICAoYXNzZXJ0IChzeW1ib2w/IHMpIFwiRXhwZWN0ZWQgYSBzeW1ib2wgaGVyZSFcIilcbiAgW3MgYl0pXG4oZGVmdW4tIGNvbmotc3ltcyogKGdldCogcmVzdWx0IGsgdiBmIHF1b3RlKVxuICAobGV0KiAoKGstbnMgKG5hbWVzcGFjZSBrKSkgKGcgKGxhbWJkYSAoJSkgKGYgay1ucyAobmFtZSAlKSkpKSlcbiAgICAodmVjIChjb25jYXQgcmVzdWx0IChtYXBjYXQgKGxhbWJkYSAoJSkgKGJpbmQtc3ltKiAlIChnZXQqICUgKGcgJSkgcXVvdGUpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdikpKSkpXG4oZGVmdW4tIGRpY3QtZ2V0KiAoZGljdC1uYW1lIGRlZmF1bHRzKVxuICAobGFtYmRhIChiaW5kaW5nIGtleSBxdW90ZSlcbiAgICAobGV0KiAoKHMgKG5hbWUga2V5KSlcbiAgICAgICAgICAoayAoa2V5d29yZCAobmFtZXNwYWNlIGtleSkgKGlmIChzeW1ib2w/IGtleSkgKHN5bSogcykgcykpKSlcbiAgICAgIGAoZ2V0ICxkaWN0LW5hbWUgLChpZi1ub3QgcXVvdGUgayBgJyxrKSAsKGFuZCBiaW5kaW5nIChhZ2V0IGRlZmF1bHRzIGJpbmRpbmcpKSkpKSlcblxuKGRlZnVuIGRlc3RydWN0dXJlLWRpY3QgKGJpbmRpbmcgZnJvbSlcbiAgKGxldCogKChkaWN0LW5hbWUgIChvciAoYWdldCBiaW5kaW5nICc6YXMpIChnZW5zeW0gOmRlc3RydWN0dXJlLWJpbmQpKSlcbiAgICAgICAgKGRpY3QtYmluZCAgYChpZiAoZGljdGlvbmFyeT8gLGRpY3QtbmFtZSkgLGRpY3QtbmFtZSAoYXBwbHkgZGljdGlvbmFyeSAodmVjICxkaWN0LW5hbWUpKSkpXG4gICAgICAgIChnZXQqICAgICAgIChkaWN0LWdldCogZGljdC1uYW1lIChnZXQgYmluZGluZyAnOm9yIHt9KSkpKVxuICAgIChsb29wICgoa3MgKGtleXMgKGRpc3NvYyBiaW5kaW5nICc6YXMgJzpvcikpKSAocmVzdWx0IFtkaWN0LW5hbWUgZnJvbSBkaWN0LW5hbWUgZGljdC1iaW5kXSkpXG4gICAgICAoaWYgKGVtcHR5PyBrcylcbiAgICAgICAgcmVzdWx0XG4gICAgICAgIChsZXQqICgoayAoZmlyc3Qga3MpKSAodiAoZ2V0IGJpbmRpbmcgaykpIChrKiAoYW5kIChrZXl3b3JkPyBrKSAobmFtZSBrKSkpKVxuICAgICAgICAgIChhc3NlcnQgKG9yIChzeW1ib2w/IGspIChhbmQgayogKCN7OmtleXMgOnN0cnMgOnN5bXN9IGsqKSkpXG4gICAgICAgICAgICAgICAgICAoc3RyIFwiSW52YWxpZCBkZXN0cnVjdHVyZSBrZXkgXCIgaykpXG4gICAgICAgICAgKHJlY3VyIChyZXN0IGtzKSAoY29uZCAoKD0gayogOnN0cnMpIChjb25qLXN5bXMqIGdldCogcmVzdWx0IGsgdiBrZXl3b3JkKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgoPSBrKiA6c3ltcykgKGNvbmotc3ltcyogZ2V0KiByZXN1bHQgayB2IChsYW1iZGEgKCUxICUyKSAoc3ltYm9sICUxIChzeW0qICUyKSkpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKD0gayogOmtleXMpIChjb25qLXN5bXMqIGdldCogcmVzdWx0IGsgdiBrZXl3b3JkKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgobnVtYmVyPyB2KSAgKGNvbmogcmVzdWx0IGsgKGdldCogayAoc3ltYm9sIChzdHIgdikpKSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZWxzZSAgICAgICAgKGNvbmogcmVzdWx0IGsgKGdldCogayB2KSkpKSkpKSkpKVxuXG4oZGVmdW4gZGVzdHJ1Y3R1cmUtc2VxIChiaW5kaW5nIGZyb20pXG4gIChsZXQqICgoYXMgICAgICAgKC5maW5kLWluZGV4IGJpbmRpbmcgKGxhbWJkYSAoJSkgKD0gJSAnOmFzKSkpKVxuICAgICAgICAoc2VxLW5hbWUgKGlmICg8IGFzIDApIChnZW5zeW0gOmRlc3RydWN0dXJlLWJpbmQpIChudGggYmluZGluZyAoaW5jIGFzKSkpKVxuICAgICAgICAoYmluZGluZzEgKGlmICg8IGFzIDApIGJpbmRpbmcgKHRha2UgYXMgYmluZGluZykpKVxuICAgICAgICAobW9yZSAgICAgKC5maW5kLWluZGV4IGJpbmRpbmcxIChsYW1iZGEgKCUpIChvciAoPSAlICcmKSAoPSAlICcmcmVzdCkpKSkpXG4gICAgICAgICh0YWlsICAgICAoaWYgKD49IG1vcmUgMCkgKG50aCBiaW5kaW5nMSAoaW5jIG1vcmUpKSkpXG4gICAgICAgIChiaW5kaW5nMiAoaWYgKDwgbW9yZSAwKSBiaW5kaW5nMSAodGFrZSBtb3JlIGJpbmRpbmcpKSkpXG4gICAgKGFzc2VydCAob3IgKDwgYXMgMCkgKD0gYXMgKC0gKGNvdW50IGJpbmRpbmcpIDIpKSlcbiAgICAgICAgICAgIFwiaW52YWxpZCA6YXMgaW4gc2VxLWRlc3RydWN0dXJpbmdcIilcbiAgICAoYXNzZXJ0IChvciAoPCBtb3JlIDApICg9IG1vcmUgKC0gKGNvdW50IGJpbmRpbmcxKSAyKSkpXG4gICAgICAgICAgICBcImludmFsaWQgJiBpbiBzZXEtZGVzdHJ1Y3R1cmluZ1wiKVxuICAgIChsb29wICgoeHMgYmluZGluZzIpIChpIDApIChyZXN1bHQgW3NlcS1uYW1lIGZyb21dKSlcbiAgICAgIChsZXQqICgoeCAoZmlyc3QgeHMpKSlcbiAgICAgICAgKGNvbmQgKChlbXB0eT8geHMpIChpZi1ub3QgdGFpbCByZXN1bHQgKGNvbmogcmVzdWx0IHRhaWwgYChkcm9wICxtb3JlICxzZXEtbmFtZSkpKSlcbiAgICAgICAgICAgICAgKCg9IHggJ18pICAgIChyZWN1ciAocmVzdCB4cykgKGluYyBpKSByZXN1bHQpKVxuICAgICAgICAgICAgICAoZWxzZSAgICAgICAocmVjdXIgKHJlc3QgeHMpIChpbmMgaSkgKGNvbmogcmVzdWx0IHggYChudGggLHNlcS1uYW1lICxpKSkpKSkpKSkpXG5cbihkZWZ1biBkZXN0cnVjdHVyZSAoYmluZGluZ3MpXG4gIChsZXQqICgocGFpcnMgKHBhcnRpdGlvbiAyIGJpbmRpbmdzKSkpXG4gICAgKGlmIChldmVyeT8gKGxhbWJkYSAoJSkgKHN5bWJvbD8gKGZpcnN0ICUpKSkgcGFpcnMpXG4gICAgICBiaW5kaW5nc1xuICAgICAgKGRlc3RydWN0dXJlICh2ZWMgKG1hcGNhdCAobGFtYmRhICglKSAoY29uZCAoKHZlY3Rvcj8gICAgIChmaXJzdCAlKSkgKGFwcGx5IGRlc3RydWN0dXJlLXNlcSAlKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgoZGljdGlvbmFyeT8gKGZpcnN0ICUpKSAoYXBwbHkgZGVzdHJ1Y3R1cmUtZGljdCAlKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgoc3ltYm9sPyAgICAgKGZpcnN0ICUpKSAlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGVsc2UgICAgICAgICAgICAgICAgICAgKHRocm93IFwiSW52YWxpZCBiaW5kaW5nXCIpKSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhaXJzKSkpKSkpXG5cbihkZWZ1bi0gYmluZC1uYW1lcyogKGtleXMpXG4gICh6aXBtYXAga2V5cyAocmVwZWF0ZWRseSAoY291bnQga2V5cykgKGxhbWJkYSAoKSAoZ2Vuc3ltIDpkZXN0cnVjdHVyZS1iaW5kKSkpKSlcbihkZWZ1bi0gYmluZC1pbmRpY2VzKiAobmFtZXMpXG4gIChmaWx0ZXIgKGxhbWJkYSAoJSkgKG5vdCAoc3ltYm9sPyAobnRoIG5hbWVzICUpKSkpIChyYW5nZSAoY291bnQgbmFtZXMpKSkpXG5cbihkZWZ1bi0gcGFyZW4tYmluZGluZ3MtPnZlY1xuICAoYmluZGluZ3MpXG4gIFwiVHVybnMgYSBuZXctc3ludGF4IGBsZXRgL2BsZXQqYCBwYXJlbiBiaW5kaW5nIGxpc3QsIGUuZy5cbiAgKCh4IDEpICh5IDIpKSwgaW50byB0aGUgZmxhdCB2ZWN0b3IgW3ggMSB5IDJdIHRoZSBpbnRlcm5hbCBgbGV0KipgXG4gIGZvcm0gKGFuZCBgZGVzdHJ1Y3R1cmVgKSBleHBlY3QuXCJcbiAgKHZlYyAobWFwY2F0IChsYW1iZGEgKHBhaXIpIFsoZmlyc3QgcGFpcikgKHNlY29uZCBwYWlyKV0pIGJpbmRpbmdzKSkpXG5cbihkZWZ1biBleHBhbmQtbGV0KlxuICAoYmluZGluZ3MgJnJlc3QgYm9keSlcbiAgXCIobGV0KiAoKHggMSkgKHkgKCsgeCAxKSkpIGJvZHkqKSAtLSBzZXF1ZW50aWFsOiBlYWNoIGJpbmRpbmcgc2Vlc1xuICB0aGUgcHJldmlvdXMgb25lcy5cIlxuICBgKGxldCoqICwoZGVzdHJ1Y3R1cmUgKHBhcmVuLWJpbmRpbmdzLT52ZWMgYmluZGluZ3MpKSAsQGJvZHkpKVxuKGluc3RhbGwtbWFjcm8hIDpsZXQqIGV4cGFuZC1sZXQqKVxuXG4oZGVmdW4gZXhwYW5kLWxldFxuICAoYmluZGluZ3MgJnJlc3QgYm9keSlcbiAgXCIobGV0ICgoeCAxKSAoeSAyKSkgYm9keSopIC0tIGJpbmRpbmdzIGV2YWx1YXRlZCBpbiB0aGUgT1VURVIgc2NvcGVcbiAgKHBhcmFsbGVsKTogZXZlcnkgaW5pdC1leHByIHNlZXMgb25seSB3aGF0IHdhcyBib3VuZCBiZWZvcmUgdGhpc1xuICBgbGV0YCwgbmV2ZXIgYSBzaWJsaW5nIGJpbmRpbmcgaW50cm9kdWNlZCBieSB0aGUgc2FtZSBmb3JtLiBBbGxcbiAgaW5pdC1leHBycyBhcmUgZXZhbHVhdGVkIGZpcnN0IChib3VuZCB0byBnZW5zeW1zKSwgdGhlbiB0aGUgcmVhbFxuICBuYW1lcyBhcmUgYm91bmQgZnJvbSB0aG9zZSBnZW5zeW1zLlwiXG4gIChsZXQqICgocGFpcnMgKHBhcnRpdGlvbiAyIChwYXJlbi1iaW5kaW5ncy0+dmVjIGJpbmRpbmdzKSkpXG4gICAgICAgIChnZW5zeW1zIChtYXAgKGxhbWJkYSAoXykgKGdlbnN5bSA6bGV0LWJpbmRpbmcpKSBwYWlycykpXG4gICAgICAgIChvdXRlciAobWFwY2F0IChsYW1iZGEgKGcgcGFpcikgW2cgKHNlY29uZCBwYWlyKV0pIGdlbnN5bXMgcGFpcnMpKVxuICAgICAgICAoaW5uZXIgKG1hcGNhdCAobGFtYmRhIChnIHBhaXIpIFsoZmlyc3QgcGFpcikgZ10pIGdlbnN5bXMgcGFpcnMpKSlcbiAgICBgKGxldCoqICwodmVjIG91dGVyKSAobGV0KiogLChkZXN0cnVjdHVyZSAodmVjIGlubmVyKSkgLEBib2R5KSkpKVxuKGluc3RhbGwtbWFjcm8hIDpsZXQgZXhwYW5kLWxldClcblxuKGRlZnVuLSBwYXJzZS1hcmdsaXN0XG4gIChwYXJhbXMpXG4gIFwiUGFyc2VzIGEgbmV3LXN5bnRheCBwYXJhbWV0ZXIgbGlzdCAtLSAoYSBiICZvcHRpb25hbCAoYyAxMCkgJnJlc3QgcilcbiAgLS0gaW50byB7Om5hbWVzIFsuLi5dIDpkZWZhdWx0cyAoW25hbWUgZGVmYXVsdF0gLi4uKX0uIDpuYW1lcyBpcyBhXG4gIGZsYXQgdmVjdG9yIHVzaW5nIHRoZSBleGlzdGluZyBgJiByZXN0LW5hbWVgIHZhcmlhZGljIGNvbnZlbnRpb25cbiAgZm4qL2FuYWx5emUtZm4gYWxyZWFkeSB1bmRlcnN0YW5kczsgOmRlZmF1bHRzIGFyZSBbbmFtZSBkZWZhdWx0LWZvcm1dXG4gIHBhaXJzIHRvIHByZXBlbmQgYXMgYm9keSBzdGF0ZW1lbnRzLiBQb3NpdGlvbmFsIGRlc3RydWN0dXJpbmdcbiAgKGEgcGFyYW0gcG9zaXRpb24gdGhhdCBpcyBpdHNlbGYgYSB2ZWN0b3IvZGljdGlvbmFyeSBwYXR0ZXJuKSBpc1xuICBoYW5kbGVkIHRoZSBzYW1lIHdheSBvbGQgd2lzcCdzIGBmbmAgZGlkIGl0IC0tIHNlZSBgZGVmKmAgYmVsb3cuXCJcbiAgKGxvb3AgKChyZW1haW5pbmcgKHNlcSBwYXJhbXMpKVxuICAgICAgICAgKG1vZGUgOnJlcXVpcmVkKVxuICAgICAgICAgKG5hbWVzIFtdKVxuICAgICAgICAgKGRlZmF1bHRzIFtdKSlcbiAgICAoaWYgKGVtcHR5PyByZW1haW5pbmcpXG4gICAgICB7Om5hbWVzIG5hbWVzIDpkZWZhdWx0cyBkZWZhdWx0c31cbiAgICAgIChsZXQqICgoeCAoZmlyc3QgcmVtYWluaW5nKSkgKHhzIChyZXN0IHJlbWFpbmluZykpKVxuICAgICAgICAoY29uZFxuICAgICAgICAgICgoPSB4ICcmb3B0aW9uYWwpIChyZWN1ciB4cyA6b3B0aW9uYWwgbmFtZXMgZGVmYXVsdHMpKVxuICAgICAgICAgICgoPSB4ICcmcmVzdCkgKHJlY3VyIHhzIDpyZXN0IG5hbWVzIGRlZmF1bHRzKSlcbiAgICAgICAgICAoKGlkZW50aWNhbD8gbW9kZSA6cmVzdCkgKHJlY3VyIHhzIG1vZGUgKGNvbmogbmFtZXMgJyYgeCkgZGVmYXVsdHMpKVxuICAgICAgICAgICgoYW5kIChpZGVudGljYWw/IG1vZGUgOm9wdGlvbmFsKSAobGlzdD8geCkpXG4gICAgICAgICAgKHJlY3VyIHhzIG1vZGUgKGNvbmogbmFtZXMgKGZpcnN0IHgpKVxuICAgICAgICAgICAgICAgICAoY29uaiBkZWZhdWx0cyBbKGZpcnN0IHgpIChzZWNvbmQgeCldKSkpXG4gICAgICAgICAgKGVsc2UgKHJlY3VyIHhzIG1vZGUgKGNvbmogbmFtZXMgeCkgZGVmYXVsdHMpKSkpKSkpXG5cbihkZWZ1biBleHBhbmQtbGFtYmRhXG4gICgmcmVzdCBhcmdzKVxuICBcIihsYW1iZGEgKHBhcmFtcyopIGV4cHJzKilcbiAgIChsYW1iZGEgbmFtZSAocGFyYW1zKikgZXhwcnMqKVxuXG4gIHBhcmFtcyA9PiBwb3NpdGlvbmFsLXBhcmFtcyogLCBvciBwb3NpdGlvbmFsLXBhcmFtcyogJm9wdGlvbmFsXG4gIChvcHQgZGVmYXVsdD8pKiAmcmVzdCBuZXh0LXBhcmFtXG5cbiAgQ29tcGlsZXMgdG8gYSBuYW1lZCBgZnVuY3Rpb25gIGV4cHJlc3Npb24gLS0ga2VlcHMgYHRoaXNgLFxuICBgYXJndW1lbnRzYCwgYW5kIG5hbWVkIHNlbGYtcmVjdXJzaW9uLiBNdWx0aS1hcml0eSBjbGF1c2VzXG4gICgocGFyYW1zMSopIGJvZHkxKikgKChwYXJhbXMyKikgYm9keTIqKSAtLSBDbG9qdXJlLXdpc3AncyBhcml0eVxuICBvdmVybG9hZGluZyAtLSBhcmUgbm90IHlldCBzdXBwb3J0ZWQgZm9yIG5ldy1zeW50YXg6IHRoYXQgY2FsbCBpc1xuICBkZWZlcnJlZCB0byB0aGUgUGhhc2UtMyBhcml0eS1vdmVybG9hZGluZyBjaGVja3BvaW50ICh0aWNrZXQgIzUpLlwiXG4gIChsZXQqICgobmFtZSAoaWYgKHN5bWJvbD8gKGZpcnN0IGFyZ3MpKSAoZmlyc3QgYXJncykpKVxuICAgICAgICAoZGVmcyAoaWYgbmFtZSAocmVzdCBhcmdzKSBhcmdzKSkpXG4gICAgKGlmIChhbmQgKGxpc3Q/IChmaXJzdCBkZWZzKSlcbiAgICAgICAgICAgICAobGlzdD8gKGZpcnN0IChmaXJzdCBkZWZzKSkpKVxuICAgICAgKHRocm93IChFcnJvciAoc3RyIFwibGFtYmRhOiBtdWx0aS1hcml0eSBjbGF1c2VzIGFyZSBub3Qgc3VwcG9ydGVkIFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgXCJpbiBuZXctc3ludGF4IHlldCAtLSB0aWNrZXQgIzUncyBhcml0eS1vdmVybG9hZGluZyBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgIFwicXVlc3Rpb24gaXMgc3RpbGwgb3BlblwiKSkpXG4gICAgICAobGV0KiAoKHBhcmFtcyAoZmlyc3QgZGVmcykpXG4gICAgICAgICAgICAoYm9keSAocmVzdCBkZWZzKSlcbiAgICAgICAgICAgIChwYXJzZWQgKHBhcnNlLWFyZ2xpc3QgcGFyYW1zKSlcbiAgICAgICAgICAgIChpbmRpY2VzIChiaW5kLWluZGljZXMqICg6bmFtZXMgcGFyc2VkKSkpXG4gICAgICAgICAgICAoYmluZHMgKGJpbmQtbmFtZXMqIGluZGljZXMpKVxuICAgICAgICAgICAgKGFyZ3YgKHZlYyAobWFwLWluZGV4ZWQgKGxhbWJkYSAoJTEgJTIpIChnZXQgYmluZHMgJTEgJTIpKSAoOm5hbWVzIHBhcnNlZCkpKSlcbiAgICAgICAgICAgIChkZXN0cnVjdHVyaW5nIChpZiAoZW1wdHk/IGJpbmRzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW2AobGV0KiogLChkZXN0cnVjdHVyZSAodmVjIChtYXBjYXQgKGxhbWJkYSAoaSkgWyhudGggKDpuYW1lcyBwYXJzZWQpIGkpIChnZXQgYmluZHMgaSldKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGljZXMpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLEBib2R5KV0pKVxuICAgICAgICAgICAgKGRlZmF1bHRpbmcgKG1hcCAobGFtYmRhIChkKSBgKGlmIChuaWw/ICwoZmlyc3QgZCkpIChzZXQhICwoZmlyc3QgZCkgLChzZWNvbmQgZCkpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoOmRlZmF1bHRzIHBhcnNlZCkpKVxuICAgICAgICAgICAgKGJvZHkqIChpZiAoZW1wdHk/IGRlc3RydWN0dXJpbmcpXG4gICAgICAgICAgICAgICAgICAgIChjb25jYXQgZGVmYXVsdGluZyBib2R5KVxuICAgICAgICAgICAgICAgICAgICAoY29uY2F0IGRlZmF1bHRpbmcgZGVzdHJ1Y3R1cmluZykpKSlcbiAgICAgICAgKGlmIG5hbWVcbiAgICAgICAgICBgKGZuKiAsbmFtZSAsYXJndiAsQGJvZHkqKVxuICAgICAgICAgIGAoZm4qICxhcmd2ICxAYm9keSopKSkpKSlcbihpbnN0YWxsLW1hY3JvISA6bGFtYmRhIGV4cGFuZC1sYW1iZGEpXG5cbihkZWZ1biBleHBhbmQtbGFtYmRhKlxuICAoJnJlc3QgYXJncylcbiAgXCIobGFtYmRhKiAocGFyYW1zKikgZXhwcnMqKVxuXG4gIFRoZSBhcnJvdy1mdW5jdGlvbiBmb3JtOiBjb21waWxlcyB0byBhbiBhbm9ueW1vdXNcbiAgQXJyb3dGdW5jdGlvbkV4cHJlc3Npb24sIHdoaWNoIGNhcnJpZXMgbm8gYC5wcm90b3R5cGVgIC0tIGhvc3RcbiAgc3lzdGVtcyB0aGF0IGNsYXNzaWZ5IGFueSAucHJvdG90eXBlLWJlYXJpbmcgZnVuY3Rpb24gYXMgYSBjbGFzc1xuICAoZS5nLiBjb3JkaXMncyBpc0NvbnN0cnVjdG9yKSBzdG9wIG1pc3JlYWRpbmcgdGhlc2UgYXMgY29uc3RydWN0b3JzLFxuICBzbyBhIHJldHVybmVkIGRpc3Bvc2VyIGtlZXBzIGl0cyB0ZWFyZG93bi5cblxuICBBcnJvd3MgYXJlIGFub255bW91czogbm8gbmFtZSwgbm8gYHRoaXNgIC8gYGFyZ3VtZW50c2AgL1xuICBuYW1lZCBzZWxmLXJlY3Vyc2lvbiBpbiB0aGUgYm9keSAodGhlIGFuYWx5emVyIHJlamVjdHMgdW5yZXNvbHZlZFxuICByZWZlcmVuY2VzKS4gYCZvcHRpb25hbGAgZGVmYXVsdHMgYXJlIHN1cHBvcnRlZCAodGhleSBsb3dlciB0byBib2R5XG4gIHN0YXRlbWVudHMpOyBgJnJlc3RgIGlzIHJlamVjdGVkIGJlY2F1c2UgdGhlIHZhcmlhZGljIGxvd2VyaW5nXG4gIHNsaWNlcyBgYXJndW1lbnRzYCwgd2hpY2ggYXJyb3dzIGRvIG5vdCBoYXZlLiBNdWx0aS1hcml0eSBjbGF1c2VzXG4gIGFyZSByZWplY3RlZCwgc2FtZSBhcyBgbGFtYmRhYC5cIlxuICAoY29uZCAoKHN5bWJvbD8gKGZpcnN0IGFyZ3MpKVxuICAgICAgICAgKHRocm93IChFcnJvciBcImxhbWJkYSogZG9lcyBub3Qgc3VwcG9ydCBhIG5hbWUgLS0gYXJyb3dzIGFyZSBhbm9ueW1vdXNcIikpKVxuICAgICAgICAoKGFuZCAobGlzdD8gKGZpcnN0IGFyZ3MpKVxuICAgICAgICAgICAgICAobGlzdD8gKGZpcnN0IChmaXJzdCBhcmdzKSkpKVxuICAgICAgICAgKHRocm93IChFcnJvciAoc3RyIFwibGFtYmRhKjogbXVsdGktYXJpdHkgY2xhdXNlcyBhcmUgbm90IHN1cHBvcnRlZCAtLSBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidXNlICZvcHRpb25hbCAob3IgbGFtYmRhKSBpbnN0ZWFkXCIpKSkpXG4gICAgICAgIChlbHNlXG4gICAgICAgICAobGV0KiAoKHBhcmFtcyAoZmlyc3QgYXJncykpXG4gICAgICAgICAgICAgICAoYm9keSAocmVzdCBhcmdzKSlcbiAgICAgICAgICAgICAgIChwYXJzZWQgKHBhcnNlLWFyZ2xpc3QgcGFyYW1zKSlcbiAgICAgICAgICAgICAgIChuYW1lcyAoOm5hbWVzIHBhcnNlZCkpKVxuICAgICAgICAgICAoaWYgKHNvbWUgKGxhbWJkYSAoJSkgKD0gJyYgJSkpIG5hbWVzKVxuICAgICAgICAgICAgICh0aHJvdyAoRXJyb3IgKHN0ciBcImxhbWJkYSogZG9lcyBub3Qgc3VwcG9ydCAmcmVzdCAtLSB0aGUgdmFyaWFkaWMgXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJsb3dlcmluZyBzbGljZXMgYGFyZ3VtZW50c2AsIHdoaWNoIGFycm93cyBsYWNrXCIpKSlcbiAgICAgICAgICAgICAobGV0KiAoKGluZGljZXMgKGJpbmQtaW5kaWNlcyogbmFtZXMpKVxuICAgICAgICAgICAgICAgICAgIChiaW5kcyAoYmluZC1uYW1lcyogaW5kaWNlcykpXG4gICAgICAgICAgICAgICAgICAgKGFyZ3YgKHZlYyAobWFwLWluZGV4ZWQgKGxhbWJkYSAoJTEgJTIpIChnZXQgYmluZHMgJTEgJTIpKSBuYW1lcykpKVxuICAgICAgICAgICAgICAgICAgIChkZXN0cnVjdHVyaW5nIChpZiAoZW1wdHk/IGJpbmRzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbYChsZXQqKiAsKGRlc3RydWN0dXJlICh2ZWMgKG1hcGNhdCAobGFtYmRhIChpKSBbKG50aCBuYW1lcyBpKSAoZ2V0IGJpbmRzIGkpXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kaWNlcykpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLEBib2R5KV0pKVxuICAgICAgICAgICAgICAgICAgIChkZWZhdWx0aW5nIChtYXAgKGxhbWJkYSAoZCkgYChpZiAobmlsPyAsKGZpcnN0IGQpKSAoc2V0ISAsKGZpcnN0IGQpICwoc2Vjb25kIGQpKSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICg6ZGVmYXVsdHMgcGFyc2VkKSkpXG4gICAgICAgICAgICAgICAgICAgKGJvZHkqIChpZiAoZW1wdHk/IGRlc3RydWN0dXJpbmcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAoY29uY2F0IGRlZmF1bHRpbmcgYm9keSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIChjb25jYXQgZGVmYXVsdGluZyBkZXN0cnVjdHVyaW5nKSkpKVxuICAgICAgICAgICAgICAgOzsgVGhlIDphcnJvdyBtYXJrZXIgcmlkZXMgdGhlIChmbiogLi4uKSBmb3JtJ3MgbWV0YWRhdGFcbiAgICAgICAgICAgICAgIDs7IGludG8gYW5hbHl6ZS1mbiwgd2hpY2ggdGhyZWFkcyBpdCBvbnRvIHRoZSBBU1Qgbm9kZVxuICAgICAgICAgICAgICAgOzsgKGFuZCB0aGUgc2NvcGUgZW52KSBmb3IgdGhlIGJhY2tlbmQuXG4gICAgICAgICAgICAgICAod2l0aC1tZXRhIGAoZm4qICxhcmd2ICxAYm9keSopIHs6YXJyb3cgdHJ1ZX0pKSkpKSkpXG4oaW5zdGFsbC1tYWNybyEgOmxhbWJkYSogZXhwYW5kLWxhbWJkYSopXG5cbihkZWZ1biBleHBhbmQtZGVmcGx1Z2luXG4gIChpZCAmcmVzdCBtb3JlKVxuICBcIihkZWZwbHVnaW4gaWQgYXR0cnM/IChwYXJhbXMqKSBleHBycyopXG5cbiAgRGVmaW5lcyBJRCBhcyBhbiBhcnJvdy1mdW5jdGlvbiBwbHVnaW46XG4gIChkZWZ2YXIgaWQgKGxhbWJkYSogKHBhcmFtcyopIGV4cHJzKikpIHdpdGggZWFjaCBwYWlyIG9mIHRoZVxuICBvcHRpb25hbCBhdHRycyBtYXAgZm9yd2FyZGVkIG9udG8gdGhlIGZ1bmN0aW9uIHZpYVxuICBPYmplY3QuZGVmaW5lUHJvcGVydHk6XG5cbiAgKGRlZnBsdWdpbiBoYW5kbGVyIHs6aW5qZWN0IFthIGJdfSAoY3R4IGNvbmZpZykgLi4uKVxuICA9PiAoZGVmdmFyIGhhbmRsZXIgKChsYW1iZGEgKHBsdWdpbi1nZW5zeW0pXG4gICAgICAgICAgICAgICAgICAgICAgICAoT2JqZWN0LmRlZmluZVByb3BlcnR5IHBsdWdpbi1nZW5zeW0gXFxcImluamVjdFxcXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgezp2YWx1ZSBbYSBiXSA6d3JpdGFibGUgdHJ1ZSA6ZW51bWVyYWJsZSB0cnVlIDpjb25maWd1cmFibGUgdHJ1ZX0pXG4gICAgICAgICAgICAgICAgICAgICAgICBwbHVnaW4tZ2Vuc3ltKVxuICAgICAgICAgICAgICAgICAgICAgIChsYW1iZGEqIChjdHggY29uZmlnKSAuLi4pKSlcblxuICBkZWZpbmVQcm9wZXJ0eSAobm90IHBsYWluIGFzc2lnbm1lbnQpIGlzIHVzZWQgYmVjYXVzZSB0aGVcbiAgZnVuY3Rpb24ncyBvd24gYG5hbWVgIChhbmQgYGxlbmd0aGApIHByb3BlcnRpZXMgYXJlIG5vbi13cml0YWJsZVxuICBhbmQgYSBzaWxlbnQgbm8tb3Agb3RoZXJ3aXNlLiBUaGUgYXNzaWdubWVudHMgcnVuIGluc2lkZSB0aGVcbiAgZGVmdmFyIGluaXQgc28gdGhlIHBsdWdpbiBzdGF5cyBhIHNpbmdsZSB0b3AtbGV2ZWwgZGVmaW5pdGlvblxuICAoZXhwb3J0cyBzZW1hbnRpY3MgaWRlbnRpY2FsIHRvIGBkZWZ1bmApLiBBbnkgbWV0YWRhdGEga2V5XG4gIGZvcndhcmRzIChpbmplY3QsIG5hbWUsIENvbmZpZywgcHJvdmlkZSwgLi4uKS4gVGhlIGFycm93IGVtaXRcbiAgY2FycmllcyBubyAucHJvdG90eXBlLCBzbyBwbHVnaW4gaG9zdHMgY2Fubm90IG1pc3JlYWQgdGhlIHBsdWdpblxuICBhcyBhIGNsYXNzIGFuZCBkcm9wIGEgcmV0dXJuZWQgZGlzcG9zZXIuXCJcbiAgKGxldCogKChhdHRycyAoaWYgKGRpY3Rpb25hcnk/IChmaXJzdCBtb3JlKSkgKGZpcnN0IG1vcmUpIHt9KSlcbiAgICAgICAgKGRlZm4tZm9ybXMgKGlmIChkaWN0aW9uYXJ5PyAoZmlyc3QgbW9yZSkpIChyZXN0IG1vcmUpIG1vcmUpKVxuICAgICAgICAocGFyYW1zIChmaXJzdCBkZWZuLWZvcm1zKSlcbiAgICAgICAgKGJvZHkgKHJlc3QgZGVmbi1mb3JtcykpXG4gICAgICAgIChwbHVnaW4gKGdlbnN5bSBcInBsdWdpblwiKSlcbiAgICAgICAgKGZvcndhcmRpbmcgKG1hcCAobGFtYmRhIChrKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgYCguZGVmaW5lUHJvcGVydHkganMvT2JqZWN0ICxwbHVnaW4gLChuYW1lIGspXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7OnZhbHVlICwoZ2V0IGF0dHJzIGspXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOndyaXRhYmxlIHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ZW51bWVyYWJsZSB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmNvbmZpZ3VyYWJsZSB0cnVlfSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgKGtleXMgYXR0cnMpKSkpXG4gICAgYChkZWZ2YXIgLGlkICgobGFtYmRhICgscGx1Z2luKVxuICAgICAgICAgICAgICAgICAgICAsQGZvcndhcmRpbmdcbiAgICAgICAgICAgICAgICAgICAgLHBsdWdpbilcbiAgICAgICAgICAgICAgICAgIChsYW1iZGEqICxwYXJhbXMgLEBib2R5KSkpKSlcbihpbnN0YWxsLW1hY3JvISA6ZGVmcGx1Z2luIGV4cGFuZC1kZWZwbHVnaW4pXG5cbihkZWZ1biBleHBhbmQtbG9vcFxuICAoYmluZGluZ3MgJnJlc3QgYm9keSlcbiAgXCJFdmFsdWF0ZXMgdGhlIGV4cHJzIGluIGEgbGV4aWNhbCBjb250ZXh0IGluIHdoaWNoIHRoZSBzeW1ib2xzIGluXG4gIHRoZSBiaW5kaW5nLWZvcm1zIGFyZSBib3VuZCB0byB0aGVpciByZXNwZWN0aXZlIGluaXQtZXhwcnMgb3IgcGFydHNcbiAgdGhlcmVpbi4gQWN0cyBhcyBhIHJlY3VyIHRhcmdldC5cblxuICBEZXBlbmRzIG9uIGRpY3Rpb25hcnk/LCBkaWN0aW9uYXJ5LCB2ZWMsIGdldFwiXG4gIChsZXQqICgoYmluZGluZ3MgKHBhcmVuLWJpbmRpbmdzLT52ZWMgYmluZGluZ3MpKVxuICAgICAgICAocGFpcnMgICAocGFydGl0aW9uIDIgYmluZGluZ3MpKVxuICAgICAgICAoaW5kaWNlcyAoYmluZC1pbmRpY2VzKiAobWFwdiBmaXJzdCBwYWlycykpKVxuICAgICAgICAobmFtZXMgICAoYmluZC1uYW1lcyogaW5kaWNlcykpXG4gICAgICAgIChnZXQqICAgIChsYW1iZGEgKCUxICUyKSAoaWYtbGV0IFt4IChhZ2V0IG5hbWVzICUxKV1cbiAgICAgICAgICAgICAgICAgICBbeCAoc2Vjb25kICUyKSAoZmlyc3QgJTIpIHhdXG4gICAgICAgICAgICAgICAgICAgJTIpKSkpXG4gICAgKGlmIChlbXB0eT8gbmFtZXMpXG4gICAgICBgKGxvb3AqICxiaW5kaW5ncyAsQGJvZHkpXG4gICAgICBgKGxldCoqICwodmVjIChhcHBseSBjb25jYXQgKG1hcC1pbmRleGVkIGdldCogcGFpcnMpKSlcbiAgICAgICAgIChsb29wKiAsKHZlYyAoYXBwbHkgY29uY2F0IChtYXAtaW5kZXhlZCAobGFtYmRhICglMSAlMikgKGxldCogKCh4IChnZXQgbmFtZXMgJTEgKGZpcnN0ICUyKSkpKSBbeCB4XSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFpcnMpKSlcbiAgICAgICAgICAgKGxldCoqICwodmVjIChtYXBjYXQgKGxhbWJkYSAoaSkgWyhmaXJzdCAoYWdldCBwYWlycyBpKSkgKGFnZXQgbmFtZXMgaSldKSBpbmRpY2VzKSlcbiAgICAgICAgICAgICAsQGJvZHkpKSkpKSlcbihpbnN0YWxsLW1hY3JvIDpsb29wIGV4cGFuZC1sb29wKVxuIl19
