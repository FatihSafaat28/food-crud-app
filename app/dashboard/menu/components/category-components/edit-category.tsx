"use client";

import { useState } from "react";
import { Settings2, Trash2, Edit3, Loader2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/app/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { DeleteConfirmationDialog } from "../delete-confirmation-dialog";

export function EditCategory({
  categories,
  fetchCategories,
}: {
  categories: any[];
  fetchCategories: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string>("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("");
  const [loading, setLoading] = useState(false);

  // Ambil data kategori yang sedang dipilih dari array
  const selectedCategory = categories.find(
    (c) => c.id.toString() === selectedId,
  );

  // Fungsi Update
  const handleUpdate = async () => {
    setLoading(true);
    try {
      await fetch(`/api/categories/${selectedId}`, {
        method: "PATCH",
        body: JSON.stringify({ name: newName, type: newType }),
      });
      setIsEditDialogOpen(false);
      setIsOpen(false);
      fetchCategories();
    } finally {
      setLoading(false);
    }
  };

  // Fungsi Delete
  const handleDelete = async () => {
    setLoading(true);
    try {
      await fetch(`/api/categories/${selectedId}`, { method: "DELETE" });
      setIsDeleteDialogOpen(false);
      setSelectedId(""); // Reset pilihan
      setIsOpen(false);
      fetchCategories();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* --- DIALOG UTAMA: PILIH KATEGORI --- */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 cursor-pointer">
            <Settings2 className="h-4 w-4" /> Manage Categories
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-100">
          <DialogHeader>
            <DialogTitle>Manage Categories</DialogTitle>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label>Pilih Kategori</Label>
              <Select onValueChange={(val) => setSelectedId(val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori yang ingin diubah..." />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name} ({cat.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                className="flex-1 gap-2"
                variant="default"
                disabled={!selectedId}
                onClick={() => {
                  setNewName(selectedCategory?.name || "");
                  setIsEditDialogOpen(true);
                }}
              >
                <Edit3 className="h-4 w-4" /> Edit
              </Button>
              <Button
                className="flex-1 gap-2 text-destructive"
                variant="outline"
                disabled={!selectedId}
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4" /> Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- DIALOG CABANG 1: EDIT NAME --- */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Nama Kategori</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Input Nama */}
            <div className="space-y-2">
              <Label>Nama Kategori</Label>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>

            {/* Radio Group Tipe */}
            <div className="space-y-2">
              <Label>Tipe</Label>
              <RadioGroup
                value={newType}
                onValueChange={(val) => setNewType(val)}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Makanan" id="edit-Makanan" />
                  <Label htmlFor="edit-Makanan">Makanan</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Minuman" id="edit-Minuman" />
                  <Label htmlFor="edit-Minuman">Minuman</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsEditDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleUpdate} disabled={loading || !newName}>
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Simpan Perubahan"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- DIALOG CABANG 2: DELETE CONFIRMATION --- */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        itemName={selectedCategory?.name}
        description="Tindakan ini tidak bisa dibatalkan. Pastikan tidak ada menu yang menggunakan kategori ini."
      />
    </>
  );
}
