export default interface IAuthService {
  authenticateUser(email: string, password: string): Promise<string>;
}
