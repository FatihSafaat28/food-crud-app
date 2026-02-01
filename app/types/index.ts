// Centralized type definitions for the application

export interface Category {
  id: number;
  name: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    menus: number;
  };
}

export interface Menu {
  id: number;
  name: string;
  price: number;
  description: string | null;
  imageUrl: string;
  ingredients: string[];
  categoryId: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  category?: Category;
}

export interface MenuFormData {
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  categoryId: number;
  ingredients: string[];
}

export interface CategoryFormData {
  name: string;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// Hook return types
export interface UseMenusReturn {
  menus: Menu[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseCategoriesReturn {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseMenuDetailReturn {
  menu: Menu | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseDeleteConfirmationReturn {
  isOpen: boolean;
  itemToDelete: any | null;
  openDialog: (item: any) => void;
  closeDialog: () => void;
  confirmDelete: () => Promise<void>;
}
