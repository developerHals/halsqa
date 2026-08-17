CREATE TABLE IF NOT EXISTS it_tickets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'in_progress', 'closed'
  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  in_progress_at DATETIME,
  closed_at DATETIME
);

CREATE TABLE IF NOT EXISTS it_ticket_comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ticket_id INTEGER NOT NULL,
  author_email TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_role TEXT NOT NULL,
  comment_text TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ticket_id) REFERENCES it_tickets(id) ON DELETE CASCADE
);
