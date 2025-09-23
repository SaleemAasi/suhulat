
export interface LoginResponse {
  token: string;
}

export interface LoginRequest {
  email: string; 
  password: string 
}

export async function loginUser(credentials : LoginRequest) {
  const res = await fetch(`/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Login failed");
  }

  return res.json(); 
}

