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
    const client = await pool.connect();

    try {
        console.log("Payment success callback data:", req.body);

        const tran_id = req.body.tran_id;
        const amount = req.body.amount;
        const eventId = req.body.value_a;
        const userId = req.body.value_b;

        if (!tran_id || !amount || !eventId || !userId) {
            console.error('Missing critical data in success callback.');
            return res.redirect(`${process.env.FRONTEND_URL}/dashboard/payment?status=error&reason=missing_data`);
        }
        
        // Start a database transaction
        await client.query('BEGIN');

        // Step 1: Insert into the transactions table (for tracking payment)
        const transactionResult = await client.query(
            `INSERT INTO public.event_transactions 
                (transaction_id, status, amount, event_id, user_id) 
            VALUES ($1, 'success', $2, $3, $4)
            ON CONFLICT (transaction_id) DO NOTHING
            RETURNING id`,
            [tran_id, amount, eventId, userId]
        );
        
        // Step 2: Insert into the registration table (to mark user as registered)
        const registrationResult = await client.query(
            `INSERT INTO event_registration_response (event_id, user_id, created_at)
             VALUES ($1, $2, NOW())
             ON CONFLICT (event_id, user_id) DO NOTHING`, // Assumes a unique constraint on event_id and user_id
            [eventId, userId]
        );
        
        // Check if both operations were successful (at least one row affected by each)
        if (transactionResult.rowCount === 1 && registrationResult.rowCount === 1) {
            await client.query('COMMIT'); // Commit the transaction
            console.log('Transaction and registration successful.');
            return res.redirect(`${process.env.FRONTEND_URL}/dashboard/payment?status=success&tran_id=${tran_id}`);
        } else {
            throw new Error('Database operation failed: Could not insert both transaction and registration records.');
        }

    } catch (error) {
        await client.query('ROLLBACK'); // Rollback the transaction on error
        console.error('Payment success error:', error.message || error);
        return res.redirect(`${process.env.FRONTEND_URL}/dashboard/payment?status=error&reason=exception`);
    } finally {
        client.release();
    }
};

const fail = async (req, res) => {
  try {
    await pool.query(
      `INSERT INTO event_transactions (transaction_id, status) VALUES ($1, 'failed')`,
      [req.body.tran_id]
    );
    res.redirect(`${process.env.FRONTEND_URL}/dashboard/payment?status=failed`);
  } catch (error) {
    res.redirect(`${process.env.FRONTEND_URL}/dashboard/payment?status=error`);
  }
};


module.exports = { initPayment, success, fail  };