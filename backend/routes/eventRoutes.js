const express = require('express')

const router = express.Router()

const eventController = require('../controllers/eventController')
const authenticate = require('../middleware/authMiddleware')

router.post('/create', authenticate, eventController.createEvent)
router.get('/all', eventController.getAllEvent)
router.get('/byID', eventController.getEventByID)
router.delete('/byID', eventController.deleteEventByID)

module.exports = router