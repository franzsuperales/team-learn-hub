// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import MaterialCard from "@/components/material-card";
// import { LoaderCircle } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";
// import useUserStore from "@/lib/store/useUserStore";

// // const userMaterials = [
// //   { id: "1", title: "React Fundamentals", description: "Learn the basics of React including components, props, and state.", category: "frontend", author: "John Doe", type: "PDF", uploadDate: "2023-05-15", approved: true },
// //   { id: "2", title: "Advanced CSS Techniques", description: "Master advanced CSS concepts like Grid, Flexbox, and animations.", category: "frontend", author: "John Doe", type: "Video", uploadDate: "2023-06-10", approved: true },
// //   { id: "3", title: "JavaScript Design Patterns", description: "Explore common JavaScript design patterns and their implementations.", category: "frontend", author: "John Doe", type: "PDF", uploadDate: "2023-07-22", approved: false },
// // ]

// export function MaterialsList({ isUserMaterials = false }) {
//   const { toast } = useToast();
//   const user = useUserStore((state) => state.user);

//   const fetchUserMaterials = async () => {
//     const res = await axios.get(`/api/user/user-materials/${user.id}`);
//     return res.data;
//   };

//   const { data: userMaterials, isLoading } = useQuery({
//     queryKey: ["user-materials", user?.id],
//     queryFn: fetchUserMaterials,
//     enabled: !!user,
//     refetchOnWindowFocus: false,
//   });

//   // console.log("user materials", userMaterials);

//   // const handleDelete = (id) => {
//   //   setMaterials(materials.filter((material) => material.id !== id))
//   //   toast({
//   //     title: "Material deleted",
//   //     description: "The learning material has been deleted successfully.",
//   //   })
//   // }

//   if (isLoading || !user) {
//     return (
//       <div className="flex min-h-screen flex-col items-center justify-center">
//         <LoaderCircle className="animate-spin" />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4">
//       {userMaterials && userMaterials.length > 0 ? (
//         <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//           {userMaterials.map((material) => (
//             <MaterialCard
//               key={material.id}
//               userMaterials={userMaterials}
//               material={material}
//               isAdmin={false}
//               // onApprove={() => handleApprove(material.id)}
//               // onReject={() => handleReject(material.id)}
//             />
//           ))}
//         </div>
//       ) : (
//         <div className="text-center py-12">
//           <p className="text-muted-foreground">
//             You haven&apos;t uploaded any materials yet.
//           </p>
//           <Button className="mt-4">Upload Your First Material</Button>
//         </div>
//       )}
//     </div>
//   );
// }
