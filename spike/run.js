(async () => {
  try {
    const { Context } = Cordis;
    const Greeter = globalThis.Greeter;
    const pluginB = module.exports;
    if (typeof pluginB !== 'function')
      throw new Error('wisp plugin did not export a function: ' + typeof pluginB);

    const root = new Context();
    await root.plugin(Greeter);

    // wisp `defn` emits a named `function` (has .prototype), which cordis's
    // isConstructor() classifies as a class -> it runs `new plugin()` and
    // drops the return value. Wrap in an arrow (no .prototype) at the
    // boundary so the wisp plugin's returned disposer is honored. Plugins
    // that use ctx.effect() for cleanup don't need this.
    const wrapped = (ctx, cfg) => pluginB(ctx, cfg);
    wrapped.inject = pluginB.inject;
    const fiber = await root.plugin(wrapped);
    console.log('run: fiber.state =', fiber.state);

    const direct = root.greeter.hello('direct');
    console.log('run: direct service call ->', direct);

    // dispose the wisp plugin's own fiber (root.fiber.dispose() restarts
    // the root rather than tearing down, per the uid-0 branch in cordis)
    await fiber.dispose();

    const pass =
      direct === 'hello direct' && globalThis.wispDisposed === true;
    console.log(
      pass ? 'SPIKE PASS' : 'SPIKE FAIL',
      JSON.stringify({
        directCall: direct,
        wispDisposerRan: globalThis.wispDisposed === true,
        injectDeclared: JSON.stringify(pluginB.inject),
      })
    );
    if (!pass) throw new Error('assertions failed');
  } catch (e) {
    console.error('run: ERROR', e && e.stack ? e.stack : String(e));
    throw e;
  }
})();
