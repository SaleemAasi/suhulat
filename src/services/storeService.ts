export async function fetchStoreService() {
  const res = await fetch("/api/stores", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch store");
  return res.json();
}

export async function saveStoreService(data: any) {
  const res = await fetch("/api/stores", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to save store");
  return res.json();
}
