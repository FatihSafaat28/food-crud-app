"use client0";
import { useState } from "react";
import { PlusIcon, Loader2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";

export function CreateCategory({
  fetchCategories,
  onCategoryCreated,
}: {
  fetchCategories: () => void;
  onCategoryCreated?: (categoryName: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [createCategoryLoading, setCreateCategoryLoading] = useState(false);
  const handleSubmit = async () => {
    if (!name) return alert("Nama kategori harus diisi");
    if (!type) return alert("Tipe kategori harus dipilih");

    setCreateCategoryLoading(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, type }),
      });

      if (res.ok) {
        const createdCategoryName = name; // Save before reset
        setOpen(false); // Tutup dialog
        setName(""); // Reset input
        setType("");
        fetchCategories(); // Refresh data
        // Set the newly created category as active
        if (onCategoryCreated) {
          onCategoryCreated(createdCategoryName);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setCreateCategoryLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          data-testid="add-category-button"
          aria-label="Add New Category"
          variant="default"
          size="sm"
          className="flex gap-2 cursor-pointer"
        >
          <PlusIcon className="h-4 w-4" />
          <span className="hidden lg:inline">Tambah Kategori</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-100">
        <DialogHeader>
          <DialogTitle>Tambah Kategori Baru</DialogTitle>
          <DialogDescription>
            Masukkan detail kategori menu yang ingin ditambahkan.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Input Nama */}
          <div className="grid gap-2">
            <Label htmlFor="name">Nama Kategori</Label>
            <Input
              id="name"
              placeholder="Masukan nama (ex: Dessert)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Input Tipe */}
          <div className="grid gap-2">
            <Label>Tipe</Label>
            <RadioGroup
              value={type}
              onValueChange={(val) => setType(val)}
              className="flex gap-6 pt-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Makanan" id="Makanan" />
                <Label htmlFor="Makanan" className="font-normal cursor-pointer">
                  Makanan
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Minuman" id="Minuman" />
                <Label htmlFor="Minuman" className="font-normal cursor-pointer">
                  Minuman
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <DialogFooter>
          <Button
            data-testid="save-category-button"
            onClick={handleSubmit}
            disabled={createCategoryLoading || !name || !type}
            className="w-full cursor-pointer"
            aria-label="Save Category"
          >
            {createCategoryLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Simpan Kategori"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
