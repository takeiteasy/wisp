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
        id = join('_QMARK_', split(id, '?'));
        id = join('_GT_', split(id, '>'));
        id = join('_LT_', split(id, '<'));
        id = join('_SLASH_', split(id, '/'));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndpc3AvYmFja2VuZC9lc2NvZGVnZW4vd3JpdGVyLndpc3AiXSwibmFtZXMiOlsiX25zXyIsImlkIiwiZG9jIiwicmVhZEZyb21TdHJpbmciLCJtZXRhIiwid2l0aE1ldGEiLCJpc1N5bWJvbCIsInN5bWJvbCIsImlzS2V5d29yZCIsImtleXdvcmQiLCJuYW1lc3BhY2UiLCJpc1VucXVvdGUiLCJpc1VucXVvdGVTcGxpY2luZyIsImlzUXVvdGUiLCJpc1N5bnRheFF1b3RlIiwibmFtZSIsImdlbnN5bSIsInByU3RyIiwiaXNFbXB0eSIsImNvdW50IiwiaXNMaXN0IiwibGlzdCIsImZpcnN0Iiwic2Vjb25kIiwidGhpcmQiLCJyZXN0IiwiY29ucyIsImNvbmoiLCJidXRsYXN0IiwicmV2ZXJzZSIsInJlZHVjZSIsInZlYyIsImxhc3QiLCJtYXAiLCJtYXB2IiwiZmlsdGVyIiwidGFrZSIsImNvbmNhdCIsInBhcnRpdGlvbiIsInJlcGVhdCIsImludGVybGVhdmUiLCJhc3NvYyIsImlzT2RkIiwiaXNEaWN0aW9uYXJ5IiwiZGljdGlvbmFyeSIsIm1lcmdlIiwia2V5cyIsInZhbHMiLCJpc0NvbnRhaW5zVmVjdG9yIiwibWFwRGljdGlvbmFyeSIsImlzU3RyaW5nIiwiaXNOdW1iZXIiLCJpc1ZlY3RvciIsImlzQm9vbGVhbiIsInN1YnMiLCJyZUZpbmQiLCJpc1RydWUiLCJpc0ZhbHNlIiwiaXNOaWwiLCJpc1JlUGF0dGVybiIsImluYyIsImRlYyIsInN0ciIsImNoYXIiLCJpbnQiLCJpc0VxdWFsIiwiaXNTdHJpY3RFcXVhbCIsImdldCIsInNwbGl0Iiwiam9pbiIsInVwcGVyQ2FzZSIsInJlcGxhY2UiLCJ0cmltbCIsImluc3RhbGxNYWNybyIsImdlbmVyYXRlIiwiX191bmlxdWVDaGFyX18iLCJleHBvcnRzIiwidG9DYW1lbEpvaW4iLCJwcmVmaXgiLCJrZXkiLCJ0b1ByaXZhdGVQcmVmaXgiLCJzcGFjZURlbGltaXRlZMO4MSIsImxlZnRUcmltbWVkw7gxIiwibsO4MSIsInRyYW5zbGF0ZUlkZW50aWZpZXJXb3JkIiwiZm9ybSIsInRyYW5zbGF0ZUlkZW50aWZpZXIiLCJuc8O4MSIsImVycm9yQXJnQ291bnQiLCJjYWxsZWUiLCJuIiwiU3ludGF4RXJyb3IiLCJpbmhlcml0TG9jYXRpb24iLCJib2R5Iiwic3RhcnTDuDEiLCJlbmTDuDEiLCJ3cml0ZUxvY2F0aW9uIiwib3JpZ2luYWwiLCJkYXRhw7gxIiwiaW5oZXJpdGVkw7gxIiwiX193cml0ZXJzX18iLCJpbnN0YWxsV3JpdGVyIiwib3AiLCJ3cml0ZXIiLCJ3cml0ZU9wIiwid3JpdGVyw7gxIiwiX19zcGVjaWFsc19fIiwiaW5zdGFsbFNwZWNpYWwiLCJ3cml0ZVNwZWNpYWwiLCJ3cml0ZU5pbCIsIndyaXRlTGl0ZXJhbCIsIndyaXRlTGlzdCIsIndyaXRlIiwid3JpdGVTeW1ib2wiLCJ3cml0ZUNvbnN0YW50Iiwid3JpdGVOdW1iZXIiLCJ2YWx1ZU9mIiwid3JpdGVTdHJpbmciLCIkMSIsIndyaXRlS2V5d29yZCIsInRvSWRlbnRpZmllciIsIndyaXRlQmluZGluZ1ZhciIsImJhc2VJZMO4MSIsInJlc29sdmVkSWTDuDEiLCJ3cml0ZVZhciIsIm5vZGUiLCJ3cml0ZUludm9rZSIsIndyaXRlVmVjdG9yIiwid3JpdGVEaWN0aW9uYXJ5IiwicHJvcGVydGllc8O4MSIsInBhaXIiLCJrZXnDuDEiLCJ2YWx1ZcO4MSIsIndyaXRlRXhwb3J0Iiwid3JpdGVEZWYiLCJ3cml0ZUJpbmRpbmciLCJpZMO4MSIsImluaXTDuDEiLCJ3cml0ZVRocm93IiwidG9FeHByZXNzaW9uIiwid3JpdGVOZXciLCJ3cml0ZVNldCIsIndyaXRlQWdldCIsIl9fc3RhdGVtZW50c19fIiwid3JpdGVTdGF0ZW1lbnQiLCJ0b1N0YXRlbWVudCIsInRvUmV0dXJuIiwid3JpdGVCb2R5Iiwic3RhdGVtZW50c8O4MSIsInJlc3VsdMO4MSIsInRvQmxvY2siLCJ0b1NlcXVlbmNlIiwid3JpdGVEbyIsIndyaXRlSWYiLCJ3cml0ZVRyeSIsImhhbmRsZXLDuDEiLCJmaW5hbGl6ZXLDuDEiLCJ3cml0ZUJpbmRpbmdWYWx1ZSIsIndyaXRlQmluZGluZ1BhcmFtIiwid3JpdGVMZXQiLCJib2R5w7gxIiwidG9JaWZlIiwidG9SZWJpbmQiLCJiaW5kaW5nc8O4MSIsImV4cHJlc3Npb25zIiwidG9Mb29wSW5pdCIsInRvRG9XaGlsZSIsInRlc3QiLCJ0b1NldFJlY3VyIiwidG9Mb29wIiwid3JpdGVMb29wIiwibG9vcEJvZHnDuDEiLCJ0b1JlY3VyIiwicGFyYW1zw7gxIiwid3JpdGVSZWN1ciIsImZhbGxiYWNrT3ZlcmxvYWQiLCJzcGxpY2VCaW5kaW5nIiwid3JpdGVPdmVybG9hZGluZ1BhcmFtcyIsInBhcmFtcyIsImZvcm1zIiwicGFyYW0iLCJ3cml0ZU92ZXJsb2FkaW5nRm4iLCJvdmVybG9hZHPDuDEiLCJ3cml0ZUZuT3ZlcmxvYWQiLCJ3cml0ZVNpbXBsZUZuIiwibWV0aG9kw7gxIiwicmVzb2x2ZSIsImZyb20iLCJ0byIsInJlcXVpcmVyw7gxIiwicmVxdWlyZW1lbnTDuDEiLCJpc1JlbGF0aXZlw7gxIiwiZnJvbcO4MiIsInRvw7gyIiwiaWRUb05zIiwid3JpdGVSZXF1aXJlIiwicmVxdWlyZXIiLCJuc0JpbmRpbmfDuDEiLCJuc0FsaWFzw7gxIiwicmVmZXJlbmNlc8O4MSIsInJlZmVyZW5jZXMiLCJ3cml0ZU5zIiwibm9kZcO4MSIsInJlcXVpcmVtZW50c8O4MSIsIndyaXRlRm4iLCJiYXNlw7gxIiwib3DDuDEiLCJ3cml0ZV8iLCJjb21waWxlIiwib3B0aW9ucyIsImdldE1hY3JvIiwidGFyZ2V0IiwicHJvcGVydHkiLCJkZWZhdWx0XyIsImluc3RhbGxMb2dpY2FsT3BlcmF0b3IiLCJvcGVyYXRvciIsImZhbGxiYWNrIiwid3JpdGVMb2dpY2FsT3BlcmF0b3IiLCJvcGVyYW5kcyIsImxlZnQiLCJyaWdodCIsImluc3RhbGxVbmFyeU9wZXJhdG9yIiwiaXNQcmVmaXgiLCJ3cml0ZVVuYXJ5T3BlcmF0b3IiLCJpbnN0YWxsQmluYXJ5T3BlcmF0b3IiLCJ3cml0ZUJpbmFyeU9wZXJhdG9yIiwiaW5zdGFsbEFyaXRobWV0aWNPcGVyYXRvciIsImlzVmFsaWQiLCJ3cml0ZUFyaXRobWV0aWNPcGVyYXRvciIsImluc3RhbGxDb21wYXJpc29uT3BlcmF0b3IiLCJ3cml0ZUNvbXBhcmlzb25PcGVyYXRvciIsIm1vcmUiLCJpc1dyaXRlSWRlbnRpY2FsIiwiaXNXcml0ZUluc3RhbmNlIiwiY29uc3RydWN0b3LDuDEiLCJpbnN0YW5jZcO4MSIsImV4cGFuZEFwcGx5IiwiZiIsInByZWZpeMO4MSIsImV4cGFuZFByaW50IiwiX2FuZEZvcm0iLCJleHBhbmRTdHIiLCJleHBhbmREZWJ1ZyIsImV4cGFuZEFzc2VydCIsIngiLCJtZXNzYWdlIiwiZm9ybcO4MSIsImV4cGFuZFR5cGVzdHIiLCJpdCIsInN1ZmZpeMO4MSIsImV4cGFuZERlZnByb3RvY29sIiwiX2FuZEVudiIsInByb3RvY29sTmFtZcO4MSIsInByb3RvY29sRG9jw7gxIiwicHJvdG9jb2xNZXRob2Rzw7gxIiwibm90U3VwcG9ydGVkw7gxIiwibWV0aG9kIiwicHJvdG9jb2zDuDEiLCJtZXRob2ROYW1lw7gxIiwiaWTDuDIiLCJmbnPDuDEiLCJzYXRpc2Z5w7gxIiwiZXhwYW5kRGVmdHlwZSIsImZpZWxkcyIsInR5cGVJbml0w7gxIiwiZmllbGQiLCJtZXRob2RJbml0w7gxIiwibWFrZU1ldGhvZMO4MSIsInByb3RvY29sIiwiZmllbGROYW1lw7gxIiwidHlwZSIsIm1ldGhvZHPDuDEiLCJleHBhbmRFeHRlbmRUeXBlIiwiaXNEZWZhdWx0VHlwZcO4MSIsImlzTmlsVHlwZcO4MSIsInR5cGVOYW1lw7gxIiwidGFyZ2V0w7gxIiwiZXhwYW5kRXh0ZW5kUHJvdG9jb2wiLCJzcGVjc8O4MSIsInNwZWNzIiwiYXNldEV4cGFuZCIsInZhbHVlIiwic3ViRmllbGQiLCJzdWJGaWVsZHNBbmRWYWx1ZSIsInJlc29sdmVkVGFyZ2V0w7gxIiwiYWxlbmd0aEV4cGFuZCIsImFycmF5Il0sIm1hcHBp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LE9BQUEsQ0FBQWlOLGFBQUEsR0FBTixTQUFNQSxhQUFOLENBRUdDLEtBRkgsRUFHRTtBQUFBLGUsVUFBQSxDLE1BQUEsRSxPQUFFLEMsTUFBQSxFLFVBQUEsQyxVQUFVQSxLLEVBQVo7QUFBQSxLQUhGLEM7QUFJQ3JOLFlBQUQsQyxTQUFBLEVBQXlCb04sYUFBekIiLCJzb3VyY2VzQ29udGVudCI6WyIobnMgd2lzcC5iYWNrZW5kLmVzY29kZWdlbi53cml0ZXJcbiAgKDpyZXF1aXJlIFt3aXNwLnJlYWRlciA6cmVmZXIgW3JlYWQtZnJvbS1zdHJpbmddXVxuICAgICAgICAgICAgW3dpc3AuYXN0IDpyZWZlciBbbWV0YSB3aXRoLW1ldGEgc3ltYm9sPyBzeW1ib2wga2V5d29yZD8ga2V5d29yZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZXNwYWNlIHVucXVvdGU/IHVucXVvdGUtc3BsaWNpbmc/IHF1b3RlP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3ludGF4LXF1b3RlPyBuYW1lIGdlbnN5bSBwci1zdHJdXVxuICAgICAgICAgICAgW3dpc3Auc2VxdWVuY2UgOnJlZmVyIFtlbXB0eT8gY291bnQgbGlzdD8gbGlzdCBmaXJzdCBzZWNvbmQgdGhpcmRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdCBjb25zIGNvbmogYnV0bGFzdCByZXZlcnNlIHJlZHVjZSB2ZWNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdCBtYXAgbWFwdiBmaWx0ZXIgdGFrZSBjb25jYXQgcGFydGl0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcGVhdCBpbnRlcmxlYXZlIGFzc29jXV1cbiAgICAgICAgICAgIFt3aXNwLnJ1bnRpbWUgOnJlZmVyIFtvZGQ/IGRpY3Rpb25hcnk/IGRpY3Rpb25hcnkgbWVyZ2Uga2V5cyB2YWxzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGFpbnMtdmVjdG9yPyBtYXAtZGljdGlvbmFyeSBzdHJpbmc/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVtYmVyPyB2ZWN0b3I/IGJvb2xlYW4/IHN1YnMgcmUtZmluZCB0cnVlP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhbHNlPyBuaWw/IHJlLXBhdHRlcm4/IGluYyBkZWMgc3RyIGNoYXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnQgPSA9PSBnZXRdXVxuICAgICAgICAgICAgW3dpc3Auc3RyaW5nIDpyZWZlciBbc3BsaXQgam9pbiB1cHBlci1jYXNlIHJlcGxhY2UgdHJpbWxdXVxuICAgICAgICAgICAgW3dpc3AuZXhwYW5kZXIgOnJlZmVyIFtpbnN0YWxsLW1hY3JvIV1dXG4gICAgICAgICAgICBbZXNjb2RlZ2VuIDpyZWZlciBbZ2VuZXJhdGVdXSkpXG5cblxuOzsgRGVmaW5lIGNoYXJhY3RlciB0aGF0IGlzIHZhbGlkIEpTIGlkZW50aWZpZXIgdGhhdCB3aWxsXG47OyBiZSB1c2VkIGluIGdlbmVyYXRlZCBzeW1ib2xzIHRvIGF2b2lkIGNvbmZsaWN0c1xuOzsgaHR0cDovL3d3dy5maWxlZm9ybWF0LmluZm8vaW5mby91bmljb2RlL2NoYXIvZjgvaW5kZXguaHRtXG4oZGVmICoqdW5pcXVlLWNoYXIqKiBcIlxcdTAwRjhcIilcblxuKGRlZm4gLT5jYW1lbC1qb2luXG4gIFwiVGFrZXMgZGFzaCBkZWxpbWl0ZWQgbmFtZSBcIlxuICBbcHJlZml4IGtleV1cbiAgKHN0ciBwcmVmaXhcbiAgICAgICAoaWYgKGFuZCAobm90IChlbXB0eT8gcHJlZml4KSlcbiAgICAgICAgICAgICAgICAobm90IChlbXB0eT8ga2V5KSkpXG4gICAgICAgICAoc3RyICh1cHBlci1jYXNlIChnZXQga2V5IDApKSAoc3VicyBrZXkgMSkpXG4gICAgICAgICBrZXkpKSlcblxuKGRlZm4gLT5wcml2YXRlLXByZWZpeFxuICBcIlRyYW5zbGF0ZSBwcml2YXRlIGlkZW50aWZpZXJzIGxpa2UgLWZvbyB0byBhIEpTIGVxdWl2YWxlbnRcbiAgZm9ybXMgbGlrZSBfZm9vXCJcbiAgW2lkXVxuICAobGV0IFtzcGFjZS1kZWxpbWl0ZWQgKGpvaW4gXCIgXCIgKHNwbGl0IGlkICNcIi1cIikpXG4gICAgICAgIGxlZnQtdHJpbW1lZCAodHJpbWwgc3BhY2UtZGVsaW1pdGVkKVxuICAgICAgICBuICgtIChjb3VudCBpZCkgKGNvdW50IGxlZnQtdHJpbW1lZCkpXVxuICAgIChpZiAoPiBuIDApXG4gICAgICAoc3RyIChqb2luIFwiX1wiIChyZXBlYXQgKGluYyBuKSBcIlwiKSkgKHN1YnMgaWQgbikpXG4gICAgICBpZCkpKVxuXG5cbihkZWZuIHRyYW5zbGF0ZS1pZGVudGlmaWVyLXdvcmRcbiAgXCJUcmFuc2xhdGVzIHJlZmVyZW5jZXMgZnJvbSBjbG9qdXJlIGNvbnZlbnRpb24gdG8gSlM6XG5cbiAgKiptYWNyb3MqKiAgICAgIF9fbWFjcm9zX19cbiAgbGlzdC0+dmVjdG9yICAgIGxpc3RUb1ZlY3RvclxuICBzZXQhICAgICAgICAgICAgc2V0XG4gIGZvb19iYXIgICAgICAgICBmb29fYmFyXG4gIG51bWJlcj8gICAgICAgICBpc051bWJlclxuICByZWQ9ICAgICAgICAgICAgcmVkRXF1YWxcbiAgY3JlYXRlLXNlcnZlciAgIGNyZWF0ZVNlcnZlclwiXG4gIFtmb3JtXVxuICAoZGVmIF46cHJpdmF0ZSBpZCAobmFtZSBmb3JtKSlcbiAgKHNldCEgaWQgKGNvbmQgKGlkZW50aWNhbD8gaWQgIFwiKlwiKSBcIm11bHRpcGx5XCJcbiAgICAgICAgICAgICAgICAgKGlkZW50aWNhbD8gaWQgXCIvXCIpIFwiZGl2aWRlXCJcbiAgICAgICAgICAgICAgICAgKGlkZW50aWNhbD8gaWQgXCIrXCIpIFwic3VtXCJcbiAgICAgICAgICAgICAgICAgKGlkZW50aWNhbD8gaWQgXCItXCIpIFwic3VidHJhY3RcIlxuICAgICAgICAgICAgICAgICAoaWRlbnRpY2FsPyBpZCBcIj1cIikgXCJlcXVhbD9cIlxuICAgICAgICAgICAgICAgICAoaWRlbnRpY2FsPyBpZCBcIj09XCIpIFwic3RyaWN0LWVxdWFsP1wiXG4gICAgICAgICAgICAgICAgIChpZGVudGljYWw/IGlkIFwiPD1cIikgXCJub3QtZ3JlYXRlci10aGFuXCJcbiAgICAgICAgICAgICAgICAgKGlkZW50aWNhbD8gaWQgXCI+PVwiKSBcIm5vdC1sZXNzLXRoYW5cIlxuICAgICAgICAgICAgICAgICAoaWRlbnRpY2FsPyBpZCBcIj5cIikgXCJncmVhdGVyLXRoYW5cIlxuICAgICAgICAgICAgICAgICAoaWRlbnRpY2FsPyBpZCBcIjxcIikgXCJsZXNzLXRoYW5cIlxuICAgICAgICAgICAgICAgICAoaWRlbnRpY2FsPyBpZCBcIi0+XCIpIFwidGhyZWFkLWZpcnN0XCJcbiAgICAgICAgICAgICAgICAgOmVsc2UgaWQpKVxuXG4gIDs7ICoqbWFjcm9zKiogLT4gIF9fbWFjcm9zX19cbiAgKHNldCEgaWQgKGpvaW4gXCJfXCIgKHNwbGl0IGlkIFwiKlwiKSkpXG4gIDs7IGZvby5iYXIgLT4gZm9vX2JhclxuICAoc2V0ISBpZCAoam9pbiBcIl9cIiAoc3BsaXQgaWQgXCIuXCIpKSlcbiAgOzsgbGlzdC0+dmVjdG9yIC0+ICBsaXN0VG9WZWN0b3JcbiAgKHNldCEgaWQgKGlmIChpZGVudGljYWw/IChzdWJzIGlkIDAgMikgXCItPlwiKVxuICAgICAgICAgICAgIChzdWJzIChqb2luIFwiLXRvLVwiIChzcGxpdCBpZCBcIi0+XCIpKSAxKVxuICAgICAgICAgICAgIChqb2luIFwiLXRvLVwiIChzcGxpdCBpZCBcIi0+XCIpKSkpXG4gIDs7IHNldCEgLT4gIHNldFxuICAoc2V0ISBpZCAoam9pbiAoc3BsaXQgaWQgXCIhXCIpKSlcbiAgKHNldCEgaWQgKGpvaW4gXCIkXCIgKHNwbGl0IGlkIFwiJVwiKSkpXG4gIChzZXQhIGlkIChqb2luIFwiLWVxdWFsLVwiIChzcGxpdCBpZCBcIj1cIikpKVxuICA7OyBmb289IC0+IGZvb0VxdWFsXG4gIDsoc2V0ISBpZCAoam9pbiBcIi1lcXVhbC1cIiAoc3BsaXQgaWQgXCI9XCIpKVxuICA7OyBmb28rYmFyIC0+IGZvb1BsdXNCYXJcbiAgKHNldCEgaWQgKGpvaW4gXCItcGx1cy1cIiAoc3BsaXQgaWQgXCIrXCIpKSlcbiAgKHNldCEgaWQgKGpvaW4gXCItYW5kLVwiIChzcGxpdCBpZCBcIiZcIikpKVxuICA7OyBudW1iZXI/IC0+IGlzTnVtYmVyXG4gIChzZXQhIGlkIChpZiAoaWRlbnRpY2FsPyAobGFzdCBpZCkgXCI/XCIpXG4gICAgICAgICAgICAgKHN0ciBcImlzLVwiIChzdWJzIGlkIDAgKGRlYyAoY291bnQgaWQpKSkpXG4gICAgICAgICAgICAgaWQpKVxuICA7OyAtZm9vIC0+IF9mb29cbiAgKHNldCEgaWQgKC0+cHJpdmF0ZS1wcmVmaXggaWQpKVxuICA7OyBjcmVhdGUtc2VydmVyIC0+IGNyZWF0ZVNlcnZlclxuICAoc2V0ISBpZCAocmVkdWNlIC0+Y2FtZWwtam9pbiBcIlwiIChzcGxpdCBpZCBcIi1cIikpKVxuXG4gIDs7IHJlc2lkdWFsIHN3ZWVwOiB0aGUgc3VnYXIgYWJvdmUgb25seSByZXdyaXRlcyBgP2AvYD5gL2A8YC9gL2AgaW4gc3BlY2lmaWNcbiAgOzsgcG9zaXRpb25zIChhIHRyYWlsaW5nIGA/YCwgb3IgdGhlIGNoYXIgc3RhbmRpbmcgYWxvbmUpLiBBbnl0aGluZyBsZWZ0IG92ZXJcbiAgOzsgLS0gYHg/eWAsIGA/Zm9vYCwgYGE+YmAgLS0gaXMgc3RpbGwgYW4gaW52YWxpZCBKUyBpZGVudGlmaWVyLCBzbyBtYXAgZWFjaFxuICA7OyBzdXJ2aXZpbmcgY2hhcmFjdGVyIHRvIGEgQ2xvanVyZVNjcmlwdC1zdHlsZSBtdW5nZSBmcmFnbWVudC5cbiAgKHNldCEgaWQgKGpvaW4gXCJfUU1BUktfXCIgKHNwbGl0IGlkIFwiP1wiKSkpXG4gIChzZXQhIGlkIChqb2luIFwiX0dUX1wiIChzcGxpdCBpZCBcIj5cIikpKVxuICAoc2V0ISBpZCAoam9pbiBcIl9MVF9cIiAoc3BsaXQgaWQgXCI8XCIpKSlcbiAgKHNldCEgaWQgKGpvaW4gXCJfU0xBU0hfXCIgKHNwbGl0IGlkIFwiL1wiKSkpXG5cbiAgaWQpXG5cbihkZWZuIHRyYW5zbGF0ZS1pZGVudGlmaWVyXG4gIFtmb3JtXVxuICAobGV0IFtucyAobmFtZXNwYWNlIGZvcm0pXVxuICAgIChzdHIgKGlmIChhbmQgbnMgKG5vdCAoPSBucyBcImpzXCIpKSlcbiAgICAgICAgICAgKHN0ciAodHJhbnNsYXRlLWlkZW50aWZpZXItd29yZCAobmFtZXNwYWNlIGZvcm0pKSBcIi5cIilcbiAgICAgICAgICAgXCJcIilcbiAgICAgICAgIChqb2luIFxcLiAobWFwIHRyYW5zbGF0ZS1pZGVudGlmaWVyLXdvcmQgKHNwbGl0IChuYW1lIGZvcm0pIFxcLikpKSkpKVxuXG4oZGVmbiBlcnJvci1hcmctY291bnRcbiAgW2NhbGxlZSBuXVxuICAodGhyb3cgKFN5bnRheEVycm9yIChzdHIgXCJXcm9uZyBudW1iZXIgb2YgYXJndW1lbnRzIChcIiBuIFwiKSBwYXNzZWQgdG86IFwiIGNhbGxlZSkpKSlcblxuKGRlZm4gaW5oZXJpdC1sb2NhdGlvblxuICBbYm9keV1cbiAgKGxldCBbc3RhcnQgKDpzdGFydCAoOmxvYyAoZmlyc3QgYm9keSkpKVxuICAgICAgICBlbmQgKDplbmQgKDpsb2MgKGxhc3QgYm9keSkpKV1cbiAgICAoaWYgKG5vdCAob3IgKG5pbD8gc3RhcnQpIChuaWw/IGVuZCkpKVxuICAgICAgezpzdGFydCBzdGFydCA6ZW5kIGVuZH0pKSlcblxuXG4oZGVmbiB3cml0ZS1sb2NhdGlvblxuICBbZm9ybSBvcmlnaW5hbF1cbiAgKGxldCBbZGF0YSAobWV0YSBmb3JtKVxuICAgICAgICBpbmhlcml0ZWQgKG1ldGEgb3JpZ2luYWwpXG4gICAgICAgIHN0YXJ0IChvciAoOnN0YXJ0IGZvcm0pICg6c3RhcnQgZGF0YSkgKDpzdGFydCBpbmhlcml0ZWQpKVxuICAgICAgICBlbmQgKG9yICg6ZW5kIGZvcm0pICg6ZW5kIGRhdGEpICg6ZW5kIGluaGVyaXRlZCkpXVxuICAgIChpZiAobm90IChuaWw/IHN0YXJ0KSlcbiAgICAgIHs6bG9jIHs6c3RhcnQgezpsaW5lIChpbmMgKDpsaW5lIHN0YXJ0IC0xKSlcbiAgICAgICAgICAgICAgICAgICAgIDpjb2x1bW4gKDpjb2x1bW4gc3RhcnQgLTEpfVxuICAgICAgICAgICAgIDplbmQgezpsaW5lIChpbmMgKDpsaW5lIGVuZCAtMSkpXG4gICAgICAgICAgICAgICAgICAgOmNvbHVtbiAoOmNvbHVtbiBlbmQgLTEpfX19XG4gICAgICB7fSkpKVxuXG4oZGVmICoqd3JpdGVycyoqIHt9KVxuKGRlZm4gaW5zdGFsbC13cml0ZXIhXG4gIFtvcCB3cml0ZXJdXG4gIChzZXQhIChnZXQgKip3cml0ZXJzKiogb3ApIHdyaXRlcikpXG5cbihkZWZuIHdyaXRlLW9wXG4gIFtvcCBmb3JtXVxuICAobGV0IFt3cml0ZXIgKGdldCAqKndyaXRlcnMqKiBvcCldXG4gICAgKGFzc2VydCB3cml0ZXIgKHN0ciBcIlVuc3VwcG9ydGVkIG9wZXJhdGlvbjogXCIgb3ApKVxuICAgIChjb25qICh3cml0ZS1sb2NhdGlvbiAoOmZvcm0gZm9ybSkgKDpvcmlnaW5hbC1mb3JtIGZvcm0pKVxuICAgICAgICAgICh3cml0ZXIgZm9ybSkpKSlcblxuKGRlZiAqKnNwZWNpYWxzKioge30pXG4oZGVmbiBpbnN0YWxsLXNwZWNpYWwhXG4gIFtvcCB3cml0ZXJdXG4gIChzZXQhIChnZXQgKipzcGVjaWFscyoqIChuYW1lIG9wKSkgd3JpdGVyKSlcblxuKGRlZm4gd3JpdGUtc3BlY2lhbFxuICBbd3JpdGVyIGZvcm1dXG4gIChjb25qICh3cml0ZS1sb2NhdGlvbiAoOmZvcm0gZm9ybSkgKDpvcmlnaW5hbC1mb3JtIGZvcm0pKVxuICAgICAgICAoYXBwbHkgd3JpdGVyICg6cGFyYW1zIGZvcm0pKSkpXG5cblxuKGRlZm4gd3JpdGUtbmlsXG4gIFtmb3JtXVxuICB7OnR5cGUgOlVuYXJ5RXhwcmVzc2lvblxuICAgOm9wZXJhdG9yIDp2b2lkXG4gICA6YXJndW1lbnQgezp0eXBlIDpMaXRlcmFsXG4gICAgICAgICAgICAgIDp2YWx1ZSAwfVxuICAgOnByZWZpeCB0cnVlfSlcbihpbnN0YWxsLXdyaXRlciEgOm5pbCB3cml0ZS1uaWwpXG5cbihkZWZuIHdyaXRlLWxpdGVyYWxcbiAgW2Zvcm1dXG4gIHs6dHlwZSA6TGl0ZXJhbFxuICAgOnZhbHVlIGZvcm19KVxuXG4oZGVmbiB3cml0ZS1saXN0XG4gIFtmb3JtXVxuICB7OnR5cGUgOkNhbGxFeHByZXNzaW9uXG4gICA6Y2FsbGVlICh3cml0ZSB7Om9wIDp2YXJcbiAgICAgICAgICAgICAgICAgICA6Zm9ybSAnbGlzdH0pXG4gICA6YXJndW1lbnRzIChtYXAgd3JpdGUgKDppdGVtcyBmb3JtKSl9KVxuKGluc3RhbGwtd3JpdGVyISA6bGlzdCB3cml0ZS1saXN0KVxuXG4oZGVmbiB3cml0ZS1zeW1ib2xcbiAgW2Zvcm1dXG4gIHs6dHlwZSA6Q2FsbEV4cHJlc3Npb25cbiAgIDpjYWxsZWUgKHdyaXRlIHs6b3AgOnZhclxuICAgICAgICAgICAgICAgICAgIDpmb3JtICdzeW1ib2x9KVxuICAgOmFyZ3VtZW50cyBbKHdyaXRlLWNvbnN0YW50ICg6bmFtZXNwYWNlIGZvcm0pKVxuICAgICAgICAgICAgICAgKHdyaXRlLWNvbnN0YW50ICg6bmFtZSBmb3JtKSldfSlcbihpbnN0YWxsLXdyaXRlciEgOnN5bWJvbCB3cml0ZS1zeW1ib2wpXG5cbihkZWZuIHdyaXRlLWNvbnN0YW50XG4gIFtmb3JtXVxuICAoY29uZCAobmlsPyBmb3JtKSAod3JpdGUtbmlsIGZvcm0pXG4gICAgICAgIChrZXl3b3JkPyBmb3JtKSAod3JpdGUtbGl0ZXJhbCAoaWYgKG5hbWVzcGFjZSBmb3JtKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoc3RyIChuYW1lc3BhY2UgZm9ybSkgXCIvXCIgKG5hbWUgZm9ybSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChuYW1lIGZvcm0pKSlcbiAgICAgICAgKG51bWJlcj8gZm9ybSkgKHdyaXRlLW51bWJlciAoLnZhbHVlT2YgZm9ybSkpXG4gICAgICAgIChzdHJpbmc/IGZvcm0pICh3cml0ZS1zdHJpbmcgZm9ybSlcbiAgICAgICAgOmVsc2UgKHdyaXRlLWxpdGVyYWwgZm9ybSkpKVxuKGluc3RhbGwtd3JpdGVyISA6Y29uc3RhbnQgIyh3cml0ZS1jb25zdGFudCAoOmZvcm0gJSkpKVxuXG4oZGVmbiB3cml0ZS1zdHJpbmdcbiAgW2Zvcm1dXG4gIHs6dHlwZSA6TGl0ZXJhbFxuICAgOnZhbHVlIChzdHIgZm9ybSl9KVxuXG4oZGVmbiB3cml0ZS1udW1iZXJcbiAgW2Zvcm1dXG4gIChpZiAoPCBmb3JtIDApXG4gICAgezp0eXBlIDpVbmFyeUV4cHJlc3Npb25cbiAgICAgOm9wZXJhdG9yIDotXG4gICAgIDpwcmVmaXggdHJ1ZVxuICAgICA6YXJndW1lbnQgKHdyaXRlLW51bWJlciAoKiBmb3JtIC0xKSl9XG4gICAgKHdyaXRlLWxpdGVyYWwgZm9ybSkpKVxuXG4oZGVmbiB3cml0ZS1rZXl3b3JkXG4gIFtmb3JtXVxuICB7OnR5cGUgOkxpdGVyYWxcbiAgIDp2YWx1ZSAoOmZvcm0gZm9ybSl9KVxuKGluc3RhbGwtd3JpdGVyISA6a2V5d29yZCB3cml0ZS1rZXl3b3JkKVxuXG4oZGVmbiAtPmlkZW50aWZpZXJcbiAgW2Zvcm1dXG4gIHs6dHlwZSA6SWRlbnRpZmllclxuICAgOm5hbWUgKHRyYW5zbGF0ZS1pZGVudGlmaWVyIGZvcm0pfSlcblxuKGRlZm4gd3JpdGUtYmluZGluZy12YXJcbiAgW2Zvcm1dXG4gIDs7IElmIGlkZW50aWZpZXJzIGJpbmRpbmcgc2hhZG93cyBvdGhlciBiaW5kaW5nIHJlbmFtZSBpdCBhY2NvcmRpbmdcbiAgOzsgdG8gc2hhZG93aW5nIGRlcHRoLiBUaGlzIGFsbG93cyBiaW5kaW5ncyBpbml0aWFsaXplciBzYWZlbHlcbiAgOzsgYWNjZXNzIGJpbmRpbmcgYmVmb3JlIHNoYWRvd2luZyBpdC5cbiAgKGxldCBbYmFzZS1pZCAoOmlkIGZvcm0pXG4gICAgICAgIHJlc29sdmVkLWlkIChpZiAoOnNoYWRvdyBmb3JtKVxuICAgICAgICAgICAgICAgICAgICAgIChzeW1ib2wgbmlsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoc3RyICh0cmFuc2xhdGUtaWRlbnRpZmllciBiYXNlLWlkKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqKnVuaXF1ZS1jaGFyKipcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKDpkZXB0aCBmb3JtKSkpXG4gICAgICAgICAgICAgYmFzZS1pZCldXG4gICAgKGNvbmogKC0+aWRlbnRpZmllciByZXNvbHZlZC1pZClcbiAgICAgICAgICAod3JpdGUtbG9jYXRpb24gYmFzZS1pZCkpKSlcblxuKGRlZm4gd3JpdGUtdmFyXG4gIFwiaGFuZGxlciBmb3IgezpvcCA6dmFyfSB0eXBlIGZvcm1zLiBTdWNoIGZvcm1zIG1heVxuICByZXByZXNlbnQgcmVmZXJlbmNlcyBpbiB3aGljaCBjYXNlIHRoZXkgaGF2ZSA6aW5mb1xuICBwb2ludGluZyB0byBhIGRlY2xhcmF0aW9uIDp2YXIgd2hpY2ggd2F5IGJlIGVpdGhlclxuICBmdW5jdGlvbiBwYXJhbWV0ZXIgKGhhcyA6cGFyYW0gdHJ1ZSkgb3IgbG9jYWxcbiAgYmluZGluZyBkZWNsYXJhdGlvbiAoaGFzIDpiaW5kaW5nIHRydWUpIGxpa2Ugb25lcyBkZWZpbmVkXG4gIGJ5IGxldCBhbmQgbG9vcCBmb3JtcyBpbiBsYXRlciBjYXNlIGZvcm0gd2lsbCBhbHNvIGhhdmVcbiAgOnNoYWRvdyBwb2ludGluZyB0byBhIGRlY2xhcmF0aW9uIG5vZGUgaXQgc2hhZG93cyBhbmRcbiAgOmRlcHRoIHByb3BlcnR5IHdpdGggYSBkZXB0aCBvZiBzaGFkb3dpbmcsIHRoYXQgaXMgdXNlZFxuICB0byBmb3IgcmVuYW1pbmcgbG9naWMgdG8gYXZvaWQgbmFtZSBjb2xsaXNpb25zIGluIGZvcm1zXG4gIGxpa2UgbGV0IHRoYXQgYWxsb3cgc2FtZSBuYW1lZCBiaW5kaW5ncy5cIlxuICBbbm9kZV1cbiAgKGlmICg9IDpiaW5kaW5nICg6dHlwZSAoOmJpbmRpbmcgbm9kZSkpKVxuICAgIChjb25qICh3cml0ZS1iaW5kaW5nLXZhciAoOmJpbmRpbmcgbm9kZSkpXG4gICAgICAgICAgKHdyaXRlLWxvY2F0aW9uICg6Zm9ybSBub2RlKSkpXG4gICAgKGNvbmogKHdyaXRlLWxvY2F0aW9uICg6Zm9ybSBub2RlKSlcbiAgICAgICAgICAoLT5pZGVudGlmaWVyICg6Zm9ybSBub2RlKSkpKSlcbihpbnN0YWxsLXdyaXRlciEgOnZhciB3cml0ZS12YXIpXG4oaW5zdGFsbC13cml0ZXIhIDpwYXJhbSB3cml0ZS12YXIpXG5cbihkZWZuIHdyaXRlLWludm9rZVxuICBbZm9ybV1cbiAgezp0eXBlIDpDYWxsRXhwcmVzc2lvblxuICAgOmNhbGxlZSAod3JpdGUgKDpjYWxsZWUgZm9ybSkpXG4gICA6YXJndW1lbnRzIChtYXAgd3JpdGUgKDpwYXJhbXMgZm9ybSkpfSlcbihpbnN0YWxsLXdyaXRlciEgOmludm9rZSB3cml0ZS1pbnZva2UpXG5cbihkZWZuIHdyaXRlLXZlY3RvclxuICBbZm9ybV1cbiAgezp0eXBlIDpBcnJheUV4cHJlc3Npb25cbiAgIDplbGVtZW50cyAobWFwIHdyaXRlICg6aXRlbXMgZm9ybSkpfSlcbihpbnN0YWxsLXdyaXRlciEgOnZlY3RvciB3cml0ZS12ZWN0b3IpXG5cbihkZWZuIHdyaXRlLWRpY3Rpb25hcnlcbiAgW2Zvcm1dXG4gIChsZXQgW3Byb3BlcnRpZXMgKHBhcnRpdGlvbiAyIChpbnRlcmxlYXZlICg6a2V5cyBmb3JtKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoOnZhbHVlcyBmb3JtKSkpXVxuICAgIHs6dHlwZSA6T2JqZWN0RXhwcmVzc2lvblxuICAgICA6cHJvcGVydGllcyAobWFwIChmbiBbcGFpcl1cbiAgICAgICAgICAgICAgICAgICAgICAgIChsZXQgW2tleSAoZmlyc3QgcGFpcilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlIChzZWNvbmQgcGFpcildXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHs6a2luZCA6aW5pdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgOnR5cGUgOlByb3BlcnR5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICA6a2V5IChpZiAoPSA6c3ltYm9sICg6b3Aga2V5KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAod3JpdGUtY29uc3RhbnQgKHN0ciAoOmZvcm0ga2V5KSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHdyaXRlIGtleSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICA6dmFsdWUgKHdyaXRlIHZhbHVlKX0pKVxuICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXMpfSkpXG4oaW5zdGFsbC13cml0ZXIhIDpkaWN0aW9uYXJ5IHdyaXRlLWRpY3Rpb25hcnkpXG5cbihkZWZuIHdyaXRlLWV4cG9ydFxuICBbZm9ybV1cbiAgKHdyaXRlIHs6b3AgOnNldCFcbiAgICAgICAgICA6dGFyZ2V0IHs6b3AgOm1lbWJlci1leHByZXNzaW9uXG4gICAgICAgICAgICAgICAgICAgOmNvbXB1dGVkIGZhbHNlXG4gICAgICAgICAgICAgICAgICAgOnRhcmdldCB7Om9wIDp2YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Zm9ybSAod2l0aC1tZXRhICdleHBvcnRzIChtZXRhICg6Zm9ybSAoOmlkIGZvcm0pKSkpfVxuICAgICAgICAgICAgICAgICAgIDpwcm9wZXJ0eSAoOmlkIGZvcm0pXG4gICAgICAgICAgICAgICAgICAgOmZvcm0gKDpmb3JtICg6aWQgZm9ybSkpfVxuICAgICAgICAgIDp2YWx1ZSAoOmluaXQgZm9ybSlcbiAgICAgICAgICA6Zm9ybSAoOmZvcm0gKDppZCBmb3JtKSl9KSlcblxuKGRlZm4gd3JpdGUtZGVmXG4gIFtmb3JtXVxuICAoY29uaiB7OnR5cGUgOlZhcmlhYmxlRGVjbGFyYXRpb25cbiAgICAgICAgIDpraW5kIDp2YXJcbiAgICAgICAgIDpkZWNsYXJhdGlvbnMgWyhjb25qIHs6dHlwZSA6VmFyaWFibGVEZWNsYXJhdG9yXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmlkICh3cml0ZSAoOmlkIGZvcm0pKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDppbml0IChjb25qIChpZiAoOmV4cG9ydCBmb3JtKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHdyaXRlLWV4cG9ydCBmb3JtKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHdyaXRlICg6aW5pdCBmb3JtKSkpKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh3cml0ZS1sb2NhdGlvbiAoOmZvcm0gKDppZCBmb3JtKSkpKV19XG4gICAgICAgICh3cml0ZS1sb2NhdGlvbiAoOmZvcm0gZm9ybSkgKDpvcmlnaW5hbC1mb3JtIGZvcm0pKSkpXG4oaW5zdGFsbC13cml0ZXIhIDpkZWYgd3JpdGUtZGVmKVxuXG4oZGVmbiB3cml0ZS1iaW5kaW5nXG4gIFtmb3JtXVxuICAobGV0IFtpZCAod3JpdGUtYmluZGluZy12YXIgZm9ybSlcbiAgICAgICAgaW5pdCAod3JpdGUgKDppbml0IGZvcm0pKV1cbiAgICB7OnR5cGUgOlZhcmlhYmxlRGVjbGFyYXRpb25cbiAgICAgOmtpbmQgOnZhclxuICAgICA6bG9jIChpbmhlcml0LWxvY2F0aW9uIFtpZCBpbml0XSlcbiAgICAgOmRlY2xhcmF0aW9ucyBbezp0eXBlIDpWYXJpYWJsZURlY2xhcmF0b3JcbiAgICAgICAgICAgICAgICAgICAgIDppZCBpZFxuICAgICAgICAgICAgICAgICAgICAgOmluaXQgaW5pdH1dfSkpXG4oaW5zdGFsbC13cml0ZXIhIDpiaW5kaW5nIHdyaXRlLWJpbmRpbmcpXG5cbihkZWZuIHdyaXRlLXRocm93XG4gIFtmb3JtXVxuICAoLT5leHByZXNzaW9uIChjb25qIHs6dHlwZSA6VGhyb3dTdGF0ZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgICAgOmFyZ3VtZW50ICh3cml0ZSAoOnRocm93IGZvcm0pKX1cbiAgICAgICAgICAgICAgICAgICAgICAod3JpdGUtbG9jYXRpb24gKDpmb3JtIGZvcm0pICg6b3JpZ2luYWwtZm9ybSBmb3JtKSkpKSlcbihpbnN0YWxsLXdyaXRlciEgOnRocm93IHdyaXRlLXRocm93KVxuXG4oZGVmbiB3cml0ZS1uZXdcbiAgW2Zvcm1dXG4gIHs6dHlwZSA6TmV3RXhwcmVzc2lvblxuICAgOmNhbGxlZSAod3JpdGUgKDpjb25zdHJ1Y3RvciBmb3JtKSlcbiAgIDphcmd1bWVudHMgKG1hcCB3cml0ZSAoOnBhcmFtcyBmb3JtKSl9KVxuKGluc3RhbGwtd3JpdGVyISA6bmV3IHdyaXRlLW5ldylcblxuKGRlZm4gd3JpdGUtc2V0IVxuICBbZm9ybV1cbiAgezp0eXBlIDpBc3NpZ25tZW50RXhwcmVzc2lvblxuICAgOm9wZXJhdG9yIDo9XG4gICA6bGVmdCAod3JpdGUgKDp0YXJnZXQgZm9ybSkpXG4gICA6cmlnaHQgKHdyaXRlICg6dmFsdWUgZm9ybSkpfSlcbihpbnN0YWxsLXdyaXRlciEgOnNldCEgd3JpdGUtc2V0ISlcblxuKGRlZm4gd3JpdGUtYWdldFxuICBbZm9ybV1cbiAgezp0eXBlIDpNZW1iZXJFeHByZXNzaW9uXG4gICA6Y29tcHV0ZWQgKDpjb21wdXRlZCBmb3JtKVxuICAgOm9iamVjdCAod3JpdGUgKDp0YXJnZXQgZm9ybSkpXG4gICA6cHJvcGVydHkgKHdyaXRlICg6cHJvcGVydHkgZm9ybSkpfSlcbihpbnN0YWxsLXdyaXRlciEgOm1lbWJlci1leHByZXNzaW9uIHdyaXRlLWFnZXQpXG5cbjs7IE1hcCBvZiBzdGF0ZW1lbnQgQVNUIG5vZGUgdGhhdCBhcmUgZ2VuZXJhdGVkXG47OyBieSBhIHdyaXRlci4gVXNlZCB0byBkZWNldCB3ZWF0aGVyIG5vZGUgaXNcbjs7IHN0YXRlbWVudCBvciBleHByZXNzaW9uLlxuKGRlZiAqKnN0YXRlbWVudHMqKiB7OkVtcHR5U3RhdGVtZW50IHRydWUgOkJsb2NrU3RhdGVtZW50IHRydWVcbiAgICAgICAgICAgICAgICAgICAgIDpFeHByZXNzaW9uU3RhdGVtZW50IHRydWUgOklmU3RhdGVtZW50IHRydWVcbiAgICAgICAgICAgICAgICAgICAgIDpMYWJlbGVkU3RhdGVtZW50IHRydWUgOkJyZWFrU3RhdGVtZW50IHRydWVcbiAgICAgICAgICAgICAgICAgICAgIDpDb250aW51ZVN0YXRlbWVudCB0cnVlIDpTd2l0Y2hTdGF0ZW1lbnQgdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgOlJldHVyblN0YXRlbWVudCB0cnVlIDpUaHJvd1N0YXRlbWVudCB0cnVlXG4gICAgICAgICAgICAgICAgICAgICA6VHJ5U3RhdGVtZW50IHRydWUgOldoaWxlU3RhdGVtZW50IHRydWVcbiAgICAgICAgICAgICAgICAgICAgIDpEb1doaWxlU3RhdGVtZW50IHRydWUgOkZvclN0YXRlbWVudCB0cnVlXG4gICAgICAgICAgICAgICAgICAgICA6Rm9ySW5TdGF0ZW1lbnQgdHJ1ZSA6Rm9yT2ZTdGF0ZW1lbnQgdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgOkxldFN0YXRlbWVudCB0cnVlIDpWYXJpYWJsZURlY2xhcmF0aW9uIHRydWVcbiAgICAgICAgICAgICAgICAgICAgIDpGdW5jdGlvbkRlY2xhcmF0aW9uIHRydWV9KVxuXG4oZGVmbiB3cml0ZS1zdGF0ZW1lbnRcbiAgXCJXcmFwcyBleHByZXNzaW9uIHRoYXQgY2FuJ3QgYmUgaW4gYSBibG9jayBzdGF0ZW1lbnRcbiAgYm9keSBpbnRvIDpFeHByZXNzaW9uU3RhdGVtZW50IG90aGVyd2lzZSByZXR1cm5zIGJhY2tcbiAgZXhwcmVzc2lvbi5cIlxuICBbZm9ybV1cbiAgKC0+c3RhdGVtZW50ICh3cml0ZSBmb3JtKSkpXG5cbihkZWZuIC0+c3RhdGVtZW50XG4gIFtub2RlXVxuICAoaWYgKGdldCAqKnN0YXRlbWVudHMqKiAoOnR5cGUgbm9kZSkpXG4gICAgbm9kZVxuICAgIHs6dHlwZSA6RXhwcmVzc2lvblN0YXRlbWVudFxuICAgICA6ZXhwcmVzc2lvbiBub2RlXG4gICAgIDpsb2MgKDpsb2Mgbm9kZSlcbiAgICAgfSkpXG5cbihkZWZuIC0+cmV0dXJuXG4gIFtmb3JtXVxuICAoY29uaiB7OnR5cGUgOlJldHVyblN0YXRlbWVudFxuICAgICAgICAgOmFyZ3VtZW50ICh3cml0ZSBmb3JtKX1cbiAgICAgICAgKHdyaXRlLWxvY2F0aW9uICg6Zm9ybSBmb3JtKSAoOm9yaWdpbmFsLWZvcm0gZm9ybSkpKSlcblxuKGRlZm4gd3JpdGUtYm9keVxuICBcIlRha2VzIGZvcm0gdGhhdCBtYXkgY29udGFpbiBgOnN0YXRlbWVudHNgIHZlY3RvclxuICBvciBgOnJlc3VsdGAgZm9ybSAgYW5kIHJldHVybnMgdmVjdG9yIGV4cHJlc3Npb25cbiAgbm9kZXMgdGhhdCBjYW4gYmUgdXNlZCBpbiBhbnkgYmxvY2suIElmIGA6cmVzdWx0YFxuICBpcyBwcmVzZW50IGl0IHdpbGwgYmUgYSBsYXN0IGluIHZlY3RvciBhbmQgb2YgYVxuICBgOlJldHVyblN0YXRlbWVudGAgdHlwZS5cbiAgRXhhbXBsZXM6XG5cblxuICAod3JpdGUtYm9keSB7OnN0YXRlbWVudHMgbmlsXG4gICAgICAgICAgICAgICA6cmVzdWx0IHs6b3AgOmNvbnN0YW50XG4gICAgICAgICAgICAgICAgICAgICAgICA6dHlwZSA6bnVtYmVyXG4gICAgICAgICAgICAgICAgICAgICAgICA6Zm9ybSAzfX0pXG4gIDs7ID0+XG4gIFt7OnR5cGUgOlJldHVyblN0YXRlbWVudFxuICAgIDphcmd1bWVudCB7OnR5cGUgOkxpdGVyYWwgOnZhbHVlIDN9fV1cblxuICAod3JpdGUtYm9keSB7OnN0YXRlbWVudHMgW3s6b3AgOnNldCFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnRhcmdldCB7Om9wIDp2YXIgOmZvcm0gJ3h9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIDp2YWx1ZSB7Om9wIDp2YXIgOmZvcm0gJ3l9fV1cbiAgICAgICAgICAgICAgIDpyZXN1bHQgezpvcCA6dmFyIDpmb3JtICd4fX0pXG4gIDs7ID0+XG4gIFt7OnR5cGUgOkV4cHJlc3Npb25TdGF0ZW1lbnRcbiAgICA6ZXhwcmVzc2lvbiB7OnR5cGUgOkFzc2lnbm1lbnRFeHByZXNzaW9uXG4gICAgICAgICAgICAgICAgIDpvcGVyYXRvciA6PVxuICAgICAgICAgICAgICAgICA6bGVmdCB7OnR5cGUgOklkZW50aWZpZXIgOm5hbWUgOnh9XG4gICAgICAgICAgICAgICAgIDpyaWdodCB7OnR5cGUgOklkZW50aWZpZXIgOm5hbWUgOnl9fX1cbiAgIHs6dHlwZSA6UmV0dXJuU3RhdGVtZW50XG4gICAgOmFyZ3VtZW50IHs6dHlwZSA6SWRlbnRpZmllciA6bmFtZSA6eH19XVwiXG4gIFtmb3JtXVxuICAobGV0IFtzdGF0ZW1lbnRzIChtYXAgd3JpdGUtc3RhdGVtZW50XG4gICAgICAgICAgICAgICAgICAgICAgICAob3IgKDpzdGF0ZW1lbnRzIGZvcm0pIFtdKSlcbiAgICAgICAgcmVzdWx0IChpZiAoOnJlc3VsdCBmb3JtKVxuICAgICAgICAgICAgICAgICAoLT5yZXR1cm4gKDpyZXN1bHQgZm9ybSkpKV1cblxuICAgIChpZiByZXN1bHRcbiAgICAgIChjb25qIHN0YXRlbWVudHMgcmVzdWx0KVxuICAgICAgc3RhdGVtZW50cykpKVxuXG4oZGVmbiAtPmJsb2NrXG4gIFtib2R5XVxuICAoaWYgKHZlY3Rvcj8gYm9keSlcbiAgICB7OnR5cGUgOkJsb2NrU3RhdGVtZW50XG4gICAgIDpib2R5IGJvZHlcbiAgICAgOmxvYyAoaW5oZXJpdC1sb2NhdGlvbiBib2R5KX1cbiAgICB7OnR5cGUgOkJsb2NrU3RhdGVtZW50XG4gICAgIDpib2R5IFtib2R5XVxuICAgICA6bG9jICg6bG9jIGJvZHkpfSkpXG5cbihkZWZuIC0+ZXhwcmVzc2lvblxuICBbJiBib2R5XVxuICB7OnR5cGUgOkNhbGxFeHByZXNzaW9uXG4gICA6YXJndW1lbnRzIFtdXG4gICA6bG9jIChpbmhlcml0LWxvY2F0aW9uIGJvZHkpXG4gICA6Y2FsbGVlICgtPnNlcXVlbmNlIFt7OnR5cGUgOkZ1bmN0aW9uRXhwcmVzc2lvblxuICAgICAgICAgICAgICAgICAgICAgICAgIDppZCBuaWxcbiAgICAgICAgICAgICAgICAgICAgICAgICA6cGFyYW1zIFtdXG4gICAgICAgICAgICAgICAgICAgICAgICAgOmRlZmF1bHRzIFtdXG4gICAgICAgICAgICAgICAgICAgICAgICAgOmV4cHJlc3Npb24gZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICA6Z2VuZXJhdG9yIGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgOnJlc3QgbmlsXG4gICAgICAgICAgICAgICAgICAgICAgICAgOmJvZHkgKC0+YmxvY2sgYm9keSl9XSl9KVxuXG4oZGVmbiB3cml0ZS1kb1xuICBbZm9ybV1cbiAgKGlmICg6YmxvY2sgKG1ldGEgKGZpcnN0ICg6Zm9ybSBmb3JtKSkpKVxuICAgICgtPmJsb2NrICh3cml0ZS1ib2R5IChjb25qIGZvcm0gezpyZXN1bHQgbmlsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnN0YXRlbWVudHMgKGNvbmogKDpzdGF0ZW1lbnRzIGZvcm0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKDpyZXN1bHQgZm9ybSkpfSkpKVxuICAgIChhcHBseSAtPmV4cHJlc3Npb24gKHdyaXRlLWJvZHkgZm9ybSkpKSlcbihpbnN0YWxsLXdyaXRlciEgOmRvIHdyaXRlLWRvKVxuXG4oZGVmbiB3cml0ZS1pZlxuICBbZm9ybV1cbiAgezp0eXBlIDpDb25kaXRpb25hbEV4cHJlc3Npb25cbiAgIDp0ZXN0ICh3cml0ZSAoOnRlc3QgZm9ybSkpXG4gICA6Y29uc2VxdWVudCAod3JpdGUgKDpjb25zZXF1ZW50IGZvcm0pKVxuICAgOmFsdGVybmF0ZSAod3JpdGUgKDphbHRlcm5hdGUgZm9ybSkpfSlcbihpbnN0YWxsLXdyaXRlciEgOmlmIHdyaXRlLWlmKVxuXG4oZGVmbiB3cml0ZS10cnlcbiAgW2Zvcm1dXG4gIChsZXQgW2hhbmRsZXIgKDpoYW5kbGVyIGZvcm0pXG4gICAgICAgIGZpbmFsaXplciAoOmZpbmFsaXplciBmb3JtKV1cbiAgICAoLT5leHByZXNzaW9uIChjb25qIHs6dHlwZSA6VHJ5U3RhdGVtZW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgOmd1YXJkZWRIYW5kbGVycyBbXVxuICAgICAgICAgICAgICAgICAgICAgICAgIDpibG9jayAoLT5ibG9jayAod3JpdGUtYm9keSAoOmJvZHkgZm9ybSkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgIDpoYW5kbGVycyAoaWYgaGFuZGxlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFt7OnR5cGUgOkNhdGNoQ2xhdXNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6cGFyYW0gKHdyaXRlICg6bmFtZSBoYW5kbGVyKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpib2R5ICgtPmJsb2NrICh3cml0ZS1ib2R5IGhhbmRsZXIpKX1dXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW10pXG4gICAgICAgICAgICAgICAgICAgICAgICAgOmZpbmFsaXplciAoY29uZCBmaW5hbGl6ZXIgKC0+YmxvY2sgKHdyaXRlLWJvZHkgZmluYWxpemVyKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChub3QgaGFuZGxlcikgKC0+YmxvY2sgW10pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ZWxzZSBuaWwpfVxuICAgICAgICAgICAgICAgICAgICAgICAgKHdyaXRlLWxvY2F0aW9uICg6Zm9ybSBmb3JtKSAoOm9yaWdpbmFsLWZvcm0gZm9ybSkpKSkpKVxuKGluc3RhbGwtd3JpdGVyISA6dHJ5IHdyaXRlLXRyeSlcblxuKGRlZm4tIHdyaXRlLWJpbmRpbmctdmFsdWVcbiAgW2Zvcm1dXG4gICh3cml0ZSAoOmluaXQgZm9ybSkpKVxuXG4oZGVmbi0gd3JpdGUtYmluZGluZy1wYXJhbVxuICBbZm9ybV1cbiAgKHdyaXRlLXZhciB7OmZvcm0gKDpuYW1lIGZvcm0pfSkpXG5cbihkZWZuIHdyaXRlLWJpbmRpbmdcbiAgW2Zvcm1dXG4gICh3cml0ZSB7Om9wIDpkZWZcbiAgICAgICAgICA6dmFyIGZvcm1cbiAgICAgICAgICA6aW5pdCAoOmluaXQgZm9ybSlcbiAgICAgICAgICA6Zm9ybSBmb3JtfSkpXG5cbihkZWZuIHdyaXRlLWxldFxuICBbZm9ybV1cbiAgKGxldCBbYm9keSAoY29uaiBmb3JtXG4gICAgICAgICAgICAgICAgICAgezpzdGF0ZW1lbnRzICh2ZWMgKGNvbmNhdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoOmJpbmRpbmdzIGZvcm0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICg6c3RhdGVtZW50cyBmb3JtKSkpfSldXG4gICAgKC0+aWlmZSAoLT5ibG9jayAod3JpdGUtYm9keSBib2R5KSkpKSlcbihpbnN0YWxsLXdyaXRlciEgOmxldCB3cml0ZS1sZXQpXG5cbihkZWZuIC0+cmViaW5kXG4gIFtmb3JtXVxuICAobG9vcCBbcmVzdWx0IFtdXG4gICAgICAgICBiaW5kaW5ncyAoOmJpbmRpbmdzIGZvcm0pXVxuICAgIChpZiAoZW1wdHk/IGJpbmRpbmdzKVxuICAgICAgcmVzdWx0XG4gICAgICAocmVjdXIgKGNvbmogcmVzdWx0XG4gICAgICAgICAgICAgICAgICAgezp0eXBlIDpBc3NpZ25tZW50RXhwcmVzc2lvblxuICAgICAgICAgICAgICAgICAgICA6b3BlcmF0b3IgOj1cbiAgICAgICAgICAgICAgICAgICAgOmxlZnQgKHdyaXRlLWJpbmRpbmctdmFyIChmaXJzdCBiaW5kaW5ncykpXG4gICAgICAgICAgICAgICAgICAgIDpyaWdodCB7OnR5cGUgOk1lbWJlckV4cHJlc3Npb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Y29tcHV0ZWQgdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpvYmplY3Qgezp0eXBlIDpJZGVudGlmaWVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOm5hbWUgOmxvb3B9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOnByb3BlcnR5IHs6dHlwZSA6TGl0ZXJhbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnZhbHVlIChjb3VudCByZXN1bHQpfX19KVxuICAgICAgICAgICAgIChyZXN0IGJpbmRpbmdzKSkpKSlcblxuKGRlZm4gLT5zZXF1ZW5jZVxuICBbZXhwcmVzc2lvbnNdXG4gIHs6dHlwZSA6U2VxdWVuY2VFeHByZXNzaW9uXG4gICA6ZXhwcmVzc2lvbnMgZXhwcmVzc2lvbnN9KVxuXG4oZGVmbiAtPmlpZmVcbiAgW2JvZHkgaWRdXG4gIHs6dHlwZSA6Q2FsbEV4cHJlc3Npb25cbiAgIDphcmd1bWVudHMgW3s6dHlwZSA6VGhpc0V4cHJlc3Npb259XVxuICAgOmNhbGxlZSB7OnR5cGUgOk1lbWJlckV4cHJlc3Npb25cbiAgICAgICAgICAgIDpjb21wdXRlZCBmYWxzZVxuICAgICAgICAgICAgOm9iamVjdCB7OnR5cGUgOkZ1bmN0aW9uRXhwcmVzc2lvblxuICAgICAgICAgICAgICAgICAgICAgOmlkIGlkXG4gICAgICAgICAgICAgICAgICAgICA6cGFyYW1zIFtdXG4gICAgICAgICAgICAgICAgICAgICA6ZGVmYXVsdHMgW11cbiAgICAgICAgICAgICAgICAgICAgIDpleHByZXNzaW9uIGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICA6Z2VuZXJhdG9yIGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICA6cmVzdCBuaWxcbiAgICAgICAgICAgICAgICAgICAgIDpib2R5IGJvZHl9XG4gICAgICAgICAgICA6cHJvcGVydHkgezp0eXBlIDpJZGVudGlmaWVyXG4gICAgICAgICAgICAgICAgICAgICAgIDpuYW1lIDpjYWxsfX19KVxuXG4oZGVmbiAtPmxvb3AtaW5pdFxuICBbXVxuICB7OnR5cGUgOlZhcmlhYmxlRGVjbGFyYXRpb25cbiAgIDpraW5kIDp2YXJcbiAgIDpkZWNsYXJhdGlvbnMgW3s6dHlwZSA6VmFyaWFibGVEZWNsYXJhdG9yXG4gICAgICAgICAgICAgICAgICAgOmlkIHs6dHlwZSA6SWRlbnRpZmllclxuICAgICAgICAgICAgICAgICAgICAgICAgOm5hbWUgOnJlY3VyfVxuICAgICAgICAgICAgICAgICAgIDppbml0IHs6dHlwZSA6SWRlbnRpZmllclxuICAgICAgICAgICAgICAgICAgICAgICAgICA6bmFtZSA6bG9vcH19XX0pXG5cbihkZWZuIC0+ZG8td2hpbGVcbiBbYm9keSB0ZXN0XVxuIHs6dHlwZSA6RG9XaGlsZVN0YXRlbWVudFxuICA6Ym9keSBib2R5XG4gIDp0ZXN0IHRlc3R9KVxuXG4oZGVmbiAtPnNldCEtcmVjdXJcbiAgW2Zvcm1dXG4gIHs6dHlwZSA6QXNzaWdubWVudEV4cHJlc3Npb25cbiAgIDpvcGVyYXRvciA6PVxuICAgOmxlZnQgezp0eXBlIDpJZGVudGlmaWVyIDpuYW1lIDpyZWN1cn1cbiAgIDpyaWdodCAod3JpdGUgZm9ybSl9KVxuXG4oZGVmbiAtPmxvb3BcbiAgW2Zvcm1dXG4gICgtPnNlcXVlbmNlIChjb25qICgtPnJlYmluZCBmb3JtKVxuICAgICAgICAgICAgICAgICAgICB7OnR5cGUgOkJpbmFyeUV4cHJlc3Npb25cbiAgICAgICAgICAgICAgICAgICAgIDpvcGVyYXRvciA6PT09XG4gICAgICAgICAgICAgICAgICAgICA6bGVmdCB7OnR5cGUgOklkZW50aWZpZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6bmFtZSA6cmVjdXJ9XG4gICAgICAgICAgICAgICAgICAgICA6cmlnaHQgezp0eXBlIDpJZGVudGlmaWVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpuYW1lIDpsb29wfX0pKSlcblxuXG4oZGVmbiB3cml0ZS1sb29wXG4gIFtmb3JtXVxuICAobGV0IFtzdGF0ZW1lbnRzICg6c3RhdGVtZW50cyBmb3JtKVxuICAgICAgICByZXN1bHQgKDpyZXN1bHQgZm9ybSlcbiAgICAgICAgYmluZGluZ3MgKDpiaW5kaW5ncyBmb3JtKVxuXG4gICAgICAgIGxvb3AtYm9keSAoY29uaiAobWFwIHdyaXRlLXN0YXRlbWVudCBzdGF0ZW1lbnRzKVxuICAgICAgICAgICAgICAgICAgICAgICAgKC0+c3RhdGVtZW50ICgtPnNldCEtcmVjdXIgcmVzdWx0KSkpXG4gICAgICAgIGJvZHkgKGNvbmNhdCBbKFxuICAgICAgICAgICAgICAgICAgICAgICAtPmxvb3AtaW5pdCldXG4gICAgICAgICAgICAgICAgICAgICAobWFwIHdyaXRlIGJpbmRpbmdzKVxuICAgICAgICAgICAgICAgICAgICAgWygtPmRvLXdoaWxlICgtPmJsb2NrICh2ZWMgbG9vcC1ib2R5KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoLT5sb29wIGZvcm0pKV1cbiAgICAgICAgICAgICAgICAgICAgIFt7OnR5cGUgOlJldHVyblN0YXRlbWVudFxuICAgICAgICAgICAgICAgICAgICAgICA6YXJndW1lbnQgezp0eXBlIDpJZGVudGlmaWVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOm5hbWUgOnJlY3VyfX1dKV1cbiAgICAoLT5paWZlICgtPmJsb2NrICh2ZWMgYm9keSkpICdsb29wKSkpXG4oaW5zdGFsbC13cml0ZXIhIDpsb29wIHdyaXRlLWxvb3ApXG5cbihkZWZuIC0+cmVjdXJcbiAgW2Zvcm1dXG4gIChsb29wIFtyZXN1bHQgW11cbiAgICAgICAgIHBhcmFtcyAoOnBhcmFtcyBmb3JtKV1cbiAgICAoaWYgKGVtcHR5PyBwYXJhbXMpXG4gICAgICByZXN1bHRcbiAgICAgIChyZWN1ciAoY29uaiByZXN1bHRcbiAgICAgICAgICAgICAgICAgICB7OnR5cGUgOkFzc2lnbm1lbnRFeHByZXNzaW9uXG4gICAgICAgICAgICAgICAgICAgIDpvcGVyYXRvciA6PVxuICAgICAgICAgICAgICAgICAgICA6cmlnaHQgKHdyaXRlIChmaXJzdCBwYXJhbXMpKVxuICAgICAgICAgICAgICAgICAgICA6bGVmdCB7OnR5cGUgOk1lbWJlckV4cHJlc3Npb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDpjb21wdXRlZCB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICA6b2JqZWN0IHs6dHlwZSA6SWRlbnRpZmllclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOm5hbWUgOmxvb3B9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICA6cHJvcGVydHkgezp0eXBlIDpMaXRlcmFsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDp2YWx1ZSAoY291bnQgcmVzdWx0KX19fSlcbiAgICAgICAgICAgICAocmVzdCBwYXJhbXMpKSkpKVxuXG4oZGVmbiB3cml0ZS1yZWN1clxuICBbZm9ybV1cbiAgKC0+c2VxdWVuY2UgKGNvbmogKC0+cmVjdXIgZm9ybSlcbiAgICAgICAgICAgICAgICAgICAgezp0eXBlIDpJZGVudGlmaWVyXG4gICAgICAgICAgICAgICAgICAgICA6bmFtZSA6bG9vcH0pKSlcbihpbnN0YWxsLXdyaXRlciEgOnJlY3VyIHdyaXRlLXJlY3VyKVxuXG4oZGVmbiBmYWxsYmFjay1vdmVybG9hZFxuICBbXVxuICB7OnR5cGUgOlN3aXRjaENhc2VcbiAgIDp0ZXN0IG5pbFxuICAgOmNvbnNlcXVlbnQgW3s6dHlwZSA6VGhyb3dTdGF0ZW1lbnRcbiAgICAgICAgICAgICAgICAgOmFyZ3VtZW50IHs6dHlwZSA6Q2FsbEV4cHJlc3Npb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Y2FsbGVlIHs6dHlwZSA6SWRlbnRpZmllclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpuYW1lIDpSYW5nZUVycm9yfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDphcmd1bWVudHMgW3s6dHlwZSA6TGl0ZXJhbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6dmFsdWUgXCJXcm9uZyBudW1iZXIgb2YgYXJndW1lbnRzIHBhc3NlZFwifV19fV19KVxuXG4oZGVmbiBzcGxpY2UtYmluZGluZ1xuICBbZm9ybV1cbiAgezpvcCA6ZGVmXG4gICA6aWQgKGxhc3QgKDpwYXJhbXMgZm9ybSkpXG4gICA6aW5pdCB7Om9wIDppbnZva2VcbiAgICAgICAgICA6Y2FsbGVlIHs6b3AgOnZhclxuICAgICAgICAgICAgICAgICAgIDpmb3JtICdBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbH1cbiAgICAgICAgICA6cGFyYW1zIFt7Om9wIDp2YXJcbiAgICAgICAgICAgICAgICAgICAgOmZvcm0gJ2FyZ3VtZW50c31cbiAgICAgICAgICAgICAgICAgICB7Om9wIDpjb25zdGFudFxuICAgICAgICAgICAgICAgICAgICA6Zm9ybSAoOmFyaXR5IGZvcm0pXG4gICAgICAgICAgICAgICAgICAgIDp0eXBlIDpudW1iZXJ9XX19KVxuXG4oZGVmbiB3cml0ZS1vdmVybG9hZGluZy1wYXJhbXNcbiAgW3BhcmFtc11cbiAgKHJlZHVjZSAoZm4gW2Zvcm1zIHBhcmFtXVxuICAgICAgICAgICAgKGNvbmogZm9ybXMgezpvcCA6ZGVmXG4gICAgICAgICAgICAgICAgICAgICAgICAgOmlkIHBhcmFtXG4gICAgICAgICAgICAgICAgICAgICAgICAgOmluaXQgezpvcCA6bWVtYmVyLWV4cHJlc3Npb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmNvbXB1dGVkIHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnRhcmdldCB7Om9wIDp2YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gJ2FyZ3VtZW50c31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnByb3BlcnR5IHs6b3AgOmNvbnN0YW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnR5cGUgOm51bWJlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtIChjb3VudCBmb3Jtcyl9fX0pKVxuICAgICAgICAgIFtdXG4gICAgICAgICAgcGFyYW1zKSlcblxuKGRlZm4gd3JpdGUtb3ZlcmxvYWRpbmctZm5cbiAgW2Zvcm1dXG4gIChsZXQgW292ZXJsb2FkcyAobWFwIHdyaXRlLWZuLW92ZXJsb2FkICg6bWV0aG9kcyBmb3JtKSldXG4gICAgezpwYXJhbXMgW11cbiAgICAgOmJvZHkgKC0+YmxvY2sgezp0eXBlIDpTd2l0Y2hTdGF0ZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgIDpkaXNjcmltaW5hbnQgezp0eXBlIDpNZW1iZXJFeHByZXNzaW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Y29tcHV0ZWQgZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpvYmplY3Qgezp0eXBlIDpJZGVudGlmaWVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6bmFtZSA6YXJndW1lbnRzfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnByb3BlcnR5IHs6dHlwZSA6SWRlbnRpZmllclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6bmFtZSA6bGVuZ3RofX1cbiAgICAgICAgICAgICAgICAgICAgIDpjYXNlcyAoaWYgKDp2YXJpYWRpYyBmb3JtKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3ZlcmxvYWRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoY29uaiBvdmVybG9hZHMgKGZhbGxiYWNrLW92ZXJsb2FkKSkpfSl9KSlcblxuKGRlZm4gd3JpdGUtZm4tb3ZlcmxvYWRcbiAgW2Zvcm1dXG4gIChsZXQgW3BhcmFtcyAoOnBhcmFtcyBmb3JtKVxuICAgICAgICBiaW5kaW5ncyAoaWYgKDp2YXJpYWRpYyBmb3JtKVxuICAgICAgICAgICAgICAgICAgIChjb25qICh3cml0ZS1vdmVybG9hZGluZy1wYXJhbXMgKGJ1dGxhc3QgcGFyYW1zKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAoc3BsaWNlLWJpbmRpbmcgZm9ybSkpXG4gICAgICAgICAgICAgICAgICAgKHdyaXRlLW92ZXJsb2FkaW5nLXBhcmFtcyBwYXJhbXMpKVxuICAgICAgICBzdGF0ZW1lbnRzICh2ZWMgKGNvbmNhdCBiaW5kaW5ncyAoOnN0YXRlbWVudHMgZm9ybSkpKV1cbiAgICB7OnR5cGUgOlN3aXRjaENhc2VcbiAgICAgOnRlc3QgKGlmIChub3QgKDp2YXJpYWRpYyBmb3JtKSlcbiAgICAgICAgICAgICB7OnR5cGUgOkxpdGVyYWxcbiAgICAgICAgICAgICAgOnZhbHVlICg6YXJpdHkgZm9ybSl9KVxuICAgICA6Y29uc2VxdWVudCAod3JpdGUtYm9keSAoY29uaiBmb3JtIHs6c3RhdGVtZW50cyBzdGF0ZW1lbnRzfSkpfSkpXG5cbihkZWZuIHdyaXRlLXNpbXBsZS1mblxuICBbZm9ybV1cbiAgKGxldCBbbWV0aG9kIChmaXJzdCAoOm1ldGhvZHMgZm9ybSkpXG4gICAgICAgIHBhcmFtcyAoaWYgKDp2YXJpYWRpYyBtZXRob2QpXG4gICAgICAgICAgICAgICAgIChidXRsYXN0ICg6cGFyYW1zIG1ldGhvZCkpXG4gICAgICAgICAgICAgICAgICg6cGFyYW1zIG1ldGhvZCkpXG4gICAgICAgIGJvZHkgKGlmICg6dmFyaWFkaWMgbWV0aG9kKVxuICAgICAgICAgICAgICAgKGNvbmogbWV0aG9kXG4gICAgICAgICAgICAgICAgICAgICB7OnN0YXRlbWVudHMgKHZlYyAoY29ucyAoc3BsaWNlLWJpbmRpbmcgbWV0aG9kKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKDpzdGF0ZW1lbnRzIG1ldGhvZCkpKX0pXG4gICAgICAgICAgICAgICBtZXRob2QpXVxuICAgIHs6cGFyYW1zIChtYXAgd3JpdGUtdmFyIHBhcmFtcylcbiAgICAgOmJvZHkgKC0+YmxvY2sgKHdyaXRlLWJvZHkgYm9keSkpfSkpXG5cbihkZWZuIHJlc29sdmVcbiAgW2Zyb20gdG9dXG4gIChsZXQgW3JlcXVpcmVyIChzcGxpdCAobmFtZSBmcm9tKSBcXC4pXG4gICAgICAgIHJlcXVpcmVtZW50IChzcGxpdCAobmFtZSB0bykgXFwuKVxuICAgICAgICByZWxhdGl2ZT8gKGFuZCAobm90IChpZGVudGljYWw/IChuYW1lIGZyb20pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG5hbWUgdG8pKSlcbiAgICAgICAgICAgICAgICAgICAgICAgKGlkZW50aWNhbD8gKGZpcnN0IHJlcXVpcmVyKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZmlyc3QgcmVxdWlyZW1lbnQpKSldXG4gICAgKGlmIHJlbGF0aXZlP1xuICAgICAgKGxvb3AgW2Zyb20gcmVxdWlyZXJcbiAgICAgICAgICAgICB0byByZXF1aXJlbWVudF1cbiAgICAgICAgKGlmIChpZGVudGljYWw/IChmaXJzdCBmcm9tKVxuICAgICAgICAgICAgICAgICAgICAgICAgKGZpcnN0IHRvKSlcbiAgICAgICAgICAocmVjdXIgKHJlc3QgZnJvbSkgKHJlc3QgdG8pKVxuICAgICAgICAgIChqb2luIFxcL1xuICAgICAgICAgICAgICAgIChjb25jYXQgW1xcLl1cbiAgICAgICAgICAgICAgICAgICAgICAgIChyZXBlYXQgKGRlYyAoY291bnQgZnJvbSkpIFwiLi5cIilcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvKSkpKVxuICAgICAgKGpvaW4gXFwvIHJlcXVpcmVtZW50KSkpKVxuXG4oZGVmbiBpZC0+bnNcbiAgXCJUYWtlcyBuYW1lc3BhY2UgaWRlbnRpZmllciBzeW1ib2wgYW5kIHRyYW5zbGF0ZXMgdG8gbmV3XG4gIHN5bWJvbCB3aXRob3V0IC4gc3BlY2lhbCBjaGFyYWN0ZXJzXG4gIHdpc3AuY29yZSAtPiB3aXNwKmNvcmVcIlxuICBbaWRdXG4gIChzeW1ib2wgbmlsIChqb2luIFxcKiAoc3BsaXQgKG5hbWUgaWQpIFxcLikpKSlcblxuXG4oZGVmbiB3cml0ZS1yZXF1aXJlXG4gIFtmb3JtIHJlcXVpcmVyXVxuICAobGV0IFtucy1iaW5kaW5nIHs6b3AgOmRlZlxuICAgICAgICAgICAgICAgICAgICA6aWQgezpvcCA6dmFyXG4gICAgICAgICAgICAgICAgICAgICAgICAgOnR5cGUgOmlkZW50aWZpZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICA6Zm9ybSAoaWQtPm5zICg6bnMgZm9ybSkpfVxuICAgICAgICAgICAgICAgICAgICA6aW5pdCB7Om9wIDppbnZva2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDpjYWxsZWUgezpvcCA6dmFyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6dHlwZSA6aWRlbnRpZmllclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gJ3JlcXVpcmV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICA6cGFyYW1zIFt7Om9wIDpjb25zdGFudFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtIChyZXNvbHZlIHJlcXVpcmVyICg6bnMgZm9ybSkpfV19fVxuICAgICAgICBucy1hbGlhcyAoaWYgKDphbGlhcyBmb3JtKVxuICAgICAgICAgICAgICAgICAgIHs6b3AgOmRlZlxuICAgICAgICAgICAgICAgICAgICA6aWQgezpvcCA6dmFyXG4gICAgICAgICAgICAgICAgICAgICAgICAgOnR5cGUgOmlkZW50aWZpZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICA6Zm9ybSAoaWQtPm5zICg6YWxpYXMgZm9ybSkpfVxuICAgICAgICAgICAgICAgICAgICA6aW5pdCAoOmlkIG5zLWJpbmRpbmcpfSlcblxuICAgICAgICByZWZlcmVuY2VzIChyZWR1Y2UgKGZuIFtyZWZlcmVuY2VzIGZvcm1dXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIChjb25qIHJlZmVyZW5jZXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgezpvcCA6ZGVmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6aWQgezpvcCA6dmFyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDp0eXBlIDppZGVudGlmaWVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtIChvciAoOnJlbmFtZSBmb3JtKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKDpuYW1lIGZvcm0pKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDppbml0IHs6b3AgOm1lbWJlci1leHByZXNzaW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmNvbXB1dGVkIGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnRhcmdldCAoOmlkIG5zLWJpbmRpbmcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnByb3BlcnR5IHs6b3AgOnZhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnR5cGUgOmlkZW50aWZpZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtICg6bmFtZSBmb3JtKX19fSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBbXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgKDpyZWZlciBmb3JtKSldXG4gICAgKHZlYyAoY29ucyBucy1iaW5kaW5nXG4gICAgICAgICAgICAgICAoaWYgbnMtYWxpYXNcbiAgICAgICAgICAgICAgICAgKGNvbnMgbnMtYWxpYXMgcmVmZXJlbmNlcylcbiAgICAgICAgICAgICAgICAgcmVmZXJlbmNlcykpKSkpXG5cbihkZWZuIHdyaXRlLW5zXG4gIFtmb3JtXVxuICAobGV0IFtub2RlICg6Zm9ybSBmb3JtKVxuICAgICAgICByZXF1aXJlciAoOm5hbWUgZm9ybSlcbiAgICAgICAgbnMtYmluZGluZyB7Om9wIDpkZWZcbiAgICAgICAgICAgICAgICAgICAgOm9yaWdpbmFsLWZvcm0gbm9kZVxuICAgICAgICAgICAgICAgICAgICA6aWQgezpvcCA6dmFyXG4gICAgICAgICAgICAgICAgICAgICAgICAgOnR5cGUgOmlkZW50aWZpZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICA6b3JpZ2luYWwtZm9ybSAoZmlyc3Qgbm9kZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICA6Zm9ybSAnKm5zKn1cbiAgICAgICAgICAgICAgICAgICAgOmluaXQgezpvcCA6ZGljdGlvbmFyeVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gbm9kZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgOmtleXMgW3s6b3AgOnZhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6dHlwZSA6aWRlbnRpZmllclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6b3JpZ2luYWwtZm9ybSBub2RlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpmb3JtICdpZH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Om9wIDp2YXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnR5cGUgOmlkZW50aWZpZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOm9yaWdpbmFsLWZvcm0gbm9kZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Zm9ybSAnZG9jfV1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDp2YWx1ZXMgW3s6b3AgOmNvbnN0YW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOnR5cGUgOmlkZW50aWZpZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6b3JpZ2luYWwtZm9ybSAoOm5hbWUgZm9ybSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6Zm9ybSAobmFtZSAoOm5hbWUgZm9ybSkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgezpvcCA6Y29uc3RhbnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6b3JpZ2luYWwtZm9ybSBub2RlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZvcm0gKDpkb2MgZm9ybSl9XX19XG4gICAgICAgIHJlcXVpcmVtZW50cyAodmVjIChhcHBseSBjb25jYXQgKG1hcCAjKHdyaXRlLXJlcXVpcmUgJSByZXF1aXJlcilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICg6cmVxdWlyZSBmb3JtKSkpKV1cbiAgICAoLT5ibG9jayAobWFwIHdyaXRlICh2ZWMgKGNvbnMgbnMtYmluZGluZyByZXF1aXJlbWVudHMpKSkpKSlcbihpbnN0YWxsLXdyaXRlciEgOm5zIHdyaXRlLW5zKVxuXG4oZGVmbiB3cml0ZS1mblxuICBbZm9ybV1cbiAgKGxldCBbYmFzZSAoaWYgKD4gKGNvdW50ICg6bWV0aG9kcyBmb3JtKSkgMSlcbiAgICAgICAgICAgICAgICh3cml0ZS1vdmVybG9hZGluZy1mbiBmb3JtKVxuICAgICAgICAgICAgICAgKHdyaXRlLXNpbXBsZS1mbiBmb3JtKSldXG4gICAgKGNvbmogYmFzZVxuICAgICAgICAgIHs6dHlwZSA6RnVuY3Rpb25FeHByZXNzaW9uXG4gICAgICAgICAgIDppZCAoaWYgKDppZCBmb3JtKSAod3JpdGUtdmFyICg6aWQgZm9ybSkpKVxuICAgICAgICAgICA6ZGVmYXVsdHMgbmlsXG4gICAgICAgICAgIDpyZXN0IG5pbFxuICAgICAgICAgICA6Z2VuZXJhdG9yIGZhbHNlXG4gICAgICAgICAgIDpleHByZXNzaW9uIGZhbHNlfSkpKVxuKGluc3RhbGwtd3JpdGVyISA6Zm4gd3JpdGUtZm4pXG5cbihkZWZuIHdyaXRlXG4gIFtmb3JtXVxuICAobGV0IFtvcCAoOm9wIGZvcm0pXG4gICAgICAgIHdyaXRlciAoYW5kICg9IDppbnZva2UgKDpvcCBmb3JtKSlcbiAgICAgICAgICAgICAgICAgICAgKD0gOnZhciAoOm9wICg6Y2FsbGVlIGZvcm0pKSlcbiAgICAgICAgICAgICAgICAgICAgKGdldCAqKnNwZWNpYWxzKiogKG5hbWUgKDpmb3JtICg6Y2FsbGVlIGZvcm0pKSkpKV1cbiAgICAoaWYgd3JpdGVyXG4gICAgICAod3JpdGUtc3BlY2lhbCB3cml0ZXIgZm9ybSlcbiAgICAgICh3cml0ZS1vcCAoOm9wIGZvcm0pIGZvcm0pKSkpXG5cbihkZWZuIHdyaXRlKlxuICBbJiBmb3Jtc11cbiAgKGxldCBbYm9keSAobWFwIHdyaXRlLXN0YXRlbWVudCBmb3JtcyldXG4gICAgezp0eXBlIDpQcm9ncmFtXG4gICAgIDpib2R5IGJvZHlcbiAgICAgOmxvYyAoaW5oZXJpdC1sb2NhdGlvbiBib2R5KX0pKVxuXG5cbihkZWZuIGNvbXBpbGVcbiAgKFtmb3JtXSAoY29tcGlsZSB7fSBmb3JtKSlcbiAgKFtvcHRpb25zICYgZm9ybXNdIChnZW5lcmF0ZSAoYXBwbHkgd3JpdGUqIGZvcm1zKSBvcHRpb25zKSkpXG5cblxuKGRlZm4gZ2V0LW1hY3JvXG4gIChbdGFyZ2V0IHByb3BlcnR5XVxuICAgYChhZ2V0IChvciB+dGFyZ2V0IDApXG4gICAgICAgICAgfnByb3BlcnR5KSlcbiAgKFt0YXJnZXQgcHJvcGVydHkgZGVmYXVsdCpdXG4gICAgKGlmIChpZGVudGljYWw/IGRlZmF1bHQqIG5pbClcbiAgICAgIGAoZ2V0IH50YXJnZXQgfnByb3BlcnR5KVxuICAgICAgYChhcHBseSBnZXQgflt0YXJnZXQgcHJvcGVydHkgZGVmYXVsdCpdKSkpKVxuKGluc3RhbGwtbWFjcm8hIDpnZXQgZ2V0LW1hY3JvKVxuXG47OyBMb2dpY2FsIG9wZXJhdG9yc1xuXG4oZGVmbiBpbnN0YWxsLWxvZ2ljYWwtb3BlcmF0b3IhXG4gIFtjYWxsZWUgb3BlcmF0b3IgZmFsbGJhY2tdXG4gIChkZWZuIHdyaXRlLWxvZ2ljYWwtb3BlcmF0b3JcbiAgICBbJiBvcGVyYW5kc11cbiAgICAobGV0IFtuIChjb3VudCBvcGVyYW5kcyldXG4gICAgICAoY29uZCAoPSBuIDApICh3cml0ZS1jb25zdGFudCBmYWxsYmFjaylcbiAgICAgICAgICAgICg9IG4gMSkgKHdyaXRlIChmaXJzdCBvcGVyYW5kcykpXG4gICAgICAgICAgICA6ZWxzZSAocmVkdWNlIChmbiBbbGVmdCByaWdodF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7OnR5cGUgOkxvZ2ljYWxFeHByZXNzaW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpvcGVyYXRvciBvcGVyYXRvclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6bGVmdCBsZWZ0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIDpyaWdodCAod3JpdGUgcmlnaHQpfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKHdyaXRlIChmaXJzdCBvcGVyYW5kcykpXG4gICAgICAgICAgICAgICAgICAgICAgICAgIChyZXN0IG9wZXJhbmRzKSkpKSlcbiAgKGluc3RhbGwtc3BlY2lhbCEgY2FsbGVlIHdyaXRlLWxvZ2ljYWwtb3BlcmF0b3IpKVxuKGluc3RhbGwtbG9naWNhbC1vcGVyYXRvciEgOm9yIDp8fCBuaWwpXG4oaW5zdGFsbC1sb2dpY2FsLW9wZXJhdG9yISA6YW5kIDomJiB0cnVlKVxuXG4oZGVmbiBpbnN0YWxsLXVuYXJ5LW9wZXJhdG9yIVxuICBbY2FsbGVlIG9wZXJhdG9yIHByZWZpeD9dXG4gIChkZWZuIHdyaXRlLXVuYXJ5LW9wZXJhdG9yXG4gICAgWyYgcGFyYW1zXVxuICAgIChpZiAoaWRlbnRpY2FsPyAoY291bnQgcGFyYW1zKSAxKVxuICAgICAgezp0eXBlIDpVbmFyeUV4cHJlc3Npb25cbiAgICAgICA6b3BlcmF0b3Igb3BlcmF0b3JcbiAgICAgICA6YXJndW1lbnQgKHdyaXRlIChmaXJzdCBwYXJhbXMpKVxuICAgICAgIDpwcmVmaXggcHJlZml4P31cbiAgICAgIChlcnJvci1hcmctY291bnQgY2FsbGVlIChjb3VudCBwYXJhbXMpKSkpXG4gIChpbnN0YWxsLXNwZWNpYWwhIGNhbGxlZSB3cml0ZS11bmFyeS1vcGVyYXRvcikpXG4oaW5zdGFsbC11bmFyeS1vcGVyYXRvciEgOm5vdCA6ISlcblxuOzsgQml0d2lzZSBPcGVyYXRvcnNcblxuKGluc3RhbGwtdW5hcnktb3BlcmF0b3IhIDpiaXQtbm90IDp+KVxuXG4oZGVmbiBpbnN0YWxsLWJpbmFyeS1vcGVyYXRvciFcbiAgW2NhbGxlZSBvcGVyYXRvcl1cbiAgKGRlZm4gd3JpdGUtYmluYXJ5LW9wZXJhdG9yXG4gICAgWyYgcGFyYW1zXVxuICAgIChpZiAoPCAoY291bnQgcGFyYW1zKSAyKVxuICAgICAgKGVycm9yLWFyZy1jb3VudCBjYWxsZWUgKGNvdW50IHBhcmFtcykpXG4gICAgICAocmVkdWNlIChmbiBbbGVmdCByaWdodF1cbiAgICAgICAgICAgICAgICB7OnR5cGUgOkJpbmFyeUV4cHJlc3Npb25cbiAgICAgICAgICAgICAgICAgOm9wZXJhdG9yIG9wZXJhdG9yXG4gICAgICAgICAgICAgICAgIDpsZWZ0IGxlZnRcbiAgICAgICAgICAgICAgICAgOnJpZ2h0ICh3cml0ZSByaWdodCl9KVxuICAgICAgICAgICAgICAod3JpdGUgKGZpcnN0IHBhcmFtcykpXG4gICAgICAgICAgICAgIChyZXN0IHBhcmFtcykpKSlcbiAgKGluc3RhbGwtc3BlY2lhbCEgY2FsbGVlIHdyaXRlLWJpbmFyeS1vcGVyYXRvcikpXG4oaW5zdGFsbC1iaW5hcnktb3BlcmF0b3IhIDpiaXQtYW5kIDomKVxuKGluc3RhbGwtYmluYXJ5LW9wZXJhdG9yISA6Yml0LW9yIDp8KVxuKGluc3RhbGwtYmluYXJ5LW9wZXJhdG9yISA6Yml0LXhvciA6XilcbihpbnN0YWxsLWJpbmFyeS1vcGVyYXRvciEgOmJpdC1zaGlmdC1sZWZ0IDo8PClcbihpbnN0YWxsLWJpbmFyeS1vcGVyYXRvciEgOmJpdC1zaGlmdC1yaWdodCA6Pj4pXG4oaW5zdGFsbC1iaW5hcnktb3BlcmF0b3IhIDpiaXQtc2hpZnQtcmlnaHQtemVyby1maWwgOj4+PilcblxuOzsgQXJpdGhtZXRpYyBvcGVyYXRvcnNcblxuKGRlZm4gaW5zdGFsbC1hcml0aG1ldGljLW9wZXJhdG9yIVxuICBbY2FsbGVlIG9wZXJhdG9yIHZhbGlkPyBmYWxsYmFja11cblxuICAoZGVmbiB3cml0ZS1iaW5hcnktb3BlcmF0b3JcbiAgICBbbGVmdCByaWdodF1cbiAgICB7OnR5cGUgOkJpbmFyeUV4cHJlc3Npb25cbiAgICAgOm9wZXJhdG9yIChuYW1lIG9wZXJhdG9yKVxuICAgICA6bGVmdCBsZWZ0XG4gICAgIDpyaWdodCAod3JpdGUgcmlnaHQpfSlcblxuICAoZGVmbiB3cml0ZS1hcml0aG1ldGljLW9wZXJhdG9yXG4gICAgWyYgcGFyYW1zXVxuICAgIChsZXQgW24gKGNvdW50IHBhcmFtcyldXG4gICAgICAoY29uZCAoYW5kIHZhbGlkPyAobm90ICh2YWxpZD8gbikpKSAoZXJyb3ItYXJnLWNvdW50IChuYW1lIGNhbGxlZSkgbilcbiAgICAgICAgICAgICg9PSBuIDApICh3cml0ZS1saXRlcmFsIGZhbGxiYWNrKVxuICAgICAgICAgICAgKD09IG4gMSkgKHJlZHVjZSB3cml0ZS1iaW5hcnktb3BlcmF0b3JcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHdyaXRlLWxpdGVyYWwgZmFsbGJhY2spXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtcylcbiAgICAgICAgICAgIDplbHNlIChyZWR1Y2Ugd3JpdGUtYmluYXJ5LW9wZXJhdG9yXG4gICAgICAgICAgICAgICAgICAgICAgICAgICh3cml0ZSAoZmlyc3QgcGFyYW1zKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKHJlc3QgcGFyYW1zKSkpKSlcblxuXG4gIChpbnN0YWxsLXNwZWNpYWwhIGNhbGxlZSB3cml0ZS1hcml0aG1ldGljLW9wZXJhdG9yKSlcblxuKGluc3RhbGwtYXJpdGhtZXRpYy1vcGVyYXRvciEgOisgOisgbmlsIDApXG4oaW5zdGFsbC1hcml0aG1ldGljLW9wZXJhdG9yISA6LSA6LSAjKD49ICUgMSkgMClcbihpbnN0YWxsLWFyaXRobWV0aWMtb3BlcmF0b3IhIDoqIDoqIG5pbCAxKVxuKGluc3RhbGwtYXJpdGhtZXRpYy1vcGVyYXRvciEgKGtleXdvcmQgXFwvKSAoa2V5d29yZCBcXC8pICMoPj0gJSAxKSAxKVxuKGluc3RhbGwtYXJpdGhtZXRpYy1vcGVyYXRvciEgOnJlbSAoa2V5d29yZCBcXCUpICMoPT0gJSAyKSAxKVxuXG5cbjs7IENvbXBhcmlzb24gb3BlcmF0b3JzXG5cbihkZWZuIGluc3RhbGwtY29tcGFyaXNvbi1vcGVyYXRvciFcbiAgXCJHZW5lcmF0ZXMgY29tcGFyaXNvbiBvcGVyYXRvciB3cml0ZXIgdGhhdCBnaXZlbiBvbmVcbiAgcGFyYW1ldGVyIHdyaXRlcyBgZmFsbGJhY2tgIGdpdmVuIHR3byBwYXJhbWV0ZXJzIHdyaXRlc1xuICBiaW5hcnkgZXhwcmVzc2lvbiBhbmQgZ2l2ZW4gbW9yZSBwYXJhbWV0ZXJzIHdyaXRlcyBiaW5hcnlcbiAgZXhwcmVzc2lvbnMgam9pbmVkIGJ5IGxvZ2ljYWwgYW5kLlwiXG4gIFtjYWxsZWUgb3BlcmF0b3IgZmFsbGJhY2tdXG5cbiAgOzsgVE9ETyAjNTRcbiAgOzsgQ29tcGFyaXNvbiBvcGVyYXRvcnMgbXVzdCB1c2UgdGVtcG9yYXJ5IHZhcmlhYmxlIHRvIHN0b3JlXG4gIDs7IGV4cHJlc3Npb24gbm9uIGxpdGVyYWwgYW5kIG5vbi1pZGVudGlmaWVycy5cbiAgKGRlZm4gd3JpdGUtY29tcGFyaXNvbi1vcGVyYXRvclxuICAgIChbXSAoZXJyb3ItYXJnLWNvdW50IGNhbGxlZSAwKSlcbiAgICAoW2Zvcm1dICgtPnNlcXVlbmNlIFsod3JpdGUgZm9ybSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAod3JpdGUtbGl0ZXJhbCBmYWxsYmFjayldKSlcbiAgICAoW2xlZnQgcmlnaHRdXG4gICAgIHs6dHlwZSA6QmluYXJ5RXhwcmVzc2lvblxuICAgICAgOm9wZXJhdG9yIG9wZXJhdG9yXG4gICAgICA6bGVmdCAod3JpdGUgbGVmdClcbiAgICAgIDpyaWdodCAod3JpdGUgcmlnaHQpfSlcbiAgICAoW2xlZnQgcmlnaHQgJiBtb3JlXVxuICAgICAocmVkdWNlIChmbiBbbGVmdCByaWdodF1cbiAgICAgICAgICAgICAgIHs6dHlwZSA6TG9naWNhbEV4cHJlc3Npb25cbiAgICAgICAgICAgICAgICA6b3BlcmF0b3IgOiYmXG4gICAgICAgICAgICAgICAgOmxlZnQgbGVmdFxuICAgICAgICAgICAgICAgIDpyaWdodCB7OnR5cGUgOkJpbmFyeUV4cHJlc3Npb25cbiAgICAgICAgICAgICAgICAgICAgICAgIDpvcGVyYXRvciBvcGVyYXRvclxuICAgICAgICAgICAgICAgICAgICAgICAgOmxlZnQgKGlmICg9IDpMb2dpY2FsRXhwcmVzc2lvbiAoOnR5cGUgbGVmdCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICg6cmlnaHQgKDpyaWdodCBsZWZ0KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKDpyaWdodCBsZWZ0KSlcbiAgICAgICAgICAgICAgICAgICAgICAgIDpyaWdodCAod3JpdGUgcmlnaHQpfX0pXG4gICAgICAgICAgICAgKHdyaXRlLWNvbXBhcmlzb24tb3BlcmF0b3IgbGVmdCByaWdodClcbiAgICAgICAgICAgICBtb3JlKSkpXG5cbiAgKGluc3RhbGwtc3BlY2lhbCEgY2FsbGVlIHdyaXRlLWNvbXBhcmlzb24tb3BlcmF0b3IpKVxuXG4oaW5zdGFsbC1jb21wYXJpc29uLW9wZXJhdG9yISA6PT0gOj09IHRydWUpXG4oaW5zdGFsbC1jb21wYXJpc29uLW9wZXJhdG9yISA6PiA6PiB0cnVlKVxuKGluc3RhbGwtY29tcGFyaXNvbi1vcGVyYXRvciEgOj49IDo+PSB0cnVlKVxuKGluc3RhbGwtY29tcGFyaXNvbi1vcGVyYXRvciEgOjwgOjwgdHJ1ZSlcbihpbnN0YWxsLWNvbXBhcmlzb24tb3BlcmF0b3IhIDo8PSA6PD0gdHJ1ZSlcblxuXG4oZGVmbiB3cml0ZS1pZGVudGljYWw/XG4gIFsmIHBhcmFtc11cbiAgOzsgVE9ETzogU3VibWl0IGEgYnVnIGZvciBjbG9qdXJlIHRvIGFsbG93IHZhcmlhZGljXG4gIDs7IG51bWJlciBvZiBwYXJhbXMgam9pbmVkIGJ5IGxvZ2ljYWwgYW5kLlxuICAoaWYgKGlkZW50aWNhbD8gKGNvdW50IHBhcmFtcykgMilcbiAgICB7OnR5cGUgOkJpbmFyeUV4cHJlc3Npb25cbiAgICAgOm9wZXJhdG9yIDo9PT1cbiAgICAgOmxlZnQgKHdyaXRlIChmaXJzdCBwYXJhbXMpKVxuICAgICA6cmlnaHQgKHdyaXRlIChzZWNvbmQgcGFyYW1zKSl9XG4gICAgKGVycm9yLWFyZy1jb3VudCA6aWRlbnRpY2FsPyAoY291bnQgcGFyYW1zKSkpKVxuKGluc3RhbGwtc3BlY2lhbCEgOmlkZW50aWNhbD8gd3JpdGUtaWRlbnRpY2FsPylcblxuKGRlZm4gd3JpdGUtaW5zdGFuY2U/XG4gIFsmIHBhcmFtc11cbiAgOzsgVE9ETzogU3VibWl0IGEgYnVnIGZvciBjbG9qdXJlIHRvIG1ha2Ugc3VyZSB0aGF0XG4gIDs7IGluc3RhbmNlPyBlaXRoZXIgYWNjZXB0cyBvbmx5IHR3byBhcmdzIG9yIHJldHVybnNcbiAgOzsgdHJ1ZSBvbmx5IGlmIGFsbCB0aGUgcGFyYW1zIGFyZSBpbnN0YW5jZSBvZiB0aGVcbiAgOzsgZ2l2ZW4gdHlwZS5cblxuICAobGV0IFtjb25zdHJ1Y3RvciAoZmlyc3QgcGFyYW1zKVxuICAgICAgICBpbnN0YW5jZSAoc2Vjb25kIHBhcmFtcyldXG4gICAgKGlmICg8IChjb3VudCBwYXJhbXMpIDEpXG4gICAgICAoZXJyb3ItYXJnLWNvdW50IDppbnN0YW5jZT8gKGNvdW50IHBhcmFtcykpXG4gICAgICB7OnR5cGUgOkJpbmFyeUV4cHJlc3Npb25cbiAgICAgICA6b3BlcmF0b3IgOmluc3RhbmNlb2ZcbiAgICAgICA6bGVmdCAoaWYgaW5zdGFuY2VcbiAgICAgICAgICAgICAgICh3cml0ZSBpbnN0YW5jZSlcbiAgICAgICAgICAgICAgICh3cml0ZS1jb25zdGFudCBpbnN0YW5jZSkpXG4gICAgICAgOnJpZ2h0ICh3cml0ZSBjb25zdHJ1Y3Rvcil9KSkpXG4oaW5zdGFsbC1zcGVjaWFsISA6aW5zdGFuY2U/IHdyaXRlLWluc3RhbmNlPylcblxuXG4oZGVmbiBleHBhbmQtYXBwbHlcbiAgW2YgJiBwYXJhbXNdXG4gIChsZXQgW3ByZWZpeCAodmVjIChidXRsYXN0IHBhcmFtcykpXVxuICAgIChpZiAoZW1wdHk/IHByZWZpeClcbiAgICAgIGAoLmFwcGx5IH5mIG5pbCB+QHBhcmFtcylcbiAgICAgIGAoLmFwcGx5IH5mIG5pbCAoLmNvbmNhdCB+cHJlZml4IH4obGFzdCBwYXJhbXMpKSkpKSlcbihpbnN0YWxsLW1hY3JvISA6YXBwbHkgZXhwYW5kLWFwcGx5KVxuXG5cbihkZWZuIGV4cGFuZC1wcmludFxuICBbJmZvcm0gJiBtb3JlXVxuICBcIlByaW50cyB0aGUgb2JqZWN0KHMpIHRvIHRoZSBvdXRwdXQgZm9yIGh1bWFuIGNvbnN1bXB0aW9uLlwiXG4gIChsZXQgW29wICh3aXRoLW1ldGEgJ2NvbnNvbGUubG9nIChtZXRhICZmb3JtKSldXG4gICAgYCh+b3AgfkBtb3JlKSkpXG4oaW5zdGFsbC1tYWNybyEgOnByaW50ICh3aXRoLW1ldGEgZXhwYW5kLXByaW50IHs6aW1wbGljaXQgWzomZm9ybV19KSlcblxuKGRlZm4gZXhwYW5kLXN0clxuICBcInN0ciBpbmxpbmluZyBhbmQgb3B0aW1pemF0aW9uIHZpYSBtYWNyb3NcIlxuICBbJiBmb3Jtc11cbiAgYCgrIFwiXCIgfkBmb3JtcykpXG4oaW5zdGFsbC1tYWNybyEgOnN0ciBleHBhbmQtc3RyKVxuXG4oZGVmbiBleHBhbmQtZGVidWdcbiAgW11cbiAgJ2RlYnVnZ2VyKVxuKGluc3RhbGwtbWFjcm8hIDpkZWJ1Z2dlciEgZXhwYW5kLWRlYnVnKVxuXG4oZGVmbiBleHBhbmQtYXNzZXJ0XG4gIF57OmRvYyBcIkV2YWx1YXRlcyBleHByIGFuZCB0aHJvd3MgYW4gZXhjZXB0aW9uIGlmIGl0IGRvZXMgbm90IGV2YWx1YXRlIHRvXG4gICAgbG9naWNhbCB0cnVlLlwifVxuICAoW3hdIChleHBhbmQtYXNzZXJ0IHggXCJcIikpXG4gIChbeCBtZXNzYWdlXSAobGV0IFtmb3JtIChwci1zdHIgeCldXG4gICAgICAgICAgICAgICAgIGAoaWYgKG5vdCB+eClcbiAgICAgICAgICAgICAgICAgICAgKHRocm93IChFcnJvciAoc3RyIFwiQXNzZXJ0IGZhaWxlZDogXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH5tZXNzYWdlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB+Zm9ybSkpKSkpKSlcbihpbnN0YWxsLW1hY3JvISA6YXNzZXJ0IGV4cGFuZC1hc3NlcnQpXG5cblxuKGRlZm4gZXhwYW5kLXR5cGVzdHIgW2l0XVxuICAobGV0IFtwcmVmaXggXCJbb2JqZWN0IFwiLCBzdWZmaXggXCJdXCJdXG4gICAgYCgtPiAoLmNhbGwgT2JqZWN0LnByb3RvdHlwZS50by1zdHJpbmcgfml0KVxuICAgICAgICAgKC5zbGljZSB+KGNvdW50IHByZWZpeCkgfigtIChjb3VudCBzdWZmaXgpKSkpKSlcblxuKGRlZm4gZXhwYW5kLWRlZnByb3RvY29sXG4gIFsmZW52IGlkICYgZm9ybXNdXG4gIChsZXQgW25zIChuYW1lICg6bmFtZSAoOm5zICZlbnYpKSlcbiAgICAgICAgcHJvdG9jb2wtbmFtZSAobmFtZSBpZClcbiAgICAgICAgcHJvdG9jb2wtZG9jIChpZiAoc3RyaW5nPyAoZmlyc3QgZm9ybXMpKVxuICAgICAgICAgICAgICAgICAgICAgICAoZmlyc3QgZm9ybXMpKVxuICAgICAgICBwcm90b2NvbC1tZXRob2RzIChpZiBwcm90b2NvbC1kb2NcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIChyZXN0IGZvcm1zKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9ybXMpXG4gICAgICAgIG5vdC1zdXBwb3J0ZWQgKGZuIFttZXRob2RdIGAjKHRocm93IChzdHIgfihzdHIgXCJObyBwcm90b2NvbCBtZXRob2QgXCIgcHJvdG9jb2wtbmFtZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiLlwiIG1ldGhvZCBcIiBkZWZpbmVkIGZvciB0eXBlIFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH4oZXhwYW5kLXR5cGVzdHIgJyUpIFwiOiBcIiAlKSkpXG4gICAgICAgIHByb3RvY29sIChtYXB2IChmbiBbbWV0aG9kXVxuICAgICAgICAgICAgICAgICAgICAgICAgIChsZXQgW21ldGhvZC1uYW1lIChmaXJzdCBtZXRob2QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQgKGlkLT5ucyAoc3RyIG5zIFwiJFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3RvY29sLW5hbWUgXCIkXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG5hbWUgbWV0aG9kLW5hbWUpKSldXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB7OmlkIG1ldGhvZC1uYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOmZuIGAoZm4gfmlkIFtzZWxmXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoLmFwcGx5IChvciAoaWYgKG9yIChpZGVudGljYWw/IHNlbGYgbnVsbCkgKGlkZW50aWNhbD8gc2VsZiBuaWwpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICguLW5pbCB+aWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG9yIChhZ2V0IHNlbGYgJ35pZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGFnZXQgfmlkIH4oZXhwYW5kLXR5cGVzdHIgJ3NlbGYpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoLi1fIH5pZCkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB+KG5vdC1zdXBwb3J0ZWQgKG5hbWUgaWQpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmIGFyZ3VtZW50cykpfSkpXG4gICAgICAgICAgICAgICAgICAgICAgIHByb3RvY29sLW1ldGhvZHMpXG4gICAgICAgIGZucyAobWFwIChmbiBbZm9ybV1cbiAgICAgICAgICAgICAgICAgICBgKGRlZiB+KDppZCBmb3JtKSAoYWdldCB+aWQgJ34oOmlkIGZvcm0pKSkpXG4gICAgICAgICAgICAgICAgIHByb3RvY29sKVxuICAgICAgICBzYXRpc2Z5IHs6d2lzcF9jb3JlJElQcm90b2NvbCRpZCAoc3RyIG5zIFwiL1wiIHByb3RvY29sLW5hbWUpfVxuICAgICAgICBib2R5IChyZWR1Y2UgKGZuIFtib2R5IG1ldGhvZF1cbiAgICAgICAgICAgICAgICAgICAgICAgKGFzc29jIGJvZHkgKDppZCBtZXRob2QpICg6Zm4gbWV0aG9kKSkpXG4gICAgICAgICAgICAgICAgICAgICBzYXRpc2Z5XG4gICAgICAgICAgICAgICAgICAgICBwcm90b2NvbCldXG4gICAgYCh+KHdpdGgtbWV0YSAnZG8gezpibG9jayB0cnVlfSlcbiAgICAgICAoZGVmIH5pZCB+Ym9keSlcbiAgICAgICB+QGZuc1xuICAgICAgIH5pZCkpKVxuKGluc3RhbGwtbWFjcm8hIDpkZWZwcm90b2NvbCAod2l0aC1tZXRhIGV4cGFuZC1kZWZwcm90b2NvbCB7OmltcGxpY2l0IFs6JmVudl19KSlcblxuKGRlZm4gZXhwYW5kLWRlZnR5cGVcbiAgW2lkIGZpZWxkcyAmIGZvcm1zXVxuICAobGV0IFt0eXBlLWluaXQgKG1hcCAoZm4gW2ZpZWxkXSBgKHNldCEgKGFnZXQgdGhpcyAnfmZpZWxkKSB+ZmllbGQpKVxuICAgICAgICAgICAgICAgICAgICAgICBmaWVsZHMpXG4gICAgICAgIGNvbnN0cnVjdG9yIChjb25qIHR5cGUtaW5pdCAndGhpcylcbiAgICAgICAgbWV0aG9kLWluaXQgKG1hcCAoZm4gW2ZpZWxkXSBgKGRlZiB+ZmllbGQgKGFnZXQgdGhpcyAnfmZpZWxkKSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgZmllbGRzKVxuICAgICAgICBtYWtlLW1ldGhvZCAoZm4gW3Byb3RvY29sIGZvcm1dXG4gICAgICAgICAgICAgICAgICAgICAgKGxldCBbbWV0aG9kLW5hbWUgKGZpcnN0IGZvcm0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zIChzZWNvbmQgZm9ybSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib2R5IChyZXN0IChyZXN0IGZvcm0pKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkLW5hbWUgKGlmICg9IChuYW1lIHByb3RvY29sKSBcIk9iamVjdFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgKHF1b3RlIH5tZXRob2QtbmFtZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYCguLW5hbWUgKGFnZXQgfnByb3RvY29sICd+bWV0aG9kLW5hbWUpKSldXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGAoc2V0ISAoYWdldCAoLi1wcm90b3R5cGUgfmlkKSB+ZmllbGQtbmFtZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZm4gfnBhcmFtcyB+QG1ldGhvZC1pbml0IH5AYm9keSkpKSlcbiAgICAgICAgc2F0aXNmeSAoZm4gW3Byb3RvY29sXVxuICAgICAgICAgICAgICAgICAgYChzZXQhIChhZ2V0ICguLXByb3RvdHlwZSB+aWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKC4td2lzcF9jb3JlJElQcm90b2NvbCRpZCB+cHJvdG9jb2wpKVxuICAgICAgICAgICAgICAgICAgICAgICAgIHRydWUpKVxuXG4gICAgICAgIGJvZHkgKHJlZHVjZSAoZm4gW3R5cGUgZm9ybV1cbiAgICAgICAgICAgICAgICAgICAgICAgKGlmIChsaXN0PyBmb3JtKVxuICAgICAgICAgICAgICAgICAgICAgICAgIChjb25qIHR5cGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7OmJvZHkgKGNvbmogKDpib2R5IHR5cGUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChtYWtlLW1ldGhvZCAoOnByb3RvY29sIHR5cGUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JtKSl9KVxuICAgICAgICAgICAgICAgICAgICAgICAgIChjb25qIHR5cGUgezpwcm90b2NvbCBmb3JtXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOmJvZHkgKGNvbmogKDpib2R5IHR5cGUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHNhdGlzZnkgZm9ybSkpfSkpKVxuXG4gICAgICAgICAgICAgICAgICAgICAgIHs6cHJvdG9jb2wgbmlsXG4gICAgICAgICAgICAgICAgICAgICAgICA6Ym9keSBbXX1cblxuICAgICAgICAgICAgICAgICAgICAgICBmb3JtcylcblxuICAgICAgICBtZXRob2RzICg6Ym9keSBib2R5KV1cbiAgICBgKGRlZiB+aWQgKGRvXG4gICAgICAgKGRlZm4tIH5pZCB+ZmllbGRzIH5AY29uc3RydWN0b3IpXG4gICAgICAgfkBtZXRob2RzXG4gICAgICAgfmlkKSkpKVxuKGluc3RhbGwtbWFjcm8hIDpkZWZ0eXBlIGV4cGFuZC1kZWZ0eXBlKVxuKGluc3RhbGwtbWFjcm8hIDpkZWZyZWNvcmQgZXhwYW5kLWRlZnR5cGUpXG5cbihkZWZuIGV4cGFuZC1leHRlbmQtdHlwZVxuICBbdHlwZSAmIGZvcm1zXVxuICAobGV0IFtkZWZhdWx0LXR5cGU/ICg9IHR5cGUgJ2RlZmF1bHQpXG4gICAgICAgIG5pbC10eXBlPyAobmlsPyB0eXBlKVxuXG4gICAgICAgIHR5cGUtbmFtZSAoY29uZCAobmlsPyB0eXBlKSAoc3ltYm9sIFwibmlsXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAoPSB0eXBlICdkZWZhdWx0KSAnX1xuICAgICAgICAgICAgICAgICAgICAgICAgKD0gdHlwZSAnbnVtYmVyKSAnTnVtYmVyXG4gICAgICAgICAgICAgICAgICAgICAgICAoPSB0eXBlICdzdHJpbmcpICdTdHJpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgICg9IHR5cGUgJ2Jvb2xlYW4pICdCb29sZWFuXG4gICAgICAgICAgICAgICAgICAgICAgICAoPSB0eXBlICd2ZWN0b3IpICdBcnJheVxuICAgICAgICAgICAgICAgICAgICAgICAgKD0gdHlwZSAnZnVuY3Rpb24pICdGdW5jdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgKD0gdHlwZSAncmUtcGF0dGVybikgJ1JlZ0V4cFxuICAgICAgICAgICAgICAgICAgICAgICAgKD0gKG5hbWVzcGFjZSB0eXBlKSBcImpzXCIpIHR5cGVcbiAgICAgICAgICAgICAgICAgICAgICAgIDplbHNlIG5pbClcblxuICAgICAgICBzYXRpc2Z5IChmbiBbcHJvdG9jb2xdXG4gICAgICAgICAgICAgICAgICAoaWYgdHlwZS1uYW1lXG4gICAgICAgICAgICAgICAgICAgIGAoc2V0ISAoYWdldCB+cHJvdG9jb2xcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd+KHN5bWJvbCAoc3RyIFwid2lzcF9jb3JlJElQcm90b2NvbCRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG5hbWUgdHlwZS1uYW1lKSkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ1ZSlcbiAgICAgICAgICAgICAgICAgICAgYChzZXQhIChhZ2V0ICguLXByb3RvdHlwZSB+dHlwZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICguLXdpc3BfY29yZSRJUHJvdG9jb2wkaWQgfnByb3RvY29sKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRydWUpKSlcblxuICAgICAgICBtYWtlLW1ldGhvZCAoZm4gW3Byb3RvY29sIGZvcm1dXG4gICAgICAgICAgICAgICAgICAgICAgKGxldCBbbWV0aG9kLW5hbWUgKGZpcnN0IGZvcm0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zIChzZWNvbmQgZm9ybSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib2R5IChyZXN0IChyZXN0IGZvcm0pKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldCAoaWYgdHlwZS1uYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYChhZ2V0IChhZ2V0IH5wcm90b2NvbCAnfm1ldGhvZC1uYW1lKSAnfnR5cGUtbmFtZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgKGFnZXQgKC4tcHJvdG90eXBlIH50eXBlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoLi1uYW1lIChhZ2V0IH5wcm90b2NvbCAnfm1ldGhvZC1uYW1lKSkpKV1cbiAgICAgICAgICAgICAgICAgICAgICAgIGAoc2V0ISB+dGFyZ2V0IChmbiB+cGFyYW1zIH5AYm9keSkpKSlcblxuICAgICAgICBib2R5IChyZWR1Y2UgKGZuIFtib2R5IGZvcm1dXG4gICAgICAgICAgICAgICAgICAgICAgIChpZiAobGlzdD8gZm9ybSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAoY29uaiBib2R5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgezptZXRob2RzIChjb25qICg6bWV0aG9kcyBib2R5KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAobWFrZS1tZXRob2QgKDpwcm90b2NvbCBib2R5KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9ybSkpfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAoY29uaiBib2R5IHs6cHJvdG9jb2wgZm9ybVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDptZXRob2RzIChjb25qICg6bWV0aG9kcyBib2R5KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChzYXRpc2Z5IGZvcm0pKX0pKSlcblxuICAgICAgICAgICAgICAgICAgICAgICB7OnByb3RvY29sIG5pbFxuICAgICAgICAgICAgICAgICAgICAgICAgOm1ldGhvZHMgW119XG5cbiAgICAgICAgICAgICAgICAgICAgICAgZm9ybXMpXG4gICAgICAgIG1ldGhvZHMgKDptZXRob2RzIGJvZHkpXVxuICAgIGAoZG8gfkBtZXRob2RzIG5pbCkpKVxuKGluc3RhbGwtbWFjcm8hIDpleHRlbmQtdHlwZSBleHBhbmQtZXh0ZW5kLXR5cGUpXG5cbihkZWZuIGV4cGFuZC1leHRlbmQtcHJvdG9jb2xcbiAgW3Byb3RvY29sICYgZm9ybXNdXG4gIChsZXQgW3NwZWNzIChyZWR1Y2UgKGZuIFtzcGVjcyBmb3JtXVxuICAgICAgICAgICAgICAgICAgICAgICAgKGlmIChsaXN0PyBmb3JtKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAoY29ucyB7OnR5cGUgKDp0eXBlIChmaXJzdCBzcGVjcykpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6bWV0aG9kcyAoY29uaiAoOm1ldGhvZHMgKGZpcnN0IHNwZWNzKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcm0pfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAocmVzdCBzcGVjcykpXG4gICAgICAgICAgICAgICAgICAgICAgICAgIChjb25zIHs6dHlwZSBmb3JtXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6bWV0aG9kcyBbXX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3BlY3MpKSlcbiAgICAgICAgICAgICAgICAgICAgICBuaWxcbiAgICAgICAgICAgICAgICAgICAgICBmb3JtcylcbiAgICAgICAgYm9keSAobWFwIChmbiBbZm9ybV1cbiAgICAgICAgICAgICAgICAgICAgYChleHRlbmQtdHlwZSB+KDp0eXBlIGZvcm0pXG4gICAgICAgICAgICAgICAgICAgICAgIH5wcm90b2NvbFxuICAgICAgICAgICAgICAgICAgICAgICB+QCg6bWV0aG9kcyBmb3JtKVxuICAgICAgICAgICAgICAgICAgICAgICApKVxuICAgICAgICAgICAgICAgICAgc3BlY3MpXVxuXG5cbiAgICBgKGRvIH5AYm9keSBuaWwpKSlcbihpbnN0YWxsLW1hY3JvISA6ZXh0ZW5kLXByb3RvY29sIGV4cGFuZC1leHRlbmQtcHJvdG9jb2wpXG5cbihkZWZuIGFzZXQtZXhwYW5kXG4gIChbdGFyZ2V0IGZpZWxkIHZhbHVlXVxuICAgYChzZXQhIChhZ2V0IH50YXJnZXQgfmZpZWxkKSB+dmFsdWUpKVxuICAoW3RhcmdldCBmaWVsZCBzdWItZmllbGQgJiBzdWItZmllbGRzJnZhbHVlXVxuICAgKGxldCBbcmVzb2x2ZWQtdGFyZ2V0IChyZWR1Y2UgKGZuIFtmb3JtIG5vZGVdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGAoYWdldCB+Zm9ybSB+bm9kZSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgKGFnZXQgfnRhcmdldCB+ZmllbGQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoY29ucyBzdWItZmllbGQgKGJ1dGxhc3Qgc3ViLWZpZWxkcyZ2YWx1ZSkpKVxuICAgICAgICAgdmFsdWUgKGxhc3Qgc3ViLWZpZWxkcyZ2YWx1ZSldXG4gICAgIGAoc2V0ISB+cmVzb2x2ZWQtdGFyZ2V0IH52YWx1ZSkpKSlcbihpbnN0YWxsLW1hY3JvISA6YXNldCBhc2V0LWV4cGFuZClcblxuKGRlZm4gYWxlbmd0aC1leHBhbmRcbiAgXCJSZXR1cm5zIHRoZSBsZW5ndGggb2YgdGhlIGFycmF5LiBXb3JrcyBvbiBhcnJheXMgb2YgYWxsIHR5cGVzLlwiXG4gIFthcnJheV1cbiAgYCguLWxlbmd0aCB+YXJyYXkpKVxuKGluc3RhbGwtbWFjcm8hIDphbGVuZ3RoIGFsZW5ndGgtZXhwYW5kKVxuXG4iXX0=
