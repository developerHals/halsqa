-- Add course_id and apply_to_all to assessment_templates
ALTER TABLE assessment_templates ADD COLUMN course_id TEXT;
ALTER TABLE assessment_templates ADD COLUMN apply_to_all INTEGER DEFAULT 0;
