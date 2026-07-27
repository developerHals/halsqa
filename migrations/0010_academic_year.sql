-- Add academic_year to learning walk and IQA form entries and backfill existing records to 2025

ALTER TABLE lw_entries ADD COLUMN academic_year INTEGER NOT NULL DEFAULT 2025;
ALTER TABLE iqaf_entries ADD COLUMN academic_year INTEGER NOT NULL DEFAULT 2025;

UPDATE lw_entries SET academic_year = 2025 WHERE academic_year IS NULL;
UPDATE iqaf_entries SET academic_year = 2025 WHERE academic_year IS NULL;
