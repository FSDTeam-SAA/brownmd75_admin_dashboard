/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Edit3 } from "lucide-react";

const PersonalInfo = ({ profile, isLoading, token }: any) => {
  const queryClient = useQueryClient();
  const { register, handleSubmit } = useForm({
    values: profile, // Automatically syncs with fetched data
  });

  const mutation = useMutation({
    mutationFn: async (updatedData: any) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/update-profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        },
      );
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Profile updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["my-profile"] });
      } else {
        toast.error(data.message || "Failed to update");
      }
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold">Personal Information</h3>
        <button
          type="submit"
          className="bg-[#F7A633] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
        >
          <Edit3 size={16} /> Edit
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold">First Name</label>
          <input
            {...register("firstName")}
            className="w-full p-3 border rounded-lg bg-gray-50 focus:bg-white outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold">Last Name</label>
          <input
            {...register("lastName")}
            className="w-full p-3 border rounded-lg bg-gray-50 focus:bg-white outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold">Email Address</label>
          <input
            {...register("email")}
            readOnly
            className="w-full p-3 border rounded-lg bg-gray-100 cursor-not-allowed"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold">Phone</label>
          <input
            {...register("phone")}
            className="w-full p-3 border rounded-lg bg-gray-50 focus:bg-white outline-none"
          />
        </div>
        <div className="col-span-2 space-y-2">
          <label className="text-sm font-semibold">Bio</label>
          <textarea
            {...register("bio")}
            rows={4}
            className="w-full p-3 border rounded-lg bg-gray-50 focus:bg-white outline-none resize-none"
          />
        </div>
      </div>
    </form>
  );
};

export default PersonalInfo;
