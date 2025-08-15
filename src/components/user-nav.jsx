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

export function UserNav() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);
  const loading = useUserStore((state) => state.loading);

  if (loading) return <UserSkeleton />;
  if (!user) return null;

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      clearUser();
      router.push("/");
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  const formatUserInitial = (firstname) => {
    if (!firstname) return "U";
    return firstname.slice(0, 2).toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative p-0 w-10 h-10 rounded-full overflow-hidden"
        >
          <Avatar className="h-full w-full rounded-full">
            <AvatarImage alt="User" />
            <AvatarFallback>{formatUserInitial(user.fname)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.fname} {user.lname}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            {user?.role === "ADMIN" ? (
              <Link href="/admin">Dashboard</Link>
            ) : (
              <Link href="/dashboard">Dashboard</Link>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            {user.role === "USER" && <Link href="/">Home</Link>}
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/profile-settings">Profile</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
