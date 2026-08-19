-- Migration 0018: Rename roles to MIS Officer, Manager, IQA, assessor_IQA and update existing tables.
UPDATE roles SET role = 'Manager' WHERE role = 'admin';
UPDATE roles SET role = 'mis_officer' WHERE role = 'eqa';
UPDATE roles SET role = 'IQA' WHERE role = 'iqa';
UPDATE roles SET role = 'assessor_IQA' WHERE role = 'assessor_iqa';

UPDATE users SET custom_role = 'Manager' WHERE role = 'admin' AND (custom_role IS NULL OR custom_role = 'admin');
UPDATE users SET custom_role = 'mis_officer' WHERE role = 'eqa' AND (custom_role IS NULL OR custom_role = 'eqa');
UPDATE users SET custom_role = 'IQA' WHERE role = 'iqa' AND (custom_role IS NULL OR custom_role = 'iqa');
UPDATE users SET custom_role = 'assessor_IQA' WHERE role = 'assessor_iqa' AND (custom_role IS NULL OR custom_role = 'assessor_iqa');
