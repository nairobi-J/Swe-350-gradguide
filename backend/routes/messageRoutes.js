const express = require('express')
const router = express.Router();
const {sendMessage, getAllMessage} = require('../controllers/messageControllers') 

router.post('/send', sendMessage )
router.post('/get-convo', getAllMessage)

module.exports = router

