"use client";

import Image from "next/image";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Checkbox,
  Box,
  Link,
} from "@mui/material";
import { Add, Remove, CalendarMonth } from "@mui/icons-material";

export default function GenerateInvoicePage() {
  return (
    <div
      style={{
        backgroundColor: "#f9fafb",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
      }}
    >
      {/* Header */}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        {/* Logo */}
        <Box display="flex" alignItems="center">
          <Image src="/logo.svg" alt="Company Logo" width={300} height={60} />
        </Box>

        {/* Invoice Info */}
        <Grid container spacing={1} style={{ width: "auto" }}>
          <Grid item>
            <Typography variant="caption" color="textSecondary">
              Invoice number
            </Typography>
            <Typography variant="body1" fontWeight="600">
              88462137
            </Typography>
            <Typography
              variant="caption"
              color="textSecondary"
              style={{ marginTop: "0.25rem", display: "block" }}
            >
              Issued
            </Typography>
            <Typography variant="body1" fontWeight="600">
              Dec 26, 2024
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="caption" color="textSecondary">
              ePayment number
            </Typography>
            <Typography variant="body1" fontWeight="600">
              88462137
            </Typography>
            <Typography
              variant="caption"
              color="textSecondary"
              style={{ marginTop: "0.25rem", display: "block" }}
            >
              Purchase Order Ref
            </Typography>
            <Typography variant="body1" fontWeight="600">
              7467
            </Typography>
          </Grid>
        </Grid>
      </div>

      {/* Main Card */}
      <Card style={{ width: "100%" }}>
        <CardContent style={{ padding: "1rem" }}>
          {/* Bill Sections */}
          <Grid container spacing={2} marginBottom={2}>
            {/* Bill To */}
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  border: "2px solid #e5e7eb",
                  borderRadius: "12px",
                  padding: "1rem",
                  height: "100%",
                }}
              >
                <Box display="flex" alignItems="center" gap={1} marginBottom={1}>
                  <Checkbox size="small" defaultChecked />
                  <Typography color="primary" fontWeight="bold" variant="body1">
                    BILL TO:
                  </Typography>
                </Box>
                <Typography fontWeight="600" variant="body1">
                  Mauro Sicard
                </Typography>
                <Typography variant="body2">(612) 856 - 0989</Typography>
                <Typography variant="body2">contact@maurosicard.com</Typography>
                <Typography variant="body2" display="block">
                  Pablo Alto, San Francisco, CA 92102, United States of America
                </Typography>
                <Button variant="text" size="small">
                  Edit Client
                </Button>
              </Box>
            </Grid>

            {/* Bill From */}
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  border: "2px solid #e5e7eb",
                  borderRadius: "12px",
                  padding: "1rem",
                  height: "100%",
                }}
              >
                <Box display="flex" alignItems="center" gap={1} marginBottom={1}>
                  <Checkbox size="small" defaultChecked />
                  <Typography color="primary" fontWeight="bold" variant="body1">
                    BILL FROM:
                  </Typography>
                </Box>
                <Typography fontWeight="600" variant="body1">
                  BRIX Agency
                </Typography>
                <Typography variant="body2">(684) 879 - 0102</Typography>
                <Typography variant="body2" display="block">
                  Pablo Alto, San Francisco, CA 94109, United States of America
                </Typography>
                <Typography variant="body2">12345 6789 US0001</Typography>
                <Button variant="text" size="small">
                  Edit Business Information
                </Button>
              </Box>
            </Grid>

            {/* Amount Due */}
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  borderRadius: "12px",
                  padding: "1rem",
                  height: "100%",
                  textAlign: "center",
                  backgroundColor: "primary.main",
                  color: "white",
                }}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  gap={1}
                  justifyContent="center"
                  marginBottom={1}
                >
                  <Checkbox size="small" defaultChecked sx={{ color: "white" }} />
                  <Typography fontWeight="bold" variant="body1">
                    AMOUNT DUE
                  </Typography>
                </Box>
                <Typography variant="h6" fontWeight="bold">
                  SAR 19,570.00
                </Typography>
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  gap={1}
                  mt={1}
                >
                  <Typography variant="body2">No:</Typography>
                  <TextField
                    size="small"
                    defaultValue="000027"
                    sx={{
                      background: "white",
                      borderRadius: "6px",
                      width: "80px",
                      input: {
                        textAlign: "center",
                        fontSize: "0.9rem",
                        padding: "6px",
                      },
                    }}
                  />
                  <CalendarMonth fontSize="small" />
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* Items Table */}
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell align="center">Qty</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Service name 1</TableCell>
                <TableCell align="center">
                  <Box display="flex" alignItems="center" justifyContent="center">
                    <IconButton size="small">
                      <Remove fontSize="small" />
                    </IconButton>
                    <TextField size="small" defaultValue={1} style={{ width: "40px" }} />
                    <IconButton size="small">
                      <Add fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell align="right">SAR 5,250.00</TableCell>
                <TableCell align="right">
                  <Typography fontWeight="600" variant="body2">
                    SAR 5,250.00
                  </Typography>
                  <Typography variant="caption" color="green">
                    10% Discount
                  </Typography>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Service name 2</TableCell>
                <TableCell align="center">
                  <Box display="flex" alignItems="center" justifyContent="center">
                    <IconButton size="small">
                      <Remove fontSize="small" />
                    </IconButton>
                    <TextField size="small" defaultValue={1} style={{ width: "40px" }} />
                    <IconButton size="small">
                      <Add fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell align="right">SAR 2,750.00</TableCell>
                <TableCell align="right">SAR 2,750.00</TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Product name 1</TableCell>
                <TableCell align="center">
                  <Box display="flex" alignItems="center" justifyContent="center">
                    <IconButton size="small">
                      <Remove fontSize="small" />
                    </IconButton>
                    <TextField size="small" defaultValue={1} style={{ width: "40px" }} />
                    <IconButton size="small">
                      <Add fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell align="right">SAR 7,520.00</TableCell>
                <TableCell align="right">SAR 7,520.00</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          {/* Add Line + Total */}
          <Box
            mt={1}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Button variant="outlined" size="small">
              + Add Line
            </Button>
            <Box textAlign="right">
              <Typography variant="caption">TOTAL AMOUNT:</Typography>
              <Typography variant="subtitle1" fontWeight="bold">
                SAR 19,570.00
              </Typography>
            </Box>
          </Box>

          {/* Footer Row with QR + Link + Signature */}
          <Box
            mt={2}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            {/* Left - QR Code */}
            <Box>
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=Invoice88462137"
                alt="QR Code"
                style={{ borderRadius: "6px" }}
              />
            </Box>

            {/* Middle - Link */}
            <Link
              href="https://suhalat-invoices.com/pay/88462137"
              target="_blank"
              rel="noopener"
              underline="hover"
              color="primary"
              fontSize="0.9rem"
            >
              https://suhalat-invoices.com/pay/88462137
            </Link>

            {/* Right - Signature / Text */}
            <Typography variant="caption" color="textSecondary">
              Authorized Signature
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
}
