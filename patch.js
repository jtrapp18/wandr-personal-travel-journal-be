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
const allowedTables = ['activities', 'attendees', 'photos'];

app.patch('/update/:dbKey/:id', async (req, res) => {
  const { dbKey, id } = req.params; // Extract table name and record ID from route params

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

    // Ensure ID is explicitly included in the query
    const query = `UPDATE ${dbKey} SET ${setString} WHERE id = ?`;
    values.push(id);

    // Execute the query with sanitized input
    const [result] = await db.execute(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'No record found to update' });
    }

    return res.status(200).json({ message: 'Record updated successfully' });
  } catch (error) {
    console.error('Database query error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    if (db) await db.end();
  }
});

// Start server
const port = process.env.MYSQLPORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));