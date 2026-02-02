import { useState, useEffect, useCallback } from "react";
import { Category } from "@/app/types";

/**
 * Custom hook for fetching and managing category data
 * @param initialData - Optional initial data from server-side rendering
 * @returns Category data, loading state, error state, and refetch function
 */
export function useCategories(initialData?: Category[]) {
  const [categories, setCategories] = useState<Category[]>(initialData || []);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/categories");
      if (!res.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error("Error fetching categories:", errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Only fetch if no initial data was provided
    if (!initialData) {
      fetchCategories();
    }
  }, [fetchCategories, initialData]);

  return {
    categories,
    isLoading,
    error,
    refetch: fetchCategories,
  };
}
