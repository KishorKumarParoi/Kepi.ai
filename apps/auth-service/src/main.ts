import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import router from "./routes/auth.router";
import swaggerUi from "swagger-ui-express";
import { errorMiddleware } from "../../../packages/error-handler/error-middleware";

// Load .env from workspace root
dotenv.config({
  path: path.join(process.env.NX_WORKSPACE_ROOT ?? process.cwd(), ".env"),
});

// Load swagger document with proper path resolution
const swaggerDocument = require(path.join(__dirname, "swagger-output.json"));

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
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use("/api", router);

// 404 handler (must be before error middleware)
app.use((req, res, next) => {
  res.status(404).json({
    error: "Route not found",
    path: req.path,
  });
});

// Error Middleware (must be last)
app.use(errorMiddleware);

const port = process.env.AUTH_PORT || 6001;

const server = app.listen(port, () => {
  console.log(`Auth Service is running at http://localhost:${port}/api`);
  console.log(`Swagger Docs available at http://localhost:${port}/api-docs`);
});

server.on("error", (err) => {
  console.error("Server Error: ", err);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});
