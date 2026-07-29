-- Track who created each Quality Calendar event for ownership-based permissions
ALTER TABLE quality_calendar_events ADD COLUMN created_by TEXT;
