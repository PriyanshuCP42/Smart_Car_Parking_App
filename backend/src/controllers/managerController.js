const bcrypt = require('bcryptjs');
const prisma = require('../prisma');

const getDashboardStats = async (req, res) => {
    try {
        const locationFilter = { location: 'Inorbit Mall - Malad' };

        const activeCars = await prisma.ticket.count({
            where: {
                ...locationFilter,
                status: { in: ['ACTIVE', 'PARKED'] }
            }
        });

        const retrieving = await prisma.ticket.count({
            where: {
                ...locationFilter,
                status: 'RETRIEVING'
            }
        });

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const totalToday = await prisma.ticket.count({
            where: {
                ...locationFilter,
                createdAt: { gte: startOfDay }
            }
        });

        const completedToday = await prisma.ticket.aggregate({
            where: {
                ...locationFilter,
                status: 'COMPLETED',
                exitTime: { gte: startOfDay }
            },
            _sum: {
                amount: true
            }
        });

        const revenue = completedToday._sum.amount || 0;

        res.json({
            activeCars,
            retrieving,
            totalToday,
            revenue
        });
    } catch (error) {
        console.error('Stats Error:', error);
        res.status(500).json({ message: 'Failed to fetch dashboard stats' });
    }
};

const getRecentOperations = async (req, res) => {
    try {
        const tickets = await prisma.ticket.findMany({
            take: 20,
            orderBy: { updatedAt: 'desc' },
            include: {
                user: { select: { name: true } },
                vehicle: { select: { plateNumber: true, make: true, model: true } },
                valet: { select: { name: true, id: true } }
            }
        });
        res.json(tickets);
    } catch (error) {
        console.error('Operations Error:', error);
        res.status(500).json({ message: 'Failed to fetch operations' });
    }
};

const addDriver = async (req, res) => {
    const { email, password, name, phone, address, dob, licenseNumber, licenseExpiry, photo, licensePhoto } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Account with this email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password || 'valet123', 10);

        const result = await prisma.$transaction(async (prisma) => {
            const user = await prisma.user.create({
                data: {
                    email,
                    name,
                    password: hashedPassword,
                    role: 'DRIVER'
                }
            });

            await prisma.driverProfile.create({
                data: {
                    userId: user.id,
                    phone,
                    address,
                    dob,
                    licenseNumber,
                    licenseExpiry,
                    photo,
                    licensePhoto,
                    status: 'PENDING'
                }
            });

            return user;
        }, {
            maxWait: 20000, // Wait longer for a connection
            timeout: 20000  // Allow transaction to run for 20s
        });

        res.status(201).json({ success: true, user: { id: result.id, name: result.name, role: result.role } });
    } catch (error) {
        console.error('Add Driver Error:', error);
        res.status(500).json({ message: 'Failed to add driver' });
    }
};

const getAllDrivers = async (req, res) => {
    try {
        const drivers = await prisma.user.findMany({
            where: { role: 'DRIVER' },
            select: {
                id: true,
                name: true,
                driverProfile: {
                    select: {
                        phone: true,
                        photo: true,
                        status: true
                    }
                }
            }
        });
        res.json(drivers);
    } catch (error) {
        console.error('Get Drivers Error:', error);
        res.status(500).json({ message: 'Failed to fetch drivers' });
    }
};

const assignValet = async (req, res) => {
    const { ticketId, valetId } = req.body;
    try {
        // Get current ticket status
        const currentTicket = await prisma.ticket.findUnique({
            where: { id: ticketId }
        });

        if (!currentTicket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        // Check if the valet is active
        const valet = await prisma.driverProfile.findUnique({
            where: { userId: valetId }
        });

        if (!valet || valet.status !== 'ACTIVE') {
            return res.status(400).json({ message: 'Driver is not active yet. Please wait for Super Admin approval.' });
        }

        // Determine new status based on current status
        let newStatus = 'VALET_ASSIGNED_FOR_PARKING';
        if (currentTicket.status === 'RETRIEVAL_REQUESTED' || currentTicket.status === 'RETRIEVING' || currentTicket.status === 'VALET_ASSIGNED_FOR_RETRIEVAL') {
            newStatus = 'VALET_ASSIGNED_FOR_RETRIEVAL';
        }

        const ticket = await prisma.ticket.update({
            where: { id: ticketId },
            data: {
                valetId,
                status: newStatus
            },
            include: {
                valet: { select: { name: true } },
                vehicle: { select: { plateNumber: true } }
            }
        });
        res.json({ success: true, ticket });
    } catch (error) {
        console.error('Assign Valet Error:', error);
        res.status(500).json({ message: 'Failed to assign valet' });
    }
};

const getDashboardSummary = async (req, res) => {
    try {
        const locationFilter = { location: 'Inorbit Mall - Malad' };
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const [activeCars, retrieving, totalToday, completedToday, tickets, drivers] = await Promise.all([
            prisma.ticket.count({ where: { ...locationFilter, status: { in: ['ACTIVE', 'PARKED', 'VALET_ASSIGNED_FOR_PARKING'] } } }),
            prisma.ticket.count({ where: { ...locationFilter, status: { in: ['RETRIEVAL_REQUESTED', 'VALET_ASSIGNED_FOR_RETRIEVAL', 'RETRIEVING'] } } }),
            prisma.ticket.count({ where: { ...locationFilter, createdAt: { gte: startOfDay } } }),
            prisma.ticket.aggregate({
                where: { ...locationFilter, status: 'COMPLETED', exitTime: { gte: startOfDay } },
                _sum: { amount: true }
            }),
            prisma.ticket.findMany({
                take: 20,
                orderBy: { updatedAt: 'desc' },
                include: {
                    user: { select: { name: true } },
                    vehicle: { select: { plateNumber: true, make: true, model: true } },
                    valet: { select: { name: true, id: true } }
                }
            }),
            prisma.user.findMany({
                where: { role: 'DRIVER' },
                select: {
                    id: true,
                    name: true,
                    driverProfile: {
                        select: { phone: true, photo: true, status: true }
                    }
                }
            })
        ]);

        res.json({
            stats: {
                activeCars,
                retrieving,
                totalToday,
                revenue: completedToday._sum.amount || 0
            },
            operations: tickets,
            drivers: drivers
        });
    } catch (error) {
        console.error('Dashboard Summary Error:', error);
        res.status(500).json({ message: 'Failed to fetch dashboard summary' });
    }
};

module.exports = {
    getDashboardStats,
    getRecentOperations,
    addDriver,
    getAllDrivers,
    assignValet,
    getDashboardSummary
};
