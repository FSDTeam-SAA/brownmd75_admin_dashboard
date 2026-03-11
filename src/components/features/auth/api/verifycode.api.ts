// src/components/features/auth/api/verifycode.api.ts

import axiosInstance from "@/lib/instance/axios-instance";
 
// Verify OTP
export const verifyOtp = async (
  payload: { otp: string },
  tokenFromURL: string,
) => {
 
  try {
    const response = await axiosInstance.post("/auth/verify-otp", payload, {
      headers: {
        Authorization: `Bearer ${tokenFromURL}`,
      },
    });

    return { success: true, data: response.data };
  } catch {
    return {
      success: false,
      message: "Verification failed",
    };
  }
};
