"use client";

import React from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { UserNav } from "@/components/user-nav";
import useUserStore from "@/lib/store/useUserStore";

const Header = () => {
  const { data: session, status } = useSession();
  const user = useUserStore((state) => state.user);
  const pathname = usePathname();


  const isAuthPage = 
      pathname === "/signin" || 
      pathname === "/signup" || 
      pathname === "/forgot-password" || 
      pathname.startsWith("/verify")

  // Avoid showing the header on auth pages
  if (isAuthPage) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container px-6 flex h-14 items-center justify-between">
        <Link href="/" className="font-bold text-lg">
          [ET]eamLearn Hub
        </Link>

        {status === "authenticated" ? (
          <div className="flex items-center gap-4">
            <div className="flex flex-col text-right">
              <span className="text-sm">
                {user?.fname} {user?.lname}
              </span>
              <span className="text-sm">{user?.email}</span>
            </div>
            <UserNav />
          </div>
        ) : !session ? (
          <div className="flex gap-2">
            <Link href="/signin">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Register</Button>
            </Link>
          </div>
        ) : null}
      </div>
    </header>
  );
};

export default Header;
