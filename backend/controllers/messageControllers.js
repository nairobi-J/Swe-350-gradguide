const pool = require('../db')
const sendMessage = async(req, res) => {
    console.log(req.body)
    const {user1, user2, sender, text} = req.body;
    //const userId = req.user.id;
    try {
        const result = await pool.query(`insert into messages(user1_id, user2_id, sender_id, message_text, created_at) 
            values($1, $2, $3, $4, NOW()) returning id`, [user1, user2, sender, text]
        )
        
         res.status(202).json({message: 'msg send successfully'})
    }catch(error){
            res.status(501).json({error : error.message});
    }
}
const getAllMessage = async (req, res) => {
    const { userId, selectedUser } = req.body;
    
    try {
        const result = await pool.query(`
            SELECT * FROM messages 
            WHERE (messages.user1_id = $1 AND messages.user2_id = $2)
               OR (messages.user1_id = $2 AND messages.user2_id = $1)
            ORDER BY messages.created_at ASC
        `, [userId, selectedUser]);
        
        res.status(200).json({
            message: 'loaded conversation',
            data: result.rows
        });
        
    } catch (error) {
        res.status(500).json({ error: error.message }); // 500 for server errors
    }
};
module.exports = {sendMessage, getAllMessage};