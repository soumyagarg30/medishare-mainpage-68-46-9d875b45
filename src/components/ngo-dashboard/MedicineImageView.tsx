
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface MedicineImageViewProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  medicineName: string | null;
}

const MedicineImageView = ({
  isOpen,
  onClose,
  imageUrl,
  medicineName,
}: MedicineImageViewProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle>{medicineName || "Medicine"} Image</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <div className="flex justify-center p-2">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={medicineName || "Medicine"}
              className="max-h-[70vh] max-w-full object-contain rounded-md"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
                (e.target as HTMLImageElement).alt = "Image not available";
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-64 w-full bg-gray-100 rounded-md">
              <p className="text-gray-500">No image available</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MedicineImageView;
