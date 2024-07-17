import { Router } from "express";

const router = Router();

router.get("/comprainiciada", (req, res) => {
  res
    .cookie(
      "WWcompraIniciada",
      { status: "ok", tiempo: new Date() },
      {
        maxAge: 600000, //milliseconds
        httpOnly: true,
        signed: true,
      }
    )
    .send({ status: "ok", message: "la cookie fue creada" });
});

router.get("/comprafinalizada", (req, res) => {
  if (!req.signedCookies["WWcompraIniciada"]) {
    return res.status(500).send({
      error: "Error interno",
      message: "La compra no se pudo concretar",
    });
  }
  return res.clearCookie("WWcompraIniciada").status(201).send({
    status: "success",
    message: "La compra finalizó correctamente",
  });
});

export default router;
