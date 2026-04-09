import { createContext, useState } from 'react';

// 1. Context banaya
export const authContext = createContext();


export const AuthProvider = ({ children }) => {

    const url = "https://student-performance-prediction-backend-1bst.onrender.com";

    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [student , setStudent] = useState(localStorage.getItem("student") || null);

  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <authContext.Provider value={{ token,setToken, login, logout, url ,setStudent , student}}>
      {children}
    </authContext.Provider>
  );
};
