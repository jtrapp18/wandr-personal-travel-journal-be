const express = require('express');
const mysql = require('mysql2/promise');

const router = express.Router();

// Database connection details through environment variable
const dbConfig = {
  uri: process.env.MYSQL_URL, // Use the Railway-provided MYSQL_URL
};

router.get('/', async (req, res) => {
  let db;

  try {
    // Establish database connection
    db = await mysql.createConnection(dbConfig.uri);

    // Query string
    const sql = `SELECT * FROM users`;
    const [rows] = await db.execute(sql);

    return res.status(200).json(rows);
  } 
  catch (error) {
    console.error('Database query error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  } 
  finally {
    if (db) {
      await db.end();
    }
  }
});

module.exports = router;