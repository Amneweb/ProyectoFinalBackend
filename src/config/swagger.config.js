import swaggerJsdoc from "swagger-jsdoc";
import __dirname from "../../dirname.js";

const options = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Online shop de Windward Battery Store",
      description:
        "Ecommerce basado en nodejs y express, documentado con Swagger",
    },
  },

  apis: [`${__dirname}/public/docs/**/*.yaml`],
};
console.log("ruta de swagger ", options.apis);

const swaggerSpecs = swaggerJsdoc(options);
export default swaggerSpecs;
