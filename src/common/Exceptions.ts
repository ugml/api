class DuplicateRecordError extends Error {
    constructor(m: string) {
        super(m);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, DuplicateRecordError.prototype);
    }
}

export { DuplicateRecordError }