-- Migration 0016: Add 'student' and 'it_admin' roles to users table check constraint
PRAGMA foreign_keys = OFF;
PRAGMA defer_foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users_new (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('superuser','admin','assessor','iqa','eqa','assessor_iqa','student','it_admin')),
  stage TEXT CHECK(stage IN ('assess','iqa','eqa')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT INTO users_new SELECT id, email, role, stage, created_at FROM users;

DROP TABLE users;

ALTER TABLE users_new RENAME TO users;

PRAGMA foreign_keys = ON;
