// // src/components/features/auth/api/useforgotpassword.ts

"use client";
import { useState } from "react";
import { forgotPasswordApi } from "../api/forgotPassword.api";

 
//  use forgot password hook
export function useForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [data, setData] = useState<any>(null);

  const forgotPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    setData(null);
    try {
      const response = await forgotPasswordApi(email);
    //   setSuccess(response.message);
      setData(response);
    } catch (error) {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      setError(
        err.response?.data?.message || err.message || "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  return { forgotPassword, loading, error, success, data };
}
