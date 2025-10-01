// services/saleService.ts
export const getSales = async () => {
  const res = await fetch("/api/sales");
  if (!res.ok) throw new Error("Failed to fetch sales");
  return res.json();
};

export const addSale = async (data: any) => {
  const res = await fetch("/api/sales", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to add sale");
  return res.json();
};

export const removeSale = async (id: string) => {
  const res = await fetch(`/api/sales/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete sale");
  return id;
};
