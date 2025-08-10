const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
const pool = require('../db'); // Your database connection pool

const register = async (req, res) => {
    const { first_name, last_name, email, password, phone, dob, gender } = req.body;
    console.log(`Attempting registration for email: ${email}`); // Improved logging

    // 1. Basic validation for required fields
    if (!first_name || !last_name || !email || !password) {
        // Return a 400 Bad Request if essential fields are missing
        return res.status(400).json({ message: 'Missing required fields: first name, last name, email, and password are required.' });
    }

    try {
        // 2. Hash the password before storing it
        const hashpass = await bcrypt.hash(password, 10);

        // 3. Attempt to insert the new user into the database
        // It's good practice to add `RETURNING *` or `RETURNING id` if you need the inserted row's data
        const result = await pool.query(
            `INSERT INTO users 
             (first_name, last_name, email, password, phone, dob, gender, agree_terms) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
             RETURNING id, email`, // Returning id and email of the newly created user
            [first_name, last_name, email, hashpass, phone, dob, gender, false]
        );

        // 4. If insertion is successful, return a 201 Created status with a success message
        // You can include some basic user info like ID or email if useful for the frontend
        res.status(201).json({
            message: 'Registration successful!',
            user: {
                id: result.rows[0].id,
                email: result.rows[0].email
            }
        });

    } catch (error) {
        console.error('Registration failed:', error); // Log the full error for server-side debugging

        // 5. Handle duplicate email error (PostgreSQL unique violation)
        if (error.code === '23505') {
            // Send a 409 Conflict status for duplicate resources
            return res.status(409).json({ message: 'Email already exists. Please use a different email address.' });
        }
        
        // 6. Handle any other unexpected database errors
        // Send a 500 Internal Server Error for unhandled server-side issues
        res.status(500).json({ message: 'Registration failed due to a server error. Please try again later.' });
    }
};



const login = async (req, res) => {
    const { email, password } = req.body;
    console.log(`Attempting login for email: ${email}`); // Improved logging

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
            token: token, // Include the JWT token in the response
            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Login failed:', error); // Log the full error for server-side debugging

        // 7. Handle any unexpected server errors
        res.status(500).json({ message: 'Login failed due to a server error. Please try again later.' });
    }
};



module.exports = { register, login };