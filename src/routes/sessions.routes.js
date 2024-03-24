//apis de manejo de sesión. La ruta base es /api/sessions/

import { Router } from "express";
import userModel from "../services/db/models/users.model.js";

const router = Router();

router.post("/register", async (req, res) => {
  const { userName, userLastName, userEmail, userAge, userPassword } = req.body;
  console.log("Registrando Usuario");

  const exists = await userModel.findOne({ userEmail });
  if (exists) {
    return res
      .status(402)
      .send({ status: "error", message: "Usuario ya existe!!" });
  }
  const user = {
    userName,
    userLastName,
    userEmail,
    userAge,
    userPassword,
  };
  const result = await userModel.create(user);
  res.send({
    status: "success",
    message: "Usuario creado con éxito con ID: " + result.id,
  });
});

router.post("/login", async (req, res) => {
  const { userEmail, userPassword } = req.body;
  const user = await userModel.findOne({ userEmail, userPassword });
  if (!user)
    return res
      .status(401)
      .send({ status: "error", error: "Credenciales incorrectas" });
  if (userEmail === "adminCoder@coder.com") {
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
});

export default router;
