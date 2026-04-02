// Core Product Types
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  categoryId: string;
  image?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

// Cart Types
export interface CartItem extends Product {
  cartItemId: string; // Unique identifier for this specific cart entry
  quantity: number;
  notes?: string;
}

export interface CartConfig {
  taxRate: number;
}
