import express from "express";

const app = express();

// Health check endpoint for Firebase App Hosting
app.get("/healthz", (req, res) => res.send("ok"));

// Root endpoint
app.get("/", (req, res) => res.send("Backend is working!"));

// API endpoints
app.get("/api/status", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`listening on ${port}`));

export default app;
