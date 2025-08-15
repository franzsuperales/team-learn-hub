"use client";
import React from "react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

const SignoutBtn = () => {
  const handleSignOut = async () => {
    await signOut();
  };
  return (
    <div>
      <Button onClick={handleSignOut}>Sign out</Button>
    </div>
  );
};

export default SignoutBtn;

