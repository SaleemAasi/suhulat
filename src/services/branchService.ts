import { store } from "@/store";

export interface Branch {
  _id?: string;
  name: string;
  manager: string;
  store?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

// Helper: get token from Redux
const getToken = () => store.getState().auth.user?.token;

export const branchService = {
  async getBranches(storeId: string): Promise<Branch[]> {
    const token = getToken();
    const res = await fetch(`${API_URL}/stores/${storeId}/branches`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) throw new Error((await res.json()).error || "Failed to fetch branches");
    return res.json();
  },

  async createBranch(storeId: string, branch: Branch): Promise<Branch> {
    const token = getToken();
    const res = await fetch(`${API_URL}/stores/${storeId}/branches`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(branch),
    });
    if (!res.ok) throw new Error((await res.json()).error || "Failed to create branch");
    return res.json();
  },

  async updateBranch(storeId: string, id: string, data: Partial<Branch>): Promise<Branch> {
    const token = getToken();
    const res = await fetch(`${API_URL}/stores/${storeId}/branches/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error((await res.json()).error || "Failed to update branch");
    return res.json();
  },

  async deleteBranch(storeId: string, id: string): Promise<{ id: string }> {
    const token = getToken();
    const res = await fetch(`${API_URL}/stores/${storeId}/branches/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error((await res.json()).error || "Failed to delete branch");
    return res.json();
  },
};
