const { title } = require("process");
const swaggerAutogen = require("swagger-autogen");

const doc = {
  info: {
    title: "Auth Service API",
    description: "API documentation for the Auth Service",
    version: "1.0.0",
  },
  host: `localhost:${process.env.AUTH_PORT || 6001}`,
  basePath: "/api",
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endPointsFiles = ["./routes/auth.router.ts"];

swaggerAutogen()(outputFile, endPointsFiles, doc);
