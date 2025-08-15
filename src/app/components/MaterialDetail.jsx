"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BookmarkIcon,
  ChevronLeft,
  Download,
  FileText,
  LoaderCircle,
  Pencil,
  Trash2,
  CircleCheck,
  CircleX,
  EllipsisVertical,
  Video,
  Link as LinkIcon,
} from "lucide-react";
import { UserAvatar } from "./UserAvatar";
import { toast } from "sonner";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import EditMaterialForm from "./EditMaterialForm";
import { EmblaCarousel } from "./ImageCarousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "next-auth/react";
import useUserStore from "@/lib/store/useUserStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
export default function MaterialDetail({ id }) {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchMaterialData = async () => {
    const response = await axios.get(`/api/user/user-material/${id}`);
    return response.data;
  };

  const {
    data: materialData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["material", id],
    queryFn: fetchMaterialData,
    enabled: !!id,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // const { mutate: toggleBookmark } = useMutation({
  //   mutationFn: async (postId) => {
  //     return await axios.post("/api/user/bookmark", {
  //       userId: user.id,
  //       postId,
  //     });
  //   },

  //   onSuccess: async () => {
  //     await Promise.all([
  //       queryClient.invalidateQueries(["user-materials"]),
  //       queryClient.invalidateQueries(["material", id]),
  //     ]);
  //   },
  // });

  const { mutate: updateMaterialStatus, isPending: isUpdating } = useMutation({
    mutationFn: async ({ postId, status }) => {
      return await axios.put("/api/admin/pending-materials", {
        postId,
        status,
      });
    },
    onSuccess: async (_, { status }) => {
      toast("Success", {
        description: `Material has been ${status.toLowerCase()}.`,
      });
      queryClient.invalidateQueries(["all-materials"]);
      await queryClient.invalidateQueries(["material", id]);

      // await refetch();
    },
    onError: () => {
      toast("Error", {
        description: "Failed to update material. Please try again.",
        variant: "destructive",
      });
    },
  });
  const { mutate: deleteMaterial, isPending: isDeleting } = useMutation({
    mutationFn: async (id) => {
      return await axios.delete(`/api/user/user-material/${id}`);
    },
    onSuccess: async () => {
      toast("Success", {
        description: "Material deleted successfully.",
      });
      router.back();
    },
    onError: () => {
      toast("Error", {
        description: "Failed to delete material. Please try again.",
        variant: "destructive",
      });
    },
  });

  const downloadMaterial = async (url, filename) => {
    try {
      const response = await axios.get(url, {
        responseType: "blob",
      });

      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = filename || "download";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  const hasDownloadableContent = materialData?.materialUrl?.some(
    (material) =>
      material.type.startsWith("application/") ||
      material.type.startsWith("video/")
  );

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }

  if (isError) {
    return <div>Error loading material data.</div>;
  }

  const DeleteButton = () => {
    return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="destructive">
            <Trash2 />
            Delete
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <p>
              This action cannot be undone. This will permanently delete the
              material from the database.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={isDeleting}
              onClick={() => deleteMaterial(materialData.id)}
            >
              {isDeleting ? (
                <>
                  <LoaderCircle className="animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="container mx-auto w-full  ">
      {/* <div>
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/dashboard" className="flex items-center">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div> */}

      <div className="grid gap-6 md:grid-cols-[2fr_1fr]  w-full ">
        <div className="space-y-6 w-full ">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold ">{materialData.title}</h1>
            <div className="md:hidden flex gap-2">
              <EditMaterialForm materialData={materialData} />
              <DeleteButton />
            </div>
          </div>

          <div className="w-full flex items-center justify-center rounded-lg  bg-muted/40 sm:p-4 border p-2">
            <EmblaCarousel materialData={materialData.materialUrl} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="hidden md:flex justify-between gap-2 ">
            {materialData.isAuthor && (
              <div className="flex items-center gap-2  ">
                <EditMaterialForm materialData={materialData} />
              </div>
            )}
            {user?.role === "ADMIN" && (
              <div className="flex items-center gap-2 justify-between w-full">
                <div className="flex items-center gap-2">
                  <Button
                    disabled={isUpdating}
                    className={` ${
                      materialData.status === "APPROVED"
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-green-200 text-green-700 hover:bg-green-300"
                    }`}
                    onClick={() =>
                      updateMaterialStatus({
                        postId: materialData.id,
                        status: "APPROVED",
                      })
                    }
                  >
                    <CircleCheck className="mr-1" />
                    {materialData.status === "APPROVED"
                      ? "Approved"
                      : "Approve"}
                  </Button>

                  <Button
                    disabled={isUpdating}
                    className={` ${
                      materialData.status === "REJECTED"
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-red-200 text-red-700 hover:bg-red-300"
                    }`}
                    onClick={() =>
                      updateMaterialStatus({
                        postId: materialData.id,
                        status: "REJECTED",
                      })
                    }
                  >
                    <CircleX className="mr-1" />
                    {materialData.status === "REJECTED" ? "Rejected" : "Reject"}
                  </Button>
                </div>
              </div>
            )}
            {(materialData.isAuthor || user?.role === "ADMIN") && (
              <DeleteButton></DeleteButton>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>About this Material</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Description
                    </h3>
                    <p className="mt-1">{materialData.description}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Category
                    </h3>
                    <Badge variant="outline" className="mt-1">
                      {materialData.category?.name}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Uploaded by
                    </h3>
                    <div className="mt-2 flex items-center">
                      <UserAvatar
                        firstname={materialData.author.fname}
                      ></UserAvatar>
                      <div className="ml-2">
                        <p className="text-sm font-medium">
                          {materialData.author.fname}{" "}
                          {materialData.author.lname}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(materialData.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>{" "}
                </TabsContent>
                <TabsContent value="resources">
                  {!hasDownloadableContent && (
                    <div className="flex items-center gap-2 mb-4">
                      <p className="text-sm font-medium text-muted-foreground">
                        No downloadable resources available for this material.
                      </p>
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    {materialData.materialUrl.map((material, index) => (
                      <div key={material.id || index}>
                        {material.type.startsWith("link") && (
                          <div className="border gap-2 rounded-md p-3 flex items-center  w-full ">
                            <div className="border p-2 rounded-md">
                              <LinkIcon size={20} />
                            </div>
                            <a
                              href={material.url}
                              target="_blank"
                              className="text-blue-500 underline text-sm font-medium truncate w-[200px]"
                            >
                              {material.name}
                            </a>
                          </div>
                        )}

                        {material.type.startsWith("application/") && (
                          <div className="border rounded-md p-3 flex items-center justify-between w-full">
                            <div className="flex items-center gap-2  justify-between w-full">
                              <div className="flex items-center gap-4">
                                <div className="border p-2 rounded-md">
                                  <FileText size={20} />
                                </div>
                                <p className="text-sm font-medium">
                                  {material.name.split("$")[1]}
                                </p>
                              </div>
                              <div>
                                <Button
                                  variant="shadow"
                                  className="hover:bg-muted hover:cursor-pointer"
                                  size="icon"
                                  onClick={() =>
                                    downloadMaterial(
                                      material.url,
                                      material.name
                                    )
                                  }
                                >
                                  <Download />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}

                        {material.type.startsWith("video/") && (
                          <div className="border rounded-md p-3 flex items-center justify-between w-full">
                            <div className="flex items-center gap-2  justify-between w-full">
                              <div className="flex items-center gap-4">
                                <div className="border p-2 rounded-md">
                                  <Video size={20} />
                                </div>
                                <p className="text-sm font-medium">
                                  {material.name.split("$")[1]}
                                </p>
                              </div>
                            </div>
                            <div>
                              <Button
                                variant="shadow"
                                className="hover:bg-muted hover:cursor-pointer"
                                size="icon"
                                onClick={() =>
                                  downloadMaterial(material.url, material.name)
                                }
                              >
                                <Download />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
