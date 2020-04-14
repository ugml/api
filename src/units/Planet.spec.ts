import * as chai from "chai";
import { Globals } from "../common/Globals";
import SerializationHelper from "../common/SerializationHelper";
import Planet from "./Planet";

const assert = chai.assert;

describe("Planet-units", function() {
  it("planet should be valid", function() {
    const data = {
      planetID: 1,
      ownerID: 1,
      name: "Testplanet",
      posGalaxy: 1,
      posSystem: 1,
      posPlanet: 1,
      lastUpdate: 1,
      planetType: Globals.PlanetType.Planet,
      image: "Test",
      diameter: 1,
      fieldsCurrent: 1,
      fieldsMax: 1,
      tempMin: 1,
      tempMax: 2,
      metal: 1,
      crystal: 1,
      deuterium: 1,
      energyUsed: 1,
      energyMax: 1,
      metalMinePercent: 10,
      crystalMinePercent: 10,
      deuteriumSynthesizerPercent: 10,
      solarPlantPercent: 10,
      fusionReactorPercent: 10,
      solarSatellitePercent: 10,
      bBuildingId: 1,
      bBuildingEndTime: 1,
      bTechID: 1,
      bTechEndTime: 1,
      bHangarQueue: "Test",
      bHangarStartTime: 1,
      bHangarPlus: false,
      destroyed: false,
    };

    const planet: Planet = SerializationHelper.toInstance(new Planet(), JSON.stringify(data));

    assert.equal(planet.isValid(), true);
  });

  it("Should fail (negative value)", function() {
    const data = {
      planetID: 1,
      ownerID: 1,
      name: "Testplanet",
      posGalaxy: 1,
      posSystem: 1,
      posPlanet: 1,
      lastUpdate: 1,
      planetType: Globals.PlanetType.Planet,
      image: "Test",
      diameter: 1,
      fieldsCurrent: 1,
      fieldsMax: 1,
      tempMin: 1,
      tempMax: 2,
      metal: -1,
      crystal: 1,
      deuterium: 1,
      energyUsed: 1,
      energyMax: 1,
      metalMinePercent: 10,
      crystalMinePercent: 10,
      deuteriumSynthesizerPercent: 10,
      solarPlantPercent: 10,
      fusionReactorPercent: 10,
      solarSatellitePercent: 10,
      bBuildingId: 1,
      bBuildingEndTime: 1,
      bTechID: 1,
      bTechEndTime: 1,
      bHangarQueue: "Test",
      bHangarStartTime: 1,
      bHangarPlus: false,
      destroyed: false,
    };

    const planet: Planet = SerializationHelper.toInstance(new Planet(), JSON.stringify(data));

    assert.equal(planet.isValid(), false);
  });

  it("Should fail (missing value)", function() {
    const data = {
      planetID: 1,
      ownerID: 1,
      name: "Testplanet",
      posGalaxy: 1,
      posSystem: 1,
      posPlanet: 1,
      lastUpdate: 1,
      planetType: Globals.PlanetType.Planet,
      image: "Test",
      diameter: 1,
      fieldsCurrent: 1,
      fieldsMax: 1,
      tempMin: 1,
      metal: 1,
      crystal: 1,
      deuterium: 1,
      energyUsed: 1,
      energyMax: 1,
      metalMinePercent: 10,
      crystalMinePercent: 10,
      deuteriumSynthesizerPercent: 10,
      solarPlantPercent: 10,
      fusionReactorPercent: 10,
      solarSatellitePercent: 10,
      bBuildingId: 1,
      bBuildingEndTime: 1,
      bTechID: 1,
      bTechEndTime: 1,
      bHangarQueue: "Test",
      bHangarStartTime: 1,
      bHangarPlus: false,
      destroyed: false,
    };

    const planet: Planet = SerializationHelper.toInstance(new Planet(), JSON.stringify(data));

    assert.equal(planet.isValid(), false);
  });
});
