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

    // Assume jsonArr is an array of objects representing the rows to be inserted
    const fields = Object.keys(jsonArr[0]).join(', ');

    // Create a placeholder string for each row
    const placeholders = jsonArr.map(() => `(${Object.keys(jsonArr[0]).map(() => '?').join(', ')})`).join(', ');

    // Flatten the values array to match the placeholder structure
    const values = jsonArr.flatMap(Object.values);

    const query = `INSERT INTO ${dbKey} (${fields}) VALUES ${placeholders}`;

    console.log('Executing query:', { query, values });

    const [result] = await db.execute(query, values);

    // For multiple rows, return all inserted rows with their respective insertIds
    const insertedRows = jsonArr.map((item, index) => ({
      ...item,
      id: result.insertId + index, // Adjust for multiple rows
    }));

    const returnVal = Array.isArray(jsonObj) ? insertedRows : insertedRows[0];

    return res.status(200).json(returnVal);
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