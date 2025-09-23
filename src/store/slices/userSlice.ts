// store/slices/userSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { userService, User } from "../../services/userService";

// Define the slice state type
interface UserState {
  list: User[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: UserState = {
  list: [],
  loading: false,
  error: null,
};

// Async Thunks
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  return await userService.getUsers();
});

export const createUser = createAsyncThunk(
  "users/createUser",
  async (user: User) => {
    return await userService.createUser(user);
  }
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, data }: { id: string; data: Partial<User> }) => { // ✅ id as string
    return await userService.updateUser(id, data);
  }
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id: string) => { // ✅ id as string
    await userService.deleteUser(id);
    return id;
  }
);

// Slice
const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // fetchUsers
    builder.addCase(fetchUsers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action.payload;
    });
    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch users";
    });

    // createUser
    builder.addCase(createUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createUser.fulfilled, (state, action) => {
      state.loading = false;
      state.list.push(action.payload);
    });
    builder.addCase(createUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to create user";
    });

    // updateUser
    builder.addCase(updateUser.fulfilled, (state, action) => {
      const index = state.list.findIndex((u) => u._id === action.payload._id); // ✅ use _id
      if (index !== -1) state.list[index] = action.payload;
    });

    // deleteUser
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.list = state.list.filter((u) => u._id !== action.payload); // ✅ use _id
    });
  },
});

export default userSlice.reducer;
