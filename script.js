$(document).ready(function(){
  var cityWeatherButton = $('#search-button')
  var searchBarSection = $('.aside-section'); 
  var mainContentDiv = $('.main-content'); 
  var weatherCardsDiv = $('.weather-cards')
  //Grab elements from html
  //Get third party/API calls
  var apiKey = '8510c14918232716bc9743d7f1fc2f0c';
  var city = 'new york'; 
  var cityCode = '10029'

  var currentWeather = [];
  var daysOfWeek = [{
                  }, {
                  }, {
                  }, {
                  }, {
                  }]

var citiesList = [];

  function weatherAPICall(inputCity){
    $.ajax({
      url: `http://api.openweathermap.org/data/2.5/weather?q=${inputCity}&APPID=` +apiKey+'&units=imperial',
      method: "GET"
    }).then(function(response){
      //console.log(response); 
       currentWeather[0] = response.name; 
       currentWeather[1] = response.main.temp;
       currentWeather[2] = currentWeather.windSpeed = response.wind.speed 
       currentWeather[3] = response.main.humidity
      uvIndex(response.coord.lon,response.coord.lat); 
      fiveDayWeather(response.coord.lon,response.coord.lat); 
    });
    //uvindex call
    function uvIndex (lon, lat){
      $.ajax({
        url: `http://api.openweathermap.org/data/2.5/uvi/forecast?appid=${apiKey}&lat=${lat}&lon=${lon}`,
        method: "GET"
      }).then(function(response){
        currentWeather[4] = response[0].value; 
      })
    }
    //5 day forecast ajax call

  function fiveDayWeather(lon, lat){ 
    $.ajax({
      url: `https://api.openweathermap.org/data/2.5/forecast?appid=${apiKey}&lat=${lat}&lon=${lon}`,
      method: "GET"
    }).then(function(response){
      daysOfWeek = response.list.slice(0, 5).map(
        function(day, index){
          //console.log('adding day of the week to daysOfWeek', day);
          return {
            temp: day.main.temp,
            humidity: day.main.humidity,
            icon: day.weather.icon
          };
        }
      )
      //storeItems(); 
      renderWeatherCards(); 
      renderWeatherMain(); 
      })
    }
  }
    function storeInformation(){
      window.localStorage.setItem("citiesList", JSON.stringify(citiesList)); 
      window.localStorage.setItem("daysOfWeek", JSON.stringify(daysOfWeek)); 
  }

  //Update data
  var parsedList = ''
  function renderCitiesList(){
    $('.cities-list').empty(); 
    var parsedList = JSON.parse(localStorage.getItem("citiesList"))
    console.log(parsedList); 
    for(var i = 0; i < parsedList.length; i++){
      var storedCity = parsedList[i];
      console.log(storedCity); 
       $('.cities-list').append($('<li class=list-group-item>').text(parsedList[i]));
    }
  }
  function renderWeatherCards(){
    weatherCardsDiv.empty();
    daysOfWeek.forEach(day => {
      weatherCardsDiv.append($(`
        <div class="card bg-primary card-content">
          <div class="card-body"
            <p>${ day.temp }</p>
            <p>${ day.humidity }</p>
            <p>${ day.icon }</p>
          </div>
        </div>
      `))
    });
  }

function renderWeatherMain(){
  mainContentDiv.empty(); 
  for(var i = 0; i < currentWeather.length; i++){
    var currentWeatherStat = $('<p class="main-content>');
    currentWeatherStat.text(currentWeather[i]); 
    mainContentDiv.append(currentWeatherStat); 
  }
}

// renderCitiesList(); 
  function init(){
    if(parsedList = ''){
      parsedList = 'Miami';
      weatherAPICall(parsedList);  
    }else {
      var lastCity = JSON.parse(localStorage.getItem("citiesList"))
      weatherAPICall(lastCity[0]);
    }
  }
  init(); 



  cityWeatherButton.click(function(event){
    event.preventDefault();
    //var $inputCity = $('#input-city');
    inputCity = $('#input-city').val().trim();
    
    citiesList.push(inputCity); 
    $('#input-city').text('') 
    //console.log(citiesList); 
    storeInformation();
    renderCitiesList(); 
    weatherAPICall(inputCity);
  })
})
