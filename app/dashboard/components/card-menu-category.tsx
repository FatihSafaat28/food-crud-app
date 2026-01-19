"use client";

import { Card } from "@/components/ui/card";
import { useState } from "react";

const categories = [
  "Steak",
  "Bread",
  "Rice",
  "Noodles",
  "Meat",
  "Fish",
  "Tea",
  "Coffee",
  "Milk",
  "Alcohol",
];

export function MenuCategory() {
  const [activeCategory, setActiveCategory] = useState("Steak");

  return (
    <div className="flex gap-4 w-full px-6 py-4 border rounded-4xl flex-wrap">
      {categories.map((category) => (
        <Card
          key={category}
          className={`w-fit px-6 py-2 cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground ${
            activeCategory === category
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : ""
          }`}
          onClick={() => setActiveCategory(category)}
        >
          <span className="font-medium text-sm">{category}</span>
        </Card>
      ))}
    </div>
  );
}
