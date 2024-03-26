import { Router } from "express";
import ProductManager from "../services/db/products.db.service.js";
import CategoryManager from "../services/db/categories.db.service.js";
import CartManager from "../services/db/carts.db.service.js";

const router = Router();

let productManager = new ProductManager();
let cartManager = new CartManager();
let categoryManager = new CategoryManager();

//middleware para dejar pasar sólo a los administradores
function auth(req, res, next) {
  console.log("dentro de middle de auth", req.session.user);
  if (req.session.user.email === "adminCoder@coder.com" && req.session.admin) {
    return next();
  } else {
    return res
      .status(403)
      .setHeader("Content-type", "text/html")
      .send(
        '<div><p>Lo sentimos, no estás autorizado para ingresar a este recurso</p><p>Hacé click <a href="/catalogo">aquí</a> para volver a la página de inicio</p></div>'
      );
  }
}

//middleware para no permitir acceder a ninguna vista sin estar logueado
function noauth(req, res, next) {
  if (!req.session.user) {
    return res.render("login", { style: "general.css" });
  } else {
    return next();
  }
}

router.get("/catalogo", noauth, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 300;
  const criterio = req.query.criterio || "title";
  const sentido = parseInt(req.query.sentido) || 1;
  let sort = {};
  sort[criterio] = sentido;

  try {
    const productosObtenidos = await productManager.getPagination(
      page,
      limit,
      sort
    );
    productosObtenidos.paginacion =
      limit >= productosObtenidos.totalDocs ? false : true;

    productosObtenidos.prevLink = productosObtenidos.hasPrevPage
      ? `/catalogo/?page=${productosObtenidos.prevPage}&limit=${limit}&sentido=${sentido}&criterio=${criterio}`
      : "";
    productosObtenidos.nextLink = productosObtenidos.hasNextPage
      ? `/catalogo/?page=${productosObtenidos.nextPage}&limit=${limit}&sentido=${sentido}&criterio=${criterio}`
      : "";

    productosObtenidos.isValid = !(
      page < 1 || page > productosObtenidos.totalPages
    );

    res.render("catalogo", {
      productosObtenidos,
      user: req.session.user,
      role: req.session.admin,
      style: "catalogo.css",
    });
  } catch (e) {
    res.status(500).send(e.message);
  }
});

router.get("/catalogo/:id", noauth, async (req, res) => {
  if (!req.session.user) return res.render("login", { style: "general.css" });
  const id = req.params.id;
  try {
    const producto = await productManager.getProductByID(id);
    if (!producto) {
      const mensaje = `no se encontró ningún producto con el ID ${id}`;
      throw new Error(mensaje);
    }
    res.render("product", {
      producto,
      style: "catalogo.css",
    });
  } catch (e) {
    res.status(500).render("errors", { message: e.message });
  }
});

router.get("/admin", noauth, auth, async (req, res) => {
  try {
    const carritosObtenidos = await cartManager.getCarts();

    res.render("carts", { carritosObtenidos, style: "general.css" });
  } catch (e) {
    res.status(500).send(e.message);
  }
});

router.get("/chat", noauth, (req, res) => {
  res.render("messages", { style: "general.css" });
});

router.get("/home", noauth, async (req, res) => {
  try {
    let productosObtenidos = productManager.getProducts();
    let categoriasExistentes = categoryManager.getCategories();
    await Promise.all([productosObtenidos, categoriasExistentes]).then(
      ([productosObtenidos, categoriasExistentes]) => {
        res.render("adminProducts", {
          productosObtenidos,
          categoriasExistentes,
          style: "general.css",
        });
      }
    );
  } catch (e) {
    res.status(500).send(e.message);
  }
});

//para ver el carrito del usuario
router.get("/carrito/:cid", noauth, async (req, res) => {
  try {
    const carrito = await cartManager.getCartByID(req.params.cid);
    res.render("usercart", {
      carrito,
      style: "general.css",
    });
  } catch (e) {
    res.status(404).send(e.message);
  }
});

router.get("/adminProduct/:pid", noauth, async (req, res) => {
  const id = req.params.pid;
  try {
    let productosObtenidos = productManager.getProductByID(id);
    let categoriasExistentes = categoryManager.getCategories();
    await Promise.all([productosObtenidos, categoriasExistentes]).then(
      ([productosObtenidos, categoriasExistentes]) => {
        res.render("adminProduct", {
          productosObtenidos,
          categoriasExistentes,
          style: "general.css",
        });
      }
    );
  } catch (e) {
    res.status(500).send(e.message);
  }
});

export default router;
