-- Add new question types for Learning Walks: ggaw (Gold/Green/Amber/White) and number
-- Since SQLite/D1 doesn't support ALTER TABLE for CHECK constraints, we recreate the table

-- Create new table with expanded question types
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
        'file_upload'
    )),
    options TEXT CHECK (options IS NULL OR json_valid(options)),
    has_text_entry INTEGER DEFAULT 0 CHECK (has_text_entry IN (0, 1)),
    text_entry_label TEXT,
    is_required INTEGER DEFAULT 0 CHECK (is_required IN (0, 1)),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Copy existing data
INSERT INTO lw_template_questions_new SELECT * FROM lw_template_questions;

-- Drop old table
DROP TABLE lw_template_questions;

-- Rename new table
ALTER TABLE lw_template_questions_new RENAME TO lw_template_questions;

-- Recreate index
CREATE INDEX idx_lw_template_questions ON lw_template_questions(template_id, sort_order);
