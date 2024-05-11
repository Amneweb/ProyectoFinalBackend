import { Router } from "express";

export default class CustomRouter {
  constructor() {
    this.router = Router();
    this.init();
  }

  getRouter() {
    return this.router;
  }
  init() {} //Esta inicialilzacion se usa para las clases heredadas.

  get(path, policies, ...callbacks) {
    console.log("Entrando por GET a custom router con Path: " + path);
    this.router.get(
      path,
      this.handlePolicies(policies),
      this.generateCustomResponses,
      this.applyCallbacks(callbacks)
    );
  }

  post(path, policies, ...callbacks) {
    console.log("Entrando por POST a custom router con Path: " + path);
    this.router.post(
      path,
      this.handlePolicies(policies),
      this.generateCustomResponses,
      this.applyCallbacks(callbacks)
    );
  }

  put(path, policies, ...callbacks) {
    console.log("Entrando por PUT a custom router con Path: " + path);
    this.router.put(
      path,
      this.handlePolicies(policies),
      this.generateCustomResponses,
      this.applyCallbacks(callbacks)
    );
  }

  delete(path, policies, ...callbacks) {
    console.log("Entrando por DELETE a custom router con Path: " + path);
    this.router.delete(
      path,
      this.handlePolicies(policies),
      this.generateCustomResponses,
      this.applyCallbacks(callbacks)
    );
  }

  handlePolicies = (policies) => (req, res, next) => {
    console.log("Politicas a evaluar:");
    console.log(policies);
    if (policies.includes("PUBLIC")) return next();

    if (!req.user || !req.user.role) {
      return res.status(401).render("errors", {
        error: "User not authenticated or missing token.",
        message:
          "Usuario no autenticado o problemas durante la autenticación. Intentalo de nuevo.",
        style: "catalogo.css",
      });
    }

    const role = req.user.role.toUpperCase();
    if (!policies.includes(role)) {
      return res.status(403).render("errors", {
        error: "El usuario no tiene privilegios, revisa tus roles!",
        message:
          "No estás autorizado a entrar a este recurso. Para ir a este sector de la web debés ser ADMINISTRADOR",
        style: "catalogo.css",
      });
    }

    next();
  };

  generateCustomResponses = (req, res, next) => {
    // Custom responses
    res.sendSuccess = (payload) =>
      res.status(200).send({ status: "Success", payload });
    res.sendInternalServerError = (error) =>
      res.status(500).render("errors", {
        status: "Error",
        error,
        message:
          "Error interno en la aplicación. Volvé a intentarlo más tarde.",
      });
    res.sendClientError = (error) =>
      res.status(400).render({
        status: "Client Error, Bad request from client.",
        error,
        message:
          "Error del cliente. Seguramente escribiste mal una ruta, o no sos un usuario registrado.",
        style: "catalogo.css",
      });
    res.sendUnauthorizedError = (error) =>
      res.status(401).render("errors", {
        error: "User not authenticated or missing token.",
        message: "No te has autenticado o ha habido un error de autenticación.",
        style: "catalogo.css",
      });
    res.sendForbiddenError = (error) =>
      res.status(403).render("errors", {
        error:
          "Token invalid or user with no access, Unauthorized please check your roles!",
        message:
          "Credenciales inválidas o no tenés los privilegios para acceder a este recurso. Para entrar a la sección de administración debés tener rol de ADMINISTRADOR",
        style: "catalogo.css",
      });
    next();
  };

  // función que procese todas las funciones internas del router (middlewares y el callback principal)
  // Se explica en el slice 28
  applyCallbacks(callbacks) {
    return callbacks.map((callback) => async (...params) => {
      try {
        await callback.apply(this, params);
      } catch (error) {
        console.log("error en callback ", error);
        params[1].status(500).send(error);
      }
    });
  }
}
