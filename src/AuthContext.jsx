import { createContext, useContext, useEffect, useState } from "react";

const API = "https://fsa-jwt-practice.herokuapp.com";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState();
  const [location, setLocation] = useState("GATE");

  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);
      setLocation("TABLET");
    }
  }, []);

  // TODO: signup
  async function signup(username) {
    const response = await fetch(`${API}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password: "super-secret-999",
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw Error(result.message);
    }

    setToken(result.token);
    sessionStorage.setItem("token", result.token);
    setLocation("TABLET");

    return result;
  }

  // TODO: authenticate
  async function authenticate() {
    if (!token) {
      throw Error("No token found");
    }

    const response = await fetch(`${API}/authenticate`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw Error(result.message);
    }

    setLocation("TUNNEL");
  }

  const value = { location, signup, authenticate };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw Error("useAuth must be used within an AuthProvider");
  return context;
}
