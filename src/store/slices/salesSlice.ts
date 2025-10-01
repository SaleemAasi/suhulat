import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getSales, addSale, removeSale } from "@/services/saleService";

export interface Sale {
  _id?: string;
  product: { _id: string; name: string; price: number };
  branch: { _id: string; name: string };
  quantity: number;
  total: number;
  date: string;
}

interface SalesState {
  list: Sale[];
  loading: boolean;
  error: string | null;
}

const initialState: SalesState = { list: [], loading: false, error: null };

export const fetchSales = createAsyncThunk("sales/fetch", async () => {
  return await getSales();
});

export const createSale = createAsyncThunk("sales/create", async (data: any) => {
  return await addSale(data);
});

export const deleteSale = createAsyncThunk("sales/delete", async (id: string) => {
  return await removeSale(id);
});

const salesSlice = createSlice({
  name: "sales",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSales.pending, (state) => { state.loading = true; })
      .addCase(fetchSales.fulfilled, (state, action: PayloadAction<Sale[]>) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchSales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch sales";
      })
      .addCase(createSale.fulfilled, (state, action: PayloadAction<Sale>) => {
        state.list.push(action.payload); // auto update after save
      })
      .addCase(deleteSale.fulfilled, (state, action: PayloadAction<string>) => {
        state.list = state.list.filter((s) => s._id !== action.payload);
      });
  },
});

export default salesSlice.reducer;
