/**
 * This class defines a container for IoC
 * and dependency-injection functionality
 */

export default class Container {
  private readonly servicesList;
  private readonly dataAccessList;

  /**
   * Initializes the object with an empty list of services
   */
  public constructor() {
    this.servicesList = {};
    this.dataAccessList = {};
  }

  /**
   * Returns a registered service by name.
   *
   * Example of registering:
   * container.service("buildingsService", () => new BuildingsService());
   *
   * Example of getting a registered service:
   * const myService = container.buildingsService;
   *
   * @param name the key for the registered service
   * @param createService a function which creates a new service
   */
  public service(name, createService) {
    Object.defineProperty(this, name, {
      get: () => {
        if (!this.servicesList.hasOwnProperty(name)) {
          this.servicesList[name] = createService(this);
        }

        return this.servicesList[name];
      },
      configurable: true,
      enumerable: true,
    });

    return this;
  }

  public dataAccess(name, createDataAccess) {
    Object.defineProperty(this, name, {
      get: () => {
        if (!this.dataAccessList.hasOwnProperty(name)) {
          this.dataAccessList[name] = createDataAccess(this);
        }

        return this.dataAccessList[name];
      },
      configurable: true,
      enumerable: true,
    });

    return this;
  }
}
