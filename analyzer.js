{
    var _ns_ = {
            id: 'wisp.analyzer',
            doc: void 0
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
            var testø1 = analyze(env, first(formsø1));
            var consequentø1 = analyze(env, second(formsø1));
            var alternateø1 = analyze(env, third(formsø1));
            count(formsø1) < 2 ? syntaxError('Malformed if expression, too few operands', form) : void 0;
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
            var finalizerFormø1 = isList(tailø1) && isEqual(symbol(void 0, 'finally'), first(tailø1)) ? rest(tailø1) : void 0;
            var finalizerø1 = finalizerFormø1 ? analyzeBlock(env, finalizerFormø1) : void 0;
            var bodyFormø1 = finalizerø1 ? butlast(formsø1) : formsø1;
            var tailø2 = last(bodyFormø1);
            var handlerFormø1 = isList(tailø2) && isEqual(symbol(void 0, 'catch'), first(tailø2)) ? rest(tailø2) : void 0;
            var handlerø1 = handlerFormø1 ? conj({ 'name': analyze(env, first(handlerFormø1)) }, analyzeBlock(env, rest(handlerFormø1))) : void 0;
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
            var targetø1 = isSymbol(leftø1) ? analyzeSymbol(env, leftø1) : isList(leftø1) ? analyzeList(env, leftø1) : 'else' ? leftø1 : void 0;
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
            var paramsø1 = vec(map(function ($1) {
                    return analyze(env, $1);
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
                'property': fieldø1 ? conj(analyzeSpecial(analyzeIdentifier, env, fieldø1), { 'binding': void 0 }) : analyze(env, attributeø1)
            };
        }.call(this);
    };
installSpecial('aget', analyzeAget);
var parseDef = exports.parseDef = function parseDef() {
        switch (arguments.length) {
        case 1:
            var id = arguments[0];
            return { 'id': id };
        case 2:
            var id = arguments[0];
            var init = arguments[1];
            return {
                'id': id,
                'init': init
            };
        case 3:
            var id = arguments[0];
            var doc = arguments[1];
            var init = arguments[2];
            return {
                'id': id,
                'doc': doc,
                'init': init
            };
        default:
            throw RangeError('Wrong number of arguments passed');
        }
    };
var analyzeDef = exports.analyzeDef = function analyzeDef(env, form) {
        return function () {
            var paramsø1 = parseDef.apply(void 0, vec(rest(form)));
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
                'export': (env || 0)['top'] && !(metadataø1 || 0)['private'],
                'form': form
            };
        }.call(this);
    };
installSpecial('def', analyzeDef);
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
installSpecial('do', analyzeDo);
var analyzeSymbol = exports.analyzeSymbol = function analyzeSymbol(env, form) {
        return function () {
            var formsø1 = split(name(form), '.');
            var metadataø1 = meta(form);
            var startø1 = (metadataø1 || 0)['start'];
            var endø1 = (metadataø1 || 0)['end'];
            var expansionø1 = count(formsø1) > 1 ? list(symbol(void 0, 'aget'), withMeta(symbol(first(formsø1)), conj(metadataø1, {
                    'start': startø1,
                    'end': {
                        'line': (endø1 || 0)['line'],
                        'column': 1 + (startø1 || 0)['column'] + count(first(formsø1))
                    }
                })), list(symbol(void 0, 'quote'), withMeta(symbol(join('.', rest(formsø1))), conj(metadataø1, {
                    'end': endø1,
                    'start': {
                        'line': (startø1 || 0)['line'],
                        'column': 1 + (startø1 || 0)['column'] + count(first(formsø1))
                    }
                })))) : void 0;
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
        })() : void 0;
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
                })() : void 0;
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
installSpecial('let*', analyzeLet);
var analyzeLoop = exports.analyzeLoop = function analyzeLoop(env, form) {
        return conj(analyzeLet_(env, form, true), { 'op': 'loop' });
    };
installSpecial('loop*', analyzeLoop);
var analyzeRecur = exports.analyzeRecur = function analyzeRecur(env, form) {
        return function () {
            var paramsø1 = (env || 0)['params'];
            var formsø1 = vec(map(function ($1) {
                    return analyze(env, $1);
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
        return isSymbol(form) ? analyzeQuotedSymbol(form) : isKeyword(form) ? analyzeQuotedKeyword(form) : isList(form) ? analyzeQuotedList(form) : isVector(form) ? analyzeQuotedVector(form) : isDictionary(form) ? analyzeQuotedDictionary(form) : 'else' ? {
            'op': 'constant',
            'form': form
        } : void 0;
    };
var analyzeQuote = exports.analyzeQuote = function analyzeQuote(env, form) {
        return analyzeQuoted(second(form));
    };
installSpecial('quote', analyzeQuote);
var analyzeStatement = exports.analyzeStatement = function analyzeStatement(env, form) {
        return function () {
            var statementsø1 = (env || 0)['statements'] || [];
            var bindingsø1 = (env || 0)['bindings'] || [];
            var statementø1 = analyze(conj(env, { 'statements': void 0 }), form);
            var opø1 = (statementø1 || 0)['op'];
            var defsø1 = isEqual(opø1, 'def') ? [(statementø1 || 0)['var']] : 'else' ? void 0 : void 0;
            return conj(env, {
                'statements': conj(statementsø1, statementø1),
                'bindings': concat(bindingsø1, defsø1)
            });
        }.call(this);
    };
var analyzeBlock = exports.analyzeBlock = function analyzeBlock(env, form) {
        return function () {
            var bodyø1 = count(form) > 1 ? reduce(analyzeStatement, env, butlast(form)) : void 0;
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
            var variadicø1 = some(function ($1) {
                    return isEqual(symbol(void 0, '&'), $1);
                }, signatureø1);
            var paramsø1 = variadicø1 ? filter(function ($1) {
                    return !isEqual(symbol(void 0, '&'), $1);
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
            var formsø2 = isSymbol(first(formsø1)) ? formsø1 : cons(void 0, formsø1);
            var idø1 = first(formsø2);
            var bindingø1 = idø1 ? analyzeSpecial(analyzeDeclaration, env, idø1) : void 0;
            var bodyø1 = rest(formsø2);
            var overloadsø1 = isVector(first(bodyø1)) ? list(bodyø1) : isList(first(bodyø1)) && isVector(first(first(bodyø1))) ? bodyø1 : 'else' ? syntaxError('' + 'Malformed fn expression, ' + 'parameter declaration (' + prStr(first(bodyø1)) + ') must be a vector', form) : void 0;
            var scopeø1 = bindingø1 ? withBinding(subEnv(env), bindingø1) : subEnv(env);
            var methodsø1 = map(function ($1) {
                    return analyzeFnMethod(scopeø1, $1);
                }, vec(overloadsø1));
            var arityø1 = max.apply(void 0, map(function ($1) {
                    return ($1 || 0)['arity'];
                }, methodsø1));
            var variadicø1 = some(function ($1) {
                    return ($1 || 0)['variadic'];
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
            var paramsø1 = dictionary.apply(void 0, rest(requirementø1));
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
                }, [], namesø1) : void 0;
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
            var docø1 = isString(first(bodyø1)) ? first(bodyø1) : void 0;
            var referencesø1 = parseReferences(docø1 ? rest(bodyø1) : bodyø1);
            var requirementsø1 = (referencesø1 || 0)['require'] ? map(parseRequire, (referencesø1 || 0)['require']) : void 0;
            return {
                'op': 'ns',
                'name': nameø1,
                'doc': docø1,
                'require': requirementsø1 ? vec(requirementsø1) : void 0,
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
            return !(expansionø1 === form) ? analyze(env, expansionø1) : analyzerø1 ? analyzeSpecial(analyzerø1, env, expansionø1) : 'else' ? analyzeInvoke(env, expansionø1) : void 0;
        }.call(this);
    };
var analyzeVector = exports.analyzeVector = function analyzeVector(env, form) {
        return function () {
            var itemsø1 = vec(map(function ($1) {
                    return analyze(env, $1);
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
            var namesø1 = vec(map(function ($1) {
                    return analyze(env, $1);
                }, keys(form)));
            var valuesø1 = vec(map(function ($1) {
                    return analyze(env, $1);
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
            var paramsø1 = vec(map(function ($1) {
                    return analyze(env, $1);
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
        switch (arguments.length) {
        case 1:
            var form = arguments[0];
            return analyze({
                'locals': {},
                'bindings': [],
                'top': true
            }, form);
        case 2:
            var env = arguments[0];
            var form = arguments[1];
            return isNil(form) ? analyzeConstant(env, form) : isSymbol(form) ? analyzeSymbol(env, form) : isList(form) ? isEmpty(form) ? analyzeQuoted(form) : analyzeList(env, form) : isDictionary(form) ? analyzeDictionary(env, form) : isVector(form) ? analyzeVector(env, form) : isKeyword(form) ? analyzeKeyword(env, form) : 'else' ? analyzeConstant(env, form) : void 0;
        default:
            throw RangeError('Wrong number of arguments passed');
        }
    };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndpc3AvYW5hbHl6ZXIud2lzcCJdLCJuYW1lcyI6WyJfbnNfIiwiaWQiLCJkb2MiLCJtZXRhIiwid2l0aE1ldGEiLCJpc1N5bWJvbCIsImlzS2V5d29yZCIsImlzUXVvdGUiLCJzeW1ib2wiLCJuYW1lc3BhY2UiLCJuYW1lIiwicHJTdHIiLCJpc1VucXVvdGUiLCJpc1VucXVvdGVTcGxpY2luZyIsImlzTGlzdCIsImxpc3QiLCJjb25qIiwicGFydGl0aW9uIiwic2VxIiwiaXNFbXB0eSIsIm1hcCIsInZlYyIsImlzRXZlcnkiLCJjb25jYXQiLCJmaXJzdCIsInNlY29uZCIsInRoaXJkIiwicmVzdCIsImxhc3QiLCJidXRsYXN0IiwiaW50ZXJsZWF2ZSIsImNvbnMiLCJjb3VudCIsInNvbWUiLCJhc3NvYyIsInJlZHVjZSIsImZpbHRlciIsImlzU2VxIiwiaXNOaWwiLCJpc0RpY3Rpb25hcnkiLCJpc1ZlY3RvciIsImtleXMiLCJ2YWxzIiwiaXNTdHJpbmciLCJpc051bWJlciIsImlzQm9vbGVhbiIsImlzRGF0ZSIsImlzUmVQYXR0ZXJuIiwiaXNFdmVuIiwiaXNFcXVhbCIsIm1heCIsImRlYyIsImRpY3Rpb25hcnkiLCJzdWJzIiwiaW5jIiwibWFjcm9leHBhbmQiLCJzcGxpdCIsImpvaW4iLCJzeW50YXhFcnJvciIsImV4cG9ydHMiLCJtZXNzYWdlIiwiZm9ybSIsIm1ldGFkYXRhw7gxIiwibGluZcO4MSIsInVyacO4MSIsImNvbHVtbsO4MSIsImVycm9yw7gxIiwiU3ludGF4RXJyb3IiLCJsaW5lTnVtYmVyIiwibGluZSIsImNvbHVtbk51bWJlciIsImNvbHVtbiIsImZpbGVOYW1lIiwidXJpIiwiYW5hbHl6ZUtleXdvcmQiLCJlbnYiLCJfX3NwZWNpYWxzX18iLCJpbnN0YWxsU3BlY2lhbCIsIm9wIiwiYW5hbHl6ZXIiLCJhbmFseXplU3BlY2lhbCIsImFzdMO4MSIsImFuYWx5emVJZiIsImZvcm1zw7gxIiwidGVzdMO4MSIsImFuYWx5emUiLCJjb25zZXF1ZW50w7gxIiwiYWx0ZXJuYXRlw7gxIiwiYW5hbHl6ZVRocm93IiwiZXhwcmVzc2lvbsO4MSIsImFuYWx5emVUcnkiLCJ0YWlsw7gxIiwiZmluYWxpemVyRm9ybcO4MSIsImZpbmFsaXplcsO4MSIsImFuYWx5emVCbG9jayIsImJvZHlGb3Jtw7gxIiwidGFpbMO4MiIsImhhbmRsZXJGb3Jtw7gxIiwiaGFuZGxlcsO4MSIsImJvZHnDuDEiLCJzdWJFbnYiLCJhbmFseXplU2V0IiwibGVmdMO4MSIsInJpZ2h0w7gxIiwidGFyZ2V0w7gxIiwiYW5hbHl6ZVN5bWJvbCIsImFuYWx5emVMaXN0IiwidmFsdWXDuDEiLCJhbmFseXplTmV3IiwiY29uc3RydWN0b3LDuDEiLCJwYXJhbXPDuDEiLCIkMSIsImFuYWx5emVBZ2V0IiwiYXR0cmlidXRlw7gxIiwiZmllbGTDuDEiLCJhbmFseXplSWRlbnRpZmllciIsInBhcnNlRGVmIiwiaW5pdCIsImFuYWx5emVEZWYiLCJpZMO4MSIsImJpbmRpbmfDuDEiLCJhbmFseXplRGVjbGFyYXRpb24iLCJpbml0w7gxIiwiZG9jw7gxIiwiYW5hbHl6ZURvIiwiZXhwcmVzc2lvbnPDuDEiLCJzdGFydMO4MSIsImVuZMO4MSIsImV4cGFuc2lvbsO4MSIsInJlc29sdmVCaW5kaW5nIiwidW5yZXNvbHZlZEJpbmRpbmciLCJhbmFseXplU2hhZG93IiwiYW5hbHl6ZUJpbmRpbmciLCJhbmFseXplUGFyYW0iLCJ3aXRoQmluZGluZyIsIndpdGhQYXJhbSIsImFuYWx5emVMZXRfIiwiaXNMb29wIiwiYmluZGluZ3PDuDEiLCJpc1ZhbGlkQmluZGluZ3PDuDEiLCJfw7gxIiwic2NvcGXDuDEiLCIkMiIsImJpbmRpbmdzw7gyIiwiZXhwcmVzc2lvbnPDuDIiLCJhbmFseXplTGV0IiwiYW5hbHl6ZUxvb3AiLCJhbmFseXplUmVjdXIiLCJhbmFseXplUXVvdGVkTGlzdCIsImFuYWx5emVRdW90ZWQiLCJhbmFseXplUXVvdGVkVmVjdG9yIiwiYW5hbHl6ZVF1b3RlZERpY3Rpb25hcnkiLCJuYW1lc8O4MSIsInZhbHVlc8O4MSIsImFuYWx5emVRdW90ZWRTeW1ib2wiLCJhbmFseXplUXVvdGVkS2V5d29yZCIsImFuYWx5emVRdW90ZSIsImFuYWx5emVTdGF0ZW1lbnQiLCJzdGF0ZW1lbnRzw7gxIiwic3RhdGVtZW50w7gxIiwib3DDuDEiLCJkZWZzw7gxIiwicmVzdWx0w7gxIiwiYW5hbHl6ZUZuTWV0aG9kIiwic2lnbmF0dXJlw7gxIiwidmFyaWFkaWPDuDEiLCJhcml0ecO4MSIsImFuYWx5emVGbiIsImZvcm1zw7gyIiwib3ZlcmxvYWRzw7gxIiwibWV0aG9kc8O4MSIsInBhcnNlUmVmZXJlbmNlcyIsImZvcm1zIiwicmVmZXJlbmNlcyIsInBhcnNlUmVxdWlyZSIsInJlcXVpcmVtZW50w7gxIiwicmVuYW1lc8O4MSIsImFsaWFzw7gxIiwicmVmZXJlbmNlc8O4MSIsInJlZmVycyIsInJlZmVyZW5jZSIsImFuYWx5emVOcyIsIm5hbWXDuDEiLCJyZXF1aXJlbWVudHPDuDEiLCJvcGVyYXRvcsO4MSIsImFuYWx5emVyw7gxIiwiYW5hbHl6ZUludm9rZSIsImFuYWx5emVWZWN0b3IiLCJpdGVtc8O4MSIsImFuYWx5emVEaWN0aW9uYXJ5IiwiY2FsbGVlw7gxIiwiYW5hbHl6ZUNvbnN0YW50Il0sIm1hcHBpbmdzIjoiO0lBQUEsSUFBQ0EsSSxHQUFEO0FBQUEsWUFBQUMsRSxFQUFJLGVBQUo7QUFBQSxZQUFBQyxHLEVBQUEsSyxDQUFBO0FBQUEsVTs7UUFDOEJDLElBQUEsRyxTQUFBQSxJO1FBQUtDLFFBQUEsRyxTQUFBQSxRO1FBQVVDLFFBQUEsRyxTQUFBQSxRO1FBQVFDLFNBQUEsRyxTQUFBQSxTO1FBQ3ZCQyxPQUFBLEcsU0FBQUEsTztRQUFPQyxNQUFBLEcsU0FBQUEsTTtRQUFPQyxTQUFBLEcsU0FBQUEsUztRQUFVQyxJQUFBLEcsU0FBQUEsSTtRQUFLQyxLQUFBLEcsU0FBQUEsSztRQUM3QkMsU0FBQSxHLFNBQUFBLFM7UUFBU0MsaUJBQUEsRyxTQUFBQSxpQjs7UUFDSkMsTUFB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ZUFBTixDQUlHcEgsR0FKSCxFQUlPZCxJQUpQLEVBS0U7QUFBQTtBQUFBLFksZ0JBQUE7QUFBQSxZLFFBQ09BLElBRFA7QUFBQTtBQUFBLEtBTEYsQztBQVFBLElBQU13QixPQUFBLEdBQUExQixPQUFBLENBQUEwQixPQUFBLEdBQU4sU0FBTUEsT0FBTixHOzs7Z0JBa0JJeEIsSUFBQSxHO1lBQU0sT0FBQ3dCLE9BQUQsQ0FBUztBQUFBLGdCLFVBQVMsRUFBVDtBQUFBLGdCLFlBQ1csRUFEWDtBQUFBLGdCLFdBQUE7QUFBQSxhQUFULEVBRXFCeEIsSUFGckIsRTs7Z0JBR05jLEdBQUEsRztnQkFBSWQsSUFBQSxHO1lBQ0wsT0FBT3ZCLEtBQUQsQ0FBTXVCLElBQU4sQ0FBTixHQUFtQmtJLGVBQUQsQ0FBa0JwSCxHQUFsQixFQUFzQmQsSUFBdEIsQ0FBbEIsR0FDT3hELFFBQUQsQ0FBU3dELElBQVQsQyxHQUFnQjRDLGFBQUQsQ0FBZ0I5QixHQUFoQixFQUFvQmQsSUFBcEIsQyxHQUNkL0MsTUFBRCxDQUFPK0MsSUFBUCxDLEdBQWtCMUMsT0FBRCxDQUFRMEMsSUFBUixDQUFKLEdBQ0d3RixhQUFELENBQWdCeEYsSUFBaEIsQ0FERixHQUVHNkMsV0FBRCxDQUFjL0IsR0FBZCxFQUFrQmQsSUFBbEIsQyxHQUNkdEIsWUFBRCxDQUFhc0IsSUFBYixDLEdBQW9CZ0ksaUJBQUQsQ0FBb0JsSCxHQUFwQixFQUF3QmQsSUFBeEIsQyxHQUNsQnJCLFFBQUQsQ0FBU3FCLElBQVQsQyxHQUFnQjhILGFBQUQsQ0FBZ0JoSCxHQUFoQixFQUFvQmQsSUFBcEIsQyxHQUVkdkQsU0FBRCxDQUFVdUQsSUFBVixDLEdBQWlCYSxjQUFELENBQWlCQyxHQUFqQixFQUFxQmQsSUFBckIsQyxZQUNUa0ksZUFBRCxDQUFrQnBILEdBQWxCLEVBQXNCZCxJQUF0QixDLFNBVFosQzs7OztLQXRCSCIsInNvdXJjZXNDb250ZW50IjpbIihucyB3aXNwLmFuYWx5emVyXG4gICg6cmVxdWlyZSBbd2lzcC5hc3QgOnJlZmVyIFttZXRhIHdpdGgtbWV0YSBzeW1ib2w/IGtleXdvcmQ/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBxdW90ZT8gc3ltYm9sIG5hbWVzcGFjZSBuYW1lIHByLXN0clxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5xdW90ZT8gdW5xdW90ZS1zcGxpY2luZz9dXVxuICAgICAgICAgICAgW3dpc3Auc2VxdWVuY2UgOnJlZmVyIFtsaXN0PyBsaXN0IGNvbmogcGFydGl0aW9uIHNlcVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbXB0eT8gbWFwIHZlYyBldmVyeT8gY29uY2F0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0IHNlY29uZCB0aGlyZCByZXN0IGxhc3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnV0bGFzdCBpbnRlcmxlYXZlIGNvbnMgY291bnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc29tZSBhc3NvYyByZWR1Y2UgZmlsdGVyIHNlcT9dXVxuICAgICAgICAgICAgW3dpc3AucnVudGltZSA6cmVmZXIgW25pbD8gZGljdGlvbmFyeT8gdmVjdG9yPyBrZXlzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFscyBzdHJpbmc/IG51bWJlcj8gYm9vbGVhbj9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRlPyByZS1wYXR0ZXJuPyBldmVuPyA9IG1heFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlYyBkaWN0aW9uYXJ5IHN1YnMgaW5jIGRlY11dXG4gICAgICAgICAgICBbd2lzcC5leHBhbmRlciA6cmVmZXIgW21hY3JvZXhwYW5kXV1cbiAgICAgICAgICAgIFt3aXNwLnN0cmluZyA6cmVmZXIgW3NwbGl0IGpvaW5dXSkpXG5cbihkZWZuIHN5bnRheC1lcnJvclxuICBbbWVzc2FnZSBmb3JtXVxuICAobGV0IFttZXRhZGF0YSAobWV0YSBmb3JtKVxuICAgICAgICBsaW5lICg6bGluZSAoOnN0YXJ0IG1ldGFkYXRhKSlcbiAgICAgICAgdXJpICg6dXJpIG1ldGFkYXRhKVxuICAgICAgICBjb2x1bW4gKDpjb2x1bW4gKDpzdGFydCBtZXRhZGF0YSkpXG4gICAgICAgIGVycm9yIChTeW50YXhFcnJvciAoc3RyIG1lc3NhZ2UgXCJcXG5cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkZvcm06IFwiIChwci1zdHIgZm9ybSkgXCJcXG5cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlVSSTogXCIgdXJpIFwiXFxuXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJMaW5lOiBcIiBsaW5lIFwiXFxuXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2x1bW46IFwiIGNvbHVtbikpXVxuICAgIChzZXQhIGVycm9yLmxpbmVOdW1iZXIgbGluZSlcbiAgICAoc2V0ISBlcnJvci5saW5lIGxpbmUpXG4gICAgKHNldCEgZXJyb3IuY29sdW1uTnVtYmVyIGNvbHVtbilcbiAgICAoc2V0ISBlcnJvci5jb2x1bW4gY29sdW1uKVxuICAgIChzZXQhIGVycm9yLmZpbGVOYW1lIHVyaSlcbiAgICAoc2V0ISBlcnJvci51cmkgdXJpKVxuICAgICh0aHJvdyBlcnJvcikpKVxuXG5cbihkZWZuIGFuYWx5emUta2V5d29yZFxuICBcIkV4YW1wbGU6XG4gIChhbmFseXplLWtleXdvcmQge30gOmZvbykgPT4gezpvcCA6Y29uc3RhbnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gJzpmb29cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmVudiB7fX1cIlxuICBbZW52IGZvcm1dXG4gIHs6b3AgOmNvbnN0YW50XG4gICA6Zm9ybSBmb3JtfSlcblxuKGRlZiAqKnNwZWNpYWxzKioge30pXG5cbihkZWZuIGluc3RhbGwtc3BlY2lhbCFcbiAgW29wIGFuYWx5emVyXVxuICAoc2V0ISAoZ2V0ICoqc3BlY2lhbHMqKiAobmFtZSBvcCkpIGFuYWx5emVyKSlcblxuKGRlZm4gYW5hbHl6ZS1zcGVjaWFsXG4gIFthbmFseXplciBlbnYgZm9ybV1cbiAgKGxldCBbbWV0YWRhdGEgKG1ldGEgZm9ybSlcbiAgICAgICAgYXN0IChhbmFseXplciBlbnYgZm9ybSldXG4gICAgKGNvbmogezpzdGFydCAoOnN0YXJ0IG1ldGFkYXRhKVxuICAgICAgICAgICA6ZW5kICg6ZW5kIG1ldGFkYXRhKX1cbiAgICAgICAgICBhc3QpKSlcblxuKGRlZm4gYW5hbHl6ZS1pZlxuICBcIkV4YW1wbGU6XG4gIChhbmFseXplLWlmIHt9ICcoaWYgbW9uZGF5PyA6eWVwIDpub3BlKSkgPT4gezpvcCA6aWZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gJyhpZiBtb25kYXk/IDp5ZXAgOm5vcGUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDplbnYge31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnRlc3QgezpvcCA6dmFyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Zm9ybSAnbW9uZGF5P1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmluZm8gbmlsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ZW52IHt9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Y29uc2VxdWVudCB7Om9wIDpjb25zdGFudFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gJzp5ZXBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDp0eXBlIDprZXl3b3JkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ZW52IHt9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6YWx0ZXJuYXRlIHs6b3AgOmNvbnN0YW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtICc6bm9wZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6dHlwZSA6a2V5d29yZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ZW52IHt9fX1cIlxuICBbZW52IGZvcm1dXG4gIChsZXQgW2Zvcm1zIChyZXN0IGZvcm0pXG4gICAgICAgIHRlc3QgKGFuYWx5emUgZW52IChmaXJzdCBmb3JtcykpXG4gICAgICAgIGNvbnNlcXVlbnQgKGFuYWx5emUgZW52IChzZWNvbmQgZm9ybXMpKVxuICAgICAgICBhbHRlcm5hdGUgKGFuYWx5emUgZW52ICh0aGlyZCBmb3JtcykpXVxuICAgIChpZiAoPCAoY291bnQgZm9ybXMpIDIpXG4gICAgICAoc3ludGF4LWVycm9yIFwiTWFsZm9ybWVkIGlmIGV4cHJlc3Npb24sIHRvbyBmZXcgb3BlcmFuZHNcIiBmb3JtKSlcbiAgICB7Om9wIDppZlxuICAgICA6Zm9ybSBmb3JtXG4gICAgIDp0ZXN0IHRlc3RcbiAgICAgOmNvbnNlcXVlbnQgY29uc2VxdWVudFxuICAgICA6YWx0ZXJuYXRlIGFsdGVybmF0ZX0pKVxuXG4oaW5zdGFsbC1zcGVjaWFsISA6aWYgYW5hbHl6ZS1pZilcblxuKGRlZm4gYW5hbHl6ZS10aHJvd1xuICBcIkV4YW1wbGU6XG4gIChhbmFseXplLXRocm93IHt9ICcodGhyb3cgKEVycm9yIDpib29tKSkpID0+IHs6b3AgOnRocm93XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Zm9ybSAnKHRocm93IChFcnJvciA6Ym9vbSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6dGhyb3cgezpvcCA6aW52b2tlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpjYWxsZWUgezpvcCA6dmFyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtICdFcnJvclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6aW5mbyBuaWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmVudiB7fX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnBhcmFtcyBbezpvcCA6Y29uc3RhbnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDp0eXBlIDprZXl3b3JkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Zm9ybSAnOmJvb21cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDplbnYge319XX19XCJcbiAgW2VudiBmb3JtXVxuICAobGV0IFtleHByZXNzaW9uIChhbmFseXplIGVudiAoc2Vjb25kIGZvcm0pKV1cbiAgICB7Om9wIDp0aHJvd1xuICAgICA6Zm9ybSBmb3JtXG4gICAgIDp0aHJvdyBleHByZXNzaW9ufSkpXG5cbihpbnN0YWxsLXNwZWNpYWwhIDp0aHJvdyBhbmFseXplLXRocm93KVxuXG4oZGVmbiBhbmFseXplLXRyeVxuICBbZW52IGZvcm1dXG4gIChsZXQgW2Zvcm1zICh2ZWMgKHJlc3QgZm9ybSkpXG5cbiAgICAgICAgOzsgRmluYWxseVxuICAgICAgICB0YWlsIChsYXN0IGZvcm1zKVxuICAgICAgICBmaW5hbGl6ZXItZm9ybSAoaWYgKGFuZCAobGlzdD8gdGFpbClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKD0gJ2ZpbmFsbHkgKGZpcnN0IHRhaWwpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAocmVzdCB0YWlsKSlcbiAgICAgICAgZmluYWxpemVyIChpZiBmaW5hbGl6ZXItZm9ybVxuICAgICAgICAgICAgICAgICAgICAoYW5hbHl6ZS1ibG9jayBlbnYgZmluYWxpemVyLWZvcm0pKVxuXG4gICAgICAgIDs7IGNhdGNoXG4gICAgICAgIGJvZHktZm9ybSAoaWYgZmluYWxpemVyXG4gICAgICAgICAgICAgICAgICAgIChidXRsYXN0IGZvcm1zKVxuICAgICAgICAgICAgICAgICAgICBmb3JtcylcblxuICAgICAgICB0YWlsIChsYXN0IGJvZHktZm9ybSlcbiAgICAgICAgaGFuZGxlci1mb3JtIChpZiAoYW5kIChsaXN0PyB0YWlsKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKD0gJ2NhdGNoIChmaXJzdCB0YWlsKSkpXG4gICAgICAgICAgICAgICAgICAgICAgIChyZXN0IHRhaWwpKVxuICAgICAgICBoYW5kbGVyIChpZiBoYW5kbGVyLWZvcm1cbiAgICAgICAgICAgICAgICAgIChjb25qIHs6bmFtZSAoYW5hbHl6ZSBlbnYgKGZpcnN0IGhhbmRsZXItZm9ybSkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgKGFuYWx5emUtYmxvY2sgZW52IChyZXN0IGhhbmRsZXItZm9ybSkpKSlcblxuICAgICAgICA7OyBUcnlcbiAgICAgICAgYm9keSAoaWYgaGFuZGxlci1mb3JtXG4gICAgICAgICAgICAgICAoYW5hbHl6ZS1ibG9jayAoc3ViLWVudiBlbnYpIChidXRsYXN0IGJvZHktZm9ybSkpXG4gICAgICAgICAgICAgICAoYW5hbHl6ZS1ibG9jayAoc3ViLWVudiBlbnYpIGJvZHktZm9ybSkpXVxuICAgIHs6b3AgOnRyeVxuICAgICA6Zm9ybSBmb3JtXG4gICAgIDpib2R5IGJvZHlcbiAgICAgOmhhbmRsZXIgaGFuZGxlclxuICAgICA6ZmluYWxpemVyIGZpbmFsaXplcn0pKVxuXG4oaW5zdGFsbC1zcGVjaWFsISA6dHJ5IGFuYWx5emUtdHJ5KVxuXG4oZGVmbiBhbmFseXplLXNldCFcbiAgW2VudiBmb3JtXVxuICAobGV0IFtib2R5IChyZXN0IGZvcm0pXG4gICAgICAgIGxlZnQgKGZpcnN0IGJvZHkpXG4gICAgICAgIHJpZ2h0IChzZWNvbmQgYm9keSlcbiAgICAgICAgdGFyZ2V0IChjb25kIChzeW1ib2w/IGxlZnQpIChhbmFseXplLXN5bWJvbCBlbnYgbGVmdClcbiAgICAgICAgICAgICAgICAgICAgIChsaXN0PyBsZWZ0KSAoYW5hbHl6ZS1saXN0IGVudiBsZWZ0KVxuICAgICAgICAgICAgICAgICAgICAgOmVsc2UgbGVmdClcbiAgICAgICAgdmFsdWUgKGFuYWx5emUgZW52IHJpZ2h0KV1cbiAgICB7Om9wIDpzZXQhXG4gICAgIDp0YXJnZXQgdGFyZ2V0XG4gICAgIDp2YWx1ZSB2YWx1ZVxuICAgICA6Zm9ybSBmb3JtfSkpXG4oaW5zdGFsbC1zcGVjaWFsISA6c2V0ISBhbmFseXplLXNldCEpXG5cbihkZWZuIGFuYWx5emUtbmV3XG4gIFtlbnYgZm9ybV1cbiAgKGxldCBbYm9keSAocmVzdCBmb3JtKVxuICAgICAgICBjb25zdHJ1Y3RvciAoYW5hbHl6ZSBlbnYgKGZpcnN0IGJvZHkpKVxuICAgICAgICBwYXJhbXMgKHZlYyAobWFwICMoYW5hbHl6ZSBlbnYgJSkgKHJlc3QgYm9keSkpKV1cbiAgICB7Om9wIDpuZXdcbiAgICAgOmNvbnN0cnVjdG9yIGNvbnN0cnVjdG9yXG4gICAgIDpmb3JtIGZvcm1cbiAgICAgOnBhcmFtcyBwYXJhbXN9KSlcbihpbnN0YWxsLXNwZWNpYWwhIDpuZXcgYW5hbHl6ZS1uZXcpXG5cbihkZWZuIGFuYWx5emUtYWdldFxuICBbZW52IGZvcm1dXG4gIChsZXQgW2JvZHkgKHJlc3QgZm9ybSlcbiAgICAgICAgdGFyZ2V0IChhbmFseXplIGVudiAoZmlyc3QgYm9keSkpXG4gICAgICAgIGF0dHJpYnV0ZSAoc2Vjb25kIGJvZHkpXG4gICAgICAgIGZpZWxkIChhbmQgKHF1b3RlPyBhdHRyaWJ1dGUpXG4gICAgICAgICAgICAgICAgICAgKHN5bWJvbD8gKHNlY29uZCBhdHRyaWJ1dGUpKVxuICAgICAgICAgICAgICAgICAgIChzZWNvbmQgYXR0cmlidXRlKSldXG4gICAgKGlmIChuaWw/IGF0dHJpYnV0ZSlcbiAgICAgIChzeW50YXgtZXJyb3IgXCJNYWxmb3JtZWQgYWdldCBleHByZXNzaW9uIGV4cGVjdGVkIChhZ2V0IG9iamVjdCBtZW1iZXIpXCJcbiAgICAgICAgICAgICAgICAgICAgZm9ybSlcbiAgICAgIHs6b3AgOm1lbWJlci1leHByZXNzaW9uXG4gICAgICAgOmNvbXB1dGVkIChub3QgZmllbGQpXG4gICAgICAgOmZvcm0gZm9ybVxuICAgICAgIDp0YXJnZXQgdGFyZ2V0XG4gICAgICAgOzsgSWYgZmllbGQgaXMgYSBxdW90ZWQgc3ltYm9sIHRoZXJlJ3Mgbm8gbmVlZCB0byByZXNvbHZlXG4gICAgICAgOzsgaXQgZm9yIGluZm9cbiAgICAgICA6cHJvcGVydHkgKGlmIGZpZWxkXG4gICAgICAgICAgICAgICAgICAgKGNvbmogKGFuYWx5emUtc3BlY2lhbCBhbmFseXplLWlkZW50aWZpZXIgZW52IGZpZWxkKVxuICAgICAgICAgICAgICAgICAgICAgICAgIHs6YmluZGluZyBuaWx9KVxuICAgICAgICAgICAgICAgICAgIChhbmFseXplIGVudiBhdHRyaWJ1dGUpKX0pKSlcbihpbnN0YWxsLXNwZWNpYWwhIDphZ2V0IGFuYWx5emUtYWdldClcblxuKGRlZm4gcGFyc2UtZGVmXG4gIChbaWRdIHs6aWQgaWR9KVxuICAoW2lkIGluaXRdIHs6aWQgaWQgOmluaXQgaW5pdH0pXG4gIChbaWQgZG9jIGluaXRdIHs6aWQgaWQgOmRvYyBkb2MgOmluaXQgaW5pdH0pKVxuXG4oZGVmbiBhbmFseXplLWRlZlxuICBbZW52IGZvcm1dXG4gIChsZXQgW3BhcmFtcyAoYXBwbHkgcGFyc2UtZGVmICh2ZWMgKHJlc3QgZm9ybSkpKVxuICAgICAgICBpZCAoOmlkIHBhcmFtcylcbiAgICAgICAgbWV0YWRhdGEgKG1ldGEgaWQpXG5cbiAgICAgICAgYmluZGluZyAoYW5hbHl6ZS1zcGVjaWFsIGFuYWx5emUtZGVjbGFyYXRpb24gZW52IGlkKVxuXG4gICAgICAgIGluaXQgKGFuYWx5emUgZW52ICg6aW5pdCBwYXJhbXMpKVxuXG4gICAgICAgIGRvYyAob3IgKDpkb2MgcGFyYW1zKVxuICAgICAgICAgICAgICAgICg6ZG9jIG1ldGFkYXRhKSldXG4gICAgezpvcCA6ZGVmXG4gICAgIDpkb2MgZG9jXG4gICAgIDppZCBiaW5kaW5nXG4gICAgIDppbml0IGluaXRcbiAgICAgOmV4cG9ydCAoYW5kICg6dG9wIGVudilcbiAgICAgICAgICAgICAgICAgIChub3QgKDpwcml2YXRlIG1ldGFkYXRhKSkpXG4gICAgIDpmb3JtIGZvcm19KSlcbihpbnN0YWxsLXNwZWNpYWwhIDpkZWYgYW5hbHl6ZS1kZWYpXG5cbihkZWZuIGFuYWx5emUtZG9cbiAgW2VudiBmb3JtXVxuICAobGV0IFtleHByZXNzaW9ucyAocmVzdCBmb3JtKVxuICAgICAgICBib2R5IChhbmFseXplLWJsb2NrIGVudiBleHByZXNzaW9ucyldXG4gICAgKGNvbmogYm9keSB7Om9wIDpkb1xuICAgICAgICAgICAgICAgIDpmb3JtIGZvcm19KSkpXG4oaW5zdGFsbC1zcGVjaWFsISA6ZG8gYW5hbHl6ZS1kbylcblxuKGRlZm4gYW5hbHl6ZS1zeW1ib2xcbiAgXCJTeW1ib2wgYW5hbHl6ZXIgYWxzbyBkb2VzIHN5bnRheCBkZXN1Z2FyaW5nIGZvciB0aGUgc3ltYm9sc1xuICBsaWtlIGZvby5iYXIuYmF6IHByb2R1Y2luZyAoYWdldCBmb28gJ2Jhci5iYXopIGZvcm0uIFRoaXMgZW5hYmxlc1xuICByZW5hbWluZyBvZiBzaGFkb3dlZCBzeW1ib2xzLlwiXG4gIFtlbnYgZm9ybV1cbiAgKGxldCBbZm9ybXMgKHNwbGl0IChuYW1lIGZvcm0pIFxcLilcbiAgICAgICAgbWV0YWRhdGEgKG1ldGEgZm9ybSlcbiAgICAgICAgc3RhcnQgKDpzdGFydCBtZXRhZGF0YSlcbiAgICAgICAgZW5kICg6ZW5kIG1ldGFkYXRhKVxuICAgICAgICBleHBhbnNpb24gKGlmICg+IChjb3VudCBmb3JtcykgMSlcbiAgICAgICAgICAgICAgICAgICAobGlzdCAnYWdldFxuICAgICAgICAgICAgICAgICAgICAgICAgICh3aXRoLW1ldGEgKHN5bWJvbCAoZmlyc3QgZm9ybXMpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgKGNvbmogbWV0YWRhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHs6c3RhcnQgc3RhcnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ZW5kIHs6bGluZSAoOmxpbmUgZW5kKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpjb2x1bW4gKCsgMSAoOmNvbHVtbiBzdGFydCkgKGNvdW50IChmaXJzdCBmb3JtcykpKX19KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAobGlzdCAncXVvdGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAod2l0aC1tZXRhIChzeW1ib2wgKGpvaW4gXFwuIChyZXN0IGZvcm1zKSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoY29uaiBtZXRhZGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgezplbmQgZW5kXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnN0YXJ0IHs6bGluZSAoOmxpbmUgc3RhcnQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Y29sdW1uICgrIDEgKDpjb2x1bW4gc3RhcnQpIChjb3VudCAoZmlyc3QgZm9ybXMpKSl9fSkpKSkpXVxuICAgIChpZiBleHBhbnNpb25cbiAgICAgIChhbmFseXplIGVudiAod2l0aC1tZXRhIGV4cGFuc2lvbiAobWV0YSBmb3JtKSkpXG4gICAgICAoYW5hbHl6ZS1zcGVjaWFsIGFuYWx5emUtaWRlbnRpZmllciBlbnYgZm9ybSkpKSlcblxuKGRlZm4gYW5hbHl6ZS1pZGVudGlmaWVyXG4gIFtlbnYgZm9ybV1cbiAgezpvcCA6dmFyXG4gICA6dHlwZSA6aWRlbnRpZmllclxuICAgOmZvcm0gZm9ybVxuICAgOnN0YXJ0ICg6c3RhcnQgKG1ldGEgZm9ybSkpXG4gICA6ZW5kICg6ZW5kIChtZXRhIGZvcm0pKVxuICAgOmJpbmRpbmcgKHJlc29sdmUtYmluZGluZyBlbnYgZm9ybSl9KVxuXG4oZGVmbiB1bnJlc29sdmVkLWJpbmRpbmdcbiAgW2VudiBmb3JtXVxuICB7Om9wIDp1bnJlc29sdmVkLWJpbmRpbmdcbiAgIDp0eXBlIDp1bnJlc29sdmVkLWJpbmRpbmdcbiAgIDppZGVudGlmaWVyIHs6dHlwZSA6aWRlbnRpZmllclxuICAgICAgICAgICAgICAgIDpmb3JtIChzeW1ib2wgKG5hbWVzcGFjZSBmb3JtKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG5hbWUgZm9ybSkpfVxuICAgOnN0YXJ0ICg6c3RhcnQgKG1ldGEgZm9ybSkpXG4gICA6ZW5kICg6ZW5kIChtZXRhIGZvcm0pKX0pXG5cbihkZWZuIHJlc29sdmUtYmluZGluZ1xuICBbZW52IGZvcm1dXG4gIChvciAoZ2V0ICg6bG9jYWxzIGVudikgKG5hbWUgZm9ybSkpXG4gICAgICAoZ2V0ICg6ZW5jbG9zZWQgZW52KSAobmFtZSBmb3JtKSlcbiAgICAgICh1bnJlc29sdmVkLWJpbmRpbmcgZW52IGZvcm0pKSlcblxuKGRlZm4gYW5hbHl6ZS1zaGFkb3dcbiAgW2VudiBpZF1cbiAgKGxldCBbYmluZGluZyAocmVzb2x2ZS1iaW5kaW5nIGVudiBpZCldXG4gICAgezpkZXB0aCAoaW5jIChvciAoOmRlcHRoIGJpbmRpbmcpIDApKVxuICAgICA6c2hhZG93IGJpbmRpbmd9KSlcblxuKGRlZm4gYW5hbHl6ZS1iaW5kaW5nXG4gIFtlbnYgZm9ybV1cbiAgKGxldCBbaWQgKGZpcnN0IGZvcm0pXG4gICAgICAgIGJvZHkgKHNlY29uZCBmb3JtKV1cbiAgICAoY29uaiAoYW5hbHl6ZS1zaGFkb3cgZW52IGlkKVxuICAgICAgICAgIHs6b3AgOmJpbmRpbmdcbiAgICAgICAgICAgOnR5cGUgOmJpbmRpbmdcbiAgICAgICAgICAgOmlkIGlkXG4gICAgICAgICAgIDppbml0IChhbmFseXplIGVudiBib2R5KVxuICAgICAgICAgICA6Zm9ybSBmb3JtfSkpKVxuXG4oZGVmbiBhbmFseXplLWRlY2xhcmF0aW9uXG4gIFtlbnYgZm9ybV1cbiAgKGFzc2VydCAobm90IChvciAobmFtZXNwYWNlIGZvcm0pXG4gICAgICAgICAgICAgICAgICAgKDwgMSAoY291bnQgKHNwbGl0IFxcLiAoc3RyIGZvcm0pKSkpKSkpXG4gIChjb25qIChhbmFseXplLXNoYWRvdyBlbnYgZm9ybSlcbiAgICAgICAgezpvcCA6dmFyXG4gICAgICAgICA6dHlwZSA6aWRlbnRpZmllclxuICAgICAgICAgOmRlcHRoIDBcbiAgICAgICAgIDppZCBmb3JtXG4gICAgICAgICA6Zm9ybSBmb3JtfSkpXG5cbihkZWZuIGFuYWx5emUtcGFyYW1cbiAgW2VudiBmb3JtXVxuICAoY29uaiAoYW5hbHl6ZS1zaGFkb3cgZW52IGZvcm0pXG4gICAgICAgIHs6b3AgOnBhcmFtXG4gICAgICAgICA6dHlwZSA6cGFyYW1ldGVyXG4gICAgICAgICA6aWQgZm9ybVxuICAgICAgICAgOmZvcm0gZm9ybVxuICAgICAgICAgOnN0YXJ0ICg6c3RhcnQgKG1ldGEgZm9ybSkpXG4gICAgICAgICA6ZW5kICg6ZW5kIChtZXRhIGZvcm0pKX0pKVxuXG4oZGVmbiB3aXRoLWJpbmRpbmdcbiAgXCJSZXR1cm5zIGVuaGFuY2VkIGVudmlyb25tZW50IHdpdGggYWRkaXRpb25hbCBiaW5kaW5nIGFkZGVkXG4gIHRvIHRoZSA6YmluZGluZ3MgYW5kIDpzY29wZVwiXG4gIFtlbnYgZm9ybV1cbiAgKGNvbmogZW52IHs6bG9jYWxzIChhc3NvYyAoOmxvY2FscyBlbnYpIChuYW1lICg6aWQgZm9ybSkpIGZvcm0pXG4gICAgICAgICAgICAgOmJpbmRpbmdzIChjb25qICg6YmluZGluZ3MgZW52KSBmb3JtKX0pKVxuXG4oZGVmbiB3aXRoLXBhcmFtXG4gIFtlbnYgZm9ybV1cbiAgKGNvbmogKHdpdGgtYmluZGluZyBlbnYgZm9ybSlcbiAgICAgICAgezpwYXJhbXMgKGNvbmogKDpwYXJhbXMgZW52KSBmb3JtKX0pKVxuXG4oZGVmbiBzdWItZW52XG4gIFtlbnZdXG4gIHs6ZW5jbG9zZWQgKGNvbmoge31cbiAgICAgICAgICAgICAgICAgICAoOmVuY2xvc2VkIGVudilcbiAgICAgICAgICAgICAgICAgICAoOmxvY2FscyBlbnYpKVxuICAgOmxvY2FscyB7fVxuICAgOmJpbmRpbmdzIFtdXG4gICA6cGFyYW1zIChvciAoOnBhcmFtcyBlbnYpIFtdKX0pXG5cblxuKGRlZm4gYW5hbHl6ZS1sZXQqXG4gIFwiVGFrZXMgbGV0IGZvcm0gYW5kIGVuaGFuY2VzIGl0J3MgbWV0YWRhdGEgdmlhIGFuYWx5emVkXG4gIGluZm9cIlxuICBbZW52IGZvcm0gaXMtbG9vcF1cbiAgKGxldCBbZXhwcmVzc2lvbnMgKHJlc3QgZm9ybSlcbiAgICAgICAgYmluZGluZ3MgKGZpcnN0IGV4cHJlc3Npb25zKVxuICAgICAgICBib2R5IChyZXN0IGV4cHJlc3Npb25zKVxuXG4gICAgICAgIHZhbGlkLWJpbmRpbmdzPyAoYW5kICh2ZWN0b3I/IGJpbmRpbmdzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZXZlbj8gKGNvdW50IGJpbmRpbmdzKSkpXG5cbiAgICAgICAgXyAoYXNzZXJ0IHZhbGlkLWJpbmRpbmdzP1xuICAgICAgICAgICAgICAgICAgXCJiaW5kaW5ncyBtdXN0IGJlIHZlY3RvciBvZiBldmVuIG51bWJlciBvZiBlbGVtZW50c1wiKVxuXG4gICAgICAgIHNjb3BlIChyZWR1Y2UgIyh3aXRoLWJpbmRpbmcgJTEgKGFuYWx5emUtYmluZGluZyAlMSAlMikpXG4gICAgICAgICAgICAgICAgICAgICAgKHN1Yi1lbnYgZW52KVxuICAgICAgICAgICAgICAgICAgICAgIChwYXJ0aXRpb24gMiBiaW5kaW5ncykpXG5cbiAgICAgICAgYmluZGluZ3MgKDpiaW5kaW5ncyBzY29wZSlcblxuICAgICAgICBleHByZXNzaW9ucyAoYW5hbHl6ZS1ibG9jayAoaWYgaXMtbG9vcFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChjb25qIHNjb3BlIHs6cGFyYW1zIGJpbmRpbmdzfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY29wZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9keSldXG5cbiAgICB7Om9wIDpsZXRcbiAgICAgOmZvcm0gZm9ybVxuICAgICA6c3RhcnQgKDpzdGFydCAobWV0YSBmb3JtKSlcbiAgICAgOmVuZCAoOmVuZCAobWV0YSBmb3JtKSlcbiAgICAgOmJpbmRpbmdzIGJpbmRpbmdzXG4gICAgIDpzdGF0ZW1lbnRzICg6c3RhdGVtZW50cyBleHByZXNzaW9ucylcbiAgICAgOnJlc3VsdCAoOnJlc3VsdCBleHByZXNzaW9ucyl9KSlcblxuKGRlZm4gYW5hbHl6ZS1sZXRcbiAgW2VudiBmb3JtXVxuICAoYW5hbHl6ZS1sZXQqIGVudiBmb3JtIGZhbHNlKSlcbihpbnN0YWxsLXNwZWNpYWwhIDpsZXQqIGFuYWx5emUtbGV0KVxuXG4oZGVmbiBhbmFseXplLWxvb3BcbiAgW2VudiBmb3JtXVxuICAoY29uaiAoYW5hbHl6ZS1sZXQqIGVudiBmb3JtIHRydWUpIHs6b3AgOmxvb3B9KSlcbihpbnN0YWxsLXNwZWNpYWwhIDpsb29wKiBhbmFseXplLWxvb3ApXG5cblxuKGRlZm4gYW5hbHl6ZS1yZWN1clxuICBbZW52IGZvcm1dXG4gIChsZXQgW3BhcmFtcyAoOnBhcmFtcyBlbnYpXG4gICAgICAgIGZvcm1zICh2ZWMgKG1hcCAjKGFuYWx5emUgZW52ICUpIChyZXN0IGZvcm0pKSldXG5cbiAgICAoaWYgKD0gKGNvdW50IHBhcmFtcylcbiAgICAgICAgICAgKGNvdW50IGZvcm1zKSlcbiAgICAgIHs6b3AgOnJlY3VyXG4gICAgICAgOmZvcm0gZm9ybVxuICAgICAgIDpwYXJhbXMgZm9ybXN9XG4gICAgICAoc3ludGF4LWVycm9yIFwiUmVjdXJzIHdpdGggd3JvbmcgbnVtYmVyIG9mIGFyZ3VtZW50c1wiXG4gICAgICAgICAgICAgICAgICAgIGZvcm0pKSkpXG4oaW5zdGFsbC1zcGVjaWFsISA6cmVjdXIgYW5hbHl6ZS1yZWN1cilcblxuKGRlZm4gYW5hbHl6ZS1xdW90ZWQtbGlzdFxuICBbZm9ybV1cbiAgezpvcCA6bGlzdFxuICAgOml0ZW1zIChtYXAgYW5hbHl6ZS1xdW90ZWQgKHZlYyBmb3JtKSlcbiAgIDpmb3JtIGZvcm1cbiAgIDpzdGFydCAoOnN0YXJ0IChtZXRhIGZvcm0pKVxuICAgOmVuZCAoOmVuZCAobWV0YSBmb3JtKSl9KVxuXG4oZGVmbiBhbmFseXplLXF1b3RlZC12ZWN0b3JcbiAgW2Zvcm1dXG4gIHs6b3AgOnZlY3RvclxuICAgOml0ZW1zIChtYXAgYW5hbHl6ZS1xdW90ZWQgZm9ybSlcbiAgIDpmb3JtIGZvcm1cbiAgIDpzdGFydCAoOnN0YXJ0IChtZXRhIGZvcm0pKVxuICAgOmVuZCAoOmVuZCAobWV0YSBmb3JtKSl9KVxuXG4oZGVmbiBhbmFseXplLXF1b3RlZC1kaWN0aW9uYXJ5XG4gIFtmb3JtXVxuICAobGV0IFtuYW1lcyAodmVjIChtYXAgYW5hbHl6ZS1xdW90ZWQgKGtleXMgZm9ybSkpKVxuICAgICAgICB2YWx1ZXMgKHZlYyAobWFwIGFuYWx5emUtcXVvdGVkICh2YWxzIGZvcm0pKSldXG4gICAgezpvcCA6ZGljdGlvbmFyeVxuICAgICA6Zm9ybSBmb3JtXG4gICAgIDprZXlzIG5hbWVzXG4gICAgIDp2YWx1ZXMgdmFsdWVzXG4gICAgIDpzdGFydCAoOnN0YXJ0IChtZXRhIGZvcm0pKVxuICAgICA6ZW5kICg6ZW5kIChtZXRhIGZvcm0pKX0pKVxuXG4oZGVmbiBhbmFseXplLXF1b3RlZC1zeW1ib2xcbiAgW2Zvcm1dXG4gIHs6b3AgOnN5bWJvbFxuICAgOm5hbWUgKG5hbWUgZm9ybSlcbiAgIDpuYW1lc3BhY2UgKG5hbWVzcGFjZSBmb3JtKVxuICAgOmZvcm0gZm9ybX0pXG5cbihkZWZuIGFuYWx5emUtcXVvdGVkLWtleXdvcmRcbiBbZm9ybV1cbiAgezpvcCA6a2V5d29yZFxuICAgOm5hbWUgKG5hbWUgZm9ybSlcbiAgIDpuYW1lc3BhY2UgKG5hbWVzcGFjZSBmb3JtKVxuICAgOmZvcm0gZm9ybX0pXG5cbihkZWZuIGFuYWx5emUtcXVvdGVkXG4gIFtmb3JtXVxuICAoY29uZCAoc3ltYm9sPyBmb3JtKSAoYW5hbHl6ZS1xdW90ZWQtc3ltYm9sIGZvcm0pXG4gICAgICAgIChrZXl3b3JkPyBmb3JtKSAoYW5hbHl6ZS1xdW90ZWQta2V5d29yZCBmb3JtKVxuICAgICAgICAobGlzdD8gZm9ybSkgKGFuYWx5emUtcXVvdGVkLWxpc3QgZm9ybSlcbiAgICAgICAgKHZlY3Rvcj8gZm9ybSkgKGFuYWx5emUtcXVvdGVkLXZlY3RvciBmb3JtKVxuICAgICAgICAoZGljdGlvbmFyeT8gZm9ybSkgKGFuYWx5emUtcXVvdGVkLWRpY3Rpb25hcnkgZm9ybSlcbiAgICAgICAgOmVsc2UgezpvcCA6Y29uc3RhbnRcbiAgICAgICAgICAgICAgIDpmb3JtIGZvcm19KSlcblxuKGRlZm4gYW5hbHl6ZS1xdW90ZVxuICBcIkV4YW1wbGVzOlxuICAgKGFuYWx5emUtcXVvdGUge30gJyhxdW90ZSBmb28pKSA9PiB7Om9wIDpjb25zdGFudFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gJ2Zvb1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmVudiBlbnZ9XCJcbiAgW2VudiBmb3JtXVxuICAoYW5hbHl6ZS1xdW90ZWQgKHNlY29uZCBmb3JtKSkpXG4oaW5zdGFsbC1zcGVjaWFsISA6cXVvdGUgYW5hbHl6ZS1xdW90ZSlcblxuKGRlZm4gYW5hbHl6ZS1zdGF0ZW1lbnRcbiAgW2VudiBmb3JtXVxuICAobGV0IFtzdGF0ZW1lbnRzIChvciAoOnN0YXRlbWVudHMgZW52KSBbXSlcbiAgICAgICAgYmluZGluZ3MgKG9yICg6YmluZGluZ3MgZW52KSBbXSlcbiAgICAgICAgc3RhdGVtZW50IChhbmFseXplIChjb25qIGVudiB7OnN0YXRlbWVudHMgbmlsfSkgZm9ybSlcbiAgICAgICAgb3AgKDpvcCBzdGF0ZW1lbnQpXG5cbiAgICAgICAgZGVmcyAoY29uZCAoPSBvcCA6ZGVmKSBbKDp2YXIgc3RhdGVtZW50KV1cbiAgICAgICAgICAgICAgICAgICA7OyAoPSBvcCA6bnMpICg6cmVxdWlyZW1lbnQgbm9kZSlcbiAgICAgICAgICAgICAgICAgICA6ZWxzZSBuaWwpXVxuXG4gICAgKGNvbmogZW52IHs6c3RhdGVtZW50cyAoY29uaiBzdGF0ZW1lbnRzIHN0YXRlbWVudClcbiAgICAgICAgICAgICAgIDpiaW5kaW5ncyAoY29uY2F0IGJpbmRpbmdzIGRlZnMpfSkpKVxuXG4oZGVmbiBhbmFseXplLWJsb2NrXG4gIFwiRXhhbXBsZXM6XG4gIChhbmFseXplLWJsb2NrIHt9ICcoKGZvbyBiYXIpKSkgPT4gezpzdGF0ZW1lbnRzIG5pbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6cmVzdWx0IHs6b3AgOmludm9rZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Zm9ybSAnKGZvbyBiYXIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDplbnYge31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmNhbGxlZSB7Om9wIDp2YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gJ2Zvb1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6aW5mbyBuaWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmVudiB7fX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnBhcmFtcyBbezpvcCA6dmFyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Zm9ybSAnYmFyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6aW5mbyBuaWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDplbnYge319XX1cbiAgKGFuYWx5emUtYmxvY2sge30gJygoYmVlcCBieilcbiAgICAgICAgICAgICAgICAgICAgICAoZm9vIGJhcikpKSA9PiB7OnN0YXRlbWVudHMgW3s6b3AgOmludm9rZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtICcoYmVlcCBieilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ZW52IHt9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmNhbGxlZSB7Om9wIDp2YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Zm9ybSAnYmVlcFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDppbmZvIG5pbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDplbnYge319XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnBhcmFtcyBbezpvcCA6dmFyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtICdielxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6aW5mbyBuaWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmVudiB7fX1dfV1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnJlc3VsdCB7Om9wIDppbnZva2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gJyhmb28gYmFyKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ZW52IHt9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpjYWxsZWUgezpvcCA6dmFyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtICdmb29cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmluZm8gbmlsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDplbnYge319XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpwYXJhbXMgW3s6b3AgOnZhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gJ2JhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmluZm8gbmlsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ZW52IHt9fV19XCJcbiAgW2VudiBmb3JtXVxuICAobGV0IFtib2R5IChpZiAoPiAoY291bnQgZm9ybSkgMSlcbiAgICAgICAgICAgICAgIChyZWR1Y2UgYW5hbHl6ZS1zdGF0ZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgICAgZW52XG4gICAgICAgICAgICAgICAgICAgICAgIChidXRsYXN0IGZvcm0pKSlcbiAgICAgICAgcmVzdWx0IChhbmFseXplIChvciBib2R5IGVudikgKGxhc3QgZm9ybSkpXVxuICAgIHs6c3RhdGVtZW50cyAoOnN0YXRlbWVudHMgYm9keSlcbiAgICAgOnJlc3VsdCByZXN1bHR9KSlcblxuKGRlZm4gYW5hbHl6ZS1mbi1tZXRob2RcbiAgXCJcbiAge30gLT4gJyhbeCB5XSAoKyB4IHkpKSAtPiB7OmVudiB7fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Zm9ybSAnKFt4IHldICgrIHggeSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIDp2YXJpYWRpYyBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6YXJpdHkgMlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6cGFyYW1zIFt7Om9wIDp2YXIgOmZvcm0gJ3h9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHs6b3AgOnZhciA6Zm9ybSAneX1dXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpzdGF0ZW1lbnRzIFtdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpyZXR1cm4gezpvcCA6aW52b2tlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpjYWxsZWUgezpvcCA6dmFyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtICcrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDplbnYgezpwYXJlbnQge31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmxvY2FscyB7eCB7Om5hbWUgJ3hcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnNoYWRvdyBuaWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmxvY2FsIHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnRhZyBuaWx9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHkgezpuYW1lICd5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpzaGFkb3cgbmlsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpsb2NhbCB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDp0YWcgbmlsfX19fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6cGFyYW1zIFt7Om9wIDp2YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtICd4XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6aW5mbyBuaWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDp0YWcgbmlsfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Om9wIDp2YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtICd5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6aW5mbyBuaWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDp0YWcgbmlsfV19fVwiXG4gIFtlbnYgZm9ybV1cbiAgKGxldCBbc2lnbmF0dXJlIChpZiAoYW5kIChsaXN0PyBmb3JtKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgKHZlY3Rvcj8gKGZpcnN0IGZvcm0pKSlcbiAgICAgICAgICAgICAgICAgICAgKGZpcnN0IGZvcm0pXG4gICAgICAgICAgICAgICAgICAgIChzeW50YXgtZXJyb3IgXCJNYWxmb3JtZWQgZm4gb3ZlcmxvYWQgZm9ybVwiIGZvcm0pKVxuICAgICAgICBib2R5IChyZXN0IGZvcm0pXG4gICAgICAgIDs7IElmIHBhcmFtIHNpZ25hdHVyZSBjb250YWlucyAmIGZuIGlzIHZhcmlhZGljLlxuICAgICAgICB2YXJpYWRpYyAoc29tZSAjKD0gJyYgJSkgc2lnbmF0dXJlKVxuXG4gICAgICAgIDs7IEFsbCBuYW1lZCBwYXJhbXMgb2YgdGhlIGZuLlxuICAgICAgICBwYXJhbXMgKGlmIHZhcmlhZGljXG4gICAgICAgICAgICAgICAgIChmaWx0ZXIgIyhub3QgKD0gJyYgJSkpIHNpZ25hdHVyZSlcbiAgICAgICAgICAgICAgICAgc2lnbmF0dXJlKVxuXG4gICAgICAgIDs7IE51bWJlciBvZiBwYXJhbWV0ZXJzIGZpeGVkIHBhcmFtZXRlcnMgZm4gdGFrZXMuXG4gICAgICAgIGFyaXR5IChpZiB2YXJpYWRpY1xuICAgICAgICAgICAgICAgIChkZWMgKGNvdW50IHBhcmFtcykpXG4gICAgICAgICAgICAgICAgKGNvdW50IHBhcmFtcykpXG5cbiAgICAgICAgOzsgQW5hbHl6ZSBwYXJhbWV0ZXJzIGluIGNvcnJlc3BvbmRlbmNlIHRvIGVudmlyb25tZW50XG4gICAgICAgIDs7IGxvY2FscyB0byBpZGVudGlmeSBiaW5kaW5nIHNoYWRvd2luZy5cbiAgICAgICAgc2NvcGUgKHJlZHVjZSAjKHdpdGgtcGFyYW0gJTEgKGFuYWx5emUtcGFyYW0gJTEgJTIpKVxuICAgICAgICAgICAgICAgICAgICAgIChjb25qIGVudiB7OnBhcmFtcyBbXX0pXG4gICAgICAgICAgICAgICAgICAgICAgcGFyYW1zKV1cbiAgICAoY29uaiAoYW5hbHl6ZS1ibG9jayBzY29wZSBib2R5KVxuICAgICAgICAgIHs6b3AgOm92ZXJsb2FkXG4gICAgICAgICAgIDp2YXJpYWRpYyB2YXJpYWRpY1xuICAgICAgICAgICA6YXJpdHkgYXJpdHlcbiAgICAgICAgICAgOnBhcmFtcyAoOnBhcmFtcyBzY29wZSlcbiAgICAgICAgICAgOmZvcm0gZm9ybX0pKSlcblxuXG4oZGVmbiBhbmFseXplLWZuXG4gIFtlbnYgZm9ybV1cbiAgKGxldCBbZm9ybXMgKHJlc3QgZm9ybSlcbiAgICAgICAgOzsgTm9ybWFsaXplIGZuIGZvcm0gc28gdGhhdCBpdCBjb250YWlucyBuYW1lXG4gICAgICAgIDs7ICcoZm4gW3hdIHgpIC0+ICcoZm4gbmlsIFt4XSB4KVxuICAgICAgICBmb3JtcyAoaWYgKHN5bWJvbD8gKGZpcnN0IGZvcm1zKSlcbiAgICAgICAgICAgICAgICBmb3Jtc1xuICAgICAgICAgICAgICAgIChjb25zIG5pbCBmb3JtcykpXG5cbiAgICAgICAgaWQgKGZpcnN0IGZvcm1zKVxuICAgICAgICBiaW5kaW5nIChpZiBpZCAoYW5hbHl6ZS1zcGVjaWFsIGFuYWx5emUtZGVjbGFyYXRpb24gZW52IGlkKSlcblxuICAgICAgICBib2R5IChyZXN0IGZvcm1zKVxuXG4gICAgICAgIDs7IE1ha2Ugc3VyZSB0aGF0IGZuIGRlZmluaXRpb24gaXMgc3RydWN1dGVyZWRcbiAgICAgICAgOzsgaW4gbWV0aG9kIG92ZXJsb2FkIHN0eWxlOlxuICAgICAgICA7OyAoZm4gYSBbeF0geSkgLT4gKChbeF0geSkpXG4gICAgICAgIDs7IChmbiBhIChbeF0geSkpIC0+ICgoW3hdIHkpKVxuICAgICAgICBvdmVybG9hZHMgKGNvbmQgKHZlY3Rvcj8gKGZpcnN0IGJvZHkpKSAobGlzdCBib2R5KVxuICAgICAgICAgICAgICAgICAgICAgICAgKGFuZCAobGlzdD8gKGZpcnN0IGJvZHkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodmVjdG9yPyAoZmlyc3QgKGZpcnN0IGJvZHkpKSkpIGJvZHlcbiAgICAgICAgICAgICAgICAgICAgICAgIDplbHNlIChzeW50YXgtZXJyb3IgKHN0ciBcIk1hbGZvcm1lZCBmbiBleHByZXNzaW9uLCBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicGFyYW1ldGVyIGRlY2xhcmF0aW9uIChcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChwci1zdHIgKGZpcnN0IGJvZHkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiKSBtdXN0IGJlIGEgdmVjdG9yXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcm0pKVxuXG4gICAgICAgIHNjb3BlIChpZiBiaW5kaW5nXG4gICAgICAgICAgICAgICAgKHdpdGgtYmluZGluZyAoc3ViLWVudiBlbnYpIGJpbmRpbmcpXG4gICAgICAgICAgICAgICAgKHN1Yi1lbnYgZW52KSlcblxuICAgICAgICBtZXRob2RzIChtYXAgIyhhbmFseXplLWZuLW1ldGhvZCBzY29wZSAlKVxuICAgICAgICAgICAgICAgICAgICAgKHZlYyBvdmVybG9hZHMpKVxuXG4gICAgICAgIGFyaXR5IChhcHBseSBtYXggKG1hcCAjKDphcml0eSAlKSBtZXRob2RzKSlcbiAgICAgICAgdmFyaWFkaWMgKHNvbWUgIyg6dmFyaWFkaWMgJSkgbWV0aG9kcyldXG4gICAgezpvcCA6Zm5cbiAgICAgOnR5cGUgOmZ1bmN0aW9uXG4gICAgIDppZCBiaW5kaW5nXG4gICAgIDp2YXJpYWRpYyB2YXJpYWRpY1xuICAgICA6bWV0aG9kcyBtZXRob2RzXG4gICAgIDpmb3JtIGZvcm19KSlcbihpbnN0YWxsLXNwZWNpYWwhIDpmbiogYW5hbHl6ZS1mbilcblxuKGRlZm4gcGFyc2UtcmVmZXJlbmNlc1xuICBcIlRha2VzIHBhcnQgb2YgbmFtZXNwYWNlIGRlZmluaXRpb24gYW5kIGNyZWF0ZXMgaGFzaFxuICBvZiByZWZlcmVuY2UgZm9ybXNcIlxuICBbZm9ybXNdXG4gIChyZWR1Y2UgKGZuIFtyZWZlcmVuY2VzIGZvcm1dXG4gICAgICAgICAgICA7OyBJZiBub3QgYSB2ZWN0b3IgdGhhbiBpdCdzIG5vdCBhIHJlZmVyZW5jZVxuICAgICAgICAgICAgOzsgZm9ybSB0aGF0IHdpc3AgdW5kZXJzdGFuZHMgc28ganVzdCBza2lwIGl0LlxuICAgICAgICAgICAgKGlmIChzZXE/IGZvcm0pXG4gICAgICAgICAgICAgIChhc3NvYyByZWZlcmVuY2VzXG4gICAgICAgICAgICAgICAgKG5hbWUgKGZpcnN0IGZvcm0pKVxuICAgICAgICAgICAgICAgICh2ZWMgKHJlc3QgZm9ybSkpKVxuICAgICAgICAgICAgICByZWZlcmVuY2VzKSlcbiAgICAgICAgICB7fVxuICAgICAgICAgIGZvcm1zKSlcblxuKGRlZm4gcGFyc2UtcmVxdWlyZVxuICBbZm9ybV1cbiAgKGxldCBbOzsgcmVxdWlyZSBmb3JtIG1heSBiZSBlaXRoZXIgdmVjdG9yIHdpdGggaWQgaW4gdGhlXG4gICAgICAgIDs7IGhlYWQgb3IganVzdCBhbiBpZCBzeW1ib2wuIG5vcm1hbGl6aW5nIHRvIGEgdmVjdG9yXG4gICAgICAgIHJlcXVpcmVtZW50IChpZiAoc3ltYm9sPyBmb3JtKSBbZm9ybV0gKHZlYyBmb3JtKSlcbiAgICAgICAgaWQgKGZpcnN0IHJlcXVpcmVtZW50KVxuICAgICAgICA7OyBidW5jaCBvZiBkaXJlY3RpdmVzIG1heSBmb2xsb3cgcmVxdWlyZSBmb3JtIGJ1dCB0aGV5XG4gICAgICAgIDs7IGFsbCBjb21lIGluIHBhaXJzLiB3aXNwIHN1cHBvcnRzIGZvbGxvd2luZyBwYWlyczpcbiAgICAgICAgOzsgOmFzIGZvb1xuICAgICAgICA7OyA6cmVmZXIgW2ZvbyBiYXJdXG4gICAgICAgIDs7IDpyZW5hbWUge2ZvbyBiYXJ9XG4gICAgICAgIDs7IGpvaW4gdGhlc2UgcGFpcnMgaW4gYSBoYXNoIGZvciBrZXkgYmFzZWQgYWNjZXNzLlxuICAgICAgICBwYXJhbXMgKGFwcGx5IGRpY3Rpb25hcnkgKHJlc3QgcmVxdWlyZW1lbnQpKVxuICAgICAgICByZW5hbWVzIChnZXQgcGFyYW1zICc6cmVuYW1lKVxuICAgICAgICBuYW1lcyAoZ2V0IHBhcmFtcyAnOnJlZmVyKVxuICAgICAgICBhbGlhcyAoZ2V0IHBhcmFtcyAnOmFzKVxuICAgICAgICByZWZlcmVuY2VzIChpZiAobm90IChlbXB0eT8gbmFtZXMpKVxuICAgICAgICAgICAgICAgICAgICAgKHJlZHVjZSAoZm4gW3JlZmVycyByZWZlcmVuY2VdXG4gICAgICAgICAgICAgICAgICAgICAgKGNvbmogcmVmZXJzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgezpvcCA6cmVmZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gcmVmZXJlbmNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpuYW1lIHJlZmVyZW5jZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICA7OyBMb29rIHVwIGJ5IHJlZmVyZW5jZSBzeW1ib2wgYW5kIGJ5IHN5bWJvbFxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIDs7IGJpdCBpbiBhIGZ1enogcmlnaHQgbm93LlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6cmVuYW1lIChvciAoZ2V0IHJlbmFtZXMgcmVmZXJlbmNlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZ2V0IHJlbmFtZXMgKG5hbWUgcmVmZXJlbmNlKSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpucyBpZH0pKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lcykpXVxuICAgIHs6b3AgOnJlcXVpcmVcbiAgICAgOmFsaWFzIGFsaWFzXG4gICAgIDpucyBpZFxuICAgICA6cmVmZXIgcmVmZXJlbmNlc1xuICAgICA6Zm9ybSBmb3JtfSkpXG5cbihkZWZuIGFuYWx5emUtbnNcbiAgW2VudiBmb3JtXVxuICAobGV0IFtmb3JtcyAocmVzdCBmb3JtKVxuICAgICAgICBuYW1lIChmaXJzdCBmb3JtcylcbiAgICAgICAgYm9keSAocmVzdCBmb3JtcylcbiAgICAgICAgOzsgT3B0aW9uYWwgZG9jc3RyaW5nIHRoYXQgZm9sbG93cyBuYW1lIHN5bWJvbFxuICAgICAgICBkb2MgKGlmIChzdHJpbmc/IChmaXJzdCBib2R5KSkgKGZpcnN0IGJvZHkpKVxuICAgICAgICA7OyBJZiBzZWNvbmQgZm9ybSBpcyBub3QgYSBzdHJpbmcgdGhhbiB0cmVhdCBpdFxuICAgICAgICA7OyBhcyByZWd1bGFyIHJlZmVyZW5jZSBmb3JtXG4gICAgICAgIHJlZmVyZW5jZXMgKHBhcnNlLXJlZmVyZW5jZXMgKGlmIGRvY1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHJlc3QgYm9keSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvZHkpKVxuICAgICAgICByZXF1aXJlbWVudHMgKGlmICg6cmVxdWlyZSByZWZlcmVuY2VzKVxuICAgICAgICAgICAgICAgICAgICAgICAobWFwIHBhcnNlLXJlcXVpcmUgKDpyZXF1aXJlIHJlZmVyZW5jZXMpKSldXG4gICAgezpvcCA6bnNcbiAgICAgOm5hbWUgbmFtZVxuICAgICA6ZG9jIGRvY1xuICAgICA6cmVxdWlyZSAoaWYgcmVxdWlyZW1lbnRzXG4gICAgICAgICAgICAgICAgKHZlYyByZXF1aXJlbWVudHMpKVxuICAgICA6Zm9ybSBmb3JtfSkpXG4oaW5zdGFsbC1zcGVjaWFsISA6bnMgYW5hbHl6ZS1ucylcblxuXG4oZGVmbiBhbmFseXplLWxpc3RcbiAgXCJUYWtlcyBmb3JtIG9mIGxpc3QgdHlwZSBhbmQgcGVyZm9ybXMgYSBtYWNyb2V4cGFuc2lvbnMgdW50aWxcbiAgZnVsbHkgZXhwYW5kZWQuIElmIGV4cGFuc2lvbiBpcyBkaWZmZXJlbnQgZnJvbSBhIGdpdmVuIGZvcm0gdGhlblxuICBleHBhbmRlZCBmb3JtIGlzIGhhbmRlZCBiYWNrIHRvIGFuYWx5emVyLiBJZiBmb3JtIGlzIHNwZWNpYWwgbGlrZVxuICBkZWYsIGZuLCBsZXQuLi4gdGhhbiBhc3NvY2lhdGVkIGlzIGRpc3BhdGNoZWQsIG90aGVyd2lzZSBmb3JtIGlzXG4gIGFuYWx5emVkIGFzIGludm9rZSBleHByZXNzaW9uLlwiXG4gIFtlbnYgZm9ybV1cbiAgKGxldCBbZXhwYW5zaW9uIChtYWNyb2V4cGFuZCBmb3JtIGVudilcbiAgICAgICAgOzsgU3BlY2lhbCBvcGVyYXRvcnMgbXVzdCBiZSBzeW1ib2xzIGFuZCBzdG9yZWQgaW4gdGhlXG4gICAgICAgIDs7ICoqc3BlY2lhbHMqKiBoYXNoIGJ5IG9wZXJhdG9yIG5hbWUuXG4gICAgICAgIG9wZXJhdG9yIChmaXJzdCBmb3JtKVxuICAgICAgICBhbmFseXplciAoYW5kIChzeW1ib2w/IG9wZXJhdG9yKVxuICAgICAgICAgICAgICAgICAgICAgIChnZXQgKipzcGVjaWFscyoqIChuYW1lIG9wZXJhdG9yKSkpXVxuICAgIDs7IElmIGZvcm0gaXMgZXhwYW5kZWQgcGFzcyBpdCBiYWNrIHRvIGFuYWx5emUgc2luY2UgaXQgbWF5IG5vXG4gICAgOzsgbG9uZ2VyIGJlIGEgbGlzdC4gT3RoZXJ3aXNlIGVpdGhlciBhbmFseXplIGFzIGEgc3BlY2lhbCBmb3JtXG4gICAgOzsgKGlmIGl0J3Mgc3VjaCkgb3IgYXMgZnVuY3Rpb24gaW52b2thdGlvbiBmb3JtLlxuICAgIChjb25kIChub3QgKGlkZW50aWNhbD8gZXhwYW5zaW9uIGZvcm0pKSAoYW5hbHl6ZSBlbnYgZXhwYW5zaW9uKVxuICAgICAgICAgIGFuYWx5emVyIChhbmFseXplLXNwZWNpYWwgYW5hbHl6ZXIgZW52IGV4cGFuc2lvbilcbiAgICAgICAgICA6ZWxzZSAoYW5hbHl6ZS1pbnZva2UgZW52IGV4cGFuc2lvbikpKSlcblxuKGRlZm4gYW5hbHl6ZS12ZWN0b3JcbiAgW2VudiBmb3JtXVxuICAobGV0IFtpdGVtcyAodmVjIChtYXAgIyhhbmFseXplIGVudiAlKSBmb3JtKSldXG4gICAgezpvcCA6dmVjdG9yXG4gICAgIDpmb3JtIGZvcm1cbiAgICAgOml0ZW1zIGl0ZW1zfSkpXG5cbihkZWZuIGFuYWx5emUtZGljdGlvbmFyeVxuICBbZW52IGZvcm1dXG4gIChsZXQgW25hbWVzICh2ZWMgKG1hcCAjKGFuYWx5emUgZW52ICUpIChrZXlzIGZvcm0pKSlcbiAgICAgICAgdmFsdWVzICh2ZWMgKG1hcCAjKGFuYWx5emUgZW52ICUpICh2YWxzIGZvcm0pKSldXG4gICAgezpvcCA6ZGljdGlvbmFyeVxuICAgICA6a2V5cyBuYW1lc1xuICAgICA6dmFsdWVzIHZhbHVlc1xuICAgICA6Zm9ybSBmb3JtfSkpXG5cbihkZWZuIGFuYWx5emUtaW52b2tlXG4gIFwiUmV0dXJucyBub2RlIG9mIDppbnZva2UgdHlwZSwgcmVwcmVzZW50aW5nIGEgZnVuY3Rpb24gY2FsbC4gSW5cbiAgYWRkaXRpb24gdG8gcmVndWxhciBwcm9wZXJ0aWVzIHRoaXMgbm9kZSBjb250YWlucyA6Y2FsbGVlIG1hcHBlZFxuICB0byBhIG5vZGUgdGhhdCBpcyBiZWluZyBpbnZva2VkIGFuZCA6cGFyYW1zIHRoYXQgaXMgYW4gdmVjdG9yIG9mXG4gIHBhcmFtdGVyIGV4cHJlc3Npb25zIHRoYXQgOmNhbGxlZSBpcyBpbnZva2VkIHdpdGguXCJcbiAgW2VudiBmb3JtXVxuICAobGV0IFtjYWxsZWUgKGFuYWx5emUgZW52IChmaXJzdCBmb3JtKSlcbiAgICAgICAgcGFyYW1zICh2ZWMgKG1hcCAjKGFuYWx5emUgZW52ICUpIChyZXN0IGZvcm0pKSldXG4gICAgezpvcCA6aW52b2tlXG4gICAgIDpjYWxsZWUgY2FsbGVlXG4gICAgIDpwYXJhbXMgcGFyYW1zXG4gICAgIDpmb3JtIGZvcm19KSlcblxuKGRlZm4gYW5hbHl6ZS1jb25zdGFudFxuICBcIlJldHVybnMgYSBub2RlIHJlcHJlc2VudGluZyBhIGNvbnRzdGFudCB2YWx1ZSB3aGljaCBpc1xuICBtb3N0IGNlcnRhaW5seSBhIHByaW1pdGl2ZSB2YWx1ZSBsaXRlcmFsIHRoaXMgZm9ybSBjYW50YWluc1xuICBubyBleHRyYSBpbmZvcm1hdGlvbi5cIlxuICBbZW52IGZvcm1dXG4gIHs6b3AgOmNvbnN0YW50XG4gICA6Zm9ybSBmb3JtfSlcblxuKGRlZm4gYW5hbHl6ZVxuICBcIlRha2VzIGEgaGFzaCByZXByZXNlbnRpbmcgYSBnaXZlbiBlbnZpcm9ubWVudCBhbmQgYGZvcm1gIHRvIGJlXG4gIGFuYWx5emVkLiBFbnZpcm9ubWVudCBtYXkgY29udGFpbiBmb2xsb3dpbmcgZW50cmllczpcblxuICA6bG9jYWxzICAtIEhhc2ggb2YgdGhlIGdpdmVuIGVudmlyb25tZW50cyBiaW5kaW5ncyBtYXBwZWR5IGJ5IGJpbmRpbmcgbmFtZS5cbiAgOmNvbnRleHQgLSBPbmUgb2YgdGhlIGZvbGxvd2luZyA6c3RhdGVtZW50LCA6ZXhwcmVzc2lvbiwgOnJldHVybi4gVGhhdFxuICAgICAgICAgICAgIGluZm9ybWF0aW9uIGlzIGluY2x1ZGVkIGluIHJlc3VsdGluZyBub2RlcyBhbmQgaXMgbWVhbnQgZm9yXG4gICAgICAgICAgICAgd3JpdGVyIHRoYXQgbWF5IG91dHB1dCBkaWZmZXJlbnQgZm9ybXMgYmFzZWQgb24gY29udGV4dC5cbiAgOm5zICAgICAgLSBOYW1lc3BhY2Ugb2YgdGhlIGZvcm1zIGJlaW5nIGFuYWx5emVkLlxuXG4gIEFuYWx5emVyIHBlcmZvcm1zIGFsbCB0aGUgbWFjcm8gJiBzeW50YXggZXhwYW5zaW9ucyBhbmQgdHJhbnNmb3JtcyBmb3JtXG4gIGludG8gQVNUIG5vZGUgb2YgYW4gZXhwcmVzc2lvbi4gRWFjaCBzdWNoIG5vZGUgY29udGFpbnMgYXQgbGVhc3QgZm9sbG93aW5nXG4gIHByb3BlcnRpZXM6XG5cbiAgOm9wICAgLSBPcGVyYXRpb24gdHlwZSBvZiB0aGUgZXhwcmVzc2lvbi5cbiAgOmZvcm0gLSBHaXZlbiBmb3JtLlxuXG4gIEJhc2VkIG9uIDpvcCBub2RlIG1heSBjb250YWluIGRpZmZlcmVudCBzZXQgb2YgcHJvcGVydGllcy5cIlxuICAoW2Zvcm1dIChhbmFseXplIHs6bG9jYWxzIHt9XG4gICAgICAgICAgICAgICAgICAgIDpiaW5kaW5ncyBbXVxuICAgICAgICAgICAgICAgICAgICA6dG9wIHRydWV9IGZvcm0pKVxuICAoW2VudiBmb3JtXVxuICAgKGNvbmQgKG5pbD8gZm9ybSkgKGFuYWx5emUtY29uc3RhbnQgZW52IGZvcm0pXG4gICAgICAgICAoc3ltYm9sPyBmb3JtKSAoYW5hbHl6ZS1zeW1ib2wgZW52IGZvcm0pXG4gICAgICAgICAobGlzdD8gZm9ybSkgKGlmIChlbXB0eT8gZm9ybSlcbiAgICAgICAgICAgICAgICAgICAgICAgIChhbmFseXplLXF1b3RlZCBmb3JtKVxuICAgICAgICAgICAgICAgICAgICAgICAgKGFuYWx5emUtbGlzdCBlbnYgZm9ybSkpXG4gICAgICAgICAoZGljdGlvbmFyeT8gZm9ybSkgKGFuYWx5emUtZGljdGlvbmFyeSBlbnYgZm9ybSlcbiAgICAgICAgICh2ZWN0b3I/IGZvcm0pIChhbmFseXplLXZlY3RvciBlbnYgZm9ybSlcbiAgICAgICAgIDsoc2V0PyBmb3JtKSAoYW5hbHl6ZS1zZXQgZW52IGZvcm0gbmFtZSlcbiAgICAgICAgIChrZXl3b3JkPyBmb3JtKSAoYW5hbHl6ZS1rZXl3b3JkIGVudiBmb3JtKVxuICAgICAgICAgOmVsc2UgKGFuYWx5emUtY29uc3RhbnQgZW52IGZvcm0pKSkpXG4iXX0=
