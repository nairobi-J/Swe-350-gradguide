const pool = require('../db')

const createEvent = async(req, res) =>{
   console.log(req.body)
   
    const { eventName,eventType,eventDate,eventTime,eventLocation,eventDescription,isPaid,eventPrice,registrationFields} = req.body

    try {
        const result = await pool.query(
            `
            insert into event (name, type, date, time, location, description, is_paid, price)
            values($1, $2, $3, $4, $5, $6, $7, $8)
            returning *`, [eventName, eventType, eventDate, eventTime, eventLocation, eventDescription, isPaid, eventPrice]
        )


        if(registrationFields ){

        const fieldValues = registrationFields.map(field => [
        eventId = result.rows[0].id,
        field.name,
        field.label,
        field.type,
        field.required
      ]);

             const form = await pool.query(
                `insert into event_registration_form (event_id, name, label, type, required)
                values ${registrationFields.map((_, i) =>
                    `($${i*5 +1}, $${i*5+2}, $${i*5+3}, $${i*5 + 4}, $${i*5+5})`
             ).join(', ')}
                `, fieldValues.flat()
             )

            
        }

         res.status(202).json({message: 'event created successfully'})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

const getAllEvent = async(req, res) =>{

    try {
         const result = await pool.query(
            `select * from event`
    )

    res.status(201).json(result.rows)
    } catch (error) {
         res.status(501).json({message: error.message})
    }
}

const getEventByID = async(req, res) =>{
    const {id} = req.query

    try {
         const result = await pool.query(
            `select * from event where id = $1`,[id]
    )

    res.status(201).json(result.rows)
    } catch (error) {
         res.status(501).json({message: error.message})
    }
}

const deleteEventByID = async(req, res) =>{
    const {id} = req.query

    try {
         const result = await pool.query(
            `delete from event where id = $1`,[id]
    )

    res.status(201).json({message: 'event deletion successful'})
    } catch (error) {
         res.status(501).json({message: error.message})
    }
}


const getEventRegistrationFields = async (req, res) => {
     const {event_id} = req.query

    try {
         const result = await pool.query(
            `select * from event_registration_form where event_id = $1`,[event_id]
    )

    res.status(201).json(result.rows)
    } catch (error) {
         res.status(501).json({message: error.message})
    }
}
const registerEvent = async(req, res) => {
    const {eventId, userId, form}
}


module.exports = {createEvent, getAllEvent, getEventByID, deleteEventByID, getEventRegistrationFields}