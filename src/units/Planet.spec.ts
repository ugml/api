import * as chai from "chai";
import { Globals } from "../common/Globals";
import { SerializationHelper } from "../common/SerializationHelper";
import Buildings from "./Buildings";
import Planet from "./Planet";

const assert = chai.assert;

describe("Planet-units", function() {
  it("planet should be valid", function() {
    const data = {
      planetID: 1,
      ownerID: 1,
      name: "Test",
      galaxy: 1,
      system: 1,
      planet: 1,
      last_update: 1,
      planet_type: Globals.PlanetType.Planet,
      image: "Test",
      diameter: 1,
      fields_current: 1,
      fields_max: 1,
      temp_min: 1,
      temp_max: 1,
      metal: 1,
      crystal: 1,
      deuterium: 1,
      energy_used: 1,
      energy_max: 1,
      metal_mine_percent: 1,
      crystal_mine_percent: 1,
      deuterium_synthesizer_percent: 1,
      solar_plant_percent: 1,
      fusion_reactor_percent: 1,
      solar_satellite_percent: 1,
      b_building_id: 1,
      b_building_endtime: 1,
      b_tech_id: 1,
      b_tech_endtime: 1,
      b_hangar_queue: "Test",
      b_hangar_start_time: 1,
      b_hangar_plus: false,
      destroyed: false,
    };

    let planet: Planet = SerializationHelper.toInstance(new Planet(), JSON.stringify(data));

    assert.equal(planet.isValid(), true);
  });

  it("Should fail (negative value)", function() {
    const data = {
      planetID: 1,
      ownerID: 1,
      name: "Test",
      galaxy: 1,
      system: 1,
      planet: 1,
      last_update: 1,
      planet_type: Globals.PlanetType.Planet,
      image: "Test",
      diameter: -1,
      fields_current: 1,
      fields_max: 1,
      temp_min: 1,
      temp_max: 1,
      metal: 1,
      crystal: 1,
      deuterium: 1,
      energy_used: 1,
      energy_max: 1,
      metal_mine_percent: 1,
      crystal_mine_percent: 1,
      deuterium_synthesizer_percent: 1,
      solar_plant_percent: 1,
      fusion_reactor_percent: 1,
      solar_satellite_percent: 1,
      b_building_id: 1,
      b_building_endtime: 1,
      b_tech_id: 1,
      b_tech_endtime: 1,
      b_hangar_queue: "Test",
      b_hangar_start_time: 1,
      b_hangar_plus: false,
      destroyed: false,
    };

    let planet: Planet = SerializationHelper.toInstance(new Planet(), JSON.stringify(data));

    assert.equal(planet.isValid(), false);
  });

  it("Should fail (missing value)", function() {
    const data = {
      planetID: 1,
      ownerID: 1,
      name: "Test",
      galaxy: 1,
      system: 1,
      planet: 1,
      last_update: 1,
      planet_type: Globals.PlanetType.Planet,
      image: "Test",
      diameter: 1,
      fields_current: 1,
      fields_max: 1,
      temp_min: 1,
      temp_max: 1,
      metal: 1,
      crystal: 1,
      deuterium: 1,
      energy_used: 1,
      energy_max: 1,
      crystal_mine_percent: 1,
      deuterium_synthesizer_percent: 1,
      solar_plant_percent: 1,
      fusion_reactor_percent: 1,
      solar_satellite_percent: 1,
      b_building_id: 1,
      b_building_endtime: 1,
      b_tech_id: 1,
      b_tech_endtime: 1,
      b_hangar_queue: "Test",
      b_hangar_start_time: 1,
      b_hangar_plus: false,
      destroyed: false,
    };

    let planet: Planet = SerializationHelper.toInstance(new Planet(), JSON.stringify(data));

    assert.equal(planet.isValid(), false);
  });
});
