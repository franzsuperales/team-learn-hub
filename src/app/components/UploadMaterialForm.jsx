"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  FileText,
  FileIcon,
  Link as LinkIcon,
  Paperclip,
  LoaderCircle,
  Video,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

import axios from "axios";
import { Badge } from "@/components/ui/badge";
import useUserStore from "@/lib/store/useUserStore";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export function UploadMaterialForm({ initialData = {}, editMode, onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [materialType, setMaterialType] = useState("pdf");
  const [dialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const [fileUrlInput, setFileUrlInput] = useState("");
  const fileInputRef = useRef(null);
  const [redirect, setRedirect] = useState(false);
  const router = useRouter(); // Initialize the router
  // Removed unused 'file' state to clean up the component
  const user = useUserStore((state) => state.user);
  // const initialMaterialData = useMaterialInitialDataStore(
  //   (state) => state.materialInitialData
  // );
  const [uploadedMaterials, setUploadedMaterials] = useState(
    initialData.materialUrl
      ? initialData.materialUrl.map((item) => ({
          id: item.id,
          type: item.type.startsWith("image/")
            ? "image"
            : item.type.startsWith("video/")
            ? "video"
            : item.type.startsWith("application/")
            ? "file"
            : "link",
          name: item.name || item.url.split("/").pop(), // fallback if no name
          url: item.url,
        }))
      : []
  );

  const [selectedCategory, setSelectedCategory] = useState(
    initialData?.categoryId || ""
  );

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/admin/category");
      // console.log("Fetched categories:", res.data);
      return res.data.categories;
    } catch (error) {
      console.log("Error fetching categories:", error);
      return;
    }
  };

  const {
    data: categories,
    error,
    isLoading: isCategoriesLoading,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000, // optional: 5 minutes
    refetchOnWindowFocus: false, // optional: do not refetch on window focus
    refetchOnMount: false, // optional: do not refetch on mount
  });

  const [deletingItemName, setDeletingItemName] = useState(null);

  const { mutate: handleRemoveFileMutation } = useMutation({
    mutationFn: async (name) => {
      return await axios.delete(`/api/user/upload-material`, {
        data: { fileName: name },
      });
    },
    onMutate: (name) => {
      setDeletingItemName(name);
    },
    onSuccess: (_, name) => {
      setUploadedMaterials((prev) => prev.filter((item) => item.name !== name));
      queryClient.invalidateQueries(["material", initialData.id]);
    },
    onError: (error) => {
      console.error("Error deleting material:", error);
    },
    onSettled: () => {
      setDeletingItemName(null);
    },
  });

  if (!categories) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const title = formData.get("title");
    const description = formData.get("description");
    const category = formData.get("category");

    const fileFormData = new FormData();
    const links = [];
    let uploadedFileDetails = [];

    // console.log("uploadedMaterials", uploadedMaterials);

    // Separate links and files
    uploadedMaterials.forEach((item) => {
      if (item.type === "link") {
        links.push(item);
      } else if (
        (item.type === "file" ||
          item.type === "image" ||
          item.type === "video") &&
        item.file
      ) {
        // Only add to FormData if it's a new file (has .file property)
        fileFormData.append("files", item.file);
      }
    });

    try {
      // Upload files if there are any
      if (fileFormData.has("files")) {
        const uploadRes = await fetch("/api/user/upload-material", {
          method: "PUT",
          body: fileFormData,
        });

        if (!uploadRes.ok) {
          throw new Error("File upload failed");
        }

        const uploadResult = await uploadRes.json();
        uploadedFileDetails = uploadResult.files || [];
        // setUploadedMaterials(uploadedFileDetails);
        console.log("Files uploaded successfully:", uploadedFileDetails);
      }

      // Now create the post only if file upload succeeded or no files were present
      const materialData = {
        title,
        description,
        category,
        files: [...links, ...uploadedFileDetails],
      };
      console.log("edited material data: ", materialData);
      const finalRes = await (editMode
        ? axios.put(`/api/user/user-material/${initialData.id}`, materialData)
        : axios.post(`/api/user/user-material/${user.id}`, materialData));

      const postId = finalRes.data.postId;

      if (finalRes.status === 201 || finalRes.status === 200) {
        toast("Material Uploaded Successfully", {});

        if (editMode) {
          onSuccess(true);
          await queryClient.invalidateQueries(["material", initialData.id]);
        }

        setRedirect(true);

        // Optional: Redirect after a short delay
        router.push(`/materials/${editMode ? initialData.id : postId}`);
      }
    } catch (error) {
      console.error("Error submitting materials:", error);
      toast.error("Failed to upload material. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        const newMaterial = {
          id: Date.now() + Math.random(), // Ensure unique ID
          type: file.type.startsWith("image/")
            ? "image"
            : file.type.startsWith("video/")
            ? "video"
            : "file",
          name: file.name,
          file: file,
        };
        setUploadedMaterials((prev) => [...prev, newMaterial]);
      });
    }
  };

  const handleAddUrl = (e) => {
    e.preventDefault();
    if (fileUrlInput.trim()) {
      const newMaterial = {
        id: Date.now(),
        type: "link",
        url: fileUrlInput.trim(),
        name: fileUrlInput.trim(),
      };
      setUploadedMaterials((prev) => [...prev, newMaterial]);
      setFileUrlInput("");
      setDialogOpen(false);
    }
  };

  return (
    <div>
      {/* {redirect && <Redirect />} */}
      {/* <Redirect></Redirect> */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            required
            defaultValue={initialData.title || ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            required
            defaultValue={initialData.description || ""}
          />
        </div>
        <div className="space-y-2">
          {categories?.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                name="category"
                required
                value={selectedCategory || ""}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  sideOffset={4}
                  avoidCollisions={false}
                >
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* <Button onClick={handleUploadClick} type="button">
          <Paperclip /> Attach Filesds
        </Button> */}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button>
                <Paperclip /> Attach File
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DialogTrigger asChild>
                <DropdownMenuItem>
                  <LinkIcon size={15} className="mr-2" />
                  Link
                </DropdownMenuItem>
              </DialogTrigger>
              <DropdownMenuItem onClick={handleUploadClick}>
                <FileText size={15} className="mr-2" />
                File
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Link</DialogTitle>
              <DialogDescription>
                Upload files from your device or provide a URL
              </DialogDescription>
            </DialogHeader>
            <Label htmlFor="file-url">File URL</Label>
            <>
              <Input
                id="file-url"
                name="file-url"
                type="url"
                placeholder="https://sample.com"
                value={fileUrlInput}
                onChange={(e) => setFileUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddUrl(e);
                  }
                }}
                required
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  className=""
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="button" onClick={handleAddUrl}>
                  Add
                </Button>
              </DialogFooter>
            </>
          </DialogContent>
        </Dialog>

        <input
          type="file"
          multiple
          accept="image/*,application/pdf,video/mp4,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        <div className="space-y-4">
          <h2 className="font-semibold">Uploaded Files</h2>
          {uploadedMaterials.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No materials uploaded yet.
            </p>
          )}
          <div className="grid gap-2">
            {uploadedMaterials.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex justify-between  items-center w-full">
                  <div className="flex items-start space-x-4">
                    {item.type === "image" && (
                      <>
                        <img
                          src={
                            item.file
                              ? URL.createObjectURL(item.file)
                              : item.url
                          }
                          alt={item.name || "Uploaded image"}
                          className="max-h-40 object-contain rounded"
                        />
                        <p className="self-center">
                          {item.name.includes("$")
                            ? item.name.split("$")[1]
                            : item.name}
                        </p>
                      </>
                    )}

                    {item.type === "video" && (
                      <div className="flex items-center">
                        <Video size={17} className="mr-2" />
                        <p>
                          {item.name.includes("$")
                            ? item.name.split("$")[1]
                            : item.name}
                        </p>
                      </div>
                    )}

                    {item.type === "file" && (
                      <div className="flex items-center">
                        <FileText size={17} className="mr-2" />
                        <p>
                          {item.name.includes("$")
                            ? item.name.split("$")[1]
                            : item.name}
                        </p>
                      </div>
                    )}

                    {item.type === "link" && (
                      <div className="flex items-center">
                        <img
                          src={item.url}
                          alt=""
                          className="max-h-10 object-contain rounded"
                        />
                        <LinkIcon size={17} className="mr-2" />
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline"
                        >
                          {" "}
                          {item.url}
                        </a>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="destructive"
                    type="button"
                    size="sm"
                    onClick={() => handleRemoveFileMutation(item.name)}
                    disabled={deletingItemName === item.name}
                  >
                    {deletingItemName === item.name ? (
                      <LoaderCircle className="animate-spin" />
                    ) : (
                      "Delete"
                    )}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || redirect}
        >
          {isLoading ? (
            <>
              <LoaderCircle className="animate-spin" />
              <p>Submitting...</p>
            </>
          ) : redirect ? (
            "Redirecting..."
          ) : (
            "Submit for Approval"
          )}
        </Button>

        <Card className="p-4 bg-muted">
          <p className="text-sm text-muted-foreground">
            Note: All submitted materials will be reviewed by our administrators
            before being published. This process typically takes 1-2 business
            days.
          </p>
        </Card>
      </form>
    </div>
  );
}
