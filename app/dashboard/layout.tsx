"use client";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import { SiteHeader } from "./components/site-header";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LayoutDashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [userLoginData, setUserLoginData] = useState<any>({
    email: "",
    first_name: "",
    last_name: "",
    avatar: "",
  });
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/");
    } else {
      getLoginData();
    }
  }, [router]);
  const getLoginData = async () => {
    const data = await fetch("https://reqres.in/api/users?per_page=12", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "reqres_746dd67bd84f4cab98b82566173afb71",
      },
    });
    const result = await data.json();
    const emailcheck = localStorage.getItem("userEmail");
    const userLoginData = result.data.find(
      (item: any) => item.email === emailcheck,
    );
    setUserLoginData(userLoginData);
  };
  return (
    <>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar user={userLoginData} />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6">
                {children}
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
