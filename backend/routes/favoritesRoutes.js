const express = require('express')

const router = express.Router()
const favoritesController = require('../controllers/favoriteController')

router.post('/create', favoritesController.createFavorite)
router.delete('/byID', favoritesController.deleteFavorite)
router.get('/byID', favoritesController.getFavorites)


module.exports = router
