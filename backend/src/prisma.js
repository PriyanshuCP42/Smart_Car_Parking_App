const { PrismaClient } = require('@prisma/client');

let prisma;

if (process.env.NODE_ENV === 'production') {
    const dbUrl = process.env.DATABASE_URL;
    let url = dbUrl;

    // Automatically ensure pgbouncer=true is present for Transaction Pooler compatibility
    if (dbUrl && !dbUrl.includes('pgbouncer=true')) {
        const separator = dbUrl.includes('?') ? '&' : '?';
        url = `${dbUrl}${separator}pgbouncer=true`;
    }

    prisma = new PrismaClient({
        datasources: {
            db: {
                url: url
            }
        }
    });
} else {
    // Prevent multiple instances in development (hot-reloading)
    if (!global.prisma) {
        global.prisma = new PrismaClient();
    }
    prisma = global.prisma;
}

process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await prisma.$disconnect();
    process.exit(0);
});

module.exports = prisma;
