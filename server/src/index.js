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
const LEGAL_VERSION = "1.0";
const REQUIRED_CONSENTS = ["privacy", "personal_data", "agreement", "age_18"];
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) throw new Error("SESSION_SECRET must be at least 32 characters");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const PgSession = connectPgSimple(session);
app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: "2mb" }));
app.use(session({
  store: new PgSession({ pool, tableName: "user_sessions", createTableIfMissing: true }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  name: "rko_session",
  cookie: { httpOnly: true, secure: isProduction, sameSite: "lax", maxAge: 1000 * 60 * 60 * 24 * 30 },
}));

function publicAccount(row) {
  return {
    id: row.id, firstName: row.first_name, lastName: row.last_name || "", telegram: row.telegram || "",
    login: row.login, role: row.role, courseAccess: row.course_access, isActive: row.is_active,
    archivedAt: row.archived_at || null, createdAt: row.created_at,
  };
}
async function getAccountById(id, includeArchived = false) {
  const { rows } = await pool.query(`SELECT * FROM accounts WHERE id=$1${includeArchived ? "" : " AND archived_at IS NULL"}`, [id]);
  return rows[0] || null;
}
async function getAccountByLogin(login) {
  const { rows } = await pool.query("SELECT * FROM accounts WHERE login=$1 AND archived_at IS NULL", [login.trim().toLowerCase()]);
  return rows[0] || null;
}
async function getConsentState(accountId) {
  const { rows } = await pool.query("SELECT document_type FROM legal_consents WHERE account_id=$1 AND document_version=$2 AND accepted=TRUE", [accountId, LEGAL_VERSION]);
  const accepted = new Set(rows.map((row) => row.document_type));
  return { version: LEGAL_VERSION, accepted: [...accepted], required: REQUIRED_CONSENTS.some((type) => !accepted.has(type)) };
}
async function destroyAccountSessions(accountId) {
  await pool.query("DELETE FROM user_sessions WHERE sess->>'accountId'=$1", [String(accountId)]);
}
async function loadSessionAccount(req, res, next) {
  if (!req.session.accountId) return res.status(401).json({ error: "UNAUTHORIZED" });
  const account = await getAccountById(req.session.accountId);
  if (!account || !account.is_active) return req.session.destroy(() => res.status(401).json({ error: "UNAUTHORIZED" }));
  req.account = account;
  next();
}
function requireStaff(req, res, next) {
  if (!["owner", "admin"].includes(req.account?.role)) return res.status(403).json({ error: "FORBIDDEN" });
  next();
}
function requireOwner(req, res, next) {
  if (req.account?.role !== "owner") return res.status(403).json({ error: "OWNER_REQUIRED" });
  next();
}

app.get("/api/health", async (_req, res) => {
  try { await pool.query("SELECT 1"); res.json({ ok: true }); } catch { res.status(503).json({ ok: false }); }
});
app.post("/api/auth/login", async (req, res) => {
  const login = String(req.body?.login || "").trim().toLowerCase();
  const password = String(req.body?.password || "");
  const account = login && password ? await getAccountByLogin(login) : null;
  if (!account || !account.is_active || !(await bcrypt.compare(password, account.password_hash))) return res.status(401).json({ error: "INVALID_CREDENTIALS" });
  req.session.regenerate(async (error) => {
    if (error) return res.status(500).json({ error: "SESSION_ERROR" });
    req.session.accountId = account.id;
    res.json({ account: publicAccount(account), consent: await getConsentState(account.id) });
  });
});
app.post("/api/auth/logout", (req, res) => req.session.destroy(() => res.status(204).end()));
app.get("/api/auth/session", async (req, res) => {
  if (!req.session.accountId) return res.json({ account: null });
  const account = await getAccountById(req.session.accountId);
  if (!account || !account.is_active) {
    req.session.destroy(() => {});
    return res.json({ account: null });
  }
  res.json({ account: publicAccount(account), consent: await getConsentState(account.id) });
});
app.get("/api/me", loadSessionAccount, async (req, res) => res.json({ account: publicAccount(req.account), consent: await getConsentState(req.account.id) }));

app.post("/api/consents/accept", loadSessionAccount, async (req, res) => {
  if (req.body?.version !== LEGAL_VERSION || req.body?.privacy !== true || req.body?.personalData !== true || req.body?.agreement !== true || req.body?.age18 !== true) {
    return res.status(400).json({ error: "ALL_CONSENTS_REQUIRED" });
  }
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const type of REQUIRED_CONSENTS) {
      await client.query(`INSERT INTO legal_consents (id,account_id,document_type,document_version,accepted,accepted_at)
        VALUES ($1,$2,$3,$4,TRUE,NOW()) ON CONFLICT (account_id,document_type,document_version)
        DO UPDATE SET accepted=TRUE,accepted_at=NOW()`, [crypto.randomUUID(), req.account.id, type, LEGAL_VERSION]);
    }
    await client.query("COMMIT");
    res.json({ consent: await getConsentState(req.account.id) });
  } catch (error) { await client.query("ROLLBACK"); throw error; }
  finally { client.release(); }
});

app.get("/api/accounts", loadSessionAccount, requireStaff, async (req, res) => {
  const archived = req.query.archived === "true";
  const { rows } = await pool.query(`SELECT * FROM accounts WHERE archived_at IS ${archived ? "NOT NULL" : "NULL"} ORDER BY CASE role WHEN 'owner' THEN 0 WHEN 'admin' THEN 1 ELSE 2 END,first_name,last_name`);
  res.json({ accounts: rows.map(publicAccount) });
});
app.get("/api/accounts/:id/consents", loadSessionAccount, requireStaff, async (req, res) => {
  const { rows } = await pool.query(`SELECT id,document_type AS "documentType",document_version AS version,accepted,accepted_at AS "acceptedAt"
    FROM legal_consents WHERE account_id=$1 ORDER BY accepted_at DESC`, [req.params.id]);
  res.json({ consents: rows });
});

app.get("/api/course", loadSessionAccount, async (_req, res) => {
  const { rows } = await pool.query("SELECT structure,settings,updated_at FROM course_documents WHERE id=1");
  const doc = rows[0] || { structure: [], settings: {}, updated_at: null };
  res.json({ structure: doc.structure, settings: doc.settings, updatedAt: doc.updated_at });
});
app.put("/api/course", loadSessionAccount, requireStaff, async (req, res) => {
  if (!Array.isArray(req.body?.structure)) return res.status(400).json({ error: "STRUCTURE_REQUIRED" });
  const settings = req.body?.settings && typeof req.body.settings === "object" ? req.body.settings : {};
  const { rows } = await pool.query(`INSERT INTO course_documents (id,structure,settings,updated_at) VALUES (1,$1::jsonb,$2::jsonb,NOW())
    ON CONFLICT (id) DO UPDATE SET structure=EXCLUDED.structure,settings=EXCLUDED.settings,updated_at=NOW() RETURNING updated_at`,
    [JSON.stringify(req.body.structure), JSON.stringify(settings)]);
  res.json({ ok: true, updatedAt: rows[0].updated_at });
});
app.get("/api/progress", loadSessionAccount, async (req, res) => {
  const { rows } = await pool.query("SELECT progress FROM account_progress WHERE account_id=$1", [req.account.id]);
  res.json({ progress: rows[0]?.progress || {} });
});
app.put("/api/progress", loadSessionAccount, async (req, res) => {
  if (!req.body?.progress || typeof req.body.progress !== "object") return res.status(400).json({ error: "PROGRESS_REQUIRED" });
  await pool.query(`INSERT INTO account_progress (account_id,progress,updated_at) VALUES ($1,$2::jsonb,NOW())
    ON CONFLICT (account_id) DO UPDATE SET progress=EXCLUDED.progress,updated_at=NOW()`, [req.account.id, JSON.stringify(req.body.progress)]);
  res.json({ ok: true });
});

app.post("/api/accounts", loadSessionAccount, requireOwner, async (req, res) => {
  const firstName = String(req.body?.firstName || "").trim();
  const login = String(req.body?.login || "").trim().toLowerCase();
  const password = String(req.body?.password || "");
  if (!firstName || !login || password.length < 8) return res.status(400).json({ error: "ACCOUNT_FIELDS_REQUIRED" });
  try {
    const hash = await bcrypt.hash(password, 12);
    const { rows } = await pool.query(`INSERT INTO accounts (id,first_name,last_name,telegram,login,password_hash,role,course_access)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`, [crypto.randomUUID(), firstName, String(req.body?.lastName || "").trim(),
      String(req.body?.telegram || "").trim(), login, hash, ["admin", "student"].includes(req.body?.role) ? req.body.role : "student", req.body?.courseAccess !== false]);
    res.status(201).json({ account: publicAccount(rows[0]) });
  } catch (error) { if (error.code === "23505") return res.status(409).json({ error: "LOGIN_TAKEN" }); throw error; }
});
app.patch("/api/accounts/:id", loadSessionAccount, requireOwner, async (req, res) => {
  const existing = await getAccountById(req.params.id, true);
  if (!existing) return res.status(404).json({ error: "ACCOUNT_NOT_FOUND" });
  const role = ["owner", "admin", "student"].includes(req.body?.role) ? req.body.role : null;
  if (existing.role === "owner" && role && role !== "owner") return res.status(400).json({ error: "OWNER_ROLE_LOCKED" });
  const { rows } = await pool.query(`UPDATE accounts SET first_name=COALESCE(NULLIF($1,''),first_name),last_name=$2,telegram=$3,
    login=COALESCE(NULLIF($4,''),login),role=COALESCE($5,role),course_access=COALESCE($6,course_access),is_active=COALESCE($7,is_active),updated_at=NOW()
    WHERE id=$8 AND archived_at IS NULL RETURNING *`, [String(req.body?.firstName || "").trim(), String(req.body?.lastName || "").trim(),
    String(req.body?.telegram || "").trim(), String(req.body?.login || "").trim().toLowerCase(), role,
    typeof req.body?.courseAccess === "boolean" ? req.body.courseAccess : null, typeof req.body?.isActive === "boolean" ? req.body.isActive : null, req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: "ACCOUNT_NOT_FOUND" });
  if (req.body?.isActive === false) await destroyAccountSessions(req.params.id);
  res.json({ account: publicAccount(rows[0]) });
});
app.patch("/api/me/profile", loadSessionAccount, async (req, res) => {
  const firstName = String(req.body?.firstName || "").trim();
  if (!firstName) return res.status(400).json({ error: "ACCOUNT_FIELDS_REQUIRED" });
  const { rows } = await pool.query("UPDATE accounts SET first_name=$1,last_name=$2,telegram=$3,updated_at=NOW() WHERE id=$4 RETURNING *",
    [firstName, String(req.body?.lastName || "").trim(), String(req.body?.telegram || "").trim(), req.account.id]);
  res.json({ account: publicAccount(rows[0]) });
});
app.delete("/api/accounts/:id", loadSessionAccount, requireOwner, async (req, res) => {
  if (req.params.id === req.account.id) return res.status(400).json({ error: "CANNOT_DELETE_SELF" });
  const target = await getAccountById(req.params.id);
  if (!target) return res.status(404).json({ error: "ACCOUNT_NOT_FOUND" });
  if (target.role === "owner") return res.status(400).json({ error: "CANNOT_DELETE_OWNER" });
  await pool.query("UPDATE accounts SET is_active=FALSE,archived_at=NOW(),updated_at=NOW() WHERE id=$1", [req.params.id]);
  await destroyAccountSessions(req.params.id);
  res.status(204).end();
});
app.delete("/api/archive/:id", loadSessionAccount, requireOwner, async (req, res) => {
  const target = await getAccountById(req.params.id, true);
  if (!target?.archived_at) return res.status(404).json({ error: "ARCHIVED_ACCOUNT_NOT_FOUND" });
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("DELETE FROM user_sessions WHERE sess->>'accountId'=$1", [req.params.id]);
    await client.query("DELETE FROM account_progress WHERE account_id=$1", [req.params.id]);
    await client.query("UPDATE legal_consents SET account_id=NULL,anonymized_account_id=COALESCE(anonymized_account_id,$2) WHERE account_id=$1", [req.params.id, crypto.randomUUID()]);
    await client.query("DELETE FROM accounts WHERE id=$1", [req.params.id]);
    await client.query("COMMIT");
    res.status(204).end();
  } catch (error) { await client.query("ROLLBACK"); throw error; } finally { client.release(); }
});
app.post("/api/archive/:id/restore", loadSessionAccount, requireOwner, async (req, res) => {
  const target = await getAccountById(req.params.id, true);
  if (!target?.archived_at) return res.status(404).json({ error: "ARCHIVED_ACCOUNT_NOT_FOUND" });
  const { rows } = await pool.query("UPDATE accounts SET archived_at=NULL,is_active=TRUE,updated_at=NOW() WHERE id=$1 RETURNING *", [req.params.id]);
  res.json({ account: publicAccount(rows[0]) });
});
app.post("/api/accounts/:id/password", loadSessionAccount, requireOwner, async (req, res) => {
  const password = String(req.body?.password || "");
  if (password.length < 8) return res.status(400).json({ error: "PASSWORD_TOO_SHORT" });
  const hash = await bcrypt.hash(password, 12);
  const { rowCount } = await pool.query("UPDATE accounts SET password_hash=$1,updated_at=NOW() WHERE id=$2 AND archived_at IS NULL", [hash, req.params.id]);
  if (!rowCount) return res.status(404).json({ error: "ACCOUNT_NOT_FOUND" });
  await destroyAccountSessions(req.params.id);
  res.status(204).end();
});
app.post("/api/me/password", loadSessionAccount, async (req, res) => {
  const password = String(req.body?.password || "");
  if (!(await bcrypt.compare(String(req.body?.currentPassword || ""), req.account.password_hash))) return res.status(400).json({ error: "CURRENT_PASSWORD_INVALID" });
  if (password.length < 8) return res.status(400).json({ error: "PASSWORD_TOO_SHORT" });
  await pool.query("UPDATE accounts SET password_hash=$1,updated_at=NOW() WHERE id=$2", [await bcrypt.hash(password, 12), req.account.id]);
  res.status(204).end();
});

app.use((err, _req, res, _next) => { console.error(err); res.status(500).json({ error: "INTERNAL_ERROR" }); });

async function ensureSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS accounts (id UUID PRIMARY KEY,first_name TEXT NOT NULL,last_name TEXT NOT NULL DEFAULT '',telegram TEXT NOT NULL DEFAULT '',login TEXT NOT NULL UNIQUE,password_hash TEXT NOT NULL,role TEXT NOT NULL CHECK(role IN ('owner','admin','student')),course_access BOOLEAN NOT NULL DEFAULT TRUE,is_active BOOLEAN NOT NULL DEFAULT TRUE,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
    ALTER TABLE accounts ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;
    CREATE TABLE IF NOT EXISTS course_documents (id INTEGER PRIMARY KEY CHECK(id=1),structure JSONB NOT NULL DEFAULT '[]'::jsonb,settings JSONB NOT NULL DEFAULT '{}'::jsonb,updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
    CREATE TABLE IF NOT EXISTS account_progress (account_id UUID PRIMARY KEY REFERENCES accounts(id) ON DELETE CASCADE,progress JSONB NOT NULL DEFAULT '{}'::jsonb,updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
    CREATE TABLE IF NOT EXISTS legal_consents (id UUID PRIMARY KEY,account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,anonymized_account_id UUID,document_type TEXT NOT NULL,document_version TEXT NOT NULL,accepted BOOLEAN NOT NULL DEFAULT TRUE,accepted_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
    DROP INDEX IF EXISTS legal_consents_active_unique;
    CREATE UNIQUE INDEX IF NOT EXISTS legal_consents_account_document_unique ON legal_consents(account_id,document_type,document_version);
  `);
  const login = String(process.env.OWNER_LOGIN || "").trim().toLowerCase();
  const password = String(process.env.OWNER_PASSWORD || "");
  if (login && password && !(await getAccountByLogin(login))) {
    await pool.query("INSERT INTO accounts (id,first_name,login,password_hash,role) VALUES ($1,$2,$3,$4,'owner')",
      [crypto.randomUUID(), process.env.OWNER_FIRST_NAME || "Влад", login, await bcrypt.hash(password, 12)]);
  }
}
await ensureSchema();
app.listen(port, () => console.log(`RKO API listening on :${port}`));
