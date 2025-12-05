import JavaScriptCore
import Foundation

public class MacLisp {
    private let context: JSContext
    private let wispCompile: JSValue
    
    public enum Error: Swift.Error, LocalizedError {
        case runtimeNotFound
        case wispNotLoaded
        case compilationFailed(String)
        case evaluationFailed(String)
        case noCodeGenerated
        
        public var errorDescription: String? {
            switch self {
            case .runtimeNotFound:
                return "Could not find wisp_jsc.js runtime in bundle"
            case .wispNotLoaded:
                return "Wisp object not found in JavaScript context"
            case .compilationFailed(let msg):
                return "Compilation error: \(msg)"
            case .evaluationFailed(let msg):
                return "Evaluation error: \(msg)"
            case .noCodeGenerated:
                return "Compilation produced no output"
            }
        }
    }
    
    public init() throws {
        guard let context = JSContext() else {
            throw Error.runtimeNotFound
        }
        self.context = context
        
        Self.setupConsole(context)
        
        guard let runtimeURL = Bundle.module.url(forResource: "wisp_jsc", withExtension: "js"),
              let runtimeCode = try? String(contentsOf: runtimeURL, encoding: .utf8) else {
            throw Error.runtimeNotFound
        }
        
        context.evaluateScript(runtimeCode)
        if let exception = context.exception, !exception.isUndefined {
            throw Error.compilationFailed(exception.toString() ?? "Unknown error loading runtime")
        }
        
        guard let wisp = context.objectForKeyedSubscript("Wisp"),
              !wisp.isUndefined else {
            throw Error.wispNotLoaded
        }
        
        guard let compile = wisp.objectForKeyedSubscript("compile"),
              !compile.isUndefined else {
            throw Error.wispNotLoaded
        }
        self.wispCompile = compile
        
        Self.setupWispEnvironment(context)
    }
    
    public func compile(source: String, uri: String = "<repl>") throws -> String {
        let result = wispCompile.call(withArguments: [source, ["source-uri": uri]])
        
        if let error = result?.objectForKeyedSubscript("error"), !error.isUndefined {
            throw Error.compilationFailed(error.toString() ?? "Unknown error")
        }
        
        guard let code = result?.objectForKeyedSubscript("code")?.toString(),
              !code.isEmpty else {
            throw Error.noCodeGenerated
        }
        
        return code
    }
    
    @discardableResult
    public func evaluate(source: String, uri: String = "<repl>") throws -> JSValue? {
        let code = try compile(source: source, uri: uri)
        return try run(javascript: code)
    }
    
    @discardableResult
    public func run(javascript code: String) throws -> JSValue? {
        let result = context.evaluateScript(code)
        
        if let exception = context.exception, !exception.isUndefined {
            context.exception = nil
            throw Error.evaluationFailed(exception.toString() ?? "Unknown error")
        }
        
        return result
    }
    
    public var jsContext: JSContext {
        return context
    }
    
    // MARK: - Private Setup Methods
    
    private static func setupConsole(_ context: JSContext) {
        let log: @convention(block) () -> Void = {
            let args = JSContext.currentArguments()
            let msg = args?.compactMap { ($0 as? JSValue)?.toString() }.joined(separator: " ") ?? ""
            print(msg)
        }
        
        let console = JSValue(newObjectIn: context)
        console?.setObject(unsafeBitCast(log, to: AnyObject.self), forKeyedSubscript: "log" as NSString)
        console?.setObject(unsafeBitCast(log, to: AnyObject.self), forKeyedSubscript: "error" as NSString)
        console?.setObject(unsafeBitCast(log, to: AnyObject.self), forKeyedSubscript: "warn" as NSString)
        context.setObject(console, forKeyedSubscript: "console" as NSString)
    }
    
    private static func setupWispEnvironment(_ context: JSContext) {
        let setupScript = """
        var runtime = Wisp.runtime;
        var sequence = Wisp.sequence;
        var string = Wisp.string;
        
        // Copy properties to global scope
        for (var key in runtime) { this[key] = runtime[key]; }
        for (var key in sequence) { this[key] = sequence[key]; }
        for (var key in string) { this[key] = string[key]; }
        
        var exports = {};
        """
        context.evaluateScript(setupScript)
    }
}
