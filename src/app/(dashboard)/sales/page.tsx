"use client";

import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { Delete, TrendingUp, Store, ShoppingCart, AttachMoney } from "@mui/icons-material";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { fetchSales, createSale, deleteSale } from "@/store/slices/salesSlice";
import { fetchProducts } from "@/store/slices/productSlice";
import { fetchBranches } from "@/store/slices/branchSlice";
import { fetchStore } from "@/store/slices/storeSlice";

export default function SalesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { list: sales } = useSelector((state: RootState) => state.sales);
  const { list: products } = useSelector((state: RootState) => state.products);
  const { list: branches } = useSelector((state: RootState) => state.branches);
  const store = useSelector((state: RootState) => state.storeData.store);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ product: "", branch: "", quantity: 1 });

  // Fetch data
  useEffect(() => {
    dispatch(fetchSales());
    dispatch(fetchProducts());
    dispatch(fetchStore());
  }, [dispatch]);

  useEffect(() => {
    if (store?._id) {
      dispatch(fetchBranches(store._id));
    }
  }, [dispatch, store?._id]);

  // 🟢 KPI Calculations
  const today = new Date().toDateString();

  const todaySales = useMemo(
    () =>
      sales.filter((s) => new Date(s.date).toDateString() === today),
    [sales, today]
  );

  const totalSalesAmount = sales.reduce((acc, s) => acc + s.total, 0);
  const todaySalesAmount = todaySales.reduce((acc, s) => acc + s.total, 0);

  // Save Sale
const handleSave = async () => {
  const productObj = products.find((p) => p._id === form.product);
  if (!productObj) return;

  // Check stock
  if (form.quantity > productObj.stock) {
    alert(`Not enough stock! Available: ${productObj.stock}`);
    return;
  }

  const total = productObj.price * form.quantity;

  await dispatch(
    createSale({
      product: form.product,
      branch: form.branch,
      quantity: form.quantity,
      total,
    })
  ).unwrap();

  // Optionally: reduce stock locally in redux (if you want instant update)
  // dispatch(updateProductStock({ id: productObj._id, sold: form.quantity }));

  setForm({ product: "", branch: "", quantity: 1 });
  setOpen(false);
};


  const handleDelete = async (id: string) => {
    await dispatch(deleteSale(id)).unwrap();
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* 🔥 KPI Dashboard Section */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "primary.main", color: "white" }}>
            <CardContent>
              <Typography variant="h6">Today's Sales</Typography>
              <Typography variant="h4" fontWeight="bold">
                ${todaySalesAmount}
              </Typography>
              <TrendingUp sx={{ fontSize: 30, opacity: 0.8 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "success.main", color: "white" }}>
            <CardContent>
              <Typography variant="h6">Total Sales</Typography>
              <Typography variant="h4" fontWeight="bold">
                ${totalSalesAmount}
              </Typography>
              <AttachMoney sx={{ fontSize: 30, opacity: 0.8 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "info.main", color: "white" }}>
            <CardContent>
              <Typography variant="h6">Orders</Typography>
              <Typography variant="h4" fontWeight="bold">
                {sales.length}
              </Typography>
              <ShoppingCart sx={{ fontSize: 30, opacity: 0.8 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "warning.main", color: "white" }}>
            <CardContent>
              <Typography variant="h6">Branches</Typography>
              <Typography variant="h4" fontWeight="bold">
                {branches.length}
              </Typography>
              <Store sx={{ fontSize: 30, opacity: 0.8 }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Header */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h6" fontWeight="bold">
          Sales Records
        </Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          + Add Sale
        </Button>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Branch</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sales.map((s) => (
              <TableRow key={s._id}>
                <TableCell>{s.product?.name}</TableCell>
                <TableCell>{s.branch?.name}</TableCell>
                <TableCell>{s.quantity}</TableCell>
                <TableCell>${s.total}</TableCell>
                <TableCell>{new Date(s.date).toLocaleDateString()}</TableCell>
                <TableCell align="center">
                  <IconButton
                    color="error"
                    size="small"
                    onClick={() => handleDelete(s._id!)}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add Sale</DialogTitle>
        <DialogContent dividers>
          <TextField
            select
            fullWidth
            margin="dense"
            label="Product"
            value={form.product}
            onChange={(e) => setForm({ ...form, product: e.target.value })}
          >
            {products.map((p) => (
              <MenuItem key={p._id} value={p._id}>
                {p.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            fullWidth
            margin="dense"
            label="Branch"
            value={form.branch}
            onChange={(e) => setForm({ ...form, branch: e.target.value })}
          >
            {branches.map((b) => (
              <MenuItem key={b._id} value={b._id}>
                {b.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            margin="dense"
            type="number"
            label="Quantity"
            value={form.quantity}
            onChange={(e) =>
              setForm({ ...form, quantity: Number(e.target.value) })
            }
          />
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
