export default class InputValidator {
  public static isValidInt(input: string): boolean {
    if (!this.isSet(input)) {
      return false;
    }

    if (typeof input === "number") {
      return true;
    }

    return input.match(/^-{0,1}\d+$/) !== null;
  }

  public static isValidFloat(input: string): boolean {
    if (!this.isSet(input)) {
      return false;
    }

    if (typeof input === "number") {
      return true;
    }

    return input.match(/^\d+\.\d+$/) !== null;
  }

  public static isValidJson(input: string): boolean {
    try {
      JSON.parse(input);
    } catch (e) {
      return false;
    }
    return true;
  }

  public static isSet(input: any): boolean {
    return !(input === "" || typeof input === "undefined" || input === null || input.length === 0);
  }

  public static sanitizeString(input: string): string {
    return input.replace(/[^a-z0-9@ .,_-]/gim, "").trim();
  }
}
