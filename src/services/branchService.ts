export interface Branch {
  _id: string;
  name: string;
  manager: any;
  storeId: string;
}

const API_BASE = "/api/store"; // ✅ because branches are inside store

// ✅ Fetch branches
export const getBranches = async (storeId: string) => {
  const res = await fetch(`${API_BASE}/${storeId}/branch`);
  if (!res.ok) throw new Error("Failed to fetch branches");
  return res.json();
};

// ✅ Create branch
export const createBranchService = async (storeId: string, data: any) => {
  const res = await fetch(`${API_BASE}/${storeId}/branch`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create branch");
  return res.json();
};

// ✅ Update branch
export const updateBranchService = async (storeId: string, id: string, data: any) => {
  const res = await fetch(`${API_BASE}/${storeId}/branch/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update branch");
  return res.json();
};

// ✅ Delete branch
export const deleteBranchService = async (storeId: string, id: string) => {
  const res = await fetch(`${API_BASE}/${storeId}/branch/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete branch");
  return res.json();
};
