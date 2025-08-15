import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function GET(req) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json({ categories }, { status: 200 });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { message: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  const body = await req.json();
  const { name } = body;

  try {
    const newCategory = await prisma.category.create({
      data: {
        name,
      },
    });
    revalidatePath("/admin/dashboard");
    return NextResponse.json(
      {
        message: "Category created successfully",
        category: newCategory,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { message: "Failed to create category" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  const body = await req.json();
  const { id } = body;

  try {
    const deletedCategory = await prisma.category.delete({
      where: {
        id,
      },
    });
    return NextResponse.json(
      {
        message: "Category deleted successfully",
        category: deletedCategory,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error deleting category",
      },
      { status: 400 }
    );
  }
}

export async function PUT(req) {
  const body = await req.json();
  const { id, name } = body;

  try {
    const updatedCategory = await prisma.category.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });
    return NextResponse.json(
      {
        message: "Category updated successfully",
        category: updatedCategory,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { message: "Failed to update category" },
      { status: 500 }
    );
  }
}
