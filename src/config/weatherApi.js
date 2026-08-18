import axios from 'axios';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Check if API key string exists
const hasApiKey = Boolean(API_KEY && API_KEY !== 'your_openweather_api_key_here' && API_KEY.trim() !== '');

// Initialize invalid state from localStorage if key matches stored 401 key
const storedInvalidKey = typeof window !== 'undefined' ? localStorage.getItem('invalid_openweather_api_key') : null;
export let isApiKeyInvalid = Boolean(hasApiKey && storedInvalidKey === API_KEY);

export const resetApiKeyValidation = () => {
  isApiKeyInvalid = false;
  if (typeof window !== 'undefined') {
    localStorage.removeItem('invalid_openweather_api_key');
  }
};

// Helper to handle Axios OpenWeatherMap 401/403 errors
const handleApiError = (error, fallbackLocation) => {
  const status = error.response?.status;
  if (status === 401 || status === 403) {
    isApiKeyInvalid = true;
    if (typeof window !== 'undefined' && API_KEY) {
      localStorage.setItem('invalid_openweather_api_key', API_KEY);
    }
    return getMockWeatherData(fallbackLocation);
  }
  throw new Error(error.response?.data?.message || 'Failed to fetch weather data');
};

const handleForecastApiError = (error, fallbackLocation) => {
  const status = error.response?.status;
  if (status === 401 || status === 403) {
    isApiKeyInvalid = true;
    if (typeof window !== 'undefined' && API_KEY) {
      localStorage.setItem('invalid_openweather_api_key', API_KEY);
    }
    return getMockForecastData(fallbackLocation);
  }
  throw new Error(error.response?.data?.message || 'Failed to fetch forecast data');
};

// Fetch current weather by city name
export const getCurrentWeather = async (city) => {
  if (!hasApiKey || isApiKeyInvalid) {
    return getMockWeatherData(city);
  }

  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric',
      },
    });
    resetApiKeyValidation();
    return response.data;
  } catch (error) {
    return handleApiError(error, city);
  }
};

// Fetch current weather by latitude & longitude
export const getCurrentWeatherByCoords = async (lat, lon) => {
  if (!hasApiKey || isApiKeyInvalid) {
    return getMockWeatherData('Your Current Location');
  }

  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: 'metric',
      },
    });
    resetApiKeyValidation();
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Your Current Location');
  }
};

// Fetch 5-day forecast by city name
export const getWeatherForecast = async (city) => {
  if (!hasApiKey || isApiKeyInvalid) {
    return getMockForecastData(city);
  }

  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric',
      },
    });
    return response.data;
  } catch (error) {
    return handleForecastApiError(error, city);
  }
};

// Fetch 5-day forecast by latitude & longitude
export const getWeatherForecastByCoords = async (lat, lon) => {
  if (!hasApiKey || isApiKeyInvalid) {
    return getMockForecastData('Your Current Location');
  }

  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: 'metric',
      },
    });
    return response.data;
  } catch (error) {
    return handleForecastApiError(error, 'Your Current Location');
  }
};

// Fallback mock weather generator for demo if API key is invalid or activating
export function getMockWeatherData(locationName = 'London') {
  const normalizedCity = locationName.trim();
  const lower = normalizedCity.toLowerCase();

  let mainType = 'Clouds';
  let temp = 22;
  let description = 'scattered clouds';

  if (lower.includes('rain') || lower.includes('london')) {
    mainType = 'Rain';
    temp = 14;
    description = 'light rain shower';
  } else if (lower.includes('snow') || lower.includes('moscow')) {
    mainType = 'Snow';
    temp = -4;
    description = 'light snowfall';
  } else if (lower.includes('sun') || lower.includes('tokyo') || lower.includes('miami') || lower.includes('dubai')) {
    mainType = 'Clear';
    temp = 31;
    description = 'clear sky';
  } else if (lower.includes('thunder') || lower.includes('storm')) {
    mainType = 'Thunderstorm';
    temp = 18;
    description = 'thunderstorm with rain';
  }

  return {
    name: normalizedCity.charAt(0).toUpperCase() + normalizedCity.slice(1) || 'London',
    sys: { country: 'GB', sunrise: Math.floor(Date.now() / 1000) - 20000, sunset: Math.floor(Date.now() / 1000) + 20000 },
    main: {
      temp: temp,
      feels_like: temp + 2,
      temp_min: temp - 3,
      temp_max: temp + 4,
      humidity: 68,
      pressure: 1014,
    },
    weather: [
      {
        main: mainType,
        description: description,
        icon: mainType === 'Clear' ? '01d' : mainType === 'Rain' ? '10d' : mainType === 'Snow' ? '13d' : '03d',
      },
    ],
    wind: { speed: 4.8, deg: 210 },
    visibility: 10000,
    dt: Math.floor(Date.now() / 1000),
  };
}

export function getMockForecastData(locationName = 'London') {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const list = days.map((day, i) => ({
    dt_txt: `2026-08-${13 + i} 12:00:00`,
    main: {
      temp: 20 + i,
      temp_min: 15 + i,
      temp_max: 24 + i,
      humidity: 60 + i * 2,
    },
    weather: [
      {
        main: i % 2 === 0 ? 'Clear' : 'Clouds',
        description: i % 2 === 0 ? 'clear sky' : 'few clouds',
        icon: i % 2 === 0 ? '01d' : '02d',
      },
    ],
    wind: { speed: 3.5 + i },
  }));

  return { list };
}
