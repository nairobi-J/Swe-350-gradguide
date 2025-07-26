const pool = require('../db');

const getAvgReview = async (req, res) => {
    try {
    const query = `
      SELECT
        firm,
        ROUND(AVG(overall_rating), 1) AS avg_overall_rating
      FROM reviews
      GROUP BY firm
      ORDER BY firm;
    `;
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching companies:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const getReviewByFirm = async (req, res) => {
    const { firmName } = req.query;
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to 10 reviews per page
  const offset = (page - 1) * limit;

  try {
    const sanitizedFirmName = decodeURIComponent(firmName);

    // Fetch aggregated statistics (still full for simplicity and small size)
    const statsQuery = `
      SELECT
        firm,
        ROUND(AVG(overall_rating), 1) AS avg_overall_rating,
        ROUND(AVG(work_life_balance), 1) AS avg_work_life_balance,
        ROUND(AVG(culture_values), 1) AS avg_culture_values,
        ROUND(AVG(diversity_inclusion), 1) AS avg_diversity_inclusion,
        ROUND(AVG(career_opp), 1) AS avg_career_opp,
        ROUND(AVG(comp_benefits), 1) AS avg_comp_benefits,
        ROUND(AVG(senior_mgmt), 1) AS avg_senior_mgmt,
        COUNT(CASE WHEN recommend = 'o' THEN 1 END) AS recommend_yes,
        COUNT(CASE WHEN recommend = 'x' THEN 1 END) AS recommend_no,
        COUNT(CASE WHEN recommend = 'v' THEN 1 END) AS recommend_mixed,
        COUNT(CASE WHEN ceo_approv = 'o' THEN 1 END) AS ceo_approv_yes,
        COUNT(CASE WHEN ceo_approv = 'x' THEN 1 END) AS ceo_approv_no,
        COUNT(CASE WHEN ceo_approv = 'v' THEN 1 END) AS ceo_approv_mixed,
        COUNT(CASE WHEN outlook = 'v' THEN 1 END) AS outlook_positive,
        COUNT(CASE WHEN outlook = 'r' THEN 1 END) AS outlook_neutral,
        COUNT(CASE WHEN outlook = 'x' THEN 1 END) AS outlook_negative,
        COUNT(*) AS total_reviews_count -- Get total count for pagination info
      FROM reviews
      WHERE firm = $1
      GROUP BY firm;
    `;
    const { rows: statsRows } = await pool.query(statsQuery, [sanitizedFirmName]);

    if (statsRows.length === 0) {
      return res.status(404).json({ message: 'Company not found or no reviews.' });
    }
    const statistics = statsRows[0];
    const totalReviews = parseInt(statistics.total_reviews_count); // Ensure it's a number

    // Fetch paginated reviews for the firm
    const paginatedReviewsQuery = `
      SELECT *
      FROM reviews
      WHERE firm = $1
      ORDER BY date_review DESC, id DESC -- Order by date and then id for consistent pagination
      LIMIT $2 OFFSET $3;
    `;
    const { rows: reviews } = await pool.query(paginatedReviewsQuery, [sanitizedFirmName, limit, offset]);

    res.json({
      firm: sanitizedFirmName,
      statistics: statistics,
      reviews: reviews, // Only the reviews for the current page
      pagination: {
        currentPage: page,
        limit: limit,
        totalReviews: totalReviews,
        totalPages: Math.ceil(totalReviews / limit),
      },
    });

  } catch (err) {
    console.error(`Error fetching details for ${firmName}:`, err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = { getAvgReview, getReviewByFirm };
