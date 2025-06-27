const express = require('express')
const router = express.Router()
const universityController = require('../controllers/universityController') 

router.get('/get', universityController.getAllUniversities)



module.exports = router