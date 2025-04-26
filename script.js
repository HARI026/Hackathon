const apiKey = 'e8fea36f42fd1eb332372f3611b3b4ac';

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(page => {
    page.style.display = 'none';
    page.classList.remove('fade-in');
  });
  const current = document.getElementById(pageId);
  current.style.display = 'block';
  setTimeout(() => current.classList.add('fade-in'), 100);

  if (pageId === 'history') loadHistory();
}

function getWeather() {
  const city = document.getElementById('city').value.trim();
  if (!city) return alert("Please enter a city name.");

  updateWeatherByCity(city);
}

function updateWeatherByCity(city) {
  let history = JSON.parse(localStorage.getItem('weatherHistory')) || [];
  if (!history.includes(city)) {
    history.push(city);
    localStorage.setItem('weatherHistory', JSON.stringify(history));
  }

  // Current Weather
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data => {
      if (data.cod !== 200) {
        document.getElementById('weatherResult').innerHTML = `<p>City not found!</p>`;
        return;
      }

      displayWeatherData(data);
    });

  // Forecast
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data => {
      const forecastDiv = document.getElementById('forecast');
      forecastDiv.innerHTML = '';
      const daily = data.list.filter((item, index) => index % 8 === 0).slice(1, 3);

      daily.forEach(forecast => {
        const date = new Date(forecast.dt * 1000).toLocaleDateString();
        const iconUrl = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;

        forecastDiv.innerHTML += `
          <div class="forecast-item fade-in">
            <strong>${date}</strong>
            <img src="${iconUrl}" alt="Forecast icon" />
            <p>${forecast.weather[0].main}</p>
            <p>${forecast.main.temp}&deg;C</p>
          </div>
        `;
      });
    });
}

function displayWeatherData(data) {
  const icon = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  document.getElementById('weatherResult').innerHTML = `
    <div class="fade-in weather-box">
      <h3>${data.name}, ${data.sys.country}</h3>
      <img src="${iconUrl}" alt="Weather icon" />
      <p><i class="fas fa-temperature-high"></i> Temperature: ${data.main.temp}&deg;C</p>
      <p><i class="fas fa-cloud"></i> Weather: ${data.weather[0].main}</p>
      <p><i class="fas fa-tint"></i> Humidity: ${data.main.humidity}%</p>
      <p><i class="fas fa-wind"></i> Wind Speed: ${data.wind.speed} m/s</p>
    </div>
  `;
}

function loadHistory() {
  const history = JSON.parse(localStorage.getItem('weatherHistory')) || [];
  const list = document.getElementById('historyList');
  list.innerHTML = '';

  if (history.length === 0) {
    list.innerHTML = '<li>No history found.</li>';
    return;
  }

  history.reverse().forEach(city => {
    const li = document.createElement('li');
    li.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${city}`;
    li.classList.add('history-item');
    li.onclick = () => {
      document.getElementById('city').value = city;
      showPage('home');
      updateWeatherByCity(city);
    };
    list.appendChild(li);
  });
}

function clearHistory() {
  localStorage.removeItem('weatherHistory');
  loadHistory();
}

// ✅ GPS Button Functionality
const gpsBtn = document.getElementById('gpsBtn');
const cityInput = document.getElementById('city');

gpsBtn.addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        getWeatherByCoords(lat, lon);
      },
      () => {
        alert("Unable to retrieve your location.");
      }
    );
  } else {
    alert("Geolocation is not supported by your browser.");
  }
});

async function getWeatherByCoords(lat, lon) {
  try {
    const currentRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );
    const currentData = await currentRes.json();
    if (currentData.cod !== 200) throw new Error("Failed to fetch weather data.");

    cityInput.value = currentData.name;
    updateWeatherByCity(currentData.name);
  } catch (error) {
    alert("Error fetching weather by coordinates: " + error.message);
  }
}
