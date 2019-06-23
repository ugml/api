import { Database } from "../common/Database";
import { IUnits } from "../interfaces/IUnits";

import squel = require("squel");
import { Logger } from "../common/Logger";

class Techs implements IUnits {
  public userID: number;
  public espionage_tech: number;
  public computer_tech: number;
  public weapon_tech: number;
  public armour_tech: number;
  public shielding_tech: number;
  public energy_tech: number;
  public hyperspace_tech: number;
  public combustion_drive_tech: number;
  public impulse_drive_tech: number;
  public hyperspace_drive_tech: number;
  public laser_tech: number;
  public ion_tech: number;
  public plasma_tech: number;
  public intergalactic_research_tech: number;
  public graviton_tech: number;

  public save(): Promise<{}> {
    return new Promise((resolve, reject) => {
      const query = squel
        .update()
        .table("techs")
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

      Database.getConnectionPool().query(query)
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
        .into("techs")
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

      Database.getConnectionPool().query(query)
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

export { Techs };
