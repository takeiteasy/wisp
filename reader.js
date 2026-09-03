{
    var _ns_ = {
        id: 'wisp.reader',
        doc: 'Reader module provides functions for reading text input\n  as wisp data structures'
    };
    var wisp_sequence = require('./sequence');
    var list = wisp_sequence.list;
    var isList = wisp_sequence.isList;
    var count = wisp_sequence.count;
    var isEmpty = wisp_sequence.isEmpty;
    var first = wisp_sequence.first;
    var second = wisp_sequence.second;
    var third = wisp_sequence.third;
    var rest = wisp_sequence.rest;
    var map = wisp_sequence.map;
    var vec = wisp_sequence.vec;
    var cons = wisp_sequence.cons;
    var conj = wisp_sequence.conj;
    var rest = wisp_sequence.rest;
    var concat = wisp_sequence.concat;
    var last = wisp_sequence.last;
    var butlast = wisp_sequence.butlast;
    var sort = wisp_sequence.sort;
    var reduce = wisp_sequence.reduce;
    var set = wisp_sequence.set;
    var wisp_runtime = require('./runtime');
    var isOdd = wisp_runtime.isOdd;
    var dictionary = wisp_runtime.dictionary;
    var keys = wisp_runtime.keys;
    var isNil = wisp_runtime.isNil;
    var inc = wisp_runtime.inc;
    var dec = wisp_runtime.dec;
    var isVector = wisp_runtime.isVector;
    var isString = wisp_runtime.isString;
    var isNumber = wisp_runtime.isNumber;
    var isBoolean = wisp_runtime.isBoolean;
    var isObject = wisp_runtime.isObject;
    var isDictionary = wisp_runtime.isDictionary;
    var rePattern = wisp_runtime.rePattern;
    var reMatches = wisp_runtime.reMatches;
    var reFind = wisp_runtime.reFind;
    var str = wisp_runtime.str;
    var subs = wisp_runtime.subs;
    var char = wisp_runtime.char;
    var vals = wisp_runtime.vals;
    var isEqual = wisp_runtime.isEqual;
    var wisp_ast = require('./ast');
    var isSymbol = wisp_ast.isSymbol;
    var symbol = wisp_ast.symbol;
    var isKeyword = wisp_ast.isKeyword;
    var keyword = wisp_ast.keyword;
    var meta = wisp_ast.meta;
    var withMeta = wisp_ast.withMeta;
    var name = wisp_ast.name;
    var gensym = wisp_ast.gensym;
    var wisp_string = require('./string');
    var split = wisp_string.split;
    var join = wisp_string.join;
}
var pushBackReader = exports.pushBackReader = function pushBackReader(source, uri) {
    return {
        'lines': split(source, '\n'),
        'buffer': '',
        'uri': uri,
        'column': -1,
        'line': 0
    };
};
var peekChar = exports.peekChar = function peekChar(reader) {
    return function () {
        var lineø1 = (reader || 0)['lines'][(reader || 0)['line']];
        var columnø1 = inc((reader || 0)['column']);
        return isNil(lineø1) ? null : lineø1[columnø1] || '\n';
    }.call(this);
};
var readChar = exports.readChar = function readChar(reader) {
    return function () {
        var chø1 = peekChar(reader);
        isNewline(peekChar(reader)) ? (function () {
            (reader || 0)['line'] = inc((reader || 0)['line']);
            return (reader || 0)['column'] = -1;
        })() : (reader || 0)['column'] = inc((reader || 0)['column']);
        return chø1;
    }.call(this);
};
var isNewline = exports.isNewline = function isNewline(ch) {
    return '\n' === ch;
};
var isBreakingWhitespace = exports.isBreakingWhitespace = function isBreakingWhitespace(ch) {
    return ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r';
};
var isWhitespace = exports.isWhitespace = function isWhitespace(ch) {
    return isBreakingWhitespace(ch);
};
var isNumeric = exports.isNumeric = function isNumeric(ch) {
    return ch === '0' || ch === '1' || ch === '2' || ch === '3' || ch === '4' || ch === '5' || ch === '6' || ch === '7' || ch === '8' || ch === '9';
};
var isCommentPrefix = exports.isCommentPrefix = function isCommentPrefix(ch) {
    return ';' === ch;
};
var isNumberLiteral = exports.isNumberLiteral = function isNumberLiteral(reader, initch) {
    return isNumeric(initch) || ('+' === initch || '-' === initch) && isNumeric(peekChar(reader));
};
var readerError = exports.readerError = function readerError(reader, message) {
    return function () {
        var textø1 = '' + message + '\n' + 'line:' + (reader || 0)['line'] + '\n' + 'column:' + (reader || 0)['column'];
        var errorø1 = SyntaxError(textø1, (reader || 0)['uri']);
        errorø1.line = (reader || 0)['line'];
        errorø1.column = (reader || 0)['column'];
        errorø1.uri = (reader || 0)['uri'];
        return (function () {
            throw errorø1;
        })();
    }.call(this);
};
var isMacroTerminating = exports.isMacroTerminating = function isMacroTerminating(ch) {
    return !(ch === '#') && !(ch === '\'') && !(ch === ':') && macros(ch);
};
var readToken = exports.readToken = function readToken(reader, initch) {
    return function loop() {
        var recur = loop;
        var bufferø1 = initch;
        var chø1 = peekChar(reader);
        do {
            recur = isNil(chø1) || isWhitespace(chø1) || isMacroTerminating(chø1) ? bufferø1 : (loop[0] = '' + bufferø1 + readChar(reader), loop[1] = peekChar(reader), loop);
        } while (bufferø1 = loop[0], chø1 = loop[1], recur === loop);
        return recur;
    }.call(this);
};
var skipLine = exports.skipLine = function skipLine(reader, _) {
    return function loop() {
        var recur = loop;
        do {
            recur = function () {
                var chø1 = readChar(reader);
                return chø1 === '\n' || chø1 === '\r' || isNil(chø1) ? reader : (loop);
            }.call(this);
        } while (recur === loop);
        return recur;
    }.call(this);
};
var intPattern = exports.intPattern = rePattern('^([-+]?)(?:(0)|([1-9][0-9]*)|0[xX]([0-9A-Fa-f]+)|0([0-7]+)|([1-9][0-9]?)[rR]([0-9A-Za-z]+)|0[0-9]+)(N)?$');
var ratioPattern = exports.ratioPattern = rePattern('([-+]?[0-9]+)/([0-9]+)');
var floatPattern = exports.floatPattern = rePattern('([-+]?[0-9]+(\\.[0-9]*)?([eE][-+]?[0-9]+)?)(M)?');
var matchInt = exports.matchInt = function matchInt(s) {
    return function () {
        var groupsø1 = reFind(intPattern, s);
        var group3ø1 = groupsø1[2];
        return !(isNil(group3ø1) || count(group3ø1) < 1) ? 0 : function () {
            var negateø1 = '-' === groupsø1[1] ? -1 : 1;
            var aø1 = groupsø1[3] ? (function () {
                return [
                    groupsø1[3],
                    10
                ];
            })() : groupsø1[4] ? (function () {
                return [
                    groupsø1[4],
                    16
                ];
            })() : groupsø1[5] ? (function () {
                return [
                    groupsø1[5],
                    8
                ];
            })() : groupsø1[7] ? (function () {
                return [
                    groupsø1[7],
                    parseInt(groupsø1[7])
                ];
            })() : (function () {
                return [
                    null,
                    null
                ];
            })();
            var nø1 = aø1[0];
            var radixø1 = aø1[1];
            return isNil(nø1) ? null : negateø1 * parseInt(nø1, radixø1);
        }.call(this);
    }.call(this);
};
var matchRatio = exports.matchRatio = function matchRatio(s) {
    return function () {
        var groupsø1 = reFind(ratioPattern, s);
        var numinatorø1 = groupsø1[1];
        var denominatorø1 = groupsø1[2];
        return parseInt(numinatorø1) / parseInt(denominatorø1);
    }.call(this);
};
var matchFloat = exports.matchFloat = function matchFloat(s) {
    return parseFloat(s);
};
var matchNumber = exports.matchNumber = function matchNumber(s) {
    return reMatches(intPattern, s) ? (function () {
        return matchInt(s);
    })() : reMatches(ratioPattern, s) ? (function () {
        return matchRatio(s);
    })() : reMatches(floatPattern, s) ? (function () {
        return matchFloat(s);
    })() : null;
};
var escapeCharMap = exports.escapeCharMap = function escapeCharMap(c) {
    return c === 't' ? (function () {
        return '\t';
    })() : c === 'r' ? (function () {
        return '\r';
    })() : c === 'n' ? (function () {
        return '\n';
    })() : c === '\\' ? (function () {
        return '\\';
    })() : c === '"' ? (function () {
        return '"';
    })() : c === 'b' ? (function () {
        return '\b';
    })() : c === 'f' ? (function () {
        return '\f';
    })() : (function () {
        return null;
    })();
};
var read2Chars = exports.read2Chars = function read2Chars(reader) {
    return '' + readChar(reader) + readChar(reader);
};
var read4Chars = exports.read4Chars = function read4Chars(reader) {
    return '' + readChar(reader) + readChar(reader) + readChar(reader) + readChar(reader);
};
var unicode2Pattern = exports.unicode2Pattern = rePattern('[0-9A-Fa-f]{2}');
var unicode4Pattern = exports.unicode4Pattern = rePattern('[0-9A-Fa-f]{4}');
var validateUnicodeEscape = exports.validateUnicodeEscape = function validateUnicodeEscape(unicodePattern, reader, escapeChar, unicodeStr) {
    return reMatches(unicodePattern, unicodeStr) ? unicodeStr : readerError(reader, '' + 'Unexpected unicode escape ' + '\\' + escapeChar + unicodeStr);
};
var makeUnicodeChar = exports.makeUnicodeChar = function makeUnicodeChar(codeStr, base) {
    return function () {
        var baseø2 = base || 16;
        var codeø1 = parseInt(codeStr, baseø2);
        return char(codeø1);
    }.call(this);
};
var escapeChar = exports.escapeChar = function escapeChar(buffer, reader) {
    return function () {
        var chø1 = readChar(reader);
        var mapresultø1 = escapeCharMap(chø1);
        return mapresultø1 ? mapresultø1 : chø1 === 'x' ? (function () {
            return makeUnicodeChar(validateUnicodeEscape(unicode2Pattern, reader, chø1, read2Chars(reader)));
        })() : chø1 === 'u' ? (function () {
            return makeUnicodeChar(validateUnicodeEscape(unicode4Pattern, reader, chø1, read4Chars(reader)));
        })() : isNumeric(chø1) ? (function () {
            return char(chø1);
        })() : (function () {
            return readerError(reader, '' + 'Unexpected unicode escape ' + '\\' + chø1);
        })();
    }.call(this);
};
var readPast = exports.readPast = function readPast(predicate, reader) {
    return function loop() {
        var recur = loop;
        var _ø1 = null;
        do {
            recur = predicate(peekChar(reader)) ? (loop[0] = readChar(reader), loop) : peekChar(reader);
        } while (_ø1 = loop[0], recur === loop);
        return recur;
    }.call(this);
};
var readDelimitedList = exports.readDelimitedList = function readDelimitedList(delim, reader, isRecursive) {
    return function loop() {
        var recur = loop;
        var formsø1 = [];
        do {
            recur = function () {
                var _ø1 = readPast(isWhitespace, reader);
                var chø1 = readChar(reader);
                !chø1 ? readerError(reader, 'EOF') : null;
                return delim === chø1 ? formsø1 : function () {
                    var formø1 = readForm(reader, chø1);
                    return loop[0] = formø1 === reader ? formsø1 : conj(formsø1, formø1), loop;
                }.call(this);
            }.call(this);
        } while (formsø1 = loop[0], recur === loop);
        return recur;
    }.call(this);
};
var notImplemented = exports.notImplemented = function notImplemented(reader, ch) {
    return readerError(reader, '' + 'Reader for ' + ch + ' not implemented yet');
};
var readDispatch = exports.readDispatch = function readDispatch(reader, _) {
    return function () {
        var chø1 = readChar(reader);
        var dmø1 = dispatchMacros(chø1);
        return dmø1 ? dmø1(reader, _) : function () {
            var objectø1 = maybeReadTaggedType(reader, chø1);
            return objectø1 ? objectø1 : readerError(reader, 'No dispatch macro for ', chø1);
        }.call(this);
    }.call(this);
};
var readUnmatchedDelimiter = exports.readUnmatchedDelimiter = function readUnmatchedDelimiter(rdr, ch) {
    return readerError(rdr, 'Unmatched delimiter ', ch);
};
var readList = exports.readList = function readList(reader, _) {
    return function () {
        var formø1 = readDelimitedList(')', reader, true);
        return withMeta(list.apply(null, formø1), meta(formø1));
    }.call(this);
};
var readComment = exports.readComment = function readComment(reader, _) {
    return function loop() {
        var recur = loop;
        var bufferø1 = '';
        var chø1 = readChar(reader);
        do {
            recur = isNil(chø1) || '\n' === chø1 ? (function () {
                return reader || list(symbol(null, 'comment'), bufferø1);
            })() : '\\' === chø1 ? (function () {
                return loop[0] = '' + bufferø1 + escapeChar(bufferø1, reader), loop[1] = readChar(reader), loop;
            })() : (function () {
                return loop[0] = '' + bufferø1 + chø1, loop[1] = readChar(reader), loop;
            })();
        } while (bufferø1 = loop[0], chø1 = loop[1], recur === loop);
        return recur;
    }.call(this);
};
var readVector = exports.readVector = function readVector(reader) {
    return readDelimitedList(']', reader, true);
};
var readMap = exports.readMap = function readMap(reader) {
    return function () {
        var formø1 = readDelimitedList('}', reader, true);
        return isOdd(count(formø1)) ? readerError(reader, 'Map literal must contain an even number of forms') : withMeta(dictionary.apply(null, formø1), meta(formø1));
    }.call(this);
};
var readSet = exports.readSet = function readSet(reader, _) {
    return function () {
        var formø1 = readDelimitedList('}', reader, true);
        return withMeta(concat([symbol(null, 'set')], formø1), meta(formø1));
    }.call(this);
};
var readNumber = exports.readNumber = function readNumber(reader, initch) {
    return function loop() {
        var recur = loop;
        var bufferø1 = initch;
        var chø1 = peekChar(reader);
        do {
            recur = isNil(chø1) || isWhitespace(chø1) || macros(chø1) ? function () {
                var matchø1 = matchNumber(bufferø1);
                return isNil(matchø1) ? readerError(reader, 'Invalid number format [', bufferø1, ']') : new Number(matchø1);
            }.call(this) : (loop[0] = '' + bufferø1 + readChar(reader), loop[1] = peekChar(reader), loop);
        } while (bufferø1 = loop[0], chø1 = loop[1], recur === loop);
        return recur;
    }.call(this);
};
var readString = exports.readString = function readString(reader) {
    return function loop() {
        var recur = loop;
        var bufferø1 = '';
        var chø1 = readChar(reader);
        do {
            recur = isNil(chø1) ? (function () {
                return readerError(reader, 'EOF while reading string');
            })() : '\\' === chø1 ? (function () {
                return loop[0] = '' + bufferø1 + escapeChar(bufferø1, reader), loop[1] = readChar(reader), loop;
            })() : '"' === chø1 ? (function () {
                return new String(bufferø1);
            })() : (function () {
                return loop[0] = '' + bufferø1 + chø1, loop[1] = readChar(reader), loop;
            })();
        } while (bufferø1 = loop[0], chø1 = loop[1], recur === loop);
        return recur;
    }.call(this);
};
var readCharacter = exports.readCharacter = function readCharacter(reader) {
    return new String(readChar(reader));
};
var readUnquote = exports.readUnquote = function readUnquote(reader) {
    return function () {
        var chø1 = peekChar(reader);
        return !chø1 ? readerError(reader, 'EOF while reading character') : chø1 === '@' ? (function () {
            readChar(reader);
            return list(symbol(null, 'unquote-splicing'), read(reader, true, null, true));
        })() : list(symbol(null, 'unquote'), read(reader, true, null, true));
    }.call(this);
};
var specialSymbols = exports.specialSymbols = function specialSymbols(text, notFound) {
    return text === 'nil' ? (function () {
        return null;
    })() : text === 'true' ? (function () {
        return true;
    })() : text === 'false' ? (function () {
        return false;
    })() : (function () {
        return notFound;
    })();
};
var readSymbol = exports.readSymbol = function readSymbol(reader, initch) {
    return function () {
        var tokenø1 = readToken(reader, initch);
        var partsø1 = split(tokenø1, '/');
        var hasNsø1 = count(partsø1) > 1 && count(tokenø1) > 1;
        var nsø1 = first(partsø1);
        var nameø1 = join('/', rest(partsø1));
        return hasNsø1 ? symbol(nsø1, nameø1) : specialSymbols(tokenø1, symbol(tokenø1));
    }.call(this);
};
var readKeyword = exports.readKeyword = function readKeyword(reader, initch) {
    return function () {
        var tokenø1 = readToken(reader, readChar(reader));
        var partsø1 = split(tokenø1, '/');
        var nameø1 = last(partsø1);
        var nsø1 = count(partsø1) > 1 ? join('/', butlast(partsø1)) : null;
        var issueø1 = last(nsø1) === ':' ? (function () {
            return 'namespace can\'t ends with ":"';
        })() : last(nameø1) === ':' ? (function () {
            return 'name can\'t end with ":"';
        })() : last(nameø1) === '/' ? (function () {
            return 'name can\'t end with "/"';
        })() : count(split(tokenø1, '::')) > 1 ? (function () {
            return 'name can\'t contain "::"';
        })() : null;
        return issueø1 ? readerError(reader, 'Invalid token (', issueø1, '): ', tokenø1) : !nsø1 && first(nameø1) === ':' ? keyword(rest(nameø1)) : keyword(nsø1, nameø1);
    }.call(this);
};
var wrappingReader = exports.wrappingReader = function wrappingReader(prefix) {
    return function (reader) {
        return list(prefix, read(reader, true, null, true));
    };
};
var throwingReader = exports.throwingReader = function throwingReader(msg) {
    return function (reader) {
        return readerError(reader, msg);
    };
};
var readRegex = exports.readRegex = function readRegex(reader) {
    return function loop() {
        var recur = loop;
        var bufferø1 = '';
        var chø1 = readChar(reader);
        do {
            recur = isNil(chø1) ? (function () {
                return readerError(reader, 'EOF while reading string');
            })() : '\\' === chø1 ? (function () {
                return loop[0] = '' + bufferø1 + chø1 + readChar(reader), loop[1] = readChar(reader), loop;
            })() : '"' === chø1 ? (function () {
                return rePattern(bufferø1);
            })() : (function () {
                return loop[0] = '' + bufferø1 + chø1, loop[1] = readChar(reader), loop;
            })();
        } while (bufferø1 = loop[0], chø1 = loop[1], recur === loop);
        return recur;
    }.call(this);
};
var readDiscard = exports.readDiscard = function readDiscard(reader, _) {
    read(reader, true, null, true);
    return reader;
};
var macros = exports.macros = function macros(c) {
    return c === '"' ? (function () {
        return readString;
    })() : c === '\\' ? (function () {
        return readCharacter;
    })() : c === ':' ? (function () {
        return readKeyword;
    })() : c === ';' ? (function () {
        return readComment;
    })() : c === '\'' ? (function () {
        return wrappingReader(symbol(null, 'quote'));
    })() : c === '@' ? (function () {
        return wrappingReader(symbol(null, 'deref'));
    })() : c === '`' ? (function () {
        return wrappingReader(symbol(null, 'syntax-quote'));
    })() : c === ',' ? (function () {
        return readUnquote;
    })() : c === '(' ? (function () {
        return readList;
    })() : c === ')' ? (function () {
        return readUnmatchedDelimiter;
    })() : c === '[' ? (function () {
        return readVector;
    })() : c === ']' ? (function () {
        return readUnmatchedDelimiter;
    })() : c === '{' ? (function () {
        return readMap;
    })() : c === '}' ? (function () {
        return readUnmatchedDelimiter;
    })() : c === '#' ? (function () {
        return readDispatch;
    })() : (function () {
        return null;
    })();
};
var dispatchMacros = exports.dispatchMacros = function dispatchMacros(s) {
    return s === '{' ? (function () {
        return readSet;
    })() : s === '<' ? (function () {
        return throwingReader('Unreadable form');
    })() : s === '"' ? (function () {
        return readRegex;
    })() : s === '!' ? (function () {
        return readComment;
    })() : s === '_' ? (function () {
        return readDiscard;
    })() : (function () {
        return null;
    })();
};
var readForm = exports.readForm = function readForm(reader, ch) {
    return function () {
        var startø1 = {
            'line': (reader || 0)['line'],
            'column': (reader || 0)['column']
        };
        var readMacroø1 = macros(ch);
        var formø1 = readMacroø1 ? (function () {
            return readMacroø1(reader, ch);
        })() : isNumberLiteral(reader, ch) ? (function () {
            return readNumber(reader, ch);
        })() : (function () {
            return readSymbol(reader, ch);
        })();
        var endø1 = {
            'line': (reader || 0)['line'],
            'column': inc((reader || 0)['column'])
        };
        var locationø1 = {
            'uri': (reader || 0)['uri'],
            'start': startø1,
            'end': endø1
        };
        return formø1 === reader ? (function () {
            return formø1;
        })() : !(isBoolean(formø1) || isNil(formø1) || isKeyword(formø1)) ? (function () {
            return withMeta(formø1, conj(locationø1, meta(formø1)));
        })() : (function () {
            return formø1;
        })();
    }.call(this);
};
var read = exports.read = function read(reader, eofIsError, sentinel, isRecursive) {
    return function loop() {
        var recur = loop;
        do {
            recur = function () {
                var chø1 = readChar(reader);
                var formø1 = isNil(chø1) ? (function () {
                    return eofIsError ? readerError(reader, 'EOF') : sentinel;
                })() : isWhitespace(chø1) ? (function () {
                    return reader;
                })() : isCommentPrefix(chø1) ? (function () {
                    return read(readComment(reader, chø1), eofIsError, sentinel, isRecursive);
                })() : (function () {
                    return readForm(reader, chø1);
                })();
                return formø1 === reader ? (loop) : formø1;
            }.call(this);
        } while (recur === loop);
        return recur;
    }.call(this);
};
var read_ = exports.read_ = function read_(source, uri) {
    return function () {
        var readerø1 = pushBackReader(source, uri);
        var eofø1 = gensym();
        return function loop() {
            var recur = loop;
            var formsø1 = [];
            var formø1 = read(readerø1, false, eofø1, false);
            do {
                recur = formø1 === eofø1 ? formsø1 : (loop[0] = conj(formsø1, formø1), loop[1] = read(readerø1, false, eofø1, false), loop);
            } while (formsø1 = loop[0], formø1 = loop[1], recur === loop);
            return recur;
        }.call(this);
    }.call(this);
};
var readFromString = exports.readFromString = function readFromString(source, uri) {
    return function () {
        var readerø1 = pushBackReader(source, uri);
        return read(readerø1, true, null, false);
    }.call(this);
};
var readUuid = function readUuid(uuid) {
    return isString(uuid) ? list.apply(null, [symbol(null, 'UUID.')].concat([uuid])) : readerError(null, 'UUID literal expects a string as its representation.');
};
var readQueue = function readQueue(items) {
    return isVector(items) ? list.apply(null, [symbol(null, 'PersistentQueue.')].concat([items])) : readerError(null, 'Queue literal expects a vector for its elements.');
};
var readDate = function readDate(date) {
    return isString(date) ? list.apply(null, [symbol(null, 'Date.')].concat([date])) : readerError(null, 'Date literal expects a string as its representation.');
};
var __tagTable__ = exports.__tagTable__ = dictionary('uuid', readUuid, 'queue', readQueue, 'inst', readDate);
var maybeReadTaggedType = exports.maybeReadTaggedType = function maybeReadTaggedType(reader, initch) {
    return function () {
        var tagø1 = readSymbol(reader, initch);
        var pfnø1 = (__tagTable__ || 0)[name(tagø1)];
        return pfnø1 ? pfnø1(read(reader, true, null, false)) : readerError(reader, '' + 'Could not find tag parser for ' + name(tagø1) + ' in ' + ('' + keys(__tagTable__)));
    }.call(this);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndpc3AvcmVhZGVyLndpc3AiXSwibmFtZXMiOlsiX25zXyIsImlkIiwiZG9jIiwibGlzdCIsImlzTGlzdCIsImNvdW50IiwiaXNFbXB0eSIsImZpcnN0Iiwic2Vjb25kIiwidGhpcmQiLCJyZXN0IiwibWFwIiwidmVjIiwiY29ucyIsImNvbmoiLCJjb25jYXQiLCJsYXN0IiwiYnV0bGFzdCIsInNvcnQiLCJyZWR1Y2UiLCJzZXQiLCJpc09kZCIsImRpY3Rpb25hcnkiLCJrZXlzIiwiaXNOaWwiLCJpbmMiLCJkZWMiLCJpc1ZlY3RvciIsImlzU3RyaW5nIiwiaXNOdW1iZXIiLCJpc0Jvb2xlYW4iLCJpc09iamVjdCIsImlzRGljdGlvbmFyeSIsInJlUGF0dGVybiIsInJlTWF0Y2hlcyIsInJlRmluZCIsInN0ciIsInN1YnMiLCJjaGFyIiwidmFscyIsImlzRXF1YWwiLCJpc1N5bWJvbCIsInN5bWJvbCIsImlzS2V5d29yZCIsImtleXdvcmQiLCJtZXRhIiwid2l0aE1ldGEiLCJuYW1lIiwiZ2Vuc3ltIiwic3BsaXQiLCJqb2luIiwicHVzaEJhY2tSZWFkZXIiLCJleHBvcnRzIiwic291cmNlIiwidXJpIiwicGVla0NoYXIiLCJyZWFkZXIiLCJsaW5lw7gxIiwiY29sdW1uw7gxIiwicmVhZENoYXIiLCJjaMO4MSIsImlzTmV3bGluZSIsImNoIiwiaXNCcmVha2luZ1doaXRlc3BhY2UiLCJpc1doaXRlc3BhY2UiLCJpc051bWVyaWMiLCJpc0NvbW1lbnRQcmVmaXgiLCJpc051bWJlckxpdGVyYWwiLCJpbml0Y2giLCJyZWFkZXJFcnJvciIsIm1lc3NhZ2UiLCJ0ZXh0w7gxIiwiZXJyb3LDuDEiLCJTeW50YXhFcnJvciIsImxpbmUiLCJjb2x1bW4iLCJpc01hY3JvVGVybWluYXRpbmciLCJtYWNyb3MiLCJyZWFkVG9rZW4iLCJidWZmZXLDuDEiLCJza2lwTGluZSIsIl8iLCJpbnRQYXR0ZXJuIiwicmF0aW9QYXR0ZXJuIiwiZmxvYXRQYXR0ZXJuIiwibWF0Y2hJbnQiLCJzIiwiZ3JvdXBzw7gxIiwiZ3JvdXAzw7gxIiwibmVnYXRlw7gxIiwiYcO4MSIsInBhcnNlSW50IiwibsO4MSIsInJhZGl4w7gxIiwibWF0Y2hSYXRpbyIsIm51bWluYXRvcsO4MSIsImRlbm9taW5hdG9yw7gxIiwibWF0Y2hGbG9hdCIsInBhcnNlRmxvYXQiLCJtYXRjaE51bWJlciIsImVzY2FwZUNoYXJNYXAiLCJjIiwicmVhZDJDaGFycyIsInJlYWQ0Q2hhcnMiLCJ1bmljb2RlMlBhdHRlcm4iLCJ1bmljb2RlNFBhdHRlcm4iLCJ2YWxpZGF0ZVVuaWNvZGVFc2NhcGUiLCJ1bmljb2RlUGF0dGVybiIsImVzY2FwZUNoYXIiLCJ1bmljb2RlU3RyIiwibWFrZVVuaWNvZGVDaGFyIiwiY29kZVN0ciIsImJhc2UiLCJiYXNlw7gyIiwiY29kZcO4MSIsImJ1ZmZlciIsIm1hcHJlc3VsdMO4MSIsInJlYWRQYXN0IiwicHJlZGljYXRlIiwiX8O4MSIsInJlYWREZWxpbWl0ZWRMaXN0IiwiZGVsaW0iLCJpc1JlY3Vyc2l2ZSIsImZvcm1zw7gxIiwiZm9ybcO4MSIsInJlYWRGb3JtIiwibm90SW1wbGVtZW50ZWQiLCJyZWFkRGlzcGF0Y2giLCJkbcO4MSIsImRpc3BhdGNoTWFjcm9zIiwib2JqZWN0w7gxIiwibWF5YmVSZWFkVGFnZ2VkVHlwZSIsInJlYWRVbm1hdGNoZWREZWxpbWl0ZXIiLCJyZHIiLCJyZWFkTGlzdCIsInJlYWRDb21tZW50IiwicmVhZFZlY3RvciIsInJlYWRNYXAiLCJyZWFkU2V0IiwicmVhZE51bWJlciIsIm1hdGNow7gxIiwicmVhZFN0cmluZyIsInJlYWRDaGFyYWN0ZXIiLCJyZWFkVW5xdW90ZSIsInJlYWQiLCJzcGVjaWFsU3ltYm9scyIsInRleHQiLCJub3RGb3VuZCIsInJlYWRTeW1ib2wiLCJ0b2tlbsO4MSIsInBhcnRzw7gxIiwiaGFzTnPDuDEiLCJuc8O4MSIsIm5hbWXDuDEiLCJyZWFkS2V5d29yZCIsImlzc3Vlw7gxIiwid3JhcHBpbmdSZWFkZXIiLCJwcmVmaXgiLCJ0aHJvd2luZ1JlYWRlciIsIm1zZyIsInJlYWRSZWdleCIsInJlYWREaXNjYXJkIiwic3RhcnTDuDEiLCJyZWFkTWFjcm/DuDEiLCJlbmTDuDEiLCJsb2NhdGlvbsO4MSIsImVvZklzRXJyb3IiLCJzZW50aW5lbCIsInJlYWRfIiwicmVhZGVyw7gxIiwiZW9mw7gxIiwicmVhZEZyb21TdHJpbmciLCJyZWFkVXVpZCIsInV1aWQiLCJyZWFkUXVldWUiLCJpdGVtcyIsInJlYWREYXRlIiwiZGF0ZSIsIl9fdGFnVGFibGVfXyIsInRhZ8O4MSIsInBmbsO4MSJdLCJtYXBwaW5ncyI6IjtJQUFBLElBQUNBLEksR0FBRDtBQUFBLFFBQUFDLEUsRUFBSSxhQUFKO0FBQUEsUUFBQUMsRyxFQUNFLG9GQURGO0FBQUEsTTs7UUFHbUNDLElBQUEsRyxjQUFBQSxJO1FBQUtDLE1BQUEsRyxjQUFBQSxNO1FBQU1DLEtBQUEsRyxjQUFBQSxLO1FBQU1DLE9BQUEsRyxjQUFBQSxPO1FBQU9DLEtBQUEsRyxjQUFBQSxLO1FBQU1DLE1BQUEsRyxjQUFBQSxNO1FBQU9DLEtBQUEsRyxjQUFBQSxLO1FBQ3JDQyxJQUFBLEcsY0FBQUEsSTtRQUFLQyxHQUFBLEcsY0FBQUEsRztRQUFJQyxHQUFBLEcsY0FBQUEsRztRQUFJQyxJQUFBLEcsY0FBQUEsSTtRQUFLQyxJQUFBLEcsY0FBQUEsSTtRQUFLSixJQUFBLEcsY0FBQUEsSTtRQUFLSyxNQUFBLEcsY0FBQUEsTTtRQUFPQyxJQUFBLEcsY0FBQUEsSTtRQUNuQ0MsT0FBQSxHLGNBQUFBLE87UUFBUUMsSUFBQSxHLGNBQUFBLEk7UUFBS0MsTUFBQSxHLGNBQUFBLE07UUFBT0MsR0FBQSxHLGNBQUFBLEc7O1FBQ3JCQyxLQUFBLEcsYUFBQUEsSztRQUFLQyxVQUFBLEcsYUFBQUEsVTtRQUFXQyxJQUFBLEcsYUFBQUEsSTtRQUFLQyxLQUFBLEcsYUFBQUEsSztRQUFLQyxHQUFBLEcsYUFBQUEsRztRQUFJQyxHQUFBLEcsYUFBQUEsRztRQUFJQyxRQUFBLEcsYUFBQUEsUTtRQUFR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Rk07QUFBQSxLLEtBQVIsQyxJQUFBO0FBQUEsQ0FGRiIsInNvdXJjZXNDb250ZW50IjpbIihucyB3aXNwLnJlYWRlclxuICBcIlJlYWRlciBtb2R1bGUgcHJvdmlkZXMgZnVuY3Rpb25zIGZvciByZWFkaW5nIHRleHQgaW5wdXRcbiAgYXMgd2lzcCBkYXRhIHN0cnVjdHVyZXNcIlxuICAoOnJlcXVpcmUgW3dpc3Auc2VxdWVuY2UgOnJlZmVyIFtsaXN0IGxpc3Q/IGNvdW50IGVtcHR5PyBmaXJzdCBzZWNvbmQgdGhpcmRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdCBtYXAgdmVjIGNvbnMgY29uaiByZXN0IGNvbmNhdCBsYXN0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1dGxhc3Qgc29ydCByZWR1Y2Ugc2V0XV1cbiAgICAgICAgICAgIFt3aXNwLnJ1bnRpbWUgOnJlZmVyIFtvZGQ/IGRpY3Rpb25hcnkga2V5cyBuaWw/IGluYyBkZWMgdmVjdG9yPyBzdHJpbmc/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVtYmVyPyBib29sZWFuPyBvYmplY3Q/IGRpY3Rpb25hcnk/IHJlLXBhdHRlcm5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZS1tYXRjaGVzIHJlLWZpbmQgc3RyIHN1YnMgY2hhciB2YWxzID1dXVxuICAgICAgICAgICAgW3dpc3AuYXN0IDpyZWZlciBbc3ltYm9sPyBzeW1ib2wga2V5d29yZD8ga2V5d29yZCBtZXRhIHdpdGgtbWV0YSBuYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZW5zeW1dXVxuICAgICAgICAgICAgW3dpc3Auc3RyaW5nIDpyZWZlciBbc3BsaXQgam9pbl1dKSlcblxuKGRlZnVuIHB1c2gtYmFjay1yZWFkZXJcbiAgKHNvdXJjZSB1cmkpXG4gIFwiQ3JlYXRlcyBhIFN0cmluZ1B1c2hiYWNrUmVhZGVyIGZyb20gYSBnaXZlbiBzdHJpbmdcIlxuICB7OmxpbmVzIChzcGxpdCBzb3VyY2UgXCJcXG5cIikgOmJ1ZmZlciBcIlwiXG4gICA6dXJpIHVyaVxuICAgOmNvbHVtbiAtMSA6bGluZSAwfSlcblxuKGRlZnVuIHBlZWstY2hhclxuICAocmVhZGVyKVxuICBcIlJldHVybnMgbmV4dCBjaGFyIGZyb20gdGhlIFJlYWRlciB3aXRob3V0IHJlYWRpbmcgaXQuXG4gIG5pbCBpZiB0aGUgZW5kIG9mIHN0cmVhbSBoYXMgYmVpbmcgcmVhY2hlZC5cIlxuICAobGV0KiAoKGxpbmUgKGFnZXQgKDpsaW5lcyByZWFkZXIpXG4gICAgICAgICAgICAgICAgICAgKDpsaW5lIHJlYWRlcikpKVxuICAgICAgICAoY29sdW1uIChpbmMgKDpjb2x1bW4gcmVhZGVyKSkpKVxuICAgIChpZiAobmlsPyBsaW5lKVxuICAgICAgbmlsXG4gICAgICAob3IgKGFnZXQgbGluZSBjb2x1bW4pIFwiXFxuXCIpKSkpXG5cbihkZWZ1biByZWFkLWNoYXJcbiAgKHJlYWRlcilcbiAgXCJSZXR1cm5zIHRoZSBuZXh0IGNoYXIgZnJvbSB0aGUgUmVhZGVyLCBuaWwgaWYgdGhlIGVuZFxuICBvZiBzdHJlYW0gaGFzIGJlZW4gcmVhY2hlZFwiXG4gIChsZXQqICgoY2ggKHBlZWstY2hhciByZWFkZXIpKSlcbiAgICA7OyBVcGRhdGUgbGluZSBjb2x1bW4gZGVwZW5kaW5nIG9uIHdoYXQgaGFzIGJlaW5nIHJlYWQuXG4gICAgKGlmIChuZXdsaW5lPyAocGVlay1jaGFyIHJlYWRlcikpXG4gICAgICAocHJvZ25cbiAgICAgICAgKHNldGYgKDpsaW5lIHJlYWRlcikgKGluYyAoOmxpbmUgcmVhZGVyKSkpXG4gICAgICAgIChzZXRmICg6Y29sdW1uIHJlYWRlcikgLTEpKVxuICAgICAgKHNldGYgKDpjb2x1bW4gcmVhZGVyKSAoaW5jICg6Y29sdW1uIHJlYWRlcikpKSlcbiAgICBjaCkpXG5cbjs7IFByZWRpY2F0ZXNcblxuKGRlZnVuIG5ld2xpbmU/XG4gIChjaClcbiAgXCJDaGVja3Mgd2hldGhlciB0aGUgY2hhcmFjdGVyIGlzIGEgbmV3bGluZS5cIlxuICAoaWRlbnRpY2FsPyBcIlxcblwiIGNoKSlcblxuKGRlZnVuIGJyZWFraW5nLXdoaXRlc3BhY2U/XG4gIChjaClcbiBcIkNoZWNrcyBpZiBhIHN0cmluZyBpcyBhbGwgYnJlYWtpbmcgd2hpdGVzcGFjZS5cIlxuIChvciAoaWRlbnRpY2FsPyBjaCBcIiBcIilcbiAgICAgKGlkZW50aWNhbD8gY2ggXCJcXHRcIilcbiAgICAgKGlkZW50aWNhbD8gY2ggXCJcXG5cIilcbiAgICAgKGlkZW50aWNhbD8gY2ggXCJcXHJcIikpKVxuXG4oZGVmdW4gd2hpdGVzcGFjZT9cbiAgKGNoKVxuICBcIkNoZWNrcyB3aGV0aGVyIGEgZ2l2ZW4gY2hhcmFjdGVyIGlzIHdoaXRlc3BhY2VcIlxuICAoYnJlYWtpbmctd2hpdGVzcGFjZT8gY2gpKVxuXG4oZGVmdW4gbnVtZXJpYz9cbiAgKGNoKVxuIFwiQ2hlY2tzIHdoZXRoZXIgYSBnaXZlbiBjaGFyYWN0ZXIgaXMgbnVtZXJpY1wiXG4gKG9yIChpZGVudGljYWw/IGNoIFxcMClcbiAgICAgKGlkZW50aWNhbD8gY2ggXFwxKVxuICAgICAoaWRlbnRpY2FsPyBjaCBcXDIpXG4gICAgIChpZGVudGljYWw/IGNoIFxcMylcbiAgICAgKGlkZW50aWNhbD8gY2ggXFw0KVxuICAgICAoaWRlbnRpY2FsPyBjaCBcXDUpXG4gICAgIChpZGVudGljYWw/IGNoIFxcNilcbiAgICAgKGlkZW50aWNhbD8gY2ggXFw3KVxuICAgICAoaWRlbnRpY2FsPyBjaCBcXDgpXG4gICAgIChpZGVudGljYWw/IGNoIFxcOSkpKVxuXG4oZGVmdW4gY29tbWVudC1wcmVmaXg/XG4gIChjaClcbiAgXCJDaGVja3Mgd2hldGhlciB0aGUgY2hhcmFjdGVyIGJlZ2lucyBhIGNvbW1lbnQuXCJcbiAgKGlkZW50aWNhbD8gXCI7XCIgY2gpKVxuXG5cbihkZWZ1biBudW1iZXItbGl0ZXJhbD9cbiAgKHJlYWRlciBpbml0Y2gpXG4gIFwiQ2hlY2tzIHdoZXRoZXIgdGhlIHJlYWRlciBpcyBhdCB0aGUgc3RhcnQgb2YgYSBudW1iZXIgbGl0ZXJhbFwiXG4gIChvciAobnVtZXJpYz8gaW5pdGNoKVxuICAgICAgKGFuZCAob3IgKGlkZW50aWNhbD8gXFwrIGluaXRjaClcbiAgICAgICAgICAgICAgIChpZGVudGljYWw/IFxcLSBpbml0Y2gpKVxuICAgICAgICAgICAobnVtZXJpYz8gKHBlZWstY2hhciByZWFkZXIpKSkpKVxuXG5cblxuOzsgcmVhZCBoZWxwZXJzXG5cbihkZWZ1biByZWFkZXItZXJyb3JcbiAgKHJlYWRlciBtZXNzYWdlKVxuICAobGV0KiAoKHRleHQgKHN0ciBtZXNzYWdlXG4gICAgICAgICAgICAgICAgICBcIlxcblwiIFwibGluZTpcIiAoOmxpbmUgcmVhZGVyKVxuICAgICAgICAgICAgICAgICAgXCJcXG5cIiBcImNvbHVtbjpcIiAoOmNvbHVtbiByZWFkZXIpKSlcbiAgICAgICAgKGVycm9yIChTeW50YXhFcnJvciB0ZXh0ICg6dXJpIHJlYWRlcikpKSlcbiAgICAoc2V0ZiBlcnJvci5saW5lICg6bGluZSByZWFkZXIpKVxuICAgIChzZXRmIGVycm9yLmNvbHVtbiAoOmNvbHVtbiByZWFkZXIpKVxuICAgIChzZXRmIGVycm9yLnVyaSAoOnVyaSByZWFkZXIpKVxuICAgICh0aHJvdyBlcnJvcikpKVxuXG4oZGVmdW4gbWFjcm8tdGVybWluYXRpbmc/IChjaClcbiAgKGFuZCAobm90IChpZGVudGljYWw/IGNoIFwiI1wiKSlcbiAgICAgICAobm90IChpZGVudGljYWw/IGNoIFwiJ1wiKSlcbiAgICAgICAobm90IChpZGVudGljYWw/IGNoIFwiOlwiKSlcbiAgICAgICAobWFjcm9zIGNoKSkpXG5cblxuKGRlZnVuIHJlYWQtdG9rZW5cbiAgKHJlYWRlciBpbml0Y2gpXG4gIFwiUmVhZHMgb3V0IG5leHQgdG9rZW4gZnJvbSB0aGUgcmVhZGVyIHN0cmVhbVwiXG4gIChsb29wICgoYnVmZmVyIGluaXRjaClcbiAgICAgICAgIChjaCAocGVlay1jaGFyIHJlYWRlcikpKVxuXG4gICAgKGlmIChvciAobmlsPyBjaClcbiAgICAgICAgICAgICh3aGl0ZXNwYWNlPyBjaClcbiAgICAgICAgICAgIChtYWNyby10ZXJtaW5hdGluZz8gY2gpKSBidWZmZXJcbiAgICAgICAgKHJlY3VyIChzdHIgYnVmZmVyIChyZWFkLWNoYXIgcmVhZGVyKSlcbiAgICAgICAgICAgICAgIChwZWVrLWNoYXIgcmVhZGVyKSkpKSlcblxuKGRlZnVuIHNraXAtbGluZVxuICAocmVhZGVyIF8pXG4gIFwiQWR2YW5jZXMgdGhlIHJlYWRlciB0byB0aGUgZW5kIG9mIGEgbGluZS4gUmV0dXJucyB0aGUgcmVhZGVyXCJcbiAgKGxvb3AgKClcbiAgICAobGV0KiAoKGNoIChyZWFkLWNoYXIgcmVhZGVyKSkpXG4gICAgICAoaWYgKG9yIChpZGVudGljYWw/IGNoIFwiXFxuXCIpXG4gICAgICAgICAgICAgIChpZGVudGljYWw/IGNoIFwiXFxyXCIpXG4gICAgICAgICAgICAgIChuaWw/IGNoKSlcbiAgICAgICAgcmVhZGVyXG4gICAgICAgIChyZWN1cikpKSkpXG5cblxuOzsgTm90ZTogSW5wdXQgYmVnaW4gYW5kIGVuZCBtYXRjaGVycyBhcmUgdXNlZCBpbiBhIHBhdHRlcm4gc2luY2Ugb3RoZXJ3aXNlXG47OyBhbnl0aGluZyBiZWdpbmlubmcgd2l0aCBgMGAgd2lsbCBtYXRjaCBqdXN0IGAwYCBjYXVzZSBpdCdzIGxpc3RlZCBmaXJzdC5cbihkZWZ2YXIgaW50LXBhdHRlcm4gKHJlLXBhdHRlcm4gXCJeKFstK10/KSg/OigwKXwoWzEtOV1bMC05XSopfDBbeFhdKFswLTlBLUZhLWZdKyl8MChbMC03XSspfChbMS05XVswLTldPylbclJdKFswLTlBLVphLXpdKyl8MFswLTldKykoTik/JFwiKSlcbihkZWZ2YXIgcmF0aW8tcGF0dGVybiAocmUtcGF0dGVybiBcIihbLStdP1swLTldKykvKFswLTldKylcIikpXG4oZGVmdmFyIGZsb2F0LXBhdHRlcm4gKHJlLXBhdHRlcm4gXCIoWy0rXT9bMC05XSsoXFxcXC5bMC05XSopPyhbZUVdWy0rXT9bMC05XSspPykoTSk/XCIpKVxuXG4oZGVmdW4gbWF0Y2gtaW50XG4gIChzKVxuICAobGV0KiAoKGdyb3VwcyAocmUtZmluZCBpbnQtcGF0dGVybiBzKSlcbiAgICAgICAgKGdyb3VwMyAoYWdldCBncm91cHMgMikpKVxuICAgIChpZiAobm90IChvciAobmlsPyBncm91cDMpXG4gICAgICAgICAgICAgICAgICg8IChjb3VudCBncm91cDMpIDEpKSlcbiAgICAgIDBcbiAgICAgIChsZXQqICgobmVnYXRlIChpZiAoaWRlbnRpY2FsPyBcIi1cIiAoYWdldCBncm91cHMgMSkpIC0xIDEpKVxuICAgICAgICAgICAgKGEgKGNvbmRcbiAgICAgICAgICAgICAgICgoYWdldCBncm91cHMgMykgWyhhZ2V0IGdyb3VwcyAzKSAxMF0pXG4gICAgICAgICAgICAgICAoKGFnZXQgZ3JvdXBzIDQpIFsoYWdldCBncm91cHMgNCkgMTZdKVxuICAgICAgICAgICAgICAgKChhZ2V0IGdyb3VwcyA1KSBbKGFnZXQgZ3JvdXBzIDUpIDhdKVxuICAgICAgICAgICAgICAgKChhZ2V0IGdyb3VwcyA3KSBbKGFnZXQgZ3JvdXBzIDcpIChwYXJzZS1pbnQgKGFnZXQgZ3JvdXBzIDcpKV0pXG4gICAgICAgICAgICAgICAoZWxzZSBbbmlsIG5pbF0pKSlcbiAgICAgICAgICAgIChuIChhZ2V0IGEgMCkpXG4gICAgICAgICAgICAocmFkaXggKGFnZXQgYSAxKSkpXG4gICAgICAgIChpZiAobmlsPyBuKVxuICAgICAgICAgIG5pbFxuICAgICAgICAgICgqIG5lZ2F0ZSAocGFyc2UtaW50IG4gcmFkaXgpKSkpKSkpXG5cbihkZWZ1biBtYXRjaC1yYXRpb1xuICAocylcbiAgKGxldCogKChncm91cHMgKHJlLWZpbmQgcmF0aW8tcGF0dGVybiBzKSlcbiAgICAgICAgKG51bWluYXRvciAoYWdldCBncm91cHMgMSkpXG4gICAgICAgIChkZW5vbWluYXRvciAoYWdldCBncm91cHMgMikpKVxuICAgICgvIChwYXJzZS1pbnQgbnVtaW5hdG9yKSAocGFyc2UtaW50IGRlbm9taW5hdG9yKSkpKVxuXG4oZGVmdW4gbWF0Y2gtZmxvYXRcbiAgKHMpXG4gIChwYXJzZS1mbG9hdCBzKSlcblxuXG4oZGVmdW4gbWF0Y2gtbnVtYmVyXG4gIChzKVxuICAoY29uZFxuICAgKChyZS1tYXRjaGVzIGludC1wYXR0ZXJuIHMpIChtYXRjaC1pbnQgcykpXG4gICAoKHJlLW1hdGNoZXMgcmF0aW8tcGF0dGVybiBzKSAobWF0Y2gtcmF0aW8gcykpXG4gICAoKHJlLW1hdGNoZXMgZmxvYXQtcGF0dGVybiBzKSAobWF0Y2gtZmxvYXQgcykpKSlcblxuKGRlZnVuIGVzY2FwZS1jaGFyLW1hcCAoYylcbiAgKGNvbmRcbiAgICgoaWRlbnRpY2FsPyBjIFxcdCkgXCJcXHRcIilcbiAgICgoaWRlbnRpY2FsPyBjIFxccikgXCJcXHJcIilcbiAgICgoaWRlbnRpY2FsPyBjIFxcbikgXCJcXG5cIilcbiAgICgoaWRlbnRpY2FsPyBjIFxcXFwpIFxcXFwpXG4gICAoKGlkZW50aWNhbD8gYyBcIlxcXCJcIikgXCJcXFwiXCIpXG4gICAoKGlkZW50aWNhbD8gYyBcXGIpIFwiXFxiXCIpXG4gICAoKGlkZW50aWNhbD8gYyBcXGYpIFwiXFxmXCIpXG4gICAoZWxzZSBuaWwpKSlcblxuOzsgdW5pY29kZVxuXG4oZGVmdW4gcmVhZC0yLWNoYXJzIChyZWFkZXIpXG4gIChzdHIgKHJlYWQtY2hhciByZWFkZXIpXG4gICAgICAgKHJlYWQtY2hhciByZWFkZXIpKSlcblxuKGRlZnVuIHJlYWQtNC1jaGFycyAocmVhZGVyKVxuICAoc3RyIChyZWFkLWNoYXIgcmVhZGVyKVxuICAgICAgIChyZWFkLWNoYXIgcmVhZGVyKVxuICAgICAgIChyZWFkLWNoYXIgcmVhZGVyKVxuICAgICAgIChyZWFkLWNoYXIgcmVhZGVyKSkpXG5cbihkZWZ2YXIgdW5pY29kZS0yLXBhdHRlcm4gKHJlLXBhdHRlcm4gXCJbMC05QS1GYS1mXXsyfVwiKSlcbihkZWZ2YXIgdW5pY29kZS00LXBhdHRlcm4gKHJlLXBhdHRlcm4gXCJbMC05QS1GYS1mXXs0fVwiKSlcblxuXG4oZGVmdW4gdmFsaWRhdGUtdW5pY29kZS1lc2NhcGVcbiAgKHVuaWNvZGUtcGF0dGVybiByZWFkZXIgZXNjYXBlLWNoYXIgdW5pY29kZS1zdHIpXG4gIFwiVmFsaWRhdGVzIHVuaWNvZGUgZXNjYXBlXCJcbiAgKGlmIChyZS1tYXRjaGVzIHVuaWNvZGUtcGF0dGVybiB1bmljb2RlLXN0cilcbiAgICB1bmljb2RlLXN0clxuICAgIChyZWFkZXItZXJyb3JcbiAgICAgcmVhZGVyXG4gICAgIChzdHIgXCJVbmV4cGVjdGVkIHVuaWNvZGUgZXNjYXBlIFwiIFxcXFwgZXNjYXBlLWNoYXIgdW5pY29kZS1zdHIpKSkpXG5cblxuKGRlZnVuIG1ha2UtdW5pY29kZS1jaGFyXG4gIChjb2RlLXN0ciBiYXNlKVxuICAobGV0KiAoKGJhc2UgKG9yIGJhc2UgMTYpKVxuICAgICAgICAoY29kZSAocGFyc2VJbnQgY29kZS1zdHIgYmFzZSkpKVxuICAgIChjaGFyIGNvZGUpKSlcblxuKGRlZnVuIGVzY2FwZS1jaGFyXG4gIChidWZmZXIgcmVhZGVyKVxuICBcImVzY2FwZSBjaGFyXCJcbiAgKGxldCogKChjaCAocmVhZC1jaGFyIHJlYWRlcikpXG4gICAgICAgIChtYXByZXN1bHQgKGVzY2FwZS1jaGFyLW1hcCBjaCkpKVxuICAgIChpZiBtYXByZXN1bHRcbiAgICAgIG1hcHJlc3VsdFxuICAgICAgKGNvbmRcbiAgICAgICAgKChpZGVudGljYWw/IGNoIFxceCkgKG1ha2UtdW5pY29kZS1jaGFyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKHZhbGlkYXRlLXVuaWNvZGUtZXNjYXBlIHVuaWNvZGUtMi1wYXR0ZXJuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlYWRlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAocmVhZC0yLWNoYXJzIHJlYWRlcikpKSlcbiAgICAgICAgKChpZGVudGljYWw/IGNoIFxcdSkgKG1ha2UtdW5pY29kZS1jaGFyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKHZhbGlkYXRlLXVuaWNvZGUtZXNjYXBlIHVuaWNvZGUtNC1wYXR0ZXJuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlYWRlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAocmVhZC00LWNoYXJzIHJlYWRlcikpKSlcbiAgICAgICAgKChudW1lcmljPyBjaCkgKGNoYXIgY2gpKVxuICAgICAgICAoZWxzZSAocmVhZGVyLWVycm9yIHJlYWRlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChzdHIgXCJVbmV4cGVjdGVkIHVuaWNvZGUgZXNjYXBlIFwiIFxcXFwgY2ggKSkpKSkpKVxuXG4oZGVmdW4gcmVhZC1wYXN0XG4gIChwcmVkaWNhdGUgcmVhZGVyKVxuICBcIlJlYWQgdW50aWwgZmlyc3QgY2hhcmFjdGVyIHRoYXQgZG9lc24ndCBtYXRjaCBwcmVkLCByZXR1cm5pbmdcbiAgY2hhci5cIlxuICAobG9vcCAoKF8gbmlsKSlcbiAgICAoaWYgKHByZWRpY2F0ZSAocGVlay1jaGFyIHJlYWRlcikpXG4gICAgICAocmVjdXIgKHJlYWQtY2hhciByZWFkZXIpKVxuICAgICAgKHBlZWstY2hhciByZWFkZXIpKSkpXG5cblxuOzsgVE9ETzogQ29tcGxldGUgaW1wbGVtZW50YXRpb25cbihkZWZ1biByZWFkLWRlbGltaXRlZC1saXN0XG4gIChkZWxpbSByZWFkZXIgcmVjdXJzaXZlPylcbiAgXCJSZWFkcyBvdXQgZGVsaW1pdGVkIGxpc3RcIlxuICAobG9vcCAoKGZvcm1zIFtdKSlcbiAgICAobGV0KiAoKF8gKHJlYWQtcGFzdCB3aGl0ZXNwYWNlPyByZWFkZXIpKVxuICAgICAgICAgIChjaCAocmVhZC1jaGFyIHJlYWRlcikpKVxuICAgICAgKGlmIChub3QgY2gpIChyZWFkZXItZXJyb3IgcmVhZGVyIDpFT0YpKVxuICAgICAgKGlmIChpZGVudGljYWw/IGRlbGltIGNoKVxuICAgICAgICBmb3Jtc1xuICAgICAgICAobGV0KiAoKGZvcm0gKHJlYWQtZm9ybSByZWFkZXIgY2gpKSlcbiAgICAgICAgICAocmVjdXIgKGlmIChpZGVudGljYWw/IGZvcm0gcmVhZGVyKVxuICAgICAgICAgICAgICAgICAgIGZvcm1zXG4gICAgICAgICAgICAgICAgICAgKGNvbmogZm9ybXMgZm9ybSkpKSkpKSkpXG5cbjs7IGRhdGEgc3RydWN0dXJlIHJlYWRlcnNcblxuKGRlZnVuIG5vdC1pbXBsZW1lbnRlZFxuICAocmVhZGVyIGNoKVxuICAocmVhZGVyLWVycm9yIHJlYWRlciAoc3RyIFwiUmVhZGVyIGZvciBcIiBjaCBcIiBub3QgaW1wbGVtZW50ZWQgeWV0XCIpKSlcblxuXG4oZGVmdW4gcmVhZC1kaXNwYXRjaFxuICAocmVhZGVyIF8pXG4gIChsZXQqICgoY2ggKHJlYWQtY2hhciByZWFkZXIpKVxuICAgICAgICAoZG0gKGRpc3BhdGNoLW1hY3JvcyBjaCkpKVxuICAgIChpZiBkbVxuICAgICAgKGRtIHJlYWRlciBfKVxuICAgICAgKGxldCogKChvYmplY3QgKG1heWJlLXJlYWQtdGFnZ2VkLXR5cGUgcmVhZGVyIGNoKSkpXG4gICAgICAgIChpZiBvYmplY3RcbiAgICAgICAgICBvYmplY3RcbiAgICAgICAgICAocmVhZGVyLWVycm9yIHJlYWRlciBcIk5vIGRpc3BhdGNoIG1hY3JvIGZvciBcIiBjaCkpKSkpKVxuXG4oZGVmdW4gcmVhZC11bm1hdGNoZWQtZGVsaW1pdGVyXG4gIChyZHIgY2gpXG4gIChyZWFkZXItZXJyb3IgcmRyIFwiVW5tYXRjaGVkIGRlbGltaXRlciBcIiBjaCkpXG5cbihkZWZ1biByZWFkLWxpc3RcbiAgKHJlYWRlciBfKVxuICAobGV0KiAoKGZvcm0gKHJlYWQtZGVsaW1pdGVkLWxpc3QgXCIpXCIgcmVhZGVyIHRydWUpKSlcbiAgICAod2l0aC1tZXRhIChhcHBseSBsaXN0IGZvcm0pIChtZXRhIGZvcm0pKSkpXG5cbihkZWZ1biByZWFkLWNvbW1lbnRcbiAgKHJlYWRlciBfKVxuICAobG9vcCAoKGJ1ZmZlciBcIlwiKVxuICAgICAgICAgKGNoIChyZWFkLWNoYXIgcmVhZGVyKSkpXG5cbiAgICAoY29uZFxuICAgICAoKG9yIChuaWw/IGNoKVxuICAgICAgICAgKGlkZW50aWNhbD8gXCJcXG5cIiBjaCkpIChvciByZWFkZXIgOzsgaWdub3JlIGNvbW1lbnRzIGZvciBub3dcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGxpc3QgJ2NvbW1lbnQgYnVmZmVyKSkpXG4gICAgICgob3IgKGlkZW50aWNhbD8gXFxcXCBjaCkpIChyZWN1ciAoc3RyIGJ1ZmZlciAoZXNjYXBlLWNoYXIgYnVmZmVyIHJlYWRlcikpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAocmVhZC1jaGFyIHJlYWRlcikpKVxuICAgICAoZWxzZSAocmVjdXIgKHN0ciBidWZmZXIgY2gpIChyZWFkLWNoYXIgcmVhZGVyKSkpKSkpXG5cbihkZWZ1biByZWFkLXZlY3RvclxuICAocmVhZGVyKVxuICAocmVhZC1kZWxpbWl0ZWQtbGlzdCBcIl1cIiByZWFkZXIgdHJ1ZSkpXG5cbihkZWZ1biByZWFkLW1hcFxuICAocmVhZGVyKVxuICAobGV0KiAoKGZvcm0gKHJlYWQtZGVsaW1pdGVkLWxpc3QgXCJ9XCIgcmVhZGVyIHRydWUpKSlcbiAgICAoaWYgKG9kZD8gKGNvdW50IGZvcm0pKVxuICAgICAgKHJlYWRlci1lcnJvciByZWFkZXIgXCJNYXAgbGl0ZXJhbCBtdXN0IGNvbnRhaW4gYW4gZXZlbiBudW1iZXIgb2YgZm9ybXNcIilcbiAgICAgICh3aXRoLW1ldGEgKGFwcGx5IGRpY3Rpb25hcnkgZm9ybSkgKG1ldGEgZm9ybSkpKSkpXG5cbihkZWZ1biByZWFkLXNldFxuICAocmVhZGVyIF8pXG4gIChsZXQqICgoZm9ybSAocmVhZC1kZWxpbWl0ZWQtbGlzdCBcIn1cIiByZWFkZXIgdHJ1ZSkpKVxuICAgICh3aXRoLW1ldGEgKGNvbmNhdCBbJ3NldF0gZm9ybSkgKG1ldGEgZm9ybSkpKSlcblxuKGRlZnVuIHJlYWQtbnVtYmVyXG4gIChyZWFkZXIgaW5pdGNoKVxuICAobG9vcCAoKGJ1ZmZlciBpbml0Y2gpXG4gICAgICAgICAoY2ggKHBlZWstY2hhciByZWFkZXIpKSlcblxuICAgIChpZiAob3IgKG5pbD8gY2gpXG4gICAgICAgICAgICAod2hpdGVzcGFjZT8gY2gpXG4gICAgICAgICAgICAobWFjcm9zIGNoKSlcbiAgICAgIChsZXQqICgobWF0Y2ggKG1hdGNoLW51bWJlciBidWZmZXIpKSlcbiAgICAgICAgKGlmIChuaWw/IG1hdGNoKVxuICAgICAgICAgICAgKHJlYWRlci1lcnJvciByZWFkZXIgXCJJbnZhbGlkIG51bWJlciBmb3JtYXQgW1wiIGJ1ZmZlciBcIl1cIilcbiAgICAgICAgICAgIChOdW1iZXIuIG1hdGNoKSkpXG4gICAgICAocmVjdXIgKHN0ciBidWZmZXIgKHJlYWQtY2hhciByZWFkZXIpKVxuICAgICAgICAgICAgIChwZWVrLWNoYXIgcmVhZGVyKSkpKSlcblxuKGRlZnVuIHJlYWQtc3RyaW5nXG4gIChyZWFkZXIpXG4gIChsb29wICgoYnVmZmVyIFwiXCIpXG4gICAgICAgICAoY2ggKHJlYWQtY2hhciByZWFkZXIpKSlcblxuICAgIChjb25kXG4gICAgICgobmlsPyBjaCkgKHJlYWRlci1lcnJvciByZWFkZXIgXCJFT0Ygd2hpbGUgcmVhZGluZyBzdHJpbmdcIikpXG4gICAgICgoaWRlbnRpY2FsPyBcXFxcIGNoKSAocmVjdXIgKHN0ciBidWZmZXIgKGVzY2FwZS1jaGFyIGJ1ZmZlciByZWFkZXIpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChyZWFkLWNoYXIgcmVhZGVyKSkpXG4gICAgICgoaWRlbnRpY2FsPyBcIlxcXCJcIiBjaCkgKFN0cmluZy4gYnVmZmVyKSlcbiAgICAgKGVsc2UgKHJlY3VyIChzdHIgYnVmZmVyIGNoKSAocmVhZC1jaGFyIHJlYWRlcikpKSkpKVxuXG4oZGVmdW4gcmVhZC1jaGFyYWN0ZXJcbiAgKHJlYWRlcilcbiAgKFN0cmluZy4gKHJlYWQtY2hhciByZWFkZXIpKSlcblxuKGRlZnVuIHJlYWQtdW5xdW90ZVxuICAocmVhZGVyKVxuICBcIlJlYWRzIHVucXVvdGUgZm9ybSAsZm9ybSBvciAsKGZvbyBiYXIpXCJcbiAgKGxldCogKChjaCAocGVlay1jaGFyIHJlYWRlcikpKVxuICAgIChpZiAobm90IGNoKVxuICAgICAgKHJlYWRlci1lcnJvciByZWFkZXIgXCJFT0Ygd2hpbGUgcmVhZGluZyBjaGFyYWN0ZXJcIilcbiAgICAgIChpZiAoaWRlbnRpY2FsPyBjaCBcXEApXG4gICAgICAgIChwcm9nbiAocmVhZC1jaGFyIHJlYWRlcilcbiAgICAgICAgICAgIChsaXN0ICd1bnF1b3RlLXNwbGljaW5nIChyZWFkIHJlYWRlciB0cnVlIG5pbCB0cnVlKSkpXG4gICAgICAgIChsaXN0ICd1bnF1b3RlIChyZWFkIHJlYWRlciB0cnVlIG5pbCB0cnVlKSkpKSkpXG5cblxuKGRlZnVuIHNwZWNpYWwtc3ltYm9scyAodGV4dCBub3QtZm91bmQpXG4gIChjb25kXG4gICAoKGlkZW50aWNhbD8gdGV4dCBcIm5pbFwiKSBuaWwpXG4gICAoKGlkZW50aWNhbD8gdGV4dCBcInRydWVcIikgdHJ1ZSlcbiAgICgoaWRlbnRpY2FsPyB0ZXh0IFwiZmFsc2VcIikgZmFsc2UpXG4gICAoZWxzZSBub3QtZm91bmQpKSlcblxuXG4oZGVmdW4gcmVhZC1zeW1ib2xcbiAgKHJlYWRlciBpbml0Y2gpXG4gIChsZXQqICgodG9rZW4gKHJlYWQtdG9rZW4gcmVhZGVyIGluaXRjaCkpXG4gICAgICAgIChwYXJ0cyAoc3BsaXQgdG9rZW4gXCIvXCIpKVxuICAgICAgICAoaGFzLW5zIChhbmQgKD4gKGNvdW50IHBhcnRzKSAxKVxuICAgICAgICAgICAgICAgICAgICA7OyBNYWtlIHN1cmUgaXQncyBub3QganVzdCBgL2BcbiAgICAgICAgICAgICAgICAgICAgKD4gKGNvdW50IHRva2VuKSAxKSkpXG4gICAgICAgIChucyAoZmlyc3QgcGFydHMpKVxuICAgICAgICAobmFtZSAoam9pbiBcIi9cIiAocmVzdCBwYXJ0cykpKSlcbiAgICAoaWYgaGFzLW5zXG4gICAgICAoc3ltYm9sIG5zIG5hbWUpXG4gICAgICAoc3BlY2lhbC1zeW1ib2xzIHRva2VuIChzeW1ib2wgdG9rZW4pKSkpKVxuXG4oZGVmdW4gcmVhZC1rZXl3b3JkXG4gIChyZWFkZXIgaW5pdGNoKVxuICAobGV0KiAoKHRva2VuIChyZWFkLXRva2VuIHJlYWRlciAocmVhZC1jaGFyIHJlYWRlcikpKVxuICAgICAgICAocGFydHMgKHNwbGl0IHRva2VuIFwiL1wiKSlcbiAgICAgICAgKG5hbWUgKGxhc3QgcGFydHMpKVxuICAgICAgICAobnMgKGlmICg+IChjb3VudCBwYXJ0cykgMSkgKGpvaW4gXCIvXCIgKGJ1dGxhc3QgcGFydHMpKSkpXG4gICAgICAgIChpc3N1ZSAoY29uZFxuICAgICAgICAgICAgICAgKChpZGVudGljYWw/IChsYXN0IG5zKSBcXDopIFwibmFtZXNwYWNlIGNhbid0IGVuZHMgd2l0aCBcXFwiOlxcXCJcIilcbiAgICAgICAgICAgICAgICgoaWRlbnRpY2FsPyAobGFzdCBuYW1lKSBcXDopIFwibmFtZSBjYW4ndCBlbmQgd2l0aCBcXFwiOlxcXCJcIilcbiAgICAgICAgICAgICAgICgoaWRlbnRpY2FsPyAobGFzdCBuYW1lKSBcXC8pIFwibmFtZSBjYW4ndCBlbmQgd2l0aCBcXFwiL1xcXCJcIilcbiAgICAgICAgICAgICAgICgoPiAoY291bnQgKHNwbGl0IHRva2VuIFwiOjpcIikpIDEpIFwibmFtZSBjYW4ndCBjb250YWluIFxcXCI6OlxcXCJcIikpKSlcbiAgICAoaWYgaXNzdWVcbiAgICAgIChyZWFkZXItZXJyb3IgcmVhZGVyIFwiSW52YWxpZCB0b2tlbiAoXCIgaXNzdWUgXCIpOiBcIiB0b2tlbilcbiAgICAgIChpZiAoYW5kIChub3QgbnMpIChpZGVudGljYWw/IChmaXJzdCBuYW1lKSBcXDopKVxuICAgICAgICAoa2V5d29yZCA7Km5zLXN5bSpcbiAgICAgICAgICAocmVzdCBuYW1lKSkgOzsgbmFtZXNwYWNlZCBrZXl3b3JkIHVzaW5nIGRlZmF1bHRcbiAgICAgICAgKGtleXdvcmQgbnMgbmFtZSkpKSkpXG5cbihkZWZ1biB3cmFwcGluZy1yZWFkZXJcbiAgKHByZWZpeClcbiAgKGxhbWJkYSAocmVhZGVyKVxuICAgIChsaXN0IHByZWZpeCAocmVhZCByZWFkZXIgdHJ1ZSBuaWwgdHJ1ZSkpKSlcblxuKGRlZnVuIHRocm93aW5nLXJlYWRlclxuICAobXNnKVxuICAobGFtYmRhIChyZWFkZXIpXG4gICAgKHJlYWRlci1lcnJvciByZWFkZXIgbXNnKSkpXG5cbihkZWZ1biByZWFkLXJlZ2V4XG4gIChyZWFkZXIpXG4gIChsb29wICgoYnVmZmVyIFwiXCIpXG4gICAgICAgICAoY2ggKHJlYWQtY2hhciByZWFkZXIpKSlcblxuICAgIChjb25kXG4gICAgICgobmlsPyBjaCkgKHJlYWRlci1lcnJvciByZWFkZXIgXCJFT0Ygd2hpbGUgcmVhZGluZyBzdHJpbmdcIikpXG4gICAgICgoaWRlbnRpY2FsPyBcXFxcIGNoKSAocmVjdXIgKHN0ciBidWZmZXIgY2ggKHJlYWQtY2hhciByZWFkZXIpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChyZWFkLWNoYXIgcmVhZGVyKSkpXG4gICAgICgoaWRlbnRpY2FsPyBcIlxcXCJcIiBjaCkgKHJlLXBhdHRlcm4gYnVmZmVyKSlcbiAgICAgKGVsc2UgKHJlY3VyIChzdHIgYnVmZmVyIGNoKSAocmVhZC1jaGFyIHJlYWRlcikpKSkpKVxuXG4oZGVmdW4gcmVhZC1kaXNjYXJkXG4gIChyZWFkZXIgXylcbiAgXCJEaXNjYXJkcyBuZXh0IGZvcm1cIlxuICAocmVhZCByZWFkZXIgdHJ1ZSBuaWwgdHJ1ZSlcbiAgcmVhZGVyKVxuXG4oZGVmdW4gbWFjcm9zIChjKVxuICAoY29uZFxuICAgKChpZGVudGljYWw/IGMgXCJcXFwiXCIpIHJlYWQtc3RyaW5nKVxuICAgKChpZGVudGljYWw/IGMgXFxcXCkgcmVhZC1jaGFyYWN0ZXIpXG4gICAoKGlkZW50aWNhbD8gYyBcXDopIHJlYWQta2V5d29yZClcbiAgICgoaWRlbnRpY2FsPyBjIFwiO1wiKSByZWFkLWNvbW1lbnQpXG4gICAoKGlkZW50aWNhbD8gYyBcXCcpICh3cmFwcGluZy1yZWFkZXIgJ3F1b3RlKSlcbiAgICgoaWRlbnRpY2FsPyBjIFxcQCkgKHdyYXBwaW5nLXJlYWRlciAnZGVyZWYpKVxuICAgKChpZGVudGljYWw/IGMgXFxgKSAod3JhcHBpbmctcmVhZGVyICdzeW50YXgtcXVvdGUpKVxuICAgKChpZGVudGljYWw/IGMgXFwsKSByZWFkLXVucXVvdGUpXG4gICAoKGlkZW50aWNhbD8gYyBcXCgpIHJlYWQtbGlzdClcbiAgICgoaWRlbnRpY2FsPyBjIFxcKSkgcmVhZC11bm1hdGNoZWQtZGVsaW1pdGVyKVxuICAgKChpZGVudGljYWw/IGMgXFxbKSByZWFkLXZlY3RvcilcbiAgICgoaWRlbnRpY2FsPyBjIFxcXSkgcmVhZC11bm1hdGNoZWQtZGVsaW1pdGVyKVxuICAgKChpZGVudGljYWw/IGMgXFx7KSByZWFkLW1hcClcbiAgICgoaWRlbnRpY2FsPyBjIFxcfSkgcmVhZC11bm1hdGNoZWQtZGVsaW1pdGVyKVxuICAgKChpZGVudGljYWw/IGMgXFwjKSByZWFkLWRpc3BhdGNoKVxuICAgKGVsc2UgbmlsKSkpXG5cblxuKGRlZnVuIGRpc3BhdGNoLW1hY3JvcyAocylcbiAgKGNvbmRcbiAgICgoaWRlbnRpY2FsPyBzIFxceykgcmVhZC1zZXQpXG4gICAoKGlkZW50aWNhbD8gcyBcXDwpICh0aHJvd2luZy1yZWFkZXIgXCJVbnJlYWRhYmxlIGZvcm1cIikpXG4gICAoKGlkZW50aWNhbD8gcyBcIlxcXCJcIikgcmVhZC1yZWdleClcbiAgICgoaWRlbnRpY2FsPyBzIFxcISkgcmVhZC1jb21tZW50KVxuICAgKChpZGVudGljYWw/IHMgXFxfKSByZWFkLWRpc2NhcmQpXG4gICAoZWxzZSBuaWwpKSlcblxuKGRlZnVuIHJlYWQtZm9ybVxuICAocmVhZGVyIGNoKVxuICAobGV0KiAoKHN0YXJ0IHs6bGluZSAoOmxpbmUgcmVhZGVyKVxuICAgICAgICAgICAgICAgOmNvbHVtbiAoOmNvbHVtbiByZWFkZXIpfSlcbiAgICAgICAgKHJlYWQtbWFjcm8gKG1hY3JvcyBjaCkpXG4gICAgICAgIChmb3JtIChjb25kIChyZWFkLW1hY3JvIChyZWFkLW1hY3JvIHJlYWRlciBjaCkpXG4gICAgICAgICAgICAgICAgICAgKChudW1iZXItbGl0ZXJhbD8gcmVhZGVyIGNoKSAocmVhZC1udW1iZXIgcmVhZGVyIGNoKSlcbiAgICAgICAgICAgICAgICAgICAoZWxzZSAocmVhZC1zeW1ib2wgcmVhZGVyIGNoKSkpKVxuICAgICAgICAoZW5kIHs6bGluZSAoOmxpbmUgcmVhZGVyKVxuICAgICAgICAgICAgIDpjb2x1bW4gKGluYyAoOmNvbHVtbiByZWFkZXIpKX0pXG4gICAgICAgIChsb2NhdGlvbiB7OnVyaSAoOnVyaSByZWFkZXIpXG4gICAgICAgICAgICAgICAgICA6c3RhcnQgc3RhcnRcbiAgICAgICAgICAgICAgICAgIDplbmQgZW5kfSkpXG4gICAgKGNvbmQgKChpZGVudGljYWw/IGZvcm0gcmVhZGVyKSBmb3JtKVxuICAgICAgICAgIDs7IFRPRE8gY29uc2lkZXIgYm94aW5nIHByaW1pdGl2ZXMgaW50byBhc3NvY2l0YWRlXG4gICAgICAgICAgOzsgdHlwZXMgdG8gaW5jbHVkZSBtZXRhZGF0YSBvbiB0aG9zZS5cbiAgICAgICAgICAoKG5vdCAob3IgKGJvb2xlYW4/IGZvcm0pXG4gICAgICAgICAgICAgICAgICAgKG5pbD8gZm9ybSlcbiAgICAgICAgICAgICAgICAgICAoa2V5d29yZD8gZm9ybSkpKSAod2l0aC1tZXRhIGZvcm1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChjb25qIGxvY2F0aW9uIChtZXRhIGZvcm0pKSkpXG4gICAgICAgICAgKGVsc2UgZm9ybSkpKSlcblxuKGRlZnVuIHJlYWRcbiAgKHJlYWRlciBlb2YtaXMtZXJyb3Igc2VudGluZWwgaXMtcmVjdXJzaXZlKVxuICBcIlJlYWRzIHRoZSBmaXJzdCBvYmplY3QgZnJvbSBhIFB1c2hiYWNrUmVhZGVyLlxuICBSZXR1cm5zIHRoZSBvYmplY3QgcmVhZC4gSWYgRU9GLCB0aHJvd3MgaWYgZW9mLWlzLWVycm9yIGlzIHRydWUuXG4gIE90aGVyd2lzZSByZXR1cm5zIHNlbnRpbmVsLlwiXG4gIChsb29wICgpXG4gICAgKGxldCogKChjaCAocmVhZC1jaGFyIHJlYWRlcikpXG4gICAgICAgICAgKGZvcm0gKGNvbmRcbiAgICAgICAgICAgICAgICAoKG5pbD8gY2gpIChpZiBlb2YtaXMtZXJyb3IgKHJlYWRlci1lcnJvciByZWFkZXIgOkVPRikgc2VudGluZWwpKVxuICAgICAgICAgICAgICAgICgod2hpdGVzcGFjZT8gY2gpIHJlYWRlcilcbiAgICAgICAgICAgICAgICAoKGNvbW1lbnQtcHJlZml4PyBjaCkgKHJlYWQgKHJlYWQtY29tbWVudCByZWFkZXIgY2gpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW9mLWlzLWVycm9yXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VudGluZWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpcy1yZWN1cnNpdmUpKVxuICAgICAgICAgICAgICAgIChlbHNlIChyZWFkLWZvcm0gcmVhZGVyIGNoKSkpKSlcbiAgICAgIChpZiAoaWRlbnRpY2FsPyBmb3JtIHJlYWRlcilcbiAgICAgICAgKHJlY3VyKVxuICAgICAgICBmb3JtKSkpKVxuXG4oZGVmdW4gcmVhZCpcbiAgKHNvdXJjZSB1cmkpXG4gIChsZXQqICgocmVhZGVyIChwdXNoLWJhY2stcmVhZGVyIHNvdXJjZSB1cmkpKVxuICAgICAgICAoZW9mIChnZW5zeW0pKSlcbiAgICAobG9vcCAoKGZvcm1zIFtdKVxuICAgICAgICAgICAoZm9ybSAocmVhZCByZWFkZXIgZmFsc2UgZW9mIGZhbHNlKSkpXG4gICAgICAoaWYgKGlkZW50aWNhbD8gZm9ybSBlb2YpXG4gICAgICAgIGZvcm1zXG4gICAgICAgIChyZWN1ciAoY29uaiBmb3JtcyBmb3JtKVxuICAgICAgICAgICAgICAgKHJlYWQgcmVhZGVyIGZhbHNlIGVvZiBmYWxzZSkpKSkpKVxuXG5cblxuKGRlZnVuIHJlYWQtZnJvbS1zdHJpbmdcbiAgKHNvdXJjZSB1cmkpXG4gIFwiUmVhZHMgb25lIG9iamVjdCBmcm9tIHRoZSBzdHJpbmcgc1wiXG4gIChsZXQqICgocmVhZGVyIChwdXNoLWJhY2stcmVhZGVyIHNvdXJjZSB1cmkpKSlcbiAgICAocmVhZCByZWFkZXIgdHJ1ZSBuaWwgZmFsc2UpKSlcblxuKGRlZnVuLSByZWFkLXV1aWRcbiAgKHV1aWQpXG4gIChpZiAoc3RyaW5nPyB1dWlkKVxuICAgIGAoVVVJRC4gLHV1aWQpXG4gICAgKHJlYWRlci1lcnJvclxuICAgICBuaWwgXCJVVUlEIGxpdGVyYWwgZXhwZWN0cyBhIHN0cmluZyBhcyBpdHMgcmVwcmVzZW50YXRpb24uXCIpKSlcblxuKGRlZnVuLSByZWFkLXF1ZXVlXG4gIChpdGVtcylcbiAgKGlmICh2ZWN0b3I/IGl0ZW1zKVxuICAgIGAoUGVyc2lzdGVudFF1ZXVlLiAsaXRlbXMpXG4gICAgKHJlYWRlci1lcnJvclxuICAgICBuaWwgXCJRdWV1ZSBsaXRlcmFsIGV4cGVjdHMgYSB2ZWN0b3IgZm9yIGl0cyBlbGVtZW50cy5cIikpKVxuXG4oZGVmdW4tIHJlYWQtZGF0ZVxuICAoZGF0ZSlcbiAgKGlmIChzdHJpbmc/IGRhdGUpXG4gICAgYChEYXRlLiAsZGF0ZSlcbiAgICAocmVhZGVyLWVycm9yXG4gICAgIG5pbCBcIkRhdGUgbGl0ZXJhbCBleHBlY3RzIGEgc3RyaW5nIGFzIGl0cyByZXByZXNlbnRhdGlvbi5cIikpKVxuXG5cbihkZWZ2YXIgKip0YWctdGFibGUqKlxuICAoZGljdGlvbmFyeSA6dXVpZCAgcmVhZC11dWlkXG4gICAgICAgICAgICAgIDpxdWV1ZSByZWFkLXF1ZXVlXG4gICAgICAgICAgICAgIDppbnN0ICByZWFkLWRhdGUpKVxuXG4oZGVmdW4gbWF5YmUtcmVhZC10YWdnZWQtdHlwZVxuICAocmVhZGVyIGluaXRjaClcbiAgKGxldCogKCh0YWcgKHJlYWQtc3ltYm9sIHJlYWRlciBpbml0Y2gpKVxuICAgICAgICAocGZuIChnZXQgKip0YWctdGFibGUqKiAobmFtZSB0YWcpKSkpXG4gICAgKGlmIHBmblxuICAgICAgKHBmbiAocmVhZCByZWFkZXIgdHJ1ZSBuaWwgZmFsc2UpKVxuICAgICAgKHJlYWRlci1lcnJvciByZWFkZXJcbiAgICAgICAgICAgICAgICAgICAgKHN0ciBcIkNvdWxkIG5vdCBmaW5kIHRhZyBwYXJzZXIgZm9yIFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgKG5hbWUgdGFnKVxuICAgICAgICAgICAgICAgICAgICAgICAgIFwiIGluIFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgKHN0ciAoa2V5cyAqKnRhZy10YWJsZSoqKSkpKSkpKVxuIl19
