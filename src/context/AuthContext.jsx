import axios from 'axios';
import { createContext, useContext, useState, useEffect } from 'react';

const Auth = createContext();

const initialState = { isAuth: false, user: {} };

const AuthContext = ({ children }) => {
  const [state, setState] = useState(initialState);
  const [isAppLoading, setIsAppLoading] = useState(true);

  const readProfile = (token) => {
    const jwt = token || localStorage.getItem("jwt");
    if (!jwt) {
      setState(initialState);
      return setIsAppLoading(false);
    }

    // Dynamic clean URL generator (prevents duplicate /api issues)
    const rawBaseUrl = import.meta.env.VITE_BACKEND_URL || window.API || window.api || 'http://localhost:8000';
    const cleanBaseUrl = rawBaseUrl.replace(/\/api\/?$/, "");
    const endpoint = `${cleanBaseUrl}/api/auth/user`;

    axios.get(endpoint, { headers: { Authorization: `Bearer ${jwt}` } })
      .then((res) => {
        const { status, data } = res;
        if (status === 200) {
          setState({ isAuth: true, user: data.user });
        } else {
          localStorage.removeItem("jwt");
          setState(initialState);
        }
      })
      .catch((err) => {
        console.error("Auth profile fetch error:", err);
        localStorage.removeItem("jwt");
        setState(initialState);
      })
      .finally(() => setIsAppLoading(false));
  };

  useEffect(() => {
    readProfile();
  }, []);

  const handleLogout = () => {
    setState(initialState);
    localStorage.removeItem("jwt");
    if (window.toastify) {
      window.toastify("User logged out successfully", "success");
    }
  };

  return (
    <Auth.Provider value={{ ...state, isAppLoading, handleLogout, dispatch: setState, readProfile }}>
      {children}
    </Auth.Provider>
  );
};

export default AuthContext;

export const useAuth = () => useContext(Auth);