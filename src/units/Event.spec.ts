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
      start_id: 1,
      start_type: PlanetType.Planet,
      start_time: 1,
      end_id: 1,
      end_type: PlanetType.Planet,
      end_time: 1,
      loaded_metal: 1,
      loaded_crystal: 1,
      loaded_deuterium: 1,
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
      start_id: 1,
      start_type: PlanetType.Planet,
      start_time: 1,
      end_id: 1,
      end_type: PlanetType.Planet,
      end_time: 1,
      loaded_metal: 1,
      loaded_crystal: 1,
      loaded_deuterium: 1,
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
      start_id: 1,
      start_type: PlanetType.Planet,
      start_time: 1,
      end_id: 1,
      end_type: PlanetType.Planet,
      end_time: 1,
      loaded_metal: 1,
      loaded_crystal: 1,
      loaded_deuterium: 1,
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
      start_id: 1,
      start_type: PlanetType.Planet,
      start_time: 1,
      end_id: 1,
      end_type: PlanetType.Planet,
      end_time: 1,
      loaded_metal: 1,
      loaded_crystal: 1,
      loaded_deuterium: 1,
      returning: false,
      deleted: false,
    };

    const event: Event = SerializationHelper.toInstance(new Event(), JSON.stringify(data));

    assert.equal(event.isValid(), false);
  });

  it("Should fail (start_id negative)", function() {
    const data = {
      eventID: 1,
      ownerID: 1,
      mission: 1,
      fleetlist: "{}",
      start_id: -1,
      start_type: PlanetType.Planet,
      start_time: 1,
      end_id: 1,
      end_type: PlanetType.Planet,
      end_time: 1,
      loaded_metal: 1,
      loaded_crystal: 1,
      loaded_deuterium: 1,
      returning: false,
      deleted: false,
    };

    const event: Event = SerializationHelper.toInstance(new Event(), JSON.stringify(data));

    assert.equal(event.isValid(), false);
  });

  it("Should fail (start_time negative)", function() {
    const data = {
      eventID: 1,
      ownerID: 1,
      mission: 1,
      fleetlist: "{}",
      start_id: 1,
      start_type: PlanetType.Planet,
      start_time: -1,
      end_id: 1,
      end_type: PlanetType.Planet,
      end_time: 1,
      loaded_metal: 1,
      loaded_crystal: 1,
      loaded_deuterium: 1,
      returning: false,
      deleted: false,
    };

    const event: Event = SerializationHelper.toInstance(new Event(), JSON.stringify(data));

    assert.equal(event.isValid(), false);
  });

  it("Should fail (invalid start_type)", function() {
    const data = {
      eventID: 1,
      ownerID: 1,
      mission: 1,
      fleetlist: "{}",
      start_id: 1,
      start_type: 4,
      start_time: 1,
      end_id: 1,
      end_type: PlanetType.Planet,
      end_time: 1,
      loaded_metal: 1,
      loaded_crystal: 1,
      loaded_deuterium: 1,
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
      start_id: 1,
      start_type: 1,
      start_time: 1,
      end_id: 1,
      end_type: PlanetType.Planet,
      end_time: 1,
      loaded_metal: 1,
      loaded_crystal: 1,
      loaded_deuterium: 1,
      returning: false,
      deleted: false,
    };

    const event: Event = SerializationHelper.toInstance(new Event(), JSON.stringify(data));

    assert.equal(event.isValid(), false);
  });

  it("Should fail (end_id negative)", function() {
    const data = {
      eventID: 1,
      ownerID: 1,
      mission: 1,
      fleetlist: "{}",
      start_id: 1,
      start_type: PlanetType.Planet,
      start_time: 1,
      end_id: -1,
      end_type: PlanetType.Planet,
      end_time: 1,
      loaded_metal: 1,
      loaded_crystal: 1,
      loaded_deuterium: 1,
      returning: false,
      deleted: false,
    };

    const event: Event = SerializationHelper.toInstance(new Event(), JSON.stringify(data));

    assert.equal(event.isValid(), false);
  });

  it("Should fail (invalid end_type)", function() {
    const data = {
      eventID: 1,
      ownerID: 1,
      mission: 1,
      fleetlist: "{}",
      start_id: 1,
      start_type: PlanetType.Planet,
      start_time: 1,
      end_id: 1,
      end_type: 4,
      end_time: 1,
      loaded_metal: 1,
      loaded_crystal: 1,
      loaded_deuterium: 1,
      returning: false,
      deleted: false,
    };

    const event: Event = SerializationHelper.toInstance(new Event(), JSON.stringify(data));

    assert.equal(event.isValid(), false);
  });

  it("Should fail (end_time negative)", function() {
    const data = {
      eventID: 1,
      ownerID: 1,
      mission: 1,
      fleetlist: "{}",
      start_id: 1,
      start_type: PlanetType.Planet,
      start_time: 1,
      end_id: 1,
      end_type: PlanetType.Planet,
      end_time: -1,
      loaded_metal: 1,
      loaded_crystal: 1,
      loaded_deuterium: 1,
      returning: false,
      deleted: false,
    };

    const event: Event = SerializationHelper.toInstance(new Event(), JSON.stringify(data));

    assert.equal(event.isValid(), false);
  });

  it("Should fail (loaded_metal negative)", function() {
    const data = {
      eventID: 1,
      ownerID: 1,
      mission: 1,
      fleetlist: "{}",
      start_id: 1,
      start_type: PlanetType.Planet,
      start_time: 1,
      end_id: 1,
      end_type: PlanetType.Planet,
      end_time: 1,
      loaded_metal: -1,
      loaded_crystal: 1,
      loaded_deuterium: 1,
      returning: false,
      deleted: false,
    };

    const event: Event = SerializationHelper.toInstance(new Event(), JSON.stringify(data));

    assert.equal(event.isValid(), false);
  });

  it("Should fail (loaded_crystal negative )", function() {
    const data = {
      eventID: 1,
      ownerID: 1,
      mission: 1,
      fleetlist: "{}",
      start_id: 1,
      start_type: PlanetType.Planet,
      start_time: 1,
      end_id: 1,
      end_type: PlanetType.Planet,
      end_time: 1,
      loaded_metal: 1,
      loaded_crystal: -1,
      loaded_deuterium: 1,
      returning: false,
      deleted: false,
    };

    const event: Event = SerializationHelper.toInstance(new Event(), JSON.stringify(data));

    assert.equal(event.isValid(), false);
  });

  it("Should fail (loaded_deuterium negative)", function() {
    const data = {
      eventID: 1,
      ownerID: 1,
      mission: 1,
      fleetlist: "{}",
      start_id: 1,
      start_type: PlanetType.Planet,
      start_time: 1,
      end_id: 1,
      end_type: PlanetType.Planet,
      end_time: 1,
      loaded_metal: 1,
      loaded_crystal: 1,
      loaded_deuterium: -1,
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
      start_id: 1,
      start_time: 1,
      end_id: 1,
      end_type: PlanetType.Planet,
      end_time: 1,
      loaded_metal: 1,
      loaded_crystal: 1,
      loaded_deuterium: 1,
      returning: false,
      deleted: false,
    };

    const event: Event = SerializationHelper.toInstance(new Event(), JSON.stringify(data));

    assert.equal(event.isValid(), false);
  });
});
