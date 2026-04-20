import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getUserById } from "../users/controllers/userService";

const AUTH_STORAGE_KEY = "park_auth_user";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [currentUser]);

  const refreshCurrentUser = async () => {
    if (!currentUser?.id) {
      return null;
    }

    try {
      const response = await getUserById(currentUser.id);
      setCurrentUser(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  useEffect(() => {
    if (currentUser?.id) {
      refreshCurrentUser();
    }
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated: Boolean(currentUser),
      login: (user) => setCurrentUser(user),
      logout: () => setCurrentUser(null),
      refreshCurrentUser,
    }),
    [currentUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
