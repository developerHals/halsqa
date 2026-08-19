# Implementation Plan: Dynamic Roles and Sidebar Permissions

This plan outlines the changes needed to replace the hardcoded user roles and sidebar visibility logic with a database-driven permissions system. We will create a `roles` D1 database table, design a **Roles** management interface, dynamically render sidebar links according to a role's enabled features, and update user forms to query dynamic roles.

---

## Proposed Changes

### Database Layer

#### [NEW] [0017_create_roles_table.sql](file:///c:/Users/jarcu/Downloads/HALSQA/esolqa/migrations/0017_create_roles_table.sql)
Create a new migration file to:
- Establish the `roles` table containing:
  - `id`: TEXT (UUID primary key)
  - `role`: TEXT (Unique role identifier name)
  - `functionalities`: TEXT (JSON stringified array of sidebar permission keys)
- Recreate the `users` table without the static CHECK constraint on the `role` column to allow custom dynamic roles.
- Prepopulate `roles` table with default values for current roles:
  - `superuser`: all 13 functionalities.
  - `admin`: all 13 functionalities.
  - `assessor`, `iqa`, `eqa`, `assessor_iqa`: `["learning-walks", "iqa-forms", "assessments", "tracker", "courses", "my-class", "students", "todays-classes", "trainings", "it-tickets"]`
  - `it_admin`: `["todays-classes", "trainings", "it-tickets"]`
  - `student`: `["assessments", "tracker", "todays-classes", "it-tickets"]`

---

### UI & Server Routing Layer

#### [MODIFY] [index.ts](file:///c:/Users/jarcu/Downloads/HALSQA/esolqa/src/index.ts)
We will make the following modifications:
1. **Model & Global Definitions**:
   - Update `Identity` to include an optional `functionalities?: string[]` field.
   - Re-declare `Role` as `string` instead of a static union type.
   - Implement `getRolesList(env)` to dynamically query roles from D1 (falling back to static defaults if the table is not initialized yet).
2. **Topbar Customization**:
   - Update `renderTopbar(identity, title, extraActions)` to include an optional pink **Roles** button when rendering the **Users** management page.
3. **Sidebar Rendering**:
   - Update `renderSidebar` to dynamically map sidebar links based on `identity.functionalities` (or fallbacks) instead of hardcoding permissions inside conditional statements.
4. **Users Management View**:
   - Update `renderUsersPage` to query the list of roles from the DB and pass it to user creation/modification forms.
5. **New Router Paths**:
   - Add routes for:
     - `/roles` (GET): Renders the Roles control panel where superusers can select any role, view and check/uncheck its functionalities, save permissions, or add new roles.
     - `/api/roles/save` (POST): Updates functionality lists for a given role in D1.
     - `/api/roles/add` (POST): Inserts a new role into D1 with default empty permissions.
6. **User Validation**:
   - Update user validation inside `createUser`, `updateUser`, and `importUsers` to query the database-driven dynamic roles list instead of checking against a static array.

---

## Verification Plan

### Automated Tests
- Run `npm run typecheck` to verify no compilation errors.

### Manual Verification
- Log in as a superuser.
- Navigate to the **Users** page and verify the **Roles** button appears in the topbar next to the user email profile pill.
- Click **Roles** to open the Roles page:
  - Check that a dropdown lists the standard roles.
  - Check that changing the selected role toggles checkboxes correctly in real-time.
  - Click **Add Role** to create a custom role (e.g. `guest_inspector`).
  - Toggle functionalities for the new role and click **Save**.
  - Assign a user to the new role and log in under their account to verify their sidebar links dynamically match the customized permission list.
