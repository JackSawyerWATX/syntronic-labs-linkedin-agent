import express from "express";
import { generateLinkedInPost } from "../services/ai.service.js";

const router = express.Router();

router.post("/generate", async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({
        error: "A topic is required.",
      });
    }

    const content = await generateLinkedInPost(topic);

    res.json({
      status: "draft",
      topic,
      content,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Unable to generate LinkedIn post.",
    });
  }
});

export default router;