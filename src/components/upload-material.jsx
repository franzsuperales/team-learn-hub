import React from "react";
import { UploadMaterialForm } from "@/app/components/UploadMaterialForm";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import useCategoryStore from "@/lib/store/useCategoryStore";

// const fetchCategories = async () => {
//   try {
//     const res = await axios.get("/api/admin/category");
//     // console.log("Fetched categories:", res.data);
//     return res.data.categories;
//   } catch (error) {
//     console.log("Error fetching categories:", error);
//     return;
//   }
// };

export function UploadMaterial() {
  const { categories } = useCategoryStore();
  // const { setCategories } = useCategoryStore();
  // const {
  //   data: categories,
  //   error,
  //   isLoading,
  // } = useQuery({
  //   queryKey: ["categories"],
  //   onSuccess: (data) => {
  //     setCategories(data);
  //   },
  //   onError: (error) => {
  //     console.log("Error fetching categories:", error);
  //   },
  //   queryFn: fetchCategories,
  //   staleTime: 5 * 60 * 1000, // optional: 5 minutes
  //   refetchOnWindowFocus: false, // optional: do not refetch on window focus
  //   refetchOnMount: false, // optional: do not refetch on mount
  // });

  // if (isLoading) {
  //   return (
  //     <div className="flex min-h-screen flex-col items-center justify-center">
  //       <LoaderCircle className="animate-spin" />
  //     </div>
  //   );
  // }

  return (
    <div>{categories && <UploadMaterialForm categories={categories} />}</div>
  );
}
