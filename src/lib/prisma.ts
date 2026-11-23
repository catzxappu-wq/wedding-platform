import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function sanitizeDbUrl(raw?: string): string | undefined {
  if (!raw) return undefined;
  let url = raw.trim();
  // Strip surrounding single or double quotes
  if (
    (url.startsWith('"') && url.endsWith('"')) ||
    (url.startsWith("'") && url.endsWith("'"))
  ) {
    url = url.slice(1, -1).trim();
  }
  // Strip psql CLI command prefix if copied from CLI prompt
  if (url.startsWith("psql ")) {
    url = url.replace(/^psql\s+/, "").trim().replace(/^['"]|['"]$/g, "").trim();
  }
  return url;
}

function getPrismaClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    const rawUrl =
      process.env.POSTGRES_PRISMA_URL ||
      process.env.POSTGRES_URL ||
      process.env.DATABASE_URL;

    const connectionUrl = sanitizeDbUrl(rawUrl);
    if (connectionUrl) {
      process.env.DATABASE_URL = connectionUrl;
    }

    globalForPrisma.prisma = new PrismaClient({
      datasources: connectionUrl ? { db: { url: connectionUrl } } : undefined,
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });
  }
  return globalForPrisma.prisma;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient();
    const value = (client as any)[prop];
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
});

export default prisma;
