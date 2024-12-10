const express = require('express');
const cors = require('cors');
const tripsRoutes = require('./routes/trips');
const activitiesRoutes = require('./routes/activities');
const postRoutes = require('./routes/post');
const patchRoutes = require('./routes/patch');
const weatherRoutes = require('./routes/weather'); // Import the weather module

const app = express();
const port = process.env.PORT || 8080;

// Enable CORS for localhost:3000 only
app.use(cors());
app.use(express.json());

// Mount routes
app.use('/trips', tripsRoutes);
app.use('/activities', activitiesRoutes);
app.use('/new', postRoutes);
app.use('/update', patchRoutes);
app.use('/weather', weatherRoutes); // Mount the weather routes

// Catch-all error handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
