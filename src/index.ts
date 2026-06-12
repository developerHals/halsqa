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

// Question types for modular forms
type QuestionType =
  | "single_choice"
  | "multiple_choice"
  | "dropdown"
  | "text"
  | "textarea"
  | "date"
  | "currency"
  | "ranking"
  | "likert"
  | "yes_no"
  | "file_upload"
  | "rag"
  | "ggaw"
  | "number"
  | "rating";

type QuestionOption = {
  id: string;
  label: string;
  value: string;
};

type TemplateQuestion = {
  id: string;
  template_id: string;
  question_text: string;
  question_type: QuestionType;
  options: QuestionOption[] | null;
  has_text_entry: number;
  text_entry_label: string | null;
  is_required: number;
  sort_order: number;
  visible_to_assessor: number;
  visible_to_iqa: number;
  visible_to_eqa: number;
};

type CommentCategory = {
  id: string;
  template_id: string;
  name: string;
  description: string | null;
  sort_order: number;
};

type TemplateWithQuestions = TemplateRecord & {
  questions: TemplateQuestion[];
  commentCategories: CommentCategory[];
};

type EntryHeader = {
  id: string;
  form_entry_id: string;
  course_id: string;
  qualification_aim: string;
  course_name: string;
  assessor_id: string | null;
  assessor_date: string | null;
  iqa_id: string | null;
  iqa_date: string | null;
  eqa_id: string | null;
  eqa_name: string | null;
  eqa_date: string | null;
};

type EnhancedEntryRecord = EntryRecord & {
  header: EntryHeader | null;
  is_finalized: number;
};

type StageData = {
  answers: Record<string, string | string[]>;
  textEntries: Record<string, string>;
  agreed_with_previous: number;
  marked_complete_at: string | null;
  marked_complete_by: string | null;
};

type EnhancedStageEntryRecord = {
  stage: Stage;
  data: string | null;
  updated_at: string;
  email: string | null;
  agreed_with_previous: number;
  marked_complete_at: string | null;
  marked_complete_by: string | null;
};

type CommentWithCategory = {
  id: string;
  comment: string;
  created_at: string;
  email: string | null;
  category_id: string | null;
  category_name: string | null;
  is_pinned: number;
};

type LWTemplateRecord = {
  id: string;
  title: string;
  description: string | null;
  is_active: number;
  created_by: string | null;
  created_at: string;
};

type LWTemplateQuestion = {
  id: string;
  template_id: string;
  question_text: string;
  question_type: QuestionType | "rag";
  options: QuestionOption[] | null;
  has_text_entry: number;
  text_entry_label: string | null;
  is_required: number;
  sort_order: number;
};

type LWTemplateWithQuestions = LWTemplateRecord & {
  questions: LWTemplateQuestion[];
};

type LWEntryRecord = {
  id: string;
  template_id: string;
  template_title: string;
  course_id: string;
  course_name: string;
  assessor_name: string;
  iqa_name: string;
  planned_date: string;
  due_date: string | null;
  status: "pending" | "iqa_completed" | "assessor_responded" | "complete";
  allocated_iqa_id: string | null;
  allocated_assessor_id: string | null;
  iqa_email: string | null;
  assessor_email: string | null;
  created_by: string | null;
  created_at: string;
  iqa_completed_at: string | null;
  assessor_responded_at: string | null;
};

type LWComment = {
  id: string;
  entry_id: string;
  author_id: string | null;
  author_role: "iqa" | "assessor" | "admin" | "superuser";
  comment: string;
  created_at: string;
  author_email: string | null;
};

type LWAnswer = {
  question_id: string;
  answer: string | null;
};

type LWNotification = {
  id: string;
  user_id: string;
  entry_id: string | null;
  message: string;
  is_read: number;
  created_at: string;
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

    // Serve static files from public folder
    if (url.pathname === "/favicon.png" || url.pathname.startsWith("/public/")) {
      return serveStaticFile(url.pathname, env);
    }

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

    if (url.pathname === "/api/me") return json(identity);
    if (url.pathname === "/api/users" && request.method === "POST") return createUser(request, env, identity);
    if (url.pathname.startsWith("/api/users/") && request.method === "POST") return deleteUser(request, env, identity, url.pathname.split("/")[3]);

    // Learning Walks dashboard only
    if (url.pathname === "/learning-walks") return renderLWDashboard(request, env, identity);

    // Redirect old /new route to /build
    if (url.pathname === "/learning-walks/templates/new") {
      return new Response(null, { status: 302, headers: { Location: "/learning-walks/templates/build" } });
    }

    // Learning Walk Template Builder
    if (url.pathname === "/learning-walks/templates/build" || url.pathname.match(/^\/learning-walks\/templates\/[^/]+\/build$/)) {
      return renderLWTemplateBuilder(request, env, identity);
    }

    // Learning Walk Template API
    if (url.pathname === "/api/lw/templates" && request.method === "POST") {
      return saveLWTemplate(request, env, identity);
    }
    if (url.pathname.match(/^\/api\/lw\/templates\/[^/]+$/) && request.method === "POST") {
      return updateLWTemplate(request, env, identity, url.pathname.split("/")[4]);
    }
    if (url.pathname.match(/^\/api\/lw\/templates\/[^/]+\/delete$/) && request.method === "POST") {
      return deleteLWTemplate(request, env, identity, url.pathname.split("/")[4]);
    }

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


async function requireIdentity(request: Request, env: Env): Promise<Identity | null> {
  const session = getCookie(request, sessionCookie);
  const payload = session ? await verifySession(session, env) : null;
  return payload ? getIdentity(payload.email, payload.name, env) : null;
}

async function getIdentity(email: string, name: string | null, env: Env): Promise<Identity> {
  const user = await env.esol_marking_db.prepare("SELECT id, email, role, stage FROM users WHERE lower(email) = lower(?) LIMIT 1").bind(email).first<UserRecord>();
  return { email, name, user, isKnownUser: Boolean(user) };
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

function renderDashboardPage(identity: Identity, section: string, search: string, templates: TemplateRecord[], entries: EntryRecord[]) {
  const canCreate = canCreateForms(identity.user!);
  const isAdmin = identity.user!.role === "admin" || identity.user!.role === "superuser";
  const contentTitle = section === "iqa" ? "IQA submissions" : section === "eqa" ? "EQA submissions" : section === "submissions" ? "Submissions" : "Assessment submissions";

  return pageShell("Dashboard", `
    <main class="dashboard-shell">
      ${renderSidebar(identity, section)}
      <section class="content">
        ${renderTopbar(identity, contentTitle)}
        
        <!-- Templates Section - All users see all templates -->
        <section class="panel templates-section">
          <div class="section-header">
            <p class="eyebrow">Available checklist forms</p>
            <form method="GET" action="/dashboard" class="search-form-inline">
              <input type="hidden" name="section" value="${escapeHtml(section)}">
              <input name="q" value="${escapeHtml(search)}" placeholder="Search forms by name...">
              <button type="submit">Search</button>
            </form>
          </div>
          <div class="list-stack templates-list">${templates.length ? templates.map(t => renderTemplateCard(t, identity.user || undefined)).join("") : renderEmpty("No checklist templates found")}</div>
        </section>
        
        <!-- Submissions Section - Role based visibility -->
        <section class="panel submissions-section">
          <div class="section-header">
            <p class="eyebrow">${escapeHtml(contentTitle)}</p>
            <form method="GET" action="/dashboard" class="search-form-inline">
              <input type="hidden" name="section" value="${escapeHtml(section)}">
              <input name="q" value="${escapeHtml(search)}" placeholder="Search submissions...">
              <button type="submit">Search</button>
            </form>
          </div>
          <div class="list-stack">${entries.length ? entries.map(renderEntryCard).join("") : renderEmpty("No submissions found")}</div>
        </section>
        
        <!-- Action Buttons -->
        <section class="toolbar panel">
          <div class="actions-row">
            ${canCreate ? `<a class="small-action" href="/forms/new">+ Create form</a>` : ""}
            ${canAssess(identity.user!) ? `<a class="small-action" href="/entries/new">+ New assessment entry</a>` : ""}
          </div>
        </section>
      </section>
    </main>
    
    <script>
      function confirmDelete(form) {
        const confirmText = prompt('To delete this template, type DELETE:');
        if (confirmText !== 'DELETE') {
          alert('Template not deleted. You must type DELETE to confirm.');
          return false;
        }
        return true;
      }
    </script>
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



function renderComment(comment: CommentRecord) {
  return `<article class="list-card"><strong>${escapeHtml(comment.email ?? "Unknown")}</strong><span>${escapeHtml(comment.comment)}</span><small>${escapeHtml(comment.created_at)}</small></article>`;
}

function renderEmpty(text: string) {
  return `<div class="empty-state"><strong>${escapeHtml(text)}</strong></div>`;
}

function navLink(href: string, label: string, active: boolean) {
  return `<a class="${active ? "nav-active" : ""}" href="${href}">${escapeHtml(label)}</a>`;
}

function renderTemplateCard(t: TemplateRecord, user?: UserRecord) {
  return `<article class="list-card template-card">
    <div class="card-content">
      <strong>${escapeHtml(t.title)}</strong>
      <span>${escapeHtml(t.description || "No description")}</span>
    </div>
  </article>`;
}

function renderEntryCard(e: EntryRecord) {
  return `<article class="list-card entry-card">
    <div class="card-content">
      <strong>${escapeHtml(e.template_title)}</strong>
      <span>${escapeHtml(e.teacher || "Unknown")} · ${escapeHtml(e.course_code || "No course")}</span>
    </div>
    <span class="status-badge ${e.status}">${e.status}</span>
  </article>`;
}

function renderUserRow(user: UserRecord, currentUserId: string) {
  return `<div class="user-row">
    <span>${escapeHtml(user.email)}</span>
    <span class="role-badge">${user.role}</span>
    ${user.id !== currentUserId ? `<form method="POST" action="/api/users/${user.id}" style="display:inline"><input type="hidden" name="confirm" value="DELETE"><button type="submit" class="delete-btn" onclick="return confirm('Delete this user?')">Delete</button></form>` : "<span>(You)</span>"}
  </div>`;
}

function renderAccessPendingPage(identity: Identity) {
  return pageShell("Access pending", `<main class="auth-shell"><section class="auth-card"><div class="brand-mark">E</div><p class="eyebrow">Access pending</p><h1>User not found in D1</h1><p class="lede">You signed in as ${escapeHtml(identity.email)}, but a superuser needs to create your ESOLQA user record.</p><a class="primary-action" href="/logout">Sign out</a></section></main>`);
}

function renderForbiddenPage(identity: Identity) {
  return pageShell("Forbidden", `<main class="dashboard-shell">${renderSidebar(identity, "") }<section class="content">${renderTopbar(identity, "Forbidden")}<section class="panel"><h2>You do not have access to this page.</h2></section></section></main>`);
}

// ─── Learning Walks: data helpers ────────────────────────────────────────────

async function getLWTemplates(env: Env): Promise<LWTemplateRecord[]> {
  const r = await env.esol_marking_db.prepare("SELECT id, title, description, is_active, created_by, created_at FROM lw_templates WHERE is_active = 1 ORDER BY created_at DESC").all<LWTemplateRecord>();
  return r.results;
}

async function getLWTemplateWithQuestions(env: Env, templateId: string): Promise<LWTemplateWithQuestions | null> {
  const tmpl = await env.esol_marking_db.prepare("SELECT id, title, description, is_active, created_by, created_at FROM lw_templates WHERE id = ? LIMIT 1").bind(templateId).first<LWTemplateRecord>();
  if (!tmpl) return null;
  const qs = await env.esol_marking_db.prepare("SELECT id, template_id, question_text, question_type, options, has_text_entry, text_entry_label, is_required, sort_order FROM lw_template_questions WHERE template_id = ? ORDER BY sort_order ASC").bind(templateId).all<LWTemplateQuestion & { options: string | null }>();
  const questions: LWTemplateQuestion[] = qs.results.map(q => ({ ...q, options: q.options ? JSON.parse(q.options) as QuestionOption[] : null }));
  return { ...tmpl, questions };
}

async function getLWEntries(env: Env, user: UserRecord, search: string): Promise<LWEntryRecord[]> {
  const like = `%${search}%`;
  const isPrivileged = user.role === "admin" || user.role === "superuser";
  const query = `SELECT e.id, e.template_id, t.title AS template_title,
    e.course_id, e.course_name, e.assessor_name, e.iqa_name, e.planned_date, e.due_date,
    e.status, e.allocated_iqa_id, e.allocated_assessor_id,
    iqa.email AS iqa_email, assr.email AS assessor_email,
    e.created_by, e.created_at, e.iqa_completed_at, e.assessor_responded_at
    FROM lw_entries e
    JOIN lw_templates t ON t.id = e.template_id
    LEFT JOIN users iqa ON iqa.id = e.allocated_iqa_id
    LEFT JOIN users assr ON assr.id = e.allocated_assessor_id
    WHERE (? = 1 OR e.allocated_iqa_id = ? OR e.allocated_assessor_id = ?)
    AND (? = '' OR e.course_name LIKE ? OR e.assessor_name LIKE ? OR e.iqa_name LIKE ? OR t.title LIKE ?)
    ORDER BY e.created_at DESC`;
  const r = await env.esol_marking_db.prepare(query).bind(isPrivileged ? 1 : 0, user.id, user.id, search, like, like, like, like).all<LWEntryRecord>();
  return r.results;
}

async function getLWEntry(env: Env, user: UserRecord, id: string): Promise<LWEntryRecord | null> {
  const isPrivileged = user.role === "admin" || user.role === "superuser";
  const r = await env.esol_marking_db.prepare(`SELECT e.id, e.template_id, t.title AS template_title,
    e.course_id, e.course_name, e.assessor_name, e.iqa_name, e.planned_date, e.due_date,
    e.status, e.allocated_iqa_id, e.allocated_assessor_id,
    iqa.email AS iqa_email, assr.email AS assessor_email,
    e.created_by, e.created_at, e.iqa_completed_at, e.assessor_responded_at
    FROM lw_entries e
    JOIN lw_templates t ON t.id = e.template_id
    LEFT JOIN users iqa ON iqa.id = e.allocated_iqa_id
    LEFT JOIN users assr ON assr.id = e.allocated_assessor_id
    WHERE e.id = ? AND (? = 1 OR e.allocated_iqa_id = ? OR e.allocated_assessor_id = ?)
    LIMIT 1`).bind(id, isPrivileged ? 1 : 0, user.id, user.id).first<LWEntryRecord>();
  return r;
}

async function getLWAnswers(env: Env, entryId: string): Promise<LWAnswer[]> {
  const r = await env.esol_marking_db.prepare("SELECT question_id, answer FROM lw_answers WHERE entry_id = ?").bind(entryId).all<LWAnswer>();
  return r.results;
}

async function getLWComments(env: Env, entryId: string): Promise<LWComment[]> {
  const r = await env.esol_marking_db.prepare("SELECT c.id, c.entry_id, c.author_id, c.author_role, c.comment, c.created_at, u.email AS author_email FROM lw_comments c LEFT JOIN users u ON u.id = c.author_id WHERE c.entry_id = ? ORDER BY c.created_at ASC").bind(entryId).all<LWComment>();
  return r.results;
}

async function getLWNotifications(env: Env, userId: string): Promise<LWNotification[]> {
  const r = await env.esol_marking_db.prepare("SELECT id, user_id, entry_id, message, is_read, created_at FROM lw_notifications WHERE user_id = ? AND is_read = 0 ORDER BY created_at DESC").bind(userId).all<LWNotification>();
  return r.results;
}

async function createLWNotification(env: Env, userId: string, entryId: string, message: string) {
  await env.esol_marking_db.prepare("INSERT INTO lw_notifications (id, user_id, entry_id, message) VALUES (?, ?, ?, ?)").bind(crypto.randomUUID(), userId, entryId, message).run();
}

// ─── Learning Walks: page handlers ───────────────────────────────────────────

async function renderLWDashboard(request: Request, env: Env, identity: Identity): Promise<Response> {
  const url = new URL(request.url);
  const search = url.searchParams.get("q") ?? "";
  const user = identity.user!;
  const [entries, templates, notifications] = await Promise.all([
    getLWEntries(env, user, search),
    getLWTemplates(env),
    getLWNotifications(env, user.id),
  ]);
  return htmlResponse(renderLWDashboardPage(identity, entries, templates, notifications, search));
}

// ─── Learning Walks: renderers ─────────────────────────────────────────────────

function renderLWStatusBadge(status: LWEntryRecord["status"], dueDate: string | null): string {
  const today = new Date().toISOString().split("T")[0];
  const isOverdue = dueDate && dueDate < today && status !== "complete";
  const labels: Record<string, string> = { pending: "Pending", iqa_completed: "IQA Completed", assessor_responded: "Assessor Responded", complete: "Complete" };
  const colors: Record<string, string> = { pending: "#fef3c7;color:#92400e", iqa_completed: "#dbeafe;color:#1e40af", assessor_responded: "#dcfce7;color:#166534", complete: "#f1f5f9;color:#475569" };
  const badge = `<span class="lw-status-badge" style="background:${colors[status] ?? "#f1f5f9;color:#475569"}">${labels[status] ?? status}</span>`;
  return isOverdue ? `${badge} <span class="lw-overdue-badge lw-blink">⚠ OVERDUE</span>` : badge;
}

function renderLWNotificationBell(notifications: LWNotification[]): string {
  const count = notifications.length;
  if (count === 0) return `<div class="lw-bell">🔔</div>`;
  return `<div class="lw-bell lw-bell-active lw-blink" onclick="document.getElementById('lw-notif-panel').classList.toggle('hidden')" title="${count} unread notification(s)">
    🔔 <span class="lw-bell-count">${count}</span>
    <div id="lw-notif-panel" class="lw-notif-panel hidden">
      ${notifications.map(n => `
        <div class="lw-notif-item">
          <span>${escapeHtml(n.message)}</span>
          <form method="POST" action="/api/lw/notifications/${n.id}/read" style="display:inline">
            <button type="submit" class="lw-notif-dismiss">✓</button>
          </form>
        </div>
      `).join("")}
    </div>
  </div>`;
}

function renderLWDashboardPage(identity: Identity, entries: LWEntryRecord[], templates: LWTemplateRecord[], notifications: LWNotification[], search: string): string {
  const user = identity.user!;
  const canManage = canCreateForms(user);
  const today = new Date().toISOString().split("T")[0];

  return pageShell("Learning Walks", `
    <main class="dashboard-shell">
      ${renderSidebar(identity, "learning-walks")}
      <section class="content">
        <header class="topbar">
          <div><p class="eyebrow">Learning Walks</p><h1>Learning Walks</h1></div>
          <div style="display:flex;align-items:center;gap:1rem">
            ${renderLWNotificationBell(notifications)}
            <div class="profile-pill">${escapeHtml(identity.email)}</div>
            <a class="logout-link" href="/logout">Sign out</a>
          </div>
        </header>

        ${canManage ? `
        <section class="panel templates-section">
          <div class="section-header">
            <p class="eyebrow">Learning Walk Templates</p>
            <a class="small-action" href="/learning-walks/templates/build">+ New template</a>
          </div>
          <div class="list-stack templates-list">
            ${templates.length ? templates.map(t => `
              <article class="list-card template-card">
                <div class="card-content">
                  <strong>${escapeHtml(t.title)}</strong>
                  <span>${escapeHtml(t.description ?? "No description")}</span>
                </div>
                <div class="card-actions">
                  <a href="/learning-walks/templates/${t.id}/build" class="action-btn edit-btn" title="Edit">✏️</a>
                  <form method="POST" action="/api/lw/templates/${t.id}/delete" class="delete-form" onsubmit="return confirmDelete(this)">
                    <input type="hidden" name="confirm" value="DELETE">
                    <button type="submit" class="action-btn delete-btn" title="Delete">🗑️</button>
                  </form>
                </div>
              </article>`).join("") : `<p class="hint">No templates yet. Create one to get started.</p>`}
          </div>
        </section>
        ` : ""}

        <section class="panel submissions-section">
          <div class="section-header">
            <p class="eyebrow">Learning Walk Submissions</p>
            <div style="display:flex;gap:0.75rem;align-items:center;flex-wrap:wrap">
              <form method="GET" action="/learning-walks" class="search-form-inline">
                <input name="q" value="${escapeHtml(search)}" placeholder="Search by course, assessor, IQA...">
                <button type="submit">Search</button>
              </form>
              ${canManage ? `<a class="small-action" href="/learning-walks/entries/new">+ New learning walk</a>` : ""}
            </div>
          </div>
          <div class="list-stack">
            ${entries.length ? entries.map(e => {
              const isOverdue = e.due_date && e.due_date < today && e.status !== "complete";
              return `<article class="list-card${isOverdue ? " lw-overdue-card" : ""}">
                <a href="/learning-walks/entries/${e.id}" style="display:block;flex:1">
                  <strong>${escapeHtml(e.template_title)}</strong>
                  <span>Course: ${escapeHtml(e.course_name)} (${escapeHtml(e.course_id)})</span>
                  <span>Assessor: ${escapeHtml(e.assessor_name)} · IQA: ${escapeHtml(e.iqa_name)}</span>
                  <span>Planned: ${escapeHtml(e.planned_date)}${e.due_date ? ` · Due: ${escapeHtml(e.due_date)}` : ""}</span>
                </a>
                <div>${renderLWStatusBadge(e.status, e.due_date)}</div>
              </article>`;
            }).join("") : renderEmpty("No learning walks found")}
          </div>
        </section>
      </section>
    </main>
    <script>
      function confirmDelete(form) {
        const t = prompt("Type DELETE to confirm:");
        if (t !== "DELETE") { alert("Cancelled."); return false; }
        return true;
      }
    </script>
  `);
}

function renderLWTemplateBuilderPage(identity: Identity, template: LWTemplateWithQuestions | null, users: UserRecord[]): string {
  const isEdit = !!template;
  const templateId = template?.id ?? "";
  const title = template?.title ?? "";
  const description = template?.description ?? "";
  let questions = template?.questions ?? [];

  // Filter users by role for dropdowns
  const assessors = users.filter(u => u.role === "assessor" || u.role === "admin" || u.role === "superuser");
  const iqas = users.filter(u => u.role === "iqa" || u.role === "admin" || u.role === "superuser");

  // For new templates, auto-populate with fixed header fields as questions
  if (!isEdit && questions.length === 0) {
    const assessorOptions = assessors.map(u => ({ id: u.id, label: u.email, value: u.id }));
    const iqaOptions = iqas.map(u => ({ id: u.id, label: u.email, value: u.id }));

    const fixedQuestions: LWTemplateQuestion[] = [
      {
        id: "fixed_course_id",
        template_id: "",
        question_text: "Course ID",
        question_type: "text",
        options: null,
        has_text_entry: 0,
        text_entry_label: null,
        is_required: 1,
        sort_order: 0
      },
      {
        id: "fixed_course_name",
        template_id: "",
        question_text: "Course Name",
        question_type: "text",
        options: null,
        has_text_entry: 0,
        text_entry_label: null,
        is_required: 1,
        sort_order: 1
      },
      {
        id: "fixed_assessor",
        template_id: "",
        question_text: "Teacher/Assessor",
        question_type: "dropdown",
        options: assessorOptions,
        has_text_entry: 0,
        text_entry_label: null,
        is_required: 1,
        sort_order: 2
      },
      {
        id: "fixed_iqa",
        template_id: "",
        question_text: "IQA",
        question_type: "dropdown",
        options: iqaOptions,
        has_text_entry: 0,
        text_entry_label: null,
        is_required: 1,
        sort_order: 3
      },
      {
        id: "fixed_planned_date",
        template_id: "",
        question_text: "Planned Date",
        question_type: "date",
        options: null,
        has_text_entry: 0,
        text_entry_label: null,
        is_required: 1,
        sort_order: 4
      },
      {
        id: "fixed_due_date",
        template_id: "",
        question_text: "Due Date",
        question_type: "date",
        options: null,
        has_text_entry: 0,
        text_entry_label: null,
        is_required: 0,
        sort_order: 5
      }
    ];
    questions = fixedQuestions;
  }

  const questionTypes = [
    { value: "yes_no", label: "Yes/No", icon: "✓", desc: "Simple yes or no choice" },
    { value: "rag", label: "Green/Amber/Red", icon: "●", desc: "RAG status indicator" },
    { value: "ggaw", label: "Gold/Green/Amber/White", icon: "◆", desc: "Extended GGAW rating" },
    { value: "single_choice", label: "MCQ (One Answer)", icon: "○", desc: "Multiple choice, single select" },
    { value: "multiple_choice", label: "Choices (Multiple)", icon: "☑", desc: "Tick multiple options" },
    { value: "dropdown", label: "Dropdown", icon: "▼", desc: "Select from dropdown" },
    { value: "text", label: "Text", icon: "T", desc: "Short text answer" },
    { value: "textarea", label: "Long Text", icon: "¶", desc: "Paragraph response" },
    { value: "date", label: "Date", icon: "📅", desc: "Date picker" },
    { value: "number", label: "Number", icon: "#", desc: "Numeric input" },
    { value: "ranking", label: "Ranking", icon: "⇅", desc: "Order items by drag" },
    { value: "rating", label: "Rating (0-5)", icon: "★", desc: "Star rating scale" },
  ];

  const questionTypeOptions = questionTypes.map(t =>
    `<option value="${t.value}">${t.label}</option>`
  ).join("");

  const fixedIds = new Set(["fixed_course_id", "fixed_course_name", "fixed_assessor", "fixed_iqa", "fixed_planned_date", "fixed_due_date"]);

  const renderQuestionCard = (q: LWTemplateQuestion, index: number) => {
    const isFixed = fixedIds.has(q.id);
    const cardClass = isFixed ? "lwfb-question-card lwfb-fixed-card" : "lwfb-question-card";
    const deleteBtn = isFixed
      ? `<span class="lwfb-fixed-badge">Standard Field</span>`
      : `<button type="button" class="lwfb-delete-q" onclick="deleteQuestion(this)" title="Remove question">×</button>`;

    return `
    <div class="${cardClass}" data-question-id="${q.id}" data-sort-order="${q.sort_order}" data-is-fixed="${isFixed}">
      <div class="lwfb-question-header">
        <span class="lwfb-q-number">${index + 1}</span>
        <select class="lwfb-q-type-select" onchange="updateQuestionType(this)" ${isFixed ? 'disabled' : ''}>
          ${questionTypes.map(t => `<option value="${t.value}" ${q.question_type === t.value ? "selected" : ""}>${t.label}</option>`).join("")}
        </select>
        <label class="lwfb-required-label">
          <input type="checkbox" class="lwfb-q-required" ${q.is_required ? "checked" : ""}>
          Required
        </label>
        ${deleteBtn}
      </div>
      <div class="lwfb-question-body">
        <input type="text" class="lwfb-q-text" value="${escapeHtml(q.question_text)}" placeholder="Enter your question" ${isFixed ? 'readonly' : ''}>
        <div class="lwfb-options-section ${["single_choice", "multiple_choice", "dropdown", "ranking"].includes(q.question_type) ? "" : "hidden"}">
          <label class="lwfb-options-label">Options (one per line):</label>
          <textarea class="lwfb-q-options" rows="3" placeholder="Option 1&#10;Option 2&#10;Option 3" ${isFixed ? 'readonly' : ''}>${q.options ? q.options.map((o: QuestionOption) => escapeHtml(o.label)).join("\n") : ""}</textarea>
        </div>
      </div>
    </div>`;
  };

  const questionsHtml = questions.length > 0
    ? questions.map((q, i) => renderQuestionCard(q, i)).join("")
    : `<div class="lwfb-empty-state" id="emptyQuestionsMsg">No questions yet. Click the + button below to add your first question.</div>`;

  return pageShell(isEdit ? "Edit Template" : "New Template", `
    <main class="lwfb-popup-overlay" id="templateBuilderPopup">
      <div class="lwfb-popup-container">
        <div class="lwfb-popup-header">
          <div>
            <p class="lwfb-eyebrow">Learning Walk Template Builder</p>
            <h1 class="lwfb-title">${isEdit ? "Edit Template" : "Create New Template"}</h1>
          </div>
          <button type="button" class="lwfb-close-btn" onclick="closeTemplateBuilder()" title="Close">×</button>
        </div>

        <div class="lwfb-popup-content">
          <!-- Template Title & Description -->
          <div class="lwfb-section-card">
            <input type="text" id="templateTitle" class="lwfb-title-input" value="${escapeHtml(title)}" placeholder="Untitled Template">
            <textarea id="templateDescription" class="lwfb-desc-input" rows="2" placeholder="Template description (optional)">${escapeHtml(description)}</textarea>
          </div>

          <!-- Questions Section - includes 6 standard fields + custom questions -->
          <div class="lwfb-section-card">
            <h3 class="lwfb-section-title">Form Questions</h3>
            <p class="lwfb-section-hint">The first 6 fields are standard for all Learning Walks. Add custom questions below using the + button.</p>
            <div id="questionsContainer" class="lwfb-questions-container">
              ${questionsHtml}
            </div>
            <div class="lwfb-add-wrapper" style="position:relative;">
              <button type="button" class="lwfb-add-btn" onclick="showQuestionTypePicker()">
                <span class="plus-icon">+</span>
                <span>Add Question</span>
              </button>

              <!-- Question Type Picker (hidden by default) - positioned absolutely above button -->
              <div id="questionTypePicker" class="lwfb-type-picker hidden" style="position:absolute;bottom:calc(100% + 0.5rem);left:50%;transform:translateX(-50%);z-index:100;min-width:400px;">
              <div class="picker-header">
                <span>Select Question Type</span>
                <button type="button" class="close-picker" onclick="hideQuestionTypePicker()">×</button>
              </div>
              <div class="picker-grid">
                ${questionTypes.map(t => `
                  <div class="type-option" onclick="addQuestion('${t.value}')">
                    <span class="type-icon">${t.icon}</span>
                    <span class="type-label">${t.label}</span>
                    <span class="type-desc">${t.desc}</span>
                  </div>
                `).join("")}
              </div>
            </div>
          </div>

          <!-- Comments Section -->
          <div class="lwfb-section-card lwfb-comments-section">
            <h3 class="lwfb-section-title">Comments & Paper Trail</h3>
            <p class="lwfb-section-hint">Comments added here will be timestamped and tracked:</p>
            <div id="templateComments" class="lwfb-comments-list">
              <div class="lwfb-empty-comments">No comments yet. Comments will appear here when users add them during learning walk entries.</div>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="lwfb-popup-footer">
          <button type="button" class="lwfb-secondary-btn" onclick="closeTemplateBuilder()">Cancel</button>
          <button type="button" class="lwfb-primary-btn" onclick="saveTemplate()">
            ${isEdit ? "Save Changes" : "Create Template"}
          </button>
        </div>
      </div>
    </main>

    <script>
      let questionCounter = ${questions.length};
      const templateId = "${templateId}";
      const isEdit = ${JSON.stringify(isEdit)};

      function closeTemplateBuilder() {
        window.location.href = "/learning-walks";
      }

      function showQuestionTypePicker() {
        document.getElementById('questionTypePicker').classList.remove('hidden');
      }

      function hideQuestionTypePicker() {
        document.getElementById('questionTypePicker').classList.add('hidden');
      }

      function deleteQuestion(btn) {
        if (!confirm('Delete this question?')) return;
        const card = btn.closest('.lwfb-question-card');
        card.remove();
        renumberQuestions();
        checkEmptyState();
      }

      function renumberQuestions() {
        const cards = document.querySelectorAll('.lwfb-question-card');
        cards.forEach((card, i) => {
          card.querySelector('.lwfb-q-number').textContent = i + 1;
        });
      }

      function checkEmptyState() {
        const container = document.getElementById('questionsContainer');
        const hasQuestions = container.querySelectorAll('.lwfb-question-card').length > 0;
        if (!hasQuestions && !document.getElementById('emptyQuestionsMsg')) {
          container.innerHTML = '<div class="lwfb-empty-state" id="emptyQuestionsMsg">No questions yet. Click the + button below to add your first question.</div>';
        }
      }

      function updateQuestionType(select) {
        const card = select.closest('.lwfb-question-card');
        const optionsSection = card.querySelector('.lwfb-options-section');
        const needsOptions = ['single_choice', 'multiple_choice', 'dropdown', 'ranking'].includes(select.value);
        optionsSection.classList.toggle('hidden', !needsOptions);
      }

      function addQuestion(type) {
        hideQuestionTypePicker();
        const container = document.getElementById('questionsContainer');
        const emptyMsg = document.getElementById('emptyQuestionsMsg');
        if (emptyMsg) emptyMsg.remove();

        questionCounter++;
        const questionId = 'new_' + crypto.randomUUID();
        const needsOptions = ['single_choice', 'multiple_choice', 'dropdown', 'ranking'].includes(type);

        const typeLabels = {
          yes_no: 'Yes/No',
          rag: 'Green/Amber/Red',
          ggaw: 'Gold/Green/Amber/White',
          single_choice: 'MCQ (One Answer)',
          multiple_choice: 'Choices (Multiple)',
          dropdown: 'Dropdown',
          text: 'Text',
          textarea: 'Long Text',
          date: 'Date',
          number: 'Number',
          ranking: 'Ranking',
          rating: 'Rating (0-5)'
        };

        const typeOptions = [
          { value: 'yes_no', label: 'Yes/No' },
          { value: 'rag', label: 'Green/Amber/Red' },
          { value: 'ggaw', label: 'Gold/Green/Amber/White' },
          { value: 'single_choice', label: 'MCQ (One Answer)' },
          { value: 'multiple_choice', label: 'Choices (Multiple)' },
          { value: 'dropdown', label: 'Dropdown' },
          { value: 'text', label: 'Text' },
          { value: 'textarea', label: 'Long Text' },
          { value: 'date', label: 'Date' },
          { value: 'number', label: 'Number' },
          { value: 'ranking', label: 'Ranking' },
          { value: 'rating', label: 'Rating (0-5)' }
        ].map(t => \`<option value="\${t.value}" \${t.value === type ? 'selected' : ''}>\${t.label}</option>\`).join('');

        const card = document.createElement('div');
        card.className = 'lwfb-question-card';
        card.dataset.questionId = questionId;
        card.dataset.sortOrder = questionCounter;
        card.innerHTML = \`
          <div class="lwfb-question-header">
            <span class="lwfb-q-number">\${document.querySelectorAll('.lwfb-question-card').length + 1}</span>
            <select class="lwfb-q-type-select" onchange="updateQuestionType(this)">
              \${typeOptions}
            </select>
            <label class="lwfb-required-label">
              <input type="checkbox" class="lwfb-q-required">
              Required
            </label>
            <button type="button" class="lwfb-delete-q" onclick="deleteQuestion(this)" title="Remove question">×</button>
          </div>
          <div class="lwfb-question-body">
            <input type="text" class="lwfb-q-text" placeholder="Enter your question">
            <div class="lwfb-options-section \${needsOptions ? '' : 'hidden'}">
              <label class="lwfb-options-label">Options (one per line):</label>
              <textarea class="lwfb-q-options" rows="3" placeholder="Option 1&#10;Option 2&#10;Option 3"></textarea>
            </div>
          </div>
        \`;
        container.appendChild(card);
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      async function saveTemplate() {
        const title = document.getElementById('templateTitle').value.trim();
        const description = document.getElementById('templateDescription').value.trim();

        if (!title) {
          alert('Please enter a template title');
          return;
        }

        const questions = [];
        const cards = document.querySelectorAll('.lwfb-question-card');

        for (let i = 0; i < cards.length; i++) {
          const card = cards[i];
          const qId = card.dataset.questionId;
          const qType = card.querySelector('.lwfb-q-type-select').value;
          const qText = card.querySelector('.lwfb-q-text').value.trim();
          const qRequired = card.querySelector('.lwfb-q-required').checked;

          if (!qText) {
            alert(\`Question \${i + 1} is missing text\`);
            return;
          }

          let options = null;
          if (['single_choice', 'multiple_choice', 'dropdown', 'ranking'].includes(qType)) {
            const optsText = card.querySelector('.lwfb-q-options').value.trim();
            if (optsText) {
              options = optsText.split('\\n').map((line, idx) => ({
                id: 'opt_' + idx,
                label: line.trim(),
                value: line.trim().toLowerCase().replace(/\\s+/g, '_')
              })).filter(o => o.label);
            }
          }

          const q = {
            question_text: qText,
            question_type: qType,
            is_required: qRequired,
            sort_order: i,
            options: options
          };

          // Only pass ID if it's not a temp ID (new_ prefix) and not a fixed field
          // Fixed fields get converted to regular questions on first save
          if (qId && !qId.startsWith('new_') && !qId.startsWith('fixed_')) {
            (q as any).id = qId;
          }

          questions.push(q);
        }

        const payload = { title, description, questions };
        const url = isEdit ? \`/api/lw/templates/\${templateId}\` : '/api/lw/templates';

        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || 'Failed to save');
          }

          window.location.href = '/learning-walks';
        } catch (err) {
          alert('Error saving template: ' + (err as Error).message);
        }
      }
    </script>
  `);
}

// ─── Learning Walk Template Builder ─────────────────────────────────────────

async function renderLWTemplateBuilder(request: Request, env: Env, identity: Identity): Promise<Response> {
  if (!canCreateForms(identity.user!)) {
    return htmlResponse(renderForbiddenPage(identity), 403);
  }

  const url = new URL(request.url);
  const pathParts = url.pathname.split("/");
  const templateId = pathParts.length > 4 ? pathParts[3] : null;

  let template: LWTemplateWithQuestions | null = null;
  if (templateId) {
    template = await getLWTemplateWithQuestions(env, templateId);
    if (!template) return htmlResponse(renderNotFoundPage(), 404);
  }

  // Get users for dropdowns (teachers and IQAs)
  const users = await env.esol_marking_db.prepare(
    "SELECT id, email, role FROM users WHERE role IN ('assessor', 'iqa', 'admin', 'superuser') ORDER BY email ASC"
  ).all<UserRecord>();

  return htmlResponse(renderLWTemplateBuilderPage(identity, template, users.results));
}

async function saveLWTemplate(request: Request, env: Env, identity: Identity): Promise<Response> {
  if (!canCreateForms(identity.user!)) {
    return json({ error: "Forbidden" }, 403);
  }

  try {
    const body = await request.json() as {
      title: string;
      description?: string;
      questions: Array<{
        id?: string;
        question_text: string;
        question_type: QuestionType;
        options?: QuestionOption[];
        is_required?: boolean;
        sort_order: number;
      }>;
    };

    const templateId = crypto.randomUUID();

    // Insert template
    await env.esol_marking_db.prepare(
      "INSERT INTO lw_templates (id, title, description, created_by) VALUES (?, ?, ?, ?)"
    ).bind(templateId, body.title, body.description ?? null, identity.user!.id).run();

    // Insert questions
    for (const q of body.questions) {
      await env.esol_marking_db.prepare(
        "INSERT INTO lw_template_questions (id, template_id, question_text, question_type, options, is_required, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)"
      ).bind(
        crypto.randomUUID(),
        templateId,
        q.question_text,
        q.question_type,
        q.options ? JSON.stringify(q.options) : null,
        q.is_required ? 1 : 0,
        q.sort_order
      ).run();
    }

    return json({ success: true, templateId });
  } catch (err) {
    return json({ error: "Failed to save template", details: String(err) }, 500);
  }
}

async function updateLWTemplate(request: Request, env: Env, identity: Identity, templateId: string): Promise<Response> {
  if (!canCreateForms(identity.user!)) {
    return json({ error: "Forbidden" }, 403);
  }

  try {
    const body = await request.json() as {
      title: string;
      description?: string;
      questions: Array<{
        id?: string;
        question_text: string;
        question_type: QuestionType;
        options?: QuestionOption[];
        is_required?: boolean;
        sort_order: number;
      }>;
    };

    // Update template
    await env.esol_marking_db.prepare(
      "UPDATE lw_templates SET title = ?, description = ? WHERE id = ?"
    ).bind(body.title, body.description ?? null, templateId).run();

    // Get existing question IDs
    const existingQs = await env.esol_marking_db.prepare(
      "SELECT id FROM lw_template_questions WHERE template_id = ?"
    ).bind(templateId).all<{ id: string }>();
    const existingIds = new Set(existingQs.results.map(q => q.id));

    // Track which questions are being updated
    const updatedIds = new Set<string>();

    // Insert or update questions
    for (const q of body.questions) {
      if (q.id && existingIds.has(q.id)) {
        // Update existing
        await env.esol_marking_db.prepare(
          "UPDATE lw_template_questions SET question_text = ?, question_type = ?, options = ?, is_required = ?, sort_order = ? WHERE id = ?"
        ).bind(
          q.question_text,
          q.question_type,
          q.options ? JSON.stringify(q.options) : null,
          q.is_required ? 1 : 0,
          q.sort_order,
          q.id
        ).run();
        updatedIds.add(q.id);
      } else {
        // Insert new
        const newId = crypto.randomUUID();
        await env.esol_marking_db.prepare(
          "INSERT INTO lw_template_questions (id, template_id, question_text, question_type, options, is_required, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)"
        ).bind(
          newId,
          templateId,
          q.question_text,
          q.question_type,
          q.options ? JSON.stringify(q.options) : null,
          q.is_required ? 1 : 0,
          q.sort_order
        ).run();
        updatedIds.add(newId);
      }
    }

    // Delete questions that are no longer in the list
    for (const existingId of existingIds) {
      if (!updatedIds.has(existingId)) {
        await env.esol_marking_db.prepare(
          "DELETE FROM lw_template_questions WHERE id = ?"
        ).bind(existingId).run();
      }
    }

    return json({ success: true, templateId });
  } catch (err) {
    return json({ error: "Failed to update template", details: String(err) }, 500);
  }
}

async function deleteLWTemplate(request: Request, env: Env, identity: Identity, templateId: string): Promise<Response> {
  if (!canCreateForms(identity.user!)) {
    return json({ error: "Forbidden" }, 403);
  }

  try {
    // Parse form data to check confirmation
    const formData = await request.formData();
    const confirmValue = formData.get("confirm")?.toString();

    if (confirmValue !== "DELETE") {
      return json({ error: "Confirmation required" }, 400);
    }

    // Delete in order: answers -> comments -> entries -> questions -> template
    // First get all entries for this template
    const entries = await env.esol_marking_db.prepare(
      "SELECT id FROM lw_entries WHERE template_id = ?"
    ).bind(templateId).all<{ id: string }>();

    const entryIds = entries.results.map(e => e.id);

    // Delete answers and comments for each entry
    for (const entryId of entryIds) {
      await env.esol_marking_db.prepare(
        "DELETE FROM lw_answers WHERE entry_id = ?"
      ).bind(entryId).run();

      await env.esol_marking_db.prepare(
        "DELETE FROM lw_comments WHERE entry_id = ?"
      ).bind(entryId).run();
    }

    // Delete entries
    await env.esol_marking_db.prepare(
      "DELETE FROM lw_entries WHERE template_id = ?"
    ).bind(templateId).run();

    // Delete questions
    await env.esol_marking_db.prepare(
      "DELETE FROM lw_template_questions WHERE template_id = ?"
    ).bind(templateId).run();

    // Delete template
    await env.esol_marking_db.prepare(
      "DELETE FROM lw_templates WHERE id = ?"
    ).bind(templateId).run();

    // Return success - client can redirect
    return new Response(null, {
      status: 302,
      headers: { Location: "/learning-walks" }
    });
  } catch (err) {
    return json({ error: "Failed to delete template", details: String(err) }, 500);
  }
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

async function serveStaticFile(pathname: string, env: Env): Promise<Response> {
  // For now, return a simple response for favicon.png
  // In production, you'd use R2 or KV to store static assets
  if (pathname === "/favicon.png") {
    // Return a simple 1x1 transparent PNG as placeholder
    // In production, serve actual favicon from R2 or KV
    const transparentPng = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 1, 0, 0, 0, 1, 8, 6, 0, 0, 0, 31, 21, 196, 137, 0, 0, 0, 13, 73, 68, 65, 84, 8, 215, 99, 250, 207, 192, 240, 0, 0, 0, 3, 0, 1, 0, 5, 254, 211, 0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130]);
    return new Response(transparentPng, { status: 200, headers: { "content-type": "image/png" } });
  }
  return new Response("Not found", { status: 404 });
}

function pageShell(title: string, body: string) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(title)} | ESOLQA</title><link rel="icon" type="image/png" href="/favicon.png"><style>
    :root{--bg:#fef2f2;--panel:#fff;--text:#450a0a;--muted:#991b1b;--primary:#dc2626;--primary-dark:#991b1b;--border:#fecaca;--success:#e9f8ef;--warn:#fff7e6;font-family:"Comic Sans MS","Comic Sans",cursive,sans-serif}*{box-sizing:border-box}body{margin:0;background:radial-gradient(circle at top left,#fecaca,transparent 34rem),linear-gradient(180deg,#fef2f2 0%,#fee2e2 100%);color:var(--text);min-height:100vh}a{color:inherit;text-decoration:none}button,.small-action,.primary-action{border:0;border-radius:999px;background:linear-gradient(135deg,var(--primary),#ef4444);color:#fff;font-weight:800;padding:.8rem 1.1rem;cursor:pointer;display:inline-flex;justify-content:center}.primary-action{width:100%;margin:1rem 0}.small-action{width:auto}.primary-action:hover,button:hover,.small-action:hover{background:linear-gradient(135deg,var(--primary-dark),#dc2626)}input,select,textarea{width:100%;border:1px solid var(--border);border-radius:.9rem;padding:.75rem;font:inherit;font-family:"Comic Sans MS","Comic Sans",cursive,sans-serif}textarea{resize:vertical}.auth-shell{min-height:100vh;display:grid;place-items:center;padding:2rem}.auth-card{width:min(100%,30rem);background:rgba(255,255,255,.92);border:1px solid var(--border);border-radius:2rem;box-shadow:0 1.5rem 5rem rgba(69,10,10,.12);padding:2.5rem;text-align:center}.brand-mark{width:3rem;height:3rem;display:inline-grid;place-items:center;border-radius:1rem;background:linear-gradient(135deg,var(--primary),#f87171);color:#fff;font-weight:800}.eyebrow{margin:0 0 .5rem;color:var(--primary);font-size:.75rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase}h1,h2,p{margin-top:0}h1{font-size:clamp(2rem,5vw,3rem);line-height:1;margin-bottom:1rem}.lede,.hint{color:var(--muted);line-height:1.6}.dashboard-shell{display:grid;grid-template-columns:17rem 1fr;min-height:100vh}.sidebar{background:#0f1b33;color:#fff;padding:1.5rem}.sidebar-brand{display:flex;align-items:center;gap:.8rem;margin-bottom:2rem}.sidebar-brand span{display:block;color:#9fb0cc;font-size:.85rem}nav{display:grid;gap:.4rem}nav a{padding:.8rem 1rem;border-radius:.9rem;color:#c8d3e7}nav a:hover,.nav-active{background:rgba(255,255,255,.1);color:#fff}.content{padding:2rem}.topbar{display:flex;align-items:center;justify-content:space-between;gap:1rem;margin-bottom:1.5rem}.profile-pill{background:var(--panel);border:1px solid var(--border);border-radius:999px;padding:.7rem 1rem;color:var(--muted);font-weight:700}.logout-link{color:var(--primary);font-weight:800}.panel{background:var(--panel);border:1px solid var(--border);border-radius:1.5rem;box-shadow:0 1rem 3rem rgba(20,33,61,.08);padding:1.5rem;margin-bottom:1.5rem}.toolbar{display:flex;justify-content:space-between;gap:1rem;align-items:center}.search-form{display:flex;gap:.8rem;flex:1}.actions-row{display:flex;gap:.8rem;align-items:center;flex-wrap:wrap}.grid-two{display:grid;grid-template-columns:1fr 1fr;gap:1rem}.list-stack{display:grid;gap:.8rem}.list-card{display:grid;gap:.35rem;border:1px solid var(--border);border-radius:1rem;padding:1rem}.list-card span,.list-card small{color:var(--muted)}.empty-state{border:1px dashed var(--border);border-radius:1rem;padding:1.5rem;text-align:center;color:var(--muted)}.form-grid{display:grid;grid-template-columns:2fr 1fr 1fr auto;gap:1rem;align-items:end}.stack-form{display:grid;gap:1rem}.narrow-panel{max-width:54rem}.modal-like{margin:auto}.user-table{display:grid;gap:.8rem}.user-row{display:flex;justify-content:space-between;gap:1rem;align-items:center;border-bottom:1px solid var(--border);padding:.8rem 0}.user-row span{display:block;color:var(--muted)}.user-row form{display:flex;gap:.5rem}.meta-panel{display:flex;gap:1rem;flex-wrap:wrap}.checklist-panel{overflow:auto}.checklist-table{width:100%;border-collapse:collapse}.checklist-table th,.checklist-table td{border:1px solid var(--border);padding:.8rem;vertical-align:top}.checklist-table th{background:#f6f8fc;text-align:left}.readonly-cell{min-height:3rem;color:var(--muted);white-space:pre-wrap}.comment-form{display:grid;gap:.8rem;margin-top:1rem}@media(max-width:900px){.dashboard-shell,.grid-two{grid-template-columns:1fr}.toolbar,.topbar,.form-grid{display:grid;grid-template-columns:1fr}.search-form{display:grid}.user-row{display:grid}}
  /* Form Builder Styles - MS Forms inspired */
    .form-builder-content{background:linear-gradient(180deg,#fef2f2 0%,#fee2e2 100%);min-height:100vh;padding:1.5rem 2rem}
    .form-builder-container{width:100%;max-width:100%;display:grid;gap:1rem}
    .form-header-card{background:#fff;border-radius:12px;padding:2rem 2.5rem;box-shadow:0 4px 16px rgba(220,38,38,0.15);border-top:5px solid var(--primary)}
    .form-title-input{width:100%;border:none;border-bottom:3px solid transparent;font-size:2.25rem;font-weight:700;color:var(--text);padding:0.75rem 0;margin-bottom:0.75rem;background:transparent;letter-spacing:-0.02em;font-family:"Comic Sans MS","Comic Sans",cursive,sans-serif}
    .form-title-input:focus{outline:none;border-bottom-color:var(--primary)}
    .form-title-input::placeholder{color:#fca5a5;font-weight:400}
    .form-desc-input{width:100%;border:none;font-size:1.125rem;color:var(--muted);padding:0.75rem 0;resize:none;background:transparent;line-height:1.5;font-family:"Comic Sans MS","Comic Sans",cursive,sans-serif}
    .form-desc-input:focus{outline:none}
    .form-desc-input::placeholder{color:#fca5a5}
    .form-section-card{background:#fff;border-radius:12px;padding:2rem;box-shadow:0 4px 16px rgba(220,38,38,0.15)}
    .section-title{font-size:1.25rem;font-weight:700;margin:0 0 0.75rem 0;color:var(--text);letter-spacing:-0.01em}
    .section-hint{font-size:0.9375rem;color:var(--muted);margin:0 0 1.25rem 0;line-height:1.5}
    .header-fields-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1.5rem}
    .header-field-preview label{display:block;font-size:0.9375rem;font-weight:600;color:var(--text);margin-bottom:0.5rem}
    .header-field-preview .req{color:#dc2626;margin-left:0.25rem}
    .field-preview{background:#fef2f2;border:2px solid var(--border);border-radius:8px;padding:0.75rem 1rem;color:#991b1b;font-size:0.9375rem}
    .question-card{background:#fff;border:2px solid var(--border);border-radius:12px;padding:1.5rem 2rem;margin-bottom:1rem;box-shadow:0 2px 8px rgba(220,38,38,0.08);transition:all 0.2s}
    .question-card:hover{border-color:#f87171;box-shadow:0 4px 12px rgba(220,38,38,0.15)}
    .question-header{display:flex;align-items:center;gap:1rem;margin-bottom:1rem;padding-bottom:0.75rem;border-bottom:1px solid var(--border)}
    .q-number{width:2rem;height:2rem;background:linear-gradient(135deg,var(--primary),#f87171);color:#fff;border-radius:50%;display:grid;place-items:center;font-size:0.9375rem;font-weight:700}
    .q-type-badge{font-size:0.8125rem;padding:0.375rem 0.75rem;background:#fee2e2;color:var(--primary);border-radius:6px;font-weight:600}
    .req-badge{font-size:0.8125rem;padding:0.375rem 0.75rem;background:#fef3c7;color:#92400e;border-radius:6px;font-weight:600}
    .visibility-badge{font-size:0.8125rem;padding:0.375rem 0.75rem;background:#fef2f2;color:var(--muted);border-radius:6px;margin-left:auto;font-weight:500}
    .q-text{font-size:1.125rem;font-weight:600;color:var(--text);margin:0;line-height:1.5}
    .text-entry-hint{font-size:0.9375rem;color:var(--muted);margin:0.75rem 0 0 2rem;padding-left:0.75rem;border-left:3px solid var(--border)}
    .add-question-wrapper{display:flex;justify-content:center;padding:1rem 0}
    .add-question-btn{background:#fff;border:2px dashed var(--border);border-radius:8px;padding:1rem 2rem;cursor:pointer;display:flex;align-items:center;gap:0.75rem;color:var(--muted);font-weight:500;transition:all 0.2s}
    .add-question-btn:hover{border-color:var(--primary);color:var(--primary)}
    .plus-icon{font-size:1.5rem;font-weight:300}
    .question-type-picker{background:#fff;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,0.15);padding:1rem;margin-top:0.5rem;position:relative;z-index:10}
    .picker-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;padding-bottom:0.5rem;border-bottom:1px solid var(--border)}
    .picker-header span{font-weight:600;color:var(--text)}
    .close-picker{background:none;border:none;font-size:1.25rem;cursor:pointer;color:var(--muted);padding:0.25rem}
    .picker-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:0.75rem}
    .type-option{background:#f8fafc;border:2px solid transparent;border-radius:8px;padding:1rem;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:0.5rem;transition:all 0.2s}
    .type-option:hover{background:#fff;border-color:var(--primary);box-shadow:0 4px 12px rgba(79,0,216,0.15)}
    .type-icon{font-size:1.5rem}
    .type-label{font-size:0.875rem;font-weight:500;color:var(--text)}
    .type-desc{font-size:0.75rem;color:var(--muted);text-align:center}
    .hidden{display:none!important}
    .form-group{margin-bottom:1rem}
    .form-group label{display:block;font-size:0.875rem;font-weight:500;color:var(--text);margin-bottom:0.5rem}
    .form-group .req{color:#dc2626}
    .form-row{display:grid;grid-template-columns:2fr 1fr;gap:1rem}
    .checkbox-group{display:flex;align-items:flex-end}
    .checkbox-label{display:flex;align-items:center;gap:0.5rem;cursor:pointer;font-weight:normal!important}
    .checkbox-label input{width:auto}
    .question-input{font-size:1rem;padding:0.75rem 1rem;border:2px solid var(--border);border-radius:8px}
    .question-input:focus{border-color:var(--primary);outline:none}
    .type-select{background:#f8fafc}
    .options-textarea{font-family:monospace;font-size:0.875rem}
    .field-hint{font-size:0.75rem;color:var(--muted);margin-top:0.25rem}
    .role-checkboxes{display:flex;gap:1.5rem}
    .form-actions{display:flex;gap:0.75rem;justify-content:flex-end;margin-top:1.5rem;padding-top:1rem;border-top:1px solid var(--border)}
    .primary-btn{background:var(--primary);color:#fff;border:none;border-radius:6px;padding:0.6rem 1.25rem;font-weight:600;cursor:pointer}
    .primary-btn:hover{background:var(--primary-dark)}
    .secondary-btn{background:#f1f5f9;color:var(--text);border:none;border-radius:6px;padding:0.6rem 1.25rem;font-weight:600;cursor:pointer}
    .secondary-btn:hover{background:#e2e8f0}
    .small-btn{background:var(--primary);color:#fff;border:none;border-radius:6px;padding:0.5rem 1rem;font-size:0.875rem;font-weight:600;cursor:pointer}
    .category-card{display:flex;align-items:center;gap:0.75rem;padding:0.75rem;background:#f8fafc;border-radius:6px;margin-bottom:0.5rem}
    .category-number{width:1.5rem;height:1.5rem;background:var(--primary);color:#fff;border-radius:50%;display:grid;place-items:center;font-size:0.75rem;font-weight:600;flex-shrink:0}
    .category-content{display:flex;flex-direction:column}
    .cat-desc{font-size:0.75rem;color:var(--muted)}
    .empty-cats{color:var(--muted);font-style:italic;padding:1rem;text-align:center}
    .inline-category-form{display:flex;gap:0.5rem;margin-top:1rem}
    .cat-input{flex:1;padding:0.5rem 0.75rem;border:1px solid var(--border);border-radius:6px;font-size:0.875rem}
    .cat-input:focus{border-color:var(--primary);outline:none}
    /* Template card styles */
    .template-card{display:flex;justify-content:space-between;align-items:center;padding:1rem 1.25rem}
    .card-content{flex:1}
    .card-content strong{display:block;font-size:1rem;font-weight:600;margin-bottom:0.25rem}
    .card-content span{font-size:0.875rem;color:var(--muted)}
    .card-actions{display:flex;gap:0.5rem}
    .action-btn{background:none;border:none;font-size:1.25rem;cursor:pointer;padding:0.5rem;border-radius:6px;transition:all 0.2s}
    .edit-btn:hover{background:#e0e7ff}
    .delete-btn:hover{background:#fee2e2}
    .delete-form{display:inline;margin:0}
    /* Dashboard layout improvements */
    .section-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;flex-wrap:wrap;gap:1rem}
    .search-form-inline{display:flex;gap:0.5rem}
    .search-form-inline input{width:auto;min-width:250px;border-radius:6px;padding:0.5rem 0.75rem}
    .search-form-inline button{border-radius:6px;padding:0.5rem 1rem;font-size:0.875rem}
    .templates-section{margin-bottom:1.5rem}
    .templates-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1rem}
    .submissions-section{background:#f8fafc}
    /* Learning Walks */
    @keyframes lw-blink{0%,100%{opacity:1}50%{opacity:0.35}}
    .lw-blink{animation:lw-blink 1.2s ease-in-out infinite}
    .lw-bell{position:relative;cursor:pointer;font-size:1.5rem;padding:0.25rem}
    .lw-bell-active{color:#dc2626}
    .lw-bell-count{background:#dc2626;color:#fff;border-radius:999px;font-size:0.75rem;font-weight:700;padding:0.1rem 0.4rem;vertical-align:top;margin-left:-0.5rem}
    .lw-notif-panel{position:absolute;right:0;top:2.5rem;min-width:300px;background:#fff;border:2px solid var(--border);border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,0.15);z-index:100;padding:0.75rem}
    .lw-notif-item{display:flex;justify-content:space-between;align-items:flex-start;gap:0.75rem;padding:0.5rem 0;border-bottom:1px solid var(--border)}
    .lw-notif-item:last-child{border-bottom:none}
    .lw-notif-dismiss{background:none;border:1px solid var(--border);border-radius:4px;padding:0.2rem 0.5rem;font-size:0.75rem;cursor:pointer;color:var(--muted);flex-shrink:0}
    .lw-status-badge{display:inline-block;padding:0.3rem 0.75rem;border-radius:6px;font-size:0.8125rem;font-weight:600}
    .lw-overdue-badge{display:inline-block;padding:0.3rem 0.75rem;border-radius:6px;font-size:0.8125rem;font-weight:700;background:#dc2626;color:#fff}
    .lw-overdue-card{border-left:4px solid #dc2626!important;background:#fef2f2!important}
    .lw-overdue-banner{background:#dc2626;color:#fff;padding:1rem 1.5rem;font-weight:700;font-size:1rem;border-radius:8px;margin-bottom:1rem}
    .lw-header-panel{background:#fff9f9;border-left:4px solid var(--primary)}
    .lw-header-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:1rem}
    .lw-header-grid > div{display:flex;flex-direction:column;gap:0.25rem}
    .lw-field-label{font-size:0.8125rem;color:var(--muted);font-weight:500;text-transform:uppercase;letter-spacing:0.05em}
    .lw-radio-group{display:flex;flex-wrap:wrap;gap:0.75rem;margin-top:0.5rem}
    .lw-choice-label{display:flex;align-items:center;gap:0.5rem;padding:0.5rem 1rem;background:#f8fafc;border:2px solid var(--border);border-radius:6px;cursor:pointer;transition:all 0.15s}
    .lw-choice-label:has(input:checked){background:#fee2e2;border-color:var(--primary)}
    .rag-green:has(input:checked){background:#dcfce7;border-color:#16a34a}
    .rag-amber:has(input:checked){background:#fef3c7;border-color:#d97706}
    .rag-red:has(input:checked){background:#fee2e2;border-color:#dc2626}
    .lw-q-options{display:flex;flex-wrap:wrap;gap:0.5rem;margin-top:0.5rem}
    .lw-q-opt{background:#fee2e2;color:var(--primary);border-radius:4px;padding:0.2rem 0.6rem;font-size:0.8125rem;font-weight:500}
    .lw-comments{display:flex;flex-direction:column;gap:0.75rem;margin-bottom:1rem}
    .lw-comment{border-radius:8px;padding:1rem 1.25rem;border-left:4px solid var(--border)}
    .lw-comment-iqa{background:#eff6ff;border-left-color:#3b82f6}
    .lw-comment-assessor{background:#f0fdf4;border-left-color:#16a34a}
    .lw-comment-admin,.lw-comment-superuser{background:#fef3c7;border-left-color:#d97706}
    .lw-comment-header{display:flex;align-items:center;gap:0.75rem;margin-bottom:0.5rem;flex-wrap:wrap}
    .lw-role-tag{font-size:0.75rem;font-weight:700;padding:0.2rem 0.5rem;border-radius:4px;background:var(--border);color:var(--text)}
    .lw-comment-date{font-size:0.8125rem;color:var(--muted);margin-left:auto}
    .lw-comment-body{margin:0;line-height:1.6;color:var(--text)}
    .lw-comment-form{display:flex;flex-direction:column;gap:0.75rem;margin-top:1rem;padding-top:1rem;border-top:1px solid var(--border)}
    /* Learning Walk Form Builder Popup */
    .lwfb-popup-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(69,10,10,0.6);backdrop-filter:blur(4px);z-index:1000;display:flex;justify-content:center;align-items:center;padding:2rem}
    .lwfb-popup-container{background:#fff;border-radius:16px;width:100%;max-width:900px;max-height:calc(100vh - 4rem);display:flex;flex-direction:column;box-shadow:0 25px 100px rgba(69,10,10,0.3)}
    .lwfb-popup-header{display:flex;justify-content:space-between;align-items:center;padding:1.5rem 2rem;border-bottom:2px solid var(--border);background:linear-gradient(135deg,#fef2f2 0%,#fff 100%)}
    .lwfb-eyebrow{margin:0 0 0.25rem;color:var(--primary);font-size:0.75rem;font-weight:800;letter-spacing:0.12em;text-transform:uppercase}
    .lwfb-title{margin:0;font-size:1.75rem;color:var(--text)}
    .lwfb-close-btn{background:none;border:none;font-size:1.75rem;color:var(--muted);cursor:pointer;padding:0.5rem;border-radius:8px;transition:all 0.2s}
    .lwfb-close-btn:hover{background:#fee2e2;color:var(--primary)}
    .lwfb-popup-content{flex:1;overflow-y:auto;padding:2rem;background:#f8fafc}
    .lwfb-popup-footer{display:flex;justify-content:flex-end;gap:1rem;padding:1.5rem 2rem;border-top:2px solid var(--border);background:#fff}
    .lwfb-section-card{background:#fff;border-radius:12px;padding:1.5rem 2rem;margin-bottom:1.5rem;box-shadow:0 4px 16px rgba(220,38,38,0.1)}
    .lwfb-title-input{width:100%;border:none;border-bottom:3px solid transparent;font-size:2rem;font-weight:700;color:var(--text);padding:0.75rem 0;margin-bottom:0.75rem;background:transparent;font-family:inherit}
    .lwfb-title-input:focus{outline:none;border-bottom-color:var(--primary)}
    .lwfb-title-input::placeholder{color:#fca5a5;font-weight:400}
    .lwfb-desc-input{width:100%;border:none;font-size:1.125rem;color:var(--muted);padding:0.75rem 0;resize:none;background:transparent;font-family:inherit}
    .lwfb-desc-input:focus{outline:none}
    .lwfb-desc-input::placeholder{color:#fca5a5}
    .lwfb-section-title{font-size:1.25rem;font-weight:700;margin:0 0 0.75rem 0;color:var(--text)}
    .lwfb-section-hint{font-size:0.9375rem;color:var(--muted);margin:0 0 1.25rem 0;line-height:1.5}
    .lwfb-header-preview{border-left:4px solid var(--primary);background:linear-gradient(135deg,#fff9f9 0%,#fff 100%)}
    .lwfb-header-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1.5rem}
    .lwfb-field-preview label{display:block;font-size:0.9375rem;font-weight:600;color:var(--text);margin-bottom:0.5rem}
    .lwfb-field-preview .req{color:#dc2626;margin-left:0.25rem}
    .field-preview-box{background:#fef2f2;border:2px solid var(--border);border-radius:8px;padding:0.75rem 1rem;color:#991b1b;font-size:0.9375rem}
    .field-preview-box select,.field-preview-box input{width:100%;background:transparent;border:none;color:inherit;font-size:inherit;cursor:not-allowed}
    .lwfb-questions-container{margin-bottom:1rem}
    .lwfb-question-card{background:#fff;border:2px solid var(--border);border-radius:12px;padding:1.5rem;margin-bottom:1rem;box-shadow:0 2px 8px rgba(220,38,38,0.08);transition:all 0.2s}
    .lwfb-question-card:hover{border-color:#f87171;box-shadow:0 4px 12px rgba(220,38,38,0.15)}
    .lwfb-fixed-card{border-left:4px solid #3b82f6;background:linear-gradient(135deg,#eff6ff 0%,#fff 100%)}
    .lwfb-fixed-card .lwfb-q-number{background:linear-gradient(135deg,#3b82f6,#60a5fa)}
    .lwfb-fixed-card .lwfb-q-text{background:#f8fafc}
    .lwfb-fixed-badge{font-size:0.75rem;font-weight:600;padding:0.375rem 0.75rem;background:#dbeafe;color:#1e40af;border-radius:6px;margin-left:auto}
    .lwfb-fixed-card .lwfb-q-type-select{background:#e0e7ff;border-color:#3b82f6;color:#1e40af}
    .lwfb-fixed-card .lwfb-q-type-select:disabled{opacity:0.8;cursor:not-allowed}
    .lwfb-question-header{display:flex;align-items:center;gap:1rem;margin-bottom:1rem;padding-bottom:0.75rem;border-bottom:1px solid var(--border)}
    .lwfb-q-number{width:2rem;height:2rem;background:linear-gradient(135deg,var(--primary),#f87171);color:#fff;border-radius:50%;display:grid;place-items:center;font-size:0.9375rem;font-weight:700;flex-shrink:0}
    .lwfb-q-type-select{background:#f8fafc;border:2px solid var(--border);border-radius:6px;padding:0.5rem 0.75rem;font-size:0.875rem;cursor:pointer}
    .lwfb-q-type-select:focus{border-color:var(--primary);outline:none}
    .lwfb-required-label{display:flex;align-items:center;gap:0.5rem;font-size:0.875rem;color:var(--muted);cursor:pointer;margin-left:auto}
    .lwfb-required-label input{width:auto}
    .lwfb-delete-q{background:#fee2e2;border:none;border-radius:6px;color:#dc2626;font-size:1.25rem;width:2rem;height:2rem;display:grid;place-items:center;cursor:pointer;transition:all 0.2s}
    .lwfb-delete-q:hover{background:#dc2626;color:#fff}
    .lwfb-question-body{display:flex;flex-direction:column;gap:0.75rem}
    .lwfb-q-text{font-size:1.125rem;padding:0.75rem 1rem;border:2px solid var(--border);border-radius:8px;width:100%;font-family:inherit}
    .lwfb-q-text:focus{border-color:var(--primary);outline:none}
    .lwfb-options-section{margin-top:0.5rem}
    .lwfb-options-label{display:block;font-size:0.875rem;color:var(--muted);margin-bottom:0.5rem}
    .lwfb-q-options{font-family:monospace;font-size:0.875rem;padding:0.75rem 1rem;border:2px solid var(--border);border-radius:8px;width:100%;resize:vertical}
    .lwfb-q-options:focus{border-color:var(--primary);outline:none}
    .lwfb-add-wrapper{display:flex;justify-content:center;padding:1rem 0}
    .lwfb-add-btn{background:#fff;border:2px dashed var(--border);border-radius:8px;padding:1rem 2rem;cursor:pointer;display:flex;align-items:center;gap:0.75rem;color:var(--muted);font-weight:500;transition:all 0.2s;font-size:1rem}
    .lwfb-add-btn:hover{border-color:var(--primary);color:var(--primary)}
    .lwfb-add-btn .plus-icon{font-size:1.5rem;font-weight:300}
    .lwfb-type-picker{background:#fff;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,0.15);padding:1rem;margin-top:0.5rem;border:2px solid var(--border)}
    .lwfb-type-picker .picker-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;padding-bottom:0.5rem;border-bottom:1px solid var(--border)}
    .lwfb-type-picker .picker-header span{font-weight:600;color:var(--text)}
    .lwfb-type-picker .picker-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:0.75rem}
    .lwfb-type-picker .type-option{background:#f8fafc;border:2px solid transparent;border-radius:8px;padding:1rem;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:0.5rem;transition:all 0.2s}
    .lwfb-type-picker .type-option:hover{background:#fff;border-color:var(--primary);box-shadow:0 4px 12px rgba(220,38,38,0.15)}
    .lwfb-type-picker .type-icon{font-size:1.5rem}
    .lwfb-type-picker .type-label{font-size:0.875rem;font-weight:500;color:var(--text)}
    .lwfb-type-picker .type-desc{font-size:0.75rem;color:var(--muted);text-align:center}
    .lwfb-empty-state{color:var(--muted);font-style:italic;padding:2rem;text-align:center;background:#f8fafc;border-radius:8px;border:2px dashed var(--border)}
    .lwfb-comments-section{background:linear-gradient(135deg,#f8fafc 0%,#fff 100%);border-left:4px solid #d97706}
    .lwfb-comments-list{max-height:200px;overflow-y:auto}
    .lwfb-empty-comments{color:var(--muted);font-style:italic;padding:1rem;text-align:center}
    .lwfb-primary-btn{background:var(--primary);color:#fff;border:none;border-radius:8px;padding:0.75rem 1.5rem;font-weight:600;cursor:pointer;font-size:1rem;transition:all 0.2s}
    .lwfb-primary-btn:hover{background:var(--primary-dark)}
    .lwfb-secondary-btn{background:#f1f5f9;color:var(--text);border:none;border-radius:8px;padding:0.75rem 1.5rem;font-weight:600;cursor:pointer;font-size:1rem;transition:all 0.2s}
    .lwfb-secondary-btn:hover{background:#e2e8f0}
    @media (max-width:768px){.lwfb-header-grid{grid-template-columns:1fr}.lwfb-type-picker .picker-grid{grid-template-columns:repeat(2,1fr)}.lwfb-popup-overlay{padding:1rem}.lwfb-popup-container{max-height:calc(100vh - 2rem)}}
  </style></head><body>${body}</body></html>`;
}

function renderSidebar(identity: Identity, active: string) {
  const user = identity.user!;
  return `<aside class="sidebar">
    <div class="sidebar-brand"><div class="brand-mark"><img src="/favicon.png" width="32" height="32" style="border-radius:0.5rem;object-fit:cover"></div><div><strong>ESOLQA</strong><span>${escapeHtml(user.role)}</span></div></div>
    <nav class="sidebar-nav">
      ${navLink("/dashboard", "Assessment Forms", active === "assessment")}
      ${navLink("/dashboard?section=iqa", "IQA Forms", active === "iqa")}
      ${navLink("/dashboard?section=eqa", "EQA Forms", active === "eqa")}
      ${navLink("/learning-walks", "Learning Walks", active === "learning-walks")}
      ${isSuperuser(user) ? navLink("/users", "Users", active === "users") : ""}
    </nav>
  </aside>`;
}

function renderTopbar(identity: Identity, title: string) {
  return `<header class="topbar"><div><p class="eyebrow">Dashboard</p><h1>${escapeHtml(title)}</h1></div><div class="profile-pill">${escapeHtml(identity.email)}</div><a class="logout-link" href="/logout">Sign out</a></header>`;
}

function escapeHtml(value: string) { return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;"); }
