/* spike driver: bare quickjs-ng host that evals JS files in order and
 * drains the promise job queue after each. Purpose: prove that
 * @deepseek-ai/cordis (bundled to an IIFE global) boots and runs its
 * async service-DI lifecycle on the same quickjs-ng this repo already
 * links for `wisc`.
 *
 * build: see build.sh
 * usage: ./driver file1.js [file2.js ...]
 */

#include <quickjs.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static JSContext *ctx;
static JSRuntime *rt;

static void die_exc(const char *where)
{
    JSValue e = JS_GetException(ctx);
    const char *s = JS_ToCString(ctx, e);
    fprintf(stderr, "[driver] exception in %s: %s\n", where, s ? s : "?");
    if (s)
        JS_FreeCString(ctx, s);
    JSValue st = JS_GetPropertyStr(ctx, e, "stack");
    if (!JS_IsUndefined(st)) {
        const char *ss = JS_ToCString(ctx, st);
        if (ss) {
            fprintf(stderr, "%s\n", ss);
            JS_FreeCString(ctx, ss);
        }
    }
    JS_FreeValue(ctx, st);
    JS_FreeValue(ctx, e);
    exit(1);
}

/* drain microtasks + pending jobs until the queue is empty */
static void drain(void)
{
    JSContext *c;
    for (;;) {
        int r = JS_ExecutePendingJob(rt, &c);
        if (r < 0)
            die_exc("pending job");
        if (r == 0)
            break;
    }
}

static JSValue host_print(JSContext *c, JSValueConst self, int argc,
                          JSValueConst *argv)
{
    for (int i = 0; i < argc; i++) {
        if (i)
            fputc(' ', stdout);
        const char *s = JS_ToCString(c, argv[i]);
        fputs(s ? s : "?", stdout);
        if (s)
            JS_FreeCString(c, s);
    }
    fputc('\n', stdout);
    fflush(stdout);
    return JS_UNDEFINED;
}

static char *slurp(const char *path, size_t *len)
{
    FILE *f = fopen(path, "rb");
    if (!f) {
        fprintf(stderr, "[driver] cannot open %s\n", path);
        exit(1);
    }
    fseek(f, 0, SEEK_END);
    long n = ftell(f);
    rewind(f);
    char *b = malloc(n + 1);
    *len = fread(b, 1, n, f);
    b[*len] = '\0';
    fclose(f);
    return b;
}

int main(int argc, char **argv)
{
    rt = JS_NewRuntime();
    ctx = JS_NewContext(rt);

    JSValue g = JS_GetGlobalObject(ctx);
    JSValue console = JS_NewObject(ctx);
    JSValue pfn = JS_NewCFunction(ctx, host_print, "print", 1);
    JS_SetPropertyStr(ctx, console, "log", JS_DupValue(ctx, pfn));
    JS_SetPropertyStr(ctx, console, "error", JS_DupValue(ctx, pfn));
    JS_SetPropertyStr(ctx, console, "warn", JS_DupValue(ctx, pfn));
    JS_SetPropertyStr(ctx, console, "info", JS_DupValue(ctx, pfn));
    JS_SetPropertyStr(ctx, console, "debug", pfn);
    JS_SetPropertyStr(ctx, g, "console", console);
    JS_SetPropertyStr(ctx, g, "print",
                      JS_NewCFunction(ctx, host_print, "print", 1));
    JS_FreeValue(ctx, g);

    for (int i = 1; i < argc; i++) {
        size_t len;
        char *src = slurp(argv[i], &len);
        JSValue r = JS_Eval(ctx, src, len, argv[i], JS_EVAL_TYPE_GLOBAL);
        free(src);
        if (JS_IsException(r))
            die_exc(argv[i]);
        JS_FreeValue(ctx, r);
        drain();
    }

    drain();
    JS_FreeContext(ctx);
    JS_FreeRuntime(rt);
    return 0;
}
