const express = require('express')
const router = express.Router()

const postController = require('../controllers/postController')

router.post('/create', postController.createPost)
router.put('/update', postController.updatePost)

router.get('/all', postController.getAllPost)
router.get('/byID', postController.getPostByID)
router.get('/byProgramID', postController.getPostByProgramID)

router.delete('/byID', postController.deletePostByID)

module.exports = router