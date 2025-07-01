const pool = require('../db')

const addQuestion =  async (req, res) => {
    const { eventId, userId, questionText } = req.body;
    
    try {
      const result = await pool.query(
        `INSERT INTO event_query (event_id, user_id, question_text)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [eventId, userId, questionText]
      );
      
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error adding question:', error);
      res.status(500).json({ error: 'Failed to add question' });
    }
  }

  
const getEventQuestions =  async (req, res) => {
    const { eventId } = req.query;
    
    try {
    
      const questionsResult = await pool.query(
        `SELECT * FROM event_query 
         WHERE event_id = $1
         ORDER BY created_at DESC`,
        [eventId]
      );
      
      const questionsWithReplies = await Promise.all(
        questionsResult.rows.map(async (question) => {
          const repliesResult = await pool.query(
            `SELECT * FROM event_query_reply
             WHERE query_id = $1
             ORDER BY created_at ASC`,
            [question.id]
          );
          return { ...question, replies: repliesResult.rows };
        })
      );
      
      res.json(questionsWithReplies);
    } catch (error) {
      console.error('Error fetching questions:', error);
      res.status(500).json({ error: 'Failed to fetch questions' });
    }
  }

  
 const  updateQuestionStatus =  async(req, res) => {
    const { questionId } = req.query;
    const { status } = req.body;
    
    try {
      const result = await pool.query(
        `UPDATE event_query 
         SET status = $1, updated_at = NOW()
         WHERE id = $2
         RETURNING *`,
        [status, questionId]
      );
      
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Question not found' });
      }
      
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating question status:', error);
      res.status(500).json({ error: 'Failed to update question status' });
    }
  }


 
  
 const addReply =  async (req, res) => {
    const { queryId, userId, replyText } = req.body;
    
    try {
     
      const questionCheck = await pool.query(
        'SELECT id FROM event_query WHERE id = $1',
        [queryId]
      );
      
      if (questionCheck.rowCount === 0) {
        return res.status(404).json({ error: 'Question not found' });
      }
      
      const result = await pool.query(
        `INSERT INTO event_query_reply
         (query_id, user_id,  reply_text)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [queryId, userId, replyText]
      );
      
    
    //   await pool.query(
    //     `UPDATE questions 
    //      SET status = 'answered', updated_at = NOW()
    //      WHERE id = $1 AND status = 'open'`,
    //     [questionId]
    //   );
      
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error adding reply:', error);
      res.status(500).json({ error: 'Failed to add reply' });
    }
  }

  const getReplies = async(req, res) =>{
       
        const {queryId} = req.query

        try {
            const result = await pool.query(
                `select * from event_query_reply where query_id = $1`, [queryId]
            )

            res.status(201).json(result.rows)

        } catch (error) {
            res.status(501).json({error: error.message})
        }
       

  }


  module.exports = {addQuestion, getEventQuestions, updateQuestionStatus, addReply, getReplies }