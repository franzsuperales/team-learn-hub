"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MaterialCard from "@/components/material-card";
import { LoaderCircle } from "lucide-react";
import useUserStore from "@/lib/store/useUserStore";

export default function MaterialList({ userMaterials, isLoading, isFetching }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  const hasLoaded = !isLoading && userMaterials;

  const materialCategories = useMemo(() => {
    if (!Array.isArray(userMaterials) || userMaterials.length === 0) return [];
    return Array.from(
      new Set(
        userMaterials.map((material) => material.category?.name).filter(Boolean)
      )
    );
  }, [userMaterials]);

  const filteredMaterials = useMemo(() => {
    if (!Array.isArray(userMaterials) || userMaterials.length === 0) return [];

    let filtered = userMaterials.filter((material) => {
      const matchesCategory =
        selectedCategory === "all" ||
        material.category?.name === selectedCategory;
      const matchesSearch =
        material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [userMaterials, selectedCategory, searchQuery, sortOrder]);

  // if (!hasLoaded) {
  //   return (
  //     <div className="flex min-h-screen items-center justify-center">
  //       <LoaderCircle className="animate-spin" />
  //     </div>
  //   );
  // }

  return (
    <div className="flex min-h-screen flex-col">
      <main>
        <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
          <div className="md:w-1/4 flex items-center gap-2">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {materialCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="md:w-1/4 flex items-center gap-2">
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:w-2/4">
            <Input
              placeholder="Search materials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMaterials.length > 0 ? (
            filteredMaterials.map((material) => (
              <MaterialCard
                key={material.id}
                material={material}
                userMaterials={userMaterials}
                isAdmin={false}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">
                {userMaterials?.length === 0
                  ? "No materials available."
                  : "No materials found matching your criteria."}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
