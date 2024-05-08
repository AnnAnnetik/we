document.addEventListener("DOMContentLoaded", function() {
  const getWeatherBtn = document.getElementById('get-weather-btn');
  getWeatherBtn.addEventListener('click', getWeather);

  function getWeather() {
      const apiKey = 'f51d6178-0d06-11ef-bd26-0242ac130002-f51d61fa-0d06-11ef-bd26-0242ac130002'; // Введіть сюди ваш API ключ OpenWeatherMap
      const city = document.getElementById('city-input').value;
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

      fetch(apiUrl)
          .then(response => response.json())
          .then(data => {
              const weatherContainer = document.getElementById('weather-container');
              weatherContainer.innerHTML = `
                  <h2>Погода в місті ${data.name}:</h2>
                  <p>Температура: ${data.main.temp}°C</p>
                  <p>Відчувається як: ${data.main.feels_like}°C</p>
                  <p>Вологість: ${data.main.humidity}%</p>
                  <p>Швидкість вітру: ${data.wind.speed} м/с</p>
              `;
          })
          .catch(error => {
              console.error('Помилка отримання погодних даних:', error);
              const weatherContainer = document.getElementById('weather-container');
              weatherContainer.innerHTML = '<p>Не вдалося отримати погодні дані. Спробуйте ще раз.</p>';
          });
  }
});
// f51d6178-0d06-11ef-bd26-0242ac130002-f51d61fa-0d06-11ef-bd26-0242ac130002