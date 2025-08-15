import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MaterialCard from "@/components/material-card"; // Default import
import { useToast } from "@/hooks/use-toast";

// Mock data for pending materials
const pendingMaterialsData = [
  {
    id: "p1",
    title: "JavaScript Design Patterns",
    description:
      "Explore common JavaScript design patterns and their implementations.",
    category: "frontend",
    author: "John Doe",
    type: "PDF",
    uploadDate: "2023-07-22",
    approved: false,
  },
  {
    id: "p2",
    title: "GraphQL Fundamentals",
    description:
      "Learn the basics of GraphQL and how to implement it in your applications.",
    category: "backend",
    author: "Jane Smith",
    type: "Video",
    uploadDate: "2023-08-15",
    approved: false,
  },
  {
    id: "p3",
    title: "Kubernetes for Beginners",
    description: "Get started with container orchestration using Kubernetes.",
    category: "devops",
    author: "Alex Johnson",
    type: "Link",
    uploadDate: "2023-08-20",
    approved: false,
  },
];

// Mock data for recently approved materials
const recentlyApprovedData = [
  {
    id: "a1",
    title: "React Hooks Deep Dive",
    description: "An in-depth exploration of React Hooks and their use cases.",
    category: "frontend",
    author: "Sarah Williams",
    type: "PDF",
    uploadDate: "2023-08-10",
    approved: true,
  },
  {
    id: "a2",
    title: "Node.js Performance Optimization",
    description:
      "Learn techniques to optimize your Node.js applications for better performance.",
    category: "backend",
    author: "Mike Chen",
    type: "Video",
    uploadDate: "2023-08-05",
    approved: true,
  },
];

export function MaterialApproval() {
  const [pendingMaterials, setPendingMaterials] =
    useState(pendingMaterialsData);
  const [recentlyApproved, setRecentlyApproved] =
    useState(recentlyApprovedData);
  const { toast } = useToast();

  const handleApprove = (id) => {
    const material = pendingMaterials.find((m) => m.id === id);
    if (!material) return;

    // Remove from pending and add to approved
    setPendingMaterials(pendingMaterials.filter((m) => m.id !== id));
    setRecentlyApproved([{ ...material, approved: true }, ...recentlyApproved]);

    toast({
      title: "Material approved",
      description: `${material.title} has been approved and published.`,
    });
  };

  const handleReject = (id) => {
    const material = pendingMaterials.find((m) => m.id === id);
    if (!material) return;

    // Remove from pending
    setPendingMaterials(pendingMaterials.filter((m) => m.id !== id));

    toast({
      title: "Material rejected",
      description: `${material.title} has been rejected.`,
    });
  };

  return (
    <Tabs defaultValue="pending" className="space-y-4">
      <TabsList>
        <TabsTrigger value="pending">
          Pending Approval ({pendingMaterials.length})
        </TabsTrigger>
        <TabsTrigger value="recent">Recently Approved</TabsTrigger>
      </TabsList>

      <TabsContent value="pending">
        {pendingMaterials.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pendingMaterials.map((material) => (
              <MaterialCard
                key={material.id}
                material={material}
                isAdmin={true}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-muted-foreground">
                No materials pending approval.
              </p>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="recent">
        {recentlyApproved.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentlyApproved.map((material) => (
              <MaterialCard key={material.id} material={material} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-muted-foreground">
                No recently approved materials.
              </p>
            </CardContent>
          </Card>
        )}
      </TabsContent>
    </Tabs>
  );
}
