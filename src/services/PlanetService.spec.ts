import * as chai from "chai";
import { Planet } from "../units/Planet";
import { PlanetService } from "./PlanetService";

const expect = chai.expect;

describe("PlanetService", () => {
  it("should return a planet", async () => {
    const ownerID = 1;
    const planetID = 167546850;

    const result = await PlanetService.getPlanet(ownerID, planetID);

    expect(result.ownerID).to.be.equals(ownerID);
    expect(result.planetID).to.be.equals(planetID);
  });

  it("should update a planet", async () => {
    const planet: Planet = Object.assign(new Planet(), {
      planetID: 167546850,
      ownerID: 1,
      name: "Homeplanet",
      galaxy: 9,
      system: 54,
      planet: 1,
      last_update: 1556635321,
      planet_type: 1,
      image: "dschjungelplanet02",
      diameter: 14452,
      fields_current: 0,
      fields_max: 196,
      temp_min: 73,
      temp_max: 195,
      metal: 316000,
      crystal: 315555,
      deuterium: 200000,
      energy_used: 398,
      energy_max: 2211,
      metal_mine_percent: 100,
      crystal_mine_percent: 100,
      deuterium_synthesizer_percent: 100,
      solar_plant_percent: 100,
      fusion_reactor_percent: 100,
      solar_satellite_percent: 100,
      b_building_id: 0,
      b_building_endtime: 0,
      b_tech_id: 0,
      b_tech_endtime: 0,
      b_hangar_id: 0,
      b_hangar_start_time: 0,
      b_hangar_plus: false,
      destroyed: false,
    });

    const result = await PlanetService.updatePlanet(planet);

    expect(result).to.be.equals(true);
  });
});
