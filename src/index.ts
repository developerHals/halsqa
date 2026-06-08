interface Env {
  esol_marking_db: {
    prepare(query: string): {
      bind(...values: unknown[]): {
        first<T>(): Promise<T | null>;
      };
    };
  };
  MICROSOFT_CLIENT_ID?: string;
  MICROSOFT_CLIENT_SECRET?: string;
  MICROSOFT_TENANT_ID?: string;
  SESSION_SECRET?: string;
}

type UserRecord = {
  id: string;
  email: string;
  role: string;
  stage: string | null;
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

const htmlHeaders = {
  "content-type": "text/html; charset=utf-8",
};

const jsonHeaders = {
  "content-type": "application/json; charset=utf-8",
};

const oauthStateCookie = "esolqa_oauth_state";
const sessionCookie = "esolqa_session";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/") {
      return Response.redirect(`${url.origin}/dashboard`, 302);
    }

    if (url.pathname === "/login") {
      return htmlResponse(renderLoginPage());
    }

    if (url.pathname === "/auth/microsoft/start") {
      return startMicrosoftLogin(request, env);
    }

    if (url.pathname === "/auth/microsoft/callback") {
      return handleMicrosoftCallback(request, env);
    }

    if (url.pathname === "/logout") {
      return logout(url);
    }

    if (url.pathname === "/dashboard") {
      const identity = await requireIdentity(request, env);

      if (!identity) {
        return Response.redirect(`${url.origin}/login`, 302);
      }

      return htmlResponse(renderDashboardPage(identity));
    }

    if (url.pathname === "/api/me") {
      const identity = await requireIdentity(request, env);

      if (!identity) {
        return new Response(JSON.stringify({ error: "Not authenticated" }), {
          status: 401,
          headers: jsonHeaders,
        });
      }

      return new Response(JSON.stringify(identity), { headers: jsonHeaders });
    }

    return htmlResponse(renderNotFoundPage(), 404);
  },
};

async function requireIdentity(request: Request, env: Env): Promise<Identity | null> {
  const session = getCookie(request, sessionCookie);
  const payload = session ? await verifySession(session, env) : null;

  if (!payload) {
    return null;
  }

  return getIdentity(payload.email, payload.name, env);
}

async function getIdentity(email: string, name: string | null, env: Env): Promise<Identity> {
  const user = await env.esol_marking_db
    .prepare("SELECT id, email, role, stage FROM users WHERE lower(email) = lower(?) LIMIT 1")
    .bind(email)
    .first<UserRecord>();

  return {
    email,
    name,
    user,
    isKnownUser: Boolean(user),
  };
}

async function startMicrosoftLogin(request: Request, env: Env): Promise<Response> {
  const config = getMicrosoftConfig(env);

  if (!config) {
    return htmlResponse(renderConfigMissingPage(), 500);
  }

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

  return new Response(null, {
    status: 302,
    headers: {
      location: authorizeUrl.toString(),
      "set-cookie": serializeCookie(oauthStateCookie, state, 600),
    },
  });
}

async function handleMicrosoftCallback(request: Request, env: Env): Promise<Response> {
  const config = getMicrosoftConfig(env);
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const savedState = getCookie(request, oauthStateCookie);

  if (!config) {
    return htmlResponse(renderConfigMissingPage(), 500);
  }

  if (!code || !state || !savedState || state !== savedState) {
    return htmlResponse(renderAuthErrorPage("Microsoft sign-in could not be verified."), 400);
  }

  const redirectUri = `${url.origin}/auth/microsoft/callback`;
  const tokenResponse = await fetch(`https://login.microsoftonline.com/${config.tenantId}/oauth2/v2.0/token`, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenResponse.ok) {
    return htmlResponse(renderAuthErrorPage("Microsoft rejected the sign-in request."), 401);
  }

  const tokenData = await tokenResponse.json() as { access_token?: string };

  if (!tokenData.access_token) {
    return htmlResponse(renderAuthErrorPage("Microsoft did not return an access token."), 401);
  }

  const profileResponse = await fetch("https://graph.microsoft.com/v1.0/me?$select=displayName,mail,userPrincipalName", {
    headers: {
      authorization: `Bearer ${tokenData.access_token}`,
    },
  });

  if (!profileResponse.ok) {
    return htmlResponse(renderAuthErrorPage("Could not load your Microsoft profile."), 401);
  }

  const profile = await profileResponse.json() as MicrosoftUser;
  const email = profile.mail ?? profile.userPrincipalName;

  if (!email) {
    return htmlResponse(renderAuthErrorPage("Your Microsoft account did not provide an email address."), 401);
  }

  const session = await createSession({ email, name: profile.displayName ?? null }, env);

  return new Response(null, {
    status: 302,
    headers: {
      location: `${url.origin}/dashboard`,
      "set-cookie": [
        serializeCookie(sessionCookie, session, 60 * 60 * 8),
        clearCookie(oauthStateCookie),
      ].join(", "),
    },
  });
}

function logout(url: URL): Response {
  return new Response(null, {
    status: 302,
    headers: {
      location: `${url.origin}/login`,
      "set-cookie": clearCookie(sessionCookie),
    },
  });
}

function getMicrosoftConfig(env: Env) {
  if (!env.MICROSOFT_CLIENT_ID || !env.MICROSOFT_CLIENT_SECRET || !env.MICROSOFT_TENANT_ID || !env.SESSION_SECRET) {
    return null;
  }

  return {
    clientId: env.MICROSOFT_CLIENT_ID,
    clientSecret: env.MICROSOFT_CLIENT_SECRET,
    tenantId: env.MICROSOFT_TENANT_ID,
    sessionSecret: env.SESSION_SECRET,
  };
}

async function createSession(payload: { email: string; name: string | null }, env: Env): Promise<string> {
  const expiresAt = Date.now() + 1000 * 60 * 60 * 8;
  const body = base64UrlEncode(JSON.stringify({ ...payload, expiresAt }));
  const signature = await sign(body, env);

  return `${body}.${signature}`;
}

async function verifySession(session: string, env: Env): Promise<{ email: string; name: string | null } | null> {
  const [body, signature] = session.split(".");

  if (!body || !signature) {
    return null;
  }

  const expectedSignature = await sign(body, env);

  if (signature !== expectedSignature) {
    return null;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(body)) as { email?: string; name?: string | null; expiresAt?: number };

    if (!payload.email || !payload.expiresAt || payload.expiresAt < Date.now()) {
      return null;
    }

    return {
      email: payload.email,
      name: payload.name ?? null,
    };
  } catch {
    return null;
  }
}

async function sign(value: string, env: Env): Promise<string> {
  const secret = env.SESSION_SECRET ?? "local-development-session-secret";
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));

  return base64UrlEncodeBytes(new Uint8Array(signature));
}

function getCookie(request: Request, name: string): string | null {
  const cookieHeader = request.headers.get("cookie");

  if (!cookieHeader) {
    return null;
  }

  const cookies = cookieHeader.split(";").map((cookie) => cookie.trim());
  const match = cookies.find((cookie) => cookie.startsWith(`${name}=`));

  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
}

function serializeCookie(name: string, value: string, maxAge: number): string {
  return `${name}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; HttpOnly; Secure; SameSite=Lax`;
}

function clearCookie(name: string): string {
  return `${name}=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Lax`;
}

function base64UrlEncode(value: string): string {
  return base64UrlEncodeBytes(new TextEncoder().encode(value));
}

function base64UrlEncodeBytes(bytes: Uint8Array): string {
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function base64UrlDecode(value: string): string {
  const base64 = value.replaceAll("-", "+").replaceAll("_", "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));

  return new TextDecoder().decode(bytes);
}

function htmlResponse(body: string, status = 200) {
  return new Response(body, {
    status,
    headers: htmlHeaders,
  });
}

function renderLoginPage() {
  return pageShell("Sign in", `
    <main class="auth-shell">
      <section class="auth-card">
        <div class="brand-mark">E</div>
        <p class="eyebrow">ESOLQA</p>
        <h1>Sign in to continue</h1>
        <p class="lede">Use your Microsoft work account to access assessment forms, IQA reviews, and EQA records.</p>
        <a class="primary-action" href="/auth/microsoft/start">Continue with Microsoft</a>
        <p class="hint">You will be redirected to Microsoft, then returned securely to ESOLQA.</p>
      </section>
    </main>
  `);
}

function renderDashboardPage(identity: Awaited<ReturnType<typeof getIdentity>>) {
  const displayRole = identity.user?.role ?? "Not assigned";
  const displayStage = identity.user?.stage ?? "No workflow stage";
  const accessStatus = "Signed in with Microsoft";

  return pageShell("Dashboard", `
    <main class="dashboard-shell">
      <aside class="sidebar">
        <div class="sidebar-brand">
          <div class="brand-mark">E</div>
          <div>
            <strong>ESOLQA</strong>
            <span>Assessment workflow</span>
          </div>
        </div>
        <nav>
          <a class="nav-active" href="/dashboard">Dashboard</a>
          <a href="/dashboard">Students</a>
          <a href="/dashboard">Forms</a>
          <a href="/dashboard">Reviews</a>
        </nav>
      </aside>
      <section class="content">
        <header class="topbar">
          <div>
            <p class="eyebrow">Dashboard</p>
            <h1>Welcome back</h1>
          </div>
          <div class="profile-pill">
            <span>${escapeHtml(identity.email)}</span>
          </div>
          <a class="logout-link" href="/logout">Sign out</a>
        </header>
        <section class="notice ${identity.isKnownUser ? "notice-ok" : "notice-warn"}">
          <strong>${identity.isKnownUser ? "User recognised" : "User not found in D1"}</strong>
          <span>${identity.isKnownUser ? "Your role was loaded from the users table." : "Add this Microsoft email to the users table to assign permissions."}</span>
        </section>
        <section class="cards">
          <article class="card">
            <span>Role</span>
            <strong>${escapeHtml(displayRole)}</strong>
          </article>
          <article class="card">
            <span>Stage</span>
            <strong>${escapeHtml(displayStage)}</strong>
          </article>
          <article class="card">
            <span>Access</span>
            <strong>${escapeHtml(accessStatus)}</strong>
          </article>
        </section>
        <section class="panel">
          <div>
            <p class="eyebrow">Next steps</p>
            <h2>Assessment workspace</h2>
          </div>
          <div class="empty-state">
            <strong>No assessment forms yet</strong>
            <span>Next we can add form templates, student records, and role-based workflows.</span>
          </div>
        </section>
      </section>
    </main>
  `);
}

function renderNotFoundPage() {
  return pageShell("Not found", `
    <main class="auth-shell">
      <section class="auth-card">
        <h1>Page not found</h1>
        <p class="lede">The page you requested does not exist.</p>
        <a class="primary-action" href="/dashboard">Go to dashboard</a>
      </section>
    </main>
  `);
}

function renderConfigMissingPage() {
  return pageShell("Microsoft login not configured", `
    <main class="auth-shell">
      <section class="auth-card">
        <div class="brand-mark">E</div>
        <p class="eyebrow">Configuration needed</p>
        <h1>Microsoft login is not ready yet</h1>
        <p class="lede">The Worker needs Microsoft OAuth secrets before users can sign in.</p>
        <p class="hint">Set MICROSOFT_CLIENT_ID, MICROSOFT_CLIENT_SECRET, MICROSOFT_TENANT_ID, and SESSION_SECRET.</p>
      </section>
    </main>
  `);
}

function renderAuthErrorPage(message: string) {
  return pageShell("Sign-in error", `
    <main class="auth-shell">
      <section class="auth-card">
        <div class="brand-mark">E</div>
        <p class="eyebrow">Sign-in error</p>
        <h1>Could not sign you in</h1>
        <p class="lede">${escapeHtml(message)}</p>
        <a class="primary-action" href="/login">Try again</a>
      </section>
    </main>
  `);
}

function pageShell(title: string, body: string) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)} | ESOLQA</title>
  <style>
    :root {
      color-scheme: light;
      --bg: #eef4ff;
      --panel: #ffffff;
      --text: #14213d;
      --muted: #637083;
      --primary: #2457d6;
      --primary-dark: #173f9f;
      --border: #d9e2f1;
      --success: #e9f8ef;
      --success-text: #17643a;
      --warn: #fff7e6;
      --warn-text: #8a5a00;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    * {
      box-sizing: border-box;
    }
    body {
      margin: 0;
      background: radial-gradient(circle at top left, #dbe9ff, transparent 34rem), var(--bg);
      color: var(--text);
      min-height: 100vh;
    }
    a {
      color: inherit;
      text-decoration: none;
    }
    .auth-shell {
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 2rem;
    }
    .auth-card {
      width: min(100%, 30rem);
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid var(--border);
      border-radius: 2rem;
      box-shadow: 0 1.5rem 5rem rgba(20, 33, 61, 0.12);
      padding: 2.5rem;
      text-align: center;
    }
    .brand-mark {
      width: 3rem;
      height: 3rem;
      display: inline-grid;
      place-items: center;
      border-radius: 1rem;
      background: linear-gradient(135deg, var(--primary), #7c3aed);
      color: #fff;
      font-weight: 800;
    }
    .eyebrow {
      margin: 0 0 0.5rem;
      color: var(--primary);
      font-size: 0.75rem;
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    h1, h2, p {
      margin-top: 0;
    }
    h1 {
      font-size: clamp(2rem, 5vw, 3.25rem);
      line-height: 1;
      margin-bottom: 1rem;
    }
    h2 {
      font-size: 1.4rem;
      margin-bottom: 0;
    }
    .lede, .hint {
      color: var(--muted);
      line-height: 1.6;
    }
    .primary-action {
      display: inline-flex;
      justify-content: center;
      width: 100%;
      margin: 1rem 0;
      padding: 0.95rem 1.25rem;
      border-radius: 999px;
      background: var(--primary);
      color: #fff;
      font-weight: 800;
      box-shadow: 0 1rem 2rem rgba(36, 87, 214, 0.24);
    }
    .primary-action:hover {
      background: var(--primary-dark);
    }
    .dashboard-shell {
      display: grid;
      grid-template-columns: 17rem 1fr;
      min-height: 100vh;
    }
    .sidebar {
      background: #0f1b33;
      color: #fff;
      padding: 1.5rem;
    }
    .sidebar-brand {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      margin-bottom: 2rem;
    }
    .sidebar-brand span {
      display: block;
      color: #9fb0cc;
      font-size: 0.85rem;
    }
    nav {
      display: grid;
      gap: 0.4rem;
    }
    nav a {
      padding: 0.8rem 1rem;
      border-radius: 0.9rem;
      color: #c8d3e7;
    }
    nav a:hover, .nav-active {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
    }
    .content {
      padding: 2rem;
    }
    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    .profile-pill {
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 999px;
      padding: 0.7rem 1rem;
      color: var(--muted);
      font-weight: 700;
    }
    .notice {
      display: grid;
      gap: 0.25rem;
      border-radius: 1.25rem;
      padding: 1rem 1.25rem;
      margin-bottom: 1.5rem;
    }
    .notice-ok {
      background: var(--success);
      color: var(--success-text);
    }
    .notice-warn {
      background: var(--warn);
      color: var(--warn-text);
    }
    .cards {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    .card, .panel {
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 1.5rem;
      box-shadow: 0 1rem 3rem rgba(20, 33, 61, 0.08);
    }
    .card {
      display: grid;
      gap: 0.4rem;
      padding: 1.4rem;
    }
    .card span {
      color: var(--muted);
      font-weight: 700;
    }
    .card strong {
      font-size: 1.4rem;
    }
    .panel {
      padding: 1.5rem;
    }
    .empty-state {
      display: grid;
      gap: 0.35rem;
      margin-top: 1.25rem;
      border: 1px dashed var(--border);
      border-radius: 1.2rem;
      padding: 2rem;
      color: var(--muted);
      text-align: center;
    }
    .empty-state strong {
      color: var(--text);
      font-size: 1.2rem;
    }
    @media (max-width: 820px) {
      .dashboard-shell {
        grid-template-columns: 1fr;
      }
      .sidebar {
        position: static;
      }
      .cards {
        grid-template-columns: 1fr;
      }
      .topbar {
        align-items: flex-start;
        flex-direction: column;
      }
    }
  </style>
</head>
<body>
${body}
</body>
</html>`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
