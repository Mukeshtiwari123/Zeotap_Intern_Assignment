const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', async (req, res) => {
    try {
        // Example: Fetch weather data from the API
        const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];
        const apiKey = '180ca7edba43e6a446fbd68357c1b02c'; // Replace with your actual API key

        // Store weather data for all cities
        let weatherData = [];

        for (const city of cities) {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
            const weather = response.data;
            
            // Convert Kelvin to Celsius for temperature
            const tempCelsius = weather.main.temp - 273.15;
            const feelsLikeCelsius = weather.main.feels_like - 273.15;

            // Add city weather info to weatherData array
            weatherData.push({
                city: weather.name,
                main: weather.weather[0].main,
                temp: tempCelsius.toFixed(2),
                feels_like: feelsLikeCelsius.toFixed(2),
                dt: new Date(weather.dt * 1000).toLocaleString() // Convert timestamp to human-readable format
            });
        }

        // Pass weatherData to the EJS template
        res.render('index', { weatherData });
    } catch (error) {
        console.error('Error fetching weather data:', error);
        res.status(500).send('Error fetching weather data');
    }
});

module.exports = router;
