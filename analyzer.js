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
        var scopeø2 = conj(scopeø1, { 'arrow': arrowø1 });
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
            'id': bindingø1,
            'variadic': variadicø1,
            'methods': methodsø1,
            'form': form
        };
    }.call(this);
};
installSpecial('fn*', analyzeFn);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndpc3AvYW5hbHl6ZXIud2lzcCJdLCJuYW1lcyI6WyJfbnNfIiwiaWQiLCJkb2MiLCJtZXRhIiwid2l0aE1ldGEiLCJpc1N5bWJvbCIsImlzS2V5d29yZCIsImlzUXVvdGUiLCJzeW1ib2wiLCJuYW1lc3BhY2UiLCJuYW1lIiwicHJTdHIiLCJpc1VucXVvdGUiLCJpc1VucXVvdGVTcGxpY2luZyIsImlzTGlzdCIsImxpc3QiLCJjb25qIiwicGFydGl0aW9uIiwic2VxIiwiaXNFbXB0eSIsIm1hcCIsInZlYyIsImlzRXZlcnkiLCJjb25jYXQiLCJmaXJzdCIsInNlY29uZCIsInRoaXJkIiwicmVzdCIsImxhc3QiLCJidXRsYXN0IiwiaW50ZXJsZWF2ZSIsImNvbnMiLCJjb3VudCIsInNvbWUiLCJhc3NvYyIsInJlZHVjZSIsImZpbHRlciIsImlzU2VxIiwiZHJvcCIsImlzTmlsIiwiaXNEaWN0aW9uYXJ5IiwiaXNWZWN0b3IiLCJrZXlzIiwidmFscyIsImlzU3RyaW5nIiwiaXNOdW1iZXIiLCJpc0Jvb2xlYW4iLCJpc0RhdGUiLCJpc1JlUGF0dGVybiIsImlzRXZlbiIsImlzRXF1YWwiLCJtYXgiLCJkZWMiLCJkaWN0aW9uYXJ5Iiwic3VicyIsImluYyIsIm1hY3JvZXhwYW5kIiwic3BsaXQiLCJqb2luIiwic3ludGF4RXJyb3IiLCJleHBvcnRzIiwibWVzc2FnZSIsImZvcm0iLCJtZXRhZGF0YcO4MSIsImxpbmXDuDEiLCJ1cmnDuDEiLCJjb2x1bW7DuDEiLCJlcnJvcsO4MSIsIlN5bnRheEVycm9yIiwibGluZU51bWJlciIsImxpbmUiLCJjb2x1bW5OdW1iZXIiLCJjb2x1bW4iLCJmaWxlTmFtZSIsInVyaSIsImFuYWx5emVLZXl3b3JkIiwiZW52IiwiX19zcGVjaWFsc19fIiwiaW5zdGFsbFNwZWNpYWwiLCJvcCIsImFuYWx5emVyIiwiYW5hbHl6ZVNwZWNpYWwiLCJhc3TDuDEiLCJhbmFseXplSWYiLCJmb3Jtc8O4MSIsImVsc2VUYWlsw7gxIiwiZWxzZUZvcm3DuDEiLCJ0ZXN0w7gxIiwiYW5hbHl6ZSIsImNvbnNlcXVlbnTDuDEiLCJhbHRlcm5hdGXDuDEiLCJhbmFseXplVGhyb3ciLCJleHByZXNzaW9uw7gxIiwiYW5hbHl6ZVRyeSIsInRhaWzDuDEiLCJmaW5hbGl6ZXJGb3Jtw7gxIiwiZmluYWxpemVyw7gxIiwiYW5hbHl6ZUJsb2NrIiwiYm9keUZvcm3DuDEiLCJ0YWlsw7gyIiwiaGFuZGxlckZvcm3DuDEiLCJoYW5kbGVyw7gxIiwiYm9kecO4MSIsInN1YkVudiIsImFuYWx5emVTZXQiLCJsZWZ0w7gxIiwicmlnaHTDuDEiLCJ0YXJnZXTDuDEiLCJhbmFseXplU3ltYm9sIiwiYW5hbHl6ZUxpc3QiLCJ2YWx1ZcO4MSIsImFuYWx5emVOZXciLCJjb25zdHJ1Y3RvcsO4MSIsInBhcmFtc8O4MSIsIiQiLCJhbmFseXplQWdldCIsImF0dHJpYnV0ZcO4MSIsImZpZWxkw7gxIiwiYW5hbHl6ZUlkZW50aWZpZXIiLCJwYXJzZURlZiIsImFyZ3MiLCJhbmFseXplRGVmIiwib3DDuDEiLCJwcml2YXRlw7gxIiwiaWTDuDEiLCJiaW5kaW5nw7gxIiwiYW5hbHl6ZURlY2xhcmF0aW9uIiwiaW5pdMO4MSIsImRvY8O4MSIsImFuYWx5emVEbyIsImV4cHJlc3Npb25zw7gxIiwiY2hlY2tBcnJvd1Jlc3RyaWN0aW9uIiwicmVzb2x2ZUJpbmRpbmciLCJzdGFydMO4MSIsImVuZMO4MSIsImV4cGFuc2lvbsO4MSIsInVucmVzb2x2ZWRCaW5kaW5nIiwiYW5hbHl6ZVNoYWRvdyIsImFuYWx5emVCaW5kaW5nIiwiYW5hbHl6ZVBhcmFtIiwid2l0aEJpbmRpbmciLCJ3aXRoUGFyYW0iLCJhbmFseXplTGV0XyIsImlzTG9vcCIsImJpbmRpbmdzw7gxIiwiaXNWYWxpZEJpbmRpbmdzw7gxIiwiX8O4MSIsInNjb3Blw7gxIiwiJDEiLCIkMiIsImJpbmRpbmdzw7gyIiwiZXhwcmVzc2lvbnPDuDIiLCJhbmFseXplTGV0IiwiYW5hbHl6ZUxvb3AiLCJhbmFseXplUmVjdXIiLCJhbmFseXplUXVvdGVkTGlzdCIsImFuYWx5emVRdW90ZWQiLCJhbmFseXplUXVvdGVkVmVjdG9yIiwiYW5hbHl6ZVF1b3RlZERpY3Rpb25hcnkiLCJuYW1lc8O4MSIsInZhbHVlc8O4MSIsImFuYWx5emVRdW90ZWRTeW1ib2wiLCJhbmFseXplUXVvdGVkS2V5d29yZCIsImFuYWx5emVRdW90ZSIsImFuYWx5emVTdGF0ZW1lbnQiLCJzdGF0ZW1lbnRzw7gxIiwic3RhdGVtZW50w7gxIiwiZGVmc8O4MSIsInJlc3VsdMO4MSIsImFuYWx5emVGbk1ldGhvZCIsInNpZ25hdHVyZcO4MSIsInZhcmlhZGljw7gxIiwiYXJpdHnDuDEiLCJhbmFseXplRm4iLCJmb3Jtc8O4MiIsIm92ZXJsb2Fkc8O4MSIsImFycm93w7gxIiwic2NvcGXDuDIiLCJtZXRob2Rzw7gxIiwicGFyc2VSZWZlcmVuY2VzIiwiZm9ybXMiLCJyZWZlcmVuY2VzIiwicGFyc2VSZXF1aXJlIiwicmVxdWlyZW1lbnTDuDEiLCJyZW5hbWVzw7gxIiwiYWxpYXPDuDEiLCJyZWZlcmVuY2Vzw7gxIiwicmVmZXJzIiwicmVmZXJlbmNlIiwiYW5hbHl6ZU5zIiwibmFtZcO4MSIsInJlcXVpcmVtZW50c8O4MSIsIm9wZXJhdG9yw7gxIiwiYW5hbHl6ZXLDuDEiLCJhbmFseXplSW52b2tlIiwiYW5hbHl6ZVZlY3RvciIsIml0ZW1zw7gxIiwiYW5hbHl6ZURpY3Rpb25hcnkiLCJjYWxsZWXDuDEiLCJhbmFseXplQ29uc3RhbnQiLCJlbnbDuDEiLCJmb3Jtw7gxIl0sIm1hcHBpbmdzIjoiO0lBQUEsSUFBQ0EsSSxHQUFEO0FBQUEsUUFBQUMsRSxFQUFJLGVBQUo7QUFBQSxRQUFBQyxHLEVBQUE7QUFBQSxNOztRQUM4QkMsSUFBQSxHLFNBQUFBLEk7UUFBS0MsUUFBQSxHLFNBQUFBLFE7UUFBVUMsUUFBQSxHLFNBQUFBLFE7UUFBUUMsU0FBQSxHLFNBQUFBLFM7UUFDdkJDLE9BQUEsRyxTQUFBQSxPO1FBQU9DLE1BQUEsRyxTQUFBQSxNO1FBQU9DLFNB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QW5CLEdBQ1FwTSxRQUFELENBQVNvTSxNQUFULEMsZ0JBQWU7QUFBQSxtQkFBQzdGLGFBQUQsQ0FBZ0I0RixLQUFoQixFQUFvQkMsTUFBcEI7QUFBQSxTLENBQUEsRSxHQUNkM0wsTUFBRCxDQUFPMkwsTUFBUCxDLGdCQUFhO0FBQUEsbUJBQUt0TCxPQUFELENBQVFzTCxNQUFSLENBQUosR0FDRTdDLGFBQUQsQ0FBZ0I2QyxNQUFoQixDQURELEdBRUU1RixXQUFELENBQWMyRixLQUFkLEVBQWtCQyxNQUFsQixDQUZEO0FBQUEsUyxDQUFBLEUsR0FHWmpLLFlBQUQsQ0FBYWlLLE1BQWIsQyxnQkFBbUI7QUFBQSxtQkFBQ0osaUJBQUQsQ0FBb0JHLEtBQXBCLEVBQXdCQyxNQUF4QjtBQUFBLFMsQ0FBQSxFLEdBQ2xCaEssUUFBRCxDQUFTZ0ssTUFBVCxDLGdCQUFlO0FBQUEsbUJBQUNOLGFBQUQsQ0FBZ0JLLEtBQWhCLEVBQW9CQyxNQUFwQjtBQUFBLFMsQ0FBQSxFLEdBRWRuTSxTQUFELENBQVVtTSxNQUFWLEMsZ0JBQWdCO0FBQUEsbUJBQUM5SCxjQUFELENBQWlCNkgsS0FBakIsRUFBcUJDLE1BQXJCO0FBQUEsUyxDQUFBLEUsZ0JBQ1g7QUFBQSxtQkFBQ0YsZUFBRCxDQUFrQkMsS0FBbEIsRUFBc0JDLE1BQXRCO0FBQUEsUyxDQUFBLEVBVFosQ0FETTtBQUFBLEssS0FBUixDLElBQUEsQ0FKRixDO0NBbkJGIiwic291cmNlc0NvbnRlbnQiOlsiKG5zIHdpc3AuYW5hbHl6ZXJcbiAgKDpyZXF1aXJlIFt3aXNwLmFzdCA6cmVmZXIgW21ldGEgd2l0aC1tZXRhIHN5bWJvbD8ga2V5d29yZD9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1b3RlPyBzeW1ib2wgbmFtZXNwYWNlIG5hbWUgcHItc3RyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bnF1b3RlPyB1bnF1b3RlLXNwbGljaW5nP11dXG4gICAgICAgICAgICBbd2lzcC5zZXF1ZW5jZSA6cmVmZXIgW2xpc3Q/IGxpc3QgY29uaiBwYXJ0aXRpb24gc2VxXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVtcHR5PyBtYXAgdmVjIGV2ZXJ5PyBjb25jYXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3Qgc2Vjb25kIHRoaXJkIHJlc3QgbGFzdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidXRsYXN0IGludGVybGVhdmUgY29ucyBjb3VudFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb21lIGFzc29jIHJlZHVjZSBmaWx0ZXIgc2VxPyBkcm9wXV1cbiAgICAgICAgICAgIFt3aXNwLnJ1bnRpbWUgOnJlZmVyIFtuaWw/IGRpY3Rpb25hcnk/IHZlY3Rvcj8ga2V5c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHMgc3RyaW5nPyBudW1iZXI/IGJvb2xlYW4/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZT8gcmUtcGF0dGVybj8gZXZlbj8gPSBtYXhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWMgZGljdGlvbmFyeSBzdWJzIGluYyBkZWNdXVxuICAgICAgICAgICAgW3dpc3AuZXhwYW5kZXIgOnJlZmVyIFttYWNyb2V4cGFuZF1dXG4gICAgICAgICAgICBbd2lzcC5zdHJpbmcgOnJlZmVyIFtzcGxpdCBqb2luXV0pKVxuXG4oZGVmdW4gc3ludGF4LWVycm9yXG4gIChtZXNzYWdlIGZvcm0pXG4gIChsZXQqICgobWV0YWRhdGEgKG1ldGEgZm9ybSkpXG4gICAgICAgIChsaW5lICg6bGluZSAoOnN0YXJ0IG1ldGFkYXRhKSkpXG4gICAgICAgICh1cmkgKDp1cmkgbWV0YWRhdGEpKVxuICAgICAgICAoY29sdW1uICg6Y29sdW1uICg6c3RhcnQgbWV0YWRhdGEpKSlcbiAgICAgICAgKGVycm9yIChTeW50YXhFcnJvciAoc3RyIG1lc3NhZ2UgXCJcXG5cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkZvcm06IFwiIChwci1zdHIgZm9ybSkgXCJcXG5cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlVSSTogXCIgdXJpIFwiXFxuXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJMaW5lOiBcIiBsaW5lIFwiXFxuXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2x1bW46IFwiIGNvbHVtbikpKSlcbiAgICAoc2V0ZiBlcnJvci5saW5lTnVtYmVyIGxpbmUpXG4gICAgKHNldGYgZXJyb3IubGluZSBsaW5lKVxuICAgIChzZXRmIGVycm9yLmNvbHVtbk51bWJlciBjb2x1bW4pXG4gICAgKHNldGYgZXJyb3IuY29sdW1uIGNvbHVtbilcbiAgICAoc2V0ZiBlcnJvci5maWxlTmFtZSB1cmkpXG4gICAgKHNldGYgZXJyb3IudXJpIHVyaSlcbiAgICAodGhyb3cgZXJyb3IpKSlcblxuXG4oZGVmdW4gYW5hbHl6ZS1rZXl3b3JkXG4gIChlbnYgZm9ybSlcbiAgXCJFeGFtcGxlOlxuICAoYW5hbHl6ZS1rZXl3b3JkIHt9IDpmb28pID0+IHs6b3AgOmNvbnN0YW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtICc6Zm9vXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDplbnYge319XCJcbiAgezpvcCA6Y29uc3RhbnRcbiAgIDpmb3JtIGZvcm19KVxuXG4oZGVmdmFyICoqc3BlY2lhbHMqKiB7fSlcblxuKGRlZnVuIGluc3RhbGwtc3BlY2lhbCFcbiAgKG9wIGFuYWx5emVyKVxuICAoc2V0ZiAoZ2V0ICoqc3BlY2lhbHMqKiAobmFtZSBvcCkpIGFuYWx5emVyKSlcblxuKGRlZnVuIGFuYWx5emUtc3BlY2lhbFxuICAoYW5hbHl6ZXIgZW52IGZvcm0pXG4gIChsZXQqICgobWV0YWRhdGEgKG1ldGEgZm9ybSkpXG4gICAgICAgIChhc3QgKGFuYWx5emVyIGVudiBmb3JtKSkpXG4gICAgKGNvbmogezpzdGFydCAoOnN0YXJ0IG1ldGFkYXRhKVxuICAgICAgICAgICA6ZW5kICg6ZW5kIG1ldGFkYXRhKX1cbiAgICAgICAgICBhc3QpKSlcblxuKGRlZnVuIGFuYWx5emUtaWZcbiAgKGVudiBmb3JtKVxuICBcIkV4YW1wbGU6XG4gIChhbmFseXplLWlmIHt9ICcoaWYgbW9uZGF5PyA6eWVwIDpub3BlKSkgPT4gezpvcCA6aWZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gJyhpZiBtb25kYXk/IDp5ZXAgOm5vcGUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDplbnYge31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnRlc3QgezpvcCA6dmFyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Zm9ybSAnbW9uZGF5P1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmluZm8gbmlsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ZW52IHt9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Y29uc2VxdWVudCB7Om9wIDpjb25zdGFudFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gJzp5ZXBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDp0eXBlIDprZXl3b3JkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ZW52IHt9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6YWx0ZXJuYXRlIHs6b3AgOmNvbnN0YW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtICc6bm9wZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6dHlwZSA6a2V5d29yZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ZW52IHt9fX1cIlxuICAobGV0KiAoKGZvcm1zIChyZXN0IGZvcm0pKVxuICAgICAgICA7OyBFbWFjcy1MaXNwIHNoYXBlOiB0aGUgZWxzZSBUQUlMIChldmVyeXRoaW5nIGFmdGVyIHRoZVxuICAgICAgICA7OyBjb25zZXF1ZW50KSBpcyBhbiBpbXBsaWNpdCBgcHJvZ25gLCBub3QganVzdCBhIHNpbmdsZSBmb3JtLlxuICAgICAgICAoZWxzZS10YWlsIChkcm9wIDIgZm9ybXMpKVxuICAgICAgICAoZWxzZS1mb3JtIChjb25kICgoZW1wdHk/IGVsc2UtdGFpbCkgbmlsKVxuICAgICAgICAgICAgICAgICAgICAgICAgKChpZGVudGljYWw/IChjb3VudCBlbHNlLXRhaWwpIDEpIChmaXJzdCBlbHNlLXRhaWwpKVxuICAgICAgICAgICAgICAgICAgICAgICAgKGVsc2UgKGNvbnMgJ3Byb2duIGVsc2UtdGFpbCkpKSlcbiAgICAgICAgKHRlc3QgKGFuYWx5emUgZW52IChmaXJzdCBmb3JtcykpKVxuICAgICAgICAoY29uc2VxdWVudCAoYW5hbHl6ZSBlbnYgKHNlY29uZCBmb3JtcykpKVxuICAgICAgICAoYWx0ZXJuYXRlIChhbmFseXplIGVudiBlbHNlLWZvcm0pKSlcbiAgICAoaWYgKDwgKGNvdW50IGZvcm1zKSAyKVxuICAgICAgKHN5bnRheC1lcnJvciBcIk1hbGZvcm1lZCBpZiBleHByZXNzaW9uLCB0b28gZmV3IG9wZXJhbmRzXCIgZm9ybSkpXG4gICAgezpvcCA6aWZcbiAgICAgOmZvcm0gZm9ybVxuICAgICA6dGVzdCB0ZXN0XG4gICAgIDpjb25zZXF1ZW50IGNvbnNlcXVlbnRcbiAgICAgOmFsdGVybmF0ZSBhbHRlcm5hdGV9KSlcblxuKGluc3RhbGwtc3BlY2lhbCEgOmlmIGFuYWx5emUtaWYpXG5cbihkZWZ1biBhbmFseXplLXRocm93XG4gIChlbnYgZm9ybSlcbiAgXCJFeGFtcGxlOlxuICAoYW5hbHl6ZS10aHJvdyB7fSAnKHRocm93IChFcnJvciA6Ym9vbSkpKSA9PiB7Om9wIDp0aHJvd1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gJyh0aHJvdyAoRXJyb3IgOmJvb20pKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnRocm93IHs6b3AgOmludm9rZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Y2FsbGVlIHs6b3AgOnZhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Zm9ybSAnRXJyb3JcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmluZm8gbmlsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDplbnYge319XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpwYXJhbXMgW3s6b3AgOmNvbnN0YW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6dHlwZSA6a2V5d29yZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gJzpib29tXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ZW52IHt9fV19fVwiXG4gIChsZXQqICgoZXhwcmVzc2lvbiAoYW5hbHl6ZSBlbnYgKHNlY29uZCBmb3JtKSkpKVxuICAgIHs6b3AgOnRocm93XG4gICAgIDpmb3JtIGZvcm1cbiAgICAgOnRocm93IGV4cHJlc3Npb259KSlcblxuKGluc3RhbGwtc3BlY2lhbCEgOnRocm93IGFuYWx5emUtdGhyb3cpXG5cbihkZWZ1biBhbmFseXplLXRyeVxuICAoZW52IGZvcm0pXG4gIChsZXQqICgoZm9ybXMgKHZlYyAocmVzdCBmb3JtKSkpXG5cbiAgICAgICAgOzsgRmluYWxseVxuICAgICAgICAodGFpbCAobGFzdCBmb3JtcykpXG4gICAgICAgIChmaW5hbGl6ZXItZm9ybSAoaWYgKGFuZCAobGlzdD8gdGFpbClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKD0gJ2ZpbmFsbHkgKGZpcnN0IHRhaWwpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAocmVzdCB0YWlsKSkpXG4gICAgICAgIChmaW5hbGl6ZXIgKGlmIGZpbmFsaXplci1mb3JtXG4gICAgICAgICAgICAgICAgICAgIChhbmFseXplLWJsb2NrIGVudiBmaW5hbGl6ZXItZm9ybSkpKVxuXG4gICAgICAgIDs7IGNhdGNoXG4gICAgICAgIChib2R5LWZvcm0gKGlmIGZpbmFsaXplclxuICAgICAgICAgICAgICAgICAgICAoYnV0bGFzdCBmb3JtcylcbiAgICAgICAgICAgICAgICAgICAgZm9ybXMpKVxuXG4gICAgICAgICh0YWlsIChsYXN0IGJvZHktZm9ybSkpXG4gICAgICAgIChoYW5kbGVyLWZvcm0gKGlmIChhbmQgKGxpc3Q/IHRhaWwpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoPSAnY2F0Y2ggKGZpcnN0IHRhaWwpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgKHJlc3QgdGFpbCkpKVxuICAgICAgICAoaGFuZGxlciAoaWYgaGFuZGxlci1mb3JtXG4gICAgICAgICAgICAgICAgICAoY29uaiB7Om5hbWUgKGFuYWx5emUgZW52IChmaXJzdCBoYW5kbGVyLWZvcm0pKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIChhbmFseXplLWJsb2NrIGVudiAocmVzdCBoYW5kbGVyLWZvcm0pKSkpKVxuXG4gICAgICAgIDs7IFRyeVxuICAgICAgICAoYm9keSAoaWYgaGFuZGxlci1mb3JtXG4gICAgICAgICAgICAgICAoYW5hbHl6ZS1ibG9jayAoc3ViLWVudiBlbnYpIChidXRsYXN0IGJvZHktZm9ybSkpXG4gICAgICAgICAgICAgICAoYW5hbHl6ZS1ibG9jayAoc3ViLWVudiBlbnYpIGJvZHktZm9ybSkpKSlcbiAgICB7Om9wIDp0cnlcbiAgICAgOmZvcm0gZm9ybVxuICAgICA6Ym9keSBib2R5XG4gICAgIDpoYW5kbGVyIGhhbmRsZXJcbiAgICAgOmZpbmFsaXplciBmaW5hbGl6ZXJ9KSlcblxuKGluc3RhbGwtc3BlY2lhbCEgOnRyeSBhbmFseXplLXRyeSlcblxuKGRlZnVuIGFuYWx5emUtc2V0IVxuICAoZW52IGZvcm0pXG4gIChsZXQqICgoYm9keSAocmVzdCBmb3JtKSlcbiAgICAgICAgKGxlZnQgKGZpcnN0IGJvZHkpKVxuICAgICAgICAocmlnaHQgKHNlY29uZCBib2R5KSlcbiAgICAgICAgKHRhcmdldCAoY29uZCAoKHN5bWJvbD8gbGVmdCkgKGFuYWx5emUtc3ltYm9sIGVudiBsZWZ0KSlcbiAgICAgICAgICAgICAgICAgICAgICgobGlzdD8gbGVmdCkgKGFuYWx5emUtbGlzdCBlbnYgbGVmdCkpXG4gICAgICAgICAgICAgICAgICAgICAoZWxzZSBsZWZ0KSkpXG4gICAgICAgICh2YWx1ZSAoYW5hbHl6ZSBlbnYgcmlnaHQpKSlcbiAgICB7Om9wIDpzZXQhXG4gICAgIDp0YXJnZXQgdGFyZ2V0XG4gICAgIDp2YWx1ZSB2YWx1ZVxuICAgICA6Zm9ybSBmb3JtfSkpXG4oaW5zdGFsbC1zcGVjaWFsISA6c2V0ISBhbmFseXplLXNldCEpXG5cbihkZWZ1biBhbmFseXplLW5ld1xuICAoZW52IGZvcm0pXG4gIChsZXQqICgoYm9keSAocmVzdCBmb3JtKSlcbiAgICAgICAgKGNvbnN0cnVjdG9yIChhbmFseXplIGVudiAoZmlyc3QgYm9keSkpKVxuICAgICAgICAocGFyYW1zICh2ZWMgKG1hcCAobGFtYmRhICglKSAoYW5hbHl6ZSBlbnYgJSkpIChyZXN0IGJvZHkpKSkpKVxuICAgIHs6b3AgOm5ld1xuICAgICA6Y29uc3RydWN0b3IgY29uc3RydWN0b3JcbiAgICAgOmZvcm0gZm9ybVxuICAgICA6cGFyYW1zIHBhcmFtc30pKVxuKGluc3RhbGwtc3BlY2lhbCEgOm5ldyBhbmFseXplLW5ldylcblxuKGRlZnVuIGFuYWx5emUtYWdldFxuICAoZW52IGZvcm0pXG4gIChsZXQqICgoYm9keSAocmVzdCBmb3JtKSlcbiAgICAgICAgKHRhcmdldCAoYW5hbHl6ZSBlbnYgKGZpcnN0IGJvZHkpKSlcbiAgICAgICAgKGF0dHJpYnV0ZSAoc2Vjb25kIGJvZHkpKVxuICAgICAgICAoZmllbGQgKGFuZCAocXVvdGU/IGF0dHJpYnV0ZSlcbiAgICAgICAgICAgICAgICAgICAoc3ltYm9sPyAoc2Vjb25kIGF0dHJpYnV0ZSkpXG4gICAgICAgICAgICAgICAgICAgKHNlY29uZCBhdHRyaWJ1dGUpKSkpXG4gICAgKGlmIChuaWw/IGF0dHJpYnV0ZSlcbiAgICAgIChzeW50YXgtZXJyb3IgXCJNYWxmb3JtZWQgYWdldC9hcmVmIGV4cHJlc3Npb24gZXhwZWN0ZWQgKGFnZXQgb2JqZWN0IG1lbWJlcilcIlxuICAgICAgICAgICAgICAgICAgICBmb3JtKVxuICAgICAgezpvcCA6bWVtYmVyLWV4cHJlc3Npb25cbiAgICAgICA6Y29tcHV0ZWQgKG5vdCBmaWVsZClcbiAgICAgICA6Zm9ybSBmb3JtXG4gICAgICAgOnRhcmdldCB0YXJnZXRcbiAgICAgICA7OyBJZiBmaWVsZCBpcyBhIHF1b3RlZCBzeW1ib2wgdGhlcmUncyBubyBuZWVkIHRvIHJlc29sdmVcbiAgICAgICA7OyBpdCBmb3IgaW5mb1xuICAgICAgIDpwcm9wZXJ0eSAoaWYgZmllbGRcbiAgICAgICAgICAgICAgICAgICAoY29uaiAoYW5hbHl6ZS1zcGVjaWFsIGFuYWx5emUtaWRlbnRpZmllciBlbnYgZmllbGQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgezpiaW5kaW5nIG5pbH0pXG4gICAgICAgICAgICAgICAgICAgKGFuYWx5emUgZW52IGF0dHJpYnV0ZSkpfSkpKVxuKGluc3RhbGwtc3BlY2lhbCEgOmFnZXQgYW5hbHl6ZS1hZ2V0KVxuOzsgYGFyZWZgIGlzIHRoZSB0cmFkaXRpb25hbC1MaXNwIHNwZWxsaW5nIG9mIHRoZSBzYW1lIHBsYWNlIGFjY2Vzcztcbjs7IHRoZSBzcGVjIChkb2NzL2xhbmd1YWdlLm1kKSBkb2N1bWVudHMgKGFyZWYgb2JqIGtleSkgd2l0aCBgYWdldGAga2VwdFxuOzsgYXMgdGhlIGFsaWFzLlxuKGluc3RhbGwtc3BlY2lhbCEgOmFyZWYgYW5hbHl6ZS1hZ2V0KVxuXG4oZGVmdW4gcGFyc2UtZGVmXG4gIChpZCAmcmVzdCBhcmdzKVxuICAoY29uZCAoKGVtcHR5PyBhcmdzKSB7OmlkIGlkfSlcbiAgICAgICAgKChpZGVudGljYWw/IChjb3VudCBhcmdzKSAxKSB7OmlkIGlkIDppbml0IChmaXJzdCBhcmdzKX0pXG4gICAgICAgIChlbHNlIHs6aWQgaWQgOmRvYyAoZmlyc3QgYXJncykgOmluaXQgKHNlY29uZCBhcmdzKX0pKSlcblxuKGRlZnVuIGFuYWx5emUtZGVmXG4gIChlbnYgZm9ybSlcbiAgXCJCYWNrcyBgZGVmdmFyYC9gZGVmdmFyLWAvYGRlZmNvbnN0YC9gZGVmY29uc3QtYC4gUHJpdmFjeSAod2hldGhlciB0aGVcbiAgYmluZGluZyBsYW5kcyBvbiBgZXhwb3J0c2ApIGlzIGRlY2lkZWQgYnkgd2hpY2ggb2YgdGhvc2UgZm91ciBoZWFkXG4gIHN5bWJvbHMgd2FzIHVzZWQgLS0gYSB0cmFpbGluZyBgLWAgbWVhbnMgcHJpdmF0ZSAtLSByYXRoZXIgdGhhbiBieVxuICBgXjpwcml2YXRlYCByZWFkZXIgbWV0YWRhdGEsIHdoaWNoIG5ldy1zeW50YXggZHJvcHMgZW50aXJlbHkuXCJcbiAgKGxldCogKChvcCAobmFtZSAoZmlyc3QgZm9ybSkpKVxuICAgICAgICAocHJpdmF0ZSAob3IgKGlkZW50aWNhbD8gb3AgXCJkZWZ2YXItXCIpXG4gICAgICAgICAgICAgICAgICAgIChpZGVudGljYWw/IG9wIFwiZGVmY29uc3QtXCIpKSlcbiAgICAgICAgKHBhcmFtcyAoYXBwbHkgcGFyc2UtZGVmICh2ZWMgKHJlc3QgZm9ybSkpKSlcbiAgICAgICAgKGlkICg6aWQgcGFyYW1zKSlcbiAgICAgICAgKG1ldGFkYXRhIChtZXRhIGlkKSlcblxuICAgICAgICAoYmluZGluZyAoYW5hbHl6ZS1zcGVjaWFsIGFuYWx5emUtZGVjbGFyYXRpb24gZW52IGlkKSlcblxuICAgICAgICAoaW5pdCAoYW5hbHl6ZSBlbnYgKDppbml0IHBhcmFtcykpKVxuXG4gICAgICAgIChkb2MgKG9yICg6ZG9jIHBhcmFtcylcbiAgICAgICAgICAgICAgICAoOmRvYyBtZXRhZGF0YSkpKSlcbiAgICB7Om9wIDpkZWZcbiAgICAgOmRvYyBkb2NcbiAgICAgOmlkIGJpbmRpbmdcbiAgICAgOmluaXQgaW5pdFxuICAgICA6ZXhwb3J0IChhbmQgKDp0b3AgZW52KVxuICAgICAgICAgICAgICAgICAgKG5vdCBwcml2YXRlKSlcbiAgICAgOmZvcm0gZm9ybX0pKVxuKGluc3RhbGwtc3BlY2lhbCEgOmRlZnZhciBhbmFseXplLWRlZilcbihpbnN0YWxsLXNwZWNpYWwhIDpkZWZ2YXItIGFuYWx5emUtZGVmKVxuKGluc3RhbGwtc3BlY2lhbCEgOmRlZmNvbnN0IGFuYWx5emUtZGVmKVxuKGluc3RhbGwtc3BlY2lhbCEgOmRlZmNvbnN0LSBhbmFseXplLWRlZilcblxuKGRlZnVuIGFuYWx5emUtZG9cbiAgKGVudiBmb3JtKVxuICAobGV0KiAoKGV4cHJlc3Npb25zIChyZXN0IGZvcm0pKVxuICAgICAgICAoYm9keSAoYW5hbHl6ZS1ibG9jayBlbnYgZXhwcmVzc2lvbnMpKSlcbiAgICAoY29uaiBib2R5IHs6b3AgOmRvXG4gICAgICAgICAgICAgICAgOmZvcm0gZm9ybX0pKSlcbihpbnN0YWxsLXNwZWNpYWwhIDpwcm9nbiBhbmFseXplLWRvKVxuXG4oZGVmdW4gY2hlY2stYXJyb3ctcmVzdHJpY3Rpb25cbiAgKGVudiBmb3JtKVxuICBcImxhbWJkYSogKGFycm93KSBib2RpZXMgaGF2ZSBubyBvd24gYHRoaXNgIC8gYGFyZ3VtZW50c2AuIEFuXG4gIHVucmVzb2x2ZWQgYmFyZSByZWZlcmVuY2UgdG8gZWl0aGVyIGluc2lkZSBhbiBhcnJvdyB3b3VsZCBzaWxlbnRseVxuICBjYXB0dXJlIHRoZSBlbmNsb3Npbmcgc2NvcGUncyBiaW5kaW5nIChvciB0aHJvdyBhdCBydW50aW1lKSwgc28gaXRcbiAgaXMgcmVqZWN0ZWQgdXAgZnJvbnQuIEEgcmVmZXJlbmNlIHRoYXQgcmVzb2x2ZXMgdG8gYSByZWFsIGJpbmRpbmdcbiAgKGEgcGFyYW0gb3IgYW4gb3V0ZXIgbG9jYWwpIGlzIGxlZ2l0aW1hdGUgc2hhZG93aW5nIGFuZCBwYXNzZXMuXCJcbiAgKGlmIChhbmQgKDphcnJvdyBlbnYpXG4gICAgICAgICAob3IgKGlkZW50aWNhbD8gKG5hbWUgZm9ybSkgXCJ0aGlzXCIpXG4gICAgICAgICAgICAgKGlkZW50aWNhbD8gKG5hbWUgZm9ybSkgXCJhcmd1bWVudHNcIikpXG4gICAgICAgICAoPSA6dW5yZXNvbHZlZC1iaW5kaW5nICg6b3AgKHJlc29sdmUtYmluZGluZyBlbnYgZm9ybSkpKSlcbiAgICAoc3ludGF4LWVycm9yIChzdHIgXCJsYW1iZGEqIGJvZHkgbWF5IG5vdCByZWZlcmVuY2UgXCIgKG5hbWUgZm9ybSlcbiAgICAgICAgICAgICAgICAgICAgICAgXCIgLS0gYXJyb3dzIGhhdmUgbm8gb3duIHRoaXMvYXJndW1lbnRzXCIpIGZvcm0pKSlcblxuKGRlZnVuIGFuYWx5emUtc3ltYm9sXG4gIChlbnYgZm9ybSlcbiAgXCJTeW1ib2wgYW5hbHl6ZXIgYWxzbyBkb2VzIHN5bnRheCBkZXN1Z2FyaW5nIGZvciB0aGUgc3ltYm9sc1xuICBsaWtlIGZvby5iYXIuYmF6IHByb2R1Y2luZyAoYWdldCBmb28gJ2Jhci5iYXopIGZvcm0uIFRoaXMgZW5hYmxlc1xuICByZW5hbWluZyBvZiBzaGFkb3dlZCBzeW1ib2xzLlwiXG4gIChjaGVjay1hcnJvdy1yZXN0cmljdGlvbiBlbnYgZm9ybSlcbiAgKGxldCogKChmb3JtcyAoc3BsaXQgKG5hbWUgZm9ybSkgXFwuKSlcbiAgICAgICAgKG1ldGFkYXRhIChtZXRhIGZvcm0pKVxuICAgICAgICAoc3RhcnQgKDpzdGFydCBtZXRhZGF0YSkpXG4gICAgICAgIChlbmQgKDplbmQgbWV0YWRhdGEpKVxuICAgICAgICAoZXhwYW5zaW9uIChpZiAoPiAoY291bnQgZm9ybXMpIDEpXG4gICAgICAgICAgICAgICAgICAgKGxpc3QgJ2FnZXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAod2l0aC1tZXRhIChzeW1ib2wgKGZpcnN0IGZvcm1zKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIChjb25qIG1ldGFkYXRhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7OnN0YXJ0IHN0YXJ0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmVuZCB7OmxpbmUgKDpsaW5lIGVuZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Y29sdW1uICgrIDEgKDpjb2x1bW4gc3RhcnQpIChjb3VudCAoZmlyc3QgZm9ybXMpKSl9fSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgKGxpc3QgJ3F1b3RlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHdpdGgtbWV0YSAoc3ltYm9sIChqb2luIFxcLiAocmVzdCBmb3JtcykpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGNvbmogbWV0YWRhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHs6ZW5kIGVuZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpzdGFydCB7OmxpbmUgKDpsaW5lIHN0YXJ0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmNvbHVtbiAoKyAxICg6Y29sdW1uIHN0YXJ0KSAoY291bnQgKGZpcnN0IGZvcm1zKSkpfX0pKSkpKSkpXG4gICAgKGlmIGV4cGFuc2lvblxuICAgICAgKGFuYWx5emUgZW52ICh3aXRoLW1ldGEgZXhwYW5zaW9uIChtZXRhIGZvcm0pKSlcbiAgICAgIChhbmFseXplLXNwZWNpYWwgYW5hbHl6ZS1pZGVudGlmaWVyIGVudiBmb3JtKSkpKVxuXG4oZGVmdW4gYW5hbHl6ZS1pZGVudGlmaWVyXG4gIChlbnYgZm9ybSlcbiAgezpvcCA6dmFyXG4gICA6dHlwZSA6aWRlbnRpZmllclxuICAgOmZvcm0gZm9ybVxuICAgOnN0YXJ0ICg6c3RhcnQgKG1ldGEgZm9ybSkpXG4gICA6ZW5kICg6ZW5kIChtZXRhIGZvcm0pKVxuICAgOmJpbmRpbmcgKHJlc29sdmUtYmluZGluZyBlbnYgZm9ybSl9KVxuXG4oZGVmdW4gdW5yZXNvbHZlZC1iaW5kaW5nXG4gIChlbnYgZm9ybSlcbiAgezpvcCA6dW5yZXNvbHZlZC1iaW5kaW5nXG4gICA6dHlwZSA6dW5yZXNvbHZlZC1iaW5kaW5nXG4gICA6aWRlbnRpZmllciB7OnR5cGUgOmlkZW50aWZpZXJcbiAgICAgICAgICAgICAgICA6Zm9ybSAoc3ltYm9sIChuYW1lc3BhY2UgZm9ybSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChuYW1lIGZvcm0pKX1cbiAgIDpzdGFydCAoOnN0YXJ0IChtZXRhIGZvcm0pKVxuICAgOmVuZCAoOmVuZCAobWV0YSBmb3JtKSl9KVxuXG4oZGVmdW4gcmVzb2x2ZS1iaW5kaW5nXG4gIChlbnYgZm9ybSlcbiAgKG9yIChnZXQgKDpsb2NhbHMgZW52KSAobmFtZSBmb3JtKSlcbiAgICAgIChnZXQgKDplbmNsb3NlZCBlbnYpIChuYW1lIGZvcm0pKVxuICAgICAgKHVucmVzb2x2ZWQtYmluZGluZyBlbnYgZm9ybSkpKVxuXG4oZGVmdW4gYW5hbHl6ZS1zaGFkb3dcbiAgKGVudiBpZClcbiAgKGxldCogKChiaW5kaW5nIChyZXNvbHZlLWJpbmRpbmcgZW52IGlkKSkpXG4gICAgezpkZXB0aCAoaW5jIChvciAoOmRlcHRoIGJpbmRpbmcpIDApKVxuICAgICA6c2hhZG93IGJpbmRpbmd9KSlcblxuKGRlZnVuIGFuYWx5emUtYmluZGluZ1xuICAoZW52IGZvcm0pXG4gIChsZXQqICgoaWQgKGZpcnN0IGZvcm0pKVxuICAgICAgICAoYm9keSAoc2Vjb25kIGZvcm0pKSlcbiAgICAoY29uaiAoYW5hbHl6ZS1zaGFkb3cgZW52IGlkKVxuICAgICAgICAgIHs6b3AgOmJpbmRpbmdcbiAgICAgICAgICAgOnR5cGUgOmJpbmRpbmdcbiAgICAgICAgICAgOmlkIGlkXG4gICAgICAgICAgIDppbml0IChhbmFseXplIGVudiBib2R5KVxuICAgICAgICAgICA6Zm9ybSBmb3JtfSkpKVxuXG4oZGVmdW4gYW5hbHl6ZS1kZWNsYXJhdGlvblxuICAoZW52IGZvcm0pXG4gIChhc3NlcnQgKG5vdCAob3IgKG5hbWVzcGFjZSBmb3JtKVxuICAgICAgICAgICAgICAgICAgICg8IDEgKGNvdW50IChzcGxpdCBcXC4gKHN0ciBmb3JtKSkpKSkpKVxuICAoY29uaiAoYW5hbHl6ZS1zaGFkb3cgZW52IGZvcm0pXG4gICAgICAgIHs6b3AgOnZhclxuICAgICAgICAgOnR5cGUgOmlkZW50aWZpZXJcbiAgICAgICAgIDpkZXB0aCAwXG4gICAgICAgICA6aWQgZm9ybVxuICAgICAgICAgOmZvcm0gZm9ybX0pKVxuXG4oZGVmdW4gYW5hbHl6ZS1wYXJhbVxuICAoZW52IGZvcm0pXG4gIChjb25qIChhbmFseXplLXNoYWRvdyBlbnYgZm9ybSlcbiAgICAgICAgezpvcCA6cGFyYW1cbiAgICAgICAgIDp0eXBlIDpwYXJhbWV0ZXJcbiAgICAgICAgIDppZCBmb3JtXG4gICAgICAgICA6Zm9ybSBmb3JtXG4gICAgICAgICA6c3RhcnQgKDpzdGFydCAobWV0YSBmb3JtKSlcbiAgICAgICAgIDplbmQgKDplbmQgKG1ldGEgZm9ybSkpfSkpXG5cbihkZWZ1biB3aXRoLWJpbmRpbmdcbiAgKGVudiBmb3JtKVxuICBcIlJldHVybnMgZW5oYW5jZWQgZW52aXJvbm1lbnQgd2l0aCBhZGRpdGlvbmFsIGJpbmRpbmcgYWRkZWRcbiAgdG8gdGhlIDpiaW5kaW5ncyBhbmQgOnNjb3BlXCJcbiAgKGNvbmogZW52IHs6bG9jYWxzIChhc3NvYyAoOmxvY2FscyBlbnYpIChuYW1lICg6aWQgZm9ybSkpIGZvcm0pXG4gICAgICAgICAgICAgOmJpbmRpbmdzIChjb25qICg6YmluZGluZ3MgZW52KSBmb3JtKX0pKVxuXG4oZGVmdW4gd2l0aC1wYXJhbVxuICAoZW52IGZvcm0pXG4gIChjb25qICh3aXRoLWJpbmRpbmcgZW52IGZvcm0pXG4gICAgICAgIHs6cGFyYW1zIChjb25qICg6cGFyYW1zIGVudikgZm9ybSl9KSlcblxuKGRlZnVuIHN1Yi1lbnZcbiAgKGVudilcbiAgezplbmNsb3NlZCAoY29uaiB7fVxuICAgICAgICAgICAgICAgICAgICg6ZW5jbG9zZWQgZW52KVxuICAgICAgICAgICAgICAgICAgICg6bG9jYWxzIGVudikpXG4gICA6bG9jYWxzIHt9XG4gICA6YmluZGluZ3MgW11cbiAgIDpwYXJhbXMgKG9yICg6cGFyYW1zIGVudikgW10pXG4gICA7OyBTY29wZSBmbGFncyB0aGF0IHN1cnZpdmUgbmVzdGVkIGJpbmRpbmcgc2NvcGVzIChsZXQvdHJ5L2ZuXG4gICA7OyBib2RpZXMpIGJ1dCBhcmUgZXhwbGljaXRseSByZXNldCBhdCBldmVyeSBmbiBib3VuZGFyeSBieVxuICAgOzsgYW5hbHl6ZS1mbi4gOmFycm93IGdhdGVzIHRoZSBsYW1iZGEqIGB0aGlzYC9gYXJndW1lbnRzYFxuICAgOzsgcmVzdHJpY3Rpb247IDphc3luYyBnYXRlcyBgYXdhaXRgIHZhbGlkaXR5LlxuICAgOmFycm93ICg9ICg6YXJyb3cgZW52KSB0cnVlKVxuICAgOmFzeW5jICg9ICg6YXN5bmMgZW52KSB0cnVlKX0pXG5cblxuKGRlZnVuIGFuYWx5emUtbGV0KlxuICAoZW52IGZvcm0gaXMtbG9vcClcbiAgXCJUYWtlcyBsZXQgZm9ybSBhbmQgZW5oYW5jZXMgaXQncyBtZXRhZGF0YSB2aWEgYW5hbHl6ZWRcbiAgaW5mb1wiXG4gIChsZXQqICgoZXhwcmVzc2lvbnMgKHJlc3QgZm9ybSkpXG4gICAgICAgIChiaW5kaW5ncyAoZmlyc3QgZXhwcmVzc2lvbnMpKVxuICAgICAgICAoYm9keSAocmVzdCBleHByZXNzaW9ucykpXG5cbiAgICAgICAgKHZhbGlkLWJpbmRpbmdzPyAoYW5kICh2ZWN0b3I/IGJpbmRpbmdzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZXZlbj8gKGNvdW50IGJpbmRpbmdzKSkpKVxuXG4gICAgICAgIChfIChhc3NlcnQgdmFsaWQtYmluZGluZ3M/XG4gICAgICAgICAgICAgICAgICBcImJpbmRpbmdzIG11c3QgYmUgdmVjdG9yIG9mIGV2ZW4gbnVtYmVyIG9mIGVsZW1lbnRzXCIpKVxuXG4gICAgICAgIChzY29wZSAocmVkdWNlIChsYW1iZGEgKCUxICUyKSAod2l0aC1iaW5kaW5nICUxIChhbmFseXplLWJpbmRpbmcgJTEgJTIpKSlcbiAgICAgICAgICAgICAgICAgICAgICAoc3ViLWVudiBlbnYpXG4gICAgICAgICAgICAgICAgICAgICAgKHBhcnRpdGlvbiAyIGJpbmRpbmdzKSkpXG5cbiAgICAgICAgKGJpbmRpbmdzICg6YmluZGluZ3Mgc2NvcGUpKVxuXG4gICAgICAgIChleHByZXNzaW9ucyAoYW5hbHl6ZS1ibG9jayAoaWYgaXMtbG9vcFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChjb25qIHNjb3BlIHs6cGFyYW1zIGJpbmRpbmdzfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY29wZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9keSkpKVxuXG4gICAgezpvcCA6bGV0XG4gICAgIDpmb3JtIGZvcm1cbiAgICAgOnN0YXJ0ICg6c3RhcnQgKG1ldGEgZm9ybSkpXG4gICAgIDplbmQgKDplbmQgKG1ldGEgZm9ybSkpXG4gICAgIDpiaW5kaW5ncyBiaW5kaW5nc1xuICAgICA6c3RhdGVtZW50cyAoOnN0YXRlbWVudHMgZXhwcmVzc2lvbnMpXG4gICAgIDpyZXN1bHQgKDpyZXN1bHQgZXhwcmVzc2lvbnMpfSkpXG5cbihkZWZ1biBhbmFseXplLWxldFxuICAoZW52IGZvcm0pXG4gIChhbmFseXplLWxldCogZW52IGZvcm0gZmFsc2UpKVxuOzsgYGxldCoqYCBpcyB0aGUgcG9zdC1tYWNyb2V4cGFuc2lvbiBpbnRlcm5hbCBiaW5kaW5nIGZvcm0gKGZsYXQgdmVjdG9yIG9mXG47OyBuYW1lL2luaXQgcGFpcnMsIHNlcXVlbnRpYWwpIC0tIGFuYWxvZ291cyB0byBgZm4qYC9gbG9vcCpgLiBOZXctc3ludGF4J3Ncbjs7IHVzZXItZmFjaW5nIGBsZXRgL2BsZXQqYCAocGFyZW4tbGlzdCBiaW5kaW5ncykgYXJlIGV4cGFuZGVyIG1hY3JvcyB0aGF0XG47OyBib3RoIGxvd2VyIHRvIHRoaXMgZm9ybTsga2VlcGluZyB0aGUgaW50ZXJuYWwga2V5IGRpc3RpbmN0IGZyb20gdGhlXG47OyBwdWJsaWMgYGxldCpgIHNwZWxsaW5nIGF2b2lkcyB0aGUgbWFjcm9leHBhbmRlciByZS1leHBhbmRpbmcgaXRzIG93blxuOzsgb3V0cHV0LlxuKGluc3RhbGwtc3BlY2lhbCEgOmxldCoqIGFuYWx5emUtbGV0KVxuXG4oZGVmdW4gYW5hbHl6ZS1sb29wXG4gIChlbnYgZm9ybSlcbiAgKGNvbmogKGFuYWx5emUtbGV0KiBlbnYgZm9ybSB0cnVlKSB7Om9wIDpsb29wfSkpXG4oaW5zdGFsbC1zcGVjaWFsISA6bG9vcCogYW5hbHl6ZS1sb29wKVxuXG5cbihkZWZ1biBhbmFseXplLXJlY3VyXG4gIChlbnYgZm9ybSlcbiAgKGxldCogKChwYXJhbXMgKDpwYXJhbXMgZW52KSlcbiAgICAgICAgKGZvcm1zICh2ZWMgKG1hcCAobGFtYmRhICglKSAoYW5hbHl6ZSBlbnYgJSkpIChyZXN0IGZvcm0pKSkpKVxuXG4gICAgKGlmICg9IChjb3VudCBwYXJhbXMpXG4gICAgICAgICAgIChjb3VudCBmb3JtcykpXG4gICAgICB7Om9wIDpyZWN1clxuICAgICAgIDpmb3JtIGZvcm1cbiAgICAgICA6cGFyYW1zIGZvcm1zfVxuICAgICAgKHN5bnRheC1lcnJvciBcIlJlY3VycyB3aXRoIHdyb25nIG51bWJlciBvZiBhcmd1bWVudHNcIlxuICAgICAgICAgICAgICAgICAgICBmb3JtKSkpKVxuKGluc3RhbGwtc3BlY2lhbCEgOnJlY3VyIGFuYWx5emUtcmVjdXIpXG5cbihkZWZ1biBhbmFseXplLXF1b3RlZC1saXN0XG4gIChmb3JtKVxuICB7Om9wIDpsaXN0XG4gICA6aXRlbXMgKG1hcCBhbmFseXplLXF1b3RlZCAodmVjIGZvcm0pKVxuICAgOmZvcm0gZm9ybVxuICAgOnN0YXJ0ICg6c3RhcnQgKG1ldGEgZm9ybSkpXG4gICA6ZW5kICg6ZW5kIChtZXRhIGZvcm0pKX0pXG5cbihkZWZ1biBhbmFseXplLXF1b3RlZC12ZWN0b3JcbiAgKGZvcm0pXG4gIHs6b3AgOnZlY3RvclxuICAgOml0ZW1zIChtYXAgYW5hbHl6ZS1xdW90ZWQgZm9ybSlcbiAgIDpmb3JtIGZvcm1cbiAgIDpzdGFydCAoOnN0YXJ0IChtZXRhIGZvcm0pKVxuICAgOmVuZCAoOmVuZCAobWV0YSBmb3JtKSl9KVxuXG4oZGVmdW4gYW5hbHl6ZS1xdW90ZWQtZGljdGlvbmFyeVxuICAoZm9ybSlcbiAgKGxldCogKChuYW1lcyAodmVjIChtYXAgYW5hbHl6ZS1xdW90ZWQgKGtleXMgZm9ybSkpKSlcbiAgICAgICAgKHZhbHVlcyAodmVjIChtYXAgYW5hbHl6ZS1xdW90ZWQgKHZhbHMgZm9ybSkpKSkpXG4gICAgezpvcCA6ZGljdGlvbmFyeVxuICAgICA6Zm9ybSBmb3JtXG4gICAgIDprZXlzIG5hbWVzXG4gICAgIDp2YWx1ZXMgdmFsdWVzXG4gICAgIDpzdGFydCAoOnN0YXJ0IChtZXRhIGZvcm0pKVxuICAgICA6ZW5kICg6ZW5kIChtZXRhIGZvcm0pKX0pKVxuXG4oZGVmdW4gYW5hbHl6ZS1xdW90ZWQtc3ltYm9sXG4gIChmb3JtKVxuICB7Om9wIDpzeW1ib2xcbiAgIDpuYW1lIChuYW1lIGZvcm0pXG4gICA6bmFtZXNwYWNlIChuYW1lc3BhY2UgZm9ybSlcbiAgIDpmb3JtIGZvcm19KVxuXG4oZGVmdW4gYW5hbHl6ZS1xdW90ZWQta2V5d29yZFxuIChmb3JtKVxuICB7Om9wIDprZXl3b3JkXG4gICA6bmFtZSAobmFtZSBmb3JtKVxuICAgOm5hbWVzcGFjZSAobmFtZXNwYWNlIGZvcm0pXG4gICA6Zm9ybSBmb3JtfSlcblxuKGRlZnVuIGFuYWx5emUtcXVvdGVkXG4gIChmb3JtKVxuICAoY29uZCAoKHN5bWJvbD8gZm9ybSkgKGFuYWx5emUtcXVvdGVkLXN5bWJvbCBmb3JtKSlcbiAgICAgICAgKChrZXl3b3JkPyBmb3JtKSAoYW5hbHl6ZS1xdW90ZWQta2V5d29yZCBmb3JtKSlcbiAgICAgICAgKChsaXN0PyBmb3JtKSAoYW5hbHl6ZS1xdW90ZWQtbGlzdCBmb3JtKSlcbiAgICAgICAgKCh2ZWN0b3I/IGZvcm0pIChhbmFseXplLXF1b3RlZC12ZWN0b3IgZm9ybSkpXG4gICAgICAgICgoZGljdGlvbmFyeT8gZm9ybSkgKGFuYWx5emUtcXVvdGVkLWRpY3Rpb25hcnkgZm9ybSkpXG4gICAgICAgIChlbHNlIHs6b3AgOmNvbnN0YW50XG4gICAgICAgICAgICAgICA6Zm9ybSBmb3JtfSkpKVxuXG4oZGVmdW4gYW5hbHl6ZS1xdW90ZVxuICAoZW52IGZvcm0pXG4gIFwiRXhhbXBsZXM6XG4gICAoYW5hbHl6ZS1xdW90ZSB7fSAnKHF1b3RlIGZvbykpID0+IHs6b3AgOmNvbnN0YW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Zm9ybSAnZm9vXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ZW52IGVudn1cIlxuICAoYW5hbHl6ZS1xdW90ZWQgKHNlY29uZCBmb3JtKSkpXG4oaW5zdGFsbC1zcGVjaWFsISA6cXVvdGUgYW5hbHl6ZS1xdW90ZSlcblxuKGRlZnVuIGFuYWx5emUtc3RhdGVtZW50XG4gIChlbnYgZm9ybSlcbiAgKGxldCogKChzdGF0ZW1lbnRzIChvciAoOnN0YXRlbWVudHMgZW52KSBbXSkpXG4gICAgICAgIChiaW5kaW5ncyAob3IgKDpiaW5kaW5ncyBlbnYpIFtdKSlcbiAgICAgICAgKHN0YXRlbWVudCAoYW5hbHl6ZSAoY29uaiBlbnYgezpzdGF0ZW1lbnRzIG5pbH0pIGZvcm0pKVxuICAgICAgICAob3AgKDpvcCBzdGF0ZW1lbnQpKVxuXG4gICAgICAgIChkZWZzIChjb25kICgoPSBvcCA6ZGVmKSBbKDp2YXIgc3RhdGVtZW50KV0pXG4gICAgICAgICAgICAgICAgICAgOzsgKD0gb3AgOm5zKSAoOnJlcXVpcmVtZW50IG5vZGUpXG4gICAgICAgICAgICAgICAgICAgKGVsc2UgbmlsKSkpKVxuXG4gICAgKGNvbmogZW52IHs6c3RhdGVtZW50cyAoY29uaiBzdGF0ZW1lbnRzIHN0YXRlbWVudClcbiAgICAgICAgICAgICAgIDpiaW5kaW5ncyAoY29uY2F0IGJpbmRpbmdzIGRlZnMpfSkpKVxuXG4oZGVmdW4gYW5hbHl6ZS1ibG9ja1xuICAoZW52IGZvcm0pXG4gIFwiRXhhbXBsZXM6XG4gIChhbmFseXplLWJsb2NrIHt9ICcoKGZvbyBiYXIpKSkgPT4gezpzdGF0ZW1lbnRzIG5pbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6cmVzdWx0IHs6b3AgOmludm9rZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Zm9ybSAnKGZvbyBiYXIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDplbnYge31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmNhbGxlZSB7Om9wIDp2YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gJ2Zvb1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6aW5mbyBuaWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmVudiB7fX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnBhcmFtcyBbezpvcCA6dmFyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Zm9ybSAnYmFyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6aW5mbyBuaWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDplbnYge319XX1cbiAgKGFuYWx5emUtYmxvY2sge30gJygoYmVlcCBieilcbiAgICAgICAgICAgICAgICAgICAgICAoZm9vIGJhcikpKSA9PiB7OnN0YXRlbWVudHMgW3s6b3AgOmludm9rZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtICcoYmVlcCBieilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ZW52IHt9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmNhbGxlZSB7Om9wIDp2YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Zm9ybSAnYmVlcFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDppbmZvIG5pbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDplbnYge319XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnBhcmFtcyBbezpvcCA6dmFyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtICdielxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6aW5mbyBuaWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmVudiB7fX1dfV1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnJlc3VsdCB7Om9wIDppbnZva2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gJyhmb28gYmFyKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ZW52IHt9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpjYWxsZWUgezpvcCA6dmFyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtICdmb29cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmluZm8gbmlsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDplbnYge319XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpwYXJhbXMgW3s6b3AgOnZhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gJ2JhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmluZm8gbmlsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ZW52IHt9fV19XCJcbiAgKGxldCogKChib2R5IChpZiAoPiAoY291bnQgZm9ybSkgMSlcbiAgICAgICAgICAgICAgIChyZWR1Y2UgYW5hbHl6ZS1zdGF0ZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgICAgZW52XG4gICAgICAgICAgICAgICAgICAgICAgIChidXRsYXN0IGZvcm0pKSkpXG4gICAgICAgIChyZXN1bHQgKGFuYWx5emUgKG9yIGJvZHkgZW52KSAobGFzdCBmb3JtKSkpKVxuICAgIHs6c3RhdGVtZW50cyAoOnN0YXRlbWVudHMgYm9keSlcbiAgICAgOnJlc3VsdCByZXN1bHR9KSlcblxuKGRlZnVuIGFuYWx5emUtZm4tbWV0aG9kXG4gIChlbnYgZm9ybSlcbiAgXCJcbiAge30gLT4gJyhbeCB5XSAoKyB4IHkpKSAtPiB7OmVudiB7fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Zm9ybSAnKFt4IHldICgrIHggeSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIDp2YXJpYWRpYyBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6YXJpdHkgMlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6cGFyYW1zIFt7Om9wIDp2YXIgOmZvcm0gJ3h9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHs6b3AgOnZhciA6Zm9ybSAneX1dXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpzdGF0ZW1lbnRzIFtdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpyZXR1cm4gezpvcCA6aW52b2tlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpjYWxsZWUgezpvcCA6dmFyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtICcrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDplbnYgezpwYXJlbnQge31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmxvY2FscyB7eCB7Om5hbWUgJ3hcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnNoYWRvdyBuaWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmxvY2FsIHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnRhZyBuaWx9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHkgezpuYW1lICd5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpzaGFkb3cgbmlsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpsb2NhbCB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDp0YWcgbmlsfX19fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6cGFyYW1zIFt7Om9wIDp2YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtICd4XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6aW5mbyBuaWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDp0YWcgbmlsfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Om9wIDp2YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtICd5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6aW5mbyBuaWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDp0YWcgbmlsfV19fVwiXG4gIChsZXQqICgoc2lnbmF0dXJlIChpZiAoYW5kIChsaXN0PyBmb3JtKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgKHZlY3Rvcj8gKGZpcnN0IGZvcm0pKSlcbiAgICAgICAgICAgICAgICAgICAgKGZpcnN0IGZvcm0pXG4gICAgICAgICAgICAgICAgICAgIChzeW50YXgtZXJyb3IgXCJNYWxmb3JtZWQgZm4gb3ZlcmxvYWQgZm9ybVwiIGZvcm0pKSlcbiAgICAgICAgKGJvZHkgKHJlc3QgZm9ybSkpXG4gICAgICAgIDs7IElmIHBhcmFtIHNpZ25hdHVyZSBjb250YWlucyAmIGZuIGlzIHZhcmlhZGljLlxuICAgICAgICAodmFyaWFkaWMgKHNvbWUgKGxhbWJkYSAoJSkgKD0gJyYgJSkpIHNpZ25hdHVyZSkpXG5cbiAgICAgICAgOzsgQWxsIG5hbWVkIHBhcmFtcyBvZiB0aGUgZm4uXG4gICAgICAgIChwYXJhbXMgKGlmIHZhcmlhZGljXG4gICAgICAgICAgICAgICAgIChmaWx0ZXIgKGxhbWJkYSAoJSkgKG5vdCAoPSAnJiAlKSkpIHNpZ25hdHVyZSlcbiAgICAgICAgICAgICAgICAgc2lnbmF0dXJlKSlcblxuICAgICAgICA7OyBOdW1iZXIgb2YgcGFyYW1ldGVycyBmaXhlZCBwYXJhbWV0ZXJzIGZuIHRha2VzLlxuICAgICAgICAoYXJpdHkgKGlmIHZhcmlhZGljXG4gICAgICAgICAgICAgICAgKGRlYyAoY291bnQgcGFyYW1zKSlcbiAgICAgICAgICAgICAgICAoY291bnQgcGFyYW1zKSkpXG5cbiAgICAgICAgOzsgQW5hbHl6ZSBwYXJhbWV0ZXJzIGluIGNvcnJlc3BvbmRlbmNlIHRvIGVudmlyb25tZW50XG4gICAgICAgIDs7IGxvY2FscyB0byBpZGVudGlmeSBiaW5kaW5nIHNoYWRvd2luZy5cbiAgICAgICAgKHNjb3BlIChyZWR1Y2UgKGxhbWJkYSAoJTEgJTIpICh3aXRoLXBhcmFtICUxIChhbmFseXplLXBhcmFtICUxICUyKSkpXG4gICAgICAgICAgICAgICAgICAgICAgKGNvbmogZW52IHs6cGFyYW1zIFtdfSlcbiAgICAgICAgICAgICAgICAgICAgICBwYXJhbXMpKSlcbiAgICAoY29uaiAoYW5hbHl6ZS1ibG9jayBzY29wZSBib2R5KVxuICAgICAgICAgIHs6b3AgOm92ZXJsb2FkXG4gICAgICAgICAgIDp2YXJpYWRpYyB2YXJpYWRpY1xuICAgICAgICAgICA6YXJpdHkgYXJpdHlcbiAgICAgICAgICAgOnBhcmFtcyAoOnBhcmFtcyBzY29wZSlcbiAgICAgICAgICAgOmZvcm0gZm9ybX0pKSlcblxuXG4oZGVmdW4gYW5hbHl6ZS1mblxuICAoZW52IGZvcm0pXG4gIChsZXQqICgoZm9ybXMgKHJlc3QgZm9ybSkpXG4gICAgICAgIDs7IE5vcm1hbGl6ZSBmbiBmb3JtIHNvIHRoYXQgaXQgY29udGFpbnMgbmFtZVxuICAgICAgICA7OyAnKGZuIFt4XSB4KSAtPiAnKGZuIG5pbCBbeF0geClcbiAgICAgICAgKGZvcm1zIChpZiAoc3ltYm9sPyAoZmlyc3QgZm9ybXMpKVxuICAgICAgICAgICAgICAgIGZvcm1zXG4gICAgICAgICAgICAgICAgKGNvbnMgbmlsIGZvcm1zKSkpXG5cbiAgICAgICAgKGlkIChmaXJzdCBmb3JtcykpXG4gICAgICAgIChiaW5kaW5nIChpZiBpZCAoYW5hbHl6ZS1zcGVjaWFsIGFuYWx5emUtZGVjbGFyYXRpb24gZW52IGlkKSkpXG5cbiAgICAgICAgKGJvZHkgKHJlc3QgZm9ybXMpKVxuXG4gICAgICAgIDs7IE1ha2Ugc3VyZSB0aGF0IGZuIGRlZmluaXRpb24gaXMgc3RydWN1dGVyZWRcbiAgICAgICAgOzsgaW4gbWV0aG9kIG92ZXJsb2FkIHN0eWxlOlxuICAgICAgICA7OyAoZm4gYSBbeF0geSkgLT4gKChbeF0geSkpXG4gICAgICAgIDs7IChmbiBhIChbeF0geSkpIC0+ICgoW3hdIHkpKVxuICAgICAgICAob3ZlcmxvYWRzIChjb25kICgodmVjdG9yPyAoZmlyc3QgYm9keSkpIChsaXN0IGJvZHkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgKChhbmQgKGxpc3Q/IChmaXJzdCBib2R5KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHZlY3Rvcj8gKGZpcnN0IChmaXJzdCBib2R5KSkpKSBib2R5KVxuICAgICAgICAgICAgICAgICAgICAgICAgKGVsc2UgKHN5bnRheC1lcnJvciAoc3RyIFwiTWFsZm9ybWVkIGZuIGV4cHJlc3Npb24sIFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJwYXJhbWV0ZXIgZGVjbGFyYXRpb24gKFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHByLXN0ciAoZmlyc3QgYm9keSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIpIG11c3QgYmUgYSB2ZWN0b3JcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9ybSkpKSlcblxuICAgICAgICAoc2NvcGUgKGlmIGJpbmRpbmdcbiAgICAgICAgICAgICAgICAod2l0aC1iaW5kaW5nIChzdWItZW52IGVudikgYmluZGluZylcbiAgICAgICAgICAgICAgICAoc3ViLWVudiBlbnYpKSlcblxuICAgICAgICA7OyBsYW1iZGEqIChhcnJvdykgbWFya2VyOiBpbmplY3RlZCBhcyBgOmFycm93YCBtZXRhZGF0YSBvbiB0aGVcbiAgICAgICAgOzsgKGZuKiAuLi4pIGZvcm0gYnkgdGhlIGxhbWJkYSogbWFjcm8uIFRoZSBOT0RFIGNhcnJpZXMgdGhlIHJhd1xuICAgICAgICA7OyBtYXJrZXIgKG5pbC90cnVlLCBsaWtlIDp2YXJpYWRpYyk7IHRoZSBzY29wZSBlbnYgZ2V0cyBhblxuICAgICAgICA7OyBleHBsaWNpdCBib29sZWFuIHNvIGEgbmVzdGVkIG5vbi1hcnJvdyBmbiByZXNldHMgdGhlIGZsYWdcbiAgICAgICAgOzsgaW5zdGVhZCBvZiBpbmhlcml0aW5nIGl0IGZyb20gYW4gZW5jbG9zaW5nIGFycm93IHNjb3BlLlxuICAgICAgICAoYXJyb3cgKD0gKDphcnJvdyAobWV0YSBmb3JtKSkgdHJ1ZSkpXG5cbiAgICAgICAgKHNjb3BlIChjb25qIHNjb3BlIHs6YXJyb3cgYXJyb3d9KSlcblxuICAgICAgICAobWV0aG9kcyAobWFwIChsYW1iZGEgKCUpIChhbmFseXplLWZuLW1ldGhvZCBzY29wZSAlKSlcbiAgICAgICAgICAgICAgICAgICAgICh2ZWMgb3ZlcmxvYWRzKSkpXG5cbiAgICAgICAgKGFyaXR5IChhcHBseSBtYXggKG1hcCAobGFtYmRhICglKSAoOmFyaXR5ICUpKSBtZXRob2RzKSkpXG4gICAgICAgICh2YXJpYWRpYyAoc29tZSAobGFtYmRhICglKSAoOnZhcmlhZGljICUpKSBtZXRob2RzKSkpXG5cbiAgICA7OyBUaGUgYXJpdHktZGlzcGF0Y2ggbG93ZXJpbmcgZm9yIG92ZXJsb2FkZWQgZm5zIHJlYWRzXG4gICAgOzsgYGFyZ3VtZW50c2AsIHdoaWNoIGFycm93cyBkbyBub3QgaGF2ZS4gbGFtYmRhKiByZWplY3RzXG4gICAgOzsgbXVsdGktYXJpdHkgY2xhdXNlcyBhdCBleHBhbnNpb24gdGltZTsgdGhpcyBndWFyZHMgZGlyZWN0IHVzZS5cbiAgICAoaWYgKGFuZCBhcnJvd1xuICAgICAgICAgICAoPiAoY291bnQgbWV0aG9kcykgMSkpXG4gICAgICAoc3ludGF4LWVycm9yIFwibGFtYmRhKiBkb2VzIG5vdCBzdXBwb3J0IGFyaXR5IG92ZXJsb2FkaW5nXCIgZm9ybSkpXG5cbiAgICB7Om9wIDpmblxuICAgICA6dHlwZSA6ZnVuY3Rpb25cbiAgICAgOmFycm93IChpZiBhcnJvdyB0cnVlIG5pbClcbiAgICAgOmlkIGJpbmRpbmdcbiAgICAgOnZhcmlhZGljIHZhcmlhZGljXG4gICAgIDptZXRob2RzIG1ldGhvZHNcbiAgICAgOmZvcm0gZm9ybX0pKVxuKGluc3RhbGwtc3BlY2lhbCEgOmZuKiBhbmFseXplLWZuKVxuXG4oZGVmdW4gcGFyc2UtcmVmZXJlbmNlc1xuICAoZm9ybXMpXG4gIFwiVGFrZXMgcGFydCBvZiBuYW1lc3BhY2UgZGVmaW5pdGlvbiBhbmQgY3JlYXRlcyBoYXNoXG4gIG9mIHJlZmVyZW5jZSBmb3Jtc1wiXG4gIChyZWR1Y2UgKGxhbWJkYSAocmVmZXJlbmNlcyBmb3JtKVxuICAgICAgICAgICAgOzsgSWYgbm90IGEgdmVjdG9yIHRoYW4gaXQncyBub3QgYSByZWZlcmVuY2VcbiAgICAgICAgICAgIDs7IGZvcm0gdGhhdCB3aXNwIHVuZGVyc3RhbmRzIHNvIGp1c3Qgc2tpcCBpdC5cbiAgICAgICAgICAgIChpZiAoc2VxPyBmb3JtKVxuICAgICAgICAgICAgICAoYXNzb2MgcmVmZXJlbmNlc1xuICAgICAgICAgICAgICAgIChuYW1lIChmaXJzdCBmb3JtKSlcbiAgICAgICAgICAgICAgICAodmVjIChyZXN0IGZvcm0pKSlcbiAgICAgICAgICAgICAgcmVmZXJlbmNlcykpXG4gICAgICAgICAge31cbiAgICAgICAgICBmb3JtcykpXG5cbihkZWZ1biBwYXJzZS1yZXF1aXJlXG4gIChmb3JtKVxuICAobGV0KiAoOzsgcmVxdWlyZSBmb3JtIG1heSBiZSBlaXRoZXIgdmVjdG9yIHdpdGggaWQgaW4gdGhlXG4gICAgICAgIDs7IGhlYWQgb3IganVzdCBhbiBpZCBzeW1ib2wuIG5vcm1hbGl6aW5nIHRvIGEgdmVjdG9yXG4gICAgICAgIChyZXF1aXJlbWVudCAoaWYgKHN5bWJvbD8gZm9ybSkgW2Zvcm1dICh2ZWMgZm9ybSkpKVxuICAgICAgICAoaWQgKGZpcnN0IHJlcXVpcmVtZW50KSlcbiAgICAgICAgOzsgYnVuY2ggb2YgZGlyZWN0aXZlcyBtYXkgZm9sbG93IHJlcXVpcmUgZm9ybSBidXQgdGhleVxuICAgICAgICA7OyBhbGwgY29tZSBpbiBwYWlycy4gd2lzcCBzdXBwb3J0cyBmb2xsb3dpbmcgcGFpcnM6XG4gICAgICAgIDs7IDphcyBmb29cbiAgICAgICAgOzsgOnJlZmVyIFtmb28gYmFyXVxuICAgICAgICA7OyA6cmVuYW1lIHtmb28gYmFyfVxuICAgICAgICA7OyBqb2luIHRoZXNlIHBhaXJzIGluIGEgaGFzaCBmb3Iga2V5IGJhc2VkIGFjY2Vzcy5cbiAgICAgICAgKHBhcmFtcyAoYXBwbHkgZGljdGlvbmFyeSAocmVzdCByZXF1aXJlbWVudCkpKVxuICAgICAgICAocmVuYW1lcyAoZ2V0IHBhcmFtcyAnOnJlbmFtZSkpXG4gICAgICAgIChuYW1lcyAoZ2V0IHBhcmFtcyAnOnJlZmVyKSlcbiAgICAgICAgKGFsaWFzIChnZXQgcGFyYW1zICc6YXMpKVxuICAgICAgICAocmVmZXJlbmNlcyAoaWYgKG5vdCAoZW1wdHk/IG5hbWVzKSlcbiAgICAgICAgICAgICAgICAgICAgIChyZWR1Y2UgKGxhbWJkYSAocmVmZXJzIHJlZmVyZW5jZSlcbiAgICAgICAgICAgICAgICAgICAgICAoY29uaiByZWZlcnNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Om9wIDpyZWZlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Zm9ybSByZWZlcmVuY2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOm5hbWUgcmVmZXJlbmNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIDs7IExvb2sgdXAgYnkgcmVmZXJlbmNlIHN5bWJvbCBhbmQgYnkgc3ltYm9sXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOzsgYml0IGluIGEgZnV6eiByaWdodCBub3cuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpyZW5hbWUgKG9yIChnZXQgcmVuYW1lcyByZWZlcmVuY2UpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChnZXQgcmVuYW1lcyAobmFtZSByZWZlcmVuY2UpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOm5zIGlkfSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWVzKSkpKVxuICAgIHs6b3AgOnJlcXVpcmVcbiAgICAgOmFsaWFzIGFsaWFzXG4gICAgIDpucyBpZFxuICAgICA6cmVmZXIgcmVmZXJlbmNlc1xuICAgICA6Zm9ybSBmb3JtfSkpXG5cbihkZWZ1biBhbmFseXplLW5zXG4gIChlbnYgZm9ybSlcbiAgKGxldCogKChmb3JtcyAocmVzdCBmb3JtKSlcbiAgICAgICAgKG5hbWUgKGZpcnN0IGZvcm1zKSlcbiAgICAgICAgKGJvZHkgKHJlc3QgZm9ybXMpKVxuICAgICAgICA7OyBPcHRpb25hbCBkb2NzdHJpbmcgdGhhdCBmb2xsb3dzIG5hbWUgc3ltYm9sXG4gICAgICAgIChkb2MgKGlmIChzdHJpbmc/IChmaXJzdCBib2R5KSkgKGZpcnN0IGJvZHkpKSlcbiAgICAgICAgOzsgSWYgc2Vjb25kIGZvcm0gaXMgbm90IGEgc3RyaW5nIHRoYW4gdHJlYXQgaXRcbiAgICAgICAgOzsgYXMgcmVndWxhciByZWZlcmVuY2UgZm9ybVxuICAgICAgICAocmVmZXJlbmNlcyAocGFyc2UtcmVmZXJlbmNlcyAoaWYgZG9jXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAocmVzdCBib2R5KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9keSkpKVxuICAgICAgICAocmVxdWlyZW1lbnRzIChpZiAoOnJlcXVpcmUgcmVmZXJlbmNlcylcbiAgICAgICAgICAgICAgICAgICAgICAgKG1hcCBwYXJzZS1yZXF1aXJlICg6cmVxdWlyZSByZWZlcmVuY2VzKSkpKSlcbiAgICB7Om9wIDpuc1xuICAgICA6bmFtZSBuYW1lXG4gICAgIDpkb2MgZG9jXG4gICAgIDpyZXF1aXJlIChpZiByZXF1aXJlbWVudHNcbiAgICAgICAgICAgICAgICAodmVjIHJlcXVpcmVtZW50cykpXG4gICAgIDpmb3JtIGZvcm19KSlcbihpbnN0YWxsLXNwZWNpYWwhIDpucyBhbmFseXplLW5zKVxuXG5cbihkZWZ1biBhbmFseXplLWxpc3RcbiAgKGVudiBmb3JtKVxuICBcIlRha2VzIGZvcm0gb2YgbGlzdCB0eXBlIGFuZCBwZXJmb3JtcyBhIG1hY3JvZXhwYW5zaW9ucyB1bnRpbFxuICBmdWxseSBleHBhbmRlZC4gSWYgZXhwYW5zaW9uIGlzIGRpZmZlcmVudCBmcm9tIGEgZ2l2ZW4gZm9ybSB0aGVuXG4gIGV4cGFuZGVkIGZvcm0gaXMgaGFuZGVkIGJhY2sgdG8gYW5hbHl6ZXIuIElmIGZvcm0gaXMgc3BlY2lhbCBsaWtlXG4gIGRlZiwgZm4sIGxldC4uLiB0aGFuIGFzc29jaWF0ZWQgaXMgZGlzcGF0Y2hlZCwgb3RoZXJ3aXNlIGZvcm0gaXNcbiAgYW5hbHl6ZWQgYXMgaW52b2tlIGV4cHJlc3Npb24uXCJcbiAgKGxldCogKChleHBhbnNpb24gKG1hY3JvZXhwYW5kIGZvcm0gZW52KSlcbiAgICAgICAgOzsgU3BlY2lhbCBvcGVyYXRvcnMgbXVzdCBiZSBzeW1ib2xzIGFuZCBzdG9yZWQgaW4gdGhlXG4gICAgICAgIDs7ICoqc3BlY2lhbHMqKiBoYXNoIGJ5IG9wZXJhdG9yIG5hbWUuXG4gICAgICAgIChvcGVyYXRvciAoZmlyc3QgZm9ybSkpXG4gICAgICAgIChhbmFseXplciAoYW5kIChzeW1ib2w/IG9wZXJhdG9yKVxuICAgICAgICAgICAgICAgICAgICAgIChnZXQgKipzcGVjaWFscyoqIChuYW1lIG9wZXJhdG9yKSkpKSlcbiAgICA7OyBJZiBmb3JtIGlzIGV4cGFuZGVkIHBhc3MgaXQgYmFjayB0byBhbmFseXplIHNpbmNlIGl0IG1heSBub1xuICAgIDs7IGxvbmdlciBiZSBhIGxpc3QuIE90aGVyd2lzZSBlaXRoZXIgYW5hbHl6ZSBhcyBhIHNwZWNpYWwgZm9ybVxuICAgIDs7IChpZiBpdCdzIHN1Y2gpIG9yIGFzIGZ1bmN0aW9uIGludm9rYXRpb24gZm9ybS5cbiAgICAoY29uZCAoKG5vdCAoaWRlbnRpY2FsPyBleHBhbnNpb24gZm9ybSkpIChhbmFseXplIGVudiBleHBhbnNpb24pKVxuICAgICAgICAgIChhbmFseXplciAoYW5hbHl6ZS1zcGVjaWFsIGFuYWx5emVyIGVudiBleHBhbnNpb24pKVxuICAgICAgICAgIChlbHNlIChhbmFseXplLWludm9rZSBlbnYgZXhwYW5zaW9uKSkpKSlcblxuKGRlZnVuIGFuYWx5emUtdmVjdG9yXG4gIChlbnYgZm9ybSlcbiAgKGxldCogKChpdGVtcyAodmVjIChtYXAgKGxhbWJkYSAoJSkgKGFuYWx5emUgZW52ICUpKSBmb3JtKSkpKVxuICAgIHs6b3AgOnZlY3RvclxuICAgICA6Zm9ybSBmb3JtXG4gICAgIDppdGVtcyBpdGVtc30pKVxuXG4oZGVmdW4gYW5hbHl6ZS1kaWN0aW9uYXJ5XG4gIChlbnYgZm9ybSlcbiAgKGxldCogKChuYW1lcyAodmVjIChtYXAgKGxhbWJkYSAoJSkgKGFuYWx5emUgZW52ICUpKSAoa2V5cyBmb3JtKSkpKVxuICAgICAgICAodmFsdWVzICh2ZWMgKG1hcCAobGFtYmRhICglKSAoYW5hbHl6ZSBlbnYgJSkpICh2YWxzIGZvcm0pKSkpKVxuICAgIHs6b3AgOmRpY3Rpb25hcnlcbiAgICAgOmtleXMgbmFtZXNcbiAgICAgOnZhbHVlcyB2YWx1ZXNcbiAgICAgOmZvcm0gZm9ybX0pKVxuXG4oZGVmdW4gYW5hbHl6ZS1pbnZva2VcbiAgKGVudiBmb3JtKVxuICBcIlJldHVybnMgbm9kZSBvZiA6aW52b2tlIHR5cGUsIHJlcHJlc2VudGluZyBhIGZ1bmN0aW9uIGNhbGwuIEluXG4gIGFkZGl0aW9uIHRvIHJlZ3VsYXIgcHJvcGVydGllcyB0aGlzIG5vZGUgY29udGFpbnMgOmNhbGxlZSBtYXBwZWRcbiAgdG8gYSBub2RlIHRoYXQgaXMgYmVpbmcgaW52b2tlZCBhbmQgOnBhcmFtcyB0aGF0IGlzIGFuIHZlY3RvciBvZlxuICBwYXJhbXRlciBleHByZXNzaW9ucyB0aGF0IDpjYWxsZWUgaXMgaW52b2tlZCB3aXRoLlwiXG4gIChsZXQqICgoY2FsbGVlIChhbmFseXplIGVudiAoZmlyc3QgZm9ybSkpKVxuICAgICAgICAocGFyYW1zICh2ZWMgKG1hcCAobGFtYmRhICglKSAoYW5hbHl6ZSBlbnYgJSkpIChyZXN0IGZvcm0pKSkpKVxuICAgIHs6b3AgOmludm9rZVxuICAgICA6Y2FsbGVlIGNhbGxlZVxuICAgICA6cGFyYW1zIHBhcmFtc1xuICAgICA6Zm9ybSBmb3JtfSkpXG5cbihkZWZ1biBhbmFseXplLWNvbnN0YW50XG4gIChlbnYgZm9ybSlcbiAgXCJSZXR1cm5zIGEgbm9kZSByZXByZXNlbnRpbmcgYSBjb250c3RhbnQgdmFsdWUgd2hpY2ggaXNcbiAgbW9zdCBjZXJ0YWlubHkgYSBwcmltaXRpdmUgdmFsdWUgbGl0ZXJhbCB0aGlzIGZvcm0gY2FudGFpbnNcbiAgbm8gZXh0cmEgaW5mb3JtYXRpb24uXCJcbiAgezpvcCA6Y29uc3RhbnRcbiAgIDpmb3JtIGZvcm19KVxuXG4oZGVmdW4gYW5hbHl6ZVxuICAoJnJlc3QgYXJncylcbiAgXCJUYWtlcyBhIGhhc2ggcmVwcmVzZW50aW5nIGEgZ2l2ZW4gZW52aXJvbm1lbnQgYW5kIGBmb3JtYCB0byBiZVxuICBhbmFseXplZC4gRW52aXJvbm1lbnQgbWF5IGNvbnRhaW4gZm9sbG93aW5nIGVudHJpZXM6XG5cbiAgOmxvY2FscyAgLSBIYXNoIG9mIHRoZSBnaXZlbiBlbnZpcm9ubWVudHMgYmluZGluZ3MgbWFwcGVkeSBieSBiaW5kaW5nIG5hbWUuXG4gIDpjb250ZXh0IC0gT25lIG9mIHRoZSBmb2xsb3dpbmcgOnN0YXRlbWVudCwgOmV4cHJlc3Npb24sIDpyZXR1cm4uIFRoYXRcbiAgICAgICAgICAgICBpbmZvcm1hdGlvbiBpcyBpbmNsdWRlZCBpbiByZXN1bHRpbmcgbm9kZXMgYW5kIGlzIG1lYW50IGZvclxuICAgICAgICAgICAgIHdyaXRlciB0aGF0IG1heSBvdXRwdXQgZGlmZmVyZW50IGZvcm1zIGJhc2VkIG9uIGNvbnRleHQuXG4gIDpucyAgICAgIC0gTmFtZXNwYWNlIG9mIHRoZSBmb3JtcyBiZWluZyBhbmFseXplZC5cblxuICBBbmFseXplciBwZXJmb3JtcyBhbGwgdGhlIG1hY3JvICYgc3ludGF4IGV4cGFuc2lvbnMgYW5kIHRyYW5zZm9ybXMgZm9ybVxuICBpbnRvIEFTVCBub2RlIG9mIGFuIGV4cHJlc3Npb24uIEVhY2ggc3VjaCBub2RlIGNvbnRhaW5zIGF0IGxlYXN0IGZvbGxvd2luZ1xuICBwcm9wZXJ0aWVzOlxuXG4gIDpvcCAgIC0gT3BlcmF0aW9uIHR5cGUgb2YgdGhlIGV4cHJlc3Npb24uXG4gIDpmb3JtIC0gR2l2ZW4gZm9ybS5cblxuICBCYXNlZCBvbiA6b3Agbm9kZSBtYXkgY29udGFpbiBkaWZmZXJlbnQgc2V0IG9mIHByb3BlcnRpZXMuXCJcbiAgKGlmIChpZGVudGljYWw/IChjb3VudCBhcmdzKSAxKVxuICAgIChhbmFseXplIHs6bG9jYWxzIHt9XG4gICAgICAgICAgICAgIDpiaW5kaW5ncyBbXVxuICAgICAgICAgICAgICA6dG9wIHRydWV9IChmaXJzdCBhcmdzKSlcbiAgICAobGV0KiAoKGVudiAoZmlyc3QgYXJncykpIChmb3JtIChzZWNvbmQgYXJncykpKVxuICAgICAgKGNvbmQgKChuaWw/IGZvcm0pIChhbmFseXplLWNvbnN0YW50IGVudiBmb3JtKSlcbiAgICAgICAgICAgICgoc3ltYm9sPyBmb3JtKSAoYW5hbHl6ZS1zeW1ib2wgZW52IGZvcm0pKVxuICAgICAgICAgICAgKChsaXN0PyBmb3JtKSAoaWYgKGVtcHR5PyBmb3JtKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgKGFuYWx5emUtcXVvdGVkIGZvcm0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAoYW5hbHl6ZS1saXN0IGVudiBmb3JtKSkpXG4gICAgICAgICAgICAoKGRpY3Rpb25hcnk/IGZvcm0pIChhbmFseXplLWRpY3Rpb25hcnkgZW52IGZvcm0pKVxuICAgICAgICAgICAgKCh2ZWN0b3I/IGZvcm0pIChhbmFseXplLXZlY3RvciBlbnYgZm9ybSkpXG4gICAgICAgICAgICA7KHNldD8gZm9ybSkgKGFuYWx5emUtc2V0IGVudiBmb3JtIG5hbWUpXG4gICAgICAgICAgICAoKGtleXdvcmQ/IGZvcm0pIChhbmFseXplLWtleXdvcmQgZW52IGZvcm0pKVxuICAgICAgICAgICAgKGVsc2UgKGFuYWx5emUtY29uc3RhbnQgZW52IGZvcm0pKSkpKSlcbiJdfQ==
