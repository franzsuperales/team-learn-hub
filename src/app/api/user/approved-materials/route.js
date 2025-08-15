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
      where: {
        status: "APPROVED",
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

    // Fetch all post IDs bookmarked by the user
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: session.user?.id },
      select: { postId: true },
    });

    const bookmarkedIds = new Set(bookmarks.map((b) => b.postId));

    // Add `isBookmarked` to each post
    const postsWithBookmarkFlag = res.map((post) => ({
      ...post,
      isBookmarked: bookmarkedIds.has(post.id),
    }));

    if (!res || res.length === 0) {
      return NextResponse.json(
        { message: "No materials found" },
        { status: 404 }
      );
    }

    return NextResponse.json(postsWithBookmarkFlag, { status: 200 });
  } catch (error) {
    console.error("Error fetching user materials:", error);
    return NextResponse.json(
      { message: "Failed to fetch user materials" },
      { status: 500 }
    );
  }
}
