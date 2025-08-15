"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MaterialsList } from "@/components/materials-list";
import BookmarkedMaterials from "@/app/components/BookmarkedMaterials";
import { UploadMaterial } from "@/components/upload-material";
import MyMaterials from "@/app/components/MyMaterials";
import useUserStore from "@/lib/store/useUserStore";
export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("materials");
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status]);

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 space-y-4 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          {/* <div className="flex items-center space-x-2">
            <Link href="/materials">
              <Button variant="outline">Browse All Materials</Button>
            </Link>
          </div> */}
        </div>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="materials">My Materials</TabsTrigger>
            <TabsTrigger value="bookmarked">Bookmarked</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
          </TabsList>
          <TabsContent value="materials" className="space-y-4">
            <Card className=" shadow-none">
              <CardHeader>
                <CardTitle>My Uploaded Materials</CardTitle>
                <CardDescription>
                  Manage the learning materials you&apos;ve uploaded
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MyMaterials></MyMaterials>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="bookmarked" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Bookmarked Materials</CardTitle>
                <CardDescription>
                  Quick access to materials you&apos;ve saved for later
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BookmarkedMaterials />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="upload" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upload Learning Material</CardTitle>
                <CardDescription>
                  Share your knowledge with the community
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UploadMaterial />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
