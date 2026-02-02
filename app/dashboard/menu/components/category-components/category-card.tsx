"use client";

import { Card } from "@/app/components/ui/card";
import { Category } from "@/app/types";

interface CategoryCardProps {
  category: Category;
  isActive: boolean;
  onClick: () => void;
}

export function CategoryCard({ category, isActive, onClick }: CategoryCardProps) {
  return (
    <Card
    aria-label={`Category ${category.name}`}
      className={`text-center w-fit px-6 py-2 cursor-pointer transition-colors hover:bg-accent hover:text-white ${
        isActive
          ? "bg-primary text-white hover:bg-primary/90"
          : ""
      }`}
      onClick={onClick}
    >
      <span className="font-medium text-sm">{category.name}</span>
      <span className="font-medium text-sm opacity-75">
        {" "}
        {category._count?.menus} Menu
      </span>
    </Card>
  );
}
