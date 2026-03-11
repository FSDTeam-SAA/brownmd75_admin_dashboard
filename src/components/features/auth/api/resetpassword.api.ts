// src/components/features/auth/api/resetpassword.api.ts

import axiosInstance from "@/lib/instance/axios-instance";

export const resetPasswordApi = async (
  data: { newPassword: string; confirmPassword: string },
  token: string,
) => {
  const res = await axiosInstance.post("/auth/reset-password", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};