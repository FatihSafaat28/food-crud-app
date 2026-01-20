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
      className="gap-2 pl-0"
    >
      <ArrowLeft className="h-4 w-4" /> Kembali
    </Button>
  );
}
