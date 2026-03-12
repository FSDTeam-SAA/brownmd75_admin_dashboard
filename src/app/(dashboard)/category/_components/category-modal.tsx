/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Upload, Pencil, X } from "lucide-react";
import { createCategory, updateCategory, getSingleCategory } from "./api";
import Image from "next/image";
import { useSession } from "next-auth/react";

export function CategoryModal({ open, onOpenChange, editData }: any) {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const token = session?.accessToken;

  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState<any>(null);

  // Fetch single category data when edit mode and open
  useEffect(() => {
    const fetchCategoryData = async () => {
      if (open && editData?._id) {
        setLoading(true);
        try {
          const response = await getSingleCategory(editData._id, token);
          if (response.success && response.data) {
            setCategoryData(response.data);
            setTitle(response.data.title || "");
            // Set preview URL from the fetched image
            if (response.data.image?.url) {
              setPreviewUrl(response.data.image.url);
            }
          }
        } catch (error) {
          console.error("Error fetching category:", error);
          toast.error("Failed to load category data");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCategoryData();
  }, [open, editData?._id, token]);

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setTitle("");
      setFile(null);
      setPreviewUrl(null);
      setCategoryData(null);
    }
  }, [open]);

  // File select korle preview create kora
  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      // Cleanup function
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [file]);

  const handleRemoveImage = () => {
    setFile(null);
    // Edit mode e thakle original image show korbe
    if (categoryData?.image?.url) {
      setPreviewUrl(categoryData.image.url);
    } else {
      setPreviewUrl(null);
    }
  };

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      if (editData) {
        return await updateCategory({
          id: editData._id,
          formData,
          token,
        });
      } else {
        return await createCategory({
          formData,
          token,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success(`Category ${editData ? "updated" : "added"} successfully`);
      onOpenChange(false);
    },
    onError: (error: any) => {
      console.error("Mutation error:", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    },
  });

  const handleSubmit = () => {
    if (!title.trim()) {
      toast.error("Category name is required");
      return;
    }

    if (!editData && !file) {
      toast.error("Category image is required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    if (file) formData.append("image", file);

    mutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            {editData ? "Edit Category" : "Add New Category"}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="py-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F59E0B] mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">
              Loading category data...
            </p>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category Name</label>
              <Input
                placeholder="Enter category name"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category Image</label>

              {/* Image Preview Area */}
              {previewUrl ? (
                <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                  <Image
                    src={previewUrl}
                    alt="Category preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                /* Upload Area (when no image) */
                <div
                  className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
                  onClick={() =>
                    document.getElementById("file-upload")?.click()
                  }
                >
                  <Upload className="w-10 h-10 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    Click to upload image
                  </p>
                  <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                </div>
              )}

              {/* Hidden file input */}
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const selectedFile = e.target.files?.[0];
                  if (selectedFile) {
                    // File size validation (5MB)
                    if (selectedFile.size > 5 * 1024 * 1024) {
                      toast.error("File size must be less than 5MB");
                      return;
                    }
                    setFile(selectedFile);
                  }
                }}
              />

              {/* Change Image Button (when preview exists) */}
              {previewUrl && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() =>
                    document.getElementById("file-upload")?.click()
                  }
                >
                  <Upload className="w-4 h-4 mr-2" /> Change Image
                </Button>
              )}

              {/* Show current image filename in edit mode */}
              {editData && categoryData?.image?.public_id && !file && (
                <p className="text-xs text-gray-500 mt-1">
                  Current image: {categoryData.image.public_id.split("/").pop()}
                </p>
              )}
            </div>

            <Button
              className="w-full bg-[#F59E0B] hover:bg-[#D97706]"
              onClick={handleSubmit}
              disabled={mutation.isPending || !token || loading}
            >
              <Pencil className="w-4 h-4 mr-2" />
              {mutation.isPending
                ? "Processing..."
                : editData
                  ? "Update Now"
                  : "Add Now"}
            </Button>

            {!token && (
              <p className="text-xs text-red-500 text-center">
                Please login to continue
              </p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
