import { Database } from "../common/Database";
import { IUnits } from "../interfaces/IUnits";

import squel = require("squel");
import { Logger } from "../common/Logger";

class Buildings implements IUnits {
  public planetID: number;
  public metal_mine: number;
  public crystal_mine: number;
  public deuterium_synthesizer: number;
  public solar_plant: number;
  public fusion_reactor: number;
  public robotic_factory: number;
  public nanite_factory: number;
  public shipyard: number;
  public metal_storage: number;
  public crystal_storage: number;
  public deuterium_storage: number;
  public research_lab: number;
  public terraformer: number;
  public alliance_depot: number;
  public missile_silo: number;

  public save(): Promise<{}> {
    return new Promise((resolve, reject) => {
      const query = squel
        .update()
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

      Database.getConnectionPool()
        .query(query)
        .then(() => {
          return resolve(this);
        })
        .catch(error => {
          Logger.error(error);
          return reject(error);
        });
    });
  }

  public create(): Promise<{}> {
    return new Promise((resolve, reject) => {
      const query = squel
        .insert()
        .into("buildings")
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

      Database.getConnectionPool()
        .query(query)
        .then(() => {
          return resolve(this);
        })
        .catch(error => {
          Logger.error(error);
          return reject(error);
        });
    });
  }

  public isValid(): boolean {
    return false;
  }
}

export { Buildings };
