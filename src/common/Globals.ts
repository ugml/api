
class Globals {
    static MIN_BUILDING_ID : number = 1;
    static MAX_BUILDING_ID : number = 15;




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
}

export { Globals }