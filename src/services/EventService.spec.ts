import * as chai from "chai";
import { Globals } from "../common/Globals";
import ICoordinates from "../interfaces/ICoordinates";
import PlanetType = Globals.PlanetType;

const expect = chai.expect;

const createContainer = require("../ioc/createContainer");

const container = createContainer();

describe("EventService", () => {
  it("should return a planet", async () => {
    const ownerID = 1;
    const position: ICoordinates = {
      galaxy: 9,
      system: 54,
      planet: 1,
      type: PlanetType.Planet,
    };

    const result = await container.eventService.getPlanetPosition(ownerID, position);
  });
});
