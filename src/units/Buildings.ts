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
   * Current metal_mine level
   */
  public metal_mine: number;

  /**
   * Current crystal_mine level
   */
  public crystal_mine: number;

  /**
   * Current deuterium_synthesizer level
   */
  public deuterium_synthesizer: number;

  /**
   * Current solar_plant level
   */
  public solar_plant: number;

  /**
   * Current fusion_reactor level
   */
  public fusion_reactor: number;

  /**
   * Current robotic_factory level
   */
  public robotic_factory: number;

  /**
   * Current nanite_factory level
   */
  public nanite_factory: number;

  /**
   * Current shipyard level
   */
  public shipyard: number;

  /**
   * Current metal_storage level
   */
  public metal_storage: number;

  /**
   * Current crystal_storage level
   */
  public crystal_storage: number;

  /**
   * Current deuterium_storage level
   */
  public deuterium_storage: number;

  /**
   * Current research_lab level
   */
  public research_lab: number;

  /**
   * Current terraformer level
   */
  public terraformer: number;

  /**
   * Current alliance_depot level
   */
  public alliance_depot: number;

  /**
   * Current missile_silo level
   */
  public missile_silo: number;

  /**
   * Returns, if the contains valid data or not
   */
  public isValid(): boolean {
    return (
      0 <= this.planetID &&
      0 <= this.metal_mine &&
      0 <= this.crystal_mine &&
      0 <= this.deuterium_synthesizer &&
      0 <= this.solar_plant &&
      0 <= this.fusion_reactor &&
      0 <= this.robotic_factory &&
      0 <= this.nanite_factory &&
      0 <= this.shipyard &&
      0 <= this.metal_storage &&
      0 <= this.crystal_storage &&
      0 <= this.deuterium_storage &&
      0 <= this.research_lab &&
      0 <= this.terraformer &&
      0 <= this.alliance_depot &&
      0 <= this.missile_silo
    );
  }

  // public save(): Promise<{}> {
  //   return new Promise((resolve, reject) => {
  //     const query = squel
  //       .update()
  //       .table("buildings")
  //       .set("metal_mine", this.metal_mine)
  //       .set("crystal_mine", this.crystal_mine)
  //       .set("deuterium_synthesizer", this.deuterium_synthesizer)
  //       .set("solar_plant", this.solar_plant)
  //       .set("fusion_reactor", this.fusion_reactor)
  //       .set("robotic_factory", this.robotic_factory)
  //       .set("nanite_factory", this.nanite_factory)
  //       .set("shipyard", this.shipyard)
  //       .set("metal_storage", this.metal_storage)
  //       .set("crystal_storage", this.crystal_storage)
  //       .set("deuterium_storage", this.deuterium_storage)
  //       .set("research_lab", this.research_lab)
  //       .set("terraformer", this.terraformer)
  //       .set("alliance_depot", this.alliance_depot)
  //       .set("missile_silo", this.missile_silo)
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
  //       .set("metal_mine", this.metal_mine)
  //       .set("crystal_mine", this.crystal_mine)
  //       .set("deuterium_synthesizer", this.deuterium_synthesizer)
  //       .set("solar_plant", this.solar_plant)
  //       .set("fusion_reactor", this.fusion_reactor)
  //       .set("robotic_factory", this.robotic_factory)
  //       .set("nanite_factory", this.nanite_factory)
  //       .set("shipyard", this.shipyard)
  //       .set("metal_storage", this.metal_storage)
  //       .set("crystal_storage", this.crystal_storage)
  //       .set("deuterium_storage", this.deuterium_storage)
  //       .set("research_lab", this.research_lab)
  //       .set("terraformer", this.terraformer)
  //       .set("alliance_depot", this.alliance_depot)
  //       .set("missile_silo", this.missile_silo)
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
