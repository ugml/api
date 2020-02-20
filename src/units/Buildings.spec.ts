import * as chai from "chai";
import SerializationHelper from "../common/SerializationHelper";
import Buildings from "./Buildings";

const assert = chai.assert;

describe("Buildings-units", function() {
  it("buildings should be valid", function() {
    const data = {
      planetID: 1,
      metalMine: 1,
      crystalMine: 1,
      deuteriumSynthesizer: 1,
      solarPlant: 1,
      fusionReactor: 1,
      roboticFactory: 1,
      naniteFactory: 1,
      shipyard: 1,
      metalStorage: 1,
      crystalStorage: 1,
      deuteriumStorage: 1,
      researchLab: 1,
      terraformer: 1,
      allianceDepot: 1,
      missileSilo: 1,
    };

    const buildings: Buildings = SerializationHelper.toInstance(new Buildings(), JSON.stringify(data));

    assert.equal(buildings.isValid(), true);
  });

  it("Should fail (negative level)", function() {
    const data = {
      planetID: 1,
      metalMine: -1,
      crystalMine: 1,
      deuteriumSynthesizer: 1,
      solarPlant: 1,
      fusionReactor: 1,
      roboticFactory: 1,
      naniteFactory: 1,
      shipyard: 1,
      metalStorage: 1,
      crystalStorage: 1,
      deuteriumStorage: 1,
      researchLab: 1,
      terraformer: 1,
      allianceDepot: 1,
      missileSilo: 1,
    };

    const buildings: Buildings = SerializationHelper.toInstance(new Buildings(), JSON.stringify(data));

    assert.equal(buildings.isValid(), false);
  });

  it("Should fail (missing value)", function() {
    const data = {
      planetID: 1,
      crystalMine: 1,
      deuteriumSynthesizer: 1,
      solarPlant: 1,
      fusionReactor: 1,
      roboticFactory: 1,
      naniteFactory: 1,
      shipyard: 1,
      metalStorage: 1,
      crystalStorage: 1,
      deuteriumStorage: 1,
      researchLab: 1,
      terraformer: 1,
      allianceDepot: 1,
      missileSilo: 1,
    };

    const buildings: Buildings = SerializationHelper.toInstance(new Buildings(), JSON.stringify(data));

    assert.equal(buildings.isValid(), false);
  });
});
