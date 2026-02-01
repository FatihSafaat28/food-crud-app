import { useState, useEffect, useCallback } from "react";
import { Menu } from "@/app/types";

/**
 * Custom hook for fetching and managing menu data
 * @returns Menu data, loading state, error state, and refetch function
 */
export function useMenus() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMenus = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/menus");
      if (!res.ok) {
        throw new Error("Failed to fetch menus");
      }
      const data = await res.json();
      setMenus(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error("Error fetching menus:", errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  return {
    menus,
    isLoading,
    error,
    refetch: fetchMenus,
  };
}
