import express from "express";
const app = express();

app.get("/healthz", (req, res) => res.send("ok"));
app.get("/", (req, res) => res.send("Backend is working!"));

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`listening on ${port}`));
