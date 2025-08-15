// "use client"

// import { useState } from "react"
// import MaterialCard from "@/components/material-card"; // Use default import

// // Mock data for bookmarked materials
// const bookmarkedMaterialsData = [
//   {
//     id: "5",
//     title: "Docker for Beginners",
//     description: "Get started with containerization using Docker.",
//     category: "devops",
//     author: "Alex Johnson",
//     type: "Link",
//     uploadDate: "2023-04-10",
//     approved: true,
//   },
//   {
//     id: "6",
//     title: "UI Design Principles",
//     description: "Learn the fundamental principles of effective UI design.",
//     category: "design",
//     author: "Sarah Williams",
//     type: "PDF",
//     uploadDate: "2023-07-05",
//     approved: true,
//   },
// ]

// export function BookmarkedMaterials() {
//   const [bookmarkedMaterials] = useState(bookmarkedMaterialsData)

//   return (
//     <div className="space-y-4">
//       {bookmarkedMaterials.length > 0 ? (
//         <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//           {bookmarkedMaterials.map((material) => (
//             <MaterialCard key={material.id} material={material} />
//           ))}
//         </div>
//       ) : (
//         <div className="text-center py-12">
//           <p className="text-muted-foreground">You haven&apos;t bookmarked any materials yet.</p>
//         </div>
//       )}
//     </div>
//   )
// }
