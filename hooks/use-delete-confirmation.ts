import { useState } from "react";

/**
 * Custom hook for managing delete confirmation dialog state
 * @param onDelete - Callback function to execute when deletion is confirmed
 * @returns Dialog state and control functions
 */
export function useDeleteConfirmation<T>(
  onDelete: (item: T) => Promise<void>
) {
  const [isOpen, setIsOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<T | null>(null);

  const openDialog = (item: T) => {
    setItemToDelete(item);
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
    setItemToDelete(null);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      await onDelete(itemToDelete);
    } finally {
      closeDialog();
    }
  };

  return {
    isOpen,
    itemToDelete,
    openDialog,
    closeDialog,
    confirmDelete,
  };
}
