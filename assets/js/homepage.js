var lat
var lon
var uvUrl
apiId = "277bb2e5372c4e82877ab645a3d8b117"
var inputElement = document.getElementById("form-input")
var inputText 

var fiveDayUrl
var cityHistory = ""


var getFiveDay = function (fiveDayUrl) {
  fetch(fiveDayUrl)
    .then(function(response) {
      if(response.ok){
        response.json().then(function(data) {
          console.log("Five Day Forecast is:")
          console.log(data)
          console.log("five day 24 hr temp is:")
          console.log(data.list[7].main.temp)
        });
      } else {
        alert("Error: " + response.statusText);
      }
    }) 
}

var getUvIndex = function (uvUrl) {

  fetch(uvUrl)
    .then(function(response) {
      if(response.ok){
        response.json().then(function(data) {
          console.log("UV Index is:")
          console.log(data)
        });

      } else {
        alert("Error: " + response.statusText);
      }
    })
}

var getCurrentWeather = function(city) {

  // format the github api url
  // var apiUrl = "api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=json";
  // var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=New York&appid=277bb2e5372c4e82877ab645a3d8b117"
  var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiId 
  // make a request to the url
  fetch(apiUrl)
    .then(function(response) {
      // request was successful
      if (response.ok) {
        response.json().then(function(data) {
          console.log("This is current weather:")
          var currentTime = moment().hour()
          console.log(currentTime)
          console.log(data)
          console.log(data.main.temp)
          console.log(data.coord.lon)
          console.log(data.coord.lat)
          console.log(data.wind.speed)
          console.log(data.main.humidity)
          lat = data.coord.lat
          lon = data.coord.lon
          uvUrl = "http://api.openweathermap.org/data/2.5/uvi?appid=" + apiId  +  "&lat=" + lat + "&lon=" + lon
          getUvIndex(uvUrl)
          // displayRepos(data, user);
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

$("#basic-addon2").on("click", function(event) {
  event.preventDefault();  
  city = $("#form-input").val().trim();
  fiveDayUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiId
  getCurrentWeather(city)
  getFiveDay(fiveDayUrl)
})

// var fiveDayUrl = "https://api.openweathermap.org/data/2.5/forecast?q=York&appid=277bb2e5372c4e82877ab645a3d8b117"





