// Prisma client singleton — currently unused (app uses localStorage)
// This file exists so the import path resolves during type-checking.
// Connect a real database later by setting DATABASE_URL in prisma.config.ts.

import { PrismaClient } from "@/app/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const databaseUrl = process.env.DATABASE_URL ?? "";

  // Only connect if we have a real database URL (not the placeholder)
  if (!databaseUrl || databaseUrl.includes("placeholder")) {
    return null;
  }

  return new PrismaClient({
    accelerateUrl: databaseUrl,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
}

const client = globalForPrisma.prisma ?? createPrismaClient();

export const prisma = client as PrismaClient;

if (process.env.NODE_ENV !== "production" && client) {
  globalForPrisma.prisma = client;
}
