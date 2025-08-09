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
    const { eventId, userId } = req.body;

    try {
        // Step 1: Fetch event details
        const eventResult = await pool.query(
            `SELECT name, price FROM event WHERE id = $1`, 
            [eventId]
        );
        
        if (eventResult.rows.length === 0) {
            return res.status(404).json({ message: 'Event not found.' });
        }
        const { name: eventTitle, price: eventFee } = eventResult.rows[0];

        // Step 2: Fetch user details - FIXED COLUMN NAME
        const userResult = await pool.query(
            `SELECT first_name, email, phone FROM users WHERE id = $1`, 
            [userId]
        );
        
        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }
        // Fixed destructuring to match first_name
        const { first_name: userName, email: userEmail, phone: userPhone } = userResult.rows[0];
       
        // Step 3: Generate transaction ID
        const tran_id = `event_reg_${userId}_${eventId}_${Date.now()}`;

        // Step 4: Prepare SSLCommerz data - ENHANCED WITH VALIDATION
        const data = {
            total_amount: eventFee,
            currency: 'BDT',
            tran_id: tran_id,
            success_url: `${AZURE_BACKEND_URL}/api/payment/success`,
            fail_url: `${AZURE_BACKEND_URL}/api/payment/fail`,
            cancel_url: `${AZURE_BACKEND_URL}/api/payment/cancel`,
            ipn_url: `${AZURE_BACKEND_URL}/api/payment/ipn`,
            shipping_method: 'NO',
            product_name: eventTitle.substring(0, 50), // Truncate if too long
            product_category: 'Event Registration',
            product_profile: 'general',
            cus_name: userName || 'Customer', // Fallback if undefined
            cus_email: userEmail,
            cus_add1: 'N/A', 
            cus_city: 'N/A',
            cus_country: 'Bangladesh',
            cus_phone: userPhone || '01700000000' // Fallback if undefined
        };

        // DEBUG: Log the payload being sent
        console.log('SSLCommerz Request Payload:', data);

        // Step 5: Initiate payment
        const sslcz = new SSLCommerzPayment(
            process.env.STORE_ID, 
            process.env.STORE_PASSWORD, 
            false // false for sandbox, true for production
        );
        
        const apiResponse = await sslcz.init(data);
        
        // DEBUG: Log full API response
        console.log('SSLCommerz API Response:', apiResponse);

        // Step 6: Save pending transaction
        await pool.query(
            `INSERT INTO event_transactions (
                transaction_id, user_id, event_id, 
                amount, status
            ) VALUES ($1, $2, $3, $4, $5)`,
            [tran_id, userId, eventId, eventFee, 'PENDING']
        );

        if (!apiResponse.GatewayPageURL) {
            throw new Error(`No GatewayPageURL. Response: ${JSON.stringify(apiResponse)}`);
        }

        return res.status(200).json({ 
            success: true,
            paymentUrl: apiResponse.GatewayPageURL 
        });

    } catch (error) {
        console.error('Payment initiation error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to initiate payment.',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

module.exports = { initPayment };