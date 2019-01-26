class Config {

    public static values;

    static get Get() {
        return this.values;
    }

}

var fs = require("fs");

var data = fs.readFileSync("dist/config/game.json", "utf8");


Config.values = JSON.parse(data);


export { Config }
