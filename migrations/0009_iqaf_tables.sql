-- IQA Forms tables: fully independent duplicate of lw_* structure
-- Purpose: assessor fills form, IQA reviews, EQA signs off

CREATE TABLE iqaf_templates (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    is_active INTEGER DEFAULT 1 CHECK (is_active IN (0, 1)),
    created_by TEXT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE iqaf_template_questions (
    id TEXT PRIMARY KEY,
    template_id TEXT NOT NULL REFERENCES iqaf_templates(id) ON DELETE CASCADE,
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
        'file_upload',
        'section',
        'time'
    )),
    options TEXT CHECK (options IS NULL OR json_valid(options)),
    has_text_entry INTEGER DEFAULT 0 CHECK (has_text_entry IN (0, 1)),
    text_entry_label TEXT,
    is_required INTEGER DEFAULT 0 CHECK (is_required IN (0, 1)),
    sort_order INTEGER DEFAULT 0
);

CREATE INDEX idx_iqaf_template_questions ON iqaf_template_questions(template_id, sort_order);

-- IQAF entries: created by admin/superuser, allocated to assessor + IQA (+ optional EQA)
CREATE TABLE iqaf_entries (
    id TEXT PRIMARY KEY,
    template_id TEXT NOT NULL REFERENCES iqaf_templates(id),
    -- Fixed header fields
    course_id TEXT NOT NULL,
    course_name TEXT NOT NULL,
    assessor_name TEXT NOT NULL,
    iqa_name TEXT NOT NULL,
    planned_date TEXT NOT NULL,
    due_date TEXT,
    -- Allocation
    allocated_assessor_id TEXT REFERENCES users(id),
    allocated_iqa_id TEXT REFERENCES users(id),
    allocated_eqa_id TEXT REFERENCES users(id),
    -- Status flow: pending -> assessor_submitted -> iqa_reviewed -> eqa_signed -> complete
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending',              -- Created, waiting for assessor
        'assessor_submitted',   -- Assessor has submitted their responses
        'iqa_reviewed',         -- IQA has reviewed and added feedback
        'eqa_signed',           -- EQA has signed off
        'complete'              -- Marked complete by admin/superuser
    )),
    -- Audit
    created_by TEXT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assessor_submitted_at TIMESTAMP,
    iqa_reviewed_at TIMESTAMP,
    eqa_signed_at TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE INDEX idx_iqaf_entries_assessor ON iqaf_entries(allocated_assessor_id);
CREATE INDEX idx_iqaf_entries_iqa ON iqaf_entries(allocated_iqa_id);
CREATE INDEX idx_iqaf_entries_eqa ON iqaf_entries(allocated_eqa_id);
CREATE INDEX idx_iqaf_entries_status ON iqaf_entries(status);
CREATE INDEX idx_iqaf_entries_due ON iqaf_entries(due_date);

-- Answers saved per-entry per-question
CREATE TABLE iqaf_answers (
    id TEXT PRIMARY KEY,
    entry_id TEXT NOT NULL REFERENCES iqaf_entries(id) ON DELETE CASCADE,
    question_id TEXT NOT NULL REFERENCES iqaf_template_questions(id) ON DELETE CASCADE,
    answer TEXT,
    answered_by TEXT REFERENCES users(id),
    answered_by_role TEXT CHECK (answered_by_role IN ('assessor','iqa','eqa','admin','superuser')),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(entry_id, question_id)
);

CREATE INDEX idx_iqaf_answers_entry ON iqaf_answers(entry_id);

-- Comments (permanent, append-only paper trail)
CREATE TABLE iqaf_comments (
    id TEXT PRIMARY KEY,
    entry_id TEXT NOT NULL REFERENCES iqaf_entries(id) ON DELETE CASCADE,
    author_id TEXT REFERENCES users(id),
    author_role TEXT NOT NULL CHECK (author_role IN ('assessor','iqa','eqa','admin','superuser')),
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_iqaf_comments_entry ON iqaf_comments(entry_id);

-- Notifications
CREATE TABLE iqaf_notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    entry_id TEXT REFERENCES iqaf_entries(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read INTEGER DEFAULT 0 CHECK (is_read IN (0, 1)),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_iqaf_notifications_user ON iqaf_notifications(user_id, is_read);
