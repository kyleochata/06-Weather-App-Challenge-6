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
const searchBtn = document.querySelector('.search-btn');
const weatherApiKey = '17499ae5d8476246483628b382275828';
const iconSrc = 'https://openweathermap.org/img/wn/'
let savedSearches = [];
let today = dayjs().format('M/DD/YYYY');
let dayCounter = 1;
//render the data info into appropriate areas
//if data undefined (return) Else (put in data then when trying to pass into next function)
//.? operator

const renderCurrentCard = (x, y, z, a, b, c) => {
  const currentCityEl = document.querySelector('#current-city');
  currentCityEl.textContent = `${x} ${today}`;
  const currentWindSpan = document.querySelector('.current-wind');
  currentWindSpan.textContent = `${y} mph`;
  const currentTempSpan = document.querySelector('.current-temp');
  currentTempSpan.textContent = `${z} F`;
  const currentHumiditySpan = document.querySelector('.current-humidity');
  currentHumiditySpan.textContent = `${a} %`;
  const currentIcon = document.querySelector('.current-weather-icon');
  currentIcon.setAttribute('src',`${iconSrc}${b}@2x.png`);
  currentIcon.setAttribute('alt', `${c}`);
}

const currentWeather = (currentWeather) => {
  const targetCurrent = currentWeather.list[0];
  const nameofCity = currentWeather.city.name;
  const currentWind = targetCurrent.wind.speed;
  const currentTemp = targetCurrent.main.temp;
  const currentHumidity = targetCurrent.main.humidity;
  const currentIcon = targetCurrent.weather[0].icon;
  const currentIconDescription = targetCurrent.weather[0].description;
  renderCurrentCard(nameofCity, currentWind, currentTemp, currentHumidity, currentIcon, currentIconDescription)
}

const renderFutureCard = (temp, wind, humidity, icon, description) => {
  let daySelector = '.day-plus';
  let futureImg = document.querySelector(`${daySelector}-${dayCounter}-img`);
  futureImg.setAttribute('src', `${iconSrc}${icon}@2x.png`);
  futureImg.setAttribute('alt', `${description}`);
  let futureWillBe = document.querySelector(`${daySelector}-${dayCounter}-description`);
  futureWillBe.textContent = `${description}`;
  let futureTemp = document.querySelector(`${daySelector}-${dayCounter}-temp`);
  futureTemp.textContent = `${temp} F`;
  let futureWind = document.querySelector(`${daySelector}-${dayCounter}-wind`);
  futureWind.textContent = `${wind} mph`;
  let futureHumidity = document.querySelector(`${daySelector}-${dayCounter}-humidity`);
  futureHumidity.textContent = `${humidity} %`;
  console.log(futureHumidity);
}

const renderFiveDayForecast = (listLoop) => {
  const futureTemp = listLoop.main.temp;
  const futureWind = listLoop.wind.speed;
  const futureHumidity = listLoop.main.humidity;
  const futureIcon = listLoop.weather[0].icon;
  const futureDescription = listLoop.weather[0].description;
  renderFutureCard(futureTemp, futureWind, futureHumidity, futureIcon, futureDescription);
}

//render in cards below 5 day forecast. fiveDayCardTitle will display the next 5 day's dates per card.
const renderData = (weatherObject) => {
  currentWeather(weatherObject);
  for (let i = 5; i < 39; i = (i + 8)) {
    let weatherListItem = weatherObject.list[i];
    let futureDay = dayjs().add(dayCounter, 'day');
    futureDay = futureDay.format('M/DD/YYYY');
    let fiveDayCardTitle = document.querySelector(`.day-plus-${dayCounter}`);
    fiveDayCardTitle.textContent = `${futureDay}`;
    renderFiveDayForecast(weatherListItem);
    dayCounter++;
  }

}

//take weatherURL from getCoordinates and fetch the weather at that given lon&lat
const getWeather = (weatherURL) => {
  fetch(weatherURL)
  .then(function(response) {
    return response.json()
  })
  .then(function(data) {
    renderData(data);
  })
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

      return response.json();
    }
  })
//grab coordinates from the data and pass it to the weather API //need to save city name to LS and render a list item
  .then(function(data) {

    const latitude = data[0].lat;
    const longitude = data[0].lon;
    const weatherURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${weatherApiKey}&units=imperial`;
    getWeather(weatherURL);
  })
}

const setSearchHistory = (city) => {
  savedSearches = JSON.parse(localStorage.getItem('cities') || '[]');
  if (savedSearches !== null && city !== '' && !savedSearches.includes(city)) {
    savedSearches.push(city);
    localStorage.setItem('cities', JSON.stringify(savedSearches));
  }
}

const pastSearchBtnHandle = (event) => {
  event.preventDefault();
  console.log(event);
    let pastCityName = event.target.innerText;
    getCoordinates(pastCityName);

}

const renderPastSearchList = () => {
  savedSearches = JSON.parse(localStorage.getItem('cities') || '[]');
  let listCityEl = document.querySelector('.city-searched-head');
  listCityEl.innerHTML = '';
  listCityEl.textContent = 'Last Searched Cities: '
  for (let i = 0; i < savedSearches.length; i++) {
    let buttonContent = savedSearches[i];
    let buttonEl = document.createElement('button');
    buttonEl.setAttribute('class', 'list-group-item list-group-item-action');
    buttonEl.setAttribute('type', 'button');
    buttonEl.textContent = buttonContent;
    listCityEl.appendChild(buttonEl);
    buttonEl.addEventListener('click', pastSearchBtnHandle);
  }
}

const citySearchHandle = (event) => {
  event.preventDefault();
  const userInput = document.querySelector('#user-input').value.trim();
  if (userInput == '') {
    alert('You must enter a city name. Please try again');
    return;
  } else {

    getCoordinates(userInput);
    setSearchHistory(userInput);
    renderPastSearchList();
  }
}
renderPastSearchList()



//save searches
// savedSearches.push(userInput);
// localStorage.setItem('lastSearched', JSON.stringify(savedSearches));
// userInput.value('');
searchBtn.addEventListener('click', citySearchHandle)