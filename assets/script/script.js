
//Global Variables
const searchBtn = document.querySelector('.search-btn');
const mainREl = document.querySelector('.main-right');
const weatherApiKey = '17499ae5d8476246483628b382275828';
const iconSrc = 'https://openweathermap.org/img/wn/'
let savedSearches = [];
let today = dayjs().format('M/DD/YYYY');
let dayCounter = 1;

//Renders in top card of main right
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

//gathers variables from fetch object
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

//renders in html for future forecast cards
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
}

//set variables from the weatherobject data for the future forecast cards
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
  dayCounter = 1;
  for (let i = 5; i < 39; i = (i + 8)) {
    let weatherListItem = weatherObject.list[i];
    renderFiveDayForecast(weatherListItem);
    let futureDay = dayjs().add(dayCounter, 'day');
    futureDay = futureDay.format('M/DD/YYYY');
    let fiveDayCardTitle = document.querySelector(`.day-plus-${dayCounter}`);
    fiveDayCardTitle.textContent = `${futureDay}`;
    dayCounter++;
  }
  if (mainREl.classList.contains('invisible')) {
    mainREl.setAttribute('class', 'main-right col-md-9 row visible');
  }

}

//take weatherURL from getCoordinates and fetch the weather at that given lon&lat
const getWeather = (weatherURL) => {
  fetch(weatherURL)
  .then(response => {
    return response.json()
  })
  .then(data => {
    renderData(data);
  })
  .catch(error => {
    console.log('Fetch error:', error)
  })
}

  //saves search history of cities looked up by user. Max 5 cities before oldest is removed
  const setSearchHistory = (city) => {
    savedSearches = JSON.parse(localStorage.getItem('cities') || '[]');
    if (savedSearches !== null && city !== '' && !savedSearches.includes(city) && savedSearches.length < 5) {
      savedSearches.push(city);
      localStorage.setItem('cities', JSON.stringify(savedSearches));
    } else if (savedSearches !== null && city !== '' && !savedSearches.includes(city)) {
      savedSearches.shift();
      savedSearches.push(city);
      localStorage.setItem('cities', JSON.stringify(savedSearches));
    }
  }

//take city name and fetch the coordinates. return the weather URL with coordinates of the city searched for to pass into the weather fetch.
const getCoordinates = (cityName) => {
  const coordinateURL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${weatherApiKey}`

  fetch(coordinateURL)
  .then(response => {
    if (response.status !== 200) {
      alert(`Sorry. That search didn't work. Please try again.`);
      console.log(response.status);
      return;
    } else {
      return response.json();
    }
  })
//grab coordinates from the data and pass it to the weather API. Saves city search only if the fetch promise is valid.
  .then(data => {
    if (data[0] === undefined) {
      alert(`Sorry. That city wasn't found. Please check the spelling and try again.`);
      return;
    } else {
      const latitude = data[0].lat;
      const longitude = data[0].lon;
      const citySearchedFor = data[0].name;
      const weatherURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${weatherApiKey}&units=imperial`;
      setSearchHistory(citySearchedFor);
      getWeather(weatherURL);
      renderPastSearchList();
    }
  })
  .catch(error => {
    console.log('Fetch error:', error)
  })
}

//function for if user presses button of city they previously searched
const pastSearchBtnHandle = (event) => {
  event.preventDefault();
    let pastCityName = event.target.innerText;
    getCoordinates(pastCityName);
}

//render in list of past cities searched for
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

//handling of the search button click event
const citySearchHandle = (event) => {
  event.preventDefault();
  const userInput = document.querySelector('#user-input').value.trim();
  if (userInput == '') {
    alert('You must enter a city name. Please try again');
    return;
  } else {

    getCoordinates(userInput);

  }
}
//shows the ls data on page refresh or first visit if there is any LS data
renderPastSearchList()


//event listener for search button
searchBtn.addEventListener('click', citySearchHandle)