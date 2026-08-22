/* wisc - wisp REPL and runner backed by quickjs-ng.
 *
 * The bootstrapped wisp compiler is bundled into dist/wisp_qjs.js at
 * build time and embedded into this binary as a byte array (see the
 * Makefile). At startup we create a QuickJS runtime, install a small
 * host API (`wisc`), evaluate the bundle and drive it through the
 * `Wisp` global it defines. */

#include <quickjs.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

#ifdef HAVE_EDITLINE
#include <editline/readline.h>
#endif

#define WISC_VERSION "0.13.0"

extern const unsigned char dist_wisp_qjs_js[];
extern const unsigned int dist_wisp_qjs_js_len;

static JSRuntime *rt = NULL;
static JSContext *ctx = NULL;
static JSValue g_wisp = JS_NULL; /* `Wisp` global */
static JSValue g_host = JS_NULL; /* host object */

/* ------------------------------------------------------------------ */
/* helpers */

static void print_jstr(JSContext *c, JSValueConst v, FILE *out)
{
    const char *s = JS_ToCString(c, v);
    if (s) {
        fputs(s, out);
        JS_FreeCString(c, s);
    } else {
        fputs("<unprintable>", out);
    }
}

/* Prints a pending exception to stderr and clears it. */
static void report_exception(const char *prefix)
{
    JSValue exc = JS_GetException(ctx);
    if (prefix)
        fputs(prefix, stderr);
    if (JS_IsError(exc)) {
        JSValue name_v = JS_GetPropertyStr(ctx, exc, "name");
        const char *name = JS_ToCString(ctx, name_v);
        fputs(name ? name : "Error", stderr);
        if (name)
            JS_FreeCString(ctx, name);
        JS_FreeValue(ctx, name_v);

        JSValue msg_v = JS_GetPropertyStr(ctx, exc, "message");
        const char *msg = JS_ToCString(ctx, msg_v);
        if (msg && msg[0] != '\0')
            fprintf(stderr, ": %s", msg);
        if (msg)
            JS_FreeCString(ctx, msg);
        JS_FreeValue(ctx, msg_v);
        fputc('\n', stderr);

        JSValue stack = JS_GetPropertyStr(ctx, exc, "stack");
        if (!JS_IsException(stack) && !JS_IsUndefined(stack))
            print_jstr(ctx, stack, stderr), fputc('\n', stderr);
        JS_FreeValue(ctx, stack);
    } else if (JS_IsUninitialized(exc)) {
        fputs("unknown exception\n", stderr);
    } else {
        /* thrown non-Error values: strings, keywords, numbers... */
        print_jstr(ctx, exc, stderr);
        fputc('\n', stderr);
    }
    JS_FreeValue(ctx, exc);
}

/* Returns malloc'd copy of an object property string or NULL. */
static char *get_str_prop(JSValue obj, const char *name)
{
    JSValue v = JS_GetPropertyStr(ctx, obj, name);
    char *out = NULL;
    if (!(JS_IsException(v) || JS_IsUndefined(v) || JS_IsNull(v))) {
        const char *s = JS_ToCString(ctx, v);
        if (s) {
            out = strdup(s);
            JS_FreeCString(ctx, s);
        }
    }
    JS_FreeValue(ctx, v);
    return out;
}

/* ------------------------------------------------------------------ */
/* native host functions */

static void join_print(JSContext *c, int argc, JSValueConst *argv, FILE *out)
{
    for (int i = 0; i < argc; i++) {
        if (i > 0)
            fputc(' ', out);
        print_jstr(c, argv[i], out);
    }
    fputc('\n', out);
    fflush(out);
}

static JSValue js_print(JSContext *c, JSValueConst self, int argc,
                        JSValueConst *argv)
{
    join_print(c, argc, argv, stdout);
    return JS_UNDEFINED;
}

static JSValue js_print_err(JSContext *c, JSValueConst self, int argc,
                            JSValueConst *argv)
{
    join_print(c, argc, argv, stderr);
    return JS_UNDEFINED;
}

static JSValue js_read_file(JSContext *c, JSValueConst self, int argc,
                            JSValueConst *argv)
{
    const char *path = JS_ToCString(c, argv[0]);
    if (!path)
        return JS_EXCEPTION;
    FILE *f = fopen(path, "rb");
    JS_FreeCString(c, path);
    if (!f)
        return JS_NULL;
    if (fseek(f, 0, SEEK_END) != 0) {
        fclose(f);
        return JS_NULL;
    }
    long n = ftell(f);
    if (n < 0) {
        fclose(f);
        return JS_NULL;
    }
    rewind(f);
    char *buf = malloc((size_t)n + 1);
    size_t got = fread(buf, 1, (size_t)n, f);
    fclose(f);
    JSValue str = JS_NewStringLen(c, buf, got);
    free(buf);
    return str;
}

static JSValue js_exit(JSContext *c, JSValueConst self, int argc,
                       JSValueConst *argv)
{
    int32_t code = 0;
    if (argc > 0)
        JS_ToInt32(c, &code, argv[0]);
    fflush(stdout);
    exit((int)code);
    return JS_UNDEFINED; /* unreachable */
}

static void set_method(JSValue obj, const char *name, JSCFunction *fn)
{
    JS_SetPropertyStr(ctx, obj, name, JS_NewCFunction(ctx, fn, name, 1));
}

static void register_host(int script_argc, char **script_argv)
{
    JSValue global = JS_GetGlobalObject(ctx);

    g_host = JS_NewObject(ctx);
    set_method(g_host, "print", js_print);
    set_method(g_host, "printErr", js_print_err);
    set_method(g_host, "readFile", js_read_file);
    set_method(g_host, "exit", js_exit);

    JSValue args = JS_NewArray(ctx);
    for (int i = 0; i < script_argc; i++)
        JS_SetPropertyUint32(ctx, args, (uint32_t)i,
                             JS_NewString(ctx, script_argv[i]));
    JS_SetPropertyStr(ctx, g_host, "args", args);

    JS_SetPropertyStr(ctx, global, "wisc", JS_DupValue(ctx, g_host));

    /* console shim so browserified code that logs does not explode */
    JSValue console = JS_NewObject(ctx);
    set_method(console, "log", js_print);
    set_method(console, "info", js_print);
    set_method(console, "warn", js_print_err);
    set_method(console, "error", js_print_err);
    JS_SetPropertyStr(ctx, global, "console", console);

    JS_FreeValue(ctx, global);
}

/* ------------------------------------------------------------------ */
/* bundle loading */

static int load_bundle(void)
{
    /* quickjs-ng's tokenizer peeks one byte past the given length, so
     * the script must be backed by a NUL-terminated buffer (the
     * embedded xxd array is followed by unrelated bytes). */
    size_t bundle_len = dist_wisp_qjs_js_len;
    char *bundle = malloc(bundle_len + 1);
    if (!bundle) {
        fprintf(stderr, "wisc: out of memory loading wisp runtime\n");
        return -1;
    }
    memcpy(bundle, dist_wisp_qjs_js, bundle_len);
    bundle[bundle_len] = '\0';

    JSValue r = JS_Eval(ctx, bundle, bundle_len, "<embedded://wisp>",
                        JS_EVAL_TYPE_GLOBAL);
    free(bundle);
    if (JS_IsException(r)) {
        report_exception("error loading wisp runtime:\n");
        return -1;
    }
    JS_FreeValue(ctx, r);

    JSValue global = JS_GetGlobalObject(ctx);
    g_wisp = JS_GetPropertyStr(ctx, global, "Wisp");
    JS_FreeValue(ctx, global);
    if (JS_IsUndefined(g_wisp)) {
        fprintf(stderr, "wisc: Wisp global not found after bundle load\n");
        return -1;
    }

    JSValue init_fn = JS_GetPropertyStr(ctx, g_wisp, "init");
    if (JS_IsUndefined(init_fn)) {
        fprintf(stderr, "wisc: Wisp.init not found\n");
        return -1;
    }
    JSValue res = JS_Call(ctx, init_fn, g_wisp, 1, (JSValueConst *)&g_host);
    JS_FreeValue(ctx, init_fn);
    if (JS_IsException(res)) {
        report_exception("error initializing wisp runtime:\n");
        return -1;
    }
    JS_FreeValue(ctx, res);
    return 0;
}

/* Calls Wisp.<name> with one string argument. Returns the result or
 * JS_EXCEPTION without reporting (callers decide). */
static JSValue call_wisp_str(const char *name, const char *arg)
{
    JSValue fn = JS_GetPropertyStr(ctx, g_wisp, name);
    if (JS_IsUndefined(fn)) {
        fprintf(stderr, "wisc: Wisp.%s missing\n", name);
        return JS_EXCEPTION;
    }
    JSValue arg_v = JS_NewString(ctx, arg);
    JSValue res = JS_Call(ctx, fn, g_wisp, 1, (JSValueConst *)&arg_v);
    JS_FreeValue(ctx, arg_v);
    JS_FreeValue(ctx, fn);
    return res;
}

/* Prints the {result}/{error} dictionary returned by Wisp.evaluate.
 * Returns nonzero when the evaluation failed. Frees `res`. */
static int show_eval_result(JSValue res)
{
    if (JS_IsException(res)) {
        report_exception(NULL);
        return 1;
    }
    int status = 0;
    char *err = get_str_prop(res, "error");
    if (err) {
        fprintf(stderr, "%s\n", err);
        free(err);
        status = 1;
    } else {
        char *result = get_str_prop(res, "result");
        printf("%s\n", result ? result : "nil");
        free(result);
    }
    JS_FreeValue(ctx, res);
    fflush(stdout);
    return status;
}

/* ------------------------------------------------------------------ */
/* modes */

static int mode_eval(const char *source)
{
    JSValue res = call_wisp_str("evaluate", source);
    return show_eval_result(res);
}

/* Compiles source and prints javascript on stdout. */
static int mode_compile(const char *source, const char *uri)
{
    JSValue fn = JS_GetPropertyStr(ctx, g_wisp, "compile");
    if (JS_IsUndefined(fn)) {
        fprintf(stderr, "wisc: Wisp.compile missing\n");
        return 2;
    }
    JSValue args[2] = { JS_NewString(ctx, source), JS_NewString(ctx, uri) };
    JSValue res = JS_Call(ctx, fn, g_wisp, 2, (JSValueConst *)args);
    JS_FreeValue(ctx, args[0]);
    JS_FreeValue(ctx, args[1]);
    JS_FreeValue(ctx, fn);
    if (JS_IsException(res)) {
        report_exception(NULL);
        return 1;
    }
    print_jstr(ctx, res, stdout);
    fputc('\n', stdout);
    JS_FreeValue(ctx, res);
    fflush(stdout);
    return 0;
}

static int mode_run(const char *path)
{
    JSValue res = call_wisp_str("run-program", path);
    if (JS_IsException(res)) {
        report_exception(NULL);
        return 1;
    }
    JS_FreeValue(ctx, res);
    return 0;
}

/* Reads all of stdin; returns malloc'd buffer or NULL. */
static char *slurp_stdin(void)
{
    size_t cap = 8192, len = 0;
    char *buf = malloc(cap);
    size_t got;
    while ((got = fread(buf + len, 1, cap - len - 1, stdin)) > 0) {
        len += got;
        if (cap - len < 2) {
            cap *= 2;
            buf = realloc(buf, cap);
        }
    }
    buf[len] = '\0';
    return buf;
}

typedef enum { INPUT_COMPLETE, INPUT_INCOMPLETE, INPUT_ERROR } InputStatus;

static InputStatus check_complete(const char *src, char **errmsg)
{
    *errmsg = NULL;
    JSValue res = call_wisp_str("read-status", src);
    if (JS_IsException(res)) {
        report_exception(NULL);
        return INPUT_ERROR;
    }
    InputStatus status = INPUT_ERROR;
    char *state = get_str_prop(res, "status");
    if (state) {
        if (strcmp(state, "complete") == 0)
            status = INPUT_COMPLETE;
        else if (strcmp(state, "incomplete") == 0)
            status = INPUT_INCOMPLETE;
        else
            *errmsg = get_str_prop(res, "error");
        free(state);
    } else {
        *errmsg = get_str_prop(res, "error");
    }
    JS_FreeValue(ctx, res);
    return status;
}

#ifdef HAVE_EDITLINE
static char *history_path(void)
{
    const char *home = getenv("HOME");
    size_t n = snprintf(NULL, 0, "%s/.wisc_history", home ? home : "");
    char *path = malloc(n + 1);
    snprintf(path, n + 1, "%s/.wisc_history", home ? home : "");
    return path;
}
#endif

/* Grows buf and appends line + newline. */
static void append_line(char **buf, size_t *cap, size_t *len,
                        const char *line)
{
    size_t need = *len + strlen(line) + 2;
    if (need > *cap) {
        while (need > *cap)
            *cap = *cap ? *cap * 2 : 1024;
        *buf = realloc(*buf, *cap);
    }
    memcpy(*buf + *len, line, strlen(line));
    *len += strlen(line);
    (*buf)[(*len)++] = '\n';
    (*buf)[*len] = '\0';
}

static void repl_banner(void)
{
    printf("wisp %s on quickjs-ng (:help for commands)\n", WISC_VERSION);
    fflush(stdout);
}

static void repl_help(void)
{
    puts(
        "Commands:\n"
        "  :help     Show this help message\n"
        "  :quit     Exit the REPL\n"
        "  :q        Exit the REPL (short)\n"
        "  :load     Load and evaluate a file\n"
        "\n"
        "Examples:\n"
        "  (+ 1 2 3)\n"
        "  (def x 10)\n"
        "  (defn square [x] (* x x))\n"
        "  (map inc [1 2 3])");
}

/* Reads one line from stdin without terminal editing. Returns a
 * malloc'd string without the trailing newline or NULL on EOF. */
static char *read_line_basic(const char *prompt)
{
    fputs(prompt, stdout);
    fflush(stdout);
    size_t cap = 256, len = 0;
    char *line = malloc(cap);
    int ch;
    while ((ch = fgetc(stdin)) != EOF && ch != '\n') {
        if (len + 2 > cap)
            line = realloc(line, cap *= 2);
        line[len++] = (char)ch;
    }
    if (ch == EOF && len == 0) {
        free(line);
        return NULL;
    }
    line[len] = '\0';
    return line;
}

static int repl(int banner)
{
#ifdef HAVE_EDITLINE
    int interactive = isatty(0);
    char *hist = history_path();
    read_history(hist);
#endif

    if (banner)
        repl_banner();

    char *input = NULL;
    size_t cap = 0, len = 0;

    for (;;) {
        const char *prompt = len > 0 ? "    ... " : "user=> ";
#ifdef HAVE_EDITLINE
        char *line = interactive ? readline(prompt)
                                 : read_line_basic(prompt);
#else
        char *line = read_line_basic(prompt);
#endif
        if (!line) {
            if (isatty(0))
                putchar('\n');
            break;
        }

        if (line[0] != '\0') {
            append_line(&input, &cap, &len, line);
#ifdef HAVE_EDITLINE
            if (interactive) {
                add_history(line);
                write_history(hist);
            }
#endif
        }

        /* REPL commands */
        if (len > 0 && input[0] == ':') {
            char *cmd = strdup(input);
            cmd[strcspn(cmd, "\r\n")] = '\0';
            if (strcmp(cmd, ":quit") == 0 || strcmp(cmd, ":q") == 0) {
                free(cmd);
                free(line);
                break;
            } else if (strcmp(cmd, ":help") == 0) {
                repl_help();
            } else if (strncmp(cmd, ":load ", 6) == 0) {
                show_eval_result(call_wisp_str("load-file", cmd + 6));
            } else if (strcmp(cmd, ":load") == 0) {
                puts("Usage: :load <filename>");
            } else {
                fprintf(stderr, "Unknown command: %s\n", cmd);
            }
            free(cmd);
            free(input);
            input = NULL;
            len = 0;
            cap = 0;
            free(line);
            continue;
        }

        /* skip blank / comment-only lines entirely */
        int meaningful = 0;
        for (size_t i = 0; i < len; i++) {
            if (input[i] == ';')
                break;
            if (input[i] != ' ' && input[i] != '\t' && input[i] != '\n' &&
                input[i] != '\r') {
                meaningful = 1;
                break;
            }
        }

        char *err = NULL;
        switch (check_complete(input, &err)) {
        case INPUT_INCOMPLETE:
            free(line);
            continue;
        case INPUT_ERROR:
            fprintf(stderr, "%s\n", err ? err : "read error");
            free(err);
            break;
        case INPUT_COMPLETE:
        default:
            if (meaningful)
                show_eval_result(call_wisp_str("evaluate", input));
            break;
        }

        free(input);
        input = NULL;
        len = 0;
        cap = 0;
        free(line);
    }

    free(input);
#ifdef HAVE_EDITLINE
    write_history(hist);
    free(hist);
#endif
    return 0;
}

/* ------------------------------------------------------------------ */
/* entry point */

static void usage(FILE *out)
{
    fputs(
        "Usage: wisc [options] [file.wisp | -] [-- args...]\n"
        "\n"
        "Modes:\n"
        "  (no file, tty)      interactive wisp REPL\n"
        "  (no file, pipe)     evaluate stdin, print results\n"
        "  file.wisp           compile and run a program\n"
        "  -                   evaluate stdin, print results\n"
        "\n"
        "Options:\n"
        "  -c, --compile       compile given file/stdin to stdout\n"
        "  -e, --eval EXPR     evaluate expression and print the result\n"
        "  -i, --interactive   force the interactive REPL\n"
        "  -h, --help          show this help message\n"
        "  -v, --version       print version information\n",
        out);
}

int main(int argc, char **argv)
{
    const char *eval_expr = NULL;
    const char *path = NULL;
    int compile_only = 0, force_repl = 0;
    int argi = 1, script_start = argc;

    while (argi < argc) {
        const char *a = argv[argi];
        if (strcmp(a, "--") == 0) {
            argi++;
            break;
        }
        if (a[0] != '-' || a[1] == '\0')
            break; /* positional argument (or "-" meaning stdin) */
        if (strcmp(a, "-h") == 0 || strcmp(a, "--help") == 0) {
            usage(stdout);
            return 0;
        } else if (strcmp(a, "-v") == 0 || strcmp(a, "--version") == 0) {
            printf("wisc %s (quickjs-ng backend)\n", WISC_VERSION);
            return 0;
        } else if (strcmp(a, "-c") == 0 || strcmp(a, "--compile") == 0) {
            compile_only = 1;
        } else if (strcmp(a, "-i") == 0 ||
                   strcmp(a, "--interactive") == 0) {
            force_repl = 1;
        } else if (strcmp(a, "-e") == 0 || strcmp(a, "--eval") == 0) {
            if (++argi >= argc) {
                fprintf(stderr, "wisc: %s requires an argument\n", a);
                return 2;
            }
            if (!eval_expr) {
                eval_expr = strdup(argv[argi]);
            } else {
                size_t old = strlen(eval_expr), add = strlen(argv[argi]);
                char *joined = malloc(old + add + 2);
                memcpy(joined, eval_expr, old);
                joined[old] = '\n';
                memcpy(joined + old + 1, argv[argi], add + 1);
                free((void *)eval_expr);
                eval_expr = joined;
            }
        } else {
            fprintf(stderr, "wisc: unknown option '%s'\n", a);
            usage(stderr);
            return 2;
        }
        argi++;
    }

    path = (argi < argc && strcmp(argv[argi], "--") != 0) ? argv[argi]
                                                          : NULL;
    if (path)
        script_start = argi + 1;
    else
        script_start = argi;

    rt = JS_NewRuntime();
    if (!rt) {
        fprintf(stderr, "wisc: cannot allocate QuickJS runtime\n");
        return 1;
    }
    ctx = JS_NewContext(rt);
    if (!ctx) {
        fprintf(stderr, "wisc: cannot allocate QuickJS context\n");
        return 1;
    }

    register_host(argc - script_start, argv + script_start);
    if (load_bundle() != 0)
        return 1;

    int exit_status;
    if (eval_expr) {
        exit_status = mode_eval(eval_expr);
    } else if (path && strcmp(path, "-") != 0) {
        exit_status = force_repl ? repl(1) : mode_run(path);
    } else if (force_repl || isatty(0)) {
        exit_status = repl(!force_repl || isatty(0));
    } else {
        /* piped stdin */
        char *source = slurp_stdin();
        if (!source)
            return 1;
        exit_status = compile_only ? mode_compile(source, "<stdin>")
                                   : mode_eval(source);
        free(source);
    }

    JS_FreeValue(ctx, g_wisp);
    JS_FreeValue(ctx, g_host);
    JS_FreeContext(ctx);
    JS_FreeRuntime(rt);
    return exit_status;
}
