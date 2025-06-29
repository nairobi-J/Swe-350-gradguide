const express = require('express')

const router = express.Router()

const eventController = require('../controllers/eventController')

router.post('/create',eventController.createEvent)

module.exports = router