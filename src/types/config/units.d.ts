interface IRootObject {
    speed?: number;
    units?: IUnits;
    requirements?: IRequirements;
    mappings?: IMappings;
}
interface IUnits {
    buildings: IBuildings;
    ships: IShips;
    defenses: IDefenses;
    technologies: ITechnologies;
}
interface IBuildings {
    1: I1;
    2: I2;
    3: I3;
    4: I4;
    5: I5;
    6: I6;
    7: I7;
    8: I8;
    9: I9;
    10: I10;
    11: I11;
    12: I12;
    13: I13;
    14: I14;
    15: I15;
}
interface I1 {
    metal: number;
    crystal: number;
    deuterium: number;
    energy: number;
    factor: number;
}
interface I2 {
    metal: number;
    crystal: number;
    deuterium: number;
    energy: number;
    factor: number;
}
interface I3 {
    metal: number;
    crystal: number;
    deuterium: number;
    energy: number;
    factor: number;
}
interface I4 {
    metal: number;
    crystal: number;
    deuterium: number;
    energy: number;
    factor: number;
}
interface I5 {
    metal?: number;
    crystal?: number;
    deuterium?: number;
    energy?: number;
    factor?: number;
    3?: number;
    106?: number;
}
interface I6 {
    metal: number;
    crystal: number;
    deuterium: number;
    energy: number;
    factor: number;
}
interface I7 {
    metal?: number;
    crystal?: number;
    deuterium?: number;
    energy?: number;
    factor?: number;
    6?: number;
    102?: number;
}
interface I8 {
    metal?: number;
    crystal?: number;
    deuterium?: number;
    energy?: number;
    factor?: number;
    6?: number;
}
interface I9 {
    metal: number;
    crystal: number;
    deuterium: number;
    energy: number;
    factor: number;
}
interface I10 {
    metal: number;
    crystal: number;
    deuterium: number;
    energy: number;
    factor: number;
}
interface I11 {
    metal: number;
    crystal: number;
    deuterium: number;
    energy: number;
    factor: number;
}
interface I12 {
    metal: number;
    crystal: number;
    deuterium: number;
    energy: number;
    factor: number;
}
interface I13 {
    metal?: number;
    crystal?: number;
    deuterium?: number;
    energy?: number;
    factor?: number;
    7?: number;
    106?: number;
}
interface I14 {
    metal: number;
    crystal: number;
    deuterium: number;
    energy: number;
    factor: number;
}
interface I15 {
    metal: number;
    crystal: number;
    deuterium: number;
    energy: number;
    factor: number;
}
interface IShips {
    201: I201;
    202: I202;
    203: I203;
    204: I204;
    205: I205;
    206: I206;
    207: I207;
    208: I208;
    209: I209;
    210: I210;
    211: I211;
    212: I212;
    213: I213;
    214: I214;
}
interface I201 {
    metal?: number;
    crystal?: number;
    deuterium?: number;
    energy?: number;
    factor?: number;
    consumption?: number;
    speed?: number;
    capacity?: number;
    rapidfire?: IRapidfire;
    8?: number;
    108?: number;
}
interface IRapidfire {
    209?: number;
    211?: number;
    201?: number;
    203?: number;
    301?: number;
    302?: number;
    303?: number;
    305?: number;
    215?: number;
    202?: number;
    204?: number;
    205?: number;
    206?: number;
    207?: number;
    208?: number;
    304?: number;
}
interface I202 {
    metal?: number;
    crystal?: number;
    deuterium?: number;
    energy?: number;
    factor?: number;
    consumption?: number;
    speed?: number;
    capacity?: number;
    rapidfire?: IRapidfire;
    8?: number;
    108?: number;
}
interface I203 {
    metal?: number;
    crystal?: number;
    deuterium?: number;
    energy?: number;
    factor?: number;
    consumption?: number;
    speed?: number;
    capacity?: number;
    rapidfire?: IRapidfire;
    8?: number;
    108?: number;
}
interface I204 {
    metal?: number;
    crystal?: number;
    deuterium?: number;
    energy?: number;
    factor?: number;
    consumption?: number;
    speed?: number;
    capacity?: number;
    rapidfire?: IRapidfire;
    8?: number;
    104?: number;
    109?: number;
}
interface I205 {
    metal?: number;
    crystal?: number;
    deuterium?: number;
    energy?: number;
    factor?: number;
    consumption?: number;
    speed?: number;
    capacity?: number;
    rapidfire?: IRapidfire;
    8?: number;
    109?: number;
    112?: number;
}
interface I206 {
    metal?: number;
    crystal?: number;
    deuterium?: number;
    energy?: number;
    factor?: number;
    consumption?: number;
    speed?: number;
    capacity?: number;
    rapidfire?: IRapidfire;
    8?: number;
    110?: number;
}
interface I207 {
    metal?: number;
    crystal?: number;
    deuterium?: number;
    energy?: number;
    factor?: number;
    rapidfire?: IRapidfire;
    8?: number;
    109?: number;
}
interface I208 {
    metal?: number;
    crystal?: number;
    deuterium?: number;
    energy?: number;
    factor?: number;
    consumption?: number;
    speed?: number;
    capacity?: number;
    rapidfire?: IRapidfire;
    8?: number;
    105?: number;
    108?: number;
}
interface I209 {
    metal?: number;
    crystal?: number;
    deuterium?: number;
    energy?: number;
    factor?: number;
    consumption?: number;
    speed?: number;
    capacity?: number;
    rapidfire?: IRapidfire;
    8?: number;
    101?: number;
    108?: number;
}
interface I210 {
    metal?: number;
    crystal?: number;
    deuterium?: number;
    energy?: number;
    factor?: number;
    consumption?: number;
    speed?: number;
    capacity?: number;
    rapidfire?: IRapidfire;
    8?: number;
    109?: number;
    113?: number;
}
interface I211 {
    metal?: number;
    crystal?: number;
    deuterium?: number;
    energy?: number;
    factor?: number;
    rapidfire?: IRapidfire;
    8?: number;
}
interface I212 {
    metal?: number;
    crystal?: number;
    deuterium?: number;
    energy?: number;
    factor?: number;
    consumption?: number;
    speed?: number;
    capacity?: number;
    rapidfire?: IRapidfire;
    8?: number;
    107?: number;
    110?: number;
}
interface I213 {
    metal?: number;
    crystal?: number;
    deuterium?: number;
    energy?: number;
    factor?: number;
    rapidfire?: IRapidfire;
    8?: number;
    107?: number;
    110?: number;
    111?: number;
}
interface I214 {
    metal?: number;
    crystal?: number;
    deuterium?: number;
    energy?: number;
    factor?: number;
    rapidfire?: IRapidfire;
    8?: number;
    107?: number;
    110?: number;
    115?: number;
}
interface IDefenses {
    301: I301;
    302: I302;
    303: I303;
    304: I304;
    305: I305;
    306: I306;
    307: I307;
    308: I308;
    309: I309;
    310: I310;
}
interface I301 {
    metal: number;
    crystal: number;
    deuterium: number;
    energy: number;
    factor: number;
}
interface I302 {
    metal: number;
    crystal: number;
    deuterium: number;
    energy: number;
    factor: number;
}
interface I303 {
    metal: number;
    crystal: number;
    deuterium: number;
    energy: number;
    factor: number;
}
interface I304 {
    metal: number;
    crystal: number;
    deuterium: number;
    energy: number;
    factor: number;
}
interface I305 {
    metal: number;
    crystal: number;
    deuterium: number;
    energy: number;
    factor: number;
}
interface I306 {
    metal: number;
    crystal: number;
    deuterium: number;
    energy: number;
    factor: number;
}
interface I307 {
    metal: number;
    crystal: number;
    deuterium: number;
    energy: number;
    factor: number;
}
interface I308 {
    metal: number;
    crystal: number;
    deuterium: number;
    energy: number;
    factor: number;
}
interface I309 {
    metal: number;
    crystal: number;
    deuterium: number;
    energy: number;
    factor: number;
}
interface I310 {
    metal: number;
    crystal: number;
    deuterium: number;
    energy: number;
    factor: number;
}
interface ITechnologies {
    101: I101;
    102: I102;
    103: I103;
    104: I104;
    105: I105;
    106: I106;
    107: I107;
    108: I108;
    109: I109;
    110: I110;
    111: I111;
    112: I112;
    113: I113;
    114: I114;
    115: I115;
}
interface I101 {
    metal?: number;
    crystal?: number;
    deuterium?: number;
    energy?: number;
    factor?: number;
    12?: number;
}
interface I102 {
    metal?: number;
    crystal?: number;
    deuterium?: number;
    energy?: number;
    factor?: number;
    12?: number;
}
interface I103 {
    metal?: number;
    crystal?: number;
    deuterium?: number;
    energy?: number;
    factor?: number;
    12?: number;
}
interface I104 {
    metal?: number;
    crystal?: number;
    deuterium?: number;
    energy?: number;
    factor?: number;
    12?: number;
}
interface I105 {
    metal?: number;
    crystal?: number;
    deuterium?: number;
    energy?: number;
    factor?: number;
    12?: number;
    106?: number;
}
interface I106 {
    metal?: number;
    crystal?: number;
    deuterium?: number;
    energy?: number;
    factor?: number;
    12?: number;
}
interface I107 {
    metal?: number;
    crystal?: number;
    deuterium?: number;
    energy?: number;
    factor?: number;
    12?: number;
    105?: number;
    106?: number;
}
interface I108 {
    metal?: number;
    crystal?: number;
    deuterium?: number;
    energy?: number;
    factor?: number;
    12?: number;
    106?: number;
}
interface I109 {
    metal?: number;
    crystal?: number;
    deuterium?: number;
    energy?: number;
    factor?: number;
    12?: number;
    106?: number;
}
interface I110 {
    metal?: number;
    crystal?: number;
    deuterium?: number;
    energy?: number;
    factor?: number;
    12?: number;
    107?: number;
}
interface I111 {
    metal?: number;
    crystal?: number;
    deuterium?: number;
    energy?: number;
    factor?: number;
    12?: number;
    106?: number;
}
interface I112 {
    metal?: number;
    crystal?: number;
    deuterium?: number;
    energy?: number;
    factor?: number;
    12?: number;
    106?: number;
    111?: number;
}
interface I113 {
    metal?: number;
    crystal?: number;
    deuterium?: number;
    energy?: number;
    factor?: number;
    12?: number;
    106?: number;
    111?: number;
    112?: number;
}
interface I114 {
    metal?: number;
    crystal?: number;
    deuterium?: number;
    energy?: number;
    factor?: number;
    12?: number;
    102?: number;
    107?: number;
}
interface I115 {
    metal?: number;
    crystal?: number;
    deuterium?: number;
    energy?: number;
    factor?: number;
    12?: number;
}
interface IRequirements {
    5: I5;
    7: I7;
    8: I8;
    13: I13;
    101: I101;
    102: I102;
    103: I103;
    104: I104;
    105: I105;
    106: I106;
    107: I107;
    108: I108;
    109: I109;
    110: I110;
    111: I111;
    112: I112;
    113: I113;
    114: I114;
    115: I115;
    201: I201;
    202: I202;
    203: I203;
    204: I204;
    205: I205;
    206: I206;
    207: I207;
    208: I208;
    209: I209;
    210: I210;
    211: I211;
    212: I212;
    213: I213;
    214: I214;
}
interface IMappings {
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
    6: string;
    7: string;
    8: string;
    9: string;
    10: string;
    11: string;
    12: string;
    13: string;
    14: string;
    15: string;
    101: string;
    102: string;
    103: string;
    104: string;
    105: string;
    106: string;
    107: string;
    108: string;
    109: string;
    110: string;
    111: string;
    112: string;
    113: string;
    114: string;
    115: string;
    201: string;
    202: string;
    203: string;
    204: string;
    205: string;
    206: string;
    207: string;
    208: string;
    209: string;
    210: string;
    211: string;
    212: string;
    213: string;
    214: string;
    301: string;
    302: string;
    303: string;
    304: string;
    305: string;
    306: string;
    307: string;
    308: string;
    309: string;
    310: string;
    metal_mine: string;
    crystal_mine: string;
    deuterium_synthesizer: string;
    solar_plant: string;
    fusion_reactor: string;
    robotic_factory: string;
    nanite_factory: string;
    shipyard: string;
    metal_storage: string;
    crystal_storage: string;
    deuterium_storage: string;
    research_lab: string;
    terraformer: string;
    alliance_depot: string;
    missile_silo: string;
    espionage_tech: string;
    computer_tech: string;
    weapon_tech: string;
    armour_tech: string;
    shielding_tech: string;
    energy_tech: string;
    hyperspace_tech: string;
    combustion_drive_tech: string;
    impulse_drive_tech: string;
    hyperspace_drive_tech: string;
    laser_tech: string;
    ion_tech: string;
    plasma_tech: string;
    intergalactic_research_tech: string;
    graviton_tech: string;
    small_cargo_ship: string;
    large_cargo_ship: string;
    light_fighter: string;
    heavy_fighter: string;
    cruiser: string;
    battleship: string;
    colony_ship: string;
    recycler: string;
    espionage_probe: string;
    bomber: string;
    solar_satellite: string;
    destroyer: string;
    battlecruiser: string;
    deathstar: string;
    rocket_launcher: string;
    light_laser: string;
    heavy_laser: string;
    gauss_cannon: string;
    ion_cannon: string;
    plasma_turret: string;
    small_shield_dome: string;
    large_shield_dome: string;
    anti_ballistic_missile: string;
    interplanetary_missile: string;
}