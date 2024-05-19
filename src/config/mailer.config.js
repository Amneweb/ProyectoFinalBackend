import nodemailer from "nodemailer";
import { environmentConfig } from "./environment.config.js";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: "amneris.calle@gmail.com",
    pass: environmentConfig.MAILER.AUTH_PASS,
  },
});
transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});
