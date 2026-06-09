ALTER TABLE form_entries ADD COLUMN status TEXT DEFAULT 'assessment' CHECK (status IN ('assessment','iqa','eqa','complete'));
ALTER TABLE form_entries ADD COLUMN course_code TEXT;
ALTER TABLE form_entries ADD COLUMN qualification TEXT;
ALTER TABLE form_entries ADD COLUMN teacher TEXT;
ALTER TABLE form_entries ADD COLUMN completed_at TIMESTAMP;
ALTER TABLE form_entries ADD COLUMN completed_by TEXT REFERENCES users(id);

CREATE INDEX idx_form_entries_status ON form_entries(status);
CREATE INDEX idx_form_entries_assessor ON form_entries(assessor_id);
CREATE INDEX idx_form_entries_iqa ON form_entries(iqa_id);
CREATE INDEX idx_form_entries_eqa ON form_entries(eqa_id);
CREATE INDEX idx_form_entries_search ON form_entries(course_code, qualification, teacher);
