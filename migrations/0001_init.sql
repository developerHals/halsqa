CREATE TABLE users (id TEXT PRIMARY KEY, email TEXT, role TEXT);
CREATE TABLE students (id TEXT PRIMARY KEY, nickname TEXT);
CREATE TABLE form_templates (id TEXT PRIMARY KEY, title TEXT, structure JSON);
CREATE TABLE form_entries (id TEXT PRIMARY KEY, student_id TEXT, template_id TEXT, data JSON, created_at DATETIME);
