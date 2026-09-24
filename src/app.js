import express from "express";
import cors from "cors";
import postsRouter from "./routes/posts.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    service: "Syntronic Labs LinkedIn Agent",
    status: "running",
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/posts", postsRouter);

export default app;