"use client";

import React from "react";
import MaterialList from "./MaterialList";
import { LoaderCircle } from "lucide-react";
import useUserStore from "@/lib/store/useUserStore";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

const ApprovalMaterials = () => {
  const user = useUserStore((state) => state.user);

  const fetchAllMaterials = async () => {
    const res = await axios.get(`/api/admin/all-materials`);
    return res.data;
  };

  const {
    data: allMaterials,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["all-materials"],
    queryFn: fetchAllMaterials,
    enabled: !!user,
    refetchOnWindowFocus: false,
  });

  const pendingMaterials = allMaterials?.filter(
    (material) => material.status === "PENDING"
  );
  const approvedMaterials = allMaterials?.filter(
    (material) => material.status === "APPROVED"
  );
  const rejectedMaterials = allMaterials?.filter(
    (material) => material.status === "REJECTED"
  );

  // if (isLoading || !user) {
  //   return (
  //     <div className="flex min-h-screen items-center justify-center">
  //       <LoaderCircle className="animate-spin" />
  //     </div>
  //   );
  // }

  return (
    <div>
      <Tabs defaultValue="approved" className="space-y-4">
        <TabsList>
          <TabsTrigger value="approved">
            Approved ({approvedMaterials?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending Approval ({pendingMaterials?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({rejectedMaterials?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="approved">
          {approvedMaterials?.length > 0 ? (
            <MaterialList
              userMaterials={approvedMaterials}
              isLoading={isLoading}
              isFetching={isFetching}
            />
          ) : (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-muted-foreground">No materials found.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="pending">
          {pendingMaterials?.length > 0 ? (
            <MaterialList
              userMaterials={pendingMaterials}
              isLoading={isLoading}
              isFetching={isFetching}
            />
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

        <TabsContent value="rejected">
          {rejectedMaterials?.length > 0 ? (
            <MaterialList
              userMaterials={rejectedMaterials}
              isLoading={isLoading}
              isFetching={isFetching}
            />
          ) : (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-muted-foreground">No rejected materials.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApprovalMaterials;
