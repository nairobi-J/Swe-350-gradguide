const express = require('express');
const router = express.Router();
const universityProgramsController = require('../controllers/universityProgramsController');


router.get('/get', universityProgramsController.getAllUniversityPrograms);


module.exports = router;