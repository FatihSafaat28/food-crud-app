"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ButtonBack() {
  const router = useRouter();
  return (
    <Button
      variant="ghost"
      onClick={() => router.back()}
      className="px-4 gap-2 cursor-pointer"
    >
      <ArrowLeft className="h-4 w-4" /> Kembali
    </Button>
  );
}
