"use client";

import { useEffect } from "react";
import { useCategories } from "@/hooks/use-categories";
import { CategoryCard } from "@/app/dashboard/menu/components/category-components/category-card";
import { CategoryCardSkeleton } from "@/app/components/ui/loading-skeleton";
import { EmptyState } from "@/app/components/ui/empty-state";
import CreateCategory from "./create-category";
import { ManageCategoryDialog } from "./edit-category";

interface MenuCategoryProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

export function MenuCategory({
  activeCategory,
  setActiveCategory,
}: MenuCategoryProps) {
  const { categories, isLoading, refetch } = useCategories();

  // Set first category as active when categories load
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].name);
    }
  }, [categories, activeCategory, setActiveCategory]);

  return (
    <>
      <div className="flex gap-4">
        <ManageCategoryDialog
          categories={categories}
          fetchCategories={refetch}
        />
        <CreateCategory fetchCategories={refetch} />
      </div>

      <div className="grid grid-cols-3 md:flex md:flex-wrap gap-4 w-full px-6 py-4 border rounded-4xl">
        {isLoading ? (
          <CategoryCardSkeleton count={5} />
        ) : categories.length === 0 ? (
          <EmptyState message="Kategori Masih Kosong" />
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

