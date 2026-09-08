import db from "./database.js";
import { createContentHash } from "../services/duplicate.service.js";

export function savePost({
  topic,
  category = null,
  content,
}) {
  const contentHash = createContentHash(content);

  const statement = db.prepare(`
    INSERT INTO linkedin_posts (
      topic,
      category,
      content,
      content_hash,
      status
    )
    VALUES (?, ?, ?, ?, 'pending')
  `);

  const result = statement.run(
    topic,
    category,
    content,
    contentHash
  );

  return getPostById(result.lastInsertRowid);
}

export function getPostById(id) {
  return db
    .prepare(`
      SELECT *
      FROM linkedin_posts
      WHERE id = ?
    `)
    .get(id);
}

export function getPosts() {
  return db
    .prepare(`
      SELECT *
      FROM linkedin_posts
      ORDER BY created_at DESC
    `)
    .all();
}

export function approvePost(id) {
  const statement = db.prepare(`
    UPDATE linkedin_posts
    SET
      status = 'approved',
      approved_at = CURRENT_TIMESTAMP
    WHERE id = ?
      AND status = 'pending'
  `);

  const result = statement.run(id);

  if (result.changes === 0) {
    return null;
  }

  return getPostById(id);
}

export function rejectPost(id) {
  const statement = db.prepare(`
    UPDATE linkedin_posts
    SET
      status = 'rejected',
      approved_at = NULL
    WHERE id = ?
      AND status = 'pending'
  `);

  const result = statement.run(id);

  if (result.changes === 0) {
    return null;
  }

  return getPostById(id);
}