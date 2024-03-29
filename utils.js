import { fileURLToPath } from "url";
import path from "path";
import { dirname } from "path";
import multer from "multer";
import { validatePartialProduct } from "./src/services/product.validator.js";
import bcrypt from "bcrypt";

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
  console.log(
    `Datos a validar: password de formulario: ${plainTextPassword}, password hasheado: ${hashedPassword}`
  );
  return bcrypt.compareSync(plainTextPassword, hashedPassword);
};
