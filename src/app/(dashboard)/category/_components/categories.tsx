/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { deleteCategory, getCategories } from "./api";
import { CategoryModal } from "./category-modal";
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
import { useSession } from "next-auth/react";

export default function Categories() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const { data: session } = useSession();
  const token = session?.accessToken;
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(1, token), // Token pass korchi
    enabled: !!token, // Token thaklei query cholbe
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCategory({ id, token }), // Object akare pass korchi
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deleted successfully");
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    },
    onError: (error: any) => {
      console.error("Delete error:", error);
      toast.error(
        error?.response?.data?.message || "Failed to delete category",
      );
    },
  });

  const handleDeleteClick = (id: string) => {
    setCategoryToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      deleteMutation.mutate(categoryToDelete);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-black uppercase tracking-tight">
          Categories
        </h1>
        <Button
          onClick={() => {
            setSelectedCategory(null);
            setIsModalOpen(true);
          }}
          className="bg-[#F59E0B] hover:bg-[#D97706] text-white px-6 py-6 rounded-lg font-bold"
          disabled={!token} // Token na thakle disable
        >
          <Plus className="w-4 h-4 mr-2" /> Add Categories
        </Button>
      </div>

      {!token && (
        <div className="text-center py-12">
          <p className="text-gray-500">Please login to view categories</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? Array(6)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-[280px] w-full rounded-2xl" />
              ))
          : data?.data?.map((category: any) => (
              <div
                key={category._id}
                className="relative overflow-hidden rounded-2xl border-4 border-transparent hover:border-[#F59E0B] transition-all duration-300 shadow-sm group"
              >
                {/* Image Container */}
                <div className="relative h-[280px] w-full">
                  <Image
                    src={category.image?.url || "/placeholder-image.jpg"}
                    alt={category.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="font-bold text-xl leading-tight">
                        {category.title}
                      </h3>
                      <p className="text-sm font-medium opacity-90 mt-1">
                        {category.itemCount || 0} items available
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        className="bg-white text-black hover:bg-gray-200 h-9 w-9 rounded-full shadow-lg"
                        onClick={() => {
                          setSelectedCategory(category);
                          setIsModalOpen(true);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        className="bg-white text-black hover:bg-red-500 hover:text-white h-9 w-9 rounded-full shadow-lg"
                        onClick={() => handleDeleteClick(category._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              category and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
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

      <CategoryModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        editData={selectedCategory}
      />
    </div>
  );
}
