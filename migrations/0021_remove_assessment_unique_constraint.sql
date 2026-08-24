-- Migration 0021: Remove UNIQUE constraint on assessment_entries to allow retakes

-- 1. Create a new table without the UNIQUE constraint and without the old status check constraint
CREATE TABLE assessment_entries_new (
    id TEXT PRIMARY KEY,
    template_id TEXT NOT NULL
        REFERENCES assessment_templates(id),
    enrolment_id TEXT NOT NULL
        REFERENCES student_enrolments(id) ON DELETE CASCADE,
    learner_id TEXT NOT NULL,
    course_instance_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    score_earned INTEGER DEFAULT 0,
    max_score INTEGER DEFAULT 0,
    percentage INTEGER DEFAULT 0,
    answers_json TEXT,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Copy data
INSERT INTO assessment_entries_new SELECT * FROM assessment_entries;

-- 3. Drop old table
DROP TABLE assessment_entries;

-- 4. Rename new table
ALTER TABLE assessment_entries_new RENAME TO assessment_entries;

-- 5. Recreate indexes
CREATE INDEX idx_ae_enrolment ON assessment_entries(enrolment_id);
CREATE INDEX idx_ae_template ON assessment_entries(template_id);
CREATE INDEX idx_ae_status ON assessment_entries(status);
