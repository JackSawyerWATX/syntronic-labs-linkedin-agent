import crypto from "crypto";
import db from "../db/database.js";

export function createContentHash(content) {
  return crypto
    .createHash("sha256")
    .update(content.trim().toLowerCase())
    .digest("hex");
}

export function postAlreadyExists(content) {
  const hash = createContentHash(content);

  const existingPost = db
    .prepare(`
      SELECT id
      FROM linkedin_posts
      WHERE content_hash = ?
    `)
    .get(hash);

  return Boolean(existingPost);
}