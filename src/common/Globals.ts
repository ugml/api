
class Globals {
    static MIN_BUILDING_ID : number = 1;
    static MAX_BUILDING_ID : number = 15;

    static MIN_DEFENSE_ID : number = 301;
    static MAX_DEFENSE_ID : number = 310;

    static MIN_TECH_ID : number = 101;
    static MAX_TECH_ID : number = 115;

    static MIN_SHIP_ID : number = 201;
    static MAX_SHIP_ID : number = 214;




}

module Globals
{
    export enum Buildings
    {
        METAL_MINE = 1,
        CRYSTAL_MINE = 2,
        DEUTERIUM_SYNTHESIZER = 3,
        SOLAR_PLANT = 4,
        FUSION_REACTOR = 5,
        ROBOTIC_FACTORY = 6,
        NANITE_FACTORY = 7,
        SHIPYARD = 8,
        METAL_STORAGE = 9,
        CRYSTAL_STORAGE = 10,
        DEUTERIUM_STORAGE = 11,
        RESEARCH_LAB = 12,
        TERRAFORMER = 13,
        ALLIANCE_DEPOT = 14,
        MISSILE_SILO = 15
    }

    // 4xx - authentication failure
    // 5xx - server errors

    export enum Statuscode {
        SUCCESS = 200,
        CREATED = 201,
        BAD_REQUEST = 400,
        NOT_AUTHORIZED = 401,
        NOT_FOUND = 404,
        SERVER_ERROR = 500
    }
}

export { Globals }