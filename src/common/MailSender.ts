import dotenv = require("dotenv");

const nodemailer = require("nodemailer");

dotenv.config();

/**
 * This is a wrapper-class for node-mailer
 */
export default class MailSender {
  /**
   * Sends a mail to the given address
   * @param recipient
   * @param subjectText
   * @param body
   */
  public static async sendMail(recipient: string, subjectText: string, body: string): Promise<void> {
    const mailOptions = {
      from: process.env.MAIL_FROM,
      to: recipient,
      subject: subjectText,
      replyTo: process.env.SUPPORT_MAIL,
      html: body,
    };

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true, // use SSL
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail(mailOptions);
  }
}
