"use client";

import { useEffect } from "react";
import { Category } from "@/app/types";
import { useCategories } from "@/hooks/use-categories";
import { CategoryCard } from "@/app/dashboard/menu/components/category-components/category-card";
import { CategoryCardSkeleton } from "@/app/components/ui/loading-skeleton";
import { EmptyState } from "@/app/components/ui/empty-state";
import CreateCategory from "./create-category";
import { EditCategory } from "./edit-category";

interface MenuCategoryProps {
  initialCategories?: Category[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  onRefetchReady?: (refetch: () => void) => void;
}

export function MenuCategory({
  initialCategories,
  activeCategory,
  setActiveCategory,
  onRefetchReady,
}: MenuCategoryProps) {
  const { categories, isLoading, refetch } = useCategories(initialCategories);

  // Set first category as active when categories load
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].name);
    }
  }, [categories, activeCategory, setActiveCategory]);

  // Expose refetch to parent
  useEffect(() => {
    if (onRefetchReady) {
      onRefetchReady(refetch);
    }
  }, [refetch, onRefetchReady]);

  return (
    <>
      <div className="flex gap-4">
        <EditCategory
          categories={categories}
          fetchCategories={refetch}
        />
        <CreateCategory 
          fetchCategories={refetch} 
          onCategoryCreated={(categoryName) => setActiveCategory(categoryName)}
        />
      </div>

      <div className="grid grid-cols-3 md:flex md:flex-wrap gap-4 w-full px-6 py-4 border rounded-4xl bg-sidebar">
        {isLoading ? (
          <CategoryCardSkeleton count={5} />
        ) : categories.length === 0 ? (
          <div className="col-span-3 w-full">
            <EmptyState message="Kategori Masih Kosong" />
          </div>
        ) : (
          categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              isActive={activeCategory === category.name}
              onClick={() => setActiveCategory(category.name)}
            />
          ))
        )}
      </div>
    </>
  );
}

