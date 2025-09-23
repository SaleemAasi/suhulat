export interface Branch {
  _id?: string;
  name: string;
  manager: string; // manager user ID
  managerName?: string; // optional for display
}

const BASE_URL = "/api/branches";

export const branchService = {
  getBranches: async (): Promise<Branch[]> => {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error("Failed to fetch branches");
    return res.json();
  },

  createBranch: async (branch: Branch): Promise<Branch> => {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(branch),
    });
    if (!res.ok) throw new Error("Failed to create branch");
    return res.json();
  },

  updateBranch: async (id: string, data: Partial<Branch>): Promise<Branch> => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update branch");
    return res.json();
  },

  deleteBranch: async (id: string) => {
    const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete branch");
    return res.json();
  },
};
