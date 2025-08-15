"use client";

import React, { useEffect } from "react";
import useUserStore from "@/lib/store/useUserStore";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

export default function UserSessionSync() {
  const { data: session } = useSession();
  const setUser = useUserStore((state) => state.setUser);
  const userId = session?.user?.id;

  const { data, error } = useQuery({
    queryKey: ["user-profile", userId],
    queryFn: async () => {
      if (!userId) return null;
      const res = await axios.get(`/api/user/user-profile/`);
      return res.data;
    },
    enabled: !!userId, // only run when userId is available
    staleTime: 5 * 60 * 1000, // optional: 5 minutes
    refetchOnWindowFocus: false, // optional: do not refetch on window focus
    refetchOnMount: false, // optional: do not refetch on mount
  });

  useEffect(() => {
    if (data) {
      setUser(data);
      // console.log("User fetched and set in store:", data);
    }
  }, [data, setUser]);

  if (error) {
    console.error("Error fetching user profile:", error);
  }

  return null;
}
