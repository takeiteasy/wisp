BROWSERIFY = ./node_modules/browserify/bin/cmd.js
MINIFY = ./node_modules/.bin/minify
WISP_CURRENT = node ./bin/wisp.js
FLAGS =
INSTALL_MESSAGE = "You need to run 'npm install' to install build dependencies."
BUILD_DEPS = $(BROWSERIFY) $(MINIFY) ./node_modules/wisp/bin/wisp.js
# set make's source file search path
vpath % src

ifdef verbose
	FLAGS = --verbose
endif

ifdef current
	WISP = $(WISP_CURRENT)
else
	WISP = ./node_modules/wisp/bin/wisp.js
endif

CORE = expander runtime sequence string ast reader compiler analyzer
core: $(CORE) writer escodegen
escodegen: escodegen-writer escodegen-generator
node: core wisp node-engine repl
browser: node core browser-engine dist/wisp.min.js
all: browser

test: core node recompile
	$(WISP_CURRENT) ./test/test.wisp $(FLAGS)

$(BUILD_DEPS):
	@echo $(INSTALL_MESSAGE)
	@exit 1

clean:
	rm -rf engine
	rm -rf backend
	rm -rf dist
	rm -f *.js

%.js: %.wisp $(WISP)
	@mkdir -p $(dir $@)
	$(WISP) --source-uri wisp/$(subst .js,.wisp,$@) < $< > $@

RECOMPILE = backend/escodegen/writer backend/escodegen/generator backend/javascript/writer engine/node engine/browser $(CORE)
recompile: node browser-engine
	$(info Recompiling with current version:)
	@$(foreach file,$(RECOMPILE),\
		echo "	$(file)" && \
		$(WISP_CURRENT) --source-uri wisp/$(file).wisp < src/$(file).wisp > $(file).js~ && \
		mv $(file).js~ $(file).js &&) echo "...done"

### core ###

repl: repl.js

reader: reader.js

compiler: compiler.js

runtime: runtime.js

sequence: sequence.js

string: string.js

ast: ast.js

analyzer: analyzer.js

expander: expander.js

wisp: wisp.js

writer: backend/javascript/writer.js

### escodegen backend ###

escodegen-writer: backend/escodegen/writer.js

escodegen-generator: backend/escodegen/generator.js

### platform engine bundles ###

node-engine: ./engine/node.js

browser-engine: ./engine/browser.js

dist/wisp.js: engine/browser.js $(WISP) $(BROWSERIFY) browserify.wisp core wisp repl node-engine
	@mkdir -p dist
	$(WISP_CURRENT) browserify.wisp > dist/wisp.js

dist/wisp.min.js: dist/wisp.js $(MINIFY)
	@mkdir -p dist
	$(MINIFY) dist/wisp.js > dist/wisp.min.js

jsc_bundle.js: src/jsc_bundle.wisp

dist/wisp_jsc.js: jsc_bundle.js $(WISP) $(BROWSERIFY) build_jsc_bundle.wisp node
	@mkdir -p dist
	$(WISP_CURRENT) build_jsc_bundle.wisp > dist/wisp_jsc.js

bundle: dist/wisp_jsc.js
	cp dist/wisp_jsc.js ../Sources/AppleLisp/Resources/wisp_jsc.js

### quickjs backend (wisc) ###

QJS_DIR = vendor/quickjs-ng
QJS_BUILD_DIR = $(QJS_DIR)/build
QJS_LIB = $(QJS_BUILD_DIR)/libqjs.a
BUILD_DIR = build
BUNDLE_JS = dist/wisp_qjs.js
WISC = $(BUILD_DIR)/wisc
WISC_CFLAGS = -O2 -Wall -std=c11 -I$(QJS_DIR)
WISC_LDFLAGS =
WISC_LIBS = -lm -ldl -pthread

# editline gives the REPL line editing/history where available (e.g. macOS libedit)
EDITLINE_OK = $(shell mkdir -p $(BUILD_DIR) && printf '#include <editline/readline.h>\nint main(void){return 0;}' \
                  > $(BUILD_DIR)/probe_editline.c && $(CC) -c $(BUILD_DIR)/probe_editline.c \
                  -o $(BUILD_DIR)/probe_editline.o 2>/dev/null && echo yes)
ifeq ($(EDITLINE_OK),yes)
	WISC_CFLAGS += -DHAVE_EDITLINE
	WISC_LIBS += -ledit
endif

$(QJS_DIR):
	@echo "Run 'git submodule update --init' to fetch vendor/quickjs-ng."
	@exit 1

$(QJS_LIB): | $(QJS_DIR)
	cmake -S $(QJS_DIR) -B $(QJS_BUILD_DIR) -DCMAKE_BUILD_TYPE=Release
	cmake --build $(QJS_BUILD_DIR) --target qjs -j 4

$(BUNDLE_JS): qjs_bundle.js build_qjs_bundle.wisp core
	@mkdir -p $(dir $@)
	node -e "require('browserify')('./qjs_bundle.js', { standalone: 'Wisp' }).bundle(function (err, data) { if (err) throw err; require('fs').writeFileSync('$(BUNDLE_JS)', data); })"

$(BUILD_DIR)/bundle.c: $(BUNDLE_JS)
	@mkdir -p $(BUILD_DIR)
	xxd -i $(BUNDLE_JS) > $@

$(BUILD_DIR)/main.o: src/main.c
	@mkdir -p $(BUILD_DIR)
	$(CC) $(WISC_CFLAGS) -c $< -o $@

$(WISC): $(BUILD_DIR)/main.o $(BUILD_DIR)/bundle.o $(QJS_LIB)
	$(CC) $(WISC_LDFLAGS) $^ -o $@ $(WISC_LIBS)

$(BUILD_DIR)/bundle.o: $(BUILD_DIR)/bundle.c
	$(CC) -c $< -o $@

wisc: $(WISC)

# smoke tests for the quickjs-backed binary
wisc-check: $(WISC)
	@$(WISC) -e '(+ 1 2)' | grep -qx '3'
	@printf "(def x 6)" > $(BUILD_DIR)/wisc_check.wisp
	@echo "(* x 7)" >> $(BUILD_DIR)/wisc_check.wisp
	@$(WISC) -e '(def x 6)' -e '(* x 7)' | grep -qx '42'
	@echo '(+ 1 2)' | $(WISC) -c - | grep -q '^1 + 2;'
	@printf '(+ 1 2)\n(defn sq [x] (* x x))\n(sq 9)\n:q\n' | $(WISC) -i | sed 's/^user=> //' | grep -qx '81'
	@rm -f $(BUILD_DIR)/wisc_check.wisp
	@echo "wisc-check OK"

wisc-clean:
	rm -rf $(BUILD_DIR) dist/wisp_qjs.js
