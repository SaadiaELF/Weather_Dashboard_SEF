//Creating <button> for every city from the search history,

function createButtons() {

    // the search history is stored in the localStorage as string
    // it's converted back to an array
    searchHistory = JSON.parse(localStorage.getItem("History"));

    $.each(searchHistory, function (i, element) {
        var newElt = $("<button>");
        newElt.text(element);
        newElt.addClass("button list-group-item");
        $("#SearchHistory").append(newElt);
    });
};

// This function store a new city from the search input to an array in the local storage

function displaySearchHistory() {

    $("#SearchHistory").empty();

    // creating a localStorage to hold the city's name
    var newCity = $("#searchInput").val().trim().toLowerCase();
    localStorage.setItem("City", newCity);

    // pushing the city's name into an array 
    var searchHistory = JSON.parse(localStorage.getItem("History")) || [];
    searchHistory.push(newCity);

    //Creating this array to hold the searchHistory array withou repeated elements
    uniqSearchHistory = [...new Set(searchHistory)];

    //storing the array uniqSearchHistory after converting it into a string in the localStorage 
    localStorage.setItem("History", JSON.stringify(uniqSearchHistory));

    createButtons();
};

// This function display dynamicaly the page content
function displayContent() {

    $("#weatherCard").css("display", "block");
    $("#searchCard").css({ "display": "block", "width": "100%" });
    $("#forcastSection").css("display", "block");

};

// This function create code color for every UV index value
function UVIScale(UVI) {
    if (UVI <= 2) {
        $("#UVI").addClass("bg-success");
    } else if ((UVI > 2 && UVI >= 7)) {
        $("#UVI").addClass("bg-warning");
    } else if ((UVI > 7)) {
        $("#UVI").addClass("bg-danger");
    };
};

// This function add a Tooltip tp the UVI value to explain the code color
function addTooltip() {
    $("#UVI").attr("data-bs-toggle", "tooltip");
    $("#UVI").attr("title", "UV Index scale : UVI<2 favorable ; 2<UVI<7 moderate; UVI>7 severe");
    $("#UVI").attr("data-bs-placement", "right");
};

// This function hold the APIs requests and their responses
function APIfunction() {

    // Building the URL to query the first database
    var APIKey = "050af8688da478cbcad8a4d3f154271f";
    var city = localStorage.getItem("City");
    var queryURL1 = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey;

    // creating the AJAX call for the first API
    $.ajax({
        url: queryURL1,
        method: "GET"
    }).then(function (response) {

        //Calling the currentDate via moment function
        var currentDate = moment().format('L');
        // Calling specific parameters for the current day from the first database and holding them in variables
        var K = response.list[0].main.temp;
        var F = (K - 273.15) * 1.80 + 32;
        var humidity = response.list[0].main.humidity;
        var wind = response.list[0].wind.speed;
        var icon = response.list[0].weather[0].icon;
        var todayIcon = "<img src=http://openweathermap.org/img/wn/" + icon + "@2x.png>"

        //printing the city's name and the current date in the screen 
        $("#cityName").html(response.city.name + "  (" + currentDate + ") " + todayIcon);

        // Calling specific parameters for the future 5 days from the first database and holding them in variables
        for (var i = 1; i < 6; i++) {
            var dayK = response.list[i].main.temp;
            var dayF = (dayK - 273.15) * 1.80 + 32;
            var dayHumidity = response.list[i].main.humidity;
            var dayIcon = response.list[i].weather[0].icon;
            var dayIconLink = "<img src=http://openweathermap.org/img/wn/" + dayIcon + "@2x.png>";
            //Calling the future days date via moment function
            var date = moment().add(i, 'days').format('L');

            //printing the parameters in the screen 
            $("#day0" + i).html(
                date + "<br>" +
                dayIconLink + "<br>" +
                "Temp : " + dayF.toFixed(2) + " °F" + "<br>" +
                "Humidity : " + dayHumidity + " %"
            );

        };

        // Building the URL to query the second database
        var lat = response.city.coord.lat;
        var lon = response.city.coord.lon;
        var queryURL2 = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=hourly,daily" + "&appid=" + APIKey;

        // creating the AJAX call for the second API
        $.ajax({
            url: queryURL2,
            method: "GET"
        }).then(function (response) {

            // Calling the specific parameter for the UVI from the second database and holding it in a variable
            var UVI = response.current.uvi;

            //printing the parameters in the screen 
            $("#cityForcast").html(
                "Temperature : " + F.toFixed(2) + " °F" + "<br>" +
                "Humidity : " + humidity + " %" + "<br>" +
                "Wind speed : " + wind + " MPH" + "<br>" +
                "UV index : " + "<span id='UVI'>" + UVI.toFixed(2) + "</span>"
            );

            //Calling functions
            UVIScale(UVI)
            addTooltip();
            displayContent();

        });

    });

};

//Adding a click event to the search history buttons 
//to display the current and future conditions again
$(document).on("click", ".button", function (event) {
    event.preventDefault();

    displaySearchHistory();

    localStorage.setItem("City", $(this).text());

    APIfunction();

});


$(document).ready(function () {
//Adding a click event to the search button to display 
//the current and future conditions for the searched city
    $("#searchBtn").on("click", function (event) {
        event.preventDefault();

        displaySearchHistory();

        APIfunction();

    });

});

//Adding an event when the page is loaded to show the last search results
$(window).on('load', function () {

    displaySearchHistory();
    var index = searchHistory.length
    while (index-- && !searchHistory[index]);
    var lastCity = searchHistory[index];
    localStorage.setItem("City", lastCity);

    APIfunction();

});