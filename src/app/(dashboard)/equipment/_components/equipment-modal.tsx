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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Upload, Save } from "lucide-react";
import Image from "next/image";
import { getCategories } from "../../category/_components/api";
import { createEquipment, updateEquipment } from "./api";

export function EquipmentModal({ open, onOpenChange, editData }: any) {
  const queryClient = useQueryClient();
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<any>({});

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  useEffect(() => {
    if (editData && open) {
      setFormData({ ...editData, category: editData.category?._id });
      setPreview(editData.image?.url);
    } else {
      setFormData({});
      setPreview(null);
      setFile(null);
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
    onError: () => toast.error("Action failed. Please check all fields."),
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const onSave = () => {
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (
        formData[key] !== undefined &&
        key !== "image" &&
        key !== "category"
      ) {
        data.append(key, formData[key]);
      }
    });

    if (formData.category) data.append("category", formData.category);
    if (file) data.append("image", file);

    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Updated to max-w-5xl for large screens */}
      <DialogContent className="max-w-5xl! w-full max-h-[80vh] overflow-y-auto rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-center text-3xl font-bold py-4">
            {editData ? "Edit Equipment" : "Add New Equipment"}
          </DialogTitle>
        </DialogHeader>

        {/* Increased to 3 columns on large screens for better space utilization */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5 px-4">
          <div className="space-y-1 lg:col-span-2">
            <label className="text-sm font-bold">Equipment Name</label>
            <Input
              name="title"
              value={formData.title || ""}
              onChange={handleInputChange}
              placeholder="Scissor Lift"
            />
          </div>
          <div className="space-y-1 lg:col-span-1">
            <label className="text-sm font-bold">Category</label>
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

          <div className="space-y-1">
            <label className="text-sm font-bold">Price per Hour ($)</label>
            <Input
              name="price_per_hour"
              type="number"
              value={formData.price_per_hour || ""}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-bold">Price per Day ($)</label>
            <Input
              name="price_per_day"
              type="number"
              value={formData.price_per_day || ""}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-bold">Price per Week ($)</label>
            <Input
              name="price_per_week"
              type="number"
              value={formData.price_per_week || ""}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-bold">Price per Month ($)</label>
            <Input
              name="price_per_month"
              type="number"
              value={formData.price_per_month || ""}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold">Total Taxes ($)</label>
            <Input
              name="total_taxes"
              type="number"
              value={formData.total_taxes || ""}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-bold">Delivery Charge</label>
            <Input
              name="deliveryCharge"
              value={formData.deliveryCharge || ""}
              onChange={handleInputChange}
              placeholder="e.g. $50"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-bold">Setup Charge</label>
            <Input
              name="setupCharge"
              value={formData.setupCharge || ""}
              onChange={handleInputChange}
              placeholder="e.g. $20"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold">Maximum Reach</label>
            <Input
              name="maximum_reach"
              value={formData.maximum_reach || ""}
              onChange={handleInputChange}
              placeholder="e.g. 7 Meter"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-bold">Operating Weight</label>
            <Input
              name="operating_weight"
              value={formData.operating_weight || ""}
              onChange={handleInputChange}
              placeholder="e.g. 4lt/Minute"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-bold">Rated Power</label>
            <Input
              name="rated_power"
              value={formData.rated_power || ""}
              onChange={handleInputChange}
              placeholder="e.g. 4kw/Hour"
            />
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

          <div className="col-span-1 md:col-span-2 lg:col-span-3 mt-4">
            <label className="text-sm font-bold mb-2 block">
              Upload Equipment Image
            </label>
            <div className="border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center bg-gray-50 relative min-h-40">
              {preview ? (
                <div className="relative w-full h-32 flex justify-center">
                  <Image
                    src={preview}
                    alt="preview"
                    width={200}
                    height={120}
                    className="object-contain rounded-lg"
                  />
                </div>
              ) : (
                <Upload className="w-10 h-10 text-gray-400 mb-2" />
              )}
              <label className="mt-2 cursor-pointer text-[#F59E0B] font-bold underline">
                Click to Upload
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </label>
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
