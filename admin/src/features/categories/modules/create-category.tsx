import React, { useState, useRef } from "react";
import { Camera, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CategoryFormData {
  name: string;
  file: File | null;
}

interface CategoryFormProps {
  onSubmit: (data: CategoryFormData) => void;
  isPending?: boolean;
  title?: string;
  triggerTitle?: string;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  initalValues?: {
    image: string;
    name: string;
  };
}

export default function CategoryForm({
  onSubmit,
  isPending,
  title,
  triggerTitle,
  open,
  setOpen,
  initalValues,
}: CategoryFormProps) {
  const [categoryName, setCategoryName] = useState<string>(
    initalValues?.name || ""
  );
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initalValues?.image || null
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = (): void => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          setImagePreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (): void => {
    const formData: CategoryFormData = {
      name: categoryName,
      file: selectedImage,
    };

    onSubmit(formData);

    setCategoryName("");
    setSelectedImage(null);
    setImagePreview(null);
    setIsOpen(false);
  };

  const handleCancel = (): void => {
    setCategoryName("");
    setSelectedImage(null);
    setImagePreview(null);
    setIsOpen(false);
  };

  return (
    <div>
      <Dialog open={open || isOpen} onOpenChange={setOpen || setIsOpen}>
        {triggerTitle && (
          <DialogTrigger asChild>
            <Button
              isLoading={isPending}
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {triggerTitle}
            </Button>
          </DialogTrigger>
        )}

        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle>{title || "Create New Category"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Category Name Field */}
            <div className="space-y-2">
              <Label
                htmlFor="categoryName"
                className="text-sm font-medium text-gray-700"
              >
                Category Name
              </Label>
              <Input
                id="categoryName"
                type="text"
                value={categoryName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setCategoryName(e.target.value)
                }
                placeholder="Enter category name"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Category Image
              </Label>

              <div
                onClick={handleImageClick}
                className="w-32 h-32 mx-auto border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors bg-gray-50 hover:bg-gray-100 flex items-center justify-center overflow-hidden"
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Category preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <Camera className="w-8 h-8 mb-2" />
                    <span className="text-xs text-center">Click to upload</span>
                  </div>
                )}
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".png,.jpg,.jpeg,.svg"
                onChange={handleImageChange}
                className="hidden"
              />

              {selectedImage && (
                <p className="text-xs text-gray-500 text-center mt-2">
                  {selectedImage.name}
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                isLoading={isPending}
                onClick={handleSubmit}
                disabled={!categoryName.trim()}
              >
                Continue
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
