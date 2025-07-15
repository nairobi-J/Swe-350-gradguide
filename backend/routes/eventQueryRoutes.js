const express = require('express')

const router = express.Router()

const eventQueryController = require('../controllers/eventQueryController')

router.post('/query',eventQueryController.addQuestion)
router.post('/reply', eventQueryController.addReply)

router.get('/query',eventQueryController.getEventQuestions)
router.get('/reply',eventQueryController.getReplies)

module.exports = router