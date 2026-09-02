(async () => {
  const { Context } = Cordis;
  const mk = (label) => (ctx) => {
    console.log(label + ': body');
    return function () { console.log(label + ': disposer'); globalThis['d_'+label] = true; };
  };
  const root = new Context();

  const arrowPlugin = mk('arrow');           // arrow outer, function disposer
  const f1 = await root.plugin(arrowPlugin);
  await f1.dispose();
  console.log('arrow outer:', globalThis.d_arrow === true ? 'PASS':'FAIL');

  function funcPlugin(ctx) {                  // function outer, function disposer
    console.log('func: body');
    return function () { console.log('func: disposer'); globalThis.d_func = true; };
  }
  const f2 = await root.plugin(funcPlugin);
  await f2.dispose();
  console.log('function outer:', globalThis.d_func === true ? 'PASS':'FAIL');

  function funcArrowD(ctx) {                  // function outer, arrow disposer
    console.log('funcAD: body');
    return () => { console.log('funcAD: disposer'); globalThis.d_funcAD = true; };
  }
  const f3 = await root.plugin(funcArrowD);
  await f3.dispose();
  console.log('function outer + arrow disposer:', globalThis.d_funcAD === true ? 'PASS':'FAIL');
})();
