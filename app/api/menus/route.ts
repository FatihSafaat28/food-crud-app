import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET() {
  try {
    const menus = await prisma.menu.findMany({
      include: {
        category: true, // Mengambil data kategori terkait
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(menus);
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengambil menu" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, price, imageUrl, ingredients, categoryId } =
      body;

    // Validasi field wajib
    if (!name || !price || !categoryId) {
      return NextResponse.json(
        { error: "Data wajib diisi belum lengkap" },
        { status: 400 },
      );
    }

    const newMenu = await prisma.menu.create({
      data: {
        name,
        description,
        price: parseInt(price), // Skema kamu menggunakan Int
        imageUrl,
        ingredients: ingredients || [], // Menangani array string
        categoryId: parseInt(categoryId),
      },
    });

    return NextResponse.json(newMenu, { status: 201 });
  } catch (error) {
    console.error("POST_MENU_ERROR:", error);
    return NextResponse.json(
      { error: "Gagal membuat menu baru" },
      { status: 500 },
    );
  }
}
