import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { branchService, Branch } from "../../services/branchService";

interface BranchState {
  list: Branch[];
  loading: boolean;
  error: string | null;
}

const initialState: BranchState = {
  list: [],
  loading: false,
  error: null,
};

export const fetchBranches = createAsyncThunk("branches/fetch", async () => {
  return await branchService.getBranches();
});

export const createBranch = createAsyncThunk(
  "branches/create",
  async (branch: Branch) => {
    return await branchService.createBranch(branch);
  }
);

export const updateBranch = createAsyncThunk(
  "branches/update",
  async ({ id, data }: { id: string; data: Partial<Branch> }) => {
    return await branchService.updateBranch(id, data);
  }
);

export const deleteBranch = createAsyncThunk("branches/delete", async (id: string) => {
  await branchService.deleteBranch(id);
  return id;
});

const branchSlice = createSlice({
  name: "branches",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchBranches.fulfilled, (state, action) => {
      state.list = action.payload;
    });

    builder.addCase(createBranch.fulfilled, (state, action) => {
      state.list.push(action.payload);
    });

    builder.addCase(updateBranch.fulfilled, (state, action) => {
      const index = state.list.findIndex((b) => b._id === action.payload._id);
      if (index !== -1) state.list[index] = action.payload;
    });

    builder.addCase(deleteBranch.fulfilled, (state, action) => {
      state.list = state.list.filter((b) => b._id !== action.payload);
    });
  },
});

export default branchSlice.reducer;
