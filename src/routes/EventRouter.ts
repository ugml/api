import { Globals } from "../common/Globals";

import IEventService from "../interfaces/services/IEventService";
import IPlanetService from "../interfaces/services/IPlanetService";
import Event from "../units/Event";

import { Body, Post, Request, Res, Route, Security, Tags, TsoaResponse } from "tsoa";
import { provide } from "inversify-binding-decorators";
import { inject } from "inversify";
import TYPES from "../ioc/types";
import IErrorHandler from "../interfaces/IErrorHandler";

import FailureResponse from "../entities/responses/FailureResponse";

// TODO: validate input data:
//  is start != end?
//  is missionSpeed % 10 = 0 and 0 <= missionSpeed <= 100 (should already be handled by schema)
//  units.json => check all values (capacity, etc).
//  loaded resources > storage?

@Route("event")
@Tags("Events")
// eslint-disable-next-line @typescript-eslint/no-use-before-define
@provide(EventRouter)
export default class EventRouter {
  @inject(TYPES.IErrorHandler) private errorHandler: IErrorHandler;

  @inject(TYPES.IPlanetService) private planetService: IPlanetService;
  @inject(TYPES.IEventService) private eventService: IEventService;

  @Post("/create")
  @Security("jwt")
  public async createEvent(
    @Request() headers,
    @Body() request: Event,
    @Res() successResponse: TsoaResponse<Globals.StatusCodes.SUCCESS, Event>,
    @Res() badRequestResponse: TsoaResponse<Globals.StatusCodes.BAD_REQUEST, FailureResponse>,
    @Res() unauthorizedResponse: TsoaResponse<Globals.StatusCodes.NOT_AUTHORIZED, FailureResponse>,
    @Res() serverErrorResponse: TsoaResponse<Globals.StatusCodes.SERVER_ERROR, FailureResponse>,
  ): Promise<Event> {
    try {
      return await this.eventService.create(request);
    } catch (error) {
      return this.errorHandler.handle(error, badRequestResponse, unauthorizedResponse, serverErrorResponse);
    }

    // try {
    //   // TODO: check if enough ships on planet
    //   // TODO: check if planet has enough deuterium
    //
    //   if (!InputValidator.isSet(request.body.event)) {
    //     return response.status(Globals.StatusCodes.BAD_REQUEST).json({
    //       error: "Invalid parameter",
    //     });
    //   }
    //
    //   const eventData = JSON.parse(request.body.event);
    //
    //   // validate JSON against schema
    //   if (!jsonValidator.validate(eventData, eventSchema).valid) {
    //     return response.status(Globals.StatusCodes.BAD_REQUEST).json({
    //       error: "Invalid json",
    //     });
    //   }
    //
    //   const userID = parseInt(request.userID, 10);
    //   const ownerID = parseInt(eventData.ownerID, 10);
    //
    //   // check if sender of event == currently authenticated user
    //   if (userID !== ownerID) {
    //     return response.status(Globals.StatusCodes.BAD_REQUEST).json({
    //       error: "Event-creator is not currently authenticated user",
    //     });
    //   }
    //
    //   // TODO: temporary
    //   if (["deploy", "acs", "hold", "harvest", "espionage", "destroy"].indexOf(eventData.mission) >= 0) {
    //     return response.status(Globals.StatusCodes.BAD_REQUEST).json({
    //       error: "Missiontype not yet supported",
    //     });
    //   }
    //
    //   const positionOrigin: ICoordinates = {
    //     posGalaxy: eventData.data.origin.posGalaxy,
    //     posSystem: eventData.data.origin.posSystem,
    //     posPlanet: eventData.data.origin.posPlanet,
    //     type: this.getDestinationTypeByName(eventData.data.origin.type),
    //   };
    //
    //   const positionDestination: ICoordinates = {
    //     posGalaxy: eventData.data.destination.posGalaxy,
    //     posSystem: eventData.data.destination.posSystem,
    //     posPlanet: eventData.data.destination.posPlanet,
    //     type: this.getDestinationTypeByName(eventData.data.destination.type),
    //   };
    //
    //   const startPlanet = await this.planetService.getPlanetOrMoonAtPosition(positionOrigin);
    //   const destinationPlanet = await this.planetService.getPlanetOrMoonAtPosition(positionDestination);
    //
    //   if (!InputValidator.isSet(startPlanet) || startPlanet.ownerID !== userID) {
    //     return response.status(Globals.StatusCodes.BAD_REQUEST).json({
    //       error: "Origin does not exist or user is not the owner",
    //     });
    //   }
    //
    //   // destination does not exist
    //   if (!InputValidator.isSet(destinationPlanet) && eventData.mission !== "colonize") {
    //     return response.status(Globals.StatusCodes.BAD_REQUEST).json({
    //       error: "Destination does not exist",
    //     });
    //   }
    //
    //   const distance = Calculations.calculateDistance(eventData.data.origin, eventData.data.destination);
    //
    //   const gameConfig = Config.getGameConfig();
    //
    //   const slowestShipSpeed = Calculations.getSlowestShipSpeed(eventData.data.ships);
    //
    //   // calculate duration of flight
    //   const timeOfFlight = Calculations.calculateTimeOfFlight(
    //     gameConfig.server.speed,
    //     eventData.speed,
    //     distance,
    //     slowestShipSpeed,
    //   );
    //
    //   const event: Event = new Event();
    //
    //   event.eventID = 0;
    //   event.ownerID = eventData.ownerID;
    //   event.mission = this.getMissionTypeID(eventData.mission);
    //   event.fleetlist = JSON.stringify(eventData.data.ships);
    //   event.startID = startPlanet.planetID;
    //   event.startType = this.getDestinationTypeByName(eventData.data.origin.type);
    //   event.startTime = Math.round(+new Date() / 1000);
    //   event.endID = destinationPlanet.planetID;
    //   event.endType = this.getDestinationTypeByName(eventData.data.destination.type);
    //   event.endTime = Math.round(event.startTime + timeOfFlight);
    //   event.loadedMetal = eventData.data.loadedRessources.metal;
    //   event.loadedCrystal = eventData.data.loadedRessources.crystal;
    //   event.loadedDeuterium = eventData.data.loadedRessources.deuterium;
    //   event.inQueue = false;
    //   event.returning = false;
    //   event.processed = false;
    //
    //   await this.eventService.createNewEvent(event);
    //
    //   // all done
    //   return response.status(Globals.StatusCodes.SUCCESS).json(event ?? {});
    // } catch (error) {
    //   this.logger.error(error, error.stack);
    //
    //   return response.status(Globals.StatusCodes.SERVER_ERROR).json({
    //     error: "There was an error while handling the request.",
    //   });
    // }
  }

  @Post("/cancel")
  @Security("jwt")
  public async cancelEvent(
    @Request() headers,
    @Body() request: Event,
    @Res() successResponse: TsoaResponse<Globals.StatusCodes.SUCCESS, Event>,
    @Res() badRequestResponse: TsoaResponse<Globals.StatusCodes.BAD_REQUEST, FailureResponse>,
    @Res() unauthorizedResponse: TsoaResponse<Globals.StatusCodes.NOT_AUTHORIZED, FailureResponse>,
    @Res() serverErrorResponse: TsoaResponse<Globals.StatusCodes.SERVER_ERROR, FailureResponse>,
  ): Promise<Event> {
    try {
      return await this.eventService.cancel(request);
    } catch (error) {
      return this.errorHandler.handle(error, badRequestResponse, unauthorizedResponse, serverErrorResponse);
    }
    // try {
    //   if (!InputValidator.isSet(request.body.eventID) || !InputValidator.isValidInt(request.body.eventID)) {
    //     return response.status(Globals.StatusCodes.BAD_REQUEST).json({
    //       error: "Invalid parameter",
    //     });
    //   }
    //
    //   const userID = parseInt(request.userID, 10);
    //   const eventID = parseInt(request.body.eventID, 10);
    //
    //   const event: Event = await this.eventService.getEventOfPlayer(userID, eventID);
    //
    //   if (!InputValidator.isSet(event) || event.returning === true || event.inQueue === true) {
    //     return response.status(Globals.StatusCodes.BAD_REQUEST).json({
    //       error: "The event does not exist or can't be canceled",
    //     });
    //   }
    //
    //   // (time passed from start until cancel) + (time now)
    //   event.endTime = Math.round(+new Date() / 1000) - event.startTime + Math.round(+new Date() / 1000);
    //   event.startTime = Math.round(+new Date() / 1000);
    //
    //   await this.eventService.cancelEvent(event);
    //
    //   // all done
    //   return response.status(Globals.StatusCodes.SUCCESS).json({});
    // } catch (error) {
    //   this.logger.error(error, error.stack);
    //
    //   return response.status(Globals.StatusCodes.SERVER_ERROR).json({
    //     error: "There was an error while handling the request.",
    //   });
    // }
  }

  private getDestinationTypeByName(type: string): number {
    let typeID: number;
    switch (type) {
      case "planet":
        typeID = 1;
        break;
      case "moon":
        typeID = 2;
        break;
      case "debris":
        typeID = 3;
    }

    return typeID;
  }

  private getMissionTypeID(mission: string): number {
    let missionTypeID: number;
    switch (mission) {
      case "transport":
        missionTypeID = 0;
        break;
      case "deploy":
        missionTypeID = 1;
        break;
      case "attack":
        missionTypeID = 2;
        break;
      case "acs":
        missionTypeID = 3;
        break;
      case "hold":
        missionTypeID = 4;
        break;
      case "colonize":
        missionTypeID = 5;
        break;
      case "harvest":
        missionTypeID = 6;
        break;
      case "espionage":
        missionTypeID = 7;
        break;
      case "destroy":
        missionTypeID = 8;
    }

    return missionTypeID;
  }
}
