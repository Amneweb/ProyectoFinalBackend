/*======================================================
RUTAS DESDE /api/sessions
/*======================================================*/

import { Router } from "express";
import passport from "passport";
import pc from "picocolors";
const router = Router();

/*=============================
RUTAS PARA ESTRATEGIA GITHUB
==============================*/

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:userEmail"] }),
  async (req, res) => {}
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/github/error" }),
  async (req, res) => {
    const user = req.user;

    req.session.user = {
      name: `${user.userName} ${user.userLastName}`,
      email: user.userEmail,
      age: user.userAge,
    };
    if (req.session.user.email === "adminCoder@coder.com")
      req.session.admin = true;
    res.redirect("/users");
  }
);

/*=============================
RUTAS PARA ESTRATEGIA LOCAL
==============================*/
router.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/api/sessions/failregister",
  }),
  async (req, res) => {
    console.log("Registrando Usuario");

    res.status(201).send({
      status: "success",
      message: "Usuario creado con éxito con ID: ---------",
    });
  }
);

router.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/api/sessions/faillogin",
  }),
  async (req, res) => {
    console.log(pc.bgRed("Usuario encontrado: "));
    const user = req.user;
    if (!user)
      return res
        .status(401)
        .send({ status: "error", error: "Credenciales incorrectas" });
    if (user.userEmail === "adminCoder@coder.com") {
      req.session.admin = true;
    }
    req.session.user = {
      name: `${user.userName} ${user.userLastName}`,
      email: user.userEmail,
      age: user.userAge,
    };

    res.send({
      status: "success",
      payload: { user: req.session.user, role: req.session.admin },
      message: "Primer logueo existoso",
    });
  }
);

router.get("/failregister", (req, res) => {
  res.status(401).send({ error: "Error de registro" });
});

router.get("/faillogin", (req, res) => {
  res.status(401).send({ error: "Error al loguearse" });
});

router.get("/github/error", (req, res) => {
  res.render("errors", {
    message: "No se pudo atenticar usando github",
    style: "catalogo.css",
  });
});

export default router;
