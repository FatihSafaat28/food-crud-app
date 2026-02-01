import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { auth } from "@/lib/auth";

// GET: Ambil semua kategori
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }
    const categories = await prisma.category.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: [{ type: "asc" }, { name: "asc" }],
      // Opsional: Hitung berapa menu di tiap kategori
      include: {
        _count: {
          select: { menus: true },
        },
      },
    });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengambil kategori" },
      { status: 500 },
    );
  }
}

// POST: Tambah kategori baru
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
    if (!body.name) {
      return NextResponse.json(
        { error: "Nama kategori wajib diisi" },
        { status: 400 },
      );
    }

    const newCategory = await prisma.category.create({
      data: { name: body.name, type: body.type, userId: session.user.id },
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error: any) {
    // Cek jika nama kategori duplikat (karena kita set @unique di prisma)
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Nama kategori sudah ada" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Gagal membuat kategori" },
      { status: 500 },
    );
  }
}
