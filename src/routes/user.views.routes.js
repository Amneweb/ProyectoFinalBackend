/*======================================================
        RUTAS DESDE /users
/*======================================================*/

import { Router } from "express";

const router = Router();

router.get("/login", (req, res) => {
  res.render("login", { style: "general.css" });
});

router.get("/register", (req, res) => {
  res.render("register", { style: "general.css" });
});

router.get("/", (req, res) => {
  console.log("info para mostrar en profile ", req.body);
  res.render("profile", {
    user: req.user,
    style: "catalogo.css",
  });
});

export default router;
