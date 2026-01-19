"use client";

import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

export function MenuItems() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <Button variant="outline" size="sm" className="w-fit">
        <PlusIcon />
        <span className="hidden lg:inline">Add Menu Item</span>
      </Button>
      <div className="flex gap-4 w-full px-6 py-4 border rounded-4xl flex-wrap">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <Card
                key={index}
                className="flex flex-col overflow-hidden h-full"
              >
                <div className="h-32 w-full bg-muted animate-pulse" />
                <CardHeader className="pb-2 justify-center text-center">
                  <div className="h-4 w-3/4 bg-muted animate-pulse rounded mx-auto mb-2" />
                  <div className="h-4 w-1/2 bg-muted animate-pulse rounded mx-auto" />
                </CardHeader>
                <CardFooter className="flex flex-col items-center justify-between mt-auto border-t pt-2 gap-2">
                  <div className="flex gap-2">
                    <div className="h-8 w-12 bg-muted animate-pulse rounded" />
                    <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                  </div>
                </CardFooter>
              </Card>
            ))
          ) : menuItems.length === 0 ? (
            <div className="col-span-full flex items-center justify-center text-muted-foreground min-h-50">
              Menu pada kategori ini masih kosong
            </div>
          ) : (
            menuItems.map((item) => (
              <Card
                key={item.id}
                className="flex flex-col overflow-hidden h-full"
              >
                <div className="relative h-32 w-full overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <CardHeader className="pb-2 justify-center text-center">
                  <CardTitle className="text-sm flex-1">{item.name}</CardTitle>
                  <span className="text-sm font-bold flex-2">
                    Rp {item.price.toLocaleString("id-ID")}
                  </span>
                </CardHeader>
                <CardFooter className="flex flex-col items-center justify-between mt-auto border-t pt-2 gap-2">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm">
                      Delete
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
    </>
  );
}

const menuItems = [
  {
    id: 1,
    name: "Grilled Steak",
    image:
      "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=2070&auto=format&fit=crop",
    price: 150000,
  },
  {
    id: 2,
    name: "Seafood Pasta",
    image:
      "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=2070&auto=format&fit=crop",
    price: 95000,
  },
  {
    id: 3,
    name: "Classic Burger",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1899&auto=format&fit=crop",
    price: 75000,
  },
  {
    id: 4,
    name: "Caesar Salad",
    image:
      "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=2070&auto=format&fit=crop",
    price: 55000,
  },
  {
    id: 5,
    name: "Grilled Steak",
    image:
      "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=2070&auto=format&fit=crop",
    price: 150000,
  },
];
