const pool = require('../db')

const getAllPost = async(req, res) =>{
    try{
        const result = await pool.query(
            `
            select * from post
            `
           
        )

        if(result.rows.length === 0){
            res.status(404).json({error: 'no program found'})
        }

         res.status(200).json(result.rows)
    }
    catch(error){
        res.status(500).json({error: error.message})
    }
}

const getPostByID = async(req, res) =>{
    const {id} = req.query;
    try{
        const result = await pool.query(
            `
            select * from post where post_id = $1 
            `
           ,[id]
        )

        if(result.rows.length === 0){
            res.status(404).json({error: 'no post found'})
        }

         res.status(200).json(result.rows)
    }
    catch(error){
        res.status(500).json({error: error.message})
    }
}

const getPostByProgramID = async (req, res) =>{
    const {id} = req.query

    try {
        const result = await pool.query(
            `
            select * from post where program_id = $1
            `
            ,[id]
        )

        if(result.rows.length === 0){
            res.status(404).json({error: 'no program found for that university'})
        }

        res.status(200).json(result.rows)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

const createPost= async(req, res)=>{

     const {program_id, title, content, post_type, is_important} = req.body;

    try {
   

    const result = await pool.query(
        `
        insert into post
        (program_id, title, content, post_type, is_important)
        VALUES($1, $2, $3, $4, $5) returning *
        `, [program_id, title, content, post_type, is_important]
    );

    res.status(200).json(result.rows[0])
    } catch (err) {
        res.status(500).json({error: err.message})
    }

}

const updatePost = async(req, res)=>{

    try {
        const {id} = req.query
    const {program_id, title, content, post_type, is_important}
    = req.body

    const result = await pool.query(
        `
        UPDATE post SET program_id = $1, title = $2, content = $3, post_type =$4, is_important =$5
        WHERE post_id = $6 RETURNING *
        `
        ,[program_id, title, content, post_type, is_important, id]
    )

    if(result.rows.length === 0){
        res.status(404).json({error: 'program not found'})
    }

    res.status(200).json(result.rows[0])
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

const deletePostByID = async (req, res) =>{
    const {id} = req.query

    try {
        const result = await pool.query(
            `
            delete from post where post_id = $1 returning *
            `
            ,[id]
        )

        res.status(200).json(result.rows[0])
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}


module.exports = {getAllPost, getPostByID, getPostByProgramID, createPost, updatePost, deletePostByID}