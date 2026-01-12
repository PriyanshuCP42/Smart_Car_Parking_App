const prisma = require("../prisma");

const addVehicle = async (req, res) => {
    const { plateNumber, make, model, color } = req.body;
    const userId = req.user.userId; // Assuming middleware populates req.user

    try {
        const existingVehicle = await prisma.vehicle.findUnique({
            where: { plateNumber },
        });

        if (existingVehicle) {
            return res.status(400).json({ message: 'Vehicle with this plate number already exists' });
        }

        const vehicle = await prisma.vehicle.create({
            data: {
                plateNumber,
                make,
                model,
                color,
                ownerId: userId,
            },
        });

        res.status(201).json(vehicle);
    } catch (error) {
        console.error('Add Vehicle Error:', error);
        res.status(500).json({ message: error.message || 'Failed to add vehicle' });
    }
};

const getVehicles = async (req, res) => {
    const userId = req.user.userId;

    try {
        const vehicles = await prisma.vehicle.findMany({
            where: { ownerId: userId },
        });
        res.json(vehicles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch vehicles' });
    }
};

const getVehicleById = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    try {
        const vehicle = await prisma.vehicle.findFirst({
            where: { id, ownerId: userId },
        });
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        res.json(vehicle);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch vehicle' });
    }
};

module.exports = { addVehicle, getVehicles, getVehicleById };
