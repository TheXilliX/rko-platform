import crypto from "node:crypto";
import express from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import helmet from "helmet";
import bcrypt from "bcryptjs";
import pg from "pg";

const { Pool } = pg;
const app = express();
const port = Number(process.env.PORT || 3000);
const isProduction = process.env.NODE_ENV === "production";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required");
}
if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) {
  throw new Error("SESSION_SECRET must be at least 32 characters");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const PgSession = connectPgSimple(session);

app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: "1mb" }));
app.use(session({
  store: new PgSession({ pool, tableName: "user_sessions", createTableIfMissing: true }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  name: "rko_session",
  cookie: {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 * 30,
  },
}));

function normalizeAccount(row) {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name || "",
    telegram: row.telegram || "",
    login: row.login,
    role: row.role,
    courseAccess: row.course_access,
    createdAt: row.created_at,
  };
}

function publicAccount(row) {
  return normalizeAccount(row);
}

async function getAccountById(id) {
  const result = await pool.query("SELECT * FROM accounts WHERE id = $1", [id]);
  return result.rows[0] || null;
}

async function getAccountByLogin(login) {
  const result = await pool.query("SELECT * FROM accounts WHERE login = $1", [login.trim().toLowerCase()]);
  return result.rows[0] || null;
}

function requireAuth(req, res, next) {
  if (!req.session.accountId) return res.status(401).json({ error: "UNAUTHORIZED" });
  next();
}

async function loadSessionAccount(req, res, next) {
  if (!req.session.accountId) return res.status(401).json({ error: "UNAUTHORIZED" });
  const account = await getAccountById(req.session.accountId);
  if (!account || !account.is_active) {
    return req.session.destroy(() => res.status(401).json({ error: "UNAUTHORIZED" }));
  }
  req.account = account;
  req.session.account = publicAccount(account);
  next();
}

function requireStaff(req, res, next) {
  if (!req.account || !["owner", "admin"].includes(req.account.role)) {
    return res.status(403).json({ error: "FORBIDDEN" });
  }
  next();
}

function requireOwner(req, res, next) {
  if (!req.account || req.account.role !== "owner") return res.status(403).json({ error: "OWNER_REQUIRED" });
  next();
}

app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true });
  } catch {
    res.status(503).json({ ok: false });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const login = String(req.body?.login || "").trim().toLowerCase();
  const password = String(req.body?.password || "");
  if (!login || !password) return res.status(400).json({ error: "LOGIN_REQUIRED" });

  const account = await getAccountByLogin(login);
  if (!account || !account.is_active || !(await bcrypt.compare(password, account.password_hash))) {
    return res.status(401).json({ error: "INVALID_CREDENTIALS" });
  }

  req.session.accountId = account.id;
  req.session.account = publicAccount(account);
  res.json({ account: publicAccount(account) });
});

app.post("/api/auth/logout", (req, res) => {
  req.session.destroy(() => res.status(204).end());
});

app.get("/api/auth/session", async (req, res) => {
  if (!req.session.accountId) return res.json({ account: null });
  const account = await getAccountById(req.session.accountId);
  if (!account || !account.is_active) {
    req.session.destroy(() => {});
    return res.json({ account: null });
  }
  req.session.account = publicAccount(account);
  res.json({ account: publicAccount(account) });
});

app.get("/api/me", loadSessionAccount, async (req, res) => {
  res.json({ account: publicAccount(req.account) });
});

app.get("/api/accounts", loadSessionAccount, requireStaff, async (_req, res) => {
  const result = await pool.query("SELECT * FROM accounts ORDER BY CASE role WHEN 'owner' THEN 0 WHEN 'admin' THEN 1 ELSE 2 END, first_name, last_name");
  res.json({ accounts: result.rows.map(publicAccount) });
});

app.get("/api/course", loadSessionAccount, async (_req, res) => {
  const result = await pool.query("SELECT structure, settings, updated_at FROM course_documents WHERE id = 1");
  const document = result.rows[0] || { structure: [], settings: {}, updated_at: null };
  res.json({ structure: document.structure, settings: document.settings, updatedAt: document.updated_at });
});

app.put("/api/course", loadSessionAccount, requireStaff, async (req, res) => {
  const structure = Array.isArray(req.body?.structure) ? req.body.structure : null;
  const settings = req.body?.settings && typeof req.body.settings === "object" ? req.body.settings : {};
  if (!structure) return res.status(400).json({ error: "STRUCTURE_REQUIRED" });
  const result = await pool.query(
    `INSERT INTO course_documents (id, structure, settings, updated_at)
     VALUES (1, $1::jsonb, $2::jsonb, NOW())
     ON CONFLICT (id) DO UPDATE SET structure = EXCLUDED.structure, settings = EXCLUDED.settings, updated_at = NOW()
     RETURNING updated_at`,
    [JSON.stringify(structure), JSON.stringify(settings)],
  );
  res.json({ ok: true, updatedAt: result.rows[0].updated_at });
});

app.get("/api/progress", loadSessionAccount, async (req, res) => {
  const result = await pool.query("SELECT progress FROM account_progress WHERE account_id = $1", [req.account.id]);
  res.json({ progress: result.rows[0]?.progress || {} });
});

app.put("/api/progress", loadSessionAccount, async (req, res) => {
  const progress = req.body?.progress && typeof req.body.progress === "object" ? req.body.progress : null;
  if (!progress) return res.status(400).json({ error: "PROGRESS_REQUIRED" });
  await pool.query(
    `INSERT INTO account_progress (account_id, progress, updated_at)
     VALUES ($1, $2::jsonb, NOW())
     ON CONFLICT (account_id) DO UPDATE SET progress = EXCLUDED.progress, updated_at = NOW()`,
    [req.account.id, JSON.stringify(progress)],
  );
  res.json({ ok: true });
});

app.post("/api/accounts", loadSessionAccount, requireOwner, async (req, res) => {
  const firstName = String(req.body?.firstName || "").trim();
  const lastName = String(req.body?.lastName || "").trim();
  const telegram = String(req.body?.telegram || "").trim();
  const login = String(req.body?.login || "").trim().toLowerCase();
  const password = String(req.body?.password || "");
  const role = ["admin", "student"].includes(req.body?.role) ? req.body.role : "student";
  const courseAccess = req.body?.courseAccess !== false;
  if (!firstName || !login || !password) return res.status(400).json({ error: "ACCOUNT_FIELDS_REQUIRED" });
  try {
    const hash = await bcrypt.hash(password, 12);
    const result = await pool.query(
      `INSERT INTO accounts (id, first_name, last_name, telegram, login, password_hash, role, course_access)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [crypto.randomUUID(), firstName, lastName, telegram, login, hash, role, courseAccess],
    );
    res.status(201).json({ account: publicAccount(result.rows[0]) });
  } catch (error) {
    if (error.code === "23505") return res.status(409).json({ error: "LOGIN_TAKEN" });
    throw error;
  }
});

app.patch("/api/accounts/:id", loadSessionAccount, requireOwner, async (req, res) => {
  const fields = {
    firstName: String(req.body?.firstName || "").trim(),
    lastName: String(req.body?.lastName || "").trim(),
    telegram: String(req.body?.telegram || "").trim(),
    login: String(req.body?.login || "").trim().toLowerCase(),
    role: ["owner", "admin", "student"].includes(req.body?.role) ? req.body.role : null,
    courseAccess: typeof req.body?.courseAccess === "boolean" ? req.body.courseAccess : null,
    isActive: typeof req.body?.isActive === "boolean" ? req.body.isActive : null,
  };
  const existing = await getAccountById(req.params.id);
  if (!existing) return res.status(404).json({ error: "ACCOUNT_NOT_FOUND" });
  if (existing.role === "owner" && fields.role && fields.role !== "owner") return res.status(400).json({ error: "OWNER_ROLE_LOCKED" });
  const result = await pool.query(
    `UPDATE accounts SET first_name = COALESCE(NULLIF($1, ''), first_name), last_name = $2,
      telegram = $3, login = COALESCE(NULLIF($4, ''), login), role = COALESCE($5, role),
      course_access = COALESCE($6, course_access), is_active = COALESCE($7, is_active), updated_at = NOW()
     WHERE id = $8 RETURNING *`,
    [fields.firstName, fields.lastName, fields.telegram, fields.login, fields.role, fields.courseAccess, fields.isActive, req.params.id],
  );
  res.json({ account: publicAccount(result.rows[0]) });
});

app.patch("/api/me/profile", loadSessionAccount, async (req, res) => {
  const firstName = String(req.body?.firstName || "").trim();
  const lastName = String(req.body?.lastName || "").trim();
  const telegram = String(req.body?.telegram || "").trim();
  if (!firstName) return res.status(400).json({ error: "ACCOUNT_FIELDS_REQUIRED" });
  const result = await pool.query(
    "UPDATE accounts SET first_name = $1, last_name = $2, telegram = $3, updated_at = NOW() WHERE id = $4 RETURNING *",
    [firstName, lastName, telegram, req.account.id],
  );
  res.json({ account: publicAccount(result.rows[0]) });
});

app.delete("/api/accounts/:id", loadSessionAccount, requireOwner, async (req, res) => {
  if (req.params.id === req.account.id) return res.status(400).json({ error: "CANNOT_DELETE_SELF" });
  const target = await getAccountById(req.params.id);
  if (!target) return res.status(404).json({ error: "ACCOUNT_NOT_FOUND" });
  if (target.role === "owner") return res.status(400).json({ error: "CANNOT_DELETE_OWNER" });
  await pool.query("DELETE FROM accounts WHERE id = $1", [req.params.id]);
  res.status(204).end();
});

app.post("/api/accounts/:id/password", loadSessionAccount, requireOwner, async (req, res) => {
  const password = String(req.body?.password || "");
  if (password.length < 1) return res.status(400).json({ error: "PASSWORD_REQUIRED" });
  const hash = await bcrypt.hash(password, 12);
  const result = await pool.query("UPDATE accounts SET password_hash = $1, updated_at = NOW() WHERE id = $2 RETURNING id", [hash, req.params.id]);
  if (!result.rowCount) return res.status(404).json({ error: "ACCOUNT_NOT_FOUND" });
  res.status(204).end();
});

app.post("/api/me/password", loadSessionAccount, async (req, res) => {
  const currentPassword = String(req.body?.currentPassword || "");
  const password = String(req.body?.password || "");
  if (!currentPassword || !password) return res.status(400).json({ error: "PASSWORD_REQUIRED" });
  if (!(await bcrypt.compare(currentPassword, req.account.password_hash))) return res.status(400).json({ error: "CURRENT_PASSWORD_INVALID" });
  const hash = await bcrypt.hash(password, 12);
  await pool.query("UPDATE accounts SET password_hash = $1, updated_at = NOW() WHERE id = $2", [hash, req.account.id]);
  res.status(204).end();
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "INTERNAL_ERROR" });
});

async function ensureSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS accounts (
      id UUID PRIMARY KEY,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL DEFAULT '',
      telegram TEXT NOT NULL DEFAULT '',
      login TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'student')),
      course_access BOOLEAN NOT NULL DEFAULT TRUE,
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS course_documents (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      structure JSONB NOT NULL DEFAULT '[]'::jsonb,
      settings JSONB NOT NULL DEFAULT '{}'::jsonb,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS account_progress (
      account_id UUID PRIMARY KEY REFERENCES accounts(id) ON DELETE CASCADE,
      progress JSONB NOT NULL DEFAULT '{}'::jsonb,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  const ownerLogin = String(process.env.OWNER_LOGIN || "").trim().toLowerCase();
  const ownerPassword = String(process.env.OWNER_PASSWORD || "");
  if (ownerLogin && ownerPassword) {
    const existing = await getAccountByLogin(ownerLogin);
    if (!existing) {
      const hash = await bcrypt.hash(ownerPassword, 12);
      await pool.query(
        "INSERT INTO accounts (id, first_name, login, password_hash, role) VALUES ($1, $2, $3, $4, 'owner')",
        [crypto.randomUUID(), process.env.OWNER_FIRST_NAME || "Влад", ownerLogin, hash],
      );
      console.log(`Owner account created: ${ownerLogin}`);
    }
  }
}

await ensureSchema();
app.listen(port, () => console.log(`RKO API listening on :${port}`));
