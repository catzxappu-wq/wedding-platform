const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

let rawDbUrl =
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  "";

function sanitizeUrl(raw) {
  if (!raw) return "";

  // If text contains postgresql:// or postgres:// anywhere inside it, extract it
  const match = raw.match(/postgres(?:ql)?:\/\/[^\s'"<>]+/);
  if (match) {
    return match[0].trim().replace(/[;'")]+$/, "");
  }

  let u = raw.trim();
  if ((u.startsWith('"') && u.endsWith('"')) || (u.startsWith("'") && u.endsWith("'"))) {
    u = u.slice(1, -1).trim();
  }
  if (u.startsWith("psql ")) {
    u = u.replace(/^psql\s+/, "").trim().replace(/^['"]|['"]$/g, "").trim();
  }
  return u;
}

const dbUrl = sanitizeUrl(rawDbUrl);
if (dbUrl) {
  process.env.DATABASE_URL = dbUrl;
}
const isVercel = Boolean(process.env.VERCEL || process.env.VERCEL_ENV);
const schemaPath = path.join(__dirname, "schema.prisma");

if (fs.existsSync(schemaPath)) {
  let schemaContent = fs.readFileSync(schemaPath, "utf8");

  // On Vercel or when PostgreSQL connection string is detected, ALWAYS use postgresql
  if (isVercel || dbUrl.startsWith("postgres://") || dbUrl.startsWith("postgresql://")) {
    console.log("Configuring Prisma schema for PostgreSQL...");
    schemaContent = schemaContent.replace(/provider\s*=\s*"sqlite"/, 'provider = "postgresql"');
    fs.writeFileSync(schemaPath, schemaContent);
  } else if (dbUrl.startsWith("file:") || (!dbUrl && !isVercel)) {
    console.log("Configuring Prisma schema for SQLite / Local...");
    schemaContent = schemaContent.replace(/provider\s*=\s*"postgresql"/, 'provider = "sqlite"');
    fs.writeFileSync(schemaPath, schemaContent);
  }
}

// Generate Prisma Client
try {
  console.log("Generating Prisma client...");
  execSync("npx prisma generate", { stdio: "inherit" });
} catch (e) {
  console.warn("Prisma generate warning:", e.message);
}

// If DATABASE_URL is set and reachable, try to push schema & seed
if (dbUrl && (dbUrl.startsWith("postgres://") || dbUrl.startsWith("postgresql://"))) {
  try {
    console.log("Syncing database schema to PostgreSQL...");
    execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });
    console.log("Database schema synced successfully.");

    console.log("Seeding database with templates and admin...");
    execSync("node prisma/seed.js", { stdio: "inherit" });
    console.log("Database seeded successfully.");
  } catch (e) {
    console.warn("Prisma db push or seed warning:", e.message);
  }
}
