{
    var _ns_ = {
        id: 'wisp.backend.escodegen.writer',
        doc: null
    };
    var wisp_reader = require('./../../reader');
    var readFromString = wisp_reader.readFromString;
    var wisp_ast = require('./../../ast');
    var meta = wisp_ast.meta;
    var withMeta = wisp_ast.withMeta;
    var isSymbol = wisp_ast.isSymbol;
    var symbol = wisp_ast.symbol;
    var isKeyword = wisp_ast.isKeyword;
    var keyword = wisp_ast.keyword;
    var namespace = wisp_ast.namespace;
    var isUnquote = wisp_ast.isUnquote;
    var isUnquoteSplicing = wisp_ast.isUnquoteSplicing;
    var isQuote = wisp_ast.isQuote;
    var isSyntaxQuote = wisp_ast.isSyntaxQuote;
    var name = wisp_ast.name;
    var gensym = wisp_ast.gensym;
    var prStr = wisp_ast.prStr;
    var wisp_sequence = require('./../../sequence');
    var isEmpty = wisp_sequence.isEmpty;
    var count = wisp_sequence.count;
    var isList = wisp_sequence.isList;
    var list = wisp_sequence.list;
    var first = wisp_sequence.first;
    var second = wisp_sequence.second;
    var third = wisp_sequence.third;
    var rest = wisp_sequence.rest;
    var cons = wisp_sequence.cons;
    var conj = wisp_sequence.conj;
    var butlast = wisp_sequence.butlast;
    var reverse = wisp_sequence.reverse;
    var reduce = wisp_sequence.reduce;
    var vec = wisp_sequence.vec;
    var last = wisp_sequence.last;
    var map = wisp_sequence.map;
    var mapv = wisp_sequence.mapv;
    var filter = wisp_sequence.filter;
    var take = wisp_sequence.take;
    var concat = wisp_sequence.concat;
    var partition = wisp_sequence.partition;
    var repeat = wisp_sequence.repeat;
    var interleave = wisp_sequence.interleave;
    var assoc = wisp_sequence.assoc;
    var wisp_runtime = require('./../../runtime');
    var isOdd = wisp_runtime.isOdd;
    var isDictionary = wisp_runtime.isDictionary;
    var dictionary = wisp_runtime.dictionary;
    var merge = wisp_runtime.merge;
    var keys = wisp_runtime.keys;
    var vals = wisp_runtime.vals;
    var isContainsVector = wisp_runtime.isContainsVector;
    var mapDictionary = wisp_runtime.mapDictionary;
    var isString = wisp_runtime.isString;
    var isNumber = wisp_runtime.isNumber;
    var isVector = wisp_runtime.isVector;
    var isBoolean = wisp_runtime.isBoolean;
    var subs = wisp_runtime.subs;
    var reFind = wisp_runtime.reFind;
    var isTrue = wisp_runtime.isTrue;
    var isFalse = wisp_runtime.isFalse;
    var isNil = wisp_runtime.isNil;
    var isRePattern = wisp_runtime.isRePattern;
    var inc = wisp_runtime.inc;
    var dec = wisp_runtime.dec;
    var str = wisp_runtime.str;
    var char = wisp_runtime.char;
    var int = wisp_runtime.int;
    var isEqual = wisp_runtime.isEqual;
    var isStrictEqual = wisp_runtime.isStrictEqual;
    var get = wisp_runtime.get;
    var wisp_string = require('./../../string');
    var split = wisp_string.split;
    var join = wisp_string.join;
    var upperCase = wisp_string.upperCase;
    var replace = wisp_string.replace;
    var triml = wisp_string.triml;
    var wisp_expander = require('./../../expander');
    var installMacro = wisp_expander.installMacro;
    var escodegen = require('escodegen');
    var generate = escodegen.generate;
}
var __uniqueChar__ = exports.__uniqueChar__ = 'ø';
var toCamelJoin = exports.toCamelJoin = function toCamelJoin(prefix, key) {
    return '' + prefix + (!isEmpty(prefix) && !isEmpty(key) ? '' + upperCase((key || 0)[0]) + subs(key, 1) : key);
};
var toPrivatePrefix = exports.toPrivatePrefix = function toPrivatePrefix(id) {
    return function () {
        var spaceDelimitedø1 = join(' ', split(id, /-/));
        var leftTrimmedø1 = triml(spaceDelimitedø1);
        var nø1 = count(id) - count(leftTrimmedø1);
        return nø1 > 0 ? '' + join('_', repeat(inc(nø1), '')) + subs(id, nø1) : id;
    }.call(this);
};
var translateIdentifierWord = exports.translateIdentifierWord = function translateIdentifierWord(form) {
    return function () {
        var idø1 = name(form);
        idø1 = idø1 === '*' ? (function () {
            return 'multiply';
        })() : idø1 === '/' ? (function () {
            return 'divide';
        })() : idø1 === '+' ? (function () {
            return 'sum';
        })() : idø1 === '-' ? (function () {
            return 'subtract';
        })() : idø1 === '=' ? (function () {
            return 'equal?';
        })() : idø1 === '==' ? (function () {
            return 'strict-equal?';
        })() : idø1 === '<=' ? (function () {
            return 'not-greater-than';
        })() : idø1 === '>=' ? (function () {
            return 'not-less-than';
        })() : idø1 === '>' ? (function () {
            return 'greater-than';
        })() : idø1 === '<' ? (function () {
            return 'less-than';
        })() : idø1 === '->' ? (function () {
            return 'thread-first';
        })() : (function () {
            return idø1;
        })();
        idø1 = join('_', split(idø1, '*'));
        idø1 = join('_', split(idø1, '.'));
        idø1 = subs(idø1, 0, 2) === '->' ? subs(join('-to-', split(idø1, '->')), 1) : join('-to-', split(idø1, '->'));
        idø1 = join(split(idø1, '!'));
        idø1 = join('$', split(idø1, '%'));
        idø1 = join('-equal-', split(idø1, '='));
        idø1 = join('-plus-', split(idø1, '+'));
        idø1 = join('-and-', split(idø1, '&'));
        idø1 = last(idø1) === '?' ? '' + 'is-' + subs(idø1, 0, dec(count(idø1))) : idø1;
        idø1 = toPrivatePrefix(idø1);
        idø1 = reduce(toCamelJoin, '', split(idø1, '-'));
        idø1 = join('_QMARK_', split(idø1, '?'));
        idø1 = join('_GT_', split(idø1, '>'));
        idø1 = join('_LT_', split(idø1, '<'));
        idø1 = join('_SLASH_', split(idø1, '/'));
        return idø1;
    }.call(this);
};
var translateIdentifier = exports.translateIdentifier = function translateIdentifier(form) {
    return function () {
        var nsø1 = namespace(form);
        return '' + (nsø1 && !isEqual(nsø1, 'js') ? '' + translateIdentifierWord(namespace(form)) + '.' : '') + join('.', map(translateIdentifierWord, split(name(form), '.')));
    }.call(this);
};
var errorArgCount = exports.errorArgCount = function errorArgCount(callee, n) {
    return (function () {
        throw SyntaxError('' + 'Wrong number of arguments (' + n + ') passed to: ' + callee);
    })();
};
var inheritLocation = exports.inheritLocation = function inheritLocation(body) {
    return function () {
        var startø1 = ((first(body) || 0)['loc'] || 0)['start'];
        var endø1 = ((last(body) || 0)['loc'] || 0)['end'];
        return !(isNil(startø1) || isNil(endø1)) ? {
            'start': startø1,
            'end': endø1
        } : null;
    }.call(this);
};
var writeLocation = exports.writeLocation = function writeLocation(form, original) {
    return function () {
        var dataø1 = meta(form);
        var inheritedø1 = meta(original);
        var startø1 = (form || 0)['start'] || (dataø1 || 0)['start'] || (inheritedø1 || 0)['start'];
        var endø1 = (form || 0)['end'] || (dataø1 || 0)['end'] || (inheritedø1 || 0)['end'];
        return !isNil(startø1) ? {
            'loc': {
                'start': {
                    'line': inc(get.apply(null, [
                        startø1,
                        'line',
                        -1
                    ])),
                    'column': get.apply(null, [
                        startø1,
                        'column',
                        -1
                    ])
                },
                'end': {
                    'line': inc(get.apply(null, [
                        endø1,
                        'line',
                        -1
                    ])),
                    'column': get.apply(null, [
                        endø1,
                        'column',
                        -1
                    ])
                }
            }
        } : {};
    }.call(this);
};
var __writers__ = exports.__writers__ = {};
var installWriter = exports.installWriter = function installWriter(op, writer) {
    return (__writers__ || 0)[op] = writer;
};
var writeOp = exports.writeOp = function writeOp(op, form) {
    return function () {
        var writerø1 = (__writers__ || 0)[op];
        !writerø1 ? (function () {
            throw Error('' + 'Assert failed: ' + ('' + 'Unsupported operation: ' + op) + 'writer');
        })() : null;
        return conj(writeLocation((form || 0)['form'], (form || 0)['original-form']), writerø1(form));
    }.call(this);
};
var __specials__ = exports.__specials__ = {};
var installSpecial = exports.installSpecial = function installSpecial(op, writer) {
    return (__specials__ || 0)[name(op)] = writer;
};
var writeSpecial = exports.writeSpecial = function writeSpecial(writer, form) {
    return conj(writeLocation((form || 0)['form'], (form || 0)['original-form']), writer.apply(null, (form || 0)['params']));
};
var writeNil = exports.writeNil = function writeNil(form) {
    return {
        'type': 'Literal',
        'value': null
    };
};
installWriter('nil', writeNil);
var writeLiteral = exports.writeLiteral = function writeLiteral(form) {
    return {
        'type': 'Literal',
        'value': form
    };
};
var writeList = exports.writeList = function writeList(form) {
    return {
        'type': 'CallExpression',
        'callee': write({
            'op': 'var',
            'form': symbol(null, 'list')
        }),
        'arguments': map(write, (form || 0)['items'])
    };
};
installWriter('list', writeList);
var writeSymbol = exports.writeSymbol = function writeSymbol(form) {
    return {
        'type': 'CallExpression',
        'callee': write({
            'op': 'var',
            'form': symbol(null, 'symbol')
        }),
        'arguments': [
            writeConstant((form || 0)['namespace']),
            writeConstant((form || 0)['name'])
        ]
    };
};
installWriter('symbol', writeSymbol);
var writeConstant = exports.writeConstant = function writeConstant(form) {
    return isNil(form) ? (function () {
        return writeNil(form);
    })() : isKeyword(form) ? (function () {
        return writeLiteral(namespace(form) ? '' + namespace(form) + '/' + name(form) : name(form));
    })() : isNumber(form) ? (function () {
        return writeNumber(form.valueOf());
    })() : isString(form) ? (function () {
        return writeString(form);
    })() : (function () {
        return writeLiteral(form);
    })();
};
installWriter('constant', function ($) {
    return writeConstant(($ || 0)['form']);
});
var writeString = exports.writeString = function writeString(form) {
    return {
        'type': 'Literal',
        'value': '' + form
    };
};
var writeNumber = exports.writeNumber = function writeNumber(form) {
    return form < 0 ? {
        'type': 'UnaryExpression',
        'operator': '-',
        'prefix': true,
        'argument': writeNumber(form * -1)
    } : writeLiteral(form);
};
var writeKeyword = exports.writeKeyword = function writeKeyword(form) {
    return {
        'type': 'Literal',
        'value': (form || 0)['form']
    };
};
installWriter('keyword', writeKeyword);
var toIdentifier = exports.toIdentifier = function toIdentifier(form) {
    return {
        'type': 'Identifier',
        'name': translateIdentifier(form)
    };
};
var writeBindingVar = exports.writeBindingVar = function writeBindingVar(form) {
    return function () {
        var baseIdø1 = (form || 0)['id'];
        var resolvedIdø1 = (form || 0)['shadow'] ? symbol(null, '' + translateIdentifier(baseIdø1) + __uniqueChar__ + (form || 0)['depth']) : baseIdø1;
        return conj(toIdentifier(resolvedIdø1), writeLocation(baseIdø1));
    }.call(this);
};
var writeVar = exports.writeVar = function writeVar(node) {
    return isEqual('binding', ((node || 0)['binding'] || 0)['type']) ? conj(writeBindingVar((node || 0)['binding']), writeLocation((node || 0)['form'])) : conj(writeLocation((node || 0)['form']), toIdentifier((node || 0)['form']));
};
installWriter('var', writeVar);
installWriter('param', writeVar);
var writeInvoke = exports.writeInvoke = function writeInvoke(form) {
    return {
        'type': 'CallExpression',
        'callee': write((form || 0)['callee']),
        'arguments': map(write, (form || 0)['params'])
    };
};
installWriter('invoke', writeInvoke);
var writeVector = exports.writeVector = function writeVector(form) {
    return {
        'type': 'ArrayExpression',
        'elements': map(write, (form || 0)['items'])
    };
};
installWriter('vector', writeVector);
var writeDictionary = exports.writeDictionary = function writeDictionary(form) {
    return function () {
        var propertiesø1 = partition(2, interleave((form || 0)['keys'], (form || 0)['values']));
        return {
            'type': 'ObjectExpression',
            'properties': map(function (pair) {
                return function () {
                    var keyø1 = first(pair);
                    var valueø1 = second(pair);
                    return {
                        'kind': 'init',
                        'type': 'Property',
                        'key': isEqual('symbol', (keyø1 || 0)['op']) ? writeConstant('' + (keyø1 || 0)['form']) : write(keyø1),
                        'value': write(valueø1)
                    };
                }.call(this);
            }, propertiesø1)
        };
    }.call(this);
};
installWriter('dictionary', writeDictionary);
var writeExport = exports.writeExport = function writeExport(form) {
    return write({
        'op': 'set!',
        'target': {
            'op': 'member-expression',
            'computed': false,
            'target': {
                'op': 'var',
                'form': withMeta(symbol(null, 'exports'), meta(((form || 0)['id'] || 0)['form']))
            },
            'property': (form || 0)['id'],
            'form': ((form || 0)['id'] || 0)['form']
        },
        'value': (form || 0)['init'],
        'form': ((form || 0)['id'] || 0)['form']
    });
};
var writeDef = exports.writeDef = function writeDef(form) {
    return conj({
        'type': 'VariableDeclaration',
        'kind': 'var',
        'declarations': [conj({
                'type': 'VariableDeclarator',
                'id': write((form || 0)['id']),
                'init': conj((form || 0)['export'] ? writeExport(form) : write((form || 0)['init']))
            }, writeLocation(((form || 0)['id'] || 0)['form']))]
    }, writeLocation((form || 0)['form'], (form || 0)['original-form']));
};
installWriter('def', writeDef);
var writeBinding = exports.writeBinding = function writeBinding(form) {
    return function () {
        var idø1 = writeBindingVar(form);
        var initø1 = write((form || 0)['init']);
        return {
            'type': 'VariableDeclaration',
            'kind': 'var',
            'loc': inheritLocation([
                idø1,
                initø1
            ]),
            'declarations': [{
                    'type': 'VariableDeclarator',
                    'id': idø1,
                    'init': initø1
                }]
        };
    }.call(this);
};
installWriter('binding', writeBinding);
var writeThrow = exports.writeThrow = function writeThrow(form) {
    return toExpression(conj({
        'type': 'ThrowStatement',
        'argument': write((form || 0)['throw'])
    }, writeLocation((form || 0)['form'], (form || 0)['original-form'])));
};
installWriter('throw', writeThrow);
var writeNew = exports.writeNew = function writeNew(form) {
    return {
        'type': 'NewExpression',
        'callee': write((form || 0)['constructor']),
        'arguments': map(write, (form || 0)['params'])
    };
};
installWriter('new', writeNew);
var writeSet = exports.writeSet = function writeSet(form) {
    return {
        'type': 'AssignmentExpression',
        'operator': '=',
        'left': write((form || 0)['target']),
        'right': write((form || 0)['value'])
    };
};
installWriter('set!', writeSet);
var writeAget = exports.writeAget = function writeAget(form) {
    return {
        'type': 'MemberExpression',
        'computed': (form || 0)['computed'],
        'object': write((form || 0)['target']),
        'property': write((form || 0)['property'])
    };
};
installWriter('member-expression', writeAget);
var __statements__ = exports.__statements__ = {
    'EmptyStatement': true,
    'BlockStatement': true,
    'ExpressionStatement': true,
    'IfStatement': true,
    'LabeledStatement': true,
    'BreakStatement': true,
    'ContinueStatement': true,
    'SwitchStatement': true,
    'ReturnStatement': true,
    'ThrowStatement': true,
    'TryStatement': true,
    'WhileStatement': true,
    'DoWhileStatement': true,
    'ForStatement': true,
    'ForInStatement': true,
    'ForOfStatement': true,
    'LetStatement': true,
    'VariableDeclaration': true,
    'FunctionDeclaration': true
};
var writeStatement = exports.writeStatement = function writeStatement(form) {
    return toStatement(write(form));
};
var toStatement = exports.toStatement = function toStatement(node) {
    return (__statements__ || 0)[(node || 0)['type']] ? node : {
        'type': 'ExpressionStatement',
        'expression': node,
        'loc': (node || 0)['loc']
    };
};
var toReturn = exports.toReturn = function toReturn(form) {
    return conj({
        'type': 'ReturnStatement',
        'argument': write(form)
    }, writeLocation((form || 0)['form'], (form || 0)['original-form']));
};
var writeBody = exports.writeBody = function writeBody(form) {
    return function () {
        var statementsø1 = map(writeStatement, (form || 0)['statements'] || []);
        var resultø1 = (form || 0)['result'] ? toReturn((form || 0)['result']) : null;
        return resultø1 ? conj(statementsø1, resultø1) : statementsø1;
    }.call(this);
};
var toBlock = exports.toBlock = function toBlock(body) {
    return isVector(body) ? {
        'type': 'BlockStatement',
        'body': body,
        'loc': inheritLocation(body)
    } : {
        'type': 'BlockStatement',
        'body': [body],
        'loc': (body || 0)['loc']
    };
};
var toExpression = exports.toExpression = function toExpression() {
    var body = Array.prototype.slice.call(arguments, 0);
    return {
        'type': 'CallExpression',
        'arguments': [],
        'loc': inheritLocation(body),
        'callee': toSequence([{
                'type': 'FunctionExpression',
                'id': null,
                'params': [],
                'defaults': [],
                'expression': false,
                'generator': false,
                'rest': null,
                'body': toBlock(body)
            }])
    };
};
var writeDo = exports.writeDo = function writeDo(form) {
    return (meta(first((form || 0)['form'])) || 0)['block'] ? toBlock(writeBody(conj(form, {
        'result': null,
        'statements': conj((form || 0)['statements'], (form || 0)['result'])
    }))) : toExpression.apply(null, writeBody(form));
};
installWriter('do', writeDo);
var writeIf = exports.writeIf = function writeIf(form) {
    return {
        'type': 'ConditionalExpression',
        'test': write((form || 0)['test']),
        'consequent': write((form || 0)['consequent']),
        'alternate': write((form || 0)['alternate'])
    };
};
installWriter('if', writeIf);
var writeTry = exports.writeTry = function writeTry(form) {
    return function () {
        var handlerø1 = (form || 0)['handler'];
        var finalizerø1 = (form || 0)['finalizer'];
        return toExpression(conj({
            'type': 'TryStatement',
            'guardedHandlers': [],
            'block': toBlock(writeBody((form || 0)['body'])),
            'handlers': handlerø1 ? [{
                    'type': 'CatchClause',
                    'param': write((handlerø1 || 0)['name']),
                    'body': toBlock(writeBody(handlerø1))
                }] : [],
            'finalizer': finalizerø1 ? (function () {
                return toBlock(writeBody(finalizerø1));
            })() : !handlerø1 ? (function () {
                return toBlock([]);
            })() : (function () {
                return null;
            })()
        }, writeLocation((form || 0)['form'], (form || 0)['original-form'])));
    }.call(this);
};
installWriter('try', writeTry);
var writeBindingValue = function writeBindingValue(form) {
    return write((form || 0)['init']);
};
var writeBindingParam = function writeBindingParam(form) {
    return writeVar({ 'form': (form || 0)['name'] });
};
var writeBinding = exports.writeBinding = function writeBinding(form) {
    return write({
        'op': 'def',
        'var': form,
        'init': (form || 0)['init'],
        'form': form
    });
};
var writeLet = exports.writeLet = function writeLet(form) {
    return function () {
        var bodyø1 = conj(form, { 'statements': vec(concat((form || 0)['bindings'], (form || 0)['statements'])) });
        return toIife(toBlock(writeBody(bodyø1)));
    }.call(this);
};
installWriter('let', writeLet);
var toRebind = exports.toRebind = function toRebind(form) {
    return function loop() {
        var recur = loop;
        var resultø1 = [];
        var bindingsø1 = (form || 0)['bindings'];
        do {
            recur = isEmpty(bindingsø1) ? resultø1 : (loop[0] = conj(resultø1, {
                'type': 'AssignmentExpression',
                'operator': '=',
                'left': writeBindingVar(first(bindingsø1)),
                'right': {
                    'type': 'MemberExpression',
                    'computed': true,
                    'object': {
                        'type': 'Identifier',
                        'name': 'loop'
                    },
                    'property': {
                        'type': 'Literal',
                        'value': count(resultø1)
                    }
                }
            }), loop[1] = rest(bindingsø1), loop);
        } while (resultø1 = loop[0], bindingsø1 = loop[1], recur === loop);
        return recur;
    }.call(this);
};
var toSequence = exports.toSequence = function toSequence(expressions) {
    return {
        'type': 'SequenceExpression',
        'expressions': expressions
    };
};
var toIife = exports.toIife = function toIife(body, id) {
    return {
        'type': 'CallExpression',
        'arguments': [{ 'type': 'ThisExpression' }],
        'callee': {
            'type': 'MemberExpression',
            'computed': false,
            'object': {
                'type': 'FunctionExpression',
                'id': id,
                'params': [],
                'defaults': [],
                'expression': false,
                'generator': false,
                'rest': null,
                'body': body
            },
            'property': {
                'type': 'Identifier',
                'name': 'call'
            }
        }
    };
};
var toLoopInit = exports.toLoopInit = function toLoopInit() {
    return {
        'type': 'VariableDeclaration',
        'kind': 'var',
        'declarations': [{
                'type': 'VariableDeclarator',
                'id': {
                    'type': 'Identifier',
                    'name': 'recur'
                },
                'init': {
                    'type': 'Identifier',
                    'name': 'loop'
                }
            }]
    };
};
var toDoWhile = exports.toDoWhile = function toDoWhile(body, test) {
    return {
        'type': 'DoWhileStatement',
        'body': body,
        'test': test
    };
};
var toSetRecur = exports.toSetRecur = function toSetRecur(form) {
    return {
        'type': 'AssignmentExpression',
        'operator': '=',
        'left': {
            'type': 'Identifier',
            'name': 'recur'
        },
        'right': write(form)
    };
};
var toLoop = exports.toLoop = function toLoop(form) {
    return toSequence(conj(toRebind(form), {
        'type': 'BinaryExpression',
        'operator': '===',
        'left': {
            'type': 'Identifier',
            'name': 'recur'
        },
        'right': {
            'type': 'Identifier',
            'name': 'loop'
        }
    }));
};
var writeLoop = exports.writeLoop = function writeLoop(form) {
    return function () {
        var statementsø1 = (form || 0)['statements'];
        var resultø1 = (form || 0)['result'];
        var bindingsø1 = (form || 0)['bindings'];
        var loopBodyø1 = conj(map(writeStatement, statementsø1), toStatement(toSetRecur(resultø1)));
        var bodyø1 = concat([toLoopInit()], map(write, bindingsø1), [toDoWhile(toBlock(vec(loopBodyø1)), toLoop(form))], [{
                'type': 'ReturnStatement',
                'argument': {
                    'type': 'Identifier',
                    'name': 'recur'
                }
            }]);
        return toIife(toBlock(vec(bodyø1)), symbol(null, 'loop'));
    }.call(this);
};
installWriter('loop', writeLoop);
var toRecur = exports.toRecur = function toRecur(form) {
    return function loop() {
        var recur = loop;
        var resultø1 = [];
        var paramsø1 = (form || 0)['params'];
        do {
            recur = isEmpty(paramsø1) ? resultø1 : (loop[0] = conj(resultø1, {
                'type': 'AssignmentExpression',
                'operator': '=',
                'right': write(first(paramsø1)),
                'left': {
                    'type': 'MemberExpression',
                    'computed': true,
                    'object': {
                        'type': 'Identifier',
                        'name': 'loop'
                    },
                    'property': {
                        'type': 'Literal',
                        'value': count(resultø1)
                    }
                }
            }), loop[1] = rest(paramsø1), loop);
        } while (resultø1 = loop[0], paramsø1 = loop[1], recur === loop);
        return recur;
    }.call(this);
};
var writeRecur = exports.writeRecur = function writeRecur(form) {
    return toSequence(conj(toRecur(form), {
        'type': 'Identifier',
        'name': 'loop'
    }));
};
installWriter('recur', writeRecur);
var fallbackOverload = exports.fallbackOverload = function fallbackOverload() {
    return {
        'type': 'SwitchCase',
        'test': null,
        'consequent': [{
                'type': 'ThrowStatement',
                'argument': {
                    'type': 'CallExpression',
                    'callee': {
                        'type': 'Identifier',
                        'name': 'RangeError'
                    },
                    'arguments': [{
                            'type': 'Literal',
                            'value': 'Wrong number of arguments passed'
                        }]
                }
            }]
    };
};
var spliceBinding = exports.spliceBinding = function spliceBinding(form) {
    return {
        'op': 'def',
        'id': last((form || 0)['params']),
        'init': {
            'op': 'invoke',
            'callee': {
                'op': 'var',
                'form': symbol(null, 'Array.prototype.slice.call')
            },
            'params': [
                {
                    'op': 'var',
                    'form': symbol(null, 'arguments')
                },
                {
                    'op': 'constant',
                    'form': (form || 0)['arity'],
                    'type': 'number'
                }
            ]
        }
    };
};
var writeOverloadingParams = exports.writeOverloadingParams = function writeOverloadingParams(params) {
    return reduce(function (forms, param) {
        return conj(forms, {
            'op': 'def',
            'id': param,
            'init': {
                'op': 'member-expression',
                'computed': true,
                'target': {
                    'op': 'var',
                    'form': symbol(null, 'arguments')
                },
                'property': {
                    'op': 'constant',
                    'type': 'number',
                    'form': count(forms)
                }
            }
        });
    }, [], params);
};
var writeOverloadingFn = exports.writeOverloadingFn = function writeOverloadingFn(form) {
    return function () {
        var overloadsø1 = map(writeFnOverload, (form || 0)['methods']);
        return {
            'params': [],
            'body': toBlock({
                'type': 'SwitchStatement',
                'discriminant': {
                    'type': 'MemberExpression',
                    'computed': false,
                    'object': {
                        'type': 'Identifier',
                        'name': 'arguments'
                    },
                    'property': {
                        'type': 'Identifier',
                        'name': 'length'
                    }
                },
                'cases': (form || 0)['variadic'] ? overloadsø1 : conj(overloadsø1, fallbackOverload())
            })
        };
    }.call(this);
};
var writeFnOverload = exports.writeFnOverload = function writeFnOverload(form) {
    return function () {
        var paramsø1 = (form || 0)['params'];
        var bindingsø1 = (form || 0)['variadic'] ? conj(writeOverloadingParams(vec(butlast(paramsø1))), spliceBinding(form)) : writeOverloadingParams(paramsø1);
        var statementsø1 = vec(concat(bindingsø1, (form || 0)['statements']));
        return {
            'type': 'SwitchCase',
            'test': !(form || 0)['variadic'] ? {
                'type': 'Literal',
                'value': (form || 0)['arity']
            } : null,
            'consequent': writeBody(conj(form, { 'statements': statementsø1 }))
        };
    }.call(this);
};
var writeSimpleFn = exports.writeSimpleFn = function writeSimpleFn(form) {
    return function () {
        var methodø1 = first((form || 0)['methods']);
        var paramsø1 = (methodø1 || 0)['variadic'] ? vec(butlast((methodø1 || 0)['params'])) : (methodø1 || 0)['params'];
        var bodyø1 = (methodø1 || 0)['variadic'] ? conj(methodø1, { 'statements': vec(cons(spliceBinding(methodø1), (methodø1 || 0)['statements'])) }) : methodø1;
        return {
            'params': map(writeVar, paramsø1),
            'body': toBlock(writeBody(bodyø1))
        };
    }.call(this);
};
var resolve = exports.resolve = function resolve(from, to) {
    return function () {
        var requirerø1 = split(name(from), '.');
        var requirementø1 = split(name(to), '.');
        var isRelativeø1 = !(name(from) === name(to)) && first(requirerø1) === first(requirementø1);
        return isRelativeø1 ? function loop() {
            var recur = loop;
            var fromø2 = requirerø1;
            var toø2 = requirementø1;
            do {
                recur = first(fromø2) === first(toø2) ? (loop[0] = rest(fromø2), loop[1] = rest(toø2), loop) : join('/', concat(['.'], repeat(dec(count(fromø2)), '..'), toø2));
            } while (fromø2 = loop[0], toø2 = loop[1], recur === loop);
            return recur;
        }.call(this) : join('/', requirementø1);
    }.call(this);
};
var idToNs = exports.idToNs = function idToNs(id) {
    return symbol(null, join('*', split(name(id), '.')));
};
var writeRequire = exports.writeRequire = function writeRequire(form, requirer) {
    return function () {
        var nsBindingø1 = {
            'op': 'def',
            'id': {
                'op': 'var',
                'type': 'identifier',
                'form': idToNs((form || 0)['ns'])
            },
            'init': {
                'op': 'invoke',
                'callee': {
                    'op': 'var',
                    'type': 'identifier',
                    'form': symbol(null, 'require')
                },
                'params': [{
                        'op': 'constant',
                        'form': resolve(requirer, (form || 0)['ns'])
                    }]
            }
        };
        var nsAliasø1 = (form || 0)['alias'] ? {
            'op': 'def',
            'id': {
                'op': 'var',
                'type': 'identifier',
                'form': idToNs((form || 0)['alias'])
            },
            'init': (nsBindingø1 || 0)['id']
        } : null;
        var referencesø1 = reduce(function (references, form) {
            return conj(references, {
                'op': 'def',
                'id': {
                    'op': 'var',
                    'type': 'identifier',
                    'form': (form || 0)['rename'] || (form || 0)['name']
                },
                'init': {
                    'op': 'member-expression',
                    'computed': false,
                    'target': (nsBindingø1 || 0)['id'],
                    'property': {
                        'op': 'var',
                        'type': 'identifier',
                        'form': (form || 0)['name']
                    }
                }
            });
        }, [], (form || 0)['refer']);
        return vec(cons(nsBindingø1, nsAliasø1 ? cons(nsAliasø1, referencesø1) : referencesø1));
    }.call(this);
};
var writeNs = exports.writeNs = function writeNs(form) {
    return function () {
        var nodeø1 = (form || 0)['form'];
        var requirerø1 = (form || 0)['name'];
        var nsBindingø1 = {
            'op': 'def',
            'original-form': nodeø1,
            'id': {
                'op': 'var',
                'type': 'identifier',
                'original-form': first(nodeø1),
                'form': symbol(null, '*ns*')
            },
            'init': {
                'op': 'dictionary',
                'form': nodeø1,
                'keys': [
                    {
                        'op': 'var',
                        'type': 'identifier',
                        'original-form': nodeø1,
                        'form': symbol(null, 'id')
                    },
                    {
                        'op': 'var',
                        'type': 'identifier',
                        'original-form': nodeø1,
                        'form': symbol(null, 'doc')
                    }
                ],
                'values': [
                    {
                        'op': 'constant',
                        'type': 'identifier',
                        'original-form': (form || 0)['name'],
                        'form': name((form || 0)['name'])
                    },
                    {
                        'op': 'constant',
                        'original-form': nodeø1,
                        'form': (form || 0)['doc']
                    }
                ]
            }
        };
        var requirementsø1 = vec(concat.apply(null, map(function ($) {
            return writeRequire($, requirerø1);
        }, (form || 0)['require'])));
        return toBlock(map(write, vec(cons(nsBindingø1, requirementsø1))));
    }.call(this);
};
installWriter('ns', writeNs);
var writeFn = exports.writeFn = function writeFn(form) {
    return function () {
        var baseø1 = count((form || 0)['methods']) > 1 ? writeOverloadingFn(form) : writeSimpleFn(form);
        return conj(baseø1, (form || 0)['arrow'] ? {
            'type': 'ArrowFunctionExpression',
            'expression': false
        } : {
            'type': 'FunctionExpression',
            'id': (form || 0)['id'] ? writeVar((form || 0)['id']) : null,
            'generator': false
        });
    }.call(this);
};
installWriter('fn', writeFn);
var write = exports.write = function write(form) {
    return function () {
        var opø1 = (form || 0)['op'];
        var writerø1 = isEqual('invoke', (form || 0)['op']) && isEqual('var', ((form || 0)['callee'] || 0)['op']) && (__specials__ || 0)[name(((form || 0)['callee'] || 0)['form'])];
        return writerø1 ? writeSpecial(writerø1, form) : writeOp((form || 0)['op'], form);
    }.call(this);
};
var write_ = exports.write_ = function write_() {
    var forms = Array.prototype.slice.call(arguments, 0);
    return function () {
        var bodyø1 = map(writeStatement, forms);
        return {
            'type': 'Program',
            'body': bodyø1,
            'loc': inheritLocation(bodyø1)
        };
    }.call(this);
};
var compile = exports.compile = function compile() {
    var args = Array.prototype.slice.call(arguments, 0);
    return count(args) === 1 ? compile({}, first(args)) : generate(write_.apply(null, rest(args)), first(args));
};
var getMacro = exports.getMacro = function getMacro(target, property) {
    var args = Array.prototype.slice.call(arguments, 2);
    return isEmpty(args) ? list.apply(null, [symbol(null, 'aget')].concat([list.apply(null, [symbol(null, 'or')].concat([target], [0]))], [property])) : function () {
        var default_ø1 = first(args);
        return default_ø1 === null ? list.apply(null, [symbol(null, 'get')].concat([target], [property])) : list.apply(null, [symbol(null, 'apply')].concat([symbol(null, 'get')], [[
                target,
                property,
                default_ø1
            ]]));
    }.call(this);
};
installMacro('get', getMacro);
var installLogicalOperator = exports.installLogicalOperator = function installLogicalOperator(callee, operator, fallback) {
    var writeLogicalOperator = function writeLogicalOperator() {
        var operands = Array.prototype.slice.call(arguments, 0);
        return function () {
            var nø1 = count(operands);
            return isEqual(nø1, 0) ? (function () {
                return writeConstant(fallback);
            })() : isEqual(nø1, 1) ? (function () {
                return write(first(operands));
            })() : (function () {
                return reduce(function (left, right) {
                    return {
                        'type': 'LogicalExpression',
                        'operator': operator,
                        'left': left,
                        'right': write(right)
                    };
                }, write(first(operands)), rest(operands));
            })();
        }.call(this);
    };
    return installSpecial(callee, writeLogicalOperator);
};
installLogicalOperator('or', '||', null);
installLogicalOperator('and', '&&', true);
var installUnaryOperator = exports.installUnaryOperator = function installUnaryOperator(callee, operator, isPrefix) {
    var writeUnaryOperator = function writeUnaryOperator() {
        var params = Array.prototype.slice.call(arguments, 0);
        return count(params) === 1 ? {
            'type': 'UnaryExpression',
            'operator': operator,
            'argument': write(first(params)),
            'prefix': isPrefix
        } : errorArgCount(callee, count(params));
    };
    return installSpecial(callee, writeUnaryOperator);
};
installUnaryOperator('not', '!');
installUnaryOperator('bit-not', '~');
var installBinaryOperator = exports.installBinaryOperator = function installBinaryOperator(callee, operator) {
    var writeBinaryOperator = function writeBinaryOperator() {
        var params = Array.prototype.slice.call(arguments, 0);
        return count(params) < 2 ? errorArgCount(callee, count(params)) : reduce(function (left, right) {
            return {
                'type': 'BinaryExpression',
                'operator': operator,
                'left': left,
                'right': write(right)
            };
        }, write(first(params)), rest(params));
    };
    return installSpecial(callee, writeBinaryOperator);
};
installBinaryOperator('bit-and', '&');
installBinaryOperator('bit-or', '|');
installBinaryOperator('bit-xor', '^');
installBinaryOperator('bit-shift-left', '<<');
installBinaryOperator('bit-shift-right', '>>');
installBinaryOperator('bit-shift-right-zero-fill', '>>>');
var installArithmeticOperator = exports.installArithmeticOperator = function installArithmeticOperator(callee, operator, isValid, fallback) {
    var writeBinaryOperator = function writeBinaryOperator(left, right) {
        return {
            'type': 'BinaryExpression',
            'operator': name(operator),
            'left': left,
            'right': write(right)
        };
    };
    var writeArithmeticOperator = function writeArithmeticOperator() {
        var params = Array.prototype.slice.call(arguments, 0);
        return function () {
            var nø1 = count(params);
            return isValid && !isValid(nø1) ? (function () {
                return errorArgCount(name(callee), nø1);
            })() : nø1 == 0 ? (function () {
                return writeLiteral(fallback);
            })() : nø1 == 1 ? (function () {
                return reduce(writeBinaryOperator, writeLiteral(fallback), params);
            })() : (function () {
                return reduce(writeBinaryOperator, write(first(params)), rest(params));
            })();
        }.call(this);
    };
    return installSpecial(callee, writeArithmeticOperator);
};
installArithmeticOperator('+', '+', null, 0);
installArithmeticOperator('-', '-', function ($) {
    return $ >= 1;
}, 0);
installArithmeticOperator('*', '*', null, 1);
installArithmeticOperator(keyword('/'), keyword('/'), function ($) {
    return $ >= 1;
}, 1);
installArithmeticOperator('rem', keyword('%'), function ($) {
    return $ == 2;
}, 1);
var installComparisonOperator = exports.installComparisonOperator = function installComparisonOperator(callee, operator, fallback) {
    var writeComparisonOperator = function writeComparisonOperator() {
        var args = Array.prototype.slice.call(arguments, 0);
        return function () {
            var nø1 = count(args);
            return nø1 === 0 ? (function () {
                return errorArgCount(callee, 0);
            })() : nø1 === 1 ? (function () {
                return toSequence([
                    write(first(args)),
                    writeLiteral(fallback)
                ]);
            })() : nø1 === 2 ? (function () {
                return {
                    'type': 'BinaryExpression',
                    'operator': operator,
                    'left': write(first(args)),
                    'right': write(second(args))
                };
            })() : (function () {
                return function () {
                    var leftø1 = first(args);
                    var rightø1 = second(args);
                    var moreø1 = rest(rest(args));
                    return reduce(function (left, right) {
                        return {
                            'type': 'LogicalExpression',
                            'operator': '&&',
                            'left': left,
                            'right': {
                                'type': 'BinaryExpression',
                                'operator': operator,
                                'left': isEqual('LogicalExpression', (left || 0)['type']) ? ((left || 0)['right'] || 0)['right'] : (left || 0)['right'],
                                'right': write(right)
                            }
                        };
                    }, writeComparisonOperator(leftø1, rightø1), moreø1);
                }.call(this);
            })();
        }.call(this);
    };
    return installSpecial(callee, writeComparisonOperator);
};
installComparisonOperator('==', '==', true);
installComparisonOperator('>', '>', true);
installComparisonOperator('>=', '>=', true);
installComparisonOperator('<', '<', true);
installComparisonOperator('<=', '<=', true);
var isWriteIdentical = exports.isWriteIdentical = function isWriteIdentical() {
    var params = Array.prototype.slice.call(arguments, 0);
    return count(params) === 2 ? {
        'type': 'BinaryExpression',
        'operator': '===',
        'left': write(first(params)),
        'right': write(second(params))
    } : errorArgCount('identical?', count(params));
};
installSpecial('identical?', isWriteIdentical);
var isWriteInstance = exports.isWriteInstance = function isWriteInstance() {
    var params = Array.prototype.slice.call(arguments, 0);
    return function () {
        var constructorø1 = first(params);
        var instanceø1 = second(params);
        return count(params) < 1 ? errorArgCount('instance?', count(params)) : {
            'type': 'BinaryExpression',
            'operator': 'instanceof',
            'left': instanceø1 ? write(instanceø1) : writeConstant(instanceø1),
            'right': write(constructorø1)
        };
    }.call(this);
};
installSpecial('instance?', isWriteInstance);
var expandApply = exports.expandApply = function expandApply(f) {
    var params = Array.prototype.slice.call(arguments, 1);
    return function () {
        var prefixø1 = vec(butlast(params));
        return isEmpty(prefixø1) ? list.apply(null, [symbol(null, '.apply')].concat([f], [null], vec(params))) : list.apply(null, [symbol(null, '.apply')].concat([f], [null], [list.apply(null, [symbol(null, '.concat')].concat([prefixø1], [last(params)]))]));
    }.call(this);
};
installMacro('apply', expandApply);
var expandPrint = exports.expandPrint = function expandPrint(_andForm) {
    var more = Array.prototype.slice.call(arguments, 1);
    return function () {
        var opø1 = withMeta(symbol(null, 'console.log'), meta(_andForm));
        return list.apply(null, [opø1].concat(vec(more)));
    }.call(this);
};
installMacro('print', withMeta(expandPrint, { 'implicit': ['&form'] }));
var expandStr = exports.expandStr = function expandStr() {
    var forms = Array.prototype.slice.call(arguments, 0);
    return list.apply(null, [symbol(null, '+')].concat([''], vec(forms)));
};
installMacro('str', expandStr);
var expandDebug = exports.expandDebug = function expandDebug() {
    return symbol(null, 'debugger');
};
installMacro('debugger!', expandDebug);
var expandAssert = exports.expandAssert = function expandAssert(x) {
    var args = Array.prototype.slice.call(arguments, 1);
    return function () {
        var messageø1 = isEmpty(args) ? '' : first(args);
        var formø1 = prStr(x);
        return list.apply(null, [symbol(null, 'if')].concat([list.apply(null, [symbol(null, 'not')].concat([x]))], [list.apply(null, [symbol(null, 'throw')].concat([list.apply(null, [symbol(null, 'Error')].concat([list.apply(null, [symbol(null, 'str')].concat(['Assert failed: '], [messageø1], [formø1]))]))]))]));
    }.call(this);
};
installMacro('assert', expandAssert);
var expandTypestr = exports.expandTypestr = function expandTypestr(it) {
    return function () {
        var prefixø1 = '[object ';
        var suffixø1 = ']';
        return list.apply(null, [symbol(null, '->')].concat([list.apply(null, [symbol(null, '.call')].concat([symbol(null, 'Object.prototype.to-string')], [it]))], [list.apply(null, [symbol(null, '.slice')].concat([count(prefixø1)], [0 - count(suffixø1)]))]));
    }.call(this);
};
var expandDefprotocol = exports.expandDefprotocol = function expandDefprotocol(_andEnv, id) {
    var forms = Array.prototype.slice.call(arguments, 2);
    return function () {
        var nsø1 = name(((_andEnv || 0)['ns'] || 0)['name']);
        var protocolNameø1 = name(id);
        var protocolDocø1 = isString(first(forms)) ? first(forms) : null;
        var protocolMethodsø1 = protocolDocø1 ? rest(forms) : forms;
        var notSupportedø1 = function (method) {
            return list.apply(null, [symbol(null, 'lambda')].concat([list.apply(null, [symbol(null, '%')].concat())], [list.apply(null, [symbol(null, 'throw')].concat([list.apply(null, [symbol(null, 'str')].concat(['' + 'No protocol method ' + protocolNameø1 + '.' + method + ' defined for type '], [expandTypestr(symbol(null, '%'))], [': '], [symbol(null, '%')]))]))]));
        };
        var protocolø1 = mapv(function (method) {
            return function () {
                var methodNameø1 = first(method);
                var idø2 = idToNs('' + nsø1 + '$' + protocolNameø1 + '$' + name(methodNameø1));
                return {
                    'id': methodNameø1,
                    'fn': list.apply(null, [symbol(null, 'lambda')].concat([idø2], [list.apply(null, [symbol(null, 'self')].concat())], [list.apply(null, [symbol(null, '.apply')].concat([list.apply(null, [symbol(null, 'or')].concat([list.apply(null, [symbol(null, 'if')].concat([list.apply(null, [symbol(null, 'or')].concat([list.apply(null, [symbol(null, 'identical?')].concat([symbol(null, 'self')], [symbol(null, 'null')]))], [list.apply(null, [symbol(null, 'identical?')].concat([symbol(null, 'self')], [null]))]))], [list.apply(null, [symbol(null, '.-nil')].concat([idø2]))], [list.apply(null, [symbol(null, 'or')].concat([list.apply(null, [symbol(null, 'aget')].concat([symbol(null, 'self')], [list.apply(null, [symbol(null, 'quote')].concat([idø2]))]))], [list.apply(null, [symbol(null, 'aget')].concat([idø2], [expandTypestr(symbol(null, 'self'))]))], [list.apply(null, [symbol(null, '.-_')].concat([idø2]))]))]))], [notSupportedø1(name(idø2))]))], [symbol(null, 'self')], [symbol(null, 'arguments')]))]))
                };
            }.call(this);
        }, protocolMethodsø1);
        var fnsø1 = map(function (form) {
            return list.apply(null, [symbol(null, 'defvar')].concat([(form || 0)['id']], [list.apply(null, [symbol(null, 'aget')].concat([id], [list.apply(null, [symbol(null, 'quote')].concat([(form || 0)['id']]))]))]));
        }, protocolø1);
        var satisfyø1 = { 'wisp_core$IProtocol$id': '' + nsø1 + '/' + protocolNameø1 };
        var bodyø1 = reduce(function (body, method) {
            return assoc(body, (method || 0)['id'], (method || 0)['fn']);
        }, satisfyø1, protocolø1);
        return list.apply(null, [withMeta(symbol(null, 'progn'), { 'block': true })].concat([list.apply(null, [symbol(null, 'defvar')].concat([id], [bodyø1]))], vec(fnsø1), [id]));
    }.call(this);
};
installMacro('defprotocol', withMeta(expandDefprotocol, { 'implicit': ['&env'] }));
var expandDeftype = exports.expandDeftype = function expandDeftype(id, fields) {
    var forms = Array.prototype.slice.call(arguments, 2);
    return function () {
        var typeInitø1 = map(function (field) {
            return list.apply(null, [symbol(null, 'setf')].concat([list.apply(null, [symbol(null, 'aget')].concat([symbol(null, 'this')], [list.apply(null, [symbol(null, 'quote')].concat([field]))]))], [field]));
        }, fields);
        var constructorø1 = conj(typeInitø1, symbol(null, 'this'));
        var methodInitø1 = map(function (field) {
            return list.apply(null, [symbol(null, 'defvar')].concat([field], [list.apply(null, [symbol(null, 'aget')].concat([symbol(null, 'this')], [list.apply(null, [symbol(null, 'quote')].concat([field]))]))]));
        }, fields);
        var makeMethodø1 = function (protocol, form) {
            return function () {
                var methodNameø1 = first(form);
                var paramsø1 = second(form);
                var bodyø1 = rest(rest(form));
                var fieldNameø1 = isEqual(name(protocol), 'Object') ? list.apply(null, [symbol(null, 'quote')].concat([methodNameø1])) : list.apply(null, [symbol(null, '.-name')].concat([list.apply(null, [symbol(null, 'aget')].concat([protocol], [list.apply(null, [symbol(null, 'quote')].concat([methodNameø1]))]))]));
                return list.apply(null, [symbol(null, 'setf')].concat([list.apply(null, [symbol(null, 'aget')].concat([list.apply(null, [symbol(null, '.-prototype')].concat([id]))], [fieldNameø1]))], [list.apply(null, [symbol(null, 'lambda')].concat([paramsø1], vec(methodInitø1), vec(bodyø1)))]));
            }.call(this);
        };
        var satisfyø1 = function (protocol) {
            return list.apply(null, [symbol(null, 'setf')].concat([list.apply(null, [symbol(null, 'aget')].concat([list.apply(null, [symbol(null, '.-prototype')].concat([id]))], [list.apply(null, [symbol(null, '.-wisp_core$IProtocol$id')].concat([protocol]))]))], [true]));
        };
        var bodyø1 = reduce(function (type, form) {
            return isList(form) ? conj(type, { 'body': conj((type || 0)['body'], makeMethodø1((type || 0)['protocol'], form)) }) : conj(type, {
                'protocol': form,
                'body': conj((type || 0)['body'], satisfyø1(form))
            });
        }, {
            'protocol': null,
            'body': []
        }, forms);
        var methodsø1 = (bodyø1 || 0)['body'];
        return list.apply(null, [symbol(null, 'defvar')].concat([id], [list.apply(null, [symbol(null, 'progn')].concat([list.apply(null, [symbol(null, 'defun-')].concat([id], [fields], vec(constructorø1)))], vec(methodsø1), [id]))]));
    }.call(this);
};
installMacro('deftype', expandDeftype);
installMacro('defrecord', expandDeftype);
var expandExtendType = exports.expandExtendType = function expandExtendType(type) {
    var forms = Array.prototype.slice.call(arguments, 1);
    return function () {
        var isDefaultTypeø1 = isEqual(type, symbol(null, 'default'));
        var isNilTypeø1 = isNil(type);
        var typeNameø1 = isNil(type) ? (function () {
            return symbol('nil');
        })() : isEqual(type, symbol(null, 'default')) ? (function () {
            return symbol(null, '_');
        })() : isEqual(type, symbol(null, 'number')) ? (function () {
            return symbol(null, 'Number');
        })() : isEqual(type, symbol(null, 'string')) ? (function () {
            return symbol(null, 'String');
        })() : isEqual(type, symbol(null, 'boolean')) ? (function () {
            return symbol(null, 'Boolean');
        })() : isEqual(type, symbol(null, 'vector')) ? (function () {
            return symbol(null, 'Array');
        })() : isEqual(type, symbol(null, 'function')) ? (function () {
            return symbol(null, 'Function');
        })() : isEqual(type, symbol(null, 're-pattern')) ? (function () {
            return symbol(null, 'RegExp');
        })() : isEqual(namespace(type), 'js') ? (function () {
            return type;
        })() : (function () {
            return null;
        })();
        var satisfyø1 = function (protocol) {
            return typeNameø1 ? list.apply(null, [symbol(null, 'setf')].concat([list.apply(null, [symbol(null, 'aget')].concat([protocol], [list.apply(null, [symbol(null, 'quote')].concat([symbol('' + 'wisp_core$IProtocol$' + name(typeNameø1))]))]))], [true])) : list.apply(null, [symbol(null, 'setf')].concat([list.apply(null, [symbol(null, 'aget')].concat([list.apply(null, [symbol(null, '.-prototype')].concat([type]))], [list.apply(null, [symbol(null, '.-wisp_core$IProtocol$id')].concat([protocol]))]))], [true]));
        };
        var makeMethodø1 = function (protocol, form) {
            return function () {
                var methodNameø1 = first(form);
                var paramsø1 = second(form);
                var bodyø1 = rest(rest(form));
                var targetø1 = typeNameø1 ? list.apply(null, [symbol(null, 'aget')].concat([list.apply(null, [symbol(null, 'aget')].concat([protocol], [list.apply(null, [symbol(null, 'quote')].concat([methodNameø1]))]))], [list.apply(null, [symbol(null, 'quote')].concat([typeNameø1]))])) : list.apply(null, [symbol(null, 'aget')].concat([list.apply(null, [symbol(null, '.-prototype')].concat([type]))], [list.apply(null, [symbol(null, '.-name')].concat([list.apply(null, [symbol(null, 'aget')].concat([protocol], [list.apply(null, [symbol(null, 'quote')].concat([methodNameø1]))]))]))]));
                return list.apply(null, [symbol(null, 'setf')].concat([targetø1], [list.apply(null, [symbol(null, 'lambda')].concat([paramsø1], vec(bodyø1)))]));
            }.call(this);
        };
        var bodyø1 = reduce(function (body, form) {
            return isList(form) ? conj(body, { 'methods': conj((body || 0)['methods'], makeMethodø1((body || 0)['protocol'], form)) }) : conj(body, {
                'protocol': form,
                'methods': conj((body || 0)['methods'], satisfyø1(form))
            });
        }, {
            'protocol': null,
            'methods': []
        }, forms);
        var methodsø1 = (bodyø1 || 0)['methods'];
        return list.apply(null, [symbol(null, 'progn')].concat(vec(methodsø1), [null]));
    }.call(this);
};
installMacro('extend-type', expandExtendType);
var expandExtendProtocol = exports.expandExtendProtocol = function expandExtendProtocol(protocol) {
    var forms = Array.prototype.slice.call(arguments, 1);
    return function () {
        var specsø1 = reduce(function (specs, form) {
            return isList(form) ? cons({
                'type': (first(specs) || 0)['type'],
                'methods': conj((first(specs) || 0)['methods'], form)
            }, rest(specs)) : cons({
                'type': form,
                'methods': []
            }, specs);
        }, null, forms);
        var bodyø1 = map(function (form) {
            return list.apply(null, [symbol(null, 'extend-type')].concat([(form || 0)['type']], [protocol], vec((form || 0)['methods'])));
        }, specsø1);
        return list.apply(null, [symbol(null, 'progn')].concat(vec(bodyø1), [null]));
    }.call(this);
};
installMacro('extend-protocol', expandExtendProtocol);
var asetExpand = exports.asetExpand = function asetExpand(target, field, third) {
    var restArgs = Array.prototype.slice.call(arguments, 3);
    return isEmpty(restArgs) ? list.apply(null, [symbol(null, 'setf')].concat([list.apply(null, [symbol(null, 'aget')].concat([target], [field]))], [third])) : function () {
        var subFieldsAndValueø1 = cons(third, restArgs);
        var resolvedTargetø1 = reduce(function (form, node) {
            return list.apply(null, [symbol(null, 'aget')].concat([form], [node]));
        }, list.apply(null, [symbol(null, 'aget')].concat([target], [field])), butlast(subFieldsAndValueø1));
        var valueø1 = last(subFieldsAndValueø1);
        return list.apply(null, [symbol(null, 'setf')].concat([resolvedTargetø1], [valueø1]));
    }.call(this);
};
installMacro('aset', asetExpand);
var alengthExpand = exports.alengthExpand = function alengthExpand(array) {
    return list.apply(null, [symbol(null, '.-length')].concat([array]));
};
installMacro('alength', alengthExpand);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndpc3AvYmFja2VuZC9lc2NvZGVnZW4vd3JpdGVyLndpc3AiXSwibmFtZXMiOlsiX25zXyIsImlkIiwiZG9jIiwicmVhZEZyb21TdHJpbmciLCJtZXRhIiwid2l0aE1ldGEiLCJpc1N5bWJvbCIsInN5bWJvbCIsImlzS2V5d29yZCIsImtleXdvcmQiLCJuYW1lc3BhY2UiLCJpc1VucXVvdGUiLCJpc1VucXVvdGVTcGxpY2luZyIsImlzUXVvdGUiLCJpc1N5bnRheFF1b3RlIiwibmFtZSIsImdlbnN5bSIsInByU3RyIiwiaXNFbXB0eSIsImNvdW50IiwiaXNMaXN0IiwibGlzdCIsImZpcnN0Iiwic2Vjb25kIiwidGhpcmQiLCJyZXN0IiwiY29ucyIsImNvbmoiLCJidXRsYXN0IiwicmV2ZXJzZSIsInJlZHVjZSIsInZlYyIsImxhc3QiLCJtYXAiLCJtYXB2IiwiZmlsdGVyIiwidGFrZSIsImNvbmNhdCIsInBhcnRpdGlvbiIsInJlcGVhdCIsImludGVybGVhdmUiLCJhc3NvYyIsImlzT2RkIiwiaXNEaWN0aW9uYXJ5IiwiZGljdGlvbmFyeSIsIm1lcmdlIiwia2V5cyIsInZhbHMiLCJpc0NvbnRhaW5zVmVjdG9yIiwibWFwRGljdGlvbmFyeSIsImlzU3RyaW5nIiwiaXNOdW1iZXIiLCJpc1ZlY3RvciIsImlzQm9vbGVhbiIsInN1YnMiLCJyZUZpbmQiLCJpc1RydWUiLCJpc0ZhbHNlIiwiaXNOaWwiLCJpc1JlUGF0dGVybiIsImluYyIsImRlYyIsInN0ciIsImNoYXIiLCJpbnQiLCJpc0VxdWFsIiwiaXNTdHJpY3RFcXVhbCIsImdldCIsInNwbGl0Iiwiam9pbiIsInVwcGVyQ2FzZSIsInJlcGxhY2UiLCJ0cmltbCIsImluc3RhbGxNYWNybyIsImdlbmVyYXRlIiwiX191bmlxdWVDaGFyX18iLCJleHBvcnRzIiwidG9DYW1lbEpvaW4iLCJwcmVmaXgiLCJrZXkiLCJ0b1ByaXZhdGVQcmVmaXgiLCJzcGFjZURlbGltaXRlZMO4MSIsImxlZnRUcmltbWVkw7gxIiwibsO4MSIsInRyYW5zbGF0ZUlkZW50aWZpZXJXb3JkIiwiZm9ybSIsImlkw7gxIiwidHJhbnNsYXRlSWRlbnRpZmllciIsIm5zw7gxIiwiZXJyb3JBcmdDb3VudCIsImNhbGxlZSIsIm4iLCJTeW50YXhFcnJvciIsImluaGVyaXRMb2NhdGlvbiIsImJvZHkiLCJzdGFydMO4MSIsImVuZMO4MSIsIndyaXRlTG9jYXRpb24iLCJvcmlnaW5hbCIsImRhdGHDuDEiLCJpbmhlcml0ZWTDuDEiLCJfX3dyaXRlcnNfXyIsImluc3RhbGxXcml0ZXIiLCJvcCIsIndyaXRlciIsIndyaXRlT3AiLCJ3cml0ZXLDuDEiLCJfX3NwZWNpYWxzX18iLCJpbnN0YWxsU3BlY2lhbCIsIndyaXRlU3BlY2lhbCIsIndyaXRlTmlsIiwibnVsbCIsIndyaXRlTGl0ZXJhbCIsIndyaXRlTGlzdCIsIndyaXRlIiwid3JpdGVTeW1ib2wiLCJ3cml0ZUNvbnN0YW50Iiwid3JpdGVOdW1iZXIiLCJ2YWx1ZU9mIiwid3JpdGVTdHJpbmciLCIkIiwid3JpdGVLZXl3b3JkIiwidG9JZGVudGlmaWVyIiwid3JpdGVCaW5kaW5nVmFyIiwiYmFzZUlkw7gxIiwicmVzb2x2ZWRJZMO4MSIsIndyaXRlVmFyIiwibm9kZSIsIndyaXRlSW52b2tlIiwid3JpdGVWZWN0b3IiLCJ3cml0ZURpY3Rpb25hcnkiLCJwcm9wZXJ0aWVzw7gxIiwicGFpciIsImtlecO4MSIsInZhbHVlw7gxIiwid3JpdGVFeHBvcnQiLCJ3cml0ZURlZiIsIndyaXRlQmluZGluZyIsImluaXTDuDEiLCJ3cml0ZVRocm93IiwidG9FeHByZXNzaW9uIiwid3JpdGVOZXciLCJ3cml0ZVNldCIsIndyaXRlQWdldCIsIl9fc3RhdGVtZW50c19fIiwid3JpdGVTdGF0ZW1lbnQiLCJ0b1N0YXRlbWVudCIsInRvUmV0dXJuIiwid3JpdGVCb2R5Iiwic3RhdGVtZW50c8O4MSIsInJlc3VsdMO4MSIsInRvQmxvY2siLCJ0b1NlcXVlbmNlIiwid3JpdGVEbyIsIndyaXRlSWYiLCJ3cml0ZVRyeSIsImhhbmRsZXLDuDEiLCJmaW5hbGl6ZXLDuDEiLCJ3cml0ZUJpbmRpbmdWYWx1ZSIsIndyaXRlQmluZGluZ1BhcmFtIiwid3JpdGVMZXQiLCJib2R5w7gxIiwidG9JaWZlIiwidG9SZWJpbmQiLCJiaW5kaW5nc8O4MSIsImV4cHJlc3Npb25zIiwidG9Mb29wSW5pdCIsInRvRG9XaGlsZSIsInRlc3QiLCJ0b1NldFJlY3VyIiwidG9Mb29wIiwid3JpdGVMb29wIiwibG9vcEJvZHnDuDEiLCJ0b1JlY3VyIiwicGFyYW1zw7gxIiwid3JpdGVSZWN1ciIsImZhbGxiYWNrT3ZlcmxvYWQiLCJzcGxpY2VCaW5kaW5nIiwid3JpdGVPdmVybG9hZGluZ1BhcmFtcyIsInBhcmFtcyIsImZvcm1zIiwicGFyYW0iLCJ3cml0ZU92ZXJsb2FkaW5nRm4iLCJvdmVybG9hZHPDuDEiLCJ3cml0ZUZuT3ZlcmxvYWQiLCJ3cml0ZVNpbXBsZUZuIiwibWV0aG9kw7gxIiwicmVzb2x2ZSIsImZyb20iLCJ0byIsInJlcXVpcmVyw7gxIiwicmVxdWlyZW1lbnTDuDEiLCJpc1JlbGF0aXZlw7gxIiwiZnJvbcO4MiIsInRvw7gyIiwiaWRUb05zIiwid3JpdGVSZXF1aXJlIiwicmVxdWlyZXIiLCJuc0JpbmRpbmfDuDEiLCJuc0FsaWFzw7gxIiwicmVmZXJlbmNlc8O4MSIsInJlZmVyZW5jZXMiLCJ3cml0ZU5zIiwibm9kZcO4MSIsInJlcXVpcmVtZW50c8O4MSIsIndyaXRlRm4iLCJiYXNlw7gxIiwib3DDuDEiLCJ3cml0ZV8iLCJjb21waWxlIiwiYXJncyIsImdldE1hY3JvIiwidGFyZ2V0IiwicHJvcGVydHkiLCJkZWZhdWx0X8O4MSIsImluc3RhbGxMb2dpY2FsT3BlcmF0b3IiLCJvcGVyYXRvciIsImZhbGxiYWNrIiwid3JpdGVMb2dpY2FsT3BlcmF0b3IiLCJvcGVyYW5kcyIsImxlZnQiLCJyaWdodCIsImluc3RhbGxVbmFyeU9wZXJhdG9yIiwiaXNQcmVmaXgiLCJ3cml0ZVVuYXJ5T3BlcmF0b3IiLCJpbnN0YWxsQmluYXJ5T3BlcmF0b3IiLCJ3cml0ZUJpbmFyeU9wZXJhdG9yIiwiaW5zdGFsbEFyaXRobWV0aWNPcGVyYXRvciIsImlzVmFsaWQiLCJ3cml0ZUFyaXRobWV0aWNPcGVyYXRvciIsImluc3RhbGxDb21wYXJpc29uT3BlcmF0b3IiLCJ3cml0ZUNvbXBhcmlzb25PcGVyYXRvciIsImxlZnTDuDEiLCJyaWdodMO4MSIsIm1vcmXDuDEiLCJpc1dyaXRlSWRlbnRpY2FsIiwiaXNXcml0ZUluc3RhbmNlIiwiY29uc3RydWN0b3LDuDEiLCJpbnN0YW5jZcO4MSIsImV4cGFuZEFwcGx5IiwiZiIsInByZWZpeMO4MSIsImV4cGFuZFByaW50IiwiX2FuZEZvcm0iLCJtb3JlIiwiZXhwYW5kU3RyIiwiZXhwYW5kRGVidWciLCJleHBhbmRBc3NlcnQiLCJ4IiwibWVzc2FnZcO4MSIsImZvcm3DuDEiLCJleHBhbmRUeXBlc3RyIiwiaXQiLCJzdWZmaXjDuDEiLCJleHBhbmREZWZwcm90b2NvbCIsIl9hbmRFbnYiLCJwcm90b2NvbE5hbWXDuDEiLCJwcm90b2NvbERvY8O4MSIsInByb3RvY29sTWV0aG9kc8O4MSIsIm5vdFN1cHBvcnRlZMO4MSIsIm1ldGhvZCIsInByb3RvY29sw7gxIiwibWV0aG9kTmFtZcO4MSIsImlkw7gyIiwiZm5zw7gxIiwic2F0aXNmecO4MSIsImV4cGFuZERlZnR5cGUiLCJmaWVsZHMiLCJ0eXBlSW5pdMO4MSIsImZpZWxkIiwibWV0aG9kSW5pdMO4MSIsIm1ha2VNZXRob2TDuDEiLCJwcm90b2NvbCIsImZpZWxkTmFtZcO4MSIsInR5cGUiLCJtZXRob2Rzw7gxIiwiZXhwYW5kRXh0ZW5kVHlwZSIsImlzRGVmYXVsdFR5cGXDuDEiLCJpc05pbFR5cGXDuDEiLCJ0eXBlTmFtZcO4MSIsInRhcmdldMO4MSIsImV4cGFuZEV4dGVuZFByb3RvY29sIiwic3BlY3PDuDEiLCJzcGVjcyIsImFzZXRFeHBhbmQiLCJyZXN0QXJncyIsInN1YkZpZWxkc0FuZFZhbHVlw7gxIiwicmVzb2x2ZWRUYXJnZXTD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LFFBQVosQ0FBakI7QUFBQSxRQUNELElBQUFFLGdCLEdBQWlCalEsTUFBRCxDQUFRLFVBQVN1RCxJQUFULEVBQWMwQyxJQUFkLEVBQ0M7QUFBQSxtQixVQUFBLEMsSUFBQSxFLE9BQUUsQyxJQUFBLEUsTUFBQSxDLFVBQU0xQyxJLElBQU0wQyxJLEVBQWQ7QUFBQSxTQURULEUsVUFFTyxDLElBQUEsRSxPQUFFLEMsSUFBQSxFLE1BQUEsQyxVQUFNcUYsTSxJQUFReUQsSyxFQUFoQixDQUZQLEVBR1FqUCxPQUFELENBQVNrUSxtQkFBVCxDQUhQLENBQWhCLENBREM7QUFBQSxRQUtELElBQUF4SixPLEdBQU90RyxJQUFELENBQU04UCxtQkFBTixDQUFOLENBTEM7QUFBQSxRQU1OLE8sVUFBQSxDLElBQUEsRSxPQUFFLEMsSUFBQSxFLE1BQUEsQyxVQUFNQyxnQixJQUFpQnpKLE8sRUFBekIsRUFOTTtBQUFBLEssS0FBUixDLElBQUEsQ0FGRixDO0NBRkYsQztBQVdDN0QsWUFBRCxDLE1BQUEsRUFBc0JtTixVQUF0QixFO0FBRUEsSUFBT0ksYUFBQSxHQUFBcE4sT0FBQSxDQUFBb04sYUFBQSxHQUFQLFNBQU9BLGFBQVAsQ0FDR0MsS0FESCxFQUdFO0FBQUEsVyxVQUFBLEMsSUFBQSxFLE9BQUUsQyxJQUFBLEUsVUFBQSxDLFVBQVVBLEssRUFBWjtBQUFBLENBSEYsQztBQUlDeE4sWUFBRCxDLFNBQUEsRUFBeUJ1TixhQUF6QiIsInNvdXJjZXNDb250ZW50IjpbIihucyB3aXNwLmJhY2tlbmQuZXNjb2RlZ2VuLndyaXRlclxuICAoOnJlcXVpcmUgW3dpc3AucmVhZGVyIDpyZWZlciBbcmVhZC1mcm9tLXN0cmluZ11dXG4gICAgICAgICAgICBbd2lzcC5hc3QgOnJlZmVyIFttZXRhIHdpdGgtbWV0YSBzeW1ib2w/IHN5bWJvbCBrZXl3b3JkPyBrZXl3b3JkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lc3BhY2UgdW5xdW90ZT8gdW5xdW90ZS1zcGxpY2luZz8gcXVvdGU/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzeW50YXgtcXVvdGU/IG5hbWUgZ2Vuc3ltIHByLXN0cl1dXG4gICAgICAgICAgICBbd2lzcC5zZXF1ZW5jZSA6cmVmZXIgW2VtcHR5PyBjb3VudCBsaXN0PyBsaXN0IGZpcnN0IHNlY29uZCB0aGlyZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN0IGNvbnMgY29uaiBidXRsYXN0IHJldmVyc2UgcmVkdWNlIHZlY1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0IG1hcCBtYXB2IGZpbHRlciB0YWtlIGNvbmNhdCBwYXJ0aXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVwZWF0IGludGVybGVhdmUgYXNzb2NdXVxuICAgICAgICAgICAgW3dpc3AucnVudGltZSA6cmVmZXIgW29kZD8gZGljdGlvbmFyeT8gZGljdGlvbmFyeSBtZXJnZSBrZXlzIHZhbHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250YWlucy12ZWN0b3I/IG1hcC1kaWN0aW9uYXJ5IHN0cmluZz9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBudW1iZXI/IHZlY3Rvcj8gYm9vbGVhbj8gc3VicyByZS1maW5kIHRydWU/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFsc2U/IG5pbD8gcmUtcGF0dGVybj8gaW5jIGRlYyBzdHIgY2hhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludCA9ID09IGdldF1dXG4gICAgICAgICAgICBbd2lzcC5zdHJpbmcgOnJlZmVyIFtzcGxpdCBqb2luIHVwcGVyLWNhc2UgcmVwbGFjZSB0cmltbF1dXG4gICAgICAgICAgICBbd2lzcC5leHBhbmRlciA6cmVmZXIgW2luc3RhbGwtbWFjcm8hXV1cbiAgICAgICAgICAgIFtlc2NvZGVnZW4gOnJlZmVyIFtnZW5lcmF0ZV1dKSlcblxuXG47OyBEZWZpbmUgY2hhcmFjdGVyIHRoYXQgaXMgdmFsaWQgSlMgaWRlbnRpZmllciB0aGF0IHdpbGxcbjs7IGJlIHVzZWQgaW4gZ2VuZXJhdGVkIHN5bWJvbHMgdG8gYXZvaWQgY29uZmxpY3RzXG47OyBodHRwOi8vd3d3LmZpbGVmb3JtYXQuaW5mby9pbmZvL3VuaWNvZGUvY2hhci9mOC9pbmRleC5odG1cbihkZWZ2YXIgKip1bmlxdWUtY2hhcioqIFwiw7hcIilcblxuKGRlZnVuIC0+Y2FtZWwtam9pblxuICAocHJlZml4IGtleSlcbiAgXCJUYWtlcyBkYXNoIGRlbGltaXRlZCBuYW1lIFwiXG4gIChzdHIgcHJlZml4XG4gICAgICAgKGlmIChhbmQgKG5vdCAoZW1wdHk/IHByZWZpeCkpXG4gICAgICAgICAgICAgICAgKG5vdCAoZW1wdHk/IGtleSkpKVxuICAgICAgICAgKHN0ciAodXBwZXItY2FzZSAoZ2V0IGtleSAwKSkgKHN1YnMga2V5IDEpKVxuICAgICAgICAga2V5KSkpXG5cbihkZWZ1biAtPnByaXZhdGUtcHJlZml4XG4gIChpZClcbiAgXCJUcmFuc2xhdGUgcHJpdmF0ZSBpZGVudGlmaWVycyBsaWtlIC1mb28gdG8gYSBKUyBlcXVpdmFsZW50XG4gIGZvcm1zIGxpa2UgX2Zvb1wiXG4gIChsZXQqICgoc3BhY2UtZGVsaW1pdGVkIChqb2luIFwiIFwiIChzcGxpdCBpZCAjXCItXCIpKSlcbiAgICAgICAgKGxlZnQtdHJpbW1lZCAodHJpbWwgc3BhY2UtZGVsaW1pdGVkKSlcbiAgICAgICAgKG4gKC0gKGNvdW50IGlkKSAoY291bnQgbGVmdC10cmltbWVkKSkpKVxuICAgIChpZiAoPiBuIDApXG4gICAgICAoc3RyIChqb2luIFwiX1wiIChyZXBlYXQgKGluYyBuKSBcIlwiKSkgKHN1YnMgaWQgbikpXG4gICAgICBpZCkpKVxuXG5cbihkZWZ1biB0cmFuc2xhdGUtaWRlbnRpZmllci13b3JkXG4gIChmb3JtKVxuICBcIlRyYW5zbGF0ZXMgcmVmZXJlbmNlcyBmcm9tIGNsb2p1cmUgY29udmVudGlvbiB0byBKUzpcblxuICAqKm1hY3JvcyoqICAgICAgX19tYWNyb3NfX1xuICBsaXN0LT52ZWN0b3IgICAgbGlzdFRvVmVjdG9yXG4gIHNldCEgICAgICAgICAgICBzZXRcbiAgZm9vX2JhciAgICAgICAgIGZvb19iYXJcbiAgbnVtYmVyPyAgICAgICAgIGlzTnVtYmVyXG4gIHJlZD0gICAgICAgICAgICByZWRFcXVhbFxuICBjcmVhdGUtc2VydmVyICAgY3JlYXRlU2VydmVyXCJcbiAgKGxldCogKChpZCAobmFtZSBmb3JtKSkpXG4gICAgKHNldHEgaWQgKGNvbmQgKChpZGVudGljYWw/IGlkICBcIipcIikgXCJtdWx0aXBseVwiKVxuICAgICAgICAgICAgICAgICAgICgoaWRlbnRpY2FsPyBpZCBcIi9cIikgXCJkaXZpZGVcIilcbiAgICAgICAgICAgICAgICAgICAoKGlkZW50aWNhbD8gaWQgXCIrXCIpIFwic3VtXCIpXG4gICAgICAgICAgICAgICAgICAgKChpZGVudGljYWw/IGlkIFwiLVwiKSBcInN1YnRyYWN0XCIpXG4gICAgICAgICAgICAgICAgICAgKChpZGVudGljYWw/IGlkIFwiPVwiKSBcImVxdWFsP1wiKVxuICAgICAgICAgICAgICAgICAgICgoaWRlbnRpY2FsPyBpZCBcIj09XCIpIFwic3RyaWN0LWVxdWFsP1wiKVxuICAgICAgICAgICAgICAgICAgICgoaWRlbnRpY2FsPyBpZCBcIjw9XCIpIFwibm90LWdyZWF0ZXItdGhhblwiKVxuICAgICAgICAgICAgICAgICAgICgoaWRlbnRpY2FsPyBpZCBcIj49XCIpIFwibm90LWxlc3MtdGhhblwiKVxuICAgICAgICAgICAgICAgICAgICgoaWRlbnRpY2FsPyBpZCBcIj5cIikgXCJncmVhdGVyLXRoYW5cIilcbiAgICAgICAgICAgICAgICAgICAoKGlkZW50aWNhbD8gaWQgXCI8XCIpIFwibGVzcy10aGFuXCIpXG4gICAgICAgICAgICAgICAgICAgKChpZGVudGljYWw/IGlkIFwiLT5cIikgXCJ0aHJlYWQtZmlyc3RcIilcbiAgICAgICAgICAgICAgICAgICAoZWxzZSBpZCkpKVxuXG4gICAgOzsgKiptYWNyb3MqKiAtPiAgX19tYWNyb3NfX1xuICAgIChzZXRxIGlkIChqb2luIFwiX1wiIChzcGxpdCBpZCBcIipcIikpKVxuICAgIDs7IGZvby5iYXIgLT4gZm9vX2JhclxuICAgIChzZXRxIGlkIChqb2luIFwiX1wiIChzcGxpdCBpZCBcIi5cIikpKVxuICAgIDs7IGxpc3QtPnZlY3RvciAtPiAgbGlzdFRvVmVjdG9yXG4gICAgKHNldHEgaWQgKGlmIChpZGVudGljYWw/IChzdWJzIGlkIDAgMikgXCItPlwiKVxuICAgICAgICAgICAgICAgKHN1YnMgKGpvaW4gXCItdG8tXCIgKHNwbGl0IGlkIFwiLT5cIikpIDEpXG4gICAgICAgICAgICAgICAoam9pbiBcIi10by1cIiAoc3BsaXQgaWQgXCItPlwiKSkpKVxuICAgIDs7IHNldCEgLT4gIHNldFxuICAgIChzZXRxIGlkIChqb2luIChzcGxpdCBpZCBcIiFcIikpKVxuICAgIChzZXRxIGlkIChqb2luIFwiJFwiIChzcGxpdCBpZCBcIiVcIikpKVxuICAgIChzZXRxIGlkIChqb2luIFwiLWVxdWFsLVwiIChzcGxpdCBpZCBcIj1cIikpKVxuICAgIDs7IGZvbz0gLT4gZm9vRXF1YWxcbiAgICA7KHNldHEgaWQgKGpvaW4gXCItZXF1YWwtXCIgKHNwbGl0IGlkIFwiPVwiKSkpXG4gICAgOzsgZm9vK2JhciAtPiBmb29QbHVzQmFyXG4gICAgKHNldHEgaWQgKGpvaW4gXCItcGx1cy1cIiAoc3BsaXQgaWQgXCIrXCIpKSlcbiAgICAoc2V0cSBpZCAoam9pbiBcIi1hbmQtXCIgKHNwbGl0IGlkIFwiJlwiKSkpXG4gICAgOzsgbnVtYmVyPyAtPiBpc051bWJlclxuICAgIChzZXRxIGlkIChpZiAoaWRlbnRpY2FsPyAobGFzdCBpZCkgXCI/XCIpXG4gICAgICAgICAgICAgICAoc3RyIFwiaXMtXCIgKHN1YnMgaWQgMCAoZGVjIChjb3VudCBpZCkpKSlcbiAgICAgICAgICAgICAgIGlkKSlcbiAgICA7OyAtZm9vIC0+IF9mb29cbiAgICAoc2V0cSBpZCAoLT5wcml2YXRlLXByZWZpeCBpZCkpXG4gICAgOzsgY3JlYXRlLXNlcnZlciAtPiBjcmVhdGVTZXJ2ZXJcbiAgICAoc2V0cSBpZCAocmVkdWNlIC0+Y2FtZWwtam9pbiBcIlwiIChzcGxpdCBpZCBcIi1cIikpKVxuXG4gICAgOzsgcmVzaWR1YWwgc3dlZXA6IHRoZSBzdWdhciBhYm92ZSBvbmx5IHJld3JpdGVzIGA/YC9gPmAvYDxgL2AvYCBpbiBzcGVjaWZpY1xuICAgIDs7IHBvc2l0aW9ucyAoYSB0cmFpbGluZyBgP2AsIG9yIHRoZSBjaGFyIHN0YW5kaW5nIGFsb25lKS4gQW55dGhpbmcgbGVmdCBvdmVyXG4gICAgOzsgLS0gYHg/eWAsIGA/Zm9vYCwgYGE+YmAgLS0gaXMgc3RpbGwgYW4gaW52YWxpZCBKUyBpZGVudGlmaWVyLCBzbyBtYXAgZWFjaFxuICAgIDs7IHN1cnZpdmluZyBjaGFyYWN0ZXIgdG8gYSBDbG9qdXJlU2NyaXB0LXN0eWxlIG11bmdlIGZyYWdtZW50LlxuICAgIChzZXRxIGlkIChqb2luIFwiX1FNQVJLX1wiIChzcGxpdCBpZCBcIj9cIikpKVxuICAgIChzZXRxIGlkIChqb2luIFwiX0dUX1wiIChzcGxpdCBpZCBcIj5cIikpKVxuICAgIChzZXRxIGlkIChqb2luIFwiX0xUX1wiIChzcGxpdCBpZCBcIjxcIikpKVxuICAgIChzZXRxIGlkIChqb2luIFwiX1NMQVNIX1wiIChzcGxpdCBpZCBcIi9cIikpKVxuXG4gICAgaWQpKVxuXG4oZGVmdW4gdHJhbnNsYXRlLWlkZW50aWZpZXJcbiAgKGZvcm0pXG4gIChsZXQqICgobnMgKG5hbWVzcGFjZSBmb3JtKSkpXG4gICAgKHN0ciAoaWYgKGFuZCBucyAobm90ICg9IG5zIFwianNcIikpKVxuICAgICAgICAgICAoc3RyICh0cmFuc2xhdGUtaWRlbnRpZmllci13b3JkIChuYW1lc3BhY2UgZm9ybSkpIFwiLlwiKVxuICAgICAgICAgICBcIlwiKVxuICAgICAgICAgKGpvaW4gXFwuIChtYXAgdHJhbnNsYXRlLWlkZW50aWZpZXItd29yZCAoc3BsaXQgKG5hbWUgZm9ybSkgXFwuKSkpKSkpXG5cbihkZWZ1biBlcnJvci1hcmctY291bnRcbiAgKGNhbGxlZSBuKVxuICAodGhyb3cgKFN5bnRheEVycm9yIChzdHIgXCJXcm9uZyBudW1iZXIgb2YgYXJndW1lbnRzIChcIiBuIFwiKSBwYXNzZWQgdG86IFwiIGNhbGxlZSkpKSlcblxuKGRlZnVuIGluaGVyaXQtbG9jYXRpb25cbiAgKGJvZHkpXG4gIChsZXQqICgoc3RhcnQgKDpzdGFydCAoOmxvYyAoZmlyc3QgYm9keSkpKSlcbiAgICAgICAgKGVuZCAoOmVuZCAoOmxvYyAobGFzdCBib2R5KSkpKSlcbiAgICAoaWYgKG5vdCAob3IgKG5pbD8gc3RhcnQpIChuaWw/IGVuZCkpKVxuICAgICAgezpzdGFydCBzdGFydCA6ZW5kIGVuZH0pKSlcblxuXG4oZGVmdW4gd3JpdGUtbG9jYXRpb25cbiAgKGZvcm0gb3JpZ2luYWwpXG4gIChsZXQqICgoZGF0YSAobWV0YSBmb3JtKSlcbiAgICAgICAgKGluaGVyaXRlZCAobWV0YSBvcmlnaW5hbCkpXG4gICAgICAgIChzdGFydCAob3IgKDpzdGFydCBmb3JtKSAoOnN0YXJ0IGRhdGEpICg6c3RhcnQgaW5oZXJpdGVkKSkpXG4gICAgICAgIChlbmQgKG9yICg6ZW5kIGZvcm0pICg6ZW5kIGRhdGEpICg6ZW5kIGluaGVyaXRlZCkpKSlcbiAgICAoaWYgKG5vdCAobmlsPyBzdGFydCkpXG4gICAgICB7OmxvYyB7OnN0YXJ0IHs6bGluZSAoaW5jICg6bGluZSBzdGFydCAtMSkpXG4gICAgICAgICAgICAgICAgICAgICA6Y29sdW1uICg6Y29sdW1uIHN0YXJ0IC0xKX1cbiAgICAgICAgICAgICA6ZW5kIHs6bGluZSAoaW5jICg6bGluZSBlbmQgLTEpKVxuICAgICAgICAgICAgICAgICAgIDpjb2x1bW4gKDpjb2x1bW4gZW5kIC0xKX19fVxuICAgICAge30pKSlcblxuKGRlZnZhciAqKndyaXRlcnMqKiB7fSlcbihkZWZ1biBpbnN0YWxsLXdyaXRlciFcbiAgKG9wIHdyaXRlcilcbiAgKHNldGYgKGdldCAqKndyaXRlcnMqKiBvcCkgd3JpdGVyKSlcblxuKGRlZnVuIHdyaXRlLW9wXG4gIChvcCBmb3JtKVxuICAobGV0KiAoKHdyaXRlciAoZ2V0ICoqd3JpdGVycyoqIG9wKSkpXG4gICAgKGFzc2VydCB3cml0ZXIgKHN0ciBcIlVuc3VwcG9ydGVkIG9wZXJhdGlvbjogXCIgb3ApKVxuICAgIChjb25qICh3cml0ZS1sb2NhdGlvbiAoOmZvcm0gZm9ybSkgKDpvcmlnaW5hbC1mb3JtIGZvcm0pKVxuICAgICAgICAgICh3cml0ZXIgZm9ybSkpKSlcblxuKGRlZnZhciAqKnNwZWNpYWxzKioge30pXG4oZGVmdW4gaW5zdGFsbC1zcGVjaWFsIVxuICAob3Agd3JpdGVyKVxuICAoc2V0ZiAoZ2V0ICoqc3BlY2lhbHMqKiAobmFtZSBvcCkpIHdyaXRlcikpXG5cbihkZWZ1biB3cml0ZS1zcGVjaWFsXG4gICh3cml0ZXIgZm9ybSlcbiAgKGNvbmogKHdyaXRlLWxvY2F0aW9uICg6Zm9ybSBmb3JtKSAoOm9yaWdpbmFsLWZvcm0gZm9ybSkpXG4gICAgICAgIChhcHBseSB3cml0ZXIgKDpwYXJhbXMgZm9ybSkpKSlcblxuXG4oZGVmdW4gd3JpdGUtbmlsXG4gIChmb3JtKVxuICB7OnR5cGUgOkxpdGVyYWxcbiAgIDp2YWx1ZSBudWxsfSlcbihpbnN0YWxsLXdyaXRlciEgOm5pbCB3cml0ZS1uaWwpXG5cbihkZWZ1biB3cml0ZS1saXRlcmFsXG4gIChmb3JtKVxuICB7OnR5cGUgOkxpdGVyYWxcbiAgIDp2YWx1ZSBmb3JtfSlcblxuKGRlZnVuIHdyaXRlLWxpc3RcbiAgKGZvcm0pXG4gIHs6dHlwZSA6Q2FsbEV4cHJlc3Npb25cbiAgIDpjYWxsZWUgKHdyaXRlIHs6b3AgOnZhclxuICAgICAgICAgICAgICAgICAgIDpmb3JtICdsaXN0fSlcbiAgIDphcmd1bWVudHMgKG1hcCB3cml0ZSAoOml0ZW1zIGZvcm0pKX0pXG4oaW5zdGFsbC13cml0ZXIhIDpsaXN0IHdyaXRlLWxpc3QpXG5cbihkZWZ1biB3cml0ZS1zeW1ib2xcbiAgKGZvcm0pXG4gIHs6dHlwZSA6Q2FsbEV4cHJlc3Npb25cbiAgIDpjYWxsZWUgKHdyaXRlIHs6b3AgOnZhclxuICAgICAgICAgICAgICAgICAgIDpmb3JtICdzeW1ib2x9KVxuICAgOmFyZ3VtZW50cyBbKHdyaXRlLWNvbnN0YW50ICg6bmFtZXNwYWNlIGZvcm0pKVxuICAgICAgICAgICAgICAgKHdyaXRlLWNvbnN0YW50ICg6bmFtZSBmb3JtKSldfSlcbihpbnN0YWxsLXdyaXRlciEgOnN5bWJvbCB3cml0ZS1zeW1ib2wpXG5cbihkZWZ1biB3cml0ZS1jb25zdGFudFxuICAoZm9ybSlcbiAgKGNvbmQgKChuaWw/IGZvcm0pICh3cml0ZS1uaWwgZm9ybSkpXG4gICAgICAgICgoa2V5d29yZD8gZm9ybSkgKHdyaXRlLWxpdGVyYWwgKGlmIChuYW1lc3BhY2UgZm9ybSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHN0ciAobmFtZXNwYWNlIGZvcm0pIFwiL1wiIChuYW1lIGZvcm0pKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAobmFtZSBmb3JtKSkpKVxuICAgICAgICAoKG51bWJlcj8gZm9ybSkgKHdyaXRlLW51bWJlciAoLnZhbHVlT2YgZm9ybSkpKVxuICAgICAgICAoKHN0cmluZz8gZm9ybSkgKHdyaXRlLXN0cmluZyBmb3JtKSlcbiAgICAgICAgKGVsc2UgKHdyaXRlLWxpdGVyYWwgZm9ybSkpKSlcbihpbnN0YWxsLXdyaXRlciEgOmNvbnN0YW50IChsYW1iZGEgKCUpICh3cml0ZS1jb25zdGFudCAoOmZvcm0gJSkpKSlcblxuKGRlZnVuIHdyaXRlLXN0cmluZ1xuICAoZm9ybSlcbiAgezp0eXBlIDpMaXRlcmFsXG4gICA6dmFsdWUgKHN0ciBmb3JtKX0pXG5cbihkZWZ1biB3cml0ZS1udW1iZXJcbiAgKGZvcm0pXG4gIChpZiAoPCBmb3JtIDApXG4gICAgezp0eXBlIDpVbmFyeUV4cHJlc3Npb25cbiAgICAgOm9wZXJhdG9yIDotXG4gICAgIDpwcmVmaXggdHJ1ZVxuICAgICA6YXJndW1lbnQgKHdyaXRlLW51bWJlciAoKiBmb3JtIC0xKSl9XG4gICAgKHdyaXRlLWxpdGVyYWwgZm9ybSkpKVxuXG4oZGVmdW4gd3JpdGUta2V5d29yZFxuICAoZm9ybSlcbiAgezp0eXBlIDpMaXRlcmFsXG4gICA6dmFsdWUgKDpmb3JtIGZvcm0pfSlcbihpbnN0YWxsLXdyaXRlciEgOmtleXdvcmQgd3JpdGUta2V5d29yZClcblxuKGRlZnVuIC0+aWRlbnRpZmllclxuICAoZm9ybSlcbiAgezp0eXBlIDpJZGVudGlmaWVyXG4gICA6bmFtZSAodHJhbnNsYXRlLWlkZW50aWZpZXIgZm9ybSl9KVxuXG4oZGVmdW4gd3JpdGUtYmluZGluZy12YXJcbiAgKGZvcm0pXG4gIDs7IElmIGlkZW50aWZpZXJzIGJpbmRpbmcgc2hhZG93cyBvdGhlciBiaW5kaW5nIHJlbmFtZSBpdCBhY2NvcmRpbmdcbiAgOzsgdG8gc2hhZG93aW5nIGRlcHRoLiBUaGlzIGFsbG93cyBiaW5kaW5ncyBpbml0aWFsaXplciBzYWZlbHlcbiAgOzsgYWNjZXNzIGJpbmRpbmcgYmVmb3JlIHNoYWRvd2luZyBpdC5cbiAgKGxldCogKChiYXNlLWlkICg6aWQgZm9ybSkpXG4gICAgICAgIChyZXNvbHZlZC1pZCAoaWYgKDpzaGFkb3cgZm9ybSlcbiAgICAgICAgICAgICAgICAgICAgICAoc3ltYm9sIG5pbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHN0ciAodHJhbnNsYXRlLWlkZW50aWZpZXIgYmFzZS1pZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKip1bmlxdWUtY2hhcioqXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICg6ZGVwdGggZm9ybSkpKVxuICAgICAgICAgICAgIGJhc2UtaWQpKSlcbiAgICAoY29uaiAoLT5pZGVudGlmaWVyIHJlc29sdmVkLWlkKVxuICAgICAgICAgICh3cml0ZS1sb2NhdGlvbiBiYXNlLWlkKSkpKVxuXG4oZGVmdW4gd3JpdGUtdmFyXG4gIChub2RlKVxuICBcImhhbmRsZXIgZm9yIHs6b3AgOnZhcn0gdHlwZSBmb3Jtcy4gU3VjaCBmb3JtcyBtYXlcbiAgcmVwcmVzZW50IHJlZmVyZW5jZXMgaW4gd2hpY2ggY2FzZSB0aGV5IGhhdmUgOmluZm9cbiAgcG9pbnRpbmcgdG8gYSBkZWNsYXJhdGlvbiA6dmFyIHdoaWNoIHdheSBiZSBlaXRoZXJcbiAgZnVuY3Rpb24gcGFyYW1ldGVyIChoYXMgOnBhcmFtIHRydWUpIG9yIGxvY2FsXG4gIGJpbmRpbmcgZGVjbGFyYXRpb24gKGhhcyA6YmluZGluZyB0cnVlKSBsaWtlIG9uZXMgZGVmaW5lZFxuICBieSBsZXQgYW5kIGxvb3AgZm9ybXMgaW4gbGF0ZXIgY2FzZSBmb3JtIHdpbGwgYWxzbyBoYXZlXG4gIDpzaGFkb3cgcG9pbnRpbmcgdG8gYSBkZWNsYXJhdGlvbiBub2RlIGl0IHNoYWRvd3MgYW5kXG4gIDpkZXB0aCBwcm9wZXJ0eSB3aXRoIGEgZGVwdGggb2Ygc2hhZG93aW5nLCB0aGF0IGlzIHVzZWRcbiAgdG8gZm9yIHJlbmFtaW5nIGxvZ2ljIHRvIGF2b2lkIG5hbWUgY29sbGlzaW9ucyBpbiBmb3Jtc1xuICBsaWtlIGxldCB0aGF0IGFsbG93IHNhbWUgbmFtZWQgYmluZGluZ3MuXCJcbiAgKGlmICg9IDpiaW5kaW5nICg6dHlwZSAoOmJpbmRpbmcgbm9kZSkpKVxuICAgIChjb25qICh3cml0ZS1iaW5kaW5nLXZhciAoOmJpbmRpbmcgbm9kZSkpXG4gICAgICAgICAgKHdyaXRlLWxvY2F0aW9uICg6Zm9ybSBub2RlKSkpXG4gICAgKGNvbmogKHdyaXRlLWxvY2F0aW9uICg6Zm9ybSBub2RlKSlcbiAgICAgICAgICAoLT5pZGVudGlmaWVyICg6Zm9ybSBub2RlKSkpKSlcbihpbnN0YWxsLXdyaXRlciEgOnZhciB3cml0ZS12YXIpXG4oaW5zdGFsbC13cml0ZXIhIDpwYXJhbSB3cml0ZS12YXIpXG5cbihkZWZ1biB3cml0ZS1pbnZva2VcbiAgKGZvcm0pXG4gIHs6dHlwZSA6Q2FsbEV4cHJlc3Npb25cbiAgIDpjYWxsZWUgKHdyaXRlICg6Y2FsbGVlIGZvcm0pKVxuICAgOmFyZ3VtZW50cyAobWFwIHdyaXRlICg6cGFyYW1zIGZvcm0pKX0pXG4oaW5zdGFsbC13cml0ZXIhIDppbnZva2Ugd3JpdGUtaW52b2tlKVxuXG4oZGVmdW4gd3JpdGUtdmVjdG9yXG4gIChmb3JtKVxuICB7OnR5cGUgOkFycmF5RXhwcmVzc2lvblxuICAgOmVsZW1lbnRzIChtYXAgd3JpdGUgKDppdGVtcyBmb3JtKSl9KVxuKGluc3RhbGwtd3JpdGVyISA6dmVjdG9yIHdyaXRlLXZlY3RvcilcblxuKGRlZnVuIHdyaXRlLWRpY3Rpb25hcnlcbiAgKGZvcm0pXG4gIChsZXQqICgocHJvcGVydGllcyAocGFydGl0aW9uIDIgKGludGVybGVhdmUgKDprZXlzIGZvcm0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICg6dmFsdWVzIGZvcm0pKSkpKVxuICAgIHs6dHlwZSA6T2JqZWN0RXhwcmVzc2lvblxuICAgICA6cHJvcGVydGllcyAobWFwIChsYW1iZGEgKHBhaXIpXG4gICAgICAgICAgICAgICAgICAgICAgICAobGV0KiAoKGtleSAoZmlyc3QgcGFpcikpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodmFsdWUgKHNlY29uZCBwYWlyKSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHs6a2luZCA6aW5pdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgOnR5cGUgOlByb3BlcnR5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICA6a2V5IChpZiAoPSA6c3ltYm9sICg6b3Aga2V5KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAod3JpdGUtY29uc3RhbnQgKHN0ciAoOmZvcm0ga2V5KSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHdyaXRlIGtleSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICA6dmFsdWUgKHdyaXRlIHZhbHVlKX0pKVxuICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXMpfSkpXG4oaW5zdGFsbC13cml0ZXIhIDpkaWN0aW9uYXJ5IHdyaXRlLWRpY3Rpb25hcnkpXG5cbihkZWZ1biB3cml0ZS1leHBvcnRcbiAgKGZvcm0pXG4gICh3cml0ZSB7Om9wIDpzZXQhXG4gICAgICAgICAgOnRhcmdldCB7Om9wIDptZW1iZXItZXhwcmVzc2lvblxuICAgICAgICAgICAgICAgICAgIDpjb21wdXRlZCBmYWxzZVxuICAgICAgICAgICAgICAgICAgIDp0YXJnZXQgezpvcCA6dmFyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gKHdpdGgtbWV0YSAnZXhwb3J0cyAobWV0YSAoOmZvcm0gKDppZCBmb3JtKSkpKX1cbiAgICAgICAgICAgICAgICAgICA6cHJvcGVydHkgKDppZCBmb3JtKVxuICAgICAgICAgICAgICAgICAgIDpmb3JtICg6Zm9ybSAoOmlkIGZvcm0pKX1cbiAgICAgICAgICA6dmFsdWUgKDppbml0IGZvcm0pXG4gICAgICAgICAgOmZvcm0gKDpmb3JtICg6aWQgZm9ybSkpfSkpXG5cbihkZWZ1biB3cml0ZS1kZWZcbiAgKGZvcm0pXG4gIChjb25qIHs6dHlwZSA6VmFyaWFibGVEZWNsYXJhdGlvblxuICAgICAgICAgOmtpbmQgOnZhclxuICAgICAgICAgOmRlY2xhcmF0aW9ucyBbKGNvbmogezp0eXBlIDpWYXJpYWJsZURlY2xhcmF0b3JcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6aWQgKHdyaXRlICg6aWQgZm9ybSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmluaXQgKGNvbmogKGlmICg6ZXhwb3J0IGZvcm0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAod3JpdGUtZXhwb3J0IGZvcm0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAod3JpdGUgKDppbml0IGZvcm0pKSkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHdyaXRlLWxvY2F0aW9uICg6Zm9ybSAoOmlkIGZvcm0pKSkpXX1cbiAgICAgICAgKHdyaXRlLWxvY2F0aW9uICg6Zm9ybSBmb3JtKSAoOm9yaWdpbmFsLWZvcm0gZm9ybSkpKSlcbihpbnN0YWxsLXdyaXRlciEgOmRlZiB3cml0ZS1kZWYpXG5cbihkZWZ1biB3cml0ZS1iaW5kaW5nXG4gIChmb3JtKVxuICAobGV0KiAoKGlkICh3cml0ZS1iaW5kaW5nLXZhciBmb3JtKSlcbiAgICAgICAgKGluaXQgKHdyaXRlICg6aW5pdCBmb3JtKSkpKVxuICAgIHs6dHlwZSA6VmFyaWFibGVEZWNsYXJhdGlvblxuICAgICA6a2luZCA6dmFyXG4gICAgIDpsb2MgKGluaGVyaXQtbG9jYXRpb24gW2lkIGluaXRdKVxuICAgICA6ZGVjbGFyYXRpb25zIFt7OnR5cGUgOlZhcmlhYmxlRGVjbGFyYXRvclxuICAgICAgICAgICAgICAgICAgICAgOmlkIGlkXG4gICAgICAgICAgICAgICAgICAgICA6aW5pdCBpbml0fV19KSlcbihpbnN0YWxsLXdyaXRlciEgOmJpbmRpbmcgd3JpdGUtYmluZGluZylcblxuKGRlZnVuIHdyaXRlLXRocm93XG4gIChmb3JtKVxuICAoLT5leHByZXNzaW9uIChjb25qIHs6dHlwZSA6VGhyb3dTdGF0ZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgICAgOmFyZ3VtZW50ICh3cml0ZSAoOnRocm93IGZvcm0pKX1cbiAgICAgICAgICAgICAgICAgICAgICAod3JpdGUtbG9jYXRpb24gKDpmb3JtIGZvcm0pICg6b3JpZ2luYWwtZm9ybSBmb3JtKSkpKSlcbihpbnN0YWxsLXdyaXRlciEgOnRocm93IHdyaXRlLXRocm93KVxuXG4oZGVmdW4gd3JpdGUtbmV3XG4gIChmb3JtKVxuICB7OnR5cGUgOk5ld0V4cHJlc3Npb25cbiAgIDpjYWxsZWUgKHdyaXRlICg6Y29uc3RydWN0b3IgZm9ybSkpXG4gICA6YXJndW1lbnRzIChtYXAgd3JpdGUgKDpwYXJhbXMgZm9ybSkpfSlcbihpbnN0YWxsLXdyaXRlciEgOm5ldyB3cml0ZS1uZXcpXG5cbihkZWZ1biB3cml0ZS1zZXQhXG4gIChmb3JtKVxuICB7OnR5cGUgOkFzc2lnbm1lbnRFeHByZXNzaW9uXG4gICA6b3BlcmF0b3IgOj1cbiAgIDpsZWZ0ICh3cml0ZSAoOnRhcmdldCBmb3JtKSlcbiAgIDpyaWdodCAod3JpdGUgKDp2YWx1ZSBmb3JtKSl9KVxuKGluc3RhbGwtd3JpdGVyISA6c2V0ISB3cml0ZS1zZXQhKVxuXG4oZGVmdW4gd3JpdGUtYWdldFxuICAoZm9ybSlcbiAgezp0eXBlIDpNZW1iZXJFeHByZXNzaW9uXG4gICA6Y29tcHV0ZWQgKDpjb21wdXRlZCBmb3JtKVxuICAgOm9iamVjdCAod3JpdGUgKDp0YXJnZXQgZm9ybSkpXG4gICA6cHJvcGVydHkgKHdyaXRlICg6cHJvcGVydHkgZm9ybSkpfSlcbihpbnN0YWxsLXdyaXRlciEgOm1lbWJlci1leHByZXNzaW9uIHdyaXRlLWFnZXQpXG5cbjs7IE1hcCBvZiBzdGF0ZW1lbnQgQVNUIG5vZGUgdGhhdCBhcmUgZ2VuZXJhdGVkXG47OyBieSBhIHdyaXRlci4gVXNlZCB0byBkZWNldCB3ZWF0aGVyIG5vZGUgaXNcbjs7IHN0YXRlbWVudCBvciBleHByZXNzaW9uLlxuKGRlZnZhciAqKnN0YXRlbWVudHMqKiB7OkVtcHR5U3RhdGVtZW50IHRydWUgOkJsb2NrU3RhdGVtZW50IHRydWVcbiAgICAgICAgICAgICAgICAgICAgIDpFeHByZXNzaW9uU3RhdGVtZW50IHRydWUgOklmU3RhdGVtZW50IHRydWVcbiAgICAgICAgICAgICAgICAgICAgIDpMYWJlbGVkU3RhdGVtZW50IHRydWUgOkJyZWFrU3RhdGVtZW50IHRydWVcbiAgICAgICAgICAgICAgICAgICAgIDpDb250aW51ZVN0YXRlbWVudCB0cnVlIDpTd2l0Y2hTdGF0ZW1lbnQgdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgOlJldHVyblN0YXRlbWVudCB0cnVlIDpUaHJvd1N0YXRlbWVudCB0cnVlXG4gICAgICAgICAgICAgICAgICAgICA6VHJ5U3RhdGVtZW50IHRydWUgOldoaWxlU3RhdGVtZW50IHRydWVcbiAgICAgICAgICAgICAgICAgICAgIDpEb1doaWxlU3RhdGVtZW50IHRydWUgOkZvclN0YXRlbWVudCB0cnVlXG4gICAgICAgICAgICAgICAgICAgICA6Rm9ySW5TdGF0ZW1lbnQgdHJ1ZSA6Rm9yT2ZTdGF0ZW1lbnQgdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgOkxldFN0YXRlbWVudCB0cnVlIDpWYXJpYWJsZURlY2xhcmF0aW9uIHRydWVcbiAgICAgICAgICAgICAgICAgICAgIDpGdW5jdGlvbkRlY2xhcmF0aW9uIHRydWV9KVxuXG4oZGVmdW4gd3JpdGUtc3RhdGVtZW50XG4gIChmb3JtKVxuICBcIldyYXBzIGV4cHJlc3Npb24gdGhhdCBjYW4ndCBiZSBpbiBhIGJsb2NrIHN0YXRlbWVudFxuICBib2R5IGludG8gOkV4cHJlc3Npb25TdGF0ZW1lbnQgb3RoZXJ3aXNlIHJldHVybnMgYmFja1xuICBleHByZXNzaW9uLlwiXG4gICgtPnN0YXRlbWVudCAod3JpdGUgZm9ybSkpKVxuXG4oZGVmdW4gLT5zdGF0ZW1lbnRcbiAgKG5vZGUpXG4gIChpZiAoZ2V0ICoqc3RhdGVtZW50cyoqICg6dHlwZSBub2RlKSlcbiAgICBub2RlXG4gICAgezp0eXBlIDpFeHByZXNzaW9uU3RhdGVtZW50XG4gICAgIDpleHByZXNzaW9uIG5vZGVcbiAgICAgOmxvYyAoOmxvYyBub2RlKVxuICAgICB9KSlcblxuKGRlZnVuIC0+cmV0dXJuXG4gIChmb3JtKVxuICAoY29uaiB7OnR5cGUgOlJldHVyblN0YXRlbWVudFxuICAgICAgICAgOmFyZ3VtZW50ICh3cml0ZSBmb3JtKX1cbiAgICAgICAgKHdyaXRlLWxvY2F0aW9uICg6Zm9ybSBmb3JtKSAoOm9yaWdpbmFsLWZvcm0gZm9ybSkpKSlcblxuKGRlZnVuIHdyaXRlLWJvZHlcbiAgKGZvcm0pXG4gIFwiVGFrZXMgZm9ybSB0aGF0IG1heSBjb250YWluIGA6c3RhdGVtZW50c2AgdmVjdG9yXG4gIG9yIGA6cmVzdWx0YCBmb3JtICBhbmQgcmV0dXJucyB2ZWN0b3IgZXhwcmVzc2lvblxuICBub2RlcyB0aGF0IGNhbiBiZSB1c2VkIGluIGFueSBibG9jay4gSWYgYDpyZXN1bHRgXG4gIGlzIHByZXNlbnQgaXQgd2lsbCBiZSBhIGxhc3QgaW4gdmVjdG9yIGFuZCBvZiBhXG4gIGA6UmV0dXJuU3RhdGVtZW50YCB0eXBlLlxuICBFeGFtcGxlczpcblxuXG4gICh3cml0ZS1ib2R5IHs6c3RhdGVtZW50cyBuaWxcbiAgICAgICAgICAgICAgIDpyZXN1bHQgezpvcCA6Y29uc3RhbnRcbiAgICAgICAgICAgICAgICAgICAgICAgIDp0eXBlIDpudW1iZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtIDN9fSlcbiAgOzsgPT5cbiAgW3s6dHlwZSA6UmV0dXJuU3RhdGVtZW50XG4gICAgOmFyZ3VtZW50IHs6dHlwZSA6TGl0ZXJhbCA6dmFsdWUgM319XVxuXG4gICh3cml0ZS1ib2R5IHs6c3RhdGVtZW50cyBbezpvcCA6c2V0IVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6dGFyZ2V0IHs6b3AgOnZhciA6Zm9ybSAneH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnZhbHVlIHs6b3AgOnZhciA6Zm9ybSAneX19XVxuICAgICAgICAgICAgICAgOnJlc3VsdCB7Om9wIDp2YXIgOmZvcm0gJ3h9fSlcbiAgOzsgPT5cbiAgW3s6dHlwZSA6RXhwcmVzc2lvblN0YXRlbWVudFxuICAgIDpleHByZXNzaW9uIHs6dHlwZSA6QXNzaWdubWVudEV4cHJlc3Npb25cbiAgICAgICAgICAgICAgICAgOm9wZXJhdG9yIDo9XG4gICAgICAgICAgICAgICAgIDpsZWZ0IHs6dHlwZSA6SWRlbnRpZmllciA6bmFtZSA6eH1cbiAgICAgICAgICAgICAgICAgOnJpZ2h0IHs6dHlwZSA6SWRlbnRpZmllciA6bmFtZSA6eX19fVxuICAgezp0eXBlIDpSZXR1cm5TdGF0ZW1lbnRcbiAgICA6YXJndW1lbnQgezp0eXBlIDpJZGVudGlmaWVyIDpuYW1lIDp4fX1dXCJcbiAgKGxldCogKChzdGF0ZW1lbnRzIChtYXAgd3JpdGUtc3RhdGVtZW50XG4gICAgICAgICAgICAgICAgICAgICAgICAob3IgKDpzdGF0ZW1lbnRzIGZvcm0pIFtdKSkpXG4gICAgICAgIChyZXN1bHQgKGlmICg6cmVzdWx0IGZvcm0pXG4gICAgICAgICAgICAgICAgICgtPnJldHVybiAoOnJlc3VsdCBmb3JtKSkpKSlcblxuICAgIChpZiByZXN1bHRcbiAgICAgIChjb25qIHN0YXRlbWVudHMgcmVzdWx0KVxuICAgICAgc3RhdGVtZW50cykpKVxuXG4oZGVmdW4gLT5ibG9ja1xuICAoYm9keSlcbiAgKGlmICh2ZWN0b3I/IGJvZHkpXG4gICAgezp0eXBlIDpCbG9ja1N0YXRlbWVudFxuICAgICA6Ym9keSBib2R5XG4gICAgIDpsb2MgKGluaGVyaXQtbG9jYXRpb24gYm9keSl9XG4gICAgezp0eXBlIDpCbG9ja1N0YXRlbWVudFxuICAgICA6Ym9keSBbYm9keV1cbiAgICAgOmxvYyAoOmxvYyBib2R5KX0pKVxuXG4oZGVmdW4gLT5leHByZXNzaW9uXG4gICgmcmVzdCBib2R5KVxuICB7OnR5cGUgOkNhbGxFeHByZXNzaW9uXG4gICA6YXJndW1lbnRzIFtdXG4gICA6bG9jIChpbmhlcml0LWxvY2F0aW9uIGJvZHkpXG4gICA6Y2FsbGVlICgtPnNlcXVlbmNlIFt7OnR5cGUgOkZ1bmN0aW9uRXhwcmVzc2lvblxuICAgICAgICAgICAgICAgICAgICAgICAgIDppZCBuaWxcbiAgICAgICAgICAgICAgICAgICAgICAgICA6cGFyYW1zIFtdXG4gICAgICAgICAgICAgICAgICAgICAgICAgOmRlZmF1bHRzIFtdXG4gICAgICAgICAgICAgICAgICAgICAgICAgOmV4cHJlc3Npb24gZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICA6Z2VuZXJhdG9yIGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgOnJlc3QgbmlsXG4gICAgICAgICAgICAgICAgICAgICAgICAgOmJvZHkgKC0+YmxvY2sgYm9keSl9XSl9KVxuXG4oZGVmdW4gd3JpdGUtZG9cbiAgKGZvcm0pXG4gIChpZiAoOmJsb2NrIChtZXRhIChmaXJzdCAoOmZvcm0gZm9ybSkpKSlcbiAgICAoLT5ibG9jayAod3JpdGUtYm9keSAoY29uaiBmb3JtIHs6cmVzdWx0IG5pbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpzdGF0ZW1lbnRzIChjb25qICg6c3RhdGVtZW50cyBmb3JtKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICg6cmVzdWx0IGZvcm0pKX0pKSlcbiAgICAoYXBwbHkgLT5leHByZXNzaW9uICh3cml0ZS1ib2R5IGZvcm0pKSkpXG4oaW5zdGFsbC13cml0ZXIhIDpkbyB3cml0ZS1kbylcblxuKGRlZnVuIHdyaXRlLWlmXG4gIChmb3JtKVxuICB7OnR5cGUgOkNvbmRpdGlvbmFsRXhwcmVzc2lvblxuICAgOnRlc3QgKHdyaXRlICg6dGVzdCBmb3JtKSlcbiAgIDpjb25zZXF1ZW50ICh3cml0ZSAoOmNvbnNlcXVlbnQgZm9ybSkpXG4gICA6YWx0ZXJuYXRlICh3cml0ZSAoOmFsdGVybmF0ZSBmb3JtKSl9KVxuKGluc3RhbGwtd3JpdGVyISA6aWYgd3JpdGUtaWYpXG5cbihkZWZ1biB3cml0ZS10cnlcbiAgKGZvcm0pXG4gIChsZXQqICgoaGFuZGxlciAoOmhhbmRsZXIgZm9ybSkpXG4gICAgICAgIChmaW5hbGl6ZXIgKDpmaW5hbGl6ZXIgZm9ybSkpKVxuICAgICgtPmV4cHJlc3Npb24gKGNvbmogezp0eXBlIDpUcnlTdGF0ZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgICAgICA6Z3VhcmRlZEhhbmRsZXJzIFtdXG4gICAgICAgICAgICAgICAgICAgICAgICAgOmJsb2NrICgtPmJsb2NrICh3cml0ZS1ib2R5ICg6Ym9keSBmb3JtKSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgOmhhbmRsZXJzIChpZiBoYW5kbGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW3s6dHlwZSA6Q2F0Y2hDbGF1c2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpwYXJhbSAod3JpdGUgKDpuYW1lIGhhbmRsZXIpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmJvZHkgKC0+YmxvY2sgKHdyaXRlLWJvZHkgaGFuZGxlcikpfV1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICA6ZmluYWxpemVyIChjb25kIChmaW5hbGl6ZXIgKC0+YmxvY2sgKHdyaXRlLWJvZHkgZmluYWxpemVyKSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKG5vdCBoYW5kbGVyKSAoLT5ibG9jayBbXSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZWxzZSBuaWwpKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICh3cml0ZS1sb2NhdGlvbiAoOmZvcm0gZm9ybSkgKDpvcmlnaW5hbC1mb3JtIGZvcm0pKSkpKSlcbihpbnN0YWxsLXdyaXRlciEgOnRyeSB3cml0ZS10cnkpXG5cbihkZWZ1bi0gd3JpdGUtYmluZGluZy12YWx1ZVxuICAoZm9ybSlcbiAgKHdyaXRlICg6aW5pdCBmb3JtKSkpXG5cbihkZWZ1bi0gd3JpdGUtYmluZGluZy1wYXJhbVxuICAoZm9ybSlcbiAgKHdyaXRlLXZhciB7OmZvcm0gKDpuYW1lIGZvcm0pfSkpXG5cbihkZWZ1biB3cml0ZS1iaW5kaW5nXG4gIChmb3JtKVxuICAod3JpdGUgezpvcCA6ZGVmXG4gICAgICAgICAgOnZhciBmb3JtXG4gICAgICAgICAgOmluaXQgKDppbml0IGZvcm0pXG4gICAgICAgICAgOmZvcm0gZm9ybX0pKVxuXG4oZGVmdW4gd3JpdGUtbGV0XG4gIChmb3JtKVxuICAobGV0KiAoKGJvZHkgKGNvbmogZm9ybVxuICAgICAgICAgICAgICAgICAgIHs6c3RhdGVtZW50cyAodmVjIChjb25jYXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKDpiaW5kaW5ncyBmb3JtKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoOnN0YXRlbWVudHMgZm9ybSkpKX0pKSlcbiAgICAoLT5paWZlICgtPmJsb2NrICh3cml0ZS1ib2R5IGJvZHkpKSkpKVxuKGluc3RhbGwtd3JpdGVyISA6bGV0IHdyaXRlLWxldClcblxuKGRlZnVuIC0+cmViaW5kXG4gIChmb3JtKVxuICAobG9vcCAoKHJlc3VsdCBbXSlcbiAgICAgICAgIChiaW5kaW5ncyAoOmJpbmRpbmdzIGZvcm0pKSlcbiAgICAoaWYgKGVtcHR5PyBiaW5kaW5ncylcbiAgICAgIHJlc3VsdFxuICAgICAgKHJlY3VyIChjb25qIHJlc3VsdFxuICAgICAgICAgICAgICAgICAgIHs6dHlwZSA6QXNzaWdubWVudEV4cHJlc3Npb25cbiAgICAgICAgICAgICAgICAgICAgOm9wZXJhdG9yIDo9XG4gICAgICAgICAgICAgICAgICAgIDpsZWZ0ICh3cml0ZS1iaW5kaW5nLXZhciAoZmlyc3QgYmluZGluZ3MpKVxuICAgICAgICAgICAgICAgICAgICA6cmlnaHQgezp0eXBlIDpNZW1iZXJFeHByZXNzaW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOmNvbXB1dGVkIHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6b2JqZWN0IHs6dHlwZSA6SWRlbnRpZmllclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpuYW1lIDpsb29wfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpwcm9wZXJ0eSB7OnR5cGUgOkxpdGVyYWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDp2YWx1ZSAoY291bnQgcmVzdWx0KX19fSlcbiAgICAgICAgICAgICAocmVzdCBiaW5kaW5ncykpKSkpXG5cbihkZWZ1biAtPnNlcXVlbmNlXG4gIChleHByZXNzaW9ucylcbiAgezp0eXBlIDpTZXF1ZW5jZUV4cHJlc3Npb25cbiAgIDpleHByZXNzaW9ucyBleHByZXNzaW9uc30pXG5cbihkZWZ1biAtPmlpZmVcbiAgKGJvZHkgaWQpXG4gIHs6dHlwZSA6Q2FsbEV4cHJlc3Npb25cbiAgIDphcmd1bWVudHMgW3s6dHlwZSA6VGhpc0V4cHJlc3Npb259XVxuICAgOmNhbGxlZSB7OnR5cGUgOk1lbWJlckV4cHJlc3Npb25cbiAgICAgICAgICAgIDpjb21wdXRlZCBmYWxzZVxuICAgICAgICAgICAgOm9iamVjdCB7OnR5cGUgOkZ1bmN0aW9uRXhwcmVzc2lvblxuICAgICAgICAgICAgICAgICAgICAgOmlkIGlkXG4gICAgICAgICAgICAgICAgICAgICA6cGFyYW1zIFtdXG4gICAgICAgICAgICAgICAgICAgICA6ZGVmYXVsdHMgW11cbiAgICAgICAgICAgICAgICAgICAgIDpleHByZXNzaW9uIGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICA6Z2VuZXJhdG9yIGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICA6cmVzdCBuaWxcbiAgICAgICAgICAgICAgICAgICAgIDpib2R5IGJvZHl9XG4gICAgICAgICAgICA6cHJvcGVydHkgezp0eXBlIDpJZGVudGlmaWVyXG4gICAgICAgICAgICAgICAgICAgICAgIDpuYW1lIDpjYWxsfX19KVxuXG4oZGVmdW4gLT5sb29wLWluaXRcbiAgKClcbiAgezp0eXBlIDpWYXJpYWJsZURlY2xhcmF0aW9uXG4gICA6a2luZCA6dmFyXG4gICA6ZGVjbGFyYXRpb25zIFt7OnR5cGUgOlZhcmlhYmxlRGVjbGFyYXRvclxuICAgICAgICAgICAgICAgICAgIDppZCB7OnR5cGUgOklkZW50aWZpZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIDpuYW1lIDpyZWN1cn1cbiAgICAgICAgICAgICAgICAgICA6aW5pdCB7OnR5cGUgOklkZW50aWZpZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgOm5hbWUgOmxvb3B9fV19KVxuXG4oZGVmdW4gLT5kby13aGlsZVxuIChib2R5IHRlc3QpXG4gezp0eXBlIDpEb1doaWxlU3RhdGVtZW50XG4gIDpib2R5IGJvZHlcbiAgOnRlc3QgdGVzdH0pXG5cbihkZWZ1biAtPnNldCEtcmVjdXJcbiAgKGZvcm0pXG4gIHs6dHlwZSA6QXNzaWdubWVudEV4cHJlc3Npb25cbiAgIDpvcGVyYXRvciA6PVxuICAgOmxlZnQgezp0eXBlIDpJZGVudGlmaWVyIDpuYW1lIDpyZWN1cn1cbiAgIDpyaWdodCAod3JpdGUgZm9ybSl9KVxuXG4oZGVmdW4gLT5sb29wXG4gIChmb3JtKVxuICAoLT5zZXF1ZW5jZSAoY29uaiAoLT5yZWJpbmQgZm9ybSlcbiAgICAgICAgICAgICAgICAgICAgezp0eXBlIDpCaW5hcnlFeHByZXNzaW9uXG4gICAgICAgICAgICAgICAgICAgICA6b3BlcmF0b3IgOj09PVxuICAgICAgICAgICAgICAgICAgICAgOmxlZnQgezp0eXBlIDpJZGVudGlmaWVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOm5hbWUgOnJlY3VyfVxuICAgICAgICAgICAgICAgICAgICAgOnJpZ2h0IHs6dHlwZSA6SWRlbnRpZmllclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6bmFtZSA6bG9vcH19KSkpXG5cblxuKGRlZnVuIHdyaXRlLWxvb3BcbiAgKGZvcm0pXG4gIChsZXQqICgoc3RhdGVtZW50cyAoOnN0YXRlbWVudHMgZm9ybSkpXG4gICAgICAgIChyZXN1bHQgKDpyZXN1bHQgZm9ybSkpXG4gICAgICAgIChiaW5kaW5ncyAoOmJpbmRpbmdzIGZvcm0pKVxuXG4gICAgICAgIChsb29wLWJvZHkgKGNvbmogKG1hcCB3cml0ZS1zdGF0ZW1lbnQgc3RhdGVtZW50cylcbiAgICAgICAgICAgICAgICAgICAgICAgICgtPnN0YXRlbWVudCAoLT5zZXQhLXJlY3VyIHJlc3VsdCkpKSlcbiAgICAgICAgKGJvZHkgKGNvbmNhdCBbKFxuICAgICAgICAgICAgICAgICAgICAgICAtPmxvb3AtaW5pdCldXG4gICAgICAgICAgICAgICAgICAgICAobWFwIHdyaXRlIGJpbmRpbmdzKVxuICAgICAgICAgICAgICAgICAgICAgWygtPmRvLXdoaWxlICgtPmJsb2NrICh2ZWMgbG9vcC1ib2R5KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoLT5sb29wIGZvcm0pKV1cbiAgICAgICAgICAgICAgICAgICAgIFt7OnR5cGUgOlJldHVyblN0YXRlbWVudFxuICAgICAgICAgICAgICAgICAgICAgICA6YXJndW1lbnQgezp0eXBlIDpJZGVudGlmaWVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOm5hbWUgOnJlY3VyfX1dKSkpXG4gICAgKC0+aWlmZSAoLT5ibG9jayAodmVjIGJvZHkpKSAnbG9vcCkpKVxuKGluc3RhbGwtd3JpdGVyISA6bG9vcCB3cml0ZS1sb29wKVxuXG4oZGVmdW4gLT5yZWN1clxuICAoZm9ybSlcbiAgKGxvb3AgKChyZXN1bHQgW10pXG4gICAgICAgICAocGFyYW1zICg6cGFyYW1zIGZvcm0pKSlcbiAgICAoaWYgKGVtcHR5PyBwYXJhbXMpXG4gICAgICByZXN1bHRcbiAgICAgIChyZWN1ciAoY29uaiByZXN1bHRcbiAgICAgICAgICAgICAgICAgICB7OnR5cGUgOkFzc2lnbm1lbnRFeHByZXNzaW9uXG4gICAgICAgICAgICAgICAgICAgIDpvcGVyYXRvciA6PVxuICAgICAgICAgICAgICAgICAgICA6cmlnaHQgKHdyaXRlIChmaXJzdCBwYXJhbXMpKVxuICAgICAgICAgICAgICAgICAgICA6bGVmdCB7OnR5cGUgOk1lbWJlckV4cHJlc3Npb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDpjb21wdXRlZCB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICA6b2JqZWN0IHs6dHlwZSA6SWRlbnRpZmllclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOm5hbWUgOmxvb3B9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICA6cHJvcGVydHkgezp0eXBlIDpMaXRlcmFsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDp2YWx1ZSAoY291bnQgcmVzdWx0KX19fSlcbiAgICAgICAgICAgICAocmVzdCBwYXJhbXMpKSkpKVxuXG4oZGVmdW4gd3JpdGUtcmVjdXJcbiAgKGZvcm0pXG4gICgtPnNlcXVlbmNlIChjb25qICgtPnJlY3VyIGZvcm0pXG4gICAgICAgICAgICAgICAgICAgIHs6dHlwZSA6SWRlbnRpZmllclxuICAgICAgICAgICAgICAgICAgICAgOm5hbWUgOmxvb3B9KSkpXG4oaW5zdGFsbC13cml0ZXIhIDpyZWN1ciB3cml0ZS1yZWN1cilcblxuKGRlZnVuIGZhbGxiYWNrLW92ZXJsb2FkXG4gICgpXG4gIHs6dHlwZSA6U3dpdGNoQ2FzZVxuICAgOnRlc3QgbmlsXG4gICA6Y29uc2VxdWVudCBbezp0eXBlIDpUaHJvd1N0YXRlbWVudFxuICAgICAgICAgICAgICAgICA6YXJndW1lbnQgezp0eXBlIDpDYWxsRXhwcmVzc2lvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpjYWxsZWUgezp0eXBlIDpJZGVudGlmaWVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOm5hbWUgOlJhbmdlRXJyb3J9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOmFyZ3VtZW50cyBbezp0eXBlIDpMaXRlcmFsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDp2YWx1ZSBcIldyb25nIG51bWJlciBvZiBhcmd1bWVudHMgcGFzc2VkXCJ9XX19XX0pXG5cbihkZWZ1biBzcGxpY2UtYmluZGluZ1xuICAoZm9ybSlcbiAgezpvcCA6ZGVmXG4gICA6aWQgKGxhc3QgKDpwYXJhbXMgZm9ybSkpXG4gICA6aW5pdCB7Om9wIDppbnZva2VcbiAgICAgICAgICA6Y2FsbGVlIHs6b3AgOnZhclxuICAgICAgICAgICAgICAgICAgIDpmb3JtICdBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbH1cbiAgICAgICAgICA6cGFyYW1zIFt7Om9wIDp2YXJcbiAgICAgICAgICAgICAgICAgICAgOmZvcm0gJ2FyZ3VtZW50c31cbiAgICAgICAgICAgICAgICAgICB7Om9wIDpjb25zdGFudFxuICAgICAgICAgICAgICAgICAgICA6Zm9ybSAoOmFyaXR5IGZvcm0pXG4gICAgICAgICAgICAgICAgICAgIDp0eXBlIDpudW1iZXJ9XX19KVxuXG4oZGVmdW4gd3JpdGUtb3ZlcmxvYWRpbmctcGFyYW1zXG4gIChwYXJhbXMpXG4gIChyZWR1Y2UgKGxhbWJkYSAoZm9ybXMgcGFyYW0pXG4gICAgICAgICAgICAoY29uaiBmb3JtcyB7Om9wIDpkZWZcbiAgICAgICAgICAgICAgICAgICAgICAgICA6aWQgcGFyYW1cbiAgICAgICAgICAgICAgICAgICAgICAgICA6aW5pdCB7Om9wIDptZW1iZXItZXhwcmVzc2lvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Y29tcHV0ZWQgdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6dGFyZ2V0IHs6b3AgOnZhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Zm9ybSAnYXJndW1lbnRzfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6cHJvcGVydHkgezpvcCA6Y29uc3RhbnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6dHlwZSA6bnVtYmVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gKGNvdW50IGZvcm1zKX19fSkpXG4gICAgICAgICAgW11cbiAgICAgICAgICBwYXJhbXMpKVxuXG4oZGVmdW4gd3JpdGUtb3ZlcmxvYWRpbmctZm5cbiAgKGZvcm0pXG4gIChsZXQqICgob3ZlcmxvYWRzIChtYXAgd3JpdGUtZm4tb3ZlcmxvYWQgKDptZXRob2RzIGZvcm0pKSkpXG4gICAgezpwYXJhbXMgW11cbiAgICAgOmJvZHkgKC0+YmxvY2sgezp0eXBlIDpTd2l0Y2hTdGF0ZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgIDpkaXNjcmltaW5hbnQgezp0eXBlIDpNZW1iZXJFeHByZXNzaW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Y29tcHV0ZWQgZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpvYmplY3Qgezp0eXBlIDpJZGVudGlmaWVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6bmFtZSA6YXJndW1lbnRzfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnByb3BlcnR5IHs6dHlwZSA6SWRlbnRpZmllclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6bmFtZSA6bGVuZ3RofX1cbiAgICAgICAgICAgICAgICAgICAgIDpjYXNlcyAoaWYgKDp2YXJpYWRpYyBmb3JtKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3ZlcmxvYWRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoY29uaiBvdmVybG9hZHMgKGZhbGxiYWNrLW92ZXJsb2FkKSkpfSl9KSlcblxuKGRlZnVuIHdyaXRlLWZuLW92ZXJsb2FkXG4gIChmb3JtKVxuICAobGV0KiAoKHBhcmFtcyAoOnBhcmFtcyBmb3JtKSlcbiAgICAgICAgKGJpbmRpbmdzIChpZiAoOnZhcmlhZGljIGZvcm0pXG4gICAgICAgICAgICAgICAgICAgKGNvbmogKHdyaXRlLW92ZXJsb2FkaW5nLXBhcmFtcyAodmVjIChidXRsYXN0IHBhcmFtcykpKVxuICAgICAgICAgICAgICAgICAgICAgICAgIChzcGxpY2UtYmluZGluZyBmb3JtKSlcbiAgICAgICAgICAgICAgICAgICAod3JpdGUtb3ZlcmxvYWRpbmctcGFyYW1zIHBhcmFtcykpKVxuICAgICAgICAoc3RhdGVtZW50cyAodmVjIChjb25jYXQgYmluZGluZ3MgKDpzdGF0ZW1lbnRzIGZvcm0pKSkpKVxuICAgIHs6dHlwZSA6U3dpdGNoQ2FzZVxuICAgICA6dGVzdCAoaWYgKG5vdCAoOnZhcmlhZGljIGZvcm0pKVxuICAgICAgICAgICAgIHs6dHlwZSA6TGl0ZXJhbFxuICAgICAgICAgICAgICA6dmFsdWUgKDphcml0eSBmb3JtKX0pXG4gICAgIDpjb25zZXF1ZW50ICh3cml0ZS1ib2R5IChjb25qIGZvcm0gezpzdGF0ZW1lbnRzIHN0YXRlbWVudHN9KSl9KSlcblxuKGRlZnVuIHdyaXRlLXNpbXBsZS1mblxuICAoZm9ybSlcbiAgKGxldCogKChtZXRob2QgKGZpcnN0ICg6bWV0aG9kcyBmb3JtKSkpXG4gICAgICAgIChwYXJhbXMgKGlmICg6dmFyaWFkaWMgbWV0aG9kKVxuICAgICAgICAgICAgICAgICAodmVjIChidXRsYXN0ICg6cGFyYW1zIG1ldGhvZCkpKVxuICAgICAgICAgICAgICAgICAoOnBhcmFtcyBtZXRob2QpKSlcbiAgICAgICAgKGJvZHkgKGlmICg6dmFyaWFkaWMgbWV0aG9kKVxuICAgICAgICAgICAgICAgKGNvbmogbWV0aG9kXG4gICAgICAgICAgICAgICAgICAgICB7OnN0YXRlbWVudHMgKHZlYyAoY29ucyAoc3BsaWNlLWJpbmRpbmcgbWV0aG9kKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKDpzdGF0ZW1lbnRzIG1ldGhvZCkpKX0pXG4gICAgICAgICAgICAgICBtZXRob2QpKSlcbiAgICB7OnBhcmFtcyAobWFwIHdyaXRlLXZhciBwYXJhbXMpXG4gICAgIDpib2R5ICgtPmJsb2NrICh3cml0ZS1ib2R5IGJvZHkpKX0pKVxuXG4oZGVmdW4gcmVzb2x2ZVxuICAoZnJvbSB0bylcbiAgKGxldCogKChyZXF1aXJlciAoc3BsaXQgKG5hbWUgZnJvbSkgXFwuKSlcbiAgICAgICAgKHJlcXVpcmVtZW50IChzcGxpdCAobmFtZSB0bykgXFwuKSlcbiAgICAgICAgKHJlbGF0aXZlPyAoYW5kIChub3QgKGlkZW50aWNhbD8gKG5hbWUgZnJvbSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAobmFtZSB0bykpKVxuICAgICAgICAgICAgICAgICAgICAgICAoaWRlbnRpY2FsPyAoZmlyc3QgcmVxdWlyZXIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmaXJzdCByZXF1aXJlbWVudCkpKSkpXG4gICAgKGlmIHJlbGF0aXZlP1xuICAgICAgKGxvb3AgKChmcm9tIHJlcXVpcmVyKVxuICAgICAgICAgICAgICh0byByZXF1aXJlbWVudCkpXG4gICAgICAgIChpZiAoaWRlbnRpY2FsPyAoZmlyc3QgZnJvbSlcbiAgICAgICAgICAgICAgICAgICAgICAgIChmaXJzdCB0bykpXG4gICAgICAgICAgKHJlY3VyIChyZXN0IGZyb20pIChyZXN0IHRvKSlcbiAgICAgICAgICAoam9pbiBcXC9cbiAgICAgICAgICAgICAgICAoY29uY2F0IFtcXC5dXG4gICAgICAgICAgICAgICAgICAgICAgICAocmVwZWF0IChkZWMgKGNvdW50IGZyb20pKSBcIi4uXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICB0bykpKSlcbiAgICAgIChqb2luIFxcLyByZXF1aXJlbWVudCkpKSlcblxuKGRlZnVuIGlkLT5uc1xuICAoaWQpXG4gIFwiVGFrZXMgbmFtZXNwYWNlIGlkZW50aWZpZXIgc3ltYm9sIGFuZCB0cmFuc2xhdGVzIHRvIG5ld1xuICBzeW1ib2wgd2l0aG91dCAuIHNwZWNpYWwgY2hhcmFjdGVyc1xuICB3aXNwLmNvcmUgLT4gd2lzcCpjb3JlXCJcbiAgKHN5bWJvbCBuaWwgKGpvaW4gXFwqIChzcGxpdCAobmFtZSBpZCkgXFwuKSkpKVxuXG5cbihkZWZ1biB3cml0ZS1yZXF1aXJlXG4gIChmb3JtIHJlcXVpcmVyKVxuICAobGV0KiAoKG5zLWJpbmRpbmcgezpvcCA6ZGVmXG4gICAgICAgICAgICAgICAgICAgIDppZCB7Om9wIDp2YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICA6dHlwZSA6aWRlbnRpZmllclxuICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtIChpZC0+bnMgKDpucyBmb3JtKSl9XG4gICAgICAgICAgICAgICAgICAgIDppbml0IHs6b3AgOmludm9rZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgOmNhbGxlZSB7Om9wIDp2YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDp0eXBlIDppZGVudGlmaWVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Zm9ybSAncmVxdWlyZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDpwYXJhbXMgW3s6b3AgOmNvbnN0YW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gKHJlc29sdmUgcmVxdWlyZXIgKDpucyBmb3JtKSl9XX19KVxuICAgICAgICAobnMtYWxpYXMgKGlmICg6YWxpYXMgZm9ybSlcbiAgICAgICAgICAgICAgICAgICB7Om9wIDpkZWZcbiAgICAgICAgICAgICAgICAgICAgOmlkIHs6b3AgOnZhclxuICAgICAgICAgICAgICAgICAgICAgICAgIDp0eXBlIDppZGVudGlmaWVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gKGlkLT5ucyAoOmFsaWFzIGZvcm0pKX1cbiAgICAgICAgICAgICAgICAgICAgOmluaXQgKDppZCBucy1iaW5kaW5nKX0pKVxuXG4gICAgICAgIChyZWZlcmVuY2VzIChyZWR1Y2UgKGxhbWJkYSAocmVmZXJlbmNlcyBmb3JtKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoY29uaiByZWZlcmVuY2VzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHs6b3AgOmRlZlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmlkIHs6b3AgOnZhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6dHlwZSA6aWRlbnRpZmllclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Zm9ybSAob3IgKDpyZW5hbWUgZm9ybSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICg6bmFtZSBmb3JtKSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6aW5pdCB7Om9wIDptZW1iZXItZXhwcmVzc2lvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpjb21wdXRlZCBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDp0YXJnZXQgKDppZCBucy1iaW5kaW5nKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpwcm9wZXJ0eSB7Om9wIDp2YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDp0eXBlIDppZGVudGlmaWVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Zm9ybSAoOm5hbWUgZm9ybSl9fX0pKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgW11cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICg6cmVmZXIgZm9ybSkpKSlcbiAgICAodmVjIChjb25zIG5zLWJpbmRpbmdcbiAgICAgICAgICAgICAgIChpZiBucy1hbGlhc1xuICAgICAgICAgICAgICAgICAoY29ucyBucy1hbGlhcyByZWZlcmVuY2VzKVxuICAgICAgICAgICAgICAgICByZWZlcmVuY2VzKSkpKSlcblxuKGRlZnVuIHdyaXRlLW5zXG4gIChmb3JtKVxuICAobGV0KiAoKG5vZGUgKDpmb3JtIGZvcm0pKVxuICAgICAgICAocmVxdWlyZXIgKDpuYW1lIGZvcm0pKVxuICAgICAgICAobnMtYmluZGluZyB7Om9wIDpkZWZcbiAgICAgICAgICAgICAgICAgICAgOm9yaWdpbmFsLWZvcm0gbm9kZVxuICAgICAgICAgICAgICAgICAgICA6aWQgezpvcCA6dmFyXG4gICAgICAgICAgICAgICAgICAgICAgICAgOnR5cGUgOmlkZW50aWZpZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICA6b3JpZ2luYWwtZm9ybSAoZmlyc3Qgbm9kZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICA6Zm9ybSAnKm5zKn1cbiAgICAgICAgICAgICAgICAgICAgOmluaXQgezpvcCA6ZGljdGlvbmFyeVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gbm9kZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgOmtleXMgW3s6b3AgOnZhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6dHlwZSA6aWRlbnRpZmllclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6b3JpZ2luYWwtZm9ybSBub2RlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtICdpZH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Om9wIDp2YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnR5cGUgOmlkZW50aWZpZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOm9yaWdpbmFsLWZvcm0gbm9kZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Zm9ybSAnZG9jfV1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDp2YWx1ZXMgW3s6b3AgOmNvbnN0YW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnR5cGUgOmlkZW50aWZpZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6b3JpZ2luYWwtZm9ybSAoOm5hbWUgZm9ybSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Zm9ybSAobmFtZSAoOm5hbWUgZm9ybSkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgezpvcCA6Y29uc3RhbnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6b3JpZ2luYWwtZm9ybSBub2RlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gKDpkb2MgZm9ybSl9XX19KVxuICAgICAgICAocmVxdWlyZW1lbnRzICh2ZWMgKGFwcGx5IGNvbmNhdCAobWFwIChsYW1iZGEgKCUpICh3cml0ZS1yZXF1aXJlICUgcmVxdWlyZXIpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKDpyZXF1aXJlIGZvcm0pKSkpKSlcbiAgICAoLT5ibG9jayAobWFwIHdyaXRlICh2ZWMgKGNvbnMgbnMtYmluZGluZyByZXF1aXJlbWVudHMpKSkpKSlcbihpbnN0YWxsLXdyaXRlciEgOm5zIHdyaXRlLW5zKVxuXG4oZGVmdW4gd3JpdGUtZm5cbiAgKGZvcm0pXG4gIChsZXQqICgoYmFzZSAoaWYgKD4gKGNvdW50ICg6bWV0aG9kcyBmb3JtKSkgMSlcbiAgICAgICAgICAgICAgICAod3JpdGUtb3ZlcmxvYWRpbmctZm4gZm9ybSlcbiAgICAgICAgICAgICAgICAod3JpdGUtc2ltcGxlLWZuIGZvcm0pKSkpXG4gICAgOzsgQXJyb3dzIChsYW1iZGEqKSBhcmUgYW5vbnltb3VzIGJ5IGNvbnN0cnVjdGlvbjogOmlkIGlzIG5pbCBhbmRcbiAgICA7OyBgZXhwcmVzc2lvbiBmYWxzZWAgc2VsZWN0cyB0aGUgYmxvY2stYm9keSBmb3JtLiBSZWd1bGFyIGZucyBrZWVwXG4gICAgOzsgdGhlaXIgb3B0aW9uYWwgbmFtZTsgdGhlIG9sZCBTcGlkZXJNb25rZXktb25seSBrZXlzICg6ZGVmYXVsdHNcbiAgICA7OyA6cmVzdCA6ZXhwcmVzc2lvbikgYXJlIGdvbmUgLS0gRVNUcmVlL2VzY29kZWdlbiAyLnggZG9uJ3QgdXNlXG4gICAgOzsgdGhlbS5cbiAgICAoY29uaiBiYXNlXG4gICAgICAgICAgKGlmICg6YXJyb3cgZm9ybSlcbiAgICAgICAgICAgIHs6dHlwZSA6QXJyb3dGdW5jdGlvbkV4cHJlc3Npb25cbiAgICAgICAgICAgICA6ZXhwcmVzc2lvbiBmYWxzZX1cbiAgICAgICAgICAgIHs6dHlwZSA6RnVuY3Rpb25FeHByZXNzaW9uXG4gICAgICAgICAgICAgOmlkIChpZiAoOmlkIGZvcm0pICh3cml0ZS12YXIgKDppZCBmb3JtKSkpXG4gICAgICAgICAgICAgOmdlbmVyYXRvciBmYWxzZX0pKSkpXG4oaW5zdGFsbC13cml0ZXIhIDpmbiB3cml0ZS1mbilcblxuKGRlZnVuIHdyaXRlXG4gIChmb3JtKVxuICAobGV0KiAoKG9wICg6b3AgZm9ybSkpXG4gICAgICAgICh3cml0ZXIgKGFuZCAoPSA6aW52b2tlICg6b3AgZm9ybSkpXG4gICAgICAgICAgICAgICAgICAgICg9IDp2YXIgKDpvcCAoOmNhbGxlZSBmb3JtKSkpXG4gICAgICAgICAgICAgICAgICAgIChnZXQgKipzcGVjaWFscyoqIChuYW1lICg6Zm9ybSAoOmNhbGxlZSBmb3JtKSkpKSkpKVxuICAgIChpZiB3cml0ZXJcbiAgICAgICh3cml0ZS1zcGVjaWFsIHdyaXRlciBmb3JtKVxuICAgICAgKHdyaXRlLW9wICg6b3AgZm9ybSkgZm9ybSkpKSlcblxuKGRlZnVuIHdyaXRlKlxuICAoJnJlc3QgZm9ybXMpXG4gIChsZXQqICgoYm9keSAobWFwIHdyaXRlLXN0YXRlbWVudCBmb3JtcykpKVxuICAgIHs6dHlwZSA6UHJvZ3JhbVxuICAgICA6Ym9keSBib2R5XG4gICAgIDpsb2MgKGluaGVyaXQtbG9jYXRpb24gYm9keSl9KSlcblxuXG4oZGVmdW4gY29tcGlsZVxuICAoJnJlc3QgYXJncylcbiAgKGlmIChpZGVudGljYWw/IChjb3VudCBhcmdzKSAxKVxuICAgIChjb21waWxlIHt9IChmaXJzdCBhcmdzKSlcbiAgICAoZ2VuZXJhdGUgKGFwcGx5IHdyaXRlKiAocmVzdCBhcmdzKSkgKGZpcnN0IGFyZ3MpKSkpXG5cblxuKGRlZnVuIGdldC1tYWNyb1xuICAodGFyZ2V0IHByb3BlcnR5ICZyZXN0IGFyZ3MpXG4gIChpZiAoZW1wdHk/IGFyZ3MpXG4gICAgYChhZ2V0IChvciAsdGFyZ2V0IDApXG4gICAgICAgICAgICxwcm9wZXJ0eSlcbiAgICAobGV0KiAoKGRlZmF1bHQqIChmaXJzdCBhcmdzKSkpXG4gICAgICAoaWYgKGlkZW50aWNhbD8gZGVmYXVsdCogbmlsKVxuICAgICAgICBgKGdldCAsdGFyZ2V0ICxwcm9wZXJ0eSlcbiAgICAgICAgYChhcHBseSBnZXQgLFt0YXJnZXQgcHJvcGVydHkgZGVmYXVsdCpdKSkpKSlcbihpbnN0YWxsLW1hY3JvISA6Z2V0IGdldC1tYWNybylcblxuOzsgTG9naWNhbCBvcGVyYXRvcnNcblxuKGRlZnVuIGluc3RhbGwtbG9naWNhbC1vcGVyYXRvciFcbiAgKGNhbGxlZSBvcGVyYXRvciBmYWxsYmFjaylcbiAgKGRlZnVuIHdyaXRlLWxvZ2ljYWwtb3BlcmF0b3JcbiAgICAoJnJlc3Qgb3BlcmFuZHMpXG4gICAgKGxldCogKChuIChjb3VudCBvcGVyYW5kcykpKVxuICAgICAgKGNvbmQgKCg9IG4gMCkgKHdyaXRlLWNvbnN0YW50IGZhbGxiYWNrKSlcbiAgICAgICAgICAgICgoPSBuIDEpICh3cml0ZSAoZmlyc3Qgb3BlcmFuZHMpKSlcbiAgICAgICAgICAgIChlbHNlIChyZWR1Y2UgKGxhbWJkYSAobGVmdCByaWdodClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7OnR5cGUgOkxvZ2ljYWxFeHByZXNzaW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpvcGVyYXRvciBvcGVyYXRvclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6bGVmdCBsZWZ0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpyaWdodCAod3JpdGUgcmlnaHQpfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKHdyaXRlIChmaXJzdCBvcGVyYW5kcykpXG4gICAgICAgICAgICAgICAgICAgICAgICAgIChyZXN0IG9wZXJhbmRzKSkpKSkpXG4gIChpbnN0YWxsLXNwZWNpYWwhIGNhbGxlZSB3cml0ZS1sb2dpY2FsLW9wZXJhdG9yKSlcbihpbnN0YWxsLWxvZ2ljYWwtb3BlcmF0b3IhIDpvciA6fHwgbmlsKVxuKGluc3RhbGwtbG9naWNhbC1vcGVyYXRvciEgOmFuZCA6JiYgdHJ1ZSlcblxuKGRlZnVuIGluc3RhbGwtdW5hcnktb3BlcmF0b3IhXG4gIChjYWxsZWUgb3BlcmF0b3IgcHJlZml4PylcbiAgKGRlZnVuIHdyaXRlLXVuYXJ5LW9wZXJhdG9yXG4gICAgKCZyZXN0IHBhcmFtcylcbiAgICAoaWYgKGlkZW50aWNhbD8gKGNvdW50IHBhcmFtcykgMSlcbiAgICAgIHs6dHlwZSA6VW5hcnlFeHByZXNzaW9uXG4gICAgICAgOm9wZXJhdG9yIG9wZXJhdG9yXG4gICAgICAgOmFyZ3VtZW50ICh3cml0ZSAoZmlyc3QgcGFyYW1zKSlcbiAgICAgICA6cHJlZml4IHByZWZpeD99XG4gICAgICAoZXJyb3ItYXJnLWNvdW50IGNhbGxlZSAoY291bnQgcGFyYW1zKSkpKVxuICAoaW5zdGFsbC1zcGVjaWFsISBjYWxsZWUgd3JpdGUtdW5hcnktb3BlcmF0b3IpKVxuKGluc3RhbGwtdW5hcnktb3BlcmF0b3IhIDpub3QgOiEpXG5cbjs7IEJpdHdpc2UgT3BlcmF0b3JzXG5cbihpbnN0YWxsLXVuYXJ5LW9wZXJhdG9yISA6Yml0LW5vdCA6filcblxuKGRlZnVuIGluc3RhbGwtYmluYXJ5LW9wZXJhdG9yIVxuICAoY2FsbGVlIG9wZXJhdG9yKVxuICAoZGVmdW4gd3JpdGUtYmluYXJ5LW9wZXJhdG9yXG4gICAgKCZyZXN0IHBhcmFtcylcbiAgICAoaWYgKDwgKGNvdW50IHBhcmFtcykgMilcbiAgICAgIChlcnJvci1hcmctY291bnQgY2FsbGVlIChjb3VudCBwYXJhbXMpKVxuICAgICAgKHJlZHVjZSAobGFtYmRhIChsZWZ0IHJpZ2h0KVxuICAgICAgICAgICAgICAgIHs6dHlwZSA6QmluYXJ5RXhwcmVzc2lvblxuICAgICAgICAgICAgICAgICA6b3BlcmF0b3Igb3BlcmF0b3JcbiAgICAgICAgICAgICAgICAgOmxlZnQgbGVmdFxuICAgICAgICAgICAgICAgICA6cmlnaHQgKHdyaXRlIHJpZ2h0KX0pXG4gICAgICAgICAgICAgICh3cml0ZSAoZmlyc3QgcGFyYW1zKSlcbiAgICAgICAgICAgICAgKHJlc3QgcGFyYW1zKSkpKVxuICAoaW5zdGFsbC1zcGVjaWFsISBjYWxsZWUgd3JpdGUtYmluYXJ5LW9wZXJhdG9yKSlcbihpbnN0YWxsLWJpbmFyeS1vcGVyYXRvciEgOmJpdC1hbmQgOiYpXG4oaW5zdGFsbC1iaW5hcnktb3BlcmF0b3IhIDpiaXQtb3IgOnwpXG4oaW5zdGFsbC1iaW5hcnktb3BlcmF0b3IhIDpiaXQteG9yIDpeKVxuKGluc3RhbGwtYmluYXJ5LW9wZXJhdG9yISA6Yml0LXNoaWZ0LWxlZnQgOjw8KVxuKGluc3RhbGwtYmluYXJ5LW9wZXJhdG9yISA6Yml0LXNoaWZ0LXJpZ2h0IDo+PilcbihpbnN0YWxsLWJpbmFyeS1vcGVyYXRvciEgOmJpdC1zaGlmdC1yaWdodC16ZXJvLWZpbGwgOj4+PilcblxuOzsgQXJpdGhtZXRpYyBvcGVyYXRvcnNcblxuKGRlZnVuIGluc3RhbGwtYXJpdGhtZXRpYy1vcGVyYXRvciFcbiAgKGNhbGxlZSBvcGVyYXRvciB2YWxpZD8gZmFsbGJhY2spXG5cbiAgKGRlZnVuIHdyaXRlLWJpbmFyeS1vcGVyYXRvclxuICAgIChsZWZ0IHJpZ2h0KVxuICAgIHs6dHlwZSA6QmluYXJ5RXhwcmVzc2lvblxuICAgICA6b3BlcmF0b3IgKG5hbWUgb3BlcmF0b3IpXG4gICAgIDpsZWZ0IGxlZnRcbiAgICAgOnJpZ2h0ICh3cml0ZSByaWdodCl9KVxuXG4gIChkZWZ1biB3cml0ZS1hcml0aG1ldGljLW9wZXJhdG9yXG4gICAgKCZyZXN0IHBhcmFtcylcbiAgICAobGV0KiAoKG4gKGNvdW50IHBhcmFtcykpKVxuICAgICAgKGNvbmQgKChhbmQgdmFsaWQ/IChub3QgKHZhbGlkPyBuKSkpIChlcnJvci1hcmctY291bnQgKG5hbWUgY2FsbGVlKSBuKSlcbiAgICAgICAgICAgICgoPT0gbiAwKSAod3JpdGUtbGl0ZXJhbCBmYWxsYmFjaykpXG4gICAgICAgICAgICAoKD09IG4gMSkgKHJlZHVjZSB3cml0ZS1iaW5hcnktb3BlcmF0b3JcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHdyaXRlLWxpdGVyYWwgZmFsbGJhY2spXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtcykpXG4gICAgICAgICAgICAoZWxzZSAocmVkdWNlIHdyaXRlLWJpbmFyeS1vcGVyYXRvclxuICAgICAgICAgICAgICAgICAgICAgICAgICAod3JpdGUgKGZpcnN0IHBhcmFtcykpXG4gICAgICAgICAgICAgICAgICAgICAgICAgIChyZXN0IHBhcmFtcykpKSkpKVxuXG5cbiAgKGluc3RhbGwtc3BlY2lhbCEgY2FsbGVlIHdyaXRlLWFyaXRobWV0aWMtb3BlcmF0b3IpKVxuXG4oaW5zdGFsbC1hcml0aG1ldGljLW9wZXJhdG9yISA6KyA6KyBuaWwgMClcbihpbnN0YWxsLWFyaXRobWV0aWMtb3BlcmF0b3IhIDotIDotIChsYW1iZGEgKCUpICg+PSAlIDEpKSAwKVxuKGluc3RhbGwtYXJpdGhtZXRpYy1vcGVyYXRvciEgOiogOiogbmlsIDEpXG4oaW5zdGFsbC1hcml0aG1ldGljLW9wZXJhdG9yISAoa2V5d29yZCBcXC8pIChrZXl3b3JkIFxcLykgKGxhbWJkYSAoJSkgKD49ICUgMSkpIDEpXG4oaW5zdGFsbC1hcml0aG1ldGljLW9wZXJhdG9yISA6cmVtIChrZXl3b3JkIFxcJSkgKGxhbWJkYSAoJSkgKD09ICUgMikpIDEpXG5cblxuOzsgQ29tcGFyaXNvbiBvcGVyYXRvcnNcblxuKGRlZnVuIGluc3RhbGwtY29tcGFyaXNvbi1vcGVyYXRvciFcbiAgKGNhbGxlZSBvcGVyYXRvciBmYWxsYmFjaylcbiAgXCJHZW5lcmF0ZXMgY29tcGFyaXNvbiBvcGVyYXRvciB3cml0ZXIgdGhhdCBnaXZlbiBvbmVcbiAgcGFyYW1ldGVyIHdyaXRlcyBgZmFsbGJhY2tgIGdpdmVuIHR3byBwYXJhbWV0ZXJzIHdyaXRlc1xuICBiaW5hcnkgZXhwcmVzc2lvbiBhbmQgZ2l2ZW4gbW9yZSBwYXJhbWV0ZXJzIHdyaXRlcyBiaW5hcnlcbiAgZXhwcmVzc2lvbnMgam9pbmVkIGJ5IGxvZ2ljYWwgYW5kLlwiXG5cbiAgOzsgVE9ETyAjNTRcbiAgOzsgQ29tcGFyaXNvbiBvcGVyYXRvcnMgbXVzdCB1c2UgdGVtcG9yYXJ5IHZhcmlhYmxlIHRvIHN0b3JlXG4gIDs7IGV4cHJlc3Npb24gbm9uIGxpdGVyYWwgYW5kIG5vbi1pZGVudGlmaWVycy5cbiAgKGRlZnVuIHdyaXRlLWNvbXBhcmlzb24tb3BlcmF0b3JcbiAgICAoJnJlc3QgYXJncylcbiAgICAobGV0KiAoKG4gKGNvdW50IGFyZ3MpKSlcbiAgICAgIChjb25kICgoaWRlbnRpY2FsPyBuIDApIChlcnJvci1hcmctY291bnQgY2FsbGVlIDApKVxuICAgICAgICAgICAgKChpZGVudGljYWw/IG4gMSkgKC0+c2VxdWVuY2UgWyh3cml0ZSAoZmlyc3QgYXJncykpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAod3JpdGUtbGl0ZXJhbCBmYWxsYmFjayldKSlcbiAgICAgICAgICAgICgoaWRlbnRpY2FsPyBuIDIpIHs6dHlwZSA6QmluYXJ5RXhwcmVzc2lvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOm9wZXJhdG9yIG9wZXJhdG9yXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6bGVmdCAod3JpdGUgKGZpcnN0IGFyZ3MpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnJpZ2h0ICh3cml0ZSAoc2Vjb25kIGFyZ3MpKX0pXG4gICAgICAgICAgICAoZWxzZSAobGV0KiAoKGxlZnQgKGZpcnN0IGFyZ3MpKVxuICAgICAgICAgICAgICAgICAgICAgICAgKHJpZ2h0IChzZWNvbmQgYXJncykpXG4gICAgICAgICAgICAgICAgICAgICAgICAobW9yZSAocmVzdCAocmVzdCBhcmdzKSkpKVxuICAgICAgICAgICAgICAgICAgICAocmVkdWNlIChsYW1iZGEgKGxlZnQgcmlnaHQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7OnR5cGUgOkxvZ2ljYWxFeHByZXNzaW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOm9wZXJhdG9yIDomJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpsZWZ0IGxlZnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6cmlnaHQgezp0eXBlIDpCaW5hcnlFeHByZXNzaW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6b3BlcmF0b3Igb3BlcmF0b3JcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpsZWZ0IChpZiAoPSA6TG9naWNhbEV4cHJlc3Npb24gKDp0eXBlIGxlZnQpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoOnJpZ2h0ICg6cmlnaHQgbGVmdCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICg6cmlnaHQgbGVmdCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6cmlnaHQgKHdyaXRlIHJpZ2h0KX19KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICh3cml0ZS1jb21wYXJpc29uLW9wZXJhdG9yIGxlZnQgcmlnaHQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9yZSkpKSkpKVxuXG4gIChpbnN0YWxsLXNwZWNpYWwhIGNhbGxlZSB3cml0ZS1jb21wYXJpc29uLW9wZXJhdG9yKSlcblxuKGluc3RhbGwtY29tcGFyaXNvbi1vcGVyYXRvciEgOj09IDo9PSB0cnVlKVxuKGluc3RhbGwtY29tcGFyaXNvbi1vcGVyYXRvciEgOj4gOj4gdHJ1ZSlcbihpbnN0YWxsLWNvbXBhcmlzb24tb3BlcmF0b3IhIDo+PSA6Pj0gdHJ1ZSlcbihpbnN0YWxsLWNvbXBhcmlzb24tb3BlcmF0b3IhIDo8IDo8IHRydWUpXG4oaW5zdGFsbC1jb21wYXJpc29uLW9wZXJhdG9yISA6PD0gOjw9IHRydWUpXG5cblxuKGRlZnVuIHdyaXRlLWlkZW50aWNhbD9cbiAgKCZyZXN0IHBhcmFtcylcbiAgOzsgVE9ETzogU3VibWl0IGEgYnVnIGZvciBjbG9qdXJlIHRvIGFsbG93IHZhcmlhZGljXG4gIDs7IG51bWJlciBvZiBwYXJhbXMgam9pbmVkIGJ5IGxvZ2ljYWwgYW5kLlxuICAoaWYgKGlkZW50aWNhbD8gKGNvdW50IHBhcmFtcykgMilcbiAgICB7OnR5cGUgOkJpbmFyeUV4cHJlc3Npb25cbiAgICAgOm9wZXJhdG9yIDo9PT1cbiAgICAgOmxlZnQgKHdyaXRlIChmaXJzdCBwYXJhbXMpKVxuICAgICA6cmlnaHQgKHdyaXRlIChzZWNvbmQgcGFyYW1zKSl9XG4gICAgKGVycm9yLWFyZy1jb3VudCA6aWRlbnRpY2FsPyAoY291bnQgcGFyYW1zKSkpKVxuKGluc3RhbGwtc3BlY2lhbCEgOmlkZW50aWNhbD8gd3JpdGUtaWRlbnRpY2FsPylcblxuKGRlZnVuIHdyaXRlLWluc3RhbmNlP1xuICAoJnJlc3QgcGFyYW1zKVxuICA7OyBUT0RPOiBTdWJtaXQgYSBidWcgZm9yIGNsb2p1cmUgdG8gbWFrZSBzdXJlIHRoYXRcbiAgOzsgaW5zdGFuY2U/IGVpdGhlciBhY2NlcHRzIG9ubHkgdHdvIGFyZ3Mgb3IgcmV0dXJuc1xuICA7OyB0cnVlIG9ubHkgaWYgYWxsIHRoZSBwYXJhbXMgYXJlIGluc3RhbmNlIG9mIHRoZVxuICA7OyBnaXZlbiB0eXBlLlxuXG4gIChsZXQqICgoY29uc3RydWN0b3IgKGZpcnN0IHBhcmFtcykpXG4gICAgICAgIChpbnN0YW5jZSAoc2Vjb25kIHBhcmFtcykpKVxuICAgIChpZiAoPCAoY291bnQgcGFyYW1zKSAxKVxuICAgICAgKGVycm9yLWFyZy1jb3VudCA6aW5zdGFuY2U/IChjb3VudCBwYXJhbXMpKVxuICAgICAgezp0eXBlIDpCaW5hcnlFeHByZXNzaW9uXG4gICAgICAgOm9wZXJhdG9yIDppbnN0YW5jZW9mXG4gICAgICAgOmxlZnQgKGlmIGluc3RhbmNlXG4gICAgICAgICAgICAgICAod3JpdGUgaW5zdGFuY2UpXG4gICAgICAgICAgICAgICAod3JpdGUtY29uc3RhbnQgaW5zdGFuY2UpKVxuICAgICAgIDpyaWdodCAod3JpdGUgY29uc3RydWN0b3IpfSkpKVxuKGluc3RhbGwtc3BlY2lhbCEgOmluc3RhbmNlPyB3cml0ZS1pbnN0YW5jZT8pXG5cblxuKGRlZnVuIGV4cGFuZC1hcHBseVxuICAoZiAmcmVzdCBwYXJhbXMpXG4gIChsZXQqICgocHJlZml4ICh2ZWMgKGJ1dGxhc3QgcGFyYW1zKSkpKVxuICAgIChpZiAoZW1wdHk/IHByZWZpeClcbiAgICAgIGAoLmFwcGx5ICxmIG5pbCAsQHBhcmFtcylcbiAgICAgIGAoLmFwcGx5ICxmIG5pbCAoLmNvbmNhdCAscHJlZml4ICwobGFzdCBwYXJhbXMpKSkpKSlcbihpbnN0YWxsLW1hY3JvISA6YXBwbHkgZXhwYW5kLWFwcGx5KVxuXG5cbihkZWZ1biBleHBhbmQtcHJpbnRcbiAgKCZmb3JtICZyZXN0IG1vcmUpXG4gIFwiUHJpbnRzIHRoZSBvYmplY3QocykgdG8gdGhlIG91dHB1dCBmb3IgaHVtYW4gY29uc3VtcHRpb24uXCJcbiAgKGxldCogKChvcCAod2l0aC1tZXRhICdjb25zb2xlLmxvZyAobWV0YSAmZm9ybSkpKSlcbiAgICBgKCxvcCAsQG1vcmUpKSlcbihpbnN0YWxsLW1hY3JvISA6cHJpbnQgKHdpdGgtbWV0YSBleHBhbmQtcHJpbnQgezppbXBsaWNpdCBbOiZmb3JtXX0pKVxuXG4oZGVmdW4gZXhwYW5kLXN0clxuICAoJnJlc3QgZm9ybXMpXG4gIFwic3RyIGlubGluaW5nIGFuZCBvcHRpbWl6YXRpb24gdmlhIG1hY3Jvc1wiXG4gIGAoKyBcIlwiICxAZm9ybXMpKVxuKGluc3RhbGwtbWFjcm8hIDpzdHIgZXhwYW5kLXN0cilcblxuKGRlZnVuIGV4cGFuZC1kZWJ1Z1xuICAoKVxuICAnZGVidWdnZXIpXG4oaW5zdGFsbC1tYWNybyEgOmRlYnVnZ2VyISBleHBhbmQtZGVidWcpXG5cbihkZWZ1biBleHBhbmQtYXNzZXJ0XG4gICh4ICZyZXN0IGFyZ3MpXG4gIFwiRXZhbHVhdGVzIGV4cHIgYW5kIHRocm93cyBhbiBleGNlcHRpb24gaWYgaXQgZG9lcyBub3QgZXZhbHVhdGUgdG9cbiAgICBsb2dpY2FsIHRydWUuXCJcbiAgKGxldCogKChtZXNzYWdlIChpZiAoZW1wdHk/IGFyZ3MpIFwiXCIgKGZpcnN0IGFyZ3MpKSlcbiAgICAgICAgKGZvcm0gKHByLXN0ciB4KSkpXG4gICAgYChpZiAobm90ICx4KVxuICAgICAgICh0aHJvdyAoRXJyb3IgKHN0ciBcIkFzc2VydCBmYWlsZWQ6IFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICxtZXNzYWdlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICxmb3JtKSkpKSkpXG4oaW5zdGFsbC1tYWNybyEgOmFzc2VydCBleHBhbmQtYXNzZXJ0KVxuXG5cbihkZWZ1biBleHBhbmQtdHlwZXN0ciAoaXQpXG4gIChsZXQqICgocHJlZml4IFwiW29iamVjdCBcIikgKHN1ZmZpeCBcIl1cIikpXG4gICAgYCgtPiAoLmNhbGwgT2JqZWN0LnByb3RvdHlwZS50by1zdHJpbmcgLGl0KVxuICAgICAgICAgKC5zbGljZSAsKGNvdW50IHByZWZpeCkgLCgtIChjb3VudCBzdWZmaXgpKSkpKSlcblxuKGRlZnVuIGV4cGFuZC1kZWZwcm90b2NvbFxuICAoJmVudiBpZCAmcmVzdCBmb3JtcylcbiAgKGxldCogKChucyAobmFtZSAoOm5hbWUgKDpucyAmZW52KSkpKVxuICAgICAgICAocHJvdG9jb2wtbmFtZSAobmFtZSBpZCkpXG4gICAgICAgIChwcm90b2NvbC1kb2MgKGlmIChzdHJpbmc/IChmaXJzdCBmb3JtcykpXG4gICAgICAgICAgICAgICAgICAgICAgIChmaXJzdCBmb3JtcykpKVxuICAgICAgICAocHJvdG9jb2wtbWV0aG9kcyAoaWYgcHJvdG9jb2wtZG9jXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAocmVzdCBmb3JtcylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1zKSlcbiAgICAgICAgKG5vdC1zdXBwb3J0ZWQgKGxhbWJkYSAobWV0aG9kKSBgKGxhbWJkYSAoJSkgKHRocm93IChzdHIgLChzdHIgXCJObyBwcm90b2NvbCBtZXRob2QgXCIgcHJvdG9jb2wtbmFtZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiLlwiIG1ldGhvZCBcIiBkZWZpbmVkIGZvciB0eXBlIFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICwoZXhwYW5kLXR5cGVzdHIgJyUpIFwiOiBcIiAlKSkpKSlcbiAgICAgICAgKHByb3RvY29sIChtYXB2IChsYW1iZGEgKG1ldGhvZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAobGV0KiAoKG1ldGhvZC1uYW1lIChmaXJzdCBtZXRob2QpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChpZCAoaWQtPm5zIChzdHIgbnMgXCIkXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvdG9jb2wtbmFtZSBcIiRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAobmFtZSBtZXRob2QtbmFtZSkpKSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB7OmlkIG1ldGhvZC1uYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZuIGAobGFtYmRhICxpZCAoc2VsZilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKC5hcHBseSAob3IgKGlmIChvciAoaWRlbnRpY2FsPyBzZWxmIG51bGwpIChpZGVudGljYWw/IHNlbGYgbmlsKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoLi1uaWwgLGlkKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChvciAoYWdldCBzZWxmICcsaWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChhZ2V0ICxpZCAsKGV4cGFuZC10eXBlc3RyICdzZWxmKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKC4tXyAsaWQpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLChub3Qtc3VwcG9ydGVkIChuYW1lIGlkKSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZiBhcmd1bWVudHMpKX0pKVxuICAgICAgICAgICAgICAgICAgICAgICBwcm90b2NvbC1tZXRob2RzKSlcbiAgICAgICAgKGZucyAobWFwIChsYW1iZGEgKGZvcm0pXG4gICAgICAgICAgICAgICAgICAgYChkZWZ2YXIgLCg6aWQgZm9ybSkgKGFnZXQgLGlkICcsKDppZCBmb3JtKSkpKVxuICAgICAgICAgICAgICAgICBwcm90b2NvbCkpXG4gICAgICAgIChzYXRpc2Z5IHs6d2lzcF9jb3JlJElQcm90b2NvbCRpZCAoc3RyIG5zIFwiL1wiIHByb3RvY29sLW5hbWUpfSlcbiAgICAgICAgKGJvZHkgKHJlZHVjZSAobGFtYmRhIChib2R5IG1ldGhvZClcbiAgICAgICAgICAgICAgICAgICAgICAgKGFzc29jIGJvZHkgKDppZCBtZXRob2QpICg6Zm4gbWV0aG9kKSkpXG4gICAgICAgICAgICAgICAgICAgICBzYXRpc2Z5XG4gICAgICAgICAgICAgICAgICAgICBwcm90b2NvbCkpKVxuICAgIGAoLCh3aXRoLW1ldGEgJ3Byb2duIHs6YmxvY2sgdHJ1ZX0pXG4gICAgICAgKGRlZnZhciAsaWQgLGJvZHkpXG4gICAgICAgLEBmbnNcbiAgICAgICAsaWQpKSlcbihpbnN0YWxsLW1hY3JvISA6ZGVmcHJvdG9jb2wgKHdpdGgtbWV0YSBleHBhbmQtZGVmcHJvdG9jb2wgezppbXBsaWNpdCBbOiZlbnZdfSkpXG5cbihkZWZ1biBleHBhbmQtZGVmdHlwZVxuICAoaWQgZmllbGRzICZyZXN0IGZvcm1zKVxuICAobGV0KiAoKHR5cGUtaW5pdCAobWFwIChsYW1iZGEgKGZpZWxkKSBgKHNldGYgKGFnZXQgdGhpcyAnLGZpZWxkKSAsZmllbGQpKVxuICAgICAgICAgICAgICAgICAgICAgICBmaWVsZHMpKVxuICAgICAgICAoY29uc3RydWN0b3IgKGNvbmogdHlwZS1pbml0ICd0aGlzKSlcbiAgICAgICAgKG1ldGhvZC1pbml0IChtYXAgKGxhbWJkYSAoZmllbGQpIGAoZGVmdmFyICxmaWVsZCAoYWdldCB0aGlzICcsZmllbGQpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZHMpKVxuICAgICAgICAobWFrZS1tZXRob2QgKGxhbWJkYSAocHJvdG9jb2wgZm9ybSlcbiAgICAgICAgICAgICAgICAgICAgICAobGV0KiAoKG1ldGhvZC1uYW1lIChmaXJzdCBmb3JtKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAocGFyYW1zIChzZWNvbmQgZm9ybSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGJvZHkgKHJlc3QgKHJlc3QgZm9ybSkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmaWVsZC1uYW1lIChpZiAoPSAobmFtZSBwcm90b2NvbCkgXCJPYmplY3RcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYChxdW90ZSAsbWV0aG9kLW5hbWUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGAoLi1uYW1lIChhZ2V0ICxwcm90b2NvbCAnLG1ldGhvZC1uYW1lKSkpKSlcblxuICAgICAgICAgICAgICAgICAgICAgICAgYChzZXRmIChhZ2V0ICguLXByb3RvdHlwZSAsaWQpICxmaWVsZC1uYW1lKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChsYW1iZGEgLHBhcmFtcyAsQG1ldGhvZC1pbml0ICxAYm9keSkpKSkpXG4gICAgICAgIChzYXRpc2Z5IChsYW1iZGEgKHByb3RvY29sKVxuICAgICAgICAgICAgICAgICAgYChzZXRmIChhZ2V0ICguLXByb3RvdHlwZSAsaWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKC4td2lzcF9jb3JlJElQcm90b2NvbCRpZCAscHJvdG9jb2wpKVxuICAgICAgICAgICAgICAgICAgICAgICAgIHRydWUpKSlcblxuICAgICAgICAoYm9keSAocmVkdWNlIChsYW1iZGEgKHR5cGUgZm9ybSlcbiAgICAgICAgICAgICAgICAgICAgICAgKGlmIChsaXN0PyBmb3JtKVxuICAgICAgICAgICAgICAgICAgICAgICAgIChjb25qIHR5cGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7OmJvZHkgKGNvbmogKDpib2R5IHR5cGUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChtYWtlLW1ldGhvZCAoOnByb3RvY29sIHR5cGUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JtKSl9KVxuICAgICAgICAgICAgICAgICAgICAgICAgIChjb25qIHR5cGUgezpwcm90b2NvbCBmb3JtXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmJvZHkgKGNvbmogKDpib2R5IHR5cGUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHNhdGlzZnkgZm9ybSkpfSkpKVxuXG4gICAgICAgICAgICAgICAgICAgICAgIHs6cHJvdG9jb2wgbmlsXG4gICAgICAgICAgICAgICAgICAgICAgICA6Ym9keSBbXX1cblxuICAgICAgICAgICAgICAgICAgICAgICBmb3JtcykpXG5cbiAgICAgICAgKG1ldGhvZHMgKDpib2R5IGJvZHkpKSlcbiAgICBgKGRlZnZhciAsaWQgKHByb2duXG4gICAgICAgKGRlZnVuLSAsaWQgLGZpZWxkcyAsQGNvbnN0cnVjdG9yKVxuICAgICAgICxAbWV0aG9kc1xuICAgICAgICxpZCkpKSlcbihpbnN0YWxsLW1hY3JvISA6ZGVmdHlwZSBleHBhbmQtZGVmdHlwZSlcbihpbnN0YWxsLW1hY3JvISA6ZGVmcmVjb3JkIGV4cGFuZC1kZWZ0eXBlKVxuXG4oZGVmdW4gZXhwYW5kLWV4dGVuZC10eXBlXG4gICh0eXBlICZyZXN0IGZvcm1zKVxuICAobGV0KiAoKGRlZmF1bHQtdHlwZT8gKD0gdHlwZSAnZGVmYXVsdCkpXG4gICAgICAgIChuaWwtdHlwZT8gKG5pbD8gdHlwZSkpXG5cbiAgICAgICAgKHR5cGUtbmFtZSAoY29uZCAoKG5pbD8gdHlwZSkgKHN5bWJvbCBcIm5pbFwiKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICgoPSB0eXBlICdkZWZhdWx0KSAnXylcbiAgICAgICAgICAgICAgICAgICAgICAgICgoPSB0eXBlICdudW1iZXIpICdOdW1iZXIpXG4gICAgICAgICAgICAgICAgICAgICAgICAoKD0gdHlwZSAnc3RyaW5nKSAnU3RyaW5nKVxuICAgICAgICAgICAgICAgICAgICAgICAgKCg9IHR5cGUgJ2Jvb2xlYW4pICdCb29sZWFuKVxuICAgICAgICAgICAgICAgICAgICAgICAgKCg9IHR5cGUgJ3ZlY3RvcikgJ0FycmF5KVxuICAgICAgICAgICAgICAgICAgICAgICAgKCg9IHR5cGUgJ2Z1bmN0aW9uKSAnRnVuY3Rpb24pXG4gICAgICAgICAgICAgICAgICAgICAgICAoKD0gdHlwZSAncmUtcGF0dGVybikgJ1JlZ0V4cClcbiAgICAgICAgICAgICAgICAgICAgICAgICgoPSAobmFtZXNwYWNlIHR5cGUpIFwianNcIikgdHlwZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIChlbHNlIG5pbCkpKVxuXG4gICAgICAgIChzYXRpc2Z5IChsYW1iZGEgKHByb3RvY29sKVxuICAgICAgICAgICAgICAgICAgKGlmIHR5cGUtbmFtZVxuICAgICAgICAgICAgICAgICAgICBgKHNldGYgKGFnZXQgLHByb3RvY29sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnLChzeW1ib2wgKHN0ciBcIndpc3BfY29yZSRJUHJvdG9jb2wkXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChuYW1lIHR5cGUtbmFtZSkpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRydWUpXG4gICAgICAgICAgICAgICAgICAgIGAoc2V0ZiAoYWdldCAoLi1wcm90b3R5cGUgLHR5cGUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoLi13aXNwX2NvcmUkSVByb3RvY29sJGlkICxwcm90b2NvbCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0cnVlKSkpKVxuXG4gICAgICAgIChtYWtlLW1ldGhvZCAobGFtYmRhIChwcm90b2NvbCBmb3JtKVxuICAgICAgICAgICAgICAgICAgICAgIChsZXQqICgobWV0aG9kLW5hbWUgKGZpcnN0IGZvcm0pKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChwYXJhbXMgKHNlY29uZCBmb3JtKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoYm9keSAocmVzdCAocmVzdCBmb3JtKSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKHRhcmdldCAoaWYgdHlwZS1uYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYChhZ2V0IChhZ2V0ICxwcm90b2NvbCAnLG1ldGhvZC1uYW1lKSAnLHR5cGUtbmFtZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgKGFnZXQgKC4tcHJvdG90eXBlICx0eXBlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoLi1uYW1lIChhZ2V0ICxwcm90b2NvbCAnLG1ldGhvZC1uYW1lKSkpKSkpXG4gICAgICAgICAgICAgICAgICAgICAgICBgKHNldGYgLHRhcmdldCAobGFtYmRhICxwYXJhbXMgLEBib2R5KSkpKSlcblxuICAgICAgICAoYm9keSAocmVkdWNlIChsYW1iZGEgKGJvZHkgZm9ybSlcbiAgICAgICAgICAgICAgICAgICAgICAgKGlmIChsaXN0PyBmb3JtKVxuICAgICAgICAgICAgICAgICAgICAgICAgIChjb25qIGJvZHlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Om1ldGhvZHMgKGNvbmogKDptZXRob2RzIGJvZHkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChtYWtlLW1ldGhvZCAoOnByb3RvY29sIGJvZHkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JtKSl9KVxuICAgICAgICAgICAgICAgICAgICAgICAgIChjb25qIGJvZHkgezpwcm90b2NvbCBmb3JtXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOm1ldGhvZHMgKGNvbmogKDptZXRob2RzIGJvZHkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHNhdGlzZnkgZm9ybSkpfSkpKVxuXG4gICAgICAgICAgICAgICAgICAgICAgIHs6cHJvdG9jb2wgbmlsXG4gICAgICAgICAgICAgICAgICAgICAgICA6bWV0aG9kcyBbXX1cblxuICAgICAgICAgICAgICAgICAgICAgICBmb3JtcykpXG4gICAgICAgIChtZXRob2RzICg6bWV0aG9kcyBib2R5KSkpXG4gICAgYChwcm9nbiAsQG1ldGhvZHMgbmlsKSkpXG4oaW5zdGFsbC1tYWNybyEgOmV4dGVuZC10eXBlIGV4cGFuZC1leHRlbmQtdHlwZSlcblxuKGRlZnVuIGV4cGFuZC1leHRlbmQtcHJvdG9jb2xcbiAgKHByb3RvY29sICZyZXN0IGZvcm1zKVxuICAobGV0KiAoKHNwZWNzIChyZWR1Y2UgKGxhbWJkYSAoc3BlY3MgZm9ybSlcbiAgICAgICAgICAgICAgICAgICAgICAgIChpZiAobGlzdD8gZm9ybSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKGNvbnMgezp0eXBlICg6dHlwZSAoZmlyc3Qgc3BlY3MpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOm1ldGhvZHMgKGNvbmogKDptZXRob2RzIChmaXJzdCBzcGVjcykpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JtKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHJlc3Qgc3BlY3MpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAoY29ucyB7OnR5cGUgZm9ybVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOm1ldGhvZHMgW119XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNwZWNzKSkpXG4gICAgICAgICAgICAgICAgICAgICAgbmlsXG4gICAgICAgICAgICAgICAgICAgICAgZm9ybXMpKVxuICAgICAgICAoYm9keSAobWFwIChsYW1iZGEgKGZvcm0pXG4gICAgICAgICAgICAgICAgICAgIGAoZXh0ZW5kLXR5cGUgLCg6dHlwZSBmb3JtKVxuICAgICAgICAgICAgICAgICAgICAgICAscHJvdG9jb2xcbiAgICAgICAgICAgICAgICAgICAgICAgLEAoOm1ldGhvZHMgZm9ybSlcbiAgICAgICAgICAgICAgICAgICAgICAgKSlcbiAgICAgICAgICAgICAgICAgIHNwZWNzKSkpXG5cblxuICAgIGAocHJvZ24gLEBib2R5IG5pbCkpKVxuKGluc3RhbGwtbWFjcm8hIDpleHRlbmQtcHJvdG9jb2wgZXhwYW5kLWV4dGVuZC1wcm90b2NvbClcblxuKGRlZnVuIGFzZXQtZXhwYW5kXG4gICh0YXJnZXQgZmllbGQgdGhpcmQgJnJlc3QgcmVzdC1hcmdzKVxuICAoaWYgKGVtcHR5PyByZXN0LWFyZ3MpXG4gICAgYChzZXRmIChhZ2V0ICx0YXJnZXQgLGZpZWxkKSAsdGhpcmQpXG4gICAgKGxldCogKChzdWItZmllbGRzJnZhbHVlIChjb25zIHRoaXJkIHJlc3QtYXJncykpXG4gICAgICAgICAgKHJlc29sdmVkLXRhcmdldCAocmVkdWNlIChsYW1iZGEgKGZvcm0gbm9kZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGAoYWdldCAsZm9ybSAsbm9kZSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYChhZ2V0ICx0YXJnZXQgLGZpZWxkKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChidXRsYXN0IHN1Yi1maWVsZHMmdmFsdWUpKSlcbiAgICAgICAgICAodmFsdWUgKGxhc3Qgc3ViLWZpZWxkcyZ2YWx1ZSkpKVxuICAgICAgYChzZXRmICxyZXNvbHZlZC10YXJnZXQgLHZhbHVlKSkpKVxuKGluc3RhbGwtbWFjcm8hIDphc2V0IGFzZXQtZXhwYW5kKVxuXG4oZGVmdW4gYWxlbmd0aC1leHBhbmRcbiAgKGFycmF5KVxuICBcIlJldHVybnMgdGhlIGxlbmd0aCBvZiB0aGUgYXJyYXkuIFdvcmtzIG9uIGFycmF5cyBvZiBhbGwgdHlwZXMuXCJcbiAgYCguLWxlbmd0aCAsYXJyYXkpKVxuKGluc3RhbGwtbWFjcm8hIDphbGVuZ3RoIGFsZW5ndGgtZXhwYW5kKVxuIl19
