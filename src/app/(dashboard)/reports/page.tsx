"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Grid,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Download as DownloadIcon } from "@mui/icons-material";

// Dummy Data
const salesData = [
  { id: 1, type: "Sale", date: "2025-09-01", amount: 1200 },
  { id: 2, type: "Purchase", date: "2025-09-02", amount: 800 },
  { id: 3, type: "Sale", date: "2025-09-05", amount: 500 },
  { id: 4, type: "Purchase", date: "2025-09-10", amount: 300 },
];

export default function ReportsPage() {
  const [reportType, setReportType] = useState("Sales");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Filter data based on type + date range
  const filteredData = salesData.filter((row) => {
    const matchType =
      reportType === "All" || row.type.toLowerCase() === reportType.toLowerCase();
    const matchStart = !startDate || row.date >= startDate;
    const matchEnd = !endDate || row.date <= endDate;
    return matchType && matchStart && matchEnd;
  });

  // Download CSV
  const handleDownload = () => {
    const headers = ["ID", "Type", "Date", "Amount"];
    const csvRows = [
      headers.join(","),
      ...filteredData.map((row) => [row.id, row.type, row.date, row.amount].join(",")),
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${reportType}_report.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Reports
      </Typography>

      {/* Filter Section */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4} md={3}>
            <TextField
              select
              label="Report Type"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              fullWidth
              size="small"
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Sales">Sales</MenuItem>
              <MenuItem value="Purchase">Purchases</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={4} md={3}>
            <TextField
              type="date"
              label="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={3}>
            <TextField
              type="date"
              label="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={3} display="flex" alignItems="center">
            <Button
              variant="contained"
              color="primary"
              fullWidth
              startIcon={<DownloadIcon />}
              onClick={handleDownload}
            >
              Download
            </Button>
          </Grid>
        </Grid>
      </Paper>

   
      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Preview Data
        </Typography>
        {filteredData.length > 0 ? (
          <Box component="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: "8px" }}>
                  ID
                </th>
                <th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: "8px" }}>
                  Type
                </th>
                <th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: "8px" }}>
                  Date
                </th>
                <th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: "8px" }}>
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row) => (
                <tr key={row.id}>
                  <td style={{ padding: "8px" }}>{row.id}</td>
                  <td style={{ padding: "8px" }}>{row.type}</td>
                  <td style={{ padding: "8px" }}>{row.date}</td>
                  <td style={{ padding: "8px" }}>{row.amount}</td>
                </tr>
              ))}
            </tbody>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No data available for selected filters.
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
