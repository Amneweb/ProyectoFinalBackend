import { Router } from "express";
import { sendEmail } from "../controllers/emails.controller.js";

const router = Router();
router.get("/", sendEmail);

export default router;
