import { transporter } from "../config/mailer.config.js";
import { environmentConfig } from "../config/environment.config.js";
export const sendEmail = async (req, res) => {
  const destEmail = req.query.email;

  const mailOptions = {
    from: "Windward Baterías - " + environmentConfig.MAILER.EMAIL,
    to: destEmail,
    subject: "Correo de prueba CoderHouse Programacion backend clase_30",
    html: `<div><h3> Esto es un Test de envio de correos con Nodemailer! </h3></div>`,
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
