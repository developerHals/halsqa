-- Full Database Schema Dump
-- Generated from D1 database: esol-marking-db
-- Use this to recreate the entire database structure

-- =====================================================
-- USERS & AUTHENTICATION
-- =====================================================

CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('superuser','admin','assessor','iqa','eqa')),
    stage TEXT CHECK (stage IN ('assess','iqa','eqa')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- STUDENTS
-- =====================================================

CREATE TABLE students (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    stage TEXT NOT NULL CHECK (stage IN ('assess','iqa','eqa')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ASSESSMENT FORM TEMPLATES (Original Forms)
-- =====================================================

CREATE TABLE form_templates (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('assessor','iqa','eqa')),
    stage TEXT NOT NULL CHECK (stage IN ('assess','iqa','eqa')),
    structure TEXT NOT NULL CHECK (json_valid(structure)),
    created_by TEXT REFERENCES users(id),
    is_active INTEGER DEFAULT 1 CHECK (is_active IN (0, 1)),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE template_questions (
    id TEXT PRIMARY KEY,
    template_id TEXT NOT NULL REFERENCES form_templates(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type TEXT NOT NULL CHECK (question_type IN (
        'single_choice',
        'multiple_choice',
        'dropdown',
        'text',
        'textarea',
        'date',
        'currency',
        'ranking',
        'likert',
        'yes_no',
        'file_upload'
    )),
    options TEXT CHECK (options IS NULL OR json_valid(options)),
    has_text_entry INTEGER DEFAULT 0 CHECK (has_text_entry IN (0, 1)),
    text_entry_label TEXT,
    is_required INTEGER DEFAULT 0 CHECK (is_required IN (0, 1)),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    visible_to_assessor INTEGER DEFAULT 1 CHECK (visible_to_assessor IN (0, 1)),
    visible_to_iqa INTEGER DEFAULT 1 CHECK (visible_to_iqa IN (0, 1)),
    visible_to_eqa INTEGER DEFAULT 1 CHECK (visible_to_eqa IN (0, 1))
);

CREATE TABLE template_comment_categories (
    id TEXT PRIMARY KEY,
    template_id TEXT NOT NULL REFERENCES form_templates(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ASSESSMENT FORM ENTRIES
-- =====================================================

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

CREATE TABLE form_entry_headers (
    id TEXT PRIMARY KEY,
    entry_id TEXT NOT NULL REFERENCES form_entries(id) ON DELETE CASCADE,
    course_name TEXT,
    course_code TEXT,
    teacher_name TEXT,
    observer_name TEXT,
    teaching_date TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

CREATE TABLE form_attachments (
    id TEXT PRIMARY KEY,
    entry_id TEXT NOT NULL REFERENCES form_entries(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    uploaded_by TEXT REFERENCES users(id),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- LEARNING WALKS TEMPLATES
-- =====================================================

CREATE TABLE lw_templates (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    is_active INTEGER DEFAULT 1 CHECK (is_active IN (0, 1)),
    created_by TEXT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lw_template_questions (
    id TEXT PRIMARY KEY,
    template_id TEXT NOT NULL REFERENCES lw_templates(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type TEXT NOT NULL CHECK (question_type IN (
        'single_choice',
        'multiple_choice',
        'dropdown',
        'rag',
        'ggaw',
        'text',
        'textarea',
        'date',
        'rating',
        'ranking',
        'likert',
        'yes_no',
        'number',
        'file_upload'
    )),
    options TEXT CHECK (options IS NULL OR json_valid(options)),
    has_text_entry INTEGER DEFAULT 0 CHECK (has_text_entry IN (0, 1)),
    text_entry_label TEXT,
    is_required INTEGER DEFAULT 0 CHECK (is_required IN (0, 1)),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- LEARNING WALKS ENTRIES
-- =====================================================

CREATE TABLE lw_entries (
    id TEXT PRIMARY KEY,
    template_id TEXT NOT NULL REFERENCES lw_templates(id),
    -- Fixed header fields
    course_id TEXT NOT NULL,
    course_name TEXT NOT NULL,
    assessor_name TEXT NOT NULL,
    iqa_name TEXT NOT NULL,
    planned_date TEXT NOT NULL,
    due_date TEXT,
    -- Allocation
    allocated_iqa_id TEXT REFERENCES users(id),
    allocated_assessor_id TEXT REFERENCES users(id),
    -- Status
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending',
        'iqa_completed',
        'assessor_responded',
        'complete'
    )),
    -- Audit
    created_by TEXT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    iqa_completed_at TIMESTAMP,
    assessor_responded_at TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE TABLE lw_answers (
    id TEXT PRIMARY KEY,
    entry_id TEXT NOT NULL REFERENCES lw_entries(id) ON DELETE CASCADE,
    question_id TEXT NOT NULL REFERENCES lw_template_questions(id) ON DELETE CASCADE,
    answer TEXT,
    updated_by TEXT REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(entry_id, question_id)
);

CREATE TABLE lw_comments (
    id TEXT PRIMARY KEY,
    entry_id TEXT NOT NULL REFERENCES lw_entries(id) ON DELETE CASCADE,
    author_id TEXT REFERENCES users(id),
    author_role TEXT NOT NULL CHECK (author_role IN ('iqa','assessor','admin','superuser')),
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lw_notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    entry_id TEXT REFERENCES lw_entries(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read INTEGER DEFAULT 0 CHECK (is_read IN (0, 1)),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- INDEXES
-- =====================================================

-- Form templates indexes
CREATE INDEX idx_template_questions ON template_questions(template_id, sort_order);

-- Form entries indexes
CREATE INDEX idx_form_entries_student ON form_entries(student_id);
CREATE INDEX idx_form_entries_template ON form_entries(template_id);

-- Learning walks indexes
CREATE INDEX idx_lw_template_questions ON lw_template_questions(template_id, sort_order);
CREATE INDEX idx_lw_entries_iqa ON lw_entries(allocated_iqa_id);
CREATE INDEX idx_lw_entries_assessor ON lw_entries(allocated_assessor_id);
CREATE INDEX idx_lw_entries_status ON lw_entries(status);
CREATE INDEX idx_lw_entries_due ON lw_entries(due_date);
CREATE INDEX idx_lw_answers_entry ON lw_answers(entry_id);
CREATE INDEX idx_lw_comments_entry ON lw_comments(entry_id);

-- =====================================================
-- NOTES
-- =====================================================
-- 
-- To recreate this database on a new D1 instance:
-- 1. Create new D1 database: npx wrangler d1 create new-db-name
-- 2. Run this SQL file: npx wrangler d1 execute new-db-name --remote --file=./migrations/schema_full_dump.sql
-- 
-- OR use migrations individually:
-- npx wrangler d1 migrations apply new-db-name --remote
--
-- Foreign keys are enforced in SQLite/D1
-- All boolean fields use INTEGER 0/1 (not true/false)
-- JSON fields use TEXT with CHECK (json_valid(column))
