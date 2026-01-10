const express = require('express');
const { createTicket, getActiveTickets, completeTicket, getHistory, requestRetrieval } = require('../controllers/ticketController');
const { authenticate } = require('../middleware/authenticate');

const router = express.Router();

router.post('/create', authenticate, createTicket);
router.get('/active', authenticate, getActiveTickets);
router.post('/complete', authenticate, completeTicket);
router.get('/history', authenticate, getHistory);
router.post('/request-retrieval', authenticate, requestRetrieval);

module.exports = router;
