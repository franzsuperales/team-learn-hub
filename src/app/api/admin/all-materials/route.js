import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Make sure path is correct
import { auth } from "@/lib/auth";

export async function GET(req) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await prisma.post.findMany({
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

    if (!res || res.length === 0) {
      return NextResponse.json(
        { message: "No materials found" },
        { status: 404 }
      );
    }

    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    console.error("Error fetching user materials:", error);
    return NextResponse.json(
      { message: "Failed to fetch user materials" },
      { status: 500 }
    );
  }
}
