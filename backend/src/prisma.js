const { PrismaClient } = require('@prisma/client');

let prisma;

if (process.env.NODE_ENV === 'production') {
    // In production (Vercel), enforce connection limit to 1 to avoid exhausting database pool
    const dbUrl = process.env.DATABASE_URL;
    const urlWithLimit = dbUrl && (dbUrl.includes('?')
        ? `${dbUrl}&connection_limit=1`
        : `${dbUrl}?connection_limit=1`);

    prisma = new PrismaClient({
        datasources: {
            db: {
                url: urlWithLimit
            }
        }
    });
} else {
    // In development, use a global variable so we don't create a new client every time hot reload happens
    if (!global.prisma) {
        global.prisma = new PrismaClient();
    }
    prisma = global.prisma;
}

module.exports = prisma;
