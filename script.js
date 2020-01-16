$(document).ready(function(){
  var cityWeatherButton = $('#search-button')
  var searchBarSection = $('.aside-section'); 
  var mainContentDiv = $('.main-content'); 
  var weatherCardsDiv = $('.weather-cards')
  //Grab elements from html
  //declare your variables

  //helper functions 


  //Get third party/API calls
  var apiKey = '8510c14918232716bc9743d7f1fc2f0c';

  var city = 'new york'; 
  var cityCode = '10029'

  var currentWeather = {

  }
  var weather = [{
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
       currentWeather.temp = response.main.temp;
       currentWeather.speed = currentWeather.windSpeed = response.wind.speed 
       currentWeather.humidity = response.main.humidity
       console.log(response.coord.lon)
      // currentWeather.response.coord.lon;
      uvIndex(response.coord.lon,response.coord.lat); 
      fiveDayWeather(response.coord.lon,response.coord.lat); 
    });
    //uvindex call
    function uvIndex (lon, lat){
      $.ajax({
        url: `http://api.openweathermap.org/data/2.5/uvi/forecast?appid=${apiKey}&lat=${lat}&lon=${lon}`,
        method: "GET"
      }).then(function(response){
        currentWeather.UvIndex = response[0].value; 
      })
    }
    //5 day forecast ajax call

  function fiveDayWeather(lon, lat){ 
    $.ajax({
      url: `https://api.openweathermap.org/data/2.5/forecast?appid=${apiKey}&lat=${lat}&lon=${lon}`,
      method: "GET"
    }).then(function(response){
      weather[0].firstDayTemp = response.list[0].main.temp
      weather[0].firstDayHumidity = response.list[0].main.humidity
      weather[0].firstDayIcon = response.list[0].weather[0].icon 

      weather[1].secondDayTemp = response.list[1].main.temp
      weather[1].secondDayHumidity = response.list[1].main.humidity
      weather[1].secondDayHumidity = response.list[1].weather[0].icon

      weather[2].thirdDayTemp = response.list[2].main.humidity
      weather[2].thirdDayHumidity = response.list[2].main.humidity
      weather[2].thirdDayIcon = response.list[2].weather[0].icon 

      weather[3].thirdDayTemp = response.list[3].main.humidity
      weather[3].thirdDayHumidity = response.list[3].main.humidity
      weather[3].thirdDayIcon = response.list[3].weather[0].icon 

      weather[4].thirdDayTemp = response.list[4].main.humidity
      weather[4].thirdDayHumidity = response.list[4].main.humidity
      weather[4].thirdDayIcon = response.list[4].weather[0].icon 

      storeItems(); 
      renderWeatherCards(); 
      renderWeatherMain(); 
      })
    }
  }
  // window.localStorage.setItem("savedEventsArray", JSON.stringify(eventsArray)); 

  function storeCity(){
     window.localStorage.setItem("citiesList", JSON.stringify(citiesList)); 
  }



  //Update data
  function renderWeatherCards(){

  }
function renderWeatherMain(){

}

  //user input 
  //click on button 
  cityWeatherButton.click(function(event){
    event.preventDefault();
    // var input = $('#input-city').val();
    var $inputCity = $('#input-city');
    inputCity = $('#input-city').val().trim();
    
    citiesList.push(inputCity); 
    $('#input-city').text('') 
    //storeCity();
    weatherAPICall(inputCity);
  })

  //save to local storage
  //display function
    //parse and grab local storage
    // 
})
