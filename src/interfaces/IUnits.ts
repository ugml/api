export interface IUnits {
    save() : Promise<{}>;
    create() : Promise<{}>;
    isValid() : boolean;
}
