const express = require('express')
const cors = require('cors')
require('dotenv').config()
const pool = require('./db')

const app = express()

const PORT = process.env.POOL || 5000

app.use(cors())

const authRoutes = require('./routes/authRoutes')
const universityRoutes = require('./routes/universityRouter')
const universityProgramsRoutes = require('./routes/universityProgramsRouter')
const postRoutes = require('./routes/postRoutes')
const programRoutes = require('./routes/programRoutes')
const favoritesRoutes = require('./routes/favoritesRoutes')
const eventRoutes = require('./routes/eventRoutes')
const regFormRoutes = require('./routes/regFormRoutes')
const eventFeedbackRoutes = require('./routes/eventFeedbackRoutes')
const eventQueryRoutes = require('./routes/eventQueryRoutes')

app.use(express.json());
// app.post('/users', async (req, res) => {
//     const { first_name, last_name, email, password, phone, dob, gender } = req.body;
    
//     // Basic validation
//     if (!first_name || !last_name || !email || !password) {
//         return res.status(400).json({ error: 'Missing required fields' });
//     }

//     try {
//         const result = await pool.query(
//             `INSERT INTO users 
//              (first_name, last_name, email, password, phone, dob, gender, agree_terms) 
//              VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
//              RETURNING *`,
//             [first_name, last_name, email, password, phone, dob, gender, false]
//         );
        
//         res.status(201).json(result.rows[0]);
//     } catch (error) {
//         console.error('Insert failed:', error);
        
//         // Handle duplicate email error specifically
//         if (error.code === '23505') { // PostgreSQL unique violation
//             return res.status(409).json({ error: 'Email already exists' });
//         }
        
//         res.status(500).json({ error: 'Database insert failed' });
//     }
// });
app.use('/auth', authRoutes)
app.use('/uni', universityRoutes)
app.use('/uni/programs', universityProgramsRoutes)
app.use('/post', postRoutes)
app.use('/program', programRoutes)
app.use('/favorites', favoritesRoutes)
app.use('/event', eventRoutes)
app.use('/regform',regFormRoutes)
app.use('/eventFeedback', eventFeedbackRoutes)
app.use('/eventQuery', eventQueryRoutes)


app.post('/auth', authRoutes)
app.get('/uni', universityRoutes)
app.get('/uni/programs', universityProgramsRoutes)

app.listen(PORT, ()=>{
     console.log(`Server running on http://localhost:${PORT}`);
})
