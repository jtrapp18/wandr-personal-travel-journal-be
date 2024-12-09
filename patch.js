const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const dbConfig = {
  uri: process.env.MYSQL_URL, // Use environment variable for DB connection
};

// Whitelist of allowed tables
const allowedTables = ['users', 'trips', 'activities', 'attendees', 'photos'];

app.patch('/update/:dbKey', async (req, res) => {
  const { dbKey } = req.params;

  // Validate if the table is allowed
  if (!allowedTables.includes(dbKey)) {
    return res.status(400).json({ error: 'Invalid table key' });
  }

  let db;
  try {
    db = await mysql.createConnection(dbConfig.uri);

    // Dynamically build the query
    const fieldsToUpdate = req.body;
    const setString = Object.keys(fieldsToUpdate)
      .map((key) => `${key} = ?`)
      .join(', ');

    const values = Object.values(fieldsToUpdate);

    // Dynamically identify which record to patch based on an ID key
    if (!req.body.id) {
      return res.status(400).json({ error: 'ID is required for updates' });
    }

    const query = `UPDATE ${dbKey} SET ${setString} WHERE id = ?`;
    values.push(req.body.id); // Add the record ID to the query values

    await db.execute(query, values);

    return res.status(200).json({ message: 'Record updated successfully' });
  } catch (error) {
    console.error('Database query error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    if (db) await db.end();
  }
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));