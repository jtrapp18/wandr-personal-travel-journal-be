const express = require('express');
const mysql = require('mysql2/promise');

const router = express.Router();
router.use(express.json());

// Database connection details through environment variable
const dbConfig = {
  uri: process.env.MYSQL_URL,
};

// List of allowed database tables
const allowedTables = ['users', 'activities', 'attendees', 'photos', 'trips'];

router.post('/:dbKey', async (req, res) => {
  const { dbKey } = req.params;
  const jsonObj = req.body;
  const jsonArr = Array.isArray(jsonObj) ? jsonObj : [jsonObj];

  // Validate database table key
  if (!allowedTables.includes(dbKey)) {
    return res.status(400).json({ error: 'Invalid database table' });
  }

  // Check database connection string
  if (!dbConfig.uri) {
    console.error('Missing database connection string');
    return res.status(500).json({ error: 'Server misconfiguration' });
  }

  let db;
  try {
    db = await mysql.createConnection(dbConfig.uri);

    // Dynamically build the query for insertion
    const fields = Object.keys(jsonArr[0]).join(', ');
    const placeholders = jsonArr
    .map(() => `(${Object.keys(jsonArr[0]).map(() => '?').join(', ')})`).join(', ');
    // const values = jsonArr.flatMap(Object.values);
    const values = jsonArr.map(Object.values)

    const query = `INSERT INTO ${dbKey} (${fields}) VALUES (${placeholders})`;

    console.log('Executing query:', { query, values });

    const [result] = await db.execute(query, values);

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error during query execution:', error);

    // Return the actual database error for debugging
    return res.status(500).json({ error: error.message });
  } finally {
    if (db) {
      await db.end();
    }
  }
});

module.exports = router;