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
    if (url.pathname === "/api/templates" && request.method === "GET") return listTemplatesJson(env, identity);
    if (url.pathname.startsWith("/api/templates/") && request.method === "GET" && url.pathname.endsWith("/questions")) return getTemplateQuestions(env, identity, url.pathname.split("/")[3]);
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

  const validTypes: QuestionType[] = ["single_choice", "multiple_choice", "dropdown", "text", "textarea", "date", "currency", "ranking", "likert", "yes_no", "file_upload"];
  if (!validTypes.includes(questionType)) return json({ error: "Invalid question type" }, 400);

  await env.esol_marking_db.prepare(
    "INSERT INTO template_questions (id, template_id, question_text, question_type, options, has_text_entry, text_entry_label, is_required, sort_order, visible_to_assessor, visible_to_iqa, visible_to_eqa) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  ).bind(crypto.randomUUID(), templateId, questionText, questionType, optionsJson, hasTextEntry, textEntryLabel, isRequired, sortOrder, visibleToAssessor, visibleToIqa, visibleToEqa).run();

  return json({ success: true });
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

  return json({ success: true });
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
  const questionTypeOptions = [
    { value: "single_choice", label: "Single choice (radio)" },
    { value: "multiple_choice", label: "Multiple choice (checkboxes)" },
    { value: "dropdown", label: "Dropdown" },
    { value: "text", label: "Text field" },
    { value: "textarea", label: "Text area" },
    { value: "date", label: "Date picker" },
    { value: "currency", label: "Currency amount" },
    { value: "ranking", label: "Ranking" },
    { value: "likert", label: "Likert scale" },
    { value: "yes_no", label: "Yes/No" },
    { value: "file_upload", label: "File upload" },
  ];

  return pageShell(`Edit: ${template.title}`, `
    <main class="dashboard-shell">
      ${renderSidebar(identity, "create")}
      <section class="content">
        ${renderTopbar(identity, `Edit template: ${template.title}`)}
        
        <section class="panel">
          <h3>Questions</h3>
          <div id="questions-list">
            ${template.questions.map((q, idx) => `
              <div class="question-item">
                <strong>${idx + 1}. ${escapeHtml(q.question_text)}</strong>
                <span class="badge">${q.question_type}</span>
                ${q.has_text_entry ? '<span class="badge">+ text entry</span>' : ''}
                <span class="visibility">Assessor:${q.visible_to_assessor ? '✓' : '✗'} IQA:${q.visible_to_iqa ? '✓' : '✗'} EQA:${q.visible_to_eqa ? '✓' : '✗'}</span>
              </div>
            `).join('') || '<p class="empty">No questions yet</p>'}
          </div>
          
          <form method="POST" action="/api/templates/${template.id}/questions" class="stack-form" id="add-question-form">
            <h4>Add new question</h4>
            <label>Question text<input name="question_text" required placeholder="e.g., Full name provided"></label>
            <label>Question type<select name="question_type" required>
              ${questionTypeOptions.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('')}
            </select></label>
            <label>Options (JSON array for choice-based types)<textarea name="options" rows="3" placeholder='[{"id":"opt1","label":"Yes","value":"yes"}]'></textarea></label>
            <div class="checkbox-row">
              <label><input type="checkbox" name="has_text_entry" value="1"> Include text entry field below</label>
            </div>
            <label>Text entry label<input name="text_entry_label" placeholder="e.g., Student sentence"></label>
            <div class="checkbox-row">
              <label><input type="checkbox" name="is_required" value="1" checked> Required</label>
            </div>
            <label>Sort order<input type="number" name="sort_order" value="${template.questions.length}"></label>
            <div class="visibility-row">
              <label>Visible to:</label>
              <label><input type="checkbox" name="visible_to_assessor" value="1" checked> Assessor</label>
              <label><input type="checkbox" name="visible_to_iqa" value="1" checked> IQA</label>
              <label><input type="checkbox" name="visible_to_eqa" value="1" checked> EQA</label>
            </div>
            <button type="submit">Add question</button>
          </form>
        </section>
        
        <section class="panel">
          <h3>Comment Categories</h3>
          <div id="categories-list">
            ${template.commentCategories.map((c, idx) => `
              <div class="category-item">
                <strong>${idx + 1}. ${escapeHtml(c.name)}</strong>
                ${c.description ? `<span>${escapeHtml(c.description)}</span>` : ''}
              </div>
            `).join('') || '<p class="empty">No comment categories yet</p>'}
          </div>
          
          <form method="POST" action="/api/templates/${template.id}/categories" class="stack-form">
            <h4>Add comment category</h4>
            <label>Category name<input name="name" required placeholder="e.g., IQA Actions"></label>
            <label>Description<textarea name="description" rows="2" placeholder="What type of comments go here"></textarea></label>
            <label>Sort order<input type="number" name="sort_order" value="${template.commentCategories.length}"></label>
            <button type="submit">Add category</button>
          </form>
        </section>
      </section>
    </main>
  `);
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
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(title)} | ESOLQA</title><link rel="icon" type="image/png" href="/favicon.png"><style>
    :root{--bg:#eef4ff;--panel:#fff;--text:#14213d;--muted:#637083;--primary:#4f00d8;--primary-dark:#35009a;--border:#d9e2f1;--success:#e9f8ef;--warn:#fff7e6;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}*{box-sizing:border-box}body{margin:0;background:radial-gradient(circle at top left,#dbe9ff,transparent 34rem),var(--bg);color:var(--text);min-height:100vh}a{color:inherit;text-decoration:none}button,.small-action,.primary-action{border:0;border-radius:999px;background:var(--primary);color:#fff;font-weight:800;padding:.8rem 1.1rem;cursor:pointer;display:inline-flex;justify-content:center}.primary-action{width:100%;margin:1rem 0}.small-action{width:auto}.primary-action:hover,button:hover,.small-action:hover{background:var(--primary-dark)}input,select,textarea{width:100%;border:1px solid var(--border);border-radius:.9rem;padding:.75rem;font:inherit}textarea{resize:vertical}.auth-shell{min-height:100vh;display:grid;place-items:center;padding:2rem}.auth-card{width:min(100%,30rem);background:rgba(255,255,255,.92);border:1px solid var(--border);border-radius:2rem;box-shadow:0 1.5rem 5rem rgba(20,33,61,.12);padding:2.5rem;text-align:center}.brand-mark{width:3rem;height:3rem;display:inline-grid;place-items:center;border-radius:1rem;background:linear-gradient(135deg,var(--primary),#7c3aed);color:#fff;font-weight:800}.eyebrow{margin:0 0 .5rem;color:var(--primary);font-size:.75rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase}h1,h2,p{margin-top:0}h1{font-size:clamp(2rem,5vw,3rem);line-height:1;margin-bottom:1rem}.lede,.hint{color:var(--muted);line-height:1.6}.dashboard-shell{display:grid;grid-template-columns:17rem 1fr;min-height:100vh}.sidebar{background:#0f1b33;color:#fff;padding:1.5rem}.sidebar-brand{display:flex;align-items:center;gap:.8rem;margin-bottom:2rem}.sidebar-brand span{display:block;color:#9fb0cc;font-size:.85rem}nav{display:grid;gap:.4rem}nav a{padding:.8rem 1rem;border-radius:.9rem;color:#c8d3e7}nav a:hover,.nav-active{background:rgba(255,255,255,.1);color:#fff}.content{padding:2rem}.topbar{display:flex;align-items:center;justify-content:space-between;gap:1rem;margin-bottom:1.5rem}.profile-pill{background:var(--panel);border:1px solid var(--border);border-radius:999px;padding:.7rem 1rem;color:var(--muted);font-weight:700}.logout-link{color:var(--primary);font-weight:800}.panel{background:var(--panel);border:1px solid var(--border);border-radius:1.5rem;box-shadow:0 1rem 3rem rgba(20,33,61,.08);padding:1.5rem;margin-bottom:1.5rem}.toolbar{display:flex;justify-content:space-between;gap:1rem;align-items:center}.search-form{display:flex;gap:.8rem;flex:1}.actions-row{display:flex;gap:.8rem;align-items:center;flex-wrap:wrap}.grid-two{display:grid;grid-template-columns:1fr 1fr;gap:1rem}.list-stack{display:grid;gap:.8rem}.list-card{display:grid;gap:.35rem;border:1px solid var(--border);border-radius:1rem;padding:1rem}.list-card span,.list-card small{color:var(--muted)}.empty-state{border:1px dashed var(--border);border-radius:1rem;padding:1.5rem;text-align:center;color:var(--muted)}.form-grid{display:grid;grid-template-columns:2fr 1fr 1fr auto;gap:1rem;align-items:end}.stack-form{display:grid;gap:1rem}.narrow-panel{max-width:54rem}.modal-like{margin:auto}.user-table{display:grid;gap:.8rem}.user-row{display:flex;justify-content:space-between;gap:1rem;align-items:center;border-bottom:1px solid var(--border);padding:.8rem 0}.user-row span{display:block;color:var(--muted)}.user-row form{display:flex;gap:.5rem}.meta-panel{display:flex;gap:1rem;flex-wrap:wrap}.checklist-panel{overflow:auto}.checklist-table{width:100%;border-collapse:collapse}.checklist-table th,.checklist-table td{border:1px solid var(--border);padding:.8rem;vertical-align:top}.checklist-table th{background:#f6f8fc;text-align:left}.readonly-cell{min-height:3rem;color:var(--muted);white-space:pre-wrap}.comment-form{display:grid;gap:.8rem;margin-top:1rem}@media(max-width:900px){.dashboard-shell,.grid-two{grid-template-columns:1fr}.toolbar,.topbar,.form-grid{display:grid;grid-template-columns:1fr}.search-form{display:grid}.user-row{display:grid}}
  </style></head><body>${body}</body></html>`;
}

function escapeHtml(value: string) { return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;"); }
