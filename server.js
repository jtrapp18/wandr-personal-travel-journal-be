const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const port = process.env.PORT || 3000;

// Database connection details through environment variable
const dbConfig = {
  uri: process.env.MYSQL_URL, // Use the Railway-provided MYSQL_URL
};

app.get('/user-data', async (req, res) => {
  let db;
  const userId = req.query.userId; // Extract userId safely

  try {
    // Create database connection
    db = await mysql.createConnection(dbConfig.uri);

    // Query string
    const sql = `
      SELECT * 
      FROM users
      INNER JOIN trips ON users.id = trips.user_id
      LEFT JOIN activities ON trips.id = activities.trip_id
      LEFT JOIN attendees ON trips.id = attendees.trip_id
      LEFT JOIN photos ON trips.id = photos.trip_id
      WHERE users.id = ?
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

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
