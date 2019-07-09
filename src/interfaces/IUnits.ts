export interface IUnits {
  save(): Promise<{}>;
  create(connection): Promise<{}>;
  isValid(): boolean;
}
