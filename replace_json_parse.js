const fs = require('fs');
let code = fs.readFileSync('src/index.ts', 'utf8');

const safeJsonDef = `
function safeJsonParse<T>(data: any, fallback: T): T {
  if (typeof data !== 'string' || !data.trim()) return fallback;
  try {
    const parsed = JSON.parse(data);
    return (parsed !== null && typeof parsed !== 'undefined') ? parsed : fallback;
  } catch (e) {
    return fallback;
  }
}
`;
code = code.replace('function parseData(data: string | null): Record<string, string> { try { return data ? JSON.parse(data) as Record<string, string> : {}; } catch { return {}; } }', 
  'function parseData(data: string | null): Record<string, string> { try { return data ? JSON.parse(data) as Record<string, string> : {}; } catch { return {}; } }\n' + safeJsonDef);

code = code.replace(/JSON\.parse\(row\.course_learning_objectives\s*\|\|\s*"\[\]"\)/g, 'safeJsonParse<any[]>(row.course_learning_objectives, [])');
code = code.replace(/JSON\.parse\(row\.smart_goals\s*\|\|\s*"\[\]"\)/g, 'safeJsonParse<any[]>(row.smart_goals, [])');
code = code.replace(/JSON\.parse\(tracker\.course_learning_objectives\s*\|\|\s*"\[\]"\)/g, 'safeJsonParse<any[]>(tracker.course_learning_objectives, [])');
code = code.replace(/JSON\.parse\(tracker\.smart_goals\s*\|\|\s*"\[\]"\)/g, 'safeJsonParse<any[]>(tracker.smart_goals, [])');
code = code.replace(/JSON\.parse\(tracker\?\.course_learning_objectives\s*\|\|\s*"\[\]"\)/g, 'safeJsonParse<any[]>(tracker?.course_learning_objectives, [])');
code = code.replace(/JSON\.parse\(tracker\?\.smart_goals\s*\|\|\s*"\[\]"\)/g, 'safeJsonParse<any[]>(tracker?.smart_goals, [])');
code = code.replace(/JSON\.parse\(tracker\?\.learner_profile_json\s*\|\|\s*"\{\}"\)/g, 'safeJsonParse<Record<string,string>>(tracker?.learner_profile_json, {})');
code = code.replace(/JSON\.parse\(tracker\?\.course_feedback_json\s*\|\|\s*"\{\}"\)/g, 'safeJsonParse<Record<string,string>>(tracker?.course_feedback_json, {})');
code = code.replace(/JSON\.parse\(tracker\.learner_profile_json\s*\|\|\s*"\{\}"\)/g, 'safeJsonParse<Record<string,string>>(tracker.learner_profile_json, {})');
code = code.replace(/JSON\.parse\(tracker\.course_feedback_json\s*\|\|\s*"\{\}"\)/g, 'safeJsonParse<Record<string,string>>(tracker.course_feedback_json, {})');
code = code.replace(/JSON\.parse\(tracker\.course_learning_objectives\)/g, 'safeJsonParse<any[]>(tracker.course_learning_objectives, [])');
code = code.replace(/JSON\.parse\(jsonStr\)/g, 'safeJsonParse<any[]>(jsonStr, [])');
code = code.replace(/q\.options \? JSON\.parse\(q\.options\) as QuestionOption\[\] : null/g, 'safeJsonParse<QuestionOption[]>(q.options, [])');
code = code.replace(/typeof q\.options === 'string' \? JSON\.parse\(q\.options\) : q\.options/g, 'typeof q.options === "string" ? safeJsonParse(q.options, []) : q.options');
code = code.replace(/JSON\.parse\(entry\.answers_json as string \|\| "\{\}"\)/g, 'safeJsonParse<Record<string,string>>(entry.answers_json, {})');
code = code.replace(/JSON\.parse\(entry\.answers_json as string\)/g, 'safeJsonParse<Record<string,string>>(entry.answers_json, {})');
code = code.replace(/JSON\.parse\(roleRecord\.functionalities\)/g, 'safeJsonParse<string[]>(roleRecord.functionalities, [])');

// Add the other occurrences found in localStorage etc.
code = code.replace(/JSON\.parse\(localStorage\.getItem\("qc_custom_colors"\) \|\| "\[\]"\)/g, 'safeJsonParse<string[]>(localStorage.getItem("qc_custom_colors"), [])');
code = code.replace(/JSON\.parse\(\(q\.options as string\)\)/g, 'safeJsonParse<any[]>(q.options, [])');
code = code.replace(/JSON\.parse\(ticketsEl\.getAttribute\('data-tickets'\) \|\| '\[\]'\)/g, 'safeJsonParse<any[]>(ticketsEl.getAttribute("data-tickets"), [])');

fs.writeFileSync('src/index.ts', code);
console.log("Replacements complete.");
