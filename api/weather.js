const axios = require('axios');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ 
        error: 'Missing required parameters', 
        message: 'Please provide both lat and lon query parameters' 
      });
    }

    const apiKey = process.env.WEATHER_API_KEY;
    
    if (!apiKey || apiKey === 'your_openweathermap_api_key_here') {
      // Fallback to Open-Meteo (free, no API key required)
      const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
        params: {
          latitude: lat,
          longitude: lon,
          current: 'weather_code,temperature_2m',
          timezone: 'auto'
        }
      });

      const weatherCode = response.data.current.weather_code;
      const temp = response.data.current.temperature_2m;

      // Map WMO weather codes to conditions
      let condition = 'Clear';
      if (weatherCode >= 1 && weatherCode <= 3) condition = 'Clouds';
      else if (weatherCode >= 45 && weatherCode <= 48) condition = 'Clouds';
      else if (weatherCode >= 51 && weatherCode <= 67) condition = 'Rain';
      else if (weatherCode >= 71 && weatherCode <= 77) condition = 'Snow';
      else if (weatherCode >= 80 && weatherCode <= 86) condition = 'Rain';
      else if (weatherCode >= 95 && weatherCode <= 99) condition = 'Thunderstorm';

      return res.json({
        condition,
        temperature: temp,
        location: { lat: parseFloat(lat), lon: parseFloat(lon) },
        source: 'open-meteo'
      });
    }

    // Use OpenWeatherMap if API key is provided
    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        lat,
        lon,
        appid: apiKey,
        units: 'metric'
      }
    });

    const condition = response.data.weather[0].main;
    const temp = response.data.main.temp;
    const description = response.data.weather[0].description;
    const city = response.data.name;

    res.json({
      condition,
      temperature: temp,
      description,
      city,
      location: { lat: parseFloat(lat), lon: parseFloat(lon) },
      source: 'openweathermap'
    });
  } catch (error) {
    console.error('Weather API Error:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch weather data', 
      message: error.response?.data?.message || error.message 
    });
  }
};