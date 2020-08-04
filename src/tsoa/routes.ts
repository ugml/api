/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { Controller, ValidationService, FieldErrors, ValidateError, TsoaRoute, HttpStatusCodeLiteral, TsoaResponse } from 'tsoa';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AuthRouter } from './../routes/AuthRouter';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { BuildingsRouter } from './../routes/BuildingsRouter';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ConfigRouter } from './../routes/ConfigRouter';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { DefenseRouter } from './../routes/DefenseRouter';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { GalaxyRouter } from './../routes/GalaxyRouter';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { MessagesRouter } from './../routes/MessagesRouter';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { PlanetsRouter } from './../routes/PlanetsRouter';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ShipsRouter } from './../routes/ShipsRouter';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { TechsRouter } from './../routes/TechsRouter';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UserRouter } from './../routes/UserRouter';
import { expressAuthentication } from './../middlewares/authentication';
import { iocContainer } from './../ioc/inversify.config';
import * as express from 'express';

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "AuthResponse": {
        "dataType": "refObject",
        "properties": {
            "token": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AuthRequest": {
        "dataType": "refObject",
        "properties": {
            "email": { "dataType": "string", "required": true },
            "password": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "FailureResponse": {
        "dataType": "refObject",
        "properties": {
            "error": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Buildings": {
        "dataType": "refObject",
        "properties": {
            "planetID": { "dataType": "double", "required": true },
            "metalMine": { "dataType": "double", "required": true },
            "crystalMine": { "dataType": "double", "required": true },
            "deuteriumSynthesizer": { "dataType": "double", "required": true },
            "solarPlant": { "dataType": "double", "required": true },
            "fusionReactor": { "dataType": "double", "required": true },
            "roboticFactory": { "dataType": "double", "required": true },
            "naniteFactory": { "dataType": "double", "required": true },
            "shipyard": { "dataType": "double", "required": true },
            "metalStorage": { "dataType": "double", "required": true },
            "crystalStorage": { "dataType": "double", "required": true },
            "deuteriumStorage": { "dataType": "double", "required": true },
            "researchLab": { "dataType": "double", "required": true },
            "terraformer": { "dataType": "double", "required": true },
            "allianceDepot": { "dataType": "double", "required": true },
            "missileSilo": { "dataType": "double", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Globals.PlanetType": {
        "dataType": "refObject",
        "properties": {
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Planet": {
        "dataType": "refObject",
        "properties": {
            "planetID": { "dataType": "double", "required": true },
            "ownerID": { "dataType": "double", "required": true },
            "name": { "dataType": "string", "required": true },
            "posGalaxy": { "dataType": "double", "required": true },
            "posSystem": { "dataType": "double", "required": true },
            "posPlanet": { "dataType": "double", "required": true },
            "lastUpdate": { "dataType": "double", "required": true },
            "planetType": { "ref": "Globals.PlanetType", "required": true },
            "image": { "dataType": "string", "required": true },
            "diameter": { "dataType": "double", "required": true },
            "fieldsCurrent": { "dataType": "double", "required": true },
            "fieldsMax": { "dataType": "double", "required": true },
            "tempMin": { "dataType": "double", "required": true },
            "tempMax": { "dataType": "double", "required": true },
            "metal": { "dataType": "double", "required": true },
            "crystal": { "dataType": "double", "required": true },
            "deuterium": { "dataType": "double", "required": true },
            "energyUsed": { "dataType": "double", "required": true },
            "energyMax": { "dataType": "double", "required": true },
            "metalMinePercent": { "dataType": "double", "required": true },
            "crystalMinePercent": { "dataType": "double", "required": true },
            "deuteriumSynthesizerPercent": { "dataType": "double", "required": true },
            "solarPlantPercent": { "dataType": "double", "required": true },
            "fusionReactorPercent": { "dataType": "double", "required": true },
            "solarSatellitePercent": { "dataType": "double", "required": true },
            "bBuildingId": { "dataType": "double", "required": true },
            "bBuildingEndTime": { "dataType": "double", "required": true },
            "bBuildingDemolition": { "dataType": "boolean", "required": true },
            "bHangarQueue": { "dataType": "string", "required": true },
            "bHangarStartTime": { "dataType": "double", "required": true },
            "bHangarPlus": { "dataType": "boolean", "required": true },
            "destroyed": { "dataType": "boolean", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BuildBuildingRequest": {
        "dataType": "refObject",
        "properties": {
            "planetID": { "dataType": "double", "required": true },
            "buildingID": { "dataType": "double", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CancelBuildingRequest": {
        "dataType": "refObject",
        "properties": {
            "planetID": { "dataType": "double", "required": true },
            "buildingID": { "dataType": "double", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DemolishBuildingRequest": {
        "dataType": "refObject",
        "properties": {
            "planetID": { "dataType": "double", "required": true },
            "buildingID": { "dataType": "double", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IResourceCollection": {
        "dataType": "refObject",
        "properties": {
            "metal": { "dataType": "double", "required": true },
            "crystal": { "dataType": "double", "required": true },
            "deuterium": { "dataType": "double", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IStartPlanet": {
        "dataType": "refObject",
        "properties": {
            "name": { "dataType": "string", "required": true },
            "diameter": { "dataType": "double", "required": true },
            "fields": { "dataType": "double", "required": true },
            "resources": { "ref": "IResourceCollection", "required": true },
            "minPlanetPos": { "dataType": "double", "required": true },
            "maxPlanetPos": { "dataType": "double", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ILimit": {
        "dataType": "refObject",
        "properties": {
            "min": { "dataType": "double", "required": true },
            "max": { "dataType": "double", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ILimits": {
        "dataType": "refObject",
        "properties": {
            "galaxy": { "ref": "ILimit", "required": true },
            "system": { "ref": "ILimit", "required": true },
            "position": { "ref": "ILimit", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IServer": {
        "dataType": "refObject",
        "properties": {
            "speed": { "dataType": "double", "required": true },
            "language": { "dataType": "string", "required": true },
            "startPlanet": { "ref": "IStartPlanet", "required": true },
            "limits": { "ref": "ILimits", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ICosts": {
        "dataType": "refObject",
        "properties": {
            "metal": { "dataType": "double", "required": true },
            "crystal": { "dataType": "double", "required": true },
            "deuterium": { "dataType": "double", "required": true },
            "energy": { "dataType": "double", "required": true },
            "factor": { "dataType": "double", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IRequirement": {
        "dataType": "refObject",
        "properties": {
            "unitID": { "dataType": "double", "required": true },
            "level": { "dataType": "double", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IBuilding": {
        "dataType": "refObject",
        "properties": {
            "unitID": { "dataType": "double", "required": true },
            "costs": { "ref": "ICosts", "required": true },
            "requirements": { "dataType": "array", "array": { "ref": "IRequirement" }, "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ITechnology": {
        "dataType": "refObject",
        "properties": {
            "unitID": { "dataType": "double", "required": true },
            "costs": { "ref": "ICosts", "required": true },
            "requirements": { "dataType": "array", "array": { "ref": "IRequirement" }, "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IStats": {
        "dataType": "refObject",
        "properties": {
            "consumption": { "dataType": "double", "required": true },
            "speed": { "dataType": "double", "required": true },
            "capacity": { "dataType": "double", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IRapidfire": {
        "dataType": "refObject",
        "properties": {
            "unitID": { "dataType": "double", "required": true },
            "amount": { "dataType": "double", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IShip": {
        "dataType": "refObject",
        "properties": {
            "unitID": { "dataType": "double", "required": true },
            "costs": { "ref": "ICosts", "required": true },
            "requirements": { "dataType": "array", "array": { "ref": "IRequirement" }, "required": true },
            "stats": { "ref": "IStats", "required": true },
            "rapidfire": { "dataType": "array", "array": { "ref": "IRapidfire" }, "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IDefense": {
        "dataType": "refObject",
        "properties": {
            "unitID": { "dataType": "double", "required": true },
            "costs": { "ref": "ICosts", "required": true },
            "requirements": { "dataType": "array", "array": { "ref": "IRequirement" }, "required": true },
            "stats": { "ref": "IStats", "required": true },
            "rapidfire": { "dataType": "array", "array": { "ref": "IRapidfire" }, "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IUnits": {
        "dataType": "refObject",
        "properties": {
            "buildings": { "dataType": "array", "array": { "ref": "IBuilding" }, "required": true },
            "technologies": { "dataType": "array", "array": { "ref": "ITechnology" }, "required": true },
            "ships": { "dataType": "array", "array": { "ref": "IShip" }, "required": true },
            "defenses": { "dataType": "array", "array": { "ref": "IDefense" }, "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IGameConfig": {
        "dataType": "refObject",
        "properties": {
            "server": { "ref": "IServer", "required": true },
            "units": { "ref": "IUnits", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Defenses": {
        "dataType": "refObject",
        "properties": {
            "planetID": { "dataType": "double", "required": true },
            "rocketLauncher": { "dataType": "double", "required": true },
            "lightLaser": { "dataType": "double", "required": true },
            "heavyLaser": { "dataType": "double", "required": true },
            "ionCannon": { "dataType": "double", "required": true },
            "gaussCannon": { "dataType": "double", "required": true },
            "plasmaTurret": { "dataType": "double", "required": true },
            "smallShieldDome": { "dataType": "boolean", "required": true },
            "largeShieldDome": { "dataType": "boolean", "required": true },
            "antiBallisticMissile": { "dataType": "double", "required": true },
            "interplanetaryMissile": { "dataType": "double", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BuildOrderItem": {
        "dataType": "refObject",
        "properties": {
            "unitID": { "dataType": "double", "required": true },
            "amount": { "dataType": "double", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BuildDefenseRequest": {
        "dataType": "refObject",
        "properties": {
            "planetID": { "dataType": "double", "required": true },
            "buildOrder": { "dataType": "array", "array": { "ref": "BuildOrderItem" }, "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Message": {
        "dataType": "refObject",
        "properties": {
            "messageID": { "dataType": "double", "required": true },
            "senderID": { "dataType": "double", "required": true },
            "receiverID": { "dataType": "double", "required": true },
            "sendtime": { "dataType": "double", "required": true },
            "type": { "dataType": "double", "required": true },
            "subject": { "dataType": "string", "required": true },
            "body": { "dataType": "string", "required": true },
            "deleted": { "dataType": "boolean", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SendMessageRequest": {
        "dataType": "refObject",
        "properties": {
            "receiverID": { "dataType": "double", "required": true },
            "subject": { "dataType": "string", "required": true },
            "body": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DeleteMessageRequest": {
        "dataType": "refObject",
        "properties": {
            "messageID": { "dataType": "double", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DestroyPlanetRequest": {
        "dataType": "refObject",
        "properties": {
            "planetID": { "dataType": "double", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RenamePlanetRequest": {
        "dataType": "refObject",
        "properties": {
            "planetID": { "dataType": "double", "required": true },
            "newName": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BuildShipsRequest": {
        "dataType": "refObject",
        "properties": {
            "planetID": { "dataType": "double", "required": true },
            "buildOrder": { "dataType": "array", "array": { "ref": "BuildOrderItem" }, "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Techs": {
        "dataType": "refObject",
        "properties": {
            "userID": { "dataType": "double", "required": true },
            "espionageTech": { "dataType": "double", "required": true },
            "computerTech": { "dataType": "double", "required": true },
            "weaponTech": { "dataType": "double", "required": true },
            "armourTech": { "dataType": "double", "required": true },
            "shieldingTech": { "dataType": "double", "required": true },
            "energyTech": { "dataType": "double", "required": true },
            "hyperspaceTech": { "dataType": "double", "required": true },
            "combustionDriveTech": { "dataType": "double", "required": true },
            "impulseDriveTech": { "dataType": "double", "required": true },
            "hyperspaceDriveTech": { "dataType": "double", "required": true },
            "laserTech": { "dataType": "double", "required": true },
            "ionTech": { "dataType": "double", "required": true },
            "plasmaTech": { "dataType": "double", "required": true },
            "intergalacticResearchTech": { "dataType": "double", "required": true },
            "gravitonTech": { "dataType": "double", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CancelTechRequest": {
        "dataType": "refObject",
        "properties": {
            "planetID": { "dataType": "double", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BuildTechRequest": {
        "dataType": "refObject",
        "properties": {
            "planetID": { "dataType": "double", "required": true },
            "techID": { "dataType": "double", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "User": {
        "dataType": "refObject",
        "properties": {
            "userID": { "dataType": "double", "required": true },
            "username": { "dataType": "string", "required": true },
            "password": { "dataType": "string", "required": true },
            "email": { "dataType": "string", "required": true },
            "lastTimeOnline": { "dataType": "double", "required": true },
            "currentPlanet": { "dataType": "double", "required": true },
            "bTechID": { "dataType": "double", "required": true },
            "bTechEndTime": { "dataType": "double", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserInfo": {
        "dataType": "refObject",
        "properties": {
            "userID": { "dataType": "double", "required": true },
            "username": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateUserResponse": {
        "dataType": "refObject",
        "properties": {
            "userID": { "dataType": "double", "required": true },
            "token": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateUserRequest": {
        "dataType": "refObject",
        "properties": {
            "username": { "dataType": "string", "required": true },
            "email": { "dataType": "string", "required": true },
            "password": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateUserRequest": {
        "dataType": "refObject",
        "properties": {
            "username": { "dataType": "string", "required": true },
            "email": { "dataType": "string", "required": true },
            "password": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SetCurrentPlanetRequest": {
        "dataType": "refObject",
        "properties": {
            "planetID": { "dataType": "double", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const validationService = new ValidationService(models);

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

export function RegisterRoutes(app: express.Express) {
    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################
    app.post('/v1/login',
        function(request: any, response: any, next: any) {
            const args = {
                req: { "in": "body", "name": "req", "required": true, "ref": "AuthRequest" },
                successResponse: { "in": "res", "name": "200", "required": true, "ref": "AuthResponse" },
                badRequestResponse: { "in": "res", "name": "400", "required": true, "ref": "FailureResponse" },
                unauthorizedResponse: { "in": "res", "name": "401", "required": true, "ref": "FailureResponse" },
                serverErrorResponse: { "in": "res", "name": "500", "required": true, "ref": "FailureResponse" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<AuthRouter>(AuthRouter);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.authenticate.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/v1/buildings/:planetID',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
                planetID: { "in": "path", "name": "planetID", "required": true, "dataType": "double" },
                successResponse: { "in": "res", "name": "200", "required": true, "ref": "Buildings" },
                badRequestResponse: { "in": "res", "name": "400", "required": true, "ref": "FailureResponse" },
                serverErrorResponse: { "in": "res", "name": "500", "required": true, "ref": "FailureResponse" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<BuildingsRouter>(BuildingsRouter);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.getAllBuildingsOnPlanet.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/v1/buildings/build',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                headers: { "in": "request", "name": "headers", "required": true, "dataType": "object" },
                request: { "in": "body", "name": "request", "required": true, "ref": "BuildBuildingRequest" },
                successResponse: { "in": "res", "name": "200", "required": true, "ref": "Buildings" },
                badRequestResponse: { "in": "res", "name": "400", "required": true, "ref": "FailureResponse" },
                serverErrorResponse: { "in": "res", "name": "500", "required": true, "ref": "FailureResponse" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<BuildingsRouter>(BuildingsRouter);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.startBuilding.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/v1/buildings/cancel',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                headers: { "in": "request", "name": "headers", "required": true, "dataType": "object" },
                request: { "in": "body", "name": "request", "required": true, "ref": "CancelBuildingRequest" },
                successResponse: { "in": "res", "name": "200", "required": true, "ref": "Buildings" },
                badRequestResponse: { "in": "res", "name": "400", "required": true, "ref": "FailureResponse" },
                serverErrorResponse: { "in": "res", "name": "500", "required": true, "ref": "FailureResponse" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<BuildingsRouter>(BuildingsRouter);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.cancelBuilding.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/v1/buildings/demolish',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                headers: { "in": "request", "name": "headers", "required": true, "dataType": "object" },
                request: { "in": "body", "name": "request", "required": true, "ref": "DemolishBuildingRequest" },
                successResponse: { "in": "res", "name": "200", "required": true, "ref": "Buildings" },
                badRequestResponse: { "in": "res", "name": "400", "required": true, "ref": "FailureResponse" },
                serverErrorResponse: { "in": "res", "name": "500", "required": true, "ref": "FailureResponse" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<BuildingsRouter>(BuildingsRouter);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.demolishBuilding.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/v1/config/game',
        function(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<ConfigRouter>(ConfigRouter);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.getGameConfig.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/v1/config/units',
        function(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<ConfigRouter>(ConfigRouter);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.getUnitsConfig.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/v1/defenses/:planetID',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                headers: { "in": "request", "name": "headers", "required": true, "dataType": "object" },
                planetID: { "in": "path", "name": "planetID", "required": true, "dataType": "double" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<DefenseRouter>(DefenseRouter);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.getAllDefensesOnPlanet.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/v1/defenses/build',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                headers: { "in": "request", "name": "headers", "required": true, "dataType": "object" },
                request: { "in": "body", "name": "request", "required": true, "ref": "BuildDefenseRequest" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<DefenseRouter>(DefenseRouter);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.buildDefense.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/v1/galaxy/:posGalaxy/:posSystem',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                posGalaxy: { "in": "path", "name": "posGalaxy", "required": true, "dataType": "double" },
                posSystem: { "in": "path", "name": "posSystem", "required": true, "dataType": "double" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<GalaxyRouter>(GalaxyRouter);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.getGalaxyInformation.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/v1/messages/:messageID',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                headers: { "in": "request", "name": "headers", "required": true, "dataType": "object" },
                messageID: { "in": "path", "name": "messageID", "required": true, "dataType": "double" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<MessagesRouter>(MessagesRouter);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.getMessageByID.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/v1/messages/send',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                headers: { "in": "request", "name": "headers", "required": true, "dataType": "object" },
                request: { "in": "body", "name": "request", "required": true, "ref": "SendMessageRequest" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<MessagesRouter>(MessagesRouter);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.sendMessage.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/v1/messages/delete',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                headers: { "in": "request", "name": "headers", "required": true, "dataType": "object" },
                request: { "in": "body", "name": "request", "required": true, "ref": "DeleteMessageRequest" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<MessagesRouter>(MessagesRouter);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.deleteMessage.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/v1/planets/planetList',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                headers: { "in": "request", "name": "headers", "required": true, "dataType": "object" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<PlanetsRouter>(PlanetsRouter);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.getAllPlanets.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/v1/planets/planetList/:userID',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                userID: { "in": "path", "name": "userID", "required": true, "dataType": "double" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<PlanetsRouter>(PlanetsRouter);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.getAllPlanetsOfUser.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/v1/planets/movement/:planetID',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                headers: { "in": "request", "name": "headers", "required": true, "dataType": "object" },
                planetID: { "in": "path", "name": "planetID", "required": true, "dataType": "double" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<PlanetsRouter>(PlanetsRouter);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.getMovement.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/v1/planets/destroy',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                headers: { "in": "request", "name": "headers", "required": true, "dataType": "object" },
                request: { "in": "body", "name": "request", "required": true, "ref": "DestroyPlanetRequest" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<PlanetsRouter>(PlanetsRouter);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.destroyPlanet.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/v1/planets/rename',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                headers: { "in": "request", "name": "headers", "required": true, "dataType": "object" },
                request: { "in": "body", "name": "request", "required": true, "ref": "RenamePlanetRequest" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<PlanetsRouter>(PlanetsRouter);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.renamePlanet.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/v1/planets/:planetID',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                headers: { "in": "request", "name": "headers", "required": true, "dataType": "object" },
                planetID: { "in": "path", "name": "planetID", "required": true, "dataType": "double" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<PlanetsRouter>(PlanetsRouter);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.getPlanetByID.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/v1/ships/:planetID',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
                planetID: { "in": "path", "name": "planetID", "required": true, "dataType": "double" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<ShipsRouter>(ShipsRouter);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.getAllShipsOnPlanet.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/v1/ships/build',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                headers: { "in": "request", "name": "headers", "required": true, "dataType": "object" },
                request: { "in": "body", "name": "request", "required": true, "ref": "BuildShipsRequest" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<ShipsRouter>(ShipsRouter);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.buildShips.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/v1/technologies',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                headers: { "in": "request", "name": "headers", "required": true, "dataType": "object" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<TechsRouter>(TechsRouter);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.getTechs.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/v1/technologies/cancel',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                headers: { "in": "request", "name": "headers", "required": true, "dataType": "object" },
                request: { "in": "body", "name": "request", "required": true, "ref": "CancelTechRequest" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<TechsRouter>(TechsRouter);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.cancelTech.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/v1/technologies/build',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                headers: { "in": "request", "name": "headers", "required": true, "dataType": "object" },
                request: { "in": "body", "name": "request", "required": true, "ref": "BuildTechRequest" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<TechsRouter>(TechsRouter);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.buildTech.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/v1/user',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<UserRouter>(UserRouter);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.getUserSelf.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/v1/user/:userID',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                userID: { "in": "path", "name": "userID", "required": true, "dataType": "double" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<UserRouter>(UserRouter);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.getUserByID.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/v1/user/create',
        function(request: any, response: any, next: any) {
            const args = {
                request: { "in": "body", "name": "request", "required": true, "ref": "CreateUserRequest" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<UserRouter>(UserRouter);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.createUser.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/v1/user/update',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
                requestModel: { "in": "body", "name": "requestModel", "required": true, "ref": "UpdateUserRequest" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<UserRouter>(UserRouter);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.updateUser.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/v1/user/currentplanet/set',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
                model: { "in": "body", "name": "model", "required": true, "ref": "SetCurrentPlanetRequest" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);
            } catch (err) {
                return next(err);
            }

            const controller: any = iocContainer.get<UserRouter>(UserRouter);
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }


            const promise = controller.setCurrentPlanet.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
        return (request: any, _response: any, next: any) => {
            let responded = 0;
            let success = false;

            const succeed = function(user: any) {
                if (!success) {
                    success = true;
                    responded++;
                    request['user'] = user;
                    next();
                }
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            const fail = function(error: any) {
                responded++;
                if (responded == security.length && !success) {
                    error.status = error.status || 401;
                    next(error)
                }
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            for (const secMethod of security) {
                if (Object.keys(secMethod).length > 1) {
                    let promises: Promise<any>[] = [];

                    for (const name in secMethod) {
                        promises.push(expressAuthentication(request, name, secMethod[name]));
                    }

                    Promise.all(promises)
                        .then((users) => { succeed(users[0]); })
                        .catch(fail);
                } else {
                    for (const name in secMethod) {
                        expressAuthentication(request, name, secMethod[name])
                            .then(succeed)
                            .catch(fail);
                    }
                }
            }
        }
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function isController(object: any): object is Controller {
        return 'getHeaders' in object && 'getStatus' in object && 'setStatus' in object;
    }

    function promiseHandler(controllerObj: any, promise: any, response: any, next: any) {
        return Promise.resolve(promise)
            .then((data: any) => {
                let statusCode;
                let headers;
                if (isController(controllerObj)) {
                    headers = controllerObj.getHeaders();
                    statusCode = controllerObj.getStatus();
                }

                // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

                returnHandler(response, statusCode, data, headers)
            })
            .catch((error: any) => next(error));
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function returnHandler(response: any, statusCode?: number, data?: any, headers: any = {}) {
        Object.keys(headers).forEach((name: string) => {
            response.set(name, headers[name]);
        });
        if (data && typeof data.pipe === 'function' && data.readable && typeof data._read === 'function') {
            data.pipe(response);
        } else if (data || data === false) { // === false allows boolean result
            response.status(statusCode || 200).json(data);
        } else {
            response.status(statusCode || 204).end();
        }
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function responder(response: any): TsoaResponse<HttpStatusCodeLiteral, unknown> {
        return function(status, data, headers) {
            returnHandler(response, status, data, headers);
        };
    };

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function getValidatedArgs(args: any, request: any, response: any): any[] {
        const fieldErrors: FieldErrors = {};
        const values = Object.keys(args).map((key) => {
            const name = args[key].name;
            switch (args[key].in) {
                case 'request':
                    return request;
                case 'query':
                    return validationService.ValidateParam(args[key], request.query[name], name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'path':
                    return validationService.ValidateParam(args[key], request.params[name], name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'header':
                    return validationService.ValidateParam(args[key], request.header(name), name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'body':
                    return validationService.ValidateParam(args[key], request.body, name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'body-prop':
                    return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, 'body.', { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'res':
                    return responder(response);
            }
        });

        if (Object.keys(fieldErrors).length > 0) {
            throw new ValidateError(fieldErrors, '');
        }
        return values;
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
