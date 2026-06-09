-- Template questions for modular form builder
CREATE TABLE template_questions (
    id TEXT PRIMARY KEY,
    template_id TEXT NOT NULL REFERENCES form_templates(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type TEXT NOT NULL CHECK (question_type IN (
        'single_choice',      -- Radio buttons (one answer)
        'multiple_choice',    -- Checkboxes (multiple answers)
        'dropdown',           -- Select dropdown
        'text',               -- Text input
        'textarea',           -- Multi-line text
        'date',               -- Date picker
        'currency',           -- Currency amount
        'ranking',            -- Rank items in order
        'likert',             -- Likert scale (agree/disagree)
        'yes_no',             -- Yes/No toggle
        'file_upload'         -- File attachment
    )),
    options TEXT CHECK (options IS NULL OR json_valid(options)), -- JSON array for choices
    has_text_entry INTEGER DEFAULT 0 CHECK (has_text_entry IN (0, 1)), -- Show text field below
    text_entry_label TEXT, -- Label for the text entry field
    is_required INTEGER DEFAULT 0 CHECK (is_required IN (0, 1)),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Role visibility: which roles can see/answer this question
    visible_to_assessor INTEGER DEFAULT 1 CHECK (visible_to_assessor IN (0, 1)),
    visible_to_iqa INTEGER DEFAULT 1 CHECK (visible_to_iqa IN (0, 1)),
    visible_to_eqa INTEGER DEFAULT 1 CHECK (visible_to_eqa IN (0, 1))
);

CREATE INDEX idx_template_questions_template ON template_questions(template_id);
CREATE INDEX idx_template_questions_sort ON template_questions(template_id, sort_order);

-- Comment categories defined per template
CREATE TABLE template_comment_categories (
    id TEXT PRIMARY KEY,
    template_id TEXT NOT NULL REFERENCES form_templates(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_comment_categories_template ON template_comment_categories(template_id);

-- Update form_comments to support categories
ALTER TABLE form_comments ADD COLUMN category_id TEXT REFERENCES template_comment_categories(id);
ALTER TABLE form_comments ADD COLUMN is_pinned INTEGER DEFAULT 0 CHECK (is_pinned IN (0, 1));

-- Form entry header data (immutable after creation)
CREATE TABLE form_entry_headers (
    id TEXT PRIMARY KEY,
    form_entry_id TEXT NOT NULL REFERENCES form_entries(id) ON DELETE CASCADE UNIQUE,
    course_id TEXT NOT NULL,
    qualification_aim TEXT NOT NULL, -- UK qualification code
    course_name TEXT NOT NULL,
    -- Assessor info
    assessor_id TEXT REFERENCES users(id),
    assessor_date TIMESTAMP,
    -- IQA info
    iqa_id TEXT REFERENCES users(id),
    iqa_date TIMESTAMP,
    -- EQA info
    eqa_id TEXT,
    eqa_name TEXT, -- Free text since EQA uses temporary MS account
    eqa_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_entry_headers_course ON form_entry_headers(course_id);
CREATE INDEX idx_entry_headers_qual ON form_entry_headers(qualification_aim);

-- File attachments for forms (stored in R2, reference in D1)
CREATE TABLE form_attachments (
    id TEXT PRIMARY KEY,
    form_entry_id TEXT NOT NULL REFERENCES form_entries(id) ON DELETE CASCADE,
    uploaded_by TEXT REFERENCES users(id),
    file_name TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    content_type TEXT,
    r2_key TEXT NOT NULL, -- Reference to R2 object
    r2_bucket TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_attachments_entry ON form_attachments(form_entry_id);

-- Track stage completion and agreement
ALTER TABLE form_stage_entries ADD COLUMN agreed_with_previous INTEGER DEFAULT 0 CHECK (agreed_with_previous IN (0, 1));
ALTER TABLE form_stage_entries ADD COLUMN marked_complete_at TIMESTAMP;
ALTER TABLE form_stage_entries ADD COLUMN marked_complete_by TEXT REFERENCES users(id);

-- Add completed flag to form_entries
ALTER TABLE form_entries ADD COLUMN is_finalized INTEGER DEFAULT 0 CHECK (is_finalized IN (0, 1));
