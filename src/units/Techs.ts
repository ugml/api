import { Database } from '../common/Database';
import {IUnits} from "../interfaces/IUnits";
const squel = require("squel");
const Logger = require('../common/Logger');


class Techs implements IUnits {

    userID : number;
    espionage_tech : number;
    computer_tech : number;
    weapon_tech : number;
    armour_tech : number;
    shielding_tech : number;
    energy_tech : number;
    hyperspace_tech : number;
    combustion_drive_tech : number;
    impulse_drive_tech : number;
    hyperspace_drive_tech : number;
    laser_tech : number;
    ion_tech : number;
    plasma_tech : number;
    intergalactic_research_tech : number;
    graviton_tech : number;


    public save() {
        return new Promise((resolve, reject) => {

            let query = squel.update()
                .table("planets")
                .set("espionage_tech", this.espionage_tech)
                .set("computer_tech", this.computer_tech)
                .set("weapon_tech", this.weapon_tech)
                .set("armour_tech", this.armour_tech)
                .set("shielding_tech", this.shielding_tech)
                .set("energy_tech", this.energy_tech)
                .set("hyperspace_tech", this.hyperspace_tech)
                .set("combustion_drive_tech", this.combustion_drive_tech)
                .set("impulse_drive_tech", this.impulse_drive_tech)
                .set("hyperspace_drive_tech", this.hyperspace_drive_tech)
                .set("laser_tech", this.laser_tech)
                .set("ion_tech", this.ion_tech)
                .set("plasma_tech", this.plasma_tech)
                .set("intergalactic_research_tech", this.intergalactic_research_tech)
                .set("graviton_tech", this.graviton_tech)
                .where("userID = ?", this.userID)
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
                .set("userID", this.userID)
                .set("espionage_tech", this.espionage_tech)
                .set("computer_tech", this.computer_tech)
                .set("weapon_tech", this.weapon_tech)
                .set("armour_tech", this.armour_tech)
                .set("shielding_tech", this.shielding_tech)
                .set("energy_tech", this.energy_tech)
                .set("hyperspace_tech", this.hyperspace_tech)
                .set("combustion_drive_tech", this.combustion_drive_tech)
                .set("impulse_drive_tech", this.impulse_drive_tech)
                .set("hyperspace_drive_tech", this.hyperspace_drive_tech)
                .set("laser_tech", this.laser_tech)
                .set("ion_tech", this.ion_tech)
                .set("plasma_tech", this.plasma_tech)
                .set("intergalactic_research_tech", this.intergalactic_research_tech)
                .set("graviton_tech", this.graviton_tech)
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

export { Techs }