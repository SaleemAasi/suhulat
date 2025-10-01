export const getPurchases = async () => {
  const res = await fetch("/api/purchases");
  if (!res.ok) throw new Error("Failed to fetch purchases");
  return res.json();
};

export const addPurchase = async (data: any) => {
  const res = await fetch("/api/purchases", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to add purchase");
  return res.json();
};

export const removePurchase = async (id: string) => {
  const res = await fetch(`/api/purchases/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete purchase");
  return res.json();
};
