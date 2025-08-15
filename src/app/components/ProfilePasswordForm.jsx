"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useUserStore from "@/lib/store/useUserStore";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { newPassword } from "@/validator/validator";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import axios from "axios";
import { Description } from "@radix-ui/react-dialog";
export function ProfilePasswordForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const user = useUserStore((state) => state.user);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(newPassword),
  });

  if (!user) return null;

  const onSubmit = async (data) => {
    // console.log(data);
    setLoading(true);

    const passwordData = {
      password: data.password,
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
    };

    try {
      const res = await axios.post(
        `/api/user/user-profile/${user.id}`,
        passwordData
      );

      if (res.status === 200) {
        // console.log("Password updated successfully:", res.data);
        toast("Password updated successfully");
        reset(); // Reset the form fields after successful submission
      } else {
        setError(error.response.data.message);
      }
    } catch (error) {
      toast("Password updated failed", {
        description: error.response.data.message,
      });

      // setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="current-password">Current Password</Label>
        <Input
          id="current-password"
          name="current-password"
          type="password"
          {...register("password")}
        />
        {errors.password && (
          <span className="text-red-400 text-sm">
            {errors.password.message}
          </span>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="new-password">New Password</Label>
        <Input
          id="new-password"
          name="new-password"
          type="password"
          {...register("newPassword")}
        />
        {errors.newPassword && (
          <span className="text-red-400 text-sm">
            {errors.newPassword.message}
          </span>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirm New Password</Label>
        <Input
          id="confirm-password"
          name="confirm-password"
          type="password"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <span className="text-red-400 text-sm">
            {errors.confirmPassword.message}
          </span>
        )}
      </div>

      {/* {error && <p className="text-red-400 text-sm">{error}</p>} */}
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
