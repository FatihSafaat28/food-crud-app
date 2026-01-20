import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

// 1. UPDATE KATEGORI (PATCH)
export async function PATCH(
  req: Request,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;
  try {
    const body = await req.json();
    const { name, type } = body;
    const id = parseInt(params.id);

    // Validasi ID
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name: name,
        type: type, // Opsional: tetap update type jika dikirim dari frontend
      },
    });

    return NextResponse.json(updatedCategory);
  } catch (error: any) {
    // Error P2002 adalah error "Unique Constraint" dari Prisma (nama duplikat)
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Nama kategori sudah ada" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Gagal memperbarui kategori" },
      { status: 500 },
    );
  }
}

// 2. HAPUS KATEGORI (DELETE)
export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Kategori berhasil dihapus" });
  } catch (error: any) {
    // Error P2003 biasanya terjadi jika kategori masih digunakan oleh tabel Menu (Foreign Key constraint)
    if (error.code === "P2003") {
      return NextResponse.json(
        {
          error:
            "Gagal menghapus! Kategori ini masih digunakan oleh beberapa menu.",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Gagal menghapus kategori" },
      { status: 500 },
    );
  }
}

// GET: Ambil berdasarkan ID
export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { menus: true },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Kategori tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengambil kategori" },
      { status: 500 },
    );
  }
}
