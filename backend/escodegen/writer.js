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
    var some = wisp_sequence.some;
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
var isContainsAwait = exports.isContainsAwait = function isContainsAwait(node) {
    return isDictionary(node) ? (function () {
        return isEqual('AwaitExpression', (node || 0)['type']) || some(isContainsAwait, vals(node));
    })() : isVector(node) ? (function () {
        return some(isContainsAwait, node);
    })() : (function () {
        return null;
    })();
};
var toExpression = exports.toExpression = function toExpression() {
    var body = Array.prototype.slice.call(arguments, 0);
    return function () {
        var fnø1 = {
            'type': 'FunctionExpression',
            'id': null,
            'params': [],
            'expression': false,
            'generator': false,
            'body': toBlock(body)
        };
        var fnø2 = isContainsAwait(fnø1) ? conj(fnø1, { 'async': true }) : fnø1;
        var callø1 = {
            'type': 'CallExpression',
            'arguments': [],
            'loc': inheritLocation(body),
            'callee': toSequence([fnø2])
        };
        return (fnø2 || 0)['async'] ? {
            'type': 'AwaitExpression',
            'argument': callø1
        } : callø1;
    }.call(this);
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
    return function () {
        var fnø1 = {
            'type': 'FunctionExpression',
            'id': id,
            'params': [],
            'expression': false,
            'generator': false,
            'body': body
        };
        var fnø2 = isContainsAwait(body) ? conj(fnø1, { 'async': true }) : fnø1;
        var callø1 = {
            'type': 'CallExpression',
            'arguments': [{ 'type': 'ThisExpression' }],
            'callee': {
                'type': 'MemberExpression',
                'computed': false,
                'object': fnø2,
                'property': {
                    'type': 'Identifier',
                    'name': 'call'
                }
            }
        };
        return (fnø2 || 0)['async'] ? {
            'type': 'AwaitExpression',
            'argument': callø1
        } : callø1;
    }.call(this);
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
        return conj(baseø1, { 'async': isEqual((form || 0)['async'], true) }, (form || 0)['arrow'] ? {
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
var writeAwait = exports.writeAwait = function writeAwait(form) {
    return {
        'type': 'AwaitExpression',
        'argument': write((form || 0)['argument'])
    };
};
installWriter('await', writeAwait);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndpc3AvYmFja2VuZC9lc2NvZGVnZW4vd3JpdGVyLndpc3AiXSwibmFtZXMiOlsiX25zXyIsImlkIiwiZG9jIiwicmVhZEZyb21TdHJpbmciLCJtZXRhIiwid2l0aE1ldGEiLCJpc1N5bWJvbCIsInN5bWJvbCIsImlzS2V5d29yZCIsImtleXdvcmQiLCJuYW1lc3BhY2UiLCJpc1VucXVvdGUiLCJpc1VucXVvdGVTcGxpY2luZyIsImlzUXVvdGUiLCJpc1N5bnRheFF1b3RlIiwibmFtZSIsImdlbnN5bSIsInByU3RyIiwiaXNFbXB0eSIsImNvdW50IiwiaXNMaXN0IiwibGlzdCIsImZpcnN0Iiwic2Vjb25kIiwidGhpcmQiLCJyZXN0IiwiY29ucyIsImNvbmoiLCJidXRsYXN0IiwicmV2ZXJzZSIsInJlZHVjZSIsInZlYyIsImxhc3QiLCJtYXAiLCJtYXB2IiwiZmlsdGVyIiwidGFrZSIsImNvbmNhdCIsInBhcnRpdGlvbiIsInJlcGVhdCIsImludGVybGVhdmUiLCJhc3NvYyIsInNvbWUiLCJpc09kZCIsImlzRGljdGlvbmFyeSIsImRpY3Rpb25hcnkiLCJtZXJnZSIsImtleXMiLCJ2YWxzIiwiaXNDb250YWluc1ZlY3RvciIsIm1hcERpY3Rpb25hcnkiLCJpc1N0cmluZyIsImlzTnVtYmVyIiwiaXNWZWN0b3IiLCJpc0Jvb2xlYW4iLCJzdWJzIiwicmVGaW5kIiwiaXNUcnVlIiwiaXNGYWxzZSIsImlzTmlsIiwiaXNSZVBhdHRlcm4iLCJpbmMiLCJkZWMiLCJzdHIiLCJjaGFyIiwiaW50IiwiaXNFcXVhbCIsImlzU3RyaWN0RXF1YWwiLCJnZXQiLCJzcGxpdCIsImpvaW4iLCJ1cHBlckNhc2UiLCJyZXBsYWNlIiwidHJpbWwiLCJpbnN0YWxsTWFjcm8iLCJnZW5lcmF0ZSIsIl9fdW5pcXVlQ2hhcl9fIiwiZXhwb3J0cyIsInRvQ2FtZWxKb2luIiwicHJlZml4Iiwia2V5IiwidG9Qcml2YXRlUHJlZml4Iiwic3BhY2VEZWxpbWl0ZWTDuDEiLCJsZWZ0VHJpbW1lZMO4MSIsIm7DuDEiLCJ0cmFuc2xhdGVJZGVudGlmaWVyV29yZCIsImZvcm0iLCJpZMO4MSIsInRyYW5zbGF0ZUlkZW50aWZpZXIiLCJuc8O4MSIsImVycm9yQXJnQ291bnQiLCJjYWxsZWUiLCJuIiwiU3ludGF4RXJyb3IiLCJpbmhlcml0TG9jYXRpb24iLCJib2R5Iiwic3RhcnTDuDEiLCJlbmTDuDEiLCJ3cml0ZUxvY2F0aW9uIiwib3JpZ2luYWwiLCJkYXRhw7gxIiwiaW5oZXJpdGVkw7gxIiwiX193cml0ZXJzX18iLCJpbnN0YWxsV3JpdGVyIiwib3AiLCJ3cml0ZXIiLCJ3cml0ZU9wIiwid3JpdGVyw7gxIiwiX19zcGVjaWFsc19fIiwiaW5zdGFsbFNwZWNpYWwiLCJ3cml0ZVNwZWNpYWwiLCJ3cml0ZU5pbCIsIm51bGwiLCJ3cml0ZUxpdGVyYWwiLCJ3cml0ZUxpc3QiLCJ3cml0ZSIsIndyaXRlU3ltYm9sIiwid3JpdGVDb25zdGFudCIsIndyaXRlTnVtYmVyIiwidmFsdWVPZiIsIndyaXRlU3RyaW5nIiwiJCIsIndyaXRlS2V5d29yZCIsInRvSWRlbnRpZmllciIsIndyaXRlQmluZGluZ1ZhciIsImJhc2VJZMO4MSIsInJlc29sdmVkSWTDuDEiLCJ3cml0ZVZhciIsIm5vZGUiLCJ3cml0ZUludm9rZSIsIndyaXRlVmVjdG9yIiwid3JpdGVEaWN0aW9uYXJ5IiwicHJvcGVydGllc8O4MSIsInBhaXIiLCJrZXnDuDEiLCJ2YWx1ZcO4MSIsIndyaXRlRXhwb3J0Iiwid3JpdGVEZWYiLCJ3cml0ZUJpbmRpbmciLCJpbml0w7gxIiwid3JpdGVUaHJvdyIsInRvRXhwcmVzc2lvbiIsIndyaXRlTmV3Iiwid3JpdGVTZXQiLCJ3cml0ZUFnZXQiLCJfX3N0YXRlbWVudHNfXyIsIndyaXRlU3RhdGVtZW50IiwidG9TdGF0ZW1lbnQiLCJ0b1JldHVybiIsIndyaXRlQm9keSIsInN0YXRlbWVudHPDuDEiLCJyZXN1bHTDuDEiLCJ0b0Jsb2NrIiwiaXNDb250YWluc0F3YWl0IiwiZm7DuDEiLCJmbsO4MiIsImNhbGzDuDEiLCJ0b1NlcXVlbmNlIiwid3JpdGVEbyIsIndyaXRlSWYiLCJ3cml0ZVRyeSIsImhhbmRsZXLDuDEiLCJmaW5hbGl6ZXLDuDEiLCJ3cml0ZUJpbmRpbmdWYWx1ZSIsIndyaXRlQmluZGluZ1BhcmFtIiwid3JpdGVMZXQiLCJib2R5w7gxIiwidG9JaWZlIiwidG9SZWJpbmQiLCJiaW5kaW5nc8O4MSIsImV4cHJlc3Npb25zIiwidG9Mb29wSW5pdCIsInRvRG9XaGlsZSIsInRlc3QiLCJ0b1NldFJlY3VyIiwidG9Mb29wIiwid3JpdGVMb29wIiwibG9vcEJvZHnDuDEiLCJ0b1JlY3VyIiwicGFyYW1zw7gxIiwid3JpdGVSZWN1ciIsImZhbGxiYWNrT3ZlcmxvYWQiLCJzcGxpY2VCaW5kaW5nIiwid3JpdGVPdmVybG9hZGluZ1BhcmFtcyIsInBhcmFtcyIsImZvcm1zIiwicGFyYW0iLCJ3cml0ZU92ZXJsb2FkaW5nRm4iLCJvdmVybG9hZHPDuDEiLCJ3cml0ZUZuT3ZlcmxvYWQiLCJ3cml0ZVNpbXBsZUZuIiwibWV0aG9kw7gxIiwicmVzb2x2ZSIsImZyb20iLCJ0byIsInJlcXVpcmVyw7gxIiwicmVxdWlyZW1lbnTDuDEiLCJpc1JlbGF0aXZlw7gxIiwiZnJvbcO4MiIsInRvw7gyIiwiaWRUb05zIiwid3JpdGVSZXF1aXJlIiwicmVxdWlyZXIiLCJuc0JpbmRpbmfDuDEiLCJuc0FsaWFzw7gxIiwicmVmZXJlbmNlc8O4MSIsInJlZmVyZW5jZXMiLCJ3cml0ZU5zIiwibm9kZcO4MSIsInJlcXVpcmVtZW50c8O4MSIsIndyaXRlRm4iLCJiYXNlw7gxIiwid3JpdGVBd2FpdCIsIm9ww7gxIiwid3JpdGVfIiwiY29tcGlsZSIsImFyZ3MiLCJnZXRNYWNybyIsInRhcmdldCIsInByb3BlcnR5IiwiZGVmYXVsdF/DuDEiLCJpbnN0YWxsTG9naWNhbE9wZXJhdG9yIiwib3BlcmF0b3IiLCJmYWxsYmFjayIsIndyaXRlTG9naWNhbE9wZXJhdG9yIiwib3BlcmFuZHMiLCJsZWZ0IiwicmlnaHQiLCJpbnN0YWxsVW5hcnlPcGVyYXRvciIsImlzUHJlZml4Iiwid3JpdGVVbmFyeU9wZXJhdG9yIiwiaW5zdGFsbEJpbmFyeU9wZXJhdG9yIiwid3JpdGVCaW5hcnlPcGVyYXRvciIsImluc3RhbGxBcml0aG1ldGljT3BlcmF0b3IiLCJpc1ZhbGlkIiwid3JpdGVBcml0aG1ldGljT3BlcmF0b3IiLCJpbnN0YWxsQ29tcGFyaXNvbk9wZXJhdG9yIiwid3JpdGVDb21wYXJpc29uT3BlcmF0b3IiLCJsZWZ0w7gxIiwicmlnaHTDuDEiLCJtb3Jlw7gxIiwiaXNXcml0ZUlkZW50aWNhbCIsImlzV3JpdGVJbnN0YW5jZSIsImNvbnN0cnVjdG9yw7gxIiwiaW5zdGFuY2XDuDEiLCJleHBhbmRBcHBseSIsImYiLCJwcmVmaXjDuDEiLCJleHBhbmRQcmludCIsIl9hbmRGb3JtIiwibW9yZSIsImV4cGFuZFN0ciIsImV4cGFuZERlYnVnIiwiZXhwYW5kQXNzZXJ0IiwieCIsIm1lc3NhZ2XDuDEiLCJmb3Jtw7gxIiwiZXhwYW5kVHlwZXN0ciIsIml0Iiwic3VmZml4w7gxIiwiZXhwYW5kRGVmcHJvdG9jb2wiLCJfYW5kRW52IiwicHJvdG9jb2xOYW1lw7gxIiwicHJvdG9jb2xEb2PDuDEiLCJwcm90b2NvbE1ldGhvZHPDuDEiLCJub3RTdXBwb3J0ZWTDuDEiLCJtZXRob2QiLCJwcm90b2NvbMO4MSIsIm1ldGhvZE5hbWXDuDEiLCJpZMO4MiIsImZuc8O4MSIsInNhdGlzZnnDuDEiLCJleHBhbmREZWZ0eXBlIiwiZmllbGRzIiwidHlwZUluaXTDuDEiLCJmaWVsZCIsIm1ldGhvZEluaXTDuDEiLCJtYWtlTWV0aG9kw7gxIiwicHJvdG9jb2wiLCJmaWVsZE5hbWXDuDEiLCJ0eXBlIiwibWV0aG9kc8O4MSIsImV4cGFuZEV4dGVuZFR5cGUiLCJpc0RlZmF1bHRUeXBlw7gxIiwiaXNOaWxUeXBlw7gxIiwidHlwZU5hbWXDuDEiLCJ0YXJnZXTDuDEiLCJleHBhbmRFeHRlbmRQcm90b2NvbCIsInNwZWNzw7gxIiwic3BlY3MiLCJhc2V0RXhwYW5kIiwicmVzdEFyZ3MiLCJzdWJGaWVsZHNBbmRWYWx1ZcO4MSIsInJlc29sdmVkVGFyZ2V0w7gxIiwiYWxlbmd0aEV4cGFuZCIsImFycmF5Il0sIm1hcHBpbmdzIjoiO0lBQUEsSUFBQ0EsSSxHQUFEO0FBQUEsUUFBQUMsRSxFQUFJLCtCQUFKO0FBQUEsUUFBQUMsRyxFQUFBO0FBQUEsTTs7UUFDaUNDLGNBQUEsRyxZQUFBQSxjOztRQUNIQyxJQUFBLEcsU0FBQUEsSTtRQUFLQyxRQUFBLEcsU0FBQUEsUTtRQUFVQyxRQUFBLEcsU0FBQUEsUTtRQUFRQyxNQUFBLEcsU0FBQUEsTTtRQUFPQyxTQUFBLEcsU0FBQUEsUztRQUFTQyxPQUFBLEcsU0FBQUEsTztRQUN2Q0MsU0FBQSxHLFNBQUFBLFM7UUFBVUMsU0FBQSxHLFNBQUFBLFM7UUFBU0MsaUJBQUEsRyxTQUFBQSxpQjtRQUFrQkMsT0FBQSxHLFNBQUFBLE87UUFDckNDLGFBQUEsRyxTQUFBQSxhO1FBQWNDLElBQUEsRyxTQUFBQSxJO1FBQUtDLE1BQUEsRyxTQUFBQSxNO1FBQU9DLEtBQUEsRyxTQUFBQSxLOztRQUNyQkMsT0FBQSxHLGNBQUFBLE87UUFBT0MsS0FBQSxHLGNBQUFBLEs7UUFBTUMsTUFBQSxHLGNBQUFBLE07UUFBTUMsSUFBQSxHLGNBQUFBLEk7UUFBS0MsS0FBQSxHLGNBQUFBLEs7UUFBTUMsTUFBQSxHLGNBQUFBLE07UUFBT0MsS0FBQSxHLGNBQUFBLEs7UUFDckNDLElBQUEsRyxjQUFBQSxJO1FBQUtDLElBQUEsRyxjQUFBQSxJO1FBQUtDLElBQUEsRyxjQUFBQSxJO1FBQUtDLE9BQUEsRyxjQUFBQSxPO1FBQVFDLE9BQUEsRyxjQUFBQSxPO1FBQVFDLE1BQUEsRyxjQUFBQSxNO1FBQU9DLEdBQUEsRyxjQUFBQSxHO1FBQ3RDQyxJQUFBLEcsY0FBQUEsSTtRQUFLQyxHQUFBLEcsY0FBQUEsRztRQUFJQyxJQUFBLEcsY0FBQUEsSTtRQUFLQyxNQUFBLEcsY0FBQUEsTTtRQUFPQyxJQUFBLEcsY0FBQUEsSTtR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QUFBLEMsVUFBVUEsSyxFQUFaO0FBQUEsQ0FIRixDO0FBSUM3TixZQUFELEMsU0FBQSxFQUF5QjROLGFBQXpCIiwic291cmNlc0NvbnRlbnQiOlsiKG5zIHdpc3AuYmFja2VuZC5lc2NvZGVnZW4ud3JpdGVyXG4gICg6cmVxdWlyZSBbd2lzcC5yZWFkZXIgOnJlZmVyIFtyZWFkLWZyb20tc3RyaW5nXV1cbiAgICAgICAgICAgIFt3aXNwLmFzdCA6cmVmZXIgW21ldGEgd2l0aC1tZXRhIHN5bWJvbD8gc3ltYm9sIGtleXdvcmQ/IGtleXdvcmRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWVzcGFjZSB1bnF1b3RlPyB1bnF1b3RlLXNwbGljaW5nPyBxdW90ZT9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN5bnRheC1xdW90ZT8gbmFtZSBnZW5zeW0gcHItc3RyXV1cbiAgICAgICAgICAgIFt3aXNwLnNlcXVlbmNlIDpyZWZlciBbZW1wdHk/IGNvdW50IGxpc3Q/IGxpc3QgZmlyc3Qgc2Vjb25kIHRoaXJkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3QgY29ucyBjb25qIGJ1dGxhc3QgcmV2ZXJzZSByZWR1Y2UgdmVjXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3QgbWFwIG1hcHYgZmlsdGVyIHRha2UgY29uY2F0IHBhcnRpdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXBlYXQgaW50ZXJsZWF2ZSBhc3NvYyBzb21lXV1cbiAgICAgICAgICAgIFt3aXNwLnJ1bnRpbWUgOnJlZmVyIFtvZGQ/IGRpY3Rpb25hcnk/IGRpY3Rpb25hcnkgbWVyZ2Uga2V5cyB2YWxzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGFpbnMtdmVjdG9yPyBtYXAtZGljdGlvbmFyeSBzdHJpbmc/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVtYmVyPyB2ZWN0b3I/IGJvb2xlYW4/IHN1YnMgcmUtZmluZCB0cnVlP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhbHNlPyBuaWw/IHJlLXBhdHRlcm4/IGluYyBkZWMgc3RyIGNoYXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnQgPSA9PSBnZXRdXVxuICAgICAgICAgICAgW3dpc3Auc3RyaW5nIDpyZWZlciBbc3BsaXQgam9pbiB1cHBlci1jYXNlIHJlcGxhY2UgdHJpbWxdXVxuICAgICAgICAgICAgW3dpc3AuZXhwYW5kZXIgOnJlZmVyIFtpbnN0YWxsLW1hY3JvIV1dXG4gICAgICAgICAgICBbZXNjb2RlZ2VuIDpyZWZlciBbZ2VuZXJhdGVdXSkpXG5cblxuOzsgRGVmaW5lIGNoYXJhY3RlciB0aGF0IGlzIHZhbGlkIEpTIGlkZW50aWZpZXIgdGhhdCB3aWxsXG47OyBiZSB1c2VkIGluIGdlbmVyYXRlZCBzeW1ib2xzIHRvIGF2b2lkIGNvbmZsaWN0c1xuOzsgaHR0cDovL3d3dy5maWxlZm9ybWF0LmluZm8vaW5mby91bmljb2RlL2NoYXIvZjgvaW5kZXguaHRtXG4oZGVmdmFyICoqdW5pcXVlLWNoYXIqKiBcIsO4XCIpXG5cbihkZWZ1biAtPmNhbWVsLWpvaW5cbiAgKHByZWZpeCBrZXkpXG4gIFwiVGFrZXMgZGFzaCBkZWxpbWl0ZWQgbmFtZSBcIlxuICAoc3RyIHByZWZpeFxuICAgICAgIChpZiAoYW5kIChub3QgKGVtcHR5PyBwcmVmaXgpKVxuICAgICAgICAgICAgICAgIChub3QgKGVtcHR5PyBrZXkpKSlcbiAgICAgICAgIChzdHIgKHVwcGVyLWNhc2UgKGdldCBrZXkgMCkpIChzdWJzIGtleSAxKSlcbiAgICAgICAgIGtleSkpKVxuXG4oZGVmdW4gLT5wcml2YXRlLXByZWZpeFxuICAoaWQpXG4gIFwiVHJhbnNsYXRlIHByaXZhdGUgaWRlbnRpZmllcnMgbGlrZSAtZm9vIHRvIGEgSlMgZXF1aXZhbGVudFxuICBmb3JtcyBsaWtlIF9mb29cIlxuICAobGV0KiAoKHNwYWNlLWRlbGltaXRlZCAoam9pbiBcIiBcIiAoc3BsaXQgaWQgI1wiLVwiKSkpXG4gICAgICAgIChsZWZ0LXRyaW1tZWQgKHRyaW1sIHNwYWNlLWRlbGltaXRlZCkpXG4gICAgICAgIChuICgtIChjb3VudCBpZCkgKGNvdW50IGxlZnQtdHJpbW1lZCkpKSlcbiAgICAoaWYgKD4gbiAwKVxuICAgICAgKHN0ciAoam9pbiBcIl9cIiAocmVwZWF0IChpbmMgbikgXCJcIikpIChzdWJzIGlkIG4pKVxuICAgICAgaWQpKSlcblxuXG4oZGVmdW4gdHJhbnNsYXRlLWlkZW50aWZpZXItd29yZFxuICAoZm9ybSlcbiAgXCJUcmFuc2xhdGVzIHJlZmVyZW5jZXMgZnJvbSBjbG9qdXJlIGNvbnZlbnRpb24gdG8gSlM6XG5cbiAgKiptYWNyb3MqKiAgICAgIF9fbWFjcm9zX19cbiAgbGlzdC0+dmVjdG9yICAgIGxpc3RUb1ZlY3RvclxuICBzZXQhICAgICAgICAgICAgc2V0XG4gIGZvb19iYXIgICAgICAgICBmb29fYmFyXG4gIG51bWJlcj8gICAgICAgICBpc051bWJlclxuICByZWQ9ICAgICAgICAgICAgcmVkRXF1YWxcbiAgY3JlYXRlLXNlcnZlciAgIGNyZWF0ZVNlcnZlclwiXG4gIChsZXQqICgoaWQgKG5hbWUgZm9ybSkpKVxuICAgIChzZXRxIGlkIChjb25kICgoaWRlbnRpY2FsPyBpZCAgXCIqXCIpIFwibXVsdGlwbHlcIilcbiAgICAgICAgICAgICAgICAgICAoKGlkZW50aWNhbD8gaWQgXCIvXCIpIFwiZGl2aWRlXCIpXG4gICAgICAgICAgICAgICAgICAgKChpZGVudGljYWw/IGlkIFwiK1wiKSBcInN1bVwiKVxuICAgICAgICAgICAgICAgICAgICgoaWRlbnRpY2FsPyBpZCBcIi1cIikgXCJzdWJ0cmFjdFwiKVxuICAgICAgICAgICAgICAgICAgICgoaWRlbnRpY2FsPyBpZCBcIj1cIikgXCJlcXVhbD9cIilcbiAgICAgICAgICAgICAgICAgICAoKGlkZW50aWNhbD8gaWQgXCI9PVwiKSBcInN0cmljdC1lcXVhbD9cIilcbiAgICAgICAgICAgICAgICAgICAoKGlkZW50aWNhbD8gaWQgXCI8PVwiKSBcIm5vdC1ncmVhdGVyLXRoYW5cIilcbiAgICAgICAgICAgICAgICAgICAoKGlkZW50aWNhbD8gaWQgXCI+PVwiKSBcIm5vdC1sZXNzLXRoYW5cIilcbiAgICAgICAgICAgICAgICAgICAoKGlkZW50aWNhbD8gaWQgXCI+XCIpIFwiZ3JlYXRlci10aGFuXCIpXG4gICAgICAgICAgICAgICAgICAgKChpZGVudGljYWw/IGlkIFwiPFwiKSBcImxlc3MtdGhhblwiKVxuICAgICAgICAgICAgICAgICAgICgoaWRlbnRpY2FsPyBpZCBcIi0+XCIpIFwidGhyZWFkLWZpcnN0XCIpXG4gICAgICAgICAgICAgICAgICAgKGVsc2UgaWQpKSlcblxuICAgIDs7ICoqbWFjcm9zKiogLT4gIF9fbWFjcm9zX19cbiAgICAoc2V0cSBpZCAoam9pbiBcIl9cIiAoc3BsaXQgaWQgXCIqXCIpKSlcbiAgICA7OyBmb28uYmFyIC0+IGZvb19iYXJcbiAgICAoc2V0cSBpZCAoam9pbiBcIl9cIiAoc3BsaXQgaWQgXCIuXCIpKSlcbiAgICA7OyBsaXN0LT52ZWN0b3IgLT4gIGxpc3RUb1ZlY3RvclxuICAgIChzZXRxIGlkIChpZiAoaWRlbnRpY2FsPyAoc3VicyBpZCAwIDIpIFwiLT5cIilcbiAgICAgICAgICAgICAgIChzdWJzIChqb2luIFwiLXRvLVwiIChzcGxpdCBpZCBcIi0+XCIpKSAxKVxuICAgICAgICAgICAgICAgKGpvaW4gXCItdG8tXCIgKHNwbGl0IGlkIFwiLT5cIikpKSlcbiAgICA7OyBzZXQhIC0+ICBzZXRcbiAgICAoc2V0cSBpZCAoam9pbiAoc3BsaXQgaWQgXCIhXCIpKSlcbiAgICAoc2V0cSBpZCAoam9pbiBcIiRcIiAoc3BsaXQgaWQgXCIlXCIpKSlcbiAgICAoc2V0cSBpZCAoam9pbiBcIi1lcXVhbC1cIiAoc3BsaXQgaWQgXCI9XCIpKSlcbiAgICA7OyBmb289IC0+IGZvb0VxdWFsXG4gICAgOyhzZXRxIGlkIChqb2luIFwiLWVxdWFsLVwiIChzcGxpdCBpZCBcIj1cIikpKVxuICAgIDs7IGZvbytiYXIgLT4gZm9vUGx1c0JhclxuICAgIChzZXRxIGlkIChqb2luIFwiLXBsdXMtXCIgKHNwbGl0IGlkIFwiK1wiKSkpXG4gICAgKHNldHEgaWQgKGpvaW4gXCItYW5kLVwiIChzcGxpdCBpZCBcIiZcIikpKVxuICAgIDs7IG51bWJlcj8gLT4gaXNOdW1iZXJcbiAgICAoc2V0cSBpZCAoaWYgKGlkZW50aWNhbD8gKGxhc3QgaWQpIFwiP1wiKVxuICAgICAgICAgICAgICAgKHN0ciBcImlzLVwiIChzdWJzIGlkIDAgKGRlYyAoY291bnQgaWQpKSkpXG4gICAgICAgICAgICAgICBpZCkpXG4gICAgOzsgLWZvbyAtPiBfZm9vXG4gICAgKHNldHEgaWQgKC0+cHJpdmF0ZS1wcmVmaXggaWQpKVxuICAgIDs7IGNyZWF0ZS1zZXJ2ZXIgLT4gY3JlYXRlU2VydmVyXG4gICAgKHNldHEgaWQgKHJlZHVjZSAtPmNhbWVsLWpvaW4gXCJcIiAoc3BsaXQgaWQgXCItXCIpKSlcblxuICAgIDs7IHJlc2lkdWFsIHN3ZWVwOiB0aGUgc3VnYXIgYWJvdmUgb25seSByZXdyaXRlcyBgP2AvYD5gL2A8YC9gL2AgaW4gc3BlY2lmaWNcbiAgICA7OyBwb3NpdGlvbnMgKGEgdHJhaWxpbmcgYD9gLCBvciB0aGUgY2hhciBzdGFuZGluZyBhbG9uZSkuIEFueXRoaW5nIGxlZnQgb3ZlclxuICAgIDs7IC0tIGB4P3lgLCBgP2Zvb2AsIGBhPmJgIC0tIGlzIHN0aWxsIGFuIGludmFsaWQgSlMgaWRlbnRpZmllciwgc28gbWFwIGVhY2hcbiAgICA7OyBzdXJ2aXZpbmcgY2hhcmFjdGVyIHRvIGEgQ2xvanVyZVNjcmlwdC1zdHlsZSBtdW5nZSBmcmFnbWVudC5cbiAgICAoc2V0cSBpZCAoam9pbiBcIl9RTUFSS19cIiAoc3BsaXQgaWQgXCI/XCIpKSlcbiAgICAoc2V0cSBpZCAoam9pbiBcIl9HVF9cIiAoc3BsaXQgaWQgXCI+XCIpKSlcbiAgICAoc2V0cSBpZCAoam9pbiBcIl9MVF9cIiAoc3BsaXQgaWQgXCI8XCIpKSlcbiAgICAoc2V0cSBpZCAoam9pbiBcIl9TTEFTSF9cIiAoc3BsaXQgaWQgXCIvXCIpKSlcblxuICAgIGlkKSlcblxuKGRlZnVuIHRyYW5zbGF0ZS1pZGVudGlmaWVyXG4gIChmb3JtKVxuICAobGV0KiAoKG5zIChuYW1lc3BhY2UgZm9ybSkpKVxuICAgIChzdHIgKGlmIChhbmQgbnMgKG5vdCAoPSBucyBcImpzXCIpKSlcbiAgICAgICAgICAgKHN0ciAodHJhbnNsYXRlLWlkZW50aWZpZXItd29yZCAobmFtZXNwYWNlIGZvcm0pKSBcIi5cIilcbiAgICAgICAgICAgXCJcIilcbiAgICAgICAgIChqb2luIFxcLiAobWFwIHRyYW5zbGF0ZS1pZGVudGlmaWVyLXdvcmQgKHNwbGl0IChuYW1lIGZvcm0pIFxcLikpKSkpKVxuXG4oZGVmdW4gZXJyb3ItYXJnLWNvdW50XG4gIChjYWxsZWUgbilcbiAgKHRocm93IChTeW50YXhFcnJvciAoc3RyIFwiV3JvbmcgbnVtYmVyIG9mIGFyZ3VtZW50cyAoXCIgbiBcIikgcGFzc2VkIHRvOiBcIiBjYWxsZWUpKSkpXG5cbihkZWZ1biBpbmhlcml0LWxvY2F0aW9uXG4gIChib2R5KVxuICAobGV0KiAoKHN0YXJ0ICg6c3RhcnQgKDpsb2MgKGZpcnN0IGJvZHkpKSkpXG4gICAgICAgIChlbmQgKDplbmQgKDpsb2MgKGxhc3QgYm9keSkpKSkpXG4gICAgKGlmIChub3QgKG9yIChuaWw/IHN0YXJ0KSAobmlsPyBlbmQpKSlcbiAgICAgIHs6c3RhcnQgc3RhcnQgOmVuZCBlbmR9KSkpXG5cblxuKGRlZnVuIHdyaXRlLWxvY2F0aW9uXG4gIChmb3JtIG9yaWdpbmFsKVxuICAobGV0KiAoKGRhdGEgKG1ldGEgZm9ybSkpXG4gICAgICAgIChpbmhlcml0ZWQgKG1ldGEgb3JpZ2luYWwpKVxuICAgICAgICAoc3RhcnQgKG9yICg6c3RhcnQgZm9ybSkgKDpzdGFydCBkYXRhKSAoOnN0YXJ0IGluaGVyaXRlZCkpKVxuICAgICAgICAoZW5kIChvciAoOmVuZCBmb3JtKSAoOmVuZCBkYXRhKSAoOmVuZCBpbmhlcml0ZWQpKSkpXG4gICAgKGlmIChub3QgKG5pbD8gc3RhcnQpKVxuICAgICAgezpsb2MgezpzdGFydCB7OmxpbmUgKGluYyAoOmxpbmUgc3RhcnQgLTEpKVxuICAgICAgICAgICAgICAgICAgICAgOmNvbHVtbiAoOmNvbHVtbiBzdGFydCAtMSl9XG4gICAgICAgICAgICAgOmVuZCB7OmxpbmUgKGluYyAoOmxpbmUgZW5kIC0xKSlcbiAgICAgICAgICAgICAgICAgICA6Y29sdW1uICg6Y29sdW1uIGVuZCAtMSl9fX1cbiAgICAgIHt9KSkpXG5cbihkZWZ2YXIgKip3cml0ZXJzKioge30pXG4oZGVmdW4gaW5zdGFsbC13cml0ZXIhXG4gIChvcCB3cml0ZXIpXG4gIChzZXRmIChnZXQgKip3cml0ZXJzKiogb3ApIHdyaXRlcikpXG5cbihkZWZ1biB3cml0ZS1vcFxuICAob3AgZm9ybSlcbiAgKGxldCogKCh3cml0ZXIgKGdldCAqKndyaXRlcnMqKiBvcCkpKVxuICAgIChhc3NlcnQgd3JpdGVyIChzdHIgXCJVbnN1cHBvcnRlZCBvcGVyYXRpb246IFwiIG9wKSlcbiAgICAoY29uaiAod3JpdGUtbG9jYXRpb24gKDpmb3JtIGZvcm0pICg6b3JpZ2luYWwtZm9ybSBmb3JtKSlcbiAgICAgICAgICAod3JpdGVyIGZvcm0pKSkpXG5cbihkZWZ2YXIgKipzcGVjaWFscyoqIHt9KVxuKGRlZnVuIGluc3RhbGwtc3BlY2lhbCFcbiAgKG9wIHdyaXRlcilcbiAgKHNldGYgKGdldCAqKnNwZWNpYWxzKiogKG5hbWUgb3ApKSB3cml0ZXIpKVxuXG4oZGVmdW4gd3JpdGUtc3BlY2lhbFxuICAod3JpdGVyIGZvcm0pXG4gIChjb25qICh3cml0ZS1sb2NhdGlvbiAoOmZvcm0gZm9ybSkgKDpvcmlnaW5hbC1mb3JtIGZvcm0pKVxuICAgICAgICAoYXBwbHkgd3JpdGVyICg6cGFyYW1zIGZvcm0pKSkpXG5cblxuKGRlZnVuIHdyaXRlLW5pbFxuICAoZm9ybSlcbiAgezp0eXBlIDpMaXRlcmFsXG4gICA6dmFsdWUgbnVsbH0pXG4oaW5zdGFsbC13cml0ZXIhIDpuaWwgd3JpdGUtbmlsKVxuXG4oZGVmdW4gd3JpdGUtbGl0ZXJhbFxuICAoZm9ybSlcbiAgezp0eXBlIDpMaXRlcmFsXG4gICA6dmFsdWUgZm9ybX0pXG5cbihkZWZ1biB3cml0ZS1saXN0XG4gIChmb3JtKVxuICB7OnR5cGUgOkNhbGxFeHByZXNzaW9uXG4gICA6Y2FsbGVlICh3cml0ZSB7Om9wIDp2YXJcbiAgICAgICAgICAgICAgICAgICA6Zm9ybSAnbGlzdH0pXG4gICA6YXJndW1lbnRzIChtYXAgd3JpdGUgKDppdGVtcyBmb3JtKSl9KVxuKGluc3RhbGwtd3JpdGVyISA6bGlzdCB3cml0ZS1saXN0KVxuXG4oZGVmdW4gd3JpdGUtc3ltYm9sXG4gIChmb3JtKVxuICB7OnR5cGUgOkNhbGxFeHByZXNzaW9uXG4gICA6Y2FsbGVlICh3cml0ZSB7Om9wIDp2YXJcbiAgICAgICAgICAgICAgICAgICA6Zm9ybSAnc3ltYm9sfSlcbiAgIDphcmd1bWVudHMgWyh3cml0ZS1jb25zdGFudCAoOm5hbWVzcGFjZSBmb3JtKSlcbiAgICAgICAgICAgICAgICh3cml0ZS1jb25zdGFudCAoOm5hbWUgZm9ybSkpXX0pXG4oaW5zdGFsbC13cml0ZXIhIDpzeW1ib2wgd3JpdGUtc3ltYm9sKVxuXG4oZGVmdW4gd3JpdGUtY29uc3RhbnRcbiAgKGZvcm0pXG4gIChjb25kICgobmlsPyBmb3JtKSAod3JpdGUtbmlsIGZvcm0pKVxuICAgICAgICAoKGtleXdvcmQ/IGZvcm0pICh3cml0ZS1saXRlcmFsIChpZiAobmFtZXNwYWNlIGZvcm0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChzdHIgKG5hbWVzcGFjZSBmb3JtKSBcIi9cIiAobmFtZSBmb3JtKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG5hbWUgZm9ybSkpKSlcbiAgICAgICAgKChudW1iZXI/IGZvcm0pICh3cml0ZS1udW1iZXIgKC52YWx1ZU9mIGZvcm0pKSlcbiAgICAgICAgKChzdHJpbmc/IGZvcm0pICh3cml0ZS1zdHJpbmcgZm9ybSkpXG4gICAgICAgIChlbHNlICh3cml0ZS1saXRlcmFsIGZvcm0pKSkpXG4oaW5zdGFsbC13cml0ZXIhIDpjb25zdGFudCAobGFtYmRhICglKSAod3JpdGUtY29uc3RhbnQgKDpmb3JtICUpKSkpXG5cbihkZWZ1biB3cml0ZS1zdHJpbmdcbiAgKGZvcm0pXG4gIHs6dHlwZSA6TGl0ZXJhbFxuICAgOnZhbHVlIChzdHIgZm9ybSl9KVxuXG4oZGVmdW4gd3JpdGUtbnVtYmVyXG4gIChmb3JtKVxuICAoaWYgKDwgZm9ybSAwKVxuICAgIHs6dHlwZSA6VW5hcnlFeHByZXNzaW9uXG4gICAgIDpvcGVyYXRvciA6LVxuICAgICA6cHJlZml4IHRydWVcbiAgICAgOmFyZ3VtZW50ICh3cml0ZS1udW1iZXIgKCogZm9ybSAtMSkpfVxuICAgICh3cml0ZS1saXRlcmFsIGZvcm0pKSlcblxuKGRlZnVuIHdyaXRlLWtleXdvcmRcbiAgKGZvcm0pXG4gIHs6dHlwZSA6TGl0ZXJhbFxuICAgOnZhbHVlICg6Zm9ybSBmb3JtKX0pXG4oaW5zdGFsbC13cml0ZXIhIDprZXl3b3JkIHdyaXRlLWtleXdvcmQpXG5cbihkZWZ1biAtPmlkZW50aWZpZXJcbiAgKGZvcm0pXG4gIHs6dHlwZSA6SWRlbnRpZmllclxuICAgOm5hbWUgKHRyYW5zbGF0ZS1pZGVudGlmaWVyIGZvcm0pfSlcblxuKGRlZnVuIHdyaXRlLWJpbmRpbmctdmFyXG4gIChmb3JtKVxuICA7OyBJZiBpZGVudGlmaWVycyBiaW5kaW5nIHNoYWRvd3Mgb3RoZXIgYmluZGluZyByZW5hbWUgaXQgYWNjb3JkaW5nXG4gIDs7IHRvIHNoYWRvd2luZyBkZXB0aC4gVGhpcyBhbGxvd3MgYmluZGluZ3MgaW5pdGlhbGl6ZXIgc2FmZWx5XG4gIDs7IGFjY2VzcyBiaW5kaW5nIGJlZm9yZSBzaGFkb3dpbmcgaXQuXG4gIChsZXQqICgoYmFzZS1pZCAoOmlkIGZvcm0pKVxuICAgICAgICAocmVzb2x2ZWQtaWQgKGlmICg6c2hhZG93IGZvcm0pXG4gICAgICAgICAgICAgICAgICAgICAgKHN5bWJvbCBuaWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChzdHIgKHRyYW5zbGF0ZS1pZGVudGlmaWVyIGJhc2UtaWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICoqdW5pcXVlLWNoYXIqKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoOmRlcHRoIGZvcm0pKSlcbiAgICAgICAgICAgICBiYXNlLWlkKSkpXG4gICAgKGNvbmogKC0+aWRlbnRpZmllciByZXNvbHZlZC1pZClcbiAgICAgICAgICAod3JpdGUtbG9jYXRpb24gYmFzZS1pZCkpKSlcblxuKGRlZnVuIHdyaXRlLXZhclxuICAobm9kZSlcbiAgXCJoYW5kbGVyIGZvciB7Om9wIDp2YXJ9IHR5cGUgZm9ybXMuIFN1Y2ggZm9ybXMgbWF5XG4gIHJlcHJlc2VudCByZWZlcmVuY2VzIGluIHdoaWNoIGNhc2UgdGhleSBoYXZlIDppbmZvXG4gIHBvaW50aW5nIHRvIGEgZGVjbGFyYXRpb24gOnZhciB3aGljaCB3YXkgYmUgZWl0aGVyXG4gIGZ1bmN0aW9uIHBhcmFtZXRlciAoaGFzIDpwYXJhbSB0cnVlKSBvciBsb2NhbFxuICBiaW5kaW5nIGRlY2xhcmF0aW9uIChoYXMgOmJpbmRpbmcgdHJ1ZSkgbGlrZSBvbmVzIGRlZmluZWRcbiAgYnkgbGV0IGFuZCBsb29wIGZvcm1zIGluIGxhdGVyIGNhc2UgZm9ybSB3aWxsIGFsc28gaGF2ZVxuICA6c2hhZG93IHBvaW50aW5nIHRvIGEgZGVjbGFyYXRpb24gbm9kZSBpdCBzaGFkb3dzIGFuZFxuICA6ZGVwdGggcHJvcGVydHkgd2l0aCBhIGRlcHRoIG9mIHNoYWRvd2luZywgdGhhdCBpcyB1c2VkXG4gIHRvIGZvciByZW5hbWluZyBsb2dpYyB0byBhdm9pZCBuYW1lIGNvbGxpc2lvbnMgaW4gZm9ybXNcbiAgbGlrZSBsZXQgdGhhdCBhbGxvdyBzYW1lIG5hbWVkIGJpbmRpbmdzLlwiXG4gIChpZiAoPSA6YmluZGluZyAoOnR5cGUgKDpiaW5kaW5nIG5vZGUpKSlcbiAgICAoY29uaiAod3JpdGUtYmluZGluZy12YXIgKDpiaW5kaW5nIG5vZGUpKVxuICAgICAgICAgICh3cml0ZS1sb2NhdGlvbiAoOmZvcm0gbm9kZSkpKVxuICAgIChjb25qICh3cml0ZS1sb2NhdGlvbiAoOmZvcm0gbm9kZSkpXG4gICAgICAgICAgKC0+aWRlbnRpZmllciAoOmZvcm0gbm9kZSkpKSkpXG4oaW5zdGFsbC13cml0ZXIhIDp2YXIgd3JpdGUtdmFyKVxuKGluc3RhbGwtd3JpdGVyISA6cGFyYW0gd3JpdGUtdmFyKVxuXG4oZGVmdW4gd3JpdGUtaW52b2tlXG4gIChmb3JtKVxuICB7OnR5cGUgOkNhbGxFeHByZXNzaW9uXG4gICA6Y2FsbGVlICh3cml0ZSAoOmNhbGxlZSBmb3JtKSlcbiAgIDphcmd1bWVudHMgKG1hcCB3cml0ZSAoOnBhcmFtcyBmb3JtKSl9KVxuKGluc3RhbGwtd3JpdGVyISA6aW52b2tlIHdyaXRlLWludm9rZSlcblxuKGRlZnVuIHdyaXRlLXZlY3RvclxuICAoZm9ybSlcbiAgezp0eXBlIDpBcnJheUV4cHJlc3Npb25cbiAgIDplbGVtZW50cyAobWFwIHdyaXRlICg6aXRlbXMgZm9ybSkpfSlcbihpbnN0YWxsLXdyaXRlciEgOnZlY3RvciB3cml0ZS12ZWN0b3IpXG5cbihkZWZ1biB3cml0ZS1kaWN0aW9uYXJ5XG4gIChmb3JtKVxuICAobGV0KiAoKHByb3BlcnRpZXMgKHBhcnRpdGlvbiAyIChpbnRlcmxlYXZlICg6a2V5cyBmb3JtKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoOnZhbHVlcyBmb3JtKSkpKSlcbiAgICB7OnR5cGUgOk9iamVjdEV4cHJlc3Npb25cbiAgICAgOnByb3BlcnRpZXMgKG1hcCAobGFtYmRhIChwYWlyKVxuICAgICAgICAgICAgICAgICAgICAgICAgKGxldCogKChrZXkgKGZpcnN0IHBhaXIpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHZhbHVlIChzZWNvbmQgcGFpcikpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICB7OmtpbmQgOmluaXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDp0eXBlIDpQcm9wZXJ0eVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgOmtleSAoaWYgKD0gOnN5bWJvbCAoOm9wIGtleSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHdyaXRlLWNvbnN0YW50IChzdHIgKDpmb3JtIGtleSkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh3cml0ZSBrZXkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgOnZhbHVlICh3cml0ZSB2YWx1ZSl9KSlcbiAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzKX0pKVxuKGluc3RhbGwtd3JpdGVyISA6ZGljdGlvbmFyeSB3cml0ZS1kaWN0aW9uYXJ5KVxuXG4oZGVmdW4gd3JpdGUtZXhwb3J0XG4gIChmb3JtKVxuICAod3JpdGUgezpvcCA6c2V0IVxuICAgICAgICAgIDp0YXJnZXQgezpvcCA6bWVtYmVyLWV4cHJlc3Npb25cbiAgICAgICAgICAgICAgICAgICA6Y29tcHV0ZWQgZmFsc2VcbiAgICAgICAgICAgICAgICAgICA6dGFyZ2V0IHs6b3AgOnZhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtICh3aXRoLW1ldGEgJ2V4cG9ydHMgKG1ldGEgKDpmb3JtICg6aWQgZm9ybSkpKSl9XG4gICAgICAgICAgICAgICAgICAgOnByb3BlcnR5ICg6aWQgZm9ybSlcbiAgICAgICAgICAgICAgICAgICA6Zm9ybSAoOmZvcm0gKDppZCBmb3JtKSl9XG4gICAgICAgICAgOnZhbHVlICg6aW5pdCBmb3JtKVxuICAgICAgICAgIDpmb3JtICg6Zm9ybSAoOmlkIGZvcm0pKX0pKVxuXG4oZGVmdW4gd3JpdGUtZGVmXG4gIChmb3JtKVxuICAoY29uaiB7OnR5cGUgOlZhcmlhYmxlRGVjbGFyYXRpb25cbiAgICAgICAgIDpraW5kIDp2YXJcbiAgICAgICAgIDpkZWNsYXJhdGlvbnMgWyhjb25qIHs6dHlwZSA6VmFyaWFibGVEZWNsYXJhdG9yXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmlkICh3cml0ZSAoOmlkIGZvcm0pKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDppbml0IChjb25qIChpZiAoOmV4cG9ydCBmb3JtKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHdyaXRlLWV4cG9ydCBmb3JtKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHdyaXRlICg6aW5pdCBmb3JtKSkpKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh3cml0ZS1sb2NhdGlvbiAoOmZvcm0gKDppZCBmb3JtKSkpKV19XG4gICAgICAgICh3cml0ZS1sb2NhdGlvbiAoOmZvcm0gZm9ybSkgKDpvcmlnaW5hbC1mb3JtIGZvcm0pKSkpXG4oaW5zdGFsbC13cml0ZXIhIDpkZWYgd3JpdGUtZGVmKVxuXG4oZGVmdW4gd3JpdGUtYmluZGluZ1xuICAoZm9ybSlcbiAgKGxldCogKChpZCAod3JpdGUtYmluZGluZy12YXIgZm9ybSkpXG4gICAgICAgIChpbml0ICh3cml0ZSAoOmluaXQgZm9ybSkpKSlcbiAgICB7OnR5cGUgOlZhcmlhYmxlRGVjbGFyYXRpb25cbiAgICAgOmtpbmQgOnZhclxuICAgICA6bG9jIChpbmhlcml0LWxvY2F0aW9uIFtpZCBpbml0XSlcbiAgICAgOmRlY2xhcmF0aW9ucyBbezp0eXBlIDpWYXJpYWJsZURlY2xhcmF0b3JcbiAgICAgICAgICAgICAgICAgICAgIDppZCBpZFxuICAgICAgICAgICAgICAgICAgICAgOmluaXQgaW5pdH1dfSkpXG4oaW5zdGFsbC13cml0ZXIhIDpiaW5kaW5nIHdyaXRlLWJpbmRpbmcpXG5cbihkZWZ1biB3cml0ZS10aHJvd1xuICAoZm9ybSlcbiAgKC0+ZXhwcmVzc2lvbiAoY29uaiB7OnR5cGUgOlRocm93U3RhdGVtZW50XG4gICAgICAgICAgICAgICAgICAgICAgIDphcmd1bWVudCAod3JpdGUgKDp0aHJvdyBmb3JtKSl9XG4gICAgICAgICAgICAgICAgICAgICAgKHdyaXRlLWxvY2F0aW9uICg6Zm9ybSBmb3JtKSAoOm9yaWdpbmFsLWZvcm0gZm9ybSkpKSkpXG4oaW5zdGFsbC13cml0ZXIhIDp0aHJvdyB3cml0ZS10aHJvdylcblxuKGRlZnVuIHdyaXRlLW5ld1xuICAoZm9ybSlcbiAgezp0eXBlIDpOZXdFeHByZXNzaW9uXG4gICA6Y2FsbGVlICh3cml0ZSAoOmNvbnN0cnVjdG9yIGZvcm0pKVxuICAgOmFyZ3VtZW50cyAobWFwIHdyaXRlICg6cGFyYW1zIGZvcm0pKX0pXG4oaW5zdGFsbC13cml0ZXIhIDpuZXcgd3JpdGUtbmV3KVxuXG4oZGVmdW4gd3JpdGUtc2V0IVxuICAoZm9ybSlcbiAgezp0eXBlIDpBc3NpZ25tZW50RXhwcmVzc2lvblxuICAgOm9wZXJhdG9yIDo9XG4gICA6bGVmdCAod3JpdGUgKDp0YXJnZXQgZm9ybSkpXG4gICA6cmlnaHQgKHdyaXRlICg6dmFsdWUgZm9ybSkpfSlcbihpbnN0YWxsLXdyaXRlciEgOnNldCEgd3JpdGUtc2V0ISlcblxuKGRlZnVuIHdyaXRlLWFnZXRcbiAgKGZvcm0pXG4gIHs6dHlwZSA6TWVtYmVyRXhwcmVzc2lvblxuICAgOmNvbXB1dGVkICg6Y29tcHV0ZWQgZm9ybSlcbiAgIDpvYmplY3QgKHdyaXRlICg6dGFyZ2V0IGZvcm0pKVxuICAgOnByb3BlcnR5ICh3cml0ZSAoOnByb3BlcnR5IGZvcm0pKX0pXG4oaW5zdGFsbC13cml0ZXIhIDptZW1iZXItZXhwcmVzc2lvbiB3cml0ZS1hZ2V0KVxuXG47OyBNYXAgb2Ygc3RhdGVtZW50IEFTVCBub2RlIHRoYXQgYXJlIGdlbmVyYXRlZFxuOzsgYnkgYSB3cml0ZXIuIFVzZWQgdG8gZGVjZXQgd2VhdGhlciBub2RlIGlzXG47OyBzdGF0ZW1lbnQgb3IgZXhwcmVzc2lvbi5cbihkZWZ2YXIgKipzdGF0ZW1lbnRzKiogezpFbXB0eVN0YXRlbWVudCB0cnVlIDpCbG9ja1N0YXRlbWVudCB0cnVlXG4gICAgICAgICAgICAgICAgICAgICA6RXhwcmVzc2lvblN0YXRlbWVudCB0cnVlIDpJZlN0YXRlbWVudCB0cnVlXG4gICAgICAgICAgICAgICAgICAgICA6TGFiZWxlZFN0YXRlbWVudCB0cnVlIDpCcmVha1N0YXRlbWVudCB0cnVlXG4gICAgICAgICAgICAgICAgICAgICA6Q29udGludWVTdGF0ZW1lbnQgdHJ1ZSA6U3dpdGNoU3RhdGVtZW50IHRydWVcbiAgICAgICAgICAgICAgICAgICAgIDpSZXR1cm5TdGF0ZW1lbnQgdHJ1ZSA6VGhyb3dTdGF0ZW1lbnQgdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgOlRyeVN0YXRlbWVudCB0cnVlIDpXaGlsZVN0YXRlbWVudCB0cnVlXG4gICAgICAgICAgICAgICAgICAgICA6RG9XaGlsZVN0YXRlbWVudCB0cnVlIDpGb3JTdGF0ZW1lbnQgdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgOkZvckluU3RhdGVtZW50IHRydWUgOkZvck9mU3RhdGVtZW50IHRydWVcbiAgICAgICAgICAgICAgICAgICAgIDpMZXRTdGF0ZW1lbnQgdHJ1ZSA6VmFyaWFibGVEZWNsYXJhdGlvbiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICA6RnVuY3Rpb25EZWNsYXJhdGlvbiB0cnVlfSlcblxuKGRlZnVuIHdyaXRlLXN0YXRlbWVudFxuICAoZm9ybSlcbiAgXCJXcmFwcyBleHByZXNzaW9uIHRoYXQgY2FuJ3QgYmUgaW4gYSBibG9jayBzdGF0ZW1lbnRcbiAgYm9keSBpbnRvIDpFeHByZXNzaW9uU3RhdGVtZW50IG90aGVyd2lzZSByZXR1cm5zIGJhY2tcbiAgZXhwcmVzc2lvbi5cIlxuICAoLT5zdGF0ZW1lbnQgKHdyaXRlIGZvcm0pKSlcblxuKGRlZnVuIC0+c3RhdGVtZW50XG4gIChub2RlKVxuICAoaWYgKGdldCAqKnN0YXRlbWVudHMqKiAoOnR5cGUgbm9kZSkpXG4gICAgbm9kZVxuICAgIHs6dHlwZSA6RXhwcmVzc2lvblN0YXRlbWVudFxuICAgICA6ZXhwcmVzc2lvbiBub2RlXG4gICAgIDpsb2MgKDpsb2Mgbm9kZSlcbiAgICAgfSkpXG5cbihkZWZ1biAtPnJldHVyblxuICAoZm9ybSlcbiAgKGNvbmogezp0eXBlIDpSZXR1cm5TdGF0ZW1lbnRcbiAgICAgICAgIDphcmd1bWVudCAod3JpdGUgZm9ybSl9XG4gICAgICAgICh3cml0ZS1sb2NhdGlvbiAoOmZvcm0gZm9ybSkgKDpvcmlnaW5hbC1mb3JtIGZvcm0pKSkpXG5cbihkZWZ1biB3cml0ZS1ib2R5XG4gIChmb3JtKVxuICBcIlRha2VzIGZvcm0gdGhhdCBtYXkgY29udGFpbiBgOnN0YXRlbWVudHNgIHZlY3RvclxuICBvciBgOnJlc3VsdGAgZm9ybSAgYW5kIHJldHVybnMgdmVjdG9yIGV4cHJlc3Npb25cbiAgbm9kZXMgdGhhdCBjYW4gYmUgdXNlZCBpbiBhbnkgYmxvY2suIElmIGA6cmVzdWx0YFxuICBpcyBwcmVzZW50IGl0IHdpbGwgYmUgYSBsYXN0IGluIHZlY3RvciBhbmQgb2YgYVxuICBgOlJldHVyblN0YXRlbWVudGAgdHlwZS5cbiAgRXhhbXBsZXM6XG5cblxuICAod3JpdGUtYm9keSB7OnN0YXRlbWVudHMgbmlsXG4gICAgICAgICAgICAgICA6cmVzdWx0IHs6b3AgOmNvbnN0YW50XG4gICAgICAgICAgICAgICAgICAgICAgICA6dHlwZSA6bnVtYmVyXG4gICAgICAgICAgICAgICAgICAgICAgICA6Zm9ybSAzfX0pXG4gIDs7ID0+XG4gIFt7OnR5cGUgOlJldHVyblN0YXRlbWVudFxuICAgIDphcmd1bWVudCB7OnR5cGUgOkxpdGVyYWwgOnZhbHVlIDN9fV1cblxuICAod3JpdGUtYm9keSB7OnN0YXRlbWVudHMgW3s6b3AgOnNldCFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnRhcmdldCB7Om9wIDp2YXIgOmZvcm0gJ3h9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIDp2YWx1ZSB7Om9wIDp2YXIgOmZvcm0gJ3l9fV1cbiAgICAgICAgICAgICAgIDpyZXN1bHQgezpvcCA6dmFyIDpmb3JtICd4fX0pXG4gIDs7ID0+XG4gIFt7OnR5cGUgOkV4cHJlc3Npb25TdGF0ZW1lbnRcbiAgICA6ZXhwcmVzc2lvbiB7OnR5cGUgOkFzc2lnbm1lbnRFeHByZXNzaW9uXG4gICAgICAgICAgICAgICAgIDpvcGVyYXRvciA6PVxuICAgICAgICAgICAgICAgICA6bGVmdCB7OnR5cGUgOklkZW50aWZpZXIgOm5hbWUgOnh9XG4gICAgICAgICAgICAgICAgIDpyaWdodCB7OnR5cGUgOklkZW50aWZpZXIgOm5hbWUgOnl9fX1cbiAgIHs6dHlwZSA6UmV0dXJuU3RhdGVtZW50XG4gICAgOmFyZ3VtZW50IHs6dHlwZSA6SWRlbnRpZmllciA6bmFtZSA6eH19XVwiXG4gIChsZXQqICgoc3RhdGVtZW50cyAobWFwIHdyaXRlLXN0YXRlbWVudFxuICAgICAgICAgICAgICAgICAgICAgICAgKG9yICg6c3RhdGVtZW50cyBmb3JtKSBbXSkpKVxuICAgICAgICAocmVzdWx0IChpZiAoOnJlc3VsdCBmb3JtKVxuICAgICAgICAgICAgICAgICAoLT5yZXR1cm4gKDpyZXN1bHQgZm9ybSkpKSkpXG5cbiAgICAoaWYgcmVzdWx0XG4gICAgICAoY29uaiBzdGF0ZW1lbnRzIHJlc3VsdClcbiAgICAgIHN0YXRlbWVudHMpKSlcblxuKGRlZnVuIC0+YmxvY2tcbiAgKGJvZHkpXG4gIChpZiAodmVjdG9yPyBib2R5KVxuICAgIHs6dHlwZSA6QmxvY2tTdGF0ZW1lbnRcbiAgICAgOmJvZHkgYm9keVxuICAgICA6bG9jIChpbmhlcml0LWxvY2F0aW9uIGJvZHkpfVxuICAgIHs6dHlwZSA6QmxvY2tTdGF0ZW1lbnRcbiAgICAgOmJvZHkgW2JvZHldXG4gICAgIDpsb2MgKDpsb2MgYm9keSl9KSlcblxuKGRlZnVuIGNvbnRhaW5zLWF3YWl0P1xuICAobm9kZSlcbiAgXCJUcnVlIGlmIHRoZSBlbWl0dGVkIEpTIG5vZGUgdHJlZSBjb250YWlucyBhbiBBd2FpdEV4cHJlc3Npb24uXG5Xcml0ZXItY29uc3RydWN0ZWQgSUlGRXMgKC0+ZXhwcmVzc2lvbiAvIC0+aWlmZSkgdXNlIHRoaXMgdG8gZGVjaWRlXG53aGV0aGVyIHRoZXkgbXVzdCBiZSBsb3dlcmVkIGFzIGFzeW5jOiBhbiBgYXdhaXRgIGNhcHR1cmVkIGluc2lkZSBhXG5wbGFpbiBzeW5jIElJRkUgd291bGQgbGVhdmUgdGhlIGVuY2xvc2luZyBhc3luYyBmdW5jdGlvbidzIGNvbnRleHRcbmFuZCBmYWlsIHRvIHBhcnNlLiBOZXN0ZWQgd3JpdGVyIElJRkVzIGFscmVhZHkgY2FycnlpbmcgdGhlaXIgb3duXG5hd2FpdCB3cmFwcGVycyBhcmUgZGV0ZWN0ZWQgdGhlIHNhbWUgd2F5LlwiXG4gIChjb25kICgoZGljdGlvbmFyeT8gbm9kZSkgKG9yICg9IDpBd2FpdEV4cHJlc3Npb24gKDp0eXBlIG5vZGUpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoc29tZSBjb250YWlucy1hd2FpdD8gKHZhbHMgbm9kZSkpKSlcbiAgICAgICAgKCh2ZWN0b3I/IG5vZGUpIChzb21lIGNvbnRhaW5zLWF3YWl0PyBub2RlKSlcbiAgICAgICAgKGVsc2UgbmlsKSkpXG5cbihkZWZ1biAtPmV4cHJlc3Npb25cbiAgKCZyZXN0IGJvZHkpXG4gIChsZXQqICgoZm4gezp0eXBlIDpGdW5jdGlvbkV4cHJlc3Npb25cbiAgICAgICAgICAgICAgOmlkIG5pbFxuICAgICAgICAgICAgICA6cGFyYW1zIFtdXG4gICAgICAgICAgICAgIDpleHByZXNzaW9uIGZhbHNlXG4gICAgICAgICAgICAgIDpnZW5lcmF0b3IgZmFsc2VcbiAgICAgICAgICAgICAgOmJvZHkgKC0+YmxvY2sgYm9keSl9KVxuICAgICAgICAoZm4gKGlmIChjb250YWlucy1hd2FpdD8gZm4pXG4gICAgICAgICAgICAgIDs7IGFzeW5jIElJRkUgKyBhd2FpdCBzbyBhbnkgYXdhaXQgaW4gdGhlIGJvZHkgc3RheXNcbiAgICAgICAgICAgICAgOzsgdmFsaWQgSlMgYW5kIHRoZSBJSUZFJ3MgdmFsdWUgZmxvd3MgdGhyb3VnaFxuICAgICAgICAgICAgICAoY29uaiBmbiB7OmFzeW5jIHRydWV9KVxuICAgICAgICAgICAgICBmbikpXG4gICAgICAgIChjYWxsIHs6dHlwZSA6Q2FsbEV4cHJlc3Npb25cbiAgICAgICAgICAgICAgIDphcmd1bWVudHMgW11cbiAgICAgICAgICAgICAgIDpsb2MgKGluaGVyaXQtbG9jYXRpb24gYm9keSlcbiAgICAgICAgICAgICAgIDpjYWxsZWUgKC0+c2VxdWVuY2UgW2ZuXSl9KSlcbiAgICAoaWYgKDphc3luYyBmbilcbiAgICAgIHs6dHlwZSA6QXdhaXRFeHByZXNzaW9uXG4gICAgICAgOmFyZ3VtZW50IGNhbGx9XG4gICAgICBjYWxsKSkpXG5cbihkZWZ1biB3cml0ZS1kb1xuICAoZm9ybSlcbiAgKGlmICg6YmxvY2sgKG1ldGEgKGZpcnN0ICg6Zm9ybSBmb3JtKSkpKVxuICAgICgtPmJsb2NrICh3cml0ZS1ib2R5IChjb25qIGZvcm0gezpyZXN1bHQgbmlsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnN0YXRlbWVudHMgKGNvbmogKDpzdGF0ZW1lbnRzIGZvcm0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKDpyZXN1bHQgZm9ybSkpfSkpKVxuICAgIChhcHBseSAtPmV4cHJlc3Npb24gKHdyaXRlLWJvZHkgZm9ybSkpKSlcbihpbnN0YWxsLXdyaXRlciEgOmRvIHdyaXRlLWRvKVxuXG4oZGVmdW4gd3JpdGUtaWZcbiAgKGZvcm0pXG4gIHs6dHlwZSA6Q29uZGl0aW9uYWxFeHByZXNzaW9uXG4gICA6dGVzdCAod3JpdGUgKDp0ZXN0IGZvcm0pKVxuICAgOmNvbnNlcXVlbnQgKHdyaXRlICg6Y29uc2VxdWVudCBmb3JtKSlcbiAgIDphbHRlcm5hdGUgKHdyaXRlICg6YWx0ZXJuYXRlIGZvcm0pKX0pXG4oaW5zdGFsbC13cml0ZXIhIDppZiB3cml0ZS1pZilcblxuKGRlZnVuIHdyaXRlLXRyeVxuICAoZm9ybSlcbiAgKGxldCogKChoYW5kbGVyICg6aGFuZGxlciBmb3JtKSlcbiAgICAgICAgKGZpbmFsaXplciAoOmZpbmFsaXplciBmb3JtKSkpXG4gICAgKC0+ZXhwcmVzc2lvbiAoY29uaiB7OnR5cGUgOlRyeVN0YXRlbWVudFxuICAgICAgICAgICAgICAgICAgICAgICAgIDpndWFyZGVkSGFuZGxlcnMgW11cbiAgICAgICAgICAgICAgICAgICAgICAgICA6YmxvY2sgKC0+YmxvY2sgKHdyaXRlLWJvZHkgKDpib2R5IGZvcm0pKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICA6aGFuZGxlcnMgKGlmIGhhbmRsZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbezp0eXBlIDpDYXRjaENsYXVzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnBhcmFtICh3cml0ZSAoOm5hbWUgaGFuZGxlcikpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Ym9keSAoLT5ibG9jayAod3JpdGUtYm9keSBoYW5kbGVyKSl9XVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtdKVxuICAgICAgICAgICAgICAgICAgICAgICAgIDpmaW5hbGl6ZXIgKGNvbmQgKGZpbmFsaXplciAoLT5ibG9jayAod3JpdGUtYm9keSBmaW5hbGl6ZXIpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgobm90IGhhbmRsZXIpICgtPmJsb2NrIFtdKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChlbHNlIG5pbCkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgKHdyaXRlLWxvY2F0aW9uICg6Zm9ybSBmb3JtKSAoOm9yaWdpbmFsLWZvcm0gZm9ybSkpKSkpKVxuKGluc3RhbGwtd3JpdGVyISA6dHJ5IHdyaXRlLXRyeSlcblxuKGRlZnVuLSB3cml0ZS1iaW5kaW5nLXZhbHVlXG4gIChmb3JtKVxuICAod3JpdGUgKDppbml0IGZvcm0pKSlcblxuKGRlZnVuLSB3cml0ZS1iaW5kaW5nLXBhcmFtXG4gIChmb3JtKVxuICAod3JpdGUtdmFyIHs6Zm9ybSAoOm5hbWUgZm9ybSl9KSlcblxuKGRlZnVuIHdyaXRlLWJpbmRpbmdcbiAgKGZvcm0pXG4gICh3cml0ZSB7Om9wIDpkZWZcbiAgICAgICAgICA6dmFyIGZvcm1cbiAgICAgICAgICA6aW5pdCAoOmluaXQgZm9ybSlcbiAgICAgICAgICA6Zm9ybSBmb3JtfSkpXG5cbihkZWZ1biB3cml0ZS1sZXRcbiAgKGZvcm0pXG4gIChsZXQqICgoYm9keSAoY29uaiBmb3JtXG4gICAgICAgICAgICAgICAgICAgezpzdGF0ZW1lbnRzICh2ZWMgKGNvbmNhdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoOmJpbmRpbmdzIGZvcm0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICg6c3RhdGVtZW50cyBmb3JtKSkpfSkpKVxuICAgICgtPmlpZmUgKC0+YmxvY2sgKHdyaXRlLWJvZHkgYm9keSkpKSkpXG4oaW5zdGFsbC13cml0ZXIhIDpsZXQgd3JpdGUtbGV0KVxuXG4oZGVmdW4gLT5yZWJpbmRcbiAgKGZvcm0pXG4gIChsb29wICgocmVzdWx0IFtdKVxuICAgICAgICAgKGJpbmRpbmdzICg6YmluZGluZ3MgZm9ybSkpKVxuICAgIChpZiAoZW1wdHk/IGJpbmRpbmdzKVxuICAgICAgcmVzdWx0XG4gICAgICAocmVjdXIgKGNvbmogcmVzdWx0XG4gICAgICAgICAgICAgICAgICAgezp0eXBlIDpBc3NpZ25tZW50RXhwcmVzc2lvblxuICAgICAgICAgICAgICAgICAgICA6b3BlcmF0b3IgOj1cbiAgICAgICAgICAgICAgICAgICAgOmxlZnQgKHdyaXRlLWJpbmRpbmctdmFyIChmaXJzdCBiaW5kaW5ncykpXG4gICAgICAgICAgICAgICAgICAgIDpyaWdodCB7OnR5cGUgOk1lbWJlckV4cHJlc3Npb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Y29tcHV0ZWQgdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpvYmplY3Qgezp0eXBlIDpJZGVudGlmaWVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOm5hbWUgOmxvb3B9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOnByb3BlcnR5IHs6dHlwZSA6TGl0ZXJhbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnZhbHVlIChjb3VudCByZXN1bHQpfX19KVxuICAgICAgICAgICAgIChyZXN0IGJpbmRpbmdzKSkpKSlcblxuKGRlZnVuIC0+c2VxdWVuY2VcbiAgKGV4cHJlc3Npb25zKVxuICB7OnR5cGUgOlNlcXVlbmNlRXhwcmVzc2lvblxuICAgOmV4cHJlc3Npb25zIGV4cHJlc3Npb25zfSlcblxuKGRlZnVuIC0+aWlmZVxuICAoYm9keSBpZClcbiAgKGxldCogKChmbiB7OnR5cGUgOkZ1bmN0aW9uRXhwcmVzc2lvblxuICAgICAgICAgICAgICA6aWQgaWRcbiAgICAgICAgICAgICAgOnBhcmFtcyBbXVxuICAgICAgICAgICAgICA6ZXhwcmVzc2lvbiBmYWxzZVxuICAgICAgICAgICAgICA6Z2VuZXJhdG9yIGZhbHNlXG4gICAgICAgICAgICAgIDpib2R5IGJvZHl9KVxuICAgICAgICAoZm4gKGlmIChjb250YWlucy1hd2FpdD8gYm9keSlcbiAgICAgICAgICAgICAgOzsgYXN5bmMgSUlGRSArIGF3YWl0IC0tIHNlZSAtPmV4cHJlc3Npb25cbiAgICAgICAgICAgICAgKGNvbmogZm4gezphc3luYyB0cnVlfSlcbiAgICAgICAgICAgICAgZm4pKVxuICAgICAgICAoY2FsbCB7OnR5cGUgOkNhbGxFeHByZXNzaW9uXG4gICAgICAgICAgICAgICA6YXJndW1lbnRzIFt7OnR5cGUgOlRoaXNFeHByZXNzaW9ufV1cbiAgICAgICAgICAgICAgIDpjYWxsZWUgezp0eXBlIDpNZW1iZXJFeHByZXNzaW9uXG4gICAgICAgICAgICAgICAgICAgICAgICA6Y29tcHV0ZWQgZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIDpvYmplY3QgZm5cbiAgICAgICAgICAgICAgICAgICAgICAgIDpwcm9wZXJ0eSB7OnR5cGUgOklkZW50aWZpZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOm5hbWUgOmNhbGx9fX0pKVxuICAgIChpZiAoOmFzeW5jIGZuKVxuICAgICAgezp0eXBlIDpBd2FpdEV4cHJlc3Npb25cbiAgICAgICA6YXJndW1lbnQgY2FsbH1cbiAgICAgIGNhbGwpKSlcblxuKGRlZnVuIC0+bG9vcC1pbml0XG4gICgpXG4gIHs6dHlwZSA6VmFyaWFibGVEZWNsYXJhdGlvblxuICAgOmtpbmQgOnZhclxuICAgOmRlY2xhcmF0aW9ucyBbezp0eXBlIDpWYXJpYWJsZURlY2xhcmF0b3JcbiAgICAgICAgICAgICAgICAgICA6aWQgezp0eXBlIDpJZGVudGlmaWVyXG4gICAgICAgICAgICAgICAgICAgICAgICA6bmFtZSA6cmVjdXJ9XG4gICAgICAgICAgICAgICAgICAgOmluaXQgezp0eXBlIDpJZGVudGlmaWVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDpuYW1lIDpsb29wfX1dfSlcblxuKGRlZnVuIC0+ZG8td2hpbGVcbiAoYm9keSB0ZXN0KVxuIHs6dHlwZSA6RG9XaGlsZVN0YXRlbWVudFxuICA6Ym9keSBib2R5XG4gIDp0ZXN0IHRlc3R9KVxuXG4oZGVmdW4gLT5zZXQhLXJlY3VyXG4gIChmb3JtKVxuICB7OnR5cGUgOkFzc2lnbm1lbnRFeHByZXNzaW9uXG4gICA6b3BlcmF0b3IgOj1cbiAgIDpsZWZ0IHs6dHlwZSA6SWRlbnRpZmllciA6bmFtZSA6cmVjdXJ9XG4gICA6cmlnaHQgKHdyaXRlIGZvcm0pfSlcblxuKGRlZnVuIC0+bG9vcFxuICAoZm9ybSlcbiAgKC0+c2VxdWVuY2UgKGNvbmogKC0+cmViaW5kIGZvcm0pXG4gICAgICAgICAgICAgICAgICAgIHs6dHlwZSA6QmluYXJ5RXhwcmVzc2lvblxuICAgICAgICAgICAgICAgICAgICAgOm9wZXJhdG9yIDo9PT1cbiAgICAgICAgICAgICAgICAgICAgIDpsZWZ0IHs6dHlwZSA6SWRlbnRpZmllclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpuYW1lIDpyZWN1cn1cbiAgICAgICAgICAgICAgICAgICAgIDpyaWdodCB7OnR5cGUgOklkZW50aWZpZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOm5hbWUgOmxvb3B9fSkpKVxuXG5cbihkZWZ1biB3cml0ZS1sb29wXG4gIChmb3JtKVxuICAobGV0KiAoKHN0YXRlbWVudHMgKDpzdGF0ZW1lbnRzIGZvcm0pKVxuICAgICAgICAocmVzdWx0ICg6cmVzdWx0IGZvcm0pKVxuICAgICAgICAoYmluZGluZ3MgKDpiaW5kaW5ncyBmb3JtKSlcblxuICAgICAgICAobG9vcC1ib2R5IChjb25qIChtYXAgd3JpdGUtc3RhdGVtZW50IHN0YXRlbWVudHMpXG4gICAgICAgICAgICAgICAgICAgICAgICAoLT5zdGF0ZW1lbnQgKC0+c2V0IS1yZWN1ciByZXN1bHQpKSkpXG4gICAgICAgIChib2R5IChjb25jYXQgWyhcbiAgICAgICAgICAgICAgICAgICAgICAgLT5sb29wLWluaXQpXVxuICAgICAgICAgICAgICAgICAgICAgKG1hcCB3cml0ZSBiaW5kaW5ncylcbiAgICAgICAgICAgICAgICAgICAgIFsoLT5kby13aGlsZSAoLT5ibG9jayAodmVjIGxvb3AtYm9keSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKC0+bG9vcCBmb3JtKSldXG4gICAgICAgICAgICAgICAgICAgICBbezp0eXBlIDpSZXR1cm5TdGF0ZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgICAgOmFyZ3VtZW50IHs6dHlwZSA6SWRlbnRpZmllclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpuYW1lIDpyZWN1cn19XSkpKVxuICAgICgtPmlpZmUgKC0+YmxvY2sgKHZlYyBib2R5KSkgJ2xvb3ApKSlcbihpbnN0YWxsLXdyaXRlciEgOmxvb3Agd3JpdGUtbG9vcClcblxuKGRlZnVuIC0+cmVjdXJcbiAgKGZvcm0pXG4gIChsb29wICgocmVzdWx0IFtdKVxuICAgICAgICAgKHBhcmFtcyAoOnBhcmFtcyBmb3JtKSkpXG4gICAgKGlmIChlbXB0eT8gcGFyYW1zKVxuICAgICAgcmVzdWx0XG4gICAgICAocmVjdXIgKGNvbmogcmVzdWx0XG4gICAgICAgICAgICAgICAgICAgezp0eXBlIDpBc3NpZ25tZW50RXhwcmVzc2lvblxuICAgICAgICAgICAgICAgICAgICA6b3BlcmF0b3IgOj1cbiAgICAgICAgICAgICAgICAgICAgOnJpZ2h0ICh3cml0ZSAoZmlyc3QgcGFyYW1zKSlcbiAgICAgICAgICAgICAgICAgICAgOmxlZnQgezp0eXBlIDpNZW1iZXJFeHByZXNzaW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICA6Y29tcHV0ZWQgdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgOm9iamVjdCB7OnR5cGUgOklkZW50aWZpZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpuYW1lIDpsb29wfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgOnByb3BlcnR5IHs6dHlwZSA6TGl0ZXJhbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6dmFsdWUgKGNvdW50IHJlc3VsdCl9fX0pXG4gICAgICAgICAgICAgKHJlc3QgcGFyYW1zKSkpKSlcblxuKGRlZnVuIHdyaXRlLXJlY3VyXG4gIChmb3JtKVxuICAoLT5zZXF1ZW5jZSAoY29uaiAoLT5yZWN1ciBmb3JtKVxuICAgICAgICAgICAgICAgICAgICB7OnR5cGUgOklkZW50aWZpZXJcbiAgICAgICAgICAgICAgICAgICAgIDpuYW1lIDpsb29wfSkpKVxuKGluc3RhbGwtd3JpdGVyISA6cmVjdXIgd3JpdGUtcmVjdXIpXG5cbihkZWZ1biBmYWxsYmFjay1vdmVybG9hZFxuICAoKVxuICB7OnR5cGUgOlN3aXRjaENhc2VcbiAgIDp0ZXN0IG5pbFxuICAgOmNvbnNlcXVlbnQgW3s6dHlwZSA6VGhyb3dTdGF0ZW1lbnRcbiAgICAgICAgICAgICAgICAgOmFyZ3VtZW50IHs6dHlwZSA6Q2FsbEV4cHJlc3Npb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Y2FsbGVlIHs6dHlwZSA6SWRlbnRpZmllclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpuYW1lIDpSYW5nZUVycm9yfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDphcmd1bWVudHMgW3s6dHlwZSA6TGl0ZXJhbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6dmFsdWUgXCJXcm9uZyBudW1iZXIgb2YgYXJndW1lbnRzIHBhc3NlZFwifV19fV19KVxuXG4oZGVmdW4gc3BsaWNlLWJpbmRpbmdcbiAgKGZvcm0pXG4gIHs6b3AgOmRlZlxuICAgOmlkIChsYXN0ICg6cGFyYW1zIGZvcm0pKVxuICAgOmluaXQgezpvcCA6aW52b2tlXG4gICAgICAgICAgOmNhbGxlZSB7Om9wIDp2YXJcbiAgICAgICAgICAgICAgICAgICA6Zm9ybSAnQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGx9XG4gICAgICAgICAgOnBhcmFtcyBbezpvcCA6dmFyXG4gICAgICAgICAgICAgICAgICAgIDpmb3JtICdhcmd1bWVudHN9XG4gICAgICAgICAgICAgICAgICAgezpvcCA6Y29uc3RhbnRcbiAgICAgICAgICAgICAgICAgICAgOmZvcm0gKDphcml0eSBmb3JtKVxuICAgICAgICAgICAgICAgICAgICA6dHlwZSA6bnVtYmVyfV19fSlcblxuKGRlZnVuIHdyaXRlLW92ZXJsb2FkaW5nLXBhcmFtc1xuICAocGFyYW1zKVxuICAocmVkdWNlIChsYW1iZGEgKGZvcm1zIHBhcmFtKVxuICAgICAgICAgICAgKGNvbmogZm9ybXMgezpvcCA6ZGVmXG4gICAgICAgICAgICAgICAgICAgICAgICAgOmlkIHBhcmFtXG4gICAgICAgICAgICAgICAgICAgICAgICAgOmluaXQgezpvcCA6bWVtYmVyLWV4cHJlc3Npb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmNvbXB1dGVkIHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnRhcmdldCB7Om9wIDp2YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gJ2FyZ3VtZW50c31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnByb3BlcnR5IHs6b3AgOmNvbnN0YW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnR5cGUgOm51bWJlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtIChjb3VudCBmb3Jtcyl9fX0pKVxuICAgICAgICAgIFtdXG4gICAgICAgICAgcGFyYW1zKSlcblxuKGRlZnVuIHdyaXRlLW92ZXJsb2FkaW5nLWZuXG4gIChmb3JtKVxuICAobGV0KiAoKG92ZXJsb2FkcyAobWFwIHdyaXRlLWZuLW92ZXJsb2FkICg6bWV0aG9kcyBmb3JtKSkpKVxuICAgIHs6cGFyYW1zIFtdXG4gICAgIDpib2R5ICgtPmJsb2NrIHs6dHlwZSA6U3dpdGNoU3RhdGVtZW50XG4gICAgICAgICAgICAgICAgICAgICA6ZGlzY3JpbWluYW50IHs6dHlwZSA6TWVtYmVyRXhwcmVzc2lvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmNvbXB1dGVkIGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6b2JqZWN0IHs6dHlwZSA6SWRlbnRpZmllclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOm5hbWUgOmFyZ3VtZW50c31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpwcm9wZXJ0eSB7OnR5cGUgOklkZW50aWZpZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOm5hbWUgOmxlbmd0aH19XG4gICAgICAgICAgICAgICAgICAgICA6Y2FzZXMgKGlmICg6dmFyaWFkaWMgZm9ybSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG92ZXJsb2Fkc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGNvbmogb3ZlcmxvYWRzIChmYWxsYmFjay1vdmVybG9hZCkpKX0pfSkpXG5cbihkZWZ1biB3cml0ZS1mbi1vdmVybG9hZFxuICAoZm9ybSlcbiAgKGxldCogKChwYXJhbXMgKDpwYXJhbXMgZm9ybSkpXG4gICAgICAgIChiaW5kaW5ncyAoaWYgKDp2YXJpYWRpYyBmb3JtKVxuICAgICAgICAgICAgICAgICAgIChjb25qICh3cml0ZS1vdmVybG9hZGluZy1wYXJhbXMgKHZlYyAoYnV0bGFzdCBwYXJhbXMpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAoc3BsaWNlLWJpbmRpbmcgZm9ybSkpXG4gICAgICAgICAgICAgICAgICAgKHdyaXRlLW92ZXJsb2FkaW5nLXBhcmFtcyBwYXJhbXMpKSlcbiAgICAgICAgKHN0YXRlbWVudHMgKHZlYyAoY29uY2F0IGJpbmRpbmdzICg6c3RhdGVtZW50cyBmb3JtKSkpKSlcbiAgICB7OnR5cGUgOlN3aXRjaENhc2VcbiAgICAgOnRlc3QgKGlmIChub3QgKDp2YXJpYWRpYyBmb3JtKSlcbiAgICAgICAgICAgICB7OnR5cGUgOkxpdGVyYWxcbiAgICAgICAgICAgICAgOnZhbHVlICg6YXJpdHkgZm9ybSl9KVxuICAgICA6Y29uc2VxdWVudCAod3JpdGUtYm9keSAoY29uaiBmb3JtIHs6c3RhdGVtZW50cyBzdGF0ZW1lbnRzfSkpfSkpXG5cbihkZWZ1biB3cml0ZS1zaW1wbGUtZm5cbiAgKGZvcm0pXG4gIChsZXQqICgobWV0aG9kIChmaXJzdCAoOm1ldGhvZHMgZm9ybSkpKVxuICAgICAgICAocGFyYW1zIChpZiAoOnZhcmlhZGljIG1ldGhvZClcbiAgICAgICAgICAgICAgICAgKHZlYyAoYnV0bGFzdCAoOnBhcmFtcyBtZXRob2QpKSlcbiAgICAgICAgICAgICAgICAgKDpwYXJhbXMgbWV0aG9kKSkpXG4gICAgICAgIChib2R5IChpZiAoOnZhcmlhZGljIG1ldGhvZClcbiAgICAgICAgICAgICAgIChjb25qIG1ldGhvZFxuICAgICAgICAgICAgICAgICAgICAgezpzdGF0ZW1lbnRzICh2ZWMgKGNvbnMgKHNwbGljZS1iaW5kaW5nIG1ldGhvZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICg6c3RhdGVtZW50cyBtZXRob2QpKSl9KVxuICAgICAgICAgICAgICAgbWV0aG9kKSkpXG4gICAgezpwYXJhbXMgKG1hcCB3cml0ZS12YXIgcGFyYW1zKVxuICAgICA6Ym9keSAoLT5ibG9jayAod3JpdGUtYm9keSBib2R5KSl9KSlcblxuKGRlZnVuIHJlc29sdmVcbiAgKGZyb20gdG8pXG4gIChsZXQqICgocmVxdWlyZXIgKHNwbGl0IChuYW1lIGZyb20pIFxcLikpXG4gICAgICAgIChyZXF1aXJlbWVudCAoc3BsaXQgKG5hbWUgdG8pIFxcLikpXG4gICAgICAgIChyZWxhdGl2ZT8gKGFuZCAobm90IChpZGVudGljYWw/IChuYW1lIGZyb20pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG5hbWUgdG8pKSlcbiAgICAgICAgICAgICAgICAgICAgICAgKGlkZW50aWNhbD8gKGZpcnN0IHJlcXVpcmVyKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZmlyc3QgcmVxdWlyZW1lbnQpKSkpKVxuICAgIChpZiByZWxhdGl2ZT9cbiAgICAgIChsb29wICgoZnJvbSByZXF1aXJlcilcbiAgICAgICAgICAgICAodG8gcmVxdWlyZW1lbnQpKVxuICAgICAgICAoaWYgKGlkZW50aWNhbD8gKGZpcnN0IGZyb20pXG4gICAgICAgICAgICAgICAgICAgICAgICAoZmlyc3QgdG8pKVxuICAgICAgICAgIChyZWN1ciAocmVzdCBmcm9tKSAocmVzdCB0bykpXG4gICAgICAgICAgKGpvaW4gXFwvXG4gICAgICAgICAgICAgICAgKGNvbmNhdCBbXFwuXVxuICAgICAgICAgICAgICAgICAgICAgICAgKHJlcGVhdCAoZGVjIChjb3VudCBmcm9tKSkgXCIuLlwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgdG8pKSkpXG4gICAgICAoam9pbiBcXC8gcmVxdWlyZW1lbnQpKSkpXG5cbihkZWZ1biBpZC0+bnNcbiAgKGlkKVxuICBcIlRha2VzIG5hbWVzcGFjZSBpZGVudGlmaWVyIHN5bWJvbCBhbmQgdHJhbnNsYXRlcyB0byBuZXdcbiAgc3ltYm9sIHdpdGhvdXQgLiBzcGVjaWFsIGNoYXJhY3RlcnNcbiAgd2lzcC5jb3JlIC0+IHdpc3AqY29yZVwiXG4gIChzeW1ib2wgbmlsIChqb2luIFxcKiAoc3BsaXQgKG5hbWUgaWQpIFxcLikpKSlcblxuXG4oZGVmdW4gd3JpdGUtcmVxdWlyZVxuICAoZm9ybSByZXF1aXJlcilcbiAgKGxldCogKChucy1iaW5kaW5nIHs6b3AgOmRlZlxuICAgICAgICAgICAgICAgICAgICA6aWQgezpvcCA6dmFyXG4gICAgICAgICAgICAgICAgICAgICAgICAgOnR5cGUgOmlkZW50aWZpZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICA6Zm9ybSAoaWQtPm5zICg6bnMgZm9ybSkpfVxuICAgICAgICAgICAgICAgICAgICA6aW5pdCB7Om9wIDppbnZva2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDpjYWxsZWUgezpvcCA6dmFyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6dHlwZSA6aWRlbnRpZmllclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gJ3JlcXVpcmV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICA6cGFyYW1zIFt7Om9wIDpjb25zdGFudFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtIChyZXNvbHZlIHJlcXVpcmVyICg6bnMgZm9ybSkpfV19fSlcbiAgICAgICAgKG5zLWFsaWFzIChpZiAoOmFsaWFzIGZvcm0pXG4gICAgICAgICAgICAgICAgICAgezpvcCA6ZGVmXG4gICAgICAgICAgICAgICAgICAgIDppZCB7Om9wIDp2YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICA6dHlwZSA6aWRlbnRpZmllclxuICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtIChpZC0+bnMgKDphbGlhcyBmb3JtKSl9XG4gICAgICAgICAgICAgICAgICAgIDppbml0ICg6aWQgbnMtYmluZGluZyl9KSlcblxuICAgICAgICAocmVmZXJlbmNlcyAocmVkdWNlIChsYW1iZGEgKHJlZmVyZW5jZXMgZm9ybSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGNvbmogcmVmZXJlbmNlc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Om9wIDpkZWZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDppZCB7Om9wIDp2YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnR5cGUgOmlkZW50aWZpZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gKG9yICg6cmVuYW1lIGZvcm0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoOm5hbWUgZm9ybSkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmluaXQgezpvcCA6bWVtYmVyLWV4cHJlc3Npb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Y29tcHV0ZWQgZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6dGFyZ2V0ICg6aWQgbnMtYmluZGluZylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6cHJvcGVydHkgezpvcCA6dmFyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6dHlwZSA6aWRlbnRpZmllclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gKDpuYW1lIGZvcm0pfX19KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFtdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAoOnJlZmVyIGZvcm0pKSkpXG4gICAgKHZlYyAoY29ucyBucy1iaW5kaW5nXG4gICAgICAgICAgICAgICAoaWYgbnMtYWxpYXNcbiAgICAgICAgICAgICAgICAgKGNvbnMgbnMtYWxpYXMgcmVmZXJlbmNlcylcbiAgICAgICAgICAgICAgICAgcmVmZXJlbmNlcykpKSkpXG5cbihkZWZ1biB3cml0ZS1uc1xuICAoZm9ybSlcbiAgKGxldCogKChub2RlICg6Zm9ybSBmb3JtKSlcbiAgICAgICAgKHJlcXVpcmVyICg6bmFtZSBmb3JtKSlcbiAgICAgICAgKG5zLWJpbmRpbmcgezpvcCA6ZGVmXG4gICAgICAgICAgICAgICAgICAgIDpvcmlnaW5hbC1mb3JtIG5vZGVcbiAgICAgICAgICAgICAgICAgICAgOmlkIHs6b3AgOnZhclxuICAgICAgICAgICAgICAgICAgICAgICAgIDp0eXBlIDppZGVudGlmaWVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgOm9yaWdpbmFsLWZvcm0gKGZpcnN0IG5vZGUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gJypucyp9XG4gICAgICAgICAgICAgICAgICAgIDppbml0IHs6b3AgOmRpY3Rpb25hcnlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtIG5vZGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDprZXlzIFt7Om9wIDp2YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnR5cGUgOmlkZW50aWZpZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOm9yaWdpbmFsLWZvcm0gbm9kZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Zm9ybSAnaWR9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgezpvcCA6dmFyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDp0eXBlIDppZGVudGlmaWVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpvcmlnaW5hbC1mb3JtIG5vZGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gJ2RvY31dXG4gICAgICAgICAgICAgICAgICAgICAgICAgICA6dmFsdWVzIFt7Om9wIDpjb25zdGFudFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDp0eXBlIDppZGVudGlmaWVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOm9yaWdpbmFsLWZvcm0gKDpuYW1lIGZvcm0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gKG5hbWUgKDpuYW1lIGZvcm0pKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHs6b3AgOmNvbnN0YW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOm9yaWdpbmFsLWZvcm0gbm9kZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtICg6ZG9jIGZvcm0pfV19fSlcbiAgICAgICAgKHJlcXVpcmVtZW50cyAodmVjIChhcHBseSBjb25jYXQgKG1hcCAobGFtYmRhICglKSAod3JpdGUtcmVxdWlyZSAlIHJlcXVpcmVyKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICg6cmVxdWlyZSBmb3JtKSkpKSkpXG4gICAgKC0+YmxvY2sgKG1hcCB3cml0ZSAodmVjIChjb25zIG5zLWJpbmRpbmcgcmVxdWlyZW1lbnRzKSkpKSkpXG4oaW5zdGFsbC13cml0ZXIhIDpucyB3cml0ZS1ucylcblxuKGRlZnVuIHdyaXRlLWZuXG4gIChmb3JtKVxuICAobGV0KiAoKGJhc2UgKGlmICg+IChjb3VudCAoOm1ldGhvZHMgZm9ybSkpIDEpXG4gICAgICAgICAgICAgICAgKHdyaXRlLW92ZXJsb2FkaW5nLWZuIGZvcm0pXG4gICAgICAgICAgICAgICAgKHdyaXRlLXNpbXBsZS1mbiBmb3JtKSkpKVxuICAgIDs7IEFycm93cyAobGFtYmRhKikgYXJlIGFub255bW91cyBieSBjb25zdHJ1Y3Rpb246IDppZCBpcyBuaWwgYW5kXG4gICAgOzsgYGV4cHJlc3Npb24gZmFsc2VgIHNlbGVjdHMgdGhlIGJsb2NrLWJvZHkgZm9ybS4gUmVndWxhciBmbnMga2VlcFxuICAgIDs7IHRoZWlyIG9wdGlvbmFsIG5hbWU7IHRoZSBvbGQgU3BpZGVyTW9ua2V5LW9ubHkga2V5cyAoOmRlZmF1bHRzXG4gICAgOzsgOnJlc3QgOmV4cHJlc3Npb24pIGFyZSBnb25lIC0tIEVTVHJlZS9lc2NvZGVnZW4gMi54IGRvbid0IHVzZVxuICAgIDs7IHRoZW0uIDphc3luYyB0dXJucyB0aGUgZW1pdHRlZCBmdW5jdGlvbiAob3IgYXJyb3cpIGludG8gYW5cbiAgICA7OyBgYXN5bmMgZnVuY3Rpb25gIC8gYXN5bmMgYXJyb3cuXG4gICAgKGNvbmogYmFzZVxuICAgICAgICAgIHs6YXN5bmMgKD0gKDphc3luYyBmb3JtKSB0cnVlKX1cbiAgICAgICAgICAoaWYgKDphcnJvdyBmb3JtKVxuICAgICAgICAgICAgezp0eXBlIDpBcnJvd0Z1bmN0aW9uRXhwcmVzc2lvblxuICAgICAgICAgICAgIDpleHByZXNzaW9uIGZhbHNlfVxuICAgICAgICAgICAgezp0eXBlIDpGdW5jdGlvbkV4cHJlc3Npb25cbiAgICAgICAgICAgICA6aWQgKGlmICg6aWQgZm9ybSkgKHdyaXRlLXZhciAoOmlkIGZvcm0pKSlcbiAgICAgICAgICAgICA6Z2VuZXJhdG9yIGZhbHNlfSkpKSlcbihpbnN0YWxsLXdyaXRlciEgOmZuIHdyaXRlLWZuKVxuXG4oZGVmdW4gd3JpdGUtYXdhaXRcbiAgKGZvcm0pXG4gIHs6dHlwZSA6QXdhaXRFeHByZXNzaW9uXG4gICA6YXJndW1lbnQgKHdyaXRlICg6YXJndW1lbnQgZm9ybSkpfSlcbihpbnN0YWxsLXdyaXRlciEgOmF3YWl0IHdyaXRlLWF3YWl0KVxuXG4oZGVmdW4gd3JpdGVcbiAgKGZvcm0pXG4gIChsZXQqICgob3AgKDpvcCBmb3JtKSlcbiAgICAgICAgKHdyaXRlciAoYW5kICg9IDppbnZva2UgKDpvcCBmb3JtKSlcbiAgICAgICAgICAgICAgICAgICAgKD0gOnZhciAoOm9wICg6Y2FsbGVlIGZvcm0pKSlcbiAgICAgICAgICAgICAgICAgICAgKGdldCAqKnNwZWNpYWxzKiogKG5hbWUgKDpmb3JtICg6Y2FsbGVlIGZvcm0pKSkpKSkpXG4gICAgKGlmIHdyaXRlclxuICAgICAgKHdyaXRlLXNwZWNpYWwgd3JpdGVyIGZvcm0pXG4gICAgICAod3JpdGUtb3AgKDpvcCBmb3JtKSBmb3JtKSkpKVxuXG4oZGVmdW4gd3JpdGUqXG4gICgmcmVzdCBmb3JtcylcbiAgKGxldCogKChib2R5IChtYXAgd3JpdGUtc3RhdGVtZW50IGZvcm1zKSkpXG4gICAgezp0eXBlIDpQcm9ncmFtXG4gICAgIDpib2R5IGJvZHlcbiAgICAgOmxvYyAoaW5oZXJpdC1sb2NhdGlvbiBib2R5KX0pKVxuXG5cbihkZWZ1biBjb21waWxlXG4gICgmcmVzdCBhcmdzKVxuICAoaWYgKGlkZW50aWNhbD8gKGNvdW50IGFyZ3MpIDEpXG4gICAgKGNvbXBpbGUge30gKGZpcnN0IGFyZ3MpKVxuICAgIChnZW5lcmF0ZSAoYXBwbHkgd3JpdGUqIChyZXN0IGFyZ3MpKSAoZmlyc3QgYXJncykpKSlcblxuXG4oZGVmdW4gZ2V0LW1hY3JvXG4gICh0YXJnZXQgcHJvcGVydHkgJnJlc3QgYXJncylcbiAgKGlmIChlbXB0eT8gYXJncylcbiAgICBgKGFnZXQgKG9yICx0YXJnZXQgMClcbiAgICAgICAgICAgLHByb3BlcnR5KVxuICAgIChsZXQqICgoZGVmYXVsdCogKGZpcnN0IGFyZ3MpKSlcbiAgICAgIChpZiAoaWRlbnRpY2FsPyBkZWZhdWx0KiBuaWwpXG4gICAgICAgIGAoZ2V0ICx0YXJnZXQgLHByb3BlcnR5KVxuICAgICAgICBgKGFwcGx5IGdldCAsW3RhcmdldCBwcm9wZXJ0eSBkZWZhdWx0Kl0pKSkpKVxuKGluc3RhbGwtbWFjcm8hIDpnZXQgZ2V0LW1hY3JvKVxuXG47OyBMb2dpY2FsIG9wZXJhdG9yc1xuXG4oZGVmdW4gaW5zdGFsbC1sb2dpY2FsLW9wZXJhdG9yIVxuICAoY2FsbGVlIG9wZXJhdG9yIGZhbGxiYWNrKVxuICAoZGVmdW4gd3JpdGUtbG9naWNhbC1vcGVyYXRvclxuICAgICgmcmVzdCBvcGVyYW5kcylcbiAgICAobGV0KiAoKG4gKGNvdW50IG9wZXJhbmRzKSkpXG4gICAgICAoY29uZCAoKD0gbiAwKSAod3JpdGUtY29uc3RhbnQgZmFsbGJhY2spKVxuICAgICAgICAgICAgKCg9IG4gMSkgKHdyaXRlIChmaXJzdCBvcGVyYW5kcykpKVxuICAgICAgICAgICAgKGVsc2UgKHJlZHVjZSAobGFtYmRhIChsZWZ0IHJpZ2h0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHs6dHlwZSA6TG9naWNhbEV4cHJlc3Npb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOm9wZXJhdG9yIG9wZXJhdG9yXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpsZWZ0IGxlZnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnJpZ2h0ICh3cml0ZSByaWdodCl9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAod3JpdGUgKGZpcnN0IG9wZXJhbmRzKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKHJlc3Qgb3BlcmFuZHMpKSkpKSlcbiAgKGluc3RhbGwtc3BlY2lhbCEgY2FsbGVlIHdyaXRlLWxvZ2ljYWwtb3BlcmF0b3IpKVxuKGluc3RhbGwtbG9naWNhbC1vcGVyYXRvciEgOm9yIDp8fCBuaWwpXG4oaW5zdGFsbC1sb2dpY2FsLW9wZXJhdG9yISA6YW5kIDomJiB0cnVlKVxuXG4oZGVmdW4gaW5zdGFsbC11bmFyeS1vcGVyYXRvciFcbiAgKGNhbGxlZSBvcGVyYXRvciBwcmVmaXg/KVxuICAoZGVmdW4gd3JpdGUtdW5hcnktb3BlcmF0b3JcbiAgICAoJnJlc3QgcGFyYW1zKVxuICAgIChpZiAoaWRlbnRpY2FsPyAoY291bnQgcGFyYW1zKSAxKVxuICAgICAgezp0eXBlIDpVbmFyeUV4cHJlc3Npb25cbiAgICAgICA6b3BlcmF0b3Igb3BlcmF0b3JcbiAgICAgICA6YXJndW1lbnQgKHdyaXRlIChmaXJzdCBwYXJhbXMpKVxuICAgICAgIDpwcmVmaXggcHJlZml4P31cbiAgICAgIChlcnJvci1hcmctY291bnQgY2FsbGVlIChjb3VudCBwYXJhbXMpKSkpXG4gIChpbnN0YWxsLXNwZWNpYWwhIGNhbGxlZSB3cml0ZS11bmFyeS1vcGVyYXRvcikpXG4oaW5zdGFsbC11bmFyeS1vcGVyYXRvciEgOm5vdCA6ISlcblxuOzsgQml0d2lzZSBPcGVyYXRvcnNcblxuKGluc3RhbGwtdW5hcnktb3BlcmF0b3IhIDpiaXQtbm90IDp+KVxuXG4oZGVmdW4gaW5zdGFsbC1iaW5hcnktb3BlcmF0b3IhXG4gIChjYWxsZWUgb3BlcmF0b3IpXG4gIChkZWZ1biB3cml0ZS1iaW5hcnktb3BlcmF0b3JcbiAgICAoJnJlc3QgcGFyYW1zKVxuICAgIChpZiAoPCAoY291bnQgcGFyYW1zKSAyKVxuICAgICAgKGVycm9yLWFyZy1jb3VudCBjYWxsZWUgKGNvdW50IHBhcmFtcykpXG4gICAgICAocmVkdWNlIChsYW1iZGEgKGxlZnQgcmlnaHQpXG4gICAgICAgICAgICAgICAgezp0eXBlIDpCaW5hcnlFeHByZXNzaW9uXG4gICAgICAgICAgICAgICAgIDpvcGVyYXRvciBvcGVyYXRvclxuICAgICAgICAgICAgICAgICA6bGVmdCBsZWZ0XG4gICAgICAgICAgICAgICAgIDpyaWdodCAod3JpdGUgcmlnaHQpfSlcbiAgICAgICAgICAgICAgKHdyaXRlIChmaXJzdCBwYXJhbXMpKVxuICAgICAgICAgICAgICAocmVzdCBwYXJhbXMpKSkpXG4gIChpbnN0YWxsLXNwZWNpYWwhIGNhbGxlZSB3cml0ZS1iaW5hcnktb3BlcmF0b3IpKVxuKGluc3RhbGwtYmluYXJ5LW9wZXJhdG9yISA6Yml0LWFuZCA6JilcbihpbnN0YWxsLWJpbmFyeS1vcGVyYXRvciEgOmJpdC1vciA6fClcbihpbnN0YWxsLWJpbmFyeS1vcGVyYXRvciEgOmJpdC14b3IgOl4pXG4oaW5zdGFsbC1iaW5hcnktb3BlcmF0b3IhIDpiaXQtc2hpZnQtbGVmdCA6PDwpXG4oaW5zdGFsbC1iaW5hcnktb3BlcmF0b3IhIDpiaXQtc2hpZnQtcmlnaHQgOj4+KVxuKGluc3RhbGwtYmluYXJ5LW9wZXJhdG9yISA6Yml0LXNoaWZ0LXJpZ2h0LXplcm8tZmlsbCA6Pj4+KVxuXG47OyBBcml0aG1ldGljIG9wZXJhdG9yc1xuXG4oZGVmdW4gaW5zdGFsbC1hcml0aG1ldGljLW9wZXJhdG9yIVxuICAoY2FsbGVlIG9wZXJhdG9yIHZhbGlkPyBmYWxsYmFjaylcblxuICAoZGVmdW4gd3JpdGUtYmluYXJ5LW9wZXJhdG9yXG4gICAgKGxlZnQgcmlnaHQpXG4gICAgezp0eXBlIDpCaW5hcnlFeHByZXNzaW9uXG4gICAgIDpvcGVyYXRvciAobmFtZSBvcGVyYXRvcilcbiAgICAgOmxlZnQgbGVmdFxuICAgICA6cmlnaHQgKHdyaXRlIHJpZ2h0KX0pXG5cbiAgKGRlZnVuIHdyaXRlLWFyaXRobWV0aWMtb3BlcmF0b3JcbiAgICAoJnJlc3QgcGFyYW1zKVxuICAgIChsZXQqICgobiAoY291bnQgcGFyYW1zKSkpXG4gICAgICAoY29uZCAoKGFuZCB2YWxpZD8gKG5vdCAodmFsaWQ/IG4pKSkgKGVycm9yLWFyZy1jb3VudCAobmFtZSBjYWxsZWUpIG4pKVxuICAgICAgICAgICAgKCg9PSBuIDApICh3cml0ZS1saXRlcmFsIGZhbGxiYWNrKSlcbiAgICAgICAgICAgICgoPT0gbiAxKSAocmVkdWNlIHdyaXRlLWJpbmFyeS1vcGVyYXRvclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAod3JpdGUtbGl0ZXJhbCBmYWxsYmFjaylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zKSlcbiAgICAgICAgICAgIChlbHNlIChyZWR1Y2Ugd3JpdGUtYmluYXJ5LW9wZXJhdG9yXG4gICAgICAgICAgICAgICAgICAgICAgICAgICh3cml0ZSAoZmlyc3QgcGFyYW1zKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKHJlc3QgcGFyYW1zKSkpKSkpXG5cblxuICAoaW5zdGFsbC1zcGVjaWFsISBjYWxsZWUgd3JpdGUtYXJpdGhtZXRpYy1vcGVyYXRvcikpXG5cbihpbnN0YWxsLWFyaXRobWV0aWMtb3BlcmF0b3IhIDorIDorIG5pbCAwKVxuKGluc3RhbGwtYXJpdGhtZXRpYy1vcGVyYXRvciEgOi0gOi0gKGxhbWJkYSAoJSkgKD49ICUgMSkpIDApXG4oaW5zdGFsbC1hcml0aG1ldGljLW9wZXJhdG9yISA6KiA6KiBuaWwgMSlcbihpbnN0YWxsLWFyaXRobWV0aWMtb3BlcmF0b3IhIChrZXl3b3JkIFxcLykgKGtleXdvcmQgXFwvKSAobGFtYmRhICglKSAoPj0gJSAxKSkgMSlcbihpbnN0YWxsLWFyaXRobWV0aWMtb3BlcmF0b3IhIDpyZW0gKGtleXdvcmQgXFwlKSAobGFtYmRhICglKSAoPT0gJSAyKSkgMSlcblxuXG47OyBDb21wYXJpc29uIG9wZXJhdG9yc1xuXG4oZGVmdW4gaW5zdGFsbC1jb21wYXJpc29uLW9wZXJhdG9yIVxuICAoY2FsbGVlIG9wZXJhdG9yIGZhbGxiYWNrKVxuICBcIkdlbmVyYXRlcyBjb21wYXJpc29uIG9wZXJhdG9yIHdyaXRlciB0aGF0IGdpdmVuIG9uZVxuICBwYXJhbWV0ZXIgd3JpdGVzIGBmYWxsYmFja2AgZ2l2ZW4gdHdvIHBhcmFtZXRlcnMgd3JpdGVzXG4gIGJpbmFyeSBleHByZXNzaW9uIGFuZCBnaXZlbiBtb3JlIHBhcmFtZXRlcnMgd3JpdGVzIGJpbmFyeVxuICBleHByZXNzaW9ucyBqb2luZWQgYnkgbG9naWNhbCBhbmQuXCJcblxuICA7OyBUT0RPICM1NFxuICA7OyBDb21wYXJpc29uIG9wZXJhdG9ycyBtdXN0IHVzZSB0ZW1wb3JhcnkgdmFyaWFibGUgdG8gc3RvcmVcbiAgOzsgZXhwcmVzc2lvbiBub24gbGl0ZXJhbCBhbmQgbm9uLWlkZW50aWZpZXJzLlxuICAoZGVmdW4gd3JpdGUtY29tcGFyaXNvbi1vcGVyYXRvclxuICAgICgmcmVzdCBhcmdzKVxuICAgIChsZXQqICgobiAoY291bnQgYXJncykpKVxuICAgICAgKGNvbmQgKChpZGVudGljYWw/IG4gMCkgKGVycm9yLWFyZy1jb3VudCBjYWxsZWUgMCkpXG4gICAgICAgICAgICAoKGlkZW50aWNhbD8gbiAxKSAoLT5zZXF1ZW5jZSBbKHdyaXRlIChmaXJzdCBhcmdzKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh3cml0ZS1saXRlcmFsIGZhbGxiYWNrKV0pKVxuICAgICAgICAgICAgKChpZGVudGljYWw/IG4gMikgezp0eXBlIDpCaW5hcnlFeHByZXNzaW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6b3BlcmF0b3Igb3BlcmF0b3JcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpsZWZ0ICh3cml0ZSAoZmlyc3QgYXJncykpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6cmlnaHQgKHdyaXRlIChzZWNvbmQgYXJncykpfSlcbiAgICAgICAgICAgIChlbHNlIChsZXQqICgobGVmdCAoZmlyc3QgYXJncykpXG4gICAgICAgICAgICAgICAgICAgICAgICAocmlnaHQgKHNlY29uZCBhcmdzKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIChtb3JlIChyZXN0IChyZXN0IGFyZ3MpKSkpXG4gICAgICAgICAgICAgICAgICAgIChyZWR1Y2UgKGxhbWJkYSAobGVmdCByaWdodClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHs6dHlwZSA6TG9naWNhbEV4cHJlc3Npb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6b3BlcmF0b3IgOiYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmxlZnQgbGVmdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpyaWdodCB7OnR5cGUgOkJpbmFyeUV4cHJlc3Npb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpvcGVyYXRvciBvcGVyYXRvclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmxlZnQgKGlmICg9IDpMb2dpY2FsRXhwcmVzc2lvbiAoOnR5cGUgbGVmdCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICg6cmlnaHQgKDpyaWdodCBsZWZ0KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKDpyaWdodCBsZWZ0KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpyaWdodCAod3JpdGUgcmlnaHQpfX0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKHdyaXRlLWNvbXBhcmlzb24tb3BlcmF0b3IgbGVmdCByaWdodClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb3JlKSkpKSkpXG5cbiAgKGluc3RhbGwtc3BlY2lhbCEgY2FsbGVlIHdyaXRlLWNvbXBhcmlzb24tb3BlcmF0b3IpKVxuXG4oaW5zdGFsbC1jb21wYXJpc29uLW9wZXJhdG9yISA6PT0gOj09IHRydWUpXG4oaW5zdGFsbC1jb21wYXJpc29uLW9wZXJhdG9yISA6PiA6PiB0cnVlKVxuKGluc3RhbGwtY29tcGFyaXNvbi1vcGVyYXRvciEgOj49IDo+PSB0cnVlKVxuKGluc3RhbGwtY29tcGFyaXNvbi1vcGVyYXRvciEgOjwgOjwgdHJ1ZSlcbihpbnN0YWxsLWNvbXBhcmlzb24tb3BlcmF0b3IhIDo8PSA6PD0gdHJ1ZSlcblxuXG4oZGVmdW4gd3JpdGUtaWRlbnRpY2FsP1xuICAoJnJlc3QgcGFyYW1zKVxuICA7OyBUT0RPOiBTdWJtaXQgYSBidWcgZm9yIGNsb2p1cmUgdG8gYWxsb3cgdmFyaWFkaWNcbiAgOzsgbnVtYmVyIG9mIHBhcmFtcyBqb2luZWQgYnkgbG9naWNhbCBhbmQuXG4gIChpZiAoaWRlbnRpY2FsPyAoY291bnQgcGFyYW1zKSAyKVxuICAgIHs6dHlwZSA6QmluYXJ5RXhwcmVzc2lvblxuICAgICA6b3BlcmF0b3IgOj09PVxuICAgICA6bGVmdCAod3JpdGUgKGZpcnN0IHBhcmFtcykpXG4gICAgIDpyaWdodCAod3JpdGUgKHNlY29uZCBwYXJhbXMpKX1cbiAgICAoZXJyb3ItYXJnLWNvdW50IDppZGVudGljYWw/IChjb3VudCBwYXJhbXMpKSkpXG4oaW5zdGFsbC1zcGVjaWFsISA6aWRlbnRpY2FsPyB3cml0ZS1pZGVudGljYWw/KVxuXG4oZGVmdW4gd3JpdGUtaW5zdGFuY2U/XG4gICgmcmVzdCBwYXJhbXMpXG4gIDs7IFRPRE86IFN1Ym1pdCBhIGJ1ZyBmb3IgY2xvanVyZSB0byBtYWtlIHN1cmUgdGhhdFxuICA7OyBpbnN0YW5jZT8gZWl0aGVyIGFjY2VwdHMgb25seSB0d28gYXJncyBvciByZXR1cm5zXG4gIDs7IHRydWUgb25seSBpZiBhbGwgdGhlIHBhcmFtcyBhcmUgaW5zdGFuY2Ugb2YgdGhlXG4gIDs7IGdpdmVuIHR5cGUuXG5cbiAgKGxldCogKChjb25zdHJ1Y3RvciAoZmlyc3QgcGFyYW1zKSlcbiAgICAgICAgKGluc3RhbmNlIChzZWNvbmQgcGFyYW1zKSkpXG4gICAgKGlmICg8IChjb3VudCBwYXJhbXMpIDEpXG4gICAgICAoZXJyb3ItYXJnLWNvdW50IDppbnN0YW5jZT8gKGNvdW50IHBhcmFtcykpXG4gICAgICB7OnR5cGUgOkJpbmFyeUV4cHJlc3Npb25cbiAgICAgICA6b3BlcmF0b3IgOmluc3RhbmNlb2ZcbiAgICAgICA6bGVmdCAoaWYgaW5zdGFuY2VcbiAgICAgICAgICAgICAgICh3cml0ZSBpbnN0YW5jZSlcbiAgICAgICAgICAgICAgICh3cml0ZS1jb25zdGFudCBpbnN0YW5jZSkpXG4gICAgICAgOnJpZ2h0ICh3cml0ZSBjb25zdHJ1Y3Rvcil9KSkpXG4oaW5zdGFsbC1zcGVjaWFsISA6aW5zdGFuY2U/IHdyaXRlLWluc3RhbmNlPylcblxuXG4oZGVmdW4gZXhwYW5kLWFwcGx5XG4gIChmICZyZXN0IHBhcmFtcylcbiAgKGxldCogKChwcmVmaXggKHZlYyAoYnV0bGFzdCBwYXJhbXMpKSkpXG4gICAgKGlmIChlbXB0eT8gcHJlZml4KVxuICAgICAgYCguYXBwbHkgLGYgbmlsICxAcGFyYW1zKVxuICAgICAgYCguYXBwbHkgLGYgbmlsICguY29uY2F0ICxwcmVmaXggLChsYXN0IHBhcmFtcykpKSkpKVxuKGluc3RhbGwtbWFjcm8hIDphcHBseSBleHBhbmQtYXBwbHkpXG5cblxuKGRlZnVuIGV4cGFuZC1wcmludFxuICAoJmZvcm0gJnJlc3QgbW9yZSlcbiAgXCJQcmludHMgdGhlIG9iamVjdChzKSB0byB0aGUgb3V0cHV0IGZvciBodW1hbiBjb25zdW1wdGlvbi5cIlxuICAobGV0KiAoKG9wICh3aXRoLW1ldGEgJ2NvbnNvbGUubG9nIChtZXRhICZmb3JtKSkpKVxuICAgIGAoLG9wICxAbW9yZSkpKVxuKGluc3RhbGwtbWFjcm8hIDpwcmludCAod2l0aC1tZXRhIGV4cGFuZC1wcmludCB7OmltcGxpY2l0IFs6JmZvcm1dfSkpXG5cbihkZWZ1biBleHBhbmQtc3RyXG4gICgmcmVzdCBmb3JtcylcbiAgXCJzdHIgaW5saW5pbmcgYW5kIG9wdGltaXphdGlvbiB2aWEgbWFjcm9zXCJcbiAgYCgrIFwiXCIgLEBmb3JtcykpXG4oaW5zdGFsbC1tYWNybyEgOnN0ciBleHBhbmQtc3RyKVxuXG4oZGVmdW4gZXhwYW5kLWRlYnVnXG4gICgpXG4gICdkZWJ1Z2dlcilcbihpbnN0YWxsLW1hY3JvISA6ZGVidWdnZXIhIGV4cGFuZC1kZWJ1ZylcblxuKGRlZnVuIGV4cGFuZC1hc3NlcnRcbiAgKHggJnJlc3QgYXJncylcbiAgXCJFdmFsdWF0ZXMgZXhwciBhbmQgdGhyb3dzIGFuIGV4Y2VwdGlvbiBpZiBpdCBkb2VzIG5vdCBldmFsdWF0ZSB0b1xuICAgIGxvZ2ljYWwgdHJ1ZS5cIlxuICAobGV0KiAoKG1lc3NhZ2UgKGlmIChlbXB0eT8gYXJncykgXCJcIiAoZmlyc3QgYXJncykpKVxuICAgICAgICAoZm9ybSAocHItc3RyIHgpKSlcbiAgICBgKGlmIChub3QgLHgpXG4gICAgICAgKHRocm93IChFcnJvciAoc3RyIFwiQXNzZXJ0IGZhaWxlZDogXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLG1lc3NhZ2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLGZvcm0pKSkpKSlcbihpbnN0YWxsLW1hY3JvISA6YXNzZXJ0IGV4cGFuZC1hc3NlcnQpXG5cblxuKGRlZnVuIGV4cGFuZC10eXBlc3RyIChpdClcbiAgKGxldCogKChwcmVmaXggXCJbb2JqZWN0IFwiKSAoc3VmZml4IFwiXVwiKSlcbiAgICBgKC0+ICguY2FsbCBPYmplY3QucHJvdG90eXBlLnRvLXN0cmluZyAsaXQpXG4gICAgICAgICAoLnNsaWNlICwoY291bnQgcHJlZml4KSAsKC0gKGNvdW50IHN1ZmZpeCkpKSkpKVxuXG4oZGVmdW4gZXhwYW5kLWRlZnByb3RvY29sXG4gICgmZW52IGlkICZyZXN0IGZvcm1zKVxuICAobGV0KiAoKG5zIChuYW1lICg6bmFtZSAoOm5zICZlbnYpKSkpXG4gICAgICAgIChwcm90b2NvbC1uYW1lIChuYW1lIGlkKSlcbiAgICAgICAgKHByb3RvY29sLWRvYyAoaWYgKHN0cmluZz8gKGZpcnN0IGZvcm1zKSlcbiAgICAgICAgICAgICAgICAgICAgICAgKGZpcnN0IGZvcm1zKSkpXG4gICAgICAgIChwcm90b2NvbC1tZXRob2RzIChpZiBwcm90b2NvbC1kb2NcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIChyZXN0IGZvcm1zKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9ybXMpKVxuICAgICAgICAobm90LXN1cHBvcnRlZCAobGFtYmRhIChtZXRob2QpIGAobGFtYmRhICglKSAodGhyb3cgKHN0ciAsKHN0ciBcIk5vIHByb3RvY29sIG1ldGhvZCBcIiBwcm90b2NvbC1uYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIuXCIgbWV0aG9kIFwiIGRlZmluZWQgZm9yIHR5cGUgXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLChleHBhbmQtdHlwZXN0ciAnJSkgXCI6IFwiICUpKSkpKVxuICAgICAgICAocHJvdG9jb2wgKG1hcHYgKGxhbWJkYSAobWV0aG9kKVxuICAgICAgICAgICAgICAgICAgICAgICAgIChsZXQqICgobWV0aG9kLW5hbWUgKGZpcnN0IG1ldGhvZCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGlkIChpZC0+bnMgKHN0ciBucyBcIiRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm90b2NvbC1uYW1lIFwiJFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChuYW1lIG1ldGhvZC1uYW1lKSkpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHs6aWQgbWV0aG9kLW5hbWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Zm4gYChsYW1iZGEgLGlkIChzZWxmKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoLmFwcGx5IChvciAoaWYgKG9yIChpZGVudGljYWw/IHNlbGYgbnVsbCkgKGlkZW50aWNhbD8gc2VsZiBuaWwpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICguLW5pbCAsaWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG9yIChhZ2V0IHNlbGYgJyxpZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGFnZXQgLGlkICwoZXhwYW5kLXR5cGVzdHIgJ3NlbGYpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoLi1fICxpZCkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAsKG5vdC1zdXBwb3J0ZWQgKG5hbWUgaWQpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmIGFyZ3VtZW50cykpfSkpXG4gICAgICAgICAgICAgICAgICAgICAgIHByb3RvY29sLW1ldGhvZHMpKVxuICAgICAgICAoZm5zIChtYXAgKGxhbWJkYSAoZm9ybSlcbiAgICAgICAgICAgICAgICAgICBgKGRlZnZhciAsKDppZCBmb3JtKSAoYWdldCAsaWQgJywoOmlkIGZvcm0pKSkpXG4gICAgICAgICAgICAgICAgIHByb3RvY29sKSlcbiAgICAgICAgKHNhdGlzZnkgezp3aXNwX2NvcmUkSVByb3RvY29sJGlkIChzdHIgbnMgXCIvXCIgcHJvdG9jb2wtbmFtZSl9KVxuICAgICAgICAoYm9keSAocmVkdWNlIChsYW1iZGEgKGJvZHkgbWV0aG9kKVxuICAgICAgICAgICAgICAgICAgICAgICAoYXNzb2MgYm9keSAoOmlkIG1ldGhvZCkgKDpmbiBtZXRob2QpKSlcbiAgICAgICAgICAgICAgICAgICAgIHNhdGlzZnlcbiAgICAgICAgICAgICAgICAgICAgIHByb3RvY29sKSkpXG4gICAgYCgsKHdpdGgtbWV0YSAncHJvZ24gezpibG9jayB0cnVlfSlcbiAgICAgICAoZGVmdmFyICxpZCAsYm9keSlcbiAgICAgICAsQGZuc1xuICAgICAgICxpZCkpKVxuKGluc3RhbGwtbWFjcm8hIDpkZWZwcm90b2NvbCAod2l0aC1tZXRhIGV4cGFuZC1kZWZwcm90b2NvbCB7OmltcGxpY2l0IFs6JmVudl19KSlcblxuKGRlZnVuIGV4cGFuZC1kZWZ0eXBlXG4gIChpZCBmaWVsZHMgJnJlc3QgZm9ybXMpXG4gIChsZXQqICgodHlwZS1pbml0IChtYXAgKGxhbWJkYSAoZmllbGQpIGAoc2V0ZiAoYWdldCB0aGlzICcsZmllbGQpICxmaWVsZCkpXG4gICAgICAgICAgICAgICAgICAgICAgIGZpZWxkcykpXG4gICAgICAgIChjb25zdHJ1Y3RvciAoY29uaiB0eXBlLWluaXQgJ3RoaXMpKVxuICAgICAgICAobWV0aG9kLWluaXQgKG1hcCAobGFtYmRhIChmaWVsZCkgYChkZWZ2YXIgLGZpZWxkIChhZ2V0IHRoaXMgJyxmaWVsZCkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkcykpXG4gICAgICAgIChtYWtlLW1ldGhvZCAobGFtYmRhIChwcm90b2NvbCBmb3JtKVxuICAgICAgICAgICAgICAgICAgICAgIChsZXQqICgobWV0aG9kLW5hbWUgKGZpcnN0IGZvcm0pKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChwYXJhbXMgKHNlY29uZCBmb3JtKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoYm9keSAocmVzdCAocmVzdCBmb3JtKSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZpZWxkLW5hbWUgKGlmICg9IChuYW1lIHByb3RvY29sKSBcIk9iamVjdFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgKHF1b3RlICxtZXRob2QtbmFtZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYCguLW5hbWUgKGFnZXQgLHByb3RvY29sICcsbWV0aG9kLW5hbWUpKSkpKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBgKHNldGYgKGFnZXQgKC4tcHJvdG90eXBlICxpZCkgLGZpZWxkLW5hbWUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGxhbWJkYSAscGFyYW1zICxAbWV0aG9kLWluaXQgLEBib2R5KSkpKSlcbiAgICAgICAgKHNhdGlzZnkgKGxhbWJkYSAocHJvdG9jb2wpXG4gICAgICAgICAgICAgICAgICBgKHNldGYgKGFnZXQgKC4tcHJvdG90eXBlICxpZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoLi13aXNwX2NvcmUkSVByb3RvY29sJGlkICxwcm90b2NvbCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgdHJ1ZSkpKVxuXG4gICAgICAgIChib2R5IChyZWR1Y2UgKGxhbWJkYSAodHlwZSBmb3JtKVxuICAgICAgICAgICAgICAgICAgICAgICAoaWYgKGxpc3Q/IGZvcm0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgKGNvbmogdHlwZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHs6Ym9keSAoY29uaiAoOmJvZHkgdHlwZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG1ha2UtbWV0aG9kICg6cHJvdG9jb2wgdHlwZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcm0pKX0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgKGNvbmogdHlwZSB7OnByb3RvY29sIGZvcm1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Ym9keSAoY29uaiAoOmJvZHkgdHlwZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoc2F0aXNmeSBmb3JtKSl9KSkpXG5cbiAgICAgICAgICAgICAgICAgICAgICAgezpwcm90b2NvbCBuaWxcbiAgICAgICAgICAgICAgICAgICAgICAgIDpib2R5IFtdfVxuXG4gICAgICAgICAgICAgICAgICAgICAgIGZvcm1zKSlcblxuICAgICAgICAobWV0aG9kcyAoOmJvZHkgYm9keSkpKVxuICAgIGAoZGVmdmFyICxpZCAocHJvZ25cbiAgICAgICAoZGVmdW4tICxpZCAsZmllbGRzICxAY29uc3RydWN0b3IpXG4gICAgICAgLEBtZXRob2RzXG4gICAgICAgLGlkKSkpKVxuKGluc3RhbGwtbWFjcm8hIDpkZWZ0eXBlIGV4cGFuZC1kZWZ0eXBlKVxuKGluc3RhbGwtbWFjcm8hIDpkZWZyZWNvcmQgZXhwYW5kLWRlZnR5cGUpXG5cbihkZWZ1biBleHBhbmQtZXh0ZW5kLXR5cGVcbiAgKHR5cGUgJnJlc3QgZm9ybXMpXG4gIChsZXQqICgoZGVmYXVsdC10eXBlPyAoPSB0eXBlICdkZWZhdWx0KSlcbiAgICAgICAgKG5pbC10eXBlPyAobmlsPyB0eXBlKSlcblxuICAgICAgICAodHlwZS1uYW1lIChjb25kICgobmlsPyB0eXBlKSAoc3ltYm9sIFwibmlsXCIpKVxuICAgICAgICAgICAgICAgICAgICAgICAgKCg9IHR5cGUgJ2RlZmF1bHQpICdfKVxuICAgICAgICAgICAgICAgICAgICAgICAgKCg9IHR5cGUgJ251bWJlcikgJ051bWJlcilcbiAgICAgICAgICAgICAgICAgICAgICAgICgoPSB0eXBlICdzdHJpbmcpICdTdHJpbmcpXG4gICAgICAgICAgICAgICAgICAgICAgICAoKD0gdHlwZSAnYm9vbGVhbikgJ0Jvb2xlYW4pXG4gICAgICAgICAgICAgICAgICAgICAgICAoKD0gdHlwZSAndmVjdG9yKSAnQXJyYXkpXG4gICAgICAgICAgICAgICAgICAgICAgICAoKD0gdHlwZSAnZnVuY3Rpb24pICdGdW5jdGlvbilcbiAgICAgICAgICAgICAgICAgICAgICAgICgoPSB0eXBlICdyZS1wYXR0ZXJuKSAnUmVnRXhwKVxuICAgICAgICAgICAgICAgICAgICAgICAgKCg9IChuYW1lc3BhY2UgdHlwZSkgXCJqc1wiKSB0eXBlKVxuICAgICAgICAgICAgICAgICAgICAgICAgKGVsc2UgbmlsKSkpXG5cbiAgICAgICAgKHNhdGlzZnkgKGxhbWJkYSAocHJvdG9jb2wpXG4gICAgICAgICAgICAgICAgICAoaWYgdHlwZS1uYW1lXG4gICAgICAgICAgICAgICAgICAgIGAoc2V0ZiAoYWdldCAscHJvdG9jb2xcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICcsKHN5bWJvbCAoc3RyIFwid2lzcF9jb3JlJElQcm90b2NvbCRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG5hbWUgdHlwZS1uYW1lKSkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ1ZSlcbiAgICAgICAgICAgICAgICAgICAgYChzZXRmIChhZ2V0ICguLXByb3RvdHlwZSAsdHlwZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICguLXdpc3BfY29yZSRJUHJvdG9jb2wkaWQgLHByb3RvY29sKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRydWUpKSkpXG5cbiAgICAgICAgKG1ha2UtbWV0aG9kIChsYW1iZGEgKHByb3RvY29sIGZvcm0pXG4gICAgICAgICAgICAgICAgICAgICAgKGxldCogKChtZXRob2QtbmFtZSAoZmlyc3QgZm9ybSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKHBhcmFtcyAoc2Vjb25kIGZvcm0pKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChib2R5IChyZXN0IChyZXN0IGZvcm0pKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAodGFyZ2V0IChpZiB0eXBlLW5hbWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgKGFnZXQgKGFnZXQgLHByb3RvY29sICcsbWV0aG9kLW5hbWUpICcsdHlwZS1uYW1lKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGAoYWdldCAoLi1wcm90b3R5cGUgLHR5cGUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICguLW5hbWUgKGFnZXQgLHByb3RvY29sICcsbWV0aG9kLW5hbWUpKSkpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGAoc2V0ZiAsdGFyZ2V0IChsYW1iZGEgLHBhcmFtcyAsQGJvZHkpKSkpKVxuXG4gICAgICAgIChib2R5IChyZWR1Y2UgKGxhbWJkYSAoYm9keSBmb3JtKVxuICAgICAgICAgICAgICAgICAgICAgICAoaWYgKGxpc3Q/IGZvcm0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgKGNvbmogYm9keVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHs6bWV0aG9kcyAoY29uaiAoOm1ldGhvZHMgYm9keSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG1ha2UtbWV0aG9kICg6cHJvdG9jb2wgYm9keSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcm0pKX0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgKGNvbmogYm9keSB7OnByb3RvY29sIGZvcm1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6bWV0aG9kcyAoY29uaiAoOm1ldGhvZHMgYm9keSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoc2F0aXNmeSBmb3JtKSl9KSkpXG5cbiAgICAgICAgICAgICAgICAgICAgICAgezpwcm90b2NvbCBuaWxcbiAgICAgICAgICAgICAgICAgICAgICAgIDptZXRob2RzIFtdfVxuXG4gICAgICAgICAgICAgICAgICAgICAgIGZvcm1zKSlcbiAgICAgICAgKG1ldGhvZHMgKDptZXRob2RzIGJvZHkpKSlcbiAgICBgKHByb2duICxAbWV0aG9kcyBuaWwpKSlcbihpbnN0YWxsLW1hY3JvISA6ZXh0ZW5kLXR5cGUgZXhwYW5kLWV4dGVuZC10eXBlKVxuXG4oZGVmdW4gZXhwYW5kLWV4dGVuZC1wcm90b2NvbFxuICAocHJvdG9jb2wgJnJlc3QgZm9ybXMpXG4gIChsZXQqICgoc3BlY3MgKHJlZHVjZSAobGFtYmRhIChzcGVjcyBmb3JtKVxuICAgICAgICAgICAgICAgICAgICAgICAgKGlmIChsaXN0PyBmb3JtKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAoY29ucyB7OnR5cGUgKDp0eXBlIChmaXJzdCBzcGVjcykpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6bWV0aG9kcyAoY29uaiAoOm1ldGhvZHMgKGZpcnN0IHNwZWNzKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcm0pfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAocmVzdCBzcGVjcykpXG4gICAgICAgICAgICAgICAgICAgICAgICAgIChjb25zIHs6dHlwZSBmb3JtXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6bWV0aG9kcyBbXX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3BlY3MpKSlcbiAgICAgICAgICAgICAgICAgICAgICBuaWxcbiAgICAgICAgICAgICAgICAgICAgICBmb3JtcykpXG4gICAgICAgIChib2R5IChtYXAgKGxhbWJkYSAoZm9ybSlcbiAgICAgICAgICAgICAgICAgICAgYChleHRlbmQtdHlwZSAsKDp0eXBlIGZvcm0pXG4gICAgICAgICAgICAgICAgICAgICAgICxwcm90b2NvbFxuICAgICAgICAgICAgICAgICAgICAgICAsQCg6bWV0aG9kcyBmb3JtKVxuICAgICAgICAgICAgICAgICAgICAgICApKVxuICAgICAgICAgICAgICAgICAgc3BlY3MpKSlcblxuXG4gICAgYChwcm9nbiAsQGJvZHkgbmlsKSkpXG4oaW5zdGFsbC1tYWNybyEgOmV4dGVuZC1wcm90b2NvbCBleHBhbmQtZXh0ZW5kLXByb3RvY29sKVxuXG4oZGVmdW4gYXNldC1leHBhbmRcbiAgKHRhcmdldCBmaWVsZCB0aGlyZCAmcmVzdCByZXN0LWFyZ3MpXG4gIChpZiAoZW1wdHk/IHJlc3QtYXJncylcbiAgICBgKHNldGYgKGFnZXQgLHRhcmdldCAsZmllbGQpICx0aGlyZClcbiAgICAobGV0KiAoKHN1Yi1maWVsZHMmdmFsdWUgKGNvbnMgdGhpcmQgcmVzdC1hcmdzKSlcbiAgICAgICAgICAocmVzb2x2ZWQtdGFyZ2V0IChyZWR1Y2UgKGxhbWJkYSAoZm9ybSBub2RlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYChhZ2V0ICxmb3JtICxub2RlKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgKGFnZXQgLHRhcmdldCAsZmllbGQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGJ1dGxhc3Qgc3ViLWZpZWxkcyZ2YWx1ZSkpKVxuICAgICAgICAgICh2YWx1ZSAobGFzdCBzdWItZmllbGRzJnZhbHVlKSkpXG4gICAgICBgKHNldGYgLHJlc29sdmVkLXRhcmdldCAsdmFsdWUpKSkpXG4oaW5zdGFsbC1tYWNybyEgOmFzZXQgYXNldC1leHBhbmQpXG5cbihkZWZ1biBhbGVuZ3RoLWV4cGFuZFxuICAoYXJyYXkpXG4gIFwiUmV0dXJucyB0aGUgbGVuZ3RoIG9mIHRoZSBhcnJheS4gV29ya3Mgb24gYXJyYXlzIG9mIGFsbCB0eXBlcy5cIlxuICBgKC4tbGVuZ3RoICxhcnJheSkpXG4oaW5zdGFsbC1tYWNybyEgOmFsZW5ndGggYWxlbmd0aC1leHBhbmQpXG4iXX0=
