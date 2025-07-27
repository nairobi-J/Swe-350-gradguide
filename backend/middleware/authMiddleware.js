const jwt = require('jsonwebtoken');
const pool = require('../db');

const authenticate = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get more user info for tracking
    const userResult = await pool.query(
      'SELECT id, first_name, last_name, email FROM users WHERE id = $1', 
      [decoded.userId]
    );
    
    if (userResult.rows.length === 0) {
      throw new Error("User not found");
    }

    // Attach full user info to the request
    req.user = userResult.rows[0];
    
    // Log the activity (you can store this in a database if needed)
    console.log(`User activity: ${req.user.email} accessed ${req.method} ${req.originalUrl}`);
    
    next();
  } catch (err) {
    console.error('Authentication error:', err.message);
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = authenticate;