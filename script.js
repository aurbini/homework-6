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
       currentWeather[1] = response.main.temp;
       currentWeather[2] = currentWeather.windSpeed = response.wind.speed 
       currentWeather[3] = response.main.humidity
      uvIndex(response.coord.lon,response.coord.lat); 
      fiveDayWeather(response.coord.lon,response.coord.lat); 
      renderCitiesList(); 

    });
    //uvindex call
    function uvIndex (lon, lat){
      $.ajax({
        url: `https://api.openweathermap.org/data/2.5/uvi/forecast?appid=${apiKey}&lat=${lat}&lon=${lon}`,
        method: "GET"
      }).then(function(response){
        currentWeather[4] = response[0].value; 
      })
    }
    //5 day forecast ajax call

  function fiveDayWeather(lon, lat){ 
    $.ajax({
      url: `https://api.openweathermap.org/data/2.5/forecast?appid=${apiKey}&lat=${lat}&lon=${lon}&units=imperial`,
      method: "GET"
    }).then(function(response){
      daysOfWeek = response.list.slice(0, 5).map(
        function(day, index){
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

      
      weatherCardsDiv.append($(`
        <div class="card bg-primary mb-2 col-sm-12 col-lg-2 card-content">
          <div class="card-body">
            <p class="card-stat">${currentDate}</p>
            <p class="card-stat text-light">${day.temp}</p>
            <p class="card-stat ">${day.humidity}</p>
          </div>
        </div>
      `))
    });
  }
  //tried to put this in my append function above but does not work
  //            //<img src = http://openweathermap.org/img/wn/10d@2x.png/>

function renderWeatherMain(){
  mainContentDiv.empty(); 
  var todayWeatherDiv = $('<div>').attr('class', 'todays-weather-div') 
  mainContentDiv.append(todayWeatherDiv); 
  for(var i = 0; i < currentWeather.length; i++){
    //console.log('main')
    var currentWeatherStat = $('<p>');
    currentWeatherStat.attr('class','todayWeatherStat')
    if(i === 0){
      var m = moment()
      var currentDate = m.format('MM-DD-YYYY')
      var date = $('<span>').text(`(${currentDate})`).addClass('date');
      console.log(date); 
      currentWeatherStat.addClass(`main-${i}`)
    }
    currentWeatherStat.text(currentWeather[i]); 
    todayWeatherDiv.append(currentWeatherStat); 
    if(i === 0) currentWeatherStat.append(date); 
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
