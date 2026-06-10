-- Learning Walk templates (separate from assessment form_templates)
CREATE TABLE lw_templates (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    is_active INTEGER DEFAULT 1 CHECK (is_active IN (0, 1)),
    created_by TEXT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Questions for learning walk templates (same types as assessment templates)
CREATE TABLE lw_template_questions (
    id TEXT PRIMARY KEY,
    template_id TEXT NOT NULL REFERENCES lw_templates(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type TEXT NOT NULL CHECK (question_type IN (
        'single_choice',
        'multiple_choice',
        'dropdown',
        'rag',
        'text',
        'textarea',
        'date',
        'rating',
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_lw_template_questions ON lw_template_questions(template_id, sort_order);

-- Learning walk entries (created and allocated by admin/superuser)
CREATE TABLE lw_entries (
    id TEXT PRIMARY KEY,
    template_id TEXT NOT NULL REFERENCES lw_templates(id),
    -- Fixed header fields (prefilled by admin at creation)
    course_id TEXT NOT NULL,
    course_name TEXT NOT NULL,
    assessor_name TEXT NOT NULL,
    iqa_name TEXT NOT NULL,
    planned_date TEXT NOT NULL,     -- ISO date string YYYY-MM-DD
    due_date TEXT,                  -- Optional hard deadline
    -- Allocation
    allocated_iqa_id TEXT REFERENCES users(id),   -- IQA responsible for the observation
    allocated_assessor_id TEXT REFERENCES users(id), -- Assessor being observed
    -- Status
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending',           -- Created, waiting for IQA to complete
        'iqa_completed',     -- IQA has submitted the checklist + feedback
        'assessor_responded',-- Assessor has added their response comment
        'complete'           -- Marked complete by admin/superuser
    )),
    -- Audit
    created_by TEXT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    iqa_completed_at TIMESTAMP,
    assessor_responded_at TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE INDEX idx_lw_entries_iqa ON lw_entries(allocated_iqa_id);
CREATE INDEX idx_lw_entries_assessor ON lw_entries(allocated_assessor_id);
CREATE INDEX idx_lw_entries_status ON lw_entries(status);
CREATE INDEX idx_lw_entries_due ON lw_entries(due_date);

-- Answers saved by IQA when filling the checklist
CREATE TABLE lw_answers (
    id TEXT PRIMARY KEY,
    entry_id TEXT NOT NULL REFERENCES lw_entries(id) ON DELETE CASCADE,
    question_id TEXT NOT NULL REFERENCES lw_template_questions(id) ON DELETE CASCADE,
    answer TEXT,
    updated_by TEXT REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(entry_id, question_id)
);

CREATE INDEX idx_lw_answers_entry ON lw_answers(entry_id);

-- Comments for learning walks (permanent, append-only)
-- author_role distinguishes IQA feedback from assessor responses
CREATE TABLE lw_comments (
    id TEXT PRIMARY KEY,
    entry_id TEXT NOT NULL REFERENCES lw_entries(id) ON DELETE CASCADE,
    author_id TEXT REFERENCES users(id),
    author_role TEXT NOT NULL CHECK (author_role IN ('iqa','assessor','admin','superuser')),
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_lw_comments_entry ON lw_comments(entry_id);

-- Notifications table (for bell icon)
CREATE TABLE lw_notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    entry_id TEXT REFERENCES lw_entries(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read INTEGER DEFAULT 0 CHECK (is_read IN (0, 1)),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_lw_notifications_user ON lw_notifications(user_id, is_read);
