import * as chai from "chai";
import Planet from "../units/Planet";

const expect = chai.expect;

// eslint-disable-next-line @typescript-eslint/no-var-requires
const createContainer = require("../ioc/createContainer");

const container = createContainer();

describe("PlanetService", () => {
  it("should return a planet", async () => {
    const ownerID = 1;
    const planetID = 167546850;

    const result = await container.planetService.getPlanet(ownerID, planetID);

    expect(result.ownerID).to.be.equals(ownerID);
    expect(result.planetID).to.be.equals(planetID);
  });

  it("should update a planet", async () => {
    const planet: Planet = await container.planetService.getPlanet(1, 167546850, true);

    planet.name = "SomethingElse";

    const result = await container.planetService.updatePlanet(planet);

    expect(result).to.be.equals(planet);
  });
});
