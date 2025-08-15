// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import { auth } from "@/lib/auth";

// export async function GET(req, params) {
//   const session = await auth();
//   const id = await params.id;
//   const userId = session.user?.id;

//   try {
//     // Check if post exists and get its author and publish status
//     const postMeta = await prisma.post.findUnique({
//       where: { id },
//       select: {
//         published: true,
//         authorId: true,
//       },
//     });

//     if (!postMeta) {
//       return NextResponse.json(
//         { message: "Material not found" },
//         { status: 404 }
//       );
//     }

//     const isAuthor = postMeta.authorId === userId;
//     const isPublished = postMeta.published;

//     //  If not published, only the author can view
//     if (!isPublished && !isAuthor) {
//       return NextResponse.json(
//         { message: "Material is not published" },
//         { status: 403 }
//       );
//     }

//     //  Fetch full post details
//     const postDetails = await prisma.post.findUnique({
//       where: { id },
//       include: {
//         author: { select: { fname: true, lname: true } },
//         category: { select: { name: true } },
//         materialUrl: { select: { url: true, type: true, name: true } },
//       },
//     });

//     if (!postDetails) {
//       return NextResponse.json(
//         { message: "Material details not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({ ...postDetails, isAuthor }, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching material:", error);
//     return NextResponse.json(
//       { message: "Failed to fetch material" },
//       { status: 500 }
//     );
//   }
// }
