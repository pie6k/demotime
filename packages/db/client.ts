import { PrismaClient } from '@prisma/client';
export * from '@prisma/client';

let cachedPrisma: PrismaClient;

declare global {
  namespace NodeJS {
    interface Global {
      prisma: PrismaClient;
    }
  }
}

if (process.env.NODE_ENV === 'production') {
  cachedPrisma = new PrismaClient();
} else {
  // Avoid re-creating the client on 'fast reload' of backend code
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }

  cachedPrisma = global.prisma;
}

export const db = cachedPrisma!;
