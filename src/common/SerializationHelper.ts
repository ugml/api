class SerializationHelper {
    public static toInstance<T>(obj: T, json: string) : T {
        let jsonObj = JSON.parse(json);

        if (typeof obj["fromJSON"] === "function") {
            obj["fromJSON"](jsonObj);
        }
        else {
            for (let propName in jsonObj) {
                obj[propName] = jsonObj[propName]
            }
        }

        return obj;
    }
}

export { SerializationHelper }