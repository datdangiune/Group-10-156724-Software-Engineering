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

interface UserDecoded extends User {
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


const isTokenValid = (token: string): boolean => {
  try {
    const decoded = jwtDecode<UserDecoded>(token);
    return decoded.exp * 1000 > Date.now(); 
  } catch {
    return false;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (token && isTokenValid(token)) {
      try {
        const decoded: UserDecoded = jwtDecode(token);
        const { email, role, fullname } = decoded;
        setUser({ email, role, fullname });
        setIsAuthenticated(true);
      } catch (err) {
        console.error("Error decoding token:", err);
        logout();
      }
    } else {
      logout();
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await Login(email, password);
      if (response && response.accessToken) {
        const token = response.accessToken;
        const decoded: UserDecoded = jwtDecode(token);

        Cookies.set("accessToken", token, { expires: 1 }); // optional: expires in 1 day
        setUser({ email: decoded.email, role: decoded.role, fullname: decoded.fullname });
        setIsAuthenticated(true);
        return true;
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
    return false;
  };

  const logout = () => {
    Cookies.remove("accessToken");
    setUser(null);
    setIsAuthenticated(false);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
