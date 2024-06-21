import DocumentationManager from "../services/documentation.service.js";

export default class DocumentationController {
  #documentationManager;

  constructor() {
    this.#documentationManager = new DocumentationManager();
  }

  getDocumentation = async (req, res) => {
    try {
      const todos = await this.#documentationManager.getAll();
      res.sendSuccess(todos);
    } catch (e) {
      res.sendInternalServerError(e.message);
    }
  };

  addDocumentation = async (req, res) => {
    const nombre = req.body.nombre;
    const codigo = req.body.codigo;
    const obligatorio = req.body.obligatorio;

    try {
      const nuevoDoc = await this.#documentationManager.create(
        nombre,
        codigo,
        obligatorio
      );
      res.sendSuccess(nuevoDoc);
    } catch (e) {
      res.sendClientError(e.message);
    }
  };

  deleteDocumentation = async (req, res) => {
    const codigo = req.params.dcode;
    try {
      await this.#documentationManager.delete(codigo);

      res.sendSuccess("Se ha borrado la documentación correctamente");
    } catch (error) {
      res.sendClientError(
        `No se pudo borrar la documentación con código %s. Mensaje interno: %s`,
        codigo,
        error.message
      );
    }
  };
}
