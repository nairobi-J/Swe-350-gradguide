const express = require('express');
const router = express.Router();

const reviewController = require('../controllers/reviewController');

router.get('/avg-review', reviewController.getAvgReview);
router.get('/review-by-firm', reviewController.getReviewByFirm);

module.exports = router;