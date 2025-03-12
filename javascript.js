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

function setWeatherInfo(weatherData) {
    console.log(weatherData.address);
    console.log('current time: ' + weatherData.currentConditions.datetime);
    console.log(weatherData.currentConditions.temp);
    selectIcon(weatherData.currentConditions.icon);

    for (let i = 0; i <= numExtraDays; i++) {
        let d = new Date(weatherData.days[i].datetime);
        let day = d.getDay();
        console.log(weeklyDays[day]);
        console.log(weatherData.days[i].temp);
        selectIcon(weatherData.days[i].icon);
    }
}

function selectIcon(iconDescription) {
    console.log(iconDescription)
}

const weeklyDays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
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