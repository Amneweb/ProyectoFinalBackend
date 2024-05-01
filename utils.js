import { fileURLToPath } from "url";
import path from "path";
import { dirname } from "path";
import multer from "multer";
import { validatePartialProduct } from "./src/services/product.validator.js";
import bcrypt from "bcrypt";
import { environmentConfig } from "./src/config/environment.config.js";
import jwt from "jsonwebtoken";
import passport from "passport";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

// Configuracion de MULTER
// Objeto de configuracion
const storage = multer.diskStorage({
  // ubicacion del directorio donde voy a guardar los archivos
  destination: function (req, file, cb) {
    cb(null, `${__dirname}/public/img`);
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
    console.log(err);
    next();
  },
});

export const validateFormData = (req, res, next) => {
  const thumb = req.file
    ? "/img/" + path.basename(req.file.path.replaceAll(" ", "%20"))
    : "";
  let categoria = [];
  categoria.push(req.body.category);
  const datosConvertidos = {
    ...req.body,
    price: parseFloat(req.body.price),
    stock: parseInt(req.body.stock),
    category: categoria,
    thumb: thumb,
  };

  const result = validatePartialProduct(datosConvertidos);

  req.validatedData = result;

  next();
};

export const validateModifiedData = (req, res, next) => {
  let datosConvertidos = { ...req.body };
  if (req.file) {
    const thumb = "/img/" + path.basename(req.file.path.replaceAll(" ", "%20"));
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

  const result = validatePartialProduct(datosConvertidos);

  req.validatedData = result;

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
    expiresIn: "120s",
  });
};
//FIXME: esta función creo que no la uso, tal vez la puedo borrar
/**
 * Metodo que autentica el token JWT para nuestros requests.
 * OJO: Esto actúa como un middleware, observar el next.
 * @param {*} req Objeto de request
 * @param {*} res Objeto de response
 * @param {*} next Pasar al siguiente evento.
 */
export const authToken = (req, res, next) => {
  //El JWT token se guarda en los headers de autorización.
  const authHeader = req.headers.authorization;
  console.log("Utils.js: Token present in header auth:");
  console.log(authHeader);
  if (!authHeader) {
    return res
      .status(401)
      .send({ error: "User not authenticated or missing token." });
  }

  const token = authHeader.split(" ")[1].trim(); //Se hace el split para retirar la palabra Bearer.
  //Validar token
  jwt.verify(
    token,
    environmentConfig.SERVER.JWT.SECRET,
    (error, credentials) => {
      if (error)
        return res.status(403).send({ error: "Token invalid, Unauthorized!" });
      //Token OK
      req.user = credentials.user;
      console.log(
        "supuestamente tenemos el usuario que viene del header ",
        req.user
      );
      next();
    }
  );
};
//FIXME: por ahora no se usa.
export const passportCall = (strategy) => {
  return async (req, res, next) => {
    console.log("Entrando a llamar strategy: ");
    console.log(strategy);
    passport.authenticate(strategy, function (err, user, info) {
      if (err) return next(err);
      if (!user) {
        return res
          .status(401)
          .send({ error: info.messages ? info.messages : info.toString() });
      }
      console.log("Usuario obtenido del strategy: ");
      console.log(user);
      req.user = user;
      next();
    })(req, res, next);
  };
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
