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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndpc3AvZXhwYW5kZXIud2lzcCJdLCJuYW1lcyI6WyJfbnNfIiwiaWQiLCJkb2MiLCJtZXRhIiwid2l0aE1ldGEiLCJpc1N5bWJvbCIsImlzS2V5d29yZCIsImtleXdvcmQiLCJpc1F1b3RlIiwic3ltYm9sIiwibmFtZXNwYWNlIiwibmFtZSIsImdlbnN5bSIsImlzVW5xdW90ZSIsImlzVW5xdW90ZVNwbGljaW5nIiwiaXNMaXN0IiwibGlzdCIsImNvbmoiLCJwYXJ0aXRpb24iLCJzZXEiLCJyZXBlYXRlZGx5IiwiaXNFbXB0eSIsIm1hcCIsIm1hcHYiLCJ2ZWMiLCJzZXQiLCJpc0V2ZXJ5IiwiY29uY2F0IiwiZmlyc3QiLCJzZWNvbmQiLCJ0aGlyZCIsInJlc3QiLCJsYXN0IiwibWFwY2F0IiwibnRoIiwiYnV0bGFzdCIsImludGVybGVhdmUiLCJjb25zIiwiY291bnQiLCJ0YWtlIiwiZGlzc29jIiwic29tZSIsImFzc29jIiwicmVkdWNlIiwiZmlsdGVyIiwiaXNTZXEiLCJ6aXBtYXAiLCJkcm9wIiwibGF6eVNlcSIsInJhbmdlIiwicmV2ZXJzZSIsImRvcnVuIiwibWFwSW5kZXhlZCIsImlzTmlsIiwiaXNEaWN0aW9uYXJ5IiwiaXNWZWN0b3IiLCJrZXlzIiwiZ2V0IiwidmFscyIsImlzU3RyaW5nIiwiaXNOdW1iZXIiLCJpc0Jvb2xlYW4iLCJpc0RhdGUiLCJpc1JlUGF0dGVybiIsImlzRXZlbiIsImlzT2RkIiwiaXNFcXVhbCIsIm1heCIsImluYyIsImRlYyIsImRpY3Rpb25hcnkiLCJtZXJnZSIsInN1YnMiLCJzcGxpdCIsImpvaW4iLCJjYXBpdGFsaXplIiwiX19tYWNyb3NfXyIsImV4cG9ydHMiLCJleHBhbmQiLCJleHBhbmRlciIsImZvcm0iLCJlbnYiLCJtZXRhZGF0YcO4MSIsInBhcm1hc8O4MSIsImltcGxpY2l0w7gxIiwiJCIsInBhcmFtc8O4MSIsImV4cGFuc2lvbsO4MSIsImluc3RhbGxNYWNybyIsIm9wIiwibWFjcm8iLCJpc0RvdFN5bnRheCIsImlzTWV0aG9kU3ludGF4IiwiaWTDuDEiLCJpc0ZpZWxkU3ludGF4IiwiaXNOZXdTeW50YXgiLCJtZXRob2RTeW50YXgiLCJ0YXJnZXQiLCJwYXJhbXMiLCJvcE1ldGHDuDEiLCJmb3JtU3RhcnTDuDEiLCJ0YXJnZXRNZXRhw7gxIiwibWVtYmVyw7gxIiwiYWdldMO4MSIsIm1ldGhvZMO4MSIsIkVycm9yIiwiZmllbGRTeW50YXgiLCJmaWVsZCIsIm1vcmUiLCJzdGFydMO4MSIsImVuZMO4MSIsImRvdFN5bnRheCIsIl9maWVsZMO4MSIsIm5ld1N5bnRheCIsImlkTWV0YcO4MSIsInJlbmFtZcO4MSIsImNvbnN0cnVjdG9yw7gxIiwib3BlcmF0b3LDuDEiLCJrZXl3b3JkSW52b2tlIiwiYXJncyIsImRlc3VnYXIiLCJkZXN1Z2FyZWTDuDEiLCJtYWNyb2V4cGFuZDEiLCJvcMO4MSIsImV4cGFuZGVyw7gxIiwibWFjcm9leHBhbmQiLCJvcmlnaW5hbMO4MSIsImV4cGFuZGVkw7gxIiwic3ludGF4UXVvdGUiLCJyZWFkZXJFcnJvciIsInNlcXVlbmNlRXhwYW5kIiwic3ludGF4UXVvdGVFeHBhbmQiLCJ1bnF1b3RlU3BsaWNpbmdFeHBhbmQiLCJmb3JtcyIsImV4cGFuZE5vdEVxdWFsIiwiYm9keSIsImV4cGFuZElmTm90IiwiY29uZGl0aW9uIiwidHJ1dGh5IiwiYWx0ZXJuYXRpdmUiLCJleHBhbmRDb21tZW50IiwiZXhwYW5kVGhyZWFkRmlyc3QiLCJvcGVyYXRpb25zIiwib3BlcmF0aW9uIiwiZXhwYW5kVGhyZWFkTGFzdCIsImV4cGFuZERvdHMiLCJ4IiwiZXhwYW5kVGhyZWFkQXMiLCJleHByIiwiZXhwYW5kQ29uZCIsImNsYXVzZXMiLCJjbGF1c2XDuDEiLCJ0ZXN0w7gxIiwiYm9kecO4MSIsImV4cGFuZENhc2UiLCJlIiwic3ltw7gxIiwiZXFfw7gxIiwiYyIsInBhaXJzw7gxIiwiY29uZHPDuDEiLCJjb25kc8O4MiIsInJlc3VsdMO4MSIsInjDuDEiLCJ4c8O4MSIsImNvbnN0c8O4MSIsImV4cGFuZENvbmRwIiwicHJlZCIsInN5bV/DuDEiLCJjb21wYXJlw7gxIiwic3BsaXRzw7gxIiwic3BsaXRzIiwieHMiLCJfdGhyZWFkIiwiaW5zZXJ0Iiwic3ltIiwidGVzdCIsImZvcm3DuDIiLCJfY29uZFRocmVhZCIsImV4cGFuZENvbmRUaHJlYWRGaXJzdCIsImV4cGFuZENvbmRUaHJlYWRMYXN0IiwiX3NvbWVUaHJlYWQiLCJleHBhbmRTb21lVGhyZWFkRmlyc3QiLCJleHBhbmRTb21lVGhyZWFkTGFzdCIsImJ1aWxkRGVmdW4iLCJwcml2YXRlIiwiX2FuZEZvcm0iLCJkb2NQbHVzQm9keSIsImRvY8O4MSIsImZuw7gxIiwiZGVmT3DDuDEiLCJleHBhbmREZWZ1biIsImV4cGFuZERlZmNvbnN0IiwidmFsdWUiLCJleHBhbmRTZXRxIiwicGxhY2UiLCJleHBhbmRTZXRmIiwiZXhwYW5kTGF6eVNlcSIsImV4cGFuZFdoZW4iLCJleHBhbmRVbmxlc3MiLCJleHBhbmRJZkxldCIsImJpbmRpbmdzIiwidGhlbiIsImVsc2VfIiwibmFtZcO4MSIsImRlc3RydWN0dXJlIiwiZXhwYW5kV2hlbkxldCIsImV4cGFuZElmU29tZSIsImV4cGFuZFdoZW5Tb21lIiwiZXhwYW5kV2hlbkZpcnN0IiwiZXhwYW5kV2hpbGUiLCJleHBhbmREb3RvIiwiZXhwYW5kRG90aW1lcyIsIm7DuDEiLCJmb3JTdGVwIiwiY29udGV4dCIsImxvb3AiLCJtb2RpZmllcnMiLCJpdGVyw7gxIiwiY29sbMO4MSIsInN1YnNlccO4MSIsImJvZHlfw7gxIiwibmV4dMO4MSIsIm1vZHPDuDEiLCJib2R5w7gyIiwibcO4MSIsIml0ZW3DuDEiLCJhcmfDuDEiLCJwYXJlbkJpbmRpbmdzVG9WZWMiLCJmb3JNb2RpZmllcnMiLCJmb3JQYXJ0cyIsInNlcUV4cHJQYWlycyIsImluZGljZXPDuDEiLCJzZWdtZW50c8O4MSIsInNsaWNlIiwiZXhwYW5kRm9yIiwic2VxRXhwcnMiLCJib2R5RXhwciIsInBhcnRzw7gxIiwiJDEiLCIkMiIsImV4cGFuZERvc2VxIiwic3ltXyIsInN0cmluZyIsIndvcmRzw7gxIiwiYmluZFN5bV8iLCJzIiwiYiIsImNvbmpTeW1zXyIsImdldF8iLCJyZXN1bHQiLCJrIiwidiIsImYiLCJxdW90ZSIsImtOc8O4MSIsImfDuDEiLCJkaWN0R2V0XyIsImRpY3ROYW1lIiwiZGVmYXVsdHMiLCJiaW5kaW5nIiwia2V5Iiwic8O4MSIsImvDuDEiLCJkZXN0cnVjdHVyZURpY3QiLCJmcm9tIiwiZGljdE5hbWXDuDEiLCJkaWN0QmluZMO4MSIsImdldF/DuDEiLCJrc8O4MSIsInbDuDEiLCJrX8O4MSIsImRlc3RydWN0dXJlU2VxIiwiYXPDuDEiLCJmaW5kSW5kZXgiLCJzZXFOYW1lw7gxIiwiYmluZGluZzHDuDEiLCJtb3Jlw7gxIiwidGFpbMO4MSIsImJpbmRpbmcyw7gxIiwiacO4MSIsImJpbmROYW1lc18iLCJiaW5kSW5kaWNlc18iLCJuYW1lcyIsInBhaXIiLCJleHBhbmRMZXRfIiwiZXhwYW5kTGV0IiwiZ2Vuc3ltc8O4MSIsIl8iLCJvdXRlcsO4MSIsImciLCJpbm5lcsO4MSIsInBhcnNlQXJnbGlzdCIsInJlbWFpbmluZ8O4MSIsIm1vZGXDuDEiLCJuYW1lc8O4MSIsImRlZmF1bHRzw7gxIiwiZXhwYW5kTGFtYmRhIiwiZGVmc8O4MSIsInBhcnNlZMO4MSIsImJpbmRzw7gxIiwiYXJndsO4MSIsImRlc3RydWN0dXJpbmfDuDEiLCJpIiwiZGVmYXVsdGluZ8O4MSIsImQiLCJleHBhbmRMb29wIiwiYmluZGluZ3PDuDIiXSwibWFwcGluZ3MiOiI7SUFBQSxJQUFDQSxJLEdBQUQ7QUFBQSxRQUFBQyxFLEVBQUksZUFBSjtBQUFBLFFBQUFDLEcsRUFDRSx1Q0FERjtBQUFBLE07O1FBRThCQyxJQUFBLEcsU0FBQUEsSTtRQUFLQyxRQUFBLEcsU0FBQUEsUTtRQUFVQyxRQUFBLEcsU0FBQUEsUTtRQUFRQyxTQUFBLEcsU0FBQUEsUztRQUFTQyxPQUFBLEcsU0FBQUEsTztRQUNoQ0MsT0FBQSxHLFNBQUFBLE87UUFB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QSxDLFVBQVF2SSxHQUFELENBQVlHLE0sTUFBUCxDLElBQUEsRUFBZXlCLFVBQUQsQ0FBYSxVQUFTMkwsRUFBVCxFQUFZQyxFQUFaLEVBQWdCO0FBQUEsMkIsWUFBUTtBQUFBLDRCQUFBN0UsRyxZQUFFLEMsSUFBQSxFOzRCQUFLb0ksTzs0QkFBTXhELEU7NEJBQUluTixLQUFELENBQU9vTixFQUFQLEM7eUJBQWQsQ0FBRjtBQUFBLHdCQUE4QjtBQUFBLDRCQUFDN0UsR0FBRDtBQUFBLDRCQUFHQSxHQUFIO0FBQUEsMEJBQTlCO0FBQUEscUIsS0FBUixDLElBQUE7QUFBQSxpQkFBN0IsRUFDYUosT0FEYixDQUFkLENBQUwsQyw0QkFFTCxDLElBQUEsRSxPQUFBLEMsVUFBUXZJLEdBQUQsQ0FBTVMsTUFBRCxDQUFRLFVBQVM4USxDQUFULEVBQVk7QUFBQTtBQUFBLDRCQUFFblIsS0FBRCxDQUFhbUksT0FBTixDQUFZZ0osQ0FBWixDQUFQLENBQUQ7QUFBQSw0QkFBOEJSLE9BQU4sQ0FBWVEsQ0FBWixDQUF4QjtBQUFBO0FBQUEscUJBQXBCLEVBQTZEdkUsU0FBN0QsQ0FBTCxDLE9BQ0pqRyxJLFFBSlQsQ0FGRixDQVBNO0FBQUEsSyxLQUFSLEMsSUFBQSxFO0NBUEYsQztBQXFCQy9DLFlBQUQsQyxNQUFBLEVBQXFCME4sVUFBckIiLCJzb3VyY2VzQ29udGVudCI6WyIobnMgd2lzcC5leHBhbmRlclxuICBcIndpc3Agc3ludGF4IGFuZCBtYWNybyBleHBhbmRlciBtb2R1bGVcIlxuICAoOnJlcXVpcmUgW3dpc3AuYXN0IDpyZWZlciBbbWV0YSB3aXRoLW1ldGEgc3ltYm9sPyBrZXl3b3JkPyBrZXl3b3JkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBxdW90ZT8gc3ltYm9sIG5hbWVzcGFjZSBuYW1lIGdlbnN5bVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5xdW90ZT8gdW5xdW90ZS1zcGxpY2luZz9dXVxuICAgICAgICAgICAgW3dpc3Auc2VxdWVuY2UgOnJlZmVyIFtsaXN0PyBsaXN0IGNvbmogcGFydGl0aW9uIHNlcSByZXBlYXRlZGx5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVtcHR5PyBtYXAgbWFwdiB2ZWMgc2V0IGV2ZXJ5PyBjb25jYXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3Qgc2Vjb25kIHRoaXJkIHJlc3QgbGFzdCBtYXBjYXQgbnRoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1dGxhc3QgaW50ZXJsZWF2ZSBjb25zIGNvdW50IHRha2UgZGlzc29jXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvbWUgYXNzb2MgcmVkdWNlIGZpbHRlciBzZXE/IHppcG1hcCBkcm9wXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhenktc2VxIHJhbmdlIHJldmVyc2UgZG9ydW4gbWFwLWluZGV4ZWRdXVxuICAgICAgICAgICAgW3dpc3AucnVudGltZSA6cmVmZXIgW25pbD8gZGljdGlvbmFyeT8gdmVjdG9yPyBrZXlzIGdldFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHMgc3RyaW5nPyBudW1iZXI/IGJvb2xlYW4/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZT8gcmUtcGF0dGVybj8gZXZlbj8gb2RkPyA9IG1heFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluYyBkZWMgZGljdGlvbmFyeSBtZXJnZSBzdWJzXV1cbiAgICAgICAgICAgIFt3aXNwLnN0cmluZyA6cmVmZXIgW3NwbGl0IGpvaW4gY2FwaXRhbGl6ZV1dKSlcblxuXG4oZGVmdmFyICoqbWFjcm9zKioge30pXG5cbihkZWZ1bi0gZXhwYW5kXG4gIChleHBhbmRlciBmb3JtIGVudilcbiAgXCJBcHBsaWVzIG1hY3JvIHJlZ2lzdGVyZWQgd2l0aCBnaXZlbiBgbmFtZWAgdG8gYSBnaXZlbiBgZm9ybWBcIlxuICAobGV0KiAoKG1ldGFkYXRhIChvciAobWV0YSBmb3JtKSB7fSkpXG4gICAgICAgIChwYXJtYXMgKHJlc3QgZm9ybSkpXG4gICAgICAgIChpbXBsaWNpdCAobWFwIChsYW1iZGEgKCUpIChjb25kICgoPSA6JmZvcm0gJSkgZm9ybSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCg9IDomZW52ICUpIGVudilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGVsc2UgJSkpKVxuICAgICAgICAgICAgICAgICAgICAgIChvciAoOmltcGxpY2l0IChtZXRhIGV4cGFuZGVyKSkgW10pKSlcbiAgICAgICAgKHBhcmFtcyAodmVjIChjb25jYXQgaW1wbGljaXQgKHZlYyAocmVzdCBmb3JtKSkpKSlcblxuICAgICAgICAoZXhwYW5zaW9uIChhcHBseSBleHBhbmRlciBwYXJhbXMpKSlcbiAgICAoaWYgZXhwYW5zaW9uXG4gICAgICAod2l0aC1tZXRhIGV4cGFuc2lvbiAoY29uaiBtZXRhZGF0YSAobWV0YSBleHBhbnNpb24pKSlcbiAgICAgIGV4cGFuc2lvbikpKVxuXG4oZGVmdW4gaW5zdGFsbC1tYWNybyFcbiAgKG9wIGV4cGFuZGVyKVxuICBcIlJlZ2lzdGVycyBnaXZlbiBgbWFjcm9gIHdpdGggYSBnaXZlbiBgbmFtZWBcIlxuICAoc2V0ZiAoZ2V0ICoqbWFjcm9zKiogKG5hbWUgb3ApKSBleHBhbmRlcikpXG5cbihkZWZ1bi0gbWFjcm9cbiAgKG9wKVxuICBcIlJldHVybnMgdHJ1ZSBpZiBtYWNybyB3aXRoIGEgZ2l2ZW4gbmFtZSBpcyByZWdpc3RlcmVkXCJcbiAgKGFuZCAoc3ltYm9sPyBvcClcbiAgICAgICAoZ2V0ICoqbWFjcm9zKiogKG5hbWUgb3ApKSkpXG5cblxuKGRlZnVuIGRvdC1zeW50YXg/XG4gIChvcClcbiAgKGFuZCAoc3ltYm9sPyBvcCkgKGlkZW50aWNhbD8gXFwuIChuYW1lIG9wKSkpKVxuXG4oZGVmdW4gbWV0aG9kLXN5bnRheD9cbiAgKG9wKVxuICAobGV0KiAoKGlkIChhbmQgKHN5bWJvbD8gb3ApIChuYW1lIG9wKSkpKVxuICAgIChhbmQgaWRcbiAgICAgICAgIChpZGVudGljYWw/IFxcLiAoZmlyc3QgaWQpKVxuICAgICAgICAgKG5vdCAoaWRlbnRpY2FsPyBcXC0gKHNlY29uZCBpZCkpKVxuICAgICAgICAgKG5vdCAoaWRlbnRpY2FsPyBcXC4gaWQpKSkpKVxuXG4oZGVmdW4gZmllbGQtc3ludGF4P1xuICAob3ApXG4gIChsZXQqICgoaWQgKGFuZCAoc3ltYm9sPyBvcCkgKG5hbWUgb3ApKSkpXG4gICAgKGFuZCBpZFxuICAgICAgICAgKGlkZW50aWNhbD8gXFwuIChmaXJzdCBpZCkpXG4gICAgICAgICAoaWRlbnRpY2FsPyBcXC0gKHNlY29uZCBpZCkpKSkpXG5cbihkZWZ1biBuZXctc3ludGF4P1xuICAob3ApXG4gIChsZXQqICgoaWQgKGFuZCAoc3ltYm9sPyBvcCkgKG5hbWUgb3ApKSkpXG4gICAgKGFuZCBpZFxuICAgICAgICAgKGlkZW50aWNhbD8gXFwuIChsYXN0IGlkKSlcbiAgICAgICAgIChub3QgKGlkZW50aWNhbD8gXFwuIGlkKSkpKSlcblxuKGRlZnVuIG1ldGhvZC1zeW50YXhcbiAgKG9wIHRhcmdldCAmcmVzdCBwYXJhbXMpXG4gIFwiRXhhbXBsZTpcbiAgJyguc3Vic3RyaW5nIHN0cmluZyAyIDUpID0+ICcoKGFnZXQgc3RyaW5nICdzdWJzdHJpbmcpIDIgNSlcIlxuICAobGV0KiAoKG9wLW1ldGEgKG1ldGEgb3ApKVxuICAgICAgICAoZm9ybS1zdGFydCAoOnN0YXJ0IG9wLW1ldGEpKVxuICAgICAgICAodGFyZ2V0LW1ldGEgKG1ldGEgdGFyZ2V0KSlcbiAgICAgICAgKG1lbWJlciAod2l0aC1tZXRhIChzeW1ib2wgKHN1YnMgKG5hbWUgb3ApIDEpKVxuICAgICAgICAgICAgICAgICA7OyBJbmNsdWRlIG1ldGFkYXQgZnJvbSB0aGUgb3JpZ2luYWwgc3ltYm9sIGp1c3RcbiAgICAgICAgICAgICAgICAgKGNvbmogb3AtbWV0YVxuICAgICAgICAgICAgICAgICAgICAgICB7OnN0YXJ0IHs6bGluZSAoOmxpbmUgZm9ybS1zdGFydClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmNvbHVtbiAoaW5jICg6Y29sdW1uIGZvcm0tc3RhcnQpKX19KSkpXG4gICAgICAgIDs7IEFkZCBtZXRhZGF0YSB0byBhZ2V0IHN5bWJvbCB0aGF0IHdpbGwgbWFwIHRvIHRoZSBmaXJzdCBgLmBcbiAgICAgICAgOzsgY2hhcmFjdGVyIG9mIHRoZSBtZXRob2QgbmFtZS5cbiAgICAgICAgKGFnZXQgKHdpdGgtbWV0YSAnYWdldFxuICAgICAgICAgICAgICAgKGNvbmogb3AtbWV0YVxuICAgICAgICAgICAgICAgICAgICAgezplbmQgezpsaW5lICg6bGluZSBmb3JtLXN0YXJ0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpjb2x1bW4gKGluYyAoOmNvbHVtbiBmb3JtLXN0YXJ0KSl9fSkpKVxuXG4gICAgICAgIDs7IEZpcnN0IHR3byBmb3JtcyAoLnN1YnN0cmluZyBzdHJpbmcgLi4uKSBleHBhbmQgdG9cbiAgICAgICAgOzsgKChhZ2V0IHN0cmluZyAnc3Vic3RyaW5nKSAuLi4pIHRoZXJlIGZvciBleHBhbnNpb24gZ2V0c1xuICAgICAgICA7OyBwb3NpdGlvbiBtZXRhZGF0YSBmcm9tIHN0YXJ0IG9mIHRoZSBmaXJzdCBgLnN1YnN0cmluZ2AgZm9ybVxuICAgICAgICA7OyB0byB0aGUgZW5kIG9mIHRoZSBgc3RyaW5nYCBmb3JtLlxuICAgICAgICAobWV0aG9kICh3aXRoLW1ldGEgYCgsYWdldCAsdGFyZ2V0IChxdW90ZSAsbWVtYmVyKSlcbiAgICAgICAgICAgICAgICAgKGNvbmogb3AtbWV0YVxuICAgICAgICAgICAgICAgICAgICAgICB7OmVuZCAoOmVuZCAobWV0YSB0YXJnZXQpKX0pKSkpXG4gICAgKGlmIChuaWw/IHRhcmdldClcbiAgICAgICh0aHJvdyAoRXJyb3IgXCJNYWxmb3JtZWQgbWV0aG9kIGV4cHJlc3Npb24sIGV4cGVjdGluZyAoLm1ldGhvZCBvYmplY3QgLi4uKVwiKSlcbiAgICAgIGAoLG1ldGhvZCAsQHBhcmFtcykpKSlcblxuKGRlZnVuIGZpZWxkLXN5bnRheFxuICAoZmllbGQgdGFyZ2V0ICZyZXN0IG1vcmUpXG4gIFwiRXhhbXBsZTpcbiAgJyguLWZpZWxkIG9iamVjdCkgPT4gJyhhZ2V0IG9iamVjdCAnZmllbGQpXCJcbiAgKGxldCogKChtZXRhZGF0YSAobWV0YSBmaWVsZCkpXG4gICAgICAgIChzdGFydCAoOnN0YXJ0IG1ldGFkYXRhKSlcbiAgICAgICAgKGVuZCAoOmVuZCBtZXRhZGF0YSkpXG4gICAgICAgIChtZW1iZXIgKHdpdGgtbWV0YSAoc3ltYm9sIChzdWJzIChuYW1lIGZpZWxkKSAyKSlcbiAgICAgICAgICAgICAgICAgKGNvbmogbWV0YWRhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgezpzdGFydCB7OmxpbmUgKDpsaW5lIHN0YXJ0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Y29sdW1uICgrICg6Y29sdW1uIHN0YXJ0KSAyKX19KSkpKVxuICAgIChpZiAob3IgKG5pbD8gdGFyZ2V0KVxuICAgICAgICAgICAgKGNvdW50IG1vcmUpKVxuICAgICAgKHRocm93IChFcnJvciBcIk1hbGZvcm1lZCBtZW1iZXIgZXhwcmVzc2lvbiwgZXhwZWN0aW5nICguLW1lbWJlciB0YXJnZXQpXCIpKVxuICAgICAgYChhZ2V0ICx0YXJnZXQgKHF1b3RlICxtZW1iZXIpKSkpKVxuXG4oZGVmdW4gZG90LXN5bnRheFxuICAob3AgdGFyZ2V0IGZpZWxkICZyZXN0IHBhcmFtcylcbiAgXCJFeGFtcGxlOlxuICAnKC4gb2JqZWN0IC1maWVsZCkgPT4gJyhhZ2V0IG9iamVjdCAnZmllbGQpXG4gICcoLiBzdHJpbmcgc3Vic3RyaW5nIDIgNSkgPT4gJygoYWdldCBzdHJpbmcgJ3N1YnN0cmluZykgMiA1KVwiXG4gIChpZi1ub3QgKHN5bWJvbD8gZmllbGQpXG4gICAgKHRocm93IChFcnJvciBcIk1hbGZvcm1lZCAuIGZvcm1cIikpKVxuICAobGV0KiAoKCpmaWVsZCAobmFtZSBmaWVsZCkpKVxuICAgIChhcHBseSAoaWYgKGlkZW50aWNhbD8gXFwtIChmaXJzdCAqZmllbGQpKSBmaWVsZC1zeW50YXggbWV0aG9kLXN5bnRheClcbiAgICAgICAgICAgKHN5bWJvbCAoc3RyIFxcLiAqZmllbGQpKSB0YXJnZXQgcGFyYW1zKSkpXG5cbihkZWZ1biBuZXctc3ludGF4XG4gIChvcCAmcmVzdCBwYXJhbXMpXG4gIFwiRXhhbXBsZTpcbiAgJyhQb2ludC4geCB5KSA9PiAnKG5ldyBQb2ludCB4IHkpXCJcbiAgKGxldCogKChpZCAobmFtZSBvcCkpXG4gICAgICAgIChpZC1tZXRhICg6bWV0YSBpZCkpXG4gICAgICAgIChyZW5hbWUgKHN1YnMgaWQgMCAoZGVjIChjb3VudCBpZCkpKSlcbiAgICAgICAgOzsgY29uc3RydWN0dXIgc3ltYm9sIGluaGVyaXRzIG1ldGFkYSBmcm9tIHRoZSBmaXJzdCBgb3BgIGZvcm1cbiAgICAgICAgOzsgaXQncyBqdXN0IGl0J3MgZW5kIGNvbHVtbiBpbmZvIGlzIHVwZGF0ZWQgdG8gcmVmbGVjdCBzdWJ0cmFjdGlvblxuICAgICAgICA7OyBvZiBgLmAgY2hhcmFjdGVyLlxuICAgICAgICAoY29uc3RydWN0b3IgKHdpdGgtbWV0YSAoc3ltYm9sIHJlbmFtZSlcbiAgICAgICAgICAgICAgICAgICAgICAoY29uaiBpZC1tZXRhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgezplbmQgezpsaW5lICg6bGluZSAoOmVuZCBpZC1tZXRhKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmNvbHVtbiAoZGVjICg6Y29sdW1uICg6ZW5kIGlkLW1ldGEpKSl9fSkpKVxuICAgICAgICAob3BlcmF0b3IgKHdpdGgtbWV0YSAnbmV3XG4gICAgICAgICAgICAgICAgICAgKGNvbmogaWQtbWV0YVxuICAgICAgICAgICAgICAgICAgICAgICAgIHs6c3RhcnQgezpsaW5lICg6bGluZSAoOmVuZCBpZC1tZXRhKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Y29sdW1uIChkZWMgKDpjb2x1bW4gKDplbmQgaWQtbWV0YSkpKX19KSkpKVxuICAgIGAobmV3ICxjb25zdHJ1Y3RvciAsQHBhcmFtcykpKVxuXG4oZGVmdW4ga2V5d29yZC1pbnZva2VcbiAgKGtleXdvcmQgdGFyZ2V0ICZyZXN0IGFyZ3MpXG4gIFwiQ2FsbGluZyBhIGtleXdvcmQgZGVzdWdhcnMgdG8gcHJvcGVydHkgYWNjZXNzIHdpdGggdGhhdFxuICBrZXl3b3JkIG5hbWUgb24gdGhlIGdpdmVuIGFyZ3VtZW50OlxuICAnKDpmb28gYmFyKSA9PiAnKGdldCBiYXIgOmZvbylcIlxuICAoaWYgKGVtcHR5PyBhcmdzKVxuICAgIGAoZ2V0ICx0YXJnZXQgLGtleXdvcmQpXG4gICAgYChnZXQgLHRhcmdldCAsa2V5d29yZCAsKGZpcnN0IGFyZ3MpKSkpXG5cbihkZWZ1bi0gZGVzdWdhclxuICAoZXhwYW5kZXIgZm9ybSlcbiAgKGxldCogKChkZXN1Z2FyZWQgKGFwcGx5IGV4cGFuZGVyICh2ZWMgZm9ybSkpKVxuICAgICAgICAobWV0YWRhdGEgKGNvbmoge30gKG1ldGEgZm9ybSkgKG1ldGEgZGVzdWdhcmVkKSkpKVxuICAgICh3aXRoLW1ldGEgZGVzdWdhcmVkIG1ldGFkYXRhKSkpXG5cbihkZWZ1biBtYWNyb2V4cGFuZC0xXG4gIChmb3JtIGVudilcbiAgXCJJZiBmb3JtIHJlcHJlc2VudHMgYSBtYWNybyBmb3JtLCByZXR1cm5zIGl0cyBleHBhbnNpb24sXG4gIGVsc2UgcmV0dXJucyBmb3JtLlwiXG4gIChsZXQqICgob3AgKGFuZCAobGlzdD8gZm9ybSlcbiAgICAgICAgICAgICAgICAoZmlyc3QgZm9ybSkpKVxuICAgICAgICAoZXhwYW5kZXIgKG1hY3JvIG9wKSkpXG4gICAgKGNvbmQgKGV4cGFuZGVyIChleHBhbmQgZXhwYW5kZXIgZm9ybSBlbnYpKVxuICAgICAgICAgIDs7IENhbGxpbmcgYSBrZXl3b3JkIGNvbXBpbGVzIHRvIGdldHRpbmcgdmFsdWUgZnJvbSBnaXZlblxuICAgICAgICAgIDs7IG9iamVjdCBhc3NvY2lhdGVkIHdpdGggdGhhdCBrZXk6XG4gICAgICAgICAgOzsgJyg6Zm9vIGJhcikgPT4gJyhnZXQgYmFyIDpmb28pXG4gICAgICAgICAgKChrZXl3b3JkPyBvcCkgKGRlc3VnYXIga2V5d29yZC1pbnZva2UgZm9ybSkpXG4gICAgICAgICAgOzsgJyguIG9iamVjdCBtZXRob2QgZm9vIGJhcikgPT4gJygoYWdldCBvYmplY3QgbWV0aG9kKSBmb28gYmFyKVxuICAgICAgICAgICgoZG90LXN5bnRheD8gb3ApIChkZXN1Z2FyIGRvdC1zeW50YXggZm9ybSkpXG4gICAgICAgICAgOzsgJyguLWZpZWxkIG9iamVjdCkgPT4gJyhhZ2V0IG9iamVjdCAnZmllbGQpXG4gICAgICAgICAgKChmaWVsZC1zeW50YXg/IG9wKSAoZGVzdWdhciBmaWVsZC1zeW50YXggZm9ybSkpXG4gICAgICAgICAgOzsgJyguc3Vic3RyaW5nIHN0cmluZyAyIDUpID0+ICcoKGFnZXQgc3RyaW5nICdzdWJzdHJpbmcpIDIgNSlcbiAgICAgICAgICAoKG1ldGhvZC1zeW50YXg/IG9wKSAoZGVzdWdhciBtZXRob2Qtc3ludGF4IGZvcm0pKVxuICAgICAgICAgIDs7ICcoUG9pbnQuIHggeSkgPT4gJyhuZXcgUG9pbnQgeCB5KVxuICAgICAgICAgICgobmV3LXN5bnRheD8gb3ApIChkZXN1Z2FyIG5ldy1zeW50YXggZm9ybSkpXG4gICAgICAgICAgKGVsc2UgZm9ybSkpKSlcblxuKGRlZnVuIG1hY3JvZXhwYW5kXG4gIChmb3JtIGVudilcbiAgXCJSZXBlYXRlZGx5IGNhbGxzIG1hY3JvZXhwYW5kLTEgb24gZm9ybSB1bnRpbCBpdCBubyBsb25nZXJcbiAgcmVwcmVzZW50cyBhIG1hY3JvIGZvcm0sIHRoZW4gcmV0dXJucyBpdC5cIlxuICAobG9vcCAoKG9yaWdpbmFsIGZvcm0pXG4gICAgICAgICAoZXhwYW5kZWQgKG1hY3JvZXhwYW5kLTEgZm9ybSBlbnYpKSlcbiAgICAoaWYgKGlkZW50aWNhbD8gb3JpZ2luYWwgZXhwYW5kZWQpXG4gICAgICBvcmlnaW5hbFxuICAgICAgKHJlY3VyIGV4cGFuZGVkIChtYWNyb2V4cGFuZC0xIGV4cGFuZGVkIGVudikpKSkpXG5cblxuOzsgRGVmaW5lIGNvcmUgbWFjcm9zXG5cblxuOzsgVE9ETyBtYWtlIHRoaXMgbGFuZ3VhZ2UgaW5kZXBlbmRlbnRcblxuKGRlZnVuIHN5bnRheC1xdW90ZSAoZm9ybSlcbiAgKGNvbmQgKChzeW1ib2w/IGZvcm0pIChsaXN0ICdxdW90ZSBmb3JtKSlcbiAgICAgICAgKChrZXl3b3JkPyBmb3JtKSAobGlzdCAncXVvdGUgZm9ybSkpXG4gICAgICAgICgob3IgKG51bWJlcj8gZm9ybSlcbiAgICAgICAgICAgIChzdHJpbmc/IGZvcm0pXG4gICAgICAgICAgICAoYm9vbGVhbj8gZm9ybSlcbiAgICAgICAgICAgIChuaWw/IGZvcm0pXG4gICAgICAgICAgICAocmUtcGF0dGVybj8gZm9ybSkpIGZvcm0pXG5cbiAgICAgICAgKCh1bnF1b3RlPyBmb3JtKSAoc2Vjb25kIGZvcm0pKVxuICAgICAgICAoKHVucXVvdGUtc3BsaWNpbmc/IGZvcm0pIChyZWFkZXItZXJyb3IgXCJJbGxlZ2FsIHVzZSBvZiBgLEBgIGV4cHJlc3Npb24sIGNhbiBvbmx5IGJlIHByZXNlbnQgaW4gYSBsaXN0XCIpKVxuXG4gICAgICAgICgoZW1wdHk/IGZvcm0pIGZvcm0pXG5cbiAgICAgICAgOztcbiAgICAgICAgKChkaWN0aW9uYXJ5PyBmb3JtKSAobGlzdCAnYXBwbHlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdkaWN0aW9uYXJ5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoY29ucyAnLmNvbmNhdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHNlcXVlbmNlLWV4cGFuZCAoYXBwbHkgY29uY2F0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoc2VxIGZvcm0pKSkpKSlcbiAgICAgICAgOzsgSWYgYSB2ZWN0b3IgZm9ybSBleHBhbmQgYWxsIHN1Yi1mb3JtcyBhbmQgY29uY2F0ZW5hdGVcbiAgICAgICAgOzsgdGhlbSB0b2dldGhlcjpcbiAgICAgICAgOztcbiAgICAgICAgOzsgWyxhIGIgLEBjXSAtPiAoLmNvbmNhdCBbYV0gWyhxdW90ZSBiKV0gYylcbiAgICAgICAgKCh2ZWN0b3I/IGZvcm0pIChjb25zICcuY29uY2F0IChzZXF1ZW5jZS1leHBhbmQgZm9ybSkpKVxuXG4gICAgICAgIDs7IElmIGEgbGlzdCBmb3JtIGV4cGFuZCBhbGwgdGhlIHN1Yi1mb3JtcyBhbmQgYXBwbHlcbiAgICAgICAgOzsgY29uY2F0ZW5hdGlvbiB0byBhIGxpc3QgY29uc3RydWN0b3I6XG4gICAgICAgIDs7XG4gICAgICAgIDs7ICgsYSBiICxAYykgLT4gKGFwcGx5IGxpc3QgKC5jb25jYXQgW2FdIFsocXVvdGUgYildIGMpKVxuICAgICAgICAoKGxpc3Q/IGZvcm0pIChpZiAoZW1wdHk/IGZvcm0pXG4gICAgICAgICAgICAgICAgICAgICAgIChjb25zICdsaXN0IG5pbClcbiAgICAgICAgICAgICAgICAgICAgICAgKGxpc3QgJ2FwcGx5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICdsaXN0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIChjb25zICcuY29uY2F0IChzZXF1ZW5jZS1leHBhbmQgZm9ybSkpKSkpXG5cbiAgICAgICAgKGVsc2UgKHJlYWRlci1lcnJvciBcIlVua25vd24gQ29sbGVjdGlvbiB0eXBlXCIpKSkpXG4oZGVmdmFyIHN5bnRheC1xdW90ZS1leHBhbmQgc3ludGF4LXF1b3RlKVxuXG4oZGVmdW4gdW5xdW90ZS1zcGxpY2luZy1leHBhbmRcbiAgKGZvcm0pXG4gIChpZiAodmVjdG9yPyBmb3JtKVxuICAgIGZvcm1cbiAgICAobGlzdCAndmVjIGZvcm0pKSlcblxuKGRlZnVuIHNlcXVlbmNlLWV4cGFuZFxuICAoZm9ybXMpXG4gIFwiVGFrZXMgc2VxdWVuY2Ugb2YgZm9ybXMgYW5kIGV4cGFuZHMgdGhlbTpcblxuICAoKHVucXVvdGUgYSkpIC0+IChbYV0pXG4gICgodW5xdW90ZS1zcGxpY2luZyBhKSkgLT4gKGEpXG4gIChhKSAtPiAoWyhxdW90ZSBiKV0pXG4gICgodW5xdW90ZSBhKSBiICh1bnF1b3RlLXNwbGljaW5nIGEpKSAtPiAoW2FdIFsocXVvdGUgYildIGMpXCJcbiAgKG1hcCAobGFtYmRhIChmb3JtKVxuICAgICAgICAgKGNvbmQgKCh1bnF1b3RlPyBmb3JtKSBbKHNlY29uZCBmb3JtKV0pXG4gICAgICAgICAgICAgICAoKHVucXVvdGUtc3BsaWNpbmc/IGZvcm0pICh1bnF1b3RlLXNwbGljaW5nLWV4cGFuZCAoc2Vjb25kIGZvcm0pKSlcbiAgICAgICAgICAgICAgIChlbHNlIFsoc3ludGF4LXF1b3RlLWV4cGFuZCBmb3JtKV0pKSlcbiAgICAgICBmb3JtcykpXG4oaW5zdGFsbC1tYWNybyEgOnN5bnRheC1xdW90ZSBzeW50YXgtcXVvdGUtZXhwYW5kKVxuXG47OyBUT0RPOiBOZXcgcmVhZGVyIHRyYW5zbGF0ZXMgbm90PSBjb3JyZWN0bHlcbjs7IGJ1dCBmb3IgdGhlIHRpbWUgYmVpbmcgdXNlIG5vdC1lcXVhbCBuYW1lXG4oZGVmdW4gZXhwYW5kLW5vdC1lcXVhbFxuICAoJnJlc3QgYm9keSlcbiAgYChub3QgKD0gLEBib2R5KSkpXG4oaW5zdGFsbC1tYWNybyEgOm5vdD0gZXhwYW5kLW5vdC1lcXVhbClcblxuKGRlZnVuIGV4cGFuZC1pZi1ub3RcbiAgKGNvbmRpdGlvbiB0cnV0aHkgYWx0ZXJuYXRpdmUpXG4gIFwiQ29tcGxlbWVudHMgdGhlIGBpZmAgZXhjbHVzaXZlIGNvbmRpdGlvbmFsIGJyYW5jaC5cIlxuICBgKGlmIChub3QgLGNvbmRpdGlvbikgLHRydXRoeSAsYWx0ZXJuYXRpdmUpKVxuKGluc3RhbGwtbWFjcm8hIDppZi1ub3QgZXhwYW5kLWlmLW5vdClcblxuKGRlZnVuIGV4cGFuZC1jb21tZW50XG4gICgmcmVzdCBib2R5KVxuICBcIklnbm9yZXMgYm9keSwgeWllbGRzIG5pbFwiXG4gIG5pbClcbihpbnN0YWxsLW1hY3JvISA6Y29tbWVudCBleHBhbmQtY29tbWVudClcblxuKGRlZnVuIGV4cGFuZC10aHJlYWQtZmlyc3RcbiAgKCZyZXN0IG9wZXJhdGlvbnMpXG4gIFwiVGhyZWFkIGZpcnN0IG1hY3JvXCJcbiAgKHJlZHVjZVxuICAgIChsYW1iZGEgKGZvcm0gb3BlcmF0aW9uKVxuICAgICAgKGNvbnMgKGZpcnN0IG9wZXJhdGlvbilcbiAgICAgICAgICAgIChjb25zIGZvcm0gKHJlc3Qgb3BlcmF0aW9uKSkpKVxuICAgIChmaXJzdCBvcGVyYXRpb25zKVxuICAgIChtYXAgKGxhbWJkYSAoJSkgKGlmIChsaXN0PyAlKSAlIGAoLCUpKSlcbiAgICAgICAgIChyZXN0IG9wZXJhdGlvbnMpKSkpXG4oaW5zdGFsbC1tYWNybyEgOi0+IGV4cGFuZC10aHJlYWQtZmlyc3QpXG5cbihkZWZ1biBleHBhbmQtdGhyZWFkLWxhc3RcbiAgKCZyZXN0IG9wZXJhdGlvbnMpXG4gIFwiVGhyZWFkIGxhc3QgbWFjcm9cIlxuICAocmVkdWNlXG4gICAgKGxhbWJkYSAoZm9ybSBvcGVyYXRpb24pIChjb25jYXQgb3BlcmF0aW9uIFtmb3JtXSkpXG4gICAgKGZpcnN0IG9wZXJhdGlvbnMpXG4gICAgKG1hcCAobGFtYmRhICglKSAoaWYgKGxpc3Q/ICUpICUgYCgsJSkpKVxuICAgICAgICAgKHJlc3Qgb3BlcmF0aW9ucykpKSlcbihpbnN0YWxsLW1hY3JvISA6LT4+IGV4cGFuZC10aHJlYWQtbGFzdClcblxuKGRlZnVuIGV4cGFuZC1kb3RzXG4gICh4ICZyZXN0IGZvcm1zKVxuICBcImZvcm0gPT4gZmllbGROYW1lLXN5bWJvbCBvciAoaW5zdGFuY2VNZXRob2ROYW1lLXN5bWJvbCBhcmdzKilcbiAgRXhwYW5kcyBpbnRvIGEgbWVtYmVyIGFjY2VzcyAoLikgb2YgdGhlIGZpcnN0IG1lbWJlciBvbiB0aGUgZmlyc3RcbiAgYXJndW1lbnQsIGZvbGxvd2VkIGJ5IHRoZSBuZXh0IG1lbWJlciBvbiB0aGUgcmVzdWx0LCBldGMuIEZvclxuICBpbnN0YW5jZTpcbiAgKC4uIGRvY3VtZW50IC1ib2R5IChnZXQtYXR0cmlidXRlIDpjbGFzcykpXG4gIGV4cGFuZHMgdG86XG4gICguICguIGRvY3VtZW50IC1ib2R5KSBnZXQtYXR0cmlidXRlIDpjbGFzcylcbiAgYnV0IGlzIGVhc2llciB0byB3cml0ZSwgcmVhZCwgYW5kIHVuZGVyc3RhbmQuXCJcbiAgYCgtPiAseCAsQChtYXAgKGxhbWJkYSAoJSkgKGlmIChsaXN0PyAlKSAoY29ucyAnLiAlKSAobGlzdCAnLiAlKSkpXG4gICAgICAgICAgICAgICAgIGZvcm1zKSkpXG4oaW5zdGFsbC1tYWNybyEgOi4uIGV4cGFuZC1kb3RzKVxuXG4oZGVmdW4gZXhwYW5kLXRocmVhZC1hc1xuICAoZXhwciBuYW1lICZyZXN0IGZvcm1zKVxuICBcIkJpbmRzIG5hbWUgdG8gZXhwciwgZXZhbHVhdGVzIHRoZSBmaXJzdCBmb3JtIGluIHRoZSBsZXhpY2FsIGNvbnRleHRcbiAgb2YgdGhhdCBiaW5kaW5nLCB0aGVuIGJpbmRzIG5hbWUgdG8gdGhhdCByZXN1bHQsIHJlcGVhdGluZyBmb3IgZWFjaFxuICBzdWNjZXNzaXZlIGZvcm0sIHJldHVybmluZyB0aGUgcmVzdWx0IG9mIHRoZSBsYXN0IGZvcm0uXCJcbiAgYChsZXQqKiBbLG5hbWUgLGV4cHJcbiAgICAgICAgICAgLEAobWFwY2F0IChsYW1iZGEgKGZvcm0pIFtuYW1lIGZvcm1dKVxuICAgICAgICAgICAgICAgICAgICAgZm9ybXMpXVxuICAgICAsbmFtZSkpXG4oaW5zdGFsbC1tYWNybyEgOmFzLT4gZXhwYW5kLXRocmVhZC1hcylcblxuXG4oZGVmdW4gZXhwYW5kLWNvbmRcbiAgKCZyZXN0IGNsYXVzZXMpXG4gIFwiVGFrZXMgYSBzZXQgb2YgKHRlc3QgYm9keSopIHBhcmVuIGNsYXVzZXMuIEl0IGV2YWx1YXRlcyBlYWNoIHRlc3RcbiAgb25lIGF0IGEgdGltZS4gIElmIGEgdGVzdCByZXR1cm5zIGxvZ2ljYWwgdHJ1ZSwgY29uZCBldmFsdWF0ZXMgYW5kXG4gIHJldHVybnMgdGhlIHZhbHVlIG9mIHRoZSBjb3JyZXNwb25kaW5nIGJvZHkgKGFuIGltcGxpY2l0IHByb2duKSBhbmRcbiAgZG9lc24ndCBldmFsdWF0ZSBhbnkgb2YgdGhlIG90aGVyIHRlc3RzIG9yIGJvZGllcy4gVGhlIGJhcmUgc3ltYm9sXG4gIGBlbHNlYCBpcyB0aGUgY2F0Y2gtYWxsIGNsYXVzZS4gKGNvbmQpIHJldHVybnMgbmlsLlwiXG4gIChpZiAobm90IChlbXB0eT8gY2xhdXNlcykpXG4gICAgKGxldCogKChjbGF1c2UgKGZpcnN0IGNsYXVzZXMpKSAodGVzdCAoZmlyc3QgY2xhdXNlKSkgKGJvZHkgKHJlc3QgY2xhdXNlKSkpXG4gICAgICAoaWYgKD0gdGVzdCAnZWxzZSlcbiAgICAgICAgYChwcm9nbiAsQGJvZHkpXG4gICAgICAgIGAoaWYgLHRlc3QgKHByb2duICxAYm9keSkgKGNvbmQgLEAocmVzdCBjbGF1c2VzKSkpKSkpKVxuKGluc3RhbGwtbWFjcm8hIDpjb25kIGV4cGFuZC1jb25kKVxuXG4oZGVmdW4gZXhwYW5kLWNhc2VcbiAgKGUgJnJlc3QgY2xhdXNlcylcbiAgXCJUYWtlcyBhbiBleHByZXNzaW9uLCBhbmQgYSBzZXQgb2YgKHRlc3QtY29uc3RhbnQgYm9keSopIHBhcmVuXG4gIGNsYXVzZXMsIG9yICgodGVzdC1jb25zdGFudDEgLi4uIHRlc3QtY29uc3RhbnROKSBib2R5KikgdG8gZ3JvdXBcbiAgc2V2ZXJhbCBjb25zdGFudHMgdW5kZXIgb25lIGJvZHkuIFRoZSBiYXJlIHN5bWJvbCBgZWxzZWAgaXMgdGhlXG4gIGNhdGNoLWFsbCBjbGF1c2UuIFRlc3QtY29uc3RhbnRzIGFyZSBub3QgZXZhbHVhdGVkIC0tIHRoZXkgbXVzdCBiZVxuICBjb21waWxlLXRpbWUgbGl0ZXJhbHMgYW5kIG5lZWQgbm90IGJlIHF1b3RlZC4gSWYgbm8gY2xhdXNlIG1hdGNoZXNcbiAgYW5kIG5vIGBlbHNlYCBjbGF1c2Ugd2FzIGdpdmVuLCBhbiBFcnJvciBpcyB0aHJvd24uXG5cbiAgVW5saWtlIGNvbmQvY29uZHAsIGNhc2UncyBkaXNwYXRjaCBpcyBub3QgZXZhbHVhdGVkIHNlcXVlbnRpYWxseSBhdFxuICBydW50aW1lIGhlcmUgKGl0J3Mgc3RpbGwgbG93ZXJlZCB0byBhIGBjb25kYCBjaGFpbiBmb3Igbm93IC0tIGFcbiAgY29uc3RhbnQtdGltZSBkaXNwYXRjaCBpcyBhbiBvcHRpbWlzYXRpb24sIG5vdCBhIHNlbWFudGljXG4gIHJlcXVpcmVtZW50IG9mIHRoZSBzcGVjKS5cblxuICBEZXBlbmRzIG9uID1cIlxuICAobGV0KiAoKHN5bSAoaWYgKHN5bWJvbD8gZSkgZSAoZ2Vuc3ltIDpjYXNlLWJpbmRpbmcpKSlcbiAgICAgICAgKGVxKiAobGFtYmRhIChjKSBgKD0gLHN5bSAnLGMpKSkpXG4gICAgKGxvb3AgKChwYWlycyBjbGF1c2VzKSAoY29uZHMgW10pKVxuICAgICAgKGlmIChlbXB0eT8gcGFpcnMpXG4gICAgICAgIChsZXQqICgoY29uZHMgKGlmIChzb21lIChsYW1iZGEgKCUpICg9IChmaXJzdCAlKSAnZWxzZSkpIGNvbmRzKVxuICAgICAgICAgICAgICAgICAgICAgIGNvbmRzXG4gICAgICAgICAgICAgICAgICAgICAgKGNvbmogY29uZHMgKGxpc3QgJ2Vsc2UgYCh0aHJvdyAoRXJyb3IgKHN0ciBcIk5vIG1hdGNoaW5nIGNsYXVzZTogXCIgLHN5bSkpKSkpKSlcbiAgICAgICAgICAgICAgKHJlc3VsdCAoY29ucyAnY29uZCBjb25kcykpKVxuICAgICAgICAgIChpZiAoPSBlIHN5bSkgcmVzdWx0IGAobGV0KiAoKCxzeW0gLGUpKSAscmVzdWx0KSkpXG4gICAgICAgIChsZXQqICgoeCAoZmlyc3QgcGFpcnMpKSAoeHMgKHJlc3QgcGFpcnMpKSAoY29uc3RzIChmaXJzdCB4KSkgKGJvZHkgKHJlc3QgeCkpKVxuICAgICAgICAgIChyZWN1ciB4cyAoY29uaiBjb25kc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAoaWYgKD0gY29uc3RzICdlbHNlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChjb25zICdlbHNlIGJvZHkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGNvbnMgKGlmLW5vdCAobGlzdD8gY29uc3RzKSAoZXEqIGNvbnN0cykgYChvciAsQChtYXAgZXEqIGNvbnN0cykpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvZHkpKSkpKSkpKSlcbihpbnN0YWxsLW1hY3JvISA6Y2FzZSBleHBhbmQtY2FzZSlcblxuKGRlZnVuIGV4cGFuZC1jb25kcFxuICAocHJlZCBleHByICZyZXN0IGNsYXVzZXMpXG4gIFwiVGFrZXMgYSBiaW5hcnkgcHJlZGljYXRlLCBhbiBleHByZXNzaW9uLCBhbmQgYSBzZXQgb2YgY2xhdXNlcy5cbiAgRWFjaCBjbGF1c2UgY2FuIHRha2UgdGhlIGZvcm0gb2YgZWl0aGVyOlxuXG4gIHRlc3QtZXhwciByZXN1bHQtZXhwclxuICB0ZXN0LWV4cHIgOj4+IHJlc3VsdC1mblxuXG4gIE5vdGUgOj4+IGlzIGFuIG9yZGluYXJ5IGtleXdvcmQuXG5cbiAgRm9yIGVhY2ggY2xhdXNlLCAocHJlZCB0ZXN0LWV4cHIgZXhwcikgaXMgZXZhbHVhdGVkLiBJZiBpdCByZXR1cm5zXG4gIGxvZ2ljYWwgdHJ1ZSwgdGhlIGNsYXVzZSBpcyBhIG1hdGNoLiBJZiBhIGJpbmFyeSBjbGF1c2UgbWF0Y2hlcywgdGhlXG4gIHJlc3VsdC1leHByIGlzIHJldHVybmVkLCBpZiBhIHRlcm5hcnkgY2xhdXNlIG1hdGNoZXMsIGl0cyByZXN1bHQtZm4sXG4gIHdoaWNoIG11c3QgYmUgYSB1bmFyeSBmdW5jdGlvbiwgaXMgY2FsbGVkIHdpdGggdGhlIHJlc3VsdCBvZiB0aGVcbiAgcHJlZGljYXRlIGFzIGl0cyBhcmd1bWVudCwgdGhlIHJlc3VsdCBvZiB0aGF0IGNhbGwgYmVpbmcgdGhlIHJldHVyblxuICB2YWx1ZSBvZiBjb25kcC4gQSBzaW5nbGUgZGVmYXVsdCBleHByZXNzaW9uIGNhbiBmb2xsb3cgdGhlIGNsYXVzZXMsXG4gIGFuZCBpdHMgdmFsdWUgd2lsbCBiZSByZXR1cm5lZCBpZiBubyBjbGF1c2UgbWF0Y2hlcy4gSWYgbm8gZGVmYXVsdFxuICBleHByZXNzaW9uIGlzIHByb3ZpZGVkIGFuZCBubyBjbGF1c2UgbWF0Y2hlcywgYW4gRXJyb3IgaXMgdGhyb3duLlwiXG4gIChsZXQqICgoc3ltKiAgICAoZ2Vuc3ltIDpjb25kcC1iaW5kaW5nKSlcbiAgICAgICAgKHN5bSAgICAgKGlmIChzeW1ib2w/IGV4cHIpIGV4cHIgc3ltKikpXG4gICAgICAgIChjb21wYXJlIChsYW1iZGEgKHgpIGAoLHByZWQgLHggLHN5bSkpKVxuICAgICAgICAoc3BsaXRzICAobGFtYmRhIHNwbGl0cyAoeHMpXG4gICAgICAgICAgICAgICAgICAoY29uZCAoKGVtcHR5PyB4cykgICAgICAgICAgYCh0aHJvdyAoRXJyb3IgKHN0ciBcIk5vIG1hdGNoaW5nIGNsYXVzZTogXCIgLHN5bSkpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICgoPSAxIChjb3VudCB4cykpICAgICAoZmlyc3QgeHMpKVxuICAgICAgICAgICAgICAgICAgICAgICAgKCg9ICc6Pj4gKHNlY29uZCB4cykpIGAoaWYtbGV0IFssc3ltKiAsKGNvbXBhcmUgKGZpcnN0IHhzKSldXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoLCh0aGlyZCB4cykgLHN5bSopXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAsKHNwbGl0cyAoZHJvcCAzIHhzKSkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgKGVsc2UgICAgICAgICAgICAgICAgYChpZiAsKGNvbXBhcmUgKGZpcnN0IHhzKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICwoc2Vjb25kIHhzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLChzcGxpdHMgKGRyb3AgMiB4cykpKSkpKSkpXG4gICAgKGlmICg9IHN5bSBleHByKVxuICAgICAgKHNwbGl0cyBjbGF1c2VzKVxuICAgICAgYChsZXQqKiBbLHN5bSAsZXhwcl0gLChzcGxpdHMgY2xhdXNlcykpKSkpXG4oaW5zdGFsbC1tYWNybyEgOmNvbmRwIGV4cGFuZC1jb25kcClcblxuXG4oZGVmdW4tICp0aHJlYWQgKGluc2VydCBzeW0gdGVzdCBmb3JtKVxuICAobGV0KiAoKGZvcm0gKGlmIChsaXN0PyBmb3JtKSBmb3JtIChsaXN0IGZvcm0pKSkpXG4gICAgYChpZiAsdGVzdFxuICAgICAgICxzeW1cbiAgICAgICAsKGluc2VydCBzeW0gZm9ybSkpKSlcblxuKGRlZnVuLSAqY29uZC10aHJlYWQgKGV4cHIgY2xhdXNlcyBpbnNlcnQpXG4gIChsZXQqICgoc3ltIChnZW5zeW0gOmNvbmQtdGhyZWFkLWJpbmRpbmcpKSlcbiAgICBgKGFzLT4gLGV4cHIgLHN5bVxuICAgICAgICAgICAsQChtYXAgKGxhbWJkYSAoJSkgKCp0aHJlYWQgaW5zZXJ0IHN5bSBgKG5vdCAsKGZpcnN0ICUpKSAoc2Vjb25kICUpKSlcbiAgICAgICAgICAgICAgICAgIChwYXJ0aXRpb24gMiBjbGF1c2VzKSkpKSlcblxuKGRlZnVuIGV4cGFuZC1jb25kLXRocmVhZC1maXJzdFxuICAoZXhwciAmcmVzdCBjbGF1c2VzKVxuICBcIlRha2VzIGFuIGV4cHJlc3Npb24gYW5kIGEgc2V0IG9mIHRlc3QvZm9ybSBwYWlycy4gVGhyZWFkcyBleHByICh2aWEgLT4pXG4gIHRocm91Z2ggZWFjaCBmb3JtIGZvciB3aGljaCB0aGUgY29ycmVzcG9uZGluZyB0ZXN0XG4gIGV4cHJlc3Npb24gaXMgdHJ1ZS4gTm90ZSB0aGF0LCB1bmxpa2UgY29uZCBicmFuY2hpbmcsIGNvbmQtPiB0aHJlYWRpbmcgZG9lc1xuICBub3Qgc2hvcnQgY2lyY3VpdCBhZnRlciB0aGUgZmlyc3QgdHJ1ZSB0ZXN0IGV4cHJlc3Npb24uXCJcbiAgKCpjb25kLXRocmVhZCBleHByIGNsYXVzZXMgKGxhbWJkYSAoc3ltIGZvcm0pIChhcHBseSBsaXN0IChmaXJzdCBmb3JtKSBzeW0gKHZlYyAocmVzdCBmb3JtKSkpKSkpXG4oaW5zdGFsbC1tYWNybyEgOmNvbmQtPiBleHBhbmQtY29uZC10aHJlYWQtZmlyc3QpXG5cbihkZWZ1biBleHBhbmQtY29uZC10aHJlYWQtbGFzdFxuICAoZXhwciAmcmVzdCBjbGF1c2VzKVxuICBcIlRha2VzIGFuIGV4cHJlc3Npb24gYW5kIGEgc2V0IG9mIHRlc3QvZm9ybSBwYWlycy4gVGhyZWFkcyBleHByICh2aWEgLT4+KVxuICB0aHJvdWdoIGVhY2ggZm9ybSBmb3Igd2hpY2ggdGhlIGNvcnJlc3BvbmRpbmcgdGVzdCBleHByZXNzaW9uXG4gIGlzIHRydWUuICBOb3RlIHRoYXQsIHVubGlrZSBjb25kIGJyYW5jaGluZywgY29uZC0+PiB0aHJlYWRpbmcgZG9lcyBub3Qgc2hvcnQgY2lyY3VpdFxuICBhZnRlciB0aGUgZmlyc3QgdHJ1ZSB0ZXN0IGV4cHJlc3Npb24uXCJcbiAgKCpjb25kLXRocmVhZCBleHByIGNsYXVzZXMgKGxhbWJkYSAoc3ltIGZvcm0pIChhcHBseSBsaXN0ICh2ZWMgKGNvbmNhdCBmb3JtIFtzeW1dKSkpKSkpXG4oaW5zdGFsbC1tYWNybyEgOmNvbmQtPj4gZXhwYW5kLWNvbmQtdGhyZWFkLWxhc3QpXG5cblxuKGRlZnVuLSAqc29tZS10aHJlYWQgKGV4cHIgZm9ybXMgaW5zZXJ0KVxuICAobGV0KiAoKHN5bSAoZ2Vuc3ltIDpzb21lLXRocmVhZC1iaW5kaW5nKSkpXG4gICAgYChhcy0+ICxleHByICxzeW1cbiAgICAgICAgICAgLEAobWFwIChsYW1iZGEgKCUpICgqdGhyZWFkIGluc2VydCBzeW0gYChuaWw/ICxzeW0pICUpKVxuICAgICAgICAgICAgICAgICAgZm9ybXMpKSkpXG5cbihkZWZ1biBleHBhbmQtc29tZS10aHJlYWQtZmlyc3RcbiAgKGV4cHIgJnJlc3QgZm9ybXMpXG4gIFwiV2hlbiBleHByIGlzIG5vdCBuaWwsIHRocmVhZHMgaXQgaW50byB0aGUgZmlyc3QgZm9ybSAodmlhIC0+KSxcbiAgYW5kIHdoZW4gdGhhdCByZXN1bHQgaXMgbm90IG5pbCwgdGhyb3VnaCB0aGUgbmV4dCBldGNcblxuICBEZXBlbmRzIG9uIG5pbD9cIlxuICAoKnNvbWUtdGhyZWFkIGV4cHIgZm9ybXMgKGxhbWJkYSAoc3ltIGZvcm0pIChhcHBseSBsaXN0IChmaXJzdCBmb3JtKSBzeW0gKHZlYyAocmVzdCBmb3JtKSkpKSkpXG4oaW5zdGFsbC1tYWNybyEgOnNvbWUtPiBleHBhbmQtc29tZS10aHJlYWQtZmlyc3QpXG5cbihkZWZ1biBleHBhbmQtc29tZS10aHJlYWQtbGFzdFxuICAoZXhwciAmcmVzdCBmb3JtcylcbiAgXCJXaGVuIGV4cHIgaXMgbm90IG5pbCwgdGhyZWFkcyBpdCBpbnRvIHRoZSBmaXJzdCBmb3JtICh2aWEgLT4+KSxcbiAgYW5kIHdoZW4gdGhhdCByZXN1bHQgaXMgbm90IG5pbCwgdGhyb3VnaCB0aGUgbmV4dCBldGNcblxuICBEZXBlbmRzIG9uIG5pbD9cIlxuICAoKnNvbWUtdGhyZWFkIGV4cHIgZm9ybXMgKGxhbWJkYSAoc3ltIGZvcm0pIChhcHBseSBsaXN0ICh2ZWMgKGNvbmNhdCBmb3JtIFtzeW1dKSkpKSkpXG4oaW5zdGFsbC1tYWNybyEgOnNvbWUtPj4gZXhwYW5kLXNvbWUtdGhyZWFkLWxhc3QpXG5cblxuKGRlZnVuLSBidWlsZC1kZWZ1blxuICAocHJpdmF0ZSAmZm9ybSBuYW1lIHBhcmFtcyBkb2MrYm9keSlcbiAgXCJTaGFyZWQgaW1wbGVtZW50YXRpb24gb2YgYGRlZnVuYC9gZGVmdW4tYDogKGRlZnZhciBpZCAobGFtYmRhIGlkXG4gIHBhcmFtcyogYm9keSopKSwgZm9sZGluZyBhbiBvcHRpb25hbCBkb2Mtc3RyaW5nIGludG8gdGhlIGlkJ3NcbiAgbWV0YWRhdGEgc28gaXQgbmV2ZXIgcmVhY2hlcyB0aGUgZW1pdHRlZCBib2R5IGFzIGEgZGVhZCBleHByZXNzaW9uXG4gIHN0YXRlbWVudC4gYHByaXZhdGVgIHBpY2tzIGBkZWZ2YXJgIHZzIGBkZWZ2YXItYCAtLSBuZXctc3ludGF4IGhhc1xuICBubyBgXjpwcml2YXRlYCByZWFkZXIgbWV0YWRhdGEsIHNvIHByaXZhY3kgaXMgbm93IHNpZ25hbGxlZCBwdXJlbHlcbiAgYnkgd2hpY2ggbWFjcm8gbmFtZSB3YXMgdXNlZC5cblxuICBVbmxpa2UgQ2xvanVyZS13aXNwJ3MgYGRlZm5gIChuYW1lIGRvYz8gYXR0ci1tYXA/IFtwYXJhbXNdIGJvZHkqKSxcbiAgbmV3LXN5bnRheCBwdXRzIHRoZSBwYXJhbSBsaXN0IHJpZ2h0IGFmdGVyIHRoZSBuYW1lIChFbWFjcyBMaXNwXG4gIG9yZGVyKTogKGRlZnVuIG5hbWUgKHBhcmFtcyopIGRvYz8gYm9keSopIC0tIHNvIHRoZSBkb2NzdHJpbmcsIHdoZW5cbiAgcHJlc2VudCwgaXMgdGhlIGZpcnN0IGVsZW1lbnQgb2YgYm9keSwgbm90IHRoZSBsYXN0IGVsZW1lbnQgYmVmb3JlXG4gIGl0LlwiXG4gIChsZXQqICgoZG9jIChpZiAoYW5kIChzdHJpbmc/IChmaXJzdCBkb2MrYm9keSkpIChub3QgKGVtcHR5PyAocmVzdCBkb2MrYm9keSkpKSlcbiAgICAgICAgICAgICAgKGZpcnN0IGRvYytib2R5KSkpXG5cbiAgICAgICAgOzsgSWYgZG9jc3RyaW5nIGlzIGZvdW5kIGl0J3Mgbm90IHBhcnQgb2YgYm9keS5cbiAgICAgICAgKGJvZHkgKGlmIGRvYyAocmVzdCBkb2MrYm9keSkgZG9jK2JvZHkpKVxuXG4gICAgICAgIDs7IENvbWJpbmUgdGhlIGRvYyBtZXRhZGF0YSBhbmQgYWRkIHRvIGEgbmFtZS5cbiAgICAgICAgKGlkICh3aXRoLW1ldGEgbmFtZSAoY29uaiAob3IgKG1ldGEgbmFtZSkge30pIHs6ZG9jIGRvY30pKSlcblxuICAgICAgICAoZm4gKHdpdGgtbWV0YSBgKGxhbWJkYSAsaWQgLHBhcmFtcyAsQGJvZHkpIChtZXRhICZmb3JtKSkpXG4gICAgICAgIChkZWYtb3AgKGlmIHByaXZhdGUgJ2RlZnZhci0gJ2RlZnZhcikpKVxuICAgIChsaXN0IGRlZi1vcCBpZCBmbikpKVxuXG4oZGVmdW4gZXhwYW5kLWRlZnVuXG4gICgmZm9ybSBuYW1lIHBhcmFtcyAmcmVzdCBkb2MrYm9keSlcbiAgXCIoZGVmdW4gbmFtZSAocGFyYW1zKikgZG9jPyBleHBycyopID0+IChkZWZ2YXIgbmFtZSAobGFtYmRhIG5hbWUgcGFyYW1zKiBleHBycyopKVwiXG4gIChidWlsZC1kZWZ1biBmYWxzZSAmZm9ybSBuYW1lIHBhcmFtcyBkb2MrYm9keSkpXG4oaW5zdGFsbC1tYWNybyEgOmRlZnVuICh3aXRoLW1ldGEgZXhwYW5kLWRlZnVuIHs6aW1wbGljaXQgWzomZm9ybV19KSlcblxuKGRlZnVuIGV4cGFuZC1kZWZ1bi1cbiAgKCZmb3JtIG5hbWUgcGFyYW1zICZyZXN0IGRvYytib2R5KVxuICBcIlNhbWUgYXMgYGRlZnVuYCBidXQgbm90IGV4cG9ydGVkIChzZWUgYGJ1aWxkLWRlZnVuYCkuXCJcbiAgKGJ1aWxkLWRlZnVuIHRydWUgJmZvcm0gbmFtZSBwYXJhbXMgZG9jK2JvZHkpKVxuKGluc3RhbGwtbWFjcm8hIDpkZWZ1bi0gKHdpdGgtbWV0YSBleHBhbmQtZGVmdW4tIHs6aW1wbGljaXQgWzomZm9ybV19KSlcblxuKGRlZnVuIGV4cGFuZC1kZWZjb25zdFxuICAobmFtZSB2YWx1ZSlcbiAgXCIoZGVmY29uc3QgbmFtZSB2YWx1ZSkgLS0gbWF5IGZvbGQgaW50byBgZGVmdmFyLWAvYGRlZnZhcmAgbGF0ZXI7IGZvclxuICBub3cgYSB0aGluIGFsaWFzIHdpdGggbm8gcmVhc3NpZ25tZW50LXByZXZlbnRpb24gc2VtYW50aWNzLlwiXG4gIGAoZGVmdmFyICxuYW1lICx2YWx1ZSkpXG4oaW5zdGFsbC1tYWNybyEgOmRlZmNvbnN0IGV4cGFuZC1kZWZjb25zdClcblxuKGRlZnVuIGV4cGFuZC1kZWZjb25zdC1cbiAgKG5hbWUgdmFsdWUpXG4gIGAoZGVmdmFyLSAsbmFtZSAsdmFsdWUpKVxuKGluc3RhbGwtbWFjcm8hIDpkZWZjb25zdC0gZXhwYW5kLWRlZmNvbnN0LSlcblxuKGRlZnVuIGV4cGFuZC1zZXRxXG4gIChwbGFjZSB2YWx1ZSlcbiAgXCIoc2V0cSBwbGFjZSB2YWx1ZSkgLS0gcmViaW5kIGEgYmluZGluZy4gYHNldCFgIGFscmVhZHkgaGFuZGxlcyBib3RoXG4gIHN5bWJvbCBhbmQgcGxhY2UgKGxpc3QpIHRhcmdldHMsIHNvIGBzZXRxYC9gc2V0ZmAgYXJlIGJvdGggcGxhaW5cbiAgYWxpYXNlcyBmb3IgaXQuXCJcbiAgYChzZXQhICxwbGFjZSAsdmFsdWUpKVxuKGluc3RhbGwtbWFjcm8hIDpzZXRxIGV4cGFuZC1zZXRxKVxuXG4oZGVmdW4gZXhwYW5kLXNldGZcbiAgKHBsYWNlIHZhbHVlKVxuICBcIihzZXRmIHBsYWNlIHZhbHVlKSAtLSBhc3NpZ24gYSBwbGFjZTogKHNldGYgKC4teCBvKSAxKSwgKHNldGYgKGFyZWYgYSBpKSB2KS5cIlxuICBgKHNldCEgLHBsYWNlICx2YWx1ZSkpXG4oaW5zdGFsbC1tYWNybyEgOnNldGYgZXhwYW5kLXNldGYpXG5cblxuKGRlZnVuIGV4cGFuZC1sYXp5LXNlcVxuICAoJnJlc3QgYm9keSlcbiAgXCJUYWtlcyBhIGJvZHkgb2YgZXhwcmVzc2lvbnMgdGhhdCByZXR1cm5zIGFuIElTZXEgb3IgbmlsLCBhbmQgeWllbGRzXG4gIGEgU2VxYWJsZSBvYmplY3QgdGhhdCB3aWxsIGludm9rZSB0aGUgYm9keSBvbmx5IHRoZSBmaXJzdCB0aW1lIHNlcVxuICBpcyBjYWxsZWQsIGFuZCB3aWxsIGNhY2hlIHRoZSByZXN1bHQgYW5kIHJldHVybiBpdCBvbiBhbGwgc3Vic2VxdWVudFxuICBzZXEgY2FsbHMuIFNlZSBhbHNvIC0gcmVhbGl6ZWQ/XG5cbiAgRGVwZW5kcyBvbiBsYXp5LXNlcVwiXG4gIGAoLmNhbGwgbGF6eS1zZXEgbmlsIGZhbHNlIChsYW1iZGEgKCkgLEBib2R5KSkpXG4oaW5zdGFsbC1tYWNybyA6bGF6eS1zZXEgZXhwYW5kLWxhenktc2VxKVxuXG5cbihkZWZ1biBleHBhbmQtd2hlblxuICAodGVzdCAmcmVzdCBib2R5KVxuICBcIkV2YWx1YXRlcyB0ZXN0LiBJZiBsb2dpY2FsIHRydWUsIGV2YWx1YXRlcyBib2R5IGluIGFuIGltcGxpY2l0IHByb2duLlwiXG4gIGAoaWYgLHRlc3QgKHByb2duICxAYm9keSkpKVxuKGluc3RhbGwtbWFjcm8gOndoZW4gZXhwYW5kLXdoZW4pXG5cbihkZWZ1biBleHBhbmQtdW5sZXNzXG4gICh0ZXN0ICZyZXN0IGJvZHkpXG4gIFwiRXZhbHVhdGVzIHRlc3QuIElmIGxvZ2ljYWwgZmFsc2UsIGV2YWx1YXRlcyBib2R5IGluIGFuIGltcGxpY2l0IHByb2duLlwiXG4gIGAod2hlbiAobm90ICx0ZXN0KSAsQGJvZHkpKVxuKGluc3RhbGwtbWFjcm8gOnVubGVzcyBleHBhbmQtdW5sZXNzKVxuXG5cbihkZWZ1biBleHBhbmQtaWYtbGV0XG4gIChiaW5kaW5ncyB0aGVuIGVsc2UqKVxuICBcImJpbmRpbmdzID0+IGJpbmRpbmctZm9ybSB0ZXN0XG4gIGJvZHkgPT4gW3RoZW4gZWxzZV1cbiAgSWYgdGVzdCBpcyB0cnVlLCBldmFsdWF0ZXMgdGhlbiB3aXRoIGJpbmRpbmctZm9ybSBib3VuZCB0byB0aGUgdmFsdWUgb2ZcbiAgdGVzdCwgaWYgbm90LCB5aWVsZHMgZWxzZSouXCJcbiAgKGxldCogKChuYW1lIChmaXJzdCBiaW5kaW5ncykpICh0ZXN0IChzZWNvbmQgYmluZGluZ3MpKSAoc3ltIChnZW5zeW0gOmlmLWxldC1iaW5kaW5nKSkpXG4gICAgYChsZXQqKiBbLHN5bSAsdGVzdF1cbiAgICAgICAoaWYgLHN5bSAobGV0KiogLChkZXN0cnVjdHVyZSBbbmFtZSBzeW1dKSAsdGhlbikgLGVsc2UqKSkpKVxuKGluc3RhbGwtbWFjcm8gOmlmLWxldCBleHBhbmQtaWYtbGV0KVxuXG4oZGVmdW4gZXhwYW5kLXdoZW4tbGV0XG4gIChiaW5kaW5ncyAmcmVzdCBib2R5KVxuICBcImJpbmRpbmdzID0+IGJpbmRpbmctZm9ybSB0ZXN0XG4gIFdoZW4gdGVzdCBpcyB0cnVlLCBldmFsdWF0ZXMgYm9keSB3aXRoIGJpbmRpbmctZm9ybSBib3VuZCB0byB0aGUgdmFsdWUgb2YgdGVzdC5cIlxuICBgKGlmLWxldCAsYmluZGluZ3MgKHByb2duICxAYm9keSkpKVxuKGluc3RhbGwtbWFjcm8gOndoZW4tbGV0IGV4cGFuZC13aGVuLWxldClcblxuXG4oZGVmdW4gZXhwYW5kLWlmLXNvbWVcbiAgKGJpbmRpbmdzIHRoZW4gZWxzZSopXG4gIFwiYmluZGluZ3MgPT4gYmluZGluZy1mb3JtIHRlc3RcbiAgSWYgdGVzdCBpcyBub3QgbmlsLCBldmFsdWF0ZXMgdGhlbiB3aXRoIGJpbmRpbmctZm9ybSBib3VuZCB0byB0aGVcbiAgdmFsdWUgb2YgdGVzdCwgaWYgbm90LCB5aWVsZHMgZWxzZSouXG5cbiAgRGVwZW5kcyBvbiBuaWw/XCJcbiAgKGxldCogKChuYW1lIChmaXJzdCBiaW5kaW5ncykpICh0ZXN0IChzZWNvbmQgYmluZGluZ3MpKSAoc3ltIChpZiAoc3ltYm9sPyBuYW1lKSBuYW1lIChnZW5zeW0gOmlmLXNvbWUtYmluZGluZykpKSlcbiAgICBgKGxldCoqIFssc3ltICx0ZXN0XVxuICAgICAgIChpZi1ub3QgKG5pbD8gLHN5bSlcbiAgICAgICAgIChsZXQqKiAsKGRlc3RydWN0dXJlIFtuYW1lIHN5bV0pICx0aGVuKVxuICAgICAgICAgLGVsc2UqKSkpKVxuKGluc3RhbGwtbWFjcm8gOmlmLXNvbWUgZXhwYW5kLWlmLXNvbWUpXG5cbihkZWZ1biBleHBhbmQtd2hlbi1zb21lXG4gIChiaW5kaW5ncyAmcmVzdCBib2R5KVxuICBcImJpbmRpbmdzID0+IGJpbmRpbmctZm9ybSB0ZXN0XG4gIFdoZW4gdGVzdCBpcyBub3QgbmlsLCBldmFsdWF0ZXMgYm9keSB3aXRoIGJpbmRpbmctZm9ybSBib3VuZCB0byB0aGVcbiAgdmFsdWUgb2YgdGVzdC5cIlxuICBgKGlmLXNvbWUgLGJpbmRpbmdzIChwcm9nbiAsQGJvZHkpKSlcbihpbnN0YWxsLW1hY3JvIDp3aGVuLXNvbWUgZXhwYW5kLXdoZW4tc29tZSlcblxuXG4oZGVmdW4gZXhwYW5kLXdoZW4tZmlyc3RcbiAgKGJpbmRpbmdzICZyZXN0IGJvZHkpXG4gIFwiYmluZGluZ3MgPT4geCB4c1xuICBSb3VnaGx5IHRoZSBzYW1lIGFzICh3aGVuIChzZXEgeHMpIChsZXQgW3ggKGZpcnN0IHhzKV0gYm9keSkpIGJ1dCB4cyBpcyBldmFsdWF0ZWQgb25seSBvbmNlXG5cbiAgRGVwZW5kcyBvbiBzZXEqXCJcbiAgKGxldCogKChuYW1lIChmaXJzdCBiaW5kaW5ncykpICh0ZXN0IChzZWNvbmQgYmluZGluZ3MpKSlcbiAgICBgKHdoZW4tbGV0IChbLG5hbWVdIChzZXEqICx0ZXN0KSkgLEBib2R5KSkpXG4oaW5zdGFsbC1tYWNybyA6d2hlbi1maXJzdCBleHBhbmQtd2hlbi1maXJzdClcblxuXG4oZGVmdW4gZXhwYW5kLXdoaWxlXG4gICh0ZXN0ICZyZXN0IGJvZHkpXG4gIFwiUmVwZWF0ZWRseSBleGVjdXRlcyBib2R5IHdoaWxlIHRlc3QgZXhwcmVzc2lvbiBpcyB0cnVlLiBQcmVzdW1lc1xuICBzb21lIHNpZGUtZWZmZWN0IHdpbGwgY2F1c2UgdGVzdCB0byBiZWNvbWUgZmFsc2UvbmlsLiBSZXR1cm5zIG5pbFwiXG4gIGAobG9vcCAoKVxuICAgICAod2hlbiAsdGVzdCAsQGJvZHkgKHJlY3VyKSkpKVxuKGluc3RhbGwtbWFjcm8gOndoaWxlIGV4cGFuZC13aGlsZSlcblxuXG4oZGVmdW4gZXhwYW5kLWRvdG9cbiAgKHggJnJlc3QgZm9ybXMpXG4gIFwiRXZhbHVhdGVzIHggdGhlbiBjYWxscyBhbGwgb2YgdGhlIG1ldGhvZHMgYW5kIGZ1bmN0aW9ucyB3aXRoIHRoZVxuICB2YWx1ZSBvZiB4IHN1cHBsaWVkIGF0IHRoZSBmcm9udCBvZiB0aGUgZ2l2ZW4gYXJndW1lbnRzLiAgVGhlIGZvcm1zXG4gIGFyZSBldmFsdWF0ZWQgaW4gb3JkZXIuICBSZXR1cm5zIHguXG4gIChkb3RvIChNYXAuKSAoLnNldCA6YSAxKSAoLnNldCA6YiAyKSlcIlxuICAobGV0KiAoKHN5bSAoZ2Vuc3ltIDpkb3RvLWJpbmRpbmcpKSlcbiAgICBgKGxldCoqIFssc3ltICx4XVxuICAgICAgICxAKG1hcCAobGFtYmRhICglKSAoY29uY2F0IFsoZmlyc3QgJSkgc3ltXSAocmVzdCAlKSkpIGZvcm1zKVxuICAgICAgICxzeW0pKSlcbihpbnN0YWxsLW1hY3JvIDpkb3RvIGV4cGFuZC1kb3RvKVxuXG4oZGVmdW4gZXhwYW5kLWRvdGltZXNcbiAgKGJpbmRpbmdzICZyZXN0IGJvZHkpXG4gIFwiYmluZGluZ3MgPT4gbmFtZSBuXG4gIFJlcGVhdGVkbHkgZXhlY3V0ZXMgYm9keSAocHJlc3VtYWJseSBmb3Igc2lkZS1lZmZlY3RzKSB3aXRoIG5hbWVcbiAgYm91bmQgdG8gaW50ZWdlcnMgZnJvbSAwIHRocm91Z2ggbi0xLlwiXG4gIChsZXQqICgobmFtZSAoZmlyc3QgYmluZGluZ3MpKSAobiAoc2Vjb25kIGJpbmRpbmdzKSkgKHN5bSAoZ2Vuc3ltIDpkb3RpbWVzLWJpbmRpbmcpKSlcbiAgICBgKGxldCoqIFssc3ltICxuXVxuICAgICAgIChsb29wICgoLG5hbWUgMCkpXG4gICAgICAgICAod2hlbiAoPCAsbmFtZSAsc3ltKVxuICAgICAgICAgICAsQGJvZHlcbiAgICAgICAgICAgKHJlY3VyIChpbmMgLG5hbWUpKSkpKSkpXG4oaW5zdGFsbC1tYWNybyA6ZG90aW1lcyBleHBhbmQtZG90aW1lcylcblxuXG4oZGVmdW4tIGZvci1zdGVwIChjb250ZXh0IGxvb3AgJnJlc3QgbW9kaWZpZXJzKVxuICAobGV0KiAoKGl0ZXIgICg6aXRlciBjb250ZXh0KSkgKGNvbGwgKDpjb2xsIGNvbnRleHQpKSAoYm9keSAoOmJvZHkgY29udGV4dCkpIChzdWJzZXEgKDpzdWJzZXEgY29udGV4dCkpXG4gICAgICAgIChib2R5KiAoaWYtbm90IHN1YnNlcSBib2R5IGAobGV0KiogWyxzdWJzZXEgLGJvZHldXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGlmIChlbXB0eT8gLHN1YnNlcSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChyZWN1ciAocmVzdCAsY29sbCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAobGF6eS1jb25jYXQgLHN1YnNlcSAoLGl0ZXIgKHJlc3QgLGNvbGwpKSkpKSkpXG4gICAgICAgIChuZXh0ICAobG9vcCAoKG1vZHMgKHJldmVyc2UgbW9kaWZpZXJzKSkgKGJvZHkgYm9keSopKVxuICAgICAgICAgICAgICAgIChpZiAoZW1wdHk/IG1vZHMpXG4gICAgICAgICAgICAgICAgICBib2R5XG4gICAgICAgICAgICAgICAgICAobGV0KiAoKG0gKGZpcnN0IG1vZHMpKSAoaXRlbSAoZmlyc3QgbSkpIChhcmcgKHNlY29uZCBtKSkpXG4gICAgICAgICAgICAgICAgICAgIChyZWN1ciAocmVzdCBtb2RzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgKGNvbmQgKCg9IGl0ZW0gJzpsZXQpICAgYChsZXQqKiAsKHBhcmVuLWJpbmRpbmdzLT52ZWMgYXJnKSAsYm9keSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKD0gaXRlbSAnOndoaWxlKSBgKGlmICxhcmcgLGJvZHkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCg9IGl0ZW0gJzp3aGVuKSAgYChpZiAsYXJnICxib2R5IChyZWN1ciAocmVzdCAsY29sbCkpKSkpKSkpKSkpXG4gICAgKG1lcmdlIGNvbnRleHRcbiAgICAgICAgICAgezpzdWJzZXEgKGdlbnN5bSA6Zm9yLXN1YnNlcSlcbiAgICAgICAgICAgIDpib2R5ICAgYCgobGFtYmRhICxpdGVyICgsY29sbClcbiAgICAgICAgICAgICAgICAgICAgICAgIChsYXp5LXNlcSAobG9vcCAoKCxjb2xsICxjb2xsKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChpZi1ub3QgKGVtcHR5PyAsY29sbClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGxldCoqIFssKGZpcnN0IGxvb3ApIChmaXJzdCAsY29sbCldICxuZXh0KSkpKSlcbiAgICAgICAgICAgICAgICAgICAgICAsKHNlY29uZCBsb29wKSl9KSkpXG5cbihkZWZ2YXItIGZvci1tb2RpZmllcnMgI3snOmxldCAnOndoaWxlICc6d2hlbn0pXG5cbihkZWZ1bi0gZm9yLXBhcnRzIChzZXEtZXhwci1wYWlycylcbiAgKGxldCogKChuICAgICAgICAoY291bnQgc2VxLWV4cHItcGFpcnMpKVxuICAgICAgICAoaW5kaWNlcyAgKGZpbHRlciAobGFtYmRhICglKSAoLT4gKGFnZXQgc2VxLWV4cHItcGFpcnMgJSkgZmlyc3QgZm9yLW1vZGlmaWVycyBub3QpKVxuICAgICAgICAgICAgICAgICAgICAgICAgIChyYW5nZSBuKSkpXG4gICAgICAgIChzZWdtZW50cyAocGFydGl0aW9uIDIgMSAoY29uaiBpbmRpY2VzIG4pKSkpXG4gICAgKG1hcCAobGFtYmRhICglKSAoLnNsaWNlIHNlcS1leHByLXBhaXJzIChmaXJzdCAlKSAoc2Vjb25kICUpKSlcbiAgICAgICAgIHNlZ21lbnRzKSkpXG5cbihkZWZ1biBleHBhbmQtZm9yXG4gIChzZXEtZXhwcnMgYm9keS1leHByKVxuICBcIkxpc3QgY29tcHJlaGVuc2lvbi4gVGFrZXMgYSBwYXJlbiBjbGF1c2UgbGlzdCBvZiBvbmUgb3IgbW9yZVxuICAgKGJpbmRpbmctZm9ybSBjb2xsZWN0aW9uLWV4cHIpIHBhaXJzLCBlYWNoIGZvbGxvd2VkIGJ5IHplcm8gb3IgbW9yZVxuICAgbW9kaWZpZXIgY2xhdXNlcywgYW5kIHlpZWxkcyBhIGxhenkgc2VxdWVuY2Ugb2YgZXZhbHVhdGlvbnMgb2YgZXhwci5cbiAgIENvbGxlY3Rpb25zIGFyZSBpdGVyYXRlZCBpbiBhIG5lc3RlZCBmYXNoaW9uLCByaWdodG1vc3QgZmFzdGVzdCxcbiAgIGFuZCBuZXN0ZWQgY29sbC1leHBycyBjYW4gcmVmZXIgdG8gYmluZGluZ3MgY3JlYXRlZCBpbiBwcmlvclxuICAgYmluZGluZy1mb3Jtcy4gIFN1cHBvcnRlZCBtb2RpZmllcnMgYXJlOiAoOmxldCAoKGJpbmRpbmctZm9ybSBleHByKSAuLi4pKSxcbiAgICg6d2hpbGUgdGVzdCksICg6d2hlbiB0ZXN0KS5cbiAgKHRha2UgMTAwIChmb3IgKCh4IChpbmZpbml0ZS1yYW5nZSkpICh5IChpbmZpbml0ZS1yYW5nZSkpICg6d2hpbGUgKDwgeSB4KSkpICBbeCB5XSkpXG5cbiAgRGVwZW5kcyBvbiBsYXp5LXNlcSwgbGF6eS1jb25jYXQsIGVtcHR5PywgZmlyc3QsIHJlc3QsIGNvbnNcIlxuICAobGV0KiAoKHBhaXJzICh2ZWMgKG1hcCB2ZWMgc2VxLWV4cHJzKSkpXG4gICAgICAgIChpdGVyIChnZW5zeW0gOmZvci1pdGVyKSkgKGNvbGwgKGdlbnN5bSA6Zm9yLWNvbGwpKSAocGFydHMgKGZvci1wYXJ0cyBwYWlycykpKVxuICAgICg6Ym9keSAocmVkdWNlIChsYW1iZGEgKCUxICUyKSAoYXBwbHkgZm9yLXN0ZXAgJTEgJTIpKVxuICAgICAgICAgICAgICAgICAgIHs6aXRlciBpdGVyIDpjb2xsIGNvbGwgOmJvZHkgYChjb25zICxib2R5LWV4cHIgKCxpdGVyIChyZXN0ICxjb2xsKSkpfVxuICAgICAgICAgICAgICAgICAgIChyZXZlcnNlIHBhcnRzKSkpKSlcbihpbnN0YWxsLW1hY3JvIDpmb3IgZXhwYW5kLWZvcilcblxuKGRlZnVuIGV4cGFuZC1kb3NlcVxuICAoc2VxLWV4cHJzICZyZXN0IGJvZHkpXG4gIFwiUmVwZWF0ZWRseSBleGVjdXRlcyBib2R5IChwcmVzdW1hYmx5IGZvciBzaWRlLWVmZmVjdHMpIHdpdGhcbiAgYmluZGluZ3MgYW5kIGZpbHRlcmluZyBhcyBwcm92aWRlZCBieSAnZm9yJy4gRG9lcyBub3QgcmV0YWluXG4gIHRoZSBoZWFkIG9mIHRoZSBzZXF1ZW5jZS4gUmV0dXJucyBuaWwuXG5cbiAgRGVwZW5kcyBvbiBsYXp5LXNlcSwgbGF6eS1jb25jYXQsIGVtcHR5PywgZmlyc3QsIHJlc3QsIGNvbnMsIGRvcnVuXCJcbiAgYChkb3J1biAoZm9yICxzZXEtZXhwcnMgKHByb2duICxAYm9keSBuaWwpKSkpXG4oaW5zdGFsbC1tYWNybyA6ZG9zZXEgZXhwYW5kLWRvc2VxKVxuXG5cbihkZWZ1bi0gc3ltKiAoc3RyaW5nKVxuICAobGV0KiAoKHdvcmRzIChzcGxpdCAobmFtZSBzdHJpbmcpICNcIi1cIikpKVxuICAgIChqb2luIChjb25zIChmaXJzdCB3b3JkcykgKG1hcCBjYXBpdGFsaXplIChyZXN0IHdvcmRzKSkpKSkpXG4oZGVmdW4tIGJpbmQtc3ltKiAocyBiKVxuICAoYXNzZXJ0IChzeW1ib2w/IHMpIFwiRXhwZWN0ZWQgYSBzeW1ib2wgaGVyZSFcIilcbiAgW3MgYl0pXG4oZGVmdW4tIGNvbmotc3ltcyogKGdldCogcmVzdWx0IGsgdiBmIHF1b3RlKVxuICAobGV0KiAoKGstbnMgKG5hbWVzcGFjZSBrKSkgKGcgKGxhbWJkYSAoJSkgKGYgay1ucyAobmFtZSAlKSkpKSlcbiAgICAodmVjIChjb25jYXQgcmVzdWx0IChtYXBjYXQgKGxhbWJkYSAoJSkgKGJpbmQtc3ltKiAlIChnZXQqICUgKGcgJSkgcXVvdGUpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdikpKSkpXG4oZGVmdW4tIGRpY3QtZ2V0KiAoZGljdC1uYW1lIGRlZmF1bHRzKVxuICAobGFtYmRhIChiaW5kaW5nIGtleSBxdW90ZSlcbiAgICAobGV0KiAoKHMgKG5hbWUga2V5KSlcbiAgICAgICAgICAoayAoa2V5d29yZCAobmFtZXNwYWNlIGtleSkgKGlmIChzeW1ib2w/IGtleSkgKHN5bSogcykgcykpKSlcbiAgICAgIGAoZ2V0ICxkaWN0LW5hbWUgLChpZi1ub3QgcXVvdGUgayBgJyxrKSAsKGFuZCBiaW5kaW5nIChhZ2V0IGRlZmF1bHRzIGJpbmRpbmcpKSkpKSlcblxuKGRlZnVuIGRlc3RydWN0dXJlLWRpY3QgKGJpbmRpbmcgZnJvbSlcbiAgKGxldCogKChkaWN0LW5hbWUgIChvciAoYWdldCBiaW5kaW5nICc6YXMpIChnZW5zeW0gOmRlc3RydWN0dXJlLWJpbmQpKSlcbiAgICAgICAgKGRpY3QtYmluZCAgYChpZiAoZGljdGlvbmFyeT8gLGRpY3QtbmFtZSkgLGRpY3QtbmFtZSAoYXBwbHkgZGljdGlvbmFyeSAodmVjICxkaWN0LW5hbWUpKSkpXG4gICAgICAgIChnZXQqICAgICAgIChkaWN0LWdldCogZGljdC1uYW1lIChnZXQgYmluZGluZyAnOm9yIHt9KSkpKVxuICAgIChsb29wICgoa3MgKGtleXMgKGRpc3NvYyBiaW5kaW5nICc6YXMgJzpvcikpKSAocmVzdWx0IFtkaWN0LW5hbWUgZnJvbSBkaWN0LW5hbWUgZGljdC1iaW5kXSkpXG4gICAgICAoaWYgKGVtcHR5PyBrcylcbiAgICAgICAgcmVzdWx0XG4gICAgICAgIChsZXQqICgoayAoZmlyc3Qga3MpKSAodiAoZ2V0IGJpbmRpbmcgaykpIChrKiAoYW5kIChrZXl3b3JkPyBrKSAobmFtZSBrKSkpKVxuICAgICAgICAgIChhc3NlcnQgKG9yIChzeW1ib2w/IGspIChhbmQgayogKCN7OmtleXMgOnN0cnMgOnN5bXN9IGsqKSkpXG4gICAgICAgICAgICAgICAgICAoc3RyIFwiSW52YWxpZCBkZXN0cnVjdHVyZSBrZXkgXCIgaykpXG4gICAgICAgICAgKHJlY3VyIChyZXN0IGtzKSAoY29uZCAoKD0gayogOnN0cnMpIChjb25qLXN5bXMqIGdldCogcmVzdWx0IGsgdiBrZXl3b3JkKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgoPSBrKiA6c3ltcykgKGNvbmotc3ltcyogZ2V0KiByZXN1bHQgayB2IChsYW1iZGEgKCUxICUyKSAoc3ltYm9sICUxIChzeW0qICUyKSkpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKD0gayogOmtleXMpIChjb25qLXN5bXMqIGdldCogcmVzdWx0IGsgdiBrZXl3b3JkKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgobnVtYmVyPyB2KSAgKGNvbmogcmVzdWx0IGsgKGdldCogayAoc3ltYm9sIChzdHIgdikpKSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZWxzZSAgICAgICAgKGNvbmogcmVzdWx0IGsgKGdldCogayB2KSkpKSkpKSkpKVxuXG4oZGVmdW4gZGVzdHJ1Y3R1cmUtc2VxIChiaW5kaW5nIGZyb20pXG4gIChsZXQqICgoYXMgICAgICAgKC5maW5kLWluZGV4IGJpbmRpbmcgKGxhbWJkYSAoJSkgKD0gJSAnOmFzKSkpKVxuICAgICAgICAoc2VxLW5hbWUgKGlmICg8IGFzIDApIChnZW5zeW0gOmRlc3RydWN0dXJlLWJpbmQpIChudGggYmluZGluZyAoaW5jIGFzKSkpKVxuICAgICAgICAoYmluZGluZzEgKGlmICg8IGFzIDApIGJpbmRpbmcgKHRha2UgYXMgYmluZGluZykpKVxuICAgICAgICAobW9yZSAgICAgKC5maW5kLWluZGV4IGJpbmRpbmcxIChsYW1iZGEgKCUpIChvciAoPSAlICcmKSAoPSAlICcmcmVzdCkpKSkpXG4gICAgICAgICh0YWlsICAgICAoaWYgKD49IG1vcmUgMCkgKG50aCBiaW5kaW5nMSAoaW5jIG1vcmUpKSkpXG4gICAgICAgIChiaW5kaW5nMiAoaWYgKDwgbW9yZSAwKSBiaW5kaW5nMSAodGFrZSBtb3JlIGJpbmRpbmcpKSkpXG4gICAgKGFzc2VydCAob3IgKDwgYXMgMCkgKD0gYXMgKC0gKGNvdW50IGJpbmRpbmcpIDIpKSlcbiAgICAgICAgICAgIFwiaW52YWxpZCA6YXMgaW4gc2VxLWRlc3RydWN0dXJpbmdcIilcbiAgICAoYXNzZXJ0IChvciAoPCBtb3JlIDApICg9IG1vcmUgKC0gKGNvdW50IGJpbmRpbmcxKSAyKSkpXG4gICAgICAgICAgICBcImludmFsaWQgJiBpbiBzZXEtZGVzdHJ1Y3R1cmluZ1wiKVxuICAgIChsb29wICgoeHMgYmluZGluZzIpIChpIDApIChyZXN1bHQgW3NlcS1uYW1lIGZyb21dKSlcbiAgICAgIChsZXQqICgoeCAoZmlyc3QgeHMpKSlcbiAgICAgICAgKGNvbmQgKChlbXB0eT8geHMpIChpZi1ub3QgdGFpbCByZXN1bHQgKGNvbmogcmVzdWx0IHRhaWwgYChkcm9wICxtb3JlICxzZXEtbmFtZSkpKSlcbiAgICAgICAgICAgICAgKCg9IHggJ18pICAgIChyZWN1ciAocmVzdCB4cykgKGluYyBpKSByZXN1bHQpKVxuICAgICAgICAgICAgICAoZWxzZSAgICAgICAocmVjdXIgKHJlc3QgeHMpIChpbmMgaSkgKGNvbmogcmVzdWx0IHggYChudGggLHNlcS1uYW1lICxpKSkpKSkpKSkpXG5cbihkZWZ1biBkZXN0cnVjdHVyZSAoYmluZGluZ3MpXG4gIChsZXQqICgocGFpcnMgKHBhcnRpdGlvbiAyIGJpbmRpbmdzKSkpXG4gICAgKGlmIChldmVyeT8gKGxhbWJkYSAoJSkgKHN5bWJvbD8gKGZpcnN0ICUpKSkgcGFpcnMpXG4gICAgICBiaW5kaW5nc1xuICAgICAgKGRlc3RydWN0dXJlICh2ZWMgKG1hcGNhdCAobGFtYmRhICglKSAoY29uZCAoKHZlY3Rvcj8gICAgIChmaXJzdCAlKSkgKGFwcGx5IGRlc3RydWN0dXJlLXNlcSAlKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgoZGljdGlvbmFyeT8gKGZpcnN0ICUpKSAoYXBwbHkgZGVzdHJ1Y3R1cmUtZGljdCAlKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgoc3ltYm9sPyAgICAgKGZpcnN0ICUpKSAlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGVsc2UgICAgICAgICAgICAgICAgICAgKHRocm93IFwiSW52YWxpZCBiaW5kaW5nXCIpKSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhaXJzKSkpKSkpXG5cbihkZWZ1bi0gYmluZC1uYW1lcyogKGtleXMpXG4gICh6aXBtYXAga2V5cyAocmVwZWF0ZWRseSAoY291bnQga2V5cykgKGxhbWJkYSAoKSAoZ2Vuc3ltIDpkZXN0cnVjdHVyZS1iaW5kKSkpKSlcbihkZWZ1bi0gYmluZC1pbmRpY2VzKiAobmFtZXMpXG4gIChmaWx0ZXIgKGxhbWJkYSAoJSkgKG5vdCAoc3ltYm9sPyAobnRoIG5hbWVzICUpKSkpIChyYW5nZSAoY291bnQgbmFtZXMpKSkpXG5cbihkZWZ1bi0gcGFyZW4tYmluZGluZ3MtPnZlY1xuICAoYmluZGluZ3MpXG4gIFwiVHVybnMgYSBuZXctc3ludGF4IGBsZXRgL2BsZXQqYCBwYXJlbiBiaW5kaW5nIGxpc3QsIGUuZy5cbiAgKCh4IDEpICh5IDIpKSwgaW50byB0aGUgZmxhdCB2ZWN0b3IgW3ggMSB5IDJdIHRoZSBpbnRlcm5hbCBgbGV0KipgXG4gIGZvcm0gKGFuZCBgZGVzdHJ1Y3R1cmVgKSBleHBlY3QuXCJcbiAgKHZlYyAobWFwY2F0IChsYW1iZGEgKHBhaXIpIFsoZmlyc3QgcGFpcikgKHNlY29uZCBwYWlyKV0pIGJpbmRpbmdzKSkpXG5cbihkZWZ1biBleHBhbmQtbGV0KlxuICAoYmluZGluZ3MgJnJlc3QgYm9keSlcbiAgXCIobGV0KiAoKHggMSkgKHkgKCsgeCAxKSkpIGJvZHkqKSAtLSBzZXF1ZW50aWFsOiBlYWNoIGJpbmRpbmcgc2Vlc1xuICB0aGUgcHJldmlvdXMgb25lcy5cIlxuICBgKGxldCoqICwoZGVzdHJ1Y3R1cmUgKHBhcmVuLWJpbmRpbmdzLT52ZWMgYmluZGluZ3MpKSAsQGJvZHkpKVxuKGluc3RhbGwtbWFjcm8hIDpsZXQqIGV4cGFuZC1sZXQqKVxuXG4oZGVmdW4gZXhwYW5kLWxldFxuICAoYmluZGluZ3MgJnJlc3QgYm9keSlcbiAgXCIobGV0ICgoeCAxKSAoeSAyKSkgYm9keSopIC0tIGJpbmRpbmdzIGV2YWx1YXRlZCBpbiB0aGUgT1VURVIgc2NvcGVcbiAgKHBhcmFsbGVsKTogZXZlcnkgaW5pdC1leHByIHNlZXMgb25seSB3aGF0IHdhcyBib3VuZCBiZWZvcmUgdGhpc1xuICBgbGV0YCwgbmV2ZXIgYSBzaWJsaW5nIGJpbmRpbmcgaW50cm9kdWNlZCBieSB0aGUgc2FtZSBmb3JtLiBBbGxcbiAgaW5pdC1leHBycyBhcmUgZXZhbHVhdGVkIGZpcnN0IChib3VuZCB0byBnZW5zeW1zKSwgdGhlbiB0aGUgcmVhbFxuICBuYW1lcyBhcmUgYm91bmQgZnJvbSB0aG9zZSBnZW5zeW1zLlwiXG4gIChsZXQqICgocGFpcnMgKHBhcnRpdGlvbiAyIChwYXJlbi1iaW5kaW5ncy0+dmVjIGJpbmRpbmdzKSkpXG4gICAgICAgIChnZW5zeW1zIChtYXAgKGxhbWJkYSAoXykgKGdlbnN5bSA6bGV0LWJpbmRpbmcpKSBwYWlycykpXG4gICAgICAgIChvdXRlciAobWFwY2F0IChsYW1iZGEgKGcgcGFpcikgW2cgKHNlY29uZCBwYWlyKV0pIGdlbnN5bXMgcGFpcnMpKVxuICAgICAgICAoaW5uZXIgKG1hcGNhdCAobGFtYmRhIChnIHBhaXIpIFsoZmlyc3QgcGFpcikgZ10pIGdlbnN5bXMgcGFpcnMpKSlcbiAgICBgKGxldCoqICwodmVjIG91dGVyKSAobGV0KiogLChkZXN0cnVjdHVyZSAodmVjIGlubmVyKSkgLEBib2R5KSkpKVxuKGluc3RhbGwtbWFjcm8hIDpsZXQgZXhwYW5kLWxldClcblxuKGRlZnVuLSBwYXJzZS1hcmdsaXN0XG4gIChwYXJhbXMpXG4gIFwiUGFyc2VzIGEgbmV3LXN5bnRheCBwYXJhbWV0ZXIgbGlzdCAtLSAoYSBiICZvcHRpb25hbCAoYyAxMCkgJnJlc3QgcilcbiAgLS0gaW50byB7Om5hbWVzIFsuLi5dIDpkZWZhdWx0cyAoW25hbWUgZGVmYXVsdF0gLi4uKX0uIDpuYW1lcyBpcyBhXG4gIGZsYXQgdmVjdG9yIHVzaW5nIHRoZSBleGlzdGluZyBgJiByZXN0LW5hbWVgIHZhcmlhZGljIGNvbnZlbnRpb25cbiAgZm4qL2FuYWx5emUtZm4gYWxyZWFkeSB1bmRlcnN0YW5kczsgOmRlZmF1bHRzIGFyZSBbbmFtZSBkZWZhdWx0LWZvcm1dXG4gIHBhaXJzIHRvIHByZXBlbmQgYXMgYm9keSBzdGF0ZW1lbnRzLiBQb3NpdGlvbmFsIGRlc3RydWN0dXJpbmdcbiAgKGEgcGFyYW0gcG9zaXRpb24gdGhhdCBpcyBpdHNlbGYgYSB2ZWN0b3IvZGljdGlvbmFyeSBwYXR0ZXJuKSBpc1xuICBoYW5kbGVkIHRoZSBzYW1lIHdheSBvbGQgd2lzcCdzIGBmbmAgZGlkIGl0IC0tIHNlZSBgZGVmKmAgYmVsb3cuXCJcbiAgKGxvb3AgKChyZW1haW5pbmcgKHNlcSBwYXJhbXMpKVxuICAgICAgICAgKG1vZGUgOnJlcXVpcmVkKVxuICAgICAgICAgKG5hbWVzIFtdKVxuICAgICAgICAgKGRlZmF1bHRzIFtdKSlcbiAgICAoaWYgKGVtcHR5PyByZW1haW5pbmcpXG4gICAgICB7Om5hbWVzIG5hbWVzIDpkZWZhdWx0cyBkZWZhdWx0c31cbiAgICAgIChsZXQqICgoeCAoZmlyc3QgcmVtYWluaW5nKSkgKHhzIChyZXN0IHJlbWFpbmluZykpKVxuICAgICAgICAoY29uZFxuICAgICAgICAgICgoPSB4ICcmb3B0aW9uYWwpIChyZWN1ciB4cyA6b3B0aW9uYWwgbmFtZXMgZGVmYXVsdHMpKVxuICAgICAgICAgICgoPSB4ICcmcmVzdCkgKHJlY3VyIHhzIDpyZXN0IG5hbWVzIGRlZmF1bHRzKSlcbiAgICAgICAgICAoKGlkZW50aWNhbD8gbW9kZSA6cmVzdCkgKHJlY3VyIHhzIG1vZGUgKGNvbmogbmFtZXMgJyYgeCkgZGVmYXVsdHMpKVxuICAgICAgICAgICgoYW5kIChpZGVudGljYWw/IG1vZGUgOm9wdGlvbmFsKSAobGlzdD8geCkpXG4gICAgICAgICAgKHJlY3VyIHhzIG1vZGUgKGNvbmogbmFtZXMgKGZpcnN0IHgpKVxuICAgICAgICAgICAgICAgICAoY29uaiBkZWZhdWx0cyBbKGZpcnN0IHgpIChzZWNvbmQgeCldKSkpXG4gICAgICAgICAgKGVsc2UgKHJlY3VyIHhzIG1vZGUgKGNvbmogbmFtZXMgeCkgZGVmYXVsdHMpKSkpKSkpXG5cbihkZWZ1biBleHBhbmQtbGFtYmRhXG4gICgmcmVzdCBhcmdzKVxuICBcIihsYW1iZGEgKHBhcmFtcyopIGV4cHJzKilcbiAgIChsYW1iZGEgbmFtZSAocGFyYW1zKikgZXhwcnMqKVxuXG4gIHBhcmFtcyA9PiBwb3NpdGlvbmFsLXBhcmFtcyogLCBvciBwb3NpdGlvbmFsLXBhcmFtcyogJm9wdGlvbmFsXG4gIChvcHQgZGVmYXVsdD8pKiAmcmVzdCBuZXh0LXBhcmFtXG5cbiAgQ29tcGlsZXMgdG8gYSBuYW1lZCBgZnVuY3Rpb25gIGV4cHJlc3Npb24gLS0ga2VlcHMgYHRoaXNgLFxuICBgYXJndW1lbnRzYCwgYW5kIG5hbWVkIHNlbGYtcmVjdXJzaW9uLiBNdWx0aS1hcml0eSBjbGF1c2VzXG4gICgocGFyYW1zMSopIGJvZHkxKikgKChwYXJhbXMyKikgYm9keTIqKSAtLSBDbG9qdXJlLXdpc3AncyBhcml0eVxuICBvdmVybG9hZGluZyAtLSBhcmUgbm90IHlldCBzdXBwb3J0ZWQgZm9yIG5ldy1zeW50YXg6IHRoYXQgY2FsbCBpc1xuICBkZWZlcnJlZCB0byB0aGUgUGhhc2UtMyBhcml0eS1vdmVybG9hZGluZyBjaGVja3BvaW50ICh0aWNrZXQgIzUpLlwiXG4gIChsZXQqICgobmFtZSAoaWYgKHN5bWJvbD8gKGZpcnN0IGFyZ3MpKSAoZmlyc3QgYXJncykpKVxuICAgICAgICAoZGVmcyAoaWYgbmFtZSAocmVzdCBhcmdzKSBhcmdzKSkpXG4gICAgKGlmIChhbmQgKGxpc3Q/IChmaXJzdCBkZWZzKSlcbiAgICAgICAgICAgICAobGlzdD8gKGZpcnN0IChmaXJzdCBkZWZzKSkpKVxuICAgICAgKHRocm93IChFcnJvciAoc3RyIFwibGFtYmRhOiBtdWx0aS1hcml0eSBjbGF1c2VzIGFyZSBub3Qgc3VwcG9ydGVkIFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgXCJpbiBuZXctc3ludGF4IHlldCAtLSB0aWNrZXQgIzUncyBhcml0eS1vdmVybG9hZGluZyBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgIFwicXVlc3Rpb24gaXMgc3RpbGwgb3BlblwiKSkpXG4gICAgICAobGV0KiAoKHBhcmFtcyAoZmlyc3QgZGVmcykpXG4gICAgICAgICAgICAoYm9keSAocmVzdCBkZWZzKSlcbiAgICAgICAgICAgIChwYXJzZWQgKHBhcnNlLWFyZ2xpc3QgcGFyYW1zKSlcbiAgICAgICAgICAgIChpbmRpY2VzIChiaW5kLWluZGljZXMqICg6bmFtZXMgcGFyc2VkKSkpXG4gICAgICAgICAgICAoYmluZHMgKGJpbmQtbmFtZXMqIGluZGljZXMpKVxuICAgICAgICAgICAgKGFyZ3YgKHZlYyAobWFwLWluZGV4ZWQgKGxhbWJkYSAoJTEgJTIpIChnZXQgYmluZHMgJTEgJTIpKSAoOm5hbWVzIHBhcnNlZCkpKSlcbiAgICAgICAgICAgIChkZXN0cnVjdHVyaW5nIChpZiAoZW1wdHk/IGJpbmRzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW2AobGV0KiogLChkZXN0cnVjdHVyZSAodmVjIChtYXBjYXQgKGxhbWJkYSAoaSkgWyhudGggKDpuYW1lcyBwYXJzZWQpIGkpIChnZXQgYmluZHMgaSldKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGljZXMpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLEBib2R5KV0pKVxuICAgICAgICAgICAgKGRlZmF1bHRpbmcgKG1hcCAobGFtYmRhIChkKSBgKGlmIChuaWw/ICwoZmlyc3QgZCkpIChzZXQhICwoZmlyc3QgZCkgLChzZWNvbmQgZCkpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoOmRlZmF1bHRzIHBhcnNlZCkpKVxuICAgICAgICAgICAgKGJvZHkqIChpZiAoZW1wdHk/IGRlc3RydWN0dXJpbmcpXG4gICAgICAgICAgICAgICAgICAgIChjb25jYXQgZGVmYXVsdGluZyBib2R5KVxuICAgICAgICAgICAgICAgICAgICAoY29uY2F0IGRlZmF1bHRpbmcgZGVzdHJ1Y3R1cmluZykpKSlcbiAgICAgICAgKGlmIG5hbWVcbiAgICAgICAgICBgKGZuKiAsbmFtZSAsYXJndiAsQGJvZHkqKVxuICAgICAgICAgIGAoZm4qICxhcmd2ICxAYm9keSopKSkpKSlcbihpbnN0YWxsLW1hY3JvISA6bGFtYmRhIGV4cGFuZC1sYW1iZGEpXG5cbihkZWZ1biBleHBhbmQtbG9vcFxuICAoYmluZGluZ3MgJnJlc3QgYm9keSlcbiAgXCJFdmFsdWF0ZXMgdGhlIGV4cHJzIGluIGEgbGV4aWNhbCBjb250ZXh0IGluIHdoaWNoIHRoZSBzeW1ib2xzIGluXG4gIHRoZSBiaW5kaW5nLWZvcm1zIGFyZSBib3VuZCB0byB0aGVpciByZXNwZWN0aXZlIGluaXQtZXhwcnMgb3IgcGFydHNcbiAgdGhlcmVpbi4gQWN0cyBhcyBhIHJlY3VyIHRhcmdldC5cblxuICBEZXBlbmRzIG9uIGRpY3Rpb25hcnk/LCBkaWN0aW9uYXJ5LCB2ZWMsIGdldFwiXG4gIChsZXQqICgoYmluZGluZ3MgKHBhcmVuLWJpbmRpbmdzLT52ZWMgYmluZGluZ3MpKVxuICAgICAgICAocGFpcnMgICAocGFydGl0aW9uIDIgYmluZGluZ3MpKVxuICAgICAgICAoaW5kaWNlcyAoYmluZC1pbmRpY2VzKiAobWFwdiBmaXJzdCBwYWlycykpKVxuICAgICAgICAobmFtZXMgICAoYmluZC1uYW1lcyogaW5kaWNlcykpXG4gICAgICAgIChnZXQqICAgIChsYW1iZGEgKCUxICUyKSAoaWYtbGV0IFt4IChhZ2V0IG5hbWVzICUxKV1cbiAgICAgICAgICAgICAgICAgICBbeCAoc2Vjb25kICUyKSAoZmlyc3QgJTIpIHhdXG4gICAgICAgICAgICAgICAgICAgJTIpKSkpXG4gICAgKGlmIChlbXB0eT8gbmFtZXMpXG4gICAgICBgKGxvb3AqICxiaW5kaW5ncyAsQGJvZHkpXG4gICAgICBgKGxldCoqICwodmVjIChhcHBseSBjb25jYXQgKG1hcC1pbmRleGVkIGdldCogcGFpcnMpKSlcbiAgICAgICAgIChsb29wKiAsKHZlYyAoYXBwbHkgY29uY2F0IChtYXAtaW5kZXhlZCAobGFtYmRhICglMSAlMikgKGxldCogKCh4IChnZXQgbmFtZXMgJTEgKGZpcnN0ICUyKSkpKSBbeCB4XSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFpcnMpKSlcbiAgICAgICAgICAgKGxldCoqICwodmVjIChtYXBjYXQgKGxhbWJkYSAoaSkgWyhmaXJzdCAoYWdldCBwYWlycyBpKSkgKGFnZXQgbmFtZXMgaSldKSBpbmRpY2VzKSlcbiAgICAgICAgICAgICAsQGJvZHkpKSkpKSlcbihpbnN0YWxsLW1hY3JvIDpsb29wIGV4cGFuZC1sb29wKVxuIl19
