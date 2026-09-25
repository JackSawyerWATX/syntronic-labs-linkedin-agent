import express from "express";

import {
  generateLinkedInPost,
} from "../services/ai.service.js";

import {
  postAlreadyExists,
} from "../services/duplicate.service.js";

import {
  savePost,
  getPosts,
  getPostById,
  getRecentPosts,
  getRejectedPostById,
  approvePost,
  rejectPost,
} from "../db/posts.repository.js";

const router = express.Router();

router.post("/generate", async (req, res) => {
  try {
    const { topic, category } = req.body;

    if (!topic) {
      return res.status(400).json({
        error: "A topic is required.",
      });
    }

    const recentPosts = getRecentPosts(10);

    const content = await generateLinkedInPost(
      topic,
      category,
      recentPosts
    );

    if (postAlreadyExists(content)) {
      return res.status(409).json({
        error:
          "Generated content duplicates an existing post.",
      });
    }

    const post = savePost({
      topic,
      category,
      content,
    });

    res.status(201).json(post);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Unable to generate LinkedIn post.",
    });
  }
});

router.post("/test-draft", (req, res) => {
  try {
    const {
      topic = "Test topic",
      category = "Testing",
      content,
    } = req.body;

    if (!content) {
      return res.status(400).json({
        error: "Content is required.",
      });
    }

    if (postAlreadyExists(content)) {
      return res.status(409).json({
        error: "Test content duplicates an existing post.",
      });
    }

    const post = savePost({
      topic,
      category,
      content,
    });

    res.status(201).json(post);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Unable to create test draft.",
    });
  }
});

router.get("/", (req, res) => {
  const posts = getPosts();

  res.json(posts);
});

router.post("/:id/approve", (req, res) => {
  try {
    const post = approvePost(req.params.id);

    if (!post) {
      return res.status(409).json({
        error:
          "Post does not exist or is not pending.",
      });
    }

    res.json(post);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Unable to approve post.",
    });
  }
});

router.post("/:id/reject", (req, res) => {
  try {
    const post = rejectPost(req.params.id);

    if (!post) {
      return res.status(409).json({
        error:
          "Post does not exist or is not pending.",
      });
    }

    res.json(post);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Unable to reject post.",
    });
  }
});

router.post("/:id/regenerate", async (req, res) => {
  try {
    const rejectedPost = getRejectedPostById(req.params.id);

    if (!rejectedPost) {
      return res.status(409).json({
        error: "Only rejected posts can be regenerated.",
      });
    }

    const recentPosts = getRecentPosts(10);

    const content = await generateLinkedInPost(
      rejectedPost.topic,
      rejectedPost.category,
      recentPosts
    );

    if (postAlreadyExists(content)) {
      return res.status(409).json({
        error:
          "Regenerated content duplicates an existing post.",
      });
    }

    const newPost = savePost({
      topic: rejectedPost.topic,
      category: rejectedPost.category,
      content,
    });

    res.status(201).json({
      regenerated_from: rejectedPost.id,
      post: newPost,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Unable to regenerate LinkedIn post.",
    });
  }
});

router.get("/:id", (req, res) => {
  const post = getPostById(req.params.id);

  if (!post) {
    return res.status(404).json({
      error: "Post not found.",
    });
  }

  res.json(post);
});

export default router;