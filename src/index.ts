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
  | "file_upload";

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
    if (url.pathname === "/forms/new") return renderCreateTemplatePage(identity);
    if (url.pathname.startsWith("/forms/builder/")) return renderTemplateBuilderPage(env, identity, url.pathname.split("/")[3]);
    if (url.pathname === "/entries/new") return renderNewEntryPage(env, identity);
    if (url.pathname.startsWith("/entries/")) return renderEntryPage(env, identity, url.pathname.split("/")[2]);

    if (url.pathname === "/api/me") return json(identity);
    if (url.pathname === "/api/users" && request.method === "POST") return createUser(request, env, identity);
    if (url.pathname.startsWith("/api/users/") && request.method === "POST") return deleteUser(request, env, identity, url.pathname.split("/")[3]);
    if (url.pathname === "/api/templates" && request.method === "POST") return createTemplate(request, env, identity);
    if (url.pathname === "/api/templates" && request.method === "GET") return listTemplatesJson(env, identity);
    if (url.pathname.startsWith("/api/templates/") && request.method === "GET" && url.pathname.endsWith("/questions")) return getTemplateQuestions(env, identity, url.pathname.split("/")[3]);
    if (url.pathname.startsWith("/api/templates/") && request.method === "POST" && url.pathname.endsWith("/update")) return updateTemplate(request, env, identity, url.pathname.split("/")[3]);
    if (url.pathname.startsWith("/api/templates/") && request.method === "POST" && url.pathname.endsWith("/delete")) return deleteTemplate(request, env, identity, url.pathname.split("/")[3]);
    if (url.pathname.startsWith("/api/templates/") && request.method === "POST" && url.pathname.endsWith("/questions")) return addTemplateQuestion(request, env, identity, url.pathname.split("/")[3]);
    if (url.pathname.startsWith("/api/templates/") && request.method === "DELETE" && url.pathname.includes("/questions/")) return deleteTemplateQuestion(env, identity, url.pathname.split("/")[3], url.pathname.split("/")[5]);
    if (url.pathname.startsWith("/api/templates/") && request.method === "POST" && url.pathname.endsWith("/categories")) return addCommentCategory(request, env, identity, url.pathname.split("/")[3]);
    if (url.pathname === "/api/entries" && request.method === "POST") return createEntry(request, env, identity);
    if (url.pathname.startsWith("/api/entries/") && url.pathname.endsWith("/header") && request.method === "POST") return updateEntryHeader(request, env, identity, url.pathname.split("/")[3]);
    if (url.pathname.startsWith("/api/entries/") && url.pathname.endsWith("/stage") && request.method === "POST") return saveEntryStage(request, env, identity, url.pathname.split("/")[3]);
    if (url.pathname.startsWith("/api/entries/") && url.pathname.endsWith("/complete") && request.method === "POST") return markEntryComplete(env, identity, url.pathname.split("/")[3]);
    if (url.pathname.startsWith("/api/entries/") && url.pathname.endsWith("/agree") && request.method === "POST") return agreeWithAssessor(env, identity, url.pathname.split("/")[3]);
    if (url.pathname.startsWith("/api/entries/") && url.pathname.endsWith("/comments") && request.method === "POST") return addComment(request, env, identity, url.pathname.split("/")[3]);
    if (url.pathname.startsWith("/api/entries/") && url.pathname.endsWith("/attachments") && request.method === "POST") return uploadAttachment(request, env, identity, url.pathname.split("/")[3]);

    // Learning Walks pages
    if (url.pathname === "/learning-walks") return renderLWDashboard(request, env, identity);
    if (url.pathname === "/learning-walks/templates/new") return renderCreateLWTemplatePage(identity);
    if (url.pathname.startsWith("/learning-walks/templates/") && url.pathname.endsWith("/build")) return renderLWBuilderPage(env, identity, url.pathname.split("/")[3]);
    if (url.pathname === "/learning-walks/entries/new") return renderNewLWEntryPage(env, identity);
    if (url.pathname.startsWith("/learning-walks/entries/")) return renderLWEntryPage(env, identity, url.pathname.split("/")[3]);

    // Learning Walks APIs
    if (url.pathname === "/api/lw/templates" && request.method === "POST") return createLWTemplate(request, env, identity);
    if (url.pathname.startsWith("/api/lw/templates/") && url.pathname.endsWith("/update") && request.method === "POST") return updateLWTemplate(request, env, identity, url.pathname.split("/")[4]);
    if (url.pathname.startsWith("/api/lw/templates/") && url.pathname.endsWith("/delete") && request.method === "POST") return deleteLWTemplate(request, env, identity, url.pathname.split("/")[4]);
    if (url.pathname.startsWith("/api/lw/templates/") && url.pathname.endsWith("/questions") && request.method === "POST") return addLWTemplateQuestion(request, env, identity, url.pathname.split("/")[4]);
    if (url.pathname.startsWith("/api/lw/templates/") && url.pathname.includes("/questions/") && request.method === "DELETE") return deleteLWTemplateQuestion(env, identity, url.pathname.split("/")[4], url.pathname.split("/")[6]);
    if (url.pathname === "/api/lw/entries" && request.method === "POST") return createLWEntry(request, env, identity);
    if (url.pathname.startsWith("/api/lw/entries/") && url.pathname.endsWith("/answers") && request.method === "POST") return saveLWAnswers(request, env, identity, url.pathname.split("/")[4]);
    if (url.pathname.startsWith("/api/lw/entries/") && url.pathname.endsWith("/complete-iqa") && request.method === "POST") return completeLWAsIqa(request, env, identity, url.pathname.split("/")[4]);
    if (url.pathname.startsWith("/api/lw/entries/") && url.pathname.endsWith("/complete-assessor") && request.method === "POST") return completeLWAsAssessor(request, env, identity, url.pathname.split("/")[4]);
    if (url.pathname.startsWith("/api/lw/entries/") && url.pathname.endsWith("/comments") && request.method === "POST") return addLWComment(request, env, identity, url.pathname.split("/")[4]);
    if (url.pathname.startsWith("/api/lw/entries/") && url.pathname.endsWith("/close") && request.method === "POST") return closeLWEntry(request, env, identity, url.pathname.split("/")[4]);
    if (url.pathname.startsWith("/api/lw/notifications/") && url.pathname.endsWith("/read") && request.method === "POST") return markLWNotificationRead(env, identity, url.pathname.split("/")[4]);

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

async function renderTemplateBuilderPage(env: Env, identity: Identity, templateId?: string): Promise<Response> {
  if (!canCreateForms(identity.user!)) return htmlResponse(renderForbiddenPage(identity), 403);
  if (!templateId) return htmlResponse(renderNotFoundPage(), 404);

  const template = await getTemplateWithQuestions(env, templateId);
  if (!template) return htmlResponse(renderNotFoundPage(), 404);

  return htmlResponse(renderTemplateBuilder(identity, template));
}

async function renderNewEntryPage(env: Env, identity: Identity): Promise<Response> {
  if (!canAssess(identity.user!)) return htmlResponse(renderForbiddenPage(identity), 403);
  const templates = await listTemplates(env, "");
  const iqas = await env.esol_marking_db.prepare("SELECT id, email, role, stage FROM users WHERE role IN ('iqa','admin','superuser') ORDER BY email ASC").all<UserRecord>();
  const eqas = await env.esol_marking_db.prepare("SELECT id, email, role, stage FROM users WHERE role IN ('eqa','admin','superuser') ORDER BY email ASC").all<UserRecord>();

  return htmlResponse(renderEntryStartForm(identity, templates, iqas.results, eqas.results));
}

async function renderEntryPage(env: Env, identity: Identity, id?: string): Promise<Response> {
  if (!id) return htmlResponse(renderNotFoundPage(), 404);
  const entry = await getEnhancedEntry(env, identity.user!, id);
  if (!entry) return htmlResponse(renderNotFoundPage(), 404);

  const templateWithQuestions = await getTemplateWithQuestions(env, entry.template_id);
  if (!templateWithQuestions) return htmlResponse(renderNotFoundPage(), 404);

  const stageEntries = await env.esol_marking_db.prepare(
    "SELECT fse.stage, fse.data, fse.updated_at, fse.agreed_with_previous, fse.marked_complete_at, users.email FROM form_stage_entries fse LEFT JOIN users ON users.id = fse.updated_by WHERE fse.form_entry_id = ?"
  ).bind(id).all<EnhancedStageEntryRecord>();

  const comments = await env.esol_marking_db.prepare(
    `SELECT fc.id, fc.comment, fc.created_at, users.email, tcc.name as category_name, fc.is_pinned
     FROM form_comments fc
     LEFT JOIN users ON users.id = fc.created_by
     LEFT JOIN template_comment_categories tcc ON tcc.id = fc.category_id
     WHERE fc.form_entry_id = ?
     ORDER BY fc.is_pinned DESC, fc.created_at DESC`
  ).bind(id).all<CommentWithCategory>();

  const attachments = await env.esol_marking_db.prepare(
    "SELECT id, file_name, file_size, content_type, description, created_at FROM form_attachments WHERE form_entry_id = ? ORDER BY created_at DESC"
  ).bind(id).all<{ id: string; file_name: string; file_size: number; content_type: string; description: string | null; created_at: string }>();

  return htmlResponse(renderModularEntry(identity, entry, templateWithQuestions, stageEntries.results, comments.results, attachments.results));
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

async function getEnhancedEntry(env: Env, user: UserRecord, id: string): Promise<EnhancedEntryRecord | null> {
  const entryQuery = `SELECT fe.id, fe.template_id, ft.title AS template_title, fe.status, fe.course_code, fe.qualification, fe.teacher, fe.created_at, fe.is_finalized,
    assessor.email AS assessor_email, iqa.email AS iqa_email, eqa.email AS eqa_email
    FROM form_entries fe
    JOIN form_templates ft ON ft.id = fe.template_id
    LEFT JOIN users assessor ON assessor.id = fe.assessor_id
    LEFT JOIN users iqa ON iqa.id = fe.iqa_id
    LEFT JOIN users eqa ON eqa.id = fe.eqa_id
    WHERE fe.id = ? AND (? IN ('superuser','admin') OR fe.assessor_id = ? OR fe.iqa_id = ? OR fe.eqa_id = ?)`;
  const entry = await env.esol_marking_db.prepare(entryQuery).bind(id, user.role, user.id, user.id, user.id).first<EnhancedEntryRecord>();
  if (!entry) return null;

  const header = await env.esol_marking_db.prepare(
    `SELECT feh.id, feh.form_entry_id, feh.course_id, feh.qualification_aim, feh.course_name,
      feh.assessor_id, feh.assessor_date, feh.iqa_id, feh.iqa_date, feh.eqa_id, feh.eqa_name, feh.eqa_date
     FROM form_entry_headers feh WHERE feh.form_entry_id = ?`
  ).bind(id).first<EntryHeader>();

  entry.header = header || null;
  return entry;
}

async function getTemplateWithQuestions(env: Env, templateId: string): Promise<TemplateWithQuestions | null> {
  const template = await env.esol_marking_db.prepare(
    "SELECT id, title, description, structure, is_active, created_at FROM form_templates WHERE id = ? AND is_active = 1"
  ).bind(templateId).first<TemplateRecord>();
  if (!template) return null;

  const questions = await env.esol_marking_db.prepare(
    "SELECT id, template_id, question_text, question_type, options, has_text_entry, text_entry_label, is_required, sort_order, visible_to_assessor, visible_to_iqa, visible_to_eqa FROM template_questions WHERE template_id = ? ORDER BY sort_order"
  ).bind(templateId).all<TemplateQuestion>();

  const categories = await env.esol_marking_db.prepare(
    "SELECT id, template_id, name, description, sort_order FROM template_comment_categories WHERE template_id = ? ORDER BY sort_order"
  ).bind(templateId).all<CommentCategory>();

  return {
    ...template,
    questions: questions.results,
    commentCategories: categories.results,
  };
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

  if (!title) return json({ error: "Title is required" }, 400);

  const templateId = crypto.randomUUID();
  await env.esol_marking_db.prepare("INSERT INTO form_templates (id, title, description, structure, created_by) VALUES (?, ?, ?, ?, ?)").bind(templateId, title, description, JSON.stringify({ version: 2, modular: true }), identity.user!.id).run();

  // Redirect to template builder to add questions
  return Response.redirect(new URL(`/forms/builder/${templateId}`, request.url).toString(), 303);
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
  const categoryId = String(body.get("category_id") ?? "").trim() || null;
  if (comment) {
    await env.esol_marking_db.prepare(
      "INSERT INTO form_comments (id, form_entry_id, comment, category_id, created_by) VALUES (?, ?, ?, ?, ?)"
    ).bind(crypto.randomUUID(), id, comment, categoryId, identity.user!.id).run();
  }
  return Response.redirect(new URL(`/entries/${id}`, request.url).toString(), 303);
}

async function listTemplatesJson(env: Env, identity: Identity): Promise<Response> {
  if (!identity.user) return json({ error: "Forbidden" }, 403);
  const templates = await env.esol_marking_db.prepare(
    "SELECT id, title, description, is_active, created_at FROM form_templates WHERE is_active = 1 ORDER BY created_at DESC"
  ).all<TemplateRecord>();
  return json(templates.results);
}

async function getTemplateQuestions(env: Env, identity: Identity, templateId?: string): Promise<Response> {
  if (!templateId || !identity.user) return json({ error: "Invalid request" }, 400);
  const questions = await env.esol_marking_db.prepare(
    "SELECT id, template_id, question_text, question_type, options, has_text_entry, text_entry_label, is_required, sort_order, visible_to_assessor, visible_to_iqa, visible_to_eqa FROM template_questions WHERE template_id = ? ORDER BY sort_order"
  ).bind(templateId).all<TemplateQuestion>();
  const categories = await env.esol_marking_db.prepare(
    "SELECT id, template_id, name, description, sort_order FROM template_comment_categories WHERE template_id = ? ORDER BY sort_order"
  ).bind(templateId).all<CommentCategory>();
  return json({ questions: questions.results, commentCategories: categories.results });
}

async function addTemplateQuestion(request: Request, env: Env, identity: Identity, templateId?: string): Promise<Response> {
  if (!canCreateForms(identity.user!)) return json({ error: "Forbidden" }, 403);
  if (!templateId) return json({ error: "Invalid template" }, 400);

  const body = await request.formData();
  const questionText = String(body.get("question_text") ?? "").trim();
  const questionType = String(body.get("question_type") ?? "text") as QuestionType;
  const optionsJson = String(body.get("options") ?? "[]");
  const hasTextEntry = body.get("has_text_entry") === "1" ? 1 : 0;
  const textEntryLabel = String(body.get("text_entry_label") ?? "").trim() || null;
  const isRequired = body.get("is_required") === "1" ? 1 : 0;
  const sortOrder = parseInt(String(body.get("sort_order") ?? "0"), 10);
  const visibleToAssessor = body.get("visible_to_assessor") !== "0" ? 1 : 0;
  const visibleToIqa = body.get("visible_to_iqa") !== "0" ? 1 : 0;
  const visibleToEqa = body.get("visible_to_eqa") !== "0" ? 1 : 0;

  if (!questionText) return json({ error: "Question text is required" }, 400);

  const validTypes = ["single_choice", "multiple_choice", "dropdown", "rag", "text", "textarea", "date", "currency", "ranking", "likert", "yes_no", "file_upload", "rating"];
  if (!validTypes.includes(questionType)) return json({ error: "Invalid question type: " + questionType }, 400);

  // options field arrives as newline-separated plain text from textarea; convert to JSON array
  const rawOptions = String(body.get("options") ?? "").trim();
  const parsedOptions = rawOptions
    ? JSON.stringify(rawOptions.split("\n").filter(Boolean).map((o, i) => ({ id: `opt_${i}`, label: o.trim(), value: o.trim() })))
    : null;

  await env.esol_marking_db.prepare(
    "INSERT INTO template_questions (id, template_id, question_text, question_type, options, has_text_entry, text_entry_label, is_required, sort_order, visible_to_assessor, visible_to_iqa, visible_to_eqa) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  ).bind(crypto.randomUUID(), templateId, questionText, questionType, parsedOptions, hasTextEntry, textEntryLabel, isRequired, sortOrder, visibleToAssessor, visibleToIqa, visibleToEqa).run();

  return Response.redirect(new URL(`/forms/builder/${templateId}`, request.url).toString(), 303);
}

async function deleteTemplateQuestion(env: Env, identity: Identity, templateId?: string, questionId?: string): Promise<Response> {
  if (!canCreateForms(identity.user!)) return json({ error: "Forbidden" }, 403);
  if (!templateId || !questionId) return json({ error: "Invalid request" }, 400);
  await env.esol_marking_db.prepare("DELETE FROM template_questions WHERE id = ? AND template_id = ?").bind(questionId, templateId).run();
  return json({ success: true });
}

async function addCommentCategory(request: Request, env: Env, identity: Identity, templateId?: string): Promise<Response> {
  if (!canCreateForms(identity.user!)) return json({ error: "Forbidden" }, 403);
  if (!templateId) return json({ error: "Invalid template" }, 400);

  const body = await request.formData();
  const name = String(body.get("name") ?? "").trim();
  const description = String(body.get("description") ?? "").trim() || null;
  const sortOrder = parseInt(String(body.get("sort_order") ?? "0"), 10);

  if (!name) return json({ error: "Category name is required" }, 400);

  await env.esol_marking_db.prepare(
    "INSERT INTO template_comment_categories (id, template_id, name, description, sort_order) VALUES (?, ?, ?, ?, ?)"
  ).bind(crypto.randomUUID(), templateId, name, description, sortOrder).run();

  return Response.redirect(new URL(`/forms/builder/${templateId}`, request.url).toString(), 303);
}

async function updateTemplate(request: Request, env: Env, identity: Identity, templateId?: string): Promise<Response> {
  if (!canCreateForms(identity.user!)) return json({ error: "Forbidden" }, 403);
  if (!templateId) return json({ error: "Invalid template" }, 400);

  const body = await request.formData();
  const title = String(body.get("title") ?? "").trim();
  const description = String(body.get("description") ?? "").trim() || null;

  if (!title) return json({ error: "Title is required" }, 400);

  await env.esol_marking_db.prepare(
    "UPDATE form_templates SET title = ?, description = ? WHERE id = ?"
  ).bind(title, description, templateId).run();

  return Response.redirect(new URL(`/forms/builder/${templateId}`, request.url).toString(), 303);
}

async function deleteTemplate(request: Request, env: Env, identity: Identity, templateId?: string): Promise<Response> {
  if (!isSuperuser(identity.user!) && identity.user!.role !== "admin") return json({ error: "Forbidden" }, 403);
  if (!templateId) return json({ error: "Invalid template" }, 400);

  const body = await request.formData();
  const confirm = String(body.get("confirm") ?? "").trim();

  if (confirm !== "DELETE") {
    return json({ error: "You must type DELETE to confirm" }, 400);
  }

  // Delete related records first (cascade)
  await env.esol_marking_db.prepare("DELETE FROM template_questions WHERE template_id = ?").bind(templateId).run();
  await env.esol_marking_db.prepare("DELETE FROM template_comment_categories WHERE template_id = ?").bind(templateId).run();
  await env.esol_marking_db.prepare("DELETE FROM form_templates WHERE id = ?").bind(templateId).run();

  return Response.redirect(new URL("/dashboard", request.url).toString(), 303);
}

async function updateEntryHeader(request: Request, env: Env, identity: Identity, entryId?: string): Promise<Response> {
  if (!entryId) return json({ error: "Missing entry" }, 400);
  const entry = await getVisibleEntry(env, identity.user!, entryId);
  if (!entry) return json({ error: "Not found" }, 404);

  // Only assessor can set header, and only once
  if (entry.status !== "assessment" || identity.user!.role !== "assessor") {
    return json({ error: "Only assessor can set header during assessment stage" }, 403);
  }

  const body = await request.formData();
  const courseId = String(body.get("course_id") ?? "").trim();
  const qualificationAim = String(body.get("qualification_aim") ?? "").trim();
  const courseName = String(body.get("course_name") ?? "").trim();
  const assessorId = identity.user!.id;
  const iqaId = String(body.get("iqa_id") ?? "").trim() || null;

  if (!courseId || !qualificationAim || !courseName) {
    return json({ error: "Course ID, qualification aim, and course name are required" }, 400);
  }

  // Check if header already exists
  const existing = await env.esol_marking_db.prepare(
    "SELECT id FROM form_entry_headers WHERE form_entry_id = ?"
  ).bind(entryId).first<{ id: string }>();

  if (existing) {
    return json({ error: "Header already set and cannot be modified" }, 400);
  }

  await env.esol_marking_db.prepare(
    "INSERT INTO form_entry_headers (id, form_entry_id, course_id, qualification_aim, course_name, assessor_id, assessor_date, iqa_id) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)"
  ).bind(crypto.randomUUID(), entryId, courseId, qualificationAim, courseName, assessorId, iqaId).run();

  return json({ success: true });
}

async function agreeWithAssessor(env: Env, identity: Identity, entryId?: string): Promise<Response> {
  if (!entryId) return json({ error: "Missing entry" }, 400);
  const entry = await getVisibleEntry(env, identity.user!, entryId);
  if (!entry) return json({ error: "Not found" }, 404);

  const userStage = stageForUser(identity.user!);
  if (userStage === "assess") return json({ error: "Assessor cannot agree with themselves" }, 400);

  // Get assessor's data
  const assessorEntry = await env.esol_marking_db.prepare(
    "SELECT data FROM form_stage_entries WHERE form_entry_id = ? AND stage = 'assess'"
  ).bind(entryId).first<{ data: string }>();

  if (!assessorEntry?.data) return json({ error: "No assessor data to agree with" }, 400);

  // Copy assessor data to current user's stage with agreement flag
  await env.esol_marking_db.prepare(
    "INSERT INTO form_stage_entries (id, form_entry_id, stage, data, updated_by, agreed_with_previous) VALUES (?, ?, ?, ?, ?, 1) ON CONFLICT(form_entry_id, stage) DO UPDATE SET data = excluded.data, updated_at = CURRENT_TIMESTAMP, updated_by = excluded.updated_by, agreed_with_previous = 1"
  ).bind(crypto.randomUUID(), entryId, userStage, assessorEntry.data, identity.user!.id).run();

  return Response.redirect(new URL(`/entries/${entryId}`, "https://placeholder").toString(), 303);
}

async function uploadAttachment(request: Request, env: Env, identity: Identity, entryId?: string): Promise<Response> {
  if (!entryId) return json({ error: "Missing entry" }, 400);
  const entry = await getVisibleEntry(env, identity.user!, entryId);
  if (!entry) return json({ error: "Not found" }, 404);

  // Check if R2 bucket binding exists (env.R2_BUCKET)
  const r2Bucket = (env as unknown as { R2_BUCKET?: { put: (key: string, data: ArrayBuffer, opts: { httpMetadata: { contentType?: string } }) => Promise<void> } }).R2_BUCKET;
  if (!r2Bucket) return json({ error: "File storage not configured" }, 500);

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const description = String(formData.get("description") ?? "").trim();

  if (!file) return json({ error: "No file uploaded" }, 400);

  const fileKey = `attachments/${entryId}/${crypto.randomUUID()}_${file.name}`;
  const arrayBuffer = await file.arrayBuffer();

  await r2Bucket.put(fileKey, arrayBuffer, {
    httpMetadata: { contentType: file.type },
  });

  await env.esol_marking_db.prepare(
    "INSERT INTO form_attachments (id, form_entry_id, uploaded_by, file_name, file_size, content_type, r2_key, r2_bucket, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
  ).bind(crypto.randomUUID(), entryId, identity.user!.id, file.name, file.size, file.type, fileKey, "esolqa-attachments", description).run();

  return json({ success: true, fileKey });
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

function renderTemplateForm(identity: Identity) {
  return pageShell("Create form", `
    <main class="dashboard-shell">
      ${renderSidebar(identity, "create")}
      <section class="content">
        ${renderTopbar(identity, "Create modular form")}
        <section class="panel narrow-panel">
          <form method="POST" action="/api/templates" class="stack-form" id="template-form">
            <label>Title<input name="title" required placeholder="ESOL Writing IQA — Entry 1"></label>
            <label>Description<textarea name="description" rows="3" placeholder="What this form is used for"></textarea></label>
            <button type="submit">Create form template</button>
          </form>
          <p class="hint">After creating the template, you'll be able to add questions and comment categories.</p>
        </section>
      </section>
    </main>
  `);
}

function renderTemplateBuilder(identity: Identity, template: TemplateWithQuestions) {
  // MS Forms-style question type options
  const questionTypes = [
    { type: "single_choice", icon: "⭘", label: "Single Choice", desc: "Select one option" },
    { type: "multiple_choice", icon: "☑", label: "Multiple Choice", desc: "Select multiple" },
    { type: "dropdown", icon: "▼", label: "Dropdown", desc: "Compact list selection" },
    { type: "rag", icon: "🟢", label: "RAG Rating", desc: "Green/Amber/Red status" },
    { type: "text", icon: "T", label: "Text", desc: "Short or long answer" },
    { type: "rating", icon: "★", label: "Rating", desc: "Numeric scale" },
    { type: "date", icon: "📅", label: "Date", desc: "Date picker" },
    { type: "ranking", icon: "⇅", label: "Ranking", desc: "Order items" },
    { type: "likert", icon: "◫", label: "Likert", desc: "Agree/Disagree scale" },
    { type: "yes_no", icon: "✓", label: "Yes/No", desc: "Binary choice" },
    { type: "file_upload", icon: "📎", label: "File Upload", desc: "Attach files" },
  ];

  const headerFields = [
    { key: "course_id", label: "Course ID", placeholder: "e.g., ESOL-2024-001", required: true },
    { key: "qualification_aim", label: "Qualification Aim (UK Code)", placeholder: "e.g., 603/4999/5", required: true },
    { key: "course_name", label: "Course Name", placeholder: "e.g., ESOL Entry Level 1", required: true },
    { key: "student_nickname", label: "Student Nickname", placeholder: "Anonymous identifier", required: false },
  ];

  return pageShell(`Edit: ${template.title}`, `
    <main class="dashboard-shell">
      ${renderSidebar(identity, "create")}
      <section class="content form-builder-content">
        ${renderTopbar(identity, "Form Builder")}
        
        <div class="form-builder-container">
          <!-- Form Header Section (MS Forms style) -->
          <div class="form-header-card">
            <form method="POST" action="/api/templates/${template.id}/update" class="header-form">
              <input type="text" name="title" class="form-title-input" value="${escapeHtml(template.title)}" placeholder="Untitled form">
              <textarea name="description" class="form-desc-input" rows="2" placeholder="Form description">${escapeHtml(template.description || "")}</textarea>
              <button type="submit" class="secondary-btn" style="margin-top:0.75rem">💾 Save title &amp; description</button>
            </form>
          </div>

          <!-- Fixed Header Fields Section -->
          <div class="form-section-card">
            <h3 class="section-title">📋 Fixed Entry Fields</h3>
            <p class="section-hint">These fields are required for every form entry</p>
            <div class="header-fields-grid">
              ${headerFields.map(f => `
                <div class="header-field-preview ${f.required ? 'required' : ''}">
                  <label>${escapeHtml(f.label)} ${f.required ? '<span class="req">*</span>' : ''}</label>
                  <input type="text" disabled placeholder="${escapeHtml(f.placeholder)}" class="field-preview">
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Questions List -->
          <div id="questions-container">
            ${template.questions.map((q, idx) => renderQuestionCard(q, idx)).join('')}
          </div>

          <!-- Add Question Button (MS Forms style) -->
          <div class="add-question-wrapper">
            <button type="button" class="add-question-btn" onclick="document.getElementById('question-type-picker').classList.toggle('hidden')">
              <span class="plus-icon">+</span>
              <span>Add new</span>
            </button>
            
            <!-- Question Type Picker (MS Forms style grid) -->
            <div id="question-type-picker" class="question-type-picker hidden">
              <div class="picker-header">
                <span>Select question type</span>
                <button type="button" class="close-picker" onclick="document.getElementById('question-type-picker').classList.add('hidden')">✕</button>
              </div>
              <div class="picker-grid">
                ${questionTypes.map(t => `
                  <button type="button" class="type-option" onclick="selectQuestionType('${t.type}', '${template.id}')">
                    <span class="type-icon">${t.icon}</span>
                    <span class="type-label">${t.label}</span>
                    <span class="type-desc">${t.desc}</span>
                  </button>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Question Form (shown when type selected) -->
          <div id="question-form-container" class="form-section-card hidden">
            <form method="POST" action="/api/templates/${template.id}/questions" class="question-form" id="add-question-form">
              <input type="hidden" name="question_type" id="selected-question-type">
              
              <div class="form-group">
                <label>Question <span class="req">*</span></label>
                <input type="text" name="question_text" required placeholder="Enter your question" class="question-input">
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Type</label>
                  <select name="question_type_display" id="question-type-display" disabled class="type-select">
                    <option>Choice</option>
                  </select>
                </div>
                <div class="form-group checkbox-group">
                  <label class="checkbox-label">
                    <input type="checkbox" name="is_required" value="1" checked>
                    <span>Required</span>
                  </label>
                </div>
              </div>

              <!-- Options for choice-based types -->
              <div id="options-section" class="form-group hidden">
                <label>Options (one per line)</label>
                <textarea name="options" rows="4" placeholder="Option 1&#10;Option 2&#10;Option 3" class="options-textarea"></textarea>
                <p class="field-hint">For single/multiple choice and dropdown questions</p>
              </div>

              <!-- Text entry option -->
              <div class="form-group checkbox-group">
                <label class="checkbox-label">
                  <input type="checkbox" name="has_text_entry" value="1" id="has-text-entry">
                  <span>Add text field below question</span>
                </label>
              </div>

              <div id="text-entry-label-group" class="form-group hidden">
                <label>Text field label</label>
                <input type="text" name="text_entry_label" placeholder="e.g., Student sentence, Additional notes...">
              </div>

              <!-- Role Visibility -->
              <div class="form-group">
                <label>Visible to roles</label>
                <div class="role-checkboxes">
                  <label class="checkbox-label">
                    <input type="checkbox" name="visible_to_assessor" value="1" checked>
                    <span>Assessor</span>
                  </label>
                  <label class="checkbox-label">
                    <input type="checkbox" name="visible_to_iqa" value="1" checked>
                    <span>IQA</span>
                  </label>
                  <label class="checkbox-label">
                    <input type="checkbox" name="visible_to_eqa" value="1" checked>
                    <span>EQA</span>
                  </label>
                </div>
              </div>

              <input type="hidden" name="sort_order" value="${template.questions.length}">

              <div class="form-actions">
                <button type="submit" class="primary-btn">Add question</button>
                <button type="button" class="secondary-btn" onclick="cancelQuestionAdd()">Cancel</button>
              </div>
            </form>
          </div>

          <!-- Comment Categories Section -->
          <div class="form-section-card">
            <h3 class="section-title">💬 Comment Categories</h3>
            <p class="section-hint">Define categories for paper trail comments</p>
            
            <div class="categories-list">
              ${template.commentCategories.map((c, idx) => `
                <div class="category-card">
                  <div class="category-number">${idx + 1}</div>
                  <div class="category-content">
                    <strong>${escapeHtml(c.name)}</strong>
                    ${c.description ? `<span class="cat-desc">${escapeHtml(c.description)}</span>` : ''}
                  </div>
                </div>
              `).join('') || '<p class="empty-cats">No comment categories yet. Add some below.</p>'}
            </div>

            <form method="POST" action="/api/templates/${template.id}/categories" class="inline-category-form">
              <input type="text" name="name" required placeholder="Category name (e.g., IQA Actions)" class="cat-input">
              <input type="text" name="description" placeholder="Description (optional)" class="cat-input">
              <input type="hidden" name="sort_order" value="${template.commentCategories.length}">
              <button type="submit" class="small-btn">Add</button>
            </form>
          </div>

        </div>
      </section>
    </main>

    <script>
      // Show/hide text entry label based on checkbox
      document.getElementById('has-text-entry')?.addEventListener('change', function() {
        document.getElementById('text-entry-label-group').classList.toggle('hidden', !this.checked);
      });

      function selectQuestionType(type, templateId) {
        document.getElementById('question-type-picker').classList.add('hidden');
        document.getElementById('question-form-container').classList.remove('hidden');
        document.getElementById('selected-question-type').value = type;
        
        // Update display
        const typeNames = {
          'single_choice': 'Single Choice',
          'multiple_choice': 'Multiple Choice',
          'dropdown': 'Dropdown',
          'rag': 'RAG Rating (Green/Amber/Red)',
          'text': 'Text',
          'rating': 'Rating',
          'date': 'Date',
          'ranking': 'Ranking',
          'likert': 'Likert Scale',
          'yes_no': 'Yes/No',
          'file_upload': 'File Upload'
        };
        document.getElementById('question-type-display').innerHTML = '<option>' + (typeNames[type] || type) + '</option>';
        
        // Show options section for choice-based types
        const needsOptions = ['single_choice', 'multiple_choice', 'dropdown', 'yes_no'].includes(type);
        document.getElementById('options-section').classList.toggle('hidden', !needsOptions);
        
        // Pre-fill RAG options
        if (type === 'rag') {
          document.querySelector('[name="options"]').value = 'Green\nAmber\nRed';
        }
      }

      function cancelQuestionAdd() {
        document.getElementById('question-form-container').classList.add('hidden');
        document.getElementById('add-question-form').reset();
      }
    </script>
  `);
}

function renderQuestionCard(q: TemplateQuestion, idx: number): string {
  const typeLabels: Record<string, string> = {
    'single_choice': 'Single Choice',
    'multiple_choice': 'Multiple Choice',
    'dropdown': 'Dropdown',
    'text': 'Text',
    'textarea': 'Text Area',
    'date': 'Date',
    'currency': 'Currency',
    'ranking': 'Ranking',
    'likert': 'Likert',
    'yes_no': 'Yes/No',
    'file_upload': 'File Upload'
  };

  const visibility = [];
  if (q.visible_to_assessor) visibility.push('A');
  if (q.visible_to_iqa) visibility.push('I');
  if (q.visible_to_eqa) visibility.push('E');

  return `
    <div class="question-card">
      <div class="question-header">
        <span class="q-number">${idx + 1}</span>
        <span class="q-type-badge">${typeLabels[q.question_type] || q.question_type}</span>
        ${q.is_required ? '<span class="req-badge">Required</span>' : ''}
        <span class="visibility-badge">${visibility.join('/')}</span>
      </div>
      <div class="question-body">
        <p class="q-text">${escapeHtml(q.question_text)}</p>
        ${q.has_text_entry ? `<p class="text-entry-hint">↳ ${escapeHtml(q.text_entry_label || 'Text entry')}</p>` : ''}
      </div>
    </div>
  `;
}

function renderEntryStartForm(identity: Identity, templates: TemplateRecord[], iqas: UserRecord[], eqas: UserRecord[]) {
  return pageShell("New entry", `
    <main class="dashboard-shell">
      ${renderSidebar(identity, "assessment")}
      <section class="content">
        ${renderTopbar(identity, "New assessment entry")}
        <section class="panel narrow-panel modal-like">
          <form method="POST" action="/api/entries" class="stack-form">
            <h3>Select Template</h3>
            <label>Template<select name="template_id" required>${templates.map((template) => `<option value="${template.id}">${escapeHtml(template.title)}</option>`).join("")}</select></label>
            
            <h3>Entry Details (set by assessor)</h3>
            <label>Course ID<input name="course_code" required placeholder="e.g., ESOL-2024-001"></label>
            <label>Qualification aim (UK qualification code)<input name="qualification" required placeholder="e.g., 603/4999/5"></label>
            <label>Course name<input name="course_name" required placeholder="e.g., ESOL Entry Level 1"></label>
            <label>Teacher / assessor<input name="teacher" value="${escapeHtml(identity.name ?? identity.email)}"></label>
            <label>Student nickname<input name="student" placeholder="Optional anonymous nickname"></label>
            
            <h3>Quality Assurance Assignment</h3>
            <label>Allocated IQA<select name="iqa_id"><option value="">Choose later</option>${iqas.map((user) => `<option value="${user.id}">${escapeHtml(user.email)}</option>`).join("")}</select></label>
            <label>Allocated EQA (optional)<select name="eqa_id"><option value="">Choose later</option>${eqas.map((user) => `<option value="${user.id}">${escapeHtml(user.email)} (${user.role})</option>`).join("")}</select></label>
            
            <button type="submit">Create entry</button>
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
    <div class="sidebar-brand"><div class="brand-mark"><img src="/favicon.png" width="32" height="32" style="border-radius:0.5rem;object-fit:cover"></div><div><strong>ESOLQA</strong><span>${escapeHtml(user.role)}</span></div></div>
    <nav>
      ${navLink("/dashboard?section=assessment", "Assessment forms", active === "assessment")}
      ${navLink("/dashboard?section=iqa", "IQA forms", active === "iqa")}
      ${navLink("/dashboard?section=eqa", "EQA forms", active === "eqa")}
      ${navLink("/learning-walks", "Learning Walks", active === "learning-walks")}
      ${isSuperuser(user) ? navLink("/users", "Users", active === "users") : ""}
    </nav>
  </aside>`;
}

function renderTopbar(identity: Identity, title: string) {
  return `<header class="topbar"><div><p class="eyebrow">Dashboard</p><h1>${escapeHtml(title)}</h1></div><div class="profile-pill">${escapeHtml(identity.email)}</div><a class="logout-link" href="/logout">Sign out</a></header>`;
}

function renderTemplateCard(template: TemplateRecord, user?: UserRecord) {
  const canManage = user && (user.role === "admin" || user.role === "superuser");
  const actions = canManage ? `
    <div class="card-actions">
      <a href="/forms/builder/${template.id}" class="action-btn edit-btn" title="Edit template">✏️</a>
      <form method="POST" action="/api/templates/${template.id}/delete" class="delete-form" onsubmit="return confirmDelete(this)">
        <input type="hidden" name="confirm" value="DELETE">
        <button type="submit" class="action-btn delete-btn" title="Delete template">🗑️</button>
      </form>
    </div>
  ` : '';
  
  return `<article class="list-card template-card">
    <div class="card-content">
      <strong>${escapeHtml(template.title)}</strong>
      <span>${escapeHtml(template.description ?? "No description")}</span>
    </div>
    ${actions}
  </article>`;
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

// New modular entry renderer with 3-column layout
function renderModularEntry(
  identity: Identity,
  entry: EnhancedEntryRecord,
  template: TemplateWithQuestions,
  stageEntries: EnhancedStageEntryRecord[],
  comments: CommentWithCategory[],
  attachments: { id: string; file_name: string; file_size: number; content_type: string; description: string | null; created_at: string }[]
) {
  const userStage = stageForUser(identity.user!);
  const editable = Boolean(canEditStage(identity.user!, entry.status, userStage));
  const readonly = entry.status === "complete" || entry.is_finalized === 1;
  const header = entry.header;

  // Parse stage data
  const stageData: Record<Stage, StageData> = {
    assess: { answers: {}, textEntries: {}, agreed_with_previous: 0, marked_complete_at: null, marked_complete_by: null },
    iqa: { answers: {}, textEntries: {}, agreed_with_previous: 0, marked_complete_at: null, marked_complete_by: null },
    eqa: { answers: {}, textEntries: {}, agreed_with_previous: 0, marked_complete_at: null, marked_complete_by: null },
  };

  for (const entry of stageEntries) {
    const parsed = parseStageData(entry.data);
    stageData[entry.stage] = {
      ...parsed,
      agreed_with_previous: entry.agreed_with_previous,
      marked_complete_at: entry.marked_complete_at,
      marked_complete_by: entry.marked_complete_by,
    };
  }

  // Find assessor's stage completion info
  const assessorCompleted = stageData.assess.marked_complete_at !== null;
  const iqaCompleted = stageData.iqa.marked_complete_at !== null;

  return pageShell(template.title, `
    <main class="dashboard-shell">
      ${renderSidebar(identity, entry.status)}
      <section class="content">
        ${renderTopbar(identity, template.title)}

        ${!header ? renderHeaderSetupForm(entry, identity) : renderHeaderDisplay(header)}

        ${editable && !readonly && !assessorCompleted && userStage === "assess" ? `
          <section class="panel actions-panel">
            <form method="POST" action="/api/entries/${entry.id}/complete" class="inline-form">
              <button type="submit" class="primary-action">Mark as completed and submit to IQA</button>
            </form>
          </section>
        ` : ""}

        ${editable && !readonly && assessorCompleted && !iqaCompleted && userStage !== "assess" ? `
          <section class="panel actions-panel">
            <form method="POST" action="/api/entries/${entry.id}/agree" class="inline-form">
              <button type="submit" class="secondary-action">Agree with assessor (copy all responses)</button>
            </form>
          </section>
        ` : ""}

        <form method="POST" action="/api/entries/${entry.id}/stage" class="panel checklist-panel">
          <table class="checklist-table modular-table">
            <thead>
              <tr>
                <th class="question-col">Question / Criteria</th>
                <th class="stage-col assess-col">Assessor</th>
                <th class="stage-col iqa-col">IQA</th>
                <th class="stage-col eqa-col">EQA</th>
              </tr>
            </thead>
            <tbody>
              ${template.questions.map((q) => renderQuestionRow(q, stageData, userStage, Boolean(editable && !readonly))).join("")}
            </tbody>
          </table>
          ${editable && !readonly ? `<button type="submit" class="save-btn">Save ${userStage} responses</button>` : '<p class="hint">View-only for your current role/status.</p>'}
        </form>

        ${renderAttachmentsSection(attachments, entry.id, editable && !readonly)}

        <section class="panel comments-panel">
          <h3>Comments & Notes</h3>
          <div class="comment-categories">
            ${template.commentCategories.map(cat => renderCommentCategory(cat, comments, entry.id, !readonly)).join("")}
          </div>
          ${!readonly ? renderNewCommentForm(entry.id, template.commentCategories) : ''}
        </section>

        <section class="actions-row">
          <button onclick="window.print()" type="button">Print</button>
        </section>
      </section>
    </main>
  `);
}

function renderHeaderSetupForm(entry: EnhancedEntryRecord, identity: Identity) {
  return `
    <section class="panel header-setup">
      <h3>Set Entry Details</h3>
      <form method="POST" action="/api/entries/${entry.id}/header" class="stack-form">
        <div class="form-grid-3">
          <label>Course ID<input name="course_id" required placeholder="e.g., ESOL-2024-001"></label>
          <label>Qualification aim (UK code)<input name="qualification_aim" required placeholder="e.g., 603/4999/5"></label>
          <label>Course name<input name="course_name" required placeholder="e.g., ESOL Entry Level 1"></label>
        </div>
        <input type="hidden" name="assessor_id" value="${identity.user!.id}">
        <button type="submit">Set entry details (immutable after save)</button>
      </form>
    </section>
  `;
}

function renderHeaderDisplay(header: EntryHeader) {
  return `
    <section class="panel meta-panel header-display">
      <div class="header-row">
        <strong>Course ID:</strong> ${escapeHtml(header.course_id)}
        <strong>Qualification:</strong> ${escapeHtml(header.qualification_aim)}
        <strong>Course:</strong> ${escapeHtml(header.course_name)}
      </div>
      <div class="header-row roles">
        ${header.assessor_date ? `<span class="role-badge assessor">Assessor completed: ${escapeHtml(header.assessor_date)}</span>` : ""}
        ${header.iqa_date ? `<span class="role-badge iqa">IQA completed: ${escapeHtml(header.iqa_date)}</span>` : ""}
        ${header.eqa_date ? `<span class="role-badge eqa">EQA completed: ${escapeHtml(header.eqa_date)}</span>` : ""}
      </div>
    </section>
  `;
}

function renderQuestionRow(q: TemplateQuestion, stageData: Record<Stage, StageData>, userStage: Stage, editable: boolean): string {
  const assessorData = stageData.assess;
  const iqaData = stageData.iqa;
  const eqaData = stageData.eqa;

  const canEditAssessor = Boolean(editable && userStage === "assess" && q.visible_to_assessor);
  const canEditIqa = Boolean(editable && userStage === "iqa" && q.visible_to_iqa);
  const canEditEqa = Boolean(editable && userStage === "eqa" && q.visible_to_eqa);

  return `
    <tr class="question-row">
      <td class="question-cell">
        <div class="question-text">${escapeHtml(q.question_text)} ${q.is_required ? '<span class="required">*</span>' : ""}</div>
        ${q.text_entry_label ? `<div class="text-entry-label">${escapeHtml(q.text_entry_label)}</div>` : ""}
      </td>
      <td class="stage-cell assess-cell">
        ${q.visible_to_assessor ? renderQuestionInput(q, "assess", assessorData, canEditAssessor) : "—"}
      </td>
      <td class="stage-cell iqa-cell">
        ${q.visible_to_iqa ? renderQuestionInput(q, "iqa", iqaData, canEditIqa) : "—"}
      </td>
      <td class="stage-cell eqa-cell">
        ${q.visible_to_eqa ? renderQuestionInput(q, "eqa", eqaData, canEditEqa) : "—"}
      </td>
    </tr>
  `;
}

function renderQuestionInput(q: TemplateQuestion, stage: Stage, data: StageData, editable: boolean): string {
  const inputName = `q_${q.id}`;
  const textEntryName = `text_${q.id}`;
  const currentValue = data.answers[q.id] || "";
  const textEntryValue = data.textEntries[q.id] || "";

  if (!editable) {
    // Read-only view
    const displayValue = Array.isArray(currentValue) ? currentValue.join(", ") : currentValue;
    return `
      <div class="readonly-answer">${displayValue || "—"}</div>
      ${q.has_text_entry ? `<div class="readonly-text">${escapeHtml(textEntryValue) || "—"}</div>` : ""}
    `;
  }

  // Editable input based on question type
  let inputHtml = "";

  switch (q.question_type) {
    case "yes_no":
      inputHtml = `
        <label><input type="radio" name="${inputName}" value="yes" ${currentValue === "yes" ? "checked" : ""}> Yes</label>
        <label><input type="radio" name="${inputName}" value="no" ${currentValue === "no" ? "checked" : ""}> No</label>
      `;
      break;
    case "single_choice":
      inputHtml = (q.options || []).map(opt =>
        `<label><input type="radio" name="${inputName}" value="${escapeHtml(opt.value)}" ${currentValue === opt.value ? "checked" : ""}> ${escapeHtml(opt.label)}</label>`
      ).join("");
      break;
    case "multiple_choice":
      const selectedValues = Array.isArray(currentValue) ? currentValue : currentValue ? [currentValue] : [];
      inputHtml = (q.options || []).map(opt =>
        `<label><input type="checkbox" name="${inputName}[]" value="${escapeHtml(opt.value)}" ${selectedValues.includes(opt.value) ? "checked" : ""}> ${escapeHtml(opt.label)}</label>`
      ).join("");
      break;
    case "dropdown":
      inputHtml = `
        <select name="${inputName}">
          <option value="">Select...</option>
          ${(q.options || []).map(opt => `<option value="${escapeHtml(opt.value)}" ${currentValue === opt.value ? "selected" : ""}>${escapeHtml(opt.label)}</option>`).join("")}
        </select>
      `;
      break;
    case "textarea":
      inputHtml = `<textarea name="${inputName}" rows="3" placeholder="Enter response...">${escapeHtml(currentValue as string)}</textarea>`;
      break;
    case "text":
    case "currency":
    default:
      inputHtml = `<input type="text" name="${inputName}" value="${escapeHtml(currentValue as string)}" placeholder="Enter response...">`;
      break;
  }

  // Add text entry field if configured
  const textEntryHtml = q.has_text_entry
    ? `<div class="text-entry"><label>${escapeHtml(q.text_entry_label || "Notes")}<input type="text" name="${textEntryName}" value="${escapeHtml(textEntryValue)}" placeholder="Enter details..."></label></div>`
    : "";

  return `<div class="question-input">${inputHtml}${textEntryHtml}</div>`;
}

function renderCommentCategory(cat: CommentCategory, comments: CommentWithCategory[], entryId: string, canAdd: boolean): string {
  const catComments = comments.filter(c => c.category_id === cat.id);

  return `
    <div class="comment-category">
      <h4>${escapeHtml(cat.name)}</h4>
      ${cat.description ? `<p class="category-desc">${escapeHtml(cat.description)}</p>` : ""}
      <div class="comments-list">
        ${catComments.map(c => `
          <div class="comment-item ${c.is_pinned ? "pinned" : ""}">
            <div class="comment-meta">
              <strong>${escapeHtml(c.email || "Unknown")}</strong>
              <span>${escapeHtml(c.created_at)}</span>
              ${c.is_pinned ? "📌" : ""}
            </div>
            <div class="comment-text">${escapeHtml(c.comment)}</div>
          </div>
        `).join("") || '<p class="empty">No comments yet</p>'}
      </div>
    </div>
  `;
}

function renderNewCommentForm(entryId: string, categories: CommentCategory[]): string {
  if (categories.length === 0) {
    return `
      <form method="POST" action="/api/entries/${entryId}/comments" class="comment-form">
        <textarea name="comment" rows="3" placeholder="Add a comment..."></textarea>
        <button type="submit">Add comment</button>
      </form>
    `;
  }

  return `
    <form method="POST" action="/api/entries/${entryId}/comments" class="comment-form">
      <select name="category_id">
        <option value="">Select category...</option>
        ${categories.map(c => `<option value="${c.id}">${escapeHtml(c.name)}</option>`).join("")}
      </select>
      <textarea name="comment" rows="3" placeholder="Add a comment..."></textarea>
      <button type="submit">Add comment</button>
    </form>
  `;
}

function renderAttachmentsSection(attachments: { id: string; file_name: string; file_size: number; content_type: string; description: string | null; created_at: string }[], entryId: string, canUpload: boolean): string {
  return `
    <section class="panel attachments-panel">
      <h3>Attachments</h3>
      <div class="attachments-list">
        ${attachments.map(a => `
          <div class="attachment-item">
            <span class="file-name">${escapeHtml(a.file_name)}</span>
            <span class="file-size">${(a.file_size / 1024).toFixed(1)} KB</span>
            ${a.description ? `<span class="file-desc">${escapeHtml(a.description)}</span>` : ""}
          </div>
        `).join("") || '<p class="empty">No attachments</p>'}
      </div>
      ${canUpload ? `
        <form method="POST" action="/api/entries/${entryId}/attachments" enctype="multipart/form-data" class="upload-form">
          <input type="file" name="file" required>
          <input type="text" name="description" placeholder="File description (optional)">
          <button type="submit">Upload file</button>
        </form>
      ` : ''}
    </section>
  `;
}

function parseStageData(data: string | null): StageData {
  if (!data) return { answers: {}, textEntries: {}, agreed_with_previous: 0, marked_complete_at: null, marked_complete_by: null };
  try {
    const parsed = JSON.parse(data) as StageData;
    return {
      answers: parsed.answers || {},
      textEntries: parsed.textEntries || {},
      agreed_with_previous: parsed.agreed_with_previous || 0,
      marked_complete_at: parsed.marked_complete_at || null,
      marked_complete_by: parsed.marked_complete_by || null,
    };
  } catch {
    return { answers: {}, textEntries: {}, agreed_with_previous: 0, marked_complete_at: null, marked_complete_by: null };
  }
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

async function renderCreateLWTemplatePage(identity: Identity): Promise<Response> {
  if (!canCreateForms(identity.user!)) return htmlResponse(renderForbiddenPage(identity), 403);
  return htmlResponse(renderLWCreateTemplatePage(identity));
}

async function renderLWBuilderPage(env: Env, identity: Identity, templateId: string): Promise<Response> {
  if (!canCreateForms(identity.user!)) return htmlResponse(renderForbiddenPage(identity), 403);
  const tmpl = await getLWTemplateWithQuestions(env, templateId);
  if (!tmpl) return htmlResponse(renderNotFoundPage(), 404);
  return htmlResponse(renderLWBuilderPageHtml(identity, tmpl));
}

async function renderNewLWEntryPage(env: Env, identity: Identity): Promise<Response> {
  if (!canCreateForms(identity.user!)) return htmlResponse(renderForbiddenPage(identity), 403);
  const [templates, iqas, assessors] = await Promise.all([
    getLWTemplates(env),
    env.esol_marking_db.prepare("SELECT id, email, role, stage FROM users WHERE role IN ('iqa','admin','superuser') ORDER BY email ASC").all<UserRecord>(),
    env.esol_marking_db.prepare("SELECT id, email, role, stage FROM users WHERE role IN ('assessor','admin','superuser') ORDER BY email ASC").all<UserRecord>(),
  ]);
  return htmlResponse(renderNewLWEntryPageHtml(identity, templates, iqas.results, assessors.results));
}

async function renderLWEntryPage(env: Env, identity: Identity, id: string): Promise<Response> {
  if (!id) return htmlResponse(renderNotFoundPage(), 404);
  const entry = await getLWEntry(env, identity.user!, id);
  if (!entry) return htmlResponse(renderNotFoundPage(), 404);
  const [tmpl, answers, comments, notifications] = await Promise.all([
    getLWTemplateWithQuestions(env, entry.template_id),
    getLWAnswers(env, id),
    getLWComments(env, id),
    getLWNotifications(env, identity.user!.id),
  ]);
  if (!tmpl) return htmlResponse(renderNotFoundPage(), 404);
  return htmlResponse(renderLWEntryPageHtml(identity, entry, tmpl, answers, comments, notifications));
}

// ─── Learning Walks: API handlers ─────────────────────────────────────────────

async function createLWTemplate(request: Request, env: Env, identity: Identity): Promise<Response> {
  if (!canCreateForms(identity.user!)) return json({ error: "Forbidden" }, 403);
  const body = await request.formData();
  const title = String(body.get("title") ?? "").trim();
  const description = String(body.get("description") ?? "").trim() || null;
  if (!title) return json({ error: "Title required" }, 400);
  const id = crypto.randomUUID();
  await env.esol_marking_db.prepare("INSERT INTO lw_templates (id, title, description, created_by) VALUES (?, ?, ?, ?)").bind(id, title, description, identity.user!.id).run();
  return Response.redirect(new URL(`/learning-walks/templates/${id}/build`, request.url).toString(), 303);
}

async function updateLWTemplate(request: Request, env: Env, identity: Identity, templateId: string): Promise<Response> {
  if (!canCreateForms(identity.user!)) return json({ error: "Forbidden" }, 403);
  const body = await request.formData();
  const title = String(body.get("title") ?? "").trim();
  const description = String(body.get("description") ?? "").trim() || null;
  if (!title) return json({ error: "Title required" }, 400);
  await env.esol_marking_db.prepare("UPDATE lw_templates SET title = ?, description = ? WHERE id = ?").bind(title, description, templateId).run();
  return Response.redirect(new URL(`/learning-walks/templates/${templateId}/build`, request.url).toString(), 303);
}

async function deleteLWTemplate(request: Request, env: Env, identity: Identity, templateId: string): Promise<Response> {
  if (!canCreateForms(identity.user!)) return json({ error: "Forbidden" }, 403);
  const body = await request.formData();
  if (String(body.get("confirm") ?? "") !== "DELETE") return json({ error: "Must type DELETE" }, 400);
  await env.esol_marking_db.prepare("DELETE FROM lw_template_questions WHERE template_id = ?").bind(templateId).run();
  await env.esol_marking_db.prepare("DELETE FROM lw_templates WHERE id = ?").bind(templateId).run();
  return Response.redirect(new URL("/learning-walks", request.url).toString(), 303);
}

async function addLWTemplateQuestion(request: Request, env: Env, identity: Identity, templateId: string): Promise<Response> {
  if (!canCreateForms(identity.user!)) return json({ error: "Forbidden" }, 403);
  const body = await request.formData();
  const question_text = String(body.get("question_text") ?? "").trim();
  const question_type = String(body.get("question_type") ?? "text");
  const is_required = body.get("is_required") === "1" ? 1 : 0;
  const has_text_entry = body.get("has_text_entry") === "1" ? 1 : 0;
  const text_entry_label = String(body.get("text_entry_label") ?? "").trim() || null;
  const rawOptions = String(body.get("options") ?? "").trim();
  const options = rawOptions ? JSON.stringify(rawOptions.split("\n").filter(Boolean).map((o, i) => ({ id: `opt_${i}`, label: o.trim(), value: o.trim() }))) : null;
  if (!question_text) return json({ error: "Question text required" }, 400);
  const countRow = await env.esol_marking_db.prepare("SELECT COUNT(*) as cnt FROM lw_template_questions WHERE template_id = ?").bind(templateId).first<{ cnt: number }>();
  const sort_order = (countRow?.cnt ?? 0);
  await env.esol_marking_db.prepare("INSERT INTO lw_template_questions (id, template_id, question_text, question_type, options, has_text_entry, text_entry_label, is_required, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)").bind(crypto.randomUUID(), templateId, question_text, question_type, options, has_text_entry, text_entry_label, is_required, sort_order).run();
  return Response.redirect(new URL(`/learning-walks/templates/${templateId}/build`, request.url).toString(), 303);
}

async function deleteLWTemplateQuestion(env: Env, identity: Identity, templateId: string, questionId: string): Promise<Response> {
  if (!canCreateForms(identity.user!)) return json({ error: "Forbidden" }, 403);
  await env.esol_marking_db.prepare("DELETE FROM lw_template_questions WHERE id = ? AND template_id = ?").bind(questionId, templateId).run();
  return json({ success: true });
}

async function createLWEntry(request: Request, env: Env, identity: Identity): Promise<Response> {
  if (!canCreateForms(identity.user!)) return json({ error: "Forbidden" }, 403);
  const body = await request.formData();
  const template_id = String(body.get("template_id") ?? "").trim();
  const course_id = String(body.get("course_id") ?? "").trim();
  const course_name = String(body.get("course_name") ?? "").trim();
  const assessor_name = String(body.get("assessor_name") ?? "").trim();
  const iqa_name = String(body.get("iqa_name") ?? "").trim();
  const planned_date = String(body.get("planned_date") ?? "").trim();
  const due_date = String(body.get("due_date") ?? "").trim() || null;
  const allocated_iqa_id = String(body.get("allocated_iqa_id") ?? "").trim() || null;
  const allocated_assessor_id = String(body.get("allocated_assessor_id") ?? "").trim() || null;
  if (!template_id || !course_id || !course_name || !assessor_name || !iqa_name || !planned_date) return json({ error: "All required fields must be filled" }, 400);
  const id = crypto.randomUUID();
  await env.esol_marking_db.prepare("INSERT INTO lw_entries (id, template_id, course_id, course_name, assessor_name, iqa_name, planned_date, due_date, allocated_iqa_id, allocated_assessor_id, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").bind(id, template_id, course_id, course_name, assessor_name, iqa_name, planned_date, due_date, allocated_iqa_id, allocated_assessor_id, identity.user!.id).run();
  if (allocated_iqa_id) {
    await createLWNotification(env, allocated_iqa_id, id, `A new learning walk has been allocated to you: ${course_name}`);
  }
  return Response.redirect(new URL("/learning-walks", request.url).toString(), 303);
}

async function saveLWAnswers(request: Request, env: Env, identity: Identity, entryId: string): Promise<Response> {
  const entry = await getLWEntry(env, identity.user!, entryId);
  if (!entry) return json({ error: "Not found" }, 404);
  if (entry.allocated_iqa_id !== identity.user!.id && !canCreateForms(identity.user!)) return json({ error: "Forbidden" }, 403);
  const body = await request.formData();
  for (const [key, value] of body.entries()) {
    if (!key.startsWith("q_")) continue;
    const questionId = key.slice(2);
    await env.esol_marking_db.prepare("INSERT INTO lw_answers (id, entry_id, question_id, answer, updated_by) VALUES (?, ?, ?, ?, ?) ON CONFLICT(entry_id, question_id) DO UPDATE SET answer = excluded.answer, updated_by = excluded.updated_by, updated_at = CURRENT_TIMESTAMP").bind(crypto.randomUUID(), entryId, questionId, String(value), identity.user!.id).run();
  }
  return Response.redirect(new URL(`/learning-walks/entries/${entryId}`, request.url).toString(), 303);
}

async function completeLWAsIqa(request: Request, env: Env, identity: Identity, entryId: string): Promise<Response> {
  const entry = await getLWEntry(env, identity.user!, entryId);
  if (!entry) return json({ error: "Not found" }, 404);
  if (entry.allocated_iqa_id !== identity.user!.id && !canCreateForms(identity.user!)) return json({ error: "Forbidden" }, 403);
  await env.esol_marking_db.prepare("UPDATE lw_entries SET status = 'iqa_completed', iqa_completed_at = CURRENT_TIMESTAMP WHERE id = ?").bind(entryId).run();
  if (entry.allocated_assessor_id) {
    await createLWNotification(env, entry.allocated_assessor_id, entryId, `IQA has completed a learning walk observation for: ${entry.course_name}`);
  }
  return Response.redirect(new URL(`/learning-walks/entries/${entryId}`, request.url).toString(), 303);
}

async function completeLWAsAssessor(request: Request, env: Env, identity: Identity, entryId: string): Promise<Response> {
  const entry = await getLWEntry(env, identity.user!, entryId);
  if (!entry) return json({ error: "Not found" }, 404);
  if (entry.allocated_assessor_id !== identity.user!.id && !canCreateForms(identity.user!)) return json({ error: "Forbidden" }, 403);
  await env.esol_marking_db.prepare("UPDATE lw_entries SET status = 'assessor_responded', assessor_responded_at = CURRENT_TIMESTAMP WHERE id = ?").bind(entryId).run();
  if (entry.allocated_iqa_id) {
    await createLWNotification(env, entry.allocated_iqa_id, entryId, `Assessor has responded to the learning walk for: ${entry.course_name}`);
  }
  return Response.redirect(new URL(`/learning-walks/entries/${entryId}`, request.url).toString(), 303);
}

async function addLWComment(request: Request, env: Env, identity: Identity, entryId: string): Promise<Response> {
  const entry = await getLWEntry(env, identity.user!, entryId);
  if (!entry) return json({ error: "Not found" }, 404);
  const body = await request.formData();
  const comment = String(body.get("comment") ?? "").trim();
  if (!comment) return json({ error: "Comment cannot be empty" }, 400);
  const role = identity.user!.role as "iqa" | "assessor" | "admin" | "superuser";
  await env.esol_marking_db.prepare("INSERT INTO lw_comments (id, entry_id, author_id, author_role, comment) VALUES (?, ?, ?, ?, ?)").bind(crypto.randomUUID(), entryId, identity.user!.id, role, comment).run();
  const notifyId = role === "iqa" ? entry.allocated_assessor_id : entry.allocated_iqa_id;
  if (notifyId && notifyId !== identity.user!.id) {
    await createLWNotification(env, notifyId, entryId, `New comment on learning walk: ${entry.course_name}`);
  }
  return Response.redirect(new URL(`/learning-walks/entries/${entryId}`, request.url).toString(), 303);
}

async function closeLWEntry(request: Request, env: Env, identity: Identity, entryId: string): Promise<Response> {
  if (!canCreateForms(identity.user!)) return json({ error: "Forbidden" }, 403);
  await env.esol_marking_db.prepare("UPDATE lw_entries SET status = 'complete', completed_at = CURRENT_TIMESTAMP WHERE id = ?").bind(entryId).run();
  return Response.redirect(new URL(`/learning-walks/entries/${entryId}`, request.url).toString(), 303);
}

async function markLWNotificationRead(env: Env, identity: Identity, notificationId: string): Promise<Response> {
  await env.esol_marking_db.prepare("UPDATE lw_notifications SET is_read = 1 WHERE id = ? AND user_id = ?").bind(notificationId, identity.user!.id).run();
  return json({ success: true });
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
            <a class="small-action" href="/learning-walks/templates/new">+ New template</a>
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

function renderLWCreateTemplatePage(identity: Identity): string {
  return pageShell("New LW Template", `
    <main class="dashboard-shell">
      ${renderSidebar(identity, "learning-walks")}
      <section class="content">
        ${renderTopbar(identity, "New Learning Walk Template")}
        <section class="panel narrow-panel">
          <form method="POST" action="/api/lw/templates" class="stack-form">
            <label>Title <input name="title" required placeholder="e.g. ESOL Observation Checklist"></label>
            <label>Description <textarea name="description" rows="3" placeholder="What this template is used for"></textarea></label>
            <button type="submit" class="primary-action">Create &amp; Build Template</button>
          </form>
        </section>
      </section>
    </main>
  `);
}

function renderLWQuestionCard(q: LWTemplateQuestion, idx: number, templateId: string): string {
  const typeLabels: Record<string, string> = { single_choice: "Single Choice", multiple_choice: "Multiple Choice", dropdown: "Dropdown", rag: "RAG Rating", text: "Text", textarea: "Long Text", date: "Date", rating: "Rating", ranking: "Ranking", likert: "Likert", yes_no: "Yes/No", file_upload: "File Upload" };
  const optionsHtml = q.options && q.options.length ? `<div class="lw-q-options">${q.options.map(o => `<span class="lw-q-opt">${escapeHtml(o.label)}</span>`).join("")}</div>` : "";
  return `<div class="question-card">
    <div class="question-header">
      <div class="q-number">${idx + 1}</div>
      <span class="q-type-badge">${typeLabels[q.question_type] ?? q.question_type}</span>
      ${q.is_required ? `<span class="req-badge">Required</span>` : ""}
      <form method="DELETE" action="/api/lw/templates/${templateId}/questions/${q.id}" style="margin-left:auto" onsubmit="this.method='POST';this.action='/api/lw/templates/${templateId}/questions/${q.id}/delete'">
        <button type="submit" class="action-btn delete-btn" title="Remove question" onclick="return confirm('Remove this question?')">🗑️</button>
      </form>
    </div>
    <p class="q-text">${escapeHtml(q.question_text)}</p>
    ${optionsHtml}
    ${q.has_text_entry ? `<p class="text-entry-hint">+ Text field: ${escapeHtml(q.text_entry_label ?? "Comments")}</p>` : ""}
  </div>`;
}

function renderLWBuilderPageHtml(identity: Identity, template: LWTemplateWithQuestions): string {
  const questionTypes = [
    { type: "single_choice", icon: "⭘", label: "Single Choice", desc: "Select one option" },
    { type: "multiple_choice", icon: "☑", label: "Multiple Choice", desc: "Select multiple" },
    { type: "dropdown", icon: "▼", label: "Dropdown", desc: "Compact list" },
    { type: "rag", icon: "🟢", label: "RAG Rating", desc: "Green/Amber/Red" },
    { type: "text", icon: "T", label: "Text", desc: "Short answer" },
    { type: "textarea", icon: "≡", label: "Long Text", desc: "Multi-line" },
    { type: "date", icon: "📅", label: "Date", desc: "Date picker" },
    { type: "yes_no", icon: "✓", label: "Yes/No", desc: "Binary choice" },
    { type: "likert", icon: "◫", label: "Likert", desc: "Agree/Disagree scale" },
    { type: "rating", icon: "★", label: "Rating", desc: "Numeric scale" },
    { type: "ranking", icon: "⇅", label: "Ranking", desc: "Order items" },
    { type: "file_upload", icon: "📎", label: "File Upload", desc: "Attach files" },
  ];

  const fixedFields = [
    { label: "Course ID", placeholder: "e.g. ESOL-E1-2024" },
    { label: "Course Name", placeholder: "e.g. ESOL Entry Level 1" },
    { label: "Assessor Name", placeholder: "Full name" },
    { label: "IQA Name", placeholder: "Full name" },
    { label: "Planned Observation Date", placeholder: "YYYY-MM-DD" },
    { label: "Due Date (optional)", placeholder: "YYYY-MM-DD" },
  ];

  return pageShell(`Build: ${template.title}`, `
    <main class="dashboard-shell">
      ${renderSidebar(identity, "learning-walks")}
      <section class="content form-builder-content">
        ${renderTopbar(identity, "Learning Walk Template Builder")}
        <div class="form-builder-container">

          <div class="form-header-card">
            <form method="POST" action="/api/lw/templates/${template.id}/update">
              <input type="text" name="title" class="form-title-input" value="${escapeHtml(template.title)}" placeholder="Template title">
              <textarea name="description" class="form-desc-input" rows="2" placeholder="Description">${escapeHtml(template.description ?? "")}</textarea>
              <button type="submit" class="secondary-btn" style="margin-top:0.5rem">Save title/description</button>
            </form>
          </div>

          <div class="form-section-card">
            <h3 class="section-title">📋 Fixed Entry Fields (pre-filled by admin when creating an entry)</h3>
            <div class="header-fields-grid">
              ${fixedFields.map(f => `<div class="header-field-preview"><label>${escapeHtml(f.label)}</label><div class="field-preview">${escapeHtml(f.placeholder)}</div></div>`).join("")}
            </div>
          </div>

          <div id="questions-container">
            ${template.questions.map((q, i) => renderLWQuestionCard(q, i, template.id)).join("")}
          </div>

          <div class="add-question-wrapper" style="flex-direction:column;align-items:center">
            <button type="button" class="add-question-btn" onclick="document.getElementById('lw-type-picker').classList.toggle('hidden')">
              <span class="plus-icon">+</span><span>Add question</span>
            </button>
            <div id="lw-type-picker" class="question-type-picker hidden" style="width:100%">
              <div class="picker-header"><span>Select question type</span><button type="button" class="close-picker" onclick="document.getElementById('lw-type-picker').classList.add('hidden')">✕</button></div>
              <div class="picker-grid">
                ${questionTypes.map(t => `<button type="button" class="type-option" onclick="lwSelectType('${t.type}')"><span class="type-icon">${t.icon}</span><span class="type-label">${t.label}</span><span class="type-desc">${t.desc}</span></button>`).join("")}
              </div>
            </div>
          </div>

          <div id="lw-question-form" class="form-section-card hidden">
            <form method="POST" action="/api/lw/templates/${template.id}/questions" id="lw-q-form">
              <input type="hidden" name="question_type" id="lw-qtype">
              <div class="form-group">
                <label>Question text <span class="req">*</span></label>
                <input type="text" name="question_text" required class="question-input" placeholder="Enter your question">
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Type</label>
                  <select name="question_type_display" id="lw-qtype-display" disabled class="type-select"><option>—</option></select>
                </div>
                <div class="form-group checkbox-group">
                  <label class="checkbox-label"><input type="checkbox" name="is_required" value="1" checked><span>Required</span></label>
                </div>
              </div>
              <div id="lw-options-section" class="form-group hidden">
                <label>Options (one per line)</label>
                <textarea name="options" rows="4" class="options-textarea" placeholder="Option A&#10;Option B&#10;Option C"></textarea>
              </div>
              <div class="form-group checkbox-group">
                <label class="checkbox-label"><input type="checkbox" name="has_text_entry" value="1" id="lw-has-text"><span>Add text field below question</span></label>
              </div>
              <div id="lw-text-label-group" class="form-group hidden">
                <label>Text field label</label>
                <input type="text" name="text_entry_label" placeholder="e.g. Additional comments">
              </div>
              <div class="form-actions">
                <button type="button" class="secondary-btn" onclick="document.getElementById('lw-question-form').classList.add('hidden');document.getElementById('lw-q-form').reset()">Cancel</button>
                <button type="submit" class="primary-btn">Add Question</button>
              </div>
            </form>
          </div>

          <div style="padding:1rem 0">
            <a href="/learning-walks" class="secondary-btn" style="display:inline-block;padding:0.6rem 1.25rem">← Back to Learning Walks</a>
          </div>
        </div>
      </section>
    </main>
    <script>
      document.getElementById('lw-has-text')?.addEventListener('change', function() {
        document.getElementById('lw-text-label-group').classList.toggle('hidden', !this.checked);
      });
      function lwSelectType(type) {
        document.getElementById('lw-type-picker').classList.add('hidden');
        document.getElementById('lw-question-form').classList.remove('hidden');
        document.getElementById('lw-qtype').value = type;
        const names = { single_choice:'Single Choice', multiple_choice:'Multiple Choice', dropdown:'Dropdown', rag:'RAG Rating', text:'Text', textarea:'Long Text', date:'Date', yes_no:'Yes/No', likert:'Likert', rating:'Rating', ranking:'Ranking', file_upload:'File Upload' };
        document.getElementById('lw-qtype-display').innerHTML = '<option>' + (names[type] || type) + '</option>';
        const needsOpts = ['single_choice','multiple_choice','dropdown','yes_no'].includes(type);
        document.getElementById('lw-options-section').classList.toggle('hidden', !needsOpts);
        if (type === 'rag') { document.querySelector('#lw-q-form [name="options"]').value = 'Green\nAmber\nRed'; document.getElementById('lw-options-section').classList.remove('hidden'); }
      }
    </script>
  `);
}

function renderNewLWEntryPageHtml(identity: Identity, templates: LWTemplateRecord[], iqas: UserRecord[], assessors: UserRecord[]): string {
  return pageShell("New Learning Walk Entry", `
    <main class="dashboard-shell">
      ${renderSidebar(identity, "learning-walks")}
      <section class="content">
        ${renderTopbar(identity, "Create Learning Walk Entry")}
        <section class="panel" style="max-width:700px;margin:0 auto">
          <form method="POST" action="/api/lw/entries" class="stack-form">
            <label>Template <span style="color:#dc2626">*</span><select name="template_id" required>${templates.map(t => `<option value="${t.id}">${escapeHtml(t.title)}</option>`).join("")}</select></label>
            <label>Course ID <span style="color:#dc2626">*</span><input name="course_id" required placeholder="e.g. ESOL-E1-2024"></label>
            <label>Course Name <span style="color:#dc2626">*</span><input name="course_name" required placeholder="e.g. ESOL Entry Level 1"></label>
            <label>Assessor Name <span style="color:#dc2626">*</span><input name="assessor_name" required placeholder="Full name of the teacher being observed"></label>
            <label>IQA Name <span style="color:#dc2626">*</span><input name="iqa_name" required placeholder="Full name of the IQA"></label>
            <label>Planned Observation Date <span style="color:#dc2626">*</span><input type="date" name="planned_date" required></label>
            <label>Due Date (deadline)<input type="date" name="due_date"></label>
            <label>Allocate to IQA (user account)<select name="allocated_iqa_id"><option value="">— Not assigned —</option>${iqas.map(u => `<option value="${u.id}">${escapeHtml(u.email)}</option>`).join("")}</select></label>
            <label>Allocate to Assessor (user account)<select name="allocated_assessor_id"><option value="">— Not assigned —</option>${assessors.map(u => `<option value="${u.id}">${escapeHtml(u.email)}</option>`).join("")}</select></label>
            <button type="submit" class="primary-action">Create Learning Walk Entry</button>
          </form>
        </section>
      </section>
    </main>
  `);
}

function renderLWEntryPageHtml(identity: Identity, entry: LWEntryRecord, template: LWTemplateWithQuestions, answers: LWAnswer[], comments: LWComment[], notifications: LWNotification[]): string {
  const user = identity.user!;
  const canManage = canCreateForms(user);
  const isAllocatedIqa = entry.allocated_iqa_id === user.id;
  const isAllocatedAssessor = entry.allocated_assessor_id === user.id;
  const canFillChecklist = isAllocatedIqa || canManage;
  const iqaCanSubmit = (isAllocatedIqa || canManage) && entry.status === "pending";
  const assessorCanRespond = (isAllocatedAssessor || canManage) && entry.status === "iqa_completed";
  const answerMap = Object.fromEntries(answers.map(a => [a.question_id, a.answer ?? ""]));
  const today = new Date().toISOString().split("T")[0];
  const isOverdue = entry.due_date && entry.due_date < today && entry.status !== "complete";

  const checklistHtml = template.questions.length ? `
    <form method="POST" action="/api/lw/entries/${entry.id}/answers">
      ${template.questions.map((q, i) => {
        const opts = q.options ?? [];
        const savedAnswer = answerMap[q.id] ?? "";
        let inputHtml = "";
        if (q.question_type === "single_choice" || q.question_type === "rag") {
          inputHtml = `<div class="lw-radio-group">${opts.map(o => `<label class="lw-choice-label${q.question_type === "rag" ? " rag-" + o.value.toLowerCase() : ""}"><input type="radio" name="q_${q.id}" value="${escapeHtml(o.value)}" ${savedAnswer === o.value ? "checked" : ""} ${!canFillChecklist ? "disabled" : ""}> ${escapeHtml(o.label)}</label>`).join("")}</div>`;
        } else if (q.question_type === "multiple_choice") {
          const savedArr = savedAnswer ? savedAnswer.split(",") : [];
          inputHtml = `<div class="lw-radio-group">${opts.map(o => `<label class="lw-choice-label"><input type="checkbox" name="q_${q.id}" value="${escapeHtml(o.value)}" ${savedArr.includes(o.value) ? "checked" : ""} ${!canFillChecklist ? "disabled" : ""}> ${escapeHtml(o.label)}</label>`).join("")}</div>`;
        } else if (q.question_type === "dropdown") {
          inputHtml = `<select name="q_${q.id}" ${!canFillChecklist ? "disabled" : ""}><option value="">— Select —</option>${opts.map(o => `<option value="${escapeHtml(o.value)}" ${savedAnswer === o.value ? "selected" : ""}>${escapeHtml(o.label)}</option>`).join("")}</select>`;
        } else if (q.question_type === "yes_no") {
          inputHtml = `<div class="lw-radio-group"><label class="lw-choice-label"><input type="radio" name="q_${q.id}" value="Yes" ${savedAnswer === "Yes" ? "checked" : ""} ${!canFillChecklist ? "disabled" : ""}> Yes</label><label class="lw-choice-label"><input type="radio" name="q_${q.id}" value="No" ${savedAnswer === "No" ? "checked" : ""} ${!canFillChecklist ? "disabled" : ""}> No</label></div>`;
        } else if (q.question_type === "textarea") {
          inputHtml = `<textarea name="q_${q.id}" rows="3" ${!canFillChecklist ? "disabled" : ""}>${escapeHtml(savedAnswer)}</textarea>`;
        } else if (q.question_type === "date") {
          inputHtml = `<input type="date" name="q_${q.id}" value="${escapeHtml(savedAnswer)}" ${!canFillChecklist ? "disabled" : ""}>`;
        } else {
          inputHtml = `<input type="text" name="q_${q.id}" value="${escapeHtml(savedAnswer)}" ${!canFillChecklist ? "disabled" : ""}>`;
        }
        if (q.has_text_entry) {
          inputHtml += `<input type="text" name="q_${q.id}_text" placeholder="${escapeHtml(q.text_entry_label ?? "Comments")}" ${!canFillChecklist ? "disabled" : ""}>`;
        }
        return `<div class="question-card">
          <div class="question-header">
            <div class="q-number">${i + 1}</div>
            <span class="q-type-badge">${q.question_type.replace("_", " ")}</span>
            ${q.is_required ? `<span class="req-badge">Required</span>` : ""}
          </div>
          <p class="q-text">${escapeHtml(q.question_text)}</p>
          ${inputHtml}
        </div>`;
      }).join("")}
      ${canFillChecklist ? `<div style="margin:1rem 0"><button type="submit" class="primary-btn">💾 Save answers</button></div>` : ""}
    </form>
  ` : `<p class="hint">No questions in this template.</p>`;

  const commentsHtml = `
    <div class="lw-comments">
      ${comments.map(c => `
        <div class="lw-comment lw-comment-${c.author_role}">
          <div class="lw-comment-header">
            <strong>${escapeHtml(c.author_email ?? c.author_role)}</strong>
            <span class="lw-role-tag">${c.author_role.toUpperCase()}</span>
            <span class="lw-comment-date">${escapeHtml(c.created_at.slice(0, 16).replace("T", " "))}</span>
          </div>
          <p class="lw-comment-body">${escapeHtml(c.comment)}</p>
        </div>
      `).join("")}
    </div>
    <form method="POST" action="/api/lw/entries/${entry.id}/comments" class="lw-comment-form">
      <textarea name="comment" rows="3" placeholder="Write a comment... (permanent, cannot be edited)"></textarea>
      <button type="submit" class="primary-btn">Post comment</button>
    </form>
  `;

  return pageShell(`LW: ${entry.course_name}`, `
    <main class="dashboard-shell">
      ${renderSidebar(identity, "learning-walks")}
      <section class="content">
        <header class="topbar">
          <div><p class="eyebrow">Learning Walk</p><h1>${escapeHtml(entry.course_name)}</h1></div>
          <div style="display:flex;align-items:center;gap:1rem">
            ${renderLWNotificationBell(notifications)}
            <div class="profile-pill">${escapeHtml(identity.email)}</div>
            <a class="logout-link" href="/logout">Sign out</a>
          </div>
        </header>

        <!-- Status Banner -->
        ${isOverdue ? `<div class="lw-overdue-banner lw-blink">⚠ This learning walk is OVERDUE! Due: ${escapeHtml(entry.due_date!)}</div>` : ""}

        <!-- Header fields -->
        <section class="panel lw-header-panel">
          <div class="lw-header-grid">
            <div><span class="lw-field-label">Course ID</span><strong>${escapeHtml(entry.course_id)}</strong></div>
            <div><span class="lw-field-label">Course Name</span><strong>${escapeHtml(entry.course_name)}</strong></div>
            <div><span class="lw-field-label">Assessor</span><strong>${escapeHtml(entry.assessor_name)}</strong></div>
            <div><span class="lw-field-label">IQA</span><strong>${escapeHtml(entry.iqa_name)}</strong></div>
            <div><span class="lw-field-label">Planned Date</span><strong>${escapeHtml(entry.planned_date)}</strong></div>
            ${entry.due_date ? `<div><span class="lw-field-label">Due Date</span><strong>${escapeHtml(entry.due_date)}</strong></div>` : ""}
            <div><span class="lw-field-label">Status</span>${renderLWStatusBadge(entry.status, entry.due_date)}</div>
            <div><span class="lw-field-label">Template</span><strong>${escapeHtml(entry.template_title)}</strong></div>
          </div>
        </section>

        <!-- Checklist -->
        <section class="panel">
          <p class="eyebrow">Observation Checklist</p>
          ${checklistHtml}
          ${iqaCanSubmit ? `<form method="POST" action="/api/lw/entries/${entry.id}/complete-iqa" style="margin-top:1rem"><button type="submit" class="primary-btn" onclick="return confirm('Mark IQA observation as complete? This will notify the assessor.')">✅ Submit IQA Observation</button></form>` : ""}
          ${assessorCanRespond ? `<form method="POST" action="/api/lw/entries/${entry.id}/complete-assessor" style="margin-top:1rem"><button type="submit" class="primary-btn" onclick="return confirm('Mark your response as submitted?')">✅ Submit Assessor Response</button></form>` : ""}
          ${canManage && (entry.status === "assessor_responded") ? `<form method="POST" action="/api/lw/entries/${entry.id}/close" style="margin-top:1rem"><button type="submit" class="primary-btn">🔒 Close Learning Walk</button></form>` : ""}
        </section>

        <!-- Comments -->
        <section class="panel">
          <p class="eyebrow">Comments & Feedback</p>
          ${commentsHtml}
        </section>

        <div style="padding:1rem 0"><a href="/learning-walks" class="secondary-btn" style="display:inline-block;padding:0.6rem 1.25rem">← Back to Learning Walks</a></div>
      </section>
    </main>
  `);
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
  </style></head><body>${body}</body></html>`;
}

function escapeHtml(value: string) { return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;"); }
