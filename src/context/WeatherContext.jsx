import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import {
  getCurrentWeather,
  getWeatherForecast,
  getCurrentWeatherByCoords,
  getWeatherForecastByCoords,
  isApiKeyInvalid,
  resetApiKeyValidation,
} from '../config/weatherApi';

const WeatherContext = createContext();

// Exact location fallback (Country Code added for precision)
const DEFAULT_CITY = 'Faisalabad,PK';

export const WeatherProvider = ({ children }) => {
  const [currentCity, setCurrentCity] = useState('Faisalabad');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [weatherCondition, setWeatherCondition] = useState('Clouds');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isGeoLoading, setIsGeoLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const coordsRef = useRef(null);

  const updateTimestamp = () => {
    setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };

  // Retry API Key
  const retryApiKey = () => {
    resetApiKeyValidation();
    getUserLocationWeather();
  };

  // Fetch weather by city name (Auto-appends country code if plain city)
  const fetchWeather = async (city) => {
    let targetCity = city && city.trim() ? city.trim() : DEFAULT_CITY;

    // Ensure Faisalabad targets PK specifically if no country code provided
    if (targetCity.toLowerCase() === 'faisalabad') {
      targetCity = 'Faisalabad,PK';
    }

    setLoading(true);
    setError(null);
    try {
      const data = await getCurrentWeather(targetCity);
      setWeatherData(data);
      setCurrentCity(data.name || 'Faisalabad');

      const condition = data.weather?.[0]?.main || 'Clear';
      setWeatherCondition(condition);

      const forecast = await getWeatherForecast(targetCity);
      setForecastData(forecast);
      updateTimestamp();
    } catch (err) {
      setError(err.message || 'Failed to fetch weather for specified city');
    } finally {
      setLoading(false);
    }
  };

  // Fetch weather by latitude & longitude
  const fetchWeatherByCoords = async (lat, lon) => {
    setLoading(true);
    setError(null);
    try {
      coordsRef.current = { lat, lon };
      const data = await getCurrentWeatherByCoords(lat, lon);
      setWeatherData(data);
      if (data.name) {
        setCurrentCity(data.name);
      }

      const condition = data.weather?.[0]?.main || 'Clear';
      setWeatherCondition(condition);

      const forecast = await getWeatherForecastByCoords(lat, lon);
      setForecastData(forecast);
      updateTimestamp();
    } catch (err) {
      console.warn('Weather fetch by coordinates failed, fallback to default city:', err.message);
      await fetchWeather(DEFAULT_CITY);
    } finally {
      setLoading(false);
    }
  };

  // Trigger Browser Geolocation
  const getUserLocationWeather = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      fetchWeather(DEFAULT_CITY);
      return;
    }

    setIsGeoLoading(true);
    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setIsGeoLoading(false);
        fetchWeatherByCoords(latitude, longitude);
      },
      (geoError) => {
        console.warn('Geolocation denied or unavailable, fetching fallback city:', geoError.message);
        setIsGeoLoading(false);
        fetchWeather(DEFAULT_CITY);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  };

  // Force Live Refresh Data
  const refreshWeatherData = () => {
    if (coordsRef.current) {
      fetchWeatherByCoords(coordsRef.current.lat, coordsRef.current.lon);
    } else {
      fetchWeather(currentCity || DEFAULT_CITY);
    }
  };

  // Auto-detect user location on startup
  useEffect(() => {
    getUserLocationWeather();
  }, []);

  // Real-Time 3-Minute Auto Refresh Interval
  useEffect(() => {
    const interval = setInterval(() => {
      refreshWeatherData();
    }, 3 * 60 * 1000); // 3 minutes for live updates

    return () => clearInterval(interval);
  }, [currentCity]);

  return (
    <WeatherContext.Provider
      value={{
        currentCity,
        weatherData,
        forecastData,
        weatherCondition,
        loading,
        error,
        isGeoLoading,
        isApiKeyInvalid,
        lastUpdated,
        retryApiKey,
        fetchWeather,
        fetchWeatherByCoords,
        getUserLocationWeather,
        refreshWeatherData,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => useContext(WeatherContext);