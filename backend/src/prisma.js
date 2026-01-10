const { PrismaClient } = require('@prisma/client');

let prisma;

if (process.env.NODE_ENV === 'production') {
    // In production (Vercel), enforce connection limit to 1 and pgbouncer mode
    const dbUrl = process.env.DATABASE_URL;
    let urlWithLimit = dbUrl;

    if (dbUrl) {
        const separator = dbUrl.includes('?') ? '&' : '?';
        // connection_limit=5: Increase concurrency (1 was too strict)
        // pgbouncer=true: Keep for Supabase Transaction Pooler compatibility
        // pool_timeout=30: Wait up to 30s for a connection before failing (default was 10s)
        urlWithLimit = `${dbUrl}${separator}connection_limit=5&pgbouncer=true&pool_timeout=30`;
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
