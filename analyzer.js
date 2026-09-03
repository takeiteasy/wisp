{
    var _ns_ = {
        id: 'wisp.analyzer',
        doc: null
    };
    var wisp_ast = require('./ast');
    var meta = wisp_ast.meta;
    var withMeta = wisp_ast.withMeta;
    var isSymbol = wisp_ast.isSymbol;
    var isKeyword = wisp_ast.isKeyword;
    var isQuote = wisp_ast.isQuote;
    var symbol = wisp_ast.symbol;
    var namespace = wisp_ast.namespace;
    var name = wisp_ast.name;
    var prStr = wisp_ast.prStr;
    var isUnquote = wisp_ast.isUnquote;
    var isUnquoteSplicing = wisp_ast.isUnquoteSplicing;
    var wisp_sequence = require('./sequence');
    var isList = wisp_sequence.isList;
    var list = wisp_sequence.list;
    var conj = wisp_sequence.conj;
    var partition = wisp_sequence.partition;
    var seq = wisp_sequence.seq;
    var isEmpty = wisp_sequence.isEmpty;
    var map = wisp_sequence.map;
    var vec = wisp_sequence.vec;
    var isEvery = wisp_sequence.isEvery;
    var concat = wisp_sequence.concat;
    var first = wisp_sequence.first;
    var second = wisp_sequence.second;
    var third = wisp_sequence.third;
    var rest = wisp_sequence.rest;
    var last = wisp_sequence.last;
    var butlast = wisp_sequence.butlast;
    var interleave = wisp_sequence.interleave;
    var cons = wisp_sequence.cons;
    var count = wisp_sequence.count;
    var some = wisp_sequence.some;
    var assoc = wisp_sequence.assoc;
    var reduce = wisp_sequence.reduce;
    var filter = wisp_sequence.filter;
    var isSeq = wisp_sequence.isSeq;
    var drop = wisp_sequence.drop;
    var wisp_runtime = require('./runtime');
    var isNil = wisp_runtime.isNil;
    var isDictionary = wisp_runtime.isDictionary;
    var isVector = wisp_runtime.isVector;
    var keys = wisp_runtime.keys;
    var vals = wisp_runtime.vals;
    var isString = wisp_runtime.isString;
    var isNumber = wisp_runtime.isNumber;
    var isBoolean = wisp_runtime.isBoolean;
    var isDate = wisp_runtime.isDate;
    var isRePattern = wisp_runtime.isRePattern;
    var isEven = wisp_runtime.isEven;
    var isEqual = wisp_runtime.isEqual;
    var max = wisp_runtime.max;
    var dec = wisp_runtime.dec;
    var dictionary = wisp_runtime.dictionary;
    var subs = wisp_runtime.subs;
    var inc = wisp_runtime.inc;
    var dec = wisp_runtime.dec;
    var wisp_expander = require('./expander');
    var macroexpand = wisp_expander.macroexpand;
    var wisp_string = require('./string');
    var split = wisp_string.split;
    var join = wisp_string.join;
}
var syntaxError = exports.syntaxError = function syntaxError(message, form) {
    return function () {
        var metadataø1 = meta(form);
        var lineø1 = ((metadataø1 || 0)['start'] || 0)['line'];
        var uriø1 = (metadataø1 || 0)['uri'];
        var columnø1 = ((metadataø1 || 0)['start'] || 0)['column'];
        var errorø1 = SyntaxError('' + message + '\n' + 'Form: ' + prStr(form) + '\n' + 'URI: ' + uriø1 + '\n' + 'Line: ' + lineø1 + '\n' + 'Column: ' + columnø1);
        errorø1.lineNumber = lineø1;
        errorø1.line = lineø1;
        errorø1.columnNumber = columnø1;
        errorø1.column = columnø1;
        errorø1.fileName = uriø1;
        errorø1.uri = uriø1;
        return (function () {
            throw errorø1;
        })();
    }.call(this);
};
var analyzeKeyword = exports.analyzeKeyword = function analyzeKeyword(env, form) {
    return {
        'op': 'constant',
        'form': form
    };
};
var __specials__ = exports.__specials__ = {};
var installSpecial = exports.installSpecial = function installSpecial(op, analyzer) {
    return (__specials__ || 0)[name(op)] = analyzer;
};
var analyzeSpecial = exports.analyzeSpecial = function analyzeSpecial(analyzer, env, form) {
    return function () {
        var metadataø1 = meta(form);
        var astø1 = analyzer(env, form);
        return conj({
            'start': (metadataø1 || 0)['start'],
            'end': (metadataø1 || 0)['end']
        }, astø1);
    }.call(this);
};
var analyzeIf = exports.analyzeIf = function analyzeIf(env, form) {
    return function () {
        var formsø1 = rest(form);
        var elseTailø1 = drop(2, formsø1);
        var elseFormø1 = isEmpty(elseTailø1) ? (function () {
            return null;
        })() : count(elseTailø1) === 1 ? (function () {
            return first(elseTailø1);
        })() : (function () {
            return cons(symbol(null, 'progn'), elseTailø1);
        })();
        var testø1 = analyze(env, first(formsø1));
        var consequentø1 = analyze(env, second(formsø1));
        var alternateø1 = analyze(env, elseFormø1);
        count(formsø1) < 2 ? syntaxError('Malformed if expression, too few operands', form) : null;
        return {
            'op': 'if',
            'form': form,
            'test': testø1,
            'consequent': consequentø1,
            'alternate': alternateø1
        };
    }.call(this);
};
installSpecial('if', analyzeIf);
var analyzeThrow = exports.analyzeThrow = function analyzeThrow(env, form) {
    return function () {
        var expressionø1 = analyze(env, second(form));
        return {
            'op': 'throw',
            'form': form,
            'throw': expressionø1
        };
    }.call(this);
};
installSpecial('throw', analyzeThrow);
var analyzeTry = exports.analyzeTry = function analyzeTry(env, form) {
    return function () {
        var formsø1 = vec(rest(form));
        var tailø1 = last(formsø1);
        var finalizerFormø1 = isList(tailø1) && isEqual(symbol(null, 'finally'), first(tailø1)) ? rest(tailø1) : null;
        var finalizerø1 = finalizerFormø1 ? analyzeBlock(env, finalizerFormø1) : null;
        var bodyFormø1 = finalizerø1 ? butlast(formsø1) : formsø1;
        var tailø2 = last(bodyFormø1);
        var handlerFormø1 = isList(tailø2) && isEqual(symbol(null, 'catch'), first(tailø2)) ? rest(tailø2) : null;
        var handlerø1 = handlerFormø1 ? conj({ 'name': analyze(env, first(handlerFormø1)) }, analyzeBlock(env, rest(handlerFormø1))) : null;
        var bodyø1 = handlerFormø1 ? analyzeBlock(subEnv(env), butlast(bodyFormø1)) : analyzeBlock(subEnv(env), bodyFormø1);
        return {
            'op': 'try',
            'form': form,
            'body': bodyø1,
            'handler': handlerø1,
            'finalizer': finalizerø1
        };
    }.call(this);
};
installSpecial('try', analyzeTry);
var analyzeSet = exports.analyzeSet = function analyzeSet(env, form) {
    return function () {
        var bodyø1 = rest(form);
        var leftø1 = first(bodyø1);
        var rightø1 = second(bodyø1);
        var targetø1 = isSymbol(leftø1) ? (function () {
            return analyzeSymbol(env, leftø1);
        })() : isList(leftø1) ? (function () {
            return analyzeList(env, leftø1);
        })() : (function () {
            return leftø1;
        })();
        var valueø1 = analyze(env, rightø1);
        return {
            'op': 'set!',
            'target': targetø1,
            'value': valueø1,
            'form': form
        };
    }.call(this);
};
installSpecial('set!', analyzeSet);
var analyzeNew = exports.analyzeNew = function analyzeNew(env, form) {
    return function () {
        var bodyø1 = rest(form);
        var constructorø1 = analyze(env, first(bodyø1));
        var paramsø1 = vec(map(function ($) {
            return analyze(env, $);
        }, rest(bodyø1)));
        return {
            'op': 'new',
            'constructor': constructorø1,
            'form': form,
            'params': paramsø1
        };
    }.call(this);
};
installSpecial('new', analyzeNew);
var analyzeAget = exports.analyzeAget = function analyzeAget(env, form) {
    return function () {
        var bodyø1 = rest(form);
        var targetø1 = analyze(env, first(bodyø1));
        var attributeø1 = second(bodyø1);
        var fieldø1 = isQuote(attributeø1) && isSymbol(second(attributeø1)) && second(attributeø1);
        return isNil(attributeø1) ? syntaxError('Malformed aget/aref expression expected (aget object member)', form) : {
            'op': 'member-expression',
            'computed': !fieldø1,
            'form': form,
            'target': targetø1,
            'property': fieldø1 ? conj(analyzeSpecial(analyzeIdentifier, env, fieldø1), { 'binding': null }) : analyze(env, attributeø1)
        };
    }.call(this);
};
installSpecial('aget', analyzeAget);
installSpecial('aref', analyzeAget);
var parseDef = exports.parseDef = function parseDef(id) {
    var args = Array.prototype.slice.call(arguments, 1);
    return isEmpty(args) ? (function () {
        return { 'id': id };
    })() : count(args) === 1 ? (function () {
        return {
            'id': id,
            'init': first(args)
        };
    })() : (function () {
        return {
            'id': id,
            'doc': first(args),
            'init': second(args)
        };
    })();
};
var analyzeDef = exports.analyzeDef = function analyzeDef(env, form) {
    return function () {
        var opø1 = name(first(form));
        var privateø1 = opø1 === 'defvar-' || opø1 === 'defconst-';
        var paramsø1 = parseDef.apply(null, vec(rest(form)));
        var idø1 = (paramsø1 || 0)['id'];
        var metadataø1 = meta(idø1);
        var bindingø1 = analyzeSpecial(analyzeDeclaration, env, idø1);
        var initø1 = analyze(env, (paramsø1 || 0)['init']);
        var docø1 = (paramsø1 || 0)['doc'] || (metadataø1 || 0)['doc'];
        return {
            'op': 'def',
            'doc': docø1,
            'id': bindingø1,
            'init': initø1,
            'export': (env || 0)['top'] && !privateø1,
            'form': form
        };
    }.call(this);
};
installSpecial('defvar', analyzeDef);
installSpecial('defvar-', analyzeDef);
installSpecial('defconst', analyzeDef);
installSpecial('defconst-', analyzeDef);
var analyzeDo = exports.analyzeDo = function analyzeDo(env, form) {
    return function () {
        var expressionsø1 = rest(form);
        var bodyø1 = analyzeBlock(env, expressionsø1);
        return conj(bodyø1, {
            'op': 'do',
            'form': form
        });
    }.call(this);
};
installSpecial('progn', analyzeDo);
var checkArrowRestriction = exports.checkArrowRestriction = function checkArrowRestriction(env, form) {
    return (env || 0)['arrow'] && (name(form) === 'this' || name(form) === 'arguments') && isEqual('unresolved-binding', (resolveBinding(env, form) || 0)['op']) ? syntaxError('' + 'lambda* body may not reference ' + name(form) + ' -- arrows have no own this/arguments', form) : null;
};
var analyzeSymbol = exports.analyzeSymbol = function analyzeSymbol(env, form) {
    checkArrowRestriction(env, form);
    return function () {
        var formsø1 = split(name(form), '.');
        var metadataø1 = meta(form);
        var startø1 = (metadataø1 || 0)['start'];
        var endø1 = (metadataø1 || 0)['end'];
        var expansionø1 = count(formsø1) > 1 ? list(symbol(null, 'aget'), withMeta(symbol(first(formsø1)), conj(metadataø1, {
            'start': startø1,
            'end': {
                'line': (endø1 || 0)['line'],
                'column': 1 + (startø1 || 0)['column'] + count(first(formsø1))
            }
        })), list(symbol(null, 'quote'), withMeta(symbol(join('.', rest(formsø1))), conj(metadataø1, {
            'end': endø1,
            'start': {
                'line': (startø1 || 0)['line'],
                'column': 1 + (startø1 || 0)['column'] + count(first(formsø1))
            }
        })))) : null;
        return expansionø1 ? analyze(env, withMeta(expansionø1, meta(form))) : analyzeSpecial(analyzeIdentifier, env, form);
    }.call(this);
};
var analyzeIdentifier = exports.analyzeIdentifier = function analyzeIdentifier(env, form) {
    return {
        'op': 'var',
        'type': 'identifier',
        'form': form,
        'start': (meta(form) || 0)['start'],
        'end': (meta(form) || 0)['end'],
        'binding': resolveBinding(env, form)
    };
};
var unresolvedBinding = exports.unresolvedBinding = function unresolvedBinding(env, form) {
    return {
        'op': 'unresolved-binding',
        'type': 'unresolved-binding',
        'identifier': {
            'type': 'identifier',
            'form': symbol(namespace(form), name(form))
        },
        'start': (meta(form) || 0)['start'],
        'end': (meta(form) || 0)['end']
    };
};
var resolveBinding = exports.resolveBinding = function resolveBinding(env, form) {
    return ((env || 0)['locals'] || 0)[name(form)] || ((env || 0)['enclosed'] || 0)[name(form)] || unresolvedBinding(env, form);
};
var analyzeShadow = exports.analyzeShadow = function analyzeShadow(env, id) {
    return function () {
        var bindingø1 = resolveBinding(env, id);
        return {
            'depth': inc((bindingø1 || 0)['depth'] || 0),
            'shadow': bindingø1
        };
    }.call(this);
};
var analyzeBinding = exports.analyzeBinding = function analyzeBinding(env, form) {
    return function () {
        var idø1 = first(form);
        var bodyø1 = second(form);
        return conj(analyzeShadow(env, idø1), {
            'op': 'binding',
            'type': 'binding',
            'id': idø1,
            'init': analyze(env, bodyø1),
            'form': form
        });
    }.call(this);
};
var analyzeDeclaration = exports.analyzeDeclaration = function analyzeDeclaration(env, form) {
    !!(namespace(form) || 1 < count(split('.', '' + form))) ? (function () {
        throw Error('' + 'Assert failed: ' + '' + '(not (or (namespace form) (< 1 (count (split "." (str form))))))');
    })() : null;
    return conj(analyzeShadow(env, form), {
        'op': 'var',
        'type': 'identifier',
        'depth': 0,
        'id': form,
        'form': form
    });
};
var analyzeParam = exports.analyzeParam = function analyzeParam(env, form) {
    return conj(analyzeShadow(env, form), {
        'op': 'param',
        'type': 'parameter',
        'id': form,
        'form': form,
        'start': (meta(form) || 0)['start'],
        'end': (meta(form) || 0)['end']
    });
};
var withBinding = exports.withBinding = function withBinding(env, form) {
    return conj(env, {
        'locals': assoc((env || 0)['locals'], name((form || 0)['id']), form),
        'bindings': conj((env || 0)['bindings'], form)
    });
};
var withParam = exports.withParam = function withParam(env, form) {
    return conj(withBinding(env, form), { 'params': conj((env || 0)['params'], form) });
};
var subEnv = exports.subEnv = function subEnv(env) {
    return {
        'enclosed': conj({}, (env || 0)['enclosed'], (env || 0)['locals']),
        'locals': {},
        'bindings': [],
        'params': (env || 0)['params'] || [],
        'arrow': isEqual((env || 0)['arrow'], true),
        'async': isEqual((env || 0)['async'], true)
    };
};
var analyzeLet_ = exports.analyzeLet_ = function analyzeLet_(env, form, isLoop) {
    return function () {
        var expressionsø1 = rest(form);
        var bindingsø1 = first(expressionsø1);
        var bodyø1 = rest(expressionsø1);
        var isValidBindingsø1 = isVector(bindingsø1) && isEven(count(bindingsø1));
        var _ø1 = !isValidBindingsø1 ? (function () {
            throw Error('' + 'Assert failed: ' + 'bindings must be vector of even number of elements' + 'valid-bindings?');
        })() : null;
        var scopeø1 = reduce(function ($1, $2) {
            return withBinding($1, analyzeBinding($1, $2));
        }, subEnv(env), partition(2, bindingsø1));
        var bindingsø2 = (scopeø1 || 0)['bindings'];
        var expressionsø2 = analyzeBlock(isLoop ? conj(scopeø1, { 'params': bindingsø2 }) : scopeø1, bodyø1);
        return {
            'op': 'let',
            'form': form,
            'start': (meta(form) || 0)['start'],
            'end': (meta(form) || 0)['end'],
            'bindings': bindingsø2,
            'statements': (expressionsø2 || 0)['statements'],
            'result': (expressionsø2 || 0)['result']
        };
    }.call(this);
};
var analyzeLet = exports.analyzeLet = function analyzeLet(env, form) {
    return analyzeLet_(env, form, false);
};
installSpecial('let**', analyzeLet);
var analyzeLoop = exports.analyzeLoop = function analyzeLoop(env, form) {
    return conj(analyzeLet_(env, form, true), { 'op': 'loop' });
};
installSpecial('loop*', analyzeLoop);
var analyzeRecur = exports.analyzeRecur = function analyzeRecur(env, form) {
    return function () {
        var paramsø1 = (env || 0)['params'];
        var formsø1 = vec(map(function ($) {
            return analyze(env, $);
        }, rest(form)));
        return isEqual(count(paramsø1), count(formsø1)) ? {
            'op': 'recur',
            'form': form,
            'params': formsø1
        } : syntaxError('Recurs with wrong number of arguments', form);
    }.call(this);
};
installSpecial('recur', analyzeRecur);
var analyzeQuotedList = exports.analyzeQuotedList = function analyzeQuotedList(form) {
    return {
        'op': 'list',
        'items': map(analyzeQuoted, vec(form)),
        'form': form,
        'start': (meta(form) || 0)['start'],
        'end': (meta(form) || 0)['end']
    };
};
var analyzeQuotedVector = exports.analyzeQuotedVector = function analyzeQuotedVector(form) {
    return {
        'op': 'vector',
        'items': map(analyzeQuoted, form),
        'form': form,
        'start': (meta(form) || 0)['start'],
        'end': (meta(form) || 0)['end']
    };
};
var analyzeQuotedDictionary = exports.analyzeQuotedDictionary = function analyzeQuotedDictionary(form) {
    return function () {
        var namesø1 = vec(map(analyzeQuoted, keys(form)));
        var valuesø1 = vec(map(analyzeQuoted, vals(form)));
        return {
            'op': 'dictionary',
            'form': form,
            'keys': namesø1,
            'values': valuesø1,
            'start': (meta(form) || 0)['start'],
            'end': (meta(form) || 0)['end']
        };
    }.call(this);
};
var analyzeQuotedSymbol = exports.analyzeQuotedSymbol = function analyzeQuotedSymbol(form) {
    return {
        'op': 'symbol',
        'name': name(form),
        'namespace': namespace(form),
        'form': form
    };
};
var analyzeQuotedKeyword = exports.analyzeQuotedKeyword = function analyzeQuotedKeyword(form) {
    return {
        'op': 'keyword',
        'name': name(form),
        'namespace': namespace(form),
        'form': form
    };
};
var analyzeQuoted = exports.analyzeQuoted = function analyzeQuoted(form) {
    return isSymbol(form) ? (function () {
        return analyzeQuotedSymbol(form);
    })() : isKeyword(form) ? (function () {
        return analyzeQuotedKeyword(form);
    })() : isList(form) ? (function () {
        return analyzeQuotedList(form);
    })() : isVector(form) ? (function () {
        return analyzeQuotedVector(form);
    })() : isDictionary(form) ? (function () {
        return analyzeQuotedDictionary(form);
    })() : (function () {
        return {
            'op': 'constant',
            'form': form
        };
    })();
};
var analyzeQuote = exports.analyzeQuote = function analyzeQuote(env, form) {
    return analyzeQuoted(second(form));
};
installSpecial('quote', analyzeQuote);
var analyzeStatement = exports.analyzeStatement = function analyzeStatement(env, form) {
    return function () {
        var statementsø1 = (env || 0)['statements'] || [];
        var bindingsø1 = (env || 0)['bindings'] || [];
        var statementø1 = analyze(conj(env, { 'statements': null }), form);
        var opø1 = (statementø1 || 0)['op'];
        var defsø1 = isEqual(opø1, 'def') ? (function () {
            return [(statementø1 || 0)['var']];
        })() : (function () {
            return null;
        })();
        return conj(env, {
            'statements': conj(statementsø1, statementø1),
            'bindings': concat(bindingsø1, defsø1)
        });
    }.call(this);
};
var analyzeBlock = exports.analyzeBlock = function analyzeBlock(env, form) {
    return function () {
        var bodyø1 = count(form) > 1 ? reduce(analyzeStatement, env, butlast(form)) : null;
        var resultø1 = analyze(bodyø1 || env, last(form));
        return {
            'statements': (bodyø1 || 0)['statements'],
            'result': resultø1
        };
    }.call(this);
};
var analyzeFnMethod = exports.analyzeFnMethod = function analyzeFnMethod(env, form) {
    return function () {
        var signatureø1 = isList(form) && isVector(first(form)) ? first(form) : syntaxError('Malformed fn overload form', form);
        var bodyø1 = rest(form);
        var variadicø1 = some(function ($) {
            return isEqual(symbol(null, '&'), $);
        }, signatureø1);
        var paramsø1 = variadicø1 ? filter(function ($) {
            return !isEqual(symbol(null, '&'), $);
        }, signatureø1) : signatureø1;
        var arityø1 = variadicø1 ? dec(count(paramsø1)) : count(paramsø1);
        var scopeø1 = reduce(function ($1, $2) {
            return withParam($1, analyzeParam($1, $2));
        }, conj(env, { 'params': [] }), paramsø1);
        return conj(analyzeBlock(scopeø1, bodyø1), {
            'op': 'overload',
            'variadic': variadicø1,
            'arity': arityø1,
            'params': (scopeø1 || 0)['params'],
            'form': form
        });
    }.call(this);
};
var analyzeFn = exports.analyzeFn = function analyzeFn(env, form) {
    return function () {
        var formsø1 = rest(form);
        var formsø2 = isSymbol(first(formsø1)) ? formsø1 : cons(null, formsø1);
        var idø1 = first(formsø2);
        var bindingø1 = idø1 ? analyzeSpecial(analyzeDeclaration, env, idø1) : null;
        var bodyø1 = rest(formsø2);
        var overloadsø1 = isVector(first(bodyø1)) ? (function () {
            return list(bodyø1);
        })() : isList(first(bodyø1)) && isVector(first(first(bodyø1))) ? (function () {
            return bodyø1;
        })() : (function () {
            return syntaxError('' + 'Malformed fn expression, ' + 'parameter declaration (' + prStr(first(bodyø1)) + ') must be a vector', form);
        })();
        var scopeø1 = bindingø1 ? withBinding(subEnv(env), bindingø1) : subEnv(env);
        var arrowø1 = isEqual((meta(form) || 0)['arrow'], true);
        var asyncø1 = isEqual((meta(form) || 0)['async'], true);
        var scopeø2 = conj(scopeø1, {
            'arrow': arrowø1,
            'async': asyncø1
        });
        var methodsø1 = map(function ($) {
            return analyzeFnMethod(scopeø2, $);
        }, vec(overloadsø1));
        var arityø1 = max.apply(null, map(function ($) {
            return ($ || 0)['arity'];
        }, methodsø1));
        var variadicø1 = some(function ($) {
            return ($ || 0)['variadic'];
        }, methodsø1);
        arrowø1 && count(methodsø1) > 1 ? syntaxError('lambda* does not support arity overloading', form) : null;
        return {
            'op': 'fn',
            'type': 'function',
            'arrow': arrowø1 ? true : null,
            'async': asyncø1 ? true : null,
            'id': bindingø1,
            'variadic': variadicø1,
            'methods': methodsø1,
            'form': form
        };
    }.call(this);
};
installSpecial('fn*', analyzeFn);
var analyzeAsync = exports.analyzeAsync = function analyzeAsync(env, form) {
    return function () {
        var innerø1 = macroexpand(second(form), env);
        return !isList(innerø1) || isEmpty(innerø1) || !(name(first(innerø1)) === 'fn*') ? syntaxError('async expects a function form, e.g. (async (lambda (x) ...))', form) : analyze(env, withMeta(innerø1, conj(meta(innerø1) || {}, { 'async': true })));
    }.call(this);
};
installSpecial('async', analyzeAsync);
var analyzeAwait = exports.analyzeAwait = function analyzeAwait(env, form) {
    !(env || 0)['async'] ? syntaxError('await outside of an async function', form) : null;
    return function () {
        var expressionsø1 = rest(form);
        !(count(expressionsø1) === 1) ? syntaxError('Malformed await expression, expecting (await expr)', form) : null;
        return {
            'op': 'await',
            'form': form,
            'argument': analyze(env, first(expressionsø1))
        };
    }.call(this);
};
installSpecial('await', analyzeAwait);
var parseReferences = exports.parseReferences = function parseReferences(forms) {
    return reduce(function (references, form) {
        return isSeq(form) ? assoc(references, name(first(form)), vec(rest(form))) : references;
    }, {}, forms);
};
var parseRequire = exports.parseRequire = function parseRequire(form) {
    return function () {
        var requirementø1 = isSymbol(form) ? [form] : vec(form);
        var idø1 = first(requirementø1);
        var paramsø1 = dictionary.apply(null, rest(requirementø1));
        var renamesø1 = (paramsø1 || 0)['\uA789rename'];
        var namesø1 = (paramsø1 || 0)['\uA789refer'];
        var aliasø1 = (paramsø1 || 0)['\uA789as'];
        var referencesø1 = !isEmpty(namesø1) ? reduce(function (refers, reference) {
            return conj(refers, {
                'op': 'refer',
                'form': reference,
                'name': reference,
                'rename': (renamesø1 || 0)[reference] || (renamesø1 || 0)[name(reference)],
                'ns': idø1
            });
        }, [], namesø1) : null;
        return {
            'op': 'require',
            'alias': aliasø1,
            'ns': idø1,
            'refer': referencesø1,
            'form': form
        };
    }.call(this);
};
var analyzeNs = exports.analyzeNs = function analyzeNs(env, form) {
    return function () {
        var formsø1 = rest(form);
        var nameø1 = first(formsø1);
        var bodyø1 = rest(formsø1);
        var docø1 = isString(first(bodyø1)) ? first(bodyø1) : null;
        var referencesø1 = parseReferences(docø1 ? rest(bodyø1) : bodyø1);
        var requirementsø1 = (referencesø1 || 0)['require'] ? map(parseRequire, (referencesø1 || 0)['require']) : null;
        return {
            'op': 'ns',
            'name': nameø1,
            'doc': docø1,
            'require': requirementsø1 ? vec(requirementsø1) : null,
            'form': form
        };
    }.call(this);
};
installSpecial('ns', analyzeNs);
var analyzeList = exports.analyzeList = function analyzeList(env, form) {
    return function () {
        var expansionø1 = macroexpand(form, env);
        var operatorø1 = first(form);
        var analyzerø1 = isSymbol(operatorø1) && (__specials__ || 0)[name(operatorø1)];
        return !(expansionø1 === form) ? (function () {
            return analyze(env, expansionø1);
        })() : analyzerø1 ? (function () {
            return analyzeSpecial(analyzerø1, env, expansionø1);
        })() : (function () {
            return analyzeInvoke(env, expansionø1);
        })();
    }.call(this);
};
var analyzeVector = exports.analyzeVector = function analyzeVector(env, form) {
    return function () {
        var itemsø1 = vec(map(function ($) {
            return analyze(env, $);
        }, form));
        return {
            'op': 'vector',
            'form': form,
            'items': itemsø1
        };
    }.call(this);
};
var analyzeDictionary = exports.analyzeDictionary = function analyzeDictionary(env, form) {
    return function () {
        var namesø1 = vec(map(function ($) {
            return analyze(env, $);
        }, keys(form)));
        var valuesø1 = vec(map(function ($) {
            return analyze(env, $);
        }, vals(form)));
        return {
            'op': 'dictionary',
            'keys': namesø1,
            'values': valuesø1,
            'form': form
        };
    }.call(this);
};
var analyzeInvoke = exports.analyzeInvoke = function analyzeInvoke(env, form) {
    return function () {
        var calleeø1 = analyze(env, first(form));
        var paramsø1 = vec(map(function ($) {
            return analyze(env, $);
        }, rest(form)));
        return {
            'op': 'invoke',
            'callee': calleeø1,
            'params': paramsø1,
            'form': form
        };
    }.call(this);
};
var analyzeConstant = exports.analyzeConstant = function analyzeConstant(env, form) {
    return {
        'op': 'constant',
        'form': form
    };
};
var analyze = exports.analyze = function analyze() {
    var args = Array.prototype.slice.call(arguments, 0);
    return count(args) === 1 ? analyze({
        'locals': {},
        'bindings': [],
        'top': true
    }, first(args)) : function () {
        var envø1 = first(args);
        var formø1 = second(args);
        return isNil(formø1) ? (function () {
            return analyzeConstant(envø1, formø1);
        })() : isSymbol(formø1) ? (function () {
            return analyzeSymbol(envø1, formø1);
        })() : isList(formø1) ? (function () {
            return isEmpty(formø1) ? analyzeQuoted(formø1) : analyzeList(envø1, formø1);
        })() : isDictionary(formø1) ? (function () {
            return analyzeDictionary(envø1, formø1);
        })() : isVector(formø1) ? (function () {
            return analyzeVector(envø1, formø1);
        })() : isKeyword(formø1) ? (function () {
            return analyzeKeyword(envø1, formø1);
        })() : (function () {
            return analyzeConstant(envø1, formø1);
        })();
    }.call(this);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndpc3AvYW5hbHl6ZXIud2lzcCJdLCJuYW1lcyI6WyJfbnNfIiwiaWQiLCJkb2MiLCJtZXRhIiwid2l0aE1ldGEiLCJpc1N5bWJvbCIsImlzS2V5d29yZCIsImlzUXVvdGUiLCJzeW1ib2wiLCJuYW1lc3BhY2UiLCJuYW1lIiwicHJTdHIiLCJpc1VucXVvdGUiLCJpc1VucXVvdGVTcGxpY2luZyIsImlzTGlzdCIsImxpc3QiLCJjb25qIiwicGFydGl0aW9uIiwic2VxIiwiaXNFbXB0eSIsIm1hcCIsInZlYyIsImlzRXZlcnkiLCJjb25jYXQiLCJmaXJzdCIsInNlY29uZCIsInRoaXJkIiwicmVzdCIsImxhc3QiLCJidXRsYXN0IiwiaW50ZXJsZWF2ZSIsImNvbnMiLCJjb3VudCIsInNvbWUiLCJhc3NvYyIsInJlZHVjZSIsImZpbHRlciIsImlzU2VxIiwiZHJvcCIsImlzTmlsIiwiaXNEaWN0aW9uYXJ5IiwiaXNWZWN0b3IiLCJrZXlzIiwidmFscyIsImlzU3RyaW5nIiwiaXNOdW1iZXIiLCJpc0Jvb2xlYW4iLCJpc0RhdGUiLCJpc1JlUGF0dGVybiIsImlzRXZlbiIsImlzRXF1YWwiLCJtYXgiLCJkZWMiLCJkaWN0aW9uYXJ5Iiwic3VicyIsImluYyIsIm1hY3JvZXhwYW5kIiwic3BsaXQiLCJqb2luIiwic3ludGF4RXJyb3IiLCJleHBvcnRzIiwibWVzc2FnZSIsImZvcm0iLCJtZXRhZGF0YcO4MSIsImxpbmXDuDEiLCJ1cmnDuDEiLCJjb2x1bW7DuDEiLCJlcnJvcsO4MSIsIlN5bnRheEVycm9yIiwibGluZU51bWJlciIsImxpbmUiLCJjb2x1bW5OdW1iZXIiLCJjb2x1bW4iLCJmaWxlTmFtZSIsInVyaSIsImFuYWx5emVLZXl3b3JkIiwiZW52IiwiX19zcGVjaWFsc19fIiwiaW5zdGFsbFNwZWNpYWwiLCJvcCIsImFuYWx5emVyIiwiYW5hbHl6ZVNwZWNpYWwiLCJhc3TDuDEiLCJhbmFseXplSWYiLCJmb3Jtc8O4MSIsImVsc2VUYWlsw7gxIiwiZWxzZUZvcm3DuDEiLCJ0ZXN0w7gxIiwiYW5hbHl6ZSIsImNvbnNlcXVlbnTDuDEiLCJhbHRlcm5hdGXDuDEiLCJhbmFseXplVGhyb3ciLCJleHByZXNzaW9uw7gxIiwiYW5hbHl6ZVRyeSIsInRhaWzDuDEiLCJmaW5hbGl6ZXJGb3Jtw7gxIiwiZmluYWxpemVyw7gxIiwiYW5hbHl6ZUJsb2NrIiwiYm9keUZvcm3DuDEiLCJ0YWlsw7gyIiwiaGFuZGxlckZvcm3DuDEiLCJoYW5kbGVyw7gxIiwiYm9kecO4MSIsInN1YkVudiIsImFuYWx5emVTZXQiLCJsZWZ0w7gxIiwicmlnaHTDuDEiLCJ0YXJnZXTDuDEiLCJhbmFseXplU3ltYm9sIiwiYW5hbHl6ZUxpc3QiLCJ2YWx1ZcO4MSIsImFuYWx5emVOZXciLCJjb25zdHJ1Y3RvcsO4MSIsInBhcmFtc8O4MSIsIiQiLCJhbmFseXplQWdldCIsImF0dHJpYnV0ZcO4MSIsImZpZWxkw7gxIiwiYW5hbHl6ZUlkZW50aWZpZXIiLCJwYXJzZURlZiIsImFyZ3MiLCJhbmFseXplRGVmIiwib3DDuDEiLCJwcml2YXRlw7gxIiwiaWTDuDEiLCJiaW5kaW5nw7gxIiwiYW5hbHl6ZURlY2xhcmF0aW9uIiwiaW5pdMO4MSIsImRvY8O4MSIsImFuYWx5emVEbyIsImV4cHJlc3Npb25zw7gxIiwiY2hlY2tBcnJvd1Jlc3RyaWN0aW9uIiwicmVzb2x2ZUJpbmRpbmciLCJzdGFydMO4MSIsImVuZMO4MSIsImV4cGFuc2lvbsO4MSIsInVucmVzb2x2ZWRCaW5kaW5nIiwiYW5hbHl6ZVNoYWRvdyIsImFuYWx5emVCaW5kaW5nIiwiYW5hbHl6ZVBhcmFtIiwid2l0aEJpbmRpbmciLCJ3aXRoUGFyYW0iLCJhbmFseXplTGV0XyIsImlzTG9vcCIsImJpbmRpbmdzw7gxIiwiaXNWYWxpZEJpbmRpbmdzw7gxIiwiX8O4MSIsInNjb3Blw7gxIiwiJDEiLCIkMiIsImJpbmRpbmdzw7gyIiwiZXhwcmVzc2lvbnPDuDIiLCJhbmFseXplTGV0IiwiYW5hbHl6ZUxvb3AiLCJhbmFseXplUmVjdXIiLCJhbmFseXplUXVvdGVkTGlzdCIsImFuYWx5emVRdW90ZWQiLCJhbmFseXplUXVvdGVkVmVjdG9yIiwiYW5hbHl6ZVF1b3RlZERpY3Rpb25hcnkiLCJuYW1lc8O4MSIsInZhbHVlc8O4MSIsImFuYWx5emVRdW90ZWRTeW1ib2wiLCJhbmFseXplUXVvdGVkS2V5d29yZCIsImFuYWx5emVRdW90ZSIsImFuYWx5emVTdGF0ZW1lbnQiLCJzdGF0ZW1lbnRzw7gxIiwic3RhdGVtZW50w7gxIiwiZGVmc8O4MSIsInJlc3VsdMO4MSIsImFuYWx5emVGbk1ldGhvZCIsInNpZ25hdHVyZcO4MSIsInZhcmlhZGljw7gxIiwiYXJpdHnDuDEiLCJhbmFseXplRm4iLCJmb3Jtc8O4MiIsIm92ZXJsb2Fkc8O4MSIsImFycm93w7gxIiwiYXN5bmPDuDEiLCJzY29wZcO4MiIsIm1ldGhvZHPDuDEiLCJhbmFseXplQXN5bmMiLCJpbm5lcsO4MSIsImFuYWx5emVBd2FpdCIsInBhcnNlUmVmZXJlbmNlcyIsImZvcm1zIiwicmVmZXJlbmNlcyIsInBhcnNlUmVxdWlyZSIsInJlcXVpcmVtZW50w7gxIiwicmVuYW1lc8O4MSIsImFsaWFzw7gxIiwicmVmZXJlbmNlc8O4MSIsInJlZmVycyIsInJlZmVyZW5jZSIsImFuYWx5emVOcyIsIm5hbWXDuDEiLCJyZXF1aXJlbWVudHPDuDEiLCJvcGVyYXRvcsO4MSIsImFuYWx5emVyw7gxIiwiYW5hbHl6ZUludm9rZSIsImFuYWx5emVWZWN0b3IiLCJpdGVtc8O4MSIsImFuYWx5emVEaWN0aW9uYXJ5IiwiY2FsbGVlw7gxIiwiYW5hbHl6ZUNvbnN0YW50IiwiZW52w7gxIiwiZm9ybcO4MSJdLCJtYXBwaW5ncyI6IjtJQUFBLElBQUNBLEksR0FBRDtBQUFBLFFBQUFDLEUsRUFBSSxlQUFKO0FBQUEsUUFBQUMsRyxFQUFBO0FBQUEsTTs7UUFDOEJDLElBQUEsRyxTQUFBQSxJO1FBQUtDLFFBQUEsRyxTQUFBQSxRO1FBQVVDLFFBQUEsRyxTQUFBQSxRO1FBQVFDLFNBQUEsRyxTQUFBQSxT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O0FBQUEsUyxDQUFBLEUsZ0JBQ1g7QUFBQSxtQkFBQ0YsZUFBRCxDQUFrQkMsS0FBbEIsRUFBc0JDLE1BQXRCO0FBQUEsUyxDQUFBLEVBVFosQ0FETTtBQUFBLEssS0FBUixDLElBQUEsQ0FKRixDO0NBbkJGIiwic291cmNlc0NvbnRlbnQiOlsiKG5zIHdpc3AuYW5hbHl6ZXJcbiAgKDpyZXF1aXJlIFt3aXNwLmFzdCA6cmVmZXIgW21ldGEgd2l0aC1tZXRhIHN5bWJvbD8ga2V5d29yZD9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1b3RlPyBzeW1ib2wgbmFtZXNwYWNlIG5hbWUgcHItc3RyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bnF1b3RlPyB1bnF1b3RlLXNwbGljaW5nP11dXG4gICAgICAgICAgICBbd2lzcC5zZXF1ZW5jZSA6cmVmZXIgW2xpc3Q/IGxpc3QgY29uaiBwYXJ0aXRpb24gc2VxXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVtcHR5PyBtYXAgdmVjIGV2ZXJ5PyBjb25jYXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3Qgc2Vjb25kIHRoaXJkIHJlc3QgbGFzdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidXRsYXN0IGludGVybGVhdmUgY29ucyBjb3VudFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb21lIGFzc29jIHJlZHVjZSBmaWx0ZXIgc2VxPyBkcm9wXV1cbiAgICAgICAgICAgIFt3aXNwLnJ1bnRpbWUgOnJlZmVyIFtuaWw/IGRpY3Rpb25hcnk/IHZlY3Rvcj8ga2V5c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHMgc3RyaW5nPyBudW1iZXI/IGJvb2xlYW4/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZT8gcmUtcGF0dGVybj8gZXZlbj8gPSBtYXhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWMgZGljdGlvbmFyeSBzdWJzIGluYyBkZWNdXVxuICAgICAgICAgICAgW3dpc3AuZXhwYW5kZXIgOnJlZmVyIFttYWNyb2V4cGFuZF1dXG4gICAgICAgICAgICBbd2lzcC5zdHJpbmcgOnJlZmVyIFtzcGxpdCBqb2luXV0pKVxuXG4oZGVmdW4gc3ludGF4LWVycm9yXG4gIChtZXNzYWdlIGZvcm0pXG4gIChsZXQqICgobWV0YWRhdGEgKG1ldGEgZm9ybSkpXG4gICAgICAgIChsaW5lICg6bGluZSAoOnN0YXJ0IG1ldGFkYXRhKSkpXG4gICAgICAgICh1cmkgKDp1cmkgbWV0YWRhdGEpKVxuICAgICAgICAoY29sdW1uICg6Y29sdW1uICg6c3RhcnQgbWV0YWRhdGEpKSlcbiAgICAgICAgKGVycm9yIChTeW50YXhFcnJvciAoc3RyIG1lc3NhZ2UgXCJcXG5cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkZvcm06IFwiIChwci1zdHIgZm9ybSkgXCJcXG5cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlVSSTogXCIgdXJpIFwiXFxuXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJMaW5lOiBcIiBsaW5lIFwiXFxuXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2x1bW46IFwiIGNvbHVtbikpKSlcbiAgICAoc2V0ZiBlcnJvci5saW5lTnVtYmVyIGxpbmUpXG4gICAgKHNldGYgZXJyb3IubGluZSBsaW5lKVxuICAgIChzZXRmIGVycm9yLmNvbHVtbk51bWJlciBjb2x1bW4pXG4gICAgKHNldGYgZXJyb3IuY29sdW1uIGNvbHVtbilcbiAgICAoc2V0ZiBlcnJvci5maWxlTmFtZSB1cmkpXG4gICAgKHNldGYgZXJyb3IudXJpIHVyaSlcbiAgICAodGhyb3cgZXJyb3IpKSlcblxuXG4oZGVmdW4gYW5hbHl6ZS1rZXl3b3JkXG4gIChlbnYgZm9ybSlcbiAgXCJFeGFtcGxlOlxuICAoYW5hbHl6ZS1rZXl3b3JkIHt9IDpmb28pID0+IHs6b3AgOmNvbnN0YW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtICc6Zm9vXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDplbnYge319XCJcbiAgezpvcCA6Y29uc3RhbnRcbiAgIDpmb3JtIGZvcm19KVxuXG4oZGVmdmFyICoqc3BlY2lhbHMqKiB7fSlcblxuKGRlZnVuIGluc3RhbGwtc3BlY2lhbCFcbiAgKG9wIGFuYWx5emVyKVxuICAoc2V0ZiAoZ2V0ICoqc3BlY2lhbHMqKiAobmFtZSBvcCkpIGFuYWx5emVyKSlcblxuKGRlZnVuIGFuYWx5emUtc3BlY2lhbFxuICAoYW5hbHl6ZXIgZW52IGZvcm0pXG4gIChsZXQqICgobWV0YWRhdGEgKG1ldGEgZm9ybSkpXG4gICAgICAgIChhc3QgKGFuYWx5emVyIGVudiBmb3JtKSkpXG4gICAgKGNvbmogezpzdGFydCAoOnN0YXJ0IG1ldGFkYXRhKVxuICAgICAgICAgICA6ZW5kICg6ZW5kIG1ldGFkYXRhKX1cbiAgICAgICAgICBhc3QpKSlcblxuKGRlZnVuIGFuYWx5emUtaWZcbiAgKGVudiBmb3JtKVxuICBcIkV4YW1wbGU6XG4gIChhbmFseXplLWlmIHt9ICcoaWYgbW9uZGF5PyA6eWVwIDpub3BlKSkgPT4gezpvcCA6aWZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gJyhpZiBtb25kYXk/IDp5ZXAgOm5vcGUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDplbnYge31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnRlc3QgezpvcCA6dmFyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Zm9ybSAnbW9uZGF5P1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmluZm8gbmlsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ZW52IHt9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Y29uc2VxdWVudCB7Om9wIDpjb25zdGFudFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gJzp5ZXBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDp0eXBlIDprZXl3b3JkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ZW52IHt9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6YWx0ZXJuYXRlIHs6b3AgOmNvbnN0YW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtICc6bm9wZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6dHlwZSA6a2V5d29yZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ZW52IHt9fX1cIlxuICAobGV0KiAoKGZvcm1zIChyZXN0IGZvcm0pKVxuICAgICAgICA7OyBFbWFjcy1MaXNwIHNoYXBlOiB0aGUgZWxzZSBUQUlMIChldmVyeXRoaW5nIGFmdGVyIHRoZVxuICAgICAgICA7OyBjb25zZXF1ZW50KSBpcyBhbiBpbXBsaWNpdCBgcHJvZ25gLCBub3QganVzdCBhIHNpbmdsZSBmb3JtLlxuICAgICAgICAoZWxzZS10YWlsIChkcm9wIDIgZm9ybXMpKVxuICAgICAgICAoZWxzZS1mb3JtIChjb25kICgoZW1wdHk/IGVsc2UtdGFpbCkgbmlsKVxuICAgICAgICAgICAgICAgICAgICAgICAgKChpZGVudGljYWw/IChjb3VudCBlbHNlLXRhaWwpIDEpIChmaXJzdCBlbHNlLXRhaWwpKVxuICAgICAgICAgICAgICAgICAgICAgICAgKGVsc2UgKGNvbnMgJ3Byb2duIGVsc2UtdGFpbCkpKSlcbiAgICAgICAgKHRlc3QgKGFuYWx5emUgZW52IChmaXJzdCBmb3JtcykpKVxuICAgICAgICAoY29uc2VxdWVudCAoYW5hbHl6ZSBlbnYgKHNlY29uZCBmb3JtcykpKVxuICAgICAgICAoYWx0ZXJuYXRlIChhbmFseXplIGVudiBlbHNlLWZvcm0pKSlcbiAgICAoaWYgKDwgKGNvdW50IGZvcm1zKSAyKVxuICAgICAgKHN5bnRheC1lcnJvciBcIk1hbGZvcm1lZCBpZiBleHByZXNzaW9uLCB0b28gZmV3IG9wZXJhbmRzXCIgZm9ybSkpXG4gICAgezpvcCA6aWZcbiAgICAgOmZvcm0gZm9ybVxuICAgICA6dGVzdCB0ZXN0XG4gICAgIDpjb25zZXF1ZW50IGNvbnNlcXVlbnRcbiAgICAgOmFsdGVybmF0ZSBhbHRlcm5hdGV9KSlcblxuKGluc3RhbGwtc3BlY2lhbCEgOmlmIGFuYWx5emUtaWYpXG5cbihkZWZ1biBhbmFseXplLXRocm93XG4gIChlbnYgZm9ybSlcbiAgXCJFeGFtcGxlOlxuICAoYW5hbHl6ZS10aHJvdyB7fSAnKHRocm93IChFcnJvciA6Ym9vbSkpKSA9PiB7Om9wIDp0aHJvd1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gJyh0aHJvdyAoRXJyb3IgOmJvb20pKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnRocm93IHs6b3AgOmludm9rZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Y2FsbGVlIHs6b3AgOnZhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Zm9ybSAnRXJyb3JcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmluZm8gbmlsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDplbnYge319XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpwYXJhbXMgW3s6b3AgOmNvbnN0YW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6dHlwZSA6a2V5d29yZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gJzpib29tXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ZW52IHt9fV19fVwiXG4gIChsZXQqICgoZXhwcmVzc2lvbiAoYW5hbHl6ZSBlbnYgKHNlY29uZCBmb3JtKSkpKVxuICAgIHs6b3AgOnRocm93XG4gICAgIDpmb3JtIGZvcm1cbiAgICAgOnRocm93IGV4cHJlc3Npb259KSlcblxuKGluc3RhbGwtc3BlY2lhbCEgOnRocm93IGFuYWx5emUtdGhyb3cpXG5cbihkZWZ1biBhbmFseXplLXRyeVxuICAoZW52IGZvcm0pXG4gIChsZXQqICgoZm9ybXMgKHZlYyAocmVzdCBmb3JtKSkpXG5cbiAgICAgICAgOzsgRmluYWxseVxuICAgICAgICAodGFpbCAobGFzdCBmb3JtcykpXG4gICAgICAgIChmaW5hbGl6ZXItZm9ybSAoaWYgKGFuZCAobGlzdD8gdGFpbClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKD0gJ2ZpbmFsbHkgKGZpcnN0IHRhaWwpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAocmVzdCB0YWlsKSkpXG4gICAgICAgIChmaW5hbGl6ZXIgKGlmIGZpbmFsaXplci1mb3JtXG4gICAgICAgICAgICAgICAgICAgIChhbmFseXplLWJsb2NrIGVudiBmaW5hbGl6ZXItZm9ybSkpKVxuXG4gICAgICAgIDs7IGNhdGNoXG4gICAgICAgIChib2R5LWZvcm0gKGlmIGZpbmFsaXplclxuICAgICAgICAgICAgICAgICAgICAoYnV0bGFzdCBmb3JtcylcbiAgICAgICAgICAgICAgICAgICAgZm9ybXMpKVxuXG4gICAgICAgICh0YWlsIChsYXN0IGJvZHktZm9ybSkpXG4gICAgICAgIChoYW5kbGVyLWZvcm0gKGlmIChhbmQgKGxpc3Q/IHRhaWwpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoPSAnY2F0Y2ggKGZpcnN0IHRhaWwpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgKHJlc3QgdGFpbCkpKVxuICAgICAgICAoaGFuZGxlciAoaWYgaGFuZGxlci1mb3JtXG4gICAgICAgICAgICAgICAgICAoY29uaiB7Om5hbWUgKGFuYWx5emUgZW52IChmaXJzdCBoYW5kbGVyLWZvcm0pKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIChhbmFseXplLWJsb2NrIGVudiAocmVzdCBoYW5kbGVyLWZvcm0pKSkpKVxuXG4gICAgICAgIDs7IFRyeVxuICAgICAgICAoYm9keSAoaWYgaGFuZGxlci1mb3JtXG4gICAgICAgICAgICAgICAoYW5hbHl6ZS1ibG9jayAoc3ViLWVudiBlbnYpIChidXRsYXN0IGJvZHktZm9ybSkpXG4gICAgICAgICAgICAgICAoYW5hbHl6ZS1ibG9jayAoc3ViLWVudiBlbnYpIGJvZHktZm9ybSkpKSlcbiAgICB7Om9wIDp0cnlcbiAgICAgOmZvcm0gZm9ybVxuICAgICA6Ym9keSBib2R5XG4gICAgIDpoYW5kbGVyIGhhbmRsZXJcbiAgICAgOmZpbmFsaXplciBmaW5hbGl6ZXJ9KSlcblxuKGluc3RhbGwtc3BlY2lhbCEgOnRyeSBhbmFseXplLXRyeSlcblxuKGRlZnVuIGFuYWx5emUtc2V0IVxuICAoZW52IGZvcm0pXG4gIChsZXQqICgoYm9keSAocmVzdCBmb3JtKSlcbiAgICAgICAgKGxlZnQgKGZpcnN0IGJvZHkpKVxuICAgICAgICAocmlnaHQgKHNlY29uZCBib2R5KSlcbiAgICAgICAgKHRhcmdldCAoY29uZCAoKHN5bWJvbD8gbGVmdCkgKGFuYWx5emUtc3ltYm9sIGVudiBsZWZ0KSlcbiAgICAgICAgICAgICAgICAgICAgICgobGlzdD8gbGVmdCkgKGFuYWx5emUtbGlzdCBlbnYgbGVmdCkpXG4gICAgICAgICAgICAgICAgICAgICAoZWxzZSBsZWZ0KSkpXG4gICAgICAgICh2YWx1ZSAoYW5hbHl6ZSBlbnYgcmlnaHQpKSlcbiAgICB7Om9wIDpzZXQhXG4gICAgIDp0YXJnZXQgdGFyZ2V0XG4gICAgIDp2YWx1ZSB2YWx1ZVxuICAgICA6Zm9ybSBmb3JtfSkpXG4oaW5zdGFsbC1zcGVjaWFsISA6c2V0ISBhbmFseXplLXNldCEpXG5cbihkZWZ1biBhbmFseXplLW5ld1xuICAoZW52IGZvcm0pXG4gIChsZXQqICgoYm9keSAocmVzdCBmb3JtKSlcbiAgICAgICAgKGNvbnN0cnVjdG9yIChhbmFseXplIGVudiAoZmlyc3QgYm9keSkpKVxuICAgICAgICAocGFyYW1zICh2ZWMgKG1hcCAobGFtYmRhICglKSAoYW5hbHl6ZSBlbnYgJSkpIChyZXN0IGJvZHkpKSkpKVxuICAgIHs6b3AgOm5ld1xuICAgICA6Y29uc3RydWN0b3IgY29uc3RydWN0b3JcbiAgICAgOmZvcm0gZm9ybVxuICAgICA6cGFyYW1zIHBhcmFtc30pKVxuKGluc3RhbGwtc3BlY2lhbCEgOm5ldyBhbmFseXplLW5ldylcblxuKGRlZnVuIGFuYWx5emUtYWdldFxuICAoZW52IGZvcm0pXG4gIChsZXQqICgoYm9keSAocmVzdCBmb3JtKSlcbiAgICAgICAgKHRhcmdldCAoYW5hbHl6ZSBlbnYgKGZpcnN0IGJvZHkpKSlcbiAgICAgICAgKGF0dHJpYnV0ZSAoc2Vjb25kIGJvZHkpKVxuICAgICAgICAoZmllbGQgKGFuZCAocXVvdGU/IGF0dHJpYnV0ZSlcbiAgICAgICAgICAgICAgICAgICAoc3ltYm9sPyAoc2Vjb25kIGF0dHJpYnV0ZSkpXG4gICAgICAgICAgICAgICAgICAgKHNlY29uZCBhdHRyaWJ1dGUpKSkpXG4gICAgKGlmIChuaWw/IGF0dHJpYnV0ZSlcbiAgICAgIChzeW50YXgtZXJyb3IgXCJNYWxmb3JtZWQgYWdldC9hcmVmIGV4cHJlc3Npb24gZXhwZWN0ZWQgKGFnZXQgb2JqZWN0IG1lbWJlcilcIlxuICAgICAgICAgICAgICAgICAgICBmb3JtKVxuICAgICAgezpvcCA6bWVtYmVyLWV4cHJlc3Npb25cbiAgICAgICA6Y29tcHV0ZWQgKG5vdCBmaWVsZClcbiAgICAgICA6Zm9ybSBmb3JtXG4gICAgICAgOnRhcmdldCB0YXJnZXRcbiAgICAgICA7OyBJZiBmaWVsZCBpcyBhIHF1b3RlZCBzeW1ib2wgdGhlcmUncyBubyBuZWVkIHRvIHJlc29sdmVcbiAgICAgICA7OyBpdCBmb3IgaW5mb1xuICAgICAgIDpwcm9wZXJ0eSAoaWYgZmllbGRcbiAgICAgICAgICAgICAgICAgICAoY29uaiAoYW5hbHl6ZS1zcGVjaWFsIGFuYWx5emUtaWRlbnRpZmllciBlbnYgZmllbGQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgezpiaW5kaW5nIG5pbH0pXG4gICAgICAgICAgICAgICAgICAgKGFuYWx5emUgZW52IGF0dHJpYnV0ZSkpfSkpKVxuKGluc3RhbGwtc3BlY2lhbCEgOmFnZXQgYW5hbHl6ZS1hZ2V0KVxuOzsgYGFyZWZgIGlzIHRoZSB0cmFkaXRpb25hbC1MaXNwIHNwZWxsaW5nIG9mIHRoZSBzYW1lIHBsYWNlIGFjY2Vzcztcbjs7IHRoZSBzcGVjIChkb2NzL2xhbmd1YWdlLm1kKSBkb2N1bWVudHMgKGFyZWYgb2JqIGtleSkgd2l0aCBgYWdldGAga2VwdFxuOzsgYXMgdGhlIGFsaWFzLlxuKGluc3RhbGwtc3BlY2lhbCEgOmFyZWYgYW5hbHl6ZS1hZ2V0KVxuXG4oZGVmdW4gcGFyc2UtZGVmXG4gIChpZCAmcmVzdCBhcmdzKVxuICAoY29uZCAoKGVtcHR5PyBhcmdzKSB7OmlkIGlkfSlcbiAgICAgICAgKChpZGVudGljYWw/IChjb3VudCBhcmdzKSAxKSB7OmlkIGlkIDppbml0IChmaXJzdCBhcmdzKX0pXG4gICAgICAgIChlbHNlIHs6aWQgaWQgOmRvYyAoZmlyc3QgYXJncykgOmluaXQgKHNlY29uZCBhcmdzKX0pKSlcblxuKGRlZnVuIGFuYWx5emUtZGVmXG4gIChlbnYgZm9ybSlcbiAgXCJCYWNrcyBgZGVmdmFyYC9gZGVmdmFyLWAvYGRlZmNvbnN0YC9gZGVmY29uc3QtYC4gUHJpdmFjeSAod2hldGhlciB0aGVcbiAgYmluZGluZyBsYW5kcyBvbiBgZXhwb3J0c2ApIGlzIGRlY2lkZWQgYnkgd2hpY2ggb2YgdGhvc2UgZm91ciBoZWFkXG4gIHN5bWJvbHMgd2FzIHVzZWQgLS0gYSB0cmFpbGluZyBgLWAgbWVhbnMgcHJpdmF0ZSAtLSByYXRoZXIgdGhhbiBieVxuICBgXjpwcml2YXRlYCByZWFkZXIgbWV0YWRhdGEsIHdoaWNoIG5ldy1zeW50YXggZHJvcHMgZW50aXJlbHkuXCJcbiAgKGxldCogKChvcCAobmFtZSAoZmlyc3QgZm9ybSkpKVxuICAgICAgICAocHJpdmF0ZSAob3IgKGlkZW50aWNhbD8gb3AgXCJkZWZ2YXItXCIpXG4gICAgICAgICAgICAgICAgICAgIChpZGVudGljYWw/IG9wIFwiZGVmY29uc3QtXCIpKSlcbiAgICAgICAgKHBhcmFtcyAoYXBwbHkgcGFyc2UtZGVmICh2ZWMgKHJlc3QgZm9ybSkpKSlcbiAgICAgICAgKGlkICg6aWQgcGFyYW1zKSlcbiAgICAgICAgKG1ldGFkYXRhIChtZXRhIGlkKSlcblxuICAgICAgICAoYmluZGluZyAoYW5hbHl6ZS1zcGVjaWFsIGFuYWx5emUtZGVjbGFyYXRpb24gZW52IGlkKSlcblxuICAgICAgICAoaW5pdCAoYW5hbHl6ZSBlbnYgKDppbml0IHBhcmFtcykpKVxuXG4gICAgICAgIChkb2MgKG9yICg6ZG9jIHBhcmFtcylcbiAgICAgICAgICAgICAgICAoOmRvYyBtZXRhZGF0YSkpKSlcbiAgICB7Om9wIDpkZWZcbiAgICAgOmRvYyBkb2NcbiAgICAgOmlkIGJpbmRpbmdcbiAgICAgOmluaXQgaW5pdFxuICAgICA6ZXhwb3J0IChhbmQgKDp0b3AgZW52KVxuICAgICAgICAgICAgICAgICAgKG5vdCBwcml2YXRlKSlcbiAgICAgOmZvcm0gZm9ybX0pKVxuKGluc3RhbGwtc3BlY2lhbCEgOmRlZnZhciBhbmFseXplLWRlZilcbihpbnN0YWxsLXNwZWNpYWwhIDpkZWZ2YXItIGFuYWx5emUtZGVmKVxuKGluc3RhbGwtc3BlY2lhbCEgOmRlZmNvbnN0IGFuYWx5emUtZGVmKVxuKGluc3RhbGwtc3BlY2lhbCEgOmRlZmNvbnN0LSBhbmFseXplLWRlZilcblxuKGRlZnVuIGFuYWx5emUtZG9cbiAgKGVudiBmb3JtKVxuICAobGV0KiAoKGV4cHJlc3Npb25zIChyZXN0IGZvcm0pKVxuICAgICAgICAoYm9keSAoYW5hbHl6ZS1ibG9jayBlbnYgZXhwcmVzc2lvbnMpKSlcbiAgICAoY29uaiBib2R5IHs6b3AgOmRvXG4gICAgICAgICAgICAgICAgOmZvcm0gZm9ybX0pKSlcbihpbnN0YWxsLXNwZWNpYWwhIDpwcm9nbiBhbmFseXplLWRvKVxuXG4oZGVmdW4gY2hlY2stYXJyb3ctcmVzdHJpY3Rpb25cbiAgKGVudiBmb3JtKVxuICBcImxhbWJkYSogKGFycm93KSBib2RpZXMgaGF2ZSBubyBvd24gYHRoaXNgIC8gYGFyZ3VtZW50c2AuIEFuXG4gIHVucmVzb2x2ZWQgYmFyZSByZWZlcmVuY2UgdG8gZWl0aGVyIGluc2lkZSBhbiBhcnJvdyB3b3VsZCBzaWxlbnRseVxuICBjYXB0dXJlIHRoZSBlbmNsb3Npbmcgc2NvcGUncyBiaW5kaW5nIChvciB0aHJvdyBhdCBydW50aW1lKSwgc28gaXRcbiAgaXMgcmVqZWN0ZWQgdXAgZnJvbnQuIEEgcmVmZXJlbmNlIHRoYXQgcmVzb2x2ZXMgdG8gYSByZWFsIGJpbmRpbmdcbiAgKGEgcGFyYW0gb3IgYW4gb3V0ZXIgbG9jYWwpIGlzIGxlZ2l0aW1hdGUgc2hhZG93aW5nIGFuZCBwYXNzZXMuXCJcbiAgKGlmIChhbmQgKDphcnJvdyBlbnYpXG4gICAgICAgICAob3IgKGlkZW50aWNhbD8gKG5hbWUgZm9ybSkgXCJ0aGlzXCIpXG4gICAgICAgICAgICAgKGlkZW50aWNhbD8gKG5hbWUgZm9ybSkgXCJhcmd1bWVudHNcIikpXG4gICAgICAgICAoPSA6dW5yZXNvbHZlZC1iaW5kaW5nICg6b3AgKHJlc29sdmUtYmluZGluZyBlbnYgZm9ybSkpKSlcbiAgICAoc3ludGF4LWVycm9yIChzdHIgXCJsYW1iZGEqIGJvZHkgbWF5IG5vdCByZWZlcmVuY2UgXCIgKG5hbWUgZm9ybSlcbiAgICAgICAgICAgICAgICAgICAgICAgXCIgLS0gYXJyb3dzIGhhdmUgbm8gb3duIHRoaXMvYXJndW1lbnRzXCIpIGZvcm0pKSlcblxuKGRlZnVuIGFuYWx5emUtc3ltYm9sXG4gIChlbnYgZm9ybSlcbiAgXCJTeW1ib2wgYW5hbHl6ZXIgYWxzbyBkb2VzIHN5bnRheCBkZXN1Z2FyaW5nIGZvciB0aGUgc3ltYm9sc1xuICBsaWtlIGZvby5iYXIuYmF6IHByb2R1Y2luZyAoYWdldCBmb28gJ2Jhci5iYXopIGZvcm0uIFRoaXMgZW5hYmxlc1xuICByZW5hbWluZyBvZiBzaGFkb3dlZCBzeW1ib2xzLlwiXG4gIChjaGVjay1hcnJvdy1yZXN0cmljdGlvbiBlbnYgZm9ybSlcbiAgKGxldCogKChmb3JtcyAoc3BsaXQgKG5hbWUgZm9ybSkgXFwuKSlcbiAgICAgICAgKG1ldGFkYXRhIChtZXRhIGZvcm0pKVxuICAgICAgICAoc3RhcnQgKDpzdGFydCBtZXRhZGF0YSkpXG4gICAgICAgIChlbmQgKDplbmQgbWV0YWRhdGEpKVxuICAgICAgICAoZXhwYW5zaW9uIChpZiAoPiAoY291bnQgZm9ybXMpIDEpXG4gICAgICAgICAgICAgICAgICAgKGxpc3QgJ2FnZXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAod2l0aC1tZXRhIChzeW1ib2wgKGZpcnN0IGZvcm1zKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIChjb25qIG1ldGFkYXRhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7OnN0YXJ0IHN0YXJ0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmVuZCB7OmxpbmUgKDpsaW5lIGVuZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Y29sdW1uICgrIDEgKDpjb2x1bW4gc3RhcnQpIChjb3VudCAoZmlyc3QgZm9ybXMpKSl9fSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgKGxpc3QgJ3F1b3RlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHdpdGgtbWV0YSAoc3ltYm9sIChqb2luIFxcLiAocmVzdCBmb3JtcykpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGNvbmogbWV0YWRhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHs6ZW5kIGVuZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpzdGFydCB7OmxpbmUgKDpsaW5lIHN0YXJ0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmNvbHVtbiAoKyAxICg6Y29sdW1uIHN0YXJ0KSAoY291bnQgKGZpcnN0IGZvcm1zKSkpfX0pKSkpKSkpXG4gICAgKGlmIGV4cGFuc2lvblxuICAgICAgKGFuYWx5emUgZW52ICh3aXRoLW1ldGEgZXhwYW5zaW9uIChtZXRhIGZvcm0pKSlcbiAgICAgIChhbmFseXplLXNwZWNpYWwgYW5hbHl6ZS1pZGVudGlmaWVyIGVudiBmb3JtKSkpKVxuXG4oZGVmdW4gYW5hbHl6ZS1pZGVudGlmaWVyXG4gIChlbnYgZm9ybSlcbiAgezpvcCA6dmFyXG4gICA6dHlwZSA6aWRlbnRpZmllclxuICAgOmZvcm0gZm9ybVxuICAgOnN0YXJ0ICg6c3RhcnQgKG1ldGEgZm9ybSkpXG4gICA6ZW5kICg6ZW5kIChtZXRhIGZvcm0pKVxuICAgOmJpbmRpbmcgKHJlc29sdmUtYmluZGluZyBlbnYgZm9ybSl9KVxuXG4oZGVmdW4gdW5yZXNvbHZlZC1iaW5kaW5nXG4gIChlbnYgZm9ybSlcbiAgezpvcCA6dW5yZXNvbHZlZC1iaW5kaW5nXG4gICA6dHlwZSA6dW5yZXNvbHZlZC1iaW5kaW5nXG4gICA6aWRlbnRpZmllciB7OnR5cGUgOmlkZW50aWZpZXJcbiAgICAgICAgICAgICAgICA6Zm9ybSAoc3ltYm9sIChuYW1lc3BhY2UgZm9ybSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChuYW1lIGZvcm0pKX1cbiAgIDpzdGFydCAoOnN0YXJ0IChtZXRhIGZvcm0pKVxuICAgOmVuZCAoOmVuZCAobWV0YSBmb3JtKSl9KVxuXG4oZGVmdW4gcmVzb2x2ZS1iaW5kaW5nXG4gIChlbnYgZm9ybSlcbiAgKG9yIChnZXQgKDpsb2NhbHMgZW52KSAobmFtZSBmb3JtKSlcbiAgICAgIChnZXQgKDplbmNsb3NlZCBlbnYpIChuYW1lIGZvcm0pKVxuICAgICAgKHVucmVzb2x2ZWQtYmluZGluZyBlbnYgZm9ybSkpKVxuXG4oZGVmdW4gYW5hbHl6ZS1zaGFkb3dcbiAgKGVudiBpZClcbiAgKGxldCogKChiaW5kaW5nIChyZXNvbHZlLWJpbmRpbmcgZW52IGlkKSkpXG4gICAgezpkZXB0aCAoaW5jIChvciAoOmRlcHRoIGJpbmRpbmcpIDApKVxuICAgICA6c2hhZG93IGJpbmRpbmd9KSlcblxuKGRlZnVuIGFuYWx5emUtYmluZGluZ1xuICAoZW52IGZvcm0pXG4gIChsZXQqICgoaWQgKGZpcnN0IGZvcm0pKVxuICAgICAgICAoYm9keSAoc2Vjb25kIGZvcm0pKSlcbiAgICAoY29uaiAoYW5hbHl6ZS1zaGFkb3cgZW52IGlkKVxuICAgICAgICAgIHs6b3AgOmJpbmRpbmdcbiAgICAgICAgICAgOnR5cGUgOmJpbmRpbmdcbiAgICAgICAgICAgOmlkIGlkXG4gICAgICAgICAgIDppbml0IChhbmFseXplIGVudiBib2R5KVxuICAgICAgICAgICA6Zm9ybSBmb3JtfSkpKVxuXG4oZGVmdW4gYW5hbHl6ZS1kZWNsYXJhdGlvblxuICAoZW52IGZvcm0pXG4gIChhc3NlcnQgKG5vdCAob3IgKG5hbWVzcGFjZSBmb3JtKVxuICAgICAgICAgICAgICAgICAgICg8IDEgKGNvdW50IChzcGxpdCBcXC4gKHN0ciBmb3JtKSkpKSkpKVxuICAoY29uaiAoYW5hbHl6ZS1zaGFkb3cgZW52IGZvcm0pXG4gICAgICAgIHs6b3AgOnZhclxuICAgICAgICAgOnR5cGUgOmlkZW50aWZpZXJcbiAgICAgICAgIDpkZXB0aCAwXG4gICAgICAgICA6aWQgZm9ybVxuICAgICAgICAgOmZvcm0gZm9ybX0pKVxuXG4oZGVmdW4gYW5hbHl6ZS1wYXJhbVxuICAoZW52IGZvcm0pXG4gIChjb25qIChhbmFseXplLXNoYWRvdyBlbnYgZm9ybSlcbiAgICAgICAgezpvcCA6cGFyYW1cbiAgICAgICAgIDp0eXBlIDpwYXJhbWV0ZXJcbiAgICAgICAgIDppZCBmb3JtXG4gICAgICAgICA6Zm9ybSBmb3JtXG4gICAgICAgICA6c3RhcnQgKDpzdGFydCAobWV0YSBmb3JtKSlcbiAgICAgICAgIDplbmQgKDplbmQgKG1ldGEgZm9ybSkpfSkpXG5cbihkZWZ1biB3aXRoLWJpbmRpbmdcbiAgKGVudiBmb3JtKVxuICBcIlJldHVybnMgZW5oYW5jZWQgZW52aXJvbm1lbnQgd2l0aCBhZGRpdGlvbmFsIGJpbmRpbmcgYWRkZWRcbiAgdG8gdGhlIDpiaW5kaW5ncyBhbmQgOnNjb3BlXCJcbiAgKGNvbmogZW52IHs6bG9jYWxzIChhc3NvYyAoOmxvY2FscyBlbnYpIChuYW1lICg6aWQgZm9ybSkpIGZvcm0pXG4gICAgICAgICAgICAgOmJpbmRpbmdzIChjb25qICg6YmluZGluZ3MgZW52KSBmb3JtKX0pKVxuXG4oZGVmdW4gd2l0aC1wYXJhbVxuICAoZW52IGZvcm0pXG4gIChjb25qICh3aXRoLWJpbmRpbmcgZW52IGZvcm0pXG4gICAgICAgIHs6cGFyYW1zIChjb25qICg6cGFyYW1zIGVudikgZm9ybSl9KSlcblxuKGRlZnVuIHN1Yi1lbnZcbiAgKGVudilcbiAgezplbmNsb3NlZCAoY29uaiB7fVxuICAgICAgICAgICAgICAgICAgICg6ZW5jbG9zZWQgZW52KVxuICAgICAgICAgICAgICAgICAgICg6bG9jYWxzIGVudikpXG4gICA6bG9jYWxzIHt9XG4gICA6YmluZGluZ3MgW11cbiAgIDpwYXJhbXMgKG9yICg6cGFyYW1zIGVudikgW10pXG4gICA7OyBTY29wZSBmbGFncyB0aGF0IHN1cnZpdmUgbmVzdGVkIGJpbmRpbmcgc2NvcGVzIChsZXQvdHJ5L2ZuXG4gICA7OyBib2RpZXMpIGJ1dCBhcmUgZXhwbGljaXRseSByZXNldCBhdCBldmVyeSBmbiBib3VuZGFyeSBieVxuICAgOzsgYW5hbHl6ZS1mbi4gOmFycm93IGdhdGVzIHRoZSBsYW1iZGEqIGB0aGlzYC9gYXJndW1lbnRzYFxuICAgOzsgcmVzdHJpY3Rpb247IDphc3luYyBnYXRlcyBgYXdhaXRgIHZhbGlkaXR5LlxuICAgOmFycm93ICg9ICg6YXJyb3cgZW52KSB0cnVlKVxuICAgOmFzeW5jICg9ICg6YXN5bmMgZW52KSB0cnVlKX0pXG5cblxuKGRlZnVuIGFuYWx5emUtbGV0KlxuICAoZW52IGZvcm0gaXMtbG9vcClcbiAgXCJUYWtlcyBsZXQgZm9ybSBhbmQgZW5oYW5jZXMgaXQncyBtZXRhZGF0YSB2aWEgYW5hbHl6ZWRcbiAgaW5mb1wiXG4gIChsZXQqICgoZXhwcmVzc2lvbnMgKHJlc3QgZm9ybSkpXG4gICAgICAgIChiaW5kaW5ncyAoZmlyc3QgZXhwcmVzc2lvbnMpKVxuICAgICAgICAoYm9keSAocmVzdCBleHByZXNzaW9ucykpXG5cbiAgICAgICAgKHZhbGlkLWJpbmRpbmdzPyAoYW5kICh2ZWN0b3I/IGJpbmRpbmdzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZXZlbj8gKGNvdW50IGJpbmRpbmdzKSkpKVxuXG4gICAgICAgIChfIChhc3NlcnQgdmFsaWQtYmluZGluZ3M/XG4gICAgICAgICAgICAgICAgICBcImJpbmRpbmdzIG11c3QgYmUgdmVjdG9yIG9mIGV2ZW4gbnVtYmVyIG9mIGVsZW1lbnRzXCIpKVxuXG4gICAgICAgIChzY29wZSAocmVkdWNlIChsYW1iZGEgKCUxICUyKSAod2l0aC1iaW5kaW5nICUxIChhbmFseXplLWJpbmRpbmcgJTEgJTIpKSlcbiAgICAgICAgICAgICAgICAgICAgICAoc3ViLWVudiBlbnYpXG4gICAgICAgICAgICAgICAgICAgICAgKHBhcnRpdGlvbiAyIGJpbmRpbmdzKSkpXG5cbiAgICAgICAgKGJpbmRpbmdzICg6YmluZGluZ3Mgc2NvcGUpKVxuXG4gICAgICAgIChleHByZXNzaW9ucyAoYW5hbHl6ZS1ibG9jayAoaWYgaXMtbG9vcFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChjb25qIHNjb3BlIHs6cGFyYW1zIGJpbmRpbmdzfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY29wZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9keSkpKVxuXG4gICAgezpvcCA6bGV0XG4gICAgIDpmb3JtIGZvcm1cbiAgICAgOnN0YXJ0ICg6c3RhcnQgKG1ldGEgZm9ybSkpXG4gICAgIDplbmQgKDplbmQgKG1ldGEgZm9ybSkpXG4gICAgIDpiaW5kaW5ncyBiaW5kaW5nc1xuICAgICA6c3RhdGVtZW50cyAoOnN0YXRlbWVudHMgZXhwcmVzc2lvbnMpXG4gICAgIDpyZXN1bHQgKDpyZXN1bHQgZXhwcmVzc2lvbnMpfSkpXG5cbihkZWZ1biBhbmFseXplLWxldFxuICAoZW52IGZvcm0pXG4gIChhbmFseXplLWxldCogZW52IGZvcm0gZmFsc2UpKVxuOzsgYGxldCoqYCBpcyB0aGUgcG9zdC1tYWNyb2V4cGFuc2lvbiBpbnRlcm5hbCBiaW5kaW5nIGZvcm0gKGZsYXQgdmVjdG9yIG9mXG47OyBuYW1lL2luaXQgcGFpcnMsIHNlcXVlbnRpYWwpIC0tIGFuYWxvZ291cyB0byBgZm4qYC9gbG9vcCpgLiBOZXctc3ludGF4J3Ncbjs7IHVzZXItZmFjaW5nIGBsZXRgL2BsZXQqYCAocGFyZW4tbGlzdCBiaW5kaW5ncykgYXJlIGV4cGFuZGVyIG1hY3JvcyB0aGF0XG47OyBib3RoIGxvd2VyIHRvIHRoaXMgZm9ybTsga2VlcGluZyB0aGUgaW50ZXJuYWwga2V5IGRpc3RpbmN0IGZyb20gdGhlXG47OyBwdWJsaWMgYGxldCpgIHNwZWxsaW5nIGF2b2lkcyB0aGUgbWFjcm9leHBhbmRlciByZS1leHBhbmRpbmcgaXRzIG93blxuOzsgb3V0cHV0LlxuKGluc3RhbGwtc3BlY2lhbCEgOmxldCoqIGFuYWx5emUtbGV0KVxuXG4oZGVmdW4gYW5hbHl6ZS1sb29wXG4gIChlbnYgZm9ybSlcbiAgKGNvbmogKGFuYWx5emUtbGV0KiBlbnYgZm9ybSB0cnVlKSB7Om9wIDpsb29wfSkpXG4oaW5zdGFsbC1zcGVjaWFsISA6bG9vcCogYW5hbHl6ZS1sb29wKVxuXG5cbihkZWZ1biBhbmFseXplLXJlY3VyXG4gIChlbnYgZm9ybSlcbiAgKGxldCogKChwYXJhbXMgKDpwYXJhbXMgZW52KSlcbiAgICAgICAgKGZvcm1zICh2ZWMgKG1hcCAobGFtYmRhICglKSAoYW5hbHl6ZSBlbnYgJSkpIChyZXN0IGZvcm0pKSkpKVxuXG4gICAgKGlmICg9IChjb3VudCBwYXJhbXMpXG4gICAgICAgICAgIChjb3VudCBmb3JtcykpXG4gICAgICB7Om9wIDpyZWN1clxuICAgICAgIDpmb3JtIGZvcm1cbiAgICAgICA6cGFyYW1zIGZvcm1zfVxuICAgICAgKHN5bnRheC1lcnJvciBcIlJlY3VycyB3aXRoIHdyb25nIG51bWJlciBvZiBhcmd1bWVudHNcIlxuICAgICAgICAgICAgICAgICAgICBmb3JtKSkpKVxuKGluc3RhbGwtc3BlY2lhbCEgOnJlY3VyIGFuYWx5emUtcmVjdXIpXG5cbihkZWZ1biBhbmFseXplLXF1b3RlZC1saXN0XG4gIChmb3JtKVxuICB7Om9wIDpsaXN0XG4gICA6aXRlbXMgKG1hcCBhbmFseXplLXF1b3RlZCAodmVjIGZvcm0pKVxuICAgOmZvcm0gZm9ybVxuICAgOnN0YXJ0ICg6c3RhcnQgKG1ldGEgZm9ybSkpXG4gICA6ZW5kICg6ZW5kIChtZXRhIGZvcm0pKX0pXG5cbihkZWZ1biBhbmFseXplLXF1b3RlZC12ZWN0b3JcbiAgKGZvcm0pXG4gIHs6b3AgOnZlY3RvclxuICAgOml0ZW1zIChtYXAgYW5hbHl6ZS1xdW90ZWQgZm9ybSlcbiAgIDpmb3JtIGZvcm1cbiAgIDpzdGFydCAoOnN0YXJ0IChtZXRhIGZvcm0pKVxuICAgOmVuZCAoOmVuZCAobWV0YSBmb3JtKSl9KVxuXG4oZGVmdW4gYW5hbHl6ZS1xdW90ZWQtZGljdGlvbmFyeVxuICAoZm9ybSlcbiAgKGxldCogKChuYW1lcyAodmVjIChtYXAgYW5hbHl6ZS1xdW90ZWQgKGtleXMgZm9ybSkpKSlcbiAgICAgICAgKHZhbHVlcyAodmVjIChtYXAgYW5hbHl6ZS1xdW90ZWQgKHZhbHMgZm9ybSkpKSkpXG4gICAgezpvcCA6ZGljdGlvbmFyeVxuICAgICA6Zm9ybSBmb3JtXG4gICAgIDprZXlzIG5hbWVzXG4gICAgIDp2YWx1ZXMgdmFsdWVzXG4gICAgIDpzdGFydCAoOnN0YXJ0IChtZXRhIGZvcm0pKVxuICAgICA6ZW5kICg6ZW5kIChtZXRhIGZvcm0pKX0pKVxuXG4oZGVmdW4gYW5hbHl6ZS1xdW90ZWQtc3ltYm9sXG4gIChmb3JtKVxuICB7Om9wIDpzeW1ib2xcbiAgIDpuYW1lIChuYW1lIGZvcm0pXG4gICA6bmFtZXNwYWNlIChuYW1lc3BhY2UgZm9ybSlcbiAgIDpmb3JtIGZvcm19KVxuXG4oZGVmdW4gYW5hbHl6ZS1xdW90ZWQta2V5d29yZFxuIChmb3JtKVxuICB7Om9wIDprZXl3b3JkXG4gICA6bmFtZSAobmFtZSBmb3JtKVxuICAgOm5hbWVzcGFjZSAobmFtZXNwYWNlIGZvcm0pXG4gICA6Zm9ybSBmb3JtfSlcblxuKGRlZnVuIGFuYWx5emUtcXVvdGVkXG4gIChmb3JtKVxuICAoY29uZCAoKHN5bWJvbD8gZm9ybSkgKGFuYWx5emUtcXVvdGVkLXN5bWJvbCBmb3JtKSlcbiAgICAgICAgKChrZXl3b3JkPyBmb3JtKSAoYW5hbHl6ZS1xdW90ZWQta2V5d29yZCBmb3JtKSlcbiAgICAgICAgKChsaXN0PyBmb3JtKSAoYW5hbHl6ZS1xdW90ZWQtbGlzdCBmb3JtKSlcbiAgICAgICAgKCh2ZWN0b3I/IGZvcm0pIChhbmFseXplLXF1b3RlZC12ZWN0b3IgZm9ybSkpXG4gICAgICAgICgoZGljdGlvbmFyeT8gZm9ybSkgKGFuYWx5emUtcXVvdGVkLWRpY3Rpb25hcnkgZm9ybSkpXG4gICAgICAgIChlbHNlIHs6b3AgOmNvbnN0YW50XG4gICAgICAgICAgICAgICA6Zm9ybSBmb3JtfSkpKVxuXG4oZGVmdW4gYW5hbHl6ZS1xdW90ZVxuICAoZW52IGZvcm0pXG4gIFwiRXhhbXBsZXM6XG4gICAoYW5hbHl6ZS1xdW90ZSB7fSAnKHF1b3RlIGZvbykpID0+IHs6b3AgOmNvbnN0YW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Zm9ybSAnZm9vXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ZW52IGVudn1cIlxuICAoYW5hbHl6ZS1xdW90ZWQgKHNlY29uZCBmb3JtKSkpXG4oaW5zdGFsbC1zcGVjaWFsISA6cXVvdGUgYW5hbHl6ZS1xdW90ZSlcblxuKGRlZnVuIGFuYWx5emUtc3RhdGVtZW50XG4gIChlbnYgZm9ybSlcbiAgKGxldCogKChzdGF0ZW1lbnRzIChvciAoOnN0YXRlbWVudHMgZW52KSBbXSkpXG4gICAgICAgIChiaW5kaW5ncyAob3IgKDpiaW5kaW5ncyBlbnYpIFtdKSlcbiAgICAgICAgKHN0YXRlbWVudCAoYW5hbHl6ZSAoY29uaiBlbnYgezpzdGF0ZW1lbnRzIG5pbH0pIGZvcm0pKVxuICAgICAgICAob3AgKDpvcCBzdGF0ZW1lbnQpKVxuXG4gICAgICAgIChkZWZzIChjb25kICgoPSBvcCA6ZGVmKSBbKDp2YXIgc3RhdGVtZW50KV0pXG4gICAgICAgICAgICAgICAgICAgOzsgKD0gb3AgOm5zKSAoOnJlcXVpcmVtZW50IG5vZGUpXG4gICAgICAgICAgICAgICAgICAgKGVsc2UgbmlsKSkpKVxuXG4gICAgKGNvbmogZW52IHs6c3RhdGVtZW50cyAoY29uaiBzdGF0ZW1lbnRzIHN0YXRlbWVudClcbiAgICAgICAgICAgICAgIDpiaW5kaW5ncyAoY29uY2F0IGJpbmRpbmdzIGRlZnMpfSkpKVxuXG4oZGVmdW4gYW5hbHl6ZS1ibG9ja1xuICAoZW52IGZvcm0pXG4gIFwiRXhhbXBsZXM6XG4gIChhbmFseXplLWJsb2NrIHt9ICcoKGZvbyBiYXIpKSkgPT4gezpzdGF0ZW1lbnRzIG5pbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6cmVzdWx0IHs6b3AgOmludm9rZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Zm9ybSAnKGZvbyBiYXIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDplbnYge31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmNhbGxlZSB7Om9wIDp2YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gJ2Zvb1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6aW5mbyBuaWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmVudiB7fX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnBhcmFtcyBbezpvcCA6dmFyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Zm9ybSAnYmFyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6aW5mbyBuaWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDplbnYge319XX1cbiAgKGFuYWx5emUtYmxvY2sge30gJygoYmVlcCBieilcbiAgICAgICAgICAgICAgICAgICAgICAoZm9vIGJhcikpKSA9PiB7OnN0YXRlbWVudHMgW3s6b3AgOmludm9rZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtICcoYmVlcCBieilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ZW52IHt9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmNhbGxlZSB7Om9wIDp2YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Zm9ybSAnYmVlcFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDppbmZvIG5pbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDplbnYge319XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnBhcmFtcyBbezpvcCA6dmFyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtICdielxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6aW5mbyBuaWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmVudiB7fX1dfV1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnJlc3VsdCB7Om9wIDppbnZva2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gJyhmb28gYmFyKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ZW52IHt9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpjYWxsZWUgezpvcCA6dmFyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtICdmb29cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmluZm8gbmlsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDplbnYge319XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpwYXJhbXMgW3s6b3AgOnZhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gJ2JhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmluZm8gbmlsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ZW52IHt9fV19XCJcbiAgKGxldCogKChib2R5IChpZiAoPiAoY291bnQgZm9ybSkgMSlcbiAgICAgICAgICAgICAgIChyZWR1Y2UgYW5hbHl6ZS1zdGF0ZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgICAgZW52XG4gICAgICAgICAgICAgICAgICAgICAgIChidXRsYXN0IGZvcm0pKSkpXG4gICAgICAgIChyZXN1bHQgKGFuYWx5emUgKG9yIGJvZHkgZW52KSAobGFzdCBmb3JtKSkpKVxuICAgIHs6c3RhdGVtZW50cyAoOnN0YXRlbWVudHMgYm9keSlcbiAgICAgOnJlc3VsdCByZXN1bHR9KSlcblxuKGRlZnVuIGFuYWx5emUtZm4tbWV0aG9kXG4gIChlbnYgZm9ybSlcbiAgXCJcbiAge30gLT4gJyhbeCB5XSAoKyB4IHkpKSAtPiB7OmVudiB7fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Zm9ybSAnKFt4IHldICgrIHggeSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIDp2YXJpYWRpYyBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6YXJpdHkgMlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6cGFyYW1zIFt7Om9wIDp2YXIgOmZvcm0gJ3h9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHs6b3AgOnZhciA6Zm9ybSAneX1dXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpzdGF0ZW1lbnRzIFtdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpyZXR1cm4gezpvcCA6aW52b2tlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpjYWxsZWUgezpvcCA6dmFyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtICcrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDplbnYgezpwYXJlbnQge31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmxvY2FscyB7eCB7Om5hbWUgJ3hcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnNoYWRvdyBuaWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmxvY2FsIHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnRhZyBuaWx9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHkgezpuYW1lICd5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpzaGFkb3cgbmlsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpsb2NhbCB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDp0YWcgbmlsfX19fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6cGFyYW1zIFt7Om9wIDp2YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtICd4XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6aW5mbyBuaWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDp0YWcgbmlsfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Om9wIDp2YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtICd5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6aW5mbyBuaWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDp0YWcgbmlsfV19fVwiXG4gIChsZXQqICgoc2lnbmF0dXJlIChpZiAoYW5kIChsaXN0PyBmb3JtKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgKHZlY3Rvcj8gKGZpcnN0IGZvcm0pKSlcbiAgICAgICAgICAgICAgICAgICAgKGZpcnN0IGZvcm0pXG4gICAgICAgICAgICAgICAgICAgIChzeW50YXgtZXJyb3IgXCJNYWxmb3JtZWQgZm4gb3ZlcmxvYWQgZm9ybVwiIGZvcm0pKSlcbiAgICAgICAgKGJvZHkgKHJlc3QgZm9ybSkpXG4gICAgICAgIDs7IElmIHBhcmFtIHNpZ25hdHVyZSBjb250YWlucyAmIGZuIGlzIHZhcmlhZGljLlxuICAgICAgICAodmFyaWFkaWMgKHNvbWUgKGxhbWJkYSAoJSkgKD0gJyYgJSkpIHNpZ25hdHVyZSkpXG5cbiAgICAgICAgOzsgQWxsIG5hbWVkIHBhcmFtcyBvZiB0aGUgZm4uXG4gICAgICAgIChwYXJhbXMgKGlmIHZhcmlhZGljXG4gICAgICAgICAgICAgICAgIChmaWx0ZXIgKGxhbWJkYSAoJSkgKG5vdCAoPSAnJiAlKSkpIHNpZ25hdHVyZSlcbiAgICAgICAgICAgICAgICAgc2lnbmF0dXJlKSlcblxuICAgICAgICA7OyBOdW1iZXIgb2YgcGFyYW1ldGVycyBmaXhlZCBwYXJhbWV0ZXJzIGZuIHRha2VzLlxuICAgICAgICAoYXJpdHkgKGlmIHZhcmlhZGljXG4gICAgICAgICAgICAgICAgKGRlYyAoY291bnQgcGFyYW1zKSlcbiAgICAgICAgICAgICAgICAoY291bnQgcGFyYW1zKSkpXG5cbiAgICAgICAgOzsgQW5hbHl6ZSBwYXJhbWV0ZXJzIGluIGNvcnJlc3BvbmRlbmNlIHRvIGVudmlyb25tZW50XG4gICAgICAgIDs7IGxvY2FscyB0byBpZGVudGlmeSBiaW5kaW5nIHNoYWRvd2luZy5cbiAgICAgICAgKHNjb3BlIChyZWR1Y2UgKGxhbWJkYSAoJTEgJTIpICh3aXRoLXBhcmFtICUxIChhbmFseXplLXBhcmFtICUxICUyKSkpXG4gICAgICAgICAgICAgICAgICAgICAgKGNvbmogZW52IHs6cGFyYW1zIFtdfSlcbiAgICAgICAgICAgICAgICAgICAgICBwYXJhbXMpKSlcbiAgICAoY29uaiAoYW5hbHl6ZS1ibG9jayBzY29wZSBib2R5KVxuICAgICAgICAgIHs6b3AgOm92ZXJsb2FkXG4gICAgICAgICAgIDp2YXJpYWRpYyB2YXJpYWRpY1xuICAgICAgICAgICA6YXJpdHkgYXJpdHlcbiAgICAgICAgICAgOnBhcmFtcyAoOnBhcmFtcyBzY29wZSlcbiAgICAgICAgICAgOmZvcm0gZm9ybX0pKSlcblxuXG4oZGVmdW4gYW5hbHl6ZS1mblxuICAoZW52IGZvcm0pXG4gIChsZXQqICgoZm9ybXMgKHJlc3QgZm9ybSkpXG4gICAgICAgIDs7IE5vcm1hbGl6ZSBmbiBmb3JtIHNvIHRoYXQgaXQgY29udGFpbnMgbmFtZVxuICAgICAgICA7OyAnKGZuIFt4XSB4KSAtPiAnKGZuIG5pbCBbeF0geClcbiAgICAgICAgKGZvcm1zIChpZiAoc3ltYm9sPyAoZmlyc3QgZm9ybXMpKVxuICAgICAgICAgICAgICAgIGZvcm1zXG4gICAgICAgICAgICAgICAgKGNvbnMgbmlsIGZvcm1zKSkpXG5cbiAgICAgICAgKGlkIChmaXJzdCBmb3JtcykpXG4gICAgICAgIChiaW5kaW5nIChpZiBpZCAoYW5hbHl6ZS1zcGVjaWFsIGFuYWx5emUtZGVjbGFyYXRpb24gZW52IGlkKSkpXG5cbiAgICAgICAgKGJvZHkgKHJlc3QgZm9ybXMpKVxuXG4gICAgICAgIDs7IE1ha2Ugc3VyZSB0aGF0IGZuIGRlZmluaXRpb24gaXMgc3RydWN1dGVyZWRcbiAgICAgICAgOzsgaW4gbWV0aG9kIG92ZXJsb2FkIHN0eWxlOlxuICAgICAgICA7OyAoZm4gYSBbeF0geSkgLT4gKChbeF0geSkpXG4gICAgICAgIDs7IChmbiBhIChbeF0geSkpIC0+ICgoW3hdIHkpKVxuICAgICAgICAob3ZlcmxvYWRzIChjb25kICgodmVjdG9yPyAoZmlyc3QgYm9keSkpIChsaXN0IGJvZHkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgKChhbmQgKGxpc3Q/IChmaXJzdCBib2R5KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHZlY3Rvcj8gKGZpcnN0IChmaXJzdCBib2R5KSkpKSBib2R5KVxuICAgICAgICAgICAgICAgICAgICAgICAgKGVsc2UgKHN5bnRheC1lcnJvciAoc3RyIFwiTWFsZm9ybWVkIGZuIGV4cHJlc3Npb24sIFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJwYXJhbWV0ZXIgZGVjbGFyYXRpb24gKFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHByLXN0ciAoZmlyc3QgYm9keSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIpIG11c3QgYmUgYSB2ZWN0b3JcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9ybSkpKSlcblxuICAgICAgICAoc2NvcGUgKGlmIGJpbmRpbmdcbiAgICAgICAgICAgICAgICAod2l0aC1iaW5kaW5nIChzdWItZW52IGVudikgYmluZGluZylcbiAgICAgICAgICAgICAgICAoc3ViLWVudiBlbnYpKSlcblxuICAgICAgICA7OyBsYW1iZGEqIChhcnJvdykgLyBhc3luYyBtYXJrZXJzOiBpbmplY3RlZCBhcyBgOmFycm93YCAvXG4gICAgICAgIDs7IGA6YXN5bmNgIG1ldGFkYXRhIG9uIHRoZSAoZm4qIC4uLikgZm9ybSBieSB0aGUgbGFtYmRhKlxuICAgICAgICA7OyBtYWNybyBhbmQgdGhlIGBhc3luY2Agc3BlY2lhbCBmb3JtLiBUaGUgTk9ERSBjYXJyaWVzIHRoZSByYXdcbiAgICAgICAgOzsgbWFya2VyIChuaWwvdHJ1ZSwgbGlrZSA6dmFyaWFkaWMpOyB0aGUgc2NvcGUgZW52IGdldHMgYW5cbiAgICAgICAgOzsgZXhwbGljaXQgYm9vbGVhbiBzbyBhIG5lc3RlZCBub24tYXN5bmMvbm9uLWFycm93IGZuIHJlc2V0c1xuICAgICAgICA7OyB0aGUgZmxhZyBpbnN0ZWFkIG9mIGluaGVyaXRpbmcgaXQgZnJvbSB0aGUgZW5jbG9zaW5nIHNjb3BlLlxuICAgICAgICAoYXJyb3cgKD0gKDphcnJvdyAobWV0YSBmb3JtKSkgdHJ1ZSkpXG4gICAgICAgIChhc3luYyAoPSAoOmFzeW5jIChtZXRhIGZvcm0pKSB0cnVlKSlcblxuICAgICAgICAoc2NvcGUgKGNvbmogc2NvcGUgezphcnJvdyBhcnJvd1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDphc3luYyBhc3luY30pKVxuXG4gICAgICAgIChtZXRob2RzIChtYXAgKGxhbWJkYSAoJSkgKGFuYWx5emUtZm4tbWV0aG9kIHNjb3BlICUpKVxuICAgICAgICAgICAgICAgICAgICAgKHZlYyBvdmVybG9hZHMpKSlcblxuICAgICAgICAoYXJpdHkgKGFwcGx5IG1heCAobWFwIChsYW1iZGEgKCUpICg6YXJpdHkgJSkpIG1ldGhvZHMpKSlcbiAgICAgICAgKHZhcmlhZGljIChzb21lIChsYW1iZGEgKCUpICg6dmFyaWFkaWMgJSkpIG1ldGhvZHMpKSlcblxuICAgIDs7IFRoZSBhcml0eS1kaXNwYXRjaCBsb3dlcmluZyBmb3Igb3ZlcmxvYWRlZCBmbnMgcmVhZHNcbiAgICA7OyBgYXJndW1lbnRzYCwgd2hpY2ggYXJyb3dzIGRvIG5vdCBoYXZlLiBsYW1iZGEqIHJlamVjdHNcbiAgICA7OyBtdWx0aS1hcml0eSBjbGF1c2VzIGF0IGV4cGFuc2lvbiB0aW1lOyB0aGlzIGd1YXJkcyBkaXJlY3QgdXNlLlxuICAgIChpZiAoYW5kIGFycm93XG4gICAgICAgICAgICg+IChjb3VudCBtZXRob2RzKSAxKSlcbiAgICAgIChzeW50YXgtZXJyb3IgXCJsYW1iZGEqIGRvZXMgbm90IHN1cHBvcnQgYXJpdHkgb3ZlcmxvYWRpbmdcIiBmb3JtKSlcblxuICAgIHs6b3AgOmZuXG4gICAgIDp0eXBlIDpmdW5jdGlvblxuICAgICA6YXJyb3cgKGlmIGFycm93IHRydWUgbmlsKVxuICAgICA6YXN5bmMgKGlmIGFzeW5jIHRydWUgbmlsKVxuICAgICA6aWQgYmluZGluZ1xuICAgICA6dmFyaWFkaWMgdmFyaWFkaWNcbiAgICAgOm1ldGhvZHMgbWV0aG9kc1xuICAgICA6Zm9ybSBmb3JtfSkpXG4oaW5zdGFsbC1zcGVjaWFsISA6Zm4qIGFuYWx5emUtZm4pXG5cbihkZWZ1biBhbmFseXplLWFzeW5jXG4gIChlbnYgZm9ybSlcbiAgXCJgYXN5bmNgIG1hcmtzIGEgZnVuY3Rpb24gZm9ybSBhcyBhc3luYzogKGFzeW5jIChsYW1iZGEgLi4uKSkgb3JcbiAgKGFzeW5jIChsYW1iZGEqIC4uLikpIOKAlCB0aGUgYXN5bmMgYXJyb3cgY29tcG9zaXRpb24uIFRoZSBpbm5lciBmb3JtXG4gIGlzIG1hY3JvZXhwYW5kZWQgZmlyc3QgKHNvIGxhbWJkYS1hc3luYy1zdHlsZSBzdWdhciBleHBhbmRzKSwgdGhlblxuICBtdXN0IGhlYWQtZXhwYW5kIHRvIGZuKjsgdGhlIDphc3luYyBtYXJrZXIgcmlkZXMgaXRzIG1ldGFkYXRhIGludG9cbiAgYW5hbHl6ZS1mbiwgd2hpY2ggdHVybnMgb24gYXdhaXQgdmFsaWRpdHkgZm9yIHRoYXQgZm4ncyBzY29wZSBhbmRcbiAgbWFrZXMgdGhlIGJhY2tlbmQgZW1pdCBhbiBhc3luYyBmdW5jdGlvbi5cIlxuICAobGV0KiAoKGlubmVyIChtYWNyb2V4cGFuZCAoc2Vjb25kIGZvcm0pIGVudikpKVxuICAgIChpZiAob3IgKG5vdCAobGlzdD8gaW5uZXIpKVxuICAgICAgICAgICAgKGVtcHR5PyBpbm5lcilcbiAgICAgICAgICAgIChub3QgKGlkZW50aWNhbD8gKG5hbWUgKGZpcnN0IGlubmVyKSkgXCJmbipcIikpKVxuICAgICAgKHN5bnRheC1lcnJvciBcImFzeW5jIGV4cGVjdHMgYSBmdW5jdGlvbiBmb3JtLCBlLmcuIChhc3luYyAobGFtYmRhICh4KSAuLi4pKVwiIGZvcm0pXG4gICAgICAoYW5hbHl6ZSBlbnYgKHdpdGgtbWV0YSBpbm5lciAoY29uaiAob3IgKG1ldGEgaW5uZXIpIHt9KSB7OmFzeW5jIHRydWV9KSkpKSkpXG4oaW5zdGFsbC1zcGVjaWFsISA6YXN5bmMgYW5hbHl6ZS1hc3luYylcblxuKGRlZnVuIGFuYWx5emUtYXdhaXRcbiAgKGVudiBmb3JtKVxuICBcImBhd2FpdGAgdW53cmFwcyBhIHByb21pc2U6IChhd2FpdCBleHByKSA9PiBBd2FpdEV4cHJlc3Npb24uIEl0IGlzXG4gIHZhbGlkIG9ubHkgbGV4aWNhbGx5IGluc2lkZSBhbiBhc3luYyBmdW5jdGlvbiDigJQgOmFzeW5jIG9uIHRoZSBzY29wZVxuICBlbnYsIHNldCBieSBhbmFseXplLWZuIGFuZCBwcm9wYWdhdGVkIHRocm91Z2ggc3ViLWVudiDigJQgc28gYSBzdHJheVxuICBhd2FpdCBpcyBhIGNsZWFuIGNvbXBpbGUgZXJyb3IgaW5zdGVhZCBvZiBpbnZhbGlkIEpTLiAoQW4gYXdhaXRcbiAgaW5zaWRlIGEgbmVzdGVkIG5vbi1hc3luYyBmbiBpcyByZWplY3RlZCB0aGUgc2FtZSB3YXksIG1hdGNoaW5nIEpTLilcIlxuICAoaWYgKG5vdCAoOmFzeW5jIGVudikpXG4gICAgKHN5bnRheC1lcnJvciBcImF3YWl0IG91dHNpZGUgb2YgYW4gYXN5bmMgZnVuY3Rpb25cIiBmb3JtKSlcbiAgKGxldCogKChleHByZXNzaW9ucyAocmVzdCBmb3JtKSkpXG4gICAgKGlmIChub3QgKGlkZW50aWNhbD8gKGNvdW50IGV4cHJlc3Npb25zKSAxKSlcbiAgICAgIChzeW50YXgtZXJyb3IgXCJNYWxmb3JtZWQgYXdhaXQgZXhwcmVzc2lvbiwgZXhwZWN0aW5nIChhd2FpdCBleHByKVwiIGZvcm0pKVxuICAgIHs6b3AgOmF3YWl0XG4gICAgIDpmb3JtIGZvcm1cbiAgICAgOmFyZ3VtZW50IChhbmFseXplIGVudiAoZmlyc3QgZXhwcmVzc2lvbnMpKX0pKVxuKGluc3RhbGwtc3BlY2lhbCEgOmF3YWl0IGFuYWx5emUtYXdhaXQpXG5cbihkZWZ1biBwYXJzZS1yZWZlcmVuY2VzXG4gIChmb3JtcylcbiAgXCJUYWtlcyBwYXJ0IG9mIG5hbWVzcGFjZSBkZWZpbml0aW9uIGFuZCBjcmVhdGVzIGhhc2hcbiAgb2YgcmVmZXJlbmNlIGZvcm1zXCJcbiAgKHJlZHVjZSAobGFtYmRhIChyZWZlcmVuY2VzIGZvcm0pXG4gICAgICAgICAgICA7OyBJZiBub3QgYSB2ZWN0b3IgdGhhbiBpdCdzIG5vdCBhIHJlZmVyZW5jZVxuICAgICAgICAgICAgOzsgZm9ybSB0aGF0IHdpc3AgdW5kZXJzdGFuZHMgc28ganVzdCBza2lwIGl0LlxuICAgICAgICAgICAgKGlmIChzZXE/IGZvcm0pXG4gICAgICAgICAgICAgIChhc3NvYyByZWZlcmVuY2VzXG4gICAgICAgICAgICAgICAgKG5hbWUgKGZpcnN0IGZvcm0pKVxuICAgICAgICAgICAgICAgICh2ZWMgKHJlc3QgZm9ybSkpKVxuICAgICAgICAgICAgICByZWZlcmVuY2VzKSlcbiAgICAgICAgICB7fVxuICAgICAgICAgIGZvcm1zKSlcblxuKGRlZnVuIHBhcnNlLXJlcXVpcmVcbiAgKGZvcm0pXG4gIChsZXQqICg7OyByZXF1aXJlIGZvcm0gbWF5IGJlIGVpdGhlciB2ZWN0b3Igd2l0aCBpZCBpbiB0aGVcbiAgICAgICAgOzsgaGVhZCBvciBqdXN0IGFuIGlkIHN5bWJvbC4gbm9ybWFsaXppbmcgdG8gYSB2ZWN0b3JcbiAgICAgICAgKHJlcXVpcmVtZW50IChpZiAoc3ltYm9sPyBmb3JtKSBbZm9ybV0gKHZlYyBmb3JtKSkpXG4gICAgICAgIChpZCAoZmlyc3QgcmVxdWlyZW1lbnQpKVxuICAgICAgICA7OyBidW5jaCBvZiBkaXJlY3RpdmVzIG1heSBmb2xsb3cgcmVxdWlyZSBmb3JtIGJ1dCB0aGV5XG4gICAgICAgIDs7IGFsbCBjb21lIGluIHBhaXJzLiB3aXNwIHN1cHBvcnRzIGZvbGxvd2luZyBwYWlyczpcbiAgICAgICAgOzsgOmFzIGZvb1xuICAgICAgICA7OyA6cmVmZXIgW2ZvbyBiYXJdXG4gICAgICAgIDs7IDpyZW5hbWUge2ZvbyBiYXJ9XG4gICAgICAgIDs7IGpvaW4gdGhlc2UgcGFpcnMgaW4gYSBoYXNoIGZvciBrZXkgYmFzZWQgYWNjZXNzLlxuICAgICAgICAocGFyYW1zIChhcHBseSBkaWN0aW9uYXJ5IChyZXN0IHJlcXVpcmVtZW50KSkpXG4gICAgICAgIChyZW5hbWVzIChnZXQgcGFyYW1zICc6cmVuYW1lKSlcbiAgICAgICAgKG5hbWVzIChnZXQgcGFyYW1zICc6cmVmZXIpKVxuICAgICAgICAoYWxpYXMgKGdldCBwYXJhbXMgJzphcykpXG4gICAgICAgIChyZWZlcmVuY2VzIChpZiAobm90IChlbXB0eT8gbmFtZXMpKVxuICAgICAgICAgICAgICAgICAgICAgKHJlZHVjZSAobGFtYmRhIChyZWZlcnMgcmVmZXJlbmNlKVxuICAgICAgICAgICAgICAgICAgICAgIChjb25qIHJlZmVyc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHs6b3AgOnJlZmVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtIHJlZmVyZW5jZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6bmFtZSByZWZlcmVuY2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOzsgTG9vayB1cCBieSByZWZlcmVuY2Ugc3ltYm9sIGFuZCBieSBzeW1ib2xcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICA7OyBiaXQgaW4gYSBmdXp6IHJpZ2h0IG5vdy5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnJlbmFtZSAob3IgKGdldCByZW5hbWVzIHJlZmVyZW5jZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGdldCByZW5hbWVzIChuYW1lIHJlZmVyZW5jZSkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6bnMgaWR9KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW11cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZXMpKSkpXG4gICAgezpvcCA6cmVxdWlyZVxuICAgICA6YWxpYXMgYWxpYXNcbiAgICAgOm5zIGlkXG4gICAgIDpyZWZlciByZWZlcmVuY2VzXG4gICAgIDpmb3JtIGZvcm19KSlcblxuKGRlZnVuIGFuYWx5emUtbnNcbiAgKGVudiBmb3JtKVxuICAobGV0KiAoKGZvcm1zIChyZXN0IGZvcm0pKVxuICAgICAgICAobmFtZSAoZmlyc3QgZm9ybXMpKVxuICAgICAgICAoYm9keSAocmVzdCBmb3JtcykpXG4gICAgICAgIDs7IE9wdGlvbmFsIGRvY3N0cmluZyB0aGF0IGZvbGxvd3MgbmFtZSBzeW1ib2xcbiAgICAgICAgKGRvYyAoaWYgKHN0cmluZz8gKGZpcnN0IGJvZHkpKSAoZmlyc3QgYm9keSkpKVxuICAgICAgICA7OyBJZiBzZWNvbmQgZm9ybSBpcyBub3QgYSBzdHJpbmcgdGhhbiB0cmVhdCBpdFxuICAgICAgICA7OyBhcyByZWd1bGFyIHJlZmVyZW5jZSBmb3JtXG4gICAgICAgIChyZWZlcmVuY2VzIChwYXJzZS1yZWZlcmVuY2VzIChpZiBkb2NcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChyZXN0IGJvZHkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib2R5KSkpXG4gICAgICAgIChyZXF1aXJlbWVudHMgKGlmICg6cmVxdWlyZSByZWZlcmVuY2VzKVxuICAgICAgICAgICAgICAgICAgICAgICAobWFwIHBhcnNlLXJlcXVpcmUgKDpyZXF1aXJlIHJlZmVyZW5jZXMpKSkpKVxuICAgIHs6b3AgOm5zXG4gICAgIDpuYW1lIG5hbWVcbiAgICAgOmRvYyBkb2NcbiAgICAgOnJlcXVpcmUgKGlmIHJlcXVpcmVtZW50c1xuICAgICAgICAgICAgICAgICh2ZWMgcmVxdWlyZW1lbnRzKSlcbiAgICAgOmZvcm0gZm9ybX0pKVxuKGluc3RhbGwtc3BlY2lhbCEgOm5zIGFuYWx5emUtbnMpXG5cblxuKGRlZnVuIGFuYWx5emUtbGlzdFxuICAoZW52IGZvcm0pXG4gIFwiVGFrZXMgZm9ybSBvZiBsaXN0IHR5cGUgYW5kIHBlcmZvcm1zIGEgbWFjcm9leHBhbnNpb25zIHVudGlsXG4gIGZ1bGx5IGV4cGFuZGVkLiBJZiBleHBhbnNpb24gaXMgZGlmZmVyZW50IGZyb20gYSBnaXZlbiBmb3JtIHRoZW5cbiAgZXhwYW5kZWQgZm9ybSBpcyBoYW5kZWQgYmFjayB0byBhbmFseXplci4gSWYgZm9ybSBpcyBzcGVjaWFsIGxpa2VcbiAgZGVmLCBmbiwgbGV0Li4uIHRoYW4gYXNzb2NpYXRlZCBpcyBkaXNwYXRjaGVkLCBvdGhlcndpc2UgZm9ybSBpc1xuICBhbmFseXplZCBhcyBpbnZva2UgZXhwcmVzc2lvbi5cIlxuICAobGV0KiAoKGV4cGFuc2lvbiAobWFjcm9leHBhbmQgZm9ybSBlbnYpKVxuICAgICAgICA7OyBTcGVjaWFsIG9wZXJhdG9ycyBtdXN0IGJlIHN5bWJvbHMgYW5kIHN0b3JlZCBpbiB0aGVcbiAgICAgICAgOzsgKipzcGVjaWFscyoqIGhhc2ggYnkgb3BlcmF0b3IgbmFtZS5cbiAgICAgICAgKG9wZXJhdG9yIChmaXJzdCBmb3JtKSlcbiAgICAgICAgKGFuYWx5emVyIChhbmQgKHN5bWJvbD8gb3BlcmF0b3IpXG4gICAgICAgICAgICAgICAgICAgICAgKGdldCAqKnNwZWNpYWxzKiogKG5hbWUgb3BlcmF0b3IpKSkpKVxuICAgIDs7IElmIGZvcm0gaXMgZXhwYW5kZWQgcGFzcyBpdCBiYWNrIHRvIGFuYWx5emUgc2luY2UgaXQgbWF5IG5vXG4gICAgOzsgbG9uZ2VyIGJlIGEgbGlzdC4gT3RoZXJ3aXNlIGVpdGhlciBhbmFseXplIGFzIGEgc3BlY2lhbCBmb3JtXG4gICAgOzsgKGlmIGl0J3Mgc3VjaCkgb3IgYXMgZnVuY3Rpb24gaW52b2thdGlvbiBmb3JtLlxuICAgIChjb25kICgobm90IChpZGVudGljYWw/IGV4cGFuc2lvbiBmb3JtKSkgKGFuYWx5emUgZW52IGV4cGFuc2lvbikpXG4gICAgICAgICAgKGFuYWx5emVyIChhbmFseXplLXNwZWNpYWwgYW5hbHl6ZXIgZW52IGV4cGFuc2lvbikpXG4gICAgICAgICAgKGVsc2UgKGFuYWx5emUtaW52b2tlIGVudiBleHBhbnNpb24pKSkpKVxuXG4oZGVmdW4gYW5hbHl6ZS12ZWN0b3JcbiAgKGVudiBmb3JtKVxuICAobGV0KiAoKGl0ZW1zICh2ZWMgKG1hcCAobGFtYmRhICglKSAoYW5hbHl6ZSBlbnYgJSkpIGZvcm0pKSkpXG4gICAgezpvcCA6dmVjdG9yXG4gICAgIDpmb3JtIGZvcm1cbiAgICAgOml0ZW1zIGl0ZW1zfSkpXG5cbihkZWZ1biBhbmFseXplLWRpY3Rpb25hcnlcbiAgKGVudiBmb3JtKVxuICAobGV0KiAoKG5hbWVzICh2ZWMgKG1hcCAobGFtYmRhICglKSAoYW5hbHl6ZSBlbnYgJSkpIChrZXlzIGZvcm0pKSkpXG4gICAgICAgICh2YWx1ZXMgKHZlYyAobWFwIChsYW1iZGEgKCUpIChhbmFseXplIGVudiAlKSkgKHZhbHMgZm9ybSkpKSkpXG4gICAgezpvcCA6ZGljdGlvbmFyeVxuICAgICA6a2V5cyBuYW1lc1xuICAgICA6dmFsdWVzIHZhbHVlc1xuICAgICA6Zm9ybSBmb3JtfSkpXG5cbihkZWZ1biBhbmFseXplLWludm9rZVxuICAoZW52IGZvcm0pXG4gIFwiUmV0dXJucyBub2RlIG9mIDppbnZva2UgdHlwZSwgcmVwcmVzZW50aW5nIGEgZnVuY3Rpb24gY2FsbC4gSW5cbiAgYWRkaXRpb24gdG8gcmVndWxhciBwcm9wZXJ0aWVzIHRoaXMgbm9kZSBjb250YWlucyA6Y2FsbGVlIG1hcHBlZFxuICB0byBhIG5vZGUgdGhhdCBpcyBiZWluZyBpbnZva2VkIGFuZCA6cGFyYW1zIHRoYXQgaXMgYW4gdmVjdG9yIG9mXG4gIHBhcmFtdGVyIGV4cHJlc3Npb25zIHRoYXQgOmNhbGxlZSBpcyBpbnZva2VkIHdpdGguXCJcbiAgKGxldCogKChjYWxsZWUgKGFuYWx5emUgZW52IChmaXJzdCBmb3JtKSkpXG4gICAgICAgIChwYXJhbXMgKHZlYyAobWFwIChsYW1iZGEgKCUpIChhbmFseXplIGVudiAlKSkgKHJlc3QgZm9ybSkpKSkpXG4gICAgezpvcCA6aW52b2tlXG4gICAgIDpjYWxsZWUgY2FsbGVlXG4gICAgIDpwYXJhbXMgcGFyYW1zXG4gICAgIDpmb3JtIGZvcm19KSlcblxuKGRlZnVuIGFuYWx5emUtY29uc3RhbnRcbiAgKGVudiBmb3JtKVxuICBcIlJldHVybnMgYSBub2RlIHJlcHJlc2VudGluZyBhIGNvbnRzdGFudCB2YWx1ZSB3aGljaCBpc1xuICBtb3N0IGNlcnRhaW5seSBhIHByaW1pdGl2ZSB2YWx1ZSBsaXRlcmFsIHRoaXMgZm9ybSBjYW50YWluc1xuICBubyBleHRyYSBpbmZvcm1hdGlvbi5cIlxuICB7Om9wIDpjb25zdGFudFxuICAgOmZvcm0gZm9ybX0pXG5cbihkZWZ1biBhbmFseXplXG4gICgmcmVzdCBhcmdzKVxuICBcIlRha2VzIGEgaGFzaCByZXByZXNlbnRpbmcgYSBnaXZlbiBlbnZpcm9ubWVudCBhbmQgYGZvcm1gIHRvIGJlXG4gIGFuYWx5emVkLiBFbnZpcm9ubWVudCBtYXkgY29udGFpbiBmb2xsb3dpbmcgZW50cmllczpcblxuICA6bG9jYWxzICAtIEhhc2ggb2YgdGhlIGdpdmVuIGVudmlyb25tZW50cyBiaW5kaW5ncyBtYXBwZWR5IGJ5IGJpbmRpbmcgbmFtZS5cbiAgOmNvbnRleHQgLSBPbmUgb2YgdGhlIGZvbGxvd2luZyA6c3RhdGVtZW50LCA6ZXhwcmVzc2lvbiwgOnJldHVybi4gVGhhdFxuICAgICAgICAgICAgIGluZm9ybWF0aW9uIGlzIGluY2x1ZGVkIGluIHJlc3VsdGluZyBub2RlcyBhbmQgaXMgbWVhbnQgZm9yXG4gICAgICAgICAgICAgd3JpdGVyIHRoYXQgbWF5IG91dHB1dCBkaWZmZXJlbnQgZm9ybXMgYmFzZWQgb24gY29udGV4dC5cbiAgOm5zICAgICAgLSBOYW1lc3BhY2Ugb2YgdGhlIGZvcm1zIGJlaW5nIGFuYWx5emVkLlxuXG4gIEFuYWx5emVyIHBlcmZvcm1zIGFsbCB0aGUgbWFjcm8gJiBzeW50YXggZXhwYW5zaW9ucyBhbmQgdHJhbnNmb3JtcyBmb3JtXG4gIGludG8gQVNUIG5vZGUgb2YgYW4gZXhwcmVzc2lvbi4gRWFjaCBzdWNoIG5vZGUgY29udGFpbnMgYXQgbGVhc3QgZm9sbG93aW5nXG4gIHByb3BlcnRpZXM6XG5cbiAgOm9wICAgLSBPcGVyYXRpb24gdHlwZSBvZiB0aGUgZXhwcmVzc2lvbi5cbiAgOmZvcm0gLSBHaXZlbiBmb3JtLlxuXG4gIEJhc2VkIG9uIDpvcCBub2RlIG1heSBjb250YWluIGRpZmZlcmVudCBzZXQgb2YgcHJvcGVydGllcy5cIlxuICAoaWYgKGlkZW50aWNhbD8gKGNvdW50IGFyZ3MpIDEpXG4gICAgKGFuYWx5emUgezpsb2NhbHMge31cbiAgICAgICAgICAgICAgOmJpbmRpbmdzIFtdXG4gICAgICAgICAgICAgIDp0b3AgdHJ1ZX0gKGZpcnN0IGFyZ3MpKVxuICAgIChsZXQqICgoZW52IChmaXJzdCBhcmdzKSkgKGZvcm0gKHNlY29uZCBhcmdzKSkpXG4gICAgICAoY29uZCAoKG5pbD8gZm9ybSkgKGFuYWx5emUtY29uc3RhbnQgZW52IGZvcm0pKVxuICAgICAgICAgICAgKChzeW1ib2w/IGZvcm0pIChhbmFseXplLXN5bWJvbCBlbnYgZm9ybSkpXG4gICAgICAgICAgICAoKGxpc3Q/IGZvcm0pIChpZiAoZW1wdHk/IGZvcm0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAoYW5hbHl6ZS1xdW90ZWQgZm9ybSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIChhbmFseXplLWxpc3QgZW52IGZvcm0pKSlcbiAgICAgICAgICAgICgoZGljdGlvbmFyeT8gZm9ybSkgKGFuYWx5emUtZGljdGlvbmFyeSBlbnYgZm9ybSkpXG4gICAgICAgICAgICAoKHZlY3Rvcj8gZm9ybSkgKGFuYWx5emUtdmVjdG9yIGVudiBmb3JtKSlcbiAgICAgICAgICAgIDsoc2V0PyBmb3JtKSAoYW5hbHl6ZS1zZXQgZW52IGZvcm0gbmFtZSlcbiAgICAgICAgICAgICgoa2V5d29yZD8gZm9ybSkgKGFuYWx5emUta2V5d29yZCBlbnYgZm9ybSkpXG4gICAgICAgICAgICAoZWxzZSAoYW5hbHl6ZS1jb25zdGFudCBlbnYgZm9ybSkpKSkpKVxuIl19
