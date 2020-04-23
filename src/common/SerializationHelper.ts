/**
 * Helper-class to create a instance of a class from a json-string
 */
export default class SerializationHelper {
  /**
   * Takes an object and a json-string and returns a new instance of the given object
   * with the given values of the parsed json-string
   * @typeparam T The new object-type
   * @param json The data, the new object should hold
   * @returns A new instance of the given object-type
   */
  public static toInstance(object, json: string) {
    const jsonObj: object = JSON.parse(json);

    if (typeof object.fromJSON === "function") {
      object.fromJSON(jsonObj);
    } else {
      for (const propName in jsonObj) {
        if (propName !== "") {
          object[propName] = jsonObj[propName];
        }
      }
    }

    return object;
  }
}
