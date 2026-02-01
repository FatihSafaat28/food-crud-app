import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }
    const menus = await prisma.menu.findMany({
      where : {
        userId: session.user.id,
      },
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
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

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
        userId: session.user.id,
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
