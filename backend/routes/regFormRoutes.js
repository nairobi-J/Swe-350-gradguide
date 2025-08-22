const express = require('express')

const router = express.Router()

const regFormController = require('../controllers/regFormController')

router.get('/byEvent', regFormController.getEventForm)

router.post('/submit', regFormController.submitEventFormResponse)

router.get('/responses', regFormController.getEventFormResponse)
router.get('/responseByUser', regFormController.getEventFormResponseByUserId)

module.exports = router