{
    var _ns_ = {
            id: 'wisp.backend.escodegen.writer',
            doc: void 0
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
var __uniqueChar__ = exports.__uniqueChar__ = '\xF8';
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
        var id = name(form);
        id = id === '*' ? 'multiply' : id === '/' ? 'divide' : id === '+' ? 'sum' : id === '-' ? 'subtract' : id === '=' ? 'equal?' : id === '==' ? 'strict-equal?' : id === '<=' ? 'not-greater-than' : id === '>=' ? 'not-less-than' : id === '>' ? 'greater-than' : id === '<' ? 'less-than' : id === '->' ? 'thread-first' : 'else' ? id : void 0;
        id = join('_', split(id, '*'));
        id = join('_', split(id, '.'));
        id = subs(id, 0, 2) === '->' ? subs(join('-to-', split(id, '->')), 1) : join('-to-', split(id, '->'));
        id = join(split(id, '!'));
        id = join('$', split(id, '%'));
        id = join('-equal-', split(id, '='));
        id = join('-plus-', split(id, '+'));
        id = join('-and-', split(id, '&'));
        id = last(id) === '?' ? '' + 'is-' + subs(id, 0, dec(count(id))) : id;
        id = toPrivatePrefix(id);
        id = reduce(toCamelJoin, '', split(id, '-'));
        return id;
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
            } : void 0;
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
                        'line': inc(get.apply(void 0, [
                            startø1,
                            'line',
                            -1
                        ])),
                        'column': get.apply(void 0, [
                            startø1,
                            'column',
                            -1
                        ])
                    },
                    'end': {
                        'line': inc(get.apply(void 0, [
                            endø1,
                            'line',
                            -1
                        ])),
                        'column': get.apply(void 0, [
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
            })() : void 0;
            return conj(writeLocation((form || 0)['form'], (form || 0)['original-form']), writerø1(form));
        }.call(this);
    };
var __specials__ = exports.__specials__ = {};
var installSpecial = exports.installSpecial = function installSpecial(op, writer) {
        return (__specials__ || 0)[name(op)] = writer;
    };
var writeSpecial = exports.writeSpecial = function writeSpecial(writer, form) {
        return conj(writeLocation((form || 0)['form'], (form || 0)['original-form']), writer.apply(void 0, (form || 0)['params']));
    };
var writeNil = exports.writeNil = function writeNil(form) {
        return {
            'type': 'UnaryExpression',
            'operator': 'void',
            'argument': {
                'type': 'Literal',
                'value': 0
            },
            'prefix': true
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
                'form': symbol(void 0, 'list')
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
                'form': symbol(void 0, 'symbol')
            }),
            'arguments': [
                writeConstant((form || 0)['namespace']),
                writeConstant((form || 0)['name'])
            ]
        };
    };
installWriter('symbol', writeSymbol);
var writeConstant = exports.writeConstant = function writeConstant(form) {
        return isNil(form) ? writeNil(form) : isKeyword(form) ? writeLiteral(namespace(form) ? '' + namespace(form) + '/' + name(form) : name(form)) : isNumber(form) ? writeNumber(form.valueOf()) : isString(form) ? writeString(form) : 'else' ? writeLiteral(form) : void 0;
    };
installWriter('constant', function ($1) {
    return writeConstant(($1 || 0)['form']);
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
            var resolvedIdø1 = (form || 0)['shadow'] ? symbol(void 0, '' + translateIdentifier(baseIdø1) + __uniqueChar__ + (form || 0)['depth']) : baseIdø1;
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
                    'form': withMeta(symbol(void 0, 'exports'), meta(((form || 0)['id'] || 0)['form']))
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
            var resultø1 = (form || 0)['result'] ? toReturn((form || 0)['result']) : void 0;
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
                    'id': void 0,
                    'params': [],
                    'defaults': [],
                    'expression': false,
                    'generator': false,
                    'rest': void 0,
                    'body': toBlock(body)
                }])
        };
    };
var writeDo = exports.writeDo = function writeDo(form) {
        return (meta(first((form || 0)['form'])) || 0)['block'] ? toBlock(writeBody(conj(form, {
            'result': void 0,
            'statements': conj((form || 0)['statements'], (form || 0)['result'])
        }))) : toExpression.apply(void 0, writeBody(form));
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
                'finalizer': finalizerø1 ? toBlock(writeBody(finalizerø1)) : !handlerø1 ? toBlock([]) : 'else' ? void 0 : void 0
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
                    'rest': void 0,
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
            return toIife(toBlock(vec(bodyø1)), symbol(void 0, 'loop'));
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
            'test': void 0,
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
                    'form': symbol(void 0, 'Array.prototype.slice.call')
                },
                'params': [
                    {
                        'op': 'var',
                        'form': symbol(void 0, 'arguments')
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
                        'form': symbol(void 0, 'arguments')
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
            var bindingsø1 = (form || 0)['variadic'] ? conj(writeOverloadingParams(butlast(paramsø1)), spliceBinding(form)) : writeOverloadingParams(paramsø1);
            var statementsø1 = vec(concat(bindingsø1, (form || 0)['statements']));
            return {
                'type': 'SwitchCase',
                'test': !(form || 0)['variadic'] ? {
                    'type': 'Literal',
                    'value': (form || 0)['arity']
                } : void 0,
                'consequent': writeBody(conj(form, { 'statements': statementsø1 }))
            };
        }.call(this);
    };
var writeSimpleFn = exports.writeSimpleFn = function writeSimpleFn(form) {
        return function () {
            var methodø1 = first((form || 0)['methods']);
            var paramsø1 = (methodø1 || 0)['variadic'] ? butlast((methodø1 || 0)['params']) : (methodø1 || 0)['params'];
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
        return symbol(void 0, join('*', split(name(id), '.')));
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
                            'form': symbol(void 0, 'require')
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
                } : void 0;
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
                        'form': symbol(void 0, '*ns*')
                    },
                    'init': {
                        'op': 'dictionary',
                        'form': nodeø1,
                        'keys': [
                            {
                                'op': 'var',
                                'type': 'identifier',
                                'original-form': nodeø1,
                                'form': symbol(void 0, 'id')
                            },
                            {
                                'op': 'var',
                                'type': 'identifier',
                                'original-form': nodeø1,
                                'form': symbol(void 0, 'doc')
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
            var requirementsø1 = vec(concat.apply(void 0, map(function ($1) {
                    return writeRequire($1, requirerø1);
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
                'id': (form || 0)['id'] ? writeVar((form || 0)['id']) : void 0,
                'defaults': void 0,
                'rest': void 0,
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
        switch (arguments.length) {
        case 1:
            var form = arguments[0];
            return compile({}, form);
        default:
            var options = arguments[0];
            var forms = Array.prototype.slice.call(arguments, 1);
            return generate(write_.apply(void 0, forms), options);
        }
    };
var getMacro = exports.getMacro = function getMacro() {
        switch (arguments.length) {
        case 2:
            var target = arguments[0];
            var property = arguments[1];
            return list.apply(void 0, [symbol(void 0, 'aget')].concat([list.apply(void 0, [symbol(void 0, 'or')].concat([target], [0]))], [property]));
        case 3:
            var target = arguments[0];
            var property = arguments[1];
            var default_ = arguments[2];
            return default_ === void 0 ? list.apply(void 0, [symbol(void 0, 'get')].concat([target], [property])) : list.apply(void 0, [symbol(void 0, 'apply')].concat([symbol(void 0, 'get')], [[
                    target,
                    property,
                    default_
                ]]));
        default:
            throw RangeError('Wrong number of arguments passed');
        }
    };
installMacro('get', getMacro);
var installLogicalOperator = exports.installLogicalOperator = function installLogicalOperator(callee, operator, fallback) {
        var writeLogicalOperator = function writeLogicalOperator() {
            var operands = Array.prototype.slice.call(arguments, 0);
            return function () {
                var nø1 = count(operands);
                return isEqual(nø1, 0) ? writeConstant(fallback) : isEqual(nø1, 1) ? write(first(operands)) : 'else' ? reduce(function (left, right) {
                    return {
                        'type': 'LogicalExpression',
                        'operator': operator,
                        'left': left,
                        'right': write(right)
                    };
                }, write(first(operands)), rest(operands)) : void 0;
            }.call(this);
        };
        return installSpecial(callee, writeLogicalOperator);
    };
installLogicalOperator('or', '||', void 0);
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
installBinaryOperator('bit-shift-right-zero-fil', '>>>');
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
                return isValid && !isValid(nø1) ? errorArgCount(name(callee), nø1) : nø1 == 0 ? writeLiteral(fallback) : nø1 == 1 ? reduce(writeBinaryOperator, writeLiteral(fallback), params) : 'else' ? reduce(writeBinaryOperator, write(first(params)), rest(params)) : void 0;
            }.call(this);
        };
        return installSpecial(callee, writeArithmeticOperator);
    };
installArithmeticOperator('+', '+', void 0, 0);
installArithmeticOperator('-', '-', function ($1) {
    return $1 >= 1;
}, 0);
installArithmeticOperator('*', '*', void 0, 1);
installArithmeticOperator(keyword('/'), keyword('/'), function ($1) {
    return $1 >= 1;
}, 1);
installArithmeticOperator('rem', keyword('%'), function ($1) {
    return $1 == 2;
}, 1);
var installComparisonOperator = exports.installComparisonOperator = function installComparisonOperator(callee, operator, fallback) {
        var writeComparisonOperator = function writeComparisonOperator() {
            switch (arguments.length) {
            case 0:
                return errorArgCount(callee, 0);
            case 1:
                var form = arguments[0];
                return toSequence([
                    write(form),
                    writeLiteral(fallback)
                ]);
            case 2:
                var left = arguments[0];
                var right = arguments[1];
                return {
                    'type': 'BinaryExpression',
                    'operator': operator,
                    'left': write(left),
                    'right': write(right)
                };
            default:
                var left = arguments[0];
                var right = arguments[1];
                var more = Array.prototype.slice.call(arguments, 2);
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
                }, writeComparisonOperator(left, right), more);
            }
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
            return isEmpty(prefixø1) ? list.apply(void 0, [symbol(void 0, '.apply')].concat([f], [void 0], vec(params))) : list.apply(void 0, [symbol(void 0, '.apply')].concat([f], [void 0], [list.apply(void 0, [symbol(void 0, '.concat')].concat([prefixø1], [last(params)]))]));
        }.call(this);
    };
installMacro('apply', expandApply);
var expandPrint = exports.expandPrint = function expandPrint(_andForm) {
        var more = Array.prototype.slice.call(arguments, 1);
        'Prints the object(s) to the output for human consumption.';
        return function () {
            var opø1 = withMeta(symbol(void 0, 'console.log'), meta(_andForm));
            return list.apply(void 0, [opø1].concat(vec(more)));
        }.call(this);
    };
installMacro('print', withMeta(expandPrint, { 'implicit': ['&form'] }));
var expandStr = exports.expandStr = function expandStr() {
        var forms = Array.prototype.slice.call(arguments, 0);
        return list.apply(void 0, [symbol(void 0, '+')].concat([''], vec(forms)));
    };
installMacro('str', expandStr);
var expandDebug = exports.expandDebug = function expandDebug() {
        return symbol(void 0, 'debugger');
    };
installMacro('debugger!', expandDebug);
var expandAssert = exports.expandAssert = function expandAssert() {
        switch (arguments.length) {
        case 1:
            var x = arguments[0];
            return expandAssert(x, '');
        case 2:
            var x = arguments[0];
            var message = arguments[1];
            return function () {
                var formø1 = prStr(x);
                return list.apply(void 0, [symbol(void 0, 'if')].concat([list.apply(void 0, [symbol(void 0, 'not')].concat([x]))], [list.apply(void 0, [symbol(void 0, 'throw')].concat([list.apply(void 0, [symbol(void 0, 'Error')].concat([list.apply(void 0, [symbol(void 0, 'str')].concat(['Assert failed: '], [message], [formø1]))]))]))]));
            }.call(this);
        default:
            throw RangeError('Wrong number of arguments passed');
        }
    };
installMacro('assert', expandAssert);
var expandTypestr = exports.expandTypestr = function expandTypestr(it) {
        return function () {
            var prefixø1 = '[object ';
            var suffixø1 = ']';
            return list.apply(void 0, [symbol(void 0, '->')].concat([list.apply(void 0, [symbol(void 0, '.call')].concat([symbol(void 0, 'Object.prototype.to-string')], [it]))], [list.apply(void 0, [symbol(void 0, '.slice')].concat([count(prefixø1)], [0 - count(suffixø1)]))]));
        }.call(this);
    };
var expandDefprotocol = exports.expandDefprotocol = function expandDefprotocol(_andEnv, id) {
        var forms = Array.prototype.slice.call(arguments, 2);
        return function () {
            var nsø1 = name(((_andEnv || 0)['ns'] || 0)['name']);
            var protocolNameø1 = name(id);
            var protocolDocø1 = isString(first(forms)) ? first(forms) : void 0;
            var protocolMethodsø1 = protocolDocø1 ? rest(forms) : forms;
            var notSupportedø1 = function (method) {
                return list.apply(void 0, [symbol(void 0, 'fn')].concat([[symbol(void 0, '%1')].concat()], [list.apply(void 0, [symbol(void 0, 'throw')].concat([list.apply(void 0, [symbol(void 0, 'str')].concat(['' + 'No protocol method ' + protocolNameø1 + '.' + method + ' defined for type '], [expandTypestr(symbol(void 0, '%1'))], [': '], [symbol(void 0, '%1')]))]))]));
            };
            var protocolø1 = mapv(function (method) {
                    return function () {
                        var methodNameø1 = first(method);
                        var idø2 = idToNs('' + nsø1 + '$' + protocolNameø1 + '$' + name(methodNameø1));
                        return {
                            'id': methodNameø1,
                            'fn': list.apply(void 0, [symbol(void 0, 'fn')].concat([idø2], [[symbol(void 0, 'self')].concat()], [list.apply(void 0, [symbol(void 0, '.apply')].concat([list.apply(void 0, [symbol(void 0, 'or')].concat([list.apply(void 0, [symbol(void 0, 'if')].concat([list.apply(void 0, [symbol(void 0, 'or')].concat([list.apply(void 0, [symbol(void 0, 'identical?')].concat([symbol(void 0, 'self')], [symbol(void 0, 'null')]))], [list.apply(void 0, [symbol(void 0, 'identical?')].concat([symbol(void 0, 'self')], [void 0]))]))], [list.apply(void 0, [symbol(void 0, '.-nil')].concat([idø2]))], [list.apply(void 0, [symbol(void 0, 'or')].concat([list.apply(void 0, [symbol(void 0, 'aget')].concat([symbol(void 0, 'self')], [list.apply(void 0, [symbol(void 0, 'quote')].concat([idø2]))]))], [list.apply(void 0, [symbol(void 0, 'aget')].concat([idø2], [expandTypestr(symbol(void 0, 'self'))]))], [list.apply(void 0, [symbol(void 0, '.-_')].concat([idø2]))]))]))], [notSupportedø1(name(idø2))]))], [symbol(void 0, 'self')], [symbol(void 0, 'arguments')]))]))
                        };
                    }.call(this);
                }, protocolMethodsø1);
            var fnsø1 = map(function (form) {
                    return list.apply(void 0, [symbol(void 0, 'def')].concat([(form || 0)['id']], [list.apply(void 0, [symbol(void 0, 'aget')].concat([id], [list.apply(void 0, [symbol(void 0, 'quote')].concat([(form || 0)['id']]))]))]));
                }, protocolø1);
            var satisfyø1 = { 'wisp_core$IProtocol$id': '' + nsø1 + '/' + protocolNameø1 };
            var bodyø1 = reduce(function (body, method) {
                    return assoc(body, (method || 0)['id'], (method || 0)['fn']);
                }, satisfyø1, protocolø1);
            return list.apply(void 0, [withMeta(symbol(void 0, 'do'), { 'block': true })].concat([list.apply(void 0, [symbol(void 0, 'def')].concat([id], [bodyø1]))], vec(fnsø1), [id]));
        }.call(this);
    };
installMacro('defprotocol', withMeta(expandDefprotocol, { 'implicit': ['&env'] }));
var expandDeftype = exports.expandDeftype = function expandDeftype(id, fields) {
        var forms = Array.prototype.slice.call(arguments, 2);
        return function () {
            var typeInitø1 = map(function (field) {
                    return list.apply(void 0, [symbol(void 0, 'set!')].concat([list.apply(void 0, [symbol(void 0, 'aget')].concat([symbol(void 0, 'this')], [list.apply(void 0, [symbol(void 0, 'quote')].concat([field]))]))], [field]));
                }, fields);
            var constructorø1 = conj(typeInitø1, symbol(void 0, 'this'));
            var methodInitø1 = map(function (field) {
                    return list.apply(void 0, [symbol(void 0, 'def')].concat([field], [list.apply(void 0, [symbol(void 0, 'aget')].concat([symbol(void 0, 'this')], [list.apply(void 0, [symbol(void 0, 'quote')].concat([field]))]))]));
                }, fields);
            var makeMethodø1 = function (protocol, form) {
                return function () {
                    var methodNameø1 = first(form);
                    var paramsø1 = second(form);
                    var bodyø1 = rest(rest(form));
                    var fieldNameø1 = isEqual(name(protocol), 'Object') ? list.apply(void 0, [symbol(void 0, 'quote')].concat([methodNameø1])) : list.apply(void 0, [symbol(void 0, '.-name')].concat([list.apply(void 0, [symbol(void 0, 'aget')].concat([protocol], [list.apply(void 0, [symbol(void 0, 'quote')].concat([methodNameø1]))]))]));
                    return list.apply(void 0, [symbol(void 0, 'set!')].concat([list.apply(void 0, [symbol(void 0, 'aget')].concat([list.apply(void 0, [symbol(void 0, '.-prototype')].concat([id]))], [fieldNameø1]))], [list.apply(void 0, [symbol(void 0, 'fn')].concat([paramsø1], vec(methodInitø1), vec(bodyø1)))]));
                }.call(this);
            };
            var satisfyø1 = function (protocol) {
                return list.apply(void 0, [symbol(void 0, 'set!')].concat([list.apply(void 0, [symbol(void 0, 'aget')].concat([list.apply(void 0, [symbol(void 0, '.-prototype')].concat([id]))], [list.apply(void 0, [symbol(void 0, '.-wisp_core$IProtocol$id')].concat([protocol]))]))], [true]));
            };
            var bodyø1 = reduce(function (type, form) {
                    return isList(form) ? conj(type, { 'body': conj((type || 0)['body'], makeMethodø1((type || 0)['protocol'], form)) }) : conj(type, {
                        'protocol': form,
                        'body': conj((type || 0)['body'], satisfyø1(form))
                    });
                }, {
                    'protocol': void 0,
                    'body': []
                }, forms);
            var methodsø1 = (bodyø1 || 0)['body'];
            return list.apply(void 0, [symbol(void 0, 'def')].concat([id], [list.apply(void 0, [symbol(void 0, 'do')].concat([list.apply(void 0, [symbol(void 0, 'defn-')].concat([id], [fields], vec(constructorø1)))], vec(methodsø1), [id]))]));
        }.call(this);
    };
installMacro('deftype', expandDeftype);
installMacro('defrecord', expandDeftype);
var expandExtendType = exports.expandExtendType = function expandExtendType(type) {
        var forms = Array.prototype.slice.call(arguments, 1);
        return function () {
            var isDefaultTypeø1 = isEqual(type, symbol(void 0, 'default'));
            var isNilTypeø1 = isNil(type);
            var typeNameø1 = isNil(type) ? symbol('nil') : isEqual(type, symbol(void 0, 'default')) ? symbol(void 0, '_') : isEqual(type, symbol(void 0, 'number')) ? symbol(void 0, 'Number') : isEqual(type, symbol(void 0, 'string')) ? symbol(void 0, 'String') : isEqual(type, symbol(void 0, 'boolean')) ? symbol(void 0, 'Boolean') : isEqual(type, symbol(void 0, 'vector')) ? symbol(void 0, 'Array') : isEqual(type, symbol(void 0, 'function')) ? symbol(void 0, 'Function') : isEqual(type, symbol(void 0, 're-pattern')) ? symbol(void 0, 'RegExp') : isEqual(namespace(type), 'js') ? type : 'else' ? void 0 : void 0;
            var satisfyø1 = function (protocol) {
                return typeNameø1 ? list.apply(void 0, [symbol(void 0, 'set!')].concat([list.apply(void 0, [symbol(void 0, 'aget')].concat([protocol], [list.apply(void 0, [symbol(void 0, 'quote')].concat([symbol('' + 'wisp_core$IProtocol$' + name(typeNameø1))]))]))], [true])) : list.apply(void 0, [symbol(void 0, 'set!')].concat([list.apply(void 0, [symbol(void 0, 'aget')].concat([list.apply(void 0, [symbol(void 0, '.-prototype')].concat([type]))], [list.apply(void 0, [symbol(void 0, '.-wisp_core$IProtocol$id')].concat([protocol]))]))], [true]));
            };
            var makeMethodø1 = function (protocol, form) {
                return function () {
                    var methodNameø1 = first(form);
                    var paramsø1 = second(form);
                    var bodyø1 = rest(rest(form));
                    var targetø1 = typeNameø1 ? list.apply(void 0, [symbol(void 0, 'aget')].concat([list.apply(void 0, [symbol(void 0, 'aget')].concat([protocol], [list.apply(void 0, [symbol(void 0, 'quote')].concat([methodNameø1]))]))], [list.apply(void 0, [symbol(void 0, 'quote')].concat([typeNameø1]))])) : list.apply(void 0, [symbol(void 0, 'aget')].concat([list.apply(void 0, [symbol(void 0, '.-prototype')].concat([type]))], [list.apply(void 0, [symbol(void 0, '.-name')].concat([list.apply(void 0, [symbol(void 0, 'aget')].concat([protocol], [list.apply(void 0, [symbol(void 0, 'quote')].concat([methodNameø1]))]))]))]));
                    return list.apply(void 0, [symbol(void 0, 'set!')].concat([targetø1], [list.apply(void 0, [symbol(void 0, 'fn')].concat([paramsø1], vec(bodyø1)))]));
                }.call(this);
            };
            var bodyø1 = reduce(function (body, form) {
                    return isList(form) ? conj(body, { 'methods': conj((body || 0)['methods'], makeMethodø1((body || 0)['protocol'], form)) }) : conj(body, {
                        'protocol': form,
                        'methods': conj((body || 0)['methods'], satisfyø1(form))
                    });
                }, {
                    'protocol': void 0,
                    'methods': []
                }, forms);
            var methodsø1 = (bodyø1 || 0)['methods'];
            return list.apply(void 0, [symbol(void 0, 'do')].concat(vec(methodsø1), [void 0]));
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
                }, void 0, forms);
            var bodyø1 = map(function (form) {
                    return list.apply(void 0, [symbol(void 0, 'extend-type')].concat([(form || 0)['type']], [protocol], vec((form || 0)['methods'])));
                }, specsø1);
            return list.apply(void 0, [symbol(void 0, 'do')].concat(vec(bodyø1), [void 0]));
        }.call(this);
    };
installMacro('extend-protocol', expandExtendProtocol);
var asetExpand = exports.asetExpand = function asetExpand() {
        switch (arguments.length) {
        case 3:
            var target = arguments[0];
            var field = arguments[1];
            var value = arguments[2];
            return list.apply(void 0, [symbol(void 0, 'set!')].concat([list.apply(void 0, [symbol(void 0, 'aget')].concat([target], [field]))], [value]));
        default:
            var target = arguments[0];
            var field = arguments[1];
            var subField = arguments[2];
            var subFieldsAndValue = Array.prototype.slice.call(arguments, 3);
            return function () {
                var resolvedTargetø1 = reduce(function (form, node) {
                        return list.apply(void 0, [symbol(void 0, 'aget')].concat([form], [node]));
                    }, list.apply(void 0, [symbol(void 0, 'aget')].concat([target], [field])), cons(subField, butlast(subFieldsAndValue)));
                var valueø1 = last(subFieldsAndValue);
                return list.apply(void 0, [symbol(void 0, 'set!')].concat([resolvedTargetø1], [valueø1]));
            }.call(this);
        }
    };
installMacro('aset', asetExpand);
var alengthExpand = exports.alengthExpand = function alengthExpand(array) {
        return list.apply(void 0, [symbol(void 0, '.-length')].concat([array]));
    };
installMacro('alength', alengthExpand);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndpc3AvYmFja2VuZC9lc2NvZGVnZW4vd3JpdGVyLndpc3AiXSwibmFtZXMiOlsiX25zXyIsImlkIiwiZG9jIiwicmVhZEZyb21TdHJpbmciLCJtZXRhIiwid2l0aE1ldGEiLCJpc1N5bWJvbCIsInN5bWJvbCIsImlzS2V5d29yZCIsImtleXdvcmQiLCJuYW1lc3BhY2UiLCJpc1VucXVvdGUiLCJpc1VucXVvdGVTcGxpY2luZyIsImlzUXVvdGUiLCJpc1N5bnRheFF1b3RlIiwibmFtZSIsImdlbnN5bSIsInByU3RyIiwiaXNFbXB0eSIsImNvdW50IiwiaXNMaXN0IiwibGlzdCIsImZpcnN0Iiwic2Vjb25kIiwidGhpcmQiLCJyZXN0IiwiY29ucyIsImNvbmoiLCJidXRsYXN0IiwicmV2ZXJzZSIsInJlZHVjZSIsInZlYyIsImxhc3QiLCJtYXAiLCJtYXB2IiwiZmlsdGVyIiwidGFrZSIsImNvbmNhdCIsInBhcnRpdGlvbiIsInJlcGVhdCIsImludGVybGVhdmUiLCJhc3NvYyIsImlzT2RkIiwiaXNEaWN0aW9uYXJ5IiwiZGljdGlvbmFyeSIsIm1lcmdlIiwia2V5cyIsInZhbHMiLCJpc0NvbnRhaW5zVmVjdG9yIiwibWFwRGljdGlvbmFyeSIsImlzU3RyaW5nIiwiaXNOdW1iZXIiLCJpc1ZlY3RvciIsImlzQm9vbGVhbiIsInN1YnMiLCJyZUZpbmQiLCJpc1RydWUiLCJpc0ZhbHNlIiwiaXNOaWwiLCJpc1JlUGF0dGVybiIsImluYyIsImRlYyIsInN0ciIsImNoYXIiLCJpbnQiLCJpc0VxdWFsIiwiaXNTdHJpY3RFcXVhbCIsImdldCIsInNwbGl0Iiwiam9pbiIsInVwcGVyQ2FzZSIsInJlcGxhY2UiLCJ0cmltbCIsImluc3RhbGxNYWNybyIsImdlbmVyYXRlIiwiX191bmlxdWVDaGFyX18iLCJleHBvcnRzIiwidG9DYW1lbEpvaW4iLCJwcmVmaXgiLCJrZXkiLCJ0b1ByaXZhdGVQcmVmaXgiLCJzcGFjZURlbGltaXRlZMO4MSIsImxlZnRUcmltbWVkw7gxIiwibsO4MSIsInRyYW5zbGF0ZUlkZW50aWZpZXJXb3JkIiwiZm9ybSIsInRyYW5zbGF0ZUlkZW50aWZpZXIiLCJuc8O4MSIsImVycm9yQXJnQ291bnQiLCJjYWxsZWUiLCJuIiwiU3ludGF4RXJyb3IiLCJpbmhlcml0TG9jYXRpb24iLCJib2R5Iiwic3RhcnTDuDEiLCJlbmTDuDEiLCJ3cml0ZUxvY2F0aW9uIiwib3JpZ2luYWwiLCJkYXRhw7gxIiwiaW5oZXJpdGVkw7gxIiwiX193cml0ZXJzX18iLCJpbnN0YWxsV3JpdGVyIiwib3AiLCJ3cml0ZXIiLCJ3cml0ZU9wIiwid3JpdGVyw7gxIiwiX19zcGVjaWFsc19fIiwiaW5zdGFsbFNwZWNpYWwiLCJ3cml0ZVNwZWNpYWwiLCJ3cml0ZU5pbCIsIndyaXRlTGl0ZXJhbCIsIndyaXRlTGlzdCIsIndyaXRlIiwid3JpdGVTeW1ib2wiLCJ3cml0ZUNvbnN0YW50Iiwid3JpdGVOdW1iZXIiLCJ2YWx1ZU9mIiwid3JpdGVTdHJpbmciLCIkMSIsIndyaXRlS2V5d29yZCIsInRvSWRlbnRpZmllciIsIndyaXRlQmluZGluZ1ZhciIsImJhc2VJZMO4MSIsInJlc29sdmVkSWTDuDEiLCJ3cml0ZVZhciIsIm5vZGUiLCJ3cml0ZUludm9rZSIsIndyaXRlVmVjdG9yIiwid3JpdGVEaWN0aW9uYXJ5IiwicHJvcGVydGllc8O4MSIsInBhaXIiLCJrZXnDuDEiLCJ2YWx1ZcO4MSIsIndyaXRlRXhwb3J0Iiwid3JpdGVEZWYiLCJ3cml0ZUJpbmRpbmciLCJpZMO4MSIsImluaXTDuDEiLCJ3cml0ZVRocm93IiwidG9FeHByZXNzaW9uIiwid3JpdGVOZXciLCJ3cml0ZVNldCIsIndyaXRlQWdldCIsIl9fc3RhdGVtZW50c19fIiwid3JpdGVTdGF0ZW1lbnQiLCJ0b1N0YXRlbWVudCIsInRvUmV0dXJuIiwid3JpdGVCb2R5Iiwic3RhdGVtZW50c8O4MSIsInJlc3VsdMO4MSIsInRvQmxvY2siLCJ0b1NlcXVlbmNlIiwid3JpdGVEbyIsIndyaXRlSWYiLCJ3cml0ZVRyeSIsImhhbmRsZXLDuDEiLCJmaW5hbGl6ZXLDuDEiLCJ3cml0ZUJpbmRpbmdWYWx1ZSIsIndyaXRlQmluZGluZ1BhcmFtIiwid3JpdGVMZXQiLCJib2R5w7gxIiwidG9JaWZlIiwidG9SZWJpbmQiLCJiaW5kaW5nc8O4MSIsImV4cHJlc3Npb25zIiwidG9Mb29wSW5pdCIsInRvRG9XaGlsZSIsInRlc3QiLCJ0b1NldFJlY3VyIiwidG9Mb29wIiwid3JpdGVMb29wIiwibG9vcEJvZHnDuDEiLCJ0b1JlY3VyIiwicGFyYW1zw7gxIiwid3JpdGVSZWN1ciIsImZhbGxiYWNrT3ZlcmxvYWQiLCJzcGxpY2VCaW5kaW5nIiwid3JpdGVPdmVybG9hZGluZ1BhcmFtcyIsInBhcmFtcyIsImZvcm1zIiwicGFyYW0iLCJ3cml0ZU92ZXJsb2FkaW5nRm4iLCJvdmVybG9hZHPDuDEiLCJ3cml0ZUZuT3ZlcmxvYWQiLCJ3cml0ZVNpbXBsZUZuIiwibWV0aG9kw7gxIiwicmVzb2x2ZSIsImZyb20iLCJ0byIsInJlcXVpcmVyw7gxIiwicmVxdWlyZW1lbnTDuDEiLCJpc1JlbGF0aXZlw7gxIiwiZnJvbcO4MiIsInRvw7gyIiwiaWRUb05zIiwid3JpdGVSZXF1aXJlIiwicmVxdWlyZXIiLCJuc0JpbmRpbmfDuDEiLCJuc0FsaWFzw7gxIiwicmVmZXJlbmNlc8O4MSIsInJlZmVyZW5jZXMiLCJ3cml0ZU5zIiwibm9kZcO4MSIsInJlcXVpcmVtZW50c8O4MSIsIndyaXRlRm4iLCJiYXNlw7gxIiwib3DDuDEiLCJ3cml0ZV8iLCJjb21waWxlIiwib3B0aW9ucyIsImdldE1hY3JvIiwidGFyZ2V0IiwicHJvcGVydHkiLCJkZWZhdWx0XyIsImluc3RhbGxMb2dpY2FsT3BlcmF0b3IiLCJvcGVyYXRvciIsImZhbGxiYWNrIiwid3JpdGVMb2dpY2FsT3BlcmF0b3IiLCJvcGVyYW5kcyIsImxlZnQiLCJyaWdodCIsImluc3RhbGxVbmFyeU9wZXJhdG9yIiwiaXNQcmVmaXgiLCJ3cml0ZVVuYXJ5T3BlcmF0b3IiLCJpbnN0YWxsQmluYXJ5T3BlcmF0b3IiLCJ3cml0ZUJpbmFyeU9wZXJhdG9yIiwiaW5zdGFsbEFyaXRobWV0aWNPcGVyYXRvciIsImlzVmFsaWQiLCJ3cml0ZUFyaXRobWV0aWNPcGVyYXRvciIsImluc3RhbGxDb21wYXJpc29uT3BlcmF0b3IiLCJ3cml0ZUNvbXBhcmlzb25PcGVyYXRvciIsIm1vcmUiLCJpc1dyaXRlSWRlbnRpY2FsIiwiaXNXcml0ZUluc3RhbmNlIiwiY29uc3RydWN0b3LDuDEiLCJpbnN0YW5jZcO4MSIsImV4cGFuZEFwcGx5IiwiZiIsInByZWZpeMO4MSIsImV4cGFuZFByaW50IiwiX2FuZEZvcm0iLCJleHBhbmRTdHIiLCJleHBhbmREZWJ1ZyIsImV4cGFuZEFzc2VydCIsIngiLCJtZXNzYWdlIiwiZm9ybcO4MSIsImV4cGFuZFR5cGVzdHIiLCJpdCIsInN1ZmZpeMO4MSIsImV4cGFuZERlZnByb3RvY29sIiwiX2FuZEVudiIsInByb3RvY29sTmFtZcO4MSIsInByb3RvY29sRG9jw7gxIiwicHJvdG9jb2xNZXRob2Rzw7gxIiwibm90U3VwcG9ydGVkw7gxIiwibWV0aG9kIiwicHJvdG9jb2zDuDEiLCJtZXRob2ROYW1lw7gxIiwiaWTDuDIiLCJmbnPDuDEiLCJzYXRpc2Z5w7gxIiwiZXhwYW5kRGVmdHlwZSIsImZpZWxkcyIsInR5cGVJbml0w7gxIiwiZmllbGQiLCJtZXRob2RJbml0w7gxIiwibWFrZU1ldGhvZMO4MSIsInByb3RvY29sIiwiZmllbGROYW1lw7gxIiwidHlwZSIsIm1ldGhvZHPDuDEiLCJleHBhbmRFeHRlbmRUeXBlIiwiaXNEZWZhdWx0VHlwZcO4MSIsImlzTmlsVHlwZcO4MSIsInR5cGVOYW1lw7gxIiwidGFyZ2V0w7gxIiwiZXhwYW5kRXh0ZW5kUHJvdG9jb2wiLCJzcGVjc8O4MSIsInNwZWNzIiwiYXNldEV4cGFuZCIsInZhbHVlIiwic3ViRmllbGQiLCJzdWJGaWVsZHNBbmRWYWx1ZSIsInJlc29sdmVkVGFyZ2V0w7gxIiwiYWxlbmd0aEV4cGFuZCIsImFycmF5Il0sIm1hcHBp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c0QsS0FBQSxHO2dCQUFNaUIsUUFBQSxHO2dCQUFZQyxpQkFBQSxHO1lBQzFCLE8sWUFBTTtBQUFBLG9CQUFBQyxnQixHQUFpQjlQLE1BQUQsQ0FBUSxVQUFLdUQsSUFBTCxFQUFVd0MsSUFBVixFQUNFO0FBQUEsK0IsVUFBQSxDLE1BQUEsRSxPQUFFLEMsTUFBQSxFLE1BQUEsQyxVQUFNeEMsSSxJQUFNd0MsSSxFQUFkO0FBQUEscUJBRFYsRSxVQUVRLEMsTUFBQSxFLE9BQUUsQyxNQUFBLEUsTUFBQSxDLFVBQU1zRixNLElBQVFzRCxLLEVBQWhCLENBRlIsRUFHUy9PLElBQUQsQ0FBTWdRLFFBQU4sRUFBaUI5UCxPQUFELENBQVMrUCxpQkFBVCxDQUFoQixDQUhSLENBQWhCO0FBQUEsZ0JBSUEsSUFBQXZKLE8sR0FBT3BHLElBQUQsQ0FBTTJQLGlCQUFOLENBQU4sQ0FKQTtBQUFBLGdCQUtKLE8sVUFBQSxDLE1BQUEsRSxPQUFFLEMsTUFBQSxFLE1BQUEsQyxVQUFNQyxnQixJQUFpQnhKLE8sRUFBekIsRUFMSTtBQUFBLGEsS0FBTixDLElBQUEsRTs7S0FKSCxDO0FBVUMzRCxZQUFELEMsTUFBQSxFQUFzQitNLFVBQXRCLEU7QUFFQSxJQUFNSyxhQUFBLEdBQUFqTixPQUFBLENBQUFpTixhQUFBLEdBQU4sU0FBTUEsYUFBTixDQUVHQyxLQUZILEVBR0U7QUFBQSxlLFVBQUEsQyxNQUFBLEUsT0FBRSxDLE1BQUEsRSxVQUFBLEMsVUFBVUEsSyxFQUFaO0FBQUEsS0FIRixDO0FBSUNyTixZQUFELEMsU0FBQSxFQUF5Qm9OLGFBQXpCIiwic291cmNlc0NvbnRlbnQiOlsiKG5zIHdpc3AuYmFja2VuZC5lc2NvZGVnZW4ud3JpdGVyXG4gICg6cmVxdWlyZSBbd2lzcC5yZWFkZXIgOnJlZmVyIFtyZWFkLWZyb20tc3RyaW5nXV1cbiAgICAgICAgICAgIFt3aXNwLmFzdCA6cmVmZXIgW21ldGEgd2l0aC1tZXRhIHN5bWJvbD8gc3ltYm9sIGtleXdvcmQ/IGtleXdvcmRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWVzcGFjZSB1bnF1b3RlPyB1bnF1b3RlLXNwbGljaW5nPyBxdW90ZT9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN5bnRheC1xdW90ZT8gbmFtZSBnZW5zeW0gcHItc3RyXV1cbiAgICAgICAgICAgIFt3aXNwLnNlcXVlbmNlIDpyZWZlciBbZW1wdHk/IGNvdW50IGxpc3Q/IGxpc3QgZmlyc3Qgc2Vjb25kIHRoaXJkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3QgY29ucyBjb25qIGJ1dGxhc3QgcmV2ZXJzZSByZWR1Y2UgdmVjXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3QgbWFwIG1hcHYgZmlsdGVyIHRha2UgY29uY2F0IHBhcnRpdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXBlYXQgaW50ZXJsZWF2ZSBhc3NvY11dXG4gICAgICAgICAgICBbd2lzcC5ydW50aW1lIDpyZWZlciBbb2RkPyBkaWN0aW9uYXJ5PyBkaWN0aW9uYXJ5IG1lcmdlIGtleXMgdmFsc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRhaW5zLXZlY3Rvcj8gbWFwLWRpY3Rpb25hcnkgc3RyaW5nP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG51bWJlcj8gdmVjdG9yPyBib29sZWFuPyBzdWJzIHJlLWZpbmQgdHJ1ZT9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWxzZT8gbmlsPyByZS1wYXR0ZXJuPyBpbmMgZGVjIHN0ciBjaGFyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW50ID0gPT0gZ2V0XV1cbiAgICAgICAgICAgIFt3aXNwLnN0cmluZyA6cmVmZXIgW3NwbGl0IGpvaW4gdXBwZXItY2FzZSByZXBsYWNlIHRyaW1sXV1cbiAgICAgICAgICAgIFt3aXNwLmV4cGFuZGVyIDpyZWZlciBbaW5zdGFsbC1tYWNybyFdXVxuICAgICAgICAgICAgW2VzY29kZWdlbiA6cmVmZXIgW2dlbmVyYXRlXV0pKVxuXG5cbjs7IERlZmluZSBjaGFyYWN0ZXIgdGhhdCBpcyB2YWxpZCBKUyBpZGVudGlmaWVyIHRoYXQgd2lsbFxuOzsgYmUgdXNlZCBpbiBnZW5lcmF0ZWQgc3ltYm9scyB0byBhdm9pZCBjb25mbGljdHNcbjs7IGh0dHA6Ly93d3cuZmlsZWZvcm1hdC5pbmZvL2luZm8vdW5pY29kZS9jaGFyL2Y4L2luZGV4Lmh0bVxuKGRlZiAqKnVuaXF1ZS1jaGFyKiogXCJcXHUwMEY4XCIpXG5cbihkZWZuIC0+Y2FtZWwtam9pblxuICBcIlRha2VzIGRhc2ggZGVsaW1pdGVkIG5hbWUgXCJcbiAgW3ByZWZpeCBrZXldXG4gIChzdHIgcHJlZml4XG4gICAgICAgKGlmIChhbmQgKG5vdCAoZW1wdHk/IHByZWZpeCkpXG4gICAgICAgICAgICAgICAgKG5vdCAoZW1wdHk/IGtleSkpKVxuICAgICAgICAgKHN0ciAodXBwZXItY2FzZSAoZ2V0IGtleSAwKSkgKHN1YnMga2V5IDEpKVxuICAgICAgICAga2V5KSkpXG5cbihkZWZuIC0+cHJpdmF0ZS1wcmVmaXhcbiAgXCJUcmFuc2xhdGUgcHJpdmF0ZSBpZGVudGlmaWVycyBsaWtlIC1mb28gdG8gYSBKUyBlcXVpdmFsZW50XG4gIGZvcm1zIGxpa2UgX2Zvb1wiXG4gIFtpZF1cbiAgKGxldCBbc3BhY2UtZGVsaW1pdGVkIChqb2luIFwiIFwiIChzcGxpdCBpZCAjXCItXCIpKVxuICAgICAgICBsZWZ0LXRyaW1tZWQgKHRyaW1sIHNwYWNlLWRlbGltaXRlZClcbiAgICAgICAgbiAoLSAoY291bnQgaWQpIChjb3VudCBsZWZ0LXRyaW1tZWQpKV1cbiAgICAoaWYgKD4gbiAwKVxuICAgICAgKHN0ciAoam9pbiBcIl9cIiAocmVwZWF0IChpbmMgbikgXCJcIikpIChzdWJzIGlkIG4pKVxuICAgICAgaWQpKSlcblxuXG4oZGVmbiB0cmFuc2xhdGUtaWRlbnRpZmllci13b3JkXG4gIFwiVHJhbnNsYXRlcyByZWZlcmVuY2VzIGZyb20gY2xvanVyZSBjb252ZW50aW9uIHRvIEpTOlxuXG4gICoqbWFjcm9zKiogICAgICBfX21hY3Jvc19fXG4gIGxpc3QtPnZlY3RvciAgICBsaXN0VG9WZWN0b3JcbiAgc2V0ISAgICAgICAgICAgIHNldFxuICBmb29fYmFyICAgICAgICAgZm9vX2JhclxuICBudW1iZXI/ICAgICAgICAgaXNOdW1iZXJcbiAgcmVkPSAgICAgICAgICAgIHJlZEVxdWFsXG4gIGNyZWF0ZS1zZXJ2ZXIgICBjcmVhdGVTZXJ2ZXJcIlxuICBbZm9ybV1cbiAgKGRlZiBeOnByaXZhdGUgaWQgKG5hbWUgZm9ybSkpXG4gIChzZXQhIGlkIChjb25kIChpZGVudGljYWw/IGlkICBcIipcIikgXCJtdWx0aXBseVwiXG4gICAgICAgICAgICAgICAgIChpZGVudGljYWw/IGlkIFwiL1wiKSBcImRpdmlkZVwiXG4gICAgICAgICAgICAgICAgIChpZGVudGljYWw/IGlkIFwiK1wiKSBcInN1bVwiXG4gICAgICAgICAgICAgICAgIChpZGVudGljYWw/IGlkIFwiLVwiKSBcInN1YnRyYWN0XCJcbiAgICAgICAgICAgICAgICAgKGlkZW50aWNhbD8gaWQgXCI9XCIpIFwiZXF1YWw/XCJcbiAgICAgICAgICAgICAgICAgKGlkZW50aWNhbD8gaWQgXCI9PVwiKSBcInN0cmljdC1lcXVhbD9cIlxuICAgICAgICAgICAgICAgICAoaWRlbnRpY2FsPyBpZCBcIjw9XCIpIFwibm90LWdyZWF0ZXItdGhhblwiXG4gICAgICAgICAgICAgICAgIChpZGVudGljYWw/IGlkIFwiPj1cIikgXCJub3QtbGVzcy10aGFuXCJcbiAgICAgICAgICAgICAgICAgKGlkZW50aWNhbD8gaWQgXCI+XCIpIFwiZ3JlYXRlci10aGFuXCJcbiAgICAgICAgICAgICAgICAgKGlkZW50aWNhbD8gaWQgXCI8XCIpIFwibGVzcy10aGFuXCJcbiAgICAgICAgICAgICAgICAgKGlkZW50aWNhbD8gaWQgXCItPlwiKSBcInRocmVhZC1maXJzdFwiXG4gICAgICAgICAgICAgICAgIDplbHNlIGlkKSlcblxuICA7OyAqKm1hY3JvcyoqIC0+ICBfX21hY3Jvc19fXG4gIChzZXQhIGlkIChqb2luIFwiX1wiIChzcGxpdCBpZCBcIipcIikpKVxuICA7OyBmb28uYmFyIC0+IGZvb19iYXJcbiAgKHNldCEgaWQgKGpvaW4gXCJfXCIgKHNwbGl0IGlkIFwiLlwiKSkpXG4gIDs7IGxpc3QtPnZlY3RvciAtPiAgbGlzdFRvVmVjdG9yXG4gIChzZXQhIGlkIChpZiAoaWRlbnRpY2FsPyAoc3VicyBpZCAwIDIpIFwiLT5cIilcbiAgICAgICAgICAgICAoc3VicyAoam9pbiBcIi10by1cIiAoc3BsaXQgaWQgXCItPlwiKSkgMSlcbiAgICAgICAgICAgICAoam9pbiBcIi10by1cIiAoc3BsaXQgaWQgXCItPlwiKSkpKVxuICA7OyBzZXQhIC0+ICBzZXRcbiAgKHNldCEgaWQgKGpvaW4gKHNwbGl0IGlkIFwiIVwiKSkpXG4gIChzZXQhIGlkIChqb2luIFwiJFwiIChzcGxpdCBpZCBcIiVcIikpKVxuICAoc2V0ISBpZCAoam9pbiBcIi1lcXVhbC1cIiAoc3BsaXQgaWQgXCI9XCIpKSlcbiAgOzsgZm9vPSAtPiBmb29FcXVhbFxuICA7KHNldCEgaWQgKGpvaW4gXCItZXF1YWwtXCIgKHNwbGl0IGlkIFwiPVwiKSlcbiAgOzsgZm9vK2JhciAtPiBmb29QbHVzQmFyXG4gIChzZXQhIGlkIChqb2luIFwiLXBsdXMtXCIgKHNwbGl0IGlkIFwiK1wiKSkpXG4gIChzZXQhIGlkIChqb2luIFwiLWFuZC1cIiAoc3BsaXQgaWQgXCImXCIpKSlcbiAgOzsgbnVtYmVyPyAtPiBpc051bWJlclxuICAoc2V0ISBpZCAoaWYgKGlkZW50aWNhbD8gKGxhc3QgaWQpIFwiP1wiKVxuICAgICAgICAgICAgIChzdHIgXCJpcy1cIiAoc3VicyBpZCAwIChkZWMgKGNvdW50IGlkKSkpKVxuICAgICAgICAgICAgIGlkKSlcbiAgOzsgLWZvbyAtPiBfZm9vXG4gIChzZXQhIGlkICgtPnByaXZhdGUtcHJlZml4IGlkKSlcbiAgOzsgY3JlYXRlLXNlcnZlciAtPiBjcmVhdGVTZXJ2ZXJcbiAgKHNldCEgaWQgKHJlZHVjZSAtPmNhbWVsLWpvaW4gXCJcIiAoc3BsaXQgaWQgXCItXCIpKSlcblxuICBpZClcblxuKGRlZm4gdHJhbnNsYXRlLWlkZW50aWZpZXJcbiAgW2Zvcm1dXG4gIChsZXQgW25zIChuYW1lc3BhY2UgZm9ybSldXG4gICAgKHN0ciAoaWYgKGFuZCBucyAobm90ICg9IG5zIFwianNcIikpKVxuICAgICAgICAgICAoc3RyICh0cmFuc2xhdGUtaWRlbnRpZmllci13b3JkIChuYW1lc3BhY2UgZm9ybSkpIFwiLlwiKVxuICAgICAgICAgICBcIlwiKVxuICAgICAgICAgKGpvaW4gXFwuIChtYXAgdHJhbnNsYXRlLWlkZW50aWZpZXItd29yZCAoc3BsaXQgKG5hbWUgZm9ybSkgXFwuKSkpKSkpXG5cbihkZWZuIGVycm9yLWFyZy1jb3VudFxuICBbY2FsbGVlIG5dXG4gICh0aHJvdyAoU3ludGF4RXJyb3IgKHN0ciBcIldyb25nIG51bWJlciBvZiBhcmd1bWVudHMgKFwiIG4gXCIpIHBhc3NlZCB0bzogXCIgY2FsbGVlKSkpKVxuXG4oZGVmbiBpbmhlcml0LWxvY2F0aW9uXG4gIFtib2R5XVxuICAobGV0IFtzdGFydCAoOnN0YXJ0ICg6bG9jIChmaXJzdCBib2R5KSkpXG4gICAgICAgIGVuZCAoOmVuZCAoOmxvYyAobGFzdCBib2R5KSkpXVxuICAgIChpZiAobm90IChvciAobmlsPyBzdGFydCkgKG5pbD8gZW5kKSkpXG4gICAgICB7OnN0YXJ0IHN0YXJ0IDplbmQgZW5kfSkpKVxuXG5cbihkZWZuIHdyaXRlLWxvY2F0aW9uXG4gIFtmb3JtIG9yaWdpbmFsXVxuICAobGV0IFtkYXRhIChtZXRhIGZvcm0pXG4gICAgICAgIGluaGVyaXRlZCAobWV0YSBvcmlnaW5hbClcbiAgICAgICAgc3RhcnQgKG9yICg6c3RhcnQgZm9ybSkgKDpzdGFydCBkYXRhKSAoOnN0YXJ0IGluaGVyaXRlZCkpXG4gICAgICAgIGVuZCAob3IgKDplbmQgZm9ybSkgKDplbmQgZGF0YSkgKDplbmQgaW5oZXJpdGVkKSldXG4gICAgKGlmIChub3QgKG5pbD8gc3RhcnQpKVxuICAgICAgezpsb2MgezpzdGFydCB7OmxpbmUgKGluYyAoOmxpbmUgc3RhcnQgLTEpKVxuICAgICAgICAgICAgICAgICAgICAgOmNvbHVtbiAoOmNvbHVtbiBzdGFydCAtMSl9XG4gICAgICAgICAgICAgOmVuZCB7OmxpbmUgKGluYyAoOmxpbmUgZW5kIC0xKSlcbiAgICAgICAgICAgICAgICAgICA6Y29sdW1uICg6Y29sdW1uIGVuZCAtMSl9fX1cbiAgICAgIHt9KSkpXG5cbihkZWYgKip3cml0ZXJzKioge30pXG4oZGVmbiBpbnN0YWxsLXdyaXRlciFcbiAgW29wIHdyaXRlcl1cbiAgKHNldCEgKGdldCAqKndyaXRlcnMqKiBvcCkgd3JpdGVyKSlcblxuKGRlZm4gd3JpdGUtb3BcbiAgW29wIGZvcm1dXG4gIChsZXQgW3dyaXRlciAoZ2V0ICoqd3JpdGVycyoqIG9wKV1cbiAgICAoYXNzZXJ0IHdyaXRlciAoc3RyIFwiVW5zdXBwb3J0ZWQgb3BlcmF0aW9uOiBcIiBvcCkpXG4gICAgKGNvbmogKHdyaXRlLWxvY2F0aW9uICg6Zm9ybSBmb3JtKSAoOm9yaWdpbmFsLWZvcm0gZm9ybSkpXG4gICAgICAgICAgKHdyaXRlciBmb3JtKSkpKVxuXG4oZGVmICoqc3BlY2lhbHMqKiB7fSlcbihkZWZuIGluc3RhbGwtc3BlY2lhbCFcbiAgW29wIHdyaXRlcl1cbiAgKHNldCEgKGdldCAqKnNwZWNpYWxzKiogKG5hbWUgb3ApKSB3cml0ZXIpKVxuXG4oZGVmbiB3cml0ZS1zcGVjaWFsXG4gIFt3cml0ZXIgZm9ybV1cbiAgKGNvbmogKHdyaXRlLWxvY2F0aW9uICg6Zm9ybSBmb3JtKSAoOm9yaWdpbmFsLWZvcm0gZm9ybSkpXG4gICAgICAgIChhcHBseSB3cml0ZXIgKDpwYXJhbXMgZm9ybSkpKSlcblxuXG4oZGVmbiB3cml0ZS1uaWxcbiAgW2Zvcm1dXG4gIHs6dHlwZSA6VW5hcnlFeHByZXNzaW9uXG4gICA6b3BlcmF0b3IgOnZvaWRcbiAgIDphcmd1bWVudCB7OnR5cGUgOkxpdGVyYWxcbiAgICAgICAgICAgICAgOnZhbHVlIDB9XG4gICA6cHJlZml4IHRydWV9KVxuKGluc3RhbGwtd3JpdGVyISA6bmlsIHdyaXRlLW5pbClcblxuKGRlZm4gd3JpdGUtbGl0ZXJhbFxuICBbZm9ybV1cbiAgezp0eXBlIDpMaXRlcmFsXG4gICA6dmFsdWUgZm9ybX0pXG5cbihkZWZuIHdyaXRlLWxpc3RcbiAgW2Zvcm1dXG4gIHs6dHlwZSA6Q2FsbEV4cHJlc3Npb25cbiAgIDpjYWxsZWUgKHdyaXRlIHs6b3AgOnZhclxuICAgICAgICAgICAgICAgICAgIDpmb3JtICdsaXN0fSlcbiAgIDphcmd1bWVudHMgKG1hcCB3cml0ZSAoOml0ZW1zIGZvcm0pKX0pXG4oaW5zdGFsbC13cml0ZXIhIDpsaXN0IHdyaXRlLWxpc3QpXG5cbihkZWZuIHdyaXRlLXN5bWJvbFxuICBbZm9ybV1cbiAgezp0eXBlIDpDYWxsRXhwcmVzc2lvblxuICAgOmNhbGxlZSAod3JpdGUgezpvcCA6dmFyXG4gICAgICAgICAgICAgICAgICAgOmZvcm0gJ3N5bWJvbH0pXG4gICA6YXJndW1lbnRzIFsod3JpdGUtY29uc3RhbnQgKDpuYW1lc3BhY2UgZm9ybSkpXG4gICAgICAgICAgICAgICAod3JpdGUtY29uc3RhbnQgKDpuYW1lIGZvcm0pKV19KVxuKGluc3RhbGwtd3JpdGVyISA6c3ltYm9sIHdyaXRlLXN5bWJvbClcblxuKGRlZm4gd3JpdGUtY29uc3RhbnRcbiAgW2Zvcm1dXG4gIChjb25kIChuaWw/IGZvcm0pICh3cml0ZS1uaWwgZm9ybSlcbiAgICAgICAgKGtleXdvcmQ/IGZvcm0pICh3cml0ZS1saXRlcmFsIChpZiAobmFtZXNwYWNlIGZvcm0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChzdHIgKG5hbWVzcGFjZSBmb3JtKSBcIi9cIiAobmFtZSBmb3JtKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG5hbWUgZm9ybSkpKVxuICAgICAgICAobnVtYmVyPyBmb3JtKSAod3JpdGUtbnVtYmVyICgudmFsdWVPZiBmb3JtKSlcbiAgICAgICAgKHN0cmluZz8gZm9ybSkgKHdyaXRlLXN0cmluZyBmb3JtKVxuICAgICAgICA6ZWxzZSAod3JpdGUtbGl0ZXJhbCBmb3JtKSkpXG4oaW5zdGFsbC13cml0ZXIhIDpjb25zdGFudCAjKHdyaXRlLWNvbnN0YW50ICg6Zm9ybSAlKSkpXG5cbihkZWZuIHdyaXRlLXN0cmluZ1xuICBbZm9ybV1cbiAgezp0eXBlIDpMaXRlcmFsXG4gICA6dmFsdWUgKHN0ciBmb3JtKX0pXG5cbihkZWZuIHdyaXRlLW51bWJlclxuICBbZm9ybV1cbiAgKGlmICg8IGZvcm0gMClcbiAgICB7OnR5cGUgOlVuYXJ5RXhwcmVzc2lvblxuICAgICA6b3BlcmF0b3IgOi1cbiAgICAgOnByZWZpeCB0cnVlXG4gICAgIDphcmd1bWVudCAod3JpdGUtbnVtYmVyICgqIGZvcm0gLTEpKX1cbiAgICAod3JpdGUtbGl0ZXJhbCBmb3JtKSkpXG5cbihkZWZuIHdyaXRlLWtleXdvcmRcbiAgW2Zvcm1dXG4gIHs6dHlwZSA6TGl0ZXJhbFxuICAgOnZhbHVlICg6Zm9ybSBmb3JtKX0pXG4oaW5zdGFsbC13cml0ZXIhIDprZXl3b3JkIHdyaXRlLWtleXdvcmQpXG5cbihkZWZuIC0+aWRlbnRpZmllclxuICBbZm9ybV1cbiAgezp0eXBlIDpJZGVudGlmaWVyXG4gICA6bmFtZSAodHJhbnNsYXRlLWlkZW50aWZpZXIgZm9ybSl9KVxuXG4oZGVmbiB3cml0ZS1iaW5kaW5nLXZhclxuICBbZm9ybV1cbiAgOzsgSWYgaWRlbnRpZmllcnMgYmluZGluZyBzaGFkb3dzIG90aGVyIGJpbmRpbmcgcmVuYW1lIGl0IGFjY29yZGluZ1xuICA7OyB0byBzaGFkb3dpbmcgZGVwdGguIFRoaXMgYWxsb3dzIGJpbmRpbmdzIGluaXRpYWxpemVyIHNhZmVseVxuICA7OyBhY2Nlc3MgYmluZGluZyBiZWZvcmUgc2hhZG93aW5nIGl0LlxuICAobGV0IFtiYXNlLWlkICg6aWQgZm9ybSlcbiAgICAgICAgcmVzb2x2ZWQtaWQgKGlmICg6c2hhZG93IGZvcm0pXG4gICAgICAgICAgICAgICAgICAgICAgKHN5bWJvbCBuaWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChzdHIgKHRyYW5zbGF0ZS1pZGVudGlmaWVyIGJhc2UtaWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICoqdW5pcXVlLWNoYXIqKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoOmRlcHRoIGZvcm0pKSlcbiAgICAgICAgICAgICBiYXNlLWlkKV1cbiAgICAoY29uaiAoLT5pZGVudGlmaWVyIHJlc29sdmVkLWlkKVxuICAgICAgICAgICh3cml0ZS1sb2NhdGlvbiBiYXNlLWlkKSkpKVxuXG4oZGVmbiB3cml0ZS12YXJcbiAgXCJoYW5kbGVyIGZvciB7Om9wIDp2YXJ9IHR5cGUgZm9ybXMuIFN1Y2ggZm9ybXMgbWF5XG4gIHJlcHJlc2VudCByZWZlcmVuY2VzIGluIHdoaWNoIGNhc2UgdGhleSBoYXZlIDppbmZvXG4gIHBvaW50aW5nIHRvIGEgZGVjbGFyYXRpb24gOnZhciB3aGljaCB3YXkgYmUgZWl0aGVyXG4gIGZ1bmN0aW9uIHBhcmFtZXRlciAoaGFzIDpwYXJhbSB0cnVlKSBvciBsb2NhbFxuICBiaW5kaW5nIGRlY2xhcmF0aW9uIChoYXMgOmJpbmRpbmcgdHJ1ZSkgbGlrZSBvbmVzIGRlZmluZWRcbiAgYnkgbGV0IGFuZCBsb29wIGZvcm1zIGluIGxhdGVyIGNhc2UgZm9ybSB3aWxsIGFsc28gaGF2ZVxuICA6c2hhZG93IHBvaW50aW5nIHRvIGEgZGVjbGFyYXRpb24gbm9kZSBpdCBzaGFkb3dzIGFuZFxuICA6ZGVwdGggcHJvcGVydHkgd2l0aCBhIGRlcHRoIG9mIHNoYWRvd2luZywgdGhhdCBpcyB1c2VkXG4gIHRvIGZvciByZW5hbWluZyBsb2dpYyB0byBhdm9pZCBuYW1lIGNvbGxpc2lvbnMgaW4gZm9ybXNcbiAgbGlrZSBsZXQgdGhhdCBhbGxvdyBzYW1lIG5hbWVkIGJpbmRpbmdzLlwiXG4gIFtub2RlXVxuICAoaWYgKD0gOmJpbmRpbmcgKDp0eXBlICg6YmluZGluZyBub2RlKSkpXG4gICAgKGNvbmogKHdyaXRlLWJpbmRpbmctdmFyICg6YmluZGluZyBub2RlKSlcbiAgICAgICAgICAod3JpdGUtbG9jYXRpb24gKDpmb3JtIG5vZGUpKSlcbiAgICAoY29uaiAod3JpdGUtbG9jYXRpb24gKDpmb3JtIG5vZGUpKVxuICAgICAgICAgICgtPmlkZW50aWZpZXIgKDpmb3JtIG5vZGUpKSkpKVxuKGluc3RhbGwtd3JpdGVyISA6dmFyIHdyaXRlLXZhcilcbihpbnN0YWxsLXdyaXRlciEgOnBhcmFtIHdyaXRlLXZhcilcblxuKGRlZm4gd3JpdGUtaW52b2tlXG4gIFtmb3JtXVxuICB7OnR5cGUgOkNhbGxFeHByZXNzaW9uXG4gICA6Y2FsbGVlICh3cml0ZSAoOmNhbGxlZSBmb3JtKSlcbiAgIDphcmd1bWVudHMgKG1hcCB3cml0ZSAoOnBhcmFtcyBmb3JtKSl9KVxuKGluc3RhbGwtd3JpdGVyISA6aW52b2tlIHdyaXRlLWludm9rZSlcblxuKGRlZm4gd3JpdGUtdmVjdG9yXG4gIFtmb3JtXVxuICB7OnR5cGUgOkFycmF5RXhwcmVzc2lvblxuICAgOmVsZW1lbnRzIChtYXAgd3JpdGUgKDppdGVtcyBmb3JtKSl9KVxuKGluc3RhbGwtd3JpdGVyISA6dmVjdG9yIHdyaXRlLXZlY3RvcilcblxuKGRlZm4gd3JpdGUtZGljdGlvbmFyeVxuICBbZm9ybV1cbiAgKGxldCBbcHJvcGVydGllcyAocGFydGl0aW9uIDIgKGludGVybGVhdmUgKDprZXlzIGZvcm0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICg6dmFsdWVzIGZvcm0pKSldXG4gICAgezp0eXBlIDpPYmplY3RFeHByZXNzaW9uXG4gICAgIDpwcm9wZXJ0aWVzIChtYXAgKGZuIFtwYWlyXVxuICAgICAgICAgICAgICAgICAgICAgICAgKGxldCBba2V5IChmaXJzdCBwYWlyKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgKHNlY29uZCBwYWlyKV1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgezpraW5kIDppbml0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICA6dHlwZSA6UHJvcGVydHlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDprZXkgKGlmICg9IDpzeW1ib2wgKDpvcCBrZXkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh3cml0ZS1jb25zdGFudCAoc3RyICg6Zm9ybSBrZXkpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAod3JpdGUga2V5KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDp2YWx1ZSAod3JpdGUgdmFsdWUpfSkpXG4gICAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllcyl9KSlcbihpbnN0YWxsLXdyaXRlciEgOmRpY3Rpb25hcnkgd3JpdGUtZGljdGlvbmFyeSlcblxuKGRlZm4gd3JpdGUtZXhwb3J0XG4gIFtmb3JtXVxuICAod3JpdGUgezpvcCA6c2V0IVxuICAgICAgICAgIDp0YXJnZXQgezpvcCA6bWVtYmVyLWV4cHJlc3Npb25cbiAgICAgICAgICAgICAgICAgICA6Y29tcHV0ZWQgZmFsc2VcbiAgICAgICAgICAgICAgICAgICA6dGFyZ2V0IHs6b3AgOnZhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtICh3aXRoLW1ldGEgJ2V4cG9ydHMgKG1ldGEgKDpmb3JtICg6aWQgZm9ybSkpKSl9XG4gICAgICAgICAgICAgICAgICAgOnByb3BlcnR5ICg6aWQgZm9ybSlcbiAgICAgICAgICAgICAgICAgICA6Zm9ybSAoOmZvcm0gKDppZCBmb3JtKSl9XG4gICAgICAgICAgOnZhbHVlICg6aW5pdCBmb3JtKVxuICAgICAgICAgIDpmb3JtICg6Zm9ybSAoOmlkIGZvcm0pKX0pKVxuXG4oZGVmbiB3cml0ZS1kZWZcbiAgW2Zvcm1dXG4gIChjb25qIHs6dHlwZSA6VmFyaWFibGVEZWNsYXJhdGlvblxuICAgICAgICAgOmtpbmQgOnZhclxuICAgICAgICAgOmRlY2xhcmF0aW9ucyBbKGNvbmogezp0eXBlIDpWYXJpYWJsZURlY2xhcmF0b3JcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6aWQgKHdyaXRlICg6aWQgZm9ybSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmluaXQgKGNvbmogKGlmICg6ZXhwb3J0IGZvcm0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAod3JpdGUtZXhwb3J0IGZvcm0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAod3JpdGUgKDppbml0IGZvcm0pKSkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHdyaXRlLWxvY2F0aW9uICg6Zm9ybSAoOmlkIGZvcm0pKSkpXX1cbiAgICAgICAgKHdyaXRlLWxvY2F0aW9uICg6Zm9ybSBmb3JtKSAoOm9yaWdpbmFsLWZvcm0gZm9ybSkpKSlcbihpbnN0YWxsLXdyaXRlciEgOmRlZiB3cml0ZS1kZWYpXG5cbihkZWZuIHdyaXRlLWJpbmRpbmdcbiAgW2Zvcm1dXG4gIChsZXQgW2lkICh3cml0ZS1iaW5kaW5nLXZhciBmb3JtKVxuICAgICAgICBpbml0ICh3cml0ZSAoOmluaXQgZm9ybSkpXVxuICAgIHs6dHlwZSA6VmFyaWFibGVEZWNsYXJhdGlvblxuICAgICA6a2luZCA6dmFyXG4gICAgIDpsb2MgKGluaGVyaXQtbG9jYXRpb24gW2lkIGluaXRdKVxuICAgICA6ZGVjbGFyYXRpb25zIFt7OnR5cGUgOlZhcmlhYmxlRGVjbGFyYXRvclxuICAgICAgICAgICAgICAgICAgICAgOmlkIGlkXG4gICAgICAgICAgICAgICAgICAgICA6aW5pdCBpbml0fV19KSlcbihpbnN0YWxsLXdyaXRlciEgOmJpbmRpbmcgd3JpdGUtYmluZGluZylcblxuKGRlZm4gd3JpdGUtdGhyb3dcbiAgW2Zvcm1dXG4gICgtPmV4cHJlc3Npb24gKGNvbmogezp0eXBlIDpUaHJvd1N0YXRlbWVudFxuICAgICAgICAgICAgICAgICAgICAgICA6YXJndW1lbnQgKHdyaXRlICg6dGhyb3cgZm9ybSkpfVxuICAgICAgICAgICAgICAgICAgICAgICh3cml0ZS1sb2NhdGlvbiAoOmZvcm0gZm9ybSkgKDpvcmlnaW5hbC1mb3JtIGZvcm0pKSkpKVxuKGluc3RhbGwtd3JpdGVyISA6dGhyb3cgd3JpdGUtdGhyb3cpXG5cbihkZWZuIHdyaXRlLW5ld1xuICBbZm9ybV1cbiAgezp0eXBlIDpOZXdFeHByZXNzaW9uXG4gICA6Y2FsbGVlICh3cml0ZSAoOmNvbnN0cnVjdG9yIGZvcm0pKVxuICAgOmFyZ3VtZW50cyAobWFwIHdyaXRlICg6cGFyYW1zIGZvcm0pKX0pXG4oaW5zdGFsbC13cml0ZXIhIDpuZXcgd3JpdGUtbmV3KVxuXG4oZGVmbiB3cml0ZS1zZXQhXG4gIFtmb3JtXVxuICB7OnR5cGUgOkFzc2lnbm1lbnRFeHByZXNzaW9uXG4gICA6b3BlcmF0b3IgOj1cbiAgIDpsZWZ0ICh3cml0ZSAoOnRhcmdldCBmb3JtKSlcbiAgIDpyaWdodCAod3JpdGUgKDp2YWx1ZSBmb3JtKSl9KVxuKGluc3RhbGwtd3JpdGVyISA6c2V0ISB3cml0ZS1zZXQhKVxuXG4oZGVmbiB3cml0ZS1hZ2V0XG4gIFtmb3JtXVxuICB7OnR5cGUgOk1lbWJlckV4cHJlc3Npb25cbiAgIDpjb21wdXRlZCAoOmNvbXB1dGVkIGZvcm0pXG4gICA6b2JqZWN0ICh3cml0ZSAoOnRhcmdldCBmb3JtKSlcbiAgIDpwcm9wZXJ0eSAod3JpdGUgKDpwcm9wZXJ0eSBmb3JtKSl9KVxuKGluc3RhbGwtd3JpdGVyISA6bWVtYmVyLWV4cHJlc3Npb24gd3JpdGUtYWdldClcblxuOzsgTWFwIG9mIHN0YXRlbWVudCBBU1Qgbm9kZSB0aGF0IGFyZSBnZW5lcmF0ZWRcbjs7IGJ5IGEgd3JpdGVyLiBVc2VkIHRvIGRlY2V0IHdlYXRoZXIgbm9kZSBpc1xuOzsgc3RhdGVtZW50IG9yIGV4cHJlc3Npb24uXG4oZGVmICoqc3RhdGVtZW50cyoqIHs6RW1wdHlTdGF0ZW1lbnQgdHJ1ZSA6QmxvY2tTdGF0ZW1lbnQgdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgOkV4cHJlc3Npb25TdGF0ZW1lbnQgdHJ1ZSA6SWZTdGF0ZW1lbnQgdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgOkxhYmVsZWRTdGF0ZW1lbnQgdHJ1ZSA6QnJlYWtTdGF0ZW1lbnQgdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgOkNvbnRpbnVlU3RhdGVtZW50IHRydWUgOlN3aXRjaFN0YXRlbWVudCB0cnVlXG4gICAgICAgICAgICAgICAgICAgICA6UmV0dXJuU3RhdGVtZW50IHRydWUgOlRocm93U3RhdGVtZW50IHRydWVcbiAgICAgICAgICAgICAgICAgICAgIDpUcnlTdGF0ZW1lbnQgdHJ1ZSA6V2hpbGVTdGF0ZW1lbnQgdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgOkRvV2hpbGVTdGF0ZW1lbnQgdHJ1ZSA6Rm9yU3RhdGVtZW50IHRydWVcbiAgICAgICAgICAgICAgICAgICAgIDpGb3JJblN0YXRlbWVudCB0cnVlIDpGb3JPZlN0YXRlbWVudCB0cnVlXG4gICAgICAgICAgICAgICAgICAgICA6TGV0U3RhdGVtZW50IHRydWUgOlZhcmlhYmxlRGVjbGFyYXRpb24gdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgOkZ1bmN0aW9uRGVjbGFyYXRpb24gdHJ1ZX0pXG5cbihkZWZuIHdyaXRlLXN0YXRlbWVudFxuICBcIldyYXBzIGV4cHJlc3Npb24gdGhhdCBjYW4ndCBiZSBpbiBhIGJsb2NrIHN0YXRlbWVudFxuICBib2R5IGludG8gOkV4cHJlc3Npb25TdGF0ZW1lbnQgb3RoZXJ3aXNlIHJldHVybnMgYmFja1xuICBleHByZXNzaW9uLlwiXG4gIFtmb3JtXVxuICAoLT5zdGF0ZW1lbnQgKHdyaXRlIGZvcm0pKSlcblxuKGRlZm4gLT5zdGF0ZW1lbnRcbiAgW25vZGVdXG4gIChpZiAoZ2V0ICoqc3RhdGVtZW50cyoqICg6dHlwZSBub2RlKSlcbiAgICBub2RlXG4gICAgezp0eXBlIDpFeHByZXNzaW9uU3RhdGVtZW50XG4gICAgIDpleHByZXNzaW9uIG5vZGVcbiAgICAgOmxvYyAoOmxvYyBub2RlKVxuICAgICB9KSlcblxuKGRlZm4gLT5yZXR1cm5cbiAgW2Zvcm1dXG4gIChjb25qIHs6dHlwZSA6UmV0dXJuU3RhdGVtZW50XG4gICAgICAgICA6YXJndW1lbnQgKHdyaXRlIGZvcm0pfVxuICAgICAgICAod3JpdGUtbG9jYXRpb24gKDpmb3JtIGZvcm0pICg6b3JpZ2luYWwtZm9ybSBmb3JtKSkpKVxuXG4oZGVmbiB3cml0ZS1ib2R5XG4gIFwiVGFrZXMgZm9ybSB0aGF0IG1heSBjb250YWluIGA6c3RhdGVtZW50c2AgdmVjdG9yXG4gIG9yIGA6cmVzdWx0YCBmb3JtICBhbmQgcmV0dXJucyB2ZWN0b3IgZXhwcmVzc2lvblxuICBub2RlcyB0aGF0IGNhbiBiZSB1c2VkIGluIGFueSBibG9jay4gSWYgYDpyZXN1bHRgXG4gIGlzIHByZXNlbnQgaXQgd2lsbCBiZSBhIGxhc3QgaW4gdmVjdG9yIGFuZCBvZiBhXG4gIGA6UmV0dXJuU3RhdGVtZW50YCB0eXBlLlxuICBFeGFtcGxlczpcblxuXG4gICh3cml0ZS1ib2R5IHs6c3RhdGVtZW50cyBuaWxcbiAgICAgICAgICAgICAgIDpyZXN1bHQgezpvcCA6Y29uc3RhbnRcbiAgICAgICAgICAgICAgICAgICAgICAgIDp0eXBlIDpudW1iZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtIDN9fSlcbiAgOzsgPT5cbiAgW3s6dHlwZSA6UmV0dXJuU3RhdGVtZW50XG4gICAgOmFyZ3VtZW50IHs6dHlwZSA6TGl0ZXJhbCA6dmFsdWUgM319XVxuXG4gICh3cml0ZS1ib2R5IHs6c3RhdGVtZW50cyBbezpvcCA6c2V0IVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6dGFyZ2V0IHs6b3AgOnZhciA6Zm9ybSAneH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnZhbHVlIHs6b3AgOnZhciA6Zm9ybSAneX19XVxuICAgICAgICAgICAgICAgOnJlc3VsdCB7Om9wIDp2YXIgOmZvcm0gJ3h9fSlcbiAgOzsgPT5cbiAgW3s6dHlwZSA6RXhwcmVzc2lvblN0YXRlbWVudFxuICAgIDpleHByZXNzaW9uIHs6dHlwZSA6QXNzaWdubWVudEV4cHJlc3Npb25cbiAgICAgICAgICAgICAgICAgOm9wZXJhdG9yIDo9XG4gICAgICAgICAgICAgICAgIDpsZWZ0IHs6dHlwZSA6SWRlbnRpZmllciA6bmFtZSA6eH1cbiAgICAgICAgICAgICAgICAgOnJpZ2h0IHs6dHlwZSA6SWRlbnRpZmllciA6bmFtZSA6eX19fVxuICAgezp0eXBlIDpSZXR1cm5TdGF0ZW1lbnRcbiAgICA6YXJndW1lbnQgezp0eXBlIDpJZGVudGlmaWVyIDpuYW1lIDp4fX1dXCJcbiAgW2Zvcm1dXG4gIChsZXQgW3N0YXRlbWVudHMgKG1hcCB3cml0ZS1zdGF0ZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgICAgIChvciAoOnN0YXRlbWVudHMgZm9ybSkgW10pKVxuICAgICAgICByZXN1bHQgKGlmICg6cmVzdWx0IGZvcm0pXG4gICAgICAgICAgICAgICAgICgtPnJldHVybiAoOnJlc3VsdCBmb3JtKSkpXVxuXG4gICAgKGlmIHJlc3VsdFxuICAgICAgKGNvbmogc3RhdGVtZW50cyByZXN1bHQpXG4gICAgICBzdGF0ZW1lbnRzKSkpXG5cbihkZWZuIC0+YmxvY2tcbiAgW2JvZHldXG4gIChpZiAodmVjdG9yPyBib2R5KVxuICAgIHs6dHlwZSA6QmxvY2tTdGF0ZW1lbnRcbiAgICAgOmJvZHkgYm9keVxuICAgICA6bG9jIChpbmhlcml0LWxvY2F0aW9uIGJvZHkpfVxuICAgIHs6dHlwZSA6QmxvY2tTdGF0ZW1lbnRcbiAgICAgOmJvZHkgW2JvZHldXG4gICAgIDpsb2MgKDpsb2MgYm9keSl9KSlcblxuKGRlZm4gLT5leHByZXNzaW9uXG4gIFsmIGJvZHldXG4gIHs6dHlwZSA6Q2FsbEV4cHJlc3Npb25cbiAgIDphcmd1bWVudHMgW11cbiAgIDpsb2MgKGluaGVyaXQtbG9jYXRpb24gYm9keSlcbiAgIDpjYWxsZWUgKC0+c2VxdWVuY2UgW3s6dHlwZSA6RnVuY3Rpb25FeHByZXNzaW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgOmlkIG5pbFxuICAgICAgICAgICAgICAgICAgICAgICAgIDpwYXJhbXMgW11cbiAgICAgICAgICAgICAgICAgICAgICAgICA6ZGVmYXVsdHMgW11cbiAgICAgICAgICAgICAgICAgICAgICAgICA6ZXhwcmVzc2lvbiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgIDpnZW5lcmF0b3IgZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICA6cmVzdCBuaWxcbiAgICAgICAgICAgICAgICAgICAgICAgICA6Ym9keSAoLT5ibG9jayBib2R5KX1dKX0pXG5cbihkZWZuIHdyaXRlLWRvXG4gIFtmb3JtXVxuICAoaWYgKDpibG9jayAobWV0YSAoZmlyc3QgKDpmb3JtIGZvcm0pKSkpXG4gICAgKC0+YmxvY2sgKHdyaXRlLWJvZHkgKGNvbmogZm9ybSB7OnJlc3VsdCBuaWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6c3RhdGVtZW50cyAoY29uaiAoOnN0YXRlbWVudHMgZm9ybSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoOnJlc3VsdCBmb3JtKSl9KSkpXG4gICAgKGFwcGx5IC0+ZXhwcmVzc2lvbiAod3JpdGUtYm9keSBmb3JtKSkpKVxuKGluc3RhbGwtd3JpdGVyISA6ZG8gd3JpdGUtZG8pXG5cbihkZWZuIHdyaXRlLWlmXG4gIFtmb3JtXVxuICB7OnR5cGUgOkNvbmRpdGlvbmFsRXhwcmVzc2lvblxuICAgOnRlc3QgKHdyaXRlICg6dGVzdCBmb3JtKSlcbiAgIDpjb25zZXF1ZW50ICh3cml0ZSAoOmNvbnNlcXVlbnQgZm9ybSkpXG4gICA6YWx0ZXJuYXRlICh3cml0ZSAoOmFsdGVybmF0ZSBmb3JtKSl9KVxuKGluc3RhbGwtd3JpdGVyISA6aWYgd3JpdGUtaWYpXG5cbihkZWZuIHdyaXRlLXRyeVxuICBbZm9ybV1cbiAgKGxldCBbaGFuZGxlciAoOmhhbmRsZXIgZm9ybSlcbiAgICAgICAgZmluYWxpemVyICg6ZmluYWxpemVyIGZvcm0pXVxuICAgICgtPmV4cHJlc3Npb24gKGNvbmogezp0eXBlIDpUcnlTdGF0ZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgICAgICA6Z3VhcmRlZEhhbmRsZXJzIFtdXG4gICAgICAgICAgICAgICAgICAgICAgICAgOmJsb2NrICgtPmJsb2NrICh3cml0ZS1ib2R5ICg6Ym9keSBmb3JtKSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgOmhhbmRsZXJzIChpZiBoYW5kbGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW3s6dHlwZSA6Q2F0Y2hDbGF1c2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpwYXJhbSAod3JpdGUgKDpuYW1lIGhhbmRsZXIpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmJvZHkgKC0+YmxvY2sgKHdyaXRlLWJvZHkgaGFuZGxlcikpfV1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICA6ZmluYWxpemVyIChjb25kIGZpbmFsaXplciAoLT5ibG9jayAod3JpdGUtYm9keSBmaW5hbGl6ZXIpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG5vdCBoYW5kbGVyKSAoLT5ibG9jayBbXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDplbHNlIG5pbCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAod3JpdGUtbG9jYXRpb24gKDpmb3JtIGZvcm0pICg6b3JpZ2luYWwtZm9ybSBmb3JtKSkpKSkpXG4oaW5zdGFsbC13cml0ZXIhIDp0cnkgd3JpdGUtdHJ5KVxuXG4oZGVmbi0gd3JpdGUtYmluZGluZy12YWx1ZVxuICBbZm9ybV1cbiAgKHdyaXRlICg6aW5pdCBmb3JtKSkpXG5cbihkZWZuLSB3cml0ZS1iaW5kaW5nLXBhcmFtXG4gIFtmb3JtXVxuICAod3JpdGUtdmFyIHs6Zm9ybSAoOm5hbWUgZm9ybSl9KSlcblxuKGRlZm4gd3JpdGUtYmluZGluZ1xuICBbZm9ybV1cbiAgKHdyaXRlIHs6b3AgOmRlZlxuICAgICAgICAgIDp2YXIgZm9ybVxuICAgICAgICAgIDppbml0ICg6aW5pdCBmb3JtKVxuICAgICAgICAgIDpmb3JtIGZvcm19KSlcblxuKGRlZm4gd3JpdGUtbGV0XG4gIFtmb3JtXVxuICAobGV0IFtib2R5IChjb25qIGZvcm1cbiAgICAgICAgICAgICAgICAgICB7OnN0YXRlbWVudHMgKHZlYyAoY29uY2F0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICg6YmluZGluZ3MgZm9ybSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKDpzdGF0ZW1lbnRzIGZvcm0pKSl9KV1cbiAgICAoLT5paWZlICgtPmJsb2NrICh3cml0ZS1ib2R5IGJvZHkpKSkpKVxuKGluc3RhbGwtd3JpdGVyISA6bGV0IHdyaXRlLWxldClcblxuKGRlZm4gLT5yZWJpbmRcbiAgW2Zvcm1dXG4gIChsb29wIFtyZXN1bHQgW11cbiAgICAgICAgIGJpbmRpbmdzICg6YmluZGluZ3MgZm9ybSldXG4gICAgKGlmIChlbXB0eT8gYmluZGluZ3MpXG4gICAgICByZXN1bHRcbiAgICAgIChyZWN1ciAoY29uaiByZXN1bHRcbiAgICAgICAgICAgICAgICAgICB7OnR5cGUgOkFzc2lnbm1lbnRFeHByZXNzaW9uXG4gICAgICAgICAgICAgICAgICAgIDpvcGVyYXRvciA6PVxuICAgICAgICAgICAgICAgICAgICA6bGVmdCAod3JpdGUtYmluZGluZy12YXIgKGZpcnN0IGJpbmRpbmdzKSlcbiAgICAgICAgICAgICAgICAgICAgOnJpZ2h0IHs6dHlwZSA6TWVtYmVyRXhwcmVzc2lvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpjb21wdXRlZCB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOm9iamVjdCB7OnR5cGUgOklkZW50aWZpZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6bmFtZSA6bG9vcH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6cHJvcGVydHkgezp0eXBlIDpMaXRlcmFsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6dmFsdWUgKGNvdW50IHJlc3VsdCl9fX0pXG4gICAgICAgICAgICAgKHJlc3QgYmluZGluZ3MpKSkpKVxuXG4oZGVmbiAtPnNlcXVlbmNlXG4gIFtleHByZXNzaW9uc11cbiAgezp0eXBlIDpTZXF1ZW5jZUV4cHJlc3Npb25cbiAgIDpleHByZXNzaW9ucyBleHByZXNzaW9uc30pXG5cbihkZWZuIC0+aWlmZVxuICBbYm9keSBpZF1cbiAgezp0eXBlIDpDYWxsRXhwcmVzc2lvblxuICAgOmFyZ3VtZW50cyBbezp0eXBlIDpUaGlzRXhwcmVzc2lvbn1dXG4gICA6Y2FsbGVlIHs6dHlwZSA6TWVtYmVyRXhwcmVzc2lvblxuICAgICAgICAgICAgOmNvbXB1dGVkIGZhbHNlXG4gICAgICAgICAgICA6b2JqZWN0IHs6dHlwZSA6RnVuY3Rpb25FeHByZXNzaW9uXG4gICAgICAgICAgICAgICAgICAgICA6aWQgaWRcbiAgICAgICAgICAgICAgICAgICAgIDpwYXJhbXMgW11cbiAgICAgICAgICAgICAgICAgICAgIDpkZWZhdWx0cyBbXVxuICAgICAgICAgICAgICAgICAgICAgOmV4cHJlc3Npb24gZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgIDpnZW5lcmF0b3IgZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgIDpyZXN0IG5pbFxuICAgICAgICAgICAgICAgICAgICAgOmJvZHkgYm9keX1cbiAgICAgICAgICAgIDpwcm9wZXJ0eSB7OnR5cGUgOklkZW50aWZpZXJcbiAgICAgICAgICAgICAgICAgICAgICAgOm5hbWUgOmNhbGx9fX0pXG5cbihkZWZuIC0+bG9vcC1pbml0XG4gIFtdXG4gIHs6dHlwZSA6VmFyaWFibGVEZWNsYXJhdGlvblxuICAgOmtpbmQgOnZhclxuICAgOmRlY2xhcmF0aW9ucyBbezp0eXBlIDpWYXJpYWJsZURlY2xhcmF0b3JcbiAgICAgICAgICAgICAgICAgICA6aWQgezp0eXBlIDpJZGVudGlmaWVyXG4gICAgICAgICAgICAgICAgICAgICAgICA6bmFtZSA6cmVjdXJ9XG4gICAgICAgICAgICAgICAgICAgOmluaXQgezp0eXBlIDpJZGVudGlmaWVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDpuYW1lIDpsb29wfX1dfSlcblxuKGRlZm4gLT5kby13aGlsZVxuIFtib2R5IHRlc3RdXG4gezp0eXBlIDpEb1doaWxlU3RhdGVtZW50XG4gIDpib2R5IGJvZHlcbiAgOnRlc3QgdGVzdH0pXG5cbihkZWZuIC0+c2V0IS1yZWN1clxuICBbZm9ybV1cbiAgezp0eXBlIDpBc3NpZ25tZW50RXhwcmVzc2lvblxuICAgOm9wZXJhdG9yIDo9XG4gICA6bGVmdCB7OnR5cGUgOklkZW50aWZpZXIgOm5hbWUgOnJlY3VyfVxuICAgOnJpZ2h0ICh3cml0ZSBmb3JtKX0pXG5cbihkZWZuIC0+bG9vcFxuICBbZm9ybV1cbiAgKC0+c2VxdWVuY2UgKGNvbmogKC0+cmViaW5kIGZvcm0pXG4gICAgICAgICAgICAgICAgICAgIHs6dHlwZSA6QmluYXJ5RXhwcmVzc2lvblxuICAgICAgICAgICAgICAgICAgICAgOm9wZXJhdG9yIDo9PT1cbiAgICAgICAgICAgICAgICAgICAgIDpsZWZ0IHs6dHlwZSA6SWRlbnRpZmllclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpuYW1lIDpyZWN1cn1cbiAgICAgICAgICAgICAgICAgICAgIDpyaWdodCB7OnR5cGUgOklkZW50aWZpZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOm5hbWUgOmxvb3B9fSkpKVxuXG5cbihkZWZuIHdyaXRlLWxvb3BcbiAgW2Zvcm1dXG4gIChsZXQgW3N0YXRlbWVudHMgKDpzdGF0ZW1lbnRzIGZvcm0pXG4gICAgICAgIHJlc3VsdCAoOnJlc3VsdCBmb3JtKVxuICAgICAgICBiaW5kaW5ncyAoOmJpbmRpbmdzIGZvcm0pXG5cbiAgICAgICAgbG9vcC1ib2R5IChjb25qIChtYXAgd3JpdGUtc3RhdGVtZW50IHN0YXRlbWVudHMpXG4gICAgICAgICAgICAgICAgICAgICAgICAoLT5zdGF0ZW1lbnQgKC0+c2V0IS1yZWN1ciByZXN1bHQpKSlcbiAgICAgICAgYm9keSAoY29uY2F0IFsoXG4gICAgICAgICAgICAgICAgICAgICAgIC0+bG9vcC1pbml0KV1cbiAgICAgICAgICAgICAgICAgICAgIChtYXAgd3JpdGUgYmluZGluZ3MpXG4gICAgICAgICAgICAgICAgICAgICBbKC0+ZG8td2hpbGUgKC0+YmxvY2sgKHZlYyBsb29wLWJvZHkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgtPmxvb3AgZm9ybSkpXVxuICAgICAgICAgICAgICAgICAgICAgW3s6dHlwZSA6UmV0dXJuU3RhdGVtZW50XG4gICAgICAgICAgICAgICAgICAgICAgIDphcmd1bWVudCB7OnR5cGUgOklkZW50aWZpZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6bmFtZSA6cmVjdXJ9fV0pXVxuICAgICgtPmlpZmUgKC0+YmxvY2sgKHZlYyBib2R5KSkgJ2xvb3ApKSlcbihpbnN0YWxsLXdyaXRlciEgOmxvb3Agd3JpdGUtbG9vcClcblxuKGRlZm4gLT5yZWN1clxuICBbZm9ybV1cbiAgKGxvb3AgW3Jlc3VsdCBbXVxuICAgICAgICAgcGFyYW1zICg6cGFyYW1zIGZvcm0pXVxuICAgIChpZiAoZW1wdHk/IHBhcmFtcylcbiAgICAgIHJlc3VsdFxuICAgICAgKHJlY3VyIChjb25qIHJlc3VsdFxuICAgICAgICAgICAgICAgICAgIHs6dHlwZSA6QXNzaWdubWVudEV4cHJlc3Npb25cbiAgICAgICAgICAgICAgICAgICAgOm9wZXJhdG9yIDo9XG4gICAgICAgICAgICAgICAgICAgIDpyaWdodCAod3JpdGUgKGZpcnN0IHBhcmFtcykpXG4gICAgICAgICAgICAgICAgICAgIDpsZWZ0IHs6dHlwZSA6TWVtYmVyRXhwcmVzc2lvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgOmNvbXB1dGVkIHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDpvYmplY3Qgezp0eXBlIDpJZGVudGlmaWVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6bmFtZSA6bG9vcH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDpwcm9wZXJ0eSB7OnR5cGUgOkxpdGVyYWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnZhbHVlIChjb3VudCByZXN1bHQpfX19KVxuICAgICAgICAgICAgIChyZXN0IHBhcmFtcykpKSkpXG5cbihkZWZuIHdyaXRlLXJlY3VyXG4gIFtmb3JtXVxuICAoLT5zZXF1ZW5jZSAoY29uaiAoLT5yZWN1ciBmb3JtKVxuICAgICAgICAgICAgICAgICAgICB7OnR5cGUgOklkZW50aWZpZXJcbiAgICAgICAgICAgICAgICAgICAgIDpuYW1lIDpsb29wfSkpKVxuKGluc3RhbGwtd3JpdGVyISA6cmVjdXIgd3JpdGUtcmVjdXIpXG5cbihkZWZuIGZhbGxiYWNrLW92ZXJsb2FkXG4gIFtdXG4gIHs6dHlwZSA6U3dpdGNoQ2FzZVxuICAgOnRlc3QgbmlsXG4gICA6Y29uc2VxdWVudCBbezp0eXBlIDpUaHJvd1N0YXRlbWVudFxuICAgICAgICAgICAgICAgICA6YXJndW1lbnQgezp0eXBlIDpDYWxsRXhwcmVzc2lvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpjYWxsZWUgezp0eXBlIDpJZGVudGlmaWVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOm5hbWUgOlJhbmdlRXJyb3J9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOmFyZ3VtZW50cyBbezp0eXBlIDpMaXRlcmFsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDp2YWx1ZSBcIldyb25nIG51bWJlciBvZiBhcmd1bWVudHMgcGFzc2VkXCJ9XX19XX0pXG5cbihkZWZuIHNwbGljZS1iaW5kaW5nXG4gIFtmb3JtXVxuICB7Om9wIDpkZWZcbiAgIDppZCAobGFzdCAoOnBhcmFtcyBmb3JtKSlcbiAgIDppbml0IHs6b3AgOmludm9rZVxuICAgICAgICAgIDpjYWxsZWUgezpvcCA6dmFyXG4gICAgICAgICAgICAgICAgICAgOmZvcm0gJ0FycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsfVxuICAgICAgICAgIDpwYXJhbXMgW3s6b3AgOnZhclxuICAgICAgICAgICAgICAgICAgICA6Zm9ybSAnYXJndW1lbnRzfVxuICAgICAgICAgICAgICAgICAgIHs6b3AgOmNvbnN0YW50XG4gICAgICAgICAgICAgICAgICAgIDpmb3JtICg6YXJpdHkgZm9ybSlcbiAgICAgICAgICAgICAgICAgICAgOnR5cGUgOm51bWJlcn1dfX0pXG5cbihkZWZuIHdyaXRlLW92ZXJsb2FkaW5nLXBhcmFtc1xuICBbcGFyYW1zXVxuICAocmVkdWNlIChmbiBbZm9ybXMgcGFyYW1dXG4gICAgICAgICAgICAoY29uaiBmb3JtcyB7Om9wIDpkZWZcbiAgICAgICAgICAgICAgICAgICAgICAgICA6aWQgcGFyYW1cbiAgICAgICAgICAgICAgICAgICAgICAgICA6aW5pdCB7Om9wIDptZW1iZXItZXhwcmVzc2lvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Y29tcHV0ZWQgdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6dGFyZ2V0IHs6b3AgOnZhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Zm9ybSAnYXJndW1lbnRzfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6cHJvcGVydHkgezpvcCA6Y29uc3RhbnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6dHlwZSA6bnVtYmVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gKGNvdW50IGZvcm1zKX19fSkpXG4gICAgICAgICAgW11cbiAgICAgICAgICBwYXJhbXMpKVxuXG4oZGVmbiB3cml0ZS1vdmVybG9hZGluZy1mblxuICBbZm9ybV1cbiAgKGxldCBbb3ZlcmxvYWRzIChtYXAgd3JpdGUtZm4tb3ZlcmxvYWQgKDptZXRob2RzIGZvcm0pKV1cbiAgICB7OnBhcmFtcyBbXVxuICAgICA6Ym9keSAoLT5ibG9jayB7OnR5cGUgOlN3aXRjaFN0YXRlbWVudFxuICAgICAgICAgICAgICAgICAgICAgOmRpc2NyaW1pbmFudCB7OnR5cGUgOk1lbWJlckV4cHJlc3Npb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpjb21wdXRlZCBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOm9iamVjdCB7OnR5cGUgOklkZW50aWZpZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpuYW1lIDphcmd1bWVudHN9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6cHJvcGVydHkgezp0eXBlIDpJZGVudGlmaWVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpuYW1lIDpsZW5ndGh9fVxuICAgICAgICAgICAgICAgICAgICAgOmNhc2VzIChpZiAoOnZhcmlhZGljIGZvcm0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdmVybG9hZHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChjb25qIG92ZXJsb2FkcyAoZmFsbGJhY2stb3ZlcmxvYWQpKSl9KX0pKVxuXG4oZGVmbiB3cml0ZS1mbi1vdmVybG9hZFxuICBbZm9ybV1cbiAgKGxldCBbcGFyYW1zICg6cGFyYW1zIGZvcm0pXG4gICAgICAgIGJpbmRpbmdzIChpZiAoOnZhcmlhZGljIGZvcm0pXG4gICAgICAgICAgICAgICAgICAgKGNvbmogKHdyaXRlLW92ZXJsb2FkaW5nLXBhcmFtcyAoYnV0bGFzdCBwYXJhbXMpKVxuICAgICAgICAgICAgICAgICAgICAgICAgIChzcGxpY2UtYmluZGluZyBmb3JtKSlcbiAgICAgICAgICAgICAgICAgICAod3JpdGUtb3ZlcmxvYWRpbmctcGFyYW1zIHBhcmFtcykpXG4gICAgICAgIHN0YXRlbWVudHMgKHZlYyAoY29uY2F0IGJpbmRpbmdzICg6c3RhdGVtZW50cyBmb3JtKSkpXVxuICAgIHs6dHlwZSA6U3dpdGNoQ2FzZVxuICAgICA6dGVzdCAoaWYgKG5vdCAoOnZhcmlhZGljIGZvcm0pKVxuICAgICAgICAgICAgIHs6dHlwZSA6TGl0ZXJhbFxuICAgICAgICAgICAgICA6dmFsdWUgKDphcml0eSBmb3JtKX0pXG4gICAgIDpjb25zZXF1ZW50ICh3cml0ZS1ib2R5IChjb25qIGZvcm0gezpzdGF0ZW1lbnRzIHN0YXRlbWVudHN9KSl9KSlcblxuKGRlZm4gd3JpdGUtc2ltcGxlLWZuXG4gIFtmb3JtXVxuICAobGV0IFttZXRob2QgKGZpcnN0ICg6bWV0aG9kcyBmb3JtKSlcbiAgICAgICAgcGFyYW1zIChpZiAoOnZhcmlhZGljIG1ldGhvZClcbiAgICAgICAgICAgICAgICAgKGJ1dGxhc3QgKDpwYXJhbXMgbWV0aG9kKSlcbiAgICAgICAgICAgICAgICAgKDpwYXJhbXMgbWV0aG9kKSlcbiAgICAgICAgYm9keSAoaWYgKDp2YXJpYWRpYyBtZXRob2QpXG4gICAgICAgICAgICAgICAoY29uaiBtZXRob2RcbiAgICAgICAgICAgICAgICAgICAgIHs6c3RhdGVtZW50cyAodmVjIChjb25zIChzcGxpY2UtYmluZGluZyBtZXRob2QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoOnN0YXRlbWVudHMgbWV0aG9kKSkpfSlcbiAgICAgICAgICAgICAgIG1ldGhvZCldXG4gICAgezpwYXJhbXMgKG1hcCB3cml0ZS12YXIgcGFyYW1zKVxuICAgICA6Ym9keSAoLT5ibG9jayAod3JpdGUtYm9keSBib2R5KSl9KSlcblxuKGRlZm4gcmVzb2x2ZVxuICBbZnJvbSB0b11cbiAgKGxldCBbcmVxdWlyZXIgKHNwbGl0IChuYW1lIGZyb20pIFxcLilcbiAgICAgICAgcmVxdWlyZW1lbnQgKHNwbGl0IChuYW1lIHRvKSBcXC4pXG4gICAgICAgIHJlbGF0aXZlPyAoYW5kIChub3QgKGlkZW50aWNhbD8gKG5hbWUgZnJvbSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAobmFtZSB0bykpKVxuICAgICAgICAgICAgICAgICAgICAgICAoaWRlbnRpY2FsPyAoZmlyc3QgcmVxdWlyZXIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmaXJzdCByZXF1aXJlbWVudCkpKV1cbiAgICAoaWYgcmVsYXRpdmU/XG4gICAgICAobG9vcCBbZnJvbSByZXF1aXJlclxuICAgICAgICAgICAgIHRvIHJlcXVpcmVtZW50XVxuICAgICAgICAoaWYgKGlkZW50aWNhbD8gKGZpcnN0IGZyb20pXG4gICAgICAgICAgICAgICAgICAgICAgICAoZmlyc3QgdG8pKVxuICAgICAgICAgIChyZWN1ciAocmVzdCBmcm9tKSAocmVzdCB0bykpXG4gICAgICAgICAgKGpvaW4gXFwvXG4gICAgICAgICAgICAgICAgKGNvbmNhdCBbXFwuXVxuICAgICAgICAgICAgICAgICAgICAgICAgKHJlcGVhdCAoZGVjIChjb3VudCBmcm9tKSkgXCIuLlwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgdG8pKSkpXG4gICAgICAoam9pbiBcXC8gcmVxdWlyZW1lbnQpKSkpXG5cbihkZWZuIGlkLT5uc1xuICBcIlRha2VzIG5hbWVzcGFjZSBpZGVudGlmaWVyIHN5bWJvbCBhbmQgdHJhbnNsYXRlcyB0byBuZXdcbiAgc3ltYm9sIHdpdGhvdXQgLiBzcGVjaWFsIGNoYXJhY3RlcnNcbiAgd2lzcC5jb3JlIC0+IHdpc3AqY29yZVwiXG4gIFtpZF1cbiAgKHN5bWJvbCBuaWwgKGpvaW4gXFwqIChzcGxpdCAobmFtZSBpZCkgXFwuKSkpKVxuXG5cbihkZWZuIHdyaXRlLXJlcXVpcmVcbiAgW2Zvcm0gcmVxdWlyZXJdXG4gIChsZXQgW25zLWJpbmRpbmcgezpvcCA6ZGVmXG4gICAgICAgICAgICAgICAgICAgIDppZCB7Om9wIDp2YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICA6dHlwZSA6aWRlbnRpZmllclxuICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtIChpZC0+bnMgKDpucyBmb3JtKSl9XG4gICAgICAgICAgICAgICAgICAgIDppbml0IHs6b3AgOmludm9rZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgOmNhbGxlZSB7Om9wIDp2YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDp0eXBlIDppZGVudGlmaWVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Zm9ybSAncmVxdWlyZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDpwYXJhbXMgW3s6b3AgOmNvbnN0YW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gKHJlc29sdmUgcmVxdWlyZXIgKDpucyBmb3JtKSl9XX19XG4gICAgICAgIG5zLWFsaWFzIChpZiAoOmFsaWFzIGZvcm0pXG4gICAgICAgICAgICAgICAgICAgezpvcCA6ZGVmXG4gICAgICAgICAgICAgICAgICAgIDppZCB7Om9wIDp2YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICA6dHlwZSA6aWRlbnRpZmllclxuICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtIChpZC0+bnMgKDphbGlhcyBmb3JtKSl9XG4gICAgICAgICAgICAgICAgICAgIDppbml0ICg6aWQgbnMtYmluZGluZyl9KVxuXG4gICAgICAgIHJlZmVyZW5jZXMgKHJlZHVjZSAoZm4gW3JlZmVyZW5jZXMgZm9ybV1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGNvbmogcmVmZXJlbmNlc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Om9wIDpkZWZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDppZCB7Om9wIDp2YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnR5cGUgOmlkZW50aWZpZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gKG9yICg6cmVuYW1lIGZvcm0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoOm5hbWUgZm9ybSkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmluaXQgezpvcCA6bWVtYmVyLWV4cHJlc3Npb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Y29tcHV0ZWQgZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6dGFyZ2V0ICg6aWQgbnMtYmluZGluZylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6cHJvcGVydHkgezpvcCA6dmFyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6dHlwZSA6aWRlbnRpZmllclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gKDpuYW1lIGZvcm0pfX19KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFtdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAoOnJlZmVyIGZvcm0pKV1cbiAgICAodmVjIChjb25zIG5zLWJpbmRpbmdcbiAgICAgICAgICAgICAgIChpZiBucy1hbGlhc1xuICAgICAgICAgICAgICAgICAoY29ucyBucy1hbGlhcyByZWZlcmVuY2VzKVxuICAgICAgICAgICAgICAgICByZWZlcmVuY2VzKSkpKSlcblxuKGRlZm4gd3JpdGUtbnNcbiAgW2Zvcm1dXG4gIChsZXQgW25vZGUgKDpmb3JtIGZvcm0pXG4gICAgICAgIHJlcXVpcmVyICg6bmFtZSBmb3JtKVxuICAgICAgICBucy1iaW5kaW5nIHs6b3AgOmRlZlxuICAgICAgICAgICAgICAgICAgICA6b3JpZ2luYWwtZm9ybSBub2RlXG4gICAgICAgICAgICAgICAgICAgIDppZCB7Om9wIDp2YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICA6dHlwZSA6aWRlbnRpZmllclxuICAgICAgICAgICAgICAgICAgICAgICAgIDpvcmlnaW5hbC1mb3JtIChmaXJzdCBub2RlKVxuICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtICcqbnMqfVxuICAgICAgICAgICAgICAgICAgICA6aW5pdCB7Om9wIDpkaWN0aW9uYXJ5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICA6Zm9ybSBub2RlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICA6a2V5cyBbezpvcCA6dmFyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDp0eXBlIDppZGVudGlmaWVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpvcmlnaW5hbC1mb3JtIG5vZGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gJ2lkfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHs6b3AgOnZhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6dHlwZSA6aWRlbnRpZmllclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6b3JpZ2luYWwtZm9ybSBub2RlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtICdkb2N9XVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgOnZhbHVlcyBbezpvcCA6Y29uc3RhbnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6dHlwZSA6aWRlbnRpZmllclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpvcmlnaW5hbC1mb3JtICg6bmFtZSBmb3JtKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtIChuYW1lICg6bmFtZSBmb3JtKSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Om9wIDpjb25zdGFudFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpvcmlnaW5hbC1mb3JtIG5vZGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Zm9ybSAoOmRvYyBmb3JtKX1dfX1cbiAgICAgICAgcmVxdWlyZW1lbnRzICh2ZWMgKGFwcGx5IGNvbmNhdCAobWFwICMod3JpdGUtcmVxdWlyZSAlIHJlcXVpcmVyKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKDpyZXF1aXJlIGZvcm0pKSkpXVxuICAgICgtPmJsb2NrIChtYXAgd3JpdGUgKHZlYyAoY29ucyBucy1iaW5kaW5nIHJlcXVpcmVtZW50cykpKSkpKVxuKGluc3RhbGwtd3JpdGVyISA6bnMgd3JpdGUtbnMpXG5cbihkZWZuIHdyaXRlLWZuXG4gIFtmb3JtXVxuICAobGV0IFtiYXNlIChpZiAoPiAoY291bnQgKDptZXRob2RzIGZvcm0pKSAxKVxuICAgICAgICAgICAgICAgKHdyaXRlLW92ZXJsb2FkaW5nLWZuIGZvcm0pXG4gICAgICAgICAgICAgICAod3JpdGUtc2ltcGxlLWZuIGZvcm0pKV1cbiAgICAoY29uaiBiYXNlXG4gICAgICAgICAgezp0eXBlIDpGdW5jdGlvbkV4cHJlc3Npb25cbiAgICAgICAgICAgOmlkIChpZiAoOmlkIGZvcm0pICh3cml0ZS12YXIgKDppZCBmb3JtKSkpXG4gICAgICAgICAgIDpkZWZhdWx0cyBuaWxcbiAgICAgICAgICAgOnJlc3QgbmlsXG4gICAgICAgICAgIDpnZW5lcmF0b3IgZmFsc2VcbiAgICAgICAgICAgOmV4cHJlc3Npb24gZmFsc2V9KSkpXG4oaW5zdGFsbC13cml0ZXIhIDpmbiB3cml0ZS1mbilcblxuKGRlZm4gd3JpdGVcbiAgW2Zvcm1dXG4gIChsZXQgW29wICg6b3AgZm9ybSlcbiAgICAgICAgd3JpdGVyIChhbmQgKD0gOmludm9rZSAoOm9wIGZvcm0pKVxuICAgICAgICAgICAgICAgICAgICAoPSA6dmFyICg6b3AgKDpjYWxsZWUgZm9ybSkpKVxuICAgICAgICAgICAgICAgICAgICAoZ2V0ICoqc3BlY2lhbHMqKiAobmFtZSAoOmZvcm0gKDpjYWxsZWUgZm9ybSkpKSkpXVxuICAgIChpZiB3cml0ZXJcbiAgICAgICh3cml0ZS1zcGVjaWFsIHdyaXRlciBmb3JtKVxuICAgICAgKHdyaXRlLW9wICg6b3AgZm9ybSkgZm9ybSkpKSlcblxuKGRlZm4gd3JpdGUqXG4gIFsmIGZvcm1zXVxuICAobGV0IFtib2R5IChtYXAgd3JpdGUtc3RhdGVtZW50IGZvcm1zKV1cbiAgICB7OnR5cGUgOlByb2dyYW1cbiAgICAgOmJvZHkgYm9keVxuICAgICA6bG9jIChpbmhlcml0LWxvY2F0aW9uIGJvZHkpfSkpXG5cblxuKGRlZm4gY29tcGlsZVxuICAoW2Zvcm1dIChjb21waWxlIHt9IGZvcm0pKVxuICAoW29wdGlvbnMgJiBmb3Jtc10gKGdlbmVyYXRlIChhcHBseSB3cml0ZSogZm9ybXMpIG9wdGlvbnMpKSlcblxuXG4oZGVmbiBnZXQtbWFjcm9cbiAgKFt0YXJnZXQgcHJvcGVydHldXG4gICBgKGFnZXQgKG9yIH50YXJnZXQgMClcbiAgICAgICAgICB+cHJvcGVydHkpKVxuICAoW3RhcmdldCBwcm9wZXJ0eSBkZWZhdWx0Kl1cbiAgICAoaWYgKGlkZW50aWNhbD8gZGVmYXVsdCogbmlsKVxuICAgICAgYChnZXQgfnRhcmdldCB+cHJvcGVydHkpXG4gICAgICBgKGFwcGx5IGdldCB+W3RhcmdldCBwcm9wZXJ0eSBkZWZhdWx0Kl0pKSkpXG4oaW5zdGFsbC1tYWNybyEgOmdldCBnZXQtbWFjcm8pXG5cbjs7IExvZ2ljYWwgb3BlcmF0b3JzXG5cbihkZWZuIGluc3RhbGwtbG9naWNhbC1vcGVyYXRvciFcbiAgW2NhbGxlZSBvcGVyYXRvciBmYWxsYmFja11cbiAgKGRlZm4gd3JpdGUtbG9naWNhbC1vcGVyYXRvclxuICAgIFsmIG9wZXJhbmRzXVxuICAgIChsZXQgW24gKGNvdW50IG9wZXJhbmRzKV1cbiAgICAgIChjb25kICg9IG4gMCkgKHdyaXRlLWNvbnN0YW50IGZhbGxiYWNrKVxuICAgICAgICAgICAgKD0gbiAxKSAod3JpdGUgKGZpcnN0IG9wZXJhbmRzKSlcbiAgICAgICAgICAgIDplbHNlIChyZWR1Y2UgKGZuIFtsZWZ0IHJpZ2h0XVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHs6dHlwZSA6TG9naWNhbEV4cHJlc3Npb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOm9wZXJhdG9yIG9wZXJhdG9yXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpsZWZ0IGxlZnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnJpZ2h0ICh3cml0ZSByaWdodCl9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAod3JpdGUgKGZpcnN0IG9wZXJhbmRzKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKHJlc3Qgb3BlcmFuZHMpKSkpKVxuICAoaW5zdGFsbC1zcGVjaWFsISBjYWxsZWUgd3JpdGUtbG9naWNhbC1vcGVyYXRvcikpXG4oaW5zdGFsbC1sb2dpY2FsLW9wZXJhdG9yISA6b3IgOnx8IG5pbClcbihpbnN0YWxsLWxvZ2ljYWwtb3BlcmF0b3IhIDphbmQgOiYmIHRydWUpXG5cbihkZWZuIGluc3RhbGwtdW5hcnktb3BlcmF0b3IhXG4gIFtjYWxsZWUgb3BlcmF0b3IgcHJlZml4P11cbiAgKGRlZm4gd3JpdGUtdW5hcnktb3BlcmF0b3JcbiAgICBbJiBwYXJhbXNdXG4gICAgKGlmIChpZGVudGljYWw/IChjb3VudCBwYXJhbXMpIDEpXG4gICAgICB7OnR5cGUgOlVuYXJ5RXhwcmVzc2lvblxuICAgICAgIDpvcGVyYXRvciBvcGVyYXRvclxuICAgICAgIDphcmd1bWVudCAod3JpdGUgKGZpcnN0IHBhcmFtcykpXG4gICAgICAgOnByZWZpeCBwcmVmaXg/fVxuICAgICAgKGVycm9yLWFyZy1jb3VudCBjYWxsZWUgKGNvdW50IHBhcmFtcykpKSlcbiAgKGluc3RhbGwtc3BlY2lhbCEgY2FsbGVlIHdyaXRlLXVuYXJ5LW9wZXJhdG9yKSlcbihpbnN0YWxsLXVuYXJ5LW9wZXJhdG9yISA6bm90IDohKVxuXG47OyBCaXR3aXNlIE9wZXJhdG9yc1xuXG4oaW5zdGFsbC11bmFyeS1vcGVyYXRvciEgOmJpdC1ub3QgOn4pXG5cbihkZWZuIGluc3RhbGwtYmluYXJ5LW9wZXJhdG9yIVxuICBbY2FsbGVlIG9wZXJhdG9yXVxuICAoZGVmbiB3cml0ZS1iaW5hcnktb3BlcmF0b3JcbiAgICBbJiBwYXJhbXNdXG4gICAgKGlmICg8IChjb3VudCBwYXJhbXMpIDIpXG4gICAgICAoZXJyb3ItYXJnLWNvdW50IGNhbGxlZSAoY291bnQgcGFyYW1zKSlcbiAgICAgIChyZWR1Y2UgKGZuIFtsZWZ0IHJpZ2h0XVxuICAgICAgICAgICAgICAgIHs6dHlwZSA6QmluYXJ5RXhwcmVzc2lvblxuICAgICAgICAgICAgICAgICA6b3BlcmF0b3Igb3BlcmF0b3JcbiAgICAgICAgICAgICAgICAgOmxlZnQgbGVmdFxuICAgICAgICAgICAgICAgICA6cmlnaHQgKHdyaXRlIHJpZ2h0KX0pXG4gICAgICAgICAgICAgICh3cml0ZSAoZmlyc3QgcGFyYW1zKSlcbiAgICAgICAgICAgICAgKHJlc3QgcGFyYW1zKSkpKVxuICAoaW5zdGFsbC1zcGVjaWFsISBjYWxsZWUgd3JpdGUtYmluYXJ5LW9wZXJhdG9yKSlcbihpbnN0YWxsLWJpbmFyeS1vcGVyYXRvciEgOmJpdC1hbmQgOiYpXG4oaW5zdGFsbC1iaW5hcnktb3BlcmF0b3IhIDpiaXQtb3IgOnwpXG4oaW5zdGFsbC1iaW5hcnktb3BlcmF0b3IhIDpiaXQteG9yIDpeKVxuKGluc3RhbGwtYmluYXJ5LW9wZXJhdG9yISA6Yml0LXNoaWZ0LWxlZnQgOjw8KVxuKGluc3RhbGwtYmluYXJ5LW9wZXJhdG9yISA6Yml0LXNoaWZ0LXJpZ2h0IDo+PilcbihpbnN0YWxsLWJpbmFyeS1vcGVyYXRvciEgOmJpdC1zaGlmdC1yaWdodC16ZXJvLWZpbCA6Pj4+KVxuXG47OyBBcml0aG1ldGljIG9wZXJhdG9yc1xuXG4oZGVmbiBpbnN0YWxsLWFyaXRobWV0aWMtb3BlcmF0b3IhXG4gIFtjYWxsZWUgb3BlcmF0b3IgdmFsaWQ/IGZhbGxiYWNrXVxuXG4gIChkZWZuIHdyaXRlLWJpbmFyeS1vcGVyYXRvclxuICAgIFtsZWZ0IHJpZ2h0XVxuICAgIHs6dHlwZSA6QmluYXJ5RXhwcmVzc2lvblxuICAgICA6b3BlcmF0b3IgKG5hbWUgb3BlcmF0b3IpXG4gICAgIDpsZWZ0IGxlZnRcbiAgICAgOnJpZ2h0ICh3cml0ZSByaWdodCl9KVxuXG4gIChkZWZuIHdyaXRlLWFyaXRobWV0aWMtb3BlcmF0b3JcbiAgICBbJiBwYXJhbXNdXG4gICAgKGxldCBbbiAoY291bnQgcGFyYW1zKV1cbiAgICAgIChjb25kIChhbmQgdmFsaWQ/IChub3QgKHZhbGlkPyBuKSkpIChlcnJvci1hcmctY291bnQgKG5hbWUgY2FsbGVlKSBuKVxuICAgICAgICAgICAgKD09IG4gMCkgKHdyaXRlLWxpdGVyYWwgZmFsbGJhY2spXG4gICAgICAgICAgICAoPT0gbiAxKSAocmVkdWNlIHdyaXRlLWJpbmFyeS1vcGVyYXRvclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAod3JpdGUtbGl0ZXJhbCBmYWxsYmFjaylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zKVxuICAgICAgICAgICAgOmVsc2UgKHJlZHVjZSB3cml0ZS1iaW5hcnktb3BlcmF0b3JcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKHdyaXRlIChmaXJzdCBwYXJhbXMpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAocmVzdCBwYXJhbXMpKSkpKVxuXG5cbiAgKGluc3RhbGwtc3BlY2lhbCEgY2FsbGVlIHdyaXRlLWFyaXRobWV0aWMtb3BlcmF0b3IpKVxuXG4oaW5zdGFsbC1hcml0aG1ldGljLW9wZXJhdG9yISA6KyA6KyBuaWwgMClcbihpbnN0YWxsLWFyaXRobWV0aWMtb3BlcmF0b3IhIDotIDotICMoPj0gJSAxKSAwKVxuKGluc3RhbGwtYXJpdGhtZXRpYy1vcGVyYXRvciEgOiogOiogbmlsIDEpXG4oaW5zdGFsbC1hcml0aG1ldGljLW9wZXJhdG9yISAoa2V5d29yZCBcXC8pIChrZXl3b3JkIFxcLykgIyg+PSAlIDEpIDEpXG4oaW5zdGFsbC1hcml0aG1ldGljLW9wZXJhdG9yISA6cmVtIChrZXl3b3JkIFxcJSkgIyg9PSAlIDIpIDEpXG5cblxuOzsgQ29tcGFyaXNvbiBvcGVyYXRvcnNcblxuKGRlZm4gaW5zdGFsbC1jb21wYXJpc29uLW9wZXJhdG9yIVxuICBcIkdlbmVyYXRlcyBjb21wYXJpc29uIG9wZXJhdG9yIHdyaXRlciB0aGF0IGdpdmVuIG9uZVxuICBwYXJhbWV0ZXIgd3JpdGVzIGBmYWxsYmFja2AgZ2l2ZW4gdHdvIHBhcmFtZXRlcnMgd3JpdGVzXG4gIGJpbmFyeSBleHByZXNzaW9uIGFuZCBnaXZlbiBtb3JlIHBhcmFtZXRlcnMgd3JpdGVzIGJpbmFyeVxuICBleHByZXNzaW9ucyBqb2luZWQgYnkgbG9naWNhbCBhbmQuXCJcbiAgW2NhbGxlZSBvcGVyYXRvciBmYWxsYmFja11cblxuICA7OyBUT0RPICM1NFxuICA7OyBDb21wYXJpc29uIG9wZXJhdG9ycyBtdXN0IHVzZSB0ZW1wb3JhcnkgdmFyaWFibGUgdG8gc3RvcmVcbiAgOzsgZXhwcmVzc2lvbiBub24gbGl0ZXJhbCBhbmQgbm9uLWlkZW50aWZpZXJzLlxuICAoZGVmbiB3cml0ZS1jb21wYXJpc29uLW9wZXJhdG9yXG4gICAgKFtdIChlcnJvci1hcmctY291bnQgY2FsbGVlIDApKVxuICAgIChbZm9ybV0gKC0+c2VxdWVuY2UgWyh3cml0ZSBmb3JtKVxuICAgICAgICAgICAgICAgICAgICAgICAgICh3cml0ZS1saXRlcmFsIGZhbGxiYWNrKV0pKVxuICAgIChbbGVmdCByaWdodF1cbiAgICAgezp0eXBlIDpCaW5hcnlFeHByZXNzaW9uXG4gICAgICA6b3BlcmF0b3Igb3BlcmF0b3JcbiAgICAgIDpsZWZ0ICh3cml0ZSBsZWZ0KVxuICAgICAgOnJpZ2h0ICh3cml0ZSByaWdodCl9KVxuICAgIChbbGVmdCByaWdodCAmIG1vcmVdXG4gICAgIChyZWR1Y2UgKGZuIFtsZWZ0IHJpZ2h0XVxuICAgICAgICAgICAgICAgezp0eXBlIDpMb2dpY2FsRXhwcmVzc2lvblxuICAgICAgICAgICAgICAgIDpvcGVyYXRvciA6JiZcbiAgICAgICAgICAgICAgICA6bGVmdCBsZWZ0XG4gICAgICAgICAgICAgICAgOnJpZ2h0IHs6dHlwZSA6QmluYXJ5RXhwcmVzc2lvblxuICAgICAgICAgICAgICAgICAgICAgICAgOm9wZXJhdG9yIG9wZXJhdG9yXG4gICAgICAgICAgICAgICAgICAgICAgICA6bGVmdCAoaWYgKD0gOkxvZ2ljYWxFeHByZXNzaW9uICg6dHlwZSBsZWZ0KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKDpyaWdodCAoOnJpZ2h0IGxlZnQpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoOnJpZ2h0IGxlZnQpKVxuICAgICAgICAgICAgICAgICAgICAgICAgOnJpZ2h0ICh3cml0ZSByaWdodCl9fSlcbiAgICAgICAgICAgICAod3JpdGUtY29tcGFyaXNvbi1vcGVyYXRvciBsZWZ0IHJpZ2h0KVxuICAgICAgICAgICAgIG1vcmUpKSlcblxuICAoaW5zdGFsbC1zcGVjaWFsISBjYWxsZWUgd3JpdGUtY29tcGFyaXNvbi1vcGVyYXRvcikpXG5cbihpbnN0YWxsLWNvbXBhcmlzb24tb3BlcmF0b3IhIDo9PSA6PT0gdHJ1ZSlcbihpbnN0YWxsLWNvbXBhcmlzb24tb3BlcmF0b3IhIDo+IDo+IHRydWUpXG4oaW5zdGFsbC1jb21wYXJpc29uLW9wZXJhdG9yISA6Pj0gOj49IHRydWUpXG4oaW5zdGFsbC1jb21wYXJpc29uLW9wZXJhdG9yISA6PCA6PCB0cnVlKVxuKGluc3RhbGwtY29tcGFyaXNvbi1vcGVyYXRvciEgOjw9IDo8PSB0cnVlKVxuXG5cbihkZWZuIHdyaXRlLWlkZW50aWNhbD9cbiAgWyYgcGFyYW1zXVxuICA7OyBUT0RPOiBTdWJtaXQgYSBidWcgZm9yIGNsb2p1cmUgdG8gYWxsb3cgdmFyaWFkaWNcbiAgOzsgbnVtYmVyIG9mIHBhcmFtcyBqb2luZWQgYnkgbG9naWNhbCBhbmQuXG4gIChpZiAoaWRlbnRpY2FsPyAoY291bnQgcGFyYW1zKSAyKVxuICAgIHs6dHlwZSA6QmluYXJ5RXhwcmVzc2lvblxuICAgICA6b3BlcmF0b3IgOj09PVxuICAgICA6bGVmdCAod3JpdGUgKGZpcnN0IHBhcmFtcykpXG4gICAgIDpyaWdodCAod3JpdGUgKHNlY29uZCBwYXJhbXMpKX1cbiAgICAoZXJyb3ItYXJnLWNvdW50IDppZGVudGljYWw/IChjb3VudCBwYXJhbXMpKSkpXG4oaW5zdGFsbC1zcGVjaWFsISA6aWRlbnRpY2FsPyB3cml0ZS1pZGVudGljYWw/KVxuXG4oZGVmbiB3cml0ZS1pbnN0YW5jZT9cbiAgWyYgcGFyYW1zXVxuICA7OyBUT0RPOiBTdWJtaXQgYSBidWcgZm9yIGNsb2p1cmUgdG8gbWFrZSBzdXJlIHRoYXRcbiAgOzsgaW5zdGFuY2U/IGVpdGhlciBhY2NlcHRzIG9ubHkgdHdvIGFyZ3Mgb3IgcmV0dXJuc1xuICA7OyB0cnVlIG9ubHkgaWYgYWxsIHRoZSBwYXJhbXMgYXJlIGluc3RhbmNlIG9mIHRoZVxuICA7OyBnaXZlbiB0eXBlLlxuXG4gIChsZXQgW2NvbnN0cnVjdG9yIChmaXJzdCBwYXJhbXMpXG4gICAgICAgIGluc3RhbmNlIChzZWNvbmQgcGFyYW1zKV1cbiAgICAoaWYgKDwgKGNvdW50IHBhcmFtcykgMSlcbiAgICAgIChlcnJvci1hcmctY291bnQgOmluc3RhbmNlPyAoY291bnQgcGFyYW1zKSlcbiAgICAgIHs6dHlwZSA6QmluYXJ5RXhwcmVzc2lvblxuICAgICAgIDpvcGVyYXRvciA6aW5zdGFuY2VvZlxuICAgICAgIDpsZWZ0IChpZiBpbnN0YW5jZVxuICAgICAgICAgICAgICAgKHdyaXRlIGluc3RhbmNlKVxuICAgICAgICAgICAgICAgKHdyaXRlLWNvbnN0YW50IGluc3RhbmNlKSlcbiAgICAgICA6cmlnaHQgKHdyaXRlIGNvbnN0cnVjdG9yKX0pKSlcbihpbnN0YWxsLXNwZWNpYWwhIDppbnN0YW5jZT8gd3JpdGUtaW5zdGFuY2U/KVxuXG5cbihkZWZuIGV4cGFuZC1hcHBseVxuICBbZiAmIHBhcmFtc11cbiAgKGxldCBbcHJlZml4ICh2ZWMgKGJ1dGxhc3QgcGFyYW1zKSldXG4gICAgKGlmIChlbXB0eT8gcHJlZml4KVxuICAgICAgYCguYXBwbHkgfmYgbmlsIH5AcGFyYW1zKVxuICAgICAgYCguYXBwbHkgfmYgbmlsICguY29uY2F0IH5wcmVmaXggfihsYXN0IHBhcmFtcykpKSkpKVxuKGluc3RhbGwtbWFjcm8hIDphcHBseSBleHBhbmQtYXBwbHkpXG5cblxuKGRlZm4gZXhwYW5kLXByaW50XG4gIFsmZm9ybSAmIG1vcmVdXG4gIFwiUHJpbnRzIHRoZSBvYmplY3QocykgdG8gdGhlIG91dHB1dCBmb3IgaHVtYW4gY29uc3VtcHRpb24uXCJcbiAgKGxldCBbb3AgKHdpdGgtbWV0YSAnY29uc29sZS5sb2cgKG1ldGEgJmZvcm0pKV1cbiAgICBgKH5vcCB+QG1vcmUpKSlcbihpbnN0YWxsLW1hY3JvISA6cHJpbnQgKHdpdGgtbWV0YSBleHBhbmQtcHJpbnQgezppbXBsaWNpdCBbOiZmb3JtXX0pKVxuXG4oZGVmbiBleHBhbmQtc3RyXG4gIFwic3RyIGlubGluaW5nIGFuZCBvcHRpbWl6YXRpb24gdmlhIG1hY3Jvc1wiXG4gIFsmIGZvcm1zXVxuICBgKCsgXCJcIiB+QGZvcm1zKSlcbihpbnN0YWxsLW1hY3JvISA6c3RyIGV4cGFuZC1zdHIpXG5cbihkZWZuIGV4cGFuZC1kZWJ1Z1xuICBbXVxuICAnZGVidWdnZXIpXG4oaW5zdGFsbC1tYWNybyEgOmRlYnVnZ2VyISBleHBhbmQtZGVidWcpXG5cbihkZWZuIGV4cGFuZC1hc3NlcnRcbiAgXns6ZG9jIFwiRXZhbHVhdGVzIGV4cHIgYW5kIHRocm93cyBhbiBleGNlcHRpb24gaWYgaXQgZG9lcyBub3QgZXZhbHVhdGUgdG9cbiAgICBsb2dpY2FsIHRydWUuXCJ9XG4gIChbeF0gKGV4cGFuZC1hc3NlcnQgeCBcIlwiKSlcbiAgKFt4IG1lc3NhZ2VdIChsZXQgW2Zvcm0gKHByLXN0ciB4KV1cbiAgICAgICAgICAgICAgICAgYChpZiAobm90IH54KVxuICAgICAgICAgICAgICAgICAgICAodGhyb3cgKEVycm9yIChzdHIgXCJBc3NlcnQgZmFpbGVkOiBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfm1lc3NhZ2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH5mb3JtKSkpKSkpKVxuKGluc3RhbGwtbWFjcm8hIDphc3NlcnQgZXhwYW5kLWFzc2VydClcblxuXG4oZGVmbiBleHBhbmQtdHlwZXN0ciBbaXRdXG4gIChsZXQgW3ByZWZpeCBcIltvYmplY3QgXCIsIHN1ZmZpeCBcIl1cIl1cbiAgICBgKC0+ICguY2FsbCBPYmplY3QucHJvdG90eXBlLnRvLXN0cmluZyB+aXQpXG4gICAgICAgICAoLnNsaWNlIH4oY291bnQgcHJlZml4KSB+KC0gKGNvdW50IHN1ZmZpeCkpKSkpKVxuXG4oZGVmbiBleHBhbmQtZGVmcHJvdG9jb2xcbiAgWyZlbnYgaWQgJiBmb3Jtc11cbiAgKGxldCBbbnMgKG5hbWUgKDpuYW1lICg6bnMgJmVudikpKVxuICAgICAgICBwcm90b2NvbC1uYW1lIChuYW1lIGlkKVxuICAgICAgICBwcm90b2NvbC1kb2MgKGlmIChzdHJpbmc/IChmaXJzdCBmb3JtcykpXG4gICAgICAgICAgICAgICAgICAgICAgIChmaXJzdCBmb3JtcykpXG4gICAgICAgIHByb3RvY29sLW1ldGhvZHMgKGlmIHByb3RvY29sLWRvY1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgKHJlc3QgZm9ybXMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JtcylcbiAgICAgICAgbm90LXN1cHBvcnRlZCAoZm4gW21ldGhvZF0gYCModGhyb3cgKHN0ciB+KHN0ciBcIk5vIHByb3RvY29sIG1ldGhvZCBcIiBwcm90b2NvbC1uYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIuXCIgbWV0aG9kIFwiIGRlZmluZWQgZm9yIHR5cGUgXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfihleHBhbmQtdHlwZXN0ciAnJSkgXCI6IFwiICUpKSlcbiAgICAgICAgcHJvdG9jb2wgKG1hcHYgKGZuIFttZXRob2RdXG4gICAgICAgICAgICAgICAgICAgICAgICAgKGxldCBbbWV0aG9kLW5hbWUgKGZpcnN0IG1ldGhvZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZCAoaWQtPm5zIChzdHIgbnMgXCIkXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvdG9jb2wtbmFtZSBcIiRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAobmFtZSBtZXRob2QtbmFtZSkpKV1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHs6aWQgbWV0aG9kLW5hbWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Zm4gYChmbiB+aWQgW3NlbGZdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICguYXBwbHkgKG9yIChpZiAob3IgKGlkZW50aWNhbD8gc2VsZiBudWxsKSAoaWRlbnRpY2FsPyBzZWxmIG5pbCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKC4tbmlsIH5pZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAob3IgKGFnZXQgc2VsZiAnfmlkKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoYWdldCB+aWQgfihleHBhbmQtdHlwZXN0ciAnc2VsZikpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICguLV8gfmlkKSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH4obm90LXN1cHBvcnRlZCAobmFtZSBpZCkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYgYXJndW1lbnRzKSl9KSlcbiAgICAgICAgICAgICAgICAgICAgICAgcHJvdG9jb2wtbWV0aG9kcylcbiAgICAgICAgZm5zIChtYXAgKGZuIFtmb3JtXVxuICAgICAgICAgICAgICAgICAgIGAoZGVmIH4oOmlkIGZvcm0pIChhZ2V0IH5pZCAnfig6aWQgZm9ybSkpKSlcbiAgICAgICAgICAgICAgICAgcHJvdG9jb2wpXG4gICAgICAgIHNhdGlzZnkgezp3aXNwX2NvcmUkSVByb3RvY29sJGlkIChzdHIgbnMgXCIvXCIgcHJvdG9jb2wtbmFtZSl9XG4gICAgICAgIGJvZHkgKHJlZHVjZSAoZm4gW2JvZHkgbWV0aG9kXVxuICAgICAgICAgICAgICAgICAgICAgICAoYXNzb2MgYm9keSAoOmlkIG1ldGhvZCkgKDpmbiBtZXRob2QpKSlcbiAgICAgICAgICAgICAgICAgICAgIHNhdGlzZnlcbiAgICAgICAgICAgICAgICAgICAgIHByb3RvY29sKV1cbiAgICBgKH4od2l0aC1tZXRhICdkbyB7OmJsb2NrIHRydWV9KVxuICAgICAgIChkZWYgfmlkIH5ib2R5KVxuICAgICAgIH5AZm5zXG4gICAgICAgfmlkKSkpXG4oaW5zdGFsbC1tYWNybyEgOmRlZnByb3RvY29sICh3aXRoLW1ldGEgZXhwYW5kLWRlZnByb3RvY29sIHs6aW1wbGljaXQgWzomZW52XX0pKVxuXG4oZGVmbiBleHBhbmQtZGVmdHlwZVxuICBbaWQgZmllbGRzICYgZm9ybXNdXG4gIChsZXQgW3R5cGUtaW5pdCAobWFwIChmbiBbZmllbGRdIGAoc2V0ISAoYWdldCB0aGlzICd+ZmllbGQpIH5maWVsZCkpXG4gICAgICAgICAgICAgICAgICAgICAgIGZpZWxkcylcbiAgICAgICAgY29uc3RydWN0b3IgKGNvbmogdHlwZS1pbml0ICd0aGlzKVxuICAgICAgICBtZXRob2QtaW5pdCAobWFwIChmbiBbZmllbGRdIGAoZGVmIH5maWVsZCAoYWdldCB0aGlzICd+ZmllbGQpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZHMpXG4gICAgICAgIG1ha2UtbWV0aG9kIChmbiBbcHJvdG9jb2wgZm9ybV1cbiAgICAgICAgICAgICAgICAgICAgICAobGV0IFttZXRob2QtbmFtZSAoZmlyc3QgZm9ybSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXMgKHNlY29uZCBmb3JtKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvZHkgKHJlc3QgKHJlc3QgZm9ybSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmllbGQtbmFtZSAoaWYgKD0gKG5hbWUgcHJvdG9jb2wpIFwiT2JqZWN0XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGAocXVvdGUgfm1ldGhvZC1uYW1lKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgKC4tbmFtZSAoYWdldCB+cHJvdG9jb2wgJ35tZXRob2QtbmFtZSkpKV1cblxuICAgICAgICAgICAgICAgICAgICAgICAgYChzZXQhIChhZ2V0ICguLXByb3RvdHlwZSB+aWQpIH5maWVsZC1uYW1lKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmbiB+cGFyYW1zIH5AbWV0aG9kLWluaXQgfkBib2R5KSkpKVxuICAgICAgICBzYXRpc2Z5IChmbiBbcHJvdG9jb2xdXG4gICAgICAgICAgICAgICAgICBgKHNldCEgKGFnZXQgKC4tcHJvdG90eXBlIH5pZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoLi13aXNwX2NvcmUkSVByb3RvY29sJGlkIH5wcm90b2NvbCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgdHJ1ZSkpXG5cbiAgICAgICAgYm9keSAocmVkdWNlIChmbiBbdHlwZSBmb3JtXVxuICAgICAgICAgICAgICAgICAgICAgICAoaWYgKGxpc3Q/IGZvcm0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgKGNvbmogdHlwZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHs6Ym9keSAoY29uaiAoOmJvZHkgdHlwZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG1ha2UtbWV0aG9kICg6cHJvdG9jb2wgdHlwZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcm0pKX0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgKGNvbmogdHlwZSB7OnByb3RvY29sIGZvcm1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Ym9keSAoY29uaiAoOmJvZHkgdHlwZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoc2F0aXNmeSBmb3JtKSl9KSkpXG5cbiAgICAgICAgICAgICAgICAgICAgICAgezpwcm90b2NvbCBuaWxcbiAgICAgICAgICAgICAgICAgICAgICAgIDpib2R5IFtdfVxuXG4gICAgICAgICAgICAgICAgICAgICAgIGZvcm1zKVxuXG4gICAgICAgIG1ldGhvZHMgKDpib2R5IGJvZHkpXVxuICAgIGAoZGVmIH5pZCAoZG9cbiAgICAgICAoZGVmbi0gfmlkIH5maWVsZHMgfkBjb25zdHJ1Y3RvcilcbiAgICAgICB+QG1ldGhvZHNcbiAgICAgICB+aWQpKSkpXG4oaW5zdGFsbC1tYWNybyEgOmRlZnR5cGUgZXhwYW5kLWRlZnR5cGUpXG4oaW5zdGFsbC1tYWNybyEgOmRlZnJlY29yZCBleHBhbmQtZGVmdHlwZSlcblxuKGRlZm4gZXhwYW5kLWV4dGVuZC10eXBlXG4gIFt0eXBlICYgZm9ybXNdXG4gIChsZXQgW2RlZmF1bHQtdHlwZT8gKD0gdHlwZSAnZGVmYXVsdClcbiAgICAgICAgbmlsLXR5cGU/IChuaWw/IHR5cGUpXG5cbiAgICAgICAgdHlwZS1uYW1lIChjb25kIChuaWw/IHR5cGUpIChzeW1ib2wgXCJuaWxcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICg9IHR5cGUgJ2RlZmF1bHQpICdfXG4gICAgICAgICAgICAgICAgICAgICAgICAoPSB0eXBlICdudW1iZXIpICdOdW1iZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICg9IHR5cGUgJ3N0cmluZykgJ1N0cmluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgKD0gdHlwZSAnYm9vbGVhbikgJ0Jvb2xlYW5cbiAgICAgICAgICAgICAgICAgICAgICAgICg9IHR5cGUgJ3ZlY3RvcikgJ0FycmF5XG4gICAgICAgICAgICAgICAgICAgICAgICAoPSB0eXBlICdmdW5jdGlvbikgJ0Z1bmN0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAoPSB0eXBlICdyZS1wYXR0ZXJuKSAnUmVnRXhwXG4gICAgICAgICAgICAgICAgICAgICAgICAoPSAobmFtZXNwYWNlIHR5cGUpIFwianNcIikgdHlwZVxuICAgICAgICAgICAgICAgICAgICAgICAgOmVsc2UgbmlsKVxuXG4gICAgICAgIHNhdGlzZnkgKGZuIFtwcm90b2NvbF1cbiAgICAgICAgICAgICAgICAgIChpZiB0eXBlLW5hbWVcbiAgICAgICAgICAgICAgICAgICAgYChzZXQhIChhZ2V0IH5wcm90b2NvbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ34oc3ltYm9sIChzdHIgXCJ3aXNwX2NvcmUkSVByb3RvY29sJFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAobmFtZSB0eXBlLW5hbWUpKSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0cnVlKVxuICAgICAgICAgICAgICAgICAgICBgKHNldCEgKGFnZXQgKC4tcHJvdG90eXBlIH50eXBlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKC4td2lzcF9jb3JlJElQcm90b2NvbCRpZCB+cHJvdG9jb2wpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ1ZSkpKVxuXG4gICAgICAgIG1ha2UtbWV0aG9kIChmbiBbcHJvdG9jb2wgZm9ybV1cbiAgICAgICAgICAgICAgICAgICAgICAobGV0IFttZXRob2QtbmFtZSAoZmlyc3QgZm9ybSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXMgKHNlY29uZCBmb3JtKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvZHkgKHJlc3QgKHJlc3QgZm9ybSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0IChpZiB0eXBlLW5hbWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgKGFnZXQgKGFnZXQgfnByb3RvY29sICd+bWV0aG9kLW5hbWUpICd+dHlwZS1uYW1lKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGAoYWdldCAoLi1wcm90b3R5cGUgfnR5cGUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICguLW5hbWUgKGFnZXQgfnByb3RvY29sICd+bWV0aG9kLW5hbWUpKSkpXVxuICAgICAgICAgICAgICAgICAgICAgICAgYChzZXQhIH50YXJnZXQgKGZuIH5wYXJhbXMgfkBib2R5KSkpKVxuXG4gICAgICAgIGJvZHkgKHJlZHVjZSAoZm4gW2JvZHkgZm9ybV1cbiAgICAgICAgICAgICAgICAgICAgICAgKGlmIChsaXN0PyBmb3JtKVxuICAgICAgICAgICAgICAgICAgICAgICAgIChjb25qIGJvZHlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Om1ldGhvZHMgKGNvbmogKDptZXRob2RzIGJvZHkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChtYWtlLW1ldGhvZCAoOnByb3RvY29sIGJvZHkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JtKSl9KVxuICAgICAgICAgICAgICAgICAgICAgICAgIChjb25qIGJvZHkgezpwcm90b2NvbCBmb3JtXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOm1ldGhvZHMgKGNvbmogKDptZXRob2RzIGJvZHkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHNhdGlzZnkgZm9ybSkpfSkpKVxuXG4gICAgICAgICAgICAgICAgICAgICAgIHs6cHJvdG9jb2wgbmlsXG4gICAgICAgICAgICAgICAgICAgICAgICA6bWV0aG9kcyBbXX1cblxuICAgICAgICAgICAgICAgICAgICAgICBmb3JtcylcbiAgICAgICAgbWV0aG9kcyAoOm1ldGhvZHMgYm9keSldXG4gICAgYChkbyB+QG1ldGhvZHMgbmlsKSkpXG4oaW5zdGFsbC1tYWNybyEgOmV4dGVuZC10eXBlIGV4cGFuZC1leHRlbmQtdHlwZSlcblxuKGRlZm4gZXhwYW5kLWV4dGVuZC1wcm90b2NvbFxuICBbcHJvdG9jb2wgJiBmb3Jtc11cbiAgKGxldCBbc3BlY3MgKHJlZHVjZSAoZm4gW3NwZWNzIGZvcm1dXG4gICAgICAgICAgICAgICAgICAgICAgICAoaWYgKGxpc3Q/IGZvcm0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgIChjb25zIHs6dHlwZSAoOnR5cGUgKGZpcnN0IHNwZWNzKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDptZXRob2RzIChjb25qICg6bWV0aG9kcyAoZmlyc3Qgc3BlY3MpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9ybSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChyZXN0IHNwZWNzKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKGNvbnMgezp0eXBlIGZvcm1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDptZXRob2RzIFtdfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcGVjcykpKVxuICAgICAgICAgICAgICAgICAgICAgIG5pbFxuICAgICAgICAgICAgICAgICAgICAgIGZvcm1zKVxuICAgICAgICBib2R5IChtYXAgKGZuIFtmb3JtXVxuICAgICAgICAgICAgICAgICAgICBgKGV4dGVuZC10eXBlIH4oOnR5cGUgZm9ybSlcbiAgICAgICAgICAgICAgICAgICAgICAgfnByb3RvY29sXG4gICAgICAgICAgICAgICAgICAgICAgIH5AKDptZXRob2RzIGZvcm0pXG4gICAgICAgICAgICAgICAgICAgICAgICkpXG4gICAgICAgICAgICAgICAgICBzcGVjcyldXG5cblxuICAgIGAoZG8gfkBib2R5IG5pbCkpKVxuKGluc3RhbGwtbWFjcm8hIDpleHRlbmQtcHJvdG9jb2wgZXhwYW5kLWV4dGVuZC1wcm90b2NvbClcblxuKGRlZm4gYXNldC1leHBhbmRcbiAgKFt0YXJnZXQgZmllbGQgdmFsdWVdXG4gICBgKHNldCEgKGFnZXQgfnRhcmdldCB+ZmllbGQpIH52YWx1ZSkpXG4gIChbdGFyZ2V0IGZpZWxkIHN1Yi1maWVsZCAmIHN1Yi1maWVsZHMmdmFsdWVdXG4gICAobGV0IFtyZXNvbHZlZC10YXJnZXQgKHJlZHVjZSAoZm4gW2Zvcm0gbm9kZV1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYChhZ2V0IH5mb3JtIH5ub2RlKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGAoYWdldCB+dGFyZ2V0IH5maWVsZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChjb25zIHN1Yi1maWVsZCAoYnV0bGFzdCBzdWItZmllbGRzJnZhbHVlKSkpXG4gICAgICAgICB2YWx1ZSAobGFzdCBzdWItZmllbGRzJnZhbHVlKV1cbiAgICAgYChzZXQhIH5yZXNvbHZlZC10YXJnZXQgfnZhbHVlKSkpKVxuKGluc3RhbGwtbWFjcm8hIDphc2V0IGFzZXQtZXhwYW5kKVxuXG4oZGVmbiBhbGVuZ3RoLWV4cGFuZFxuICBcIlJldHVybnMgdGhlIGxlbmd0aCBvZiB0aGUgYXJyYXkuIFdvcmtzIG9uIGFycmF5cyBvZiBhbGwgdHlwZXMuXCJcbiAgW2FycmF5XVxuICBgKC4tbGVuZ3RoIH5hcnJheSkpXG4oaW5zdGFsbC1tYWNybyEgOmFsZW5ndGggYWxlbmd0aC1leHBhbmQpXG5cbiJdfQ==
