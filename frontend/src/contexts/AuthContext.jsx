import { createContext, useState } from 'react';

// 1. Context banaya
export const authContext = createContext();


export const AuthProvider = ({ children }) => {

    const url = "http://localhost:3000";

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