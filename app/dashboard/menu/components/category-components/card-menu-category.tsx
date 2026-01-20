"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import CreateCategory from "./create-category";
import { ManageCategoryDialog } from "./edit-category";

interface Category {
  id: number;
  name: string;
  _count?: {
    menus: number;
  };
}

interface MenuCategoryProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

export function MenuCategory({
  activeCategory,
  setActiveCategory,
}: MenuCategoryProps) {
  // State lokal activeCategory dihapus, diganti dengan props
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/categories");
      const data = await response.json();
      setCategories(data);
      console.log("Fetch! Kategori!");
      // Set kategori pertama sebagai aktif
      if (data.length > 0 && !activeCategory) {
        setActiveCategory(data[0].name);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex gap-4">
        <ManageCategoryDialog
          categories={categories}
          fetchCategories={fetchCategories}
        />
        <CreateCategory fetchCategories={fetchCategories} />
      </div>

      <div className="grid grid-cols-3 md:flex md:flex-wrap gap-4 w-full px-6 py-4 border rounded-4xl">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-10 w-24 bg-muted animate-pulse rounded-lg"
            />
          ))
        ) : categories.length === 0 ? (
          <div className="w-full flex items-center justify-center xt-sm text-muted-foreground">
            Kategori Masih Kosong
          </div>
        ) : (
          categories.map((category) => (
            <Card
              key={category.id}
              className={`text-center w-fit px-6 py-2 cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground ${
                activeCategory === category.name
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : ""
              }`}
              onClick={() => setActiveCategory(category.name)}
            >
              <span className="font-medium text-sm">{category.name}</span>
              <span className="font-medium text-sm opacity-75">
                {category._count?.menus} items
              </span>
            </Card>
          ))
        )}
      </div>
    </>
  );
}
