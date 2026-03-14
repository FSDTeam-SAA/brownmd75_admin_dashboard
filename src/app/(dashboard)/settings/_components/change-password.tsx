/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Save } from "lucide-react";

const ChangePassword = ({ token }: { token: string }) => {
  const { register, handleSubmit, reset, watch } = useForm();

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword: data.currentPassword,
            newPassword: data.newPassword,
          }),
        },
      );
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Password changed successfully!");
        reset();
      } else {
        toast.error(data.message || "Failed to change password");
      }
    },
  });

  return (
    <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold">Change password</h3>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold">Current Password</label>
          <input
            type="password"
            {...register("currentPassword", { required: true })}
            placeholder="*************"
            className="w-full p-3 border rounded-lg outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold">New Password</label>
            <input
              type="password"
              {...register("newPassword", { required: true, minLength: 6 })}
              placeholder="*************"
              className="w-full p-3 border rounded-lg outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">
              Confirm New Password
            </label>
            <input
              type="password"
              {...register("confirmPassword", {
                validate: (val) =>
                  val === watch("newPassword") || "Passwords do not match",
              })}
              placeholder="*************"
              className="w-full p-3 border rounded-lg outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="bg-[#F7A633] text-white px-8 py-3 rounded-lg flex items-center gap-2 font-semibold disabled:opacity-50"
          >
            <Save size={18} />{" "}
            {mutation.isPending ? "Updating..." : "Save Changes"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ChangePassword;
