"use client";

import { Fragment, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { LayoutDashboard } from "lucide-react";

export function DynamicBreadcrumb() {
  const pathname = usePathname();
  const [customLabel, setCustomLabel] = useState<string | null>(null);

  // Memecah URL dan membuang bagian "dashboard" dari array
  // karena dashboard akan kita buat manual sebagai item pertama
  const pathSegments = pathname
    .split("/")
    .filter((item) => item !== "" && item !== "dashboard");

  // Mendengarkan event 'set-breadcrumb'
  useEffect(() => {
    const handleSetLabel = (e: any) => setCustomLabel(e.detail);
    window.addEventListener("set-breadcrumb", handleSetLabel);

    // Reset label saat pindah halaman
    return () => {
      window.removeEventListener("set-breadcrumb", handleSetLabel);
      setCustomLabel(null);
    };
  }, [pathname]);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* 1. Item Pertama: Selalu Dashboard */}
        <BreadcrumbItem>
          {pathname === "/dashboard" ? (
            <BreadcrumbPage className="flex items-center gap-1">
              <LayoutDashboard className="h-3.5 w-3.5" />
              Dashboard
            </BreadcrumbPage>
          ) : (
            <BreadcrumbLink
              href="/dashboard"
              className="flex items-center gap-1"
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              Dashboard
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>

        {/* 2. Segmen sisanya secara dinamis */}
        {pathSegments.map((segment, index) => {
          const isLast = index === pathSegments.length - 1;
          const href = `/dashboard/${pathSegments.slice(0, index + 1).join("/")}`;

          // Jika segmen terakhir adalah ID, gunakan customLabel
          let title = segment
            .replace(/-/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());
          if (isLast && customLabel && !isNaN(Number(segment))) {
            title = customLabel;
          }

          return (
            <Fragment key={href}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{title}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href}>{title}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
