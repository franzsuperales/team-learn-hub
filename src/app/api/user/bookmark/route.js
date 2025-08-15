import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Select } from "@radix-ui/react-select";

export async function POST(req) {
  const session = await auth();
  const body = await req.json();
  const userId = session.user?.id;
  const { postId } = body;

  try {
    // Check if the bookmark already exists
    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });
    if (existingBookmark) {
      //delete the bookmark if it exists
      await prisma.bookmark.delete({
        where: {
          postId_userId: {
            postId,
            userId,
          },
        },
      });
      return NextResponse.json(
        { message: "Post unbookmarked" },
        { status: 200 }
      );
    }

    // Create a new bookmark
    const bookmark = await prisma.bookmark.create({
      data: {
        userId,
        postId,
      },
    });

    return NextResponse.json(
      { message: "Bookmark created successfully", bookmark },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating bookmark:", error);
    return NextResponse.json(
      { message: "Failed to create bookmark" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const bookmarkedPosts = await prisma.bookmark.findMany({
      where: { userId },
      include: {
        post: {
          include: {
            author: { select: { fname: true, lname: true } },
            category: { select: { name: true } },
            materialUrl: { select: { url: true, type: true, name: true } },
          },
        },
      },
    });

    const formattedPosts = bookmarkedPosts.map(({ post }) => ({
      ...post,
      isBookmarked: true,
      isAuthor: post.authorId === userId,
    }));

    return NextResponse.json(formattedPosts, { status: 200 });
  } catch (error) {
    console.error("Error fetching bookmarked materials:", error);
    return NextResponse.json(
      { message: "Failed to fetch bookmarked materials" },
      { status: 500 }
    );
  }
}
