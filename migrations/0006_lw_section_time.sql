-- Add section and time question types to Learning Walk template questions
-- SQLite/D1 does not support ALTER COLUMN CHECK constraints, so we recreate the table

CREATE TABLE lw_template_questions_new (
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
        'file_upload',
        'section',
        'time'
    )),
    options TEXT CHECK (options IS NULL OR json_valid(options)),
    has_text_entry INTEGER DEFAULT 0 CHECK (has_text_entry IN (0, 1)),
    text_entry_label TEXT,
    is_required INTEGER DEFAULT 0 CHECK (is_required IN (0, 1)),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO lw_template_questions_new SELECT * FROM lw_template_questions;
DROP TABLE lw_template_questions;
ALTER TABLE lw_template_questions_new RENAME TO lw_template_questions;
CREATE INDEX idx_lw_template_questions ON lw_template_questions(template_id, sort_order);
