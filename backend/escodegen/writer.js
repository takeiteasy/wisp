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
        return conj(baseø1, {
            'type': 'FunctionExpression',
            'id': (form || 0)['id'] ? writeVar((form || 0)['id']) : null,
            'defaults': null,
            'rest': null,
            'generator': false,
            'expression': false
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndpc3AvYmFja2VuZC9lc2NvZGVnZW4vd3JpdGVyLndpc3AiXSwibmFtZXMiOlsiX25zXyIsImlkIiwiZG9jIiwicmVhZEZyb21TdHJpbmciLCJtZXRhIiwid2l0aE1ldGEiLCJpc1N5bWJvbCIsInN5bWJvbCIsImlzS2V5d29yZCIsImtleXdvcmQiLCJuYW1lc3BhY2UiLCJpc1VucXVvdGUiLCJpc1VucXVvdGVTcGxpY2luZyIsImlzUXVvdGUiLCJpc1N5bnRheFF1b3RlIiwibmFtZSIsImdlbnN5bSIsInByU3RyIiwiaXNFbXB0eSIsImNvdW50IiwiaXNMaXN0IiwibGlzdCIsImZpcnN0Iiwic2Vjb25kIiwidGhpcmQiLCJyZXN0IiwiY29ucyIsImNvbmoiLCJidXRsYXN0IiwicmV2ZXJzZSIsInJlZHVjZSIsInZlYyIsImxhc3QiLCJtYXAiLCJtYXB2IiwiZmlsdGVyIiwidGFrZSIsImNvbmNhdCIsInBhcnRpdGlvbiIsInJlcGVhdCIsImludGVybGVhdmUiLCJhc3NvYyIsImlzT2RkIiwiaXNEaWN0aW9uYXJ5IiwiZGljdGlvbmFyeSIsIm1lcmdlIiwia2V5cyIsInZhbHMiLCJpc0NvbnRhaW5zVmVjdG9yIiwibWFwRGljdGlvbmFyeSIsImlzU3RyaW5nIiwiaXNOdW1iZXIiLCJpc1ZlY3RvciIsImlzQm9vbGVhbiIsInN1YnMiLCJyZUZpbmQiLCJpc1RydWUiLCJpc0ZhbHNlIiwiaXNOaWwiLCJpc1JlUGF0dGVybiIsImluYyIsImRlYyIsInN0ciIsImNoYXIiLCJpbnQiLCJpc0VxdWFsIiwiaXNTdHJpY3RFcXVhbCIsImdldCIsInNwbGl0Iiwiam9pbiIsInVwcGVyQ2FzZSIsInJlcGxhY2UiLCJ0cmltbCIsImluc3RhbGxNYWNybyIsImdlbmVyYXRlIiwiX191bmlxdWVDaGFyX18iLCJleHBvcnRzIiwidG9DYW1lbEpvaW4iLCJwcmVmaXgiLCJrZXkiLCJ0b1ByaXZhdGVQcmVmaXgiLCJzcGFjZURlbGltaXRlZMO4MSIsImxlZnRUcmltbWVkw7gxIiwibsO4MSIsInRyYW5zbGF0ZUlkZW50aWZpZXJXb3JkIiwiZm9ybSIsImlkw7gxIiwidHJhbnNsYXRlSWRlbnRpZmllciIsIm5zw7gxIiwiZXJyb3JBcmdDb3VudCIsImNhbGxlZSIsIm4iLCJTeW50YXhFcnJvciIsImluaGVyaXRMb2NhdGlvbiIsImJvZHkiLCJzdGFydMO4MSIsImVuZMO4MSIsIndyaXRlTG9jYXRpb24iLCJvcmlnaW5hbCIsImRhdGHDuDEiLCJpbmhlcml0ZWTDuDEiLCJfX3dyaXRlcnNfXyIsImluc3RhbGxXcml0ZXIiLCJvcCIsIndyaXRlciIsIndyaXRlT3AiLCJ3cml0ZXLDuDEiLCJfX3NwZWNpYWxzX18iLCJpbnN0YWxsU3BlY2lhbCIsIndyaXRlU3BlY2lhbCIsIndyaXRlTmlsIiwibnVsbCIsIndyaXRlTGl0ZXJhbCIsIndyaXRlTGlzdCIsIndyaXRlIiwid3JpdGVTeW1ib2wiLCJ3cml0ZUNvbnN0YW50Iiwid3JpdGVOdW1iZXIiLCJ2YWx1ZU9mIiwid3JpdGVTdHJpbmciLCIkIiwid3JpdGVLZXl3b3JkIiwidG9JZGVudGlmaWVyIiwid3JpdGVCaW5kaW5nVmFyIiwiYmFzZUlkw7gxIiwicmVzb2x2ZWRJZMO4MSIsIndyaXRlVmFyIiwibm9kZSIsIndyaXRlSW52b2tlIiwid3JpdGVWZWN0b3IiLCJ3cml0ZURpY3Rpb25hcnkiLCJwcm9wZXJ0aWVzw7gxIiwicGFpciIsImtlecO4MSIsInZhbHVlw7gxIiwid3JpdGVFeHBvcnQiLCJ3cml0ZURlZiIsIndyaXRlQmluZGluZyIsImluaXTDuDEiLCJ3cml0ZVRocm93IiwidG9FeHByZXNzaW9uIiwid3JpdGVOZXciLCJ3cml0ZVNldCIsIndyaXRlQWdldCIsIl9fc3RhdGVtZW50c19fIiwid3JpdGVTdGF0ZW1lbnQiLCJ0b1N0YXRlbWVudCIsInRvUmV0dXJuIiwid3JpdGVCb2R5Iiwic3RhdGVtZW50c8O4MSIsInJlc3VsdMO4MSIsInRvQmxvY2siLCJ0b1NlcXVlbmNlIiwid3JpdGVEbyIsIndyaXRlSWYiLCJ3cml0ZVRyeSIsImhhbmRsZXLDuDEiLCJmaW5hbGl6ZXLDuDEiLCJ3cml0ZUJpbmRpbmdWYWx1ZSIsIndyaXRlQmluZGluZ1BhcmFtIiwid3JpdGVMZXQiLCJib2R5w7gxIiwidG9JaWZlIiwidG9SZWJpbmQiLCJiaW5kaW5nc8O4MSIsImV4cHJlc3Npb25zIiwidG9Mb29wSW5pdCIsInRvRG9XaGlsZSIsInRlc3QiLCJ0b1NldFJlY3VyIiwidG9Mb29wIiwid3JpdGVMb29wIiwibG9vcEJvZHnDuDEiLCJ0b1JlY3VyIiwicGFyYW1zw7gxIiwid3JpdGVSZWN1ciIsImZhbGxiYWNrT3ZlcmxvYWQiLCJzcGxpY2VCaW5kaW5nIiwid3JpdGVPdmVybG9hZGluZ1BhcmFtcyIsInBhcmFtcyIsImZvcm1zIiwicGFyYW0iLCJ3cml0ZU92ZXJsb2FkaW5nRm4iLCJvdmVybG9hZHPDuDEiLCJ3cml0ZUZuT3ZlcmxvYWQiLCJ3cml0ZVNpbXBsZUZuIiwibWV0aG9kw7gxIiwicmVzb2x2ZSIsImZyb20iLCJ0byIsInJlcXVpcmVyw7gxIiwicmVxdWlyZW1lbnTDuDEiLCJpc1JlbGF0aXZlw7gxIiwiZnJvbcO4MiIsInRvw7gyIiwiaWRUb05zIiwid3JpdGVSZXF1aXJlIiwicmVxdWlyZXIiLCJuc0JpbmRpbmfDuDEiLCJuc0FsaWFzw7gxIiwicmVmZXJlbmNlc8O4MSIsInJlZmVyZW5jZXMiLCJ3cml0ZU5zIiwibm9kZcO4MSIsInJlcXVpcmVtZW50c8O4MSIsIndyaXRlRm4iLCJiYXNlw7gxIiwib3DDuDEiLCJ3cml0ZV8iLCJjb21waWxlIiwiYXJncyIsImdldE1hY3JvIiwidGFyZ2V0IiwicHJvcGVydHkiLCJkZWZhdWx0X8O4MSIsImluc3RhbGxMb2dpY2FsT3BlcmF0b3IiLCJvcGVyYXRvciIsImZhbGxiYWNrIiwid3JpdGVMb2dpY2FsT3BlcmF0b3IiLCJvcGVyYW5kcyIsImxlZnQiLCJyaWdodCIsImluc3RhbGxVbmFyeU9wZXJhdG9yIiwiaXNQcmVmaXgiLCJ3cml0ZVVuYXJ5T3BlcmF0b3IiLCJpbnN0YWxsQmluYXJ5T3BlcmF0b3IiLCJ3cml0ZUJpbmFyeU9wZXJhdG9yIiwiaW5zdGFsbEFyaXRobWV0aWNPcGVyYXRvciIsImlzVmFsaWQiLCJ3cml0ZUFyaXRobWV0aWNPcGVyYXRvciIsImluc3RhbGxDb21wYXJpc29uT3BlcmF0b3IiLCJ3cml0ZUNvbXBhcmlzb25PcGVyYXRvciIsImxlZnTDuDEiLCJyaWdodMO4MSIsIm1vcmXDuDEiLCJpc1dyaXRlSWRlbnRpY2FsIiwiaXNXcml0ZUluc3RhbmNlIiwiY29uc3RydWN0b3LDuDEiLCJpbnN0YW5jZcO4MSIsImV4cGFuZEFwcGx5IiwiZiIsInByZWZpeMO4MSIsImV4cGFuZFByaW50IiwiX2FuZEZvcm0iLCJtb3JlIiwiZXhwYW5kU3RyIiwiZXhwYW5kRGVidWciLCJleHBhbmRBc3NlcnQiLCJ4IiwibWVzc2FnZcO4MSIsImZvcm3DuDEiLCJleHBhbmRUeXBlc3RyIiwiaXQiLCJzdWZmaXjDuDEiLCJleHBhbmREZWZwcm90b2NvbCIsIl9hbmRFbnYiLCJwcm90b2NvbE5hbWXDuDEiLCJwcm90b2NvbERvY8O4MSIsInByb3RvY29sTWV0aG9kc8O4MSIsIm5vdFN1cHBvcnRlZMO4MSIsIm1ldGhvZCIsInByb3RvY29sw7gxIiwibWV0aG9kTmFtZcO4MSIsImlkw7gyIiwiZm5zw7gxIiwic2F0aXNmecO4MSIsImV4cGFuZERlZnR5cGUiLCJmaWVsZHMiLCJ0eXBlSW5pdMO4MSIsImZpZWxkIiwibWV0aG9kSW5pdMO4MSIsIm1ha2VNZXRob2TDuDEiLCJwcm90b2NvbCIsImZpZWxkTmFtZcO4MSIsInR5cGUiLCJtZXRob2Rzw7gxIiwiZXhwYW5kRXh0ZW5kVHlwZSIsImlzRGVmYXVsdFR5cGXDuDEiLCJpc05pbFR5cGXDuDEiLCJ0eXBlTmFtZcO4MSIsInRhcmdldMO4MSIsImV4cGFuZEV4dGVuZFByb3RvY29sIiwic3BlY3PDuDEiLCJzcGVjcyIsImFzZXRFeHBhbmQiLCJyZXN0QXJncyIsInN1YkZpZWxkc0FuZFZhbHVlw7gxIiwicmVzb2x2ZWRUYXJnZXTD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QUFpQmpRLE1BQUQsQ0FBUSxVQUFTdUQsSUFBVCxFQUFjMEMsSUFBZCxFQUNDO0FBQUEsbUIsVUFBQSxDLElBQUEsRSxPQUFFLEMsSUFBQSxFLE1BQUEsQyxVQUFNMUMsSSxJQUFNMEMsSSxFQUFkO0FBQUEsU0FEVCxFLFVBRU8sQyxJQUFBLEUsT0FBRSxDLElBQUEsRSxNQUFBLEMsVUFBTXFGLE0sSUFBUXlELEssRUFBaEIsQ0FGUCxFQUdRalAsT0FBRCxDQUFTa1EsbUJBQVQsQ0FIUCxDQUFoQixDQURDO0FBQUEsUUFLRCxJQUFBeEosTyxHQUFPdEcsSUFBRCxDQUFNOFAsbUJBQU4sQ0FBTixDQUxDO0FBQUEsUUFNTixPLFVBQUEsQyxJQUFBLEUsT0FBRSxDLElBQUEsRSxNQUFBLEMsVUFBTUMsZ0IsSUFBaUJ6SixPLEVBQXpCLEVBTk07QUFBQSxLLEtBQVIsQyxJQUFBLENBRkYsQztDQUZGLEM7QUFXQzdELFlBQUQsQyxNQUFBLEVBQXNCbU4sVUFBdEIsRTtBQUVBLElBQU9JLGFBQUEsR0FBQXBOLE9BQUEsQ0FBQW9OLGFBQUEsR0FBUCxTQUFPQSxhQUFQLENBQ0dDLEtBREgsRUFHRTtBQUFBLFcsVUFBQSxDLElBQUEsRSxPQUFFLEMsSUFBQSxFLFVBQUEsQyxVQUFVQSxLLEVBQVo7QUFBQSxDQUhGLEM7QUFJQ3hOLFlBQUQsQyxTQUFBLEVBQXlCdU4sYUFBekIiLCJzb3VyY2VzQ29udGVudCI6WyIobnMgd2lzcC5iYWNrZW5kLmVzY29kZWdlbi53cml0ZXJcbiAgKDpyZXF1aXJlIFt3aXNwLnJlYWRlciA6cmVmZXIgW3JlYWQtZnJvbS1zdHJpbmddXVxuICAgICAgICAgICAgW3dpc3AuYXN0IDpyZWZlciBbbWV0YSB3aXRoLW1ldGEgc3ltYm9sPyBzeW1ib2wga2V5d29yZD8ga2V5d29yZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZXNwYWNlIHVucXVvdGU/IHVucXVvdGUtc3BsaWNpbmc/IHF1b3RlP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3ludGF4LXF1b3RlPyBuYW1lIGdlbnN5bSBwci1zdHJdXVxuICAgICAgICAgICAgW3dpc3Auc2VxdWVuY2UgOnJlZmVyIFtlbXB0eT8gY291bnQgbGlzdD8gbGlzdCBmaXJzdCBzZWNvbmQgdGhpcmRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdCBjb25zIGNvbmogYnV0bGFzdCByZXZlcnNlIHJlZHVjZSB2ZWNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdCBtYXAgbWFwdiBmaWx0ZXIgdGFrZSBjb25jYXQgcGFydGl0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcGVhdCBpbnRlcmxlYXZlIGFzc29jXV1cbiAgICAgICAgICAgIFt3aXNwLnJ1bnRpbWUgOnJlZmVyIFtvZGQ/IGRpY3Rpb25hcnk/IGRpY3Rpb25hcnkgbWVyZ2Uga2V5cyB2YWxzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGFpbnMtdmVjdG9yPyBtYXAtZGljdGlvbmFyeSBzdHJpbmc/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVtYmVyPyB2ZWN0b3I/IGJvb2xlYW4/IHN1YnMgcmUtZmluZCB0cnVlP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhbHNlPyBuaWw/IHJlLXBhdHRlcm4/IGluYyBkZWMgc3RyIGNoYXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnQgPSA9PSBnZXRdXVxuICAgICAgICAgICAgW3dpc3Auc3RyaW5nIDpyZWZlciBbc3BsaXQgam9pbiB1cHBlci1jYXNlIHJlcGxhY2UgdHJpbWxdXVxuICAgICAgICAgICAgW3dpc3AuZXhwYW5kZXIgOnJlZmVyIFtpbnN0YWxsLW1hY3JvIV1dXG4gICAgICAgICAgICBbZXNjb2RlZ2VuIDpyZWZlciBbZ2VuZXJhdGVdXSkpXG5cblxuOzsgRGVmaW5lIGNoYXJhY3RlciB0aGF0IGlzIHZhbGlkIEpTIGlkZW50aWZpZXIgdGhhdCB3aWxsXG47OyBiZSB1c2VkIGluIGdlbmVyYXRlZCBzeW1ib2xzIHRvIGF2b2lkIGNvbmZsaWN0c1xuOzsgaHR0cDovL3d3dy5maWxlZm9ybWF0LmluZm8vaW5mby91bmljb2RlL2NoYXIvZjgvaW5kZXguaHRtXG4oZGVmdmFyICoqdW5pcXVlLWNoYXIqKiBcIsO4XCIpXG5cbihkZWZ1biAtPmNhbWVsLWpvaW5cbiAgKHByZWZpeCBrZXkpXG4gIFwiVGFrZXMgZGFzaCBkZWxpbWl0ZWQgbmFtZSBcIlxuICAoc3RyIHByZWZpeFxuICAgICAgIChpZiAoYW5kIChub3QgKGVtcHR5PyBwcmVmaXgpKVxuICAgICAgICAgICAgICAgIChub3QgKGVtcHR5PyBrZXkpKSlcbiAgICAgICAgIChzdHIgKHVwcGVyLWNhc2UgKGdldCBrZXkgMCkpIChzdWJzIGtleSAxKSlcbiAgICAgICAgIGtleSkpKVxuXG4oZGVmdW4gLT5wcml2YXRlLXByZWZpeFxuICAoaWQpXG4gIFwiVHJhbnNsYXRlIHByaXZhdGUgaWRlbnRpZmllcnMgbGlrZSAtZm9vIHRvIGEgSlMgZXF1aXZhbGVudFxuICBmb3JtcyBsaWtlIF9mb29cIlxuICAobGV0KiAoKHNwYWNlLWRlbGltaXRlZCAoam9pbiBcIiBcIiAoc3BsaXQgaWQgI1wiLVwiKSkpXG4gICAgICAgIChsZWZ0LXRyaW1tZWQgKHRyaW1sIHNwYWNlLWRlbGltaXRlZCkpXG4gICAgICAgIChuICgtIChjb3VudCBpZCkgKGNvdW50IGxlZnQtdHJpbW1lZCkpKSlcbiAgICAoaWYgKD4gbiAwKVxuICAgICAgKHN0ciAoam9pbiBcIl9cIiAocmVwZWF0IChpbmMgbikgXCJcIikpIChzdWJzIGlkIG4pKVxuICAgICAgaWQpKSlcblxuXG4oZGVmdW4gdHJhbnNsYXRlLWlkZW50aWZpZXItd29yZFxuICAoZm9ybSlcbiAgXCJUcmFuc2xhdGVzIHJlZmVyZW5jZXMgZnJvbSBjbG9qdXJlIGNvbnZlbnRpb24gdG8gSlM6XG5cbiAgKiptYWNyb3MqKiAgICAgIF9fbWFjcm9zX19cbiAgbGlzdC0+dmVjdG9yICAgIGxpc3RUb1ZlY3RvclxuICBzZXQhICAgICAgICAgICAgc2V0XG4gIGZvb19iYXIgICAgICAgICBmb29fYmFyXG4gIG51bWJlcj8gICAgICAgICBpc051bWJlclxuICByZWQ9ICAgICAgICAgICAgcmVkRXF1YWxcbiAgY3JlYXRlLXNlcnZlciAgIGNyZWF0ZVNlcnZlclwiXG4gIChsZXQqICgoaWQgKG5hbWUgZm9ybSkpKVxuICAgIChzZXRxIGlkIChjb25kICgoaWRlbnRpY2FsPyBpZCAgXCIqXCIpIFwibXVsdGlwbHlcIilcbiAgICAgICAgICAgICAgICAgICAoKGlkZW50aWNhbD8gaWQgXCIvXCIpIFwiZGl2aWRlXCIpXG4gICAgICAgICAgICAgICAgICAgKChpZGVudGljYWw/IGlkIFwiK1wiKSBcInN1bVwiKVxuICAgICAgICAgICAgICAgICAgICgoaWRlbnRpY2FsPyBpZCBcIi1cIikgXCJzdWJ0cmFjdFwiKVxuICAgICAgICAgICAgICAgICAgICgoaWRlbnRpY2FsPyBpZCBcIj1cIikgXCJlcXVhbD9cIilcbiAgICAgICAgICAgICAgICAgICAoKGlkZW50aWNhbD8gaWQgXCI9PVwiKSBcInN0cmljdC1lcXVhbD9cIilcbiAgICAgICAgICAgICAgICAgICAoKGlkZW50aWNhbD8gaWQgXCI8PVwiKSBcIm5vdC1ncmVhdGVyLXRoYW5cIilcbiAgICAgICAgICAgICAgICAgICAoKGlkZW50aWNhbD8gaWQgXCI+PVwiKSBcIm5vdC1sZXNzLXRoYW5cIilcbiAgICAgICAgICAgICAgICAgICAoKGlkZW50aWNhbD8gaWQgXCI+XCIpIFwiZ3JlYXRlci10aGFuXCIpXG4gICAgICAgICAgICAgICAgICAgKChpZGVudGljYWw/IGlkIFwiPFwiKSBcImxlc3MtdGhhblwiKVxuICAgICAgICAgICAgICAgICAgICgoaWRlbnRpY2FsPyBpZCBcIi0+XCIpIFwidGhyZWFkLWZpcnN0XCIpXG4gICAgICAgICAgICAgICAgICAgKGVsc2UgaWQpKSlcblxuICAgIDs7ICoqbWFjcm9zKiogLT4gIF9fbWFjcm9zX19cbiAgICAoc2V0cSBpZCAoam9pbiBcIl9cIiAoc3BsaXQgaWQgXCIqXCIpKSlcbiAgICA7OyBmb28uYmFyIC0+IGZvb19iYXJcbiAgICAoc2V0cSBpZCAoam9pbiBcIl9cIiAoc3BsaXQgaWQgXCIuXCIpKSlcbiAgICA7OyBsaXN0LT52ZWN0b3IgLT4gIGxpc3RUb1ZlY3RvclxuICAgIChzZXRxIGlkIChpZiAoaWRlbnRpY2FsPyAoc3VicyBpZCAwIDIpIFwiLT5cIilcbiAgICAgICAgICAgICAgIChzdWJzIChqb2luIFwiLXRvLVwiIChzcGxpdCBpZCBcIi0+XCIpKSAxKVxuICAgICAgICAgICAgICAgKGpvaW4gXCItdG8tXCIgKHNwbGl0IGlkIFwiLT5cIikpKSlcbiAgICA7OyBzZXQhIC0+ICBzZXRcbiAgICAoc2V0cSBpZCAoam9pbiAoc3BsaXQgaWQgXCIhXCIpKSlcbiAgICAoc2V0cSBpZCAoam9pbiBcIiRcIiAoc3BsaXQgaWQgXCIlXCIpKSlcbiAgICAoc2V0cSBpZCAoam9pbiBcIi1lcXVhbC1cIiAoc3BsaXQgaWQgXCI9XCIpKSlcbiAgICA7OyBmb289IC0+IGZvb0VxdWFsXG4gICAgOyhzZXRxIGlkIChqb2luIFwiLWVxdWFsLVwiIChzcGxpdCBpZCBcIj1cIikpKVxuICAgIDs7IGZvbytiYXIgLT4gZm9vUGx1c0JhclxuICAgIChzZXRxIGlkIChqb2luIFwiLXBsdXMtXCIgKHNwbGl0IGlkIFwiK1wiKSkpXG4gICAgKHNldHEgaWQgKGpvaW4gXCItYW5kLVwiIChzcGxpdCBpZCBcIiZcIikpKVxuICAgIDs7IG51bWJlcj8gLT4gaXNOdW1iZXJcbiAgICAoc2V0cSBpZCAoaWYgKGlkZW50aWNhbD8gKGxhc3QgaWQpIFwiP1wiKVxuICAgICAgICAgICAgICAgKHN0ciBcImlzLVwiIChzdWJzIGlkIDAgKGRlYyAoY291bnQgaWQpKSkpXG4gICAgICAgICAgICAgICBpZCkpXG4gICAgOzsgLWZvbyAtPiBfZm9vXG4gICAgKHNldHEgaWQgKC0+cHJpdmF0ZS1wcmVmaXggaWQpKVxuICAgIDs7IGNyZWF0ZS1zZXJ2ZXIgLT4gY3JlYXRlU2VydmVyXG4gICAgKHNldHEgaWQgKHJlZHVjZSAtPmNhbWVsLWpvaW4gXCJcIiAoc3BsaXQgaWQgXCItXCIpKSlcblxuICAgIDs7IHJlc2lkdWFsIHN3ZWVwOiB0aGUgc3VnYXIgYWJvdmUgb25seSByZXdyaXRlcyBgP2AvYD5gL2A8YC9gL2AgaW4gc3BlY2lmaWNcbiAgICA7OyBwb3NpdGlvbnMgKGEgdHJhaWxpbmcgYD9gLCBvciB0aGUgY2hhciBzdGFuZGluZyBhbG9uZSkuIEFueXRoaW5nIGxlZnQgb3ZlclxuICAgIDs7IC0tIGB4P3lgLCBgP2Zvb2AsIGBhPmJgIC0tIGlzIHN0aWxsIGFuIGludmFsaWQgSlMgaWRlbnRpZmllciwgc28gbWFwIGVhY2hcbiAgICA7OyBzdXJ2aXZpbmcgY2hhcmFjdGVyIHRvIGEgQ2xvanVyZVNjcmlwdC1zdHlsZSBtdW5nZSBmcmFnbWVudC5cbiAgICAoc2V0cSBpZCAoam9pbiBcIl9RTUFSS19cIiAoc3BsaXQgaWQgXCI/XCIpKSlcbiAgICAoc2V0cSBpZCAoam9pbiBcIl9HVF9cIiAoc3BsaXQgaWQgXCI+XCIpKSlcbiAgICAoc2V0cSBpZCAoam9pbiBcIl9MVF9cIiAoc3BsaXQgaWQgXCI8XCIpKSlcbiAgICAoc2V0cSBpZCAoam9pbiBcIl9TTEFTSF9cIiAoc3BsaXQgaWQgXCIvXCIpKSlcblxuICAgIGlkKSlcblxuKGRlZnVuIHRyYW5zbGF0ZS1pZGVudGlmaWVyXG4gIChmb3JtKVxuICAobGV0KiAoKG5zIChuYW1lc3BhY2UgZm9ybSkpKVxuICAgIChzdHIgKGlmIChhbmQgbnMgKG5vdCAoPSBucyBcImpzXCIpKSlcbiAgICAgICAgICAgKHN0ciAodHJhbnNsYXRlLWlkZW50aWZpZXItd29yZCAobmFtZXNwYWNlIGZvcm0pKSBcIi5cIilcbiAgICAgICAgICAgXCJcIilcbiAgICAgICAgIChqb2luIFxcLiAobWFwIHRyYW5zbGF0ZS1pZGVudGlmaWVyLXdvcmQgKHNwbGl0IChuYW1lIGZvcm0pIFxcLikpKSkpKVxuXG4oZGVmdW4gZXJyb3ItYXJnLWNvdW50XG4gIChjYWxsZWUgbilcbiAgKHRocm93IChTeW50YXhFcnJvciAoc3RyIFwiV3JvbmcgbnVtYmVyIG9mIGFyZ3VtZW50cyAoXCIgbiBcIikgcGFzc2VkIHRvOiBcIiBjYWxsZWUpKSkpXG5cbihkZWZ1biBpbmhlcml0LWxvY2F0aW9uXG4gIChib2R5KVxuICAobGV0KiAoKHN0YXJ0ICg6c3RhcnQgKDpsb2MgKGZpcnN0IGJvZHkpKSkpXG4gICAgICAgIChlbmQgKDplbmQgKDpsb2MgKGxhc3QgYm9keSkpKSkpXG4gICAgKGlmIChub3QgKG9yIChuaWw/IHN0YXJ0KSAobmlsPyBlbmQpKSlcbiAgICAgIHs6c3RhcnQgc3RhcnQgOmVuZCBlbmR9KSkpXG5cblxuKGRlZnVuIHdyaXRlLWxvY2F0aW9uXG4gIChmb3JtIG9yaWdpbmFsKVxuICAobGV0KiAoKGRhdGEgKG1ldGEgZm9ybSkpXG4gICAgICAgIChpbmhlcml0ZWQgKG1ldGEgb3JpZ2luYWwpKVxuICAgICAgICAoc3RhcnQgKG9yICg6c3RhcnQgZm9ybSkgKDpzdGFydCBkYXRhKSAoOnN0YXJ0IGluaGVyaXRlZCkpKVxuICAgICAgICAoZW5kIChvciAoOmVuZCBmb3JtKSAoOmVuZCBkYXRhKSAoOmVuZCBpbmhlcml0ZWQpKSkpXG4gICAgKGlmIChub3QgKG5pbD8gc3RhcnQpKVxuICAgICAgezpsb2MgezpzdGFydCB7OmxpbmUgKGluYyAoOmxpbmUgc3RhcnQgLTEpKVxuICAgICAgICAgICAgICAgICAgICAgOmNvbHVtbiAoOmNvbHVtbiBzdGFydCAtMSl9XG4gICAgICAgICAgICAgOmVuZCB7OmxpbmUgKGluYyAoOmxpbmUgZW5kIC0xKSlcbiAgICAgICAgICAgICAgICAgICA6Y29sdW1uICg6Y29sdW1uIGVuZCAtMSl9fX1cbiAgICAgIHt9KSkpXG5cbihkZWZ2YXIgKip3cml0ZXJzKioge30pXG4oZGVmdW4gaW5zdGFsbC13cml0ZXIhXG4gIChvcCB3cml0ZXIpXG4gIChzZXRmIChnZXQgKip3cml0ZXJzKiogb3ApIHdyaXRlcikpXG5cbihkZWZ1biB3cml0ZS1vcFxuICAob3AgZm9ybSlcbiAgKGxldCogKCh3cml0ZXIgKGdldCAqKndyaXRlcnMqKiBvcCkpKVxuICAgIChhc3NlcnQgd3JpdGVyIChzdHIgXCJVbnN1cHBvcnRlZCBvcGVyYXRpb246IFwiIG9wKSlcbiAgICAoY29uaiAod3JpdGUtbG9jYXRpb24gKDpmb3JtIGZvcm0pICg6b3JpZ2luYWwtZm9ybSBmb3JtKSlcbiAgICAgICAgICAod3JpdGVyIGZvcm0pKSkpXG5cbihkZWZ2YXIgKipzcGVjaWFscyoqIHt9KVxuKGRlZnVuIGluc3RhbGwtc3BlY2lhbCFcbiAgKG9wIHdyaXRlcilcbiAgKHNldGYgKGdldCAqKnNwZWNpYWxzKiogKG5hbWUgb3ApKSB3cml0ZXIpKVxuXG4oZGVmdW4gd3JpdGUtc3BlY2lhbFxuICAod3JpdGVyIGZvcm0pXG4gIChjb25qICh3cml0ZS1sb2NhdGlvbiAoOmZvcm0gZm9ybSkgKDpvcmlnaW5hbC1mb3JtIGZvcm0pKVxuICAgICAgICAoYXBwbHkgd3JpdGVyICg6cGFyYW1zIGZvcm0pKSkpXG5cblxuKGRlZnVuIHdyaXRlLW5pbFxuICAoZm9ybSlcbiAgezp0eXBlIDpMaXRlcmFsXG4gICA6dmFsdWUgbnVsbH0pXG4oaW5zdGFsbC13cml0ZXIhIDpuaWwgd3JpdGUtbmlsKVxuXG4oZGVmdW4gd3JpdGUtbGl0ZXJhbFxuICAoZm9ybSlcbiAgezp0eXBlIDpMaXRlcmFsXG4gICA6dmFsdWUgZm9ybX0pXG5cbihkZWZ1biB3cml0ZS1saXN0XG4gIChmb3JtKVxuICB7OnR5cGUgOkNhbGxFeHByZXNzaW9uXG4gICA6Y2FsbGVlICh3cml0ZSB7Om9wIDp2YXJcbiAgICAgICAgICAgICAgICAgICA6Zm9ybSAnbGlzdH0pXG4gICA6YXJndW1lbnRzIChtYXAgd3JpdGUgKDppdGVtcyBmb3JtKSl9KVxuKGluc3RhbGwtd3JpdGVyISA6bGlzdCB3cml0ZS1saXN0KVxuXG4oZGVmdW4gd3JpdGUtc3ltYm9sXG4gIChmb3JtKVxuICB7OnR5cGUgOkNhbGxFeHByZXNzaW9uXG4gICA6Y2FsbGVlICh3cml0ZSB7Om9wIDp2YXJcbiAgICAgICAgICAgICAgICAgICA6Zm9ybSAnc3ltYm9sfSlcbiAgIDphcmd1bWVudHMgWyh3cml0ZS1jb25zdGFudCAoOm5hbWVzcGFjZSBmb3JtKSlcbiAgICAgICAgICAgICAgICh3cml0ZS1jb25zdGFudCAoOm5hbWUgZm9ybSkpXX0pXG4oaW5zdGFsbC13cml0ZXIhIDpzeW1ib2wgd3JpdGUtc3ltYm9sKVxuXG4oZGVmdW4gd3JpdGUtY29uc3RhbnRcbiAgKGZvcm0pXG4gIChjb25kICgobmlsPyBmb3JtKSAod3JpdGUtbmlsIGZvcm0pKVxuICAgICAgICAoKGtleXdvcmQ/IGZvcm0pICh3cml0ZS1saXRlcmFsIChpZiAobmFtZXNwYWNlIGZvcm0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChzdHIgKG5hbWVzcGFjZSBmb3JtKSBcIi9cIiAobmFtZSBmb3JtKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG5hbWUgZm9ybSkpKSlcbiAgICAgICAgKChudW1iZXI/IGZvcm0pICh3cml0ZS1udW1iZXIgKC52YWx1ZU9mIGZvcm0pKSlcbiAgICAgICAgKChzdHJpbmc/IGZvcm0pICh3cml0ZS1zdHJpbmcgZm9ybSkpXG4gICAgICAgIChlbHNlICh3cml0ZS1saXRlcmFsIGZvcm0pKSkpXG4oaW5zdGFsbC13cml0ZXIhIDpjb25zdGFudCAobGFtYmRhICglKSAod3JpdGUtY29uc3RhbnQgKDpmb3JtICUpKSkpXG5cbihkZWZ1biB3cml0ZS1zdHJpbmdcbiAgKGZvcm0pXG4gIHs6dHlwZSA6TGl0ZXJhbFxuICAgOnZhbHVlIChzdHIgZm9ybSl9KVxuXG4oZGVmdW4gd3JpdGUtbnVtYmVyXG4gIChmb3JtKVxuICAoaWYgKDwgZm9ybSAwKVxuICAgIHs6dHlwZSA6VW5hcnlFeHByZXNzaW9uXG4gICAgIDpvcGVyYXRvciA6LVxuICAgICA6cHJlZml4IHRydWVcbiAgICAgOmFyZ3VtZW50ICh3cml0ZS1udW1iZXIgKCogZm9ybSAtMSkpfVxuICAgICh3cml0ZS1saXRlcmFsIGZvcm0pKSlcblxuKGRlZnVuIHdyaXRlLWtleXdvcmRcbiAgKGZvcm0pXG4gIHs6dHlwZSA6TGl0ZXJhbFxuICAgOnZhbHVlICg6Zm9ybSBmb3JtKX0pXG4oaW5zdGFsbC13cml0ZXIhIDprZXl3b3JkIHdyaXRlLWtleXdvcmQpXG5cbihkZWZ1biAtPmlkZW50aWZpZXJcbiAgKGZvcm0pXG4gIHs6dHlwZSA6SWRlbnRpZmllclxuICAgOm5hbWUgKHRyYW5zbGF0ZS1pZGVudGlmaWVyIGZvcm0pfSlcblxuKGRlZnVuIHdyaXRlLWJpbmRpbmctdmFyXG4gIChmb3JtKVxuICA7OyBJZiBpZGVudGlmaWVycyBiaW5kaW5nIHNoYWRvd3Mgb3RoZXIgYmluZGluZyByZW5hbWUgaXQgYWNjb3JkaW5nXG4gIDs7IHRvIHNoYWRvd2luZyBkZXB0aC4gVGhpcyBhbGxvd3MgYmluZGluZ3MgaW5pdGlhbGl6ZXIgc2FmZWx5XG4gIDs7IGFjY2VzcyBiaW5kaW5nIGJlZm9yZSBzaGFkb3dpbmcgaXQuXG4gIChsZXQqICgoYmFzZS1pZCAoOmlkIGZvcm0pKVxuICAgICAgICAocmVzb2x2ZWQtaWQgKGlmICg6c2hhZG93IGZvcm0pXG4gICAgICAgICAgICAgICAgICAgICAgKHN5bWJvbCBuaWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChzdHIgKHRyYW5zbGF0ZS1pZGVudGlmaWVyIGJhc2UtaWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICoqdW5pcXVlLWNoYXIqKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoOmRlcHRoIGZvcm0pKSlcbiAgICAgICAgICAgICBiYXNlLWlkKSkpXG4gICAgKGNvbmogKC0+aWRlbnRpZmllciByZXNvbHZlZC1pZClcbiAgICAgICAgICAod3JpdGUtbG9jYXRpb24gYmFzZS1pZCkpKSlcblxuKGRlZnVuIHdyaXRlLXZhclxuICAobm9kZSlcbiAgXCJoYW5kbGVyIGZvciB7Om9wIDp2YXJ9IHR5cGUgZm9ybXMuIFN1Y2ggZm9ybXMgbWF5XG4gIHJlcHJlc2VudCByZWZlcmVuY2VzIGluIHdoaWNoIGNhc2UgdGhleSBoYXZlIDppbmZvXG4gIHBvaW50aW5nIHRvIGEgZGVjbGFyYXRpb24gOnZhciB3aGljaCB3YXkgYmUgZWl0aGVyXG4gIGZ1bmN0aW9uIHBhcmFtZXRlciAoaGFzIDpwYXJhbSB0cnVlKSBvciBsb2NhbFxuICBiaW5kaW5nIGRlY2xhcmF0aW9uIChoYXMgOmJpbmRpbmcgdHJ1ZSkgbGlrZSBvbmVzIGRlZmluZWRcbiAgYnkgbGV0IGFuZCBsb29wIGZvcm1zIGluIGxhdGVyIGNhc2UgZm9ybSB3aWxsIGFsc28gaGF2ZVxuICA6c2hhZG93IHBvaW50aW5nIHRvIGEgZGVjbGFyYXRpb24gbm9kZSBpdCBzaGFkb3dzIGFuZFxuICA6ZGVwdGggcHJvcGVydHkgd2l0aCBhIGRlcHRoIG9mIHNoYWRvd2luZywgdGhhdCBpcyB1c2VkXG4gIHRvIGZvciByZW5hbWluZyBsb2dpYyB0byBhdm9pZCBuYW1lIGNvbGxpc2lvbnMgaW4gZm9ybXNcbiAgbGlrZSBsZXQgdGhhdCBhbGxvdyBzYW1lIG5hbWVkIGJpbmRpbmdzLlwiXG4gIChpZiAoPSA6YmluZGluZyAoOnR5cGUgKDpiaW5kaW5nIG5vZGUpKSlcbiAgICAoY29uaiAod3JpdGUtYmluZGluZy12YXIgKDpiaW5kaW5nIG5vZGUpKVxuICAgICAgICAgICh3cml0ZS1sb2NhdGlvbiAoOmZvcm0gbm9kZSkpKVxuICAgIChjb25qICh3cml0ZS1sb2NhdGlvbiAoOmZvcm0gbm9kZSkpXG4gICAgICAgICAgKC0+aWRlbnRpZmllciAoOmZvcm0gbm9kZSkpKSkpXG4oaW5zdGFsbC13cml0ZXIhIDp2YXIgd3JpdGUtdmFyKVxuKGluc3RhbGwtd3JpdGVyISA6cGFyYW0gd3JpdGUtdmFyKVxuXG4oZGVmdW4gd3JpdGUtaW52b2tlXG4gIChmb3JtKVxuICB7OnR5cGUgOkNhbGxFeHByZXNzaW9uXG4gICA6Y2FsbGVlICh3cml0ZSAoOmNhbGxlZSBmb3JtKSlcbiAgIDphcmd1bWVudHMgKG1hcCB3cml0ZSAoOnBhcmFtcyBmb3JtKSl9KVxuKGluc3RhbGwtd3JpdGVyISA6aW52b2tlIHdyaXRlLWludm9rZSlcblxuKGRlZnVuIHdyaXRlLXZlY3RvclxuICAoZm9ybSlcbiAgezp0eXBlIDpBcnJheUV4cHJlc3Npb25cbiAgIDplbGVtZW50cyAobWFwIHdyaXRlICg6aXRlbXMgZm9ybSkpfSlcbihpbnN0YWxsLXdyaXRlciEgOnZlY3RvciB3cml0ZS12ZWN0b3IpXG5cbihkZWZ1biB3cml0ZS1kaWN0aW9uYXJ5XG4gIChmb3JtKVxuICAobGV0KiAoKHByb3BlcnRpZXMgKHBhcnRpdGlvbiAyIChpbnRlcmxlYXZlICg6a2V5cyBmb3JtKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoOnZhbHVlcyBmb3JtKSkpKSlcbiAgICB7OnR5cGUgOk9iamVjdEV4cHJlc3Npb25cbiAgICAgOnByb3BlcnRpZXMgKG1hcCAobGFtYmRhIChwYWlyKVxuICAgICAgICAgICAgICAgICAgICAgICAgKGxldCogKChrZXkgKGZpcnN0IHBhaXIpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHZhbHVlIChzZWNvbmQgcGFpcikpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICB7OmtpbmQgOmluaXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDp0eXBlIDpQcm9wZXJ0eVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgOmtleSAoaWYgKD0gOnN5bWJvbCAoOm9wIGtleSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHdyaXRlLWNvbnN0YW50IChzdHIgKDpmb3JtIGtleSkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh3cml0ZSBrZXkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgOnZhbHVlICh3cml0ZSB2YWx1ZSl9KSlcbiAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzKX0pKVxuKGluc3RhbGwtd3JpdGVyISA6ZGljdGlvbmFyeSB3cml0ZS1kaWN0aW9uYXJ5KVxuXG4oZGVmdW4gd3JpdGUtZXhwb3J0XG4gIChmb3JtKVxuICAod3JpdGUgezpvcCA6c2V0IVxuICAgICAgICAgIDp0YXJnZXQgezpvcCA6bWVtYmVyLWV4cHJlc3Npb25cbiAgICAgICAgICAgICAgICAgICA6Y29tcHV0ZWQgZmFsc2VcbiAgICAgICAgICAgICAgICAgICA6dGFyZ2V0IHs6b3AgOnZhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtICh3aXRoLW1ldGEgJ2V4cG9ydHMgKG1ldGEgKDpmb3JtICg6aWQgZm9ybSkpKSl9XG4gICAgICAgICAgICAgICAgICAgOnByb3BlcnR5ICg6aWQgZm9ybSlcbiAgICAgICAgICAgICAgICAgICA6Zm9ybSAoOmZvcm0gKDppZCBmb3JtKSl9XG4gICAgICAgICAgOnZhbHVlICg6aW5pdCBmb3JtKVxuICAgICAgICAgIDpmb3JtICg6Zm9ybSAoOmlkIGZvcm0pKX0pKVxuXG4oZGVmdW4gd3JpdGUtZGVmXG4gIChmb3JtKVxuICAoY29uaiB7OnR5cGUgOlZhcmlhYmxlRGVjbGFyYXRpb25cbiAgICAgICAgIDpraW5kIDp2YXJcbiAgICAgICAgIDpkZWNsYXJhdGlvbnMgWyhjb25qIHs6dHlwZSA6VmFyaWFibGVEZWNsYXJhdG9yXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmlkICh3cml0ZSAoOmlkIGZvcm0pKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDppbml0IChjb25qIChpZiAoOmV4cG9ydCBmb3JtKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHdyaXRlLWV4cG9ydCBmb3JtKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHdyaXRlICg6aW5pdCBmb3JtKSkpKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh3cml0ZS1sb2NhdGlvbiAoOmZvcm0gKDppZCBmb3JtKSkpKV19XG4gICAgICAgICh3cml0ZS1sb2NhdGlvbiAoOmZvcm0gZm9ybSkgKDpvcmlnaW5hbC1mb3JtIGZvcm0pKSkpXG4oaW5zdGFsbC13cml0ZXIhIDpkZWYgd3JpdGUtZGVmKVxuXG4oZGVmdW4gd3JpdGUtYmluZGluZ1xuICAoZm9ybSlcbiAgKGxldCogKChpZCAod3JpdGUtYmluZGluZy12YXIgZm9ybSkpXG4gICAgICAgIChpbml0ICh3cml0ZSAoOmluaXQgZm9ybSkpKSlcbiAgICB7OnR5cGUgOlZhcmlhYmxlRGVjbGFyYXRpb25cbiAgICAgOmtpbmQgOnZhclxuICAgICA6bG9jIChpbmhlcml0LWxvY2F0aW9uIFtpZCBpbml0XSlcbiAgICAgOmRlY2xhcmF0aW9ucyBbezp0eXBlIDpWYXJpYWJsZURlY2xhcmF0b3JcbiAgICAgICAgICAgICAgICAgICAgIDppZCBpZFxuICAgICAgICAgICAgICAgICAgICAgOmluaXQgaW5pdH1dfSkpXG4oaW5zdGFsbC13cml0ZXIhIDpiaW5kaW5nIHdyaXRlLWJpbmRpbmcpXG5cbihkZWZ1biB3cml0ZS10aHJvd1xuICAoZm9ybSlcbiAgKC0+ZXhwcmVzc2lvbiAoY29uaiB7OnR5cGUgOlRocm93U3RhdGVtZW50XG4gICAgICAgICAgICAgICAgICAgICAgIDphcmd1bWVudCAod3JpdGUgKDp0aHJvdyBmb3JtKSl9XG4gICAgICAgICAgICAgICAgICAgICAgKHdyaXRlLWxvY2F0aW9uICg6Zm9ybSBmb3JtKSAoOm9yaWdpbmFsLWZvcm0gZm9ybSkpKSkpXG4oaW5zdGFsbC13cml0ZXIhIDp0aHJvdyB3cml0ZS10aHJvdylcblxuKGRlZnVuIHdyaXRlLW5ld1xuICAoZm9ybSlcbiAgezp0eXBlIDpOZXdFeHByZXNzaW9uXG4gICA6Y2FsbGVlICh3cml0ZSAoOmNvbnN0cnVjdG9yIGZvcm0pKVxuICAgOmFyZ3VtZW50cyAobWFwIHdyaXRlICg6cGFyYW1zIGZvcm0pKX0pXG4oaW5zdGFsbC13cml0ZXIhIDpuZXcgd3JpdGUtbmV3KVxuXG4oZGVmdW4gd3JpdGUtc2V0IVxuICAoZm9ybSlcbiAgezp0eXBlIDpBc3NpZ25tZW50RXhwcmVzc2lvblxuICAgOm9wZXJhdG9yIDo9XG4gICA6bGVmdCAod3JpdGUgKDp0YXJnZXQgZm9ybSkpXG4gICA6cmlnaHQgKHdyaXRlICg6dmFsdWUgZm9ybSkpfSlcbihpbnN0YWxsLXdyaXRlciEgOnNldCEgd3JpdGUtc2V0ISlcblxuKGRlZnVuIHdyaXRlLWFnZXRcbiAgKGZvcm0pXG4gIHs6dHlwZSA6TWVtYmVyRXhwcmVzc2lvblxuICAgOmNvbXB1dGVkICg6Y29tcHV0ZWQgZm9ybSlcbiAgIDpvYmplY3QgKHdyaXRlICg6dGFyZ2V0IGZvcm0pKVxuICAgOnByb3BlcnR5ICh3cml0ZSAoOnByb3BlcnR5IGZvcm0pKX0pXG4oaW5zdGFsbC13cml0ZXIhIDptZW1iZXItZXhwcmVzc2lvbiB3cml0ZS1hZ2V0KVxuXG47OyBNYXAgb2Ygc3RhdGVtZW50IEFTVCBub2RlIHRoYXQgYXJlIGdlbmVyYXRlZFxuOzsgYnkgYSB3cml0ZXIuIFVzZWQgdG8gZGVjZXQgd2VhdGhlciBub2RlIGlzXG47OyBzdGF0ZW1lbnQgb3IgZXhwcmVzc2lvbi5cbihkZWZ2YXIgKipzdGF0ZW1lbnRzKiogezpFbXB0eVN0YXRlbWVudCB0cnVlIDpCbG9ja1N0YXRlbWVudCB0cnVlXG4gICAgICAgICAgICAgICAgICAgICA6RXhwcmVzc2lvblN0YXRlbWVudCB0cnVlIDpJZlN0YXRlbWVudCB0cnVlXG4gICAgICAgICAgICAgICAgICAgICA6TGFiZWxlZFN0YXRlbWVudCB0cnVlIDpCcmVha1N0YXRlbWVudCB0cnVlXG4gICAgICAgICAgICAgICAgICAgICA6Q29udGludWVTdGF0ZW1lbnQgdHJ1ZSA6U3dpdGNoU3RhdGVtZW50IHRydWVcbiAgICAgICAgICAgICAgICAgICAgIDpSZXR1cm5TdGF0ZW1lbnQgdHJ1ZSA6VGhyb3dTdGF0ZW1lbnQgdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgOlRyeVN0YXRlbWVudCB0cnVlIDpXaGlsZVN0YXRlbWVudCB0cnVlXG4gICAgICAgICAgICAgICAgICAgICA6RG9XaGlsZVN0YXRlbWVudCB0cnVlIDpGb3JTdGF0ZW1lbnQgdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgOkZvckluU3RhdGVtZW50IHRydWUgOkZvck9mU3RhdGVtZW50IHRydWVcbiAgICAgICAgICAgICAgICAgICAgIDpMZXRTdGF0ZW1lbnQgdHJ1ZSA6VmFyaWFibGVEZWNsYXJhdGlvbiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICA6RnVuY3Rpb25EZWNsYXJhdGlvbiB0cnVlfSlcblxuKGRlZnVuIHdyaXRlLXN0YXRlbWVudFxuICAoZm9ybSlcbiAgXCJXcmFwcyBleHByZXNzaW9uIHRoYXQgY2FuJ3QgYmUgaW4gYSBibG9jayBzdGF0ZW1lbnRcbiAgYm9keSBpbnRvIDpFeHByZXNzaW9uU3RhdGVtZW50IG90aGVyd2lzZSByZXR1cm5zIGJhY2tcbiAgZXhwcmVzc2lvbi5cIlxuICAoLT5zdGF0ZW1lbnQgKHdyaXRlIGZvcm0pKSlcblxuKGRlZnVuIC0+c3RhdGVtZW50XG4gIChub2RlKVxuICAoaWYgKGdldCAqKnN0YXRlbWVudHMqKiAoOnR5cGUgbm9kZSkpXG4gICAgbm9kZVxuICAgIHs6dHlwZSA6RXhwcmVzc2lvblN0YXRlbWVudFxuICAgICA6ZXhwcmVzc2lvbiBub2RlXG4gICAgIDpsb2MgKDpsb2Mgbm9kZSlcbiAgICAgfSkpXG5cbihkZWZ1biAtPnJldHVyblxuICAoZm9ybSlcbiAgKGNvbmogezp0eXBlIDpSZXR1cm5TdGF0ZW1lbnRcbiAgICAgICAgIDphcmd1bWVudCAod3JpdGUgZm9ybSl9XG4gICAgICAgICh3cml0ZS1sb2NhdGlvbiAoOmZvcm0gZm9ybSkgKDpvcmlnaW5hbC1mb3JtIGZvcm0pKSkpXG5cbihkZWZ1biB3cml0ZS1ib2R5XG4gIChmb3JtKVxuICBcIlRha2VzIGZvcm0gdGhhdCBtYXkgY29udGFpbiBgOnN0YXRlbWVudHNgIHZlY3RvclxuICBvciBgOnJlc3VsdGAgZm9ybSAgYW5kIHJldHVybnMgdmVjdG9yIGV4cHJlc3Npb25cbiAgbm9kZXMgdGhhdCBjYW4gYmUgdXNlZCBpbiBhbnkgYmxvY2suIElmIGA6cmVzdWx0YFxuICBpcyBwcmVzZW50IGl0IHdpbGwgYmUgYSBsYXN0IGluIHZlY3RvciBhbmQgb2YgYVxuICBgOlJldHVyblN0YXRlbWVudGAgdHlwZS5cbiAgRXhhbXBsZXM6XG5cblxuICAod3JpdGUtYm9keSB7OnN0YXRlbWVudHMgbmlsXG4gICAgICAgICAgICAgICA6cmVzdWx0IHs6b3AgOmNvbnN0YW50XG4gICAgICAgICAgICAgICAgICAgICAgICA6dHlwZSA6bnVtYmVyXG4gICAgICAgICAgICAgICAgICAgICAgICA6Zm9ybSAzfX0pXG4gIDs7ID0+XG4gIFt7OnR5cGUgOlJldHVyblN0YXRlbWVudFxuICAgIDphcmd1bWVudCB7OnR5cGUgOkxpdGVyYWwgOnZhbHVlIDN9fV1cblxuICAod3JpdGUtYm9keSB7OnN0YXRlbWVudHMgW3s6b3AgOnNldCFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnRhcmdldCB7Om9wIDp2YXIgOmZvcm0gJ3h9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIDp2YWx1ZSB7Om9wIDp2YXIgOmZvcm0gJ3l9fV1cbiAgICAgICAgICAgICAgIDpyZXN1bHQgezpvcCA6dmFyIDpmb3JtICd4fX0pXG4gIDs7ID0+XG4gIFt7OnR5cGUgOkV4cHJlc3Npb25TdGF0ZW1lbnRcbiAgICA6ZXhwcmVzc2lvbiB7OnR5cGUgOkFzc2lnbm1lbnRFeHByZXNzaW9uXG4gICAgICAgICAgICAgICAgIDpvcGVyYXRvciA6PVxuICAgICAgICAgICAgICAgICA6bGVmdCB7OnR5cGUgOklkZW50aWZpZXIgOm5hbWUgOnh9XG4gICAgICAgICAgICAgICAgIDpyaWdodCB7OnR5cGUgOklkZW50aWZpZXIgOm5hbWUgOnl9fX1cbiAgIHs6dHlwZSA6UmV0dXJuU3RhdGVtZW50XG4gICAgOmFyZ3VtZW50IHs6dHlwZSA6SWRlbnRpZmllciA6bmFtZSA6eH19XVwiXG4gIChsZXQqICgoc3RhdGVtZW50cyAobWFwIHdyaXRlLXN0YXRlbWVudFxuICAgICAgICAgICAgICAgICAgICAgICAgKG9yICg6c3RhdGVtZW50cyBmb3JtKSBbXSkpKVxuICAgICAgICAocmVzdWx0IChpZiAoOnJlc3VsdCBmb3JtKVxuICAgICAgICAgICAgICAgICAoLT5yZXR1cm4gKDpyZXN1bHQgZm9ybSkpKSkpXG5cbiAgICAoaWYgcmVzdWx0XG4gICAgICAoY29uaiBzdGF0ZW1lbnRzIHJlc3VsdClcbiAgICAgIHN0YXRlbWVudHMpKSlcblxuKGRlZnVuIC0+YmxvY2tcbiAgKGJvZHkpXG4gIChpZiAodmVjdG9yPyBib2R5KVxuICAgIHs6dHlwZSA6QmxvY2tTdGF0ZW1lbnRcbiAgICAgOmJvZHkgYm9keVxuICAgICA6bG9jIChpbmhlcml0LWxvY2F0aW9uIGJvZHkpfVxuICAgIHs6dHlwZSA6QmxvY2tTdGF0ZW1lbnRcbiAgICAgOmJvZHkgW2JvZHldXG4gICAgIDpsb2MgKDpsb2MgYm9keSl9KSlcblxuKGRlZnVuIC0+ZXhwcmVzc2lvblxuICAoJnJlc3QgYm9keSlcbiAgezp0eXBlIDpDYWxsRXhwcmVzc2lvblxuICAgOmFyZ3VtZW50cyBbXVxuICAgOmxvYyAoaW5oZXJpdC1sb2NhdGlvbiBib2R5KVxuICAgOmNhbGxlZSAoLT5zZXF1ZW5jZSBbezp0eXBlIDpGdW5jdGlvbkV4cHJlc3Npb25cbiAgICAgICAgICAgICAgICAgICAgICAgICA6aWQgbmlsXG4gICAgICAgICAgICAgICAgICAgICAgICAgOnBhcmFtcyBbXVxuICAgICAgICAgICAgICAgICAgICAgICAgIDpkZWZhdWx0cyBbXVxuICAgICAgICAgICAgICAgICAgICAgICAgIDpleHByZXNzaW9uIGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgOmdlbmVyYXRvciBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgIDpyZXN0IG5pbFxuICAgICAgICAgICAgICAgICAgICAgICAgIDpib2R5ICgtPmJsb2NrIGJvZHkpfV0pfSlcblxuKGRlZnVuIHdyaXRlLWRvXG4gIChmb3JtKVxuICAoaWYgKDpibG9jayAobWV0YSAoZmlyc3QgKDpmb3JtIGZvcm0pKSkpXG4gICAgKC0+YmxvY2sgKHdyaXRlLWJvZHkgKGNvbmogZm9ybSB7OnJlc3VsdCBuaWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6c3RhdGVtZW50cyAoY29uaiAoOnN0YXRlbWVudHMgZm9ybSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoOnJlc3VsdCBmb3JtKSl9KSkpXG4gICAgKGFwcGx5IC0+ZXhwcmVzc2lvbiAod3JpdGUtYm9keSBmb3JtKSkpKVxuKGluc3RhbGwtd3JpdGVyISA6ZG8gd3JpdGUtZG8pXG5cbihkZWZ1biB3cml0ZS1pZlxuICAoZm9ybSlcbiAgezp0eXBlIDpDb25kaXRpb25hbEV4cHJlc3Npb25cbiAgIDp0ZXN0ICh3cml0ZSAoOnRlc3QgZm9ybSkpXG4gICA6Y29uc2VxdWVudCAod3JpdGUgKDpjb25zZXF1ZW50IGZvcm0pKVxuICAgOmFsdGVybmF0ZSAod3JpdGUgKDphbHRlcm5hdGUgZm9ybSkpfSlcbihpbnN0YWxsLXdyaXRlciEgOmlmIHdyaXRlLWlmKVxuXG4oZGVmdW4gd3JpdGUtdHJ5XG4gIChmb3JtKVxuICAobGV0KiAoKGhhbmRsZXIgKDpoYW5kbGVyIGZvcm0pKVxuICAgICAgICAoZmluYWxpemVyICg6ZmluYWxpemVyIGZvcm0pKSlcbiAgICAoLT5leHByZXNzaW9uIChjb25qIHs6dHlwZSA6VHJ5U3RhdGVtZW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgOmd1YXJkZWRIYW5kbGVycyBbXVxuICAgICAgICAgICAgICAgICAgICAgICAgIDpibG9jayAoLT5ibG9jayAod3JpdGUtYm9keSAoOmJvZHkgZm9ybSkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgIDpoYW5kbGVycyAoaWYgaGFuZGxlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFt7OnR5cGUgOkNhdGNoQ2xhdXNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6cGFyYW0gKHdyaXRlICg6bmFtZSBoYW5kbGVyKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpib2R5ICgtPmJsb2NrICh3cml0ZS1ib2R5IGhhbmRsZXIpKX1dXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW10pXG4gICAgICAgICAgICAgICAgICAgICAgICAgOmZpbmFsaXplciAoY29uZCAoZmluYWxpemVyICgtPmJsb2NrICh3cml0ZS1ib2R5IGZpbmFsaXplcikpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKChub3QgaGFuZGxlcikgKC0+YmxvY2sgW10pKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGVsc2UgbmlsKSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAod3JpdGUtbG9jYXRpb24gKDpmb3JtIGZvcm0pICg6b3JpZ2luYWwtZm9ybSBmb3JtKSkpKSkpXG4oaW5zdGFsbC13cml0ZXIhIDp0cnkgd3JpdGUtdHJ5KVxuXG4oZGVmdW4tIHdyaXRlLWJpbmRpbmctdmFsdWVcbiAgKGZvcm0pXG4gICh3cml0ZSAoOmluaXQgZm9ybSkpKVxuXG4oZGVmdW4tIHdyaXRlLWJpbmRpbmctcGFyYW1cbiAgKGZvcm0pXG4gICh3cml0ZS12YXIgezpmb3JtICg6bmFtZSBmb3JtKX0pKVxuXG4oZGVmdW4gd3JpdGUtYmluZGluZ1xuICAoZm9ybSlcbiAgKHdyaXRlIHs6b3AgOmRlZlxuICAgICAgICAgIDp2YXIgZm9ybVxuICAgICAgICAgIDppbml0ICg6aW5pdCBmb3JtKVxuICAgICAgICAgIDpmb3JtIGZvcm19KSlcblxuKGRlZnVuIHdyaXRlLWxldFxuICAoZm9ybSlcbiAgKGxldCogKChib2R5IChjb25qIGZvcm1cbiAgICAgICAgICAgICAgICAgICB7OnN0YXRlbWVudHMgKHZlYyAoY29uY2F0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICg6YmluZGluZ3MgZm9ybSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKDpzdGF0ZW1lbnRzIGZvcm0pKSl9KSkpXG4gICAgKC0+aWlmZSAoLT5ibG9jayAod3JpdGUtYm9keSBib2R5KSkpKSlcbihpbnN0YWxsLXdyaXRlciEgOmxldCB3cml0ZS1sZXQpXG5cbihkZWZ1biAtPnJlYmluZFxuICAoZm9ybSlcbiAgKGxvb3AgKChyZXN1bHQgW10pXG4gICAgICAgICAoYmluZGluZ3MgKDpiaW5kaW5ncyBmb3JtKSkpXG4gICAgKGlmIChlbXB0eT8gYmluZGluZ3MpXG4gICAgICByZXN1bHRcbiAgICAgIChyZWN1ciAoY29uaiByZXN1bHRcbiAgICAgICAgICAgICAgICAgICB7OnR5cGUgOkFzc2lnbm1lbnRFeHByZXNzaW9uXG4gICAgICAgICAgICAgICAgICAgIDpvcGVyYXRvciA6PVxuICAgICAgICAgICAgICAgICAgICA6bGVmdCAod3JpdGUtYmluZGluZy12YXIgKGZpcnN0IGJpbmRpbmdzKSlcbiAgICAgICAgICAgICAgICAgICAgOnJpZ2h0IHs6dHlwZSA6TWVtYmVyRXhwcmVzc2lvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpjb21wdXRlZCB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOm9iamVjdCB7OnR5cGUgOklkZW50aWZpZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6bmFtZSA6bG9vcH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6cHJvcGVydHkgezp0eXBlIDpMaXRlcmFsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6dmFsdWUgKGNvdW50IHJlc3VsdCl9fX0pXG4gICAgICAgICAgICAgKHJlc3QgYmluZGluZ3MpKSkpKVxuXG4oZGVmdW4gLT5zZXF1ZW5jZVxuICAoZXhwcmVzc2lvbnMpXG4gIHs6dHlwZSA6U2VxdWVuY2VFeHByZXNzaW9uXG4gICA6ZXhwcmVzc2lvbnMgZXhwcmVzc2lvbnN9KVxuXG4oZGVmdW4gLT5paWZlXG4gIChib2R5IGlkKVxuICB7OnR5cGUgOkNhbGxFeHByZXNzaW9uXG4gICA6YXJndW1lbnRzIFt7OnR5cGUgOlRoaXNFeHByZXNzaW9ufV1cbiAgIDpjYWxsZWUgezp0eXBlIDpNZW1iZXJFeHByZXNzaW9uXG4gICAgICAgICAgICA6Y29tcHV0ZWQgZmFsc2VcbiAgICAgICAgICAgIDpvYmplY3Qgezp0eXBlIDpGdW5jdGlvbkV4cHJlc3Npb25cbiAgICAgICAgICAgICAgICAgICAgIDppZCBpZFxuICAgICAgICAgICAgICAgICAgICAgOnBhcmFtcyBbXVxuICAgICAgICAgICAgICAgICAgICAgOmRlZmF1bHRzIFtdXG4gICAgICAgICAgICAgICAgICAgICA6ZXhwcmVzc2lvbiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgOmdlbmVyYXRvciBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgOnJlc3QgbmlsXG4gICAgICAgICAgICAgICAgICAgICA6Ym9keSBib2R5fVxuICAgICAgICAgICAgOnByb3BlcnR5IHs6dHlwZSA6SWRlbnRpZmllclxuICAgICAgICAgICAgICAgICAgICAgICA6bmFtZSA6Y2FsbH19fSlcblxuKGRlZnVuIC0+bG9vcC1pbml0XG4gICgpXG4gIHs6dHlwZSA6VmFyaWFibGVEZWNsYXJhdGlvblxuICAgOmtpbmQgOnZhclxuICAgOmRlY2xhcmF0aW9ucyBbezp0eXBlIDpWYXJpYWJsZURlY2xhcmF0b3JcbiAgICAgICAgICAgICAgICAgICA6aWQgezp0eXBlIDpJZGVudGlmaWVyXG4gICAgICAgICAgICAgICAgICAgICAgICA6bmFtZSA6cmVjdXJ9XG4gICAgICAgICAgICAgICAgICAgOmluaXQgezp0eXBlIDpJZGVudGlmaWVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDpuYW1lIDpsb29wfX1dfSlcblxuKGRlZnVuIC0+ZG8td2hpbGVcbiAoYm9keSB0ZXN0KVxuIHs6dHlwZSA6RG9XaGlsZVN0YXRlbWVudFxuICA6Ym9keSBib2R5XG4gIDp0ZXN0IHRlc3R9KVxuXG4oZGVmdW4gLT5zZXQhLXJlY3VyXG4gIChmb3JtKVxuICB7OnR5cGUgOkFzc2lnbm1lbnRFeHByZXNzaW9uXG4gICA6b3BlcmF0b3IgOj1cbiAgIDpsZWZ0IHs6dHlwZSA6SWRlbnRpZmllciA6bmFtZSA6cmVjdXJ9XG4gICA6cmlnaHQgKHdyaXRlIGZvcm0pfSlcblxuKGRlZnVuIC0+bG9vcFxuICAoZm9ybSlcbiAgKC0+c2VxdWVuY2UgKGNvbmogKC0+cmViaW5kIGZvcm0pXG4gICAgICAgICAgICAgICAgICAgIHs6dHlwZSA6QmluYXJ5RXhwcmVzc2lvblxuICAgICAgICAgICAgICAgICAgICAgOm9wZXJhdG9yIDo9PT1cbiAgICAgICAgICAgICAgICAgICAgIDpsZWZ0IHs6dHlwZSA6SWRlbnRpZmllclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpuYW1lIDpyZWN1cn1cbiAgICAgICAgICAgICAgICAgICAgIDpyaWdodCB7OnR5cGUgOklkZW50aWZpZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOm5hbWUgOmxvb3B9fSkpKVxuXG5cbihkZWZ1biB3cml0ZS1sb29wXG4gIChmb3JtKVxuICAobGV0KiAoKHN0YXRlbWVudHMgKDpzdGF0ZW1lbnRzIGZvcm0pKVxuICAgICAgICAocmVzdWx0ICg6cmVzdWx0IGZvcm0pKVxuICAgICAgICAoYmluZGluZ3MgKDpiaW5kaW5ncyBmb3JtKSlcblxuICAgICAgICAobG9vcC1ib2R5IChjb25qIChtYXAgd3JpdGUtc3RhdGVtZW50IHN0YXRlbWVudHMpXG4gICAgICAgICAgICAgICAgICAgICAgICAoLT5zdGF0ZW1lbnQgKC0+c2V0IS1yZWN1ciByZXN1bHQpKSkpXG4gICAgICAgIChib2R5IChjb25jYXQgWyhcbiAgICAgICAgICAgICAgICAgICAgICAgLT5sb29wLWluaXQpXVxuICAgICAgICAgICAgICAgICAgICAgKG1hcCB3cml0ZSBiaW5kaW5ncylcbiAgICAgICAgICAgICAgICAgICAgIFsoLT5kby13aGlsZSAoLT5ibG9jayAodmVjIGxvb3AtYm9keSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKC0+bG9vcCBmb3JtKSldXG4gICAgICAgICAgICAgICAgICAgICBbezp0eXBlIDpSZXR1cm5TdGF0ZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgICAgOmFyZ3VtZW50IHs6dHlwZSA6SWRlbnRpZmllclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpuYW1lIDpyZWN1cn19XSkpKVxuICAgICgtPmlpZmUgKC0+YmxvY2sgKHZlYyBib2R5KSkgJ2xvb3ApKSlcbihpbnN0YWxsLXdyaXRlciEgOmxvb3Agd3JpdGUtbG9vcClcblxuKGRlZnVuIC0+cmVjdXJcbiAgKGZvcm0pXG4gIChsb29wICgocmVzdWx0IFtdKVxuICAgICAgICAgKHBhcmFtcyAoOnBhcmFtcyBmb3JtKSkpXG4gICAgKGlmIChlbXB0eT8gcGFyYW1zKVxuICAgICAgcmVzdWx0XG4gICAgICAocmVjdXIgKGNvbmogcmVzdWx0XG4gICAgICAgICAgICAgICAgICAgezp0eXBlIDpBc3NpZ25tZW50RXhwcmVzc2lvblxuICAgICAgICAgICAgICAgICAgICA6b3BlcmF0b3IgOj1cbiAgICAgICAgICAgICAgICAgICAgOnJpZ2h0ICh3cml0ZSAoZmlyc3QgcGFyYW1zKSlcbiAgICAgICAgICAgICAgICAgICAgOmxlZnQgezp0eXBlIDpNZW1iZXJFeHByZXNzaW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICA6Y29tcHV0ZWQgdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgOm9iamVjdCB7OnR5cGUgOklkZW50aWZpZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpuYW1lIDpsb29wfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgOnByb3BlcnR5IHs6dHlwZSA6TGl0ZXJhbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6dmFsdWUgKGNvdW50IHJlc3VsdCl9fX0pXG4gICAgICAgICAgICAgKHJlc3QgcGFyYW1zKSkpKSlcblxuKGRlZnVuIHdyaXRlLXJlY3VyXG4gIChmb3JtKVxuICAoLT5zZXF1ZW5jZSAoY29uaiAoLT5yZWN1ciBmb3JtKVxuICAgICAgICAgICAgICAgICAgICB7OnR5cGUgOklkZW50aWZpZXJcbiAgICAgICAgICAgICAgICAgICAgIDpuYW1lIDpsb29wfSkpKVxuKGluc3RhbGwtd3JpdGVyISA6cmVjdXIgd3JpdGUtcmVjdXIpXG5cbihkZWZ1biBmYWxsYmFjay1vdmVybG9hZFxuICAoKVxuICB7OnR5cGUgOlN3aXRjaENhc2VcbiAgIDp0ZXN0IG5pbFxuICAgOmNvbnNlcXVlbnQgW3s6dHlwZSA6VGhyb3dTdGF0ZW1lbnRcbiAgICAgICAgICAgICAgICAgOmFyZ3VtZW50IHs6dHlwZSA6Q2FsbEV4cHJlc3Npb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Y2FsbGVlIHs6dHlwZSA6SWRlbnRpZmllclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpuYW1lIDpSYW5nZUVycm9yfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDphcmd1bWVudHMgW3s6dHlwZSA6TGl0ZXJhbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6dmFsdWUgXCJXcm9uZyBudW1iZXIgb2YgYXJndW1lbnRzIHBhc3NlZFwifV19fV19KVxuXG4oZGVmdW4gc3BsaWNlLWJpbmRpbmdcbiAgKGZvcm0pXG4gIHs6b3AgOmRlZlxuICAgOmlkIChsYXN0ICg6cGFyYW1zIGZvcm0pKVxuICAgOmluaXQgezpvcCA6aW52b2tlXG4gICAgICAgICAgOmNhbGxlZSB7Om9wIDp2YXJcbiAgICAgICAgICAgICAgICAgICA6Zm9ybSAnQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGx9XG4gICAgICAgICAgOnBhcmFtcyBbezpvcCA6dmFyXG4gICAgICAgICAgICAgICAgICAgIDpmb3JtICdhcmd1bWVudHN9XG4gICAgICAgICAgICAgICAgICAgezpvcCA6Y29uc3RhbnRcbiAgICAgICAgICAgICAgICAgICAgOmZvcm0gKDphcml0eSBmb3JtKVxuICAgICAgICAgICAgICAgICAgICA6dHlwZSA6bnVtYmVyfV19fSlcblxuKGRlZnVuIHdyaXRlLW92ZXJsb2FkaW5nLXBhcmFtc1xuICAocGFyYW1zKVxuICAocmVkdWNlIChsYW1iZGEgKGZvcm1zIHBhcmFtKVxuICAgICAgICAgICAgKGNvbmogZm9ybXMgezpvcCA6ZGVmXG4gICAgICAgICAgICAgICAgICAgICAgICAgOmlkIHBhcmFtXG4gICAgICAgICAgICAgICAgICAgICAgICAgOmluaXQgezpvcCA6bWVtYmVyLWV4cHJlc3Npb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmNvbXB1dGVkIHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnRhcmdldCB7Om9wIDp2YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gJ2FyZ3VtZW50c31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnByb3BlcnR5IHs6b3AgOmNvbnN0YW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnR5cGUgOm51bWJlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtIChjb3VudCBmb3Jtcyl9fX0pKVxuICAgICAgICAgIFtdXG4gICAgICAgICAgcGFyYW1zKSlcblxuKGRlZnVuIHdyaXRlLW92ZXJsb2FkaW5nLWZuXG4gIChmb3JtKVxuICAobGV0KiAoKG92ZXJsb2FkcyAobWFwIHdyaXRlLWZuLW92ZXJsb2FkICg6bWV0aG9kcyBmb3JtKSkpKVxuICAgIHs6cGFyYW1zIFtdXG4gICAgIDpib2R5ICgtPmJsb2NrIHs6dHlwZSA6U3dpdGNoU3RhdGVtZW50XG4gICAgICAgICAgICAgICAgICAgICA6ZGlzY3JpbWluYW50IHs6dHlwZSA6TWVtYmVyRXhwcmVzc2lvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmNvbXB1dGVkIGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6b2JqZWN0IHs6dHlwZSA6SWRlbnRpZmllclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOm5hbWUgOmFyZ3VtZW50c31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpwcm9wZXJ0eSB7OnR5cGUgOklkZW50aWZpZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOm5hbWUgOmxlbmd0aH19XG4gICAgICAgICAgICAgICAgICAgICA6Y2FzZXMgKGlmICg6dmFyaWFkaWMgZm9ybSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG92ZXJsb2Fkc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGNvbmogb3ZlcmxvYWRzIChmYWxsYmFjay1vdmVybG9hZCkpKX0pfSkpXG5cbihkZWZ1biB3cml0ZS1mbi1vdmVybG9hZFxuICAoZm9ybSlcbiAgKGxldCogKChwYXJhbXMgKDpwYXJhbXMgZm9ybSkpXG4gICAgICAgIChiaW5kaW5ncyAoaWYgKDp2YXJpYWRpYyBmb3JtKVxuICAgICAgICAgICAgICAgICAgIChjb25qICh3cml0ZS1vdmVybG9hZGluZy1wYXJhbXMgKHZlYyAoYnV0bGFzdCBwYXJhbXMpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAoc3BsaWNlLWJpbmRpbmcgZm9ybSkpXG4gICAgICAgICAgICAgICAgICAgKHdyaXRlLW92ZXJsb2FkaW5nLXBhcmFtcyBwYXJhbXMpKSlcbiAgICAgICAgKHN0YXRlbWVudHMgKHZlYyAoY29uY2F0IGJpbmRpbmdzICg6c3RhdGVtZW50cyBmb3JtKSkpKSlcbiAgICB7OnR5cGUgOlN3aXRjaENhc2VcbiAgICAgOnRlc3QgKGlmIChub3QgKDp2YXJpYWRpYyBmb3JtKSlcbiAgICAgICAgICAgICB7OnR5cGUgOkxpdGVyYWxcbiAgICAgICAgICAgICAgOnZhbHVlICg6YXJpdHkgZm9ybSl9KVxuICAgICA6Y29uc2VxdWVudCAod3JpdGUtYm9keSAoY29uaiBmb3JtIHs6c3RhdGVtZW50cyBzdGF0ZW1lbnRzfSkpfSkpXG5cbihkZWZ1biB3cml0ZS1zaW1wbGUtZm5cbiAgKGZvcm0pXG4gIChsZXQqICgobWV0aG9kIChmaXJzdCAoOm1ldGhvZHMgZm9ybSkpKVxuICAgICAgICAocGFyYW1zIChpZiAoOnZhcmlhZGljIG1ldGhvZClcbiAgICAgICAgICAgICAgICAgKHZlYyAoYnV0bGFzdCAoOnBhcmFtcyBtZXRob2QpKSlcbiAgICAgICAgICAgICAgICAgKDpwYXJhbXMgbWV0aG9kKSkpXG4gICAgICAgIChib2R5IChpZiAoOnZhcmlhZGljIG1ldGhvZClcbiAgICAgICAgICAgICAgIChjb25qIG1ldGhvZFxuICAgICAgICAgICAgICAgICAgICAgezpzdGF0ZW1lbnRzICh2ZWMgKGNvbnMgKHNwbGljZS1iaW5kaW5nIG1ldGhvZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICg6c3RhdGVtZW50cyBtZXRob2QpKSl9KVxuICAgICAgICAgICAgICAgbWV0aG9kKSkpXG4gICAgezpwYXJhbXMgKG1hcCB3cml0ZS12YXIgcGFyYW1zKVxuICAgICA6Ym9keSAoLT5ibG9jayAod3JpdGUtYm9keSBib2R5KSl9KSlcblxuKGRlZnVuIHJlc29sdmVcbiAgKGZyb20gdG8pXG4gIChsZXQqICgocmVxdWlyZXIgKHNwbGl0IChuYW1lIGZyb20pIFxcLikpXG4gICAgICAgIChyZXF1aXJlbWVudCAoc3BsaXQgKG5hbWUgdG8pIFxcLikpXG4gICAgICAgIChyZWxhdGl2ZT8gKGFuZCAobm90IChpZGVudGljYWw/IChuYW1lIGZyb20pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG5hbWUgdG8pKSlcbiAgICAgICAgICAgICAgICAgICAgICAgKGlkZW50aWNhbD8gKGZpcnN0IHJlcXVpcmVyKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZmlyc3QgcmVxdWlyZW1lbnQpKSkpKVxuICAgIChpZiByZWxhdGl2ZT9cbiAgICAgIChsb29wICgoZnJvbSByZXF1aXJlcilcbiAgICAgICAgICAgICAodG8gcmVxdWlyZW1lbnQpKVxuICAgICAgICAoaWYgKGlkZW50aWNhbD8gKGZpcnN0IGZyb20pXG4gICAgICAgICAgICAgICAgICAgICAgICAoZmlyc3QgdG8pKVxuICAgICAgICAgIChyZWN1ciAocmVzdCBmcm9tKSAocmVzdCB0bykpXG4gICAgICAgICAgKGpvaW4gXFwvXG4gICAgICAgICAgICAgICAgKGNvbmNhdCBbXFwuXVxuICAgICAgICAgICAgICAgICAgICAgICAgKHJlcGVhdCAoZGVjIChjb3VudCBmcm9tKSkgXCIuLlwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgdG8pKSkpXG4gICAgICAoam9pbiBcXC8gcmVxdWlyZW1lbnQpKSkpXG5cbihkZWZ1biBpZC0+bnNcbiAgKGlkKVxuICBcIlRha2VzIG5hbWVzcGFjZSBpZGVudGlmaWVyIHN5bWJvbCBhbmQgdHJhbnNsYXRlcyB0byBuZXdcbiAgc3ltYm9sIHdpdGhvdXQgLiBzcGVjaWFsIGNoYXJhY3RlcnNcbiAgd2lzcC5jb3JlIC0+IHdpc3AqY29yZVwiXG4gIChzeW1ib2wgbmlsIChqb2luIFxcKiAoc3BsaXQgKG5hbWUgaWQpIFxcLikpKSlcblxuXG4oZGVmdW4gd3JpdGUtcmVxdWlyZVxuICAoZm9ybSByZXF1aXJlcilcbiAgKGxldCogKChucy1iaW5kaW5nIHs6b3AgOmRlZlxuICAgICAgICAgICAgICAgICAgICA6aWQgezpvcCA6dmFyXG4gICAgICAgICAgICAgICAgICAgICAgICAgOnR5cGUgOmlkZW50aWZpZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICA6Zm9ybSAoaWQtPm5zICg6bnMgZm9ybSkpfVxuICAgICAgICAgICAgICAgICAgICA6aW5pdCB7Om9wIDppbnZva2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDpjYWxsZWUgezpvcCA6dmFyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6dHlwZSA6aWRlbnRpZmllclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gJ3JlcXVpcmV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICA6cGFyYW1zIFt7Om9wIDpjb25zdGFudFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtIChyZXNvbHZlIHJlcXVpcmVyICg6bnMgZm9ybSkpfV19fSlcbiAgICAgICAgKG5zLWFsaWFzIChpZiAoOmFsaWFzIGZvcm0pXG4gICAgICAgICAgICAgICAgICAgezpvcCA6ZGVmXG4gICAgICAgICAgICAgICAgICAgIDppZCB7Om9wIDp2YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICA6dHlwZSA6aWRlbnRpZmllclxuICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtIChpZC0+bnMgKDphbGlhcyBmb3JtKSl9XG4gICAgICAgICAgICAgICAgICAgIDppbml0ICg6aWQgbnMtYmluZGluZyl9KSlcblxuICAgICAgICAocmVmZXJlbmNlcyAocmVkdWNlIChsYW1iZGEgKHJlZmVyZW5jZXMgZm9ybSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGNvbmogcmVmZXJlbmNlc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Om9wIDpkZWZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDppZCB7Om9wIDp2YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnR5cGUgOmlkZW50aWZpZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gKG9yICg6cmVuYW1lIGZvcm0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoOm5hbWUgZm9ybSkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmluaXQgezpvcCA6bWVtYmVyLWV4cHJlc3Npb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Y29tcHV0ZWQgZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6dGFyZ2V0ICg6aWQgbnMtYmluZGluZylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6cHJvcGVydHkgezpvcCA6dmFyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6dHlwZSA6aWRlbnRpZmllclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gKDpuYW1lIGZvcm0pfX19KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFtdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAoOnJlZmVyIGZvcm0pKSkpXG4gICAgKHZlYyAoY29ucyBucy1iaW5kaW5nXG4gICAgICAgICAgICAgICAoaWYgbnMtYWxpYXNcbiAgICAgICAgICAgICAgICAgKGNvbnMgbnMtYWxpYXMgcmVmZXJlbmNlcylcbiAgICAgICAgICAgICAgICAgcmVmZXJlbmNlcykpKSkpXG5cbihkZWZ1biB3cml0ZS1uc1xuICAoZm9ybSlcbiAgKGxldCogKChub2RlICg6Zm9ybSBmb3JtKSlcbiAgICAgICAgKHJlcXVpcmVyICg6bmFtZSBmb3JtKSlcbiAgICAgICAgKG5zLWJpbmRpbmcgezpvcCA6ZGVmXG4gICAgICAgICAgICAgICAgICAgIDpvcmlnaW5hbC1mb3JtIG5vZGVcbiAgICAgICAgICAgICAgICAgICAgOmlkIHs6b3AgOnZhclxuICAgICAgICAgICAgICAgICAgICAgICAgIDp0eXBlIDppZGVudGlmaWVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgOm9yaWdpbmFsLWZvcm0gKGZpcnN0IG5vZGUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gJypucyp9XG4gICAgICAgICAgICAgICAgICAgIDppbml0IHs6b3AgOmRpY3Rpb25hcnlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtIG5vZGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDprZXlzIFt7Om9wIDp2YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnR5cGUgOmlkZW50aWZpZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOm9yaWdpbmFsLWZvcm0gbm9kZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Zm9ybSAnaWR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgezpvcCA6dmFyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDp0eXBlIDppZGVudGlmaWVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpvcmlnaW5hbC1mb3JtIG5vZGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gJ2RvY31dXG4gICAgICAgICAgICAgICAgICAgICAgICAgICA6dmFsdWVzIFt7Om9wIDpjb25zdGFudFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDp0eXBlIDppZGVudGlmaWVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOm9yaWdpbmFsLWZvcm0gKDpuYW1lIGZvcm0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gKG5hbWUgKDpuYW1lIGZvcm0pKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHs6b3AgOmNvbnN0YW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOm9yaWdpbmFsLWZvcm0gbm9kZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtICg6ZG9jIGZvcm0pfV19fSlcbiAgICAgICAgKHJlcXVpcmVtZW50cyAodmVjIChhcHBseSBjb25jYXQgKG1hcCAobGFtYmRhICglKSAod3JpdGUtcmVxdWlyZSAlIHJlcXVpcmVyKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICg6cmVxdWlyZSBmb3JtKSkpKSkpXG4gICAgKC0+YmxvY2sgKG1hcCB3cml0ZSAodmVjIChjb25zIG5zLWJpbmRpbmcgcmVxdWlyZW1lbnRzKSkpKSkpXG4oaW5zdGFsbC13cml0ZXIhIDpucyB3cml0ZS1ucylcblxuKGRlZnVuIHdyaXRlLWZuXG4gIChmb3JtKVxuICAobGV0KiAoKGJhc2UgKGlmICg+IChjb3VudCAoOm1ldGhvZHMgZm9ybSkpIDEpXG4gICAgICAgICAgICAgICAod3JpdGUtb3ZlcmxvYWRpbmctZm4gZm9ybSlcbiAgICAgICAgICAgICAgICh3cml0ZS1zaW1wbGUtZm4gZm9ybSkpKSlcbiAgICAoY29uaiBiYXNlXG4gICAgICAgICAgezp0eXBlIDpGdW5jdGlvbkV4cHJlc3Npb25cbiAgICAgICAgICAgOmlkIChpZiAoOmlkIGZvcm0pICh3cml0ZS12YXIgKDppZCBmb3JtKSkpXG4gICAgICAgICAgIDpkZWZhdWx0cyBuaWxcbiAgICAgICAgICAgOnJlc3QgbmlsXG4gICAgICAgICAgIDpnZW5lcmF0b3IgZmFsc2VcbiAgICAgICAgICAgOmV4cHJlc3Npb24gZmFsc2V9KSkpXG4oaW5zdGFsbC13cml0ZXIhIDpmbiB3cml0ZS1mbilcblxuKGRlZnVuIHdyaXRlXG4gIChmb3JtKVxuICAobGV0KiAoKG9wICg6b3AgZm9ybSkpXG4gICAgICAgICh3cml0ZXIgKGFuZCAoPSA6aW52b2tlICg6b3AgZm9ybSkpXG4gICAgICAgICAgICAgICAgICAgICg9IDp2YXIgKDpvcCAoOmNhbGxlZSBmb3JtKSkpXG4gICAgICAgICAgICAgICAgICAgIChnZXQgKipzcGVjaWFscyoqIChuYW1lICg6Zm9ybSAoOmNhbGxlZSBmb3JtKSkpKSkpKVxuICAgIChpZiB3cml0ZXJcbiAgICAgICh3cml0ZS1zcGVjaWFsIHdyaXRlciBmb3JtKVxuICAgICAgKHdyaXRlLW9wICg6b3AgZm9ybSkgZm9ybSkpKSlcblxuKGRlZnVuIHdyaXRlKlxuICAoJnJlc3QgZm9ybXMpXG4gIChsZXQqICgoYm9keSAobWFwIHdyaXRlLXN0YXRlbWVudCBmb3JtcykpKVxuICAgIHs6dHlwZSA6UHJvZ3JhbVxuICAgICA6Ym9keSBib2R5XG4gICAgIDpsb2MgKGluaGVyaXQtbG9jYXRpb24gYm9keSl9KSlcblxuXG4oZGVmdW4gY29tcGlsZVxuICAoJnJlc3QgYXJncylcbiAgKGlmIChpZGVudGljYWw/IChjb3VudCBhcmdzKSAxKVxuICAgIChjb21waWxlIHt9IChmaXJzdCBhcmdzKSlcbiAgICAoZ2VuZXJhdGUgKGFwcGx5IHdyaXRlKiAocmVzdCBhcmdzKSkgKGZpcnN0IGFyZ3MpKSkpXG5cblxuKGRlZnVuIGdldC1tYWNyb1xuICAodGFyZ2V0IHByb3BlcnR5ICZyZXN0IGFyZ3MpXG4gIChpZiAoZW1wdHk/IGFyZ3MpXG4gICAgYChhZ2V0IChvciAsdGFyZ2V0IDApXG4gICAgICAgICAgICxwcm9wZXJ0eSlcbiAgICAobGV0KiAoKGRlZmF1bHQqIChmaXJzdCBhcmdzKSkpXG4gICAgICAoaWYgKGlkZW50aWNhbD8gZGVmYXVsdCogbmlsKVxuICAgICAgICBgKGdldCAsdGFyZ2V0ICxwcm9wZXJ0eSlcbiAgICAgICAgYChhcHBseSBnZXQgLFt0YXJnZXQgcHJvcGVydHkgZGVmYXVsdCpdKSkpKSlcbihpbnN0YWxsLW1hY3JvISA6Z2V0IGdldC1tYWNybylcblxuOzsgTG9naWNhbCBvcGVyYXRvcnNcblxuKGRlZnVuIGluc3RhbGwtbG9naWNhbC1vcGVyYXRvciFcbiAgKGNhbGxlZSBvcGVyYXRvciBmYWxsYmFjaylcbiAgKGRlZnVuIHdyaXRlLWxvZ2ljYWwtb3BlcmF0b3JcbiAgICAoJnJlc3Qgb3BlcmFuZHMpXG4gICAgKGxldCogKChuIChjb3VudCBvcGVyYW5kcykpKVxuICAgICAgKGNvbmQgKCg9IG4gMCkgKHdyaXRlLWNvbnN0YW50IGZhbGxiYWNrKSlcbiAgICAgICAgICAgICgoPSBuIDEpICh3cml0ZSAoZmlyc3Qgb3BlcmFuZHMpKSlcbiAgICAgICAgICAgIChlbHNlIChyZWR1Y2UgKGxhbWJkYSAobGVmdCByaWdodClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7OnR5cGUgOkxvZ2ljYWxFeHByZXNzaW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpvcGVyYXRvciBvcGVyYXRvclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6bGVmdCBsZWZ0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpyaWdodCAod3JpdGUgcmlnaHQpfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKHdyaXRlIChmaXJzdCBvcGVyYW5kcykpXG4gICAgICAgICAgICAgICAgICAgICAgICAgIChyZXN0IG9wZXJhbmRzKSkpKSkpXG4gIChpbnN0YWxsLXNwZWNpYWwhIGNhbGxlZSB3cml0ZS1sb2dpY2FsLW9wZXJhdG9yKSlcbihpbnN0YWxsLWxvZ2ljYWwtb3BlcmF0b3IhIDpvciA6fHwgbmlsKVxuKGluc3RhbGwtbG9naWNhbC1vcGVyYXRvciEgOmFuZCA6JiYgdHJ1ZSlcblxuKGRlZnVuIGluc3RhbGwtdW5hcnktb3BlcmF0b3IhXG4gIChjYWxsZWUgb3BlcmF0b3IgcHJlZml4PylcbiAgKGRlZnVuIHdyaXRlLXVuYXJ5LW9wZXJhdG9yXG4gICAgKCZyZXN0IHBhcmFtcylcbiAgICAoaWYgKGlkZW50aWNhbD8gKGNvdW50IHBhcmFtcykgMSlcbiAgICAgIHs6dHlwZSA6VW5hcnlFeHByZXNzaW9uXG4gICAgICAgOm9wZXJhdG9yIG9wZXJhdG9yXG4gICAgICAgOmFyZ3VtZW50ICh3cml0ZSAoZmlyc3QgcGFyYW1zKSlcbiAgICAgICA6cHJlZml4IHByZWZpeD99XG4gICAgICAoZXJyb3ItYXJnLWNvdW50IGNhbGxlZSAoY291bnQgcGFyYW1zKSkpKVxuICAoaW5zdGFsbC1zcGVjaWFsISBjYWxsZWUgd3JpdGUtdW5hcnktb3BlcmF0b3IpKVxuKGluc3RhbGwtdW5hcnktb3BlcmF0b3IhIDpub3QgOiEpXG5cbjs7IEJpdHdpc2UgT3BlcmF0b3JzXG5cbihpbnN0YWxsLXVuYXJ5LW9wZXJhdG9yISA6Yml0LW5vdCA6filcblxuKGRlZnVuIGluc3RhbGwtYmluYXJ5LW9wZXJhdG9yIVxuICAoY2FsbGVlIG9wZXJhdG9yKVxuICAoZGVmdW4gd3JpdGUtYmluYXJ5LW9wZXJhdG9yXG4gICAgKCZyZXN0IHBhcmFtcylcbiAgICAoaWYgKDwgKGNvdW50IHBhcmFtcykgMilcbiAgICAgIChlcnJvci1hcmctY291bnQgY2FsbGVlIChjb3VudCBwYXJhbXMpKVxuICAgICAgKHJlZHVjZSAobGFtYmRhIChsZWZ0IHJpZ2h0KVxuICAgICAgICAgICAgICAgIHs6dHlwZSA6QmluYXJ5RXhwcmVzc2lvblxuICAgICAgICAgICAgICAgICA6b3BlcmF0b3Igb3BlcmF0b3JcbiAgICAgICAgICAgICAgICAgOmxlZnQgbGVmdFxuICAgICAgICAgICAgICAgICA6cmlnaHQgKHdyaXRlIHJpZ2h0KX0pXG4gICAgICAgICAgICAgICh3cml0ZSAoZmlyc3QgcGFyYW1zKSlcbiAgICAgICAgICAgICAgKHJlc3QgcGFyYW1zKSkpKVxuICAoaW5zdGFsbC1zcGVjaWFsISBjYWxsZWUgd3JpdGUtYmluYXJ5LW9wZXJhdG9yKSlcbihpbnN0YWxsLWJpbmFyeS1vcGVyYXRvciEgOmJpdC1hbmQgOiYpXG4oaW5zdGFsbC1iaW5hcnktb3BlcmF0b3IhIDpiaXQtb3IgOnwpXG4oaW5zdGFsbC1iaW5hcnktb3BlcmF0b3IhIDpiaXQteG9yIDpeKVxuKGluc3RhbGwtYmluYXJ5LW9wZXJhdG9yISA6Yml0LXNoaWZ0LWxlZnQgOjw8KVxuKGluc3RhbGwtYmluYXJ5LW9wZXJhdG9yISA6Yml0LXNoaWZ0LXJpZ2h0IDo+PilcbihpbnN0YWxsLWJpbmFyeS1vcGVyYXRvciEgOmJpdC1zaGlmdC1yaWdodC16ZXJvLWZpbGwgOj4+PilcblxuOzsgQXJpdGhtZXRpYyBvcGVyYXRvcnNcblxuKGRlZnVuIGluc3RhbGwtYXJpdGhtZXRpYy1vcGVyYXRvciFcbiAgKGNhbGxlZSBvcGVyYXRvciB2YWxpZD8gZmFsbGJhY2spXG5cbiAgKGRlZnVuIHdyaXRlLWJpbmFyeS1vcGVyYXRvclxuICAgIChsZWZ0IHJpZ2h0KVxuICAgIHs6dHlwZSA6QmluYXJ5RXhwcmVzc2lvblxuICAgICA6b3BlcmF0b3IgKG5hbWUgb3BlcmF0b3IpXG4gICAgIDpsZWZ0IGxlZnRcbiAgICAgOnJpZ2h0ICh3cml0ZSByaWdodCl9KVxuXG4gIChkZWZ1biB3cml0ZS1hcml0aG1ldGljLW9wZXJhdG9yXG4gICAgKCZyZXN0IHBhcmFtcylcbiAgICAobGV0KiAoKG4gKGNvdW50IHBhcmFtcykpKVxuICAgICAgKGNvbmQgKChhbmQgdmFsaWQ/IChub3QgKHZhbGlkPyBuKSkpIChlcnJvci1hcmctY291bnQgKG5hbWUgY2FsbGVlKSBuKSlcbiAgICAgICAgICAgICgoPT0gbiAwKSAod3JpdGUtbGl0ZXJhbCBmYWxsYmFjaykpXG4gICAgICAgICAgICAoKD09IG4gMSkgKHJlZHVjZSB3cml0ZS1iaW5hcnktb3BlcmF0b3JcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHdyaXRlLWxpdGVyYWwgZmFsbGJhY2spXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtcykpXG4gICAgICAgICAgICAoZWxzZSAocmVkdWNlIHdyaXRlLWJpbmFyeS1vcGVyYXRvclxuICAgICAgICAgICAgICAgICAgICAgICAgICAod3JpdGUgKGZpcnN0IHBhcmFtcykpXG4gICAgICAgICAgICAgICAgICAgICAgICAgIChyZXN0IHBhcmFtcykpKSkpKVxuXG5cbiAgKGluc3RhbGwtc3BlY2lhbCEgY2FsbGVlIHdyaXRlLWFyaXRobWV0aWMtb3BlcmF0b3IpKVxuXG4oaW5zdGFsbC1hcml0aG1ldGljLW9wZXJhdG9yISA6KyA6KyBuaWwgMClcbihpbnN0YWxsLWFyaXRobWV0aWMtb3BlcmF0b3IhIDotIDotIChsYW1iZGEgKCUpICg+PSAlIDEpKSAwKVxuKGluc3RhbGwtYXJpdGhtZXRpYy1vcGVyYXRvciEgOiogOiogbmlsIDEpXG4oaW5zdGFsbC1hcml0aG1ldGljLW9wZXJhdG9yISAoa2V5d29yZCBcXC8pIChrZXl3b3JkIFxcLykgKGxhbWJkYSAoJSkgKD49ICUgMSkpIDEpXG4oaW5zdGFsbC1hcml0aG1ldGljLW9wZXJhdG9yISA6cmVtIChrZXl3b3JkIFxcJSkgKGxhbWJkYSAoJSkgKD09ICUgMikpIDEpXG5cblxuOzsgQ29tcGFyaXNvbiBvcGVyYXRvcnNcblxuKGRlZnVuIGluc3RhbGwtY29tcGFyaXNvbi1vcGVyYXRvciFcbiAgKGNhbGxlZSBvcGVyYXRvciBmYWxsYmFjaylcbiAgXCJHZW5lcmF0ZXMgY29tcGFyaXNvbiBvcGVyYXRvciB3cml0ZXIgdGhhdCBnaXZlbiBvbmVcbiAgcGFyYW1ldGVyIHdyaXRlcyBgZmFsbGJhY2tgIGdpdmVuIHR3byBwYXJhbWV0ZXJzIHdyaXRlc1xuICBiaW5hcnkgZXhwcmVzc2lvbiBhbmQgZ2l2ZW4gbW9yZSBwYXJhbWV0ZXJzIHdyaXRlcyBiaW5hcnlcbiAgZXhwcmVzc2lvbnMgam9pbmVkIGJ5IGxvZ2ljYWwgYW5kLlwiXG5cbiAgOzsgVE9ETyAjNTRcbiAgOzsgQ29tcGFyaXNvbiBvcGVyYXRvcnMgbXVzdCB1c2UgdGVtcG9yYXJ5IHZhcmlhYmxlIHRvIHN0b3JlXG4gIDs7IGV4cHJlc3Npb24gbm9uIGxpdGVyYWwgYW5kIG5vbi1pZGVudGlmaWVycy5cbiAgKGRlZnVuIHdyaXRlLWNvbXBhcmlzb24tb3BlcmF0b3JcbiAgICAoJnJlc3QgYXJncylcbiAgICAobGV0KiAoKG4gKGNvdW50IGFyZ3MpKSlcbiAgICAgIChjb25kICgoaWRlbnRpY2FsPyBuIDApIChlcnJvci1hcmctY291bnQgY2FsbGVlIDApKVxuICAgICAgICAgICAgKChpZGVudGljYWw/IG4gMSkgKC0+c2VxdWVuY2UgWyh3cml0ZSAoZmlyc3QgYXJncykpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAod3JpdGUtbGl0ZXJhbCBmYWxsYmFjayldKSlcbiAgICAgICAgICAgICgoaWRlbnRpY2FsPyBuIDIpIHs6dHlwZSA6QmluYXJ5RXhwcmVzc2lvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOm9wZXJhdG9yIG9wZXJhdG9yXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6bGVmdCAod3JpdGUgKGZpcnN0IGFyZ3MpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnJpZ2h0ICh3cml0ZSAoc2Vjb25kIGFyZ3MpKX0pXG4gICAgICAgICAgICAoZWxzZSAobGV0KiAoKGxlZnQgKGZpcnN0IGFyZ3MpKVxuICAgICAgICAgICAgICAgICAgICAgICAgKHJpZ2h0IChzZWNvbmQgYXJncykpXG4gICAgICAgICAgICAgICAgICAgICAgICAobW9yZSAocmVzdCAocmVzdCBhcmdzKSkpKVxuICAgICAgICAgICAgICAgICAgICAocmVkdWNlIChsYW1iZGEgKGxlZnQgcmlnaHQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7OnR5cGUgOkxvZ2ljYWxFeHByZXNzaW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOm9wZXJhdG9yIDomJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpsZWZ0IGxlZnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6cmlnaHQgezp0eXBlIDpCaW5hcnlFeHByZXNzaW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6b3BlcmF0b3Igb3BlcmF0b3JcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpsZWZ0IChpZiAoPSA6TG9naWNhbEV4cHJlc3Npb24gKDp0eXBlIGxlZnQpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoOnJpZ2h0ICg6cmlnaHQgbGVmdCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICg6cmlnaHQgbGVmdCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6cmlnaHQgKHdyaXRlIHJpZ2h0KX19KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICh3cml0ZS1jb21wYXJpc29uLW9wZXJhdG9yIGxlZnQgcmlnaHQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9yZSkpKSkpKVxuXG4gIChpbnN0YWxsLXNwZWNpYWwhIGNhbGxlZSB3cml0ZS1jb21wYXJpc29uLW9wZXJhdG9yKSlcblxuKGluc3RhbGwtY29tcGFyaXNvbi1vcGVyYXRvciEgOj09IDo9PSB0cnVlKVxuKGluc3RhbGwtY29tcGFyaXNvbi1vcGVyYXRvciEgOj4gOj4gdHJ1ZSlcbihpbnN0YWxsLWNvbXBhcmlzb24tb3BlcmF0b3IhIDo+PSA6Pj0gdHJ1ZSlcbihpbnN0YWxsLWNvbXBhcmlzb24tb3BlcmF0b3IhIDo8IDo8IHRydWUpXG4oaW5zdGFsbC1jb21wYXJpc29uLW9wZXJhdG9yISA6PD0gOjw9IHRydWUpXG5cblxuKGRlZnVuIHdyaXRlLWlkZW50aWNhbD9cbiAgKCZyZXN0IHBhcmFtcylcbiAgOzsgVE9ETzogU3VibWl0IGEgYnVnIGZvciBjbG9qdXJlIHRvIGFsbG93IHZhcmlhZGljXG4gIDs7IG51bWJlciBvZiBwYXJhbXMgam9pbmVkIGJ5IGxvZ2ljYWwgYW5kLlxuICAoaWYgKGlkZW50aWNhbD8gKGNvdW50IHBhcmFtcykgMilcbiAgICB7OnR5cGUgOkJpbmFyeUV4cHJlc3Npb25cbiAgICAgOm9wZXJhdG9yIDo9PT1cbiAgICAgOmxlZnQgKHdyaXRlIChmaXJzdCBwYXJhbXMpKVxuICAgICA6cmlnaHQgKHdyaXRlIChzZWNvbmQgcGFyYW1zKSl9XG4gICAgKGVycm9yLWFyZy1jb3VudCA6aWRlbnRpY2FsPyAoY291bnQgcGFyYW1zKSkpKVxuKGluc3RhbGwtc3BlY2lhbCEgOmlkZW50aWNhbD8gd3JpdGUtaWRlbnRpY2FsPylcblxuKGRlZnVuIHdyaXRlLWluc3RhbmNlP1xuICAoJnJlc3QgcGFyYW1zKVxuICA7OyBUT0RPOiBTdWJtaXQgYSBidWcgZm9yIGNsb2p1cmUgdG8gbWFrZSBzdXJlIHRoYXRcbiAgOzsgaW5zdGFuY2U/IGVpdGhlciBhY2NlcHRzIG9ubHkgdHdvIGFyZ3Mgb3IgcmV0dXJuc1xuICA7OyB0cnVlIG9ubHkgaWYgYWxsIHRoZSBwYXJhbXMgYXJlIGluc3RhbmNlIG9mIHRoZVxuICA7OyBnaXZlbiB0eXBlLlxuXG4gIChsZXQqICgoY29uc3RydWN0b3IgKGZpcnN0IHBhcmFtcykpXG4gICAgICAgIChpbnN0YW5jZSAoc2Vjb25kIHBhcmFtcykpKVxuICAgIChpZiAoPCAoY291bnQgcGFyYW1zKSAxKVxuICAgICAgKGVycm9yLWFyZy1jb3VudCA6aW5zdGFuY2U/IChjb3VudCBwYXJhbXMpKVxuICAgICAgezp0eXBlIDpCaW5hcnlFeHByZXNzaW9uXG4gICAgICAgOm9wZXJhdG9yIDppbnN0YW5jZW9mXG4gICAgICAgOmxlZnQgKGlmIGluc3RhbmNlXG4gICAgICAgICAgICAgICAod3JpdGUgaW5zdGFuY2UpXG4gICAgICAgICAgICAgICAod3JpdGUtY29uc3RhbnQgaW5zdGFuY2UpKVxuICAgICAgIDpyaWdodCAod3JpdGUgY29uc3RydWN0b3IpfSkpKVxuKGluc3RhbGwtc3BlY2lhbCEgOmluc3RhbmNlPyB3cml0ZS1pbnN0YW5jZT8pXG5cblxuKGRlZnVuIGV4cGFuZC1hcHBseVxuICAoZiAmcmVzdCBwYXJhbXMpXG4gIChsZXQqICgocHJlZml4ICh2ZWMgKGJ1dGxhc3QgcGFyYW1zKSkpKVxuICAgIChpZiAoZW1wdHk/IHByZWZpeClcbiAgICAgIGAoLmFwcGx5ICxmIG5pbCAsQHBhcmFtcylcbiAgICAgIGAoLmFwcGx5ICxmIG5pbCAoLmNvbmNhdCAscHJlZml4ICwobGFzdCBwYXJhbXMpKSkpKSlcbihpbnN0YWxsLW1hY3JvISA6YXBwbHkgZXhwYW5kLWFwcGx5KVxuXG5cbihkZWZ1biBleHBhbmQtcHJpbnRcbiAgKCZmb3JtICZyZXN0IG1vcmUpXG4gIFwiUHJpbnRzIHRoZSBvYmplY3QocykgdG8gdGhlIG91dHB1dCBmb3IgaHVtYW4gY29uc3VtcHRpb24uXCJcbiAgKGxldCogKChvcCAod2l0aC1tZXRhICdjb25zb2xlLmxvZyAobWV0YSAmZm9ybSkpKSlcbiAgICBgKCxvcCAsQG1vcmUpKSlcbihpbnN0YWxsLW1hY3JvISA6cHJpbnQgKHdpdGgtbWV0YSBleHBhbmQtcHJpbnQgezppbXBsaWNpdCBbOiZmb3JtXX0pKVxuXG4oZGVmdW4gZXhwYW5kLXN0clxuICAoJnJlc3QgZm9ybXMpXG4gIFwic3RyIGlubGluaW5nIGFuZCBvcHRpbWl6YXRpb24gdmlhIG1hY3Jvc1wiXG4gIGAoKyBcIlwiICxAZm9ybXMpKVxuKGluc3RhbGwtbWFjcm8hIDpzdHIgZXhwYW5kLXN0cilcblxuKGRlZnVuIGV4cGFuZC1kZWJ1Z1xuICAoKVxuICAnZGVidWdnZXIpXG4oaW5zdGFsbC1tYWNybyEgOmRlYnVnZ2VyISBleHBhbmQtZGVidWcpXG5cbihkZWZ1biBleHBhbmQtYXNzZXJ0XG4gICh4ICZyZXN0IGFyZ3MpXG4gIFwiRXZhbHVhdGVzIGV4cHIgYW5kIHRocm93cyBhbiBleGNlcHRpb24gaWYgaXQgZG9lcyBub3QgZXZhbHVhdGUgdG9cbiAgICBsb2dpY2FsIHRydWUuXCJcbiAgKGxldCogKChtZXNzYWdlIChpZiAoZW1wdHk/IGFyZ3MpIFwiXCIgKGZpcnN0IGFyZ3MpKSlcbiAgICAgICAgKGZvcm0gKHByLXN0ciB4KSkpXG4gICAgYChpZiAobm90ICx4KVxuICAgICAgICh0aHJvdyAoRXJyb3IgKHN0ciBcIkFzc2VydCBmYWlsZWQ6IFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICxtZXNzYWdlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICxmb3JtKSkpKSkpXG4oaW5zdGFsbC1tYWNybyEgOmFzc2VydCBleHBhbmQtYXNzZXJ0KVxuXG5cbihkZWZ1biBleHBhbmQtdHlwZXN0ciAoaXQpXG4gIChsZXQqICgocHJlZml4IFwiW29iamVjdCBcIikgKHN1ZmZpeCBcIl1cIikpXG4gICAgYCgtPiAoLmNhbGwgT2JqZWN0LnByb3RvdHlwZS50by1zdHJpbmcgLGl0KVxuICAgICAgICAgKC5zbGljZSAsKGNvdW50IHByZWZpeCkgLCgtIChjb3VudCBzdWZmaXgpKSkpKSlcblxuKGRlZnVuIGV4cGFuZC1kZWZwcm90b2NvbFxuICAoJmVudiBpZCAmcmVzdCBmb3JtcylcbiAgKGxldCogKChucyAobmFtZSAoOm5hbWUgKDpucyAmZW52KSkpKVxuICAgICAgICAocHJvdG9jb2wtbmFtZSAobmFtZSBpZCkpXG4gICAgICAgIChwcm90b2NvbC1kb2MgKGlmIChzdHJpbmc/IChmaXJzdCBmb3JtcykpXG4gICAgICAgICAgICAgICAgICAgICAgIChmaXJzdCBmb3JtcykpKVxuICAgICAgICAocHJvdG9jb2wtbWV0aG9kcyAoaWYgcHJvdG9jb2wtZG9jXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAocmVzdCBmb3JtcylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1zKSlcbiAgICAgICAgKG5vdC1zdXBwb3J0ZWQgKGxhbWJkYSAobWV0aG9kKSBgKGxhbWJkYSAoJSkgKHRocm93IChzdHIgLChzdHIgXCJObyBwcm90b2NvbCBtZXRob2QgXCIgcHJvdG9jb2wtbmFtZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiLlwiIG1ldGhvZCBcIiBkZWZpbmVkIGZvciB0eXBlIFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICwoZXhwYW5kLXR5cGVzdHIgJyUpIFwiOiBcIiAlKSkpKSlcbiAgICAgICAgKHByb3RvY29sIChtYXB2IChsYW1iZGEgKG1ldGhvZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAobGV0KiAoKG1ldGhvZC1uYW1lIChmaXJzdCBtZXRob2QpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChpZCAoaWQtPm5zIChzdHIgbnMgXCIkXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvdG9jb2wtbmFtZSBcIiRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAobmFtZSBtZXRob2QtbmFtZSkpKSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB7OmlkIG1ldGhvZC1uYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZuIGAobGFtYmRhICxpZCAoc2VsZilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKC5hcHBseSAob3IgKGlmIChvciAoaWRlbnRpY2FsPyBzZWxmIG51bGwpIChpZGVudGljYWw/IHNlbGYgbmlsKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoLi1uaWwgLGlkKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChvciAoYWdldCBzZWxmICcsaWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChhZ2V0ICxpZCAsKGV4cGFuZC10eXBlc3RyICdzZWxmKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKC4tXyAsaWQpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLChub3Qtc3VwcG9ydGVkIChuYW1lIGlkKSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZiBhcmd1bWVudHMpKX0pKVxuICAgICAgICAgICAgICAgICAgICAgICBwcm90b2NvbC1tZXRob2RzKSlcbiAgICAgICAgKGZucyAobWFwIChsYW1iZGEgKGZvcm0pXG4gICAgICAgICAgICAgICAgICAgYChkZWZ2YXIgLCg6aWQgZm9ybSkgKGFnZXQgLGlkICcsKDppZCBmb3JtKSkpKVxuICAgICAgICAgICAgICAgICBwcm90b2NvbCkpXG4gICAgICAgIChzYXRpc2Z5IHs6d2lzcF9jb3JlJElQcm90b2NvbCRpZCAoc3RyIG5zIFwiL1wiIHByb3RvY29sLW5hbWUpfSlcbiAgICAgICAgKGJvZHkgKHJlZHVjZSAobGFtYmRhIChib2R5IG1ldGhvZClcbiAgICAgICAgICAgICAgICAgICAgICAgKGFzc29jIGJvZHkgKDppZCBtZXRob2QpICg6Zm4gbWV0aG9kKSkpXG4gICAgICAgICAgICAgICAgICAgICBzYXRpc2Z5XG4gICAgICAgICAgICAgICAgICAgICBwcm90b2NvbCkpKVxuICAgIGAoLCh3aXRoLW1ldGEgJ3Byb2duIHs6YmxvY2sgdHJ1ZX0pXG4gICAgICAgKGRlZnZhciAsaWQgLGJvZHkpXG4gICAgICAgLEBmbnNcbiAgICAgICAsaWQpKSlcbihpbnN0YWxsLW1hY3JvISA6ZGVmcHJvdG9jb2wgKHdpdGgtbWV0YSBleHBhbmQtZGVmcHJvdG9jb2wgezppbXBsaWNpdCBbOiZlbnZdfSkpXG5cbihkZWZ1biBleHBhbmQtZGVmdHlwZVxuICAoaWQgZmllbGRzICZyZXN0IGZvcm1zKVxuICAobGV0KiAoKHR5cGUtaW5pdCAobWFwIChsYW1iZGEgKGZpZWxkKSBgKHNldGYgKGFnZXQgdGhpcyAnLGZpZWxkKSAsZmllbGQpKVxuICAgICAgICAgICAgICAgICAgICAgICBmaWVsZHMpKVxuICAgICAgICAoY29uc3RydWN0b3IgKGNvbmogdHlwZS1pbml0ICd0aGlzKSlcbiAgICAgICAgKG1ldGhvZC1pbml0IChtYXAgKGxhbWJkYSAoZmllbGQpIGAoZGVmdmFyICxmaWVsZCAoYWdldCB0aGlzICcsZmllbGQpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZHMpKVxuICAgICAgICAobWFrZS1tZXRob2QgKGxhbWJkYSAocHJvdG9jb2wgZm9ybSlcbiAgICAgICAgICAgICAgICAgICAgICAobGV0KiAoKG1ldGhvZC1uYW1lIChmaXJzdCBmb3JtKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAocGFyYW1zIChzZWNvbmQgZm9ybSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGJvZHkgKHJlc3QgKHJlc3QgZm9ybSkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmaWVsZC1uYW1lIChpZiAoPSAobmFtZSBwcm90b2NvbCkgXCJPYmplY3RcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYChxdW90ZSAsbWV0aG9kLW5hbWUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGAoLi1uYW1lIChhZ2V0ICxwcm90b2NvbCAnLG1ldGhvZC1uYW1lKSkpKSlcblxuICAgICAgICAgICAgICAgICAgICAgICAgYChzZXRmIChhZ2V0ICguLXByb3RvdHlwZSAsaWQpICxmaWVsZC1uYW1lKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChsYW1iZGEgLHBhcmFtcyAsQG1ldGhvZC1pbml0ICxAYm9keSkpKSkpXG4gICAgICAgIChzYXRpc2Z5IChsYW1iZGEgKHByb3RvY29sKVxuICAgICAgICAgICAgICAgICAgYChzZXRmIChhZ2V0ICguLXByb3RvdHlwZSAsaWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKC4td2lzcF9jb3JlJElQcm90b2NvbCRpZCAscHJvdG9jb2wpKVxuICAgICAgICAgICAgICAgICAgICAgICAgIHRydWUpKSlcblxuICAgICAgICAoYm9keSAocmVkdWNlIChsYW1iZGEgKHR5cGUgZm9ybSlcbiAgICAgICAgICAgICAgICAgICAgICAgKGlmIChsaXN0PyBmb3JtKVxuICAgICAgICAgICAgICAgICAgICAgICAgIChjb25qIHR5cGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7OmJvZHkgKGNvbmogKDpib2R5IHR5cGUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChtYWtlLW1ldGhvZCAoOnByb3RvY29sIHR5cGUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JtKSl9KVxuICAgICAgICAgICAgICAgICAgICAgICAgIChjb25qIHR5cGUgezpwcm90b2NvbCBmb3JtXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmJvZHkgKGNvbmogKDpib2R5IHR5cGUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHNhdGlzZnkgZm9ybSkpfSkpKVxuXG4gICAgICAgICAgICAgICAgICAgICAgIHs6cHJvdG9jb2wgbmlsXG4gICAgICAgICAgICAgICAgICAgICAgICA6Ym9keSBbXX1cblxuICAgICAgICAgICAgICAgICAgICAgICBmb3JtcykpXG5cbiAgICAgICAgKG1ldGhvZHMgKDpib2R5IGJvZHkpKSlcbiAgICBgKGRlZnZhciAsaWQgKHByb2duXG4gICAgICAgKGRlZnVuLSAsaWQgLGZpZWxkcyAsQGNvbnN0cnVjdG9yKVxuICAgICAgICxAbWV0aG9kc1xuICAgICAgICxpZCkpKSlcbihpbnN0YWxsLW1hY3JvISA6ZGVmdHlwZSBleHBhbmQtZGVmdHlwZSlcbihpbnN0YWxsLW1hY3JvISA6ZGVmcmVjb3JkIGV4cGFuZC1kZWZ0eXBlKVxuXG4oZGVmdW4gZXhwYW5kLWV4dGVuZC10eXBlXG4gICh0eXBlICZyZXN0IGZvcm1zKVxuICAobGV0KiAoKGRlZmF1bHQtdHlwZT8gKD0gdHlwZSAnZGVmYXVsdCkpXG4gICAgICAgIChuaWwtdHlwZT8gKG5pbD8gdHlwZSkpXG5cbiAgICAgICAgKHR5cGUtbmFtZSAoY29uZCAoKG5pbD8gdHlwZSkgKHN5bWJvbCBcIm5pbFwiKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICgoPSB0eXBlICdkZWZhdWx0KSAnXylcbiAgICAgICAgICAgICAgICAgICAgICAgICgoPSB0eXBlICdudW1iZXIpICdOdW1iZXIpXG4gICAgICAgICAgICAgICAgICAgICAgICAoKD0gdHlwZSAnc3RyaW5nKSAnU3RyaW5nKVxuICAgICAgICAgICAgICAgICAgICAgICAgKCg9IHR5cGUgJ2Jvb2xlYW4pICdCb29sZWFuKVxuICAgICAgICAgICAgICAgICAgICAgICAgKCg9IHR5cGUgJ3ZlY3RvcikgJ0FycmF5KVxuICAgICAgICAgICAgICAgICAgICAgICAgKCg9IHR5cGUgJ2Z1bmN0aW9uKSAnRnVuY3Rpb24pXG4gICAgICAgICAgICAgICAgICAgICAgICAoKD0gdHlwZSAncmUtcGF0dGVybikgJ1JlZ0V4cClcbiAgICAgICAgICAgICAgICAgICAgICAgICgoPSAobmFtZXNwYWNlIHR5cGUpIFwianNcIikgdHlwZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIChlbHNlIG5pbCkpKVxuXG4gICAgICAgIChzYXRpc2Z5IChsYW1iZGEgKHByb3RvY29sKVxuICAgICAgICAgICAgICAgICAgKGlmIHR5cGUtbmFtZVxuICAgICAgICAgICAgICAgICAgICBgKHNldGYgKGFnZXQgLHByb3RvY29sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnLChzeW1ib2wgKHN0ciBcIndpc3BfY29yZSRJUHJvdG9jb2wkXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChuYW1lIHR5cGUtbmFtZSkpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRydWUpXG4gICAgICAgICAgICAgICAgICAgIGAoc2V0ZiAoYWdldCAoLi1wcm90b3R5cGUgLHR5cGUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoLi13aXNwX2NvcmUkSVByb3RvY29sJGlkICxwcm90b2NvbCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0cnVlKSkpKVxuXG4gICAgICAgIChtYWtlLW1ldGhvZCAobGFtYmRhIChwcm90b2NvbCBmb3JtKVxuICAgICAgICAgICAgICAgICAgICAgIChsZXQqICgobWV0aG9kLW5hbWUgKGZpcnN0IGZvcm0pKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChwYXJhbXMgKHNlY29uZCBmb3JtKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoYm9keSAocmVzdCAocmVzdCBmb3JtKSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKHRhcmdldCAoaWYgdHlwZS1uYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYChhZ2V0IChhZ2V0ICxwcm90b2NvbCAnLG1ldGhvZC1uYW1lKSAnLHR5cGUtbmFtZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgKGFnZXQgKC4tcHJvdG90eXBlICx0eXBlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoLi1uYW1lIChhZ2V0ICxwcm90b2NvbCAnLG1ldGhvZC1uYW1lKSkpKSkpXG4gICAgICAgICAgICAgICAgICAgICAgICBgKHNldGYgLHRhcmdldCAobGFtYmRhICxwYXJhbXMgLEBib2R5KSkpKSlcblxuICAgICAgICAoYm9keSAocmVkdWNlIChsYW1iZGEgKGJvZHkgZm9ybSlcbiAgICAgICAgICAgICAgICAgICAgICAgKGlmIChsaXN0PyBmb3JtKVxuICAgICAgICAgICAgICAgICAgICAgICAgIChjb25qIGJvZHlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Om1ldGhvZHMgKGNvbmogKDptZXRob2RzIGJvZHkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChtYWtlLW1ldGhvZCAoOnByb3RvY29sIGJvZHkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JtKSl9KVxuICAgICAgICAgICAgICAgICAgICAgICAgIChjb25qIGJvZHkgezpwcm90b2NvbCBmb3JtXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOm1ldGhvZHMgKGNvbmogKDptZXRob2RzIGJvZHkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHNhdGlzZnkgZm9ybSkpfSkpKVxuXG4gICAgICAgICAgICAgICAgICAgICAgIHs6cHJvdG9jb2wgbmlsXG4gICAgICAgICAgICAgICAgICAgICAgICA6bWV0aG9kcyBbXX1cblxuICAgICAgICAgICAgICAgICAgICAgICBmb3JtcykpXG4gICAgICAgIChtZXRob2RzICg6bWV0aG9kcyBib2R5KSkpXG4gICAgYChwcm9nbiAsQG1ldGhvZHMgbmlsKSkpXG4oaW5zdGFsbC1tYWNybyEgOmV4dGVuZC10eXBlIGV4cGFuZC1leHRlbmQtdHlwZSlcblxuKGRlZnVuIGV4cGFuZC1leHRlbmQtcHJvdG9jb2xcbiAgKHByb3RvY29sICZyZXN0IGZvcm1zKVxuICAobGV0KiAoKHNwZWNzIChyZWR1Y2UgKGxhbWJkYSAoc3BlY3MgZm9ybSlcbiAgICAgICAgICAgICAgICAgICAgICAgIChpZiAobGlzdD8gZm9ybSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKGNvbnMgezp0eXBlICg6dHlwZSAoZmlyc3Qgc3BlY3MpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOm1ldGhvZHMgKGNvbmogKDptZXRob2RzIChmaXJzdCBzcGVjcykpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JtKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHJlc3Qgc3BlY3MpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAoY29ucyB7OnR5cGUgZm9ybVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOm1ldGhvZHMgW119XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNwZWNzKSkpXG4gICAgICAgICAgICAgICAgICAgICAgbmlsXG4gICAgICAgICAgICAgICAgICAgICAgZm9ybXMpKVxuICAgICAgICAoYm9keSAobWFwIChsYW1iZGEgKGZvcm0pXG4gICAgICAgICAgICAgICAgICAgIGAoZXh0ZW5kLXR5cGUgLCg6dHlwZSBmb3JtKVxuICAgICAgICAgICAgICAgICAgICAgICAscHJvdG9jb2xcbiAgICAgICAgICAgICAgICAgICAgICAgLEAoOm1ldGhvZHMgZm9ybSlcbiAgICAgICAgICAgICAgICAgICAgICAgKSlcbiAgICAgICAgICAgICAgICAgIHNwZWNzKSkpXG5cblxuICAgIGAocHJvZ24gLEBib2R5IG5pbCkpKVxuKGluc3RhbGwtbWFjcm8hIDpleHRlbmQtcHJvdG9jb2wgZXhwYW5kLWV4dGVuZC1wcm90b2NvbClcblxuKGRlZnVuIGFzZXQtZXhwYW5kXG4gICh0YXJnZXQgZmllbGQgdGhpcmQgJnJlc3QgcmVzdC1hcmdzKVxuICAoaWYgKGVtcHR5PyByZXN0LWFyZ3MpXG4gICAgYChzZXRmIChhZ2V0ICx0YXJnZXQgLGZpZWxkKSAsdGhpcmQpXG4gICAgKGxldCogKChzdWItZmllbGRzJnZhbHVlIChjb25zIHRoaXJkIHJlc3QtYXJncykpXG4gICAgICAgICAgKHJlc29sdmVkLXRhcmdldCAocmVkdWNlIChsYW1iZGEgKGZvcm0gbm9kZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGAoYWdldCAsZm9ybSAsbm9kZSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYChhZ2V0ICx0YXJnZXQgLGZpZWxkKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChidXRsYXN0IHN1Yi1maWVsZHMmdmFsdWUpKSlcbiAgICAgICAgICAodmFsdWUgKGxhc3Qgc3ViLWZpZWxkcyZ2YWx1ZSkpKVxuICAgICAgYChzZXRmICxyZXNvbHZlZC10YXJnZXQgLHZhbHVlKSkpKVxuKGluc3RhbGwtbWFjcm8hIDphc2V0IGFzZXQtZXhwYW5kKVxuXG4oZGVmdW4gYWxlbmd0aC1leHBhbmRcbiAgKGFycmF5KVxuICBcIlJldHVybnMgdGhlIGxlbmd0aCBvZiB0aGUgYXJyYXkuIFdvcmtzIG9uIGFycmF5cyBvZiBhbGwgdHlwZXMuXCJcbiAgYCguLWxlbmd0aCAsYXJyYXkpKVxuKGluc3RhbGwtbWFjcm8hIDphbGVuZ3RoIGFsZW5ndGgtZXhwYW5kKVxuIl19
