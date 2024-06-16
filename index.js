// console.log('Hello Everyone');

// const API_KEY = "67e758625f393d727968891ba3ee046a";

// async function showWeather(){
//     // let latitude = 15.333;
//     // let longitude = 74.0833;
//     let city = "Pune";

//     const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

//     const data = await response.json()

//     console.log("Weather data = " , data);

//     let newPara = document.createElement('p');
//     newPara.textContent = `${data?.main?.temp.toFixed(2)} °C`

//     document.body.appendChild(newPara);
// }

// je pn custom-attributes dilet elements na tyana fetch
// karaych first using querySelector so we can perform operation on them 


document.addEventListener('DOMContentLoaded', () => {
    const userTab = document.querySelector("[data-userWeather]");
    const searchTab = document.querySelector("[data-searchWeather]");
    const userContainer = document.querySelector(".weather-container");

    const grantAccessContainer = document.querySelector(".grant-location-container");
    const searchForm = document.querySelector("[data-searchForm]");
    const loadingScreen = document.querySelector(".loading-container");
    const userInfoContainer = document.querySelector(".user-info-container");

    const grantAccessButton = document.querySelector("[data-grantAccess]");
    const searchInput = document.querySelector("[data-searchInput]");

    // Initial needed variable
    let currentTab = userTab;
    const API_KEY = "67e758625f393d727968891ba3ee046a";
    currentTab.classList.add("current-tab");
    getFromSessionStorage();

    function switchTab(clickedTab) {
        if (clickedTab !== currentTab) {
            currentTab.classList.remove("current-tab");
            currentTab = clickedTab;
            currentTab.classList.add("current-tab");

            if (!searchForm.classList.contains("active")) {
                // If search form container is invisible then make it visible
                userInfoContainer.classList.remove("active");
                grantAccessContainer.classList.remove("active");
                searchForm.classList.add("active");
            } else {
                // I was on search tab, now I want to make your weather tab visible
                searchForm.classList.remove("active");
                userInfoContainer.classList.remove("active");

                // As now I'm in your weather tab, we need to display weather, so let's check local storage first for coordinates, if we have saved them there.
                getFromSessionStorage();
            }
        }
    }

    userTab.addEventListener("click", () => {
        // Pass clicked tab as input parameter
        switchTab(userTab);
    });

    searchTab.addEventListener("click", () => {
        // Pass clicked tab as input parameter
        switchTab(searchTab);
    });

    grantAccessButton.addEventListener("click", getLocation);

    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        let cityName = searchInput.value;
        if (cityName === "") return;
        fetchSearchWeatherInfo(cityName);
    });

    function getFromSessionStorage() {
        const localCoordinates = sessionStorage.getItem("user-coordinates");
        if (!localCoordinates) {
            // If local coordinates are not found
            grantAccessContainer.classList.add("active");
        } else {
            const coordinates = JSON.parse(localCoordinates);
            fetchUserWeatherInfo(coordinates);
        }
    }

    async function fetchUserWeatherInfo(coordinates) {
        const { lat, lon } = coordinates;
        // Make grant container invisible
        grantAccessContainer.classList.remove("active");
        // Make loader visible
        loadingScreen.classList.add("active");

        // API call
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
            );
            const data = await response.json();
            loadingScreen.classList.remove("active");
            userInfoContainer.classList.add("active");
            renderWeatherInfo(data);
        } catch (error) {
            loadingScreen.classList.remove("active");
            // Handle error
            console.error("Error fetching weather data:", error);
        }
    }

    function renderWeatherInfo(weatherInfo) {
        // Fetch elements
        const cityName = document.querySelector("[data-cityName]");
        const countryIcon = document.querySelector("[data-countryIcon]");
        const desc = document.querySelector("[data-weatherDesc]");
        const weatherIcon = document.querySelector("[data-weatherIcon]");
        const temp = document.querySelector("[data-temperature]");
        const windspeed = document.querySelector("[data-windspeed]");
        const humidity = document.querySelector("[data-humidity]");
        const cloudiness = document.querySelector("[data-cloudiness]");


        // Fetch values from weatherInfo objects and put them in UI elements
        cityName.innerText = weatherInfo?.name;
        countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
        desc.innerText = weatherInfo?.weather?.[0]?.description;
        weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
        temp.innerText = `${weatherInfo?.main?.temp} °C`;
        windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
        humidity.innerText = `${weatherInfo?.main?.humidity}%`;
        cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;

    }

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    }

    function showPosition(position) {
        const userCoordinates = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
        };
        sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
        fetchUserWeatherInfo(userCoordinates);
    }

    async function fetchSearchWeatherInfo(city) {
        loadingScreen.classList.add("active");
        userInfoContainer.classList.remove("active");
        grantAccessContainer.classList.remove("active");

        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
            );
            const data = await response.json();
            loadingScreen.classList.remove("active");
            userInfoContainer.classList.add("active");
            renderWeatherInfo(data);
        } catch (err) {
            // Handle error
            console.error("Error fetching weather data:", err);
        }
    }
});
