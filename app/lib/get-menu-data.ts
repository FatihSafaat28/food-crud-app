import prisma from "./prisma";
import { Category, Menu } from "@/app/types";
import { auth } from "@/lib/auth";

/**
 * Server-side function to fetch categories for the current user with menu count
 * @returns Promise<Category[]>
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      console.error("No authenticated user found");
      return [];
    }

    const categories = await prisma.category.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        _count: {
          select: { menus: true },
        },
      },
    });

    // Sort: 1. Type "Makanan" first, 2. By menu count (descending)
    return categories.sort((a, b) => {
      // First, prioritize "Makanan" type
      if (a.type === "Makanan" && b.type !== "Makanan") return -1;
      if (a.type !== "Makanan" && b.type === "Makanan") return 1;

      // Then sort by menu count (descending - most menus first)
      const countA = a._count?.menus || 0;
      const countB = b._count?.menus || 0;
      return countB - countA;
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

/**
 * Server-side function to fetch menus for the current user with category information
 * @returns Promise<Menu[]>
 */
export async function getMenus(): Promise<Menu[]> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      console.error("No authenticated user found");
      return [];
    }

    const menus = await prisma.menu.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return menus;
  } catch (error) {
    console.error("Error fetching menus:", error);
    return [];
  }
}

/**
 * Parallel fetch both categories and menus for the current user
 * This reduces the number of requests and improves LCP
 * @returns Promise<{ categories: Category[], menus: Menu[] }>
 */
export async function getMenuPageData(): Promise<{
  categories: Category[];
  menus: Menu[];
}> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      console.error("No authenticated user found");
      return { categories: [], menus: [] };
    }

    // Parallel fetching using Promise.all for better performance
    const [categories, menus] = await Promise.all([
      getCategories(),
      getMenus(),
    ]);

    return { categories, menus };
  } catch (error) {
    console.error("Error fetching menu page data:", error);
    return { categories: [], menus: [] };
  }
}
