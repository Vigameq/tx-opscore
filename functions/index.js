const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

admin.initializeApp();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

let pool;
let s3Client;

const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024;
const ALLOWED_CONTENT_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/zip",
  "application/x-zip-compressed",
  "application/octet-stream",
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
]);

const getPool = () => {
  if (!pool) {
    pool = new Pool({
      host: process.env.PGHOST,
      port: Number(process.env.PGPORT || 5432),
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
      ssl: process.env.PGSSLMODE === "disable" ? false : { rejectUnauthorized: false },
      max: Number(process.env.PGPOOL_MAX || 5),
      idleTimeoutMillis: 10000,
    });
  }

  return pool;
};

const getS3Client = () => {
  if (!s3Client) {
    const endpoint = process.env.SPACES_ENDPOINT || "https://blr1.digitaloceanspaces.com";

    s3Client = new S3Client({
      region: process.env.SPACES_REGION || "blr1",
      endpoint,
      credentials: {
        accessKeyId: process.env.SPACES_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.SPACES_SECRET_ACCESS_KEY || "",
      },
    });
  }

  return s3Client;
};

const requireSpacesConfig = () => {
  const missing = [];
  if (!process.env.SPACES_BUCKET) {
    missing.push("SPACES_BUCKET");
  }
  if (!process.env.SPACES_ACCESS_KEY_ID) {
    missing.push("SPACES_ACCESS_KEY_ID");
  }
  if (!process.env.SPACES_SECRET_ACCESS_KEY) {
    missing.push("SPACES_SECRET_ACCESS_KEY");
  }

  return missing;
};

const sanitizeFilename = (filename = "file") =>
  filename.replace(/[^a-zA-Z0-9._-]/g, "_");

const modules = [
  {
    id: "outreach-radar",
    name: "Outreach Radar",
    stage: "Outreach",
    status: "live",
  },
  {
    id: "requirement-capture",
    name: "Requirement Capture",
    stage: "Requirement",
    status: "live",
  },
  {
    id: "solution-studio",
    name: "Solution Studio",
    stage: "Solutioning",
    status: "beta",
  },
  {
    id: "scm-planner",
    name: "SCM Planner",
    stage: "Planning",
    status: "live",
  },
  {
    id: "production-pulse",
    name: "Production Pulse",
    stage: "Production",
    status: "live",
  },
  {
    id: "delivery-logistics",
    name: "Delivery Logistics",
    stage: "Delivery",
    status: "live",
  },
  {
    id: "closure-desk",
    name: "Closure Desk",
    stage: "Closure",
    status: "live",
  },
];

const mockProjects = [
  {
    id: "proj-001",
    name: "Apollo Retail Expansion",
    customer: "Apollo Retail",
    owner: "Ananya Rao",
    status: "Active",
  },
  {
    id: "proj-002",
    name: "Nimbus Warehouse Upgrade",
    customer: "Nimbus Logistics",
    owner: "Rahul Mehta",
    status: "Discovery",
  },
  {
    id: "proj-003",
    name: "Helios Supply Refresh",
    customer: "Helios Energy",
    owner: "Sana Patel",
    status: "Proposal",
  },
];

let mockOpportunities = [
  {
    id: "opp-1001",
    project_id: "proj-001",
    name: "Store rollout phase 1",
    stage: "Qualified",
    source: "Referral",
    value: 420000,
    updated_at: "2025-01-05",
  },
  {
    id: "opp-1002",
    project_id: "proj-001",
    name: "Smart shelving pilot",
    stage: "Proposal",
    source: "Event",
    value: 180000,
    updated_at: "2025-01-12",
  },
  {
    id: "opp-2001",
    project_id: "proj-002",
    name: "Automation audit",
    stage: "Requirement Gathering",
    source: "Inbound",
    value: 95000,
    updated_at: "2025-01-09",
  },
  {
    id: "opp-3001",
    project_id: "proj-003",
    name: "Fleet replacement program",
    stage: "Negotiation",
    source: "Event",
    value: 610000,
    updated_at: "2025-01-16",
  },
];

const allowedStages = new Set([
  "New",
  "Qualified",
  "Requirement Gathering",
  "Proposal",
  "Negotiation",
  "PO",
  "Execution",
]);

const allowedSources = new Set(["Event", "Referral", "Inbound"]);

app.get("/health", async (_req, res) => {
  const status = {
    ok: true,
    uptime: process.uptime(),
    db: "skipped",
  };

  if (process.env.PGHOST) {
    try {
      await getPool().query("SELECT 1");
      status.db = "connected";
    } catch (error) {
      status.db = "error";
      status.ok = false;
      status.error = error.message;
    }
  }

  res.status(status.ok ? 200 : 500).json(status);
});

app.get("/api/modules", (_req, res) => {
  res.json({ modules });
});

app.get("/api/projects", async (_req, res) => {
  if (!process.env.PGHOST) {
    return res.json({ projects: mockProjects });
  }

  try {
    const result = await getPool().query(
      "SELECT id, name, customer_name AS customer, owner_name AS owner, status FROM projects ORDER BY created_at DESC"
    );
    res.json({ projects: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/projects", async (req, res) => {
  const { name, customer, owner, status } = req.body || {};

  if (!name || typeof name !== "string") {
    return res.status(400).json({ error: "name is required." });
  }

  if (!customer || typeof customer !== "string") {
    return res.status(400).json({ error: "customer is required." });
  }

  const safeOwner = typeof owner === "string" && owner.trim() ? owner.trim() : "Unassigned";
  const safeStatus = typeof status === "string" && status.trim() ? status.trim() : "Discovery";

  if (!process.env.PGHOST) {
    const id = `proj-${Date.now()}`;
    const project = {
      id,
      name: name.trim(),
      customer: customer.trim(),
      owner: safeOwner,
      status: safeStatus,
    };
    mockProjects.unshift(project);
    return res.status(201).json({ project });
  }

  try {
    const id = `proj-${Date.now()}`;
    const result = await getPool().query(
      "INSERT INTO projects (id, name, customer_name, owner_name, status) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, customer_name AS customer, owner_name AS owner, status",
      [id, name.trim(), customer.trim(), safeOwner, safeStatus]
    );
    res.status(201).json({ project: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/projects/:projectId/opportunities", async (req, res) => {
  const { projectId } = req.params;

  if (!projectId) {
    return res.status(400).json({ error: "projectId is required." });
  }

  if (!process.env.PGHOST) {
    const opportunities = mockOpportunities
      .filter((item) => item.project_id === projectId)
      .map((item) => ({
        id: item.id,
        projectId: item.project_id,
        name: item.name,
        stage: item.stage,
        source: item.source,
        value: item.value,
        updatedAt: item.updated_at,
      }));

    return res.json({ opportunities });
  }

  try {
    const result = await getPool().query(
      "SELECT id, project_id AS \"projectId\", name, stage, source, value, updated_at AS \"updatedAt\" FROM opportunities WHERE project_id = $1 ORDER BY updated_at DESC",
      [projectId]
    );
    res.json({ opportunities: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/projects/:projectId/opportunities", async (req, res) => {
  const { projectId } = req.params;
  const { name, stage, source, value } = req.body || {};

  if (!projectId) {
    return res.status(400).json({ error: "projectId is required." });
  }

  if (!name || typeof name !== "string") {
    return res.status(400).json({ error: "name is required." });
  }

  if (!allowedStages.has(stage)) {
    return res.status(400).json({ error: "stage is invalid." });
  }

  if (!allowedSources.has(source)) {
    return res.status(400).json({ error: "source is invalid." });
  }

  const numericValue = Number(value);
  if (!Number.isFinite(numericValue) || numericValue < 0) {
    return res.status(400).json({ error: "value must be a positive number." });
  }

  if (!process.env.PGHOST) {
    const id = `opp-${Date.now()}`;
    const record = {
      id,
      project_id: projectId,
      name: name.trim(),
      stage,
      source,
      value: numericValue,
      updated_at: new Date().toISOString().slice(0, 10),
    };
    mockOpportunities = [record, ...mockOpportunities];

    return res.status(201).json({
      opportunity: {
        id: record.id,
        projectId: record.project_id,
        name: record.name,
        stage: record.stage,
        source: record.source,
        value: record.value,
        updatedAt: record.updated_at,
      },
    });
  }

  try {
    const result = await getPool().query(
      "INSERT INTO opportunities (project_id, name, stage, source, value) VALUES ($1, $2, $3, $4, $5) RETURNING id, project_id AS \"projectId\", name, stage, source, value, updated_at AS \"updatedAt\"",
      [projectId, name.trim(), stage, source, numericValue]
    );
    res.status(201).json({ opportunity: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/uploads/sign", async (req, res) => {
  const { projectId, filename, contentType, size } = req.body || {};

  if (!projectId || typeof projectId !== "string") {
    return res.status(400).json({ error: "projectId is required." });
  }

  if (!filename || typeof filename !== "string") {
    return res.status(400).json({ error: "filename is required." });
  }

  if (!contentType || typeof contentType !== "string") {
    return res.status(400).json({ error: "contentType is required." });
  }

  if (!ALLOWED_CONTENT_TYPES.has(contentType)) {
    return res.status(400).json({ error: "contentType not allowed." });
  }

  const numericSize = Number(size);
  if (!Number.isFinite(numericSize) || numericSize <= 0) {
    return res.status(400).json({ error: "size must be a positive number." });
  }

  if (numericSize > MAX_FILE_SIZE) {
    return res.status(400).json({ error: "file exceeds 2GB limit." });
  }

  const missing = requireSpacesConfig();
  if (missing.length > 0) {
    return res.json({
      disabled: true,
      reason: "Spaces credentials are not configured.",
      missing,
    });
  }

  try {
    const safeName = sanitizeFilename(filename);
    const key = `projects/${projectId}/${Date.now()}_${safeName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.SPACES_BUCKET,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(getS3Client(), command, {
      expiresIn: 900,
    });

    res.json({ key, uploadUrl, expiresIn: 900 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/uploads/download", async (req, res) => {
  const { key } = req.query;

  if (!key || typeof key !== "string") {
    return res.status(400).json({ error: "key is required." });
  }

  const missing = requireSpacesConfig();
  if (missing.length > 0) {
    return res.json({
      disabled: true,
      reason: "Spaces credentials are not configured.",
      missing,
    });
  }

  try {
    const command = new GetObjectCommand({
      Bucket: process.env.SPACES_BUCKET,
      Key: key,
    });

    const downloadUrl = await getSignedUrl(getS3Client(), command, {
      expiresIn: 900,
    });

    res.json({ key, downloadUrl, expiresIn: 900 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

exports.api = functions.https.onRequest(app);
