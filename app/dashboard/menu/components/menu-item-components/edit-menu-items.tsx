"use client";

import { useState, useEffect } from "react";
import { Edit, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { uploadMenuImage } from "@/app/lib/supabase-upload";

export function EditMenuDialog({
  item,
  onRefresh,
}: {
  item: any;
  onRefresh: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  const [name, setName] = useState(item.name);
  const [price, setPrice] = useState(item.price.toString());
  const [categoryId, setCategoryId] = useState(item.categoryId.toString());
  const [description, setDescription] = useState(item.description || "");
  const [ingredients, setIngredients] = useState(
    item.ingredients?.join(", ") || "",
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  useEffect(() => {
    if (open) {
      fetch("/api/categories")
        .then((res) => res.json())
        .then(setCategories);
    }
  }, [open]);

  const handleUpdate = async () => {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    setLoading(true);
    try {
      let finalImageUrl = item.imageUrl;

      // 1. Jika ada file baru yang dipilih
      if (imageFile) {
        // Upload foto baru
        finalImageUrl = await uploadMenuImage(imageFile);

        // 2. Hapus foto lama dari Storage (Hanya jika upload berhasil)
        if (item.imageUrl) {
          const oldFileName = item.imageUrl.split("/").pop();
          if (oldFileName) {
            const { error: deleteError } = await supabase.storage
              .from("menu-images")
              .remove([oldFileName]);

            if (deleteError) {
              console.error("Gagal menghapus foto lama:", deleteError.message);
            } else {
              console.log("Foto lama berhasil dibersihkan");
            }
          }
        }
      }

      // 3. Update data ke API
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
        setOpen(false);
        onRefresh();
      }
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 cursor-pointer gap-1"
        >
          <Edit className="h-3 w-3" /> Edit
        </Button>
      </DialogTrigger>
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
