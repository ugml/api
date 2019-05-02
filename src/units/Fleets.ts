import { Database } from '../common/Database';
import {IUnits} from "../interfaces/IUnits";
const squel = require("squel");
const Logger = require('../common/Logger');


class Fleets implements IUnits {

    planetID : number;
    small_cargo_ship : number;
    large_cargo_ship : number;
    light_fighter : number;
    heavy_fighter : number;
    cruiser : number;
    battleship : number;
    colony_ship : boolean;
    recycler : boolean;
    espionage_probe : number;
    bomber : number;
    solar_satellite : number;
    destroyer : number;
    battlecruiser : number;
    deathstar : number;


    public save() {
        return new Promise((resolve, reject) => {

            let query = squel.update()
                .table("fleets")
                .set("small_cargo_ship", this.small_cargo_ship)
                .set("large_cargo_ship", this.large_cargo_ship)
                .set("light_fighter", this.light_fighter)
                .set("heavy_fighter", this.heavy_fighter)
                .set("cruiser", this.cruiser)
                .set("battleship", this.battleship)
                .set("colony_ship", this.colony_ship)
                .set("recycler", this.recycler)
                .set("espionage_probe", this.espionage_probe)
                .set("bomber", this.bomber)
                .set("solar_satellite", this.solar_satellite)
                .set("destroyer", this.destroyer)
                .set("battlecruiser", this.battlecruiser)
                .set("deathstar", this.deathstar)
                .where("planetID = ?", this.planetID)
                .toString();

            Database.query(query).then(() => {
                return resolve(this);
            }).catch(error => {
                Logger.error(error);
                return reject(error);
            });

        });
    }

    public create() {
        return new Promise((resolve, reject) => {

            let query = squel.insert()
                .table("fleets")
                .set("planetID", this.planetID)
                .set("small_cargo_ship", this.small_cargo_ship)
                .set("large_cargo_ship", this.large_cargo_ship)
                .set("light_fighter", this.light_fighter)
                .set("heavy_fighter", this.heavy_fighter)
                .set("cruiser", this.cruiser)
                .set("battleship", this.battleship)
                .set("colony_ship", this.colony_ship)
                .set("recycler", this.recycler)
                .set("espionage_probe", this.espionage_probe)
                .set("bomber", this.bomber)
                .set("solar_satellite", this.solar_satellite)
                .set("destroyer", this.destroyer)
                .set("battlecruiser", this.battlecruiser)
                .set("deathstar", this.deathstar)
                .toString();

            Database.query(query).then(() => {
                return resolve(this);
            }).catch(error => {
                Logger.error(error);
                return reject(error);
            });

        });
    }

}

export { Fleets }