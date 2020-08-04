export default interface IRepository<T> {
  exists(id: number): Promise<boolean>;
  getById(id: number): Promise<T>;
  save(t: T): Promise<void>;
  create(t: T): Promise<T>;
}
