import { Router } from "express";
import { customLogger as logger } from "../../config/logger.config.js";
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
    this.router.get(
      path,
      this.handlePolicies(policies),
      this.generateCustomResponses,
      this.applyCallbacks(callbacks)
    );
  }

  post(path, policies, ...callbacks) {
    this.router.post(
      path,
      this.handlePolicies(policies),
      this.generateCustomResponses,
      this.applyCallbacks(callbacks)
    );
  }

  put(path, policies, ...callbacks) {
    this.router.put(
      path,
      this.handlePolicies(policies),
      this.generateCustomResponses,
      this.applyCallbacks(callbacks)
    );
  }

  delete(path, policies, ...callbacks) {
    this.router.delete(
      path,
      this.handlePolicies(policies),
      this.generateCustomResponses,
      this.applyCallbacks(callbacks)
    );
  }

  handlePolicies = (policies) => (req, res, next) => {
    logger.method("Políticas a evaluar: %s", policies);

    if (policies.includes("PUBLIC")) {
      logger.silly("sigue de largo porque es PUBLIC");
      return next();
    }

    if (!req.user || !req.user.role) {
      if (req.baseUrl.split("/").includes("api")) {
        return res.status(401).send({
          error:
            "El usuario no se ha autenticado o expiró el plazo de la sesión",
        });
      } else {
        return res.render("errors", {
          message: "Aún no te has logueado o expiró el plazo de tu sesión",
          style: "admin.css",
        });
      }
    }

    const role = req.user.role.toUpperCase();
    if (!policies.includes(role)) {
      logger.warning("El usuario no tiene los privilegios necesarios");
      if (req.baseUrl.split("/").includes("api")) {
        return res.status(403).send({
          error: "El usuario no tiene privilegios, revisa tus roles!",
        });
      } else {
        return res.render("errors", {
          message:
            "No tenés los permisos para acceder a estas funcionalidades. Utilizá credenciales con los roles apropiados, o contactate con nosotros para solicitar información",
          style: "admin.css",
        });
      }
    }

    next();
  };

  generateCustomResponses = (req, res, next) => {
    res.sendSuccess = (payload) =>
      res.status(200).send({ status: "Success", payload });
    res.sendInternalServerError = (error) =>
      res.status(500).send({ status: "Error interno del servidor", error });
    res.sendClientError = (error) =>
      res
        .status(400)
        .send({ status: "Petición errónea por parte del cliente", error });
    res.sendUnauthorizedError = (error) =>
      res.status(401).send({
        status: "Usuario no autenticado o credenciales no encontradas.",
        error,
      });
    res.sendForbiddenError = (error) =>
      res.status(403).send({
        status: "Usuario no autorizado, por favor revisa tus roles",
        error,
      });
    res.sendNotFoundError = (error) =>
      res.status(404).send({ status: "No encontrado", error });
    next();
  };

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
