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
  imageUrl?: string;
  images?: string[];
  branches?: { _id: string; name: string }[];
}

export const productService = {
  async getProducts(): Promise<Product[]> {
    const res = await fetch("/api/products");
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
  },

  async createProduct(data: FormData): Promise<Product> {
    const res = await fetch("/api/products", { method: "POST", body: data });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async updateProduct(id: string, data: FormData): Promise<Product> {
    const res = await fetch(`/api/products/${id}`, { method: "PUT", body: data });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async deleteProduct(id: string): Promise<void> {
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete product");
  },
};
