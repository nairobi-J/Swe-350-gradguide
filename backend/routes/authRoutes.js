const express = require('express')
const router = express.Router()

const authController = require('../controllers/authControllers')
const authenticate = require('../middleware/authMiddleware')

router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/getUsers', authController.getUsers)
router.get('/getUserById/:id', authController.getUserById)
router.post('/resend-verification', authController.resendVerificationCode)
router.post('/verify-email', authController.verifyEmailCode)

module.exports = router