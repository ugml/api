import * as chai from "chai";
import SerializationHelper from "../common/SerializationHelper";
import Buildings from "./Buildings";
import Defenses from "./Defenses";

const assert = chai.assert;

describe("Defenses-units", function() {
  it("defenses should be valid", function() {
    const data = {
      planetID: 1,
      rocket_launcher: 1,
      light_laser: 1,
      heavy_laser: 1,
      ion_cannon: 1,
      gauss_cannon: 1,
      plasma_turret: 1,
      small_shield_dome: true,
      large_shield_dome: true,
      anti_ballistic_missile: 1,
      interplanetary_missile: 1,
    };

    const defenses: Defenses = SerializationHelper.toInstance(new Defenses(), JSON.stringify(data));

    assert.equal(defenses.isValid(), true);
  });

  it("Should fail (negative amount)", function() {
    const data = {
      planetID: 1,
      rocket_launcher: -1,
      light_laser: 1,
      heavy_laser: 1,
      ion_cannon: 1,
      gauss_cannon: 1,
      plasma_turret: 1,
      small_shield_dome: true,
      large_shield_dome: true,
      anti_ballistic_missile: 1,
      interplanetary_missile: 1,
    };

    const defenses: Defenses = SerializationHelper.toInstance(new Defenses(), JSON.stringify(data));

    assert.equal(defenses.isValid(), false);
  });

  it("Should fail (missing value)", function() {
    const data = {
      planetID: 1,
      rocket_launcher: 1,
      heavy_laser: 1,
      ion_cannon: 1,
      gauss_cannon: 1,
      plasma_turret: 1,
      small_shield_dome: true,
      large_shield_dome: true,
      anti_ballistic_missile: 1,
      interplanetary_missile: 1,
    };

    const defenses: Defenses = SerializationHelper.toInstance(new Defenses(), JSON.stringify(data));

    assert.equal(defenses.isValid(), false);
  });
});
