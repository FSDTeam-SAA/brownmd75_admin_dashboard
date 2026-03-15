'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { User, ShoppingCart, Globe } from "lucide-react";
import Image from "next/image";

export function PaymentDetailsModal({ isOpen, onClose, data }: any) {
  if (!data) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl p-8 rounded-3xl">
        <h2 className="text-2xl font-bold text-center mb-8">Payment Details</h2>

        <div className="space-y-8">
          {/* Customer Details */}
          <section>
            <div className="flex items-center gap-2 font-bold text-lg mb-4">
              <User className="w-5 h-5" /> Customer Details
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p>
                  <span className="font-semibold text-black">Name :</span>{" "}
                  {data.shippingAddress?.fullName}
                </p>
                <p className="mt-2">
                  <span className="font-semibold text-black">E-mail :</span>{" "}
                  {data.user?.email}
                </p>
              </div>
              <div className="text-right">
                <p>
                  <span className="font-semibold text-black">Location :</span>{" "}
                  {data.shippingAddress?.streetAddress},{" "}
                  {data.shippingAddress?.cityName}
                </p>
                <p className="mt-2 text-xl font-bold text-black">
                  ${data.totalAmount}.00
                </p>
              </div>
            </div>
          </section>

          {/* Total Payment Status */}
          <section>
            <div className="flex items-center gap-2 font-bold text-lg mb-4">
              <ShoppingCart className="w-5 h-5" /> Total Payment
            </div>
            <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5 flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                  Last Order
                </p>
                <p className="font-bold">
                  {new Date(data.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 mb-1">Status</p>
                <span className="bg-[#DCFCE7] text-[#22C55E] px-4 py-1 rounded-md text-xs font-bold uppercase">
                  {data.paymentStatus}
                </span>
              </div>
            </div>
          </section>

          {/* Ordered Items */}
          <section>
            <div className="flex items-center gap-2 font-bold text-lg mb-4">
              <Globe className="w-5 h-5" /> Ordered Items
            </div>
            <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-4 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center overflow-hidden">
                  {/* Fallback image */}
                  <Image
                    src="https://via.placeholder.com/150"
                    alt="item"
                    width={1000}
                    height={1000}
                    className="object-contain w-12 h-12"
                  />
                </div>
                <div>
                  <p className="font-bold text-gray-800">
                    {data.items[0]?.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <span className="bg-orange-100 text-orange-500 rounded-full p-0.5 font-bold text-[10px]">
                      C
                    </span>
                    ${data.items[0]?.priceAtBooking}.00/Week
                  </p>
                </div>
              </div>
              <p className="font-bold text-lg">
                ${data.items[0]?.priceAtBooking}.00
              </p>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
