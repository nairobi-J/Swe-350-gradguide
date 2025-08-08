const express = require('express');
const router = express.Router();
const { generateGuidelines } = require('../controllers/generateResponse');

// POST /api/guidelines
router.post('/response', generateGuidelines);

module.exports = router;