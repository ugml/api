import * as chai from "chai";
import { Globals } from "../common/Globals";
import SerializationHelper from "../common/SerializationHelper";
import Buildings from "./Buildings";
import Defenses from "./Defenses";
import Event from "./Event";
import PlanetType = Globals.PlanetType;

const assert = chai.assert;

describe("Event-unit", function() {
  it("event should be valid", function() {
    const data = {
      eventID: 1,
      ownerID: 1,
      mission: 1,
      fleetlist: "{}",
      startID: 1,
      startType: PlanetType.Planet,
      startTime: 1,
      endID: 1,
      endType: PlanetType.Planet,
      endTime: 1,
      loadedMetal: 1,
      loadedCrystal: 1,
      loadedDeuterium: 1,
      returning: false,
      deleted: false,
    };

    const event: Event = SerializationHelper.toInstance(new Event(), JSON.stringify(data));

    assert.equal(event.isValid(), true);
  });

  it("Should fail (eventID negative)", function() {
    const data = {
      eventID: -1,
      ownerID: 1,
      mission: 1,
      fleetlist: "{}",
      startID: 1,
      startType: PlanetType.Planet,
      startTime: 1,
      endID: 1,
      endType: PlanetType.Planet,
      endTime: 1,
      loadedMetal: 1,
      loadedCrystal: 1,
      loadedDeuterium: 1,
      returning: false,
      deleted: false,
    };

    const event: Event = SerializationHelper.toInstance(new Event(), JSON.stringify(data));

    assert.equal(event.isValid(), false);
  });

  it("Should fail (ownerID negative)", function() {
    const data = {
      eventID: 1,
      ownerID: -1,
      mission: 1,
      fleetlist: "{}",
      startID: 1,
      startType: PlanetType.Planet,
      startTime: 1,
      endID: 1,
      endType: PlanetType.Planet,
      endTime: 1,
      loadedMetal: 1,
      loadedCrystal: 1,
      loadedDeuterium: 1,
      returning: false,
      deleted: false,
    };

    const event: Event = SerializationHelper.toInstance(new Event(), JSON.stringify(data));

    assert.equal(event.isValid(), false);
  });

  it("Should fail (mission negative)", function() {
    const data = {
      eventID: 1,
      ownerID: 1,
      mission: -1,
      fleetlist: "{}",
      startID: 1,
      startType: PlanetType.Planet,
      startTime: 1,
      endID: 1,
      endType: PlanetType.Planet,
      endTime: 1,
      loadedMetal: 1,
      loadedCrystal: 1,
      loadedDeuterium: 1,
      returning: false,
      deleted: false,
    };

    const event: Event = SerializationHelper.toInstance(new Event(), JSON.stringify(data));

    assert.equal(event.isValid(), false);
  });

  it("Should fail (startID negative)", function() {
    const data = {
      eventID: 1,
      ownerID: 1,
      mission: 1,
      fleetlist: "{}",
      startID: -1,
      startType: PlanetType.Planet,
      startTime: 1,
      endID: 1,
      endType: PlanetType.Planet,
      endTime: 1,
      loadedMetal: 1,
      loadedCrystal: 1,
      loadedDeuterium: 1,
      returning: false,
      deleted: false,
    };

    const event: Event = SerializationHelper.toInstance(new Event(), JSON.stringify(data));

    assert.equal(event.isValid(), false);
  });

  it("Should fail (startTime negative)", function() {
    const data = {
      eventID: 1,
      ownerID: 1,
      mission: 1,
      fleetlist: "{}",
      startID: 1,
      startType: PlanetType.Planet,
      startTime: -1,
      endID: 1,
      endType: PlanetType.Planet,
      endTime: 1,
      loadedMetal: 1,
      loadedCrystal: 1,
      loadedDeuterium: 1,
      returning: false,
      deleted: false,
    };

    const event: Event = SerializationHelper.toInstance(new Event(), JSON.stringify(data));

    assert.equal(event.isValid(), false);
  });

  it("Should fail (invalid startType)", function() {
    const data = {
      eventID: 1,
      ownerID: 1,
      mission: 1,
      fleetlist: "{}",
      startID: 1,
      startType: 4,
      startTime: 1,
      endID: 1,
      endType: PlanetType.Planet,
      endTime: 1,
      loadedMetal: 1,
      loadedCrystal: 1,
      loadedDeuterium: 1,
      returning: false,
      deleted: false,
    };

    const event: Event = SerializationHelper.toInstance(new Event(), JSON.stringify(data));

    assert.equal(event.isValid(), false);
  });

  it("Should fail (fleetlist empty)", function() {
    const data = {
      eventID: 1,
      ownerID: 1,
      mission: 1,
      fleetlist: "",
      startID: 1,
      startType: 1,
      startTime: 1,
      endID: 1,
      endType: PlanetType.Planet,
      endTime: 1,
      loadedMetal: 1,
      loadedCrystal: 1,
      loadedDeuterium: 1,
      returning: false,
      deleted: false,
    };

    const event: Event = SerializationHelper.toInstance(new Event(), JSON.stringify(data));

    assert.equal(event.isValid(), false);
  });

  it("Should fail (endID negative)", function() {
    const data = {
      eventID: 1,
      ownerID: 1,
      mission: 1,
      fleetlist: "{}",
      startID: 1,
      startType: PlanetType.Planet,
      startTime: 1,
      endID: -1,
      endType: PlanetType.Planet,
      endTime: 1,
      loadedMetal: 1,
      loadedCrystal: 1,
      loadedDeuterium: 1,
      returning: false,
      deleted: false,
    };

    const event: Event = SerializationHelper.toInstance(new Event(), JSON.stringify(data));

    assert.equal(event.isValid(), false);
  });

  it("Should fail (invalid endType)", function() {
    const data = {
      eventID: 1,
      ownerID: 1,
      mission: 1,
      fleetlist: "{}",
      startID: 1,
      startType: PlanetType.Planet,
      startTime: 1,
      endID: 1,
      endType: 4,
      endTime: 1,
      loadedMetal: 1,
      loadedCrystal: 1,
      loadedDeuterium: 1,
      returning: false,
      deleted: false,
    };

    const event: Event = SerializationHelper.toInstance(new Event(), JSON.stringify(data));

    assert.equal(event.isValid(), false);
  });

  it("Should fail (endTime negative)", function() {
    const data = {
      eventID: 1,
      ownerID: 1,
      mission: 1,
      fleetlist: "{}",
      startID: 1,
      startType: PlanetType.Planet,
      startTime: 1,
      endID: 1,
      endType: PlanetType.Planet,
      endTime: -1,
      loadedMetal: 1,
      loadedCrystal: 1,
      loadedDeuterium: 1,
      returning: false,
      deleted: false,
    };

    const event: Event = SerializationHelper.toInstance(new Event(), JSON.stringify(data));

    assert.equal(event.isValid(), false);
  });

  it("Should fail (loadedMetal negative)", function() {
    const data = {
      eventID: 1,
      ownerID: 1,
      mission: 1,
      fleetlist: "{}",
      startID: 1,
      startType: PlanetType.Planet,
      startTime: 1,
      endID: 1,
      endType: PlanetType.Planet,
      endTime: 1,
      loadedMetal: -1,
      loadedCrystal: 1,
      loadedDeuterium: 1,
      returning: false,
      deleted: false,
    };

    const event: Event = SerializationHelper.toInstance(new Event(), JSON.stringify(data));

    assert.equal(event.isValid(), false);
  });

  it("Should fail (loadedCrystal negative )", function() {
    const data = {
      eventID: 1,
      ownerID: 1,
      mission: 1,
      fleetlist: "{}",
      startID: 1,
      startType: PlanetType.Planet,
      startTime: 1,
      endID: 1,
      endType: PlanetType.Planet,
      endTime: 1,
      loadedMetal: 1,
      loadedCrystal: -1,
      loadedDeuterium: 1,
      returning: false,
      deleted: false,
    };

    const event: Event = SerializationHelper.toInstance(new Event(), JSON.stringify(data));

    assert.equal(event.isValid(), false);
  });

  it("Should fail (loadedDeuterium negative)", function() {
    const data = {
      eventID: 1,
      ownerID: 1,
      mission: 1,
      fleetlist: "{}",
      startID: 1,
      startType: PlanetType.Planet,
      startTime: 1,
      endID: 1,
      endType: PlanetType.Planet,
      endTime: 1,
      loadedMetal: 1,
      loadedCrystal: 1,
      loadedDeuterium: -1,
      returning: false,
      deleted: false,
    };

    const event: Event = SerializationHelper.toInstance(new Event(), JSON.stringify(data));

    assert.equal(event.isValid(), false);
  });

  it("Should fail (missing value)", function() {
    const data = {
      eventID: 1,
      ownerID: 1,
      mission: 1,
      fleetlist: "{}",
      startID: 1,
      startTime: 1,
      endID: 1,
      endType: PlanetType.Planet,
      endTime: 1,
      loadedMetal: 1,
      loadedCrystal: 1,
      loadedDeuterium: 1,
      returning: false,
      deleted: false,
    };

    const event: Event = SerializationHelper.toInstance(new Event(), JSON.stringify(data));

    assert.equal(event.isValid(), false);
  });
});
