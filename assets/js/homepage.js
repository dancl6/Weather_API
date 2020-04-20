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


var addHistoryButton = function (city) {
var elCreate = document.createElement("button")
var elExist = document.getElementById("history-list-id")
var appended = elExist.appendChild(elCreate)
elCreate.setAttribute("id", city)
appended.textContent = city

}




var getFiveDay = function (fiveDayUrl) {
  fetch(fiveDayUrl)
    .then(function(response) {
      if(response.ok){
        response.json().then(function(data) {
          console.log("Five Day Forecast is:");
          console.log(data);
          console.log("five day 24 hr temp is:");
          console.log(data.list[7].main.temp);
          console.log(data.list[7].weather[0].description);
          descriptionImage = data.list[7].weather[0].description;
          for (var i=0; i<5; i++){
            var j = i+1;
            var hour = 8*j-2+1;
            var gifIcon = data.list[hour].weather[0].icon;
            gifOpenWeather = "http://openweathermap.org/img/wn/" + gifIcon +"@2x.png";
            console.log("gif open weather is :" + gifOpenWeather);
            // getGif(gifOpenWeather);
            // getDescriptionImage(descriptionImage)
            document.getElementById("image-day"+j).src=gifOpenWeather
            // elDate.textContent = gif;
            var dateDayJ = "dateDay" + j
            dateDayJ = data.list[hour].dt_txt;
            dateDayJ = moment(dateDayJ).format('(MM/DD/YYYY)')
            var elDate = document.getElementById("day" + j + "-id-date");
            elDate.textContent=dateDayJ;
            var elTemp = document.getElementById("day" + j + "-temp")
            var tempK = data.list[hour].main.temp
            var tempF = (tempK - 273.15)*9/5 + 32
            tempF = tempF.toPrecision(3)
            elTemp.textContent = "Temp: " + tempF + " °F"
            var elHum = document.getElementById("day" + j + "-hum")
            elHum.textContent = "Humidity: " + data.list[hour].main.humidity + "%"
          }
          
          // console.log("date day 1 is : " + dateDay1)
          // console.log("gif is :" + gif);
          var timeString = data.list[7].dt_txt;
          var timeString2 = timeString.split(" ");
          var timeStringIndex = timeString2[1];
          var hour = timeStringIndex.charAt(0) + timeStringIndex.charAt(1);          
          hour = parseInt(hour, 10);
          console.log("hour is :" + hour);
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
          console.log("UV Index is:");
          console.log(data);
          console.log(data.value);
          var elCurUv2 = document.getElementById("uv-text");
          elCurUv2.classList.remove("btn-success")
          elCurUv2.classList.remove("btn-warning")
          elCurUv2.classList.remove("btn-danger")
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
          var elCurCity = document.getElementById("current-city")
          
          // document.querySelector("#current-temp").value = data.main.temp
          var tempF = (data.main.temp - 273.15)*9/5 + 32
          tempF = tempF.toPrecision(3)
          var elCurTemp = document.getElementById("current-temp")
          elCurTemp.textContent = "Temperature: " +  tempF + " °F"
          var elCurHum = document.getElementById("current-humidity")
          elCurHum.textContent = "Humidity: " + data.main.humidity + "%"
          var elCurSpeed = document.getElementById("current-windspeed")
          var speedMph = 2.237*data.wind.speed
          speedMph = speedMph.toPrecision(3)
          elCurSpeed.textContent = "Wind Speed: " +  speedMph + "MPH"
          console.log(data.coord.lon)
          console.log(data.coord.lat)
          console.log(data.wind.speed)
          console.log(data.main.humidity)
          console.log("time zone is :  " + data.timezone)
          var deltaTime = (data.timezone-3*60*60)/60
          var curTim = moment().utcOffset(deltaTime).format("MM-DD-YYYY");
          var curTim2 = moment().utcOffset(deltaTime).format("LLLL");
          console.log("cur time 2 is : " + curTim2)
          elCurCity.textContent = data.name + " (" + curTim + ")";
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


  var weatherHistory = localStorage.getItem("weather-history")
  var existingHistory = weatherHistory.split(",")
  console.log("Existing History: " + existingHistory)
  for (var k=0; k<existingHistory.length;k++){
    addHistoryButton(existingHistory[k])
  }

$("#basic-addon2").on("click", function(event) {
  event.preventDefault();  
  var display=document.querySelector("#visibility").removeAttribute("hidden")
  // var check2 = document.querySelector("#basic-addon2")

  // console.log(check2)
  city = $("#form-input").val().trim();
  fiveDayUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiId
  var cityId = "#"+city
  console.log(cityId)
  


  historyList.push(city)
  localStorage.setItem("weather-history", historyList)
  addHistoryButton(city)
  // var check = $("<button>").attr("id").val();
  // console.log(check)  
  getCurrentWeather(city)
  getFiveDay(fiveDayUrl)
})

// $("button").click(function() {
//   alert(this.id)
// })

// var fiveDayUrl = "https://api.openweathermap.org/data/2.5/forecast?q=York&appid=277bb2e5372c4e82877ab645a3d8b117"





