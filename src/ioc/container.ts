export default class Container {
  private readonly services;

  public constructor() {
    this.services = {};
  }

  public service(name, createService) {
    Object.defineProperty(this, name, {
      get: () => {
        if (!this.services.hasOwnProperty(name)) {
          this.services[name] = createService(this);
        }

        return this.services[name];
      },
      configurable: true,
      enumerable: true,
    });

    return this;
  }
}
