const express = require('express');
const mysql = require('mysql2/promise');

const router = express.Router();
router.use(express.json());

// Database connection configuration from environment variables
const dbConfig = {
  uri: process.env.MYSQL_URL, // Environment variable for database connection
};

// Whitelist of allowed tables
const allowedTables = ['users', 'activities', 'attendees', 'photos', 'trips'];

router.patch('/:dbKey/:id', async (req, res) => {
  const { dbKey, id } = req.params; // Extract table name and record ID from route params
  console.log('Received PATCH request:', { dbKey, id, body: req.body });

  // Validate if the table name is allowed
  if (!allowedTables.includes(dbKey)) {
    console.error('Invalid table key attempted:', dbKey);
    return res.status(400).json({ error: 'Invalid table key' });
  }

  let db;

  
  try {
    // Establish database connection
    db = await mysql.createConnection(dbConfig.uri);

    // Dynamically build SET query string from request body
    const fieldsToUpdate = req.body;
    const setString = Object.keys(fieldsToUpdate)
      .map((key) => `${key} = ?`)
      .join(', ');

    const values = Object.values(fieldsToUpdate);

    // Build dynamic query
    const query = `UPDATE ${dbKey} SET ${setString} WHERE id = ?`;
    values.push(id);

    console.log('Executing query:', { query, values });

    // Execute the query
    const [result] = await db.execute(query, values);

    if (result.affectedRows === 0) {
      console.warn('No rows affected for id:', id);
      return res.status(404).json({ error: 'No record found to update' });
    }

    console.log('Update successful:', result);

    return res.status(200).json({ message: 'Record updated successfully', updatedFields: fieldsToUpdate });
  } catch (error) {
    console.error('Error running query:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    if (db) {
      await db.end();
    }
  }
});

module.exports = router;