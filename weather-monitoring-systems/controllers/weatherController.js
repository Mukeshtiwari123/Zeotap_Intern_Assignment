const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./weather.db');

// Cities to monitor
const CITIES = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];

// Function to fetch weather data
async function fetchWeatherData() {
    const apiKey = process.env.API_KEY;

    for (const city of CITIES) {
        const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
        try {
            const response = await axios.get(url);
            if (response.status === 200) {
                const weatherData = response.data;
                processWeatherData(weatherData);
            }
        } catch (error) {
            console.error(`Error fetching data for ${city}:`, error);
        }
    }
}

// Function to process and store weather data
function processWeatherData(weatherData) {
    const tempCelsius = kelvinToCelsius(weatherData.main.temp);
    const city = weatherData.name;
    const weatherCondition = weatherData.weather[0].main;
    const timestamp = new Date(weatherData.dt * 1000).toISOString();

    console.log(`City: ${city}, Temp: ${tempCelsius.toFixed(2)}°C, Condition: ${weatherCondition}, Time: ${timestamp}`);
    
    // Insert data into SQLite database
    db.run(`INSERT INTO weather (city, temp, condition, timestamp) VALUES (?, ?, ?, ?)`, [city, tempCelsius, weatherCondition, timestamp]);

    // Check alert thresholds
    checkAlerts(tempCelsius);
}

// Function to convert Kelvin to Celsius
function kelvinToCelsius(tempKelvin) {
    return tempKelvin - 273.15;
}

// Function to check alert conditions
function checkAlerts(temp) {
    const threshold = process.env.ALERT_THRESHOLD_TEMP;
    if (temp > threshold) {
        console.log(`ALERT: Temperature is ${temp}°C, exceeds threshold of ${threshold}°C`);
        // Send email or other alert (implement this function later)
    }
}

module.exports = { fetchWeatherData, processWeatherData };
