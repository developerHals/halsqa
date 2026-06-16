-- Migration 0007: Add 'assessor_iqa' role to users table
-- SQLite does not support ALTER COLUMN, so we recreate the table with the updated CHECK constraint.
-- PRAGMA foreign_keys = OFF allows the rename without FK constraint failures.

PRAGMA foreign_keys = OFF;

CREATE TABLE IF NOT EXISTS users_new (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('superuser','admin','assessor','iqa','eqa','assessor_iqa')),
  stage TEXT CHECK(stage IN ('assess','iqa','eqa')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT INTO users_new SELECT id, email, role, stage, created_at FROM users;

DROP TABLE users;

ALTER TABLE users_new RENAME TO users;

PRAGMA foreign_keys = ON;
