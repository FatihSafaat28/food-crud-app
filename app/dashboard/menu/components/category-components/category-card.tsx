"use client";

import { Card } from "@/app/components/ui/card";
import { Category } from "@/app/types";

interface CategoryCardProps {
  category: Category;
  isActive: boolean;
  onClick: () => void;
}

/**
 * Reusable category card component
 */
export function CategoryCard({ category, isActive, onClick }: CategoryCardProps) {
  return (
    <Card
      className={`text-center w-fit px-6 py-2 cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground ${
        isActive
          ? "bg-primary text-primary-foreground hover:bg-primary/90"
          : ""
      }`}
      onClick={onClick}
    >
      <span className="font-medium text-sm">{category.name}</span>
      <span className="font-medium text-sm opacity-75">
        {" "}
        {category._count?.menus} items
      </span>
    </Card>
  );
}
