"use client";

import {
  Box, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
  Card, CardContent, Grid, CircularProgress
} from "@mui/material";
import { Delete, ShoppingCart, AttachMoney, Store, TrendingUp } from "@mui/icons-material";
import { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { fetchProducts } from "@/store/slices/productSlice";
import { fetchBranches } from "@/store/slices/branchSlice";
import { fetchStore } from "@/store/slices/storeSlice";
import { fetchPurchases, createPurchase, deletePurchase } from "@/store/slices/purchaseSlice";

export default function PurchasePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { list: purchases, loading } = useSelector((state: RootState) => state.purchases);
  const { list: products } = useSelector((state: RootState) => state.products);
  const { list: branches } = useSelector((state: RootState) => state.branches);
  const store = useSelector((state: RootState) => state.storeData.store);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ product: "", branch: "", quantity: 1 });

  // Fetch data
  useEffect(() => {
    dispatch(fetchPurchases());
    dispatch(fetchProducts());
    dispatch(fetchStore());
  }, [dispatch]);

  useEffect(() => {
    if (store?._id) dispatch(fetchBranches(store._id));
  }, [dispatch, store?._id]);

  // KPI
  const today = new Date().toDateString();
  const todayPurchases = useMemo(
    () => purchases.filter((p) => new Date(p.date).toDateString() === today),
    [purchases, today]
  );
  const totalAmount = purchases.reduce((acc, p) => acc + p.total, 0);
  const todayAmount = todayPurchases.reduce((acc, p) => acc + p.total, 0);

  // Save purchase
  const handleSave = async () => {
    const productObj = products.find((p) => p._id === form.product);
    if (!productObj) return;

    if (form.quantity > productObj.stock) {
      alert("Insufficient stock!");
      return;
    }

    const total = productObj.price * form.quantity;

    await dispatch(createPurchase({ ...form, total })).unwrap();
    setForm({ product: "", branch: "", quantity: 1 });
    setOpen(false);
  };

  const handleDelete = async (id: string) => {
    await dispatch(deletePurchase(id)).unwrap();
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>;

  return (
    <Box sx={{ p: 3 }}>
      {/* KPI */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "primary.main", color: "white" }}>
            <CardContent>
              <Typography variant="h6">Today's Purchases</Typography>
              <Typography variant="h4" fontWeight="bold">${todayAmount}</Typography>
              <TrendingUp sx={{ fontSize: 30, opacity: 0.8 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "success.main", color: "white" }}>
            <CardContent>
              <Typography variant="h6">Total Purchases</Typography>
              <Typography variant="h4" fontWeight="bold">${totalAmount}</Typography>
              <AttachMoney sx={{ fontSize: 30, opacity: 0.8 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "info.main", color: "white" }}>
            <CardContent>
              <Typography variant="h6">Purchases</Typography>
              <Typography variant="h4" fontWeight="bold">{purchases.length}</Typography>
              <ShoppingCart sx={{ fontSize: 30, opacity: 0.8 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "warning.main", color: "white" }}>
            <CardContent>
              <Typography variant="h6">Branches</Typography>
              <Typography variant="h4" fontWeight="bold">{branches.length}</Typography>
              <Store sx={{ fontSize: 30, opacity: 0.8 }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Header */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h6" fontWeight="bold">Purchases</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>+ Add Purchase</Button>
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
            {purchases.map((p) => (
              <TableRow key={p._id}>
                <TableCell>{p.product?.name}</TableCell>
                <TableCell>{p.branch?.name}</TableCell>
                <TableCell>{p.quantity}</TableCell>
                <TableCell>${p.total}</TableCell>
                <TableCell>{new Date(p.date).toLocaleDateString()}</TableCell>
                <TableCell align="center">
                  <IconButton color="error" size="small" onClick={() => handleDelete(p._id!)}>
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
        <DialogTitle>Add Purchase</DialogTitle>
        <DialogContent dividers>
          <TextField
            select fullWidth margin="dense" label="Product"
            value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })}
          >
            {products.map((p) => (
              <MenuItem key={p._id} value={p._id}>{p.name} (Stock: {p.stock})</MenuItem>
            ))}
          </TextField>
          <TextField
            select fullWidth margin="dense" label="Branch"
            value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })}
          >
            {branches.map((b) => (
              <MenuItem key={b._id} value={b._id}>{b.name}</MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth margin="dense" type="number" label="Quantity"
            value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
