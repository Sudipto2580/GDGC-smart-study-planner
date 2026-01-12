import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_URL from "../config/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const saved = await AsyncStorage.getItem("AUTH_DATA");
    if (saved) {
      setUser(JSON.parse(saved));
    }
    setLoading(false);
  };

  const saveAuth = async (data) => {
    await AsyncStorage.setItem("AUTH_DATA", JSON.stringify(data));
    setUser(data);
  };

  const login = async (email, password) => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");

    await saveAuth(data);
  };

  const signup = async (email, password) => {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Signup failed");

    await login(email, password);
  };

  const guestLogin = async () => {
    const res = await fetch(`${BASE_URL}/api/auth/guest`, {
      method: "POST",
    });

    const data = await res.json();
    await saveAuth(data);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("AUTH_DATA");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        guestLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
