import MacLisp
import Foundation
import CEditline

// MARK: - Readline History Support

/// History file location
let historyPath = NSString("~/.mlisp_history").expandingTildeInPath

/// Load history from file
func loadHistory() {
    guard FileManager.default.fileExists(atPath: historyPath),
          let contents = try? String(contentsOfFile: historyPath, encoding: .utf8) else {
        return
    }
    for line in contents.split(separator: "\n") {
        add_history(strdup(String(line)))
    }
}

/// Save a line to history file
func saveHistory(_ line: String) {
    let entry = line + "\n"
    if let handle = FileHandle(forWritingAtPath: historyPath) {
        handle.seekToEndOfFile()
        handle.write(entry.data(using: .utf8)!)
        handle.closeFile()
    } else {
        try? entry.write(toFile: historyPath, atomically: true, encoding: .utf8)
    }
}

// MARK: - REPL

func printBanner() {
    print("MacLisp REPL")
    print("Type :help for commands, :quit to exit")
    print("")
}

func printHelp() {
    print("""
    Commands:
      :help     Show this help message
      :quit     Exit the REPL
      :q        Exit the REPL (short)
    
    Examples:
      (+ 1 2 3)                    ; arithmetic
      (def x 10)                   ; define variable
      (defn square [x] (* x x))    ; define function
      (map inc [1 2 3])            ; use sequences
    """)
}

func main() {
    let lisp: MacLisp
    do {
        lisp = try MacLisp()
    } catch {
        fputs("Error: Failed to initialize MacLisp: \(error.localizedDescription)\n", stderr)
        exit(1)
    }
    
    printBanner()
    loadHistory()
    
    while true {
        guard let cline = readline("=> ") else {
            print("")
            break
        }
        
        let line = String(cString: cline)
        free(cline)
        
        let trimmed = line.trimmingCharacters(in: CharacterSet.whitespaces)
        if trimmed.isEmpty {
            continue
        }
        
        add_history(strdup(line))
        saveHistory(line)
        
        if trimmed.hasPrefix(":") {
            switch trimmed.lowercased() {
            case ":quit", ":q":
                print("Goodbye!")
                exit(0)
            case ":help":
                printHelp()
            default:
                print("Unknown command: \(trimmed)")
            }
            continue
        }
        
        do {
            let result = try lisp.evaluate(source: line)
            if let result = result, !result.isUndefined {
                print(result)
            }
        } catch {
            fputs("Error: \(error.localizedDescription)\n", stderr)
        }
    }
}

main()
