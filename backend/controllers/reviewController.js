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

  try {
    // Sanitize firmName to prevent SQL injection (though pg.query handles basic injection with parameterized queries)
    const sanitizedFirmName = decodeURIComponent(firmName);

    
    const reviewsQuery = 'SELECT * FROM reviews WHERE firm = $1';
    const { rows: reviews } = await pool.query(reviewsQuery, [sanitizedFirmName]);

    if (reviews.length === 0) {
      return res.status(404).json({ message: 'Company not found or no reviews.' });
    }

   
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
        COUNT(CASE WHEN outlook = 'x' THEN 1 END) AS outlook_negative
      FROM reviews
      WHERE firm = $1
      GROUP BY firm;
    `;
    const { rows: statsRows } = await pool.query(statsQuery, [sanitizedFirmName]);
    const statistics = statsRows[0]; // Should only be one row

    res.json({
      firm: sanitizedFirmName,
      statistics: statistics,
      reviews: reviews, // All individual reviews
    });

  } catch (err) {
    console.error(`Error fetching details for ${firmName}:`, err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = { getAvgReview, getReviewByFirm };
