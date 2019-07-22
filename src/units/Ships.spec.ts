import * as chai from "chai";
import { SerializationHelper } from "../common/SerializationHelper";
import Buildings from "./Buildings";
import Ships from "./Ships";

const assert = chai.assert;

describe("Ships-units", function() {
  it("ships should be valid", function() {
    const data = {
      planetID: 1,
      small_cargo_ship: 1,
      large_cargo_ship: 1,
      light_fighter: 1,
      heavy_fighter: 1,
      cruiser: 1,
      battleship: 1,
      colony_ship: 1,
      recycler: 1,
      espionage_probe: 1,
      bomber: 1,
      solar_satellite: 1,
      destroyer: 1,
      battlecruiser: 1,
      deathstar: 1,
    };

    let ships: Ships = SerializationHelper.toInstance(new Ships(), JSON.stringify(data));

    assert.equal(ships.isValid(), true);
  });

  it("Should fail (negative amount)", function() {
    const data = {
      planetID: 1,
      small_cargo_ship: 1,
      large_cargo_ship: 1,
      light_fighter: -1,
      heavy_fighter: 1,
      cruiser: 1,
      battleship: 1,
      colony_ship: 1,
      recycler: 1,
      espionage_probe: 1,
      bomber: 1,
      solar_satellite: 1,
      destroyer: 1,
      battlecruiser: 1,
      deathstar: 1,
    };

    let ships: Ships = SerializationHelper.toInstance(new Ships(), JSON.stringify(data));

    assert.equal(ships.isValid(), false);
  });

  it("Should fail (missing value)", function() {
    const data = {
      planetID: 1,
      small_cargo_ship: 1,
      large_cargo_ship: 1,
      light_fighter: 1,
      heavy_fighter: 1,
      cruiser: 1,
      colony_ship: 1,
      recycler: 1,
      espionage_probe: 1,
      bomber: 1,
      solar_satellite: 1,
      destroyer: 1,
      battlecruiser: 1,
      deathstar: 1,
    };

    let ships: Ships = SerializationHelper.toInstance(new Ships(), JSON.stringify(data));

    assert.equal(ships.isValid(), false);
  });
});
