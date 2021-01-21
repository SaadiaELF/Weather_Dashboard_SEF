
function createButtons() {

    searchHistory = JSON.parse(localStorage.getItem("History"));

    $.each(searchHistory, function (i, element) {
        var newElt = $("<button>");
        newElt.text(element);
        newElt.addClass("button list-group-item");
        newElt.attr("data-index", i);
        $("#SearchHistory").append(newElt);
    });
};


$(document).on("click", ".button", function (event) {
    event.preventDefault();

    displaySearchHistory();

    $("#weatherCard").attr("style", "display:block ; padding-left:0");
    $("#searchCard").attr("style", "display:block ; width:100%");
    $("#forcastSection").attr("style", "display:block ; margin-top:10px");

    localStorage.setItem("City",  $(this).text());

    APIfunction();
   
});

function displaySearchHistory() {

    $("#SearchHistory").empty();

    var newCity = $("#searchInput").val().trim().toLowerCase();
    localStorage.setItem("City", newCity);

    var searchHistory = JSON.parse(localStorage.getItem("History")) || []
    searchHistory.push(newCity);
    uniqSearchHistory = [...new Set(searchHistory)];

    localStorage.setItem("History", JSON.stringify(uniqSearchHistory));

    createButtons();
};


function APIfunction() {

    var currentDate = moment().format('L');
    var APIKey = "050af8688da478cbcad8a4d3f154271f";
    var city = localStorage.getItem("City");
    var queryURL1 = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey;


    $.ajax({
        url: queryURL1,
        method: "GET"
    }).then(function (response) {

        var K = response.list[0].main.temp;
        var F = (K - 273.15) * 1.80 + 32;
        var humidity = response.list[0].main.humidity;
        var wind = response.list[0].wind.speed;
        var icon = response.list[0].weather[0].icon;
        var todayIcon = "<img src=http://openweathermap.org/img/wn/" + icon + "@2x.png>"

        for (var i = 1; i < 6; i++) {
            var dayK = response.list[i].main.temp;
            var dayF = (dayK - 273.15) * 1.80 + 32;
            var dayHumidity = response.list[i].main.humidity;
            var dayIcon = response.list[i].weather[0].icon;
            var dayIconLink = "<img src=http://openweathermap.org/img/wn/" + dayIcon + "@2x.png>";

            var date = moment().add(i, 'days').format('L');

            $("#cityName").html(response.city.name + "  (" + currentDate + ") " + todayIcon);

            $("#day0" + i).html(
                date + "<br>" +
                dayIconLink + "<br>" +
                "Temp : " + dayF.toFixed(2) + " °F" + "<br>" +
                "Humidity : " + dayHumidity + " %"
            );


        };


        var lat = response.city.coord.lat;
        var lon = response.city.coord.lon;
        var queryURL2 = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=hourly,daily" + "&appid=" + APIKey;

        $.ajax({
            url: queryURL2,
            method: "GET"
        }).then(function (response) {

            var UVI = response.current.uvi;
            $("#cityForcast").html(
                "Temperature : " + F.toFixed(2) + " °F" + "<br>" +
                "Humidity : " + humidity + " %" + "<br>" +
                "Wind speed : " + wind + " MPH" + "<br>" +
                "UV index : " + "<span id='UVI'>" + UVI.toFixed(2) + "</span>"
            );

            if (UVI <= 2) {
                $("#UVI").addClass("bg-success");
            } else if ((UVI > 2 && UVI >= 7)) {
                $("#UVI").addClass("bg-warning");
            } else if ((UVI > 7)) {
                $("#UVI").addClass("bg-danger");
            };

            $("#UVI").attr("data-bs-toggle", "tooltip");
            $("#UVI").attr("title", "UV Index scale : UVI<2 favorable ; 2<UVI<7 moderate; UVI>7 severe");
            $("#UVI").attr("data-bs-placement", "right");


        });

    });

};

$(document).ready(function () {

    $("#searchBtn").on("click", function (event) {
        event.preventDefault();

        displaySearchHistory();

        $("#weatherCard").attr("style", "display:block ; padding-left:0");
        $("#searchCard").attr("style", "display:block ; width:100%");
        $("#forcastSection").attr("style", "display:block ; margin-top:10px");
      
        APIfunction();
       
    });

});

$(window).on('load', function() {
    
        $("#weatherCard").attr("style", "display:block ; padding-left:0");
        $("#searchCard").attr("style", "display:block ; width:100%");
        $("#forcastSection").attr("style", "display:block ; margin-top:10px");
        
        searchH = JSON.parse(localStorage.getItem("History"));
        console.log(searchH)
        displaySearchHistory();
        var lastCity = searchH[searchH.length - 2]
        console.log(lastCity)
        localStorage.setItem("City", lastCity);
       
        APIfunction();
    
});