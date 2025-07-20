const express = require('express')

const router = express.Router()

const eventController = require('../controllers/eventController')
const authenticate = require('../middleware/authMiddleware')

router.post('/create',authenticate,eventController.createEvent)
router.get('/all', eventController.getAllEvent)
router.get('/byID', eventController.getEventByID)
router.get('/registration',eventController.getEventRegistrationFields)
router.delete('/byID', eventController.deleteEventByID)
router.post('/register-event', eventController.registerEvent)

module.exports = router