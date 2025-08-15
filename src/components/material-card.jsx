"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookmarkIcon,
  FileIcon,
  Image,
  VideoIcon,
  ChevronRight,
  CircleCheck,
  Clock,
  Loader2,
  CircleX,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/app/components/UserAvatar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import useUserStore from "@/lib/store/useUserStore";
import { toast } from "sonner";

const MaterialCard = ({ material, onApprove, onReject }) => {
  const [isBookmarked, setIsBookmarked] = useState(
    material.isBookmarked ?? false
  );
  const [formattedDate, setFormattedDate] = useState("");

  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user);

  const { mutate: toggleBookmark } = useMutation({
    mutationFn: async (postId) => {
      return await axios.post("/api/user/bookmark", {
        userId: user.id,
        postId,
      });
    },
    onMutate: async (postId) => {
      await queryClient.cancelQueries(["user-materials"]);
      const previousMaterials = queryClient.getQueryData(["user-materials"]);
      setIsBookmarked((prev) => !prev);
      return { previousMaterials };
    },
    onError: (err, variables, context) => {
      setIsBookmarked((prev) => !prev);
      if (context?.previousMaterials) {
        queryClient.setQueryData(["user-materials"], context.previousMaterials);
      }
      toast({
        title: "Error",
        description: "Failed to update bookmark. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries(["user-materials"]);
      queryClient.invalidateQueries(["published-materials"]);
    },
  });

  // const { mutate: approveMaterial, isPending: isApproving } = useMutation({
  //   mutationFn: async (postId) => {
  //     return await axios.put("/api/admin/pending-materials", {
  //       postId,
  //     });
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["approval-materials"] });
  //     toast("Success", {
  //       title: "Success",
  //       description: "Material has been approved.",
  //     });
  //   },
  //   onError: () => {
  //     toast("Error", {
  //       description: "Failed to approve material. Please try again.",
  //       variant: "destructive",
  //     });
  //   },
  // });
  const { mutate: approveMaterial, isPending: isApproving } = useMutation({
    mutationFn: async ({ postId, status }) => {
      console.log(postId, status);
      return await axios.put("/api/admin/pending-materials", {
        postId,
        status,
      });
    },
    onMutate: async (postId) => {
      await queryClient.cancelQueries(["all-materials"]);

      const previousApprovalMaterials = queryClient.getQueryData([
        "all-materials",
      ]);
      queryClient.setQueryData(
        ["all-materials"],
        (old) => old?.filter((m) => m.id !== postId) ?? []
      );

      return { previousApprovalMaterials };
    },
    onError: (err, postId, context) => {
      if (context?.previousApprovalMaterials) {
        queryClient.setQueryData(
          ["all-materials"],
          context.previousApprovalMaterials
        );
      }

      toast("Error", {
        description: "Failed to approve material. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast("Success", {
        title: "Success",
        description: "Material has been approved.",
      });

      queryClient.invalidateQueries(["all-materials"]); // to refresh approved list
    },
    onSettled: () => {
      queryClient.invalidateQueries(["all-materials"]);
    },
  });

  const { mutate: rejectMaterial, isPending: isRejecting } = useMutation({
    mutationFn: async ({ postId, status }) => {
      return await axios.put("/api/admin/pending-materials", {
        postId,
        status,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["all-materials"],
      });
      toast("Success", {
        description: "Material has been rejected.",
      });
    },
    onError: () => {
      toast("Error", {
        description: "Failed to reject material. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    setFormattedDate(
      new Date(material.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    );
  }, [material.createdAt]);

  useEffect(() => {
    setIsBookmarked(material.isBookmarked ?? false);
  }, [material.isBookmarked]);

  if (!material) {
    return <h1>no material</h1>;
  }

  return (
    <>
      <Card key={material.id} className="relative gap-4">
        <div
          className={
            material.status === "APPROVED"
              ? "absolute left-0 top-0 bg-green-500 text-white text-xs px-2 py-1 rounded-tl-md flex items-center gap-1"
              : material.status === "PENDING"
              ? "absolute left-0 top-0 bg-amber-500 text-white text-xs px-2 py-1 rounded-tl-md flex items-center gap-1"
              : "absolute left-0 top-0 bg-red-500 text-white text-xs px-2 py-1 rounded-tl-md flex items-center gap-1"
          }
        >
          {material.status === "APPROVED" ? (
            <>
              <CircleCheck className="h-4 w-4" /> Approved
            </>
          ) : material.status === "PENDING" ? (
            <>
              <Clock className="h-4 w-4" /> Pending Approval
            </>
          ) : (
            <>
              <CircleX className="h-4 w-4" /> Rejected
            </>
          )}
        </div>
        <CardHeader>
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center space-x-2">
              <Badge className="my-2"> {material.category.name}</Badge>
              <Badge className="my-2 gap-2" variant="outline">
                {" "}
                <Calendar size={12} />
                {formattedDate}
              </Badge>
            </div>
            {user?.role !== "ADMIN" && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => toggleBookmark(material.id)}
              >
                <BookmarkIcon
                  className={`h-4 w-4 ${isBookmarked ? "fill-primary" : ""}`}
                />
                <span className="sr-only">Bookmark</span>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div>
            <CardTitle className="text-xl ">{material.title}</CardTitle>
            <CardDescription className="line-clamp-2 ">
              {material.description}
            </CardDescription>
          </div>
          {/* <div className="flex flex-wrap gap-1">
            <Badge className="my-2"> {material.category.name}</Badge>
          </div> */}

          <div className="text-sm text-muted-foreground gap-2 ">
            <div className="flex gap-2  items-center  justify-between">
              <div className="flex gap-2 items-center ">
                <UserAvatar firstname={material.author.fname} />
                <span className="text-sm text-muted-foreground  ">
                  {material.author.fname} {material.author.lname}
                </span>
              </div>
              {/* <Link
                href={`/materials/${material.id}`}
                className="sm:hidden md:flex lg:flex flex "
              >
                <Button variant="outline" size="icon">
                  <ChevronRight />
                </Button>
              </Link> */}
            </div>
          </div>
          <Link
            href={`/materials/${material.id}`}
            className="sm:hidden md:block lg:block block  "
          >
            <Button variant="" className="w-full hover:cursor-pointer">
              View Material
              <ChevronRight />
            </Button>
          </Link>
        </CardContent>
        {/* {user?.role === "ADMIN" && (
          <CardFooter className=" border-t">
            <div className="grid grid-cols-2 gap-2  w-full">
              <Button
                variant="outline"
                size="lg"
                onClick={() =>
                  approveMaterial({ postId: material.id, status: "APPROVED" })
                }
                disabled={isApproving || isRejecting}
                className={`w-full ${
                  material.status === "APPROVED"
                    ? "bg-green-500 text-white hover:bg-green-600 hover:text-white"
                    : "bg-green-200 text-green-700 hover:bg-green-300"
                }`}
              >
                {isApproving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  </>
                ) : material.status === "APPROVED" ? (
                  "Approved"
                ) : (
                  "Approve"
                )}
              </Button>
              <Button
                variant="destructive"
                size="lg"
                onClick={() =>
                  rejectMaterial({ postId: material.id, status: "REJECTED" })
                }
                disabled={isApproving || isRejecting}
                className={`w-full ${
                  material.status === "REJECTED"
                    ? "bg-red-500 text-white hover:bg-red-600 hover:text-white"
                    : "bg-red-200 text-red-700 hover:bg-red-300 "
                }`}
              >
                {isRejecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  </>
                ) : material.status === "REJECTED" ? (
                  "Rejected"
                ) : (
                  "Reject"
                )}
              </Button>
            </div>
          </CardFooter>
        )} */}
      </Card>
    </>
  );
};

export default MaterialCard;
