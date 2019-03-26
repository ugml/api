class InputValidator {

    public static isValidInt(input : string) : boolean {

        if(input == undefined || input == "") {
            return false;
        }

        if(isNaN(parseInt(input, 10))) {
            return false;
        }

        return true;

    }

    public static isSet(input) : boolean {
        return !(input === undefined || input === "" || typeof input === 'undefined' || input === null || input.length == 0);
    }

    public static sanitizeString(input : string) : string {
        input = input.replace(/[^a-z0-9@áéíóúñü \.,_-]/gim,"");
        return input.trim();
    }


}


export { InputValidator }
