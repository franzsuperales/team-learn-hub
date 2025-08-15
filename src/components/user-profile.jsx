"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import useUserStore from "@/lib/store/useUserStore";

export function UserProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const user = useUserStore((state) => state.user);

  if (!user) return null;

  const handleSubmit = async (event) => {
    // event.preventDefault();
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
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" defaultValue={user.fname} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          disabled
          id="email"
          name="email"
          type="email"
          defaultValue={user.email}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          name="bio"
          defaultValue={user.bio}
          placeholder="Enter your bio here..."
        />
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

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
