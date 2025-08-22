const express = require('express')

const router = express.Router()

const eventQueryController = require('../controllers/eventQueryController')
const authenticate = require('../middleware/authMiddleware')

router.post('/query', authenticate, eventQueryController.addQuestion)
router.post('/reply', eventQueryController.addReply)

router.get('/query',eventQueryController.getEventQuestions)
router.get('/reply',eventQueryController.getReplies)

router.delete('/query/:questionId', authenticate, eventQueryController.deleteQuestion)

module.exports = router