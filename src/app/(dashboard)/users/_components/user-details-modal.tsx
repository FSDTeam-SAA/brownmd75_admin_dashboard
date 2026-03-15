"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, Clock } from "lucide-react";
import Image from "next/image";

export function UserDetailsModal({ isOpen, onClose, user }: any) {
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-3xl border-none">
        <div className="p-8 space-y-6">
          {/* Avatar Section */}
          <div className="flex justify-center mb-4">
            <div className="w-40 h-40 rounded-2xl overflow-hidden border-4 border-white shadow-lg">
              <Image
                src="/images/avatar-placeholder.webp"
                alt="Profile"
                width={1000}
                height={1000}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <div className="space-y-2">
              <Label className="font-bold text-gray-700">Full Name</Label>
              <Input
                value={`${user.firstName} ${user.lastName}`}
                disabled
                className="bg-white border-gray-200 rounded-xl h-12"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-bold text-gray-700">Email Name</Label>
              <Input
                value={user.email}
                disabled
                className="bg-white border-gray-200 rounded-xl h-12"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-bold text-gray-700">Address</Label>
              <Input
                value="5061 Howerton Way, Suite L, Bowie, MD"
                disabled
                className="bg-white border-gray-200 rounded-xl h-12"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-bold text-gray-700">Equipment Name</Label>
              <Input
                value="Excavator"
                disabled
                className="bg-white border-gray-200 rounded-xl h-12"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-bold text-gray-700">User Status</Label>
              <Select defaultValue="active">
                <SelectTrigger className="h-12 rounded-xl border-gray-200 text-gray-400">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspend">Suspend</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="font-bold text-gray-700">Payment Status</Label>
              <Select defaultValue="paid">
                <SelectTrigger className="h-12 rounded-xl border-gray-200 text-gray-400">
                  <SelectValue placeholder="Payment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="font-bold text-gray-700">Rental Period</Label>
              <div className="relative">
                <Input
                  value="12/05/24 - 23/05/24"
                  disabled
                  className="bg-white border-gray-200 rounded-xl h-12 pl-4"
                />
                <CalendarIcon className="absolute right-4 top-3.5 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-bold text-gray-700">Time Duration</Label>
              <div className="relative">
                <Input
                  value="02:00 am - 10:00 pm"
                  disabled
                  className="bg-white border-gray-200 rounded-xl h-12 pl-4"
                />
                <Clock className="absolute right-4 top-3.5 w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
