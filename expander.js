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
var buildDefun = function buildDefun(private, fnOp, _andForm, name, params, docPlusBody) {
    return function () {
        var docø1 = isString(first(docPlusBody)) && !isEmpty(rest(docPlusBody)) ? first(docPlusBody) : null;
        var bodyø1 = docø1 ? rest(docPlusBody) : docPlusBody;
        var idø1 = withMeta(name, conj(meta(name) || {}, { 'doc': docø1 }));
        var fnø1 = withMeta(list.apply(null, [fnOp].concat([idø1], [params], vec(bodyø1))), meta(_andForm));
        var defOpø1 = private ? symbol(null, 'defvar-') : symbol(null, 'defvar');
        return list(defOpø1, idø1, fnø1);
    }.call(this);
};
var expandDefun = exports.expandDefun = function expandDefun(_andForm, name, params) {
    var docPlusBody = Array.prototype.slice.call(arguments, 3);
    return buildDefun(false, symbol(null, 'lambda'), _andForm, name, params, docPlusBody);
};
installMacro('defun', withMeta(expandDefun, { 'implicit': ['&form'] }));
var expandDefun = exports.expandDefun = function expandDefun(_andForm, name, params) {
    var docPlusBody = Array.prototype.slice.call(arguments, 3);
    return buildDefun(true, symbol(null, 'lambda'), _andForm, name, params, docPlusBody);
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
var expandLambdaAsync = exports.expandLambdaAsync = function expandLambdaAsync() {
    var args = Array.prototype.slice.call(arguments, 0);
    return isSymbol(first(args)) ? list.apply(null, [symbol(null, 'async')].concat([list.apply(null, [symbol(null, 'lambda')].concat([first(args)], vec(rest(args))))])) : list.apply(null, [symbol(null, 'async')].concat([list.apply(null, [symbol(null, 'lambda')].concat(vec(args)))]));
};
installMacro('lambda-async', expandLambdaAsync);
var expandDefunAsync = exports.expandDefunAsync = function expandDefunAsync(_andForm, name, params) {
    var docPlusBody = Array.prototype.slice.call(arguments, 3);
    return buildDefun(false, symbol(null, 'lambda-async'), _andForm, name, params, docPlusBody);
};
installMacro('defun-async', withMeta(expandDefunAsync, { 'implicit': ['&form'] }));
var expandDefunAsync = exports.expandDefunAsync = function expandDefunAsync(_andForm, name, params) {
    var docPlusBody = Array.prototype.slice.call(arguments, 3);
    return buildDefun(true, symbol(null, 'lambda-async'), _andForm, name, params, docPlusBody);
};
installMacro('defun-async-', withMeta(expandDefunAsync, { 'implicit': ['&form'] }));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndpc3AvZXhwYW5kZXIud2lzcCJdLCJuYW1lcyI6WyJfbnNfIiwiaWQiLCJkb2MiLCJtZXRhIiwid2l0aE1ldGEiLCJpc1N5bWJvbCIsImlzS2V5d29yZCIsImtleXdvcmQiLCJpc1F1b3RlIiwic3ltYm9sIiwibmFtZXNwYWNlIiwibmFtZSIsImdlbnN5bSIsImlzVW5xdW90ZSIsImlzVW5xdW90ZVNwbGljaW5nIiwiaXNMaXN0IiwibGlzdCIsImNvbmoiLCJwYXJ0aXRpb24iLCJzZXEiLCJyZXBlYXRlZGx5IiwiaXNFbXB0eSIsIm1hcCIsIm1hcHYiLCJ2ZWMiLCJzZXQiLCJpc0V2ZXJ5IiwiY29uY2F0IiwiZmlyc3QiLCJzZWNvbmQiLCJ0aGlyZCIsInJlc3QiLCJsYXN0IiwibWFwY2F0IiwibnRoIiwiYnV0bGFzdCIsImludGVybGVhdmUiLCJjb25zIiwiY291bnQiLCJ0YWtlIiwiZGlzc29jIiwic29tZSIsImFzc29jIiwicmVkdWNlIiwiZmlsdGVyIiwiaXNTZXEiLCJ6aXBtYXAiLCJkcm9wIiwibGF6eVNlcSIsInJhbmdlIiwicmV2ZXJzZSIsImRvcnVuIiwibWFwSW5kZXhlZCIsImlzTmlsIiwiaXNEaWN0aW9uYXJ5IiwiaXNWZWN0b3IiLCJrZXlzIiwiZ2V0IiwidmFscyIsImlzU3RyaW5nIiwiaXNOdW1iZXIiLCJpc0Jvb2xlYW4iLCJpc0RhdGUiLCJpc1JlUGF0dGVybiIsImlzRXZlbiIsImlzT2RkIiwiaXNFcXVhbCIsIm1heCIsImluYyIsImRlYyIsImRpY3Rpb25hcnkiLCJtZXJnZSIsInN1YnMiLCJzcGxpdCIsImpvaW4iLCJjYXBpdGFsaXplIiwiX19tYWNyb3NfXyIsImV4cG9ydHMiLCJleHBhbmQiLCJleHBhbmRlciIsImZvcm0iLCJlbnYiLCJtZXRhZGF0YcO4MSIsInBhcm1hc8O4MSIsImltcGxpY2l0w7gxIiwiJCIsInBhcmFtc8O4MSIsImV4cGFuc2lvbsO4MSIsImluc3RhbGxNYWNybyIsIm9wIiwibWFjcm8iLCJpc0RvdFN5bnRheCIsImlzTWV0aG9kU3ludGF4IiwiaWTDuDEiLCJpc0ZpZWxkU3ludGF4IiwiaXNOZXdTeW50YXgiLCJtZXRob2RTeW50YXgiLCJ0YXJnZXQiLCJwYXJhbXMiLCJvcE1ldGHDuDEiLCJmb3JtU3RhcnTDuDEiLCJ0YXJnZXRNZXRhw7gxIiwibWVtYmVyw7gxIiwiYWdldMO4MSIsIm1ldGhvZMO4MSIsIkVycm9yIiwiZmllbGRTeW50YXgiLCJmaWVsZCIsIm1vcmUiLCJzdGFydMO4MSIsImVuZMO4MSIsImRvdFN5bnRheCIsIl9maWVsZMO4MSIsIm5ld1N5bnRheCIsImlkTWV0YcO4MSIsInJlbmFtZcO4MSIsImNvbnN0cnVjdG9yw7gxIiwib3BlcmF0b3LDuDEiLCJrZXl3b3JkSW52b2tlIiwiYXJncyIsImRlc3VnYXIiLCJkZXN1Z2FyZWTDuDEiLCJtYWNyb2V4cGFuZDEiLCJvcMO4MSIsImV4cGFuZGVyw7gxIiwibWFjcm9leHBhbmQiLCJvcmlnaW5hbMO4MSIsImV4cGFuZGVkw7gxIiwic3ludGF4UXVvdGUiLCJyZWFkZXJFcnJvciIsInNlcXVlbmNlRXhwYW5kIiwic3ludGF4UXVvdGVFeHBhbmQiLCJ1bnF1b3RlU3BsaWNpbmdFeHBhbmQiLCJmb3JtcyIsImV4cGFuZE5vdEVxdWFsIiwiYm9keSIsImV4cGFuZElmTm90IiwiY29uZGl0aW9uIiwidHJ1dGh5IiwiYWx0ZXJuYXRpdmUiLCJleHBhbmRDb21tZW50IiwiZXhwYW5kVGhyZWFkRmlyc3QiLCJvcGVyYXRpb25zIiwib3BlcmF0aW9uIiwiZXhwYW5kVGhyZWFkTGFzdCIsImV4cGFuZERvdHMiLCJ4IiwiZXhwYW5kVGhyZWFkQXMiLCJleHByIiwiZXhwYW5kQ29uZCIsImNsYXVzZXMiLCJjbGF1c2XDuDEiLCJ0ZXN0w7gxIiwiYm9kecO4MSIsImV4cGFuZENhc2UiLCJlIiwic3ltw7gxIiwiZXFfw7gxIiwiYyIsInBhaXJzw7gxIiwiY29uZHPDuDEiLCJjb25kc8O4MiIsInJlc3VsdMO4MSIsInjDuDEiLCJ4c8O4MSIsImNvbnN0c8O4MSIsImV4cGFuZENvbmRwIiwicHJlZCIsInN5bV/DuDEiLCJjb21wYXJlw7gxIiwic3BsaXRzw7gxIiwic3BsaXRzIiwieHMiLCJfdGhyZWFkIiwiaW5zZXJ0Iiwic3ltIiwidGVzdCIsImZvcm3DuDIiLCJfY29uZFRocmVhZCIsImV4cGFuZENvbmRUaHJlYWRGaXJzdCIsImV4cGFuZENvbmRUaHJlYWRMYXN0IiwiX3NvbWVUaHJlYWQiLCJleHBhbmRTb21lVGhyZWFkRmlyc3QiLCJleHBhbmRTb21lVGhyZWFkTGFzdCIsImJ1aWxkRGVmdW4iLCJwcml2YXRlIiwiZm5PcCIsIl9hbmRGb3JtIiwiZG9jUGx1c0JvZHkiLCJkb2PDuDEiLCJmbsO4MSIsImRlZk9ww7gxIiwiZXhwYW5kRGVmdW4iLCJleHBhbmREZWZjb25zdCIsInZhbHVlIiwiZXhwYW5kU2V0cSIsInBsYWNlIiwiZXhwYW5kU2V0ZiIsImV4cGFuZExhbWJkYUFzeW5jIiwiZXhwYW5kRGVmdW5Bc3luYyIsImV4cGFuZExhenlTZXEiLCJleHBhbmRXaGVuIiwiZXhwYW5kVW5sZXNzIiwiZXhwYW5kSWZMZXQiLCJiaW5kaW5ncyIsInRoZW4iLCJlbHNlXyIsIm5hbWXDuDEiLCJkZXN0cnVjdHVyZSIsImV4cGFuZFdoZW5MZXQiLCJleHBhbmRJZlNvbWUiLCJleHBhbmRXaGVuU29tZSIsImV4cGFuZFdoZW5GaXJzdCIsImV4cGFuZFdoaWxlIiwiZXhwYW5kRG90byIsImV4cGFuZERvdGltZXMiLCJuw7gxIiwiZm9yU3RlcCIsImNvbnRleHQiLCJsb29wIiwibW9kaWZpZXJzIiwiaXRlcsO4MSIsImNvbGzDuDEiLCJzdWJzZXHDuDEiLCJib2R5X8O4MSIsIm5leHTDuDEiLCJtb2Rzw7gxIiwiYm9kecO4MiIsIm3DuDEiLCJpdGVtw7gxIiwiYXJnw7gxIiwicGFyZW5CaW5kaW5nc1RvVmVjIiwiZm9yTW9kaWZpZXJzIiwiZm9yUGFydHMiLCJzZXFFeHByUGFpcnMiLCJpbmRpY2Vzw7gxIiwic2VnbWVudHPDuDEiLCJzbGljZSIsImV4cGFuZEZvciIsInNlcUV4cHJzIiwiYm9keUV4cHIiLCJwYXJ0c8O4MSIsIiQxIiwiJDIiLCJleHBhbmREb3NlcSIsInN5bV8iLCJzdHJpbmciLCJ3b3Jkc8O4MSIsImJpbmRTeW1fIiwicyIsImIiLCJjb25qU3ltc18iLCJnZXRfIiwicmVzdWx0IiwiayIsInYiLCJmIiwicXVvdGUiLCJrTnPDuDEiLCJnw7gxIiwiZGljdEdldF8iLCJkaWN0TmFtZSIsImRlZmF1bHRzIiwiYmluZGluZyIsImtleSIsInPDuDEiLCJrw7gxIiwiZGVzdHJ1Y3R1cmVEaWN0IiwiZnJvbSIsImRpY3ROYW1lw7gxIiwiZGljdEJpbmTDuDEiLCJnZXRfw7gxIiwia3PDuDEiLCJ2w7gxIiwia1/DuDEiLCJkZXN0cnVjdHVyZVNlcSIsImFzw7gxIiwiZmluZEluZGV4Iiwic2VxTmFtZcO4MSIsImJpbmRpbmcxw7gxIiwibW9yZcO4MSIsInRhaWzDuDEiLCJiaW5kaW5nMsO4MSIsImnDuDEiLCJiaW5kTmFtZXNfIiwiYmluZEluZGljZXNfIiwibmFtZXMiLCJwYWlyIiwiZXhwYW5kTGV0XyIsImV4cGFuZExldCIsImdlbnN5bXPDuDEiLCJfIiwib3V0ZXLDuDEiLCJnIiwiaW5uZXLDuDEiLCJwYXJzZUFyZ2xpc3QiLCJyZW1haW5pbmfDuDEiLCJtb2Rlw7gxIiwibmFtZXPDuDEiLCJkZWZhdWx0c8O4MSIsImV4cGFuZExhbWJkYSIsImRlZnPDuDEiLCJwYXJzZWTDuDEiLCJiaW5kc8O4MSIsImFyZ3bDuDEiLCJkZXN0cnVjdHVyaW5nw7gxIiwiaSIsImRlZmF1bHRpbmfDuDEiLCJkIiwiZXhwYW5kTGFtYmRhXyIsImV4cGFuZERlZnBsdWdpbiIsImF0dHJzw7gxIiwiZGVmbkZvcm1zw7gxIiwicGx1Z2luw7gxIiwiZm9yd2FyZGluZ8O4MSIsImV4cGFuZExvb3AiLCJiaW5kaW5nc8O4MiJdLCJtYXBwaW5ncyI6IjtJQUFBLElBQUNBLEksR0FBRDtBQUFBLFFBQUFDLEUsRUFBSSxlQUFKO0FBQUEsUUFBQUMsRyxFQUNFLHVDQURGO0FBQUEs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UyxNQUFELENBQVEsVUFBU2lSLENBQVQsRUFBWTtBQUFBO0FBQUEsNEJBQUV0UixLQUFELENBQWFtSSxPQUFOLENBQVltSixDQUFaLENBQVAsQ0FBRDtBQUFBLDRCQUE4QlIsT0FBTixDQUFZUSxDQUFaLENBQXhCO0FBQUE7QUFBQSxxQkFBcEIsRUFBNkR2RSxTQUE3RCxDQUFMLEMsT0FDSnBHLEksUUFKVCxDQUZGLENBUE07QUFBQSxLLEtBQVIsQyxJQUFBLEU7Q0FQRixDO0FBcUJDL0MsWUFBRCxDLE1BQUEsRUFBcUJtTyxVQUFyQiIsInNvdXJjZXNDb250ZW50IjpbIihucyB3aXNwLmV4cGFuZGVyXG4gIFwid2lzcCBzeW50YXggYW5kIG1hY3JvIGV4cGFuZGVyIG1vZHVsZVwiXG4gICg6cmVxdWlyZSBbd2lzcC5hc3QgOnJlZmVyIFttZXRhIHdpdGgtbWV0YSBzeW1ib2w/IGtleXdvcmQ/IGtleXdvcmRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1b3RlPyBzeW1ib2wgbmFtZXNwYWNlIG5hbWUgZ2Vuc3ltXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bnF1b3RlPyB1bnF1b3RlLXNwbGljaW5nP11dXG4gICAgICAgICAgICBbd2lzcC5zZXF1ZW5jZSA6cmVmZXIgW2xpc3Q/IGxpc3QgY29uaiBwYXJ0aXRpb24gc2VxIHJlcGVhdGVkbHlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW1wdHk/IG1hcCBtYXB2IHZlYyBzZXQgZXZlcnk/IGNvbmNhdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaXJzdCBzZWNvbmQgdGhpcmQgcmVzdCBsYXN0IG1hcGNhdCBudGhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnV0bGFzdCBpbnRlcmxlYXZlIGNvbnMgY291bnQgdGFrZSBkaXNzb2NcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc29tZSBhc3NvYyByZWR1Y2UgZmlsdGVyIHNlcT8gemlwbWFwIGRyb3BcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGF6eS1zZXEgcmFuZ2UgcmV2ZXJzZSBkb3J1biBtYXAtaW5kZXhlZF1dXG4gICAgICAgICAgICBbd2lzcC5ydW50aW1lIDpyZWZlciBbbmlsPyBkaWN0aW9uYXJ5PyB2ZWN0b3I/IGtleXMgZ2V0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFscyBzdHJpbmc/IG51bWJlcj8gYm9vbGVhbj9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRlPyByZS1wYXR0ZXJuPyBldmVuPyBvZGQ/ID0gbWF4XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5jIGRlYyBkaWN0aW9uYXJ5IG1lcmdlIHN1YnNdXVxuICAgICAgICAgICAgW3dpc3Auc3RyaW5nIDpyZWZlciBbc3BsaXQgam9pbiBjYXBpdGFsaXplXV0pKVxuXG5cbihkZWZ2YXIgKiptYWNyb3MqKiB7fSlcblxuKGRlZnVuLSBleHBhbmRcbiAgKGV4cGFuZGVyIGZvcm0gZW52KVxuICBcIkFwcGxpZXMgbWFjcm8gcmVnaXN0ZXJlZCB3aXRoIGdpdmVuIGBuYW1lYCB0byBhIGdpdmVuIGBmb3JtYFwiXG4gIChsZXQqICgobWV0YWRhdGEgKG9yIChtZXRhIGZvcm0pIHt9KSlcbiAgICAgICAgKHBhcm1hcyAocmVzdCBmb3JtKSlcbiAgICAgICAgKGltcGxpY2l0IChtYXAgKGxhbWJkYSAoJSkgKGNvbmQgKCg9IDomZm9ybSAlKSBmb3JtKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKD0gOiZlbnYgJSkgZW52KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZWxzZSAlKSkpXG4gICAgICAgICAgICAgICAgICAgICAgKG9yICg6aW1wbGljaXQgKG1ldGEgZXhwYW5kZXIpKSBbXSkpKVxuICAgICAgICAocGFyYW1zICh2ZWMgKGNvbmNhdCBpbXBsaWNpdCAodmVjIChyZXN0IGZvcm0pKSkpKVxuXG4gICAgICAgIChleHBhbnNpb24gKGFwcGx5IGV4cGFuZGVyIHBhcmFtcykpKVxuICAgIChpZiBleHBhbnNpb25cbiAgICAgICh3aXRoLW1ldGEgZXhwYW5zaW9uIChjb25qIG1ldGFkYXRhIChtZXRhIGV4cGFuc2lvbikpKVxuICAgICAgZXhwYW5zaW9uKSkpXG5cbihkZWZ1biBpbnN0YWxsLW1hY3JvIVxuICAob3AgZXhwYW5kZXIpXG4gIFwiUmVnaXN0ZXJzIGdpdmVuIGBtYWNyb2Agd2l0aCBhIGdpdmVuIGBuYW1lYFwiXG4gIChzZXRmIChnZXQgKiptYWNyb3MqKiAobmFtZSBvcCkpIGV4cGFuZGVyKSlcblxuKGRlZnVuLSBtYWNyb1xuICAob3ApXG4gIFwiUmV0dXJucyB0cnVlIGlmIG1hY3JvIHdpdGggYSBnaXZlbiBuYW1lIGlzIHJlZ2lzdGVyZWRcIlxuICAoYW5kIChzeW1ib2w/IG9wKVxuICAgICAgIChnZXQgKiptYWNyb3MqKiAobmFtZSBvcCkpKSlcblxuXG4oZGVmdW4gZG90LXN5bnRheD9cbiAgKG9wKVxuICAoYW5kIChzeW1ib2w/IG9wKSAoaWRlbnRpY2FsPyBcXC4gKG5hbWUgb3ApKSkpXG5cbihkZWZ1biBtZXRob2Qtc3ludGF4P1xuICAob3ApXG4gIChsZXQqICgoaWQgKGFuZCAoc3ltYm9sPyBvcCkgKG5hbWUgb3ApKSkpXG4gICAgKGFuZCBpZFxuICAgICAgICAgKGlkZW50aWNhbD8gXFwuIChmaXJzdCBpZCkpXG4gICAgICAgICAobm90IChpZGVudGljYWw/IFxcLSAoc2Vjb25kIGlkKSkpXG4gICAgICAgICAobm90IChpZGVudGljYWw/IFxcLiBpZCkpKSkpXG5cbihkZWZ1biBmaWVsZC1zeW50YXg/XG4gIChvcClcbiAgKGxldCogKChpZCAoYW5kIChzeW1ib2w/IG9wKSAobmFtZSBvcCkpKSlcbiAgICAoYW5kIGlkXG4gICAgICAgICAoaWRlbnRpY2FsPyBcXC4gKGZpcnN0IGlkKSlcbiAgICAgICAgIChpZGVudGljYWw/IFxcLSAoc2Vjb25kIGlkKSkpKSlcblxuKGRlZnVuIG5ldy1zeW50YXg/XG4gIChvcClcbiAgKGxldCogKChpZCAoYW5kIChzeW1ib2w/IG9wKSAobmFtZSBvcCkpKSlcbiAgICAoYW5kIGlkXG4gICAgICAgICAoaWRlbnRpY2FsPyBcXC4gKGxhc3QgaWQpKVxuICAgICAgICAgKG5vdCAoaWRlbnRpY2FsPyBcXC4gaWQpKSkpKVxuXG4oZGVmdW4gbWV0aG9kLXN5bnRheFxuICAob3AgdGFyZ2V0ICZyZXN0IHBhcmFtcylcbiAgXCJFeGFtcGxlOlxuICAnKC5zdWJzdHJpbmcgc3RyaW5nIDIgNSkgPT4gJygoYWdldCBzdHJpbmcgJ3N1YnN0cmluZykgMiA1KVwiXG4gIChsZXQqICgob3AtbWV0YSAobWV0YSBvcCkpXG4gICAgICAgIChmb3JtLXN0YXJ0ICg6c3RhcnQgb3AtbWV0YSkpXG4gICAgICAgICh0YXJnZXQtbWV0YSAobWV0YSB0YXJnZXQpKVxuICAgICAgICAobWVtYmVyICh3aXRoLW1ldGEgKHN5bWJvbCAoc3VicyAobmFtZSBvcCkgMSkpXG4gICAgICAgICAgICAgICAgIDs7IEluY2x1ZGUgbWV0YWRhdCBmcm9tIHRoZSBvcmlnaW5hbCBzeW1ib2wganVzdFxuICAgICAgICAgICAgICAgICAoY29uaiBvcC1tZXRhXG4gICAgICAgICAgICAgICAgICAgICAgIHs6c3RhcnQgezpsaW5lICg6bGluZSBmb3JtLXN0YXJ0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Y29sdW1uIChpbmMgKDpjb2x1bW4gZm9ybS1zdGFydCkpfX0pKSlcbiAgICAgICAgOzsgQWRkIG1ldGFkYXRhIHRvIGFnZXQgc3ltYm9sIHRoYXQgd2lsbCBtYXAgdG8gdGhlIGZpcnN0IGAuYFxuICAgICAgICA7OyBjaGFyYWN0ZXIgb2YgdGhlIG1ldGhvZCBuYW1lLlxuICAgICAgICAoYWdldCAod2l0aC1tZXRhICdhZ2V0XG4gICAgICAgICAgICAgICAoY29uaiBvcC1tZXRhXG4gICAgICAgICAgICAgICAgICAgICB7OmVuZCB7OmxpbmUgKDpsaW5lIGZvcm0tc3RhcnQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOmNvbHVtbiAoaW5jICg6Y29sdW1uIGZvcm0tc3RhcnQpKX19KSkpXG5cbiAgICAgICAgOzsgRmlyc3QgdHdvIGZvcm1zICguc3Vic3RyaW5nIHN0cmluZyAuLi4pIGV4cGFuZCB0b1xuICAgICAgICA7OyAoKGFnZXQgc3RyaW5nICdzdWJzdHJpbmcpIC4uLikgdGhlcmUgZm9yIGV4cGFuc2lvbiBnZXRzXG4gICAgICAgIDs7IHBvc2l0aW9uIG1ldGFkYXRhIGZyb20gc3RhcnQgb2YgdGhlIGZpcnN0IGAuc3Vic3RyaW5nYCBmb3JtXG4gICAgICAgIDs7IHRvIHRoZSBlbmQgb2YgdGhlIGBzdHJpbmdgIGZvcm0uXG4gICAgICAgIChtZXRob2QgKHdpdGgtbWV0YSBgKCxhZ2V0ICx0YXJnZXQgKHF1b3RlICxtZW1iZXIpKVxuICAgICAgICAgICAgICAgICAoY29uaiBvcC1tZXRhXG4gICAgICAgICAgICAgICAgICAgICAgIHs6ZW5kICg6ZW5kIChtZXRhIHRhcmdldCkpfSkpKSlcbiAgICAoaWYgKG5pbD8gdGFyZ2V0KVxuICAgICAgKHRocm93IChFcnJvciBcIk1hbGZvcm1lZCBtZXRob2QgZXhwcmVzc2lvbiwgZXhwZWN0aW5nICgubWV0aG9kIG9iamVjdCAuLi4pXCIpKVxuICAgICAgYCgsbWV0aG9kICxAcGFyYW1zKSkpKVxuXG4oZGVmdW4gZmllbGQtc3ludGF4XG4gIChmaWVsZCB0YXJnZXQgJnJlc3QgbW9yZSlcbiAgXCJFeGFtcGxlOlxuICAnKC4tZmllbGQgb2JqZWN0KSA9PiAnKGFnZXQgb2JqZWN0ICdmaWVsZClcIlxuICAobGV0KiAoKG1ldGFkYXRhIChtZXRhIGZpZWxkKSlcbiAgICAgICAgKHN0YXJ0ICg6c3RhcnQgbWV0YWRhdGEpKVxuICAgICAgICAoZW5kICg6ZW5kIG1ldGFkYXRhKSlcbiAgICAgICAgKG1lbWJlciAod2l0aC1tZXRhIChzeW1ib2wgKHN1YnMgKG5hbWUgZmllbGQpIDIpKVxuICAgICAgICAgICAgICAgICAoY29uaiBtZXRhZGF0YVxuICAgICAgICAgICAgICAgICAgICAgICB7OnN0YXJ0IHs6bGluZSAoOmxpbmUgc3RhcnQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpjb2x1bW4gKCsgKDpjb2x1bW4gc3RhcnQpIDIpfX0pKSkpXG4gICAgKGlmIChvciAobmlsPyB0YXJnZXQpXG4gICAgICAgICAgICAoY291bnQgbW9yZSkpXG4gICAgICAodGhyb3cgKEVycm9yIFwiTWFsZm9ybWVkIG1lbWJlciBleHByZXNzaW9uLCBleHBlY3RpbmcgKC4tbWVtYmVyIHRhcmdldClcIikpXG4gICAgICBgKGFnZXQgLHRhcmdldCAocXVvdGUgLG1lbWJlcikpKSkpXG5cbihkZWZ1biBkb3Qtc3ludGF4XG4gIChvcCB0YXJnZXQgZmllbGQgJnJlc3QgcGFyYW1zKVxuICBcIkV4YW1wbGU6XG4gICcoLiBvYmplY3QgLWZpZWxkKSA9PiAnKGFnZXQgb2JqZWN0ICdmaWVsZClcbiAgJyguIHN0cmluZyBzdWJzdHJpbmcgMiA1KSA9PiAnKChhZ2V0IHN0cmluZyAnc3Vic3RyaW5nKSAyIDUpXCJcbiAgKGlmLW5vdCAoc3ltYm9sPyBmaWVsZClcbiAgICAodGhyb3cgKEVycm9yIFwiTWFsZm9ybWVkIC4gZm9ybVwiKSkpXG4gIChsZXQqICgoKmZpZWxkIChuYW1lIGZpZWxkKSkpXG4gICAgKGFwcGx5IChpZiAoaWRlbnRpY2FsPyBcXC0gKGZpcnN0ICpmaWVsZCkpIGZpZWxkLXN5bnRheCBtZXRob2Qtc3ludGF4KVxuICAgICAgICAgICAoc3ltYm9sIChzdHIgXFwuICpmaWVsZCkpIHRhcmdldCBwYXJhbXMpKSlcblxuKGRlZnVuIG5ldy1zeW50YXhcbiAgKG9wICZyZXN0IHBhcmFtcylcbiAgXCJFeGFtcGxlOlxuICAnKFBvaW50LiB4IHkpID0+ICcobmV3IFBvaW50IHggeSlcIlxuICAobGV0KiAoKGlkIChuYW1lIG9wKSlcbiAgICAgICAgKGlkLW1ldGEgKDptZXRhIGlkKSlcbiAgICAgICAgKHJlbmFtZSAoc3VicyBpZCAwIChkZWMgKGNvdW50IGlkKSkpKVxuICAgICAgICA7OyBjb25zdHJ1Y3R1ciBzeW1ib2wgaW5oZXJpdHMgbWV0YWRhIGZyb20gdGhlIGZpcnN0IGBvcGAgZm9ybVxuICAgICAgICA7OyBpdCdzIGp1c3QgaXQncyBlbmQgY29sdW1uIGluZm8gaXMgdXBkYXRlZCB0byByZWZsZWN0IHN1YnRyYWN0aW9uXG4gICAgICAgIDs7IG9mIGAuYCBjaGFyYWN0ZXIuXG4gICAgICAgIChjb25zdHJ1Y3RvciAod2l0aC1tZXRhIChzeW1ib2wgcmVuYW1lKVxuICAgICAgICAgICAgICAgICAgICAgIChjb25qIGlkLW1ldGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7OmVuZCB7OmxpbmUgKDpsaW5lICg6ZW5kIGlkLW1ldGEpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Y29sdW1uIChkZWMgKDpjb2x1bW4gKDplbmQgaWQtbWV0YSkpKX19KSkpXG4gICAgICAgIChvcGVyYXRvciAod2l0aC1tZXRhICduZXdcbiAgICAgICAgICAgICAgICAgICAoY29uaiBpZC1tZXRhXG4gICAgICAgICAgICAgICAgICAgICAgICAgezpzdGFydCB7OmxpbmUgKDpsaW5lICg6ZW5kIGlkLW1ldGEpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpjb2x1bW4gKGRlYyAoOmNvbHVtbiAoOmVuZCBpZC1tZXRhKSkpfX0pKSkpXG4gICAgYChuZXcgLGNvbnN0cnVjdG9yICxAcGFyYW1zKSkpXG5cbihkZWZ1biBrZXl3b3JkLWludm9rZVxuICAoa2V5d29yZCB0YXJnZXQgJnJlc3QgYXJncylcbiAgXCJDYWxsaW5nIGEga2V5d29yZCBkZXN1Z2FycyB0byBwcm9wZXJ0eSBhY2Nlc3Mgd2l0aCB0aGF0XG4gIGtleXdvcmQgbmFtZSBvbiB0aGUgZ2l2ZW4gYXJndW1lbnQ6XG4gICcoOmZvbyBiYXIpID0+ICcoZ2V0IGJhciA6Zm9vKVwiXG4gIChpZiAoZW1wdHk/IGFyZ3MpXG4gICAgYChnZXQgLHRhcmdldCAsa2V5d29yZClcbiAgICBgKGdldCAsdGFyZ2V0ICxrZXl3b3JkICwoZmlyc3QgYXJncykpKSlcblxuKGRlZnVuLSBkZXN1Z2FyXG4gIChleHBhbmRlciBmb3JtKVxuICAobGV0KiAoKGRlc3VnYXJlZCAoYXBwbHkgZXhwYW5kZXIgKHZlYyBmb3JtKSkpXG4gICAgICAgIChtZXRhZGF0YSAoY29uaiB7fSAobWV0YSBmb3JtKSAobWV0YSBkZXN1Z2FyZWQpKSkpXG4gICAgKHdpdGgtbWV0YSBkZXN1Z2FyZWQgbWV0YWRhdGEpKSlcblxuKGRlZnVuIG1hY3JvZXhwYW5kLTFcbiAgKGZvcm0gZW52KVxuICBcIklmIGZvcm0gcmVwcmVzZW50cyBhIG1hY3JvIGZvcm0sIHJldHVybnMgaXRzIGV4cGFuc2lvbixcbiAgZWxzZSByZXR1cm5zIGZvcm0uXCJcbiAgKGxldCogKChvcCAoYW5kIChsaXN0PyBmb3JtKVxuICAgICAgICAgICAgICAgIChmaXJzdCBmb3JtKSkpXG4gICAgICAgIChleHBhbmRlciAobWFjcm8gb3ApKSlcbiAgICAoY29uZCAoZXhwYW5kZXIgKGV4cGFuZCBleHBhbmRlciBmb3JtIGVudikpXG4gICAgICAgICAgOzsgQ2FsbGluZyBhIGtleXdvcmQgY29tcGlsZXMgdG8gZ2V0dGluZyB2YWx1ZSBmcm9tIGdpdmVuXG4gICAgICAgICAgOzsgb2JqZWN0IGFzc29jaWF0ZWQgd2l0aCB0aGF0IGtleTpcbiAgICAgICAgICA7OyAnKDpmb28gYmFyKSA9PiAnKGdldCBiYXIgOmZvbylcbiAgICAgICAgICAoKGtleXdvcmQ/IG9wKSAoZGVzdWdhciBrZXl3b3JkLWludm9rZSBmb3JtKSlcbiAgICAgICAgICA7OyAnKC4gb2JqZWN0IG1ldGhvZCBmb28gYmFyKSA9PiAnKChhZ2V0IG9iamVjdCBtZXRob2QpIGZvbyBiYXIpXG4gICAgICAgICAgKChkb3Qtc3ludGF4PyBvcCkgKGRlc3VnYXIgZG90LXN5bnRheCBmb3JtKSlcbiAgICAgICAgICA7OyAnKC4tZmllbGQgb2JqZWN0KSA9PiAnKGFnZXQgb2JqZWN0ICdmaWVsZClcbiAgICAgICAgICAoKGZpZWxkLXN5bnRheD8gb3ApIChkZXN1Z2FyIGZpZWxkLXN5bnRheCBmb3JtKSlcbiAgICAgICAgICA7OyAnKC5zdWJzdHJpbmcgc3RyaW5nIDIgNSkgPT4gJygoYWdldCBzdHJpbmcgJ3N1YnN0cmluZykgMiA1KVxuICAgICAgICAgICgobWV0aG9kLXN5bnRheD8gb3ApIChkZXN1Z2FyIG1ldGhvZC1zeW50YXggZm9ybSkpXG4gICAgICAgICAgOzsgJyhQb2ludC4geCB5KSA9PiAnKG5ldyBQb2ludCB4IHkpXG4gICAgICAgICAgKChuZXctc3ludGF4PyBvcCkgKGRlc3VnYXIgbmV3LXN5bnRheCBmb3JtKSlcbiAgICAgICAgICAoZWxzZSBmb3JtKSkpKVxuXG4oZGVmdW4gbWFjcm9leHBhbmRcbiAgKGZvcm0gZW52KVxuICBcIlJlcGVhdGVkbHkgY2FsbHMgbWFjcm9leHBhbmQtMSBvbiBmb3JtIHVudGlsIGl0IG5vIGxvbmdlclxuICByZXByZXNlbnRzIGEgbWFjcm8gZm9ybSwgdGhlbiByZXR1cm5zIGl0LlwiXG4gIChsb29wICgob3JpZ2luYWwgZm9ybSlcbiAgICAgICAgIChleHBhbmRlZCAobWFjcm9leHBhbmQtMSBmb3JtIGVudikpKVxuICAgIChpZiAoaWRlbnRpY2FsPyBvcmlnaW5hbCBleHBhbmRlZClcbiAgICAgIG9yaWdpbmFsXG4gICAgICAocmVjdXIgZXhwYW5kZWQgKG1hY3JvZXhwYW5kLTEgZXhwYW5kZWQgZW52KSkpKSlcblxuXG47OyBEZWZpbmUgY29yZSBtYWNyb3NcblxuXG47OyBUT0RPIG1ha2UgdGhpcyBsYW5ndWFnZSBpbmRlcGVuZGVudFxuXG4oZGVmdW4gc3ludGF4LXF1b3RlIChmb3JtKVxuICAoY29uZCAoKHN5bWJvbD8gZm9ybSkgKGxpc3QgJ3F1b3RlIGZvcm0pKVxuICAgICAgICAoKGtleXdvcmQ/IGZvcm0pIChsaXN0ICdxdW90ZSBmb3JtKSlcbiAgICAgICAgKChvciAobnVtYmVyPyBmb3JtKVxuICAgICAgICAgICAgKHN0cmluZz8gZm9ybSlcbiAgICAgICAgICAgIChib29sZWFuPyBmb3JtKVxuICAgICAgICAgICAgKG5pbD8gZm9ybSlcbiAgICAgICAgICAgIChyZS1wYXR0ZXJuPyBmb3JtKSkgZm9ybSlcblxuICAgICAgICAoKHVucXVvdGU/IGZvcm0pIChzZWNvbmQgZm9ybSkpXG4gICAgICAgICgodW5xdW90ZS1zcGxpY2luZz8gZm9ybSkgKHJlYWRlci1lcnJvciBcIklsbGVnYWwgdXNlIG9mIGAsQGAgZXhwcmVzc2lvbiwgY2FuIG9ubHkgYmUgcHJlc2VudCBpbiBhIGxpc3RcIikpXG5cbiAgICAgICAgKChlbXB0eT8gZm9ybSkgZm9ybSlcblxuICAgICAgICA7O1xuICAgICAgICAoKGRpY3Rpb25hcnk/IGZvcm0pIChsaXN0ICdhcHBseVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RpY3Rpb25hcnlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChjb25zICcuY29uY2F0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoc2VxdWVuY2UtZXhwYW5kIChhcHBseSBjb25jYXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChzZXEgZm9ybSkpKSkpKVxuICAgICAgICA7OyBJZiBhIHZlY3RvciBmb3JtIGV4cGFuZCBhbGwgc3ViLWZvcm1zIGFuZCBjb25jYXRlbmF0ZVxuICAgICAgICA7OyB0aGVtIHRvZ2V0aGVyOlxuICAgICAgICA7O1xuICAgICAgICA7OyBbLGEgYiAsQGNdIC0+ICguY29uY2F0IFthXSBbKHF1b3RlIGIpXSBjKVxuICAgICAgICAoKHZlY3Rvcj8gZm9ybSkgKGNvbnMgJy5jb25jYXQgKHNlcXVlbmNlLWV4cGFuZCBmb3JtKSkpXG5cbiAgICAgICAgOzsgSWYgYSBsaXN0IGZvcm0gZXhwYW5kIGFsbCB0aGUgc3ViLWZvcm1zIGFuZCBhcHBseVxuICAgICAgICA7OyBjb25jYXRlbmF0aW9uIHRvIGEgbGlzdCBjb25zdHJ1Y3RvcjpcbiAgICAgICAgOztcbiAgICAgICAgOzsgKCxhIGIgLEBjKSAtPiAoYXBwbHkgbGlzdCAoLmNvbmNhdCBbYV0gWyhxdW90ZSBiKV0gYykpXG4gICAgICAgICgobGlzdD8gZm9ybSkgKGlmIChlbXB0eT8gZm9ybSlcbiAgICAgICAgICAgICAgICAgICAgICAgKGNvbnMgJ2xpc3QgbmlsKVxuICAgICAgICAgICAgICAgICAgICAgICAobGlzdCAnYXBwbHlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2xpc3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGNvbnMgJy5jb25jYXQgKHNlcXVlbmNlLWV4cGFuZCBmb3JtKSkpKSlcblxuICAgICAgICAoZWxzZSAocmVhZGVyLWVycm9yIFwiVW5rbm93biBDb2xsZWN0aW9uIHR5cGVcIikpKSlcbihkZWZ2YXIgc3ludGF4LXF1b3RlLWV4cGFuZCBzeW50YXgtcXVvdGUpXG5cbihkZWZ1biB1bnF1b3RlLXNwbGljaW5nLWV4cGFuZFxuICAoZm9ybSlcbiAgKGlmICh2ZWN0b3I/IGZvcm0pXG4gICAgZm9ybVxuICAgIChsaXN0ICd2ZWMgZm9ybSkpKVxuXG4oZGVmdW4gc2VxdWVuY2UtZXhwYW5kXG4gIChmb3JtcylcbiAgXCJUYWtlcyBzZXF1ZW5jZSBvZiBmb3JtcyBhbmQgZXhwYW5kcyB0aGVtOlxuXG4gICgodW5xdW90ZSBhKSkgLT4gKFthXSlcbiAgKCh1bnF1b3RlLXNwbGljaW5nIGEpKSAtPiAoYSlcbiAgKGEpIC0+IChbKHF1b3RlIGIpXSlcbiAgKCh1bnF1b3RlIGEpIGIgKHVucXVvdGUtc3BsaWNpbmcgYSkpIC0+IChbYV0gWyhxdW90ZSBiKV0gYylcIlxuICAobWFwIChsYW1iZGEgKGZvcm0pXG4gICAgICAgICAoY29uZCAoKHVucXVvdGU/IGZvcm0pIFsoc2Vjb25kIGZvcm0pXSlcbiAgICAgICAgICAgICAgICgodW5xdW90ZS1zcGxpY2luZz8gZm9ybSkgKHVucXVvdGUtc3BsaWNpbmctZXhwYW5kIChzZWNvbmQgZm9ybSkpKVxuICAgICAgICAgICAgICAgKGVsc2UgWyhzeW50YXgtcXVvdGUtZXhwYW5kIGZvcm0pXSkpKVxuICAgICAgIGZvcm1zKSlcbihpbnN0YWxsLW1hY3JvISA6c3ludGF4LXF1b3RlIHN5bnRheC1xdW90ZS1leHBhbmQpXG5cbjs7IFRPRE86IE5ldyByZWFkZXIgdHJhbnNsYXRlcyBub3Q9IGNvcnJlY3RseVxuOzsgYnV0IGZvciB0aGUgdGltZSBiZWluZyB1c2Ugbm90LWVxdWFsIG5hbWVcbihkZWZ1biBleHBhbmQtbm90LWVxdWFsXG4gICgmcmVzdCBib2R5KVxuICBgKG5vdCAoPSAsQGJvZHkpKSlcbihpbnN0YWxsLW1hY3JvISA6bm90PSBleHBhbmQtbm90LWVxdWFsKVxuXG4oZGVmdW4gZXhwYW5kLWlmLW5vdFxuICAoY29uZGl0aW9uIHRydXRoeSBhbHRlcm5hdGl2ZSlcbiAgXCJDb21wbGVtZW50cyB0aGUgYGlmYCBleGNsdXNpdmUgY29uZGl0aW9uYWwgYnJhbmNoLlwiXG4gIGAoaWYgKG5vdCAsY29uZGl0aW9uKSAsdHJ1dGh5ICxhbHRlcm5hdGl2ZSkpXG4oaW5zdGFsbC1tYWNybyEgOmlmLW5vdCBleHBhbmQtaWYtbm90KVxuXG4oZGVmdW4gZXhwYW5kLWNvbW1lbnRcbiAgKCZyZXN0IGJvZHkpXG4gIFwiSWdub3JlcyBib2R5LCB5aWVsZHMgbmlsXCJcbiAgbmlsKVxuKGluc3RhbGwtbWFjcm8hIDpjb21tZW50IGV4cGFuZC1jb21tZW50KVxuXG4oZGVmdW4gZXhwYW5kLXRocmVhZC1maXJzdFxuICAoJnJlc3Qgb3BlcmF0aW9ucylcbiAgXCJUaHJlYWQgZmlyc3QgbWFjcm9cIlxuICAocmVkdWNlXG4gICAgKGxhbWJkYSAoZm9ybSBvcGVyYXRpb24pXG4gICAgICAoY29ucyAoZmlyc3Qgb3BlcmF0aW9uKVxuICAgICAgICAgICAgKGNvbnMgZm9ybSAocmVzdCBvcGVyYXRpb24pKSkpXG4gICAgKGZpcnN0IG9wZXJhdGlvbnMpXG4gICAgKG1hcCAobGFtYmRhICglKSAoaWYgKGxpc3Q/ICUpICUgYCgsJSkpKVxuICAgICAgICAgKHJlc3Qgb3BlcmF0aW9ucykpKSlcbihpbnN0YWxsLW1hY3JvISA6LT4gZXhwYW5kLXRocmVhZC1maXJzdClcblxuKGRlZnVuIGV4cGFuZC10aHJlYWQtbGFzdFxuICAoJnJlc3Qgb3BlcmF0aW9ucylcbiAgXCJUaHJlYWQgbGFzdCBtYWNyb1wiXG4gIChyZWR1Y2VcbiAgICAobGFtYmRhIChmb3JtIG9wZXJhdGlvbikgKGNvbmNhdCBvcGVyYXRpb24gW2Zvcm1dKSlcbiAgICAoZmlyc3Qgb3BlcmF0aW9ucylcbiAgICAobWFwIChsYW1iZGEgKCUpIChpZiAobGlzdD8gJSkgJSBgKCwlKSkpXG4gICAgICAgICAocmVzdCBvcGVyYXRpb25zKSkpKVxuKGluc3RhbGwtbWFjcm8hIDotPj4gZXhwYW5kLXRocmVhZC1sYXN0KVxuXG4oZGVmdW4gZXhwYW5kLWRvdHNcbiAgKHggJnJlc3QgZm9ybXMpXG4gIFwiZm9ybSA9PiBmaWVsZE5hbWUtc3ltYm9sIG9yIChpbnN0YW5jZU1ldGhvZE5hbWUtc3ltYm9sIGFyZ3MqKVxuICBFeHBhbmRzIGludG8gYSBtZW1iZXIgYWNjZXNzICguKSBvZiB0aGUgZmlyc3QgbWVtYmVyIG9uIHRoZSBmaXJzdFxuICBhcmd1bWVudCwgZm9sbG93ZWQgYnkgdGhlIG5leHQgbWVtYmVyIG9uIHRoZSByZXN1bHQsIGV0Yy4gRm9yXG4gIGluc3RhbmNlOlxuICAoLi4gZG9jdW1lbnQgLWJvZHkgKGdldC1hdHRyaWJ1dGUgOmNsYXNzKSlcbiAgZXhwYW5kcyB0bzpcbiAgKC4gKC4gZG9jdW1lbnQgLWJvZHkpIGdldC1hdHRyaWJ1dGUgOmNsYXNzKVxuICBidXQgaXMgZWFzaWVyIHRvIHdyaXRlLCByZWFkLCBhbmQgdW5kZXJzdGFuZC5cIlxuICBgKC0+ICx4ICxAKG1hcCAobGFtYmRhICglKSAoaWYgKGxpc3Q/ICUpIChjb25zICcuICUpIChsaXN0ICcuICUpKSlcbiAgICAgICAgICAgICAgICAgZm9ybXMpKSlcbihpbnN0YWxsLW1hY3JvISA6Li4gZXhwYW5kLWRvdHMpXG5cbihkZWZ1biBleHBhbmQtdGhyZWFkLWFzXG4gIChleHByIG5hbWUgJnJlc3QgZm9ybXMpXG4gIFwiQmluZHMgbmFtZSB0byBleHByLCBldmFsdWF0ZXMgdGhlIGZpcnN0IGZvcm0gaW4gdGhlIGxleGljYWwgY29udGV4dFxuICBvZiB0aGF0IGJpbmRpbmcsIHRoZW4gYmluZHMgbmFtZSB0byB0aGF0IHJlc3VsdCwgcmVwZWF0aW5nIGZvciBlYWNoXG4gIHN1Y2Nlc3NpdmUgZm9ybSwgcmV0dXJuaW5nIHRoZSByZXN1bHQgb2YgdGhlIGxhc3QgZm9ybS5cIlxuICBgKGxldCoqIFssbmFtZSAsZXhwclxuICAgICAgICAgICAsQChtYXBjYXQgKGxhbWJkYSAoZm9ybSkgW25hbWUgZm9ybV0pXG4gICAgICAgICAgICAgICAgICAgICBmb3JtcyldXG4gICAgICxuYW1lKSlcbihpbnN0YWxsLW1hY3JvISA6YXMtPiBleHBhbmQtdGhyZWFkLWFzKVxuXG5cbihkZWZ1biBleHBhbmQtY29uZFxuICAoJnJlc3QgY2xhdXNlcylcbiAgXCJUYWtlcyBhIHNldCBvZiAodGVzdCBib2R5KikgcGFyZW4gY2xhdXNlcy4gSXQgZXZhbHVhdGVzIGVhY2ggdGVzdFxuICBvbmUgYXQgYSB0aW1lLiAgSWYgYSB0ZXN0IHJldHVybnMgbG9naWNhbCB0cnVlLCBjb25kIGV2YWx1YXRlcyBhbmRcbiAgcmV0dXJucyB0aGUgdmFsdWUgb2YgdGhlIGNvcnJlc3BvbmRpbmcgYm9keSAoYW4gaW1wbGljaXQgcHJvZ24pIGFuZFxuICBkb2Vzbid0IGV2YWx1YXRlIGFueSBvZiB0aGUgb3RoZXIgdGVzdHMgb3IgYm9kaWVzLiBUaGUgYmFyZSBzeW1ib2xcbiAgYGVsc2VgIGlzIHRoZSBjYXRjaC1hbGwgY2xhdXNlLiAoY29uZCkgcmV0dXJucyBuaWwuXCJcbiAgKGlmIChub3QgKGVtcHR5PyBjbGF1c2VzKSlcbiAgICAobGV0KiAoKGNsYXVzZSAoZmlyc3QgY2xhdXNlcykpICh0ZXN0IChmaXJzdCBjbGF1c2UpKSAoYm9keSAocmVzdCBjbGF1c2UpKSlcbiAgICAgIChpZiAoPSB0ZXN0ICdlbHNlKVxuICAgICAgICBgKHByb2duICxAYm9keSlcbiAgICAgICAgYChpZiAsdGVzdCAocHJvZ24gLEBib2R5KSAoY29uZCAsQChyZXN0IGNsYXVzZXMpKSkpKSkpXG4oaW5zdGFsbC1tYWNybyEgOmNvbmQgZXhwYW5kLWNvbmQpXG5cbihkZWZ1biBleHBhbmQtY2FzZVxuICAoZSAmcmVzdCBjbGF1c2VzKVxuICBcIlRha2VzIGFuIGV4cHJlc3Npb24sIGFuZCBhIHNldCBvZiAodGVzdC1jb25zdGFudCBib2R5KikgcGFyZW5cbiAgY2xhdXNlcywgb3IgKCh0ZXN0LWNvbnN0YW50MSAuLi4gdGVzdC1jb25zdGFudE4pIGJvZHkqKSB0byBncm91cFxuICBzZXZlcmFsIGNvbnN0YW50cyB1bmRlciBvbmUgYm9keS4gVGhlIGJhcmUgc3ltYm9sIGBlbHNlYCBpcyB0aGVcbiAgY2F0Y2gtYWxsIGNsYXVzZS4gVGVzdC1jb25zdGFudHMgYXJlIG5vdCBldmFsdWF0ZWQgLS0gdGhleSBtdXN0IGJlXG4gIGNvbXBpbGUtdGltZSBsaXRlcmFscyBhbmQgbmVlZCBub3QgYmUgcXVvdGVkLiBJZiBubyBjbGF1c2UgbWF0Y2hlc1xuICBhbmQgbm8gYGVsc2VgIGNsYXVzZSB3YXMgZ2l2ZW4sIGFuIEVycm9yIGlzIHRocm93bi5cblxuICBVbmxpa2UgY29uZC9jb25kcCwgY2FzZSdzIGRpc3BhdGNoIGlzIG5vdCBldmFsdWF0ZWQgc2VxdWVudGlhbGx5IGF0XG4gIHJ1bnRpbWUgaGVyZSAoaXQncyBzdGlsbCBsb3dlcmVkIHRvIGEgYGNvbmRgIGNoYWluIGZvciBub3cgLS0gYVxuICBjb25zdGFudC10aW1lIGRpc3BhdGNoIGlzIGFuIG9wdGltaXNhdGlvbiwgbm90IGEgc2VtYW50aWNcbiAgcmVxdWlyZW1lbnQgb2YgdGhlIHNwZWMpLlxuXG4gIERlcGVuZHMgb24gPVwiXG4gIChsZXQqICgoc3ltIChpZiAoc3ltYm9sPyBlKSBlIChnZW5zeW0gOmNhc2UtYmluZGluZykpKVxuICAgICAgICAoZXEqIChsYW1iZGEgKGMpIGAoPSAsc3ltICcsYykpKSlcbiAgICAobG9vcCAoKHBhaXJzIGNsYXVzZXMpIChjb25kcyBbXSkpXG4gICAgICAoaWYgKGVtcHR5PyBwYWlycylcbiAgICAgICAgKGxldCogKChjb25kcyAoaWYgKHNvbWUgKGxhbWJkYSAoJSkgKD0gKGZpcnN0ICUpICdlbHNlKSkgY29uZHMpXG4gICAgICAgICAgICAgICAgICAgICAgY29uZHNcbiAgICAgICAgICAgICAgICAgICAgICAoY29uaiBjb25kcyAobGlzdCAnZWxzZSBgKHRocm93IChFcnJvciAoc3RyIFwiTm8gbWF0Y2hpbmcgY2xhdXNlOiBcIiAsc3ltKSkpKSkpKVxuICAgICAgICAgICAgICAocmVzdWx0IChjb25zICdjb25kIGNvbmRzKSkpXG4gICAgICAgICAgKGlmICg9IGUgc3ltKSByZXN1bHQgYChsZXQqICgoLHN5bSAsZSkpICxyZXN1bHQpKSlcbiAgICAgICAgKGxldCogKCh4IChmaXJzdCBwYWlycykpICh4cyAocmVzdCBwYWlycykpIChjb25zdHMgKGZpcnN0IHgpKSAoYm9keSAocmVzdCB4KSkpXG4gICAgICAgICAgKHJlY3VyIHhzIChjb25qIGNvbmRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgIChpZiAoPSBjb25zdHMgJ2Vsc2UpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGNvbnMgJ2Vsc2UgYm9keSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoY29ucyAoaWYtbm90IChsaXN0PyBjb25zdHMpIChlcSogY29uc3RzKSBgKG9yICxAKG1hcCBlcSogY29uc3RzKSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9keSkpKSkpKSkpKVxuKGluc3RhbGwtbWFjcm8hIDpjYXNlIGV4cGFuZC1jYXNlKVxuXG4oZGVmdW4gZXhwYW5kLWNvbmRwXG4gIChwcmVkIGV4cHIgJnJlc3QgY2xhdXNlcylcbiAgXCJUYWtlcyBhIGJpbmFyeSBwcmVkaWNhdGUsIGFuIGV4cHJlc3Npb24sIGFuZCBhIHNldCBvZiBjbGF1c2VzLlxuICBFYWNoIGNsYXVzZSBjYW4gdGFrZSB0aGUgZm9ybSBvZiBlaXRoZXI6XG5cbiAgdGVzdC1leHByIHJlc3VsdC1leHByXG4gIHRlc3QtZXhwciA6Pj4gcmVzdWx0LWZuXG5cbiAgTm90ZSA6Pj4gaXMgYW4gb3JkaW5hcnkga2V5d29yZC5cblxuICBGb3IgZWFjaCBjbGF1c2UsIChwcmVkIHRlc3QtZXhwciBleHByKSBpcyBldmFsdWF0ZWQuIElmIGl0IHJldHVybnNcbiAgbG9naWNhbCB0cnVlLCB0aGUgY2xhdXNlIGlzIGEgbWF0Y2guIElmIGEgYmluYXJ5IGNsYXVzZSBtYXRjaGVzLCB0aGVcbiAgcmVzdWx0LWV4cHIgaXMgcmV0dXJuZWQsIGlmIGEgdGVybmFyeSBjbGF1c2UgbWF0Y2hlcywgaXRzIHJlc3VsdC1mbixcbiAgd2hpY2ggbXVzdCBiZSBhIHVuYXJ5IGZ1bmN0aW9uLCBpcyBjYWxsZWQgd2l0aCB0aGUgcmVzdWx0IG9mIHRoZVxuICBwcmVkaWNhdGUgYXMgaXRzIGFyZ3VtZW50LCB0aGUgcmVzdWx0IG9mIHRoYXQgY2FsbCBiZWluZyB0aGUgcmV0dXJuXG4gIHZhbHVlIG9mIGNvbmRwLiBBIHNpbmdsZSBkZWZhdWx0IGV4cHJlc3Npb24gY2FuIGZvbGxvdyB0aGUgY2xhdXNlcyxcbiAgYW5kIGl0cyB2YWx1ZSB3aWxsIGJlIHJldHVybmVkIGlmIG5vIGNsYXVzZSBtYXRjaGVzLiBJZiBubyBkZWZhdWx0XG4gIGV4cHJlc3Npb24gaXMgcHJvdmlkZWQgYW5kIG5vIGNsYXVzZSBtYXRjaGVzLCBhbiBFcnJvciBpcyB0aHJvd24uXCJcbiAgKGxldCogKChzeW0qICAgIChnZW5zeW0gOmNvbmRwLWJpbmRpbmcpKVxuICAgICAgICAoc3ltICAgICAoaWYgKHN5bWJvbD8gZXhwcikgZXhwciBzeW0qKSlcbiAgICAgICAgKGNvbXBhcmUgKGxhbWJkYSAoeCkgYCgscHJlZCAseCAsc3ltKSkpXG4gICAgICAgIChzcGxpdHMgIChsYW1iZGEgc3BsaXRzICh4cylcbiAgICAgICAgICAgICAgICAgIChjb25kICgoZW1wdHk/IHhzKSAgICAgICAgICBgKHRocm93IChFcnJvciAoc3RyIFwiTm8gbWF0Y2hpbmcgY2xhdXNlOiBcIiAsc3ltKSkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgKCg9IDEgKGNvdW50IHhzKSkgICAgIChmaXJzdCB4cykpXG4gICAgICAgICAgICAgICAgICAgICAgICAoKD0gJzo+PiAoc2Vjb25kIHhzKSkgYChpZi1sZXQgWyxzeW0qICwoY29tcGFyZSAoZmlyc3QgeHMpKV1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgsKHRoaXJkIHhzKSAsc3ltKilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICwoc3BsaXRzIChkcm9wIDMgeHMpKSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAoZWxzZSAgICAgICAgICAgICAgICBgKGlmICwoY29tcGFyZSAoZmlyc3QgeHMpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLChzZWNvbmQgeHMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAsKHNwbGl0cyAoZHJvcCAyIHhzKSkpKSkpKSlcbiAgICAoaWYgKD0gc3ltIGV4cHIpXG4gICAgICAoc3BsaXRzIGNsYXVzZXMpXG4gICAgICBgKGxldCoqIFssc3ltICxleHByXSAsKHNwbGl0cyBjbGF1c2VzKSkpKSlcbihpbnN0YWxsLW1hY3JvISA6Y29uZHAgZXhwYW5kLWNvbmRwKVxuXG5cbihkZWZ1bi0gKnRocmVhZCAoaW5zZXJ0IHN5bSB0ZXN0IGZvcm0pXG4gIChsZXQqICgoZm9ybSAoaWYgKGxpc3Q/IGZvcm0pIGZvcm0gKGxpc3QgZm9ybSkpKSlcbiAgICBgKGlmICx0ZXN0XG4gICAgICAgLHN5bVxuICAgICAgICwoaW5zZXJ0IHN5bSBmb3JtKSkpKVxuXG4oZGVmdW4tICpjb25kLXRocmVhZCAoZXhwciBjbGF1c2VzIGluc2VydClcbiAgKGxldCogKChzeW0gKGdlbnN5bSA6Y29uZC10aHJlYWQtYmluZGluZykpKVxuICAgIGAoYXMtPiAsZXhwciAsc3ltXG4gICAgICAgICAgICxAKG1hcCAobGFtYmRhICglKSAoKnRocmVhZCBpbnNlcnQgc3ltIGAobm90ICwoZmlyc3QgJSkpIChzZWNvbmQgJSkpKVxuICAgICAgICAgICAgICAgICAgKHBhcnRpdGlvbiAyIGNsYXVzZXMpKSkpKVxuXG4oZGVmdW4gZXhwYW5kLWNvbmQtdGhyZWFkLWZpcnN0XG4gIChleHByICZyZXN0IGNsYXVzZXMpXG4gIFwiVGFrZXMgYW4gZXhwcmVzc2lvbiBhbmQgYSBzZXQgb2YgdGVzdC9mb3JtIHBhaXJzLiBUaHJlYWRzIGV4cHIgKHZpYSAtPilcbiAgdGhyb3VnaCBlYWNoIGZvcm0gZm9yIHdoaWNoIHRoZSBjb3JyZXNwb25kaW5nIHRlc3RcbiAgZXhwcmVzc2lvbiBpcyB0cnVlLiBOb3RlIHRoYXQsIHVubGlrZSBjb25kIGJyYW5jaGluZywgY29uZC0+IHRocmVhZGluZyBkb2VzXG4gIG5vdCBzaG9ydCBjaXJjdWl0IGFmdGVyIHRoZSBmaXJzdCB0cnVlIHRlc3QgZXhwcmVzc2lvbi5cIlxuICAoKmNvbmQtdGhyZWFkIGV4cHIgY2xhdXNlcyAobGFtYmRhIChzeW0gZm9ybSkgKGFwcGx5IGxpc3QgKGZpcnN0IGZvcm0pIHN5bSAodmVjIChyZXN0IGZvcm0pKSkpKSlcbihpbnN0YWxsLW1hY3JvISA6Y29uZC0+IGV4cGFuZC1jb25kLXRocmVhZC1maXJzdClcblxuKGRlZnVuIGV4cGFuZC1jb25kLXRocmVhZC1sYXN0XG4gIChleHByICZyZXN0IGNsYXVzZXMpXG4gIFwiVGFrZXMgYW4gZXhwcmVzc2lvbiBhbmQgYSBzZXQgb2YgdGVzdC9mb3JtIHBhaXJzLiBUaHJlYWRzIGV4cHIgKHZpYSAtPj4pXG4gIHRocm91Z2ggZWFjaCBmb3JtIGZvciB3aGljaCB0aGUgY29ycmVzcG9uZGluZyB0ZXN0IGV4cHJlc3Npb25cbiAgaXMgdHJ1ZS4gIE5vdGUgdGhhdCwgdW5saWtlIGNvbmQgYnJhbmNoaW5nLCBjb25kLT4+IHRocmVhZGluZyBkb2VzIG5vdCBzaG9ydCBjaXJjdWl0XG4gIGFmdGVyIHRoZSBmaXJzdCB0cnVlIHRlc3QgZXhwcmVzc2lvbi5cIlxuICAoKmNvbmQtdGhyZWFkIGV4cHIgY2xhdXNlcyAobGFtYmRhIChzeW0gZm9ybSkgKGFwcGx5IGxpc3QgKHZlYyAoY29uY2F0IGZvcm0gW3N5bV0pKSkpKSlcbihpbnN0YWxsLW1hY3JvISA6Y29uZC0+PiBleHBhbmQtY29uZC10aHJlYWQtbGFzdClcblxuXG4oZGVmdW4tICpzb21lLXRocmVhZCAoZXhwciBmb3JtcyBpbnNlcnQpXG4gIChsZXQqICgoc3ltIChnZW5zeW0gOnNvbWUtdGhyZWFkLWJpbmRpbmcpKSlcbiAgICBgKGFzLT4gLGV4cHIgLHN5bVxuICAgICAgICAgICAsQChtYXAgKGxhbWJkYSAoJSkgKCp0aHJlYWQgaW5zZXJ0IHN5bSBgKG5pbD8gLHN5bSkgJSkpXG4gICAgICAgICAgICAgICAgICBmb3JtcykpKSlcblxuKGRlZnVuIGV4cGFuZC1zb21lLXRocmVhZC1maXJzdFxuICAoZXhwciAmcmVzdCBmb3JtcylcbiAgXCJXaGVuIGV4cHIgaXMgbm90IG5pbCwgdGhyZWFkcyBpdCBpbnRvIHRoZSBmaXJzdCBmb3JtICh2aWEgLT4pLFxuICBhbmQgd2hlbiB0aGF0IHJlc3VsdCBpcyBub3QgbmlsLCB0aHJvdWdoIHRoZSBuZXh0IGV0Y1xuXG4gIERlcGVuZHMgb24gbmlsP1wiXG4gICgqc29tZS10aHJlYWQgZXhwciBmb3JtcyAobGFtYmRhIChzeW0gZm9ybSkgKGFwcGx5IGxpc3QgKGZpcnN0IGZvcm0pIHN5bSAodmVjIChyZXN0IGZvcm0pKSkpKSlcbihpbnN0YWxsLW1hY3JvISA6c29tZS0+IGV4cGFuZC1zb21lLXRocmVhZC1maXJzdClcblxuKGRlZnVuIGV4cGFuZC1zb21lLXRocmVhZC1sYXN0XG4gIChleHByICZyZXN0IGZvcm1zKVxuICBcIldoZW4gZXhwciBpcyBub3QgbmlsLCB0aHJlYWRzIGl0IGludG8gdGhlIGZpcnN0IGZvcm0gKHZpYSAtPj4pLFxuICBhbmQgd2hlbiB0aGF0IHJlc3VsdCBpcyBub3QgbmlsLCB0aHJvdWdoIHRoZSBuZXh0IGV0Y1xuXG4gIERlcGVuZHMgb24gbmlsP1wiXG4gICgqc29tZS10aHJlYWQgZXhwciBmb3JtcyAobGFtYmRhIChzeW0gZm9ybSkgKGFwcGx5IGxpc3QgKHZlYyAoY29uY2F0IGZvcm0gW3N5bV0pKSkpKSlcbihpbnN0YWxsLW1hY3JvISA6c29tZS0+PiBleHBhbmQtc29tZS10aHJlYWQtbGFzdClcblxuXG4oZGVmdW4tIGJ1aWxkLWRlZnVuXG4gIChwcml2YXRlIGZuLW9wICZmb3JtIG5hbWUgcGFyYW1zIGRvYytib2R5KVxuICBcIlNoYXJlZCBpbXBsZW1lbnRhdGlvbiBvZiBgZGVmdW5gL2BkZWZ1bi1gL2BkZWZ1bi1hc3luY2AvXG5gZGVmdW4tYXN5bmMtYDogKGRlZnZhciBpZCAoRk4tT1AgaWQgcGFyYW1zKiBib2R5KikpLCBmb2xkaW5nIGFuXG5vcHRpb25hbCBkb2Mtc3RyaW5nIGludG8gdGhlIGlkJ3MgbWV0YWRhdGEgc28gaXQgbmV2ZXIgcmVhY2hlcyB0aGVcbmVtaXR0ZWQgYm9keSBhcyBhIGRlYWQgZXhwcmVzc2lvbiBzdGF0ZW1lbnQuIGBwcml2YXRlYCBwaWNrcyBgZGVmdmFyYFxudnMgYGRlZnZhci1gIC0tIG5ldy1zeW50YXggaGFzIG5vIGBeOnByaXZhdGVgIHJlYWRlciBtZXRhZGF0YSwgc29cbnByaXZhY3kgaXMgbm93IHNpZ25hbGxlZCBwdXJlbHkgYnkgd2hpY2ggbWFjcm8gbmFtZSB3YXMgdXNlZC5cblxuVW5saWtlIENsb2p1cmUtd2lzcCdzIGBkZWZuYCAobmFtZSBkb2M/IGF0dHItbWFwPyBbcGFyYW1zXSBib2R5KiksXG5uZXctc3ludGF4IHB1dHMgdGhlIHBhcmFtIGxpc3QgcmlnaHQgYWZ0ZXIgdGhlIG5hbWUgKEVtYWNzIExpc3Bcbm9yZGVyKTogKGRlZnVuIG5hbWUgKHBhcmFtcyopIGRvYz8gYm9keSopIC0tIHNvIHRoZSBkb2NzdHJpbmcsIHdoZW5cbnByZXNlbnQsIGlzIHRoZSBmaXJzdCBlbGVtZW50IG9mIGJvZHksIG5vdCB0aGUgbGFzdCBlbGVtZW50IGJlZm9yZVxuaXQuXCJcbiAgKGxldCogKChkb2MgKGlmIChhbmQgKHN0cmluZz8gKGZpcnN0IGRvYytib2R5KSkgKG5vdCAoZW1wdHk/IChyZXN0IGRvYytib2R5KSkpKVxuICAgICAgICAgICAgICAoZmlyc3QgZG9jK2JvZHkpKSlcblxuICAgICAgICA7OyBJZiBkb2NzdHJpbmcgaXMgZm91bmQgaXQncyBub3QgcGFydCBvZiBib2R5LlxuICAgICAgICAoYm9keSAoaWYgZG9jIChyZXN0IGRvYytib2R5KSBkb2MrYm9keSkpXG5cbiAgICAgICAgOzsgQ29tYmluZSB0aGUgZG9jIG1ldGFkYXRhIGFuZCBhZGQgdG8gYSBuYW1lLlxuICAgICAgICAoaWQgKHdpdGgtbWV0YSBuYW1lIChjb25qIChvciAobWV0YSBuYW1lKSB7fSkgezpkb2MgZG9jfSkpKVxuXG4gICAgICAgIChmbiAod2l0aC1tZXRhIGAoLGZuLW9wICxpZCAscGFyYW1zICxAYm9keSkgKG1ldGEgJmZvcm0pKSlcbiAgICAgICAgKGRlZi1vcCAoaWYgcHJpdmF0ZSAnZGVmdmFyLSAnZGVmdmFyKSkpXG4gICAgKGxpc3QgZGVmLW9wIGlkIGZuKSkpXG5cbihkZWZ1biBleHBhbmQtZGVmdW5cbiAgKCZmb3JtIG5hbWUgcGFyYW1zICZyZXN0IGRvYytib2R5KVxuICBcIihkZWZ1biBuYW1lIChwYXJhbXMqKSBkb2M/IGV4cHJzKikgPT4gKGRlZnZhciBuYW1lIChsYW1iZGEgbmFtZSBwYXJhbXMqIGV4cHJzKikpXCJcbiAgKGJ1aWxkLWRlZnVuIGZhbHNlICdsYW1iZGEgJmZvcm0gbmFtZSBwYXJhbXMgZG9jK2JvZHkpKVxuKGluc3RhbGwtbWFjcm8hIDpkZWZ1biAod2l0aC1tZXRhIGV4cGFuZC1kZWZ1biB7OmltcGxpY2l0IFs6JmZvcm1dfSkpXG5cbihkZWZ1biBleHBhbmQtZGVmdW4tXG4gICgmZm9ybSBuYW1lIHBhcmFtcyAmcmVzdCBkb2MrYm9keSlcbiAgXCJTYW1lIGFzIGBkZWZ1bmAgYnV0IG5vdCBleHBvcnRlZCAoc2VlIGBidWlsZC1kZWZ1bmApLlwiXG4gIChidWlsZC1kZWZ1biB0cnVlICdsYW1iZGEgJmZvcm0gbmFtZSBwYXJhbXMgZG9jK2JvZHkpKVxuKGluc3RhbGwtbWFjcm8hIDpkZWZ1bi0gKHdpdGgtbWV0YSBleHBhbmQtZGVmdW4tIHs6aW1wbGljaXQgWzomZm9ybV19KSlcblxuKGRlZnVuIGV4cGFuZC1kZWZjb25zdFxuICAobmFtZSB2YWx1ZSlcbiAgXCIoZGVmY29uc3QgbmFtZSB2YWx1ZSkgLS0gbWF5IGZvbGQgaW50byBgZGVmdmFyLWAvYGRlZnZhcmAgbGF0ZXI7IGZvclxuICBub3cgYSB0aGluIGFsaWFzIHdpdGggbm8gcmVhc3NpZ25tZW50LXByZXZlbnRpb24gc2VtYW50aWNzLlwiXG4gIGAoZGVmdmFyICxuYW1lICx2YWx1ZSkpXG4oaW5zdGFsbC1tYWNybyEgOmRlZmNvbnN0IGV4cGFuZC1kZWZjb25zdClcblxuKGRlZnVuIGV4cGFuZC1kZWZjb25zdC1cbiAgKG5hbWUgdmFsdWUpXG4gIGAoZGVmdmFyLSAsbmFtZSAsdmFsdWUpKVxuKGluc3RhbGwtbWFjcm8hIDpkZWZjb25zdC0gZXhwYW5kLWRlZmNvbnN0LSlcblxuKGRlZnVuIGV4cGFuZC1zZXRxXG4gIChwbGFjZSB2YWx1ZSlcbiAgXCIoc2V0cSBwbGFjZSB2YWx1ZSkgLS0gcmViaW5kIGEgYmluZGluZy4gYHNldCFgIGFscmVhZHkgaGFuZGxlcyBib3RoXG4gIHN5bWJvbCBhbmQgcGxhY2UgKGxpc3QpIHRhcmdldHMsIHNvIGBzZXRxYC9gc2V0ZmAgYXJlIGJvdGggcGxhaW5cbiAgYWxpYXNlcyBmb3IgaXQuXCJcbiAgYChzZXQhICxwbGFjZSAsdmFsdWUpKVxuKGluc3RhbGwtbWFjcm8hIDpzZXRxIGV4cGFuZC1zZXRxKVxuXG4oZGVmdW4gZXhwYW5kLXNldGZcbiAgKHBsYWNlIHZhbHVlKVxuICBcIihzZXRmIHBsYWNlIHZhbHVlKSAtLSBhc3NpZ24gYSBwbGFjZTogKHNldGYgKC4teCBvKSAxKSwgKHNldGYgKGFyZWYgYSBpKSB2KS5cIlxuICBgKHNldCEgLHBsYWNlICx2YWx1ZSkpXG4oaW5zdGFsbC1tYWNybyEgOnNldGYgZXhwYW5kLXNldGYpXG5cblxuKGRlZnVuIGV4cGFuZC1sYW1iZGEtYXN5bmNcbiAgKCZyZXN0IGFyZ3MpXG4gIFwiKGxhbWJkYS1hc3luYyAocGFyYW1zKikgZXhwcnMqKVxuICAgKGxhbWJkYS1hc3luYyBuYW1lIChwYXJhbXMqKSBleHBycyopXG5cbiAgQXN5bmMgYW5vbnltb3VzIGZ1bmN0aW9uOiAoYXN5bmMgKGxhbWJkYSAuLi4pKS4gVGhlIG5hbWUsIHdoZW5cbiAgZ2l2ZW4sIGlzIG9ubHkgZm9yIHNlbGYtcmVjdXJzaW9uOyBgYXdhaXRgIGlzIHZhbGlkIGluIHRoZSBib2R5LlxuICBGb3IgYW4gYXN5bmMgQVJST1csIGNvbXBvc2UgdGhlIHNwZWNpYWwgZm9ybSBkaXJlY3RseTpcbiAgKGFzeW5jIChsYW1iZGEqIChwYXJhbXMqKSAuLi4pKS5cIlxuICAoaWYgKHN5bWJvbD8gKGZpcnN0IGFyZ3MpKVxuICAgIGAoYXN5bmMgKGxhbWJkYSAsKGZpcnN0IGFyZ3MpICxAKHJlc3QgYXJncykpKVxuICAgIGAoYXN5bmMgKGxhbWJkYSAsQGFyZ3MpKSkpXG4oaW5zdGFsbC1tYWNybyEgOmxhbWJkYS1hc3luYyBleHBhbmQtbGFtYmRhLWFzeW5jKVxuXG4oZGVmdW4gZXhwYW5kLWRlZnVuLWFzeW5jXG4gICgmZm9ybSBuYW1lIHBhcmFtcyAmcmVzdCBkb2MrYm9keSlcbiAgXCIoZGVmdW4tYXN5bmMgbmFtZSAocGFyYW1zKikgZG9jPyBleHBycyopIC0tIGFzeW5jIGBkZWZ1bmA7XG4gIGBhd2FpdGAgaXMgdmFsaWQgaW4gdGhlIGJvZHkuXCJcbiAgKGJ1aWxkLWRlZnVuIGZhbHNlICdsYW1iZGEtYXN5bmMgJmZvcm0gbmFtZSBwYXJhbXMgZG9jK2JvZHkpKVxuKGluc3RhbGwtbWFjcm8hIDpkZWZ1bi1hc3luYyAod2l0aC1tZXRhIGV4cGFuZC1kZWZ1bi1hc3luYyB7OmltcGxpY2l0IFs6JmZvcm1dfSkpXG5cbihkZWZ1biBleHBhbmQtZGVmdW4tYXN5bmMtXG4gICgmZm9ybSBuYW1lIHBhcmFtcyAmcmVzdCBkb2MrYm9keSlcbiAgXCJTYW1lIGFzIGBkZWZ1bi1hc3luY2AgYnV0IG5vdCBleHBvcnRlZCAoc2VlIGBidWlsZC1kZWZ1bmApLlwiXG4gIChidWlsZC1kZWZ1biB0cnVlICdsYW1iZGEtYXN5bmMgJmZvcm0gbmFtZSBwYXJhbXMgZG9jK2JvZHkpKVxuKGluc3RhbGwtbWFjcm8hIDpkZWZ1bi1hc3luYy0gKHdpdGgtbWV0YSBleHBhbmQtZGVmdW4tYXN5bmMtIHs6aW1wbGljaXQgWzomZm9ybV19KSlcblxuXG4oZGVmdW4gZXhwYW5kLWxhenktc2VxXG4gICgmcmVzdCBib2R5KVxuICBcIlRha2VzIGEgYm9keSBvZiBleHByZXNzaW9ucyB0aGF0IHJldHVybnMgYW4gSVNlcSBvciBuaWwsIGFuZCB5aWVsZHNcbiAgYSBTZXFhYmxlIG9iamVjdCB0aGF0IHdpbGwgaW52b2tlIHRoZSBib2R5IG9ubHkgdGhlIGZpcnN0IHRpbWUgc2VxXG4gIGlzIGNhbGxlZCwgYW5kIHdpbGwgY2FjaGUgdGhlIHJlc3VsdCBhbmQgcmV0dXJuIGl0IG9uIGFsbCBzdWJzZXF1ZW50XG4gIHNlcSBjYWxscy4gU2VlIGFsc28gLSByZWFsaXplZD9cblxuICBEZXBlbmRzIG9uIGxhenktc2VxXCJcbiAgYCguY2FsbCBsYXp5LXNlcSBuaWwgZmFsc2UgKGxhbWJkYSAoKSAsQGJvZHkpKSlcbihpbnN0YWxsLW1hY3JvIDpsYXp5LXNlcSBleHBhbmQtbGF6eS1zZXEpXG5cblxuKGRlZnVuIGV4cGFuZC13aGVuXG4gICh0ZXN0ICZyZXN0IGJvZHkpXG4gIFwiRXZhbHVhdGVzIHRlc3QuIElmIGxvZ2ljYWwgdHJ1ZSwgZXZhbHVhdGVzIGJvZHkgaW4gYW4gaW1wbGljaXQgcHJvZ24uXCJcbiAgYChpZiAsdGVzdCAocHJvZ24gLEBib2R5KSkpXG4oaW5zdGFsbC1tYWNybyA6d2hlbiBleHBhbmQtd2hlbilcblxuKGRlZnVuIGV4cGFuZC11bmxlc3NcbiAgKHRlc3QgJnJlc3QgYm9keSlcbiAgXCJFdmFsdWF0ZXMgdGVzdC4gSWYgbG9naWNhbCBmYWxzZSwgZXZhbHVhdGVzIGJvZHkgaW4gYW4gaW1wbGljaXQgcHJvZ24uXCJcbiAgYCh3aGVuIChub3QgLHRlc3QpICxAYm9keSkpXG4oaW5zdGFsbC1tYWNybyA6dW5sZXNzIGV4cGFuZC11bmxlc3MpXG5cblxuKGRlZnVuIGV4cGFuZC1pZi1sZXRcbiAgKGJpbmRpbmdzIHRoZW4gZWxzZSopXG4gIFwiYmluZGluZ3MgPT4gYmluZGluZy1mb3JtIHRlc3RcbiAgYm9keSA9PiBbdGhlbiBlbHNlXVxuICBJZiB0ZXN0IGlzIHRydWUsIGV2YWx1YXRlcyB0aGVuIHdpdGggYmluZGluZy1mb3JtIGJvdW5kIHRvIHRoZSB2YWx1ZSBvZlxuICB0ZXN0LCBpZiBub3QsIHlpZWxkcyBlbHNlKi5cIlxuICAobGV0KiAoKG5hbWUgKGZpcnN0IGJpbmRpbmdzKSkgKHRlc3QgKHNlY29uZCBiaW5kaW5ncykpIChzeW0gKGdlbnN5bSA6aWYtbGV0LWJpbmRpbmcpKSlcbiAgICBgKGxldCoqIFssc3ltICx0ZXN0XVxuICAgICAgIChpZiAsc3ltIChsZXQqKiAsKGRlc3RydWN0dXJlIFtuYW1lIHN5bV0pICx0aGVuKSAsZWxzZSopKSkpXG4oaW5zdGFsbC1tYWNybyA6aWYtbGV0IGV4cGFuZC1pZi1sZXQpXG5cbihkZWZ1biBleHBhbmQtd2hlbi1sZXRcbiAgKGJpbmRpbmdzICZyZXN0IGJvZHkpXG4gIFwiYmluZGluZ3MgPT4gYmluZGluZy1mb3JtIHRlc3RcbiAgV2hlbiB0ZXN0IGlzIHRydWUsIGV2YWx1YXRlcyBib2R5IHdpdGggYmluZGluZy1mb3JtIGJvdW5kIHRvIHRoZSB2YWx1ZSBvZiB0ZXN0LlwiXG4gIGAoaWYtbGV0ICxiaW5kaW5ncyAocHJvZ24gLEBib2R5KSkpXG4oaW5zdGFsbC1tYWNybyA6d2hlbi1sZXQgZXhwYW5kLXdoZW4tbGV0KVxuXG5cbihkZWZ1biBleHBhbmQtaWYtc29tZVxuICAoYmluZGluZ3MgdGhlbiBlbHNlKilcbiAgXCJiaW5kaW5ncyA9PiBiaW5kaW5nLWZvcm0gdGVzdFxuICBJZiB0ZXN0IGlzIG5vdCBuaWwsIGV2YWx1YXRlcyB0aGVuIHdpdGggYmluZGluZy1mb3JtIGJvdW5kIHRvIHRoZVxuICB2YWx1ZSBvZiB0ZXN0LCBpZiBub3QsIHlpZWxkcyBlbHNlKi5cblxuICBEZXBlbmRzIG9uIG5pbD9cIlxuICAobGV0KiAoKG5hbWUgKGZpcnN0IGJpbmRpbmdzKSkgKHRlc3QgKHNlY29uZCBiaW5kaW5ncykpIChzeW0gKGlmIChzeW1ib2w/IG5hbWUpIG5hbWUgKGdlbnN5bSA6aWYtc29tZS1iaW5kaW5nKSkpKVxuICAgIGAobGV0KiogWyxzeW0gLHRlc3RdXG4gICAgICAgKGlmLW5vdCAobmlsPyAsc3ltKVxuICAgICAgICAgKGxldCoqICwoZGVzdHJ1Y3R1cmUgW25hbWUgc3ltXSkgLHRoZW4pXG4gICAgICAgICAsZWxzZSopKSkpXG4oaW5zdGFsbC1tYWNybyA6aWYtc29tZSBleHBhbmQtaWYtc29tZSlcblxuKGRlZnVuIGV4cGFuZC13aGVuLXNvbWVcbiAgKGJpbmRpbmdzICZyZXN0IGJvZHkpXG4gIFwiYmluZGluZ3MgPT4gYmluZGluZy1mb3JtIHRlc3RcbiAgV2hlbiB0ZXN0IGlzIG5vdCBuaWwsIGV2YWx1YXRlcyBib2R5IHdpdGggYmluZGluZy1mb3JtIGJvdW5kIHRvIHRoZVxuICB2YWx1ZSBvZiB0ZXN0LlwiXG4gIGAoaWYtc29tZSAsYmluZGluZ3MgKHByb2duICxAYm9keSkpKVxuKGluc3RhbGwtbWFjcm8gOndoZW4tc29tZSBleHBhbmQtd2hlbi1zb21lKVxuXG5cbihkZWZ1biBleHBhbmQtd2hlbi1maXJzdFxuICAoYmluZGluZ3MgJnJlc3QgYm9keSlcbiAgXCJiaW5kaW5ncyA9PiB4IHhzXG4gIFJvdWdobHkgdGhlIHNhbWUgYXMgKHdoZW4gKHNlcSB4cykgKGxldCBbeCAoZmlyc3QgeHMpXSBib2R5KSkgYnV0IHhzIGlzIGV2YWx1YXRlZCBvbmx5IG9uY2VcblxuICBEZXBlbmRzIG9uIHNlcSpcIlxuICAobGV0KiAoKG5hbWUgKGZpcnN0IGJpbmRpbmdzKSkgKHRlc3QgKHNlY29uZCBiaW5kaW5ncykpKVxuICAgIGAod2hlbi1sZXQgKFssbmFtZV0gKHNlcSogLHRlc3QpKSAsQGJvZHkpKSlcbihpbnN0YWxsLW1hY3JvIDp3aGVuLWZpcnN0IGV4cGFuZC13aGVuLWZpcnN0KVxuXG5cbihkZWZ1biBleHBhbmQtd2hpbGVcbiAgKHRlc3QgJnJlc3QgYm9keSlcbiAgXCJSZXBlYXRlZGx5IGV4ZWN1dGVzIGJvZHkgd2hpbGUgdGVzdCBleHByZXNzaW9uIGlzIHRydWUuIFByZXN1bWVzXG4gIHNvbWUgc2lkZS1lZmZlY3Qgd2lsbCBjYXVzZSB0ZXN0IHRvIGJlY29tZSBmYWxzZS9uaWwuIFJldHVybnMgbmlsXCJcbiAgYChsb29wICgpXG4gICAgICh3aGVuICx0ZXN0ICxAYm9keSAocmVjdXIpKSkpXG4oaW5zdGFsbC1tYWNybyA6d2hpbGUgZXhwYW5kLXdoaWxlKVxuXG5cbihkZWZ1biBleHBhbmQtZG90b1xuICAoeCAmcmVzdCBmb3JtcylcbiAgXCJFdmFsdWF0ZXMgeCB0aGVuIGNhbGxzIGFsbCBvZiB0aGUgbWV0aG9kcyBhbmQgZnVuY3Rpb25zIHdpdGggdGhlXG4gIHZhbHVlIG9mIHggc3VwcGxpZWQgYXQgdGhlIGZyb250IG9mIHRoZSBnaXZlbiBhcmd1bWVudHMuICBUaGUgZm9ybXNcbiAgYXJlIGV2YWx1YXRlZCBpbiBvcmRlci4gIFJldHVybnMgeC5cbiAgKGRvdG8gKE1hcC4pICguc2V0IDphIDEpICguc2V0IDpiIDIpKVwiXG4gIChsZXQqICgoc3ltIChnZW5zeW0gOmRvdG8tYmluZGluZykpKVxuICAgIGAobGV0KiogWyxzeW0gLHhdXG4gICAgICAgLEAobWFwIChsYW1iZGEgKCUpIChjb25jYXQgWyhmaXJzdCAlKSBzeW1dIChyZXN0ICUpKSkgZm9ybXMpXG4gICAgICAgLHN5bSkpKVxuKGluc3RhbGwtbWFjcm8gOmRvdG8gZXhwYW5kLWRvdG8pXG5cbihkZWZ1biBleHBhbmQtZG90aW1lc1xuICAoYmluZGluZ3MgJnJlc3QgYm9keSlcbiAgXCJiaW5kaW5ncyA9PiBuYW1lIG5cbiAgUmVwZWF0ZWRseSBleGVjdXRlcyBib2R5IChwcmVzdW1hYmx5IGZvciBzaWRlLWVmZmVjdHMpIHdpdGggbmFtZVxuICBib3VuZCB0byBpbnRlZ2VycyBmcm9tIDAgdGhyb3VnaCBuLTEuXCJcbiAgKGxldCogKChuYW1lIChmaXJzdCBiaW5kaW5ncykpIChuIChzZWNvbmQgYmluZGluZ3MpKSAoc3ltIChnZW5zeW0gOmRvdGltZXMtYmluZGluZykpKVxuICAgIGAobGV0KiogWyxzeW0gLG5dXG4gICAgICAgKGxvb3AgKCgsbmFtZSAwKSlcbiAgICAgICAgICh3aGVuICg8ICxuYW1lICxzeW0pXG4gICAgICAgICAgICxAYm9keVxuICAgICAgICAgICAocmVjdXIgKGluYyAsbmFtZSkpKSkpKSlcbihpbnN0YWxsLW1hY3JvIDpkb3RpbWVzIGV4cGFuZC1kb3RpbWVzKVxuXG5cbihkZWZ1bi0gZm9yLXN0ZXAgKGNvbnRleHQgbG9vcCAmcmVzdCBtb2RpZmllcnMpXG4gIChsZXQqICgoaXRlciAgKDppdGVyIGNvbnRleHQpKSAoY29sbCAoOmNvbGwgY29udGV4dCkpIChib2R5ICg6Ym9keSBjb250ZXh0KSkgKHN1YnNlcSAoOnN1YnNlcSBjb250ZXh0KSlcbiAgICAgICAgKGJvZHkqIChpZi1ub3Qgc3Vic2VxIGJvZHkgYChsZXQqKiBbLHN1YnNlcSAsYm9keV1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoaWYgKGVtcHR5PyAsc3Vic2VxKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHJlY3VyIChyZXN0ICxjb2xsKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChsYXp5LWNvbmNhdCAsc3Vic2VxICgsaXRlciAocmVzdCAsY29sbCkpKSkpKSlcbiAgICAgICAgKG5leHQgIChsb29wICgobW9kcyAocmV2ZXJzZSBtb2RpZmllcnMpKSAoYm9keSBib2R5KikpXG4gICAgICAgICAgICAgICAgKGlmIChlbXB0eT8gbW9kcylcbiAgICAgICAgICAgICAgICAgIGJvZHlcbiAgICAgICAgICAgICAgICAgIChsZXQqICgobSAoZmlyc3QgbW9kcykpIChpdGVtIChmaXJzdCBtKSkgKGFyZyAoc2Vjb25kIG0pKSlcbiAgICAgICAgICAgICAgICAgICAgKHJlY3VyIChyZXN0IG1vZHMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAoY29uZCAoKD0gaXRlbSAnOmxldCkgICBgKGxldCoqICwocGFyZW4tYmluZGluZ3MtPnZlYyBhcmcpICxib2R5KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgoPSBpdGVtICc6d2hpbGUpIGAoaWYgLGFyZyAsYm9keSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKD0gaXRlbSAnOndoZW4pICBgKGlmICxhcmcgLGJvZHkgKHJlY3VyIChyZXN0ICxjb2xsKSkpKSkpKSkpKSlcbiAgICAobWVyZ2UgY29udGV4dFxuICAgICAgICAgICB7OnN1YnNlcSAoZ2Vuc3ltIDpmb3Itc3Vic2VxKVxuICAgICAgICAgICAgOmJvZHkgICBgKChsYW1iZGEgLGl0ZXIgKCxjb2xsKVxuICAgICAgICAgICAgICAgICAgICAgICAgKGxhenktc2VxIChsb29wICgoLGNvbGwgLGNvbGwpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGlmLW5vdCAoZW1wdHk/ICxjb2xsKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAobGV0KiogWywoZmlyc3QgbG9vcCkgKGZpcnN0ICxjb2xsKV0gLG5leHQpKSkpKVxuICAgICAgICAgICAgICAgICAgICAgICwoc2Vjb25kIGxvb3ApKX0pKSlcblxuKGRlZnZhci0gZm9yLW1vZGlmaWVycyAjeyc6bGV0ICc6d2hpbGUgJzp3aGVufSlcblxuKGRlZnVuLSBmb3ItcGFydHMgKHNlcS1leHByLXBhaXJzKVxuICAobGV0KiAoKG4gICAgICAgIChjb3VudCBzZXEtZXhwci1wYWlycykpXG4gICAgICAgIChpbmRpY2VzICAoZmlsdGVyIChsYW1iZGEgKCUpICgtPiAoYWdldCBzZXEtZXhwci1wYWlycyAlKSBmaXJzdCBmb3ItbW9kaWZpZXJzIG5vdCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgKHJhbmdlIG4pKSlcbiAgICAgICAgKHNlZ21lbnRzIChwYXJ0aXRpb24gMiAxIChjb25qIGluZGljZXMgbikpKSlcbiAgICAobWFwIChsYW1iZGEgKCUpICguc2xpY2Ugc2VxLWV4cHItcGFpcnMgKGZpcnN0ICUpIChzZWNvbmQgJSkpKVxuICAgICAgICAgc2VnbWVudHMpKSlcblxuKGRlZnVuIGV4cGFuZC1mb3JcbiAgKHNlcS1leHBycyBib2R5LWV4cHIpXG4gIFwiTGlzdCBjb21wcmVoZW5zaW9uLiBUYWtlcyBhIHBhcmVuIGNsYXVzZSBsaXN0IG9mIG9uZSBvciBtb3JlXG4gICAoYmluZGluZy1mb3JtIGNvbGxlY3Rpb24tZXhwcikgcGFpcnMsIGVhY2ggZm9sbG93ZWQgYnkgemVybyBvciBtb3JlXG4gICBtb2RpZmllciBjbGF1c2VzLCBhbmQgeWllbGRzIGEgbGF6eSBzZXF1ZW5jZSBvZiBldmFsdWF0aW9ucyBvZiBleHByLlxuICAgQ29sbGVjdGlvbnMgYXJlIGl0ZXJhdGVkIGluIGEgbmVzdGVkIGZhc2hpb24sIHJpZ2h0bW9zdCBmYXN0ZXN0LFxuICAgYW5kIG5lc3RlZCBjb2xsLWV4cHJzIGNhbiByZWZlciB0byBiaW5kaW5ncyBjcmVhdGVkIGluIHByaW9yXG4gICBiaW5kaW5nLWZvcm1zLiAgU3VwcG9ydGVkIG1vZGlmaWVycyBhcmU6ICg6bGV0ICgoYmluZGluZy1mb3JtIGV4cHIpIC4uLikpLFxuICAgKDp3aGlsZSB0ZXN0KSwgKDp3aGVuIHRlc3QpLlxuICAodGFrZSAxMDAgKGZvciAoKHggKGluZmluaXRlLXJhbmdlKSkgKHkgKGluZmluaXRlLXJhbmdlKSkgKDp3aGlsZSAoPCB5IHgpKSkgIFt4IHldKSlcblxuICBEZXBlbmRzIG9uIGxhenktc2VxLCBsYXp5LWNvbmNhdCwgZW1wdHk/LCBmaXJzdCwgcmVzdCwgY29uc1wiXG4gIChsZXQqICgocGFpcnMgKHZlYyAobWFwIHZlYyBzZXEtZXhwcnMpKSlcbiAgICAgICAgKGl0ZXIgKGdlbnN5bSA6Zm9yLWl0ZXIpKSAoY29sbCAoZ2Vuc3ltIDpmb3ItY29sbCkpIChwYXJ0cyAoZm9yLXBhcnRzIHBhaXJzKSkpXG4gICAgKDpib2R5IChyZWR1Y2UgKGxhbWJkYSAoJTEgJTIpIChhcHBseSBmb3Itc3RlcCAlMSAlMikpXG4gICAgICAgICAgICAgICAgICAgezppdGVyIGl0ZXIgOmNvbGwgY29sbCA6Ym9keSBgKGNvbnMgLGJvZHktZXhwciAoLGl0ZXIgKHJlc3QgLGNvbGwpKSl9XG4gICAgICAgICAgICAgICAgICAgKHJldmVyc2UgcGFydHMpKSkpKVxuKGluc3RhbGwtbWFjcm8gOmZvciBleHBhbmQtZm9yKVxuXG4oZGVmdW4gZXhwYW5kLWRvc2VxXG4gIChzZXEtZXhwcnMgJnJlc3QgYm9keSlcbiAgXCJSZXBlYXRlZGx5IGV4ZWN1dGVzIGJvZHkgKHByZXN1bWFibHkgZm9yIHNpZGUtZWZmZWN0cykgd2l0aFxuICBiaW5kaW5ncyBhbmQgZmlsdGVyaW5nIGFzIHByb3ZpZGVkIGJ5ICdmb3InLiBEb2VzIG5vdCByZXRhaW5cbiAgdGhlIGhlYWQgb2YgdGhlIHNlcXVlbmNlLiBSZXR1cm5zIG5pbC5cblxuICBEZXBlbmRzIG9uIGxhenktc2VxLCBsYXp5LWNvbmNhdCwgZW1wdHk/LCBmaXJzdCwgcmVzdCwgY29ucywgZG9ydW5cIlxuICBgKGRvcnVuIChmb3IgLHNlcS1leHBycyAocHJvZ24gLEBib2R5IG5pbCkpKSlcbihpbnN0YWxsLW1hY3JvIDpkb3NlcSBleHBhbmQtZG9zZXEpXG5cblxuKGRlZnVuLSBzeW0qIChzdHJpbmcpXG4gIChsZXQqICgod29yZHMgKHNwbGl0IChuYW1lIHN0cmluZykgI1wiLVwiKSkpXG4gICAgKGpvaW4gKGNvbnMgKGZpcnN0IHdvcmRzKSAobWFwIGNhcGl0YWxpemUgKHJlc3Qgd29yZHMpKSkpKSlcbihkZWZ1bi0gYmluZC1zeW0qIChzIGIpXG4gIChhc3NlcnQgKHN5bWJvbD8gcykgXCJFeHBlY3RlZCBhIHN5bWJvbCBoZXJlIVwiKVxuICBbcyBiXSlcbihkZWZ1bi0gY29uai1zeW1zKiAoZ2V0KiByZXN1bHQgayB2IGYgcXVvdGUpXG4gIChsZXQqICgoay1ucyAobmFtZXNwYWNlIGspKSAoZyAobGFtYmRhICglKSAoZiBrLW5zIChuYW1lICUpKSkpKVxuICAgICh2ZWMgKGNvbmNhdCByZXN1bHQgKG1hcGNhdCAobGFtYmRhICglKSAoYmluZC1zeW0qICUgKGdldCogJSAoZyAlKSBxdW90ZSkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2KSkpKSlcbihkZWZ1bi0gZGljdC1nZXQqIChkaWN0LW5hbWUgZGVmYXVsdHMpXG4gIChsYW1iZGEgKGJpbmRpbmcga2V5IHF1b3RlKVxuICAgIChsZXQqICgocyAobmFtZSBrZXkpKVxuICAgICAgICAgIChrIChrZXl3b3JkIChuYW1lc3BhY2Uga2V5KSAoaWYgKHN5bWJvbD8ga2V5KSAoc3ltKiBzKSBzKSkpKVxuICAgICAgYChnZXQgLGRpY3QtbmFtZSAsKGlmLW5vdCBxdW90ZSBrIGAnLGspICwoYW5kIGJpbmRpbmcgKGFnZXQgZGVmYXVsdHMgYmluZGluZykpKSkpKVxuXG4oZGVmdW4gZGVzdHJ1Y3R1cmUtZGljdCAoYmluZGluZyBmcm9tKVxuICAobGV0KiAoKGRpY3QtbmFtZSAgKG9yIChhZ2V0IGJpbmRpbmcgJzphcykgKGdlbnN5bSA6ZGVzdHJ1Y3R1cmUtYmluZCkpKVxuICAgICAgICAoZGljdC1iaW5kICBgKGlmIChkaWN0aW9uYXJ5PyAsZGljdC1uYW1lKSAsZGljdC1uYW1lIChhcHBseSBkaWN0aW9uYXJ5ICh2ZWMgLGRpY3QtbmFtZSkpKSlcbiAgICAgICAgKGdldCogICAgICAgKGRpY3QtZ2V0KiBkaWN0LW5hbWUgKGdldCBiaW5kaW5nICc6b3Ige30pKSkpXG4gICAgKGxvb3AgKChrcyAoa2V5cyAoZGlzc29jIGJpbmRpbmcgJzphcyAnOm9yKSkpIChyZXN1bHQgW2RpY3QtbmFtZSBmcm9tIGRpY3QtbmFtZSBkaWN0LWJpbmRdKSlcbiAgICAgIChpZiAoZW1wdHk/IGtzKVxuICAgICAgICByZXN1bHRcbiAgICAgICAgKGxldCogKChrIChmaXJzdCBrcykpICh2IChnZXQgYmluZGluZyBrKSkgKGsqIChhbmQgKGtleXdvcmQ/IGspIChuYW1lIGspKSkpXG4gICAgICAgICAgKGFzc2VydCAob3IgKHN5bWJvbD8gaykgKGFuZCBrKiAoI3s6a2V5cyA6c3RycyA6c3ltc30gayopKSlcbiAgICAgICAgICAgICAgICAgIChzdHIgXCJJbnZhbGlkIGRlc3RydWN0dXJlIGtleSBcIiBrKSlcbiAgICAgICAgICAocmVjdXIgKHJlc3Qga3MpIChjb25kICgoPSBrKiA6c3RycykgKGNvbmotc3ltcyogZ2V0KiByZXN1bHQgayB2IGtleXdvcmQpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCg9IGsqIDpzeW1zKSAoY29uai1zeW1zKiBnZXQqIHJlc3VsdCBrIHYgKGxhbWJkYSAoJTEgJTIpIChzeW1ib2wgJTEgKHN5bSogJTIpKSkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgoPSBrKiA6a2V5cykgKGNvbmotc3ltcyogZ2V0KiByZXN1bHQgayB2IGtleXdvcmQpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKChudW1iZXI/IHYpICAoY29uaiByZXN1bHQgayAoZ2V0KiBrIChzeW1ib2wgKHN0ciB2KSkpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChlbHNlICAgICAgICAoY29uaiByZXN1bHQgayAoZ2V0KiBrIHYpKSkpKSkpKSkpXG5cbihkZWZ1biBkZXN0cnVjdHVyZS1zZXEgKGJpbmRpbmcgZnJvbSlcbiAgKGxldCogKChhcyAgICAgICAoLmZpbmQtaW5kZXggYmluZGluZyAobGFtYmRhICglKSAoPSAlICc6YXMpKSkpXG4gICAgICAgIChzZXEtbmFtZSAoaWYgKDwgYXMgMCkgKGdlbnN5bSA6ZGVzdHJ1Y3R1cmUtYmluZCkgKG50aCBiaW5kaW5nIChpbmMgYXMpKSkpXG4gICAgICAgIChiaW5kaW5nMSAoaWYgKDwgYXMgMCkgYmluZGluZyAodGFrZSBhcyBiaW5kaW5nKSkpXG4gICAgICAgIChtb3JlICAgICAoLmZpbmQtaW5kZXggYmluZGluZzEgKGxhbWJkYSAoJSkgKG9yICg9ICUgJyYpICg9ICUgJyZyZXN0KSkpKSlcbiAgICAgICAgKHRhaWwgICAgIChpZiAoPj0gbW9yZSAwKSAobnRoIGJpbmRpbmcxIChpbmMgbW9yZSkpKSlcbiAgICAgICAgKGJpbmRpbmcyIChpZiAoPCBtb3JlIDApIGJpbmRpbmcxICh0YWtlIG1vcmUgYmluZGluZykpKSlcbiAgICAoYXNzZXJ0IChvciAoPCBhcyAwKSAoPSBhcyAoLSAoY291bnQgYmluZGluZykgMikpKVxuICAgICAgICAgICAgXCJpbnZhbGlkIDphcyBpbiBzZXEtZGVzdHJ1Y3R1cmluZ1wiKVxuICAgIChhc3NlcnQgKG9yICg8IG1vcmUgMCkgKD0gbW9yZSAoLSAoY291bnQgYmluZGluZzEpIDIpKSlcbiAgICAgICAgICAgIFwiaW52YWxpZCAmIGluIHNlcS1kZXN0cnVjdHVyaW5nXCIpXG4gICAgKGxvb3AgKCh4cyBiaW5kaW5nMikgKGkgMCkgKHJlc3VsdCBbc2VxLW5hbWUgZnJvbV0pKVxuICAgICAgKGxldCogKCh4IChmaXJzdCB4cykpKVxuICAgICAgICAoY29uZCAoKGVtcHR5PyB4cykgKGlmLW5vdCB0YWlsIHJlc3VsdCAoY29uaiByZXN1bHQgdGFpbCBgKGRyb3AgLG1vcmUgLHNlcS1uYW1lKSkpKVxuICAgICAgICAgICAgICAoKD0geCAnXykgICAgKHJlY3VyIChyZXN0IHhzKSAoaW5jIGkpIHJlc3VsdCkpXG4gICAgICAgICAgICAgIChlbHNlICAgICAgIChyZWN1ciAocmVzdCB4cykgKGluYyBpKSAoY29uaiByZXN1bHQgeCBgKG50aCAsc2VxLW5hbWUgLGkpKSkpKSkpKSlcblxuKGRlZnVuIGRlc3RydWN0dXJlIChiaW5kaW5ncylcbiAgKGxldCogKChwYWlycyAocGFydGl0aW9uIDIgYmluZGluZ3MpKSlcbiAgICAoaWYgKGV2ZXJ5PyAobGFtYmRhICglKSAoc3ltYm9sPyAoZmlyc3QgJSkpKSBwYWlycylcbiAgICAgIGJpbmRpbmdzXG4gICAgICAoZGVzdHJ1Y3R1cmUgKHZlYyAobWFwY2F0IChsYW1iZGEgKCUpIChjb25kICgodmVjdG9yPyAgICAgKGZpcnN0ICUpKSAoYXBwbHkgZGVzdHJ1Y3R1cmUtc2VxICUpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKChkaWN0aW9uYXJ5PyAoZmlyc3QgJSkpIChhcHBseSBkZXN0cnVjdHVyZS1kaWN0ICUpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKChzeW1ib2w/ICAgICAoZmlyc3QgJSkpICUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZWxzZSAgICAgICAgICAgICAgICAgICAodGhyb3cgXCJJbnZhbGlkIGJpbmRpbmdcIikpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFpcnMpKSkpKSlcblxuKGRlZnVuLSBiaW5kLW5hbWVzKiAoa2V5cylcbiAgKHppcG1hcCBrZXlzIChyZXBlYXRlZGx5IChjb3VudCBrZXlzKSAobGFtYmRhICgpIChnZW5zeW0gOmRlc3RydWN0dXJlLWJpbmQpKSkpKVxuKGRlZnVuLSBiaW5kLWluZGljZXMqIChuYW1lcylcbiAgKGZpbHRlciAobGFtYmRhICglKSAobm90IChzeW1ib2w/IChudGggbmFtZXMgJSkpKSkgKHJhbmdlIChjb3VudCBuYW1lcykpKSlcblxuKGRlZnVuLSBwYXJlbi1iaW5kaW5ncy0+dmVjXG4gIChiaW5kaW5ncylcbiAgXCJUdXJucyBhIG5ldy1zeW50YXggYGxldGAvYGxldCpgIHBhcmVuIGJpbmRpbmcgbGlzdCwgZS5nLlxuICAoKHggMSkgKHkgMikpLCBpbnRvIHRoZSBmbGF0IHZlY3RvciBbeCAxIHkgMl0gdGhlIGludGVybmFsIGBsZXQqKmBcbiAgZm9ybSAoYW5kIGBkZXN0cnVjdHVyZWApIGV4cGVjdC5cIlxuICAodmVjIChtYXBjYXQgKGxhbWJkYSAocGFpcikgWyhmaXJzdCBwYWlyKSAoc2Vjb25kIHBhaXIpXSkgYmluZGluZ3MpKSlcblxuKGRlZnVuIGV4cGFuZC1sZXQqXG4gIChiaW5kaW5ncyAmcmVzdCBib2R5KVxuICBcIihsZXQqICgoeCAxKSAoeSAoKyB4IDEpKSkgYm9keSopIC0tIHNlcXVlbnRpYWw6IGVhY2ggYmluZGluZyBzZWVzXG4gIHRoZSBwcmV2aW91cyBvbmVzLlwiXG4gIGAobGV0KiogLChkZXN0cnVjdHVyZSAocGFyZW4tYmluZGluZ3MtPnZlYyBiaW5kaW5ncykpICxAYm9keSkpXG4oaW5zdGFsbC1tYWNybyEgOmxldCogZXhwYW5kLWxldCopXG5cbihkZWZ1biBleHBhbmQtbGV0XG4gIChiaW5kaW5ncyAmcmVzdCBib2R5KVxuICBcIihsZXQgKCh4IDEpICh5IDIpKSBib2R5KikgLS0gYmluZGluZ3MgZXZhbHVhdGVkIGluIHRoZSBPVVRFUiBzY29wZVxuICAocGFyYWxsZWwpOiBldmVyeSBpbml0LWV4cHIgc2VlcyBvbmx5IHdoYXQgd2FzIGJvdW5kIGJlZm9yZSB0aGlzXG4gIGBsZXRgLCBuZXZlciBhIHNpYmxpbmcgYmluZGluZyBpbnRyb2R1Y2VkIGJ5IHRoZSBzYW1lIGZvcm0uIEFsbFxuICBpbml0LWV4cHJzIGFyZSBldmFsdWF0ZWQgZmlyc3QgKGJvdW5kIHRvIGdlbnN5bXMpLCB0aGVuIHRoZSByZWFsXG4gIG5hbWVzIGFyZSBib3VuZCBmcm9tIHRob3NlIGdlbnN5bXMuXCJcbiAgKGxldCogKChwYWlycyAocGFydGl0aW9uIDIgKHBhcmVuLWJpbmRpbmdzLT52ZWMgYmluZGluZ3MpKSlcbiAgICAgICAgKGdlbnN5bXMgKG1hcCAobGFtYmRhIChfKSAoZ2Vuc3ltIDpsZXQtYmluZGluZykpIHBhaXJzKSlcbiAgICAgICAgKG91dGVyIChtYXBjYXQgKGxhbWJkYSAoZyBwYWlyKSBbZyAoc2Vjb25kIHBhaXIpXSkgZ2Vuc3ltcyBwYWlycykpXG4gICAgICAgIChpbm5lciAobWFwY2F0IChsYW1iZGEgKGcgcGFpcikgWyhmaXJzdCBwYWlyKSBnXSkgZ2Vuc3ltcyBwYWlycykpKVxuICAgIGAobGV0KiogLCh2ZWMgb3V0ZXIpIChsZXQqKiAsKGRlc3RydWN0dXJlICh2ZWMgaW5uZXIpKSAsQGJvZHkpKSkpXG4oaW5zdGFsbC1tYWNybyEgOmxldCBleHBhbmQtbGV0KVxuXG4oZGVmdW4tIHBhcnNlLWFyZ2xpc3RcbiAgKHBhcmFtcylcbiAgXCJQYXJzZXMgYSBuZXctc3ludGF4IHBhcmFtZXRlciBsaXN0IC0tIChhIGIgJm9wdGlvbmFsIChjIDEwKSAmcmVzdCByKVxuICAtLSBpbnRvIHs6bmFtZXMgWy4uLl0gOmRlZmF1bHRzIChbbmFtZSBkZWZhdWx0XSAuLi4pfS4gOm5hbWVzIGlzIGFcbiAgZmxhdCB2ZWN0b3IgdXNpbmcgdGhlIGV4aXN0aW5nIGAmIHJlc3QtbmFtZWAgdmFyaWFkaWMgY29udmVudGlvblxuICBmbiovYW5hbHl6ZS1mbiBhbHJlYWR5IHVuZGVyc3RhbmRzOyA6ZGVmYXVsdHMgYXJlIFtuYW1lIGRlZmF1bHQtZm9ybV1cbiAgcGFpcnMgdG8gcHJlcGVuZCBhcyBib2R5IHN0YXRlbWVudHMuIFBvc2l0aW9uYWwgZGVzdHJ1Y3R1cmluZ1xuICAoYSBwYXJhbSBwb3NpdGlvbiB0aGF0IGlzIGl0c2VsZiBhIHZlY3Rvci9kaWN0aW9uYXJ5IHBhdHRlcm4pIGlzXG4gIGhhbmRsZWQgdGhlIHNhbWUgd2F5IG9sZCB3aXNwJ3MgYGZuYCBkaWQgaXQgLS0gc2VlIGBkZWYqYCBiZWxvdy5cIlxuICAobG9vcCAoKHJlbWFpbmluZyAoc2VxIHBhcmFtcykpXG4gICAgICAgICAobW9kZSA6cmVxdWlyZWQpXG4gICAgICAgICAobmFtZXMgW10pXG4gICAgICAgICAoZGVmYXVsdHMgW10pKVxuICAgIChpZiAoZW1wdHk/IHJlbWFpbmluZylcbiAgICAgIHs6bmFtZXMgbmFtZXMgOmRlZmF1bHRzIGRlZmF1bHRzfVxuICAgICAgKGxldCogKCh4IChmaXJzdCByZW1haW5pbmcpKSAoeHMgKHJlc3QgcmVtYWluaW5nKSkpXG4gICAgICAgIChjb25kXG4gICAgICAgICAgKCg9IHggJyZvcHRpb25hbCkgKHJlY3VyIHhzIDpvcHRpb25hbCBuYW1lcyBkZWZhdWx0cykpXG4gICAgICAgICAgKCg9IHggJyZyZXN0KSAocmVjdXIgeHMgOnJlc3QgbmFtZXMgZGVmYXVsdHMpKVxuICAgICAgICAgICgoaWRlbnRpY2FsPyBtb2RlIDpyZXN0KSAocmVjdXIgeHMgbW9kZSAoY29uaiBuYW1lcyAnJiB4KSBkZWZhdWx0cykpXG4gICAgICAgICAgKChhbmQgKGlkZW50aWNhbD8gbW9kZSA6b3B0aW9uYWwpIChsaXN0PyB4KSlcbiAgICAgICAgICAocmVjdXIgeHMgbW9kZSAoY29uaiBuYW1lcyAoZmlyc3QgeCkpXG4gICAgICAgICAgICAgICAgIChjb25qIGRlZmF1bHRzIFsoZmlyc3QgeCkgKHNlY29uZCB4KV0pKSlcbiAgICAgICAgICAoZWxzZSAocmVjdXIgeHMgbW9kZSAoY29uaiBuYW1lcyB4KSBkZWZhdWx0cykpKSkpKSlcblxuKGRlZnVuIGV4cGFuZC1sYW1iZGFcbiAgKCZyZXN0IGFyZ3MpXG4gIFwiKGxhbWJkYSAocGFyYW1zKikgZXhwcnMqKVxuICAgKGxhbWJkYSBuYW1lIChwYXJhbXMqKSBleHBycyopXG5cbiAgcGFyYW1zID0+IHBvc2l0aW9uYWwtcGFyYW1zKiAsIG9yIHBvc2l0aW9uYWwtcGFyYW1zKiAmb3B0aW9uYWxcbiAgKG9wdCBkZWZhdWx0PykqICZyZXN0IG5leHQtcGFyYW1cblxuICBDb21waWxlcyB0byBhIG5hbWVkIGBmdW5jdGlvbmAgZXhwcmVzc2lvbiAtLSBrZWVwcyBgdGhpc2AsXG4gIGBhcmd1bWVudHNgLCBhbmQgbmFtZWQgc2VsZi1yZWN1cnNpb24uIE11bHRpLWFyaXR5IGNsYXVzZXNcbiAgKChwYXJhbXMxKikgYm9keTEqKSAoKHBhcmFtczIqKSBib2R5MiopIC0tIENsb2p1cmUtd2lzcCdzIGFyaXR5XG4gIG92ZXJsb2FkaW5nIC0tIGFyZSBub3QgeWV0IHN1cHBvcnRlZCBmb3IgbmV3LXN5bnRheDogdGhhdCBjYWxsIGlzXG4gIGRlZmVycmVkIHRvIHRoZSBQaGFzZS0zIGFyaXR5LW92ZXJsb2FkaW5nIGNoZWNrcG9pbnQgKHRpY2tldCAjNSkuXCJcbiAgKGxldCogKChuYW1lIChpZiAoc3ltYm9sPyAoZmlyc3QgYXJncykpIChmaXJzdCBhcmdzKSkpXG4gICAgICAgIChkZWZzIChpZiBuYW1lIChyZXN0IGFyZ3MpIGFyZ3MpKSlcbiAgICAoaWYgKGFuZCAobGlzdD8gKGZpcnN0IGRlZnMpKVxuICAgICAgICAgICAgIChsaXN0PyAoZmlyc3QgKGZpcnN0IGRlZnMpKSkpXG4gICAgICAodGhyb3cgKEVycm9yIChzdHIgXCJsYW1iZGE6IG11bHRpLWFyaXR5IGNsYXVzZXMgYXJlIG5vdCBzdXBwb3J0ZWQgXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICBcImluIG5ldy1zeW50YXggeWV0IC0tIHRpY2tldCAjNSdzIGFyaXR5LW92ZXJsb2FkaW5nIFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgXCJxdWVzdGlvbiBpcyBzdGlsbCBvcGVuXCIpKSlcbiAgICAgIChsZXQqICgocGFyYW1zIChmaXJzdCBkZWZzKSlcbiAgICAgICAgICAgIChib2R5IChyZXN0IGRlZnMpKVxuICAgICAgICAgICAgKHBhcnNlZCAocGFyc2UtYXJnbGlzdCBwYXJhbXMpKVxuICAgICAgICAgICAgKGluZGljZXMgKGJpbmQtaW5kaWNlcyogKDpuYW1lcyBwYXJzZWQpKSlcbiAgICAgICAgICAgIChiaW5kcyAoYmluZC1uYW1lcyogaW5kaWNlcykpXG4gICAgICAgICAgICAoYXJndiAodmVjIChtYXAtaW5kZXhlZCAobGFtYmRhICglMSAlMikgKGdldCBiaW5kcyAlMSAlMikpICg6bmFtZXMgcGFyc2VkKSkpKVxuICAgICAgICAgICAgKGRlc3RydWN0dXJpbmcgKGlmIChlbXB0eT8gYmluZHMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW11cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbYChsZXQqKiAsKGRlc3RydWN0dXJlICh2ZWMgKG1hcGNhdCAobGFtYmRhIChpKSBbKG50aCAoOm5hbWVzIHBhcnNlZCkgaSkgKGdldCBiaW5kcyBpKV0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kaWNlcykpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAsQGJvZHkpXSkpXG4gICAgICAgICAgICAoZGVmYXVsdGluZyAobWFwIChsYW1iZGEgKGQpIGAoaWYgKG5pbD8gLChmaXJzdCBkKSkgKHNldCEgLChmaXJzdCBkKSAsKHNlY29uZCBkKSkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICg6ZGVmYXVsdHMgcGFyc2VkKSkpXG4gICAgICAgICAgICAoYm9keSogKGlmIChlbXB0eT8gZGVzdHJ1Y3R1cmluZylcbiAgICAgICAgICAgICAgICAgICAgKGNvbmNhdCBkZWZhdWx0aW5nIGJvZHkpXG4gICAgICAgICAgICAgICAgICAgIChjb25jYXQgZGVmYXVsdGluZyBkZXN0cnVjdHVyaW5nKSkpKVxuICAgICAgICAoaWYgbmFtZVxuICAgICAgICAgIGAoZm4qICxuYW1lICxhcmd2ICxAYm9keSopXG4gICAgICAgICAgYChmbiogLGFyZ3YgLEBib2R5KikpKSkpKVxuKGluc3RhbGwtbWFjcm8hIDpsYW1iZGEgZXhwYW5kLWxhbWJkYSlcblxuKGRlZnVuIGV4cGFuZC1sYW1iZGEqXG4gICgmcmVzdCBhcmdzKVxuICBcIihsYW1iZGEqIChwYXJhbXMqKSBleHBycyopXG5cbiAgVGhlIGFycm93LWZ1bmN0aW9uIGZvcm06IGNvbXBpbGVzIHRvIGFuIGFub255bW91c1xuICBBcnJvd0Z1bmN0aW9uRXhwcmVzc2lvbiwgd2hpY2ggY2FycmllcyBubyBgLnByb3RvdHlwZWAgLS0gaG9zdFxuICBzeXN0ZW1zIHRoYXQgY2xhc3NpZnkgYW55IC5wcm90b3R5cGUtYmVhcmluZyBmdW5jdGlvbiBhcyBhIGNsYXNzXG4gIChlLmcuIGNvcmRpcydzIGlzQ29uc3RydWN0b3IpIHN0b3AgbWlzcmVhZGluZyB0aGVzZSBhcyBjb25zdHJ1Y3RvcnMsXG4gIHNvIGEgcmV0dXJuZWQgZGlzcG9zZXIga2VlcHMgaXRzIHRlYXJkb3duLlxuXG4gIEFycm93cyBhcmUgYW5vbnltb3VzOiBubyBuYW1lLCBubyBgdGhpc2AgLyBgYXJndW1lbnRzYCAvXG4gIG5hbWVkIHNlbGYtcmVjdXJzaW9uIGluIHRoZSBib2R5ICh0aGUgYW5hbHl6ZXIgcmVqZWN0cyB1bnJlc29sdmVkXG4gIHJlZmVyZW5jZXMpLiBgJm9wdGlvbmFsYCBkZWZhdWx0cyBhcmUgc3VwcG9ydGVkICh0aGV5IGxvd2VyIHRvIGJvZHlcbiAgc3RhdGVtZW50cyk7IGAmcmVzdGAgaXMgcmVqZWN0ZWQgYmVjYXVzZSB0aGUgdmFyaWFkaWMgbG93ZXJpbmdcbiAgc2xpY2VzIGBhcmd1bWVudHNgLCB3aGljaCBhcnJvd3MgZG8gbm90IGhhdmUuIE11bHRpLWFyaXR5IGNsYXVzZXNcbiAgYXJlIHJlamVjdGVkLCBzYW1lIGFzIGBsYW1iZGFgLlwiXG4gIChjb25kICgoc3ltYm9sPyAoZmlyc3QgYXJncykpXG4gICAgICAgICAodGhyb3cgKEVycm9yIFwibGFtYmRhKiBkb2VzIG5vdCBzdXBwb3J0IGEgbmFtZSAtLSBhcnJvd3MgYXJlIGFub255bW91c1wiKSkpXG4gICAgICAgICgoYW5kIChsaXN0PyAoZmlyc3QgYXJncykpXG4gICAgICAgICAgICAgIChsaXN0PyAoZmlyc3QgKGZpcnN0IGFyZ3MpKSkpXG4gICAgICAgICAodGhyb3cgKEVycm9yIChzdHIgXCJsYW1iZGEqOiBtdWx0aS1hcml0eSBjbGF1c2VzIGFyZSBub3Qgc3VwcG9ydGVkIC0tIFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ1c2UgJm9wdGlvbmFsIChvciBsYW1iZGEpIGluc3RlYWRcIikpKSlcbiAgICAgICAgKGVsc2VcbiAgICAgICAgIChsZXQqICgocGFyYW1zIChmaXJzdCBhcmdzKSlcbiAgICAgICAgICAgICAgIChib2R5IChyZXN0IGFyZ3MpKVxuICAgICAgICAgICAgICAgKHBhcnNlZCAocGFyc2UtYXJnbGlzdCBwYXJhbXMpKVxuICAgICAgICAgICAgICAgKG5hbWVzICg6bmFtZXMgcGFyc2VkKSkpXG4gICAgICAgICAgIChpZiAoc29tZSAobGFtYmRhICglKSAoPSAnJiAlKSkgbmFtZXMpXG4gICAgICAgICAgICAgKHRocm93IChFcnJvciAoc3RyIFwibGFtYmRhKiBkb2VzIG5vdCBzdXBwb3J0ICZyZXN0IC0tIHRoZSB2YXJpYWRpYyBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImxvd2VyaW5nIHNsaWNlcyBgYXJndW1lbnRzYCwgd2hpY2ggYXJyb3dzIGxhY2tcIikpKVxuICAgICAgICAgICAgIChsZXQqICgoaW5kaWNlcyAoYmluZC1pbmRpY2VzKiBuYW1lcykpXG4gICAgICAgICAgICAgICAgICAgKGJpbmRzIChiaW5kLW5hbWVzKiBpbmRpY2VzKSlcbiAgICAgICAgICAgICAgICAgICAoYXJndiAodmVjIChtYXAtaW5kZXhlZCAobGFtYmRhICglMSAlMikgKGdldCBiaW5kcyAlMSAlMikpIG5hbWVzKSkpXG4gICAgICAgICAgICAgICAgICAgKGRlc3RydWN0dXJpbmcgKGlmIChlbXB0eT8gYmluZHMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtgKGxldCoqICwoZGVzdHJ1Y3R1cmUgKHZlYyAobWFwY2F0IChsYW1iZGEgKGkpIFsobnRoIG5hbWVzIGkpIChnZXQgYmluZHMgaSldKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRpY2VzKSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAsQGJvZHkpXSkpXG4gICAgICAgICAgICAgICAgICAgKGRlZmF1bHRpbmcgKG1hcCAobGFtYmRhIChkKSBgKGlmIChuaWw/ICwoZmlyc3QgZCkpIChzZXQhICwoZmlyc3QgZCkgLChzZWNvbmQgZCkpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKDpkZWZhdWx0cyBwYXJzZWQpKSlcbiAgICAgICAgICAgICAgICAgICAoYm9keSogKGlmIChlbXB0eT8gZGVzdHJ1Y3R1cmluZylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIChjb25jYXQgZGVmYXVsdGluZyBib2R5KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgKGNvbmNhdCBkZWZhdWx0aW5nIGRlc3RydWN0dXJpbmcpKSkpXG4gICAgICAgICAgICAgICA7OyBUaGUgOmFycm93IG1hcmtlciByaWRlcyB0aGUgKGZuKiAuLi4pIGZvcm0ncyBtZXRhZGF0YVxuICAgICAgICAgICAgICAgOzsgaW50byBhbmFseXplLWZuLCB3aGljaCB0aHJlYWRzIGl0IG9udG8gdGhlIEFTVCBub2RlXG4gICAgICAgICAgICAgICA7OyAoYW5kIHRoZSBzY29wZSBlbnYpIGZvciB0aGUgYmFja2VuZC5cbiAgICAgICAgICAgICAgICh3aXRoLW1ldGEgYChmbiogLGFyZ3YgLEBib2R5KikgezphcnJvdyB0cnVlfSkpKSkpKSlcbihpbnN0YWxsLW1hY3JvISA6bGFtYmRhKiBleHBhbmQtbGFtYmRhKilcblxuKGRlZnVuIGV4cGFuZC1kZWZwbHVnaW5cbiAgKGlkICZyZXN0IG1vcmUpXG4gIFwiKGRlZnBsdWdpbiBpZCBhdHRycz8gKHBhcmFtcyopIGV4cHJzKilcblxuICBEZWZpbmVzIElEIGFzIGFuIGFycm93LWZ1bmN0aW9uIHBsdWdpbjpcbiAgKGRlZnZhciBpZCAobGFtYmRhKiAocGFyYW1zKikgZXhwcnMqKSkgd2l0aCBlYWNoIHBhaXIgb2YgdGhlXG4gIG9wdGlvbmFsIGF0dHJzIG1hcCBmb3J3YXJkZWQgb250byB0aGUgZnVuY3Rpb24gdmlhXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eTpcblxuICAoZGVmcGx1Z2luIGhhbmRsZXIgezppbmplY3QgW2EgYl19IChjdHggY29uZmlnKSAuLi4pXG4gID0+IChkZWZ2YXIgaGFuZGxlciAoKGxhbWJkYSAocGx1Z2luLWdlbnN5bSlcbiAgICAgICAgICAgICAgICAgICAgICAgIChPYmplY3QuZGVmaW5lUHJvcGVydHkgcGx1Z2luLWdlbnN5bSBcXFwiaW5qZWN0XFxcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICB7OnZhbHVlIFthIGJdIDp3cml0YWJsZSB0cnVlIDplbnVtZXJhYmxlIHRydWUgOmNvbmZpZ3VyYWJsZSB0cnVlfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsdWdpbi1nZW5zeW0pXG4gICAgICAgICAgICAgICAgICAgICAgKGxhbWJkYSogKGN0eCBjb25maWcpIC4uLikpKVxuXG4gIGRlZmluZVByb3BlcnR5IChub3QgcGxhaW4gYXNzaWdubWVudCkgaXMgdXNlZCBiZWNhdXNlIHRoZVxuICBmdW5jdGlvbidzIG93biBgbmFtZWAgKGFuZCBgbGVuZ3RoYCkgcHJvcGVydGllcyBhcmUgbm9uLXdyaXRhYmxlXG4gIGFuZCBhIHNpbGVudCBuby1vcCBvdGhlcndpc2UuIFRoZSBhc3NpZ25tZW50cyBydW4gaW5zaWRlIHRoZVxuICBkZWZ2YXIgaW5pdCBzbyB0aGUgcGx1Z2luIHN0YXlzIGEgc2luZ2xlIHRvcC1sZXZlbCBkZWZpbml0aW9uXG4gIChleHBvcnRzIHNlbWFudGljcyBpZGVudGljYWwgdG8gYGRlZnVuYCkuIEFueSBtZXRhZGF0YSBrZXlcbiAgZm9yd2FyZHMgKGluamVjdCwgbmFtZSwgQ29uZmlnLCBwcm92aWRlLCAuLi4pLiBUaGUgYXJyb3cgZW1pdFxuICBjYXJyaWVzIG5vIC5wcm90b3R5cGUsIHNvIHBsdWdpbiBob3N0cyBjYW5ub3QgbWlzcmVhZCB0aGUgcGx1Z2luXG4gIGFzIGEgY2xhc3MgYW5kIGRyb3AgYSByZXR1cm5lZCBkaXNwb3Nlci5cIlxuICAobGV0KiAoKGF0dHJzIChpZiAoZGljdGlvbmFyeT8gKGZpcnN0IG1vcmUpKSAoZmlyc3QgbW9yZSkge30pKVxuICAgICAgICAoZGVmbi1mb3JtcyAoaWYgKGRpY3Rpb25hcnk/IChmaXJzdCBtb3JlKSkgKHJlc3QgbW9yZSkgbW9yZSkpXG4gICAgICAgIChwYXJhbXMgKGZpcnN0IGRlZm4tZm9ybXMpKVxuICAgICAgICAoYm9keSAocmVzdCBkZWZuLWZvcm1zKSlcbiAgICAgICAgKHBsdWdpbiAoZ2Vuc3ltIFwicGx1Z2luXCIpKVxuICAgICAgICAoZm9yd2FyZGluZyAobWFwIChsYW1iZGEgKGspXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBgKC5kZWZpbmVQcm9wZXJ0eSBqcy9PYmplY3QgLHBsdWdpbiAsKG5hbWUgaylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHs6dmFsdWUgLChnZXQgYXR0cnMgaylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6d3JpdGFibGUgdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDplbnVtZXJhYmxlIHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Y29uZmlndXJhYmxlIHRydWV9KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAoa2V5cyBhdHRycykpKSlcbiAgICBgKGRlZnZhciAsaWQgKChsYW1iZGEgKCxwbHVnaW4pXG4gICAgICAgICAgICAgICAgICAgICxAZm9yd2FyZGluZ1xuICAgICAgICAgICAgICAgICAgICAscGx1Z2luKVxuICAgICAgICAgICAgICAgICAgKGxhbWJkYSogLHBhcmFtcyAsQGJvZHkpKSkpKVxuKGluc3RhbGwtbWFjcm8hIDpkZWZwbHVnaW4gZXhwYW5kLWRlZnBsdWdpbilcblxuKGRlZnVuIGV4cGFuZC1sb29wXG4gIChiaW5kaW5ncyAmcmVzdCBib2R5KVxuICBcIkV2YWx1YXRlcyB0aGUgZXhwcnMgaW4gYSBsZXhpY2FsIGNvbnRleHQgaW4gd2hpY2ggdGhlIHN5bWJvbHMgaW5cbiAgdGhlIGJpbmRpbmctZm9ybXMgYXJlIGJvdW5kIHRvIHRoZWlyIHJlc3BlY3RpdmUgaW5pdC1leHBycyBvciBwYXJ0c1xuICB0aGVyZWluLiBBY3RzIGFzIGEgcmVjdXIgdGFyZ2V0LlxuXG4gIERlcGVuZHMgb24gZGljdGlvbmFyeT8sIGRpY3Rpb25hcnksIHZlYywgZ2V0XCJcbiAgKGxldCogKChiaW5kaW5ncyAocGFyZW4tYmluZGluZ3MtPnZlYyBiaW5kaW5ncykpXG4gICAgICAgIChwYWlycyAgIChwYXJ0aXRpb24gMiBiaW5kaW5ncykpXG4gICAgICAgIChpbmRpY2VzIChiaW5kLWluZGljZXMqIChtYXB2IGZpcnN0IHBhaXJzKSkpXG4gICAgICAgIChuYW1lcyAgIChiaW5kLW5hbWVzKiBpbmRpY2VzKSlcbiAgICAgICAgKGdldCogICAgKGxhbWJkYSAoJTEgJTIpIChpZi1sZXQgW3ggKGFnZXQgbmFtZXMgJTEpXVxuICAgICAgICAgICAgICAgICAgIFt4IChzZWNvbmQgJTIpIChmaXJzdCAlMikgeF1cbiAgICAgICAgICAgICAgICAgICAlMikpKSlcbiAgICAoaWYgKGVtcHR5PyBuYW1lcylcbiAgICAgIGAobG9vcCogLGJpbmRpbmdzICxAYm9keSlcbiAgICAgIGAobGV0KiogLCh2ZWMgKGFwcGx5IGNvbmNhdCAobWFwLWluZGV4ZWQgZ2V0KiBwYWlycykpKVxuICAgICAgICAgKGxvb3AqICwodmVjIChhcHBseSBjb25jYXQgKG1hcC1pbmRleGVkIChsYW1iZGEgKCUxICUyKSAobGV0KiAoKHggKGdldCBuYW1lcyAlMSAoZmlyc3QgJTIpKSkpIFt4IHhdKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWlycykpKVxuICAgICAgICAgICAobGV0KiogLCh2ZWMgKG1hcGNhdCAobGFtYmRhIChpKSBbKGZpcnN0IChhZ2V0IHBhaXJzIGkpKSAoYWdldCBuYW1lcyBpKV0pIGluZGljZXMpKVxuICAgICAgICAgICAgICxAYm9keSkpKSkpKVxuKGluc3RhbGwtbWFjcm8gOmxvb3AgZXhwYW5kLWxvb3ApXG4iXX0=
