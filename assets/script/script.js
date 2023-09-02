/*
when you type in a city and search:
  fetch city name to get back data
    => once city data is back
      -update the current city name
      - fill in the temp, wind, humidity and add an icon displaying the weather(sunny = sun; cloudy=sun w/ clouds; etc.)
      -fill in 5 day forecast with date in card title
        -card needs wind, humidity, temp icon
  Once a city is searched for, create a list with a clickable button that will research the cities weather.
    -Once at 5 cities, eliminate the oldest searched city
*/
//Global Variables
const searchBtn = document.querySelector('.search-button');
const weatherApiKey = '19e81bf6f50853358a7f3ca608cd7627';

let savedSearches = [];
let today = dayjs().format('M/DD/YYYY');

const citySearchHandle = (event) => {
  event.preventDefault();
  const userInput = document.querySelector('#userInput').value().trim();
  if (userInput == '') {
    alert('You must enter a city name. Please try again');
    return;
  } else {

    getCoordinates(userInput);

  }
}

//take city name and fetch the coordinates. return the weather URL with coordinates of the city searched for to pass into the weather fetch.
const getCoordinates = (cityName) => {
  const coordinateURL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${weatherApiKey}`

  fetch(coordinateURL)
  .then(function(response){
    if (response.status !== 200) {
      alert('Sorry. That city does not seem to be acceptable. Please check the spelling and try again.');
      return;
    } else {
      savedSearches.push(userInput);
      localStorage.setItem('lastSearched', JSON.stringify(savedSearches));
      userInput.value('');
      return response.json();
    }
  })
//grab coordinates from the data and pass it to the weather API
  .then(function(data) {

    const latitude = data[0].lat;
    const longitude = data[0].lon;
    const weatherURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${weatherApiKey}`; //put key into a var
    getWeather(weatherURL);
  })
}
//take weatherURL from getCoordinates and fetch the weather at that given lon&lat
const getWeather = (weatherURL) => {
  fetch(weatherURL)
  .then(function(response) {
    return response.json()
  })
  // .then(function(data) {
  //   renderData(data);
  // })
}
//render the data info into appropriate areas
//if data undefined (return) Else (put in data then when trying to pass into next function)
//.? operator

// const renderData = (weatherObject) => {

// }

searchBtn.addEventListener('click', citySearchHandle)