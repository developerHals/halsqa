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
  ASSETS?: { fetch(request: Request): Promise<Response> };
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
  | "rating"
  | "section"
  | "time";

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
    if (url.pathname === "/favicon.png" || url.pathname === "/favicon.ico" || url.pathname === "/favicon.svg" || url.pathname.startsWith("/public/")) {
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

    // Learning Walk Entry Creation - Template Selector
    if (url.pathname === "/learning-walks/entries/new") {
      return renderLWEntryTemplateSelector(request, env, identity);
    }

    // Learning Walk Entry Creation Form
    if (url.pathname === "/learning-walks/entries/create") {
      return renderLWEntryForm(request, env, identity);
    }

    // Learning Walk Entry View Page
    if (url.pathname.match(/^\/learning-walks\/entries\/[^/]+$/)) {
      return renderLWEntryView(request, env, identity, url.pathname.split("/")[3]);
    }

    // Learning Walk Entry API
    if (url.pathname === "/api/lw/entries" && request.method === "POST") {
      return saveLWEntry(request, env, identity);
    }

    // Learning Walk Entry Comment API
    if (url.pathname.match(/^\/api\/lw\/entries\/[^/]+\/comments$/) && request.method === "POST") {
      return addLWEntryComment(request, env, identity, url.pathname.split("/")[4]);
    }

    // Learning Walk Entry Update API (for IQA editing)
    if (url.pathname.match(/^\/api\/lw\/entries\/[^/]+\/update$/) && request.method === "POST") {
      return updateLWEntry(request, env, identity, url.pathname.split("/")[4]);
    }

    // Learning Walk Entry Complete API (for admin)
    if (url.pathname.match(/^\/api\/lw\/entries\/[^/]+\/complete$/) && request.method === "POST") {
      return completeLWEntry(request, env, identity, url.pathname.split("/")[4]);
    }

    // Learning Walk Entry Delete API (superuser only)
    if (url.pathname.match(/^\/api\/lw\/entries\/[^/]+\/delete$/) && request.method === "POST") {
      return deleteLWEntry(request, env, identity, url.pathname.split("/")[4]);
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

async function renderLWEntryTemplateSelector(request: Request, env: Env, identity: Identity): Promise<Response> {
  if (!canCreateForms(identity.user!)) {
    return new Response(null, { status: 302, headers: { Location: "/learning-walks" } });
  }

  const templates = await getLWTemplates(env);
  return htmlResponse(renderLWEntryTemplateSelectorPage(identity, templates));
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
              const deleteBtn = isSuperuser(user) ? `
                <button type="button"
                  class="lw-entry-delete-btn"
                  title="Delete submission"
                  onclick="confirmDeleteEntry('${e.id}', '${escapeHtml(e.template_title).replace(/'/g, "\\'")}')">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                </button>` : "";
              return `<article class="list-card${isOverdue ? " lw-overdue-card" : ""}">
                <a href="/learning-walks/entries/${e.id}" style="display:block;flex:1">
                  <strong>${escapeHtml(e.template_title)}</strong>
                  <span>Course: ${escapeHtml(e.course_name)} (${escapeHtml(e.course_id)})</span>
                  <span>Assessor: ${escapeHtml(e.assessor_name)} · IQA: ${escapeHtml(e.iqa_name)}</span>
                  <span>Planned: ${escapeHtml(e.planned_date)}${e.due_date ? ` · Due: ${escapeHtml(e.due_date)}` : ""}</span>
                </a>
                <div style="display:flex;align-items:center;gap:0.75rem">
                  ${renderLWStatusBadge(e.status, e.due_date)}
                  ${deleteBtn}
                </div>
              </article>`;
            }).join("") : renderEmpty("No learning walks found")}
          </div>
        </section>
      </section>
    </main>

    <!-- Delete Entry Modal -->
    <div id="lw-delete-modal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:none;align-items:center;justify-content:center">
      <div style="background:#fff;border-radius:12px;padding:2rem;max-width:420px;width:90%;box-shadow:0 8px 32px rgba(0,0,0,0.2)">
        <h2 style="margin:0 0 0.5rem;color:#0f172a;font-size:1.25rem">Delete Submission</h2>
        <p style="color:#64748b;margin:0 0 1.25rem;font-size:0.9375rem">You are about to permanently delete: <strong id="lw-delete-title"></strong></p>
        <p style="color:#64748b;margin:0 0 1rem;font-size:0.9375rem">This will remove all answers, comments and notifications for this submission. <strong>This cannot be undone.</strong></p>
        <p style="color:#64748b;margin:0 0 0.75rem;font-size:0.9rem">Type <strong>DELETE</strong> to confirm:</p>
        <input id="lw-delete-confirm-input" type="text" placeholder="Type DELETE here"
          style="width:100%;border:2px solid #e5e7eb;border-radius:8px;padding:0.75rem 1rem;font-size:1rem;margin-bottom:1rem">
        <div style="display:flex;gap:0.75rem;justify-content:flex-end">
          <button type="button" onclick="closeLWDeleteModal()"
            style="background:#f1f5f9;color:#0f172a;border:none;border-radius:8px;padding:0.7rem 1.25rem;font-weight:600;cursor:pointer;font-size:0.9375rem">
            Cancel
          </button>
          <button type="button" id="lw-delete-confirm-btn" onclick="submitLWDelete()"
            style="background:#ff005a;color:#fff;border:none;border-radius:8px;padding:0.7rem 1.25rem;font-weight:600;cursor:pointer;font-size:0.9375rem">
            Delete
          </button>
        </div>
      </div>
    </div>

    <script>
      function confirmDelete(form) {
        const t = prompt("Type DELETE to confirm:");
        if (t !== "DELETE") { alert("Cancelled."); return false; }
        return true;
      }

      let _lwDeleteEntryId = null;

      function confirmDeleteEntry(entryId, title) {
        _lwDeleteEntryId = entryId;
        document.getElementById("lw-delete-title").textContent = title;
        document.getElementById("lw-delete-confirm-input").value = "";
        const modal = document.getElementById("lw-delete-modal");
        modal.style.display = "flex";
        document.getElementById("lw-delete-confirm-input").focus();
      }

      function closeLWDeleteModal() {
        document.getElementById("lw-delete-modal").style.display = "none";
        _lwDeleteEntryId = null;
      }

      async function submitLWDelete() {
        const input = document.getElementById("lw-delete-confirm-input").value.trim();
        if (input !== "DELETE") {
          document.getElementById("lw-delete-confirm-input").style.borderColor = "#ff005a";
          document.getElementById("lw-delete-confirm-input").focus();
          return;
        }
        const btn = document.getElementById("lw-delete-confirm-btn");
        btn.disabled = true;
        btn.textContent = "Deleting...";
        try {
          const res = await fetch("/api/lw/entries/" + _lwDeleteEntryId + "/delete", { method: "POST" });
          const data = await res.json();
          if (data.success) {
            closeLWDeleteModal();
            window.location.reload();
          } else {
            alert("Error: " + (data.error || "Failed to delete"));
            btn.disabled = false;
            btn.textContent = "Delete";
          }
        } catch (e) {
          alert("Network error. Please try again.");
          btn.disabled = false;
          btn.textContent = "Delete";
        }
      }

      document.getElementById("lw-delete-modal").addEventListener("click", function(e) {
        if (e.target === this) closeLWDeleteModal();
      });

      document.getElementById("lw-delete-confirm-input").addEventListener("keydown", function(e) {
        if (e.key === "Enter") submitLWDelete();
        if (e.key === "Escape") closeLWDeleteModal();
        this.style.borderColor = "#e5e7eb";
      });
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
    { value: "time", label: "Time", icon: "🕐", desc: "Hour / Minute / AM·PM" },
    { value: "section", label: "Section Header", icon: "▬", desc: "Heading & description divider" },
  ];

  const questionTypeOptions = questionTypes.map(t =>
    `<option value="${t.value}">${t.label}</option>`
  ).join("");

  const fixedIds = new Set(["fixed_course_id", "fixed_course_name", "fixed_assessor", "fixed_iqa", "fixed_planned_date", "fixed_due_date"]);

  const renderQuestionCard = (q: LWTemplateQuestion, index: number) => {
    const isFixed = fixedIds.has(q.id);
    const isSection = q.question_type === "section";
    const cardClass = isFixed ? "lwfb-question-card lwfb-fixed-card" : "lwfb-question-card";
    const actionBtns = isFixed
      ? `<span class="lwfb-fixed-badge">Standard Field</span>`
      : `<div class="lwfb-reorder-btns">
           <button type="button" class="lwfb-reorder-btn" onclick="moveQuestion(this,'up')" title="Move up">▲</button>
           <button type="button" class="lwfb-reorder-btn" onclick="moveQuestion(this,'down')" title="Move down">▼</button>
         </div>
         <button type="button" class="lwfb-delete-q" onclick="deleteQuestion(this)" title="Remove question">×</button>`;
    const needsOptions = ["single_choice", "multiple_choice", "dropdown", "ranking"].includes(q.question_type);

    return `
    <div class="${cardClass}" data-question-id="${q.id}" data-sort-order="${q.sort_order}" data-is-fixed="${isFixed}">
      <div class="lwfb-question-header">
        <span class="lwfb-q-number">${index + 1}</span>
        <select class="lwfb-q-type-select" onchange="updateQuestionType(this)" ${isFixed ? 'disabled' : ''}>
          ${questionTypes.map(t => `<option value="${t.value}" ${q.question_type === t.value ? "selected" : ""}>${t.label}</option>`).join("")}
        </select>
        <label class="lwfb-required-label" style="${isSection ? 'display:none' : ''}">
          <input type="checkbox" class="lwfb-q-required" ${q.is_required ? "checked" : ""}>
          Required
        </label>
        ${actionBtns}
      </div>
      <div class="lwfb-question-body">
        <div class="lwfb-section-body ${isSection ? '' : 'hidden'}">
          <input type="text" class="lwfb-q-text" value="${escapeHtml(q.question_text)}" placeholder="Section heading" style="font-weight:600;font-size:1.05rem">
          <input type="text" class="lwfb-q-section-desc" value="${escapeHtml(q.text_entry_label || '')}" placeholder="Section description (optional)" style="margin-top:0.5rem;color:#64748b">
        </div>
        <div class="lwfb-normal-body ${isSection ? 'hidden' : ''}">
          <input type="text" class="lwfb-q-text" value="${escapeHtml(q.question_text)}" placeholder="Enter your question" ${isFixed ? 'readonly' : ''}>
          <div class="lwfb-options-section ${needsOptions ? "" : "hidden"}">
            <label class="lwfb-options-label">Options (one per line):</label>
            <textarea class="lwfb-q-options" rows="3" placeholder="Option 1&#10;Option 2&#10;Option 3" ${isFixed ? 'readonly' : ''}>${q.options ? q.options.map((o: QuestionOption) => escapeHtml(o.label)).join("\n") : ""}</textarea>
          </div>
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

            </div>

            <!-- Question Type Picker (full-width inline panel) -->
            <div id="questionTypePicker" class="lwfb-type-picker hidden">
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
        const type = select.value;
        const optionsSection = card.querySelector('.lwfb-options-section');
        const sectionBody = card.querySelector('.lwfb-section-body');
        const normalBody = card.querySelector('.lwfb-normal-body');
        const reqLabel = card.querySelector('.lwfb-required-label');
        const needsOptions = ['single_choice', 'multiple_choice', 'dropdown', 'ranking'].includes(type);
        const isSection = type === 'section';
        optionsSection.classList.toggle('hidden', !needsOptions);
        if (sectionBody) sectionBody.classList.toggle('hidden', !isSection);
        if (normalBody) normalBody.classList.toggle('hidden', isSection);
        if (reqLabel) reqLabel.style.display = isSection ? 'none' : '';
      }

      function moveQuestion(btn, direction) {
        const card = btn.closest('.lwfb-question-card');
        const container = card.parentNode;
        const cards = Array.from(container.querySelectorAll('.lwfb-question-card'));
        const idx = cards.indexOf(card);
        if (direction === 'up' && idx > 0) {
          container.insertBefore(card, cards[idx - 1]);
        } else if (direction === 'down' && idx < cards.length - 1) {
          cards[idx + 1].insertAdjacentElement('afterend', card);
        }
        renumberQuestions();
      }

      function addQuestion(type) {
        hideQuestionTypePicker();
        const container = document.getElementById('questionsContainer');
        const emptyMsg = document.getElementById('emptyQuestionsMsg');
        if (emptyMsg) emptyMsg.remove();

        questionCounter++;
        const questionId = 'new_' + crypto.randomUUID();
        const needsOptions = ['single_choice', 'multiple_choice', 'dropdown', 'ranking'].includes(type);
        const isSection = type === 'section';

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
          { value: 'rating', label: 'Rating (0-5)' },
          { value: 'time', label: 'Time' },
          { value: 'section', label: 'Section Header' }
        ].map(t => \`<option value="\${t.value}" \${t.value === type ? 'selected' : ''}>\${t.label}</option>\`).join('');

        const card = document.createElement('div');
        card.className = 'lwfb-question-card';
        card.dataset.questionId = questionId;
        card.dataset.sortOrder = questionCounter;
        card.innerHTML = \`
          <div class="lwfb-question-header">
            <span class="lwfb-q-number">\${document.querySelectorAll('.lwfb-question-card').length + 1}</span>
            <select class="lwfb-q-type-select" onchange="updateQuestionType(this)">\${typeOptions}</select>
            <label class="lwfb-required-label" style="\${isSection ? 'display:none' : ''}">
              <input type="checkbox" class="lwfb-q-required"> Required
            </label>
            <div class="lwfb-reorder-btns">
              <button type="button" class="lwfb-reorder-btn" onclick="moveQuestion(this,'up')" title="Move up">▲</button>
              <button type="button" class="lwfb-reorder-btn" onclick="moveQuestion(this,'down')" title="Move down">▼</button>
            </div>
            <button type="button" class="lwfb-delete-q" onclick="deleteQuestion(this)" title="Remove question">×</button>
          </div>
          <div class="lwfb-question-body">
            <div class="lwfb-section-body \${isSection ? '' : 'hidden'}">
              <input type="text" class="lwfb-q-text" placeholder="Section heading" style="font-weight:600;font-size:1.05rem">
              <input type="text" class="lwfb-q-section-desc" placeholder="Section description (optional)" style="margin-top:0.5rem;color:#64748b">
            </div>
            <div class="lwfb-normal-body \${isSection ? 'hidden' : ''}">
              <input type="text" class="lwfb-q-text" placeholder="Enter your question">
              <div class="lwfb-options-section \${needsOptions ? '' : 'hidden'}">
                <label class="lwfb-options-label">Options (one per line):</label>
                <textarea class="lwfb-q-options" rows="3" placeholder="Option 1&#10;Option 2&#10;Option 3"></textarea>
              </div>
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
          const qRequired = qType === 'section' ? false : card.querySelector('.lwfb-q-required').checked;

          if (!qText) {
            alert(\`Question \${i + 1} is missing \${qType === 'section' ? 'a heading' : 'text'}\`);
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

          // For section type, store description in text_entry_label
          const sectionDescEl = card.querySelector('.lwfb-q-section-desc');
          const textEntryLabel = sectionDescEl ? sectionDescEl.value.trim() : null;

          const q = {
            question_text: qText,
            question_type: qType,
            is_required: qRequired,
            sort_order: i,
            options: options,
            text_entry_label: textEntryLabel || null
          };

          // Only pass ID if it's not a temp ID (new_ prefix) and not a fixed field
          // Fixed fields get converted to regular questions on first save
          if (qId && !qId.startsWith('new_') && !qId.startsWith('fixed_')) {
            q.id = qId;
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
          alert('Error saving template: ' + (err.message || String(err)));
        }
      }
    </script>
  `);
}

function renderLWEntryTemplateSelectorPage(identity: Identity, templates: LWTemplateRecord[]): string {
  const templatesHtml = templates.length > 0
    ? templates.map(t => `
        <div class="lw-selector-template-card" data-template-id="${t.id}" data-template-name="${escapeHtml(t.title).toLowerCase()}" onclick="selectTemplate('${t.id}')">
          <div class="lw-selector-template-icon">📋</div>
          <div class="lw-selector-template-info">
            <strong>${escapeHtml(t.title)}</strong>
            <span>${escapeHtml(t.description ?? "No description")}</span>
          </div>
          <div class="lw-selector-template-arrow">→</div>
        </div>
      `).join("")
    : `<div class="lw-selector-empty">No active templates available. Create a template first.</div>`;

  return pageShell("Select Template", `
    <main class="lwfb-popup-overlay" id="templateSelectorPopup">
      <div class="lwfb-popup-container" style="max-width:600px;">
        <div class="lwfb-popup-header">
          <div>
            <p class="lwfb-eyebrow">New Learning Walk</p>
            <h1 class="lwfb-title">Select a Template</h1>
          </div>
          <button type="button" class="lwfb-close-btn" onclick="closeSelector()" title="Close">×</button>
        </div>

        <div class="lwfb-popup-content">
          <!-- Search Bar -->
          <div class="lw-selector-search-wrapper">
            <input type="text" id="templateSearch" class="lw-selector-search" placeholder="🔍 Search templates by name..." oninput="filterTemplates(this.value)">
          </div>

          <!-- Template List -->
          <div id="templateList" class="lw-selector-list">
            ${templatesHtml}
          </div>

          <!-- No Results Message -->
          <div id="noResultsMsg" class="lw-selector-no-results hidden">
            No templates match your search.
          </div>
        </div>

        <!-- Footer -->
        <div class="lwfb-popup-footer">
          <button type="button" class="lwfb-secondary-btn" onclick="closeSelector()">Cancel</button>
        </div>
      </div>
    </main>

    <script>
      function closeSelector() {
        window.location.href = '/learning-walks';
      }

      function filterTemplates(searchTerm) {
        const term = searchTerm.toLowerCase().trim();
        const cards = document.querySelectorAll('.lw-selector-template-card');
        const noResults = document.getElementById('noResultsMsg');
        let visibleCount = 0;

        cards.forEach(card => {
          const name = card.dataset.templateName;
          const isMatch = name.includes(term);
          card.style.display = isMatch ? 'flex' : 'none';
          if (isMatch) visibleCount++;
        });

        noResults.classList.toggle('hidden', visibleCount > 0);
      }

      function selectTemplate(templateId) {
        window.location.href = '/learning-walks/entries/create?templateId=' + encodeURIComponent(templateId);
      }
    </script>
  `);
}

// ─── Learning Walk Entry Form ───────────────────────────────────────────────

function renderLWEntryFormPage(identity: Identity, template: LWTemplateWithQuestions, users: UserRecord[]): string {
  const user = identity.user!;
  const assessors = users.filter(u => u.role === "assessor" || u.role === "admin" || u.role === "superuser");
  const iqas = users.filter(u => u.role === "iqa" || u.role === "admin" || u.role === "superuser");

  // Render fixed header fields
  const fixedFieldsHtml = `
    <div class="lw-entry-section">
      <h3 class="lw-entry-section-title">Course Information</h3>
      <div class="lw-entry-grid">
        <div class="lw-entry-field">
          <label class="lw-entry-label" for="course_id">Course ID *</label>
          <input type="text" id="course_id" name="course_id" class="lw-entry-input" required placeholder="e.g., ESOL-2024-001">
        </div>
        <div class="lw-entry-field">
          <label class="lw-entry-label" for="course_name">Course Name *</label>
          <input type="text" id="course_name" name="course_name" class="lw-entry-input" required placeholder="e.g., Intermediate English Level 2">
        </div>
      </div>
    </div>

    <div class="lw-entry-section">
      <h3 class="lw-entry-section-title">Staff Allocation</h3>
      <div class="lw-entry-grid">
        <div class="lw-entry-field">
          <label class="lw-entry-label" for="assessor_name">Assessor Name *</label>
          <select id="assessor_name" name="assessor_name" class="lw-entry-select" required>
            <option value="">Select Assessor</option>
            ${assessors.map(u => `<option value="${u.id}">${escapeHtml(u.email)}</option>`).join("")}
          </select>
        </div>
        <div class="lw-entry-field">
          <label class="lw-entry-label" for="iqa_name">IQA Name *</label>
          <select id="iqa_name" name="iqa_name" class="lw-entry-select" required>
            <option value="">Select IQA</option>
            ${iqas.map(u => `<option value="${u.id}">${escapeHtml(u.email)}</option>`).join("")}
          </select>
        </div>
      </div>
    </div>

    <div class="lw-entry-section">
      <h3 class="lw-entry-section-title">Schedule</h3>
      <div class="lw-entry-grid">
        <div class="lw-entry-field">
          <label class="lw-entry-label" for="planned_date">Planned Date *</label>
          <input type="date" id="planned_date" name="planned_date" class="lw-entry-input" required>
        </div>
        <div class="lw-entry-field">
          <label class="lw-entry-label" for="due_date">Due Date</label>
          <input type="date" id="due_date" name="due_date" class="lw-entry-input">
        </div>
      </div>
    </div>
  `;

  // Render dynamic questions
  const questionsHtml = template.questions.map((q, index) => {
    const answerId = `answer_${q.id}`;
    const requiredAttr = q.is_required ? 'required' : '';
    const requiredLabel = q.is_required ? ' <span class="lw-entry-required">*</span>' : '';

    let inputHtml = '';

    switch (q.question_type) {
      case 'yes_no':
        inputHtml = `
          <div class="lw-entry-radio-group">
            <label class="lw-entry-radio"><input type="radio" name="${answerId}" value="yes" ${requiredAttr}> Yes</label>
            <label class="lw-entry-radio"><input type="radio" name="${answerId}" value="no" ${requiredAttr}> No</label>
          </div>`;
        break;
      case 'rag':
        inputHtml = `
          <div class="lw-entry-rag-group">
            <label class="lw-entry-rag green"><input type="radio" name="${answerId}" value="green" ${requiredAttr}> Green</label>
            <label class="lw-entry-rag amber"><input type="radio" name="${answerId}" value="amber" ${requiredAttr}> Amber</label>
            <label class="lw-entry-rag red"><input type="radio" name="${answerId}" value="red" ${requiredAttr}> Red</label>
          </div>`;
        break;
      case 'ggaw':
        inputHtml = `
          <div class="lw-entry-ggaw-group">
            <label class="lw-entry-ggaw gold"><input type="radio" name="${answerId}" value="gold" ${requiredAttr}> Gold</label>
            <label class="lw-entry-ggaw green"><input type="radio" name="${answerId}" value="green" ${requiredAttr}> Green</label>
            <label class="lw-entry-ggaw amber"><input type="radio" name="${answerId}" value="amber" ${requiredAttr}> Amber</label>
            <label class="lw-entry-ggaw white"><input type="radio" name="${answerId}" value="white" ${requiredAttr}> White</label>
          </div>`;
        break;
      case 'single_choice':
        const scOptions = q.options?.map(o => `<option value="${escapeHtml(o.value)}">${escapeHtml(o.label)}</option>`).join('') || '';
        inputHtml = `<select name="${answerId}" class="lw-entry-select" ${requiredAttr}><option value="">Select...</option>${scOptions}</select>`;
        break;
      case 'multiple_choice':
        const mcOptions = q.options?.map(o => `
          <label class="lw-entry-checkbox"><input type="checkbox" name="${answerId}[]" value="${escapeHtml(o.value)}"> ${escapeHtml(o.label)}</label>
        `).join('') || '';
        inputHtml = `<div class="lw-entry-checkbox-group">${mcOptions}</div>`;
        break;
      case 'dropdown':
        const ddOptions = q.options?.map(o => `<option value="${escapeHtml(o.value)}">${escapeHtml(o.label)}</option>`).join('') || '';
        inputHtml = `<select name="${answerId}" class="lw-entry-select" ${requiredAttr}><option value="">Select...</option>${ddOptions}</select>`;
        break;
      case 'text':
        inputHtml = `<input type="text" name="${answerId}" class="lw-entry-input" ${requiredAttr} placeholder="Enter answer...">`;
        break;
      case 'textarea':
        inputHtml = `<textarea name="${answerId}" class="lw-entry-textarea" ${requiredAttr} rows="4" placeholder="Enter detailed answer..."></textarea>`;
        break;
      case 'date':
        inputHtml = `<input type="date" name="${answerId}" class="lw-entry-input" ${requiredAttr}>`;
        break;
      case 'number':
        inputHtml = `<input type="number" name="${answerId}" class="lw-entry-input" ${requiredAttr} placeholder="Enter number...">`;
        break;
      case 'rating':
        inputHtml = `
          <div class="lw-entry-rating">
            ${[0, 1, 2, 3, 4, 5].map(n => `
              <label class="lw-entry-rating-star"><input type="radio" name="${answerId}" value="${n}" ${requiredAttr}> ${n}</label>
            `).join('')}
          </div>`;
        break;
      case 'ranking':
        const rankOptions = q.options?.map((o, i) => `
          <div class="lw-entry-rank-item">
            <span class="lw-entry-rank-label">${escapeHtml(o.label)}</span>
            <input type="number" name="${answerId}_${i}" class="lw-entry-rank-input" min="1" placeholder="Rank">
          </div>
        `).join('') || '';
        inputHtml = `<div class="lw-entry-rank-group">${rankOptions}</div>`;
        break;
      case 'time':
        inputHtml = `
          <div class="lw-entry-time-group">
            <select name="${answerId}_h" class="lw-entry-time-select" ${requiredAttr}>
              <option value="">HH</option>
              ${[1,2,3,4,5,6,7,8,9,10,11,12].map(h => `<option value="${h}">${h}</option>`).join('')}
            </select>
            <select name="${answerId}_m" class="lw-entry-time-select" ${requiredAttr}>
              <option value="">MM</option>
              <option value="00">00</option>
              <option value="15">15</option>
              <option value="30">30</option>
              <option value="45">45</option>
            </select>
            <select name="${answerId}_ap" class="lw-entry-time-select" ${requiredAttr}>
              <option value="">AM/PM</option>
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>`;
        break;
      case 'section':
        return `
          <div class="lw-entry-section-divider">
            <h3 class="lw-entry-section-heading">${escapeHtml(q.question_text)}</h3>
            ${q.text_entry_label ? `<p class="lw-entry-section-subdesc">${escapeHtml(q.text_entry_label)}</p>` : ''}
          </div>
        `;
      default:
        inputHtml = `<input type="text" name="${answerId}" class="lw-entry-input" placeholder="Enter answer...">`;
    }

    return `
      <div class="lw-entry-question" data-question-id="${q.id}" data-question-type="${q.question_type}">
        <label class="lw-entry-question-label">${index + 1}. ${escapeHtml(q.question_text)}${requiredLabel}</label>
        <div class="lw-entry-question-input">${inputHtml}</div>
      </div>
    `;
  }).join('');

  return pageShell(`New Learning Walk - ${escapeHtml(template.title)}`, `
    <main class="dashboard-shell">
      ${renderSidebar(identity, "learning-walks")}
      <section class="content">
        <header class="topbar">
          <div>
            <p class="eyebrow">New Learning Walk</p>
            <h1>${escapeHtml(template.title)}</h1>
          </div>
          <div style="display:flex;align-items:center;gap:1rem">
            <div class="profile-pill">${escapeHtml(identity.email)}</div>
            <a class="logout-link" href="/logout">Sign out</a>
          </div>
        </header>

        <form id="entryForm" class="lw-entry-form" onsubmit="return submitEntry(event)">
          <input type="hidden" id="template_id" value="${template.id}">

          <!-- Fixed Header Fields -->
          ${fixedFieldsHtml}

          <!-- Dynamic Questions -->
          <div class="lw-entry-section">
            <h3 class="lw-entry-section-title">Assessment Questions</h3>
            ${questionsHtml || '<p class="lw-entry-empty">No questions in this template.</p>'}
          </div>

          <!-- Comments Section -->
          <div class="lw-entry-section lw-entry-comments-section">
            <h3 class="lw-entry-section-title">Initial Comments (Optional)</h3>
            <p class="lw-entry-hint">Add any initial notes or context for this learning walk.</p>
            <textarea id="comments" name="comments" class="lw-entry-textarea" rows="4" placeholder="Enter your comments here..."></textarea>
          </div>

          <!-- Actions -->
          <div class="lw-entry-actions">
            <a href="/learning-walks" class="secondary-action">Cancel</a>
            <button type="submit" class="primary-action">Save Learning Walk</button>
          </div>
        </form>
      </section>
    </main>

    <script>
      async function submitEntry(e) {
        e.preventDefault();

        const templateId = document.getElementById('template_id').value;
        const courseId = document.getElementById('course_id').value;
        const courseName = document.getElementById('course_name').value;
        const assessorId = document.getElementById('assessor_name').value;
        const iqaId = document.getElementById('iqa_name').value;
        const plannedDate = document.getElementById('planned_date').value;
        const dueDate = document.getElementById('due_date').value;
        const comments = document.getElementById('comments').value;

        // Get selected user names
        const assessorSelect = document.getElementById('assessor_name');
        const iqaSelect = document.getElementById('iqa_name');
        const assessorName = assessorSelect.options[assessorSelect.selectedIndex].text;
        const iqaName = iqaSelect.options[iqaSelect.selectedIndex].text;

        // Collect answers
        const answers = [];
        document.querySelectorAll('[data-question-id]').forEach(qEl => {
          const questionId = qEl.dataset.questionId;
          const questionType = qEl.dataset.questionType;
          let answer = '';

          if (questionType === 'section') {
            return; // section headers have no answer
          } else if (questionType === 'yes_no' || questionType === 'rag' || questionType === 'ggaw' || questionType === 'rating') {
            const selected = qEl.querySelector('input[type="radio"]:checked');
            answer = selected ? selected.value : '';
          } else if (questionType === 'multiple_choice') {
            const selected = qEl.querySelectorAll('input[type="checkbox"]:checked');
            answer = Array.from(selected).map(cb => cb.value).join(', ');
          } else if (questionType === 'ranking') {
            // For ranking, collect all rank inputs
            const rankInputs = qEl.querySelectorAll('input[type="number"]');
            const ranks = [];
            rankInputs.forEach((input, idx) => {
              if (input.value) {
                ranks.push({ item: idx, rank: input.value });
              }
            });
            answer = JSON.stringify(ranks);
          } else if (questionType === 'time') {
            const hEl = document.querySelector(\`[name="\${questionId}_h"]\`);
            const mEl = document.querySelector(\`[name="\${questionId}_m"]\`);
            const apEl = document.querySelector(\`[name="\${questionId}_ap"]\`);
            const h = hEl ? hEl.value : '';
            const m = mEl ? mEl.value : '';
            const ap = apEl ? apEl.value : '';
            answer = (h && m && ap) ? \`\${h}:\${m}:\${ap}\` : '';
          } else {
            const input = qEl.querySelector('input, select, textarea');
            answer = input ? input.value : '';
          }

          answers.push({ question_id: questionId, answer: answer });
        });

        const payload = {
          template_id: templateId,
          course_id: courseId,
          course_name: courseName,
          assessor_name: assessorName,
          iqa_name: iqaName,
          planned_date: plannedDate,
          due_date: dueDate,
          allocated_iqa_id: iqaId,
          allocated_assessor_id: assessorId,
          answers: answers,
          comments: comments
        };

        try {
          const response = await fetch('/api/lw/entries', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || 'Failed to save');
          }

          const result = await response.json();
          alert('Learning Walk saved successfully!');
          window.location.href = '/learning-walks';
        } catch (err) {
          alert('Error saving Learning Walk: ' + (err.message || String(err)));
        }

        return false;
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
        "INSERT INTO lw_template_questions (id, template_id, question_text, question_type, options, is_required, sort_order, text_entry_label) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
      ).bind(
        crypto.randomUUID(),
        templateId,
        q.question_text,
        q.question_type,
        q.options ? JSON.stringify(q.options) : null,
        q.is_required ? 1 : 0,
        q.sort_order,
        (q as any).text_entry_label ?? null
      ).run();
    }

    return json({ success: true, templateId });
  } catch (err) {
    console.error("saveLWTemplate error:", err);
    return json({ error: "Failed to save template" }, 500);
  }
}

async function updateLWTemplate(request: Request, env: Env, identity: Identity, templateId: string): Promise<Response> {
  if (!canCreateForms(identity.user!)) {
    return json({ error: "Forbidden" }, 403);
  }

  try {
    // Verify ownership - only creator or admin/superuser can update
    const template = await env.esol_marking_db.prepare(
      "SELECT created_by FROM lw_templates WHERE id = ?"
    ).bind(templateId).first<{ created_by: string }>();

    if (!template) {
      return json({ error: "Template not found" }, 404);
    }

    const user = identity.user!;
    const isPrivileged = user.role === "admin" || user.role === "superuser";
    if (!isPrivileged && template.created_by !== user.id) {
      return json({ error: "Forbidden - you can only edit your own templates" }, 403);
    }

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
        text_entry_label?: string | null;
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
          "UPDATE lw_template_questions SET question_text = ?, question_type = ?, options = ?, is_required = ?, sort_order = ?, text_entry_label = ? WHERE id = ?"
        ).bind(
          q.question_text,
          q.question_type,
          q.options ? JSON.stringify(q.options) : null,
          q.is_required ? 1 : 0,
          q.sort_order,
          q.text_entry_label ?? null,
          q.id
        ).run();
        updatedIds.add(q.id);
      } else {
        // Insert new
        const newId = crypto.randomUUID();
        await env.esol_marking_db.prepare(
          "INSERT INTO lw_template_questions (id, template_id, question_text, question_type, options, is_required, sort_order, text_entry_label) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        ).bind(
          newId,
          templateId,
          q.question_text,
          q.question_type,
          q.options ? JSON.stringify(q.options) : null,
          q.is_required ? 1 : 0,
          q.sort_order,
          q.text_entry_label ?? null
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
    console.error("updateLWTemplate error:", err);
    return json({ error: "Failed to update template" }, 500);
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

    // Verify ownership - only creator or admin/superuser can delete
    const template = await env.esol_marking_db.prepare(
      "SELECT created_by FROM lw_templates WHERE id = ?"
    ).bind(templateId).first<{ created_by: string }>();

    if (!template) {
      return json({ error: "Template not found" }, 404);
    }

    const user = identity.user!;
    const isPrivileged = user.role === "admin" || user.role === "superuser";
    if (!isPrivileged && template.created_by !== user.id) {
      return json({ error: "Forbidden - you can only delete your own templates" }, 403);
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
    console.error("deleteLWTemplate error:", err);
    return json({ error: "Failed to delete template" }, 500);
  }
}

// ─── Learning Walk Entry Creation ───────────────────────────────────────────

async function renderLWEntryForm(request: Request, env: Env, identity: Identity): Promise<Response> {
  const url = new URL(request.url);
  const templateId = url.searchParams.get("templateId");

  if (!templateId) {
    return new Response(null, { status: 302, headers: { Location: "/learning-walks/entries/new" } });
  }

  // Check permission (IQA, Admin, Superuser can create entries)
  const user = identity.user!;
  const canCreateEntry = user.role === "iqa" || user.role === "admin" || user.role === "superuser";
  if (!canCreateEntry) {
    return htmlResponse(renderForbiddenPage(identity), 403);
  }

  // Get template with questions
  const template = await getLWTemplateWithQuestions(env, templateId);
  if (!template) {
    return htmlResponse(renderNotFoundPage(), 404);
  }

  // Get users for dropdowns (assessors and IQAs)
  const users = await env.esol_marking_db.prepare(
    "SELECT id, email, role FROM users WHERE role IN ('assessor', 'iqa', 'admin', 'superuser') ORDER BY email ASC"
  ).all<UserRecord>();

  return htmlResponse(renderLWEntryFormPage(identity, template, users.results));
}

async function saveLWEntry(request: Request, env: Env, identity: Identity): Promise<Response> {
  const user = identity.user!;
  const canCreateEntry = user.role === "iqa" || user.role === "admin" || user.role === "superuser";
  if (!canCreateEntry) {
    return json({ error: "Forbidden" }, 403);
  }

  try {
    const body = await request.json() as {
      template_id: string;
      course_id: string;
      course_name: string;
      assessor_name: string;
      iqa_name: string;
      planned_date: string;
      due_date?: string;
      allocated_iqa_id: string;
      allocated_assessor_id: string;
      answers: Array<{ question_id: string; answer: string }>;
      comments?: string;
    };

    const entryId = crypto.randomUUID();

    // Insert entry
    await env.esol_marking_db.prepare(
      `INSERT INTO lw_entries (
        id, template_id, course_id, course_name, assessor_name, iqa_name,
        planned_date, due_date, allocated_iqa_id, allocated_assessor_id,
        status, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      entryId,
      body.template_id,
      body.course_id,
      body.course_name,
      body.assessor_name,
      body.iqa_name,
      body.planned_date,
      body.due_date ?? null,
      body.allocated_iqa_id,
      body.allocated_assessor_id,
      "pending",
      user.id
    ).run();

    // Insert answers
    for (const answer of body.answers) {
      await env.esol_marking_db.prepare(
        `INSERT INTO lw_answers (id, entry_id, question_id, answer, updated_by, updated_at)
         VALUES (?, ?, ?, ?, ?, ?)`
      ).bind(
        crypto.randomUUID(),
        entryId,
        answer.question_id,
        answer.answer,
        user.id,
        new Date().toISOString()
      ).run();
    }

    // Insert initial comment if provided
    if (body.comments && body.comments.trim()) {
      await env.esol_marking_db.prepare(
        `INSERT INTO lw_comments (id, entry_id, author_id, author_role, comment)
         VALUES (?, ?, ?, ?, ?)`
      ).bind(
        crypto.randomUUID(),
        entryId,
        user.id,
        user.role,
        body.comments.trim()
      ).run();
    }

    return json({ success: true, entryId });
  } catch (err) {
    console.error("saveLWEntry error:", err);
    return json({ error: "Failed to save entry" }, 500);
  }
}

// Learning Walk Entry with Authorization Check
async function getLWEntryWithAuth(env: Env, identity: Identity, entryId: string): Promise<{ entry: any; canEdit: boolean; canComment: boolean; canComplete: boolean } | null> {
  const user = identity.user!;

  // Fetch entry
  const entry = await env.esol_marking_db.prepare(
    `SELECT e.*, t.title as template_title
     FROM lw_entries e
     JOIN lw_templates t ON t.id = e.template_id
     WHERE e.id = ?`
  ).bind(entryId).first() as any;

  if (!entry) return null;

  // Check authorization
  const isSuperuser = user.role === "superuser";
  const isAdmin = user.role === "admin";
  const isAllocatedIQA = entry.allocated_iqa_id === user.id;
  const isAllocatedAssessor = entry.allocated_assessor_id === user.id;

  const canView = isSuperuser || isAdmin || isAllocatedIQA || isAllocatedAssessor;
  if (!canView) return null;

  // Check if form is locked (assessor has commented)
  const assessorCommentCount = await env.esol_marking_db.prepare(
    `SELECT COUNT(*) as count FROM lw_comments WHERE entry_id = ? AND author_role = 'assessor'`
  ).bind(entryId).first() as { count: number } | null;
  const isLocked = (assessorCommentCount?.count ?? 0) > 0 || entry.status === "complete";

  // IQA can edit if not locked and they are the allocated IQA
  const canEdit = (isSuperuser || isAdmin || isAllocatedIQA) && !isLocked;

  // Anyone with access can comment
  const canComment = canView;

  // Only admin can complete
  const canComplete = isAdmin || isSuperuser;

  return { entry, canEdit, canComment, canComplete };
}

// Render Learning Walk Entry View Page
async function renderLWEntryView(request: Request, env: Env, identity: Identity, entryId: string): Promise<Response> {
  const user = identity.user!;
  const auth = await getLWEntryWithAuth(env, identity, entryId);

  if (!auth) {
    return htmlResponse(renderNotFoundPage(), 404);
  }

  const { entry, canEdit, canComment, canComplete } = auth;

  // Fetch template questions
  const questionsResult = await env.esol_marking_db.prepare(
    `SELECT * FROM lw_template_questions WHERE template_id = ? ORDER BY sort_order ASC`
  ).bind(entry.template_id).all();
  const questions = questionsResult.results || [];

  // Fetch answers
  const answersResult = await env.esol_marking_db.prepare(
    `SELECT * FROM lw_answers WHERE entry_id = ?`
  ).bind(entryId).all();
  const answersMap = new Map((answersResult.results || []).map((a: any) => [a.question_id, a.answer]));

  // Fetch comments
  const commentsResult = await env.esol_marking_db.prepare(
    `SELECT c.*, u.email as author_email
     FROM lw_comments c
     LEFT JOIN users u ON u.id = c.author_id
     WHERE c.entry_id = ?
     ORDER BY c.created_at DESC`
  ).bind(entryId).all();
  const comments = commentsResult.results || [];

  return htmlResponse(renderLWEntryViewPage(identity, entry, questions, answersMap, comments, canEdit, canComment, canComplete));
}

// Render the Entry View Page HTML
function renderLWEntryViewPage(
  identity: Identity,
  entry: any,
  questions: any[],
  answersMap: Map<string, string>,
  comments: any[],
  canEdit: boolean,
  canComment: boolean,
  canComplete: boolean
): string {
  const user = identity.user!;
  const statusLabels: Record<string, string> = {
    pending: "Pending",
    iqa_completed: "IQA Completed",
    assessor_responded: "Assessor Responded",
    complete: "Complete"
  };
  const statusBadge = `<span class="lw-status-badge ${entry.status}">${statusLabels[entry.status] || entry.status}</span>`;

  const formatDate = (d: string | null | undefined) => d ? new Date(d).toLocaleDateString() : "-";

  // Render questions
  const questionsHtml = questions.map((q: any, index: number) => {
    const answer = answersMap.get(q.id) || "";
    const isEditable = canEdit;
    const questionId = `question-${q.id}`;

    let inputHtml = "";
    const options = q.options ? JSON.parse(q.options) : [];

    switch (q.question_type) {
      case "yes_no":
        inputHtml = `<div class="lw-entry-radio-group">${["Yes", "No"].map(opt => `
          <label class="lw-entry-radio ${isEditable ? "" : "disabled"}">
            <input type="radio" name="${questionId}" value="${opt}" ${answer === opt ? "checked" : ""} ${isEditable ? "" : "disabled"}>
            <span>${opt}</span>
          </label>
        `).join("")}</div>`;
        break;
      case "rag":
        inputHtml = `<div class="lw-entry-rag-group">${[
          { val: "Green", cls: "green" },
          { val: "Amber", cls: "amber" },
          { val: "Red", cls: "red" }
        ].map(opt => `
          <label class="lw-entry-rag ${opt.cls} ${isEditable ? "" : "disabled"}">
            <input type="radio" name="${questionId}" value="${opt.val}" ${answer === opt.val ? "checked" : ""} ${isEditable ? "" : "disabled"}>
            <span>${opt.val}</span>
          </label>
        `).join("")}</div>`;
        break;
      case "ggaw":
        inputHtml = `<div class="lw-entry-ggaw-group">${[
          { val: "Gold", cls: "gold" },
          { val: "Green", cls: "green" },
          { val: "Amber", cls: "amber" },
          { val: "White", cls: "white" }
        ].map(opt => `
          <label class="lw-entry-ggaw ${opt.cls} ${isEditable ? "" : "disabled"}">
            <input type="radio" name="${questionId}" value="${opt.val}" ${answer === opt.val ? "checked" : ""} ${isEditable ? "" : "disabled"}>
            <span>${opt.val}</span>
          </label>
        `).join("")}</div>`;
        break;
      case "single_choice":
        inputHtml = `<div class="lw-entry-radio-group">${options.map((opt: string) => `
          <label class="lw-entry-radio ${isEditable ? "" : "disabled"}">
            <input type="radio" name="${questionId}" value="${escapeHtml(opt)}" ${answer === opt ? "checked" : ""} ${isEditable ? "" : "disabled"}>
            <span>${escapeHtml(opt)}</span>
          </label>
        `).join("")}</div>`;
        break;
      case "multiple_choice":
        const selectedAnswers = answer ? answer.split(", ") : [];
        inputHtml = `<div class="lw-entry-checkbox-group">${options.map((opt: string) => `
          <label class="lw-entry-checkbox ${isEditable ? "" : "disabled"}">
            <input type="checkbox" name="${questionId}" value="${escapeHtml(opt)}" ${selectedAnswers.includes(opt) ? "checked" : ""} ${isEditable ? "" : "disabled"}>
            <span>${escapeHtml(opt)}</span>
          </label>
        `).join("")}</div>`;
        break;
      case "dropdown":
        inputHtml = `<select name="${questionId}" class="lw-entry-select" ${isEditable ? "" : "disabled"}>
          <option value="">Select...</option>
          ${options.map((opt: string) => `<option value="${escapeHtml(opt)}" ${answer === opt ? "selected" : ""}>${escapeHtml(opt)}</option>`).join("")}
        </select>`;
        break;
      case "textarea":
        inputHtml = `<textarea name="${questionId}" class="lw-entry-textarea" placeholder="Enter your answer..." ${isEditable ? "" : "disabled"}>${escapeHtml(answer)}</textarea>`;
        break;
      case "date":
        inputHtml = `<input type="date" name="${questionId}" class="lw-entry-input" value="${escapeHtml(answer)}" ${isEditable ? "" : "disabled"}>`;
        break;
      case "number":
        inputHtml = `<input type="number" name="${questionId}" class="lw-entry-input" value="${escapeHtml(answer)}" ${isEditable ? "" : "disabled"}>`;
        break;
      case "rating":
        inputHtml = `<div class="lw-entry-rating">${[0, 1, 2, 3, 4, 5].map(num => `
          <label class="lw-entry-rating-star ${isEditable ? "" : "disabled"}">
            <input type="radio" name="${questionId}" value="${num}" ${answer === String(num) ? "checked" : ""} ${isEditable ? "" : "disabled"}>
            <span>${num}</span>
          </label>
        `).join("")}</div>`;
        break;
      case "time": {
        const parts = answer ? answer.split(":") : [];
        const tHour = parts[0] || "";
        const tMin = parts[1] || "";
        const tAP = parts[2] || "";
        inputHtml = `
          <div class="lw-entry-time-group">
            <select name="${questionId}_h" class="lw-entry-time-select" ${isEditable ? "" : "disabled"}>
              <option value="">HH</option>
              ${[1,2,3,4,5,6,7,8,9,10,11,12].map(h => `<option value="${h}" ${tHour === String(h) ? "selected" : ""}>${h}</option>`).join("")}
            </select>
            <select name="${questionId}_m" class="lw-entry-time-select" ${isEditable ? "" : "disabled"}>
              <option value="">MM</option>
              ${["00","15","30","45"].map(m => `<option value="${m}" ${tMin === m ? "selected" : ""}>${m}</option>`).join("")}
            </select>
            <select name="${questionId}_ap" class="lw-entry-time-select" ${isEditable ? "" : "disabled"}>
              <option value="">AM/PM</option>
              <option value="AM" ${tAP === "AM" ? "selected" : ""}>AM</option>
              <option value="PM" ${tAP === "PM" ? "selected" : ""}>PM</option>
            </select>
          </div>`;
        break;
      }
      case "section":
        return `
          <div class="lw-entry-section-divider">
            <h3 class="lw-entry-section-heading">${escapeHtml(q.question_text)}</h3>
            ${q.text_entry_label ? `<p class="lw-entry-section-subdesc">${escapeHtml(q.text_entry_label)}</p>` : ""}
          </div>
        `;
      default:
        inputHtml = `<input type="text" name="${questionId}" class="lw-entry-input" value="${escapeHtml(answer)}" ${isEditable ? "" : "disabled"}>`;
    }

    return `
      <div class="lw-entry-question" data-question-id="${q.id}" data-question-type="${q.question_type}">
        <label class="lw-entry-question-label">
          <span>${index + 1}. ${escapeHtml(q.question_text)}</span>
          ${q.is_required ? '<span class="lw-entry-required">*</span>' : ""}
        </label>
        ${inputHtml}
      </div>
    `;
  }).join("");

  // Comments HTML
  const commentsHtml = comments.length > 0 ? comments.map((c: any) => `
    <div class="lw-comment-item">
      <div class="lw-comment-header">
        <span class="lw-comment-author">${escapeHtml(c.author_email || "Unknown")}</span>
        <span class="lw-comment-role">${c.author_role}</span>
        <span class="lw-comment-date">${new Date(c.created_at).toLocaleString()}</span>
      </div>
      <div class="lw-comment-text">${escapeHtml(c.comment)}</div>
    </div>
  `).join("") : `<div class="lw-entry-empty">No comments yet.</div>`;

  // Action buttons
  const actionsHtml = [];
  if (canEdit) {
    actionsHtml.push(`<button type="button" class="primary-action" onclick="saveChanges()">Save Changes</button>`);
  }
  if (canComplete && entry.status !== "complete") {
    actionsHtml.push(`<button type="button" class="secondary-action" onclick="markComplete()" style="background:#16a34a;color:#fff;">Mark Complete</button>`);
  }

  const body = `
    <main class="dashboard-shell">
      ${renderSidebar(identity, "learning-walks")}
      <section class="content">
        <header class="topbar">
          <div style="display:flex;align-items:center;gap:1rem;">
            <a href="/learning-walks" class="small-action" style="width:auto;padding:0.5rem 1rem;">← Back</a>
            <div><p class="eyebrow">Learning Walks</p><h1>${escapeHtml(entry.template_title)}</h1></div>
          </div>
          <div style="display:flex;align-items:center;gap:1rem;">
            ${statusBadge}
            <div class="profile-pill">${escapeHtml(identity.email)}</div>
            <a class="logout-link" href="/logout">Sign out</a>
          </div>
        </header>

        <div class="lw-entry-form" data-entry-id="${entry.id}">
          <!-- Fixed Header Fields -->
          <section class="lw-entry-section">
            <h2 class="lw-entry-section-title">📋 Course Information</h2>
            <div class="lw-entry-grid">
              <div class="lw-entry-field">
                <label class="lw-entry-label">Course ID</label>
                <input type="text" class="lw-entry-input" value="${escapeHtml(entry.course_id)}" disabled>
              </div>
              <div class="lw-entry-field">
                <label class="lw-entry-label">Course Name</label>
                <input type="text" class="lw-entry-input" value="${escapeHtml(entry.course_name)}" disabled>
              </div>
              <div class="lw-entry-field">
                <label class="lw-entry-label">Assessor</label>
                <input type="text" class="lw-entry-input" value="${escapeHtml(entry.assessor_name)}" disabled>
              </div>
              <div class="lw-entry-field">
                <label class="lw-entry-label">IQA</label>
                <input type="text" class="lw-entry-input" value="${escapeHtml(entry.iqa_name)}" disabled>
              </div>
              <div class="lw-entry-field">
                <label class="lw-entry-label">Planned Date</label>
                <input type="text" class="lw-entry-input" value="${formatDate(entry.planned_date)}" disabled>
              </div>
              <div class="lw-entry-field">
                <label class="lw-entry-label">Due Date</label>
                <input type="text" class="lw-entry-input" value="${formatDate(entry.due_date)}" disabled>
              </div>
            </div>
          </section>

          <!-- Questions -->
          <section class="lw-entry-section">
            <h2 class="lw-entry-section-title">📝 Assessment Questions</h2>
            ${questionsHtml || '<div class="lw-entry-empty">No questions in this template.</div>'}
          </section>

          <!-- Comments Section -->
          <section class="lw-entry-section lw-entry-comments-section">
            <h2 class="lw-entry-section-title">💬 Comments & Paper Trail</h2>
            <div class="lw-comments-list">
              ${commentsHtml}
            </div>
            ${canComment ? `
              <div class="lw-comment-add" style="margin-top:1.5rem;">
                <label class="lw-entry-label">Add a comment</label>
                <textarea id="newComment" class="lw-entry-textarea" placeholder="Enter your comment..." rows="3"></textarea>
                <button type="button" class="small-action" onclick="addComment()" style="margin-top:0.75rem;">Post Comment</button>
              </div>
            ` : ""}
          </section>

          <!-- Actions -->
          ${actionsHtml.length > 0 ? `
            <div class="lw-entry-actions">
              ${actionsHtml.join("")}
            </div>
          ` : ""}
        </div>
      </section>
    </main>

    <script>
      const entryId = "${entry.id}";
      const canEdit = ${canEdit};

      async function addComment() {
        const textarea = document.getElementById('newComment');
        const comment = textarea.value.trim();
        if (!comment) return alert('Please enter a comment');

        try {
          const res = await fetch(\`/api/lw/entries/\${entryId}/comments\`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ comment })
          });
          if (res.ok) {
            location.reload();
          } else {
            alert('Failed to add comment');
          }
        } catch (err) {
          alert('Error adding comment');
        }
      }

      async function saveChanges() {
        if (!canEdit) return alert('You do not have permission to edit this form');

        const answers = [];
        document.querySelectorAll('.lw-entry-question[data-question-type]').forEach((q, idx) => {
          const qType = q.dataset.questionType;
          const qId = q.dataset.questionId;
          if (!qId || qType === 'section') return;

          const questionId = qId;
          let answer = '';

          if (qType === 'time') {
            const h = document.querySelector(\`[name="question-\${questionId}_h"]\`)?.value || '';
            const m = document.querySelector(\`[name="question-\${questionId}_m"]\`)?.value || '';
            const ap = document.querySelector(\`[name="question-\${questionId}_ap"]\`)?.value || '';
            answer = (h && m && ap) ? \`\${h}:\${m}:\${ap}\` : '';
          } else {
            const inputs = q.querySelectorAll('input[name^="question-"], select[name^="question-"], textarea[name^="question-"]');
            inputs.forEach(input => {
              if (input.type === 'radio' && input.checked) {
                answer = input.value;
              } else if (input.type === 'checkbox' && input.checked) {
                answer = answer ? answer + ', ' + input.value : input.value;
              } else if (input.type !== 'radio' && input.type !== 'checkbox') {
                answer = input.value;
              }
            });
          }

          answers.push({ question_id: questionId, answer });
        });

        try {
          const res = await fetch(\`/api/lw/entries/\${entryId}/update\`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ answers })
          });
          if (res.ok) {
            alert('Changes saved successfully');
            location.reload();
          } else {
            alert('Failed to save changes');
          }
        } catch (err) {
          alert('Error saving changes');
        }
      }

      async function markComplete() {
        if (!confirm('Mark this learning walk as complete? This action cannot be undone.')) return;

        try {
          const res = await fetch(\`/api/lw/entries/\${entryId}/complete\`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          });
          if (res.ok) {
            alert('Learning walk marked as complete');
            location.reload();
          } else {
            alert('Failed to mark as complete');
          }
        } catch (err) {
          alert('Error marking as complete');
        }
      }
    </script>
  `;

  return pageShell(`Learning Walk - ${entry.template_title}`, body);
}

// API: Add Comment to Learning Walk Entry
async function addLWEntryComment(request: Request, env: Env, identity: Identity, entryId: string): Promise<Response> {
  const user = identity.user!;

  // Check authorization
  const auth = await getLWEntryWithAuth(env, identity, entryId);
  if (!auth || !auth.canComment) {
    return json({ error: "Forbidden" }, 403);
  }

  try {
    const body = await request.json() as { comment: string };
    const comment = body.comment?.trim();

    if (!comment) {
      return json({ error: "Comment is required" }, 400);
    }

    await env.esol_marking_db.prepare(
      `INSERT INTO lw_comments (id, entry_id, author_id, author_role, comment)
       VALUES (?, ?, ?, ?, ?)`
    ).bind(
      crypto.randomUUID(),
      entryId,
      user.id,
      user.role,
      comment
    ).run();

    // Update status if assessor is commenting
    if (user.role === "assessor") {
      await env.esol_marking_db.prepare(
        `UPDATE lw_entries SET status = 'assessor_responded', assessor_responded_at = ? WHERE id = ?`
      ).bind(new Date().toISOString(), entryId).run();
    }

    return json({ success: true });
  } catch (err) {
    console.error("addLWEntryComment error:", err);
    return json({ error: "Failed to add comment" }, 500);
  }
}

// API: Update Learning Walk Entry Answers (IQA editing)
async function updateLWEntry(request: Request, env: Env, identity: Identity, entryId: string): Promise<Response> {
  const user = identity.user!;

  // Check authorization
  const auth = await getLWEntryWithAuth(env, identity, entryId);
  if (!auth || !auth.canEdit) {
    return json({ error: "Forbidden or form is locked" }, 403);
  }

  try {
    const body = await request.json() as { answers: Array<{ question_id: string; answer: string }> };

    // Update each answer
    for (const ans of body.answers) {
      // Check if answer exists
      const existing = await env.esol_marking_db.prepare(
        `SELECT id FROM lw_answers WHERE entry_id = ? AND question_id = ?`
      ).bind(entryId, ans.question_id).first();

      if (existing) {
        // Update existing answer
        await env.esol_marking_db.prepare(
          `UPDATE lw_answers SET answer = ?, updated_by = ?, updated_at = ? WHERE entry_id = ? AND question_id = ?`
        ).bind(ans.answer, user.id, new Date().toISOString(), entryId, ans.question_id).run();
      } else {
        // Insert new answer
        await env.esol_marking_db.prepare(
          `INSERT INTO lw_answers (id, entry_id, question_id, answer, updated_by, updated_at)
           VALUES (?, ?, ?, ?, ?, ?)`
        ).bind(crypto.randomUUID(), entryId, ans.question_id, ans.answer, user.id, new Date().toISOString()).run();
      }
    }

    // Update status to iqa_completed if not already
    await env.esol_marking_db.prepare(
      `UPDATE lw_entries SET status = 'iqa_completed', iqa_completed_at = ? WHERE id = ? AND status = 'pending'`
    ).bind(new Date().toISOString(), entryId).run();

    return json({ success: true });
  } catch (err) {
    console.error("updateLWEntry error:", err);
    return json({ error: "Failed to update entry" }, 500);
  }
}

// API: Mark Learning Walk Entry as Complete (Admin only)
async function completeLWEntry(request: Request, env: Env, identity: Identity, entryId: string): Promise<Response> {
  const user = identity.user!;

  // Check authorization
  const auth = await getLWEntryWithAuth(env, identity, entryId);
  if (!auth || !auth.canComplete) {
    return json({ error: "Forbidden" }, 403);
  }

  try {
    await env.esol_marking_db.prepare(
      `UPDATE lw_entries SET status = 'complete', completed_at = ? WHERE id = ?`
    ).bind(new Date().toISOString(), entryId).run();

    return json({ success: true });
  } catch (err) {
    console.error("completeLWEntry error:", err);
    return json({ error: "Failed to complete entry" }, 500);
  }
}

// API: Delete Learning Walk Entry (Superuser only)
async function deleteLWEntry(request: Request, env: Env, identity: Identity, entryId: string): Promise<Response> {
  const user = identity.user!;

  if (user.role !== "superuser") {
    return json({ error: "Forbidden: superuser only" }, 403);
  }

  // Verify entry exists
  const entry = await env.esol_marking_db.prepare(
    `SELECT id FROM lw_entries WHERE id = ?`
  ).bind(entryId).first() as { id: string } | null;

  if (!entry) {
    return json({ error: "Entry not found" }, 404);
  }

  try {
    // Delete in correct order: child tables first, then the entry itself
    // lw_comments references lw_entries
    await env.esol_marking_db.prepare(`DELETE FROM lw_comments WHERE entry_id = ?`).bind(entryId).run();
    // lw_answers references lw_entries
    await env.esol_marking_db.prepare(`DELETE FROM lw_answers WHERE entry_id = ?`).bind(entryId).run();
    // lw_notifications references lw_entries
    await env.esol_marking_db.prepare(`DELETE FROM lw_notifications WHERE entry_id = ?`).bind(entryId).run();
    // Finally delete the entry itself
    await env.esol_marking_db.prepare(`DELETE FROM lw_entries WHERE id = ?`).bind(entryId).run();

    return json({ success: true });
  } catch (err) {
    console.error("deleteLWEntry error:", err);
    return json({ error: "Failed to delete entry" }, 500);
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
  // Try to serve from Cloudflare Assets binding first
  if (env.ASSETS) {
    try {
      const assetResponse = await (env.ASSETS as any).fetch(new Request("http://localhost" + pathname));
      if (assetResponse.status !== 404) return assetResponse;
    } catch {}
  }
  // Fallback: serve favicon.png as a transparent 1x1 PNG placeholder
  if (pathname === "/favicon.png") {
    const transparentPng = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 1, 0, 0, 0, 1, 8, 6, 0, 0, 0, 31, 21, 196, 137, 0, 0, 0, 13, 73, 68, 65, 84, 8, 215, 99, 250, 207, 192, 240, 0, 0, 0, 3, 0, 1, 0, 5, 254, 211, 0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130]);
    return new Response(transparentPng, { status: 200, headers: { "content-type": "image/png" } });
  }
  return new Response("Not found", { status: 404 });
}

function pageShell(title: string, body: string) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(title)} | ESOLQA</title><link rel="icon" type="image/x-icon" href="/favicon.ico"><style>
    :root{--bg:#f7f8fc;--panel:#ffffff;--text:#0f172a;--muted:#64748b;--primary:#ff005a;--primary-dark:#cc0048;--secondary:#1a1f2e;--border:#e5e7eb;--success:#e6f7ee;--warn:#fff4e5;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);min-height:100vh}a{color:inherit;text-decoration:none}button,.small-action,.primary-action{border:0;border-radius:8px;background:var(--primary);color:#fff;font-weight:600;padding:.7rem 1.25rem;cursor:pointer;display:inline-flex;justify-content:center;align-items:center;gap:.5rem;font-size:.9375rem;transition:background .15s}.primary-action{width:100%;margin:1rem 0}.small-action{width:auto}.primary-action:hover,button:hover,.small-action:hover{background:var(--primary-dark)}input,select,textarea{width:100%;border:1px solid var(--border);border-radius:8px;padding:.75rem 1rem;font:inherit;background:#fff;color:var(--text);transition:border-color .15s,box-shadow .15s}input:focus,select:focus,textarea:focus{outline:none;border-color:var(--primary);box-shadow:0 0 0 2px rgba(255,0,90,.2)}textarea{resize:vertical}.auth-shell{min-height:100vh;display:grid;place-items:center;padding:2rem;background:var(--bg)}.auth-card{width:min(100%,30rem);background:var(--panel);border:1px solid var(--border);border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,.08);padding:2.5rem;text-align:center}.brand-mark{width:3rem;height:3rem;display:inline-grid;place-items:center;border-radius:10px;background:var(--primary);color:#fff;font-weight:800}.eyebrow{margin:0 0 .5rem;color:var(--primary);font-size:.75rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase}h1,h2,p{margin-top:0}h1{font-size:clamp(1.75rem,4vw,2.5rem);line-height:1.15;margin-bottom:.75rem;font-weight:700;color:var(--text)}h2{font-size:1.25rem;font-weight:600;color:var(--text)}.lede,.hint{color:var(--muted);line-height:1.6}.dashboard-shell{display:grid;grid-template-columns:17rem 1fr;min-height:100vh}.sidebar{background:#1a1f2e;color:#cbd5f5;padding:1.5rem}.sidebar-brand{display:flex;align-items:center;gap:.8rem;margin-bottom:2rem}.sidebar-brand strong{color:#fff}.sidebar-brand span{display:block;color:#94a3b8;font-size:.8rem}nav{display:grid;gap:.25rem}nav a{padding:.75rem 1rem;border-radius:8px;color:#94a3b8;font-size:.9375rem;font-weight:500;transition:background .15s,color .15s}nav a:hover{background:rgba(255,255,255,.07);color:#fff}.nav-active{background:rgba(255,0,90,.15)!important;color:#fff!important}.content{padding:2rem;overflow-y:auto}.topbar{display:flex;align-items:center;justify-content:space-between;gap:1rem;margin-bottom:2rem;padding-bottom:1.25rem;border-bottom:1px solid var(--border)}.profile-pill{background:var(--panel);border:1px solid var(--border);border-radius:999px;padding:.5rem 1rem;color:var(--muted);font-weight:600;font-size:.9rem}.logout-link{color:var(--primary);font-weight:600;font-size:.9rem}.panel{background:var(--panel);border:1px solid var(--border);border-radius:12px;box-shadow:0 1px 4px rgba(0,0,0,.04);padding:1.5rem;margin-bottom:1.5rem}.toolbar{display:flex;justify-content:space-between;gap:1rem;align-items:center}.search-form{display:flex;gap:.8rem;flex:1}.actions-row{display:flex;gap:.8rem;align-items:center;flex-wrap:wrap}.grid-two{display:grid;grid-template-columns:1fr 1fr;gap:1rem}.list-stack{display:grid;gap:.75rem}.list-card{display:grid;gap:.35rem;border:1px solid var(--border);border-radius:10px;padding:1rem;background:var(--panel);transition:box-shadow .15s}.list-card:hover{box-shadow:0 4px 12px rgba(0,0,0,.06)}.list-card span,.list-card small{color:var(--muted)}.empty-state{border:1px dashed var(--border);border-radius:10px;padding:1.5rem;text-align:center;color:var(--muted)}.form-grid{display:grid;grid-template-columns:2fr 1fr 1fr auto;gap:1rem;align-items:end}.stack-form{display:grid;gap:1rem}.narrow-panel{max-width:54rem}.modal-like{margin:auto}.user-table{display:grid;gap:.75rem}.user-row{display:flex;justify-content:space-between;gap:1rem;align-items:center;border-bottom:1px solid var(--border);padding:.8rem 0}.user-row span{display:block;color:var(--muted)}.user-row form{display:flex;gap:.5rem}.meta-panel{display:flex;gap:1rem;flex-wrap:wrap}.checklist-panel{overflow:auto}.checklist-table{width:100%;border-collapse:collapse}.checklist-table th,.checklist-table td{border:1px solid var(--border);padding:.8rem;vertical-align:top}.checklist-table th{background:#f8fafc;text-align:left;color:var(--muted);font-size:.875rem;font-weight:600}.readonly-cell{min-height:3rem;color:var(--muted);white-space:pre-wrap}.comment-form{display:grid;gap:.8rem;margin-top:1rem}@media(max-width:900px){.dashboard-shell,.grid-two{grid-template-columns:1fr}.toolbar,.topbar,.form-grid{display:grid;grid-template-columns:1fr}.search-form{display:grid}.user-row{display:grid}}
  /* Form Builder Styles - MS Forms inspired */
    .form-builder-content{background:var(--bg);min-height:100vh;padding:1.5rem 2rem}
    .form-builder-container{width:100%;max-width:100%;display:grid;gap:1rem}
    .form-header-card{background:var(--panel);border-radius:12px;padding:2rem 2.5rem;box-shadow:0 2px 8px rgba(0,0,0,.06);border-top:4px solid var(--primary)}
    .form-title-input{width:100%;border:none;border-bottom:3px solid transparent;font-size:2.25rem;font-weight:700;color:var(--text);padding:0.75rem 0;margin-bottom:0.75rem;background:transparent;letter-spacing:-0.02em;font-family:inherit}
    .form-title-input:focus{outline:none;border-bottom-color:var(--primary)}
    .form-title-input::placeholder{color:var(--muted);font-weight:400}
    .form-desc-input{width:100%;border:none;font-size:1.125rem;color:var(--muted);padding:0.75rem 0;resize:none;background:transparent;line-height:1.5;font-family:inherit}
    .form-desc-input:focus{outline:none}
    .form-desc-input::placeholder{color:#9ca3af}
    .form-section-card{background:var(--panel);border-radius:12px;padding:2rem;box-shadow:0 2px 8px rgba(0,0,0,.06);border:1px solid var(--border)}
    .section-title{font-size:1.25rem;font-weight:700;margin:0 0 0.75rem 0;color:var(--text);letter-spacing:-0.01em}
    .section-hint{font-size:0.9375rem;color:var(--muted);margin:0 0 1.25rem 0;line-height:1.5}
    .header-fields-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1.5rem}
    .header-field-preview label{display:block;font-size:0.9375rem;font-weight:600;color:var(--text);margin-bottom:0.5rem}
    .header-field-preview .req{color:#dc2626;margin-left:0.25rem}
    .field-preview{background:#f8fafc;border:1px solid var(--border);border-radius:8px;padding:0.75rem 1rem;color:var(--muted);font-size:0.9375rem}
    .question-card{background:var(--panel);border:1px solid var(--border);border-radius:12px;padding:1.5rem 2rem;margin-bottom:1rem;box-shadow:0 1px 4px rgba(0,0,0,.04);transition:all 0.2s}
    .question-card:hover{border-color:var(--primary);box-shadow:0 4px 12px rgba(255,0,90,.1)}
    .question-header{display:flex;align-items:center;gap:1rem;margin-bottom:1rem;padding-bottom:0.75rem;border-bottom:1px solid var(--border)}
    .q-number{width:2rem;height:2rem;background:var(--primary);color:#fff;border-radius:50%;display:grid;place-items:center;font-size:0.9375rem;font-weight:700}
    .q-type-badge{font-size:0.8125rem;padding:0.375rem 0.75rem;background:rgba(255,0,90,.08);color:var(--primary);border-radius:6px;font-weight:600}
    .req-badge{font-size:0.8125rem;padding:0.375rem 0.75rem;background:#fef3c7;color:#92400e;border-radius:6px;font-weight:600}
    .visibility-badge{font-size:0.8125rem;padding:0.375rem 0.75rem;background:#f1f5f9;color:var(--muted);border-radius:6px;margin-left:auto;font-weight:500}
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
    .lwfb-popup-container{background:#fff;border-radius:16px;width:100%;max-width:1200px;max-height:calc(100vh - 4rem);display:flex;flex-direction:column;box-shadow:0 16px 64px rgba(0,0,0,0.18)}
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
    .lwfb-question-card{background:#fff;border:1px solid var(--border);border-radius:12px;padding:1.5rem;margin-bottom:1rem;box-shadow:0 1px 4px rgba(0,0,0,.04);transition:all 0.2s}
    .lwfb-question-card:hover{border-color:var(--primary);box-shadow:0 4px 12px rgba(255,0,90,.1)}
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
    .lwfb-reorder-btns{display:flex;gap:0.25rem}
    .lwfb-reorder-btn{background:#f1f5f9;border:1px solid var(--border);border-radius:5px;color:var(--muted);font-size:0.75rem;width:1.75rem;height:1.75rem;display:grid;place-items:center;cursor:pointer;transition:all 0.15s;padding:0}
    .lwfb-reorder-btn:hover{background:var(--primary);color:#fff;border-color:var(--primary)}
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
    .lwfb-add-wrapper{display:flex;justify-content:center;padding:1rem 0;margin-bottom:0}
    .lwfb-add-btn{background:#fff;border:2px dashed var(--border);border-radius:8px;padding:1rem 2rem;cursor:pointer;display:flex;align-items:center;gap:0.75rem;color:var(--muted);font-weight:500;transition:all 0.2s;font-size:1rem}
    .lwfb-add-btn:hover{border-color:var(--primary);color:var(--primary)}
    .lwfb-add-btn .plus-icon{font-size:1.5rem;font-weight:300}
    .lwfb-type-picker{background:#f8fafc;border-radius:12px;border:1px solid var(--border);padding:1.25rem;margin-top:0.75rem}
    .lwfb-type-picker .picker-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;padding-bottom:0.5rem;border-bottom:1px solid var(--border)}
    .lwfb-type-picker .picker-header span{font-weight:600;color:var(--text)}
    .lwfb-type-picker .picker-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:0.75rem}
    .lwfb-type-picker .type-option{background:#fff;border:1px solid var(--border);border-radius:8px;padding:0.875rem 0.5rem;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:0.4rem;transition:all 0.15s}
    .lwfb-type-picker .type-option:hover{border-color:var(--primary);box-shadow:0 2px 8px rgba(255,0,90,.12);background:#fff}
    .lwfb-type-picker .type-icon{font-size:1.375rem}
    .lwfb-type-picker .type-label{font-size:0.8125rem;font-weight:600;color:var(--text);text-align:center}
    .lwfb-type-picker .type-desc{font-size:0.6875rem;color:var(--muted);text-align:center;line-height:1.3}
    .lwfb-empty-state{color:var(--muted);font-style:italic;padding:2rem;text-align:center;background:#f8fafc;border-radius:8px;border:1px dashed var(--border)}
    .lw-entry-section-divider{padding:1.25rem 0 0.5rem;margin-bottom:0.5rem;border-bottom:2px solid var(--border)}
    .lw-entry-section-heading{font-size:1.125rem;font-weight:700;color:var(--text);margin:0 0 0.35rem}
    .lw-entry-section-subdesc{font-size:0.9375rem;color:var(--muted);margin:0}
    .lw-entry-time-group{display:flex;gap:0.75rem;align-items:center}
    .lw-entry-time-select{width:auto;flex:1;border:1px solid var(--border);border-radius:8px;padding:0.75rem;font-size:1rem}
    .lwfb-comments-section{background:linear-gradient(135deg,#f8fafc 0%,#fff 100%);border-left:4px solid #d97706}
    .lwfb-comments-list{max-height:200px;overflow-y:auto}
    .lwfb-empty-comments{color:var(--muted);font-style:italic;padding:1rem;text-align:center}
    .lwfb-primary-btn{background:var(--primary);color:#fff;border:none;border-radius:8px;padding:0.75rem 1.5rem;font-weight:600;cursor:pointer;font-size:1rem;transition:all 0.2s}
    .lwfb-primary-btn:hover{background:var(--primary-dark)}
    .lwfb-secondary-btn{background:#f1f5f9;color:var(--text);border:none;border-radius:8px;padding:0.75rem 1.5rem;font-weight:600;cursor:pointer;font-size:1rem;transition:all 0.2s}
    .lwfb-secondary-btn:hover{background:#e2e8f0}
    /* Template Selector Popup Styles */
    .lw-selector-search-wrapper{margin-bottom:1.5rem}
    .lw-selector-search{width:100%;padding:1rem 1.25rem;border:2px solid var(--border);border-radius:12px;font-size:1.125rem;transition:all 0.2s;background:#fff}
    .lw-selector-search:focus{outline:none;border-color:var(--primary);box-shadow:0 0 0 4px rgba(220,38,38,0.1)}
    .lw-selector-search::placeholder{color:#9ca3af}
    .lw-selector-list{display:flex;flex-direction:column;gap:0.75rem;max-height:400px;overflow-y:auto;padding-right:0.5rem}
    .lw-selector-template-card{display:flex;align-items:center;gap:1rem;padding:1.25rem;background:#fff;border:2px solid var(--border);border-radius:12px;cursor:pointer;transition:all 0.2s}
    .lw-selector-template-card:hover{border-color:var(--primary);background:#fef2f2;transform:translateY(-2px);box-shadow:0 4px 12px rgba(220,38,38,0.15)}
    .lw-selector-template-icon{font-size:2rem;width:3rem;height:3rem;display:grid;place-items:center;background:#f8fafc;border-radius:10px;flex-shrink:0}
    .lw-selector-template-info{flex:1;display:flex;flex-direction:column;gap:0.25rem}
    .lw-selector-template-info strong{font-size:1.125rem;color:var(--text)}
    .lw-selector-template-info span{font-size:0.9375rem;color:var(--muted)}
    .lw-selector-template-arrow{font-size:1.5rem;color:var(--muted);transition:all 0.2s}
    .lw-selector-template-card:hover .lw-selector-template-arrow{color:var(--primary);transform:translateX(4px)}
    .lw-selector-empty{color:var(--muted);font-style:italic;padding:2rem;text-align:center;background:#f8fafc;border-radius:12px;border:2px dashed var(--border)}
    .lw-selector-no-results{color:var(--muted);padding:2rem;text-align:center;font-size:1rem}
    /* Entry Form Styles */
    .lw-entry-form{width:100%;padding:1.5rem 0;background:transparent;border-radius:0;box-shadow:none}
    .lw-entry-section{margin-bottom:2rem;padding-bottom:2rem;border-bottom:1px solid var(--border)}
    .lw-entry-section:last-of-type{border-bottom:none}
    .lw-entry-section-title{font-size:1.125rem;font-weight:600;color:var(--text);margin-bottom:1.25rem;display:flex;align-items:center;gap:0.5rem}
    .lw-entry-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1.25rem}
    .lw-entry-field{display:flex;flex-direction:column;gap:0.5rem}
    .lw-entry-label{font-size:0.9375rem;font-weight:500;color:var(--text)}
    .lw-entry-required{color:var(--primary)}
    .lw-entry-input,.lw-entry-select,.lw-entry-textarea{width:100%;padding:0.875rem 1rem;border:2px solid var(--border);border-radius:8px;font-size:1rem;transition:all 0.2s;background:#fff}
    .lw-entry-input:focus,.lw-entry-select:focus,.lw-entry-textarea:focus{outline:none;border-color:var(--primary);box-shadow:0 0 0 2px rgba(255,0,90,0.2)}
    .lw-entry-textarea{resize:vertical;min-height:100px}
    .lw-entry-question{margin-bottom:1.5rem;padding:1.25rem;background:var(--panel);border-radius:8px;border:1px solid var(--border);border-left:3px solid var(--primary)}
    .lw-entry-question-label{font-weight:600;color:var(--text);margin-bottom:0.75rem;display:block}
    .lw-entry-radio-group,.lw-entry-checkbox-group{display:flex;flex-wrap:wrap;gap:1rem}
    .lw-entry-radio,.lw-entry-checkbox{display:flex;align-items:center;gap:0.5rem;cursor:pointer;padding:0.5rem 1rem;background:#fff;border:2px solid var(--border);border-radius:6px;transition:all 0.2s}
    .lw-entry-radio:hover,.lw-entry-checkbox:hover{border-color:var(--primary)}
    .lw-entry-radio input,.lw-entry-checkbox input{cursor:pointer}
    .lw-entry-rag-group,.lw-entry-ggaw-group{display:flex;flex-wrap:wrap;gap:0.75rem}
    .lw-entry-rag,.lw-entry-ggaw{padding:0.625rem 1.25rem;border-radius:6px;font-weight:500;cursor:pointer;transition:all 0.2s;border:2px solid transparent}
    .lw-entry-rag.green{background:#dcfce7;color:#166534;border-color:#166534}
    .lw-entry-rag.amber{background:#fef3c7;color:#92400e;border-color:#92400e}
    .lw-entry-rag.red{background:#fee2e2;color:#991b1b;border-color:#991b1b}
    .lw-entry-ggaw.gold{background:#fef9c3;color:#854d0e;border-color:#854d0e}
    .lw-entry-ggaw.green{background:#dcfce7;color:#166534;border-color:#166534}
    .lw-entry-ggaw.amber{background:#fef3c7;color:#92400e;border-color:#92400e}
    .lw-entry-ggaw.white{background:#f1f5f9;color:#475569;border-color:#475569}
    .lw-entry-rag input,.lw-entry-ggaw input{display:none}
    .lw-entry-rag:has(input:checked),.lw-entry-ggaw:has(input:checked){transform:scale(1.05);box-shadow:0 4px 12px rgba(0,0,0,0.15)}
    .lw-entry-rating{display:flex;gap:0.5rem;flex-wrap:wrap}
    .lw-entry-rating-star{padding:0.5rem 1rem;background:#f1f5f9;border:2px solid var(--border);border-radius:6px;cursor:pointer;transition:all 0.2s}
    .lw-entry-rating-star:has(input:checked){background:var(--primary);color:#fff;border-color:var(--primary)}
    .lw-entry-rating-star input{display:none}
    .lw-entry-rank-group{display:flex;flex-direction:column;gap:0.75rem}
    .lw-entry-rank-item{display:flex;align-items:center;gap:1rem;padding:0.75rem;background:#fff;border:1px solid var(--border);border-radius:6px}
    .lw-entry-rank-label{flex:1;font-weight:500}
    .lw-entry-rank-input{width:80px;padding:0.5rem;border:2px solid var(--border);border-radius:6px;text-align:center}
    .lw-entry-comments-section{background:linear-gradient(135deg,#fef3c7 0%,#fff 100%);border-left:4px solid #d97706}
    .lw-entry-hint{color:var(--muted);font-size:0.875rem;margin-bottom:0.75rem}
    .lw-entry-empty{color:var(--muted);font-style:italic;padding:2rem;text-align:center;background:#f8fafc;border-radius:8px}
    .lw-entry-actions{display:flex;gap:1rem;justify-content:flex-end;margin-top:2rem;padding-top:1.5rem;border-top:2px solid var(--border)}
    .lw-entry-actions .secondary-action{background:var(--muted);color:#fff}
    .lw-status-badge{display:inline-flex;align-items:center;padding:0.5rem 1rem;border-radius:999px;font-size:0.875rem;font-weight:500}
    .lw-status-badge.pending{background:#fef3c7;color:#92400e}
    .lw-status-badge.iqa_completed{background:#dcfce7;color:#166534}
    .lw-status-badge.assessor_responded{background:#dbeafe;color:#1e40af}
    .lw-status-badge.complete{background:#f3f4f6;color:#6b7280}
    .lw-comments-list{display:flex;flex-direction:column;gap:1rem}
    .lw-comment-item{background:#fff;border:1px solid var(--border);border-radius:8px;padding:1rem}
    .lw-comment-header{display:flex;align-items:center;gap:0.75rem;margin-bottom:0.5rem;flex-wrap:wrap}
    .lw-comment-author{font-weight:600;color:var(--text)}
    .lw-comment-role{font-size:0.75rem;padding:0.25rem 0.5rem;border-radius:4px;background:var(--primary);color:#fff;text-transform:uppercase}
    .lw-comment-date{font-size:0.875rem;color:var(--muted);margin-left:auto}
    .lw-comment-text{color:var(--text);line-height:1.5}
    .lw-entry-question .disabled{opacity:0.6;cursor:not-allowed}
    .lw-entry-delete-btn{background:none;border:1px solid var(--border);border-radius:8px;padding:0.5rem;cursor:pointer;color:var(--muted);display:inline-flex;align-items:center;justify-content:center;transition:background .15s,color .15s,border-color .15s;flex-shrink:0}
    .lw-entry-delete-btn:hover{background:#fff0f3;color:#ff005a;border-color:#ff005a}
    @media (max-width:768px){.lwfb-header-grid{grid-template-columns:1fr}.lwfb-type-picker .picker-grid{grid-template-columns:repeat(2,1fr)}.lwfb-popup-overlay{padding:1rem}.lwfb-popup-container{max-height:calc(100vh - 2rem)}.lw-entry-grid{grid-template-columns:1fr}}
  </style></head><body>${body}</body></html>`;
}

function renderSidebar(identity: Identity, active: string) {
  const user = identity.user!;
  return `<aside class="sidebar">
    <div class="sidebar-brand"><div class="brand-mark"><img src="/favicon.svg" width="36" height="36" style="object-fit:contain;display:block"></div><div><strong>ESOLQA</strong><span>${escapeHtml(user.role)}</span></div></div>
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

function escapeHtml(value: string | null | undefined) { if (value == null) return ""; return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;"); }
