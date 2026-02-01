"use client";
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarFooter,
} from "@/app/components/ui/sidebar";
import { NavUser } from "./nav-user";
import { LucideLayoutDashboard } from "lucide-react";
import { NavMain } from "./nav-main";
import { Menu } from "lucide-react";


const navMain = {
  title: "Menu",
  url: "/dashboard/menu",
  icon: Menu,
};

export function AppSidebar() {
  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              variant="default"
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                <LucideLayoutDashboard />
                <span className="text-base font-semibold">Dashboard Fatih</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={[navMain]} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
