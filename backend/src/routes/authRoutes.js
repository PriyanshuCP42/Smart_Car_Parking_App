const express = require('express');
const { register, login, testDb } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/test-db', testDb);

module.exports = router;
