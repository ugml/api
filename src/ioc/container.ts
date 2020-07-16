/**
 * This class defines a container for IoC
 * and dependency-injection functionality
 */

// import { iocContainer } from "./the/path/to/the/module/from/tsoa.json";
//
// iocContainer.get<FooController>(FooController);


export default class Container {
  /**
   * All registered services
   */
  private readonly services;

  /**
   * Initializes the object with an empty list of services
   */
  public constructor() {
    this.services = {};
  }

  /**
   * Returns a registered service by name.
   *
   * Example of registering:
   * container.service("buildingService", () => new BuildingService());
   *
   * Example of getting a registered service:
   * const myService = container.buildingService;
   *
   * @param name the key for the registered service
   * @param createService a function which creates a new service
   */
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
