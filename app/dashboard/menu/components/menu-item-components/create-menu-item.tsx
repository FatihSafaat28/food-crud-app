"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { uploadMenuImage } from "@/app/lib/supabase-upload";
import { useCategories } from "@/hooks/use-categories";

export function CreateMenuDialog({ onRefresh }: { onRefresh: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { categories, refetch } = useCategories();

  // Form State
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSave = async () => {
    if (!imageFile) return alert("Pilih gambar dulu!");

    setLoading(true);
    try {
      // 1. Upload to Supabase Storage
      const imageUrl = await uploadMenuImage(imageFile);

      // 2. Save to Database via API
      const res = await fetch("/api/menus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          price: parseInt(price),
          description,
          imageUrl,
          categoryId: parseInt(categoryId),
          ingredients: ingredients.split(",").map((i) => i.trim()),
        }),
      });

      if (res.ok) {
        setOpen(false);
        resetForm();
        onRefresh();
      }
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan menu");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setCategoryId("");
    setDescription("");
    setIngredients("");
    setImageFile(null);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    // Refresh categories when dialog opens
    if (isOpen) {
      refetch();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2 cursor-pointer" aria-label="Tambah Menu Baru">
          <Plus className="h-4 w-4" /> Tambah Menu Baru
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Tambah Menu Baru</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Nama Menu</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nasi Goreng..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Harga</Label>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="25000"
              />
            </div>
            <div className="grid gap-2">
              <Label>Kategori</Label>
              <Select onValueChange={setCategoryId}>
                <SelectTrigger className="w-full cursor-pointer">
                  <SelectValue placeholder="Pilih" />
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
              placeholder="Nasi Goreng Komplit Enak!"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label>Bahan (Pisahkan dengan koma)</Label>
            <Input
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="Ayam, Telur, Cabai"
            />
          </div>

          <div className="grid gap-2">
            <Label>Foto Menu</Label>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="file:bg-secondary file:text-secondary-foreground file:border-0 file:border-r file:border-solid file:border-input file:mr-4 file:px-4 file:h-full cursor-pointer p-0 overflow-hidden"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" className="cursor-pointer" onClick={() => setOpen(false)} aria-label="Batal">
            Batal
          </Button>
          <Button
            onClick={handleSave}
            className="cursor-pointer"
            disabled={
              loading ||
              !name ||
              !price ||
              !categoryId ||
              !imageFile ||
              !ingredients ||
              !description
            }
            aria-label="Simpan Menu"
          >
            {loading ? (
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
            ) : (
              "Simpan Menu"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

