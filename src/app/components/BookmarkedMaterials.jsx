import React from "react";
import MaterialCard from "@/components/material-card";
import { LoaderCircle } from "lucide-react";
import useUserStore from "@/lib/store/useUserStore";
import { useQuery } from "@tanstack/react-query";
import MaterialList from "./MaterialList";
import axios from "axios";
const BookmarkedMaterials = () => {
  const user = useUserStore((state) => state.user);

  const fetchBookmarkedMaterials = async () => {
    const res = await axios.get(`/api/user/bookmark/`);

    return res.data;
  };

  const {
    data: userMaterials,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["user-materials", user?.id],
    queryFn: fetchBookmarkedMaterials,
    enabled: !!user,
    refetchOnWindowFocus: false,
  });

  // if (isLoading || !user) {
  //   return (
  //     <div className="flex min-h-screen items-center justify-center">
  //       <LoaderCircle className="animate-spin" />
  //     </div>
  //   );
  // }
  return (
    <div>
      <MaterialList
        userMaterials={userMaterials}
        isLoading={isLoading}
        isFetching={isFetching}
      ></MaterialList>
    </div>
  );
};

export default BookmarkedMaterials;
