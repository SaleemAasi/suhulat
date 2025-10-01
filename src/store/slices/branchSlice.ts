import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/store";

export const fetchBranches = createAsyncThunk(
  "branches/fetchBranches",
  async (storeId: string, thunkAPI) => {
    try {
      const res = await fetch(`/api/stores/${storeId}/branches`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res.ok) throw new Error(await res.text());
      return await res.json();
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const createBranch = createAsyncThunk(
  "branches/createBranch",
  async ({ storeId, name, manager }: { storeId: string; name: string; manager: string }, thunkAPI) => {
    try {
      const res = await fetch(`/api/stores/${storeId}/branches`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name, manager }),
      });
      if (!res.ok) throw new Error(await res.text());
      return await res.json();
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const updateBranch = createAsyncThunk(
  "branches/updateBranch",
  async ({ storeId, id, data }: { storeId: string; id: string; data: { name: string; manager: string } }, thunkAPI) => {
    try {
      const res = await fetch(`/api/stores/${storeId}/branches/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(await res.text());
      return await res.json();
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const deleteBranch = createAsyncThunk(
  "branches/deleteBranch",
  async ({ storeId, id }: { storeId: string; id: string }, thunkAPI) => {
    try {
      const res = await fetch(`/api/stores/${storeId}/branches/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res.ok) throw new Error(await res.text());
      return id;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const branchSlice = createSlice({
  name: "branches",
  initialState: { list: [] as any[], loading: false, error: null as any },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBranches.pending, (state) => { state.loading = true; })
      .addCase(fetchBranches.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchBranches.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createBranch.fulfilled, (state, action) => { state.list.push(action.payload); })
      .addCase(updateBranch.fulfilled, (state, action) => { state.list = state.list.map(b => b._id === action.payload._id ? action.payload : b); })
      .addCase(deleteBranch.fulfilled, (state, action) => { state.list = state.list.filter(b => b._id !== action.payload); });
  },
});

export default branchSlice.reducer;

