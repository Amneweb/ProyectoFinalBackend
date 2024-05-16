import { Router } from "express";
import { getProducts } from "../controllers/mocks.controller.js";

const router = Router();

router.get("/", getProducts);

export default router;
