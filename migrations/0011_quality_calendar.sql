-- Quality Calendar events table
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
);
