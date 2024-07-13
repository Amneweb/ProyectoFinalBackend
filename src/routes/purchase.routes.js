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
    .send({ message: "la cookie fue creada" });
});

router.get("/comprafinalizada", (req, res) => {
  if (!req.signedCookies["WWcompraIniciada"]) {
    return res.status(201).sendSuccess({
      status: "success",
      message: "La compra finalizó correctamente",
    });
  }
  return res.clearCookie("WWcompraIniciada").status(201).sendSuccess({
    status: "success",
    message: "La compra finalizó correctamente",
  });
});

export default router;
