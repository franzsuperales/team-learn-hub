import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const fetchCategories = async () => {
  const res = await axios.get("/api/admin/category");
  // console.log("Categories fetched:", res.data.categories);
  return res.data.categories;
};

export function CategoryManagement() {
  const queryClient = useQueryClient();
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  // Track the id of the category being deleted.
  const [deletingCategoryId, setDeletingCategoryId] = useState(null);

  const {
    data: categories,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    refetchOnWindowFocus: false,
    // staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
  });

  const { mutate: addCategory, isPending: isAdding } = useMutation({
    mutationFn: async (name) => {
      const res = await axios.post("/api/admin/category", { name });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast("Category added successfully", {
        description: "New category has been added.",
      });
      setNewCategoryName("");
    },
    onError: () => {
      toast("Error", {
        description: "Failed to add category",
        variant: "destructive",
      });
    },
  });

  const { mutate: deleteCategory, isPending: isDeleting } = useMutation({
    mutationFn: async (id) => {
      const res = await axios.delete(`/api/admin/category/`, {
        data: { id },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast("Category deleted successfully", {
        description: "Category has been deleted.",
      });
      // Clear the deleting state after deletion
      setDeletingCategoryId(null);
    },
    onError: () => {
      toast("Error", {
        description: "Failed to delete category",
        variant: "destructive",
      });
      setDeletingCategoryId(null);
    },
  });

  const { mutate: editCategory, isPending: isSaving } = useMutation({
    mutationFn: async ({ id, name }) => {
      const res = await axios.put(`/api/admin/category/`, {
        id,
        name,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast("Category updated successfully", {
        description: "Category has been updated.",
      });
      // Clear the deleting state after deletion
      setDeletingCategoryId(null);
    },
    onError: () => {
      toast("Error", {
        description: "Failed to delete category",
        variant: "destructive",
      });
      setDeletingCategoryId(null);
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <p>Error fetching categories: {error.message}</p>
      </div>
    );
  }

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    addCategory(newCategoryName);
  };

  const handleDeleteCategory = (id) => {
    setDeletingCategoryId(id);
    deleteCategory(id);
  };

  const handleEditCategory = (id, name) => {
    setEditingCategory({ id, name });
  };

  const handleSaveEdit = () => {
    if (!editingCategory) return;
    editCategory({ id: editingCategory.id, name: editingCategory.name });
    setEditingCategory(null);
  };

  return (
    <div className="space-y-6">
      <form className="flex items-end gap-4" onSubmit={handleAddCategory}>
        <div className="flex-1 space-y-2">
          <Label htmlFor="new-category">New Category</Label>
          <Input
            id="new-category"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Enter category name"
          />
        </div>
        <Button disabled={isAdding} type="submit">
          {isAdding ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            "Add Category"
          )}
        </Button>
      </form>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category Name</TableHead>
              <TableHead className="w-[100px] text-right">Materials</TableHead>
              <TableHead className="w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>
                  {editingCategory?.id === category.id ? (
                    <Input
                      value={editingCategory.name}
                      onChange={(e) =>
                        setEditingCategory({
                          ...editingCategory,
                          name: e.target.value,
                        })
                      }
                    />
                  ) : (
                    category.name
                  )}
                </TableCell>
                <TableCell className="text-right">{category.count}</TableCell>
                <TableCell>
                  {editingCategory?.id === category.id ? (
                    <Button
                      size="sm"
                      onClick={handleSaveEdit}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <LoaderCircle className="animate-spin" />
                      ) : (
                        "Save"
                      )}
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleEditCategory(category.id, category.name)
                        }
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={
                          deletingCategoryId === category.id || isDeleting
                        }
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        {deletingCategoryId === category.id ? (
                          <LoaderCircle className="animate-spin" />
                        ) : (
                          "Delete"
                        )}
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
