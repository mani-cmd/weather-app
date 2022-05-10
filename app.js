import "./style.css";
import mapboxgl from "mapbox-gl/dist/mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { createApi } from "unsplash-js";

const LocationButtonElement = document.querySelector("#location-btn");
const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const UNSPLASH_API_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY

if (navigator.geolocation) {
    LocationButtonElement.addEventListener("click", () => {
        navigator.geolocation.getCurrentPosition(showPositions);
    });

    let latitude;
    let longitude;

    function showPositions(position) {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        setWeatherData(latitude, longitude);
    }
}

const unsplash = createApi({
    accessKey: UNSPLASH_API_KEY,
    fetch: fetch
  });
  
async function setWeatherData(lat, long) {
    let weatherUrl = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&appid=${WEATHER_API_KEY}`;
    let response = await fetch(weatherUrl);
    let data = await response.json();

    let location = document.querySelector(".location");
    let latitude = document.querySelector(".latitude");
    let longitude = document.querySelector(".longitude");
    let weather = document.querySelector(".weather");
    let weatherDis = document.querySelector(".weatherDis");
    let temperature = document.querySelector(".temperature");
    let windSpeed = document.querySelector(".wind-speed");
    let windDirection = document.querySelector(".wind-direction");

    location.innerHTML = data.name;
    longitude.innerHTML = data.coord.lon;
    latitude.innerHTML = data.coord.lat;
    weather.innerHTML = data.weather[0].main;
    weatherDis.innerHTML = data.weather[0].description;
    temperature.innerHTML = data.main.temp + " &#8451";
    windSpeed.innerHTML = data.wind.speed + " meter/sec";
    windDirection.innerHTML = data.wind.deg + " &#176";

    console.log(data);
    setBackground(data.weather[0].description);
}

let setBackground = async (info) => {
 let imgData = await unsplash.search.getPhotos({
    query: info,
    page: 1,
    perPage: 10,
 })
    let random = Math.floor((Math.random() * 10))
    let linking = document.querySelector("#linking")
    linking.href = imgData.response.results[random].links.html
    document.body.style.backgroundImage = `url(${imgData.response.results[random].urls.regular})`
    console.log(imgData.response.results[random].urls.small)
}

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    types: "country,region,place,postcode,locality,neighborhood",
});

geocoder.addTo("#geocoder");

// Get the geocoder results container.
// const results = document.getElementById("result");

// Add geocoder result to container.
geocoder.on("result", (e) => {
    let results = e.result;

    setWeatherData(results.center[1], results.center[0]);
});

// Clear results container when search is cleared.
geocoder.on("clear", () => {
    results.innerText = "";
});

// Call function with default parameters
setWeatherData(13.0827, 80.2707);
