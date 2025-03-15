// Giphy API call(replace query w/ search term): https://api.giphy.com/v1/gifs/search?api_key=DFDiQBA00oioIPYxJbBm8qm1Qlu4yAJd&q=query&limit=1&offset=0&rating=g&lang=en&bundle=messaging_non_clips
// VC API call(replace Dayton w/ location variable): https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Dayton?unitGroup=us&elements=datetime%2Cname%2Ctemp%2Cicon%2Csource&include=fcst%2Cdays%2Ccurrent&key=5KWNMEZ5PF6YZM7PGMKJS94QL&contentType=json

//verifies if the search query is valid before calling function that will make API request
function verifySearch(searchLocation) {
    if (searchLocation && /^[a-zA-Z]*$/.test(searchLocation)){
        getWeather(searchLocation);
    }
    else { console.log('invalid search query') }
}

//requests weather data from visual crossing using submitted search query
async function getWeather(location) {
    var requestQuery = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/' + location + '?unitGroup=us&elements=datetime%2Cname%2Ctemp%2Cicon%2Csource&include=fcst%2Cdays%2Ccurrent&key=5KWNMEZ5PF6YZM7PGMKJS94QL&contentType=json'
    try {
        const response = await fetch(requestQuery, {mode: 'cors'});
        const weatherData = await response.json();
        localStorage.setItem("localWeatherData", JSON.stringify(weatherData)); //saves data from request into localstorage
        setWeatherInfo(weatherData);
    } catch(error) { console.log(error) }
}

//retrieves data from prior request out of localstorage to save on API calls
function getWeatherFromFile() {
    const storedData = localStorage.getItem("localWeatherData");
    console.log('locally stored data used: not based on API request from search query')
    weatherData = JSON.parse(storedData);
    setWeatherInfo(weatherData)
}

function convertTime(dateTime) {
    dateTime = dateTime.slice(0, -3);
    let h = parseInt(dateTime.substr(0, 2));
    let dayNight = 'AM'

    if (h >= 12) {
        dayNight = 'PM';
        if (h != 12) { h = h - 12; }
    }

    let timeString = h.toString() + dateTime.slice(2) + ' ' + dayNight;

    return(timeString);
}

function selectIcon(iconDescription) {
    console.log(iconDescription)
}

function setWeatherInfo(weatherData) {
    const weatherContainer = document.createElement('div');
    weatherContainer.className = 'weather-container'

    const weatherHeader = buildWeatherHeader(weatherData.address, convertTime(weatherData.currentConditions.datetime));
    weatherContainer.appendChild(weatherHeader);

    const currentWeather = buildCurrentWeather(weatherData.currentConditions.icon, Math.round(weatherData.currentConditions.temp));
    weatherContainer.appendChild(currentWeather);

    const forecastContainer = buildForecastContainer(weatherData);
    weatherContainer.appendChild(forecastContainer);

    document.body.appendChild(weatherContainer);

    for (let i = 0; i <= numExtraDays; i++) {
        let d = new Date(weatherData.days[i].datetime);
        let day = d.getDay();
        console.log(weeklyDays[day]);
        console.log(Math.round(weatherData.days[i].temp));
        selectIcon(weatherData.days[i].icon);
    }
}

function buildWeatherHeader(location, currentTime) {
    const weatherHeader = document.createElement('div');
    weatherHeader.className = 'weather-header';

    const locationIcon = document.createElement('i');
    locationIcon.className = ('material-symbols-outlined');
    locationIcon.innerHTML = ('location_on');
    weatherHeader.appendChild(locationIcon);

    const headerLocation = document.createElement('div');
    headerLocation.innerHTML = location;
    weatherHeader.appendChild(headerLocation);

    const headerTime = document.createElement('time');
    headerTime.innerHTML = currentTime;
    weatherHeader.appendChild(headerTime);

    return(weatherHeader);
}

function buildCurrentWeather(iconDescription, temp) {
    const currentWeatherContainer = document.createElement('div');
    currentWeatherContainer.className = 'current-weather';

    const currentWeatherIcon = document.createElement('i');
    selectIcon(iconDescription);
    currentWeatherContainer.appendChild(currentWeatherIcon);

    const currentWeatherTemp = document.createElement('div');
    currentWeatherTemp.innerHTML = temp;
    currentWeatherContainer.appendChild(currentWeatherTemp);

    return(currentWeatherContainer);
}

function buildForecastContainer(weatherData) {
    const forecastContainer = document.createElement('div');
    forecastContainer.className = 'forecast-container';

    for (let i = 0; i <= numExtraDays; i++) {
        let d = new Date(weatherData.days[i].datetime);
        let day = d.getDay();
        let iconDescription = selectIcon(weatherData.days[i].icon)
        let temp = Math.round(weatherData.days[i].temp)

        let newDayContainer = buildForecastDay(day, iconDescription, temp);
        newDayContainer.className = 'day-container day-container-' + (i+1).toString();
        forecastContainer.appendChild(newDayContainer);

        if (i < numExtraDays) {
            let newSeperator = document.createElement('div');
            newSeperator.className = 'forecast-seperator';
            forecastContainer.appendChild(newSeperator)
        }
    }

    return(forecastContainer);
}

function buildForecastDay(day, iconDescription, temp) {
    const newDayContainer = document.createElement('div');

    const newDayText = document.createElement('div');
    newDayText.innerHTML = weeklyDays[day];
    newDayContainer.appendChild(newDayText);

    const newDayIcon = document.createElement('i');
    newDayIcon.className = 'forecast-icon';
    newDayContainer.appendChild(newDayIcon);
    
    const newDayTemp = document.createElement('div');
    newDayTemp.innerHTML = temp;
    newDayContainer.appendChild(newDayTemp);
    return(newDayContainer);
}

const weeklyDays = ['MON','TUE','WED','THU','FRI','SAT','SUN']
const numExtraDays = 3;

//Adds an event listener for form submission, prevents page reload, and grabs search query from text box
window.addEventListener("DOMContentLoaded", (event) => {
    document.getElementById('form').addEventListener('submit', function(event){
        event.preventDefault();
        var searchLocation = document.getElementById('searchText').value;

        //checks if send to API checkbox is checked or not before calling function to verify search query (i did this to lower my API call count while i was doing some messing around early on)
        if (document.getElementById('sendToAPI').checked == true) {
            verifySearch(searchLocation);
        }
        else {
            getWeatherFromFile();
        }
      });
  });