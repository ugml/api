import { Database } from '../common/Database';
import {IUnits} from "../interfaces/IUnits";
const squel = require("squel");
const Logger = require('../common/Logger');


class Defenses implements IUnits {

    planetID : number;
    rocket_launcher : number;
    light_laser : number;
    heavy_laser : number;
    ion_cannon : number;
    gauss_cannon : number;
    plasma_turret : number;
    small_shield_dome : boolean;
    large_shield_dome : boolean;
    anti_ballistic_missile : number;
    interplanetary_missile : number;


    public save() {
        return new Promise((resolve, reject) => {

            let query = squel.update()
                .table("defenses")
                .set("rocket_launcher", this.rocket_launcher)
                .set("light_laser", this.light_laser)
                .set("heavy_laser", this.heavy_laser)
                .set("ion_cannon", this.ion_cannon)
                .set("gauss_cannon", this.gauss_cannon)
                .set("plasma_turret", this.plasma_turret)
                .set("small_shield_dome", this.small_shield_dome)
                .set("large_shield_dome", this.large_shield_dome)
                .set("anti_ballistic_missile", this.anti_ballistic_missile)
                .set("interplanetary_missile", this.interplanetary_missile)
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
                .table("defenses")
                .set("planetID", this.planetID)
                .set("rocket_launcher", this.rocket_launcher)
                .set("light_laser", this.light_laser)
                .set("heavy_laser", this.heavy_laser)
                .set("ion_cannon", this.ion_cannon)
                .set("gauss_cannon", this.gauss_cannon)
                .set("plasma_turret", this.plasma_turret)
                .set("small_shield_dome", this.small_shield_dome)
                .set("large_shield_dome", this.large_shield_dome)
                .set("anti_ballistic_missile", this.anti_ballistic_missile)
                .set("interplanetary_missile", this.interplanetary_missile)
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

export { Defenses }