import documentationModel from "./documentation.model.js";

class DocumentationDAO {
  #model;
  constructor() {
    this.#model = documentationModel;
  }
  findAll = async () => {
    return await this.#model.find().lean();
  };

  create = async (nombre, codigo) => {
    return await this.#model.create(nombre, codigo);
  };

  delete = async (codigo) => {
    return await this.#model.deleteOne({ codigo: codigo });
  };
  findOne = async (codigo) => {
    return await this.#model.findOne({ codigo: codigo });
  };
}
export default DocumentationDAO;
