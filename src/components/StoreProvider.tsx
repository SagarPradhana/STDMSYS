"use client";

import { Provider } from "react-redux";
import { store, setCredentials } from "@school-management/store";
import { useEffect, useState } from "react";
import { Loading } from "@school-management/ui";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    const refreshToken = localStorage.getItem("refreshToken");

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        store.dispatch(setCredentials({ 
          user, 
          token, 
          refreshToken: refreshToken || undefined 
        }));
      } catch (e) {
        console.error("Failed to parse stored user", e);
      }
    }
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return <Loading fullPage />;
  }

  return <Provider store={store}>{children}</Provider>;
}
