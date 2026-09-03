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
        return isNil(attributeø1) ? syntaxError('Malformed aget expression expected (aget object member)', form) : {
            'op': 'member-expression',
            'computed': !fieldø1,
            'form': form,
            'target': targetø1,
            'property': fieldø1 ? conj(analyzeSpecial(analyzeIdentifier, env, fieldø1), { 'binding': null }) : analyze(env, attributeø1)
        };
    }.call(this);
};
installSpecial('aget', analyzeAget);
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
var analyzeSymbol = exports.analyzeSymbol = function analyzeSymbol(env, form) {
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
        'params': (env || 0)['params'] || []
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
        var methodsø1 = map(function ($) {
            return analyzeFnMethod(scopeø1, $);
        }, vec(overloadsø1));
        var arityø1 = max.apply(null, map(function ($) {
            return ($ || 0)['arity'];
        }, methodsø1));
        var variadicø1 = some(function ($) {
            return ($ || 0)['variadic'];
        }, methodsø1);
        return {
            'op': 'fn',
            'type': 'function',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndpc3AvYW5hbHl6ZXIud2lzcCJdLCJuYW1lcyI6WyJfbnNfIiwiaWQiLCJkb2MiLCJtZXRhIiwid2l0aE1ldGEiLCJpc1N5bWJvbCIsImlzS2V5d29yZCIsImlzUXVvdGUiLCJzeW1ib2wiLCJuYW1lc3BhY2UiLCJuYW1lIiwicHJTdHIiLCJpc1VucXVvdGUiLCJpc1VucXVvdGVTcGxpY2luZyIsImlzTGlzdCIsImxpc3QiLCJjb25qIiwicGFydGl0aW9uIiwic2VxIiwiaXNFbXB0eSIsIm1hcCIsInZlYyIsImlzRXZlcnkiLCJjb25jYXQiLCJmaXJzdCIsInNlY29uZCIsInRoaXJkIiwicmVzdCIsImxhc3QiLCJidXRsYXN0IiwiaW50ZXJsZWF2ZSIsImNvbnMiLCJjb3VudCIsInNvbWUiLCJhc3NvYyIsInJlZHVjZSIsImZpbHRlciIsImlzU2VxIiwiZHJvcCIsImlzTmlsIiwiaXNEaWN0aW9uYXJ5IiwiaXNWZWN0b3IiLCJrZXlzIiwidmFscyIsImlzU3RyaW5nIiwiaXNOdW1iZXIiLCJpc0Jvb2xlYW4iLCJpc0RhdGUiLCJpc1JlUGF0dGVybiIsImlzRXZlbiIsImlzRXF1YWwiLCJtYXgiLCJkZWMiLCJkaWN0aW9uYXJ5Iiwic3VicyIsImluYyIsIm1hY3JvZXhwYW5kIiwic3BsaXQiLCJqb2luIiwic3ludGF4RXJyb3IiLCJleHBvcnRzIiwibWVzc2FnZSIsImZvcm0iLCJtZXRhZGF0YcO4MSIsImxpbmXDuDEiLCJ1cmnDuDEiLCJjb2x1bW7DuDEiLCJlcnJvcsO4MSIsIlN5bnRheEVycm9yIiwibGluZU51bWJlciIsImxpbmUiLCJjb2x1bW5OdW1iZXIiLCJjb2x1bW4iLCJmaWxlTmFtZSIsInVyaSIsImFuYWx5emVLZXl3b3JkIiwiZW52IiwiX19zcGVjaWFsc19fIiwiaW5zdGFsbFNwZWNpYWwiLCJvcCIsImFuYWx5emVyIiwiYW5hbHl6ZVNwZWNpYWwiLCJhc3TDuDEiLCJhbmFseXplSWYiLCJmb3Jtc8O4MSIsImVsc2VUYWlsw7gxIiwiZWxzZUZvcm3DuDEiLCJ0ZXN0w7gxIiwiYW5hbHl6ZSIsImNvbnNlcXVlbnTDuDEiLCJhbHRlcm5hdGXDuDEiLCJhbmFseXplVGhyb3ciLCJleHByZXNzaW9uw7gxIiwiYW5hbHl6ZVRyeSIsInRhaWzDuDEiLCJmaW5hbGl6ZXJGb3Jtw7gxIiwiZmluYWxpemVyw7gxIiwiYW5hbHl6ZUJsb2NrIiwiYm9keUZvcm3DuDEiLCJ0YWlsw7gyIiwiaGFuZGxlckZvcm3DuDEiLCJoYW5kbGVyw7gxIiwiYm9kecO4MSIsInN1YkVudiIsImFuYWx5emVTZXQiLCJsZWZ0w7gxIiwicmlnaHTDuDEiLCJ0YXJnZXTDuDEiLCJhbmFseXplU3ltYm9sIiwiYW5hbHl6ZUxpc3QiLCJ2YWx1ZcO4MSIsImFuYWx5emVOZXciLCJjb25zdHJ1Y3RvcsO4MSIsInBhcmFtc8O4MSIsIiQiLCJhbmFseXplQWdldCIsImF0dHJpYnV0ZcO4MSIsImZpZWxkw7gxIiwiYW5hbHl6ZUlkZW50aWZpZXIiLCJwYXJzZURlZiIsImFyZ3MiLCJhbmFseXplRGVmIiwib3DDuDEiLCJwcml2YXRlw7gxIiwiaWTDuDEiLCJiaW5kaW5nw7gxIiwiYW5hbHl6ZURlY2xhcmF0aW9uIiwiaW5pdMO4MSIsImRvY8O4MSIsImFuYWx5emVEbyIsImV4cHJlc3Npb25zw7gxIiwic3RhcnTDuDEiLCJlbmTDuDEiLCJleHBhbnNpb27DuDEiLCJyZXNvbHZlQmluZGluZyIsInVucmVzb2x2ZWRCaW5kaW5nIiwiYW5hbHl6ZVNoYWRvdyIsImFuYWx5emVCaW5kaW5nIiwiYW5hbHl6ZVBhcmFtIiwid2l0aEJpbmRpbmciLCJ3aXRoUGFyYW0iLCJhbmFseXplTGV0XyIsImlzTG9vcCIsImJpbmRpbmdzw7gxIiwiaXNWYWxpZEJpbmRpbmdzw7gxIiwiX8O4MSIsInNjb3Blw7gxIiwiJDEiLCIkMiIsImJpbmRpbmdzw7gyIiwiZXhwcmVzc2lvbnPDuDIiLCJhbmFseXplTGV0IiwiYW5hbHl6ZUxvb3AiLCJhbmFseXplUmVjdXIiLCJhbmFseXplUXVvdGVkTGlzdCIsImFuYWx5emVRdW90ZWQiLCJhbmFseXplUXVvdGVkVmVjdG9yIiwiYW5hbHl6ZVF1b3RlZERpY3Rpb25hcnkiLCJuYW1lc8O4MSIsInZhbHVlc8O4MSIsImFuYWx5emVRdW90ZWRTeW1ib2wiLCJhbmFseXplUXVvdGVkS2V5d29yZCIsImFuYWx5emVRdW90ZSIsImFuYWx5emVTdGF0ZW1lbnQiLCJzdGF0ZW1lbnRzw7gxIiwic3RhdGVtZW50w7gxIiwiZGVmc8O4MSIsInJlc3VsdMO4MSIsImFuYWx5emVGbk1ldGhvZCIsInNpZ25hdHVyZcO4MSIsInZhcmlhZGljw7gxIiwiYXJpdHnDuDEiLCJhbmFseXplRm4iLCJmb3Jtc8O4MiIsIm92ZXJsb2Fkc8O4MSIsIm1ldGhvZHPDuDEiLCJwYXJzZVJlZmVyZW5jZXMiLCJmb3JtcyIsInJlZmVyZW5jZXMiLCJwYXJzZVJlcXVpcmUiLCJyZXF1aXJlbWVudMO4MSIsInJlbmFtZXPDuDEiLCJhbGlhc8O4MSIsInJlZmVyZW5jZXPDuDEiLCJyZWZlcnMiLCJyZWZlcmVuY2UiLCJhbmFseXplTnMiLCJuYW1lw7gxIiwicmVxdWlyZW1lbnRzw7gxIiwib3BlcmF0b3LDuDEiLCJhbmFseXplcsO4MSIsImFuYWx5emVJbnZva2UiLCJhbmFseXplVmVjdG9yIiwiaXRlbXPDuDEiLCJhbmFseXplRGljdGlvbmFyeSIsImNhbGxlZcO4MSIsImFuYWx5emVDb25zdGFudCIsImVudsO4MSIsImZvcm3DuDEiXSwibWFwcGluZ3MiOiI7SUFBQSxJQUFDQSxJLEdBQUQ7QUFBQSxRQUFBQyxFLEVBQUksZUFBSjtBQUFBLFFBQUFDLEcsRUFBQTtBQUFBLE07O1FBQzhCQyxJQUFBLEcsU0FBQUEsSTtRQUFLQyxRQUFBLEcsU0FBQUEsUTtRQUFVQyxRQUFBLEcsU0FBQUEsUTtRQUFRQyxTQUFBLEcsU0FBQUEsUztRQUN2QkMsT0FBQSxHLFNBQUFBLE87UUFBT0MsTUFBQSxHLFNBQUFBLE07UUFBT0MsU0FBQSxHLFNBQUFBLFM7UUFBVUMsSUFBQSxHLFNBQUFBLEk7UUFBS0MsS0FBQSxH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b0JDLE1BQXBCO0FBQUEsUyxDQUFBLEUsR0FDZHhMLE1BQUQsQ0FBT3dMLE1BQVAsQyxnQkFBYTtBQUFBLG1CQUFLbkwsT0FBRCxDQUFRbUwsTUFBUixDQUFKLEdBQ0UzQyxhQUFELENBQWdCMkMsTUFBaEIsQ0FERCxHQUVFekYsV0FBRCxDQUFjd0YsS0FBZCxFQUFrQkMsTUFBbEIsQ0FGRDtBQUFBLFMsQ0FBQSxFLEdBR1o5SixZQUFELENBQWE4SixNQUFiLEMsZ0JBQW1CO0FBQUEsbUJBQUNKLGlCQUFELENBQW9CRyxLQUFwQixFQUF3QkMsTUFBeEI7QUFBQSxTLENBQUEsRSxHQUNsQjdKLFFBQUQsQ0FBUzZKLE1BQVQsQyxnQkFBZTtBQUFBLG1CQUFDTixhQUFELENBQWdCSyxLQUFoQixFQUFvQkMsTUFBcEI7QUFBQSxTLENBQUEsRSxHQUVkaE0sU0FBRCxDQUFVZ00sTUFBVixDLGdCQUFnQjtBQUFBLG1CQUFDM0gsY0FBRCxDQUFpQjBILEtBQWpCLEVBQXFCQyxNQUFyQjtBQUFBLFMsQ0FBQSxFLGdCQUNYO0FBQUEsbUJBQUNGLGVBQUQsQ0FBa0JDLEtBQWxCLEVBQXNCQyxNQUF0QjtBQUFBLFMsQ0FBQSxFQVRaLENBRE07QUFBQSxLLEtBQVIsQyxJQUFBLENBSkYsQztDQW5CRiIsInNvdXJjZXNDb250ZW50IjpbIihucyB3aXNwLmFuYWx5emVyXG4gICg6cmVxdWlyZSBbd2lzcC5hc3QgOnJlZmVyIFttZXRhIHdpdGgtbWV0YSBzeW1ib2w/IGtleXdvcmQ/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBxdW90ZT8gc3ltYm9sIG5hbWVzcGFjZSBuYW1lIHByLXN0clxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5xdW90ZT8gdW5xdW90ZS1zcGxpY2luZz9dXVxuICAgICAgICAgICAgW3dpc3Auc2VxdWVuY2UgOnJlZmVyIFtsaXN0PyBsaXN0IGNvbmogcGFydGl0aW9uIHNlcVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbXB0eT8gbWFwIHZlYyBldmVyeT8gY29uY2F0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0IHNlY29uZCB0aGlyZCByZXN0IGxhc3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnV0bGFzdCBpbnRlcmxlYXZlIGNvbnMgY291bnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc29tZSBhc3NvYyByZWR1Y2UgZmlsdGVyIHNlcT8gZHJvcF1dXG4gICAgICAgICAgICBbd2lzcC5ydW50aW1lIDpyZWZlciBbbmlsPyBkaWN0aW9uYXJ5PyB2ZWN0b3I/IGtleXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWxzIHN0cmluZz8gbnVtYmVyPyBib29sZWFuP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGU/IHJlLXBhdHRlcm4/IGV2ZW4/ID0gbWF4XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVjIGRpY3Rpb25hcnkgc3VicyBpbmMgZGVjXV1cbiAgICAgICAgICAgIFt3aXNwLmV4cGFuZGVyIDpyZWZlciBbbWFjcm9leHBhbmRdXVxuICAgICAgICAgICAgW3dpc3Auc3RyaW5nIDpyZWZlciBbc3BsaXQgam9pbl1dKSlcblxuKGRlZnVuIHN5bnRheC1lcnJvclxuICAobWVzc2FnZSBmb3JtKVxuICAobGV0KiAoKG1ldGFkYXRhIChtZXRhIGZvcm0pKVxuICAgICAgICAobGluZSAoOmxpbmUgKDpzdGFydCBtZXRhZGF0YSkpKVxuICAgICAgICAodXJpICg6dXJpIG1ldGFkYXRhKSlcbiAgICAgICAgKGNvbHVtbiAoOmNvbHVtbiAoOnN0YXJ0IG1ldGFkYXRhKSkpXG4gICAgICAgIChlcnJvciAoU3ludGF4RXJyb3IgKHN0ciBtZXNzYWdlIFwiXFxuXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJGb3JtOiBcIiAocHItc3RyIGZvcm0pIFwiXFxuXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJVUkk6IFwiIHVyaSBcIlxcblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiTGluZTogXCIgbGluZSBcIlxcblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29sdW1uOiBcIiBjb2x1bW4pKSkpXG4gICAgKHNldGYgZXJyb3IubGluZU51bWJlciBsaW5lKVxuICAgIChzZXRmIGVycm9yLmxpbmUgbGluZSlcbiAgICAoc2V0ZiBlcnJvci5jb2x1bW5OdW1iZXIgY29sdW1uKVxuICAgIChzZXRmIGVycm9yLmNvbHVtbiBjb2x1bW4pXG4gICAgKHNldGYgZXJyb3IuZmlsZU5hbWUgdXJpKVxuICAgIChzZXRmIGVycm9yLnVyaSB1cmkpXG4gICAgKHRocm93IGVycm9yKSkpXG5cblxuKGRlZnVuIGFuYWx5emUta2V5d29yZFxuICAoZW52IGZvcm0pXG4gIFwiRXhhbXBsZTpcbiAgKGFuYWx5emUta2V5d29yZCB7fSA6Zm9vKSA9PiB7Om9wIDpjb25zdGFudFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Zm9ybSAnOmZvb1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ZW52IHt9fVwiXG4gIHs6b3AgOmNvbnN0YW50XG4gICA6Zm9ybSBmb3JtfSlcblxuKGRlZnZhciAqKnNwZWNpYWxzKioge30pXG5cbihkZWZ1biBpbnN0YWxsLXNwZWNpYWwhXG4gIChvcCBhbmFseXplcilcbiAgKHNldGYgKGdldCAqKnNwZWNpYWxzKiogKG5hbWUgb3ApKSBhbmFseXplcikpXG5cbihkZWZ1biBhbmFseXplLXNwZWNpYWxcbiAgKGFuYWx5emVyIGVudiBmb3JtKVxuICAobGV0KiAoKG1ldGFkYXRhIChtZXRhIGZvcm0pKVxuICAgICAgICAoYXN0IChhbmFseXplciBlbnYgZm9ybSkpKVxuICAgIChjb25qIHs6c3RhcnQgKDpzdGFydCBtZXRhZGF0YSlcbiAgICAgICAgICAgOmVuZCAoOmVuZCBtZXRhZGF0YSl9XG4gICAgICAgICAgYXN0KSkpXG5cbihkZWZ1biBhbmFseXplLWlmXG4gIChlbnYgZm9ybSlcbiAgXCJFeGFtcGxlOlxuICAoYW5hbHl6ZS1pZiB7fSAnKGlmIG1vbmRheT8gOnllcCA6bm9wZSkpID0+IHs6b3AgOmlmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtICcoaWYgbW9uZGF5PyA6eWVwIDpub3BlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ZW52IHt9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDp0ZXN0IHs6b3AgOnZhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gJ21vbmRheT9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDppbmZvIG5pbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmVudiB7fX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmNvbnNlcXVlbnQgezpvcCA6Y29uc3RhbnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtICc6eWVwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6dHlwZSA6a2V5d29yZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmVudiB7fX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmFsdGVybmF0ZSB7Om9wIDpjb25zdGFudFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Zm9ybSAnOm5vcGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnR5cGUgOmtleXdvcmRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmVudiB7fX19XCJcbiAgKGxldCogKChmb3JtcyAocmVzdCBmb3JtKSlcbiAgICAgICAgOzsgRW1hY3MtTGlzcCBzaGFwZTogdGhlIGVsc2UgVEFJTCAoZXZlcnl0aGluZyBhZnRlciB0aGVcbiAgICAgICAgOzsgY29uc2VxdWVudCkgaXMgYW4gaW1wbGljaXQgYHByb2duYCwgbm90IGp1c3QgYSBzaW5nbGUgZm9ybS5cbiAgICAgICAgKGVsc2UtdGFpbCAoZHJvcCAyIGZvcm1zKSlcbiAgICAgICAgKGVsc2UtZm9ybSAoY29uZCAoKGVtcHR5PyBlbHNlLXRhaWwpIG5pbClcbiAgICAgICAgICAgICAgICAgICAgICAgICgoaWRlbnRpY2FsPyAoY291bnQgZWxzZS10YWlsKSAxKSAoZmlyc3QgZWxzZS10YWlsKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIChlbHNlIChjb25zICdwcm9nbiBlbHNlLXRhaWwpKSkpXG4gICAgICAgICh0ZXN0IChhbmFseXplIGVudiAoZmlyc3QgZm9ybXMpKSlcbiAgICAgICAgKGNvbnNlcXVlbnQgKGFuYWx5emUgZW52IChzZWNvbmQgZm9ybXMpKSlcbiAgICAgICAgKGFsdGVybmF0ZSAoYW5hbHl6ZSBlbnYgZWxzZS1mb3JtKSkpXG4gICAgKGlmICg8IChjb3VudCBmb3JtcykgMilcbiAgICAgIChzeW50YXgtZXJyb3IgXCJNYWxmb3JtZWQgaWYgZXhwcmVzc2lvbiwgdG9vIGZldyBvcGVyYW5kc1wiIGZvcm0pKVxuICAgIHs6b3AgOmlmXG4gICAgIDpmb3JtIGZvcm1cbiAgICAgOnRlc3QgdGVzdFxuICAgICA6Y29uc2VxdWVudCBjb25zZXF1ZW50XG4gICAgIDphbHRlcm5hdGUgYWx0ZXJuYXRlfSkpXG5cbihpbnN0YWxsLXNwZWNpYWwhIDppZiBhbmFseXplLWlmKVxuXG4oZGVmdW4gYW5hbHl6ZS10aHJvd1xuICAoZW52IGZvcm0pXG4gIFwiRXhhbXBsZTpcbiAgKGFuYWx5emUtdGhyb3cge30gJyh0aHJvdyAoRXJyb3IgOmJvb20pKSkgPT4gezpvcCA6dGhyb3dcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtICcodGhyb3cgKEVycm9yIDpib29tKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDp0aHJvdyB7Om9wIDppbnZva2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmNhbGxlZSB7Om9wIDp2YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gJ0Vycm9yXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDppbmZvIG5pbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ZW52IHt9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6cGFyYW1zIFt7Om9wIDpjb25zdGFudFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnR5cGUgOmtleXdvcmRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtICc6Ym9vbVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmVudiB7fX1dfX1cIlxuICAobGV0KiAoKGV4cHJlc3Npb24gKGFuYWx5emUgZW52IChzZWNvbmQgZm9ybSkpKSlcbiAgICB7Om9wIDp0aHJvd1xuICAgICA6Zm9ybSBmb3JtXG4gICAgIDp0aHJvdyBleHByZXNzaW9ufSkpXG5cbihpbnN0YWxsLXNwZWNpYWwhIDp0aHJvdyBhbmFseXplLXRocm93KVxuXG4oZGVmdW4gYW5hbHl6ZS10cnlcbiAgKGVudiBmb3JtKVxuICAobGV0KiAoKGZvcm1zICh2ZWMgKHJlc3QgZm9ybSkpKVxuXG4gICAgICAgIDs7IEZpbmFsbHlcbiAgICAgICAgKHRhaWwgKGxhc3QgZm9ybXMpKVxuICAgICAgICAoZmluYWxpemVyLWZvcm0gKGlmIChhbmQgKGxpc3Q/IHRhaWwpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICg9ICdmaW5hbGx5IChmaXJzdCB0YWlsKSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgKHJlc3QgdGFpbCkpKVxuICAgICAgICAoZmluYWxpemVyIChpZiBmaW5hbGl6ZXItZm9ybVxuICAgICAgICAgICAgICAgICAgICAoYW5hbHl6ZS1ibG9jayBlbnYgZmluYWxpemVyLWZvcm0pKSlcblxuICAgICAgICA7OyBjYXRjaFxuICAgICAgICAoYm9keS1mb3JtIChpZiBmaW5hbGl6ZXJcbiAgICAgICAgICAgICAgICAgICAgKGJ1dGxhc3QgZm9ybXMpXG4gICAgICAgICAgICAgICAgICAgIGZvcm1zKSlcblxuICAgICAgICAodGFpbCAobGFzdCBib2R5LWZvcm0pKVxuICAgICAgICAoaGFuZGxlci1mb3JtIChpZiAoYW5kIChsaXN0PyB0YWlsKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKD0gJ2NhdGNoIChmaXJzdCB0YWlsKSkpXG4gICAgICAgICAgICAgICAgICAgICAgIChyZXN0IHRhaWwpKSlcbiAgICAgICAgKGhhbmRsZXIgKGlmIGhhbmRsZXItZm9ybVxuICAgICAgICAgICAgICAgICAgKGNvbmogezpuYW1lIChhbmFseXplIGVudiAoZmlyc3QgaGFuZGxlci1mb3JtKSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAoYW5hbHl6ZS1ibG9jayBlbnYgKHJlc3QgaGFuZGxlci1mb3JtKSkpKSlcblxuICAgICAgICA7OyBUcnlcbiAgICAgICAgKGJvZHkgKGlmIGhhbmRsZXItZm9ybVxuICAgICAgICAgICAgICAgKGFuYWx5emUtYmxvY2sgKHN1Yi1lbnYgZW52KSAoYnV0bGFzdCBib2R5LWZvcm0pKVxuICAgICAgICAgICAgICAgKGFuYWx5emUtYmxvY2sgKHN1Yi1lbnYgZW52KSBib2R5LWZvcm0pKSkpXG4gICAgezpvcCA6dHJ5XG4gICAgIDpmb3JtIGZvcm1cbiAgICAgOmJvZHkgYm9keVxuICAgICA6aGFuZGxlciBoYW5kbGVyXG4gICAgIDpmaW5hbGl6ZXIgZmluYWxpemVyfSkpXG5cbihpbnN0YWxsLXNwZWNpYWwhIDp0cnkgYW5hbHl6ZS10cnkpXG5cbihkZWZ1biBhbmFseXplLXNldCFcbiAgKGVudiBmb3JtKVxuICAobGV0KiAoKGJvZHkgKHJlc3QgZm9ybSkpXG4gICAgICAgIChsZWZ0IChmaXJzdCBib2R5KSlcbiAgICAgICAgKHJpZ2h0IChzZWNvbmQgYm9keSkpXG4gICAgICAgICh0YXJnZXQgKGNvbmQgKChzeW1ib2w/IGxlZnQpIChhbmFseXplLXN5bWJvbCBlbnYgbGVmdCkpXG4gICAgICAgICAgICAgICAgICAgICAoKGxpc3Q/IGxlZnQpIChhbmFseXplLWxpc3QgZW52IGxlZnQpKVxuICAgICAgICAgICAgICAgICAgICAgKGVsc2UgbGVmdCkpKVxuICAgICAgICAodmFsdWUgKGFuYWx5emUgZW52IHJpZ2h0KSkpXG4gICAgezpvcCA6c2V0IVxuICAgICA6dGFyZ2V0IHRhcmdldFxuICAgICA6dmFsdWUgdmFsdWVcbiAgICAgOmZvcm0gZm9ybX0pKVxuKGluc3RhbGwtc3BlY2lhbCEgOnNldCEgYW5hbHl6ZS1zZXQhKVxuXG4oZGVmdW4gYW5hbHl6ZS1uZXdcbiAgKGVudiBmb3JtKVxuICAobGV0KiAoKGJvZHkgKHJlc3QgZm9ybSkpXG4gICAgICAgIChjb25zdHJ1Y3RvciAoYW5hbHl6ZSBlbnYgKGZpcnN0IGJvZHkpKSlcbiAgICAgICAgKHBhcmFtcyAodmVjIChtYXAgKGxhbWJkYSAoJSkgKGFuYWx5emUgZW52ICUpKSAocmVzdCBib2R5KSkpKSlcbiAgICB7Om9wIDpuZXdcbiAgICAgOmNvbnN0cnVjdG9yIGNvbnN0cnVjdG9yXG4gICAgIDpmb3JtIGZvcm1cbiAgICAgOnBhcmFtcyBwYXJhbXN9KSlcbihpbnN0YWxsLXNwZWNpYWwhIDpuZXcgYW5hbHl6ZS1uZXcpXG5cbihkZWZ1biBhbmFseXplLWFnZXRcbiAgKGVudiBmb3JtKVxuICAobGV0KiAoKGJvZHkgKHJlc3QgZm9ybSkpXG4gICAgICAgICh0YXJnZXQgKGFuYWx5emUgZW52IChmaXJzdCBib2R5KSkpXG4gICAgICAgIChhdHRyaWJ1dGUgKHNlY29uZCBib2R5KSlcbiAgICAgICAgKGZpZWxkIChhbmQgKHF1b3RlPyBhdHRyaWJ1dGUpXG4gICAgICAgICAgICAgICAgICAgKHN5bWJvbD8gKHNlY29uZCBhdHRyaWJ1dGUpKVxuICAgICAgICAgICAgICAgICAgIChzZWNvbmQgYXR0cmlidXRlKSkpKVxuICAgIChpZiAobmlsPyBhdHRyaWJ1dGUpXG4gICAgICAoc3ludGF4LWVycm9yIFwiTWFsZm9ybWVkIGFnZXQgZXhwcmVzc2lvbiBleHBlY3RlZCAoYWdldCBvYmplY3QgbWVtYmVyKVwiXG4gICAgICAgICAgICAgICAgICAgIGZvcm0pXG4gICAgICB7Om9wIDptZW1iZXItZXhwcmVzc2lvblxuICAgICAgIDpjb21wdXRlZCAobm90IGZpZWxkKVxuICAgICAgIDpmb3JtIGZvcm1cbiAgICAgICA6dGFyZ2V0IHRhcmdldFxuICAgICAgIDs7IElmIGZpZWxkIGlzIGEgcXVvdGVkIHN5bWJvbCB0aGVyZSdzIG5vIG5lZWQgdG8gcmVzb2x2ZVxuICAgICAgIDs7IGl0IGZvciBpbmZvXG4gICAgICAgOnByb3BlcnR5IChpZiBmaWVsZFxuICAgICAgICAgICAgICAgICAgIChjb25qIChhbmFseXplLXNwZWNpYWwgYW5hbHl6ZS1pZGVudGlmaWVyIGVudiBmaWVsZClcbiAgICAgICAgICAgICAgICAgICAgICAgICB7OmJpbmRpbmcgbmlsfSlcbiAgICAgICAgICAgICAgICAgICAoYW5hbHl6ZSBlbnYgYXR0cmlidXRlKSl9KSkpXG4oaW5zdGFsbC1zcGVjaWFsISA6YWdldCBhbmFseXplLWFnZXQpXG5cbihkZWZ1biBwYXJzZS1kZWZcbiAgKGlkICZyZXN0IGFyZ3MpXG4gIChjb25kICgoZW1wdHk/IGFyZ3MpIHs6aWQgaWR9KVxuICAgICAgICAoKGlkZW50aWNhbD8gKGNvdW50IGFyZ3MpIDEpIHs6aWQgaWQgOmluaXQgKGZpcnN0IGFyZ3MpfSlcbiAgICAgICAgKGVsc2UgezppZCBpZCA6ZG9jIChmaXJzdCBhcmdzKSA6aW5pdCAoc2Vjb25kIGFyZ3MpfSkpKVxuXG4oZGVmdW4gYW5hbHl6ZS1kZWZcbiAgKGVudiBmb3JtKVxuICBcIkJhY2tzIGBkZWZ2YXJgL2BkZWZ2YXItYC9gZGVmY29uc3RgL2BkZWZjb25zdC1gLiBQcml2YWN5ICh3aGV0aGVyIHRoZVxuICBiaW5kaW5nIGxhbmRzIG9uIGBleHBvcnRzYCkgaXMgZGVjaWRlZCBieSB3aGljaCBvZiB0aG9zZSBmb3VyIGhlYWRcbiAgc3ltYm9scyB3YXMgdXNlZCAtLSBhIHRyYWlsaW5nIGAtYCBtZWFucyBwcml2YXRlIC0tIHJhdGhlciB0aGFuIGJ5XG4gIGBeOnByaXZhdGVgIHJlYWRlciBtZXRhZGF0YSwgd2hpY2ggbmV3LXN5bnRheCBkcm9wcyBlbnRpcmVseS5cIlxuICAobGV0KiAoKG9wIChuYW1lIChmaXJzdCBmb3JtKSkpXG4gICAgICAgIChwcml2YXRlIChvciAoaWRlbnRpY2FsPyBvcCBcImRlZnZhci1cIilcbiAgICAgICAgICAgICAgICAgICAgKGlkZW50aWNhbD8gb3AgXCJkZWZjb25zdC1cIikpKVxuICAgICAgICAocGFyYW1zIChhcHBseSBwYXJzZS1kZWYgKHZlYyAocmVzdCBmb3JtKSkpKVxuICAgICAgICAoaWQgKDppZCBwYXJhbXMpKVxuICAgICAgICAobWV0YWRhdGEgKG1ldGEgaWQpKVxuXG4gICAgICAgIChiaW5kaW5nIChhbmFseXplLXNwZWNpYWwgYW5hbHl6ZS1kZWNsYXJhdGlvbiBlbnYgaWQpKVxuXG4gICAgICAgIChpbml0IChhbmFseXplIGVudiAoOmluaXQgcGFyYW1zKSkpXG5cbiAgICAgICAgKGRvYyAob3IgKDpkb2MgcGFyYW1zKVxuICAgICAgICAgICAgICAgICg6ZG9jIG1ldGFkYXRhKSkpKVxuICAgIHs6b3AgOmRlZlxuICAgICA6ZG9jIGRvY1xuICAgICA6aWQgYmluZGluZ1xuICAgICA6aW5pdCBpbml0XG4gICAgIDpleHBvcnQgKGFuZCAoOnRvcCBlbnYpXG4gICAgICAgICAgICAgICAgICAobm90IHByaXZhdGUpKVxuICAgICA6Zm9ybSBmb3JtfSkpXG4oaW5zdGFsbC1zcGVjaWFsISA6ZGVmdmFyIGFuYWx5emUtZGVmKVxuKGluc3RhbGwtc3BlY2lhbCEgOmRlZnZhci0gYW5hbHl6ZS1kZWYpXG4oaW5zdGFsbC1zcGVjaWFsISA6ZGVmY29uc3QgYW5hbHl6ZS1kZWYpXG4oaW5zdGFsbC1zcGVjaWFsISA6ZGVmY29uc3QtIGFuYWx5emUtZGVmKVxuXG4oZGVmdW4gYW5hbHl6ZS1kb1xuICAoZW52IGZvcm0pXG4gIChsZXQqICgoZXhwcmVzc2lvbnMgKHJlc3QgZm9ybSkpXG4gICAgICAgIChib2R5IChhbmFseXplLWJsb2NrIGVudiBleHByZXNzaW9ucykpKVxuICAgIChjb25qIGJvZHkgezpvcCA6ZG9cbiAgICAgICAgICAgICAgICA6Zm9ybSBmb3JtfSkpKVxuKGluc3RhbGwtc3BlY2lhbCEgOnByb2duIGFuYWx5emUtZG8pXG5cbihkZWZ1biBhbmFseXplLXN5bWJvbFxuICAoZW52IGZvcm0pXG4gIFwiU3ltYm9sIGFuYWx5emVyIGFsc28gZG9lcyBzeW50YXggZGVzdWdhcmluZyBmb3IgdGhlIHN5bWJvbHNcbiAgbGlrZSBmb28uYmFyLmJheiBwcm9kdWNpbmcgKGFnZXQgZm9vICdiYXIuYmF6KSBmb3JtLiBUaGlzIGVuYWJsZXNcbiAgcmVuYW1pbmcgb2Ygc2hhZG93ZWQgc3ltYm9scy5cIlxuICAobGV0KiAoKGZvcm1zIChzcGxpdCAobmFtZSBmb3JtKSBcXC4pKVxuICAgICAgICAobWV0YWRhdGEgKG1ldGEgZm9ybSkpXG4gICAgICAgIChzdGFydCAoOnN0YXJ0IG1ldGFkYXRhKSlcbiAgICAgICAgKGVuZCAoOmVuZCBtZXRhZGF0YSkpXG4gICAgICAgIChleHBhbnNpb24gKGlmICg+IChjb3VudCBmb3JtcykgMSlcbiAgICAgICAgICAgICAgICAgICAobGlzdCAnYWdldFxuICAgICAgICAgICAgICAgICAgICAgICAgICh3aXRoLW1ldGEgKHN5bWJvbCAoZmlyc3QgZm9ybXMpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgKGNvbmogbWV0YWRhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHs6c3RhcnQgc3RhcnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ZW5kIHs6bGluZSAoOmxpbmUgZW5kKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpjb2x1bW4gKCsgMSAoOmNvbHVtbiBzdGFydCkgKGNvdW50IChmaXJzdCBmb3JtcykpKX19KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAobGlzdCAncXVvdGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAod2l0aC1tZXRhIChzeW1ib2wgKGpvaW4gXFwuIChyZXN0IGZvcm1zKSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoY29uaiBtZXRhZGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgezplbmQgZW5kXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnN0YXJ0IHs6bGluZSAoOmxpbmUgc3RhcnQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Y29sdW1uICgrIDEgKDpjb2x1bW4gc3RhcnQpIChjb3VudCAoZmlyc3QgZm9ybXMpKSl9fSkpKSkpKSlcbiAgICAoaWYgZXhwYW5zaW9uXG4gICAgICAoYW5hbHl6ZSBlbnYgKHdpdGgtbWV0YSBleHBhbnNpb24gKG1ldGEgZm9ybSkpKVxuICAgICAgKGFuYWx5emUtc3BlY2lhbCBhbmFseXplLWlkZW50aWZpZXIgZW52IGZvcm0pKSkpXG5cbihkZWZ1biBhbmFseXplLWlkZW50aWZpZXJcbiAgKGVudiBmb3JtKVxuICB7Om9wIDp2YXJcbiAgIDp0eXBlIDppZGVudGlmaWVyXG4gICA6Zm9ybSBmb3JtXG4gICA6c3RhcnQgKDpzdGFydCAobWV0YSBmb3JtKSlcbiAgIDplbmQgKDplbmQgKG1ldGEgZm9ybSkpXG4gICA6YmluZGluZyAocmVzb2x2ZS1iaW5kaW5nIGVudiBmb3JtKX0pXG5cbihkZWZ1biB1bnJlc29sdmVkLWJpbmRpbmdcbiAgKGVudiBmb3JtKVxuICB7Om9wIDp1bnJlc29sdmVkLWJpbmRpbmdcbiAgIDp0eXBlIDp1bnJlc29sdmVkLWJpbmRpbmdcbiAgIDppZGVudGlmaWVyIHs6dHlwZSA6aWRlbnRpZmllclxuICAgICAgICAgICAgICAgIDpmb3JtIChzeW1ib2wgKG5hbWVzcGFjZSBmb3JtKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG5hbWUgZm9ybSkpfVxuICAgOnN0YXJ0ICg6c3RhcnQgKG1ldGEgZm9ybSkpXG4gICA6ZW5kICg6ZW5kIChtZXRhIGZvcm0pKX0pXG5cbihkZWZ1biByZXNvbHZlLWJpbmRpbmdcbiAgKGVudiBmb3JtKVxuICAob3IgKGdldCAoOmxvY2FscyBlbnYpIChuYW1lIGZvcm0pKVxuICAgICAgKGdldCAoOmVuY2xvc2VkIGVudikgKG5hbWUgZm9ybSkpXG4gICAgICAodW5yZXNvbHZlZC1iaW5kaW5nIGVudiBmb3JtKSkpXG5cbihkZWZ1biBhbmFseXplLXNoYWRvd1xuICAoZW52IGlkKVxuICAobGV0KiAoKGJpbmRpbmcgKHJlc29sdmUtYmluZGluZyBlbnYgaWQpKSlcbiAgICB7OmRlcHRoIChpbmMgKG9yICg6ZGVwdGggYmluZGluZykgMCkpXG4gICAgIDpzaGFkb3cgYmluZGluZ30pKVxuXG4oZGVmdW4gYW5hbHl6ZS1iaW5kaW5nXG4gIChlbnYgZm9ybSlcbiAgKGxldCogKChpZCAoZmlyc3QgZm9ybSkpXG4gICAgICAgIChib2R5IChzZWNvbmQgZm9ybSkpKVxuICAgIChjb25qIChhbmFseXplLXNoYWRvdyBlbnYgaWQpXG4gICAgICAgICAgezpvcCA6YmluZGluZ1xuICAgICAgICAgICA6dHlwZSA6YmluZGluZ1xuICAgICAgICAgICA6aWQgaWRcbiAgICAgICAgICAgOmluaXQgKGFuYWx5emUgZW52IGJvZHkpXG4gICAgICAgICAgIDpmb3JtIGZvcm19KSkpXG5cbihkZWZ1biBhbmFseXplLWRlY2xhcmF0aW9uXG4gIChlbnYgZm9ybSlcbiAgKGFzc2VydCAobm90IChvciAobmFtZXNwYWNlIGZvcm0pXG4gICAgICAgICAgICAgICAgICAgKDwgMSAoY291bnQgKHNwbGl0IFxcLiAoc3RyIGZvcm0pKSkpKSkpXG4gIChjb25qIChhbmFseXplLXNoYWRvdyBlbnYgZm9ybSlcbiAgICAgICAgezpvcCA6dmFyXG4gICAgICAgICA6dHlwZSA6aWRlbnRpZmllclxuICAgICAgICAgOmRlcHRoIDBcbiAgICAgICAgIDppZCBmb3JtXG4gICAgICAgICA6Zm9ybSBmb3JtfSkpXG5cbihkZWZ1biBhbmFseXplLXBhcmFtXG4gIChlbnYgZm9ybSlcbiAgKGNvbmogKGFuYWx5emUtc2hhZG93IGVudiBmb3JtKVxuICAgICAgICB7Om9wIDpwYXJhbVxuICAgICAgICAgOnR5cGUgOnBhcmFtZXRlclxuICAgICAgICAgOmlkIGZvcm1cbiAgICAgICAgIDpmb3JtIGZvcm1cbiAgICAgICAgIDpzdGFydCAoOnN0YXJ0IChtZXRhIGZvcm0pKVxuICAgICAgICAgOmVuZCAoOmVuZCAobWV0YSBmb3JtKSl9KSlcblxuKGRlZnVuIHdpdGgtYmluZGluZ1xuICAoZW52IGZvcm0pXG4gIFwiUmV0dXJucyBlbmhhbmNlZCBlbnZpcm9ubWVudCB3aXRoIGFkZGl0aW9uYWwgYmluZGluZyBhZGRlZFxuICB0byB0aGUgOmJpbmRpbmdzIGFuZCA6c2NvcGVcIlxuICAoY29uaiBlbnYgezpsb2NhbHMgKGFzc29jICg6bG9jYWxzIGVudikgKG5hbWUgKDppZCBmb3JtKSkgZm9ybSlcbiAgICAgICAgICAgICA6YmluZGluZ3MgKGNvbmogKDpiaW5kaW5ncyBlbnYpIGZvcm0pfSkpXG5cbihkZWZ1biB3aXRoLXBhcmFtXG4gIChlbnYgZm9ybSlcbiAgKGNvbmogKHdpdGgtYmluZGluZyBlbnYgZm9ybSlcbiAgICAgICAgezpwYXJhbXMgKGNvbmogKDpwYXJhbXMgZW52KSBmb3JtKX0pKVxuXG4oZGVmdW4gc3ViLWVudlxuICAoZW52KVxuICB7OmVuY2xvc2VkIChjb25qIHt9XG4gICAgICAgICAgICAgICAgICAgKDplbmNsb3NlZCBlbnYpXG4gICAgICAgICAgICAgICAgICAgKDpsb2NhbHMgZW52KSlcbiAgIDpsb2NhbHMge31cbiAgIDpiaW5kaW5ncyBbXVxuICAgOnBhcmFtcyAob3IgKDpwYXJhbXMgZW52KSBbXSl9KVxuXG5cbihkZWZ1biBhbmFseXplLWxldCpcbiAgKGVudiBmb3JtIGlzLWxvb3ApXG4gIFwiVGFrZXMgbGV0IGZvcm0gYW5kIGVuaGFuY2VzIGl0J3MgbWV0YWRhdGEgdmlhIGFuYWx5emVkXG4gIGluZm9cIlxuICAobGV0KiAoKGV4cHJlc3Npb25zIChyZXN0IGZvcm0pKVxuICAgICAgICAoYmluZGluZ3MgKGZpcnN0IGV4cHJlc3Npb25zKSlcbiAgICAgICAgKGJvZHkgKHJlc3QgZXhwcmVzc2lvbnMpKVxuXG4gICAgICAgICh2YWxpZC1iaW5kaW5ncz8gKGFuZCAodmVjdG9yPyBiaW5kaW5ncylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGV2ZW4/IChjb3VudCBiaW5kaW5ncykpKSlcblxuICAgICAgICAoXyAoYXNzZXJ0IHZhbGlkLWJpbmRpbmdzP1xuICAgICAgICAgICAgICAgICAgXCJiaW5kaW5ncyBtdXN0IGJlIHZlY3RvciBvZiBldmVuIG51bWJlciBvZiBlbGVtZW50c1wiKSlcblxuICAgICAgICAoc2NvcGUgKHJlZHVjZSAobGFtYmRhICglMSAlMikgKHdpdGgtYmluZGluZyAlMSAoYW5hbHl6ZS1iaW5kaW5nICUxICUyKSkpXG4gICAgICAgICAgICAgICAgICAgICAgKHN1Yi1lbnYgZW52KVxuICAgICAgICAgICAgICAgICAgICAgIChwYXJ0aXRpb24gMiBiaW5kaW5ncykpKVxuXG4gICAgICAgIChiaW5kaW5ncyAoOmJpbmRpbmdzIHNjb3BlKSlcblxuICAgICAgICAoZXhwcmVzc2lvbnMgKGFuYWx5emUtYmxvY2sgKGlmIGlzLWxvb3BcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoY29uaiBzY29wZSB7OnBhcmFtcyBiaW5kaW5nc30pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvZHkpKSlcblxuICAgIHs6b3AgOmxldFxuICAgICA6Zm9ybSBmb3JtXG4gICAgIDpzdGFydCAoOnN0YXJ0IChtZXRhIGZvcm0pKVxuICAgICA6ZW5kICg6ZW5kIChtZXRhIGZvcm0pKVxuICAgICA6YmluZGluZ3MgYmluZGluZ3NcbiAgICAgOnN0YXRlbWVudHMgKDpzdGF0ZW1lbnRzIGV4cHJlc3Npb25zKVxuICAgICA6cmVzdWx0ICg6cmVzdWx0IGV4cHJlc3Npb25zKX0pKVxuXG4oZGVmdW4gYW5hbHl6ZS1sZXRcbiAgKGVudiBmb3JtKVxuICAoYW5hbHl6ZS1sZXQqIGVudiBmb3JtIGZhbHNlKSlcbjs7IGBsZXQqKmAgaXMgdGhlIHBvc3QtbWFjcm9leHBhbnNpb24gaW50ZXJuYWwgYmluZGluZyBmb3JtIChmbGF0IHZlY3RvciBvZlxuOzsgbmFtZS9pbml0IHBhaXJzLCBzZXF1ZW50aWFsKSAtLSBhbmFsb2dvdXMgdG8gYGZuKmAvYGxvb3AqYC4gTmV3LXN5bnRheCdzXG47OyB1c2VyLWZhY2luZyBgbGV0YC9gbGV0KmAgKHBhcmVuLWxpc3QgYmluZGluZ3MpIGFyZSBleHBhbmRlciBtYWNyb3MgdGhhdFxuOzsgYm90aCBsb3dlciB0byB0aGlzIGZvcm07IGtlZXBpbmcgdGhlIGludGVybmFsIGtleSBkaXN0aW5jdCBmcm9tIHRoZVxuOzsgcHVibGljIGBsZXQqYCBzcGVsbGluZyBhdm9pZHMgdGhlIG1hY3JvZXhwYW5kZXIgcmUtZXhwYW5kaW5nIGl0cyBvd25cbjs7IG91dHB1dC5cbihpbnN0YWxsLXNwZWNpYWwhIDpsZXQqKiBhbmFseXplLWxldClcblxuKGRlZnVuIGFuYWx5emUtbG9vcFxuICAoZW52IGZvcm0pXG4gIChjb25qIChhbmFseXplLWxldCogZW52IGZvcm0gdHJ1ZSkgezpvcCA6bG9vcH0pKVxuKGluc3RhbGwtc3BlY2lhbCEgOmxvb3AqIGFuYWx5emUtbG9vcClcblxuXG4oZGVmdW4gYW5hbHl6ZS1yZWN1clxuICAoZW52IGZvcm0pXG4gIChsZXQqICgocGFyYW1zICg6cGFyYW1zIGVudikpXG4gICAgICAgIChmb3JtcyAodmVjIChtYXAgKGxhbWJkYSAoJSkgKGFuYWx5emUgZW52ICUpKSAocmVzdCBmb3JtKSkpKSlcblxuICAgIChpZiAoPSAoY291bnQgcGFyYW1zKVxuICAgICAgICAgICAoY291bnQgZm9ybXMpKVxuICAgICAgezpvcCA6cmVjdXJcbiAgICAgICA6Zm9ybSBmb3JtXG4gICAgICAgOnBhcmFtcyBmb3Jtc31cbiAgICAgIChzeW50YXgtZXJyb3IgXCJSZWN1cnMgd2l0aCB3cm9uZyBudW1iZXIgb2YgYXJndW1lbnRzXCJcbiAgICAgICAgICAgICAgICAgICAgZm9ybSkpKSlcbihpbnN0YWxsLXNwZWNpYWwhIDpyZWN1ciBhbmFseXplLXJlY3VyKVxuXG4oZGVmdW4gYW5hbHl6ZS1xdW90ZWQtbGlzdFxuICAoZm9ybSlcbiAgezpvcCA6bGlzdFxuICAgOml0ZW1zIChtYXAgYW5hbHl6ZS1xdW90ZWQgKHZlYyBmb3JtKSlcbiAgIDpmb3JtIGZvcm1cbiAgIDpzdGFydCAoOnN0YXJ0IChtZXRhIGZvcm0pKVxuICAgOmVuZCAoOmVuZCAobWV0YSBmb3JtKSl9KVxuXG4oZGVmdW4gYW5hbHl6ZS1xdW90ZWQtdmVjdG9yXG4gIChmb3JtKVxuICB7Om9wIDp2ZWN0b3JcbiAgIDppdGVtcyAobWFwIGFuYWx5emUtcXVvdGVkIGZvcm0pXG4gICA6Zm9ybSBmb3JtXG4gICA6c3RhcnQgKDpzdGFydCAobWV0YSBmb3JtKSlcbiAgIDplbmQgKDplbmQgKG1ldGEgZm9ybSkpfSlcblxuKGRlZnVuIGFuYWx5emUtcXVvdGVkLWRpY3Rpb25hcnlcbiAgKGZvcm0pXG4gIChsZXQqICgobmFtZXMgKHZlYyAobWFwIGFuYWx5emUtcXVvdGVkIChrZXlzIGZvcm0pKSkpXG4gICAgICAgICh2YWx1ZXMgKHZlYyAobWFwIGFuYWx5emUtcXVvdGVkICh2YWxzIGZvcm0pKSkpKVxuICAgIHs6b3AgOmRpY3Rpb25hcnlcbiAgICAgOmZvcm0gZm9ybVxuICAgICA6a2V5cyBuYW1lc1xuICAgICA6dmFsdWVzIHZhbHVlc1xuICAgICA6c3RhcnQgKDpzdGFydCAobWV0YSBmb3JtKSlcbiAgICAgOmVuZCAoOmVuZCAobWV0YSBmb3JtKSl9KSlcblxuKGRlZnVuIGFuYWx5emUtcXVvdGVkLXN5bWJvbFxuICAoZm9ybSlcbiAgezpvcCA6c3ltYm9sXG4gICA6bmFtZSAobmFtZSBmb3JtKVxuICAgOm5hbWVzcGFjZSAobmFtZXNwYWNlIGZvcm0pXG4gICA6Zm9ybSBmb3JtfSlcblxuKGRlZnVuIGFuYWx5emUtcXVvdGVkLWtleXdvcmRcbiAoZm9ybSlcbiAgezpvcCA6a2V5d29yZFxuICAgOm5hbWUgKG5hbWUgZm9ybSlcbiAgIDpuYW1lc3BhY2UgKG5hbWVzcGFjZSBmb3JtKVxuICAgOmZvcm0gZm9ybX0pXG5cbihkZWZ1biBhbmFseXplLXF1b3RlZFxuICAoZm9ybSlcbiAgKGNvbmQgKChzeW1ib2w/IGZvcm0pIChhbmFseXplLXF1b3RlZC1zeW1ib2wgZm9ybSkpXG4gICAgICAgICgoa2V5d29yZD8gZm9ybSkgKGFuYWx5emUtcXVvdGVkLWtleXdvcmQgZm9ybSkpXG4gICAgICAgICgobGlzdD8gZm9ybSkgKGFuYWx5emUtcXVvdGVkLWxpc3QgZm9ybSkpXG4gICAgICAgICgodmVjdG9yPyBmb3JtKSAoYW5hbHl6ZS1xdW90ZWQtdmVjdG9yIGZvcm0pKVxuICAgICAgICAoKGRpY3Rpb25hcnk/IGZvcm0pIChhbmFseXplLXF1b3RlZC1kaWN0aW9uYXJ5IGZvcm0pKVxuICAgICAgICAoZWxzZSB7Om9wIDpjb25zdGFudFxuICAgICAgICAgICAgICAgOmZvcm0gZm9ybX0pKSlcblxuKGRlZnVuIGFuYWx5emUtcXVvdGVcbiAgKGVudiBmb3JtKVxuICBcIkV4YW1wbGVzOlxuICAgKGFuYWx5emUtcXVvdGUge30gJyhxdW90ZSBmb28pKSA9PiB7Om9wIDpjb25zdGFudFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gJ2Zvb1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmVudiBlbnZ9XCJcbiAgKGFuYWx5emUtcXVvdGVkIChzZWNvbmQgZm9ybSkpKVxuKGluc3RhbGwtc3BlY2lhbCEgOnF1b3RlIGFuYWx5emUtcXVvdGUpXG5cbihkZWZ1biBhbmFseXplLXN0YXRlbWVudFxuICAoZW52IGZvcm0pXG4gIChsZXQqICgoc3RhdGVtZW50cyAob3IgKDpzdGF0ZW1lbnRzIGVudikgW10pKVxuICAgICAgICAoYmluZGluZ3MgKG9yICg6YmluZGluZ3MgZW52KSBbXSkpXG4gICAgICAgIChzdGF0ZW1lbnQgKGFuYWx5emUgKGNvbmogZW52IHs6c3RhdGVtZW50cyBuaWx9KSBmb3JtKSlcbiAgICAgICAgKG9wICg6b3Agc3RhdGVtZW50KSlcblxuICAgICAgICAoZGVmcyAoY29uZCAoKD0gb3AgOmRlZikgWyg6dmFyIHN0YXRlbWVudCldKVxuICAgICAgICAgICAgICAgICAgIDs7ICg9IG9wIDpucykgKDpyZXF1aXJlbWVudCBub2RlKVxuICAgICAgICAgICAgICAgICAgIChlbHNlIG5pbCkpKSlcblxuICAgIChjb25qIGVudiB7OnN0YXRlbWVudHMgKGNvbmogc3RhdGVtZW50cyBzdGF0ZW1lbnQpXG4gICAgICAgICAgICAgICA6YmluZGluZ3MgKGNvbmNhdCBiaW5kaW5ncyBkZWZzKX0pKSlcblxuKGRlZnVuIGFuYWx5emUtYmxvY2tcbiAgKGVudiBmb3JtKVxuICBcIkV4YW1wbGVzOlxuICAoYW5hbHl6ZS1ibG9jayB7fSAnKChmb28gYmFyKSkpID0+IHs6c3RhdGVtZW50cyBuaWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnJlc3VsdCB7Om9wIDppbnZva2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gJyhmb28gYmFyKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ZW52IHt9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpjYWxsZWUgezpvcCA6dmFyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtICdmb29cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmluZm8gbmlsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDplbnYge319XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpwYXJhbXMgW3s6b3AgOnZhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gJ2JhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmluZm8gbmlsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ZW52IHt9fV19XG4gIChhbmFseXplLWJsb2NrIHt9ICcoKGJlZXAgYnopXG4gICAgICAgICAgICAgICAgICAgICAgKGZvbyBiYXIpKSkgPT4gezpzdGF0ZW1lbnRzIFt7Om9wIDppbnZva2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Zm9ybSAnKGJlZXAgYnopXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmVudiB7fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpjYWxsZWUgezpvcCA6dmFyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gJ2JlZXBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6aW5mbyBuaWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ZW52IHt9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpwYXJhbXMgW3s6b3AgOnZhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Zm9ybSAnYnpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmluZm8gbmlsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDplbnYge319XX1dXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpyZXN1bHQgezpvcCA6aW52b2tlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtICcoZm9vIGJhcilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmVudiB7fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Y2FsbGVlIHs6b3AgOnZhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Zm9ybSAnZm9vXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDppbmZvIG5pbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ZW52IHt9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6cGFyYW1zIFt7Om9wIDp2YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtICdiYXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDppbmZvIG5pbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmVudiB7fX1dfVwiXG4gIChsZXQqICgoYm9keSAoaWYgKD4gKGNvdW50IGZvcm0pIDEpXG4gICAgICAgICAgICAgICAocmVkdWNlIGFuYWx5emUtc3RhdGVtZW50XG4gICAgICAgICAgICAgICAgICAgICAgIGVudlxuICAgICAgICAgICAgICAgICAgICAgICAoYnV0bGFzdCBmb3JtKSkpKVxuICAgICAgICAocmVzdWx0IChhbmFseXplIChvciBib2R5IGVudikgKGxhc3QgZm9ybSkpKSlcbiAgICB7OnN0YXRlbWVudHMgKDpzdGF0ZW1lbnRzIGJvZHkpXG4gICAgIDpyZXN1bHQgcmVzdWx0fSkpXG5cbihkZWZ1biBhbmFseXplLWZuLW1ldGhvZFxuICAoZW52IGZvcm0pXG4gIFwiXG4gIHt9IC0+ICcoW3ggeV0gKCsgeCB5KSkgLT4gezplbnYge31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gJyhbeCB5XSAoKyB4IHkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6dmFyaWFkaWMgZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmFyaXR5IDJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnBhcmFtcyBbezpvcCA6dmFyIDpmb3JtICd4fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Om9wIDp2YXIgOmZvcm0gJ3l9XVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6c3RhdGVtZW50cyBbXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6cmV0dXJuIHs6b3AgOmludm9rZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Y2FsbGVlIHs6b3AgOnZhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Zm9ybSAnK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ZW52IHs6cGFyZW50IHt9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpsb2NhbHMge3ggezpuYW1lICd4XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpzaGFkb3cgbmlsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpsb2NhbCB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDp0YWcgbmlsfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5IHs6bmFtZSAneVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6c2hhZG93IG5pbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6bG9jYWwgdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6dGFnIG5pbH19fX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnBhcmFtcyBbezpvcCA6dmFyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Zm9ybSAneFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmluZm8gbmlsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6dGFnIG5pbH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgezpvcCA6dmFyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Zm9ybSAneVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmluZm8gbmlsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6dGFnIG5pbH1dfX1cIlxuICAobGV0KiAoKHNpZ25hdHVyZSAoaWYgKGFuZCAobGlzdD8gZm9ybSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICh2ZWN0b3I/IChmaXJzdCBmb3JtKSkpXG4gICAgICAgICAgICAgICAgICAgIChmaXJzdCBmb3JtKVxuICAgICAgICAgICAgICAgICAgICAoc3ludGF4LWVycm9yIFwiTWFsZm9ybWVkIGZuIG92ZXJsb2FkIGZvcm1cIiBmb3JtKSkpXG4gICAgICAgIChib2R5IChyZXN0IGZvcm0pKVxuICAgICAgICA7OyBJZiBwYXJhbSBzaWduYXR1cmUgY29udGFpbnMgJiBmbiBpcyB2YXJpYWRpYy5cbiAgICAgICAgKHZhcmlhZGljIChzb21lIChsYW1iZGEgKCUpICg9ICcmICUpKSBzaWduYXR1cmUpKVxuXG4gICAgICAgIDs7IEFsbCBuYW1lZCBwYXJhbXMgb2YgdGhlIGZuLlxuICAgICAgICAocGFyYW1zIChpZiB2YXJpYWRpY1xuICAgICAgICAgICAgICAgICAoZmlsdGVyIChsYW1iZGEgKCUpIChub3QgKD0gJyYgJSkpKSBzaWduYXR1cmUpXG4gICAgICAgICAgICAgICAgIHNpZ25hdHVyZSkpXG5cbiAgICAgICAgOzsgTnVtYmVyIG9mIHBhcmFtZXRlcnMgZml4ZWQgcGFyYW1ldGVycyBmbiB0YWtlcy5cbiAgICAgICAgKGFyaXR5IChpZiB2YXJpYWRpY1xuICAgICAgICAgICAgICAgIChkZWMgKGNvdW50IHBhcmFtcykpXG4gICAgICAgICAgICAgICAgKGNvdW50IHBhcmFtcykpKVxuXG4gICAgICAgIDs7IEFuYWx5emUgcGFyYW1ldGVycyBpbiBjb3JyZXNwb25kZW5jZSB0byBlbnZpcm9ubWVudFxuICAgICAgICA7OyBsb2NhbHMgdG8gaWRlbnRpZnkgYmluZGluZyBzaGFkb3dpbmcuXG4gICAgICAgIChzY29wZSAocmVkdWNlIChsYW1iZGEgKCUxICUyKSAod2l0aC1wYXJhbSAlMSAoYW5hbHl6ZS1wYXJhbSAlMSAlMikpKVxuICAgICAgICAgICAgICAgICAgICAgIChjb25qIGVudiB7OnBhcmFtcyBbXX0pXG4gICAgICAgICAgICAgICAgICAgICAgcGFyYW1zKSkpXG4gICAgKGNvbmogKGFuYWx5emUtYmxvY2sgc2NvcGUgYm9keSlcbiAgICAgICAgICB7Om9wIDpvdmVybG9hZFxuICAgICAgICAgICA6dmFyaWFkaWMgdmFyaWFkaWNcbiAgICAgICAgICAgOmFyaXR5IGFyaXR5XG4gICAgICAgICAgIDpwYXJhbXMgKDpwYXJhbXMgc2NvcGUpXG4gICAgICAgICAgIDpmb3JtIGZvcm19KSkpXG5cblxuKGRlZnVuIGFuYWx5emUtZm5cbiAgKGVudiBmb3JtKVxuICAobGV0KiAoKGZvcm1zIChyZXN0IGZvcm0pKVxuICAgICAgICA7OyBOb3JtYWxpemUgZm4gZm9ybSBzbyB0aGF0IGl0IGNvbnRhaW5zIG5hbWVcbiAgICAgICAgOzsgJyhmbiBbeF0geCkgLT4gJyhmbiBuaWwgW3hdIHgpXG4gICAgICAgIChmb3JtcyAoaWYgKHN5bWJvbD8gKGZpcnN0IGZvcm1zKSlcbiAgICAgICAgICAgICAgICBmb3Jtc1xuICAgICAgICAgICAgICAgIChjb25zIG5pbCBmb3JtcykpKVxuXG4gICAgICAgIChpZCAoZmlyc3QgZm9ybXMpKVxuICAgICAgICAoYmluZGluZyAoaWYgaWQgKGFuYWx5emUtc3BlY2lhbCBhbmFseXplLWRlY2xhcmF0aW9uIGVudiBpZCkpKVxuXG4gICAgICAgIChib2R5IChyZXN0IGZvcm1zKSlcblxuICAgICAgICA7OyBNYWtlIHN1cmUgdGhhdCBmbiBkZWZpbml0aW9uIGlzIHN0cnVjdXRlcmVkXG4gICAgICAgIDs7IGluIG1ldGhvZCBvdmVybG9hZCBzdHlsZTpcbiAgICAgICAgOzsgKGZuIGEgW3hdIHkpIC0+ICgoW3hdIHkpKVxuICAgICAgICA7OyAoZm4gYSAoW3hdIHkpKSAtPiAoKFt4XSB5KSlcbiAgICAgICAgKG92ZXJsb2FkcyAoY29uZCAoKHZlY3Rvcj8gKGZpcnN0IGJvZHkpKSAobGlzdCBib2R5KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICgoYW5kIChsaXN0PyAoZmlyc3QgYm9keSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2ZWN0b3I/IChmaXJzdCAoZmlyc3QgYm9keSkpKSkgYm9keSlcbiAgICAgICAgICAgICAgICAgICAgICAgIChlbHNlIChzeW50YXgtZXJyb3IgKHN0ciBcIk1hbGZvcm1lZCBmbiBleHByZXNzaW9uLCBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicGFyYW1ldGVyIGRlY2xhcmF0aW9uIChcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChwci1zdHIgKGZpcnN0IGJvZHkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiKSBtdXN0IGJlIGEgdmVjdG9yXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcm0pKSkpXG5cbiAgICAgICAgKHNjb3BlIChpZiBiaW5kaW5nXG4gICAgICAgICAgICAgICAgKHdpdGgtYmluZGluZyAoc3ViLWVudiBlbnYpIGJpbmRpbmcpXG4gICAgICAgICAgICAgICAgKHN1Yi1lbnYgZW52KSkpXG5cbiAgICAgICAgKG1ldGhvZHMgKG1hcCAobGFtYmRhICglKSAoYW5hbHl6ZS1mbi1tZXRob2Qgc2NvcGUgJSkpXG4gICAgICAgICAgICAgICAgICAgICAodmVjIG92ZXJsb2FkcykpKVxuXG4gICAgICAgIChhcml0eSAoYXBwbHkgbWF4IChtYXAgKGxhbWJkYSAoJSkgKDphcml0eSAlKSkgbWV0aG9kcykpKVxuICAgICAgICAodmFyaWFkaWMgKHNvbWUgKGxhbWJkYSAoJSkgKDp2YXJpYWRpYyAlKSkgbWV0aG9kcykpKVxuICAgIHs6b3AgOmZuXG4gICAgIDp0eXBlIDpmdW5jdGlvblxuICAgICA6aWQgYmluZGluZ1xuICAgICA6dmFyaWFkaWMgdmFyaWFkaWNcbiAgICAgOm1ldGhvZHMgbWV0aG9kc1xuICAgICA6Zm9ybSBmb3JtfSkpXG4oaW5zdGFsbC1zcGVjaWFsISA6Zm4qIGFuYWx5emUtZm4pXG5cbihkZWZ1biBwYXJzZS1yZWZlcmVuY2VzXG4gIChmb3JtcylcbiAgXCJUYWtlcyBwYXJ0IG9mIG5hbWVzcGFjZSBkZWZpbml0aW9uIGFuZCBjcmVhdGVzIGhhc2hcbiAgb2YgcmVmZXJlbmNlIGZvcm1zXCJcbiAgKHJlZHVjZSAobGFtYmRhIChyZWZlcmVuY2VzIGZvcm0pXG4gICAgICAgICAgICA7OyBJZiBub3QgYSB2ZWN0b3IgdGhhbiBpdCdzIG5vdCBhIHJlZmVyZW5jZVxuICAgICAgICAgICAgOzsgZm9ybSB0aGF0IHdpc3AgdW5kZXJzdGFuZHMgc28ganVzdCBza2lwIGl0LlxuICAgICAgICAgICAgKGlmIChzZXE/IGZvcm0pXG4gICAgICAgICAgICAgIChhc3NvYyByZWZlcmVuY2VzXG4gICAgICAgICAgICAgICAgKG5hbWUgKGZpcnN0IGZvcm0pKVxuICAgICAgICAgICAgICAgICh2ZWMgKHJlc3QgZm9ybSkpKVxuICAgICAgICAgICAgICByZWZlcmVuY2VzKSlcbiAgICAgICAgICB7fVxuICAgICAgICAgIGZvcm1zKSlcblxuKGRlZnVuIHBhcnNlLXJlcXVpcmVcbiAgKGZvcm0pXG4gIChsZXQqICg7OyByZXF1aXJlIGZvcm0gbWF5IGJlIGVpdGhlciB2ZWN0b3Igd2l0aCBpZCBpbiB0aGVcbiAgICAgICAgOzsgaGVhZCBvciBqdXN0IGFuIGlkIHN5bWJvbC4gbm9ybWFsaXppbmcgdG8gYSB2ZWN0b3JcbiAgICAgICAgKHJlcXVpcmVtZW50IChpZiAoc3ltYm9sPyBmb3JtKSBbZm9ybV0gKHZlYyBmb3JtKSkpXG4gICAgICAgIChpZCAoZmlyc3QgcmVxdWlyZW1lbnQpKVxuICAgICAgICA7OyBidW5jaCBvZiBkaXJlY3RpdmVzIG1heSBmb2xsb3cgcmVxdWlyZSBmb3JtIGJ1dCB0aGV5XG4gICAgICAgIDs7IGFsbCBjb21lIGluIHBhaXJzLiB3aXNwIHN1cHBvcnRzIGZvbGxvd2luZyBwYWlyczpcbiAgICAgICAgOzsgOmFzIGZvb1xuICAgICAgICA7OyA6cmVmZXIgW2ZvbyBiYXJdXG4gICAgICAgIDs7IDpyZW5hbWUge2ZvbyBiYXJ9XG4gICAgICAgIDs7IGpvaW4gdGhlc2UgcGFpcnMgaW4gYSBoYXNoIGZvciBrZXkgYmFzZWQgYWNjZXNzLlxuICAgICAgICAocGFyYW1zIChhcHBseSBkaWN0aW9uYXJ5IChyZXN0IHJlcXVpcmVtZW50KSkpXG4gICAgICAgIChyZW5hbWVzIChnZXQgcGFyYW1zICc6cmVuYW1lKSlcbiAgICAgICAgKG5hbWVzIChnZXQgcGFyYW1zICc6cmVmZXIpKVxuICAgICAgICAoYWxpYXMgKGdldCBwYXJhbXMgJzphcykpXG4gICAgICAgIChyZWZlcmVuY2VzIChpZiAobm90IChlbXB0eT8gbmFtZXMpKVxuICAgICAgICAgICAgICAgICAgICAgKHJlZHVjZSAobGFtYmRhIChyZWZlcnMgcmVmZXJlbmNlKVxuICAgICAgICAgICAgICAgICAgICAgIChjb25qIHJlZmVyc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHs6b3AgOnJlZmVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtIHJlZmVyZW5jZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6bmFtZSByZWZlcmVuY2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOzsgTG9vayB1cCBieSByZWZlcmVuY2Ugc3ltYm9sIGFuZCBieSBzeW1ib2xcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICA7OyBiaXQgaW4gYSBmdXp6IHJpZ2h0IG5vdy5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnJlbmFtZSAob3IgKGdldCByZW5hbWVzIHJlZmVyZW5jZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGdldCByZW5hbWVzIChuYW1lIHJlZmVyZW5jZSkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6bnMgaWR9KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW11cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZXMpKSkpXG4gICAgezpvcCA6cmVxdWlyZVxuICAgICA6YWxpYXMgYWxpYXNcbiAgICAgOm5zIGlkXG4gICAgIDpyZWZlciByZWZlcmVuY2VzXG4gICAgIDpmb3JtIGZvcm19KSlcblxuKGRlZnVuIGFuYWx5emUtbnNcbiAgKGVudiBmb3JtKVxuICAobGV0KiAoKGZvcm1zIChyZXN0IGZvcm0pKVxuICAgICAgICAobmFtZSAoZmlyc3QgZm9ybXMpKVxuICAgICAgICAoYm9keSAocmVzdCBmb3JtcykpXG4gICAgICAgIDs7IE9wdGlvbmFsIGRvY3N0cmluZyB0aGF0IGZvbGxvd3MgbmFtZSBzeW1ib2xcbiAgICAgICAgKGRvYyAoaWYgKHN0cmluZz8gKGZpcnN0IGJvZHkpKSAoZmlyc3QgYm9keSkpKVxuICAgICAgICA7OyBJZiBzZWNvbmQgZm9ybSBpcyBub3QgYSBzdHJpbmcgdGhhbiB0cmVhdCBpdFxuICAgICAgICA7OyBhcyByZWd1bGFyIHJlZmVyZW5jZSBmb3JtXG4gICAgICAgIChyZWZlcmVuY2VzIChwYXJzZS1yZWZlcmVuY2VzIChpZiBkb2NcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChyZXN0IGJvZHkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib2R5KSkpXG4gICAgICAgIChyZXF1aXJlbWVudHMgKGlmICg6cmVxdWlyZSByZWZlcmVuY2VzKVxuICAgICAgICAgICAgICAgICAgICAgICAobWFwIHBhcnNlLXJlcXVpcmUgKDpyZXF1aXJlIHJlZmVyZW5jZXMpKSkpKVxuICAgIHs6b3AgOm5zXG4gICAgIDpuYW1lIG5hbWVcbiAgICAgOmRvYyBkb2NcbiAgICAgOnJlcXVpcmUgKGlmIHJlcXVpcmVtZW50c1xuICAgICAgICAgICAgICAgICh2ZWMgcmVxdWlyZW1lbnRzKSlcbiAgICAgOmZvcm0gZm9ybX0pKVxuKGluc3RhbGwtc3BlY2lhbCEgOm5zIGFuYWx5emUtbnMpXG5cblxuKGRlZnVuIGFuYWx5emUtbGlzdFxuICAoZW52IGZvcm0pXG4gIFwiVGFrZXMgZm9ybSBvZiBsaXN0IHR5cGUgYW5kIHBlcmZvcm1zIGEgbWFjcm9leHBhbnNpb25zIHVudGlsXG4gIGZ1bGx5IGV4cGFuZGVkLiBJZiBleHBhbnNpb24gaXMgZGlmZmVyZW50IGZyb20gYSBnaXZlbiBmb3JtIHRoZW5cbiAgZXhwYW5kZWQgZm9ybSBpcyBoYW5kZWQgYmFjayB0byBhbmFseXplci4gSWYgZm9ybSBpcyBzcGVjaWFsIGxpa2VcbiAgZGVmLCBmbiwgbGV0Li4uIHRoYW4gYXNzb2NpYXRlZCBpcyBkaXNwYXRjaGVkLCBvdGhlcndpc2UgZm9ybSBpc1xuICBhbmFseXplZCBhcyBpbnZva2UgZXhwcmVzc2lvbi5cIlxuICAobGV0KiAoKGV4cGFuc2lvbiAobWFjcm9leHBhbmQgZm9ybSBlbnYpKVxuICAgICAgICA7OyBTcGVjaWFsIG9wZXJhdG9ycyBtdXN0IGJlIHN5bWJvbHMgYW5kIHN0b3JlZCBpbiB0aGVcbiAgICAgICAgOzsgKipzcGVjaWFscyoqIGhhc2ggYnkgb3BlcmF0b3IgbmFtZS5cbiAgICAgICAgKG9wZXJhdG9yIChmaXJzdCBmb3JtKSlcbiAgICAgICAgKGFuYWx5emVyIChhbmQgKHN5bWJvbD8gb3BlcmF0b3IpXG4gICAgICAgICAgICAgICAgICAgICAgKGdldCAqKnNwZWNpYWxzKiogKG5hbWUgb3BlcmF0b3IpKSkpKVxuICAgIDs7IElmIGZvcm0gaXMgZXhwYW5kZWQgcGFzcyBpdCBiYWNrIHRvIGFuYWx5emUgc2luY2UgaXQgbWF5IG5vXG4gICAgOzsgbG9uZ2VyIGJlIGEgbGlzdC4gT3RoZXJ3aXNlIGVpdGhlciBhbmFseXplIGFzIGEgc3BlY2lhbCBmb3JtXG4gICAgOzsgKGlmIGl0J3Mgc3VjaCkgb3IgYXMgZnVuY3Rpb24gaW52b2thdGlvbiBmb3JtLlxuICAgIChjb25kICgobm90IChpZGVudGljYWw/IGV4cGFuc2lvbiBmb3JtKSkgKGFuYWx5emUgZW52IGV4cGFuc2lvbikpXG4gICAgICAgICAgKGFuYWx5emVyIChhbmFseXplLXNwZWNpYWwgYW5hbHl6ZXIgZW52IGV4cGFuc2lvbikpXG4gICAgICAgICAgKGVsc2UgKGFuYWx5emUtaW52b2tlIGVudiBleHBhbnNpb24pKSkpKVxuXG4oZGVmdW4gYW5hbHl6ZS12ZWN0b3JcbiAgKGVudiBmb3JtKVxuICAobGV0KiAoKGl0ZW1zICh2ZWMgKG1hcCAobGFtYmRhICglKSAoYW5hbHl6ZSBlbnYgJSkpIGZvcm0pKSkpXG4gICAgezpvcCA6dmVjdG9yXG4gICAgIDpmb3JtIGZvcm1cbiAgICAgOml0ZW1zIGl0ZW1zfSkpXG5cbihkZWZ1biBhbmFseXplLWRpY3Rpb25hcnlcbiAgKGVudiBmb3JtKVxuICAobGV0KiAoKG5hbWVzICh2ZWMgKG1hcCAobGFtYmRhICglKSAoYW5hbHl6ZSBlbnYgJSkpIChrZXlzIGZvcm0pKSkpXG4gICAgICAgICh2YWx1ZXMgKHZlYyAobWFwIChsYW1iZGEgKCUpIChhbmFseXplIGVudiAlKSkgKHZhbHMgZm9ybSkpKSkpXG4gICAgezpvcCA6ZGljdGlvbmFyeVxuICAgICA6a2V5cyBuYW1lc1xuICAgICA6dmFsdWVzIHZhbHVlc1xuICAgICA6Zm9ybSBmb3JtfSkpXG5cbihkZWZ1biBhbmFseXplLWludm9rZVxuICAoZW52IGZvcm0pXG4gIFwiUmV0dXJucyBub2RlIG9mIDppbnZva2UgdHlwZSwgcmVwcmVzZW50aW5nIGEgZnVuY3Rpb24gY2FsbC4gSW5cbiAgYWRkaXRpb24gdG8gcmVndWxhciBwcm9wZXJ0aWVzIHRoaXMgbm9kZSBjb250YWlucyA6Y2FsbGVlIG1hcHBlZFxuICB0byBhIG5vZGUgdGhhdCBpcyBiZWluZyBpbnZva2VkIGFuZCA6cGFyYW1zIHRoYXQgaXMgYW4gdmVjdG9yIG9mXG4gIHBhcmFtdGVyIGV4cHJlc3Npb25zIHRoYXQgOmNhbGxlZSBpcyBpbnZva2VkIHdpdGguXCJcbiAgKGxldCogKChjYWxsZWUgKGFuYWx5emUgZW52IChmaXJzdCBmb3JtKSkpXG4gICAgICAgIChwYXJhbXMgKHZlYyAobWFwIChsYW1iZGEgKCUpIChhbmFseXplIGVudiAlKSkgKHJlc3QgZm9ybSkpKSkpXG4gICAgezpvcCA6aW52b2tlXG4gICAgIDpjYWxsZWUgY2FsbGVlXG4gICAgIDpwYXJhbXMgcGFyYW1zXG4gICAgIDpmb3JtIGZvcm19KSlcblxuKGRlZnVuIGFuYWx5emUtY29uc3RhbnRcbiAgKGVudiBmb3JtKVxuICBcIlJldHVybnMgYSBub2RlIHJlcHJlc2VudGluZyBhIGNvbnRzdGFudCB2YWx1ZSB3aGljaCBpc1xuICBtb3N0IGNlcnRhaW5seSBhIHByaW1pdGl2ZSB2YWx1ZSBsaXRlcmFsIHRoaXMgZm9ybSBjYW50YWluc1xuICBubyBleHRyYSBpbmZvcm1hdGlvbi5cIlxuICB7Om9wIDpjb25zdGFudFxuICAgOmZvcm0gZm9ybX0pXG5cbihkZWZ1biBhbmFseXplXG4gICgmcmVzdCBhcmdzKVxuICBcIlRha2VzIGEgaGFzaCByZXByZXNlbnRpbmcgYSBnaXZlbiBlbnZpcm9ubWVudCBhbmQgYGZvcm1gIHRvIGJlXG4gIGFuYWx5emVkLiBFbnZpcm9ubWVudCBtYXkgY29udGFpbiBmb2xsb3dpbmcgZW50cmllczpcblxuICA6bG9jYWxzICAtIEhhc2ggb2YgdGhlIGdpdmVuIGVudmlyb25tZW50cyBiaW5kaW5ncyBtYXBwZWR5IGJ5IGJpbmRpbmcgbmFtZS5cbiAgOmNvbnRleHQgLSBPbmUgb2YgdGhlIGZvbGxvd2luZyA6c3RhdGVtZW50LCA6ZXhwcmVzc2lvbiwgOnJldHVybi4gVGhhdFxuICAgICAgICAgICAgIGluZm9ybWF0aW9uIGlzIGluY2x1ZGVkIGluIHJlc3VsdGluZyBub2RlcyBhbmQgaXMgbWVhbnQgZm9yXG4gICAgICAgICAgICAgd3JpdGVyIHRoYXQgbWF5IG91dHB1dCBkaWZmZXJlbnQgZm9ybXMgYmFzZWQgb24gY29udGV4dC5cbiAgOm5zICAgICAgLSBOYW1lc3BhY2Ugb2YgdGhlIGZvcm1zIGJlaW5nIGFuYWx5emVkLlxuXG4gIEFuYWx5emVyIHBlcmZvcm1zIGFsbCB0aGUgbWFjcm8gJiBzeW50YXggZXhwYW5zaW9ucyBhbmQgdHJhbnNmb3JtcyBmb3JtXG4gIGludG8gQVNUIG5vZGUgb2YgYW4gZXhwcmVzc2lvbi4gRWFjaCBzdWNoIG5vZGUgY29udGFpbnMgYXQgbGVhc3QgZm9sbG93aW5nXG4gIHByb3BlcnRpZXM6XG5cbiAgOm9wICAgLSBPcGVyYXRpb24gdHlwZSBvZiB0aGUgZXhwcmVzc2lvbi5cbiAgOmZvcm0gLSBHaXZlbiBmb3JtLlxuXG4gIEJhc2VkIG9uIDpvcCBub2RlIG1heSBjb250YWluIGRpZmZlcmVudCBzZXQgb2YgcHJvcGVydGllcy5cIlxuICAoaWYgKGlkZW50aWNhbD8gKGNvdW50IGFyZ3MpIDEpXG4gICAgKGFuYWx5emUgezpsb2NhbHMge31cbiAgICAgICAgICAgICAgOmJpbmRpbmdzIFtdXG4gICAgICAgICAgICAgIDp0b3AgdHJ1ZX0gKGZpcnN0IGFyZ3MpKVxuICAgIChsZXQqICgoZW52IChmaXJzdCBhcmdzKSkgKGZvcm0gKHNlY29uZCBhcmdzKSkpXG4gICAgICAoY29uZCAoKG5pbD8gZm9ybSkgKGFuYWx5emUtY29uc3RhbnQgZW52IGZvcm0pKVxuICAgICAgICAgICAgKChzeW1ib2w/IGZvcm0pIChhbmFseXplLXN5bWJvbCBlbnYgZm9ybSkpXG4gICAgICAgICAgICAoKGxpc3Q/IGZvcm0pIChpZiAoZW1wdHk/IGZvcm0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAoYW5hbHl6ZS1xdW90ZWQgZm9ybSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIChhbmFseXplLWxpc3QgZW52IGZvcm0pKSlcbiAgICAgICAgICAgICgoZGljdGlvbmFyeT8gZm9ybSkgKGFuYWx5emUtZGljdGlvbmFyeSBlbnYgZm9ybSkpXG4gICAgICAgICAgICAoKHZlY3Rvcj8gZm9ybSkgKGFuYWx5emUtdmVjdG9yIGVudiBmb3JtKSlcbiAgICAgICAgICAgIDsoc2V0PyBmb3JtKSAoYW5hbHl6ZS1zZXQgZW52IGZvcm0gbmFtZSlcbiAgICAgICAgICAgICgoa2V5d29yZD8gZm9ybSkgKGFuYWx5emUta2V5d29yZCBlbnYgZm9ybSkpXG4gICAgICAgICAgICAoZWxzZSAoYW5hbHl6ZS1jb25zdGFudCBlbnYgZm9ybSkpKSkpKVxuIl19
