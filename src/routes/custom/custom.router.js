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
    logger.debug("Usuario en handle policies %j", req.user);
    if (!req.user || !req.user.role) {
      return res
        .status(401)
        .send({ error: "User not authenticated or missing token." });
    }

    const role = req.user.role.toUpperCase();
    if (!policies.includes(role)) {
      logger.warning("El usuario no tiene los privilegios necesarios");
      return res
        .status(403)
        .send({ error: "El usuario no tiene privilegios, revisa tus roles!" });
    }

    next();
  };

  generateCustomResponses = (req, res, next) => {
    // Custom responses
    res.sendSuccess = (payload) =>
      res.status(200).send({ status: "Success", payload });
    res.sendInternalServerError = (error) =>
      res.status(500).send({ status: "Internal Server Error", error });
    res.sendClientError = (error) =>
      res
        .status(400)
        .send({ status: "Client Error, Bad request from client.", error });
    res.sendUnauthorizedError = (error) =>
      res
        .status(401)
        .send({ error: "User not authenticated or missing token." });
    res.sendForbiddenError = (error) =>
      res.status(403).send({
        error:
          "Token invalid or user with no access, Unauthorized please check your roles!",
      });
    res.sendNotFoundError = (error) =>
      res.status(404).send({ error: "Not found error." });
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
