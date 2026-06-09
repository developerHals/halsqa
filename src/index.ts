interface Env {
  esol_marking_db: {
    prepare(query: string): {
      bind(...values: unknown[]): {
        first<T>(): Promise<T | null>;
        all<T>(): Promise<{ results: T[] }>;
        run(): Promise<unknown>;
      };
      first<T>(): Promise<T | null>;
      all<T>(): Promise<{ results: T[] }>;
      run(): Promise<unknown>;
    };
  };
  MICROSOFT_CLIENT_ID?: string;
  MICROSOFT_CLIENT_SECRET?: string;
  MICROSOFT_TENANT_ID?: string;
  SESSION_SECRET?: string;
}

type Role = "superuser" | "admin" | "assessor" | "iqa" | "eqa";
type Stage = "assess" | "iqa" | "eqa";
type EntryStatus = "assessment" | "iqa" | "eqa" | "complete";

type UserRecord = {
  id: string;
  email: string;
  role: Role;
  stage: Stage | null;
  created_at?: string;
};

type Identity = {
  email: string;
  name: string | null;
  user: UserRecord | null;
  isKnownUser: boolean;
};

type MicrosoftUser = {
  mail?: string;
  userPrincipalName?: string;
  displayName?: string;
};

type TemplateRecord = {
  id: string;
  title: string;
  description: string | null;
  structure: string;
  is_active: number;
  created_at: string;
};

type EntryRecord = {
  id: string;
  template_id: string;
  template_title: string;
  status: EntryStatus;
  course_code: string | null;
  qualification: string | null;
  teacher: string | null;
  assessor_email: string | null;
  iqa_email: string | null;
  eqa_email: string | null;
  created_at: string;
};

type CommentRecord = {
  comment: string;
  created_at: string;
  email: string | null;
};

type StageEntryRecord = {
  stage: Stage;
  data: string | null;
  updated_at: string;
  email: string | null;
};

type ChecklistItem = {
  id: string;
  text: string;
};

const htmlHeaders = { "content-type": "text/html; charset=utf-8" };
const jsonHeaders = { "content-type": "application/json; charset=utf-8" };
const oauthStateCookie = "esolqa_oauth_state";
const sessionCookie = "esolqa_session";
const roles: Role[] = ["superuser", "admin", "assessor", "iqa", "eqa"];
const stages: Stage[] = ["assess", "iqa", "eqa"];

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/") return Response.redirect(`${url.origin}/dashboard`, 302);
    if (url.pathname === "/login") return htmlResponse(renderLoginPage());
    if (url.pathname === "/auth/microsoft/start") return startMicrosoftLogin(request, env);
    if (url.pathname === "/auth/microsoft/callback") return handleMicrosoftCallback(request, env);
    if (url.pathname === "/logout") return logout(url);

    const identity = await requireIdentity(request, env);
    if (!identity) return wantsJson(request) ? json({ error: "Not authenticated" }, 401) : Response.redirect(`${url.origin}/login`, 302);
    if (!identity.user) return htmlResponse(renderAccessPendingPage(identity), 403);

    if (url.pathname === "/dashboard") return renderDashboard(request, env, identity);
    if (url.pathname === "/users") return renderUsersPage(env, identity);
    if (url.pathname === "/forms/new") return renderCreateTemplatePage(identity);
    if (url.pathname === "/entries/new") return renderNewEntryPage(env, identity);
    if (url.pathname.startsWith("/entries/")) return renderEntryPage(env, identity, url.pathname.split("/")[2]);

    if (url.pathname === "/api/me") return json(identity);
    if (url.pathname === "/api/users" && request.method === "POST") return createUser(request, env, identity);
    if (url.pathname.startsWith("/api/users/") && request.method === "POST") return deleteUser(request, env, identity, url.pathname.split("/")[3]);
    if (url.pathname === "/api/templates" && request.method === "POST") return createTemplate(request, env, identity);
    if (url.pathname === "/api/entries" && request.method === "POST") return createEntry(request, env, identity);
    if (url.pathname.startsWith("/api/entries/") && url.pathname.endsWith("/stage") && request.method === "POST") return saveEntryStage(request, env, identity, url.pathname.split("/")[3]);
    if (url.pathname.startsWith("/api/entries/") && url.pathname.endsWith("/complete") && request.method === "POST") return markEntryComplete(env, identity, url.pathname.split("/")[3]);
    if (url.pathname.startsWith("/api/entries/") && url.pathname.endsWith("/comments") && request.method === "POST") return addComment(request, env, identity, url.pathname.split("/")[3]);

    return htmlResponse(renderNotFoundPage(), 404);
  },
};

async function renderDashboard(request: Request, env: Env, identity: Identity): Promise<Response> {
  const url = new URL(request.url);
  const section = url.searchParams.get("section") ?? "assessment";
  const search = url.searchParams.get("q") ?? "";
  const entries = await listEntries(env, identity.user!, section, search);
  const templates = await listTemplates(env, search);

  return htmlResponse(renderDashboardPage(identity, section, search, templates, entries));
}

async function renderUsersPage(env: Env, identity: Identity): Promise<Response> {
  if (!isSuperuser(identity.user!)) return htmlResponse(renderForbiddenPage(identity), 403);
  const users = await env.esol_marking_db.prepare("SELECT id, email, role, stage, created_at FROM users ORDER BY created_at DESC, email ASC").all<UserRecord>();

  return htmlResponse(renderUsers(identity, users.results));
}

async function renderCreateTemplatePage(identity: Identity): Promise<Response> {
  if (!canCreateForms(identity.user!)) return htmlResponse(renderForbiddenPage(identity), 403);
  return htmlResponse(renderTemplateForm(identity));
}

async function renderNewEntryPage(env: Env, identity: Identity): Promise<Response> {
  if (!canAssess(identity.user!)) return htmlResponse(renderForbiddenPage(identity), 403);
  const templates = await listTemplates(env, "");
  const iqas = await env.esol_marking_db.prepare("SELECT id, email, role, stage FROM users WHERE role IN ('iqa','admin','superuser') ORDER BY email ASC").all<UserRecord>();

  return htmlResponse(renderEntryStartForm(identity, templates, iqas.results));
}

async function renderEntryPage(env: Env, identity: Identity, id?: string): Promise<Response> {
  if (!id) return htmlResponse(renderNotFoundPage(), 404);
  const entry = await getVisibleEntry(env, identity.user!, id);
  if (!entry) return htmlResponse(renderNotFoundPage(), 404);

  const template = await env.esol_marking_db.prepare("SELECT id, title, description, structure, is_active, created_at FROM form_templates WHERE id = ?").bind(entry.template_id).first<TemplateRecord>();
  if (!template) return htmlResponse(renderNotFoundPage(), 404);

  const stageEntries = await env.esol_marking_db.prepare("SELECT fse.stage, fse.data, fse.updated_at, users.email FROM form_stage_entries fse LEFT JOIN users ON users.id = fse.updated_by WHERE fse.form_entry_id = ?").bind(id).all<StageEntryRecord>();
  const comments = await env.esol_marking_db.prepare("SELECT fc.comment, fc.created_at, users.email FROM form_comments fc LEFT JOIN users ON users.id = fc.created_by WHERE fc.form_entry_id = ? ORDER BY fc.created_at ASC").bind(id).all<CommentRecord>();

  return htmlResponse(renderChecklistEntry(identity, entry, template, stageEntries.results, comments.results));
}

async function listTemplates(env: Env, search: string): Promise<TemplateRecord[]> {
  const like = `%${search}%`;
  const result = await env.esol_marking_db.prepare("SELECT id, title, description, structure, is_active, created_at FROM form_templates WHERE is_active = 1 AND (? = '' OR title LIKE ? OR description LIKE ?) ORDER BY created_at DESC").bind(search, like, like).all<TemplateRecord>();
  return result.results;
}

async function listEntries(env: Env, user: UserRecord, section: string, search: string): Promise<EntryRecord[]> {
  const status = section === "iqa" ? "iqa" : section === "eqa" ? "eqa" : section === "submissions" ? "complete" : "assessment";
  const like = `%${search}%`;
  const query = `SELECT fe.id, fe.template_id, ft.title AS template_title, fe.status, fe.course_code, fe.qualification, fe.teacher, fe.created_at,
    assessor.email AS assessor_email, iqa.email AS iqa_email, eqa.email AS eqa_email
    FROM form_entries fe
    JOIN form_templates ft ON ft.id = fe.template_id
    LEFT JOIN users assessor ON assessor.id = fe.assessor_id
    LEFT JOIN users iqa ON iqa.id = fe.iqa_id
    LEFT JOIN users eqa ON eqa.id = fe.eqa_id
    WHERE fe.status = ?
    AND (? IN ('superuser','admin') OR fe.assessor_id = ? OR fe.iqa_id = ? OR fe.eqa_id = ?)
    AND (? = '' OR fe.course_code LIKE ? OR fe.qualification LIKE ? OR fe.teacher LIKE ? OR ft.title LIKE ?)
    ORDER BY fe.created_at DESC`;
  const result = await env.esol_marking_db.prepare(query).bind(status, user.role, user.id, user.id, user.id, search, like, like, like, like).all<EntryRecord>();
  return result.results;
}

async function getVisibleEntry(env: Env, user: UserRecord, id: string): Promise<EntryRecord | null> {
  const query = `SELECT fe.id, fe.template_id, ft.title AS template_title, fe.status, fe.course_code, fe.qualification, fe.teacher, fe.created_at,
    assessor.email AS assessor_email, iqa.email AS iqa_email, eqa.email AS eqa_email
    FROM form_entries fe
    JOIN form_templates ft ON ft.id = fe.template_id
    LEFT JOIN users assessor ON assessor.id = fe.assessor_id
    LEFT JOIN users iqa ON iqa.id = fe.iqa_id
    LEFT JOIN users eqa ON eqa.id = fe.eqa_id
    WHERE fe.id = ? AND (? IN ('superuser','admin') OR fe.assessor_id = ? OR fe.iqa_id = ? OR fe.eqa_id = ?)`;
  return env.esol_marking_db.prepare(query).bind(id, user.role, user.id, user.id, user.id).first<EntryRecord>();
}

async function createUser(request: Request, env: Env, identity: Identity): Promise<Response> {
  if (!isSuperuser(identity.user!)) return json({ error: "Forbidden" }, 403);
  const body = await request.formData();
  const email = String(body.get("email") ?? "").trim().toLowerCase();
  const role = String(body.get("role") ?? "assessor") as Role;
  const stage = String(body.get("stage") || roleToStage(role));

  if (!email || !roles.includes(role)) return json({ error: "Invalid user" }, 400);

  await env.esol_marking_db.prepare("INSERT INTO users (id, email, role, stage) VALUES (?, ?, ?, ?)").bind(crypto.randomUUID(), email, role, stages.includes(stage as Stage) ? stage : null).run();
  return Response.redirect(new URL("/users", request.url).toString(), 303);
}

async function deleteUser(request: Request, env: Env, identity: Identity, id?: string): Promise<Response> {
  if (!isSuperuser(identity.user!)) return json({ error: "Forbidden" }, 403);
  if (!id || id === identity.user!.id) return Response.redirect(new URL("/users", request.url).toString(), 303);
  const body = await request.formData();
  if (String(body.get("confirm")) !== "DELETE") return Response.redirect(new URL("/users?delete=failed", request.url).toString(), 303);
  await env.esol_marking_db.prepare("DELETE FROM users WHERE id = ?").bind(id).run();
  return Response.redirect(new URL("/users", request.url).toString(), 303);
}

async function createTemplate(request: Request, env: Env, identity: Identity): Promise<Response> {
  if (!canCreateForms(identity.user!)) return json({ error: "Forbidden" }, 403);
  const body = await request.formData();
  const title = String(body.get("title") ?? "").trim();
  const description = String(body.get("description") ?? "").trim();
  const rows = String(body.get("items") ?? "").split("\n").map((text) => text.trim()).filter(Boolean).map((text) => ({ id: crypto.randomUUID(), text }));

  if (!title || rows.length === 0) return json({ error: "Title and checklist rows are required" }, 400);

  await env.esol_marking_db.prepare("INSERT INTO form_templates (id, title, description, structure, created_by) VALUES (?, ?, ?, ?, ?)").bind(crypto.randomUUID(), title, description, JSON.stringify({ items: rows }), identity.user!.id).run();
  return Response.redirect(new URL("/dashboard", request.url).toString(), 303);
}

async function createEntry(request: Request, env: Env, identity: Identity): Promise<Response> {
  if (!canAssess(identity.user!)) return json({ error: "Forbidden" }, 403);
  const body = await request.formData();
  const id = crypto.randomUUID();
  const studentId = crypto.randomUUID();
  const teacher = String(body.get("teacher") ?? "").trim();
  const iqaId = String(body.get("iqa_id") ?? "") || null;

  await env.esol_marking_db.prepare("INSERT INTO students (id, nickname) VALUES (?, ?)").bind(studentId, String(body.get("student") ?? "Anonymous")).run();
  await env.esol_marking_db.prepare("INSERT INTO form_entries (id, student_id, template_id, created_by, assessor_id, iqa_id, status, course_code, qualification, teacher) VALUES (?, ?, ?, ?, ?, ?, 'assessment', ?, ?, ?)").bind(id, studentId, String(body.get("template_id")), identity.user!.id, identity.user!.id, iqaId, String(body.get("course_code") ?? ""), String(body.get("qualification") ?? ""), teacher).run();
  return Response.redirect(new URL(`/entries/${id}`, request.url).toString(), 303);
}

async function saveEntryStage(request: Request, env: Env, identity: Identity, id?: string): Promise<Response> {
  if (!id) return json({ error: "Missing entry" }, 400);
  const entry = await getVisibleEntry(env, identity.user!, id);
  if (!entry) return json({ error: "Not found" }, 404);
  const stage = stageForUser(identity.user!);
  if (!canEditStage(identity.user!, entry.status, stage)) return json({ error: "Forbidden" }, 403);

  const body = await request.formData();
  const data: Record<string, string> = {};
  for (const [key, value] of body.entries()) {
    if (key.startsWith("item_")) data[key.replace("item_", "")] = String(value);
  }

  await env.esol_marking_db.prepare("INSERT INTO form_stage_entries (id, form_entry_id, stage, data, updated_by) VALUES (?, ?, ?, ?, ?) ON CONFLICT(form_entry_id, stage) DO UPDATE SET data = excluded.data, updated_at = CURRENT_TIMESTAMP, updated_by = excluded.updated_by").bind(crypto.randomUUID(), id, stage, JSON.stringify(data), identity.user!.id).run();
  return Response.redirect(new URL(`/entries/${id}`, request.url).toString(), 303);
}

async function markEntryComplete(env: Env, identity: Identity, id?: string): Promise<Response> {
  if (!id) return json({ error: "Missing entry" }, 400);
  const entry = await getVisibleEntry(env, identity.user!, id);
  if (!entry) return json({ error: "Not found" }, 404);

  const nextStatus = entry.status === "assessment" ? "iqa" : entry.status === "iqa" ? "eqa" : "complete";
  await env.esol_marking_db.prepare("UPDATE form_entries SET status = ?, completed_at = CURRENT_TIMESTAMP, completed_by = ? WHERE id = ?").bind(nextStatus, identity.user!.id, id).run();
  return Response.redirect(`/entries/${id}`, 303);
}

async function addComment(request: Request, env: Env, identity: Identity, id?: string): Promise<Response> {
  if (!id) return json({ error: "Missing entry" }, 400);
  const entry = await getVisibleEntry(env, identity.user!, id);
  if (!entry) return json({ error: "Not found" }, 404);
  const body = await request.formData();
  const comment = String(body.get("comment") ?? "").trim();
  if (comment) await env.esol_marking_db.prepare("INSERT INTO form_comments (id, form_entry_id, comment, created_by) VALUES (?, ?, ?, ?)").bind(crypto.randomUUID(), id, comment, identity.user!.id).run();
  return Response.redirect(new URL(`/entries/${id}`, request.url).toString(), 303);
}

async function requireIdentity(request: Request, env: Env): Promise<Identity | null> {
  const session = getCookie(request, sessionCookie);
  const payload = session ? await verifySession(session, env) : null;
  return payload ? getIdentity(payload.email, payload.name, env) : null;
}

async function getIdentity(email: string, name: string | null, env: Env): Promise<Identity> {
  const user = await env.esol_marking_db.prepare("SELECT id, email, role, stage FROM users WHERE lower(email) = lower(?) LIMIT 1").bind(email).first<UserRecord>();
  return { email, name, user, isKnownUser: Boolean(user) };
}

function renderDashboardPage(identity: Identity, section: string, search: string, templates: TemplateRecord[], entries: EntryRecord[]) {
  const canCreate = canCreateForms(identity.user!);
  const contentTitle = section === "iqa" ? "IQA forms" : section === "eqa" ? "EQA forms" : section === "submissions" ? "Submissions" : "Assessment forms";

  return pageShell("Dashboard", `
    <main class="dashboard-shell">
      ${renderSidebar(identity, section)}
      <section class="content">
        ${renderTopbar(identity, contentTitle)}
        <section class="toolbar panel">
          <form method="GET" action="/dashboard" class="search-form">
            <input type="hidden" name="section" value="${escapeHtml(section)}">
            <input name="q" value="${escapeHtml(search)}" placeholder="Search by checklist, course code, qualification or teacher">
            <button type="submit">Search</button>
          </form>
          <div class="actions-row">
            ${canCreate ? `<a class="small-action" href="/forms/new">Create form</a>` : ""}
            ${canAssess(identity.user!) ? `<a class="small-action" href="/entries/new">New assessment entry</a>` : ""}
          </div>
        </section>
        <section class="grid-two">
          <section class="panel">
            <p class="eyebrow">Available checklist forms</p>
            <div class="list-stack">${templates.length ? templates.map(renderTemplateCard).join("") : renderEmpty("No checklist templates found")}</div>
          </section>
          <section class="panel">
            <p class="eyebrow">${escapeHtml(contentTitle)}</p>
            <div class="list-stack">${entries.length ? entries.map(renderEntryCard).join("") : renderEmpty("No forms found for this section")}</div>
          </section>
        </section>
      </section>
    </main>
  `);
}

function renderUsers(identity: Identity, users: UserRecord[]) {
  return pageShell("Users", `
    <main class="dashboard-shell">
      ${renderSidebar(identity, "users")}
      <section class="content">
        ${renderTopbar(identity, "Users")}
        <section class="panel">
          <p class="eyebrow">Create user</p>
          <form method="POST" action="/api/users" class="form-grid">
            <label>Email<input name="email" type="email" required placeholder="staff@example.org"></label>
            <label>Role<select name="role">${roles.map((role) => `<option value="${role}">${role}</option>`).join("")}</select></label>
            <label>Stage<select name="stage"><option value="">Auto</option>${stages.map((stage) => `<option value="${stage}">${stage}</option>`).join("")}</select></label>
            <button type="submit">Create user</button>
          </form>
        </section>
        <section class="panel">
          <p class="eyebrow">All users</p>
          <div class="user-table">${users.map((user) => renderUserRow(user, identity.user!.id)).join("")}</div>
        </section>
      </section>
    </main>
  `);
}

function renderTemplateForm(identity: Identity) {
  return pageShell("Create form", `
    <main class="dashboard-shell">
      ${renderSidebar(identity, "create")}
      <section class="content">
        ${renderTopbar(identity, "Create checklist form")}
        <section class="panel narrow-panel">
          <form method="POST" action="/api/templates" class="stack-form">
            <label>Title<input name="title" required placeholder="Speaking and listening checklist"></label>
            <label>Description<textarea name="description" rows="3" placeholder="What this checklist is used for"></textarea></label>
            <label>Checklist rows<textarea name="items" rows="12" required placeholder="One checklist item per line"></textarea></label>
            <button type="submit">Create form</button>
          </form>
        </section>
      </section>
    </main>
  `);
}

function renderEntryStartForm(identity: Identity, templates: TemplateRecord[], iqas: UserRecord[]) {
  return pageShell("New entry", `
    <main class="dashboard-shell">
      ${renderSidebar(identity, "assessment")}
      <section class="content">
        ${renderTopbar(identity, "New assessment entry")}
        <section class="panel narrow-panel modal-like">
          <form method="POST" action="/api/entries" class="stack-form">
            <label>Template<select name="template_id" required>${templates.map((template) => `<option value="${template.id}">${escapeHtml(template.title)}</option>`).join("")}</select></label>
            <label>Course code<input name="course_code" required></label>
            <label>Qualification<input name="qualification" required></label>
            <label>Teacher / assessor<input name="teacher" value="${escapeHtml(identity.name ?? identity.email)}"></label>
            <label>Student nickname<input name="student" placeholder="Optional anonymous nickname"></label>
            <label>Allocated IQA<select name="iqa_id"><option value="">Choose later</option>${iqas.map((user) => `<option value="${user.id}">${escapeHtml(user.email)}</option>`).join("")}</select></label>
            <button type="submit">Open form</button>
          </form>
        </section>
      </section>
    </main>
  `);
}

function renderChecklistEntry(identity: Identity, entry: EntryRecord, template: TemplateRecord, stageEntries: StageEntryRecord[], comments: CommentRecord[]) {
  const items = parseItems(template.structure);
  const stageData = Object.fromEntries(stageEntries.map((stage) => [stage.stage, parseData(stage.data)])) as Record<Stage, Record<string, string>>;
  const userStage = stageForUser(identity.user!);
  const editable = canEditStage(identity.user!, entry.status, userStage);
  const readonly = entry.status === "complete";

  return pageShell(template.title, `
    <main class="dashboard-shell">
      ${renderSidebar(identity, entry.status)}
      <section class="content">
        ${renderTopbar(identity, template.title)}
        <section class="panel meta-panel">
          <strong>${escapeHtml(entry.course_code ?? "No course code")}</strong>
          <span>${escapeHtml(entry.qualification ?? "No qualification")}</span>
          <span>Teacher: ${escapeHtml(entry.teacher ?? entry.assessor_email ?? "Unknown")}</span>
          <span>Status: ${escapeHtml(entry.status)}</span>
        </section>
        <form method="POST" action="/api/entries/${entry.id}/stage" class="panel checklist-panel">
          <table class="checklist-table">
            <thead><tr><th>Checklist row</th><th>Assessment</th><th>IQA</th><th>EQA</th></tr></thead>
            <tbody>${items.map((item) => renderChecklistRow(item, stageData, userStage, editable && !readonly)).join("")}</tbody>
          </table>
          ${editable && !readonly ? `<button type="submit">Save ${escapeHtml(userStage)} entries</button>` : `<p class="hint">View-only for your current role/status.</p>`}
        </form>
        <section class="panel comments-panel">
          <p class="eyebrow">Paper trail comments</p>
          <div class="list-stack">${comments.length ? comments.map(renderComment).join("") : renderEmpty("No comments yet")}</div>
          ${!readonly ? `<form method="POST" action="/api/entries/${entry.id}/comments" class="comment-form"><textarea name="comment" rows="3" placeholder="Add a paper trail comment"></textarea><button type="submit">Submit comment</button></form>` : ""}
        </section>
        <section class="actions-row">
          ${editable && !readonly ? `<form method="POST" action="/api/entries/${entry.id}/complete"><button type="submit">Mark as complete</button></form>` : ""}
          <button onclick="window.print()" type="button">Print</button>
        </section>
      </section>
    </main>
  `);
}

function renderSidebar(identity: Identity, active: string) {
  const user = identity.user!;
  return `<aside class="sidebar">
    <div class="sidebar-brand"><div class="brand-mark">E</div><div><strong>ESOLQA</strong><span>${escapeHtml(user.role)}</span></div></div>
    <nav>
      ${navLink("/dashboard?section=assessment", "Assessment forms", active === "assessment")}
      ${navLink("/dashboard?section=iqa", "IQA forms", active === "iqa")}
      ${navLink("/dashboard?section=eqa", "EQA forms", active === "eqa")}
      ${navLink("/dashboard?section=submissions", "Submissions", active === "submissions" || active === "complete")}
      ${isSuperuser(user) ? navLink("/users", "Users", active === "users") : ""}
    </nav>
  </aside>`;
}

function renderTopbar(identity: Identity, title: string) {
  return `<header class="topbar"><div><p class="eyebrow">Dashboard</p><h1>${escapeHtml(title)}</h1></div><div class="profile-pill">${escapeHtml(identity.email)}</div><a class="logout-link" href="/logout">Sign out</a></header>`;
}

function renderTemplateCard(template: TemplateRecord) {
  return `<article class="list-card"><strong>${escapeHtml(template.title)}</strong><span>${escapeHtml(template.description ?? "No description")}</span></article>`;
}

function renderEntryCard(entry: EntryRecord) {
  return `<article class="list-card"><strong><a href="/entries/${entry.id}">${escapeHtml(entry.template_title)}</a></strong><span>${escapeHtml(entry.course_code ?? "No course")} · ${escapeHtml(entry.qualification ?? "No qualification")}</span><span>Teacher: ${escapeHtml(entry.teacher ?? entry.assessor_email ?? "Unknown")}</span><span>Status: ${escapeHtml(entry.status)}</span></article>`;
}

function renderUserRow(user: UserRecord, currentUserId: string) {
  return `<div class="user-row"><div><strong>${escapeHtml(user.email)}</strong><span>${escapeHtml(user.role)}${user.stage ? ` · ${escapeHtml(user.stage)}` : ""}</span></div>${user.id !== currentUserId ? `<form method="POST" action="/api/users/${user.id}"><input name="confirm" placeholder="Type DELETE"><button type="submit">Delete</button></form>` : `<span class="hint">Current user</span>`}</div>`;
}

function renderChecklistRow(item: ChecklistItem, stageData: Record<Stage, Record<string, string>>, userStage: Stage, editable: boolean) {
  return `<tr><td>${escapeHtml(item.text)}</td>${stages.map((stage) => `<td>${editable && stage === userStage ? `<textarea name="item_${item.id}" rows="2">${escapeHtml(stageData[stage]?.[item.id] ?? "")}</textarea>` : `<div class="readonly-cell">${escapeHtml(stageData[stage]?.[item.id] ?? "—")}</div>`}</td>`).join("")}</tr>`;
}

function renderComment(comment: CommentRecord) {
  return `<article class="list-card"><strong>${escapeHtml(comment.email ?? "Unknown")}</strong><span>${escapeHtml(comment.comment)}</span><small>${escapeHtml(comment.created_at)}</small></article>`;
}

function renderEmpty(text: string) {
  return `<div class="empty-state"><strong>${escapeHtml(text)}</strong></div>`;
}

function navLink(href: string, label: string, active: boolean) {
  return `<a class="${active ? "nav-active" : ""}" href="${href}">${escapeHtml(label)}</a>`;
}

function renderAccessPendingPage(identity: Identity) {
  return pageShell("Access pending", `<main class="auth-shell"><section class="auth-card"><div class="brand-mark">E</div><p class="eyebrow">Access pending</p><h1>User not found in D1</h1><p class="lede">You signed in as ${escapeHtml(identity.email)}, but a superuser needs to create your ESOLQA user record.</p><a class="primary-action" href="/logout">Sign out</a></section></main>`);
}

function renderForbiddenPage(identity: Identity) {
  return pageShell("Forbidden", `<main class="dashboard-shell">${renderSidebar(identity, "") }<section class="content">${renderTopbar(identity, "Forbidden")}<section class="panel"><h2>You do not have access to this page.</h2></section></section></main>`);
}

function renderNotFoundPage() {
  return pageShell("Not found", `<main class="auth-shell"><section class="auth-card"><h1>Page not found</h1><a class="primary-action" href="/dashboard">Go to dashboard</a></section></main>`);
}

function canCreateForms(user: UserRecord) { return user.role === "admin" || user.role === "superuser"; }
function isSuperuser(user: UserRecord) { return user.role === "superuser"; }
function canAssess(user: UserRecord) { return ["assessor", "admin", "superuser"].includes(user.role); }
function stageForUser(user: UserRecord): Stage { return user.role === "iqa" ? "iqa" : user.role === "eqa" ? "eqa" : user.stage ?? "assess"; }
function roleToStage(role: Role): Stage | null { return role === "iqa" ? "iqa" : role === "eqa" ? "eqa" : role === "assessor" ? "assess" : null; }
function canEditStage(user: UserRecord, status: EntryStatus, stage: Stage) { return user.role === "superuser" || user.role === "admin" || (status === "assessment" && stage === "assess") || (status === "iqa" && stage === "iqa") || (status === "eqa" && stage === "eqa"); }
function parseItems(structure: string): ChecklistItem[] { try { const parsed = JSON.parse(structure) as { items?: ChecklistItem[] }; return parsed.items ?? []; } catch { return []; } }
function parseData(data: string | null): Record<string, string> { try { return data ? JSON.parse(data) as Record<string, string> : {}; } catch { return {}; } }
function wantsJson(request: Request) { return request.headers.get("accept")?.includes("application/json"); }
function json(value: unknown, status = 200) { return new Response(JSON.stringify(value), { status, headers: jsonHeaders }); }

function renderLoginPage() {
  return pageShell("Sign in", `<main class="auth-shell"><section class="auth-card"><div class="brand-mark">E</div><p class="eyebrow">ESOLQA</p><h1>Sign in to continue</h1><p class="lede">Use your Microsoft work account to access assessment forms, IQA reviews, and EQA records.</p><a class="primary-action" href="/auth/microsoft/start">Continue with Microsoft</a><p class="hint">You will be redirected to Microsoft, then returned securely to ESOLQA.</p></section></main>`);
}

function renderConfigMissingPage() {
  return pageShell("Microsoft login not configured", `<main class="auth-shell"><section class="auth-card"><div class="brand-mark">E</div><p class="eyebrow">Configuration needed</p><h1>Microsoft login is not ready yet</h1><p class="lede">The Worker needs Microsoft OAuth secrets before users can sign in.</p></section></main>`);
}

function renderAuthErrorPage(message: string) {
  return pageShell("Sign-in error", `<main class="auth-shell"><section class="auth-card"><div class="brand-mark">E</div><p class="eyebrow">Sign-in error</p><h1>Could not sign you in</h1><p class="lede">${escapeHtml(message)}</p><a class="primary-action" href="/login">Try again</a></section></main>`);
}

async function startMicrosoftLogin(request: Request, env: Env): Promise<Response> {
  const config = getMicrosoftConfig(env);
  if (!config) return htmlResponse(renderConfigMissingPage(), 500);
  const url = new URL(request.url);
  const state = crypto.randomUUID();
  const redirectUri = `${url.origin}/auth/microsoft/callback`;
  const authorizeUrl = new URL(`https://login.microsoftonline.com/${config.tenantId}/oauth2/v2.0/authorize`);
  authorizeUrl.searchParams.set("client_id", config.clientId);
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("response_mode", "query");
  authorizeUrl.searchParams.set("scope", "openid profile email User.Read");
  authorizeUrl.searchParams.set("state", state);
  return new Response(null, { status: 302, headers: { location: authorizeUrl.toString(), "set-cookie": serializeCookie(oauthStateCookie, state, 600) } });
}

async function handleMicrosoftCallback(request: Request, env: Env): Promise<Response> {
  const config = getMicrosoftConfig(env);
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const savedState = getCookie(request, oauthStateCookie);
  if (!config) return htmlResponse(renderConfigMissingPage(), 500);
  if (!code || !state || !savedState || state !== savedState) return htmlResponse(renderAuthErrorPage("Microsoft sign-in could not be verified."), 400);
  const redirectUri = `${url.origin}/auth/microsoft/callback`;
  const tokenResponse = await fetch(`https://login.microsoftonline.com/${config.tenantId}/oauth2/v2.0/token`, { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ client_id: config.clientId, client_secret: config.clientSecret, code, redirect_uri: redirectUri, grant_type: "authorization_code" }) });
  if (!tokenResponse.ok) return htmlResponse(renderAuthErrorPage(`Microsoft rejected the sign-in request. ${safeMicrosoftError(await tokenResponse.text())}`), 401);
  const tokenData = await tokenResponse.json() as { access_token?: string };
  if (!tokenData.access_token) return htmlResponse(renderAuthErrorPage("Microsoft did not return an access token."), 401);
  const profileResponse = await fetch("https://graph.microsoft.com/v1.0/me?$select=displayName,mail,userPrincipalName", { headers: { authorization: `Bearer ${tokenData.access_token}` } });
  if (!profileResponse.ok) return htmlResponse(renderAuthErrorPage(`Could not load your Microsoft profile. ${safeMicrosoftError(await profileResponse.text())}`), 401);
  const profile = await profileResponse.json() as MicrosoftUser;
  const email = profile.mail ?? profile.userPrincipalName;
  if (!email) return htmlResponse(renderAuthErrorPage("Your Microsoft account did not provide an email address."), 401);
  const session = await createSession({ email, name: profile.displayName ?? null }, env);
  const headers = new Headers({ location: `${url.origin}/dashboard` });
  headers.append("set-cookie", serializeCookie(sessionCookie, session, 60 * 60 * 8));
  headers.append("set-cookie", clearCookie(oauthStateCookie));
  return new Response(null, { status: 302, headers });
}

function logout(url: URL): Response { return new Response(null, { status: 302, headers: { location: `${url.origin}/login`, "set-cookie": clearCookie(sessionCookie) } }); }
function getMicrosoftConfig(env: Env) { return env.MICROSOFT_CLIENT_ID && env.MICROSOFT_CLIENT_SECRET && env.MICROSOFT_TENANT_ID && env.SESSION_SECRET ? { clientId: env.MICROSOFT_CLIENT_ID, clientSecret: env.MICROSOFT_CLIENT_SECRET, tenantId: env.MICROSOFT_TENANT_ID } : null; }
async function createSession(payload: { email: string; name: string | null }, env: Env): Promise<string> { const body = base64UrlEncode(JSON.stringify({ ...payload, expiresAt: Date.now() + 1000 * 60 * 60 * 8 })); return `${body}.${await sign(body, env)}`; }
async function verifySession(session: string, env: Env): Promise<{ email: string; name: string | null } | null> { const [body, signature] = session.split("."); if (!body || !signature || signature !== await sign(body, env)) return null; try { const payload = JSON.parse(base64UrlDecode(body)) as { email?: string; name?: string | null; expiresAt?: number }; return payload.email && payload.expiresAt && payload.expiresAt > Date.now() ? { email: payload.email, name: payload.name ?? null } : null; } catch { return null; } }
async function sign(value: string, env: Env): Promise<string> { const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(env.SESSION_SECRET ?? "local-development-session-secret"), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]); return base64UrlEncodeBytes(new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value)))); }
function getCookie(request: Request, name: string): string | null { const cookieHeader = request.headers.get("cookie"); if (!cookieHeader) return null; const match = cookieHeader.split(";").map((cookie) => cookie.trim()).find((cookie) => cookie.startsWith(`${name}=`)); return match ? decodeURIComponent(match.slice(name.length + 1)) : null; }
function serializeCookie(name: string, value: string, maxAge: number): string { return `${name}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; HttpOnly; Secure; SameSite=Lax`; }
function clearCookie(name: string): string { return `${name}=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Lax`; }
function base64UrlEncode(value: string): string { return base64UrlEncodeBytes(new TextEncoder().encode(value)); }
function base64UrlEncodeBytes(bytes: Uint8Array): string { let binary = ""; for (const byte of bytes) binary += String.fromCharCode(byte); return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", ""); }
function base64UrlDecode(value: string): string { const base64 = value.replaceAll("-", "+").replaceAll("_", "/").padEnd(Math.ceil(value.length / 4) * 4, "="); return new TextDecoder().decode(Uint8Array.from(atob(base64), (char) => char.charCodeAt(0))); }
function safeMicrosoftError(value: string): string { try { const parsed = JSON.parse(value) as { error?: string; error_description?: string }; return [parsed.error, parsed.error_description].filter(Boolean).join(": ") || "No extra error details were returned."; } catch { return value.slice(0, 500); } }
function htmlResponse(body: string, status = 200) { return new Response(body, { status, headers: htmlHeaders }); }

function pageShell(title: string, body: string) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(title)} | ESOLQA</title><style>
    :root{--bg:#eef4ff;--panel:#fff;--text:#14213d;--muted:#637083;--primary:#4f00d8;--primary-dark:#35009a;--border:#d9e2f1;--success:#e9f8ef;--warn:#fff7e6;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}*{box-sizing:border-box}body{margin:0;background:radial-gradient(circle at top left,#dbe9ff,transparent 34rem),var(--bg);color:var(--text);min-height:100vh}a{color:inherit;text-decoration:none}button,.small-action,.primary-action{border:0;border-radius:999px;background:var(--primary);color:#fff;font-weight:800;padding:.8rem 1.1rem;cursor:pointer;display:inline-flex;justify-content:center}.primary-action{width:100%;margin:1rem 0}.small-action{width:auto}.primary-action:hover,button:hover,.small-action:hover{background:var(--primary-dark)}input,select,textarea{width:100%;border:1px solid var(--border);border-radius:.9rem;padding:.75rem;font:inherit}textarea{resize:vertical}.auth-shell{min-height:100vh;display:grid;place-items:center;padding:2rem}.auth-card{width:min(100%,30rem);background:rgba(255,255,255,.92);border:1px solid var(--border);border-radius:2rem;box-shadow:0 1.5rem 5rem rgba(20,33,61,.12);padding:2.5rem;text-align:center}.brand-mark{width:3rem;height:3rem;display:inline-grid;place-items:center;border-radius:1rem;background:linear-gradient(135deg,var(--primary),#7c3aed);color:#fff;font-weight:800}.eyebrow{margin:0 0 .5rem;color:var(--primary);font-size:.75rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase}h1,h2,p{margin-top:0}h1{font-size:clamp(2rem,5vw,3rem);line-height:1;margin-bottom:1rem}.lede,.hint{color:var(--muted);line-height:1.6}.dashboard-shell{display:grid;grid-template-columns:17rem 1fr;min-height:100vh}.sidebar{background:#0f1b33;color:#fff;padding:1.5rem}.sidebar-brand{display:flex;align-items:center;gap:.8rem;margin-bottom:2rem}.sidebar-brand span{display:block;color:#9fb0cc;font-size:.85rem}nav{display:grid;gap:.4rem}nav a{padding:.8rem 1rem;border-radius:.9rem;color:#c8d3e7}nav a:hover,.nav-active{background:rgba(255,255,255,.1);color:#fff}.content{padding:2rem}.topbar{display:flex;align-items:center;justify-content:space-between;gap:1rem;margin-bottom:1.5rem}.profile-pill{background:var(--panel);border:1px solid var(--border);border-radius:999px;padding:.7rem 1rem;color:var(--muted);font-weight:700}.logout-link{color:var(--primary);font-weight:800}.panel{background:var(--panel);border:1px solid var(--border);border-radius:1.5rem;box-shadow:0 1rem 3rem rgba(20,33,61,.08);padding:1.5rem;margin-bottom:1.5rem}.toolbar{display:flex;justify-content:space-between;gap:1rem;align-items:center}.search-form{display:flex;gap:.8rem;flex:1}.actions-row{display:flex;gap:.8rem;align-items:center;flex-wrap:wrap}.grid-two{display:grid;grid-template-columns:1fr 1fr;gap:1rem}.list-stack{display:grid;gap:.8rem}.list-card{display:grid;gap:.35rem;border:1px solid var(--border);border-radius:1rem;padding:1rem}.list-card span,.list-card small{color:var(--muted)}.empty-state{border:1px dashed var(--border);border-radius:1rem;padding:1.5rem;text-align:center;color:var(--muted)}.form-grid{display:grid;grid-template-columns:2fr 1fr 1fr auto;gap:1rem;align-items:end}.stack-form{display:grid;gap:1rem}.narrow-panel{max-width:54rem}.modal-like{margin:auto}.user-table{display:grid;gap:.8rem}.user-row{display:flex;justify-content:space-between;gap:1rem;align-items:center;border-bottom:1px solid var(--border);padding:.8rem 0}.user-row span{display:block;color:var(--muted)}.user-row form{display:flex;gap:.5rem}.meta-panel{display:flex;gap:1rem;flex-wrap:wrap}.checklist-panel{overflow:auto}.checklist-table{width:100%;border-collapse:collapse}.checklist-table th,.checklist-table td{border:1px solid var(--border);padding:.8rem;vertical-align:top}.checklist-table th{background:#f6f8fc;text-align:left}.readonly-cell{min-height:3rem;color:var(--muted);white-space:pre-wrap}.comment-form{display:grid;gap:.8rem;margin-top:1rem}@media(max-width:900px){.dashboard-shell,.grid-two{grid-template-columns:1fr}.toolbar,.topbar,.form-grid{display:grid;grid-template-columns:1fr}.search-form{display:grid}.user-row{display:grid}}
  </style></head><body>${body}</body></html>`;
}

function escapeHtml(value: string) { return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;"); }
