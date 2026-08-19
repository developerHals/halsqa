-- Migration 0017: Create roles table, add custom_role column to users, and prepopulate defaults.
CREATE TABLE IF NOT EXISTS roles (
  id TEXT PRIMARY KEY,
  role TEXT UNIQUE NOT NULL,
  functionalities TEXT NOT NULL
);

INSERT OR IGNORE INTO roles (id, role, functionalities) VALUES 
('superuser-role-uuid-1', 'superuser', '["learning-walks","iqa-forms","assessments","tracker","courses","my-class","students","reports","quality-calendar","todays-classes","trainings","it-tickets","users"]'),
('admin-role-uuid-2', 'admin', '["learning-walks","iqa-forms","assessments","tracker","courses","my-class","students","reports","quality-calendar","todays-classes","trainings","it-tickets","users"]'),
('assessor-role-uuid-3', 'assessor', '["learning-walks","iqa-forms","assessments","tracker","courses","my-class","students","todays-classes","trainings","it-tickets"]'),
('iqa-role-uuid-4', 'iqa', '["learning-walks","iqa-forms","assessments","tracker","courses","my-class","students","todays-classes","trainings","it-tickets"]'),
('eqa-role-uuid-5', 'eqa', '["learning-walks","iqa-forms","assessments","tracker","courses","my-class","students","todays-classes","trainings","it-tickets"]'),
('assessor-iqa-role-uuid-6', 'assessor_iqa', '["learning-walks","iqa-forms","assessments","tracker","courses","my-class","students","todays-classes","trainings","it-tickets"]'),
('it-admin-role-uuid-7', 'it_admin', '["todays-classes","trainings","it-tickets"]'),
('student-role-uuid-8', 'student', '["assessments","tracker","todays-classes","it-tickets"]');

-- Add custom_role column safely without dropping users table
ALTER TABLE users ADD COLUMN custom_role TEXT;
