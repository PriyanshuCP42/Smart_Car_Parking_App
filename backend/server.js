const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const prisma = require('./src/prisma');
const authRoutes = require('./src/routes/authRoutes');
const vehicleRoutes = require('./src/routes/vehicleRoutes');
const ticketRoutes = require('./src/routes/ticketRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    process.env.FRONTEND_URL,
    /\.vercel\.app$/ // Allow all vercel subdomains for convenience during testing
].filter(Boolean);

const corsOptions = {
    origin: (origin, callback) => {
        // Allow all origins in development (for network testing) or if explicitly allowed
        if (process.env.NODE_ENV !== 'production' || !origin || allowedOrigins.some(o => typeof o === 'string' ? o === origin : o.test(origin))) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, {
        contentLength: req.headers['content-length'],
        contentType: req.headers['content-type']
    });
    next();
});

app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/manager', require('./src/routes/managerRoutes'));
app.use('/api/driver', require('./src/routes/driverRoutes'));
app.use('/api/super-admin', require('./src/routes/superAdminRoutes'));

app.get('/', (req, res) => {
    res.send('Server is running');
});

const startServer = async () => {
    let retries = 10;
    let delay = 2000;
    while (retries > 0) {
        try {
            await prisma.$connect();
            console.log('Database connected successfully (working fine)');
            break;
        } catch (error) {
            console.error(`Failed to connect to database (Attempt ${11 - retries}/10):`, error.message);
            retries -= 1;
            if (retries === 0) {
                console.error('All connection attempts failed. Exiting.');
                process.exit(1);
            }
            // Wait with exponential backoff (capped at 10s)
            console.log(`Retrying in ${delay / 1000}s...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            delay = Math.min(delay * 1.5, 10000);
        }
    }

    const server = app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log('Body parser limit: 50mb');
    });

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.error(`Port ${PORT} is already in use. Please stop the existing server or use a different port.`);
            process.exit(1);
        } else {
            console.error('Server error:', err);
        }
    });
};

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    startServer();
}

module.exports = app;
