//create show current time in javascript
function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let dayIndex = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[dayIndex];

  return `${day} ${hours}:${minutes}`;
}
let dateElement = document.querySelector("#date");
let currentTime = new Date();
dateElement.innerHTML = formatDate(currentTime);
// show weather condition of the city that you search
function displayWeatherCondition(response) {
  document.querySelector("#city").innerHTML = response.data.name;
  document.querySelector("#temperature").innerHTML = Math.round(
    response.data.main.temp
  );

  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#description").innerHTML =
    response.data.weather[0].description;
  celsiusTemp = response.data.main.temp;
  //change the image according to weather
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    ` https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
  //change Date
  let dateElement = document.querySelector("#date");
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
  //forecast the weather with api
  getForecast(response.data.coord);
}
function searchCity(city) {
  let apiKey = "71e94ed71d67ec65d062e922a11d67dd";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeatherCondition);
}
function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  searchCity(city);
}
let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSubmit);
searchCity("Karaj");
//get the weather of current location
function searchLocation(position) {
  let apiKey = "71e94ed71d67ec65d062e922a11d67dd";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayWeatherCondition);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}
let currentLocationButton = document.querySelector("#currentlocation");
currentLocationButton.addEventListener("click", getCurrentLocation);
//convert temperature unit
function convertToFahrenheit(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  let fahrenheitTemp = (celsiusTemp * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemp);
  cg.classList.remove("active");
  fh.classList.add("active");
}
let unitChangeToF = document.querySelector("#fh");
unitChangeToF.addEventListener("click", convertToFahrenheit);

function convertToCelsius(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemp);
  cg.classList.add("active");
  fh.classList.remove("active");
}
let unitChangeToC = document.querySelector("#cg");
unitChangeToC.addEventListener("click", convertToCelsius);

let celsiusTemp = null;
//the weather forecast
function displayForecast(response) {
  let forecast = response.data.list;
  console.log(response.data.list);

  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = ` <div class="row">`;

  [6, 14, 22, 28, 38].forEach(function (index) {
    const forecastDay = forecast[index];
    forecastHTML =
      forecastHTML +
      `
     <div class="col-2">
              <ul class="forecast">
                <li>${formatDay(forecastDay.dt)}</li>
                <li>
                  <img
                    src="https://openweathermap.org/img/wn/${
                      forecastDay.weather[0].icon
                    }@2x.png"
                    alt="sun"
                    width="42"
                  />
                </li>
                <li>${Math.round(
                  forecastDay.main.temp_max
                )}°/ <span class="min">${Math.round(
        forecastDay.main.temp_min
      )}°</span></li>
              </ul>
            </div>`;
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}
displayForecast();
//forecast the weather with API
function getForecast(coordinates) {
  let apiKey = "69254dfed53b07f9a24e299c9bde380f";
  let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}
//forecast the weather with API mack the day work
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}
