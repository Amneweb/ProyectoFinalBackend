//vistas de manejo de sesión. La ruta base es /api/sessions/

import { Router } from "express";
const router = Router();
router.get("/", (req, res) => {
  if (req.session.counter) {
    req.session.counter++;
    res.send(`Se ha visitado este sitio ${req.session.counter} veces.`);
  } else {
    req.session.counter = 1;
    res.send("Bienvenido!");
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      res.json({ error: "error logout", mensaje: "Error al cerrar la sesion" });
    }
    res.send("Sesion cerrada correctamente.");
  });
});

export default router;
