import React from "react";
import { MenuCategory } from "../components/card-menu-category";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { MenuItems } from "../components/card-menu-items";

export default function Menu() {
  return (
    <div className="p-4 lg:p-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 items-end">
          <Button variant="outline" size="sm" className="w-fit">
            <PlusIcon />
            <span className="hidden lg:inline">Add Menu Category</span>
          </Button>
          <MenuCategory />
        </div>
        <div className="flex flex-col gap-4 items-end">
          <Button variant="outline" size="sm" className="w-fit">
            <PlusIcon />
            <span className="hidden lg:inline">Add Menu Item</span>
          </Button>
          <MenuItems />
        </div>
      </div>
    </div>
  );
}
