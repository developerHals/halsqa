# UI Refinements for IT Tickets Module

Based on your provided screenshots and instructions, I will completely refactor the IT Tickets pages to seamlessly match the native visual language of the HALSQA application (using the existing `list-stack`, `list-card`, and `search-form-inline` CSS classes).

## Proposed Changes

### 1. Sidebar Navigation Placement
- Move the `IT Tickets` link from the bottom of the menu to **directly below `Quality Calendar`** and above `Users` in the staff sidebar.

### 2. Tickets List View (`/it-tickets`) -> Matches Picture 1
- **Top Header**: Use the exact `.eyebrow` styling but with Hot Pink (`#e11d48`) text reading `IT SUPPORT TICKETS`.
- **Search Bar**: Add an inline search bar (`<form class="search-form-inline">`) placeholder `Search by user, email, status...` and a solid pink `Search` button.
- **Primary Action**: A solid pink `+ New IT Ticket` button linking to a dedicated route `/it-tickets/new`.
- **Ticket Tiles**: Rebuild the list to use the standard `<article class="list-card">` and `<div class="list-stack">` wrappers so they look identical to Learning Walks, while retaining the custom left-border color coding (Pending=Blue, In Progress=Amber, Closed=Green).

### 3. Dedicated "New Ticket" Page (`/it-tickets/new`) -> Matches Picture 2
- Remove the inline JavaScript form from the list page.
- Create a brand new route `GET /it-tickets/new` which renders a full standalone page.
- **Header**: Pink eyebrow `NEW IT TICKET ENTRY` followed by a large black headline `Submit an IT Ticket`.
- **Form Styling**: Replicate the clean section headers, thin-bordered inputs, and white spacing seen in the `IQA Forms` builder view for the Name and Description inputs.

### 4. Route Handling (`src/index.ts`)
- Add `GET /it-tickets/new` to route to the new `renderNewITTicketPage`.
- Update the `GET /it-tickets` route to accept and process an optional `?q=` search parameter to filter tickets by user name, email, or description.

Let me know if you approve this approach and I will execute the changes!
