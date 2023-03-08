const weatherReport = (() => {
  let userLocation = "Houston";
  let currentData = "";
  let currentError = "";
  const getError = () => {
    return currentError;
  };
  const setLocation = (location) => {
    userLocation = location;
  };
  const gatherWeatherData = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${userLocation}&APPID=&units=imperial`,
        { mode: "cors" }
      );
      const weatherData = await response.json();
      currentData = weatherData;
    } catch (err) {
      console.log(err);
    }
  };

  const makeDataSet = (data) => {
    const locationName = data.name;
    const temp = data.main.temp;
    const pressure = data.main.pressure;
    const feelTemp = data.main.feels_like;
    const windSpeed = data.wind.speed;
    return { locationName, temp, pressure, feelTemp, windSpeed };
  };
  const locationToData = async (location) => {
    try {
      setLocation(location);
      await gatherWeatherData();
      if (currentData.cod === "404") {
        currentError = currentData.message;
        return "ERROR";
      }
      if (currentData.cod !== "404") {
        const weatherData = currentData;
        const dataSet = makeDataSet(weatherData);
        return { dataSet };
      }
    } catch (err) {
      console.log(err);
    }
  };

  return { locationToData, getError };
})();
const userInterface = (() => {
  const errorDiv = document.getElementById("error-div");
  const locationInput = document.getElementById("location-input");
  const form = document.getElementById("search-form");
  const cardContainer = document.getElementById("card-container");
  const currentCardInfo = "";
  let cardArray = [];
  function renderCard() {
    let addedLocationArray = [];
    while (cardContainer.lastChild) {
      cardContainer.removeChild(cardContainer.lastChild);
    }
    for (let i = 0; i < cardArray.length; i++) {
      const cardDiv = document.createElement("div");
      const cardLocation = document.createElement("h2");
      const cardTemp = document.createElement("p");
      const cardTempFeel = document.createElement("p");
      const cardPressure = document.createElement("p");
      const cardWindSpeed = document.createElement("p");
      cardDiv.classList.add("card");
      cardDiv.id = i;

      const selectedCard = cardArray[i].dataSet;
      if (addedLocationArray.includes(`${selectedCard.locationName}`)) {
      } else {
        addedLocationArray.push(selectedCard.locationName);

        cardLocation.textContent = `${selectedCard.locationName}`;
        cardTemp.textContent = `Current Temperature: ${selectedCard.temp}F`;
        cardTempFeel.textContent = `Feels Like: ${selectedCard.feelTemp}`;
        cardPressure.textContent = `Pressure of: ${
          selectedCard.pressure / 100
        }`;
        cardWindSpeed.textContent = `Wind speed of: ${selectedCard.windSpeed}Mph`;
        cardDiv.appendChild(cardLocation);
        cardDiv.appendChild(cardTemp);
        cardDiv.appendChild(cardTempFeel);
        cardDiv.appendChild(cardPressure);
        cardDiv.appendChild(cardWindSpeed);
        cardContainer.appendChild(cardDiv);
      }
    }
  }
  form.addEventListener("submit", async (e) => {
    try {
      e.preventDefault();
      errorDiv.textContent = "";
      const cardInfo = await weatherReport.locationToData(locationInput.value);
      if (cardInfo === "ERROR") {
        errorLogging.logError();
        errorDiv.textContent = errorLogging.getErrorLog();
      } else {
        cardArray.push(cardInfo);
        renderCard();
      }
    } catch (err) {
      console.log(err);
      console.log("e");
    }
  });
})();
const errorLogging = (() => {
  let errorLog = [];
  const getErrorLog = () => {
    return errorLog;
  };
  const logError = () => {
    let error = weatherReport.getError();
    errorLog.push(error);
  };
  return { getErrorLog, logError };
})();
