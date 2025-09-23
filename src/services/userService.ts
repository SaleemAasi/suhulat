export interface User {
  _id?: string; // use _id instead of id for MongoDB
  name: string;
  phone: string;
  email: string;
  password?: string;
  role?: string;
}

export const userService = {
  async createUser(user: User): Promise<User> {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to create user");
    }
    return res.json();
  },

  async getUsers(): Promise<User[]> {
    const res = await fetch("/api/users");
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to fetch users");
    }
    return res.json();
  },

  async deleteUser(id: string): Promise<void> { // ✅ id as string
    const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to delete user");
    }
  },

  async updateUser(id: string, user: Partial<User>): Promise<User> { // ✅ id as string
    const res = await fetch(`/api/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to update user");
    }
    return res.json();
  },
};
