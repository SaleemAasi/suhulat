// services/productService.ts

export interface Product {
  _id?: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  unit: string;
  description?: string;
  color?: string;
  size?: string;
  status?: string;
  imageUrl?: string;   // single image
  images?: string[];   // multiple images
}

export const productService = {
  // ✅ Get all products
  async getProducts(): Promise<Product[]> {
    const res = await fetch("/api/products");
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
  },

  // ✅ Create product (FormData)
  async createProduct(data: FormData): Promise<Product> {
    const res = await fetch("/api/products", {
      method: "POST",
      body: data,
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error("Failed to create product: " + errText);
    }
    return res.json();
  },

  // ✅ Update product (FormData)
  async updateProduct(id: string, data: FormData): Promise<Product> {
    const res = await fetch(`/api/products/${id}`, {
      method: "PUT",
      body: data,
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error("Failed to update product: " + errText);
    }
    return res.json();
  },

  // ✅ Delete product
  async deleteProduct(id: string): Promise<void> {
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete product");
  },
};
