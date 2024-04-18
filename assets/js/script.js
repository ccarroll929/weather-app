let apiKey = '7908e8fb0e6050b033a8788f75b8233b';


$(document).ready(function (){
    $('#search-button').on('click', function (){
        let searchTerm = $('#search-value').val();
    $('#search-value').val('');
    weatherFunction(searchTerm);
    weatherForecast(searchTerm);
    })
});

// get previous searches from local storage
let history = JSON.parse(localStorage.getItem('history')) || [];

if (history.length > 0 ) {
    weatherFunction(history[history.length -1]);
}

// create a row for each element in the search history array
for (var i = 0; i < history.length; i++) {
    createRow(history[i]); 
}

function createRow(text) {
    let searchListItem = $('<li>').addClass('list-group-item').text(text);
    $('.history').append(searchListItem);
}

// event listener for search button
$('.history').on('click', "li", function (){
    weatherFunction($(this).text());
    weatherForecast($(this).text());
});

function weatherFunction(searchTerm) {
    $.ajax({
        type: "GET",
        url: "https://api.openweathermap.org/data/2.5/weather?q=" + searchTerm + "&appid=" + apiKey + "&units=imperial",
    }).then(function (data) {
        // if search value does not exist
        if (history.indexOf(searchTerm)=== -1) {
            history.push(searchTerm);
        // add item to localStorage
        localStorage.setItem('history', JSON.stringify(history));
        createRow(searchTerm); 
        }

        $('#date').empty(); 

    let title = $("<h3>").addClass("card-title").text(data.name + " (" + new Date().toLocaleDateString() + ")");
    let img = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png");

    let card = $('<div>').addClass('card');
    let cardBody = $('<div>').addClass('card-body');
    let temperature = $('<h4>').addClass('card-text').text('Temperature: ' + data.main.temp + ' F');
    let humidity = $('<h4>').addClass('card-text').text('Humidity: ' + data.main.humidity + ' %');
    let wind = $('<h4>').addClass('card-text').text('Wind Speed: ' + data.wind.speed + ' mph'); 
    console.log(data); 
    lon = data.coord.lon;
    lat = data.coord.lat; 
    title.append(img);
      cardBody.append(title, temperature, humidity, wind);
      card.append(cardBody);
      $("#today").append(card);
      console.log(data);
    });
}

function weatherForecast(searchTerm) {
    $.ajax({
        type: "GET",
        url: "https://api.openweathermap.org/data/2.5/forecast?q=" + searchTerm + "&appid=" + apiKey + "&units=imperial",
    }).then(function (data){
        console.log(data);
        $('#forecast').html("<h4 class=\'mt-3\'>5 Day Forecast: </h4>").append('<div class=\'row\'>');

    for (var i = 0; i < data.list.length; i++){
        if (data.list[i].dt_txt.indexOf("15:00:00") !== -1){
            let forecastTitle = $('<h3>').addClass('card-title').text(new Date(data.list[i].dt_txt).toLocaleDateString(window.navigator.language, {weekday: 'long'}));
            let forecastIcon = $('<img>').attr('src', "https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");
            let forecastCol = $('<div>').addClass('col-md-2.5');
            let forecastCard = $('<div>').addClass('card');
            let cardBody = $('<div>').addClass('card-body p-2');
            let forecastTemp = $('<div>').addClass('card-text').text('Temperature: ' + data.list[i].main.temp + ' °F');
            let forecastHumid = $('<div>').addClass('card-text').text('Humidity: ' + data.list[i].main.humidity + ' %');
            let forecastWind = $('<div>').addClass('card-text').text('Wind Speed: ' + data.list[i].wind.speed + ' mph');

            forecastCol.append(forecastCard.append(cardBody.append(forecastTitle, forecastIcon, forecastTemp, forecastHumid, forecastWind)));
            $('#forecast .row').append(forecastCol); 
        }
    }
    })
}