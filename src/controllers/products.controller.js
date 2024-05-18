import { productsService } from "../services/factory.js";

export default class ProductsController {
  #productManager;
  constructor() {
    this.#productManager = productsService;
  }

  getAll = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 300;
    const criterio = req.query.criterio || "title";
    const sentido = parseInt(req.query.sentido) || 1;
    let sort = {};
    sort[criterio] = sentido;

    try {
      const productosObtenidos = await this.#productManager.getProducts(
        page,
        limit,
        sort
      );

      return res.send(productosObtenidos);
    } catch (e) {
      res.status(500).send(e.message);
    }
  };

  getOne = async (req, res) => {
    try {
      const result = await this.#productManager.getProductByID(req.params.id);
      if (!result) {
        const mensaje = `no se encontró ningún producto con el ID ${req.params.id}`;
        throw new Error(mensaje);
      }
      res.status(201).send(result);
    } catch (e) {
      res.status(422).send({ message: e.message });
    }
  };

  postOne = async (req, res) => {
    if (req.validatedData.error) {
      return res
        .status(400)
        .json({ error: JSON.parse(req.validatedData.error.message) });
    }
    try {
      let imagen = [];
      req.validatedData.data.thumb && imagen.push(req.validatedData.data.thumb);
      const result = await this.#productManager.addProduct({
        ...req.validatedData.data,
        thumb: imagen,
      });

      res.status(200).send({ status: "success", payload: result });
    } catch (e) {
      res.status(500).send(e.message);
    }
  };

  deleteOne = async (req, res) => {
    try {
      res.send(await this.#productManager.deleteProduct(req.params.id));
    } catch (e) {
      res.status(400).send(e.message);
    }
  };

  modifyOne = async (req, res) => {
    const nuevo = req.validatedData;

    if (nuevo.error) {
      return res.status(400).json({ error: JSON.parse(nuevo.error.message) });
    } else
      try {
        res.send(
          await this.#productManager.updateProduct(req.params.id, nuevo.data)
        );
      } catch (e) {
        res.status(400).send(e.message);
      }
  };

  modifyCate = async (req, res) => {
    try {
      res.send(
        await this.#productManager.deleteProductCategory(
          req.params.id,
          req.params.cate
        )
      );
    } catch (e) {
      res.status(400).send(e.message);
    }
  };

  postImage = async (req, res) => {
    const id = req.body.IDproducto;
    if (!req.file) {
      return res
        .status(400)
        .send({ status: "error", mensaje: "No se adjunto archivo." });
    }

    try {
      let imagen = [];
      req.validatedData.data.thumb && imagen.push(req.validatedData.data.thumb);
      res.send(await this.#productManager.updateProduct(id, { thumb: imagen }));
    } catch (e) {
      res.status(500).send(e.message);
    }
  };
}
