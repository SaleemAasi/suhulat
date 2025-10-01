import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getPurchases, addPurchase, removePurchase } from "@/services/purchaseService";

export interface Purchase {
  _id?: string;
  product: { _id: string; name: string; price: number };
  branch: { _id: string; name: string };
  quantity: number;
  total: number;
  date: string;
}

interface PurchaseState {
  list: Purchase[];
  loading: boolean;
  error: string | null;
}

const initialState: PurchaseState = {
  list: [],
  loading: false,
  error: null,
};

export const fetchPurchases = createAsyncThunk("purchases/fetch", async () => {
  return await getPurchases();
});

export const createPurchase = createAsyncThunk("purchases/create", async (data: any) => {
  return await addPurchase(data);
});

export const deletePurchase = createAsyncThunk("purchases/delete", async (id: string) => {
  await removePurchase(id);
  return id;
});

const purchaseSlice = createSlice({
  name: "purchases",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPurchases.pending, (state) => { state.loading = true; })
      .addCase(fetchPurchases.fulfilled, (state, action: PayloadAction<Purchase[]>) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchPurchases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch purchases";
      })
      .addCase(createPurchase.fulfilled, (state, action: PayloadAction<Purchase>) => {
        state.list.push(action.payload);
      })
      .addCase(deletePurchase.fulfilled, (state, action: PayloadAction<string>) => {
        state.list = state.list.filter(p => p._id !== action.payload);
      });
  },
});

export default purchaseSlice.reducer;
