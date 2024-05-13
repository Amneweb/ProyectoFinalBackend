import { transporter } from "../config/mailer.config.js";
import { environmentConfig } from "../config/environment.config.js";
export const sendEmail = async (req, res) => {
  console.log("en send email ", req.ticket);
  let destEmail;
  let html;
  if (req.query.email) {
    destEmail = req.query.email;
    html = `<h3>Hola, ${destEmail}</h3><p>Gracias por probar nuestros servicios de correo. Te invitamos a recorrer nuestro shop online para elegir la mejor batería para tu auto</p>`;
  } else {
    const { purchase_datetime, code, purchaser, amount } = req.ticket;
    destEmail = purchaser;
    html = `<div><h3> Código de tu compra: ${code} </h3><p>Total de la compra: ${amount}</p><p>Fecha de compra: ${purchase_datetime} </p></div>`;
  }

  const mailOptions = {
    from: "Windward Baterías - " + environmentConfig.MAILER.EMAIL,
    to: destEmail,
    subject: "Gracias por comprar en Baterías Windward",
    html: html,
    attachments: [],
  };
  try {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(400).send({ message: "Error", payload: error });
      }
      console.log("Message sent: %s", info.messageId);
      res.send({ message: "Success", payload: info });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      error: error,
      message:
        "No se pudo enviar el email desde:" + environmentConfig.MAILER.EMAIL,
    });
  }
};
