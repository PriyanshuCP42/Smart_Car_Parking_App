const express = require('express');
const { getDashboardStats, getRecentOperations, addDriver, getAllDrivers, assignValet, getDashboardSummary } = require('../controllers/managerController');
const { authenticate, authorize } = require('../middleware/authenticate');

const router = express.Router();

// Apply authentication AND manager authorization to all routes in this file
router.use(authenticate);
router.use(authorize(['MANAGER', 'SUPER_ADMIN']));

router.get('/dashboard-summary', getDashboardSummary);
router.get('/stats', getDashboardStats);
router.get('/operations', getRecentOperations);
router.get('/drivers', getAllDrivers);
router.post('/assign-valet', assignValet);
router.post('/add-driver', addDriver);

module.exports = router;
