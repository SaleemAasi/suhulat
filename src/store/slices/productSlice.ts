// store/productSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { productService, Product } from "@/services/productService";

interface ProductState {
  list: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  list: [],
  loading: false,
  error: null,
};

// ✅ Fetch all products
export const fetchProducts = createAsyncThunk("products/fetch", async () => {
  return await productService.getProducts();
});

// ✅ Create product (accepts FormData)
export const createProduct = createAsyncThunk(
  "products/create",
  async (data: FormData) => {
    return await productService.createProduct(data);
  }
);

// ✅ Update product (accepts FormData)
export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ id, data }: { id: string; data: FormData }) => {
    return await productService.updateProduct(id, data);
  }
);

// ✅ Delete product
export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id: string) => {
    await productService.deleteProduct(id);
    return id;
  }
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch products
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.list = action.payload;
      state.loading = false;
    });

    // Create product
    builder.addCase(createProduct.fulfilled, (state, action) => {
      state.list.push(action.payload);
      state.loading = false;
    });

    // Update product
    builder.addCase(updateProduct.fulfilled, (state, action) => {
      const index = state.list.findIndex((p) => p._id === action.payload._id);
      if (index !== -1) state.list[index] = action.payload;
      state.loading = false;
    });

    // Delete product
    builder.addCase(deleteProduct.fulfilled, (state, action) => {
      state.list = state.list.filter((p) => p._id !== action.payload);
      state.loading = false;
    });

    // Pending
    builder.addMatcher(
      (action) => action.type.endsWith("/pending"),
      (state) => {
        state.loading = true;
        state.error = null;
      }
    );

    // Rejected
    builder.addMatcher(
      (action) => action.type.endsWith("/rejected"),
      (state, action: any) => {
        state.loading = false;
        state.error = action.error.message;
      }
    );
  },
});

export default productSlice.reducer;
