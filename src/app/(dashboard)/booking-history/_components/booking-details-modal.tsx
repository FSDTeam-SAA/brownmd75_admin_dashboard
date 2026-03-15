/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { User, ShoppingCart, Truck, Box } from "lucide-react";
import Image from "next/image";

export function BookingDetailsModal({ isOpen, onClose, data }: any) {
  if (!data) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl p-8 rounded-3xl overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold text-center mb-8">Booking Details</h2>

        <div className="space-y-8">
          {/* Order Details */}
          <section>
            <div className="flex items-center gap-2 font-bold text-lg mb-4">
              <ShoppingCart className="w-5 h-5" /> Order Details
            </div>
            <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5 flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-400 mb-1">Order Date</p>
                <p className="font-bold">
                  {new Date(data.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 mb-1">Status</p>
                <span className="bg-orange-100 text-[#F59E0B] px-4 py-1 rounded-md text-xs font-bold capitalize">
                  {data.orderStatus}
                </span>
              </div>
            </div>
          </section>

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
                  {data.shippingAddress?.cityName},{" "}
                  {data.shippingAddress?.stateName}
                </p>
              </div>
            </div>
          </section>

          {/* Delivery Details */}
          <section>
            <div className="flex items-center gap-2 font-bold text-lg mb-4">
              <Truck className="w-5 h-5" /> Delivery Details
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p>
                  <span className="font-semibold text-black">Phone :</span>{" "}
                  {data.shippingAddress?.phone}
                </p>
                <p className="mt-2">
                  <span className="font-semibold text-black">E-mail :</span>{" "}
                  {data.shippingAddress?.email}
                </p>
              </div>
              <div className="text-right">
                <p>
                  <span className="font-semibold text-black">Location :</span>{" "}
                  {data.shippingAddress?.streetAddress},{" "}
                  {data.shippingAddress?.houseNumber}
                </p>
              </div>
            </div>
          </section>

          {/* Ordered Items */}
          <section>
            <div className="flex items-center gap-2 font-bold text-lg mb-4">
              <Box className="w-5 h-5" /> Ordered Items
            </div>
            {data.items.map((item: any) => (
              <div
                key={item._id}
                className="bg-white border border-gray-100 shadow-sm rounded-2xl p-4 flex justify-between items-center mb-2"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-50 rounded-xl overflow-hidden">
                    <Image
                      src={item.equipment?.image?.url}
                      alt={item.title}
                      width={1000}
                      height={1000}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{item.title}</p>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      <span className="bg-orange-100 text-orange-500 rounded-full p-0.5 font-bold text-[8px]">
                        C
                      </span>
                      ${item.priceAtBooking}.00/Week
                    </p>
                  </div>
                </div>
                <p className="font-bold text-lg">${item.priceAtBooking}.00</p>
              </div>
            ))}
          </section>

          <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">Online Payment</span>
              <span className="border border-gray-200 px-6 py-1 rounded text-xs text-gray-400">
                Paid
              </span>
            </div>
            <p className="text-xl font-bold">
              Total Amount: <span className="ml-4">${data.totalAmount}.00</span>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
