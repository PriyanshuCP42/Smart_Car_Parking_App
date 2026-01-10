const express = require('express');
const { addVehicle, getVehicles, getVehicleById } = require('../controllers/vehicleController');
const { authenticate } = require('../middleware/authenticate');

const router = express.Router();

router.post('/add', authenticate, addVehicle);
router.get('/', authenticate, getVehicles);
router.get('/:id', authenticate, getVehicleById);

module.exports = router;
