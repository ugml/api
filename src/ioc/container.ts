/**
 * This class defines a container for IoC
 * and dependency-injection functionality
 */

export default class Container {
  /**
   * All registered DataAccesss
   */
  private readonly DataAccesss;

  /**
   * Initializes the object with an empty list of DataAccesss
   */
  public constructor() {
    this.DataAccesss = {};
  }

  /**
   * Returns a registered DataAccess by name.
   *
   * Example of registering:
   * container.DataAccess("buildingDataAccess", () => new BuildingDataAccess());
   *
   * Example of getting a registered DataAccess:
   * const myDataAccess = container.buildingDataAccess;
   *
   * @param name the key for the registered DataAccess
   * @param createDataAccess a function which creates a new DataAccess
   */
  public DataAccess(name, createDataAccess) {
    Object.defineProperty(this, name, {
      get: () => {
        if (!this.DataAccesss.hasOwnProperty(name)) {
          this.DataAccesss[name] = createDataAccess(this);
        }

        return this.DataAccesss[name];
      },
      configurable: true,
      enumerable: true,
    });

    return this;
  }
}
