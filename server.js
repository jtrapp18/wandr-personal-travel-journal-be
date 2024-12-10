const express = require('express');
const cors = require('cors');
const tripsRoutes = require('./routes/trips');
const activitiesRoutes = require('./routes/activities');
const postRoutes = require('./routes/post');
const patchRoutes = require('./routes/patch');
const weatherRoutes = require('./routes/weather'); // Import the weather module

const app = express();
const port = process.env.PORT || 8080;

// List of allowed origins (including ports)
const allowedOrigins = ['http://localhost:3000', 'http://https://jtrapp18.github.io/wandr-personal-travel-journal'];

// Configure CORS
app.use(cors({
  origin: allowedOrigins, // Only allow these origins
}));
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
