import * as chai from "chai";
import SerializationHelper from "../common/SerializationHelper";
import Buildings from "./Buildings";
import Defenses from "./Defenses";

const assert = chai.assert;

describe("Defenses-units", function() {
  it("defenses should be valid", function() {
    const data = {
      planetID: 1,
      rocketLauncher: 1,
      lightLaser: 1,
      heavyLaser: 1,
      ionCannon: 1,
      gaussCannon: 1,
      plasmaTurret: 1,
      smallShieldDome: true,
      largeShieldDome: true,
      antiBallisticMissile: 1,
      interplanetaryMissile: 1,
    };

    const defenses: Defenses = SerializationHelper.toInstance(new Defenses(), JSON.stringify(data));

    assert.equal(defenses.isValid(), true);
  });

  it("Should fail (negative amount)", function() {
    const data = {
      planetID: 1,
      rocketLauncher: -1,
      lightLaser: 1,
      heavyLaser: 1,
      ionCannon: 1,
      gaussCannon: 1,
      plasmaTurret: 1,
      smallShieldDome: true,
      largeShieldDome: true,
      antiBallisticMissile: 1,
      interplanetaryMissile: 1,
    };

    const defenses: Defenses = SerializationHelper.toInstance(new Defenses(), JSON.stringify(data));

    assert.equal(defenses.isValid(), false);
  });

  it("Should fail (missing value)", function() {
    const data = {
      planetID: 1,
      rocketLauncher: 1,
      heavyLaser: 1,
      ionCannon: 1,
      gaussCannon: 1,
      plasmaTurret: 1,
      smallShieldDome: true,
      largeShieldDome: true,
      antiBallisticMissile: 1,
      interplanetaryMissile: 1,
    };

    const defenses: Defenses = SerializationHelper.toInstance(new Defenses(), JSON.stringify(data));

    assert.equal(defenses.isValid(), false);
  });
});
