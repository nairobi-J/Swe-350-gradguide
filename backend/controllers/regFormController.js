const pool = require('../db')


const getEventForm = async(req, res)=>{

     const {id} = req.query;

     try{
         const result = await pool.query(
            `select * from event_registration_form where event_id = $1`, [id]
         )

         res.status(201).json(result.rows)
     }
     catch(error){
         res.status(501).json({error: error.message})
     }

}

const submitEventFormResponse = async(req, res)=>{
    const {id} = req.query

    const{userId, responses} = req.body

    try{

        const result = await pool.query(
            `insert into event_registration_response (event_id, user_id) 
            values ($1, $2) returning id`,[id, userId]
        )

        const responseId = result.rows[0].id

        for(const [fieldName, fieldValue] of Object.entries(responses)){
            await pool.query(
                `insert into event_registration_response_data (response_id, field_name, field_value)
                values ($1, $2, $3)`, [responseId, fieldName, fieldValue]
            )
        }

        res.status(201).json({ success: true, responseId });

    }
    catch(error){
         res.status(501).json({error: error.message});
    }
}

const getEventFormResponse = async(req, res)=>{
    const {id} = req.query

    try{
        const result = await pool.query(
            `select * from event_registration_response where event_id = $1`, [id]
        )

        res.status(201).json(result.rows)
    }
    catch(error){
         res.status(501).json({error: error.message});
    }
};

const getEventFormResponseByUserId = async(req, res)=>{
    const {userId} = req.query

    try{
        const result = await pool.query(
            `select * from event_registration_response where user_id = $1`, [userId]
        )

        res.status(201).json(result.rows)
    }
    catch(error){
         res.status(501).json({error: error.message});
    }
};

// get all event details for which a user has submitted responses
const getEventsByUserResponse = async(req, res) => {
    const {userId} = req.query

    try{
        const result = await pool.query(
            `select e.* from event e
             join event_registration_response r on e.id = r.event_id
             where r.user_id = $1`, [userId]
        )

        res.status(201).json(result.rows)
    }
    catch(error){
         res.status(501).json({error: error.message});
    }
};

module.exports = {getEventForm, submitEventFormResponse, getEventFormResponse, getEventFormResponseByUserId, getEventsByUserResponse}