export default interface IGameConfig {
  server: IServer;
  units: IUnits;
}

export interface IServer {
  speed: number;
  language: string;
  startPlanet: IStartPlanet;
  limits: ILimits;
}

export interface IStartPlanet {
  name: string;
  diameter: number;
  fields: number;
  resources: IResourceCollection;
  minPlanetPos: number;
  maxPlanetPos: number;
}

export interface IResourceCollection {
  metal: number;
  crystal: number;
  deuterium: number;
}

export interface ILimits {
  galaxy: ILimit;
  system: ILimit;
  position: ILimit;
}

export interface ILimit {
  min: number;
  max: number;
}

export interface IUnits {
  buildings: IBuilding[];
  technologies: ITechnology[];
  ships: IShip[];
  defenses: IDefense[];
}

export interface IBuilding {
  unitID: number;
  costs: ICosts;
  requirements: IRequirement[];
}

export interface ICosts extends IResourceCollection {
  energy: number;
  factor: number;
}

export interface IRequirement {
  unitID: number;
  level: number;
}

export interface ITechnology extends IBuilding {}

export interface IShip extends IBuilding {
  stats: IStats;
  rapidfire: IRapidfire[];
}

export interface IStats {
  consumption: number;
  speed: number;
  capacity: number;
}

export interface IRapidfire {
  unitID: number;
  amount: number;
}

export interface IDefense extends IShip {}
