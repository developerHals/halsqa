PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE IF NOT EXISTS "d1_migrations"(
		id         INTEGER PRIMARY KEY AUTOINCREMENT,
		name       TEXT UNIQUE,
		applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(1,'0001_init.sql','2026-08-14 11:18:39');
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(2,'0002_workflow_fields.sql','2026-08-14 11:18:40');
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(3,'0003_modular_forms.sql','2026-08-14 11:18:41');
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(4,'0004_learning_walks.sql','2026-08-14 11:18:42');
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(5,'0005_lw_question_types.sql','2026-08-14 11:18:42');
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(6,'0006_lw_section_time.sql','2026-08-14 11:18:43');
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(7,'0007_assessor_iqa_role.sql','2026-08-14 11:18:44');
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(8,'0008_fix_question_types.sql','2026-08-14 11:18:57');
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(9,'0009_iqaf_tables.sql','2026-08-14 11:18:58');
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(10,'0010_academic_year.sql','2026-08-14 11:18:59');
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(11,'0011_quality_calendar.sql','2026-08-14 11:18:59');
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(12,'0012_quality_calendar_created_by.sql','2026-08-14 11:19:00');
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
    template_id TEXT NOT NULL REFERENCES form_templates(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT REFERENCES users(id),
    assessor_id TEXT REFERENCES users(id),
    iqa_id TEXT REFERENCES users(id),
    eqa_id TEXT REFERENCES users(id)
, status TEXT DEFAULT 'assessment' CHECK (status IN ('assessment','iqa','eqa','complete')), course_code TEXT, qualification TEXT, teacher TEXT, completed_at TIMESTAMP, completed_by TEXT REFERENCES users(id), is_finalized INTEGER DEFAULT 0 CHECK (is_finalized IN (0, 1)));
CREATE TABLE form_stage_entries (
    id TEXT PRIMARY KEY,
    form_entry_id TEXT NOT NULL REFERENCES form_entries(id) ON DELETE CASCADE,
    stage TEXT NOT NULL CHECK (stage IN ('assess','iqa','eqa')),
    data TEXT CHECK (data IS NULL OR json_valid(data)),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by TEXT REFERENCES users(id), agreed_with_previous INTEGER DEFAULT 0 CHECK (agreed_with_previous IN (0, 1)), marked_complete_at TIMESTAMP, marked_complete_by TEXT REFERENCES users(id),
    UNIQUE(form_entry_id, stage)
);
CREATE TABLE form_comments (
    id TEXT PRIMARY KEY,
    form_entry_id TEXT NOT NULL REFERENCES form_entries(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT REFERENCES users(id)
, category_id TEXT REFERENCES template_comment_categories(id), is_pinned INTEGER DEFAULT 0 CHECK (is_pinned IN (0, 1)));
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
CREATE TABLE form_entry_headers (
    id TEXT PRIMARY KEY,
    form_entry_id TEXT NOT NULL REFERENCES form_entries(id) ON DELETE CASCADE UNIQUE,
    course_id TEXT NOT NULL,
    qualification_aim TEXT NOT NULL, 
    course_name TEXT NOT NULL,
    
    assessor_id TEXT REFERENCES users(id),
    assessor_date TIMESTAMP,
    
    iqa_id TEXT REFERENCES users(id),
    iqa_date TIMESTAMP,
    
    eqa_id TEXT,
    eqa_name TEXT, 
    eqa_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE form_attachments (
    id TEXT PRIMARY KEY,
    form_entry_id TEXT NOT NULL REFERENCES form_entries(id) ON DELETE CASCADE,
    uploaded_by TEXT REFERENCES users(id),
    file_name TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    content_type TEXT,
    r2_key TEXT NOT NULL, 
    r2_bucket TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE lw_templates (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    is_active INTEGER DEFAULT 1 CHECK (is_active IN (0, 1)),
    created_by TEXT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "lw_templates" ("id","title","description","is_active","created_by","created_at") VALUES('lw-tmpl-1','ESOL Classroom Observation & Quality Walk','Standard classroom observation template evaluating teaching methodology, learner engagement, and progress tracking.',1,'u-admin-1','2026-08-14 11:22:34');
CREATE TABLE lw_entries (
    id TEXT PRIMARY KEY,
    template_id TEXT NOT NULL REFERENCES lw_templates(id),
    
    course_id TEXT NOT NULL,
    course_name TEXT NOT NULL,
    assessor_name TEXT NOT NULL,
    iqa_name TEXT NOT NULL,
    planned_date TEXT NOT NULL,     
    due_date TEXT,                  
    
    allocated_iqa_id TEXT REFERENCES users(id),   
    allocated_assessor_id TEXT REFERENCES users(id), 
    
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending',           
        'iqa_completed',     
        'assessor_responded',
        'complete'           
    )),
    
    created_by TEXT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    iqa_completed_at TIMESTAMP,
    assessor_responded_at TIMESTAMP,
    completed_at TIMESTAMP
, academic_year INTEGER NOT NULL DEFAULT 2025);
INSERT INTO "lw_entries" ("id","template_id","course_id","course_name","assessor_name","iqa_name","planned_date","due_date","allocated_iqa_id","allocated_assessor_id","status","created_by","created_at","iqa_completed_at","assessor_responded_at","completed_at","academic_year") VALUES('lw-entry-1','lw-tmpl-1','ESOL-E1-M01','ESOL Entry 1 Speaking & Listening - Morning','Assessor Tutor','IQA Lead','2026-09-15','2026-09-22','u-iqa-1','u-assessor-1','pending','u-admin-1','2026-08-14 11:22:34',NULL,NULL,NULL,2025);
INSERT INTO "lw_entries" ("id","template_id","course_id","course_name","assessor_name","iqa_name","planned_date","due_date","allocated_iqa_id","allocated_assessor_id","status","created_by","created_at","iqa_completed_at","assessor_responded_at","completed_at","academic_year") VALUES('lw-entry-2','lw-tmpl-1','ESOL-E2-E02','ESOL Entry 2 Reading & Writing - Evening','Assessor Tutor','IQA Lead','2026-09-20','2026-09-27','u-iqa-1','u-assessor-1','iqa_completed','u-admin-1','2026-08-14 11:22:34',NULL,NULL,NULL,2025);
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
CREATE TABLE IF NOT EXISTS "users" (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('superuser','admin','assessor','iqa','eqa','assessor_iqa')),
  stage TEXT CHECK(stage IN ('assess','iqa','eqa')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
INSERT INTO "users" ("id","email","role","stage","created_at") VALUES('u-admin-1','admin@haringeylearns.ac.uk','superuser','assess','2026-08-14 11:22:34');
INSERT INTO "users" ("id","email","role","stage","created_at") VALUES('u-iqa-1','iqa@haringeylearns.ac.uk','iqa','iqa','2026-08-14 11:22:34');
INSERT INTO "users" ("id","email","role","stage","created_at") VALUES('u-assessor-1','assessor@haringeylearns.ac.uk','assessor','assess','2026-08-14 11:22:34');
INSERT INTO "users" ("id","email","role","stage","created_at") VALUES('u-eqa-1','eqa@haringeylearns.ac.uk','eqa','eqa','2026-08-14 11:22:34');
CREATE TABLE IF NOT EXISTS "lw_template_questions" (
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
INSERT INTO "lw_template_questions" ("id","template_id","question_text","question_type","options","has_text_entry","text_entry_label","is_required","sort_order","created_at") VALUES('lw-q-1','lw-tmpl-1','Observation Overview & Environment','section',NULL,0,NULL,0,1,'2026-08-14 11:22:34');
INSERT INTO "lw_template_questions" ("id","template_id","question_text","question_type","options","has_text_entry","text_entry_label","is_required","sort_order","created_at") VALUES('lw-q-2','lw-tmpl-1','Classroom atmosphere and learning environment are welcoming and inclusive','likert','["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]',1,'Evidence & Notes',1,2,'2026-08-14 11:22:34');
INSERT INTO "lw_template_questions" ("id","template_id","question_text","question_type","options","has_text_entry","text_entry_label","is_required","sort_order","created_at") VALUES('lw-q-3','lw-tmpl-1','Lesson objectives and language aims are clearly stated and understood by learners','rag','["Red", "Amber", "Green"]',1,'Observation notes',1,3,'2026-08-14 11:22:34');
INSERT INTO "lw_template_questions" ("id","template_id","question_text","question_type","options","has_text_entry","text_entry_label","is_required","sort_order","created_at") VALUES('lw-q-4','lw-tmpl-1','Quality of Teaching & Learning','section',NULL,0,NULL,0,4,'2026-08-14 11:22:34');
INSERT INTO "lw_template_questions" ("id","template_id","question_text","question_type","options","has_text_entry","text_entry_label","is_required","sort_order","created_at") VALUES('lw-q-5','lw-tmpl-1','Tutor effectively checks understanding using differentiated questioning techniques','ggaw','["Gold", "Green", "Amber", "White"]',1,'Comments on questioning',1,5,'2026-08-14 11:22:34');
INSERT INTO "lw_template_questions" ("id","template_id","question_text","question_type","options","has_text_entry","text_entry_label","is_required","sort_order","created_at") VALUES('lw-q-6','lw-tmpl-1','Key Strengths Identified','textarea',NULL,0,NULL,1,6,'2026-08-14 11:22:34');
INSERT INTO "lw_template_questions" ("id","template_id","question_text","question_type","options","has_text_entry","text_entry_label","is_required","sort_order","created_at") VALUES('lw-q-7','lw-tmpl-1','Areas for Development / Action Points','textarea',NULL,0,NULL,1,7,'2026-08-14 11:22:34');
CREATE TABLE iqaf_templates (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    is_active INTEGER DEFAULT 1 CHECK (is_active IN (0, 1)),
    created_by TEXT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "iqaf_templates" ("id","title","description","is_active","created_by","created_at") VALUES('iqaf-tmpl-1','ESOL Internal Quality Assurance (IQA) Sampling Report','Comprehensive sampling record for formative and summative assessment sampling across all ESOL levels.',1,'u-admin-1','2026-08-14 11:22:34');
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
INSERT INTO "iqaf_template_questions" ("id","template_id","question_text","question_type","options","has_text_entry","text_entry_label","is_required","sort_order") VALUES('iqaf-q-1','iqaf-tmpl-1','Assessment Planning & Preparation','section',NULL,0,NULL,0,1);
INSERT INTO "iqaf_template_questions" ("id","template_id","question_text","question_type","options","has_text_entry","text_entry_label","is_required","sort_order") VALUES('iqaf-q-2','iqaf-tmpl-1','Assessment decisions are consistent, valid, and match awarding body criteria','rag','["Red", "Amber", "Green"]',1,'IQA Evaluative Notes',1,2);
INSERT INTO "iqaf_template_questions" ("id","template_id","question_text","question_type","options","has_text_entry","text_entry_label","is_required","sort_order") VALUES('iqaf-q-3','iqaf-tmpl-1','Learner feedback is constructive, timely, and supports progression','likert','["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]',1,'Feedback observations',1,3);
INSERT INTO "iqaf_template_questions" ("id","template_id","question_text","question_type","options","has_text_entry","text_entry_label","is_required","sort_order") VALUES('iqaf-q-4','iqaf-tmpl-1','Sampling Decision & Action Plan','section',NULL,0,NULL,0,4);
INSERT INTO "iqaf_template_questions" ("id","template_id","question_text","question_type","options","has_text_entry","text_entry_label","is_required","sort_order") VALUES('iqaf-q-5','iqaf-tmpl-1','Overall IQA Judgement','single_choice','["Direct Claim Status Confirmed", "Action Plan Required", "Re-sampling Required"]',1,'Action Details',1,5);
CREATE TABLE iqaf_entries (
    id TEXT PRIMARY KEY,
    template_id TEXT NOT NULL REFERENCES iqaf_templates(id),
    
    course_id TEXT NOT NULL,
    course_name TEXT NOT NULL,
    assessor_name TEXT NOT NULL,
    iqa_name TEXT NOT NULL,
    planned_date TEXT NOT NULL,
    due_date TEXT,
    
    allocated_assessor_id TEXT REFERENCES users(id),
    allocated_iqa_id TEXT REFERENCES users(id),
    allocated_eqa_id TEXT REFERENCES users(id),
    
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending',              
        'assessor_submitted',   
        'iqa_reviewed',         
        'eqa_signed',           
        'complete'              
    )),
    
    created_by TEXT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assessor_submitted_at TIMESTAMP,
    iqa_reviewed_at TIMESTAMP,
    eqa_signed_at TIMESTAMP,
    completed_at TIMESTAMP
, academic_year INTEGER NOT NULL DEFAULT 2025);
INSERT INTO "iqaf_entries" ("id","template_id","course_id","course_name","assessor_name","iqa_name","planned_date","due_date","allocated_assessor_id","allocated_iqa_id","allocated_eqa_id","status","created_by","created_at","assessor_submitted_at","iqa_reviewed_at","eqa_signed_at","completed_at","academic_year") VALUES('iqaf-entry-1','iqaf-tmpl-1','ESOL-L1-A01','ESOL Level 1 Certificate in ESOL International','Assessor Tutor','IQA Lead','2026-10-05','2026-10-15','u-assessor-1','u-iqa-1','u-eqa-1','pending','u-admin-1','2026-08-14 11:22:34',NULL,NULL,NULL,NULL,2025);
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
CREATE TABLE iqaf_comments (
    id TEXT PRIMARY KEY,
    entry_id TEXT NOT NULL REFERENCES iqaf_entries(id) ON DELETE CASCADE,
    author_id TEXT REFERENCES users(id),
    author_role TEXT NOT NULL CHECK (author_role IN ('assessor','iqa','eqa','admin','superuser')),
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE iqaf_notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    entry_id TEXT REFERENCES iqaf_entries(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read INTEGER DEFAULT 0 CHECK (is_read IN (0, 1)),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE quality_calendar_events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('banner', 'single')),
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    include_weekends INTEGER DEFAULT 0 CHECK (include_weekends IN (0, 1)),
    parent_banner_id TEXT REFERENCES quality_calendar_events(id) ON DELETE SET NULL,
    color_hex TEXT DEFAULT '#00C4DF',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
, created_by TEXT);
INSERT INTO "quality_calendar_events" ("id","title","description","type","start_date","end_date","include_weekends","parent_banner_id","color_hex","created_at","created_by") VALUES('qc-1','Autumn Term Quality Sampling Window','First round of internal quality assurance sampling for all vocational and ESOL programmes.','banner','2026-09-01','2026-10-31',0,NULL,'#00C4DF','2026-08-14 11:22:34','admin@haringeylearns.ac.uk');
INSERT INTO "quality_calendar_events" ("id","title","description","type","start_date","end_date","include_weekends","parent_banner_id","color_hex","created_at","created_by") VALUES('qc-2','Learning Walk Observation Fortnight','Cross-service teaching and learning observations across Wood Green and Tottenham centres.','banner','2026-09-15','2026-09-30',0,NULL,'#ff005a','2026-08-14 11:22:34','admin@haringeylearns.ac.uk');
INSERT INTO "quality_calendar_events" ("id","title","description","type","start_date","end_date","include_weekends","parent_banner_id","color_hex","created_at","created_by") VALUES('qc-3','ESOL Department Standardization Meeting','All tutors and IQAs review portfolio samples and align grading standards.','single','2026-09-24','2026-09-24',0,NULL,'#10b981','2026-08-14 11:22:34','admin@haringeylearns.ac.uk');
INSERT INTO "quality_calendar_events" ("id","title","description","type","start_date","end_date","include_weekends","parent_banner_id","color_hex","created_at","created_by") VALUES('qc-4','Pearson Edexcel EQA Remote Review','Annual external quality assurance verification.','single','2026-10-15','2026-10-15',0,NULL,'#8b5cf6','2026-08-14 11:22:34','admin@haringeylearns.ac.uk');
DELETE FROM sqlite_sequence;
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('d1_migrations',12);
CREATE INDEX idx_form_entries_status ON form_entries(status);
CREATE INDEX idx_form_entries_assessor ON form_entries(assessor_id);
CREATE INDEX idx_form_entries_iqa ON form_entries(iqa_id);
CREATE INDEX idx_form_entries_eqa ON form_entries(eqa_id);
CREATE INDEX idx_form_entries_search ON form_entries(course_code, qualification, teacher);
CREATE INDEX idx_template_questions_template ON template_questions(template_id);
CREATE INDEX idx_template_questions_sort ON template_questions(template_id, sort_order);
CREATE INDEX idx_comment_categories_template ON template_comment_categories(template_id);
CREATE INDEX idx_entry_headers_course ON form_entry_headers(course_id);
CREATE INDEX idx_entry_headers_qual ON form_entry_headers(qualification_aim);
CREATE INDEX idx_attachments_entry ON form_attachments(form_entry_id);
CREATE INDEX idx_lw_entries_iqa ON lw_entries(allocated_iqa_id);
CREATE INDEX idx_lw_entries_assessor ON lw_entries(allocated_assessor_id);
CREATE INDEX idx_lw_entries_status ON lw_entries(status);
CREATE INDEX idx_lw_entries_due ON lw_entries(due_date);
CREATE INDEX idx_lw_answers_entry ON lw_answers(entry_id);
CREATE INDEX idx_lw_comments_entry ON lw_comments(entry_id);
CREATE INDEX idx_lw_notifications_user ON lw_notifications(user_id, is_read);
CREATE INDEX idx_lw_template_questions ON lw_template_questions(template_id, sort_order);
CREATE INDEX idx_iqaf_template_questions ON iqaf_template_questions(template_id, sort_order);
CREATE INDEX idx_iqaf_entries_assessor ON iqaf_entries(allocated_assessor_id);
CREATE INDEX idx_iqaf_entries_iqa ON iqaf_entries(allocated_iqa_id);
CREATE INDEX idx_iqaf_entries_eqa ON iqaf_entries(allocated_eqa_id);
CREATE INDEX idx_iqaf_entries_status ON iqaf_entries(status);
CREATE INDEX idx_iqaf_entries_due ON iqaf_entries(due_date);
CREATE INDEX idx_iqaf_answers_entry ON iqaf_answers(entry_id);
CREATE INDEX idx_iqaf_comments_entry ON iqaf_comments(entry_id);
CREATE INDEX idx_iqaf_notifications_user ON iqaf_notifications(user_id, is_read);