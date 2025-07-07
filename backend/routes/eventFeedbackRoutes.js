const express = require('express')

const router = express.Router()

const eventFeedbackController = require('../controllers/eventFeedbackController')

router.post('/', eventFeedbackController.postEventFeedback)
router.get('/byEvent', eventFeedbackController.getEventFeedback)

module.exports = router