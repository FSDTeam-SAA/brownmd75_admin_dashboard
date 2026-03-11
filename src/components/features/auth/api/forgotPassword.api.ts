// src/components/features/auth/api/forgotPassword.api.ts
import axiosInstance from "@/lib/instance/axios-instance";

// Forgot Password
export const forgotPasswordApi = async (email: string) => {
  try {
    const response = await axiosInstance.post("/auth/forgot-password", {
      email,
    });

    return {
      success: true,
      data: response.data,
    };
  } catch {
    return {
      success: false,
      message: "Request failed",
    };
  }
};
