import * as chai from "chai";
import Planet from "../units/Planet";
import { iocContainer } from "../ioc/inversify.config";
import TYPES from "../ioc/types";
import IPlanetRepository from "../interfaces/repositories/IPlanetRepository";

const expect = chai.expect;

const planetRepository = iocContainer.get<IPlanetRepository>(TYPES.IPlanetRepository);

describe("PlanetService", () => {
  it("should return a planet", async () => {
    const ownerID = 1;
    const planetID = 167546850;

    const result = await planetRepository.getById(planetID);

    expect(result.ownerID).to.be.equals(ownerID);
    expect(result.planetID).to.be.equals(planetID);
  });

  it("should update a planet", async () => {
    const planet: Planet = await planetRepository.getById(167546850);

    planet.name = "SomethingElse";

    const result = await planetRepository.save(planet);

    expect(result).to.be.equals(planet);
  });
});
