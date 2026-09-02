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
            return isNil(lineø1) ? void 0 : lineø1[columnø1] || '\n';
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
        return isBreakingWhitespace(ch) || ',' === ch;
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
                var aø1 = groupsø1[3] ? [
                        groupsø1[3],
                        10
                    ] : groupsø1[4] ? [
                        groupsø1[4],
                        16
                    ] : groupsø1[5] ? [
                        groupsø1[5],
                        8
                    ] : groupsø1[7] ? [
                        groupsø1[7],
                        parseInt(groupsø1[7])
                    ] : 'else' ? [
                        void 0,
                        void 0
                    ] : void 0;
                var nø1 = aø1[0];
                var radixø1 = aø1[1];
                return isNil(nø1) ? void 0 : negateø1 * parseInt(nø1, radixø1);
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
        return reMatches(intPattern, s) ? matchInt(s) : reMatches(ratioPattern, s) ? matchRatio(s) : reMatches(floatPattern, s) ? matchFloat(s) : void 0;
    };
var escapeCharMap = exports.escapeCharMap = function escapeCharMap(c) {
        return c === 't' ? '\t' : c === 'r' ? '\r' : c === 'n' ? '\n' : c === '\\' ? '\\' : c === '"' ? '"' : c === 'b' ? '\b' : c === 'f' ? '\f' : 'else' ? void 0 : void 0;
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
            return mapresultø1 ? mapresultø1 : chø1 === 'x' ? makeUnicodeChar(validateUnicodeEscape(unicode2Pattern, reader, chø1, read2Chars(reader))) : chø1 === 'u' ? makeUnicodeChar(validateUnicodeEscape(unicode4Pattern, reader, chø1, read4Chars(reader))) : isNumeric(chø1) ? char(chø1) : 'else' ? readerError(reader, '' + 'Unexpected unicode escape ' + '\\' + chø1) : void 0;
        }.call(this);
    };
var readPast = exports.readPast = function readPast(predicate, reader) {
        return function loop() {
            var recur = loop;
            var _ø1 = void 0;
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
                    !chø1 ? readerError(reader, 'EOF') : void 0;
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
            return withMeta(list.apply(void 0, formø1), meta(formø1));
        }.call(this);
    };
var readComment = exports.readComment = function readComment(reader, _) {
        return function loop() {
            var recur = loop;
            var bufferø1 = '';
            var chø1 = readChar(reader);
            do {
                recur = isNil(chø1) || '\n' === chø1 ? reader || list(symbol(void 0, 'comment'), bufferø1) : '\\' === chø1 ? (loop[0] = '' + bufferø1 + escapeChar(bufferø1, reader), loop[1] = readChar(reader), loop) : 'else' ? (loop[0] = '' + bufferø1 + chø1, loop[1] = readChar(reader), loop) : void 0;
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
            return isOdd(count(formø1)) ? readerError(reader, 'Map literal must contain an even number of forms') : withMeta(dictionary.apply(void 0, formø1), meta(formø1));
        }.call(this);
    };
var readSet = exports.readSet = function readSet(reader, _) {
        return function () {
            var formø1 = readDelimitedList('}', reader, true);
            return withMeta(concat([symbol(void 0, 'set')], formø1), meta(formø1));
        }.call(this);
    };
var readNumber = exports.readNumber = function readNumber(reader, initch) {
        return function loop() {
            var recur = loop;
            var bufferø1 = initch;
            var chø1 = peekChar(reader);
            do {
                recur = isNil(chø1) || isWhitespace(chø1) || macros(chø1) ? (function () {
                    var match = matchNumber(bufferø1);
                    return isNil(match) ? readerError(reader, 'Invalid number format [', bufferø1, ']') : new Number(match);
                })() : (loop[0] = '' + bufferø1 + readChar(reader), loop[1] = peekChar(reader), loop);
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
                recur = isNil(chø1) ? readerError(reader, 'EOF while reading string') : '\\' === chø1 ? (loop[0] = '' + bufferø1 + escapeChar(bufferø1, reader), loop[1] = readChar(reader), loop) : '"' === chø1 ? new String(bufferø1) : 'default' ? (loop[0] = '' + bufferø1 + chø1, loop[1] = readChar(reader), loop) : void 0;
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
                return list(symbol(void 0, 'unquote-splicing'), read(reader, true, void 0, true));
            })() : list(symbol(void 0, 'unquote'), read(reader, true, void 0, true));
        }.call(this);
    };
var specialSymbols = exports.specialSymbols = function specialSymbols(text, notFound) {
        return text === 'nil' ? void 0 : text === 'true' ? true : text === 'false' ? false : 'else' ? notFound : void 0;
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
            var nsø1 = count(partsø1) > 1 ? join('/', butlast(partsø1)) : void 0;
            var issueø1 = last(nsø1) === ':' ? 'namespace can\'t ends with ":"' : last(nameø1) === ':' ? 'name can\'t end with ":"' : last(nameø1) === '/' ? 'name can\'t end with "/"' : count(split(tokenø1, '::')) > 1 ? 'name can\'t contain "::"' : void 0;
            return issueø1 ? readerError(reader, 'Invalid token (', issueø1, '): ', tokenø1) : !nsø1 && first(nameø1) === ':' ? keyword(rest(nameø1)) : keyword(nsø1, nameø1);
        }.call(this);
    };
var desugarMeta = exports.desugarMeta = function desugarMeta(form) {
        return isKeyword(form) ? dictionary(name(form), true) : isSymbol(form) ? { 'tag': form } : isString(form) ? { 'tag': form } : isDictionary(form) ? reduce(function (result, pair) {
            (result || 0)[name(first(pair))] = second(pair);
            return result;
        }, {}, form) : 'else' ? form : void 0;
    };
var wrappingReader = exports.wrappingReader = function wrappingReader(prefix) {
        return function (reader) {
            return list(prefix, read(reader, true, void 0, true));
        };
    };
var throwingReader = exports.throwingReader = function throwingReader(msg) {
        return function (reader) {
            return readerError(reader, msg);
        };
    };
var readMeta = exports.readMeta = function readMeta(reader, _) {
        return function () {
            var metadataø1 = desugarMeta(read(reader, true, void 0, true));
            !isDictionary(metadataø1) ? readerError(reader, 'Metadata must be Symbol, Keyword, String or Map') : void 0;
            return function () {
                var formø1 = read(reader, true, void 0, true);
                return isObject(formø1) ? withMeta(formø1, conj(metadataø1, meta(formø1))) : formø1;
            }.call(this);
        }.call(this);
    };
var readRegex = exports.readRegex = function readRegex(reader) {
        return function loop() {
            var recur = loop;
            var bufferø1 = '';
            var chø1 = readChar(reader);
            do {
                recur = isNil(chø1) ? readerError(reader, 'EOF while reading string') : '\\' === chø1 ? (loop[0] = '' + bufferø1 + chø1 + readChar(reader), loop[1] = readChar(reader), loop) : '"' === chø1 ? rePattern(bufferø1) : 'default' ? (loop[0] = '' + bufferø1 + chø1, loop[1] = readChar(reader), loop) : void 0;
            } while (bufferø1 = loop[0], chø1 = loop[1], recur === loop);
            return recur;
        }.call(this);
    };
var readParam = exports.readParam = function readParam(reader, initch) {
        return function () {
            var formø1 = readSymbol(reader, initch);
            return isEqual(formø1, symbol('%')) ? symbol('%1') : formø1;
        }.call(this);
    };
var isParam = exports.isParam = function isParam(form) {
        return isSymbol(form) && '%' === first(name(form));
    };
var lambdaParamsHash = exports.lambdaParamsHash = function lambdaParamsHash(form) {
        return isParam(form) ? dictionary(form, form) : isDictionary(form) || isVector(form) || isList(form) ? conj.apply(void 0, map(lambdaParamsHash, vec(form))) : 'else' ? {} : void 0;
    };
var lambdaParams = exports.lambdaParams = function lambdaParams(body) {
        return function () {
            var namesø1 = sort(vals(lambdaParamsHash(body)));
            var variadicø1 = isEqual(first(namesø1), symbol('%&'));
            var nø1 = variadicø1 && count(namesø1) === 1 ? 0 : count(namesø1) === 0 ? 0 : 'else' ? parseInt(rest(name(last(namesø1)))) : void 0;
            var paramsø1 = function loop() {
                    var recur = loop;
                    var namesø2 = [];
                    var iø1 = 1;
                    do {
                        recur = iø1 <= nø1 ? (loop[0] = conj(namesø2, symbol('' + '%' + iø1)), loop[1] = inc(iø1), loop) : namesø2;
                    } while (namesø2 = loop[0], iø1 = loop[1], recur === loop);
                    return recur;
                }.call(this);
            return variadicø1 ? conj(paramsø1, symbol(void 0, '&'), symbol(void 0, '%&')) : namesø1;
        }.call(this);
    };
var readLambda = exports.readLambda = function readLambda(reader) {
        return function () {
            var bodyø1 = readList(reader);
            return list(symbol(void 0, 'fn'), lambdaParams(bodyø1), bodyø1);
        }.call(this);
    };
var readDiscard = exports.readDiscard = function readDiscard(reader, _) {
        read(reader, true, void 0, true);
        return reader;
    };
var macros = exports.macros = function macros(c) {
        return c === '"' ? readString : c === '\\' ? readCharacter : c === ':' ? readKeyword : c === ';' ? readComment : c === '\'' ? wrappingReader(symbol(void 0, 'quote')) : c === '@' ? wrappingReader(symbol(void 0, 'deref')) : c === '^' ? readMeta : c === '`' ? wrappingReader(symbol(void 0, 'syntax-quote')) : c === '~' ? readUnquote : c === '(' ? readList : c === ')' ? readUnmatchedDelimiter : c === '[' ? readVector : c === ']' ? readUnmatchedDelimiter : c === '{' ? readMap : c === '}' ? readUnmatchedDelimiter : c === '%' ? readParam : c === '#' ? readDispatch : 'else' ? void 0 : void 0;
    };
var dispatchMacros = exports.dispatchMacros = function dispatchMacros(s) {
        return s === '{' ? readSet : s === '(' ? readLambda : s === '<' ? throwingReader('Unreadable form') : s === '"' ? readRegex : s === '!' ? readComment : s === '_' ? readDiscard : 'else' ? void 0 : void 0;
    };
var readForm = exports.readForm = function readForm(reader, ch) {
        return function () {
            var startø1 = {
                    'line': (reader || 0)['line'],
                    'column': (reader || 0)['column']
                };
            var readMacroø1 = macros(ch);
            var formø1 = readMacroø1 ? readMacroø1(reader, ch) : isNumberLiteral(reader, ch) ? readNumber(reader, ch) : 'else' ? readSymbol(reader, ch) : void 0;
            var endø1 = {
                    'line': (reader || 0)['line'],
                    'column': inc((reader || 0)['column'])
                };
            var locationø1 = {
                    'uri': (reader || 0)['uri'],
                    'start': startø1,
                    'end': endø1
                };
            return formø1 === reader ? formø1 : !(isBoolean(formø1) || isNil(formø1) || isKeyword(formø1)) ? withMeta(formø1, conj(locationø1, meta(formø1))) : 'else' ? formø1 : void 0;
        }.call(this);
    };
var read = exports.read = function read(reader, eofIsError, sentinel, isRecursive) {
        return function loop() {
            var recur = loop;
            do {
                recur = function () {
                    var chø1 = readChar(reader);
                    var formø1 = isNil(chø1) ? eofIsError ? readerError(reader, 'EOF') : sentinel : isWhitespace(chø1) ? reader : isCommentPrefix(chø1) ? read(readComment(reader, chø1), eofIsError, sentinel, isRecursive) : 'else' ? readForm(reader, chø1) : void 0;
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
            return read(readerø1, true, void 0, false);
        }.call(this);
    };
var readUuid = function readUuid(uuid) {
    return isString(uuid) ? list.apply(void 0, [symbol(void 0, 'UUID.')].concat([uuid])) : readerError(void 0, 'UUID literal expects a string as its representation.');
};
var readQueue = function readQueue(items) {
    return isVector(items) ? list.apply(void 0, [symbol(void 0, 'PersistentQueue.')].concat([items])) : readerError(void 0, 'Queue literal expects a vector for its elements.');
};
var readDate = function readDate(date) {
    return isString(date) ? list.apply(void 0, [symbol(void 0, 'Date.')].concat([date])) : readerError(void 0, 'Date literal expects a string as its representation.');
};
var __tagTable__ = exports.__tagTable__ = dictionary('uuid', readUuid, 'queue', readQueue, 'inst', readDate);
var maybeReadTaggedType = exports.maybeReadTaggedType = function maybeReadTaggedType(reader, initch) {
        return function () {
            var tagø1 = readSymbol(reader, initch);
            var pfnø1 = (__tagTable__ || 0)[name(tagø1)];
            return pfnø1 ? pfnø1(read(reader, true, void 0, false)) : readerError(reader, '' + 'Could not find tag parser for ' + name(tagø1) + ' in ' + ('' + keys(__tagTable__)));
        }.call(this);
    };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndpc3AvcmVhZGVyLndpc3AiXSwibmFtZXMiOlsiX25zXyIsImlkIiwiZG9jIiwibGlzdCIsImlzTGlzdCIsImNvdW50IiwiaXNFbXB0eSIsImZpcnN0Iiwic2Vjb25kIiwidGhpcmQiLCJyZXN0IiwibWFwIiwidmVjIiwiY29ucyIsImNvbmoiLCJjb25jYXQiLCJsYXN0IiwiYnV0bGFzdCIsInNvcnQiLCJyZWR1Y2UiLCJzZXQiLCJpc09kZCIsImRpY3Rpb25hcnkiLCJrZXlzIiwiaXNOaWwiLCJpbmMiLCJkZWMiLCJpc1ZlY3RvciIsImlzU3RyaW5nIiwiaXNOdW1iZXIiLCJpc0Jvb2xlYW4iLCJpc09iamVjdCIsImlzRGljdGlvbmFyeSIsInJlUGF0dGVybiIsInJlTWF0Y2hlcyIsInJlRmluZCIsInN0ciIsInN1YnMiLCJjaGFyIiwidmFscyIsImlzRXF1YWwiLCJpc1N5bWJvbCIsInN5bWJvbCIsImlzS2V5d29yZCIsImtleXdvcmQiLCJtZXRhIiwid2l0aE1ldGEiLCJuYW1lIiwiZ2Vuc3ltIiwic3BsaXQiLCJqb2luIiwicHVzaEJhY2tSZWFkZXIiLCJleHBvcnRzIiwic291cmNlIiwidXJpIiwicGVla0NoYXIiLCJyZWFkZXIiLCJsaW5lw7gxIiwiY29sdW1uw7gxIiwicmVhZENoYXIiLCJjaMO4MSIsImlzTmV3bGluZSIsImNoIiwiaXNCcmVha2luZ1doaXRlc3BhY2UiLCJpc1doaXRlc3BhY2UiLCJpc051bWVyaWMiLCJpc0NvbW1lbnRQcmVmaXgiLCJpc051bWJlckxpdGVyYWwiLCJpbml0Y2giLCJyZWFkZXJFcnJvciIsIm1lc3NhZ2UiLCJ0ZXh0w7gxIiwiZXJyb3LDuDEiLCJTeW50YXhFcnJvciIsImxpbmUiLCJjb2x1bW4iLCJpc01hY3JvVGVybWluYXRpbmciLCJtYWNyb3MiLCJyZWFkVG9rZW4iLCJidWZmZXLDuDEiLCJza2lwTGluZSIsIl8iLCJpbnRQYXR0ZXJuIiwicmF0aW9QYXR0ZXJuIiwiZmxvYXRQYXR0ZXJuIiwibWF0Y2hJbnQiLCJzIiwiZ3JvdXBzw7gxIiwiZ3JvdXAzw7gxIiwibmVnYXRlw7gxIiwiYcO4MSIsInBhcnNlSW50IiwibsO4MSIsInJhZGl4w7gxIiwibWF0Y2hSYXRpbyIsIm51bWluYXRvcsO4MSIsImRlbm9taW5hdG9yw7gxIiwibWF0Y2hGbG9hdCIsInBhcnNlRmxvYXQiLCJtYXRjaE51bWJlciIsImVzY2FwZUNoYXJNYXAiLCJjIiwicmVhZDJDaGFycyIsInJlYWQ0Q2hhcnMiLCJ1bmljb2RlMlBhdHRlcm4iLCJ1bmljb2RlNFBhdHRlcm4iLCJ2YWxpZGF0ZVVuaWNvZGVFc2NhcGUiLCJ1bmljb2RlUGF0dGVybiIsImVzY2FwZUNoYXIiLCJ1bmljb2RlU3RyIiwibWFrZVVuaWNvZGVDaGFyIiwiY29kZVN0ciIsImJhc2UiLCJiYXNlw7gyIiwiY29kZcO4MSIsImJ1ZmZlciIsIm1hcHJlc3VsdMO4MSIsInJlYWRQYXN0IiwicHJlZGljYXRlIiwiX8O4MSIsInJlYWREZWxpbWl0ZWRMaXN0IiwiZGVsaW0iLCJpc1JlY3Vyc2l2ZSIsImZvcm1zw7gxIiwiZm9ybcO4MSIsInJlYWRGb3JtIiwibm90SW1wbGVtZW50ZWQiLCJyZWFkRGlzcGF0Y2giLCJkbcO4MSIsImRpc3BhdGNoTWFjcm9zIiwib2JqZWN0w7gxIiwibWF5YmVSZWFkVGFnZ2VkVHlwZSIsInJlYWRVbm1hdGNoZWREZWxpbWl0ZXIiLCJyZHIiLCJyZWFkTGlzdCIsInJlYWRDb21tZW50IiwicmVhZFZlY3RvciIsInJlYWRNYXAiLCJyZWFkU2V0IiwicmVhZE51bWJlciIsIm1hdGNoIiwicmVhZFN0cmluZyIsInJlYWRDaGFyYWN0ZXIiLCJyZWFkVW5xdW90ZSIsInJlYWQiLCJzcGVjaWFsU3ltYm9scyIsInRleHQiLCJub3RGb3VuZCIsInJlYWRTeW1ib2wiLCJ0b2tlbsO4MSIsInBhcnRzw7gxIiwiaGFzTnPDuDEiLCJuc8O4MSIsIm5hbWXDuDEiLCJyZWFkS2V5d29yZCIsImlzc3Vlw7gxIiwiZGVzdWdhck1ldGEiLCJmb3JtIiwicmVzdWx0IiwicGFpciIsIndyYXBwaW5nUmVhZGVyIiwicHJlZml4IiwidGhyb3dpbmdSZWFkZXIiLCJtc2ciLCJyZWFkTWV0YSIsIm1ldGFkYXRhw7gxIiwicmVhZFJlZ2V4IiwicmVhZFBhcmFtIiwiaXNQYXJhbSIsImxhbWJkYVBhcmFtc0hhc2giLCJsYW1iZGFQYXJhbXMiLCJib2R5IiwibmFtZXPDuDEiLCJ2YXJpYWRpY8O4MSIsInBhcmFtc8O4MSIsIm5hbWVzw7gyIiwiacO4MSIsInJlYWRMYW1iZGEiLCJib2R5w7gxIiwicmVhZERpc2NhcmQiLCJzdGFydMO4MSIsInJlYWRNYWNyb8O4MSIsImVuZMO4MSIsImxvY2F0aW9uw7gxIiwiZW9mSXNFcnJvciIsInNlbnRpbmVsIiwicmVhZF8iLCJyZWFkZXLDuDEiLCJlb2bDuDEiLCJyZWFkRnJvbVN0cmluZyIsInJlYWRVdWlkIiwidXVpZCIsInJlYWRRdWV1ZSIsIml0ZW1zIiwicmVhZERhdGUiLCJkYXRlIiwiX190YWdUYWJsZV9fIiwidGFnw7gxIiwicGZuw7gxIl0sIm1hcHBpbmdzIjoiO0lBQUEsSUFBQ0EsSSxHQUFEO0FBQUEsWUFBQUMsRSxFQUFJLGFBQUo7QUFBQSxZQUFBQyxHLEVBQ0Usb0ZBREY7QUFBQSxVOztRQUdtQ0MsSUFBQSxHLGNBQUFBLEk7UUFBS0MsTUFBQSxHLGNBQUFBLE07UUFBTUMsS0FBQSxHLGNBQUFBLEs7UUFBTUMsT0FBQSxHLGNBQUFBLE87UUFBT0MsS0FBQSxHLGNBQUFBLEs7UUFBTUMsTUFBQSxHLGNBQUFBLE07UUFBT0MsS0FBQSxHLGNBQUFBLEs7UUFDckNDLElBQUEsRyxjQUFBQSxJO1FBQUtDLEdBQUEsRyxjQUFBQSxHO1FBQUlDLEdBQUEsRyxjQUFBQSxHO1FBQUlDLElBQUEsRyxjQUFBQSxJO1FBQUtDLElBQUEsRyxjQUFBQSxJO1FBQUtKLElBQUEsRyxjQUFBQSxJO1FBQUtLLE1BQUEsRyxjQUFBQSxNO1FBQU9DLElBQUEsRyxjQUFBQSxJO1FBQ25DQyxPQUFBLEcsY0FBQUEsTztRQUFRQyxJQUFBLEcsY0FB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LEdBQ0NULElBQUQsQ0FBTXNKLEtBQU4sQyxHQUNBLE1BRkwsR0FHSyxDLEVBQUEsR0FBTTlLLElBQUQsQ0FBTTZLLFlBQU4sQ0FBTCxDQUpuQixDQUZGLENBRkk7QUFBQSxTLEtBQU4sQyxJQUFBO0FBQUEsS0FGRiIsInNvdXJjZXNDb250ZW50IjpbIihucyB3aXNwLnJlYWRlclxuICBcIlJlYWRlciBtb2R1bGUgcHJvdmlkZXMgZnVuY3Rpb25zIGZvciByZWFkaW5nIHRleHQgaW5wdXRcbiAgYXMgd2lzcCBkYXRhIHN0cnVjdHVyZXNcIlxuICAoOnJlcXVpcmUgW3dpc3Auc2VxdWVuY2UgOnJlZmVyIFtsaXN0IGxpc3Q/IGNvdW50IGVtcHR5PyBmaXJzdCBzZWNvbmQgdGhpcmRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdCBtYXAgdmVjIGNvbnMgY29uaiByZXN0IGNvbmNhdCBsYXN0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1dGxhc3Qgc29ydCByZWR1Y2Ugc2V0XV1cbiAgICAgICAgICAgIFt3aXNwLnJ1bnRpbWUgOnJlZmVyIFtvZGQ/IGRpY3Rpb25hcnkga2V5cyBuaWw/IGluYyBkZWMgdmVjdG9yPyBzdHJpbmc/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVtYmVyPyBib29sZWFuPyBvYmplY3Q/IGRpY3Rpb25hcnk/IHJlLXBhdHRlcm5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZS1tYXRjaGVzIHJlLWZpbmQgc3RyIHN1YnMgY2hhciB2YWxzID1dXVxuICAgICAgICAgICAgW3dpc3AuYXN0IDpyZWZlciBbc3ltYm9sPyBzeW1ib2wga2V5d29yZD8ga2V5d29yZCBtZXRhIHdpdGgtbWV0YSBuYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZW5zeW1dXVxuICAgICAgICAgICAgW3dpc3Auc3RyaW5nIDpyZWZlciBbc3BsaXQgam9pbl1dKSlcblxuKGRlZm4gcHVzaC1iYWNrLXJlYWRlclxuICBcIkNyZWF0ZXMgYSBTdHJpbmdQdXNoYmFja1JlYWRlciBmcm9tIGEgZ2l2ZW4gc3RyaW5nXCJcbiAgW3NvdXJjZSB1cmldXG4gIHs6bGluZXMgKHNwbGl0IHNvdXJjZSBcIlxcblwiKSA6YnVmZmVyIFwiXCJcbiAgIDp1cmkgdXJpXG4gICA6Y29sdW1uIC0xIDpsaW5lIDB9KVxuXG4oZGVmbiBwZWVrLWNoYXJcbiAgXCJSZXR1cm5zIG5leHQgY2hhciBmcm9tIHRoZSBSZWFkZXIgd2l0aG91dCByZWFkaW5nIGl0LlxuICBuaWwgaWYgdGhlIGVuZCBvZiBzdHJlYW0gaGFzIGJlaW5nIHJlYWNoZWQuXCJcbiAgW3JlYWRlcl1cbiAgKGxldCBbbGluZSAoYWdldCAoOmxpbmVzIHJlYWRlcilcbiAgICAgICAgICAgICAgICAgICAoOmxpbmUgcmVhZGVyKSlcbiAgICAgICAgY29sdW1uIChpbmMgKDpjb2x1bW4gcmVhZGVyKSldXG4gICAgKGlmIChuaWw/IGxpbmUpXG4gICAgICBuaWxcbiAgICAgIChvciAoYWdldCBsaW5lIGNvbHVtbikgXCJcXG5cIikpKSlcblxuKGRlZm4gcmVhZC1jaGFyXG4gIFwiUmV0dXJucyB0aGUgbmV4dCBjaGFyIGZyb20gdGhlIFJlYWRlciwgbmlsIGlmIHRoZSBlbmRcbiAgb2Ygc3RyZWFtIGhhcyBiZWVuIHJlYWNoZWRcIlxuICBbcmVhZGVyXVxuICAobGV0IFtjaCAocGVlay1jaGFyIHJlYWRlcildXG4gICAgOzsgVXBkYXRlIGxpbmUgY29sdW1uIGRlcGVuZGluZyBvbiB3aGF0IGhhcyBiZWluZyByZWFkLlxuICAgIChpZiAobmV3bGluZT8gKHBlZWstY2hhciByZWFkZXIpKVxuICAgICAgKGRvXG4gICAgICAgIChzZXQhICg6bGluZSByZWFkZXIpIChpbmMgKDpsaW5lIHJlYWRlcikpKVxuICAgICAgICAoc2V0ISAoOmNvbHVtbiByZWFkZXIpIC0xKSlcbiAgICAgIChzZXQhICg6Y29sdW1uIHJlYWRlcikgKGluYyAoOmNvbHVtbiByZWFkZXIpKSkpXG4gICAgY2gpKVxuXG47OyBQcmVkaWNhdGVzXG5cbihkZWZuIF5ib29sZWFuIG5ld2xpbmU/XG4gIFwiQ2hlY2tzIHdoZXRoZXIgdGhlIGNoYXJhY3RlciBpcyBhIG5ld2xpbmUuXCJcbiAgW2NoXVxuICAoaWRlbnRpY2FsPyBcIlxcblwiIGNoKSlcblxuKGRlZm4gXmJvb2xlYW4gYnJlYWtpbmctd2hpdGVzcGFjZT9cbiBcIkNoZWNrcyBpZiBhIHN0cmluZyBpcyBhbGwgYnJlYWtpbmcgd2hpdGVzcGFjZS5cIlxuIFtjaF1cbiAob3IgKGlkZW50aWNhbD8gY2ggXCIgXCIpXG4gICAgIChpZGVudGljYWw/IGNoIFwiXFx0XCIpXG4gICAgIChpZGVudGljYWw/IGNoIFwiXFxuXCIpXG4gICAgIChpZGVudGljYWw/IGNoIFwiXFxyXCIpKSlcblxuKGRlZm4gXmJvb2xlYW4gd2hpdGVzcGFjZT9cbiAgXCJDaGVja3Mgd2hldGhlciBhIGdpdmVuIGNoYXJhY3RlciBpcyB3aGl0ZXNwYWNlXCJcbiAgW2NoXVxuICAob3IgKGJyZWFraW5nLXdoaXRlc3BhY2U/IGNoKSAoaWRlbnRpY2FsPyBcIixcIiBjaCkpKVxuXG4oZGVmbiBeYm9vbGVhbiBudW1lcmljP1xuIFwiQ2hlY2tzIHdoZXRoZXIgYSBnaXZlbiBjaGFyYWN0ZXIgaXMgbnVtZXJpY1wiXG4gW2NoXVxuIChvciAoaWRlbnRpY2FsPyBjaCBcXDApXG4gICAgIChpZGVudGljYWw/IGNoIFxcMSlcbiAgICAgKGlkZW50aWNhbD8gY2ggXFwyKVxuICAgICAoaWRlbnRpY2FsPyBjaCBcXDMpXG4gICAgIChpZGVudGljYWw/IGNoIFxcNClcbiAgICAgKGlkZW50aWNhbD8gY2ggXFw1KVxuICAgICAoaWRlbnRpY2FsPyBjaCBcXDYpXG4gICAgIChpZGVudGljYWw/IGNoIFxcNylcbiAgICAgKGlkZW50aWNhbD8gY2ggXFw4KVxuICAgICAoaWRlbnRpY2FsPyBjaCBcXDkpKSlcblxuKGRlZm4gXmJvb2xlYW4gY29tbWVudC1wcmVmaXg/XG4gIFwiQ2hlY2tzIHdoZXRoZXIgdGhlIGNoYXJhY3RlciBiZWdpbnMgYSBjb21tZW50LlwiXG4gIFtjaF1cbiAgKGlkZW50aWNhbD8gXCI7XCIgY2gpKVxuXG5cbihkZWZuIF5ib29sZWFuIG51bWJlci1saXRlcmFsP1xuICBcIkNoZWNrcyB3aGV0aGVyIHRoZSByZWFkZXIgaXMgYXQgdGhlIHN0YXJ0IG9mIGEgbnVtYmVyIGxpdGVyYWxcIlxuICBbcmVhZGVyIGluaXRjaF1cbiAgKG9yIChudW1lcmljPyBpbml0Y2gpXG4gICAgICAoYW5kIChvciAoaWRlbnRpY2FsPyBcXCsgaW5pdGNoKVxuICAgICAgICAgICAgICAgKGlkZW50aWNhbD8gXFwtIGluaXRjaCkpXG4gICAgICAgICAgIChudW1lcmljPyAocGVlay1jaGFyIHJlYWRlcikpKSkpXG5cblxuXG47OyByZWFkIGhlbHBlcnNcblxuKGRlZm4gcmVhZGVyLWVycm9yXG4gIFtyZWFkZXIgbWVzc2FnZV1cbiAgKGxldCBbdGV4dCAoc3RyIG1lc3NhZ2VcbiAgICAgICAgICAgICAgICAgIFwiXFxuXCIgXCJsaW5lOlwiICg6bGluZSByZWFkZXIpXG4gICAgICAgICAgICAgICAgICBcIlxcblwiIFwiY29sdW1uOlwiICg6Y29sdW1uIHJlYWRlcikpXG4gICAgICAgIGVycm9yIChTeW50YXhFcnJvciB0ZXh0ICg6dXJpIHJlYWRlcikpXVxuICAgIChzZXQhIGVycm9yLmxpbmUgKDpsaW5lIHJlYWRlcikpXG4gICAgKHNldCEgZXJyb3IuY29sdW1uICg6Y29sdW1uIHJlYWRlcikpXG4gICAgKHNldCEgZXJyb3IudXJpICg6dXJpIHJlYWRlcikpXG4gICAgKHRocm93IGVycm9yKSkpXG5cbihkZWZuIF5ib29sZWFuIG1hY3JvLXRlcm1pbmF0aW5nPyBbY2hdXG4gIChhbmQgKG5vdCAoaWRlbnRpY2FsPyBjaCBcIiNcIikpXG4gICAgICAgKG5vdCAoaWRlbnRpY2FsPyBjaCBcIidcIikpXG4gICAgICAgKG5vdCAoaWRlbnRpY2FsPyBjaCBcIjpcIikpXG4gICAgICAgKG1hY3JvcyBjaCkpKVxuXG5cbihkZWZuIHJlYWQtdG9rZW5cbiAgXCJSZWFkcyBvdXQgbmV4dCB0b2tlbiBmcm9tIHRoZSByZWFkZXIgc3RyZWFtXCJcbiAgW3JlYWRlciBpbml0Y2hdXG4gIChsb29wIFtidWZmZXIgaW5pdGNoXG4gICAgICAgICBjaCAocGVlay1jaGFyIHJlYWRlcildXG5cbiAgICAoaWYgKG9yIChuaWw/IGNoKVxuICAgICAgICAgICAgKHdoaXRlc3BhY2U/IGNoKVxuICAgICAgICAgICAgKG1hY3JvLXRlcm1pbmF0aW5nPyBjaCkpIGJ1ZmZlclxuICAgICAgICAocmVjdXIgKHN0ciBidWZmZXIgKHJlYWQtY2hhciByZWFkZXIpKVxuICAgICAgICAgICAgICAgKHBlZWstY2hhciByZWFkZXIpKSkpKVxuXG4oZGVmbiBza2lwLWxpbmVcbiAgXCJBZHZhbmNlcyB0aGUgcmVhZGVyIHRvIHRoZSBlbmQgb2YgYSBsaW5lLiBSZXR1cm5zIHRoZSByZWFkZXJcIlxuICBbcmVhZGVyIF9dXG4gIChsb29wIFtdXG4gICAgKGxldCBbY2ggKHJlYWQtY2hhciByZWFkZXIpXVxuICAgICAgKGlmIChvciAoaWRlbnRpY2FsPyBjaCBcIlxcblwiKVxuICAgICAgICAgICAgICAoaWRlbnRpY2FsPyBjaCBcIlxcclwiKVxuICAgICAgICAgICAgICAobmlsPyBjaCkpXG4gICAgICAgIHJlYWRlclxuICAgICAgICAocmVjdXIpKSkpKVxuXG5cbjs7IE5vdGU6IElucHV0IGJlZ2luIGFuZCBlbmQgbWF0Y2hlcnMgYXJlIHVzZWQgaW4gYSBwYXR0ZXJuIHNpbmNlIG90aGVyd2lzZVxuOzsgYW55dGhpbmcgYmVnaW5pbm5nIHdpdGggYDBgIHdpbGwgbWF0Y2gganVzdCBgMGAgY2F1c2UgaXQncyBsaXN0ZWQgZmlyc3QuXG4oZGVmIGludC1wYXR0ZXJuIChyZS1wYXR0ZXJuIFwiXihbLStdPykoPzooMCl8KFsxLTldWzAtOV0qKXwwW3hYXShbMC05QS1GYS1mXSspfDAoWzAtN10rKXwoWzEtOV1bMC05XT8pW3JSXShbMC05QS1aYS16XSspfDBbMC05XSspKE4pPyRcIikpXG4oZGVmIHJhdGlvLXBhdHRlcm4gKHJlLXBhdHRlcm4gXCIoWy0rXT9bMC05XSspLyhbMC05XSspXCIpKVxuKGRlZiBmbG9hdC1wYXR0ZXJuIChyZS1wYXR0ZXJuIFwiKFstK10/WzAtOV0rKFxcXFwuWzAtOV0qKT8oW2VFXVstK10/WzAtOV0rKT8pKE0pP1wiKSlcblxuKGRlZm4gbWF0Y2gtaW50XG4gIFtzXVxuICAobGV0IFtncm91cHMgKHJlLWZpbmQgaW50LXBhdHRlcm4gcylcbiAgICAgICAgZ3JvdXAzIChhZ2V0IGdyb3VwcyAyKV1cbiAgICAoaWYgKG5vdCAob3IgKG5pbD8gZ3JvdXAzKVxuICAgICAgICAgICAgICAgICAoPCAoY291bnQgZ3JvdXAzKSAxKSkpXG4gICAgICAwXG4gICAgICAobGV0IFtuZWdhdGUgKGlmIChpZGVudGljYWw/IFwiLVwiIChhZ2V0IGdyb3VwcyAxKSkgLTEgMSlcbiAgICAgICAgICAgIGEgKGNvbmRcbiAgICAgICAgICAgICAgIChhZ2V0IGdyb3VwcyAzKSBbKGFnZXQgZ3JvdXBzIDMpIDEwXVxuICAgICAgICAgICAgICAgKGFnZXQgZ3JvdXBzIDQpIFsoYWdldCBncm91cHMgNCkgMTZdXG4gICAgICAgICAgICAgICAoYWdldCBncm91cHMgNSkgWyhhZ2V0IGdyb3VwcyA1KSA4XVxuICAgICAgICAgICAgICAgKGFnZXQgZ3JvdXBzIDcpIFsoYWdldCBncm91cHMgNykgKHBhcnNlLWludCAoYWdldCBncm91cHMgNykpXVxuICAgICAgICAgICAgICAgOmVsc2UgW25pbCBuaWxdKVxuICAgICAgICAgICAgbiAoYWdldCBhIDApXG4gICAgICAgICAgICByYWRpeCAoYWdldCBhIDEpXVxuICAgICAgICAoaWYgKG5pbD8gbilcbiAgICAgICAgICBuaWxcbiAgICAgICAgICAoKiBuZWdhdGUgKHBhcnNlLWludCBuIHJhZGl4KSkpKSkpKVxuXG4oZGVmbiBtYXRjaC1yYXRpb1xuICBbc11cbiAgKGxldCBbZ3JvdXBzIChyZS1maW5kIHJhdGlvLXBhdHRlcm4gcylcbiAgICAgICAgbnVtaW5hdG9yIChhZ2V0IGdyb3VwcyAxKVxuICAgICAgICBkZW5vbWluYXRvciAoYWdldCBncm91cHMgMildXG4gICAgKC8gKHBhcnNlLWludCBudW1pbmF0b3IpIChwYXJzZS1pbnQgZGVub21pbmF0b3IpKSkpXG5cbihkZWZuIG1hdGNoLWZsb2F0XG4gIFtzXVxuICAocGFyc2UtZmxvYXQgcykpXG5cblxuKGRlZm4gbWF0Y2gtbnVtYmVyXG4gIFtzXVxuICAoY29uZFxuICAgKHJlLW1hdGNoZXMgaW50LXBhdHRlcm4gcykgKG1hdGNoLWludCBzKVxuICAgKHJlLW1hdGNoZXMgcmF0aW8tcGF0dGVybiBzKSAobWF0Y2gtcmF0aW8gcylcbiAgIChyZS1tYXRjaGVzIGZsb2F0LXBhdHRlcm4gcykgKG1hdGNoLWZsb2F0IHMpKSlcblxuKGRlZm4gZXNjYXBlLWNoYXItbWFwIFtjXVxuICAoY29uZFxuICAgKGlkZW50aWNhbD8gYyBcXHQpIFwiXFx0XCJcbiAgIChpZGVudGljYWw/IGMgXFxyKSBcIlxcclwiXG4gICAoaWRlbnRpY2FsPyBjIFxcbikgXCJcXG5cIlxuICAgKGlkZW50aWNhbD8gYyBcXFxcKSBcXFxcXG4gICAoaWRlbnRpY2FsPyBjIFwiXFxcIlwiKSBcIlxcXCJcIlxuICAgKGlkZW50aWNhbD8gYyBcXGIpIFwiXFxiXCJcbiAgIChpZGVudGljYWw/IGMgXFxmKSBcIlxcZlwiXG4gICA6ZWxzZSBuaWwpKVxuXG47OyB1bmljb2RlXG5cbihkZWZuIHJlYWQtMi1jaGFycyBbcmVhZGVyXVxuICAoc3RyIChyZWFkLWNoYXIgcmVhZGVyKVxuICAgICAgIChyZWFkLWNoYXIgcmVhZGVyKSkpXG5cbihkZWZuIHJlYWQtNC1jaGFycyBbcmVhZGVyXVxuICAoc3RyIChyZWFkLWNoYXIgcmVhZGVyKVxuICAgICAgIChyZWFkLWNoYXIgcmVhZGVyKVxuICAgICAgIChyZWFkLWNoYXIgcmVhZGVyKVxuICAgICAgIChyZWFkLWNoYXIgcmVhZGVyKSkpXG5cbihkZWYgdW5pY29kZS0yLXBhdHRlcm4gKHJlLXBhdHRlcm4gXCJbMC05QS1GYS1mXXsyfVwiKSlcbihkZWYgdW5pY29kZS00LXBhdHRlcm4gKHJlLXBhdHRlcm4gXCJbMC05QS1GYS1mXXs0fVwiKSlcblxuXG4oZGVmbiB2YWxpZGF0ZS11bmljb2RlLWVzY2FwZVxuICBcIlZhbGlkYXRlcyB1bmljb2RlIGVzY2FwZVwiXG4gIFt1bmljb2RlLXBhdHRlcm4gcmVhZGVyIGVzY2FwZS1jaGFyIHVuaWNvZGUtc3RyXVxuICAoaWYgKHJlLW1hdGNoZXMgdW5pY29kZS1wYXR0ZXJuIHVuaWNvZGUtc3RyKVxuICAgIHVuaWNvZGUtc3RyXG4gICAgKHJlYWRlci1lcnJvclxuICAgICByZWFkZXJcbiAgICAgKHN0ciBcIlVuZXhwZWN0ZWQgdW5pY29kZSBlc2NhcGUgXCIgXFxcXCBlc2NhcGUtY2hhciB1bmljb2RlLXN0cikpKSlcblxuXG4oZGVmbiBtYWtlLXVuaWNvZGUtY2hhclxuICBbY29kZS1zdHIgYmFzZV1cbiAgKGxldCBbYmFzZSAob3IgYmFzZSAxNilcbiAgICAgICAgY29kZSAocGFyc2VJbnQgY29kZS1zdHIgYmFzZSldXG4gICAgKGNoYXIgY29kZSkpKVxuXG4oZGVmbiBlc2NhcGUtY2hhclxuICBcImVzY2FwZSBjaGFyXCJcbiAgW2J1ZmZlciByZWFkZXJdXG4gIChsZXQgW2NoIChyZWFkLWNoYXIgcmVhZGVyKVxuICAgICAgICBtYXByZXN1bHQgKGVzY2FwZS1jaGFyLW1hcCBjaCldXG4gICAgKGlmIG1hcHJlc3VsdFxuICAgICAgbWFwcmVzdWx0XG4gICAgICAoY29uZFxuICAgICAgICAoaWRlbnRpY2FsPyBjaCBcXHgpIChtYWtlLXVuaWNvZGUtY2hhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2YWxpZGF0ZS11bmljb2RlLWVzY2FwZSB1bmljb2RlLTItcGF0dGVyblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWFkZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHJlYWQtMi1jaGFycyByZWFkZXIpKSlcbiAgICAgICAgKGlkZW50aWNhbD8gY2ggXFx1KSAobWFrZS11bmljb2RlLWNoYXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAodmFsaWRhdGUtdW5pY29kZS1lc2NhcGUgdW5pY29kZS00LXBhdHRlcm5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVhZGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChyZWFkLTQtY2hhcnMgcmVhZGVyKSkpXG4gICAgICAgIChudW1lcmljPyBjaCkgKGNoYXIgY2gpXG4gICAgICAgIDplbHNlIChyZWFkZXItZXJyb3IgcmVhZGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKHN0ciBcIlVuZXhwZWN0ZWQgdW5pY29kZSBlc2NhcGUgXCIgXFxcXCBjaCApKSkpKSlcblxuKGRlZm4gcmVhZC1wYXN0XG4gIFwiUmVhZCB1bnRpbCBmaXJzdCBjaGFyYWN0ZXIgdGhhdCBkb2Vzbid0IG1hdGNoIHByZWQsIHJldHVybmluZ1xuICBjaGFyLlwiXG4gIFtwcmVkaWNhdGUgcmVhZGVyXVxuICAobG9vcCBbXyBuaWxdXG4gICAgKGlmIChwcmVkaWNhdGUgKHBlZWstY2hhciByZWFkZXIpKVxuICAgICAgKHJlY3VyIChyZWFkLWNoYXIgcmVhZGVyKSlcbiAgICAgIChwZWVrLWNoYXIgcmVhZGVyKSkpKVxuXG5cbjs7IFRPRE86IENvbXBsZXRlIGltcGxlbWVudGF0aW9uXG4oZGVmbiByZWFkLWRlbGltaXRlZC1saXN0XG4gIFwiUmVhZHMgb3V0IGRlbGltaXRlZCBsaXN0XCJcbiAgW2RlbGltIHJlYWRlciByZWN1cnNpdmU/XVxuICAobG9vcCBbZm9ybXMgW11dXG4gICAgKGxldCBbXyAocmVhZC1wYXN0IHdoaXRlc3BhY2U/IHJlYWRlcilcbiAgICAgICAgICBjaCAocmVhZC1jaGFyIHJlYWRlcildXG4gICAgICAoaWYgKG5vdCBjaCkgKHJlYWRlci1lcnJvciByZWFkZXIgOkVPRikpXG4gICAgICAoaWYgKGlkZW50aWNhbD8gZGVsaW0gY2gpXG4gICAgICAgIGZvcm1zXG4gICAgICAgIChsZXQgW2Zvcm0gKHJlYWQtZm9ybSByZWFkZXIgY2gpXVxuICAgICAgICAgIChyZWN1ciAoaWYgKGlkZW50aWNhbD8gZm9ybSByZWFkZXIpXG4gICAgICAgICAgICAgICAgICAgZm9ybXNcbiAgICAgICAgICAgICAgICAgICAoY29uaiBmb3JtcyBmb3JtKSkpKSkpKSlcblxuOzsgZGF0YSBzdHJ1Y3R1cmUgcmVhZGVyc1xuXG4oZGVmbiBub3QtaW1wbGVtZW50ZWRcbiAgW3JlYWRlciBjaF1cbiAgKHJlYWRlci1lcnJvciByZWFkZXIgKHN0ciBcIlJlYWRlciBmb3IgXCIgY2ggXCIgbm90IGltcGxlbWVudGVkIHlldFwiKSkpXG5cblxuKGRlZm4gcmVhZC1kaXNwYXRjaFxuICBbcmVhZGVyIF9dXG4gIChsZXQgW2NoIChyZWFkLWNoYXIgcmVhZGVyKVxuICAgICAgICBkbSAoZGlzcGF0Y2gtbWFjcm9zIGNoKV1cbiAgICAoaWYgZG1cbiAgICAgIChkbSByZWFkZXIgXylcbiAgICAgIChsZXQgW29iamVjdCAobWF5YmUtcmVhZC10YWdnZWQtdHlwZSByZWFkZXIgY2gpXVxuICAgICAgICAoaWYgb2JqZWN0XG4gICAgICAgICAgb2JqZWN0XG4gICAgICAgICAgKHJlYWRlci1lcnJvciByZWFkZXIgXCJObyBkaXNwYXRjaCBtYWNybyBmb3IgXCIgY2gpKSkpKSlcblxuKGRlZm4gcmVhZC11bm1hdGNoZWQtZGVsaW1pdGVyXG4gIFtyZHIgY2hdXG4gIChyZWFkZXItZXJyb3IgcmRyIFwiVW5tYXRjaGVkIGRlbGltaXRlciBcIiBjaCkpXG5cbihkZWZuIHJlYWQtbGlzdFxuICBbcmVhZGVyIF9dXG4gIChsZXQgW2Zvcm0gKHJlYWQtZGVsaW1pdGVkLWxpc3QgXCIpXCIgcmVhZGVyIHRydWUpXVxuICAgICh3aXRoLW1ldGEgKGFwcGx5IGxpc3QgZm9ybSkgKG1ldGEgZm9ybSkpKSlcblxuKGRlZm4gcmVhZC1jb21tZW50XG4gIFtyZWFkZXIgX11cbiAgKGxvb3AgW2J1ZmZlciBcIlwiXG4gICAgICAgICBjaCAocmVhZC1jaGFyIHJlYWRlcildXG5cbiAgICAoY29uZFxuICAgICAob3IgKG5pbD8gY2gpXG4gICAgICAgICAoaWRlbnRpY2FsPyBcIlxcblwiIGNoKSkgKG9yIHJlYWRlciA7OyBpZ25vcmUgY29tbWVudHMgZm9yIG5vd1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAobGlzdCAnY29tbWVudCBidWZmZXIpKVxuICAgICAob3IgKGlkZW50aWNhbD8gXFxcXCBjaCkpIChyZWN1ciAoc3RyIGJ1ZmZlciAoZXNjYXBlLWNoYXIgYnVmZmVyIHJlYWRlcikpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAocmVhZC1jaGFyIHJlYWRlcikpXG4gICAgIDplbHNlIChyZWN1ciAoc3RyIGJ1ZmZlciBjaCkgKHJlYWQtY2hhciByZWFkZXIpKSkpKVxuXG4oZGVmbiByZWFkLXZlY3RvclxuICBbcmVhZGVyXVxuICAocmVhZC1kZWxpbWl0ZWQtbGlzdCBcIl1cIiByZWFkZXIgdHJ1ZSkpXG5cbihkZWZuIHJlYWQtbWFwXG4gIFtyZWFkZXJdXG4gIChsZXQgW2Zvcm0gKHJlYWQtZGVsaW1pdGVkLWxpc3QgXCJ9XCIgcmVhZGVyIHRydWUpXVxuICAgIChpZiAob2RkPyAoY291bnQgZm9ybSkpXG4gICAgICAocmVhZGVyLWVycm9yIHJlYWRlciBcIk1hcCBsaXRlcmFsIG11c3QgY29udGFpbiBhbiBldmVuIG51bWJlciBvZiBmb3Jtc1wiKVxuICAgICAgKHdpdGgtbWV0YSAoYXBwbHkgZGljdGlvbmFyeSBmb3JtKSAobWV0YSBmb3JtKSkpKSlcblxuKGRlZm4gcmVhZC1zZXRcbiAgW3JlYWRlciBfXVxuICAobGV0IFtmb3JtIChyZWFkLWRlbGltaXRlZC1saXN0IFwifVwiIHJlYWRlciB0cnVlKV1cbiAgICAod2l0aC1tZXRhIChjb25jYXQgWydzZXRdIGZvcm0pIChtZXRhIGZvcm0pKSkpXG5cbihkZWZuIHJlYWQtbnVtYmVyXG4gIFtyZWFkZXIgaW5pdGNoXVxuICAobG9vcCBbYnVmZmVyIGluaXRjaFxuICAgICAgICAgY2ggKHBlZWstY2hhciByZWFkZXIpXVxuXG4gICAgKGlmIChvciAobmlsPyBjaClcbiAgICAgICAgICAgICh3aGl0ZXNwYWNlPyBjaClcbiAgICAgICAgICAgIChtYWNyb3MgY2gpKVxuICAgICAgKGRvXG4gICAgICAgIChkZWYgbWF0Y2ggKG1hdGNoLW51bWJlciBidWZmZXIpKVxuICAgICAgICAoaWYgKG5pbD8gbWF0Y2gpXG4gICAgICAgICAgICAocmVhZGVyLWVycm9yIHJlYWRlciBcIkludmFsaWQgbnVtYmVyIGZvcm1hdCBbXCIgYnVmZmVyIFwiXVwiKVxuICAgICAgICAgICAgKE51bWJlci4gbWF0Y2gpKSlcbiAgICAgIChyZWN1ciAoc3RyIGJ1ZmZlciAocmVhZC1jaGFyIHJlYWRlcikpXG4gICAgICAgICAgICAgKHBlZWstY2hhciByZWFkZXIpKSkpKVxuXG4oZGVmbiByZWFkLXN0cmluZ1xuICBbcmVhZGVyXVxuICAobG9vcCBbYnVmZmVyIFwiXCJcbiAgICAgICAgIGNoIChyZWFkLWNoYXIgcmVhZGVyKV1cblxuICAgIChjb25kXG4gICAgIChuaWw/IGNoKSAocmVhZGVyLWVycm9yIHJlYWRlciBcIkVPRiB3aGlsZSByZWFkaW5nIHN0cmluZ1wiKVxuICAgICAoaWRlbnRpY2FsPyBcXFxcIGNoKSAocmVjdXIgKHN0ciBidWZmZXIgKGVzY2FwZS1jaGFyIGJ1ZmZlciByZWFkZXIpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChyZWFkLWNoYXIgcmVhZGVyKSlcbiAgICAgKGlkZW50aWNhbD8gXCJcXFwiXCIgY2gpIChTdHJpbmcuIGJ1ZmZlcilcbiAgICAgOmRlZmF1bHQgKHJlY3VyIChzdHIgYnVmZmVyIGNoKSAocmVhZC1jaGFyIHJlYWRlcikpKSkpXG5cbihkZWZuIHJlYWQtY2hhcmFjdGVyXG4gIFtyZWFkZXJdXG4gIChTdHJpbmcuIChyZWFkLWNoYXIgcmVhZGVyKSkpXG5cbihkZWZuIHJlYWQtdW5xdW90ZVxuICBcIlJlYWRzIHVucXVvdGUgZm9ybSB+Zm9ybSBvciB+KGZvbyBiYXIpXCJcbiAgW3JlYWRlcl1cbiAgKGxldCBbY2ggKHBlZWstY2hhciByZWFkZXIpXVxuICAgIChpZiAobm90IGNoKVxuICAgICAgKHJlYWRlci1lcnJvciByZWFkZXIgXCJFT0Ygd2hpbGUgcmVhZGluZyBjaGFyYWN0ZXJcIilcbiAgICAgIChpZiAoaWRlbnRpY2FsPyBjaCBcXEApXG4gICAgICAgIChkbyAocmVhZC1jaGFyIHJlYWRlcilcbiAgICAgICAgICAgIChsaXN0ICd1bnF1b3RlLXNwbGljaW5nIChyZWFkIHJlYWRlciB0cnVlIG5pbCB0cnVlKSkpXG4gICAgICAgIChsaXN0ICd1bnF1b3RlIChyZWFkIHJlYWRlciB0cnVlIG5pbCB0cnVlKSkpKSkpXG5cblxuKGRlZm4gc3BlY2lhbC1zeW1ib2xzIFt0ZXh0IG5vdC1mb3VuZF1cbiAgKGNvbmRcbiAgIChpZGVudGljYWw/IHRleHQgXCJuaWxcIikgbmlsXG4gICAoaWRlbnRpY2FsPyB0ZXh0IFwidHJ1ZVwiKSB0cnVlXG4gICAoaWRlbnRpY2FsPyB0ZXh0IFwiZmFsc2VcIikgZmFsc2VcbiAgIDplbHNlIG5vdC1mb3VuZCkpXG5cblxuKGRlZm4gcmVhZC1zeW1ib2xcbiAgW3JlYWRlciBpbml0Y2hdXG4gIChsZXQgW3Rva2VuIChyZWFkLXRva2VuIHJlYWRlciBpbml0Y2gpXG4gICAgICAgIHBhcnRzIChzcGxpdCB0b2tlbiBcIi9cIilcbiAgICAgICAgaGFzLW5zIChhbmQgKD4gKGNvdW50IHBhcnRzKSAxKVxuICAgICAgICAgICAgICAgICAgICA7OyBNYWtlIHN1cmUgaXQncyBub3QganVzdCBgL2BcbiAgICAgICAgICAgICAgICAgICAgKD4gKGNvdW50IHRva2VuKSAxKSlcbiAgICAgICAgbnMgKGZpcnN0IHBhcnRzKVxuICAgICAgICBuYW1lIChqb2luIFwiL1wiIChyZXN0IHBhcnRzKSldXG4gICAgKGlmIGhhcy1uc1xuICAgICAgKHN5bWJvbCBucyBuYW1lKVxuICAgICAgKHNwZWNpYWwtc3ltYm9scyB0b2tlbiAoc3ltYm9sIHRva2VuKSkpKSlcblxuKGRlZm4gcmVhZC1rZXl3b3JkXG4gIFtyZWFkZXIgaW5pdGNoXVxuICAobGV0IFt0b2tlbiAocmVhZC10b2tlbiByZWFkZXIgKHJlYWQtY2hhciByZWFkZXIpKVxuICAgICAgICBwYXJ0cyAoc3BsaXQgdG9rZW4gXCIvXCIpXG4gICAgICAgIG5hbWUgKGxhc3QgcGFydHMpXG4gICAgICAgIG5zIChpZiAoPiAoY291bnQgcGFydHMpIDEpIChqb2luIFwiL1wiIChidXRsYXN0IHBhcnRzKSkpXG4gICAgICAgIGlzc3VlIChjb25kXG4gICAgICAgICAgICAgICAoaWRlbnRpY2FsPyAobGFzdCBucykgXFw6KSBcIm5hbWVzcGFjZSBjYW4ndCBlbmRzIHdpdGggXFxcIjpcXFwiXCJcbiAgICAgICAgICAgICAgIChpZGVudGljYWw/IChsYXN0IG5hbWUpIFxcOikgXCJuYW1lIGNhbid0IGVuZCB3aXRoIFxcXCI6XFxcIlwiXG4gICAgICAgICAgICAgICAoaWRlbnRpY2FsPyAobGFzdCBuYW1lKSBcXC8pIFwibmFtZSBjYW4ndCBlbmQgd2l0aCBcXFwiL1xcXCJcIlxuICAgICAgICAgICAgICAgKD4gKGNvdW50IChzcGxpdCB0b2tlbiBcIjo6XCIpKSAxKSBcIm5hbWUgY2FuJ3QgY29udGFpbiBcXFwiOjpcXFwiXCIpXVxuICAgIChpZiBpc3N1ZVxuICAgICAgKHJlYWRlci1lcnJvciByZWFkZXIgXCJJbnZhbGlkIHRva2VuIChcIiBpc3N1ZSBcIik6IFwiIHRva2VuKVxuICAgICAgKGlmIChhbmQgKG5vdCBucykgKGlkZW50aWNhbD8gKGZpcnN0IG5hbWUpIFxcOikpXG4gICAgICAgIChrZXl3b3JkIDsqbnMtc3ltKlxuICAgICAgICAgIChyZXN0IG5hbWUpKSA7OyBuYW1lc3BhY2VkIGtleXdvcmQgdXNpbmcgZGVmYXVsdFxuICAgICAgICAoa2V5d29yZCBucyBuYW1lKSkpKSlcblxuKGRlZm4gZGVzdWdhci1tZXRhXG4gIFtmb3JtXVxuICA7OyBrZXl3b3JkIHNob3VsZCBnbyBiZWZvcmUgc3RyaW5nIHNpbmNlIGl0IGlzIGEgc3RyaW5nLlxuICAoY29uZCAoa2V5d29yZD8gZm9ybSkgKGRpY3Rpb25hcnkgKG5hbWUgZm9ybSkgdHJ1ZSlcbiAgICAgICAgKHN5bWJvbD8gZm9ybSkgezp0YWcgZm9ybX1cbiAgICAgICAgKHN0cmluZz8gZm9ybSkgezp0YWcgZm9ybX1cbiAgICAgICAgKGRpY3Rpb25hcnk/IGZvcm0pIChyZWR1Y2UgKGZuIFtyZXN1bHQgcGFpcl1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoc2V0ISAoZ2V0IHJlc3VsdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG5hbWUgKGZpcnN0IHBhaXIpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoc2Vjb25kIHBhaXIpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9ybSlcbiAgICAgICAgOmVsc2UgZm9ybSkpXG5cbihkZWZuIHdyYXBwaW5nLXJlYWRlclxuICBbcHJlZml4XVxuICAoZm4gW3JlYWRlcl1cbiAgICAobGlzdCBwcmVmaXggKHJlYWQgcmVhZGVyIHRydWUgbmlsIHRydWUpKSkpXG5cbihkZWZuIHRocm93aW5nLXJlYWRlclxuICBbbXNnXVxuICAoZm4gW3JlYWRlcl1cbiAgICAocmVhZGVyLWVycm9yIHJlYWRlciBtc2cpKSlcblxuKGRlZm4gcmVhZC1tZXRhXG4gIFtyZWFkZXIgX11cbiAgKGxldCBbbWV0YWRhdGEgKGRlc3VnYXItbWV0YSAocmVhZCByZWFkZXIgdHJ1ZSBuaWwgdHJ1ZSkpXVxuICAgIChpZiAobm90IChkaWN0aW9uYXJ5PyBtZXRhZGF0YSkpXG4gICAgICAocmVhZGVyLWVycm9yIHJlYWRlciBcIk1ldGFkYXRhIG11c3QgYmUgU3ltYm9sLCBLZXl3b3JkLCBTdHJpbmcgb3IgTWFwXCIpKVxuICAgIChsZXQgW2Zvcm0gKHJlYWQgcmVhZGVyIHRydWUgbmlsIHRydWUpXVxuICAgICAgKGlmIChvYmplY3Q/IGZvcm0pXG4gICAgICAgICh3aXRoLW1ldGEgZm9ybSAoY29uaiBtZXRhZGF0YSAobWV0YSBmb3JtKSkpXG4gICAgICAgIDsocmVhZGVyLWVycm9yXG4gICAgICAgIDsgcmVhZGVyIFwiTWV0YWRhdGEgY2FuIG9ubHkgYmUgYXBwbGllZCB0byBJV2l0aE1ldGFzXCIpXG5cbiAgICAgICAgZm9ybSA7IEZvciBub3cgd2UgZG9uJ3QgdGhyb3cgZXJyb3JzIGFzIHdlIGNhbid0IGFwcGx5IG1ldGFkYXRhIHRvXG4gICAgICAgICAgICAgOyBzeW1ib2xzLCBzbyB3ZSBqdXN0IGlnbm9yZSBpdC5cbiAgICAgICAgKSkpKVxuXG4oZGVmbiByZWFkLXJlZ2V4XG4gIFtyZWFkZXJdXG4gIChsb29wIFtidWZmZXIgXCJcIlxuICAgICAgICAgY2ggKHJlYWQtY2hhciByZWFkZXIpXVxuXG4gICAgKGNvbmRcbiAgICAgKG5pbD8gY2gpIChyZWFkZXItZXJyb3IgcmVhZGVyIFwiRU9GIHdoaWxlIHJlYWRpbmcgc3RyaW5nXCIpXG4gICAgIChpZGVudGljYWw/IFxcXFwgY2gpIChyZWN1ciAoc3RyIGJ1ZmZlciBjaCAocmVhZC1jaGFyIHJlYWRlcikpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHJlYWQtY2hhciByZWFkZXIpKVxuICAgICAoaWRlbnRpY2FsPyBcIlxcXCJcIiBjaCkgKHJlLXBhdHRlcm4gYnVmZmVyKVxuICAgICA6ZGVmYXVsdCAocmVjdXIgKHN0ciBidWZmZXIgY2gpIChyZWFkLWNoYXIgcmVhZGVyKSkpKSlcblxuKGRlZm4gcmVhZC1wYXJhbVxuICBbcmVhZGVyIGluaXRjaF1cbiAgKGxldCBbZm9ybSAocmVhZC1zeW1ib2wgcmVhZGVyIGluaXRjaCldXG4gICAgKGlmICg9IGZvcm0gKHN5bWJvbCBcIiVcIikpIChzeW1ib2wgXCIlMVwiKSBmb3JtKSkpXG5cbihkZWZuIHBhcmFtPyBbZm9ybV1cbiAgKGFuZCAoc3ltYm9sPyBmb3JtKSAoaWRlbnRpY2FsPyBcXCUgKGZpcnN0IChuYW1lIGZvcm0pKSkpKVxuXG4oZGVmbiBsYW1iZGEtcGFyYW1zLWhhc2ggW2Zvcm1dXG4gIChjb25kIChwYXJhbT8gZm9ybSkgKGRpY3Rpb25hcnkgZm9ybSBmb3JtKVxuICAgICAgICAob3IgKGRpY3Rpb25hcnk/IGZvcm0pXG4gICAgICAgICAgICAodmVjdG9yPyBmb3JtKVxuICAgICAgICAgICAgKGxpc3Q/IGZvcm0pKSAoYXBwbHkgY29ualxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG1hcCBsYW1iZGEtcGFyYW1zLWhhc2ggKHZlYyBmb3JtKSkpXG4gICAgICAgIDplbHNlIHt9KSlcblxuKGRlZm4gbGFtYmRhLXBhcmFtcyBbYm9keV1cbiAgKGxldCBbbmFtZXMgKHNvcnQgKHZhbHMgKGxhbWJkYS1wYXJhbXMtaGFzaCBib2R5KSkpXG4gICAgICAgIHZhcmlhZGljICg9IChmaXJzdCBuYW1lcykgKHN5bWJvbCBcIiUmXCIpKVxuICAgICAgICBuIChjb25kIChhbmQgdmFyaWFkaWMgKGlkZW50aWNhbD8gKGNvdW50IG5hbWVzKSAxKSkgMFxuICAgICAgICAgICAgICAgIChpZGVudGljYWw/IChjb3VudCBuYW1lcykgMCkgICAgICAgICAgICAgICAgMFxuICAgICAgICAgICAgICAgIDplbHNlICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHBhcnNlSW50IChyZXN0IChuYW1lIChsYXN0IG5hbWVzKSkpKSlcbiAgICAgICAgcGFyYW1zIChsb29wIFtuYW1lcyBbXVxuICAgICAgICAgICAgICAgICAgICAgIGkgMV1cbiAgICAgICAgICAgICAgICAoaWYgKDw9IGkgbilcbiAgICAgICAgICAgICAgICAgIChyZWN1ciAoY29uaiBuYW1lcyAoc3ltYm9sIChzdHIgXCIlXCIgaSkpKSAoaW5jIGkpKVxuICAgICAgICAgICAgICAgICAgbmFtZXMpKV1cbiAgICAoaWYgdmFyaWFkaWMgKGNvbmogcGFyYW1zICcmICclJikgbmFtZXMpKSlcblxuKGRlZm4gcmVhZC1sYW1iZGFcbiAgW3JlYWRlcl1cbiAgIChsZXQgW2JvZHkgKHJlYWQtbGlzdCByZWFkZXIpXVxuICAgIChsaXN0ICdmbiAobGFtYmRhLXBhcmFtcyBib2R5KSBib2R5KSkpXG5cbihkZWZuIHJlYWQtZGlzY2FyZFxuICBcIkRpc2NhcmRzIG5leHQgZm9ybVwiXG4gIFtyZWFkZXIgX11cbiAgKHJlYWQgcmVhZGVyIHRydWUgbmlsIHRydWUpXG4gIHJlYWRlcilcblxuKGRlZm4gbWFjcm9zIFtjXVxuICAoY29uZFxuICAgKGlkZW50aWNhbD8gYyBcIlxcXCJcIikgcmVhZC1zdHJpbmdcbiAgIChpZGVudGljYWw/IGMgXFxcXCkgcmVhZC1jaGFyYWN0ZXJcbiAgIChpZGVudGljYWw/IGMgXFw6KSByZWFkLWtleXdvcmRcbiAgIChpZGVudGljYWw/IGMgXCI7XCIpIHJlYWQtY29tbWVudFxuICAgKGlkZW50aWNhbD8gYyBcXCcpICh3cmFwcGluZy1yZWFkZXIgJ3F1b3RlKVxuICAgKGlkZW50aWNhbD8gYyBcXEApICh3cmFwcGluZy1yZWFkZXIgJ2RlcmVmKVxuICAgKGlkZW50aWNhbD8gYyBcXF4pIHJlYWQtbWV0YVxuICAgKGlkZW50aWNhbD8gYyBcXGApICh3cmFwcGluZy1yZWFkZXIgJ3N5bnRheC1xdW90ZSlcbiAgIChpZGVudGljYWw/IGMgXFx+KSByZWFkLXVucXVvdGVcbiAgIChpZGVudGljYWw/IGMgXFwoKSByZWFkLWxpc3RcbiAgIChpZGVudGljYWw/IGMgXFwpKSByZWFkLXVubWF0Y2hlZC1kZWxpbWl0ZXJcbiAgIChpZGVudGljYWw/IGMgXFxbKSByZWFkLXZlY3RvclxuICAgKGlkZW50aWNhbD8gYyBcXF0pIHJlYWQtdW5tYXRjaGVkLWRlbGltaXRlclxuICAgKGlkZW50aWNhbD8gYyBcXHspIHJlYWQtbWFwXG4gICAoaWRlbnRpY2FsPyBjIFxcfSkgcmVhZC11bm1hdGNoZWQtZGVsaW1pdGVyXG4gICAoaWRlbnRpY2FsPyBjIFxcJSkgcmVhZC1wYXJhbVxuICAgKGlkZW50aWNhbD8gYyBcXCMpIHJlYWQtZGlzcGF0Y2hcbiAgIDplbHNlIG5pbCkpXG5cblxuKGRlZm4gZGlzcGF0Y2gtbWFjcm9zIFtzXVxuICAoY29uZFxuICAgKGlkZW50aWNhbD8gcyBcXHspIHJlYWQtc2V0XG4gICAoaWRlbnRpY2FsPyBzIFxcKCkgcmVhZC1sYW1iZGFcbiAgIChpZGVudGljYWw/IHMgXFw8KSAodGhyb3dpbmctcmVhZGVyIFwiVW5yZWFkYWJsZSBmb3JtXCIpXG4gICAoaWRlbnRpY2FsPyBzIFwiXFxcIlwiKSByZWFkLXJlZ2V4XG4gICAoaWRlbnRpY2FsPyBzIFxcISkgcmVhZC1jb21tZW50XG4gICAoaWRlbnRpY2FsPyBzIFxcXykgcmVhZC1kaXNjYXJkXG4gICA6ZWxzZSBuaWwpKVxuXG4oZGVmbiByZWFkLWZvcm1cbiAgW3JlYWRlciBjaF1cbiAgKGxldCBbc3RhcnQgezpsaW5lICg6bGluZSByZWFkZXIpXG4gICAgICAgICAgICAgICA6Y29sdW1uICg6Y29sdW1uIHJlYWRlcil9XG4gICAgICAgIHJlYWQtbWFjcm8gKG1hY3JvcyBjaClcbiAgICAgICAgZm9ybSAoY29uZCByZWFkLW1hY3JvIChyZWFkLW1hY3JvIHJlYWRlciBjaClcbiAgICAgICAgICAgICAgICAgICAobnVtYmVyLWxpdGVyYWw/IHJlYWRlciBjaCkgKHJlYWQtbnVtYmVyIHJlYWRlciBjaClcbiAgICAgICAgICAgICAgICAgICA6ZWxzZSAocmVhZC1zeW1ib2wgcmVhZGVyIGNoKSlcbiAgICAgICAgZW5kIHs6bGluZSAoOmxpbmUgcmVhZGVyKVxuICAgICAgICAgICAgIDpjb2x1bW4gKGluYyAoOmNvbHVtbiByZWFkZXIpKX1cbiAgICAgICAgbG9jYXRpb24gezp1cmkgKDp1cmkgcmVhZGVyKVxuICAgICAgICAgICAgICAgICAgOnN0YXJ0IHN0YXJ0XG4gICAgICAgICAgICAgICAgICA6ZW5kIGVuZH1dXG4gICAgKGNvbmQgKGlkZW50aWNhbD8gZm9ybSByZWFkZXIpIGZvcm1cbiAgICAgICAgICA7OyBUT0RPIGNvbnNpZGVyIGJveGluZyBwcmltaXRpdmVzIGludG8gYXNzb2NpdGFkZVxuICAgICAgICAgIDs7IHR5cGVzIHRvIGluY2x1ZGUgbWV0YWRhdGEgb24gdGhvc2UuXG4gICAgICAgICAgKG5vdCAob3IgKGJvb2xlYW4/IGZvcm0pXG4gICAgICAgICAgICAgICAgICAgKG5pbD8gZm9ybSlcbiAgICAgICAgICAgICAgICAgICAoa2V5d29yZD8gZm9ybSkpKSAod2l0aC1tZXRhIGZvcm1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChjb25qIGxvY2F0aW9uIChtZXRhIGZvcm0pKSlcbiAgICAgICAgICA6ZWxzZSBmb3JtKSkpXG5cbihkZWZuIHJlYWRcbiAgXCJSZWFkcyB0aGUgZmlyc3Qgb2JqZWN0IGZyb20gYSBQdXNoYmFja1JlYWRlci5cbiAgUmV0dXJucyB0aGUgb2JqZWN0IHJlYWQuIElmIEVPRiwgdGhyb3dzIGlmIGVvZi1pcy1lcnJvciBpcyB0cnVlLlxuICBPdGhlcndpc2UgcmV0dXJucyBzZW50aW5lbC5cIlxuICBbcmVhZGVyIGVvZi1pcy1lcnJvciBzZW50aW5lbCBpcy1yZWN1cnNpdmVdXG4gIChsb29wIFtdXG4gICAgKGxldCBbY2ggKHJlYWQtY2hhciByZWFkZXIpXG4gICAgICAgICAgZm9ybSAoY29uZFxuICAgICAgICAgICAgICAgIChuaWw/IGNoKSAoaWYgZW9mLWlzLWVycm9yIChyZWFkZXItZXJyb3IgcmVhZGVyIDpFT0YpIHNlbnRpbmVsKVxuICAgICAgICAgICAgICAgICh3aGl0ZXNwYWNlPyBjaCkgcmVhZGVyXG4gICAgICAgICAgICAgICAgKGNvbW1lbnQtcHJlZml4PyBjaCkgKHJlYWQgKHJlYWQtY29tbWVudCByZWFkZXIgY2gpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW9mLWlzLWVycm9yXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VudGluZWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpcy1yZWN1cnNpdmUpXG4gICAgICAgICAgICAgICAgOmVsc2UgKHJlYWQtZm9ybSByZWFkZXIgY2gpKV1cbiAgICAgIChpZiAoaWRlbnRpY2FsPyBmb3JtIHJlYWRlcilcbiAgICAgICAgKHJlY3VyKVxuICAgICAgICBmb3JtKSkpKVxuXG4oZGVmbiByZWFkKlxuICBbc291cmNlIHVyaV1cbiAgKGxldCBbcmVhZGVyIChwdXNoLWJhY2stcmVhZGVyIHNvdXJjZSB1cmkpXG4gICAgICAgIGVvZiAoZ2Vuc3ltKV1cbiAgICAobG9vcCBbZm9ybXMgW11cbiAgICAgICAgICAgZm9ybSAocmVhZCByZWFkZXIgZmFsc2UgZW9mIGZhbHNlKV1cbiAgICAgIChpZiAoaWRlbnRpY2FsPyBmb3JtIGVvZilcbiAgICAgICAgZm9ybXNcbiAgICAgICAgKHJlY3VyIChjb25qIGZvcm1zIGZvcm0pXG4gICAgICAgICAgICAgICAocmVhZCByZWFkZXIgZmFsc2UgZW9mIGZhbHNlKSkpKSkpXG5cblxuXG4oZGVmbiByZWFkLWZyb20tc3RyaW5nXG4gIFwiUmVhZHMgb25lIG9iamVjdCBmcm9tIHRoZSBzdHJpbmcgc1wiXG4gIFtzb3VyY2UgdXJpXVxuICAobGV0IFtyZWFkZXIgKHB1c2gtYmFjay1yZWFkZXIgc291cmNlIHVyaSldXG4gICAgKHJlYWQgcmVhZGVyIHRydWUgbmlsIGZhbHNlKSkpXG5cbihkZWZuIF46cHJpdmF0ZSByZWFkLXV1aWRcbiAgW3V1aWRdXG4gIChpZiAoc3RyaW5nPyB1dWlkKVxuICAgIGAoVVVJRC4gfnV1aWQpXG4gICAgKHJlYWRlci1lcnJvclxuICAgICBuaWwgXCJVVUlEIGxpdGVyYWwgZXhwZWN0cyBhIHN0cmluZyBhcyBpdHMgcmVwcmVzZW50YXRpb24uXCIpKSlcblxuKGRlZm4gXjpwcml2YXRlIHJlYWQtcXVldWVcbiAgW2l0ZW1zXVxuICAoaWYgKHZlY3Rvcj8gaXRlbXMpXG4gICAgYChQZXJzaXN0ZW50UXVldWUuIH5pdGVtcylcbiAgICAocmVhZGVyLWVycm9yXG4gICAgIG5pbCBcIlF1ZXVlIGxpdGVyYWwgZXhwZWN0cyBhIHZlY3RvciBmb3IgaXRzIGVsZW1lbnRzLlwiKSkpXG5cbihkZWZuIF46cHJpdmF0ZSByZWFkLWRhdGVcbiAgW2RhdGVdXG4gIChpZiAoc3RyaW5nPyBkYXRlKVxuICAgIGAoRGF0ZS4gfmRhdGUpXG4gICAgKHJlYWRlci1lcnJvclxuICAgICBuaWwgXCJEYXRlIGxpdGVyYWwgZXhwZWN0cyBhIHN0cmluZyBhcyBpdHMgcmVwcmVzZW50YXRpb24uXCIpKSlcblxuXG4oZGVmICoqdGFnLXRhYmxlKipcbiAgKGRpY3Rpb25hcnkgOnV1aWQgIHJlYWQtdXVpZFxuICAgICAgICAgICAgICA6cXVldWUgcmVhZC1xdWV1ZVxuICAgICAgICAgICAgICA6aW5zdCAgcmVhZC1kYXRlKSlcblxuKGRlZm4gbWF5YmUtcmVhZC10YWdnZWQtdHlwZVxuICBbcmVhZGVyIGluaXRjaF1cbiAgKGxldCBbdGFnIChyZWFkLXN5bWJvbCByZWFkZXIgaW5pdGNoKVxuICAgICAgICBwZm4gKGdldCAqKnRhZy10YWJsZSoqIChuYW1lIHRhZykpXVxuICAgIChpZiBwZm5cbiAgICAgIChwZm4gKHJlYWQgcmVhZGVyIHRydWUgbmlsIGZhbHNlKSlcbiAgICAgIChyZWFkZXItZXJyb3IgcmVhZGVyXG4gICAgICAgICAgICAgICAgICAgIChzdHIgXCJDb3VsZCBub3QgZmluZCB0YWcgcGFyc2VyIGZvciBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgIChuYW1lIHRhZylcbiAgICAgICAgICAgICAgICAgICAgICAgICBcIiBpbiBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgIChzdHIgKGtleXMgKip0YWctdGFibGUqKikpKSkpKSlcbiJdfQ==
