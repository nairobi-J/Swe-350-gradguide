const express = require('express')
const router = express.Router()

const authController = require('../controllers/authControllers')
const authenticate = require('../middleware/authMiddleware')

router.post('/register', authController.register)
router.post('/login', authController.login)
module.exports = router