/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { Eye, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { UserDetailsModal } from "./user-details-modal";

export default function UserManagement() {
  const session = useSession();
  const token = session?.data?.accessToken;

  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // You can change this

  // TanStack Query with Token
  const { data, isLoading } = useQuery({
    queryKey: ["users", token],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/all-users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    },
    enabled: !!token,
  });

  // Get users array from data
  const users = data?.data || [];

  // Calculate pagination values
  const totalItems = users.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Get current page items
  const currentUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return users.slice(startIndex, endIndex);
  }, [users, currentPage, itemsPerPage]);

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
    const maxVisiblePages = 5; // Number of page buttons to show

    if (totalPages <= maxVisiblePages) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show pages with ellipsis
      if (currentPage <= 3) {
        // Near the start
        for (let i = 1; i <= 4; i++) pageNumbers.push(i);
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pageNumbers.push(i);
      } else {
        // Middle
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

  const handleViewDetails = (user: any) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-black uppercase tracking-tight">
          User Management
        </h1>
        <p className="text-gray-500 text-sm">Manage and Monitor Your Users</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden px-4 pb-4">
        <Table>
          <TableHeader>
            <TableRow className="border-none hover:bg-transparent">
              <TableHead className="text-center font-semibold text-gray-700 py-6">
                User Name
              </TableHead>
              <TableHead className="text-center font-semibold text-gray-700">
                Email Name
              </TableHead>
              <TableHead className="text-center font-semibold text-gray-700">
                User Status
              </TableHead>
              <TableHead className="text-center font-semibold text-gray-700">
                Join Date
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
                  colSpan={5}
                  className="text-center py-20 text-gray-400"
                >
                  {token ? "Loading users..." : "Authenticating..."}
                </TableCell>
              </TableRow>
            ) : currentUsers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-20 text-gray-400"
                >
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              currentUsers.map((user: any, index: number) => (
                <TableRow
                  key={user._id}
                  className={`${(index + (currentPage - 1) * itemsPerPage) % 2 === 0 ? "bg-[#F9FAFB]" : "bg-white"} border-none hover:bg-gray-100 transition-colors`}
                >
                  <TableCell className="text-center py-4 text-gray-600">
                    {user.firstName} {user.lastName}
                  </TableCell>
                  <TableCell className="text-center text-gray-600">
                    {user.email}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="bg-[#DCFCE7] text-[#22C55E] px-4 py-1 rounded-md text-xs font-medium">
                      Active
                    </span>
                  </TableCell>
                  <TableCell className="text-center text-gray-500">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleViewDetails(user)}
                        className="p-1.5 border border-[#22C55E] rounded-full text-[#22C55E] hover:bg-[#22C55E] hover:text-white transition-all"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 border border-[#EF4444] rounded-full text-[#EF4444] hover:bg-[#EF4444] hover:text-white transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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

      <UserDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
      />
    </div>
  );
}
