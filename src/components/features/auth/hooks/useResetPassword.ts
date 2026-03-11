// features/auth/hooks/useresetpassword.ts
"use client";
import { useState } from "react";
import { isAxiosError } from "axios";
import { resetPasswordApi } from "../api/resetpassword.api";
 
export function useResetPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleResetPassword = async (
    data: { newPassword: string; confirmPassword: string },
    token: string,
  ) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await resetPasswordApi(data, token);
      setSuccess(true);
      return response;
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.message || "Something went wrong");
      } else {
        setError("An unexpected error occurred");
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleResetPassword, loading, error, success };
}
