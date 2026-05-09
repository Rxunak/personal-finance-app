"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";

type DeleteConfirmationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemName: string;
  itemType?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
};

export function DeleteConfirmationDialog({
  open,
  onOpenChange,
  itemName,
  itemType = "item",
  description,
  confirmLabel = "Yes, Confirm Deletion",
  cancelLabel = "No, Go Back",
  onConfirm,
}: DeleteConfirmationDialogProps) {
  const resolvedDescription =
    description ??
    `Are you sure you want to delete this ${itemType}? This action cannot be reversed, and all the data inside it will be removed forever.`;

  const handleConfirm = () => {
    onConfirm?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-[calc(100%-2rem)] rounded-2xl border-none bg-white p-9 shadow-none sm:max-w-160">
        <DialogHeader className="gap-4 text-left">
          <DialogTitle className="pr-12 text-3xl font-bold text-neutral-900">
            Delete '{itemName}'?
          </DialogTitle>
          <DialogDescription className="text-md text-grey-500">
            {resolvedDescription}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-5">
          <Button
            type="button"
            className="h-14 w-full cursor-pointer rounded-xl bg-red text-md font-bold text-white hover:bg-[#b63f31]"
            onClick={handleConfirm}
          >
            {confirmLabel}
          </Button>
          <DialogClose asChild>
            <button
              type="button"
              className="cursor-pointer text-md text-grey-500 transition-colors hover:text-neutral-900"
            >
              {cancelLabel}
            </button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
