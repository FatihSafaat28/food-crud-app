"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { uploadMenuImage } from "@/app/lib/supabase-upload";

interface EditFormProps {
  menuId: string;
  onUpdate?: () => void;
}

export function EditForm({ menuId, onUpdate }: EditFormProps) {
  const router = useRouter();

  // State Data
  const [menu, setMenu] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State Form
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  // State Dialog
  const [isEditAlertOpen, setIsEditAlertOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch Data (Menu & Categories)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [menuRes, catRes] = await Promise.all([
          fetch(`/api/menus/${menuId}`),
          fetch("/api/categories"),
        ]);

        if (menuRes.ok && catRes.ok) {
          const menuData = await menuRes.json();
          const catData = await catRes.json();

          setMenu(menuData);
          setCategories(catData);

          // Populate Form
          setName(menuData.name);
          setPrice(menuData.price.toString());
          setCategoryId(menuData.categoryId.toString());
          setDescription(menuData.description || "");
          setIngredients(menuData.ingredients?.join(", ") || "");
        }
      } catch (error) {
        console.error("Error fetching edit data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (menuId) fetchData();
  }, [menuId]);

  const handleConfirmEdit = async () => {
    setIsProcessing(true);
    try {
      let finalImageUrl = menu.imageUrl;

      if (imageFile) {
        finalImageUrl = await uploadMenuImage(imageFile);
        // Logic hapus gambar lama bisa ditambahkan di sini atau di API
      }

      const payload = {
        name,
        price: parseInt(price),
        description,
        imageUrl: finalImageUrl,
        categoryId: parseInt(categoryId),
        ingredients: ingredients
          .split(",")
          .map((i) => i.trim())
          .filter(Boolean),
      };

      const res = await fetch(`/api/menus/${menu.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setImageFile(null);
        if (onUpdate) onUpdate(); // Trigger refresh di parent
        router.refresh();
      } else {
        alert("Gagal mengupdate menu");
      }
    } catch (error) {
      console.error("Error updating:", error);
    } finally {
      setIsProcessing(false);
      setIsEditAlertOpen(false);
    }
  };

  const handleConfirmDelete = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/menus/${menu.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.push("/dashboard/menu");
      } else {
        alert("Gagal menghapus menu");
      }
    } catch (error) {
      console.error("Error deleting:", error);
    } finally {
      setIsProcessing(false);
      setIsDeleteAlertOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin mr-2" /> Memuat data form...
      </div>
    );
  }

  if (!menu) return null; // MenuDetail akan menangani tampilan 404

  return (
    <>
      <CardHeader>
        <CardTitle>Edit Menu Data</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Nama Menu</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Harga</Label>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Kategori</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="w-full cursor-pointer">
                <SelectValue placeholder="Pilih Kategori" />
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
          <div className="space-y-2">
            <Label>Foto Baru (Opsional)</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="file:bg-secondary file:text-secondary-foreground file:border-0 file:border-r file:border-solid file:border-input file:mr-4 file:px-4 file:h-full cursor-pointer p-0 overflow-hidden"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Ingredients</Label>
          <Input
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="Pisahkan dengan koma"
          />
        </div>

        <div className="space-y-2">
          <Label>Deskripsi</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>

        <div className="flex gap-4 pt-4">
          <Button
            className="flex-1 cursor-pointer"
            onClick={() => setIsEditAlertOpen(true)}
            disabled={isProcessing}
          >
            <Save className="mr-2 h-4 w-4" /> Simpan Perubahan
          </Button>
          <Button
            variant="destructive"
            className="flex-1 cursor-pointer"
            onClick={() => setIsDeleteAlertOpen(true)}
            disabled={isProcessing}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Hapus Menu
          </Button>
        </div>
      </CardContent>

      <AlertDialog open={isEditAlertOpen} onOpenChange={setIsEditAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Simpan Perubahan?</AlertDialogTitle>
            <AlertDialogDescription>
              Data akan diperbarui.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmEdit}>
              Ya, Simpan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Menu Ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
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
