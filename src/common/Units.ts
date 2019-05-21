class Units {

    private _data;

    public constructor() {
        this._data = require("../config/units.json");
    }

    public getBuildings() {
        return this._data.units.buildings;
    }

    public getShips() {
        return this._data.units.ships;
    }

    public getDefenses() {
        return this._data.units.defenses;
    }

    public getTechnologies() {
        return this._data.units.technologies;
    }

    public getRequirements() {
        return this._data.requirements;
    }

    public getMappings() {
        return this._data.mappings;
    }
}


export { Units };
