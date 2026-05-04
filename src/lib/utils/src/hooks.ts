"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export const useTokenExpiry = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const checkTokenExpiry = useCallback((): boolean => {
    if (typeof window === "undefined") return false;
    
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!token && !refreshToken) {
      return true;
    }

    const isAccessTokenExpired = () => {
      if (!token) return true;
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        return !decoded || !decoded.exp || decoded.exp < Math.floor(Date.now() / 1000) + 30;
      } catch {
        return true;
      }
    };

    const isRefreshTokenExpired = () => {
      if (!refreshToken) return true;
      try {
        const decoded = jwtDecode<JwtPayload>(refreshToken);
        return !decoded || !decoded.exp || decoded.exp < Math.floor(Date.now() / 1000) + 30;
      } catch {
        return true;
      }
    };

    // Only return true (logout) if BOTH are expired
    return isAccessTokenExpired() && isRefreshTokenExpired();
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const interval = setInterval(() => {
      if (checkTokenExpiry()) {
        logout();
      }
    }, 30000); // Check every 30s

    if (checkTokenExpiry()) {
      logout();
    }

    return () => clearInterval(interval);
  }, [mounted, checkTokenExpiry, logout]);

  return { checkTokenExpiry, logout };
};

export const getTimeUntilExpiry = (token: string): number | null => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    if (!decoded || !decoded.exp) return null;
    
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp - currentTime;
  } catch {
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const timeLeft = getTimeUntilExpiry(token);
  return timeLeft !== null && timeLeft <= 0;
};

export function TokenExpiryHandler() {
  useTokenExpiry();
  return null;
}