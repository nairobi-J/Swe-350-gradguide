const pool = require('../db')



const getAllUniversities = async(req, res)=>{

    const{page=1, limit=20, country, search} = req.query

    const offset = (page-1)*limit

    try {

        let query = 'SELECT * FROM universities'
        const params = []
        let conditions = []

        if(country){
            conditions.push(`country ILIKE $${params.length + 1}`)
            params.push(`%${country}%`)
        }

         if (search) {
       conditions.push(`name ILIKE $${params.length + 1}`);
       params.push(`%${search}%`);
    }

     if(conditions.length){
          query += ` WHERE ${conditions.join(' AND ')}`
     }


     query += ` ORDER BY name LIMIT $${params.length+1} OFFSET $${params.length + 2}`

     params.push(limit, offset)

     const result = await pool.query(query, params)

     res.json({
        data: result.rows,
        page: parseInt(page),
        limit: parseInt(limit)
     })
        
    } catch (error) {
        console.error('Error fetching universities:', error);
    res.status(500).json({ error: 'Database error' });
    }

}


module.exports ={getAllUniversities}