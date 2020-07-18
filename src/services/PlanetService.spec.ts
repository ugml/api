import * as chai from "chai";
import Planet from "../units/Planet";
import { iocContainer } from "../ioc/inversify.config";
import IPlanetService from "../interfaces/services/IPlanetService";
import TYPES from "../ioc/types";

const expect = chai.expect;

const planetService = iocContainer.get<IPlanetService>(TYPES.IPlanetService);

describe("PlanetService", () => {
  it("should return a planet", async () => {
    const ownerID = 1;
    const planetID = 167546850;

    const result = await planetService.getPlanet(ownerID, planetID);

    expect(result.ownerID).to.be.equals(ownerID);
    expect(result.planetID).to.be.equals(planetID);
  });

  it("should update a planet", async () => {
    const planet: Planet = await planetService.getPlanet(1, 167546850, true);

    planet.name = "SomethingElse";

    const result = await planetService.updatePlanet(planet);

    expect(result).to.be.equals(planet);
  });
});
