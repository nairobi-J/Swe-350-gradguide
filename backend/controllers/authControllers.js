const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const pool = require('../db')


const register = async(req, res)=>{
     const { first_name, last_name, email, password, phone, dob, gender } = req.body;
     console.log(email)


         if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }


    const hashpass = await bcrypt.hash(password, 10)


    try {
        const result = await pool.query(
              `INSERT INTO users 
             (first_name, last_name, email, password, phone, dob, gender, agree_terms) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) `,
            [first_name, last_name, email, hashpass, phone, dob, gender, false]
        )

        res.status(201).json( result.rows[0])
    } catch (error) {
         console.error('Insert failed:', error);
        
        // duplicate email error
        if (error.code === '23505') { // PostgreSQL unique violation
            return res.status(409).json({ error: 'Email already exists' });
        }
        
        res.status(500).json({ error: 'Database insert failed' });
    }

}



module.exports={register}
