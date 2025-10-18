import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { errorMiddleware } from "../../../packages/error-handler/error-middleware";
import router from "./routes/auth.router";
import swaggerUi from "swagger-ui-express"

const swaggerDocument = require("./swagger-output.json");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    allowedHeaders: ["Authorization", "Content-Type"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send({ message: "Hello API" });
});

// swagger setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.get("/api-docs", (req, res) => {
  res.json(swaggerDocument); // Display the JSON document at /api-doc
});

// Routes
app.use("/api", router);

// Error Middleware
app.use(errorMiddleware);

const port = process.env.AUTH_PORT || 6001;

const server = app.listen(port, () => {
  console.log(`Auth Service is running at http://localhost:${port}/api`);
  console.log(`Swagger Docs available at http://localhost:${port}/api-docs`);
});

server.on("error", (err) => {
  console.log("Server Error: ", err);
});
