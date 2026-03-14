/* eslint-disable react-hooks/preserve-manual-memoization */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import { BookingDetailsModal } from "./booking-details-modal";

export default function BookingManagement() {
  const session = useSession();
  const token = session?.data?.accessToken;
  const queryClient = useQueryClient();

  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Fetch Booking History
  const { data, isLoading } = useQuery({
    queryKey: ["all-orders", token],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/order/all`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return res.data;
    },
    enabled: !!token,
  });

  // Get orders array from data
  const orders = data?.data || [];

  // Calculate statistics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (order: any) => order.orderStatus === "pending",
  ).length;
  const cancelledOrders = orders.filter(
    (order: any) => order.orderStatus === "cancelled",
  ).length;

  // Calculate pagination values
  const totalItems = orders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Get current page items
  const currentOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return orders.slice(startIndex, endIndex);
  }, [orders, currentPage, itemsPerPage]);

  // Handle page changes
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToPreviousPage = () => {
    goToPage(currentPage - 1);
  };

  const goToNextPage = () => {
    goToPage(currentPage + 1);
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pageNumbers.push(i);
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pageNumbers.push(i);
      } else {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++)
          pageNumbers.push(i);
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };

  // Update Status Mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({
      orderId,
      status,
    }: {
      orderId: string;
      status: string;
    }) => {
      const body =
        status === "delivered"
          ? { orderStatus: "delivered", paymentStatus: "paid" }
          : { orderStatus: status };

      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/order/${orderId}`,
        body,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-orders"] });
      toast.success("Order status updated");
    },
    onError: () => toast.error("Failed to update status"),
  });

  return (
    <div className="min-h-screen">
      <h1 className="text-3xl font-black uppercase tracking-tight mb-6">
        Booking Management
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Order"
          value={totalOrders.toString()}
          color="text-black"
        />
        <StatCard
          title="Pending Order"
          value={pendingOrders.toString()}
          color="text-black"
        />
        <StatCard
          title="Cancel Order"
          value={cancelledOrders.toString()}
          color="text-black"
        />
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden px-4 pb-4">
        {/* Items per page selector */}
        {orders.length > 0 && (
          <div className="flex justify-between items-center pt-4 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Show</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-gray-200 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-gray-500">entries</span>
            </div>
            <div className="text-sm text-gray-500">
              Showing{" "}
              {totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
              {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{" "}
              entries
            </div>
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow className="border-none hover:bg-transparent">
              <TableHead className="text-center font-semibold text-gray-700 py-6">
                User Name
              </TableHead>
              <TableHead className="text-center font-semibold text-gray-700">
                Category
              </TableHead>
              <TableHead className="text-center font-semibold text-gray-700">
                Price
              </TableHead>
              <TableHead className="text-center font-semibold text-gray-700">
                Payment
              </TableHead>
              <TableHead className="text-center font-semibold text-gray-700">
                Order Status
              </TableHead>
              <TableHead className="text-center font-semibold text-gray-700">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-20 text-gray-400"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : currentOrders.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-20 text-gray-400"
                >
                  No bookings found
                </TableCell>
              </TableRow>
            ) : (
              currentOrders.map((order: any, index: number) => (
                <TableRow
                  key={order._id}
                  className={`${(index + (currentPage - 1) * itemsPerPage) % 2 === 0 ? "bg-[#F9FAFB]" : "bg-white"} border-none hover:bg-gray-100 transition-colors`}
                >
                  <TableCell className="text-center py-4 font-medium">
                    {order.shippingAddress?.fullName?.split(" ")[0] || "User"}
                  </TableCell>
                  <TableCell className="text-center text-gray-500 text-sm">
                    {order.items[0]?.category ||
                      "Construction & Heavy Equipment"}
                  </TableCell>
                  <TableCell className="text-center font-semibold">
                    ${order.totalAmount}.00
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`px-4 py-1 rounded-md text-xs font-medium uppercase ${
                        order.paymentMethod === "cod"
                          ? "bg-[#FEF9C3] text-[#F59E0B]"
                          : "bg-[#DCFCE7] text-[#22C55E]"
                      }`}
                    >
                      {order.paymentMethod === "cod" ? "COD" : "Paid"}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Select
                      defaultValue={order.orderStatus}
                      onValueChange={(val) =>
                        updateStatusMutation.mutate({
                          orderId: order._id,
                          status: val,
                        })
                      }
                    >
                      <SelectTrigger className="w-32 mx-auto h-8 rounded-lg text-xs capitalize">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "pending",
                          "confirmed",
                          "shipped",
                          "delivered",
                          "cancelled",
                        ].map((s) => (
                          <SelectItem
                            key={s}
                            value={s}
                            className="capitalize text-xs"
                          >
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-center">
                    <button
                      onClick={() => {
                        setSelectedBooking(order);
                        setIsModalOpen(true);
                      }}
                      className="p-1.5 border border-[#22C55E] rounded-full text-[#22C55E] hover:bg-[#22C55E] hover:text-white transition-all"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {totalPages > 0 && (
          <div className="flex justify-center items-center gap-2 mt-8 pb-4">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`p-2 rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 transition-all ${
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:border-gray-300"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {getPageNumbers().map((page, index) =>
              page === "..." ? (
                <span key={`ellipsis-${index}`} className="text-gray-400 px-2">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => goToPage(page as number)}
                  className={`w-8 h-8 rounded-full text-sm transition-all ${
                    currentPage === page
                      ? "bg-[#F59E0B] text-white font-medium"
                      : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ),
            )}

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 transition-all ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:border-gray-300"
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <BookingDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={selectedBooking}
      />
    </div>
  );
}

function StatCard({
  title,
  value,
  color,
}: {
  title: string;
  value: string;
  color: string;
}) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32">
      <p className="text-gray-500 font-medium text-sm">{title}</p>
      <div className="flex justify-between items-end">
        <h2 className={`text-4xl font-bold ${color}`}>{value}</h2>
        <span className="text-[#22C55E] text-xs font-bold flex items-center gap-0.5 mb-1">
          + 36% <ArrowUpRight className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
}
