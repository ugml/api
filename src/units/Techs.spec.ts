import * as chai from "chai";
import { SerializationHelper } from "../common/SerializationHelper";
import Buildings from "./Buildings";
import Techs from "./Techs";

const assert = chai.assert;

describe("Techs-units", function() {
  it("techs should be valid", function() {
    const data = {
      userID: 1,
      espionage_tech: 1,
      computer_tech: 1,
      weapon_tech: 1,
      armour_tech: 1,
      shielding_tech: 1,
      energy_tech: 1,
      hyperspace_tech: 1,
      combustion_drive_tech: 1,
      impulse_drive_tech: 1,
      hyperspace_drive_tech: 1,
      laser_tech: 1,
      ion_tech: 1,
      plasma_tech: 1,
      intergalactic_research_tech: 1,
      graviton_tech: 1,
    };

    let techs: Techs = SerializationHelper.toInstance(new Techs(), JSON.stringify(data));

    assert.equal(techs.isValid(), true);
  });

  it("Should fail (negative amount)", function() {
    const data = {
      userID: 1,
      espionage_tech: 1,
      computer_tech: 1,
      weapon_tech: 1,
      armour_tech: 1,
      shielding_tech: 1,
      energy_tech: 1,
      hyperspace_tech: 1,
      combustion_drive_tech: 1,
      impulse_drive_tech: 1,
      hyperspace_drive_tech: 1,
      laser_tech: -1,
      ion_tech: 1,
      plasma_tech: 1,
      intergalactic_research_tech: 1,
      graviton_tech: 1,
    };

    let techs: Techs = SerializationHelper.toInstance(new Techs(), JSON.stringify(data));

    assert.equal(techs.isValid(), false);
  });

  it("Should fail (missing value)", function() {
    const data = {
      userID: 1,
      espionage_tech: 1,
      computer_tech: 1,
      weapon_tech: 1,
      shielding_tech: 1,
      energy_tech: 1,
      hyperspace_tech: 1,
      combustion_drive_tech: 1,
      impulse_drive_tech: 1,
      hyperspace_drive_tech: 1,
      laser_tech: 1,
      ion_tech: 1,
      plasma_tech: 1,
      intergalactic_research_tech: 1,
      graviton_tech: 1,
    };

    let techs: Techs = SerializationHelper.toInstance(new Techs(), JSON.stringify(data));

    assert.equal(techs.isValid(), false);
  });
});
