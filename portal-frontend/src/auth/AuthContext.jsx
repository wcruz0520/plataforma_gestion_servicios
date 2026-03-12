import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("portal_token"));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("portal_user");
    return raw ? JSON.parse(raw) : null;
  });

  const signIn = (data) => {
    localStorage.setItem("portal_token", data.token);
    localStorage.setItem(
      "portal_user",
      JSON.stringify({
        username: data.username,
        fullName: data.fullName,
        role: data.role,
      })
    );

    setToken(data.token);
    setUser({
      username: data.username,
      fullName: data.fullName,
      role: data.role,
    });
  };

  const signOut = () => {
    localStorage.removeItem("portal_token");
    localStorage.removeItem("portal_user");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: !!token,
      signIn,
      signOut,
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}