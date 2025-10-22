import { onRequest } from "firebase-functions/v2/https";
import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello from Firebase Functions!");
});

app.get("/healthz", (req, res) => {
  res.send("ok");
});

export const api = onRequest(app);