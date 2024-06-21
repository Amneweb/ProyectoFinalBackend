import CustomRouter from "./custom/custom.router.js";
import DocumentationController from "../controllers/documentation.controller.js";
import pc from "picocolors";

export default class DocumentationRouter extends CustomRouter {
  init() {
    const documentationController = new DocumentationController();
    this.get("/", ["ADMIN"], documentationController.getDocumentation);
    this.post("/", ["ADMIN"], documentationController.addDocumentation);
    this.delete(
      "/:dcode",
      ["ADMIN"],
      documentationController.deleteDocumentation
    );
  }
}
