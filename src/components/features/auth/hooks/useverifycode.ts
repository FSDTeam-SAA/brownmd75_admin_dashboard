// src/components/features/auth/hooks/useverifycode.ts

"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { verifyOtp as verifyCodeApi } from "../api/verifycode.api";
 
export function useVerifyCode() {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  const handleVerifyOtp = async (otp: string) => {
    setLoading(true);
    const token = searchParams.get("token") || "";
    try {
      const res = await verifyCodeApi({ otp }, token);
      setLoading(false);
      return res;
    } catch (error: any) {
      setLoading(false);
      return {
        success: false,
        message:
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong",
      };
    }
  };

  return { handleVerifyOtp, loading };
}
