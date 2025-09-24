import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchStoreService, saveStoreService } from "@/services/storeService";

export interface StoreState {
  store: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: StoreState = {
  store: null,
  loading: false,
  error: null,
};

export const fetchStore = createAsyncThunk<any>("store/fetchStore", async (_, thunkAPI) => {
  try {
    return await fetchStoreService();
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const saveStore = createAsyncThunk<any, any>(
  "store/saveStore",
  async (formData, thunkAPI) => {
    try {
      return await saveStoreService(formData);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const storeSlice = createSlice({
  name: "storeData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStore.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchStore.fulfilled, (state, action: PayloadAction<any>) => { state.loading = false; state.store = action.payload; })
      .addCase(fetchStore.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(saveStore.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(saveStore.fulfilled, (state, action: PayloadAction<any>) => { state.loading = false; state.store = action.payload; })
      .addCase(saveStore.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });
  },
});

export default storeSlice.reducer;
