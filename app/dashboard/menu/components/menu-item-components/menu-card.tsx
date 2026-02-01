"use client";

import { Card, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Menu } from "@/app/types";

interface MenuCardProps {
  menu: Menu;
  onEdit: () => void;
  onDelete: () => void;
}

/**
 * Reusable menu card component
 */
export function MenuCard({ menu, onEdit, onDelete }: MenuCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden h-full group">
      {/* Image Container */}
      <div className="relative h-48 md:h-32 w-full overflow-hidden">
        <img
          src={menu.imageUrl}
          alt={menu.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Badge Kategori */}
        <div className="absolute top-2 left-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-sm">
          {menu.category?.name}
        </div>
      </div>

      <CardHeader className="pb-2 justify-center text-center">
        <CardTitle className="text-sm line-clamp-1">{menu.name}</CardTitle>
        <span className="text-sm font-bold text-orange-600">
          Rp {menu.price.toLocaleString("id-ID")}
        </span>
      </CardHeader>

      <CardFooter className="flex flex-col items-center justify-between mt-auto border-t pt-2 gap-2">
        <Button asChild variant="default" size="sm" className="w-full gap-2">
          <Link href={`/dashboard/menu/${menu.id}`}>
            Details
            <ArrowRight className="h-3 w-3" />
          </Link>
        </Button>
        <div className="flex gap-2 w-full flex-wrap">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 cursor-pointer"
            onClick={onEdit}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="flex-1 cursor-pointer"
            onClick={onDelete}
          >
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
