CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('superuser','admin','assessor','iqa','eqa')),
    stage TEXT CHECK (stage IN ('assess','iqa','eqa')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE students (
    id TEXT PRIMARY KEY,
    nickname TEXT
);

CREATE TABLE form_templates (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    structure TEXT NOT NULL CHECK (json_valid(structure)),
    is_active INTEGER DEFAULT 1 CHECK (is_active IN (0, 1)),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT REFERENCES users(id)
);

CREATE TABLE form_entries (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL REFERENCES students(id),
    template_id TEXT NOT NULL REFERENCES form_templates(gggg+),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT REFERENCES users(id),
    assessor_id TEXT REFERENCES users(id),
    iqa_id TEXT REFERENCES users(id),
    eqa_id TEXT REFERENCES users(id)
);

CREATE TABLE form_stage_entries (
    id TEXT PRIMARY KEY,
    form_entry_id TEXT NOT NULL REFERENCES form_entries(id) ON DELETE CASCADE,
    stage TEXT NOT NULL CHECK (stage IN ('assess','iqa','eqa')),
    data TEXT CHECK (data IS NULL OR json_valid(data)),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by TEXT REFERENCES users(id),
    UNIQUE(form_entry_id, stage)
);

CREATE TABLE form_comments (
    id TEXT PRIMARY KEY,
    form_entry_id TEXT NOT NULL REFERENCES form_entries(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT REFERENCES users(id)
);
