import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(req, { params }) {
  const body = await req.json();
  const userId = await params.id;

  const { title, description, category, files } = body;

  try {
    const post = await prisma.post.create({
      data: {
        title,
        description,
        status: "PENDING",
        authorId: userId,
        categoryId: category,
      },
    });

    const postId = post.id;

    for (const file of files) {
      await prisma.materialUrl.create({
        data: {
          url: file.url,
          name: file.name || file.url,
          type: file.type,
          postId,
          userId,
        },
      });
    }

    // for (const link of links) {
    //   await prisma.materialUrl.create({
    //     data: {
    //       url: link.url,
    //       name: link.url, // Use link.name if available, fallback to url
    //       type: link.type,
    //       postId,
    //       userId,
    //     },
    //   });
    // }

    return NextResponse.json(
      {
        message: "Material created successfully",
        postId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating material:", error);
    return NextResponse.json(
      { message: "Failed to create material" },
      { status: 500 }
    );
  }
}

export async function GET(req, { params }) {
  const session = await auth();
  const id = await params.id;
  const userId = session?.user?.id;
  const isAdmin = session?.user?.role === "ADMIN";

  try {
    const postMeta = await prisma.post.findUnique({
      where: { id },
      select: {
        status: true,
        authorId: true,
        Bookmark: {
          where: { userId },
          select: { id: true },
        },
      },
    });

    if (!postMeta) {
      return NextResponse.json(
        { message: "Material not found" },
        { status: 404 }
      );
    }

    const isAuthor = postMeta.authorId === userId;
    const isPublished = postMeta.status === "APPROVED";
    const isBookmarked = postMeta.Bookmark.length > 0;

    if (!isPublished && !isAuthor && !isAdmin) {
      return NextResponse.json(
        { message: "Material is not published" },
        { status: 403 }
      );
    }

    const postDetails = await prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { fname: true, lname: true } },
        category: { select: { name: true } },
        materialUrl: {
          select: { id: true, url: true, type: true, name: true },
        },
      },
    });

    if (!postDetails) {
      return NextResponse.json(
        { message: "Material details not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        ...postDetails,
        isAuthor,
        isBookmarked,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching material:", error);
    return NextResponse.json(
      { message: "Failed to fetch material" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  const session = await auth();
  const id = await params.id;
  const userId = session?.user?.id;

  try {
    const post = await prisma.post.findUnique({
      where: { id },
      select: {
        authorId: true,
      },
    });

    if (!post) {
      return NextResponse.json(
        { message: "Material not found" },
        { status: 404 }
      );
    }

    if (post.authorId !== userId && session?.user?.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    await prisma.post.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Material deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting material:", error);
    return NextResponse.json(
      { message: "Failed to delete material" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  const session = await auth();
  const id = await params.id;
  const userId = session?.user?.id;

  const body = await req.json();
  const { title, description, category, files } = body;
  console.log("id: ", id);
  console.log("files", files);

  try {
    const post = await prisma.post.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        categoryId: true,
        author: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json(
        { message: "Material not found" },
        { status: 404 }
      );
    }

    if (post.author.id !== userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    await prisma.post.update({
      where: { id },
      data: {
        title,
        description,
        categoryId: category,
        status: "PENDING",
      },
    });

    for (const file of files) {
      await prisma.materialUrl.create({
        data: {
          url: file.url,
          name: file.name,
          type: file.type,
          postId: id,
          userId,
        },
      });
    }

    return NextResponse.json(
      { message: "Material updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating material:", error);
    return NextResponse.json(
      { message: "Failed to update material" },
      { status: 500 }
    );
  }
}
