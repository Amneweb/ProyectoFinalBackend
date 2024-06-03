import CustomRouter from "./custom/custom.router.js";
import { sendEmail, recupero } from "../controllers/emails.controller.js";
export default class EmailRouter extends CustomRouter {
  init() {
    this.get("/", ["PUBLIC"], sendEmail);
    this.post("/recupero", ["PUBLIC"], recupero);
  }
}
