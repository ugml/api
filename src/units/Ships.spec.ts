import * as chai from "chai";
import SerializationHelper from "../common/SerializationHelper";
import Ships from "./Ships";

const assert = chai.assert;

describe("Ships-units", function() {
  it("ships should be valid", function() {
    const data = {
      planetID: 1,
      smallCargoShip: 1,
      largeCargoShip: 1,
      lightFighter: 1,
      heavyFighter: 1,
      cruiser: 1,
      battleship: 1,
      colonyShip: 1,
      recycler: 1,
      espionageProbe: 1,
      bomber: 1,
      solarSatellite: 1,
      destroyer: 1,
      battlecruiser: 1,
      deathstar: 1,
    };

    const ships: Ships = SerializationHelper.toInstance(new Ships(), JSON.stringify(data));

    assert.equal(ships.isValid(), true);
  });

  it("Should fail (negative amount)", function() {
    const data = {
      planetID: 1,
      smallCargoShip: 1,
      largeCargoShip: 1,
      lightFighter: -1,
      heavyFighter: 1,
      cruiser: 1,
      battleship: 1,
      colonyShip: 1,
      recycler: 1,
      espionageProbe: 1,
      bomber: 1,
      solarSatellite: 1,
      destroyer: 1,
      battlecruiser: 1,
      deathstar: 1,
    };

    const ships: Ships = SerializationHelper.toInstance(new Ships(), JSON.stringify(data));

    assert.equal(ships.isValid(), false);
  });

  it("Should fail (missing value)", function() {
    const data = {
      planetID: 1,
      smallCargoShip: 1,
      largeCargoShip: 1,
      lightFighter: 1,
      heavyFighter: 1,
      cruiser: 1,
      colonyShip: 1,
      recycler: 1,
      espionageProbe: 1,
      bomber: 1,
      solarSatellite: 1,
      destroyer: 1,
      battlecruiser: 1,
      deathstar: 1,
    };

    const ships: Ships = SerializationHelper.toInstance(new Ships(), JSON.stringify(data));

    assert.equal(ships.isValid(), false);
  });
});
