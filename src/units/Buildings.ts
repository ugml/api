import { Database } from '../common/Database';
import {IUnits} from "../interfaces/IUnits";
const squel = require("squel");
const Logger = require('../common/Logger');


class Buildings implements IUnits {

    planetID : number;
    metal_mine : number;
    crystal_mine : number;
    deuterium_synthesizer : number;
    solar_plant : number;
    fusion_reactor : number;
    robotic_factory : number;
    nanite_factory : number;
    shipyard : number;
    metal_storage : number;
    crystal_storage : number;
    deuterium_storage : number;
    research_lab : number;
    terraformer : number;
    alliance_depot : number;
    missile_silo : number;


    public save() : Promise<{}> {
        return new Promise((resolve, reject) => {

            let query = squel.update()
                .table("buildings")
                .set("metal_mine", this.metal_mine)
                .set("crystal_mine", this.crystal_mine)
                .set("deuterium_synthesizer", this.deuterium_synthesizer)
                .set("solar_plant", this.solar_plant)
                .set("fusion_reactor", this.fusion_reactor)
                .set("robotic_factory", this.robotic_factory)
                .set("nanite_factory", this.nanite_factory)
                .set("shipyard", this.shipyard)
                .set("metal_storage", this.metal_storage)
                .set("crystal_storage", this.crystal_storage)
                .set("deuterium_storage", this.deuterium_storage)
                .set("research_lab", this.research_lab)
                .set("terraformer", this.terraformer)
                .set("alliance_depot", this.alliance_depot)
                .set("missile_silo", this.missile_silo)
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

    public create() : Promise<{}> {
        return new Promise((resolve, reject) => {

            let query = squel.insert()
                .table("buildings")
                .set("planetID", this.planetID)
                .set("metal_mine", this.metal_mine)
                .set("crystal_mine", this.crystal_mine)
                .set("deuterium_synthesizer", this.deuterium_synthesizer)
                .set("solar_plant", this.solar_plant)
                .set("fusion_reactor", this.fusion_reactor)
                .set("robotic_factory", this.robotic_factory)
                .set("nanite_factory", this.nanite_factory)
                .set("shipyard", this.shipyard)
                .set("metal_storage", this.metal_storage)
                .set("crystal_storage", this.crystal_storage)
                .set("deuterium_storage", this.deuterium_storage)
                .set("research_lab", this.research_lab)
                .set("terraformer", this.terraformer)
                .set("alliance_depot", this.alliance_depot)
                .set("missile_silo", this.missile_silo)
                .toString();

            Database.query(query).then(() => {
                return resolve(this);
            }).catch(error => {
                Logger.error(error);
                return reject(error);
            });

        });
    }

    isValid() : boolean {
        return false;
    }

}

export { Buildings }