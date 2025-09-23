export async function fetchStoreService(userId: string) {
  const res = await fetch(`/api/store/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch store");
  return res.json();
}

export async function saveStoreService(userId: string, formData: FormData) {
  const res = await fetch(`/api/store/${userId}`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to save store");
  return res.json();
}
