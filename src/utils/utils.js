import multer from "multer";
import __dirname from "../../dirname.js";
import bcrypt from "bcrypt";
import { environmentConfig } from "../config/environment.config.js";
import jwt from "jsonwebtoken";
import passport from "passport";
import { transporter } from "../config/mailer.config.js";

export const agregarRuta = function (req, res, next) {
  let destinationPath;
  console.log("req en agregar Ruta", req.baseUrl);

  switch (req.baseUrl) {
    case "/api/products":
      destinationPath = "/public/uploads/img/products";
      break;
    case "/api/users":
      const splitPathLength = req.path.split("/").length;

      if (req.path.split("/")[splitPathLength - 1] === "documents") {
        destinationPath = "/public/uploads/docs";
      } else {
        destinationPath = "/public/uploads/img/profile";
      }
      break;
    default:
      destinationPath = "/public/uploads/defaults";
  }
  req.destinationPath = destinationPath;
  next();
};
// Configuracion de MULTER
// Objeto de configuracion
const storage = multer.diskStorage({
  // ubicacion del directorio donde voy a guardar los archivos
  destination: function (req, file, cb) {
    cb(null, `${__dirname}${req.destinationPath}`);
  },

  // el nombre que quiero que tengan los archivos que voy a subir
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const uploader = multer({
  storage,
  // si se genera algun error, lo capturamos
  onError: function (err, next) {
    console.log(`Error al tratar de subir la imagen ${err}`);
    throw new Error("error al tratar de subir la imagen" + err);
    next();
  },
});

export const validateFormData = (req, res, next) => {
  const thumb = req.file ? `${req.destinationPath}/${req.file.filename}` : "";
  let categoria = [];
  categoria.push(req.body.category);
  const datosConvertidos = {
    ...req.body,
    price: parseFloat(req.body.price),
    stock: parseInt(req.body.stock),
    category: categoria,
    thumb: thumb,
    st: true,
  };

  req.validatedData = datosConvertidos;

  next();
};

export const validateModifiedData = (req, res, next) => {
  let datosConvertidos = { ...req.body };

  if (req.file) {
    const thumb = req.file ? `${req.destinationPath}/${req.file.filename}` : "";
    datosConvertidos["thumb"] = thumb;
  }

  if (req.body.category) {
    let categoria = [];
    categoria.push(req.body.category);
    datosConvertidos["category"] = categoria;
  }
  if (req.body.price) {
    datosConvertidos["price"] = parseFloat(req.body.price);
  }
  if (req.body.stock) {
    datosConvertidos["stock"] = parseInt(req.body.stock);
  }

  req.validatedData = datosConvertidos;

  next();
};

export const validateUserFormData = (req, res, next) => {
  const datosConvertidos = {
    ...req.body,
    userAge: parseInt(req.body.userAge),
  };

  req.validatedData = datosConvertidos;

  next();
};

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (plainTextPassword, hashedPassword) => {
  return bcrypt.compareSync(plainTextPassword, hashedPassword);
};

//JSON Web Tokens JWT functions:

/**
 * Generate token JWT usando jwt.sign:
 * Primer argumento: objeto a cifrar dentro del JWT
 * Segundo argumento: La llave privada a firmar el token.
 * Tercer argumento: Tiempo de expiración del token.
 */
export const generateJWToken = (user) => {
  return jwt.sign({ user }, environmentConfig.SERVER.JWT.SECRET, {
    expiresIn: "600s",
  });
};

export const authToken = (req, res, next) => {
  //El JWT token se guarda en los headers de autorización o en la cookie.
  console.log("en auth token");
  let token;
  //Si se guarda en los headers de autorización.
  const authHeader = req.headers.authorization;
  console.log("el token en el header", authHeader);

  //Si se guarda en la cookie.
  const authCookie = req.cookies["token_login"];
  console.log("el token en la cookie", authCookie);

  if (authHeader || authCookie) {
    token = authHeader ? authHeader.split(" ")[1] : authCookie;
  }
  console.log("token", token);
  //Validar token
  jwt.verify(
    token,
    environmentConfig.SERVER.JWT.SECRET,
    (error, credentials) => {
      if (error)
        return res.status(403).send({ error: "Token invalid, Unauthorized!" });
      //Token OK
      req.user = credentials.user;
      console.log("user en utils ", credentials.user);

      next();
    }
  );
};

export const passportJWTCall = async (req, res, next) => {
  req.logger.method("Entrando a llamar strategy");

  passport.authenticate("jwt", function (err, user) {
    if (err) return next(err);
    if (user) {
      req.user = user;
    }
    next();
  })(req, res, next);
};

export const authorization = (role) => {
  return async (req, res, next) => {
    if (!req.user)
      return res.status(401).send("Unauthorized: User not found in JWT");
    if (req.user.role !== role) {
      return res
        .status(403)
        .send("Forbidden: El usuario no tiene permisos con este rol.");
    }
    next();
  };
};
export const sendEmail = (content) => {
  let destEmail;
  let html;
  console.log("dentro de send email en utils");
  const { purchase_datetime, code, purchaser, amount } = content;
  destEmail = purchaser;
  html = `<div><h3> Código de tu compra: ${code} </h3><p>Total de la compra: ${amount}</p><p>Fecha de compra: ${purchase_datetime} </p></div>`;

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
      }
      console.log("Message sent: %s", info.messageId);
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
