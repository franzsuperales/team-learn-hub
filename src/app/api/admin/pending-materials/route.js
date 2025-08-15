import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Make sure path is correct
import { auth } from "@/lib/auth";

export async function GET(req) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const pendingPost = await prisma.post.findMany({
      where: {
        status: "PENDING",
      },
      include: {
        author: {
          select: {
            fname: true,
            lname: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
        materialUrl: {
          select: {
            url: true,
          },
        },
      },
    });

    return NextResponse.json(pendingPost, { status: 200 });
  } catch (error) {
    console.error("Error fetching user materials:", error);
    return NextResponse.json(
      { message: "Failed to fetch user materials" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  const body = await req.json();
  const { postId, status } = body;

  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { status: status },
    });
    return NextResponse.json(updatedPost, { status: 200 });
  } catch (error) {
    console.error("Error approving material:", error);
    return NextResponse.json(
      { message: "Failed to approve material" },
      { status: 500 }
    );
  }
}
