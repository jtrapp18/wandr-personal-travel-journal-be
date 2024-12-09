const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Database connection details through environment variable
const dbConfig = {
  uri: process.env.MYSQL_URL,
};

// POST endpoint with dynamic dbKey routing
app.post('/new/:dbKey', async (req, res) => {
  const { dbKey } = req.params;
  const jsonObj = req.body;

  let db;
  try {
    db = await mysql.createConnection(dbConfig.uri);

    // Dynamically build table name and query
    const tableKeys = ['users', 'activities', 'attendees', 'photos', 'trips']; // List of allowed table names
    if (!tableKeys.includes(dbKey)) {
      return res.status(400).json({ error: 'Invalid database table' });
    }

    const fields = Object.keys(jsonObj).join(', ');
    const values = Object.values(jsonObj);
    const placeholders = values.map(() => '?').join(', ');

    const query = `INSERT INTO ${dbKey} (${fields}) VALUES (${placeholders})`;

    await db.execute(query, values);

    res.status(200).json({ message: 'Data inserted successfully' });
  } catch (error) {
    console.error('Error during query execution:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    if (db) await db.end();
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});