/* Hand-written JS cordis plugin: a `greeter` service. */
globalThis.Greeter = class Greeter extends Cordis.Service {
  constructor(ctx) {
    super(ctx, 'greeter');
  }
  hello(name) {
    return 'hello ' + name;
  }
};
