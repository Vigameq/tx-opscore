const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

admin.initializeApp();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

let pool;

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

exports.api = functions.https.onRequest(app);
