import * as chai from "chai";
import SerializationHelper from "../common/SerializationHelper";
import Techs from "./Techs";

const assert = chai.assert;

describe("Techs-units", function() {
  it("techs should be valid", function() {
    const data = {
      userID: 1,
      espionageTech: 1,
      computerTech: 1,
      weaponTech: 1,
      armourTech: 1,
      shieldingTech: 1,
      energyTech: 1,
      hyperspaceTech: 1,
      combustionDriveTech: 1,
      impulseDriveTech: 1,
      hyperspaceDriveTech: 1,
      laserTech: 1,
      ionTech: 1,
      plasmaTech: 1,
      intergalacticResearchTech: 1,
      gravitonTech: 1,
    };

    const techs: Techs = SerializationHelper.toInstance(new Techs(), JSON.stringify(data));

    assert.equal(techs.isValid(), true);
  });

  it("Should fail (negative amount)", function() {
    const data = {
      userID: 1,
      espionageTech: 1,
      computerTech: 1,
      weaponTech: 1,
      armourTech: 1,
      shieldingTech: 1,
      energyTech: 1,
      hyperspaceTech: 1,
      combustionDriveTech: 1,
      impulseDriveTech: 1,
      hyperspaceDriveTech: 1,
      laserTech: -1,
      ionTech: 1,
      plasmaTech: 1,
      intergalacticResearchTech: 1,
      gravitonTech: 1,
    };

    const techs: Techs = SerializationHelper.toInstance(new Techs(), JSON.stringify(data));

    assert.equal(techs.isValid(), false);
  });

  it("Should fail (missing value)", function() {
    const data = {
      userID: 1,
      espionageTech: 1,
      computerTech: 1,
      weaponTech: 1,
      shieldingTech: 1,
      energyTech: 1,
      hyperspaceTech: 1,
      combustionDriveTech: 1,
      impulseDriveTech: 1,
      hyperspaceDriveTech: 1,
      laserTech: 1,
      ionTech: 1,
      plasmaTech: 1,
      intergalacticResearchTech: 1,
      gravitonTech: 1,
    };

    const techs: Techs = SerializationHelper.toInstance(new Techs(), JSON.stringify(data));

    assert.equal(techs.isValid(), false);
  });
});
