"use client";

import { useState, useRef } from "react";
import { Category, Menu } from "@/app/types";
import { MenuCategory } from "./category-components/menu-category";
import { MenuItems } from "./menu-item-components/menu-items";

interface MenuPageClientProps {
  initialCategories: Category[];
  initialMenus: Menu[];
}

export function MenuPageClient({
  initialCategories,
  initialMenus,
}: MenuPageClientProps) {
  const [activeCategory, setActiveCategory] = useState("");
  const categoryRefetchRef = useRef<(() => void) | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 items-end">
        <MenuCategory
          initialCategories={initialCategories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          onRefetchReady={(refetch) => {
            categoryRefetchRef.current = refetch;
          }}
        />
      </div>
      <div className="flex flex-col gap-4 items-end">
        <MenuItems
          initialMenus={initialMenus}
          activeCategory={activeCategory}
          onMenuChange={() => {
            // Refresh categories to update item count
            if (categoryRefetchRef.current) {
              categoryRefetchRef.current();
            }
          }}
        />
      </div>
    </div>
  );
}
