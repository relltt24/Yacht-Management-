import express from "express";
import helmet from "helmet";
import cors from "cors";

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Middleware
app.use(express.json());

// Health check endpoint
app.get("/healthz", (req, res) => res.send("ok"));

// Root endpoint
app.get("/", (req, res) => res.send("Backend is working!"));

// 404 handler
app.use((req, res) => {
  res.status(404).send("Not Found");
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

const port = process.env.PORT || 8080;
const server = app.listen(port, () => console.log(`listening on ${port}`));

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
  });
});
