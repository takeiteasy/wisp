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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndpc3AvYW5hbHl6ZXIud2lzcCJdLCJuYW1lcyI6WyJfbnNfIiwiaWQiLCJkb2MiLCJtZXRhIiwid2l0aE1ldGEiLCJpc1N5bWJvbCIsImlzS2V5d29yZCIsImlzUXVvdGUiLCJzeW1ib2wiLCJuYW1lc3BhY2UiLCJuYW1lIiwicHJTdHIiLCJpc1VucXVvdGUiLCJpc1VucXVvdGVTcGxpY2luZyIsImlzTGlzdCIsImxpc3QiLCJjb25qIiwicGFydGl0aW9uIiwic2VxIiwiaXNFbXB0eSIsIm1hcCIsInZlYyIsImlzRXZlcnkiLCJjb25jYXQiLCJmaXJzdCIsInNlY29uZCIsInRoaXJkIiwicmVzdCIsImxhc3QiLCJidXRsYXN0IiwiaW50ZXJsZWF2ZSIsImNvbnMiLCJjb3VudCIsInNvbWUiLCJhc3NvYyIsInJlZHVjZSIsImZpbHRlciIsImlzU2VxIiwiZHJvcCIsImlzTmlsIiwiaXNEaWN0aW9uYXJ5IiwiaXNWZWN0b3IiLCJrZXlzIiwidmFscyIsImlzU3RyaW5nIiwiaXNOdW1iZXIiLCJpc0Jvb2xlYW4iLCJpc0RhdGUiLCJpc1JlUGF0dGVybiIsImlzRXZlbiIsImlzRXF1YWwiLCJtYXgiLCJkZWMiLCJkaWN0aW9uYXJ5Iiwic3VicyIsImluYyIsIm1hY3JvZXhwYW5kIiwic3BsaXQiLCJqb2luIiwic3ludGF4RXJyb3IiLCJleHBvcnRzIiwibWVzc2FnZSIsImZvcm0iLCJtZXRhZGF0YcO4MSIsImxpbmXDuDEiLCJ1cmnDuDEiLCJjb2x1bW7DuDEiLCJlcnJvcsO4MSIsIlN5bnRheEVycm9yIiwibGluZU51bWJlciIsImxpbmUiLCJjb2x1bW5OdW1iZXIiLCJjb2x1bW4iLCJmaWxlTmFtZSIsInVyaSIsImFuYWx5emVLZXl3b3JkIiwiZW52IiwiX19zcGVjaWFsc19fIiwiaW5zdGFsbFNwZWNpYWwiLCJvcCIsImFuYWx5emVyIiwiYW5hbHl6ZVNwZWNpYWwiLCJhc3TDuDEiLCJhbmFseXplSWYiLCJmb3Jtc8O4MSIsImVsc2VUYWlsw7gxIiwiZWxzZUZvcm3DuDEiLCJ0ZXN0w7gxIiwiYW5hbHl6ZSIsImNvbnNlcXVlbnTDuDEiLCJhbHRlcm5hdGXDuDEiLCJhbmFseXplVGhyb3ciLCJleHByZXNzaW9uw7gxIiwiYW5hbHl6ZVRyeSIsInRhaWzDuDEiLCJmaW5hbGl6ZXJGb3Jtw7gxIiwiZmluYWxpemVyw7gxIiwiYW5hbHl6ZUJsb2NrIiwiYm9keUZvcm3DuDEiLCJ0YWlsw7gyIiwiaGFuZGxlckZvcm3DuDEiLCJoYW5kbGVyw7gxIiwiYm9kecO4MSIsInN1YkVudiIsImFuYWx5emVTZXQiLCJsZWZ0w7gxIiwicmlnaHTDuDEiLCJ0YXJnZXTDuDEiLCJhbmFseXplU3ltYm9sIiwiYW5hbHl6ZUxpc3QiLCJ2YWx1ZcO4MSIsImFuYWx5emVOZXciLCJjb25zdHJ1Y3RvcsO4MSIsInBhcmFtc8O4MSIsIiQiLCJhbmFseXplQWdldCIsImF0dHJpYnV0ZcO4MSIsImZpZWxkw7gxIiwiYW5hbHl6ZUlkZW50aWZpZXIiLCJwYXJzZURlZiIsImFyZ3MiLCJhbmFseXplRGVmIiwib3DDuDEiLCJwcml2YXRlw7gxIiwiaWTDuDEiLCJiaW5kaW5nw7gxIiwiYW5hbHl6ZURlY2xhcmF0aW9uIiwiaW5pdMO4MSIsImRvY8O4MSIsImFuYWx5emVEbyIsImV4cHJlc3Npb25zw7gxIiwic3RhcnTDuDEiLCJlbmTDuDEiLCJleHBhbnNpb27DuDEiLCJyZXNvbHZlQmluZGluZyIsInVucmVzb2x2ZWRCaW5kaW5nIiwiYW5hbHl6ZVNoYWRvdyIsImFuYWx5emVCaW5kaW5nIiwiYW5hbHl6ZVBhcmFtIiwid2l0aEJpbmRpbmciLCJ3aXRoUGFyYW0iLCJhbmFseXplTGV0XyIsImlzTG9vcCIsImJpbmRpbmdzw7gxIiwiaXNWYWxpZEJpbmRpbmdzw7gxIiwiX8O4MSIsInNjb3Blw7gxIiwiJDEiLCIkMiIsImJpbmRpbmdzw7gyIiwiZXhwcmVzc2lvbnPDuDIiLCJhbmFseXplTGV0IiwiYW5hbHl6ZUxvb3AiLCJhbmFseXplUmVjdXIiLCJhbmFseXplUXVvdGVkTGlzdCIsImFuYWx5emVRdW90ZWQiLCJhbmFseXplUXVvdGVkVmVjdG9yIiwiYW5hbHl6ZVF1b3RlZERpY3Rpb25hcnkiLCJuYW1lc8O4MSIsInZhbHVlc8O4MSIsImFuYWx5emVRdW90ZWRTeW1ib2wiLCJhbmFseXplUXVvdGVkS2V5d29yZCIsImFuYWx5emVRdW90ZSIsImFuYWx5emVTdGF0ZW1lbnQiLCJzdGF0ZW1lbnRzw7gxIiwic3RhdGVtZW50w7gxIiwiZGVmc8O4MSIsInJlc3VsdMO4MSIsImFuYWx5emVGbk1ldGhvZCIsInNpZ25hdHVyZcO4MSIsInZhcmlhZGljw7gxIiwiYXJpdHnDuDEiLCJhbmFseXplRm4iLCJmb3Jtc8O4MiIsIm92ZXJsb2Fkc8O4MSIsIm1ldGhvZHPDuDEiLCJwYXJzZVJlZmVyZW5jZXMiLCJmb3JtcyIsInJlZmVyZW5jZXMiLCJwYXJzZVJlcXVpcmUiLCJyZXF1aXJlbWVudMO4MSIsInJlbmFtZXPDuDEiLCJhbGlhc8O4MSIsInJlZmVyZW5jZXPDuDEiLCJyZWZlcnMiLCJyZWZlcmVuY2UiLCJhbmFseXplTnMiLCJuYW1lw7gxIiwicmVxdWlyZW1lbnRzw7gxIiwib3BlcmF0b3LDuDEiLCJhbmFseXplcsO4MSIsImFuYWx5emVJbnZva2UiLCJhbmFseXplVmVjdG9yIiwiaXRlbXPDuDEiLCJhbmFseXplRGljdGlvbmFyeSIsImNhbGxlZcO4MSIsImFuYWx5emVDb25zdGFudCIsImVudsO4MSIsImZvcm3DuDEiXSwibWFwcGluZ3MiOiI7SUFBQSxJQUFDQSxJLEdBQUQ7QUFBQSxRQUFBQyxFLEVBQUksZUFBSjtBQUFBLFFBQUFDLEcsRUFBQTtBQUFBLE07O1FBQzhCQyxJQUFBLEcsU0FBQUEsSTtRQUFLQyxRQUFBLEcsU0FBQUEsUTtRQUFVQyxRQUFBLEcsU0FBQUEsUTtRQUFRQyxTQUFBLEcsU0FBQUEsUztRQUN2QkMsT0FBQSxHLFNBQUFBLE87UUFBT0MsTUFBQSxHLFNBQUFBLE07UUFBT0MsU0FBQSxHLFNBQUFBLFM7UUFBVUMsSUFBQSxHLFNBQUFBLEk7UUFBS0MsS0FBQSxH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QUFBQSxtQkFBQzFGLGFBQUQsQ0FBZ0J5RixLQUFoQixFQUFvQkMsTUFBcEI7QUFBQSxTLENBQUEsRSxHQUNkeEwsTUFBRCxDQUFPd0wsTUFBUCxDLGdCQUFhO0FBQUEsbUJBQUtuTCxPQUFELENBQVFtTCxNQUFSLENBQUosR0FDRTNDLGFBQUQsQ0FBZ0IyQyxNQUFoQixDQURELEdBRUV6RixXQUFELENBQWN3RixLQUFkLEVBQWtCQyxNQUFsQixDQUZEO0FBQUEsUyxDQUFBLEUsR0FHWjlKLFlBQUQsQ0FBYThKLE1BQWIsQyxnQkFBbUI7QUFBQSxtQkFBQ0osaUJBQUQsQ0FBb0JHLEtBQXBCLEVBQXdCQyxNQUF4QjtBQUFBLFMsQ0FBQSxFLEdBQ2xCN0osUUFBRCxDQUFTNkosTUFBVCxDLGdCQUFlO0FBQUEsbUJBQUNOLGFBQUQsQ0FBZ0JLLEtBQWhCLEVBQW9CQyxNQUFwQjtBQUFBLFMsQ0FBQSxFLEdBRWRoTSxTQUFELENBQVVnTSxNQUFWLEMsZ0JBQWdCO0FBQUEsbUJBQUMzSCxjQUFELENBQWlCMEgsS0FBakIsRUFBcUJDLE1BQXJCO0FBQUEsUyxDQUFBLEUsZ0JBQ1g7QUFBQSxtQkFBQ0YsZUFBRCxDQUFrQkMsS0FBbEIsRUFBc0JDLE1BQXRCO0FBQUEsUyxDQUFBLEVBVFosQ0FETTtBQUFBLEssS0FBUixDLElBQUEsQ0FKRixDO0NBbkJGIiwic291cmNlc0NvbnRlbnQiOlsiKG5zIHdpc3AuYW5hbHl6ZXJcbiAgKDpyZXF1aXJlIFt3aXNwLmFzdCA6cmVmZXIgW21ldGEgd2l0aC1tZXRhIHN5bWJvbD8ga2V5d29yZD9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1b3RlPyBzeW1ib2wgbmFtZXNwYWNlIG5hbWUgcHItc3RyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bnF1b3RlPyB1bnF1b3RlLXNwbGljaW5nP11dXG4gICAgICAgICAgICBbd2lzcC5zZXF1ZW5jZSA6cmVmZXIgW2xpc3Q/IGxpc3QgY29uaiBwYXJ0aXRpb24gc2VxXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVtcHR5PyBtYXAgdmVjIGV2ZXJ5PyBjb25jYXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3Qgc2Vjb25kIHRoaXJkIHJlc3QgbGFzdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidXRsYXN0IGludGVybGVhdmUgY29ucyBjb3VudFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb21lIGFzc29jIHJlZHVjZSBmaWx0ZXIgc2VxPyBkcm9wXV1cbiAgICAgICAgICAgIFt3aXNwLnJ1bnRpbWUgOnJlZmVyIFtuaWw/IGRpY3Rpb25hcnk/IHZlY3Rvcj8ga2V5c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHMgc3RyaW5nPyBudW1iZXI/IGJvb2xlYW4/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZT8gcmUtcGF0dGVybj8gZXZlbj8gPSBtYXhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWMgZGljdGlvbmFyeSBzdWJzIGluYyBkZWNdXVxuICAgICAgICAgICAgW3dpc3AuZXhwYW5kZXIgOnJlZmVyIFttYWNyb2V4cGFuZF1dXG4gICAgICAgICAgICBbd2lzcC5zdHJpbmcgOnJlZmVyIFtzcGxpdCBqb2luXV0pKVxuXG4oZGVmdW4gc3ludGF4LWVycm9yXG4gIChtZXNzYWdlIGZvcm0pXG4gIChsZXQqICgobWV0YWRhdGEgKG1ldGEgZm9ybSkpXG4gICAgICAgIChsaW5lICg6bGluZSAoOnN0YXJ0IG1ldGFkYXRhKSkpXG4gICAgICAgICh1cmkgKDp1cmkgbWV0YWRhdGEpKVxuICAgICAgICAoY29sdW1uICg6Y29sdW1uICg6c3RhcnQgbWV0YWRhdGEpKSlcbiAgICAgICAgKGVycm9yIChTeW50YXhFcnJvciAoc3RyIG1lc3NhZ2UgXCJcXG5cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkZvcm06IFwiIChwci1zdHIgZm9ybSkgXCJcXG5cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlVSSTogXCIgdXJpIFwiXFxuXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJMaW5lOiBcIiBsaW5lIFwiXFxuXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2x1bW46IFwiIGNvbHVtbikpKSlcbiAgICAoc2V0ZiBlcnJvci5saW5lTnVtYmVyIGxpbmUpXG4gICAgKHNldGYgZXJyb3IubGluZSBsaW5lKVxuICAgIChzZXRmIGVycm9yLmNvbHVtbk51bWJlciBjb2x1bW4pXG4gICAgKHNldGYgZXJyb3IuY29sdW1uIGNvbHVtbilcbiAgICAoc2V0ZiBlcnJvci5maWxlTmFtZSB1cmkpXG4gICAgKHNldGYgZXJyb3IudXJpIHVyaSlcbiAgICAodGhyb3cgZXJyb3IpKSlcblxuXG4oZGVmdW4gYW5hbHl6ZS1rZXl3b3JkXG4gIChlbnYgZm9ybSlcbiAgXCJFeGFtcGxlOlxuICAoYW5hbHl6ZS1rZXl3b3JkIHt9IDpmb28pID0+IHs6b3AgOmNvbnN0YW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtICc6Zm9vXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDplbnYge319XCJcbiAgezpvcCA6Y29uc3RhbnRcbiAgIDpmb3JtIGZvcm19KVxuXG4oZGVmdmFyICoqc3BlY2lhbHMqKiB7fSlcblxuKGRlZnVuIGluc3RhbGwtc3BlY2lhbCFcbiAgKG9wIGFuYWx5emVyKVxuICAoc2V0ZiAoZ2V0ICoqc3BlY2lhbHMqKiAobmFtZSBvcCkpIGFuYWx5emVyKSlcblxuKGRlZnVuIGFuYWx5emUtc3BlY2lhbFxuICAoYW5hbHl6ZXIgZW52IGZvcm0pXG4gIChsZXQqICgobWV0YWRhdGEgKG1ldGEgZm9ybSkpXG4gICAgICAgIChhc3QgKGFuYWx5emVyIGVudiBmb3JtKSkpXG4gICAgKGNvbmogezpzdGFydCAoOnN0YXJ0IG1ldGFkYXRhKVxuICAgICAgICAgICA6ZW5kICg6ZW5kIG1ldGFkYXRhKX1cbiAgICAgICAgICBhc3QpKSlcblxuKGRlZnVuIGFuYWx5emUtaWZcbiAgKGVudiBmb3JtKVxuICBcIkV4YW1wbGU6XG4gIChhbmFseXplLWlmIHt9ICcoaWYgbW9uZGF5PyA6eWVwIDpub3BlKSkgPT4gezpvcCA6aWZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gJyhpZiBtb25kYXk/IDp5ZXAgOm5vcGUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDplbnYge31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnRlc3QgezpvcCA6dmFyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Zm9ybSAnbW9uZGF5P1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmluZm8gbmlsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ZW52IHt9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Y29uc2VxdWVudCB7Om9wIDpjb25zdGFudFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gJzp5ZXBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDp0eXBlIDprZXl3b3JkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ZW52IHt9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6YWx0ZXJuYXRlIHs6b3AgOmNvbnN0YW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtICc6bm9wZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6dHlwZSA6a2V5d29yZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ZW52IHt9fX1cIlxuICAobGV0KiAoKGZvcm1zIChyZXN0IGZvcm0pKVxuICAgICAgICA7OyBFbWFjcy1MaXNwIHNoYXBlOiB0aGUgZWxzZSBUQUlMIChldmVyeXRoaW5nIGFmdGVyIHRoZVxuICAgICAgICA7OyBjb25zZXF1ZW50KSBpcyBhbiBpbXBsaWNpdCBgcHJvZ25gLCBub3QganVzdCBhIHNpbmdsZSBmb3JtLlxuICAgICAgICAoZWxzZS10YWlsIChkcm9wIDIgZm9ybXMpKVxuICAgICAgICAoZWxzZS1mb3JtIChjb25kICgoZW1wdHk/IGVsc2UtdGFpbCkgbmlsKVxuICAgICAgICAgICAgICAgICAgICAgICAgKChpZGVudGljYWw/IChjb3VudCBlbHNlLXRhaWwpIDEpIChmaXJzdCBlbHNlLXRhaWwpKVxuICAgICAgICAgICAgICAgICAgICAgICAgKGVsc2UgKGNvbnMgJ3Byb2duIGVsc2UtdGFpbCkpKSlcbiAgICAgICAgKHRlc3QgKGFuYWx5emUgZW52IChmaXJzdCBmb3JtcykpKVxuICAgICAgICAoY29uc2VxdWVudCAoYW5hbHl6ZSBlbnYgKHNlY29uZCBmb3JtcykpKVxuICAgICAgICAoYWx0ZXJuYXRlIChhbmFseXplIGVudiBlbHNlLWZvcm0pKSlcbiAgICAoaWYgKDwgKGNvdW50IGZvcm1zKSAyKVxuICAgICAgKHN5bnRheC1lcnJvciBcIk1hbGZvcm1lZCBpZiBleHByZXNzaW9uLCB0b28gZmV3IG9wZXJhbmRzXCIgZm9ybSkpXG4gICAgezpvcCA6aWZcbiAgICAgOmZvcm0gZm9ybVxuICAgICA6dGVzdCB0ZXN0XG4gICAgIDpjb25zZXF1ZW50IGNvbnNlcXVlbnRcbiAgICAgOmFsdGVybmF0ZSBhbHRlcm5hdGV9KSlcblxuKGluc3RhbGwtc3BlY2lhbCEgOmlmIGFuYWx5emUtaWYpXG5cbihkZWZ1biBhbmFseXplLXRocm93XG4gIChlbnYgZm9ybSlcbiAgXCJFeGFtcGxlOlxuICAoYW5hbHl6ZS10aHJvdyB7fSAnKHRocm93IChFcnJvciA6Ym9vbSkpKSA9PiB7Om9wIDp0aHJvd1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gJyh0aHJvdyAoRXJyb3IgOmJvb20pKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnRocm93IHs6b3AgOmludm9rZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Y2FsbGVlIHs6b3AgOnZhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Zm9ybSAnRXJyb3JcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmluZm8gbmlsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDplbnYge319XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpwYXJhbXMgW3s6b3AgOmNvbnN0YW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6dHlwZSA6a2V5d29yZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gJzpib29tXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ZW52IHt9fV19fVwiXG4gIChsZXQqICgoZXhwcmVzc2lvbiAoYW5hbHl6ZSBlbnYgKHNlY29uZCBmb3JtKSkpKVxuICAgIHs6b3AgOnRocm93XG4gICAgIDpmb3JtIGZvcm1cbiAgICAgOnRocm93IGV4cHJlc3Npb259KSlcblxuKGluc3RhbGwtc3BlY2lhbCEgOnRocm93IGFuYWx5emUtdGhyb3cpXG5cbihkZWZ1biBhbmFseXplLXRyeVxuICAoZW52IGZvcm0pXG4gIChsZXQqICgoZm9ybXMgKHZlYyAocmVzdCBmb3JtKSkpXG5cbiAgICAgICAgOzsgRmluYWxseVxuICAgICAgICAodGFpbCAobGFzdCBmb3JtcykpXG4gICAgICAgIChmaW5hbGl6ZXItZm9ybSAoaWYgKGFuZCAobGlzdD8gdGFpbClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKD0gJ2ZpbmFsbHkgKGZpcnN0IHRhaWwpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAocmVzdCB0YWlsKSkpXG4gICAgICAgIChmaW5hbGl6ZXIgKGlmIGZpbmFsaXplci1mb3JtXG4gICAgICAgICAgICAgICAgICAgIChhbmFseXplLWJsb2NrIGVudiBmaW5hbGl6ZXItZm9ybSkpKVxuXG4gICAgICAgIDs7IGNhdGNoXG4gICAgICAgIChib2R5LWZvcm0gKGlmIGZpbmFsaXplclxuICAgICAgICAgICAgICAgICAgICAoYnV0bGFzdCBmb3JtcylcbiAgICAgICAgICAgICAgICAgICAgZm9ybXMpKVxuXG4gICAgICAgICh0YWlsIChsYXN0IGJvZHktZm9ybSkpXG4gICAgICAgIChoYW5kbGVyLWZvcm0gKGlmIChhbmQgKGxpc3Q/IHRhaWwpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoPSAnY2F0Y2ggKGZpcnN0IHRhaWwpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgKHJlc3QgdGFpbCkpKVxuICAgICAgICAoaGFuZGxlciAoaWYgaGFuZGxlci1mb3JtXG4gICAgICAgICAgICAgICAgICAoY29uaiB7Om5hbWUgKGFuYWx5emUgZW52IChmaXJzdCBoYW5kbGVyLWZvcm0pKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIChhbmFseXplLWJsb2NrIGVudiAocmVzdCBoYW5kbGVyLWZvcm0pKSkpKVxuXG4gICAgICAgIDs7IFRyeVxuICAgICAgICAoYm9keSAoaWYgaGFuZGxlci1mb3JtXG4gICAgICAgICAgICAgICAoYW5hbHl6ZS1ibG9jayAoc3ViLWVudiBlbnYpIChidXRsYXN0IGJvZHktZm9ybSkpXG4gICAgICAgICAgICAgICAoYW5hbHl6ZS1ibG9jayAoc3ViLWVudiBlbnYpIGJvZHktZm9ybSkpKSlcbiAgICB7Om9wIDp0cnlcbiAgICAgOmZvcm0gZm9ybVxuICAgICA6Ym9keSBib2R5XG4gICAgIDpoYW5kbGVyIGhhbmRsZXJcbiAgICAgOmZpbmFsaXplciBmaW5hbGl6ZXJ9KSlcblxuKGluc3RhbGwtc3BlY2lhbCEgOnRyeSBhbmFseXplLXRyeSlcblxuKGRlZnVuIGFuYWx5emUtc2V0IVxuICAoZW52IGZvcm0pXG4gIChsZXQqICgoYm9keSAocmVzdCBmb3JtKSlcbiAgICAgICAgKGxlZnQgKGZpcnN0IGJvZHkpKVxuICAgICAgICAocmlnaHQgKHNlY29uZCBib2R5KSlcbiAgICAgICAgKHRhcmdldCAoY29uZCAoKHN5bWJvbD8gbGVmdCkgKGFuYWx5emUtc3ltYm9sIGVudiBsZWZ0KSlcbiAgICAgICAgICAgICAgICAgICAgICgobGlzdD8gbGVmdCkgKGFuYWx5emUtbGlzdCBlbnYgbGVmdCkpXG4gICAgICAgICAgICAgICAgICAgICAoZWxzZSBsZWZ0KSkpXG4gICAgICAgICh2YWx1ZSAoYW5hbHl6ZSBlbnYgcmlnaHQpKSlcbiAgICB7Om9wIDpzZXQhXG4gICAgIDp0YXJnZXQgdGFyZ2V0XG4gICAgIDp2YWx1ZSB2YWx1ZVxuICAgICA6Zm9ybSBmb3JtfSkpXG4oaW5zdGFsbC1zcGVjaWFsISA6c2V0ISBhbmFseXplLXNldCEpXG5cbihkZWZ1biBhbmFseXplLW5ld1xuICAoZW52IGZvcm0pXG4gIChsZXQqICgoYm9keSAocmVzdCBmb3JtKSlcbiAgICAgICAgKGNvbnN0cnVjdG9yIChhbmFseXplIGVudiAoZmlyc3QgYm9keSkpKVxuICAgICAgICAocGFyYW1zICh2ZWMgKG1hcCAobGFtYmRhICglKSAoYW5hbHl6ZSBlbnYgJSkpIChyZXN0IGJvZHkpKSkpKVxuICAgIHs6b3AgOm5ld1xuICAgICA6Y29uc3RydWN0b3IgY29uc3RydWN0b3JcbiAgICAgOmZvcm0gZm9ybVxuICAgICA6cGFyYW1zIHBhcmFtc30pKVxuKGluc3RhbGwtc3BlY2lhbCEgOm5ldyBhbmFseXplLW5ldylcblxuKGRlZnVuIGFuYWx5emUtYWdldFxuICAoZW52IGZvcm0pXG4gIChsZXQqICgoYm9keSAocmVzdCBmb3JtKSlcbiAgICAgICAgKHRhcmdldCAoYW5hbHl6ZSBlbnYgKGZpcnN0IGJvZHkpKSlcbiAgICAgICAgKGF0dHJpYnV0ZSAoc2Vjb25kIGJvZHkpKVxuICAgICAgICAoZmllbGQgKGFuZCAocXVvdGU/IGF0dHJpYnV0ZSlcbiAgICAgICAgICAgICAgICAgICAoc3ltYm9sPyAoc2Vjb25kIGF0dHJpYnV0ZSkpXG4gICAgICAgICAgICAgICAgICAgKHNlY29uZCBhdHRyaWJ1dGUpKSkpXG4gICAgKGlmIChuaWw/IGF0dHJpYnV0ZSlcbiAgICAgIChzeW50YXgtZXJyb3IgXCJNYWxmb3JtZWQgYWdldC9hcmVmIGV4cHJlc3Npb24gZXhwZWN0ZWQgKGFnZXQgb2JqZWN0IG1lbWJlcilcIlxuICAgICAgICAgICAgICAgICAgICBmb3JtKVxuICAgICAgezpvcCA6bWVtYmVyLWV4cHJlc3Npb25cbiAgICAgICA6Y29tcHV0ZWQgKG5vdCBmaWVsZClcbiAgICAgICA6Zm9ybSBmb3JtXG4gICAgICAgOnRhcmdldCB0YXJnZXRcbiAgICAgICA7OyBJZiBmaWVsZCBpcyBhIHF1b3RlZCBzeW1ib2wgdGhlcmUncyBubyBuZWVkIHRvIHJlc29sdmVcbiAgICAgICA7OyBpdCBmb3IgaW5mb1xuICAgICAgIDpwcm9wZXJ0eSAoaWYgZmllbGRcbiAgICAgICAgICAgICAgICAgICAoY29uaiAoYW5hbHl6ZS1zcGVjaWFsIGFuYWx5emUtaWRlbnRpZmllciBlbnYgZmllbGQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgezpiaW5kaW5nIG5pbH0pXG4gICAgICAgICAgICAgICAgICAgKGFuYWx5emUgZW52IGF0dHJpYnV0ZSkpfSkpKVxuKGluc3RhbGwtc3BlY2lhbCEgOmFnZXQgYW5hbHl6ZS1hZ2V0KVxuOzsgYGFyZWZgIGlzIHRoZSB0cmFkaXRpb25hbC1MaXNwIHNwZWxsaW5nIG9mIHRoZSBzYW1lIHBsYWNlIGFjY2Vzcztcbjs7IHRoZSBzcGVjIChkb2NzL2xhbmd1YWdlLm1kKSBkb2N1bWVudHMgKGFyZWYgb2JqIGtleSkgd2l0aCBgYWdldGAga2VwdFxuOzsgYXMgdGhlIGFsaWFzLlxuKGluc3RhbGwtc3BlY2lhbCEgOmFyZWYgYW5hbHl6ZS1hZ2V0KVxuXG4oZGVmdW4gcGFyc2UtZGVmXG4gIChpZCAmcmVzdCBhcmdzKVxuICAoY29uZCAoKGVtcHR5PyBhcmdzKSB7OmlkIGlkfSlcbiAgICAgICAgKChpZGVudGljYWw/IChjb3VudCBhcmdzKSAxKSB7OmlkIGlkIDppbml0IChmaXJzdCBhcmdzKX0pXG4gICAgICAgIChlbHNlIHs6aWQgaWQgOmRvYyAoZmlyc3QgYXJncykgOmluaXQgKHNlY29uZCBhcmdzKX0pKSlcblxuKGRlZnVuIGFuYWx5emUtZGVmXG4gIChlbnYgZm9ybSlcbiAgXCJCYWNrcyBgZGVmdmFyYC9gZGVmdmFyLWAvYGRlZmNvbnN0YC9gZGVmY29uc3QtYC4gUHJpdmFjeSAod2hldGhlciB0aGVcbiAgYmluZGluZyBsYW5kcyBvbiBgZXhwb3J0c2ApIGlzIGRlY2lkZWQgYnkgd2hpY2ggb2YgdGhvc2UgZm91ciBoZWFkXG4gIHN5bWJvbHMgd2FzIHVzZWQgLS0gYSB0cmFpbGluZyBgLWAgbWVhbnMgcHJpdmF0ZSAtLSByYXRoZXIgdGhhbiBieVxuICBgXjpwcml2YXRlYCByZWFkZXIgbWV0YWRhdGEsIHdoaWNoIG5ldy1zeW50YXggZHJvcHMgZW50aXJlbHkuXCJcbiAgKGxldCogKChvcCAobmFtZSAoZmlyc3QgZm9ybSkpKVxuICAgICAgICAocHJpdmF0ZSAob3IgKGlkZW50aWNhbD8gb3AgXCJkZWZ2YXItXCIpXG4gICAgICAgICAgICAgICAgICAgIChpZGVudGljYWw/IG9wIFwiZGVmY29uc3QtXCIpKSlcbiAgICAgICAgKHBhcmFtcyAoYXBwbHkgcGFyc2UtZGVmICh2ZWMgKHJlc3QgZm9ybSkpKSlcbiAgICAgICAgKGlkICg6aWQgcGFyYW1zKSlcbiAgICAgICAgKG1ldGFkYXRhIChtZXRhIGlkKSlcblxuICAgICAgICAoYmluZGluZyAoYW5hbHl6ZS1zcGVjaWFsIGFuYWx5emUtZGVjbGFyYXRpb24gZW52IGlkKSlcblxuICAgICAgICAoaW5pdCAoYW5hbHl6ZSBlbnYgKDppbml0IHBhcmFtcykpKVxuXG4gICAgICAgIChkb2MgKG9yICg6ZG9jIHBhcmFtcylcbiAgICAgICAgICAgICAgICAoOmRvYyBtZXRhZGF0YSkpKSlcbiAgICB7Om9wIDpkZWZcbiAgICAgOmRvYyBkb2NcbiAgICAgOmlkIGJpbmRpbmdcbiAgICAgOmluaXQgaW5pdFxuICAgICA6ZXhwb3J0IChhbmQgKDp0b3AgZW52KVxuICAgICAgICAgICAgICAgICAgKG5vdCBwcml2YXRlKSlcbiAgICAgOmZvcm0gZm9ybX0pKVxuKGluc3RhbGwtc3BlY2lhbCEgOmRlZnZhciBhbmFseXplLWRlZilcbihpbnN0YWxsLXNwZWNpYWwhIDpkZWZ2YXItIGFuYWx5emUtZGVmKVxuKGluc3RhbGwtc3BlY2lhbCEgOmRlZmNvbnN0IGFuYWx5emUtZGVmKVxuKGluc3RhbGwtc3BlY2lhbCEgOmRlZmNvbnN0LSBhbmFseXplLWRlZilcblxuKGRlZnVuIGFuYWx5emUtZG9cbiAgKGVudiBmb3JtKVxuICAobGV0KiAoKGV4cHJlc3Npb25zIChyZXN0IGZvcm0pKVxuICAgICAgICAoYm9keSAoYW5hbHl6ZS1ibG9jayBlbnYgZXhwcmVzc2lvbnMpKSlcbiAgICAoY29uaiBib2R5IHs6b3AgOmRvXG4gICAgICAgICAgICAgICAgOmZvcm0gZm9ybX0pKSlcbihpbnN0YWxsLXNwZWNpYWwhIDpwcm9nbiBhbmFseXplLWRvKVxuXG4oZGVmdW4gYW5hbHl6ZS1zeW1ib2xcbiAgKGVudiBmb3JtKVxuICBcIlN5bWJvbCBhbmFseXplciBhbHNvIGRvZXMgc3ludGF4IGRlc3VnYXJpbmcgZm9yIHRoZSBzeW1ib2xzXG4gIGxpa2UgZm9vLmJhci5iYXogcHJvZHVjaW5nIChhZ2V0IGZvbyAnYmFyLmJheikgZm9ybS4gVGhpcyBlbmFibGVzXG4gIHJlbmFtaW5nIG9mIHNoYWRvd2VkIHN5bWJvbHMuXCJcbiAgKGxldCogKChmb3JtcyAoc3BsaXQgKG5hbWUgZm9ybSkgXFwuKSlcbiAgICAgICAgKG1ldGFkYXRhIChtZXRhIGZvcm0pKVxuICAgICAgICAoc3RhcnQgKDpzdGFydCBtZXRhZGF0YSkpXG4gICAgICAgIChlbmQgKDplbmQgbWV0YWRhdGEpKVxuICAgICAgICAoZXhwYW5zaW9uIChpZiAoPiAoY291bnQgZm9ybXMpIDEpXG4gICAgICAgICAgICAgICAgICAgKGxpc3QgJ2FnZXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAod2l0aC1tZXRhIChzeW1ib2wgKGZpcnN0IGZvcm1zKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIChjb25qIG1ldGFkYXRhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7OnN0YXJ0IHN0YXJ0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmVuZCB7OmxpbmUgKDpsaW5lIGVuZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Y29sdW1uICgrIDEgKDpjb2x1bW4gc3RhcnQpIChjb3VudCAoZmlyc3QgZm9ybXMpKSl9fSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgKGxpc3QgJ3F1b3RlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHdpdGgtbWV0YSAoc3ltYm9sIChqb2luIFxcLiAocmVzdCBmb3JtcykpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGNvbmogbWV0YWRhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHs6ZW5kIGVuZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpzdGFydCB7OmxpbmUgKDpsaW5lIHN0YXJ0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmNvbHVtbiAoKyAxICg6Y29sdW1uIHN0YXJ0KSAoY291bnQgKGZpcnN0IGZvcm1zKSkpfX0pKSkpKSkpXG4gICAgKGlmIGV4cGFuc2lvblxuICAgICAgKGFuYWx5emUgZW52ICh3aXRoLW1ldGEgZXhwYW5zaW9uIChtZXRhIGZvcm0pKSlcbiAgICAgIChhbmFseXplLXNwZWNpYWwgYW5hbHl6ZS1pZGVudGlmaWVyIGVudiBmb3JtKSkpKVxuXG4oZGVmdW4gYW5hbHl6ZS1pZGVudGlmaWVyXG4gIChlbnYgZm9ybSlcbiAgezpvcCA6dmFyXG4gICA6dHlwZSA6aWRlbnRpZmllclxuICAgOmZvcm0gZm9ybVxuICAgOnN0YXJ0ICg6c3RhcnQgKG1ldGEgZm9ybSkpXG4gICA6ZW5kICg6ZW5kIChtZXRhIGZvcm0pKVxuICAgOmJpbmRpbmcgKHJlc29sdmUtYmluZGluZyBlbnYgZm9ybSl9KVxuXG4oZGVmdW4gdW5yZXNvbHZlZC1iaW5kaW5nXG4gIChlbnYgZm9ybSlcbiAgezpvcCA6dW5yZXNvbHZlZC1iaW5kaW5nXG4gICA6dHlwZSA6dW5yZXNvbHZlZC1iaW5kaW5nXG4gICA6aWRlbnRpZmllciB7OnR5cGUgOmlkZW50aWZpZXJcbiAgICAgICAgICAgICAgICA6Zm9ybSAoc3ltYm9sIChuYW1lc3BhY2UgZm9ybSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChuYW1lIGZvcm0pKX1cbiAgIDpzdGFydCAoOnN0YXJ0IChtZXRhIGZvcm0pKVxuICAgOmVuZCAoOmVuZCAobWV0YSBmb3JtKSl9KVxuXG4oZGVmdW4gcmVzb2x2ZS1iaW5kaW5nXG4gIChlbnYgZm9ybSlcbiAgKG9yIChnZXQgKDpsb2NhbHMgZW52KSAobmFtZSBmb3JtKSlcbiAgICAgIChnZXQgKDplbmNsb3NlZCBlbnYpIChuYW1lIGZvcm0pKVxuICAgICAgKHVucmVzb2x2ZWQtYmluZGluZyBlbnYgZm9ybSkpKVxuXG4oZGVmdW4gYW5hbHl6ZS1zaGFkb3dcbiAgKGVudiBpZClcbiAgKGxldCogKChiaW5kaW5nIChyZXNvbHZlLWJpbmRpbmcgZW52IGlkKSkpXG4gICAgezpkZXB0aCAoaW5jIChvciAoOmRlcHRoIGJpbmRpbmcpIDApKVxuICAgICA6c2hhZG93IGJpbmRpbmd9KSlcblxuKGRlZnVuIGFuYWx5emUtYmluZGluZ1xuICAoZW52IGZvcm0pXG4gIChsZXQqICgoaWQgKGZpcnN0IGZvcm0pKVxuICAgICAgICAoYm9keSAoc2Vjb25kIGZvcm0pKSlcbiAgICAoY29uaiAoYW5hbHl6ZS1zaGFkb3cgZW52IGlkKVxuICAgICAgICAgIHs6b3AgOmJpbmRpbmdcbiAgICAgICAgICAgOnR5cGUgOmJpbmRpbmdcbiAgICAgICAgICAgOmlkIGlkXG4gICAgICAgICAgIDppbml0IChhbmFseXplIGVudiBib2R5KVxuICAgICAgICAgICA6Zm9ybSBmb3JtfSkpKVxuXG4oZGVmdW4gYW5hbHl6ZS1kZWNsYXJhdGlvblxuICAoZW52IGZvcm0pXG4gIChhc3NlcnQgKG5vdCAob3IgKG5hbWVzcGFjZSBmb3JtKVxuICAgICAgICAgICAgICAgICAgICg8IDEgKGNvdW50IChzcGxpdCBcXC4gKHN0ciBmb3JtKSkpKSkpKVxuICAoY29uaiAoYW5hbHl6ZS1zaGFkb3cgZW52IGZvcm0pXG4gICAgICAgIHs6b3AgOnZhclxuICAgICAgICAgOnR5cGUgOmlkZW50aWZpZXJcbiAgICAgICAgIDpkZXB0aCAwXG4gICAgICAgICA6aWQgZm9ybVxuICAgICAgICAgOmZvcm0gZm9ybX0pKVxuXG4oZGVmdW4gYW5hbHl6ZS1wYXJhbVxuICAoZW52IGZvcm0pXG4gIChjb25qIChhbmFseXplLXNoYWRvdyBlbnYgZm9ybSlcbiAgICAgICAgezpvcCA6cGFyYW1cbiAgICAgICAgIDp0eXBlIDpwYXJhbWV0ZXJcbiAgICAgICAgIDppZCBmb3JtXG4gICAgICAgICA6Zm9ybSBmb3JtXG4gICAgICAgICA6c3RhcnQgKDpzdGFydCAobWV0YSBmb3JtKSlcbiAgICAgICAgIDplbmQgKDplbmQgKG1ldGEgZm9ybSkpfSkpXG5cbihkZWZ1biB3aXRoLWJpbmRpbmdcbiAgKGVudiBmb3JtKVxuICBcIlJldHVybnMgZW5oYW5jZWQgZW52aXJvbm1lbnQgd2l0aCBhZGRpdGlvbmFsIGJpbmRpbmcgYWRkZWRcbiAgdG8gdGhlIDpiaW5kaW5ncyBhbmQgOnNjb3BlXCJcbiAgKGNvbmogZW52IHs6bG9jYWxzIChhc3NvYyAoOmxvY2FscyBlbnYpIChuYW1lICg6aWQgZm9ybSkpIGZvcm0pXG4gICAgICAgICAgICAgOmJpbmRpbmdzIChjb25qICg6YmluZGluZ3MgZW52KSBmb3JtKX0pKVxuXG4oZGVmdW4gd2l0aC1wYXJhbVxuICAoZW52IGZvcm0pXG4gIChjb25qICh3aXRoLWJpbmRpbmcgZW52IGZvcm0pXG4gICAgICAgIHs6cGFyYW1zIChjb25qICg6cGFyYW1zIGVudikgZm9ybSl9KSlcblxuKGRlZnVuIHN1Yi1lbnZcbiAgKGVudilcbiAgezplbmNsb3NlZCAoY29uaiB7fVxuICAgICAgICAgICAgICAgICAgICg6ZW5jbG9zZWQgZW52KVxuICAgICAgICAgICAgICAgICAgICg6bG9jYWxzIGVudikpXG4gICA6bG9jYWxzIHt9XG4gICA6YmluZGluZ3MgW11cbiAgIDpwYXJhbXMgKG9yICg6cGFyYW1zIGVudikgW10pfSlcblxuXG4oZGVmdW4gYW5hbHl6ZS1sZXQqXG4gIChlbnYgZm9ybSBpcy1sb29wKVxuICBcIlRha2VzIGxldCBmb3JtIGFuZCBlbmhhbmNlcyBpdCdzIG1ldGFkYXRhIHZpYSBhbmFseXplZFxuICBpbmZvXCJcbiAgKGxldCogKChleHByZXNzaW9ucyAocmVzdCBmb3JtKSlcbiAgICAgICAgKGJpbmRpbmdzIChmaXJzdCBleHByZXNzaW9ucykpXG4gICAgICAgIChib2R5IChyZXN0IGV4cHJlc3Npb25zKSlcblxuICAgICAgICAodmFsaWQtYmluZGluZ3M/IChhbmQgKHZlY3Rvcj8gYmluZGluZ3MpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIChldmVuPyAoY291bnQgYmluZGluZ3MpKSkpXG5cbiAgICAgICAgKF8gKGFzc2VydCB2YWxpZC1iaW5kaW5ncz9cbiAgICAgICAgICAgICAgICAgIFwiYmluZGluZ3MgbXVzdCBiZSB2ZWN0b3Igb2YgZXZlbiBudW1iZXIgb2YgZWxlbWVudHNcIikpXG5cbiAgICAgICAgKHNjb3BlIChyZWR1Y2UgKGxhbWJkYSAoJTEgJTIpICh3aXRoLWJpbmRpbmcgJTEgKGFuYWx5emUtYmluZGluZyAlMSAlMikpKVxuICAgICAgICAgICAgICAgICAgICAgIChzdWItZW52IGVudilcbiAgICAgICAgICAgICAgICAgICAgICAocGFydGl0aW9uIDIgYmluZGluZ3MpKSlcblxuICAgICAgICAoYmluZGluZ3MgKDpiaW5kaW5ncyBzY29wZSkpXG5cbiAgICAgICAgKGV4cHJlc3Npb25zIChhbmFseXplLWJsb2NrIChpZiBpcy1sb29wXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGNvbmogc2NvcGUgezpwYXJhbXMgYmluZGluZ3N9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib2R5KSkpXG5cbiAgICB7Om9wIDpsZXRcbiAgICAgOmZvcm0gZm9ybVxuICAgICA6c3RhcnQgKDpzdGFydCAobWV0YSBmb3JtKSlcbiAgICAgOmVuZCAoOmVuZCAobWV0YSBmb3JtKSlcbiAgICAgOmJpbmRpbmdzIGJpbmRpbmdzXG4gICAgIDpzdGF0ZW1lbnRzICg6c3RhdGVtZW50cyBleHByZXNzaW9ucylcbiAgICAgOnJlc3VsdCAoOnJlc3VsdCBleHByZXNzaW9ucyl9KSlcblxuKGRlZnVuIGFuYWx5emUtbGV0XG4gIChlbnYgZm9ybSlcbiAgKGFuYWx5emUtbGV0KiBlbnYgZm9ybSBmYWxzZSkpXG47OyBgbGV0KipgIGlzIHRoZSBwb3N0LW1hY3JvZXhwYW5zaW9uIGludGVybmFsIGJpbmRpbmcgZm9ybSAoZmxhdCB2ZWN0b3Igb2Zcbjs7IG5hbWUvaW5pdCBwYWlycywgc2VxdWVudGlhbCkgLS0gYW5hbG9nb3VzIHRvIGBmbipgL2Bsb29wKmAuIE5ldy1zeW50YXgnc1xuOzsgdXNlci1mYWNpbmcgYGxldGAvYGxldCpgIChwYXJlbi1saXN0IGJpbmRpbmdzKSBhcmUgZXhwYW5kZXIgbWFjcm9zIHRoYXRcbjs7IGJvdGggbG93ZXIgdG8gdGhpcyBmb3JtOyBrZWVwaW5nIHRoZSBpbnRlcm5hbCBrZXkgZGlzdGluY3QgZnJvbSB0aGVcbjs7IHB1YmxpYyBgbGV0KmAgc3BlbGxpbmcgYXZvaWRzIHRoZSBtYWNyb2V4cGFuZGVyIHJlLWV4cGFuZGluZyBpdHMgb3duXG47OyBvdXRwdXQuXG4oaW5zdGFsbC1zcGVjaWFsISA6bGV0KiogYW5hbHl6ZS1sZXQpXG5cbihkZWZ1biBhbmFseXplLWxvb3BcbiAgKGVudiBmb3JtKVxuICAoY29uaiAoYW5hbHl6ZS1sZXQqIGVudiBmb3JtIHRydWUpIHs6b3AgOmxvb3B9KSlcbihpbnN0YWxsLXNwZWNpYWwhIDpsb29wKiBhbmFseXplLWxvb3ApXG5cblxuKGRlZnVuIGFuYWx5emUtcmVjdXJcbiAgKGVudiBmb3JtKVxuICAobGV0KiAoKHBhcmFtcyAoOnBhcmFtcyBlbnYpKVxuICAgICAgICAoZm9ybXMgKHZlYyAobWFwIChsYW1iZGEgKCUpIChhbmFseXplIGVudiAlKSkgKHJlc3QgZm9ybSkpKSkpXG5cbiAgICAoaWYgKD0gKGNvdW50IHBhcmFtcylcbiAgICAgICAgICAgKGNvdW50IGZvcm1zKSlcbiAgICAgIHs6b3AgOnJlY3VyXG4gICAgICAgOmZvcm0gZm9ybVxuICAgICAgIDpwYXJhbXMgZm9ybXN9XG4gICAgICAoc3ludGF4LWVycm9yIFwiUmVjdXJzIHdpdGggd3JvbmcgbnVtYmVyIG9mIGFyZ3VtZW50c1wiXG4gICAgICAgICAgICAgICAgICAgIGZvcm0pKSkpXG4oaW5zdGFsbC1zcGVjaWFsISA6cmVjdXIgYW5hbHl6ZS1yZWN1cilcblxuKGRlZnVuIGFuYWx5emUtcXVvdGVkLWxpc3RcbiAgKGZvcm0pXG4gIHs6b3AgOmxpc3RcbiAgIDppdGVtcyAobWFwIGFuYWx5emUtcXVvdGVkICh2ZWMgZm9ybSkpXG4gICA6Zm9ybSBmb3JtXG4gICA6c3RhcnQgKDpzdGFydCAobWV0YSBmb3JtKSlcbiAgIDplbmQgKDplbmQgKG1ldGEgZm9ybSkpfSlcblxuKGRlZnVuIGFuYWx5emUtcXVvdGVkLXZlY3RvclxuICAoZm9ybSlcbiAgezpvcCA6dmVjdG9yXG4gICA6aXRlbXMgKG1hcCBhbmFseXplLXF1b3RlZCBmb3JtKVxuICAgOmZvcm0gZm9ybVxuICAgOnN0YXJ0ICg6c3RhcnQgKG1ldGEgZm9ybSkpXG4gICA6ZW5kICg6ZW5kIChtZXRhIGZvcm0pKX0pXG5cbihkZWZ1biBhbmFseXplLXF1b3RlZC1kaWN0aW9uYXJ5XG4gIChmb3JtKVxuICAobGV0KiAoKG5hbWVzICh2ZWMgKG1hcCBhbmFseXplLXF1b3RlZCAoa2V5cyBmb3JtKSkpKVxuICAgICAgICAodmFsdWVzICh2ZWMgKG1hcCBhbmFseXplLXF1b3RlZCAodmFscyBmb3JtKSkpKSlcbiAgICB7Om9wIDpkaWN0aW9uYXJ5XG4gICAgIDpmb3JtIGZvcm1cbiAgICAgOmtleXMgbmFtZXNcbiAgICAgOnZhbHVlcyB2YWx1ZXNcbiAgICAgOnN0YXJ0ICg6c3RhcnQgKG1ldGEgZm9ybSkpXG4gICAgIDplbmQgKDplbmQgKG1ldGEgZm9ybSkpfSkpXG5cbihkZWZ1biBhbmFseXplLXF1b3RlZC1zeW1ib2xcbiAgKGZvcm0pXG4gIHs6b3AgOnN5bWJvbFxuICAgOm5hbWUgKG5hbWUgZm9ybSlcbiAgIDpuYW1lc3BhY2UgKG5hbWVzcGFjZSBmb3JtKVxuICAgOmZvcm0gZm9ybX0pXG5cbihkZWZ1biBhbmFseXplLXF1b3RlZC1rZXl3b3JkXG4gKGZvcm0pXG4gIHs6b3AgOmtleXdvcmRcbiAgIDpuYW1lIChuYW1lIGZvcm0pXG4gICA6bmFtZXNwYWNlIChuYW1lc3BhY2UgZm9ybSlcbiAgIDpmb3JtIGZvcm19KVxuXG4oZGVmdW4gYW5hbHl6ZS1xdW90ZWRcbiAgKGZvcm0pXG4gIChjb25kICgoc3ltYm9sPyBmb3JtKSAoYW5hbHl6ZS1xdW90ZWQtc3ltYm9sIGZvcm0pKVxuICAgICAgICAoKGtleXdvcmQ/IGZvcm0pIChhbmFseXplLXF1b3RlZC1rZXl3b3JkIGZvcm0pKVxuICAgICAgICAoKGxpc3Q/IGZvcm0pIChhbmFseXplLXF1b3RlZC1saXN0IGZvcm0pKVxuICAgICAgICAoKHZlY3Rvcj8gZm9ybSkgKGFuYWx5emUtcXVvdGVkLXZlY3RvciBmb3JtKSlcbiAgICAgICAgKChkaWN0aW9uYXJ5PyBmb3JtKSAoYW5hbHl6ZS1xdW90ZWQtZGljdGlvbmFyeSBmb3JtKSlcbiAgICAgICAgKGVsc2UgezpvcCA6Y29uc3RhbnRcbiAgICAgICAgICAgICAgIDpmb3JtIGZvcm19KSkpXG5cbihkZWZ1biBhbmFseXplLXF1b3RlXG4gIChlbnYgZm9ybSlcbiAgXCJFeGFtcGxlczpcbiAgIChhbmFseXplLXF1b3RlIHt9ICcocXVvdGUgZm9vKSkgPT4gezpvcCA6Y29uc3RhbnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtICdmb29cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDplbnYgZW52fVwiXG4gIChhbmFseXplLXF1b3RlZCAoc2Vjb25kIGZvcm0pKSlcbihpbnN0YWxsLXNwZWNpYWwhIDpxdW90ZSBhbmFseXplLXF1b3RlKVxuXG4oZGVmdW4gYW5hbHl6ZS1zdGF0ZW1lbnRcbiAgKGVudiBmb3JtKVxuICAobGV0KiAoKHN0YXRlbWVudHMgKG9yICg6c3RhdGVtZW50cyBlbnYpIFtdKSlcbiAgICAgICAgKGJpbmRpbmdzIChvciAoOmJpbmRpbmdzIGVudikgW10pKVxuICAgICAgICAoc3RhdGVtZW50IChhbmFseXplIChjb25qIGVudiB7OnN0YXRlbWVudHMgbmlsfSkgZm9ybSkpXG4gICAgICAgIChvcCAoOm9wIHN0YXRlbWVudCkpXG5cbiAgICAgICAgKGRlZnMgKGNvbmQgKCg9IG9wIDpkZWYpIFsoOnZhciBzdGF0ZW1lbnQpXSlcbiAgICAgICAgICAgICAgICAgICA7OyAoPSBvcCA6bnMpICg6cmVxdWlyZW1lbnQgbm9kZSlcbiAgICAgICAgICAgICAgICAgICAoZWxzZSBuaWwpKSkpXG5cbiAgICAoY29uaiBlbnYgezpzdGF0ZW1lbnRzIChjb25qIHN0YXRlbWVudHMgc3RhdGVtZW50KVxuICAgICAgICAgICAgICAgOmJpbmRpbmdzIChjb25jYXQgYmluZGluZ3MgZGVmcyl9KSkpXG5cbihkZWZ1biBhbmFseXplLWJsb2NrXG4gIChlbnYgZm9ybSlcbiAgXCJFeGFtcGxlczpcbiAgKGFuYWx5emUtYmxvY2sge30gJygoZm9vIGJhcikpKSA9PiB7OnN0YXRlbWVudHMgbmlsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpyZXN1bHQgezpvcCA6aW52b2tlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtICcoZm9vIGJhcilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmVudiB7fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Y2FsbGVlIHs6b3AgOnZhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Zm9ybSAnZm9vXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDppbmZvIG5pbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ZW52IHt9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6cGFyYW1zIFt7Om9wIDp2YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtICdiYXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDppbmZvIG5pbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmVudiB7fX1dfVxuICAoYW5hbHl6ZS1ibG9jayB7fSAnKChiZWVwIGJ6KVxuICAgICAgICAgICAgICAgICAgICAgIChmb28gYmFyKSkpID0+IHs6c3RhdGVtZW50cyBbezpvcCA6aW52b2tlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gJyhiZWVwIGJ6KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDplbnYge31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Y2FsbGVlIHs6b3AgOnZhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtICdiZWVwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmluZm8gbmlsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmVudiB7fX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6cGFyYW1zIFt7Om9wIDp2YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gJ2J6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDppbmZvIG5pbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ZW52IHt9fV19XVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6cmVzdWx0IHs6b3AgOmludm9rZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Zm9ybSAnKGZvbyBiYXIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDplbnYge31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmNhbGxlZSB7Om9wIDp2YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gJ2Zvb1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6aW5mbyBuaWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmVudiB7fX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnBhcmFtcyBbezpvcCA6dmFyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Zm9ybSAnYmFyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6aW5mbyBuaWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDplbnYge319XX1cIlxuICAobGV0KiAoKGJvZHkgKGlmICg+IChjb3VudCBmb3JtKSAxKVxuICAgICAgICAgICAgICAgKHJlZHVjZSBhbmFseXplLXN0YXRlbWVudFxuICAgICAgICAgICAgICAgICAgICAgICBlbnZcbiAgICAgICAgICAgICAgICAgICAgICAgKGJ1dGxhc3QgZm9ybSkpKSlcbiAgICAgICAgKHJlc3VsdCAoYW5hbHl6ZSAob3IgYm9keSBlbnYpIChsYXN0IGZvcm0pKSkpXG4gICAgezpzdGF0ZW1lbnRzICg6c3RhdGVtZW50cyBib2R5KVxuICAgICA6cmVzdWx0IHJlc3VsdH0pKVxuXG4oZGVmdW4gYW5hbHl6ZS1mbi1tZXRob2RcbiAgKGVudiBmb3JtKVxuICBcIlxuICB7fSAtPiAnKFt4IHldICgrIHggeSkpIC0+IHs6ZW52IHt9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtICcoW3ggeV0gKCsgeCB5KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnZhcmlhZGljIGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIDphcml0eSAyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpwYXJhbXMgW3s6b3AgOnZhciA6Zm9ybSAneH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgezpvcCA6dmFyIDpmb3JtICd5fV1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnN0YXRlbWVudHMgW11cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnJldHVybiB7Om9wIDppbnZva2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmNhbGxlZSB7Om9wIDp2YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gJytcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmVudiB7OnBhcmVudCB7fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6bG9jYWxzIHt4IHs6bmFtZSAneFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6c2hhZG93IG5pbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6bG9jYWwgdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6dGFnIG5pbH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeSB7Om5hbWUgJ3lcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnNoYWRvdyBuaWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmxvY2FsIHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnRhZyBuaWx9fX19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpwYXJhbXMgW3s6b3AgOnZhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gJ3hcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDppbmZvIG5pbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnRhZyBuaWx9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHs6b3AgOnZhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gJ3lcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDppbmZvIG5pbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnRhZyBuaWx9XX19XCJcbiAgKGxldCogKChzaWduYXR1cmUgKGlmIChhbmQgKGxpc3Q/IGZvcm0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAodmVjdG9yPyAoZmlyc3QgZm9ybSkpKVxuICAgICAgICAgICAgICAgICAgICAoZmlyc3QgZm9ybSlcbiAgICAgICAgICAgICAgICAgICAgKHN5bnRheC1lcnJvciBcIk1hbGZvcm1lZCBmbiBvdmVybG9hZCBmb3JtXCIgZm9ybSkpKVxuICAgICAgICAoYm9keSAocmVzdCBmb3JtKSlcbiAgICAgICAgOzsgSWYgcGFyYW0gc2lnbmF0dXJlIGNvbnRhaW5zICYgZm4gaXMgdmFyaWFkaWMuXG4gICAgICAgICh2YXJpYWRpYyAoc29tZSAobGFtYmRhICglKSAoPSAnJiAlKSkgc2lnbmF0dXJlKSlcblxuICAgICAgICA7OyBBbGwgbmFtZWQgcGFyYW1zIG9mIHRoZSBmbi5cbiAgICAgICAgKHBhcmFtcyAoaWYgdmFyaWFkaWNcbiAgICAgICAgICAgICAgICAgKGZpbHRlciAobGFtYmRhICglKSAobm90ICg9ICcmICUpKSkgc2lnbmF0dXJlKVxuICAgICAgICAgICAgICAgICBzaWduYXR1cmUpKVxuXG4gICAgICAgIDs7IE51bWJlciBvZiBwYXJhbWV0ZXJzIGZpeGVkIHBhcmFtZXRlcnMgZm4gdGFrZXMuXG4gICAgICAgIChhcml0eSAoaWYgdmFyaWFkaWNcbiAgICAgICAgICAgICAgICAoZGVjIChjb3VudCBwYXJhbXMpKVxuICAgICAgICAgICAgICAgIChjb3VudCBwYXJhbXMpKSlcblxuICAgICAgICA7OyBBbmFseXplIHBhcmFtZXRlcnMgaW4gY29ycmVzcG9uZGVuY2UgdG8gZW52aXJvbm1lbnRcbiAgICAgICAgOzsgbG9jYWxzIHRvIGlkZW50aWZ5IGJpbmRpbmcgc2hhZG93aW5nLlxuICAgICAgICAoc2NvcGUgKHJlZHVjZSAobGFtYmRhICglMSAlMikgKHdpdGgtcGFyYW0gJTEgKGFuYWx5emUtcGFyYW0gJTEgJTIpKSlcbiAgICAgICAgICAgICAgICAgICAgICAoY29uaiBlbnYgezpwYXJhbXMgW119KVxuICAgICAgICAgICAgICAgICAgICAgIHBhcmFtcykpKVxuICAgIChjb25qIChhbmFseXplLWJsb2NrIHNjb3BlIGJvZHkpXG4gICAgICAgICAgezpvcCA6b3ZlcmxvYWRcbiAgICAgICAgICAgOnZhcmlhZGljIHZhcmlhZGljXG4gICAgICAgICAgIDphcml0eSBhcml0eVxuICAgICAgICAgICA6cGFyYW1zICg6cGFyYW1zIHNjb3BlKVxuICAgICAgICAgICA6Zm9ybSBmb3JtfSkpKVxuXG5cbihkZWZ1biBhbmFseXplLWZuXG4gIChlbnYgZm9ybSlcbiAgKGxldCogKChmb3JtcyAocmVzdCBmb3JtKSlcbiAgICAgICAgOzsgTm9ybWFsaXplIGZuIGZvcm0gc28gdGhhdCBpdCBjb250YWlucyBuYW1lXG4gICAgICAgIDs7ICcoZm4gW3hdIHgpIC0+ICcoZm4gbmlsIFt4XSB4KVxuICAgICAgICAoZm9ybXMgKGlmIChzeW1ib2w/IChmaXJzdCBmb3JtcykpXG4gICAgICAgICAgICAgICAgZm9ybXNcbiAgICAgICAgICAgICAgICAoY29ucyBuaWwgZm9ybXMpKSlcblxuICAgICAgICAoaWQgKGZpcnN0IGZvcm1zKSlcbiAgICAgICAgKGJpbmRpbmcgKGlmIGlkIChhbmFseXplLXNwZWNpYWwgYW5hbHl6ZS1kZWNsYXJhdGlvbiBlbnYgaWQpKSlcblxuICAgICAgICAoYm9keSAocmVzdCBmb3JtcykpXG5cbiAgICAgICAgOzsgTWFrZSBzdXJlIHRoYXQgZm4gZGVmaW5pdGlvbiBpcyBzdHJ1Y3V0ZXJlZFxuICAgICAgICA7OyBpbiBtZXRob2Qgb3ZlcmxvYWQgc3R5bGU6XG4gICAgICAgIDs7IChmbiBhIFt4XSB5KSAtPiAoKFt4XSB5KSlcbiAgICAgICAgOzsgKGZuIGEgKFt4XSB5KSkgLT4gKChbeF0geSkpXG4gICAgICAgIChvdmVybG9hZHMgKGNvbmQgKCh2ZWN0b3I/IChmaXJzdCBib2R5KSkgKGxpc3QgYm9keSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAoKGFuZCAobGlzdD8gKGZpcnN0IGJvZHkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodmVjdG9yPyAoZmlyc3QgKGZpcnN0IGJvZHkpKSkpIGJvZHkpXG4gICAgICAgICAgICAgICAgICAgICAgICAoZWxzZSAoc3ludGF4LWVycm9yIChzdHIgXCJNYWxmb3JtZWQgZm4gZXhwcmVzc2lvbiwgXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInBhcmFtZXRlciBkZWNsYXJhdGlvbiAoXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAocHItc3RyIChmaXJzdCBib2R5KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIikgbXVzdCBiZSBhIHZlY3RvclwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JtKSkpKVxuXG4gICAgICAgIChzY29wZSAoaWYgYmluZGluZ1xuICAgICAgICAgICAgICAgICh3aXRoLWJpbmRpbmcgKHN1Yi1lbnYgZW52KSBiaW5kaW5nKVxuICAgICAgICAgICAgICAgIChzdWItZW52IGVudikpKVxuXG4gICAgICAgIChtZXRob2RzIChtYXAgKGxhbWJkYSAoJSkgKGFuYWx5emUtZm4tbWV0aG9kIHNjb3BlICUpKVxuICAgICAgICAgICAgICAgICAgICAgKHZlYyBvdmVybG9hZHMpKSlcblxuICAgICAgICAoYXJpdHkgKGFwcGx5IG1heCAobWFwIChsYW1iZGEgKCUpICg6YXJpdHkgJSkpIG1ldGhvZHMpKSlcbiAgICAgICAgKHZhcmlhZGljIChzb21lIChsYW1iZGEgKCUpICg6dmFyaWFkaWMgJSkpIG1ldGhvZHMpKSlcbiAgICB7Om9wIDpmblxuICAgICA6dHlwZSA6ZnVuY3Rpb25cbiAgICAgOmlkIGJpbmRpbmdcbiAgICAgOnZhcmlhZGljIHZhcmlhZGljXG4gICAgIDptZXRob2RzIG1ldGhvZHNcbiAgICAgOmZvcm0gZm9ybX0pKVxuKGluc3RhbGwtc3BlY2lhbCEgOmZuKiBhbmFseXplLWZuKVxuXG4oZGVmdW4gcGFyc2UtcmVmZXJlbmNlc1xuICAoZm9ybXMpXG4gIFwiVGFrZXMgcGFydCBvZiBuYW1lc3BhY2UgZGVmaW5pdGlvbiBhbmQgY3JlYXRlcyBoYXNoXG4gIG9mIHJlZmVyZW5jZSBmb3Jtc1wiXG4gIChyZWR1Y2UgKGxhbWJkYSAocmVmZXJlbmNlcyBmb3JtKVxuICAgICAgICAgICAgOzsgSWYgbm90IGEgdmVjdG9yIHRoYW4gaXQncyBub3QgYSByZWZlcmVuY2VcbiAgICAgICAgICAgIDs7IGZvcm0gdGhhdCB3aXNwIHVuZGVyc3RhbmRzIHNvIGp1c3Qgc2tpcCBpdC5cbiAgICAgICAgICAgIChpZiAoc2VxPyBmb3JtKVxuICAgICAgICAgICAgICAoYXNzb2MgcmVmZXJlbmNlc1xuICAgICAgICAgICAgICAgIChuYW1lIChmaXJzdCBmb3JtKSlcbiAgICAgICAgICAgICAgICAodmVjIChyZXN0IGZvcm0pKSlcbiAgICAgICAgICAgICAgcmVmZXJlbmNlcykpXG4gICAgICAgICAge31cbiAgICAgICAgICBmb3JtcykpXG5cbihkZWZ1biBwYXJzZS1yZXF1aXJlXG4gIChmb3JtKVxuICAobGV0KiAoOzsgcmVxdWlyZSBmb3JtIG1heSBiZSBlaXRoZXIgdmVjdG9yIHdpdGggaWQgaW4gdGhlXG4gICAgICAgIDs7IGhlYWQgb3IganVzdCBhbiBpZCBzeW1ib2wuIG5vcm1hbGl6aW5nIHRvIGEgdmVjdG9yXG4gICAgICAgIChyZXF1aXJlbWVudCAoaWYgKHN5bWJvbD8gZm9ybSkgW2Zvcm1dICh2ZWMgZm9ybSkpKVxuICAgICAgICAoaWQgKGZpcnN0IHJlcXVpcmVtZW50KSlcbiAgICAgICAgOzsgYnVuY2ggb2YgZGlyZWN0aXZlcyBtYXkgZm9sbG93IHJlcXVpcmUgZm9ybSBidXQgdGhleVxuICAgICAgICA7OyBhbGwgY29tZSBpbiBwYWlycy4gd2lzcCBzdXBwb3J0cyBmb2xsb3dpbmcgcGFpcnM6XG4gICAgICAgIDs7IDphcyBmb29cbiAgICAgICAgOzsgOnJlZmVyIFtmb28gYmFyXVxuICAgICAgICA7OyA6cmVuYW1lIHtmb28gYmFyfVxuICAgICAgICA7OyBqb2luIHRoZXNlIHBhaXJzIGluIGEgaGFzaCBmb3Iga2V5IGJhc2VkIGFjY2Vzcy5cbiAgICAgICAgKHBhcmFtcyAoYXBwbHkgZGljdGlvbmFyeSAocmVzdCByZXF1aXJlbWVudCkpKVxuICAgICAgICAocmVuYW1lcyAoZ2V0IHBhcmFtcyAnOnJlbmFtZSkpXG4gICAgICAgIChuYW1lcyAoZ2V0IHBhcmFtcyAnOnJlZmVyKSlcbiAgICAgICAgKGFsaWFzIChnZXQgcGFyYW1zICc6YXMpKVxuICAgICAgICAocmVmZXJlbmNlcyAoaWYgKG5vdCAoZW1wdHk/IG5hbWVzKSlcbiAgICAgICAgICAgICAgICAgICAgIChyZWR1Y2UgKGxhbWJkYSAocmVmZXJzIHJlZmVyZW5jZSlcbiAgICAgICAgICAgICAgICAgICAgICAoY29uaiByZWZlcnNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Om9wIDpyZWZlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Zm9ybSByZWZlcmVuY2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOm5hbWUgcmVmZXJlbmNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIDs7IExvb2sgdXAgYnkgcmVmZXJlbmNlIHN5bWJvbCBhbmQgYnkgc3ltYm9sXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOzsgYml0IGluIGEgZnV6eiByaWdodCBub3cuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpyZW5hbWUgKG9yIChnZXQgcmVuYW1lcyByZWZlcmVuY2UpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChnZXQgcmVuYW1lcyAobmFtZSByZWZlcmVuY2UpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOm5zIGlkfSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWVzKSkpKVxuICAgIHs6b3AgOnJlcXVpcmVcbiAgICAgOmFsaWFzIGFsaWFzXG4gICAgIDpucyBpZFxuICAgICA6cmVmZXIgcmVmZXJlbmNlc1xuICAgICA6Zm9ybSBmb3JtfSkpXG5cbihkZWZ1biBhbmFseXplLW5zXG4gIChlbnYgZm9ybSlcbiAgKGxldCogKChmb3JtcyAocmVzdCBmb3JtKSlcbiAgICAgICAgKG5hbWUgKGZpcnN0IGZvcm1zKSlcbiAgICAgICAgKGJvZHkgKHJlc3QgZm9ybXMpKVxuICAgICAgICA7OyBPcHRpb25hbCBkb2NzdHJpbmcgdGhhdCBmb2xsb3dzIG5hbWUgc3ltYm9sXG4gICAgICAgIChkb2MgKGlmIChzdHJpbmc/IChmaXJzdCBib2R5KSkgKGZpcnN0IGJvZHkpKSlcbiAgICAgICAgOzsgSWYgc2Vjb25kIGZvcm0gaXMgbm90IGEgc3RyaW5nIHRoYW4gdHJlYXQgaXRcbiAgICAgICAgOzsgYXMgcmVndWxhciByZWZlcmVuY2UgZm9ybVxuICAgICAgICAocmVmZXJlbmNlcyAocGFyc2UtcmVmZXJlbmNlcyAoaWYgZG9jXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAocmVzdCBib2R5KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9keSkpKVxuICAgICAgICAocmVxdWlyZW1lbnRzIChpZiAoOnJlcXVpcmUgcmVmZXJlbmNlcylcbiAgICAgICAgICAgICAgICAgICAgICAgKG1hcCBwYXJzZS1yZXF1aXJlICg6cmVxdWlyZSByZWZlcmVuY2VzKSkpKSlcbiAgICB7Om9wIDpuc1xuICAgICA6bmFtZSBuYW1lXG4gICAgIDpkb2MgZG9jXG4gICAgIDpyZXF1aXJlIChpZiByZXF1aXJlbWVudHNcbiAgICAgICAgICAgICAgICAodmVjIHJlcXVpcmVtZW50cykpXG4gICAgIDpmb3JtIGZvcm19KSlcbihpbnN0YWxsLXNwZWNpYWwhIDpucyBhbmFseXplLW5zKVxuXG5cbihkZWZ1biBhbmFseXplLWxpc3RcbiAgKGVudiBmb3JtKVxuICBcIlRha2VzIGZvcm0gb2YgbGlzdCB0eXBlIGFuZCBwZXJmb3JtcyBhIG1hY3JvZXhwYW5zaW9ucyB1bnRpbFxuICBmdWxseSBleHBhbmRlZC4gSWYgZXhwYW5zaW9uIGlzIGRpZmZlcmVudCBmcm9tIGEgZ2l2ZW4gZm9ybSB0aGVuXG4gIGV4cGFuZGVkIGZvcm0gaXMgaGFuZGVkIGJhY2sgdG8gYW5hbHl6ZXIuIElmIGZvcm0gaXMgc3BlY2lhbCBsaWtlXG4gIGRlZiwgZm4sIGxldC4uLiB0aGFuIGFzc29jaWF0ZWQgaXMgZGlzcGF0Y2hlZCwgb3RoZXJ3aXNlIGZvcm0gaXNcbiAgYW5hbHl6ZWQgYXMgaW52b2tlIGV4cHJlc3Npb24uXCJcbiAgKGxldCogKChleHBhbnNpb24gKG1hY3JvZXhwYW5kIGZvcm0gZW52KSlcbiAgICAgICAgOzsgU3BlY2lhbCBvcGVyYXRvcnMgbXVzdCBiZSBzeW1ib2xzIGFuZCBzdG9yZWQgaW4gdGhlXG4gICAgICAgIDs7ICoqc3BlY2lhbHMqKiBoYXNoIGJ5IG9wZXJhdG9yIG5hbWUuXG4gICAgICAgIChvcGVyYXRvciAoZmlyc3QgZm9ybSkpXG4gICAgICAgIChhbmFseXplciAoYW5kIChzeW1ib2w/IG9wZXJhdG9yKVxuICAgICAgICAgICAgICAgICAgICAgIChnZXQgKipzcGVjaWFscyoqIChuYW1lIG9wZXJhdG9yKSkpKSlcbiAgICA7OyBJZiBmb3JtIGlzIGV4cGFuZGVkIHBhc3MgaXQgYmFjayB0byBhbmFseXplIHNpbmNlIGl0IG1heSBub1xuICAgIDs7IGxvbmdlciBiZSBhIGxpc3QuIE90aGVyd2lzZSBlaXRoZXIgYW5hbHl6ZSBhcyBhIHNwZWNpYWwgZm9ybVxuICAgIDs7IChpZiBpdCdzIHN1Y2gpIG9yIGFzIGZ1bmN0aW9uIGludm9rYXRpb24gZm9ybS5cbiAgICAoY29uZCAoKG5vdCAoaWRlbnRpY2FsPyBleHBhbnNpb24gZm9ybSkpIChhbmFseXplIGVudiBleHBhbnNpb24pKVxuICAgICAgICAgIChhbmFseXplciAoYW5hbHl6ZS1zcGVjaWFsIGFuYWx5emVyIGVudiBleHBhbnNpb24pKVxuICAgICAgICAgIChlbHNlIChhbmFseXplLWludm9rZSBlbnYgZXhwYW5zaW9uKSkpKSlcblxuKGRlZnVuIGFuYWx5emUtdmVjdG9yXG4gIChlbnYgZm9ybSlcbiAgKGxldCogKChpdGVtcyAodmVjIChtYXAgKGxhbWJkYSAoJSkgKGFuYWx5emUgZW52ICUpKSBmb3JtKSkpKVxuICAgIHs6b3AgOnZlY3RvclxuICAgICA6Zm9ybSBmb3JtXG4gICAgIDppdGVtcyBpdGVtc30pKVxuXG4oZGVmdW4gYW5hbHl6ZS1kaWN0aW9uYXJ5XG4gIChlbnYgZm9ybSlcbiAgKGxldCogKChuYW1lcyAodmVjIChtYXAgKGxhbWJkYSAoJSkgKGFuYWx5emUgZW52ICUpKSAoa2V5cyBmb3JtKSkpKVxuICAgICAgICAodmFsdWVzICh2ZWMgKG1hcCAobGFtYmRhICglKSAoYW5hbHl6ZSBlbnYgJSkpICh2YWxzIGZvcm0pKSkpKVxuICAgIHs6b3AgOmRpY3Rpb25hcnlcbiAgICAgOmtleXMgbmFtZXNcbiAgICAgOnZhbHVlcyB2YWx1ZXNcbiAgICAgOmZvcm0gZm9ybX0pKVxuXG4oZGVmdW4gYW5hbHl6ZS1pbnZva2VcbiAgKGVudiBmb3JtKVxuICBcIlJldHVybnMgbm9kZSBvZiA6aW52b2tlIHR5cGUsIHJlcHJlc2VudGluZyBhIGZ1bmN0aW9uIGNhbGwuIEluXG4gIGFkZGl0aW9uIHRvIHJlZ3VsYXIgcHJvcGVydGllcyB0aGlzIG5vZGUgY29udGFpbnMgOmNhbGxlZSBtYXBwZWRcbiAgdG8gYSBub2RlIHRoYXQgaXMgYmVpbmcgaW52b2tlZCBhbmQgOnBhcmFtcyB0aGF0IGlzIGFuIHZlY3RvciBvZlxuICBwYXJhbXRlciBleHByZXNzaW9ucyB0aGF0IDpjYWxsZWUgaXMgaW52b2tlZCB3aXRoLlwiXG4gIChsZXQqICgoY2FsbGVlIChhbmFseXplIGVudiAoZmlyc3QgZm9ybSkpKVxuICAgICAgICAocGFyYW1zICh2ZWMgKG1hcCAobGFtYmRhICglKSAoYW5hbHl6ZSBlbnYgJSkpIChyZXN0IGZvcm0pKSkpKVxuICAgIHs6b3AgOmludm9rZVxuICAgICA6Y2FsbGVlIGNhbGxlZVxuICAgICA6cGFyYW1zIHBhcmFtc1xuICAgICA6Zm9ybSBmb3JtfSkpXG5cbihkZWZ1biBhbmFseXplLWNvbnN0YW50XG4gIChlbnYgZm9ybSlcbiAgXCJSZXR1cm5zIGEgbm9kZSByZXByZXNlbnRpbmcgYSBjb250c3RhbnQgdmFsdWUgd2hpY2ggaXNcbiAgbW9zdCBjZXJ0YWlubHkgYSBwcmltaXRpdmUgdmFsdWUgbGl0ZXJhbCB0aGlzIGZvcm0gY2FudGFpbnNcbiAgbm8gZXh0cmEgaW5mb3JtYXRpb24uXCJcbiAgezpvcCA6Y29uc3RhbnRcbiAgIDpmb3JtIGZvcm19KVxuXG4oZGVmdW4gYW5hbHl6ZVxuICAoJnJlc3QgYXJncylcbiAgXCJUYWtlcyBhIGhhc2ggcmVwcmVzZW50aW5nIGEgZ2l2ZW4gZW52aXJvbm1lbnQgYW5kIGBmb3JtYCB0byBiZVxuICBhbmFseXplZC4gRW52aXJvbm1lbnQgbWF5IGNvbnRhaW4gZm9sbG93aW5nIGVudHJpZXM6XG5cbiAgOmxvY2FscyAgLSBIYXNoIG9mIHRoZSBnaXZlbiBlbnZpcm9ubWVudHMgYmluZGluZ3MgbWFwcGVkeSBieSBiaW5kaW5nIG5hbWUuXG4gIDpjb250ZXh0IC0gT25lIG9mIHRoZSBmb2xsb3dpbmcgOnN0YXRlbWVudCwgOmV4cHJlc3Npb24sIDpyZXR1cm4uIFRoYXRcbiAgICAgICAgICAgICBpbmZvcm1hdGlvbiBpcyBpbmNsdWRlZCBpbiByZXN1bHRpbmcgbm9kZXMgYW5kIGlzIG1lYW50IGZvclxuICAgICAgICAgICAgIHdyaXRlciB0aGF0IG1heSBvdXRwdXQgZGlmZmVyZW50IGZvcm1zIGJhc2VkIG9uIGNvbnRleHQuXG4gIDpucyAgICAgIC0gTmFtZXNwYWNlIG9mIHRoZSBmb3JtcyBiZWluZyBhbmFseXplZC5cblxuICBBbmFseXplciBwZXJmb3JtcyBhbGwgdGhlIG1hY3JvICYgc3ludGF4IGV4cGFuc2lvbnMgYW5kIHRyYW5zZm9ybXMgZm9ybVxuICBpbnRvIEFTVCBub2RlIG9mIGFuIGV4cHJlc3Npb24uIEVhY2ggc3VjaCBub2RlIGNvbnRhaW5zIGF0IGxlYXN0IGZvbGxvd2luZ1xuICBwcm9wZXJ0aWVzOlxuXG4gIDpvcCAgIC0gT3BlcmF0aW9uIHR5cGUgb2YgdGhlIGV4cHJlc3Npb24uXG4gIDpmb3JtIC0gR2l2ZW4gZm9ybS5cblxuICBCYXNlZCBvbiA6b3Agbm9kZSBtYXkgY29udGFpbiBkaWZmZXJlbnQgc2V0IG9mIHByb3BlcnRpZXMuXCJcbiAgKGlmIChpZGVudGljYWw/IChjb3VudCBhcmdzKSAxKVxuICAgIChhbmFseXplIHs6bG9jYWxzIHt9XG4gICAgICAgICAgICAgIDpiaW5kaW5ncyBbXVxuICAgICAgICAgICAgICA6dG9wIHRydWV9IChmaXJzdCBhcmdzKSlcbiAgICAobGV0KiAoKGVudiAoZmlyc3QgYXJncykpIChmb3JtIChzZWNvbmQgYXJncykpKVxuICAgICAgKGNvbmQgKChuaWw/IGZvcm0pIChhbmFseXplLWNvbnN0YW50IGVudiBmb3JtKSlcbiAgICAgICAgICAgICgoc3ltYm9sPyBmb3JtKSAoYW5hbHl6ZS1zeW1ib2wgZW52IGZvcm0pKVxuICAgICAgICAgICAgKChsaXN0PyBmb3JtKSAoaWYgKGVtcHR5PyBmb3JtKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgKGFuYWx5emUtcXVvdGVkIGZvcm0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAoYW5hbHl6ZS1saXN0IGVudiBmb3JtKSkpXG4gICAgICAgICAgICAoKGRpY3Rpb25hcnk/IGZvcm0pIChhbmFseXplLWRpY3Rpb25hcnkgZW52IGZvcm0pKVxuICAgICAgICAgICAgKCh2ZWN0b3I/IGZvcm0pIChhbmFseXplLXZlY3RvciBlbnYgZm9ybSkpXG4gICAgICAgICAgICA7KHNldD8gZm9ybSkgKGFuYWx5emUtc2V0IGVudiBmb3JtIG5hbWUpXG4gICAgICAgICAgICAoKGtleXdvcmQ/IGZvcm0pIChhbmFseXplLWtleXdvcmQgZW52IGZvcm0pKVxuICAgICAgICAgICAgKGVsc2UgKGFuYWx5emUtY29uc3RhbnQgZW52IGZvcm0pKSkpKSlcbiJdfQ==
