const prisma = require('../prisma');

const getDashboardStats = async (req, res) => {
    try {
        // Global stats (mocking site filter for now)
        // Filter by location (default to Inorbit Mall if not specified, though logic suggests we want specific site)
        const locationFilter = { location: 'Inorbit Mall - Malad' };

        // Global stats filtered by location
        const totalTickets = await prisma.ticket.count({
            where: locationFilter
        });

        const activeParking = await prisma.ticket.count({
            where: {
                ...locationFilter,
                status: { in: ['ACTIVE', 'PARKED'] }
            }
        });

        // Calculate total collection from completed tickets using the database sum
        const revenueResult = await prisma.ticket.aggregate({
            where: {
                ...locationFilter,
                status: 'COMPLETED'
            },
            _sum: {
                amount: true
            }
        });

        const totalCollection = revenueResult._sum.amount || 0;

        res.json({
            totalTickets,
            totalCollection,
            activeParking
        });
    } catch (error) {
        console.error('Super Admin Stats Error:', error);
        res.status(500).json({ message: 'Failed to fetch stats' });
    }
};

const getPendingApprovals = async (req, res) => {
    try {
        const pendingDrivers = await prisma.user.findMany({
            where: {
                role: 'DRIVER',
                driverProfile: {
                    status: 'PENDING'
                }
            },
            include: {
                driverProfile: true
            }
        });

        res.json(pendingDrivers);
    } catch (error) {
        console.error('Pending Approvals Error:', error);
        res.status(500).json({ message: 'Failed to fetch pending approvals' });
    }
};

const approveDriver = async (req, res) => {
    const { id } = req.params;
    try {
        const driverProfile = await prisma.driverProfile.update({
            where: { userId: id },
            data: { status: 'ACTIVE' }
        });
        res.json({ success: true, message: 'Driver approved successfully' });
    } catch (error) {
        console.error('Approve Driver Error:', error);
        res.status(500).json({ message: 'Failed to approve driver' });
    }
};

const rejectDriver = async (req, res) => {
    const { id } = req.params;
    try {
        // Option 1: Delete the user completely
        // await prisma.user.delete({ where: { id } });

        // Option 2: Set status to REJECTED (Better for history/records)
        const driverProfile = await prisma.driverProfile.update({
            where: { userId: id },
            data: { status: 'REJECTED' }
        });

        res.json({ success: true, message: 'Driver rejected successfully' });
    } catch (error) {
        console.error('Reject Driver Error:', error);
        res.status(500).json({ message: 'Failed to reject driver' });
    }
};

const getDashboardSummary = async (req, res) => {
    try {
        const locationFilter = { location: 'Inorbit Mall - Malad' };

        const [totalTickets, activeParking, revenueResult, pendingDrivers] = await Promise.all([
            prisma.ticket.count({ where: locationFilter }),
            prisma.ticket.count({ where: { ...locationFilter, status: { in: ['ACTIVE', 'PARKED', 'VALET_ASSIGNED_FOR_PARKING'] } } }),
            prisma.ticket.aggregate({
                where: { ...locationFilter, status: 'COMPLETED' },
                _sum: { amount: true }
            }),
            prisma.user.findMany({
                where: {
                    role: 'DRIVER',
                    driverProfile: { status: 'PENDING' }
                },
                include: { driverProfile: true }
            })
        ]);

        console.log('Pending Drivers Found:', pendingDrivers.length);
        console.log('Pending Drivers Data:', JSON.stringify(pendingDrivers, null, 2));

        res.json({
            stats: {
                totalTickets,
                totalCollection: revenueResult._sum.amount || 0,
                activeParking
            },
            pendingApprovals: pendingDrivers
        });
    } catch (error) {
        console.error('Super Admin Dashboard Summary Error:', error);
        res.status(500).json({ message: 'Failed to fetch dashboard summary' });
    }
};

module.exports = {
    getDashboardStats,
    getPendingApprovals,
    approveDriver,
    rejectDriver,
    getDashboardSummary
};


