# Implementation Plan: Student Progress Tracker Details & Access Control

This plan details the implementation of student progress tracker form entries, status workflows, read/write page routing, teacher-exclusive achievement markers, and threaded comments.

## Proposed Changes

### Database Layer

We have already created the migration `0019_add_tracker_statuses.sql` adding:
- `clos_status` (TEXT DEFAULT 'new')
- `purpose_status` (TEXT DEFAULT 'new')
- `goals_status` (TEXT DEFAULT 'new')
- `outcomes_status` (TEXT DEFAULT 'new')
- `destination_status` (TEXT DEFAULT 'new')

To store structured multi-goal entries and achievement states for **Course Learning Objectives** (CLOs) and **SMART Goals**, we will store them as a JSON array of objectives/goals inside the existing columns `course_learning_objectives` and `smart_goals`:
`[ { "id": "1", "text": "Objective A", "achieved": false }, { "id": "2", "text": "Objective B", "achieved": true } ]`

---

### Application Logic & Routing

#### [MODIFY] [src/index.ts](file:///c:/Users/jarcu/Downloads/HALSQA/esolqa/src/index.ts)

We will modify:
1. **Tiles Status Rendering**:
   - Update `renderTrackerTile` to map D1 status values to the correct display labels:
     - `'new'` or null -> `"New"` (grey badge)
     - `'draft'` or `'pending'` -> `"Pending"` (amber badge)
     - `'completed'` ->
       - If CLOs or SMART Goals are completed, calculate the achievement level:
         - If all items in JSON array have `achieved === true`, render `"Achieved"` (green badge).
         - If some but not all have `achieved === true`, render `"Partial"` (blue badge).
         - Otherwise, render `"Completed"` (green badge).
   - In the student dashboard, update the `Edit` buttons to point to `/tracker/edit?enrolId=<enrolId>&tile=<tileId>` instead of opening JS modals.
   - For teacher reviews (Initial assessment, Term 1, 2, 3), render status as `"Completed"` if content exists, else `"New"`.

2. **Routes in Fetch Handler**:
   - Add GET `/tracker/edit` handler:
     - Fetches enrolment, student tracker, and comments.
     - Renders a dedicated page for the requested tile (blue sidebar, same padding, title).
     - Renders a `"Back to my tracker"` button linking to `/tracker?enrolId=<enrolId>`.
     - Controls editability: if the status is `'completed'`, fields are read-only for students (locked).
   - Add POST `/tracker/edit` save handler:
     - Saves the inputs as draft (`status = 'draft'`) or final (`status = 'completed'`).
     - Redirects back to `/tracker?enrolId=<enrolId>`.

3. **Page-Specific Entry Views**:
   - **Course Learning Objectives**:
     - Dynamically add/remove text fields.
     - Tutors see an `"Achieved"` checkbox next to each objective.
   - **Tailored Learning Purpose**:
     - Single-choice radio buttons in exact requested order.
   - **SMART Goals**:
     - Educational explanation of SMART goals.
     - Dynamically add/remove SMART goal text fields.
     - Tutors see `"Achieved"` checkbox.
   - **Tailored Learning Outcomes**:
     - Single-choice radio buttons in exact requested order.
   - **Destination & Progression**:
     - Single-choice radio buttons (EMP, EDU, SDE, OTH) and notes text area.
     - Tutors/Staff see the reference list.
   - **Tutor-Filled Reviews (Diagnostic, Terms 1-3)**:
     - Read-only details for student.
     - Feedbacks and comments thread at the bottom.

4. **Thread Comments Integration**:
   - Renders a Discussion Thread at the bottom of all edit/view pages.
   - Saves comments to `assessment_comments` with `entity_id = enrolment_id` and `entity_type = 'tracker'`.

---

## Verification Plan

### Automated Tests
- Run `npm run build` to verify clean typescript compilation.

### Manual Verification
- Log in as student, navigate to My Tracker, verify all uncompleted tiles show **New**.
- Click edit on Course Learning Objectives:
  - Add multiple goals, save as draft. Verify My Tracker status is **Pending**.
  - Re-open, modify, save. Verify My Tracker status is **Completed**.
- Log in as tutor:
  - Open same student's Course Learning Objectives, toggle some goals as Achieved. Verify tile status shows **Partial**.
  - Toggle all goals as Achieved, verify tile status shows **Achieved**.
