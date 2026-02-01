"use client";

import { useState, useRef } from "react";
import { MenuCategory } from "./components/category-components/menu-category";
import { MenuItems } from "./components/menu-item-components/menu-items";

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState("");
  const categoryRefetchRef = useRef<(() => void) | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 items-end">
        <MenuCategory
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          onRefetchReady={(refetch) => {
            categoryRefetchRef.current = refetch;
          }}
        />
      </div>
      <div className="flex flex-col gap-4 items-end">
        <MenuItems 
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
