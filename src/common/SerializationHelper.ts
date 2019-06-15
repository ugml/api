class SerializationHelper {
  public static toInstance<T>(obj: T, json: string): T {
    const jsonObj: object = JSON.parse(json);

    // @ts-ignore
    if (typeof obj.fromJSON === "function") {
      // @ts-ignore
      obj.fromJSON(jsonObj);
    } else {
      for (const propName in jsonObj) {
        obj[propName] = jsonObj[propName];
      }
    }

    return obj;
  }
}

export { SerializationHelper };
