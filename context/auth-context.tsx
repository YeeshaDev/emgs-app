import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from "expo-splash-screen";

interface User {
  token: string;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isLoading: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Load auth state from storage on mount
  useEffect(() => {
    const loadUser = async (): Promise<void> => {
      try {
        const token = null; //await AsyncStorage.getItem("userToken");
        if (token) {
          setUser({ token });
        }
      } catch (error) {
        console.error("Failed to load user token:", error);
      } finally {
        setIsLoading(false);
        SplashScreen.hideAsync();
      }
    };
    
    loadUser();
  }, []);
  
  return (
    <AuthContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}