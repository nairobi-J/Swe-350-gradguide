const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
const pool = require('../db'); // Your database connection pool
const { 
  validateEmail, 
  generateVerificationCode, 
  sendVerificationEmail, 
  storeVerificationCode, 
  verifyCode 
} = require('../services/emailService');

const register = async (req, res) => {
    const { first_name, last_name, email, password, phone, dob, gender, verification_code } = req.body;
    console.log(`Attempting registration for email: ${email}`);

    // 1. Basic validation for required fields
    if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({ message: 'Missing required fields: first name, last name, email, and password are required.' });
    }

    // 2. If verification_code is provided, this is the final registration step
    if (verification_code) {
        // Verify the code
        const verificationResult = verifyCode(email, verification_code);
        if (!verificationResult.valid) {
            return res.status(400).json({ message: verificationResult.message });
        }

        try {
            // Hash the password before storing it
            const hashpass = await bcrypt.hash(password, 10);

            // Insert the verified user into the database
            const result = await pool.query(
                `INSERT INTO users 
                 (first_name, last_name, email, password, phone, dob, gender, agree_terms) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
                 RETURNING id, email`,
                [first_name, last_name, email, hashpass, phone, dob, gender, false]
            );

            res.status(201).json({
                message: 'Registration successful! Your email has been verified.',
                user: {
                    id: result.rows[0].id,
                    email: result.rows[0].email
                }
            });

        } catch (error) {
            console.error('Registration failed:', error);

            if (error.code === '23505') {
                return res.status(409).json({ message: 'Email already exists. Please use a different email address.' });
            }
            
            res.status(500).json({ message: 'Registration failed due to a server error. Please try again later.' });
        }
    } else {
        // This is the first step - validate email and send verification code
        
        // Validate email format and authenticity
        const emailValidation = await validateEmail(email);
        if (!emailValidation.valid) {
            return res.status(400).json({ message: emailValidation.message });
        }

        // Check if email already exists in database
        try {
            const existingUser = await pool.query(
                'SELECT id FROM users WHERE email = $1',
                [email]
            );

            if (existingUser.rows.length > 0) {
                return res.status(409).json({ message: 'Email already exists. Please use a different email address.' });
            }

            // Generate and send verification code
            const code = generateVerificationCode();
            const emailSent = await sendVerificationEmail(email, code);

            if (!emailSent) {
                return res.status(500).json({ message: 'Failed to send verification email. Please try again.' });
            }

            // Store the verification code
            storeVerificationCode(email, code);

            res.status(200).json({
                message: 'Verification code sent to your email. Please check your inbox and enter the code to complete registration.',
                step: 'verification_required'
            });

        } catch (error) {
            console.error('Email validation failed:', error);
            res.status(500).json({ message: 'Failed to validate email. Please try again later.' });
        }
    }
};


const login = async (req, res) => {
    const { email, password } = req.body;
    console.log(`Attempting login for email: ${email}`);

    // 1. Basic validation for required fields
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        
        // 2. Find the user by email in the database
        const result = await pool.query(
            `SELECT id, first_name, last_name, email, password FROM users WHERE email = $1`,
            [email]
        );

        const user = result.rows[0];

        // 3. Check if user exists
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials. User not found.' });
        }

        // 4. Compare the provided password with the hashed password from the database
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials. Incorrect password.' });
        }

       const token = jwt.sign(
            { userId: user.id }, // Payload containing user ID
            process.env.JWT_SECRET, // Secret key from environment variables
            { expiresIn: '1h' } // Token expiration time
        );
       

        // 6. Return a success response with the token and basic user info
        res.status(200).json({
            message: 'Login successful!',
            token: token,
            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Login failed:', error);
        res.status(500).json({ message: 'Login failed due to a server error. Please try again later.' });
    }
};

const getUsers = async(req, res) => {
    try {
        // 1. Fetch all users from the database
        const result = await pool.query(
            `SELECT first_name , last_name , id FROM users` // It's better to select specific columns, not all of them
        );

        // 2. Return the list of users as a JSON response
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Fetching users failed:', error);
        res.status(500).json({ message: 'Failed to fetch users due to a server error.' });
    }
}

const getUserById = async (req, res) => {
    const userId = req.params.id;

    try {
        
        const result = await pool.query(
            `SELECT id, first_name, last_name, email, phone FROM users WHERE id = $1`,
            [userId]
        );

       
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

      
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Fetching user failed:', error);
        res.status(500).json({ message: 'Failed to fetch user due to a server error.' });
    }
};

// Resend verification code endpoint
const resendVerificationCode = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
    }

    try {
        // Check if email already exists in database
        const existingUser = await pool.query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({ message: 'Email already registered. Please try logging in instead.' });
        }

        // Validate email format and authenticity
        const emailValidation = await validateEmail(email);
        if (!emailValidation.valid) {
            return res.status(400).json({ message: emailValidation.message });
        }

        // Generate and send new verification code
        const code = generateVerificationCode();
        const emailSent = await sendVerificationEmail(email, code);

        if (!emailSent) {
            return res.status(500).json({ message: 'Failed to send verification email. Please try again.' });
        }

        // Store the new verification code (overwrites any existing code)
        storeVerificationCode(email, code);

        res.status(200).json({
            message: 'New verification code sent to your email. Please check your inbox.',
        });

    } catch (error) {
        console.error('Resend verification failed:', error);
        res.status(500).json({ message: 'Failed to resend verification code. Please try again later.' });
    }
};

// Verify email code endpoint (optional - can also be handled in register)
const verifyEmailCode = async (req, res) => {
    const { email, code } = req.body;

    if (!email || !code) {
        return res.status(400).json({ message: 'Email and verification code are required.' });
    }

    const verificationResult = verifyCode(email, code);
    
    if (verificationResult.valid) {
        res.status(200).json({ 
            message: verificationResult.message,
            verified: true 
        });
    } else {
        res.status(400).json({ 
            message: verificationResult.message,
            verified: false 
        });
    }
};

const deleteUserByEmail = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
    }

    try {
        const result = await pool.query(
            'DELETE FROM users WHERE email = $1 RETURNING id',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({ message: 'User deleted successfully.', userId: result.rows[0].id });
    } catch (error) {
        console.error('Deleting user failed:', error);
        res.status(500).json({ message: 'Failed to delete user due to a server error.' });
    }
};  

const sendVerificationCode = async (req, res) => {
    const { first_name, last_name, email, password, phone, dob, gender } = req.body;
    console.log(`Sending verification code for email: ${email}`);

    // 1. Basic validation for required fields
    if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({ message: 'Missing required fields: first name, last name, email, and password are required.' });
    }

    try {
        // 2. Validate email format and authenticity
        const emailValidation = await validateEmail(email);
        if (!emailValidation.valid) {
            return res.status(400).json({ message: emailValidation.message });
        }

        // 3. Check if email already exists in database
        const existingUser = await pool.query(
            'SELECT email FROM users WHERE email = $1',
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({ message: 'Email already exists. Please use a different email address.' });
        }

        // 4. Generate and store verification code
        const code = generateVerificationCode();
        storeVerificationCode(email, code, {
            first_name,
            last_name,
            email,
            password,
            phone,
            dob,
            gender
        });

        // 5. Send verification email
        const emailSent = await sendVerificationEmail(email, code);
        if (!emailSent) {
            return res.status(500).json({ message: 'Failed to send verification email. Please try again.' });
        }

        res.status(200).json({
            message: 'Verification code sent to your email. Please check your inbox.',
            email: email
        });

    } catch (error) {
        console.error('Send verification failed:', error);
        res.status(500).json({ message: 'Failed to send verification code due to a server error. Please try again later.' });
    }
};

// You would typically export this function to be used in your Express routes
// module.exports = { login, register }; // If you have both in one file
module.exports = { 
    register, 
    login, 
    getUsers, 
    getUserById, 
    resendVerificationCode, 
    verifyEmailCode ,
    deleteUserByEmail,
    sendVerificationCode
};