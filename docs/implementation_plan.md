# Goal: Implement IT Tickets Module

We will implement the IT Tickets system in two stages as requested. This plan covers Stage 1: Database Migration, Role-Based Access Control, and Route Handlers. 

## Open Questions
- Should the "IT admin" role be considered a "staff" role (i.e. able to access staff dashboards) or purely restricted to IT Tickets? I will assume it is a staff role and will add it to the `isStaffRole` check.
- Should the "IT Tickets" link be available to Students as well as Staff? Yes, standard users (including students) can view tickets they submitted. I will add the link to both sidebars.

## Proposed Changes

### Database Migration
#### [NEW] `migrations/0015_it_tickets.sql`
- Create `it_tickets` table with fields for email, name, description, status, and timestamps.
- Create `it_ticket_comments` table with fields for ticket_id, author details, comment text, and timestamps.
- Use `ON DELETE CASCADE` for comments to maintain referential integrity.

### API & Core Application Logic
#### [MODIFY] `src/index.ts`
1. **Roles & RBAC**
   - Update `type Role` to include `"it_admin"`.
   - Update `isStaffRole` helper to include `"it_admin"`.
   - Update `renderSidebar` to include the "IT Tickets" navigation link for all users (both students and staff).
2. **Interfaces**
   - Add `ITTicket` and `ITTicketComment` interfaces mapping to the new tables.
3. **Route Handlers (Stage 1)**
   - Define `GET /it-tickets` logic:
     - Check if user is `superuser` or `it_admin` -> fetch all tickets.
     - Else -> fetch tickets `WHERE user_email = ?`.
     - Forward to `renderITTicketsPage(tickets)` (UI template to be built in Stage 2).
   - Define `POST /it-tickets` logic (New Ticket Form submission):
     - Insert into `it_tickets` with pending status.
     - Redirect to `/it-tickets`.
   - Define `GET /it-tickets/:id` logic:
     - Fetch ticket and verify access (must be admin/superuser or the ticket creator).
     - Fetch associated comments.
     - Forward to `renderITTicketDetailPage(ticket, comments)` (UI template to be built in Stage 2).
   - Define `POST /it-tickets/:id` logic (Status Update & Commenting):
     - Verify access.
     - Update ticket status and timestamps if status changed.
     - Insert comment if comment text provided.
     - Redirect to `/it-tickets/:id`.
4. **Router Wiring**
   - Add the new route handlers to the main `fetch` switch statement in `src/index.ts`.

## Verification Plan
1. **Database**: Run `npm run db:migrate:local` and `db:migrate:remote` to verify the schema is created without errors.
2. **Types**: Run `npx tsc --noEmit` to ensure TypeScript definitions align with the database queries.
3. **Stage 1 Completion**: We will wait for your confirmation before moving to Stage 2, which will focus entirely on implementing the complex HTML/CSS UI matching the Learning Walks dashboard.
