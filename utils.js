import { fileURLToPath } from "url";
import path from "path";
import { dirname } from "path";
import multer from "multer";
import { validatePartialProduct } from "./src/services/product.validator.js";
import pc from "picocolors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

// Configuracion de MULTER
// Objeto de configuracion
const storage = multer.diskStorage({
  // ubicacion del directorio donde voy a guardar los archivos
  destination: function (req, file, cb) {
    cb(null, `${__dirname}/public/img`);

    console.log(pc.green("ruta de guardado de imagenes"));
    console.log(`${__dirname}/public/img`);
  },

  // el nombre que quiero que tengan los archivos que voy a subir
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
    console.log(pc.bgGreen("nuevo nombre de imagen"));
    console.log(`${Date.now()}-${file.originalname}`);
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
  console.log(pc.bgRed("body del formulario en middleware"));
  console.log(req.body);
  const ruta = req.file && req.file.path.replaceAll(" ", "%20");
  const thumb = "/img/" + path.basename(ruta);
  let categoria = [];
  categoria.push(req.body.category);
  const datosConvertidos = {
    ...req.body,
    price: parseFloat(req.body.price),
    stock: parseInt(req.body.stock),
    category: categoria,
    thumb: thumb,
  };
  console.log(pc.bgGreen("datos convertidos al formato correcto"));
  console.log(datosConvertidos);
  const result = validatePartialProduct(datosConvertidos);

  console.log(pc.bgRed("en middleware después de validar"));
  console.log(result);
  req.validatedData = result;

  next();
};
