const SSLCommerzPayment = require('sslcommerz-lts');
const pool = require('../db');
// Add at the start of the function
if (!process.env.STORE_ID || !process.env.STORE_PASSWORD) {
  return res.status(500).json({
    success: false,
    message: 'Payment gateway not configured'
  });
}
const AZURE_BACKEND_URL = process.env.AZURE_BACKEND_URL;
const initPayment = async (req, res) => {
  try {
    const { eventId, userId } = req.body;

    // 1. Verify event exists and is paid
    const event = await pool.query(
      `SELECT name, price FROM event 
       WHERE id = $1 AND is_paid = true`,
      [eventId]
    );
    
    if (event.rows.length === 0) {
      return res.status(400).json({ 
        error: 'Event not found or not payable' 
      });
    }

    // 2. Generate transaction ID
    const tran_id = `event_${eventId}_user_${userId}_${Date.now()}`;

    // 3. Prepare minimal SSLCommerz payload
    const paymentData = {
      total_amount: event.rows[0].price,
      currency: 'BDT',
      tran_id: tran_id,
      success_url: `${process.env.BACKEND_URL}/api/payment/success`,
      fail_url: `${process.env.BACKEND_URL}/api/payment/fail`,
      cancel_url: `${process.env.BACKEND_URL}/api/payment/cancel`,
      cus_name: 'Customer Name', // Can fetch from users table if needed
      cus_email: 'customer@example.com',
      cus_phone: '01700000000',
      shipping_method: 'NO',
      product_name: event.rows[0].name.substring(0, 50),
      product_category: 'Event'
    };

    // 4. Initiate payment
    const sslcz = new SSLCommerzPayment(
      process.env.STORE_ID,
      process.env.STORE_PASSWORD,
      false // sandbox mode
    );
    
    const apiResponse = await sslcz.init(paymentData);

    // 5. Record minimal transaction data
    await pool.query(
      `INSERT INTO payments (
        transaction_id, user_id, event_id, amount, status
      ) VALUES ($1, $2, $3, $4, $5)`,
      [tran_id, userId, eventId, event.rows[0].price, 'PENDING']
    );

    res.json({ 
      success: true,
      paymentUrl: apiResponse.GatewayPageURL 
    });
  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};
const handleSuccess = async (req, res) => {
  const { tran_id } = req.query; // GET requests use req.query

  try {
    // 1. Validate with SSLCommerz
    const validation = await sslcz.validate({ tran_id });
    
    // 2. Update transaction status
    await pool.query(
      `UPDATE payments SET 
       status = 'COMPLETED',
       gateway_data = $1
       WHERE transaction_id = $2`,
      [validation, tran_id]
    );

    // 3. Get transaction details
    const payment = await pool.query(
      `SELECT user_id, event_id FROM payments 
       WHERE transaction_id = $1`,
      [tran_id]
    );

    // 4. Complete registration (if needed)
    // await completeRegistration(payment.rows[0].user_id, payment.rows[0].event_id);

    // 5. Redirect to frontend
    res.redirect(`http:localhost:3000/payment-success?transaction=${tran_id}`);
  } catch (error) {
    console.error('Payment validation failed:', error);
    res.redirect(`http:localhost:3000/payment-error?reason=validation_failed`);
  }
};
module.exports = { initPayment, handleSuccess };