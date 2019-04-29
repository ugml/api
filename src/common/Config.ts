class Config {

    public static values;

    static get Get() {
        return this.values;
    }

}

const fs = require("fs");

const data = fs.readFileSync("dist/config/game.json", "utf8");


Config.values = JSON.parse(data);


export { Config }
