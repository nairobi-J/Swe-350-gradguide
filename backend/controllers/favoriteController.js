const pool = require('../db')

const createFavorite = async(req, res)=>{

    const {user_id, program_id} = req.body;

    try {
        const result = await pool.query(
            `
            insert into favorites (user_id, program_id)
            values($1, $2)
            on conflict(user_id, program_id)
            do nothing returning *
            `, [user_id, program_id]
        )

        res.status(201).json(result.rows[0] || {message: 'already favorited!'})
    } catch (error) {
        res.status(500).json({error: error.message})
    }

}

const deleteFavorite = async (req, res) =>{
    const {user_id, program_id} = req.body

    try {
        const result = await pool.query(
            `
            delete from favorites where user_id = $1 and program_id = $2
            `, [user_id, program_id]
        )

        res.status(202).json({message: 'deleted successfully!'})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

const getFavorites = async (req, res) =>{
    const {id} = req.query

    try {
        const result = await pool.query(
            `
            select f.*, p.name as program_name, u.name as university_name from favorites f
            join program p on f.program_id = p.program_id
            join universities u on p.university_id = u.id
            where f.user_id = $1
            `, [id]
        )

        res.status(201).json(result.rows)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

module.exports = {createFavorite, deleteFavorite, getFavorites}