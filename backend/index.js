const express = require('express')
const cors = require('cors')
require('dotenv').config()
const pool = require('./db')

const app = express()

const PORT = process.env.POOL || 5000

app.use(cors())

app.use(express.json());
app.post('/users', async(req, res) => {
    const {name,email} = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO users (name,email) VALUES ($1, $2) RETURNING *',
            [name, email]
        );  res.status(201).json(result.rows[0]);
    } catch(error) {
         console.error('Insert failed:', error);
          res.status(500).json({ error: 'Database insert failed' });
    }
})
app.listen(PORT, ()=>{
     console.log(`Server running on http://localhost:${PORT}`);
})
