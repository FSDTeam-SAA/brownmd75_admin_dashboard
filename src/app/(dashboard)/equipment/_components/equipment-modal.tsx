/* eslint-disable prefer-const */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Upload, Save, X } from "lucide-react";
import Image from "next/image";
import { getCategories } from "../../category/_components/api";
import { createEquipment, updateEquipment } from "./api";

export function EquipmentModal({ open, onOpenChange, editData }: any) {
  const queryClient = useQueryClient();
  const [previews, setPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState<any>({});

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  useEffect(() => {
    if (editData && open) {
      setFormData({
        ...editData,
        category: editData.category?._id,
        status: editData.status || "available",
        // Handle availableDates
        startDate: editData.availableDates?.startDate
          ? new Date(editData.availableDates.startDate)
              .toISOString()
              .split("T")[0]
          : "",
        endDate: editData.availableDates?.endDate
          ? new Date(editData.availableDates.endDate)
              .toISOString()
              .split("T")[0]
          : "",
        availableQuantity: editData.availableDates?.quantity || "",
      });
      // Handle multiple images
      if (editData.images && editData.images.length > 0) {
        setPreviews(editData.images.map((img: any) => img.url));
      }
    } else {
      setFormData({});
      setPreviews([]);
      setFiles([]);
    }
  }, [editData, open]);

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      editData
        ? updateEquipment({ id: editData._id, formData: data })
        : createEquipment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipments"] });
      toast.success(editData ? "Updated successfully" : "Created successfully");
      onOpenChange(false);
    },
    onError: (error: any) => {
      console.error("Mutation error:", error);
      toast.error(error?.message || "Action failed. Please check all fields.");
    },
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      setFiles((prev) => [...prev, ...selectedFiles]);
      const newPreviews = selectedFiles.map((file) =>
        URL.createObjectURL(file),
      );
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onSave = () => {
    // ফর্ম ভ্যালিডেশন
    if (!formData.title) {
      toast.error("Equipment name is required");
      return;
    }
    if (!formData.category) {
      toast.error("Category is required");
      return;
    }
    if (!formData.startDate) {
      toast.error("Start date is required");
      return;
    }
    if (!formData.endDate) {
      toast.error("End date is required");
      return;
    }
    if (!formData.availableQuantity) {
      toast.error("Available quantity is required");
      return;
    }

    const data = new FormData();

    // বেসিক ফিল্ডগুলো যোগ করা
    Object.keys(formData).forEach((key) => {
      if (
        formData[key] !== undefined &&
        formData[key] !== null &&
        formData[key] !== "" &&
        key !== "images" &&
        key !== "category" &&
        key !== "startDate" &&
        key !== "endDate" &&
        key !== "availableQuantity"
      ) {
        data.append(key, formData[key]);
      }
    });

    // ক্যাটাগরি যোগ করা
    if (formData.category) {
      data.append("category", formData.category);
    }

    // ✅ ফিক্স ১: availableDates আলাদা আলাদা ফিল্ড হিসেবে পাঠানো (সহজ সমাধান)
    if (formData.startDate && formData.endDate && formData.availableQuantity) {
      data.append("availableDates[startDate]", formData.startDate);
      data.append("availableDates[endDate]", formData.endDate);
      data.append("availableDates[quantity]", formData.availableQuantity);
    }

    // ✅ ফিক্স ২: অথবা JSON.stringify করে পাঠালে সঠিক ফরম্যাটে
    // if (formData.startDate && formData.endDate && formData.availableQuantity) {
    //   const availableDates = {
    //     startDate: formData.startDate,
    //     endDate: formData.endDate,
    //     quantity: parseInt(formData.availableQuantity, 10),
    //   };
    //   data.append("availableDates", JSON.stringify(availableDates));
    // }

    // ইমেজ যোগ করা
    files.forEach((file) => {
      data.append("images", file);
    });

    // ডিবাগিং এর জন্য কনসোল লগ
    console.log("FormData being sent:");
    for (let pair of data.entries()) {
      console.log(pair[0], pair[1]);
    }

    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl! w-full max-h-[80vh] overflow-y-auto rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-center text-3xl font-bold py-4">
            {editData ? "Edit Equipment" : "Add New Equipment"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5 px-4">
          <div className="space-y-1 lg:col-span-2">
            <label className="text-sm font-bold">Equipment Name *</label>
            <Input
              name="title"
              value={formData.title || ""}
              onChange={handleInputChange}
              placeholder="Scissor Lift"
              required
            />
          </div>

          <div className="space-y-1 lg:col-span-1">
            <label className="text-sm font-bold">Category *</label>
            <Select
              value={formData.category}
              onValueChange={(v) => setFormData({ ...formData, category: v })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.data?.map((cat: any) => (
                  <SelectItem key={cat._id} value={cat._id}>
                    {cat.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-1 md:col-span-2 lg:col-span-3 space-y-1">
            <label className="text-sm font-bold">Description</label>
            <Textarea
              name="description"
              value={formData.description || ""}
              onChange={handleInputChange}
              placeholder="Enter equipment description"
              rows={3}
            />
          </div>

          {/* Available Dates Section */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <h3 className="text-lg font-bold mb-3 text-[#F59E0B]">
              Available Dates
            </h3>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold">Start Date *</label>
            <Input
              name="startDate"
              type="date"
              value={formData.startDate || ""}
              onChange={handleInputChange}
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold">End Date *</label>
            <Input
              name="endDate"
              type="date"
              value={formData.endDate || ""}
              onChange={handleInputChange}
              min={formData.startDate || new Date().toISOString().split("T")[0]}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold">Available Quantity *</label>
            <Input
              name="availableQuantity"
              type="number"
              value={formData.availableQuantity || ""}
              onChange={handleInputChange}
              placeholder="10"
              min="1"
              required
            />
          </div>

          {/* Pricing Section */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 mt-2">
            <h3 className="text-lg font-bold mb-3 text-[#F59E0B]">
              Pricing Information
            </h3>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold">Price per Hour ($)</label>
            <Input
              name="price_per_hour"
              type="number"
              value={formData.price_per_hour || ""}
              onChange={handleInputChange}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold">Price per Day ($)</label>
            <Input
              name="price_per_day"
              type="number"
              value={formData.price_per_day || ""}
              onChange={handleInputChange}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold">Price per Week ($)</label>
            <Input
              name="price_per_week"
              type="number"
              value={formData.price_per_week || ""}
              onChange={handleInputChange}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold">Price per Month ($)</label>
            <Input
              name="price_per_month"
              type="number"
              value={formData.price_per_month || ""}
              onChange={handleInputChange}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold">Delivery Charge ($)</label>
            <Input
              name="deliveryCharge"
              type="number"
              value={formData.deliveryCharge || ""}
              onChange={handleInputChange}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold">Setup Charge ($)</label>
            <Input
              name="setupCharge"
              type="number"
              value={formData.setupCharge || ""}
              onChange={handleInputChange}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>

          {/* Equipment Details Section */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 mt-2">
            <h3 className="text-lg font-bold mb-3 text-[#F59E0B]">
              Equipment Details
            </h3>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold">Status</label>
            <Select
              value={formData.status || "available"}
              onValueChange={(v) => setFormData({ ...formData, status: v })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold">Model Name</label>
            <Input
              name="model"
              value={formData.model || ""}
              onChange={handleInputChange}
              placeholder="Mid51351"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold">Manufacture Year</label>
            <Input
              name="manufacture_year"
              type="number"
              value={formData.manufacture_year || ""}
              onChange={handleInputChange}
              placeholder="2022"
              min="1900"
              max={new Date().getFullYear()}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold">Brand Name</label>
            <Input
              name="brand"
              value={formData.brand || ""}
              onChange={handleInputChange}
              placeholder="Caterpillar"
            />
          </div>

          {/* Image Upload Section */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 mt-4">
            <label className="text-sm font-bold mb-2 block">
              Upload Equipment Images
            </label>
            <div className="border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center bg-gray-50 relative min-h-40">
              {previews.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                  {previews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <Image
                        src={preview}
                        alt={`preview ${index + 1}`}
                        width={150}
                        height={100}
                        className="object-cover rounded-lg w-full h-24"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <Upload className="w-10 h-10 text-gray-400 mb-2" />
              )}
              <label className="mt-2 cursor-pointer text-[#F59E0B] font-bold underline">
                Click to Upload Images
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*"
                  multiple
                />
              </label>
              <p className="text-xs text-gray-500 mt-2">
                You can upload multiple images
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-10 pb-6">
          <Button
            onClick={onSave}
            disabled={mutation.isPending}
            className="bg-[#F59E0B] hover:bg-[#D97706] text-white px-20 py-7 rounded-xl font-bold text-xl shadow-lg transition-all active:scale-95"
          >
            <Save className="w-6 h-6 mr-2" />
            {mutation.isPending
              ? "Processing..."
              : editData
                ? "Update Changes"
                : "Add Equipment Now"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
