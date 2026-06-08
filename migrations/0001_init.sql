-- =========================================
-- FULL DATABASE SCHEMA - FORM WORKFLOW SYSTEM
-- =========================================

-- USERS
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('superuser','admin','assessor','iqa','eqa')),
    stage TEXT CHECK (stage IN ('assess','iqa','eqa')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- STUDENTS
CREATE TABLE students (
    id TEXT PRIMARY KEY,
    nickname TEXT
);

-- FORM TEMPLATES
CREATE TABLE form_templates (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    structure JSONB NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT REFERENCES users(id)
);

-- FORM ENTRIES
CREATE TABLE form_entries (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL REFERENCES students(id),
    template_id TEXT NOT NULL REFERENCES form_templates(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT REFERENCES users(id),
    assessor_id TEXT REFERENCES users(id),
    iqa_id TEXT REFERENCES users(id),
    eqa_id TEXT REFERENCES users(id)
);

-- FORM STAGE ENTRIES
CREATE TABLE form_stage_entries (
    id TEXT PRIMARY KEY,
    form_entry_id TEXT NOT NULL REFERENCES form_entries(id) ON DELETE CASCADE,
    stage TEXT NOT NULL CHECK (stage IN ('assess','iqa','eqa')),
    data JSONB,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by TEXT REFERENCES users(id),
    UNIQUE(form_entry_id, stage)
);

-- FORM COMMENTS
CREATE TABLE form_comments (
    id TEXT PRIMARY KEY,
    form_entry_id TEXT NOT NULL REFERENCES form_entries(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT REFERENCES users(id)
);

-- =========================================
-- ROW LEVEL SECURITY (RLS)
-- =========================================

ALTER TABLE form_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_stage_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_comments ENABLE ROW LEVEL SECURITY;

-- FORM ENTRIES ACCESS
CREATE POLICY form_entries_select ON form_entries
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM users 
        WHERE id = current_setting('app.user_id') 
        AND role IN ('superuser','admin')
    )
    OR assessor_id = current_setting('app.user_id')
    OR iqa_id = current_setting('app.user_id')
    OR eqa_id = current_setting('app.user_id')
);

-- STAGE CONTROL
CREATE POLICY form_stage_entries_insert ON form_stage_entries
FOR INSERT
WITH CHECK (
    (
        stage = 'assess'
        AND updated_by = current_setting('app.user_id')
        AND EXISTS (
            SELECT 1 FROM form_entries fe
            WHERE fe.id = form_entry_id
            AND fe.assessor_id = current_setting('app.user_id')
        )
    )
    OR
    (
        stage = 'iqa'
        AND updated_by = current_setting('app.user_id')
        AND EXISTS (
            SELECT 1 FROM form_entries fe
            WHERE fe.id = form_entry_id
            AND fe.iqa_id = current_setting('app.user_id')
        )
    )
    OR
    (
        stage = 'eqa'
        AND updated_by = current_setting('app.user_id')
        AND EXISTS (
            SELECT 1 FROM form_entries fe
            WHERE fe.id = form_entry_id
            AND fe.eqa_id = current_setting('app.user_id')
        )
    )
);

-- COMMENTS INSERT
CREATE POLICY form_comments_insert ON form_comments
FOR INSERT
WITH CHECK (created_by = current_setting('app.user_id'));

-- COMMENTS SELECT
CREATE POLICY form_comments_select ON form_comments
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM form_entries fe
        WHERE fe.id = form_entry_id
        AND (
            fe.assessor_id = current_setting('app.user_id')
            OR fe.iqa_id = current_setting('app.user_id')
            OR fe.eqa_id = current_setting('app.user_id')
        )
    )
);
