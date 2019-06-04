declare class Config {
    private static connection : any;
    public static getConnection() : object;
    public static query(sql : string, args : object) : Promise<object>;
}