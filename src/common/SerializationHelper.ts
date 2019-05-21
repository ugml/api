export class SerializationHelper {
    public static toInstance<T>(obj: T, json: string) : T {
        const jsonObj : object = JSON.parse(json);

        if (typeof obj.fromJSON === "function") {
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
