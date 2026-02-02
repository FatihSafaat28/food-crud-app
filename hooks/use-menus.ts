import { useState, useEffect, useCallback } from "react";
import { Menu } from "@/app/types";

/**
 * Custom hook for fetching and managing menu data
 * @param initialData - Optional initial data from server-side rendering
 * @returns Menu data, loading state, error state, and refetch function
 */
export function useMenus(initialData?: Menu[]) {
  const [menus, setMenus] = useState<Menu[]>(initialData || []);
  const [isLoading, setIsLoading] = useState(!initialData);
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
    // Only fetch if no initial data was provided
    if (!initialData) {
      fetchMenus();
    }
  }, [fetchMenus, initialData]);

  return {
    menus,
    isLoading,
    error,
    refetch: fetchMenus,
  };
}
