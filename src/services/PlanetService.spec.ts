import * as chai from "chai";
import { Planet } from "../units/Planet";
import { PlanetService } from "./PlanetService";

const expect = chai.expect;

describe("PlanetService", () => {
  it("should return a planet", async () => {
    const ownerID = 1;
    const planetID = 167546850;

    const result = await this.planetService.getPlanet(ownerID, planetID);

    expect(result.ownerID).to.be.equals(ownerID);
    expect(result.planetID).to.be.equals(planetID);
  });

  it("should update a planet", async () => {
    const planet: Planet = await this.planetService.getPlanet(1, 167546850, true);

    planet.name = "SomethingElse";

    const result = await this.planetService.updatePlanet(planet);

    expect(result).to.be.equals(planet);
  });
});
