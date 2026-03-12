/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus, Star } from "lucide-react";
import { toast } from "sonner";
import { deleteEquipment, getEquipments } from "./api";
import { EquipmentModal } from "./equipment-modal";
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

export default function EquipmentManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [equipmentToDelete, setEquipmentToDelete] = useState<string | null>(
    null,
  );

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["equipments"],
    queryFn: () => getEquipments(),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEquipment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipments"] });
      toast.success("Equipment deleted successfully");
      setDeleteDialogOpen(false);
      setEquipmentToDelete(null);
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete equipment",
      );
      setDeleteDialogOpen(false);
    },
  });

  const handleDeleteClick = (id: string) => {
    setEquipmentToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (equipmentToDelete) {
      deleteMutation.mutate(equipmentToDelete);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black uppercase tracking-tight">
          Equipment Management
        </h1>
        <Button
          onClick={() => {
            setSelected(null);
            setIsModalOpen(true);
          }}
          className="bg-[#F59E0B] hover:bg-[#D97706] px-6 py-6 font-bold"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Equipment
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: "Total Equipment", value: data?.meta?.total || 0 },
          { label: "Total Categories", value: "10" },
          { label: "Available Equipment", value: "7", trend: "+ 36% ↑" },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative"
          >
            <p className="text-gray-500 font-semibold">{stat.label}</p>
            <h2 className="text-4xl font-black mt-2">{stat.value}</h2>
            {stat.trend && (
              <span className="absolute bottom-6 right-6 text-green-500 text-sm font-bold">
                {stat.trend}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Equipment Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow className="h-16">
              <TableHead className="font-bold text-black pl-8">
                Equipment Name
              </TableHead>
              <TableHead className="font-bold text-black text-center">
                Category Name
              </TableHead>
              <TableHead className="font-bold text-black text-center">
                Total Order
              </TableHead>
              <TableHead className="font-bold text-black text-center">
                Ratings
              </TableHead>
              <TableHead className="font-bold text-black text-center">
                Manufacture Year
              </TableHead>
              <TableHead className="font-bold text-black text-right pr-8">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              data?.data?.map((item: any) => (
                <TableRow
                  key={item._id}
                  className="h-16 border-b border-gray-50"
                >
                  <TableCell className="pl-8 font-medium text-gray-600">
                    {item.title}
                  </TableCell>
                  <TableCell className="text-center text-gray-500">
                    {item.category?.title}
                  </TableCell>
                  <TableCell className="text-center">5</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1 text-[#F59E0B] font-bold">
                      <Star className="w-4 h-4 fill-current" />{" "}
                      {item.rating || 0}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {item.manufacture_year}
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-[#3B82F6] hover:bg-blue-50"
                        onClick={() => {
                          setSelected(item);
                          setIsModalOpen(true);
                        }}
                      >
                        <Pencil className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-[#EF4444] hover:bg-red-50"
                        onClick={() => handleDeleteClick(item._id)}
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              equipment and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setEquipmentToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-500 hover:bg-red-600"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <EquipmentModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        editData={selected}
      />
    </div>
  );
}
