const express = require('express')
const router = express.Router()
const interviewController = require('../controllers/interviewController')

router.post('/generateQuestions', interviewController.getInterviewQuestions);
router.post('/evaluateAnswers', interviewController.evaluateAnswer);

module.exports = router;