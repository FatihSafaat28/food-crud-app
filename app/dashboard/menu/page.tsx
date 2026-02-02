import { getMenuPageData } from "@/app/lib/get-menu-data";
import { MenuPageClient } from "./components/menu-page-client";

export default async function MenuPage() {
  // Fetching di awal kategori dan menu
  const { categories, menus } = await getMenuPageData();

  return (
    <MenuPageClient initialCategories={categories} initialMenus={menus} />
  );
}
