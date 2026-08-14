-- Migration 0013: Student Assessments & Progress Tracker (ILP/RARPA)
-- Branch: v2 | Database: esol-marking-db-v2

-- ============================================================
-- 1. Student Enrolments (Synced from LearnerTrack API)
-- ============================================================
CREATE TABLE IF NOT EXISTS student_enrolments (
    id TEXT PRIMARY KEY,
    learner_id TEXT NOT NULL,
    student_label TEXT NOT NULL DEFAULT '',
    course_code TEXT NOT NULL DEFAULT '',
    course_instance_id TEXT NOT NULL,
    course_title TEXT NOT NULL DEFAULT '',
    course_type_category TEXT,
    course_type_id TEXT,
    academic_year INTEGER DEFAULT 2025,
    learn_start_date TEXT,
    learn_plan_end_date TEXT,
    learn_act_end_date TEXT,
    comp_status TEXT,
    comp_status_label TEXT,
    outcome TEXT,
    outcome_label TEXT,
    out_grade TEXT,
    enrolment_path TEXT,
    delivery_mode TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(learner_id, course_instance_id)
);

CREATE INDEX IF NOT EXISTS idx_se_learner_id ON student_enrolments(learner_id);
CREATE INDEX IF NOT EXISTS idx_se_course_instance ON student_enrolments(course_instance_id);

-- ============================================================
-- 2. Assessment & Tracker Form Templates (Unified)
-- ============================================================
CREATE TABLE IF NOT EXISTS assessment_templates (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    template_type TEXT NOT NULL DEFAULT 'quiz'
        CHECK (template_type IN ('quiz', 'tracker')),
    category TEXT DEFAULT 'general',
    max_points INTEGER DEFAULT 0,
    pass_percentage INTEGER DEFAULT 70,
    is_active INTEGER NOT NULL DEFAULT 1
        CHECK (is_active IN (0, 1)),
    created_by TEXT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 3. Template Questions
-- ============================================================
CREATE TABLE IF NOT EXISTS assessment_template_questions (
    id TEXT PRIMARY KEY,
    template_id TEXT NOT NULL
        REFERENCES assessment_templates(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type TEXT NOT NULL DEFAULT 'text'
        CHECK (question_type IN (
            'single_choice', 'multiple_choice', 'dropdown',
            'text', 'textarea', 'date', 'rating', 'number', 'section'
        )),
    options TEXT,           -- JSON array of {label, value, points}
    points INTEGER DEFAULT 0,
    correct_answer TEXT,    -- value key for auto-grading
    has_text_entry INTEGER NOT NULL DEFAULT 0
        CHECK (has_text_entry IN (0, 1)),
    text_entry_label TEXT,
    is_required INTEGER NOT NULL DEFAULT 0
        CHECK (is_required IN (0, 1)),
    sort_order INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_atq_template ON assessment_template_questions(template_id);

-- ============================================================
-- 4. Completed Assessment Entries (Quiz submissions)
-- ============================================================
CREATE TABLE IF NOT EXISTS assessment_entries (
    id TEXT PRIMARY KEY,
    template_id TEXT NOT NULL
        REFERENCES assessment_templates(id),
    enrolment_id TEXT NOT NULL
        REFERENCES student_enrolments(id) ON DELETE CASCADE,
    learner_id TEXT NOT NULL,
    course_instance_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'completed')),
    score_earned INTEGER DEFAULT 0,
    max_score INTEGER DEFAULT 0,
    percentage INTEGER DEFAULT 0,
    answers_json TEXT,      -- JSON: {question_id: answer_value}
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(template_id, enrolment_id)
);

CREATE INDEX IF NOT EXISTS idx_ae_enrolment ON assessment_entries(enrolment_id);
CREATE INDEX IF NOT EXISTS idx_ae_template ON assessment_entries(template_id);
CREATE INDEX IF NOT EXISTS idx_ae_status ON assessment_entries(status);

-- ============================================================
-- 5. Student Progress Tracker / ILP (one record per enrolment)
-- ============================================================
CREATE TABLE IF NOT EXISTS student_trackers (
    id TEXT PRIMARY KEY,
    enrolment_id TEXT NOT NULL
        REFERENCES student_enrolments(id) ON DELETE CASCADE
        UNIQUE,
    learner_id TEXT NOT NULL,
    course_instance_id TEXT NOT NULL,

    -- Student Self-Entry
    tailored_purpose TEXT,
    smart_goals TEXT,
    tailored_outcomes TEXT,

    -- Initial Assessment & Diagnostic (Teacher)
    initial_assessment_level TEXT,
    initial_assessment_rag TEXT
        CHECK (initial_assessment_rag IN ('green', 'amber', 'red', NULL)),
    initial_assessment_notes TEXT,
    initial_assessment_date TEXT,
    initial_assessment_by TEXT REFERENCES users(id),

    -- Term 1 Review (Teacher)
    term1_grade TEXT,
    term1_rag TEXT CHECK (term1_rag IN ('green', 'amber', 'red', NULL)),
    term1_comments TEXT,
    term1_date TEXT,
    term1_by TEXT REFERENCES users(id),

    -- Term 2 Review (Teacher)
    term2_grade TEXT,
    term2_rag TEXT CHECK (term2_rag IN ('green', 'amber', 'red', NULL)),
    term2_comments TEXT,
    term2_date TEXT,
    term2_by TEXT REFERENCES users(id),

    -- Term 3 / Final Review (Teacher)
    term3_grade TEXT,
    term3_rag TEXT CHECK (term3_rag IN ('green', 'amber', 'red', NULL)),
    term3_comments TEXT,
    term3_date TEXT,
    term3_by TEXT REFERENCES users(id),

    -- Destination & Progression (Teacher)
    destination_type TEXT,
    destination_notes TEXT,
    destination_date TEXT,
    destination_by TEXT REFERENCES users(id),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_st_enrolment ON student_trackers(enrolment_id);
CREATE INDEX IF NOT EXISTS idx_st_learner ON student_trackers(learner_id);
CREATE INDEX IF NOT EXISTS idx_st_course ON student_trackers(course_instance_id);

-- ============================================================
-- 6. Threaded Comments (Assessments & Tracker entries)
-- ============================================================
CREATE TABLE IF NOT EXISTS assessment_comments (
    id TEXT PRIMARY KEY,
    entity_type TEXT NOT NULL
        CHECK (entity_type IN ('assessment_entry', 'tracker')),
    entity_id TEXT NOT NULL,
    author_id TEXT REFERENCES users(id),
    author_email TEXT NOT NULL DEFAULT '',
    author_name TEXT NOT NULL DEFAULT '',
    author_role TEXT NOT NULL DEFAULT 'student',
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ac_entity ON assessment_comments(entity_type, entity_id);
