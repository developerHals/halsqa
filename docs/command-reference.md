# Command Reference Guide

Quick reference for common commands used in this project.

---

## GitHub (Git)

### Repository Setup
```bash
# Clone repository
git clone https://github.com/username/repo.git
git clone git@github.com:username/repo.git  # SSH

# Check status
git status

# View remote URLs
git remote -v
```

### Daily Workflow
```bash
# Stage changes
git add filename.txt              # Stage specific file
git add .                         # Stage all changes
git add -p                        # Stage interactively (chunk by chunk)

# Commit changes
git commit -m "message"           # Commit with message
git commit -am "message"          # Stage all modified and commit (skip add)

# View history
git log                           # Full log
git log --oneline -10             # Last 10 commits, one line each
git log --graph --decorate       # Visual graph with branches
```

### Branching
```bash
# List branches
git branch                        # Local branches
git branch -a                     # All branches (local + remote)

# Create & switch branches
git branch feature-name            # Create branch
git checkout feature-name        # Switch to branch
git checkout -b feature-name     # Create and switch (combined)
git switch feature-name          # Modern way to switch
git switch -c feature-name       # Modern way to create and switch

# Merge & rebase
git merge feature-name           # Merge branch into current
git rebase main                  # Rebase current branch onto main
```

### Remote Operations
```bash
# Push changes
git push origin main             # Push to main branch
git push origin feature-name     # Push feature branch
git push -u origin feature-name # Push and set upstream

# Pull changes
git pull                         # Pull current branch
git pull origin main            # Pull specific branch
git fetch                       # Download without merging

# Delete branches
git branch -d feature-name       # Delete local branch (if merged)
git branch -D feature-name       # Force delete local branch
git push origin --delete feature-name  # Delete remote branch
```

### Undo Operations
```bash
# Discard uncommitted changes
git checkout -- filename.txt     # Discard file changes
git restore filename.txt        # Modern way (Git 2.23+)
git restore .                   # Discard all changes

# Undo commits (careful!)
git reset --soft HEAD~1         # Undo last commit, keep changes staged
git reset --mixed HEAD~1        # Undo last commit, keep changes unstaged
git reset --hard HEAD~1         # Undo last commit, discard changes

# Amend last commit
git commit --amend -m "new message"     # Change message
git commit --amend --no-edit            # Add changes to last commit
```

### Stashing
```bash
git stash                        # Stash changes
git stash push -m "description" # Stash with message
git stash list                   # List stashes
git stash pop                    # Apply and remove stash
git stash apply                  # Apply but keep stash
git stash drop                   # Delete stash
```

---

## Wrangler (Cloudflare)

### Development
```bash
# Local development
npx wrangler dev                 # Start local dev server
npx wrangler dev --local        # Use local Miniflare (faster)
npx wrangler dev --port 8787    # Custom port

# Deploy
npx wrangler deploy              # Deploy to Cloudflare
npx wrangler deploy --dry-run   # Preview what would deploy
```

### D1 Database
```bash
# Create database
npx wrangler d1 create database-name

# List databases
npx wrangler d1 list

# Execute queries
npx wrangler d1 execute database-name --command="SELECT * FROM table"
npx wrangler d1 execute database-name --command="SELECT * FROM table" --remote  # On production

# Interactive SQL shell
npx wrangler d1 execute database-name --remote --command=

# Run migrations
npx wrangler d1 migrations list database-name        # List migrations
npx wrangler d1 migrations apply database-name     # Apply locally
npx wrangler d1 migrations apply database-name --remote  # Apply to production

# Inspect Schema
npx wrangler d1 execute database-name --remote --command="SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
npx wrangler d1 execute database-name --remote --command="SELECT sql FROM sqlite_master WHERE type='table' ORDER BY name"
npx wrangler d1 execute database-name --remote --command="PRAGMA table_info(table_name)"
```

### KV Storage
```bash
# Create namespace
npx wrangler kv:namespace create "MY_KV"

# List keys
npx wrangler kv:key list --binding=MY_KV

# Get/Set/Delete
npx wrangler kv:key get my-key --binding=MY_KV
npx wrangler kv:key put my-key "my-value" --binding=MY_KV
npx wrangler kv:key delete my-key --binding=MY_KV

# Bulk operations
npx wrangler kv:bulk put --binding=MY_KV file.json
```

### Secrets
```bash
# Set secrets
npx wrangler secret put SECRET_NAME          # Prompt for value
echo "value" | npx wrangler secret put NAME  # Pipe value

# List/delete secrets
npx wrangler secret list
npx wrangler secret delete SECRET_NAME
```

### R2 Storage
```bash
# Create bucket
npx wrangler r2 bucket create bucket-name

# List buckets
npx wrangler r2 bucket list

# Object operations
npx wrangler r2 object get bucket-name/file.txt
npx wrangler r2 object put bucket-name/file.txt --file=./local.txt
npx wrangler r2 object delete bucket-name/file.txt
n```

### Logs & Debugging
```bash
# Tail logs
npx wrangler tail                  # Stream logs from production
npx wrangler tail --format=pretty # Formatted output

# Whoami
npx wrangler whoami               # Check logged in account
```

---

## Supabase

### CLI Setup
```bash
# Login
npx supabase login                # Browser login

# Link project
npx supabase link --project-ref project-ref-here
```

### Database
```bash
# Start local Supabase
npx supabase start                # Start all services
npx supabase stop                 # Stop services
npx supabase status              # Check status

# Reset database
npx supabase db reset             # Reset to migrations (destructive!)

# Migrations
npx supabase migration new name   # Create new migration
npx supabase migration list        # List migrations
npx supabase migration up          # Apply pending migrations
```

### Querying
```bash
# Open SQL Editor
npx supabase sql                  # Interactive SQL

# Run query
npx supabase sql --command "SELECT * FROM table"
```

### Type Generation
```bash
# Generate TypeScript types
npx supabase gen types typescript --linked > types/supabase.ts
n```

### Edge Functions
```bash
# Create function
npx supabase functions new function-name

# Deploy
npx supabase functions deploy function-name

# Serve locally
npx supabase functions serve function-name
```

---

## Node.js / NPM

### Package Management
```bash
# Install dependencies
npm install                      # Install all from package.json
npm install package-name         # Install and save to dependencies
npm install --save-dev package   # Install as dev dependency
npm install -g package-name      # Install globally

# Remove packages
npm uninstall package-name

# Update packages
npm update                       # Update all
npm update package-name          # Update specific
npm outdated                     # Check outdated packages
```

### Running Scripts
```bash
# Run scripts from package.json
npm run script-name
npm start                        # Run start script
npm test                         # Run test script

# NPX (execute without installing)
npx package-name                 # Run package once
npx create-react-app my-app     # Create new project
```

### Package Info
```bash
npm list                         # List installed packages
npm list -g --depth=0           # List global packages
npm view package-name           # View package details
npm view package-name versions  # View all versions
```

### Cache & Clean
```bash
npm cache clean --force         # Clear npm cache
rm -rf node_modules             # Delete node_modules
rm package-lock.json            # Delete lock file
npm install                     # Reinstall everything
```

---

## SQLite (D1 Specific)

### List Tables & Schema
```bash
# List all tables
npx wrangler d1 execute db-name --remote --command="SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"

# Get schema for all tables (CREATE TABLE statements)
npx wrangler d1 execute db-name --remote --command="SELECT sql FROM sqlite_master WHERE type='table' ORDER BY name"

# Get schema for specific table
npx wrangler d1 execute db-name --remote --command="SELECT sql FROM sqlite_master WHERE name='table_name'"

# Check table structure (columns, types, defaults)
npx wrangler d1 execute db-name --remote --command="PRAGMA table_info(table_name)"

# List all indexes
npx wrangler d1 execute db-name --remote --command="SELECT name, tbl_name, sql FROM sqlite_master WHERE type='index' ORDER BY tbl_name"

# List foreign keys for a table
npx wrangler d1 execute db-name --remote --command="PRAGMA foreign_key_list(table_name)"
```

### Export Schema
```bash
# Export full database schema to file
npx wrangler d1 execute db-name --remote --command="SELECT sql FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'" > schema.sql

# Export with proper formatting (newlines)
npx wrangler d1 execute db-name --remote --command="SELECT group_concat(sql, ';\n\n') FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'" > schema.sql
```

### Common Queries
```bash
# Query table
npx wrangler d1 execute db-name --remote --command="SELECT * FROM table_name LIMIT 10"

# Check table structure
npx wrangler d1 execute db-name --remote --command="PRAGMA table_info(table_name)"

# Count rows
npx wrangler d1 execute db-name --remote --command="SELECT COUNT(*) FROM table_name"

# Search
npx wrangler d1 execute db-name --remote --command="SELECT * FROM table WHERE name LIKE '%search%'"

# Join tables
npx wrangler d1 execute db-name --remote --command="SELECT a.*, b.name FROM table_a a JOIN table_b b ON a.id = b.a_id"

# Most recent entries
npx wrangler d1 execute db-name --remote --command="SELECT * FROM table ORDER BY created_at DESC LIMIT 5"
```

### This Project's Tables
```bash
# Learning Walks entries
npx wrangler d1 execute esol-marking-db --remote --command="SELECT id, course_name, status, created_at FROM lw_entries ORDER BY created_at DESC"

# Templates
npx wrangler d1 execute esol-marking-db --remote --command="SELECT id, title, is_active FROM lw_templates"

# Users
npx wrangler d1 execute esol-marking-db --remote --command="SELECT id, email, role FROM users"
```

---

## VS Code Tips

### Keyboard Shortcuts
```
Cmd/Ctrl + Shift + P     # Command palette
Cmd/Ctrl + P             # Quick open file
Cmd/Ctrl + Shift + F     # Global search
Cmd/Ctrl + Shift + L     # Select all occurrences
Cmd/Ctrl + D             # Select next occurrence
Cmd/Ctrl + /             # Toggle comment
Cmd/Ctrl + B             # Toggle sidebar
Cmd/Ctrl + `             # Toggle terminal
```

### Useful Extensions for This Project
- TypeScript Importer
- Tailwind CSS IntelliSense
- Error Lens
- Prettier
- ESLint

---

## Quick Troubleshooting

### "Command not found"
```bash
# Check if installed
which npx
which npm
which git

# Reinstall if needed
npm install -g npm
```

### "Permission denied" (Mac/Linux)
```bash
# Fix permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules
```

### Port already in use
```bash
# Find and kill process on port
lsof -ti:8787 | xargs kill -9  # Mac/Linux
netstat -ano | findstr :8787  # Windows (then taskkill /PID <id> /F)
```

---

## Resources

- **Git**: https://git-scm.com/docs
- **Wrangler**: https://developers.cloudflare.com/workers/wrangler/commands/
- **Supabase**: https://supabase.com/docs/reference/cli/supabase
- **NPM**: https://docs.npmjs.com/cli/v8/commands
- **SQLite**: https://www.sqlite.org/lang.html
