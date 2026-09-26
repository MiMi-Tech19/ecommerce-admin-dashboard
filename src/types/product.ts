export type ProductStatus = 'active' | 'draft' | 'archived';

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  status: ProductStatus;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}