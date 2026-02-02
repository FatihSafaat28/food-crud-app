"use client";

import { Badge } from "@/app/components/ui/badge";
import { Loader2 } from "lucide-react";
import { MenuNotFound } from "./menu-not-found";
import { useMenuDetail } from "@/hooks/use-menu-detail";

export function MenuDetail({ menuId }: { menuId: string }) {
  const { menu, isLoading } = useMenuDetail(menuId);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!menu) return <MenuNotFound />;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Gambar */}
      <div className="h-64 md:h-full w-full relative bg-muted">
        <img
          src={menu.imageUrl || "/fast-food.png"}
          alt={menu.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Info Detail */}
      <div className="p-6 flex flex-col justify-center space-y-4">
        <div>
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            {menu.category?.name || "Uncategorized"}
          </span>
          <h1 className="text-3xl font-bold text-foreground mt-1">
            {menu.name}
          </h1>
          <p className="text-2xl font-semibold text-primary mt-2">
            Rp {menu.price.toLocaleString("id-ID")}
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Deskripsi</h3>
          <p className="text-muted-foreground leading-relaxed">
            {menu.description || "Tidak ada deskripsi."}
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Ingredients</h3>
          <div className="flex flex-wrap gap-2">
            {menu.ingredients && menu.ingredients.length > 0 ? (
              menu.ingredients.map((ing: string, idx: number) => (
                <Badge key={idx} variant="secondary">
                  {ing}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">-</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
