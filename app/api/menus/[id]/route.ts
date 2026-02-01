import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { auth } from "@/lib/auth";

// 1. GET Single Menu (Untuk ambil data saat mau Edit)
export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    // Hanya ambil menu milik user yang sedang login
    const menu = await prisma.menu.findFirst({
      where: { 
        id: parseInt(params.id),
        userId: session.user.id 
      },
      include: { category: true },
    });

    if (!menu) {
      return NextResponse.json(
        { error: "Menu tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json(menu);
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengambil data menu" },
      { status: 500 },
    );
  }
}

// 2. PATCH (Update Menu)
export async function PATCH(
  req: Request,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await req.json();
    const { name, description, price, imageUrl, categoryId, ingredients } =
      body;

    const id = parseInt(params.id);

    // Verifikasi bahwa menu milik user yang sedang login
    const existingMenu = await prisma.menu.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existingMenu) {
      return NextResponse.json(
        { error: "Menu tidak ditemukan atau Anda tidak memiliki akses" },
        { status: 404 },
      );
    }

    const updatedMenu = await prisma.menu.update({
      where: { id },
      data: {
        name,
        description,
        price: parseInt(price),
        imageUrl,
        categoryId: parseInt(categoryId),
        ingredients, // Pastikan ini array string di skema Prisma
      },
    });

    return NextResponse.json(updatedMenu);
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengupdate menu" },
      { status: 500 },
    );
  }
}

// 3. DELETE (Hapus Menu)
export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const id = parseInt(params.id);

    // Verifikasi bahwa menu milik user yang sedang login
    const existingMenu = await prisma.menu.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existingMenu) {
      return NextResponse.json(
        { error: "Menu tidak ditemukan atau Anda tidak memiliki akses" },
        { status: 404 },
      );
    }

    await prisma.menu.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Menu berhasil dihapus" });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal menghapus menu" },
      { status: 500 },
    );
  }
}
