(async () => {
  const { Context } = Cordis;
  const counterPlugin = module.exports;
  const root = new Context();

  // provider is a wisp `function` -> cordis constructor path. `new` still
  // runs the body, so ctx.provide() fires; only a *returned* disposer would
  // be lost (provide registers its own cleanup on the fiber regardless).
  const provFiber = await root.plugin(counterPlugin);

  let seen;
  const consumer = (ctx) => { ctx.counter.next(); seen = ctx.counter.next(); };
  consumer.inject = ['counter'];
  await root.plugin(consumer);
  console.log('run-provider: consumer saw counter.next() ->', seen);

  await provFiber.dispose();
  const gone = root.get('counter', true) === undefined;
  console.log('run-provider:',
    seen === 2 && gone ? 'PASS' : 'FAIL',
    JSON.stringify({ seen, serviceGoneAfterDispose: gone }));
})();
