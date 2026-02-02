"use client";

import { useState } from "react";
import { useMenus } from "@/hooks/use-menus";
import { Menu } from "@/app/types";
import { MenuCard } from "@/app/dashboard/menu/components/menu-item-components/menu-card";
import { MenuCardSkeleton } from "@/app/components/ui/loading-skeleton";
import { EmptyState } from "@/app/components/ui/empty-state";
import { DeleteConfirmationDialog } from "@/app/dashboard/menu/components/delete-confirmation-dialog";
import { CreateMenuDialog } from "./create-menu-item";
import { EditMenuDialog } from "./edit-menu-items";
import { deleteMenuImage } from "@/app/lib/supabase-upload";

export function MenuItems({ 
  activeCategory,
  onMenuChange 
}: { 
  activeCategory: string;
  onMenuChange?: () => void;
}) {
  const { menus, isLoading, refetch } = useMenus();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Menu | null>(null);
  const [editingItem, setEditingItem] = useState<Menu | null>(null);

  // Delete handler
  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      const res = await fetch(`/api/menus/${itemToDelete.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // Delete image from storage if exists
        if (itemToDelete.imageUrl) {
          await deleteMenuImage(itemToDelete.imageUrl);
        }
        refetch();
        // Notify parent to update category counts
        if (onMenuChange) {
          onMenuChange();
        }
      }
    } catch (error) {
      console.error("Error deleting menu:", error);
    } finally {
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  // Filter menu berdasarkan kategori aktif
  const filteredMenu = menus.filter(
    (item) => !activeCategory || item.category?.name === activeCategory
  );

  return (
    <>
      <div>
        <CreateMenuDialog 
          onRefresh={() => {
            refetch();
            if (onMenuChange) {
              onMenuChange();
            }
          }} 
        />
      </div>

      <div className="flex gap-4 w-full px-6 py-4 border rounded-4xl flex-wrap bg-sidebar">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full">
          {isLoading ? (
            <MenuCardSkeleton count={5} />
          ) : menus.length === 0 ? (
            <EmptyState message='Belum ada menu. Klik "Add Menu" untuk membuat menu pertama.' />
          ) : filteredMenu.length === 0 ? (
            <EmptyState
              message={`Tidak ada menu di kategori "${activeCategory}".`}
            />
          ) : (
            filteredMenu.map((item) => (
              <MenuCard
                key={item.id}
                menu={item}
                onEdit={() => setEditingItem(item)}
                onDelete={() => {
                  setItemToDelete(item);
                  setIsDeleteDialogOpen(true);
                }}
              />
            ))
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      {editingItem && (
        <EditMenuDialog
          item={editingItem}
          onRefresh={() => {
            refetch();
            if (onMenuChange) {
              onMenuChange();
            }
          }}
          onClose={() => setEditingItem(null)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        itemName={itemToDelete?.name}
        title={`Anda yakin ingin menghapus "${itemToDelete?.name}"?`}
        description="Tindakan ini tidak bisa dibatalkan. Ini akan menghapus data menu secara permanen."
      />
    </>
  );
}

