const express = require('express');
const cors = require('cors');
const tripsRoutes = require('./routes/trips');
const postRoutes = require('./routes/post');
const patchRoutes = require('./routes/patch');

const app = express();
const port = process.env.PORT || 8080;

// Enable CORS for localhost:3000 only
app.use(cors());
app.use(express.json());

// Mount routes here
app.use('/trips', tripsRoutes);
app.use('/new', postRoutes);
app.use('/update', patchRoutes);

// Catch-all error handler for debugging
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
