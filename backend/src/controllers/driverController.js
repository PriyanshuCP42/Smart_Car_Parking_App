const prisma = require("../prisma");

// Get all available jobs (Park requests or Retrieval requests)
const getAvailableJobs = async (req, res) => {
    const valetId = req.user.userId;
    try {
        // Enforce ACTIVE status
        const driverProfile = await prisma.driverProfile.findUnique({ where: { userId: valetId } });
        if (!driverProfile || driverProfile.status !== 'ACTIVE') {
            return res.json([]); // Return empty for non-active drivers
        }

        const jobs = await prisma.ticket.findMany({
            where: {
                valetId: null, // Not yet assigned
                status: {
                    in: ['ACTIVE', 'RETRIEVAL_REQUESTED'] // ACTIVE = Ready to park, RETRIEVAL_REQUESTED = Ready to retrieve
                }
            },
            include: {
                user: { select: { name: true } },
                vehicle: { select: { plateNumber: true, make: true, model: true, color: true } }
            },
            orderBy: {
                updatedAt: 'desc' // Newest requests first (or maybe oldest? Let's go with newest for now)
            }
        });
        res.json(jobs);
    } catch (error) {
        console.error('Get Available Jobs Error:', error);
        res.status(500).json({ message: 'Failed to fetch jobs' });
    }
};

// Accept a job
const acceptJob = async (req, res) => {
    const { ticketId } = req.body;
    const valetId = req.user.userId; // From auth middleware

    try {
        // Enforce ACTIVE status
        const driverProfile = await prisma.driverProfile.findUnique({ where: { userId: valetId } });
        if (!driverProfile || driverProfile.status !== 'ACTIVE') {
            return res.status(403).json({ message: 'Your account is pending approval.' });
        }
        const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });

        if (!ticket) {
            return res.status(404).json({ message: 'Job not found' });
        }

        if (ticket.valetId) {
            return res.status(400).json({ message: 'Job already accepted by another driver' });
        }

        let newStatus;
        if (ticket.status === 'ACTIVE') {
            newStatus = 'VALET_ASSIGNED_FOR_PARKING';
        } else if (ticket.status === 'RETRIEVAL_REQUESTED') {
            newStatus = 'VALET_ASSIGNED_FOR_RETRIEVAL';
        } else {
            return res.status(400).json({ message: 'Job is not available for acceptance' });
        }

        const updatedTicket = await prisma.ticket.update({
            where: { id: ticketId },
            data: {
                valetId: valetId,
                status: newStatus
            },
            include: {
                vehicle: true,
                user: true
            }
        });

        res.json({ success: true, ticket: updatedTicket });
    } catch (error) {
        console.error('Accept Job Error:', error);
        res.status(500).json({ message: 'Failed to accept job' });
    }
};

// Get current active job for the driver
const getCurrentJob = async (req, res) => {
    const valetId = req.user.userId;

    try {
        const job = await prisma.ticket.findFirst({
            where: {
                valetId: valetId,
                status: {
                    in: ['VALET_ASSIGNED_FOR_PARKING', 'VALET_ASSIGNED_FOR_RETRIEVAL', 'RETRIEVING'] // Jobs in progress
                }
            },
            include: {
                user: { select: { name: true } },
                vehicle: { select: { plateNumber: true, make: true, model: true, color: true } }
            }
        });

        res.json(job || null);
    } catch (error) {
        console.error('Get Current Job Error:', error);
        res.status(500).json({ message: 'Failed to fetch current job' });
    }
};

// Update job status (e.g., Parked or Delivered)
const updateJobStatus = async (req, res) => {
    const { ticketId, status } = req.body; // status: 'PARKED' or 'COMPLETED'
    const valetId = req.user.userId;

    try {
        const ticket = await prisma.ticket.findFirst({
            where: { id: ticketId, valetId: valetId }
        });

        if (!ticket) {
            return res.status(404).json({ message: 'Job not found or not assigned to you' });
        }

        const data = { status };
        if (status === 'COMPLETED') {
            data.exitTime = new Date();
        }

        const updatedTicket = await prisma.ticket.update({
            where: { id: ticketId },
            data,
            include: { vehicle: true }
        });

        res.json({ success: true, ticket: updatedTicket });
    } catch (error) {
        console.error('Update Job Status Error:', error);
        res.status(500).json({ message: 'Failed to update job status' });
    }
};

// Get driver's job history
const getJobHistory = async (req, res) => {
    const valetId = req.user.userId;

    try {
        const history = await prisma.ticket.findMany({
            where: {
                valetId: valetId,
                status: {
                    in: ['PARKED', 'COMPLETED']
                }
            },
            include: {
                user: { select: { name: true } },
                vehicle: { select: { plateNumber: true, make: true, model: true, color: true } }
            },
            orderBy: {
                updatedAt: 'desc'
            }
        });

        res.json(history);
    } catch (error) {
        console.error('Get Job History Error:', error);
        res.status(500).json({ message: 'Failed to fetch job history' });
    }
};

module.exports = {
    getAvailableJobs,
    acceptJob,
    getCurrentJob,
    updateJobStatus,
    getJobHistory
};
