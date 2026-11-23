const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const dbUrl =
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  "";
const schemaPath = path.join(__dirname, "schema.prisma");

if (fs.existsSync(schemaPath)) {
  let schemaContent = fs.readFileSync(schemaPath, "utf8");

  if (dbUrl.startsWith("postgres://") || dbUrl.startsWith("postgresql://")) {
    console.log("Detected PostgreSQL connection string. Configuring Prisma schema for PostgreSQL...");
    schemaContent = schemaContent.replace(/provider\s*=\s*"sqlite"/, 'provider = "postgresql"');
    fs.writeFileSync(schemaPath, schemaContent);
  } else if (dbUrl.startsWith("file:") || !dbUrl) {
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
if (dbUrl) {
  try {
    console.log("Syncing database schema...");
    execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });
    console.log("Database schema synced successfully.");

    console.log("Seeding database with templates and admin...");
    execSync("node prisma/seed.js", { stdio: "inherit" });
    console.log("Database seeded successfully.");
  } catch (e) {
    console.warn("Prisma db push or seed skipped or failed (will initialize at runtime):", e.message);
  }
}
