import { transporter } from "../config/mailer.config.js";
import { environmentConfig } from "../config/environment.config.js";
export default class MailingService {
  constructor() {
    this.client = transporter;
  }

  sendEmail = async ({ to, subject, html, attachments }) => {
    const from = "Windward Baterías - " + environmentConfig.MAILER.EMAIL;
    let result = await this.client.sendMail({
      from,
      to,
      subject,
      html,
      attachments,
    });
    console.log(result);
    return result;
  };
}
