import ResetToken from "../units/ResetToken";

export default interface IResetTokenService {
  checkIfResetAlreadyRequested(email: string, lastValidTimestamp: number): Promise<boolean>;
  getTokenFromMail(email: string): Promise<ResetToken>;
  setTokenUsed(token: string, usedAt: number): Promise<void>;
  storeResetToken(data: ResetToken): Promise<void>;
}
