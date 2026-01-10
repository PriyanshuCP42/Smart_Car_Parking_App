const prisma = require('../prisma');

const generateSpot = async () => {
    // Standard parking lot size: 50 spots (A-1 to A-50)
    const MAX_SPOTS = 50;

    // Fetch all currently active spots in ONE query
    const activeTickets = await prisma.ticket.findMany({
        where: { status: 'ACTIVE' },
        select: { spotNumber: true }
    });

    const takenSpots = new Set(activeTickets.map(t => t.spotNumber));

    // Find all free spots
    const freeSpots = [];
    for (let i = 1; i <= MAX_SPOTS; i++) {
        const spot = `A-${i}`;
        if (!takenSpots.has(spot)) {
            freeSpots.push(spot);
        }
    }

    if (freeSpots.length === 0) {
        throw new Error('Parking lot is full');
    }

    // Pick a random free spot
    const randomIndex = Math.floor(Math.random() * freeSpots.length);
    return freeSpots[randomIndex];
};

const createTicket = async (req, res) => {
    const { vehicleId, gateId } = req.body;
    const userId = req.user.userId;

    if (!vehicleId || !gateId) {
        return res.status(400).json({ message: 'Vehicle ID and Gate ID are required' });
    }

    console.log('--- Create Ticket Request ---');
    console.log('User ID:', userId);
    console.log('Vehicle ID:', vehicleId);
    console.log('Gate ID:', gateId);

    try {
        // Validation: Check if vehicle exists
        const vehicle = await prisma.vehicle.findUnique({
            where: { id: vehicleId }
        });

        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        // Check if vehicle already has an active ticket (in any non-completed state)
        const activeTicket = await prisma.ticket.findFirst({
            where: {
                vehicleId,
                status: {
                    in: ['ACTIVE', 'PARKED', 'VALET_ASSIGNED_FOR_PARKING', 'RETRIEVAL_REQUESTED', 'VALET_ASSIGNED_FOR_RETRIEVAL', 'RETRIEVING']
                }
            },
        });

        if (activeTicket) {
            return res.status(400).json({ message: 'Vehicle already has an active ticket', ticket: activeTicket });
        }

        const spotNumber = await generateSpot();

        const ticket = await prisma.ticket.create({
            data: {
                userId,
                vehicleId,
                gateId,
                spotNumber,
                status: 'ACTIVE',
                location: 'Inorbit Mall - Malad',
                amount: 150
            },
        });

        console.log('Ticket created successfully:', ticket.id);
        res.status(201).json(ticket);
    } catch (error) {
        console.error('Create Ticket Error:', error);
        res.status(500).json({ message: error.message || 'Failed to create ticket' });
    }
};

const getActiveTickets = async (req, res) => {
    const userId = req.user.userId;
    console.log('--- Get Active Tickets ---');
    console.log('User ID:', userId);

    try {
        const tickets = await prisma.ticket.findMany({
            where: {
                userId,
                status: {
                    in: ['ACTIVE', 'PARKED', 'VALET_ASSIGNED_FOR_PARKING', 'RETRIEVAL_REQUESTED', 'VALET_ASSIGNED_FOR_RETRIEVAL', 'RETRIEVING']
                }
            },
            include: {
                vehicle: true, // properties: plateNumber, make, model
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        res.json(tickets);
    } catch (error) {
        console.error('Get Active Tickets Error:', error);
        res.status(500).json({ message: 'Failed to fetch tickets' });
    }
};

const completeTicket = async (req, res) => {
    const userId = req.user.userId;

    try {
        await prisma.ticket.updateMany({
            where: {
                userId,
                status: 'ACTIVE',
            },
            data: {
                status: 'COMPLETED',
                exitTime: new Date(),
            },
        });

        res.json({ success: true, message: 'All active sessions completed' });
    } catch (error) {
        console.error('Complete Ticket Error:', error);
        res.status(500).json({ message: 'Failed to complete ticket' });
    }
};

const getHistory = async (req, res) => {
    const userId = req.user.userId;
    console.log('--- Get History ---');
    console.log('User ID:', userId);

    try {
        const tickets = await prisma.ticket.findMany({
            where: {
                userId,
                status: 'COMPLETED',
            },
            include: {
                vehicle: true,
            },
            orderBy: {
                exitTime: 'desc',
            },
        });

        res.json(tickets);
    } catch (error) {
        console.error('Get History Error:', error);
        res.status(500).json({ message: 'Failed to fetch history' });
    }
};

const requestRetrieval = async (req, res) => {
    const userId = req.user.userId;
    const { ticketId } = req.body; // Expect ticketId from frontend

    try {
        const whereClause = {
            userId,
            status: 'PARKED'
        };

        if (ticketId) {
            whereClause.id = ticketId; // ID is usually a string (UUID) or Int. Prisma handles it if type matches schema.
        }

        const ticket = await prisma.ticket.findFirst({
            where: whereClause
        });

        if (!ticket) {
            return res.status(404).json({ message: 'No parked vehicle found to retrieve' });
        }

        const updatedTicket = await prisma.ticket.update({
            where: { id: ticket.id },
            data: {
                status: 'RETRIEVAL_REQUESTED',
                valetId: null // Reset valet so any driver can pick it up (or keep assigned? Requirement says "assignments shown to all drivers")
                // Resetting to NULL allows any driver to pick it up from the pool.
            }
        });

        res.json({ success: true, message: 'Retrieval requested', ticket: updatedTicket });
    } catch (error) {
        console.error('Request Retrieval Error:', error);
        res.status(500).json({ message: 'Failed to request retrieval' });
    }
};

module.exports = { createTicket, getActiveTickets, completeTicket, getHistory, requestRetrieval };
