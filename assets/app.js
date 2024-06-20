//function trigged by submit, gets weather
function getWeather() {

    const apiKey = '825d821526a7f066cc495373340e2be1';
    const city = document.getElementById('city').value; //gets user input

    if (!city) {
        alert('please enter a city');
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;


    fetch(currentWeatherUrl) //makes http request
    .then(response => response.json()) //response recieved, parses the JSON
    .then(data => {
        displayWeather(data); // calls function to display the current weather of specified city
        isDaytime(data); // calls function to change the time img
    })
    .catch(error => { //incase of error
        console.error('Error fetching current weather data', error);
        alert('Error fetching current weather data. Please try again');
    });

    fetch(forecastUrl) //makes http request
    .then(response => response.json()) //response recieved, parses the JSON
    .then(data => {
        displayHourlyForecast(data.list); //calls function to display the forecast
    })
    .catch(error => { //incase of error
        console.error('Error fetching hourly forecast data', error);
        alert('Error fetching hourly forecast data. Please try again');
    });
}



function displayWeather(data) {

    //accessing the DOM
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherContainer = document.getElementById('weather-container');
    const forecastLabel = document.getElementById('forecast-label');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    //clear previous content
    weatherInfoDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    if (data.cod === '404') { //display the error if data is missing
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`
    } else {

        const cityName = data.name;
        const temperature = Math.round(data.main.temp - 273.15); //convert from farenheit to celcius + round
        const description = data.weather[0].description;
        const temperatureHTML = `
            <p>${temperature}&deg;</p>
        `;
        const weatherHTML = `
            <p>${cityName}</p>
            <p>${description}</p>
        `;
        
        // remove the d-none class if present (unhides the forecast label)
    if(forecastLabel.classList.contains('d-none')){
        forecastLabel.classList.remove('d-none');
    };
    if(weatherContainer.classList.contains('d-none')){ //(unhides the weatherContainer label)
        weatherContainer.classList.remove('d-none');
    };


        tempDivInfo.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHTML;
        weatherIcon.alt = description;
        
    }
}

function displayHourlyForecast(hourlyData) { // function to display the forecast

    const hourlyForecastDiv = document.getElementById('hourly-forecast'); //access to dom
    const next24Hours = hourlyData.slice(0, 8); // slices the 24hr forecast into 8 parts, 3hr intervals

    next24Hours.forEach(item => {

        const dateTime = new Date(item.dt * 1000); //converts from seconds to milliseconds 
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp - 273.15); //convert from farenheit to celcius + round

        const hourlyItemHTML = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <span>${temperature}&deg;</span>
            </div>
        `;
        hourlyForecastDiv.innerHTML += hourlyItemHTML; // adds the interval to the forecast div
    });
}

function isDaytime(data) { //function to change the image depending on day or night
    const timeIcon = document.getElementById('time-icon'); //access to dom

    const timestamp = data.dt; //gets time of city
    const timezoneOffset = data.timezone; //timezone of city
    const localTime = new Date((timestamp + timezoneOffset) * 1000); //gets localtime of city

    const sunrise = new Date((data.sys.sunrise + timezoneOffset) * 1000); // gets time of sunrise
    const sunset = new Date((data.sys.sunset + timezoneOffset) * 1000); //gets time of susnet

    const isDayTime = localTime >= sunrise && localTime < sunset; //if the localtime is later than sunrise and earlier than sunrise, it is day time

    // console.log(`Is Daytime in ${data.name}: ${isDayTime}`);

    const timeImg = isDayTime ? 'assets/img/day.svg' : 'assets/img/night.svg'; //changes img to day or night
    timeIcon.setAttribute('src', timeImg);
}