const express = require('express')
const cors = require('cors')
require('dotenv').config()
const pool = require('./db')

const app = express()

const PORT = process.env.POOL || 5000

app.use(cors())

app.use(express.json());
app.post('/users', async (req, res) => {
    const { first_name, last_name, email, password, phone, dob, gender } = req.body;
    
    // Basic validation
    if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO users 
             (first_name, last_name, email, password, phone, dob, gender, agree_terms) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
             RETURNING *`,
            [first_name, last_name, email, password, phone, dob, gender, false]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Insert failed:', error);
        
        // Handle duplicate email error specifically
        if (error.code === '23505') { // PostgreSQL unique violation
            return res.status(409).json({ error: 'Email already exists' });
        }
        
        res.status(500).json({ error: 'Database insert failed' });
    }
});
app.listen(PORT, ()=>{
     console.log(`Server running on http://localhost:${PORT}`);
})
