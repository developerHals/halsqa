-- Migration 0019: Add tracker statuses
ALTER TABLE student_trackers ADD COLUMN clos_status TEXT DEFAULT 'new';
ALTER TABLE student_trackers ADD COLUMN purpose_status TEXT DEFAULT 'new';
ALTER TABLE student_trackers ADD COLUMN goals_status TEXT DEFAULT 'new';
ALTER TABLE student_trackers ADD COLUMN outcomes_status TEXT DEFAULT 'new';
ALTER TABLE student_trackers ADD COLUMN destination_status TEXT DEFAULT 'new';
