"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

const categories = [
  "Semua Kategori",
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
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);

  return (
    <>
      <Button variant="outline" size="sm" className="w-fit">
        <PlusIcon />
        <span className="hidden lg:inline">Add Menu Category</span>
      </Button>
      <div className="flex gap-4 w-full px-6 py-4 border rounded-4xl flex-wrap">
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
          ))
        )}
      </div>
    </>
  );
}
