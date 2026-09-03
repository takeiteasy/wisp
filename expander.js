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
                        return conjSyms_(get_ø1, resultø1, kø1, vø1, keyword, 'quote');
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
            return isEqual($, symbol(null, '&'));
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
                            nth(bindsø1, i)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndpc3AvZXhwYW5kZXIud2lzcCJdLCJuYW1lcyI6WyJfbnNfIiwiaWQiLCJkb2MiLCJtZXRhIiwid2l0aE1ldGEiLCJpc1N5bWJvbCIsImlzS2V5d29yZCIsImtleXdvcmQiLCJpc1F1b3RlIiwic3ltYm9sIiwibmFtZXNwYWNlIiwibmFtZSIsImdlbnN5bSIsImlzVW5xdW90ZSIsImlzVW5xdW90ZVNwbGljaW5nIiwiaXNMaXN0IiwibGlzdCIsImNvbmoiLCJwYXJ0aXRpb24iLCJzZXEiLCJyZXBlYXRlZGx5IiwiaXNFbXB0eSIsIm1hcCIsIm1hcHYiLCJ2ZWMiLCJzZXQiLCJpc0V2ZXJ5IiwiY29uY2F0IiwiZmlyc3QiLCJzZWNvbmQiLCJ0aGlyZCIsInJlc3QiLCJsYXN0IiwibWFwY2F0IiwibnRoIiwiYnV0bGFzdCIsImludGVybGVhdmUiLCJjb25zIiwiY291bnQiLCJ0YWtlIiwiZGlzc29jIiwic29tZSIsImFzc29jIiwicmVkdWNlIiwiZmlsdGVyIiwiaXNTZXEiLCJ6aXBtYXAiLCJkcm9wIiwibGF6eVNlcSIsInJhbmdlIiwicmV2ZXJzZSIsImRvcnVuIiwibWFwSW5kZXhlZCIsImlzTmlsIiwiaXNEaWN0aW9uYXJ5IiwiaXNWZWN0b3IiLCJrZXlzIiwiZ2V0IiwidmFscyIsImlzU3RyaW5nIiwiaXNOdW1iZXIiLCJpc0Jvb2xlYW4iLCJpc0RhdGUiLCJpc1JlUGF0dGVybiIsImlzRXZlbiIsImlzT2RkIiwiaXNFcXVhbCIsIm1heCIsImluYyIsImRlYyIsImRpY3Rpb25hcnkiLCJtZXJnZSIsInN1YnMiLCJzcGxpdCIsImpvaW4iLCJjYXBpdGFsaXplIiwiX19tYWNyb3NfXyIsImV4cG9ydHMiLCJleHBhbmQiLCJleHBhbmRlciIsImZvcm0iLCJlbnYiLCJtZXRhZGF0YcO4MSIsInBhcm1hc8O4MSIsImltcGxpY2l0w7gxIiwiJCIsInBhcmFtc8O4MSIsImV4cGFuc2lvbsO4MSIsImluc3RhbGxNYWNybyIsIm9wIiwibWFjcm8iLCJpc0RvdFN5bnRheCIsImlzTWV0aG9kU3ludGF4IiwiaWTDuDEiLCJpc0ZpZWxkU3ludGF4IiwiaXNOZXdTeW50YXgiLCJtZXRob2RTeW50YXgiLCJ0YXJnZXQiLCJwYXJhbXMiLCJvcE1ldGHDuDEiLCJmb3JtU3RhcnTDuDEiLCJ0YXJnZXRNZXRhw7gxIiwibWVtYmVyw7gxIiwiYWdldMO4MSIsIm1ldGhvZMO4MSIsIkVycm9yIiwiZmllbGRTeW50YXgiLCJmaWVsZCIsIm1vcmUiLCJzdGFydMO4MSIsImVuZMO4MSIsImRvdFN5bnRheCIsIl9maWVsZMO4MSIsIm5ld1N5bnRheCIsImlkTWV0YcO4MSIsInJlbmFtZcO4MSIsImNvbnN0cnVjdG9yw7gxIiwib3BlcmF0b3LDuDEiLCJrZXl3b3JkSW52b2tlIiwiYXJncyIsImRlc3VnYXIiLCJkZXN1Z2FyZWTDuDEiLCJtYWNyb2V4cGFuZDEiLCJvcMO4MSIsImV4cGFuZGVyw7gxIiwibWFjcm9leHBhbmQiLCJvcmlnaW5hbMO4MSIsImV4cGFuZGVkw7gxIiwic3ludGF4UXVvdGUiLCJyZWFkZXJFcnJvciIsInNlcXVlbmNlRXhwYW5kIiwic3ludGF4UXVvdGVFeHBhbmQiLCJ1bnF1b3RlU3BsaWNpbmdFeHBhbmQiLCJmb3JtcyIsImV4cGFuZE5vdEVxdWFsIiwiYm9keSIsImV4cGFuZElmTm90IiwiY29uZGl0aW9uIiwidHJ1dGh5IiwiYWx0ZXJuYXRpdmUiLCJleHBhbmRDb21tZW50IiwiZXhwYW5kVGhyZWFkRmlyc3QiLCJvcGVyYXRpb25zIiwib3BlcmF0aW9uIiwiZXhwYW5kVGhyZWFkTGFzdCIsImV4cGFuZERvdHMiLCJ4IiwiZXhwYW5kVGhyZWFkQXMiLCJleHByIiwiZXhwYW5kQ29uZCIsImNsYXVzZXMiLCJjbGF1c2XDuDEiLCJ0ZXN0w7gxIiwiYm9kecO4MSIsImV4cGFuZENhc2UiLCJlIiwic3ltw7gxIiwiZXFfw7gxIiwiYyIsInBhaXJzw7gxIiwiY29uZHPDuDEiLCJjb25kc8O4MiIsInJlc3VsdMO4MSIsInjDuDEiLCJ4c8O4MSIsImNvbnN0c8O4MSIsImV4cGFuZENvbmRwIiwicHJlZCIsInN5bV/DuDEiLCJjb21wYXJlw7gxIiwic3BsaXRzw7gxIiwic3BsaXRzIiwieHMiLCJfdGhyZWFkIiwiaW5zZXJ0Iiwic3ltIiwidGVzdCIsImZvcm3DuDIiLCJfY29uZFRocmVhZCIsImV4cGFuZENvbmRUaHJlYWRGaXJzdCIsImV4cGFuZENvbmRUaHJlYWRMYXN0IiwiX3NvbWVUaHJlYWQiLCJleHBhbmRTb21lVGhyZWFkRmlyc3QiLCJleHBhbmRTb21lVGhyZWFkTGFzdCIsImJ1aWxkRGVmdW4iLCJwcml2YXRlIiwiX2FuZEZvcm0iLCJkb2NQbHVzQm9keSIsImRvY8O4MSIsImZuw7gxIiwiZGVmT3DDuDEiLCJleHBhbmREZWZ1biIsImV4cGFuZERlZmNvbnN0IiwidmFsdWUiLCJleHBhbmRTZXRxIiwicGxhY2UiLCJleHBhbmRTZXRmIiwiZXhwYW5kTGF6eVNlcSIsImV4cGFuZFdoZW4iLCJleHBhbmRVbmxlc3MiLCJleHBhbmRJZkxldCIsImJpbmRpbmdzIiwidGhlbiIsImVsc2VfIiwibmFtZcO4MSIsImRlc3RydWN0dXJlIiwiZXhwYW5kV2hlbkxldCIsImV4cGFuZElmU29tZSIsImV4cGFuZFdoZW5Tb21lIiwiZXhwYW5kV2hlbkZpcnN0IiwiZXhwYW5kV2hpbGUiLCJleHBhbmREb3RvIiwiZXhwYW5kRG90aW1lcyIsIm7DuDEiLCJmb3JTdGVwIiwiY29udGV4dCIsImxvb3AiLCJtb2RpZmllcnMiLCJpdGVyw7gxIiwiY29sbMO4MSIsInN1YnNlccO4MSIsImJvZHlfw7gxIiwibmV4dMO4MSIsIm1vZHPDuDEiLCJib2R5w7gyIiwibcO4MSIsIml0ZW3DuDEiLCJhcmfDuDEiLCJwYXJlbkJpbmRpbmdzVG9WZWMiLCJmb3JNb2RpZmllcnMiLCJmb3JQYXJ0cyIsInNlcUV4cHJQYWlycyIsImluZGljZXPDuDEiLCJzZWdtZW50c8O4MSIsInNsaWNlIiwiZXhwYW5kRm9yIiwic2VxRXhwcnMiLCJib2R5RXhwciIsInBhcnRzw7gxIiwiJDEiLCIkMiIsImV4cGFuZERvc2VxIiwic3ltXyIsInN0cmluZyIsIndvcmRzw7gxIiwiYmluZFN5bV8iLCJzIiwiYiIsImNvbmpTeW1zXyIsImdldF8iLCJyZXN1bHQiLCJrIiwidiIsImYiLCJxdW90ZSIsImtOc8O4MSIsImfDuDEiLCJkaWN0R2V0XyIsImRpY3ROYW1lIiwiZGVmYXVsdHMiLCJiaW5kaW5nIiwia2V5Iiwic8O4MSIsImvDuDEiLCJkZXN0cnVjdHVyZURpY3QiLCJmcm9tIiwiZGljdE5hbWXDuDEiLCJkaWN0QmluZMO4MSIsImdldF/DuDEiLCJrc8O4MSIsInbDuDEiLCJrX8O4MSIsImRlc3RydWN0dXJlU2VxIiwiYXPDuDEiLCJmaW5kSW5kZXgiLCJzZXFOYW1lw7gxIiwiYmluZGluZzHDuDEiLCJtb3Jlw7gxIiwidGFpbMO4MSIsImJpbmRpbmcyw7gxIiwiacO4MSIsImJpbmROYW1lc18iLCJiaW5kSW5kaWNlc18iLCJuYW1lcyIsInBhaXIiLCJleHBhbmRMZXRfIiwiZXhwYW5kTGV0IiwiZ2Vuc3ltc8O4MSIsIl8iLCJvdXRlcsO4MSIsImciLCJpbm5lcsO4MSIsInBhcnNlQXJnbGlzdCIsInJlbWFpbmluZ8O4MSIsIm1vZGXDuDEiLCJuYW1lc8O4MSIsImRlZmF1bHRzw7gxIiwiZXhwYW5kTGFtYmRhIiwiZGVmc8O4MSIsInBhcnNlZMO4MSIsImJpbmRzw7gxIiwiYXJndsO4MSIsImRlc3RydWN0dXJpbmfDuDEiLCJpIiwiZGVmYXVsdGluZ8O4MSIsImQiLCJleHBhbmRMb29wIiwiYmluZGluZ3PDuDIiXSwibWFwcGluZ3MiOiI7SUFBQSxJQUFDQSxJLEdBQUQ7QUFBQSxRQUFBQyxFLEVBQUksZUFBSjtBQUFBLFFBQUFDLEcsRUFDRSx1Q0FERjtBQUFBLE07O1FBRThCQyxJQUFBLEcsU0FBQUEsSTtRQUFLQyxRQUFBLEcsU0FBQUEsUTtRQUFVQyxRQUFBLEcsU0FBQUEsUTtRQUFRQyxTQUFBLEcsU0FBQUEsUztRQUFTQyxPQUFBLEcsU0FBQUEsTztRQUNoQ0MsT0FBQSxHLFNBQUFBLE87UUFB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QUFELENBQWEsVUFBUzJMLEVBQVQsRUFBWUMsRUFBWixFQUFnQjtBQUFBLDJCLFlBQVE7QUFBQSw0QkFBQTdFLEcsWUFBRSxDLElBQUEsRTs0QkFBS29JLE87NEJBQU14RCxFOzRCQUFJbk4sS0FBRCxDQUFPb04sRUFBUCxDO3lCQUFkLENBQUY7QUFBQSx3QkFBOEI7QUFBQSw0QkFBQzdFLEdBQUQ7QUFBQSw0QkFBR0EsR0FBSDtBQUFBLDBCQUE5QjtBQUFBLHFCLEtBQVIsQyxJQUFBO0FBQUEsaUJBQTdCLEVBQ2FKLE9BRGIsQ0FBZCxDQUFMLEMsNEJBRUwsQyxJQUFBLEUsT0FBQSxDLFVBQVF2SSxHQUFELENBQU1TLE1BQUQsQ0FBUSxVQUFTOFEsQ0FBVCxFQUFZO0FBQUE7QUFBQSw0QkFBRW5SLEtBQUQsQ0FBYW1JLE9BQU4sQ0FBWWdKLENBQVosQ0FBUCxDQUFEO0FBQUEsNEJBQThCUixPQUFOLENBQVlRLENBQVosQ0FBeEI7QUFBQTtBQUFBLHFCQUFwQixFQUE2RHZFLFNBQTdELENBQUwsQyxPQUNKakcsSSxRQUpULENBRkYsQ0FQTTtBQUFBLEssS0FBUixDLElBQUEsRTtDQVBGLEM7QUFxQkMvQyxZQUFELEMsTUFBQSxFQUFxQjBOLFVBQXJCIiwic291cmNlc0NvbnRlbnQiOlsiKG5zIHdpc3AuZXhwYW5kZXJcbiAgXCJ3aXNwIHN5bnRheCBhbmQgbWFjcm8gZXhwYW5kZXIgbW9kdWxlXCJcbiAgKDpyZXF1aXJlIFt3aXNwLmFzdCA6cmVmZXIgW21ldGEgd2l0aC1tZXRhIHN5bWJvbD8ga2V5d29yZD8ga2V5d29yZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcXVvdGU/IHN5bWJvbCBuYW1lc3BhY2UgbmFtZSBnZW5zeW1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVucXVvdGU/IHVucXVvdGUtc3BsaWNpbmc/XV1cbiAgICAgICAgICAgIFt3aXNwLnNlcXVlbmNlIDpyZWZlciBbbGlzdD8gbGlzdCBjb25qIHBhcnRpdGlvbiBzZXEgcmVwZWF0ZWRseVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbXB0eT8gbWFwIG1hcHYgdmVjIHNldCBldmVyeT8gY29uY2F0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0IHNlY29uZCB0aGlyZCByZXN0IGxhc3QgbWFwY2F0IG50aFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidXRsYXN0IGludGVybGVhdmUgY29ucyBjb3VudCB0YWtlIGRpc3NvY1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb21lIGFzc29jIHJlZHVjZSBmaWx0ZXIgc2VxPyB6aXBtYXAgZHJvcFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXp5LXNlcSByYW5nZSByZXZlcnNlIGRvcnVuIG1hcC1pbmRleGVkXV1cbiAgICAgICAgICAgIFt3aXNwLnJ1bnRpbWUgOnJlZmVyIFtuaWw/IGRpY3Rpb25hcnk/IHZlY3Rvcj8ga2V5cyBnZXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWxzIHN0cmluZz8gbnVtYmVyPyBib29sZWFuP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGU/IHJlLXBhdHRlcm4/IGV2ZW4/IG9kZD8gPSBtYXhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmMgZGVjIGRpY3Rpb25hcnkgbWVyZ2Ugc3Vic11dXG4gICAgICAgICAgICBbd2lzcC5zdHJpbmcgOnJlZmVyIFtzcGxpdCBqb2luIGNhcGl0YWxpemVdXSkpXG5cblxuKGRlZnZhciAqKm1hY3JvcyoqIHt9KVxuXG4oZGVmdW4tIGV4cGFuZFxuICAoZXhwYW5kZXIgZm9ybSBlbnYpXG4gIFwiQXBwbGllcyBtYWNybyByZWdpc3RlcmVkIHdpdGggZ2l2ZW4gYG5hbWVgIHRvIGEgZ2l2ZW4gYGZvcm1gXCJcbiAgKGxldCogKChtZXRhZGF0YSAob3IgKG1ldGEgZm9ybSkge30pKVxuICAgICAgICAocGFybWFzIChyZXN0IGZvcm0pKVxuICAgICAgICAoaW1wbGljaXQgKG1hcCAobGFtYmRhICglKSAoY29uZCAoKD0gOiZmb3JtICUpIGZvcm0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICgoPSA6JmVudiAlKSBlbnYpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIChlbHNlICUpKSlcbiAgICAgICAgICAgICAgICAgICAgICAob3IgKDppbXBsaWNpdCAobWV0YSBleHBhbmRlcikpIFtdKSkpXG4gICAgICAgIChwYXJhbXMgKHZlYyAoY29uY2F0IGltcGxpY2l0ICh2ZWMgKHJlc3QgZm9ybSkpKSkpXG5cbiAgICAgICAgKGV4cGFuc2lvbiAoYXBwbHkgZXhwYW5kZXIgcGFyYW1zKSkpXG4gICAgKGlmIGV4cGFuc2lvblxuICAgICAgKHdpdGgtbWV0YSBleHBhbnNpb24gKGNvbmogbWV0YWRhdGEgKG1ldGEgZXhwYW5zaW9uKSkpXG4gICAgICBleHBhbnNpb24pKSlcblxuKGRlZnVuIGluc3RhbGwtbWFjcm8hXG4gIChvcCBleHBhbmRlcilcbiAgXCJSZWdpc3RlcnMgZ2l2ZW4gYG1hY3JvYCB3aXRoIGEgZ2l2ZW4gYG5hbWVgXCJcbiAgKHNldGYgKGdldCAqKm1hY3JvcyoqIChuYW1lIG9wKSkgZXhwYW5kZXIpKVxuXG4oZGVmdW4tIG1hY3JvXG4gIChvcClcbiAgXCJSZXR1cm5zIHRydWUgaWYgbWFjcm8gd2l0aCBhIGdpdmVuIG5hbWUgaXMgcmVnaXN0ZXJlZFwiXG4gIChhbmQgKHN5bWJvbD8gb3ApXG4gICAgICAgKGdldCAqKm1hY3JvcyoqIChuYW1lIG9wKSkpKVxuXG5cbihkZWZ1biBkb3Qtc3ludGF4P1xuICAob3ApXG4gIChhbmQgKHN5bWJvbD8gb3ApIChpZGVudGljYWw/IFxcLiAobmFtZSBvcCkpKSlcblxuKGRlZnVuIG1ldGhvZC1zeW50YXg/XG4gIChvcClcbiAgKGxldCogKChpZCAoYW5kIChzeW1ib2w/IG9wKSAobmFtZSBvcCkpKSlcbiAgICAoYW5kIGlkXG4gICAgICAgICAoaWRlbnRpY2FsPyBcXC4gKGZpcnN0IGlkKSlcbiAgICAgICAgIChub3QgKGlkZW50aWNhbD8gXFwtIChzZWNvbmQgaWQpKSlcbiAgICAgICAgIChub3QgKGlkZW50aWNhbD8gXFwuIGlkKSkpKSlcblxuKGRlZnVuIGZpZWxkLXN5bnRheD9cbiAgKG9wKVxuICAobGV0KiAoKGlkIChhbmQgKHN5bWJvbD8gb3ApIChuYW1lIG9wKSkpKVxuICAgIChhbmQgaWRcbiAgICAgICAgIChpZGVudGljYWw/IFxcLiAoZmlyc3QgaWQpKVxuICAgICAgICAgKGlkZW50aWNhbD8gXFwtIChzZWNvbmQgaWQpKSkpKVxuXG4oZGVmdW4gbmV3LXN5bnRheD9cbiAgKG9wKVxuICAobGV0KiAoKGlkIChhbmQgKHN5bWJvbD8gb3ApIChuYW1lIG9wKSkpKVxuICAgIChhbmQgaWRcbiAgICAgICAgIChpZGVudGljYWw/IFxcLiAobGFzdCBpZCkpXG4gICAgICAgICAobm90IChpZGVudGljYWw/IFxcLiBpZCkpKSkpXG5cbihkZWZ1biBtZXRob2Qtc3ludGF4XG4gIChvcCB0YXJnZXQgJnJlc3QgcGFyYW1zKVxuICBcIkV4YW1wbGU6XG4gICcoLnN1YnN0cmluZyBzdHJpbmcgMiA1KSA9PiAnKChhZ2V0IHN0cmluZyAnc3Vic3RyaW5nKSAyIDUpXCJcbiAgKGxldCogKChvcC1tZXRhIChtZXRhIG9wKSlcbiAgICAgICAgKGZvcm0tc3RhcnQgKDpzdGFydCBvcC1tZXRhKSlcbiAgICAgICAgKHRhcmdldC1tZXRhIChtZXRhIHRhcmdldCkpXG4gICAgICAgIChtZW1iZXIgKHdpdGgtbWV0YSAoc3ltYm9sIChzdWJzIChuYW1lIG9wKSAxKSlcbiAgICAgICAgICAgICAgICAgOzsgSW5jbHVkZSBtZXRhZGF0IGZyb20gdGhlIG9yaWdpbmFsIHN5bWJvbCBqdXN0XG4gICAgICAgICAgICAgICAgIChjb25qIG9wLW1ldGFcbiAgICAgICAgICAgICAgICAgICAgICAgezpzdGFydCB7OmxpbmUgKDpsaW5lIGZvcm0tc3RhcnQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpjb2x1bW4gKGluYyAoOmNvbHVtbiBmb3JtLXN0YXJ0KSl9fSkpKVxuICAgICAgICA7OyBBZGQgbWV0YWRhdGEgdG8gYWdldCBzeW1ib2wgdGhhdCB3aWxsIG1hcCB0byB0aGUgZmlyc3QgYC5gXG4gICAgICAgIDs7IGNoYXJhY3RlciBvZiB0aGUgbWV0aG9kIG5hbWUuXG4gICAgICAgIChhZ2V0ICh3aXRoLW1ldGEgJ2FnZXRcbiAgICAgICAgICAgICAgIChjb25qIG9wLW1ldGFcbiAgICAgICAgICAgICAgICAgICAgIHs6ZW5kIHs6bGluZSAoOmxpbmUgZm9ybS1zdGFydClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Y29sdW1uIChpbmMgKDpjb2x1bW4gZm9ybS1zdGFydCkpfX0pKSlcblxuICAgICAgICA7OyBGaXJzdCB0d28gZm9ybXMgKC5zdWJzdHJpbmcgc3RyaW5nIC4uLikgZXhwYW5kIHRvXG4gICAgICAgIDs7ICgoYWdldCBzdHJpbmcgJ3N1YnN0cmluZykgLi4uKSB0aGVyZSBmb3IgZXhwYW5zaW9uIGdldHNcbiAgICAgICAgOzsgcG9zaXRpb24gbWV0YWRhdGEgZnJvbSBzdGFydCBvZiB0aGUgZmlyc3QgYC5zdWJzdHJpbmdgIGZvcm1cbiAgICAgICAgOzsgdG8gdGhlIGVuZCBvZiB0aGUgYHN0cmluZ2AgZm9ybS5cbiAgICAgICAgKG1ldGhvZCAod2l0aC1tZXRhIGAoLGFnZXQgLHRhcmdldCAocXVvdGUgLG1lbWJlcikpXG4gICAgICAgICAgICAgICAgIChjb25qIG9wLW1ldGFcbiAgICAgICAgICAgICAgICAgICAgICAgezplbmQgKDplbmQgKG1ldGEgdGFyZ2V0KSl9KSkpKVxuICAgIChpZiAobmlsPyB0YXJnZXQpXG4gICAgICAodGhyb3cgKEVycm9yIFwiTWFsZm9ybWVkIG1ldGhvZCBleHByZXNzaW9uLCBleHBlY3RpbmcgKC5tZXRob2Qgb2JqZWN0IC4uLilcIikpXG4gICAgICBgKCxtZXRob2QgLEBwYXJhbXMpKSkpXG5cbihkZWZ1biBmaWVsZC1zeW50YXhcbiAgKGZpZWxkIHRhcmdldCAmcmVzdCBtb3JlKVxuICBcIkV4YW1wbGU6XG4gICcoLi1maWVsZCBvYmplY3QpID0+ICcoYWdldCBvYmplY3QgJ2ZpZWxkKVwiXG4gIChsZXQqICgobWV0YWRhdGEgKG1ldGEgZmllbGQpKVxuICAgICAgICAoc3RhcnQgKDpzdGFydCBtZXRhZGF0YSkpXG4gICAgICAgIChlbmQgKDplbmQgbWV0YWRhdGEpKVxuICAgICAgICAobWVtYmVyICh3aXRoLW1ldGEgKHN5bWJvbCAoc3VicyAobmFtZSBmaWVsZCkgMikpXG4gICAgICAgICAgICAgICAgIChjb25qIG1ldGFkYXRhXG4gICAgICAgICAgICAgICAgICAgICAgIHs6c3RhcnQgezpsaW5lICg6bGluZSBzdGFydClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmNvbHVtbiAoKyAoOmNvbHVtbiBzdGFydCkgMil9fSkpKSlcbiAgICAoaWYgKG9yIChuaWw/IHRhcmdldClcbiAgICAgICAgICAgIChjb3VudCBtb3JlKSlcbiAgICAgICh0aHJvdyAoRXJyb3IgXCJNYWxmb3JtZWQgbWVtYmVyIGV4cHJlc3Npb24sIGV4cGVjdGluZyAoLi1tZW1iZXIgdGFyZ2V0KVwiKSlcbiAgICAgIGAoYWdldCAsdGFyZ2V0IChxdW90ZSAsbWVtYmVyKSkpKSlcblxuKGRlZnVuIGRvdC1zeW50YXhcbiAgKG9wIHRhcmdldCBmaWVsZCAmcmVzdCBwYXJhbXMpXG4gIFwiRXhhbXBsZTpcbiAgJyguIG9iamVjdCAtZmllbGQpID0+ICcoYWdldCBvYmplY3QgJ2ZpZWxkKVxuICAnKC4gc3RyaW5nIHN1YnN0cmluZyAyIDUpID0+ICcoKGFnZXQgc3RyaW5nICdzdWJzdHJpbmcpIDIgNSlcIlxuICAoaWYtbm90IChzeW1ib2w/IGZpZWxkKVxuICAgICh0aHJvdyAoRXJyb3IgXCJNYWxmb3JtZWQgLiBmb3JtXCIpKSlcbiAgKGxldCogKCgqZmllbGQgKG5hbWUgZmllbGQpKSlcbiAgICAoYXBwbHkgKGlmIChpZGVudGljYWw/IFxcLSAoZmlyc3QgKmZpZWxkKSkgZmllbGQtc3ludGF4IG1ldGhvZC1zeW50YXgpXG4gICAgICAgICAgIChzeW1ib2wgKHN0ciBcXC4gKmZpZWxkKSkgdGFyZ2V0IHBhcmFtcykpKVxuXG4oZGVmdW4gbmV3LXN5bnRheFxuICAob3AgJnJlc3QgcGFyYW1zKVxuICBcIkV4YW1wbGU6XG4gICcoUG9pbnQuIHggeSkgPT4gJyhuZXcgUG9pbnQgeCB5KVwiXG4gIChsZXQqICgoaWQgKG5hbWUgb3ApKVxuICAgICAgICAoaWQtbWV0YSAoOm1ldGEgaWQpKVxuICAgICAgICAocmVuYW1lIChzdWJzIGlkIDAgKGRlYyAoY291bnQgaWQpKSkpXG4gICAgICAgIDs7IGNvbnN0cnVjdHVyIHN5bWJvbCBpbmhlcml0cyBtZXRhZGEgZnJvbSB0aGUgZmlyc3QgYG9wYCBmb3JtXG4gICAgICAgIDs7IGl0J3MganVzdCBpdCdzIGVuZCBjb2x1bW4gaW5mbyBpcyB1cGRhdGVkIHRvIHJlZmxlY3Qgc3VidHJhY3Rpb25cbiAgICAgICAgOzsgb2YgYC5gIGNoYXJhY3Rlci5cbiAgICAgICAgKGNvbnN0cnVjdG9yICh3aXRoLW1ldGEgKHN5bWJvbCByZW5hbWUpXG4gICAgICAgICAgICAgICAgICAgICAgKGNvbmogaWQtbWV0YVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHs6ZW5kIHs6bGluZSAoOmxpbmUgKDplbmQgaWQtbWV0YSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpjb2x1bW4gKGRlYyAoOmNvbHVtbiAoOmVuZCBpZC1tZXRhKSkpfX0pKSlcbiAgICAgICAgKG9wZXJhdG9yICh3aXRoLW1ldGEgJ25ld1xuICAgICAgICAgICAgICAgICAgIChjb25qIGlkLW1ldGFcbiAgICAgICAgICAgICAgICAgICAgICAgICB7OnN0YXJ0IHs6bGluZSAoOmxpbmUgKDplbmQgaWQtbWV0YSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmNvbHVtbiAoZGVjICg6Y29sdW1uICg6ZW5kIGlkLW1ldGEpKSl9fSkpKSlcbiAgICBgKG5ldyAsY29uc3RydWN0b3IgLEBwYXJhbXMpKSlcblxuKGRlZnVuIGtleXdvcmQtaW52b2tlXG4gIChrZXl3b3JkIHRhcmdldCAmcmVzdCBhcmdzKVxuICBcIkNhbGxpbmcgYSBrZXl3b3JkIGRlc3VnYXJzIHRvIHByb3BlcnR5IGFjY2VzcyB3aXRoIHRoYXRcbiAga2V5d29yZCBuYW1lIG9uIHRoZSBnaXZlbiBhcmd1bWVudDpcbiAgJyg6Zm9vIGJhcikgPT4gJyhnZXQgYmFyIDpmb28pXCJcbiAgKGlmIChlbXB0eT8gYXJncylcbiAgICBgKGdldCAsdGFyZ2V0ICxrZXl3b3JkKVxuICAgIGAoZ2V0ICx0YXJnZXQgLGtleXdvcmQgLChmaXJzdCBhcmdzKSkpKVxuXG4oZGVmdW4tIGRlc3VnYXJcbiAgKGV4cGFuZGVyIGZvcm0pXG4gIChsZXQqICgoZGVzdWdhcmVkIChhcHBseSBleHBhbmRlciAodmVjIGZvcm0pKSlcbiAgICAgICAgKG1ldGFkYXRhIChjb25qIHt9IChtZXRhIGZvcm0pIChtZXRhIGRlc3VnYXJlZCkpKSlcbiAgICAod2l0aC1tZXRhIGRlc3VnYXJlZCBtZXRhZGF0YSkpKVxuXG4oZGVmdW4gbWFjcm9leHBhbmQtMVxuICAoZm9ybSBlbnYpXG4gIFwiSWYgZm9ybSByZXByZXNlbnRzIGEgbWFjcm8gZm9ybSwgcmV0dXJucyBpdHMgZXhwYW5zaW9uLFxuICBlbHNlIHJldHVybnMgZm9ybS5cIlxuICAobGV0KiAoKG9wIChhbmQgKGxpc3Q/IGZvcm0pXG4gICAgICAgICAgICAgICAgKGZpcnN0IGZvcm0pKSlcbiAgICAgICAgKGV4cGFuZGVyIChtYWNybyBvcCkpKVxuICAgIChjb25kIChleHBhbmRlciAoZXhwYW5kIGV4cGFuZGVyIGZvcm0gZW52KSlcbiAgICAgICAgICA7OyBDYWxsaW5nIGEga2V5d29yZCBjb21waWxlcyB0byBnZXR0aW5nIHZhbHVlIGZyb20gZ2l2ZW5cbiAgICAgICAgICA7OyBvYmplY3QgYXNzb2NpYXRlZCB3aXRoIHRoYXQga2V5OlxuICAgICAgICAgIDs7ICcoOmZvbyBiYXIpID0+ICcoZ2V0IGJhciA6Zm9vKVxuICAgICAgICAgICgoa2V5d29yZD8gb3ApIChkZXN1Z2FyIGtleXdvcmQtaW52b2tlIGZvcm0pKVxuICAgICAgICAgIDs7ICcoLiBvYmplY3QgbWV0aG9kIGZvbyBiYXIpID0+ICcoKGFnZXQgb2JqZWN0IG1ldGhvZCkgZm9vIGJhcilcbiAgICAgICAgICAoKGRvdC1zeW50YXg/IG9wKSAoZGVzdWdhciBkb3Qtc3ludGF4IGZvcm0pKVxuICAgICAgICAgIDs7ICcoLi1maWVsZCBvYmplY3QpID0+ICcoYWdldCBvYmplY3QgJ2ZpZWxkKVxuICAgICAgICAgICgoZmllbGQtc3ludGF4PyBvcCkgKGRlc3VnYXIgZmllbGQtc3ludGF4IGZvcm0pKVxuICAgICAgICAgIDs7ICcoLnN1YnN0cmluZyBzdHJpbmcgMiA1KSA9PiAnKChhZ2V0IHN0cmluZyAnc3Vic3RyaW5nKSAyIDUpXG4gICAgICAgICAgKChtZXRob2Qtc3ludGF4PyBvcCkgKGRlc3VnYXIgbWV0aG9kLXN5bnRheCBmb3JtKSlcbiAgICAgICAgICA7OyAnKFBvaW50LiB4IHkpID0+ICcobmV3IFBvaW50IHggeSlcbiAgICAgICAgICAoKG5ldy1zeW50YXg/IG9wKSAoZGVzdWdhciBuZXctc3ludGF4IGZvcm0pKVxuICAgICAgICAgIChlbHNlIGZvcm0pKSkpXG5cbihkZWZ1biBtYWNyb2V4cGFuZFxuICAoZm9ybSBlbnYpXG4gIFwiUmVwZWF0ZWRseSBjYWxscyBtYWNyb2V4cGFuZC0xIG9uIGZvcm0gdW50aWwgaXQgbm8gbG9uZ2VyXG4gIHJlcHJlc2VudHMgYSBtYWNybyBmb3JtLCB0aGVuIHJldHVybnMgaXQuXCJcbiAgKGxvb3AgKChvcmlnaW5hbCBmb3JtKVxuICAgICAgICAgKGV4cGFuZGVkIChtYWNyb2V4cGFuZC0xIGZvcm0gZW52KSkpXG4gICAgKGlmIChpZGVudGljYWw/IG9yaWdpbmFsIGV4cGFuZGVkKVxuICAgICAgb3JpZ2luYWxcbiAgICAgIChyZWN1ciBleHBhbmRlZCAobWFjcm9leHBhbmQtMSBleHBhbmRlZCBlbnYpKSkpKVxuXG5cbjs7IERlZmluZSBjb3JlIG1hY3Jvc1xuXG5cbjs7IFRPRE8gbWFrZSB0aGlzIGxhbmd1YWdlIGluZGVwZW5kZW50XG5cbihkZWZ1biBzeW50YXgtcXVvdGUgKGZvcm0pXG4gIChjb25kICgoc3ltYm9sPyBmb3JtKSAobGlzdCAncXVvdGUgZm9ybSkpXG4gICAgICAgICgoa2V5d29yZD8gZm9ybSkgKGxpc3QgJ3F1b3RlIGZvcm0pKVxuICAgICAgICAoKG9yIChudW1iZXI/IGZvcm0pXG4gICAgICAgICAgICAoc3RyaW5nPyBmb3JtKVxuICAgICAgICAgICAgKGJvb2xlYW4/IGZvcm0pXG4gICAgICAgICAgICAobmlsPyBmb3JtKVxuICAgICAgICAgICAgKHJlLXBhdHRlcm4/IGZvcm0pKSBmb3JtKVxuXG4gICAgICAgICgodW5xdW90ZT8gZm9ybSkgKHNlY29uZCBmb3JtKSlcbiAgICAgICAgKCh1bnF1b3RlLXNwbGljaW5nPyBmb3JtKSAocmVhZGVyLWVycm9yIFwiSWxsZWdhbCB1c2Ugb2YgYCxAYCBleHByZXNzaW9uLCBjYW4gb25seSBiZSBwcmVzZW50IGluIGEgbGlzdFwiKSlcblxuICAgICAgICAoKGVtcHR5PyBmb3JtKSBmb3JtKVxuXG4gICAgICAgIDs7XG4gICAgICAgICgoZGljdGlvbmFyeT8gZm9ybSkgKGxpc3QgJ2FwcGx5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGljdGlvbmFyeVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGNvbnMgJy5jb25jYXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChzZXF1ZW5jZS1leHBhbmQgKGFwcGx5IGNvbmNhdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHNlcSBmb3JtKSkpKSkpXG4gICAgICAgIDs7IElmIGEgdmVjdG9yIGZvcm0gZXhwYW5kIGFsbCBzdWItZm9ybXMgYW5kIGNvbmNhdGVuYXRlXG4gICAgICAgIDs7IHRoZW0gdG9nZXRoZXI6XG4gICAgICAgIDs7XG4gICAgICAgIDs7IFssYSBiICxAY10gLT4gKC5jb25jYXQgW2FdIFsocXVvdGUgYildIGMpXG4gICAgICAgICgodmVjdG9yPyBmb3JtKSAoY29ucyAnLmNvbmNhdCAoc2VxdWVuY2UtZXhwYW5kIGZvcm0pKSlcblxuICAgICAgICA7OyBJZiBhIGxpc3QgZm9ybSBleHBhbmQgYWxsIHRoZSBzdWItZm9ybXMgYW5kIGFwcGx5XG4gICAgICAgIDs7IGNvbmNhdGVuYXRpb24gdG8gYSBsaXN0IGNvbnN0cnVjdG9yOlxuICAgICAgICA7O1xuICAgICAgICA7OyAoLGEgYiAsQGMpIC0+IChhcHBseSBsaXN0ICguY29uY2F0IFthXSBbKHF1b3RlIGIpXSBjKSlcbiAgICAgICAgKChsaXN0PyBmb3JtKSAoaWYgKGVtcHR5PyBmb3JtKVxuICAgICAgICAgICAgICAgICAgICAgICAoY29ucyAnbGlzdCBuaWwpXG4gICAgICAgICAgICAgICAgICAgICAgIChsaXN0ICdhcHBseVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnbGlzdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoY29ucyAnLmNvbmNhdCAoc2VxdWVuY2UtZXhwYW5kIGZvcm0pKSkpKVxuXG4gICAgICAgIChlbHNlIChyZWFkZXItZXJyb3IgXCJVbmtub3duIENvbGxlY3Rpb24gdHlwZVwiKSkpKVxuKGRlZnZhciBzeW50YXgtcXVvdGUtZXhwYW5kIHN5bnRheC1xdW90ZSlcblxuKGRlZnVuIHVucXVvdGUtc3BsaWNpbmctZXhwYW5kXG4gIChmb3JtKVxuICAoaWYgKHZlY3Rvcj8gZm9ybSlcbiAgICBmb3JtXG4gICAgKGxpc3QgJ3ZlYyBmb3JtKSkpXG5cbihkZWZ1biBzZXF1ZW5jZS1leHBhbmRcbiAgKGZvcm1zKVxuICBcIlRha2VzIHNlcXVlbmNlIG9mIGZvcm1zIGFuZCBleHBhbmRzIHRoZW06XG5cbiAgKCh1bnF1b3RlIGEpKSAtPiAoW2FdKVxuICAoKHVucXVvdGUtc3BsaWNpbmcgYSkpIC0+IChhKVxuICAoYSkgLT4gKFsocXVvdGUgYildKVxuICAoKHVucXVvdGUgYSkgYiAodW5xdW90ZS1zcGxpY2luZyBhKSkgLT4gKFthXSBbKHF1b3RlIGIpXSBjKVwiXG4gIChtYXAgKGxhbWJkYSAoZm9ybSlcbiAgICAgICAgIChjb25kICgodW5xdW90ZT8gZm9ybSkgWyhzZWNvbmQgZm9ybSldKVxuICAgICAgICAgICAgICAgKCh1bnF1b3RlLXNwbGljaW5nPyBmb3JtKSAodW5xdW90ZS1zcGxpY2luZy1leHBhbmQgKHNlY29uZCBmb3JtKSkpXG4gICAgICAgICAgICAgICAoZWxzZSBbKHN5bnRheC1xdW90ZS1leHBhbmQgZm9ybSldKSkpXG4gICAgICAgZm9ybXMpKVxuKGluc3RhbGwtbWFjcm8hIDpzeW50YXgtcXVvdGUgc3ludGF4LXF1b3RlLWV4cGFuZClcblxuOzsgVE9ETzogTmV3IHJlYWRlciB0cmFuc2xhdGVzIG5vdD0gY29ycmVjdGx5XG47OyBidXQgZm9yIHRoZSB0aW1lIGJlaW5nIHVzZSBub3QtZXF1YWwgbmFtZVxuKGRlZnVuIGV4cGFuZC1ub3QtZXF1YWxcbiAgKCZyZXN0IGJvZHkpXG4gIGAobm90ICg9ICxAYm9keSkpKVxuKGluc3RhbGwtbWFjcm8hIDpub3Q9IGV4cGFuZC1ub3QtZXF1YWwpXG5cbihkZWZ1biBleHBhbmQtaWYtbm90XG4gIChjb25kaXRpb24gdHJ1dGh5IGFsdGVybmF0aXZlKVxuICBcIkNvbXBsZW1lbnRzIHRoZSBgaWZgIGV4Y2x1c2l2ZSBjb25kaXRpb25hbCBicmFuY2guXCJcbiAgYChpZiAobm90ICxjb25kaXRpb24pICx0cnV0aHkgLGFsdGVybmF0aXZlKSlcbihpbnN0YWxsLW1hY3JvISA6aWYtbm90IGV4cGFuZC1pZi1ub3QpXG5cbihkZWZ1biBleHBhbmQtY29tbWVudFxuICAoJnJlc3QgYm9keSlcbiAgXCJJZ25vcmVzIGJvZHksIHlpZWxkcyBuaWxcIlxuICBuaWwpXG4oaW5zdGFsbC1tYWNybyEgOmNvbW1lbnQgZXhwYW5kLWNvbW1lbnQpXG5cbihkZWZ1biBleHBhbmQtdGhyZWFkLWZpcnN0XG4gICgmcmVzdCBvcGVyYXRpb25zKVxuICBcIlRocmVhZCBmaXJzdCBtYWNyb1wiXG4gIChyZWR1Y2VcbiAgICAobGFtYmRhIChmb3JtIG9wZXJhdGlvbilcbiAgICAgIChjb25zIChmaXJzdCBvcGVyYXRpb24pXG4gICAgICAgICAgICAoY29ucyBmb3JtIChyZXN0IG9wZXJhdGlvbikpKSlcbiAgICAoZmlyc3Qgb3BlcmF0aW9ucylcbiAgICAobWFwIChsYW1iZGEgKCUpIChpZiAobGlzdD8gJSkgJSBgKCwlKSkpXG4gICAgICAgICAocmVzdCBvcGVyYXRpb25zKSkpKVxuKGluc3RhbGwtbWFjcm8hIDotPiBleHBhbmQtdGhyZWFkLWZpcnN0KVxuXG4oZGVmdW4gZXhwYW5kLXRocmVhZC1sYXN0XG4gICgmcmVzdCBvcGVyYXRpb25zKVxuICBcIlRocmVhZCBsYXN0IG1hY3JvXCJcbiAgKHJlZHVjZVxuICAgIChsYW1iZGEgKGZvcm0gb3BlcmF0aW9uKSAoY29uY2F0IG9wZXJhdGlvbiBbZm9ybV0pKVxuICAgIChmaXJzdCBvcGVyYXRpb25zKVxuICAgIChtYXAgKGxhbWJkYSAoJSkgKGlmIChsaXN0PyAlKSAlIGAoLCUpKSlcbiAgICAgICAgIChyZXN0IG9wZXJhdGlvbnMpKSkpXG4oaW5zdGFsbC1tYWNybyEgOi0+PiBleHBhbmQtdGhyZWFkLWxhc3QpXG5cbihkZWZ1biBleHBhbmQtZG90c1xuICAoeCAmcmVzdCBmb3JtcylcbiAgXCJmb3JtID0+IGZpZWxkTmFtZS1zeW1ib2wgb3IgKGluc3RhbmNlTWV0aG9kTmFtZS1zeW1ib2wgYXJncyopXG4gIEV4cGFuZHMgaW50byBhIG1lbWJlciBhY2Nlc3MgKC4pIG9mIHRoZSBmaXJzdCBtZW1iZXIgb24gdGhlIGZpcnN0XG4gIGFyZ3VtZW50LCBmb2xsb3dlZCBieSB0aGUgbmV4dCBtZW1iZXIgb24gdGhlIHJlc3VsdCwgZXRjLiBGb3JcbiAgaW5zdGFuY2U6XG4gICguLiBkb2N1bWVudCAtYm9keSAoZ2V0LWF0dHJpYnV0ZSA6Y2xhc3MpKVxuICBleHBhbmRzIHRvOlxuICAoLiAoLiBkb2N1bWVudCAtYm9keSkgZ2V0LWF0dHJpYnV0ZSA6Y2xhc3MpXG4gIGJ1dCBpcyBlYXNpZXIgdG8gd3JpdGUsIHJlYWQsIGFuZCB1bmRlcnN0YW5kLlwiXG4gIGAoLT4gLHggLEAobWFwIChsYW1iZGEgKCUpIChpZiAobGlzdD8gJSkgKGNvbnMgJy4gJSkgKGxpc3QgJy4gJSkpKVxuICAgICAgICAgICAgICAgICBmb3JtcykpKVxuKGluc3RhbGwtbWFjcm8hIDouLiBleHBhbmQtZG90cylcblxuKGRlZnVuIGV4cGFuZC10aHJlYWQtYXNcbiAgKGV4cHIgbmFtZSAmcmVzdCBmb3JtcylcbiAgXCJCaW5kcyBuYW1lIHRvIGV4cHIsIGV2YWx1YXRlcyB0aGUgZmlyc3QgZm9ybSBpbiB0aGUgbGV4aWNhbCBjb250ZXh0XG4gIG9mIHRoYXQgYmluZGluZywgdGhlbiBiaW5kcyBuYW1lIHRvIHRoYXQgcmVzdWx0LCByZXBlYXRpbmcgZm9yIGVhY2hcbiAgc3VjY2Vzc2l2ZSBmb3JtLCByZXR1cm5pbmcgdGhlIHJlc3VsdCBvZiB0aGUgbGFzdCBmb3JtLlwiXG4gIGAobGV0KiogWyxuYW1lICxleHByXG4gICAgICAgICAgICxAKG1hcGNhdCAobGFtYmRhIChmb3JtKSBbbmFtZSBmb3JtXSlcbiAgICAgICAgICAgICAgICAgICAgIGZvcm1zKV1cbiAgICAgLG5hbWUpKVxuKGluc3RhbGwtbWFjcm8hIDphcy0+IGV4cGFuZC10aHJlYWQtYXMpXG5cblxuKGRlZnVuIGV4cGFuZC1jb25kXG4gICgmcmVzdCBjbGF1c2VzKVxuICBcIlRha2VzIGEgc2V0IG9mICh0ZXN0IGJvZHkqKSBwYXJlbiBjbGF1c2VzLiBJdCBldmFsdWF0ZXMgZWFjaCB0ZXN0XG4gIG9uZSBhdCBhIHRpbWUuICBJZiBhIHRlc3QgcmV0dXJucyBsb2dpY2FsIHRydWUsIGNvbmQgZXZhbHVhdGVzIGFuZFxuICByZXR1cm5zIHRoZSB2YWx1ZSBvZiB0aGUgY29ycmVzcG9uZGluZyBib2R5IChhbiBpbXBsaWNpdCBwcm9nbikgYW5kXG4gIGRvZXNuJ3QgZXZhbHVhdGUgYW55IG9mIHRoZSBvdGhlciB0ZXN0cyBvciBib2RpZXMuIFRoZSBiYXJlIHN5bWJvbFxuICBgZWxzZWAgaXMgdGhlIGNhdGNoLWFsbCBjbGF1c2UuIChjb25kKSByZXR1cm5zIG5pbC5cIlxuICAoaWYgKG5vdCAoZW1wdHk/IGNsYXVzZXMpKVxuICAgIChsZXQqICgoY2xhdXNlIChmaXJzdCBjbGF1c2VzKSkgKHRlc3QgKGZpcnN0IGNsYXVzZSkpIChib2R5IChyZXN0IGNsYXVzZSkpKVxuICAgICAgKGlmICg9IHRlc3QgJ2Vsc2UpXG4gICAgICAgIGAocHJvZ24gLEBib2R5KVxuICAgICAgICBgKGlmICx0ZXN0IChwcm9nbiAsQGJvZHkpIChjb25kICxAKHJlc3QgY2xhdXNlcykpKSkpKSlcbihpbnN0YWxsLW1hY3JvISA6Y29uZCBleHBhbmQtY29uZClcblxuKGRlZnVuIGV4cGFuZC1jYXNlXG4gIChlICZyZXN0IGNsYXVzZXMpXG4gIFwiVGFrZXMgYW4gZXhwcmVzc2lvbiwgYW5kIGEgc2V0IG9mICh0ZXN0LWNvbnN0YW50IGJvZHkqKSBwYXJlblxuICBjbGF1c2VzLCBvciAoKHRlc3QtY29uc3RhbnQxIC4uLiB0ZXN0LWNvbnN0YW50TikgYm9keSopIHRvIGdyb3VwXG4gIHNldmVyYWwgY29uc3RhbnRzIHVuZGVyIG9uZSBib2R5LiBUaGUgYmFyZSBzeW1ib2wgYGVsc2VgIGlzIHRoZVxuICBjYXRjaC1hbGwgY2xhdXNlLiBUZXN0LWNvbnN0YW50cyBhcmUgbm90IGV2YWx1YXRlZCAtLSB0aGV5IG11c3QgYmVcbiAgY29tcGlsZS10aW1lIGxpdGVyYWxzIGFuZCBuZWVkIG5vdCBiZSBxdW90ZWQuIElmIG5vIGNsYXVzZSBtYXRjaGVzXG4gIGFuZCBubyBgZWxzZWAgY2xhdXNlIHdhcyBnaXZlbiwgYW4gRXJyb3IgaXMgdGhyb3duLlxuXG4gIFVubGlrZSBjb25kL2NvbmRwLCBjYXNlJ3MgZGlzcGF0Y2ggaXMgbm90IGV2YWx1YXRlZCBzZXF1ZW50aWFsbHkgYXRcbiAgcnVudGltZSBoZXJlIChpdCdzIHN0aWxsIGxvd2VyZWQgdG8gYSBgY29uZGAgY2hhaW4gZm9yIG5vdyAtLSBhXG4gIGNvbnN0YW50LXRpbWUgZGlzcGF0Y2ggaXMgYW4gb3B0aW1pc2F0aW9uLCBub3QgYSBzZW1hbnRpY1xuICByZXF1aXJlbWVudCBvZiB0aGUgc3BlYykuXG5cbiAgRGVwZW5kcyBvbiA9XCJcbiAgKGxldCogKChzeW0gKGlmIChzeW1ib2w/IGUpIGUgKGdlbnN5bSA6Y2FzZS1iaW5kaW5nKSkpXG4gICAgICAgIChlcSogKGxhbWJkYSAoYykgYCg9ICxzeW0gJyxjKSkpKVxuICAgIChsb29wICgocGFpcnMgY2xhdXNlcykgKGNvbmRzIFtdKSlcbiAgICAgIChpZiAoZW1wdHk/IHBhaXJzKVxuICAgICAgICAobGV0KiAoKGNvbmRzIChpZiAoc29tZSAobGFtYmRhICglKSAoPSAoZmlyc3QgJSkgJ2Vsc2UpKSBjb25kcylcbiAgICAgICAgICAgICAgICAgICAgICBjb25kc1xuICAgICAgICAgICAgICAgICAgICAgIChjb25qIGNvbmRzIChsaXN0ICdlbHNlIGAodGhyb3cgKEVycm9yIChzdHIgXCJObyBtYXRjaGluZyBjbGF1c2U6IFwiICxzeW0pKSkpKSkpXG4gICAgICAgICAgICAgIChyZXN1bHQgKGNvbnMgJ2NvbmQgY29uZHMpKSlcbiAgICAgICAgICAoaWYgKD0gZSBzeW0pIHJlc3VsdCBgKGxldCogKCgsc3ltICxlKSkgLHJlc3VsdCkpKVxuICAgICAgICAobGV0KiAoKHggKGZpcnN0IHBhaXJzKSkgKHhzIChyZXN0IHBhaXJzKSkgKGNvbnN0cyAoZmlyc3QgeCkpIChib2R5IChyZXN0IHgpKSlcbiAgICAgICAgICAocmVjdXIgeHMgKGNvbmogY29uZHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKGlmICg9IGNvbnN0cyAnZWxzZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoY29ucyAnZWxzZSBib2R5KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChjb25zIChpZi1ub3QgKGxpc3Q/IGNvbnN0cykgKGVxKiBjb25zdHMpIGAob3IgLEAobWFwIGVxKiBjb25zdHMpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib2R5KSkpKSkpKSkpXG4oaW5zdGFsbC1tYWNybyEgOmNhc2UgZXhwYW5kLWNhc2UpXG5cbihkZWZ1biBleHBhbmQtY29uZHBcbiAgKHByZWQgZXhwciAmcmVzdCBjbGF1c2VzKVxuICBcIlRha2VzIGEgYmluYXJ5IHByZWRpY2F0ZSwgYW4gZXhwcmVzc2lvbiwgYW5kIGEgc2V0IG9mIGNsYXVzZXMuXG4gIEVhY2ggY2xhdXNlIGNhbiB0YWtlIHRoZSBmb3JtIG9mIGVpdGhlcjpcblxuICB0ZXN0LWV4cHIgcmVzdWx0LWV4cHJcbiAgdGVzdC1leHByIDo+PiByZXN1bHQtZm5cblxuICBOb3RlIDo+PiBpcyBhbiBvcmRpbmFyeSBrZXl3b3JkLlxuXG4gIEZvciBlYWNoIGNsYXVzZSwgKHByZWQgdGVzdC1leHByIGV4cHIpIGlzIGV2YWx1YXRlZC4gSWYgaXQgcmV0dXJuc1xuICBsb2dpY2FsIHRydWUsIHRoZSBjbGF1c2UgaXMgYSBtYXRjaC4gSWYgYSBiaW5hcnkgY2xhdXNlIG1hdGNoZXMsIHRoZVxuICByZXN1bHQtZXhwciBpcyByZXR1cm5lZCwgaWYgYSB0ZXJuYXJ5IGNsYXVzZSBtYXRjaGVzLCBpdHMgcmVzdWx0LWZuLFxuICB3aGljaCBtdXN0IGJlIGEgdW5hcnkgZnVuY3Rpb24sIGlzIGNhbGxlZCB3aXRoIHRoZSByZXN1bHQgb2YgdGhlXG4gIHByZWRpY2F0ZSBhcyBpdHMgYXJndW1lbnQsIHRoZSByZXN1bHQgb2YgdGhhdCBjYWxsIGJlaW5nIHRoZSByZXR1cm5cbiAgdmFsdWUgb2YgY29uZHAuIEEgc2luZ2xlIGRlZmF1bHQgZXhwcmVzc2lvbiBjYW4gZm9sbG93IHRoZSBjbGF1c2VzLFxuICBhbmQgaXRzIHZhbHVlIHdpbGwgYmUgcmV0dXJuZWQgaWYgbm8gY2xhdXNlIG1hdGNoZXMuIElmIG5vIGRlZmF1bHRcbiAgZXhwcmVzc2lvbiBpcyBwcm92aWRlZCBhbmQgbm8gY2xhdXNlIG1hdGNoZXMsIGFuIEVycm9yIGlzIHRocm93bi5cIlxuICAobGV0KiAoKHN5bSogICAgKGdlbnN5bSA6Y29uZHAtYmluZGluZykpXG4gICAgICAgIChzeW0gICAgIChpZiAoc3ltYm9sPyBleHByKSBleHByIHN5bSopKVxuICAgICAgICAoY29tcGFyZSAobGFtYmRhICh4KSBgKCxwcmVkICx4ICxzeW0pKSlcbiAgICAgICAgKHNwbGl0cyAgKGxhbWJkYSBzcGxpdHMgKHhzKVxuICAgICAgICAgICAgICAgICAgKGNvbmQgKChlbXB0eT8geHMpICAgICAgICAgIGAodGhyb3cgKEVycm9yIChzdHIgXCJObyBtYXRjaGluZyBjbGF1c2U6IFwiICxzeW0pKSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAoKD0gMSAoY291bnQgeHMpKSAgICAgKGZpcnN0IHhzKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICgoPSAnOj4+IChzZWNvbmQgeHMpKSBgKGlmLWxldCBbLHN5bSogLChjb21wYXJlIChmaXJzdCB4cykpXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCwodGhpcmQgeHMpICxzeW0qKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLChzcGxpdHMgKGRyb3AgMyB4cykpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIChlbHNlICAgICAgICAgICAgICAgIGAoaWYgLChjb21wYXJlIChmaXJzdCB4cykpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAsKHNlY29uZCB4cylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICwoc3BsaXRzIChkcm9wIDIgeHMpKSkpKSkpKVxuICAgIChpZiAoPSBzeW0gZXhwcilcbiAgICAgIChzcGxpdHMgY2xhdXNlcylcbiAgICAgIGAobGV0KiogWyxzeW0gLGV4cHJdICwoc3BsaXRzIGNsYXVzZXMpKSkpKVxuKGluc3RhbGwtbWFjcm8hIDpjb25kcCBleHBhbmQtY29uZHApXG5cblxuKGRlZnVuLSAqdGhyZWFkIChpbnNlcnQgc3ltIHRlc3QgZm9ybSlcbiAgKGxldCogKChmb3JtIChpZiAobGlzdD8gZm9ybSkgZm9ybSAobGlzdCBmb3JtKSkpKVxuICAgIGAoaWYgLHRlc3RcbiAgICAgICAsc3ltXG4gICAgICAgLChpbnNlcnQgc3ltIGZvcm0pKSkpXG5cbihkZWZ1bi0gKmNvbmQtdGhyZWFkIChleHByIGNsYXVzZXMgaW5zZXJ0KVxuICAobGV0KiAoKHN5bSAoZ2Vuc3ltIDpjb25kLXRocmVhZC1iaW5kaW5nKSkpXG4gICAgYChhcy0+ICxleHByICxzeW1cbiAgICAgICAgICAgLEAobWFwIChsYW1iZGEgKCUpICgqdGhyZWFkIGluc2VydCBzeW0gYChub3QgLChmaXJzdCAlKSkgKHNlY29uZCAlKSkpXG4gICAgICAgICAgICAgICAgICAocGFydGl0aW9uIDIgY2xhdXNlcykpKSkpXG5cbihkZWZ1biBleHBhbmQtY29uZC10aHJlYWQtZmlyc3RcbiAgKGV4cHIgJnJlc3QgY2xhdXNlcylcbiAgXCJUYWtlcyBhbiBleHByZXNzaW9uIGFuZCBhIHNldCBvZiB0ZXN0L2Zvcm0gcGFpcnMuIFRocmVhZHMgZXhwciAodmlhIC0+KVxuICB0aHJvdWdoIGVhY2ggZm9ybSBmb3Igd2hpY2ggdGhlIGNvcnJlc3BvbmRpbmcgdGVzdFxuICBleHByZXNzaW9uIGlzIHRydWUuIE5vdGUgdGhhdCwgdW5saWtlIGNvbmQgYnJhbmNoaW5nLCBjb25kLT4gdGhyZWFkaW5nIGRvZXNcbiAgbm90IHNob3J0IGNpcmN1aXQgYWZ0ZXIgdGhlIGZpcnN0IHRydWUgdGVzdCBleHByZXNzaW9uLlwiXG4gICgqY29uZC10aHJlYWQgZXhwciBjbGF1c2VzIChsYW1iZGEgKHN5bSBmb3JtKSAoYXBwbHkgbGlzdCAoZmlyc3QgZm9ybSkgc3ltICh2ZWMgKHJlc3QgZm9ybSkpKSkpKVxuKGluc3RhbGwtbWFjcm8hIDpjb25kLT4gZXhwYW5kLWNvbmQtdGhyZWFkLWZpcnN0KVxuXG4oZGVmdW4gZXhwYW5kLWNvbmQtdGhyZWFkLWxhc3RcbiAgKGV4cHIgJnJlc3QgY2xhdXNlcylcbiAgXCJUYWtlcyBhbiBleHByZXNzaW9uIGFuZCBhIHNldCBvZiB0ZXN0L2Zvcm0gcGFpcnMuIFRocmVhZHMgZXhwciAodmlhIC0+PilcbiAgdGhyb3VnaCBlYWNoIGZvcm0gZm9yIHdoaWNoIHRoZSBjb3JyZXNwb25kaW5nIHRlc3QgZXhwcmVzc2lvblxuICBpcyB0cnVlLiAgTm90ZSB0aGF0LCB1bmxpa2UgY29uZCBicmFuY2hpbmcsIGNvbmQtPj4gdGhyZWFkaW5nIGRvZXMgbm90IHNob3J0IGNpcmN1aXRcbiAgYWZ0ZXIgdGhlIGZpcnN0IHRydWUgdGVzdCBleHByZXNzaW9uLlwiXG4gICgqY29uZC10aHJlYWQgZXhwciBjbGF1c2VzIChsYW1iZGEgKHN5bSBmb3JtKSAoYXBwbHkgbGlzdCAodmVjIChjb25jYXQgZm9ybSBbc3ltXSkpKSkpKVxuKGluc3RhbGwtbWFjcm8hIDpjb25kLT4+IGV4cGFuZC1jb25kLXRocmVhZC1sYXN0KVxuXG5cbihkZWZ1bi0gKnNvbWUtdGhyZWFkIChleHByIGZvcm1zIGluc2VydClcbiAgKGxldCogKChzeW0gKGdlbnN5bSA6c29tZS10aHJlYWQtYmluZGluZykpKVxuICAgIGAoYXMtPiAsZXhwciAsc3ltXG4gICAgICAgICAgICxAKG1hcCAobGFtYmRhICglKSAoKnRocmVhZCBpbnNlcnQgc3ltIGAobmlsPyAsc3ltKSAlKSlcbiAgICAgICAgICAgICAgICAgIGZvcm1zKSkpKVxuXG4oZGVmdW4gZXhwYW5kLXNvbWUtdGhyZWFkLWZpcnN0XG4gIChleHByICZyZXN0IGZvcm1zKVxuICBcIldoZW4gZXhwciBpcyBub3QgbmlsLCB0aHJlYWRzIGl0IGludG8gdGhlIGZpcnN0IGZvcm0gKHZpYSAtPiksXG4gIGFuZCB3aGVuIHRoYXQgcmVzdWx0IGlzIG5vdCBuaWwsIHRocm91Z2ggdGhlIG5leHQgZXRjXG5cbiAgRGVwZW5kcyBvbiBuaWw/XCJcbiAgKCpzb21lLXRocmVhZCBleHByIGZvcm1zIChsYW1iZGEgKHN5bSBmb3JtKSAoYXBwbHkgbGlzdCAoZmlyc3QgZm9ybSkgc3ltICh2ZWMgKHJlc3QgZm9ybSkpKSkpKVxuKGluc3RhbGwtbWFjcm8hIDpzb21lLT4gZXhwYW5kLXNvbWUtdGhyZWFkLWZpcnN0KVxuXG4oZGVmdW4gZXhwYW5kLXNvbWUtdGhyZWFkLWxhc3RcbiAgKGV4cHIgJnJlc3QgZm9ybXMpXG4gIFwiV2hlbiBleHByIGlzIG5vdCBuaWwsIHRocmVhZHMgaXQgaW50byB0aGUgZmlyc3QgZm9ybSAodmlhIC0+PiksXG4gIGFuZCB3aGVuIHRoYXQgcmVzdWx0IGlzIG5vdCBuaWwsIHRocm91Z2ggdGhlIG5leHQgZXRjXG5cbiAgRGVwZW5kcyBvbiBuaWw/XCJcbiAgKCpzb21lLXRocmVhZCBleHByIGZvcm1zIChsYW1iZGEgKHN5bSBmb3JtKSAoYXBwbHkgbGlzdCAodmVjIChjb25jYXQgZm9ybSBbc3ltXSkpKSkpKVxuKGluc3RhbGwtbWFjcm8hIDpzb21lLT4+IGV4cGFuZC1zb21lLXRocmVhZC1sYXN0KVxuXG5cbihkZWZ1bi0gYnVpbGQtZGVmdW5cbiAgKHByaXZhdGUgJmZvcm0gbmFtZSBwYXJhbXMgZG9jK2JvZHkpXG4gIFwiU2hhcmVkIGltcGxlbWVudGF0aW9uIG9mIGBkZWZ1bmAvYGRlZnVuLWA6IChkZWZ2YXIgaWQgKGxhbWJkYSBpZFxuICBwYXJhbXMqIGJvZHkqKSksIGZvbGRpbmcgYW4gb3B0aW9uYWwgZG9jLXN0cmluZyBpbnRvIHRoZSBpZCdzXG4gIG1ldGFkYXRhIHNvIGl0IG5ldmVyIHJlYWNoZXMgdGhlIGVtaXR0ZWQgYm9keSBhcyBhIGRlYWQgZXhwcmVzc2lvblxuICBzdGF0ZW1lbnQuIGBwcml2YXRlYCBwaWNrcyBgZGVmdmFyYCB2cyBgZGVmdmFyLWAgLS0gbmV3LXN5bnRheCBoYXNcbiAgbm8gYF46cHJpdmF0ZWAgcmVhZGVyIG1ldGFkYXRhLCBzbyBwcml2YWN5IGlzIG5vdyBzaWduYWxsZWQgcHVyZWx5XG4gIGJ5IHdoaWNoIG1hY3JvIG5hbWUgd2FzIHVzZWQuXG5cbiAgVW5saWtlIENsb2p1cmUtd2lzcCdzIGBkZWZuYCAobmFtZSBkb2M/IGF0dHItbWFwPyBbcGFyYW1zXSBib2R5KiksXG4gIG5ldy1zeW50YXggcHV0cyB0aGUgcGFyYW0gbGlzdCByaWdodCBhZnRlciB0aGUgbmFtZSAoRW1hY3MgTGlzcFxuICBvcmRlcik6IChkZWZ1biBuYW1lIChwYXJhbXMqKSBkb2M/IGJvZHkqKSAtLSBzbyB0aGUgZG9jc3RyaW5nLCB3aGVuXG4gIHByZXNlbnQsIGlzIHRoZSBmaXJzdCBlbGVtZW50IG9mIGJvZHksIG5vdCB0aGUgbGFzdCBlbGVtZW50IGJlZm9yZVxuICBpdC5cIlxuICAobGV0KiAoKGRvYyAoaWYgKGFuZCAoc3RyaW5nPyAoZmlyc3QgZG9jK2JvZHkpKSAobm90IChlbXB0eT8gKHJlc3QgZG9jK2JvZHkpKSkpXG4gICAgICAgICAgICAgIChmaXJzdCBkb2MrYm9keSkpKVxuXG4gICAgICAgIDs7IElmIGRvY3N0cmluZyBpcyBmb3VuZCBpdCdzIG5vdCBwYXJ0IG9mIGJvZHkuXG4gICAgICAgIChib2R5IChpZiBkb2MgKHJlc3QgZG9jK2JvZHkpIGRvYytib2R5KSlcblxuICAgICAgICA7OyBDb21iaW5lIHRoZSBkb2MgbWV0YWRhdGEgYW5kIGFkZCB0byBhIG5hbWUuXG4gICAgICAgIChpZCAod2l0aC1tZXRhIG5hbWUgKGNvbmogKG9yIChtZXRhIG5hbWUpIHt9KSB7OmRvYyBkb2N9KSkpXG5cbiAgICAgICAgKGZuICh3aXRoLW1ldGEgYChsYW1iZGEgLGlkICxwYXJhbXMgLEBib2R5KSAobWV0YSAmZm9ybSkpKVxuICAgICAgICAoZGVmLW9wIChpZiBwcml2YXRlICdkZWZ2YXItICdkZWZ2YXIpKSlcbiAgICAobGlzdCBkZWYtb3AgaWQgZm4pKSlcblxuKGRlZnVuIGV4cGFuZC1kZWZ1blxuICAoJmZvcm0gbmFtZSBwYXJhbXMgJnJlc3QgZG9jK2JvZHkpXG4gIFwiKGRlZnVuIG5hbWUgKHBhcmFtcyopIGRvYz8gZXhwcnMqKSA9PiAoZGVmdmFyIG5hbWUgKGxhbWJkYSBuYW1lIHBhcmFtcyogZXhwcnMqKSlcIlxuICAoYnVpbGQtZGVmdW4gZmFsc2UgJmZvcm0gbmFtZSBwYXJhbXMgZG9jK2JvZHkpKVxuKGluc3RhbGwtbWFjcm8hIDpkZWZ1biAod2l0aC1tZXRhIGV4cGFuZC1kZWZ1biB7OmltcGxpY2l0IFs6JmZvcm1dfSkpXG5cbihkZWZ1biBleHBhbmQtZGVmdW4tXG4gICgmZm9ybSBuYW1lIHBhcmFtcyAmcmVzdCBkb2MrYm9keSlcbiAgXCJTYW1lIGFzIGBkZWZ1bmAgYnV0IG5vdCBleHBvcnRlZCAoc2VlIGBidWlsZC1kZWZ1bmApLlwiXG4gIChidWlsZC1kZWZ1biB0cnVlICZmb3JtIG5hbWUgcGFyYW1zIGRvYytib2R5KSlcbihpbnN0YWxsLW1hY3JvISA6ZGVmdW4tICh3aXRoLW1ldGEgZXhwYW5kLWRlZnVuLSB7OmltcGxpY2l0IFs6JmZvcm1dfSkpXG5cbihkZWZ1biBleHBhbmQtZGVmY29uc3RcbiAgKG5hbWUgdmFsdWUpXG4gIFwiKGRlZmNvbnN0IG5hbWUgdmFsdWUpIC0tIG1heSBmb2xkIGludG8gYGRlZnZhci1gL2BkZWZ2YXJgIGxhdGVyOyBmb3JcbiAgbm93IGEgdGhpbiBhbGlhcyB3aXRoIG5vIHJlYXNzaWdubWVudC1wcmV2ZW50aW9uIHNlbWFudGljcy5cIlxuICBgKGRlZnZhciAsbmFtZSAsdmFsdWUpKVxuKGluc3RhbGwtbWFjcm8hIDpkZWZjb25zdCBleHBhbmQtZGVmY29uc3QpXG5cbihkZWZ1biBleHBhbmQtZGVmY29uc3QtXG4gIChuYW1lIHZhbHVlKVxuICBgKGRlZnZhci0gLG5hbWUgLHZhbHVlKSlcbihpbnN0YWxsLW1hY3JvISA6ZGVmY29uc3QtIGV4cGFuZC1kZWZjb25zdC0pXG5cbihkZWZ1biBleHBhbmQtc2V0cVxuICAocGxhY2UgdmFsdWUpXG4gIFwiKHNldHEgcGxhY2UgdmFsdWUpIC0tIHJlYmluZCBhIGJpbmRpbmcuIGBzZXQhYCBhbHJlYWR5IGhhbmRsZXMgYm90aFxuICBzeW1ib2wgYW5kIHBsYWNlIChsaXN0KSB0YXJnZXRzLCBzbyBgc2V0cWAvYHNldGZgIGFyZSBib3RoIHBsYWluXG4gIGFsaWFzZXMgZm9yIGl0LlwiXG4gIGAoc2V0ISAscGxhY2UgLHZhbHVlKSlcbihpbnN0YWxsLW1hY3JvISA6c2V0cSBleHBhbmQtc2V0cSlcblxuKGRlZnVuIGV4cGFuZC1zZXRmXG4gIChwbGFjZSB2YWx1ZSlcbiAgXCIoc2V0ZiBwbGFjZSB2YWx1ZSkgLS0gYXNzaWduIGEgcGxhY2U6IChzZXRmICguLXggbykgMSksIChzZXRmIChhcmVmIGEgaSkgdikuXCJcbiAgYChzZXQhICxwbGFjZSAsdmFsdWUpKVxuKGluc3RhbGwtbWFjcm8hIDpzZXRmIGV4cGFuZC1zZXRmKVxuXG5cbihkZWZ1biBleHBhbmQtbGF6eS1zZXFcbiAgKCZyZXN0IGJvZHkpXG4gIFwiVGFrZXMgYSBib2R5IG9mIGV4cHJlc3Npb25zIHRoYXQgcmV0dXJucyBhbiBJU2VxIG9yIG5pbCwgYW5kIHlpZWxkc1xuICBhIFNlcWFibGUgb2JqZWN0IHRoYXQgd2lsbCBpbnZva2UgdGhlIGJvZHkgb25seSB0aGUgZmlyc3QgdGltZSBzZXFcbiAgaXMgY2FsbGVkLCBhbmQgd2lsbCBjYWNoZSB0aGUgcmVzdWx0IGFuZCByZXR1cm4gaXQgb24gYWxsIHN1YnNlcXVlbnRcbiAgc2VxIGNhbGxzLiBTZWUgYWxzbyAtIHJlYWxpemVkP1xuXG4gIERlcGVuZHMgb24gbGF6eS1zZXFcIlxuICBgKC5jYWxsIGxhenktc2VxIG5pbCBmYWxzZSAobGFtYmRhICgpICxAYm9keSkpKVxuKGluc3RhbGwtbWFjcm8gOmxhenktc2VxIGV4cGFuZC1sYXp5LXNlcSlcblxuXG4oZGVmdW4gZXhwYW5kLXdoZW5cbiAgKHRlc3QgJnJlc3QgYm9keSlcbiAgXCJFdmFsdWF0ZXMgdGVzdC4gSWYgbG9naWNhbCB0cnVlLCBldmFsdWF0ZXMgYm9keSBpbiBhbiBpbXBsaWNpdCBwcm9nbi5cIlxuICBgKGlmICx0ZXN0IChwcm9nbiAsQGJvZHkpKSlcbihpbnN0YWxsLW1hY3JvIDp3aGVuIGV4cGFuZC13aGVuKVxuXG4oZGVmdW4gZXhwYW5kLXVubGVzc1xuICAodGVzdCAmcmVzdCBib2R5KVxuICBcIkV2YWx1YXRlcyB0ZXN0LiBJZiBsb2dpY2FsIGZhbHNlLCBldmFsdWF0ZXMgYm9keSBpbiBhbiBpbXBsaWNpdCBwcm9nbi5cIlxuICBgKHdoZW4gKG5vdCAsdGVzdCkgLEBib2R5KSlcbihpbnN0YWxsLW1hY3JvIDp1bmxlc3MgZXhwYW5kLXVubGVzcylcblxuXG4oZGVmdW4gZXhwYW5kLWlmLWxldFxuICAoYmluZGluZ3MgdGhlbiBlbHNlKilcbiAgXCJiaW5kaW5ncyA9PiBiaW5kaW5nLWZvcm0gdGVzdFxuICBib2R5ID0+IFt0aGVuIGVsc2VdXG4gIElmIHRlc3QgaXMgdHJ1ZSwgZXZhbHVhdGVzIHRoZW4gd2l0aCBiaW5kaW5nLWZvcm0gYm91bmQgdG8gdGhlIHZhbHVlIG9mXG4gIHRlc3QsIGlmIG5vdCwgeWllbGRzIGVsc2UqLlwiXG4gIChsZXQqICgobmFtZSAoZmlyc3QgYmluZGluZ3MpKSAodGVzdCAoc2Vjb25kIGJpbmRpbmdzKSkgKHN5bSAoZ2Vuc3ltIDppZi1sZXQtYmluZGluZykpKVxuICAgIGAobGV0KiogWyxzeW0gLHRlc3RdXG4gICAgICAgKGlmICxzeW0gKGxldCoqICwoZGVzdHJ1Y3R1cmUgW25hbWUgc3ltXSkgLHRoZW4pICxlbHNlKikpKSlcbihpbnN0YWxsLW1hY3JvIDppZi1sZXQgZXhwYW5kLWlmLWxldClcblxuKGRlZnVuIGV4cGFuZC13aGVuLWxldFxuICAoYmluZGluZ3MgJnJlc3QgYm9keSlcbiAgXCJiaW5kaW5ncyA9PiBiaW5kaW5nLWZvcm0gdGVzdFxuICBXaGVuIHRlc3QgaXMgdHJ1ZSwgZXZhbHVhdGVzIGJvZHkgd2l0aCBiaW5kaW5nLWZvcm0gYm91bmQgdG8gdGhlIHZhbHVlIG9mIHRlc3QuXCJcbiAgYChpZi1sZXQgLGJpbmRpbmdzIChwcm9nbiAsQGJvZHkpKSlcbihpbnN0YWxsLW1hY3JvIDp3aGVuLWxldCBleHBhbmQtd2hlbi1sZXQpXG5cblxuKGRlZnVuIGV4cGFuZC1pZi1zb21lXG4gIChiaW5kaW5ncyB0aGVuIGVsc2UqKVxuICBcImJpbmRpbmdzID0+IGJpbmRpbmctZm9ybSB0ZXN0XG4gIElmIHRlc3QgaXMgbm90IG5pbCwgZXZhbHVhdGVzIHRoZW4gd2l0aCBiaW5kaW5nLWZvcm0gYm91bmQgdG8gdGhlXG4gIHZhbHVlIG9mIHRlc3QsIGlmIG5vdCwgeWllbGRzIGVsc2UqLlxuXG4gIERlcGVuZHMgb24gbmlsP1wiXG4gIChsZXQqICgobmFtZSAoZmlyc3QgYmluZGluZ3MpKSAodGVzdCAoc2Vjb25kIGJpbmRpbmdzKSkgKHN5bSAoaWYgKHN5bWJvbD8gbmFtZSkgbmFtZSAoZ2Vuc3ltIDppZi1zb21lLWJpbmRpbmcpKSkpXG4gICAgYChsZXQqKiBbLHN5bSAsdGVzdF1cbiAgICAgICAoaWYtbm90IChuaWw/ICxzeW0pXG4gICAgICAgICAobGV0KiogLChkZXN0cnVjdHVyZSBbbmFtZSBzeW1dKSAsdGhlbilcbiAgICAgICAgICxlbHNlKikpKSlcbihpbnN0YWxsLW1hY3JvIDppZi1zb21lIGV4cGFuZC1pZi1zb21lKVxuXG4oZGVmdW4gZXhwYW5kLXdoZW4tc29tZVxuICAoYmluZGluZ3MgJnJlc3QgYm9keSlcbiAgXCJiaW5kaW5ncyA9PiBiaW5kaW5nLWZvcm0gdGVzdFxuICBXaGVuIHRlc3QgaXMgbm90IG5pbCwgZXZhbHVhdGVzIGJvZHkgd2l0aCBiaW5kaW5nLWZvcm0gYm91bmQgdG8gdGhlXG4gIHZhbHVlIG9mIHRlc3QuXCJcbiAgYChpZi1zb21lICxiaW5kaW5ncyAocHJvZ24gLEBib2R5KSkpXG4oaW5zdGFsbC1tYWNybyA6d2hlbi1zb21lIGV4cGFuZC13aGVuLXNvbWUpXG5cblxuKGRlZnVuIGV4cGFuZC13aGVuLWZpcnN0XG4gIChiaW5kaW5ncyAmcmVzdCBib2R5KVxuICBcImJpbmRpbmdzID0+IHggeHNcbiAgUm91Z2hseSB0aGUgc2FtZSBhcyAod2hlbiAoc2VxIHhzKSAobGV0IFt4IChmaXJzdCB4cyldIGJvZHkpKSBidXQgeHMgaXMgZXZhbHVhdGVkIG9ubHkgb25jZVxuXG4gIERlcGVuZHMgb24gc2VxKlwiXG4gIChsZXQqICgobmFtZSAoZmlyc3QgYmluZGluZ3MpKSAodGVzdCAoc2Vjb25kIGJpbmRpbmdzKSkpXG4gICAgYCh3aGVuLWxldCAoWyxuYW1lXSAoc2VxKiAsdGVzdCkpICxAYm9keSkpKVxuKGluc3RhbGwtbWFjcm8gOndoZW4tZmlyc3QgZXhwYW5kLXdoZW4tZmlyc3QpXG5cblxuKGRlZnVuIGV4cGFuZC13aGlsZVxuICAodGVzdCAmcmVzdCBib2R5KVxuICBcIlJlcGVhdGVkbHkgZXhlY3V0ZXMgYm9keSB3aGlsZSB0ZXN0IGV4cHJlc3Npb24gaXMgdHJ1ZS4gUHJlc3VtZXNcbiAgc29tZSBzaWRlLWVmZmVjdCB3aWxsIGNhdXNlIHRlc3QgdG8gYmVjb21lIGZhbHNlL25pbC4gUmV0dXJucyBuaWxcIlxuICBgKGxvb3AgKClcbiAgICAgKHdoZW4gLHRlc3QgLEBib2R5IChyZWN1cikpKSlcbihpbnN0YWxsLW1hY3JvIDp3aGlsZSBleHBhbmQtd2hpbGUpXG5cblxuKGRlZnVuIGV4cGFuZC1kb3RvXG4gICh4ICZyZXN0IGZvcm1zKVxuICBcIkV2YWx1YXRlcyB4IHRoZW4gY2FsbHMgYWxsIG9mIHRoZSBtZXRob2RzIGFuZCBmdW5jdGlvbnMgd2l0aCB0aGVcbiAgdmFsdWUgb2YgeCBzdXBwbGllZCBhdCB0aGUgZnJvbnQgb2YgdGhlIGdpdmVuIGFyZ3VtZW50cy4gIFRoZSBmb3Jtc1xuICBhcmUgZXZhbHVhdGVkIGluIG9yZGVyLiAgUmV0dXJucyB4LlxuICAoZG90byAoTWFwLikgKC5zZXQgOmEgMSkgKC5zZXQgOmIgMikpXCJcbiAgKGxldCogKChzeW0gKGdlbnN5bSA6ZG90by1iaW5kaW5nKSkpXG4gICAgYChsZXQqKiBbLHN5bSAseF1cbiAgICAgICAsQChtYXAgKGxhbWJkYSAoJSkgKGNvbmNhdCBbKGZpcnN0ICUpIHN5bV0gKHJlc3QgJSkpKSBmb3JtcylcbiAgICAgICAsc3ltKSkpXG4oaW5zdGFsbC1tYWNybyA6ZG90byBleHBhbmQtZG90bylcblxuKGRlZnVuIGV4cGFuZC1kb3RpbWVzXG4gIChiaW5kaW5ncyAmcmVzdCBib2R5KVxuICBcImJpbmRpbmdzID0+IG5hbWUgblxuICBSZXBlYXRlZGx5IGV4ZWN1dGVzIGJvZHkgKHByZXN1bWFibHkgZm9yIHNpZGUtZWZmZWN0cykgd2l0aCBuYW1lXG4gIGJvdW5kIHRvIGludGVnZXJzIGZyb20gMCB0aHJvdWdoIG4tMS5cIlxuICAobGV0KiAoKG5hbWUgKGZpcnN0IGJpbmRpbmdzKSkgKG4gKHNlY29uZCBiaW5kaW5ncykpIChzeW0gKGdlbnN5bSA6ZG90aW1lcy1iaW5kaW5nKSkpXG4gICAgYChsZXQqKiBbLHN5bSAsbl1cbiAgICAgICAobG9vcCAoKCxuYW1lIDApKVxuICAgICAgICAgKHdoZW4gKDwgLG5hbWUgLHN5bSlcbiAgICAgICAgICAgLEBib2R5XG4gICAgICAgICAgIChyZWN1ciAoaW5jICxuYW1lKSkpKSkpKVxuKGluc3RhbGwtbWFjcm8gOmRvdGltZXMgZXhwYW5kLWRvdGltZXMpXG5cblxuKGRlZnVuLSBmb3Itc3RlcCAoY29udGV4dCBsb29wICZyZXN0IG1vZGlmaWVycylcbiAgKGxldCogKChpdGVyICAoOml0ZXIgY29udGV4dCkpIChjb2xsICg6Y29sbCBjb250ZXh0KSkgKGJvZHkgKDpib2R5IGNvbnRleHQpKSAoc3Vic2VxICg6c3Vic2VxIGNvbnRleHQpKVxuICAgICAgICAoYm9keSogKGlmLW5vdCBzdWJzZXEgYm9keSBgKGxldCoqIFssc3Vic2VxICxib2R5XVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChpZiAoZW1wdHk/ICxzdWJzZXEpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAocmVjdXIgKHJlc3QgLGNvbGwpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGxhenktY29uY2F0ICxzdWJzZXEgKCxpdGVyIChyZXN0ICxjb2xsKSkpKSkpKVxuICAgICAgICAobmV4dCAgKGxvb3AgKChtb2RzIChyZXZlcnNlIG1vZGlmaWVycykpIChib2R5IGJvZHkqKSlcbiAgICAgICAgICAgICAgICAoaWYgKGVtcHR5PyBtb2RzKVxuICAgICAgICAgICAgICAgICAgYm9keVxuICAgICAgICAgICAgICAgICAgKGxldCogKChtIChmaXJzdCBtb2RzKSkgKGl0ZW0gKGZpcnN0IG0pKSAoYXJnIChzZWNvbmQgbSkpKVxuICAgICAgICAgICAgICAgICAgICAocmVjdXIgKHJlc3QgbW9kcylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIChjb25kICgoPSBpdGVtICc6bGV0KSAgIGAobGV0KiogLChwYXJlbi1iaW5kaW5ncy0+dmVjIGFyZykgLGJvZHkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCg9IGl0ZW0gJzp3aGlsZSkgYChpZiAsYXJnICxib2R5KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgoPSBpdGVtICc6d2hlbikgIGAoaWYgLGFyZyAsYm9keSAocmVjdXIgKHJlc3QgLGNvbGwpKSkpKSkpKSkpKVxuICAgIChtZXJnZSBjb250ZXh0XG4gICAgICAgICAgIHs6c3Vic2VxIChnZW5zeW0gOmZvci1zdWJzZXEpXG4gICAgICAgICAgICA6Ym9keSAgIGAoKGxhbWJkYSAsaXRlciAoLGNvbGwpXG4gICAgICAgICAgICAgICAgICAgICAgICAobGF6eS1zZXEgKGxvb3AgKCgsY29sbCAsY29sbCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoaWYtbm90IChlbXB0eT8gLGNvbGwpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChsZXQqKiBbLChmaXJzdCBsb29wKSAoZmlyc3QgLGNvbGwpXSAsbmV4dCkpKSkpXG4gICAgICAgICAgICAgICAgICAgICAgLChzZWNvbmQgbG9vcCkpfSkpKVxuXG4oZGVmdmFyLSBmb3ItbW9kaWZpZXJzICN7JzpsZXQgJzp3aGlsZSAnOndoZW59KVxuXG4oZGVmdW4tIGZvci1wYXJ0cyAoc2VxLWV4cHItcGFpcnMpXG4gIChsZXQqICgobiAgICAgICAgKGNvdW50IHNlcS1leHByLXBhaXJzKSlcbiAgICAgICAgKGluZGljZXMgIChmaWx0ZXIgKGxhbWJkYSAoJSkgKC0+IChhZ2V0IHNlcS1leHByLXBhaXJzICUpIGZpcnN0IGZvci1tb2RpZmllcnMgbm90KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAocmFuZ2UgbikpKVxuICAgICAgICAoc2VnbWVudHMgKHBhcnRpdGlvbiAyIDEgKGNvbmogaW5kaWNlcyBuKSkpKVxuICAgIChtYXAgKGxhbWJkYSAoJSkgKC5zbGljZSBzZXEtZXhwci1wYWlycyAoZmlyc3QgJSkgKHNlY29uZCAlKSkpXG4gICAgICAgICBzZWdtZW50cykpKVxuXG4oZGVmdW4gZXhwYW5kLWZvclxuICAoc2VxLWV4cHJzIGJvZHktZXhwcilcbiAgXCJMaXN0IGNvbXByZWhlbnNpb24uIFRha2VzIGEgcGFyZW4gY2xhdXNlIGxpc3Qgb2Ygb25lIG9yIG1vcmVcbiAgIChiaW5kaW5nLWZvcm0gY29sbGVjdGlvbi1leHByKSBwYWlycywgZWFjaCBmb2xsb3dlZCBieSB6ZXJvIG9yIG1vcmVcbiAgIG1vZGlmaWVyIGNsYXVzZXMsIGFuZCB5aWVsZHMgYSBsYXp5IHNlcXVlbmNlIG9mIGV2YWx1YXRpb25zIG9mIGV4cHIuXG4gICBDb2xsZWN0aW9ucyBhcmUgaXRlcmF0ZWQgaW4gYSBuZXN0ZWQgZmFzaGlvbiwgcmlnaHRtb3N0IGZhc3Rlc3QsXG4gICBhbmQgbmVzdGVkIGNvbGwtZXhwcnMgY2FuIHJlZmVyIHRvIGJpbmRpbmdzIGNyZWF0ZWQgaW4gcHJpb3JcbiAgIGJpbmRpbmctZm9ybXMuICBTdXBwb3J0ZWQgbW9kaWZpZXJzIGFyZTogKDpsZXQgKChiaW5kaW5nLWZvcm0gZXhwcikgLi4uKSksXG4gICAoOndoaWxlIHRlc3QpLCAoOndoZW4gdGVzdCkuXG4gICh0YWtlIDEwMCAoZm9yICgoeCAoaW5maW5pdGUtcmFuZ2UpKSAoeSAoaW5maW5pdGUtcmFuZ2UpKSAoOndoaWxlICg8IHkgeCkpKSAgW3ggeV0pKVxuXG4gIERlcGVuZHMgb24gbGF6eS1zZXEsIGxhenktY29uY2F0LCBlbXB0eT8sIGZpcnN0LCByZXN0LCBjb25zXCJcbiAgKGxldCogKChwYWlycyAodmVjIChtYXAgdmVjIHNlcS1leHBycykpKVxuICAgICAgICAoaXRlciAoZ2Vuc3ltIDpmb3ItaXRlcikpIChjb2xsIChnZW5zeW0gOmZvci1jb2xsKSkgKHBhcnRzIChmb3ItcGFydHMgcGFpcnMpKSlcbiAgICAoOmJvZHkgKHJlZHVjZSAobGFtYmRhICglMSAlMikgKGFwcGx5IGZvci1zdGVwICUxICUyKSlcbiAgICAgICAgICAgICAgICAgICB7Oml0ZXIgaXRlciA6Y29sbCBjb2xsIDpib2R5IGAoY29ucyAsYm9keS1leHByICgsaXRlciAocmVzdCAsY29sbCkpKX1cbiAgICAgICAgICAgICAgICAgICAocmV2ZXJzZSBwYXJ0cykpKSkpXG4oaW5zdGFsbC1tYWNybyA6Zm9yIGV4cGFuZC1mb3IpXG5cbihkZWZ1biBleHBhbmQtZG9zZXFcbiAgKHNlcS1leHBycyAmcmVzdCBib2R5KVxuICBcIlJlcGVhdGVkbHkgZXhlY3V0ZXMgYm9keSAocHJlc3VtYWJseSBmb3Igc2lkZS1lZmZlY3RzKSB3aXRoXG4gIGJpbmRpbmdzIGFuZCBmaWx0ZXJpbmcgYXMgcHJvdmlkZWQgYnkgJ2ZvcicuIERvZXMgbm90IHJldGFpblxuICB0aGUgaGVhZCBvZiB0aGUgc2VxdWVuY2UuIFJldHVybnMgbmlsLlxuXG4gIERlcGVuZHMgb24gbGF6eS1zZXEsIGxhenktY29uY2F0LCBlbXB0eT8sIGZpcnN0LCByZXN0LCBjb25zLCBkb3J1blwiXG4gIGAoZG9ydW4gKGZvciAsc2VxLWV4cHJzIChwcm9nbiAsQGJvZHkgbmlsKSkpKVxuKGluc3RhbGwtbWFjcm8gOmRvc2VxIGV4cGFuZC1kb3NlcSlcblxuXG4oZGVmdW4tIHN5bSogKHN0cmluZylcbiAgKGxldCogKCh3b3JkcyAoc3BsaXQgKG5hbWUgc3RyaW5nKSAjXCItXCIpKSlcbiAgICAoam9pbiAoY29ucyAoZmlyc3Qgd29yZHMpIChtYXAgY2FwaXRhbGl6ZSAocmVzdCB3b3JkcykpKSkpKVxuKGRlZnVuLSBiaW5kLXN5bSogKHMgYilcbiAgKGFzc2VydCAoc3ltYm9sPyBzKSBcIkV4cGVjdGVkIGEgc3ltYm9sIGhlcmUhXCIpXG4gIFtzIGJdKVxuKGRlZnVuLSBjb25qLXN5bXMqIChnZXQqIHJlc3VsdCBrIHYgZiBxdW90ZSlcbiAgKGxldCogKChrLW5zIChuYW1lc3BhY2UgaykpIChnIChsYW1iZGEgKCUpIChmIGstbnMgKG5hbWUgJSkpKSkpXG4gICAgKHZlYyAoY29uY2F0IHJlc3VsdCAobWFwY2F0IChsYW1iZGEgKCUpIChiaW5kLXN5bSogJSAoZ2V0KiAlIChnICUpIHF1b3RlKSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHYpKSkpKVxuKGRlZnVuLSBkaWN0LWdldCogKGRpY3QtbmFtZSBkZWZhdWx0cylcbiAgKGxhbWJkYSAoYmluZGluZyBrZXkgcXVvdGUpXG4gICAgKGxldCogKChzIChuYW1lIGtleSkpXG4gICAgICAgICAgKGsgKGtleXdvcmQgKG5hbWVzcGFjZSBrZXkpIChpZiAoc3ltYm9sPyBrZXkpIChzeW0qIHMpIHMpKSkpXG4gICAgICBgKGdldCAsZGljdC1uYW1lICwoaWYtbm90IHF1b3RlIGsgYCcsaykgLChhbmQgYmluZGluZyAoYWdldCBkZWZhdWx0cyBiaW5kaW5nKSkpKSkpXG5cbihkZWZ1biBkZXN0cnVjdHVyZS1kaWN0IChiaW5kaW5nIGZyb20pXG4gIChsZXQqICgoZGljdC1uYW1lICAob3IgKGFnZXQgYmluZGluZyAnOmFzKSAoZ2Vuc3ltIDpkZXN0cnVjdHVyZS1iaW5kKSkpXG4gICAgICAgIChkaWN0LWJpbmQgIGAoaWYgKGRpY3Rpb25hcnk/ICxkaWN0LW5hbWUpICxkaWN0LW5hbWUgKGFwcGx5IGRpY3Rpb25hcnkgKHZlYyAsZGljdC1uYW1lKSkpKVxuICAgICAgICAoZ2V0KiAgICAgICAoZGljdC1nZXQqIGRpY3QtbmFtZSAoZ2V0IGJpbmRpbmcgJzpvciB7fSkpKSlcbiAgICAobG9vcCAoKGtzIChrZXlzIChkaXNzb2MgYmluZGluZyAnOmFzICc6b3IpKSkgKHJlc3VsdCBbZGljdC1uYW1lIGZyb20gZGljdC1uYW1lIGRpY3QtYmluZF0pKVxuICAgICAgKGlmIChlbXB0eT8ga3MpXG4gICAgICAgIHJlc3VsdFxuICAgICAgICAobGV0KiAoKGsgKGZpcnN0IGtzKSkgKHYgKGdldCBiaW5kaW5nIGspKSAoayogKGFuZCAoa2V5d29yZD8gaykgKG5hbWUgaykpKSlcbiAgICAgICAgICAoYXNzZXJ0IChvciAoc3ltYm9sPyBrKSAoYW5kIGsqICgjezprZXlzIDpzdHJzIDpzeW1zfSBrKikpKVxuICAgICAgICAgICAgICAgICAgKHN0ciBcIkludmFsaWQgZGVzdHJ1Y3R1cmUga2V5IFwiIGspKVxuICAgICAgICAgIChyZWN1ciAocmVzdCBrcykgKGNvbmQgKCg9IGsqIDpzdHJzKSAoY29uai1zeW1zKiBnZXQqIHJlc3VsdCBrIHYga2V5d29yZCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKD0gayogOnN5bXMpIChjb25qLXN5bXMqIGdldCogcmVzdWx0IGsgdiAobGFtYmRhICglMSAlMikgKHN5bWJvbCAlMSAoc3ltKiAlMikpKSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKD0gayogOmtleXMpIChjb25qLXN5bXMqIGdldCogcmVzdWx0IGsgdiBrZXl3b3JkIDpxdW90ZSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKG51bWJlcj8gdikgIChjb25qIHJlc3VsdCBrIChnZXQqIGsgKHN5bWJvbCAoc3RyIHYpKSkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGVsc2UgICAgICAgIChjb25qIHJlc3VsdCBrIChnZXQqIGsgdikpKSkpKSkpKSlcblxuKGRlZnVuIGRlc3RydWN0dXJlLXNlcSAoYmluZGluZyBmcm9tKVxuICAobGV0KiAoKGFzICAgICAgICguZmluZC1pbmRleCBiaW5kaW5nIChsYW1iZGEgKCUpICg9ICUgJzphcykpKSlcbiAgICAgICAgKHNlcS1uYW1lIChpZiAoPCBhcyAwKSAoZ2Vuc3ltIDpkZXN0cnVjdHVyZS1iaW5kKSAobnRoIGJpbmRpbmcgKGluYyBhcykpKSlcbiAgICAgICAgKGJpbmRpbmcxIChpZiAoPCBhcyAwKSBiaW5kaW5nICh0YWtlIGFzIGJpbmRpbmcpKSlcbiAgICAgICAgKG1vcmUgICAgICguZmluZC1pbmRleCBiaW5kaW5nMSAobGFtYmRhICglKSAoPSAlICcmKSkpKVxuICAgICAgICAodGFpbCAgICAgKGlmICg+PSBtb3JlIDApIChudGggYmluZGluZzEgKGluYyBtb3JlKSkpKVxuICAgICAgICAoYmluZGluZzIgKGlmICg8IG1vcmUgMCkgYmluZGluZzEgKHRha2UgbW9yZSBiaW5kaW5nKSkpKVxuICAgIChhc3NlcnQgKG9yICg8IGFzIDApICg9IGFzICgtIChjb3VudCBiaW5kaW5nKSAyKSkpXG4gICAgICAgICAgICBcImludmFsaWQgOmFzIGluIHNlcS1kZXN0cnVjdHVyaW5nXCIpXG4gICAgKGFzc2VydCAob3IgKDwgbW9yZSAwKSAoPSBtb3JlICgtIChjb3VudCBiaW5kaW5nMSkgMikpKVxuICAgICAgICAgICAgXCJpbnZhbGlkICYgaW4gc2VxLWRlc3RydWN0dXJpbmdcIilcbiAgICAobG9vcCAoKHhzIGJpbmRpbmcyKSAoaSAwKSAocmVzdWx0IFtzZXEtbmFtZSBmcm9tXSkpXG4gICAgICAobGV0KiAoKHggKGZpcnN0IHhzKSkpXG4gICAgICAgIChjb25kICgoZW1wdHk/IHhzKSAoaWYtbm90IHRhaWwgcmVzdWx0IChjb25qIHJlc3VsdCB0YWlsIGAoZHJvcCAsbW9yZSAsc2VxLW5hbWUpKSkpXG4gICAgICAgICAgICAgICgoPSB4ICdfKSAgICAocmVjdXIgKHJlc3QgeHMpIChpbmMgaSkgcmVzdWx0KSlcbiAgICAgICAgICAgICAgKGVsc2UgICAgICAgKHJlY3VyIChyZXN0IHhzKSAoaW5jIGkpIChjb25qIHJlc3VsdCB4IGAobnRoICxzZXEtbmFtZSAsaSkpKSkpKSkpKVxuXG4oZGVmdW4gZGVzdHJ1Y3R1cmUgKGJpbmRpbmdzKVxuICAobGV0KiAoKHBhaXJzIChwYXJ0aXRpb24gMiBiaW5kaW5ncykpKVxuICAgIChpZiAoZXZlcnk/IChsYW1iZGEgKCUpIChzeW1ib2w/IChmaXJzdCAlKSkpIHBhaXJzKVxuICAgICAgYmluZGluZ3NcbiAgICAgIChkZXN0cnVjdHVyZSAodmVjIChtYXBjYXQgKGxhbWJkYSAoJSkgKGNvbmQgKCh2ZWN0b3I/ICAgICAoZmlyc3QgJSkpIChhcHBseSBkZXN0cnVjdHVyZS1zZXEgJSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKGRpY3Rpb25hcnk/IChmaXJzdCAlKSkgKGFwcGx5IGRlc3RydWN0dXJlLWRpY3QgJSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKHN5bWJvbD8gICAgIChmaXJzdCAlKSkgJSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChlbHNlICAgICAgICAgICAgICAgICAgICh0aHJvdyBcIkludmFsaWQgYmluZGluZ1wiKSkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWlycykpKSkpKVxuXG4oZGVmdW4tIGJpbmQtbmFtZXMqIChrZXlzKVxuICAoemlwbWFwIGtleXMgKHJlcGVhdGVkbHkgKGNvdW50IGtleXMpIChsYW1iZGEgKCkgKGdlbnN5bSA6ZGVzdHJ1Y3R1cmUtYmluZCkpKSkpXG4oZGVmdW4tIGJpbmQtaW5kaWNlcyogKG5hbWVzKVxuICAoZmlsdGVyIChsYW1iZGEgKCUpIChub3QgKHN5bWJvbD8gKG50aCBuYW1lcyAlKSkpKSAocmFuZ2UgKGNvdW50IG5hbWVzKSkpKVxuXG4oZGVmdW4tIHBhcmVuLWJpbmRpbmdzLT52ZWNcbiAgKGJpbmRpbmdzKVxuICBcIlR1cm5zIGEgbmV3LXN5bnRheCBgbGV0YC9gbGV0KmAgcGFyZW4gYmluZGluZyBsaXN0LCBlLmcuXG4gICgoeCAxKSAoeSAyKSksIGludG8gdGhlIGZsYXQgdmVjdG9yIFt4IDEgeSAyXSB0aGUgaW50ZXJuYWwgYGxldCoqYFxuICBmb3JtIChhbmQgYGRlc3RydWN0dXJlYCkgZXhwZWN0LlwiXG4gICh2ZWMgKG1hcGNhdCAobGFtYmRhIChwYWlyKSBbKGZpcnN0IHBhaXIpIChzZWNvbmQgcGFpcildKSBiaW5kaW5ncykpKVxuXG4oZGVmdW4gZXhwYW5kLWxldCpcbiAgKGJpbmRpbmdzICZyZXN0IGJvZHkpXG4gIFwiKGxldCogKCh4IDEpICh5ICgrIHggMSkpKSBib2R5KikgLS0gc2VxdWVudGlhbDogZWFjaCBiaW5kaW5nIHNlZXNcbiAgdGhlIHByZXZpb3VzIG9uZXMuXCJcbiAgYChsZXQqKiAsKGRlc3RydWN0dXJlIChwYXJlbi1iaW5kaW5ncy0+dmVjIGJpbmRpbmdzKSkgLEBib2R5KSlcbihpbnN0YWxsLW1hY3JvISA6bGV0KiBleHBhbmQtbGV0KilcblxuKGRlZnVuIGV4cGFuZC1sZXRcbiAgKGJpbmRpbmdzICZyZXN0IGJvZHkpXG4gIFwiKGxldCAoKHggMSkgKHkgMikpIGJvZHkqKSAtLSBiaW5kaW5ncyBldmFsdWF0ZWQgaW4gdGhlIE9VVEVSIHNjb3BlXG4gIChwYXJhbGxlbCk6IGV2ZXJ5IGluaXQtZXhwciBzZWVzIG9ubHkgd2hhdCB3YXMgYm91bmQgYmVmb3JlIHRoaXNcbiAgYGxldGAsIG5ldmVyIGEgc2libGluZyBiaW5kaW5nIGludHJvZHVjZWQgYnkgdGhlIHNhbWUgZm9ybS4gQWxsXG4gIGluaXQtZXhwcnMgYXJlIGV2YWx1YXRlZCBmaXJzdCAoYm91bmQgdG8gZ2Vuc3ltcyksIHRoZW4gdGhlIHJlYWxcbiAgbmFtZXMgYXJlIGJvdW5kIGZyb20gdGhvc2UgZ2Vuc3ltcy5cIlxuICAobGV0KiAoKHBhaXJzIChwYXJ0aXRpb24gMiAocGFyZW4tYmluZGluZ3MtPnZlYyBiaW5kaW5ncykpKVxuICAgICAgICAoZ2Vuc3ltcyAobWFwIChsYW1iZGEgKF8pIChnZW5zeW0gOmxldC1iaW5kaW5nKSkgcGFpcnMpKVxuICAgICAgICAob3V0ZXIgKG1hcGNhdCAobGFtYmRhIChnIHBhaXIpIFtnIChzZWNvbmQgcGFpcildKSBnZW5zeW1zIHBhaXJzKSlcbiAgICAgICAgKGlubmVyIChtYXBjYXQgKGxhbWJkYSAoZyBwYWlyKSBbKGZpcnN0IHBhaXIpIGddKSBnZW5zeW1zIHBhaXJzKSkpXG4gICAgYChsZXQqKiAsKHZlYyBvdXRlcikgKGxldCoqICwoZGVzdHJ1Y3R1cmUgKHZlYyBpbm5lcikpICxAYm9keSkpKSlcbihpbnN0YWxsLW1hY3JvISA6bGV0IGV4cGFuZC1sZXQpXG5cbihkZWZ1bi0gcGFyc2UtYXJnbGlzdFxuICAocGFyYW1zKVxuICBcIlBhcnNlcyBhIG5ldy1zeW50YXggcGFyYW1ldGVyIGxpc3QgLS0gKGEgYiAmb3B0aW9uYWwgKGMgMTApICZyZXN0IHIpXG4gIC0tIGludG8gezpuYW1lcyBbLi4uXSA6ZGVmYXVsdHMgKFtuYW1lIGRlZmF1bHRdIC4uLil9LiA6bmFtZXMgaXMgYVxuICBmbGF0IHZlY3RvciB1c2luZyB0aGUgZXhpc3RpbmcgYCYgcmVzdC1uYW1lYCB2YXJpYWRpYyBjb252ZW50aW9uXG4gIGZuKi9hbmFseXplLWZuIGFscmVhZHkgdW5kZXJzdGFuZHM7IDpkZWZhdWx0cyBhcmUgW25hbWUgZGVmYXVsdC1mb3JtXVxuICBwYWlycyB0byBwcmVwZW5kIGFzIGJvZHkgc3RhdGVtZW50cy4gUG9zaXRpb25hbCBkZXN0cnVjdHVyaW5nXG4gIChhIHBhcmFtIHBvc2l0aW9uIHRoYXQgaXMgaXRzZWxmIGEgdmVjdG9yL2RpY3Rpb25hcnkgcGF0dGVybikgaXNcbiAgaGFuZGxlZCB0aGUgc2FtZSB3YXkgb2xkIHdpc3AncyBgZm5gIGRpZCBpdCAtLSBzZWUgYGRlZipgIGJlbG93LlwiXG4gIChsb29wICgocmVtYWluaW5nIChzZXEgcGFyYW1zKSlcbiAgICAgICAgIChtb2RlIDpyZXF1aXJlZClcbiAgICAgICAgIChuYW1lcyBbXSlcbiAgICAgICAgIChkZWZhdWx0cyBbXSkpXG4gICAgKGlmIChlbXB0eT8gcmVtYWluaW5nKVxuICAgICAgezpuYW1lcyBuYW1lcyA6ZGVmYXVsdHMgZGVmYXVsdHN9XG4gICAgICAobGV0KiAoKHggKGZpcnN0IHJlbWFpbmluZykpICh4cyAocmVzdCByZW1haW5pbmcpKSlcbiAgICAgICAgKGNvbmRcbiAgICAgICAgICAoKD0geCAnJm9wdGlvbmFsKSAocmVjdXIgeHMgOm9wdGlvbmFsIG5hbWVzIGRlZmF1bHRzKSlcbiAgICAgICAgICAoKD0geCAnJnJlc3QpIChyZWN1ciB4cyA6cmVzdCBuYW1lcyBkZWZhdWx0cykpXG4gICAgICAgICAgKChpZGVudGljYWw/IG1vZGUgOnJlc3QpIChyZWN1ciB4cyBtb2RlIChjb25qIG5hbWVzICcmIHgpIGRlZmF1bHRzKSlcbiAgICAgICAgICAoKGFuZCAoaWRlbnRpY2FsPyBtb2RlIDpvcHRpb25hbCkgKGxpc3Q/IHgpKVxuICAgICAgICAgIChyZWN1ciB4cyBtb2RlIChjb25qIG5hbWVzIChmaXJzdCB4KSlcbiAgICAgICAgICAgICAgICAgKGNvbmogZGVmYXVsdHMgWyhmaXJzdCB4KSAoc2Vjb25kIHgpXSkpKVxuICAgICAgICAgIChlbHNlIChyZWN1ciB4cyBtb2RlIChjb25qIG5hbWVzIHgpIGRlZmF1bHRzKSkpKSkpKVxuXG4oZGVmdW4gZXhwYW5kLWxhbWJkYVxuICAoJnJlc3QgYXJncylcbiAgXCIobGFtYmRhIChwYXJhbXMqKSBleHBycyopXG4gICAobGFtYmRhIG5hbWUgKHBhcmFtcyopIGV4cHJzKilcblxuICBwYXJhbXMgPT4gcG9zaXRpb25hbC1wYXJhbXMqICwgb3IgcG9zaXRpb25hbC1wYXJhbXMqICZvcHRpb25hbFxuICAob3B0IGRlZmF1bHQ/KSogJnJlc3QgbmV4dC1wYXJhbVxuXG4gIENvbXBpbGVzIHRvIGEgbmFtZWQgYGZ1bmN0aW9uYCBleHByZXNzaW9uIC0tIGtlZXBzIGB0aGlzYCxcbiAgYGFyZ3VtZW50c2AsIGFuZCBuYW1lZCBzZWxmLXJlY3Vyc2lvbi4gTXVsdGktYXJpdHkgY2xhdXNlc1xuICAoKHBhcmFtczEqKSBib2R5MSopICgocGFyYW1zMiopIGJvZHkyKikgLS0gQ2xvanVyZS13aXNwJ3MgYXJpdHlcbiAgb3ZlcmxvYWRpbmcgLS0gYXJlIG5vdCB5ZXQgc3VwcG9ydGVkIGZvciBuZXctc3ludGF4OiB0aGF0IGNhbGwgaXNcbiAgZGVmZXJyZWQgdG8gdGhlIFBoYXNlLTMgYXJpdHktb3ZlcmxvYWRpbmcgY2hlY2twb2ludCAodGlja2V0ICM1KS5cIlxuICAobGV0KiAoKG5hbWUgKGlmIChzeW1ib2w/IChmaXJzdCBhcmdzKSkgKGZpcnN0IGFyZ3MpKSlcbiAgICAgICAgKGRlZnMgKGlmIG5hbWUgKHJlc3QgYXJncykgYXJncykpKVxuICAgIChpZiAoYW5kIChsaXN0PyAoZmlyc3QgZGVmcykpXG4gICAgICAgICAgICAgKGxpc3Q/IChmaXJzdCAoZmlyc3QgZGVmcykpKSlcbiAgICAgICh0aHJvdyAoRXJyb3IgKHN0ciBcImxhbWJkYTogbXVsdGktYXJpdHkgY2xhdXNlcyBhcmUgbm90IHN1cHBvcnRlZCBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgIFwiaW4gbmV3LXN5bnRheCB5ZXQgLS0gdGlja2V0ICM1J3MgYXJpdHktb3ZlcmxvYWRpbmcgXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICBcInF1ZXN0aW9uIGlzIHN0aWxsIG9wZW5cIikpKVxuICAgICAgKGxldCogKChwYXJhbXMgKGZpcnN0IGRlZnMpKVxuICAgICAgICAgICAgKGJvZHkgKHJlc3QgZGVmcykpXG4gICAgICAgICAgICAocGFyc2VkIChwYXJzZS1hcmdsaXN0IHBhcmFtcykpXG4gICAgICAgICAgICAoaW5kaWNlcyAoYmluZC1pbmRpY2VzKiAoOm5hbWVzIHBhcnNlZCkpKVxuICAgICAgICAgICAgKGJpbmRzIChiaW5kLW5hbWVzKiBpbmRpY2VzKSlcbiAgICAgICAgICAgIChhcmd2ICh2ZWMgKG1hcC1pbmRleGVkIChsYW1iZGEgKCUxICUyKSAoZ2V0IGJpbmRzICUxICUyKSkgKDpuYW1lcyBwYXJzZWQpKSkpXG4gICAgICAgICAgICAoZGVzdHJ1Y3R1cmluZyAoaWYgKGVtcHR5PyBiaW5kcylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtgKGxldCoqICwoZGVzdHJ1Y3R1cmUgKHZlYyAobWFwY2F0IChsYW1iZGEgKGkpIFsobnRoICg6bmFtZXMgcGFyc2VkKSBpKSAobnRoIGJpbmRzIGkpXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRpY2VzKSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICxAYm9keSldKSlcbiAgICAgICAgICAgIChkZWZhdWx0aW5nIChtYXAgKGxhbWJkYSAoZCkgYChpZiAobmlsPyAsKGZpcnN0IGQpKSAoc2V0ISAsKGZpcnN0IGQpICwoc2Vjb25kIGQpKSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKDpkZWZhdWx0cyBwYXJzZWQpKSlcbiAgICAgICAgICAgIChib2R5KiAoaWYgKGVtcHR5PyBkZXN0cnVjdHVyaW5nKVxuICAgICAgICAgICAgICAgICAgICAoY29uY2F0IGRlZmF1bHRpbmcgYm9keSlcbiAgICAgICAgICAgICAgICAgICAgKGNvbmNhdCBkZWZhdWx0aW5nIGRlc3RydWN0dXJpbmcpKSkpXG4gICAgICAgIChpZiBuYW1lXG4gICAgICAgICAgYChmbiogLG5hbWUgLGFyZ3YgLEBib2R5KilcbiAgICAgICAgICBgKGZuKiAsYXJndiAsQGJvZHkqKSkpKSkpXG4oaW5zdGFsbC1tYWNybyEgOmxhbWJkYSBleHBhbmQtbGFtYmRhKVxuXG4oZGVmdW4gZXhwYW5kLWxvb3BcbiAgKGJpbmRpbmdzICZyZXN0IGJvZHkpXG4gIFwiRXZhbHVhdGVzIHRoZSBleHBycyBpbiBhIGxleGljYWwgY29udGV4dCBpbiB3aGljaCB0aGUgc3ltYm9scyBpblxuICB0aGUgYmluZGluZy1mb3JtcyBhcmUgYm91bmQgdG8gdGhlaXIgcmVzcGVjdGl2ZSBpbml0LWV4cHJzIG9yIHBhcnRzXG4gIHRoZXJlaW4uIEFjdHMgYXMgYSByZWN1ciB0YXJnZXQuXG5cbiAgRGVwZW5kcyBvbiBkaWN0aW9uYXJ5PywgZGljdGlvbmFyeSwgdmVjLCBnZXRcIlxuICAobGV0KiAoKGJpbmRpbmdzIChwYXJlbi1iaW5kaW5ncy0+dmVjIGJpbmRpbmdzKSlcbiAgICAgICAgKHBhaXJzICAgKHBhcnRpdGlvbiAyIGJpbmRpbmdzKSlcbiAgICAgICAgKGluZGljZXMgKGJpbmQtaW5kaWNlcyogKG1hcHYgZmlyc3QgcGFpcnMpKSlcbiAgICAgICAgKG5hbWVzICAgKGJpbmQtbmFtZXMqIGluZGljZXMpKVxuICAgICAgICAoZ2V0KiAgICAobGFtYmRhICglMSAlMikgKGlmLWxldCBbeCAoYWdldCBuYW1lcyAlMSldXG4gICAgICAgICAgICAgICAgICAgW3ggKHNlY29uZCAlMikgKGZpcnN0ICUyKSB4XVxuICAgICAgICAgICAgICAgICAgICUyKSkpKVxuICAgIChpZiAoZW1wdHk/IG5hbWVzKVxuICAgICAgYChsb29wKiAsYmluZGluZ3MgLEBib2R5KVxuICAgICAgYChsZXQqKiAsKHZlYyAoYXBwbHkgY29uY2F0IChtYXAtaW5kZXhlZCBnZXQqIHBhaXJzKSkpXG4gICAgICAgICAobG9vcCogLCh2ZWMgKGFwcGx5IGNvbmNhdCAobWFwLWluZGV4ZWQgKGxhbWJkYSAoJTEgJTIpIChsZXQqICgoeCAoZ2V0IG5hbWVzICUxIChmaXJzdCAlMikpKSkgW3ggeF0pKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhaXJzKSkpXG4gICAgICAgICAgIChsZXQqKiAsKHZlYyAobWFwY2F0IChsYW1iZGEgKGkpIFsoZmlyc3QgKGFnZXQgcGFpcnMgaSkpIChhZ2V0IG5hbWVzIGkpXSkgaW5kaWNlcykpXG4gICAgICAgICAgICAgLEBib2R5KSkpKSkpXG4oaW5zdGFsbC1tYWNybyA6bG9vcCBleHBhbmQtbG9vcClcbiJdfQ==
