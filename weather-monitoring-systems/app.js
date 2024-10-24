const express = require('express');
const weatherRoutes = require('./routes/weatherRoutes');
const schedule = require('node-schedule'); 
const { fetchWeatherData } = require('./controllers/weatherController'); 
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 3000;

// Set up the SQLite database
const db = new sqlite3.Database('./weather.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the weather database.');
    }
});

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Enable EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Sample weather data
const weatherData = [
    { city: "Delhi", temperature: 30, feels_like: 32, humidity: 70, wind_speed: 10 },
    { city: "Mumbai", temperature: 28, feels_like: 29, humidity: 80, wind_speed: 5 },
    { city: "Chennai", temperature: 34, feels_like: 36, humidity: 60, wind_speed: 7 },
    { city: "Bangalore", temperature: 25, feels_like: 27, humidity: 50, wind_speed: 4 },
    { city: "Kolkata", temperature: 29, feels_like: 30, humidity: 75, wind_speed: 6 },
    { city: "Hyderabad", temperature: 32, feels_like: 34, humidity: 65, wind_speed: 8 }
];

// Fetch weather data for a specific city
app.get('/api/weather', (req, res) => {
    const city = req.query.city;
    const data = weatherData.find(weather => weather.city === city);

    if (data) {
        res.json(data);
    } else {
        res.status(404).json({ error: 'City not found' });
    }
});

// Root route to render the main page
app.get('/', (req, res) => {
    res.render('index', { weatherData });
});

// Start the server
app.listen(port, () => {
    console.log(`Weather monitoring system is running at http://localhost:${port}`);
});
