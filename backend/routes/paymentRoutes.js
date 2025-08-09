const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// This endpoint is called from your React frontend to start the payment process.
router.post('/init', paymentController.initPayment);



module.exports = router;