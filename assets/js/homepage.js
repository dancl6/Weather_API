// declare global variables
var lat
var lon
var uvUrl
apiId = "277bb2e5372c4e82877ab645a3d8b117"
var inputElement = document.getElementById("form-input")
var inputText 
var twentyFourHrTime
var fiveDayUrl
var cityHistory = ""
var gif
var historyList = []
var descriptionImage
var gifOpenWeather

// function to add list item to city history
var addHistoryButton = function (city) {
var elCreate = document.createElement("li")
var elExist = document.getElementById("history-list-id")
var appended = elExist.appendChild(elCreate)
elCreate.setAttribute("class", "city-class")
elCreate.setAttribute("id", city)
appended.textContent = city

}



// function to get five day forecast and populate five day forecast cards
var getFiveDay = function (fiveDayUrl) {
  fetch(fiveDayUrl)
    .then(function(response) {
      if(response.ok){
        response.json().then(function(data) {
          for (var i=0; i<5; i++){
            // update indices to call from five day forecast json array
            var j = i+1;
            var hour = 8*j-2+1;
            // create gif for card from five day api
            var gifIcon = data.list[hour].weather[0].icon;
            gifOpenWeather = "http://openweathermap.org/img/wn/" + gifIcon +"@2x.png";
            console.log("gif open weather is :" + gifOpenWeather);
            document.getElementById("image-day"+j).src=gifOpenWeather
            var dateDayJ = "dateDay" + j
            // extract date for each day
            dateDayJ = data.list[hour].dt_txt;
            dateDayJ = moment(dateDayJ).format('(MM/DD/YYYY)')
            var elDate = document.getElementById("day" + j + "-id-date");
            elDate.textContent=dateDayJ;
            // extract temperature and convert from kelvin to farenheit
            var elTemp = document.getElementById("day" + j + "-temp")
            var tempK = data.list[hour].main.temp
            var tempF = (tempK - 273.15)*9/5 + 32
            tempF = tempF.toPrecision(3)
            elTemp.textContent = "Temp: " + tempF + " °F"
            // extract humidity
            var elHum = document.getElementById("day" + j + "-hum")
            elHum.textContent = "Humidity: " + data.list[hour].main.humidity + "%"
          }
          
        });
      } else {
        alert("Error: " + response.statusText);
      }
    }) 
}

// function to get UV index
var getUvIndex = function (uvUrl) {
  fetch(uvUrl)
    .then(function(response) {
      if(response.ok){
        response.json().then(function(data) {
          var elCurUv2 = document.getElementById("uv-text");
          // remove classes from uv index
          elCurUv2.classList.remove("btn-success")
          elCurUv2.classList.remove("btn-warning")
          elCurUv2.classList.remove("btn-danger")
          // apply classes to uv index depending on level
          if (data.value < 3) {
            addClassUv = "btn-success"
          }
          if (data.value >=3 && data.value <= 6) {
            addClassUv = "btn-warning"
          }
          if (data.value > 6) {
            addClassUv = "btn-danger"
          }
          var elCurUv = document.getElementById("current-uvindex");
          elCurUv.textContent = "UV Index: " ;                    
          elCurUv2.classList.add(addClassUv)
          console.log(data.value);
          console.log(elCurUv2);
          elCurUv2.textContent = data.value;        
        });

      } else {
        alert("Error: " + response.statusText);
      }
    })
}

//  functionn to get current weather
var getCurrentWeather = function(city) {
  var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiId 
  // make a request to the url
  fetch(apiUrl)
    .then(function(response) {
      // request was successful
      if (response.ok) {
        response.json().then(function(data) {
          console.log("This is current weather:")
          var currentTime = moment().hour()
          var elCurCity = document.getElementById("current-city")
          var tempF = (data.main.temp - 273.15)*9/5 + 32
          tempF = tempF.toPrecision(3)
          var elCurTemp = document.getElementById("current-temp")
          elCurTemp.textContent = "Temperature: " +  tempF + " °F"
          var elCurHum = document.getElementById("current-humidity")
          elCurHum.textContent = "Humidity: " + data.main.humidity + "%"
          var elCurSpeed = document.getElementById("current-windspeed")
          // convert speed to mph
          var speedMph = 2.237*data.wind.speed
          speedMph = speedMph.toPrecision(3)
          elCurSpeed.textContent = "Wind Speed: " +  speedMph + "MPH"
          var deltaTime = (data.timezone-3*60*60)/60
          var curTim = moment().utcOffset(deltaTime).format("MM-DD-YYYY");
          var curTim2 = moment().utcOffset(deltaTime).format("LLLL");
          elCurCity.textContent = data.name + " (" + curTim + ")";
          lat = data.coord.lat
          lon = data.coord.lon
          uvUrl = "http://api.openweathermap.org/data/2.5/uvi?appid=" + apiId  +  "&lat=" + lat + "&lon=" + lon
          getUvIndex(uvUrl)
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function(error) {
      // Notice this `.catch()` getting chained onto the end of the `.then()` method
      alert("Unable to connect to Weather API");
    });
  };


  var weatherHistory = localStorage.getItem("weather-history")
  // populate city history
  if(weatherHistory!=null){
  var existingHistory = weatherHistory.split(",")
  console.log("Existing History: " + existingHistory)
  for (var k=0; k<existingHistory.length;k++){
    addHistoryButton(existingHistory[k])
  }
}

// event listener for button click for search
$("#basic-addon2").on("click", function(event) {
  event.preventDefault();  
  var display=document.querySelector("#visibility").removeAttribute("hidden")
  city = $("#form-input").val().trim();
  fiveDayUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiId
  var cityId = "#"+city
  historyList.push(city)
  localStorage.setItem("weather-history", historyList)
  addHistoryButton(city)
  getCurrentWeather(city)
  getFiveDay(fiveDayUrl)
})

// event listener for item list history 
$(".city-class").on("click", function(event) {
  console.log(this.id)
  city = this.id
  event.preventDefault();  
  var display=document.querySelector("#visibility").removeAttribute("hidden")
  fiveDayUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiId
  var cityId = "#"+city
  console.log(cityId)
  historyList.push(city)
  localStorage.setItem("weather-history", historyList)
  addHistoryButton(city)  
  getCurrentWeather(city)
  getFiveDay(fiveDayUrl)
})
