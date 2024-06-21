import { BadRequestError } from "../utils/errors.js";
import DocumentationDAO from "./daos/mongo/documentation/documentation.mongo.dao.js";

export default class DocumentationManager {
  constructor() {
    this.documentationDAO = new DocumentationDAO();
  }

  getAll = async () => {
    return await this.documentationDAO.findAll();
  };

  create = async (nombre, codigo, obligatorio) => {
    const existsDocumentation = await this.documentationDAO.findOne(codigo);

    if (existsDocumentation) {
      throw new BadRequestError(
        `Ya existe un documento con el código ${codigo}`
      );
    }

    /* const { title, description, code, price, category, thumb, st, stock } =
      validateProduct(product).data;*/

    const nuevaDocumentacion = await this.documentationDAO.create({
      nombre,
      codigo,
    });
    return nuevaDocumentacion;
  };

  delete = async (codigo) => {
    const buscarDoc = this.documentationDAO.findOne(codigo);
    if (!buscarDoc) {
      throw new BadRequestError(
        `No existe ningún documento con código ${codigo}`
      );
    }

    return await this.documentationDAO.delete(codigo);
  };
}
