// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { AdminNav } from "@/components/admin-nav";
// import { CategoryManagement } from "@/components/category-management";
// import { MaterialApproval } from "@/components/material-approval";
// import { UserManagement } from "@/components/user-management";

// export default function AdminDashboardPage() {
//   const [activeTab, setActiveTab] = useState("approvals");

//   return (
//     <div className="flex min-h-screen flex-col">
//       <main className="flex-1 space-y-4 p-4 md:p-8">
//         <div className="flex items-center justify-between">
//           <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
//           <div className="flex items-center space-x-2">
//             <Link href="/dashboard">
//               <Button variant="outline">User Dashboard</Button>
//             </Link>
//           </div>
//         </div>
//         <Tabs
//           value={activeTab}
//           onValueChange={setActiveTab}
//           className="space-y-4"
//         >
//           <TabsList>
//             <TabsTrigger value="approvals">Material Approvals</TabsTrigger>
//             <TabsTrigger value="categories">Categories</TabsTrigger>
//           </TabsList>
//           <TabsContent value="approvals" className="space-y-4">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Learning Material Approvals</CardTitle>
//                 <CardDescription>
//                   Review and approve or reject submitted learning materials
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <MaterialApproval />
//               </CardContent>
//             </Card>
//           </TabsContent>
//           <TabsContent value="categories" className="space-y-4">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Category Management</CardTitle>
//                 <CardDescription>
//                   Create, edit, and delete learning material categories
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <CategoryManagement />
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </main>
//     </div>
//   );
// }
