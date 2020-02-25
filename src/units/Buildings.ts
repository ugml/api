import IUnits from "../interfaces/IUnits";

/**
 * Represents a buildings-row in the database
 */
export default class Buildings implements IUnits {
  /**
   * The ID of the planet
   */
  public planetID: number;

  /**
   * Current metalMine level
   */
  public metalMine: number;

  /**
   * Current crystalMine level
   */
  public crystalMine: number;

  /**
   * Current deuteriumSynthesizer level
   */
  public deuteriumSynthesizer: number;

  /**
   * Current solarPlant level
   */
  public solarPlant: number;

  /**
   * Current fusionReactor level
   */
  public fusionReactor: number;

  /**
   * Current roboticFactory level
   */
  public roboticFactory: number;

  /**
   * Current naniteFactory level
   */
  public naniteFactory: number;

  /**
   * Current shipyard level
   */
  public shipyard: number;

  /**
   * Current metalStorage level
   */
  public metalStorage: number;

  /**
   * Current crystalStorage level
   */
  public crystalStorage: number;

  /**
   * Current deuteriumStorage level
   */
  public deuteriumStorage: number;

  /**
   * Current researchLab level
   */
  public researchLab: number;

  /**
   * Current terraformer level
   */
  public terraformer: number;

  /**
   * Current allianceDepot level
   */
  public allianceDepot: number;

  /**
   * Current missileSilo level
   */
  public missileSilo: number;

  /**
   * Returns, if the contains valid data or not
   */
  public isValid(): boolean {
    return (
      0 <= this.planetID &&
      0 <= this.metalMine &&
      0 <= this.crystalMine &&
      0 <= this.deuteriumSynthesizer &&
      0 <= this.solarPlant &&
      0 <= this.fusionReactor &&
      0 <= this.roboticFactory &&
      0 <= this.naniteFactory &&
      0 <= this.shipyard &&
      0 <= this.metalStorage &&
      0 <= this.crystalStorage &&
      0 <= this.deuteriumStorage &&
      0 <= this.researchLab &&
      0 <= this.terraformer &&
      0 <= this.allianceDepot &&
      0 <= this.missileSilo
    );
  }

  // public save(): Promise<{}> {
  //   return new Promise((resolve, reject) => {
  //     const query = squel
  //       .update()
  //       .table("buildings")
  //       .set("metalMine", this.metalMine)
  //       .set("crystalMine", this.crystalMine)
  //       .set("deuteriumSynthesizer", this.deuteriumSynthesizer)
  //       .set("solarPlant", this.solarPlant)
  //       .set("fusionReactor", this.fusionReactor)
  //       .set("roboticFactory", this.roboticFactory)
  //       .set("naniteFactory", this.naniteFactory)
  //       .set("shipyard", this.shipyard)
  //       .set("metalStorage", this.metalStorage)
  //       .set("crystalStorage", this.crystalStorage)
  //       .set("deuteriumStorage", this.deuteriumStorage)
  //       .set("researchLab", this.researchLab)
  //       .set("terraformer", this.terraformer)
  //       .set("allianceDepot", this.allianceDepot)
  //       .set("missileSilo", this.missileSilo)
  //       .where("planetID = ?", this.planetID)
  //       .toString();
  //
  //     Database.query(query)
  //       .then(() => {
  //         return resolve(this);
  //       })
  //       .catch(error => {
  //         Logger.error(error);
  //         return reject(error);
  //       });
  //   });
  // }
  //
  // public create(): Promise<{}> {
  //   return new Promise((resolve, reject) => {
  //     const query = squel
  //       .insert()
  //       .into("buildings")
  //       .set("planetID", this.planetID)
  //       .set("metalMine", this.metalMine)
  //       .set("crystalMine", this.crystalMine)
  //       .set("deuteriumSynthesizer", this.deuteriumSynthesizer)
  //       .set("solarPlant", this.solarPlant)
  //       .set("fusionReactor", this.fusionReactor)
  //       .set("roboticFactory", this.roboticFactory)
  //       .set("naniteFactory", this.naniteFactory)
  //       .set("shipyard", this.shipyard)
  //       .set("metalStorage", this.metalStorage)
  //       .set("crystalStorage", this.crystalStorage)
  //       .set("deuteriumStorage", this.deuteriumStorage)
  //       .set("researchLab", this.researchLab)
  //       .set("terraformer", this.terraformer)
  //       .set("allianceDepot", this.allianceDepot)
  //       .set("missileSilo", this.missileSilo)
  //       .toString();
  //
  //     Database.query(query)
  //       .then(() => {
  //         return resolve(this);
  //       })
  //       .catch(error => {
  //         Logger.error(error);
  //         return reject(error);
  //       });
  //   });
  // }
}
