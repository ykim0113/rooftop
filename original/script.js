
var FlickrAPIKey = '6748e42913e9854eb379286582f0dcd7';
var OpenWeatherAPIKey= '0bcaa691a4d3cc51a49d105e071d6b68';
var GoogleMapAPIKey = '';

var query;

//user input
var cityName = prompt("Which city would you like to visit?", "");
if (cityName!= null) {
    document.getElementById("cityname").value = cityName;
    query = cityName;
}


// trusty array random picker
Array.prototype.pick = function() {
    return this[Math.floor(Math.random()*this.length)];
}


//get flickr photo under rooftop
function generate(query)
    {

        //query = city name
        query = cityName;
        $.ajax({
            url: 'https://api.flickr.com/services/rest/?method=flickr.photos.search&text='+ cityName + ' rooftop&format=json&nojsoncallback=1&api_key=' + FlickrAPIKey, success: function(data) {



           //original
          //'https://api.flickr.com/services/rest/?method=flickr.photos.search&text='+ cityName +' tour&format=json&nojsoncallback=1&api_key=' + FlickrAPIKey


            //data = photo
            console.log("   got images");

            var photo = data.photos.photo.pick();
            var imgUrl = "https://farm" + photo.farm + ".staticflickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + "_h.jpg";


            $('#imagebox').html('');
            $('#imagebox').append('<img src="' + imgUrl + '"/>');
            // $('body').css('background-image',imgUrl);
          },
          async: true,
          dataType:"json"
        });


}




//use weather api using city name
    var geocoder;
    var map;



    // function to geocode an address and plot it on a map
    function codeAddress(address) {
        var address = query;
        geocoder.geocode( {'address': address}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                latitude  = results[0].geometry.location["k"];
                longitude = results[0].geometry.location["A"];

                // latitude = 33.748995;
                // longitude = -84.387982;

                getWeather(cityName);                 // get weather for returned lat/long
                map.setCenter(results[0].geometry.location);                // center the map on address
                var marker = new google.maps.Marker({                       // place a marker on the map at the address
                    map: map,
                    position: results[0].geometry.location
                });

            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    }




    // google.maps.event.addDomListener(window, 'load', initialize);       // setup initial map

    function initialize() {
        geocoder        = new google.maps.Geocoder();                       // create geocoder object
        var latlng      = new google.maps.LatLng(40.6700, -73.9400);        // set default lat/long (new york city)
        var mapOptions  = {                                                 // options for map
            zoom: 8,
            center: latlng
        }
        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);   // create new map in the map-canvas div
    }



    // function to get weather for an address
    function getWeather(address) {
        var address = cityName;
        if(cityName != null || !cityName.equals("")) {
            $("#weather").val("Retrieving weather...");
            $.getJSON( "http://api.openweathermap.org/data/2.5/weather?q="+ cityName +'&appid=' + OpenWeatherAPIKey, function(data) {
                var currWeather = new Array();                              // create array to hold our weather response data
                currWeather['currTemp'] = Math.round(data.main.temp);               // current temperature

                currWeather['description'] = data.weather[0].description;              // short text description (ie. rain, sunny, etc.)                currWeather['icon'] = "http://openweathermap.org/img/w/"+data.weather[0].icon+".png";   // 50x50 pixel png icon


                var temp = currWeather['currTemp'] - 273.5;

                var response = temp +"\xB0 and "+currWeather['description'];


                    geocoder = new google.maps.Geocoder();

                    var latitude = data.coord.lat;
                    var longitude = data.coord.lon;
                                          // create geocoder object
                    var latlng      = new google.maps.LatLng(latitude, longitude);        // set default lat/long (new york city)
                    var mapOptions  = {                                                 // options for map
                        zoom: 8,
                        center: latlng
                    }

                    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);   // create new map in the map-canvas div

                    google.maps.event.addDomListener(window, 'load', initialize);


                console.log(data);                                              // log weather data for reference (json format)
                $("#weather").val(response);                                    // write current weather to textarea
            });
        } else {
            return false;                                                       // respond w/error if no address entered
        }
    }


window.onload = generate();
window.onload = getWeather();
        $(document).ready(function() {
          window.onload = function() {$('#imagebox').hide().fadeIn(1000);};
        });

