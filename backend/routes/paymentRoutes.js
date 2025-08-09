const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// This endpoint is called from your React frontend to start the payment process.
router.post('/init', paymentController.initPayment);

// After (correct)
router.get('/api/payment/success', paymentController.handleSuccess);

module.exports = router;