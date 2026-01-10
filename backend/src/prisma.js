const { PrismaClient } = require('@prisma/client');

let prisma;

if (process.env.NODE_ENV === 'production') {
    // In production (Vercel), enforce connection limit to 1 and pgbouncer mode
    const dbUrl = process.env.DATABASE_URL;
    let urlWithLimit = dbUrl;

    if (dbUrl) {
        const separator = dbUrl.includes('?') ? '&' : '?';
        const separator = dbUrl.includes('?') ? '&' : '?';
        // Only append pgbouncer=true if not present (required for Supabase Transaction Pooler)
        if (!dbUrl.includes('pgbouncer=true')) {
            urlWithLimit = `${dbUrl}${separator}pgbouncer=true`;
        } else {
            urlWithLimit = dbUrl;
        }
    }

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
