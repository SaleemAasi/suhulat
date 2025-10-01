"use client";

import {
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/store/slices/productSlice";
import { fetchBranches } from "@/store/slices/branchSlice";
import { Product } from "@/services/productService";
import { fetchStore } from "@/store/slices/storeSlice";


const categories = [
  "Electronics",
  "Smartphones",
  "Computers & Laptops",
  "Audio & Headphones",
  "Watches",
  "Fashion & Clothing",
  "Shoes",
  "Bags & Pouches",
  "Toys & Games",
];
const units = ["cm", "inches", "liters", "kg", "pieces"];
const colors = ["Red", "Blue", "Green", "Yellow", "Black", "White", "Gray", "Custom"];
const sizes = ["XS", "S", "M", "L", "XL", "XXL", "Custom"];
const statusColors: Record<string, "default" | "success" | "warning" | "error" | "info"> = {
  Published: "success",
  Draft: "default",
  "Low Stock": "error",
};

export default function ProductsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { list: products, loading } = useSelector((state: RootState) => state.products);
  const { store } = useSelector((state: RootState) => state.storeData);
  const { list: branches, loading: branchLoading } = useSelector(
    (state: RootState) => state.branches
  );

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Partial<Product> & { images?: File[]; branches?: string[] }>({
    name: "",
    category: "",
    stock: 0,
    price: 0,
    unit: "",
    description: "",
    color: "",
    size: "",
    images: [],
    branches: [],
  });

  // Fetch products
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

useEffect(() => {
  dispatch(fetchStore());
}, [dispatch]);

useEffect(() => {
  if (store?._id) {
   
    dispatch(fetchBranches(store._id));
  }
}, [dispatch, store?._id]);





  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setForm({ ...form, images: Array.from(e.target.files) });
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.category) return;

    const formData = new FormData();
    formData.append("name", form.name!);
    formData.append("category", form.category!);
    formData.append("stock", String(form.stock));
    formData.append("price", String(form.price));
    formData.append("unit", form.unit!);
    formData.append("description", form.description!);
    formData.append("color", form.color!);
    formData.append("size", form.size!);
    form.images?.forEach((file) => formData.append("images", file));

    // Append selected branches
    form.branches?.forEach((branchId) => formData.append("branches", branchId));

    try {
      if (form._id) {
        await dispatch(updateProduct({ id: form._id, data: formData as any })).unwrap();
      } else {
        await dispatch(createProduct(formData as any)).unwrap();
      }
      setOpen(false);
      setForm({ name: "", category: "", stock: 0, price: 0, unit: "", description: "", color: "", size: "", images: [], branches: [] });
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (product: Product) => {
    setForm({ ...product, images: [], branches: product.branches || [] });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    await dispatch(deleteProduct(id)).unwrap();
  };

  if (loading || branchLoading)
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ p: 2 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h6" fontWeight="bold">
          Products
        </Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          + Add Product
        </Button>
      </Box>

      {/* Products Table */}
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Unit Price</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Color</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Branches</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p._id}>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.category}</TableCell>
                <TableCell>{p.stock}</TableCell>
                <TableCell>{p.price}</TableCell>
                <TableCell>{p.unit}</TableCell>
                <TableCell>{p.description}</TableCell>
                <TableCell>{p.color}</TableCell>
                <TableCell>{p.size}</TableCell>
                <TableCell>
                  {p.branches?.map((b: any) => b.name).join(", ") || "-"}
                </TableCell>
                <TableCell>
                  <Chip
                    label={p.status || "Draft"}
                    color={statusColors[p.status || "Draft"]}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton color="primary" size="small" onClick={() => handleEdit(p)}>
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton color="error" size="small" onClick={() => handleDelete(p._id!)}>
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{form._id ? "Edit Product" : "Add Product"}</DialogTitle>
        <DialogContent dividers>
          <TextField fullWidth margin="dense" label="Product Name" name="name" value={form.name} onChange={handleChange} />
          <TextField select fullWidth margin="dense" label="Category" name="category" value={form.category} onChange={handleChange}>
            {categories.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </TextField>
          <TextField fullWidth margin="dense" type="number" label="Stock" name="stock" value={form.stock} onChange={handleChange} />
          <TextField fullWidth margin="dense" type="number" label="Price" name="price" value={form.price} onChange={handleChange} />
          <TextField select fullWidth margin="dense" label="Unit" name="unit" value={form.unit} onChange={handleChange}>
            {units.map((u) => (
              <MenuItem key={u} value={u}>
                {u}
              </MenuItem>
            ))}
          </TextField>
          <TextField fullWidth margin="dense" multiline rows={2} label="Description" name="description" value={form.description} onChange={handleChange} />
          <TextField select fullWidth margin="dense" label="Color" name="color" value={form.color} onChange={handleChange}>
            {colors.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </TextField>
          {form.color === "Custom" && (
            <TextField fullWidth margin="dense" label="Custom Color" name="customColor" value={form.customColor} onChange={handleChange} />
          )}
          <TextField select fullWidth margin="dense" label="Size" name="size" value={form.size} onChange={handleChange}>
            {sizes.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </TextField>
          {form.size === "Custom" && (
            <TextField fullWidth margin="dense" label="Custom Size" name="customSize" value={form.customSize} onChange={handleChange} />
          )}

          {/* Branches Multi-select */}
          <TextField
            select
            fullWidth
            margin="dense"
            label="Branches"
            SelectProps={{
              multiple: true,
              value: form.branches || [],
              onChange: (e) =>
                setForm({ ...form, branches: e.target.value as string[] }),
              renderValue: (selected) =>
                (selected as string[])
                  .map((id) => branches.find((b) => b._id === id)?.name)
                  .join(", "),
            }}
          >
            {branches.map((b) => (
              <MenuItem key={b._id} value={b._id}>
                {b.name}
              </MenuItem>
            ))}
          </TextField>

          {/* Upload Images */}
          <Button variant="outlined" component="label" sx={{ mt: 2 }}>
            Upload Images
            <input type="file" hidden multiple onChange={handleFileChange} />
          </Button>
          {form.images && form.images.length > 0 && (
            <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
              {form.images.map((file, i) => (
                <Typography key={i} variant="caption">
                  {file.name}
                </Typography>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
