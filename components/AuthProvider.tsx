"use client";

/**
 * Authentication Context Provider
 *
 * Provides authentication state and functions throughout the application.
 * Handles automatic token refresh and session management.
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import {
  AuthUser,
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  refreshAccessToken,
  getMe,
  getCurrentUser,
  setCurrentUser,
  isAuthenticated as checkIsAuthenticated,
  clearAuth,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  TwoFactorRequiredResponse,
} from "@/lib/api/auth";

// ============================================================================
// Types
// ============================================================================

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    data: LoginRequest,
  ) => Promise<AuthResponse | TwoFactorRequiredResponse>;
  register: (data: RegisterRequest) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

// ============================================================================
// Context
// ============================================================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================================================
// Provider Component
// ============================================================================

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // FIXED: Add refresh-in-progress flag to prevent race conditions
  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshInProgressRef = useRef(false);

  /**
   * Initialize authentication state on mount
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if we have a valid token
        if (checkIsAuthenticated()) {
          const currentUser = getCurrentUser();

          if (currentUser) {
            setUser(currentUser);
            if (process.env.NODE_ENV === "development") {
              console.log("User restored from storage");
            }
          } else {
            // Try to fetch current user from API
            try {
              await getMe();
              const fetchedUser = getCurrentUser();
              if (fetchedUser) {
                setUser(fetchedUser);
                if (process.env.NODE_ENV === "development") {
                  console.log("User fetched from API");
                }
              }
            } catch (error) {
              console.error("Failed to fetch user:", error);
              // Clear invalid auth state
              clearAuth();
              setUser(null);
            }
          }
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        // Clear invalid auth state
        clearAuth();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Logout handler
   */
  const handleLogout = useCallback(async () => {
    setIsLoading(true);
    try {
      await apiLogout();
    } finally {
      setUser(null);
      setCurrentUser(null);
      setIsLoading(false);
    }
  }, []);

  /**
   * Set up automatic token refresh
   * FIXED: Added mutex to prevent concurrent refresh attempts
   */
  useEffect(() => {
    if (!user) return;

    // Refresh token every 50 minutes (tokens expire in 1 hour)
    const refreshInterval = setInterval(
      async () => {
        // FIXED: Prevent concurrent refresh attempts
        if (refreshInProgressRef.current) {
          console.log("Token refresh already in progress, skipping");
          return;
        }

        refreshInProgressRef.current = true;
        setIsRefreshing(true);
        try {
          await refreshAccessToken();
          console.log("Token refreshed successfully");
        } catch (error) {
          console.error("Failed to refresh token:", error);
          // If refresh fails, log out user
          await handleLogout();
        } finally {
          refreshInProgressRef.current = false;
          setIsRefreshing(false);
        }
      },
      50 * 60 * 1000,
    ); // 50 minutes

    return () => clearInterval(refreshInterval);
  }, [user, handleLogout]);

  /**
   * Login handler
   */
  const handleLogin = useCallback(
    async (
      data: LoginRequest,
    ): Promise<AuthResponse | TwoFactorRequiredResponse> => {
      setIsLoading(true);
      try {
        const response = await apiLogin(data);

        // Check if 2FA is required
        if ("requiresTwoFactor" in response && response.requiresTwoFactor) {
          return response;
        }

        // Update user state
        const authResponse = response as AuthResponse;
        setUser(authResponse.data.user);
        setCurrentUser(authResponse.data.user);

        return authResponse;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  /**
   * Register handler
   */
  const handleRegister = useCallback(
    async (data: RegisterRequest): Promise<AuthResponse> => {
      setIsLoading(true);
      try {
        const response = await apiRegister(data);

        // Update user state
        setUser(response.data.user);
        setCurrentUser(response.data.user);

        return response;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  /**
   * Refresh session handler
   * FIXED: Added mutex to prevent concurrent refresh
   */
  const handleRefreshSession = useCallback(async () => {
    // FIXED: Prevent concurrent refresh attempts
    if (isRefreshing) {
      console.log("Refresh already in progress");
      return;
    }

    setIsRefreshing(true);
    try {
      const response = await refreshAccessToken();
      setUser(response.data.user);
      setCurrentUser(response.data.user);
    } catch (error) {
      console.error("Failed to refresh session:", error);
      await handleLogout();
    } finally {
      setIsRefreshing(false);
    }
  }, [handleLogout, isRefreshing]);

  const value: AuthContextType = {
    user,
    isAuthenticated: user !== null,
    isLoading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    refreshSession: handleRefreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Hook to access authentication context
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
