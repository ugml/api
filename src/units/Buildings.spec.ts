import * as chai from "chai";
import SerializationHelper from "../common/SerializationHelper";
import Buildings from "./Buildings";

const assert = chai.assert;

describe("Buildings-units", function() {
  it("buildings should be valid", function() {
    const data = {
      planetID: 1,
      metal_mine: 1,
      crystal_mine: 1,
      deuterium_synthesizer: 1,
      solar_plant: 1,
      fusion_reactor: 1,
      robotic_factory: 1,
      nanite_factory: 1,
      shipyard: 1,
      metal_storage: 1,
      crystal_storage: 1,
      deuterium_storage: 1,
      research_lab: 1,
      terraformer: 1,
      alliance_depot: 1,
      missile_silo: 1,
    };

    const buildings: Buildings = SerializationHelper.toInstance(new Buildings(), JSON.stringify(data));

    assert.equal(buildings.isValid(), true);
  });

  it("Should fail (negative level)", function() {
    const data = {
      planetID: 1,
      metal_mine: -1,
      crystal_mine: 1,
      deuterium_synthesizer: 1,
      solar_plant: 1,
      fusion_reactor: 1,
      robotic_factory: 1,
      nanite_factory: 1,
      shipyard: 1,
      metal_storage: 1,
      crystal_storage: 1,
      deuterium_storage: 1,
      research_lab: 1,
      terraformer: 1,
      alliance_depot: 1,
      missile_silo: 1,
    };

    const buildings: Buildings = SerializationHelper.toInstance(new Buildings(), JSON.stringify(data));

    assert.equal(buildings.isValid(), false);
  });

  it("Should fail (missing value)", function() {
    const data = {
      planetID: 1,
      crystal_mine: 1,
      deuterium_synthesizer: 1,
      solar_plant: 1,
      fusion_reactor: 1,
      robotic_factory: 1,
      nanite_factory: 1,
      shipyard: 1,
      metal_storage: 1,
      crystal_storage: 1,
      deuterium_storage: 1,
      research_lab: 1,
      terraformer: 1,
      alliance_depot: 1,
      missile_silo: 1,
    };

    const buildings: Buildings = SerializationHelper.toInstance(new Buildings(), JSON.stringify(data));

    assert.equal(buildings.isValid(), false);
  });
});
