export default class BuildDefenseRequest {
  planetID: number;
  buildOrder: BuildOrderItem[];
}

export class BuildOrderItem {
  unitID: number;
  amount: number;
}
