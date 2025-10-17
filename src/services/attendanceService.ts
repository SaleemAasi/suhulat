const API_URL = "/api/attendance";

// ✅ Fetch all attendance
export async function getAttendance() {
  const res = await fetch(API_URL, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch attendance");
  return res.json();
}

// ✅ Mark employee attendance
export async function markAttendance(employeeId: string, status: string) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ employeeId, status }),
  });
  if (!res.ok) throw new Error("Failed to mark attendance");
  return res.json();
}

// ✅ Get single employee attendance history
export async function getEmployeeHistory(employeeId: string) {
  const res = await fetch(`${API_URL}/${employeeId}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch employee history");
  return res.json();
}
