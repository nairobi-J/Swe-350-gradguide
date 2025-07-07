const pool = require('../db')



const postEventFeedback =   async (req, res) => {
    const { eventId, userId, comment } = req.body;
    
    try {
      const result = await pool.query(
        `INSERT INTO event_feedback (event_id, user_id, comment)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [eventId, userId, comment]
      );
      
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error adding feedback:', error);
      res.status(500).json({ error: 'Failed to add feedback' });
    }
  }

const  getEventFeedback =  async(req, res) => {
    const { eventId } = req.query;
    
    try {
      const result = await pool.query(
        `SELECT * FROM event_feedback 
         WHERE event_id = $1
         ORDER BY created_at DESC`,
        [eventId]
      );
      
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      res.status(500).json({ error: 'Failed to fetch feedback' });
    }
  }

  module.exports = {postEventFeedback, getEventFeedback}