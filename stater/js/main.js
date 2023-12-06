function getWeather() {
  var city = $("#city").val();

  getCoordinatesForCity(city, function(coordinates) {
    if (coordinates) {
      var apiUrl = `http://www.7timer.info/bin/api.pl?lon=${coordinates.lon}&lat=${coordinates.lat}&product=astro&output=json`;

      $.ajax({
        url: apiUrl,
        method: "GET",
        dataType: "json",
        success: function (data) {
          displayWeatherData(data);
        },
        error: function () {
          alert("Error fetching weather data.");
        }
      });
    } else {
      alert("Coordinates not available for the specified city.");
    }
  });
}

function displayWeatherData(data) {
  var weatherDataElement = $("#weatherData");
  weatherDataElement.html("<h2>Weather Information</h2>");

  weatherDataElement.append(`<p>Temperature: ${data.dataseries[0].temp2m}°C</p>`);
  weatherDataElement.append(`<p>Cloud Cover: ${data.dataseries[0].cloudcover}%</p>`);
  // Add more information as needed
}

function getCoordinatesForCity(city, callback) {
  $.ajax({
    url: '../city_coordinates.csv',
    dataType: 'text',
    success: function (data) {
      var lines = data.split('\n');
      var cityCoordinates = {};

      for (var i = 1; i < lines.length; i++) { // Skip header line
        var columns = lines[i].split(',');
        var cityName = columns[2].trim(); // Assuming city column is at index 2

        cityCoordinates[cityName] = {
          lat: parseFloat(columns[0].trim()), // Assuming latitude column is at index 0
          lon: parseFloat(columns[1].trim()), // Assuming longitude column is at index 1
        };
      }

      var coordinates = cityCoordinates[city];
      callback(coordinates);
    },
    error: function () {
      alert("Error reading city coordinates from CSV.");
      callback(null);
    }
  });
}
