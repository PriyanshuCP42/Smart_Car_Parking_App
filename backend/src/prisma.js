const { PrismaClient } = require('@prisma/client');

let prisma;

if (process.env.NODE_ENV === 'production') {
    // In production (Vercel), enforce connection limit to 1 and pgbouncer mode
    const dbUrl = process.env.DATABASE_URL;
    let urlWithLimit = dbUrl;

    if (dbUrl) {
        const separator = dbUrl.includes('?') ? '&' : '?';
        // connection_limit=3: Balanced approach (enough for mult-step auth, low enough for Vercel)
        // pgbouncer=true: Required for Supabase Transaction Pooler
        urlWithLimit = `${dbUrl}${separator}connection_limit=3&pgbouncer=true`;
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
