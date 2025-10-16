import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getSalaries,
  addSalary,
  updateSalary,
  deleteSalary,
} from "@/services/salaryService";

export const fetchSalaries = createAsyncThunk("salaries/fetchAll", async () => {
  return await getSalaries();
});

export const createSalary = createAsyncThunk("salaries/create", async (data: any) => {
  return await addSalary(data);
});

export const editSalary = createAsyncThunk(
  "salaries/edit",
  async ({ id, data }: { id: string; data: any }) => {
    return await updateSalary(id, data);
  }
);

export const removeSalary = createAsyncThunk("salaries/delete", async (id: string) => {
  await deleteSalary(id);
  return id;
});

const salarySlice = createSlice({
  name: "salaries",
  initialState: {
    list: [] as any[],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch salaries
      .addCase(fetchSalaries.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSalaries.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchSalaries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch salaries";
      })

      // Add salary
      .addCase(createSalary.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })

      // Edit salary
      .addCase(editSalary.fulfilled, (state, action) => {
        const index = state.list.findIndex((s) => s._id === action.payload._id);
        if (index !== -1) state.list[index] = action.payload;
      })

      // Delete salary
      .addCase(removeSalary.fulfilled, (state, action) => {
        state.list = state.list.filter((s) => s._id !== action.payload);
      });
  },
});

export default salarySlice.reducer;
