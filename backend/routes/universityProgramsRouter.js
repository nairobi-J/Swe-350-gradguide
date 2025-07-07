const express = require('express');
const router = express.Router();
const universityProgramsController = require('../controllers/universityProgramsController');


router.get('/get', universityProgramsController.getAllUniversityPrograms);

router.get('/count', universityProgramsController.getUniversityCount);


router.get('/programs', universityProgramsController.getProgramsCount);
router.get('/countries', universityProgramsController.getCountries);

module.exports = router;