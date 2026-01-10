const express = require('express');
const { getAvailableJobs, acceptJob, getCurrentJob, updateJobStatus, getJobHistory } = require('../controllers/driverController');
const { authenticate, authorize } = require('../middleware/authenticate');

const router = express.Router();

// All routes require authentication and DRIVER role
router.use(authenticate, authorize('DRIVER'));

router.get('/jobs', getAvailableJobs);
router.post('/accept', acceptJob);
router.get('/current', getCurrentJob);
router.post('/update-status', updateJobStatus);
router.get('/history', getJobHistory);

module.exports = router;
