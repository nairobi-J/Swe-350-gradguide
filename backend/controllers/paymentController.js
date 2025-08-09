const SSLCommerzPayment = require('sslcommerz-lts');
const pool = require('../db');

const initPayment = async (req, res) => {
    console.log("STORE_ID:", process.env.STORE_ID);
    console.log("STORE_PASSWORD:", process.env.STORE_PASSWORD ? "Loaded" : "Not Loaded");
    console.log("AZURE_BACKEND_URL:", process.env.AZURE_BACKEND_URL);

    try {
        const { eventId, userId } = req.body;
        
        // Input validation
        if (!eventId || !userId) {
            return res.status(400).json({ success: false, error: 'Missing eventId or userId' });
        }

        console.log("Received client data:", { eventId, userId });

        const event = await pool.query(
            `SELECT name, price FROM event WHERE id = $1 AND is_paid = true`,
            [eventId]
        );

        console.log("Database query result:", event.rows);

        if (event.rows.length === 0) {
            return res.status(400).json({ success: false, error: 'Event not found or not payable' });
        }

        const eventDetails = event.rows[0];
        const tran_id = `event_${eventId}_user_${userId}_${Date.now()}`;

        const paymentData = {
            total_amount: eventDetails.price,
            currency: 'BDT',
            tran_id: tran_id,
            success_url: `${process.env.AZURE_BACKEND_URL}/api/payment/success`,
            fail_url: `${process.env.AZURE_BACKEND_URL}/api/payment/fail`,
            cancel_url: `${process.env.AZURE_BACKEND_URL}/payment/cancel`,
            cus_name: 'Test Customer',
            cus_email: 'customer@example.com',
            cus_phone: '01700000000',
            cus_add1: 'Dhaka',
            cus_city: 'Dhaka',
            cus_country: 'Bangladesh',
            cus_postcode: '1000',
            shipping_method: 'NO',
            product_name: eventDetails.name.length > 50 
                ? `${eventDetails.name.substring(0, 47)}...` 
                : eventDetails.name,
            product_category: 'Event',
            product_profile: 'general',
            multi_card_name: '',
            allowed_bin: '',
            emi_option: 0
        };

        console.log("Final payload for SSLCommerz:", paymentData);
        
        const sslcz = new SSLCommerzPayment(
            process.env.STORE_ID,
            process.env.STORE_PASSWORD,
            false
        );
        
        const apiResponse = await sslcz.init(paymentData);
        console.log("Full SSLCommerz API response:", apiResponse);

        if (apiResponse?.status === 'SUCCESS' && apiResponse.GatewayPageURL) {
            return res.status(200).json({ 
                success: true, 
                paymentUrl: apiResponse.GatewayPageURL,
                sessionKey: apiResponse.sessionkey 
            });
        } else {
            const errorReason = apiResponse?.failedreason || 'No Gateway URL received';
            console.error("SSLCommerz API failed:", errorReason);
            return res.status(400).json({ 
                success: false, 
                error: errorReason,
                fullResponse: apiResponse 
            });
        }

    } catch (error) {
        console.error("Payment initiation error:", error.message);
        return res.status(500).json({ 
            success: false, 
            error: error.message || 'Payment initiation failed' 
        });
    }
};

const success = async (req, res) => {
  try {
    console.log("Payment success callback data:", req.body);
    
    // Minimal working version - just log and respond
    await pool.query(
      `INSERT INTO payments (
        transaction_id, status, created_at
      ) VALUES ($1, $2, NOW())`,
      [req.body.tran_id, 'success']
    );
    
    // Redirect to frontend with success status
    res.redirect(`${process.env.FRONTEND_URL}/payment/status?status=success&tran_id=${req.body.tran_id}`);
    
  } catch (error) {
    console.error('Payment success error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/payment/status?status=error`);
  }
};

const fail = async (req, res) => {
  try {
    console.log("Payment fail callback received:", req.body);
    
    const { tran_id } = req.body;
    
    await pool.query(
      `UPDATE payments SET 
       status = 'failed',
       failed_at = NOW()
       WHERE transaction_id = $1`,
      [tran_id]
    );
    
    res.status(200).json({ status: 'failed' });
    
  } catch (error) {
    console.error('Payment fail error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};
module.exports = { initPayment, success, fail  };