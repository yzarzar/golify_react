import React, { createContext, useContext, useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { logger } from "../utils/logger";
import { authApi, api } from "../services/api";
import { useLocalStorage } from "../hooks/useLocalStorage";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage("auth_user", null);
  const [token, setToken] = useLocalStorage("auth_token", null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Set auth token in API client when it changes
  useEffect(() => {
    if (token) {
      api.setAuthToken(token);
    } else {
      api.clearAuthToken();
    }
  }, [token]);

  const register = useCallback(async (userData) => {
    try {
      setLoading(true);
      setError(null);

      const result = await authApi.register(userData);
      setUser(result.user);
      setToken(result.token);
      logger.debug("User registered successfully");
      return result.user;
    } catch (err) {
      setError(err.message);
      logger.error("Registration failed:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const result = await authApi.login(email, password);
      setUser(result.user);
      setToken(result.token);
      logger.debug("User logged in successfully");
      return result.user;
    } catch (err) {
      setError(err.message);
      logger.error("Login failed:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      try {
        await authApi.logout();
      } catch (err) {
        logger.warn("Logout API call failed, clearing local state anyway:", err);
      }
      
      // Always clear local state, even if the API call fails
      setUser(null);
      setToken(null);
      logger.debug("User logged out successfully");
    } catch (err) {
      setError(err.message);
      logger.error("Logout failed:", err);
      // Don't throw here - we want the logout to succeed even if there are errors
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    isAuthenticated: !!user && !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};