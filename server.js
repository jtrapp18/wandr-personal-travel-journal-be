const express = require('express');
const cors = require('cors');
const getRoutes = require('./get');
const postRoutes = require('./post');
const patchRoutes = require('./patch');

const app = express();
const port = process.env.MYSQLPORT || 8080;

// Enable CORS for localhost:3000 only
app.use(cors({
    origin: 'http://localhost:3000', // Allow only this origin
  }));
app.use(express.json()); // Parse JSON in request body

// Mount routes here
app.use('/trips', getRoutes);
app.use('/post', postRoutes);
app.use('/patch', patchRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
