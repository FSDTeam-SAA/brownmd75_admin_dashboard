"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import PersonalInfo from "./personal-info";
import ChangePassword from "./change-password";

const Settings = () => {
  const [activeTab, setActiveTab] = useState<"personal" | "password">(
    "personal",
  );
  const session = useSession();
  const token = session?.data?.accessToken;

  const { data: profile, isLoading } = useQuery({
    queryKey: ["my-profile"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/my-profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const result = await res.json();
      return result.data;
    },
    enabled: !!token,
  });

  return (
    <div className="min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-black">Settings</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("personal")}
          className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all border ${
            activeTab === "personal"
              ? "bg-[#F7A633] text-white border-[#F7A633]"
              : "bg-white text-gray-700 border-gray-300"
          }`}
        >
          Personal Information
        </button>
        <button
          onClick={() => setActiveTab("password")}
          className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all border ${
            activeTab === "password"
              ? "bg-[#F7A633] text-white border-[#F7A633]"
              : "bg-white text-gray-700 border-gray-300"
          }`}
        >
          Change Password
        </button>
      </div>

      {/* Profile Header */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 flex items-center gap-4 mb-6">
        <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200">
          <Image
            src={profile?.image?.url || "/images/avatar-placeholder.webp"}
            alt="User"
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {profile?.firstName} {profile?.lastName}
          </h2>
          <p className="text-gray-500 capitalize">{profile?.role}</p>
        </div>
      </div>

      {/* Dynamic Form Content */}
      <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
        {activeTab === "personal" ? (
          <PersonalInfo profile={profile} isLoading={isLoading} token={token} />
        ) : (
          <ChangePassword token={token as string} />
        )}
      </div>
    </div>
  );
};

export default Settings;
