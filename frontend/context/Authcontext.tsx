"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type AppRole = "landowner" | "registrar" | "agent" | "community_leader" | "admin";

interface Profile {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  state: string | null;
  lga: string | null;
  roles: AppRole[];
}

interface AuthContextType {
  user: Profile | null;
  token: string | null;
  loading: boolean;
  signOut: () => void;
  refreshProfile: () => Promise<void>;
  setAuthData: (token: string, user: Profile) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  signOut: () => {},
  refreshProfile: async () => {},
  setAuthData: () => {},
});

export const useAuth = () => useContext(AuthContext);

const TOKEN_KEY = "terratrust_token";
const USER_KEY = "terratrust_user";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const setAuthData = (newToken: string, newUser: Profile) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const refreshProfile = async () => {
    try {
      const savedToken = localStorage.getItem(TOKEN_KEY);
      if (!savedToken) return;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${savedToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to refresh profile");

      const data = await res.json();

      if (data?.success && data?.user) {
        setUser(data.user);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      }
    } catch (error) {
      console.error("Refresh profile error:", error);
      signOut();
    }
  };

  const signOut = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    setToken(null);
  };

  useEffect(() => {
    try {
      const savedToken = localStorage.getItem(TOKEN_KEY);
      const savedUser = localStorage.getItem(USER_KEY);

      if (savedToken) setToken(savedToken);
      if (savedUser) setUser(JSON.parse(savedUser));
    } catch (error) {
      console.error("Auth load error:", error);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        signOut,
        refreshProfile,
        setAuthData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};