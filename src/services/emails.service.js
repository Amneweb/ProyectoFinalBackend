import { transporter } from "../config/mailer.config.js";
import { environmentConfig } from "../config/environment.config.js";
export const sendEmail = async (content) => {
  let html;

  const { purchase_datetime, code, purchaser, amount } = content;

  html = `<div><h3> Código de tu compra: ${code} </h3><p>Total de la compra: ${amount}</p><p>Fecha de compra: ${purchase_datetime} </p></div>`;

  const mailOptions = {
    from: "Windward Baterías - " + environmentConfig.MAILER.EMAIL,
    to: purchaser,
    subject: "Gracias por comprar en Baterías Windward",
    html: html,
    attachments: [],
  };
  try {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return { message: "Error", payload: error };
      }
      console.log("Message sent: %s", info.messageId);
      return { message: "Success", payload: info };
    });
  } catch (error) {
    console.error(error);
    return {
      error: error,
      message:
        "No se pudo enviar el email desde:" + environmentConfig.MAILER.EMAIL,
    };
  }
};
