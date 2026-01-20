"use client";

import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { CreateMenuDialog } from "./menu-item-components/create-menu-item";
import { Trash2 } from "lucide-react";
import { EditMenuDialog } from "./menu-item-components/edit-menu-items";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function MenuItems() {
  const [isLoading, setIsLoading] = useState(true);
  const [menuData, setMenuData] = useState<any[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any | null>(null);

  // 1. Fungsi Fetch Data dari API
  const fetchMenus = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/menus");
      const data = await res.json();
      setMenuData(data);
    } catch (error) {
      console.error("Gagal mengambil data menu:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  // 2. Fungsi Delete Menu
  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      const res = await fetch(`/api/menus/${itemToDelete.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        if (itemToDelete.imageUrl) {
          const fileName = itemToDelete.imageUrl.split("/").pop();

          if (fileName) {
            const { createClient } = await import("@supabase/supabase-js");
            const supabase = createClient(
              process.env.NEXT_PUBLIC_SUPABASE_URL!,
              process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            );

            const { data, error } = await supabase.storage
              .from("menu-images")
              .remove([fileName]);

            if (error) {
              console.error("Gagal hapus storage:", error.message);
            } else {
              console.log("Storage berhasil dihapus:", data);
            }
          }
        }
        fetchMenus();
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  return (
    <>
      <div className="mb-6">
        <CreateMenuDialog onRefresh={fetchMenus} />
      </div>

      <div className="flex gap-4 w-full px-6 py-4 border rounded-4xl flex-wrap">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full">
          {isLoading ? (
            // Skeleton Loader
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
                <CardFooter className="mt-auto border-t pt-2 gap-2">
                  <div className="h-8 w-full bg-muted animate-pulse rounded" />
                </CardFooter>
              </Card>
            ))
          ) : menuData.length === 0 ? (
            <div className="col-span-full flex items-center justify-center text-muted-foreground min-h-50">
              Belum ada menu. Klik "Add Menu" untuk membuat menu pertama.
            </div>
          ) : (
            menuData.map((item) => (
              <Card
                key={item.id}
                className="flex flex-col overflow-hidden h-full group"
              >
                {/* Image Container */}
                <div className="relative h-32 w-full overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Badge Kategori */}
                  <div className="absolute top-2 left-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-sm">
                    {item.category?.name}
                  </div>
                </div>

                <CardHeader className="pb-2 justify-center text-center">
                  <CardTitle className="text-sm line-clamp-1">
                    {item.name}
                  </CardTitle>
                  <span className="text-sm font-bold text-orange-600">
                    Rp {item.price.toLocaleString("id-ID")}
                  </span>
                </CardHeader>

                <CardFooter className="flex flex-col items-center justify-between mt-auto border-t pt-2 gap-2">
                  <div className="flex gap-2 w-full">
                    <EditMenuDialog item={item} onRefresh={fetchMenus} />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex-1 gap-1"
                      onClick={() => {
                        setItemToDelete(item);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-3 w-3" /> Delete
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* --- DIALOG KONFIRMASI DELETE --- */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Anda yakin ingin menghapus "{itemToDelete?.name}"?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak bisa dibatalkan. Ini akan menghapus data menu
              secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
