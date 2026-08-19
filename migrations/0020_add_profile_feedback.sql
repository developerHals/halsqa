-- Migration 0020: Add Learner Profile and Course Feedback forms support
ALTER TABLE student_trackers ADD COLUMN learner_profile_json TEXT;
ALTER TABLE student_trackers ADD COLUMN profile_status TEXT DEFAULT 'new';
ALTER TABLE student_trackers ADD COLUMN course_feedback_json TEXT;
ALTER TABLE student_trackers ADD COLUMN feedback_status TEXT DEFAULT 'new';
