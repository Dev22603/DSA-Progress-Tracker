import { PrismaClient } from '@prisma/client';
import { config } from '../constants/config.mjs';
const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma || new PrismaClient();

if (config.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export { prisma };
