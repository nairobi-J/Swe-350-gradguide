const pool = require('../db')

const createProgram = async(req, res)=>{

    try {
    const {university_id, name, degree_type, field_of_study, duration, tuition_fee, deadline} = req.body;

    const result = await pool.query(
        `
        insert into program (
        university_id, name, degree_type, field_of_study, duration, tuition_fee, deadline)
        VALUES($1, $2, $3, $4, $5, $6, $7) returning *
        `
        , [university_id, name, degree_type, field_of_study, duration, tuition_fee, deadline]
    );

    res.status(200).json(result.rows[0])
    } catch (err) {
        res.status(500).json({error: err.message})
    }

}