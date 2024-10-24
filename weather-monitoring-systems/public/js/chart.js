document.getElementById('generateChartBtn').addEventListener('click', async function () {
    const city = document.getElementById('cityDropdown').value;
    const chartType = document.querySelector('input[name="chartType"]:checked').value;

    if (!city || !chartType) {
        alert('Please select both a city and a chart type');
        return;
    }

    // Fetch weather data based on selected city
    const weatherData = await fetchWeatherData(city);
    if (weatherData) {
        if (chartType === 'bar') {
            createBarChart(weatherData);
        } else if (chartType === 'pie') {
            createPieChart(weatherData);
        }
    } else {
        alert('Failed to fetch weather data. Please try again.');
    }
});

// Function to fetch weather data from the API
async function fetchWeatherData(city) {
    try {
        const response = await fetch(`/api/weather?city=${city}`);
        const data = await response.json();
        return data;  // Assumes API returns { temperature, feels_like, humidity, wind_speed }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}

// Function to create Bar Chart (e.g., temperature vs feels_like)
function createBarChart(weatherData) {
    const ctx = document.getElementById('weatherChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Temperature', 'Feels Like'],  // Label categories
            datasets: [{
                label: 'Weather Data (°C)',
                data: [weatherData.temperature, weatherData.feels_like],  // Bar values
                backgroundColor: ['rgba(54, 162, 235, 0.2)', 'rgba(255, 99, 132, 0.2)'],
                borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Function to create Pie Chart (e.g., humidity vs wind speed)
function createPieChart(weatherData) {
    const ctx = document.getElementById('weatherChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Humidity', 'Wind Speed'],  // Pie chart categories
            datasets: [{
                label: 'Weather Data',
                data: [weatherData.humidity, weatherData.wind_speed],  // Pie values
                backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)'],
                borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)'],
                borderWidth: 1
            }]
        }
    });
}
