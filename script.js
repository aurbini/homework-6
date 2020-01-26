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
      url: `https://api.openweathermap.org/data/2.5/weather?q=${inputCity}&APPID=` +apiKey+'&units=imperial',
      method: "GET"
    }).then(function(response){
      //console.log(response); 
       currentWeather[0] = response.name; 
       currentWeather[1] = `Temperature: ${response.main.temp}`;
       currentWeather[3] = `Wind Speed: ${response.wind.speed}`;
       currentWeather[4] = `Humidity: ${response.main.humidity}`;
       var weatherIcon = response.weather[0].icon;
       uvIndex(response.coord.lon,response.coord.lat); 
      fiveDayWeather(response.coord.lon,response.coord.lat, weatherIcon); 
      renderCitiesList(); 

    });
    //uvindex call
    function uvIndex (lon, lat){
      $.ajax({
        url: `https://api.openweathermap.org/data/2.5/uvi/forecast?appid=${apiKey}&lat=${lat}&lon=${lon}`,
        method: "GET"
      }).then(function(response){
        currentWeather[4] = `UV: ${response[0].value}`; 
      })
    }
    //5 day forecast ajax call

  function fiveDayWeather(lon, lat, weatherIcon){ 
    $.ajax({
      url: `https://api.openweathermap.org/data/2.5/forecast?appid=${apiKey}&lat=${lat}&lon=${lon}&units=imperial`,
      method: "GET"
    }).then(function(response){
      var hour = response.list;
      console.log(hour[0].weather[0].icon);
      //var daysOfWeek = {}
      // console.log(response.list)
      // console.log(response.list[0].weather[0].icon);
      daysOfWeek = response.list.slice(0, 5).map(
        function(day, index){
          return {
            temp: day.main.temp,
            humidity: day.main.humidity,
            icon: day.weather[0].icon
          };
        }
        // for(var i = 0; i < hour.length; i++){
        //   if(i === 0 || i === 8 || i === 16 || i === 24 || i === 32 ){
        //     daysOfWeek
        //   }
        // }
      )
      //storeItems(); 
      renderWeatherCards(); 
      renderWeatherMain(weatherIcon); 
      })
    }
  }
    function storeInformation(){
      window.localStorage.setItem("citiesList", JSON.stringify(citiesList)); 
      window.localStorage.setItem("daysOfWeek", JSON.stringify(daysOfWeek)); 
  }

  //Update data
  function renderCitiesList(){
    $('.cities-list').empty(); 
    var parsedList = JSON.parse(localStorage.getItem("citiesList"))
    console.log(parsedList); 
    if(parsedList === null){
      return;
    }
    for(var i = 0; i < parsedList.length; i++){
      var storedCity = parsedList[i];
      console.log(storedCity); 
       $('.cities-list').append($('<li class=list-group-item>').text(parsedList[i]));
    }
  }

  function renderWeatherCards(){
    weatherCardsDiv.empty();
    var m = moment()
    var currentDate = m.format('MM-DD-YYYY')
    
    //weatherCardsDiv.append($('<h2 class=five-day-heading>Five Day Forecast</h2>'))
    daysOfWeek.forEach(day => {
      var weatherCardcol = $('<div class="col-md-12 col-lg-2"></div>')
      weatherCardsDiv.append(weatherCardcol)
      //console.log(day);
      weatherCardcol.append($(`
          <div class="card bg-primary mb-2 card-content">
            <div class="card-body text-center">
              <p class="card-stat">${currentDate}</p>
              <p class="card-stat text-light">${day.temp}</p>
              <p class="card-stat">${day.humidity}%</p>
              <img align="middle" card-image" src="http://openweathermap.org/img/wn/${day.icon}@2x.png">
            </div>
          </div>
      `))
    });
  }
  //tried to put this in my append function above but does not work
  //            //<img src = http://openweathermap.org/img/wn/10d@2x.png/>

function renderWeatherMain(weatherIcon){
  console.log(weatherIcon);
 var weatherpic = $(`<img src="http://openweathermap.org/img/wn/${weatherIcon}@2x.png">`);
 // mainContentDiv.empty(); 
 $('.main-display').empty(); 
  var todayWeatherDiv = $('<div>').attr('class', 'todays-weather-div') 
 // mainContentDiv.append(todayWeatherDiv);
 $('.main-display').append(todayWeatherDiv);  
  for(var i = 0; i < currentWeather.length; i++){
    //console.log('main')
    var currentWeatherStat = $('<p>');
    currentWeatherStat.attr('class','todayWeatherStat')
    if(i === 0){
      var m = moment()
      var currentDate = m.format('MM-DD-YYYY')
      var date = $('<span>').text(`(${currentDate})`).addClass('date');
      //console.log(date); 
      currentWeatherStat.addClass(`main-${i}`)
    }
    currentWeatherStat.text(currentWeather[i]); 
    todayWeatherDiv.append(currentWeatherStat); 
    if(i === 0) {currentWeatherStat.append(date).append(weatherpic); 
      }
    }
  }
var parsedList =  JSON.parse(localStorage.getItem("citiesList"))



  function init(){
    if(parsedList === null){
      parsedList = 'Miami';
      weatherAPICall(parsedList);  
      $('cities-list').append($('<li>Miami</li>'))
      console.log(parsedList);
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
    // renderCitiesList(); 
    weatherAPICall(inputCity);
  })
})
