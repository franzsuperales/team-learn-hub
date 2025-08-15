"use client";

import React, { use, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useUserStore from "@/lib/store/useUserStore";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { profileSchema } from "@/validator/validator";
import axios from "axios";
import { toast } from "sonner";

export function ProfileForm() {
  const [loading, setLoading] = useState(false);
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(profileSchema),
  });

  if (!user) return null;

  const onSubmit = async (data) => {
    setLoading(true);
    const updatedData = {
      fname: data.fname,
      lname: data.lname,
      bio: data.bio,
    };

    try {
      const res = await axios.put(
        `/api/user/user-profile/${user.id}`,
        updatedData
      );
      if (res.status === 200) {
        // Update the user data in the store
        //clear user
        // useUserStore.setState({ user: { ...user, ...updatedData } });
        setUser({ ...user, ...updatedData });

        toast("User profile updated successfully");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast("User profile updated failed");
    } finally {
      setLoading(false);
    }
  };

  // setIsLoading(true);
  // try {
  //   // Simulate API call
  //   await new Promise((resolve) => setTimeout(resolve, 1000));
  //   const formData = new FormData(event.currentTarget);
  //   const updatedData = {
  //     name: formData.get("name"),
  //     email: formData.get("email"),
  //     bio: formData.get("bio"),
  //   };
  //   setUserData(updatedData);
  //   toast({
  //     title: "Profile updated",
  //     description: "Your profile information has been updated successfully.",
  //   });
  // } catch (error) {
  //   toast({
  //     title: "Update failed",
  //     description: "There was a problem updating your profile.",
  //     variant: "destructive",
  //   });
  // } finally {
  //   setIsLoading(false);
  // }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2 flex w-full  gap-4">
        <div className="w-full space-y-2">
          <Label htmlFor="name">First Name</Label>
          <Input
            id="name"
            name="name"
            defaultValue={user.fname}
            {...register("fname")}
          />
          {errors.fname && (
            <span className="text-red-400 text-sm">{errors.fname.message}</span>
          )}
        </div>
        <div className="w-full space-y-2">
          <Label htmlFor="name">Last Name</Label>
          <Input
            id="name"
            name="name"
            defaultValue={user.lname}
            {...register("lname")}
          />
          {errors.lname && (
            <span className="text-red-400 text-sm">{errors.lname.message}</span>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          disabled
          id="email"
          name="email"
          type="email"
          defaultValue={user.email}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          name="bio"
          defaultValue={user.bio}
          placeholder="Tell u a little about yourself"
          {...register("bio")}
        />
        {errors.bio && (
          <span className="text-red-400 text-sm">{errors.bio.message}</span>
        )}
      </div>

      {/* <div className="space-y-2">
        <Label htmlFor="current-password">Current Password</Label>
        <Input id="current-password" name="current-password" type="password" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="new-password">
          New Password (leave blank to keep current)
        </Label>
        <Input id="new-password" name="new-password" type="password" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirm New Password</Label>
        <Input id="confirm-password" name="confirm-password" type="password" />
      </div> */}

      <Button type="submit" disabled={!isValid || loading}>
        {loading ? (
          <>
            <LoaderCircle className="animate-spin" /> Saving
          </>
        ) : (
          "Save Changes"
        )}
      </Button>
    </form>
  );
}
