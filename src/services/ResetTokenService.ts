import IResetTokenService from "../interfaces/IResetTokenService";

import squel = require("safe-squel");
import Database from "../common/Database";
import InputValidator from "../common/InputValidator";
import ResetToken from "../units/ResetToken";
import SerializationHelper from "../common/SerializationHelper";
import User from "../units/User";

/**
 * This class defines a service to interact with the ResetToken-table in the database
 */
export default class ResetTokenService implements IResetTokenService {
  /**
   * Checks, if a reset-request for the given email was already made
   * @param email the email-address for which a password change will be requested
   * @param lastValidTimestamp the latest timestamp, after which previously requested tokens have become invalid
   */
  public async checkIfResetAlreadyRequested(email: string, lastValidTimestamp: number): Promise<boolean> {
    const query: string = squel
      .select()
      .from("resetTokens")
      .field("email")
      .where("email = ?", email)
      .where("requestedAt >= ?", lastValidTimestamp)
      .where("usedAt IS NULL")
      .toString();

    const [rows] = await Database.query(query.toString());

    if (!InputValidator.isSet(rows)) {
      return false;
    }

    return rows.length > 0;
  }

  /**
   * Checks, if the given token was issued for the given mail-address and if the token is still valid by checking the
   * timestamp
   * @param email
   */
  public async getTokenFromMail(email: string): Promise<ResetToken> {
    const query: string = squel
      .select()
      .from("resetTokens")
      .where("email = ?", email)
      .toString();

    const [rows] = await Database.query(query.toString());

    if (!InputValidator.isSet(rows)) {
      return null;
    }

    return SerializationHelper.toInstance(new ResetToken(), JSON.stringify(rows[0]));
  }

  /**
   * Inserts a new token into the database
   * @param data The token-data
   */
  public async storeResetToken(data: ResetToken): Promise<void> {
    const query: string = squel
      .insert({ autoQuoteFieldNames: true })
      .into("resetTokens")
      .set("email", data.email)
      .set("ipRequested", data.ipRequested)
      .set("resetToken", data.resetToken)
      .set("requestedAt", data.requestedAt)
      .toString();

    await Database.query(query.toString());
  }

  /**
   * Marks a given token as used by setting the time it was used
   * @param token the token
   * @param usedAt the timestamp, at which the token was used
   */
  public async setTokenUsed(token: string, usedAt: number): Promise<void> {
    const query: string = squel
      .update({ autoQuoteFieldNames: true })
      .table("resetTokens")
      .set("usedAt", usedAt)
      .where("resetToken = ?", token)
      .toString();

    await Database.query(query.toString());
  }
}
