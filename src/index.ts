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
    batch(stmts: any[]): Promise<unknown[]>;
  };
  MICROSOFT_CLIENT_ID?: string;
  MICROSOFT_CLIENT_SECRET?: string;
  MICROSOFT_TENANT_ID?: string;
  SESSION_SECRET: string;
  "LearnerTrack.API"?: string;
  LT_USER_API?: string;
  LT_USER_NAME?: string;
  ASSETS?: { fetch(request: Request): Promise<Response> };
}

type Role = "superuser" | "admin" | "assessor" | "iqa" | "eqa" | "assessor_iqa" | "student";

// ── Student Enrolment (synced from LearnerTrack) ──────────────────────────────
type StudentEnrolment = {
  id: string;
  learner_id: string;
  student_label: string;
  course_code: string;
  course_instance_id: string;
  course_title: string;
  course_type_category: string | null;
  academic_year: number | null;
  learn_start_date: string | null;
  learn_plan_end_date: string | null;
  comp_status: string | null;
  out_grade: string | null;
  created_at: string;
  updated_at: string;
};

// ── Assessment / Tracker Template ────────────────────────────────────────────
type AssessmentTemplate = {
  id: string;
  title: string;
  description: string | null;
  template_type: "quiz" | "tracker";
  category: string;
  max_points: number;
  pass_percentage: number;
  is_active: number;
  created_by: string | null;
  created_at: string;
};

type AssessmentTemplateQuestion = {
  id: string;
  template_id: string;
  question_text: string;
  question_type: string;
  options: string | null;  // JSON
  points: number;
  correct_answer: string | null;
  has_text_entry: number;
  text_entry_label: string | null;
  is_required: number;
  sort_order: number;
};

// ── Assessment Entry (completed quiz submission) ───────────────────────────────
type AssessmentEntry = {
  id: string;
  template_id: string;
  enrolment_id: string;
  learner_id: string;
  course_instance_id: string;
  status: "pending" | "completed";
  score_earned: number;
  max_score: number;
  percentage: number;
  answers_json: string | null;
  completed_at: string | null;
  created_at: string;
};

// ── Student Tracker / ILP ────────────────────────────────────────────────────
type StudentTracker = {
  id: string;
  enrolment_id: string;
  learner_id: string;
  course_instance_id: string;
  tailored_purpose: string | null;
  smart_goals: string | null;
  tailored_outcomes: string | null;
  initial_assessment_level: string | null;
  initial_assessment_rag: "green" | "amber" | "red" | null;
  initial_assessment_notes: string | null;
  initial_assessment_date: string | null;
  initial_assessment_by: string | null;
  term1_grade: string | null;
  term1_rag: "green" | "amber" | "red" | null;
  term1_comments: string | null;
  term1_date: string | null;
  term1_by: string | null;
  term2_grade: string | null;
  term2_rag: "green" | "amber" | "red" | null;
  term2_comments: string | null;
  term2_date: string | null;
  term2_by: string | null;
  term3_grade: string | null;
  term3_rag: "green" | "amber" | "red" | null;
  term3_comments: string | null;
  term3_date: string | null;
  term3_by: string | null;
  destination_type: string | null;
  destination_notes: string | null;
  destination_date: string | null;
  destination_by: string | null;
  course_learning_objectives: string | null;
  clos_achieved_rag: "green" | "amber" | "red" | "na" | null;
  created_at: string;
  updated_at: string;
};

// ── Assessment / Tracker Comment ─────────────────────────────────────────────
type AssessmentComment = {
  id: string;
  entity_type: "assessment_entry" | "tracker";
  entity_id: string;
  author_id: string | null;
  author_email: string;
  author_name: string;
  author_role: string;
  comment: string;
  created_at: string;
};
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
  academic_year: number;
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

type IQAFTemplateRecord = {
  id: string;
  title: string;
  description: string | null;
  is_active: number;
  created_by: string | null;
  created_at: string;
};

type IQAFTemplateQuestion = {
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

type IQAFTemplateWithQuestions = IQAFTemplateRecord & {
  questions: IQAFTemplateQuestion[];
};

type IQAFEntryStatus = "pending" | "assessor_submitted" | "iqa_reviewed" | "eqa_signed" | "complete";

type IQAFEntryRecord = {
  id: string;
  template_id: string;
  template_title: string;
  course_id: string;
  course_name: string;
  assessor_name: string;
  iqa_name: string;
  planned_date: string;
  due_date: string | null;
  status: IQAFEntryStatus;
  allocated_assessor_id: string | null;
  allocated_iqa_id: string | null;
  allocated_eqa_id: string | null;
  assessor_email: string | null;
  iqa_email: string | null;
  eqa_email: string | null;
  created_by: string | null;
  created_at: string;
  assessor_submitted_at: string | null;
  iqa_reviewed_at: string | null;
  eqa_signed_at: string | null;
  academic_year: number;
};

type IQAFComment = {
  id: string;
  entry_id: string;
  author_id: string | null;
  author_role: "assessor" | "iqa" | "eqa" | "admin" | "superuser";
  comment: string;
  created_at: string;
  author_email: string | null;
};

type IQAFAnswer = {
  question_id: string;
  answer: string | null;
};

type LearnerTrackCourse = {
  ID: number;
  ApiReturnMessage?: string | null;
  CourseCode: string | null;
  CatID?: number | null;
  CatLabel?: string | null;
  CatDescription?: string | null;
  CoOrdinatorBy?: number | null;
  OptionGroupID?: number | null;
  OptionGroup?: string | null;
  ProviderID?: number | null;
  ProviderLabel?: string | null;
  CourseLevelID?: number | null;
  CourseTitle: string | null;
  CourseShortDescription?: string | null;
  CourseInstanceStopPress?: string | null;
  CourseSeriesDescription?: string | null;
  LocationID?: number | null;
  LocationName?: string | null;
  LocationLabel?: string | null;
  VenueID?: number | null;
  VenueName?: string | null;
  TutorID?: number | null;
  TutorName?: string | null;
  Tutor?: string | null;
  AcademicYear?: number | null;
  Times?: string | null;
  StartDate?: string | null;
  EndDate?: string | null;
  StartTime?: string | null;
  EndTime?: string | null;
  DayOfWeek?: string | null;
  DurationInWeeks?: number | null;
  NumberOfSessions?: number | null;
  HoursPerSession?: number | null;
  TotalHours?: number | null;
  NumberOfPlaces?: number | null;
  PlacesAvailable?: number | null;
  Full?: number | null;
  CourseFee?: number | null;
  ConcessionFee?: number | null;
  MinimumAge?: number | null;
  MaximumAge?: number | null;
  Gender?: string | null;
  WebSite?: string | null;
  ImageFile?: string | null;
  ImageFileURL?: string | null;
  Active?: number | null;
  Deleted?: number | null;
  Notes?: string | null;
  AddedBy?: number | null;
  AddedByName?: string | null;
  AddedDate?: string | null;
  ModifiedBy?: number | null;
  ModifiedByName?: string | null;
  ModifiedDate?: string | null;
  EOEID?: number | null;
  EOECode?: string | null;
  EOEName?: string | null;
  EOEProviderRef?: string | null;
  [key: string]: unknown;
};

type LearnerTrackEnrolment = {
  CourseCode: string | null;
  LearnerID: number;
  StudentLabel: string | null;
  CourseTitle: string | null;
  HasAttended: number | null;
  WithdrawReason: number | null;
  CourseTypeCategory: string | null;
  LearnStartDate: string | null;
  LearnActEndDate: string | null;
  Times: string | null;
  Weeks: number | null;
  CourseStatus: string | null;
  AcademicYear: number | null;
  [key: string]: unknown;
};

type IQAFNotification = {
  id: string;
  user_id: string;
  entry_id: string | null;
  message: string;
  is_read: number;
  created_at: string;
};

type QualityCalendarEvent = {
  id: string;
  title: string;
  description: string | null;
  type: "banner" | "single";
  start_date: string;
  end_date: string;
  include_weekends: number;
  parent_banner_id: string | null;
  color_hex: string;
  created_by: string | null;
  created_at: string;
};

const htmlHeaders = { "content-type": "text/html; charset=utf-8" };
const jsonHeaders = { "content-type": "application/json; charset=utf-8" };
const oauthStateCookie = "hlquality_oauth_state";
const sessionCookie = "hlquality_session";
const roles: Role[] = ["superuser", "admin", "assessor", "iqa", "eqa", "assessor_iqa"];

function getCurrentAcademicYear(date = new Date()): number {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return month >= 9 ? year : year - 1;
}
function canViewReports(user: UserRecord): boolean {
  return user.role === "admin" || user.role === "superuser";
}
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

    if (url.pathname === "/dashboard") return Response.redirect(`${url.origin}/${identity.user.role === "student" ? "assessments" : "learning-walks"}`, 302);
    if (url.pathname === "/users") return renderUsersPage(request, env, identity);


    if (url.pathname === "/courses") return renderCoursesPageHandler(request, env, identity);
    if (url.pathname === "/api/courses/learnertrack" && request.method === "GET") return fetchLearnerTrackCourses(request, env, identity);
    if (url.pathname === "/my-class") return renderMyClassPageHandler(request, env, identity);
    if (url.pathname === "/api/enrolment" && request.method === "GET") return fetchLearnerTrackEnrolment(request, env, identity);
    if (url.pathname === "/students") return renderStudentsPageHandler(request, env, identity);
    if (url.pathname === "/api/enrolment/student" && request.method === "GET") return fetchStudentEnrolments(request, env, identity);

    if (url.pathname === "/assessments") return renderAssessmentsPageHandler(request, env, identity);
    if (url.pathname === "/tracker") return renderTrackerPageHandler(request, env, identity);

    // Assessment Templates API
    if (url.pathname === "/api/assessment/templates" && request.method === "GET") return listAssessmentTemplates(request, env, identity);
    if (url.pathname === "/api/assessment/templates" && request.method === "POST") return saveAssessmentTemplate(request, env, identity);
    if (url.pathname.match(/^\/api\/assessment\/templates\/[^/]+$/) && request.method === "POST") return updateAssessmentTemplate(request, env, identity, url.pathname.split("/")[4]);
    if (url.pathname.match(/^\/api\/assessment\/templates\/[^/]+\/delete$/) && request.method === "POST") return deleteAssessmentTemplate(request, env, identity, url.pathname.split("/")[4]);

    // Assessment Enrolments / Sync
    if (url.pathname === "/api/assessment/sync" && request.method === "POST") return syncClassEnrolmentsHandler(request, env, identity);
    if (url.pathname === "/api/assessment/enrolments" && request.method === "GET") return listEnrolments(request, env, identity);

    // Assessment Entries API
    if (url.pathname === "/api/assessment/entries" && request.method === "POST") return submitAssessmentEntry(request, env, identity);
    if (url.pathname === "/api/assessment/entries" && request.method === "GET") return listAssessmentEntries(request, env, identity);

    // Tracker API
    if (url.pathname === "/api/tracker/record" && request.method === "POST") return saveTrackerRecord(request, env, identity);
    if (url.pathname === "/api/tracker/batch" && request.method === "POST") return saveTrackerBatch(request, env, identity);
    if (url.pathname.match(/^\/api\/tracker\/[^/]+$/) && request.method === "GET") return getTrackerRecord(request, env, identity, url.pathname.split("/")[3]);

    // Comments API (shared between entries and tracker)
    if (url.pathname.match(/^\/api\/assessment\/comments\/[^/]+$/) && request.method === "POST") return addAssessmentComment(request, env, identity, url.pathname.split("/")[4]);
    if (url.pathname.match(/^\/api\/assessment\/comments\/[^/]+$/) && request.method === "GET") return listAssessmentComments(request, env, identity, url.pathname.split("/")[4]);


    if (url.pathname === "/reports") return renderReportsPage(request, env, identity);
    if (url.pathname === "/quality-calendar" && canViewReports(identity.user!)) return renderQualityCalendarPage(identity);

    if (url.pathname === "/api/me") return json(identity);
    if (url.pathname === "/api/users" && request.method === "POST") return createUser(request, env, identity);
    if (url.pathname === "/api/users/import" && request.method === "POST") return importUsers(request, env, identity);
    if (url.pathname === "/api/users/update" && request.method === "POST") return updateUser(request, env, identity);
    if (url.pathname.match(/^\/api\/users\/[^/]+\/delete$/) && request.method === "POST") return deleteUser(request, env, identity, url.pathname.split("/")[3]);

    // IQA Forms
    if (url.pathname === "/iqa-forms") return renderIQAFDashboard(request, env, identity);
    if (url.pathname === "/iqa-forms/templates/build" || url.pathname.match(/^\/iqa-forms\/templates\/[^/]+\/build$/)) return renderIQAFTemplateBuilder(request, env, identity);
    if (url.pathname === "/iqa-forms/entries/new") return renderIQAFEntryTemplateSelector(request, env, identity);
    if (url.pathname === "/iqa-forms/entries/create") return renderIQAFEntryForm(request, env, identity);
    if (url.pathname.match(/^\/iqa-forms\/entries\/[^/]+$/)) return renderIQAFEntryView(request, env, identity, url.pathname.split("/")[3]);
    if (url.pathname === "/api/iqaf/entries" && request.method === "POST") return saveIQAFEntry(request, env, identity);
    if (url.pathname.match(/^\/api\/iqaf\/entries\/[^/]+\/comments$/) && request.method === "POST") return addIQAFEntryComment(request, env, identity, url.pathname.split("/")[4]);
    if (url.pathname.match(/^\/api\/iqaf\/entries\/[^/]+\/update$/) && request.method === "POST") return updateIQAFEntry(request, env, identity, url.pathname.split("/")[4]);
    if (url.pathname.match(/^\/api\/iqaf\/entries\/[^/]+\/complete$/) && request.method === "POST") return completeIQAFEntry(request, env, identity, url.pathname.split("/")[4]);
    if (url.pathname.match(/^\/api\/iqaf\/entries\/[^/]+\/delete$/) && request.method === "POST") return deleteIQAFEntry(request, env, identity, url.pathname.split("/")[4]);
    if (url.pathname.match(/^\/api\/iqaf\/entries\/[^/]+\/download$/) && request.method === "GET") return downloadIQAFEntry(request, env, identity, url.pathname.split("/")[4]);
    if (url.pathname === "/api/iqaf/templates" && request.method === "POST") return saveIQAFTemplate(request, env, identity);
    if (url.pathname.match(/^\/api\/iqaf\/templates\/[^/]+$/) && request.method === "POST") return updateIQAFTemplate(request, env, identity, url.pathname.split("/")[4]);
    if (url.pathname.match(/^\/api\/iqaf\/templates\/[^/]+\/delete$/) && request.method === "POST") return deleteIQAFTemplate(request, env, identity, url.pathname.split("/")[4]);

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

    // Learning Walk Entry Download API
    if (url.pathname.match(/^\/api\/lw\/entries\/[^/]+\/download$/) && request.method === "GET") {
      return downloadLWEntry(request, env, identity, url.pathname.split("/")[4]);
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

    // Quality Calendar APIs
    if (url.pathname === "/api/calendar/events" && request.method === "GET") return getCalendarEvents(request, env, identity);
    if (url.pathname === "/api/calendar/events" && request.method === "POST") return createCalendarEvent(request, env, identity);
    if (url.pathname.match(/^\/api\/calendar\/events\/[^/]+$/) && request.method === "PUT") return updateCalendarEvent(request, env, identity, url.pathname.split("/")[4]);
    if (url.pathname.match(/^\/api\/calendar\/events\/[^/]+$/) && request.method === "DELETE") return deleteCalendarEvent(request, env, identity, url.pathname.split("/")[4]);
    if (url.pathname === "/api/calendar/import-csv" && request.method === "POST") return importCalendarCSV(request, env, identity);
    if (url.pathname === "/api/calendar/export-csv" && request.method === "GET") return exportCalendarCSV(request, env, identity);

    return htmlResponse(renderNotFoundPage(), 404);
  },
};

async function renderUsersPage(request: Request, env: Env, identity: Identity): Promise<Response> {
  if (!isSuperuser(identity.user!)) return htmlResponse(renderForbiddenPage(identity), 403);
  const users = await env.esol_marking_db.prepare("SELECT id, email, role, stage, created_at FROM users ORDER BY created_at DESC, email ASC").all<UserRecord>();

  // Parse import result from query params
  const url = new URL(request.url);
  const importStatus = url.searchParams.get("import");
  const importResult = importStatus
    ? {
        status: importStatus,
        summary: url.searchParams.get("summary") ?? "",
        details: url.searchParams.get("details") ?? undefined
      }
    : undefined;

  return htmlResponse(renderUsers(identity, users.results, importResult));
}

async function fetchLearnerTrackCourses(request: Request, env: Env, identity: Identity): Promise<Response> {
  const apiKey = env.LT_USER_API || env["LearnerTrack.API"];
  if (!apiKey) return json({ error: "LearnerTrack API key not configured" }, 500);
  const url = new URL(request.url);
  const academicYear = url.searchParams.get("academicYear")?.trim();
  const courseInstanceId = url.searchParams.get("courseinstanceid")?.trim();
  const username = env.LT_USER_NAME ?? "GiuseppeA";
  let apiUrl = `https://api.learnertrack.net/api/CourseInstance?api_key=${encodeURIComponent(apiKey)}&username=${encodeURIComponent(username)}`;
  if (academicYear) apiUrl += `&academicYear=${encodeURIComponent(academicYear)}`;
  if (courseInstanceId) apiUrl += `&courseinstanceid=${encodeURIComponent(courseInstanceId)}`;
  try {
    const cache = (caches as any).default;
    const cacheKey = new Request(apiUrl);
    let r = await cache.match(cacheKey);
    if (!r) {
      r = await fetch(apiUrl, { headers: { "Accept": "application/json" } });
      if (r.ok) {
        const cacheRes = new Response(r.clone().body, r);
        cacheRes.headers.set('Cache-Control', 's-maxage=600');
        await cache.put(cacheKey, cacheRes);
      }
    }
    if (!r.ok) return json({ error: `LearnerTrack API returned ${r.status}` }, r.status);
    const data = await r.json() as LearnerTrackCourse[] | { error?: string };
    if (Array.isArray(data)) return json(data);
    return json(data, 200);
  } catch (err: any) {
    return json({ error: "Failed to fetch courses: " + (err?.message || String(err)) }, 500);
  }
}

async function renderCoursesPageHandler(request: Request, env: Env, identity: Identity): Promise<Response> {
  const r = await fetchLearnerTrackCourses(request, env, identity);
  const courses = await r.json() as { error?: string } | LearnerTrackCourse[];
  if ("error" in courses && courses.error) return htmlResponse(renderCoursesPage(identity, [], String(courses.error)), 500);
  return htmlResponse(renderCoursesPage(identity, Array.isArray(courses) ? courses : [], null));
}

async function fetchLearnerTrackEnrolment(request: Request, env: Env, identity: Identity): Promise<Response> {
  const apiKey = env.LT_USER_API || env["LearnerTrack.API"];
  if (!apiKey) return json({ error: "LearnerTrack API key not configured" }, 500);
  const url = new URL(request.url);
  const courseInstanceId = url.searchParams.get("courseinstanceid")?.trim();
  if (!courseInstanceId) return json({ error: "courseinstanceid is required" }, 400);
  const username = env.LT_USER_NAME ?? "GiuseppeA";
  const apiUrl = `https://betaapi.learnertrack.net/api/Enrolment?api_key=${encodeURIComponent(apiKey)}&username=${encodeURIComponent(username)}&courseinstanceid=${encodeURIComponent(courseInstanceId)}`;
  try {
    const cache = (caches as any).default;
    const cacheKey = new Request(apiUrl);
    let r = await cache.match(cacheKey);
    if (!r) {
      r = await fetch(apiUrl, { headers: { "Accept": "application/json" } });
      if (r.ok) {
        const cacheRes = new Response(r.clone().body, r);
        cacheRes.headers.set('Cache-Control', 's-maxage=600');
        await cache.put(cacheKey, cacheRes);
      }
    }
    if (!r.ok) return json({ error: `LearnerTrack API returned ${r.status}` }, r.status);
    const data = await r.json() as LearnerTrackEnrolment[] | { error?: string };
    if (Array.isArray(data)) return json(data);
    return json(data, 200);
  } catch (err: any) {
    return json({ error: "Failed to fetch enrolment: " + (err?.message || String(err)) }, 500);
  }
}

async function renderMyClassPageHandler(request: Request, env: Env, identity: Identity): Promise<Response> {
  const url = new URL(request.url);
  const courseInstanceId = url.searchParams.get("courseId")?.trim() ?? "";
  let enrolments: LearnerTrackEnrolment[] = [];
  let error: string | null = null;
  let courseTitle = "";
  if (courseInstanceId) {
    const r = await fetchLearnerTrackEnrolment(new Request(`${url.origin}/api/enrolment?courseinstanceid=${encodeURIComponent(courseInstanceId)}`), env, identity);
    const data = await r.json() as { error?: string } | LearnerTrackEnrolment[];
    if ("error" in data && data.error) error = String(data.error);
    else if (Array.isArray(data)) { enrolments = data; if (data.length) courseTitle = data[0].CourseTitle ?? ""; }
  }
  return htmlResponse(renderMyClassPage(identity, courseInstanceId, courseTitle, enrolments, error));
}

function renderCoursesPage(identity: Identity, courses: LearnerTrackCourse[], error: string | null): string {
  const header = [
    "ID", "Course Code", "Course Title", "Times", "Tutor", 
    "Academic Year", "Start Term", "Weeks", "Category", 
    "Option Group", "Location", "Available Places"
  ];
  const tutors = [...new Set(courses.map(c => c.Tutor || c.TutorName || "").filter(Boolean))].sort();
  const years = [...new Set(courses.map(c => c.AcademicYear != null ? String(c.AcademicYear) : "").filter(Boolean))].sort();
  const rows = courses.map(c => {
    const tutor = c.Tutor || c.TutorName || "";
    const year = c.AcademicYear != null ? String(c.AcademicYear) : "";
    return [
      String(c.ID ?? ""),
      c.CourseCode ?? "",
      c.CourseTitle ?? "",
      c.Times ?? "",
      tutor,
      year,
      c.StartTerm ?? "",
      c.Weeks != null ? String(c.Weeks) : (c.DurationInWeeks != null ? String(c.DurationInWeeks) : ""),
      c.CatLabel ?? "",
      c.OptionGroup ?? "",
      c.LocationLabel || c.LocationName || "",
      c.AvailablePlaces != null ? String(c.AvailablePlaces) : ""
    ];
  });
  const tableBody = rows.map((row, i) => `<tr data-year="${escapeHtml(String(row[5]))}" data-tutor="${escapeHtml(String(row[4]))}">${row.map(cell => `<td>${escapeHtml(String(cell))}</td>`).join("")}</tr>`).join("");
  const tableHead = `<thead><tr>${header.map(h => `<th>${escapeHtml(h)}</th>`).join("")}</tr></thead>`;
  const yearFilter = `<select id="filter-year" class="lw-entry-select"><option value="">All years</option>${years.map(y => `<option value="${escapeHtml(y)}">${escapeHtml(y)}</option>`).join("")}</select>`;
  const tutorFilter = `<select id="filter-tutor" class="lw-entry-select"><option value="">All tutors</option>${tutors.map(t => `<option value="${escapeHtml(t)}">${escapeHtml(t)}</option>`).join("")}</select>`;
  return pageShell("Our Courses", `
    <main class="dashboard-shell">
      ${renderSidebar(identity, "courses")}
      <section class="content">
        <header class="topbar"><div><p class="eyebrow">Learner Track</p><h1>Our Courses</h1></div><div class="profile-pill">${escapeHtml(identity.email)}</div><a class="logout-link" href="/logout">Sign out</a></header>
        <section class="panel">
          <div class="section-header"><p class="eyebrow">${courses.length} courses</p><form class="courses-filters" onsubmit="return false;"><label>Academic Year ${yearFilter}</label><label>Tutor ${tutorFilter}</label><button type="button" class="small-action" onclick="resetFilters()">Reset</button></form></div>
          ${error ? `<div class="alert alert-error">${escapeHtml(error)}</div>` : ""}
          <div class="courses-table-wrap">
            <table class="courses-table" id="courses-table">
              ${tableHead}
              <tbody>${tableBody || `<tr><td colspan="${header.length}" class="empty-cell">No courses available</td></tr>`}</tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
    <script>
      function applyFilters(){
        const y=document.getElementById('filter-year').value,t=document.getElementById('filter-tutor').value,rows=document.querySelectorAll('#courses-table tbody tr');
        let n=0;rows.forEach(r=>{const ry=r.dataset.year||'',rt=r.dataset.tutor||'';const show=(!y||ry===y)&&(!t||rt===t);r.style.display=show?'':'none';if(show)n++;});
        document.querySelector('.section-header .eyebrow').textContent=n+' courses';
      }
      function resetFilters(){document.getElementById('filter-year').value='';document.getElementById('filter-tutor').value='';applyFilters();}
      document.getElementById('filter-year').addEventListener('change',applyFilters);
      document.getElementById('filter-tutor').addEventListener('change',applyFilters);
      
      (function(){
        const d = new Date();
        const currentYear = d.getMonth() >= 7 ? d.getFullYear() : d.getFullYear() - 1;
        const yearSelect = document.getElementById('filter-year');
        if (yearSelect && Array.from(yearSelect.options).some(o => o.value === String(currentYear))) {
          yearSelect.value = String(currentYear);
          applyFilters();
        }
      })();
    </script>
  `);
}

function renderMyClassPage(identity: Identity, courseInstanceId: string, courseTitle: string, enrolments: LearnerTrackEnrolment[], error: string | null): string {
  const header = ["Learner ID", "Student", "Course Code", "Course Title", "Attended", "Withdraw Reason", "Category", "Start Date", "End Date", "Times", "Weeks", "Status", "Academic Year"];
  const rows = enrolments.map(e => {
    const attended = e.HasAttended != null ? Math.round(e.HasAttended * 100) + "%" : "";
    const withdraw = e.WithdrawReason != null && e.WithdrawReason !== 0 ? String(e.WithdrawReason) : "";
    return [
      String(e.LearnerID ?? ""),
      e.StudentLabel ?? "",
      e.CourseCode ?? "",
      e.CourseTitle ?? "",
      attended,
      withdraw,
      e.CourseTypeCategory ?? "",
      e.LearnStartDate ?? "",
      e.LearnActEndDate ?? "",
      e.Times ?? "",
      e.Weeks != null ? String(e.Weeks) : "",
      e.CourseStatus ?? "",
      e.AcademicYear != null ? String(e.AcademicYear) : ""
    ];
  });
  const total = enrolments.length;
  const withdrawn = enrolments.filter(e => e.WithdrawReason != null && e.WithdrawReason !== 0).length;
  const active = total - withdrawn;
  const activeEnrolments = enrolments.filter(e => e.WithdrawReason == null || e.WithdrawReason === 0);
  const avgAttendanceNum = active > 0 && activeEnrolments.every(e => e.HasAttended != null)
    ? Math.round((activeEnrolments.reduce((sum, e) => sum + (e.HasAttended ?? 0), 0) / active) * 100)
    : -1;
  const avgAttendance = avgAttendanceNum >= 0 ? avgAttendanceNum + "%" : "N/A";
  const tableBody = rows.map(row => `<tr>${row.map(cell => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("");
  const tableHead = `<thead><tr>${header.map(h => `<th>${escapeHtml(h)}</th>`).join("")}</tr></thead>`;
  const pieChart = avgAttendanceNum >= 0 ? `
    <div class="pie-chart-wrap">
      <svg viewBox="0 0 200 200" width="200" height="200" class="pie-chart">
        <circle cx="100" cy="100" r="90" fill="none" stroke="#e2e8f0" stroke-width="20"/>
        <circle cx="100" cy="100" r="90" fill="none" stroke="var(--primary)" stroke-width="20"
          stroke-dasharray="${(avgAttendanceNum / 100 * 2 * Math.PI * 90).toFixed(1)} ${(2 * Math.PI * 90).toFixed(1)}"
          stroke-dashoffset="0" stroke-linecap="round" transform="rotate(-90 100 100)"/>
        <text x="100" y="108" text-anchor="middle" font-size="28" font-weight="700" fill="var(--text)">${avgAttendanceNum}%</text>
      </svg>
      <span class="pie-chart-label">Avg Attendance (active students)</span>
    </div>` : "";
  return pageShell("My Class", `
    <main class="dashboard-shell">
      ${renderSidebar(identity, "my-class")}
      <section class="content">
        <header class="topbar"><div><p class="eyebrow">Learner Track</p><h1>My Class</h1></div><div class="profile-pill">${escapeHtml(identity.email)}</div><a class="logout-link" href="/logout">Sign out</a></header>
        <section class="panel">
          <div class="section-header"><p class="eyebrow">Class enrolments</p></div>
          <form method="GET" action="/my-class" class="my-class-search">
            <label for="courseId">Course ID</label>
            <input type="text" id="courseId" name="courseId" value="${escapeHtml(courseInstanceId)}" class="lw-entry-input" placeholder="e.g. 10511" required>
            <button type="submit" class="primary-action">Load class</button>
          </form>
          ${error ? `<div class="alert alert-error">${escapeHtml(error)}</div>` : ""}
          ${courseInstanceId ? `
            <div class="my-class-stats">
              <div class="stat-card"><span class="stat-label">Course ID</span><span class="stat-value">${escapeHtml(courseInstanceId)}</span></div>
              <div class="stat-card"><span class="stat-label">Course Title</span><span class="stat-value">${escapeHtml(courseTitle)}</span></div>
              <div class="stat-card"><span class="stat-label">Total Students</span><span class="stat-value">${total}</span></div>
              <div class="stat-card"><span class="stat-label">Withdrawn</span><span class="stat-value">${withdrawn}</span></div>
              <div class="stat-card"><span class="stat-label">Active Students</span><span class="stat-value">${active}</span></div>
              <div class="stat-card"><span class="stat-label">Avg Attendance (active)</span><span class="stat-value">${avgAttendance}</span></div>
            </div>
            ${pieChart}
            <div class="courses-table-wrap">
              <table class="courses-table" id="enrolment-table">
                ${tableHead}
                <tbody>${tableBody || `<tr><td colspan="${header.length}" class="empty-cell">No enrolments found</td></tr>`}</tbody>
              </table>
            </div>
          ` : ""}
        </section>
      </section>
    </main>
  `);
}

async function fetchStudentEnrolments(request: Request, env: Env, identity: Identity): Promise<Response> {
  const apiKey = env.LT_USER_API || env["LearnerTrack.API"];
  if (!apiKey) return json({ error: "LearnerTrack API key not configured" }, 500);
  const url = new URL(request.url);
  const learnerId = url.searchParams.get("learnerid")?.trim();
  if (!learnerId) return json({ error: "learnerid is required" }, 400);
  const username = env.LT_USER_NAME ?? "GiuseppeA";
  const apiUrl = `https://betaapi.learnertrack.net/api/Enrolment?api_key=${encodeURIComponent(apiKey)}&username=${encodeURIComponent(username)}&learnerid=${encodeURIComponent(learnerId)}`;
  try {
    const cache = (caches as any).default;
    const cacheKey = new Request(apiUrl);
    let r = await cache.match(cacheKey);
    if (!r) {
      r = await fetch(apiUrl, { headers: { "Accept": "application/json" } });
      if (r.ok) {
        const cacheRes = new Response(r.clone().body, r);
        cacheRes.headers.set('Cache-Control', 's-maxage=600');
        await cache.put(cacheKey, cacheRes);
      }
    }
    if (!r.ok) return json({ error: `LearnerTrack API returned ${r.status}` }, r.status);
    const data = await r.json() as LearnerTrackEnrolment[] | { error?: string };
    if (Array.isArray(data)) return json(data);
    return json(data, 200);
  } catch (err: any) {
    return json({ error: "Failed to fetch student enrolments: " + (err?.message || String(err)) }, 500);
  }
}

async function renderStudentsPageHandler(request: Request, env: Env, identity: Identity): Promise<Response> {
  const url = new URL(request.url);
  const learnerId = url.searchParams.get("learnerId")?.trim() ?? "";
  let enrolments: LearnerTrackEnrolment[] = [];
  let error: string | null = null;
  if (learnerId) {
    const r = await fetchStudentEnrolments(new Request(`${url.origin}/api/enrolment/student?learnerid=${encodeURIComponent(learnerId)}`), env, identity);
    const data = await r.json() as { error?: string } | LearnerTrackEnrolment[];
    if ("error" in data && data.error) error = String(data.error);
    else if (Array.isArray(data)) enrolments = data;
  }
  return htmlResponse(renderStudentsPage(identity, learnerId, enrolments, error));
}

function renderStudentsPage(identity: Identity, learnerId: string, enrolments: LearnerTrackEnrolment[], error: string | null): string {
  const first = enrolments.length > 0 ? enrolments[0] : null;
  const studentInfo = first ? [
    ["Learner ID", String(first.LearnerID ?? "")],
    ["Student Name", first.StudentLabel ?? ""],
    ["Academic Year", first.AcademicYear != null ? String(first.AcademicYear) : ""],
  ] : [];
  const studentInfoHtml = studentInfo.length ? `
    <div class="student-profile-card">
      <div class="student-avatar">${escapeHtml((first?.StudentLabel ?? "?").charAt(0).toUpperCase())}</div>
      <div class="student-profile-details">
        <h2 class="student-name">${escapeHtml(first?.StudentLabel ?? "")}</h2>
        <div class="student-meta">
          <span class="student-meta-item"><strong>Learner ID:</strong> ${escapeHtml(String(first?.LearnerID ?? ""))}</span>
          <span class="student-meta-item"><strong>Academic Year:</strong> ${escapeHtml(first?.AcademicYear != null ? String(first.AcademicYear) : "N/A")}</span>
        </div>
      </div>
    </div>` : "";
  const enrolHeader = ["Course Code", "Course Title", "Category", "Attended", "Withdraw Reason", "Start Date", "End Date", "Times", "Weeks", "Status"];
  const enrolRows = enrolments.map(e => [
    e.CourseCode ?? "",
    e.CourseTitle ?? "",
    e.CourseTypeCategory ?? "",
    e.HasAttended != null ? Math.round(e.HasAttended * 100) + "%" : "",
    e.WithdrawReason != null && e.WithdrawReason !== 0 ? String(e.WithdrawReason) : "0",
    e.LearnStartDate ?? "",
    e.LearnActEndDate ?? "",
    e.Times ?? "",
    e.Weeks != null ? String(e.Weeks) : "",
    e.CourseStatus ?? ""
  ]);
  const enrolTHead = `<thead><tr>${enrolHeader.map(h => `<th>${escapeHtml(h)}</th>`).join("")}</tr></thead>`;
  const enrolTBody = enrolRows.map(row => `<tr>${row.map(cell => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("");
  return pageShell("Students", `
    <main class="dashboard-shell">
      ${renderSidebar(identity, "students")}
      <section class="content">
        <header class="topbar"><div><p class="eyebrow">Learner Track</p><h1>Students</h1></div><div class="profile-pill">${escapeHtml(identity.email)}</div><a class="logout-link" href="/logout">Sign out</a></header>
        <section class="panel">
          <div class="section-header"><p class="eyebrow">Student lookup</p></div>
          <form method="GET" action="/students" class="my-class-search">
            <label for="learnerId">Learner ID</label>
            <input type="text" id="learnerId" name="learnerId" value="${escapeHtml(learnerId)}" class="lw-entry-input" placeholder="e.g. 43123" required>
            <button type="submit" class="primary-action">Search student</button>
          </form>
          ${error ? `<div class="alert alert-error">${escapeHtml(error)}</div>` : ""}
          ${learnerId && !error ? `
            ${studentInfoHtml}
            ${enrolments.length > 0 ? `
              <div class="section-header" style="margin-top:1.5rem"><p class="eyebrow">${enrolments.length} enrolment${enrolments.length !== 1 ? "s" : ""}</p></div>
              <div class="courses-table-wrap">
                <table class="courses-table">
                  ${enrolTHead}
                  <tbody>${enrolTBody}</tbody>
                </table>
              </div>
            ` : `<div class="alert alert-error">No enrolments found for this learner ID.</div>`}
          ` : ""}
        </section>
      </section>
    </main>
  `);
}

function buildReportUrl(url: URL, changes: Record<string, string>): string {
  const u = new URL(url);
  for (const [key, value] of Object.entries(changes)) {
    if (value === "") u.searchParams.delete(key);
    else u.searchParams.set(key, value);
  }
  return u.pathname + "?" + u.searchParams.toString();
}

function formatReportDate(d: string): string {
  if (!d) return "";
  const [y, m, day] = d.split("-");
  if (!y || !m || !day) return d;
  return `${day}/${m}/${y}`;
}

function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function formatDisplayDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}

function escapeCSV(value: string): string {
  const s = String(value ?? "").replaceAll('"', '""');
  if (s.includes(",") || s.includes('"') || s.includes("\n") || s.includes("\r")) return `"${s}"`;
  return s;
}

function calendarAccessAllowed(user: UserRecord): boolean {
  return user.role === "admin" || user.role === "superuser";
}
function calendarEventEditable(user: UserRecord, event: QualityCalendarEvent | null): boolean {
  if (!event) return true;
  if (user.role === "superuser") return true;
  if (user.role === "admin") return event.created_by === user.id;
  return false;
}

async function getCalendarEvents(request: Request, env: Env, identity: Identity): Promise<Response> {
  if (!calendarAccessAllowed(identity.user!)) return json({ error: "Forbidden" }, 403);
  const url = new URL(request.url);
  const startDate = url.searchParams.get("startDate") || formatISODate(getStartOfWeek(new Date()));
  const endDate = url.searchParams.get("endDate") || formatISODate(addDays(getStartOfWeek(new Date()), 6));
  const events = await env.esol_marking_db
    .prepare("SELECT * FROM quality_calendar_events WHERE start_date <= ? AND end_date >= ? ORDER BY start_date ASC, type ASC, created_at ASC")
    .bind(endDate, startDate)
    .all<QualityCalendarEvent>();
  return json({ events: events.results ?? [] });
}

async function createCalendarEvent(request: Request, env: Env, identity: Identity): Promise<Response> {
  if (!calendarAccessAllowed(identity.user!)) return json({ error: "Forbidden" }, 403);
  try {
    const body = await request.json() as {
      title: string;
      description?: string;
      type: "banner" | "single";
      start_date: string;
      end_date: string;
      include_weekends?: boolean;
      parent_banner_id?: string;
      color_hex?: string;
      sub_events?: { title: string; description?: string; start_date: string; end_date: string }[];
    };
    if (!body.title?.trim()) return json({ error: "Title is required" }, 400);
    if (!body.start_date || !body.end_date) return json({ error: "Start and end dates are required" }, 400);
    if (body.end_date < body.start_date) return json({ error: "End date cannot be before start date" }, 400);

    const userId = identity.user!.id;
    const bannerId = crypto.randomUUID();
    await env.esol_marking_db
      .prepare(
        "INSERT INTO quality_calendar_events (id, title, description, type, start_date, end_date, include_weekends, parent_banner_id, color_hex, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
      )
      .bind(
        bannerId,
        body.title.trim(),
        body.description?.trim() || null,
        body.type,
        body.start_date,
        body.end_date,
        body.include_weekends ? 1 : 0,
        body.parent_banner_id || null,
        body.color_hex?.trim() || "#00C4DF",
        userId
      )
      .run();

    if (body.type === "banner" && body.sub_events) {
      for (const sub of body.sub_events) {
        if (!sub.title?.trim() || !sub.start_date || !sub.end_date) continue;
        await env.esol_marking_db
          .prepare(
            "INSERT INTO quality_calendar_events (id, title, description, type, start_date, end_date, include_weekends, parent_banner_id, color_hex, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
          )
          .bind(
            crypto.randomUUID(),
            sub.title.trim(),
            sub.description?.trim() || null,
            "single",
            sub.start_date,
            sub.end_date,
            body.include_weekends ? 1 : 0,
            bannerId,
            body.color_hex?.trim() || "#00C4DF",
            userId
          )
          .run();
      }
    }

    return json({ success: true, id: bannerId });
  } catch (err: any) {
    return json({ error: "Failed: " + (err?.message || String(err)) }, 500);
  }
}

async function updateCalendarEvent(request: Request, env: Env, identity: Identity, eventId: string): Promise<Response> {
  if (!calendarAccessAllowed(identity.user!)) return json({ error: "Forbidden" }, 403);
  try {
    const existing = await env.esol_marking_db.prepare("SELECT * FROM quality_calendar_events WHERE id = ?").bind(eventId).first<QualityCalendarEvent>();
    if (!existing) return json({ error: "Not found" }, 404);
    if (!calendarEventEditable(identity.user!, existing)) return json({ error: "You can only edit your own events" }, 403);

    const body = await request.json() as {
      title: string;
      description?: string;
      type: "banner" | "single";
      start_date: string;
      end_date: string;
      include_weekends?: boolean;
      parent_banner_id?: string;
      color_hex?: string;
    };
    if (!body.title?.trim()) return json({ error: "Title is required" }, 400);
    if (!body.start_date || !body.end_date) return json({ error: "Start and end dates are required" }, 400);
    if (body.end_date < body.start_date) return json({ error: "End date cannot be before start date" }, 400);

    await env.esol_marking_db
      .prepare(
        "UPDATE quality_calendar_events SET title = ?, description = ?, type = ?, start_date = ?, end_date = ?, include_weekends = ?, parent_banner_id = ?, color_hex = ? WHERE id = ?"
      )
      .bind(
        body.title.trim(),
        body.description?.trim() || null,
        body.type,
        body.start_date,
        body.end_date,
        body.include_weekends ? 1 : 0,
        body.parent_banner_id || null,
        body.color_hex?.trim() || "#00C4DF",
        eventId
      )
      .run();

    return json({ success: true });
  } catch (err: any) {
    return json({ error: "Failed: " + (err?.message || String(err)) }, 500);
  }
}

async function deleteCalendarEvent(request: Request, env: Env, identity: Identity, eventId: string): Promise<Response> {
  if (!calendarAccessAllowed(identity.user!)) return json({ error: "Forbidden" }, 403);
  try {
    const existing = await env.esol_marking_db.prepare("SELECT * FROM quality_calendar_events WHERE id = ?").bind(eventId).first<QualityCalendarEvent>();
    if (!existing) return json({ error: "Not found" }, 404);
    if (!calendarEventEditable(identity.user!, existing)) return json({ error: "You can only delete your own events" }, 403);
    await env.esol_marking_db.prepare("DELETE FROM quality_calendar_events WHERE id = ?").bind(eventId).run();
    return json({ success: true });
  } catch (err: any) {
    return json({ error: "Failed: " + (err?.message || String(err)) }, 500);
  }
}

function normalizeImportDate(value: string): string {
  const v = value.trim();
  if (!v) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
  const ukMatch = v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (ukMatch) {
    const [, d, m, y] = ukMatch;
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }
  return v;
}

async function importCalendarCSV(request: Request, env: Env, identity: Identity): Promise<Response> {
  if (!calendarAccessAllowed(identity.user!)) return json({ error: "Forbidden" }, 403);
  try {
    const body = await request.json() as { csvText?: string };
    if (!body.csvText?.trim()) return json({ error: "CSV text is required" }, 400);

    const lines = body.csvText.split(/\r?\n/).filter((l) => l.trim());
    if (lines.length < 2) return json({ error: "CSV must contain a header and at least one row" }, 400);

    const headers = parseCSVLine(lines[0]).map((h) => h.trim().toLowerCase());
    const typeIdx = headers.indexOf("event_type");
    const titleIdx = headers.indexOf("title");
    const descIdx = headers.indexOf("description");
    const startIdx = headers.indexOf("start_date");
    const endIdx = headers.indexOf("end_date");
    const weekendIdx = headers.indexOf("include_weekends");
    const parentIdx = headers.indexOf("parent_title");
    const colorIdx = headers.indexOf("color_hex");

    if (titleIdx === -1 || startIdx === -1 || endIdx === -1) {
      return json({ error: "CSV must contain title, start_date, end_date columns" }, 400);
    }

    const rows: { type: string; title: string; description: string; start: string; end: string; includeWeekends: number; parent: string; color: string }[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      const type = typeIdx !== -1 ? values[typeIdx]?.trim().toLowerCase() || "single" : "single";
      const title = values[titleIdx]?.trim();
      if (!title) continue;
      rows.push({
        type,
        title,
        description: values[descIdx]?.trim() || "",
        start: normalizeImportDate(values[startIdx] || ""),
        end: normalizeImportDate(values[endIdx] || "") || normalizeImportDate(values[startIdx] || ""),
        includeWeekends: values[weekendIdx]?.trim() === "1" ? 1 : 0,
        parent: values[parentIdx]?.trim() || "",
        color: values[colorIdx]?.trim() || "#00C4DF",
      });
    }

    const titleToId: Record<string, string> = {};
    for (const row of rows) {
      if (row.type !== "banner") continue;
      const bannerId = crypto.randomUUID();
      titleToId[row.title] = bannerId;
      await env.esol_marking_db
        .prepare(
          "INSERT INTO quality_calendar_events (id, title, description, type, start_date, end_date, include_weekends, parent_banner_id, color_hex, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        )
        .bind(bannerId, row.title, row.description || null, "banner", row.start, row.end, row.includeWeekends, null, row.color, identity.user!.id)
        .run();
    }

    for (const row of rows) {
      if (row.type === "banner") continue;
      const parentId = row.parent ? titleToId[row.parent] : null;
      await env.esol_marking_db
        .prepare(
          "INSERT INTO quality_calendar_events (id, title, description, type, start_date, end_date, include_weekends, parent_banner_id, color_hex, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        )
        .bind(crypto.randomUUID(), row.title, row.description || null, "single", row.start, row.end, row.includeWeekends, parentId, row.color, identity.user!.id)
        .run();
    }

    return json({ success: true, imported: rows.length });
  } catch (err: any) {
    return json({ error: "Failed: " + (err?.message || String(err)) }, 500);
  }
}

async function exportCalendarCSV(request: Request, env: Env, identity: Identity): Promise<Response> {
  if (!calendarAccessAllowed(identity.user!)) return json({ error: "Forbidden" }, 403);
  try {
    const url = new URL(request.url);
    const year = parseInt(url.searchParams.get("year") || String(new Date().getFullYear()), 10);
    const start = `${year}-01-01`;
    const end = `${year}-12-31`;
    const events = await env.esol_marking_db
      .prepare("SELECT * FROM quality_calendar_events WHERE start_date <= ? AND end_date >= ? ORDER BY start_date ASC, type ASC, created_at ASC")
      .bind(end, start)
      .all<QualityCalendarEvent>();

    const all = events.results ?? [];
    const banners = new Map<string, QualityCalendarEvent>();
    for (const e of all) if (e.type === "banner") banners.set(e.id, e);

    const rows = ["event_type,title,description,start_date,end_date,include_weekends,parent_title,color_hex"];
    for (const e of all) {
      const parentTitle = e.parent_banner_id && banners.has(e.parent_banner_id) ? banners.get(e.parent_banner_id)!.title : "";
      rows.push(
        [
          escapeCSV(e.type),
          escapeCSV(e.title),
          escapeCSV(e.description || ""),
          escapeCSV(e.start_date),
          escapeCSV(e.end_date),
          escapeCSV(String(e.include_weekends)),
          escapeCSV(parentTitle),
          escapeCSV(e.color_hex),
        ].join(",")
      );
    }

    return new Response(rows.join("\r\n"), {
      headers: {
        "Content-Type": "text/csv;charset=utf-8",
        "Content-Disposition": `attachment; filename="quality-calendar-${year}.csv"`,
      },
    });
  } catch (err: any) {
    return json({ error: "Failed: " + (err?.message || String(err)) }, 500);
  }
}

function renderQualityCalendarPage(identity: Identity): Response {
  if (!calendarAccessAllowed(identity.user!)) return htmlResponse(renderForbiddenPage(identity), 403);
  const initialMonday = formatISODate(getStartOfWeek(new Date()));
  return htmlResponse(
    pageShell("Quality Calendar", `
    <main id="qc-main" class="dashboard-shell" data-user-id="${escapeHtml(identity.user!.id)}" data-user-role="${escapeHtml(identity.user!.role)}">
      ${renderSidebar(identity, "quality-calendar")}
      <section class="content" id="qc-content">
        ${renderTopbar(identity, "Quality Calendar")}
        <section class="panel qc-panel">
          <div class="qc-toolbar">
            <div class="qc-nav-group">
              <button type="button" id="qc-prev" class="qc-icon-btn" title="Previous week">&#10094;</button>
              <button type="button" id="qc-today" class="qc-text-btn">Today</button>
              <button type="button" id="qc-next" class="qc-icon-btn" title="Next week">&#10095;</button>
            </div>
            <input type="date" id="qc-date-picker" value="${initialMonday}">
            <div class="qc-view-toggle">
              <button type="button" data-days="5" class="qc-view-btn active">5-Day</button>
              <button type="button" data-days="7" class="qc-view-btn">7-Day</button>
            </div>
            <div class="qc-actions">
              <button type="button" id="qc-new-event" class="qc-primary-btn">+ New Event</button>
              <button type="button" id="qc-import" class="qc-secondary-btn">Import CSV</button>
              <button type="button" id="qc-export" class="qc-secondary-btn">Export CSV</button>
            </div>
          </div>

          <div class="qc-calendar" id="qc-calendar">
            <div class="qc-header-row" id="qc-header-row"></div>
            <div class="qc-grid" id="qc-grid"></div>
          </div>
        </section>
      </section>
    </main>

    <div id="qc-modal" class="qc-modal-overlay" style="display:none">
      <div class="qc-modal">
        <div class="qc-modal-header">
          <h2 id="qc-modal-title">New Event</h2>
          <button type="button" id="qc-modal-close" class="qc-modal-close">&times;</button>
        </div>
        <form id="qc-form" class="qc-form">
          <input type="hidden" id="qc-event-id" value="">
          <div class="qc-type-toggle">
            <button type="button" data-type="banner" id="qc-type-banner" class="qc-type-btn active">Banner Event</button>
            <button type="button" data-type="single" id="qc-type-single" class="qc-type-btn">Standalone / Single</button>
          </div>
          <label>Title<input type="text" id="qc-title" required placeholder="Event title"></label>
          <label>Description<textarea id="qc-description" rows="2" placeholder="Optional description"></textarea></label>
          <div class="qc-form-row">
            <label>Start Date<input type="date" id="qc-start" required></label>
            <label>End Date<input type="date" id="qc-end" required></label>
          </div>
          <div class="qc-form-row">
            <label class="qc-checkbox"><input type="checkbox" id="qc-weekends"> Include Weekends?</label>
            <div class="qc-color-field">
              <label>Colour</label>
              <div class="qc-color-picker">
                <div class="qc-color-current" id="qc-color-current">
                  <div class="qc-color-swatch-wrap">
                    <div class="qc-color-swatch" id="qc-color-swatch"></div>
                    <input type="color" id="qc-color" value="#00C4DF" class="qc-color-native">
                  </div>
                  <button type="button" class="qc-copy-color" id="qc-copy-color" title="Copy this colour to custom palette">Add to palette</button>
                </div>
                <div class="qc-color-presets" id="qc-color-presets">
                  <div class="qc-preset-label">Standard</div>
                  <div class="qc-preset-row" id="qc-preset-row"></div>
                  <div class="qc-preset-label">Custom</div>
                  <div class="qc-preset-row" id="qc-custom-row"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="qc-form-field" id="qc-parent-field" style="display:none">
            <label>Parent Banner<select id="qc-parent"></select></label>
          </div>
          <div id="qc-subs-section" class="qc-subs-section">
            <h3>Sub-events</h3>
            <div id="qc-subs-list"></div>
            <button type="button" id="qc-add-sub" class="qc-add-sub-btn">+ Add Sub-Event</button>
          </div>
          <div class="qc-modal-actions">
            <button type="button" id="qc-delete" class="qc-delete-btn" style="display:none">Delete</button>
            <button type="submit" id="qc-save" class="qc-primary-btn">Save</button>
          </div>
        </form>
      </div>
    </div>

    <div id="qc-import-modal" class="qc-modal-overlay" style="display:none">
      <div class="qc-modal qc-modal-sm">
        <div class="qc-modal-header"><h2>Import CSV</h2><button type="button" id="qc-import-close" class="qc-modal-close">&times;</button></div>
        <p class="qc-modal-hint">Required columns: <code>title, start_date, end_date</code>. Optional columns (same format as Export CSV): <code>event_type, description, include_weekends, parent_title, color_hex</code></p>
        <div class="qc-import-options">
          <label class="qc-file-label">
            <span>Upload CSV file</span>
            <input type="file" id="qc-import-file" accept=".csv,text/csv">
            <small>Or paste the contents below</small>
          </label>
          <button type="button" id="qc-download-template" class="qc-secondary-btn">Download template</button>
        </div>
        <textarea id="qc-import-text" rows="10" placeholder="Or paste CSV here..."></textarea>
        <div class="qc-modal-actions">
          <button type="button" id="qc-import-submit" class="qc-primary-btn">Import</button>
        </div>
      </div>
    </div>

    <div id="qc-tooltip" class="qc-tooltip" style="display:none"></div>
    <div id="qc-context-menu" class="qc-context-menu" style="display:none"></div>

    <script>
      (function() {
        const currentUser = { id: "${escapeHtml(identity.user!.id)}", role: "${escapeHtml(identity.user!.role)}" };
        const COLOR_PRESETS = ["#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16", "#22c55e", "#10b981", "#14b8a6", "#06b6d4", "#0ea5e9", "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#d946ef", "#ec4899", "#f43f5e", "#78716c", "#1e293b", "#0f172a"];
        const MAX_CUSTOM_COLORS = 20;
        const state = {
          monday: new Date("${initialMonday}" + "T00:00:00"),
          days: 5,
          events: [],
          banners: [],
          userId: currentUser.id,
          userRole: currentUser.role,
          customColors: JSON.parse(localStorage.getItem("qc_custom_colors") || "[]").slice(0, MAX_CUSTOM_COLORS)
        };

        function getMonday(d) {
          const date = new Date(d);
          const day = date.getDay();
          const diff = date.getDate() - day + (day === 0 ? -6 : 1);
          return new Date(date.setDate(diff));
        }

        function addDays(d, n) { const r = new Date(d); r.setDate(r.getDate() + n); return r; }
        function formatISO(d) { const y = d.getFullYear(); const m = String(d.getMonth() + 1).padStart(2, "0"); const day = String(d.getDate()).padStart(2, "0"); return y + "-" + m + "-" + day; }
        function isWeekend(d) { const day = d.getDay(); return day === 0 || day === 6; }
        function formatDisplay(d) { return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }); }
        function dayMatches(d, dateStr) { return formatISO(d) === dateStr; }

        function isEditable(event) {
          if (state.userRole === "superuser") return true;
          if (state.userRole === "admin") return event.created_by === state.userId;
          return false;
        }

        function saveCustomColor(color) {
          const list = state.customColors.filter(c => c !== color);
          list.unshift(color);
          state.customColors = list.slice(0, MAX_CUSTOM_COLORS);
          localStorage.setItem("qc_custom_colors", JSON.stringify(state.customColors));
          renderColorPresets();
        }

        function removeCustomColor(index) {
          state.customColors.splice(index, 1);
          localStorage.setItem("qc_custom_colors", JSON.stringify(state.customColors));
          renderColorPresets();
        }

        function renderColorPresets() {
          const presetRow = document.getElementById("qc-preset-row");
          const customRow = document.getElementById("qc-custom-row");
          presetRow.innerHTML = "";
          customRow.innerHTML = "";
          COLOR_PRESETS.forEach(c => {
            const square = document.createElement("button");
            square.type = "button";
            square.className = "qc-color-square";
            square.style.backgroundColor = c;
            square.title = c;
            square.onclick = () => setColor(c);
            presetRow.appendChild(square);
          });
          state.customColors.forEach((c, i) => {
            const square = document.createElement("button");
            square.type = "button";
            square.className = "qc-color-square";
            square.style.backgroundColor = c;
            square.title = "Double-click to remove";
            square.onclick = () => setColor(c);
            square.ondblclick = (e) => { e.preventDefault(); e.stopPropagation(); removeCustomColor(i); };
            customRow.appendChild(square);
          });
        }

        function setColor(color) {
          const input = document.getElementById("qc-color");
          if (input.disabled) return;
          input.value = color;
          updateColorSwatch();
        }

        function tileTextColor(hex) {
          const clean = (hex || "#00C4DF").replace("#", "");
          const r = parseInt(clean.substring(0, 2), 16);
          const g = parseInt(clean.substring(2, 4), 16);
          const b = parseInt(clean.substring(4, 6), 16);
          const brightness = (r * 299 + g * 587 + b * 114) / 1000;
          return brightness > 140 ? "#0f172a" : "#ffffff";
        }

        function updateColorSwatch() {
          const color = document.getElementById("qc-color").value;
          const swatch = document.getElementById("qc-color-swatch");
          swatch.style.backgroundColor = color;
          swatch.textContent = color;
        }

        function showTooltip(el, html) {
          const tip = document.getElementById("qc-tooltip");
          tip.innerHTML = html;
          tip.style.display = "block";
          const rect = el.getBoundingClientRect();
          const tipRect = tip.getBoundingClientRect();
          let top = rect.bottom + 8;
          let left = rect.left + rect.width / 2 - tipRect.width / 2;
          if (left < 8) left = 8;
          if (left + tipRect.width > window.innerWidth - 8) left = window.innerWidth - tipRect.width - 8;
          if (top + tipRect.height > window.innerHeight - 8) top = rect.top - tipRect.height - 8;
          tip.style.top = top + "px";
          tip.style.left = left + "px";
        }

        function hideTooltip() {
          document.getElementById("qc-tooltip").style.display = "none";
        }

        function showContextMenu(e, event) {
          e.preventDefault();
          const menu = document.getElementById("qc-context-menu");
          menu.innerHTML = "";
          const canEdit = isEditable(event);
          if (canEdit) {
            const editBtn = document.createElement("button");
            editBtn.textContent = "Edit";
            editBtn.onclick = () => { closeContextMenu(); openModal(event.id); };
            menu.appendChild(editBtn);

            const copyColorBtn = document.createElement("button");
            copyColorBtn.textContent = "Copy colour";
            copyColorBtn.onclick = () => { closeContextMenu(); navigator.clipboard.writeText(event.color_hex); saveCustomColor(event.color_hex); };
            menu.appendChild(copyColorBtn);

            const colorLabel = document.createElement("div");
            colorLabel.className = "qc-context-label";
            colorLabel.textContent = "Set colour";
            menu.appendChild(colorLabel);

            const palette = document.createElement("div");
            palette.className = "qc-context-palette";
            COLOR_PRESETS.forEach(c => {
              const square = document.createElement("button");
              square.type = "button";
              square.className = "qc-color-square";
              square.style.backgroundColor = c;
              square.onclick = () => { closeContextMenu(); updateEventColor(event.id, c); };
              palette.appendChild(square);
            });
            menu.appendChild(palette);

            const delBtn = document.createElement("button");
            delBtn.textContent = "Delete";
            delBtn.className = "qc-context-delete";
            delBtn.onclick = () => { closeContextMenu(); deleteEventById(event.id); };
            menu.appendChild(delBtn);
          } else {
            const viewBtn = document.createElement("button");
            viewBtn.textContent = "View details";
            viewBtn.onclick = () => { closeContextMenu(); openModal(event.id); };
            menu.appendChild(viewBtn);

            const copyColorBtn = document.createElement("button");
            copyColorBtn.textContent = "Copy colour";
            copyColorBtn.onclick = () => { closeContextMenu(); navigator.clipboard.writeText(event.color_hex); saveCustomColor(event.color_hex); };
            menu.appendChild(copyColorBtn);
          }

          menu.style.display = "block";
          menu.style.top = e.clientY + "px";
          menu.style.left = e.clientX + "px";
        }

        function closeContextMenu() {
          document.getElementById("qc-context-menu").style.display = "none";
        }

        async function updateEventColor(eventId, color) {
          const ev = state.events.find(e => e.id === eventId);
          if (!ev || !isEditable(ev)) return;
          try {
            const body = { ...ev, color_hex: color };
            const res = await fetch("/api/calendar/events/" + eventId, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
            const data = await res.json();
            if (!res.ok || data.error) throw new Error(data.error || "Failed");
            saveCustomColor(color);
            await loadEvents();
          } catch (err) {
            alert(err.message);
          }
        }

        async function deleteEventById(eventId) {
          const ev = state.events.find(e => e.id === eventId);
          if (!ev || !isEditable(ev)) return;
          if (!confirm("Delete this event?")) return;
          try {
            const res = await fetch("/api/calendar/events/" + eventId, { method: "DELETE" });
            const data = await res.json();
            if (!res.ok || data.error) throw new Error(data.error || "Delete failed");
            await loadEvents();
          } catch (err) {
            alert(err.message);
          }
        }

        function getWeekDates() {
          const dates = [];
          for (let i = 0; i < state.days; i++) dates.push(addDays(state.monday, i));
          return dates;
        }

        function getRangeEnd() { return addDays(state.monday, state.days - 1); }

        function eventTooltipHtml(event) {
          const dates = event.start_date !== event.end_date ? event.start_date + " to " + event.end_date : event.start_date;
          const owner = event.created_by === state.userId ? "You" : (state.userRole === "superuser" ? "Another user" : "");
          return \`<strong>\${escapeHtml(event.title)}</strong><br><em>\${dates}</em>\${event.description ? "<br>" + escapeHtml(event.description) : ""}\${owner ? "<br>Created by: " + owner : ""}\`;
        }

        function escapeHtml(s) {
          return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
        }

        function buildHeader() {
          const row = document.getElementById("qc-header-row");
          row.innerHTML = "";
          const dates = getWeekDates();
          dates.forEach((d, i) => {
            const cell = document.createElement("div");
            cell.className = "qc-header-cell";
            cell.innerHTML = \`<div class="qc-day-name">\${["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][d.getDay() === 0 ? 6 : d.getDay() - 1]}</div>
              <div class="qc-day-date">\${formatDisplay(d)}</div>
              <button type="button" class="qc-day-add" data-date="\${formatISO(d)}" title="Add event">+</button>\`;
            if (isWeekend(d)) cell.classList.add("qc-weekend");
            row.appendChild(cell);
          });
        }

        function eventInView(e) {
          const viewStart = formatISO(state.monday);
          const viewEnd = formatISO(getRangeEnd());
          return e.start_date <= viewEnd && e.end_date >= viewStart;
        }

        function visibleDateSpan(e) {
          const viewStart = formatISO(state.monday);
          const viewEnd = formatISO(getRangeEnd());
          const start = e.start_date < viewStart ? viewStart : e.start_date;
          const end = e.end_date > viewEnd ? viewEnd : e.end_date;
          return { start, end };
        }

        function weekendCountBetween(start, end) {
          let count = 0;
          let cur = new Date(start + "T00:00:00");
          const last = new Date(end + "T00:00:00");
          while (cur <= last) {
            if (isWeekend(cur)) count++;
            cur = addDays(cur, 1);
          }
          return count;
        }

        function spanDays(start, end) {
          const a = new Date(start + "T00:00:00");
          const b = new Date(end + "T00:00:00");
          return Math.round((b - a) / (1000 * 60 * 60 * 24)) + 1;
        }

        function getColumnIndex(dateStr) {
          const dates = getWeekDates();
          return dates.findIndex(d => formatISO(d) === dateStr);
        }

        function getBannerRow(banner) {
          const grid = document.getElementById("qc-grid");
          let row = document.getElementById("qc-banner-row-" + banner.id);
          if (!row) {
            row = document.createElement("div");
            row.className = "qc-banner-row";
            row.id = "qc-banner-row-" + banner.id;
            row.style.gridColumn = "1 / -1";
            grid.appendChild(row);
          }
          return row;
        }

        function getSingleRow(bannerId) {
          const grid = document.getElementById("qc-grid");
          let row = document.getElementById("qc-single-row-" + (bannerId || "standalone"));
          if (!row) {
            row = document.createElement("div");
            row.className = "qc-single-row";
            row.id = "qc-single-row-" + (bannerId || "standalone");
            row.style.gridColumn = "1 / -1";
            grid.appendChild(row);
          }
          return row;
        }

        function renderBanner(banner) {
          if (!eventInView(banner)) return;
          const span = visibleDateSpan(banner);
          const startIdx = getColumnIndex(span.start);
          const endIdx = getColumnIndex(span.end);
          if (startIdx === -1 || endIdx === -1 || startIdx > endIdx) return;

          let colSpan = endIdx - startIdx + 1;
          if (!banner.include_weekends) {
            const weekendCount = weekendCountBetween(span.start, span.end);
            colSpan -= weekendCount;
          }
          if (colSpan < 1) colSpan = 1;

          const row = getBannerRow(banner);
          const tile = document.createElement("div");
          tile.className = "qc-banner-tile" + (isEditable(banner) ? "" : " qc-readonly");
          tile.style.backgroundColor = banner.color_hex;
          tile.style.color = tileTextColor(banner.color_hex);
          tile.style.gridColumn = (startIdx + 1) + " / span " + colSpan;
          tile.textContent = banner.title;
          tile.onmouseenter = (e) => showTooltip(tile, eventTooltipHtml(banner));
          tile.onmouseleave = hideTooltip;
          tile.oncontextmenu = (e) => showContextMenu(e, banner);
          tile.onclick = () => openModal(banner.id);
          row.appendChild(tile);
        }

        function renderSingle(event) {
          if (!eventInView(event)) return;
          const span = visibleDateSpan(event);
          const startIdx = getColumnIndex(span.start);
          const endIdx = getColumnIndex(span.end);
          if (startIdx === -1) return;

          const row = getSingleRow(event.parent_banner_id || "");
          const tile = document.createElement("div");
          tile.className = "qc-single-tile" + (event.parent_banner_id ? " qc-child-tile" : " qc-standalone-tile") + (isEditable(event) ? "" : " qc-readonly");
          tile.style.backgroundColor = event.color_hex || "#00C4DF";
          tile.style.color = tileTextColor(event.color_hex);
          tile.style.gridColumn = (startIdx + 1) + " / span " + Math.max(1, endIdx - startIdx + 1);
          tile.textContent = event.title;
          tile.onmouseenter = (e) => showTooltip(tile, eventTooltipHtml(event));
          tile.onmouseleave = hideTooltip;
          tile.oncontextmenu = (e) => showContextMenu(e, event);
          tile.onclick = () => openModal(event.id);
          row.appendChild(tile);
        }

        function renderGrid() {
          const grid = document.getElementById("qc-grid");
          grid.innerHTML = "";
          const dates = getWeekDates();
          dates.forEach((d, i) => {
            const col = document.createElement("div");
            col.className = "qc-grid-col" + (isWeekend(d) ? " qc-weekend" : "");
            col.style.position = "absolute";
            col.style.top = "0";
            col.style.bottom = "0";
            col.style.left = (i / state.days * 100) + "%";
            col.style.width = (100 / state.days) + "%";
            grid.appendChild(col);
          });

          const banners = state.events.filter(e => e.type === "banner");
          banners.forEach(renderBanner);
          state.events.filter(e => e.type === "single").forEach(renderSingle);

          document.querySelectorAll(".qc-day-add").forEach(btn => {
            btn.onclick = () => openModal(null, btn.dataset.date);
          });
        }

        async function loadEvents() {
          const start = formatISO(state.monday);
          const end = formatISO(getRangeEnd());
          const res = await fetch("/api/calendar/events?startDate=" + start + "&endDate=" + end);
          const data = await res.json();
          state.events = data.events || [];
          state.banners = state.events.filter(e => e.type === "banner");
          buildHeader();
          renderGrid();
        }

        function setMonday(d) {
          state.monday = getMonday(d);
          document.getElementById("qc-date-picker").value = formatISO(state.monday);
          loadEvents();
        }

        function openModal(eventId, prefillDate) {
          const modal = document.getElementById("qc-modal");
          const form = document.getElementById("qc-form");
          form.reset();
          document.getElementById("qc-event-id").value = "";
          document.getElementById("qc-subs-list").innerHTML = "";
          document.getElementById("qc-delete").style.display = "none";
          document.getElementById("qc-save").style.display = "inline-block";
          document.getElementById("qc-modal-title").textContent = "New Event";

          if (eventId) {
            const ev = state.events.find(e => e.id === eventId);
            if (ev) {
              const editable = isEditable(ev);
              document.getElementById("qc-event-id").value = ev.id;
              document.getElementById("qc-title").value = ev.title;
              document.getElementById("qc-title").readOnly = !editable;
              document.getElementById("qc-description").value = ev.description || "";
              document.getElementById("qc-description").readOnly = !editable;
              document.getElementById("qc-start").value = ev.start_date;
              document.getElementById("qc-start").readOnly = !editable;
              document.getElementById("qc-end").value = ev.end_date;
              document.getElementById("qc-end").readOnly = !editable;
              document.getElementById("qc-weekends").checked = !!ev.include_weekends;
              document.getElementById("qc-weekends").disabled = !editable;
              document.getElementById("qc-color").value = ev.color_hex || "#00C4DF";
              document.getElementById("qc-color").disabled = !editable;
              document.getElementById("qc-color-presets").style.pointerEvents = editable ? "auto" : "none";
              document.getElementById("qc-color-presets").style.opacity = editable ? "1" : "0.5";
              document.getElementById("qc-copy-color").style.display = editable ? "inline-block" : "none";
              setType(ev.type);
              document.getElementById("qc-parent").value = ev.parent_banner_id || "";
              document.getElementById("qc-parent").disabled = !editable;
              document.getElementById("qc-type-banner").disabled = !editable;
              document.getElementById("qc-type-single").disabled = !editable;
              document.getElementById("qc-add-sub").style.display = editable ? "block" : "none";
              document.getElementById("qc-modal-title").textContent = editable ? "Edit Event" : "View Event";
              if (editable) document.getElementById("qc-delete").style.display = "inline-block";
              if (!editable) document.getElementById("qc-save").style.display = "none";

              if (ev.type === "banner" && Array.isArray(ev.sub_events)) {
                ev.sub_events.forEach(addSubEventRow);
              }
            }
          } else {
            const defaultStart = prefillDate || formatISO(new Date());
            document.getElementById("qc-start").value = defaultStart;
            document.getElementById("qc-end").value = defaultStart;
            document.getElementById("qc-title").readOnly = false;
            document.getElementById("qc-description").readOnly = false;
            document.getElementById("qc-start").readOnly = false;
            document.getElementById("qc-end").readOnly = false;
            document.getElementById("qc-weekends").disabled = false;
            document.getElementById("qc-color").disabled = false;
            document.getElementById("qc-parent").disabled = false;
            document.getElementById("qc-type-banner").disabled = false;
            document.getElementById("qc-type-single").disabled = false;
            document.getElementById("qc-add-sub").style.display = "block";
            setType("banner");
          }

          setColor(document.getElementById("qc-color").value);
          updateColorSwatch();
          renderColorPresets();
          updateParentOptions();
          updateSubsVisibility();
          modal.style.display = "flex";
        }

        function setType(type) {
          document.getElementById("qc-type-banner").classList.toggle("active", type === "banner");
          document.getElementById("qc-type-single").classList.toggle("active", type === "single");
          document.getElementById("qc-type-banner").classList.toggle("qc-type-active", type === "banner");
          document.getElementById("qc-type-single").classList.toggle("qc-type-active", type === "single");
          document.getElementById("qc-parent-field").style.display = type === "single" ? "block" : "none";
          document.getElementById("qc-subs-section").style.display = type === "banner" ? "block" : "none";
        }

        function updateParentOptions() {
          const sel = document.getElementById("qc-parent");
          const current = sel.value;
          sel.innerHTML = '<option value="">(none)</option>';
          state.banners.forEach(b => {
            const opt = document.createElement("option");
            opt.value = b.id;
            opt.textContent = b.title;
            sel.appendChild(opt);
          });
          sel.value = current || "";
        }

        function updateSubsVisibility() {
          const isBanner = document.getElementById("qc-type-banner").classList.contains("active");
          document.getElementById("qc-subs-section").style.display = isBanner ? "block" : "none";
        }

        function addSubEventRow(values) {
          const list = document.getElementById("qc-subs-list");
          const defaultDate = document.getElementById("qc-start").value || formatISO(new Date());
          const row = document.createElement("div");
          row.className = "qc-sub-row";
          row.innerHTML = \`
            <input type="text" class="qc-sub-title" placeholder="Sub-event title" required value="\${values?.title || ''}">
            <input type="text" class="qc-sub-desc" placeholder="Description" value="\${values?.description || ''}">
            <input type="date" class="qc-sub-start" required value="\${values?.start_date || defaultDate}">
            <input type="date" class="qc-sub-end" required value="\${values?.end_date || defaultDate}">
            <button type="button" class="qc-remove-sub" title="Remove">&times;</button>
          \`;
          const startInput = row.querySelector(".qc-sub-start");
          const endInput = row.querySelector(".qc-sub-end");
          startInput.onchange = () => { if (!endInput.value || endInput.value < startInput.value) endInput.value = startInput.value; };
          row.querySelector(".qc-remove-sub").onclick = () => row.remove();
          list.appendChild(row);
        }

        async function saveEvent(e) {
          e.preventDefault();
          const id = document.getElementById("qc-event-id").value;
          if (id) {
            const ev = state.events.find(e => e.id === id);
            if (ev && !isEditable(ev)) { alert("You can only edit your own events"); return; }
          }
          const type = document.getElementById("qc-type-banner").classList.contains("active") ? "banner" : "single";
          const body = {
            title: document.getElementById("qc-title").value,
            description: document.getElementById("qc-description").value,
            type,
            start_date: document.getElementById("qc-start").value,
            end_date: document.getElementById("qc-end").value,
            include_weekends: document.getElementById("qc-weekends").checked,
            color_hex: document.getElementById("qc-color").value,
          };

          if (type === "single") {
            const parent = document.getElementById("qc-parent").value;
            if (parent) body.parent_banner_id = parent;
          }

          if (type === "banner") {
            const subEvents = [];
            document.querySelectorAll(".qc-sub-row").forEach(row => {
              const t = row.querySelector(".qc-sub-title").value.trim();
              const d = row.querySelector(".qc-sub-desc").value.trim();
              const s = row.querySelector(".qc-sub-start").value;
              const en = row.querySelector(".qc-sub-end").value;
              if (t && s && en) subEvents.push({ title: t, description: d, start_date: s, end_date: en });
            });
            body.sub_events = subEvents;
          }

          try {
            const url = id ? "/api/calendar/events/" + id : "/api/calendar/events";
            const method = id ? "PUT" : "POST";
            const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
            const data = await res.json();
            if (!res.ok || data.error) throw new Error(data.error || "Save failed");
            closeModal();
            await loadEvents();
          } catch (err) {
            alert(err.message);
          }
        }

        async function deleteEvent() {
          const id = document.getElementById("qc-event-id").value;
          if (!id) return;
          const ev = state.events.find(e => e.id === id);
          if (ev && !isEditable(ev)) { alert("You can only delete your own events"); return; }
          if (!confirm("Delete this event?")) return;
          const res = await fetch("/api/calendar/events/" + id, { method: "DELETE" });
          const data = await res.json();
          if (!res.ok || data.error) { alert(data.error || "Delete failed"); return; }
          closeModal();
          await loadEvents();
        }

        function closeModal() {
          document.getElementById("qc-modal").style.display = "none";
        }

        function showImportModal() {
          document.getElementById("qc-import-modal").style.display = "flex";
        }

        function closeImportModal() {
          document.getElementById("qc-import-modal").style.display = "none";
          document.getElementById("qc-import-text").value = "";
          document.getElementById("qc-import-file").value = "";
        }

        function handleImportFile(e) {
          const file = e.target.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => { document.getElementById("qc-import-text").value = reader.result; };
          reader.readAsText(file);
        }

        function downloadTemplate() {
          const template = "event_type,title,description,start_date,end_date,include_weekends,parent_title,color_hex\\nsingle,Example event,Optional description,2026-09-01,2026-09-01,0,#00C4DF\\n";
          const blob = new Blob([template], { type: "text/csv;charset=utf-8;" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "quality-calendar-template.csv";
          a.click();
          URL.revokeObjectURL(url);
        }

        async function submitImport() {
          const text = document.getElementById("qc-import-text").value;
          try {
            const res = await fetch("/api/calendar/import-csv", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ csvText: text })
            });
            const data = await res.json();
            if (!res.ok || data.error) throw new Error(data.error || "Import failed");
            alert("Imported " + data.imported + " events");
            closeImportModal();
            await loadEvents();
          } catch (err) {
            alert(err.message);
          }
        }

        function exportCSV() {
          const year = state.monday.getFullYear();
          const a = document.createElement("a");
          a.href = "/api/calendar/export-csv?year=" + year;
          a.click();
        }

        document.getElementById("qc-prev").onclick = () => setMonday(addDays(state.monday, -7));
        document.getElementById("qc-next").onclick = () => setMonday(addDays(state.monday, 7));
        document.getElementById("qc-today").onclick = () => setMonday(new Date());
        document.getElementById("qc-date-picker").onchange = e => setMonday(new Date(e.target.value + "T00:00:00"));
        document.querySelectorAll(".qc-view-btn").forEach(btn => {
          btn.onclick = () => {
            document.querySelectorAll(".qc-view-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            state.days = parseInt(btn.dataset.days);
            document.getElementById("qc-calendar").classList.toggle("qc-seven-day", state.days === 7);
            loadEvents();
          };
        });
        document.getElementById("qc-new-event").onclick = () => openModal();
        document.getElementById("qc-modal-close").onclick = closeModal;
        document.getElementById("qc-form").onsubmit = saveEvent;
        document.getElementById("qc-delete").onclick = deleteEvent;

        const qcStart = document.getElementById("qc-start");
        const qcEnd = document.getElementById("qc-end");
        qcStart.onchange = () => { if (!qcEnd.value || qcEnd.value < qcStart.value) qcEnd.value = qcStart.value; };

        document.getElementById("qc-color").addEventListener("input", updateColorSwatch);
        document.getElementById("qc-color").addEventListener("change", () => { saveCustomColor(document.getElementById("qc-color").value); });
        document.getElementById("qc-copy-color").onclick = () => {
          const color = document.getElementById("qc-color").value;
          navigator.clipboard.writeText(color);
          saveCustomColor(color);
        };

        document.getElementById("qc-add-sub").onclick = () => addSubEventRow(null);

        document.addEventListener("click", (e) => {
          const menu = document.getElementById("qc-context-menu");
          if (menu.style.display === "block" && !menu.contains(e.target)) closeContextMenu();
        });

        renderColorPresets();
        document.getElementById("qc-type-banner").onclick = () => { setType("banner"); };
        document.getElementById("qc-type-single").onclick = () => { setType("single"); };
        document.getElementById("qc-add-sub").onclick = () => addSubEventRow();
        document.getElementById("qc-import").onclick = showImportModal;
        document.getElementById("qc-import-close").onclick = closeImportModal;
        document.getElementById("qc-import-submit").onclick = submitImport;
        document.getElementById("qc-import-file").onchange = handleImportFile;
        document.getElementById("qc-download-template").onclick = downloadTemplate;
        document.getElementById("qc-export").onclick = exportCSV;

        document.getElementById("qc-modal").onclick = e => { if (e.target.id === "qc-modal") closeModal(); };
        document.getElementById("qc-import-modal").onclick = e => { if (e.target.id === "qc-import-modal") closeImportModal(); };

        loadEvents();
      })();
    </script>
  `)
  );
}

async function renderReportsPage(request: Request, env: Env, identity: Identity): Promise<Response> {
  const user = identity.user!;
  const isReportsAdmin = user.role === "admin" || user.role === "superuser";

  const url = new URL(request.url);
  const reportType = url.searchParams.get("type") || "all";
  const anchorYear = parseInt(url.searchParams.get("year") || String(getCurrentAcademicYear()), 10);
  const rawTemplateId = url.searchParams.get("template") || "";
  // Non-admins/superusers can only ever see their own reports, regardless of any teacher param supplied.
  const teacherId = isReportsAdmin ? (url.searchParams.get("teacher") || "") : user.id;
  const adminId = url.searchParams.get("admin") || "";
  const subject = url.searchParams.get("subject") || "";
  const qualification = url.searchParams.get("qualification") || "";
  const dateFrom = url.searchParams.get("date_from") || "";
  const dateTo = url.searchParams.get("date_to") || "";

  const displayYears = [anchorYear, anchorYear - 1, anchorYear - 2];
  const minYear = Math.min(...displayYears);
  const maxYear = Math.max(...displayYears);
  const currentYear = getCurrentAcademicYear();

  const [usersResult, templatesResult, adminsResult, iqafTemplatesResult] = await Promise.all([
    env.esol_marking_db
      .prepare("SELECT id, email, role FROM users ORDER BY email")
      .all<{ id: string; email: string; role: string }>(),
    env.esol_marking_db
      .prepare("SELECT id, title FROM lw_templates ORDER BY title")
      .all<{ id: string; title: string }>(),
    env.esol_marking_db
      .prepare("SELECT id, email FROM users WHERE role IN ('iqa','assessor_iqa','admin','superuser') ORDER BY email")
      .all<{ id: string; email: string }>(),
    env.esol_marking_db
      .prepare("SELECT id, title FROM iqaf_templates ORDER BY title")
      .all<{ id: string; title: string }>(),
  ]);

  const allUsers = usersResult.results || [];
  const templates = templatesResult.results || [];
  const admins = adminsResult.results || [];
  const iqafTemplates = iqafTemplatesResult.results || [];
  const templateId = templates.some((t) => t.id === rawTemplateId) ? rawTemplateId : "";
  const iqafTemplateId = iqafTemplates.some((t) => t.id === rawTemplateId) ? rawTemplateId : "";
  const userById = new Map(allUsers.map((u) => [u.id, u]));

  const roleOrder: Record<string, number> = { assessor: 0, iqa: 1, assessor_iqa: 2, admin: 3, superuser: 4, eqa: 5 };
  const sortByRole = (a: { role?: string; email: string }, b: { role?: string; email: string }) => {
    const orderA = roleOrder[a.role || ""] ?? 99;
    const orderB = roleOrder[b.role || ""] ?? 99;
    if (orderA !== orderB) return orderA - orderB;
    return a.email.localeCompare(b.email);
  };

  const teachers: { key: string; email: string; role?: string }[] = allUsers.map((u) => ({ key: u.id, email: u.email, role: u.role }));
  const teacherByKey = new Map(teachers.map((t) => [t.key, t]));

  const entriesResult = await env.esol_marking_db
    .prepare(
      `SELECT e.id, e.template_id, t.title AS template_title, e.allocated_assessor_id, e.assessor_name, e.academic_year, e.planned_date, e.course_name, e.allocated_iqa_id
       FROM lw_entries e
       JOIN lw_templates t ON t.id = e.template_id
       WHERE (? = '' OR e.template_id = ?)
         AND (? = '' OR e.allocated_assessor_id = ?)
         AND (? = '' OR e.allocated_iqa_id = ?)
         AND (? = '' OR e.planned_date >= ?)
         AND (? = '' OR e.planned_date <= ?)
         AND e.academic_year BETWEEN ? AND ?
       ORDER BY e.allocated_assessor_id, e.academic_year, e.planned_date ASC`
    )
    .bind(
      templateId, templateId,
      teacherId, teacherId,
      adminId, adminId,
      dateFrom, dateFrom,
      dateTo, dateTo,
      minYear, maxYear
    )
    .all<{ id: string; allocated_assessor_id: string; assessor_name: string; academic_year: number; planned_date: string }>();

  const observations = new Map<string, Map<number, { id: string; date: string }[]>>();
  for (const row of entriesResult.results || []) {
    let key = row.allocated_assessor_id || "";
    let user = userById.get(key);
    if (!key || !user) {
      key = row.assessor_name || "";
      user = key ? allUsers.find((u) => u.email.toLowerCase() === key.toLowerCase()) : undefined;
    }
    if (!key) continue;
    if (!teacherByKey.has(key)) {
      const email = user?.email || row.assessor_name || row.allocated_assessor_id || key;
      const role = user?.role;
      const t = { key, email, role };
      teachers.push(t);
      teacherByKey.set(key, t);
    }
    const teacherMap = observations.get(key) || new Map<number, { id: string; date: string }[]>();
    const yearList = teacherMap.get(row.academic_year) || [];
    if (yearList.length < 6) {
      yearList.push({ id: row.id, date: row.planned_date });
      teacherMap.set(row.academic_year, yearList);
    }
    observations.set(key, teacherMap);
  }

  const iqafEntriesResult = await env.esol_marking_db
    .prepare(
      `SELECT e.id, e.template_id, t.title AS template_title, e.allocated_assessor_id, e.assessor_name, e.academic_year, e.planned_date, e.course_name, e.allocated_iqa_id
       FROM iqaf_entries e
       JOIN iqaf_templates t ON t.id = e.template_id
       WHERE (? = '' OR e.template_id = ?)
         AND (? = '' OR e.allocated_assessor_id = ?)
         AND (? = '' OR e.allocated_iqa_id = ?)
         AND (? = '' OR e.planned_date >= ?)
         AND (? = '' OR e.planned_date <= ?)
         AND e.academic_year BETWEEN ? AND ?
       ORDER BY e.allocated_assessor_id, e.academic_year, e.planned_date ASC`
    )
    .bind(
      iqafTemplateId, iqafTemplateId,
      teacherId, teacherId,
      adminId, adminId,
      dateFrom, dateFrom,
      dateTo, dateTo,
      minYear, maxYear
    )
    .all<{ id: string; allocated_assessor_id: string; assessor_name: string; academic_year: number; planned_date: string }>();

  const iqafObservations = new Map<string, Map<number, { id: string; date: string }[]>>();
  for (const row of iqafEntriesResult.results || []) {
    let key = row.allocated_assessor_id || "";
    let user = userById.get(key);
    if (!key || !user) {
      key = row.assessor_name || "";
      user = key ? allUsers.find((u) => u.email.toLowerCase() === key.toLowerCase()) : undefined;
    }
    if (!key) continue;
    if (!teacherByKey.has(key)) {
      const email = user?.email || row.assessor_name || row.allocated_assessor_id || key;
      const role = user?.role;
      const t = { key, email, role };
      teachers.push(t);
      teacherByKey.set(key, t);
    }
    const teacherMap = iqafObservations.get(key) || new Map<number, { id: string; date: string }[]>();
    const yearList = teacherMap.get(row.academic_year) || [];
    yearList.push({ id: row.id, date: row.planned_date });
    teacherMap.set(row.academic_year, yearList);
    iqafObservations.set(key, teacherMap);
  }

  teachers.sort(sortByRole);
  const displayTeachers = teacherId ? teachers.filter((t) => t.key === teacherId) : teachers;

  const iqafYearMaxCounts: Record<number, number> = {};
  for (const y of displayYears) {
    let max = 0;
    for (const t of displayTeachers) {
      const count = iqafObservations.get(t.key)?.get(y)?.length || 0;
      if (count > max) max = count;
    }
    iqafYearMaxCounts[y] = Math.max(max, 1);
  }

  const trackerTable = reportType === "all" || reportType === "learning-walk-tracker"
    ? `
      <section class="panel reports-panel">
        <div class="section-header">
          <div>
            <p class="eyebrow">Tracker</p>
            <h2>Learning Walk Tracker</h2>
          </div>
          <div class="year-nav">
            <a class="small-action" href="${buildReportUrl(url, { year: String(anchorYear - 1) })}">↵ Previous year</a>
            <span class="year-label">${anchorYear}</span>
            <a class="small-action" href="${buildReportUrl(url, { year: String(anchorYear + 1) })}">Next year →</a>
          </div>
        </div>
        <div class="reports-table-wrap">
          <table class="reports-table">
            <thead>
              <tr>
                <th class="sticky-col" rowspan="2">Teacher</th>
                ${displayYears.map((y) => `<th colspan="6" class="year-header">${y}${y === currentYear ? " (current)" : ""}</th>`).join("")}
              </tr>
              <tr>
                ${displayYears.map(() => Array.from({ length: 6 }, (_, i) => `<th>Obs ${i + 1}</th>`).join("")).join("")}
              </tr>
            </thead>
            <tbody>
              ${displayTeachers
                .map((t) => {
                  const teacherObs = observations.get(t.key) || new Map<number, { id: string; date: string }[]>();
                  const hasCurrent = (teacherObs.get(currentYear)?.length || 0) > 0;
                  const highlight = !hasCurrent ? "brand-highlight" : "";
                  const cells = displayYears
                    .flatMap((y) => {
                      const list = teacherObs.get(y) || [];
                      return Array.from({ length: 6 }, (_, i) => {
                        const obs = list[i];
                        return obs
                          ? `<td><a href="/learning-walks/entries/${obs.id}">${formatReportDate(obs.date)}</a></td>`
                          : `<td class="empty-cell">—</td>`;
                      });
                    })
                    .join("");
                  return `<tr class="${highlight}"><td class="sticky-col teacher-name">${escapeHtml(t.email || t.key || "Unknown")}</td>${cells}</tr>`;
                })
                .join("")}
            </tbody>
          </table>
        </div>
        ${displayTeachers.length === 0 ? `<p class="hint">No teachers found.</p>` : ""}
      </section>`
    : "";

  const iqafTrackerTable = reportType === "all" || reportType === "iqa-forms-tracker"
    ? `
      <section class="panel reports-panel">
        <div class="section-header">
          <div>
            <p class="eyebrow">Tracker</p>
            <h2>IQA Forms Tracker</h2>
          </div>
          <div class="year-nav">
            <a class="small-action" href="${buildReportUrl(url, { year: String(anchorYear - 1) })}">↵ Previous year</a>
            <span class="year-label">${anchorYear}</span>
            <a class="small-action" href="${buildReportUrl(url, { year: String(anchorYear + 1) })}">Next year →</a>
          </div>
        </div>
        <div class="reports-table-wrap">
          <table class="reports-table">
            <thead>
              <tr>
                <th class="sticky-col" rowspan="2">Teacher</th>
                ${displayYears.map((y) => `<th colspan="${iqafYearMaxCounts[y]}" class="year-header">${y}${y === currentYear ? " (current)" : ""}</th>`).join("")}
              </tr>
              <tr>
                ${displayYears.map((y) => Array.from({ length: iqafYearMaxCounts[y] }, (_, i) => `<th>Obs ${i + 1}</th>`).join("")).join("")}
              </tr>
            </thead>
            <tbody>
              ${displayTeachers
                .map((t) => {
                  const teacherObs = iqafObservations.get(t.key) || new Map<number, { id: string; date: string }[]>();
                  const hasCurrent = (teacherObs.get(currentYear)?.length || 0) > 0;
                  const highlight = !hasCurrent ? "brand-highlight" : "";
                  const cells = displayYears
                    .flatMap((y) => {
                      const list = teacherObs.get(y) || [];
                      return Array.from({ length: iqafYearMaxCounts[y] }, (_, i) => {
                        const obs = list[i];
                        return obs
                          ? `<td><a href="/iqa-forms/entries/${obs.id}">${formatReportDate(obs.date)}</a></td>`
                          : `<td class="empty-cell">—</td>`;
                      });
                    })
                    .join("");
                  return `<tr class="${highlight}"><td class="sticky-col teacher-name">${escapeHtml(t.email || t.key || "Unknown")}</td>${cells}</tr>`;
                })
                .join("")}
            </tbody>
          </table>
        </div>
        ${displayTeachers.length === 0 ? `<p class="hint">No teachers found.</p>` : ""}
      </section>`
    : "";

  const assessmentsTrackerTable = reportType === "all" || reportType === "assessments-tracker"
    ? `
      <section class="panel reports-panel">
        <div class="section-header">
          <div>
            <p class="eyebrow">Tracker</p>
            <h2>Assessments Tracker</h2>
          </div>
        </div>
        <p class="hint">Assessments tracker is coming soon.</p>
      </section>`
    : "";

  const noReportSelected = !trackerTable && !iqafTrackerTable && !assessmentsTrackerTable
    ? `<section class="panel reports-panel"><p class="hint">Select a category to begin.</p></section>`
    : "";

  const page = pageShell("Reports", `
    <main class="dashboard-shell">
      ${renderSidebar(identity, "reports")}
      <section class="content">
        ${renderTopbar(identity, "Reports")}
        <section class="panel" style="background:#f8fafc">
          <div class="section-header"><p class="eyebrow">Reports</p><h2>Quality Reports</h2></div>
          <form method="GET" action="/reports" class="reports-filters">
            <div class="filter-row">
              <label>Categories
                <select name="type" onchange="this.form.submit()">
                  <option value="all" ${reportType === "all" ? "selected" : ""}>All</option>
                  <option value="learning-walk-tracker" ${reportType === "learning-walk-tracker" ? "selected" : ""}>Learning Walks tracker</option>
                  <option value="iqa-forms-tracker" ${reportType === "iqa-forms-tracker" ? "selected" : ""}>IQA forms tracker</option>
                  <option value="assessments-tracker" ${reportType === "assessments-tracker" ? "selected" : ""}>Assessments tracker</option>
                </select>
              </label>
              <label>Academic Year
                <input type="number" name="year" value="${anchorYear}" min="2000" max="2100" placeholder="YYYY">
              </label>
              <label>Reports
                <select name="template">
                  <option value="">All templates</option>
                  ${reportType === "learning-walk-tracker"
                    ? templates.map((t) => `<option value="${t.id}" ${rawTemplateId === t.id ? "selected" : ""}>${escapeHtml(t.title)}</option>`).join("")
                    : reportType === "iqa-forms-tracker"
                    ? iqafTemplates.map((t) => `<option value="${t.id}" ${rawTemplateId === t.id ? "selected" : ""}>${escapeHtml(t.title)}</option>`).join("")
                    : reportType === "assessments-tracker"
                    ? `<option value="" disabled>No templates yet</option>`
                    : `${templates.length ? `<optgroup label="Learning Walks">${templates.map((t) => `<option value="${t.id}" ${rawTemplateId === t.id ? "selected" : ""}>${escapeHtml(t.title)}</option>`).join("")}</optgroup>` : ""}${iqafTemplates.length ? `<optgroup label="IQA Forms">${iqafTemplates.map((t) => `<option value="${t.id}" ${rawTemplateId === t.id ? "selected" : ""}>${escapeHtml(t.title)}</option>`).join("")}</optgroup>` : ""}`
                  }
                </select>
              </label>
              ${isReportsAdmin ? `
              <label>Teacher
                <select name="teacher">
                  <option value="">All teachers</option>
                  ${teachers.map((t) => `<option value="${t.key}" ${teacherId === t.key ? "selected" : ""}>${escapeHtml(t.email)}</option>`).join("")}
                </select>
              </label>` : ""}
              <label>Admin / IQA
                <select name="admin">
                  <option value="">All</option>
                  ${admins.map((u) => `<option value="${u.id}" ${adminId === u.id ? "selected" : ""}>${escapeHtml(u.email)}</option>`).join("")}
                </select>
              </label>
              <label>Subject
                <input type="text" name="subject" value="${escapeHtml(subject)}" placeholder="Filter by subject">
              </label>
              <label>Qualification
                <input type="text" name="qualification" value="${escapeHtml(qualification)}" placeholder="Filter by qualification">
              </label>
              <label>From
                <input type="date" name="date_from" value="${escapeHtml(dateFrom)}">
              </label>
              <label>To
                <input type="date" name="date_to" value="${escapeHtml(dateTo)}">
              </label>
              <div class="filter-actions"><button type="submit" class="small-action">Apply</button></div>
            </div>
            ${subject || qualification ? `<p class="hint">Subject and qualification filters are placeholders until those fields are available.</p>` : ""}
          </form>
        </section>
        ${trackerTable}
        ${iqafTrackerTable}
        ${assessmentsTrackerTable}
        ${noReportSelected}
      </section>
    </main>
  `);

  return htmlResponse(page);
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

async function updateUser(request: Request, env: Env, identity: Identity): Promise<Response> {
  if (!isSuperuser(identity.user!)) return json({ error: "Forbidden" }, 403);

  const body = await request.formData();
  const id = String(body.get("id") ?? "");
  const role = String(body.get("role") ?? "");
  const stage = String(body.get("stage") ?? "");

  if (!id || !roles.includes(role as Role)) {
    return Response.redirect(new URL("/users?update=error&message=Invalid+user+or+role", request.url).toString(), 303);
  }

  // Prevent self-modification
  if (id === identity.user!.id) {
    return Response.redirect(new URL("/users?update=error&message=Cannot+modify+own+account", request.url).toString(), 303);
  }

  const userStage = stage && stages.includes(stage as Stage) ? stage : roleToStage(role as Role);

  try {
    await env.esol_marking_db.prepare(
      "UPDATE users SET role = ?, stage = ? WHERE id = ?"
    ).bind(role, userStage, id).run();
    return Response.redirect(new URL("/users?update=success", request.url).toString(), 303);
  } catch (err: any) {
    return Response.redirect(new URL(`/users?update=error&message=${encodeURIComponent(err?.message || "Update failed")}`, request.url).toString(), 303);
  }
}

async function deleteUser(request: Request, env: Env, identity: Identity, id?: string): Promise<Response> {
  if (!isSuperuser(identity.user!)) return json({ error: "Forbidden" }, 403);
  if (!id || id === identity.user!.id) return Response.redirect(new URL("/users", request.url).toString(), 303);
  const body = await request.formData();
  if (String(body.get("confirm")) !== "DELETE") return Response.redirect(new URL("/users?delete=failed", request.url).toString(), 303);
  await env.esol_marking_db.prepare("DELETE FROM users WHERE id = ?").bind(id).run();
  return Response.redirect(new URL("/users", request.url).toString(), 303);
}

async function importUsers(request: Request, env: Env, identity: Identity): Promise<Response> {
  if (!isSuperuser(identity.user!)) return json({ error: "Forbidden" }, 403);

  const formData = await request.formData();
  const csvFile = formData.get("csvFile");
  const skipExisting = String(formData.get("skipExisting") ?? "true") === "true";

  if (!csvFile || !(csvFile instanceof File)) {
    return Response.redirect(new URL("/users?import=error&message=No+CSV+file+provided", request.url).toString(), 303);
  }

  const csvText = await csvFile.text();
  const lines = csvText.split(/\r?\n/).filter(l => l.trim());

  if (lines.length === 0) {
    return Response.redirect(new URL("/users?import=error&message=Empty+CSV+file", request.url).toString(), 303);
  }

  // Parse header
  const headers = parseCSVLine(lines[0]).map(h => h.trim().toLowerCase());
  const emailIdx = headers.indexOf("email");
  const roleIdx = headers.indexOf("role");
  const stageIdx = headers.indexOf("stage");

  if (emailIdx === -1 || roleIdx === -1) {
    return Response.redirect(new URL("/users?import=error&message=CSV+must+have+'email'+and+'role'+columns", request.url).toString(), 303);
  }

  const results = {
    created: 0,
    skipped: 0,
    errors: [] as { row: number; message: string }[]
  };

  // Get existing emails for duplicate checking
  const existingUsers = await env.esol_marking_db.prepare("SELECT lower(email) as email FROM users").all<{ email: string }>();
  const existingEmails = new Set(existingUsers.results.map(u => u.email));

  for (let i = 1; i < lines.length; i++) {
    const rowNum = i + 1;
    const values = parseCSVLine(lines[i]);

    const email = values[emailIdx]?.trim().toLowerCase() ?? "";
    const role = values[roleIdx]?.trim().toLowerCase() ?? "";
    const stage = stageIdx >= 0 ? values[stageIdx]?.trim().toLowerCase() ?? "" : "";

    if (!email) {
      results.errors.push({ row: rowNum, message: "Missing email" });
      continue;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      results.errors.push({ row: rowNum, message: `Invalid email format: ${email}` });
      continue;
    }

    // Check for duplicates
    if (existingEmails.has(email)) {
      if (skipExisting) {
        results.skipped++;
        continue;
      }
      // If not skipping, we'll try to update (not implemented - skip for now)
      results.skipped++;
      continue;
    }

    // Validate role
    if (!roles.includes(role as Role)) {
      results.errors.push({ row: rowNum, message: `Invalid role '${role}'. Must be one of: ${roles.join(", ")}` });
      continue;
    }

    // Determine stage
    let userStage: Stage | null = null;
    if (stage && stages.includes(stage as Stage)) {
      userStage = stage as Stage;
    } else {
      userStage = roleToStage(role as Role);
    }

    try {
      await env.esol_marking_db.prepare(
        "INSERT INTO users (id, email, role, stage) VALUES (?, ?, ?, ?)"
      ).bind(crypto.randomUUID(), email, role, userStage).run();
      results.created++;
      existingEmails.add(email);
    } catch (err: any) {
      results.errors.push({ row: rowNum, message: `Database error: ${err?.message || String(err)}` });
    }
  }

  const summary = `Created:${results.created},Skipped:${results.skipped},Errors:${results.errors.length}`;
  const errorDetails = results.errors.length > 0
    ? "&details=" + encodeURIComponent(results.errors.slice(0, 5).map(e => `Row ${e.row}: ${e.message}`).join("; ") + (results.errors.length > 5 ? `... and ${results.errors.length - 5} more` : ""))
    : "";

  return Response.redirect(
    new URL(`/users?import=success&summary=${encodeURIComponent(summary)}${errorDetails}`, request.url).toString(),
    303
  );
}

// Simple CSV parser handling quoted fields
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function renderUsers(identity: Identity, users: UserRecord[], importResult?: { status: string; summary: string; details?: string }) {
  const importSection = importResult?.status === "success"
    ? `<div class="alert alert-success">
        <strong>Import Complete:</strong> ${importResult.summary}
        ${importResult.details ? `<br><small style="color: #dc2626;">${escapeHtml(importResult.details)}</small>` : ""}
       </div>`
    : importResult?.status === "error"
    ? `<div class="alert alert-error"><strong>Import Failed:</strong> ${escapeHtml(importResult.summary)}</div>`
    : "";

  return pageShell("Users", `
    <main class="dashboard-shell">
      ${renderSidebar(identity, "users")}
      <section class="content">
        ${renderTopbar(identity, "Users")}
        ${importSection}
        <section class="panel">
          <p class="eyebrow">Create user</p>
          <form method="POST" action="/api/users" class="form-grid">
            <label>Email<input name="email" type="email" required placeholder="staff@example.org"></label>
            <label>Role<select name="role">${roles.map((role) => `<option value="${role}">${role === "assessor_iqa" ? "Assessor / IQA" : role}</option>`).join("")}</select></label>
            <label>Stage<select name="stage"><option value="">Auto</option>${stages.map((stage) => `<option value="${stage}">${stage}</option>`).join("")}</select></label>
            <button type="submit">Create user</button>
          </form>
        </section>
        <section class="panel">
          <p class="eyebrow">Import from CSV</p>
          <form method="POST" action="/api/users/import" enctype="multipart/form-data" class="form-grid import-form">
            <label class="file-input-label">
              <span>CSV File</span>
              <input type="file" name="csvFile" accept=".csv" required>
              <small>Required columns: <code>email</code>, <code>role</code>. Optional: <code>stage</code></small>
            </label>
            <label class="checkbox-label">
              <input type="checkbox" name="skipExisting" value="true" checked>
              Skip existing users
            </label>
            <div class="form-actions">
              <button type="submit" class="btn-secondary">Import Users</button>
              <a href="#" onclick="downloadTemplate()" class="btn-link">Download template CSV</a>
            </div>
          </form>
          <script>
            function downloadTemplate() {
              const csv = "email,role,stage\\nstaff1@example.org,assessor,assess\\nstaff2@example.org,iqa,iqa\\nstaff3@example.org,admin,\\n";
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'users_template.csv';
              a.click();
              URL.revokeObjectURL(url);
            }
          </script>
        </section>
        <section class="panel">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; flex-wrap:wrap; gap:1rem;">
            <p class="eyebrow" style="margin:0">All users</p>
            <div style="display:flex; gap:0.5rem; align-items:center; flex-wrap:wrap;">
              <input type="text" id="filter-user-name" placeholder="Search by email..." style="padding:0.4rem; border:1px solid #ccc; border-radius:4px;" oninput="applyUserFilters()">
              <select id="filter-user-role" style="padding:0.4rem; border:1px solid #ccc; border-radius:4px;" onchange="applyUserFilters()">
                <option value="">All Roles</option>
                ${roles.map(r => `<option value="${r}">${r}</option>`).join("")}
                <option value="student">student</option>
              </select>
            </div>
          </div>
          <div class="user-table" id="users-list">${users.map((user) => renderUserRow(user, identity.user!.id)).join("")}</div>
        </section>
        <script>
          function applyUserFilters() {
            const email = document.getElementById('filter-user-name').value.toLowerCase();
            const role = document.getElementById('filter-user-role').value;
            const rows = document.querySelectorAll('#users-list .user-row');
            rows.forEach(r => {
              const rEmail = r.dataset.email || '';
              const rRole = r.dataset.role || '';
              const matchEmail = email === '' || rEmail.includes(email);
              const matchRole = role === '' || rRole === role;
              r.style.display = (matchEmail && matchRole) ? '' : 'none';
            });
          }
        </script>
      </section>
    </main>

    <!-- Edit User Modal -->
    <div id="editUserModal" class="modal-overlay" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:1000;align-items:center;justify-content:center">
      <div class="modal-box" style="background:#fff;border-radius:12px;padding:2rem;max-width:480px;width:92%;box-shadow:0 12px 48px rgba(0,0,0,0.22)">
        <h2 style="margin-top:0">Edit User</h2>
        <p id="editUserEmail" style="color:var(--muted);margin-bottom:1.5rem"></p>
        <form id="editUserForm" method="POST" action="/api/users/update">
          <input type="hidden" id="editUserId" name="id">
          <div style="margin-bottom:1rem">
            <label style="display:block;font-size:0.875rem;font-weight:600;margin-bottom:0.5rem">Role</label>
            <select id="editUserRole" name="role" style="width:100%">
              ${roles.map(r => `<option value="${r}">${r === "assessor_iqa" ? "Assessor / IQA" : r}</option>`).join("")}
            </select>
          </div>
          <div style="margin-bottom:1.5rem">
            <label style="display:block;font-size:0.875rem;font-weight:600;margin-bottom:0.5rem">Stage</label>
            <select id="editUserStage" name="stage" style="width:100%">
              <option value="">Auto (from role)</option>
              ${stages.map(s => `<option value="${s}">${s}</option>`).join("")}
            </select>
          </div>
          <div style="display:flex;gap:0.75rem;justify-content:flex-end">
            <button type="button" class="secondary-btn" onclick="closeEditModal()">Cancel</button>
            <button type="submit" class="primary-btn">Save Changes</button>
          </div>
        </form>
      </div>
    </div>

    <script>
      function editUser(id, email, role, stage) {
        document.getElementById('editUserId').value = id;
        document.getElementById('editUserEmail').textContent = email;
        document.getElementById('editUserRole').value = role;
        document.getElementById('editUserStage').value = stage || '';
        document.getElementById('editUserModal').style.display = 'flex';
      }

      function closeEditModal() {
        document.getElementById('editUserModal').style.display = 'none';
      }

      document.getElementById('editUserModal').addEventListener('click', function(e) {
        if (e.target === this) closeEditModal();
      });
    </script>
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

function renderUserRow(user: UserRecord, currentUserId: string) {
  const isCurrentUser = user.id === currentUserId;
  const roleDisplay = user.role === "assessor_iqa" ? "Assessor / IQA" : user.role;
  const stageDisplay = user.stage ? ` (${user.stage})` : "";
  
  return `<div class="user-row" data-email="${escapeHtml(user.email.toLowerCase())}" data-role="${escapeHtml(user.role)}">
    <div class="user-info">
      <span class="user-email">${escapeHtml(user.email)}</span>
      <span class="role-badge">${roleDisplay}${stageDisplay}</span>
    </div>
    <div class="user-actions">
      ${!isCurrentUser ? `
        <button type="button" class="edit-btn" onclick="editUser('${user.id}', '${escapeHtml(user.email)}', '${user.role}', '${user.stage || ""}')">Edit</button>
        <form method="POST" action="/api/users/${user.id}/delete" style="display:inline"><input type="hidden" name="confirm" value="DELETE"><button type="submit" class="delete-btn" onclick="return confirm('Delete this user?')">Delete</button></form>
      ` : '<span class="current-user-badge">(You)</span>'}
    </div>
  </div>`;
}

function renderAccessPendingPage(identity: Identity) {
  return pageShell("Access pending", `<main class="auth-shell"><section class="auth-card"><div class="brand-mark">E</div><p class="eyebrow">Access pending</p><h1>User not found in D1</h1><p class="lede">You signed in as ${escapeHtml(identity.email)}, but a superuser needs to create your ESOLQA user record.</p><a class="primary-action" href="/logout">Sign out</a></section></main>`);
}

function renderAssessmentsPage(identity: Identity) {
  return pageShell("Assessments", `
    <main class="dashboard-shell">
      ${renderSidebar(identity, "assessments")}
      <section class="content">
        ${renderTopbar(identity, "Assessments")}
        <section class="panel">
          <p class="hint">Assessments is coming soon.</p>
        </section>
      </section>
    </main>
  `);
}

function renderForbiddenPage(identity: Identity) {
  return pageShell("Forbidden", `<main class="dashboard-shell">${renderSidebar(identity, "") }<section class="content">${renderTopbar(identity, "Forbidden")}<section class="panel"><h2>You do not have access to this page.</h2></section></section></main>`);
}

// ─── Learning Walks: data helpers ───────────────────────────────────────────

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
    e.academic_year, e.course_id, e.course_name, e.assessor_name, e.iqa_name, e.planned_date, e.due_date,
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
    e.academic_year, e.course_id, e.course_name, e.assessor_name, e.iqa_name, e.planned_date, e.due_date,
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

// ─── Learning Walks: page handlers ──────────────────────────────────────────

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

// ─── Learning Walks: renderers ────────────────────────────────────────────────

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
  if (count === 0) return `<div class="lw-bell">🔐</div>`;
  return `<div class="lw-bell lw-bell-active lw-blink" onclick="document.getElementById('lw-notif-panel').classList.toggle('hidden')" title="${count} unread notification(s)">
    🔐 <span class="lw-bell-count">${count}</span>
    <div id="lw-notif-panel" class="lw-notif-panel hidden">
      ${notifications.map(n => `
        <div class="lw-notif-item">
          <span>${escapeHtml(n.message)}</span>
          <form method="POST" action="/api/lw/notifications/${n.id}/read" style="display:inline">
            <button type="submit" class="lw-notif-dismiss">✔</button>
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
                  <span>Academic Year: ${escapeHtml(String(e.academic_year))} · Course: ${escapeHtml(e.course_name)} (${escapeHtml(e.course_id)})</span>
                  <span>Assessor: ${escapeHtml(e.assessor_name)} · IQA: ${escapeHtml(e.iqa_name)}</span>
                  <span>Planned: ${escapeHtml(e.planned_date)}${e.due_date ? ` · Due: ${escapeHtml(e.due_date)}` : ""}</span>
                </a>
                <div style="display:flex;align-items:center;gap:0.5rem">
                  ${renderLWStatusBadge(e.status, e.due_date)}
                  <button type="button"
                    class="lw-entry-download-btn"
                    title="Download / Print"
                    onclick="openDownloadModal('${e.id}', '${escapeHtml(e.template_title).replace(/'/g, "\\'")}')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  </button>
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

      // ── Download modal ──────────────────────────────────────
      let _dlEntryId = null;

      function openDownloadModal(entryId, title) {
        _dlEntryId = entryId;
        document.getElementById("lw-dl-title").textContent = title;
        document.getElementById("lw-download-modal").style.display = "flex";
      }

      function closeDownloadModal() {
        document.getElementById("lw-download-modal").style.display = "none";
        _dlEntryId = null;
      }

      function downloadAs(format) {
        if (!_dlEntryId) return;
        if (format === "pdf") {
          // Open print page in new tab; user triggers print-to-PDF from there
          const win = window.open("/api/lw/entries/" + _dlEntryId + "/download?format=pdf", "_blank");
          if (win) {
            win.addEventListener("load", function() {
              setTimeout(function() { win.print(); }, 400);
            });
          }
        } else {
          // CSV and HTML: trigger direct file download
          const a = document.createElement("a");
          a.href = "/api/lw/entries/" + _dlEntryId + "/download?format=" + format;
          a.click();
        }
        closeDownloadModal();
      }

      document.getElementById("lw-download-modal").addEventListener("click", function(e) {
        if (e.target === this) closeDownloadModal();
      });
    </script>

    <!-- Download Modal -->
    <div id="lw-download-modal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:1001;align-items:center;justify-content:center">
      <div class="lw-dl-modal-box">
        <h2 class="lw-dl-modal-title">Download / Print</h2>
        <p class="lw-dl-modal-sub">Select a format for: <strong id="lw-dl-title"></strong></p>
        <div class="lw-dl-options">
          <button type="button" class="lw-dl-option" onclick="downloadAs('csv')">
            <span class="lw-dl-icon">📊</span>
            <strong>CSV</strong>
            <span class="lw-dl-desc">Flat data file, opens in Excel or Google Sheets</span>
          </button>
          <button type="button" class="lw-dl-option" onclick="downloadAs('html')">
            <span class="lw-dl-icon">🌐</span>
            <strong>HTML</strong>
            <span class="lw-dl-desc">Formatted page, save or open in browser</span>
          </button>
          <button type="button" class="lw-dl-option" onclick="downloadAs('pdf')">
            <span class="lw-dl-icon">🖨️</span>
            <strong>PDF</strong>
            <span class="lw-dl-desc">Opens print dialog — save as PDF with page breaks</span>
          </button>
        </div>
        <button type="button" class="lw-dl-cancel" onclick="closeDownloadModal()">Cancel</button>
      </div>
    </div>
  `);
}

function renderLWTemplateBuilderPage(identity: Identity, template: LWTemplateWithQuestions | null, users: UserRecord[]): string {
  const isEdit = !!template;
  const templateId = template?.id ?? "";
  const title = template?.title ?? "";
  const description = template?.description ?? "";
  let questions = template?.questions ?? [];

  // Filter users by role for dropdowns
  const assessors = users.filter(u => u.role === "assessor" || u.role === "assessor_iqa" || u.role === "admin" || u.role === "superuser");
  const iqas = users.filter(u => u.role === "iqa" || u.role === "assessor_iqa" || u.role === "admin" || u.role === "superuser");

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
    { value: "yes_no", label: "Yes/No", icon: "✔", desc: "Simple yes or no choice" },
    { value: "rag", label: "Green/Amber/Red", icon: "●", desc: "RAG status indicator" },
    { value: "ggaw", label: "Gold/Green/Amber/White", icon: "◆", desc: "Extended GGAW rating" },
    { value: "single_choice", label: "MCQ (One Answer)", icon: "○", desc: "Multiple choice, single select" },
    { value: "multiple_choice", label: "Choices (Multiple)", icon: "☐", desc: "Tick multiple options" },
    { value: "dropdown", label: "Dropdown", icon: "▼", desc: "Select from dropdown" },
    { value: "text", label: "Text", icon: "T", desc: "Short text answer" },
    { value: "textarea", label: "Long Text", icon: "¶", desc: "Paragraph response" },
    { value: "date", label: "Date", icon: "📅", desc: "Date picker" },
    { value: "number", label: "Number", icon: "#", desc: "Numeric input" },
    { value: "ranking", label: "Ranking", icon: "⇅", desc: "Order items by drag" },
    { value: "rating", label: "Rating (0-5)", icon: "★", desc: "Star rating scale" },
    { value: "time", label: "Time", icon: "🕒", desc: "Hour / Minute / AM·PM" },
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
        // Filter out hidden cards (e.g., filtered by search or type picker)
        const cards = Array.from(document.querySelectorAll('.lwfb-question-card')).filter(c => c.offsetParent !== null);

        for (let i = 0; i < cards.length; i++) {
          const card = cards[i];
          const qId = card.dataset.questionId;
          const qType = card.querySelector('.lwfb-q-type-select').value;
          // Select only the visible text input (not the hidden one in section-body)
          const textInput = card.querySelector('.lwfb-normal-body:not(.hidden) .lwfb-q-text') || card.querySelector('.lwfb-section-body:not(.hidden) .lwfb-q-text') || card.querySelector('.lwfb-q-text');
          const qText = textInput?.value?.trim() || '';
          const qRequired = qType === 'section' ? false : card.querySelector('.lwfb-q-required').checked;

          if (!qText) {
            const qNum = card.querySelector('.lwfb-q-number')?.textContent || (i + 1);
            const input = card.querySelector('.lwfb-q-text');
            card.scrollIntoView({ behavior: 'auto', block: 'center' });
            input?.focus();
            setTimeout(() => alert(\`Question \${qNum} is missing \${qType === 'section' ? 'a heading' : 'text'}. Please scroll up to find it.\`), 100);
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

// ─── Learning Walk Entry Form ──────────────────────────────────────────────

function renderLWEntryFormPage(identity: Identity, template: LWTemplateWithQuestions, users: UserRecord[]): string {
  const user = identity.user!;
  const assessors = users.filter(u => u.role === "assessor" || u.role === "assessor_iqa" || u.role === "admin" || u.role === "superuser");
  const iqas = users.filter(u => u.role === "iqa" || u.role === "assessor_iqa" || u.role === "admin" || u.role === "superuser");

  // Render fixed header fields
  const fixedFieldsHtml = `
    <div class="lw-entry-section">
      <h3 class="lw-entry-section-title">Course Information</h3>
      <div class="lw-entry-grid">
        <div class="lw-entry-field" style="grid-column:1/-1">
          <label class="lw-entry-label" for="course_picker">Select from Learner Track</label>
          <select id="course_picker" class="lw-entry-select">
            <option value="">-- choose a course or type manually below --</option>
          </select>
          <span class="lw-entry-hint">Loading courses from Learner Track...</span>
        </div>
        <div class="lw-entry-field" style="grid-column:1/-1;display:flex;flex-direction:row;gap:0.75rem;align-items:flex-end;flex-wrap:wrap">
          <div style="flex:1;min-width:180px">
            <label class="lw-entry-label" for="academic_year">Academic Year * <span class="lw-entry-required">(YYYY, e.g. 2025)</span></label>
            <input type="number" id="academic_year" name="academic_year" class="lw-entry-input" value="${getCurrentAcademicYear()}" min="2000" max="2100" required placeholder="YYYY">
          </div>
          <button type="button" id="refresh_courses" class="secondary-action">Refresh courses</button>
          <div style="flex:1;min-width:200px">
            <label class="lw-entry-label" for="course_search">Search by Course ID</label>
            <input type="text" id="course_search" class="lw-entry-input" placeholder="e.g. 10534">
          </div>
          <button type="button" id="find_course_btn" class="secondary-action">Find course</button>
        </div>
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
            <label class="lw-entry-radio"><input type="radio" name="${answerId}" value="yes" ${requiredAttr}> <span>Yes</span></label>
            <label class="lw-entry-radio"><input type="radio" name="${answerId}" value="no" ${requiredAttr}> <span>No</span></label>
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
          <label class="lw-entry-checkbox"><input type="checkbox" name="${answerId}[]" value="${escapeHtml(o.value)}"> <span>${escapeHtml(o.label)}</span></label>
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
      async function loadCourses(year){
        const sel = document.getElementById('course_picker');
        const hint = sel.parentElement.querySelector('.lw-entry-hint');
        try {
          const r = await fetch('/api/courses/learnertrack?academicYear=' + encodeURIComponent(year));
          const data = await r.json();
          if (!Array.isArray(data)) throw new Error(data.error || 'Unexpected response');
          sel.innerHTML = '<option value="">-- choose a course or type manually below --</option>';
          data.forEach(c => {
            const code = c.CourseCode || '';
            const title = c.CourseTitle || '';
            const opt = document.createElement('option');
            opt.value = JSON.stringify({course_id: code, course_name: title});
            opt.dataset.courseInstanceId = c.ID != null ? String(c.ID) : '';
            opt.textContent = (title ? title + ' ' : '') + (code ? '(' + code + ')' : '');
            sel.appendChild(opt);
          });
          if (hint) hint.textContent = data.length + ' courses loaded for academic year ' + year + '.';
        } catch (err) {
          if (hint) hint.textContent = 'Could not load courses. You can still type the course details manually.';
          console.error('Course load error:', err);
        }
      }

      document.getElementById('course_picker').addEventListener('change', function () {
        if (!this.value) return;
        const v = JSON.parse(this.value);
        document.getElementById('course_id').value = v.course_id || '';
        document.getElementById('course_name').value = v.course_name || '';
      });

      loadCourses(document.getElementById('academic_year').value);

      document.getElementById('refresh_courses').addEventListener('click', () => {
        const year = document.getElementById('academic_year').value;
        if (!year || year.length !== 4) { alert('Please enter a valid YYYY academic year'); return; }
        const sel = document.getElementById('course_picker');
        const hint = sel.parentElement.querySelector('.lw-entry-hint');
        if (hint) hint.textContent = 'Loading courses for ' + year + '...';
        loadCourses(year);
      });

      let academicYearDebounce;
      document.getElementById('academic_year').addEventListener('input', function () {
        const year = this.value;
        clearTimeout(academicYearDebounce);
        academicYearDebounce = setTimeout(() => {
          if (!year || year.length !== 4) return;
          const sel = document.getElementById('course_picker');
          const hint = sel.parentElement.querySelector('.lw-entry-hint');
          if (hint) hint.textContent = 'Loading courses for ' + year + '...';
          loadCourses(year);
        }, 500);
      });

      document.getElementById('find_course_btn').addEventListener('click', async () => {
        const search = document.getElementById('course_search');
        const id = search.value.trim();
        if (!id) { alert('Please enter a Course ID to search for.'); return; }
        const sel = document.getElementById('course_picker');
        const hint = sel.parentElement.querySelector('.lw-entry-hint');
        if (hint) hint.textContent = 'Searching for course ' + id + '...';
        try {
          const r = await fetch('/api/courses/learnertrack?courseinstanceid=' + encodeURIComponent(id));
          const data = await r.json();
          if (!Array.isArray(data) || data.length === 0) {
            if (hint) hint.textContent = 'No course found with ID ' + id + '. You can still type the details manually.';
            return;
          }
          const c = data[0];
          document.getElementById('course_id').value = c.CourseCode || '';
          document.getElementById('course_name').value = c.CourseTitle || '';
          if (c.AcademicYear != null) {
            document.getElementById('academic_year').value = c.AcademicYear;
            await loadCourses(c.AcademicYear);
          }
          const match = Array.from(sel.options).find(o => o.dataset.courseInstanceId === String(c.ID));
          if (match) { sel.value = match.value; }
          if (hint) hint.textContent = 'Found: ' + (c.CourseTitle || '') + ' (' + (c.CourseCode || '') + ').';
        } catch (err) {
          if (hint) hint.textContent = 'Course search failed. You can still type the details manually.';
          console.error('Course search error:', err);
        }
      });

      async function submitEntry(e) {
        e.preventDefault();

        const templateId = document.getElementById('template_id').value;
        const academicYear = document.getElementById('academic_year').value;
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
          academic_year: parseInt(academicYear, 10),
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

// ─── Learning Walk Template Builder ────────────────────────────────────────

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
  } catch (err: any) {
    console.error("saveLWTemplate error:", err);
    const errorMessage = err?.message || String(err);
    return json({ error: "Failed to save template: " + errorMessage }, 500);
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
  } catch (err: any) {
    console.error("updateLWTemplate error:", err);
    const errorMessage = err?.message || String(err);
    return json({ error: "Failed to update template: " + errorMessage }, 500);
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

// ─── Learning Walk Entry Creation ──────────────────────────────────────────

async function renderLWEntryForm(request: Request, env: Env, identity: Identity): Promise<Response> {
  const url = new URL(request.url);
  const templateId = url.searchParams.get("templateId");

  if (!templateId) {
    return new Response(null, { status: 302, headers: { Location: "/learning-walks/entries/new" } });
  }

  // Check permission (IQA, Admin, Superuser can create entries)
  const user = identity.user!;
  const canCreateEntry = user.role === "iqa" || user.role === "assessor_iqa" || user.role === "admin" || user.role === "superuser";
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
    "SELECT id, email, role FROM users WHERE role IN ('assessor', 'iqa', 'assessor_iqa', 'admin', 'superuser') ORDER BY email ASC"
  ).all<UserRecord>();

  return htmlResponse(renderLWEntryFormPage(identity, template, users.results));
}

async function saveLWEntry(request: Request, env: Env, identity: Identity): Promise<Response> {
  const user = identity.user!;
  const canCreateEntry = user.role === "iqa" || user.role === "assessor_iqa" || user.role === "admin" || user.role === "superuser";
  if (!canCreateEntry) {
    return json({ error: "Forbidden" }, 403);
  }

  try {
    const body = await request.json() as {
      template_id: string;
      academic_year: number;
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
        id, template_id, academic_year, course_id, course_name, assessor_name, iqa_name,
        planned_date, due_date, allocated_iqa_id, allocated_assessor_id,
        status, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      entryId,
      body.template_id,
      body.academic_year ?? getCurrentAcademicYear(),
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
            <a href="/learning-walks" class="small-action" style="width:auto;padding:0.5rem 1rem;">↵ Back</a>
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
      // Auto-expand textareas (fallback for browsers without field-sizing:content)
      function autoExpand(el) {
        el.style.height = 'auto';
        el.style.height = el.scrollHeight + 'px';
      }
      document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('.lw-entry-textarea').forEach(function(el) {
          autoExpand(el);
          el.addEventListener('input', function() { autoExpand(this); });
        });
      });

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

async function downloadLWEntry(request: Request, env: Env, identity: Identity, entryId: string): Promise<Response> {
  const auth = await getLWEntryWithAuth(env, identity, entryId);
  if (!auth) return new Response("Not found or access denied", { status: 404 });

  const { entry } = auth;
  const url = new URL(request.url);
  const format = url.searchParams.get("format") || "csv";

  // Fetch questions + answers
  const questionsResult = await env.esol_marking_db.prepare(
    `SELECT * FROM lw_template_questions WHERE template_id = ? ORDER BY sort_order ASC`
  ).bind(entry.template_id).all();
  const questions = questionsResult.results as any[];

  const answersResult = await env.esol_marking_db.prepare(
    `SELECT question_id, answer FROM lw_answers WHERE entry_id = ?`
  ).bind(entryId).all();
  const answersMap = new Map((answersResult.results as any[]).map((a: any) => [a.question_id, a.answer]));

  // Fetch comments
  const commentsResult = await env.esol_marking_db.prepare(
    `SELECT c.comment, c.author_role, c.created_at, u.email as author_email
     FROM lw_comments c LEFT JOIN users u ON u.id = c.author_id
     WHERE c.entry_id = ? ORDER BY c.created_at ASC`
  ).bind(entryId).all();
  const comments = commentsResult.results as any[];

  const statusLabels: Record<string, string> = {
    pending: "Pending", iqa_completed: "IQA Completed",
    assessor_responded: "Assessor Responded", complete: "Complete"
  };

  if (format === "csv") {
    const rows: string[] = [
      ["Field", "Value"],
      ["Template", entry.template_title],
      ["Status", statusLabels[entry.status] || entry.status],
      ["Course ID", entry.course_id],
      ["Academic Year", String(entry.academic_year)],
      ["Course Name", entry.course_name],
      ["Assessor", entry.assessor_name],
      ["IQA", entry.iqa_name],
      ["Planned Date", entry.planned_date],
      ["Due Date", entry.due_date || ""],
      ["Created At", entry.created_at],
      ["", ""],
      ["--- Questions & Answers ---", ""],
    ].map(r => r.map((v: string) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","));

    for (const q of questions) {
      if (q.question_type === "section") {
        rows.push(`"[SECTION] ${String(q.question_text).replace(/"/g, '""')}",""`);
        continue;
      }
      const answer = answersMap.get(q.id) || "";
      rows.push(`"${String(q.question_text).replace(/"/g, '""')}","${String(answer).replace(/"/g, '""')}"`);
    }

    if (comments.length > 0) {
      rows.push(`"",""`);
      rows.push(`"--- Comments ---",""`);
      for (const c of comments) {
        const ts = new Date(c.created_at).toLocaleString("en-GB");
        rows.push(`"[${c.author_role}] ${c.author_email} (${ts})","${String(c.comment).replace(/"/g, '""')}"`);
      }
    }

    const slug = entry.template_title.replace(/[^a-z0-9]/gi, "-").toLowerCase();
    return new Response(rows.join("\r\n"), {
      headers: {
        "Content-Type": "text/csv;charset=utf-8",
        "Content-Disposition": `attachment; filename="learning-walk-${slug}.csv"`
      }
    });
  }

  // HTML / PDF — generate a styled, print-ready page
  const isPdf = format === "pdf";

  const metaRows = [
    ["Template", entry.template_title],
    ["Status", statusLabels[entry.status] || entry.status],
    ["Academic Year", String(entry.academic_year)],
    ["Course", `${entry.course_name} (${entry.course_id})`],
    ["Assessor", entry.assessor_name],
    ["IQA", entry.iqa_name],
    ["Planned Date", entry.planned_date],
    ...(entry.due_date ? [["Due Date", entry.due_date]] : []),
  ];

  const qaHtml = questions.map((q: any) => {
    if (q.question_type === "section") {
      return `<div class="print-section-divider">
        <h3 class="print-section-heading">${escapeHtml(q.question_text)}</h3>
        ${q.text_entry_label ? `<p class="print-section-desc">${escapeHtml(q.text_entry_label)}</p>` : ""}
      </div>`;
    }
    const answer = answersMap.get(q.id) || "";
    let displayAnswerHtml: string;
    if (!answer) {
      displayAnswerHtml = '<span class="print-no-answer">No answer provided</span>';
    } else if (q.question_type === "time") {
      const parts = answer.split(":");
      displayAnswerHtml = escapeHtml(`${parts[0] || ""}:${parts[1] || ""} ${parts[2] || ""}`);
    } else {
      displayAnswerHtml = escapeHtml(String(answer));
    }
    return `<div class="print-qa">
      <p class="print-question">${escapeHtml(q.question_text)}${q.is_required ? ' <span class="print-req">*</span>' : ""}</p>
      <p class="print-answer">${displayAnswerHtml}</p>
    </div>`;
  }).join("");

  const commentsHtml = comments.length > 0 ? `
    <div class="print-section-block print-comments">
      <h2 class="print-block-title">Comments & Paper Trail</h2>
      ${comments.map((c: any) => `
        <div class="print-comment">
          <span class="print-comment-meta">[${escapeHtml(c.author_role)}] ${escapeHtml(c.author_email || "Unknown")} &mdash; ${new Date(c.created_at).toLocaleString("en-GB")}</span>
          <p class="print-comment-body">${escapeHtml(c.comment)}</p>
        </div>
      `).join("")}
    </div>` : "";

  const printHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Learning Walk — ${escapeHtml(entry.template_title)}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#1a1a1a;background:#fff;padding:1.5cm 2cm}
  h1{font-size:18pt;font-weight:700;margin-bottom:0.25rem;color:#cc0040}
  .print-org{font-size:9pt;color:#666;margin-bottom:1.25rem;text-transform:uppercase;letter-spacing:.05em}
  .print-meta-table{width:100%;border-collapse:collapse;margin-bottom:1.5rem;font-size:10pt}
  .print-meta-table td{padding:0.35rem 0.6rem;border:1px solid #ddd}
  .print-meta-table td:first-child{font-weight:700;background:#f5f5f5;width:28%;white-space:nowrap}
  .print-section-block{margin-bottom:1.5rem}
  .print-block-title{font-size:13pt;font-weight:700;margin-bottom:0.75rem;padding-bottom:0.35rem;border-bottom:2px solid #cc0040;color:#cc0040}
  .print-section-divider{margin:1.25rem 0 0.75rem;padding-bottom:0.4rem;border-bottom:1.5px solid #bbb}
  .print-section-heading{font-size:12pt;font-weight:700;color:#1a1a1a}
  .print-section-desc{font-size:10pt;color:#555;margin-top:0.2rem}
  .print-qa{margin-bottom:0.9rem;padding:0.6rem 0.75rem;border:1px solid #e8e8e8;border-left:3px solid #cc0040;border-radius:3px;page-break-inside:avoid}
  .print-question{font-size:10.5pt;font-weight:600;margin-bottom:0.3rem}
  .print-req{color:#cc0040}
  .print-answer{font-size:10.5pt;color:#1a1a1a;background:#fafafa;padding:0.4rem 0.5rem;border-radius:2px;min-height:1.5rem}
  .print-no-answer{color:#999;font-style:italic}
  .print-comments{margin-top:1.5rem}
  .print-comment{margin-bottom:0.75rem;padding:0.6rem 0.75rem;border-left:3px solid #888;background:#f9f9f9;page-break-inside:avoid}
  .print-comment-meta{font-size:9pt;color:#555;display:block;margin-bottom:0.3rem}
  .print-comment-body{font-size:10pt;line-height:1.5}
  .print-footer{margin-top:2rem;padding-top:0.75rem;border-top:1px solid #ccc;font-size:8.5pt;color:#888}
  @media print{
    body{padding:1cm 1.5cm}
    .no-print{display:none}
    .print-qa{page-break-inside:avoid}
    .print-comment{page-break-inside:avoid}
    .print-section-divider{page-break-after:avoid}
    .print-block-title{page-break-after:avoid}
    h1{color:#cc0040!important}
    .print-block-title{color:#cc0040!important}
  }
</style>
</head>
<body>
  ${isPdf ? `<button class="no-print" onclick="window.print()" style="margin-bottom:1rem;padding:0.5rem 1.25rem;background:#cc0040;color:#fff;border:none;border-radius:6px;font-size:11pt;cursor:pointer">🖨️ Print / Save as PDF</button>` : ""}
  <h1>Learning Walk Report</h1>
  <p class="print-org">ESOLQA &mdash; Printed ${new Date().toLocaleString("en-GB")}</p>

  <div class="print-section-block">
    <h2 class="print-block-title">Submission Details</h2>
    <table class="print-meta-table">
      ${metaRows.map(([k, v]) => `<tr><td>${escapeHtml(k)}</td><td>${escapeHtml(String(v ?? ""))}</td></tr>`).join("")}
    </table>
  </div>

  <div class="print-section-block">
    <h2 class="print-block-title">Questions &amp; Answers</h2>
    ${qaHtml}
  </div>

  ${commentsHtml}

  <div class="print-footer">Generated by ESOLQA &bull; ${escapeHtml(entry.template_title)} &bull; ID: ${escapeHtml(entryId)}</div>
</body>
</html>`;

  const slug = entry.template_title.replace(/[^a-z0-9]/gi, "-").toLowerCase();
  const headers: Record<string, string> = { "Content-Type": "text/html;charset=utf-8" };
  if (!isPdf) {
    headers["Content-Disposition"] = `attachment; filename="learning-walk-${slug}.html"`;
  }
  return new Response(printHtml, { headers });
}

// ─── IQA Forms: data helpers ─────────────────────────────────────────────────

async function getIQAFTemplates(env: Env): Promise<IQAFTemplateRecord[]> {
  const r = await env.esol_marking_db.prepare("SELECT id, title, description, is_active, created_by, created_at FROM iqaf_templates WHERE is_active = 1 ORDER BY created_at DESC").all<IQAFTemplateRecord>();
  return r.results;
}

async function getIQAFTemplateWithQuestions(env: Env, templateId: string): Promise<IQAFTemplateWithQuestions | null> {
  const tmpl = await env.esol_marking_db.prepare("SELECT id, title, description, is_active, created_by, created_at FROM iqaf_templates WHERE id = ? LIMIT 1").bind(templateId).first<IQAFTemplateRecord>();
  if (!tmpl) return null;
  const qs = await env.esol_marking_db.prepare("SELECT id, template_id, question_text, question_type, options, has_text_entry, text_entry_label, is_required, sort_order FROM iqaf_template_questions WHERE template_id = ? ORDER BY sort_order ASC").bind(templateId).all<IQAFTemplateQuestion & { options: string | null }>();
  const questions: IQAFTemplateQuestion[] = qs.results.map(q => ({ ...q, options: q.options ? JSON.parse(q.options) as QuestionOption[] : null }));
  return { ...tmpl, questions };
}

async function getIQAFEntries(env: Env, user: UserRecord, search: string): Promise<IQAFEntryRecord[]> {
  const like = `%${search}%`;
  const isPrivileged = user.role === "admin" || user.role === "superuser";
  const r = await env.esol_marking_db.prepare(`SELECT e.id, e.template_id, t.title AS template_title,
    e.academic_year, e.course_id, e.course_name, e.assessor_name, e.iqa_name, e.planned_date, e.due_date,
    e.status, e.allocated_assessor_id, e.allocated_iqa_id, e.allocated_eqa_id,
    assr.email AS assessor_email, iqa.email AS iqa_email, eqa.email AS eqa_email,
    e.created_by, e.created_at, e.assessor_submitted_at, e.iqa_reviewed_at, e.eqa_signed_at
    FROM iqaf_entries e
    JOIN iqaf_templates t ON t.id = e.template_id
    LEFT JOIN users assr ON assr.id = e.allocated_assessor_id
    LEFT JOIN users iqa ON iqa.id = e.allocated_iqa_id
    LEFT JOIN users eqa ON eqa.id = e.allocated_eqa_id
    WHERE (? = 1 OR e.allocated_assessor_id = ? OR e.allocated_iqa_id = ? OR e.allocated_eqa_id = ?)
    AND (? = '' OR e.course_name LIKE ? OR e.assessor_name LIKE ? OR e.iqa_name LIKE ? OR t.title LIKE ?)
    ORDER BY e.created_at DESC`).bind(isPrivileged ? 1 : 0, user.id, user.id, user.id, search, like, like, like, like).all<IQAFEntryRecord>();
  return r.results;
}

async function getIQAFEntry(env: Env, user: UserRecord, id: string): Promise<IQAFEntryRecord | null> {
  const isPrivileged = user.role === "admin" || user.role === "superuser";
  return env.esol_marking_db.prepare(`SELECT e.id, e.template_id, t.title AS template_title,
    e.academic_year, e.course_id, e.course_name, e.assessor_name, e.iqa_name, e.planned_date, e.due_date,
    e.status, e.allocated_assessor_id, e.allocated_iqa_id, e.allocated_eqa_id,
    assr.email AS assessor_email, iqa.email AS iqa_email, eqa.email AS eqa_email,
    e.created_by, e.created_at, e.assessor_submitted_at, e.iqa_reviewed_at, e.eqa_signed_at
    FROM iqaf_entries e
    JOIN iqaf_templates t ON t.id = e.template_id
    LEFT JOIN users assr ON assr.id = e.allocated_assessor_id
    LEFT JOIN users iqa ON iqa.id = e.allocated_iqa_id
    LEFT JOIN users eqa ON eqa.id = e.allocated_eqa_id
    WHERE e.id = ? AND (? = 1 OR e.allocated_assessor_id = ? OR e.allocated_iqa_id = ? OR e.allocated_eqa_id = ?)
    LIMIT 1`).bind(id, isPrivileged ? 1 : 0, user.id, user.id, user.id).first<IQAFEntryRecord>();
}

async function getIQAFAnswers(env: Env, entryId: string): Promise<IQAFAnswer[]> {
  return (await env.esol_marking_db.prepare("SELECT question_id, answer FROM iqaf_answers WHERE entry_id = ?").bind(entryId).all<IQAFAnswer>()).results;
}

async function getIQAFComments(env: Env, entryId: string): Promise<IQAFComment[]> {
  return (await env.esol_marking_db.prepare("SELECT c.id, c.entry_id, c.author_id, c.author_role, c.comment, c.created_at, u.email AS author_email FROM iqaf_comments c LEFT JOIN users u ON u.id = c.author_id WHERE c.entry_id = ? ORDER BY c.created_at ASC").bind(entryId).all<IQAFComment>()).results;
}

async function getIQAFNotifications(env: Env, userId: string): Promise<IQAFNotification[]> {
  return (await env.esol_marking_db.prepare("SELECT id, user_id, entry_id, message, is_read, created_at FROM iqaf_notifications WHERE user_id = ? AND is_read = 0 ORDER BY created_at DESC").bind(userId).all<IQAFNotification>()).results;
}

async function createIQAFNotification(env: Env, userId: string, entryId: string, message: string) {
  await env.esol_marking_db.prepare("INSERT INTO iqaf_notifications (id, user_id, entry_id, message) VALUES (?, ?, ?, ?)").bind(crypto.randomUUID(), userId, entryId, message).run();
}

// ─── IQA Forms: page handlers ────────────────────────────────────────────────

async function renderIQAFDashboard(request: Request, env: Env, identity: Identity): Promise<Response> {
  const url = new URL(request.url);
  const search = url.searchParams.get("q") ?? "";
  const user = identity.user!;
  const [entries, templates, notifications] = await Promise.all([
    getIQAFEntries(env, user, search),
    getIQAFTemplates(env),
    getIQAFNotifications(env, user.id),
  ]);
  return htmlResponse(renderIQAFDashboardPage(identity, entries, templates, notifications, search));
}

async function renderIQAFEntryTemplateSelector(request: Request, env: Env, identity: Identity): Promise<Response> {
  if (!canCreateForms(identity.user!)) return new Response(null, { status: 302, headers: { Location: "/iqa-forms" } });
  const templates = await getIQAFTemplates(env);
  return htmlResponse(renderIQAFEntryTemplateSelectorPage(identity, templates));
}

async function renderIQAFTemplateBuilder(request: Request, env: Env, identity: Identity): Promise<Response> {
  if (!canCreateForms(identity.user!)) return htmlResponse(renderForbiddenPage(identity), 403);
  const url = new URL(request.url);
  const segments = url.pathname.split("/");
  const templateId = segments[3] !== "build" ? segments[3] : null;
  const [template, usersResult] = await Promise.all([
    templateId ? getIQAFTemplateWithQuestions(env, templateId) : Promise.resolve(null),
    env.esol_marking_db.prepare("SELECT id, email, role, stage FROM users ORDER BY email ASC").all<UserRecord>(),
  ]);
  return htmlResponse(renderIQAFTemplateBuilderPage(identity, template, usersResult.results));
}

async function renderIQAFEntryForm(request: Request, env: Env, identity: Identity): Promise<Response> {
  if (!canCreateForms(identity.user!)) return new Response(null, { status: 302, headers: { Location: "/iqa-forms" } });
  const url = new URL(request.url);
  const templateId = url.searchParams.get("templateId") ?? "";
  const [template, usersResult] = await Promise.all([
    getIQAFTemplateWithQuestions(env, templateId),
    env.esol_marking_db.prepare("SELECT id, email, role, stage FROM users ORDER BY email ASC").all<UserRecord>(),
  ]);
  if (!template) return htmlResponse(renderNotFoundPage(), 404);
  return htmlResponse(renderIQAFEntryFormPage(identity, template, usersResult.results));
}

async function renderIQAFEntryView(request: Request, env: Env, identity: Identity, entryId: string): Promise<Response> {
  const user = identity.user!;
  const entry = await getIQAFEntry(env, user, entryId);
  if (!entry) return htmlResponse(renderNotFoundPage(), 404);
  const [template, answers, comments, usersResult] = await Promise.all([
    getIQAFTemplateWithQuestions(env, entry.template_id),
    getIQAFAnswers(env, entryId),
    getIQAFComments(env, entryId),
    env.esol_marking_db.prepare("SELECT id, email, role, stage FROM users ORDER BY email ASC").all<UserRecord>(),
  ]);
  if (!template) return htmlResponse(renderNotFoundPage(), 404);
  const isPrivileged = user.role === "admin" || user.role === "superuser";
  const canEdit = isPrivileged || entry.allocated_assessor_id === user.id || entry.allocated_iqa_id === user.id || entry.allocated_eqa_id === user.id;
  return htmlResponse(renderIQAFEntryViewPage(identity, entry, template, answers, comments, usersResult.results, canEdit, isPrivileged));
}

// ─── IQA Forms: API handlers ─────────────────────────────────────────────────

async function saveIQAFEntry(request: Request, env: Env, identity: Identity): Promise<Response> {
  if (!canCreateForms(identity.user!)) return json({ error: "Forbidden" }, 403);
  try {
    const body = await request.json() as { template_id: string; academic_year: number; course_id: string; course_name: string; assessor_id: string; iqa_id: string; eqa_id?: string; planned_date: string; due_date?: string; answers: Record<string, string> };
    const { template_id, academic_year, course_id, course_name, assessor_id, iqa_id, eqa_id, planned_date, due_date, answers } = body;
    if (!template_id || !academic_year || !course_id || !course_name || !assessor_id || !iqa_id || !planned_date) return json({ error: "Missing required fields" }, 400);
    const [assessorUser, iqaUser] = await Promise.all([
      env.esol_marking_db.prepare("SELECT id, email FROM users WHERE id = ?").bind(assessor_id).first<{ id: string; email: string }>(),
      env.esol_marking_db.prepare("SELECT id, email FROM users WHERE id = ?").bind(iqa_id).first<{ id: string; email: string }>(),
    ]);
    if (!assessorUser || !iqaUser) return json({ error: "Invalid assessor or IQA" }, 400);
    const entryId = crypto.randomUUID();
    await env.esol_marking_db.prepare("INSERT INTO iqaf_entries (id, template_id, academic_year, course_id, course_name, assessor_name, iqa_name, planned_date, due_date, allocated_assessor_id, allocated_iqa_id, allocated_eqa_id, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").bind(entryId, template_id, academic_year ?? getCurrentAcademicYear(), course_id, course_name, assessorUser.email, iqaUser.email, planned_date, due_date || null, assessor_id, iqa_id, eqa_id || null, identity.user!.id).run();
    if (answers && typeof answers === "object") {
      for (const [qId, ans] of Object.entries(answers)) {
        if (ans !== null && ans !== undefined && String(ans).trim() !== "") {
          await env.esol_marking_db.prepare("INSERT INTO iqaf_answers (id, entry_id, question_id, answer, answered_by, answered_by_role) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(entry_id, question_id) DO UPDATE SET answer = excluded.answer").bind(crypto.randomUUID(), entryId, qId, String(ans), identity.user!.id, identity.user!.role).run();
        }
      }
    }
    await createIQAFNotification(env, assessor_id, entryId, `New IQA Form allocated: ${course_name}`);
    await createIQAFNotification(env, iqa_id, entryId, `You are the IQA for a new form: ${course_name}`);
    return json({ success: true, id: entryId });
  } catch (err: any) { return json({ error: "Failed to save: " + (err?.message || String(err)) }, 500); }
}

async function updateIQAFEntry(request: Request, env: Env, identity: Identity, entryId: string): Promise<Response> {
  const user = identity.user!;
  const entry = await getIQAFEntry(env, user, entryId);
  if (!entry) return json({ error: "Not found" }, 404);
  const isPrivileged = user.role === "admin" || user.role === "superuser";
  if (!isPrivileged && entry.allocated_assessor_id !== user.id && entry.allocated_iqa_id !== user.id && entry.allocated_eqa_id !== user.id) return json({ error: "Forbidden" }, 403);
  try {
    const body = await request.json() as { answers?: Record<string, string>; status?: IQAFEntryStatus };
    if (body.answers) {
      for (const [qId, ans] of Object.entries(body.answers)) {
        await env.esol_marking_db.prepare("INSERT INTO iqaf_answers (id, entry_id, question_id, answer, answered_by, answered_by_role) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(entry_id, question_id) DO UPDATE SET answer = excluded.answer, answered_by = excluded.answered_by, answered_by_role = excluded.answered_by_role, updated_at = CURRENT_TIMESTAMP").bind(crypto.randomUUID(), entryId, qId, String(ans ?? ""), user.id, user.role).run();
      }
    }
    const validStatuses: IQAFEntryStatus[] = ["pending", "assessor_submitted", "iqa_reviewed", "eqa_signed", "complete"];
    if (body.status && validStatuses.includes(body.status)) {
      let tsCol = "";
      if (body.status === "assessor_submitted") tsCol = ", assessor_submitted_at = CURRENT_TIMESTAMP";
      else if (body.status === "iqa_reviewed") tsCol = ", iqa_reviewed_at = CURRENT_TIMESTAMP";
      else if (body.status === "eqa_signed") tsCol = ", eqa_signed_at = CURRENT_TIMESTAMP";
      await env.esol_marking_db.prepare(`UPDATE iqaf_entries SET status = ?${tsCol} WHERE id = ?`).bind(body.status, entryId).run();
      if (entry.allocated_iqa_id && body.status === "assessor_submitted") await createIQAFNotification(env, entry.allocated_iqa_id, entryId, `${entry.course_name}: assessor has submitted responses`);
      if (entry.allocated_assessor_id && body.status === "iqa_reviewed") await createIQAFNotification(env, entry.allocated_assessor_id, entryId, `${entry.course_name}: IQA has reviewed your form`);
    }
    return json({ success: true });
  } catch (err: any) { return json({ error: "Failed to update: " + (err?.message || String(err)) }, 500); }
}

async function addIQAFEntryComment(request: Request, env: Env, identity: Identity, entryId: string): Promise<Response> {
  const user = identity.user!;
  const entry = await getIQAFEntry(env, user, entryId);
  if (!entry) return json({ error: "Not found" }, 404);
  try {
    const body = await request.json() as { comment: string };
    if (!body.comment?.trim()) return json({ error: "Comment is required" }, 400);
    await env.esol_marking_db.prepare("INSERT INTO iqaf_comments (id, entry_id, author_id, author_role, comment) VALUES (?, ?, ?, ?, ?)").bind(crypto.randomUUID(), entryId, user.id, user.role, body.comment.trim()).run();
    return json({ success: true });
  } catch (err: any) { return json({ error: "Failed: " + (err?.message || String(err)) }, 500); }
}

async function completeIQAFEntry(request: Request, env: Env, identity: Identity, entryId: string): Promise<Response> {
  if (!canCreateForms(identity.user!)) return json({ error: "Forbidden" }, 403);
  await env.esol_marking_db.prepare("UPDATE iqaf_entries SET status = 'complete', completed_at = CURRENT_TIMESTAMP WHERE id = ?").bind(entryId).run();
  return json({ success: true });
}

async function deleteIQAFEntry(request: Request, env: Env, identity: Identity, entryId: string): Promise<Response> {
  if (!isSuperuser(identity.user!)) return json({ error: "Forbidden" }, 403);
  await env.esol_marking_db.prepare("DELETE FROM iqaf_entries WHERE id = ?").bind(entryId).run();
  return json({ success: true });
}

async function saveIQAFTemplate(request: Request, env: Env, identity: Identity): Promise<Response> {
  if (!canCreateForms(identity.user!)) return json({ error: "Forbidden" }, 403);
  try {
    const body = await request.json() as { title: string; description?: string; questions: IQAFTemplateQuestion[] };
    if (!body.title?.trim()) return json({ error: "Title is required" }, 400);
    const templateId = crypto.randomUUID();
    await env.esol_marking_db.prepare("INSERT INTO iqaf_templates (id, title, description, created_by) VALUES (?, ?, ?, ?)").bind(templateId, body.title.trim(), body.description?.trim() || null, identity.user!.id).run();
    for (let i = 0; i < body.questions.length; i++) {
      const q = body.questions[i];
      await env.esol_marking_db.prepare("INSERT INTO iqaf_template_questions (id, template_id, question_text, question_type, options, has_text_entry, text_entry_label, is_required, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)").bind(crypto.randomUUID(), templateId, q.question_text, q.question_type, q.options ? JSON.stringify(q.options) : null, 0, q.text_entry_label || null, q.is_required ? 1 : 0, i).run();
    }
    return json({ success: true, id: templateId });
  } catch (err: any) { return json({ error: "Failed: " + (err?.message || String(err)) }, 500); }
}

async function updateIQAFTemplate(request: Request, env: Env, identity: Identity, templateId: string): Promise<Response> {
  if (!canCreateForms(identity.user!)) return json({ error: "Forbidden" }, 403);
  try {
    const body = await request.json() as { title: string; description?: string; questions: IQAFTemplateQuestion[] };
    if (!body.title?.trim()) return json({ error: "Title is required" }, 400);
    await env.esol_marking_db.prepare("UPDATE iqaf_templates SET title = ?, description = ? WHERE id = ?").bind(body.title.trim(), body.description?.trim() || null, templateId).run();
    await env.esol_marking_db.prepare("DELETE FROM iqaf_template_questions WHERE template_id = ?").bind(templateId).run();
    for (let i = 0; i < body.questions.length; i++) {
      const q = body.questions[i];
      const qId = q.id && !q.id.startsWith("new_") && !q.id.startsWith("fixed_") ? q.id : crypto.randomUUID();
      await env.esol_marking_db.prepare("INSERT INTO iqaf_template_questions (id, template_id, question_text, question_type, options, has_text_entry, text_entry_label, is_required, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)").bind(qId, templateId, q.question_text, q.question_type, q.options ? JSON.stringify(q.options) : null, 0, q.text_entry_label || null, q.is_required ? 1 : 0, i).run();
    }
    return json({ success: true });
  } catch (err: any) { return json({ error: "Failed: " + (err?.message || String(err)) }, 500); }
}

async function deleteIQAFTemplate(request: Request, env: Env, identity: Identity, templateId: string): Promise<Response> {
  if (!canCreateForms(identity.user!)) return json({ error: "Forbidden" }, 403);
  try {
    const body = await request.formData();
    if (String(body.get("confirm")) !== "DELETE") return json({ error: "Not confirmed" }, 400);
    await env.esol_marking_db.prepare("UPDATE iqaf_templates SET is_active = 0 WHERE id = ?").bind(templateId).run();
    return json({ success: true });
  } catch (err: any) { return json({ error: "Failed: " + (err?.message || String(err)) }, 500); }
}

async function downloadIQAFEntry(request: Request, env: Env, identity: Identity, entryId: string): Promise<Response> {
  const user = identity.user!;
  const entry = await getIQAFEntry(env, user, entryId);
  if (!entry) return new Response("Not found", { status: 404 });
  const url = new URL(request.url);
  const format = url.searchParams.get("format") ?? "html";
  const [template, answers, comments] = await Promise.all([
    getIQAFTemplateWithQuestions(env, entry.template_id),
    getIQAFAnswers(env, entryId),
    getIQAFComments(env, entryId),
  ]);
  if (!template) return new Response("Not found", { status: 404 });
  const answerMap = Object.fromEntries(answers.map(a => [a.question_id, a.answer ?? ""]));
  if (format === "csv") {
    const rows: string[][] = [["Question", "Answer"], ["Course ID", entry.course_id], ["Academic Year", String(entry.academic_year)], ["Course Name", entry.course_name], ["Assessor", entry.assessor_name], ["IQA", entry.iqa_name], ["Planned Date", entry.planned_date], ["Status", entry.status]];
    for (const q of template.questions) rows.push([q.question_text, answerMap[q.id] ?? ""]);
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const slug = entry.template_title.replace(/[^a-z0-9]/gi, "-").toLowerCase();
    return new Response(csv, { headers: { "Content-Type": "text/csv", "Content-Disposition": `attachment; filename="iqaf-${slug}.csv"` } });
  }
  const questionsHtml = template.questions.map(q => `<tr><td style="padding:0.5rem 1rem;border:1px solid #e2e8f0;font-weight:600">${escapeHtml(q.question_text)}</td><td style="padding:0.5rem 1rem;border:1px solid #e2e8f0">${escapeHtml(answerMap[q.id] ?? "—")}</td></tr>`).join("");
  const commentsHtml = comments.map(c => `<div style="border:1px solid #e2e8f0;border-radius:6px;padding:0.75rem;margin-bottom:0.5rem"><strong>${escapeHtml(c.author_email ?? c.author_role)}</strong> <span style="color:#64748b;font-size:0.875rem">[${escapeHtml(c.author_role)}] · ${escapeHtml(c.created_at)}</span><p style="margin:0.5rem 0 0">${escapeHtml(c.comment)}</p></div>`).join("");
  const isPdf = format === "pdf";
  const printHtml = `<!doctype html><html><head><meta charset="utf-8"><title>IQA Form - ${escapeHtml(entry.template_title)}</title><style>body{font-family:Inter,sans-serif;padding:2rem;color:#0f172a}h1{font-size:1.5rem}table{width:100%;border-collapse:collapse;margin:1rem 0}${isPdf ? "@media print{body{padding:0}}" : ""}</style></head><body><h1>${escapeHtml(entry.template_title)}</h1><p style="color:#64748b">${escapeHtml(entry.course_name)} (${escapeHtml(entry.course_id)}) · Assessor: ${escapeHtml(entry.assessor_name)} · IQA: ${escapeHtml(entry.iqa_name)} · Status: ${escapeHtml(entry.status)}</p><table>${questionsHtml}</table><h2 style="margin-top:2rem">Comments</h2>${commentsHtml || "<p style='color:#64748b'>No comments.</p>"}</body></html>`;
  const slug = entry.template_title.replace(/[^a-z0-9]/gi, "-").toLowerCase();
  const headers: Record<string, string> = { "Content-Type": "text/html;charset=utf-8" };
  if (!isPdf) headers["Content-Disposition"] = `attachment; filename="iqaf-${slug}.html"`;
  return new Response(printHtml, { headers });
}

// ─── IQA Forms: renderers ────────────────────────────────────────────────────

function renderIQAFStatusBadge(status: IQAFEntryStatus, dueDate: string | null): string {
  const today = new Date().toISOString().split("T")[0];
  const isOverdue = dueDate && dueDate < today && status !== "complete";
  const labels: Record<string, string> = { pending: "Pending", assessor_submitted: "Assessor Submitted", iqa_reviewed: "IQA Reviewed", eqa_signed: "EQA Signed", complete: "Complete" };
  const colors: Record<string, string> = { pending: "#fef3c7;color:#92400e", assessor_submitted: "#dbeafe;color:#1e40af", iqa_reviewed: "#dcfce7;color:#166534", eqa_signed: "#f3e8ff;color:#6b21a8", complete: "#f1f5f9;color:#475569" };
  const badge = `<span class="lw-status-badge" style="background:${colors[status] ?? "#f1f5f9;color:#475569"}">${labels[status] ?? status}</span>`;
  return isOverdue ? `${badge} <span class="lw-overdue-badge lw-blink">⚠ OVERDUE</span>` : badge;
}

function renderIQAFDashboardPage(identity: Identity, entries: IQAFEntryRecord[], templates: IQAFTemplateRecord[], notifications: IQAFNotification[], search: string): string {
  const user = identity.user!;
  const canManage = canCreateForms(user);
  const today = new Date().toISOString().split("T")[0];
  const nc = notifications.length;
  const notifBell = nc === 0 ? `<div class="lw-bell">🔐</div>` : `<div class="lw-bell lw-bell-active lw-blink" onclick="document.getElementById('iqnp').classList.toggle('hidden')" title="${nc} unread">🔐 <span class="lw-bell-count">${nc}</span><div id="iqnp" class="lw-notif-panel hidden">${notifications.map(n => `<div class="lw-notif-item"><span>${escapeHtml(n.message)}</span></div>`).join("")}</div></div>`;

  return pageShell("IQA Forms", `
    <main class="dashboard-shell">
      ${renderSidebar(identity, "iqa-forms")}
      <section class="content">
        <header class="topbar">
          <div><p class="eyebrow">IQA Forms</p><h1>IQA Forms</h1></div>
          <div style="display:flex;align-items:center;gap:1rem">${notifBell}<div class="profile-pill">${escapeHtml(identity.email)}</div><a class="logout-link" href="/logout">Sign out</a></div>
        </header>

        ${canManage ? `<section class="panel templates-section">
          <div class="section-header"><p class="eyebrow">IQA Form Templates</p><a class="small-action" href="/iqa-forms/templates/build">+ New template</a></div>
          <div class="list-stack templates-list">
            ${templates.length ? templates.map(t => `<article class="list-card template-card"><div class="card-content"><strong>${escapeHtml(t.title)}</strong><span>${escapeHtml(t.description ?? "No description")}</span></div><div class="card-actions"><a href="/iqa-forms/templates/${t.id}/build" class="action-btn edit-btn" title="Edit">✏️</a><form method="POST" action="/api/iqaf/templates/${t.id}/delete" onsubmit="return iqafTmplDel(this)"><input type="hidden" name="confirm" value="DELETE"><button type="submit" class="action-btn delete-btn" title="Delete">🗑️</button></form></div></article>`).join("") : `<p class="hint">No templates yet. Create one to get started.</p>`}
          </div>
        </section>` : ""}

        <section class="panel submissions-section">
          <div class="section-header">
            <p class="eyebrow">IQA Form Submissions</p>
            <div style="display:flex;gap:0.75rem;align-items:center;flex-wrap:wrap">
              <form method="GET" action="/iqa-forms" class="search-form-inline"><input name="q" value="${escapeHtml(search)}" placeholder="Search by course, assessor, IQA..."><button type="submit">Search</button></form>
              ${canManage ? `<a class="small-action" href="/iqa-forms/entries/new">+ New IQA form</a>` : ""}
            </div>
          </div>
          <div class="list-stack">
            ${entries.length ? entries.map(e => {
              const isOverdue = e.due_date && e.due_date < today && e.status !== "complete";
              const delBtn = isSuperuser(user) ? `<button type="button" class="lw-entry-delete-btn" title="Delete" onclick="iqafDel('${e.id}','${escapeHtml(e.template_title).replace(/'/g,"\\'")}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg></button>` : "";
              return `<article class="list-card${isOverdue ? " lw-overdue-card" : ""}"><a href="/iqa-forms/entries/${e.id}" style="display:block;flex:1"><strong>${escapeHtml(e.template_title)}</strong><span>Academic Year: ${escapeHtml(String(e.academic_year))} · Course: ${escapeHtml(e.course_name)} (${escapeHtml(e.course_id)})</span><span>Assessor: ${escapeHtml(e.assessor_name)} · IQA: ${escapeHtml(e.iqa_name)}</span><span>Planned: ${escapeHtml(e.planned_date)}${e.due_date ? ` · Due: ${escapeHtml(e.due_date)}` : ""}</span></a><div style="display:flex;align-items:center;gap:0.5rem">${renderIQAFStatusBadge(e.status, e.due_date)}<button type="button" class="lw-entry-download-btn" title="Download" onclick="iqafDlOpen('${e.id}','${escapeHtml(e.template_title).replace(/'/g,"\\'")}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></button>${delBtn}</div></article>`;
            }).join("") : renderEmpty("No IQA forms found")}
          </div>
        </section>
      </section>
    </main>

    <div id="iqaf-del-modal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;align-items:center;justify-content:center"><div style="background:#fff;border-radius:12px;padding:2rem;max-width:420px;width:90%;box-shadow:0 8px 32px rgba(0,0,0,0.2)"><h2 style="margin:0 0 0.5rem;font-size:1.25rem">Delete Submission</h2><p style="color:#64748b;margin:0 0 1.25rem">Permanently delete: <strong id="iqaf-del-title"></strong></p><p style="color:#64748b;margin:0 0 0.75rem;font-size:0.9rem">Type <strong>DELETE</strong> to confirm:</p><input id="iqaf-del-input" type="text" placeholder="Type DELETE here" style="width:100%;border:2px solid #e5e7eb;border-radius:8px;padding:0.75rem;font-size:1rem;margin-bottom:1rem"><div style="display:flex;gap:0.75rem;justify-content:flex-end"><button onclick="iqafDelClose()" style="background:#f1f5f9;color:#0f172a;border:none;border-radius:8px;padding:0.7rem 1.25rem;font-weight:600;cursor:pointer">Cancel</button><button id="iqaf-del-btn" onclick="iqafDelSubmit()" style="background:#ff005a;color:#fff;border:none;border-radius:8px;padding:0.7rem 1.25rem;font-weight:600;cursor:pointer">Delete</button></div></div></div>
    <div id="iqaf-dl-modal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:1001;align-items:center;justify-content:center"><div class="lw-dl-modal-box"><h2 class="lw-dl-modal-title">Download / Print</h2><p class="lw-dl-modal-sub">Format for: <strong id="iqaf-dl-title"></strong></p><div class="lw-dl-options"><button type="button" class="lw-dl-option" onclick="iqafDlAs('csv')"><span class="lw-dl-icon">📊</span><strong>CSV</strong><span class="lw-dl-desc">Excel / Sheets</span></button><button type="button" class="lw-dl-option" onclick="iqafDlAs('html')"><span class="lw-dl-icon">🌐</span><strong>HTML</strong><span class="lw-dl-desc">Formatted page</span></button><button type="button" class="lw-dl-option" onclick="iqafDlAs('pdf')"><span class="lw-dl-icon">🖨️</span><strong>PDF</strong><span class="lw-dl-desc">Print to PDF</span></button></div><button type="button" class="lw-dl-cancel" onclick="iqafDlClose()">Cancel</button></div></div>

    <script>
      function iqafTmplDel(form){const t=prompt("Type DELETE to confirm:");if(t!=="DELETE"){alert("Cancelled.");return false;}return true;}
      let _id=null;
      function iqafDel(id,title){_id=id;document.getElementById("iqaf-del-title").textContent=title;document.getElementById("iqaf-del-input").value="";document.getElementById("iqaf-del-modal").style.display="flex";}
      function iqafDelClose(){document.getElementById("iqaf-del-modal").style.display="none";_id=null;}
      async function iqafDelSubmit(){if(document.getElementById("iqaf-del-input").value.trim()!=="DELETE"){document.getElementById("iqaf-del-input").style.borderColor="#ff005a";return;}const btn=document.getElementById("iqaf-del-btn");btn.disabled=true;btn.textContent="Deleting...";try{const r=await fetch("/api/iqaf/entries/"+_id+"/delete",{method:"POST"});const d=await r.json();if(d.success){iqafDelClose();window.location.reload();}else{alert("Error: "+(d.error||"Failed"));btn.disabled=false;btn.textContent="Delete";}}catch(e){alert("Network error.");btn.disabled=false;btn.textContent="Delete";}}
      document.getElementById("iqaf-del-modal").addEventListener("click",function(e){if(e.target===this)iqafDelClose();});
      let _dlId=null;
      function iqafDlOpen(id,title){_dlId=id;document.getElementById("iqaf-dl-title").textContent=title;document.getElementById("iqaf-dl-modal").style.display="flex";}
      function iqafDlClose(){document.getElementById("iqaf-dl-modal").style.display="none";_dlId=null;}
      function iqafDlAs(fmt){if(!_dlId)return;if(fmt==="pdf"){const w=window.open("/api/iqaf/entries/"+_dlId+"/download?format=pdf","_blank");if(w)w.addEventListener("load",function(){setTimeout(function(){w.print();},400);});}else{const a=document.createElement("a");a.href="/api/iqaf/entries/"+_dlId+"/download?format="+fmt;a.click();}iqafDlClose();}
      document.getElementById("iqaf-dl-modal").addEventListener("click",function(e){if(e.target===this)iqafDlClose();});
    </script>
  `);
}

function renderIQAFTemplateBuilderPage(identity: Identity, template: IQAFTemplateWithQuestions | null, users: UserRecord[]): string {
  const isEdit = !!template, templateId = template?.id ?? "", title = template?.title ?? "", description = template?.description ?? "";
  let questions = template?.questions ?? [];
  const assessors = users.filter(u => ["assessor","assessor_iqa","admin","superuser"].includes(u.role));
  const iqas = users.filter(u => ["iqa","assessor_iqa","admin","superuser"].includes(u.role));
  if (!isEdit && questions.length === 0) {
    questions = [
      {id:"fixed_course_id",template_id:"",question_text:"Course ID",question_type:"text",options:null,has_text_entry:0,text_entry_label:null,is_required:1,sort_order:0},
      {id:"fixed_course_name",template_id:"",question_text:"Course Name",question_type:"text",options:null,has_text_entry:0,text_entry_label:null,is_required:1,sort_order:1},
      {id:"fixed_assessor",template_id:"",question_text:"Assessor",question_type:"dropdown",options:assessors.map(u=>({id:u.id,label:u.email,value:u.id})),has_text_entry:0,text_entry_label:null,is_required:1,sort_order:2},
      {id:"fixed_iqa",template_id:"",question_text:"IQA",question_type:"dropdown",options:iqas.map(u=>({id:u.id,label:u.email,value:u.id})),has_text_entry:0,text_entry_label:null,is_required:1,sort_order:3},
      {id:"fixed_planned_date",template_id:"",question_text:"Planned Date",question_type:"date",options:null,has_text_entry:0,text_entry_label:null,is_required:1,sort_order:4},
      {id:"fixed_due_date",template_id:"",question_text:"Due Date",question_type:"date",options:null,has_text_entry:0,text_entry_label:null,is_required:0,sort_order:5},
    ] as IQAFTemplateQuestion[];
  }
  const qtypes = [{v:"yes_no",l:"Yes/No",i:"✔"},{v:"rag",l:"Green/Amber/Red",i:"●"},{v:"ggaw",l:"Gold/Green/Amber/White",i:"◆"},{v:"single_choice",l:"MCQ (One Answer)",i:"○"},{v:"multiple_choice",l:"Choices (Multiple)",i:"☐"},{v:"dropdown",l:"Dropdown",i:"▼"},{v:"text",l:"Text",i:"T"},{v:"textarea",l:"Long Text",i:"¶"},{v:"date",l:"Date",i:"📅"},{v:"number",l:"Number",i:"#"},{v:"ranking",l:"Ranking",i:"⇅"},{v:"rating",l:"Rating",i:"★"},{v:"time",l:"Time",i:"🕒"},{v:"section",l:"Section Header",i:"▬"}];
  const fixedIds = new Set(["fixed_course_id","fixed_course_name","fixed_assessor","fixed_iqa","fixed_planned_date","fixed_due_date"]);
  const renderQ = (q: IQAFTemplateQuestion, i: number) => {
    const isFixed = fixedIds.has(q.id), isSect = q.question_type === "section";
    const needsOpts = ["single_choice","multiple_choice","dropdown","ranking"].includes(q.question_type);
    const actBtns = isFixed ? `<span class="lwfb-fixed-badge">Standard Field</span>` : `<div class="lwfb-reorder-btns"><button type="button" class="lwfb-reorder-btn" onclick="moveQ(this,'up')">▲</button><button type="button" class="lwfb-reorder-btn" onclick="moveQ(this,'down')">▼</button></div><button type="button" class="lwfb-delete-q" onclick="delQ(this)">×</button>`;
    const selOpts = qtypes.map(t => `<option value="${t.v}" ${q.question_type===t.v?"selected":""}>${t.l}</option>`).join("");
    const optsVal = q.options ? q.options.map((o: QuestionOption) => escapeHtml(o.label)).join("\n") : "";
    return `<div class="${isFixed?"lwfb-question-card lwfb-fixed-card":"lwfb-question-card"}" data-question-id="${q.id}" data-is-fixed="${isFixed}"><div class="lwfb-question-header"><span class="lwfb-q-number">${i+1}</span><select class="lwfb-q-type-select" onchange="updQType(this)" ${isFixed?"disabled":""}>${selOpts}</select><label class="lwfb-required-label" style="${isSect?"display:none":""}"><input type="checkbox" class="lwfb-q-required" ${q.is_required?"checked":""}> Required</label>${actBtns}</div><div class="lwfb-question-body"><div class="lwfb-section-body ${isSect?"":"hidden"}"><input type="text" class="lwfb-q-text" value="${escapeHtml(q.question_text)}" placeholder="Section heading" style="font-weight:600"><input type="text" class="lwfb-q-section-desc" value="${escapeHtml(q.text_entry_label||"")}" placeholder="Section description" style="margin-top:.5rem;color:#64748b"></div><div class="lwfb-normal-body ${isSect?"hidden":""}"><input type="text" class="lwfb-q-text" value="${escapeHtml(q.question_text)}" placeholder="Enter your question" ${isFixed?"readonly":""}><div class="lwfb-options-section ${needsOpts?"":"hidden"}"><label class="lwfb-options-label">Options (one per line):</label><textarea class="lwfb-q-options" rows="3" ${isFixed?"readonly":""}>${optsVal}</textarea></div></div></div></div>`;
  };
  const qHtml = questions.length > 0 ? questions.map((q,i) => renderQ(q,i)).join("") : `<div class="lwfb-empty-state" id="emptyQMsg">No questions yet.</div>`;
  const pickerGrid = qtypes.map(t => `<div class="type-option" onclick="addQ('${t.v}')"><span class="type-icon">${t.i}</span><span class="type-label">${t.l}</span></div>`).join("");
  return pageShell(isEdit?"Edit IQA Template":"New IQA Template", `
    <main class="lwfb-popup-overlay"><div class="lwfb-popup-container">
      <div class="lwfb-popup-header"><div><p class="lwfb-eyebrow">IQA Form Template Builder</p><h1 class="lwfb-title">${isEdit?"Edit Template":"Create New Template"}</h1></div><button type="button" class="lwfb-close-btn" onclick="location.href='/iqa-forms'">×</button></div>
      <div class="lwfb-popup-content">
        <div class="lwfb-section-card"><input type="text" id="tTitle" class="lwfb-title-input" value="${escapeHtml(title)}" placeholder="Untitled Template"><textarea id="tDesc" class="lwfb-desc-input" rows="2" placeholder="Description">${escapeHtml(description)}</textarea></div>
        <div class="lwfb-section-card"><h3 class="lwfb-section-title">Questions</h3><p class="lwfb-section-hint">First 6 fields are standard for all IQA Forms.</p><div id="qContainer" class="lwfb-questions-container">${qHtml}</div><div style="position:relative"><button type="button" class="lwfb-add-btn" onclick="showPicker()">+ Add Question</button><div id="qPicker" class="lwfb-type-picker hidden"><div class="picker-header"><span>Select Type</span><button type="button" class="close-picker" onclick="hidePicker()">×</button></div><div class="picker-grid">${pickerGrid}</div></div></div></div>
      </div>
      <div class="lwfb-popup-footer"><button type="button" class="lwfb-secondary-btn" onclick="location.href='/iqa-forms'">Cancel</button><button type="button" class="lwfb-primary-btn" onclick="saveTmpl()">${isEdit?"Save Changes":"Create Template"}</button></div>
    </div></main>
    <script>
      let qc=${questions.length};const tid="${templateId}";const ie=${JSON.stringify(isEdit)};
      const allQt=${JSON.stringify(qtypes.map(t=>({v:t.v,l:t.l})))};
      function showPicker(){document.getElementById('qPicker').classList.remove('hidden');}
      function hidePicker(){document.getElementById('qPicker').classList.add('hidden');}
      function delQ(btn){if(!confirm('Delete?'))return;btn.closest('.lwfb-question-card').remove();renum();chkE();}
      function renum(){document.querySelectorAll('.lwfb-question-card').forEach((c,i)=>c.querySelector('.lwfb-q-number').textContent=i+1);}
      function chkE(){const c=document.getElementById('qContainer');if(!c.querySelectorAll('.lwfb-question-card').length&&!document.getElementById('emptyQMsg'))c.innerHTML='<div class="lwfb-empty-state" id="emptyQMsg">No questions yet.</div>';}
      function updQType(sel){const card=sel.closest('.lwfb-question-card'),t=sel.value,no=['single_choice','multiple_choice','dropdown','ranking'].includes(t),is=t==='section';card.querySelector('.lwfb-options-section').classList.toggle('hidden',!no);card.querySelector('.lwfb-section-body')?.classList.toggle('hidden',!is);card.querySelector('.lwfb-normal-body')?.classList.toggle('hidden',is);const r=card.querySelector('.lwfb-required-label');if(r)r.style.display=is?'none':'';}
      function moveQ(btn,dir){const card=btn.closest('.lwfb-question-card'),cards=Array.from(card.parentNode.querySelectorAll('.lwfb-question-card')),idx=cards.indexOf(card);if(dir==='up'&&idx>0)card.parentNode.insertBefore(card,cards[idx-1]);else if(dir==='down'&&idx<cards.length-1)cards[idx+1].insertAdjacentElement('afterend',card);renum();}
      function addQ(type){
        hidePicker();const c=document.getElementById('qContainer');const e=document.getElementById('emptyQMsg');if(e)e.remove();qc++;
        const no=['single_choice','multiple_choice','dropdown','ranking'].includes(type),is=type==='section';
        const opts=allQt.map(t=>\`<option value="\${t.v}" \${t.v===type?'selected':''}>\${t.l}</option>\`).join('');
        const card=document.createElement('div');card.className='lwfb-question-card';card.dataset.questionId='new_'+crypto.randomUUID();card.dataset.sortOrder=String(qc);
        card.innerHTML=\`<div class="lwfb-question-header"><span class="lwfb-q-number">\${document.querySelectorAll('.lwfb-question-card').length+1}</span><select class="lwfb-q-type-select" onchange="updQType(this)">\${opts}</select><label class="lwfb-required-label" style="\${is?'display:none':''}"><input type="checkbox" class="lwfb-q-required"> Required</label><div class="lwfb-reorder-btns"><button type="button" class="lwfb-reorder-btn" onclick="moveQ(this,'up')">▲</button><button type="button" class="lwfb-reorder-btn" onclick="moveQ(this,'down')">▼</button></div><button type="button" class="lwfb-delete-q" onclick="delQ(this)">×</button></div><div class="lwfb-question-body"><div class="lwfb-section-body \${is?'':'hidden'}"><input type="text" class="lwfb-q-text" placeholder="Section heading" style="font-weight:600"><input type="text" class="lwfb-q-section-desc" placeholder="Section description" style="margin-top:.5rem;color:#64748b"></div><div class="lwfb-normal-body \${is?'hidden':''}"><input type="text" class="lwfb-q-text" placeholder="Enter question"><div class="lwfb-options-section \${no?'':'hidden'}"><label class="lwfb-options-label">Options (one per line):</label><textarea class="lwfb-q-options" rows="3"></textarea></div></div></div>\`;
        c.appendChild(card);card.scrollIntoView({behavior:'smooth',block:'center'});
      }
      async function saveTmpl(){
        const title=document.getElementById('tTitle').value.trim(),desc=document.getElementById('tDesc').value.trim();
        if(!title){alert('Please enter a title');return;}
        const qs=[];const cards=Array.from(document.querySelectorAll('.lwfb-question-card')).filter(c=>c.offsetParent!==null);
        for(let i=0;i<cards.length;i++){
          const card=cards[i],qId=card.dataset.questionId,qType=card.querySelector('.lwfb-q-type-select').value;
          const tEl=card.querySelector('.lwfb-normal-body:not(.hidden) .lwfb-q-text')||card.querySelector('.lwfb-section-body:not(.hidden) .lwfb-q-text')||card.querySelector('.lwfb-q-text');
          const qText=tEl?.value?.trim()||'';if(!qText){tEl?.focus();setTimeout(()=>alert(\`Question \${i+1} missing text\`),100);return;}
          let options=null;if(['single_choice','multiple_choice','dropdown','ranking'].includes(qType)){const ot=card.querySelector('.lwfb-q-options').value.trim();if(ot)options=ot.split('\\n').map((l,idx)=>({id:'opt_'+idx,label:l.trim(),value:l.trim().toLowerCase().replace(/\\s+/g,'_')})).filter(o=>o.label);}
          const sd=card.querySelector('.lwfb-q-section-desc');const q={question_text:qText,question_type:qType,is_required:qType==='section'?false:card.querySelector('.lwfb-q-required').checked,sort_order:i,options,text_entry_label:sd?sd.value.trim():null};
          if(qId&&!qId.startsWith('new_')&&!qId.startsWith('fixed_'))q.id=qId;qs.push(q);
        }
        const url=ie?\`/api/iqaf/templates/\${tid}\`:'/api/iqaf/templates';
        try{const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title,description:desc,questions:qs})});if(!r.ok){const e=await r.json();throw new Error(e.error||'Failed');}location.href='/iqa-forms';}
        catch(e){alert('Error: '+(e.message||String(e)));}
      }
    </script>
  `);
}

function renderIQAFEntryTemplateSelectorPage(identity: Identity, templates: IQAFTemplateRecord[]): string {
  const tHtml = templates.length > 0 ? templates.map(t => `<div class="lw-selector-template-card" data-template-id="${t.id}" data-template-name="${escapeHtml(t.title).toLowerCase()}" onclick="location.href='/iqa-forms/entries/create?templateId=${t.id}'"><div class="lw-selector-template-icon">📋</div><div class="lw-selector-template-info"><strong>${escapeHtml(t.title)}</strong><span>${escapeHtml(t.description ?? "No description")}</span></div><div class="lw-selector-template-arrow">→</div></div>`).join("") : `<div class="lw-selector-empty">No active templates. Create one first.</div>`;
  return pageShell("New IQA Form", `
    <main class="lwfb-popup-overlay"><div class="lwfb-popup-container" style="max-width:600px">
      <div class="lwfb-popup-header"><div><p class="lwfb-eyebrow">New IQA Form</p><h1 class="lwfb-title">Select a Template</h1></div><button type="button" class="lwfb-close-btn" onclick="location.href='/iqa-forms'">×</button></div>
      <div class="lwfb-popup-content">
        <div class="lw-selector-search-wrapper"><input type="text" id="tSearch" class="lw-selector-search" placeholder="🔍 Search templates..." oninput="filterT(this.value)"></div>
        <div id="tList" class="lw-selector-list">${tHtml}</div>
        <div id="noRes" class="lw-selector-no-results hidden">No templates match.</div>
      </div>
      <div class="lwfb-popup-footer"><button type="button" class="lwfb-secondary-btn" onclick="location.href='/iqa-forms'">Cancel</button></div>
    </div></main>
    <script>function filterT(s){const t=s.toLowerCase().trim(),cards=document.querySelectorAll('.lw-selector-template-card');let v=0;cards.forEach(c=>{const m=c.dataset.templateName.includes(t);c.style.display=m?'flex':'none';if(m)v++;});document.getElementById('noRes').classList.toggle('hidden',v>0);}</script>
  `);
}

function renderIQAFEntryFormPage(identity: Identity, template: IQAFTemplateWithQuestions, users: UserRecord[]): string {
  const assessors = users.filter(u => ["assessor","assessor_iqa","admin","superuser"].includes(u.role));
  const iqas = users.filter(u => ["iqa","assessor_iqa","admin","superuser"].includes(u.role));
  const eqas = users.filter(u => ["eqa","admin","superuser"].includes(u.role));
  const fixedQuestionIds = new Set(["fixed_course_id","fixed_course_name","fixed_assessor","fixed_iqa","fixed_planned_date","fixed_due_date"]);
  const fixedQuestionTexts = new Set(["Course ID","Course Name","Assessor","IQA","Planned Date","Due Date"]);
  const visibleQuestions = template.questions.filter(q => !fixedQuestionIds.has(q.id) && !fixedQuestionTexts.has(q.question_text));
  const qHtml = visibleQuestions.map((q, index) => {
    if (q.question_type === "section") return `<div class="lw-entry-section" style="grid-column:1/-1"><h3 class="lw-entry-section-title">${escapeHtml(q.question_text)}</h3></div>`;
    const n = `answer_${q.id}`, req = q.is_required ? "required" : "", rl = q.is_required ? ` <span class="lw-entry-required">*</span>` : "";
    let inp = `<input type="text" name="${n}" class="lw-entry-input" ${req}>`;
    if (q.question_type === "textarea") inp = `<textarea name="${n}" class="lw-entry-input" rows="3" ${req}></textarea>`;
    else if (q.question_type === "yes_no") inp = `<div class="lw-entry-radio-group"><label class="lw-entry-radio"><input type="radio" name="${n}" value="yes" ${req}> <span>Yes</span></label><label class="lw-entry-radio"><input type="radio" name="${n}" value="no" ${req}> <span>No</span></label></div>`;
    else if (q.question_type === "rag") inp = `<div class="lw-entry-rag-group"><label class="lw-entry-rag green"><input type="radio" name="${n}" value="green" ${req}> Green</label><label class="lw-entry-rag amber"><input type="radio" name="${n}" value="amber" ${req}> Amber</label><label class="lw-entry-rag red"><input type="radio" name="${n}" value="red" ${req}> Red</label></div>`;
    else if (q.question_type === "ggaw") inp = `<div class="lw-entry-ggaw-group"><label class="lw-entry-ggaw gold"><input type="radio" name="${n}" value="gold" ${req}> Gold</label><label class="lw-entry-ggaw green"><input type="radio" name="${n}" value="green" ${req}> Green</label><label class="lw-entry-ggaw amber"><input type="radio" name="${n}" value="amber" ${req}> Amber</label><label class="lw-entry-ggaw white"><input type="radio" name="${n}" value="white" ${req}> White</label></div>`;
    else if (q.question_type === "date") inp = `<input type="date" name="${n}" class="lw-entry-input" ${req}>`;
    else if (q.question_type === "number") inp = `<input type="number" name="${n}" class="lw-entry-input" ${req}>`;
    else if (q.question_type === "single_choice" && q.options) inp = `<div class="lw-entry-radio-group">${q.options.map((o: QuestionOption) => `<label class="lw-entry-radio"><input type="radio" name="${n}" value="${escapeHtml(o.value)}" ${req}> <span>${escapeHtml(o.label)}</span></label>`).join("")}</div>`;
    else if (q.question_type === "dropdown" && q.options) inp = `<select name="${n}" class="lw-entry-select" ${req}><option value="">Select...</option>${q.options.map((o: QuestionOption) => `<option value="${escapeHtml(o.value)}">${escapeHtml(o.label)}</option>`).join("")}</select>`;
    return `<div class="lw-entry-field"><label class="lw-entry-label">${escapeHtml(q.question_text)}${rl}</label>${inp}</div>`;
  }).join("");
  return pageShell(`New IQA Form Entry - ${escapeHtml(template.title)}`, `
    <main class="dashboard-shell">
      ${renderSidebar(identity, "iqa-forms")}
      <section class="content">
        <header class="topbar">
          <div>
            <p class="eyebrow">New IQA Form Entry</p>
            <h1>${escapeHtml(template.title)}</h1>
          </div>
          <div style="display:flex;align-items:center;gap:1rem">
            <div class="profile-pill">${escapeHtml(identity.email)}</div>
            <a class="logout-link" href="/logout">Sign out</a>
          </div>
        </header>

        <form id="entryForm" class="lw-entry-form" onsubmit="event.preventDefault(); subEntry();">
          <input type="hidden" id="template_id" value="${template.id}">

          <div class="lw-entry-section">
            <h3 class="lw-entry-section-title">Course Information</h3>
            <div class="lw-entry-grid">
              <div class="lw-entry-field" style="grid-column:1/-1">
                <label class="lw-entry-label" for="course_picker">Select from Learner Track</label>
                <select id="course_picker" class="lw-entry-select"><option value="">-- choose a course or type manually below --</option></select>
                <span class="lw-entry-hint">Loading courses from Learner Track...</span>
              </div>
              <div class="lw-entry-field" style="grid-column:1/-1;display:flex;flex-direction:row;gap:0.75rem;align-items:flex-end;flex-wrap:wrap">
                <div style="flex:1;min-width:180px">
                  <label class="lw-entry-label" for="academic_year">Academic Year * <span class="lw-entry-required">(YYYY, e.g. 2025)</span></label>
                  <input type="number" id="academic_year" class="lw-entry-input" value="${getCurrentAcademicYear()}" min="2000" max="2100" required placeholder="YYYY">
                </div>
                <button type="button" id="refresh_courses" class="secondary-action">Refresh courses</button>
                <div style="flex:1;min-width:200px">
                  <label class="lw-entry-label" for="course_search">Search by Course ID</label>
                  <input type="text" id="course_search" class="lw-entry-input" placeholder="e.g. 10534">
                </div>
                <button type="button" id="find_course_btn" class="secondary-action">Find course</button>
              </div>
              <div class="lw-entry-field">
                <label class="lw-entry-label" for="cid">Course ID *</label>
                <input type="text" id="cid" class="lw-entry-input" required>
              </div>
              <div class="lw-entry-field">
                <label class="lw-entry-label" for="cname">Course Name *</label>
                <input type="text" id="cname" class="lw-entry-input" required>
              </div>
            </div>
          </div>

          <div class="lw-entry-section">
            <h3 class="lw-entry-section-title">Staff Allocation</h3>
            <div class="lw-entry-grid">
              <div class="lw-entry-field">
                <label class="lw-entry-label" for="aid">Assessor *</label>
                <select id="aid" class="lw-entry-select" required><option value="">Select Assessor</option>${assessors.map(u => `<option value="${u.id}">${escapeHtml(u.email)}</option>`).join("")}</select>
              </div>
              <div class="lw-entry-field">
                <label class="lw-entry-label" for="iid">IQA *</label>
                <select id="iid" class="lw-entry-select" required><option value="">Select IQA</option>${iqas.map(u => `<option value="${u.id}">${escapeHtml(u.email)}</option>`).join("")}</select>
              </div>
              <div class="lw-entry-field">
                <label class="lw-entry-label" for="eid">EQA (optional)</label>
                <select id="eid" class="lw-entry-select"><option value="">Select EQA</option>${eqas.map(u => `<option value="${u.id}">${escapeHtml(u.email)}</option>`).join("")}</select>
              </div>
              <div class="lw-entry-field">
                <label class="lw-entry-label" for="pd">Planned Date *</label>
                <input type="date" id="pd" class="lw-entry-input" required>
              </div>
              <div class="lw-entry-field">
                <label class="lw-entry-label" for="dd">Due Date</label>
                <input type="date" id="dd" class="lw-entry-input">
              </div>
            </div>
          </div>

          ${qHtml ? `<div class="lw-entry-section"><h3 class="lw-entry-section-title">Form Questions</h3><div class="lw-entry-grid" style="grid-template-columns:1fr">${qHtml}</div></div>` : ""}

          <div class="lw-entry-actions">
            <a href="/iqa-forms" class="secondary-action">Cancel</a>
            <button type="submit" class="primary-action">Create IQA Form Entry</button>
          </div>
        </form>
      </section>
    </main>
    <script>
      async function loadCourses(year){
        const sel = document.getElementById('course_picker');
        const hint = sel.parentElement.querySelector('.lw-entry-hint');
        try {
          const r = await fetch('/api/courses/learnertrack?academicYear=' + encodeURIComponent(year));
          const data = await r.json();
          if (!Array.isArray(data)) throw new Error(data.error || 'Unexpected response');
          sel.innerHTML = '<option value="">-- choose a course or type manually below --</option>';
          data.forEach(c => {
            const code = c.CourseCode || '';
            const title = c.CourseTitle || '';
            const opt = document.createElement('option');
            opt.value = JSON.stringify({course_id: code, course_name: title});
            opt.dataset.courseInstanceId = c.ID != null ? String(c.ID) : '';
            opt.textContent = (title ? title + ' ' : '') + (code ? '(' + code + ')' : '');
            sel.appendChild(opt);
          });
          if (hint) hint.textContent = data.length + ' courses loaded for academic year ' + year + '.';
        } catch (err) {
          if (hint) hint.textContent = 'Could not load courses. You can still type the course details manually.';
          console.error('Course load error:', err);
        }
      }

      document.getElementById('course_picker').addEventListener('change', function () {
        if (!this.value) return;
        const v = JSON.parse(this.value);
        document.getElementById('cid').value = v.course_id || '';
        document.getElementById('cname').value = v.course_name || '';
      });

      loadCourses(document.getElementById('academic_year').value);

      document.getElementById('refresh_courses').addEventListener('click', () => {
        const year = document.getElementById('academic_year').value;
        if (!year || year.length !== 4) { alert('Please enter a valid YYYY academic year'); return; }
        const sel = document.getElementById('course_picker');
        const hint = sel.parentElement.querySelector('.lw-entry-hint');
        if (hint) hint.textContent = 'Loading courses for ' + year + '...';
        loadCourses(year);
      });

      let academicYearDebounce;
      document.getElementById('academic_year').addEventListener('input', function () {
        const year = this.value;
        clearTimeout(academicYearDebounce);
        academicYearDebounce = setTimeout(() => {
          if (!year || year.length !== 4) return;
          const sel = document.getElementById('course_picker');
          const hint = sel.parentElement.querySelector('.lw-entry-hint');
          if (hint) hint.textContent = 'Loading courses for ' + year + '...';
          loadCourses(year);
        }, 500);
      });

      document.getElementById('find_course_btn').addEventListener('click', async () => {
        const search = document.getElementById('course_search');
        const id = search.value.trim();
        if (!id) { alert('Please enter a Course ID to search for.'); return; }
        const sel = document.getElementById('course_picker');
        const hint = sel.parentElement.querySelector('.lw-entry-hint');
        if (hint) hint.textContent = 'Searching for course ' + id + '...';
        try {
          const r = await fetch('/api/courses/learnertrack?courseinstanceid=' + encodeURIComponent(id));
          const data = await r.json();
          if (!Array.isArray(data) || data.length === 0) {
            if (hint) hint.textContent = 'No course found with ID ' + id + '. You can still type the details manually.';
            return;
          }
          const c = data[0];
          document.getElementById('cid').value = c.CourseCode || '';
          document.getElementById('cname').value = c.CourseTitle || '';
          if (c.AcademicYear != null) {
            document.getElementById('academic_year').value = c.AcademicYear;
            await loadCourses(c.AcademicYear);
          }
          const match = Array.from(sel.options).find(o => o.dataset.courseInstanceId === String(c.ID));
          if (match) { sel.value = match.value; }
          if (hint) hint.textContent = 'Found: ' + (c.CourseTitle || '') + ' (' + (c.CourseCode || '') + ').';
        } catch (err) {
          if (hint) hint.textContent = 'Course search failed. You can still type the details manually.';
          console.error('Course search error:', err);
        }
      });

      async function subEntry(){
        const ay=document.getElementById('academic_year').value,cid=document.getElementById('cid').value.trim(),cname=document.getElementById('cname').value.trim(),aid=document.getElementById('aid').value,iid=document.getElementById('iid').value,eid=document.getElementById('eid').value||null,pd=document.getElementById('pd').value,dd=document.getElementById('dd').value||null;
        if(!ay||!cid||!cname||!aid||!iid||!pd){alert('Please fill in all required fields.');return;}
        const ans={};document.querySelectorAll('[name^="answer_"]').forEach(el=>{const k=el.name.replace('answer_','');if(el.type==='radio'){if(el.checked)ans[k]=el.value;}else if(el.tagName==='SELECT'){if(el.value)ans[k]=el.value;}else{if(el.value.trim())ans[k]=el.value.trim();}});
        try{const r=await fetch('/api/iqaf/entries',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({template_id:'${template.id}',academic_year:parseInt(ay,10),course_id:cid,course_name:cname,assessor_id:aid,iqa_id:iid,eqa_id:eid,planned_date:pd,due_date:dd,answers:ans})});const d=await r.json();if(d.success)location.href='/iqa-forms/entries/'+d.id;else alert('Error: '+(d.error||'Failed'));}catch(e){alert('Network error.');}
      }
    </script>
  `);
}

function renderIQAFEntryViewPage(identity: Identity, entry: IQAFEntryRecord, template: IQAFTemplateWithQuestions, answers: IQAFAnswer[], comments: IQAFComment[], users: UserRecord[], canEdit: boolean, canComplete: boolean): string {
  const user = identity.user!;
  const ansMap = Object.fromEntries(answers.map(a => [a.question_id, a.answer ?? ""]));
  const fixedQuestionIds = new Set(["fixed_course_id","fixed_course_name","fixed_assessor","fixed_iqa","fixed_planned_date","fixed_due_date"]);
  const fixedQuestionTexts = new Set(["Course ID","Course Name","Assessor","IQA","Planned Date","Due Date"]);
  const visibleQuestions = template.questions.filter(q => !fixedQuestionIds.has(q.id) && !fixedQuestionTexts.has(q.question_text));
  const qHtml = visibleQuestions.map(q => {
    if (q.question_type === "section") return `<tr><td colspan="2" style="padding:.75rem 1rem;background:#f8fafc;font-weight:700;border:1px solid #e2e8f0">${escapeHtml(q.question_text)}</td></tr>`;
    const ans = ansMap[q.id];
    let disp = escapeHtml(ans || "—");
    if (q.question_type === "rag" && ans) { const c: Record<string,string>={green:"#16a34a",amber:"#d97706",red:"#dc2626"}; disp = `<span style="color:${c[ans]??"#0f172a"};font-weight:600">${ans.toUpperCase()}</span>`; }
    if (q.question_type === "ggaw" && ans) { const c: Record<string,string>={gold:"#b45309",green:"#16a34a",amber:"#d97706",white:"#64748b"}; disp = `<span style="color:${c[ans]??"#0f172a"};font-weight:600">${ans.toUpperCase()}</span>`; }
    let inp = `<input type="text" data-qid="${q.id}" class="iqaf-ans lw-entry-input" value="${escapeHtml(ans??"")}">`;
    if (q.question_type === "textarea") inp = `<textarea data-qid="${q.id}" class="iqaf-ans lw-entry-input" rows="2">${escapeHtml(ans??"")}</textarea>`;
    else if (q.question_type === "yes_no") inp = `<div class="lw-entry-radio-group"><label class="lw-entry-radio"><input type="radio" data-qid="${q.id}" class="iqaf-ans" name="ia_${q.id}" value="yes" ${ans==="yes"?"checked":""}> <span>Yes</span></label><label class="lw-entry-radio"><input type="radio" data-qid="${q.id}" class="iqaf-ans" name="ia_${q.id}" value="no" ${ans==="no"?"checked":""}> <span>No</span></label></div>`;
    else if (q.question_type === "rag") inp = `<div class="lw-entry-rag-group"><label class="lw-entry-rag green"><input type="radio" data-qid="${q.id}" class="iqaf-ans" name="ia_${q.id}" value="green" ${ans==="green"?"checked":""}> Green</label><label class="lw-entry-rag amber"><input type="radio" data-qid="${q.id}" class="iqaf-ans" name="ia_${q.id}" value="amber" ${ans==="amber"?"checked":""}> Amber</label><label class="lw-entry-rag red"><input type="radio" data-qid="${q.id}" class="iqaf-ans" name="ia_${q.id}" value="red" ${ans==="red"?"checked":""}> Red</label></div>`;
    else if (q.question_type === "ggaw") inp = `<div class="lw-entry-ggaw-group"><label class="lw-entry-ggaw gold"><input type="radio" data-qid="${q.id}" class="iqaf-ans" name="ia_${q.id}" value="gold" ${ans==="gold"?"checked":""}> Gold</label><label class="lw-entry-ggaw green"><input type="radio" data-qid="${q.id}" class="iqaf-ans" name="ia_${q.id}" value="green" ${ans==="green"?"checked":""}> Green</label><label class="lw-entry-ggaw amber"><input type="radio" data-qid="${q.id}" class="iqaf-ans" name="ia_${q.id}" value="amber" ${ans==="amber"?"checked":""}> Amber</label><label class="lw-entry-ggaw white"><input type="radio" data-qid="${q.id}" class="iqaf-ans" name="ia_${q.id}" value="white" ${ans==="white"?"checked":""}> White</label></div>`;
    else if (q.question_type === "date") inp = `<input type="date" data-qid="${q.id}" class="iqaf-ans lw-entry-input" value="${escapeHtml(ans??"")}">`;
    else if (q.question_type === "number") inp = `<input type="number" data-qid="${q.id}" class="iqaf-ans lw-entry-input" value="${escapeHtml(ans??"")}">`;
    else if (q.question_type === "single_choice" && q.options) inp = `<div class="lw-entry-radio-group">${q.options.map((o: QuestionOption) => `<label class="lw-entry-radio"><input type="radio" data-qid="${q.id}" class="iqaf-ans" name="ia_${q.id}" value="${escapeHtml(o.value)}" ${ans===o.value?"checked":""}> <span>${escapeHtml(o.label)}</span></label>`).join("")}</div>`;
    else if (q.question_type === "dropdown" && q.options) inp = `<select data-qid="${q.id}" class="iqaf-ans lw-entry-select"><option value="">Select...</option>${q.options.map((o: QuestionOption) => `<option value="${escapeHtml(o.value)}" ${ans===o.value?"selected":""}>${escapeHtml(o.label)}</option>`).join("")}</select>`;
    return `<tr><td style="padding:.5rem 1rem;border:1px solid #e2e8f0;font-weight:600;width:40%;vertical-align:top">${escapeHtml(q.question_text)}</td><td style="padding:.5rem 1rem;border:1px solid #e2e8f0">${canEdit ? inp : `<span>${disp}</span>`}</td></tr>`;
  }).join("");

  const cHtml = comments.map(c => `<div class="lw-comment-item"><div class="lw-comment-header"><span class="lw-comment-author">${escapeHtml(c.author_email??"Unknown")}</span><span class="lw-comment-role">${escapeHtml(c.author_role)}</span><span class="lw-comment-date">${escapeHtml(c.created_at)}</span></div><p class="lw-comment-text">${escapeHtml(c.comment)}</p></div>`).join("");

  const statusFlow = ["pending","assessor_submitted","iqa_reviewed","eqa_signed","complete"];
  const nxtLabels: Record<string,string> = {assessor_submitted:"Submit as Assessor",iqa_reviewed:"Mark IQA Reviewed",eqa_signed:"Sign as EQA",complete:"Mark Complete"};
  const curIdx = statusFlow.indexOf(entry.status);
  const nextStatus = curIdx < statusFlow.length - 1 ? statusFlow[curIdx + 1] : null;

  return pageShell(entry.template_title, `
    <main class="dashboard-shell">
      ${renderSidebar(identity, "iqa-forms")}
      <section class="content">
        <header class="topbar"><div><p class="eyebrow"><a href="/iqa-forms" style="color:var(--primary)">↵ IQA Forms</a></p><h1>${escapeHtml(entry.template_title)}</h1></div><div class="profile-pill">${escapeHtml(identity.email)}</div><a class="logout-link" href="/logout">Sign out</a></header>

        <section class="panel"><div class="meta-panel">
          <div class="lw-meta-item"><label class="lw-meta-label">Course</label><span>${escapeHtml(entry.course_name)} (${escapeHtml(entry.course_id)})</span></div>
          <div class="lw-meta-item"><label class="lw-meta-label">Assessor</label><span>${escapeHtml(entry.assessor_name)}</span></div>
          <div class="lw-meta-item"><label class="lw-meta-label">IQA</label><span>${escapeHtml(entry.iqa_name)}</span></div>
          <div class="lw-meta-item"><label class="lw-meta-label">Planned</label><span>${escapeHtml(entry.planned_date)}</span></div>
          ${entry.due_date ? `<div class="lw-meta-item"><label class="lw-meta-label">Due</label><span>${escapeHtml(entry.due_date)}</span></div>` : ""}
          <div class="lw-meta-item"><label class="lw-meta-label">Status</label><span>${renderIQAFStatusBadge(entry.status, entry.due_date)}</span></div>
        </div></section>

        <section class="panel checklist-panel">
          <div class="section-header"><p class="eyebrow">Responses</p>${canEdit ? `<div style="display:flex;gap:.5rem"><button type="button" class="small-action" onclick="saveAns()">Save Answers</button></div>` : ""}</div>
          <table class="checklist-table"><tbody>${qHtml}</tbody></table>
        </section>

        ${canEdit && nextStatus ? `<section class="panel"><div class="section-header"><p class="eyebrow">Workflow</p></div><div style="display:flex;gap:.75rem;flex-wrap:wrap"><button type="button" class="small-action" onclick="advStatus('${nextStatus}')">${nxtLabels[nextStatus] ?? nextStatus}</button>${canComplete ? `<button type="button" class="small-action" style="background:#16a34a" onclick="advStatus('complete')">Mark Complete</button>` : ""}</div></section>` : ""}

        <section class="panel"><div class="section-header"><p class="eyebrow">Comments</p></div><div class="comment-list">${cHtml || `<p class="hint" style="color:var(--muted)">No comments yet.</p>`}</div>${canEdit ? `<div class="comment-form"><textarea id="commentBox" class="lw-entry-input" rows="3" placeholder="Add a comment..."></textarea><button type="button" class="small-action" onclick="addCmt()">Add Comment</button></div>` : ""}</section>
      </section>
    </main>
    <script>
      const entryId='${entry.id}';
      async function saveAns(){
        const ans={};document.querySelectorAll('.iqaf-ans').forEach(el=>{const k=el.dataset.qid;if(!k)return;if(el.type==='radio'){if(el.checked)ans[k]=el.value;}else if(el.tagName==='SELECT'){if(el.value)ans[k]=el.value;}else{if(el.value.trim())ans[k]=el.value.trim();}});
        try{const r=await fetch('/api/iqaf/entries/'+entryId+'/update',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({answers:ans})});const d=await r.json();if(d.success)alert('Saved!');else alert('Error: '+(d.error||'Failed'));}catch(e){alert('Network error.');}
      }
      async function advStatus(status){
        if(!confirm('Advance to status: '+status+'?'))return;
        try{const r=await fetch('/api/iqaf/entries/'+entryId+'/update',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({status})});const d=await r.json();if(d.success)location.reload();else alert('Error: '+(d.error||'Failed'));}catch(e){alert('Network error.');}
      }
      async function addCmt(){
        const comment=document.getElementById('commentBox').value.trim();if(!comment){alert('Please enter a comment.');return;}
        try{const r=await fetch('/api/iqaf/entries/'+entryId+'/comments',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({comment})});const d=await r.json();if(d.success)location.reload();else alert('Error: '+(d.error||'Failed'));}catch(e){alert('Network error.');}
      }
    </script>
  `);
}

function renderNotFoundPage() {
  return pageShell("Not found", `<main class="auth-shell"><section class="auth-card"><h1>Page not found</h1><a class="primary-action" href="/learning-walks">Go to dashboard</a></section></main>`);
}

function canCreateForms(user: UserRecord) { return user.role === "admin" || user.role === "superuser"; }
function isSuperuser(user: UserRecord) { return user.role === "superuser"; }
function stageForUser(user: UserRecord): Stage { return user.role === "iqa" ? "iqa" : user.role === "eqa" ? "eqa" : user.stage ?? "assess"; }
function roleToStage(role: Role): Stage | null { return role === "iqa" ? "iqa" : role === "eqa" ? "eqa" : role === "assessor" ? "assess" : null; }
function canEditStage(user: UserRecord, status: EntryStatus, stage: Stage) { return user.role === "superuser" || user.role === "admin" || (status === "assessment" && stage === "assess") || (status === "iqa" && stage === "iqa") || (status === "eqa" && stage === "eqa"); }
function parseItems(structure: string): ChecklistItem[] { try { const parsed = JSON.parse(structure) as { items?: ChecklistItem[] }; return parsed.items ?? []; } catch { return []; } }
function parseData(data: string | null): Record<string, string> { try { return data ? JSON.parse(data) as Record<string, string> : {}; } catch { return {}; } }
function wantsJson(request: Request) { return request.headers.get("accept")?.includes("application/json"); }
function json(value: unknown, status = 200) { return new Response(JSON.stringify(value), { status, headers: jsonHeaders }); }

function renderLoginPage() {
  return pageShell("Sign in", `<main class="auth-shell"><section class="auth-card"><div class="brand-mark">H</div><p class="eyebrow">HALSQ</p><h1>Sign in to continue</h1><p class="lede">Use your Microsoft work account to access Learning Walks, IQA Forms, and quality records.</p><a class="primary-action" href="/auth/microsoft/start">Continue with Microsoft</a><p class="hint">You will be redirected to Microsoft, then returned securely to HALSQ.</p></section></main>`);
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
  const normalizedEmail = email.toLowerCase();

  const existingUser = await env.esol_marking_db.prepare("SELECT id FROM users WHERE lower(email) = ? LIMIT 1").bind(normalizedEmail).first();
  if (!existingUser && normalizedEmail.endsWith("@haringeylearns.ac.uk")) {
    await env.esol_marking_db.prepare("INSERT INTO users (id, email, role, stage) VALUES (?, ?, ?, ?)").bind(crypto.randomUUID(), normalizedEmail, "student", null).run();
  }

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
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(title)} | HALSQ</title><link rel="icon" type="image/x-icon" href="/favicon.ico"><style>
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
    .edit-btn{background:none;border:1px solid var(--border);border-radius:6px;padding:0.5rem 1rem;cursor:pointer;color:var(--text);font-size:0.875rem;transition:all 0.2s}
    .edit-btn:hover{background:#e0e7ff;border-color:var(--primary);color:var(--primary)}
    .delete-form{display:inline;margin:0}
    .user-row{display:flex;justify-content:space-between;gap:1rem;align-items:center;border-bottom:1px solid var(--border);padding:.8rem 0}
    .user-info{display:flex;flex-direction:column;gap:0.25rem;align-items:flex-start;flex:1}
    .user-email{font-weight:500;color:var(--text)}
    .role-badge{font-size:0.875rem;color:var(--muted);background:#f1f5f9;padding:0.25rem 0.5rem;border-radius:4px}
    .user-actions{display:flex;gap:0.5rem;align-items:center}
    .current-user-badge{font-size:0.875rem;color:var(--muted);font-style:italic}
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
    .lw-entry-textarea{resize:vertical;min-height:100px;field-sizing:content;overflow-y:hidden}
    .lw-entry-question{margin-bottom:1.5rem;padding:1.25rem;background:var(--panel);border-radius:8px;border:1px solid var(--border);border-left:3px solid var(--primary)}
    .lw-entry-question-label{font-weight:600;color:var(--text);margin-bottom:0.75rem;display:block}
    .lw-entry-radio-group,.lw-entry-checkbox-group{display:flex;flex-direction:column;gap:0.75rem;width:100%}
    .lw-entry-radio,.lw-entry-checkbox{display:flex;align-items:center;gap:0.9rem;cursor:pointer;padding:0.9rem 1.25rem;background:#fff;border:2px solid var(--border);border-radius:8px;transition:all 0.2s;width:100%;box-sizing:border-box;min-height:3.5rem}
    .lw-entry-radio:hover,.lw-entry-checkbox:hover{border-color:var(--primary)}
    .lw-entry-radio:has(input:checked),.lw-entry-checkbox:has(input:checked){border-color:var(--primary);background:#eef2ff}
    .lw-entry-radio input,.lw-entry-checkbox input{cursor:pointer;flex:0 0 auto;width:18px;height:18px;margin:0}
    .lw-entry-radio span,.lw-entry-checkbox span{flex:1;text-align:left;line-height:1.45}
    .lw-entry-rag-group,.lw-entry-ggaw-group{display:flex;flex-wrap:wrap;gap:0.75rem}
    .lw-entry-rag,.lw-entry-ggaw{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.6rem;padding:0.75rem 1.25rem;border-radius:8px;font-weight:500;cursor:pointer;transition:all 0.2s;border:2px solid transparent;min-width:110px}
    .lw-entry-rag.green{background:#dcfce7;color:#166534;border-color:#166534}
    .lw-entry-rag.amber{background:#fef3c7;color:#92400e;border-color:#92400e}
    .lw-entry-rag.red{background:#fee2e2;color:#991b1b;border-color:#991b1b}
    .lw-entry-ggaw.gold{background:#fef9c3;color:#854d0e;border-color:#854d0e}
    .lw-entry-ggaw.green{background:#dcfce7;color:#166534;border-color:#166534}
    .lw-entry-ggaw.amber{background:#fef3c7;color:#92400e;border-color:#92400e}
    .lw-entry-ggaw.white{background:#f1f5f9;color:#475569;border-color:#475569}
    .lw-entry-rag input,.lw-entry-ggaw input{display:none}
    .lw-entry-rag::after,.lw-entry-ggaw::after{content:'';display:block;width:16px;height:16px;border-radius:50%;border:2px solid currentColor;background:transparent;transition:background 0.15s}
    .lw-entry-rag:has(input:checked)::after,.lw-entry-ggaw:has(input:checked)::after{background:currentColor}
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
    .lw-entry-download-btn{background:none;border:1px solid var(--border);border-radius:8px;padding:0.5rem;cursor:pointer;color:var(--muted);display:inline-flex;align-items:center;justify-content:center;transition:background .15s,color .15s,border-color .15s;flex-shrink:0}
    .lw-entry-download-btn:hover{background:#f0f9ff;color:#0369a1;border-color:#0369a1}
    .lw-dl-modal-box{background:#fff;border-radius:14px;padding:2rem;max-width:480px;width:92%;box-shadow:0 12px 48px rgba(0,0,0,0.22)}
    .lw-dl-modal-title{font-size:1.25rem;font-weight:700;color:#0f172a;margin-bottom:0.4rem}
    .lw-dl-modal-sub{font-size:0.9375rem;color:#64748b;margin-bottom:1.25rem}
    .lw-dl-options{display:grid;grid-template-columns:repeat(3,1fr);gap:0.75rem;margin-bottom:1.25rem}
    .lw-dl-option{background:#f8fafc;border:1.5px solid var(--border);border-radius:10px;padding:1.1rem 0.75rem;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:0.4rem;transition:all .15s;text-align:center}
    .lw-dl-option:hover{border-color:var(--primary);background:#fff;box-shadow:0 2px 8px rgba(0,0,0,.08)}
    .lw-dl-option strong{font-size:0.9375rem;color:#0f172a}
    .lw-dl-icon{font-size:1.5rem}
    .lw-dl-desc{font-size:0.75rem;color:#64748b;line-height:1.3}
    .lw-dl-cancel{background:#f1f5f9;color:#0f172a;border:none;border-radius:8px;padding:0.65rem 1.25rem;font-weight:600;cursor:pointer;font-size:0.9375rem;width:100%}
    .lw-dl-cancel:hover{background:#e2e8f0}
    @media (max-width:768px){.lwfb-header-grid{grid-template-columns:1fr}.lwfb-type-picker .picker-grid{grid-template-columns:repeat(2,1fr)}.lwfb-popup-overlay{padding:1rem}.lwfb-popup-container{max-height:calc(100vh - 2rem)}.lw-entry-grid{grid-template-columns:1fr}.lw-dl-options{grid-template-columns:1fr}}
    /* CSV Import styles */
    .import-form{display:flex;flex-direction:column;gap:1rem;align-items:flex-start}
    .file-input-label{width:100%}
    .file-input-label span{display:block;font-size:0.875rem;font-weight:600;color:var(--text);margin-bottom:0.5rem}
    .file-input-label small{display:block;margin-top:0.5rem;color:var(--muted);font-size:0.8125rem}
    .file-input-label code{background:#f1f5f9;padding:0.125rem 0.375rem;border-radius:4px;font-size:0.8125rem}
    .form-actions{display:flex;align-items:center;gap:1rem}
    .btn-secondary{background:#fff;border:1px solid var(--border);color:var(--text)}
    .btn-secondary:hover{background:var(--bg);border-color:var(--primary);color:var(--primary)}
    .btn-link{font-size:0.875rem;color:var(--primary);text-decoration:underline}
    .btn-link:hover{color:var(--primary-dark)}
    .alert{padding:1rem 1.25rem;border-radius:8px;margin-bottom:1rem;font-size:0.9375rem}
    .alert-success{background:var(--success);border-left:4px solid #16a34a;color:#166534}
    .alert-error{background:#fef2f2;border-left:4px solid #dc2626;color:#991b1b}
    .courses-table-wrap{overflow:auto;max-height:70vh;border:1px solid var(--border);border-radius:8px}
    .courses-table{width:100%;border-collapse:collapse;min-width:1400px}
    .courses-table th,.courses-table td{padding:.75rem 1rem;border:1px solid var(--border);text-align:left;white-space:nowrap}
    .courses-table th{background:#f8fafc;position:sticky;top:0;z-index:1;font-weight:600}
    .courses-table tbody tr:nth-child(even){background:#f8fafc}
    .courses-table .empty-cell{text-align:center;color:var(--muted);padding:2rem}
    .courses-filters{display:flex;gap:1rem;align-items:center;flex-wrap:wrap}
    .courses-filters label{display:flex;align-items:center;gap:.5rem;font-weight:500;color:var(--text)}
    .courses-filters .lw-entry-select{min-width:160px}
    .my-class-search{display:flex;gap:1rem;align-items:flex-end;flex-wrap:wrap;margin-bottom:1rem}
    .my-class-search label{display:flex;flex-direction:column;gap:.25rem;font-weight:500;color:var(--text)}
    .my-class-search .lw-entry-input{min-width:220px}
    .my-class-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:1rem;margin-bottom:1.5rem}
    .stat-card{background:#f8fafc;border:1px solid var(--border);border-radius:8px;padding:1rem}
    .stat-label{display:block;font-size:.875rem;color:var(--muted);margin-bottom:.25rem}
    .stat-value{display:block;font-size:1.25rem;font-weight:700;color:var(--text)}
    .pie-chart-wrap{display:flex;flex-direction:column;align-items:center;margin-bottom:1.5rem}
    .pie-chart{display:block}
    .pie-chart-label{margin-top:.5rem;font-size:.875rem;font-weight:500;color:var(--muted)}
    .student-profile-card{display:flex;align-items:center;gap:1.25rem;background:#f8fafc;border:1px solid var(--border);border-radius:12px;padding:1.5rem;margin-bottom:1.5rem}
    .student-avatar{width:56px;height:56px;border-radius:50%;background:var(--primary);color:#fff;display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:700;flex-shrink:0}
    .student-profile-details{display:flex;flex-direction:column;gap:.25rem}
    .student-name{margin:0;font-size:1.25rem;font-weight:700;color:var(--text)}
    .student-meta{display:flex;gap:1.5rem;flex-wrap:wrap}
    .student-meta-item{font-size:.9375rem;color:var(--muted)}
    .student-meta-item strong{color:var(--text)}
    .lw-entry-hint{display:block;font-size:.875rem;color:var(--muted);margin-top:.25rem}
    .reports-filters{margin-top:.5rem}
    .filter-row{display:flex;flex-wrap:wrap;gap:1rem;align-items:flex-end}
    .filter-row label{display:flex;flex-direction:column;gap:.35rem;font-size:.8125rem;font-weight:600;color:var(--text)}
    .filter-row input,.filter-row select{min-width:140px;width:auto;padding:.5rem .75rem;font-size:.875rem;border-radius:6px}
    .filter-actions{display:flex;align-items:flex-end}
    .year-nav{display:flex;align-items:center;gap:.75rem}
    .year-label{font-weight:700;font-size:1.1rem;color:var(--text);min-width:4rem;text-align:center}
    .reports-panel{overflow:hidden}
    .reports-table-wrap{overflow-x:auto;border:1px solid var(--border);border-radius:8px}
    .reports-table{border-collapse:collapse;width:100%;font-size:.875rem}
    .reports-table th,.reports-table td{padding:.5rem .75rem;border:1px solid #e2e8f0;text-align:center;white-space:nowrap}
    .reports-table th{background:#f8fafc;color:var(--muted);font-weight:600}
    .reports-table .sticky-col{text-align:left;min-width:220px;background:#fff}
    .reports-table thead .sticky-col{background:#f8fafc}
    .reports-table .year-header{background:#eef2ff;color:var(--text);font-weight:700}
    .reports-table .empty-cell{color:#cbd5e1}
    .reports-table td a{color:var(--primary);text-decoration:underline}
    .teacher-name{font-weight:600}
    .brand-highlight td{background:#fff7ed;color:#9a3412}
    .brand-highlight td a{color:#9a3412}
    .brand-highlight .teacher-name{font-weight:700}
    .reports-table .brand-highlight .empty-cell{color:#cbd5e1}
    /* Quality Calendar */
    .qc-panel{position:relative}
    .qc-toolbar{display:flex;flex-wrap:wrap;gap:1rem;align-items:center;justify-content:space-between;margin-bottom:1.25rem;padding:1rem;background:#fff;border-radius:12px;border:1px solid var(--border);box-shadow:0 2px 8px rgba(0,0,0,.04)}
    .qc-nav-group{display:flex;gap:.5rem;align-items:center}
    .qc-icon-btn,.qc-text-btn{background:#f1f5f9;color:var(--text);border:1px solid var(--border);border-radius:8px;padding:.5rem .875rem;font-weight:600;cursor:pointer;font-size:.875rem;transition:all .15s}
    .qc-icon-btn:hover,.qc-text-btn:hover{background:var(--primary);color:#fff;border-color:var(--primary)}
    #qc-date-picker{width:auto;min-width:150px;border:1px solid var(--border);border-radius:8px;padding:.55rem .75rem;font:inherit;color:var(--text)}
    .qc-view-toggle{display:flex;border:1px solid var(--border);border-radius:8px;overflow:hidden}
    .qc-view-btn{background:#fff;color:var(--muted);border:none;padding:.55rem 1rem;font-weight:600;cursor:pointer;font-size:.875rem}
    .qc-view-btn.active{background:var(--primary);color:#fff}
    .qc-actions{display:flex;gap:.5rem;flex-wrap:wrap}
    .qc-primary-btn{background:var(--primary);color:#fff;border:none;border-radius:8px;padding:.65rem 1.25rem;font-weight:600;cursor:pointer;font-size:.9375rem;transition:background .15s}
    .qc-primary-btn:hover{background:var(--primary-dark)}
    .qc-secondary-btn{background:#fff;color:var(--text);border:1px solid var(--border);border-radius:8px;padding:.65rem 1.25rem;font-weight:600;cursor:pointer;font-size:.9375rem;transition:all .15s}
    .qc-secondary-btn:hover{border-color:var(--primary);color:var(--primary)}
    .qc-calendar{background:#fff;border:1px solid var(--border);border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.04);position:relative}
    .qc-header-row{display:grid;grid-template-columns:repeat(5,1fr);background:var(--secondary);border-bottom:2px solid #334155;position:relative;z-index:2}
    .qc-seven-day .qc-header-row{grid-template-columns:repeat(7,1fr)}
    .qc-header-cell{padding:1rem .75rem;text-align:center;position:relative;border-right:1px solid #475569;color:#fff}
    .qc-header-cell:last-child{border-right:none}
    .qc-header-cell.qc-weekend{background:#334155}
    .qc-header-cell .qc-day-name{color:#cbd5e1}
    .qc-header-cell .qc-day-date{color:#fff}
    .qc-day-name{font-size:.75rem;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em}
    .qc-day-date{font-size:1rem;font-weight:600;color:var(--text);margin:.25rem 0}
    .qc-day-add{position:absolute;top:.5rem;right:.5rem;width:1.5rem;height:1.5rem;border-radius:50%;background:var(--primary);color:#fff;border:none;font-size:1rem;line-height:1;cursor:pointer;display:grid;place-items:center;opacity:0;transition:opacity .15s}
    .qc-header-cell:hover .qc-day-add{opacity:1}
    .qc-grid{display:grid;grid-template-columns:repeat(5,1fr);grid-auto-rows:min-content;position:relative;min-height:24rem}
    .qc-seven-day .qc-grid{grid-template-columns:repeat(7,1fr)}
    .qc-grid-col{position:absolute;top:0;bottom:0;border-right:1px solid #94a3b8;z-index:0}
    .qc-grid-col:last-child{border-right:none}
    .qc-grid-col.qc-weekend{background:#f8fafc}
    .qc-banner-row,.qc-single-row{display:grid;grid-template-columns:repeat(5,1fr);grid-auto-rows:min-content;gap:.5rem;padding:.5rem;position:relative;z-index:1}
    .qc-seven-day .qc-banner-row,.qc-seven-day .qc-single-row{grid-template-columns:repeat(7,1fr)}
    .qc-banner-tile,.qc-single-tile{padding:.65rem .75rem;border-radius:8px;font-size:.875rem;font-weight:600;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;box-shadow:0 1px 3px rgba(0,0,0,.08);transition:transform .1s,box-shadow .1s}
    .qc-banner-tile:hover,.qc-single-tile:hover{transform:translateY(-1px);box-shadow:0 4px 8px rgba(0,0,0,.1)}
    .qc-banner-tile{font-size:.9rem;font-weight:700}
    .qc-readonly{opacity:.7;cursor:default}
    .qc-modal-overlay{position:fixed;inset:0;background:rgba(15,23,42,.55);backdrop-filter:blur(4px);z-index:1000;display:flex;justify-content:center;align-items:center;padding:1rem}
    .qc-modal{background:#fff;border-radius:16px;width:100%;max-width:1400px;max-height:calc(100vh - 2rem);overflow-y:auto;box-shadow:0 16px 64px rgba(0,0,0,.18)}
    .qc-modal-sm{max-width:520px}
    .qc-modal-header{display:flex;justify-content:space-between;align-items:center;padding:1.25rem 1.5rem;border-bottom:1px solid var(--border)}
    .qc-modal-header h2{margin:0;font-size:1.25rem;font-weight:700;color:var(--text)}
    .qc-modal-close{background:none;border:none;font-size:1.75rem;color:var(--muted);cursor:pointer;padding:0;width:2rem;height:2rem;border-radius:8px;transition:background .15s}
    .qc-modal-close:hover{background:#f1f5f9;color:var(--primary)}
    .qc-form{padding:1.5rem;display:flex;flex-direction:column;gap:1rem}
    .qc-form label{display:flex;flex-direction:column;gap:.35rem;font-size:.875rem;font-weight:600;color:var(--text)}
    .qc-form input,.qc-form textarea,.qc-form select{width:100%;border:1px solid var(--border);border-radius:8px;padding:.65rem .875rem;font:inherit;color:var(--text)}
    .qc-form input:read-only,.qc-form input:disabled,.qc-form textarea:read-only,.qc-form select:disabled{background:#f1f5f9;color:var(--muted);cursor:not-allowed}
    .qc-form-row{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
    .qc-type-toggle{display:flex;gap:.5rem;margin-bottom:.5rem}
    .qc-type-btn{flex:1;padding:.65rem 1rem;background:#f1f5f9;color:var(--muted);border:1px solid var(--border);border-radius:8px;font-weight:600;cursor:pointer;font-size:.9375rem;transition:all .15s}
    .qc-type-btn:disabled{opacity:.7;cursor:not-allowed}
    .qc-type-btn.active{background:var(--primary);color:#fff;border-color:var(--primary)}
    .qc-type-btn.qc-type-active{background:var(--primary);color:#fff;border-color:var(--primary)}
    .qc-checkbox{flex-direction:row!important;align-items:center;gap:.5rem!important;cursor:pointer}
    .qc-checkbox input{width:auto}
    .qc-color-field{grid-column:span 2}
    .qc-color-picker{display:flex;flex-direction:column;gap:.75rem;margin-top:.25rem}
    .qc-color-current{display:flex;gap:.5rem;align-items:stretch;height:3rem}
    .qc-color-swatch-wrap{position:relative;flex:1;border-radius:10px;overflow:hidden;box-shadow:0 2px 6px rgba(0,0,0,.12)}
    .qc-color-swatch{position:absolute;inset:0;display:grid;place-items:center;font-family:monospace;font-size:.9375rem;font-weight:700;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,.4);pointer-events:none}
    .qc-color-native{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer;border:none;padding:0;margin:0}
    .qc-color-presets{display:flex;flex-direction:column;gap:.5rem}
    .qc-preset-label{font-size:.75rem;color:var(--muted);text-transform:uppercase;letter-spacing:.05em}
    .qc-preset-row{display:flex;flex-wrap:wrap;gap:.35rem}
    .qc-color-square{width:2.5rem;height:2.5rem;border-radius:6px;border:2px solid #e2e8f0;cursor:pointer;transition:transform .1s,border-color .1s;flex:0 0 2.5rem}
    .qc-color-square:hover{transform:scale(1.08);border-color:#0f172a}
    .qc-color-custom .qc-preset-row{gap:.35rem}
    .qc-copy-color{background:#f1f5f9;color:var(--text);border:1px solid var(--border);border-radius:8px;padding:0 .9rem;font-weight:600;cursor:pointer;font-size:.8125rem;transition:all .15s;white-space:nowrap;display:flex;align-items:center}
    .qc-copy-color:hover{background:var(--primary);color:#fff;border-color:var(--primary)}
    .qc-subs-section{display:none;border:1px dashed var(--border);border-radius:10px;padding:1rem;background:#f8fafc}
    .qc-subs-section h3{margin:0 0 .75rem;font-size:1rem;color:var(--text)}
    .qc-sub-row{display:grid;grid-template-columns:1.5fr 1fr 120px 120px 2rem;gap:.5rem;align-items:center;margin-bottom:.5rem}
    .qc-sub-row input{font-size:.875rem;padding:.5rem}
    .qc-remove-sub{background:#fee2e2;color:#dc2626;border:none;border-radius:6px;width:1.75rem;height:1.75rem;cursor:pointer;font-size:1.25rem;display:grid;place-items:center}
    .qc-add-sub-btn{background:#fff;border:1px dashed var(--border);color:var(--muted);border-radius:8px;padding:.5rem 1rem;font-weight:600;cursor:pointer;font-size:.875rem;width:100%;margin-top:.5rem}
    .qc-add-sub-btn:hover{border-color:var(--primary);color:var(--primary)}
    .qc-modal-actions{display:flex;gap:.75rem;justify-content:flex-end;padding-top:1rem;border-top:1px solid var(--border);margin-top:.5rem}
    .qc-delete-btn{background:#fee2e2;color:#dc2626;border:1px solid #fecaca;border-radius:8px;padding:.65rem 1.25rem;font-weight:600;cursor:pointer;font-size:.9375rem}
    .qc-delete-btn:hover{background:#fecaca}
    .qc-modal-hint{color:var(--muted);font-size:.875rem;padding:0 1.5rem .75rem}
    .qc-modal-hint code{background:#f1f5f9;padding:.125rem .375rem;border-radius:4px}
    .qc-import-options{display:flex;gap:1rem;align-items:flex-start;padding:0 1.5rem 1rem;flex-wrap:wrap}
    .qc-file-label{flex:1;min-width:200px;cursor:pointer;display:flex;flex-direction:column;gap:.35rem;font-size:.875rem;font-weight:600;color:var(--text)}
    .qc-file-label input[type=file]{width:100%;border:1px dashed var(--border);border-radius:8px;padding:.65rem .875rem;cursor:pointer;font:inherit;color:var(--text);background:#fafafa}
    .qc-file-label small{color:var(--muted);font-size:.8125rem;font-weight:400}
    .qc-file-label input[type=file]:hover{border-color:var(--primary);background:#f0f9ff}
    .qc-tooltip{position:fixed;z-index:2000;max-width:320px;padding:1rem 1.25rem;background:#1e293b;color:#fff;border-radius:10px;font-size:1.125rem;line-height:1.5;box-shadow:0 8px 24px rgba(0,0,0,.25);pointer-events:none}
    .qc-tooltip strong{font-size:1.25rem;color:#fff;display:block;margin-bottom:.35rem}
    .qc-tooltip em{color:#94a3b8;font-style:normal}
    .qc-context-menu{position:fixed;z-index:2001;min-width:15rem;background:#fff;border:1px solid var(--border);border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,.18);display:flex;flex-direction:column;padding:.5rem;gap:.25rem}
    .qc-context-menu button{background:none;border:none;padding:.6rem .9rem;text-align:left;border-radius:6px;font-size:.9375rem;font-weight:600;color:var(--text);cursor:pointer;transition:background .1s}
    .qc-context-menu button:hover{background:#f1f5f9}
    .qc-context-delete{color:#dc2626!important}
    .qc-context-label{font-size:.75rem;color:var(--muted);padding:.4rem .75rem 0;text-transform:uppercase;letter-spacing:.05em}
    .qc-context-palette{display:grid;grid-template-columns:repeat(5,1fr);gap:.35rem;padding:.4rem .75rem}
    @media(max-width:768px){.qc-toolbar{flex-direction:column;align-items:stretch}.qc-form-row,.qc-sub-row{grid-template-columns:1fr}.qc-color-field{grid-column:span 1}.qc-header-row,.qc-grid,.qc-banner-row,.qc-single-row{grid-template-columns:repeat(5,1fr)}.qc-seven-day .qc-header-row,.qc-seven-day .qc-grid,.qc-seven-day .qc-banner-row,.qc-seven-day .qc-single-row{grid-template-columns:repeat(7,1fr)}}
  </style></head><body>${body}</body></html>`;
}

function renderSidebar(identity: Identity, active: string) {
  const user = identity.user!;
  const isStudent = user.role === "student";
  if (isStudent) {
    return `<aside class="sidebar">
    <div class="sidebar-brand"><div class="brand-mark"><img src="/favicon.svg" width="36" height="36" style="object-fit:contain;display:block"></div><div><strong>HALSQ</strong><span>Student Portal</span></div></div>
    <nav class="sidebar-nav">
      ${navLink("/assessments", "Assessments", active === "assessments")}
      ${navLink("/tracker", "My Tracker", active === "tracker")}
    </nav>
  </aside>`;
  }
  return `<aside class="sidebar">
    <div class="sidebar-brand"><div class="brand-mark"><img src="/favicon.svg" width="36" height="36" style="object-fit:contain;display:block"></div><div><strong>HALSQ</strong><span>${escapeHtml(user.role === "assessor_iqa" ? "Assessor / IQA" : user.role)}</span></div></div>
    <nav class="sidebar-nav">
      ${navLink("/learning-walks", "Learning Walks", active === "learning-walks")}
      ${navLink("/iqa-forms", "IQA Forms", active === "iqa-forms")}
      ${navLink("/assessments", "Assessments", active === "assessments")}
      ${navLink("/tracker", "Progress Tracker", active === "tracker")}
      ${navLink("/courses", "Our Courses", active === "courses")}
      ${navLink("/my-class", "My Class", active === "my-class")}
      ${navLink("/students", "Students", active === "students")}
      ${navLink("/reports", "Reports", active === "reports")}
      ${canViewReports(user) ? navLink("/quality-calendar", "Quality Calendar", active === "quality-calendar") : ""}
      ${isSuperuser(user) ? navLink("/users", "Users", active === "users") : ""}
    </nav>
  </aside>`;
}

function renderTopbar(identity: Identity, title: string) {
  return `<header class="topbar"><div><p class="eyebrow">Dashboard</p><h1>${escapeHtml(title)}</h1></div><div class="profile-pill">${escapeHtml(identity.email)}</div><a class="logout-link" href="/logout">Sign out</a></header>`;
}

function escapeHtml(value: string | null | undefined) { if (value == null) return ""; return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;"); }

// ============================================================
// HELPERS
// ============================================================

function generateId(): string {
  return crypto.randomUUID();
}

function isStaffRole(role: Role): boolean {
  return ["superuser", "admin", "assessor", "iqa", "eqa", "assessor_iqa"].includes(role);
}

function ragBadge(rag: string | null): string {
  if (!rag) return `<span class="rag-badge rag-grey">Not Set</span>`;
  const labels: Record<string, string> = { green: "On Track", amber: "Working Towards", red: "Behind Target" };
  return `<span class="rag-badge rag-${rag}">${labels[rag] ?? rag}</span>`;
}

function scoreBadge(entry: AssessmentEntry): string {
  if (entry.status !== "completed") return `<span class="score-badge score-pending">Not Started</span>`;
  const pct = entry.percentage;
  const cls = pct >= 70 ? "score-pass" : "score-fail";
  return `<span class="score-badge ${cls}">${entry.score_earned}/${entry.max_score} (${pct}%)</span>`;
}

// ============================================================
// LEARNERTRACK SYNC ENGINE
// ============================================================

async function syncClassEnrolments(courseInstanceId: string, env: Env): Promise<{ upserted: number; error: string | null }> {
  const apiKey = env.LT_USER_API || env["LearnerTrack.API"];
  const username = env.LT_USER_NAME ?? "GiuseppeA";
  if (!apiKey) return { upserted: 0, error: "LearnerTrack API key not configured" };
  const apiUrl = `https://betaapi.learnertrack.net/api/Enrolment?api_key=${encodeURIComponent(apiKey)}&username=${encodeURIComponent(username)}&courseinstanceid=${encodeURIComponent(courseInstanceId)}`;
  try {
    const r = await fetch(apiUrl, { headers: { "Accept": "application/json" } });
    if (!r.ok) return { upserted: 0, error: `LearnerTrack API returned ${r.status}` };
    const data = await r.json() as LearnerTrackEnrolment[];
    if (!Array.isArray(data)) return { upserted: 0, error: "Unexpected API response" };
    let upserted = 0;
    const stmts: any[] = [];
    for (const e of data) {
      if (!e.LearnerID) continue;
      const id = `${e.LearnerID}_${courseInstanceId}`;
      const learnerId = String(e.LearnerID);
      stmts.push(env.esol_marking_db.prepare(`
        INSERT INTO student_enrolments (id, learner_id, student_label, course_code, course_instance_id, course_title, course_type_category, academic_year, learn_start_date, comp_status, out_grade, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(learner_id, course_instance_id) DO UPDATE SET
          student_label=excluded.student_label, course_title=excluded.course_title,
          comp_status=excluded.comp_status, out_grade=excluded.out_grade, updated_at=CURRENT_TIMESTAMP
      `).bind(id, learnerId, e.StudentLabel ?? "", e.CourseCode ?? "", courseInstanceId, e.CourseTitle ?? "", e.CourseTypeCategory ?? null, e.AcademicYear ?? null, e.LearnStartDate ?? null, e.CourseStatus ?? null, null));
      // Ensure tracker record exists
      stmts.push(env.esol_marking_db.prepare(`
        INSERT OR IGNORE INTO student_trackers (id, enrolment_id, learner_id, course_instance_id)
        VALUES (?, ?, ?, ?)
      `).bind(generateId(), id, learnerId, courseInstanceId));
      upserted++;
    }
    if (stmts.length > 0) {
      await env.esol_marking_db.batch(stmts);
    }
    return { upserted, error: null };
  } catch (err: any) {
    return { upserted: 0, error: err?.message ?? String(err) };
  }
}

async function syncClassEnrolmentsHandler(request: Request, env: Env, identity: Identity): Promise<Response> {
  if (!identity.user || !isStaffRole(identity.user.role)) return json({ error: "Forbidden" }, 403);
  const body = await request.json() as { courseInstanceId?: string };
  const courseInstanceId = body.courseInstanceId?.trim();
  if (!courseInstanceId) return json({ error: "courseInstanceId required" }, 400);
  const result = await syncClassEnrolments(courseInstanceId, env);
  if (result.error) return json({ error: result.error }, 500);
  return json({ success: true, upserted: result.upserted });
}

async function listEnrolments(request: Request, env: Env, identity: Identity): Promise<Response> {
  if (!identity.user) return json({ error: "Forbidden" }, 403);
  const url = new URL(request.url);
  const courseInstanceId = url.searchParams.get("courseInstanceId");
  const learnerId = url.searchParams.get("learnerId");
  let q = "SELECT * FROM student_enrolments WHERE 1=1";
  const params: string[] = [];
  if (courseInstanceId) { q += " AND course_instance_id=?"; params.push(courseInstanceId); }
  if (learnerId) { q += " AND learner_id=?"; params.push(learnerId); }
  q += " ORDER BY student_label ASC";
  const { results } = await env.esol_marking_db.prepare(q).bind(...params).all<StudentEnrolment>();
  return json(results);
}

// ============================================================
// ASSESSMENT TEMPLATES
// ============================================================

async function listAssessmentTemplates(request: Request, env: Env, identity: Identity): Promise<Response> {
  if (!identity.user) return json({ error: "Forbidden" }, 403);
  const url = new URL(request.url);
  const type = url.searchParams.get("type"); // "quiz" | "tracker" | null
  let q = "SELECT * FROM assessment_templates WHERE is_active=1";
  const params: (string | number)[] = [];
  if (type) { q += " AND template_type=?"; params.push(type); }
  q += " ORDER BY created_at DESC";
  const { results } = await env.esol_marking_db.prepare(q).bind(...params).all<AssessmentTemplate>();
  return json(results);
}

async function saveAssessmentTemplate(request: Request, env: Env, identity: Identity): Promise<Response> {
  if (!identity.user || !isStaffRole(identity.user.role)) return json({ error: "Forbidden" }, 403);
  const body = await request.json() as {
    title?: string; description?: string; template_type?: string;
    category?: string; pass_percentage?: number;
    questions?: Array<{ question_text: string; question_type: string; options?: unknown; points?: number; correct_answer?: string; has_text_entry?: boolean; text_entry_label?: string; is_required?: boolean; sort_order?: number }>;
  };
  if (!body.title?.trim()) return json({ error: "title required" }, 400);
  const type = (body.template_type === "tracker") ? "tracker" : "quiz";
  const tmplId = generateId();
  let maxPoints = 0;
  const questions = body.questions ?? [];
  for (const q of questions) maxPoints += (q.points ?? 0);
  await env.esol_marking_db.prepare(`
    INSERT INTO assessment_templates (id, title, description, template_type, category, max_points, pass_percentage, is_active, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)
  `).bind(tmplId, body.title.trim(), body.description?.trim() ?? null, type, body.category?.trim() ?? "general", maxPoints, body.pass_percentage ?? 70, identity.user.id).run();
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    await env.esol_marking_db.prepare(`
      INSERT INTO assessment_template_questions (id, template_id, question_text, question_type, options, points, correct_answer, has_text_entry, text_entry_label, is_required, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(generateId(), tmplId, q.question_text, q.question_type ?? "text", q.options ? JSON.stringify(q.options) : null, q.points ?? 0, q.correct_answer ?? null, q.has_text_entry ? 1 : 0, q.text_entry_label ?? null, q.is_required ? 1 : 0, q.sort_order ?? i).run();
  }
  return json({ success: true, id: tmplId });
}

async function updateAssessmentTemplate(request: Request, env: Env, identity: Identity, id: string): Promise<Response> {
  if (!identity.user || !isStaffRole(identity.user.role)) return json({ error: "Forbidden" }, 403);
  const body = await request.json() as { title?: string; description?: string; category?: string; pass_percentage?: number; is_active?: number };
  await env.esol_marking_db.prepare(`
    UPDATE assessment_templates SET title=COALESCE(?,title), description=COALESCE(?,description), category=COALESCE(?,category), pass_percentage=COALESCE(?,pass_percentage), is_active=COALESCE(?,is_active), updated_at=CURRENT_TIMESTAMP WHERE id=?
  `).bind(body.title ?? null, body.description ?? null, body.category ?? null, body.pass_percentage ?? null, body.is_active ?? null, id).run();
  return json({ success: true });
}

async function deleteAssessmentTemplate(request: Request, env: Env, identity: Identity, id: string): Promise<Response> {
  if (!identity.user || !isStaffRole(identity.user.role)) return json({ error: "Forbidden" }, 403);
  await env.esol_marking_db.prepare("UPDATE assessment_templates SET is_active=0 WHERE id=?").bind(id).run();
  return json({ success: true });
}

// ============================================================
// ASSESSMENT ENTRIES
// ============================================================

async function submitAssessmentEntry(request: Request, env: Env, identity: Identity): Promise<Response> {
  if (!identity.user) return json({ error: "Forbidden" }, 403);
  const body = await request.json() as {
    template_id?: string;
    enrolment_id?: string;
    answers?: Record<string, string>;
  };
  if (!body.template_id || !body.enrolment_id) return json({ error: "template_id and enrolment_id required" }, 400);

  const enrolment = await env.esol_marking_db.prepare("SELECT * FROM student_enrolments WHERE id=?").bind(body.enrolment_id).first<StudentEnrolment>();
  if (!enrolment) return json({ error: "Enrolment not found" }, 404);

  const tmpl = await env.esol_marking_db.prepare("SELECT * FROM assessment_templates WHERE id=?").bind(body.template_id).first<AssessmentTemplate>();
  if (!tmpl) return json({ error: "Template not found" }, 404);

  const { results: questions } = await env.esol_marking_db.prepare("SELECT * FROM assessment_template_questions WHERE template_id=? ORDER BY sort_order").bind(body.template_id).all<AssessmentTemplateQuestion>();

  const answers = body.answers ?? {};
  let earned = 0;
  let maxScore = 0;
  for (const q of questions) {
    maxScore += q.points;
    if (q.correct_answer && answers[q.id] === q.correct_answer) earned += q.points;
    else if (!q.correct_answer && q.points > 0 && answers[q.id]) earned += q.points; // manual score later
  }
  const percentage = maxScore > 0 ? Math.round((earned / maxScore) * 100) : 0;

  // Upsert entry
  const existing = await env.esol_marking_db.prepare("SELECT id FROM assessment_entries WHERE template_id=? AND enrolment_id=?").bind(body.template_id, body.enrolment_id).first<{ id: string }>();
  const entryId = existing?.id ?? generateId();
  const now = new Date().toISOString();

  await env.esol_marking_db.prepare(`
    INSERT INTO assessment_entries (id, template_id, enrolment_id, learner_id, course_instance_id, status, score_earned, max_score, percentage, answers_json, completed_at, updated_at)
    VALUES (?, ?, ?, ?, ?, 'completed', ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(template_id, enrolment_id) DO UPDATE SET
      status='completed', score_earned=excluded.score_earned, max_score=excluded.max_score,
      percentage=excluded.percentage, answers_json=excluded.answers_json, completed_at=excluded.completed_at, updated_at=CURRENT_TIMESTAMP
  `).bind(entryId, body.template_id, body.enrolment_id, enrolment.learner_id, enrolment.course_instance_id, earned, maxScore, percentage, JSON.stringify(answers), now).run();

  return json({ success: true, id: entryId, score_earned: earned, max_score: maxScore, percentage });
}

async function listAssessmentEntries(request: Request, env: Env, identity: Identity): Promise<Response> {
  if (!identity.user) return json({ error: "Forbidden" }, 403);
  const url = new URL(request.url);
  const enrolmentId = url.searchParams.get("enrolment_id");
  const courseInstanceId = url.searchParams.get("course_instance_id");
  const learnerId = url.searchParams.get("learner_id");
  let q = "SELECT ae.*, at.title, at.template_type, at.max_points, at.pass_percentage FROM assessment_entries ae JOIN assessment_templates at ON at.id=ae.template_id WHERE 1=1";
  const params: string[] = [];
  if (enrolmentId) { q += " AND ae.enrolment_id=?"; params.push(enrolmentId); }
  if (courseInstanceId) { q += " AND ae.course_instance_id=?"; params.push(courseInstanceId); }
  if (learnerId) { q += " AND ae.learner_id=?"; params.push(learnerId); }
  q += " ORDER BY ae.created_at DESC";
  const { results } = await env.esol_marking_db.prepare(q).bind(...params).all();
  return json(results);
}

// ============================================================
// TRACKER / ILP
// ============================================================

async function getTrackerRecord(request: Request, env: Env, identity: Identity, enrolmentId: string): Promise<Response> {
  if (!identity.user) return json({ error: "Forbidden" }, 403);
  const tracker = await env.esol_marking_db.prepare("SELECT * FROM student_trackers WHERE enrolment_id=?").bind(enrolmentId).first<StudentTracker>();
  return json(tracker ?? null);
}

async function saveTrackerBatch(request: Request, env: Env, identity: Identity): Promise<Response> {
  if (!identity.user) return json({ error: "Forbidden" }, 403);
  if (!isStaffRole(identity.user.role)) return json({ error: "Forbidden" }, 403);
  const body = await request.json() as { updates: { enrolment_id: string, field: string, value: string }[] };
  if (!body.updates || !Array.isArray(body.updates)) return json({ error: "Invalid payload" }, 400);

  const updatesByEnrolment = new Map<string, Record<string, string>>();
  for (const u of body.updates) {
    if (!updatesByEnrolment.has(u.enrolment_id)) updatesByEnrolment.set(u.enrolment_id, {});
    updatesByEnrolment.get(u.enrolment_id)![u.field] = u.value;
  }

  const statements: any[] = [];
  for (const [enrolId, updates] of updatesByEnrolment.entries()) {
    let sql = "UPDATE student_trackers SET updated_at=CURRENT_TIMESTAMP";
    const binds: any[] = [];
    for (const [k, v] of Object.entries(updates)) {
      if (["initial_assessment_rag", "term1_rag", "term2_rag", "term3_rag"].includes(k)) {
        sql += `, ${k}=?`;
        binds.push(v || null);
        
        // Auto-generate date and author when a term RAG is updated
        if (k === "initial_assessment_rag") {
          sql += ", initial_assessment_date=CURRENT_DATE, initial_assessment_by=?";
          binds.push(identity.name);
        } else if (k === "term1_rag") {
          sql += ", term1_date=CURRENT_DATE, term1_by=?";
          binds.push(identity.name);
        } else if (k === "term2_rag") {
          sql += ", term2_date=CURRENT_DATE, term2_by=?";
          binds.push(identity.name);
        } else if (k === "term3_rag") {
          sql += ", term3_date=CURRENT_DATE, term3_by=?";
          binds.push(identity.name);
        }
      }
    }
    if (binds.length > 0) {
      sql += " WHERE enrolment_id=?";
      binds.push(enrolId);
      statements.push(env.esol_marking_db.prepare(sql).bind(...binds));
    }
  }

  if (statements.length > 0) {
    if (env.esol_marking_db.batch) {
      await env.esol_marking_db.batch(statements);
    } else {
      for (const stmt of statements) await stmt.run();
    }
  }

  return json({ success: true });
}

async function saveTrackerRecord(request: Request, env: Env, identity: Identity): Promise<Response> {
  if (!identity.user) return json({ error: "Forbidden" }, 403);
  const isStaff = isStaffRole(identity.user.role);
  const isStudent = identity.user.role === "student";
  const body = await request.json() as Partial<StudentTracker> & { enrolment_id?: string };
  if (!body.enrolment_id) return json({ error: "enrolment_id required" }, 400);

  const existing = await env.esol_marking_db.prepare("SELECT * FROM student_trackers WHERE enrolment_id=?").bind(body.enrolment_id).first<StudentTracker>();
  if (!existing) return json({ error: "Tracker record not found. Sync class first." }, 404);

  if (isStudent) {
    // Students can only update their own goals
    await env.esol_marking_db.prepare(`
      UPDATE student_trackers SET
        tailored_purpose=COALESCE(?,tailored_purpose),
        smart_goals=COALESCE(?,smart_goals),
        tailored_outcomes=COALESCE(?,tailored_outcomes),
        updated_at=CURRENT_TIMESTAMP
      WHERE enrolment_id=?
    `).bind(body.tailored_purpose ?? null, body.smart_goals ?? null, body.tailored_outcomes ?? null, body.enrolment_id).run();
  } else if (isStaff) {
    // Staff can update everything
    await env.esol_marking_db.prepare(`
      UPDATE student_trackers SET
        tailored_purpose=COALESCE(?,tailored_purpose),
        smart_goals=COALESCE(?,smart_goals),
        tailored_outcomes=COALESCE(?,tailored_outcomes),
        initial_assessment_level=COALESCE(?,initial_assessment_level),
        initial_assessment_rag=COALESCE(?,initial_assessment_rag),
        initial_assessment_notes=COALESCE(?,initial_assessment_notes),
        initial_assessment_date=COALESCE(?,initial_assessment_date),
        initial_assessment_by=COALESCE(?,initial_assessment_by),
        term1_grade=COALESCE(?,term1_grade), term1_rag=COALESCE(?,term1_rag), term1_comments=COALESCE(?,term1_comments), term1_date=COALESCE(?,term1_date), term1_by=COALESCE(?,term1_by),
        term2_grade=COALESCE(?,term2_grade), term2_rag=COALESCE(?,term2_rag), term2_comments=COALESCE(?,term2_comments), term2_date=COALESCE(?,term2_date), term2_by=COALESCE(?,term2_by),
        term3_grade=COALESCE(?,term3_grade), term3_rag=COALESCE(?,term3_rag), term3_comments=COALESCE(?,term3_comments), term3_date=COALESCE(?,term3_date), term3_by=COALESCE(?,term3_by),
        destination_type=COALESCE(?,destination_type), destination_notes=COALESCE(?,destination_notes), destination_date=COALESCE(?,destination_date), destination_by=COALESCE(?,destination_by),
        updated_at=CURRENT_TIMESTAMP
      WHERE enrolment_id=?
    `).bind(
      body.tailored_purpose ?? null, body.smart_goals ?? null, body.tailored_outcomes ?? null,
      body.initial_assessment_level ?? null, body.initial_assessment_rag ?? null, body.initial_assessment_notes ?? null, body.initial_assessment_date ?? null, identity.user.id,
      body.term1_grade ?? null, body.term1_rag ?? null, body.term1_comments ?? null, body.term1_date ?? null, identity.user.id,
      body.term2_grade ?? null, body.term2_rag ?? null, body.term2_comments ?? null, body.term2_date ?? null, identity.user.id,
      body.term3_grade ?? null, body.term3_rag ?? null, body.term3_comments ?? null, body.term3_date ?? null, identity.user.id,
      body.destination_type ?? null, body.destination_notes ?? null, body.destination_date ?? null, identity.user.id,
      body.enrolment_id
    ).run();
  } else {
    return json({ error: "Forbidden" }, 403);
  }
  return json({ success: true });
}

// ============================================================
// COMMENTS
// ============================================================

async function addAssessmentComment(request: Request, env: Env, identity: Identity, entityId: string): Promise<Response> {
  if (!identity.user) return json({ error: "Forbidden" }, 403);
  const body = await request.json() as { comment?: string; entity_type?: string };
  if (!body.comment?.trim()) return json({ error: "comment required" }, 400);
  const entityType = body.entity_type === "tracker" ? "tracker" : "assessment_entry";
  await env.esol_marking_db.prepare(`
    INSERT INTO assessment_comments (id, entity_type, entity_id, author_id, author_email, author_name, author_role, comment)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(generateId(), entityType, entityId, identity.user.id, identity.email, identity.name ?? identity.email, identity.user.role, body.comment.trim()).run();
  return json({ success: true });
}

async function listAssessmentComments(request: Request, env: Env, identity: Identity, entityId: string): Promise<Response> {
  if (!identity.user) return json({ error: "Forbidden" }, 403);
  const { results } = await env.esol_marking_db.prepare("SELECT * FROM assessment_comments WHERE entity_id=? ORDER BY created_at ASC").bind(entityId).all<AssessmentComment>();
  return json(results);
}

// ============================================================
// ASSESSMENTS PAGE
// ============================================================

async function renderAssessmentsPageHandler(request: Request, env: Env, identity: Identity): Promise<Response> {
  if (!identity.user) return htmlResponse(renderAccessPendingPage(identity), 403);
  const user = identity.user;
  const isStudent = user.role === "student";
  const url = new URL(request.url);

  // Fetch all active quiz templates
  const { results: templates } = await env.esol_marking_db.prepare("SELECT * FROM assessment_templates WHERE is_active=1 AND template_type='quiz' ORDER BY created_at DESC").all<AssessmentTemplate>();

  if (isStudent) {
    // Extract learner ID from email (e.g. 45345@haringeylearns.ac.uk → "45345")
    const learnerId = identity.email.split("@")[0].replace(/[^0-9]/g, "");
    let enrolments: StudentEnrolment[] = [];
    let entries: AssessmentEntry[] = [];
    if (learnerId) {
      const r1 = await env.esol_marking_db.prepare("SELECT * FROM student_enrolments WHERE learner_id=?").bind(learnerId).all<StudentEnrolment>();
      enrolments = r1.results;
      if (enrolments.length > 0) {
        const r2 = await env.esol_marking_db.prepare("SELECT * FROM assessment_entries WHERE learner_id=?").bind(learnerId).all<AssessmentEntry>();
        entries = r2.results;
      }
    }
    const requestedEnrolId = url.searchParams.get("enrolId") ?? enrolments[0]?.id ?? "";
    return htmlResponse(renderStudentAssessmentsPage(identity, templates, enrolments, entries, learnerId, requestedEnrolId));
  } else {
    // Teacher / staff view
    const courseInstanceId = url.searchParams.get("courseId") ?? "";
    let enrolments: StudentEnrolment[] = [];
    let entries: AssessmentEntry[] = [];
    let syncMsg = "";
    if (courseInstanceId) {
      const r1 = await env.esol_marking_db.prepare("SELECT * FROM student_enrolments WHERE course_instance_id=? ORDER BY student_label ASC").bind(courseInstanceId).all<StudentEnrolment>();
      enrolments = r1.results;
      const r2 = await env.esol_marking_db.prepare("SELECT * FROM assessment_entries WHERE course_instance_id=?").bind(courseInstanceId).all<AssessmentEntry>();
      entries = r2.results;
    }
    return htmlResponse(renderStaffAssessmentsPage(identity, templates, enrolments, entries, courseInstanceId, syncMsg));
  }
}

function renderStudentAssessmentsPage(identity: Identity, templates: AssessmentTemplate[], enrolments: StudentEnrolment[], entries: AssessmentEntry[], learnerId: string, activeEnrolmentId: string): string {
  const entryMap = new Map(entries.map(e => [e.template_id + "_" + e.enrolment_id, e]));
  const courseOptions = enrolments.map(en => `<option value="${escapeHtml(en.id)}">${escapeHtml(en.course_title)} (${escapeHtml(en.course_code)})</option>`).join("");
  const tilesHtml = templates.map(t => {
    const enrolmentId = enrolments[0]?.id ?? ""; // default to first enrolment
    const key = t.id + "_" + enrolmentId;
    const entry = entryMap.get(key);
    const done = entry?.status === "completed";
    const pct = entry?.percentage ?? 0;
    const scoreText = done ? `${entry!.score_earned}/${entry!.max_score} (${pct}%)` : "Not started";
    return `
    <div class="assess-tile ${done ? "assess-tile--done" : ""}" data-template-id="${escapeHtml(t.id)}" data-enrolment-id="${escapeHtml(activeEnrolmentId)}" onclick="openQuizModal('${escapeHtml(t.id)}','${escapeHtml(activeEnrolmentId)}','${escapeHtml(t.title)}',${done ? 1 : 0})">
      <div class="assess-tile-icon">${done ? "✅" : "📝"}</div>
      <div class="assess-tile-body">
        <h3>${escapeHtml(t.title)}</h3>
        <p>${escapeHtml(t.description ?? "")}</p>
        <div class="assess-tile-meta">
          <span class="meta-chip">${t.max_points} pts</span>
          ${done ? `<span class="meta-chip chip-green">${escapeHtml(scoreText)}</span>` : `<span class="meta-chip chip-grey">${escapeHtml(scoreText)}</span>`}
        </div>
      </div>
    </div>`;
  }).join("");

  return pageShell("My Assessments", `
    <main class="dashboard-shell">
      ${renderSidebar(identity, "assessments")}
      <div class="content">
        ${renderTopbar(identity, "My Assessments")}
        <section class="page-section">
          ${learnerId ? "" : `<div class="alert alert-warn">Your student ID could not be extracted from your email address. Please contact your tutor.</div>`}
          ${enrolments.length === 0 && learnerId ? `<div class="alert alert-info">No enrolments found for learner ID <strong>${escapeHtml(learnerId)}</strong>. Please check with your tutor.</div>` : ""}
          ${enrolments.length > 1 ? `<div class="enrol-selector"><label>Viewing for course: <select onchange="location.href='/assessments?enrolId='+this.value">${courseOptions}</select></label></div>` : ""}
          <div class="assess-tiles">
            ${tilesHtml || "<p class='muted-text'>No assessments available yet.</p>"}
          </div>
        </section>
      </div>
    </main>
    <div class="modal-overlay" id="quizModal" style="display:none">
      <div class="modal-box modal-large">
        <div class="modal-header">
          <h2 id="quizModalTitle">Quiz</h2>
          <button class="modal-close" onclick="closeQuizModal()">&times;</button>
        </div>
        <div class="modal-body" id="quizModalBody"></div>
        <div class="modal-footer" id="quizModalFooter"></div>
      </div>
    </div>
    <style>
      .assess-tiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.25rem;padding:1.5rem}
      .assess-tile{background:#fff;border:2px solid #e2e8f0;border-radius:14px;padding:1.25rem;cursor:pointer;transition:all .2s;display:flex;gap:1rem;align-items:flex-start}
      .assess-tile:hover{border-color:var(--primary);box-shadow:0 4px 16px rgba(0,0,0,.1);transform:translateY(-2px)}
      .assess-tile--done{border-color:#22c55e;background:#f0fdf4}
      .assess-tile-icon{font-size:1.75rem;flex-shrink:0}
      .assess-tile-body h3{margin:0 0 .25rem;font-size:1rem;font-weight:700;color:var(--text)}
      .assess-tile-body p{margin:0 0 .5rem;font-size:.875rem;color:var(--muted)}
      .assess-tile-meta{display:flex;flex-wrap:wrap;gap:.35rem}
      .meta-chip{font-size:.75rem;font-weight:600;padding:.2rem .6rem;border-radius:20px;background:#f1f5f9;color:#475569}
      .chip-green{background:#dcfce7;color:#166534}
      .chip-grey{background:#f1f5f9;color:#64748b}
      .enrol-selector{padding:1rem 1.5rem;background:#f8fafc;border-bottom:1px solid #e2e8f0}
      .enrol-selector select{margin-left:.5rem;padding:.35rem .75rem;border:1px solid #d1d5db;border-radius:6px}
      .alert{padding:.875rem 1.25rem;border-radius:10px;margin:1rem 1.5rem;font-size:.9375rem}
      .alert-warn{background:#fffbeb;border:1px solid #fcd34d;color:#92400e}
      .alert-info{background:#eff6ff;border:1px solid #bfdbfe;color:#1e40af}
      .quiz-question{margin-bottom:1.5rem;padding-bottom:1.5rem;border-bottom:1px solid #e2e8f0}
      .quiz-question:last-child{border-bottom:none}
      .quiz-question-text{font-weight:600;margin-bottom:.75rem}
      .quiz-pts{font-size:.8rem;color:#7c3aed;background:#f5f3ff;padding:.15rem .45rem;border-radius:10px;margin-left:.5rem}
      .quiz-options label{display:flex;align-items:center;gap:.5rem;padding:.5rem .75rem;border-radius:8px;cursor:pointer;transition:background .1s}
      .quiz-options label:hover{background:#f8fafc}
      .quiz-options input{accent-color:var(--primary)}
      .score-result{text-align:center;padding:2rem}
      .score-circle{width:120px;height:120px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:1.75rem;font-weight:800;margin-bottom:1rem}
      .score-pass-circle{background:#dcfce7;color:#166534;border:4px solid #22c55e}
      .score-fail-circle{background:#fee2e2;color:#991b1b;border:4px solid #ef4444}
      .rag-badge{display:inline-block;padding:.25rem .75rem;border-radius:20px;font-size:.8125rem;font-weight:700;text-transform:uppercase;letter-spacing:.04em}
      .rag-green{background:#dcfce7;color:#166534}
      .rag-amber{background:#fffbeb;color:#92400e}
      .rag-red{background:#fee2e2;color:#991b1b}
      .rag-grey{background:#f1f5f9;color:#64748b}
      .score-badge{display:inline-block;padding:.2rem .6rem;border-radius:20px;font-size:.8125rem;font-weight:600}
      .score-pass{background:#dcfce7;color:#166534}
      .score-fail{background:#fee2e2;color:#991b1b}
      .score-pending{background:#f1f5f9;color:#64748b}
      .modal-large{max-width:700px;width:95vw}
    </style>
    <script>
    function openQuizModal(templateId, enrolmentId, title, isDone) {
      document.getElementById('quizModalTitle').textContent = title;
      const body = document.getElementById('quizModalBody');
      const footer = document.getElementById('quizModalFooter');
      body.innerHTML = '<div class="loading-spinner"></div>';
      footer.innerHTML = '';
      document.getElementById('quizModal').style.display = 'flex';
      fetch('/api/assessment/templates?type=quiz')
        .then(r => r.json())
        .then(() => {
          // Load questions for this template
          return fetch('/api/assessment/templates/' + encodeURIComponent(templateId) + '?questions=1');
        })
        .catch(() => loadQuestionsDirectly(templateId, enrolmentId, title, isDone));
      loadQuestionsDirectly(templateId, enrolmentId, title, isDone);
    }
    function loadQuestionsDirectly(templateId, enrolmentId, title, isDone) {
      // For now show a placeholder - full quiz player loaded server-side via redirect
      const body = document.getElementById('quizModalBody');
      const footer = document.getElementById('quizModalFooter');
      if (isDone) {
        body.innerHTML = '<div class="score-result"><p>You have already completed this assessment.</p><p>Contact your tutor to review your results.</p></div>';
        footer.innerHTML = '<button class="btn btn-secondary" onclick="closeQuizModal()">Close</button>';
      } else {
        window.location.href = '/assessments/quiz/' + encodeURIComponent(templateId) + '?enrolmentId=' + encodeURIComponent(enrolmentId);
      }
    }
    function closeQuizModal() {
      document.getElementById('quizModal').style.display = 'none';
    }
    document.getElementById('quizModal').addEventListener('click', function(e) {
      if (e.target === this) closeQuizModal();
    });
    </script>
  `);
}

function renderStaffAssessmentsPage(identity: Identity, templates: AssessmentTemplate[], enrolments: StudentEnrolment[], entries: AssessmentEntry[], courseInstanceId: string, syncMsg: string): string {
  const isAdmin = isStaffRole(identity.user!.role);
  // Build entry map: template_id + enrolment_id -> entry
  const entryMap = new Map(entries.map(e => [e.template_id + "_" + e.enrolment_id, e]));

  const rosterHtml = enrolments.length === 0 ? "" : `
    <div class="roster-table-wrap">
      <table class="data-table">
        <thead><tr>
          <th>Student</th>
          <th>Learner ID</th>
          <th>Course</th>
          ${templates.map(t => `<th title="${escapeHtml(t.title)}">${escapeHtml(t.title.length > 18 ? t.title.slice(0, 18) + "…" : t.title)}</th>`).join("")}
        </tr></thead>
        <tbody>
          ${enrolments.map(en => {
            const cols = templates.map(t => {
              const entry = entryMap.get(t.id + "_" + en.id);
              if (!entry) return `<td><span class="meta-chip chip-grey">—</span></td>`;
              const pct = entry.percentage;
              const cls = pct >= (t.pass_percentage ?? 70) ? "chip-green" : "chip-amber";
              return `<td><span class="meta-chip ${cls}">${entry.score_earned}/${entry.max_score}</span></td>`;
            }).join("");
            return `<tr>
              <td><strong>${escapeHtml(en.student_label)}</strong></td>
              <td>${escapeHtml(en.learner_id)}</td>
              <td>${escapeHtml(en.course_title)}</td>
              ${cols}
            </tr>`;
          }).join("")}
        </tbody>
      </table>
    </div>`;

  return pageShell("Assessments", `
    <main class="dashboard-shell">
      ${renderSidebar(identity, "assessments")}
      <div class="content">
        ${renderTopbar(identity, "Assessments")}
        <section class="page-section">
          <div class="assess-toolbar">
            <form method="GET" action="/assessments" class="assess-search-form">
              <input class="form-input" name="courseId" placeholder="Course Instance ID…" value="${escapeHtml(courseInstanceId)}">
              <button class="btn btn-primary" type="submit">Search</button>
              ${courseInstanceId ? `<button class="btn btn-secondary" type="button" onclick="syncClass()">Sync Class</button>` : ""}
            </form>
            ${isAdmin ? `<button class="btn btn-pink" onclick="openTemplateBuilder()">+ New Template</button>` : ""}
          </div>
          ${syncMsg ? `<div class="alert alert-info">${escapeHtml(syncMsg)}</div>` : ""}
          ${courseInstanceId && enrolments.length === 0 ? `<div class="alert alert-warn">No enrolments found for course ID <strong>${escapeHtml(courseInstanceId)}</strong>. Try syncing first.</div>` : ""}

          <!-- Quiz Template Tiles -->
          <div class="section-header"><h2>Assessment Templates</h2></div>
          <div class="assess-tiles">
            ${templates.length === 0 ? "<p class='muted-text' style='padding:1rem'>No quiz templates yet. Create one with + New Template.</p>" : templates.map(t => `
            <div class="assess-tile">
              <div class="assess-tile-icon">📝</div>
              <div class="assess-tile-body">
                <h3>${escapeHtml(t.title)}</h3>
                <p>${escapeHtml(t.description ?? "")}</p>
                <div class="assess-tile-meta">
                  <span class="meta-chip">${t.max_points} pts total</span>
                  <span class="meta-chip chip-grey">Pass: ${t.pass_percentage}%</span>
                </div>
              </div>
            </div>`).join("")}
          </div>

          ${rosterHtml ? `<div class="section-header" style="margin-top:2rem"><h2>Class Roster — ${escapeHtml(courseInstanceId)}</h2></div>${rosterHtml}` : ""}
        </section>
      </div>
    </main>

    <!-- Template Builder Modal -->
    <div class="modal-overlay" id="templateBuilderModal" style="display:none">
      <div class="modal-box modal-large">
        <div class="modal-header">
          <h2>New Assessment Template</h2>
          <button class="modal-close" onclick="closeTemplateBuilder()">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Template Type</label>
            <div style="display:flex;gap:.75rem">
              <label style="display:flex;align-items:center;gap:.4rem;cursor:pointer"><input type="radio" name="tmplType" value="quiz" checked onchange="updateTmplType(this.value)"> <strong>Assessment / Quiz</strong> (with points)</label>
              <label style="display:flex;align-items:center;gap:.4rem;cursor:pointer"><input type="radio" name="tmplType" value="tracker" onchange="updateTmplType(this.value)"> <strong>Tracker Form</strong> (no points)</label>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Title *</label>
              <input class="form-input" id="tmplTitle" placeholder="e.g. Diagnostic Assessment Term 1">
            </div>
            <div class="form-group">
              <label class="form-label">Category</label>
              <select class="form-input" id="tmplCategory">
                <option value="diagnostic">Diagnostic</option>
                <option value="quiz">Quiz / Unit Test</option>
                <option value="milestone">Milestone</option>
                <option value="final">Final Assessment</option>
                <option value="reflection">Reflection</option>
                <option value="general">General</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea class="form-input" id="tmplDesc" rows="2" placeholder="Brief description"></textarea>
          </div>
          <div class="form-group" id="tmplPassGroup">
            <label class="form-label">Pass Percentage (%)</label>
            <input class="form-input" id="tmplPass" type="number" value="70" min="0" max="100">
          </div>
          <div class="section-header" style="margin-top:1.5rem"><h3>Questions</h3></div>
          <div id="tmplQuestions"></div>
          <button class="btn btn-secondary" style="margin:.75rem 0" onclick="addQuestion()">+ Add Question</button>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="closeTemplateBuilder()">Cancel</button>
          <button class="btn btn-primary" onclick="saveTemplate()">Save Template</button>
        </div>
      </div>
    </div>

    <style>
      .assess-toolbar{display:flex;align-items:center;gap:1rem;padding:1rem 1.5rem;background:#f8fafc;border-bottom:1px solid #e2e8f0;flex-wrap:wrap}
      .assess-search-form{display:flex;gap:.5rem;flex:1;min-width:280px}
      .btn-pink{background:#e91e8c;color:#fff;border:none;padding:.55rem 1.1rem;border-radius:8px;font-weight:700;cursor:pointer;font-size:.9375rem;transition:background .2s}
      .btn-pink:hover{background:#c0157a}
      .assess-tiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1rem;padding:1rem 1.5rem}
      .assess-tile{background:#fff;border:2px solid #e2e8f0;border-radius:12px;padding:1.1rem;display:flex;gap:.85rem;align-items:flex-start}
      .assess-tile-icon{font-size:1.5rem;flex-shrink:0}
      .assess-tile-body h3{margin:0 0 .2rem;font-size:.9375rem;font-weight:700}
      .assess-tile-body p{margin:0 0 .4rem;font-size:.8125rem;color:var(--muted)}
      .assess-tile-meta{display:flex;flex-wrap:wrap;gap:.3rem}
      .section-header{padding:.75rem 1.5rem 0}
      .section-header h2,.section-header h3{margin:0;font-size:1.125rem;font-weight:700;color:var(--text)}
      .roster-table-wrap{overflow-x:auto;padding:0 1.5rem 1.5rem}
      .data-table{width:100%;border-collapse:collapse;font-size:.875rem}
      .data-table th,.data-table td{padding:.6rem .85rem;border-bottom:1px solid #e2e8f0;text-align:left}
      .data-table th{background:#f8fafc;font-weight:700;color:#374151}
      .data-table tr:hover td{background:#f8fafc}
      .meta-chip{font-size:.75rem;font-weight:600;padding:.2rem .5rem;border-radius:12px;background:#f1f5f9;color:#475569;white-space:nowrap}
      .chip-green{background:#dcfce7!important;color:#166534!important}
      .chip-amber{background:#fffbeb!important;color:#92400e!important}
      .chip-grey{background:#f1f5f9!important;color:#64748b!important}
      .q-row{background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:1rem;margin-bottom:.75rem}
      .q-row-header{display:flex;align-items:center;gap:.75rem;margin-bottom:.75rem}
      .q-row-header input[type=text]{flex:1}
      .q-pts-input{width:80px!important}
    </style>
    <script>
    let tmplType = 'quiz';
    let questionIdx = 0;
    function updateTmplType(t) {
      tmplType = t;
      document.getElementById('tmplPassGroup').style.display = t === 'quiz' ? '' : 'none';
      // update existing point inputs
      document.querySelectorAll('.q-pts-wrap').forEach(el => { el.style.display = t === 'quiz' ? '' : 'none'; });
    }
    function addQuestion() {
      const idx = questionIdx++;
      const div = document.createElement('div');
      div.className = 'q-row';
      div.id = 'q-row-' + idx;
      div.innerHTML = \`
        <div class="q-row-header">
          <span class="meta-chip">#\${idx+1}</span>
          <input type="text" class="form-input" id="q-text-\${idx}" placeholder="Question text" style="flex:1">
          <div class="q-pts-wrap"\${tmplType !== 'quiz' ? ' style="display:none"' : ''}>
            <input type="number" class="form-input q-pts-input" id="q-pts-\${idx}" placeholder="Pts" min="0" value="1">
          </div>
          <button class="btn btn-secondary" style="padding:.3rem .7rem" onclick="removeQ(\${idx})">✖</button>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Type</label>
            <select class="form-input" id="q-type-\${idx}" onchange="renderQOptions(\${idx})">
              <option value="text">Text (short)</option>
              <option value="textarea">Text (long)</option>
              <option value="single_choice">Single Choice</option>
              <option value="multiple_choice">Multiple Choice</option>
              <option value="number">Number</option>
              <option value="rating">Rating (1-5)</option>
            </select>
          </div>
        </div>
        <div id="q-options-\${idx}"></div>
      \`;
      document.getElementById('tmplQuestions').appendChild(div);
    }
    function removeQ(idx) { const el = document.getElementById('q-row-' + idx); if (el) el.remove(); }
    function renderQOptions(idx) {
      const type = document.getElementById('q-type-' + idx).value;
      const wrap = document.getElementById('q-options-' + idx);
      if (type === 'single_choice' || type === 'multiple_choice') {
        wrap.innerHTML = '<div class="form-group"><label class="form-label">Options (one per line, prefix correct with *)</label><textarea class="form-input" id="q-opts-'+idx+'" rows="3" placeholder="*Option A (correct)&#10;Option B&#10;Option C"></textarea></div>';
      } else { wrap.innerHTML = ''; }
    }
    function collectQuestions() {
      const rows = document.querySelectorAll('.q-row');
      const qs = [];
      rows.forEach((row, i) => {
        const idxMatch = row.id.match(/q-row-(\d+)/);
        if (!idxMatch) return;
        const idx = idxMatch[1];
        const text = document.getElementById('q-text-' + idx)?.value?.trim();
        if (!text) return;
        const type = document.getElementById('q-type-' + idx)?.value ?? 'text';
        const ptsEl = document.getElementById('q-pts-' + idx);
        const pts = ptsEl ? parseInt(ptsEl.value) || 0 : 0;
        let options = null, correctAnswer = null;
        const optsEl = document.getElementById('q-opts-' + idx);
        if (optsEl) {
          const lines = optsEl.value.split('\\n').map(l => l.trim()).filter(Boolean);
          options = lines.map(l => { const isCorrect = l.startsWith('*'); const label = l.replace(/^\\*/, '').trim(); return { label, value: label.toLowerCase().replace(/\\s+/g,'_'), correct: isCorrect }; });
          const correct = options.find(o => o.correct);
          if (correct) correctAnswer = correct.value;
        }
        qs.push({ question_text: text, question_type: type, options, points: pts, correct_answer: correctAnswer, sort_order: i, is_required: 1 });
      });
      return qs;
    }
    async function saveTemplate() {
      const title = document.getElementById('tmplTitle').value.trim();
      if (!title) { alert('Please enter a title'); return; }
      const questions = collectQuestions();
      const payload = {
        title,
        description: document.getElementById('tmplDesc').value.trim() || null,
        template_type: tmplType,
        category: document.getElementById('tmplCategory').value,
        pass_percentage: parseInt(document.getElementById('tmplPass')?.value) || 70,
        questions
      };
      const r = await fetch('/api/assessment/templates', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const d = await r.json();
      if (d.success) { closeTemplateBuilder(); location.reload(); }
      else alert('Error: ' + (d.error || 'Unknown error'));
    }
    function openTemplateBuilder() { document.getElementById('templateBuilderModal').style.display = 'flex'; }
    function closeTemplateBuilder() { document.getElementById('templateBuilderModal').style.display = 'none'; }
    async function syncClass() {
      const courseId = new URLSearchParams(location.search).get('courseId');
      if (!courseId) return;
      const r = await fetch('/api/assessment/sync', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ courseInstanceId: courseId }) });
      const d = await r.json();
      alert(d.error ? 'Error: ' + d.error : 'Synced ' + d.upserted + ' enrolment(s)');
      if (!d.error) location.reload();
    }
    </script>
  `);
}

// ============================================================
// TRACKER PAGE
// ============================================================

async function renderTrackerPageHandler(request: Request, env: Env, identity: Identity): Promise<Response> {
  if (!identity.user) return htmlResponse(renderAccessPendingPage(identity), 403);
  const user = identity.user;
  const isStudent = user.role === "student";
  const url = new URL(request.url);

  if (isStudent) {
    const learnerId = identity.email.split("@")[0].replace(/[^0-9]/g, "");
    let enrolments: StudentEnrolment[] = [];
    let tracker: StudentTracker | null = null;
    let comments: AssessmentComment[] = [];
    if (learnerId) {
      const r1 = await env.esol_marking_db.prepare("SELECT * FROM student_enrolments WHERE learner_id=?").bind(learnerId).all<StudentEnrolment>();
      enrolments = r1.results;
      if (enrolments.length > 0) {
        const enrolmentId = url.searchParams.get("enrolId") ?? enrolments[0].id;
        tracker = await env.esol_marking_db.prepare("SELECT * FROM student_trackers WHERE enrolment_id=?").bind(enrolmentId).first<StudentTracker>();
        const r3 = await env.esol_marking_db.prepare("SELECT * FROM assessment_comments WHERE entity_id=? AND entity_type='tracker' ORDER BY created_at ASC").bind(enrolmentId).all<AssessmentComment>();
        comments = r3.results;
      }
    }
    const requestedEnrolId = url.searchParams.get("enrolId") ?? enrolments[0]?.id ?? "";
    return htmlResponse(renderStudentTrackerPage(identity, enrolments, tracker, comments, learnerId, requestedEnrolId));
  } else {
    // Staff view

    const rCourses = await env.esol_marking_db.prepare("SELECT DISTINCT course_instance_id, course_title FROM student_enrolments WHERE course_instance_id IS NOT NULL AND course_instance_id != '' ORDER BY course_title ASC").all<{course_instance_id: string, course_title: string}>();
    const allCourses = rCourses.results;
    const courseInstanceId = url.searchParams.get("courseId") ?? "";
    const studentEnrolId = url.searchParams.get("enrolId") ?? "";
    let enrolments: StudentEnrolment[] = [];
    let trackers: StudentTracker[] = [];
    let selectedTracker: StudentTracker | null = null;
    let selectedEnrolment: StudentEnrolment | null = null;
    let comments: AssessmentComment[] = [];
    if (courseInstanceId) {
      const r1 = await env.esol_marking_db.prepare("SELECT * FROM student_enrolments WHERE course_instance_id=? ORDER BY student_label ASC").bind(courseInstanceId).all<StudentEnrolment>();
      enrolments = r1.results;
      const r2 = await env.esol_marking_db.prepare("SELECT * FROM student_trackers WHERE course_instance_id=?").bind(courseInstanceId).all<StudentTracker>();
      trackers = r2.results;
    }
    if (studentEnrolId) {
      selectedTracker = trackers.find(t => t.enrolment_id === studentEnrolId) || await env.esol_marking_db.prepare("SELECT * FROM student_trackers WHERE enrolment_id=?").bind(studentEnrolId).first<StudentTracker>();
      selectedEnrolment = await env.esol_marking_db.prepare("SELECT * FROM student_enrolments WHERE id=?").bind(studentEnrolId).first<StudentEnrolment>();
      const r3 = await env.esol_marking_db.prepare("SELECT * FROM assessment_comments WHERE entity_id=? AND entity_type='tracker' ORDER BY created_at ASC").bind(studentEnrolId).all<AssessmentComment>();
      comments = r3.results;
    }
    return htmlResponse(renderStaffTrackerPage(identity, enrolments, trackers, courseInstanceId, selectedEnrolment, selectedTracker, comments, allCourses));
  }
}

function renderTrackerTile(id: string, emoji: string, title: string, content: string, editable: boolean, editAction: string): string {
  const hasContent = content.trim().length > 0;
  return `
  <div class="tracker-tile ${hasContent ? "tracker-tile--done" : ""}" id="tile-${escapeHtml(id)}">
    <div class="tracker-tile-header">
      <span class="tracker-tile-emoji">${emoji}</span>
      <h3>${escapeHtml(title)}</h3>
      ${hasContent ? "<span class='rag-badge rag-green' style='margin-left:auto'>Completed</span>" : "<span class='rag-badge rag-grey' style='margin-left:auto'>Pending</span>"}
    </div>
    <div class="tracker-tile-body">${content || `<p class="muted-text">Not filled in yet.</p>`}</div>
    ${editable ? `<div class="tracker-tile-footer"><button class="btn btn-secondary" onclick="${editAction}">✏️ Edit</button></div>` : ""}
  </div>`;
}


function renderStudentTrackerPage(identity: Identity, enrolments: StudentEnrolment[], tracker: StudentTracker | null, comments: AssessmentComment[], learnerId: string, activeEnrolmentId: string): string {
  const enrolment = enrolments.find(e => e.id === activeEnrolmentId) ?? enrolments[0] ?? null;

  const purposeTile = renderTrackerTile("purpose", "🎯", "Tailored Learning Purpose",
    tracker?.tailored_purpose ? `<p>${escapeHtml(tracker.tailored_purpose)}</p>` : "",
    true, "openStudentEdit('purpose')");

  const goalsTile = renderTrackerTile("goals", "📋", "SMART Goals",
    tracker?.smart_goals ? `<pre style="white-space:pre-wrap;font-family:inherit">${escapeHtml(tracker.smart_goals)}</pre>` : "",
    true, "openStudentEdit('goals')");

  const outcomesTile = renderTrackerTile("outcomes", "✨", "Tailored Learning Outcomes",
    tracker?.tailored_outcomes ? `<p>${escapeHtml(tracker.tailored_outcomes)}</p>` : "",
    true, "openStudentEdit('outcomes')");
  const closTile = renderTrackerTile("clos", "📚", "Course Learning Objectives",
    tracker?.course_learning_objectives ? `<pre style="white-space:pre-wrap;font-family:inherit">${escapeHtml(tracker.course_learning_objectives)}</pre>` : "",
    true, "openStudentEdit('clos')");


  const diagnosticTile = renderTrackerTile("diagnostic", "🔍", "Initial Assessment & Diagnostic",
    tracker?.initial_assessment_level ? `
      <div style="display:flex;align-items:center;gap:.75rem;margin-bottom:.5rem">
        <strong>Level:</strong> ${escapeHtml(tracker.initial_assessment_level)}
        ${ragBadge(tracker.initial_assessment_rag)}
      </div>
      <p>${escapeHtml(tracker.initial_assessment_notes ?? "")}</p>` : "",
    false, "");

  function termTile(n: 1 | 2 | 3) {
    const rag = tracker?.[`term${n}_rag` as keyof StudentTracker] as string | null;
    const tComments = tracker?.[`term${n}_comments` as keyof StudentTracker] as string | null;
    const tDate = tracker?.[`term${n}_date` as keyof StudentTracker] as string | null;
    const tileContent = rag
      ? `<div style="display:flex;align-items:center;gap:.75rem;margin-bottom:.5rem">${ragBadge(rag)}${tDate ? `<span style="color:var(--muted);font-size:.875rem">Updated: ${escapeHtml(tDate)}</span>` : ""}</div>${tComments ? `<p>${escapeHtml(tComments)}</p>` : ""}`
      : "";
    return renderTrackerTile(`term${n}`, "📊", `Term ${n} Review`,
      tileContent,
      false, "");
  }

  
  const closAchievedTile = tracker?.clos_achieved_rag ? renderTrackerTile("clos_achieved", "✅", "CLOs Achieved Confirmation",
    `<div style="display:flex;align-items:center;gap:.75rem;">${ragBadge(tracker.clos_achieved_rag)}</div>`,
    false, "") : "";
const destinationTile = renderTrackerTile("destination", "🚀", "Destination & Progression",
    tracker?.destination_type ? `<p><strong>${escapeHtml(tracker.destination_type)}</strong></p><p>${escapeHtml(tracker.destination_notes ?? "")}</p>` : "",
    false, "");

  const commentsHtml = comments.map(c => `
    <div class="comment-row comment-${escapeHtml(c.author_role)}">
      <div class="comment-meta"><strong>${escapeHtml(c.author_name)}</strong> <span class="meta-chip">${escapeHtml(c.author_role)}</span> <span class="muted-text">${escapeHtml(c.created_at.slice(0,10))}</span></div>
      <p>${escapeHtml(c.comment)}</p>
    </div>`).join("");

  return pageShell("My Progress Tracker", `
    <main class="dashboard-shell">
      ${renderSidebar(identity, "tracker")}
      <div class="content">
        ${renderTopbar(identity, "My Progress Tracker")}
        <section class="page-section">
          ${!learnerId ? `<div class="alert alert-warn">Could not determine your learner ID from your email.</div>` : ""}
          ${enrolment ? `<div class="tracker-course-banner"><strong>${escapeHtml(enrolment.course_title)}</strong> <span class="meta-chip">${escapeHtml(enrolment.course_code)}</span></div>` : ""}
          <div class="tracker-tiles">
            ${purposeTile}${goalsTile}${outcomesTile}${diagnosticTile}${termTile(1)}${termTile(2)}${termTile(3)}${destinationTile}
          </div>
          ${tracker ? `
          <div class="tracker-comments">
            <h3>Discussion Thread</h3>
            <div class="comments-list">${commentsHtml || "<p class='muted-text'>No comments yet.</p>"}</div>
            <div class="comment-form">
              <textarea class="form-input" id="newComment" rows="2" placeholder="Add a comment…"></textarea>
              <button class="btn btn-primary" onclick="postComment('${escapeHtml(tracker?.enrolment_id ?? "")}','tracker')">Post Comment</button>
            </div>
          </div>` : ""}
        </section>
      </div>
    </main>

    <!-- Edit Modal -->
    <div class="modal-overlay" id="studentEditModal" style="display:none">
      <div class="modal-box">
        <div class="modal-header"><h2 id="editModalTitle">Edit</h2><button class="modal-close" onclick="closeStudentEdit()">&times;</button></div>
        <div class="modal-body">
          <textarea class="form-input" id="editModalValue" rows="6" style="width:100%"></textarea>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="closeStudentEdit()">Cancel</button>
          <button class="btn btn-primary" onclick="saveStudentEdit()">Save</button>
        </div>
      </div>
    </div>

    <style>
      .tracker-course-banner{padding:.75rem 1.5rem;background:#f0f9ff;border-bottom:1px solid #bfdbfe;font-size:.9375rem}
      .tracker-tiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:1.25rem;padding:1.5rem}
      .tracker-tile{background:#fff;border:2px solid #e2e8f0;border-radius:14px;overflow:hidden;transition:border-color .2s}
      .tracker-tile--done{border-color:#22c55e}
      .tracker-tile-header{display:flex;align-items:center;gap:.75rem;padding:1rem 1.25rem;background:#f8fafc;border-bottom:1px solid #e2e8f0}
      .tracker-tile-emoji{font-size:1.5rem}
      .tracker-tile-header h3{margin:0;font-size:1rem;font-weight:700;flex:1}
      .tracker-tile-body{padding:1rem 1.25rem;font-size:.9375rem;color:var(--text)}
      .tracker-tile-footer{padding:.75rem 1.25rem;border-top:1px solid #e2e8f0;background:#fafafa}
      .tracker-comments{padding:1.5rem;border-top:2px solid #e2e8f0;margin-top:1rem}
      .tracker-comments h3{font-size:1.125rem;font-weight:700;margin-bottom:1rem}
      .comment-row{padding:.75rem 1rem;border-radius:10px;margin-bottom:.75rem}
      .comment-student{background:#eff6ff;border-left:3px solid #3b82f6}
      .comment-teacher,.comment-assessor,.comment-admin,.comment-superuser{background:#f0fdf4;border-left:3px solid #22c55e}
      .comment-meta{font-size:.8125rem;margin-bottom:.35rem;display:flex;align-items:center;gap:.5rem;flex-wrap:wrap}
      .comment-form{display:flex;gap:.75rem;margin-top:1rem;align-items:flex-start}
      .muted-text{color:var(--muted);font-size:.9rem}
    </style>
    <script>
    let editField = '';
    const enrolmentId = '${escapeHtml(tracker?.enrolment_id ?? "")}'; 
    const fieldMap = { purpose: ['tailored_purpose','Tailored Learning Purpose'], goals: ['smart_goals','SMART Goals'], outcomes: ['tailored_outcomes','Tailored Learning Outcomes'], clos: ['course_learning_objectives','Course Learning Objectives'] };
    const currentValues = ${JSON.stringify({ tailored_purpose: tracker?.tailored_purpose ?? "", smart_goals: tracker?.smart_goals ?? "", tailored_outcomes: tracker?.tailored_outcomes ?? "", course_learning_objectives: tracker?.course_learning_objectives ?? "" })};
    function openStudentEdit(field) {
      editField = field;
      const [key, title] = fieldMap[field];
      document.getElementById('editModalTitle').textContent = 'Edit: ' + title;
      document.getElementById('editModalValue').value = currentValues[key] || '';
      document.getElementById('studentEditModal').style.display = 'flex';
    }
    function closeStudentEdit() { document.getElementById('studentEditModal').style.display = 'none'; }
    async function saveStudentEdit() {
      const [key] = fieldMap[editField];
      const value = document.getElementById('editModalValue').value.trim();
      const payload = { enrolment_id: enrolmentId };
      payload[key] = value;
      const r = await fetch('/api/tracker/record', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
      const d = await r.json();
      if (d.success) { closeStudentEdit(); location.reload(); }
      else alert('Error: ' + (d.error || 'Unknown'));
    }
    async function postComment(entityId, entityType) {
      const comment = document.getElementById('newComment').value.trim();
      if (!comment) return;
      const r = await fetch('/api/assessment/comments/' + encodeURIComponent(entityId), {
        method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ comment, entity_type: entityType })
      });
      const d = await r.json();
      if (d.success) location.reload();
      else alert('Error: ' + (d.error || 'Unknown'));
    }
    </script>
  `);
}

function renderStaffTrackerPage(identity: Identity, enrolments: StudentEnrolment[], trackers: StudentTracker[], courseInstanceId: string, selectedEnrolment: StudentEnrolment | null, tracker: StudentTracker | null, comments: AssessmentComment[], allCourses: {course_instance_id: string, course_title: string}[]): string {
  const rosterHtml = enrolments.map(en => {
    const isSelected = selectedEnrolment?.id === en.id;
    return `<a href="/tracker?courseId=${encodeURIComponent(courseInstanceId)}&enrolId=${encodeURIComponent(en.id)}" class="roster-item ${isSelected ? "roster-item--active" : ""}">
      <span class="roster-avatar">${escapeHtml((en.student_label || "?").charAt(0))}</span>
      <span class="roster-name">${escapeHtml(en.student_label)}</span>
      <span class="roster-id">${escapeHtml(en.learner_id)}</span>
    </a>`;
  }).join("");

  const ragSelector = (field: string, current: string | null) => `
    <div class="rag-selector" data-field="${field}">
      <button class="rag-btn ${current === 'green' ? 'rag-btn--active-green' : ""}" onclick="setRag('${field}','green')">🟢 On Track</button>
      <button class="rag-btn ${current === 'amber' ? 'rag-btn--active-amber' : ""}" onclick="setRag('${field}','amber')">🟡 Working Towards</button>
      <button class="rag-btn ${current === 'red' ? 'rag-btn--active-red' : ""}" onclick="setRag('${field}','red')">🔴 Behind Target</button>
    </div>`;

  const detailHtml = !tracker || !selectedEnrolment ? "<p class='muted-text' style='padding:2rem'>Select a student from the roster to view their tracker.</p>" : `
    <div class="tracker-detail">
      <div class="tracker-detail-header">
        <h2>${escapeHtml(selectedEnrolment.student_label)}</h2>
        <span class="meta-chip">${escapeHtml(selectedEnrolment.course_title)}</span>
        <span class="meta-chip">${escapeHtml(selectedEnrolment.learner_id)}</span>
      </div>

      <!-- Student Goals (Read-only for staff) -->
      <div class="tracker-section">
        <h3>🎯 Tailored Learning Purpose</h3>
        <p>${tracker.tailored_purpose ? escapeHtml(tracker.tailored_purpose) : "<em class='muted-text'>Not filled in by student yet.</em>"}</p>
      </div>
      <div class="tracker-section">
        <h3>📋 SMART Goals</h3>
        <pre style="white-space:pre-wrap;font-family:inherit;margin:0">${tracker.smart_goals ? escapeHtml(tracker.smart_goals) : "<em class='muted-text'>Not filled in by student yet.</em>"}</pre>
      </div>
      <div class="tracker-section">
        <h3>✨ Tailored Learning Outcomes</h3>
        <p>${tracker.tailored_outcomes ? escapeHtml(tracker.tailored_outcomes) : "<em class='muted-text'>Not filled in by student yet.</em>"}</p>
      </div>

      <!-- Initial Assessment -->
      <div class="tracker-section">
        <h3>🔍 Initial Assessment & Diagnostic</h3>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Assessment Level</label>
            <input class="form-input" id="f-ia-level" value="${escapeHtml(tracker.initial_assessment_level ?? "")}" placeholder="e.g. Entry 1.2">
          </div>
          <div class="form-group">
            <label class="form-label">Date</label>
            <input class="form-input" id="f-ia-date" type="date" value="${escapeHtml(tracker.initial_assessment_date ?? "")}">
          </div>
        </div>
        ${ragSelector("initial_assessment_rag", tracker.initial_assessment_rag)}
        <div class="form-group" style="margin-top:.75rem">
          <label class="form-label">Diagnostic Notes</label>
          <textarea class="form-input" id="f-ia-notes" rows="3">${escapeHtml(tracker.initial_assessment_notes ?? "")}</textarea>
        </div>
      </div>

      <!-- Term Reviews -->
      ${[1, 2, 3].map(n => `
      <div class="tracker-section">
        <h3>📊 Term ${n} Review</h3>
        <p class="form-hint">Select a RAG status — the date is recorded automatically when you save.</p>
                ${ragSelector("term" + n + "_rag", (tracker as any)["term" + n + "_rag"])}
        <div class="form-group" style="margin-top:.75rem">
          <label class="form-label">Feedback Comments</label>
          <textarea class="form-input" id="f-t${n}-comments" rows="3">${escapeHtml((tracker as any)["term" + n + "_comments"] ?? "")}</textarea>
        </div>
      </div>
      `).join("")}

      <!-- Destination -->
      <div class="tracker-section">
        <h3>🚀 Destination & Progression</h3>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Destination</label>
            <select class="form-input" id="f-dest-type">
              <option value="">Select…</option>
              ${["Employment", "Next Level ESOL", "Further Education", "Volunteering", "Digital Skills", "Other"].map(o => `<option value="${o}" ${tracker.destination_type === o ? "selected" : ""}>${o}</option>`).join("")}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Date</label>
            <input class="form-input" id="f-dest-date" type="date" value="${escapeHtml(tracker.destination_date ?? "")}">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Notes</label>
          <textarea class="form-input" id="f-dest-notes" rows="2">${escapeHtml(tracker.destination_notes ?? "")}</textarea>
        </div>
      </div>

      <div style="padding:1rem 0;text-align:right">
        <button class="btn btn-primary" onclick="saveTrackerRecord()">💾 Save All Changes</button>
      </div>

      <!-- Comments Thread -->
      <div class="tracker-section">
        <h3>💬 Discussion Thread</h3>
        <div class="comments-list">
          ${comments.map(c => `
          <div class="comment-row comment-${escapeHtml(c.author_role)}">
            <div class="comment-meta"><strong>${escapeHtml(c.author_name)}</strong> <span class="meta-chip">${escapeHtml(c.author_role)}</span> <span class="muted-text">${escapeHtml(c.created_at.slice(0,10))}</span></div>
            <p>${escapeHtml(c.comment)}</p>
          </div>`).join("") || "<p class='muted-text'>No comments yet.</p>"}
        </div>
        <div class="comment-form">
          <textarea class="form-input" id="newComment" rows="2" placeholder="Add a comment…"></textarea>
          <button class="btn btn-primary" onclick="postComment('${escapeHtml(selectedEnrolment?.id ?? "")}','tracker')">Post</button>
        </div>
      </div>
    </div>`;


  // Build Bulk View Table
  const bulkCols = [
    { key: 'initial_assessment_rag', label: 'Induction' },
    { key: 'term1_rag', label: 'Term 1' },
    { key: 'term2_rag', label: 'Term 2' },
    { key: 'term3_rag', label: 'Term 3' },
  ];
  const trackerMap = new Map(trackers.map(t => [t.enrolment_id, t]));
  const bulkRowsHtml = enrolments.map(en => {
    const t = trackerMap.get(en.id);
    const cells = bulkCols.map(col => {
      const val = t ? (t)[col.key] : null;
      const dateKey = col.key.replace('_rag','_date');
      const dateVal = t ? (t)[dateKey] : null;
      return `<td class="bulk-rag-cell" data-enrol="${escapeHtml(en.id)}" data-field="${col.key}">
          <div class="bulk-rag-btns">
            <button class="bulk-rag-btn ${val==='green'?'bulk-active-green':''}" onclick="setBulkRag('${escapeHtml(en.id)}','${col.key}','green',this)">🟢</button>
            <button class="bulk-rag-btn ${val==='amber'?'bulk-active-amber':''}" onclick="setBulkRag('${escapeHtml(en.id)}','${col.key}','amber',this)">🟡</button>
            <button class="bulk-rag-btn ${val==='red'?'bulk-active-red':''}" onclick="setBulkRag('${escapeHtml(en.id)}','${col.key}','red',this)">🔴</button>
            <button class="bulk-rag-btn ${val==='na'?'bulk-active-na':''}" onclick="setBulkRag('${escapeHtml(en.id)}','${col.key}','na',this)">⚪</button>
          </div>
          ${dateVal ? `<div class="bulk-date">${escapeHtml(dateVal)}</div>` : ''}
        </td>`;
    }).join('');
    return `<tr>
      <td class="bulk-name-cell"><a href="/tracker?courseId=${encodeURIComponent(courseInstanceId)}&enrolId=${encodeURIComponent(en.id)}" class="bulk-student-link">${escapeHtml(en.student_label)}</a><br><span class="bulk-id">${escapeHtml(en.learner_id)}</span></td>
      ${cells}
    </tr>`;
  }).join('');

  const bulkColHeaders = bulkCols.map(col => `<th class="bulk-col-th">
                <div class="bulk-col-title">${col.label}</div>
                <div class="bulk-apply-btns" style="display:grid;grid-template-columns:1fr 1fr;gap:0.3rem;margin-top:0.25rem;">
                  <button class="bulk-apply-btn bulk-apply-green" onclick="applyColToAll('${col.key}','green')">🟢 All Green</button>
                  <button class="bulk-apply-btn bulk-apply-amber" onclick="applyColToAll('${col.key}','amber')">🟡 All Amber</button>
                  <button class="bulk-apply-btn bulk-apply-red" onclick="applyColToAll('${col.key}','red')">🔴 All Red</button>
                  <button class="bulk-apply-btn bulk-apply-na" onclick="applyColToAll('${col.key}','na')">⚪ N/A</button>
                </div>
              </th>`).join('');

  const bulkViewHtml = enrolments.length === 0 ? '' : `
    <div id="bulkView" style="display:none">
      <div class="bulk-toolbar">
        <span class="bulk-toolbar-title">📋 Bulk Class View — click column buttons to set all students at once</span>
        <button class="btn btn-primary" onclick="saveBulkChanges()">💾 Save Bulk Changes</button>
      </div>
      <div class="bulk-table-wrapper">
        <table class="bulk-table">
          <thead>
            <tr>
              <th class="bulk-name-th">Student</th>
              ${bulkColHeaders}
            </tr>
          </thead>
          <tbody>${bulkRowsHtml}</tbody>
        </table>
      </div>
    </div>`;

  return pageShell("Progress Tracker", `
    <main class="dashboard-shell">
      ${renderSidebar(identity, "tracker")}
      <div class="content">
        ${renderTopbar(identity, "Progress Tracker")}
        <section class="page-section">
          <div class="tracker-toolbar" style="display:flex;justify-content:space-between;width:100%;">
            <div style="display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;">
              <form method="GET" action="/tracker" class="assess-search-form" style="display:flex;align-items:center;gap:0.75rem;margin:0;">
                <input class="form-input" name="courseId" placeholder="New Course ID…" style="width:140px;">
                <button class="btn" type="submit" style="background:var(--primary);color:#fff;width:120px;text-align:center;">Search</button>
              </form>
              ${courseInstanceId ? `<button class="btn" type="button" onclick="syncCourse()" style="background:#000;color:#fff;width:120px;text-align:center;">Sync Class</button>` : ""}
            </div>
            <div style="display:flex;align-items:center;gap:1.5rem;flex-wrap:wrap;">
              <form method="GET" action="/tracker" class="assess-search-form" style="display:flex;align-items:center;gap:0.75rem;margin:0;">
                <label style="font-weight:600;white-space:nowrap;">My classes</label>
                <select class="form-input" name="courseId" onchange="this.form.submit()" style="width:400px; max-width: 100%;">
                  <option value="">-- Select a class --</option>
                  ${allCourses.map(c => `<option value="${escapeHtml(c.course_instance_id)}" ${c.course_instance_id === courseInstanceId ? "selected" : ""}>${escapeHtml(c.course_title)} (${escapeHtml(c.course_instance_id)})</option>`).join("")}
                </select>
              </form>
              ${enrolments.length > 0 ? `<button class="btn btn-toggle" id="bulkToggle" onclick="toggleBulkView()">📋 Bulk Class View</button>` : ""}
            </div>
          </div>
          ${bulkViewHtml}
          <div id="individualView">
            <div class="tracker-layout">
              ${enrolments.length > 0 ? `
              <div class="tracker-roster">
                <div class="roster-header">Students (${enrolments.length})</div>
                ${rosterHtml}
              </div>` : ""}
              <div class="tracker-main">${detailHtml}</div>
            </div>
          </div></section>
      </div>
    </main>

    <style>
      .tracker-toolbar{display:flex;align-items:center;gap:1rem;padding:1rem 1.5rem;background:#f8fafc;border-bottom:1px solid #e2e8f0;flex-wrap:wrap}
      .tracker-layout{display:flex;min-height:calc(100vh - 130px)}
      .tracker-roster{width:240px;flex-shrink:0;border-right:1px solid #e2e8f0;overflow-y:auto}
      .roster-header{padding:.65rem 1rem;font-size:.8125rem;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid #e2e8f0;background:#f8fafc}
      .roster-item{display:flex;align-items:center;gap:.75rem;padding:.7rem 1rem;border-bottom:1px solid #f1f5f9;text-decoration:none;color:var(--text);transition:background .1s}
      .roster-item:hover{background:#f8fafc}
      .roster-item--active{background:#fdf2f8;border-left:3px solid #e91e8c}
      .roster-avatar{width:32px;height:32px;border-radius:50%;background:var(--primary);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.875rem;flex-shrink:0}
      .roster-name{flex:1;font-size:.875rem;font-weight:600}
      .roster-id{font-size:.75rem;color:var(--muted)}
      .tracker-main{flex:1;overflow-y:auto}
      .tracker-detail{padding:1.5rem;max-width:860px}
      .tracker-detail-header{display:flex;align-items:center;gap:.75rem;margin-bottom:1.5rem;flex-wrap:wrap}
      .tracker-detail-header h2{margin:0;font-size:1.375rem;font-weight:800}
      .tracker-section{background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:1.25rem;margin-bottom:1.25rem}
      .tracker-section h3{margin:0 0 .5rem;font-size:1rem;font-weight:700}
      .form-hint{color:var(--muted);font-size:.8125rem;margin:0 0 .75rem}
      .rag-date-display{color:#4f46e5;font-size:.8125rem;margin:.4rem 0 0;font-weight:500}
      .rag-selector{display:flex;gap:.5rem;flex-wrap:wrap;margin:.5rem 0}
      .rag-btn{flex:1;white-space:nowrap;padding:.45rem 1rem;border-radius:20px;border:2px solid transparent;background:#f1f5f9;color:var(--text);cursor:pointer;font-size:.875rem;font-weight:600;transition:all .15s}
      .rag-btn:hover{background:var(--primary);color:#fff;border-color:var(--primary);transform:scale(1.03)}
      .rag-btn--active-green{background:#dcfce7;border-color:#22c55e;color:#166534}
      .rag-btn--active-amber{background:#fffbeb;border-color:#f59e0b;color:#92400e}
      .rag-btn--active-red{background:#fee2e2;border-color:#ef4444;color:#991b1b}
      .rag-btn--active-na{background:#e2e8f0;border-color:#94a3b8;color:#475569}
      .comment-row{padding:.75rem 1rem;border-radius:10px;margin-bottom:.75rem}
      .comment-student{background:#eff6ff;border-left:3px solid #3b82f6}
      .comment-teacher,.comment-assessor,.comment-admin,.comment-superuser{background:#f0fdf4;border-left:3px solid #22c55e}
      .comment-meta{font-size:.8125rem;margin-bottom:.35rem;display:flex;align-items:center;gap:.5rem;flex-wrap:wrap}
      .comment-form{display:flex;gap:.75rem;margin-top:1rem;align-items:flex-start}
      .assess-search-form{display:flex;gap:.5rem;flex:1;min-width:280px}
      .btn-toggle{background:#6366f1;color:#fff;border:none;padding:.55rem 1.1rem;border-radius:8px;font-weight:700;cursor:pointer;font-size:.875rem;transition:all .2s}
      .btn-toggle:hover{background:#4f46e5}
      .btn-toggle.active{background:#4f46e5;box-shadow:0 0 0 3px rgba(99,102,241,.3)}
      /* Bulk View */
      .bulk-toolbar{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:.75rem 1.5rem;background:#eef2ff;border-bottom:1px solid #c7d2fe;flex-wrap:wrap}
      .bulk-toolbar-title{font-size:.875rem;font-weight:600;color:#3730a3}
      .bulk-table-wrapper{overflow-x:auto;padding:1rem 1.5rem}
      .bulk-table{width:100%;border-collapse:collapse;font-size:.875rem}
      .bulk-table th,.bulk-table td{border:1px solid #e2e8f0;padding:.5rem .75rem;vertical-align:middle}
      .bulk-table thead th{background:#f8fafc;font-weight:700;text-align:center}
      .bulk-name-th{text-align:left;min-width:160px}
      .bulk-col-th{min-width:180px}
      .bulk-col-title{font-size:.75rem;margin-bottom:.4rem;color:var(--muted);text-transform:uppercase;letter-spacing:.04em;font-weight:700}
      .bulk-apply-btns{display:flex;gap:.3rem;justify-content:center;flex-wrap:wrap;margin-top:.25rem}
      .bulk-apply-btn{padding:.3rem .6rem;border:none;border-radius:8px;cursor:pointer;font-size:.75rem;font-weight:700;transition:all .15s}
      .bulk-apply-btn:hover{transform:scale(1.08)}
      .bulk-apply-green{background:#dcfce7;color:#166534}
      .bulk-apply-amber{background:#fffbeb;color:#92400e}
      .bulk-apply-red{background:#fee2e2;color:#991b1b}
      .bulk-apply-na{background:#f1f5f9;color:#475569}
      .bulk-name-cell{font-weight:600;min-width:160px}
      .bulk-student-link{color:var(--primary);text-decoration:none;font-weight:600}
      .bulk-student-link:hover{text-decoration:underline}
      .bulk-id{font-size:.75rem;color:var(--muted);font-weight:400}
      .bulk-rag-cell{text-align:center}
      .bulk-rag-btns{display:flex;gap:.35rem;justify-content:center}
      .bulk-rag-btn{width:2.2rem;height:2.2rem;border:2px solid #e2e8f0;border-radius:50%;background:#fff;cursor:pointer;font-size:1.1rem;display:flex;align-items:center;justify-content:center;transition:all .15s;padding:0;line-height:1}
      .bulk-rag-btn:hover{border-color:#6366f1;transform:scale(1.2)}
      .bulk-active-green{border-color:#22c55e;background:#dcfce7}
      .bulk-active-amber{border-color:#f59e0b;background:#fffbeb}
      .bulk-active-red{border-color:#ef4444;background:#fee2e2}
      .bulk-active-na{border-color:#94a3b8;background:#f1f5f9}
      .bulk-date{font-size:.7rem;color:var(--muted);margin-top:.25rem}
    </style>
    <script>
    // --- Individual View ---
    const ragState = {};
    const todayStr = new Date().toISOString().slice(0, 10);
    function setRag(field, value) {
      ragState[field] = value;
      const sel = document.querySelector('[data-field="'+field+'"]');
      if (!sel) return;
      sel.querySelectorAll('.rag-btn').forEach(btn => {
        btn.className = 'rag-btn';
        const t = btn.textContent.toLowerCase();
        if ((value === 'green' && t.includes('on track')) ||
            (value === 'amber' && t.includes('working')) ||
            (value === 'red' && t.includes('behind'))) {
          btn.className = 'rag-btn rag-btn--active-' + value;
        }
      });
      const parent = sel.closest('.tracker-section');
      if (parent) {
        let dateEl = parent.querySelector('.rag-date-display');
        if (!dateEl) {
          dateEl = document.createElement('p');
          dateEl.className = 'rag-date-display';
          sel.insertAdjacentElement('afterend', dateEl);
        }
        dateEl.innerHTML = 'Will be saved as: <strong>' + todayStr + '</strong>';
      }
    }
    async function saveTrackerRecord() {
      const enrolId = '${escapeHtml(selectedEnrolment?.id ?? "")}';
      if (!enrolId) { alert('No student selected'); return; }
      const payload = {
        enrolment_id: enrolId,
        initial_assessment_level: document.getElementById('f-ia-level')?.value?.trim() || null,
        initial_assessment_date: ragState['initial_assessment_rag'] ? todayStr : ('${escapeHtml(tracker?.initial_assessment_date ?? "")}' || null),
        initial_assessment_notes: document.getElementById('f-ia-notes')?.value?.trim() || null,
        initial_assessment_rag: ragState['initial_assessment_rag'] || '${escapeHtml(tracker?.initial_assessment_rag ?? "")}' || null,
        term1_comments: document.getElementById('f-t1-comments')?.value?.trim() || null,
        term1_rag: ragState['term1_rag'] || '${escapeHtml((tracker as any)?.term1_rag ?? "")}' || null,
        term1_date: ragState['term1_rag'] ? todayStr : ('${escapeHtml((tracker as any)?.term1_date ?? "")}' || null),
        term2_comments: document.getElementById('f-t2-comments')?.value?.trim() || null,
        term2_rag: ragState['term2_rag'] || '${escapeHtml((tracker as any)?.term2_rag ?? "")}' || null,
        term2_date: ragState['term2_rag'] ? todayStr : ('${escapeHtml((tracker as any)?.term2_date ?? "")}' || null),
        term3_comments: document.getElementById('f-t3-comments')?.value?.trim() || null,
        term3_rag: ragState['term3_rag'] || '${escapeHtml((tracker as any)?.term3_rag ?? "")}' || null,
        term3_date: ragState['term3_rag'] ? todayStr : ('${escapeHtml((tracker as any)?.term3_date ?? "")}' || null),
        clos_achieved_rag: ragState['clos_achieved_rag'] || '${escapeHtml((tracker as any)?.clos_achieved_rag ?? "")}' || null,
        destination_type: document.getElementById('f-dest-type')?.value || null,
        destination_date: document.getElementById('f-dest-date')?.value || null,
        destination_notes: document.getElementById('f-dest-notes')?.value?.trim() || null
      };
      const r = await fetch('/api/tracker/record', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
      const d = await r.json();
      if (d.success) { location.reload(); }
      else alert('Error saving: ' + (d.error || 'Unknown error'));
    }
    // --- Bulk View ---
    const bulkChanges = {};
    function setBulkRag(enrolId, field, value, btn) {
      const key = enrolId + ':' + field;
      bulkChanges[key] = value;
      const cell = btn.closest('.bulk-rag-cell');
      cell.querySelectorAll('.bulk-rag-btn').forEach(b => { b.className = 'bulk-rag-btn'; });
      btn.className = 'bulk-rag-btn bulk-active-' + value;
    }
    function applyColToAll(field, value) {
      document.querySelectorAll('.bulk-rag-cell[data-field="'+field+'"]').forEach(cell => {
        const enrolId = cell.getAttribute('data-enrol');
        const key = enrolId + ':' + field;
        bulkChanges[key] = value;
        cell.querySelectorAll('.bulk-rag-btn').forEach(b => { b.className = 'bulk-rag-btn'; });
        const emoji = value === 'green' ? '🟢' : value === 'amber' ? '🟡' : value === 'red' ? '🔴' : '⚪';
        const targetBtn = [...cell.querySelectorAll('.bulk-rag-btn')].find(b => b.textContent.trim() === emoji);
        if (targetBtn) targetBtn.className = 'bulk-rag-btn bulk-active-' + value;
      });
    }
    async function saveBulkChanges() {
      const updates = Object.entries(bulkChanges).map(([key, value]) => {
        const parts = key.split(':');
        return { enrolment_id: parts[0], field: parts[1], value: value };
      });
      if (updates.length === 0) { alert('No changes to save.'); return; }
      const r = await fetch('/api/tracker/batch', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ updates }) });
      const d = await r.json();
      if (d.success) { location.reload(); }
      else alert('Error saving bulk changes: ' + (d.error || 'Unknown error'));
    }
    function toggleBulkView() {
      const bulk = document.getElementById('bulkView');
      const indiv = document.getElementById('individualView');
      const btn = document.getElementById('bulkToggle');
      const isShowing = bulk && bulk.style.display !== 'none';
      if (bulk) bulk.style.display = isShowing ? 'none' : 'block';
      if (indiv) indiv.style.display = isShowing ? 'block' : 'none';
      if (btn) {
        btn.classList.toggle('active', !isShowing);
        btn.textContent = isShowing ? '📋 Bulk Class View' : '👤 Individual View';
      }
    }

      
    async function postComment(entityId, entityType) {
      const comment = document.getElementById('newComment').value.trim();
      if (!comment) return;
      const r = await fetch('/api/assessment/comments/' + encodeURIComponent(entityId), {
        method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ comment, entity_type: entityType })
      });
      const d = await r.json();
      if (d.success) location.reload();
      else alert('Error: ' + (d.error || 'Unknown'));
    }
    async function syncCourse() {
      const courseId = new URLSearchParams(location.search).get('courseId');
      if (!courseId) return;
      const r = await fetch('/api/assessment/sync', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ courseInstanceId: courseId }) });
      const d = await r.json();
      alert(d.error ? 'Error: ' + d.error : 'Synced ' + d.upserted + ' student(s)');
      if (!d.error) location.reload();
    }
    function openTrackerTemplateBuilder() { alert('Tracker template builder — coming soon as part of the unified builder.'); }
    </script>
  `);
}



