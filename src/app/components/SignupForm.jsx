"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { userRegistrationSchema } from "@/validator/validator";
import { registerUser } from "@/actions/auth/user";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { LoaderCircle, Mail } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(userRegistrationSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("email", data.email || "");
      formData.append("password", data.password || "");
      formData.append("fname", data.fname || "");
      formData.append("lname", data.lname || "");

      const result = await registerUser(formData);
      if (result.success) {
        await signIn("nodemailer", { email: data.email, redirect: false });
        setIsSubmitted(true);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error("Error during registration:", err);
      setError("An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex h-screen items-center justify-center">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>
            {isSubmitted
              ? "We've sent a verification email to your Outlook address."
              : "Enter your information to create an account"}
          </CardDescription>
        </CardHeader>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input placeholder="First Name" {...register("fname")} />
                  {errors.fname && (
                    <p className="text-red-400 text-sm">{errors.fname.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input placeholder="Last Name" {...register("lname")} />
                  {errors.lname && (
                    <p className="text-red-400 text-sm">{errors.lname.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  placeholder="email@questronix.com.ph"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-400 text-sm">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Password</Label>
                <Input type="password" placeholder="Password" {...register("password")} />
                {errors.password && (
                  <p className="text-red-400 text-sm">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Confirm Password</Label>
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className="text-red-400 text-sm">
                    {errors.confirmPassword.message}
                  </p>
                )}
                {error && <p className="text-red-400 text-sm">{error}</p>}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={!isValid || isLoading}
              >
                {isLoading ? <LoaderCircle className="animate-spin" /> : "Create Account"}
              </Button>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <div className="text-center text-sm">
                <p>
                  Already have an account?{" "}
                  <Link
                    href="/signin"
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    Login
                  </Link>
                </p>
              </div>
            </CardFooter>
            </div>  
          </form>
        ) : (
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-primary/10 p-4 text-center">
              <Mail className="mx-auto mb-2 h-8 w-8 text-primary" />
              <p className="text-sm">
                Check your Outlook email to verify your account. If you don&apos;t
                see the email, check your spam folder.
              </p>
            </div>
            <Button variant="outline" asChild className="w-full">
              <Link href="/signin">Go to login</Link>
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
