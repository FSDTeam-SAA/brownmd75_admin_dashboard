"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import useAuth from "@/lib/hooks/useAuth";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");

  const router = useRouter();

  const { loading, handleForgotPassword } = useAuth();

  const handleSendCode = async () => {
    const response = await handleForgotPassword(email);

    if (response.success && response.data?.data?.accessToken) {
      // Get the accessToken
      const accessToken = response.data.data.accessToken;
      router.push(`/verify-otp?token=${encodeURIComponent(accessToken)}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf8f6] p-4">
      {" "}
      <div className="w-[500px] bg-white rounded-2xl shadow-lg px-8 py-10">
        {" "}
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
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary">
            Reset Your Password{" "}
          </h1>
          <p className="text-secondary mt-1 text-sm">
            Enter your email address and we’ll send you code to reset your
            password.
          </p>
        </div>
        <div className="mt-6 space-y-4">
          <div>
            <Label className="">Email Address</Label>

            <Input
              type="email"
              className="mt-1 py-5 mt-2"
              placeholder="hello@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <Button
            className="w-full bg-primary hover:bg-primary text-white cursor-pointer"
            onClick={handleSendCode}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send OTP"}
          </Button>
        </div>
      </div>
    </div>
  );
}
