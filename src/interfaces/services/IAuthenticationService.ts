export default interface IAuthenticationService {
  authenticate(email: string, password: string);
}
