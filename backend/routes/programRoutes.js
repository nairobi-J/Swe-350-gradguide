const express = require('express')

const router = express.Router()

const programController = require('../controllers/programController')

router.post('/create', programController.createProgram)
router.put('/update', programController.updateProgram)

router.get('/all', programController.getAllProgram)
router.get('/byID', programController.getProgramByID)
router.get('/byUniversityID', programController.getProgramByUniversityID)

router.delete('/byID', programController.deleteProgramByID)

module.exports = router