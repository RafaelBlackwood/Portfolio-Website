import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [appPublicSettings] = useState({ public_settings: {} });
  const authChecked = true;

  const checkAppState = useCallback(async () => {
    setIsLoadingPublicSettings(false);
    setIsLoadingAuth(false);
    setAuthError(null);
    return appPublicSettings;
  }, [appPublicSettings]);

  const checkUserAuth = useCallback(async () => {
    setIsLoadingAuth(false);
    setIsAuthenticated(Boolean(user));
    return user;
  }, [user]);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    setAuthError(null);
  }, []);

  const navigateToLogin = useCallback(() => {
    setAuthError({
      type: 'auth_required',
      message: 'Authentication is not configured for the local app.',
    });
  }, []);

  const value = useMemo(() => ({
      user,
      isAuthenticated,
      isLoadingAuth,
      isLoadingPublicSettings,
      authChecked,
      authError,
      appPublicSettings,
      logout,
      navigateToLogin,
      checkUserAuth,
      checkAppState
    }), [
      user,
      isAuthenticated,
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      logout,
      navigateToLogin,
      checkUserAuth,
      checkAppState,
    ]);

  return React.createElement(AuthContext.Provider, { value }, children);
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
