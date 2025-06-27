const pool = require('../db')

const getAllProgram = async(req, res) =>{
    try{
        const result = await pool.query(
            `
            select * from program
            `
           
        )

        if(result.rows.length === 0){
            res.status(404).json({error: 'no program found'})
        }

         res.status(200).json(result.rows[0])
    }
    catch(error){
        res.status(500).json({error: error.message})
    }
}

const getProgramByID = async(req, res) =>{
    const {id} = req.params;
    try{
        const result = await pool.query(
            `
            select * from program where program_id = $1 
            `
           ,[id]
        )

        if(result.rows.length === 0){
            res.status(404).json({error: 'no post found'})
        }

         res.status(200).json(result.rows[0])
    }
    catch(error){
        res.status(500).json({error: error.message})
    }
}

const getProgramByUniversityID = async (req, res) =>{
    const {id} = req.params

    try {
        const result = await pool.query(
            `
            select * from program where university_id = $1
            `
            ,[id]
        )

        if(result.rows.length === 0){
            res.status(404).json({error: 'no program found for that university'})
        }

        res.status(200).json(result.rows[0])
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

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

const updateProgram = async(req, res)=>{

    try {
        const {id} = req.params
    const {university_id, name, degree_type, field_of_study, duration, tuition_fee, deadline}
    = req.body

    const result = await pool.query(
        `
        UPDATE program SET university_id = $1, name = $2, degree_type = $3, field_of_study = $4, 
        duration = $5, tuition_fee = $6, deadline = $7 WHERE program_id = $8 RETURNING *
        `
        ,[university_id, name, degree_type, field_of_study, duration, tuition_fee, deadline, id]
    )

    if(result.rows.length === 0){
        res.status(404).json({error: 'program not found'})
    }

    res.status(200).json(res.rows[0])
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

const deleteProgramByID = async (req, res) =>{
    const {id} = req.params

    try {
        const result = await pool.query(
            `
            delete from program where program_id = $1 returning *
            `
            ,[id]
        )
    } catch (error) {
        
    }
}

module.exports={createProgram, updateProgram, getAllProgram, getProgramByID, getProgramByUniversityID, deleteProgramByID}