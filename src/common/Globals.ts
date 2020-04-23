/**
 * This class holds all global variables
 */
class Globals {
  public static MIN_BUILDING_ID = 1;
  public static MAX_BUILDING_ID = 15;

  public static MIN_DEFENSE_ID = 301;
  public static MAX_DEFENSE_ID = 310;

  public static MIN_TECHNOLOGY_ID = 101;
  public static MAX_TECHNOLOGY_ID = 115;

  public static MIN_SHIP_ID = 201;
  public static MAX_SHIP_ID = 214;
}

namespace Globals {
  export enum Buildings {
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
    MISSILE_SILO = 15,
  }

  // 4xx - authentication failure
  // 5xx - server errors

  export enum Statuscode {
    SUCCESS = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    NOT_AUTHORIZED = 401,
    NOT_FOUND = 404,
    SERVER_ERROR = 500,
  }

  export enum PlanetType {
    PLANET = 1,
    MOON = 2,
    DEBRIS = 3,
  }

  export enum UnitType {
    BUILDING,
    SHIP,
    DEFENSE,
    TECHNOLOGY,
  }

  export enum UnitNames {
    metalMine = 1,
    crystalMine = 2,
    deuteriumSynthesizer = 3,
    solarPlant = 4,
    fusionReactor = 5,
    roboticFactory = 6,
    naniteFactory = 7,
    shipyard = 8,
    metalStorage = 9,
    crystalStorage = 10,
    deuteriumStorage = 11,
    researchLab = 12,
    terraformer = 13,
    allianceDepot = 14,
    missileSilo = 15,
    espionageTech = 101,
    computerTech = 102,
    weaponTech = 103,
    armourTech = 104,
    shieldingTech = 105,
    energyTech = 106,
    hyperspaceTech = 107,
    combustionDriveTech = 108,
    impulseDriveTech = 109,
    hyperspaceDriveTech = 110,
    laserTech = 111,
    ionTech = 112,
    plasmaTech = 113,
    intergalacticResearchTech = 114,
    gravitonTech = 115,
    smallCargoShip = 201,
    largeCargoShip = 202,
    lightFighter = 203,
    heavyFighter = 204,
    cruiser = 205,
    battleship = 206,
    colonyShip = 207,
    recycler = 208,
    espionageProbe = 209,
    bomber = 210,
    solarSatellite = 211,
    destroyer = 212,
    battlecruiser = 213,
    deathstar = 214,
    rocketLauncher = 301,
    lightLaser = 302,
    heavyLaser = 303,
    gaussCannon = 304,
    ionCannon = 305,
    plasmaTurret = 306,
    smallShieldDome = 307,
    largeShieldDome = 308,
    antiBallisticMissile = 309,
    interplanetaryMissile = 310,
  }
}

export { Globals };
