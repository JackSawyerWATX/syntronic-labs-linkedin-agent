import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const databasePath = path.resolve(
  __dirname,
  "../../data/linkedin-agent.db"
);

const db = new Database(databasePath);

db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS linkedin_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    topic TEXT NOT NULL,
    category TEXT,

    content TEXT NOT NULL,
    content_hash TEXT NOT NULL UNIQUE,

    status TEXT NOT NULL DEFAULT 'pending',

    linkedin_post_id TEXT,

    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    approved_at TEXT,
    published_at TEXT,

    CHECK (
      status IN (
        'pending',
        'approved',
        'rejected',
        'published',
        'failed'
      )
    )
  );
`);

export default db;