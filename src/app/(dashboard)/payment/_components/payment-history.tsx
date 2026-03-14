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
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { PaymentDetailsModal } from "./payment-details-modal";

export default function PaymentHistory() {
  const session = useSession();
  const token = session?.data?.accessToken;
  const queryClient = useQueryClient();

  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // States for Delete Pop-up
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["payment-history", token],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/payment/history`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return res.data;
    },
    enabled: !!token,
  });

  const payments = data?.data?.payments || [];
  const totalRevenue = data?.data?.totalRevenue || "0.00";
  const totalItems = payments.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const currentPayments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return payments.slice(startIndex, startIndex + itemsPerPage);
  }, [payments, currentPage, itemsPerPage]);

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (orderId: string) => {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/payment/history/${orderId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-history"] });
      toast.success("Record deleted successfully");
      setIsDeleteDialogOpen(false);
      setPaymentToDelete(null);
      if (currentPayments.length === 1 && currentPage > 1)
        setCurrentPage(currentPage - 1);
    },
    onError: () => {
      toast.error("Failed to delete record");
      setIsDeleteDialogOpen(false);
    },
  });

  const handleDeleteClick = (id: string) => {
    setPaymentToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (paymentToDelete) deleteMutation.mutate(paymentToDelete);
  };

  // Pagination Logic
  const getPageNumbers = () => {
    const pageNumbers = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      pageNumbers.push(1, 2, 3, "...", totalPages);
    }
    return pageNumbers;
  };

  return (
    <div className="min-h-screen">
      <h1 className="text-3xl font-black uppercase tracking-tight mb-6">
        Payment History
      </h1>

      {/* Revenue Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 w-full max-w-sm mb-8">
        <p className="text-gray-500 font-medium text-sm">Total Revenue</p>
        <div className="flex justify-between items-end mt-2">
          <h2 className="text-4xl font-bold">${totalRevenue}</h2>
          <span className="text-[#22C55E] text-xs font-bold flex items-center gap-0.5 mb-1">
            + 36% <ArrowUpRight className="w-3 h-3" />
          </span>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden px-4 pb-4">
        <Table>
          <TableHeader>
            <TableRow className="border-none hover:bg-transparent">
              <TableHead className="text-center font-semibold text-gray-700 py-6">
                User Name
              </TableHead>
              <TableHead className="text-center font-semibold text-gray-700">
                Equipment
              </TableHead>
              <TableHead className="text-center font-semibold text-gray-700">
                Price
              </TableHead>
              <TableHead className="text-center font-semibold text-gray-700">
                Payment
              </TableHead>
              <TableHead className="text-center font-semibold text-gray-700">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-20">
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              currentPayments.map((item: any, index: number) => (
                <TableRow
                  key={item._id}
                  className={`${index % 2 === 0 ? "bg-[#F9FAFB]" : "bg-white"} border-none`}
                >
                  <TableCell className="text-center py-4 font-medium">
                    {item.shippingAddress?.fullName?.split(" ")[0]}
                  </TableCell>
                  <TableCell className="text-center text-gray-500">
                    {item.items[0]?.title}
                  </TableCell>
                  <TableCell className="text-center font-semibold">
                    ${item.totalAmount}.00
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`px-4 py-1 rounded-md text-xs font-medium uppercase ${item.paymentMethod === "cod" ? "bg-[#FEF9C3] text-[#F59E0B]" : "bg-[#DCFCE7] text-[#22C55E]"}`}
                    >
                      {item.paymentMethod === "cod" ? "COD" : "Paid"}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => {
                          setSelectedPayment(item);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 border border-[#22C55E] rounded-full text-[#22C55E] hover:bg-[#22C55E] hover:text-white transition-all"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(item._id)}
                        className="p-1.5 border border-[#EF4444] rounded-full text-[#EF4444] hover:bg-[#EF4444] hover:text-white transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination UI */}
        <div className="flex justify-center items-center gap-2 mt-8 pb-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-full border border-gray-200 text-gray-400 disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {getPageNumbers().map((page, i) => (
            <button
              key={i}
              onClick={() => typeof page === "number" && setCurrentPage(page)}
              className={`w-8 h-8 rounded-full text-sm ${currentPage === page ? "bg-[#F59E0B] text-white" : "border border-gray-200"}`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="p-2 rounded-full border border-gray-200 text-gray-400 disabled:opacity-50"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Delete Confirmation Pop-up */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              payment record from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl border-gray-200">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-500 hover:bg-red-600 rounded-xl text-white"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Record"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <PaymentDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={selectedPayment}
      />
    </div>
  );
}
