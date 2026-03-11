"use client";
import { useState } from "react";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import useAuth from "@/lib/hooks/useAuth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function ResetPassword() {
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { handleResetPassword, loading } = useAuth();
  const router = useRouter();

  // Handle Save
  const handleSave = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const res = await handleResetPassword(newPassword, confirmPassword);
    if (res.success) {
      toast.success("Password reset successfully!");
      router.push("/login");
    } else {
      toast.error(res.message || "Something went wrong!");
    }
  };

  return (
    <div className="mx-auto container w-[500px]">
      <div className="bg-white rounded-2xl shadow-md p-10">
        {/* Logo */}
        <div className="flex justify-center mb-2">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={1000}
            height={1000}
            className="h-[30px] w-[200px] object-cover"
            priority
          />
        </div>

        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-primary mb-2">
            Create a New Password
          </h2>
          <p className="text-[#343A40] mb-6">Set a strong password to secure your account.</p>
        </div>

        {/* New Password */}

        <div className="relative mb-5">
          <input
            id="new-password"
            type={showPassword1 ? "text" : "password"}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#0B3B36] transition-colors"
            placeholder="Create New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword1(!showPassword1)}
            className="absolute right-3 top-3 text-gray-500 hover:text-[#0B3B36] transition-colors"
            aria-label={showPassword1 ? "Hide password" : "Show password"}
          >
            {showPassword1 ? (
              <EyeOff size={20} className="cursor-pointer" />
            ) : (
              <Eye size={20} className="cursor-pointer" />
            )}
          </button>
        </div>

        {/* Confirm Password */}

        <div className="relative mb-4">
          <input
            id="confirm-password"
            type={showPassword2 ? "text" : "password"}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#0B3B36] transition-colors"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword2(!showPassword2)}
            className="absolute right-3 top-3 text-gray-500 hover:text-[#0B3B36] transition-colors"
            aria-label={
              showPassword2 ? "Hide confirm password" : "Show confirm password"
            }
          >
            {showPassword2 ? (
              <EyeOff size={20} className="cursor-pointer" />
            ) : (
              <Eye size={20} className="cursor-pointer" />
            )}
          </button>
        </div>

        {/* Save Button */}
        <Button
          className={`w-full bg-primary text-white py-6 rounded-md text-lg font-medium hover:bg-primary transition flex justify-center items-center gap-2 cursor-pointer ${
            loading ? "cursor-not-allowed opacity-70" : ""
          }`}
          onClick={handleSave}
          disabled={loading}
        >
          {loading && <LoaderCircle />}
          {loading ? "Saving..." : "Change Password"}
        </Button>
      </div>
    </div>
  );
}
