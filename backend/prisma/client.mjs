import { PrismaClient } from "@prisma/client";
import { config } from "../constants/config.mjs";
const globalForPrisma = globalThis;

const prisma =
	globalForPrisma.prisma ||
	new PrismaClient({
		log: ["query", "info", "warn", "error"],
		datasources: { db: { url: process.env.DATABASE_URL } },
	});

if (config.NODE_ENV !== "production") {
	globalForPrisma.prisma = prisma;
}

export { prisma };
