// Giphy API call(replace query w/ search term): https://api.giphy.com/v1/gifs/search?api_key=DFDiQBA00oioIPYxJbBm8qm1Qlu4yAJd&q=query&limit=1&offset=0&rating=g&lang=en&bundle=messaging_non_clips
// VC API call(replace Dayton w/ location variable): https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Dayton?unitGroup=us&elements=datetime%2Cname%2Ctemp%2Cicon%2Csource&include=fcst%2Cdays%2Ccurrent&key=5KWNMEZ5PF6YZM7PGMKJS94QL&contentType=json

//requests weather data from visual crossing using submitted search query
async function getWeather(location) {
    var requestQuery = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/' + location + '?unitGroup=us&elements=datetime%2Cname%2Ctemp%2Cicon%2Csource&include=fcst%2Cdays%2Ccurrent&key=5KWNMEZ5PF6YZM7PGMKJS94QL&contentType=json'
    try {
        const response = await fetch(requestQuery, {mode: 'cors'});
        const weatherData = await response.json();
        console.log(weatherData);
        localStorage.setItem("localWeatherData", JSON.stringify(weatherData)); //saves data from request into localstorage
    } catch(error) { console.log(error) }
}

//retrieves data from prior request out of localstorage to save on API calls
async function getWeatherFromFile() {
    const data = localStorage.getItem("localWeatherData");
    console.log('local data, not based on API request from search query')
    console.log(JSON.parse(data));
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
  }

//verifies if the search query is valid before calling function that will make API request
function verifySearch(searchLocation) {
    if (searchLocation && /^[a-zA-Z]*$/.test(searchLocation)){
        getWeather(searchLocation);
    }
    else { console.log('invalid search query') }
}

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