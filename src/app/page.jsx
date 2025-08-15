"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoaderCircle, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Footer from "./components/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import MaterialList from "./components/MaterialList";

export default function Home() {
  const { data: session, status } = useSession();
  const user = session?.user;

  const fetchApprovedMaterials = async () => {
    const res = await axios.get(`/api/user/approved-materials`);
    return res.data || [];
  };

  const {
    data: userMaterials,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["published-materials"],
    queryFn: fetchApprovedMaterials,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">
          <section className="w-full h-[550px] flex items-center justify-center py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
                    [ ET ] Learning Resource Hub
                  </h1>
                  <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                    Discover, share, and organize learning materials in one
                    place.
                  </p>
                </div>
                <div className="space-x-4">
                  <Link href="/signin">
                    <Button size="lg">Get Started</Button>
                  </Link>
                  <Link href="/signin">
                    <Button variant="outline" size="lg">
                      Browse Materials
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
            <div className="container px-4 md:px-6 grid max-w-5xl gap-6 lg:grid-cols-2 mx-auto">
              <div className="space-y-4">
                <span className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                  For Learners
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter">
                  Find the resources you need
                </h2>
                <p className="text-gray-500 md:text-xl dark:text-gray-400 max-w-[600px]">
                  Access a curated collection of learning materials. Bookmark
                  your favorites for quick access.
                </p>
              </div>
              <div className="space-y-4">
                <span className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                  For Contributors
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter">
                  Share your knowledge
                </h2>
                <p className="text-gray-500 md:text-xl dark:text-gray-400 max-w-[600px]">
                  Upload PDFs, videos, and more. Help others and manage your
                  contributions easily.
                </p>
              </div>
            </div>
          </section>

          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6 grid max-w-5xl gap-6 lg:grid-cols-3 mx-auto">
              {[
                {
                  title: "Discover",
                  description:
                    "Browse through various categories of learning materials",
                  content:
                    "Filter by categories to find exactly what you need for your learning journey.",
                  link: "/materials",
                  button: "Browse Now",
                },
                {
                  title: "Contribute",
                  description: "Share your knowledge with the community",
                  content:
                    "Upload PDFs, videos, links, and other learning materials to help others learn.",
                  link: "/register",
                  button: "Join Now",
                },
                {
                  title: "Organize",
                  description: "Keep track of your learning resources",
                  content:
                    "Bookmark materials, manage your uploads, and keep your learning organized.",
                  link: "/login",
                  button: "Get Started",
                },
              ].map((card, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle>{card.title}</CardTitle>
                    <CardDescription>{card.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{card.content}</p>
                  </CardContent>
                  <CardFooter>
                    <Link href={card.link}>
                      <Button variant="outline">{card.button}</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  if (user?.role === "USER" && status === "authenticated") {
    return (
      <main className="min-h-screen p-4">
        <div className="flex min-h-screen flex-col">
          <main>
            <Card>
              <CardHeader>
                <CardTitle>Browse Materials</CardTitle>
                <CardDescription>
                  Explore our collection of learning resources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MaterialList
                  isFetching={isFetching}
                  isLoading={isLoading}
                  userMaterials={userMaterials}
                ></MaterialList>
              </CardContent>
            </Card>
          </main>
        </div>
      </main>
    );
  }
}
