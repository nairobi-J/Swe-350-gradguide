const SSLCommerzPayment = require('sslcommerz-lts');
const pool = require('../db');

const initPayment = async (req, res) => {
    // Log your credentials and URL to ensure they are loaded correctly
    console.log("STORE_ID:", process.env.STORE_ID);
    console.log("STORE_PASSWORD:", process.env.STORE_PASSWORD ? "Loaded" : "Not Loaded");
    console.log("AZURE_BACKEND_URL:", process.env.AZURE_BACKEND_URL);

    // ... (rest of your existing code)

    try {
        const { eventId, userId } = req.body;

        console.log("Received client data:", { eventId, userId });

        const event = await pool.query(
            `SELECT name, price FROM event WHERE id = $1 AND is_paid = true`,
            [eventId]
        );

        // Check if the event was found in the database
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
            success_url: `${process.env.AZURE_BACKEND_URL}/payment/success`,
            fail_url: `${process.env.AZURE_BACKEND_URL}/payment/fail`,
            cancel_url: `${process.env.AZURE_BACKEND_URL}/payment/cancel`,
            cus_name: 'Test Customer',
            cus_email: 'customer@example.com',
            cus_phone: '01700000000',
            cus_add1: 'Dhaka',
            cus_city: 'Dhaka',
            cus_country: 'Bangladesh',
            shipping_method: 'NO',
            product_name: eventDetails.name.substring(0, 50),
            product_category: 'Event',
            product_profile: 'general'
        };

        console.log("Final payload for SSLCommerz:", paymentData);
        
        const sslcz = new SSLCommerzPayment(
            process.env.STORE_ID,
            process.env.STORE_PASSWORD,
            false
        );
        
        const apiResponse = await sslcz.init(paymentData);
        
        // This is the most important log: it shows the full response from SSLCommerz
        console.log("Full SSLCommerz API response:", apiResponse);

        if (apiResponse && apiResponse.status === 'SUCCESS' && apiResponse.GatewayPageURL) {
            // ... (Your success logic)
        } else {
            console.error("SSLCommerz API failed with reason:", apiResponse.failedreason);
            throw new Error(apiResponse.failedreason || 'Failed to get a payment URL');
        }

    } catch (error) {
        console.error("Payment initiation error in catch block:", error.message);
        res.status(500).json({ success: false, error: error.message || 'Payment initiation failed' });
    }
};

module.exports = { initPayment };

