"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { uploadMenuImage, deleteMenuImage } from "@/app/lib/supabase-upload";
import { useCategories } from "@/hooks/use-categories";
import { Menu } from "@/app/types";

interface EditMenuDialogProps {
  item: Menu;
  onRefresh: () => void;
  onClose?: () => void;
}

export function EditMenuDialog({
  item,
  onRefresh,
  onClose,
}: EditMenuDialogProps) {
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const { categories } = useCategories();

  const [name, setName] = useState(item.name);
  const [price, setPrice] = useState(item.price.toString());
  const [categoryId, setCategoryId] = useState(item.categoryId.toString());
  const [description, setDescription] = useState(item.description || "");
  const [ingredients, setIngredients] = useState(
    item.ingredients?.join(", ") || ""
  );
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      let finalImageUrl = item.imageUrl;

      // 1. If new image file is selected
      if (imageFile) {
        // Upload new image
        finalImageUrl = await uploadMenuImage(imageFile);

        // 2. Delete old image from storage (only if upload succeeds)
        if (item.imageUrl) {
          await deleteMenuImage(item.imageUrl);
        }
      }

      // 3. Update data via API
      const res = await fetch(`/api/menus/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          price: parseInt(price),
          description,
          imageUrl: finalImageUrl,
          categoryId: parseInt(categoryId),
          ingredients: ingredients.split(",").map((i: string) => i.trim()),
        }),
      });

      if (res.ok) {
        handleClose();
        onRefresh();
      }
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Edit Menu</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-sm">
          <div className="grid gap-2">
            <Label>Nama</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Harga</Label>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Kategori</Label>
              <Select onValueChange={setCategoryId} defaultValue={categoryId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Deskripsi</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Bahan-bahan</Label>
            <Input
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Foto Baru (Kosongkan jika tidak ganti)</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleUpdate} disabled={loading}>
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Simpan Perubahan"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

