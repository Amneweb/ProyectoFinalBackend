/*======================================================
        RUTAS DESDE /sessions
/*======================================================*/

import { Router } from "express";
const router = Router();
router.get("/", (req, res) => {
  if (req.session.counter) {
    req.session.counter++;
    res.render("sessions", {
      message: `Desde que iniciaste sesión, has visitado este sitio ${req.session.counter} veces. Para loguearte o registrarte, usá los botones de abajo. Si ya estás logueado, usá el menú superior.`,
      style: "catalogo.css",
    });
  } else {
    req.session.counter = 1;
    res.render("sessions", {
      message: `Bienvenido a esta nueva sesión. Si aun no te logueaste o registraste, hacelo con los botones de abajo. Si ya estás logueado, usá el menú superior.`,
      style: "catalogo.css",
    });
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      res.json({ error: "error logout", mensaje: "Error al cerrar la sesion" });
    }
    res.render("sessions", {
      message:
        "Te has deslogueado correctamente. Para volver a loguearte, hacé click en el botón de abajo",
      style: "catalogo.css",
    });
  });
});

export default router;
