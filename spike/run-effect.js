(async () => {
  const { Context } = Cordis;
  const pluginE = module.exports;
  const root = new Context();
  const f = await root.plugin(pluginE);   // constructor path, but effect() self-registers
  await f.dispose();
  console.log('run-effect: wisp ctx.effect teardown via constructor path:',
    globalThis.wispEffectDisposed === true ? 'PASS' : 'FAIL');
})();
