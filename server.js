const express = require('express');
const cors = require('cors');
const getRoutes = require('./get');
const postRoutes = require('./post');
const patchRoutes = require('./patch');

const app = express();
const port = process.env.MYSQLPORT || 8080;

app.use(cors());
app.use(express.json()); // Parse JSON in request body

// Mount routes here
app.use('/get', getRoutes);
app.use('/post', postRoutes);
app.use('/patch', patchRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
