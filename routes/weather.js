const express = require('express');
const axios = require('axios');

const router = express.Router(); // Create a new router instance

// GET /weather endpoint
router.get('/', async (req, res) => {
  const location = req.query.location || 'New York'; // Default location
  const apiKey = process.env.ACCUWEATHER_API_KEY; // Ensure this is set in your environment

  try {
    // Fetch the location key
    const locationRes = await axios.get(`http://dataservice.accuweather.com/locations/v1/cities/search?q=${location}&apikey=${apiKey}`);
    const locationKey = locationRes.data[0]?.Key;

    if (!locationKey) {
      return res.status(404).json({ error: 'Location not found' });
    }

    // Fetch the weather forecast
    const forecastRes = await axios.get(`http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}`);
    return res.status(200).json(forecastRes.data);
  } catch (error) {
    console.error('Weather API error:', error.message);
    return res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

module.exports = router;