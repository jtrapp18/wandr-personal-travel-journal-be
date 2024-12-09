const express = require('express');
const mysql = require('mysql2/promise');

const router = express.Router();

// Database connection details through environment variable
const dbConfig = {
  uri: process.env.MYSQL_URL, // Use the Railway-provided MYSQL_URL
};

router.get('/trips', async (req, res) => {
  let db;
  const userId = req.query.userId; // Extract userId safely

  try {
    // Create database connection
    db = await mysql.createConnection(dbConfig.uri);

    // Query string
    const sql = `
      SELECT 
        trips.id AS trip_id,
        trips.trip_location,
        trips.trip_description,
        trips.image,
        trips.start_date,
        trips.end_date,
        trips.review_title,
        trips.rating,
        trips.review_description,
        GROUP_CONCAT(DISTINCT attendees.attendee_name) AS attendees,
        GROUP_CONCAT(DISTINCT photos.photo_url) AS photos
      FROM trips
      LEFT JOIN attendees ON trips.id = attendees.trip_id
      LEFT JOIN photos ON trips.id = photos.trip_id
      WHERE trips.user_id = ?
      GROUP BY trips.id;
    `;

    const [rows] = await db.execute(sql, [userId]);

    return res.status(200).json(rows);
  } catch (error) {
    console.error('Database query error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (db) {
      await db.end();
    }
  }
});

module.exports = router;