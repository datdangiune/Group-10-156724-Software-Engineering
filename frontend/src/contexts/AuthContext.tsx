
import React, { createContext, useContext, useState, useEffect } from "react";
import { Login } from "@/service/auth";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
interface User {
  email: string;
  role: string;
  fullname: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}
interface UserDecoded {
  email: string;
  role: string;
  fullname: string;
  exp: number;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const userCookie = Cookies.get("accessToken");
    if (userCookie) {
      const decodedToken: UserDecoded = jwtDecode(userCookie);
      setUser(decodedToken);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await Login(email, password);
      console.log("Login response:", response);
      if (response) {
        const decodedToken: UserDecoded = jwtDecode(response.accessToken);
        setUser(decodedToken);
        Cookies.set("accessToken", response.accessToken);
        setIsAuthenticated(true);
        return true;
      }
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("blueMoonUser");
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
