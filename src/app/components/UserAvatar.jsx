"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import useUserStore from "@/lib/store/useUserStore";
import UserSkeleton from "@/components/user-skeleton";

export function UserAvatar({ firstname }) {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);
  const loading = useUserStore((state) => state.loading);

  if (loading)
    return (
      <>
        <Avatar className="h-[40px] w-[40px] rounded-full">
          <AvatarImage alt="User" />
          <AvatarFallback>...</AvatarFallback>
        </Avatar>
      </>
    );

  const formatUserInitial = (firstname) => {
    if (!firstname) return "U";
    return firstname.slice(0, 2).toUpperCase();
  };

  return (
    <>
      <Avatar className="h-[40px] w-[40px] rounded-full">
        <AvatarImage alt="User" />
        <AvatarFallback>{formatUserInitial(firstname)}</AvatarFallback>
      </Avatar>
    </>
  );
}
