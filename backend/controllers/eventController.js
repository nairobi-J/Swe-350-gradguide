const pool = require('../db')

const createEvent = async(req, res) =>{
   console.log(req.body)
   
    const { eventName,eventType,eventDate,eventTime,eventLocation,eventDescription,isPaid,eventPrice,registrationFields} = req.body
    const userId = req.user.id

    console.log('User ID:', userId);

    try {
        const result = await pool.query(
            `
            insert into event ( user_id, name, type, date, time, location, description, is_paid, price)
            values($1, $2, $3, $4, $5, $6, $7, $8, $9)
            returning *`, [userId, eventName, eventType, eventDate, eventTime, eventLocation, eventDescription, isPaid, eventPrice]
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
// Example: In your backend controller file (e.g., eventController.js)

// Handles registration submission
const registerEvent = async(req, res) => {
    const { eventId, userId, formData } = req.body; 

    try {
        await pool.query('BEGIN'); // Start transaction

        // Insert into event_registration_response (summary table)
        const responseResult = await pool.query(
            `INSERT INTO event_registration_response (event_id, user_id, created_at)
             VALUES ($1, $2, NOW())
             RETURNING id`, 
            [eventId, userId]
        );
        const registrationResponseId = responseResult.rows[0].id; // This is your response_id

        // Prepare and insert individual field responses into event_registration_response_data (detail table)
        const dataInserts = [];
        const dataValues = [];
        let paramIndex = 1;

        for (const fieldName in formData) {
            if (Object.prototype.hasOwnProperty.call(formData, fieldName)) {
                const fieldValue = formData[fieldName];
                dataInserts.push(`($${paramIndex++}, $${paramIndex++}, $${paramIndex++})`);
                dataValues.push(registrationResponseId, fieldName, fieldValue);
            }
        }

        if (dataInserts.length > 0) {
            await pool.query(
                `INSERT INTO event_registration_response_data (response_id, field_name, field_value)
                 VALUES ${dataInserts.join(', ')}`,
                dataValues
            );
        }

        await pool.query('COMMIT'); // Commit transaction

        res.status(201).json({ message: 'Registration submitted successfully!', registrationId: registrationResponseId });

    } catch (error) {
        await pool.query('ROLLBACK'); // Rollback on error
        console.error('Error submitting registration:', error.message);
        res.status(500).json({ error: 'Failed to submit registration. Please try again.' });
    }
};

// Ensure this route is set up in your eventRoutes:
// router.post('/register-event', registerEvent);


module.exports = {createEvent, getAllEvent, getEventByID, deleteEventByID, getEventRegistrationFields, registerEvent}