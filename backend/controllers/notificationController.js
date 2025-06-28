const pool = require('../db')

const getNotification = async(req, res)=>{
    const {id} = req.body

    try {
        const result = await pool.query(
            `
            select n.*, p.content as post_title, p.content, pr.name as program_name
            from notification n
            join post p on n.post_id = p.post_id
            join program pr on p.program_id = pr.program_id
            where n.user_id = $1
            order by n.notified_at desc
            `, [id]
        )

        res.status(201).json(result.rows || 'no notification found')
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

const readNotification = async (req, res)=>{
    const {id} = req.query

    try {
        const result = await pool.query(
            `
            update notification set is_read = true where notification_id = $1
            `,[id]
        )

        res.status(200).json({message: 'notification marked as read'})
    } catch (error) {
         res.status(500).json({error: error.message})
    }
}