# Walkthrough: Dynamic Roles & Permission-Based Sidebar

We have successfully replaced the static user roles and hardcoded sidebar visibility rules with a dynamic database-driven permissions system. Here is a summary of the accomplishments and the resolution of the migration issue:

---

## 1. Database Schema Evolution
We encountered a `FOREIGN KEY constraint failed` SQLite constraint error during remote migrations because other tables (such as `it_tickets`, `lw_entries`, and `iqaf_entries`) contain foreign keys referencing `users(id)`. Recreating the `users` table to drop the `role CHECK` constraint was blocked by SQLite to maintain schema integrity since Cloudflare D1 enforces foreign keys.

### Solution
Instead of dropping and recreating the `users` table, we modified the D1 migration [0017_create_roles_table.sql](file:///c:/Users/jarcu/Downloads/HALSQA/esolqa/migrations/0017_create_roles_table.sql) to safely alter the table and add a new `custom_role` column:
- `ALTER TABLE users ADD COLUMN custom_role TEXT;`
This operation does not recreate the table, preserving all existing foreign key constraints perfectly.
- In addition, the migration creates the `roles` table and populates it with default permissions for all standard roles (`superuser`, `admin`, `assessor`, `iqa`, `eqa`, `assessor_iqa`, `it_admin`, `student`).

---

## 2. Server Routing & Pages
Added the following endpoints and pages to [src/index.ts](file:///c:/Users/jarcu/Downloads/HALSQA/esolqa/src/index.ts):
- **`/roles` (GET)**: Serves the Roles Management console dashboard.
- **`/api/roles/save` (POST)**: Updates the checked sidebar permission checkboxes in D1 for a selected role.
- **`/api/roles/add` (POST)**: Creates a new role in D1 with empty default permissions.

---

## 3. Dynamic UI & Custom Role Mapping
- **Active Role Mapping**: Inside `getIdentity`, we retrieve the user record. If `custom_role` is set, we overwrite `user.role` with `custom_role` in memory. This automatically and transparently adapts the entire application's permission checks without violating the SQL check constraint.
- **Roles Button**: Added a pink **Roles** button in the header topbar on the Users page between the user's email profile pill and the "Sign out" link.
- **Dynamic Checkboxes**: Selecting a role from the dropdown on the Roles page instantly updates the checkbox values using a embedded JSON dataset containing all roles and permissions.
- **Dynamic Sidebar**: Refactored the `renderSidebar` method to parse and display only the checked functionalities for the user's current role, rather than using hardcoded conditional branches.
- **Forms & Validation**: Replaced static role lists inside `renderUsers`, `createUser`, `updateUser`, and `importUsers` with a database query `getRolesList(env)`. If a user is assigned a dynamic custom role, we store `role = 'assessor'` (which is allowed by the database's check constraint) and `custom_role = name_of_custom_role` in the database.

---

## 4. Verification
- **Local D1 Migrations**: Applied successfully.
- **Remote D1 Migrations**: `npm run db:migrate:remote` applied successfully.
- **Production Deployment**: Compiles, bundles, and deployed successfully via `npm run deploy` to [halsqa.development-260.workers.dev](https://halsqa.development-260.workers.dev).
