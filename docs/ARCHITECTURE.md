# Assessment Checklist SaaS

## Purpose
A secure platform for managing student assessment form submissions.

## Schema
1. users (staff identities)
2. students (anonymous nicknames)
3. form_templates (JSON blueprints for assessments)
4. form_entries (completed student entries)

## Infrastructure
- *Cloudflare Account:* development@haringeylearns.ac.uk
- *Database:* esol-marking-db
- *Authentication:* Cloudflare Zero Trust (to be configured)

## Handover Instructions
- Login to Cloudflare with the dedicated service account.
- Use export CLOUDFLARE_API_TOKEN if terminal authentication fails.
-
