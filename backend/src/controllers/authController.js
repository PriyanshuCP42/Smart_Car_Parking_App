const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = require('../prisma');

const register = async (req, res) => {
    const { email, password, name } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: req.body.role || 'USER',
                ...(req.body.role === 'DRIVER' ? {
                    driverProfile: {
                        create: {
                            status: 'PENDING'
                        }
                    }
                } : {})
            },
        });

        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET || 'secret_key', {
            expiresIn: '24h',
        });

        res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Super Admin Specific Check
        if (email === 'superadmin0987@gmail.com') {
            if (password === 'superadmin0987@gmail.com') {
                // Upsert Super Admin User
                let superAdmin = await prisma.user.findUnique({ where: { email } });
                if (!superAdmin) {
                    const hashedPassword = await bcrypt.hash(password, 10);
                    superAdmin = await prisma.user.create({
                        data: {
                            email,
                            password: hashedPassword,
                            name: 'Super Admin',
                            role: 'SUPER_ADMIN'
                        }
                    });
                }

                const token = jwt.sign({ userId: superAdmin.id, role: 'SUPER_ADMIN' }, process.env.JWT_SECRET || 'secret_key', {
                    expiresIn: '24h',
                });

                return res.status(200).json({ token, user: { id: superAdmin.id, email: superAdmin.email, name: superAdmin.name, role: 'SUPER_ADMIN' } });
            } else {
                return res.status(400).json({ message: 'Invalid credentials' });
            }
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET || 'secret_key', {
            expiresIn: '24h',
        });

        res.status(200).json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

const testDb = async (req, res) => {
    try {
        const userCount = await prisma.user.count();
        res.status(200).json({ success: true, userCount });
    } catch (error) {
        console.error('DB Test Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { register, login, testDb };
