const express = require('express');
const router = express.Router();
const SSLCommerzPayment = require('sslcommerz-nodejs').SSLCommerzPayment;
const pool = require('../db');

async function validateSslCommerzTransaction(tran_id, val_id) {
  const sslcz = new SSLCommerzPayment(
    process.env.SSL_STORE_ID,
    process.env.SSL_STORE_PASSWORD,
    process.env.NODE_ENV !== 'production'
  );

  try {
    const validationResponse = await sslcz.validate({ val_id: val_id });

    if (validationResponse && validationResponse.status === 'VALID') {
      console.log('Transaction VALIDATED successfully for Tran ID:', tran_id);
      return { status: 'SUCCESS', message: 'Payment successful', data: validationResponse };
    } else {
      console.error('Transaction VALIDATION FAILED for Tran ID:', tran_id, 'Response:', validationResponse);
      return { status: 'FAILED', message: 'Payment validation failed', data: validationResponse };
    }
  } catch (error) {
    console.error('Error during SSLCommerz validation:', error);
    return { status: 'ERROR', message: 'Internal validation error', details: error };
  }
}

router.post('/initiate-payment', async (req, res) => {
  const { amount, orderId, customerName, customerEmail, customerPhone } = req.body;

  const baseUrl = `https://${process.env.WEBSITE_HOSTNAME}`; 

  const data = {
    total_amount: amount,
    currency: "BDT",
    tran_id: orderId,
    product_name: "GradGuide Service",
    product_category: "Education",
    product_profile: "general",
    cus_name: customerName,
    cus_email: customerEmail,
    cus_add1: "Dhaka",
    cus_city: "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: customerPhone,
    shipping_method: "NO",
    num_of_item: 1,
    success_url: `${baseUrl}/api/payment/sslcommerz-success`,
    fail_url: `${baseUrl}/api/payment/sslcommerz-fail`,
    cancel_url: `${baseUrl}/api/payment/sslcommerz-cancel`,
    ipn_url: `${baseUrl}/api/payment/sslcommerz-ipn`,
    store_id: process.env.SSL_STORE_ID,
    store_passwd: process.env.SSL_STORE_PASSWORD,
  };

  const sslcz = new SSLCommerzPayment(
    process.env.SSL_STORE_ID,
    process.env.SSL_STORE_PASSWORD,
    process.env.NODE_ENV !== 'production'
  );

  try {
    const apiResponse = await sslcz.init(data);
    if (apiResponse && apiResponse.GatewayPageURL) {
      console.log('Payment initiation successful, redirecting to:', apiResponse.GatewayPageURL);
      res.json({ gatewayUrl: apiResponse.GatewayPageURL });
    } else {
      console.error('SSLCommerz initiation failed:', apiResponse);
      res.status(500).json({ error: 'Payment initiation failed', details: apiResponse });
    }
  } catch (error) {
    console.error('Error initiating payment with SSLCommerz:', error);
    res.status(500).json({ error: 'Internal server error during payment initiation' });
  }
});

router.post('/sslcommerz-ipn', async (req, res) => {
  const ipn_data = req.body;
  const { tran_id, val_id, status } = ipn_data;

  console.log('Received SSLCommerz IPN for Tran ID:', tran_id, 'Status:', status);

  if (status === 'VALID') {
    const validationResult = await validateSslCommerzTransaction(tran_id, val_id);
    if (validationResult.status === 'SUCCESS') {
      console.log('Transaction VALIDATED successfully via IPN for Tran ID:', tran_id);
      res.status(200).send('IPN received and validated');
    } else {
      console.error('IPN Validation Failed for Tran ID:', tran_id, 'Details:', validationResult);
      res.status(200).send('IPN received but validation failed');
    }
  } else {
    console.log('IPN received with non-VALID status:', status, 'for Tran ID:', tran_id);
    res.status(200).send(`IPN received with status: ${status}`);
  }
});

router.post('/sslcommerz-success', async (req, res) => {
  const success_data = req.body;
  const { tran_id, val_id, status } = success_data;

  console.log('Received SSLCommerz Success Redirect for Tran ID:', tran_id, 'Status:', status);

  if (status === 'VALID') {
    const validationResult = await validateSslCommerzTransaction(tran_id, val_id);
    if (validationResult.status === 'SUCCESS') {
      const frontendBaseUrl = `https://${process.env.VERCEL_URL}`;
      res.redirect(`${frontendBaseUrl}/payment-status?tran_id=${tran_id}&status=success`);
    } else {
      const frontendBaseUrl = `https://${process.env.VERCEL_URL}`;
      res.redirect(`${frontendBaseUrl}/payment-status?tran_id=${tran_id}&status=failed_validation`);
    }
  } else {
    const frontendBaseUrl = `https://${process.env.VERCEL_URL}`;
    res.redirect(`${frontendBaseUrl}/payment-status?tran_id=${tran_id}&status=failed`);
  }
});

router.post('/sslcommerz-fail', (req, res) => {
  const fail_data = req.body;
  const { tran_id } = fail_data;
  console.log('Received SSLCommerz Fail Redirect for Tran ID:', tran_id);
  const frontendBaseUrl = `https://${process.env.VERCEL_URL}`;
  res.redirect(`${frontendBaseUrl}/payment-status?tran_id=${tran_id}&status=failed`);
});

router.post('/sslcommerz-cancel', (req, res) => {
  const cancel_data = req.body;
  const { tran_id } = cancel_data;
  console.log('Received SSLCommerz Cancel Redirect for Tran ID:', tran_id);
  const frontendBaseUrl = `https://${process.env.VERCEL_URL}`;
  res.redirect(`${frontendBaseUrl}/payment-status?tran_id=${tran_id}&status=cancelled`);
});

module.exports = router;
