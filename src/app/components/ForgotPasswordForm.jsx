"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { resetPassword } from "@/actions/auth/user"
import { validEmail } from "@/validator/validator"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, ArrowLeft } from "lucide-react"

export default function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(validEmail),
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    const formData = new FormData()
    formData.append("email", data.email || "")

    try {
      const result = await resetPassword(formData)

      if (result?.error) {
        toast({
          title: "Something went wrong",
          description: result.error,
          variant: "destructive",
        })
        return
      }

      setIsSubmitted(true)
      toast({
        title: "Reset Link Sent",
        description: `We've sent a password reset link to ${data.email}.`,
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Unable to send reset link. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex h-screen items-center justify-center">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Forgot password</CardTitle>
          <CardDescription>
            {isSubmitted
              ? "We've sent you an email with a link to reset your password."
              : "Enter your email address and we'll send you a link to reset your password."}
          </CardDescription>
        </CardHeader>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    placeholder="email@questronix.com.ph"
                    {...register("email")}
                    className="pl-10"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={!isValid || isLoading}>
                {isLoading ? "Sending reset link..." : "Send reset link"}
              </Button>
            </CardContent>
        
            <CardFooter className="flex flex-col">
              <Button variant="ghost" asChild className="w-full">
                <Link href="/signin" className="flex items-center justify-center">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to login
                </Link>
              </Button>
            </CardFooter>
          </div>
        </form>        
        ) : (
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-primary/10 p-4 text-center">
              <Mail className="mx-auto mb-2 h-8 w-8 text-primary" />
              <p className="text-sm">
                Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder.
              </p>
            </div>
            <Button variant="outline" asChild className="w-full">
              <Link href="/signin">Return to login</Link>
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  )
}