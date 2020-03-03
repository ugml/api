import ResetToken from "../units/ResetToken";

export default interface IResetTokenService {
  checkIfResetAlreadyRequested(email: string): Promise<boolean>;
  storeResetToken(data: ResetToken): Promise<void>;
}
