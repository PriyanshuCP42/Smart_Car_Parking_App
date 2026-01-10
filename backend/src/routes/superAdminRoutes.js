const express = require('express');
const { getDashboardStats, getPendingApprovals, approveDriver, rejectDriver, getDashboardSummary } = require('../controllers/superAdminController');
const { authenticate, authorize } = require('../middleware/authenticate');

const router = express.Router();

// All routes protected by Super Admin role
router.use(authenticate);
router.use(authorize(['SUPER_ADMIN']));

router.get('/dashboard-summary', getDashboardSummary);
router.get('/stats', getDashboardStats);
router.get('/approvals', getPendingApprovals);
router.post('/approve-driver/:id', approveDriver);
router.post('/reject-driver/:id', rejectDriver);

module.exports = router;
