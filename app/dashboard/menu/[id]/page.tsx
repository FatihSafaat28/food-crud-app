"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/app/components/ui/card";
import { MenuDetail } from "./components/menu-detail-components/menu-detail";
import { EditForm } from "./components/menu-detail-components/edit-form";
import { ButtonBack } from "./components/menu-detail-components/button-back";

export default function MenuDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [refresh, setRefresh] = useState(0);

  // Fungsi untuk memicu refresh pada MenuDetail setelah edit berhasil
  const handleUpdate = () => {
    setRefresh((prev) => prev + 1);
  };

  return (
    <>
      <ButtonBack />

      {/* --- BAGIAN ATAS: DETAIL MENU --- */}
      <Card className="overflow-hidden">
        {/* Key berubah -> komponen re-mount -> fetch ulang data terbaru */}
        <MenuDetail key={`detail-${refresh}`} menuId={id} />
      </Card>

      {/* --- BAGIAN BAWAH: FORM EDIT --- */}
      <Card>
        <EditForm key={`edit-${refresh}`} menuId={id} onUpdate={handleUpdate} />
      </Card>
    </>
  );
}
