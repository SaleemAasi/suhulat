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
  TextField,
  Autocomplete,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { fetchProducts } from "@/store/slices/productSlice";
import { fetchBranches } from "@/store/slices/branchSlice";
import { createSale } from "@/store/slices/salesSlice";

interface SaleItem {
  productId: string;
  name: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
  total: number;
}

export default function CashierSalesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { list: products } = useSelector((state: RootState) => state.products);
  const { list: branches } = useSelector((state: RootState) => state.branches);

  const [searchText, setSearchText] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState<"percent" | "amount">("percent");
  const [selectedBranchId, setSelectedBranchId] = useState(""); // selected branch ID
  const taxPercent = 5;

  const invoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchBranches());
  }, [dispatch]);

  // Set default branch ID when branches are loaded
  useEffect(() => {
    if (branches.length > 0 && !selectedBranchId) {
      setSelectedBranchId(branches[0]._id);
    }
  }, [branches, selectedBranchId]);

  const handleAddProduct = () => {
    if (!selectedProduct) return;

    if (quantity <= 0) {
      alert("Quantity must be at least 1!");
      return;
    }

    if (quantity > selectedProduct.stock) {
      alert(`Not enough stock! Available: ${selectedProduct.stock}`);
      return;
    }

    const item: SaleItem = {
      productId: selectedProduct._id,
      name: selectedProduct.name,
      color: selectedProduct.color,
      size: selectedProduct.size,
      price: selectedProduct.price,
      quantity,
      total: selectedProduct.price * quantity,
    };

    setSaleItems([...saleItems, item]);
    setSelectedProduct(null);
    setQuantity(1);
    setSearchText("");
  };

  const handleRemoveItem = (index: number) => {
    const updated = [...saleItems];
    updated.splice(index, 1);
    setSaleItems(updated);
  };

  // Calculations
  const subtotal = saleItems.reduce((acc, item) => acc + item.total, 0);
  const discountAmount = discountType === "percent" ? (subtotal * discount) / 100 : discount;
  const taxAmount = ((subtotal - discountAmount) * taxPercent) / 100;
  const totalAmount = subtotal - discountAmount + taxAmount;

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSaveInvoice = async () => {
    if (!selectedBranchId) return alert("Please select a branch!");
    if (saleItems.length === 0) return alert("No items to save!");

    const saleData = {
      items: saleItems.map((item) => ({
        product: item.productId,
        quantity: item.quantity,
        price: item.price,
        total: item.total,
      })),
      branch: selectedBranchId,
      subtotal,
      discount,
      discountType,
      tax: taxAmount,
      total: totalAmount,
      date: new Date(),
    };

    try {
      await dispatch(createSale(saleData)).unwrap();
      alert("Invoice saved successfully!");
      // Reset for new customer
      setSaleItems([]);
      setDiscount(0);
      setDiscountType("percent");
    } catch (error) {
      console.error(error);
      alert("Failed to save invoice!");
    }
  };

  const handlePrintInvoice = () => {
    if (!invoiceRef.current) return;
    const printContent = invoiceRef.current.innerHTML;
    const newWindow = window.open("", "_blank");
    if (!newWindow) return;

    newWindow.document.write(`
      <html>
        <head>
          <title>Invoice</title>
          <style>
            body { font-family: monospace; font-size: 12px; width: 300px; padding: 10px; }
            .invoice-box { width: 100%; padding: 10px; }
            h2 { text-align: center; font-size: 14px; margin-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; }
            td { padding: 2px 0; }
            .totals { margin-top: 10px; }
            .totals p { margin: 2px 0; font-size: 12px; }
            hr { border: 0; border-top: 1px dashed #000; margin: 5px 0; }
          </style>
        </head>
        <body>
          <div class="invoice-box">
            ${printContent}
          </div>
          <script>
            window.print();
            window.onafterprint = function() { window.close(); }
          </script>
        </body>
      </html>
    `);
  };

  // Get selected branch name for display
  const selectedBranch = branches.find((b) => b._id === selectedBranchId);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        New Sale
      </Typography>

      {/* Product search */}
      <Box display="flex" gap={2} mb={2}>
        <Autocomplete
          fullWidth
          options={filteredProducts}
          getOptionLabel={(option) =>
            `${option.name} | Color: ${option.color} | Size: ${option.size} | Price: ${option.price} | Stock: ${option.stock}`
          }
          inputValue={searchText}
          onInputChange={(e, value) => setSearchText(value)}
          value={selectedProduct}
          onChange={(e, value) => setSelectedProduct(value)}
          renderInput={(params) => <TextField {...params} label="Search Product" />}
        />
        <TextField
          type="number"
          label="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          sx={{ width: 100 }}
        />
        <Button variant="contained" onClick={handleAddProduct}>
          Add
        </Button>
      </Box>

      {/* Sale items table */}
      {saleItems.length > 0 && (
        <Box>
          <TableContainer component={Paper} sx={{ maxHeight: 300, mb: 2 }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Color</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Qty</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {saleItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.color}</TableCell>
                    <TableCell>{item.size}</TableCell>
                    <TableCell>${item.price}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>${item.total}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleRemoveItem(index)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Discount input */}
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <TextField
              type="number"
              label={`Discount (${discountType === "percent" ? "%" : "$"})`}
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              sx={{ width: 150 }}
            />
            <TextField
              select
              label="Type"
              value={discountType}
              onChange={(e) =>
                setDiscountType(e.target.value as "percent" | "amount")
              }
              sx={{ width: 120 }}
              SelectProps={{ native: true }}
            >
              <option value="percent">Percent</option>
              <option value="amount">Amount</option>
            </TextField>
          </Box>

          {/* Invoice preview */}
          <Box ref={invoiceRef} sx={{ p: 2, border: "1px dashed #ddd", mb: 2 }}>
            <h2>My Store</h2>
            <Typography>
              Branch: {selectedBranch ? selectedBranch.name : "Unknown"}
            </Typography>
            <Typography>Date: {new Date().toLocaleString()}</Typography>
            <hr />
            <Table size="small">
              <TableBody>
                {saleItems.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.quantity} x ${item.price}</TableCell>
                    <TableCell align="right">${item.total}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <hr />
            <Box className="totals">
              <Typography>Subtotal: ${subtotal.toFixed(2)}</Typography>
              <Typography>Discount: ${discountAmount.toFixed(2)}</Typography>
              <Typography>Tax ({taxPercent}%): ${taxAmount.toFixed(2)}</Typography>
              <Typography fontWeight="bold">Total: ${totalAmount.toFixed(2)}</Typography>
            </Box>
            <Typography style={{ textAlign: "center", marginTop: 10 }}>
              Thank you for shopping!
            </Typography>
          </Box>

          <Box display="flex" gap={2}>
            <Button variant="contained" color="success" onClick={handlePrintInvoice}>
              Print Invoice
            </Button>
            <Button variant="contained" color="primary" onClick={handleSaveInvoice}>
              Save & Reset
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}


