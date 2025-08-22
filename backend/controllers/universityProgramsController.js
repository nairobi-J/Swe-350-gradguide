const pool = require('../db'); // Adjust path if needed
//console.log('Pool in controller:', pool && typeof pool.query);
const getAllUniversityPrograms = async (req, res) => {
    const { page=1, limit=100, country } = req.query;
    const offset = (page - 1) * limit;
    
    try {
        let query = 'SELECT * FROM merged_university_programs';
        const params = [];
        
        if (country) {
            query += ' WHERE country = $1';
            params.push(country);
        }
        
        query += ` ORDER BY university LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limit, offset);

        const result = await pool.query(query, params);
        
        res.json({
            data: result.rows,
            page: parseInt(page),
            limit: parseInt(limit)
        });
    } catch (err) {
        console.error('Error fetching university programs:', err);
        res.status(500).json({ error: 'Failed to fetch university programs' });
    }
};

// ... keep other functions exactly as they are ...
const getUniversityCount = async(req, res)=>{


    try{
         const result = await pool.query('SELECT COUNT(DISTINCT university) AS unique_uni FROM merged_university_programs');
          res.json({count : parseInt(result.rows[0].unique_uni, 10)});

    } catch(err){
         console.error('Error fetching unique university count:', err);
        res.status(500).json({ error: 'Failed to fetch unique university count' });
    }
   

        
    
}

const getProgramsCount = async(req, res) => {
       try{
            const result = await pool.query('SELECT COUNT(DISTINCT "program") AS unique_program FROM merged_university_programs');
            res.json({count: parseInt(result.rows[0].unique_program, 10)});
       } catch(err){
         console.error('Error fetching unique programs count:', err);
        res.status(500).json({ error: 'Failed to fetch unique programs count' });
    }
}


const getCountries = async(req, res) => {
     try{
            const result = await pool.query('SELECT COUNT(DISTINCT "country") AS unique_country FROM merged_university_programs');
            res.json({count: parseInt(result.rows[0].unique_country, 10)});
       } catch(err){
         console.error('Error fetching unique country count:', err);
        res.status(500).json({ error: 'Failed to fetch unique country count' });
    }

}


module.exports = { getAllUniversityPrograms, getUniversityCount, getProgramsCount, getCountries };