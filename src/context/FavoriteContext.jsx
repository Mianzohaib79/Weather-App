import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const FavoriteContext = createContext();

// Helper: Extract User ID from JWT Token
const getUserIdFromToken = () => {
    const token = localStorage.getItem("jwt");
    if (!token) return null;

    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const decoded = JSON.parse(jsonPayload);
        return decoded.uid || decoded.id || decoded._id || null;
    } catch {
        return null;
    }
};

// Weather App specific LocalStorage key
const getFavoriteKey = (uid) => {
    return uid ? `weather_favorites_${uid}` : 'weather_favorites_guest';
};

// Helper: Get City unique identifier (lowercased)
const getCityId = (city) => {
    if (!city) return '';
    if (typeof city === 'string') return city.trim().toLowerCase();
    const id = city.id || city._id || city.cityName || city.name || city.city || '';
    return id.toString().trim().toLowerCase();
};

// Helper: Get City display name
const getCityName = (city) => {
    if (!city) return 'City';
    if (typeof city === 'string') return city.trim();
    return city.cityName || city.name || city.city || city.id || 'City';
};

// Toast notification helper using window.toastify (configured in global.jsx)
const showToast = (message, type = 'success') => {
    if (typeof window !== 'undefined' && typeof window.toastify === 'function') {
        window.toastify(message, type);
    } else {
        console.log(`[Toast ${type}]:`, message);
    }
};

export const FavoriteProvider = ({ children }) => {
    const auth = useAuth();
    const user = auth?.user;
    const uid = user?.uid || user?._id || user?.id;

    const [favorites, setFavorites] = useState(() => {
        const initialUid = getUserIdFromToken();
        const savedFavorites = localStorage.getItem(getFavoriteKey(initialUid));
        return savedFavorites ? JSON.parse(savedFavorites) : [];
    });

    // Sync state when User logs in or out
    useEffect(() => {
        const currentUid = uid || getUserIdFromToken();
        const savedFavorites = localStorage.getItem(getFavoriteKey(currentUid));
        setFavorites(savedFavorites ? JSON.parse(savedFavorites) : []);
    }, [uid]);

    // Auto-save to LocalStorage
    useEffect(() => {
        const currentUid = uid || getUserIdFromToken();
        localStorage.setItem(getFavoriteKey(currentUid), JSON.stringify(favorites));
    }, [favorites, uid]);

    // Check if city is in favorites
    const isFavorite = (city) => {
        const targetId = getCityId(city);
        if (!targetId) return false;
        return favorites.some(item => getCityId(item) === targetId);
    };

    // Add city to favorites
    const addToFavorites = (city) => {
        const targetId = getCityId(city);
        const cityName = getCityName(city);

        if (!targetId) return;

        if (!isFavorite(targetId)) {
            const cityData = typeof city === 'string'
                ? { id: targetId, name: cityName }
                : { ...city, id: targetId, name: cityName };

            setFavorites(prev => [...prev, cityData]);
            showToast(`"${cityName}" added to Favorite Cities`, 'success');
        }
    };

    // Remove city from favorites
    const removeFromFavorites = (city) => {
        const targetId = getCityId(city);
        const existingCity = favorites.find(item => getCityId(item) === targetId);
        const cityName = existingCity ? getCityName(existingCity) : getCityName(city);

        setFavorites(prev => prev.filter(item => getCityId(item) !== targetId));
        showToast(`"${cityName}" removed from Favorites`, 'error');
    };

    // Toggle favorite state
    const toggleFavorite = (city) => {
        if (isFavorite(city)) {
            removeFromFavorites(city);
        } else {
            addToFavorites(city);
        }
    };

    return (
        <FavoriteContext.Provider value={{ favorites, addToFavorites, removeFromFavorites, isFavorite, toggleFavorite }}>
            {children}
        </FavoriteContext.Provider>
    );
};

export const useFavorites = () => useContext(FavoriteContext);
export default FavoriteContext;