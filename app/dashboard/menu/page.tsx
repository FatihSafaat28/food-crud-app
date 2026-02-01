"use client";

import { useState } from "react";
import { MenuCategory } from "./components/category-components/menu-category";
import { MenuItems } from "./components/menu-item-components/menu-items";

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState("");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 items-end">
        <MenuCategory
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />
      </div>
      <div className="flex flex-col gap-4 items-end">
        <MenuItems activeCategory={activeCategory} />
      </div>
    </div>
  );
}
