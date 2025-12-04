import JavaScriptCore
import Foundation

// Polyfill console.log
let context = JSContext()!
let log: @convention(block) () -> Void = {
    let args = JSContext.currentArguments()
    let msg = args?.compactMap { ($0 as? JSValue)?.toString() }.joined(separator: " ") ?? ""
    print(msg)
}
let console = JSValue(newObjectIn: context)
console?.setObject(unsafeBitCast(log, to: AnyObject.self), forKeyedSubscript: "log" as NSString)
console?.setObject(unsafeBitCast(log, to: AnyObject.self), forKeyedSubscript: "error" as NSString)
context.setObject(console, forKeyedSubscript: "console" as NSString)

// Load Wisp Runtime
let currentDir = FileManager.default.currentDirectoryPath
let wispJsPath = URL(fileURLWithPath: currentDir).appendingPathComponent("dist/wisp_jsc.js").path
guard let wispJs = try? String(contentsOfFile: wispJsPath, encoding: .utf8) else {
    print("Could not load wisp_jsc.js from \(wispJsPath)")
    exit(1)
}

context.evaluateScript(wispJs)
if let exception = context.exception, !exception.isUndefined {
    print("Exception loading wisp_jsc.js: \(exception.toString() ?? "")")
    exit(1)
}

// Check if Wisp is loaded
let wisp = context.objectForKeyedSubscript("Wisp")
if wisp == nil || wisp!.isUndefined {
    print("Error: Wisp object not found in context.")
    exit(1)
}

// Setup Wisp environment (expose globals)
let setupScript = """
var runtime = Wisp.runtime;
var sequence = Wisp.sequence;
var string = Wisp.string;

// Simple polyfill for Object.assign if missing (JSC usually has it)
if (typeof Object.assign != 'function') {
  Object.assign = function(target) {
    'use strict';
    if (target == null) {
      throw new TypeError('Cannot convert undefined or null to object');
    }
    target = Object(target);
    for (var index = 1; index < arguments.length; index++) {
      var source = arguments[index];
      if (source != null) {
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
    }
    return target;
  };
}

// Copy properties to global scope
for (var key in runtime) { this[key] = runtime[key]; }
for (var key in sequence) { this[key] = sequence[key]; }
for (var key in string) { this[key] = string[key]; }

var exports = {};
"""
context.evaluateScript(setupScript)

// Load and compile Wisp file
let wispFilePath = URL(fileURLWithPath: currentDir).appendingPathComponent("hello.wisp").path
guard let wispCode = try? String(contentsOfFile: wispFilePath, encoding: .utf8) else {
    print("Could not load hello.wisp")
    exit(1)
}

// Compile
let compileFunc = wisp!.objectForKeyedSubscript("compile")!
let result = compileFunc.call(withArguments: [wispCode, ["source-uri": wispFilePath]])

if let error = result?.objectForKeyedSubscript("error"), !error.isUndefined {
    print("Compilation Error: \(error.toString() ?? "Unknown Error")")
    exit(1)
}

guard let code = result?.objectForKeyedSubscript("code")?.toString() else {
    print("Compilation failed to produce code.")
    exit(1)
}

print("--- Compiled JS ---")
print(code)
print("-------------------")

// Evaluate
print("--- Output ---")
context.evaluateScript(code)
if let exception = context.exception, !exception.isUndefined {
    print("Runtime Exception: \(exception.toString() ?? "")")
}
print("--------------")
