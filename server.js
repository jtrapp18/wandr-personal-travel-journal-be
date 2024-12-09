const express = require('express');
const cors = require('cors');
const getRoutes = require('./routes/get');
const postRoutes = require('./routes/post');
const patchRoutes = require('./routes/patch');

const app = express();
const port = process.env.MYSQLPORT || 8080;

// Enable CORS for localhost:3000 only
app.use(cors());
app.use(express.json());

// Mount routes here
app.use('/trips', getRoutes);
app.use('/new', postRoutes);
app.use('/update', patchRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
