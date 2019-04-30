class DuplicateRecordError extends Error {
    constructor(m: string) {
        super(m);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, DuplicateRecordError.prototype);
    }
}

class InvalidParameter extends Error {
    constructor(m: string) {
        super(m);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, InvalidParameter.prototype);
    }
}

export { DuplicateRecordError, InvalidParameter }