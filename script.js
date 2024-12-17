const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-details");
const formContainer = document.querySelector(".form-container");
const loadingScreen = document.querySelector(".loading-container");
const weatherInfo = document.querySelector(".user-info-container");
const grantLocation = document.querySelector(".grant-location-container")

const API_KEY = '90c3f040546c78037c2e56cc5895bfa9';
let currentTab = userTab;
currentTab.classList.add("current-tab");
chkSessionStorage();
// switch tab function
function switchTab(clickedTab){
    if(clickedTab!=currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if(!formContainer.classList.contains("active")){
            grantLocation.classList.remove("active");
            weatherInfo.classList.remove("active");
            formContainer.classList.add("active");
        }
        else{
            formContainer.classList.remove("active");
            weatherInfo.classList.remove("active");
            chkSessionStorage();
            
        }
    }
}
function chkSessionStorage(){
    let localCoordinates = sessionStorage.getItem("currLocation");
    if(!localCoordinates){
        grantLocation.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchCoordinates(coordinates);
    }

}
async function fetchCoordinates(coordinates){ 
    const {lat,lon} = coordinates;
    //call api
    grantLocation.classList.remove("active");
    loadingScreen.classList.add("active");

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        weatherInfo.classList.add("active");
        renderWeatherInfo(data);
    } catch (e) {
        loadingScreen.classList.remove("active");
        //alert("Could not fetch the weather");
        
    }
}
function renderWeatherInfo(data){
    let cityName = document.querySelector('[data-cityName]');
    let countryIcon = document.querySelector('[data-countryIcon]');
    let WeatherInformation = document.querySelector('[data-WeatherInformation]');
    let weatherIcon = document.querySelector('[data-weatherIcon]');
    let temprature = document.querySelector('[data-temprature]');
    let speedInfo = document.querySelector('[data-speedInfo]');
    let humidityInfo = document.querySelector('[data-humidityInfo]');
    let cloudInfo = document.querySelector('[data-cloudInfo]');

    cityName.textContent = data?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    weatherIcon.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    WeatherInformation.textContent = data?.weather?.[0]?.description;
    temprature.innerText = `${data?.main?.temp.toFixed(2)} °C`;
    speedInfo.innerText = `${data?.wind?.speed.toFixed(2)} m/s`;
    humidityInfo.innerText = `${data?.main?.humidity.toFixed(2)} %`;
    cloudInfo.innerText = `${data?.clouds?.all.toFixed(2)} %`;
}
let grantAccess = document.querySelector("[data-grantAccess]");
function getCurrLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("geolocation is not supported");
    }
}
function showPosition(position){
    const getCurrLocation = {
        lat:position.coords.latitude,
        lon:position.coords.longitude
    };
    sessionStorage.setItem("currLocation",JSON.stringify(getCurrLocation));
    fetchCoordinates(getCurrLocation);
}
grantAccess.addEventListener('click',()=>{
    getCurrLocation();
})
userTab.addEventListener('click',()=>{
    switchTab(userTab);
});
searchTab.addEventListener('click',()=>{
    switchTab(searchTab);
});

//searching for city
//https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric

const search = document.querySelector("[data-searchInput]");
const searchBtn = document.querySelector("[data-searchButton]");

formContainer.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevents the page from reloading
    const city = search.value;

    if (city === '') {
        alert("Please enter a valid city name.");
        return;
    }

    fetchWeatherBySearch(city);
});


async function fetchWeatherBySearch(city){
    loadingScreen.classList.add("active");
    weatherInfo.classList.remove("active");
    grantAccess.classList.remove("active");
    try {
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        let info = await response.json();
        loadingScreen.classList.remove("active");
        weatherInfo.classList.add("active");
        renderWeatherInfo(info);
    } catch (err) {
        loadingScreen.classList.remove("active");
        alert(`Error: ${err.message}`);

    }
    
}