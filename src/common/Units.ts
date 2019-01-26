class Units {

    private _units;
    private _requirements;
    private _mappings;

    public constructor()
    {
        var fs = require("fs");

        var data = fs.readFileSync("dist/config/units.json", "utf8");

        var jsonObj = JSON.parse(data);

        this._units = jsonObj.units;
        this._requirements = jsonObj.requirements;
        this._mappings = jsonObj.mappings;
    }

    public getBuildings() {
        return this._units.buildings;
    }

    public getShips() {
        return this._units.ships;
    }

    public getDefenses() {
        return this._units.defenses;
    }

    public getTechnologies() {
        return this._units.technologies;
    }

    public getRequirements() {
        return this._requirements;
    }

    public getMappings() {
        return this._mappings;
    }
}


export { Units }
