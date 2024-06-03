import { environmentConfig } from "../config/environment.config.js";
import MailingService from "../services/emails.service.js";
import { generateJWToken } from "../utils/utils.js";
import { userLogger as logger } from "../config/logger.config.js";
import UserService from "../services/users.service.js";

const emailSender = new MailingService();
const userService = new UserService();
export const sendEmail = async (req, res) => {
  const destEmail = req.query.email;
  const html = req.body.html
    ? req.body.html
    : `<h3>Hola, ${destEmail}</h3><p>Gracias suscribirte a nuestro newsletter. Te invitamos a recorrer nuestro shop online para elegir la mejor batería para tu auto</p>`;
  const mailOptions = {
    from: "Windward Baterías - " + environmentConfig.MAILER.EMAIL,
    to: destEmail,
    subject: "Bienvenido a Windward Batery Store",
    html: html,
    attachments: [],
  };

  try {
    await emailSender.sendEmail({ ...mailOptions });
    res.sendSuccess("Email enviado con éxito");
  } catch (error) {
    logger.error(
      "No se pudo enviar el email desde: %s. Motivo del error: %s",
      environmentConfig.MAILER.EMAIL,
      error.message
    );
    res.sendInternalServerError(
      "No se pudo enviar el email desde:" + environmentConfig.MAILER.EMAIL
    );
  }
};
export const recupero = async (req, res) => {
  const destEmail = req.body.email;

  try {
    const emailVerificado = await userService.findByUsername(destEmail);
    if (!emailVerificado) {
      throw new Error("el email no corresponde a un usuario registrado");
    }
    const tokenRecovery = {
      email: destEmail,
    };
    const recovery_token = generateJWToken(tokenRecovery);
    const html = `<h3>Hola, ${destEmail}</h3><p>Haciendo click en este enlace podrás ir a setear una nueva contraseña. Este enlace tiene una validez de 1 hora desde el momento en que nuestro servidor envió este correo</p>
  <p><a href="localhost:8080/api/users/recupero/${recovery_token}">Recuperar contraseña</a></p>`;
    const mailOptions = {
      to: destEmail,
      subject: "Windward - Recuperación de contraseña",
      html: html,
      attachments: [],
    };
    await emailSender.sendEmail({ ...mailOptions });

    res
      .cookie("email_recovery_expiration", recovery_token, {
        maxAge: 600000,
        httpOnly: true,
      })
      .sendSuccess("Email enviado con éxito");
  } catch (error) {
    logger.error(
      "No se pudo enviar el email desde: %s Mensaje del error: %s",
      environmentConfig.MAILER.EMAIL,
      error.message
    );
    res.sendInternalServerError(
      "No se pudo enviar el email desde:" +
        environmentConfig.MAILER.EMAIL +
        " Mensaje del error: " +
        error.message
    );
  }
};
