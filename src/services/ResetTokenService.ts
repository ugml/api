import IResetTokenService from "../interfaces/IResetTokenService";

import squel = require("safe-squel");
import Database from "../common/Database";
import InputValidator from "../common/InputValidator";
import ResetToken from "../units/ResetToken";

/**
 * This class defines a service to interact with the ResetToken-table in the database
 */
export default class ResetTokenService implements IResetTokenService {
  /**
   * Checks, if a reset-request for the given email was already made
   * @param email
   */
  public async checkIfResetAlreadyRequested(email: string): Promise<boolean> {
    const query: string = squel
      .select()
      .from("resetTokens")
      .field("email")
      .where("email = ?", email)
      .toString();

    const [rows] = await Database.query(query.toString());

    if (!InputValidator.isSet(rows)) {
      return false;
    }

    return rows.length > 0;
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
}
