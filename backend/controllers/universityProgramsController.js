const pool = require('../db')


const getAllUniversityPrograms = async(req, res) => {
    const{page=2, limit = 20, country} = req.query
    const offset = (page- 1)*limit;
    try{
        let query = 'SELECT * FROM university_programs'
        const params = []
        let conditions = []

       
        query += ` ORDER BY "SCHOOL" LIMIT $${params.length + 1} OFFSET $${params.length + 2}`



        params.push(limit,offset)


        const result = await pool.query(query, params)


        res.json({
            data: result.rows,
            page: parseInt(page),
            limit: parseInt(limit)
        })
    }
   catch (err) { // <--- It should be 'err' or 'e' here
        console.error('Error fetching university programs:', err); // <-- THIS IS THE PROBLEM LINE
        res.status(500).json({ error: 'Failed to fetch university programs' });
    }
}


module.exports = { getAllUniversityPrograms };