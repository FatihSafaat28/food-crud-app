"use client0";
import { useState, useEffect } from "react";
import { PlusIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function CreateCategory({
  fetchCategories,
}: {
  fetchCategories: () => void;
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
        console.log("Kategori berhasil ditambahkan :", name, type);
        setOpen(false); // Tutup dialog
        setName(""); // Reset input
        setType("");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setCreateCategoryLoading(false);
      fetchCategories(); // Refresh data
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="flex gap-2">
          <PlusIcon className="h-4 w-4" />
          <span className="hidden lg:inline">Add Menu Category</span>
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
            onClick={handleSubmit}
            disabled={createCategoryLoading || !name || !type}
            className="w-full"
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
