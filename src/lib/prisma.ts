import { PrismaClient } from "@prisma/client";
import { createMockPrisma } from "./mockPrisma";

const globalForPrisma = global as unknown as { prisma: any };

const isMockMode =
  !process.env.DATABASE_URL ||
  process.env.DATABASE_URL.startsWith("YOUR_") ||
  process.env.DATABASE_URL.includes("hnbxxyyfesdapmxpsppo");

export const prisma = isMockMode
  ? createMockPrisma()
  : globalForPrisma.prisma ||
    new PrismaClient({
      log: ["query"],
    });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
