"use client";

import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

function AuthContextProvider({ children }) {
  const [isSigupSubmitting, setIsSigupSubmitting] = useState(false);
  const [isLoginSubmitting, setIsLoginSubmitting] = useState(false);

  return (
    <AuthContext.Provider
      value={{
        isSigupSubmitting,
        setIsSigupSubmitting,
        isLoginSubmitting,
        setIsLoginSubmitting,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("Context was used outside the provider");
  return context;
}

export { AuthContextProvider, useAuthContext };
