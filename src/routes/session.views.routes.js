/*======================================================
        RUTAS DESDE /sessions
/*======================================================*/

import { Router } from "express";
const router = Router();
router.get("/", (req, res) => {
  if (req.session.counter) {
    req.session.counter++;
    res.render("sessions", {
      message: `Desde que iniciaste sesión, has visitado este sitio ${req.session.counter} veces.`,
      style: "catalogo.css",
    });
  } else {
    req.session.counter = 1;
    res.render("sessions", {
      message: `Has iniciado sesión pero aun no te autenticaste. Para hacerlo, cliqueá en el botón de abajo`,
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
