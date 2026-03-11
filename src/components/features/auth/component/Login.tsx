"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSignIn = async () => {
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.ok) {
        toast.success("Logged in successfully!");
        router.push("/");
      } else {
        toast.error(result?.error || "Login failed. Please try again.");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-[500px] bg-white rounded-2xl shadow-lg px-8 py-10">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={80}
            height={80}
            priority
          />
        </div>

        {/* Heading */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-secondary">IWMS Admin</h1>
          <p className="mt-1 text-sm text-gray-500">
            Secure access for moderation & support
          </p>
        </div>

        <div className="space-y-3">

          {/* Email */}
          <div>
            <Label className="text-sm font-medium">Email Address</Label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="email"
                placeholder="Enter your email"
                className="pl-10 py-5"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <Label className="text-sm font-medium">Password</Label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="pl-10 pr-10 py-5"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer">
                Remember me
              </label>
            </div>

            <Link
              href="/forget-password"
              className="text-sm text-[#E53838] hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Button */}
          <Button
            className="w-full bg-primary text-white py-5 cursor-pointer"
            onClick={handleSignIn}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Log In"}
          </Button>
        </div>
      </div>
    </div>
  );
}
