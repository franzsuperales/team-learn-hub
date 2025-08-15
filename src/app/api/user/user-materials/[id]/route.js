// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import { auth } from "@/lib/auth";

// export async function GET(req, { params }) {
//   const session = await auth()
//   const userId = session.user?.id

//   try {
//     // Fetch all posts by the author
//     const posts = await prisma.post.findMany({
//       where: {
//         authorId: userId,
//       },
//       include: {
//         author: {
//           select: { fname: true, lname: true },
//         },
//         category: {
//           select: { name: true },
//         },
//         materialUrl: {
//           select: { url: true },
//         },
//       },
//     });

//     if (!posts || posts.length === 0) {
//       return NextResponse.json(
//         { message: "No materials found" },
//         { status: 404 }
//       );
//     }

//     // Fetch all post IDs bookmarked by the user
//     const bookmarks = await prisma.bookmark.findMany({
//       where: { userId },
//       select: { postId: true },
//     });

//     const bookmarkedIds = new Set(bookmarks.map((b) => b.postId));

//     // Add `isBookmarked` to each post
//     const postsWithBookmarkFlag = posts.map((post) => ({
//       ...post,
//       isBookmarked: bookmarkedIds.has(post.id),
//     }));

//     return NextResponse.json(postsWithBookmarkFlag, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching user materials:", error);
//     return NextResponse.json(
//       { message: "Failed to fetch user materials" },
//       { status: 500 }
//     );
//   }
// }
