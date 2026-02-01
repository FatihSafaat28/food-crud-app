import { useState, useEffect, useCallback } from "react";
import { Menu } from "@/app/types";

/**
 * Custom hook for fetching a single menu item by ID
 * @param menuId - The ID of the menu to fetch
 * @returns Menu data, loading state, error state, and refetch function
 */
export function useMenuDetail(menuId: string) {
  const [menu, setMenu] = useState<Menu | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMenu = useCallback(async () => {
    if (!menuId) return;

    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/menus/${menuId}`);
      if (!res.ok) {
        throw new Error("Menu not found");
      }
      const data = await res.json();

      // Dispatch breadcrumb event if menu has a name
      if (data?.name) {
        window.dispatchEvent(
          new CustomEvent("set-breadcrumb", { detail: data.name })
        );
      }

      setMenu(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error("Error fetching menu:", errorMessage);
      setError(errorMessage);
      setMenu(null);
    } finally {
      setIsLoading(false);
    }
  }, [menuId]);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  return {
    menu,
    isLoading,
    error,
    refetch: fetchMenu,
  };
}
