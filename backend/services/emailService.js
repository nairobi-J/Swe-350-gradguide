const nodemailer = require('nodemailer');
const crypto = require('crypto');

// In-memory storage for verification codes (in production, you might want to use Redis)
const verificationCodes = new Map();

// Email transporter configuration (you'll need to configure this with your email provider)
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email provider
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS  // Your email password or app password
  }
});

// Alternative: Using a service like SendGrid, Mailgun, etc.
// const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
};

const sendVerificationEmail = async (email, code) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Email Verification - Grad Guide',
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Grad Guide</h1>
          <p style="color: #f0f0f0; margin: 10px 0 0 0;">Email Verification Required</p>
        </div>
        
        <div style="background: #ffffff; padding: 40px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">Verify Your Email Address</h2>
          
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Thank you for signing up! Please use the verification code below to complete your registration:
          </p>
          
          <div style="background: #f8f9fa; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
            <div style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; font-family: monospace;">
              ${code}
            </div>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            This code will expire in <strong>10 minutes</strong> for security reasons.
          </p>
          
          <p style="color: #666; font-size: 14px;">
            If you didn't create an account with us, please ignore this email.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <div style="text-align: center; color: #999; font-size: 12px;">
            <p>© 2025 Grad Guide. All rights reserved.</p>
          </div>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
};

const storeVerificationCode = (email, code) => {
  const expirationTime = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  verificationCodes.set(email.toLowerCase(), {
    code: code,
    expires: expirationTime,
    attempts: 0
  });
  
  // Clean up expired codes every hour
  setTimeout(() => {
    if (verificationCodes.has(email.toLowerCase())) {
      const stored = verificationCodes.get(email.toLowerCase());
      if (stored.expires < new Date()) {
        verificationCodes.delete(email.toLowerCase());
      }
    }
  }, 11 * 60 * 1000); // Clean up after 11 minutes
};

const verifyCode = (email, code) => {
  const emailLower = email.toLowerCase();
  const stored = verificationCodes.get(emailLower);
  
  if (!stored) {
    return { valid: false, message: 'No verification code found. Please request a new one.' };
  }
  
  if (stored.expires < new Date()) {
    verificationCodes.delete(emailLower);
    return { valid: false, message: 'Verification code has expired. Please request a new one.' };
  }
  
  if (stored.attempts >= 3) {
    verificationCodes.delete(emailLower);
    return { valid: false, message: 'Too many failed attempts. Please request a new verification code.' };
  }
  
  if (stored.code !== code) {
    stored.attempts++;
    return { valid: false, message: 'Invalid verification code. Please try again.' };
  }
  
  // Code is valid
  verificationCodes.delete(emailLower);
  return { valid: true, message: 'Email verified successfully!' };
};

// Function to validate email format and check if it's a real email domain
const validateEmail = async (email) => {
  // Basic format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, message: 'Invalid email format.' };
  }
  
  // Extract domain
  const domain = email.split('@')[1];
  
  // List of common disposable email domains to block
  const disposableEmailDomains = [
    '10minutemail.com', 'mailinator.com', 'guerrillamail.com', 
    'tempmail.org', 'yopmail.com', 'maildrop.cc', 'throwawamail.com'
  ];
  
  if (disposableEmailDomains.includes(domain.toLowerCase())) {
    return { valid: false, message: 'Please use a permanent email address. Disposable emails are not allowed.' };
  }
  
  // You can integrate with email validation services like:
  // - EmailJS
  // - Hunter.io
  // - Kickbox
  // - NeverBounce
  
  // For now, we'll do basic domain validation
  try {
    // This is a basic check - in production you might want to use a proper email validation service
    const dns = require('dns').promises;
    await dns.resolveMx(domain);
    return { valid: true, message: 'Email appears to be valid.' };
  } catch (error) {
    return { valid: false, message: 'Email domain does not appear to be valid.' };
  }
};

module.exports = {
  sendVerificationEmail,
  storeVerificationCode,
  verifyCode,
  validateEmail,
  generateVerificationCode
};
