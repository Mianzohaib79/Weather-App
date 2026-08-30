import { createContext, useContext, useState, useEffect } from 'react';
import api from '../config/api';

const Auth = createContext();

const initialState = { isAuth: false, user: {} };

const AuthContext = ({ children }) => {
  const [state, setState] = useState(initialState);
  const [isAppLoading, setIsAppLoading] = useState(true);

  const readProfile = (token) => {
    // Key ko 'token' par sync kar diya taaki api.js aur localstorage me contradiction na ho
    const jwt = token || localStorage.getItem("token");
    if (!jwt) {
      setState(initialState);
      return setIsAppLoading(false);
    }

    // Direct central api instance use ho raha hai (/auth/user endpoint par)
    api.get('/auth/user')
      .then((res) => {
        const { status, data } = res;
        if (status === 200) {
          setState({ isAuth: true, user: data.user });
        } else {
          localStorage.removeItem("token");
          setState(initialState);
        }
      })
      .catch((err) => {
        console.error("Auth profile fetch error:", err);
        localStorage.removeItem("token");
        setState(initialState);
      })
      .finally(() => setIsAppLoading(false));
  };

  useEffect(() => {
    readProfile();
  }, []);

  const handleLogout = () => {
    setState(initialState);
    localStorage.removeItem("token");
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