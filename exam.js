function getWeather() {
    const apiKey = "4aabba278aaeaf0383c360ea033093d4";
    const city = document.getElementById("city");
    
    const weatherInfo = document.getElementById("weather-info");
    
    async function fetchWeather() {
        if (!city.value) {
            alert("Please enter a city");
            return;
        }
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&appid=${apiKey}&units=metric`
            );
            const data = await response.json();
            displayData(data);
            
            const forecastResponse = await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?q=${city.value}&appid=${apiKey}&units=metric`
            );
            const forecastData = await forecastResponse.json();

            // Check if forecastData.list is an array
            if (Array.isArray(forecastData.list)) {
                displayHourlyForecast(forecastData);
            } else {
                console.error("Forecast data is not in the expected format", forecastData);
                alert("Could not retrieve hourly forecast data.");
            }

        } catch (err) {
            console.error("Something is error check it", err);
            alert("An error occurred while fetching the weather data.");
        }
    };
    fetchWeather();
}

function displayData(data) {
    const tempDiv = document.getElementById("temp-div");
    const weatherDiv = document.getElementById("weather-info");
    const wIconDiv = document.getElementById("weather-icon");
    const hourlyForecastDiv = document.getElementById("hourly-forecast");

    weatherDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempDiv.innerHTML = '';
    if (data.cod === '404') {
        weatherDiv.innerHTML = `<p>${data.message}</p>`;
    } else {
        const cityName = data.name;
        const temper = data.main.temp;
        const description = data.weather[0].description; // Corrected line
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
        tempDiv.innerHTML = `<p>${temper}°C</p>`;
        weatherDiv.innerHTML = 
        `<h2>${cityName}</h2>
        <p>${description}</p>`;
        wIconDiv.src = iconUrl;
        wIconDiv.alt = description;
        showImage();
    }
}

function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    const next24Hours = hourlyData.list.slice(0, 8); // Display the next 24 hours (3-hour intervals)

    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000); // Convert timestamp to milliseconds
        const hour = dateTime.getHours();
        const temperature = item.main.temp; // Convert to Celsius
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°C</span>
            </div>
        `;

        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}

function showImage() {
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block'; // Make the image visible once it's loaded
}
