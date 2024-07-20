import { Router } from "express";

import passport from "passport";

import githubController from "../controllers/github.controller.js";

const router = Router();
router.get(
  "/",
  passport.authenticate("github", { scope: ["user:userEmail"] }),
  async (req, res) => {}
);
router.get(
  "/githubcallback",
  passport.authenticate("github", {
    failureRedirect: "/login",
    session: false,
  }),

  githubController
);

export default router;
